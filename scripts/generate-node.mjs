#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const toPascal = (s) => s.replace(/(^|[_\-\s])+(.)/g, (_, __, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
const toCamel = (s) => { const p = toPascal(s); return p.charAt(0).toLowerCase() + p.slice(1); };

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });
const writeFileIfAbsent = (target, content, force = false) => {
  ensureDir(path.dirname(target));
  if (fs.existsSync(target) && !force) {
    console.log(`SKIP (exists): ${target}`);
    return;
  }
  fs.writeFileSync(target, content, 'utf8');
  console.log(`${fs.existsSync(target) ? 'UPDATE' : 'WRITE'}: ${target}`);
};

function descriptionTemplate(spec) {
  const { resource, operations, fieldsByOperation = {} } = spec;
  const opOptions = Object.keys(operations).map((op) => `      { name: '${operations[op].label ?? toPascal(op)}', value: '${op}' }`).join(',\n');

  const fieldsBlocks = Object.entries(fieldsByOperation).map(([op, fields]) => {
    const createFields = fields.map((f) => {
      const base = [
        `    createField({`,
        `      displayName: '${f.displayName}',`,
        `      name: '${f.name}',`,
        `      type: '${f.type}',`,
      ];
      if (f.description) base.push(`      description: '${f.description.replace(/'/g, "\\'")}',`);
      if (f.default !== undefined) base.push(`      default: ${JSON.stringify(f.default)},`);
      if (f.required) base.push(`      required: true,`);
      if (f.typeOptions) base.push(`      typeOptions: ${JSON.stringify(f.typeOptions)},`);
      if (Array.isArray(f.optionsList)) base.push(`      optionsList: ${JSON.stringify(f.optionsList)},`);
      base.push(`      resource: '${resource}',`);
      base.push(`      operations: ['${op}'],`);
      if (f.modes) base.push(`      modes: ${JSON.stringify(f.modes)},`);
      base.push(`    }),`);
      return base.join('\n');
    }).join('\n');

    return `  // === ${op} fields ===\n${createFields}\n`;
  }).join('\n');

  return `import { INodeProperties } from 'n8n-workflow';
import { createField } from '../descriptions/common/fields';

export const ${toCamel(resource)}Operations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: '${resource}',
    default: '${spec.defaultOperation ?? Object.keys(operations)[0]}',
    optionsList: [
${opOptions}
    ],
  }),
];

export const ${toCamel(resource)}Fields: INodeProperties[] = [
${fieldsBlocks}
];
`;
}

function handlerTemplate(spec, op) {
  const { resource, basePath = `/${resource}s`, idType = 'number' } = spec;
  const o = spec.operations[op];
  let fnName;
  if (op === 'getAll') {
    fnName = 'getAll' + toPascal(resource) + 's';
  } else if (op === 'getById') {
    fnName = 'get' + toPascal(resource) + 'ById';
  } else {
    fnName = op + toPascal(resource);
  }
  const idParamName = o.idParamName ?? `${resource}Id`;
  const readId = o.path?.includes('{id}') ? (
    idType === 'guid'
      ? `  const rawId = this.getNodeParameter('${idParamName}', index) as any;
  const id = extractStringId(rawId, '${toPascal(resource)} ID');
  ensureGuid(id);`
      : `  const rawId = this.getNodeParameter('${idParamName}', index) as any;
  const id = extractNumericId(rawId, '${toPascal(resource)} ID');
  ensureId(id);`
  ) : '';

  const qsDefs = (o.qs ?? []).map(q => {
    const [name, typingDefault] = q.split('=');
    const [field, typingRaw] = name.split(':');
    const typing = (typingRaw || 'string').trim();
    const defVal = typingDefault !== undefined ? JSON.parse(typingDefault) : (typing === 'number' ? 0 : typing === 'boolean' ? false : '');
    return { field, typing, defVal };
  });

  const qsRead = qsDefs.map(({ field, typing, defVal }) =>
    `  const ${field} = this.getNodeParameter('${field}', index, ${JSON.stringify(defVal)}) as ${typing};`
  ).join('\n');

  const buildQs = qsDefs.map(({ field, typing }) => {
    if (field === 'include') return `  if (Array.isArray(include) && include.length > 0) qs.include = include.join(',');`;
    if (field === 'startingAfter') return `  if (startingAfter && Number(startingAfter) > 0) qs.startingAfter = startingAfter;`;
    if (typing === 'number' || typing === 'boolean') {
      return `  if (${field} !== undefined && ${field} !== null) qs.${field} = ${field};`;
    }
    return `  if (${field}) qs.${field} = ${field};`;
  }).join('\n');

  const bodyRead = (o.body ?? []).map(f => {
    const [name, typingDefault] = f.split('=');
    const [field, typingRaw] = name.split(':');
    const typing = (typingRaw || 'string').trim();
    const defVal = typingDefault !== undefined ? JSON.parse(typingDefault) : (typing === 'number' ? 0 : typing === 'boolean' ? false : (typing === 'json' ? {} : ''));
    return `  const ${field} = this.getNodeParameter('${field}', index, ${JSON.stringify(defVal)}) as ${typing === 'json' ? 'any' : typing};`;
  }).join('\n');

  const bodyAssignsEntries = (o.body ?? []).map(f => f.split(':')[0]).map(field => `    ${toPascal(field)}: ${field},`).join('\n');
  const bodyBlock = (o.body ?? []).length
    ? `  const body: Record<string, any> = {\n${bodyAssignsEntries}\n  };`
    : `  const body: Record<string, any> = {};`;

  const pathExpr = o.path?.includes('{id}') ? `\`${o.path.replace('{id}', '${id}')}\`` : `\`${o.path}\``;
  const endpointExpr = o.path?.startsWith('/') ? pathExpr : `\`${basePath}${o.path}\``;

  const imports = [
    `import { IExecuteFunctions } from 'n8n-workflow';`,
    `import { apiRequest } from '../../helpers/apiRequest';`,
  ];
  if (readId) {
    if (spec.idType === 'guid') imports.push(`import { ensureGuid, extractStringId } from '../../helpers/validation';`);
    else imports.push(`import { ensureId, extractNumericId } from '../../helpers/validation';`);
  }

  return `${imports.join('\n')}

export async function ${fnName}(this: IExecuteFunctions, index: number) {
${readId}
${qsRead}
${bodyRead}

  const qs: Record<string, any> = {};
${buildQs}

${bodyBlock}

  const response = await apiRequest.call(this, '${o.method}', ${endpointExpr}, body, qs);

  ${op === 'getAll' ? `return {
    items: response?.data ?? response ?? [],
    pagination: {
      page: (qs as any)?.page ?? undefined,
      limit: (qs as any)?.limit ?? undefined,
      total: response?.total ?? null,
    },
  };` : `return response;`}
}
`;
}

