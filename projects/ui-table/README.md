# @myorg/ui-table

A standalone Angular component that renders a responsive, accessible data table.

## Installation

```bash
npm install @myorg/ui-table
```

> **Peer dependencies:** `@angular/core` and `@angular/common` ≥ 21.2.0

---

## Quick start

### 1. Import

```typescript
import { UiTable, TableColumn } from '@myorg/ui-table';

@Component({
  standalone: true,
  imports: [UiTable],
  templateUrl: './my.component.html',
})
export class MyComponent {
  columns: TableColumn[] = [
    { key: 'name',  label: 'Name'  },
    { key: 'email', label: 'Email' },
    { key: 'age',   label: 'Age'   },
  ];

  rows = [
    { name: 'Alice', email: 'alice@example.com', age: 30 },
    { name: 'Bob',   email: 'bob@example.com',   age: 25 },
  ];
}
```

### 2. Template

```html
<ui-table [columns]="columns" [data]="rows" />
```

---

## API

### Inputs

| Input     | Type                        | Default | Description                                      |
|-----------|-----------------------------|---------|--------------------------------------------------|
| `columns` | `TableColumn[]`             | `[]`    | Column definitions (key + display label).        |
| `data`    | `Record<string, unknown>[]` | `[]`    | Array of row objects. Each key maps to a column. |

### `TableColumn` interface

```typescript
interface TableColumn {
  key: string;   // matches the property name in each data row
  label: string; // header text shown to the user
}
```

---

## Theming

The component uses CSS custom properties for visual customization. Override them in a parent scope or globally:

```css
ui-table {
  --table-border:        #e2e8f0; /* cell / card border color   */
  --table-radius:        0.5rem;  /* outer corner radius        */
  --table-font-size:     0.9375rem;
  --table-header-bg:     #f8fafc; /* header row background      */
  --table-header-color:  #0f172a; /* header text color          */
  --table-cell-color:    #334155; /* body cell text color       */
  --table-cell-padding:  0.75rem 1rem;
}
```

---

## Responsive behaviour

| Breakpoint     | Layout                                                     |
|----------------|------------------------------------------------------------|
| `> 480px`      | Standard grid table with a sticky header row.              |
| `≤ 480px`      | Each row collapses into a bordered card with inline labels. |

The column header row is hidden on mobile; each cell shows its own label inline as a key–value pair.

---

## Accessibility

- Rendered with ARIA `role="table"`, `role="rowgroup"`, `role="row"`, `role="columnheader"`, and `role="cell"`.
- Mobile cell labels are marked `aria-hidden="true"` to avoid screen-reader duplication.
- Empty state message is rendered when `data` is an empty array.

---

## Empty state

When `data` is empty the component renders:

```
No data available.
```

No extra configuration is needed.
