import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = true;

export async function getStaticPaths() {
  const docs = await getCollection('docs');
  return docs.map((doc) => ({
    params: { id: doc.id },
    props: { docId: doc.id },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { docId } = props as { docId: string };
  const filePath = path.resolve(process.cwd(), 'src/content/docs', `${docId}.md`);

  if (!fs.existsSync(filePath)) {
    return new Response('Documento no encontrado', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  // Leer el archivo original íntegramente
  let rawContent = fs.readFileSync(filePath, 'utf-8');

  // Eliminar BOM si estuviera presente
  if (rawContent.charCodeAt(0) === 0xFEFF) {
    rawContent = rawContent.slice(1);
  }

  // Normalizar saltos de línea estrictamente a LF (\n)
  rawContent = rawContent.replace(/\r\n/g, '\n');

  return new Response(rawContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
