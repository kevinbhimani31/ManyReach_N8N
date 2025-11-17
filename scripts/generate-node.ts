#!/usr/bin/env ts-node
/**
 * N8N Node Generator
 * 
 * This script generates n8n node files based on a configuration file.
 * It creates:
 * - Description files (operations and fields)
 * - Resource operation files (getAll, getById, create, update, delete)
 * - Load functions (if needed)
 * - Updates the main node file
 */

import * as fs from 'fs';
import * as path from 'path';

interface FieldConfig {
  displayName: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'options' | 'resourceLocator' | 'multiOptions';
  description?: string;
  required?: boolean;
  default?: any;
  placeholder?: string;
  operations?: string[];
  optionsList?: Array<{ name: string; value: string | number; description?: string }>;
  validation?: {
    type: 'regex';
    regex: string;
    errorMessage: string;
  };
  loadOptionsMethod?: string;
  typeOptions?: any;
}

interface OperationConfig {
  name: string;
  value: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  fields?: FieldConfig[];
  hasPagination?: boolean;
  hasAdditionalFields?: boolean;
  hasUpdateFields?: boolean;
}

interface ResourceConfig {
  name: string;
  value: string;
  displayName: string;
  endpoint: string; // Base endpoint (e.g., '/users')
  operations: OperationConfig[];
  hasLoadOptions?: boolean;
  hasListSearch?: boolean;
  idType?: 'string' | 'number' | 'guid';
}

interface GeneratorConfig {
  nodeName: string;
  nodeDisplayName: string;
  nodeDescription: string;
  resources: ResourceConfig[];
}

// Helper function to capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to convert to PascalCase
function toPascalCase(str: string): string {
  return str.split(/[-_]/).map(capitalize).join('');
}

// Helper function to convert to camelCase (unused but kept for potential future use)
// function toCamelCase(str: string): string {
//   const parts = str.split(/[-_]/);
//   return parts[0] + parts.slice(1).map(capitalize).join('');
// }

