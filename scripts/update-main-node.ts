#!/usr/bin/env ts-node
/**
 * Helper script to update MyApi.node.ts with new resources
 * This script reads the config and updates imports and switch statements
 */

import * as fs from 'fs';
import * as path from 'path';

interface ResourceConfig {
  name: string;
  value: string;
  displayName: string;
  operations: Array<{ name: string; value: string }>;
  hasLoadOptions?: boolean;
  hasListSearch?: boolean;
}

interface GeneratorConfig {
  resources: ResourceConfig[];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toPascalCase(str: string): string {
  return str.split(/[-_]/).map(capitalize).join('');
}

function updateMainNodeFile(config: GeneratorConfig, baseDir: string): void {
  const nodeFilePath = path.join(baseDir, 'nodes', 'MyApi', 'MyApi.node.ts');
  
  if (!fs.existsSync(nodeFilePath)) {
    console.error(`Error: MyApi.node.ts not found at ${nodeFilePath}`);
    return;
  }
  
  let content = fs.readFileSync(nodeFilePath, 'utf-8');
  
  // Generate import statements for descriptions
  const descriptionImports: string[] = [];
  const descriptionSpreads: string[] = [];
  
  // Generate import statements for operations
  const operationImports: string[] = [];
  
  // Generate load function imports
  const loadImports: string[] = [];
  const loadOptionsMethods: string[] = [];
  const listSearchMethods: string[] = [];
  
  // Generate switch cases
  const switchCases: string[] = [];
  
  config.resources.forEach(resource => {
    const resourceName = resource.value;
    const ResourceName = toPascalCase(resourceName);
    
    // Description imports
    descriptionImports.push(
      `import { ${resourceName}Operations, ${resourceName}Fields } from './descriptions/${resourceName}.descriptions';`
    );
    descriptionSpreads.push(`      ...${resourceName}Operations,`);
    descriptionSpreads.push(`      ...${resourceName}Fields,`);
    
    // Operation imports
    resource.operations.forEach(op => {
      const opName = op.value;
      const functionName = opName === 'getAll' 
        ? `getAll${ResourceName}s`
        : opName === 'getById'
        ? `get${ResourceName}ById`
        : `${opName}${ResourceName}`;
      
      operationImports.push(
        `import { ${functionName} } from './resources/${resourceName}/${resourceName}.${opName}';`
      );
    });
    
    // Load function imports
    if (resource.hasLoadOptions) {
      loadImports.push(
        `import { load${ResourceName}sForDropdown } from './resources/${resourceName}/load/${resourceName}.load';`
      );
      loadOptionsMethods.push(`      get${ResourceName}s: load${ResourceName}sForDropdown,`);
    }
    
    if (resource.hasListSearch) {
      loadImports.push(
        `import { search${ResourceName}sForResourceLocator } from './resources/${resourceName}/load/${resourceName}.load';`
      );
      listSearchMethods.push(`      search${ResourceName}s: search${ResourceName}sForResourceLocator,`);
    }
    
    // Generate switch case
    let switchCase = `        // ${ResourceName.toUpperCase()} RESOURCE\n`;
    switchCase += `        else if (resource === '${resourceName}') {\n`;
    switchCase += `          switch (operation) {\n`;
    
    resource.operations.forEach(op => {
      const opName = op.value;
      const functionName = opName === 'getAll' 
        ? `getAll${ResourceName}s`
        : opName === 'getById'
        ? `get${ResourceName}ById`
        : `${opName}${ResourceName}`;
      
      switchCase += `            case '${opName}':\n`;
      switchCase += `              data = await ${functionName}.call(this, i);\n`;
      switchCase += `              break;\n\n`;
    });
    
    switchCase += `            default:\n`;
    switchCase += `              throw new Error(\`Operation "\${operation}" not supported for ${ResourceName}\`);\n`;
    switchCase += `          }\n`;
    switchCase += `        }`;
    
    switchCases.push(switchCase);
  });
  
  // Update resource options in properties
  const resourceOptions = config.resources.map(r => 
    `          { name: '${r.displayName}', value: '${r.value}' },`
  ).join('\n');
  
  // Note: This is a simple approach. For production, you'd want to use AST parsing
  // For now, we'll just output what needs to be added/updated
  
  console.log('\n=== UPDATES NEEDED FOR MyApi.node.ts ===\n');
  
  console.log('1. Add these imports after existing description imports:');
  descriptionImports.forEach(imp => console.log(`   ${imp}`));
  
  console.log('\n2. Add these operation imports after existing operation imports:');
  operationImports.forEach(imp => console.log(`   ${imp}`));
  
  if (loadImports.length > 0) {
    console.log('\n3. Add these load function imports:');
    loadImports.forEach(imp => console.log(`   ${imp}`));
  }
  
  console.log('\n4. Add to resource options array:');
  console.log(`   ${resourceOptions}`);
  
  console.log('\n5. Add to properties array (after resource selector):');
  descriptionSpreads.forEach(spread => console.log(`   ${spread}`));
  
  if (loadOptionsMethods.length > 0 || listSearchMethods.length > 0) {
    console.log('\n6. Add to methods.loadOptions:');
    loadOptionsMethods.forEach(method => console.log(`   ${method}`));
    
    if (listSearchMethods.length > 0) {
      console.log('\n7. Add to methods.listSearch:');
      listSearchMethods.forEach(method => console.log(`   ${method}`));
    }
  }
  
  console.log('\n8. Add these switch cases in the execute method:');
  switchCases.forEach(sw => {
    console.log(`\n${sw}`);
  });
  
  console.log('\n=== END OF UPDATES ===\n');
  console.log('Note: This script shows what needs to be updated.');
  console.log('You may need to manually integrate these changes into MyApi.node.ts');
}

// Read config
const configPath = process.argv[2] || path.join(__dirname, '../node-generator.config.json');

if (!fs.existsSync(configPath)) {
  console.error(`Error: Configuration file not found: ${configPath}`);
  process.exit(1);
}

const config: GeneratorConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const baseDir = path.dirname(path.dirname(configPath));

updateMainNodeFile(config, baseDir);

