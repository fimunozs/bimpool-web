// Genera los recursos gráficos de la página de empresa de LinkedIn a partir de la marca.
//   node linkedin.js ../../public/brand/linkedin
const fs = require("fs");
const path = require("path");
const ot = require("opentype.js");
const sharp = require("sharp");

const OUT = process.argv[2] || "out/linkedin";
fs.mkdirSync(OUT, { recursive: true });

const NAVY = "#1a2942", ORANGE = "#ff6b35", WHITE = "#ffffff", GRAY = "#a7b0bf", FROST = "#f7f9fc";
const font = ot.loadSync(path.join(__dirname, "dmsans500.ttf"));

function textPath(text, size, tracking = -0.035) {
  const p = font.getPath(text, 0, 0, size, { letterSpacing: tracking, kerning: true });
  const bb = p.getBoundingBox();
  return { d: p.toPathData(2), bb, w: bb.x2 - bb.x1, h: bb.y2 - bb.y1 };
}

// Isotipo Origen centrado en (cx, cy) con escala s (base 64)
function mark(cx, cy, s, color, dot = ORANGE) {
  return `<g transform="translate(${cx - 32 * s} ${cy - 32 * s}) scale(${s})">
    <g stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none">
      <line x1="32" y1="35" x2="32" y2="8"/><line x1="32" y1="35" x2="9" y2="48"/><line x1="32" y1="35" x2="55" y2="48"/>
    </g><circle cx="32" cy="35" r="5.5" fill="${dot}"/></g>`;
}

// Retícula isométrica tenue (misma del hero del sitio)
function grid(W, H, sp, opacity = 0.14) {
  const T30 = Math.tan(Math.PI / 6), D = 2 * sp * T30, cx = W / 2, cy = H / 2;
  let out = `<g stroke="rgba(255,255,255,${opacity})" stroke-width="1" fill="none">`;
  for (let x = cx % sp; x < W; x += sp) out += `<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
  for (let b = cy - Math.ceil((cy + W) / D) * D; b < H + W; b += D) {
    out += `<line x1="0" y1="${(b - cx * T30).toFixed(1)}" x2="${W}" y2="${(b + (W - cx) * T30).toFixed(1)}"/>`;
    out += `<line x1="0" y1="${(b + cx * T30).toFixed(1)}" x2="${W}" y2="${(b - (W - cx) * T30).toFixed(1)}"/>`;
  }
  return out + `</g>`;
}

function fadeDefs(id, cx = "50%", cy = "50%", r = "70%") {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">
    <stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.6" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>`;
}

// ---------- 1. Logo 400×400 (LinkedIn lo muestra en círculo/cuadro redondeado) ----------
function logoSquare(size = 400) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" fill="${NAVY}"/>
  <g stroke="${WHITE}" stroke-width="3.5" stroke-linecap="round" fill="none">
    <line x1="32" y1="35" x2="32" y2="10"/><line x1="32" y1="35" x2="11" y2="47"/><line x1="32" y1="35" x2="53" y2="47"/>
  </g><circle cx="32" cy="35" r="5.5" fill="${ORANGE}"/>
</svg>`;
}

// ---------- 2. Portada 1128×191 (se genera a 2×). Zona segura: el logo tapa la esquina inferior izquierda ----------
function cover() {
  const W = 2256, H = 382;
  const wm = textPath("bimpool", 120);
  const tag = textPath("Precisión en el modelo, control en la obra.", 44, -0.01);
  const sub = textPath("Modelado · Coordinación · Documentación · Automatización", 28, 0.02);
  const right = W - 120;
  const wmX = right - wm.w - wm.bb.x1, wmY = 112 - wm.bb.y1;   // ascendentes en y=112
  // isotipo a la izquierda del wordmark, centrado en el bloque ascendente→línea base
  const noDesc = textPath("bimool", 120).bb;
  const markS = 1.6, markCX = wmX + wm.bb.x1 - 44 - 32 * markS, markCY = wmY + (noDesc.y1 + noDesc.y2) / 2 + 3;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${fadeDefs("f", "72%", "50%", "60%")}<mask id="m"><rect width="${W}" height="${H}" fill="url(#f)"/></mask></defs>
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <g mask="url(#m)">${grid(W, H, 56, 0.18)}</g>
  <g mask="url(#m)" fill="rgba(255,255,255,0.5)">
    <circle cx="700" cy="60" r="4"/><circle cx="1012" cy="330" r="4"/><circle cx="1180" cy="70" r="4"/><circle cx="1740" cy="40" r="4"/>
  </g>
  <circle cx="880" cy="180" r="22" fill="none" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 6" opacity="0.8"/><circle cx="880" cy="180" r="5" fill="${ORANGE}"/>
  <circle cx="1292" cy="86" r="22" fill="none" stroke="${ORANGE}" stroke-width="2" stroke-dasharray="6 6" opacity="0.8"/><circle cx="1292" cy="86" r="5" fill="${ORANGE}"/>
  ${mark(markCX, markCY, markS, WHITE)}
  <path transform="translate(${wmX.toFixed(1)} ${wmY.toFixed(1)})" fill="${WHITE}" d="${wm.d}"/>
  <path transform="translate(${(right - tag.w - tag.bb.x1).toFixed(1)} ${(266 - tag.bb.y1).toFixed(1)})" fill="${FROST}" d="${tag.d}"/>
  <path transform="translate(${(right - sub.w - sub.bb.x1).toFixed(1)} ${(326 - sub.bb.y1).toFixed(1)})" fill="${GRAY}" d="${sub.d}"/>
</svg>`;
}

// ---------- 3. Plantilla de publicación 1080×1080 ----------
function postTemplate() {
  const W = 1080, H = 1080;
  const wm = textPath("bimpool", 64);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${fadeDefs("f2")}<mask id="m2"><rect width="${W}" height="${H}" fill="url(#f2)"/></mask></defs>
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <g mask="url(#m2)">${grid(W, H, 60, 0.16)}</g>
  <circle cx="540" cy="485" r="70" fill="${ORANGE}" opacity="0.15"/>
  ${mark(540, 470, 5, WHITE)}
  <g transform="translate(${(80 - wm.bb.x1).toFixed(1)} ${(H - 80 - wm.bb.y2).toFixed(1)})"><path fill="${WHITE}" d="${wm.d}"/></g>
  <rect x="80" y="80" width="140" height="4" fill="${ORANGE}"/>
</svg>`;
}

const files = {
  "linkedin-logo-400.svg": logoSquare(),
  "linkedin-portada-1128x191.svg": cover(),
  "linkedin-plantilla-post-1080.svg": postTemplate(),
};
for (const [n, s] of Object.entries(files)) fs.writeFileSync(path.join(OUT, n), s);

(async () => {
  const opt = { density: 300 };
  await sharp(Buffer.from(files["linkedin-logo-400.svg"]), opt).resize(400, 400).png().toFile(path.join(OUT, "linkedin-logo-400.png"));
  await sharp(Buffer.from(files["linkedin-portada-1128x191.svg"]), opt).resize(2256, 382).png().toFile(path.join(OUT, "linkedin-portada-2256x382.png"));
  await sharp(Buffer.from(files["linkedin-portada-1128x191.svg"]), opt).resize(1128, 191).png().toFile(path.join(OUT, "linkedin-portada-1128x191.png"));
  await sharp(Buffer.from(files["linkedin-plantilla-post-1080.svg"]), opt).resize(1080, 1080).png().toFile(path.join(OUT, "linkedin-plantilla-post-1080.png"));
  console.log(fs.readdirSync(OUT).join("\n"));
})();
