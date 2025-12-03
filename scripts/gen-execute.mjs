#!/usr/bin/env node
/**
 * gen-execute.mjs
 * Third of three generators: creates/updates execute files and wires MyApi.node.ts
 *
 * Inputs (snippets/):
 *  - resource.json: { resource: "tag", basePath: "/tags", operations: "create|getAll|..." }
 * Output:
 *  - nodes/MyApi/execute/<resource>.exec.ts
 *  - Wires nodes/MyApi/MyApi.node.ts:
 *      - import { execute<Resource> } from './execute/<resource>.exec';
 *      - import descriptions and spread into properties
 *      - add Resource option if missing
 *      - add dispatch: else if (resource === '<resource>') { data = await execute<Resource>.call(this, operation, i); }
 *      - if loader file exists: import its functions and register in methods.loadOptions/listSearch
 *
 * Usage:
 *  node scripts/gen-execute.mjs [--snippets=snippets] [--execRoot=nodes/MyApi/execute] [--nodePath=nodes/MyApi/MyApi.node.ts] [--force]
 */
import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const args = {
    snippets: 'snippets',
    execRoot: 'nodes/MyApi/execute',
    nodePath: 'nodes/MyApi/MyApi.node.ts',
    resourcesRoot: 'nodes/MyApi/resources',
    descRoot: 'nodes/MyApi/descriptions',
    force: false,
  };
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--snippets=')) args.snippets = arg.split('=')[1];
    else if (arg.startsWith('--execRoot=')) args.execRoot = arg.split('=')[1];
    else if (arg.startsWith('--nodePath=')) args.nodePath = arg.split('=')[1];
    else if (arg.startsWith('--resourcesRoot=')) args.resourcesRoot = arg.split('=')[1];
    else if (arg.startsWith('--descRoot=')) args.descRoot = arg.split('=')[1];
    else if (arg === '--force') args.force = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/gen-execute.mjs [--snippets=snippets] [--execRoot=nodes/MyApi/execute] [--nodePath=nodes/MyApi/MyApi.node.ts] [--force]`);
      process.exit(0);
    }
  }
  return args;
}

function readJsonSafe(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return null; }
}
function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}
function toPascal(str) {
  return (str || '').replace(/(^|[_\-\s])+(.)/g, (_, __, c) => (c || '').toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
}
function normalizeOperations(ops) {
  if (!ops) return [];
  if (Array.isArray(ops)) return ops.map((s) => String(s).trim()).filter(Boolean);
  return String(ops).split(/[,\s|]+/g).map((s) => s.trim()).filter(Boolean);
}
function writeFileIfChanged(filePath, content, force) {
  ensureDir(path.dirname(filePath));
  if (fs.existsSync(filePath) && !force) {
    const cur = fs.readFileSync(filePath, 'utf8');
    if (cur === content) return { written: false, reason: 'unchanged' };
  }
  fs.writeFileSync(filePath, content, 'utf8');
  return { written: true };
}

function buildExecFile(resource, operations) {
  const Resource = toPascal(resource);
  const importLines = operations.map((op) => {
    let fn;
    if (op === 'getAll') fn = `getAll${Resource}${Resource.endsWith('s') ? '' : 's'}`;
    else if (op === 'getById') fn = `get${Resource}ById`;
    else if (op === 'delete') fn = `delete${Resource}`;
    else fn = `${op}${Resource}`;
    return `import { ${fn} } from '../resources/${resource}/${resource}.${op}';`;
  }).join('\n');
  const cases = operations.map((op) => {
    let fn;
    if (op === 'getAll') fn = `getAll${Resource}${Resource.endsWith('s') ? '' : 's'}`;
    else if (op === 'getById') fn = `get${Resource}ById`;
    else if (op === 'delete') fn = `delete${Resource}`;
    else fn = `${op}${Resource}`;
    return `    case '${op}':
      return await ${fn}.call(this, i);`;
  }).join('\n');
  return `import { IExecuteFunctions } from 'n8n-workflow';
