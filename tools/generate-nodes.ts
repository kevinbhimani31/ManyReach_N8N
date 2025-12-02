import { SwaggerParser } from './extractor/swagger-parser';
import { ChangeDetector } from './detector/change-detector';
import { NodeGenerator } from './generator/node-generator';
import { MainNodeUpdater } from './generator/main-node-updater';
import { PackageUpdater } from './generator/package-updater';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
    console.log('🤖 n8n Node Auto-Generator');
    console.log('==========================\n');

    // Configuration
    const SWAGGER_URL = process.env.SWAGGER_URL || 'https://localhost:44398/Swagger/Docs/v2';
    const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, '..');
    const CACHE_DIR = path.join(__dirname, '../cache');
    const PREVIOUS_SWAGGER = path.join(CACHE_DIR, 'swagger-previous.json');
    const CURRENT_SWAGGER = path.join(CACHE_DIR, 'swagger-latest.json');

    // Ensure cache directory exists
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    try {
        console.log('🔍 Fetching Swagger documentation...');
        console.log(`   URL: ${SWAGGER_URL}\n`);

        const parser = new SwaggerParser(SWAGGER_URL);
        await parser.fetchSwagger();

        // Check if we should regenerate
        if (fs.existsSync(PREVIOUS_SWAGGER) && fs.existsSync(CURRENT_SWAGGER)) {
            console.log('🔎 Detecting changes...');
            const detector = new ChangeDetector(PREVIOUS_SWAGGER, CURRENT_SWAGGER);
            detector.printReport();

            if (!detector.shouldRegenerate()) {
                console.log('\n✅ No changes detected. Skipping generation.');
                return;
            }
        } else {
            console.log('📝 First run detected - will generate all nodes\n');
        }

        console.log('🚀 Generating n8n nodes...');
        const generator = new NodeGenerator(SWAGGER_URL, OUTPUT_DIR);
        await generator.generate();

        console.log('\n📝 Updating main node file...');
        const resourceMap = generator.getResourceMap();
        const resources = Array.from(resourceMap.keys());

        const mainUpdater = new MainNodeUpdater(OUTPUT_DIR, resources);
        mainUpdater.update();

        console.log('\n📦 Updating package.json...');
        const packageUpdater = new PackageUpdater(OUTPUT_DIR);
        packageUpdater.update();

        // Save current as previous for next run
        if (fs.existsSync(CURRENT_SWAGGER)) {
            fs.copyFileSync(CURRENT_SWAGGER, PREVIOUS_SWAGGER);
            console.log('\n💾 Saved current Swagger as baseline for next run');
        }

        console.log('\n✅ Node generation complete!');
        console.log('\n📋 Next steps:');
        console.log('   1. Run: npm run build');
        console.log('   2. Test nodes in n8n');
        console.log('   3. Commit generated files\n');

    } catch (error: any) {
        console.error('\n❌ Error during generation:');
        console.error(error.message);
        if (error.stack) {
            console.error('\nStack trace:');
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

export { main };