// Generate description file
function generateDescriptionFile(resource: ResourceConfig, outputDir: string): void {
  const resourceName = resource.value;
  const ResourceName = capitalize(resourceName);
  
  let content = `import { INodeProperties } from 'n8n-workflow';\n`;
  content += `import { createField } from '../descriptions/common/fields';\n\n`;
  
  // Generate operations array
  content += `export const ${resourceName}Operations: INodeProperties[] = [\n`;
  content += `  createField({\n`;
  content += `    displayName: 'Operation',\n`;
  content += `    name: 'operation',\n`;
  content += `    type: 'options',\n`;
  content += `    resource: '${resourceName}',\n`;
  content += `    default: '${resource.operations[0]?.value || 'getAll'}',\n`;
  content += `    optionsList: [\n`;
  
  resource.operations.forEach(op => {
    content += `      { name: '${op.name}', value: '${op.value}' },\n`;
  });
  
  content += `    ],\n`;
  content += `  }),\n`;
  content += `];\n\n`;
  
  // Generate fields array
  content += `export const ${resourceName}Fields: INodeProperties[] = [\n`;
  
  // Pagination fields (if any operation has pagination)
  if (resource.operations.some(op => op.hasPagination)) {
    content += `  // Pagination\n`;
    content += `  createField({\n`;
    content += `    displayName: 'Page',\n`;
    content += `    name: 'page',\n`;
    content += `    type: 'number',\n`;
    content += `    default: 1,\n`;
    content += `    resource: '${resourceName}',\n`;
    content += `    operations: ['getAll'],\n`;
    content += `  }),\n\n`;
    
    content += `  createField({\n`;
    content += `    displayName: 'Limit',\n`;
    content += `    name: 'limit',\n`;
    content += `    type: 'number',\n`;
    content += `    default: 100,\n`;
    content += `    resource: '${resourceName}',\n`;
    content += `    operations: ['getAll'],\n`;
    content += `  }),\n\n`;
    
    content += `  createField({\n`;
    content += `    displayName: 'Starting After',\n`;
    content += `    name: 'startingAfter',\n`;
    content += `    type: 'number',\n`;
    content += `    resource: '${resourceName}',\n`;
    content += `    operations: ['getAll'],\n`;
    content += `  }),\n\n`;
  }
  
  // ID field (for getById, update, delete)
  const needsIdField = resource.operations.some(op => 
    ['getById', 'update', 'delete'].includes(op.value)
  );
  
  if (needsIdField) {
    const idValidation = resource.idType === 'guid' 
      ? `        validation: [\n          {\n            type: 'regex',\n            properties: {\n              regex: '^[0-9a-fA-F]{8}\\\\b-[0-9a-fA-F]{4}\\\\b-[1-5][0-9a-fA-F]{3}\\\\b-[89abAB][0-9a-fA-F]{3}\\\\b-[0-9a-fA-F]{12}$',\n              errorMessage: 'Enter a valid GUID',\n            },\n          },\n        ],`
      : resource.idType === 'number'
      ? `        validation: [\n          {\n            type: 'regex',\n            properties: {\n              regex: '^\\\\d+$',\n              errorMessage: 'Only numeric IDs are allowed',\n            },\n          },\n        ],`
      : '';
    
    content += `  // ${ResourceName} ID\n`;
    content += `  createField({\n`;
    content += `    displayName: '${ResourceName}',\n`;
    content += `    name: '${resourceName}Id',\n`;
    content += `    type: 'resourceLocator',\n`;
    content += `    default: {\n`;
    content += `      mode: 'list',\n`;
    content += `      value: '',\n`;
    content += `    },\n`;
    content += `    description: 'Select a ${resourceName} from the list or enter its ID manually',\n`;
    content += `    resource: '${resourceName}',\n`;
    content += `    operations: ['getById', 'update', 'delete'],\n`;
    content += `    modes: [\n`;
    content += `      {\n`;
    content += `        displayName: 'From list',\n`;
    content += `        name: 'list',\n`;
    content += `        type: 'list',\n`;
    content += `        placeholder: 'Select a ${resourceName}...',\n`;
    if (resource.hasListSearch) {
      content += `        typeOptions: {\n`;
      content += `          searchListMethod: 'search${toPascalCase(resourceName)}s',\n`;
      content += `          searchable: true,\n`;
      content += `          searchFilterRequired: false,\n`;
      content += `        },\n`;
    }
    content += `      },\n`;
    content += `      {\n`;
    content += `        displayName: 'By ID',\n`;
    content += `        name: 'id',\n`;
    content += `        type: 'string',\n`;
    content += `        placeholder: 'Enter ${resourceName} ID',\n`;
    if (idValidation) {
      content += `        ${idValidation}\n`;
    }
    content += `      },\n`;
    content += `    ],\n`;
    content += `  }),\n\n`;
  }
  
  // Operation-specific fields
  resource.operations.forEach(op => {
    if (op.fields && op.fields.length > 0) {
      op.fields.forEach(field => {
        content += `  createField({\n`;
        content += `    displayName: '${field.displayName}',\n`;
        content += `    name: '${field.name}',\n`;
        content += `    type: '${field.type}',\n`;
        if (field.description) {
          content += `    description: '${field.description}',\n`;
        }
        if (field.required) {
          content += `    required: ${field.required},\n`;
        }
        if (field.default !== undefined) {
          if (typeof field.default === 'string') {
            content += `    default: '${field.default}',\n`;
          } else {
            content += `    default: ${JSON.stringify(field.default)},\n`;
          }
        }
        if (field.placeholder) {
          content += `    placeholder: '${field.placeholder}',\n`;
        }
        if (field.type === 'options' && field.optionsList) {
          content += `    optionsList: [\n`;
          field.optionsList.forEach(opt => {
            content += `      { name: '${opt.name}', value: ${JSON.stringify(opt.value)}`;
            if (opt.description) {
              content += `, description: '${opt.description}'`;
            }
            content += ` },\n`;
          });
          content += `    ],\n`;
        }
        if (field.loadOptionsMethod) {
          content += `    typeOptions: {\n`;
          content += `      loadOptionsMethod: '${field.loadOptionsMethod}',\n`;
          content += `    },\n`;
        }
        content += `    resource: '${resourceName}',\n`;
        if (field.operations && field.operations.length > 0) {
          content += `    operations: ${JSON.stringify(field.operations)},\n`;
        }
        content += `  }),\n\n`;
      });
    }
  });
  
  // Additional fields collection (if needed)
  if (resource.operations.some(op => op.hasAdditionalFields)) {
    content += `  {\n`;
    content += `    displayName: 'Additional Fields',\n`;
    content += `    name: 'additionalFields',\n`;
    content += `    type: 'collection',\n`;
    content += `    default: {},\n`;
    content += `    placeholder: 'Add Optional Field',\n`;
    content += `    displayOptions: {\n`;
    content += `      show: { resource: ['${resourceName}'], operation: ['create'] },\n`;
    content += `    },\n`;
    content += `    options: [\n`;
    content += `      // Add optional fields here\n`;
    content += `    ],\n`;
    content += `  },\n\n`;
  }
  
  // Update fields collection (if needed)
  if (resource.operations.some(op => op.hasUpdateFields)) {
    content += `  {\n`;
    content += `    displayName: 'Update Fields',\n`;
    content += `    name: 'updateFields',\n`;
    content += `    type: 'collection',\n`;
    content += `    placeholder: 'Add Field',\n`;
    content += `    default: {},\n`;
    content += `    displayOptions: {\n`;
    content += `      show: { resource: ['${resourceName}'], operation: ['update'] },\n`;
    content += `    },\n`;
    content += `    options: [\n`;
    content += `      // Add update fields here\n`;
    content += `    ],\n`;
    content += `  },\n`;
  }
  
  content += `];\n`;
  
  const filePath = path.join(outputDir, `descriptions/${resourceName}.descriptions.ts`);
  fs.writeFileSync(filePath, content);
  console.log(`✓ Generated: ${filePath}`);
}

