#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════╗
// ║  ⚡ Zeus CSS — Compile Matrix Test                             ║
// ║                                                               ║
// ║  Compiles the framework in every mode a real consumer would   ║
// ║  use it in, and fails the run (non-zero exit code) if any     ║
// ║  mode errors, emits a deprecation warning, or regresses a     ║
// ║  known behavioral contract (zero-emission entry point, the    ║
// ║  prefix system, or config overrides actually taking effect).  ║
// ╚══════════════════════════════════════════════════════════════╝

import * as sass from "sass";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

let failures = 0;

function reportPass(label) {
  console.log(`  ✓ ${label}`);
}

function reportFail(label, detail) {
  failures++;
  console.error(`  ✗ ${label}`);
  if (detail) console.error(`    ${detail}`);
}

// Collects warnings/deprecations instead of letting Sass print them to
// stderr — lets us assert "zero warnings" as a pass/fail condition.
function makeLogger() {
  const messages = [];
  return {
    warn(message, options) {
      messages.push({ message, ...options });
    },
    messages,
  };
}

function compileString(source, opts = {}) {
  const logger = makeLogger();
  const result = sass.compileString(source, {
    loadPaths: [ROOT],
    logger,
    ...opts,
  });
  return { css: result.css, warnings: logger.messages };
}

function compileFile(relativePath, opts = {}) {
  const logger = makeLogger();
  const result = sass.compile(join(ROOT, relativePath), {
    loadPaths: [ROOT],
    logger,
    ...opts,
  });
  return { css: result.css, warnings: logger.messages };
}

console.log("Zeus CSS — compile matrix\n");

// Captured by check 1, reused by check 8 (WCAG) so the contrast guard reads
// the actual compiled default palette instead of a hand-copied literal that
// could silently drift from zeus.customize.scss.
let defaultBuildCss = null;

// ── 1. Default build ─────────────────────────────────────────────
// The full stylesheet a consumer links once at the app root.
try {
  const { css, warnings } = compileFile("foundation/foundation.scss");
  defaultBuildCss = css;
  if (warnings.length > 0) {
    reportFail(
      "1. Default build (foundation.scss)",
      `${warnings.length} warning(s): ${warnings[0].message}`
    );
  } else if (css.length < 50_000) {
    reportFail(
      "1. Default build (foundation.scss)",
      `output suspiciously small (${css.length} bytes) — expected >50KB`
    );
  } else {
    reportPass(`1. Default build (foundation.scss) — ${(css.length / 1024).toFixed(1)}KB, 0 warnings`);
  }
} catch (err) {
  reportFail("1. Default build (foundation.scss)", err.message);
}

// ── 2. Module entry — zero-emission contract ────────────────────
// @use "zeus" as * must expose every mixin/function without leaking any
// CSS of its own. A component using a handful of mixins should compile
// to only its own rules — not the ~150 lines of keyframes/utility CSS
// that used to leak before this was fixed.
try {
  const source = `
    @use "zeus" as *;
    .t { @include p("md"); @include text(h1); @include fade-in(); color: color("primary"); }
  `;
  const { css, warnings } = compileString(source);
  const lineCount = css.trim().split("\n").length;
  if (warnings.length > 0) {
    reportFail("2. Module entry zero-emission", `${warnings.length} warning(s): ${warnings[0].message}`);
  } else if (lineCount > 20) {
    reportFail(
      "2. Module entry zero-emission",
      `expected a small, self-contained ruleset (<20 lines) but got ${lineCount} lines — ` +
        `zeus.scss may be leaking top-level CSS again`
    );
  } else {
    reportPass(`2. Module entry zero-emission — ${lineCount} lines, 0 warnings`);
  }
} catch (err) {
  reportFail("2. Module entry zero-emission", err.message);
}

