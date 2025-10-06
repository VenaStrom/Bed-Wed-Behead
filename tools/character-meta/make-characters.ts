import fs from "node:fs";
import Crypto from "node:crypto";
import { JSDOM } from "jsdom";
import type { Character } from "../../src/types.ts";
import type { MWParsePage } from "../types.ts";

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
const canonAppearanceLookupPath = "tools/out/appearance-canon-lookup.json";
const nonCanonAppearanceLookupPath = "tools/out/appearance-non-canon-lookup.json";
const legendsAppearanceLookupPath = "tools/out/appearance-legends-lookup.json";
const nonCanonLegendsAppearanceLookupPath = "tools/out/appearance-non-canon-legends-lookup.json";

const characters: Character[] = [];
const categoryLookup: Record<string, string> = {}; // Hash: category name
const canonAppearanceLookup: Record<string, string> = {}; // Hash: appearance name
const nonCanonAppearanceLookup: Record<string, string> = {}; // Hash: appearance name
const legendsAppearanceLookup: Record<string, string> = {}; // Hash: appearance name
const nonCanonLegendsAppearanceLookup: Record<string, string> = {}; // Hash: appearance name

let processed = 1;
async function makeCharacter(characterRoute: string) {
  console.log(`Current (${processed} / ${characterLinks.length}): ${characterRoute}`);

  const fsSafeName = characterRoute.replaceAll("/", "_").replaceAll("\\", "_");
  const metaCachePath = `${apiResponseCacheFolder}/${fsSafeName}.json`;
  const domCachePath = `${domCacheFolder}/${fsSafeName}.html`;
  const [metaFile, domFile] = await Promise.all([metaCachePath, domCachePath].map(p => fs.readFileSync(p, "utf-8")));

  const character: Partial<Character> = { route: characterRoute };

  /*
   * Get pretty name and categories from metadata file
   */
  const meta = JSON.parse(metaFile) as MWParsePage;

  const title = meta.title;
  if (!title) throw new Error("No title found in metadata");
  character.name = title;

  const categories = meta.categories?.map(cat => cat["*"]) || [];
  character.categories = categories.map(hash64bit);
  for (const category of categories) {
    const hash = hash64bit(category);
    if (!categoryLookup[hash]) categoryLookup[hash] = category;
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

  const isCanonArticle = categories.includes("Canon_articles");

  /*
  * DOM crawling
  */
  const startLine = domFile.split("\n").findIndex(l => l.includes('id="Appearances"')) || null;
  const endLine = domFile.split("\n").findIndex(l => l.includes('id="Sources"')) || null;
  let smallerDOM = null;
  if (startLine && endLine && startLine < endLine) smallerDOM = domFile.split("\n").slice(startLine, endLine).join("\n");
  else if (startLine) smallerDOM = domFile.split("\n").slice(startLine).join("\n");

  if (!smallerDOM) console.warn(`No "Appearances" section found in DOM for ${characterRoute}, skipping appearances`);
  else {
    const document = JSDOM.fragment(smallerDOM);

    const canonAppearances = getAppearancesFromDOM(document, "#Appearances");
    for (const canonAppearance of canonAppearances) {
      const hash = hash64bit(canonAppearance);
      if (isCanonArticle && !canonAppearanceLookup[hash]) canonAppearanceLookup[hash] = canonAppearance;
      if (!isCanonArticle && !legendsAppearanceLookup[hash]) legendsAppearanceLookup[hash] = canonAppearance;
    }
    if (isCanonArticle) character.canonAppearances = canonAppearances.map(hash64bit);
    else character.legendsAppearances = canonAppearances.map(hash64bit);

    const nonCanonAppearances = getAppearancesFromDOM(document, "#Non-canon_appearances");
    for (const nonCanonAppearance of nonCanonAppearances) {
      const hash = hash64bit(nonCanonAppearance);
      if (isCanonArticle && !nonCanonAppearanceLookup[hash]) nonCanonAppearanceLookup[hash] = nonCanonAppearance;
      if (!isCanonArticle && !nonCanonLegendsAppearanceLookup[hash]) nonCanonLegendsAppearanceLookup[hash] = nonCanonAppearance;
    }
    if (isCanonArticle) character.nonCanonAppearances = nonCanonAppearances.map(hash64bit);
    else character.nonCanonLegendsAppearances = nonCanonAppearances.map(hash64bit);
  }

  const prunedCharacter: Character = {
    name: character.name,
    route: character.route,
    ...character.image ? { image: character.image } : {},
    ...character.categories ? { categories: character.categories } : {},
    ...isCanonArticle && character.canonAppearances?.length ? { canonAppearances: character.canonAppearances } : {},
    ...isCanonArticle && character.nonCanonAppearances?.length ? { nonCanonAppearances: character.nonCanonAppearances } : {},
    ...!isCanonArticle && character.legendsAppearances?.length ? { legendsAppearances: character.legendsAppearances } : {},
    ...!isCanonArticle && character.nonCanonLegendsAppearances?.length ? { nonCanonLegendsAppearances: character.nonCanonLegendsAppearances } : {},
  } as Character; // Since Partial<Character> may still have undefined fields

  characters.push(prunedCharacter);

  processed++;
}

for (let i = 0; i < characterLinks.length; i++) {
  const link = characterLinks[i];
  try {
    await makeCharacter(link);
  }
  catch (e) {
    console.error("Error processing character:", link, e);
  }

  if (i % 1000 === 0) {
    saveToFiles();
  }
}

process.on("unhandledRejection", () => {
  saveToFiles();
  process.exit(1);
});

process.on("exit", () => {
  saveToFiles();
  process.exit(0);
});


function saveToFiles() {
  fs.writeFileSync(outPath, JSON.stringify(characters, null, 2), "utf-8");
  fs.writeFileSync(categoryLookupPath, JSON.stringify(categoryLookup, null, 2), "utf-8");
  fs.writeFileSync(canonAppearanceLookupPath, JSON.stringify(canonAppearanceLookup, null, 2), "utf-8");
  fs.writeFileSync(nonCanonAppearanceLookupPath, JSON.stringify(nonCanonAppearanceLookup, null, 2), "utf-8");
  fs.writeFileSync(legendsAppearanceLookupPath, JSON.stringify(legendsAppearanceLookup, null, 2), "utf-8");
  fs.writeFileSync(nonCanonLegendsAppearanceLookupPath, JSON.stringify(nonCanonLegendsAppearanceLookup, null, 2), "utf-8");
  console.log(`Wrote ${categoryLookupPath}`);
  console.log(`Wrote ${canonAppearanceLookupPath}`);
  console.log(`Wrote ${nonCanonAppearanceLookupPath}`);
  console.log(`Wrote ${legendsAppearanceLookupPath}`);
  console.log(`Wrote ${nonCanonLegendsAppearanceLookupPath}`);
}

function hash64bit(input: string): string {
  const hash = Crypto.createHash("sha256");
  const data = hash.update(input, "utf-8");
  const digest = data.digest("hex");
  const truncated = digest.slice(0, 8); // First 8 bytes = 64 bits

  return truncated;
}

function getAppearancesFromDOM(document: Document | DocumentFragment, selector: string): string[] {
  const appearanceElements = document.querySelector(selector)
    ?.parentElement?.nextElementSibling
    ?.querySelectorAll("li a") || [];

  const appearances = [...new Set([...appearanceElements]
    .map(a => a.getAttribute("title")))]
    .filter(Boolean) as string[];

  return appearances;
}