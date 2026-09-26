/* Chockabloque — the Night design's block capitals, drawn for it, after the manner of blocky
   display faces: solid slabs, 45° chamfers, V-notches, counters shrunk to thin
   slits. Each letter sits on a 12 × 12 grid (x right, y down). `o` is the
   outline; `s` are slits cut out of it, as [x1, y1, x2, y2] rectangles — a
   slit that reaches the edge opens the letter there. A slit may instead be a
   list of points, for a cut at an angle. Slits must not overlap each other
   or run outside the outline: the letter is filled even-odd, so an overlap
   fills back in. A slit that continues a notch (U, V, Y) is therefore drawn
   as part of the outline, not as a slit.

   letterPath("E") returns an SVG path for viewBox="0 0 12 12"; glyphWidth(ch)
   gives the width to use in place of the first 12. */
(function (root) {
  var W = 0.5, lo = 6 - W / 2, hi = 6 + W / 2;   // every slit and inner cut-out is W wide
  var G = {
    A: { o: [[3,0],[9,0],[12,12],[7.2,12],[6,10.2],[4.8,12],[0,12]], s: [[lo,3.5,hi,7.5]] },
    B: { o: [[0,0],[10,0],[12,2],[12,4.5],[10.6,6],[12,7.5],[12,10],[10,12],[0,12]], s: [[lo,2.5,hi,4.5],[lo,7.5,hi,9.5]] },
    C: { o: [[2,0],[12,0],[12,7.5],[lo,7.5],[lo,7.5 + W],[12,7.5 + W],[12,12],[2,12],[0,10],[0,2]], s: [] },
    D: { o: [[0,0],[10,0],[12,2],[12,10],[10,12],[0,12]], s: [[lo,3,hi,9]] },
    E: { o: [[0,0],[12,0],[12,12],[0,12]], s: [[lo,4,12,4.5],[lo,7.5,12,8]] },
    F: { o: [[0,0],[12,0],[12,7.5],[lo,7.5],[lo,12],[0,12]], s: [[lo,4,12,4.5]] },
    G: { o: [[2,0],[12,0],[12,10],[10,12],[2,12],[0,10],[0,2]], s: [[lo,4,12,4 + W],[lo,4 + W,hi,7.75 - W],[lo,7.75 - W,8.6,7.75]] },
    H: { o: [[0,0],[12,0],[12,12],[0,12]], s: [[lo,0,hi,4.5],[lo,7.5,hi,12]] },
    I: { o: [[0,0],[12,0],[12,4],[10.5,4],[10.5,8],[12,8],[12,12],[0,12],[0,8],[1.5,8],[1.5,4],[0,4]], s: [] },
    J: { o: [[5 + W / 2,0],[12,0],[12,10],[10,12],[2,12],[0,10],[0,6.2],[5 - W / 2,6.2],[5 - W / 2,8.8],[5 + W / 2,8.8]], s: [] },
    K: { o: [[0,0],[lo,0],[lo,3.4],[lo + 2.8,0],[12,0],[12,3],[10.2,6],[12,9],[12,12],[lo + 2.8,12],[lo,8.6],[lo,12],[0,12]], s: [] },
    L: { o: [[0,0],[lo,0],[lo,7.5],[12,7.5],[12,12],[0,12]], s: [] },
    M: { o: [[0,0],[4.8,0],[6,1.8],[7.2,0],[12,0],[12,12],[0,12]], s: [[3.75,6,4.25,12],[7.75,6,8.25,12]] },
    N: { o: [[0,0],[lo,0],[lo + 2.8,3.4],[lo + 2.8,0],[12,0],[12,12],[lo + 2.8,12],[lo,8.6],[lo,12],[0,12]], s: [] },
    O: { o: [[2,0],[10,0],[12,2],[12,10],[10,12],[2,12],[0,10],[0,2]], s: [[lo,3,hi,9]] },
    P: { o: [[0,0],[10,0],[12,2],[12,5.5],[10,7.5],[lo,7.5],[lo,12],[0,12]], s: [[lo,2.5,hi,5]] },
    Q: { o: [[2,0],[10,0],[12,2],[12,12],[8.5,12],[7.5,10.5],[2,10.5],[0,8.5],[0,2]], s: [[lo,2.75,hi,7.75]] },
    R: { o: [[0,0],[10,0],[12,2],[12,5.5],[10.5,7],[12,8.5],[12,12],[lo + 2.8,12],[lo,8.6],[lo,12],[0,12]], s: [[lo,2.5,hi,5]] },
    S: { o: [[2,0],[12,0],[12,4],[8.6,4],[12,6.8],[12,10],[10,12],[0,12],[0,8],[3.4,8],[0,5.2],[0,2]], s: [] },
    T: { o: [[0,0],[12,0],[12,4],[10.5,4],[10.5,12],[1.5,12],[1.5,4],[0,4]], s: [] },
    U: { o: [[0,0],[4.5,0],[lo,1.25],[lo,8.5],[hi,8.5],[hi,1.25],[7.5,0],[12,0],[12,10],[10,12],[2,12],[0,10]], s: [] },
    V: { o: [[0,0],[4.5,0],[lo,5 / 3],[lo,7],[hi,7],[hi,5 / 3],[7.5,0],[12,0],[12,6],[8,12],[4,12],[0,6]], s: [] },
    W: { o: [[0,0],[12,0],[12,12],[7.2,12],[6,10.2],[4.8,12],[0,12]], s: [[3.75,0,4.25,6],[7.75,0,8.25,6]] },
    X: { o: [[0,0],[4.8,0],[6,1.8],[7.2,0],[12,0],[12,3],[10.2,6],[12,9],[12,12],[7.2,12],[6,10.2],[4.8,12],[0,12],[0,9],[1.8,6],[0,3]], s: [] },
    Y: { o: [[0,0],[4.8,0],[lo,1.425],[lo,6.5],[hi,6.5],[hi,1.425],[7.2,0],[12,0],[12,5],[9.4,7.6],[9.4,12],[2.6,12],[2.6,7.6],[0,5]], s: [] },
    Z: { o: [[0,0],[12,0],[12,12],[0,12]], s: [[[0,4],[3.4,4],[0,6.8]], [[12,8],[8.6,8],[12,5.2]]] }
  };
  var LETTERS = Object.keys(G);

  /* Figures and punctuation. Same rules, and two more: `x` holds any further
     separate outlines (the dot of a ! or a ?), and `w` is the glyph's width
     where it is narrower than 12. A comma's or semicolon's tail may drop to
     y = 14, below the letters. */
  function rect(x1, y1, x2, y2) { return [[x1,y1],[x2,y1],[x2,y2],[x1,y2]]; }
  function flipX(pts, w) { return pts.map(function (p) { return [w - p[0], p[1]]; }).reverse(); }
  function scale(pts, k) { return pts.map(function (p) { return [+(p[0] * k).toFixed(3), +(p[1] * k).toFixed(3)]; }); }
  var DOT = 3.4, D = 4.6;                         // a dot is D wide and DOT tall, and sits on the baseline
  var dot = rect(0, 12 - DOT, D, 12);
  var comma = [[0,8.6],[D,8.6],[D,12],[2.6,14],[0.6,14],[2.6,12],[0,12]];
  var tick = [[0,0],[D,0],[3.8,4.5],[0.8,4.5]];   // one stroke of a quotation mark, tapering like the !
  var paren = [[2,0],[5,0],[5,1.5],[3.5,3],[3.5,9],[5,10.5],[5,12],[2,12],[0,10],[0,2]];
  var angle = [[0,6],[10,1],[10,4.5],[7,6],[10,7.5],[10,11]];
  var star = [[2,0],[4.8,0],[6,1.8],[7.2,0],[10,0],[12,2],[12,4.8],[10.2,6],[12,7.2],[12,10],[10,12],[7.2,12],[6,10.2],[4.8,12],[2,12],[0,10],[0,7.2],[1.8,6],[0,4.8],[0,2]];
  var octagon = [[2,0],[10,0],[12,2],[12,10],[10,12],[2,12],[0,10],[0,2]];
  var P = {
    "0": { o: octagon, s: [[[7.25,3],[7.75,3],[4.75,9],[4.25,9]]] },
    "1": { o: [[0,2],[2,0],[9,0],[9,8],[12,8],[12,12],[0,12],[0,8],[3,8],[3,4],[0,4]], s: [] },
    "2": { o: [[0,0],[10,0],[12,2],[12,12],[0,12]], s: [[0,4,hi,4 + W],[lo,7.5,12,7.5 + W]] },
    "3": { o: [[0,0],[10,0],[12,2],[12,10],[10,12],[0,12]], s: [[0,4,hi,4 + W],[0,7.5,hi,7.5 + W]] },
    "4": { o: [[2,0],[12,0],[12,12],[6,12],[6,7.5],[0,7.5],[0,2]], s: [[6,0,6 + W,4.5]] },
    "5": { o: [[0,0],[12,0],[12,10],[10,12],[0,12]], s: [[lo,4,12,4 + W],[0,7.5,hi,7.5 + W]] },
    "6": { o: [[2,0],[12,0],[12,10],[10,12],[2,12],[0,10],[0,2]], s: [[lo,4,12,4 + W],[lo,7,hi,9.5]] },
    "7": { o: [[0,0],[12,0],[12,4],[9,12],[3,12],[6,4],[0,4]], s: [] },
    "8": { o: [[2,0],[10,0],[12,2],[12,4.5],[10.5,6],[12,7.5],[12,10],[10,12],[2,12],[0,10],[0,7.5],[1.5,6],[0,4.5],[0,2]], s: [[lo,2.5,hi,4.5],[lo,7.5,hi,9.5]] },
    "9": { o: [[10,12],[0,12],[0,2],[2,0],[10,0],[12,2],[12,10]], s: [[0,7.5,hi,7.5 + W],[lo,2.5,hi,5]] },
    "!": { w: D, o: [[0,0],[D,0],[3.8,7.5],[0.8,7.5]], x: [dot], s: [] },
    "@": { o: octagon, s: [[4,3.5,8.5,4],[8,4,8.5,7],[4,4,4.5,8.5],[4,8.5,12,9]] },
    "#": { o: [[2,0],[5,0],[5,2],[7,2],[7,0],[10,0],[10,2],[12,2],[12,5],[10,5],[10,7],[12,7],[12,10],[10,10],[10,12],[7,12],[7,10],[5,10],[5,12],[2,12],[2,10],[0,10],[0,7],[2,7],[2,5],[0,5],[0,2],[2,2]], s: [[5,5,7,7]] },
    "$": { o: G.S.o, s: [[lo,0,hi,1.5],[lo,10.5,hi,12]] },
    "%": { o: [[8,0],[12,0],[4,12],[0,12]], x: [rect(0, 0, 4, 4), rect(8, 8, 12, 12)], s: [] },
    "^": { o: [[3.6,0],[8.4,0],[12,4.5],[7.2,4.5],[6,3],[4.8,4.5],[0,4.5]], s: [] },
    "&": { o: [[2,0],[9,0],[11,2],[11,4.5],[9.5,6],[12,6],[12,7.5],[10.5,9],[12,10.5],[12,12],[2,12],[0,10],[0,7.5],[1.5,6],[0,4.5],[0,2]], s: [[lo,2.5,hi,4.5],[lo,7.5,hi,9.5]] },
    "*": { w: 7.2, o: scale(star, 0.6), s: [] },
    "(": { w: 5, o: paren, s: [] },
    ")": { w: 5, o: flipX(paren, 5), s: [] },
    "_": { o: rect(0, 10, 12, 12), s: [] },
    "+": { o: [[4,1.5],[8,1.5],[8,4],[10.5,4],[10.5,8],[8,8],[8,10.5],[4,10.5],[4,8],[1.5,8],[1.5,4],[4,4]], s: [] },
    ";": { w: D, o: rect(0, 2.4, D, 2.4 + DOT), x: [comma], s: [] },
    ":": { w: D, o: rect(0, 2.4, D, 2.4 + DOT), x: [dot], s: [] },
    "'": { w: D, o: tick, s: [] },
    '"': { w: 10.6, o: tick, x: [tick.map(function (p) { return [p[0] + 6, p[1]]; })], s: [] },
    "<": { w: 10, o: angle, s: [] },
    ">": { w: 10, o: flipX(angle, 10), s: [] },
    ",": { w: D, o: comma, s: [] },
    ".": { w: D, o: dot, s: [] },
    "?": { o: [[0,0],[10,0],[12,2],[12,5],[8.3,7.5],[3.7,7.5],[3.7,4],[0,4]], x: [rect(3.7, 8.6, 8.3, 12)], s: [] },
    "/": { w: 9, o: [[5,0],[9,0],[4,12],[0,12]], s: [] },
    "-": { w: 8, o: rect(0, 4, 8, 8), s: [] }
  };
  var SIGNS = Object.keys(P).filter(function (k) { return !/[0-9]/.test(k); });
  var FIGURES = "0123456789".split("");
  Object.keys(P).forEach(function (k) { G[k] = P[k]; });

  function poly(pts) { return "M" + pts.map(function (p) { return p[0] + " " + p[1]; }).join("L") + "Z"; }

  function letterPath(ch) {
    var g = G[String(ch || "").toUpperCase()];
    if (!g) return "";
    var d = poly(g.o);
    (g.x || []).forEach(function (pts) { d += poly(pts); });
    g.s.forEach(function (r) {
      if (Array.isArray(r[0])) {
        d += "M" + r.map(function (p) { return p[0] + " " + p[1]; }).join("L") + "Z";
      } else {
        d += "M" + r[0] + " " + r[1] + "H" + r[2] + "V" + r[3] + "H" + r[0] + "Z";
      }
    });
    return d;
  }

  /* The glyph as polygons, for building a font file: `fills` are the outline
     and any further outlines, `cuts` are the slits, every one a list of points. */
  function glyphContours(ch) {
    var g = G[String(ch || "").toUpperCase()];
    if (!g) return null;
    return {
      w: g.w || 12,
      fills: [g.o].concat(g.x || []),
      cuts: g.s.map(function (r) { return Array.isArray(r[0]) ? r : rect(r[0], r[1], r[2], r[3]); })
    };
  }

  function glyphWidth(ch) {
    var g = G[String(ch || "").toUpperCase()];
    return g ? (g.w || 12) : 0;
  }

  root.CHOCKABLOQUE_LETTERS = LETTERS;
  root.CHOCKABLOQUE_FIGURES = FIGURES;
  root.CHOCKABLOQUE_SIGNS = SIGNS;
  root.letterPath = letterPath;
  root.glyphWidth = glyphWidth;
  root.glyphContours = glyphContours;
})(this);
