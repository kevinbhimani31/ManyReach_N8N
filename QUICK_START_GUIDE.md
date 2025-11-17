# Quick Start Guide - Adding New Resources

Simple step-by-step guide to add new API resources to your n8n node.

## Step 1: Edit the Configuration File

Open `node-generator.config.json` and add your new resource to the `resources` array.

### Example: Adding a "Product" Resource

```json
{
  "nodeName": "myApi",
  "nodeDisplayName": "ManyReach",
  "nodeDescription": "Interact with ManyReach API",
  "resources": [
    {
      "name": "Workspace",
      "value": "workspace",
      "displayName": "Workspace",
      "endpoint": "/workspaces",
      "idType": "number",
      "hasLoadOptions": true,
      "hasListSearch": true,
      "operations": [
        {
          "name": "Get All",
          "value": "getAll",
          "endpoint": "/workspaces",
          "method": "GET",
          "hasPagination": true
        },
        {
          "name": "Get By ID",
          "value": "getById",
          "endpoint": "/workspaces/{id}",
          "method": "GET"
        }
      ]
    },
    {
      "name": "Product",
      "value": "product",
      "displayName": "Product",
      "endpoint": "/products",
      "idType": "number",
      "hasLoadOptions": true,
      "hasListSearch": true,
      "operations": [
        {
          "name": "Get All",
          "value": "getAll",
          "endpoint": "/products",
          "method": "GET",
          "hasPagination": true
        },
        {
          "name": "Get By ID",
          "value": "getById",
          "endpoint": "/products/{id}",
          "method": "GET"
        },
        {
          "name": "Create",
          "value": "create",
          "endpoint": "/products",
          "method": "POST",
          "fields": [
            {
              "displayName": "Product Name",
              "name": "productName",
              "type": "string",
              "description": "Name of the product",
              "required": true
            },
            {
              "displayName": "Price",
              "name": "price",
              "type": "number",
              "description": "Product price",
              "required": true
            },
            {
              "displayName": "Description",
              "name": "description",
              "type": "string",
              "description": "Product description"
            }
          ]
        },
        {
          "name": "Update",
          "value": "update",
          "endpoint": "/products/{id}",
          "method": "PUT",
          "hasUpdateFields": true
        },
        {
          "name": "Delete",
          "value": "delete",
          "endpoint": "/products/{id}",
          "method": "DELETE"
        }
      ]
    }
  ]
}
```

## Step 2: Run the Generator

```bash
npm run generate:node
```

This will create all the necessary files for your new resource.

## Step 3: Update MyApi.node.ts

The generator creates the files, but you need to integrate them into the main node file.

### 3.1 Add Imports (at the top of the file)

Find the section with other resource imports and add:

```typescript
// Import descriptions
import { productOperations, productFields } from './descriptions/product.descriptions';

// Import operations
import { getAllProducts } from './resources/product/product.getAll';
import { getProductById } from './resources/product/product.getById';
import { createProduct } from './resources/product/product.create';
import { updateProduct } from './resources/product/product.update';
import { deleteProduct } from './resources/product/product.delete';

// Import load functions (if hasLoadOptions is true)
import { loadProductsForDropdown, searchProductsForResourceLocator } from './resources/product/load/product.load';
```

### 3.2 Add to Resource Selector

Find the `options` array in the resource selector and add:

```typescript
options: [
  { name: 'User', value: 'user' },
  { name: 'Campaign', value: 'campaign' },
  // ... existing resources
  { name: 'Product', value: 'product' },  // <-- Add this
],
```

### 3.3 Add to Properties Array

Find where other resources are spread and add:

```typescript
...workspaceOperations,
...workspaceFields,

...productOperations,      // <-- Add this
...productFields,          // <-- Add this
```

### 3.4 Add to Methods (if hasLoadOptions is true)

Find the `methods` object and add:

```typescript
methods = {
  loadOptions: {
    // ... existing
    getProducts: loadProductsForDropdown,  // <-- Add this
  },
  listSearch: {
    // ... existing
    searchProducts: searchProductsForResourceLocator,  // <-- Add this
  },
};
```

### 3.5 Add Switch Case in Execute Method

Find the execute method and add before the final `else`:

```typescript
// PRODUCT RESOURCE
else if (resource === 'product') {
  switch (operation) {
    case 'getAll':
      data = await getAllProducts.call(this, i);
      break;

    case 'getById':
      data = await getProductById.call(this, i);
      break;

    case 'create':
      data = await createProduct.call(this, i);
      break;

    case 'update':
      data = await updateProduct.call(this, i);
      break;

    case 'delete':
      data = await deleteProduct.call(this, i);
      break;

    default:
      throw new Error(`Operation "${operation}" not supported for Product`);
  }
}
```

## Step 4: Build the Project

```bash
npm run build
```

Check for any errors. If there are errors, fix them and rebuild.

## Step 5: Test in n8n

