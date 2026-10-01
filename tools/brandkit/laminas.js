// Compone las vistas de un proyecto en láminas (varias vistas por imagen) para que la
// galería del sitio no se llene de miniaturas sueltas.
//
//   node laminas.js laminas-<slug>.json
//
// El archivo de configuración define el origen, la portada y qué vistas van en cada lámina.
// Salida: public/proyectos/<slug>/ (portada + lam-N) y src/data/<slug>.json
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const CFG = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const ROOT = path.resolve(__dirname, "..", "..");
const OUT_IMG = path.join(ROOT, "public", "proyectos", CFG.slug);
const OUT_DATA = path.join(ROOT, "src", "data");
fs.mkdirSync(OUT_IMG, { recursive: true });
fs.mkdirSync(OUT_DATA, { recursive: true });

// Geometría de la lámina: 2 × 2 celdas sobre fondo blanco
const W = 2400, H = 1700, MARGEN = 50, SEP = 40, PIE = 52;
const CELDA_W = Math.floor((W - MARGEN * 2 - SEP) / 2);
const CELDA_H = Math.floor((H - MARGEN * 2 - SEP) / 2);
const IMG_H = CELDA_H - PIE;

// Lee el PNG original, recorta el blanco sobrante y lo deja listo para la celda
async function vista(codigo) {
  const archivo = fs.readdirSync(CFG.origen)
    .find((f) => /\.png$/i.test(f) && f.split("_")[2] === codigo);
  if (!archivo) throw new Error(`sin archivo para la vista ${codigo}`);
  return sharp(path.join(CFG.origen, archivo))
    .flatten({ background: "#ffffff" })
    .trim({ background: "#ffffff", threshold: 8 })
    .toBuffer();
}

const etiqueta = (x, y, texto) =>
  Buffer.from(
    `<svg width="${CELDA_W}" height="${PIE}" xmlns="http://www.w3.org/2000/svg">
       <text x="0" y="${PIE - 18}" font-family="DM Sans, Segoe UI, Arial, sans-serif"
             font-size="26" font-weight="600" letter-spacing="2.4" fill="#5f6b80">${texto}</text>
     </svg>`
  );

(async () => {
  const manifiesto = [];

  // portada: una sola vista, a resolución completa
  if (CFG.portada) {
    const buf = await vista(CFG.portada);
    await sharp(buf).resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 82 })
      .toFile(path.join(OUT_IMG, "portada.webp"));
    console.log(`portada     ${CFG.portada}`);
  }

  for (let i = 0; i < CFG.laminas.length; i++) {
    const lam = CFG.laminas[i];
    const capas = [];

    for (let j = 0; j < lam.vistas.length; j++) {
      const col = j % 2, fila = Math.floor(j / 2);
      const x = MARGEN + col * (CELDA_W + SEP);
      const y = MARGEN + fila * (CELDA_H + SEP);

      const buf = await vista(lam.vistas[j]);
      const img = await sharp(buf)
        .resize(CELDA_W, IMG_H, { fit: "inside", withoutEnlargement: false })
        .toBuffer();
      const m = await sharp(img).metadata();
      capas.push({
        input: img,
        left: x + Math.floor((CELDA_W - m.width) / 2),
        top: y + Math.floor((IMG_H - m.height) / 2),
      });
      capas.push({ input: etiqueta(x, y, lam.vistas[j]), left: x, top: y + IMG_H });
    }

    const base = `lam-${String(i + 1).padStart(2, "0")}`;
    const hoja = await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
      .composite(capas).png().toBuffer();

    await sharp(hoja).resize({ width: 1800 }).webp({ quality: 82 }).toFile(path.join(OUT_IMG, `${base}.webp`));
    await sharp(hoja).resize({ width: 900 }).webp({ quality: 80 }).toFile(path.join(OUT_IMG, `${base}-thumb.webp`));

    manifiesto.push({
      codigo: lam.codigo,
      nombre: lam.nombre,
      detalle: lam.detalle,
      src: `/proyectos/${CFG.slug}/${base}.webp`,
      thumb: `/proyectos/${CFG.slug}/${base}-thumb.webp`,
      ratio: +(W / H).toFixed(3),
    });
    console.log(`${base}      ${lam.nombre}  (${lam.vistas.join(", ")})`);
  }

  fs.writeFileSync(path.join(OUT_DATA, `${CFG.slug}.json`), JSON.stringify(manifiesto, null, 2) + "\n");
  console.log(`\n${manifiesto.length} láminas → public/proyectos/${CFG.slug}/ y src/data/${CFG.slug}.json`);
})();
