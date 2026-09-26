"""Step 2 of the build: makes the font files from glyphs.json.

    node export.js
    python3 build.py        (needs: pip install fonttools brotli skia-pathops)

Writes Chockabloque-Regular.ttf and Chockabloque-Regular.woff2, and rewrites
svg/ and chockabloque.json with the same clean outlines. Lowercase letters show
the capitals.
"""
import json
import os

from fontTools.fontBuilder import FontBuilder
from fontTools.misc.timeTools import timestampNow
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from pathops import Path, PathOp, op

HERE = os.path.dirname(os.path.abspath(__file__))
FAMILY = "Chockabloque"
VERSION = "1.000"
COPYRIGHT = "Copyright 2026 Divina Tion, with the Reserved Font Name \"Chockabloque\"."

UNIT = 60             # font units per grid unit: capitals are 12 units, 720 tall
SIDE = 0.75           # space either side of a glyph, in grid units
SPACE = 5             # width of the space, in grid units
UPM = 1000
ASCENT, DESCENT = 800, -200


def to_font(pts):
    # the drawings are y-down with the baseline at 12
    return [(round((x + SIDE) * UNIT), round((12 - y) * UNIT)) for x, y in pts]


def area(pts):
    return sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1])) / 2


def draw(pen, pts):
    pen.moveTo(pts[0])
    for p in pts[1:]:
        pen.lineTo(p)
    pen.closePath()


def solid(g):
    """The glyph's outlines with its cuts subtracted, as closed contours.

    A cut that runs to the edge shares that edge with the outline; left as two
    overlapping contours, the shared edge shows as a hairline when rendered.
    Subtracting leaves one clean outline instead.
    """
    fill, cut = Path(), Path()
    for poly in g["fills"]:
        draw(fill.getPen(), to_font(poly))
    for poly in g["cuts"]:
        draw(cut.getPen(), to_font(poly))
    rec = RecordingPen()
    op(fill, cut, PathOp.DIFFERENCE, fix_winding=True).draw(rec)
    contours, pts = [], []
    for verb, args in rec.value:
        if verb in ("moveTo", "lineTo"):
            pts.append(tuple(round(v) for v in args[0]))
        elif verb in ("closePath", "endPath"):
            contours.append(pts)
            pts = []
        else:
            raise ValueError(f"unexpected {verb} in {g['name']}")
    # TrueType wants outer contours clockwise; pathops winds them consistently,
    # so if the largest runs the other way, every contour is turned round
    if area(max(contours, key=lambda c: abs(area(c)))) > 0:
        contours = [c[::-1] for c in contours]
    return contours


def svg_path(contours):
    # back to the drawings' grid, y-down, for the SVGs
    fmt = lambda v: f"{round(v, 3):g}"
    return "".join("M" + "L".join(f"{fmt(x / UNIT - SIDE)} {fmt(12 - y / UNIT)}" for x, y in c) + "Z" for c in contours)


def main():
    with open(os.path.join(HERE, "glyphs.json")) as f:
        glyphs = json.load(f)

    order, cmap, advances, outlines = [".notdef", "space"], {0x20: "space"}, {}, {}
    advances[".notdef"] = advances["space"] = (SPACE * UNIT, 0)
    for name in (".notdef", "space"):
        outlines[name] = TTGlyphPen(None).glyph()

    paths = {}
    svg = os.path.join(HERE, "svg")
    os.makedirs(svg, exist_ok=True)
    for f in os.listdir(svg):
        os.remove(os.path.join(svg, f))
    for ch, g in glyphs.items():
        name = g["name"]
        contours = solid(g)
        pen = TTGlyphPen(None)
        for c in contours:
            draw(pen, c)
        outlines[name] = pen.glyph()
        paths[ch] = svg_path(contours)
        with open(os.path.join(HERE, "svg", name + ".svg"), "w") as f:
            f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {g["w"]:g} 14"><path d="{paths[ch]}"/></svg>\n')
        advances[name] = (round((g["w"] + 2 * SIDE) * UNIT), round(SIDE * UNIT))
        order.append(name)
        cmap[ord(ch)] = name
        if ch.isalpha():
            cmap[ord(ch.lower())] = name

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(outlines)
    fb.setupHorizontalMetrics(advances)
    fb.setupHorizontalHeader(ascent=ASCENT, descent=DESCENT)
    fb.setupNameTable({
        "copyright": COPYRIGHT,
        "familyName": FAMILY,
        "styleName": "Regular",
        "uniqueFontIdentifier": f"{FAMILY}-Regular;{VERSION}",
        "fullName": f"{FAMILY} Regular",
        "version": f"Version {VERSION}",
        "psName": f"{FAMILY}-Regular",
        "licenseDescription": "This Font Software is licensed under the SIL Open Font License, Version 1.1.",
        "licenseInfoURL": "https://openfontlicense.org",
    })
    fb.setupOS2(sTypoAscender=ASCENT, sTypoDescender=DESCENT, sTypoLineGap=0,
                usWinAscent=ASCENT, usWinDescent=-DESCENT,
                sCapHeight=12 * UNIT, sxHeight=12 * UNIT, fsType=0,
                achVendID="NONE")
    fb.setupPost()
    now = timestampNow()
    fb.setupHead(unitsPerEm=UPM, fontRevision=float(VERSION), created=now, modified=now)

    with open(os.path.join(HERE, "chockabloque.json"), "w") as f:
        json.dump(paths, f, indent=2)
        f.write("\n")

    ttf = os.path.join(HERE, f"{FAMILY}-Regular.ttf")
    fb.save(ttf)
    fb.font.flavor = "woff2"
    fb.save(os.path.join(HERE, f"{FAMILY}-Regular.woff2"))
    print(f"{len(glyphs)} glyphs, {len(cmap)} characters mapped")


if __name__ == "__main__":
    main()
