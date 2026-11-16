import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import assert from 'node:assert';

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content', 'docs');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ADMIN_DIR = path.join(ROOT_DIR, 'public', 'admin');
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

console.log('=== SUITE DE VALIDACIÓN — FASE 3: SVELTIA CMS ===\n');

// 1. Validar existencia y sintaxis de public/admin/index.html y public/admin/config.yml
console.log('1. Comprobando archivos estáticos del panel de Sveltia CMS...');
assert(fs.existsSync(path.join(ADMIN_DIR, 'index.html')), 'Falta public/admin/index.html');
assert(fs.existsSync(path.join(ADMIN_DIR, 'config.yml')), 'Falta public/admin/config.yml');

const htmlContent = fs.readFileSync(path.join(ADMIN_DIR, 'index.html'), 'utf-8');
assert(htmlContent.includes('@sveltia/cms'), 'index.html no carga la librería @sveltia/cms');
assert(htmlContent.includes('rel="cms-config-url"'), 'index.html no enlaza config.yml de forma relativa');

const yamlContent = fs.readFileSync(path.join(ADMIN_DIR, 'config.yml'), 'utf-8');
assert(yamlContent.includes('backend:'), 'config.yml no define backend');
assert(yamlContent.includes('name: github'), 'config.yml no configura backend de GitHub');
assert(yamlContent.includes('folder: "src/content/docs"'), 'config.yml no apunta a src/content/docs');
assert(yamlContent.includes('template: "{{uuid}}"'), 'config.yml no define plantilla {{uuid}}');
assert(yamlContent.includes('editable: false'), 'config.yml permite editar el slug (debe ser editable: false)');
console.log('✓ Archivos de administración y configuración validados.\n');

// 2. Simulación del ciclo de vida de Sveltia CMS
console.log('2. Iniciando simulación de ciclo de vida (Creación, Edición y Eliminación)...');

// Generar UUID v4 idéntico al emitido por crypto.randomUUID() en Sveltia CMS
const testDocId = crypto.randomUUID();
assert(UUID_V4_REGEX.test(testDocId), 'crypto.randomUUID() no generó un UUID v4 válido');
console.log(`- UUID v4 asignado para nuevo documento: ${testDocId}`);

const testDocPath = path.join(CONTENT_DIR, `${testDocId}.md`);

// PASO A: CREACIÓN
console.log('\n--- PASO A: CREACIÓN DE DOCUMENTO ---');
const createdContent = `---
title: "Documento Creado desde Sveltia CMS"
description: "Documento de prueba para validar el ciclo de vida del CMS."
tags:
  - "sveltia"
  - "cms"
  - "lifecycle"
createdAt: 2026-11-15T21:30:00.000Z
updatedAt: 2026-11-15T21:30:00.000Z
---

# Documento Generado por Sveltia CMS

Este documento valida que el formato de salida de Sveltia CMS es plenamente compatible con Astro y la exportación raw.
`;

fs.writeFileSync(testDocPath, createdContent, { encoding: 'utf-8' });
console.log(`✓ Archivo creado físicamente: ${testDocPath}`);

// Compilar con el nuevo documento
console.log('Ejecutando compilación con documento creado...');
execSync('npm run build', { stdio: 'pipe' });

// Validar que se generaron tanto el HTML como el Markdown raw
const createdHtmlPath = path.join(DIST_DIR, 'd', testDocId, 'index.html');
const createdRawPath = path.join(DIST_DIR, 'd', testDocId, 'raw.md');

assert(fs.existsSync(createdHtmlPath), `No se generó el HTML para el documento creado: ${createdHtmlPath}`);
assert(fs.existsSync(createdRawPath), `No se generó el raw.md para el documento creado: ${createdRawPath}`);

const srcCreatedBuf = fs.readFileSync(testDocPath);
const distCreatedBuf = fs.readFileSync(createdRawPath);
assert.strictEqual(Buffer.compare(srcCreatedBuf, distCreatedBuf), 0, 'El raw.md creado no es bit-exacto con la fuente');
console.log('✓ Documento creado compilado exitosamente y con paridad binaria exacta.');

// PASO B: EDICIÓN (Cambio de título sin mutar el UUID)
console.log('\n--- PASO B: EDICIÓN DE DOCUMENTO (INMUTABILIDAD DE UUID) ---');
const updatedContent = `---
title: "Título Modificado Tras Edición Editorial"
description: "Descripción actualizada tras revisión."
tags:
  - "sveltia"
  - "cms"
  - "editado"
createdAt: 2026-11-15T21:30:00.000Z
updatedAt: 2026-11-15T21:35:00.000Z
---

# Título Modificado Tras Edición Editorial

El contenido y el título han cambiado, pero la ruta y el nombre del archivo permanecen invariables.
`;

// Sobrescribir el mismo archivo (el UUID no cambia aunque cambie el título)
fs.writeFileSync(testDocPath, updatedContent, { encoding: 'utf-8' });
console.log(`✓ Archivo editado sin alterar el nombre del archivo ni el UUID`);

// Recompilar
console.log('Ejecutando compilación tras edición...');
execSync('npm run build', { stdio: 'pipe' });

assert(fs.existsSync(createdHtmlPath), 'La URL HTML cambió tras la edición (debe ser inmutable)');
assert(fs.existsSync(createdRawPath), 'La URL raw.md cambió tras la edición (debe ser inmutable)');

const updatedHtml = fs.readFileSync(createdHtmlPath, 'utf-8');
assert(updatedHtml.includes('Título Modificado Tras Edición Editorial'), 'El HTML no refleja el nuevo título');

const srcUpdatedBuf = fs.readFileSync(testDocPath);
const distUpdatedBuf = fs.readFileSync(createdRawPath);
assert.strictEqual(Buffer.compare(srcUpdatedBuf, distUpdatedBuf), 0, 'El raw.md editado no es bit-exacto');
console.log('✓ Documento editado exitosamente en la misma URL permanente.');

// PASO C: ELIMINACIÓN
console.log('\n--- PASO C: ELIMINACIÓN DE DOCUMENTO ---');
fs.unlinkSync(testDocPath);
assert(!fs.existsSync(testDocPath), 'El archivo no fue eliminado correctamente');
console.log(`✓ Archivo eliminado de src/content/docs/`);

// Recompilar tras eliminación
console.log('Ejecutando compilación tras eliminación...');
execSync('npm run build', { stdio: 'pipe' });

assert(!fs.existsSync(createdHtmlPath), 'El HTML del documento eliminado aún existe en dist');
assert(!fs.existsSync(createdRawPath), 'El raw.md del documento eliminado aún existe en dist');
console.log('✓ Compilación limpia tras eliminación: artefactos depurados correctamente.');

console.log('\n======================================================');
console.log('CICLO DE VIDA DE SVELTIA CMS VALIDADO AL 100%');
console.log('======================================================\n');
