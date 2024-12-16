import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

export default defineConfig({
  base: process.env.BASE_URL,
  plugins: [viteCompression(), ViteMinifyPlugin()],
});
