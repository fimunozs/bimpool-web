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

`src/components/Projects.astro` muestra un caso destacado más una galería con visor a
pantalla completa (sin librerías: ~60 líneas de JS al final del componente).

Las imágenes **no se editan a mano**. El original vive en Google Drive
(`WEBPAGE-BIMPOOL / 04_MULTIMEDIA / 02_RENDERS Y VISTAS / <proyecto>`) y se procesa con:

```bash
cd tools/brandkit
node proyecto-imagenes.js "<carpeta origen>" <slug>
```

El script recorta el blanco sobrante, exporta WebP en dos tamaños a
`public/proyectos/<slug>/` y escribe `src/data/<slug>.json`, que es lo que importa el
componente. Espera archivos con el patrón `<PROY>_<VISTA>_<CÓDIGO>_<Nombre>.png`.

Hoy hay un proyecto: **SCFA · Aeropuerto Andrés Sabella** (16 edificios, corrientes
débiles, en desarrollo). El mandante no se nombra en el sitio a propósito.

## Deploy

Vercel detecta Astro automáticamente (`npm run build`, output `dist/`). No necesita adapter.

## Identidad visual

Paleta corporativa (tokens en `src/styles/global.css`, no usar hex sueltos en componentes):

| Rol | Token | HEX | Uso |
|---|---|---|---|
| Principal 60% | `--primary` | `#1A2942` | hero, footer, títulos, panel "Nosotros" |
| Secundario 30% | `--secondary` | `#A7B0BF` | texto sobre fondo oscuro, portadas |
| Acento 10% | `--accent` | `#FF6B35` | botones, eyebrows, punto del isotipo |
| Acento texto | `--accent-dark` | `#D9501F` | naranja para texto pequeño sobre blanco (contraste AA) |
| Neutro | `--neutral` | `#F7F9FC` | fondo de secciones alternas |

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
