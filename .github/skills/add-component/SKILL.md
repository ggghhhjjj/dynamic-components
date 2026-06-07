---
name: add-component
description: 'Add a new Angular UI component to this monorepo as a standalone library and Web Component. Use when creating a new ui-* component, scaffolding a library, registering a custom element, or adding Storybook stories. Covers the full pipeline: generate library, implement component, components.json manifest, stories, generate:elements.'
argument-hint: 'component name, e.g. ui-switch or switch'
---

# Add Component

Full pipeline for adding a new `ui-*` component library to this monorepo.

## Naming Conventions

Given argument `<name>` (e.g. `switch` or `ui-switch`):

| Token | Value |
|-------|-------|
| **tag / selector** | `ui-<name>` (always kebab-case with `ui-` prefix) |
| **class name** | PascalCase of tag — `ui-switch` → `UiSwitch` |
| **project dir** | `projects/ui-<name>/` |
| **import path** | `ui-<name>` |
| **story title** | `Components/<Name>` (PascalCase, no `Ui` prefix) |

## Procedure

### Step 1 — Scaffold the library

```bash
ng generate library ui-<name> --prefix=ui
```

This creates `projects/ui-<name>/` with the full library structure.

### Step 2 — Implement the component

Edit `projects/ui-<name>/src/lib/ui-<name>.ts`. Replace the generated content with the standalone pattern:

```typescript
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-<name>',
  standalone: true,
  imports: [],
  templateUrl: './ui-<name>.html',
  styleUrl: './ui-<name>.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class Ui<Name> {
  @Input() /* prop */ = /* default */;
}
```

See [component template](./templates/component.ts) for a complete example.

- Add all public API as `@Input()` properties only — no services, no `@Output()` yet.
- Create matching `.html` and `.scss` files in the same directory.

### Step 3 — Export from public-api.ts

In `projects/ui-<name>/src/public-api.ts`, export the component (and any public interfaces):

```typescript
export * from './lib/ui-<name>';
```

### Step 4 — Create the components.json manifest

Create `projects/ui-<name>/components.json` (this drives automated discovery):

```json
{
  "name": "ui-<name>",
  "components": [
    {
      "component": "Ui<Name>",
      "export": "Ui<Name>",
      "tag": "ui-<name>",
      "description": "<Short human-readable description>"
    }
  ]
}
```

See [manifest template](./templates/components.json) for reference. If the project has multiple components, add each as a separate entry in the `components` array.

### Step 5 — Write Storybook stories

Create `projects/ui-<name>/src/stories/ui-<name>.stories.ts`:

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { Ui<Name> } from '../lib/ui-<name>';

const meta: Meta<Ui<Name>> = {
  title: 'Components/<Name>',
  component: Ui<Name>,
  tags: ['autodocs'],
  argTypes: {
    // One entry per @Input():
    // propName: { control: 'text'|'boolean'|'select', description: '...' }
  },
};

export default meta;
type Story = StoryObj<Ui<Name>>;

export const Default: Story = {
  args: {
    // mirror @Input() defaults
  },
};
```

See [stories template](./templates/stories.ts) and [ui-card stories](../../../projects/ui-card/src/stories/ui-card.stories.ts) as the canonical example.

**Control type guide:**

| Input type | `control` value |
|-----------|-----------------|
| `string` | `'text'` |
| `boolean` | `'boolean'` |
| `number` | `'number'` |
| union of strings | `'select'` + `options: [...]` |

### Step 6 — Regenerate registries

```bash
npm run generate:elements
```

This rewrites:
- `projects/elements-host/src/main.ts` — Web component registrations
- `projects/elements-host/src/components-registry.ts` — Component metadata

**Never manually edit those files.**

### Step 7 — Verify

```bash
npm test           # all tests should pass
npm run storybook  # confirm new story appears under Components/<Name>
```

## Completion Checklist

- [ ] `ng generate library` ran successfully
- [ ] Component class uses `standalone: true` and `ViewEncapsulation.Emulated`
- [ ] All public properties are `@Input()` with defaults
- [ ] `public-api.ts` exports the component
- [ ] `components.json` exists with correct tag / class / export names
- [ ] Stories file has `autodocs` tag and `argTypes` for every `@Input()`
- [ ] `npm run generate:elements` ran without errors
- [ ] `npm test` passes
