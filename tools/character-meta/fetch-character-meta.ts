import fs from "node:fs";
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
      return { name: characterName, success: false };
    }
    parseResponse = response || null;
  }

  if (!parseResponse) {
    console.log(`Somehow no data was retrieved for ${characterName} 🤷‍♀️`);
    return { name: characterName, success: false };
  }

  // Save the dom separately
  if (!allDomsInCache.includes(`${fsSafeName}.html`) && parseResponse.text && parseResponse.text["*"]) {
    fs.writeFileSync(domCachePath, parseResponse.text["*"]);
  }

  // Save to parse result to cache
  if (!allNamesInCache.includes(`${fsSafeName}.json`)) {
    fs.writeFileSync(metaCachePath, JSON.stringify({ ...parseResponse, text: undefined }));
  }

  return { name: characterName, success: true };
}

const concurrencyLimit = 20;
let activeFetches = 0;

const taskFactories = characterLinks
  .slice(0, 1000) // Temporary limit for testing TODO - remove
  .map((name) => () => fetchAndSaveCharacterDataToFile(name));

console.log("Active fetches:", activeFetches, "Remaining:", taskFactories.length);
while (taskFactories.length) {
  if (activeFetches < concurrencyLimit) {
    console.log("Active fetches:", activeFetches, "Remaining:", taskFactories.length);
    const factory = taskFactories.shift();
    if (factory) {
      activeFetches++;
      const promise = factory(); // start the fetch here
      promise.then(({ name, success }) => {
        activeFetches--;
        if (success) console.log(`Fetched and saved data for ${name}`);
        else console.log(`Failed to fetch data for ${name}`);
      }).catch((err) => {
        activeFetches--;
        console.log(`Error fetching: ${err}`);
      });
    }
  } else {
    // small sleep to avoid a tight busy loop
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

// Wait for all fetches to complete
while (activeFetches > 0) {
  await new Promise(resolve => setTimeout(resolve, 100));
}

console.log("All character metadata fetched and saved.");
console.log(fs.readdirSync(apiResponseCacheFolder).length, "files in API response cache");
console.log(fs.readdirSync(domCacheFolder).length, "files in DOM cache");