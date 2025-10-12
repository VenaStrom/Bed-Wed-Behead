import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";

const filesToCopyInToolsOut = [
  "characters.min.json",
  "category-lookup.min.json",
  "appearance-canon-lookup.min.json",
  "appearance-non-canon-lookup.min.json",
  "appearance-legends-lookup.min.json",
  "appearance-non-canon-legends-lookup.min.json",
];

// Copy static files to public directory
for (const file of filesToCopyInToolsOut) {
  fs.cpSync(`tools/out/${file}`, `public/db/${file}`, { force: true, recursive: true });
}

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