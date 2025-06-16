import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
  base: '/',
  build: {
    outDir: "build",
    manifest: true,
    rollupOptions: {
      input: "./app/root.jsx",
    },
  }
});
