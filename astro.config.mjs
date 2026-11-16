import { defineConfig } from 'astro/config';

function resolveSiteUrl() {
  // 1. Variable explícita SITE_URL
  if (process.env.SITE_URL) {
    const raw = process.env.SITE_URL.trim().replace(/\/$/, '');
    return raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
  }

  // 2. Entorno de producción en Vercel
  if (process.env.VERCEL_ENV === 'production') {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim().replace(/\/$/, '')}`;
    }
    return 'https://publidoc-2b3m.vercel.app';
  }

  // 3. Entorno de Vista Previa (Preview) en Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim().replace(/\/$/, '')}`;
  }

  // 4. Compilación de producción estándar (CI o npm run build local)
  if (process.env.NODE_ENV === 'production' && !process.env.ASTRO_DEV) {
    return 'https://publidoc-2b3m.vercel.app';
  }

  // 5. Entorno de desarrollo local (Astro dev corre sobre HTTP en puerto 4321)
  return 'http://localhost:4321';
}

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: resolveSiteUrl(),
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: {
    format: 'directory'
  }
});
