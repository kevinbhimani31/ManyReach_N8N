# What Happens When You Regenerate?

## Quick Answer

**YES, the generator will OVERWRITE existing files** when you run it again.

## What Gets Overwritten?

When you run `npx ts-node scripts/generate-node.ts`, it will **overwrite** these files for each resource:

✅ **These files WILL be overwritten:**
- `descriptions/{resource}.descriptions.ts`
- `resources/{resource}/{resource}.getAll.ts`
- `resources/{resource}/{resource}.getById.ts`
- `resources/{resource}/{resource}.create.ts`
- `resources/{resource}/{resource}.update.ts`
- `resources/{resource}/{resource}.delete.ts`
- `resources/{resource}/load/{resource}.load.ts`

❌ **These files are SAFE (not overwritten):**
- `MyApi.node.ts` - You update this manually
- `helpers/*.ts` - Helper files are never touched
- Other resources - Only the resource you're regenerating is affected

## Your Current Situation

I see you've changed:
- `workspaceName` → `workspaceTitle`
- Removed `description` field
- Changed update method to `PATCH`
- Added fields to update operation

## What To Do Now

### Step 1: Regenerate the Files

```bash
npx ts-node scripts/generate-node.ts
```

This will:
- ✅ Update `workspace.descriptions.ts` with new field names
- ✅ Update `workspace.create.ts` to use `workspaceTitle` instead of `workspaceName`
- ✅ Update `workspace.update.ts` with PATCH method and new fields
- ⚠️ **WARNING**: Any manual changes you made will be lost!

### Step 2: Check What Changed

After regenerating, check the files:
- `nodes/MyApi/resources/workspace/workspace.create.ts` - Should use `workspaceTitle`
- `nodes/MyApi/resources/workspace/workspace.update.ts` - Should have PATCH method
- `nodes/MyApi/descriptions/workspace.descriptions.ts` - Should have updated fields

### Step 3: Fix Any Issues

The generated `workspace.create.ts` might still reference `description` field. You'll need to:

1. **Remove the description code** from `workspace.create.ts` (since you removed it from config)
2. **Or** add it back to the config if you need it

### Step 4: Update MyApi.node.ts (if needed)

If you added/removed operations, update the switch case in `MyApi.node.ts`.

### Step 5: Build and Test

```bash
npm run build
npm run dev
```

## Example: Fixing workspace.create.ts After Regeneration

After you regenerate, `workspace.create.ts` might look like this:

```typescript
export async function createWorkspace(this: IExecuteFunctions, index: number) {
  const workspaceTitle = this.getNodeParameter('workspaceTitle', index) as string;

  if (!workspaceTitle || (typeof workspaceTitle === 'string' && workspaceTitle.trim() === '')) {
    throw new Error('Workspace Title is required');
  }

  const body: any = {
    workspaceTitle: workspaceTitle.trim(),  // ⚠️ Check if API expects 'name' or 'workspaceTitle'
  };

  const response = await apiRequest.call(this, 'POST', `/workspaces`, body);
  return response;
}
```

**You may need to adjust:**
- Change `workspaceTitle` to `name` in the body if your API expects `name`
- Remove any description handling if you removed that field

## Best Practice Workflow

1. **Update config file** (`node-generator.config.json`)
2. **Regenerate**: `npx ts-node scripts/generate-node.ts`
3. **Review generated files** - Check if they match your API
4. **Make small adjustments** if needed (field names, validation)
5. **Update MyApi.node.ts** if operations changed
6. **Build and test**

## Important Notes

- ⚠️ **Manual changes are lost**: Any custom code you added will be overwritten
- ✅ **Config is source of truth**: Keep your config file updated
- ✅ **MyApi.node.ts is safe**: It's never overwritten
- ✅ **Helpers are safe**: Custom helpers won't be touched

## Quick Checklist

- [ ] Updated `node-generator.config.json`
- [ ] Ran `npx ts-node scripts/generate-node.ts`
- [ ] Reviewed generated files
- [ ] Fixed any API-specific issues (field names, etc.)
- [ ] Updated `MyApi.node.ts` if operations changed
- [ ] Ran `npm run build` (no errors)
- [ ] Tested in n8n

---

**TL;DR**: Yes, regeneration overwrites files. Update config → Regenerate → Review → Fix → Build → Test!

