import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export interface SwaggerEndpoint {
    path: string;
    method: string;
    operationId: string;
    summary: string;
    description: string;
    parameters: SwaggerParameter[];
    responses: Record<string, SwaggerResponse>;
    tags: string[];
}

export interface SwaggerParameter {
    name: string;
    in: 'query' | 'path' | 'body' | 'header' | 'formData';
    required: boolean;
    type: string;
    schema?: any;
    description?: string;
    default?: any;
    enum?: (string | number)[];
}

export interface SwaggerResponse {
    description: string;
    schema?: any;
}

export class SwaggerParser {
    private swaggerUrl: string;
    private swaggerData: any;

    constructor(swaggerUrl: string) {
        this.swaggerUrl = swaggerUrl;
    }

    async fetchSwagger(): Promise<void> {
        try {
            const https = require('https');
            const response = await axios.get(this.swaggerUrl, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false // Allow self-signed certificates
                })
            });
            this.swaggerData = response.data;

            // Save for comparison
            const cachePath = path.join(__dirname, '../../cache/swagger-latest.json');
            fs.writeFileSync(cachePath, JSON.stringify(this.swaggerData, null, 2));

            console.log('✅ Swagger JSON fetched and cached successfully');
        } catch (error: any) {
            throw new Error(`Failed to fetch Swagger JSON: ${error.message}`);
        }
    }

    extractEndpoints(): SwaggerEndpoint[] {
        const endpoints: SwaggerEndpoint[] = [];
        const paths = this.swaggerData.paths;

        if (!paths) {
            console.warn('⚠️ No paths found in Swagger JSON');
            return endpoints;
        }

        for (const [path, pathItem] of Object.entries(paths as any)) {
            for (const [method, operation] of Object.entries(pathItem as any)) {
                if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
                    const op = operation as any;
                    endpoints.push({
                        path,
                        method: method.toUpperCase(),
                        operationId: op.operationId || `${method}_${path.replace(/\//g, '_')}`,
                        summary: op.summary || '',
                        description: op.description || '',
                        parameters: op.parameters || [],
                        responses: op.responses || {},
                        tags: op.tags || []
                    });
                }
            }
        }

        console.log(`📊 Extracted ${endpoints.length} endpoints`);
        return endpoints;
    }

    extractSchemas(): Record<string, any> {
        return this.swaggerData.definitions || this.swaggerData.components?.schemas || {};
    }

    groupByResource(endpoints: SwaggerEndpoint[]): Map<string, SwaggerEndpoint[]> {
        const grouped = new Map<string, SwaggerEndpoint[]>();

        endpoints.forEach(endpoint => {
            const resource = endpoint.tags[0] || this.inferResourceFromPath(endpoint.path);
            const resourceKey = resource.toLowerCase();

            if (!grouped.has(resourceKey)) {
                grouped.set(resourceKey, []);
            }
            grouped.get(resourceKey)!.push(endpoint);
        });

        console.log(`📦 Grouped into ${grouped.size} resources:`, Array.from(grouped.keys()));
        return grouped;
    }

    private inferResourceFromPath(path: string): string {
        const parts = path.split('/').filter(p => p && !p.startsWith('{'));
        return parts[0] || 'default';
    }

    getSwaggerData(): any {
        return this.swaggerData;
    }
}
