# Example: Adding a "Product" Resource

This is a complete example showing how to add a new "Product" resource with all CRUD operations.

## Step 1: Update Configuration

Edit `node-generator.config.json` and add this to the `resources` array:

```json
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
        },
        {
          "displayName": "Category",
          "name": "category",
          "type": "options",
          "description": "Product category",
          "optionsList": [
            { "name": "Electronics", "value": "electronics" },
            { "name": "Clothing", "value": "clothing" },
            { "name": "Food", "value": "food" }
          ]
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
```

## Step 2: Generate Files

```bash
npm run generate:node
```

## Step 3: Update MyApi.node.ts

### Add Imports (around line 14)

```typescript
import { productOperations, productFields } from './descriptions/product.descriptions';
```

### Add Operation Imports (around line 44)

```typescript
import { getAllProducts } from './resources/product/product.getAll';
import { getProductById } from './resources/product/product.getById';
import { createProduct } from './resources/product/product.create';
import { updateProduct } from './resources/product/product.update';
import { deleteProduct } from './resources/product/product.delete';
```

### Add Load Function Imports (around line 46)

```typescript
import { loadProductsForDropdown, searchProductsForResourceLocator } from './resources/product/load/product.load';
```

### Add to Resource Selector (around line 88)

```typescript
{ name: 'Product', value: 'product' },
```

### Add to Properties (around line 109)

```typescript
...productOperations,
...productFields,
```

### Add to Methods (around line 125)

```typescript
getProducts: loadProductsForDropdown,
```

And (around line 131):

```typescript
searchProducts: searchProductsForResourceLocator,
```

### Add Switch Case (around line 265, before the final `else`)

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

## Step 4: Build

```bash
npm run build
```

## Step 5: Test

```bash
npm run dev
```

Open n8n and test the Product resource!

