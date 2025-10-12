import fs from "node:fs";
import type { Character } from "../../src/types.ts";

let characters: Character[] = JSON.parse(fs.readFileSync("tools/out/characters.raw.json", "utf-8"));
const outPath = "tools/out/characters.min.json";

// Remove categories that annoyingly have character pages
characters = characters.filter(c =>
  !c.route.toLowerCase().startsWith("category:")
  &&
  !c.name.toLowerCase().startsWith("category:")
  &&
  !c.route.toLowerCase().startsWith("user:")
  &&
  !c.name.toLowerCase().startsWith("user:")
);

// No line breaks JSON approach
fs.writeFileSync(outPath, JSON.stringify(characters), "utf-8");
