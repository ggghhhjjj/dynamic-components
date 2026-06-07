# ComponentLibrary

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.

A monorepo containing reusable Angular web components built with `@angular/elements` and documented in Storybook.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Storybook

**Storybook** is an interactive component development and documentation environment. It showcases all your web components with their stories (usage examples) and allows interactive exploration of component variations, controls, and accessibility features.

### Starting Storybook

To launch Storybook on `http://localhost:6006/`:

```bash
npm run storybook
```

This opens an interactive dashboard with:
- **🏠 Home** — Unified component library dashboard showing all available components
- **Components** — Individual component stories with interactive controls
- **Documentation** — Detailed component descriptions and usage examples

### Stopping Storybook

When you're done, stop the Storybook server using one of these methods:

**Option 1: Keyboard Shortcut** (Recommended)
- In the terminal where Storybook is running, press **Ctrl+C**

**Option 2: npm Script**
```bash
npm run stop:storybook
```

**Option 3: Manual Process Kill**
```bash
# Find the process running on port 6006
lsof -ti :6006

# Kill it
kill -9 <PID>
```

### Component Dashboard

The home page automatically aggregates all web components from your projects. It shows:
- Component name and description
- Direct links to component stories
- Status table with all available components
- Last update timestamp

The dashboard updates automatically when you add or remove component projects.

## Web Components Architecture

This monorepo uses **automated component discovery** to keep your Storybook dashboard in sync with your component projects:

```
projects/
├── ui-button/        (component library)
├── ui-card/          (component library)
├── ui-table/         (component library)
└── elements-host/    (web component bootstrap host)
```

Each component library is:
1. Built as an Angular library with `ng-packagr`
2. Registered as a web component using `@angular/elements`
3. Automatically discovered and displayed in Storybook
4. Auto-registered in the browser's custom element registry

### Adding a New Web Component Project

#### Step 1: Create the Component Library

```bash
ng generate library ui-switch --prefix=ui
```

This creates:
```
projects/ui-switch/
├── ng-package.json
├── tsconfig.lib.json
├── tsconfig.spec.json
└── src/
    ├── public-api.ts
    └── lib/
        ├── ui-switch.ts
        ├── ui-switch.html
        ├── ui-switch.scss
        └── ui-switch.spec.ts
```

#### Step 2: Implement Your Component

Build your Angular component in `projects/ui-switch/src/lib/ui-switch.ts`:

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-switch',
  templateUrl: './ui-switch.html',
  styleUrls: ['./ui-switch.scss'],
  standalone: true,
})
export class UiSwitch {
  @Input() checked = false;
}
```

Export it from `projects/ui-switch/src/public-api.ts`:

```typescript
export * from './lib/ui-switch';
```

#### Step 3: Create a Component Manifest

Create `projects/ui-switch/components.json`:

```json
{
  "name": "ui-switch",
  "components": [
    {
      "component": "UiSwitch",
      "export": "UiSwitch",
      "tag": "ui-switch",
      "description": "Toggle switch component for boolean values"
    }
  ]
}
```

The manifest tells the generator about your component:
- `component` — Class name of your Angular component
- `export` — Export name from `public-api.ts`
- `tag` — Custom element tag name (used in HTML)
- `description` — Short description for the dashboard

#### Step 4: Create Stories for Storybook

Create `projects/ui-switch/src/stories/ui-switch.stories.ts`:

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { UiSwitch } from '../lib/ui-switch';

const meta: Meta<UiSwitch> = {
  title: 'Components/Switch',
  component: UiSwitch,
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<UiSwitch> = {
  args: {
    checked: false,
  },
};

export const Checked: StoryObj<UiSwitch> = {
  args: {
    checked: true,
  },
};
```

#### Step 5: Regenerate the Registry

The generator automatically discovers your new component:

```bash
npm run generate:elements
```

Output:
```
🔍 Scanning sub-projects for components...
✅ Found 4 component(s):
   - ui-button (ui-button)
   - ui-card (ui-card)
   - ui-table (ui-table)
   - ui-switch (ui-switch)
✅ Generated projects/elements-host/src/main.ts
✅ Generated projects/elements-host/src/components-registry.ts
✅ Generated projects/ui-button/src/components-registry.ts
```

Your component now appears:
- ✅ Registered as a web component (`<ui-switch></ui-switch>`)
- ✅ In the Storybook home dashboard
- ✅ In the component registry with full metadata

### Removing a Web Component Project

To remove a component from Storybook and web components:

#### Option 1: Delete the Entire Project

```bash
rm -rf projects/ui-switch
npm run generate:elements
```

The generator automatically:
- Removes the component from the registry
- Updates the Storybook dashboard
- Removes it from web component registrations

#### Option 2: Disable Without Deleting

