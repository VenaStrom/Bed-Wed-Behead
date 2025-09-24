import fs from "node:fs";
import { JSDOM } from "jsdom";
import { Character } from "../types.ts";

const characterLinksPath = "tools/out/character-links.pruned.json";
if (!fs.existsSync(characterLinksPath)) {
  throw new Error(`File not found: ${characterLinksPath}`);
}
const characterLinks: string[] = JSON.parse(fs.readFileSync(characterLinksPath, "utf-8"));

const baseURL = "https://starwars.fandom.com/wiki/";

// Ensure output directory exists
const cacheFolder = "tools/cache/characters";
if (!fs.existsSync(cacheFolder)) {
  fs.mkdirSync(cacheFolder, { recursive: true });
}
const outFolder = "tools/out";
if (!fs.existsSync(outFolder)) {
  fs.mkdirSync(outFolder, { recursive: true });
}
const charactersFile = `${outFolder}/characters.json`;

const characters: Record<string, Character> = {};
for (const route of characterLinks) {
  const link = baseURL + route;
  console.log(link);

  // Partial write
  fs.writeFileSync(charactersFile, JSON.stringify(characters, null, 2));

  break; // TODO debug only
}

// Write final output
fs.writeFileSync(charactersFile, JSON.stringify(characters, null, 2));