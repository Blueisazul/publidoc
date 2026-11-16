import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = true;

// Expresión regular canónica para UUID v4 (RFC 4122)
export const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getStaticPaths() {
  const docs = await getCollection('docs');
  return docs.map((doc) => ({
    params: { id: doc.id },
    props: { docId: doc.id },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { docId } = props as { docId: string };

  // Validar formato UUID v4 estricto para prevenir inyecciones o rutas no válidas
  if (!docId || !UUID_V4_REGEX.test(docId)) {
    return new Response('Identificador de documento no válido', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  const filePath = path.resolve(process.cwd(), 'src/content/docs', `${docId}.md`);

  if (!fs.existsSync(filePath)) {
    return new Response('Documento no encontrado', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  // Lectura binaria pura mediante Buffer sin mutaciones (sin alterar BOM ni saltos de línea)
  const buffer = fs.readFileSync(filePath);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
