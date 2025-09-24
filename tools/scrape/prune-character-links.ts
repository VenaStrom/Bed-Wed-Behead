import fs from "node:fs";

const characterLinksFile = "tools/out/character-links.json";
const prunedCharacterLinksFile = "tools/out/character-links.pruned.json";

if (!fs.existsSync(characterLinksFile)) {
  console.error(`File not found: ${characterLinksFile}`);
  process.exit(1);
}

console.log("Pruning character links...");

const characterLinks: string[] = JSON.parse(fs.readFileSync(characterLinksFile, "utf-8"));
const uniqueLinks = Array.from(new Set(characterLinks)).map(link => link.replace("/wiki/", "")).sort();

// How many dupes?
const dupesCount = characterLinks.length - uniqueLinks.length;
if (dupesCount > 0) {
  console.log(`Removed ${dupesCount} duplicate links.`);
} else {
  console.log("No duplicate links found.");
}

fs.writeFileSync(prunedCharacterLinksFile, JSON.stringify(uniqueLinks, null, 2));
console.log(`Saved pruned character links to ${prunedCharacterLinksFile}`);
console.log(`Total unique character links: ${uniqueLinks.length}`);