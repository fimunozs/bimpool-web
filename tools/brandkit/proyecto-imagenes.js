// Optimiza las vistas 3D de un proyecto para la web y escribe el manifiesto que usa el sitio.
//
//   node proyecto-imagenes.js "<carpeta origen>" <slug> [COD1,COD2,...]
//   node proyecto-imagenes.js "G:/Mi unidad/.../SCFA - Aeropuerto Andres Sabella" scfa
//
// Espera archivos con el patrón  <PROYECTO>_<VISTA>_<CÓDIGO>_<Nombre del edificio>.png
// Recorta el blanco sobrante, deja un margen limpio y exporta WebP en dos tamaños:
//   - <código>.webp        1800 px · para el visor a pantalla completa
//   - <código>-thumb.webp   900 px · para la grilla
// Salida: public/proyectos/<slug>/ y src/data/<slug>.json
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = process.argv[2];
const SLUG = process.argv[3];
// orden de la galería: códigos en el orden deseado; el resto va alfabético al final
const ORDEN = (process.argv[4] || "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
if (!SRC || !SLUG) {
  console.error('Uso: node proyecto-imagenes.js "<carpeta origen>" <slug>');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, "..", "..");
const OUT_IMG = path.join(ROOT, "public", "proyectos", SLUG);
const OUT_DATA = path.join(ROOT, "src", "data");
fs.mkdirSync(OUT_IMG, { recursive: true });
fs.mkdirSync(OUT_DATA, { recursive: true });

const PAD = 40;          // margen blanco que se devuelve tras recortar, en px del original
const FULL = 1800;
const THUMB = 900;

(async () => {
  const archivos = fs.readdirSync(SRC).filter((f) => /\.png$/i.test(f)).sort();
  const manifiesto = [];

  for (const archivo of archivos) {
    const base = path.basename(archivo, path.extname(archivo));
    const partes = base.split("_");
    const codigo = (partes[2] || base).toLowerCase();
    const nombre = partes.slice(3).join("_") || base;

    // trim() recorta el fondo uniforme; extend() devuelve un margen parejo
    const recortada = await sharp(path.join(SRC, archivo))
      .flatten({ background: "#ffffff" })
      .trim({ background: "#ffffff", threshold: 8 })
      .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: "#ffffff" })
      .toBuffer();

    const meta = await sharp(recortada).metadata();
    const salida = (w, sufijo) =>
      sharp(recortada)
        .resize({ width: w, height: w, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(OUT_IMG, `${codigo}${sufijo}.webp`));

    await salida(FULL, "");
    await salida(THUMB, "-thumb");

    manifiesto.push({
      codigo: codigo.toUpperCase(),
      nombre,
      src: `/proyectos/${SLUG}/${codigo}.webp`,
      thumb: `/proyectos/${SLUG}/${codigo}-thumb.webp`,
      ratio: +(meta.width / meta.height).toFixed(3),
    });

    console.log(`${codigo.padEnd(4)} ${String(meta.width).padStart(5)}×${String(meta.height).padStart(5)}  ${nombre}`);
  }

  // orden: primero los códigos indicados, luego el resto alfabético
  const destacados = ORDEN.length ? ORDEN : ["PAX", "TWR", "LOG", "CCA", "ADM", "SEI"];
  manifiesto.sort((a, b) => {
    const ia = destacados.indexOf(a.codigo), ib = destacados.indexOf(b.codigo);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.nombre.localeCompare(b.nombre, "es");
  });

  fs.writeFileSync(path.join(OUT_DATA, `${SLUG}.json`), JSON.stringify(manifiesto, null, 2) + "\n");
  console.log(`\n${manifiesto.length} vistas → public/proyectos/${SLUG}/ y src/data/${SLUG}.json`);
})();
