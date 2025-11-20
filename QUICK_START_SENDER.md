# Quick Start: Creating Sender Node

## Step-by-Step Guide

### Step 1: ✅ Config File Created
You've already created `sender-node-generator.config.example.json`

### Step 2: Create Active Config File
Copy your example to the active config:

```bash
cp sender-node-generator.config.example.json node-generator.config.json
```

Or manually copy the content from `sender-node-generator.config.example.json` to `node-generator.config.json`

### Step 3: Update Config with Field Mappings

Make sure your config includes `nameField` and `valueField`:

```json
{
  "name": "Sender",
  "value": "sender",
  "endpoint": "/senders",
  "nameField": "Email",    // Field to display in dropdown
  "valueField": "Id",      // Field to use as value
  "hasLoadOptions": true,
  "hasListSearch": true
}
```

### Step 4: Generate Files

Run the generator:

```bash
# Option 1: Using npm script (if ts-node is installed)
npm run generate:node

# Option 2: Using npx (recommended)
npx ts-node scripts/generate-node.ts
```

### Step 5: Update MyApi.node.ts

After generation, you need to integrate the Sender resource into `MyApi.node.ts`:

#### 5a. Add Imports (around line 14)
```typescript
import { senderOperations, senderFields } from './descriptions/sender.descriptions';
```

#### 5b. Add Operation Imports (around line 44)
```typescript
import { getAllSenders } from './resources/sender/sender.getAll';
import { getSenderById } from './resources/sender/sender.getById';
import { createSender } from './resources/sender/sender.create';
import { updateSender } from './resources/sender/sender.update';
import { loadSendersForDropdown, searchSendersForResourceLocator } from './resources/sender/load/sender.load';
```

#### 5c. Add to Resource Selector (around line 82)
```typescript
{ name: 'Sender', value: 'sender' },
```

#### 5d. Add to Properties (around line 109)
```typescript
...senderOperations,
...senderFields,
```

#### 5e. Add to Methods (around line 125)
```typescript
getSenders: loadSendersForDropdown,
```

And (around line 131):
```typescript
searchSenders: searchSendersForResourceLocator,
```

#### 5f. Add Switch Case (around line 265, before final `else`)
```typescript
// SENDER RESOURCE
else if (resource === 'sender') {
  switch (operation) {
    case 'getAll':
      data = await getAllSenders.call(this, i);
      break;

    case 'getById':
      data = await getSenderById.call(this, i);
      break;

    case 'create':
      data = await createSender.call(this, i);
      break;

    case 'update':
      data = await updateSender.call(this, i);
      break;

    default:
      throw new Error(`Operation "${operation}" not supported for Sender`);
  }
}
```

### Step 6: Build

```bash
npm run build
```

### Step 7: Test

```bash
npm run dev
```

Then test in n8n UI!

---

## Field Mapping Feature

The generator now supports custom field mapping:

```json
{
  "nameField": "Email",   // Uses Email field for display name
  "valueField": "Id"      // Uses Id field for value
}
```

This will generate:
```typescript
name: sender.Email ?? sender.email ?? `Sender ${sender.Id}`,
value: sender.Id ?? sender.id ?? sender.ID,
```

If you don't specify, it defaults to:
- `nameField`: "name"
- `valueField`: "id"


