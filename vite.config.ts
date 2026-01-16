import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Cook-Book/', // GitHub Pages repo name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
