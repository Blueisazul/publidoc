import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import assert from 'node:assert';

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content', 'docs');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const RAW_ENDPOINT_FILE = path.join(ROOT_DIR, 'src', 'pages', 'd', '[id]', 'raw.md.ts');

console.log('=== SUITE DE PRUEBAS AUTOMATIZADAS — FASE 2 ===\n');

// 1. COMPILACIÓN OBLIGATORIA SIEMPRE AL INICIO
console.log('📦 Ejecutando compilación obligatoria limpia al inicio de la suite...');
execSync('npm run build', { stdio: 'inherit' });
console.log('✓ Compilación inicial completada.\n');

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

const docFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
assert(docFiles.length >= 3, `Deben existir al menos 3 documentos en src/content/docs (actuales: ${docFiles.length})`);

// TEST 1: Verificación independiente de documentos fuente (UTF-8, sin BOM, saltos LF)
runTest('1. Verificación independiente de documentos fuente (UTF-8 válido, sin BOM, saltos LF)', () => {
  for (const file of docFiles) {
    const srcPath = path.join(CONTENT_DIR, file);
    const buf = fs.readFileSync(srcPath);

    // Verificación de ausencia de BOM
    const hasBOM = buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
    assert(!hasBOM, `El archivo fuente ${file} contiene BOM`);

    // Verificación de UTF-8 estricto
    const decoder = new TextDecoder('utf-8', { fatal: true });
    let text;
    try {
      text = decoder.decode(buf);
    } catch (e) {
      assert.fail(`El archivo fuente ${file} no tiene codificación UTF-8 válida: ${e.message}`);
    }
    assert(!text.includes('\uFFFD'), `El archivo fuente ${file} contiene caracteres corruptos de reemplazo (U+FFFD)`);

    // Verificación estricta de saltos de línea LF (ausencia de \r y \r\n)
    const hasCR = buf.includes(0x0D);
    assert(!hasCR, `El archivo fuente ${file} contiene retornos de carro CRLF o CR; debe ser estrictamente LF`);
  }
});

// TEST 2: Consistencia de UUID v4 (RFC 4122) comprobando la implementación real del endpoint
runTest('2. Consistencia e implementación real de UUID v4 en raw.md.ts', () => {
  const EXPECTED_REGEX_STR = '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';
  
  // Inspeccionar el código fuente real del endpoint raw.md.ts
  const endpointSource = fs.readFileSync(RAW_ENDPOINT_FILE, 'utf-8');
  assert(
    endpointSource.includes(EXPECTED_REGEX_STR),
    `El endpoint raw.md.ts no define la expresión regular esperada de UUID v4: ${EXPECTED_REGEX_STR}`
  );
  assert(
    endpointSource.includes('UUID_V4_REGEX.test(docId)'),
    'El endpoint raw.md.ts no valida docId mediante UUID_V4_REGEX.test'
  );

  // Expresión regular canónica extraída directamente
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // Comprobar que los identificadores de todos los documentos fuente cumplen estrictamente UUID v4
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    assert(uuidV4Regex.test(id), `El ID ${id} no es un UUID v4 válido (RFC 4122)`);
  }

  // Comprobar que rechaza explícitamente ataques de path traversal, UUIDs v1/v3/v5 y slugs
  const invalidCases = [
    '../../etc/passwd',
    '3f5a2b10-7e4d-1c3a-9b1f-6a8e5d2c9b4a', // v1 (el 3er bloque empieza en 1, no 4)
    '3f5a2b10-7e4d-5c3a-9b1f-6a8e5d2c9b4a', // v5 (el 3er bloque empieza en 5, no 4)
    '3f5a2b10-7e4d-4c3a-3b1f-6a8e5d2c9b4a', // variante inválida (el 4to bloque empieza en 3, no en [89ab])
    'slug-arbitrario',
    '12345',
    ''
  ];

  for (const invalid of invalidCases) {
    assert(!uuidV4Regex.test(invalid), `El patrón no rechazó el identificador inválido: "${invalid}"`);
  }
});

// TEST 3: Existencia de la página HTML para cada documento
runTest('3. Existencia de la página HTML para cada documento', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const htmlPath = path.join(DIST_DIR, 'd', id, 'index.html');
    assert(fs.existsSync(htmlPath), `No existe el archivo HTML: ${htmlPath}`);
    const stat = fs.statSync(htmlPath);
    assert(stat.size > 500, `El archivo HTML ${htmlPath} es sospechosamente pequeño (${stat.size} bytes)`);
  }
});

