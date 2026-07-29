---
version: 1.0
name: LG-KI-design-system
description: A warm, editorial "Claude"-style interface — ivory/anthracite canvas, one terracotta accent, serif display type over a system sans body, Liquid Glass app chrome. Pill CTAs, spring easing, and full-bleed alternating tiles on the landing page. No blue, no gradients-as-decoration beyond the single conic logo mark.

colors:
  accent: "#c96442"
  accent-press: "#b5573a"
  accent-soft: "rgba(201, 100, 66, 0.12)"
  accent-dark: "#d97757"
  accent-press-dark: "#e28964"
  accent-soft-dark: "rgba(217, 119, 87, 0.16)"
  ink: "#3d3929"
  ink-dark: "#f0eee6"
  ink-muted: "rgba(61, 57, 41, 0.64)"
  ink-muted-dark: "rgba(240, 238, 230, 0.62)"
  ink-faint: "rgba(61, 57, 41, 0.38)"
  ink-faint-dark: "rgba(240, 238, 230, 0.35)"
  canvas: "#faf9f5"
  canvas-dark: "#262624"
  card: "#ffffff"
  card-dark: "#30302e"
  parchment: "#f0eee6"
  parchment-dark: "#1f1e1d"
  hairline: "rgba(61, 57, 41, 0.12)"
  hairline-dark: "rgba(240, 238, 230, 0.10)"
  glass: "rgba(250, 249, 245, 0.72)"
  glass-dark: "rgba(48, 48, 46, 0.66)"
  glass-strong: "rgba(250, 249, 245, 0.86)"
  glass-strong-dark: "rgba(48, 48, 46, 0.86)"
  ok: "#1d9a4e"
  ok-dark: "#5cba7d"
  warn: "#b7791f"
  err: "#d0342c"
  err-dark: "#ff8a7a"

typography:
  hero:
    fontFamily: "Copernicus, Charter, Iowan Old Style, Georgia, Times New Roman, serif"
    fontSize: "clamp(40px, 7vw, 64px)"
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: -0.02em
  display:
    fontFamily: "{typography.hero.fontFamily}"
    fontSize: "clamp(28px, 4.5vw, 40px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.015em
  title:
    fontFamily: "{typography.hero.fontFamily}"
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.19
    letterSpacing: -0.01em
  lead:
    fontFamily: "{typography.hero.fontFamily}"
    fontSize: "clamp(19px, 2.4vw, 24px)"
    fontWeight: 400
    lineHeight: 1.4
    color: "{colors.ink-muted}"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, Segoe UI, Roboto, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: -0.01em
  caption:
    fontFamily: "{typography.body.fontFamily}"
    fontSize: 12.5px
    fontWeight: 400
    color: "{colors.ink-muted}"
    letterSpacing: -0.005em
  micro:
    fontFamily: "{typography.body.fontFamily}"
    fontSize: 11px
    fontWeight: 600
    letterSpacing: 0.06em
    textTransform: uppercase
    color: "{colors.ink-faint}"
  mono:
    fontFamily: "ui-monospace, SF Mono, Cascadia Code, Consolas, monospace"

rounded:
  field: 12px
  card: 18px
  modal: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  section: "clamp(64px, 10vw, 120px)"

motion:
  spring: "cubic-bezier(0.34, 1.4, 0.4, 1)"
  press-scale: 0.97
  principle: "Only transform/opacity animate — everything stays on the compositor, 60fps even on the Chromebooks the school hands out."

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "10px 22px"
    active: "transform: scale({motion.press-scale})"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
  button-quiet:
    backgroundColor: "{colors.parchment}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  icon-button:
    backgroundColor: transparent
    rounded: "{rounded.full}"
    size: 36px
  card:
    backgroundColor: "{colors.card}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.card}"
    shadow: "{elevation.card}"
  glass-chrome:
    backgroundColor: "{colors.glass}"
    backdropFilter: "blur(28px) saturate(180%)"
    border: "1px solid rgba(255,255,255,0.75) (dark: rgba(255,255,255,0.10))"
  field:
    backgroundColor: "{colors.parchment}"
    rounded: "{rounded.field}"
    padding: "11px 14px"
    focus: "border-color: {colors.accent}; background: {colors.canvas}"
  modal:
    backgroundColor: "{colors.glass-strong}"
    backdropFilter: "blur(32px) saturate(180%)"
    rounded: "{rounded.modal}"
    shadow: "{elevation.float}"
  tile:
    padding: "{spacing.section} 24px"
    variants: "default (canvas) · tile-dark (#1f1e1d, fixed regardless of theme) · tile-parchment"
  logo-mark:
    backgroundImage: "conic-gradient(from 210deg, #c96442, #d4a27f, #d97757, #c96442)"
    rounded: "28% of size"
    note: "The one deliberate gradient in the whole system — reserved for the LG KI mark itself."
---

## Overview