// ── 3. Prefix build ──────────────────────────────────────────────
// $zeus-use-prefix must apply consistently across every utility family.
try {
  const source = `
    @use "zeus.config" with ($zeus-use-prefix: true);
    @use "foundation/foundation";
  `;
  const { css, warnings } = compileString(source);
  const hasPrefixed = /\.z-container\b/.test(css) && /\.z-shadow-md\b/.test(css) && /\.z-grid-sidebar\b/.test(css);
  const hasUnprefixedLeak = /(?<![-\w])\.container\s*\{/.test(css);
  if (warnings.length > 0) {
    reportFail("3. Prefix build", `${warnings.length} warning(s): ${warnings[0].message}`);
  } else if (!hasPrefixed) {
    reportFail("3. Prefix build", "expected .z-container / .z-shadow-md / .z-grid-sidebar in output");
  } else if (hasUnprefixedLeak) {
    reportFail("3. Prefix build", "found an unprefixed .container leaking through despite $zeus-use-prefix: true");
  } else {
    reportPass("3. Prefix build — prefixed classes present, no unprefixed leaks, 0 warnings");
  }
} catch (err) {
  reportFail("3. Prefix build", err.message);
}

// ── 4. Config override contract ──────────────────────────────────
// Whatever a developer writes in $zeus-colors / $zeus-column-gaps must
// win over the framework's own derived/default values.
try {
  const source = `
    @use "zeus.config" with (
      $zeus-column-gaps: (lg: (floor: 30, ceil: 77)),
      $zeus-colors: ("primary": oklch(60% 0.2 200))
    );
    @use "foundation/foundation";
  `;
  const { css, warnings } = compileString(source);
  const gapOk = css.includes("clamp(30px") && css.includes("77px");
  const colorOk = css.includes("--color-primary: oklch(60% 0.2 200deg)");
  if (warnings.length > 0) {
    reportFail("4. Config override contract", `${warnings.length} warning(s): ${warnings[0].message}`);
  } else if (!gapOk || !colorOk) {
    reportFail(
      "4. Config override contract",
      `override did not apply — gap ok: ${gapOk}, color ok: ${colorOk}`
    );
  } else {
    reportPass("4. Config override contract — floor/ceil and color overrides both applied, 0 warnings");
  }
} catch (err) {
  reportFail("4. Config override contract", err.message);
}

// ── 5. Public API smoke test — every public mixin/function ───────
// A mixin that's public but never called by the framework's own default
// build (e.g. btn-icon-only() once did) can carry a broken internal @use
// and nobody notices until a consumer reaches for it directly. This calls
// every public mixin/function (same "no leading _" convention as
// gen-cheatsheet.mjs) at least once through the zero-emission entry point.
try {
  const source = `
    @use "zeus" as *;

    .smoke {
      @include fade-in(); @include slide-in(); @include scale();
      @include bounce(); @include pulse(); @include rotate();
      @include button-base-reset(); @include button-structure();
      @include button-apply-variant(); @include btn-primary();
      @include btn-secondary(); @include btn-tertiary(); @include btn-icon-only();
      @include btn-variant(); @include btn-size();
      @include border-radius("md"); @include border-line("md"); @include box-size("md");
      @include padding("md"); @include margin("md"); @include gap("md");
      @include apply-shadow(); @include elevation(); @include hover-shadow();
      @include focus-shadow(); @include interactive-shadow(); @include card-shadow();
      @include semantic-shadow(); @include glow-effect(); @include inner-shadow();
      @include layered-shadow("md", "primary"); @include conditional-shadow();
      @include no-shadow();
      @include p("md"); @include m("md"); @include g("md"); @include r("md");
      @include t(h1); @include sz("md"); @include text(h1);
      @include not-first-child(); @include not-last-child();
      @include horizontal-scroll(); @include no-horizontal-scroll();
      @include suppress-on("mobile");
      --smoke-color: #{color("primary")};
      --smoke-bp: #{bp("lg")};
      --smoke-sizing: #{useclamp-sizing(10, 20)};
      --smoke-typography: #{useclamp-typography("h1")};
      --smoke-map: #{map-get-safe(("a": 1), "a")};
    }
    @include screen-above("lg") { .x { color: red; } }
    @include screen-below("lg") { .x { color: red; } }
    @include screen-between("sm", "lg") { .x { color: red; } }
    @include zeus-theme("smoke-test", (
      primary: #123456, secondary: #654321, accent: #abcdef,
      body: #ffffff, text: #000000,
    ));
  `;
  const { warnings } = compileString(source);
  if (warnings.length > 0) {
    reportFail("5. Public API smoke test", `${warnings.length} warning(s): ${warnings[0].message}`);
  } else {
    reportPass("5. Public API smoke test — every public mixin/function invoked, 0 warnings");
  }
} catch (err) {
  reportFail("5. Public API smoke test", err.message);
}

// ── 6. Config variable usage analysis ─────────────────────────────
// Every $zeus-* variable declared in zeus.config.scss/zeus.customize.scss
// should actually be read somewhere in the engine — an orphaned variable is
// exactly the shape of the old $zeus-breakpoint-strategy: public config
// surface for a feature that doesn't do anything.
try {
  const configSrc = readFileSync(join(ROOT, "zeus.config.scss"), "utf8");
  const customizeSrc = readFileSync(join(ROOT, "zeus.customize.scss"), "utf8");
  const declared = [...`${configSrc}\n${customizeSrc}`.matchAll(/^\$(zeus-[a-zA-Z0-9-]+)\s*:/gm)].map(
    (m) => m[1]
  );

  function walkScss(dir) {
    let out = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const s = statSync(full);
      if (s.isDirectory()) out = out.concat(walkScss(full));
      else if (entry.endsWith(".scss")) out.push(full);
    }
    return out;
  }
  const engineSrc = walkScss(join(ROOT, "foundation"))
    .map((f) => readFileSync(f, "utf8"))
    .join("\n");

  const orphans = declared.filter((name) => {
    const usageRegex = new RegExp(`\\$${name}\\b`, "g");
    return (engineSrc.match(usageRegex) || []).length === 0;
  });

  if (orphans.length > 0) {
    reportFail(
      "6. Config variable usage analysis",
      `declared but never read by foundation/: ${orphans.join(", ")}`
    );
  } else {
    reportPass(`6. Config variable usage analysis — ${declared.length}/${declared.length} variables consumed`);
  }
} catch (err) {
  reportFail("6. Config variable usage analysis", err.message);
}

