#!/usr/bin/env node
/**
 * gen-descriptions.mjs
 * Second of three generators: creates/updates description files under nodes/MyApi/descriptions
 *
 * Inputs (snippets/):
 *  - resource.json: { resource: "tag", basePath: "/tags", operations: "create|getAll|..." }
 *  - inputs.cs: DTOs for request bodies to derive fields for create/update
 *
 * Output:
 *  - nodes/MyApi/descriptions/<resource>/<op>.fields.ts (per-operation fields files)
 *  - nodes/MyApi/descriptions/<resource>.descriptions.ts (aggregator that imports per-op fields and spreads them)
 *
 * Note:
 *  - Aggregator contains only the Operation selector via createField and spreads of per-op arrays.
 *  - No inline createField field definitions inside aggregator.
 *
 * Usage:
 *  node scripts/gen-descriptions.mjs [--snippets=snippets] [--root=nodes/MyApi/descriptions] [--force]
 */
import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const args = { snippets: 'snippets', root: 'nodes/MyApi/descriptions', force: false };
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--snippets=')) args.snippets = arg.split('=')[1];
    else if (arg.startsWith('--root=')) args.root = arg.split('=')[1];
    else if (arg === '--force') args.force = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/gen-descriptions.mjs [--snippets=snippets] [--root=nodes/MyApi/descriptions] [--force]`);
      process.exit(0);
    }
  }
  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readFileSafe(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return ''; }
}
function readJsonSafe(filePath, fallback = undefined) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return fallback; }
}

function writeFileIfAbsentOrForced(filePath, content, force) {
  ensureDir(path.dirname(filePath));
  if (fs.existsSync(filePath) && !force) {
    return { written: false, reason: 'exists' };
  }
  fs.writeFileSync(filePath, content, 'utf8');
  return { written: true };
}

function writeFileIfChanged(filePath, content, force) {
  ensureDir(path.dirname(filePath));
  if (fs.existsSync(filePath)) {
    if (!force) {
      const current = fs.readFileSync(filePath, 'utf8');
      if (current === content) return { written: false, reason: 'unchanged' };
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  return { written: true };
}

function toPascalCase(str) {
  return (str || '').replace(/(^|[_\-\s])+(.)/g, (_, __, c) => (c || '').toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
}
function toCamelCase(str) {
  const p = toPascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}
function normalizeOperations(ops) {
  if (!ops) return [];
  if (Array.isArray(ops)) return ops.map((s) => String(s).trim()).filter(Boolean);
  return String(ops).split(/[,\s|]+/g).map((s) => s.trim()).filter(Boolean);
}

function parseInputFieldsWithTypes(inputsCs) {
  if (!inputsCs) return {};
  const cleaned = inputsCs.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  // Find classes and their properties
  const classes = {};
  const classRe = /class\s+([A-Za-z0-9_]+)\s*\{([\s\S]*?)\}/g;
  let cm;
  while ((cm = classRe.exec(cleaned))) {
    const className = cm[1];
    const body = cm[2];
    const propRe = /(public|protected|internal)\s+([\w<>?]+)\s+([A-Za-z0-9_]+)\s*\{\s*get;\s*set;\s*\}/g;
    let pm;
    const fields = [];
    while ((pm = propRe.exec(body))) {
      const rawType = pm[2].toLowerCase().replace(/\?$/, '');
      const type =
        rawType.includes('guid') || rawType === 'string' || rawType.includes('date')
          ? 'string'
          : ['int', 'long', 'short', 'float', 'double', 'decimal'].includes(rawType)
          ? 'number'
          : rawType.startsWith('bool')
          ? 'boolean'
          : 'string';
      const name = pm[3];
      fields.push({ name, type, displayName: toPascalCase(name) });
    }
    classes[className] = fields;
  }
  return classes;
}

function buildCreateFieldBlock(field, resource, op) {
  const lines = [];
  lines.push(`  createField({`);
  lines.push(`    displayName: '${(field.displayName || field.name).replace(/'/g, "\\'")}',`);
  lines.push(`    name: '${field.name}',`);
  lines.push(`    type: '${field.type}',`);
  if (field.description) lines.push(`    description: '${String(field.description).replace(/'/g, "\\'")}',`);
  if (field.default !== undefined) lines.push(`    default: ${JSON.stringify(field.default)},`);
  if (field.required) lines.push(`    required: true,`);
  if (field.typeOptions) lines.push(`    typeOptions: ${JSON.stringify(field.typeOptions)},`);
  if (Array.isArray(field.optionsList)) lines.push(`    optionsList: ${JSON.stringify(field.optionsList)},`);
  lines.push(`    resource: '${resource}',`);
  lines.push(`    operations: ['${op}'],`);
  if (field.modes) lines.push(`    modes: ${JSON.stringify(field.modes)},`);
  lines.push(`  }),`);
  return lines.join('\n');
}

