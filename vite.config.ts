import { resolve } from 'path';
import { defineConfig } from 'vite';
import utwm from 'unplugin-tailwindcss-mangle/vite';
import viteCompression from 'vite-plugin-compression';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

export default defineConfig({
  base: process.env.BASE_URL,
  plugins: [
    utwm({ classGenerator: { classPrefix: '' } }),
    viteCompression(),
    ViteMinifyPlugin(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'chrome/popup/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
