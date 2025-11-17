# N8N Node Generator - Complete Guide

This guide explains how to use the automated generator to create custom n8n nodes for your APIs.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Workflow Documentation](#workflow-documentation)
3. [Using the Generator](#using-the-generator)
4. [Configuration Guide](#configuration-guide)
5. [Manual Workflow](#manual-workflow)

## Overview

You have two options for creating n8n nodes:

1. **Manual Workflow** - Step-by-step process (see `NODE_GENERATION_WORKFLOW.md`)
2. **Automated Generator** - Use the generator script with a config file (recommended)

## Workflow Documentation

### Main Workflow Document
📄 **`NODE_GENERATION_WORKFLOW.md`** - Complete manual workflow guide
- Step-by-step instructions
- Code patterns and examples
- Best practices
- Common patterns

### Generator Documentation
📄 **`GENERATOR_README.md`** - Generator usage guide
- Quick start
- Configuration structure
- What gets generated
- Troubleshooting

## Using the Generator

### Step 1: Create Configuration File

Copy the example configuration:
```bash
cp node-generator.config.example.json node-generator.config.json
```

### Step 2: Edit Configuration

Edit `node-generator.config.json` to match your API:

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

### Step 3: Run Generator

```bash
npm run generate:node
```

This will generate:
- Description files (`descriptions/{resource}.descriptions.ts`)
- Operation files (`resources/{resource}/{resource}.{operation}.ts`)
- Load files (if enabled) (`resources/{resource}/load/{resource}.load.ts`)

### Step 4: Update Main Node File

The generator creates the resource files, but you need to integrate them into `MyApi.node.ts`:

**Option A: Use Helper Script**
```bash
ts-node scripts/update-main-node.ts
```

This shows you exactly what code to add.

**Option B: Manual Integration**

1. Add imports for descriptions and operations
2. Add resource to resource selector
3. Add spreads to properties array
4. Add methods for loadOptions/listSearch
5. Add switch cases in execute method

### Step 5: Build and Test

```bash
npm run build
npm run dev
```

Test each operation in the n8n UI.

## Configuration Guide

### Resource Configuration

Each resource needs:
- `name` - PascalCase name (e.g., "User")
- `value` - camelCase identifier (e.g., "user")
- `displayName` - Display name in UI
- `endpoint` - Base API endpoint (e.g., "/users")
- `idType` - "string", "number", or "guid" (for ID validation)
- `hasLoadOptions` - Enable dropdown options
- `hasListSearch` - Enable searchable resource locator
- `operations` - Array of operations

### Operation Configuration

Each operation needs:
- `name` - Display name (e.g., "Get All")
- `value` - Operation identifier (e.g., "getAll")
- `endpoint` - API endpoint (use `{id}` for ID placeholders)
- `method` - HTTP method (GET, POST, PUT, DELETE)
- `hasPagination` - Enable pagination (for getAll)
- `hasAdditionalFields` - Add optional fields collection (for create)
- `hasUpdateFields` - Add update fields collection (for update)
- `fields` - Array of field definitions

### Field Configuration

Each field needs:
- `displayName` - Label in UI
- `name` - Parameter name (camelCase)
- `type` - Field type (string, number, boolean, options, etc.)
- `description` - Help text (optional)
- `required` - Is field required? (default: false)
- `default` - Default value (optional)
- `placeholder` - Placeholder text (optional)
- `operations` - Which operations show this field (array)
- `optionsList` - Options for dropdown (if type is "options")
- `loadOptionsMethod` - Method name for dynamic options
- `validation` - Validation rules (optional)

## Manual Workflow

If you prefer to create nodes manually, follow the detailed guide in `NODE_GENERATION_WORKFLOW.md`.

The manual process involves:
1. Analyzing your API structure
2. Creating description files
3. Creating operation files
4. Creating load functions (if needed)
5. Updating the main node file
6. Testing

## File Structure

After generation, your structure will look like:

```
nodes/MyApi/
├── MyApi.node.ts                    # Main node file (update manually)
├── descriptions/
│   ├── common/
│   │   └── fields.ts               # Field builder helper
│   ├── user.descriptions.ts        # Generated
│   ├── campaign.descriptions.ts    # Generated
│   └── ...
├── resources/
│   ├── user/
│   │   ├── user.getAll.ts         # Generated
│   │   ├── user.getById.ts        # Generated
│   │   ├── user.create.ts         # Generated
│   │   ├── user.update.ts         # Generated
│   │   ├── user.delete.ts         # Generated
│   │   └── load/
│   │       └── user.load.ts       # Generated (if enabled)
│   └── ...
└── helpers/
    ├── apiRequest.ts
    ├── errorHandler.ts
    └── validation.ts
```

## Tips & Best Practices

1. **Start Simple**: Begin with one resource and one operation
2. **Test Incrementally**: Test each operation after generation
3. **Review Generated Code**: Always review before using
4. **Customize as Needed**: Add validation, error handling, etc.
5. **Keep Config Updated**: Update config as your API evolves
6. **Document Custom Logic**: Add comments for complex logic

## Troubleshooting

### Generator Errors
- Check JSON syntax in config file
- Verify all required fields are present
- Check file paths and permissions

### Generated Code Issues
- Review field types match your API
- Verify endpoint paths are correct
- Check operation names follow conventions

### Integration Issues
- Use the helper script to see what needs updating
- Check import paths are correct
- Verify switch cases match operation values

## Next Steps

1. ✅ Read the workflow documentation
2. ✅ Create your configuration file
3. ✅ Run the generator
4. ✅ Update MyApi.node.ts
5. ✅ Build and test
6. ✅ Customize as needed
7. ✅ Deploy and use!

## Support Files

- `NODE_GENERATION_WORKFLOW.md` - Manual workflow guide
- `GENERATOR_README.md` - Generator usage guide
- `node-generator.config.example.json` - Example configuration
- `scripts/generate-node.ts` - Generator script
- `scripts/update-main-node.ts` - Helper script

---

**Happy coding!** 🚀