// TEST 4: Existencia del archivo Markdown estático raw.md para cada documento
runTest('4. Existencia del archivo Markdown estático raw.md para cada documento', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const rawPath = path.join(DIST_DIR, 'd', id, 'raw.md');
    assert(fs.existsSync(rawPath), `No existe el archivo raw.md: ${rawPath}`);
    const stat = fs.statSync(rawPath);
    assert(stat.size > 0, `El archivo raw.md ${rawPath} está vacío`);
  }
});

// TEST 5: Igualdad byte a byte estricta entre origen y dist sin normalización alguna
runTest('5. Igualdad byte a byte estricta (Buffer.compare === 0) sin normalización alguna', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const srcBuf = fs.readFileSync(path.join(CONTENT_DIR, file));
    const distBuf = fs.readFileSync(path.join(DIST_DIR, 'd', id, 'raw.md'));

    assert.strictEqual(
      srcBuf.length,
      distBuf.length,
      `Longitud de buffers distinta para ${id} (fuente: ${srcBuf.length}, dist: ${distBuf.length})`
    );

    const diff = Buffer.compare(srcBuf, distBuf);
    assert.strictEqual(
      diff,
      0,
      `Los bytes del archivo generado dist/d/${id}/raw.md difieren de src/content/docs/${file} (Buffer.compare = ${diff})`
    );
  }
});

// TEST 6: Conservación del frontmatter YAML en el archivo generado
runTest('6. Conservación íntegra del frontmatter YAML en el archivo generado', () => {
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

// TEST 7: Correcta codificación UTF-8 en dist/d/[id]/raw.md
runTest('7. Correcta codificación UTF-8 en dist/d/[id]/raw.md', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const rawPath = path.join(DIST_DIR, 'd', id, 'raw.md');
    const buf = fs.readFileSync(rawPath);
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const text = decoder.decode(buf);
    assert(!text.includes('\uFFFD'), `El documento generado ${id} contiene caracteres corruptos de reemplazo (U+FFFD)`);
  }
});

// TEST 8: Ausencia total de BOM (0xEF, 0xBB, 0xBF) en dist/d/[id]/raw.md
runTest('8. Ausencia total de BOM (0xEF, 0xBB, 0xBF) en dist/d/[id]/raw.md', () => {
  for (const file of docFiles) {
    const id = path.basename(file, '.md');
    const rawPath = path.join(DIST_DIR, 'd', id, 'raw.md');
    const buf = fs.readFileSync(rawPath);
    const hasBOM = buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;
    assert(!hasBOM, `El archivo generado ${rawPath} contiene BOM no deseado`);
  }
});

// TEST 9: Funcionamiento con títulos y contenido en español
runTest('9. Funcionamiento correcto con acentos, eñes y signos de apertura en español', () => {
  const spanishDocId = '3f5a2b10-7e4d-4c3a-9b1f-6a8e5d2c9b4a';
  const rawContent = fs.readFileSync(path.join(DIST_DIR, 'd', spanishDocId, 'raw.md'), 'utf-8');
  const htmlContent = fs.readFileSync(path.join(DIST_DIR, 'd', spanishDocId, 'index.html'), 'utf-8');
  
  assert(rawContent.includes('Guía de Inicio Rápido'), 'Falta título con acento en raw.md');
  assert(rawContent.includes('¿Qué ventajas ofrece este sistema?'), 'Faltan signos de apertura en raw.md');
  assert(rawContent.includes('¡Documentación clara, rápida y sin fricción!'), 'Falta exclamación y tildes en raw.md');
  assert(htmlContent.includes('Guía de Inicio Rápido'), 'Falta título con tilde en HTML');
  assert(htmlContent.includes('¿Qué ventajas ofrece este sistema?'), 'Falta pregunta con signo de apertura en HTML');
});

// TEST 10: Preservación de emojis y símbolos especiales
runTest('10. Preservación íntegra de emojis y símbolos matemáticos/especiales', () => {
  const emojiDocId = 'b7c9e1f2-4a3d-4e5f-8b2a-1c3d5e7f9a0b';
  const rawContent = fs.readFileSync(path.join(DIST_DIR, 'd', emojiDocId, 'raw.md'), 'utf-8');
  const htmlContent = fs.readFileSync(path.join(DIST_DIR, 'd', emojiDocId, 'index.html'), 'utf-8');

  const specialChars = ['🚀', '✨', '🔥', '🤖', '🧠', '✅', '€150', '© 2026', '«Texto entre comillas españolas»'];
  for (const char of specialChars) {
    assert(rawContent.includes(char), `raw.md perdió el caracter especial: ${char}`);
    assert(htmlContent.includes(char), `HTML perdió el caracter especial: ${char}`);
  }
});