function perOpFieldsFileTemplate(resource, op, fields) {
  const exportName = `${resource}${toPascalCase(op)}Fields`;
  const body = (fields || []).map((f) => buildCreateFieldBlock(f, resource, op)).join('\n\n');
  return `import { INodeProperties } from 'n8n-workflow';
import { createField } from '../common/fields';

export const ${exportName}: INodeProperties[] = [
${body}
];
`;
}

function buildFieldsForOperation(resource, op, inputClasses) {
  const lower = resource.toLowerCase();
  if (op === 'getAll') {
    return [
      { displayName: 'Page', name: 'page', type: 'number', default: 1 },
      { displayName: 'Limit', name: 'limit', type: 'number', default: 100 },
    ];
  }
  if (op === 'getById' || op === 'delete' || op === 'update') {
    return [
      {
        displayName: toPascalCase(resource),
        name: `${lower}Id`,
        type: 'resourceLocator',
        description: `Select a ${lower} or enter the ID`,
        modes: [
          {
            displayName: 'From list',
            name: 'list',
            type: 'list',
            typeOptions: { searchListMethod: `search${toPascalCase(resource)}s`, searchable: true, searchFilterRequired: false },
          },
          { displayName: 'By ID', name: 'id', type: 'string' },
        ],
      },
      ...(op === 'update'
        ? (inputClasses[`Api2${toPascalCase(resource)}Update`] || []).map((f) => ({
            displayName: f.displayName || f.name,
            name: f.name,
            type: f.type,
          }))
        : []),
    ];
  }
  if (op === 'create') {
    return (inputClasses[`Api2${toPascalCase(resource)}Create`] || []).map((f) => ({
      displayName: f.displayName || f.name,
      name: f.name,
      type: f.type,
    }));
  }
  // default: no fields
  return [];
}

function aggregatorTemplate(resource, ops) {
  const camel = toCamelCase(resource);
  const imports = ops
    .map((op) => `import { ${resource}${toPascalCase(op)}Fields } from './${resource}/${op}.fields';`)
    .join('\n');
  const optionsList = ops
    .map((op) => `      { name: '${op === 'getAll' ? 'Get All' : op === 'getById' ? 'Get By ID' : toPascalCase(op)}', value: '${op}' }`)
    .join(',\n');
  const spreads = ops.map((op) => `  ...${resource}${toPascalCase(op)}Fields,`).join('\n');
  return `import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';
${imports ? '\n' + imports + '\n' : '\n'}
export const ${resource}Operations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: '${resource}',
    default: '${ops[0] || 'getAll'}',
    optionsList: [
${optionsList}
    ],
  }),
];

export const ${resource}Fields: INodeProperties[] = [
${spreads}
];
`;
}

