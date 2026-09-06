#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: npx zeus-css init

Ejects local zeus.config.scss / zeus.customize.scss / zeus.theme.scss (and
zeus-css-env.d.ts in TypeScript projects) into the current directory so you
can override the framework's defaults and recompile.

Options:
  -h, --help   Show this help and exit
`);
  process.exit(0);
}

const projectRoot = process.cwd();
const configTargetPath = path.join(projectRoot, 'zeus.config.scss');
const customizeTargetPath = path.join(projectRoot, 'zeus.customize.scss');
const bridgeTargetPath = path.join(projectRoot, 'zeus.scss');
const themeTargetPath = path.join(projectRoot, 'zeus.theme.scss');
const typesTargetPath = path.join(projectRoot, 'zeus-css-env.d.ts');

// TypeScript is detected, not assumed — a tsconfig.json in the folder you
// ran `init` from means TS needs to resolve the .css/.scss imports below.
// Plain JS projects never see type errors from these imports, so nothing
// is written for them.
const isTypeScriptProject = fs.existsSync(path.join(projectRoot, 'tsconfig.json'));

const configSource = path.join(__dirname, '..', 'scss', 'zeus.config.scss');
const customizeSource = path.join(__dirname, '..', 'scss', 'zeus.customize.scss');

console.log('⚡ Initializing Zeus CSS Configuration (Eject Mode)...');

// Checked per-file rather than all-or-nothing: a project initialized by an
// older version has no zeus.theme.scss, and an all-or-nothing guard would
// skip it forever on re-run. Generated entry points (zeus.scss/zeus.theme.scss)
// are safe to refresh; the two files the developer edits are never touched
// once they exist.
const writeIfMissing = (targetPath, produce, label) => {
  if (fs.existsSync(targetPath)) {
    console.log('⏭️  ' + label + ' already exists — leaving your copy untouched.');
    return;
  }
  produce();
  console.log('✅ Created ' + label);
};

try {
  // 1. Copy original zeus.config.scss and zeus.customize.scss
  writeIfMissing(
    configTargetPath,
    () => fs.copyFileSync(configSource, configTargetPath),
    'zeus.config.scss'
  );
  writeIfMissing(
    customizeTargetPath,
    () => fs.copyFileSync(customizeSource, customizeTargetPath),
    'zeus.customize.scss'
  );

  // Shared "with (...)" body — passes every local override into whichever
  // framework entry point is being configured below.
  const configArgs = `
  // 1. Config Variables
  $zeus-enable-responsive-classes: localConfig.$zeus-enable-responsive-classes,
  $zeus-enable-animation-classes: localConfig.$zeus-enable-animation-classes,
  $zeus-enable-grid-system: localConfig.$zeus-enable-grid-system,
  $zeus-enable-shadow-classes: localConfig.$zeus-enable-shadow-classes,
  $zeus-enable-color-utilities: localConfig.$zeus-enable-color-utilities,
  $zeus-enable-property-registration: localConfig.$zeus-enable-property-registration,
  $zeus-use-prefix: localConfig.$zeus-use-prefix,
  $zeus-class-prefix: localConfig.$zeus-class-prefix,
  $zeus-version: localConfig.$zeus-version,
  $zeus-container-bounds: localConfig.$zeus-container-bounds,
  $zeus-root-font-size: localConfig.$zeus-root-font-size,
  $zeus-focus-ring: localConfig.$zeus-focus-ring,
  $zeus-outer-max-width: localConfig.$zeus-outer-max-width,
  $zeus-breakpoints: localConfig.$zeus-breakpoints,
  $zeus-viewports: localConfig.$zeus-viewports,
  $zeus-viewport-gutter: localConfig.$zeus-viewport-gutter,
  $zeus-outer-padding: localConfig.$zeus-outer-padding,
  $zeus-column-gaps: localConfig.$zeus-column-gaps,

  // 2. Customize Variables (Tokens)
  $zeus-colors: localCustomize.$zeus-colors,
  $zeus-font-family: localCustomize.$zeus-font-family,
  $zeus-typography: localCustomize.$zeus-typography,
  $zeus-space: localCustomize.$zeus-space,
  $zeus-border-radius: localCustomize.$zeus-border-radius,
  $zeus-border-line: localCustomize.$zeus-border-line,
  $zeus-icon-size: localCustomize.$zeus-icon-size,
  $zeus-shadows: localCustomize.$zeus-shadows,
  $zeus-button-sizes: localCustomize.$zeus-button-sizes,
  $zeus-base-colors: localCustomize.$zeus-base-colors,
  $zeus-z-index: localCustomize.$zeus-z-index,
  $zeus-custom-vars: localCustomize.$zeus-custom-vars,
  $zeus-button-variants: localCustomize.$zeus-button-variants
