import * as fs from 'fs';
import * as path from 'path';
import { SwaggerParser, SwaggerEndpoint } from '../extractor/swagger-parser';
import { DescriptionTemplate } from './templates/description-template';
import { ResourceTemplate } from './templates/resource-template';

export class NodeGenerator {
    private outputDir: string;
    private parser: SwaggerParser;
    private resourceMap: Map<string, SwaggerEndpoint[]>;

    constructor(swaggerUrl: string, outputDir: string) {
        this.parser = new SwaggerParser(swaggerUrl);
        this.outputDir = outputDir;
        this.resourceMap = new Map();
        
    }

    async generate(): Promise<void> {
        console.log('\n🚀 Starting node generation...\n');

        await this.parser.fetchSwagger();
        const endpoints = this.parser.extractEndpoints();
        this.resourceMap = this.parser.groupByResource(endpoints);

        // Generate for each resource
        for (const [resource, endpoints] of this.resourceMap) {
            await this.generateResource(resource, endpoints);
        }

        console.log('\n✅ Node generation complete!');
    }

    private async generateResource(resource: string, endpoints: SwaggerEndpoint[]): Promise<void> {
        console.log(`\n📦 Generating resource: ${resource}`);

        const resourceName = this.toCamelCase(resource);
        const resourceDir = path.join(this.outputDir, 'nodes', 'MyApi', 'resources', resourceName);
        const loadDir = path.join(resourceDir, 'load');
        const schemas = this.parser.extractSchemas();

        // Create directories
        if (!fs.existsSync(resourceDir)) {
            fs.mkdirSync(resourceDir, { recursive: true });
            console.log(`  ✓ Created directory: ${resourceDir}`);
        }

        if (!fs.existsSync(loadDir)) {
            fs.mkdirSync(loadDir, { recursive: true });
            console.log(`  ✓ Created directory: ${loadDir}`);
        }

        // Generate description file
        await this.generateDescriptionFile(resource, endpoints, schemas);

        // Generate resource operation files
        for (const endpoint of endpoints) {
            await this.generateResourceFile(resource, endpoint, schemas);
        }

        // Generate load file
        await this.generateLoadFile(resource);
    }

    private async generateDescriptionFile(resource: string, endpoints: SwaggerEndpoint[], schemas: Record<string, any>): Promise<void> {
        const template = new DescriptionTemplate(resource, endpoints, schemas);
        const content = template.generate();

        const filePath = path.join(
            this.outputDir,
            'nodes',
            'MyApi',
            'descriptions',
            `${this.toCamelCase(resource)}.descriptions.ts`
        );

        // Create descriptions directory if it doesn't exist
        const descDir = path.dirname(filePath);
        if (!fs.existsSync(descDir)) {
            fs.mkdirSync(descDir, { recursive: true });
        }

        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Generated description: ${path.basename(filePath)}`);
    }

    private async generateResourceFile(resource: string, endpoint: SwaggerEndpoint, schemas: Record<string, any>): Promise<void> {
        const operation = this.inferOperation(endpoint);
        const template = new ResourceTemplate(resource, endpoint, operation, schemas);
        const content = template.generate();

        const fileName = `${this.toCamelCase(resource)}.${operation}.ts`;
        const filePath = path.join(
            this.outputDir,
            'nodes',
            'MyApi',
            'resources',
            this.toCamelCase(resource),
            fileName
        );

        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Generated operation: ${fileName}`);
    }

    private async generateLoadFile(resource: string): Promise<void> {
        const resourceName = this.toCamelCase(resource);
        const capitalizedResource = this.capitalize(resourceName);

        const content = `import { ILoadOptionsFunctions } from 'n8n-workflow';
import { apiRequest } from '../../../helpers/apiRequest';

/**
 * Load ${resource}s for dropdown
 */
export async function load${capitalizedResource}sForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/${resource.toLowerCase()}s');
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return items.map((item: any) => ({
    name: item.name || item.title || \`${capitalizedResource} #\${item.id}\`,
    value: item.id,
  }));
}

/**
 * Search ${resource}s for resource locator
 */
export async function search${capitalizedResource}sForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string
) {
  const response = await apiRequest.call(this, 'GET', '/api/v2/${resource.toLowerCase()}s', {}, { search: filter });
  const items = response?.data ?? response?.items ?? response ?? [];
  
  return {
    results: items.map((item: any) => ({
      name: item.name || item.title || \`${capitalizedResource} #\${item.id}\`,
      value: item.id,
      url: \`/api/v2/${resource.toLowerCase()}s/\${item.id}\`,
    })),
  };
}
`;

        const filePath = path.join(
            this.outputDir,
            'nodes',
            'MyApi',
            'resources',
            resourceName,
            'load',
            `${resourceName}.load.ts`
        );

        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Generated load file: ${resourceName}.load.ts`);
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

    private toCamelCase(str: string): string {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getResourceMap(): Map<string, SwaggerEndpoint[]> {
        return this.resourceMap;
    }
}
