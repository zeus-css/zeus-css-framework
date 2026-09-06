# Zeus CSS — AI Agent Guidelines & Architecture Contracts

Welcome, AI agent (Claude Code, Cursor, Copilot, Codex, Windsurf, etc.).
This repository uses **Zeus CSS**, a deterministic, token-driven, fluid-first design system and CSS framework.

## 1. Core Principles (Non-Negotiable)

1. **Zero-Drift Tokens**: Never invent raw color hexes, pixel margins, or arbitrary font sizes. Always map to Zeus CSS tokens or utility classes.
2. **Fluid by Default (CQI)**: Typography and spacing interpolate smoothly across container query bounds (`cqi`). Do not use `vw` units for typography.
3. **Semantic Colors**: Use semantic role tokens (`--color-primary`, `--color-surface`, `--color-text`, `--color-border`) rather than hardcoded raw values.
4. **Structural-Only Breakpoints**: Media queries and responsive prefixes (e.g. `md:grid-cols-2`) are reserved strictly for layout structure changes (e.g., column counts, flex direction). Fluid scaling handles sizes automatically.
5. **Cascade Layers**: Framework CSS lives in `@layer reset, base, tokens, components, utilities`. User overrides naturally take precedence without requiring `!important`.

## 2. Imports & Consumption

### In HTML / React / Next.js:
```tsx
import "zeus-css/dist/zeus.css"; // or linked via CDN in <head>
```

### In SCSS Modules:
```scss
@use "zeus-css/scss/zeus.scss" as *; // zero CSS emitted; exposes mixins & tokens

.myCard {
  padding: var(--space-md) var(--space-lg);
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: var(--border-line-sm) solid var(--color-border);
}
```

## 3. Token Taxonomy & Key Variables

### Colors
- `--color-primary`, `--color-primary-light`, `--color-primary-dark`
- `--color-secondary`, `--color-secondary-light`, `--color-secondary-dark`
- `--color-accent`, `--color-accent-light`, `--color-accent-dark`
- `--color-background`, `--color-surface`, `--color-surface-hover`
- `--color-text`, `--color-text-muted`, `--color-text-inverse`
- `--color-border`, `--color-border-strong`

### Spacing Scale
- `--space-3xs`, `--space-2xs`, `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--space-2xl`, `--space-3xl`

### Typography Tokens (Fluid clamp with rem base)
- Headings: `--text-display-lg`, `--text-display-md`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-h4`
- Body: `--text-body-lg`, `--text-body`, `--text-body-sm`, `--text-caption`, `--text-overline`, `--text-code`

### Layout & Containers
- Single layout boundary: `.container` (max-width 2560px with fluid padding)
- Grid system: `.grid`, `.grid-cols-1`, `.md:grid-cols-2`, `.lg:grid-cols-4`, `.gap-md`, `.gap-lg`
- Flexbox: `.flex`, `.flex-row`, `.flex-column`, `.align-center`, `.justify-between`

## 4. Full Reference Files
- Complete token definitions: `src/zeus-css/zeus.tokens.json`
- LLM Cheat sheet: `public/llms.txt` or `src/zeus-css/llms.txt`
- Full API documentation: `src/zeus-css/API.md`
