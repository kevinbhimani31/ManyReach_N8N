# Generator Best Practices

## How to Use the Generator Effectively

### ✅ DO's

1. **Use for Initial Setup**
   - Generate the basic structure
   - Get all files created quickly
   - Establish the pattern

2. **Keep Config as Documentation**
   - Update config to match your implementation
   - Helps others understand the structure
   - Serves as API documentation

3. **Use Helper Functions**
   - Move custom logic to `helpers/` folder
   - Helpers are never overwritten
   - Reusable across resources

4. **Commit Before Regenerating**
   - Use Git to track changes
   - Easy to compare before/after
   - Can revert if needed

5. **Review Generated Code**
   - Always check generated files
   - Fix import paths
   - Adjust field names to match API
   - Add validation if needed

6. **Test After Generation**
   - Build the project
   - Test each operation
   - Verify API calls work

### ❌ DON'Ts

1. **Don't Regenerate Frequently**
   - Only regenerate for major changes
   - Small changes: edit files directly
   - Avoid losing custom code

2. **Don't Rely on Generated Code**
   - Generated code is a starting point
   - Almost always needs adjustments
   - Review and customize

3. **Don't Skip Manual Integration**
   - Always update `MyApi.node.ts`
   - Add imports and switch cases
   - Test after integration

4. **Don't Ignore Type Errors**
   - Fix type issues immediately
   - Use proper helper functions
   - Don't use `any` types

5. **Don't Forget Field Name Mapping**
   - Config field names ≠ API field names
   - Adjust in generated files
   - Document the mapping

## Recommended Workflow

### Phase 1: Initial Generation
```bash
# 1. Create/update config
# Edit node-generator.config.json

# 2. Generate files
npx ts-node scripts/generate-node.ts

# 3. Review generated files
# Check for issues

# 4. Fix common issues
# - Import paths
# - Type handling
# - Field name mapping
```

### Phase 2: Customization
```bash
# 1. Edit generated files directly
# - Add validation
# - Fix field names
# - Add custom logic

# 2. Update MyApi.node.ts
# - Add imports
# - Add switch cases

# 3. Build and test
npm run build
npm run dev
```

### Phase 3: Maintenance
```bash
# For small changes: Edit files directly
# For major changes: Regenerate (with caution)

# 1. Commit current state
git commit -m "Before regeneration"

# 2. Update config
# Edit node-generator.config.json

# 3. Regenerate
npx ts-node scripts/generate-node.ts

# 4. Compare changes
git diff

# 5. Re-apply custom logic
# Merge your changes back

# 6. Build and test
npm run build
npm run dev
```

## Common Patterns

### Pattern 1: Field Name Mapping

**Config:**
```json
{
  "displayName": "Workspace Title",
  "name": "workspaceTitle"
}
```

**Generated:**
```typescript
body.workspaceTitle = workspaceTitle;
```

**Fixed:**
```typescript
body.Title = workspaceTitle;  // Match your API
```

### Pattern 2: Using Helper Functions

**Instead of:**
```typescript
// In generated file (will be overwritten)
const id = typeof workspaceId === 'object' ? workspaceId.value : workspaceId;
```

**Use:**
```typescript
// In generated file
import { extractNumericId } from '../../helpers/validation';
const id = extractNumericId(rawId, 'Workspace ID');
```

### Pattern 3: Custom Validation

**Instead of:**
```typescript
// In generated file (will be overwritten)
if (!workspaceTitle) {
  throw new Error('Required');
}
```

**Use:**
```typescript
// In helper file (never overwritten)
export function validateWorkspaceTitle(title: string) {
  if (!title || title.trim().length < 3) {
    throw new Error('Workspace title must be at least 3 characters');
  }
}

// In generated file
import { validateWorkspaceTitle } from '../../helpers/validation';
validateWorkspaceTitle(workspaceTitle);
```

## Tips

1. **Start Simple**
   - Begin with basic operations (getAll, getById)
   - Add complexity gradually
   - Test as you go

2. **Document Your Changes**
   - Add comments explaining custom logic
   - Note why you deviated from generated code
   - Help future you understand

3. **Keep Config in Sync**
   - Update config when you change field names
   - Keep it as source of truth
   - Makes regeneration easier

4. **Use TypeScript**
   - Define interfaces for requests/responses
   - Better type safety
   - Easier to maintain

5. **Test Thoroughly**
   - Test each operation
   - Test error cases
   - Test edge cases

---

**Key Takeaway:** The generator is a starting point, not the final solution. Use it to speed up initial development, then customize as needed.

