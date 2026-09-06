# Zeus CSS Cheatsheet

> Auto-generated from source — do not hand-edit. Regenerate with `npm run gen:cheatsheet`.

## Mixins & Functions

| Kind | Signature | Description | File |
|---|---|---|---|
| mixin | `fade-in($duration: 0.3s, $delay: 0s, $timing: ease-in-out)` | Usage: @include fade-in(0.5s, 0.2s); | `foundation/core/engine/animations.scss` |
| mixin | `slide-in($direction: bottom, $duration: 0.3s, $delay: 0s, $timing: ease-out)` | Usage: @include slide-in(left, 0.4s); | `foundation/core/engine/animations.scss` |
| mixin | `scale($scale: 1.05, $duration: 0.3s, $timing: ease-in-out)` | Usage: @include scale(1.1, 0.3s); | `foundation/core/engine/animations.scss` |
| mixin | `bounce($duration: 0.8s, $iteration: 1, $delay: 0s)` | Usage: @include bounce(0.6s, infinite); | `foundation/core/engine/animations.scss` |
| mixin | `pulse($duration: 1s, $iteration: infinite)` | Usage: @include pulse(1.5s, infinite); | `foundation/core/engine/animations.scss` |
| mixin | `rotate($degrees: 360deg, $duration: 1s, $timing: linear, $iteration: 1)` | Usage: @include rotate(360deg, 2s, linear, infinite); | `foundation/core/engine/animations.scss` |
| mixin | `button-base-reset()` |  | `foundation/core/engine/buttons.scss` |
| mixin | `button-structure()` |  | `foundation/core/engine/buttons.scss` |
| mixin | `button-apply-variant($variant: "primary")` | Uses direct map access instead of a getter function | `foundation/core/engine/buttons.scss` |
| mixin | `btn-primary()` |  | `foundation/core/engine/buttons.scss` |
| mixin | `btn-secondary()` |  | `foundation/core/engine/buttons.scss` |
| mixin | `btn-tertiary()` |  | `foundation/core/engine/buttons.scss` |
| mixin | `btn-icon-only()` |  | `foundation/core/engine/buttons.scss` |
| mixin | `btn-variant($variant: "primary")` |  | `foundation/core/engine/buttons.scss` |
| mixin | `btn-size($size: "md")` |  | `foundation/core/engine/buttons.scss` |
| function | `color($name, $alpha: 1)` | Retrieve any color from the design palette with optional alpha | `foundation/core/engine/color-api.scss` |
| function | `map-get-safe($map, $key)` | Extracts values from the provided map structure with type validation and unquoted key normalization | `foundation/core/engine/helpers.scss` |
| mixin | `border-radius($type)` | Applies dynamically-scaled responsive rounded corners based on predefined maps | `foundation/core/engine/layout.scss` |
| mixin | `border-line($type)` | Configures responsive border thickness and strokes across viewport ranges | `foundation/core/engine/layout.scss` |
| mixin | `box-size($type)` | Mixin for icon sizes through devices — always clamp() | `foundation/core/engine/layout.scss` |
| mixin | `padding($size, $direction: null)` | Mixin for padding with optional direction — references --space-* :root token | `foundation/core/engine/layout.scss` |
| mixin | `margin($size, $direction: null)` | Mixin for margin with optional direction — references --space-* :root token | `foundation/core/engine/layout.scss` |
| mixin | `gap($size, $direction: null)` | Mixin for gap with optional direction — references --space-* :root token | `foundation/core/engine/layout.scss` |
| mixin | `not-first-child()` |  | `foundation/core/engine/layout.scss` |
| mixin | `not-last-child()` |  | `foundation/core/engine/layout.scss` |
| mixin | `horizontal-scroll()` |  | `foundation/core/engine/layout.scss` |
| mixin | `no-horizontal-scroll()` |  | `foundation/core/engine/layout.scss` |
| function | `bp($key)` |  | `foundation/core/engine/responsive.scss` |
| mixin | `screen-above($breakpoint)` |  | `foundation/core/engine/responsive.scss` |
| mixin | `screen-below($breakpoint)` |  | `foundation/core/engine/responsive.scss` |
| mixin | `screen-between($lower, $upper)` |  | `foundation/core/engine/responsive.scss` |
| mixin | `suppress-on($scope)` | Scopes: 'handheld', 'mobile', 'tablet', 'desktop' (all singular). | `foundation/core/engine/responsive.scss` |
| mixin | `apply-shadow($size: "md")` | Usage: @include apply-shadow("md"); | `foundation/core/engine/shadows.scss` |
| mixin | `elevation($level: 1)` | Usage: @include elevation(2); // Applies shadow-md | `foundation/core/engine/shadows.scss` |
| mixin | `hover-shadow($default: "md", $hover: "lg")` | Usage: @include hover-shadow("sm", "lg"); | `foundation/core/engine/shadows.scss` |
| mixin | `focus-shadow($shadow: "outline")` | Usage: @include focus-shadow("outline"); | `foundation/core/engine/shadows.scss` |
| mixin | `interactive-shadow($default: "md", $hover: "lg", $focus: "outline")` | Usage: @include interactive-shadow("md", "lg", "outline"); | `foundation/core/engine/shadows.scss` |
| mixin | `card-shadow()` | Usage: @include card-shadow(); | `foundation/core/engine/shadows.scss` |
| mixin | `semantic-shadow($type: "primary")` | Usage: @include semantic-shadow("primary"); | `foundation/core/engine/shadows.scss` |
| mixin | `glow-effect($color: rgba(59, 130, 246, 0.5), $blur: 20px)` | Usage: @include glow-effect("primary", 0.5); | `foundation/core/engine/shadows.scss` |
| mixin | `inner-shadow($size: "inner")` | Usage: @include inner-shadow(); | `foundation/core/engine/shadows.scss` |
| mixin | `layered-shadow($shadow1, $shadow2)` | Usage: @include layered-shadow("md", "primary"); | `foundation/core/engine/shadows.scss` |
| mixin | `conditional-shadow($state: "hover", $shadow: "md")` | Usage: @include conditional-shadow("hover", "lg"); | `foundation/core/engine/shadows.scss` |
| mixin | `no-shadow()` | Usage: @include no-shadow(); | `foundation/core/engine/shadows.scss` |
| mixin | `p($size, $dir: null)` |  | `foundation/core/engine/shortcuts.scss` |
| mixin | `m($size, $dir: null)` |  | `foundation/core/engine/shortcuts.scss` |
| mixin | `g($size, $dir: null)` |  | `foundation/core/engine/shortcuts.scss` |
| mixin | `r($type)` |  | `foundation/core/engine/shortcuts.scss` |
| mixin | `t($type)` |  | `foundation/core/engine/shortcuts.scss` |
| mixin | `sz($type)` |  | `foundation/core/engine/shortcuts.scss` |
| function | `useclamp-sizing($min, $max, $c-floor: map.get($container-bounds, "floor"), $c-ceil: map.get($container-bounds, "ceil"), $precision: 1)` |  | `foundation/core/engine/sizing.scss` |
| mixin | `zeus-theme($name, $config)` |  | `foundation/core/engine/theme-builder.scss` |
| mixin | `text($type)` | The var is already generated by root-generator.scss. | `foundation/core/engine/typographics.scss` |
| function | `useclamp-typography($typeface, $precision: 1)` |  | `foundation/core/engine/typography-calc.scss` |

