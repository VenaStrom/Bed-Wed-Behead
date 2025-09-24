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

  const imageURL: string | null = infoBoxData.find(box => box.type === "image")?.data?.at(0).url || null;

  const categoryJson = await categoryData.json();
  const categories: string[] = categoryJson.parse.categories.map((cat: { "*": string }) => cat["*"].replaceAll("_", " "));

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

for (const route of characterLinks) {
  const res = await fetchMetadata(route);
  if (!res) continue;

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
    n: name,
    r: route,
    ...(categoryHashes.length > 0 ? { c: categoryHashes } : {}),
    ...(imageURL ? { i: imageURL.replace(imageBaseURL, "") } : {}),
  };

  characters.push(character);

  break;
}

console.log("Characters fetched:", characters.length);

fs.writeFileSync("tools/out/characters.json", JSON.stringify(characters, null, 2));
fs.writeFileSync("tools/out/category-lookup.json", JSON.stringify(categoryLookup, null, 2));
fs.writeFileSync("tools/out/category-lookup-reverse.json", JSON.stringify(categoryLookupReverse, null, 2));