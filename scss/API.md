# Zeus CSS — Public API Surface (v1.0.0)

This document is the semver contract. Everything listed here is **public and
stable**: it will not change or be removed except in a major version bump
(`2.0.0`), following [Semantic Versioning](https://semver.org/). Everything
*not* listed here — including anything explicitly marked "internal" below —
is free to change in a minor or patch release without notice.

Generated references (`llms.txt`, `cheatsheet.md`, `zeus.tokens.json`) are
regenerated from source on every `npm run prepack` and always reflect the
current public surface described here. If they ever disagree with this file,
this file wins.

## 1. Entry points

| Import | Emits CSS? | Use in |
|---|---|---|
| `import "zeus-css/css";` | Yes — precompiled, default tokens only, not customizable | App root, no Sass pipeline |
| `import "zeus-css/min";` | Yes — same as above, minified | App root, no Sass pipeline, production |
| `@use "zeus-css/foundation";` | Yes — full compiled framework | App root, once, Sass pipeline |
| `@use "zeus-css/zeus" as *;` | No — mixins/functions only | Every `.module.scss` |
| `@use "zeus-css/config";` | No | Only if you need raw access to `$zeus-*` config variables |
| `@use "zeus-css/customize";` | No | Only if you need raw access to `$zeus-colors` etc. without the rest of config |

`zeus-css/css` and `zeus-css/min` are static builds of `foundation.scss` with
default tokens baked in at publish time (`npm run build:css`) — they cannot
reflect `zeus.customize.scss` overrides. Use one of the two SCSS entry points
below instead if you need custom tokens.

`package.json` → `files` is the authoritative list of what ships: the
`foundation/**/*.scss` tree, the six entry points above (plus their compiled
`dist/` output), `zeus.tokens.json`, `llms.txt`, `cheatsheet.md`, `LICENSE`,
`README.md`, `CHANGELOG.md`. Anything under `foundation/` not reachable
through `foundation` or `zeus` (see §6) is an implementation detail even
though the file ships.

## 2. Config variables (`zeus.config.scss`, `zeus.customize.scss`)

Every `!default` variable in these two files is public: name, accepted
values/shape, and default value are all part of the contract.

**Feature toggles** — `$zeus-enable-responsive-classes`, `$zeus-enable-animation-classes`,
`$zeus-enable-grid-system`, `$zeus-enable-shadow-classes`,
`$zeus-enable-color-utilities`, `$zeus-enable-property-registration`.

**Naming & compile strategy** — `$zeus-use-prefix`, `$zeus-class-prefix`,
`$zeus-version`. All responsive utilities are mobile-first (`min-width`);
there is no desktop-first mode and no config knob for one — see CHANGELOG
for the removal rationale.

**Fluid engine bounds** — `$zeus-container-bounds`, `$zeus-root-font-size`,
`$zeus-focus-ring`.

**Layout** — `$zeus-outer-max-width`, `$zeus-breakpoints`, `$zeus-outer-padding`,
`$zeus-column-gaps`.

**Design tokens** (`zeus.customize.scss`, forwarded through `zeus.config.scss`)
— `$zeus-colors`, and every other token map documented inline in that file
(typography, spacing, radii, border widths, icon sizes, shadows, z-index).
Reference values for every key: `zeus.token.sets.example.scss`.

Any Sass map above may have individual keys overridden without providing the
whole map — that merge behavior is itself part of the contract.

## 3. Public mixins & functions

Everything forwarded by `foundation/core/design`, `foundation/core/engine`,
and `foundation/core/api` — i.e. everything reachable via
`@use "zeus" as *`. The full catalog with signatures lives in
[`llms.txt`](llms.txt) / [`cheatsheet.md`](cheatsheet.md) (auto-generated, do
not hand-edit). Highlights: `padding()`, `margin()`, `gap()`, `border-radius()`,
`border-line()`, `box-size()`, `text()`, `color()`, `zeus-theme()`,
`apply-shadow()` / `elevation()` / `hover-shadow()` / `card-shadow()` / the
rest of the shadow mixin family, `screen-above()` / `screen-below()` /
`screen-between()` / `suppress-on()`, `fade-in()` / `slide-in()` / `scale()` /
`bounce()` / `pulse()` / `rotate()`, the `btn-*` mixin family, and the `p()` /
`m()` / `g()` / `r()` / `t()` / `sz()` shorthand aliases.

**Internal, not public** — anything whose name starts with `_` (e.g.
`_z-control-base`, `_emit-static-color-vars`, `_register-color-tokens`),
and every function/mixin in `foundation/core/engine/_fluid-core.scss`, whose
file header explicitly states it is private. `gen-cheatsheet.mjs` already
excludes these from the generated catalog for the same reason.

## 4. Public utility class families

Every class family listed in [`llms.txt`](llms.txt) / [`cheatsheet.md`](cheatsheet.md)
under "Utility Class Families" — layout (`flex-*`, `grid-*`, `d-*`), spacing
(`gap-*`), color (`bg-*`, `color-*`, `border-color-*`), typography (`text-*`),
shadows (`shadow-*`), borders (`border-radius-*`, `border-line-*`), sizing
(`w-*`, `h-*`, `min-w-*`, `max-w-*`, `box-*`, `icon-*`), position (`static`,
`relative`, `absolute`, `fixed`, `sticky`, `inset-*`, `top-*`, `bottom-*`,
`inset-inline-start-*`, `inset-inline-end-*`), z-index (`layer-*`), animation
(`animate-*`, `delay-*`, `duration-*`), aspect ratio (`aspect-*`), opacity
(`opacity-*`), flex-grow/shrink/order, overflow/object-fit, responsive
visibility (`hidden-*`), the compound utility classes (`surface`,
`surface-flat`, `section-wrap`, `section-wrap-narrow`, `glass`, `divider`,
`sr-only`, `truncate`, `line-clamp-*`, `highlight`, `article`), `.container`,
and the `btn-*` button classes. (Renamed from the `zeus-*` prefix —
`.z-*` is reserved exclusively for the framework's fixed BEM components —
card, modal, form controls — which do NOT participate in
`$zeus-use-prefix`.)

When `$zeus-use-prefix: true`, every class in this list is emitted with
`$zeus-class-prefix` prepended — the prefixing behavior itself is part of the
contract, not just the unprefixed names.

**`$zeus-use-prefix` defaults to `false`.** Unprefixed, `.container` and the
`btn-*` classes can collide with same-named classes from Bootstrap or other
CSS frameworks loaded on the same page. If Zeus is running alongside another
framework, set `$zeus-use-prefix: true` and pick a `$zeus-class-prefix` — the
fixed `.z-*` BEM components (card, modal, form controls, etc.) are already
namespaced and unaffected either way.

## 5. Public components (`foundation/views/components/`)

These class-based components and their documented modifiers:

- **`.z-card`**, `.z-card__media` and the modifiers documented in `_card.scss`
- **`.z-modal-backdrop`**, `.z-modal`
- **`.z-field`**, `.z-field--invalid`, `.z-field-group`, `.z-field__helper`,
  `.z-field__error`, `.z-label`, `.z-label--required`, `.z-input`,
  `.z-textarea`, `.z-select`, `.z-checkbox`, `.z-radio`
- **`.z-badge`** — variants `--primary/--secondary/--accent/--success/
  --warning/--error`, modifier `--solid`, element `.z-badge__dot`
- **`.z-alert`**, **`.z-avatar`** (+ `.z-avatar-group`), **`.z-table`**,
  **`.z-breadcrumb`**, **`.z-pagination`** — variants/elements as documented
  in their respective partials
- **`.z-tabs`** — `.z-tabs__list`, `.z-tabs__tab`, `.z-tabs__panel`. State is
  driven by the native `aria-selected` / `hidden` attributes; which tab is
  selected is the consumer's to manage (Zeus ships no JS).
- **`.z-tooltip`**, **`.z-dropdown`** (+ `.z-dropdown__list/__item/__divider`,
  `__item--danger`) — built on the native `popover` attribute and CSS anchor
  positioning. See README "Browser support": absence of anchor positioning
  degrades placement only. Hover-triggered tooltips need consumer JS;
  `popovertarget` alone gives click-to-toggle.
- **`.z-toast-region`** + **`.z-toast`** (+ `__icon/__body/__title/__message/
  __close`, variants `--success/--warning/--danger/--info`) — the region is
  `popover="manual"`; auto-dismiss timing is the consumer's.
- **`.z-skeleton`** — modifiers `--text/--title/--avatar/--block`

The private `_z-control-base()` mixin these share is an implementation
detail (§3) — only the class names and their documented states (default,
hover, `:focus-visible`, `:disabled`, invalid) are guaranteed.

## 6. Public design tokens (CSS custom properties)

Every CSS custom property emitted by `foundation` (the `--color-*`,
`--space-*`, `--text-*`, `--shadow-*`, `--border-radius-*`, `--border-line-*`,
`--size-icon-*`, `--z-*`, and responsive `--*` vars declared in
`zeus.customize.scss`) is public. The canonical, always-current list — name,
value, and type — is generated straight from the compiled CSS into
[`zeus.tokens.json`](zeus.tokens.json) (W3C Design Tokens format) by
`npm run gen:tokens`; nothing in that file is hand-maintained, so it cannot
drift from what actually ships.

## 7. What is explicitly NOT public

- Anything under `foundation/views/render/` other than the class names listed
  in §4 — the internal `load-*` mixins, file layout, and forward chain are
  free to change.
- `foundation/core/engine/_fluid-core.scss` and any `_`-prefixed
  mixin/function anywhere in the tree (§3).
- The internal cascade-layer wiring (`_layer-order.scss`) and the fact that
  it must forward first — an implementation detail of how layers get their
  order, not something consumers should depend on directly.
- `scripts/*.mjs` (token/cheatsheet generators, and the compile-matrix test
  suite) — tooling, not shipped API.
- File/folder structure inside `foundation/` beyond the two entry points —
  files may be split, merged, or moved as long as the public mixins,
  functions, classes, and tokens above keep working identically.

## 8. Versioning commitment

Starting at `1.0.0`: no breaking change to anything in §1–§6 without a major
version bump. A breaking change is any of — a public mixin/function being
renamed, removed, or changing its required arguments; a public class being
renamed or removed; a public CSS custom property being renamed, removed, or
changing what it resolves to for the same config; a config variable's name,
accepted values, or default changing. Adding new mixins, functions, classes,
tokens, or config keys is a minor release. Bug fixes that don't change the
above are patch releases.
