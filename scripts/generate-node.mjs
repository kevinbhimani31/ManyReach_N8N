#!/usr/bin/env node
/**
 * generate-node.mjs — clean, robust generator (final corrected)
 *
 * Usage:
 *  node scripts/generate-node.mjs --from-snippets
 *  node scripts/generate-node.mjs --from-cs=path/to/controller.cs [--use-relations]
 *  node scripts/generate-node.mjs path/to/spec.json
 *
 * This version:
 *  - reads snippets/ (resource.json, inputs.cs, relations.json, outputs.cs)
 *  - generates resource handlers (nodes/MyApi/resources/<resource>/<resource>.<op>.ts)
 *  - generates per-op description files (nodes/MyApi/descriptions/<resource>/<op>.fields.ts)
 *  - updates / writes nodes/MyApi/descriptions/<resource>.descriptions.ts (imports + spreads + options)
 *  - writes / updates nodes/MyApi/execute/<resource>.exec.ts (import handlers and switch cases)
 *  - wires nodes/MyApi/MyApi.node.ts (add imports for resource handlers and executor, add resource option,
 *    ensure resource block that calls execute<Resource>.call(this, operation, i) exists)
 *
 * IMPORTANT: This script will NOT insert operation switch/case statements into MyApi.node.ts.
 *           Operation cases live in nodes/MyApi/execute/<resource>.exec.ts
 *
 * Safety:
 *  - Won't overwrite files unless --force provided
 *  - Tries incremental patching; falls back to writing templates
 */

import fs from 'fs';
import path from 'path';

// ---------- CLI utils ----------
const argv = process.argv.slice(2);
const hasArg = (a) => argv.includes(a);
const getArgValue = (prefix) => {
  const arg = argv.find((v) => v.startsWith(prefix + '='));
  return arg ? arg.split('=').slice(1).join('=') : null;
};

const toPascal = (s) => String(s || '')
  .replace(/(^|[_\-\s])+(.)/g, (_, __, c) => (c || '').toUpperCase())
  .replace(/[^a-zA-Z0-9]/g, '');
const toCamel = (s) => { const p = toPascal(s); return p.charAt(0).toLowerCase() + p.slice(1); };

const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });
const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, 'utf8');
const write = (p, data) => { ensureDir(path.dirname(p)); fs.writeFileSync(p, data, 'utf8'); };
const forceFlag = argv.includes('--force');

// safe write: skip if exists and not forced
function writeFileIfAbsent(target, content, force = false) {
  ensureDir(path.dirname(target));
  if (exists(target) && !force) {
    console.log(`SKIP (exists): ${target}`);
    return false;
  }
  fs.writeFileSync(target, content, 'utf8');
  console.log(`${force ? 'FORCE' : 'WRITE'}: ${target}`);
  return true;
}

function safeJsonParse(txt) {
  try { return JSON.parse(txt); } catch (e) { return null; }
}

