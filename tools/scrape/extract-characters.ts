import fs from "node:fs";
import { JSDOM } from "jsdom";
import type { Character } from "../../src/types.ts";
import Crypto from "node:crypto";

function catHash(input: string): string {
  const hash = Crypto.createHash("sha256");
  const data = hash.update(input, "utf-8");
  const digest = data.digest("hex");
  const truncated = digest.slice(0, 8); // First 8 bytes = 64 bits

  return truncated
}

const characterLinksPath = "tools/out/character-links.pruned.json";
if (!fs.existsSync(characterLinksPath)) {
  throw new Error(`File not found: ${characterLinksPath}`);
}
const characterLinks: string[] = JSON.parse(fs.readFileSync(characterLinksPath, "utf-8"));

const baseURL = "https://starwars.fandom.com/wiki/";
const imageBaseURL = "https://static.wikia.nocookie.net/starwars/images/";

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
const categoriesFile = `${outFolder}/categories.json`;

// route: Character data
const characters: Record<string, Character> = {};

/** Hash: category name */
const categoriesLookup: Record<string, string> = {};
/** Name: hash */
const categoriesLookupReverse: Record<string, string> = {};

for (const route of characterLinks) {
  const link = baseURL + route;
  const fsSafeRoute = route.replaceAll("/", "_");

  // If in cache, load from there
  if (!fs.existsSync(`${cacheFolder}/${fsSafeRoute}.html`)) {
    // Scrape and save
    const response = await fetch(link);
    if (!response.ok) {
      console.warn(`Failed to fetch ${link}: ${response.statusText}`);
      continue;
    }
    const text = await response.text();
    fs.writeFileSync(`${cacheFolder}/${fsSafeRoute}.html`, text);
    console.log(`Saved ${fsSafeRoute}.html`);
  }

  // Parse and extract
  const html = fs.readFileSync(`${cacheFolder}/${fsSafeRoute}.html`, "utf-8");
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const name = document.querySelector(".page-header__title")?.textContent?.trim() || null;
  if (!name) {
    console.warn(`No name found for ${link}`);
    continue;
  }
  const categoryNames = Array.from(document.querySelectorAll("li.category.normal"))
    .map(el => el as HTMLLIElement)
    .map(e => e.dataset.name || null)
    .filter(Boolean) as string[];

  for (const name of categoryNames) {
    const categoryHash = catHash(name);
    if (!categoriesLookup[categoryHash]) {
      categoriesLookup[categoryHash] = name;
      categoriesLookupReverse[name] = categoryHash;
    }
  }
  const categoryHashes = categoryNames.map(c => categoriesLookupReverse[c]);

  let imageURL = document.head.querySelector("meta[property='og:image']")?.getAttribute("content")
    || document.querySelector("img.pi-image-thumbnail")?.getAttribute("src")
    || null;

  if (imageURL) {
    const cleanedImageURL = new URL(imageURL);
    cleanedImageURL.searchParams.delete("cb");
    const minifiedURL = cleanedImageURL.href.replace(imageBaseURL, "");
    imageURL = minifiedURL;
  }

  if (characters[route]) {
    // This should really never happen
    console.warn(`Duplicate character found: ${route} (${name})`);
    throw new Error("Duplicate character " + route);
  }

  // Compile character
  characters[route] = {
    // Pretty name
    n: name,
    // Route
    r: route,
    // Categories
    ...(categoryNames.length > 0 ? { c: categoryHashes } : {}),
    // Image URL
    ...(imageURL ? { i: imageURL } : {}),
  }

  // Partial write
  fs.writeFileSync(charactersFile, JSON.stringify(characters));
  fs.writeFileSync(categoriesFile, JSON.stringify(categoriesLookup));
}

// Write final output
fs.writeFileSync(charactersFile, JSON.stringify(characters, null, 2));
fs.writeFileSync(categoriesFile, JSON.stringify(categoriesLookup, null, 2));