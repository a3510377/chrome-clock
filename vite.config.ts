import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

export default defineConfig({
  plugins: [viteCompression(), ViteMinifyPlugin()],
});
