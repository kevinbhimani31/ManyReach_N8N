import { SwaggerEndpoint, SwaggerParameter } from '../../extractor/swagger-parser';
import { INodeProperties } from 'n8n-workflow';

export class DescriptionTemplate {
    constructor(
        private resource: string,
        private endpoints: SwaggerEndpoint[],
        private schemas: Record<string, any>
    ) { }

    generate(): string {
        const operations = this.generateOperations();
        const fields = this.generateFields();

        return `import { INodeProperties } from 'n8n-workflow';
import { createField } from './common/fields';

export const ${this.toCamelCase(this.resource)}Operations: INodeProperties[] = [
  createField({
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    resource: '${this.resource.toLowerCase()}',
    default: '${this.getDefaultOperation()}',
    optionsList: [
${operations}
    ],
  }),
];

export const ${this.toCamelCase(this.resource)}Fields: INodeProperties[] = [
${fields}
];
`;
    }

    private generateOperations(): string {
        const uniqueOps = new Set<string>();
        const ops: string[] = [];

        this.endpoints.forEach(ep => {
            const operation = this.inferOperation(ep);
            if (!uniqueOps.has(operation)) {
                uniqueOps.add(operation);
                const name = this.operationToDisplayName(operation);
                ops.push(`      { name: '${name}', value: '${operation}' }`);
            }
        });

        return ops.join(',\n');
    }

    private generateFields(): string {
        const fields: string[] = [];
        const addedFields = new Set<string>();

        // Add pagination fields for getAll operations
        if (this.endpoints.some(ep => this.inferOperation(ep) === 'getAll')) {
            fields.push(this.generatePaginationFields());
        }

        for (const endpoint of this.endpoints) {
            const operation = this.inferOperation(endpoint);
            const endpointFields = this.generateFieldsForEndpoint(endpoint, operation);

            endpointFields.forEach(field => {
                const fieldKey = `${operation}:${this.extractFieldName(field)}`;
                if (!addedFields.has(fieldKey)) {
                    addedFields.add(fieldKey);
                    fields.push(field);
                }
            });
        }

        return fields.join(',\n\n');
    }

    private generatePaginationFields(): string {
        return `  createField({
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    resource: '${this.resource.toLowerCase()}',
    operations: ['getAll'],
  }),

  createField({
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    resource: '${this.resource.toLowerCase()}',
    operations: ['getAll'],
  })`;
    }

    private generateFieldsForEndpoint(endpoint: SwaggerEndpoint, operation: string): string[] {
        const fields: string[] = [];

        for (const param of endpoint.parameters) {
            if (param.in === 'path' && param.name.toLowerCase().includes('id')) {
                fields.push(this.generateIdField(operation));
            } else if (param.in === 'query' && !['page', 'limit'].includes(param.name)) {
                fields.push(this.generateQueryField(param, operation));
            } else if (param.in === 'body') {
                fields.push(...this.generateBodyFields(param, operation));
            }
        }

        return fields;
    }

    private generateIdField(operation: string): string {
        const resourceName = this.capitalize(this.resource);
        return `  createField({
    displayName: '${resourceName}',
    name: '${this.resource.toLowerCase()}Id',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description: 'Select a ${this.resource.toLowerCase()} from the list or enter its ID',
    resource: '${this.resource.toLowerCase()}',
    operations: ['${operation}'],
    modes: [
      {
        displayName: 'From list',
        name: 'list',
        type: 'list',
        placeholder: 'Select a ${this.resource.toLowerCase()}...',
        typeOptions: {
          searchListMethod: 'search${resourceName}s',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'Enter ${this.resource.toLowerCase()} ID',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^\\\\\\\\d+$',
              errorMessage: 'Only numeric IDs are allowed',
            },
          },
        ],
      },
    ],
  })`;
    }

    private generateQueryField(param: SwaggerParameter, operation: string): string {
        const type = this.swaggerTypeToN8nType(param.type);
        return `  createField({
    displayName: '${this.paramToDisplayName(param.name)}',
    name: '${param.name}',
    type: '${type}',
    default: ${this.getDefaultValue(param)},
    description: '${this.escapeDescription(param.description || '')}',
    resource: '${this.resource.toLowerCase()}',
    operations: ['${operation}'],
    ${param.required ? 'required: true,' : ''}
  })`;
    }

    private resolveSchema(schema: any): any {
        if (!schema) return null;

        if (schema.$ref) {
            const refName = schema.$ref.split('/').pop();
            return this.resolveSchema(this.schemas[refName]);
        }

        if (schema.allOf) {
            const merged: any = { properties: {}, required: [] };
            for (const subSchema of schema.allOf) {
                const resolved = this.resolveSchema(subSchema);
                if (resolved) {
                    if (resolved.properties) {
                        Object.assign(merged.properties, resolved.properties);
                    }
                    if (resolved.required) {
                        merged.required = [...(merged.required || []), ...(resolved.required || [])];
                    }
                }
            }
            return merged;
        }

        return schema;
    }

