import fs from "node:fs";
import type { Character } from "../../src/types.ts";

const charactersRaw: Character[] = JSON.parse(fs.readFileSync("tools/out/characters.raw.json", "utf-8"));

console.log(charactersRaw.length);