${importLines}

export async function execute${Resource}(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
${cases}
    default:
      throw new Error(\`Operation "\${operation}" not supported for ${Resource}\`);
  }
}
`;
}

function updateMyApiNode({
  nodePath,
  resource,
  hasLoader,
  descRoot,
  resourcesRoot,
}) {
  let content = fs.readFileSync(nodePath, 'utf8');
  const Resource = toPascal(resource);
  // 1) import descriptions if missing
  const descImport = `import { ${resource}Operations, ${resource}Fields } from './descriptions/${resource}.descriptions';`;
  if (!content.includes(descImport)) {
    const marker = `// Import reusable descriptions`;
    if (content.includes(marker)) {
      content = content.replace(marker, `${marker}\n${descImport}`);
    } else {
      // prepend
      content = `${descImport}\n` + content;
    }
  }
  // 2) ensure properties spreads (...<resource>Operations, ...<resource>Fields)
  const propsArrayRe = /properties:\s*\[([\s\S]*?)\]\s*,\s*\n\s*\};/m;
  const mProps = content.match(propsArrayRe);
  if (mProps) {
    let inner = mProps[1];
    const tokenOps = `...${resource}Operations`;
    const tokenFields = `...${resource}Fields`;
    if (!inner.includes(tokenOps)) inner = inner.replace(/(\.\.\.senderFields,?)/, `$1\n\n      ${tokenOps},`);
    if (!inner.includes(tokenFields)) inner = inner.replace(/(\.\.\.${resource}Operations,?)/, `$1\n      ${tokenFields},`);
    // if still missing tokens, append near the end before workspace/sequence or at end
    if (!inner.includes(tokenOps)) inner = inner.replace(/(\.\.\.sequenceFields)/, `${tokenOps},\n      $1`);
    if (!inner.includes(tokenFields)) inner = inner.replace(/(\.\.\.sequenceFields)/, `${tokenFields},\n      $1`);
    content = content.replace(mProps[0], `properties: [${inner}]\n    ],`);
  }
  // 3) add resource option if missing
  const optionsBlockRe = /name:\s*'resource'[\s\S]*?options:\s*\[([\s\S]*?)\]/m;
  const mOpt = content.match(optionsBlockRe);
  if (mOpt) {
    let inner = mOpt[1];
    const optionEntry = `{ name: '${Resource}', value: '${resource}' }`;
    if (!inner.includes(`value: '${resource}'`)) {
      inner = inner.replace(/\]\s*$/, `  ${optionEntry},\n        ]`);
      content = content.replace(mOpt[0], mOpt[0].replace(mOpt[1], inner));
    }
  }
  // 4) import execute<Resource> if missing
  const execImport = `import { execute${Resource} } from './execute/${resource}.exec';`;
  if (!content.includes(execImport)) {
    const marker = `// List controller`;
    if (content.includes(marker)) {
      content = content.replace(marker, `${execImport}\n${marker}`);
    } else {
      // append after other execute imports if possible
      const execBlock = /import\s+\{\s*execute[A-Za-z0-9_,\s]*\}\s+from\s+'\.\/execute\/[a-z]+';?/m;
      if (execBlock.test(content)) {
        content = content.replace(execBlock, (m) => `${m}\n${execImport}`);
      } else {
        content = content.replace(/(import[^\n;]*;[\r\n]+)/, `$1${execImport}\n`);
      }
    }
  }
  // 5) add dispatch else-if for resource
  const dispatchStart = /\/\/ Dispatch to per-resource executors/;
  if (dispatchStart.test(content)) {
    const dispatchBlockRe = /(\/\/ Dispatch to per-resource executors[\s\S]*?)returnData\.push/m;
    const dMatch = content.match(dispatchBlockRe);
    if (dMatch && !dMatch[1].includes(`resource === '${resource}'`)) {
      content = content.replace(
        /(\}\s+else\s+\{\s*throw new Error\(`Resource "\$\{resource\}" not supported`\);\s*\}\s*)/,
        `} else if (resource === '${resource}') {\n          data = await execute${Resource}.call(this, operation, i);\n        }\n        $1`,
      );
    }
  }
  // 6) loader imports and registration (only if loader file exists)
  if (hasLoader) {
    const loaderImport = `import { load${Resource}sForDropdown, search${Resource}sForResourceLocator } from './resources/${resource}/load/${resource}.load';`;
    if (!content.includes(loaderImport)) {
      const lcMarker = `// List controller`;
      if (content.includes(lcMarker)) {
        content = content.replace(lcMarker, `${lcMarker}\n${loaderImport}`);
      } else {
        content = loaderImport + '\n' + content;
      }
    }
    // methods.loadOptions key
    const loadOptionsRe = /loadOptions:\s*\{([\s\S]*?)\},/m;
    const lo = content.match(loadOptionsRe);
    if (lo && !lo[1].includes(`get${Resource}s:`)) {
      content = content.replace(loadOptionsRe, (m, inner) => {
        const added = inner.trim().length ? `${inner}\n      get${Resource}s: load${Resource}sForDropdown,` : `get${Resource}s: load${Resource}sForDropdown,`;
        return `loadOptions: {\n${added}\n    },`;
      });
    }
    // methods.listSearch key
    const listSearchRe = /listSearch:\s*\{([\s\S]*?)\},/m;
    const ls = content.match(listSearchRe);
    if (ls && !ls[1].includes(`search${Resource}s:`)) {
      content = content.replace(listSearchRe, (m, inner) => {
        const added = inner.trim().length ? `${inner}\n      search${Resource}s: search${Resource}sForResourceLocator,` : `search${Resource}s: search${Resource}sForResourceLocator,`;
        return `listSearch: {\n${added}\n    },`;
      });
    }
  }
  fs.writeFileSync(nodePath, content, 'utf8');
  console.log('Patched MyApi.node.ts');
}

