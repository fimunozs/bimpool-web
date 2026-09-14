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

- `contacto@bimpool.cl`, `+56 9 0000 0000` / `wa.me/56900000000` — datos reales.
- `Contact.astro` → `FORM_ENDPOINT`: poner el id de Formspree; hasta entonces el form usa `mailto:`.
- `Projects.astro` — proyectos y fotos reales (las portadas son placeholders de color).
- `Hero.astro` → `stats` — cifras reales.
- `astro.config.mjs` → `site` — dominio definitivo.

## Deploy

Vercel detecta Astro automáticamente (`npm run build`, output `dist/`). No necesita adapter.

## Identidad visual

Paleta corporativa (tokens en `src/styles/global.css`, no usar hex sueltos en componentes):

| Rol | Token | HEX | Uso |
|---|---|---|---|
| Principal 60% | `--primary` | `#1A2942` | hero, footer, títulos, panel "Nosotros" |
| Secundario 30% | `--secondary` | `#A7B0BF` | texto sobre fondo oscuro, portadas, cara del cubo |
| Acento 10% | `--accent` | `#FF6B35` | botones, eyebrows, "pool" del logotipo |
| Acento texto | `--accent-dark` | `#D9501F` | naranja para texto pequeño sobre blanco (contraste AA) |
| Neutro | `--neutral` | `#F7F9FC` | fondo de secciones alternas |

Logotipo en `public/brand/`: `bimpool-isotipo.svg` (cubo isométrico), `bimpool-logo-horizontal.svg`
(fondo claro) y `bimpool-logo-horizontal-blanco.svg` (fondo oscuro). El wordmark usa texto SVG con
Inter; para imprenta conviene convertirlo a trazados. `public/logo.svg` y `favicon.svg` son copias
del isotipo.
