
export type MWParsePageResponse = Partial<{
  title: string;
  pageid: number;
  revid: number;
  text: { "*": string };
  categories: Array<{ sortkey: string; "*": string }>;
  links: Array<{ ns: number; exists: string; "*": string }>;
  templates: Array<{ ns: number; exists: string; "*": string }>;
  images: string[];
  externallinks: string[];
  sections: Array<{
    toclevel: number;
    level: string;
    line: string;
    number: string;
    index: string;
    fromtitle: string;
    byteoffset: number;
    anchor: string;
    linkAnchor: string;
  }>;
  displaytitle: string;
  iwlinks: Array<{
    prefix: string;
    url: string;
    "*": string;
  }>;
  properties: Array<{
    name: string;
    "*": string;
  }>;
}>;