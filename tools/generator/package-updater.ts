import * as fs from 'fs';
import * as path from 'path';

export class PackageUpdater {
    constructor(private outputDir: string) { }

    update(): void {
        console.log('\n📦 Updating package.json...');

        const packagePath = path.join(this.outputDir, 'package.json');

        if (!fs.existsSync(packagePath)) {
            console.warn('  ⚠️ package.json not found, skipping update');
            return;
        }

        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

        // Ensure n8n section exists
        if (!packageJson.n8n) {
            packageJson.n8n = {};
        }

        // Update nodes list (keep existing nodes, add MyApi if not present)
        if (!packageJson.n8n.nodes) {
            packageJson.n8n.nodes = [];
        }

        const myApiNode = 'dist/nodes/MyApi/MyApi.node.js';
        if (!packageJson.n8n.nodes.includes(myApiNode)) {
            packageJson.n8n.nodes.push(myApiNode);
        }

        // Update credentials list (keep existing, add MyApi if not present)
        if (!packageJson.n8n.credentials) {
            packageJson.n8n.credentials = [];
        }

        const myApiCred = 'dist/credentials/MyApi.credentials.js';
        if (!packageJson.n8n.credentials.includes(myApiCred)) {
            packageJson.n8n.credentials.push(myApiCred);
        }

        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
        console.log(`  ✓ Updated: ${packagePath}`);
    }
}
