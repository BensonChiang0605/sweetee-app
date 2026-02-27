---
name: sweetee-design-system
description: >
  The official design system for Sweetee, a couple app built on warmth, intimacy,
  and quiet romance. Use this skill whenever designing, building, or reviewing any
  UI for the Sweetee app — including screens, components, cards, modals, color
  choices, font decisions, or HTML/CSS/React artifacts. Trigger this skill any time
  the user mentions Sweetee, asks about colors, typography, card colors, fonts, or
  surfaces in the context of the app, or requests anything visual that will be part
  of Sweetee's interface. Always consult this skill before choosing a color or font
  — never invent values from scratch.
  When building UI for Sweetee, this skill overrides the frontend-design skill
  for all typography and color decisions. For everything the design system does
  not specify — layout patterns, animation, spatial composition, and code quality
  — defer to the frontend-design skill.
---

# Sweetee Design System

> A couple app built on warmth, intimacy, and quiet romance.

This skill defines all visual decisions for Sweetee. When building UI, always reference
this file first. Never use colors, fonts, or surface values outside this system.

---

## Typography

### Font Stack

| Role | Typeface | Style | Use |
|------|----------|-------|-----|
| **Logo** | Sacramento | Regular 400 | Wordmark only — never use for UI copy |
| **Headline** | Cormorant Garamond | Light 300 / Italic | Screen titles, section headers, display moments |
| **Body Copy** | DM Sans | Light 300 · Regular 400 · Medium 500 | All UI text, messages, labels, buttons |

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Sacramento&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap
```

### Type Scale

| Level | Typeface | Size | Weight | Usage |
|-------|----------|------|--------|-------|
| Logo | Sacramento | 48px | 400 | App wordmark |
| Display | Cormorant Garamond | 36px | 300 Italic | Hero moments, onboarding |
| H1 | Cormorant Garamond | 28px | 300 | Screen titles |
| H2 | Cormorant Garamond | 22px | 400 | Section headers |
| Body | DM Sans | 15px | 400 | Messages, paragraphs |
| UI / Label | DM Sans | 12px | 500 | Buttons, tabs, tags |
| Caption | DM Sans | 11px | 300 | Timestamps, metadata |

### Typography Rules

- **Sacramento is sacred** — logo font only, never for UI copy, decorative text, or headings
- **Cormorant leads moments** — use at headline scale only; avoid below 16px where thin strokes lose legibility
- **DM Sans owns UI** — all interactive, functional, and body text

---

## Color Palette — Soft Romantic

### Primary / Brand Color

| Name | Hex | HSB | RGB | Role |
|------|-----|-----|-----|------|
| **Deep Rose** | `#C0392B` | 5° · 78S · 75B | 192, 57, 43 | Primary CTA — buttons, links, highlights |

Text on Deep Rose: **White `#FFFFFF`** (passes WCAG AA).

### Supporting / Semantic Colors

All harmonized within ±10 units of primary HSB (78S · 75B).

| Name | Hex | HSB | ΔS / ΔB | Role |
|------|-----|-----|---------|------|
| **Sage Mint** | `#4CAF82` | 150° · 56S · 69B | −22S / −6B | Success |
| **Terracotta** | `#C05A3A` | 15° · 70S · 75B | −8S / 0B | Error |
| **Warm Amber** | `#C8A040` | 38° · 68S · 78B | −10S / +3B | Warning |
| **Powder Blue** | `#3A7AC0` | 210° · 70S · 75B | −8S / 0B | Info |

### Shade Scales

#### Deep Rose — Primary · Base at 500

| Step | Hex | Usage |
|------|-----|-------|
| 100 | `#FDF0EF` | Tinted backgrounds, hover fills |
| 200 | `#F8D0CD` | Light tints |
| 300 | `#EFA49E` | Subtle accents |
| 400 | `#E07470` | Secondary states |
| **500** | **`#C0392B`** | **Primary CTA — base** |
| 600 | `#A02C22` | Pressed / active states |
| 700 | `#80211A` | Dark variant |
| 800 | `#601612` | Deep accents |
| 900 | `#3D0C0A` | Near-black rose |

#### Blush Pink — Neutral Warm · Base at 300

| Step | Hex | Usage |
|------|-----|-------|
| 100 | `#FFF8F8` | Subtle tint |
| 200 | `#FDE8E8` | Light fill |
| **300** | **`#F2BFBF`** | **Received message bubbles, soft fills — base** |
| 400 | `#E49898` | Mid accent |
| 500 | `#D47070` | Stronger accent |
| 600 | `#B84C4C` | Dark accent |
| 700 | `#943030` | Deep tint |
| 800 | `#6C1C1C` | Very dark |
| 900 | `#420C0C` | Near black |

