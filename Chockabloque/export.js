// Step 1 of the build: writes every glyph in letters.js out as polygons
// (glyphs.json) for build.py.
//   node export.js [folder]
// Given a folder, first copies letters.js and specimen.html in from it (where
// the letters are being drawn); without one, uses the letters.js here.
const fs = require("fs");
const path = require("path");

const here = __dirname;
const working = process.argv[2];
if (working) {
  fs.copyFileSync(path.join(working, "letters.js"), path.join(here, "letters.js"));
  fs.copyFileSync(path.join(working, "specimen.html"), path.join(here, "specimen.html"));
}

const root = {};
new Function(fs.readFileSync(path.join(here, "letters.js"), "utf8")).call(root);

// A file-safe name for each glyph; letters and figures are their own names.
const NAMES = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
  "!": "exclam", "@": "at", "#": "numbersign", "$": "dollar", "%": "percent", "^": "asciicircum", "&": "ampersand",
  "*": "asterisk", "(": "parenleft", ")": "parenright", "_": "underscore", "+": "plus", ";": "semicolon", ":": "colon",
  "'": "quotesingle", '"': "quotedbl", "<": "less", ">": "greater", ",": "comma", ".": "period", "?": "question",
  "/": "slash", "-": "hyphen"
};
const round = (n) => +(+n).toFixed(3);
const chars = [].concat(root.CHOCKABLOQUE_LETTERS, root.CHOCKABLOQUE_FIGURES, root.CHOCKABLOQUE_SIGNS);

// build.py writes svg/ and chockabloque.json, with the cuts subtracted
const glyphs = {};
for (const c of chars) {
  const g = root.glyphContours(c);
  const fix = (poly) => poly.map((p) => [round(p[0]), round(p[1])]);
  glyphs[c] = { name: NAMES[c] || c, w: g.w, fills: g.fills.map(fix), cuts: g.cuts.map(fix) };
}
fs.writeFileSync(path.join(here, "glyphs.json"), JSON.stringify(glyphs) + "\n");
console.log(chars.length + " glyphs");
