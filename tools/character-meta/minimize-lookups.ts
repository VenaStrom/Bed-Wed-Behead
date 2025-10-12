import fs, { globSync } from "node:fs";

const lookupFiles = globSync("tools/out/*lookup.raw.json");
console.log("Minimizing lookups...");
for (const filePath of lookupFiles) {
  console.log(`Processing ${filePath}...`);
  fs.writeFileSync(filePath.replace(".raw.json", ".min.json"), JSON.stringify(JSON.parse(fs.readFileSync(filePath, "utf-8"))), "utf-8");
}