import fs from "node:fs";

const prunedCharacterLinksFile = "tools/out/character-links.pruned.json";
const minimizeCharacterLinksFile = "tools/out/character-links.min.json";

const joiningCharacter = "?";

if (!fs.existsSync(prunedCharacterLinksFile)) {
  console.error(`File not found: ${prunedCharacterLinksFile}`);
  process.exit(1);
}

console.log("Minimizing character links...");

const characterLinks: string[] = JSON.parse(fs.readFileSync(prunedCharacterLinksFile, "utf-8"));
const minimizedLinks = characterLinks.sort();

const singleLineLinks = minimizedLinks.join(joiningCharacter);

// Self test. Splitting should give the same number of links.
const testLinks = singleLineLinks.split(joiningCharacter);
if (testLinks.length !== minimizedLinks.length) {
  console.error("Error: Mismatch in link counts after minimization.");
  console.log(`Original count: ${minimizedLinks.length}, After split count: ${testLinks.length}`);
  console.log("Try changing the joining character to something else. It's a const declared at the top of this file.");
  process.exit(1);
}

// Log size
console.log(`Original size: ${JSON.stringify(characterLinks, null, 2).length} characters`);
console.log(`Minimized size: ${singleLineLinks.length} characters`);
console.log(`~ ${singleLineLinks.length / 1024} KB`);

fs.writeFileSync(minimizeCharacterLinksFile, JSON.stringify({ singleLineData: singleLineLinks, joiningCharacter }));