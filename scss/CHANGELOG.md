# Changelog

All notable changes to zeus-css are documented in this file.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [1.0.14]

### Fixed

- `npx zeus-css init` no longer writes a bare `"zeus-css/scss/..."` import
  into the generated `zeus.scss` bridge and `zeus.theme.scss`. That specifier
  only resolves via npm-aware tooling (a bundler's module resolution, or
  `sass --load-path=node_modules`) — it silently failed to compile for
  anyone who obtained the framework outside npm (e.g. downloading the
  `zeus-css` folder directly) and had no `node_modules` to point at. The
  generated files now use a real relative path computed from the project
  root to wherever this package actually lives on disk, which compiles with
  plain `sass` in both cases — no flags needed even for the normal npm
  install, where `--load-path=node_modules` is no longer necessary either.
  Verified with real `npm install` (tarball) and raw-folder-download runs.

## [1.0.13]

### Fixed

- **Package tarball no longer ships a stale nested copy of the framework.**
  `scss/dist/*.css` (a 1.0.0-era build with 12 instances of `outline: none`
  instead of the current 7 — an accessibility fix that had already shipped
  in the real `dist/`), the nested `scss/package.json`, `.stylelintrc.json`,
  and dev-only build scripts are no longer included in `files`. Unpacked
  package size drops from carrying a full second copy of the framework to
  just the intended source.
- **`exports["."].sass` now resolves to `./scss/foundation/foundation.scss`**
  instead of `./scss/zeus.scss`. The latter is an intentional zero-emission
  bridge (four `@forward` statements, no CSS) meant for component
  `.module.scss` files via the `zeus-css/zeus` subpath — it was never meant
  to be the target of the bare `zeus-css` import. `@use "pkg:zeus-css"` (or
  any bundler's `sass` condition resolution) now returns the actual
  framework instead of silently compiling to nothing.
- Fixed a compile crash (`Invalid index 2 for a list with 1 elements`) when
  `$zeus-breakpoints` is overridden down to a single entry. The breakpoint
  sort in `root-generator.scss` now guards `$n > 1` before entering the
  loop.
- `<main>` no longer collapses to near-zero width as a flex item. It was
  included (with `body` and `.container`) in the container-query
  `container-type: inline-size` reset, which removes it from normal
  content-based sizing; unlike `body`/`.container`, `<main>` in a flex
  context has no other width source. Removed from that selector, matching
  the reasoning already applied to `.grid`.
- `[hidden]` can now be overridden. The reset declared
  `display: none !important` inside `@layer reset` — the first layer in
  cascade order — and layer order reverses for `!important` declarations,
  so nothing later (layered or not) could win. The `!important` is gone,
  and the selector is now `:where([hidden]):not([hidden="until-found"])`
  so `hidden="until-found"` content stays reachable by in-page find, per
  the HTML spec's own recommended selector for this rule.
- Fluid typography no longer rounds to visible 1.6px steps. The shared
  clamp() engine's `$step` defaults to `0.1` in the *output* unit — fine at
  0.1px for spacing, but 0.1rem (1.6px) for type. Typography now compiles
  with `$step: 0.01` / `$accuracy: 3`, and declared min/max endpoints are
  now reached in practice instead of stopping ~1.6px short.
- `overflow-wrap: anywhere` removed from the `body` reset. It was declared
  alongside `word-break: break-word`, which already handles overflow
  safely; `anywhere` additionally breaks inside words that don't need it,
  including in narrow columns where it isn't wanted.
- Added `border-style: solid` to the universal box-sizing reset. Elements
  reset with `border: 0` (`button`, `input`, `textarea`, `select`) stayed
  invisible even after a consumer later added `border-width`/`border-color`,
  because `border-style` defaulted to `none`. Same fix Tailwind's preflight
  uses.
- `bin/init.js` now exits non-zero on a failed scaffold instead of
  swallowing the error and exiting 0, and responds to `--help`/`-h` with
  usage instead of running the full init routine against the current
  directory.
- `peerDependencies.sass` raised from `^1.60.0` to `^1.79.0`, matching the
  actual floor required by the relative `oklch(from ...)` color syntax and
  the `pkg:` importer used in the docs.
- Removed the `postinstall` script (`bin/postinstall.js`) and its
  `package.json` hook. It only printed a discovery hint for
  `npx zeus-css init`, already covered in the README — not worth pnpm 10
  blocking lifecycle scripts by default, or the supply-chain-scanner flags
  a postinstall script draws for no functional benefit.
- Corrected the README's `@property` claim — coverage is the base semantic
  color palette (5 tokens), not "key tokens" broadly; derived color
  variants, spacing, and typography remain plain custom properties.
- Removed `body-md`, `body-md-bold`, `body-md-semibold`, and `body-md-medium`
  from the typography token map — they were byte-for-byte duplicates of
  `body`/`body-bold`/`body-semibold`/`body-medium`. `--text-body` is now
  the single source; regenerated `zeus.tokens.json`, `cheatsheet.md`, and
  `llms.txt` (both the `scss/` copies and the package-root mirrors, which
  had drifted out of sync). The two real consumers of `--text-body-md`
  (`FinalHeader.module.scss`, `CtaBlock.module.scss`, both outside this
  package) were migrated to `--text-body` — same value, no visual change.
- Fixed an unrelated bug found while migrating `CtaBlock.module.scss`:
  `.installBox` set `font-size: var(--text-body)`, but `--text-body` is a
  `font` *shorthand* (weight/size/line-height/family), not a bare size —
  invalid as a `font-size` value, so it silently fell back to inherited.
  Replaced with `font: var(--text-code);`, matching the token its sibling
  widget (`TheZeusHero.module.scss` `.install`) already uses, per the
  file's own "kept in visual sync" comment.
- Documented that Zeus intentionally ships one color palette with no
  `prefers-color-scheme` / light-dark switching — not a gap, a design
  decision. `zeus-theme()` is for swapping the whole palette (e.g. a
  different brand), not a light/dark toggle. See README Features.
- Fixed a silent-drop bug in color token emission: explicitly setting a
  derived color key in `$zeus-colors` (e.g. `primary-light`) made
  `semantic-colors.scss` skip emitting it, on the assumption that
  `root-generator.scss`'s generic pipeline would emit it instead — but that
  pipeline deliberately excludes `$zeus-colors`. The variable vanished from
  the compiled CSS entirely; with `$zeus-enable-property-registration`
  left at its default it was masked by `@property`'s `initial-value`
  incidentally supplying the same value, but disabling that flag exposed
  the break directly. `_emit-static-color-vars` now always emits every
  variant, using the explicit override when present and the derived value
  otherwise.

### Known issues (tracked, not in this release)

- `round()`/`oklch(from ...)` are used throughout the compiled CSS with no
  `@supports` fallback, so browsers without CSS `round()` support drop the
  affected `clamp()` declarations entirely. Needs a systematic
  progressive-enhancement pass, not a patch-sized fix.
- Class naming mixes three conventions (`z-*` BEM components, `btn-*` and
  `.container` utilities, both covered by `$zeus-use-prefix`). Decided:
  keep as-is rather than a breaking rename — `$zeus-use-prefix` defaults
  to `false`, so `.container`/`btn-*` are unprefixed unless opted in; this
  is now called out explicitly in `API.md` as a collision risk when
  running alongside another framework.
