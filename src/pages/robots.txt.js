import { INDEXABLE } from "../consts.js";

// Sin integración de sitemap en el proyecto: no se anuncia ninguno.
const bloqueado = `# bimpool — sitio en preparación, sin difusión pública todavía.
User-agent: *
Disallow: /
`;

const abierto = `User-agent: *
Allow: /
`;

export function GET() {
  return new Response(INDEXABLE ? abierto : bloqueado, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
