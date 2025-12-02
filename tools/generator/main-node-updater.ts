import * as fs from 'fs';
import * as path from 'path';

export class MainNodeUpdater {
  constructor(private outputDir: string, private resources: string[]) { }

  update(): void {
    console.log('\n📝 Updating main node file...');

    const mainNodePath = path.join(this.outputDir, 'nodes', 'MyApi', 'MyApi.node.ts');

    const resourceOperations = this.scanResourceOperations();

    const imports = this.generateImports(resourceOperations);
    const resourceOptions = this.generateResourceOptions();
    const properties = this.generateProperties();
    const executeLogic = this.generateExecuteLogic(resourceOperations);
    const loadOptions = this.generateLoadOptions();
    const listSearch = this.generateListSearch();

    const content = `import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

${imports}

import { handleExecutionError } from './helpers/errorHandler';

export class MyApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'ManyReach',
    name: 'myApi',
    icon: 'file:ManyReach.png',
    group: ['transform'],
    version: 1,
    description: 'Interact with ManyReach API',

    defaults: {
      name: 'MyApi',
      color: '#1A82e2',
    },

    inputs: ['main'],
    outputs: ['main'],

    credentials: [
      {
        name: 'myApi',
        required: true,
      },
    ],

    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        default: '${this.resources[0] || 'user'}',
        options: [
${resourceOptions}
        ],
      },

${properties}
    ],
  };

  methods = {
    loadOptions: {
${loadOptions}
    },
    listSearch: {
${listSearch}
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let data;

${executeLogic}

        returnData.push({ json: data });

      } catch (error) {
        const err = handleExecutionError(error);
        returnData.push({ json: err });
      }
    }

    return this.prepareOutputData(returnData);
  }
}
`;

    fs.writeFileSync(mainNodePath, content);
    console.log(`  ✓ Updated: ${mainNodePath}`);
  }

  private scanResourceOperations(): Map<string, string[]> {
    const map = new Map<string, string[]>();

    for (const resource of this.resources) {
      const camelResource = this.toCamelCase(resource);
      const resourceDir = path.join(this.outputDir, 'nodes', 'MyApi', 'resources', camelResource);

      if (!fs.existsSync(resourceDir)) continue;

      const files = fs.readdirSync(resourceDir);
      const operations: string[] = [];

      for (const file of files) {
        if (file.endsWith('.ts') && !file.endsWith('.load.ts') && !file.endsWith('.descriptions.ts')) {
          // Extract operation from filename: resource.operation.ts
          const parts = file.split('.');
          if (parts.length >= 3) {
            // parts[0] is resource, parts[1] is operation (or parts[1...n-1] if dots in op name)
            const opName = parts.slice(1, parts.length - 1).join('.');
            operations.push(opName);
          }
        }
      }
      map.set(resource, operations);
    }
    return map;
  }

  private generateImports(resourceOperations: Map<string, string[]>): string {
    const imports: string[] = [];

    for (const resource of this.resources) {
      const camelResource = this.toCamelCase(resource);
      const capResource = this.capitalize(camelResource);
      const operations = resourceOperations.get(resource) || [];

      // Import descriptions
      imports.push(`// ${capResource} descriptions`);
      imports.push(`import { ${camelResource}Operations, ${camelResource}Fields } from './descriptions/${camelResource}.descriptions';`);
      imports.push('');

      // Import operations
      imports.push(`// ${capResource} operations`);

      for (const op of operations) {
        const funcName = this.getFunctionName(op, capResource);
        imports.push(`import { ${funcName} } from './resources/${camelResource}/${camelResource}.${op}';`);
      }

      // Import load functions
      imports.push(`import { load${capResource}sForDropdown, search${capResource}sForResourceLocator } from './resources/${camelResource}/load/${camelResource}.load';`);
      imports.push('');
    }

    return imports.join('\n');
  }

  private getFunctionName(op: string, capResource: string): string {
    if (op === 'getAll') return `getAll${capResource}s`;
    if (op === 'getById') return `get${capResource}ById`;
    if (op === 'create') return `create${capResource}`;
    if (op === 'update') return `update${capResource}`;
    if (op === 'delete') return `delete${capResource}`;

    // For custom ops like 'start', 'getSequences'
    // If op already contains the resource name (e.g. getSequences), don't append it again?
    // But our generator creates funcName = `${op}${capResource}` in ResourceTemplate
    // So we must match that.

    // Wait, ResourceTemplate.generateCustom uses:
    // const funcName = `${this.operation}${this.capitalize(this.resource)}`;

    // But inferOperation might return 'getSequences'.
    // If op is 'getSequences', funcName becomes 'getSequencesCampaign'. That looks weird.
    // But consistent.

    return `${op}${capResource}`;
  }

  private generateResourceOptions(): string {
    return this.resources
      .map(r => `          { name: '${this.capitalize(r)}', value: '${r.toLowerCase()}' }`)
      .join(',\n');
  }

  private generateProperties(): string {
    return this.resources
      .map(r => {
        const camel = this.toCamelCase(r);
        return `      ...${camel}Operations,\n      ...${camel}Fields`;
      })
      .join(',\n\n');
  }

  private generateExecuteLogic(resourceOperations: Map<string, string[]>): string {
    const cases: string[] = [];

    for (const resource of this.resources) {
      const camel = this.toCamelCase(resource);
      const cap = this.capitalize(camel);
      const operations = resourceOperations.get(resource) || [];

      let opCases = '';
      for (const op of operations) {
        const funcName = this.getFunctionName(op, cap);
        opCases += `            case '${op}':
              data = await ${funcName}.call(this, i);
              break;\n`;
      }

      cases.push(`        ${cases.length > 0 ? 'else ' : ''}if (resource === '${resource.toLowerCase()}') {
          switch (operation) {
${opCases}
            default:
              throw new Error(\`Operation "\${operation}" not supported for ${cap}\`);
          }
        }`);
    }

    cases.push(`        else {
          throw new Error(\`Resource "\${resource}" not supported\`);
        }`);

    return cases.join('\n');
  }

  private generateLoadOptions(): string {
    return this.resources
      .map(r => {
        const camel = this.toCamelCase(r);
        const cap = this.capitalize(camel);
        return `      get${cap}s: load${cap}sForDropdown`;
      })
      .join(',\n');
  }

  private generateListSearch(): string {
    return this.resources
      .map(r => {
        const camel = this.toCamelCase(r);
        const cap = this.capitalize(camel);
        return `      search${cap}s: search${cap}sForResourceLocator`;
      })
      .join(',\n');
  }

  private toCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
