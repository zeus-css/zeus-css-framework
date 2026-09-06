# ⚡ Zeus CSS

A Premium, Zero-Emission, Fluid-Scaling CSS Framework based on Sass SCSS Engine.

## Installation

```bash
npm install zeus-css
```

## Quick Start

### 1. Use the default theme (no build step)
If the shipped defaults are fine as-is, just import the pre-compiled stylesheet in your entrypoint (e.g., `layout.tsx`, `_app.tsx` or `main.tsx`):

```typescript
import 'zeus-css/dist/zeus.css';
```

> `dist/zeus.css` is compiled at publish time and always contains the framework defaults. It cannot reflect local customization — for that, use your own theme build in step 2.

**Where that import goes, per setup:**

| Setup | Entry file | Import |
| --- | --- | --- |
| Next.js (App Router) | `app/layout.tsx` | `import 'zeus-css/dist/zeus.css';` |
| Next.js (Pages Router) | `pages/_app.tsx` | `import 'zeus-css/dist/zeus.css';` |
| React + Vite | `src/main.tsx` | `import 'zeus-css/dist/zeus.css';` |
| Create React App | `src/index.tsx` | `import 'zeus-css/dist/zeus.css';` |
| Vue 3 + Vite | `src/main.ts` | `import 'zeus-css/dist/zeus.css';` |
| Nuxt 3 | `nuxt.config.ts` | `css: ['zeus-css/dist/zeus.css']` |
| Astro | shared `Layout.astro` | `import 'zeus-css/dist/zeus.css';` in the frontmatter |
| Plain HTML, no bundler | `<head>` | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/zeus-css/dist/zeus.css">` or copy the file into your own static folder |

Always import it from a single **shared/root** entry point, never from an individual component — Next.js in particular will error on global CSS imported outside the root layout/`_app`.

**TypeScript:** `import 'zeus-css/dist/zeus.css'` needs *some* ambient `declare module '*.css'` to type-check. Next.js, Vite and Nuxt scaffolds already include this by default — nothing to do. If you're on a bare TypeScript setup and see `Cannot find module 'zeus-css/dist/zeus.css'`, running `npx zeus-css init` (step 2) creates `zeus-css-env.d.ts` for you automatically.

> ⚠️ **Step 1 and Step 2 are mutually exclusive.** Use the default import
> (`zeus-css/dist/zeus.css`) if you don't need custom theming. If you run
> `npx zeus-css init` and customize your theme, **replace** the default
> import with `import './zeus.theme.css'` — never use both together.
>
> ```text
> No customization?  →  import 'zeus-css/dist/zeus.css'
> Custom theme?       →  npx zeus-css init, compile, import './zeus.theme.css' (replaces the Step 1 import)
> ```

### 2. Customize it
Run the init command in the folder you want the config files in (you'll see a reminder for this after `npm install` too):

```bash
npx zeus-css init
```

This drops these files into that folder — not buried in `node_modules`:

| File | Purpose |
| --- | --- |
| `zeus.config.scss` | **Edit this.** Feature toggles, breakpoints, layout engine settings. |
| `zeus.customize.scss` | **Edit this.** Design tokens — colors, typography, spacing, shadows. |
| `zeus.scss` | Generated bridge. Import it in `.module.scss` files for tokens/mixins. Emits no CSS. |
| `zeus.theme.scss` | Generated entry point. Compile it to get your themed global stylesheet. |
| `zeus-css-env.d.ts` | TypeScript projects only (detected via `tsconfig.json`). Ambient `declare module` so the imports above type-check. |

Only `zeus.config.scss` and `zeus.customize.scss` are meant to be hand-edited. Every file above is created only if it's missing — re-running `npx zeus-css init` later (e.g. after upgrading the package) fills in whichever ones you don't have yet, and never touches ones that already exist.

Edit your colors in `zeus.customize.scss` using OKLCH:

```scss
$zeus-colors: (
  "primary": oklch(57.9% 0.232 259.6),
  "secondary": oklch(74.7% 0.174 60.6)
) !default;
```

Then compile `zeus.theme.scss` and link **that** output instead of `zeus-css/dist/zeus.css`:

```bash
sass zeus.theme.scss zeus.theme.css
```

Re-run this command after any edit to `zeus.config.scss` / `zeus.customize.scss`. Running `npx zeus-css init` again never overwrites files you already have.

### 3. Use CSS Variables in CSS Modules
Thanks to the framework's token generation, you can natively use the fluid CSS variables everywhere:

```scss
@use "zeus-css/scss/zeus.scss" as *;

.card {
  padding: var(--space-md) var(--space-lg);
  background: var(--color-background);
  border-radius: var(--border-radius-md);

  /* Use the engine mixins for custom breakpoints */
  @include screen-above(lg) {
    border-radius: var(--border-radius-lg);
  }
}
```

### Compiling with the `sass` CLI directly (no bundler)
Bundlers like Vite and Webpack resolve `@use "zeus-css/..."` automatically. The plain `sass` CLI does not — pass `--load-path=node_modules` or it will fail with `Can't find stylesheet to import`:

```bash
sass --load-path=node_modules your-file.scss your-file.css
```

## ⚠️ Optimizing for Production (Crucial)
Zeus CSS ships with thousands of utility classes to give you absolute freedom during development. For production builds, you **must** use PurgeCSS to remove unused selectors and keep your CSS payload tiny.

Example `postcss.config.js` for Next.js / Vite:
```javascript
module.exports = {
  plugins: [
    ['@fullhuman/postcss-purgecss', {
      content: [
          './pages/**/*.{js,jsx,ts,tsx}',
          './components/**/*.{js,jsx,ts,tsx}',
          './src/**/*.{js,jsx,ts,tsx}'
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    }]
  ]
}
```

## Features

- **Fluid Linear Interpolation Engine**: Mathematical clamp generator for automatic responsive font sizes and spacing without media-query soup.
- **Recursive Token Pipeline**: Automatically traverses and transforms complex Sass maps into CSS Custom Properties.
- **CSS @property Type Safety**: Native browser-level type-safety (syntax validation + fallback) for the base semantic color palette — derived color variants, spacing, and typography tokens are plain custom properties.
- **Zero-Emission SCSS API**: Uses Sass `@forward` to expose core design tools without emitting a single duplicate byte of CSS.
- **Single palette by design**: Zeus does not ship `prefers-color-scheme` / light-dark mode switching — one color palette applies everywhere. Use `zeus-theme()` if you need a different palette entirely (e.g. per-brand), not as a light/dark toggle.
