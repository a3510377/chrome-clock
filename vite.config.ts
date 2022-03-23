import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { config } from "dotenv";

export const r = (...args: string[]) => resolve(__dirname, ...args);

config();

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "development" || !process.env.VITE_BASE
      ? "/"
      : process.env.VITE_BASE,
  plugins: [vue()],
  resolve: {
    alias: [{ find: "@", replacement: r("src") }],
  },
});
