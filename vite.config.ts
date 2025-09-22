import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  define: {
    "__BUILD_DATE__": JSON.stringify(new Date().toLocaleDateString("en-SE", { year: "numeric", month: "2-digit", day: "2-digit" })),
  },
}) satisfies UserConfig;