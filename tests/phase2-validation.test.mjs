import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import assert from 'node:assert';

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content', 'docs');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('=== SUITE DE PRUEBAS AUTOMATIZADAS — FASE 2 ===\n');

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

// Asegurar que dist existe o compilarlo
if (!fs.existsSync(DIST_DIR)) {
  console.log('Compilando proyecto para pruebas...');
  execSync('npm run build', { stdio: 'inherit' });
}

const docFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
assert(docFiles.length >= 3, 'Debe haber al menos 3 documentos de prueba en src/content/docs');

// TEST 1: Existencia de la página HTML
runTest('1. Existencia de la página HTML para cada documento', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const htmlPath = path.join(DIST_DIR, 'd', id, 'index.html');
    assert(fs.existsSync(htmlPath), `No existe el archivo HTML: ${htmlPath}`);
    const stat = fs.statSync(htmlPath);
    assert(stat.size > 500, `El archivo HTML ${htmlPath} es sospechosamente pequeño (${stat.size} bytes)`);
  }
});

// TEST 2: Existencia del archivo Markdown
runTest('2. Existencia del archivo Markdown estático raw.md para cada documento', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const rawPath = path.join(DIST_DIR, 'd', id, 'raw.md');
    assert(fs.existsSync(rawPath), `No existe el archivo raw.md: ${rawPath}`);
    const stat = fs.statSync(rawPath);
    assert(stat.size > 0, `El archivo raw.md ${rawPath} está vacío`);
  }
});

// TEST 3: Igualdad byte a byte entre el Markdown original y el generado
runTest('3. Igualdad byte a byte entre Markdown original y dist/d/[id]/raw.md', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const srcBuf = fs.readFileSync(path.join(CONTENT_DIR, file));
    const distBuf = fs.readFileSync(path.join(DIST_DIR, 'd', id, 'raw.md'));
    assert(srcBuf.equals(distBuf), `Los bytes del documento ${id} difieren entre fuente y dist`);
  }
});

// TEST 4: Conservación del frontmatter YAML
runTest('4. Conservación íntegra del frontmatter YAML', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const distContent = fs.readFileSync(path.join(DIST_DIR, 'd', id, 'raw.md'), 'utf-8');
    assert(distContent.startsWith('---\n'), `El documento ${id} no inicia con delimitador YAML frontmatter`);
    const secondDelim = distContent.indexOf('\n---\n', 4);
    assert(secondDelim !== -1, `El documento ${id} no cierra el frontmatter YAML adecuadamente`);
    const frontmatter = distContent.substring(4, secondDelim);
    assert(frontmatter.includes('title:'), `El frontmatter de ${id} no contiene title`);
    assert(frontmatter.includes('createdAt:'), `El frontmatter de ${id} no contiene createdAt`);
    assert(frontmatter.includes('updatedAt:'), `El frontmatter de ${id} no contiene updatedAt`);
  }
});

// TEST 5: Correcta codificación UTF-8
runTest('5. Correcta codificación UTF-8 sin caracteres de reemplazo', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const rawPath = path.join(DIST_DIR, 'd', id, 'raw.md');
    const buf = fs.readFileSync(rawPath);
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const text = decoder.decode(buf);
    assert(!text.includes('\uFFFD'), `El documento ${id} contiene caracteres corruptos de reemplazo UTF-8 (U+FFFD)`);
  }
});

// TEST 6: Ausencia de BOM (Byte Order Mark)
runTest('6. Ausencia total de BOM (0xEF, 0xBB, 0xBF)', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const rawPath = path.join(DIST_DIR, 'd', id, 'raw.md');
    const buf = fs.readFileSync(rawPath);
    const hasBOM = buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
    assert(!hasBOM, `El archivo ${rawPath} contiene BOM no deseado`);
  }
});

// TEST 7: Funcionamiento con títulos y contenido en español
runTest('7. Funcionamiento correcto con acentos, eñes y signos de apertura en español', () => {
  const spanishDocId = '3f5a2b10-7e4d-4c3a-9b1f-6a8e5d2c9b4a';
  const rawContent = fs.readFileSync(path.join(DIST_DIR, 'd', spanishDocId, 'raw.md'), 'utf-8');
  const htmlContent = fs.readFileSync(path.join(DIST_DIR, 'd', spanishDocId, 'index.html'), 'utf-8');
  
  assert(rawContent.includes('Guía de Inicio Rápido'), 'Falta título con acento en raw.md');
  assert(rawContent.includes('¿Qué ventajas ofrece este sistema?'), 'Faltan signos de apertura en raw.md');
  assert(rawContent.includes('¡Documentación clara, rápida y sin fricción!'), 'Falta exclamación y tildes en raw.md');
  assert(htmlContent.includes('Guía de Inicio Rápido'), 'Falta título con tilde en HTML');
  assert(htmlContent.includes('¿Qué ventajas ofrece este sistema?'), 'Falta pregunta con signo de apertura en HTML');
});

