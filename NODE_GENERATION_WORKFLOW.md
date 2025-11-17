# N8N Custom Node Generation Workflow

This document outlines the manual workflow for creating custom n8n nodes for your APIs, and how to use the automated generator.

## Manual Workflow Overview

### Step 1: Analyze Your API
1. **Identify Resources**: List all API resources (e.g., User, Campaign, Prospect, List, ClientSpace)
2. **Map Operations**: For each resource, identify available operations:
   - `getAll` - List all items (with pagination)
   - `getById` - Get a single item by ID
   - `create` - Create a new item
   - `update` - Update an existing item
   - `delete` - Delete an item
3. **Document Endpoints**: Note the HTTP method and endpoint path for each operation
4. **Identify Fields**: For each operation, list:
   - Required fields
   - Optional fields
   - Field types (string, number, boolean, options, etc.)
   - Field validation rules
   - Default values

### Step 2: Create Description File
**Location**: `nodes/MyApi/descriptions/{resource}.descriptions.ts`

**Structure**:
1. **Operations Array**: Define available operations for the resource
   ```typescript
   export const {resource}Operations: INodeProperties[] = [
     createField({
       displayName: 'Operation',
       name: 'operation',
       type: 'options',
       resource: '{resource}',
       default: 'getAll',
       optionsList: [
         { name: 'Get All', value: 'getAll' },
         { name: 'Get By ID', value: 'getById' },
         // ... more operations
       ],
     }),
   ];s
   ```

2. **Fields Array**: Define all fields for each operation
   - Pagination fields (for `getAll`)
   - ID fields (for `getById`, `update`, `delete`)
   - Create/Update fields
   - Additional fields (optional collections)

### Step 3: Create Resource Operation Files
**Location**: `nodes/MyApi/resources/{resource}/{resource}.{operation}.ts`

**Patterns by Operation**:

#### `getAll` Operation
```typescript
export async function getAll{Resource}(this: IExecuteFunctions, index: number) {
  const page = this.getNodeParameter('page', index, 1) as number;
  const limit = this.getNodeParameter('limit', index, 100) as number;
  const startingAfter = this.getNodeParameter('startingAfter', index, 0) as number;
  ensurePagination(page, limit);
  const response = await apiRequest.call(this, 'GET', `/{resources}`, {}, { page, limit, startingAfter });
  return {
    items: response?.data ?? response ?? [],
  };
}
```

#### `getById` Operation
```typescript
export async function get{Resource}ById(this: IExecuteFunctions, index: number) {
  const {resource}Id = this.getNodeParameter('{resource}Id', index) as string;
  // Extract ID from resourceLocator
  const id = typeof {resource}Id === 'object' ? {resource}Id.value : {resource}Id;
  const response = await apiRequest.call(this, 'GET', `/{resources}/${id}`);
  return response;
}
```

#### `create` Operation
```typescript
export async function create{Resource}(this: IExecuteFunctions, index: number) {
  // Required fields
  const field1 = this.getNodeParameter('field1', index) as string;
  
  // Validation
  if (!field1 || field1.trim() === '') {
    throw new Error('Field1 is required');
  }
  
  // Build request body
  const body: any = {
    field1: field1.trim(),
  };
  
  // Optional fields
  const optionalField = this.getNodeParameter('optionalField', index, '');
  if (optionalField) {
    body.optionalField = optionalField;
  }
  
  // Additional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  // Map additional fields to body
  
  const response = await apiRequest.call(this, 'POST', `/{resources}`, body);
  return response;
}
```

#### `update` Operation
```typescript
export async function update{Resource}(this: IExecuteFunctions, index: number) {
  const {resource}Id = this.getNodeParameter('{resource}Id', index) as string;
  const id = typeof {resource}Id === 'object' ? {resource}Id.value : {resource}Id;
  
  const updateFields = this.getNodeParameter('updateFields', index, {}) as any;
  
  const body: any = {};
  // Map updateFields to body
  
  const response = await apiRequest.call(this, 'PUT', `/{resources}/${id}`, body);
  return response;
}
```

