---
description: "Use when writing or editing Storybook stories for Angular components. Enforces autodocs tag, argTypes for every @Input(), title convention, and story structure. All stories are served by the Storybook dashboard in projects/elements-host."
applyTo: "**/*.stories.ts"
---

# Storybook Stories Conventions

Canonical example: [ui-card.stories.ts](../../projects/ui-card/src/stories/ui-card.stories.ts)

## Required meta structure

```typescript
const meta: Meta<UiFoo> = {
  title: 'Components/<Name>',   // PascalCase, no "Ui" prefix, e.g. 'Components/Button'
  component: UiFoo,
  tags: ['autodocs'],           // REQUIRED — enables auto-generated docs page
  argTypes: { /* one entry per @Input() */ },
};
export default meta;
type Story = StoryObj<UiFoo>;
```

- `tags: ['autodocs']` is **required** on every `meta` object — never omit it.
- `title` follows `'Components/<Name>'` — strip the `Ui` prefix (`UiButton` → `'Components/Button'`).

## argTypes — one entry per @Input()

Every `@Input()` on the component must have a corresponding `argTypes` entry:

```typescript
argTypes: {
  label:    { control: 'text',    description: '...' },
  disabled: { control: 'boolean', description: '...' },
  variant:  { control: 'select',  options: ['a', 'b'], description: '...' },
  count:    { control: 'number',  description: '...' },
  data:     { control: 'object',  description: '...' },
},
```

| @Input() type | `control` value |
|---------------|-----------------|
| `string` | `'text'` |
| `boolean` | `'boolean'` |
| `number` | `'number'` |
| string union / enum | `'select'` + `options: [...]` |
| array / object | `'object'` |

## Story args — mirror @Input() defaults

Each story's `args` must set every `@Input()` to a concrete value (no `undefined`):

```typescript
export const Default: Story = {
  args: {
    label: 'Click me',
    disabled: false,
  },
};
```

## Minimum required stories

Every stories file must export at least one story. Recommended baseline:

- **Default** (or a name matching the primary use case) — reflects the component's default state
- Additional stories for each meaningful variant or state

## Imports

Always import `Meta` and `StoryObj` as type-only:

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
```
