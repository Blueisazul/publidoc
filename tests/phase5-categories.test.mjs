import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const CATEGORIES_DIR = path.join(ROOT_DIR, 'src', 'content', 'categories');
const DOCS_DIR = path.join(ROOT_DIR, 'src', 'content', 'docs');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const CONFIG_FILE = path.join(ROOT_DIR, 'public', 'admin', 'config.yml');

console.log('=== SUITE DE PRUEBAS — FASE 5 Y 6: SISTEMA DE CATEGORÍAS Y PORTADA ===\n');

// 1. Asegurar compilación limpia
console.log('📦 Compilando proyecto con Astro...');
execSync('npm run build', { stdio: 'pipe' });
console.log('✓ Compilación completada.\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [TEST ${totalTests}] ${name}: PASSED`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [TEST ${totalTests}] ${name}: FAILED`);
    console.error(err);
    process.exitCode = 1;
  }
}

// TEST 1: Existencia e integridad de categorías
runTest('1. La colección de categorías existe y contiene categorías válidas', () => {
  assert(fs.existsSync(CATEGORIES_DIR), 'No existe el directorio src/content/categories');
  const catFiles = fs.readdirSync(CATEGORIES_DIR).filter(f => f.endsWith('.md'));
  assert(catFiles.length >= 4, `Se esperaban al menos 4 categorías, encontradas: ${catFiles.length}`);

  const seenSlugs = new Set();
  const seenOrders = new Set();

  for (const file of catFiles) {
    const slug = path.basename(file, '.md');
    assert(!seenSlugs.has(slug), `Slug de categoría duplicado: ${slug}`);
    seenSlugs.add(slug);

    const content = fs.readFileSync(path.join(CATEGORIES_DIR, file), 'utf8');
    assert(content.startsWith('---\n'), `La categoría ${file} no tiene delimitador frontmatter`);
    assert(content.includes('name:'), `La categoría ${file} no tiene nombre`);
    assert(content.includes('order:'), `La categoría ${file} no tiene order`);

    // Validar orden numérico
    const orderMatch = content.match(/order:\s*(\d+)/);
    assert(orderMatch, `La categoría ${file} no tiene orden numérico válido`);
    const orderNum = parseInt(orderMatch[1], 10);
    assert(!isNaN(orderNum), `Orden inválido en ${file}`);
  }
});

// TEST 2: Integridad referencial de categorías en documentos
runTest('2. Todos los documentos referencian una categoría existente y válida', () => {
  const catSlugs = new Set(
    fs.readdirSync(CATEGORIES_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => path.basename(f, '.md'))
  );

  const docFiles = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));
  assert(docFiles.length >= 4, 'Deben existir al menos 4 documentos');

  for (const file of docFiles) {
    const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
    const catMatch = content.match(/category:\s*["']?([a-zA-Z0-9_-]+)["']?/);
    assert(catMatch, `El documento ${file} no define un campo category válido`);

    const assignedCategory = catMatch[1];
    assert(
      catSlugs.has(assignedCategory),
      `El documento ${file} referencia la categoría inexistente "${assignedCategory}". Categorías válidas: ${[...catSlugs].join(', ')}`
    );
  }
});

// TEST 3: Configuración de Sveltia CMS para categorías
runTest('3. public/admin/config.yml define la colección y el widget de relación', () => {
  const config = fs.readFileSync(CONFIG_FILE, 'utf8');

  // Colección categories
  assert(config.includes('name: "categories"'), 'Falta colección categories en config.yml');
  assert(config.includes('folder: "src/content/categories"'), 'Falta folder categories en config.yml');

  // Widget relación en docs
  assert(config.includes('widget: "relation"'), 'Falta widget relation en config.yml');
  assert(config.includes('collection: "categories"'), 'El widget relation no apunta a categories');
  assert(config.includes('value_field: "{{slug}}"'), 'El widget relation no usa value_field: "{{slug}}"');

  // Widget markdown en modo raw preferente
  assert(config.includes('widget: "markdown"'), 'Falta widget markdown en docs');
  assert(config.includes('modes:'), 'Falta configuración modes en widget markdown');
  assert(config.includes('- "raw"'), 'Falta raw como primer modo en markdown');
});

// TEST 4: Portada con enlace /admin/, filtros y agrupación
runTest('4. dist/index.html contiene acceso a /admin/, filtros y grupos de categorías', () => {
  const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

  // Enlace discreto a /admin/
  assert(indexHtml.includes('href="/admin/"') || indexHtml.includes('href="./admin/"'), 'Falta enlace a /admin/ en portada');
  assert(indexHtml.includes('Administrar'), 'Falta texto o label Administrar');

  // Filtros de categorías
  assert(indexHtml.includes('class="filter-btn active"'), 'Falta botón de filtro activo por defecto');
  assert(indexHtml.includes('data-category="all"'), 'Falta filtro "all" (Todas)');

  const catSlugs = fs.readdirSync(CATEGORIES_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => path.basename(f, '.md'));

  for (const slug of catSlugs) {
    assert(indexHtml.includes(`data-category="${slug}"`), `Falta botón de filtro para categoría: ${slug}`);
    assert(indexHtml.includes(`data-category-id="${slug}"`), `Falta contenedor de grupo para categoría: ${slug}`);
  }

  // Script de filtrado en cliente
  assert(indexHtml.includes('setupCategoryFilters'), 'Falta script cliente de filtrado interactivo');
});

// TEST 5: Documento normalizado WO-EVO-32 conserva paridad y no tiene escapes accidentales
runTest('5. El documento ee1ebcb3 (WO-EVO-32) renderiza encabezados HTML semánticos', () => {
  const docId = 'ee1ebcb3-b350-4854-9930-959624859807';
  const docHtml = fs.readFileSync(path.join(DIST_DIR, 'd', docId, 'index.html'), 'utf8');
  const rawMd = fs.readFileSync(path.join(DIST_DIR, 'd', docId, 'raw.md'), 'utf8');

  // Comprobar que en HTML se generan encabezados h2 y h3 (no texto plano con \#)
  assert(docHtml.includes('<h2>') || docHtml.includes('<h2 '), 'El documento normalizado no generó etiquetas <h2>');
  assert(docHtml.includes('<h3>') || docHtml.includes('<h3 '), 'El documento normalizado no generó etiquetas <h3>');
  assert(!docHtml.includes('p>\\# INFORME'), 'El HTML sigue conteniendo texto plano con \\#');

  // Comprobar que raw.md contiene el markdown canónico limpio
  assert(rawMd.includes('# INFORME DE EJECUCIÓN'), 'raw.md no contiene el encabezado limpio #');
  assert(rawMd.includes('category: "evocara"'), 'raw.md no contiene la categoría evocara');
});

console.log(`\n======================================================`);
console.log(`RESUMEN: ${passedTests}/${totalTests} pruebas superadas exitosamente.`);
console.log(`======================================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