Move the `components.json` file to prevent discovery:

```bash
mv projects/ui-switch/components.json projects/ui-switch/components.json.disabled
npm run generate:elements
```

To re-enable:
```bash
mv projects/ui-switch/components.json.disabled projects/ui-switch/components.json
npm run generate:elements
```

#### What Gets Updated Automatically

When you add/remove a component, the generator updates:

1. **`projects/elements-host/src/main.ts`**
   - Adds/removes imports for your component
   - Adds/removes web component registration code

2. **Registry Files** (both files stay in sync)
   - `projects/elements-host/src/components-registry.ts`
   - `projects/ui-button/src/components-registry.ts`
   - Metadata about all available components
   - Timestamps and component counts

3. **Storybook Dashboard**
   - Component cards auto-appear/disappear
   - Navigation links updated
   - Status table reflects current components

### Building Web Components

To build all web components:

```bash
npm run build:wc
```

This:
1. Runs `npm run generate:elements` — Discovers and generates files
2. Runs `npm run build:libs` — Builds all component libraries
3. Runs `ng build elements-host` — Bundles web components

Output is in `dist/elements-host/`:
```
dist/elements-host/
├── main.js                (all components bundled)
├── main.css
└── index.html
```

You can use web components in any framework or plain HTML:

```html
<script src="dist/elements-host/main.js"></script>

<ui-button label="Click me"></ui-button>
<ui-card title="Card Title"></ui-card>
<ui-switch checked="true"></ui-switch>
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

### Project Documentation

- **[COMPONENT_GUIDE.md](COMPONENT_GUIDE.md)** — Step-by-step guide for adding and managing components
- **[DECOUPLING_STRATEGY.md](DECOUPLING_STRATEGY.md)** — Architecture overview of the automated discovery system
- **[Angular CLI Overview](https://angular.dev/tools/cli)** — Official Angular CLI documentation
- **[Storybook Documentation](https://storybook.js.org/docs)** — Storybook features and configuration
- **[@angular/elements Docs](https://angular.dev/guide/elements)** — Creating Angular custom elements

### Key npm Scripts

```bash
# Storybook
npm run storybook          # Launch Storybook on http://localhost:6006
npm run stop:storybook     # Stop the running Storybook instance

# Web Components
npm run build:wc           # Build all web components (generates + builds + bundles)
npm run generate:elements  # Auto-discover components and generate files
npm run build:libs         # Build all component libraries

# Cleaning
npm run clean              # Clean build artifacts (dist/ and cache)
npm run clean:all          # Clean everything including node_modules (requires npm install after)

# Development & Testing
ng serve                   # Start dev server
ng test                    # Run unit tests
ng e2e                     # Run e2e tests
ng build                   # Production build
```

**Note:** Run `npm run clean` if you encounter:
- Storybook hot-reload issues
- Inconsistent build behavior
- Module resolution errors
- Webpack cache corruption



### Project Structure

```
projects/
├── ui-button/            # Button component library
│   ├── src/
│   │   ├── lib/          # Component implementation
│   │   └── stories/      # Storybook stories
│   └── components.json   # Component manifest
│
├── ui-card/              # Card component library
│   ├── src/
│   ├── lib/              # Component implementation
│   └── components.json   # Component manifest
│
├── ui-table/             # Table component library
│   ├── src/
│   ├── lib/              # Component implementation
│   └── components.json   # Component manifest
│
└── elements-host/        # Web component bootstrap host
    └── src/
        ├── main.ts       # Generated: web component registration
        └── components-registry.ts  # Generated: component metadata
```

### How the Automation Works

The system uses a generator script to keep everything in sync:

1. **Component Manifests** (`components.json`) — Declare your components
2. **Generator** (`scripts/generate-elements-host.js`) — Scans manifests
3. **Auto-Generated Files**:
   - `projects/elements-host/src/main.ts` — Web component registrations
   - `projects/elements-host/src/components-registry.ts` — Metadata registry
   - `projects/ui-button/src/components-registry.ts` — Storybook dashboard data
4. **Storybook Dashboard** — Auto-displays components from registry

Run `npm run generate:elements` anytime you add/remove a component project.

### Technologies

- **Angular 21** — Web component framework
- **@angular/elements** — Bridge between Angular and web components
- **Storybook 10** — Interactive component documentation
- **ng-packagr** — Library packaging
- **TypeScript** — Type-safe development
- **SCSS** — Component styling

### Support

For issues with:
- **Component development** — See [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md)
- **Architecture questions** — See [DECOUPLING_STRATEGY.md](DECOUPLING_STRATEGY.md)
- **Storybook** — Visit [storybook.js.org](https://storybook.js.org)
- **Angular** — Visit [angular.dev](https://angular.dev)
