# N8N Node Generator

This generator automates the creation of n8n custom node files based on a JSON configuration file.

## Quick Start

1. **Create a configuration file** based on `node-generator.config.example.json`:
   ```bash
   cp node-generator.config.example.json node-generator.config.json
   ```

2. **Edit the configuration** to match your API structure

3. **Run the generator**:
   ```bash
   npm run generate:node
   ```

4. **Update the main node file** (see instructions below)

5. **Build and test**:
   ```bash
   npm run build
   npm run dev
   ```

## Configuration File Structure

The configuration file (`node-generator.config.json`) defines:

- **Node metadata**: Name, display name, description
- **Resources**: Each API resource (User, Campaign, etc.)
- **Operations**: CRUD operations for each resource
- **Fields**: Parameters for each operation

### Example Configuration

```json
{
  "nodeName": "myApi",
  "nodeDisplayName": "ManyReach",
  "nodeDescription": "Interact with ManyReach API",
  "resources": [
    {
      "name": "User",
      "value": "user",
      "displayName": "User",
      "endpoint": "/users",
      "idType": "guid",
      "hasLoadOptions": true,
      "hasListSearch": true,
      "operations": [
        {
          "name": "Get All",
          "value": "getAll",
          "endpoint": "/users",
          "method": "GET",
          "hasPagination": true
        },
        {
          "name": "Create",
          "value": "create",
          "endpoint": "/users",
          "method": "POST",
          "fields": [
            {
              "displayName": "Email",
              "name": "Email",
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

## Field Types

Supported field types:
- `string` - Text input
- `number` - Numeric input
- `boolean` - Checkbox
- `options` - Dropdown (requires `optionsList`)
- `resourceLocator` - ID selector with dropdown/manual entry
- `multiOptions` - Multi-select dropdown
- `json` - JSON input

## What Gets Generated

For each resource, the generator creates:

1. **Description file**: `nodes/MyApi/descriptions/{resource}.descriptions.ts`
   - Operations array
   - Fields array with all parameters

2. **Operation files**: `nodes/MyApi/resources/{resource}/{resource}.{operation}.ts`
   - `getAll.ts` - List all items
   - `getById.ts` - Get single item
   - `create.ts` - Create new item
   - `update.ts` - Update item
   - `delete.ts` - Delete item

3. **Load file** (if enabled): `nodes/MyApi/resources/{resource}/load/{resource}.load.ts`
   - Dropdown options loader
   - Resource locator search function

## Updating MyApi.node.ts

After generating files, you need to update `MyApi.node.ts`:

1. **Add imports** for descriptions and operations
2. **Add resource** to the resource selector options
3. **Add spreads** for operations and fields in properties array
4. **Add methods** for loadOptions and listSearch (if needed)
5. **Add switch case** in the execute method

You can use the helper script to see what needs to be added:

```bash
ts-node scripts/update-main-node.ts
```

This will output all the code snippets you need to add.

## Manual Customization

The generator creates a solid foundation, but you may need to:

1. **Custom validation**: Add field-specific validation rules
2. **Complex field mapping**: Handle fields that need transformation
3. **Additional fields**: Add optional fields to collections
4. **Error handling**: Customize error messages
5. **Response transformation**: Modify response data structure

## Tips

- Start with a simple resource (one operation) to test the generator
- Review generated files before adding complex logic
- Use the example configuration as a reference
- Keep your API documentation handy while creating the config
- Test each operation after generation

## Troubleshooting

**Generator fails to run:**
- Ensure `ts-node` is installed: `npm install -D ts-node`
- Check that the config file path is correct
- Verify JSON syntax is valid

**Generated code has errors:**
- Check field types match your API
- Verify endpoint paths are correct
- Ensure operation names match standard patterns (getAll, getById, create, update, delete)

**Missing imports in main node:**
- Run the update helper script
- Manually add missing imports
- Check that file paths are correct

## Next Steps

After generation:
1. Review all generated files
2. Update MyApi.node.ts with imports and switch cases
3. Add any custom logic needed
4. Test in n8n
5. Iterate and refine

