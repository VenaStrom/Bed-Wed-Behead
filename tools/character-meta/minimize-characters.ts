import fs from "node:fs";
import type { Character, CharacterMinimized } from "../../src/types.ts";

const charactersRaw: Character[] = JSON.parse(fs.readFileSync("tools/out/characters.raw.json", "utf-8"));
const outPath = "tools/out/characters.min.json";

// Minimizing will entail making it into a lookup table with optimized stringified props
const charactersMinimized: Record<string, CharacterMinimized> = {};
const categoryJoiner = "|";

for (const char of charactersRaw) {
  charactersMinimized[char.r] = {
    n: char.n,
    r: char.r,
    ...(char.i && { i: char.i }),
    ...(char.c && { c: char.c.join(categoryJoiner) }),
  };
}

const outWithMeta = {
  joiner: categoryJoiner,
  characters: charactersMinimized,
}

fs.writeFileSync(outPath, JSON.stringify(outWithMeta), "utf-8");