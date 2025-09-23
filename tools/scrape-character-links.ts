import fs from "node:fs";
import { JSDOM } from "jsdom";

const baseURL = "https://starwars.fandom.com";
const categoryLinks = [
  "/wiki/Category:Females",
  "/wiki/Category:Droids_with_feminine_programming",
  "/wiki/Category:Males",
  "/wiki/Category:Droids_with_masculine_programming",
  "/wiki/Category:Non-binary_individuals",
  "/wiki/Category:Genderless_individuals",
  "/wiki/Category:Droids_with_no_gender_programming",
  "/wiki/Category:Individuals_of_unspecified_gender",
  "/wiki/Category:Droids_with_unspecified_gender_programming",
  "/wiki/Category:Individuals_of_unidentified_gender",
];
const characterLinks: string[] = [];

// Ensure output directory exists
const cacheFolder = "tools/scraped";
if (!fs.existsSync(cacheFolder)) {
  fs.mkdirSync(cacheFolder, { recursive: true });
}
const outFolder = "tools/out";
if (!fs.existsSync(outFolder)) {
  fs.mkdirSync(outFolder, { recursive: true });
}
const characterLinksFile = `${outFolder}/character-links.json`;

for (const link of categoryLinks) {
  const categoryName = link.split("/").pop();

  if (!fs.existsSync(`${cacheFolder}/${categoryName}.html`)) {
    // Scrape and save
    const response = await fetch(`${baseURL}${link}`);
    if (!response.ok) {
      console.warn(`Failed to fetch ${baseURL}${link}: ${response.statusText}`);
      continue;
    }
    const text = await response.text();
    fs.writeFileSync(`${cacheFolder}/${categoryName}.html`, text);
    console.log(`Saved ${categoryName}.html`);
  }

  // Parse and extract
  const html = fs.readFileSync(`${cacheFolder}/${categoryName}.html`, "utf-8");
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const memberLinks = Array.from(document.querySelectorAll(".category-page__member-link")).map(el => (el as HTMLAnchorElement).href);

  characterLinks.push(...memberLinks);

  const nextPageButton = document.querySelector(".category-page__pagination-next");
  if (nextPageButton) {
    categoryLinks.push((nextPageButton as HTMLAnchorElement).href.replace(baseURL, ""));
  }

  // Save character links incrementally
  fs.writeFileSync(characterLinksFile, JSON.stringify(characterLinks, null, 2));
}

console.log(`Found ${characterLinks.length} character links.`);


fs.writeFileSync(characterLinksFile, JSON.stringify(characterLinks, null, 2));
console.log("Saved character-links.json");