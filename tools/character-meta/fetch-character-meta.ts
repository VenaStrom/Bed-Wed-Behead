import fs from "node:fs";
import type { Character } from "../../src/types.ts";
import Crypto from "node:crypto";
import { stdout } from "node:process";
import type { MWPageParseResponse } from "../types.ts";

function categoryHash(input: string): string {
  const hash = Crypto.createHash("sha256");
  const data = hash.update(input, "utf-8");
  const digest = data.digest("hex");
  const truncated = digest.slice(0, 8); // First 8 bytes = 64 bits

  return truncated;
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
const categoryFetchCache = `tools/cache/fetched-categories`;
if (!fs.existsSync(categoryFetchCache)) {
  fs.mkdirSync(categoryFetchCache, { recursive: true });
}
const propertiesFetchCache = `tools/cache/fetched-properties`;
if (!fs.existsSync(propertiesFetchCache)) {
  fs.mkdirSync(propertiesFetchCache, { recursive: true });
}

async function fetchMetadata(uriEncodedName: string) {
  const fsSafeName = uriEncodedName.replaceAll("/", "_").replaceAll("\\", "_");

  const categoryCachePath = `${categoryFetchCache}/${fsSafeName}.json`;
  const propertiesCachePath = `${propertiesFetchCache}/${fsSafeName}.json`;

  const fetchers: (() => Promise<{ ok: boolean, json: () => Promise<{ parse: MWPageParseResponse }>, statusText: string }>)[] = [];
  if (!fs.existsSync(categoryCachePath)) fetchers.push(async () => await fetch(`https://starwars.fandom.com/api.php?action=parse&page=${uriEncodedName}&prop=categories&format=json`));
  else fetchers.push(async () => { return { ok: true, json: async () => JSON.parse(fs.readFileSync(categoryCachePath, "utf-8")), statusText: "From Cache" }; });
  if (!fs.existsSync(propertiesCachePath)) fetchers.push(async () => await fetch(`https://starwars.fandom.com/api.php?action=parse&page=${uriEncodedName}&format=json&prop=properties`));
  else fetchers.push(async () => { return { ok: true, json: async () => JSON.parse(fs.readFileSync(propertiesCachePath, "utf-8")), statusText: "From Cache" }; });

  const [categoryRes, propertiesRes] = await Promise.all(fetchers.map(f => f()));

  if (!categoryRes.ok) {
    console.warn(`Failed to fetch categories for ${uriEncodedName}: ${categoryRes.statusText}`);
    return null;
  }
  if (!propertiesRes.ok) {
    console.warn(`Failed to fetch properties for ${uriEncodedName}: ${propertiesRes.statusText}`);
    return null;
  }

  const categoryJSON = await categoryRes.json();
  const propertiesJSON = await propertiesRes.json();

  // Save fetched data to cache
  if (!fs.existsSync(categoryCachePath) || !fs.existsSync(propertiesCachePath)) {
    fs.writeFileSync(categoryCachePath, JSON.stringify(categoryJSON));
    fs.writeFileSync(propertiesCachePath, JSON.stringify(propertiesJSON));
  }

  const categories: string[] = categoryJSON.parse.categories.map((cat: { "*": string }) => cat["*"].replaceAll("_", " "));
  const hasInfobox = propertiesJSON.parse.properties.findIndex((prop: { name: string, "*": any }) => prop.name === "infoboxes") !== -1;
  if (!hasInfobox) {
    stdout.write(" ⚠️");
    const name = categoryJSON.parse.title;
    return {
      name,
      imageURL: null,
      categories,
    };
  }

  const infoboxData: { type: string, data: any }[] = JSON.parse(
    propertiesJSON.parse.properties.find((prop: { name: string, "*": any }) => prop.name === "infoboxes")["*"],
  ).at(0).data; // Go past the parser_tag_version wrapper

  fs.writeFileSync(`tools/cache/infoboxes/${fsSafeName}.json`, JSON.stringify(infoboxData, null, 2));

  // Prefer getting the name from the infobox title, as it's more likely to be correct than the page title
  const name = infoboxData.find(box => box.type === "title")?.data?.value || categoryJSON.parse.title || null;
  if (!name) {
    console.warn(`No name found for ${uriEncodedName}`);
    return null;
  }

  const imageURL: string | null = infoboxData.find(box => box.type === "image")?.data?.at(0)?.url || null;

  return {
    name,
    imageURL,
    categories,
  };
}

const imageBaseURL = "https://static.wikia.nocookie.net/starwars/images/";
const characters: Character[] = [];
const categoryLookup: Record<string, string> = {}; // Hash: category name
const categoryLookupReverse: Record<string, string> = {}; // Category name: hash

async function saveCharacter(route: string) {
  const res = await fetchMetadata(route);
  if (!res) return null;

  const { name, categories, imageURL } = res;

  const categoryHashes = categories.map(categoryHash);
  for (const category of categories) {
    const hash = categoryHash(category);
    if (!categoryLookup[hash]) {
      categoryLookup[hash] = category;
      categoryLookupReverse[category] = hash;
    }
  }

  const character: Character = {
    name: name,
    route: route,
    ...(categoryHashes.length > 0 ? { categories: categoryHashes } : {}),
    ...(imageURL ? { image: imageURL.replace(imageBaseURL, "") } : {}),
  };

  characters.push(character);
}

const batchSize = 100;
const routeBatch: (() => Promise<void>)[] = new Array(Math.floor(characterLinks.length / batchSize))
  .fill(0)
  .map(() =>
    async () => {
      const batch = characterLinks.splice(0, batchSize);
      await Promise.all(batch.map(route => saveCharacter(route)));
    }
  );
// Push remaining links as the last batch
if (characterLinks.length > 0) {
  routeBatch.push(async () => {
    await Promise.all(characterLinks.map(route => saveCharacter(route)));
    characterLinks.splice(0, characterLinks.length); // Clear remaining links
  });
}
const totalBatches = routeBatch.length;

let i = -1;
let activeFetches = 0;
while (routeBatch.length > 0) {
  if (activeFetches >= 10) {
    await new Promise((resolve) => setTimeout(resolve, 50)); // Wait a little before retrying
    continue;
  }
  activeFetches++;

  const batchPromise = routeBatch.shift();
  if (!batchPromise) break;

  i++;
  const percentProgress = ((i / totalBatches) * 100).toFixed(2);

  stdout.write(`\n${percentProgress.padStart(6, " ")}% - "Batch ${i}"\t\t`);

  await batchPromise();

  activeFetches--;

  // Partial write after each batch
  fs.writeFileSync("tools/out/characters.raw.json", JSON.stringify(characters));
  fs.writeFileSync("tools/out/category-lookup.json", JSON.stringify(categoryLookup));
  fs.writeFileSync("tools/out/category-lookup-reverse.json", JSON.stringify(categoryLookupReverse));
}

console.log("Characters fetched:", characters.length);

fs.writeFileSync("tools/out/characters.raw.json", JSON.stringify(characters));
fs.writeFileSync("tools/out/category-lookup.json", JSON.stringify(categoryLookup));
fs.writeFileSync("tools/out/category-lookup-reverse.json", JSON.stringify(categoryLookupReverse));

process.on("beforeExit", (code) => {
  console.log("\nProcess exit, writing to files. Code:", code);
  fs.writeFileSync("tools/out/characters.raw.json", JSON.stringify(characters));
  fs.writeFileSync("tools/out/category-lookup.json", JSON.stringify(categoryLookup));
  fs.writeFileSync("tools/out/category-lookup-reverse.json", JSON.stringify(categoryLookupReverse));
});
process.on("exit", (code) => {
  console.log("\nProcess exit, writing to files. Code:", code);
  fs.writeFileSync("tools/out/characters.raw.json", JSON.stringify(characters));
  fs.writeFileSync("tools/out/category-lookup.json", JSON.stringify(categoryLookup));
  fs.writeFileSync("tools/out/category-lookup-reverse.json", JSON.stringify(categoryLookupReverse));
});