## Utility Class Families

| Class pattern | Generator mixin | File |
|---|---|---|
| `.flex` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.flex-row` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.flex-wrap` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.flex-column` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.flex-center` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.flex-space-between` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.d-none` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.d-block` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.d-inline-block` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.align-center` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.align-start` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.align-end` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.justify-center` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.justify-start` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.justify-end` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.justify-between` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.justify-around` | `load-flexbox()` | `foundation/views/render/classes/flexbox.scss` |
| `.d-grid` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.d-inline-grid` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.grid` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.col-span-{n}` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.col-span-full` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.col-start-{n}` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.col-end-{n}` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.grid-cards` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.grid-sidebar` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.grid-split` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.grid-thirds` | `load-grid()` | `foundation/views/render/classes/grid.scss` |
| `.animate-fade-in` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.animate-fade-in-slow` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.animate-fade-in-fast` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.animate-slide-up` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.animate-slide-down` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.animate-slide-left` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.animate-slide-right` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.animate-bounce` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.animate-pulse` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.animate-rotate` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.delay-100` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.delay-200` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.delay-300` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.delay-500` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.delay-700` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.delay-1000` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.duration-150` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.duration-300` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.duration-500` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.duration-700` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.duration-1000` | `load-animations()` | `foundation/views/render/classes/_animations.scss` |
| `.aspect-auto` | `load-aspect-ratio()` | `foundation/views/render/classes/_aspect-ratio.scss` |
| `.aspect-1-1` | `load-aspect-ratio()` | `foundation/views/render/classes/_aspect-ratio.scss` |
| `.aspect-4-3` | `load-aspect-ratio()` | `foundation/views/render/classes/_aspect-ratio.scss` |
| `.aspect-3-2` | `load-aspect-ratio()` | `foundation/views/render/classes/_aspect-ratio.scss` |
| `.aspect-16-9` | `load-aspect-ratio()` | `foundation/views/render/classes/_aspect-ratio.scss` |
| `.aspect-21-9` | `load-aspect-ratio()` | `foundation/views/render/classes/_aspect-ratio.scss` |
| `.aspect-3-4` | `load-aspect-ratio()` | `foundation/views/render/classes/_aspect-ratio.scss` |
| `.aspect-9-16` | `load-aspect-ratio()` | `foundation/views/render/classes/_aspect-ratio.scss` |
| `.border-radius-{n}` | `load-borders()` | `foundation/views/render/classes/_borders.scss` |
| `.border-line-{n}` | `load-borders()` | `foundation/views/render/classes/_borders.scss` |
| `.btn-{n}` | `load-buttons()` | `foundation/views/render/classes/_buttons.scss` |
| `.bg-{n}` | `load-colors()` | `foundation/views/render/classes/_colors.scss` |
| `.color-{n}` | `load-colors()` | `foundation/views/render/classes/_colors.scss` |
| `.border-color-{n}` | `load-colors()` | `foundation/views/render/classes/_colors.scss` |
| `.bg-transparent` | `load-colors()` | `foundation/views/render/classes/_colors.scss` |
| `.color-inherit` | `load-colors()` | `foundation/views/render/classes/_colors.scss` |
| `.color-current` | `load-colors()` | `foundation/views/render/classes/_colors.scss` |
| `.border-color-transparent` | `load-colors()` | `foundation/views/render/classes/_colors.scss` |
| `.border-color-currentColor` | `load-colors()` | `foundation/views/render/classes/_colors.scss` |
| `.surface` | `load-compounds()` | `foundation/views/render/classes/_compounds.scss` |
| `.surface-flat` | `load-compounds()` | `foundation/views/render/classes/_compounds.scss` |
| `.section-wrap` | `load-compounds()` | `foundation/views/render/classes/_compounds.scss` |
| `.section-wrap-narrow` | `load-compounds()` | `foundation/views/render/classes/_compounds.scss` |
| `.glass` | `load-compounds()` | `foundation/views/render/classes/_compounds.scss` |
| `.divider` | `load-compounds()` | `foundation/views/render/classes/_compounds.scss` |
| `.sr-only` | `load-compounds()` | `foundation/views/render/classes/_compounds.scss` |
| `.truncate` | `load-compounds()` | `foundation/views/render/classes/_compounds.scss` |
| `.line-clamp-2` | `load-compounds()` | `foundation/views/render/classes/_compounds.scss` |
| `.line-clamp-3` | `load-compounds()` | `foundation/views/render/classes/_compounds.scss` |
| `.container` | `load-containers()` | `foundation/views/render/classes/_containers.scss` |
| `.opacity-{n}` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.overflow-auto` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.overflow-hidden` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.overflow-scroll` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.overflow-visible` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.overflow-y-auto` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.overflow-y-hidden` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.overflow-y-scroll` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.object-cover` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.object-contain` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.object-fill` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.object-center` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.flex-grow-0` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.flex-grow-1` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.flex-shrink-0` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.flex-shrink-1` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.order-first` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.order-last` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.order-none` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.order-{n}` | `load-misc-utils()` | `foundation/views/render/classes/_misc-utils.scss` |
| `.static` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.relative` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.absolute` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.fixed` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.sticky` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.inset-auto` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.inset-{n}` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.top-{n}` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.bottom-{n}` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.inset-inline-start-{n}` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.inset-inline-end-{n}` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.top-auto` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.bottom-auto` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.inset-inline-start-auto` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.inset-inline-end-auto` | `load-position()` | `foundation/views/render/classes/_position.scss` |
| `.section-{n}` | `load-sections()` | `foundation/views/render/classes/_sections.scss` |
| `.section-full` | `load-sections()` | `foundation/views/render/classes/_sections.scss` |
| `.shadow-none` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-xs` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-sm` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-md` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-lg` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-xl` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-2xl` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-primary` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-secondary` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-success` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-warning` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-danger` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-info` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-inner` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-inner-lg` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-glow` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-glow-lg` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-outline` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-card` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-card-hover` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-dropdown` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-modal` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-transition` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-transition-fast` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.shadow-transition-slow` | `load-shadows()` | `foundation/views/render/classes/_shadows.scss` |
| `.box-{n}` | `load-sizes()` | `foundation/views/render/classes/_sizes.scss` |
| `.icon-{n}` | `load-sizes()` | `foundation/views/render/classes/_sizes.scss` |
| `.w-auto` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.w-full` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.w-screen` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.w-fit` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.w-min` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.w-max` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.w-1\` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.w-2\` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.w-3\` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.min-w-0` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.min-w-full` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.max-w-none` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.max-w-full` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.h-auto` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.h-full` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.h-screen` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.h-fit` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.h-min` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.h-max` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.min-h-0` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.min-h-full` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.min-h-screen` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.max-h-none` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.max-h-full` | `load-sizing-utils()` | `foundation/views/render/classes/_sizing-utils.scss` |
| `.gap-{n}` | `load-spacing()` | `foundation/views/render/classes/_spacing.scss` |
| `.text-{n}` | `load-typography()` | `foundation/views/render/classes/_typography.scss` |
| `.w-unset` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.h-unset` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.no-overflow-x` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.highlight` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.article` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.hidden-desktops` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.hidden-tablets` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.hidden-tablets-desktops` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.hidden-mobiles` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.hidden-devices` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.hidden-upto-ml` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.hidden-from-ml` | `load-utilities()` | `foundation/views/render/classes/_utilities.scss` |
| `.layer-{n}` | `load-z-index()` | `foundation/views/render/classes/_z-index.scss` |