// Generate operation file
function generateOperationFile(
  resource: ResourceConfig,
  operation: OperationConfig,
  outputDir: string
): void {
  const resourceName = resource.value;
  const ResourceName = toPascalCase(resourceName);
  const operationName = operation.value;
  
  let content = `import { IExecuteFunctions } from 'n8n-workflow';\n`;
  content += `import { apiRequest } from '../../helpers/apiRequest';\n`;
  
  if (operation.hasPagination) {
    content += `import { ensurePagination } from '../../helpers/validation';\n`;
  }
  content += `\n`;
  
  // Generate function
  const functionName = operationName === 'getAll' 
    ? `getAll${ResourceName}s`
    : operationName === 'getById'
    ? `get${ResourceName}ById`
    : `${operationName}${ResourceName}`;
  
  content += `export async function ${functionName}(this: IExecuteFunctions, index: number) {\n`;
  
  // Generate parameter extraction
  if (operation.hasPagination) {
    content += `  const page = this.getNodeParameter('page', index, 1) as number;\n`;
    content += `  const limit = this.getNodeParameter('limit', index, 100) as number;\n`;
    content += `  const startingAfter = this.getNodeParameter('startingAfter', index, 0) as number;\n`;
    content += `  ensurePagination(page, limit);\n`;
  }
  
  if (['getById', 'update', 'delete'].includes(operation.value)) {
    content += `  const ${resourceName}Id = this.getNodeParameter('${resourceName}Id', index) as string;\n`;
    content += `  const id = typeof ${resourceName}Id === 'object' ? ${resourceName}Id.value : ${resourceName}Id;\n`;
  }
  
  if (operation.value === 'create' || operation.value === 'update') {
    if (operation.fields) {
      operation.fields.forEach(field => {
        const defaultValue = field.default !== undefined 
          ? `, ${JSON.stringify(field.default)}`
          : field.required 
          ? ''
          : ', undefined';
        content += `  const ${field.name} = this.getNodeParameter('${field.name}', index${defaultValue}) as ${getTypeScriptType(field.type)};\n`;
        
        if (field.required && operation.value === 'create') {
          content += `\n`;
          content += `  if (!${field.name} || (typeof ${field.name} === 'string' && ${field.name}.trim() === '')) {\n`;
          content += `    throw new Error('${field.displayName} is required');\n`;
          content += `  }\n`;
        }
      });
    }
  }
  
  // Generate request body
  if (operation.value === 'create' || operation.value === 'update') {
    content += `\n`;
    content += `  const body: any = {};\n`;
    
    if (operation.fields) {
      operation.fields.forEach(field => {
        if (operation.value === 'create' && field.required) {
          content += `  body.${field.name} = ${field.name};\n`;
        } else {
          content += `  if (${field.name} !== undefined && ${field.name} !== '') {\n`;
          content += `    body.${field.name} = ${field.name};\n`;
          content += `  }\n`;
        }
      });
    }
    
    if (operation.hasAdditionalFields && operation.value === 'create') {
      content += `\n`;
      content += `  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;\n`;
      content += `  Object.assign(body, additionalFields);\n`;
    }
    
    if (operation.hasUpdateFields && operation.value === 'update') {
      content += `\n`;
      content += `  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;\n`;
      content += `  Object.assign(body, updateFields);\n`;
    }
  }
  
  // Generate API call
  content += `\n`;
  if (operation.value === 'getAll') {
    content += `  const response = await apiRequest.call(this, '${operation.method}', \`${operation.endpoint}\`, {}, { page, limit, startingAfter });\n`;
    content += `\n`;
    content += `  return {\n`;
    content += `    items: response?.data ?? response ?? [],\n`;
    content += `  };\n`;
  } else if (operation.value === 'getById') {
    const endpoint = operation.endpoint.replace('{id}', '${id}');
    content += `  const response = await apiRequest.call(this, '${operation.method}', \`${endpoint}\`);\n`;
    content += `\n`;
    content += `  return response;\n`;
  } else if (operation.value === 'delete') {
    const endpoint = operation.endpoint.replace('{id}', '${id}');
    content += `  const response = await apiRequest.call(this, '${operation.method}', \`${endpoint}\`);\n`;
    content += `\n`;
    content += `  return response || { success: true };\n`;
  } else if (operation.value === 'update') {
    const endpoint = operation.endpoint.replace('{id}', '${id}');
    content += `  const response = await apiRequest.call(this, '${operation.method}', \`${endpoint}\`, body);\n`;
    content += `\n`;
    content += `  return response;\n`;
  } else {
    content += `  const response = await apiRequest.call(this, '${operation.method}', \`${operation.endpoint}\`, body);\n`;
    content += `\n`;
    content += `  return response;\n`;
  }
  
  content += `}\n`;
  
  const filePath = path.join(outputDir, `resources/${resourceName}/${resourceName}.${operationName}.ts`);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
  console.log(`✓ Generated: ${filePath}`);
}

