// Miniaturas discretas para la lista de experiencia previa.
//
//   node experiencia-imagenes.js <slug>=<ruta> [<slug>=<ruta> ...]
//
// Se muestran a ~40 px de ancho junto al nombre del proyecto, así que basta con
// 180 px de lado mayor: pesan poco y se ven nítidas incluso en pantallas densas.
// Recorte 4:3 centrado para que toda la lista tenga la misma silueta.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..", "..");
const OUT = path.join(ROOT, "public", "experiencia");
fs.mkdirSync(OUT, { recursive: true });

const ANCHO = 180;
const ALTO = 135;

(async () => {
  for (const arg of process.argv.slice(2)) {
    const i = arg.indexOf("=");
    const slug = arg.slice(0, i);
    const src = arg.slice(i + 1);
    await sharp(src)
      .resize(ANCHO, ALTO, { fit: "cover", position: "centre" })
      .webp({ quality: 78 })
      .toFile(path.join(OUT, `${slug}.webp`));
    const kb = Math.round(fs.statSync(path.join(OUT, `${slug}.webp`)).size / 1024);
    console.log(`${slug.padEnd(26)} ${kb} KB`);
  }
  console.log(`\n→ public/experiencia/`);
})();
