# ⚡ Zeus CSS

Zeus is a fluid-first SCSS design system. Every size, space, and font size scales
smoothly between a mobile floor and a desktop ceiling using native CSS
`clamp()` driven by container-query units (`cqi`) — no breakpoint jumps, no
`calc()` guesswork. Colors are OKLCH-based semantic tokens with automatic
light/dark derivation. The whole system is expressed as plain Sass maps, which
makes it easy for both humans and AI coding assistants to read, extend, and
reason about.

- **Fluid by default** — `clamp()` scaling for spacing, type, radii, borders, icons.
- **Semantic OKLCH tokens** — define 5 base colors, get light/dark/muted/border variants derived automatically.
- **Cascade layers** — `reset → tokens → base → layout → components → utilities`, so utility classes always win without `!important`.
- **Zero-emission module entry** — `@use "zeus" as *` in a component's `.module.scss` gives you every mixin/function with **no** leaked CSS.
- **Config-first** — every token lives in one file you can override; nothing is hardcoded past that boundary.

## Browser support

Zeus targets evergreen browsers only — there is no fallback path for the core
and none is planned. There is no IE11, no legacy Safari, and no polyfill
story: if you need to support browsers older than ~2023, Zeus is not the
right choice.

**Required (the whole framework depends on these).** Cascade layers
(`@layer`), container query units (`cqi`, `container-type`), `@property`,
relative color syntax (`oklch(from …)`), `:has()`, `color-mix()`. All are
Baseline "Widely available" in current Chrome/Edge, Firefox, and Safari.

**Progressive enhancement (a few components use these and degrade if
absent).** These are *not* uniformly Baseline — check current support for
your targets rather than assuming:

| Feature | Used by | Without it you get |
| --- | --- | --- |
| `popover` attribute | `.z-tooltip`, `.z-dropdown`, `.z-toast-region` | No top-layer rendering or light-dismiss — these three need it to function; verify support before relying on them |
| CSS anchor positioning (`position-anchor`, `position-area`) | `.z-tooltip`, `.z-dropdown` | Still a fully working popover, just placed by the UA default instead of anchored to its trigger |
| `@starting-style`, `transition-behavior: allow-discrete` | `.z-tooltip`, `.z-dropdown` enter/exit | Instant show/hide instead of a fade — purely cosmetic |

Anchor positioning has the narrowest support of the three (Chromium shipped
it well ahead of the other engines). The components are written so its
absence costs placement, never functionality.

## Install

```bash
npm install zeus-css
```

No Sass pipeline and no customization needed? Import the precompiled CSS
once, at your app root, and skip everything below about entry points and
theming:

```tsx
// app/layout.tsx
import "zeus-css/css"; // or "zeus-css/dist/zeus.css" / "zeus-css/min" for the minified build
```

## Two ways to consume Zeus — pick one

These are **mutually exclusive** at the app-root level. Never load both in
the same project.

| | No Sass pipeline | Sass pipeline (Next.js, Vite, webpack `sass-loader`) |
|---|---|---|
| **Import** | `zeus-css/css` (plain compiled CSS) | `@use "zeus-css/foundation"` |
| **Customizable?** | No — ships the default token values baked in | Yes — edit `zeus.customize.scss` first (see [Theming your brand](#theming-your-brand)) |
| **Use when** | You just want the framework as-is, no build step | You want your own brand colors/type/spacing |

If you don't need custom theming, skip straight to
[Install](#install) and use the plain CSS import. If you *do* need custom
theming, use the SCSS entry point — the precompiled CSS can't reflect your
overrides, since it was built once, at publish time, with the default tokens.

## Two entry points (SCSS pipeline)

Once you're on the SCSS path, Zeus exposes two distinct entry points — pick the right one per file.

### 1. Global stylesheet — `foundation`

Import **once**, at your app root. Emits the full compiled CSS: reset, design
tokens as CSS custom properties, typography base, and every utility class
(`.padding-lg`, `.text-h1`, `.grid-cols-3`, …).

```scss
// app/globals.scss
@use "zeus-css/foundation";
```

### 2. Component modules — `zeus`

Import in **every** `.module.scss` component file. Exposes all mixins and
functions (`@include padding(...)`, `@include text(...)`, `color(...)`, …) but
emits **zero** CSS of its own — only the rules you actually write.

```scss
// Button.module.scss
@use "zeus-css/zeus" as *;

.button {
  @include padding("md", "x");
  @include text("button");
  @include border-radius("sm");
  background: color("primary");
  color: var(--color-text-inverse);

  &:hover {
    background: color("primary-dark");
  }
}
```

## 5-minute quickstart

```scss
// 1. app/globals.scss — load the framework once
@use "zeus-css/foundation";
```

```tsx
// 2. app/layout.tsx — import the global stylesheet
import "./globals.scss";
```

```scss
// 3. components/Card.module.scss — build a component with the API
@use "zeus-css/zeus" as *;

.card {
  @include padding("lg");
  @include border-radius("md");
  @include card-shadow();
  background: var(--color-surface);
  border: var(--border-line-xs) solid var(--color-border);
}

.title {
  @include text("h4");
  color: var(--color-text);
}
```

```tsx
// components/Card.tsx
import styles from "./Card.module.scss";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}
```

That's it — no build config, no PostCSS plugin. Zeus compiles with any
standard Dart Sass pipeline (Next.js, Vite, webpack `sass-loader`, or the
`sass` CLI directly).

## Theming your brand

> ⚠️ Only relevant if you're on the **Sass pipeline** path above. If you
> imported the plain `zeus-css/css` build, there is nothing to configure here
> — remove that import first, then follow the steps below instead. Don't use
> both.

Every visual token — colors, typography, spacing, radii, shadows, breakpoints
— lives in **one file**: `zeus.customize.scss`. Copy the keys you want to
override from `zeus.token.sets.example.scss` (a reference-only file, never
imported) into your own `zeus.customize.scss` before the `@use` chain resolves.
Then compile through `@use "zeus-css/foundation"` as shown in
[Global stylesheet — foundation](#1-global-stylesheet--foundation) — your
overrides are baked into the CSS your own Sass pipeline emits.

```scss
// zeus.customize.scss
$zeus-colors: (
  "primary": oklch(60% 0.2 250),
  "primary-light": oklch(75% 0.15 250),
  "primary-dark": oklch(45% 0.25 250),
  // ...
);
```

Layout/engine behavior (prefixing, responsive strategy, fluid viewport bounds)
lives in `zeus.config.scss` — separate from design tokens on purpose, so
brand changes and structural changes never collide in the same diff.

## Learn more

- `zeus.token.sets.example.scss` — full reference of every default token value.
- `CHANGELOG.md` — what changed between versions.
- `API.md` — the full public API surface: entry points, config variables,
  mixins/functions, utility classes, components, and design tokens.

## License

MIT © Stavros Kosmas Lazaris
