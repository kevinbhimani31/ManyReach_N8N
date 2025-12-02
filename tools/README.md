# n8n Node Auto-Generator

This directory contains tools for automatically generating n8n custom nodes from your .NET Framework 4.7.2 Web API with Swagger.NET.

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Your .NET Web API running with Swagger.NET enabled
- Swagger JSON accessible at an endpoint (e.g., `https://localhost:44398/Swagger/Docs/v2`)

### Installation

```bash
# Install dependencies
npm install

# Install additional generator dependencies
npm install --save-dev @types/node axios
```

### Configuration

Edit `tools/config.json` to set your Swagger URL:

```json
{
  "swagger": {
    "url": "http://your-api-url/swagger/docs/v1"
  }
}
```

### Usage

#### Generate Nodes Manually

```bash
# Set Swagger URL (optional, uses config.json by default)
export SWAGGER_URL="https://localhost:44398/Swagger/Docs/v2"

# Run generator
npm run generate
```

#### Watch for API Changes (Development)

```bash
# Automatically regenerate when API files change
npm run generate:watch
```

#### Build Generated Nodes

```bash
# Compile TypeScript to JavaScript
npm run build

# Run n8n with your nodes
npm run dev
```

## How It Works

### 1. **Swagger Parser** (`tools/extractor/swagger-parser.ts`)
   - Fetches Swagger JSON from your API
   - Extracts endpoints, parameters, schemas
   - Groups endpoints by resource (tag)

### 2. **Change Detector** (`tools/detector/change-detector.ts`)
   - Compares current Swagger with previous version
   - Identifies added, modified, and removed endpoints
   - Skips regeneration if no changes detected

### 3. **Template Generators**
   - **Description Template**: Generates n8n field definitions
   - **Resource Template**: Generates operation implementations
   - Creates proper folder structure matching your project

### 4. **Main Node Updater**
   - Updates `MyApi.node.ts` with new resources
   - Adds imports, operations, and execute logic
   - Maintains existing custom code

### 5. **Package Updater**
   - Updates `package.json` with new node registrations
   - Ensures credentials are properly registered

## Generated Structure

```
nodes/MyApi/
├── MyApi.node.ts                    # Main node file (auto-updated)
├── descriptions/
│   ├── common/
│   │   └── fields.ts                # Helper functions
│   ├── user.descriptions.ts         # Generated
│   ├── campaign.descriptions.ts     # Generated
│   └── ...
├── resources/
│   ├── user/
│   │   ├── user.getAll.ts          # Generated
│   │   ├── user.getById.ts         # Generated
│   │   ├── user.create.ts          # Generated
│   │   ├── user.update.ts          # Generated
│   │   ├── user.delete.ts          # Generated
│   │   └── load/
│   │       └── user.load.ts        # Generated
│   └── ...
└── helpers/
    ├── apiRequest.ts                # Existing
    ├── errorHandler.ts              # Existing
    └── validation.ts                # Auto-generated helpers
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SWAGGER_URL` | URL to Swagger JSON endpoint | `https://localhost:44398/Swagger/Docs/v2` |
| `OUTPUT_DIR` | Output directory for generated files | `./` |

## CI/CD Integration

### GitHub Actions

The workflow file `.github/workflows/generate-nodes.yml` automatically:
1. Builds your .NET API
2. Fetches Swagger JSON
3. Generates n8n nodes
4. Commits changes

### Manual Trigger

```bash
# In your CI/CD pipeline
npm run generate
npm run build
git add nodes/
git commit -m "Auto-generate nodes"
git push
```

## Customization

### Preserving Custom Logic

Wrap custom code with markers:

```typescript
// CUSTOM_LOGIC_START myCustomFunction
export function myCustomFunction() {
  // Your custom code here
}
// CUSTOM_LOGIC_END
```

### Excluding Resources

Edit `tools/config.json`:

```json
{
  "resources": {
    "exclude": ["internal", "debug"]
  }
}
```

### Custom Operation Mapping

```json
{
  "operations": {
    "methodMapping": {
      "GET": "getAll",
      "POST": "create"
    }
  }
}
```

## Troubleshooting

### Swagger JSON Not Found

```bash
# Check if API is running
curl https://localhost:44398/Swagger/Docs/v2

# Verify Swagger.NET is configured in SwaggerConfig.cs
```

### TypeScript Compilation Errors

```bash
# Rebuild tools
npm run build:tools

# Check TypeScript version
npx tsc --version
```

### Generated Nodes Not Appearing in n8n

```bash
# Verify package.json registration
cat package.json | grep "n8n"

# Rebuild and restart
npm run build
npm run dev
```

## Architecture Diagram

```
┌─────────────────┐
│  .NET Web API   │
│  (Swagger.NET)  │
└────────┬────────┘
         │
         │ HTTP GET /swagger/docs/v1
         ▼
┌─────────────────┐
│ Swagger Parser  │
│  (fetch & parse)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Change Detector │
│  (diff & hash)  │
└────────┬────────┘
         │
         │ Changes detected?
         ▼
┌─────────────────┐
│ Node Generator  │
│  (templates)    │
└────────┬────────┘
         │
         ├─► Description Generator
         ├─► Resource Generator
         └─► Load File Generator
         │
         ▼
┌─────────────────┐
│ Main Node       │
│ Updater         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Package.json    │
│ Updater         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ n8n Nodes       │
│ (ready to use)  │
└─────────────────┘
```

## Support

For issues or questions:
1. Check the implementation plan: `implementation_plan.md`
2. Review generated code in `nodes/MyApi/`
3. Check logs from `npm run generate`

## License

MIT
