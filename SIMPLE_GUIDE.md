# Simple Guide - Add New Resource in 5 Steps

## Step 1: Edit Config File

Open `node-generator.config.json` and add your resource to the `resources` array.

**Example:**
```json
{
  "resources": [
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
              "displayName": "Name",
              "name": "name",
              "type": "string",
              "required": true
            }
          ]
        }
      ]
    }
  ]
}
```

## Step 2: Generate Files

```bash
npm run generate:node
```

## Step 3: Update MyApi.node.ts

Open `nodes/MyApi/MyApi.node.ts` and add:

### 3a. Add imports (top of file, with other imports)
```typescript
import { productOperations, productFields } from './descriptions/product.descriptions';
import { getAllProducts } from './resources/product/product.getAll';
import { getProductById } from './resources/product/product.getById';
import { createProduct } from './resources/product/product.create';
import { loadProductsForDropdown, searchProductsForResourceLocator } from './resources/product/load/product.load';
```

### 3b. Add to resource selector (find `options` array, around line 82)
```typescript
{ name: 'Product', value: 'product' },
```

### 3c. Add to properties (find where other resources are spread, around line 109)
```typescript
...productOperations,
...productFields,
```

### 3d. Add to methods (find `methods` object, around line 125)
```typescript
getProducts: loadProductsForDropdown,
searchProducts: searchProductsForResourceLocator,
```

### 3e. Add switch case (find execute method, before final `else`, around line 265)
```typescript
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
    default:
      throw new Error(`Operation "${operation}" not supported for Product`);
  }
}
```

## Step 4: Build

```bash
npm run build
```

## Step 5: Test

```bash
npm run dev
```

Open n8n and test your new resource!

---

## Quick Reference

### Common Operations

**Get All:**
```json
{ "name": "Get All", "value": "getAll", "endpoint": "/items", "method": "GET", "hasPagination": true }
```

**Get By ID:**
```json
{ "name": "Get By ID", "value": "getById", "endpoint": "/items/{id}", "method": "GET" }
```

**Create:**
```json
{ "name": "Create", "value": "create", "endpoint": "/items", "method": "POST", "fields": [...] }
```

**Update:**
```json
{ "name": "Update", "value": "update", "endpoint": "/items/{id}", "method": "PUT", "hasUpdateFields": true }
```

**Delete:**
```json
{ "name": "Delete", "value": "delete", "endpoint": "/items/{id}", "method": "DELETE" }
```

### Field Types
- `"string"` - Text
- `"number"` - Number
- `"boolean"` - Checkbox
- `"options"` - Dropdown

### ID Types
- `"string"` - Text ID
- `"number"` - Numeric ID
- `"guid"` - GUID/UUID

---

**That's it!** Repeat these 5 steps for each new resource.