#### `delete` Operation
```typescript
export async function delete{Resource}(this: IExecuteFunctions, index: number) {
  const {resource}Id = this.getNodeParameter('{resource}Id', index) as string;
  const id = typeof {resource}Id === 'object' ? {resource}Id.value : {resource}Id;
  
  const response = await apiRequest.call(this, 'DELETE', `/{resources}/${id}`);
  return response;
}
```

### Step 4: Create Load Functions (Optional)
**Location**: `nodes/MyApi/resources/{resource}/load/{resource}.load.ts`

If you need dropdown options or resource locator search:
```typescript
export async function load{Resource}sForDropdown(this: ILoadOptionsFunctions) {
  const response = await apiRequest.call(this, 'GET', `/{resources}`, {}, { limit: 1000 });
  const items = response?.data ?? response ?? [];
  return items.map((item: any) => ({
    name: item.name || item.id,
    value: item.id,
  }));
}

export async function search{Resource}sForResourceLocator(
  this: ILoadOptionsFunctions,
  filter?: string,
): Promise<INodePropertyOptions[]> {
  const qs = filter ? { search: filter } : {};
  const response = await apiRequest.call(this, 'GET', `/{resources}`, {}, qs);
  const items = response?.data ?? response ?? [];
  return items.map((item: any) => ({
    name: item.name || item.id,
    value: item.id,
  }));
}
```

### Step 5: Update Main Node File
**Location**: `nodes/MyApi/MyApi.node.ts`

1. **Import descriptions**:
   ```typescript
   import { {resource}Operations, {resource}Fields } from './descriptions/{resource}.descriptions';
   ```

2. **Import operations**:
   ```typescript
   import { getAll{Resource}s } from './resources/{resource}/{resource}.getAll';
   import { get{Resource}ById } from './resources/{resource}/{resource}.getById';
   // ... etc
   ```

3. **Add to properties array**:
   ```typescript
   properties: [
     // ... resource selector
     ...{resource}Operations,
     ...{resource}Fields,
   ],
   ```

4. **Add to methods** (if load functions exist):
   ```typescript
   methods = {
     loadOptions: {
       get{Resource}s: load{Resource}sForDropdown,
     },
     listSearch: {
       search{Resource}s: search{Resource}sForResourceLocator,
     },
   };
   ```

5. **Add to execute switch**:
   ```typescript
   else if (resource === '{resource}') {
     switch (operation) {
       case 'getAll':
         data = await getAll{Resource}s.call(this, i);
         break;
       // ... other cases
     }
   }
   ```

### Step 6: Testing
1. Build the project: `npm run build`
2. Start n8n: `npm run dev`
3. Test each operation in the n8n UI
4. Verify error handling
5. Check field validation

## Automated Generation

Instead of manually creating all these files, you can use the generator script with a configuration file.

### Using the Generator

1. **Create a configuration file** (see `node-generator.config.example.json`)
2. **Run the generator**:
   ```bash
   npm run generate:node
   ```
3. **Review generated files**
4. **Customize as needed** (some complex logic may need manual adjustment)
5. **Test the generated node**

### Configuration File Structure

See `node-generator.config.example.json` for a complete example.

## Best Practices

1. **Consistent Naming**: Use consistent naming conventions (camelCase for variables, PascalCase for types)
2. **Error Handling**: Always use the `handleExecutionError` helper
3. **Validation**: Validate required fields before API calls
4. **Type Safety**: Define TypeScript interfaces for request/response types
5. **Documentation**: Add comments explaining complex logic
6. **Reusability**: Use helper functions for common patterns

## Common Patterns

### Resource Locator Pattern
For ID fields that support both dropdown and manual entry:
```typescript
createField({
  displayName: '{Resource}',
  name: '{resource}Id',
  type: 'resourceLocator',
  modes: [
    {
      displayName: 'From list',
      name: 'list',
      type: 'list',
      typeOptions: {
        searchListMethod: 'search{Resource}s',
        searchable: true,
      },
    },
    {
      displayName: 'By ID',
      name: 'id',
      type: 'string',
    },
  ],
})
```

### Additional Fields Pattern
For optional fields grouped together:
```typescript
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  default: {},
  displayOptions: {
    show: { resource: ['{resource}'], operation: ['create'] },
  },
  options: [
    // List of optional fields
  ],
}
```

