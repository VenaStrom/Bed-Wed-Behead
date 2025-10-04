import Crypto from "node:crypto";


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