function getTypeScriptType(fieldType: string): string {
  const typeMap: Record<string, string> = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    json: 'any',
    options: 'string | number',
    resourceLocator: 'string | { mode: string; value: string }',
    multiOptions: 'string[]',
  };
  return typeMap[fieldType] || 'any';
}

// Generate load functions
function generateLoadFile(resource: ResourceConfig, outputDir: string): void {
  if (!resource.hasLoadOptions && !resource.hasListSearch) {
    return;
  }
  
  const resourceName = resource.value;
  const ResourceName = toPascalCase(resourceName);
  
  let content = `import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';\n`;
  content += `import { apiRequest } from '../../helpers/apiRequest';\n\n`;
  
  if (resource.hasLoadOptions) {
    content += `export async function load${ResourceName}sForDropdown(this: ILoadOptionsFunctions) {\n`;
    content += `  const response = await apiRequest.call(this, 'GET', '${resource.endpoint}', {}, { limit: 1000 });\n`;
    content += `  const items = response?.data ?? response ?? [];\n`;
    content += `  return items.map((item: any) => ({\n`;
    content += `    name: item.name || item.id,\n`;
    content += `    value: item.id,\n`;
    content += `  }));\n`;
    content += `}\n\n`;
  }
  
  if (resource.hasListSearch) {
    content += `export async function search${ResourceName}sForResourceLocator(\n`;
    content += `  this: ILoadOptionsFunctions,\n`;
    content += `  filter?: string,\n`;
    content += `): Promise<INodePropertyOptions[]> {\n`;
    content += `  const qs = filter ? { search: filter } : {};\n`;
    content += `  const response = await apiRequest.call(this, 'GET', '${resource.endpoint}', {}, qs);\n`;
    content += `  const items = response?.data ?? response ?? [];\n`;
    content += `  return items.map((item: any) => ({\n`;
    content += `    name: item.name || item.id,\n`;
    content += `    value: item.id,\n`;
    content += `  }));\n`;
    content += `}\n`;
  }
  
  const loadDir = path.join(outputDir, `resources/${resourceName}/load`);
  if (!fs.existsSync(loadDir)) {
    fs.mkdirSync(loadDir, { recursive: true });
  }
  
  const filePath = path.join(loadDir, `${resourceName}.load.ts`);
  fs.writeFileSync(filePath, content);
  console.log(`✓ Generated: ${filePath}`);
}

// Main generator function
function generateNode(config: GeneratorConfig, baseDir: string): void {
  const nodesDir = path.join(baseDir, 'nodes', 'MyApi');
  const descriptionsDir = path.join(nodesDir, 'descriptions');
  
  // Create directories
  if (!fs.existsSync(descriptionsDir)) {
    fs.mkdirSync(descriptionsDir, { recursive: true });
  }
  
  console.log('Generating n8n node files...\n');
  
  // Generate files for each resource
  config.resources.forEach(resource => {
    console.log(`\nGenerating files for resource: ${resource.displayName}`);
    
    // Generate description file
    generateDescriptionFile(resource, nodesDir);
    
    // Generate operation files
    resource.operations.forEach(operation => {
      generateOperationFile(resource, operation, nodesDir);
    });
    
    // Generate load file
    generateLoadFile(resource, nodesDir);
  });
  
  console.log('\n✓ Generation complete!');
  console.log('\nNext steps:');
  console.log('1. Review the generated files');
  console.log('2. Update MyApi.node.ts to import and register the new resources');
  console.log('3. Customize any complex logic as needed');
  console.log('4. Run: npm run build');
  console.log('5. Test in n8n: npm run dev');
}

// Read config and generate
const configPath = process.argv[2] || path.join(__dirname, '../node-generator.config.json');

if (!fs.existsSync(configPath)) {
  console.error(`Error: Configuration file not found: ${configPath}`);
  console.error('Please create a node-generator.config.json file (see node-generator.config.example.json)');
  process.exit(1);
}

const config: GeneratorConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
// baseDir should be the directory containing the config file (n8n-nodes-myapi)
const baseDir = path.dirname(configPath);

generateNode(config, baseDir);

