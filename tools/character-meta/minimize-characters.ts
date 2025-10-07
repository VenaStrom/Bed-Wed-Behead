import fs from "node:fs";
import type { Character } from "../../src/types.ts";

const characters: Character[] = JSON.parse(fs.readFileSync("tools/out/characters.raw.json", "utf-8"));
const outPath = "tools/out/characters.min.json";

// No line breaks JSON approach
fs.writeFileSync(outPath, JSON.stringify(characters), "utf-8");
