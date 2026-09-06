#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════╗
// ║  ⚡ Zeus CSS — Cheatsheet Generator                            ║
// ║                                                               ║
// ║  Scans the actual SCSS source (never hand-maintained, so it   ║
// ║  can't drift) for every public @mixin/@function signature and ║
// ║  every utility-class family pattern, and emits:                ║
// ║    llms.txt        — flat, LLM-context-friendly reference      ║
// ║    cheatsheet.md   — the same content, as readable Markdown    ║
// ║                                                                ║
// ║  "Public" = does not start with "_" — the framework's own      ║
// ║  established convention for internal/private helpers.          ║
// ╚══════════════════════════════════════════════════════════════╝

import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function walk(dir) {
  let out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) out = out.concat(walk(full));
    else if (entry.endsWith(".scss")) out.push(full);
  }
  return out;
}

// ── 1. Mixins & functions ─────────────────────────────────────────
const engineFiles = walk(join(ROOT, "foundation/core/engine")).concat(
  walk(join(ROOT, "foundation/core/buttons"))
);

const apiEntries = [];
const defStartRegex = /^(@mixin|@function)\s+([a-zA-Z][a-zA-Z0-9-]*)\s*(\(|\{|$)/;

// A comment line counts as a real description only if it's mostly letters —
// filters out decorative dividers like "╚══...══╝", "----...----",
// "= = = = = = =" that would otherwise get picked up as the "description".
function isProseComment(line) {
  const stripped = line.trim().replace(/^\/+\s*/, "");
  if (stripped.length < 3) return false;
  const letters = (stripped.match(/[a-zA-Z]/g) || []).length;
  return letters / stripped.length > 0.4;
}

for (const file of engineFiles) {
  const raw = readFileSync(file, "utf8");
  const lines = raw.split("\n");
  const relPath = relative(ROOT, file).replace(/\\/g, "/");

  // Whole-file opt-out: a header explicitly stating this file is private
  // (e.g. "Private file — NOT part of the public API", fluid-core.scss)
  // takes precedence over the underscore-name convention below.
  const header = lines.slice(0, 15).join("\n");
  if (/not part of the public api|private file/i.test(header)) continue;

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(defStartRegex);
    if (!m) continue;
    const [, kind, name] = m;
    if (name.startsWith("_")) continue; // private, skip

    // Collect the full signature by tracking paren depth across lines —
    // handles both multi-line parameter lists (@mixin slide-in(\n $a,\n $b\n))
    // and default values that themselves contain parens (rgba(59,130,246,0.5)).
    let sigText = "";
    let depth = 0;
    let started = false;
    outer: for (let j = i; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === "(") {
          depth++;
          started = true;
        } else if (ch === ")") {
          depth--;
        }
        sigText += ch;
        if (started && depth === 0) break outer;
        if (!started && ch === "{") break outer; // no-parens mixin: "@mixin foo() {" already handled; "@mixin foo {" edge case
      }
      sigText += " ";
    }
    const parenMatch = sigText.match(/\(([\s\S]*)\)/);
    const params = parenMatch
      ? "(" + parenMatch[1].replace(/\s+/g, " ").trim() + ")"
      : "()";

    // Find the nearest preceding prose comment line as description
    let desc = "";
    for (let j = i - 1; j >= 0 && j > i - 6; j--) {
      const t = lines[j].trim();
      if (t === "") continue;
      if (t.startsWith("//")) {
        if (isProseComment(t)) desc = t.replace(/^\/+\s*/, "");
        break;
      }
      break;
    }
    apiEntries.push({ kind: kind.slice(1), name, params, desc, file: relPath });
  }
}

// ── 2. Utility class families ──────────────────────────────────────
const classFiles = walk(join(ROOT, "foundation/views/render/classes"));
const classFamilies = [];
const mixinNameRegex = /@mixin\s+(load-[a-zA-Z-]+)/;
const classRegex = /\.#\{\$prefix\}([a-zA-Z0-9_\\:-]+)/g;

for (const file of classFiles) {
  const src = readFileSync(file, "utf8");
  const relPath = relative(ROOT, file).replace(/\\/g, "/");
  const mixinMatch = src.match(mixinNameRegex);
  const loaderName = mixinMatch ? mixinMatch[1] : relPath;
  const seen = new Set();
  let m;
  while ((m = classRegex.exec(src)) !== null) {
    // The regex boundary already stops before "#{...}" interpolations, so a
    // dynamic class like ".col-span-#{$i}" is captured as "col-span-" — turn
    // that trailing dash into a readable "{n}" placeholder. Also strip a
    // trailing "\\:" left over from the hover:/focus: variant escape.
    let family = m[1].replace(/\\:$/, "");
    if (family.endsWith("-")) family += "{n}";
    if (!seen.has(family)) {
      seen.add(family);
      classFamilies.push({ family, loader: loaderName, file: relPath });
    }
  }
}

// ── 3. Render llms.txt ──────────────────────────────────────────────
let llms = "";
llms += "# Zeus CSS — LLM Reference\n\n";
llms += "Auto-generated from source (scripts/gen-cheatsheet.mjs). Two entry points:\n";
llms += '  @use "zeus" as *;         — mixins/functions only, zero CSS emitted\n';
llms += '  @use "foundation";        — full compiled CSS, import once at app root\n\n';

llms += "## Mixins & Functions\n\n";
for (const e of apiEntries) {
  llms += `${e.kind} ${e.name}${e.params}`;
  if (e.desc) llms += ` — ${e.desc}`;
  llms += ` [${e.file}]\n`;
}

llms += "\n## Utility Class Families\n\n";
for (const c of classFamilies) {
  llms += `.${c.family}  (${c.loader})  [${c.file}]\n`;
}

writeFileSync(join(ROOT, "llms.txt"), llms);

// ── 4. Render cheatsheet.md ──────────────────────────────────────────
let md = "# Zeus CSS Cheatsheet\n\n";
md += "> Auto-generated from source — do not hand-edit. Regenerate with `npm run gen:cheatsheet`.\n\n";

md += "## Mixins & Functions\n\n";
md += "| Kind | Signature | Description | File |\n";
md += "|---|---|---|---|\n";
for (const e of apiEntries) {
  md += `| ${e.kind} | \`${e.name}${e.params}\` | ${e.desc} | \`${e.file}\` |\n`;
}

md += "\n## Utility Class Families\n\n";
md += "| Class pattern | Generator mixin | File |\n";
md += "|---|---|---|\n";
for (const c of classFamilies) {
  md += `| \`.${c.family}\` | \`${c.loader}()\` | \`${c.file}\` |\n`;
}

writeFileSync(join(ROOT, "cheatsheet.md"), md);

console.log(
  `Wrote llms.txt + cheatsheet.md — ${apiEntries.length} mixins/functions, ${classFamilies.length} utility class families`
);
