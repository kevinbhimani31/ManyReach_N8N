#!/usr/bin/env node
/**
 * gen-resources.mjs
 * First of three generators: creates/updates resource handler files under nodes/MyApi/resources
 *
 * Inputs (snippets/):
 *  - resource.json: { resource: "tag", basePath: "/tags", operations: "create|getAll|..." }
 *  - controller.cs: Used for HTTP verb inference when possible (optional for this step)
 *  - inputs.cs: DTOs for request bodies (e.g., Api2TagCreate) to shape create/update bodies
 *  - relations.json: If enabled, generates load/ files (skipped when enabled=false)
 *
 * Output:
 *  - nodes/MyApi/resources/<resource>/<resource>.<operation>.ts files
 *  - nodes/MyApi/resources/<resource>/load/<resource>.load.ts if relations.enabled = true and resource has relations
 *
 * Usage:
 *  node scripts/gen-resources.mjs [--snippets=snippets] [--root=nodes/MyApi/resources] [--force]
 */
import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const args = { snippets: 'snippets', root: 'nodes/MyApi/resources', force: false };
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--snippets=')) args.snippets = arg.split('=')[1];
    else if (arg.startsWith('--root=')) args.root = arg.split('=')[1];
    else if (arg === '--force') args.force = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/gen-resources.mjs [--snippets=snippets] [--root=nodes/MyApi/resources] [--force]
