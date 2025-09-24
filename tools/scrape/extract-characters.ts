import fs from "node:fs";
import { JSDOM } from "jsdom";
import type { Character } from "../../src/types.ts";

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
const categories: string[] = [];

for (const route of characterLinks) {
  const link = baseURL + route;

  // If in cache, load from there
  if (!fs.existsSync(`${cacheFolder}/${route}.html`)) {
    // Scrape and save
    const response = await fetch(link);
    if (!response.ok) {
      console.warn(`Failed to fetch ${link}: ${response.statusText}`);
      continue;
    }
    const text = await response.text();
    fs.writeFileSync(`${cacheFolder}/${route}.html`, text);
    console.log(`Saved ${route}.html`);
  }

  // Parse and extract
  const html = fs.readFileSync(`${cacheFolder}/${route}.html`, "utf-8");
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const name = document.querySelector(".page-header__title")?.textContent?.trim() || null;
  if (!name) {
    console.warn(`No name found for ${link}`);
    continue;
  }
  const categories = Array.from(document.querySelectorAll("li.category.normal"))
    .map(el => el as HTMLLIElement)
    .map(e => e.dataset.name || null)
    .filter(Boolean);
  console.log(categories);

  // Partial write
  fs.writeFileSync(charactersFile, JSON.stringify(characters, null, 2));

  break; // TODO debug only
}

// Write final output
fs.writeFileSync(charactersFile, JSON.stringify(characters, null, 2));