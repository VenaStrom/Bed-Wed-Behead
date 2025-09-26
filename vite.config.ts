import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";

// Copy static files to public directory
fs.cpSync("tools/out/category-lookup.json", "src/db/category-lookup.json", { force: true, recursive: true });
fs.cpSync("tools/out/characters.min.json", "src/db/characters.min.json", { force: true, recursive: true });
fs.cpSync("tools/out/character-links.min.json", "src/db/characters-links.min.json", { force: true, recursive: true });

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