LG KI reads like a warm, editorial writing surface, not a SaaS dashboard — closer to
Anthropic's own product chrome than to Apple's photography-first marketing pages. One
accent (a terracotta/rust, not blue) carries every interactive signal. Headlines run in
a serif display face with tight negative tracking; body copy and UI chrome stay in the
system sans stack. The app shell (sidebar, composer, modals) uses a translucent "Liquid
Glass" material — blurred, saturated, spring-eased — while the public marketing pages
(`/`) use flat, full-bleed alternating tiles (canvas → dark → parchment) reminiscent of
a product page, but in the warm palette, never blue.

**Key characteristics:**
- Single accent — terracotta `{colors.accent}` (`#c96442` light / `#d97757` dark). No second brand color. Never blue.
- Dark is the *default* theme, not a fallback — the warm anthracite canvas (`#262624`) is the brand's face; light (`#faf9f5` ivory) is opt-in via the theme toggle.
- Serif display type (`Charter`/`Iowan Old Style`/Georgia stack) for every headline and title, negative letter-spacing at display sizes. Body and UI stay on the system sans stack — the serif/sans split is what makes this feel editorial rather than corporate.
- Pill is the only button grammar for primary/ghost/quiet actions (`{rounded.pill}`); `{rounded.card}` (18px) is reserved for cards and modals-within-cards.
- Liquid Glass app chrome: `backdrop-filter: blur(28px) saturate(180%)`, used on the composer, sidebar edges (mobile), modals, and floating pills — never on the flat marketing tiles.
- Spring easing (`cubic-bezier(0.34, 1.4, 0.4, 1)`) on every transform transition; buttons press to `scale(0.97)`. Only `transform`/`opacity` animate.
- The single deliberate gradient in the system is the LG-mark logo itself (`conic-gradient`) — everywhere else, color is flat.

## Colors

### Accent
- **Terracotta** (`{colors.accent}` — `#c96442` light, `#d97757` dark): every button, link, focus ring, active tab, selected chip. The dark-mode value is warmer/lighter, tuned to stay legible against the anthracite canvas rather than being a straight alpha-blend of the light value.
- **Accent Soft** (`{colors.accent-soft}`): 12–16% tint used as the background for selected chips, banners, and hover states — never a hard fill except on the primary button itself.

### Surface
- **Canvas** (`{colors.canvas}` — `#faf9f5` ivory / `#262624` anthracite): the default page/app background.
- **Card** (`{colors.card}` — `#ffffff` / `#30302e`): one step lighter (light mode) or lighter-but-still-dark (dark mode) than canvas — the surface every `.card` sits on.
- **Parchment** (`{colors.parchment}` — `#f0eee6` / `#1f1e1d`): the secondary tile/section background on the landing page, and the field-input fill inside forms.
- **Glass** (`{colors.glass}` / `{colors.glass-strong}`): translucent canvas-tinted fills for chrome that floats over content (composer, modals, mobile sidebar). Always paired with `backdrop-filter: blur(N) saturate(180%)`.

### Text
- **Ink** (`{colors.ink}` — `#3d3929` / `#f0eee6`): warm near-black / warm near-white, never pure `#000`/`#fff` for body text.
- **Ink Muted** / **Ink Faint**: two opacity steps (64%/38% light, 62%/35% dark) for secondary copy and disabled/placeholder text respectively — there is no separate muted hex, always an alpha of ink.

### Status
- **Ok** `#1d9a4e` / `#5cba7d`, **Warn** `#b7791f`, **Err** `#d0342c` / `#ff8a7a` — used sparingly: status dots in tool-bubbles, form errors, streak/gate banners. Never as a second brand accent.

## Typography

- **Display face**: `Copernicus, Charter, Iowan Old Style, Georgia, Times New Roman, serif` — every headline, title, and lead paragraph. This is the single biggest visual differentiator from a typical SaaS UI: headlines are set text, not a geometric sans.
- **Body/UI face**: system sans (`-apple-system, BlinkMacSystemFont, system-ui, Segoe UI, Roboto`) at 15px base — one size smaller than a typical Apple-style 17px body, tuned for a dense, utility-first app rather than a marketing page.
- **Weight ladder**: 400 (body) / 600 (headlines, strong) / 700 (rare, e.g. logo mark). No 300, no 500 — kept intentionally narrow.
- **Letter-spacing**: negative (`-0.01em` to `-0.02em`) at display and body sizes; `{typography.micro}` is the one place tracking goes *positive* (`+0.06em`, uppercase, for eyebrow labels like "AUS VADUZ, FÜRS LG VADUZ").
- **Never mix faces**: display sizes (`hero`/`display`/`title`/`lead`) are always serif; body/caption/micro are always sans. A serif caption or a sans headline is a bug, not a variant.

## Layout & Motion

