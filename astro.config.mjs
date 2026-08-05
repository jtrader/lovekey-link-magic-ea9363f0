import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'jspdf': fileURLToPath(new URL('./src/lib/jspdf-shim.ts', import.meta.url)),
        '@tanstack/react-router': fileURLToPath(new URL('./src/lib/tanstack-shim.tsx', import.meta.url)),
        '@tanstack/react-start': fileURLToPath(new URL('./src/lib/tanstack-start-shim.ts', import.meta.url)),
        '@lovable.dev/cloud-auth-js': fileURLToPath(new URL('./src/lib/lovable-shim.ts', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
