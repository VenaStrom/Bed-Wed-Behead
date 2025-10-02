import fs from "node:fs";
import type { Character } from "../../src/types.ts";
import Crypto from "node:crypto";
import { stdout } from "node:process";
import type { MWParsePage } from "../types.ts";

const apiBaseURL = "https://starwars.fandom.com/api.php?format=json&action=parse&page=";

const characterLinksPath = "tools/out/character-links.pruned.json";
if (!fs.existsSync(characterLinksPath)) {
  throw new Error(`File not found: ${characterLinksPath}`);
}
const characterLinks: string[] = JSON.parse(fs.readFileSync(characterLinksPath, "utf-8"));

const apiResponseCacheFolder = "tools/cache/api-response";
if (!fs.existsSync(apiResponseCacheFolder)) {
  fs.mkdirSync(apiResponseCacheFolder, { recursive: true });
}
const allNamesInCache = fs.readdirSync(apiResponseCacheFolder);

const domCacheFolder = "tools/cache/dom";
if (!fs.existsSync(domCacheFolder)) {
  fs.mkdirSync(domCacheFolder, { recursive: true });
}
const allDomsInCache = fs.readdirSync(domCacheFolder);

async function fetchAndSaveCharacterDataToFile(characterName: string) {
  const fsSafeName = characterName.replaceAll("/", "_").replaceAll("\\", "_");
  const metaCachePath = `${apiResponseCacheFolder}/${fsSafeName}.json`;
  const domCachePath = `${domCacheFolder}/${fsSafeName}.html`;

  let parseResponse: MWParsePage | null = null;

  if (allNamesInCache.includes(`${fsSafeName}.json`) && allDomsInCache.includes(`${fsSafeName}.html`)) {
    // Read from cache
    const cachedData = fs.readFileSync(metaCachePath, "utf-8");
    parseResponse = JSON.parse(cachedData) as MWParsePage;
    parseResponse.text = { "*": fs.readFileSync(domCachePath, "utf-8") };
  }
  else {
    // Fetch from API
    const response = (await (await fetch(apiBaseURL + characterName, {
      headers: { "Accept-Encoding": "gzip" }
    })).json()).parse;

    if (!response) {
      console.log(`No data found for ${characterName}`);
      return false;
    }
    parseResponse = response || null;
  }

  if (!parseResponse) {
    console.log(`Somehow no data was retrieved for ${characterName} 🤷‍♀️`);
    return false;
  }

  // Save the dom separately
  if (!allDomsInCache.includes(`${fsSafeName}.html`) && parseResponse.text && parseResponse.text["*"]) {
    fs.writeFileSync(domCachePath, parseResponse.text["*"]);
  }

  // Save to parse result to cache
  if (!allNamesInCache.includes(`${fsSafeName}.json`)) {
    fs.writeFileSync(metaCachePath, JSON.stringify({ ...parseResponse, text: undefined }));
  }

  return true;
}

const fetchPromises = characterLinks.slice(0, 10).map(name => fetchAndSaveCharacterDataToFile(name));
await Promise.all(fetchPromises);


// const imageBaseURL = "https://static.wikia.nocookie.net/starwars/images/";
// const characters: Character[] = [];
// const categoryLookup: Record<string, string> = {}; // Hash: category name
// const categoryLookupReverse: Record<string, string> = {}; // Category name: hash

// async function saveCharacter(route: string) {
//   const res = await fetchMetadata(route);
//   if (!res) return null;

//   const { name, categories, imageURL } = res;

//   const categoryHashes = categories.map(categoryHash);
//   for (const category of categories) {
//     const hash = categoryHash(category);
//     if (!categoryLookup[hash]) {
//       categoryLookup[hash] = category;
//       categoryLookupReverse[category] = hash;
//     }
//   }

//   const character: Character = {
//     name: name,
//     route: route,
//     ...(categoryHashes.length > 0 ? { categories: categoryHashes } : {}),
//     ...(imageURL ? { image: imageURL.replace(imageBaseURL, "") } : {}),
//   };

//   characters.push(character);
// }

// const batchSize = 100;
// const routeBatch: (() => Promise<void>)[] = new Array(Math.floor(characterLinks.length / batchSize))
//   .fill(0)
//   .map(() =>
//     async () => {
//       const batch = characterLinks.splice(0, batchSize);
//       await Promise.all(batch.map(route => saveCharacter(route)));
//     }
//   );
// // Push remaining links as the last batch
// if (characterLinks.length > 0) {
//   routeBatch.push(async () => {
//     await Promise.all(characterLinks.map(route => saveCharacter(route)));
//     characterLinks.splice(0, characterLinks.length); // Clear remaining links
//   });
// }
// const totalBatches = routeBatch.length;

// let i = -1;
// let activeFetches = 0;
// while (routeBatch.length > 0) {
//   if (activeFetches >= 10) {
//     await new Promise((resolve) => setTimeout(resolve, 50)); // Wait a little before retrying
//     continue;
//   }
//   activeFetches++;

//   const batchPromise = routeBatch.shift();
//   if (!batchPromise) break;

//   i++;
//   const percentProgress = ((i / totalBatches) * 100).toFixed(2);

//   stdout.write(`\n${percentProgress.padStart(6, " ")}% - "Batch ${i}"\t\t`);

//   await batchPromise();

//   activeFetches--;

//   // Partial write after each batch
//   fs.writeFileSync("tools/out/characters.raw.json", JSON.stringify(characters));
//   fs.writeFileSync("tools/out/category-lookup.json", JSON.stringify(categoryLookup));
//   fs.writeFileSync("tools/out/category-lookup-reverse.json", JSON.stringify(categoryLookupReverse));
// }

// console.log("Characters fetched:", characters.length);

// fs.writeFileSync("tools/out/characters.raw.json", JSON.stringify(characters));
// fs.writeFileSync("tools/out/category-lookup.json", JSON.stringify(categoryLookup));
// fs.writeFileSync("tools/out/category-lookup-reverse.json", JSON.stringify(categoryLookupReverse));

// process.on("beforeExit", (code) => {
//   console.log("\nProcess exit, writing to files. Code:", code);
//   fs.writeFileSync("tools/out/characters.raw.json", JSON.stringify(characters));
//   fs.writeFileSync("tools/out/category-lookup.json", JSON.stringify(categoryLookup));
//   fs.writeFileSync("tools/out/category-lookup-reverse.json", JSON.stringify(categoryLookupReverse));
// });
// process.on("exit", (code) => {
//   console.log("\nProcess exit, writing to files. Code:", code);
//   fs.writeFileSync("tools/out/characters.raw.json", JSON.stringify(characters));
//   fs.writeFileSync("tools/out/category-lookup.json", JSON.stringify(categoryLookup));
//   fs.writeFileSync("tools/out/category-lookup-reverse.json", JSON.stringify(categoryLookupReverse));
// });

function categoryHash(input: string): string {
  const hash = Crypto.createHash("sha256");
  const data = hash.update(input, "utf-8");
  const digest = data.digest("hex");
  const truncated = digest.slice(0, 8); // First 8 bytes = 64 bits

  return truncated;
}