// TEST 11: Funcionamiento con documentos largos y estructuras complejas
runTest('11. Funcionamiento correcto con documentos extensos (>2 KB, tablas y código)', () => {
  const longDocId = 'd4e5f6a7-1b2c-4d3e-8f9a-0b1c2d3e4f5a';
  const rawContent = fs.readFileSync(path.join(DIST_DIR, 'd', longDocId, 'raw.md'), 'utf-8');
  const htmlContent = fs.readFileSync(path.join(DIST_DIR, 'd', longDocId, 'index.html'), 'utf-8');

  assert(rawContent.length > 2000, `El documento raw debe superar 2KB (longitud actual: ${rawContent.length})`);
  assert(rawContent.includes('| `/d/[id]/` | `GET` | 200 OK |'), 'Falta tabla markdown en raw.md');
  assert(rawContent.includes('interface DocumentMetadata'), 'Falta bloque de código typescript en raw.md');
  assert(htmlContent.includes('<table>'), 'El HTML no renderizó la tabla Markdown');
  assert(htmlContent.includes('DocumentMetadata') && htmlContent.includes('interface'), 'El HTML no renderizó el código');
});

// TEST 12: Compilación limpia sin documentos (aislamiento seguro fuera del proyecto en os.tmpdir)
runTest('12. Compilación limpia cuando la colección no tiene documentos (con restauración segura en os.tmpdir)', () => {
  const tempBackupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'publidoc-docs-safe-backup-'));

  try {
    // Copiar documentos al directorio temporal del sistema operativo (completamente fuera del repo)
    for (const file of fs.readdirSync(CONTENT_DIR)) {
      fs.copyFileSync(path.join(CONTENT_DIR, file), path.join(tempBackupDir, file));
    }

    // Vaciar CONTENT_DIR para simular colección sin documentos
    for (const file of fs.readdirSync(CONTENT_DIR)) {
      fs.unlinkSync(path.join(CONTENT_DIR, file));
    }

    // Ejecutar compilación con colección vacía
    execSync('npm run build', { stdio: 'pipe' });

    // Verificar que el índice se construyó con el mensaje correspondiente
    const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
    assert(indexHtml.includes('No hay documentos publicados en este momento.'), 'El índice vacío no muestra el mensaje esperado');
  } finally {
    // Restaurar incondicionalmente los documentos originales desde el backup temporal
    if (fs.existsSync(tempBackupDir)) {
      for (const file of fs.readdirSync(tempBackupDir)) {
        fs.copyFileSync(path.join(tempBackupDir, file), path.join(CONTENT_DIR, file));
      }
      fs.rmSync(tempBackupDir, { recursive: true, force: true });
    }
  }
});

// TEST 13: Respeto de BASE_PATH en GitHub Pages
runTest('13. Respeto de BASE_PATH para subrutas en GitHub Pages', () => {
  try {
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
    // Recompilar en modo estándar para dejar dist/ listo y en estado óptimo
    execSync('npm run build', { stdio: 'pipe' });
  }
});

// COMPROBACIONES FINALES POST-SUITE
console.log('\n--- VERIFICACIONES DE CIERRE ---');
const postFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
assert.strictEqual(postFiles.length, docFiles.length, `ERROR CRÍTICO: Los documentos fuente no quedaron íntegros (esperados: ${docFiles.length}, encontrados: ${postFiles.length})`);
console.log(`✓ Integridad de fuentes: Los ${postFiles.length} documentos siguen presentes en ${CONTENT_DIR}`);

for (const file of postFiles) {
  const id = path.basename(file, '.md');
  const srcBuf = fs.readFileSync(path.join(CONTENT_DIR, file));
  const distBuf = fs.readFileSync(path.join(DIST_DIR, 'd', id, 'raw.md'));
  const diff = Buffer.compare(srcBuf, distBuf);
  assert.strictEqual(diff, 0, `ERROR CRÍTICO: dist/d/${id}/raw.md no mantiene igualdad binaria`);
}
console.log('✓ Igualdad binaria verificada: todos los dist/d/[id]/raw.md son bit-exactos con sus fuentes.');

console.log(`\n======================================================`);
console.log(`RESUMEN: ${passedTests}/${totalTests} pruebas superadas exitosamente.`);
console.log(`======================================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
