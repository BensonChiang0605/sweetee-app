# Landing page screenshot refresh

Updated November 5, 2026.

## Hero

The hero uses a fresh iPhone 17 Pro capture of Home from app revision `bdbb2ede`, with the approved Benson and Ya demo names and Happy/Loved moods. A CSS phone frame surrounds the unedited simulator capture. The original `sweetee-homescreen.png` remains available.

Localized hero captures now live in `assets/hero/<tag>.png` for Traditional Chinese, Thai, French, Korean, Spanish, Japanese and Portuguese. These are real 1206 × 2622 simulator captures with localized moods and daily activities, keeping Benson and Ya. Each language page selects its matching capture; the English page retains its existing image.

## Gallery artwork reused from the App Store set

Source folder: `/Users/bennysplace/Downloads/Sweetee App Screenshots (1242 x 2688 px) (4)`, exported November 2, 2026. The English source artwork already contains the intended demo photos and phone compositions. The originals were not modified.

| Landing card | Source | Website asset | What it shows |
| --- | --- | --- | --- |
| Get to know each other | `5.png` | `assets/features/quiz-results.webp` | A completed quiz, answer similarity and both partners' answers. |
| Mood check-ins | `8.png` | `assets/features/mood-check-ins.webp` | Mood characters, the mood picker and Ya's Loved widget. |
| Play together | `4.png` | `assets/features/play-together.webp` | Sweet Spot's result and both partners' dinosaur drawings. |
| Your favorite memories | `6.png` | `assets/features/shared-memories.webp` | The populated Our Memories library with trip photos and dates. |
| Doodles & little surprises | `7.png` | `assets/features/doodles.webp` | A photo-cutout doodle and photo widget on an iPhone Home Screen. |
| Close, even at a glance | `3.png` | `assets/features/widgets.webp` | Home and Lock Screen widgets for moods, photos, doodles and relationship dates. |

All six images use the same crop: x=0, y=420, width=1242, height=2268. This removes the App Store marketing headline while preserving the artwork beneath it. The crop is resized to 828 × 1512 and encoded as WebP at quality 88. The combined six-image download is about 453 KiB, with lazy loading and explicit dimensions to avoid layout jumps.

Reproduce each export with the corresponding source and output paths:

```sh
cwebp -quiet -q 88 -m 6 -crop 0 420 1242 2268 -resize 828 1512 source.png -o output.webp
```

The gallery uses three columns on desktop, two on tablet and one on mobile. The section subtitle is "Questions to answer, games to play, and little moments to keep."

## Other screenshot options

Shared notes are intentionally omitted for now, per the user's direction. The doodle composition fills that gallery slot.

The memories artwork shows the library, not a finished scrapbook canvas. A future scrapbook-specific card should show the finished page with approved photos, cutouts and a short date caption.

The first App Store image contains the older Home design, so it was not used to replace the new hero. The quiz catalogue image was also omitted because the completed-results image communicates the experience more clearly.

These are reused App Store marketing compositions, not new simulator captures or fresh WidgetKit verification. No UI text or app controls were synthesized during processing. The gallery changes are local and have not been deployed.
