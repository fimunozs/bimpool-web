// Genera el kit de marca BIMpool (isotipo Origen + wordmark "bimpool" en DM Sans 500)
const fs = require("fs");
const path = require("path");
const ot = require("opentype.js");
const sharp = require("sharp");

const OUT = process.argv[2] || "out";
fs.mkdirSync(OUT, { recursive: true });

const NAVY = "#1a2942", ORANGE = "#ff6b35", WHITE = "#ffffff";

// ---------- Isotipo (viewBox 64) ----------
// Tres ejes desde el origen (32,35) + punto naranja.
function mark(color, dot = ORANGE, sw = 3) {
  return `<g stroke="${color}" stroke-width="${sw}" stroke-linecap="round" fill="none">
    <line x1="32" y1="35" x2="32" y2="8"/><line x1="32" y1="35" x2="9" y2="48"/><line x1="32" y1="35" x2="55" y2="48"/>
  </g><circle cx="32" cy="35" r="5.5" fill="${dot}"/>`;
}

// ---------- Wordmark a trazados ----------
const font = ot.loadSync("dmsans500.ttf");
const SIZE = 46;              // unidades del viewBox (mark = 64)
const TRACKING = -0.035;      // em, igual que en la propuesta
const p = font.getPath("bimpool", 0, 0, SIZE, { letterSpacing: TRACKING, kerning: true });
const bb = p.getBoundingBox();
const wmW = bb.x2 - bb.x1, wmH = bb.y2 - bb.y1;
const GAP = 18;               // espacio isotipo → texto
const MARK_CY = 30;           // centro óptico del isotipo (entre ejes y punto)
const tx = 64 + GAP - bb.x1;
// centrar sobre ascendente→línea base (sin el descendente de la "p")
const bbNoDesc = font.getPath("bimool", 0, 0, SIZE, { letterSpacing: TRACKING }).getBoundingBox();
const ty = MARK_CY - (bbNoDesc.y1 + bbNoDesc.y2) / 2;
const wordPath = p.toPathData(2);
const totalW = 64 + GAP + wmW;
const PAD = 8;

function horizontal(textColor, markColor, dot = ORANGE) {
  const w = totalW + PAD * 2, h = 64 + PAD * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-PAD} ${-PAD} ${w.toFixed(2)} ${h}" width="${(w * 4).toFixed(0)}" height="${h * 4}">
  <title>bimpool</title>
  ${mark(markColor, dot)}
  <path transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)})" fill="${textColor}" d="${wordPath}"/>
</svg>`;
}

function vertical(textColor, markColor, dot = ORANGE) {
  // isotipo centrado arriba, wordmark centrado debajo (escala 0.85)
  const s = 0.85, tw = wmW * s;
  const w = Math.max(64, tw) + PAD * 2;
  const cx = (w - PAD * 2) / 2;
  const markX = cx - 32;
  const textX = cx - tw / 2 - bb.x1 * s;
  const textY = 64 + 10 - bb.y1 * s;
  const h = 64 + 10 + wmH * s + PAD * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-PAD} ${-PAD} ${w.toFixed(2)} ${h.toFixed(2)}" width="${(w * 4).toFixed(0)}" height="${(h * 4).toFixed(0)}">
  <title>bimpool</title>
  <g transform="translate(${markX.toFixed(3)} 0)">${mark(markColor, dot)}</g>
  <path transform="translate(${textX.toFixed(3)} ${textY.toFixed(3)}) scale(${s})" fill="${textColor}" d="${wordPath}"/>
</svg>`;
}

function isotipo(markColor, dot = ORANGE, bg = null, radius = 14) {
  const rect = bg ? `<rect width="64" height="64" rx="${radius}" fill="${bg}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256">
  <title>bimpool</title>
  ${rect}${mark(markColor, dot, bg ? 3.5 : 3)}
</svg>`;
}

const files = {
  "bimpool-isotipo.svg": isotipo(NAVY),
  "bimpool-isotipo-blanco.svg": isotipo(WHITE),
  "bimpool-isotipo-mono.svg": isotipo(NAVY, NAVY),
  "bimpool-isotipo-tile.svg": isotipo(WHITE, ORANGE, NAVY),
  "bimpool-logo-horizontal.svg": horizontal(NAVY, NAVY),
  "bimpool-logo-horizontal-blanco.svg": horizontal(WHITE, WHITE),
  "bimpool-logo-horizontal-mono.svg": horizontal(NAVY, NAVY, NAVY),
  "bimpool-logo-horizontal-mono-blanco.svg": horizontal(WHITE, WHITE, WHITE),
  "bimpool-logo-vertical.svg": vertical(NAVY, NAVY),
  "bimpool-logo-vertical-blanco.svg": vertical(WHITE, WHITE),
};
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), svg);

// ---------- PNG ----------
async function png(svgName, outName, width, bg = null) {
  let img = sharp(Buffer.from(files[svgName]), { density: 300 }).resize({ width });
  if (bg) img = img.flatten({ background: bg });
  await img.png().toFile(path.join(OUT, outName));
}

(async () => {
  await png("bimpool-logo-horizontal.svg", "bimpool-logo-horizontal.png", 2400);
  await png("bimpool-logo-horizontal-blanco.svg", "bimpool-logo-horizontal-fondo-oscuro.png", 2400, NAVY);
  await png("bimpool-logo-vertical.svg", "bimpool-logo-vertical.png", 1600);
  await png("bimpool-isotipo.svg", "bimpool-isotipo.png", 1024);
  await png("bimpool-isotipo-tile.svg", "bimpool-isotipo-tile.png", 1024);
  await png("bimpool-isotipo-tile.svg", "apple-touch-icon.png", 180);
  await png("bimpool-isotipo-tile.svg", "favicon-32.png", 32);

  // Open Graph 1200x630: fondo navy, logo blanco centrado
  const lw = 720, lh = Math.round(lw * (64 + PAD * 2) / (totalW + PAD * 2));
  const logo = await sharp(Buffer.from(files["bimpool-logo-horizontal-blanco.svg"]), { density: 300 }).resize({ width: lw }).png().toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: NAVY } })
    .composite([{ input: logo, left: Math.round((1200 - lw) / 2), top: Math.round((630 - lh) / 2) }])
    .png().toFile(path.join(OUT, "og-image.png"));

  console.log("wordmark bbox", { w: wmW.toFixed(1), h: wmH.toFixed(1) }, "lockup viewBox width", (totalW + PAD * 2).toFixed(1));
  console.log(fs.readdirSync(OUT).join("\n"));
})();
