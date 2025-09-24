import fs from "node:fs";
import type { Character } from "../../src/types.ts";
import Crypto from "node:crypto";

function categoryHash(input: string): string {
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

const cacheFolder = "tools/cache/characters";
if (!fs.existsSync(cacheFolder)) {
  fs.mkdirSync(cacheFolder, { recursive: true });
}
const infoBoxCacheFolder = `tools/cache/info-boxes`;
if (!fs.existsSync(infoBoxCacheFolder)) {
  fs.mkdirSync(infoBoxCacheFolder, { recursive: true });
}

async function fetchMetadata(uriEncodedName: string) {
  const fsSafeName = uriEncodedName.replaceAll("/", "_").replaceAll("\\", "_");

  const categoryData = await fetch(`https://starwars.fandom.com/api.php?action=parse&page=${uriEncodedName}&prop=categories&format=json`);
  const propertiesData = await fetch(`https://starwars.fandom.com/api.php?action=parse&page=${uriEncodedName}&format=json&prop=properties`);

  if (!categoryData.ok) {
    console.warn(`Failed to fetch categories for ${uriEncodedName}: ${categoryData.statusText}`);
    return null;
  }
  if (!propertiesData.ok) {
    console.warn(`Failed to fetch properties for ${uriEncodedName}: ${propertiesData.statusText}`);
    return null;
  }

  const propertiesJson = await propertiesData.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infoBoxData: { type: string, data: any }[] = JSON.parse(propertiesJson.parse.properties.at(1)["*"]).at(0).data;

  // Save info box to file for later processing
  fs.writeFileSync(`${infoBoxCacheFolder}/${fsSafeName}.json`, JSON.stringify(infoBoxData, null, 2));

  const name = infoBoxData.find(box => box.type === "title")?.data?.value;

  if (!name) {
    console.warn(`No name found for ${uriEncodedName}`);
    return null;
  }

  const imageURL = infoBoxData.find(box => box.type === "image")?.data?.at(0) || null;
  if (!imageURL) {
    console.warn(`No image found for ${uriEncodedName}`);
  }

  const categoryJson = await categoryData.json();
  const categories: string[] = categoryJson.parse.categories.map((cat: { "*": string }) => cat["*"].replaceAll("_", " "));

  return {
    name,
    imageURL,
    categories,
  };
}

const characters: Character[] = [];
const categoryLookup: Record<string, string> = {}; // Hash: category name
const categoryLookupReverse: Record<string, string> = {}; // Category name: hash

for (const route of characterLinks) {
  const res = await fetchMetadata(characterLinks[25981]);
  if (!res) continue;

  const { name, categories, imageURL } = res;

  const character: Character = {
    n: name,
    r: route,
    ...(categoryHashes.length > 0 ? { c: categoryHashes } : {}),
    ...(imageURL ? { i: imageURL } : {}),
  };
  break;
}

// const wikiBaseURL = "https://starwars.fandom.com/wiki/";

// async function downloadHTML(route: string) {
//   const link = wikiBaseURL + route;
//   const fsSafeRoute = route.replaceAll("/", "_").replaceAll("\\", "_");

//   // If in cache, load from there
//   if (!fs.existsSync(`${cacheFolder}/${fsSafeRoute}.html`)) {
//     // Scrape and save
//     const response = await fetch(link);
//     if (!response.ok) {
//       console.warn(`Failed to fetch ${link}: ${response.statusText}`);
//       return false;
//     }
//     const text = await response.text();
//     fs.writeFileSync(`${cacheFolder}/${fsSafeRoute}.html`, text);
//     console.log(`Saved ${fsSafeRoute}.html`);
//   }
//   else {
//     console.log("Reading from cache:", fsSafeRoute);
//   }

//   return true;
// }

// let failCount = 0;
// let activeFetchers = 0;
// while (characterLinks.length > 0) {
//   if (activeFetchers >= 10) {
//     // Wait a bit
//     await new Promise((resolve) => setTimeout(resolve, 10));
//     continue;
//   }

//   const route = characterLinks.shift();
//   if (!route) break;

//   activeFetchers++;
//   downloadHTML(route)
//     .then((result) => {
//       activeFetchers--;
//       if (!result) failCount++;
//       return result;
//     });
// }

// console.log("HTML download complete." + (failCount > 0 ? ` Failed to download ${failCount} files.` : ""));


// import { JSDOM } from "jsdom";

// const imageBaseURL = "https://static.wikia.nocookie.net/starwars/images/";
// // Ensure output directory exists
// const outFolder = "tools/out";
// if (!fs.existsSync(outFolder)) {
//   fs.mkdirSync(outFolder, { recursive: true });
// }
// const charactersFile = `${outFolder}/characters.json`;
// const categoriesFile = `${outFolder}/categories.json`;

// // route: Character data
// const characters: Record<string, Character> = {};

// /** Hash: category name */
// const categoriesLookup: Record<string, string> = {};
// /** Name: hash */
// const categoriesLookupReverse: Record<string, string> = {};


// // Parse and extract
// const html = fs.readFileSync(`${cacheFolder}/${fsSafeRoute}.html`, "utf-8");
// const dom = new JSDOM(html);
// const document = dom.window.document;

// const name = document.querySelector(".page-header__title")?.textContent?.trim() || null;
// if (!name) {
//   console.warn(`No name found for ${link}`);
//   continue;
// }
// const categoryNames = Array.from(document.querySelectorAll("li.category.normal"))
//   .map(el => el as HTMLLIElement)
//   .map(e => e.dataset.name || null)
//   .filter(Boolean) as string[];

// for (const name of categoryNames) {
//   const categoryHash = catHash(name);
//   if (!categoriesLookup[categoryHash]) {
//     categoriesLookup[categoryHash] = name;
//     categoriesLookupReverse[name] = categoryHash;
//   }
// }
// const categoryHashes = categoryNames.map(c => categoriesLookupReverse[c]);

// let imageURL = document.head.querySelector("meta[property='og:image']")?.getAttribute("content")
//   || document.querySelector("img.pi-image-thumbnail")?.getAttribute("src")
//   || null;

// if (imageURL) {
//   const cleanedImageURL = new URL(imageURL);
//   cleanedImageURL.searchParams.delete("cb");
//   const minifiedURL = cleanedImageURL.href.replace(imageBaseURL, "");
//   imageURL = minifiedURL;
// }

// if (characters[route]) {
//   // This should really never happen
//   console.warn(`Duplicate character found: ${route} (${name})`);
//   throw new Error("Duplicate character " + route);
// }

// // Compile character
// characters[route] = {
//   // Pretty name
//   n: name,
//   // Route
//   r: route,
//   // Categories
//   ...(categoryNames.length > 0 ? { c: categoryHashes } : {}),
//   // Image URL
//   ...(imageURL ? { i: imageURL } : {}),
// }

// // Partial write
// fs.writeFileSync(charactersFile, JSON.stringify(characters));
// fs.writeFileSync(categoriesFile, JSON.stringify(categoriesLookup));

// // Cleanup
// dom.window.close();
// if (global.gc) {
//   global.gc();
// }

// Write final output
// fs.writeFileSync(charactersFile, JSON.stringify(characters, null, 2));
// fs.writeFileSync(categoriesFile, JSON.stringify(categoriesLookup, null, 2));