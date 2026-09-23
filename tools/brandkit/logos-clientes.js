// Prepara los logotipos de cliente para el sitio: recorta, los pasa a silueta negra
// sobre fondo transparente y los deja en public/clientes/<slug>.png
//
//   node logos-clientes.js <slug>=<ruta> [<slug>=<ruta> ...]
//
// La silueta permite teñirlos por CSS (opacidad/color) y que los distintos logos
// convivan sin pelearse con la paleta de la marca.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..", "..");
const OUT = path.join(ROOT, "public", "clientes");
fs.mkdirSync(OUT, { recursive: true });

const ANCHO = 420; // px del archivo final; en pantalla se muestra a ~22 px de alto

(async () => {
  for (const arg of process.argv.slice(2)) {
    const i = arg.indexOf("=");
    const slug = arg.slice(0, i);
    const src = arg.slice(i + 1);

    // 1. recortar el blanco sobrante y normalizar tamaño
    const plano = await sharp(src)
      .flatten({ background: "#ffffff" })
      .trim({ background: "#ffffff", threshold: 20 })
      .resize({ width: ANCHO, fit: "inside", withoutEnlargement: false })
      .toBuffer();
    const { width, height } = await sharp(plano).metadata();

    // 2. la luminancia invertida es la máscara: trazo = opaco, papel = transparente
    const alfa = await sharp(plano).greyscale().negate().raw().toBuffer();

    // 3. silueta negra con esa máscara
    await sharp({ create: { width, height, channels: 3, background: "#000000" } })
      .joinChannel(alfa, { raw: { width, height, channels: 1 } })
      .png()
      .toFile(path.join(OUT, `${slug}.png`));

    console.log(`${slug.padEnd(8)} ${width}×${height}  <- ${path.basename(src)}`);
  }
  console.log(`\n→ public/clientes/`);
})();
