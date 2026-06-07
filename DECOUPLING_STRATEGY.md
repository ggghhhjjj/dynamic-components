# Dashboard Decoupling Strategy

## Architecture Overview

The component library uses a centralized, decoupled architecture:

### **Registry Location: `projects/elements-host/src/components-registry.ts`**
- **Single source of truth** for all component metadata
- Auto-generated from `projects/*/components.json` manifests
- Used by both web components and Storybook
- Updated automatically when `npm run generate:elements` runs

### **Storybook Entry Point: `projects/elements-host/.storybook/`**
- **Centralized dashboard** serving all component stories
- NOT a web component library (no `components.json`)
- Scans all `projects/*/src/stories/**/*.stories.ts` files
- Runs on `http://localhost:6006` via `npm run storybook`

### **Web Component Bootstrap: `projects/elements-host/src/main.ts`**
- Auto-generated registrations for all components
- Creates custom elements from imported components
- Runs independently or embedded in any HTML page

## How It Works

When you run `npm run generate:elements`:

```bash
✅ Scanning sub-projects for components...
✅ Found 2 component(s): ui-card, ui-table
✅ Generated /projects/elements-host/src/main.ts
✅ Generated /projects/elements-host/src/components-registry.ts
```

Generator behavior:
- Scans all `projects/*/components.json` files
- Regenerates main.ts with all discovered components
- Updates the registry with current component metadata
- No hardcoded project dependencies

## Decoupling Benefits

✅ **Generator is independent** — No hardcoded project dependencies  
✅ **Web component host is self-contained** — elements-host manages its own bootstrap  
✅ **Storybook dashboard is centralized** — Single entry point for component showcase  
✅ **Easy to add/remove projects** — Deleting component projects auto-updates everything  
✅ **Component libraries stay pure** — ui-card, ui-table are just Angular libraries

## Deleting a Web Component Project

When you delete any component project (e.g., `projects/ui-button`):

1. **Generator continues working** — Still scans remaining projects
2. **Registry auto-updates** — Reflects only remaining components
3. **Web components still work** — elements-host/src/main.ts is regenerated correctly
4. **Storybook updates** — Stories from deleted project no longer appear

### Example: Deleting ui-button

```bash
# Remove the project
rm -rf projects/ui-button

# Regenerate
npm run generate:elements

# Output:
# ✅ Found 2 component(s): ui-card, ui-table
# ✅ Generated /projects/elements-host/src/main.ts
# ✅ Generated /projects/elements-host/src/components-registry.ts
```

**Note:** Only 2 components remain. No errors or special handling needed. 
| **Shared library package** | Professional structure | Overkill for monorepo |

**Dual output is ideal because:**
- Both files auto-generated, never manually edited
- Each project is self-contained
- No tsconfig complexity
- Simple relative imports work everywhere
- Generator remains the single source of truth

## File Reference

**Generator configuration:** [scripts/generate-elements-host.js](scripts/generate-elements-host.js#L18-L20)
- `REGISTRY_ELEMENTS_HOST` — Web component registry
- `REGISTRY_STORYBOOK` — Storybook dashboard registry

**Build pipeline:** [package.json](package.json#L7)
```json
"generate:elements": "node scripts/generate-elements-host.js"
```

## Future: Separate Storybook Project

If you want complete separation, consider moving Storybook to its own project:

```
projects/storybook-docs/  (new)
  .storybook/
  src/
    stories/
      home.stories.ts (dashboard)
```

This would be a larger refactoring but would fully decouple dashboard from components.
