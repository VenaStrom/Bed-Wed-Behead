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
  .map((name) => () => fetchAndSaveCharacterDataToFile(name));

let eta = "-";
let lastMeasured = { count: taskFactories.length, time: performance.now() };
const etaUpdater = setInterval(() => {
  if (taskFactories.length === 0 && activeFetches === 0) {
    clearInterval(etaUpdater);
    process.stdout.write("\n");
    return;
  }

  const now = performance.now();
  const completed = lastMeasured.count - taskFactories.length;
  if (completed > 0) {
    const timePerItem = (now - lastMeasured.time) / completed;
    const remaining = taskFactories.length;
    const etaMs = remaining * timePerItem;
    const dateString = new Date(etaMs).toLocaleTimeString("sv-SE", { timeZone: "UTC" });

    eta = dateString;
    lastMeasured = { count: taskFactories.length, time: now };
  }
  process.stdout.write(`\rETA: ${eta} | Active: ${activeFetches} | Remaining: ${taskFactories.length}   `);
}, 100);

const errors: string[] = [];

while (taskFactories.length) {
  if (activeFetches < concurrencyLimit) {

    const factory = taskFactories.shift();

    if (factory) {
      activeFetches++;
      const promise = factory();

      promise.then(({ name, success }) => {
        activeFetches--;
        if (success) void null; // Silent on success
        else errors.push(name);
      }).catch((err) => {
        activeFetches--;
        errors.push(`${err.toString()}`);
      });
    }
  } else await new Promise((resolve) => setTimeout(resolve, 50));

}

// Wait for all fetches to complete
while (activeFetches > 0) {
  await new Promise(resolve => setTimeout(resolve, 50));
}

console.log("All character metadata fetched and saved.");

const metaCount = fs.readdirSync(apiResponseCacheFolder).length;
const metaSizeMB = (fs.readdirSync(apiResponseCacheFolder).reduce((acc, file) => {
  const stats = fs.statSync(`${apiResponseCacheFolder}/${file}`);
  return acc + stats.size;
}, 0) / (1024 * 1024)).toFixed(2);
console.log(`\x1b[33m${metaCount}\x1b[0m files in API response cache (\x1b[35m${metaSizeMB} MB\x1b[0m)`);

const domCount = fs.readdirSync(domCacheFolder).length;
const domSizeMB = (fs.readdirSync(domCacheFolder).reduce((acc, file) => {
  const stats = fs.statSync(`${domCacheFolder}/${file}`);
  return acc + stats.size;
}, 0) / (1024 * 1024)).toFixed(2);
console.log(`\x1b[33m${domCount}\x1b[0m files in DOM cache (\x1b[35m${domSizeMB} MB\x1b[0m)`);

if (errors.length > 0) {
  console.log(`${errors.length} errors occurred:`);
  console.log(errors.join("\n"));
}
else {
  console.log("No errors occurred.");
}