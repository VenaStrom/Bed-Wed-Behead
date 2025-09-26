import fs from "node:fs";
import type { Character } from "../../src/types.ts";
import { protoEncode } from "../../src/proto/proto.ts";

const characters: Character[] = JSON.parse(fs.readFileSync("tools/out/characters.raw.json", "utf-8"));
const outPath = "tools/out/characters.min.json";

const encodedCharacters = await protoEncode({ characters });
const base64 = Buffer.from(encodedCharacters).toString("base64");
fs.writeFileSync(outPath, "\"" + base64 + "\"", "utf-8");

// Decode like this
// const decoded = (await protoDecode(encodedCharacters));
// console.dir(decoded, { depth: null });