#### Petal Neutral — Background & Text · Base at 50

| Step | Hex | Usage |
|------|-----|-------|
| **50** | **`#FAF8F6`** | **Default app background — base** |
| 100 | `#F5F5F5` | Card surfaces, skeleton screens |
| 200 | `#E8E8E8` | Borders, dividers, disabled states |
| 300 | `#D4D4D4` | Placeholder text |
| 400 | `#B8B8B8` | Secondary icons |
| 500 | `#9C9C9C` | Muted text |
| 600 | `#7A7A7A` | Body text (light mode) |
| 700 | `#585858` | Secondary text |
| 800 | `#363636` | Primary text |
| 900 | `#1A1A1A` | Headings / Charcoal |

#### Warm Cream — Surface · Base at 200

| Step | Hex | Usage |
|------|-----|-------|
| 100 | `#FAF7F2` | Lightest cream |
| **200** | **`#F0E6D0`** | **Elevated surfaces — cards, modals, inputs — base** |
| 300 | `#E2D0B0` | Mid cream |
| 400 | `#CEBA90` | Accent cream / neutral topic card |
| 500 | `#B89E70` | Warm mid |
| 600 | `#987E50` | Dark cream |
| 700 | `#7A6238` | Deep warm |
| 800 | `#584824` | Very dark |
| 900 | `#342C14` | Near black warm |

---

## Surface Layering

Always follow this elevation model. Never use `#FFFFFF` pure white as a background.

| Layer | Token | Hex | Example |
|-------|-------|-----|---------|
| Base background | `neutral-50` | `#FAF8F6` | App canvas, all screen backgrounds |
| Cards / surfaces | `neutral-100` | `#F5F5F5` | Chat cards, profile cards |
| Elevated surfaces | `cream-200` | `#F0E6D0` | Modals, bottom sheets, input fields |
| Message bubbles | — | `#FFFFFF` | Only context where pure white is used |
| Primary action | `rose-500` | `#C0392B` | Buttons, FAB, active tab indicator |

---

## Topic Cards

Bold colored cards for browsing question packs and topics. Each card uses a solid
mid-range color (shade 400–600) with white text and an emoji/icon overlay.

**Rule:** Every card color must feel like it could exist in candlelight. Avoid pure teal,
electric purple, or any cool-leaning saturated color.

### Card Color Palette

| Card Name | Hex | Source | Best Used For |
|-----------|-----|--------|---------------|
| **Dusty Rose** | `#D47070` | Blush Pink 500 | Love, intimacy, romantic topics |
| **Deep Rose** | `#C0392B` | Rose 500 — Primary | Featured packs, CTA cards |
| **Warm Terracotta** | `#C05A3A` | Supporting — Error | Playful, fun, spicy topics |
| **Amber Glow** | `#C8A040` | Supporting — Warning | Anniversaries, memories, gratitude |
| **Dusty Mauve** | `#A06070` | Harmonized (345° · 30S · 63B) | Deep conversations, moody topics |
| **Sage Blush** | `#7A9E8A` | Harmonized (152° · 23S · 62B) | Wellness, calm, gratitude topics |
| **Warm Cream** | `#CEBA90` | Cream 400 | Lighter topics, neutral anchor card |

### Card Typography

- Category label: DM Sans 400 · 12px · White `#FFFFFF`
- Card title: Cormorant Garamond 300 Italic · 24–28px · White `#FFFFFF`

### Card Pairing Guide

Never place Deep Rose and Warm Terracotta side by side — both are warm-red and clash.
Always alternate with a neutral (Warm Cream, Sage Blush) between them.

| Sequence | Card A | Card B | Card C |
|----------|--------|--------|--------|
| Row 1 | Dusty Rose | Warm Terracotta | Sage Blush |
| Row 2 | Deep Rose | Amber Glow | Dusty Mauve |
| Row 3 | Warm Cream | Dusty Mauve | Warm Terracotta |

---

## Design Principles

1. **Warmth first** — Every color decision leans warm. Cool neutrals are never used.
2. **Deep Rose owns attention** — Appears sparingly as the primary CTA. Overusing it weakens hierarchy.
3. **Cream over white** — `#FFFFFF` only inside message bubbles. All other surfaces use Petal Neutral or Warm Cream.
4. **Sacramento is sacred** — Never used outside the wordmark.
5. **Cormorant leads moments** — Emotional, display-scale text only. Never below 16px.