function loaderTemplate(loaderSpec) {
  const { resource, endpoint, value, labelExpr, itemsPath } = loaderSpec;
  const cap = toPascal(resource);
  return `import {
  ILoadOptionsFunctions,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';
import { extractArray } from '../../../helpers/response.convert';
import { loadDropdown, searchResourceLocator } from '../../../helpers/searchHelper';

async function fetch${cap}s(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await apiRequest.call(this, 'GET', '${endpoint}', {}, { page: 1, limit: 200 });
  const items: any[] = extractArray(response, '${itemsPath || resource + 's'}');

  return items
    .map((it: any) => ({
      name: ${labelExpr},
      value: it?.${value} ?? it?.id,
    }))
    .filter((option) => option.value !== undefined && option.value !== null && option.value !== '');
}

export async function load${cap}sForDropdown(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  return loadDropdown.call(this, fetch${cap}s);
}

export async function search${cap}sForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodeListSearchResult> {
  return searchResourceLocator.call(this, fetch${cap}s, filter);
}
`;
}

if (process.argv.length < 3) {
  console.error('Usage: node scripts/generate-node.mjs path/to/spec.json [--force]');
  process.exit(1);
}

const specPath = path.resolve(process.argv[2]);
const force = process.argv.includes('--force');
if (!fs.existsSync(specPath)) {
  console.error(`Spec not found: ${specPath}`);
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const resource = spec.resource;
if (!resource) {
  console.error('Spec must include "resource"');
  process.exit(1);
}

const descTarget = path.resolve(`nodes/MyApi/descriptions/${resource}.descriptions.ts`);
writeFileIfAbsent(descTarget, descriptionTemplate(spec), force);

Object.keys(spec.operations || {}).forEach((op) => {
  const target = path.resolve(`nodes/MyApi/resources/${resource}/${resource}.${op}.ts`);
  writeFileIfAbsent(target, handlerTemplate(spec, op), force);
});

if (spec.loader) {
  const loaderTarget = path.resolve(`nodes/MyApi/resources/${resource}/load/${resource}.load.ts`);
  writeFileIfAbsent(loaderTarget, loaderTemplate({ resource, ...spec.loader }), force);
}

console.log('\nNext steps (wire-up MyApi.node.ts):');
console.log(`- Import descriptions: import { ${toCamel(resource)}Operations, ${toCamel(resource)}Fields } from './descriptions/${resource}.descriptions';`);
console.log(`- Spread into properties: ...${toCamel(resource)}Operations, ...${toCamel(resource)}Fields`);
console.log(`- Add resource option: { name: '${toPascal(resource)}', value: '${resource}' }`);
console.log(`- Import handlers and add execute switch cases for: ${Object.keys(spec.operations || {}).join(', ')}`);
if (spec.loader) {
  console.log(`- Import loader and register listSearch/loadOptions as needed`);
}
console.log('Done.');


