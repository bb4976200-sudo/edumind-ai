# Design Brief

## Direction

EduMind Study OS — a scholarly operating system for learning: calm, dense, and quietly premium rather than a chat window.

## Tone

Refined academic minimalism with editorial confidence — generous whitespace, hairline structure, and one deep indigo signature; decoration is earned, never ambient.

## Differentiation

Every surface reads like a well-set textbook page: scholarly indigo + teal paired with Space Grotesk headings, hairline rules, and a left "spine" rail that makes the app feel bound, not browsed.

## Color Palette

| Token      | OKLCH         | Role                                       |
| ---------- | ------------- | ------------------------------------------ |
| background | 0.985 0.004 265 | Light page paper (dark: 0.155 0.018 272) |
| foreground | 0.2 0.028 268   | Primary ink text (dark: 0.945 0.008 268) |
| card       | 1 0 0           | Raised study surfaces (dark: 0.205 0.022 272) |
| primary    | 0.45 0.19 272   | Deep scholarly indigo — brand + CTAs (dark: 0.66 0.18 274) |
| accent     | 0.52 0.1 185    | Scholarly teal — secondary emphasis (dark: 0.72 0.12 185) |
| muted      | 0.958 0.01 268  | Recessed wells, chips (dark: 0.25 0.026 272) |
| success    | 0.52 0.12 160   | Correct quiz answers, ready status (dark: 0.72 0.14 162) |
| warning    | 0.62 0.13 75    | Processing / partial status (dark: 0.79 0.14 78) |
| destructive| 0.55 0.21 25    | Wrong answers, delete (dark: 0.63 0.2 22) |

## Typography

- Display: Space Grotesk — headings, metrics, brand wordmark; tight tracking, weights 500–700.
- Body: General Sans — UI labels, paragraphs, nav; weights 400–600.
- Mono: JetBrains Mono — formulas, code snippets, token counts.
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, h2 `text-2xl md:text-3xl font-semibold tracking-tight`, label `text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground`, body `text-sm md:text-base leading-relaxed`.

## Elevation & Depth

Three tiers only: flat page, `bg-card` with 1px `border-border`, and glass (`surface-glass`) for overlays; depth comes from diffused `shadow-subtle` → `shadow-elevated`, never glow.

## Structural Zones

| Zone    | Background              | Border      | Notes                                              |
| ------- | ----------------------- | ----------- | -------------------------------------------------- |
| Header  | `bg-card/80` + backdrop | `border-b`  | Sticky, 64px, search + theme toggle + avatar       |
| Sidebar | `bg-sidebar`            | `border-r`  | 264px desktop, sheet on mobile, active = indigo pill |
| Content | `bg-background`         | —           | Alternating sections use `bg-muted/40`             |
| Footer  | `bg-muted/40`           | `border-t`  | Quiet, small type, links only                      |

## Spacing & Rhythm

Page gutter `px-4 sm:px-6 lg:px-8`, max width 1400px; section gaps `py-10 md:py-14`; card padding `p-5 md:p-6`; grid gaps `gap-4 md:gap-6`; micro-spacing in 4px steps.

## Component Patterns

- Buttons: `rounded-xl` (radius 14px); primary = solid indigo or `gradient-primary`; secondary = `bg-secondary`; ghost = transparent with `hover:bg-muted`; 150ms color, 200ms transform.
- Cards: `rounded-2xl border border-border bg-card shadow-subtle`, hover → `shadow-elevated` + `-translate-y-0.5`; glass variant for overlays and hero.
- Badges: pill `rounded-full`, tinted semantic background at 12% with full-strength text; status dot 6px.
- Inputs: `rounded-xl bg-background border-input`, focus = `ring-2 ring-ring ring-offset-2`.

## Motion

- Entrance: `animate-fade-up` staggered 60ms per grid item, 400ms spring ease-out.
- Hover: 150ms color/shadow, 200ms 2px lift; active states press to `scale-[0.98]`.
- Decorative: `animate-float-slow` on ambient orbs, `animate-pulse-soft` on processing indicators; respect `prefers-reduced-motion`.

## Constraints

- Token-only styling: no hex, `rgb()`, or arbitrary `bg-[#...]` in components.
- 3–5 core colors; indigo is the only saturated brand color — teal stays secondary.
- No full-page gradients, no neon glow, no chat-bubble UI patterns.
- Both themes fully designed; `darkMode: class` with a persisted toggle.
- Mobile-first responsive: sidebar collapses to a sheet below `lg`.

## Signature Detail

The "spine" — a 3px vertical indigo-to-teal gradient rule that runs down the sidebar's active item and reappears as a left edge accent on the focused study card, making the workspace feel like a bound volume.
