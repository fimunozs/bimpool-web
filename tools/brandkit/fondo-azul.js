// Pasa una vista o lámina de fondo blanco a la gráfica institucional:
// fondo azul --primary (#1A2942), arquitectura (línea gris/negra) en blanco y
// el color de la especialidad (p. ej. el verde de corrientes débiles) se conserva.
//
//   node fondo-azul.js <archivo.webp> [...]      reescribe los archivos en su lugar
//
// También se exporta `aAzul(buffer)` para que laminas.js lo aplique al componer.
// El CLI omite las imágenes cuya esquina ya no es blanca, para no invertirlas dos veces.
const fs = require("fs");
const sharp = require("sharp");

const AZUL = [0x1a, 0x29, 0x42];
const BLANCO = [255, 255, 255];

// Intensidad de la línea: refuerza los grises claros (arquitectura tenue en las
// vistas de especialidad) sin saturar los sombreados de las vistas de arquitectura.
const curva = (v) => Math.pow(Math.min(1, v * 2.2), 0.85);

async function aAzul(input) {
  const { data, info } = await sharp(input).flatten({ background: "#ffffff" })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const croma = mx - mn;
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    // parte neutra: blanco → azul, gris/negro → blanco
    const t = curva(1 - lum);
    // peso del color de especialidad: 0 en grises, 1 en colores francos
    const c = Math.min(1, Math.max(0, (croma - 12) / 50));

    for (let k = 0; k < 3; k++) {
      const neutro = AZUL[k] + (BLANCO[k] - AZUL[k]) * t;
      out[i + k] = Math.round(c * data[i + k] + (1 - c) * neutro);
    }
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } });
}

module.exports = { aAzul, AZUL: "#1a2942" };

if (require.main === module) {
  (async () => {
    for (const archivo of process.argv.slice(2)) {
      const { data } = await sharp(archivo).extract({ left: 0, top: 0, width: 1, height: 1 })
        .removeAlpha().raw().toBuffer({ resolveWithObject: true });
      if (data[0] < 240 || data[1] < 240 || data[2] < 240) {
        console.log(`omitido     ${archivo} (ya no tiene fondo blanco)`);
        continue;
      }
      const meta = await sharp(archivo).metadata();
      const calidad = meta.width <= 900 ? 80 : 82;
      const buf = await (await aAzul(archivo)).webp({ quality: calidad }).toBuffer();
      fs.writeFileSync(archivo, buf);
      console.log(`azul        ${archivo}`);
    }
  })();
}
