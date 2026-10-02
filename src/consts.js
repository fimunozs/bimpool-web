// Interruptor de visibilidad en buscadores.
//
// false → el sitio pide no ser indexado: <meta name="robots" content="noindex, nofollow">
//         en todas las páginas y un robots.txt que bloquea el rastreo completo.
// true  → sitio abierto a buscadores.
//
// Al cambiarlo hay que tocar también vercel.json, que es JSON y no puede leer esta
// constante: ahí vive la cabecera X-Robots-Tag que cubre imágenes y archivos sueltos.
// Los tres lugares están listados en CLAUDE.md.
export const INDEXABLE = false;