// ── 7. CLI bridge template variable integrity ─────────────────────
// npx zeus-css init generates a bridge file (scripts/build-package.ts's
// cliContent template, two levels up from this package) that forwards named
// $zeus-* variables into @use "zeus-css/scss/zeus.scss" with (...) — a
// renamed/removed variable on either side breaks that bridge silently until
// someone actually runs init.
// Soft-skips (doesn't fail) if that generator isn't present in this
// checkout, e.g. when this package is checked out/published standalone.
try {
  const buildPackagePath = join(ROOT, "..", "..", "scripts", "build-package.ts");
  if (!existsSync(buildPackagePath)) {
    reportPass("7. CLI bridge template variable integrity — skipped (build-package.ts not in this checkout)");
  } else {
    const configSrc = readFileSync(join(ROOT, "zeus.config.scss"), "utf8");
    const customizeSrc = readFileSync(join(ROOT, "zeus.customize.scss"), "utf8");
    const declared = new Set(
      [...`${configSrc}\n${customizeSrc}`.matchAll(/^\$(zeus-[a-zA-Z0-9-]+)\s*:/gm)].map((m) => m[1])
    );
    const bridgeSrc = readFileSync(buildPackagePath, "utf8");
    const referenced = [
      ...bridgeSrc.matchAll(/local(?:Config|Customize)\.\$(zeus-[a-zA-Z0-9-]+)/g),
    ].map((m) => m[1]);

    const phantom = [...new Set(referenced)].filter((name) => !declared.has(name));
    const missing = [...declared].filter((name) => !referenced.includes(name));

    if (phantom.length > 0) {
      reportFail(
        "7. CLI bridge template variable integrity",
        `bridge references variable(s) that don't exist: ${phantom.join(", ")}`
      );
    } else if (missing.length > 0) {
      reportFail(
        "7. CLI bridge template variable integrity",
        `declared but not forwarded by the init bridge: ${missing.join(", ")}`
      );
    } else {
      reportPass(`7. CLI bridge template variable integrity — ${referenced.length} variables match 1:1`);
    }
  }
} catch (err) {
  reportFail("7. CLI bridge template variable integrity", err.message);
}

