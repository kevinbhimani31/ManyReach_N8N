import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { SwaggerEndpoint } from '../extractor/swagger-parser';

export interface ChangeReport {
    added: SwaggerEndpoint[];
    removed: SwaggerEndpoint[];
    modified: SwaggerEndpoint[];
    unchanged: SwaggerEndpoint[];
    schemasChanged: boolean;
}

export class ChangeDetector {
    private previousSwagger: any;
    private currentSwagger: any;

    constructor(previousPath: string, currentPath: string) {
        try {
            this.previousSwagger = fs.existsSync(previousPath)
                ? JSON.parse(fs.readFileSync(previousPath, 'utf-8'))
                : { paths: {} };

            this.currentSwagger = JSON.parse(fs.readFileSync(currentPath, 'utf-8'));
        } catch (error: any) {
            throw new Error(`Failed to load Swagger files: ${error.message}`);
        }
    }

    detectChanges(): ChangeReport {
        const prevEndpoints = this.extractEndpointSignatures(this.previousSwagger);
        const currEndpoints = this.extractEndpointSignatures(this.currentSwagger);

        const report: ChangeReport = {
            added: [],
            removed: [],
            modified: [],
            unchanged: [],
            schemasChanged: this.hasSchemasChanged()
        };

        // Find added and modified endpoints
        for (const [key, endpoint] of currEndpoints) {
            if (!prevEndpoints.has(key)) {
                report.added.push(endpoint);
            } else if (this.hasChanged(prevEndpoints.get(key)!, endpoint)) {
                report.modified.push(endpoint);
                console.log(`Modified endpoint detected: ${endpoint.method} ${endpoint.path}`);
            } else {
                report.unchanged.push(endpoint);
            }
        }

        // Find removed endpoints
        for (const [key, endpoint] of prevEndpoints) {
            if (!currEndpoints.has(key)) {
                report.removed.push(endpoint);
                console.log(`Removed endpoint detected: ${endpoint.method} ${endpoint.path}`);
            }
        }

        return report;
    }

    private extractEndpointSignatures(swagger: any): Map<string, any> {
        const signatures = new Map<string, any>();
        const paths = swagger.paths || {};

        for (const [path, pathItem] of Object.entries(paths as any)) {
            for (const [method, operation] of Object.entries(pathItem as any)) {
                if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
                    const op = operation as any;
                    const key = `${method.toUpperCase()}:${path}`;
                    signatures.set(key, {
                        path,
                        method: method.toUpperCase(),
                        operationId: op.operationId || '',
                        summary: op.summary || '',
                        description: op.description || '',
                        parameters: op.parameters || [],
                        responses: op.responses || {},
                        tags: op.tags || []
                    });
                }
            }
        }

        return signatures;
    }

    private hasChanged(prev: any, curr: any): boolean {
        const prevHash = this.hashEndpoint(prev);
        const currHash = this.hashEndpoint(curr);
        return prevHash !== currHash;
    }

    private hashEndpoint(endpoint: any): string {
        const normalized = JSON.stringify({
            parameters: endpoint.parameters,
            responses: endpoint.responses,
            summary: endpoint.summary,
            description: endpoint.description
        });
        return crypto.createHash('md5').update(normalized).digest('hex');
    }

    private hasSchemasChanged(): boolean {
        const prevSchemas = this.previousSwagger.definitions || this.previousSwagger.components?.schemas || {};
        const currSchemas = this.currentSwagger.definitions || this.currentSwagger.components?.schemas || {};

        const prevHash = crypto.createHash('md5').update(JSON.stringify(prevSchemas)).digest('hex');
        const currHash = crypto.createHash('md5').update(JSON.stringify(currSchemas)).digest('hex');

        if (prevHash !== currHash) {
            console.log('📦 Schema definitions have changed');
            return true;
        }
        return false;
    }

    shouldRegenerate(): boolean {
        const changes = this.detectChanges();
        return changes.added.length > 0 ||
            changes.removed.length > 0 ||
            changes.modified.length > 0 ||
            changes.schemasChanged;
    }

    printReport(): void {
        const changes = this.detectChanges();

        console.log('\n📊 Change Detection Report:');
        console.log(`  ✅ Unchanged: ${changes.unchanged.length}`);
        console.log(`  ➕ Added: ${changes.added.length}`);
        console.log(`  ✏️  Modified: ${changes.modified.length}`);
        console.log(`  ➖ Removed: ${changes.removed.length}`);
        console.log(`  📦 Schemas Changed: ${changes.schemasChanged ? 'YES' : 'No'}`);

        if (changes.added.length > 0) {
            console.log('\n  Added endpoints:');
            changes.added.forEach(ep => console.log(`    - ${ep.method} ${ep.path}`));
        }

        if (changes.modified.length > 0) {
            console.log('\n  Modified endpoints:');
            changes.modified.forEach(ep => console.log(`    - ${ep.method} ${ep.path}`));
        }

        if (changes.removed.length > 0) {
            console.log('\n  Removed endpoints:');
            changes.removed.forEach(ep => console.log(`    - ${ep.method} ${ep.path}`));
        }
    }
}
