# Component Auto-Discovery Guide

This workspace uses a fully automated component registration system with a **decoupled dashboard**. Components are discovered from each sub-project's `components.json` manifest and automatically:

1. **Registered in web components** — `main.ts` is auto-generated  
2. **Updated in Storybook dashboard** — Home page dynamically shows all components  
3. **Indexed for quick discovery** — Registry files generated for fast lookups  

## Architecture

The generator writes registry files to **one location**:

- **`projects/elements-host/src/components-registry.ts`** — Used by both web components and Storybook

This centralized approach means:
- ✅ Generator has no hardcoded project dependencies
- ✅ Web component host bootstraps independently  
- ✅ Storybook dashboard accesses the same registry
- ✅ Deleting any component project automatically updates registries

## How It Works

### 1. Component Manifests (`projects/*/components.json`)
Each sub-project declares its components in a JSON manifest:
- Lists the component class, export name, custom element tag, and description
- **When deleted**: Component is automatically removed everywhere

### 2. Generator Script (`scripts/generate-elements-host.js`)
Runs during build and generates:

**a) `projects/elements-host/src/main.ts`** — Web component registrations
- Auto-imports all components
- Creates custom elements
- Registers tags in browser

**b) `projects/elements-host/src/components-registry.ts`** — Component registry
- Auto-generated, never manually edited
- Timestamp of last generation included
- Used by both web components and Storybook stories

### 3. Storybook Dashboard
Stories in each component project are discovered and displayed by `projects/elements-host/.storybook/`:
- Scans all `projects/*/src/stories/**/*.stories.ts`
- Displays component cards with controls from `argTypes`
- Shows component registry and status
- Automatically updates when components are added/removed

## Automatic Updates

When you **delete** a component project:

```bash
rm -rf projects/ui-switch
npm run generate:elements
```

**What happens:**
1. Generator scans for `components.json` files
2. Doesn't find ui-switch manifest
3. Regenerates registry **without** that component
4. Storybook home page automatically updates
5. Component links removed from dashboard

**Before:**
```
✅ Found 4 component(s):
   - ui-button
   - ui-card
   - ui-table
   - ui-switch
```

**After deletion:**
```
✅ Found 3 component(s):
   - ui-button
   - ui-card
   - ui-table
```

## Adding a New Component

### Step 1: Create the Component Library
```bash
# Create a new component library (e.g., ui-switch)
ng generate library ui-switch --prefix=ui
```

### Step 2: Export Your Component
In `projects/ui-switch/src/public-api.ts`:
```typescript
export * from './lib/ui-switch';
export type { SwitchConfig } from './lib/ui-switch';
```

### Step 3: Declare Components in Manifest
Create `projects/ui-switch/components.json`:
```json
{
  "name": "ui-switch",
  "components": [
    {
      "component": "UiSwitch",
      "export": "UiSwitch",
      "tag": "ui-switch",
      "description": "Toggle switch component"
    }
  ]
}
```

### Step 4: Regenerate main.ts
```bash
npm run generate:elements
```

That's it! Your component is now automatically registered as a custom element.

## Adding Multiple Components to a Project

You can declare multiple components in a single `components.json`:

```json
{
  "name": "ui-form",
  "components": [
    {
      "component": "UiInput",
      "export": "UiInput",
      "tag": "ui-input",
      "description": "Text input component"
    },
    {
      "component": "UiSelect",
      "export": "UiSelect",
      "tag": "ui-select",
      "description": "Dropdown select component"
    }
  ]
}
```

Then run `npm run generate:elements` to register all of them.

## npm Scripts

- **`npm run generate:elements`** — Regenerate main.ts and components-registry.ts from all components.json files
- **`npm run build:wc`** — Full web components build (includes auto-generation)

## Schema: components.json

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Project name (e.g., "ui-button") |
| `components` | array | ✅ | Array of component declarations |
| `components[].component` | string | ✅ | Class name of the component |
| `components[].export` | string | ✅ | Export name from public-api.ts |
| `components[].tag` | string | ✅ | Custom element tag name (e.g., "ui-button") |
| `components[].description` | string | ❌ | Human-readable description |

## Troubleshooting

**❌ Dashboard doesn't show my new component**
- Run `npm run generate:elements` to regenerate the registry
- Verify your `components.json` file path: `projects/PROJECT_NAME/components.json`
- Reload Storybook browser tab

**❌ Deleted component still appears in dashboard**
- The Storybook cache might be stale
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
- Or rebuild: `npm run build:wc`

**❌ Error: "No components found"**
- Ensure each sub-project has a `components.json` file
- Check the JSON syntax is valid

**❌ Generated file has missing components**
- Verify the `components.json` is in the correct location: `projects/PROJECT_NAME/components.json`
- Check that `export` names match your public-api.ts

**❌ Import errors after generation**
- Run `npm run build:libs` to build all sub-projects
- Verify the project name in `components.json` matches the Angular project name

## Generated Files

### `components-registry.ts`
Auto-generated TypeScript file exported from ui-button:

```typescript
export const COMPONENTS_REGISTRY: ComponentsRegistry = {
  lastUpdated: "2026-06-07T14:22:39.807Z",
  totalComponents: 3,
  components: [
    { tag: "ui-button", component: "UiButton", ... },
    { tag: "ui-card", component: "UiCard", ... },
    { tag: "ui-table", component: "UiTable", ... }
  ]
};
```

**Used by:**
- ✅ Storybook home dashboard (dynamically renders component cards)
- ✅ Component discovery and indexing

### `main.ts`
Auto-generated web component registrations:

```typescript
import { UiButton } from 'ui-button';
import { UiCard } from 'ui-card';
import { UiTable } from 'ui-table';

(async () => {
  const app = await createApplication();
  const UiButtonElement = createCustomElement(UiButton, { injector: app.injector });
  customElements.define('ui-button', UiButtonElement);
  // ... etc
})();
```

## Example

When you run `npm run generate:elements`, the generator:

1. Finds all `projects/*/components.json` files
2. Generates `main.ts` with imports and element registrations
3. Generates `components-registry.ts` with component metadata
4. Storybook home page auto-updates to show all components

**If you delete a component:**
```bash
rm -rf projects/ui-old-component
npm run generate:elements  # Regenerates without deleted component
```

**Dashboard automatically updates** — deleted component disappears from home page

You can then use registered components in any framework:
```html
<ui-button label="Click me" variant="primary"></ui-button>

