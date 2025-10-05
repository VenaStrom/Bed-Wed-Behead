import fs from "node:fs";
import Crypto from "node:crypto";
import type { Character } from "../../src/types.ts";
import type { MWParsePage } from "../types.ts";

import { JSDOM } from "jsdom";

const imageBaseURL = "https://static.wikia.nocookie.net/starwars/images/";

const apiResponseCacheFolder = "tools/cache/api-response";
const domCacheFolder = "tools/cache/dom";

const characterLinksPath = "tools/out/character-links.pruned.json";
if (!fs.existsSync(characterLinksPath)) {
  throw new Error(`File not found: ${characterLinksPath}`);
}
const characterLinks: string[] = JSON.parse(fs.readFileSync(characterLinksPath, "utf-8"));

const outPath = "tools/out/characters.raw.json";
const categoryLookupPath = "tools/out/category-lookup.json";
const categoryLookupReversePath = "tools/out/category-lookup-reverse.json";
const appearanceLookupPath = "tools/out/appearance-lookup.json";
const appearanceLookupReversePath = "tools/out/appearance-lookup-reverse.json";

const categoryLookup: Record<string, string> = {}; // Hash: category name
const categoryLookupReverse: Record<string, string> = {}; // Category name: hash
const appearanceLookup: Record<string, string> = {}; // Hash: appearance name
const appearanceLookupReverse: Record<string, string> = {}; // Appearance name: hash

// Wipe character file to start appending to it
fs.writeFileSync(outPath, "[", "utf-8");

let processed = 1;
async function makeCharacter(characterRoute: string) {
  console.log(`Current (${processed} / ${characterLinks.length}): ${characterRoute}`);

  const fsSafeName = characterRoute.replaceAll("/", "_").replaceAll("\\", "_");
  const metaCachePath = `${apiResponseCacheFolder}/${fsSafeName}.json`;
  const domCachePath = `${domCacheFolder}/${fsSafeName}.html`;
  const [metaFile, domFile] = await Promise.all([metaCachePath, domCachePath].map(p => fs.readFileSync(p, "utf-8")));

  const character: Partial<Character> = { route: characterRoute };

  // Get pretty name and categories from metadata file
  const meta = JSON.parse(metaFile) as MWParsePage;

  const title = meta.title;
  if (!title) throw new Error("No title found in metadata");
  character.name = title;

  const categories = meta.categories?.map(cat => cat["*"]) || [];
  character.categories = categories.map(hash64bit);
  for (const category of categories) {
    const hash = hash64bit(category);
    if (!categoryLookup[hash]) {
      categoryLookup[hash] = category;
      categoryLookupReverse[category] = hash;
    }
  }

  const infoboxImg = JSON.parse(meta.properties?.find(p => p.name === "infoboxes")?.["*"] || "{}")?.[0]?.data?.find((box: { type: string, data: object }) => box.type === "image")?.data?.[0]?.url || null;
  if (infoboxImg) {
    if (!infoboxImg.startsWith(imageBaseURL)) {
      console.warn(`Infobox image URL does not start with base URL: ${infoboxImg} for ${characterRoute}, skipping`);
    }
    else {
      const imgURL = infoboxImg.replace(imageBaseURL, "");
      character.image = imgURL;
    }
  }

  // Get image and appearance from DOM file
  const dom = new JSDOM(domFile);
  const document = dom.window.document;

  const appearanceElements = document.querySelector("#Appearances")?.parentElement?.nextElementSibling?.querySelectorAll("li a") || [];
  const appearances = [...new Set(Array.from(appearanceElements)
    .map(a => a.textContent?.trim() || "")
    .filter(n => n))];

  character.appearance = appearances.map(hash64bit);

  for (const appearance of appearances) {
    const hash = hash64bit(appearance);
    if (!appearanceLookup[hash]) {
      appearanceLookup[hash] = appearance;
      appearanceLookupReverse[appearance] = hash;
    }
  }

  const prunedCharacter: Character = {
    name: character.name,
    route: character.route,
    ...character.image ? { image: character.image } : {},
    ...character.appearance ? { appearance: character.appearance } : {},
    ...character.categories ? { categories: character.categories } : {},
  } as Character; // Since Partial<Character> may still have undefined fields

  // Append to file
  fs.appendFileSync(outPath, (processed === 1 ? "\n\t" : ",\n\t") + JSON.stringify(prunedCharacter, null, 2).replace(/\n/g, "\n\t"), "utf-8");
  processed++;
}

await makeCharacter("Padm%C3%A9_Amidala");

// for (let i = 0; i < characterLinks.length; i++) {
//   const link = characterLinks[i];
//   try {
//     makeCharacter(link);
//   }
//   catch (e) {
//     console.error("Error processing character:", link, e);
//   }

//   // Write to file every 10 characters
//   if (i % 10 === 0) {
//     fs.writeFileSync(outPath, JSON.stringify(characters, null, 2), "utf-8");
//     fs.writeFileSync(categoryLookupPath, JSON.stringify(categoryLookup, null, 2), "utf-8");
//     fs.writeFileSync(categoryLookupReversePath, JSON.stringify(categoryLookupReverse, null, 2), "utf-8");
//     fs.writeFileSync(appearanceLookupPath, JSON.stringify(appearanceLookup, null, 2), "utf-8");
//     fs.writeFileSync(appearanceLookupReversePath, JSON.stringify(appearanceLookupReverse, null, 2), "utf-8");
//   }
// }

fs.appendFileSync(outPath, "\n]", "utf-8");
fs.writeFileSync(categoryLookupPath, JSON.stringify(categoryLookup, null, 2), "utf-8");
fs.writeFileSync(categoryLookupReversePath, JSON.stringify(categoryLookupReverse, null, 2), "utf-8");
fs.writeFileSync(appearanceLookupPath, JSON.stringify(appearanceLookup, null, 2), "utf-8");
fs.writeFileSync(appearanceLookupReversePath, JSON.stringify(appearanceLookupReverse, null, 2), "utf-8");
console.log(`\nFinished ${outPath}`);
console.log(`Wrote ${categoryLookupPath}`);
console.log(`Wrote ${categoryLookupReversePath}`);
console.log(`Wrote ${appearanceLookupPath}`);
console.log(`Wrote ${appearanceLookupReversePath}\n`);

function hash64bit(input: string): string {
  const hash = Crypto.createHash("sha256");
  const data = hash.update(input, "utf-8");
  const digest = data.digest("hex");
  const truncated = digest.slice(0, 8); // First 8 bytes = 64 bits

  return truncated;
}