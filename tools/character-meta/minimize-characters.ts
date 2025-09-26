import fs from "node:fs";
import type { Character } from "../../src/types.ts";
import { protoEncode } from "../../src/proto/proto.ts";
import { } from "../../src/proto/generated.js";

const characters: Character[] = JSON.parse(fs.readFileSync("tools/out/characters.raw.json", "utf-8"));
const outPath = "tools/out/characters.min.json";

const encodedCharacters = await protoEncode(characters);
console.log(encodedCharacters.length);
fs.writeFileSync(outPath, JSON.stringify({ meta: "Characters encoded with protobuf", bin: encodedCharacters.toString() }, null, 2), "utf-8");
