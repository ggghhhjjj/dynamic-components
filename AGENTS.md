# Agent Instructions

Angular 21 monorepo of reusable UI components distributed as Web Components via `@angular/elements`.

## Key Docs

- [README.md](README.md) — Full dev setup, all npm scripts
- [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md) — Step-by-step guide for adding/removing components
- [DECOUPLING_STRATEGY.md](DECOUPLING_STRATEGY.md) — Why the dual-registry exists

## Architecture

```
projects/
  ui-card/     ← standalone Angular library (ng-packagr)
  ui-table/    ← standalone Angular library (ng-packagr)
  elements-host/ ← Storybook entry point (ALSO web component host - NOT a lib)
scripts/
  generate-elements-host.js  ← scans components.json manifests, auto-generates registries
```

**⚠️ Important:** `elements-host` is **not** a web-component library (no `components.json`). It serves two purposes:
1. **Storybook dashboard** — Interactive component showcase at `http://localhost:6006`
2. **Web component host** — Auto-generated Angular app that registers all components as custom elements

**Automated discovery:** `scripts/generate-elements-host.js` scans every `projects/*/components.json` and writes:
- `projects/elements-host/src/main.ts` (web component registrations)
- `projects/elements-host/src/components-registry.ts` (component metadata)

**Never manually edit** those two generated files — run `npm run generate:elements` instead.

## Build & Test

```bash
npm start                   # dev server (ng serve)
npm run storybook           # Storybook on :6006
npm run generate:elements   # regenerate main.ts + registries after adding/removing a component
npm run build:libs          # build all libraries with ng-packagr
npm run build:wc            # full pipeline: generate + build:libs + build elements-host
npm test                    # run all tests (vitest)
```

## Component Conventions

All components are **standalone** (`standalone: true`) and use only `@Input()` for public API — no services, no output events (yet).

```typescript
@Component({
  selector: 'ui-foo',
  standalone: true,
  imports: [],
  templateUrl: './ui-foo.html',
  styleUrl: './ui-foo.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class UiFoo {
  @Input() /* ... */ = /* default */;
}
```

Each library must have a `components.json` manifest for discovery:

```json
{
  "components": [
    {
      "component": "UiFoo",
      "export": "UiFoo",
      "tag": "ui-foo",
      "description": "Short description"
    }
  ]
}
```

## Adding a New Component

See [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md) for the full walkthrough. Quick reference:
1. `ng generate library ui-<name> --prefix=ui`
2. Implement component in `projects/ui-<name>/src/lib/`
3. Export from `public-api.ts`
4. Create `components.json` manifest
5. Create `.stories.ts` in `src/stories/` (use `autodocs` tag, argTypes for every `@Input`)
6. `npm run generate:elements`

## Storybook

Stories live in `projects/<lib>/src/stories/`. Pattern: `autodocs` tag + `argTypes` with controls for each `@Input`. 

**Entry Point:** All stories are aggregated and served by `projects/elements-host/.storybook/` at `http://localhost:6006`. See [projects/ui-card/src/stories/ui-card.stories.ts](projects/ui-card/src/stories/ui-card.stories.ts) as a canonical example.

## Testing

Uses **Vitest** (not Karma/Jasmine). Test files: `*.spec.ts` beside the component. Run: `npm test`.
