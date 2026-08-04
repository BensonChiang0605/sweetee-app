## Project Overview

Sweetee is a couples app landing page — a static website with a waitlist form, feature showcase, and founder's note. The site collects emails via [Loops.so](https://loops.so) for the waitlist.

## Development

```bash
npm run dev   # Serves the site locally via `npx serve .`
```

No build step. No bundler. No framework. Just HTML, CSS, and vanilla JS.

## File Structure

- [index.html](index.html) — Main landing page (hero, features grid, founder's note, footer)
- [privacy.html](privacy.html) — Privacy policy page
- [styles.css](styles.css) — All styles, including design tokens as CSS custom properties
- `.agent/sweetee-design-system/SKILL.md` — Full design system reference (colors, typography, surfaces)
- `.agent/feature-review-analysis/SKILL.md` — Process for analyzing App Store review data

## Design System

All colors and fonts are defined as CSS custom properties in [styles.css](styles.css). **Never hard-code hex values or font names.** Always use the tokens.

### Typography

| Role | CSS variable | Font |
|------|-------------|------|
| Logo wordmark | `--font-logo` | Sacramento (wordmark only — never for UI copy) |
| Headlines / display | `--font-headline` | Cormorant Garamond |
| All UI / body text | `--font-body` | DM Sans |

### Key Color Tokens

| Token | Hex | Role |
|-------|-----|------|
| `--rose-500` | `#C0392B` | Primary CTA — buttons, links, highlights |
| `--neutral-50` | `#FAF8F6` | Default page background |
| `--neutral-100` | `#F5F5F5` | Card surfaces |
| `--cream-200` | `#F0E6D0` | Elevated surfaces (modals, inputs) |

**Never use `#FFFFFF` as a background** — only inside message bubbles. All surfaces use Petal Neutral or Warm Cream.

### Spacing & Radius

Spacing scale: `--space-xs` (4px) through `--space-3xl` (96px).  
Radius scale: `--radius-sm` (8px) through `--radius-xl` (28px).

## Waitlist Integration

Emails submit to Loops.so via a `POST` to `https://app.loops.so/api/newsletter-form/cmlxvlrt302oh0iwl16vbao0e` with `application/x-www-form-urlencoded` body. The form ID is live — handle carefully.

## Skills

Two agent skills live in `.agent/`:

- **sweetee-design-system** — Invoke before any color/font/surface decision on Sweetee UI. Overrides `frontend-design` skill for typography and color.
- **feature-review-analysis** — Use when analyzing App Store CSV exports for user feedback themes.