- **Base rhythm**: 4/8/12/16/24/32px, plus a fluid `{spacing.section}` (`clamp(64px, 10vw, 120px)`) for landing-page tile padding.
- **Landing page**: full-bleed alternating tiles (`.tile` / `.tile-dark` / `.tile-parchment`) — the color change is the section divider, no borders between tiles. `.tile-dark` is a *fixed* dark surface (`#1f1e1d`) regardless of the light/dark theme toggle — it's a content band, not a themed surface.
- **App shell**: fixed-height flex layout (sidebar · main · Studio panel), `20px` outer padding, `18px` gutters. Sidebar and Studio panel collapse to full-screen glass overlays below `920px`.
- **Motion**: every interactive transform uses the spring easing; buttons scale to `0.97` on press (not `0.95` — slightly subtler than a typical iOS-style press). Modals/panels enter with `panel-in` (translateY + scale), messages with `msg-in` (translateY + fade). `prefers-reduced-motion` is respected everywhere non-essential (particle title, gooey loader, tour pulses fall back to static/slow).

## Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | none | Full-bleed landing tiles, cards at rest |
| Card | `{colors.card}`-tinted soft shadow (`0 1px 3px` + `0 8px 24px`, ink-tinted not pure black) | `.card` — chat bubbles, studio tool cards, pricing cards |
| Float | Larger ink-tinted shadow (`0 18px 60px` + `0 2px 12px`) | Modals, the composer pill, floating action surfaces |
| Glass | `backdrop-filter: blur(20–32px) saturate(180%)` | Composer, modals, mobile sidebar/Studio overlays, sub-nav |

Shadows are always tinted with `ink`'s RGB (warm brown-black in light mode, pure black
in dark mode) at low alpha — never a cool grey shadow. There is no single "hero product
shadow" convention here (unlike a photography-first site) — elevation is a UI-hierarchy
tool, used on every floating/glass surface, not reserved for one image type.

## Shapes

- **Pill** (`9999px`): every primary/ghost/quiet button, chips, the composer, search-style inputs, badges (tier pill, streak badge).
- **Card radius** (`18px`): `.card` — studio tool cards, pricing cards, message tool-bubbles.
- **Field radius** (`12px`): text inputs, textareas, selects.
- **Modal radius** (`24px`): the one place radius goes larger than cards — modals read as "lifted" above the card layer.
- Icon buttons and the logo mark are the only fully circular/near-circular shapes (`border-radius: 50%` / `28%` respectively).

## Components (selected)

- **`button-primary`**: solid accent fill, white text, pill radius, `scale(0.97)` press. The only button that should ever carry the accent as a *fill* rather than a text/border color.
- **`button-ghost`**: transparent, accent text — the default secondary action (e.g. "Passwort vergessen?", footer links).
- **`button-quiet`**: parchment fill, ink text — a "this does something but isn't the CTA" affordance (class-year pickers, filter chips).
- **`.card`**: white/`#30302e` fill, 1px hairline border, 18px radius, card shadow — the workhorse container for anything that isn't full-bleed.
- **`.glass` / `.glass-strong`**: translucent chrome for anything that floats over scrolling content.
- **Tool-bubble / plan-bubble / thinking-loader**: chat-specific glass components that make the agent's work visible (status dot, collapsible input/output, a gooey "thinking" loader whose color escalates warn→err the longer a response takes). These are the most distinctive UI patterns in the app — treat them as a design pillar, not a one-off.

## Do's and Don'ts

### Do
- Use `{colors.accent}` for every interactive element, and nothing else as a second brand color.
- Pair serif display type with negative tracking for every headline; keep body/UI on the sans stack.
- Reach for `{rounded.pill}` for any actionable control; reserve `{rounded.card}` for containers and `{rounded.modal}` for the modal shell itself.
- Use the spring easing + `scale(0.97)` press on every custom interactive element, to stay consistent with the built-in `.btn`/`.iconbtn` classes.
- Tint shadows with `ink`, not neutral grey — it's what keeps the dark theme from looking like generic "dark mode" rather than a designed anthracite surface.

### Don't
- Don't introduce blue, or any second accent color — this is a single-accent system by design.
- Don't set headlines in the sans stack, or body copy in the serif stack.
- Don't use `{rounded.pill}` on cards, or `{rounded.card}` on buttons — the two radii grammars don't mix.
- Don't animate anything but `transform`/`opacity` — layout-triggering transitions break the 60fps budget on the low-end Chromebooks this app targets (the mindmap's `motion` `layout` prop is the one deliberate exception, scoped to a single small canvas).
- Don't use `.tile-dark`'s fixed dark surface as a stand-in for the theme's dark canvas — they're independently controlled (content band vs. theme).

## Known Gaps

- No formal 2xl/3xl display scale exists beyond `{typography.hero}` — anything larger (e.g. a future marketing hero) should extend the `clamp()` pattern rather than hardcode a bigger px value.
- Error/validation states on form fields are ad hoc (inline red text below the field) rather than a token — see `login/page.tsx` and `onboarding/page.tsx` for the current convention if formalizing this.
- Pricing/onboarding option-grid cards and the Studio tool cards share a visual language but aren't a named shared component yet — worth extracting if a third instance appears.

---
*Supersedes the previous `Apple-design-analysis` draft that lived in this file — that
document described a generic Apple marketing-page reference, not this codebase's actual
(warm/serif/glass) system, and predates the current `globals.css`. If you're extending
this file, keep it in sync with `src/app/globals.css`, which remains the source of truth.*
