# Updating Existing Resources - Important Guide

## What Happens When You Regenerate?

When you run `npm run generate:node` (or `npx ts-node scripts/generate-node.ts`), the generator will:

✅ **OVERWRITE** all generated files for that resource
- Description files (`descriptions/{resource}.descriptions.ts`)
- Operation files (`resources/{resource}/{resource}.{operation}.ts`)
- Load files (`resources/{resource}/load/{resource}.load.ts`)

⚠️ **WARNING**: Any manual changes you made to these files will be **LOST**!

## What Gets Overwritten?

### Files That Will Be Regenerated:
- ✅ `descriptions/{resource}.descriptions.ts` - **OVERWRITTEN**
- ✅ `resources/{resource}/{resource}.getAll.ts` - **OVERWRITTEN**
- ✅ `resources/{resource}/{resource}.getById.ts` - **OVERWRITTEN**
- ✅ `resources/{resource}/{resource}.create.ts` - **OVERWRITTEN**
- ✅ `resources/{resource}/{resource}.update.ts` - **OVERWRITTEN**
- ✅ `resources/{resource}/{resource}.delete.ts` - **OVERWRITTEN**
- ✅ `resources/{resource}/load/{resource}.load.ts` - **OVERWRITTEN**

### Files That Are NOT Affected:
- ✅ `MyApi.node.ts` - **NOT OVERWRITTEN** (you update this manually)
- ✅ Helper files (`helpers/*.ts`) - **NOT OVERWRITTEN**
- ✅ Other resources - **NOT AFFECTED**

## Best Practices

### Option 1: Regenerate and Re-apply Manual Changes (Recommended for Simple Changes)

1. **Make your changes** to `node-generator.config.json`
2. **Run the generator**: `npx ts-node scripts/generate-node.ts`
3. **Review the generated files** to see what changed
4. **Re-apply any manual customizations** you had (validation, error handling, etc.)
5. **Update MyApi.node.ts** if you added/removed operations
6. **Build and test**: `npm run build`

### Option 2: Manual Updates (For Complex Changes)

If you have many manual customizations, it's better to:

1. **Manually edit** the existing files instead of regenerating
2. **Update the config file** to match your changes (for documentation)
3. **Skip regeneration** to preserve your customizations

### Option 3: Use Git (Recommended for Teams)

1. **Commit your changes** before regenerating
2. **Run the generator**
3. **Compare the changes** using `git diff`
4. **Merge your manual changes** back if needed

## Step-by-Step: Updating an Existing Resource

### Example: Adding a Field to Create Operation

**Before:**
```json
{
  "name": "Create",
  "value": "create",
  "endpoint": "/workspaces",
  "method": "POST",
  "fields": [
    {
      "displayName": "Workspace Title",
      "name": "workspaceTitle",
      "type": "string",
      "required": true
    }
  ]
}
```

**After (adding Description field):**
```json
{
  "name": "Create",
  "value": "create",
  "endpoint": "/workspaces",
  "method": "POST",
  "fields": [
    {
      "displayName": "Workspace Title",
      "name": "workspaceTitle",
      "type": "string",
      "required": true
    },
    {
      "displayName": "Description",
      "name": "description",
      "type": "string"
    }
  ]
}
```

**Steps:**
1. Update `node-generator.config.json` with the new field
2. Run: `npx ts-node scripts/generate-node.ts`
3. The generator will overwrite `workspace.create.ts` and `workspace.descriptions.ts`
4. Check if `workspace.create.ts` now includes the description field
5. If you had custom logic in `workspace.create.ts`, you'll need to add it back
6. Update `MyApi.node.ts` if needed (usually not needed for field changes)
7. Build: `npm run build`

## Common Scenarios

### Scenario 1: Adding a New Operation

**Example:** Adding "Delete" to Workspace

1. Add delete operation to config
2. Run generator
3. Generator creates `workspace.delete.ts`
4. **You must manually update `MyApi.node.ts`**:
   - Add import: `import { deleteWorkspace } from './resources/workspace/workspace.delete';`
   - Add case: `case 'delete': data = await deleteWorkspace.call(this, i); break;`

### Scenario 2: Changing Field Types

**Example:** Changing a field from `string` to `options`

1. Update field type in config
2. Add `optionsList` to config
3. Run generator
4. Generator updates the description file
5. **Check the create/update file** - it should handle the new type automatically

### Scenario 3: Adding Custom Validation

**Problem:** You added custom validation to `workspace.create.ts`, but regeneration will remove it.

**Solution:**
1. **Before regenerating**: Copy your custom code
2. **Regenerate** the file
3. **Paste your custom code back** into the generated file

**Better Solution:**
- Add validation to a helper function in `helpers/validation.ts`
- The generator won't overwrite helper files
- Import and use the helper in your operation file

### Scenario 4: Changing HTTP Method

**Example:** Changing update from PUT to PATCH

1. Update `method` in config: `"method": "PATCH"`
2. Run generator
3. Generator updates `workspace.update.ts` with the new method
4. No changes needed in `MyApi.node.ts`

## Checklist Before Regenerating

- [ ] Have you saved all your manual changes?
- [ ] Do you have a backup (Git commit)?
- [ ] Have you updated the config file correctly?
- [ ] Are you ready to re-apply any custom logic?

## Checklist After Regenerating

- [ ] Review generated files for correctness
- [ ] Re-apply any custom validation/logic
- [ ] Update `MyApi.node.ts` if operations changed
- [ ] Run `npm run build` to check for errors
- [ ] Test in n8n to verify everything works

## Tips

1. **Keep config file updated**: Always update the config file to match your actual implementation
2. **Document custom changes**: Add comments in code explaining why you deviated from generated code
3. **Use helper functions**: Move custom logic to helpers to avoid losing it during regeneration
4. **Test after regeneration**: Always test after regenerating to catch any issues

## Example: Safe Regeneration Workflow

```bash
# 1. Commit current state (if using Git)
git add .
git commit -m "Before regenerating workspace resource"

# 2. Update config file
# (edit node-generator.config.json)

# 3. Regenerate
npx ts-node scripts/generate-node.ts

# 4. Check what changed
git diff nodes/MyApi/resources/workspace/

# 5. Re-apply any custom logic if needed
# (edit the generated files)

# 6. Build and test
npm run build
npm run dev
```

---

**Remember**: The generator is a tool to speed up development, but you're in control. You can always choose to manually edit files instead of regenerating!

