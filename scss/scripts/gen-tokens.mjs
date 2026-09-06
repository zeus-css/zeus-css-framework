#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════╗
// ║  ⚡ Zeus CSS — Design Tokens JSON Generator                    ║
// ║                                                               ║
// ║  Compiles foundation.scss, extracts every :root custom         ║
// ║  property, and emits a W3C Design Tokens Community Group       ║
// ║  format JSON manifest (zeus.tokens.json) — a single,           ║
// ║  machine-readable contract of the whole token system for       ║
// ║  design tools and AI coding agents. Always generated FROM the  ║
// ║  compiled output, never hand-maintained, so it can never drift ║
// ║  from what actually ships.                                     ║
// ╚══════════════════════════════════════════════════════════════╝

import * as sass from "sass";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { writeFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── 1. Compile the default build ─────────────────────────────────
const { css } = sass.compile(join(ROOT, "foundation/foundation.scss"), {
  loadPaths: [ROOT],
});

// ── 2. Extract every custom property declaration ─────────────────
// Matches "  --name: value;" lines anywhere in the compiled CSS — not
// anchored to the :root selector specifically, so this keeps working
// unchanged if a future token ever needs to be scoped elsewhere.
// The value class excludes { and } so this can never accidentally match
// INTO a BEM modifier selector like ".z-card--flat:hover { ... }" — without
// that exclusion, "--flat:hover {\n  box-shadow: none" looks exactly like a
// "--flat: <value>;" custom property declaration to a naive regex.
const propRegex = /--([a-zA-Z][a-zA-Z0-9-]*):\s*([^;{}]+);/g;
const tokens = new Map(); // name -> value (first occurrence wins)
let match;
while ((match = propRegex.exec(css)) !== null) {
  const [, name, value] = match;
  if (!tokens.has(name)) tokens.set(name, value.trim());
}

// ── 3. Categorize + assign a W3C token $type ──────────────────────
// Order matters — first matching prefix wins.
const CATEGORY_RULES = [
  { prefix: "color-", group: "color", type: "color" },
  { prefix: "base-", group: "base", type: "color" },
  { prefix: "shadow-", group: "shadow", type: "shadow" },
  { prefix: "text-", group: "typography", type: "typography" },
  { prefix: "space-", group: "space", type: "dimension" },
  { prefix: "border-radius-", group: "borderRadius", type: "dimension" },
  { prefix: "border-line-", group: "borderWidth", type: "dimension" },
  { prefix: "size-icon-", group: "iconSize", type: "dimension" },
  { prefix: "col-gap-", group: "columnGap", type: "dimension" },
  { prefix: "padding-outer", group: "spacing", type: "dimension" },
  { prefix: "z-", group: "zIndex", type: "number" },
];

function classify(name) {
  for (const rule of CATEGORY_RULES) {
    if (name.startsWith(rule.prefix)) {
      return { group: rule.group, type: rule.type, key: name.slice(rule.prefix.length) || name };
    }
  }
  return { group: "custom", type: "other", key: name };
}

// ── 4. Build the W3C Design Tokens tree ───────────────────────────
const manifest = {
  $description:
    "Zeus CSS design tokens — auto-generated from the compiled stylesheet. " +
    "Do not hand-edit; regenerate with `npm run gen:tokens`.",
};

for (const [name, rawValue] of tokens) {
  const { group, type, key } = classify(name);
  manifest[group] ??= {};
  // $type: "number" tokens (the z-index scale) get a real JSON number,
  // per the W3C format — not a numeric-looking string.
  const value = type === "number" && !Number.isNaN(Number(rawValue)) ? Number(rawValue) : rawValue;
  manifest[group][key] = {
    $value: value,
    $type: type,
    $description: `--${name}`,
  };
}

const outPath = join(ROOT, "zeus.tokens.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${tokens.size} tokens across ${Object.keys(manifest).length - 1} groups to zeus.tokens.json`);