// TEST 8: Funcionamiento con emojis y caracteres especiales
runTest('8. Preservación íntegra de emojis y símbolos matemáticos/especiales', () => {
  const emojiDocId = 'b7c9e1f2-4a3d-4e5f-8b2a-1c3d5e7f9a0b';
  const rawContent = fs.readFileSync(path.join(DIST_DIR, 'd', emojiDocId, 'raw.md'), 'utf-8');
  const htmlContent = fs.readFileSync(path.join(DIST_DIR, 'd', emojiDocId, 'index.html'), 'utf-8');

  const specialChars = ['🚀', '✨', '🔥', '🤖', '🧠', '✅', '€150', '© 2026', '«Texto entre comillas españolas»'];
  for (const char of specialChars) {
    assert(rawContent.includes(char), `raw.md perdió el caracter especial: ${char}`);
    assert(htmlContent.includes(char), `HTML perdió el caracter especial: ${char}`);
  }
});

// TEST 9: Funcionamiento con documentos largos y estructuras complejas
runTest('9. Funcionamiento correcto con documentos extensos (>2 KB, tablas y código)', () => {
  const longDocId = 'd4e5f6a7-1b2c-4d3e-8f9a-0b1c2d3e4f5a';
  const rawContent = fs.readFileSync(path.join(DIST_DIR, 'd', longDocId, 'raw.md'), 'utf-8');
  const htmlContent = fs.readFileSync(path.join(DIST_DIR, 'd', longDocId, 'index.html'), 'utf-8');

  assert(rawContent.length > 2000, `El documento raw debe superar 2KB (longitud actual: ${rawContent.length})`);
  assert(rawContent.includes('| `/d/[id]/` | `GET` | 200 OK |'), 'Falta tabla markdown en raw.md');
  assert(rawContent.includes('interface DocumentMetadata'), 'Falta bloque de código typescript en raw.md');
  assert(htmlContent.includes('<table>'), 'El HTML no renderizó la tabla Markdown');
  assert(htmlContent.includes('DocumentMetadata') && htmlContent.includes('interface'), 'El HTML no renderizó el código');
});

// TEST 10: Compilación limpia sin documentos
runTest('10. Compilación limpia cuando la colección no tiene documentos', () => {
  const tempBackupDir = path.join(ROOT_DIR, 'src', 'content', '__docs_backup__');
  try {
    // Mover temporalmente los documentos
    fs.renameSync(CONTENT_DIR, tempBackupDir);
    fs.mkdirSync(CONTENT_DIR, { recursive: true });

    // Ejecutar compilación con colección vacía
    execSync('npm run build', { stdio: 'pipe' });

    // Verificar que index.html se construyó sin errores
    const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
    assert(indexHtml.includes('No hay documentos publicados en este momento.'), 'El índice vacío no muestra el mensaje esperado');
  } finally {
    // Restaurar los documentos
    if (fs.existsSync(tempBackupDir)) {
      if (fs.existsSync(CONTENT_DIR)) {
        fs.rmSync(CONTENT_DIR, { recursive: true, force: true });
      }
      fs.renameSync(tempBackupDir, CONTENT_DIR);
    }
  }
});

// TEST 11: Respeto de BASE_PATH en GitHub Pages
runTest('11. Respeto de BASE_PATH para subrutas en GitHub Pages', () => {
  try {
    // Compilar con BASE_PATH personalizado
    execSync('npm run build', {
      stdio: 'pipe',
      env: {
        ...process.env,
        SITE_URL: 'https://usuario.github.io',
        BASE_PATH: '/publidoc',
      },
    });

    const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
    assert(indexHtml.includes('/publidoc/d/3f5a2b10-7e4d-4c3a-9b1f-6a8e5d2c9b4a/'), 'El índice no respeta BASE_PATH en enlaces HTML');
    assert(indexHtml.includes('/publidoc/d/3f5a2b10-7e4d-4c3a-9b1f-6a8e5d2c9b4a/raw.md'), 'El índice no respeta BASE_PATH en enlaces raw.md');

    const docHtml = fs.readFileSync(path.join(DIST_DIR, 'd', '3f5a2b10-7e4d-4c3a-9b1f-6a8e5d2c9b4a', 'index.html'), 'utf-8');
    assert(docHtml.includes('href="/publidoc/favicon.svg"'), 'El doc no respeta BASE_PATH en favicon');
    assert(docHtml.includes('/publidoc/d/3f5a2b10-7e4d-4c3a-9b1f-6a8e5d2c9b4a/raw.md'), 'El doc no respeta BASE_PATH en enlace raw');
  } finally {
    // Recompilar para dejar dist/ en estado estándar
    execSync('npm run build', { stdio: 'pipe' });
  }
});

console.log(`\n========================================`);
console.log(`RESUMEN: ${passedTests}/${totalTests} pruebas superadas exitosamente.`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
