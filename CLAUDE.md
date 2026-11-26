# BIMpool — sitio web

Landing corporativa estática en **Astro 7**. Sin frameworks de UI ni Tailwind: componentes
`.astro` con CSS scoped y tokens en `src/styles/global.css`.

## Comandos

```bash
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
```

## Estructura

- `src/layouts/Base.astro` — head/SEO, header con menú móvil, footer.
- `src/components/` — una sección por archivo: Hero, Services, Process, Projects, About, Contact.
- `src/pages/index.astro` — única página; ensambla las secciones en orden.
- `public/logo.svg`, `public/favicon.svg` — isotipo (cubo isométrico).

## Pendientes de contenido (buscar y reemplazar)

- `Contact.astro` → `FORM_ENDPOINT`: poner el id de Formspree; hasta entonces el form usa `mailto:`.
- `astro.config.mjs` → `site` — dominio definitivo.

## Proyectos del portafolio

`src/data/proyectos.js` define los proyectos (textos, ficha, cliente, portada) e importa
el manifiesto de vistas de cada uno. `src/components/Projects.astro` los recorre: caso
destacado + galería + visor a pantalla completa compartido (sin librerías).

Las imágenes **no se editan a mano**. El original vive en Google Drive
(`WEBPAGE-BIMPOOL / 04_MULTIMEDIA / 02_RENDERS Y VISTAS / <proyecto>`) y se procesa con:

```bash
cd tools/brandkit
node proyecto-imagenes.js "<carpeta origen>" <slug> ["COD1,COD2,..."]
```

Recorta el blanco, exporta WebP en dos tamaños a `public/proyectos/<slug>/` y escribe
`src/data/<slug>.json`. El tercer argumento fija el orden de la galería. Espera archivos
`<PROY>_<VISTA>_<CÓDIGO>_<Nombre>.png`.

### Láminas de la galería

La galería no muestra una miniatura por vista: las vistas se agrupan en **láminas** de
2 × 2 (cuatro vistas por imagen, con su código rotulado). Se componen con:

```bash
cd tools/brandkit
node laminas.js laminas-<slug>.json
```

El JSON define origen, portada y qué vistas van en cada lámina; el script recorta el blanco
de cada PNG, las compone sobre fondo blanco, rotula el código y escribe `src/data/<slug>.json`
más `portada.webp`. Al final pasa todo por `fondo-azul.js`: fondo `--primary`, arquitectura en
blanco y el color de la especialidad intacto (`node fondo-azul.js <archivo.webp>` lo aplica a
imágenes ya exportadas; omite las que ya no tienen fondo blanco). Con `"sinSombras": true` en el
JSON (o `--sin-sombras` en el CLI) las sombras grises del plano horizontal pasan a fondo; se usa en
`clinica`, no en `scfa`, donde la arquitectura tenue es justamente gris claro. `"intensidad": 0.5`
(o `--intensidad=0.5`) baja la línea de arquitectura de blanco pleno a un gris azulado como el de
`scfa`; `clinica` lo usa. `"adelgazarPortada": 1` (o `--adelgazar=1`) afina la línea de la portada.
Tras reprocesar imágenes, subir `IMG_V` en `src/data/proyectos.js`. `proyecto-imagenes.js` sigue sirviendo para exportar vistas sueltas, pero
el sitio consume las láminas.

### Logotipos de cliente

Cada proyecto muestra un cuadro pequeño con el logo del cliente. Se preparan con:

```bash
node logos-clientes.js gitc=<ruta> idom=<ruta>
```

que los recorta y los convierte en silueta negra sobre transparente (`public/clientes/`),
para mostrarlos en gris al 75 % sin que peleen con la paleta. Los originales salieron de
archivos del propio proyecto: **GITC** estaba embebido en la familia de rótulo del modelo
(se extrae con `ImageType.GetImage()` tras `doc.EditFamily`), **IDOM** venía en los DWG
de entrega. Copia de ambos en `WEBPAGE-BIMPOOL / 01_MARCA / 05_LOGOS CLIENTES`.

### Proyectos publicados

- **clinica** · Clínica y Centro Médico Dental, cliente GITC, arquitectura, 14 niveles.
  Vistas generadas en Revit con las plantillas `bimpool_3D Exterior` / `bimpool_3D Interior`
  (limpias, sin anotación ni topografía, vínculo STR visible, sombras heredadas de `{3D}`).
  Cuatro perspectivas desde las esquinas del ViewCube + una axonometría cortada por nivel.
  Las vistas quedan agrupadas en el navegador bajo `VISTAS 3D` (parámetro *Categoria Vista*).
