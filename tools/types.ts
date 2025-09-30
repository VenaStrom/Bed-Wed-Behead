import type { ApiParseParams, } from "types-mediawiki-api";
export type MWPageParseResponse = ApiParseParams & { categories?: { "*": string }[]; properties?: { [key: string]: string } };