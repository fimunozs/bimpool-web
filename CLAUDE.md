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