    private generateBodyFields(param: SwaggerParameter, operation: string): string[] {
        const fields: string[] = [];
        let schema = param.schema;

        // Resolve schema if it's a reference
        schema = this.resolveSchema(schema);

        if (!schema || !schema.properties) {
            return fields;
        }

        const required = schema.required || [];
        const properties = schema.properties;

        // Generate required fields
        for (const propName of Object.keys(properties)) {
            // Check if property is required
            const isRequired = required.includes(propName);

            // If it's required, generate a top-level field
            if (isRequired) {
                fields.push(this.generateBodyField(propName, properties[propName], operation, true));
            }
        }

        // Generate optional fields
        const optionalProps = Object.keys(properties).filter(p => !required.includes(p));
        if (optionalProps.length > 0) {
            fields.push(this.generateAdditionalFieldsCollection(optionalProps, properties, operation));
        }

        return fields;
    }

    private generateBodyField(propName: string, propDef: any, operation: string, required: boolean): string {
        const type = this.swaggerTypeToN8nType(propDef.type);
        return `  createField({
    displayName: '${this.paramToDisplayName(propName)}',
    name: '${propName}',
    type: '${type}',
    default: ${this.getDefaultValue(propDef)},
    description: '${this.escapeDescription(propDef.description || '')}',
    resource: '${this.resource.toLowerCase()}',
    operations: ['${operation}'],
    ${required ? 'required: true,' : ''}
  })`;
    }

    private generateAdditionalFieldsCollection(propNames: string[], properties: any, operation: string): string {
        const collectionName = operation === 'update' ? 'updateFields' : 'additionalFields';
        const displayName = operation === 'update' ? 'Update Fields' : 'Additional Fields';

        const options = propNames.map(propName => {
            const propDef = properties[propName];
            const type = this.swaggerTypeToN8nType(propDef.type);
            return `    { displayName: '${this.paramToDisplayName(propName)}', name: '${propName}', type: '${type}', default: ${this.getDefaultValue(propDef)} }`;
        }).join(',\n');

        return `  {
    displayName: '${displayName}',
    name: '${collectionName}',
    type: 'collection',
    default: {},
    placeholder: 'Add Field',
    displayOptions: {
      show: { resource: ['${this.resource.toLowerCase()}'], operation: ['${operation}'] },
    },
    options: [
${options}
    ],
  }`;
    }

    private swaggerTypeToN8nType(swaggerType: string): string {
        const typeMap: Record<string, string> = {
            'string': 'string',
            'integer': 'number',
            'number': 'number',
            'boolean': 'boolean',
            'array': 'multiOptions',
            'object': 'json'
        };
        return typeMap[swaggerType?.toLowerCase()] || 'string';
    }

    private getDefaultValue(param: any): string {
        if (param.default !== undefined) {
            return typeof param.default === 'string' ? `'${param.default}'` : String(param.default);
        }

        const defaults: Record<string, string> = {
            'string': "''",
            'number': '0',
            'boolean': 'false',
            'json': '{}'
        };

        return defaults[this.swaggerTypeToN8nType(param.type)] || "''";
    }

    private inferOperation(endpoint: SwaggerEndpoint): string {
        const { method, path } = endpoint;
        const parts = path.split('/').filter(p => p && !p.startsWith('{'));
        const lastPart = parts[parts.length - 1];

        // Check for specific actions at the end of path (e.g., /start, /pause, /copy)
        if (['start', 'pause', 'stop', 'copy', 'clone', 'send', 'verify'].includes(lastPart.toLowerCase())) {
            return lastPart.toLowerCase();
        }

        // Check for nested resources (e.g., /campaigns/{id}/sequences -> getSequences)
        if (path.includes('}/')) {
            const subResource = path.split('}/')[1];
            if (subResource && !subResource.includes('/')) {
                // e.g. sequences
                if (method === 'GET') return `get${this.capitalize(subResource)}`;
                if (method === 'POST') return `create${this.capitalize(subResource)}`;
            }
        }

        // Standard CRUD
        if (method === 'GET' && path.includes('{id}')) return 'getById';
        if (method === 'GET') return 'getAll';
        if (method === 'POST') return 'create';
        if (method === 'PUT' || method === 'PATCH') return 'update';
        if (method === 'DELETE') return 'delete';

        return endpoint.operationId || 'custom';
    }

    private operationToDisplayName(operation: string): string {
        const map: Record<string, string> = {
            'getAll': 'Get All',
            'getById': 'Get By ID',
            'create': 'Create',
            'update': 'Update',
            'delete': 'Delete'
        };
        return map[operation] || this.capitalize(operation);
    }

    private paramToDisplayName(param: string): string {
        return param
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private toCamelCase(str: string): string {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    private getDefaultOperation(): string {
        return this.endpoints.length > 0 ? this.inferOperation(this.endpoints[0]) : 'getAll';
    }

    private extractFieldName(field: string): string {
        const match = field.match(/name: '([^']+)'/);
        return match ? match[1] : '';
    }

    private escapeDescription(desc: string): string {
        if (!desc) return '';
        return desc
            .replace(/\\/g, '\\\\')  // Escape backslashes first
            .replace(/'/g, "\\'")     // Escape single quotes
            .replace(/"/g, '\\"')     // Escape double quotes
            .replace(/\r\n/g, ' ')    // Replace Windows newlines with space
            .replace(/\n/g, ' ')      // Replace Unix newlines with space
            .replace(/\r/g, ' ')      // Replace Mac newlines with space
            .replace(/\t/g, ' ')      // Replace tabs with space
            .replace(/\s+/g, ' ')     // Collapse multiple spaces
            .trim();                  // Remove leading/trailing whitespace
    }
}