Creates or updates resource handler files based on snippets/resource.json and inputs.cs.
`);
      process.exit(0);
    }
  }
  return args;
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function readJsonSafe(filePath, fallback = undefined) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(txt);
  } catch {
    return fallback;
  }
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileIfChanged(filePath, content, force = false) {
  if (fs.existsSync(filePath)) {
    if (!force) {
      const current = fs.readFileSync(filePath, 'utf8');
      if (current === content) return { written: false, reason: 'unchanged' };
    }
  } else {
    ensureDir(path.dirname(filePath));
  }
  fs.writeFileSync(filePath, content, 'utf8');
  return { written: true };
}

function toPascalCase(str) {
  return (str || '')
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (m) => m.toUpperCase());
}
function toCamelCase(str) {
  const p = toPascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function normalizeOperations(ops) {
  if (!ops) return [];
  if (Array.isArray(ops)) return ops.map((s) => s.trim()).filter(Boolean);
  return String(ops)
    .split(/[,\s|]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseDtoProperties(inputsCs, className) {
  if (!inputsCs || !className) return [];
  // naive C# property parser for: public <type> <Name> { get; set; }
  const clsRe = new RegExp(`class\\s+${className}\\s*\\{([\\s\\S]*?)\\}`, 'm');
  const clsMatch = inputsCs.match(clsRe);
  if (!clsMatch) return [];
  const body = clsMatch[1];
  const propRe = /public\s+[A-Za-z0-9_<>,\[\]\?]+\s+([A-Za-z0-9_]+)\s*\{\s*get;\s*set;\s*\}/g;
  const props = [];
  let m;
  while ((m = propRe.exec(body))) {
    props.push(m[1]);
  }
  return props;
}

function handlerTemplate({ resource, basePath, operation, dtoProps }) {
  const Resource = toPascalCase(resource);
  const resourceLower = resource.toLowerCase();
  const fnName =
    operation === 'getAll'
      ? `getAll${Resource}${Resource.endsWith('s') ? '' : 's'}`
      : operation === 'getById'
      ? `get${Resource}ById`
      : operation === 'delete'
      ? `delete${Resource}`
      : `${operation}${Resource}`;

  // Imports needed
  const importLines = [
    `import { IExecuteFunctions } from 'n8n-workflow';`,
    `import { apiRequest } from '../../helpers/apiRequest';`,
  ];

  let bodyBlock = '';
  let qsBlock = 'const qs: any = {};\n';
  let method = 'GET';
  let urlExpr = `'${basePath}'`;

  if (operation === 'getAll') {
    method = 'GET';
    urlExpr = `'${basePath}'`;
  } else if (operation === 'getById') {
    method = 'GET';
    urlExpr = '`' + basePath + '/${id}`';
    bodyBlock += `const id = this.getNodeParameter('${resourceLower}Id', i) as string | number;\n`;
  } else if (operation === 'delete') {
    method = 'DELETE';
    urlExpr = '`' + basePath + '/${id}`';
    bodyBlock += `const id = this.getNodeParameter('${resourceLower}Id', i) as string | number;\n`;
  } else if (operation === 'create' || operation === 'update') {
    method = operation === 'create' ? 'POST' : 'PUT';
    urlExpr =
      operation === 'create' ? `'${basePath}'` : '`' + basePath + '/${id}`';
    if (operation === 'update') {
      bodyBlock += `const id = this.getNodeParameter('${resourceLower}Id', i) as string | number;\n`;
    }
    const lines = [];
    for (const p of dtoProps || []) {
      // default missing to empty string for optional-ish fields
      lines.push(
        `const ${p} = this.getNodeParameter('${p}', i, undefined) as any;`,
      );
    }
    bodyBlock += lines.join('\n') + (lines.length ? '\n' : '');
    bodyBlock += `const body: any = { ${dtoProps.join(', ')} };\n`;
  } else {
    // fallback: treat as POST without body
    method = 'POST';
    urlExpr = `'${basePath}/${operation}'`;
  }

  const callLine = `const response = await apiRequest.call(this, '${method}', ${urlExpr}, ${operation === 'create' || operation === 'update' ? 'body' : '{}'}, qs);`;

  return `import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function ${fnName}(this: IExecuteFunctions, i: number): Promise<any> {
  ${bodyBlock}${qsBlock}${callLine}
  return response;
}
`;
}

function loaderTemplate({ resource, listEndpoint, itemsPath, valueKey, labelExpr }) {
  const Resource = toPascalCase(resource);
  const resourceLower = resource.toLowerCase();
  const loadFn = `load${Resource}sForDropdown`;
  const searchFn = `search${Resource}sForResourceLocator`;
  const fetchFn = `fetch${Resource}s`;
  return `import {
  ILoadOptionsFunctions,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';

async function ${fetchFn}(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '${listEndpoint}', {}, { page: 1, limit: 200 });
  const items: any[] = extractArray(response, '${itemsPath}');
  return items
    .map((it: any) => ({
      name: ${labelExpr},
      value: it?.${valueKey} ?? it?.id,
    }))
    .filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function ${loadFn}(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return loadDropdown.call(this, ${fetchFn});
}

export async function ${searchFn}(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  return searchResourceLocator.call(this, ${fetchFn}, filter);
}
`;
}

function inferDtoNameForOperation(resource, operation) {
  const Resource = toPascalCase(resource);
  if (operation === 'create') return `Api2${Resource}Create`;
  if (operation === 'update') return `Api2${Resource}Update`;
  return undefined;
}

async function main() {
  const args = parseArgs(process.argv);
  const snippetsDir = path.resolve(args.snippets);
  const rootOut = path.resolve(args.root);

  const resourceSpecPath = path.join(snippetsDir, 'resource.json');
  const controllerPath = path.join(snippetsDir, 'controller.cs');
  const inputsPath = path.join(snippetsDir, 'inputs.cs');
  const relationsPath = path.join(snippetsDir, 'relations.json');

  const spec = readJsonSafe(resourceSpecPath);
  if (!spec || !spec.resource || !spec.basePath || !spec.operations) {
    console.error(`ERROR: snippets/resource.json must include resource, basePath, operations`);
    process.exit(1);
  }
  const resource = String(spec.resource).trim();
  const basePath = String(spec.basePath).trim();
  const operations = normalizeOperations(spec.operations);

  const inputsCs = readFileSafe(inputsPath);
  const relations = readJsonSafe(relationsPath, { enabled: false, relations: [] });

  const resourceDir = path.join(rootOut, resource.toLowerCase());
  ensureDir(resourceDir);

  // Generate handler files for each operation
  for (const op of operations) {
    let dtoProps = [];
    const dtoName = inferDtoNameForOperation(resource, op);
    if (dtoName) {
      dtoProps = parseDtoProperties(inputsCs, dtoName);
    }
    const fileName = `${resource.toLowerCase()}.${op}.ts`;
    const filePath = path.join(resourceDir, fileName);
    const content = handlerTemplate({
      resource,
      basePath,
      operation: op,
      dtoProps,
    });
    const { written, reason } = writeFileIfChanged(filePath, content, args.force);
    console.log(`${written ? 'Wrote' : 'Skipped'} ${path.relative(process.cwd(), filePath)}${reason ? ` (${reason})` : ''}`);
  }

  // Conditionally generate loader file(s) if relations.enabled
  if (relations && relations.enabled) {
    const relevant = (relations.relations || []).filter((r) => String(r.resource).toLowerCase() === resource.toLowerCase());
    if (relevant.length > 0) {
      const rel = relevant[0];
      // Validate minimal keys
      const listEndpoint = rel.listEndpoint || basePath;
      const itemsPath = rel.itemsPath || `${resource.toLowerCase()}s`;
      const valueKey = rel.valueKey || `${resource.toLowerCase()}Id`;
      const labelExpr = rel.labelExpr || `String(it?.${valueKey} ?? it?.id ?? '')`;

      const loadDir = path.join(resourceDir, 'load');
      ensureDir(loadDir);
      const loaderPath = path.join(loadDir, `${resource.toLowerCase()}.load.ts`);
      const loaderContent = loaderTemplate({
        resource,
        listEndpoint,
        itemsPath,
        valueKey,
        labelExpr,
      });
      const { written, reason } = writeFileIfChanged(loaderPath, loaderContent, args.force);
      console.log(`${written ? 'Wrote' : 'Skipped'} ${path.relative(process.cwd(), loaderPath)}${reason ? ` (${reason})` : ''}`);
    }
  } else {
    // relations disabled; no loader generated
  }

  console.log('Done (resources).');
}

main().catch((err) => {
  console.error('Generator failed:', err?.stack || err?.message || String(err));
  process.exit(1);
});


