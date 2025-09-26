import protobuf from "protobufjs";
import type { Character } from "../types.ts";

const protoPath = "src/proto/message.proto";

export async function protoEncode(characters: Character[]): Promise<Uint8Array> {
  const root = await protobuf.load(protoPath);
  const dataStruct = root.lookupType("CharacterList");
  const formattedData = dataStruct.create(characters);
  const buffer = dataStruct.encode(formattedData).finish();
  return buffer;
}

export async function protoDecode(buffer: Buffer): Promise<protobuf.Message<object>> {
  const root = await protobuf.load(protoPath);
  const dataStruct = root.lookupType("CharacterList");
  const data = dataStruct.decode(buffer);
  return data;
}