```bash
npm run dev
```

Then:
1. Open n8n in your browser (usually http://localhost:5678)
2. Create a new workflow
3. Add your "ManyReach" node
4. Select your new resource
5. Test each operation

## Configuration Reference

### Resource Configuration

```json
{
  "name": "ResourceName",           // PascalCase name
  "value": "resource",              // camelCase identifier
  "displayName": "Resource Name",   // Display name in UI
  "endpoint": "/resources",         // Base API endpoint
  "idType": "number",               // "string", "number", or "guid"
  "hasLoadOptions": true,           // Enable dropdown options
  "hasListSearch": true,            // Enable searchable resource locator
  "operations": [...]               // Array of operations
}
```

### Operation Types

#### 1. Get All (List all items)
```json
{
  "name": "Get All",
  "value": "getAll",
  "endpoint": "/resources",
  "method": "GET",
  "hasPagination": true
}
```

#### 2. Get By ID (Get single item)
```json
{
  "name": "Get By ID",
  "value": "getById",
  "endpoint": "/resources/{id}",
  "method": "GET"
}
```

#### 3. Create (Create new item)
```json
{
  "name": "Create",
  "value": "create",
  "endpoint": "/resources",
  "method": "POST",
  "hasAdditionalFields": true,    // Optional: for extra fields
  "fields": [
    {
      "displayName": "Field Name",
      "name": "fieldName",
      "type": "string",
      "required": true
    }
  ]
}
```

#### 4. Update (Update existing item)
```json
{
  "name": "Update",
  "value": "update",
  "endpoint": "/resources/{id}",
  "method": "PUT",
  "hasUpdateFields": true
}
```

#### 5. Delete (Delete item)
```json
{
  "name": "Delete",
  "value": "delete",
  "endpoint": "/resources/{id}",
  "method": "DELETE"
}
```

### Field Types

- `"string"` - Text input
- `"number"` - Number input
- `"boolean"` - Checkbox
- `"options"` - Dropdown (requires `optionsList`)
- `"resourceLocator"` - ID selector (auto-generated for getById/update/delete)
- `"multiOptions"` - Multi-select dropdown

### Field Configuration

```json
{
  "displayName": "Field Label",    // What user sees
  "name": "fieldName",              // Parameter name (camelCase)
  "type": "string",                 // Field type
  "description": "Help text",       // Optional
  "required": true,                 // Optional, default: false
  "default": "default value",       // Optional
  "placeholder": "Enter value",     // Optional
  "operations": ["create"],         // Which operations show this field
  "optionsList": [                  // For "options" type
    { "name": "Option 1", "value": 1 },
    { "name": "Option 2", "value": 2 }
  ]
}
```

## Common Patterns

### Full CRUD Resource (All Operations)

```json
{
  "name": "Item",
  "value": "item",
  "displayName": "Item",
  "endpoint": "/items",
  "idType": "number",
  "hasLoadOptions": true,
  "hasListSearch": true,
  "operations": [
    { "name": "Get All", "value": "getAll", "endpoint": "/items", "method": "GET", "hasPagination": true },
    { "name": "Get By ID", "value": "getById", "endpoint": "/items/{id}", "method": "GET" },
    { "name": "Create", "value": "create", "endpoint": "/items", "method": "POST", "fields": [...] },
    { "name": "Update", "value": "update", "endpoint": "/items/{id}", "method": "PUT", "hasUpdateFields": true },
    { "name": "Delete", "value": "delete", "endpoint": "/items/{id}", "method": "DELETE" }
  ]
}
```

### Read-Only Resource (No Create/Update/Delete)

```json
{
  "name": "Report",
  "value": "report",
  "displayName": "Report",
  "endpoint": "/reports",
  "idType": "string",
  "hasLoadOptions": false,
  "hasListSearch": false,
  "operations": [
    { "name": "Get All", "value": "getAll", "endpoint": "/reports", "method": "GET", "hasPagination": true },
    { "name": "Get By ID", "value": "getById", "endpoint": "/reports/{id}", "method": "GET" }
  ]
}
```

## Quick Checklist

- [ ] Added resource to `node-generator.config.json`
- [ ] Ran `npm run generate:node`
- [ ] Added imports to `MyApi.node.ts`
- [ ] Added resource to resource selector
- [ ] Added operations/fields to properties array
- [ ] Added methods (if needed)
- [ ] Added switch case in execute method
- [ ] Ran `npm run build` (no errors)
- [ ] Tested in n8n

## Troubleshooting

**Build errors?**
- Check import paths are correct
- Verify all operations are imported
- Make sure switch cases match operation values

**Generator errors?**
- Check JSON syntax in config file
- Verify all required fields are present
- Check endpoint paths are correct

**Runtime errors?**
- Test each operation individually
- Check API endpoint paths
- Verify field names match API expectations

---

**That's it!** Follow these steps for each new resource you want to add.