- **scfa** · Aeropuerto Andrés Sabella, cliente IDOM, corrientes débiles, 16 edificios.

Ningún mandante final se nombra en el sitio: el cuadro muestra la oficina que contrata.

## Deploy

El sitio se publica en **Cloudflare Pages** (plan Free, que sí permite uso comercial), build `npm run build`, salida `dist/`. No necesita adapter.

El proyecto de Vercel y su `vercel.json` siguen en el repo hasta confirmar que Cloudflare quedó estable; después se borran.

## Visibilidad en buscadores

El sitio está **abierto a los buscadores** desde el 18-11-2026 (antes estuvo bloqueado por
decisión del 02-10-2026). El bloqueo usa tres piezas, un solo interruptor y una excepción:

| Dónde | Qué hace |
|---|---|
| `src/consts.js` → `INDEXABLE` | El interruptor. `false` = no indexar. |
| `src/layouts/Base.astro` | Con `INDEXABLE` en `false` emite `<meta name="robots" content="noindex, nofollow">`. |
| `src/pages/robots.txt.js` | Genera el `robots.txt`: `Disallow: /` cuando está bloqueado. |
| `public/_headers` | Cabecera `X-Robots-Tag: noindex, nofollow` en **todas** las respuestas de Cloudflare Pages — cubre imágenes y archivos, que no tienen `<head>`. **Es un archivo estático y no lee `INDEXABLE`: hay que editarlo a mano.** |

Para volver a bloquear: `INDEXABLE = false` y, en el mismo commit, restaurar el bloque
comentado en `public/_headers`. `vercel.json` mantiene `noindex` a propósito: así la copia
de Vercel (*.vercel.app) no compite con bimpool.cl como contenido duplicado.

Ojo con el orden: `Disallow: /` impide que Google *lea* la página, y por lo tanto también
el `noindex` del `<head>`. Una URL ya conocida puede seguir apareciendo como resultado sin
descripción. Para sacar algo que ya esté indexado, usar la retirada de URL de Search
Console; `robots.txt` solo evita que entren nuevas.

## Identidad visual

Paleta corporativa (tokens en `src/styles/global.css`, no usar hex sueltos en componentes):

| Rol | Token | HEX | Uso |
|---|---|---|---|
| Principal 60% | `--primary` | `#1A2942` | hero, footer, títulos, panel "Nosotros" |
| Secundario 30% | `--secondary` | `#A7B0BF` | texto sobre fondo oscuro, portadas |
| Acento 10% | `--accent` | `#FF6B35` | botones, eyebrows, punto del isotipo |
| Acento hover | `--accent-dark` | `#D9501F` | hover de botones (sobre el fondo azul el texto naranja usa `--accent`) |
| Neutro | `--neutral` | `#F7F9FC` | fondo de secciones alternas |

Tema: **fondo azul institucional** en todo el sitio (desde 26-11-2026). `--bg` = `--primary`,
`--bg-soft` = `#1F304D` (secciones alternas), `--surface` para tarjetas, texto `--ink`/`--heading` blanco
y `--muted` gris azulado. Logos de cliente se invierten a blanco con `filter: invert(1)`.

Tipografía del sitio: **DM Sans** (Google Fonts), la misma del wordmark.

### Logotipo «Origen»

Isotipo: tres ejes (X/Y/Z en isométrica) que nacen de un punto naranja. Wordmark: `bimpool` en
minúsculas, DM Sans 500, tracking −3,5 %, **convertido a trazados** (no depende de la fuente).

Kit en `public/brand/` — todo generado por un script, no editar a mano:
- `bimpool-isotipo{,-blanco,-mono,-tile}.svg` — solo, sobre oscuro, un color, y en tile navy (favicon / app).
- `bimpool-logo-horizontal{,-blanco,-mono,-mono-blanco}.svg` — lockup principal.
- `bimpool-logo-vertical{,-blanco}.svg` — isotipo sobre wordmark.
- PNG de alta resolución de los principales; `og-image.png` (1200×630) en `public/`.

Regenerar: el script está en `tools/brandkit/build.js` (Node + opentype.js + sharp; necesita
`dmsans500.ttf` al lado). `node build.js ../../public/brand` reescribe todo el kit.
