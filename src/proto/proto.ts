import protobuf from "protobufjs";
import type { Character } from "../types.ts";

const protoPath = typeof window !== "undefined"
  ? "/message.proto"
  : "public/message.proto";

export async function protoEncode(characters: { characters: Character[] }): Promise<Uint8Array> {
  const root = await protobuf.load(protoPath);
  const dataStruct = root.lookupType("CharacterList");
  const formattedData = dataStruct.create(characters);
  const buffer = dataStruct.encode(formattedData).finish();
  return buffer;
}

export async function protoDecode(buffer: Uint8Array<ArrayBufferLike>): Promise<Character[]> {
  const root = await protobuf.load(protoPath);
  const dataStruct = root.lookupType("CharacterList");
  const data = dataStruct.decode(buffer).toJSON().characters as Character[];
  return data;
}