async function main() {
  const args = parseArgs(process.argv);
  const resourceSpecPath = path.resolve(args.snippets, 'resource.json');
  const spec = readJsonSafe(resourceSpecPath);
  if (!spec || !spec.resource || !spec.operations) {
    console.error('ERROR: snippets/resource.json must include resource and operations');
    process.exit(1);
  }
  const resource = String(spec.resource).toLowerCase();
  const ops = normalizeOperations(spec.operations);
  if (ops.length === 0) {
    console.error('No operations specified');
    process.exit(1);
  }

  // 1) write execute file
  const execDir = path.resolve(args.execRoot);
  ensureDir(execDir);
  const execPath = path.join(execDir, `${resource}.exec.ts`);
  const execContent = buildExecFile(resource, ops);
  const { written: wroteExec, reason } = writeFileIfChanged(execPath, execContent, args.force);
  console.log(`${wroteExec ? 'Wrote' : 'Skipped'} ${path.relative(process.cwd(), execPath)}${reason ? ` (${reason})` : ''}`);

  // 2) detect loader presence
  const loaderPath = path.resolve(args.resourcesRoot, resource, 'load', `${resource}.load.ts`);
  const hasLoader = fs.existsSync(loaderPath);

  // 3) patch MyApi.node.ts
  const nodePath = path.resolve(args.nodePath);
  if (!fs.existsSync(nodePath)) {
    console.warn('WARN: MyApi.node.ts not found; skipping wiring');
  } else {
    updateMyApiNode({
      nodePath,
      resource,
      hasLoader,
      descRoot: args.descRoot,
      resourcesRoot: args.resourcesRoot,
    });
  }

  console.log('Done (execute wiring).');
}

main().catch((err) => {
  console.error('Generator failed:', err?.stack || err?.message || String(err));
  process.exit(1);
});


