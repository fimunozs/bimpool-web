// Pasa una vista o lámina de fondo blanco a la gráfica institucional:
// fondo azul --primary (#1A2942), arquitectura (línea gris/negra) en blanco y
// el color de la especialidad (p. ej. el verde de corrientes débiles) se conserva.
//
//   node fondo-azul.js [--sin-sombras] <archivo.webp> [...]   reescribe los archivos en su lugar
//
// --sin-sombras (o `{ sinSombras: true }`): los grises claros, como las sombras que Revit
// proyecta sobre el plano horizontal, pasan a fondo azul en vez de verse como una mancha.
// Usar solo en vistas de arquitectura; en las de especialidad la arquitectura tenue es gris claro.
//
// --intensidad=<0..1> (o `{ intensidad }`): tope del blanco de la línea neutra. 1 = blanco pleno;
// 0,5 deja la arquitectura en un gris azulado similar al que tiene en las vistas de SCFA.
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

// Luminancia desde la que un gris se considera sombra (~217/255; las sombras de INO4 rondan 229)
const UMBRAL_SOMBRA = 0.85;

async function aAzul(input, { sinSombras = false, intensidad = 1 } = {}) {
  const { data, info } = await sharp(input).flatten({ background: "#ffffff" })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const croma = mx - mn;
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    // parte neutra: blanco → azul, gris/negro → blanco
    const v = sinSombras ? Math.max(0, (UMBRAL_SOMBRA - lum) / UMBRAL_SOMBRA) : 1 - lum;
    const t = curva(v) * intensidad;
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
    const args = process.argv.slice(2);
    const sinSombras = args.includes("--sin-sombras");
    const optInt = args.find((a) => a.startsWith("--intensidad="));
    const intensidad = optInt ? Number(optInt.split("=")[1]) : 1;
    for (const archivo of args.filter((a) => !a.startsWith("--"))) {
      const { data } = await sharp(archivo).extract({ left: 0, top: 0, width: 1, height: 1 })
        .removeAlpha().raw().toBuffer({ resolveWithObject: true });
      if (data[0] < 240 || data[1] < 240 || data[2] < 240) {
        console.log(`omitido     ${archivo} (ya no tiene fondo blanco)`);
        continue;
      }
      const meta = await sharp(archivo).metadata();
      const calidad = meta.width <= 900 ? 80 : 82;
      const buf = await (await aAzul(archivo, { sinSombras, intensidad })).webp({ quality: calidad }).toBuffer();
      fs.writeFileSync(archivo, buf);
      console.log(`azul        ${archivo}`);
    }
  })();
}
