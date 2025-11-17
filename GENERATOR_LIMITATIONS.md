# Generator Limitations & Drawbacks

## Overview

While the generator speeds up development, it has several limitations you should be aware of.

## Major Drawbacks

### 1. ⚠️ **Overwrites Manual Changes**

**Problem:** Every time you regenerate, it overwrites existing files, losing any custom code you added.

**Example:**
- You add custom validation to `workspace.create.ts`
- You regenerate to add a new field
- **Your custom validation is GONE!**

**Impact:** High - You must re-apply manual changes after each regeneration

**Workaround:**
- Use helper functions (they're never overwritten)
- Keep a backup of custom code
- Use Git to track changes

---

### 2. 🔧 **Requires Manual Integration**

**Problem:** The generator creates files but doesn't update `MyApi.node.ts` automatically.

**What You Must Do Manually:**
- Add imports
- Add to resource selector
- Add to properties array
- Add to methods object
- Add switch cases

**Impact:** Medium - Easy to forget steps, leading to broken builds

**Workaround:**
- Use the helper script: `ts-node scripts/update-main-node.ts`
- Keep a checklist

---

### 3. 🎯 **Basic Code Generation**

**Problem:** Generated code is basic and may not match your API exactly.

**Common Issues:**
- Field names might not match API (e.g., `workspaceTitle` vs `Title`)
- HTTP methods might be wrong (PUT vs PATCH)
- Request body structure might need adjustment
- Missing validation or error handling

**Example:**
```typescript
// Generated code
body.workspaceTitle = workspaceTitle;

// Your API might expect
body.Title = workspaceTitle;
// or
body.name = workspaceTitle;
```

**Impact:** High - Almost always requires manual adjustments

**Workaround:**
- Review and adjust generated files
- Keep config file updated to match your needs

---

### 4. 🔄 **Type Handling Issues**

**Problem:** The generator sometimes generates incorrect type handling for resource locators.

**Example:**
```typescript
// Generated (sometimes wrong)
const id = typeof workspaceId === 'object' ? workspaceId.value : workspaceId;

// Should be (for numeric IDs)
const id = extractNumericId(rawId, 'Workspace ID');
```

**Impact:** Medium - Causes TypeScript errors that need manual fixing

**Workaround:**
- Always check and fix type handling after generation
- Use helper functions consistently

---

### 5. 📝 **Limited Field Type Support**

**Problem:** The generator has limited support for complex field types.

**Not Well Supported:**
- Nested objects
- Arrays of objects
- Conditional fields
- Complex validation rules
- Custom field types

**Impact:** Medium - Complex APIs require significant manual work

**Workaround:**
- Manually edit generated files for complex cases
- Use `additionalFields` collection for flexibility

---

### 6. 🚫 **No API Validation**

**Problem:** The generator doesn't validate:
- If endpoints exist
- If field names match API
- If HTTP methods are correct
- If required fields are present

**Impact:** Medium - Errors only discovered at runtime

**Workaround:**
- Test thoroughly after generation
- Keep API documentation handy

---

### 7. 🔀 **Duplicate Field Generation**

**Problem:** Sometimes generates duplicate fields in description files.

**Example:**
```typescript
// Generated duplicate
createField({ displayName: 'Workspace Title', ... }),  // For create
createField({ displayName: 'Workspace Title', ... }),  // For update (duplicate)
```

**Impact:** Low - Easy to fix but annoying

**Workaround:**
- Review description files after generation
- Manually remove duplicates

---

### 8. 📦 **No Incremental Updates**

**Problem:** Can't update just one operation - regenerates everything for a resource.

**Example:**
- You only want to change the `create` operation
- Generator regenerates ALL operations (getAll, getById, create, update, delete)
- You lose customizations in other operations

**Impact:** Medium - Forces full regeneration even for small changes

**Workaround:**
- Make small changes manually instead of regenerating
- Only regenerate when making major changes

---

### 9. 🎨 **Limited Customization Options**

**Problem:** Config file has limited options for:
- Custom validation rules
- Complex field dependencies
- Conditional field display
- Custom error messages
- Response transformation

**Impact:** Medium - Requires manual code editing

**Workaround:**
- Edit generated files directly
- Use helper functions for reusable logic

---

### 10. 🔍 **No Smart Field Detection**

**Problem:** Generator doesn't automatically:
- Detect field types from API responses
- Infer required fields
- Suggest field names
- Map API fields to node parameters

**Impact:** Low - You must manually configure everything

**Workaround:**
- Keep API documentation open while configuring
- Test and iterate

---

### 11. 🐛 **Import Path Issues**

**Problem:** Sometimes generates incorrect import paths, especially for load files.

**Example:**
```typescript
// Generated (wrong)
import { apiRequest } from '../../helpers/apiRequest';

// Should be (for load files)
import { apiRequest } from '../../../helpers/apiRequest';
```

**Impact:** Medium - Causes build errors

**Workaround:**
- Always check import paths after generation
- Fix paths manually

---

### 12. 📋 **No Operation Dependencies**

**Problem:** Can't specify that operations depend on each other.

**Example:**
- Can't say "update requires getById first"
- Can't specify operation order
- Can't add operation-specific validation

**Impact:** Low - Usually not needed

---

## Comparison: Generator vs Manual

| Aspect | Generator | Manual |
|--------|-----------|--------|
| **Speed** | ⚡ Fast | 🐌 Slow |
| **Customization** | ❌ Limited | ✅ Full control |
| **Maintenance** | ⚠️ Must regenerate | ✅ Direct editing |
| **Learning Curve** | ✅ Easy | ⚠️ Steeper |
| **Error Prone** | ⚠️ Some issues | ✅ You control it |
| **Best For** | Simple CRUD APIs | Complex APIs |

## When NOT to Use the Generator

❌ **Don't use if:**
- You have complex nested data structures
- You need custom validation logic
- Your API has non-standard patterns
- You've already heavily customized files
- You need operation-specific logic

✅ **Do use if:**
- Simple CRUD operations
- Standard REST API patterns
- Starting a new resource
- Need quick prototype
- Learning n8n node development

## Recommendations

### 1. **Use Generator for Initial Setup**
- Generate the basic structure
- Get all files created
- Establish the pattern

### 2. **Switch to Manual for Customization**
- After initial generation, edit files directly
- Only regenerate for major structural changes
- Keep config file as documentation

### 3. **Use Helper Functions**
- Move custom logic to helpers
- Helpers are never overwritten
- Reusable across resources

### 4. **Keep Config Updated**
- Update config to match your actual implementation
- Use as documentation
- Helps others understand the structure

### 5. **Use Version Control**
- Commit before regenerating
- Compare changes with `git diff`
- Easier to merge custom changes back

## Summary

**Main Drawbacks:**
1. ⚠️ Overwrites manual changes
2. 🔧 Requires manual integration
3. 🎯 Generates basic code
4. 🔄 Type handling issues
5. 📝 Limited field support

**Best Approach:**
- Use generator for **initial setup**
- Switch to **manual editing** for customization
- Use **helper functions** for reusable logic
- Keep **config file** as documentation
- Use **Git** to track changes

---

**Remember:** The generator is a tool to speed up development, not a replacement for understanding your API and n8n node structure. Use it wisely!

