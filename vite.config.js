import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "/Speech-to-Text-Vue/",
  plugins: [vue()],
});