`;

  // Relative path from the project root to this package's own scss/ files.
  // A bare "zeus-css/..." specifier only resolves via npm-aware tooling
  // (bundler resolution, or `sass --load-path=node_modules`) — computing a
  // real relative path instead also works for someone who just downloaded
  // this folder (no npm, no node_modules) and compiles with plain `sass`,
  // and is no worse for the normal npm case since __dirname already points
  // at wherever npm/pnpm/yarn actually resolved this package on disk.
  const packageRoot = path.join(__dirname, '..');
  const toPosix = (p) => p.split(path.sep).join('/');
  const zeusBridgeRelPath = toPosix(path.relative(projectRoot, path.join(packageRoot, 'scss', 'zeus.scss')));
  const zeusFoundationRelPath = toPosix(path.relative(projectRoot, path.join(packageRoot, 'scss', 'foundation', 'foundation.scss')));

  // 2. Generate the Bridge file — configured tokens/mixins/functions for
  // .module.scss files. Emits zero CSS on its own (see zeus-css/scss/zeus.scss).
  const bridgeContent = `// ╔══════════════════════════════════════════════════════════════╗
// ║  ⚡ Zeus CSS — Bridge Entry Point                            ║
// ║  Auto-generated by zeus-css init                             ║
// ╚══════════════════════════════════════════════════════════════╝
// This file injects your local configurations into the framework!
// Do not edit this file unless you add/remove configuration keys.
//
// No CSS is emitted here — use this in component .module.scss files for
// tokens/mixins/functions. For the actual compiled global stylesheet with
// your overrides baked in, compile zeus.theme.scss instead (see below).

@use "./zeus.config.scss" as localConfig;
@use "./zeus.customize.scss" as localCustomize;

@use "${zeusBridgeRelPath}" with (${configArgs});

// Expose the configured framework so you can import it elsewhere
@forward "${zeusBridgeRelPath}";
`;

  writeIfMissing(
    bridgeTargetPath,
    () => fs.writeFileSync(bridgeTargetPath, bridgeContent, 'utf8'),
    'zeus.scss (bridge)'
  );

  // 3. Generate the Theme file — same configuration, but through the
  // CSS-emitting foundation entry point. Compile this instead of linking
  // zeus-css/dist/zeus.css if you want your overrides to actually show up.
  const themeContent = `// ╔══════════════════════════════════════════════════════════════╗
// ║  ⚡ Zeus CSS — Theme Entry Point                             ║
// ║  Auto-generated by zeus-css init                             ║
// ╚══════════════════════════════════════════════════════════════╝
// Compile THIS file to get your global stylesheet with your local
// zeus.config.scss / zeus.customize.scss overrides baked in — the
// precompiled zeus-css/dist/zeus.css always ships with the framework
// defaults and never sees your local edits.
//
//   sass zeus.theme.scss zeus.theme.css
//
// Then link zeus.theme.css instead of zeus-css/dist/zeus.css.

@use "./zeus.config.scss" as localConfig;
@use "./zeus.customize.scss" as localCustomize;

@use "${zeusFoundationRelPath}" with (${configArgs});
`;

  writeIfMissing(
    themeTargetPath,
    () => fs.writeFileSync(themeTargetPath, themeContent, 'utf8'),
    'zeus.theme.scss'
  );

  // 4. TypeScript only: ambient module declarations so `import 'zeus-css/dist/zeus.css'`
  // (or the local .scss files above) type-check. Most framework scaffolds
  // (Next.js, Vite, Nuxt) already declare `*.css`/`*.scss` globally via their
  // own env.d.ts — this is a harmless no-op there, and a real fix in a bare
  // TS setup that has none. JS projects never need this, so nothing is written.
  if (isTypeScriptProject) {
    const typesContent = `// Auto-generated by \`zeus-css init\`.
// Lets TypeScript resolve CSS/SCSS side-effect imports from zeus-css
// (e.g. \`import 'zeus-css/dist/zeus.css'\`, \`import './zeus.theme.scss'\`).
// Most framework scaffolds (Next.js, Vite, Nuxt) already declare these
// globally, so this file is often a harmless no-op — safe to delete if so.
declare module '*.css';
declare module '*.scss';
`;

    writeIfMissing(
      typesTargetPath,
      () => fs.writeFileSync(typesTargetPath, typesContent, 'utf8'),
      'zeus-css-env.d.ts'
    );
  } else {
    console.log('ℹ️  No tsconfig.json found — skipping zeus-css-env.d.ts (JavaScript project, not needed).');
  }

  console.log('\n🚀 Zeus CSS is fully ejected and ready!');
  console.log('Next steps:');
  console.log('1. For component .module.scss files, use the bridge (no CSS emitted):');
  console.log('   @use "./zeus.scss" as *;');
  console.log('2. For your actual themed stylesheet, compile zeus.theme.scss and link its output instead of zeus-css/dist/zeus.css:');
  console.log('   sass zeus.theme.scss zeus.theme.css');
  console.log('3. Edit zeus.config.scss or zeus.customize.scss and recompile to update the framework globally.');
} catch (e) {
  console.error('❌ Failed to extract Zeus config files', e);
  process.exit(1);
}