// ---------- templates ----------
function descriptionTemplate(spec) {
  const { resource, operations, fieldsByOperation = {} } = spec;
  const ops = Object.keys(operations || {});
  const opOptions = ops.map((op) => `      { name: '${(operations[op].label) || toPascal(op)}', value: '${op}' }`).join(',\n');

  const fieldsBlocks = ops.map((op) => {
    const defs = fieldsByOperation?.[op] || [];
    const createFields = defs.map((f) => {
      const lines = [];
      lines.push(`  // === ${op} fields ===`);
      lines.push(`  createField({`);
      lines.push(`    displayName: '${(f.displayName || f.name).replace(/'/g, "\\'")}',`);
      lines.push(`    name: '${f.name}',`);
      lines.push(`    type: '${f.type}',`);
      if (f.description) lines.push(`    description: '${String(f.description).replace(/'/g, "\\'")}',`);
      if (f.default !== undefined) lines.push(`    default: ${JSON.stringify(f.default)},`);
      if (f.required) lines.push(`    required: true,`);
      if (f.typeOptions) lines.push(`    typeOptions: ${JSON.stringify(f.typeOptions)},`);
      if (Array.isArray(f.optionsList)) lines.push(`    optionsList: ${JSON.stringify(f.optionsList)},`);
      lines.push(`    resource: '${resource}',`);
      lines.push(`    operations: ['${op}'],`);
      if (f.modes) lines.push(`    modes: ${JSON.stringify(f.modes)},`);
      lines.push(`  }),`);
      return lines.join('\n');
    }).join('\n\n');
    return createFields;
  }).join('\n\n');

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
  if (op === 'getAll') fnName = 'getAll' + toPascal(resource) + 's';
  else if (op === 'getById') fnName = 'get' + toPascal(resource) + 'ById';
  else fnName = op + toPascal(resource);

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

// ---------- load spec from snippets or controller or spec file ----------
let spec = null;

function normalizeOperationsInput(rcOperations) {
  if (!rcOperations) return [];
  if (typeof rcOperations === 'string') return [rcOperations];
  if (Array.isArray(rcOperations)) return rcOperations;
  return [];
}

if (hasArg('--from-snippets')) {
  const resConfPath = path.resolve('snippets/resource.json');
  if (!exists(resConfPath)) { console.error('snippets/resource.json not found'); process.exit(1); }
  const rc = safeJsonParse(read(resConfPath));
  if (!rc) { console.error('failed parsing snippets/resource.json'); process.exit(1); }
  const resource = String(rc.resource || '').toLowerCase();
  if (!resource) { console.error('resource missing in snippets/resource.json'); process.exit(1); }

  const basePath = rc.basePath || `/${resource}s`;
  const opsRaw = normalizeOperationsInput(rc.operations);
  const ops = (opsRaw.length ? opsRaw : ['getAll']).map(String);

  function readInputFields() {
    const inputsPath = path.resolve('snippets/inputs.cs');
    if (!exists(inputsPath)) return [];
    let txt = read(inputsPath);
    txt = txt.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    const re = /(public|protected|internal)\s+([\w<>?]+)\s+([A-Za-z0-9_]+)\s*\{\s*get;\s*set;\s*\}/g;
    const result = [];
    let m;
    while ((m = re.exec(txt))) {
      const name = m[3];
      const rawType = m[2].toLowerCase().replace(/\?$/, '');
      const type = rawType.includes('guid') || rawType === 'string' || rawType.includes('date') ? 'string' : (['int','long','short','float','double','decimal'].includes(rawType) ? 'number' : (rawType.startsWith('bool') ? 'boolean' : 'string'));
      result.push({ name, type, displayName: toPascal(name) });
    }
    return result;
  }
  const inputFields = readInputFields();

  const operations = {};
  const fieldsByOperation = {};

  const want = (op) => ops.map(String).includes(String(op));

  if (want('getAll') || ops.includes('getAll')) {
    operations.getAll = { label: 'Get All', method: 'GET', path: `${basePath}`, qs: ['page:number=1', 'limit:number=100'] };
    fieldsByOperation.getAll = [
      { displayName: 'Page', name: 'page', type: 'number', default: 1, description: 'Page' },
      { displayName: 'Limit', name: 'limit', type: 'number', default: 100 },
    ];
  }
  if (want('getById')) {
    operations.getById = { label: 'Get By ID', method: 'GET', path: `${basePath}/{id}`, idParamName: `${resource}Id` };
    fieldsByOperation.getById = [
      {
        displayName: resource.charAt(0).toUpperCase() + resource.slice(1),
        name: `${resource}Id`,
        type: 'resourceLocator',
        description: `Select a ${resource} or enter the ID`,
        modes: [
          { displayName: 'From list', name: 'list', type: 'list', typeOptions: { searchListMethod: `search${toPascal(resource)}s`, searchable: true, searchFilterRequired: false } },
          { displayName: 'By ID', name: 'id', type: 'string' },
        ],
      },
    ];
  }
  if (want('create')) {
    operations.create = { label: 'Create', method: 'POST', path: `${basePath}`, body: inputFields.map(f => `${f.name}:${f.type}`) };
    fieldsByOperation.create = inputFields.map(f => ({ displayName: f.displayName || f.name, name: f.name, type: f.type }));
  }
  if (want('update')) {
    operations.update = { label: 'Update', method: 'PUT', path: `${basePath}/{id}`, idParamName: `${resource}Id`, body: inputFields.map(f => `${f.name}:${f.type}`) };
    fieldsByOperation.update = [
      {
        displayName: resource.charAt(0).toUpperCase() + resource.slice(1),
        name: `${resource}Id`,
        type: 'resourceLocator',
        description: `Select a ${resource} or enter the ID`,
        modes: [
          { displayName: 'From list', name: 'list', type: 'list', typeOptions: { searchListMethod: `search${toPascal(resource)}s`, searchable: true, searchFilterRequired: false } },
          { displayName: 'By ID', name: 'id', type: 'string' },
        ],
      },
      ...inputFields.map(f => ({ displayName: f.displayName || f.name, name: f.name, type: f.type })),
    ];
  }
  if (want('delete')) {
    operations.delete = { label: 'Delete', method: 'DELETE', path: `${basePath}/{id}`, idParamName: `${resource}Id` };
    fieldsByOperation.delete = [
      {
        displayName: resource.charAt(0).toUpperCase() + resource.slice(1),
        name: `${resource}Id`,
        type: 'resourceLocator',
        description: `Select a ${resource} or enter the ID`,
        modes: [
          { displayName: 'From list', name: 'list', type: 'list', typeOptions: { searchListMethod: `search${toPascal(resource)}s`, searchable: true, searchFilterRequired: false } },
          { displayName: 'By ID', name: 'id', type: 'string' },
        ],
      },
    ];
  }

  // relations (optional)
  const relationsPath = path.resolve('snippets/relations.json');
  let loaderSpec = null;
  if (exists(relationsPath)) {
    try {
      const rel = safeJsonParse(read(relationsPath));
      if (rel?.enabled === true) {
        const entries = (rel?.relations || []).filter(r => (r.resource || '').toLowerCase() === resource);
        const entry = entries.find((r) => (r.operation || '').toLowerCase() === 'getbyid');
        if (entry) {
          const valueKey = entry.valueKey || `${resource}Id`;
          const labelExpr = entry.labelExpr || "it?.email ?? ((it?.firstName || '') + ' ' + (it?.lastName || '')).trim()";
          const itemsPath = entry.itemsPath || `${resource}s`;
          const endpoint = entry.listEndpoint || basePath;
          loaderSpec = { resource, endpoint, itemsPath, value: valueKey, labelExpr };
        }
      }
    } catch (e) {
      console.warn('relations.json parse failed:', e.message);
    }
  }

  spec = {
    resource,
    basePath,
    idType: 'number',
    defaultOperation: ops[0],
    operations,
    fieldsByOperation,
    loader: loaderSpec,
  };

} else if (process.argv[0] && getArgValue('--from-cs')) {
  // legacy: support --from-cs=path
  const csPath = path.resolve(getArgValue('--from-cs'));
  if (!exists(csPath)) { console.error('Controller snippet not found:', csPath); process.exit(1); }
  const cs = read(csPath);
  const methodMatch = cs.match(/public\s+\w+[<>\w?,\s]*\s+([A-Za-z0-9_]+)\s*\(/);
  const methodName = methodMatch?.[1] || 'GetUsers';
  const plural = methodName.replace(/^Get/i, '').replace(/^Create/i, '').replace(/^Update/i, '').replace(/^Delete/i, '');
  const resourcePlural = plural || 'Users';
  let inferredResource = resourcePlural.toLowerCase().endsWith('s') ? resourcePlural.toLowerCase().slice(0, -1) : resourcePlural.toLowerCase();
  let basePath = `/${inferredResource}s`;

  const resOverrideArg = getArgValue('--resource');
  if (resOverrideArg) inferredResource = resOverrideArg.toLowerCase();
  const baseOverrideArg = getArgValue('--basePath');
  if (baseOverrideArg) basePath = baseOverrideArg;

  const resConfPath = path.resolve('snippets/resource.json');
  let requestedOps = [];
  if (exists(resConfPath)) {
    try {
      const rc = safeJsonParse(read(resConfPath));
      if (rc?.resource) inferredResource = String(rc.resource).toLowerCase();
      if (rc?.basePath) basePath = rc.basePath;
      if (Array.isArray(rc.operations)) requestedOps = rc.operations.map(String);
    } catch (e) { /* ignore */ }
  }

  const pagMatch = cs.match(/Api2PaginationQuery<([^>]+)>/);
  const generic = pagMatch?.[1]?.toLowerCase() || '';
  const idType = generic.includes('guid') ? 'guid' : 'number';

  const operations = {};
  let fieldsByOperation = {};

  const includeGetAll = requestedOps.length === 0 || requestedOps.includes('getAll');
  if (includeGetAll) {
    operations.getAll = {
      label: 'Get All',
      method: 'GET',
      path: `${basePath}`,
      qs: idType === 'guid' ? ['page:number=1', 'limit:number=100', 'startingAfter:string'] : ['page:number=1', 'limit:number=100', 'startingAfter:number']
    };
    fieldsByOperation.getAll = [
      { displayName: 'Page', name: 'page', type: 'number', default: 1, description: 'Page' },
      { displayName: 'Limit', name: 'limit', type: 'number', default: 100 },
    ];
  }

  const hasPost = /\[HttpPost/.test(cs);
  const hasPut = /\[HttpPut/.test(cs);
  const hasDelete = /\[HttpDelete/.test(cs);
  const includeGetById = (requestedOps.length === 0 || requestedOps.includes('getById')) && (/Route\(\"\{id\}\"\)/.test(cs) || /Route\(\'\{id\}\'\)/.test(cs));

  if (includeGetById) {
    operations.getById = { label: 'Get By ID', method: 'GET', path: `${basePath}/{id}`, idParamName: `${inferredResource}Id` };
    fieldsByOperation.getById = [
      {
        displayName: inferredResource.charAt(0).toUpperCase() + inferredResource.slice(1),
        name: `${inferredResource}Id`,
        type: 'resourceLocator',
        description: `Select a ${inferredResource} or enter the ID`,
        modes: [
          { displayName: 'From list', name: 'list', type: 'list', typeOptions: { searchListMethod: `search${toPascal(inferredResource)}s`, searchable: true, searchFilterRequired: false } },
          { displayName: 'By ID', name: 'id', type: 'string' },
        ],
      },
    ];
  }

  function readInputFields() {
    const inputsPath = path.resolve('snippets/inputs.cs');
    if (!exists(inputsPath)) return [];
    let txt = read(inputsPath).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    const re = /(public|protected|internal)\s+([\w<>?]+)\s+([A-Za-z0-9_]+)\s*\{\s*get;\s*set;\s*\}/g;
    const result = [];
    let m;
    while ((m = re.exec(txt))) {
      const name = m[3];
      const rawType = m[2].toLowerCase().replace(/\?$/, '');
      const type = rawType.includes('guid') || rawType === 'string' || rawType.includes('date') ? 'string' : (['int','long','short','float','double','decimal'].includes(rawType) ? 'number' : (rawType.startsWith('bool') ? 'boolean' : 'string'));
      result.push({ name, type, displayName: toPascal(name) });
    }
    return result;
  }
  const inputFields = readInputFields();
  const wantCreate = hasPost || requestedOps.includes('create');
  const wantUpdate = hasPut || requestedOps.includes('update');
  const wantDelete = hasDelete || requestedOps.includes('delete');

  if (wantCreate) {
    operations.create = { label: 'Create', method: 'POST', path: `${basePath}`, body: inputFields.map(f => `${f.name}:${f.type}`) };
    fieldsByOperation.create = inputFields.map(f => ({ displayName: f.displayName || f.name, name: f.name, type: f.type }));
  }
  if (wantUpdate) {
    operations.update = { label: 'Update', method: 'PUT', path: `${basePath}/{id}`, idParamName: `${inferredResource}Id`, body: inputFields.map(f => `${f.name}:${f.type}`) };
    fieldsByOperation.update = [
      {
        displayName: inferredResource.charAt(0).toUpperCase() + inferredResource.slice(1),
        name: `${inferredResource}Id`,
        type: 'resourceLocator',
        description: `Select a ${inferredResource} or enter the ID`,
        modes: [
          { displayName: 'From list', name: 'list', type: 'list', typeOptions: { searchListMethod: `search${toPascal(inferredResource)}s`, searchable: true, searchFilterRequired: false } },
          { displayName: 'By ID', name: 'id', type: 'string' },
        ],
      },
      ...inputFields.map(f => ({ displayName: f.displayName || f.name, name: f.name, type: f.type })),
    ];
  }
  if (wantDelete) {
    operations.delete = { label: 'Delete', method: 'DELETE', path: `${basePath}/{id}`, idParamName: `${inferredResource}Id` };
    fieldsByOperation.delete = [
      {
        displayName: inferredResource.charAt(0).toUpperCase() + inferredResource.slice(1),
        name: `${inferredResource}Id`,
        type: 'resourceLocator',
        description: `Select a ${inferredResource} or enter the ID`,
        modes: [
          { displayName: 'From list', name: 'list', type: 'list', typeOptions: { searchListMethod: `search${toPascal(inferredResource)}s`, searchable: true, searchFilterRequired: false } },
          { displayName: 'By ID', name: 'id', type: 'string' },
        ],
      },
    ];
  }

  spec = {
    resource: inferredResource,
    basePath,
    idType,
    defaultOperation: 'getAll',
    operations,
    fieldsByOperation,
  };

  const outputsPath = path.resolve('snippets/outputs.cs');
  if (exists(outputsPath)) {
    try {
      const outTxt = read(outputsPath);
      const propRegex = /(public|protected|internal)\s+([\w<>?]+)\s+([A-Za-z0-9_]+)\s*\{\s*get;\s*set;\s*\}/g;
      const props = [];
      let m;
      while ((m = propRegex.exec(outTxt))) props.push({ name: m[3], type: m[2] });
      const idProp = props.find(p => /id$/i.test(p.name))?.name || `${inferredResource}Id`;
      const emailProp = props.find(p => /email$/i.test(p.name))?.name;
      const firstNameProp = props.find(p => /firstname|first_name/i.test(p.name))?.name;
      const lastNameProp = props.find(p => /lastname|last_name/i.test(p.name))?.name;
      const labelExpr = `(${emailProp ? `it?.${emailProp}` : ''} ?? ((it?.${firstNameProp || ''} || '') + ' ' + (it?.${lastNameProp || ''} || '')).trim()) || ('${inferredResource.charAt(0).toUpperCase() + inferredResource.slice(1)} ' + (it?.${idProp} ?? it?.id ?? ''))`;
      spec.loader = { resource: inferredResource, endpoint: basePath, itemsPath: `${inferredResource}s`, value: idProp.charAt(0).toLowerCase() + idProp.slice(1), labelExpr };
    } catch (e) { /* ignore */ }
  }
} else {
  if (argv.length < 1) {
    console.error('Usage: node scripts/generate-node.mjs path/to/spec.json [--force] | --from-cs=path/to/snippet.cs [--use-relations] | --from-snippets');
    process.exit(1);
  }
  const specPath = path.resolve(argv[0]);
  if (!exists(specPath)) { console.error('Spec not found:', specPath); process.exit(1); }
  spec = safeJsonParse(read(specPath));
  if (!spec) { console.error('Spec parse failed:', specPath); process.exit(1); }
}

// ---------- spec validations ----------
if (!spec || !spec.resource) { console.error('Spec must include "resource"'); process.exit(1); }

const resource = String(spec.resource).toLowerCase();
const descTarget = path.resolve(`nodes/MyApi/descriptions/${resource}.descriptions.ts`);
const perOpDir = path.resolve(`nodes/MyApi/descriptions/${resource}`);
ensureDir(perOpDir);

// ---------- per-op description file writer ----------
function buildCreateFieldBlock(f, resource, op) {
  const lines = [];
  lines.push(`  createField({`);
  lines.push(`    displayName: '${(f.displayName || f.name).replace(/'/g, "\\'")}',`);
  lines.push(`    name: '${f.name}',`);
  lines.push(`    type: '${f.type}',`);
  if (f.description) lines.push(`    description: '${String(f.description).replace(/'/g, "\\'")}',`);
  if (f.default !== undefined) lines.push(`    default: ${JSON.stringify(f.default)},`);
  if (f.required) lines.push(`    required: true,`);
  if (f.typeOptions) lines.push(`    typeOptions: ${JSON.stringify(f.typeOptions)},`);
  if (Array.isArray(f.optionsList)) lines.push(`    optionsList: ${JSON.stringify(f.optionsList)},`);
  lines.push(`    resource: '${resource}',`);
  lines.push(`    operations: ['${op}'],`);
  if (f.modes) lines.push(`    modes: ${JSON.stringify(f.modes)},`);
  lines.push(`  }),`);
  return lines.join('\n');
}

function writePerOpFieldsFiles(resource, fieldsByOperation) {
  ensureDir(path.resolve(`nodes/MyApi/descriptions/${resource}`));
  Object.entries(fieldsByOperation || {}).forEach(([op, defs]) => {
    const pas = toPascal(op);
    const exportName = `${resource}${pas}Fields`;
    const file = path.join(perOpDir, `${op}.fields.ts`);
    const body = (defs || []).map(f => buildCreateFieldBlock(f, resource, op)).join('\n\n') || '';
    const content =
`import { INodeProperties } from 'n8n-workflow';
import { createField } from '../common/fields';

export const ${exportName}: INodeProperties[] = [
${body}
];
`;
    writeFileIfAbsent(file, content, forceFlag);
  });
}

// ---------- main descriptions file patcher ----------
function safePatchDescriptions(descPath, specObj) {
  try {
    if (!exists(descPath)) {
      write(descPath, descriptionTemplate(specObj));
      console.log(`WRITE: ${descPath}`);
      return true;
    }
    let content = read(descPath);
    const resName = specObj.resource;
    const ops = Object.keys(specObj.operations || {});

    // add imports for per-op files
    ops.forEach((op) => {
      const pas = toPascal(op);
      const exportName = `${resName}${pas}Fields`;
      const importLine = `import { ${exportName} } from './${resName}/${op}.fields';`;
      if (!content.includes(importLine)) {
        const importBlockMatch = content.match(/(?:^import[^\n;]*;[ \t\r\n]*)+/m);
        if (importBlockMatch) {
          const lastImport = importBlockMatch[0];
          content = content.replace(lastImport, lastImport + importLine + '\n');
        } else {
          content = importLine + '\n' + content;
        }
      }
    });

    // ensure optionsList includes ops
    const opsMatch = content.match(/optionsList\s*:\s*\[([\s\S]*?)\]/);
    if (opsMatch) {
      let inner = opsMatch[1];
      ops.forEach((op) => {
        if (!inner.includes(`value: '${op}'`)) {
          const label = (specObj.operations[op]?.label) || toPascal(op);
          inner = `${inner.trim()}\n      { name: '${label}', value: '${op}' },\n`;
        }
      });
      content = content.replace(opsMatch[0], `optionsList: [\n${inner}]`);
    } else {
      // inject minimal operations block after imports
      const opsBlock = `export const ${toCamel(resName)}Operations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: '${resName}',
    default: '${specObj.defaultOperation || Object.keys(specObj.operations || {})[0] || 'getAll'}',
    optionsList: [
${ops.map(op => `      { name: '${specObj.operations[op]?.label || toPascal(op)}', value: '${op}' }`).join(',\n')}
    ],
  }),
];
`;
      const importEnd = content.search(/(^import .*;[\n\r]*)+/m);
      if (importEnd >= 0) {
        content = content.replace(/(^import .*;[\n\r]*)+/m, (m) => m + '\n' + opsBlock);
      } else {
        content = opsBlock + '\n' + content;
      }
    }

    // ensure aggregator includes spreads
    const fieldsArrayStart = new RegExp(`export\\s+const\\s+${resName}Fields\\s*:\\s*INodeProperties\\[\\]\\s*=\\s*\\[`, 'm');
    if (fieldsArrayStart.test(content)) {
      ops.forEach((op) => {
        const token = `...${resName}${toPascal(op)}Fields`;
        if (!content.includes(token)) {
          content = content.replace(
            new RegExp(`(export\\s+const\\s+${resName}Fields\\s*:\\s*INodeProperties\\[\\]\\s*=\\s*\\[[\\s\\S]*?)(\\])`, 'm'),
            (_, head, close) => `${head}\n  ${token},\n${close}`
          );
        }
      });
    } else {
      const spreadsAll = ops.map((op) => `  ...${resName}${toPascal(op)}Fields,`).join('\n');
      content += `

export const ${resName}Fields: INodeProperties[] = [
${spreadsAll}
];
`;
    }

    write(descPath, content);
    console.log(`UPDATE: ${descPath} (patched)`);
    return true;
  } catch (e) {
    console.warn('Descriptions patch failed:', e.message);
    return false;
  }
}

// ---------- handler writer ----------
function writeHandlers(specObj) {
  Object.keys(specObj.operations || {}).forEach((op) => {
    const target = path.resolve(`nodes/MyApi/resources/${resource}/${resource}.${op}.ts`);
    const content = handlerTemplate(specObj, op);
    writeFileIfAbsent(target, content, forceFlag);
  });
}

function writeLoaderIfNeeded(loaderSpec) {
  if (!loaderSpec) return;
  const loaderTarget = path.resolve(`nodes/MyApi/resources/${resource}/load/${resource}.load.ts`);
  writeFileIfAbsent(loaderTarget, loaderTemplate(loaderSpec), forceFlag);
}

// ---------- patch main node file (MyApi.node.ts) safely ----------
function wireMyApiNode(specObj) {
  try {
    const nodeFile = path.resolve('nodes/MyApi/MyApi.node.ts');
    if (!exists(nodeFile)) {
      console.warn('MyApi.node.ts not found — skipping auto-wiring');
      return;
    }
    let nodeContent = read(nodeFile);

    // 1) ensure imports for handlers (getAll/getById/create/...)
    Object.keys(specObj.operations || {}).forEach((op) => {
      let fnName;
      if (op === 'getAll') fnName = 'getAll' + toPascal(resource) + 's';
      else if (op === 'getById') fnName = 'get' + toPascal(resource) + 'ById';
      else fnName = op + toPascal(resource);
      const importLine = `import { ${fnName} } from './resources/${resource}/${resource}.${op}';`;
      if (!nodeContent.includes(importLine)) {
        // append after last import block
        nodeContent = nodeContent.replace(/(import[^\n;]*;[\n\r]*)+/, (m) => m + importLine + '\n');
      }
    });

    // 2) ensure import for executor function (execute<Resource>)
    const execImport = `import { execute${toPascal(resource)} } from './execute/${resource}.exec';`;
    if (!nodeContent.includes(execImport)) {
      // place near the other execute imports if present; otherwise at top after imports
      const execImportAnchor = "import { execute";
      if (nodeContent.includes(execImportAnchor)) {
        // find last execute import and append after it
        nodeContent = nodeContent.replace(/(import\s+\{[^}]*execute[^}]*\}\s+from\s+['"][^'"]+['"];[\n\r]*)+/m, (m) => m + execImport + '\n');
      } else {
        nodeContent = nodeContent.replace(/(import[^\n;]*;[\n\r]*)+/, (m) => m + execImport + '\n');
      }
    }

    // 3) Ensure resource option exists in the Resource options array
    const resourceOption = `{ name: '${toPascal(resource)}', value: '${resource}' }`;
    const optionsArrayMatch = nodeContent.match(/options\s*:\s*\[((?:[\s\S]*?))\]/m);
    if (optionsArrayMatch) {
      const fullOptions = optionsArrayMatch[0];
      if (!fullOptions.includes(`value: '${resource}'`)) {
        // insert new item before the closing bracket
        const newOptions = fullOptions.replace(/\]\s*$/, `  ${resourceOption},\n]`);
        nodeContent = nodeContent.replace(fullOptions, newOptions);
      }
    } else {
      // no options array found; skip (manual)
      console.warn('Could not find Resource options array in MyApi.node.ts — add resource option manually if needed.');
    }

    // 4) Ensure resource handler block exists (the block that calls execute<Resource>.call)
    // Find a location before the final "else { throw new Error(...)" or before the end of the resource if/else chain.
    if (!nodeContent.includes(`else if (resource === '${resource}')`)) {
      // Try to find the place to insert: before the last "else { throw new Error"
      const throwIdx = nodeContent.search(/else\s*\{\s*throw new Error\([^]*?\)\s*;\s*\}/m);
      const insertBlock = `
        } else if (resource === '${resource}') {
          data = await execute${toPascal(resource)}.call(this, operation, i);
        }`;
      if (throwIdx !== -1) {
        // find the line that begins the throw block and insert before it
        const beforeThrow = nodeContent.slice(0, throwIdx);
        const afterThrow = nodeContent.slice(throwIdx);
        // insert just before the throw block
        nodeContent = beforeThrow + insertBlock + '\n' + afterThrow;
      } else {
        // fallback: try to append near the resource chain closing bracket
        nodeContent = nodeContent.replace(/\}\s*$/m, insertBlock + '\n}');
      }
    } else {
      // block exists: ensure it calls execute<Resource>.call(this, operation, i)
      const resourceBlockRe = new RegExp(`else if \\(resource === '${resource}'\\) \\{([\\s\\S]*?)\\}`, 'm');
      nodeContent = nodeContent.replace(resourceBlockRe, (match, body) => {
        if (!body.includes(`execute${toPascal(resource)}.call`)) {
          const newBody = `\n          data = await execute${toPascal(resource)}.call(this, operation, i);\n        `;
          return `else if (resource === '${resource}') {${newBody}}`;
        }
        return match;
      });
    }

    // Persist node file
    write(nodeFile, nodeContent);
    console.log('UPDATE: nodes/MyApi/MyApi.node.ts (imports, executor import, resource option/block ensured)');
  } catch (e) {
    console.warn('Failed to wire MyApi.node.ts automatically:', e.message);
  }
}

// ---------- executor writer/updater (nodes/MyApi/execute/<resource>.exec.ts) ----------
function executorTemplate(resource, ops) {
  const pas = toPascal(resource);
  const imports = [];
  imports.push(`import { IExecuteFunctions } from 'n8n-workflow';`);
  const uniqueOps = Array.from(new Set(ops));
  uniqueOps.forEach((op) => {
    let handlerName;
    if (op === 'getAll') handlerName = 'getAll' + pas + 's';
    else if (op === 'getById') handlerName = 'get' + pas + 'ById';
    else handlerName = op + pas;
    imports.push(`import { ${handlerName} } from '../resources/${resource}/${resource}.${op}';`);
  });

  const cases = uniqueOps.map((op) => {
    let handlerName;
    if (op === 'getAll') handlerName = 'getAll' + pas + 's';
    else if (op === 'getById') handlerName = 'get' + pas + 'ById';
    else handlerName = op + pas;
    return `    case '${op}':\n      return await ${handlerName}.call(this, i);`;
  }).join('\n\n');

  return `${imports.join('\n')}

export async function execute${pas}(this: IExecuteFunctions, operation: string, i: number): Promise<any> {
  switch (operation) {
${cases}

    default:
      throw new Error(\`Operation "\${operation}" not supported for ${pas}\`);
  }
}
`;
}

function updateOrCreateExecutor(resource, ops) {
  const execDir = path.resolve('nodes/MyApi/execute');
  ensureDir(execDir);
  const execFile = path.join(execDir, `${resource}.exec.ts`);
  const desiredOps = Array.from(new Set(ops));

  if (!exists(execFile)) {
    const content = executorTemplate(resource, desiredOps);
    write(execFile, content);
    console.log(`WRITE: ${execFile}`);
    return;
  }

  try {
    let content = read(execFile);

    // ensure handler imports
    desiredOps.forEach((op) => {
      const pas = toPascal(resource);
      let handlerName;
      if (op === 'getAll') handlerName = 'getAll' + pas + 's';
      else if (op === 'getById') handlerName = 'get' + pas + 'ById';
      else handlerName = op + pas;
      const importLine = `import { ${handlerName} } from '../resources/${resource}/${resource}.${op}';`;
      if (!content.includes(importLine)) {
        const importBlockMatch = content.match(/(?:^import[^\n;]*;[ \t\r\n]*)+/m);
        if (importBlockMatch) {
          const lastImport = importBlockMatch[0];
          content = content.replace(lastImport, lastImport + importLine + '\n');
        } else {
          content = importLine + '\n' + content;
        }
      }
    });

    // find switch block and append missing cases before default
    const switchMatch = content.match(/switch\s*\(\s*operation\s*\)\s*\{\s*([\s\S]*?)\n\s*default:/m);
    if (switchMatch) {
      let body = switchMatch[1];
      desiredOps.forEach((op) => {
        if (!body.includes(`case '${op}':`)) {
          const pas = toPascal(resource);
          let handlerName;
          if (op === 'getAll') handlerName = 'getAll' + pas + 's';
          else if (op === 'getById') handlerName = 'get' + pas + 'ById';
          else handlerName = op + pas;
          const caseSnippet = `    case '${op}':\n      return await ${handlerName}.call(this, i);\n`;
          body = body + '\n' + caseSnippet;
        }
      });
      content = content.replace(/switch\s*\(\s*operation\s*\)\s*\{\s*([\s\S]*?)\n\s*default:/m, (m, p1) => `switch (operation) {\n${body}\n\n    default:`);
      write(execFile, content);
      console.log(`UPDATE: ${execFile} (added missing cases/imports)`);
      return;
    } else {
      // fallback rewrite
      const content2 = executorTemplate(resource, desiredOps);
      write(execFile, content2);
      console.log(`REWRITE: ${execFile} (switch block not found)`);
      return;
    }
  } catch (e) {
    console.warn('Executor patch failed:', e.message);
    const content = executorTemplate(resource, desiredOps);
    write(execFile, content);
    console.log(`REWRITE: ${execFile} (fallback)`);
    return;
  }
}

// ---------- run generation ----------
(function run() {
  console.log(`Generating node for resource: ${resource}`);

  // 1) per-op description files
  writePerOpFieldsFiles(resource, spec.fieldsByOperation || {});

  // 2) main descriptions aggregator
  const ok = safePatchDescriptions(descTarget, spec);
  if (!ok) {
    write(descTarget, descriptionTemplate(spec));
    console.log(`FALLBACK WRITE: ${descTarget}`);
  }

  // 3) handler files
  writeHandlers(spec);

  // 4) loader if present
  if (spec.loader) writeLoaderIfNeeded(spec.loader);

  // 5) wire MyApi.node.ts (imports, executor import, resource option, handler block)
  wireMyApiNode(spec);

  // 6) create/update executor in nodes/MyApi/execute/<resource>.exec.ts
  const opsList = Object.keys(spec.operations || {});
  updateOrCreateExecutor(resource, opsList);

  console.log('\nNext steps (if any manual wiring needed):');
  console.log(`- Ensure descriptions import in nodes/MyApi/MyApi.node.ts: import { ${toCamel(resource)}Operations, ${toCamel(resource)}Fields } from './descriptions/${resource}.descriptions';`);
  console.log(`- Spread into properties: ...${toCamel(resource)}Operations, ...${toCamel(resource)}Fields`);
  console.log(`- Confirm resource option added: { name: '${toPascal(resource)}', value: '${resource}' }`);
  console.log(`- Confirm execute file exists: nodes/MyApi/execute/${resource}.exec.ts`);
  if (spec.loader) console.log('- Loader generated: register load options/search methods as needed.');

  console.log('\nDone.');
}());
