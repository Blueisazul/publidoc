---
title: R3-02-PRIVATE-ALPHA-01
category: ruta
description: ''
createdAt: 2026-11-20T22:42:00.000Z
updatedAt: 2026-11-20T22:42:00.000Z
---

# INFORME DE RECALIBRACIÓN ARQUITECTÓNICA Y DE ALCANCE: BLOQUE R3-02-PRIVATE-ALPHA-01

**Resultado:** **`DONE`**

---

### Estado del repositorio
- **Rama:** `integration/r1-02c`
- **HEAD:** `b27e41804f3ae216173059daeaec39c77174db44` (`origin/integration/r1-02c`)
- **Working tree inicial:** Modificaciones no commiteadas en `docs/architecture/r0-decisiones-y-alcance-2026-11-12.md`, `docs/research/r3-02-fieldwork-and-recruitment-tracker-2026-11-18.md`, `docs/research/sessions/README.md` y archivo no rastreado `docs/research/r3-02-owner-circle-feedback-2026-11-20.md` (del bloque previo R3-02-OWNER-FEEDBACK-01).
- **Working tree final:** Se preservaron los cambios previos y se incorporó el nuevo documento de decisión arquitectónica [r3-private-alpha-scope-decision-2026-11-20.md](file:///C:/Users/sant1/Downloads/EmpleoWeb/docs/architecture/r3-private-alpha-scope-decision-2026-11-20.md), junto con la actualización correspondiente en el roadmap maestro. **Sin commits, push, merge a `main` ni despliegue en producción.**

---

### Decisión de producto

#### 1. Alcance recomendado de la Alpha privada
Se recalibra el alcance para responder a la premisa estratégica del propietario: **Ruta Sistemas operará como una herramienta de uso personal y para un grupo reducido de amigos y colegas, no como un servicio comercial abierto ni multiusuario.**

Se establecen dos niveles de madurez formalmente desacoplados:
- **Nivel 1 (Alpha Privada):** Enfoque en utilidad real cotidiana, estabilidad local, seguridad por diseño y veracidad de datos.
- **Nivel 2 (Producto Validado para Audiencia Amplia):** Requiere la ejecución protocolizada de sesiones formales R3-02 (`P01`–`P08`) con participantes elegibles y consentimiento informado antes de cualquier apertura pública.

#### 2. Requisitos ya satisfechos para la Alpha privada (mediante evidencia técnica)
- **Ejecución local reproducible:** Servidor nativo `python server.py` en puerto `4173` sin dependencias externas en tiempo de ejecución.
- **Operatividad del catálogo:** 193 pruebas Python y 14 pruebas Playwright E2E aprobadas sin fallos.
- **Distinción nítida real vs. demo:** Switch `#include-demonstrations` y etiquetado inequívoco entre vacantes activas y ejemplos demostrativos.
- **Transparencia y procedencia:** Hero de fuente oficial verificada (Greenhouse ATS) y 21 campos de evidencia desglosada por dato.
- **Sin datos inventados ni especulativos:** Omisión visual estricta de compensación, modalidad y fechas límite no declaradas.
- **Canal de postulación oficial funcional:** Enlace directo verificado al ATS del empleador.
- **Comparador objetivo:** Tabla de 14 atributos sin puntuaciones universales artificiales.
- **Seguridad local:** Servidor confinado estrictamente a loopback `127.0.0.1:4173`, validación de `Host` y bloqueo 404 a rutas privadas.

#### 3. Requisitos pendientes de la Alpha privada
- **Inventario real suficiente:** Actualmente el catálogo cuenta con **solo 1 oportunidad real activa (`OP-005` CookUnity)**. Para que la Alpha privada sea verdaderamente útil en el uso personal diario, se requiere un segundo lote de 3 a 5 vacantes reales verificadas de Ingeniería de Sistemas en el Perú.

#### 4. Funcionalidades que deben posponerse o descartarse (sobreingeniería prematura)
- **Autenticación y cuentas de usuario:** Descartada (innecesaria y riesgosa para uso personal local).
- **Alertas por correo o notificaciones automáticas:** Descartada (requiere infraestructura SMTP y colas externas).
- **Recomendaciones personalizadas opacas / IA:** Descartada (contradice el principio de transparencia de datos verificados).
- **Guardados y preferencias en base de datos:** Posponer (para uso personal, los marcadores de navegador son suficientes).
- **Evaluación explicable de señales complejas (R5):** Posponer (R5 permanece formalmente aplazada).
- **Automatización desatendida de scraping (R4):** Posponer / Bloqueada (el pipeline offline asistido de R2-OSS es suficiente).

---

### Arquitectura

#### Componentes que se conservan sin alteraciones
- **Almacenamiento canónico:** `data/opportunities.seed.json` versionado en Git como única fuente de verdad.
- **Modelo de datos:** Catálogo Schema 2 (inalterado; hashes SHA-256 criptográficamente idénticos).
- **Runtime local:** `server.py` utilizando `ThreadingHTTPServer` de Python estándar (cero frameworks pesados).
- **Base de datos local:** SQLite (`opportunities.sqlite3`) con FTS5 para búsqueda y filtrado rápido sin dependencias.
- **Frontend desacoplado:** HTML5 semántico + Tailwind CSS v4.3.3 minificado en 68 KB + JavaScript vainilla.
- **Pipeline de curaduría offline:** Herramientas existentes en `collector/` y `scripts/editorial_cli.py`.

#### Problemas reales detectados
- **Ningún problema técnico o de arquitectura en el código.** La arquitectura actual soporta cientos de vacantes con tiempos de respuesta <10ms en local.
- **El único cuello de botella real es de contenido:** La escasez de vacantes reales activas (1 vacante actual).

#### Dependencias OSS necesarias
- **Ninguna.** La totalidad de las capacidades requeridas para la Alpha privada ya están cubiertas por la biblioteca estándar de Python, SQLite, Tailwind precompilado y Playwright. Cero dependencias añadidas.

---

### Roadmap

#### Cambios documentales realizados
1. Creación del documento de decisión y alcance:  
   [r3-private-alpha-scope-decision-2026-11-20.md](file:///C:/Users/sant1/Downloads/EmpleoWeb/docs/architecture/r3-private-alpha-scope-decision-2026-11-20.md).
2. Registro formal de `R3-02-PRIVATE-ALPHA-01` en el roadmap maestro:  
   [r0-decisiones-y-alcance-2026-11-12.md](file:///C:/Users/sant1/Downloads/EmpleoWeb/docs/architecture/r0-decisiones-y-alcance-2026-11-12.md).

#### Estados formalmente preservados
- `R3-02-PREVIEW-02`: **`DONE`**
- `R3-02-PREVIEW-03`: **`DONE`**
- `R3-02-OWNER-FEEDBACK-01`: **`COMPLETED_WITH_LIMITED_FEEDBACK`**
- `R3-02-PRIVATE-ALPHA-01`: **`DONE`**
- `R3-02 formal (trabajo de campo con usuarios)`: **`NOT_STARTED` / `PENDING_HUMAN`** (plantillas `P01.md` a `P08.md` intactas en `PENDING_EXECUTION`).
- `R3-03`: **`BLOCKED`** (requiere mínimo 5 sesiones formales válidas).
- `R3-04`: **`BLOCKED`**
- `R3-05`: **`BLOCKED`**
- `R4`: **`BLOCKED`**
- `R5`: **`APLAZADA`**

---

### Validación ejecutada
- **`git diff --check`:** Aprobado sin errores de formato ni espacios en blanco huérfanos.
- **Integridad de datos canónicos (Schema 2):**
  - `data/opportunities.seed.json`: `309c22dd...` (0 bytes modificados).
  - `data/opportunities.json`: `a9097620...` (0 bytes modificados).
  - `collector/sources.json`: `ae5ba4d3...` (0 bytes modificados).
- **Consistencia documental:** Alineación estricta entre el nuevo ADR, los índices de sesiones y el roadmap maestro.

---

### Siguiente bloque recomendado (Acción única de mayor impacto)

> **Bloque: `R3-ALPHA-CURATION-01` — Ingesta Editorial y Verificación de Segundo Lote de Oportunidades Reales para la Alpha Privada**  
> **Objetivo:** Incorporar de 3 a 5 vacantes reales adicionales de Ingeniería de Sistemas y TI (en subdisciplinas prioritarias: Desarrollo de Software, QA Testing, Cloud/DevOps o Datos) utilizando exclusivamente el pipeline offline ya validado en R2-OSS (`collector/` y `scripts/editorial_cli.py`), con sus evidencias desglosadas por campo y enlaces oficiales verificados.  
> **Justificación:** Es la única acción que ataca el verdadero cuello de botella de Ruta Sistemas, convirtiendo la Alpha privada en una herramienta de consulta genuinamente útil para el propietario y sus amigos, sin introducir sobreingeniería ni tocar la arquitectura existente.

*(Nota: Conforme a las restricciones de gobernanza, este bloque no se ha ejecutado de forma anticipada. No se realizaron commits, push, merge ni despliegues).*

---

# DECISIÓN ARQUITECTÓNICA Y DE ALCANCE: ALPHA PRIVADA DE RUTA SISTEMAS
## Recalibración del Alcance, Criterios de Aceptación y Gobernanza de Producto

**Identificador:** `R3-02-PRIVATE-ALPHA-01`
**Fecha:** 20 de noviembre de 2026
**Autores/Roles:** Principal Software Architect, Technical Product Manager, Senior Software Engineer, Technical Auditor
**Rama objetivo:** `integration/r1-02c`
**Estado de gobernanza:** Aprobado para gobernanza de Alpha privada. R3-02 formal permanece `NOT_STARTED` / `PENDING_HUMAN`. R3-03 a R3-05 y R4 continúan estrictamente `BLOCKED`.

---

## 1. Objetivo y Premisa Fundamental de la Alpha Privada

La presente decisión recalibra la trayectoria inmediata del proyecto conforme a la intención estratégica del propietario:

> **Premisa de Producto:**
> **Ruta Sistemas será inicialmente una herramienta de uso personal del propietario y, de forma secundaria, para un grupo reducido de amigos y colegas cercanos. No está destinada todavía a un lanzamiento comercial abierto, operación como servicio SaaS multiusuario ni despliegue masivo en producción.**

El propósito de esta recalibración es evitar la **sobreingeniería prematura** (desarrollo de infraestructura, autenticación, persistencia compleja o automatizaciones desatendidas sin demanda comprobada), concentrando los esfuerzos en maximizar el valor práctico cotidiano: **encontrar, evaluar y verificar oportunidades laborales y formativas reales y confiables de Ingeniería de Sistemas en el Perú.**

---

## 2. Usuarios Previstos y Perfil de Uso

| Dimensión | Usuario Principal (Propietario) | Usuarios Secundarios (Círculo Cercano) | Audiencia Excluida en Esta Etapa |
|---|---|---|---|
| **Población** | 1 persona (propietario del repositorio). | 2 a 5 amigos, compañeros universitarios o colegas de TI. | Público general, postulantes anónimos masivos, reclutadores corporativos. |
| **Modalidad de acceso** | Ejecución local nativa (`python server.py`) en máquina propia. | Presencial (pantalla compartida) o clonado Git de rama `integration/r1-02c`. | Acceso web público vía dominio de producción o túneles de red. |
| **Objetivo de uso** | Descubrir vacantes reales verificadas, comparar condiciones objetivas y acceder al enlace oficial del empleador. | Exploración libre, retroalimentación cualitativa informal y prueba presencial. | Registro de cuentas, subida de currículums, postulaciones automáticas. |
| **Relación con el sistema** | Control total del código, entorno y base de datos local. | Confianza interpersonal, sin acuerdos de nivel de servicio (SLA). | Usuarios bajo contrato de términos y condiciones de servicio público. |

---

## 3. Alcance Funcional Actual de la Versión de Evaluación

La versión actual consolidada en la rama `integration/r1-02c` (commits `b3e69e9`, `4c88753`, `b27e418`) cuenta con:
1. **Catálogo normalizado Schema 2:** 6 registros gobernados (1 vacante real activa y 5 demostrativas).
2. **Oportunidad real verificada (`OP-005`):** *Supply Chain Analyst* en CookUnity (Lima, Perú), con enlace verificado al ATS Greenhouse y 21 campos de evidencia desglosada.
3. **Búsqueda y filtros multifaceta:** Búsqueda textual por tokens con atajo `/` y 7 filtros funcionales (modalidad, tipo de oportunidad, familia profesional, sector, nivel, salario publicado, condiciones temporales).
4. **Ficha de detalle en dos modalidades:** Modal accesible para consulta rápida y vista de página completa independiente (`/?id=OP-005` o `/#/oportunidad/OP-005`) con botón de retorno al catálogo.
5. **Transparencia y omisión estricta:** Erradicación del triaje especulativo; omisión estricta de salarios, modalidades o plazos no publicados; eliminación de frases predictivas subjetivas.
6. **Comparador lado a lado:** Evaluación tabular de 14 dimensiones objetivas entre dos oportunidades seleccionadas, sin puntuaciones globales sintéticas ni calificaciones arbitrarias.
7. **Servidor local nativo (`server.py`):** Servidor HTTP loopback en Python 3 estándar, seguro por diseño, con aislamiento de archivos privados y endpoint `/api/health`.
8. **Diseño responsivo:** Construido con Tailwind CSS v4.3.3 (`styles.css` minificado), sin dependencias en tiempo de ejecución ni desbordamiento horizontal en resoluciones de 360px a 1440px.

---

## 4. Dos Niveles de Madurez Independientes

Para evitar confusiones entre el uso informal personal y la validación de producto, se establecen dos niveles desacoplados:

```
┌────────────────────────────────────────────────────────────────────────┐
│ NIVEL 1: ALPHA PRIVADA (Uso personal y círculo cercano)                │
│ • Criterios técnicos de estabilidad, seguridad local y utilidad real. │
│ • Evaluación cualitativa informal mediante pruebas presenciales.      │
│ • Estado actual: OPERATIVA Y SEGURA (Validada en PREVIEW-02/03).      │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Desbloqueo condicionado a
                                     │ evidencia formal y decisión
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ NIVEL 2: PRODUCTO VALIDADO (Audiencia amplia / Producción pública)     │
│ • Sesiones formales R3-02 con 5-8 usuarios (P-EST, P-EGR, P-JUN).      │
│ • Consentimiento informado firmado, rúbricas QA y hallazgos R3-03.     │
│ • Estado actual: ESTRICTAMENTE BLOQUEADO (NOT_STARTED / PENDING_HUMAN) │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Criterios de Aceptación del Nivel 1 (Alpha Privada)

| Criterio de Alpha Privada | Estado Actual | Evidencia Técnica que lo Respalda |
|---|:---:|---|
| **1. Ejecución local reproducible** | **SATISFECHO** | `python server.py` arranca en <1s sin dependencias externas en Python 3.10+. |
| **2. Catálogo y funciones principales operativas** | **SATISFECHO** | 193 pruebas Python y 14 pruebas Playwright aprueban sin fallos. |
| **3. Distinción transparente real vs. demo** | **SATISFECHO** | Switch `#include-demonstrations` y badges claros (`Oportunidad activa · Verificada` vs `Demostración`). |
| **4. Procedencia verificable de datos** | **SATISFECHO** | Hero de fuente oficial + acordeón con 21 evidencias desglosadas en `OP-005`. |
| **5. Sin invención de datos desconocidos** | **SATISFECHO** | Omisión visual estricta de compensación, modalidad y deadline cuando no están publicados. |
| **6. Canal oficial de postulación operativo** | **SATISFECHO** | Botón directo a ATS Greenhouse (`https://boards.greenhouse.io/cookunity/jobs/8039990003`). |
| **7. Comparador objetivo sin puntajes inventados** | **SATISFECHO** | Comparador de 14 dimensiones con leyenda explícita «SIN PUNTUACIÓN». |
| **8. Protección de datos personales y archivos** | **SATISFECHO** | Sin almacenamiento de CVs ni datos privados. Servidor responde 404 a `/.git/config`. |
| **9. Servidor confinado a loopback** | **SATISFECHO** | Enlazado únicamente a `127.0.0.1:4173`. Validación de encabezado `Host`. |
| **10. Desarrollo aislado sin alterar producción** | **SATISFECHO** | Todo el trabajo avanza en `integration/r1-02c`; `main` y GitHub Pages permanecen intactos. |
| **11. Volumen útil de ofertas reales activas** | **PENDIENTE (LIMITACIÓN)** | **Actualmente existe solo 1 vacante real publicada (`OP-005`). Se requiere un segundo lote de 3 a 5 vacantes.** |

---

## 5. Evaluación Crítica de Funcionalidades y Matriz de Priorización

Se evalúa la cartera funcional frente a las necesidades reales del propietario:

| Funcionalidad Analizada | Clasificación para Alpha Privada | Justificación Técnica y de Producto |
|---|:---:|---|
| **1. Más oportunidades reales verificadas** | **NECESARIA PARA ALPHA PRIVADA (PRIORIDAD 1)** | Es la principal limitación actual. Con 1 sola oferta el catálogo no permite una búsqueda cotidiana útil. Ampliar a 4-6 vacantes reales de diversas subáreas de Sistemas transforma la herramienta en un producto de consulta genuino. |
| **2. Actualización y vigencia (TTL 7 días)** | **NECESARIA PARA ALPHA PRIVADA** | Ya implementada en `catalog_quality.py` y `server.py`. Evita que el usuario postule a convocatorias vencidas. |
| **3. Filtros y búsqueda multifaceta** | **ÚTIL, YA SATISFECHA** | Ya cubre texto, modalidad, nivel, tipo, sector y salario. No requiere más complejidad en esta etapa. |
| **4. Ficha de detalle y evidencias** | **ÚTIL, YA SATISFECHA** | Rediseñada y consolidada en UX-EXP-05/06 y PREVIEW-02. Satisface plenamente las necesidades de consulta. |
| **5. Comparador side-by-side** | **ÚTIL, YA SATISFECHA** | Funcional para 2 alternativas. Se mantiene sin alteraciones. |
| **6. Guardados y preferencias de usuario** | **REQUIERE EVIDENCIA DE USO / POSPONER** | Para un catálogo de escala Alpha, el usuario puede marcar la URL en su navegador (`?id=OP-005`). No justifica implementar almacenamiento local ni preferencias en esta etapa. |
| **7. Evaluación explicable de señales (R5)** | **POSPONER** | R5 está formalmente aplazada. Requiere un corpus de datos amplio y patrones longitudinales que aún no existen. |
| **8. Alertas por correo o notificaciones** | **NO JUSTIFICADA ACTUALMENTE** | Requiere servidores SMTP, colas de mensajería y persistencia de suscriptores. Innecesaria para uso personal. |
| **9. Automatización de fuentes (R4)** | **POSPONER / BLOQUEADA** | La ingesta asistida mediante el CLI offline existente (`collector/` y `scripts/editorial_cli.py`) es suficiente para el volumen de la Alpha. La automatización desatendida sin autorización institucional está bloqueada. |
| **10. Persistencia y almacenamiento** | **YA SATISFECHA** | El esquema híbrido actual (`data/opportunities.json` estático + `opportunities.sqlite3` en servidor local) es óptimo y soporta cientos de vacantes sin tocar código. |
| **11. Autenticación y multiusuario** | **NO JUSTIFICADA ACTUALMENTE** | Introducir login, contraseñas, tokens JWT y roles para uso de 1 persona y amigos es sobreingeniería pura y eleva el riesgo de vulnerabilidades. |
| **12. Recomendaciones personalizadas / IA** | **NO JUSTIFICADA ACTUALMENTE** | Un catálogo transparente no debe ocultar vacantes tras algoritmos opacos. La ordenación cronológica y por relevancia textual es superior y auditable. |

> [!IMPORTANT]
> **Conclusión de Prioridad:**
> La interfaz actual es suficiente y sólida. **El cuello de botella de valor de Ruta Sistemas hoy no es de código ni de diseño: es de inventario de vacantes reales.**

---

## 6. Arquitectura Suficiente para la Alpha Privada

La arquitectura actual es técnicamente adecuada para el uso previsto y no presenta bloqueos técnicos reales:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA ALPHA PRIVADA                      │
├────────────────────────────────────────────────────────────────────────┤
│ • Cliente Web: HTML5 Semántico + Tailwind CSS v4.3.3 + JS Vainilla.    │
│ • Servidor: Python 3.10+ ThreadingHTTPServer (Biblioteca Estándar).    │
│ • Enlace de Red: Loopback exclusivo 127.0.0.1:4173 (Seguro por diseño) │
│ • Almacenamiento Primario: data/opportunities.seed.json (Canónico).    │
│ • Cache / Búsqueda: SQLite FTS5 local (data/opportunities.sqlite3).     │
│ • Pipeline de Ingesta: scripts/editorial_cli.py (Offline / Asistido).  │
│ • Dependencias Runtime Nuevas: 0. Servicios SaaS Externos: 0.          │
└────────────────────────────────────────────────────────────────────────┘
```

### Decisiones de Arquitectura Confirmadas:
1. **Conservar `data/opportunities.seed.json` como fuente canónica:** Garantiza inmutabilidad y versionado Git puro.
2. **Conservar Schema 2 sin cambios:** El esquema actual modela adecuadamente fuentes, evidencias, estados de publicación y metadatos sin requerir migraciones.
3. **Mantener `server.py` como único runtime:** Desacoplado de frameworks pesados (Django, FastAPI, Express), minimizando superficie de ataque y mantenimiento.
4. **Mantener GitHub Pages desacoplado:** La versión pública en producción se conserva en el commit `28b7a9e` mientras la Alpha evoluciona de forma segura en `integration/r1-02c`.

---

## 7. Estrategia OSS-First y Control de Dependencias

- **No se requieren nuevas bibliotecas ni paquetes externos.**
- Las herramientas actuales (Python estándar, SQLite nativo, Tailwind CSS precompilado, Playwright para QA) cubren el 100% de los requerimientos de la Alpha privada.
- No se incorporarán librerías de analítica, frameworks de UI (React, Vue), ORMs pesados ni paquetes de autenticación.

---

## 8. Riesgos y Limitaciones de la Alpha Privada

1. **Riesgo de desinterés por catálogo reducido:** Si el propietario o sus amigos abren la web repetidamente y solo encuentran 1 vacante real, la herramienta perderá utilidad percibida.
2. **Vigencia de la oferta real:** `OP-005` (CookUnity) tiene un TTL de 7 días. Si la empresa retira la vacante de Greenhouse, el catálogo quedará sin vacantes activas.
3. **Límite de distribución:** Si los amigos no tienen entorno Python/Git, dependen exclusivamente de la visualización presencial o compartiendo pantalla con el propietario.
4. **Tentación de sobreingeniería:** Riesgo de volver a iterar sobre la UI antes de contar con un catálogo real representativo.

---

## 9. Dependencias que Permanecen Formalmente Bloqueadas

Esta decisión de Alpha privada no elude las reglas de calidad ni los gates de gobernanza:

- **Investigación Formal R3-02 (`NOT_STARTED` / `PENDING_HUMAN`):** La evaluación informal del círculo cercano (`OWNER-FEEDBACK-01`) no cuenta como sesión formal. R3-02 continúa requiriendo 5 a 8 participantes protocolizados con consentimiento informado cuando el proyecto decida abrirse a audiencias externas.
- **R3-03 (Consolidación formal de hallazgos):** Permanece **`BLOCKED`** hasta la culminación formal de R3-02.
- **R3-04 (Refactor UX formal):** Permanece **`BLOCKED`**.
- **R3-05 (Decisión de MVP):** Permanece **`BLOCKED`**.
- **R4 (Automatización de fuentes):** Permanece **`BLOCKED`** hasta justificar demanda de volumen y contar con autorización institucional.
- **R5 (Evaluación explicable):** Permanece **`APLAZADA`**.

---

## 10. Próxima Acción Recomendada (Paso Único de Mayor Impacto)

Se recomienda enfocar el siguiente esfuerzo técnico en:

> **Bloque Recomendado: Ingesta Curada de Oportunidades Reales para la Alpha Privada (`R2-A-06` o `R3-ALPHA-CURATION-01`)**
> **Objetivo:** Incorporar de 3 a 5 vacantes reales adicionales de Ingeniería de Sistemas / TI en Lima o Remoto para Perú (p. ej. en Desarrollo de Software, QA Testing, Cloud/DevOps o Datos) utilizando el pipeline offline ya desarrollado en R2-OSS (`collector/` y `scripts/editorial_cli.py`).
> **Justificación:** Es la única acción que transforma la Alpha privada en una herramienta de consulta verdaderamente útil para el propietario y sus amigos, superando la limitación del catálogo monovacante actual sin alterar la arquitectura ni agregar dependencias.

---

# R0 — Decisiones estratégicas y alcance consolidado

- **Fecha:** 2026-11-12
- **Estado:** cerrada documentalmente; R1 aún no iniciada
- **Alcance:** decisiones, criterios y roadmap. No implementa funcionalidades.
- **Fuente de verdad:** este documento consolida R0; el código y ADR-001 siguen siendo la autoridad para los contratos ya implementados.

## 1. Decisión ejecutiva

Ruta Sistemas construirá primero un **catálogo estático, curado y verificable de oportunidades reales para perfiles iniciales y junior de Sistemas en Perú**, incluyendo oportunidades remotas solo cuando la elegibilidad desde Perú esté explícita. El MVP permite encontrar, entender y comparar oportunidades; no promete empleo, continuidad ni calidad universal del empleador.

La arquitectura vigente se conserva: `data/opportunities.seed.json` como fuente canónica, snapshot generado, frontend estático, validación fail-closed y publicación portable. No se incorpora backend multiusuario, CMS, IA, scraping general ni nueva infraestructura antes de demostrar una necesidad concreta.

**Regla de cierre del MVP:** mientras no exista al menos una ficha real que cumpla el contrato editorial y pueda consultarse correctamente, el producto es un piloto técnico/editorial, no un MVP terminado.

## 2. Inventario documental consolidado

| Documento | Estado | Decisión/propósito | Acción |
|---|---|---|---|
| [README.md](../../README.md) | Vigente | Operación, estados, validaciones y límites actuales | Mantener; enlazar este cierre R0 |
| [ADR-001](../adr/ADR-001-catalogo-curado-publicacion-segura.md) | Vigente | Fuente canónica, estados, evidencia, publicación y límites | Mantener como contrato arquitectónico |
| [P3 — primer caso real](../sources/p3-first-opportunity-2026-11-12.md) | Vigente como bloqueo | Ninguna fuente tiene autorización suficiente | Mantener; no activar fuentes |
| [P4 — OSS](p4-oss-automation-evaluation-2026-11-13.md) | Propuesto/condicionado | Evalúa automatización futura; operación bloqueada | Mantener como propuesta; no instalar OSS |
| [P5 — evaluación profesional](../product/p5-evaluacion-profesional-y-validacion.md) | Vigente como evolución | Señales explicables sin score ni ranking | Mantener; no confundir con requisito completo del MVP |
| [Seguimiento de autorización](../sources/seguimiento-autorizacion-fuentes.md) | Vigente como trabajo externo | Preguntas y criterios para fuentes | Mantener; requiere respuesta humana |
| [Canonical Careers](../sources/canonical-careers-2026-11-11.md) | Propuesto | Candidata privada, `pending_review`, presupuesto cero | Mantener; no consultar ni publicar |
| [Auditoría 2026-10-25](../audits/project-state-audit-2026-10-25.md) | Histórico | Diagnóstico anterior y decisiones ya implementadas | No usar como estado actual |
| [Diseño/roadmap](../../Diseno-modelo-datos-arquitectura-piloto-2026-10-03.md) | Histórico acumulativo + roadmap vigente | Antecedentes y secciones P1–P5 | Conservar; esta sección R0 prevalece para alcance actual |
| `Informe-investigacion-mercado-fuentes-2026-10-03.md` | Histórico | Investigación de mercado y fuentes | No tratar como autorización |
| `outputs/pilot-datos-2026-10-03/Protocolo_Piloto_Oportunidades.xlsx` | Histórico | Protocolo del piloto inicial | Conservar como antecedente |

### Contradicciones resueltas

1. La visión de largo plazo incluye evaluación profesional y trayectorias; P5 no las elimina, solo las deja como evolución basada en evidencia.
2. Los documentos antiguos describen colectores activos, CDN o escritura automática; ADR-001 y el código actual los sustituyen por snapshot estático, CSS compilado y colector fail-closed.
3. La evaluación OSS fechada **2026-11-13** es posterior a la fecha de R0 (**2026-11-12**): se considera propuesta futura ya redactada, no decisión aprobada ni evidencia de ejecución.
4. `Aurel`/`AurelDev` aparece en contenido local reciente, pero no es una decisión de marca aprobada. La marca de producto para R0 sigue siendo Ruta Sistemas.

## 3. Alcance definitivo

### A. MVP — obligatorio

1. Catálogo con al menos una oportunidad real no demostrativa.
2. Filtros por tipo, perfil/nivel, modalidad, ubicación y familia/sector cuando esos datos estén publicados.
3. Detalle con requisitos, condiciones disponibles, fuente, publisher, fecha de observación y canal oficial de postulación.
4. Estados comprensibles y conservadores: oportunidad, verificación y publicación separados.
5. Exclusión por defecto de demostraciones, históricas, vencidas y no confirmadas.
6. Comparación local de oportunidades sin score ni ganador universal.
7. Evidencia y trazabilidad suficientes para explicar cada dato publicado.
8. Publicación estática reproducible y validada antes de Pages.

### B. Evolución, no MVP

- señales explicables de aprendizaje, experiencia técnica, crecimiento y continuidad;
- evaluación separada del empleador y de la oportunidad;
- preferencias efímeras, oportunidades guardadas y alertas;
- orientación de trayectorias basada en requisitos y transiciones observadas;
- automatización de fuentes autorizadas en staging;
- persistencia multiusuario solo si la curación concurrente lo demuestra necesaria.

La evolución requiere datos reales longitudinales, criterios transparentes, pruebas con usuarios y separación explícita entre hecho, señal, incertidumbre y ausencia de información. No se autoriza score universal, ranking definitivo ni recomendación automática por ahora.

### C. Fuera de alcance o descartado

- red social, comunidad, chat usuario-empresa;
- sistema propio de postulación;
- almacenamiento de CV o datos de postulantes;
- backend multiusuario prematuro;
- scraping indiscriminado o activación por disponibilidad técnica;
- IA/recomendaciones sin dataset suficiente y evidencia;
- ranking universal de empleadores u oportunidades;
- infraestructura distribuida o base especializada sin volumen/operación demostrados.

## 4. Cambios sin commit: matriz de decisión

El estado revisado contiene **15 archivos rastreados modificados**, **un `canvas.js` no rastreado** y **cuatro documentos nuevos no rastreados**; el diff rastreado suma **1.536 adiciones y 117 eliminaciones**. Se preserva todo el trabajo; esta matriz no autoriza revertirlo.

| Grupo | Aporte | Riesgo/coste | Evidencia actual | Decisión R0 |
|---|---|---|---|---|
| Marca/identidad | Jerarquía y nueva presentación | `Aurel`/`AurelDev` contradice Ruta Sistemas | `index.html`, DOM local | Conservar con ajuste de marca en R1 |
| Navegación/estructura | Hero, catálogo, metodología, fuentes | Más superficie antes de tener datos reales | inspección de UI | Conservar; validar tarea principal |
| Filtros/catálogo | Texto, ubicación, modalidad, categorías y opt-ins | Cobertura E2E incompleta | tests Node + navegador | Conservar |
| Detalle | Evidencia, estados, señales y postulación deshabilitada | Puede repetir interpretación editorial | `renderDialog`, contratos schema 2 | Conservar con pruebas |
| Comparador | Hasta dos fichas, sin puntuación | No verificado end-to-end | lógica Node; falta browser flow | Conservar con validación |
| Evaluación/evidencia | Distingue hechos y límites | No debe parecer recomendador | P5 y `evaluationSignals` | Conservar como evolución útil |
| Hero WebGL | Identidad visual y animación | Compatibilidad, rendimiento, accesibilidad; no resuelve catálogo vacío | `canvas.js`; `prefers-reduced-motion` no detiene WebGL | Pendiente de validación; no ampliar |
| Estilos/responsive | CSS compilado local, sin CDN runtime | Cambios amplios y posible divergencia visual | build CSS y artefacto Pages pasan | Conservar; revisar viewport |
| Pruebas/docs | Contratos de carga, errores y datos | Falta E2E local/canvas/modales | 56 tests pasan | Conservar; ampliar en R1 |

### Defectos verificables que R1 debe resolver

- `index.html` carga `canvas.js`, pero `server.py` no lo expone: el servidor local devuelve 404/MIME JSON.
- El título y marca visible no están alineados con Ruta Sistemas.
- El bucle WebGL debe medirse o desactivarse/reducirse bajo `prefers-reduced-motion`; la regla CSS por sí sola no prueba ahorro de ejecución.
- No afirmar que Pages y servidor local son equivalentes hasta probar ambos contratos.

## 5. Contrato editorial vigente

No se crea un esquema paralelo. El contrato se apoya en schema 2, `catalog_quality.py`, `build_catalog.py`, `validate_candidates.py` y ADR-001.

### Campos mínimos

- **Identidad:** `id`, `title`, `employer`, `publisher`, `kind`, `family`, `level`, `sector`.
- **Condiciones:** `mode`, `location`, `eligibility`, `salary`/`salaryNote`, `duration`, `benefits`, `publishedAt`, `deadline` cuando existan.
- **Postulación:** `sourceUrl`, `applyUrl`, `allowedHosts`, `sourceKind`.
- **Evidencia:** `fieldEvidence` para cada campo afirmado, URL HTTPS permitida y `observedAt` con zona; `verificationEvidence` con método, resultado y relación con el empleador.
- **Decisión:** `editorialDecision.status`, revisor, motivo y `decidedAt`.
- **Estados:** `opportunityStatus`, `verificationStatus`, `publicationStatus`, `recordKind`, `lastVerifiedAt`/`lastCheckedDate`.

### Condición para `publicationStatus: active`

Debe cumplirse todo lo siguiente:

1. `recordKind` no es `demonstration`.
2. `opportunityStatus: open`.
3. `verificationStatus: verified` y la verificación está dentro del TTL configurado.
4. El deadline no existe o no está vencido.
5. Revisión humana aprobada con revisor, fecha y motivo.
6. El canal de postulación fue observado abierto manualmente, con `publisherRelation: employer_confirmed`, `result: application_open`, timestamp válido y hosts HTTPS permitidos.
7. `sourceUrl`, `applyUrl` y la evidencia son permitidas.
8. Cada campo no nulo afirmado tiene `fieldEvidence` reciente.

Si falta cualquier condición, la ficha permanece `unconfirmed`, `historical`, `expired`, `stale`, `pending` o fuera del snapshot publicable según corresponda. `generatedAt` nunca renueva evidencia. Ausencia de dato no se transforma en condición negativa.

### Flujo mínimo

`captura → validación → deduplicación → verificación → revisión humana → aprobación → generación → publicación → seguimiento`

| Paso | Estado actual |
|---|---|
| Captura | Manual; automatización bloqueada |
| Validación | Implementada para candidatos, semilla y snapshot |
| Deduplicación | Parcial; requiere revisión de colisiones |
| Verificación | Manual y documentada; no existe ficha real aprobada |
| Revisión/aprobación | Manual, modelada en schema, sin panel |
| Generación/publicación | Implementada y fail-closed |
| Seguimiento/retirada | Política documentada; ejecución manual |

## 6. Criterios de aceptación congelados

### MVP

- [ ] Existe al menos una oportunidad real, no demostrativa, consultable y aprobada.
- [ ] Una persona puede filtrar, abrir el detalle, distinguir empleador/publisher y llegar al canal oficial.
- [ ] Una ficha vencida, stale o sin evidencia no aparece como activa por defecto.
- [ ] La comparación no produce score, ganador ni valores inventados.

### Datos y publicación

- [ ] `build_catalog.py --check`, `validate_catalog.py` y `validate_candidates.py` pasan.
- [ ] Cada dato afirmado tiene evidencia HTTPS y fecha válida; los desconocidos permanecen ausentes/null.
- [ ] La publicación falla si el esquema, host, fecha, estado o artefacto son inválidos.
- [ ] El artefacto contiene exactamente los archivos permitidos y no depende de CDN runtime.

### Experiencia e integridad técnica

- [ ] Prueba de navegador cubre carga, filtros, estado vacío/error, detalle, comparación y enlaces relativos bajo Pages.
- [ ] Prueba local cubre `canvas.js` o documenta su exclusión; no hay 404/MIME incorrecto.
- [ ] Se revisan teclado, diálogo, viewport móvil y `prefers-reduced-motion`.
- [ ] No se declara éxito remoto sin observar el artefacto y la URL desplegados.

### Evolución

- [ ] No se inicia scoring, alertas, trayectorias o personalización sin datos y protocolo de medición documentados.
- [ ] Una fuente nueva tiene autorización escrita separada para consulta, retención, atribución, retirada y republicación antes de cualquier solicitud.
- [ ] La automatización produce staging/candidatos y nunca promociona directamente a seed, snapshot o Pages.

## 7. Roadmap maestro posterior a R0

El roadmap existente permanece en la sección 21 y sus bloques posteriores del [documento de diseño](../../Diseno-modelo-datos-arquitectura-piloto-2026-10-03.md). R0 lo reordena así, sin duplicar tareas:

| Fase | Objetivo | Entrada | Salida/criterio | Estado |
|---|---|---|---|---|
| R0 | Cerrar alcance, contrato, criterios y decisiones | Auditoría + docs actuales | Este documento, sin contradicciones críticas sin registrar | **Cerrada documentalmente** |
| R1 | Estabilizar versión actual | R0 | `canvas.js` local resuelto, marca unificada, diff revisado, E2E base, Pages desplegado | **Completada y verificada en producción** |
| R2 | Obtener primera oportunidad real | R1 + fuentes públicas/autorización | Una ficha real aprobada en staging y luego seed/snapshot | **DONE. Línea offline R2-OSS cerrada. Línea A completada en R2-A-05: CookUnity 8039990003 (Supply Chain Analyst - Lima, Perú) promovida editorialmente al catálogo canónico como OP-005 con aprobación del propietario (APPROVE_WITH_LIMITATIONS), snapshot compilado y validado (193 pruebas unitarias, 8 pruebas E2E Playwright, validador de calidad) y publicado en GitHub Pages con 21 evidencias desglosadas por campo y canal oficial de postulación. Candidato Canonical 8379825 conservado en reserva. Desbloquea R3.** |
| R3 | Validar utilidad del MVP | R2 | Pruebas con usuarios y medición de comprensión/comparación | **En ejecución. Desbloqueada por R2-A-05 con oportunidad real OP-005 en producción. Subfase R3-01 (Preparación y protocolo de investigación) completada (DONE): línea base UX, protocolo de pruebas de usabilidad, plantilla individual de sesión, repositorio de hallazgos y auditoría de preparación entregados. Subtareas R3-01-01 a R3-01-05 formalizadas. Pendiente R3-02 (ejecución de sesiones con 5-8 usuarios reales).** |
| R4 | Automatizar fuente autorizada | R2/R3 + permiso técnico | Adaptador acotado, candidatos offline, sin promoción automática | **Bloqueada; no existe fuente autorizada** |
| R5 | Evaluación profesional explicable | Datos reales suficientes + R3 | Señales auditables sin score obligatorio | Aplazada |
| R6 | Preferencias, guardados y alertas | R3 + necesidad demostrada | Diseño de privacidad y persistencia justificado | Aplazada |
| R7 | Trayectorias profesionales | Dataset longitudinal y evidencia | Orientación no determinista, validada | Aplazada |
| R8 | Consolidación operativa | Flujos anteriores estables | backups, monitorización, retirada y plan de hosting | Aplazada |

### Siguiente bloque: R1-01

- **Objetivo:** estabilizar y consolidar la versión actual sin cambiar el alcance.
- **Archivos probables:** `server.py`, `index.html`, `canvas.js`, `app.js`, pruebas UI y documentación de release.
- **Dependencias:** ninguna técnica; requiere conservar el árbol de trabajo y revisión del propietario para decidir mantener o simplificar el hero.
- **Aceptación:** servidor local sin 404/MIME para recursos declarados; marca unificada; smoke E2E de carga/filtros/detalle/comparador; decisión explícita sobre WebGL y reduced motion.
- **Validaciones:** suite existente, `node --check`, artefacto Pages, navegador local y viewport móvil.
- **Riesgo:** tocar el lote acumulado puede mezclar cambios de etapas; revisar diff antes de seleccionar cualquier integración.
- **Esfuerzo relativo:** medio.

### Evidencia de ejecución R1

- `server.py` expone `/canvas.js` como JavaScript; la comprobación HTTP local devolvió `200` y MIME correcto para `/`, `/app.js`, `/styles.css`, `/canvas.js` y `/data/opportunities.json`.
- `index.html` usa `Ruta Sistemas` en título y marca visible, sin residuo activo `Aurel`.
- `canvas.js` registra fallback sin bloqueo para WebGL2 ausente, atiende `prefers-reduced-motion` y cancela el frame en `pagehide`.
- `app.js` conserva el mensaje seguro para la persona y registra la causa técnica del fallo de catálogo en consola.
- `python -m unittest discover -s tests -v`: 57 pruebas pasan. `node --check app.js` y `node --check canvas.js` pasan.
- Smoke de navegador local: carga inicial vacía, activación de ejemplos demostrativos y apertura/cierre del detalle verificados. No se añadió un runner E2E al proyecto.

## 8. Decisiones pendientes de aprobación

1. Mantener el hero WebGL, simplificarlo o retirarlo tras la validación R1.
2. Confirmar la marca final `Ruta Sistemas` y corregir cualquier residuo `Aurel`.
3. Autorizar contacto con Canonical/SERVIR/FISI o seleccionar otra fuente; ninguna está aprobada actualmente.
4. Autorizar la integración/publicación del lote sin commit tras revisión completa del diff.
5. Definir, después del piloto, si el volumen justifica CMS/backend; no se presume ahora.

## 9. Cierre R0 y Seguimiento de Fases Posteriores

- **R0:** **Cerrada documentalmente**.
- **R1:** **Cerrada y desplegada**.
- **R2:** **Cerrada formalmente** con la línea offline R2-OSS (ingesta, normalización, dedup, evidencias y CLI) y la línea A (R2-A-01 a R2-A-05), culminando con la publicación en producción de la oportunidad real CookUnity (`OP-005`) en GitHub Pages.
- **R3 — Validación de Producto:** **En ejecución**.
  - `R3-01`: Preparación y protocolo de investigación (`DONE`).
    - `R3-01-01`: Auditoría UX del producto publicado (`DONE` -> `docs/research/r3-01-ux-baseline-2026-11-18.md`).
    - `R3-01-02`: Definición del protocolo de investigación (`DONE` -> `docs/research/r3-01-user-research-protocol-2026-11-18.md`).
    - `R3-01-03`: Diseño de escenarios y tareas A a E (`DONE` -> `docs/research/r3-01-user-research-protocol-2026-11-18.md`).
    - `R3-01-04`: Métricas y taxonomía de evaluación (`DONE` -> `docs/research/r3-01-findings-template-2026-11-18.md`).
    - `R3-01-05`: Instrumentación y plantillas locales (`DONE` -> `docs/research/r3-01-usability-test-template-2026-11-18.md`).
  - `R3-02`: Trabajo de campo con usuarios reales (5-8 participantes) (Preparación técnica y operativa `DONE`; ejecución empírica en estado `NOT_STARTED` / `PENDING_HUMAN`, pendiente de convocatoria y moderación presencial/remota por el equipo humano; paquete operativo verificado con kit `docs/research/r3-02-recruitment-materials-kit-2026-11-18.md`, guía `docs/research/r3-02-moderator-field-guide-2026-11-18.md`, plantillas `P01.md`..`P08.md` y auditorías en `docs/audits/`).
    - `R3-02-UX-EXP-01`: Iteración exploratoria de claridad, rendimiento y experiencia de consulta (`DONE` -> `docs/audits/r3-02-ux-exploratory-iteration-2026-11-19.md`). Optimización WebGL2 en `canvas.js` (eliminación de reflow forzado en bucle y pausa con `IntersectionObserver`), vista independiente de oportunidad con URL estable `?id=...` y fallback amigable 404, reemplazo de señales complejas por Triaje Rápido de 8 condiciones objetivas sin puntaje sintético, retiro de decisión editorial y evaluación institucional de la UI pública, simplificación de procedencia con tarjeta de fuente oficial y evidencia colapsable, y corrección de heurísticas UX-B01 a UX-B05. Esta iteración atiende observaciones del entorno exploratorio personal y círculo reducido sin comprometer el rigor metodológico ni anticipar la validación formal.
    - `R3-02-UX-EXP-02`: Validación local, auditoría de aceptación y preparación para sincronización (`DONE` -> `docs/audits/r3-02-ux-exp-02-acceptance-2026-11-19.md`). Auditoría semántica del Triaje Rápido: corrección del detector de experiencia previa (notación `1+ años` en OP-005 clasificada fielmente como `Por revisar`), separación explícita de hechos de la convocatoria respecto al perfil personal del postulante, suite E2E ampliada a 12 pruebas (Chromium y Mobile Pixel 5), verificación responsiva sin overflow en 1440px, 768px y 390px, y confirmación de preparación técnica para evaluación privada local. R3-02 formal permanece `NOT_STARTED` / `PENDING_HUMAN`.
    - `R3-02-UX-EXP-03`: Reconciliación final, gate de aceptación y preparación de sincronización (`DONE` -> `docs/audits/r3-02-ux-exp-03-reconciliation-acceptance-2026-11-19.md`). Corrección del enrutador hash contra colisiones 404 en anclas locales de página (`#inicio`, `#fuentes`), verificación integral de 193 pruebas Python y 12 pruebas Playwright E2E, preservación absoluta del catálogo y Schema 2, y veredicto de gate `READY_FOR_OWNER_REVIEW` para sincronización controlada a `integration/r1-02c`. R3-02 formal continúa `NOT_STARTED` / `PENDING_HUMAN` y R3-03 permanece `BLOCKED`.
    - `R3-02-UX-EXP-04`: Consolidación de información y eliminación de redundancia en la ficha de oportunidad (`DONE` -> `docs/audits/r3-02-ux-exp-04-information-consolidation-2026-11-19.md`). Aplicación estricta del principio *«Un dato, una ubicación, una interpretación»*: consolidación canónica de modalidad y compensación en la cuadrícula de condiciones, unificación de ubicación y elegibilidad en un único bloque sin repetición de términos, separación nítida entre requisitos del puesto (obligatorios) y tecnologías declaradas (herramientas/plataformas), retiro completo de la sección redundante de continuidad y riesgos (integrando términos de contrato en `Contrato y plazo`), compactación de metadatos de vigencia/verificación, y rediseño del Triaje Rápido a 3 señales de síntesis prioritarias (`Pertinencia técnica`, `Elegibilidad territorial`, `Nivel y experiencia`). Suite E2E ampliada a 14 pruebas (Chromium y Mobile Pixel 5) verificando cero duplicaciones informativas. R3-02 formal permanece `NOT_STARTED` / `PENDING_HUMAN` y R3-03 permanece `BLOCKED`.
    - `R3-02-UX-EXP-05`: Rediseño de la ficha de oportunidad, presentación visual y uso efectivo de Tailwind CSS (`DONE` -> `docs/audits/r3-02-ux-exp-05-opportunity-detail-visual-redesign-2026-11-19.md`). Cumplimiento de la decisión del propietario de simplificar radicalmente la ficha: eliminación completa del «Triaje rápido»; posicionamiento superior de «✓ Fuente oficial verificada» (con difusor, empleador, estado de verificación y enlaces oficiales directos); nuevo «Resumen» visual con cuadrícula de tarjetas e iconos SVG Lucide inlined (`monitor`, `building`, `pin`, `wallet`, `file`, `clock`, `calendar`, `shield`); política estricta de omisión visual de campos no declarados (eliminación de textos especulativos como «sujeto a desempeño y evaluación del empleador» y omisión en OP-005 de modalidad, remuneración y fecha límite no publicadas); «Tecnologías y herramientas declaradas» ubicadas inmediatamente debajo del Resumen como etiquetas visuales; reubicación de «Qué se verificó» y preservación de los 21 campos de evidencia desglosada; y corrección de la integración de Tailwind CSS v4 inyectando las definiciones `@theme` en `src/input.css` para restaurar tokens de color de marca (`ice-blue`, `crystal-blue`, `arctic-blue`, `brand-black`, etc.). 14 pruebas E2E (Chromium y Mobile Pixel 5) y 193 pruebas Python pasan sin advertencias de regresión. R3-02 formal continúa `NOT_STARTED` / `PENDING_HUMAN` y R3-03 permanece `BLOCKED`.
    - `R3-02-UX-EXP-06`: Reconciliación post-implementación, auditoría de UX-EXP-05 y preparación para revisión del propietario (`DONE` -> `docs/audits/r3-02-ux-exp-06-reconciliation-and-owner-review-2026-11-19.md`). Auditoría técnica exhaustiva del estado real del repositorio: verificación de paridad Git (HEAD `9d747c5` en `integration/r1-02c`), confirmación de presencia real y completa de las 7 directivas de diseño de UX-EXP-05, verificación criptográfica de invariabilidad de Schema 2 y fuentes canónicas (`data/opportunities.seed.json`, `data/opportunities.json`, `collector/sources.json`), auditoría de compilación y tokens de Tailwind CSS v4.3.3 (`styles.css` de 65 KB sin dependencias externas), validación de suite completa (193 pruebas Python, 14 pruebas Playwright Chromium/Mobile, 9 contratos estáticos, scripts de catálogo), verificación funcional y no-desbordamiento del servidor loopback (`server.py` en puerto 4173 en viewports 1440px, 768px y 390px), y entrega de la guía de revisión local para el propietario. R3-02 formal permanece `NOT_STARTED` / `PENDING_HUMAN`; R3-03 a R3-05 y R4 permanecen `BLOCKED`.
    - `R3-02-GIT-CONSOLIDATION-01`: Consolidación de iteraciones UX-EXP-01 a UX-EXP-06, validación integral de integridad, commit y push controlado a `integration/r1-02c` (`DONE` tras confirmación de sincronización remota). Consolida el trabajo de optimización WebGL2, enrutamiento independiente y hash routing, rediseño de ficha de oportunidad conforme a Tailwind CSS v4.3.3, erradicación del triaje rápido, hero de fuente oficial verificada, resumen con iconos Lucide y política estricta de omisión visual de datos no publicados. Incorpora las 7 auditorías (`docs/audits/r3-02-*.md`), la guía de evaluación local (`docs/audits/r3-02-preview-readiness-2026-11-19.md`) y la plantilla de feedback informal (`docs/research/r3-02-informal-feedback-template.md`). Suite completa aprobada (193 pruebas Python, 14 pruebas Playwright E2E, 9 contratos estáticos, validación y build de catálogo). Schema 2 y archivos canónicos criptográficamente idénticos a `9d747c5`. Próximo paso: ejecución empírica de trabajo de campo humano R3-02. Estados de gobernanza: R3-02 permanece `NOT_STARTED` / `PENDING_HUMAN`; R3-03 a R3-05 y R4 permanecen estrictamente `BLOCKED`.
    - `R3-02-PREVIEW-02`: Preparación y verificación del entorno de evaluación personal y círculo reducido (`DONE` -> `docs/audits/r3-02-preview-02-acceptance-2026-11-20.md`). Reconciliación del estado real sobre el commit `b3e69e9` en `integration/r1-02c`, armonización de modificaciones del working tree (modernización de tarjetas y panel de filtros en `app.js`, `index.html` y compilación Tailwind `styles.css`) con contratos estáticos y selectores E2E; auditoría integral de seguridad de `server.py` (enlace exclusivo a loopback `127.0.0.1:4173`, validación de `Host`, lista blanca estricta de archivos y bloqueo 404 contra rutas privadas); verificación del 100% de la suite de pruebas (193 pruebas Python, 14 pruebas Playwright E2E en Chromium y Mobile Pixel 5, validación Schema 2); comprobación rigurosa del caso OP-005 (CookUnity); entrega de la guía amigable para evaluadores no técnicos (`docs/research/r3-02-owner-circle-evaluation-guide.md`) articulada con la plantilla de feedback informal (`docs/research/r3-02-informal-feedback-template.md`). Preservación estricta de gobernanza: feedback informal separado de investigación formal R3-02 (`NOT_STARTED` / `PENDING_HUMAN`); R3-03 a R3-05 y R4 continúan estrictamente `BLOCKED`. Cero dependencias añadidas, sin merge a `main`, sin deploy a GitHub Pages y sin push remoto.
    - `R3-02-PREVIEW-03`: Reconciliación Git y entrega controlada de la versión de evaluación (`DONE` -> `docs/audits/r3-02-preview-03-git-delivery-2026-11-20.md`). Resolución de discrepancia entre estado local y remoto: confirmación forense de que HEAD `b3e69e9` coincidía con el remoto mientras las mejoras validadas de PREVIEW-02 residían en el working tree sin versionar. Empaquetamiento y commit estructurado de cambios de UI (`app.js`, `index.html`, `styles.css`) y paquete documental (`r3-02-preview-02-acceptance-2026-11-20.md`, `r3-02-owner-circle-evaluation-guide.md`, `r3-02-preview-03-git-delivery-2026-11-20.md`). Suite completa validada (193 tests Python, 14 tests Playwright E2E Desktop/Mobile, Schema 2 inalterado, compilación Tailwind v4.3.3 en 68 KB). Sincronización mediante push normal a `origin/integration/r1-02c`. Entrega con doble modalidad para amigos (presencial / clonado independiente). Preservación estricta: R3-02 formal permanece `NOT_STARTED` / `PENDING_HUMAN`; R3-03 a R3-05 y R4 permanecen `BLOCKED`; sin merge a `main` ni despliegue en producción.
    - `R3-02-OWNER-FEEDBACK-01`: Registro de evaluación informal del círculo cercano (`COMPLETED_WITH_LIMITED_FEEDBACK` -> `docs/research/r3-02-owner-circle-feedback-2026-11-20.md`). Registro documental riguroso del feedback general transmitido verbalmente por el propietario tras pruebas informales con amistades (diseño bien valorado, percepción intuitiva y suficiencia de información), autorizando continuar el proyecto. Separación deontológica total: no se inventaron participantes, tiempos ni métricas; las plantillas formales `P01.md` a `P08.md` permanecen intactas en `PENDING_EXECUTION`. La investigación formal R3-02 continúa en `NOT_STARTED` / `PENDING_HUMAN`. R3-03 a R3-05 y R4 permanecen estrictamente `BLOCKED`. Cero dependencias añadidas, sin merge a `main` ni despliegue.
    - `R3-02-PRIVATE-ALPHA-01`: Recalibración del alcance, preparación y gobernanza de la Alpha privada (`DONE` -> `docs/architecture/r3-private-alpha-scope-decision-2026-11-20.md`). Formalización de dos niveles de madurez desacoplados: Nivel 1 (Alpha privada para uso personal y círculo reducido, con criterios técnicos y de seguridad 100% satisfechos, identificando la ampliación del inventario de vacantes reales como prioridad 1) vs. Nivel 2 (Producto validado para audiencia amplia, con R3-02 formal preservado en `NOT_STARTED` / `PENDING_HUMAN`). Matriz de priorización crítica de 12 funcionalidades (descartando sobreingeniería prematura como login, persistencia multiusuario, recomendaciones opacas o alertas automáticas). R3-03 a R3-05 y R4 permanecen estrictamente `BLOCKED`. Cero dependencias añadidas, sin merge a `main` ni despliegue.
  - `R3-03`: Análisis y consolidación de hallazgos (`BLOCKED`: bloqueado hasta que existan al menos 5 sesiones humanas válidas con representación de P-EST, P-EGR y P-JUN).
  - `R3-04`: Refactor/Fix UX justificado (`BLOCKED`).
  - `R3-05`: Decisión documentada sobre si el MVP satisface los criterios originales (`BLOCKED`).
- **R4 — Automatización Controlada:** **Bloqueada** hasta que R3 demuestre valor con usuarios y justifique técnica y éticamente la adquisición automática.
