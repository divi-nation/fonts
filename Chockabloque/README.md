# Chockabloque

Block display capitals: solid slabs, 45° bites, V-notches, counters shrunk to
thin slits. Drawn in September 2026 for the Night site design.

A–Z (lowercase shows the capitals), 0–9, and `!@#$%^&*()_+;:'"<>,.?/-`.

Free to use on the web and anywhere else under the SIL Open Font License 1.1
(`OFL.txt`).

## Using it on a web page

Put `Chockabloque-Regular.woff2` and `chockabloque.css` beside the page, then:

    <link rel="stylesheet" href="chockabloque.css">
    <style> h1 { font-family: "Chockabloque", sans-serif; } </style>

It is ordinary text from then on — selectable, searchable, read by screen
readers. `chockabloque-preview.html` shows it working.

On a computer, install `Chockabloque-Regular.ttf` (double-click it on a Mac).

## What is here

| File | What it is |
| :--- | :--- |
| `Chockabloque-Regular.woff2` | the web font |
| `Chockabloque-Regular.ttf` | the same, for installing on a computer |
| `chockabloque.css` | the `@font-face` rule |
| `specimen.html` | every glyph as drawn, from `letters.js` |
| `letters.js` | the drawings: each glyph on a 12 × 12 grid |
| `chockabloque.json`, `svg/` | every glyph as one clean SVG path, for `viewBox="0 0 <width> 14"` |
| `export.js`, `build.py`, `glyphs.json` | the build |

## Rebuilding after a change to the letters

The letters are drawn in `letters.js`, on a 12 × 12 grid; the comment at its
top explains how.

    node export.js          # writes glyphs.json from letters.js
    python3 build.py        # writes the .ttf, .woff2 and clean SVGs (needs: pip install fonttools brotli skia-pathops)

Spacing is `SIDE` in `build.py`.