// ── 8. WCAG AA contrast regression guard ──────────────────────────
// The exact class of bug that shipped twice in this framework's history
// (.btn-primary, then secondary/accent) — a color token gets
// darkened/lightened without re-checking contrast. Reads the *compiled*
// default palette from check 1's output (not a hand-copied literal) so this
// can never itself drift from zeus.customize.scss, and fails the build the
// moment any of these pairs regresses below WCAG AA.
try {
  if (!defaultBuildCss) {
    reportFail("8. WCAG AA contrast regression guard", "no compiled CSS available (check 1 failed)");
  } else {
    const oklch = (name) => {
      const m = defaultBuildCss.match(
        new RegExp(`--color-${name}:\\s*oklch\\(([\\d.]+)%\\s+([\\d.]+)\\s+([\\d.]+)deg\\)`)
      );
      if (!m) throw new Error(`--color-${name} not found as a literal oklch() in compiled CSS`);
      return { l: parseFloat(m[1]) / 100, c: parseFloat(m[2]), h: parseFloat(m[3]) };
    };

    // CSS Color 4 OKLab -> linear sRGB matrices, with chroma-reduction gamut
    // mapping (binary search) so out-of-gamut tokens are handled roughly the
    // way a real browser's oklch() resolves them, not naively clamped.
    //
    // ACCURACY CAVEAT: for colors outside sRGB this is an approximation of
    // Chromium's actual gamut-mapping algorithm, and measured deviation is up
    // to ~0.3 on the resulting ratio (the default accent computes 4.85 here
    // but renders 4.55 in Chromium 148 — both pass, but the real margin is
    // thinner than this number suggests). Treat a result in the 4.5–4.8 band
    // as "verify in a browser", not "comfortably passing".
    const toLinearSrgb = (L, C, hDeg) => {
      const h = (hDeg * Math.PI) / 180;
      const a = C * Math.cos(h);
      const b = C * Math.sin(h);
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
      const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
      return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
      ];
    };
    const gammaEncode = (c) => {
      const cc = Math.min(1, Math.max(0, c));
      return cc <= 0.0031308 ? cc * 12.92 : 1.055 * Math.pow(cc, 1 / 2.4) - 0.055;
    };
    const inGamut = ([r, g, b]) => r >= -1e-4 && r <= 1.0001 && g >= -1e-4 && g <= 1.0001 && b >= -1e-4 && b <= 1.0001;
    const toSrgb255 = (L, C, hDeg) => {
      let lin = toLinearSrgb(L, C, hDeg);
      if (!inGamut(lin)) {
        let lo = 0, hi = C;
        for (let i = 0; i < 20; i++) {
          const mid = (lo + hi) / 2;
          if (inGamut(toLinearSrgb(L, mid, hDeg))) lo = mid; else hi = mid;
        }
        lin = toLinearSrgb(L, lo, hDeg);
      }
      return lin.map(gammaEncode).map((v) => Math.min(1, Math.max(0, v)) * 255);
    };
    const relLuminance = ([r, g, b]) => {
      const f = (c) => {
        c = c / 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const contrastOf = (colA, colB) => {
      const rgbA = toSrgb255(colA.l, colA.c, colA.h);
      const rgbB = toSrgb255(colB.l, colB.c, colB.h);
      const La = relLuminance(rgbA), Lb = relLuminance(rgbB);
      const hi = Math.max(La, Lb), lo = Math.min(La, Lb);
      return (hi + 0.05) / (lo + 0.05);
    };

    // Mirrors derive-on-color() in design/colors/_color-derivation.scss —
    // same 0.6 lightness switch between near-dark (0.218) and near-light
    // (0.976) at chroma 0. Kept in sync deliberately: if the SCSS threshold
    // changes without changing this, the assertions below stop describing
    // what actually ships and one of them will fail loudly.
    const onColorOf = (col) => ({
      l: col.l < 0.6 ? 0.976 : 0.218,
      c: 0,
      h: col.h,
    });

    const text = oklch("text");
    const background = oklch("background");
    const textInverse = oklch("text-inverse");
    const primary = oklch("primary");
    const secondary = oklch("secondary");
    const accent = oklch("accent");

    const systemOklch = (name) => {
      const m = defaultBuildCss.match(
        new RegExp(`--base-system-${name}:\\s*oklch\\(([\\d.]+)%\\s+([\\d.]+)\\s+([\\d.]+)deg\\)`)
      );
      if (!m) throw new Error(`--base-system-${name} not found as a literal oklch() in compiled CSS`);
      return { l: parseFloat(m[1]) / 100, c: parseFloat(m[2]), h: parseFloat(m[3]) };
    };

    // Only pairings the framework actually ships are asserted here. Note what
    // is deliberately NOT in this list: text-inverse (white) on
    // --color-secondary. The default secondary is a light brand orange, so
    // white-on-secondary is ~2.2:1 and is not a supported combination — the
    // framework never emits it (see .z-badge--solid, which derives its
    // foreground per fill). Asserting it would be asserting a combination the
    // design system doesn't offer.
    const pairs = [
      { label: "text/background (body)", a: text, b: background, min: 4.5 },
      { label: "text-inverse/primary (.btn-primary)", a: textInverse, b: primary, min: 4.5 },
      { label: "text-inverse/accent (.bg-accent + white)", a: textInverse, b: accent, min: 4.5 },
      { label: "text/secondary (.bg-secondary + dark text — the supported pairing)", a: text, b: secondary, min: 4.5 },
    ];

    // Every .z-badge--solid variant, using the on-color the CSS actually
    // derives. This is what caught the real bug: a hardcoded white foreground
    // failed on 3 of these 6 fills.
    for (const [label, col] of [
      ["primary", primary],
      ["secondary", secondary],
      ["accent", accent],
      ["success", systemOklch("success")],
      ["warning", systemOklch("warning")],
      ["error", systemOklch("error")],
    ]) {
      pairs.push({
        label: `.z-badge--solid.z-badge--${label} (derived on-color)`,
        a: onColorOf(col),
        b: col,
        min: 4.5,
      });
    }

    const results = pairs.map((p) => ({ ...p, ratio: contrastOf(p.a, p.b) }));
    const regressed = results.filter((r) => r.ratio < r.min);

    if (regressed.length > 0) {
      reportFail(
        "8. WCAG AA contrast regression guard",
        regressed.map((r) => `${r.label} — ${r.ratio.toFixed(2)}:1, needs ${r.min}:1`).join("; ")
      );
    } else {
      const lowest = results.reduce((a, b) => (a.ratio < b.ratio ? a : b));
      reportPass(
        `8. WCAG AA contrast regression guard — ${results.length} shipped pairings all ≥ 4.5:1 ` +
          `(lowest: ${lowest.ratio.toFixed(2)} on ${lowest.label})`
      );
    }
  }
} catch (err) {
  reportFail("8. WCAG AA contrast regression guard", err.message);
}

console.log("");
if (failures > 0) {
  console.error(`${failures} check(s) failed.`);
  process.exit(1);
} else {
  console.log("All checks passed.");
  process.exit(0);
}
