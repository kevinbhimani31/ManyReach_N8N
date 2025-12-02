# Example: Running the Generator

## Step 1: Start Your .NET API

```bash
# Navigate to your API project
cd C:\Path\To\Your\DotNetApi

# Build and run
msbuild YourApi.sln /p:Configuration=Release
cd bin\Release
YourApi.exe
```

## Step 2: Verify Swagger is Accessible

Open browser or use curl:
```bash
curl https://localhost:44398/Swagger/Docs/v2
```

You should see JSON output with your API definition.

## Step 3: Run the Generator

```bash
# Navigate to n8n nodes project
cd C:\N8N\FIrstNode01\n8n-nodes-myapi

# Set Swagger URL (if different from default)
$env:SWAGGER_URL="https://localhost:44398/Swagger/Docs/v2"

# Run generator
npm run generate
```

## Step 4: Review Generated Files

Check the output:
```
nodes/MyApi/
  descriptions/
    user.descriptions.ts
    campaign.descriptions.ts
  resources/
    user/
      user.getAll.ts
      user.create.ts
    campaign/
      campaign.getAll.ts
      campaign.create.ts
```

## Step 5: Build and Test

```bash
# Compile TypeScript
npm run build

# Start n8n with your nodes
npm run dev
```

## Step 6: Test in n8n

1. Open n8n in browser (usually http://localhost:5678)
2. Create new workflow
3. Add "ManyReach" node
4. Select resource (e.g., "User")
5. Select operation (e.g., "Get All")
6. Configure credentials
7. Execute and verify results

## Troubleshooting

### Generator fails to fetch Swagger

**Error**: `Failed to fetch Swagger JSON: connect ECONNREFUSED`

**Solution**: 
- Ensure API is running
- Check firewall settings
- Verify URL is correct

### No changes detected

**Message**: `No changes detected. Skipping generation.`

**Solution**:
- This is normal if API hasn't changed
- Delete `cache/swagger-previous.json` to force regeneration
- Or modify your API and try again

### TypeScript compilation errors

**Error**: `Cannot find module 'n8n-workflow'`

**Solution**:
```bash
npm install
npm run build
```

### Nodes not appearing in n8n

**Solution**:
1. Check `package.json` has correct node registration
2. Rebuild: `npm run build`
3. Restart n8n: `npm run dev`
4. Clear browser cache