function patchAggregatorIncremental(content, resource, ops) {
  // Ensure per-op imports
  ops.forEach((op) => {
    const line = `import { ${resource}${toPascalCase(op)}Fields } from './${resource}/${op}.fields';`;
    if (!content.includes(line)) {
      const importBlockMatch = content.match(/(?:^import[^\n;]*;[ \t\r\n]*)+/m);
      if (importBlockMatch) {
        content = content.replace(importBlockMatch[0], importBlockMatch[0] + line + '\n');
      } else {
        content = line + '\n' + content;
      }
    }
  });
  // Ensure optionsList has entries
  const opsMatch = content.match(/optionsList\s*:\s*\[([\s\S]*?)\]/);
  if (opsMatch) {
    let inner = opsMatch[1];
    ops.forEach((op) => {
      if (!inner.includes(`value: '${op}'`)) {
        const label = op === 'getAll' ? 'Get All' : op === 'getById' ? 'Get By ID' : toPascalCase(op);
        inner = `${inner.trim()}\n      { name: '${label}', value: '${op}' },\n`;
      }
    });
    content = content.replace(opsMatch[0], `optionsList: [\n${inner}]`);
  }
  // Ensure spreads include per-op fields
  const fieldsArrayRe = new RegExp(`export\\s+const\\s+${resource}Fields\\s*:\\s*INodeProperties\\[\\]\\s*=\\s*\\[([\\s\\s]*?)\\];`, 'm');
  const arrMatch = content.match(fieldsArrayRe);
  if (arrMatch) {
    let inner = arrMatch[1];
    ops.forEach((op) => {
      const token = `...${resource}${toPascalCase(op)}Fields`;
      if (!inner.includes(token)) {
        inner = `${inner.trim()}\n  ${token},\n`;
      }
    });
    content = content.replace(fieldsArrayRe, `export const ${resource}Fields: INodeProperties[] = [\n${inner}];`);
  } else {
    const spreads = ops.map((op) => `  ...${resource}${toPascalCase(op)}Fields,`).join('\n');
    content += `\n\nexport const ${resource}Fields: INodeProperties[] = [\n${spreads}\n];\n`;
  }
  return content;
}

async function main() {
  const args = parseArgs(process.argv);
  const snippetsDir = path.resolve(args.snippets);
  const outRoot = path.resolve(args.root);

  const spec = readJsonSafe(path.join(snippetsDir, 'resource.json'));
  if (!spec || !spec.resource || !spec.basePath || !spec.operations) {
    console.error('ERROR: snippets/resource.json must include resource, basePath, operations');
    process.exit(1);
  }
  const resource = String(spec.resource).toLowerCase();
  const ops = normalizeOperations(spec.operations);
  if (ops.length === 0) {
    console.error('No operations specified in snippets/resource.json');
    process.exit(1);
  }

  const inputsCs = readFileSafe(path.join(snippetsDir, 'inputs.cs'));
  const inputClasses = parseInputFieldsWithTypes(inputsCs);

  // 1) Write per-op fields files
  const perOpDir = path.join(outRoot, resource);
  ensureDir(perOpDir);
  for (const op of ops) {
    const fields = buildFieldsForOperation(resource, op, inputClasses);
    const content = perOpFieldsFileTemplate(resource, op, fields);
    const filePath = path.join(perOpDir, `${op}.fields.ts`);
    const { written, reason } = writeFileIfChanged(filePath, content, args.force);
    console.log(`${written ? 'Wrote' : 'Skipped'} ${path.relative(process.cwd(), filePath)}${reason ? ` (${reason})` : ''}`);
  }

  // 2) Write or patch aggregator
  const aggPath = path.join(outRoot, `${resource}.descriptions.ts`);
  if (!fs.existsSync(aggPath)) {
    const aggContent = aggregatorTemplate(resource, ops);
    const { written } = writeFileIfAbsentOrForced(aggPath, aggContent, true);
    console.log(`${written ? 'Wrote' : 'Skipped'} ${path.relative(process.cwd(), aggPath)}`);
  } else {
    let content = fs.readFileSync(aggPath, 'utf8');
    content = patchAggregatorIncremental(content, resource, ops);
    const { written, reason } = writeFileIfChanged(aggPath, content, args.force);
    console.log(`${written ? 'Patched' : 'Skipped'} ${path.relative(process.cwd(), aggPath)}${reason ? ` (${reason})` : ''}`);
  }

  console.log('Done (descriptions).');
}

main().catch((err) => {
  console.error('Generator failed:', err?.stack || err?.message || String(err));
  process.exit(1);
});


