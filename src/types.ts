
export type ProfileState = {
  name: string | null;
  wikiRoute: string | null;
  imageRoute: string | null;
  selectedOption: BWBChoice[keyof BWBChoice] | null;
};
export type ProfileStates = [ProfileState, ProfileState, ProfileState];
export const emptyProfile: ProfileState = {
  name: null,
  wikiRoute: null,
  imageRoute: null,
  selectedOption: null,
} as const;

/** Acts as an enum for logic but also as labels for the options */
export const BWBChoice = {
  BED: "Bed",
  WED: "Wed",
  BEHEAD: "Behead",
} as const;
export type BWBChoice = typeof BWBChoice[keyof typeof BWBChoice];

export type Character = {
  name: string;
  // Only the path part of the URL, e.g. Luke_Skywalker excluding "https://starwars.fandom.com/wiki/"
  route: string;
  image?: string | undefined; // Omit if not present for size optimization. Only the route part of the URL. Excludes "https://static.wikia.nocookie.net/starwars/images/"
  categories?: string[] | undefined;
  canonAppearances?: string[] | undefined; // Hash list
  nonCanonAppearances?: string[] | undefined; // Hash list
  legendsAppearances?: string[] | undefined; // Hash list
  nonCanonLegendsAppearances?: string[] | undefined; // Hash list
};