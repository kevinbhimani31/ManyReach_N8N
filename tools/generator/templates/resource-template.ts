import { SwaggerEndpoint } from '../../extractor/swagger-parser';

export class ResourceTemplate {
  constructor(
    private resource: string,
    private endpoint: SwaggerEndpoint,
    private operation: string,
    private schemas: Record<string, any>
  ) { }

  generate(): string {
    switch (this.operation) {
      case 'getAll':
        return this.generateGetAll();
      case 'getById':
        return this.generateGetById();
      case 'create':
        return this.generateCreate();
      case 'update':
        return this.generateUpdate();
      case 'delete':
        return this.generateDelete();
      default:
        return this.generateCustom();
    }
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

  private generateGetAll(): string {
    const hasPage = this.endpoint.parameters.some(p => p.name.toLowerCase() === 'page');
    const hasLimit = this.endpoint.parameters.some(p => p.name.toLowerCase() === 'limit');

    return `import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
${hasPage || hasLimit ? "import { ensurePagination } from '../../helpers/validation';" : ''}

/**
 * Get all ${this.resource}s
 * ${this.endpoint.description || 'Fetches a list of ' + this.resource + 's'}
 */
export async function getAll${this.capitalize(this.resource)}s(this: IExecuteFunctions, index: number) {
${hasPage && hasLimit ? `  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  
  ensurePagination(page, limit);
  
  const response = await apiRequest.call(this, 'GET', '${this.endpoint.path}', {}, { page, limit });
  
  return {
    items: response?.data ?? response?.items ?? response ?? [],
    pagination: { page, limit, total: response?.total ?? null },
  };` : `  const response = await apiRequest.call(this, 'GET', '${this.endpoint.path}');
  return response?.data ?? response ?? [];`}
}
`;
  }

  private generateGetById(): string {
    const pathWithId = this.endpoint.path.replace(/{id}/gi, '${id}');

    return `import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Get ${this.resource} by ID
 * ${this.endpoint.description || 'Fetches a single ' + this.resource + ' by ID'}
 */
export async function get${this.capitalize(this.resource)}ById(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('${this.resource.toLowerCase()}Id', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'GET', \`${pathWithId}\`);
  return response;
}
`;
  }

  private generateCreate(): string {
    const bodyParams = this.endpoint.parameters.filter(p => p.in === 'body');
    let bodySchema = bodyParams[0]?.schema;

    // Resolve schema
    bodySchema = this.resolveSchema(bodySchema);

    if (!bodySchema || !bodySchema.properties) {
      return this.generateSimpleCreate();
    }

    const requiredFields = bodySchema.required || [];
    const allProps = Object.keys(bodySchema.properties);
    const optionalFields = allProps.filter(k => !requiredFields.includes(k));

    return `import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create ${this.resource}
 * ${this.endpoint.description || 'Creates a new ' + this.resource}
 */
export async function create${this.capitalize(this.resource)}(this: IExecuteFunctions, index: number) {
  const body: any = {};
  
  // Required fields
${requiredFields.map((field: string) => `  body.${field} = this.getNodeParameter('${field}', index) as any;`).join('\n')}
  
  // Optional fields
  ${optionalFields.length > 0 ? `const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
${optionalFields.map((field: string) => `  if (additionalFields.${field} !== undefined) body.${field} = additionalFields.${field};`).join('\n')}` : ''}
  
  const response = await apiRequest.call(this, 'POST', '${this.endpoint.path}', body);
  return response;
}
`;
  }

  private generateUpdate(): string {
    const hasId = this.endpoint.path.includes('{id}');
    const pathWithId = this.endpoint.path.replace(/{id}/gi, '${id}');

    return `import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
${hasId ? "import { extractResourceId } from '../../helpers/validation';" : ''}

/**
 * Update ${this.resource}
 * ${this.endpoint.description || 'Updates an existing ' + this.resource}
 */
export async function update${this.capitalize(this.resource)}(this: IExecuteFunctions, index: number) {
${hasId ? `  const resourceLocator = this.getNodeParameter('${this.resource.toLowerCase()}Id', index) as any;
  const id = extractResourceId(resourceLocator);` : ''}
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const response = await apiRequest.call(this, 'PUT', \`${pathWithId}\`, updateFields);
  return response;
}
`;
  }

  private generateDelete(): string {
    const pathWithId = this.endpoint.path.replace(/{id}/gi, '${id}');

    return `import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { extractResourceId } from '../../helpers/validation';

/**
 * Delete ${this.resource}
 * ${this.endpoint.description || 'Deletes a ' + this.resource}
 */
export async function delete${this.capitalize(this.resource)}(this: IExecuteFunctions, index: number) {
  const resourceLocator = this.getNodeParameter('${this.resource.toLowerCase()}Id', index) as any;
  const id = extractResourceId(resourceLocator);
  
  const response = await apiRequest.call(this, 'DELETE', \`${pathWithId}\`);
  return response;
}
`;
  }

  private generateSimpleCreate(): string {
    return `import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create ${this.resource}
 * ${this.endpoint.description || 'Creates a new ' + this.resource}
 */
export async function create${this.capitalize(this.resource)}(this: IExecuteFunctions, index: number) {
  const body = this.getNodeParameter('body', index, {}) as any;
  const response = await apiRequest.call(this, 'POST', '${this.endpoint.path}', body);
  return response;
}
`;
  }

  private generateCustom(): string {
    const pathParams = this.endpoint.parameters.filter(p => p.in === 'path');
    const bodyParams = this.endpoint.parameters.filter(p => p.in === 'body');
    const queryParams = this.endpoint.parameters.filter(p => p.in === 'query');

    const pathWithId = this.endpoint.path.replace(/{(\w+)}/g, '${$1}');
    const funcName = `${this.operation}${this.capitalize(this.resource)}`;

    // Determine if we need to extract ID
    const hasId = pathParams.some(p => p.name.toLowerCase() === 'id');

    // Body construction logic
    let bodyConstruction = 'const body = {};';
    if (bodyParams.length > 0) {
      const bodyParam = bodyParams[0];
      let bodySchema = this.resolveSchema(bodyParam.schema);

      if (bodySchema && bodySchema.properties) {
        const requiredFields = bodySchema.required || [];
        const allProps = Object.keys(bodySchema.properties);
        const optionalFields = allProps.filter(k => !requiredFields.includes(k));

        bodyConstruction = `const body: any = {};
  
  // Required fields
  ${requiredFields.map((field: string) => `body.${field} = this.getNodeParameter('${field}', index) as any;`).join('\n  ')}
  
  // Optional fields
  ${optionalFields.length > 0 ? `const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  ${optionalFields.map((field: string) => `if (additionalFields.${field} !== undefined) body.${field} = additionalFields.${field};`).join('\n  ')}` : ''}`;
      } else {
        bodyConstruction = `const body = this.getNodeParameter('body', index, {}) as any;`;
      }
    }

    return `import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
${hasId ? "import { extractResourceId } from '../../helpers/validation';" : ''}

/**
 * ${this.capitalize(this.operation)} ${this.resource}
 * ${this.endpoint.description || 'Custom operation for ' + this.resource}
 */
export async function ${funcName}(this: IExecuteFunctions, index: number) {
${hasId ? `  const resourceLocator = this.getNodeParameter('${this.resource.toLowerCase()}Id', index) as any;
  const id = extractResourceId(resourceLocator);` : ''}
  
  ${pathParams.filter(p => p.name.toLowerCase() !== 'id').map(p => `const ${p.name} = this.getNodeParameter('${p.name}', index) as any;`).join('\n  ')}
  
  ${bodyConstruction}
  
  const qs: any = {};
  ${queryParams.map(p => `const ${p.name} = this.getNodeParameter('${p.name}', index, undefined) as any;
  if (${p.name} !== undefined) {
    qs.${p.name} = ${p.name};
  }`).join('\n  ')}
  
  const response = await apiRequest.call(this, '${this.endpoint.method}', \`${pathWithId}\`, body, qs);
  return response;
}
`;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
