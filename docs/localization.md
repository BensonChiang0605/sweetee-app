# Landing page languages

The homepage matches the eight languages in the app's `locales/languages.js` registry as of November 5, 2026:

| Language | URL path | Copy |
| --- | --- | --- |
| English | `/` | `locales/en.json` |
| Taiwan Traditional Chinese | `/zh-Hant/` | `locales/zh-Hant.json` |
| Thai | `/th/` | `locales/th.json` |
| French | `/fr/` | `locales/fr.json` |
| Korean | `/ko/` | `locales/ko.json` |
| Spanish | `/es/` | `locales/es.json` |
| Japanese | `/ja/` | `locales/ja.json` |
| Brazilian Portuguese | `/pt/` | `locales/pt.json` |

Each new translation was written and self-reviewed by a separate Astra agent, with instructions to adapt the copy into warm everyday language and follow the app's established feature names. French addresses the couple with “vous”; Korean uses the friendly 해요 style; Spanish avoids regional “vosotros”; Portuguese follows the app's Brazilian locale. These are AI-reviewed translations, not a human translator sign-off.

## Editing and verification

Edit the shared markup in `templates/landing.html` and the 49 text values in each locale JSON. Keep the same keys in every file. `locales/languages.json` controls language names and URL paths.

```sh
npm run build:locales
npm run check:locales
npm run dev
```

The generator writes the root `index.html` and seven language directories. Commit the generated HTML with the source changes. Deployment remains a static upload; there is no runtime framework or server build requirement. The check rejects stale pages, missing translations, broken local asset/link targets and unsafe interpolation, and checks that every page links to the App Store listing.

Language selection uses ordinary links, so each URL works directly and keeps its language when reloaded. Every page has its own title, description, `lang`, canonical URL and reciprocal `hreflang` links. The picker works without JavaScript. Shared `landing.js` handles progressive reveal and keyboard dismissal.

## Images and legal pages

The six feature images use the existing localized App Store artwork from `/Users/bennysplace/Downloads/Sweetee App Screenshots Localized/<tag>/`. Their source numbering and crop settings match `docs/landing-screenshot-refresh.md`. Outputs are `assets/features/<tag>/*.webp`; the English images remain directly under `assets/features/`.

Each localized Home hero uses an actual simulator capture in that language at `assets/hero/<tag>.png`, with the approved Benson and Ya demo couple. English continues to use `sweetee-home-current.png`. Privacy and terms pages remain in English, with a translated notice beside their links. Shared notes are intentionally omitted from the gallery for now.

The Traditional Chinese H1 uses the app’s Maruko Gothic subset, bundled with its OFL license in `assets/fonts/`. Other non-Latin headings use the existing body-font token and platform glyph fallbacks instead of forcing the Latin display font. Their type scale and line height allow Chinese, Thai, Korean and Japanese text to wrap naturally; Korean additionally keeps words together.

## Verification on November 5, 2026

- All eight language tags and picker names match the app registry exactly.
- `npm run check:locales`: 11 passing checks, including all eight mocked waitlist flows.
- All 48 gallery assets exist at 828 × 1512 pixels.
- Browser checks found no horizontal overflow at 320px and 1440px for any locale; 390px mobile layouts were also reviewed.
- Language switching, Escape dismissal with focus restoration, and Japanese invalid-email feedback were exercised in the browser. No live signup was submitted.
- Saved screenshots are in the app workspace's `release-evidence/landing-refresh/localization/` directory. Changes have not been deployed.
