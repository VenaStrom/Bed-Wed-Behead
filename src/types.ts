import type { ReactNode } from "react";

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
  imageRoute: "/alien-headshot.png",
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
  appearances?: string[] | undefined; // Combined list of all appearances, used for filtering will not be saved
};

export const FilterCategoryID = {
  miscellaneous: "miscellaneous",
  canonicity: "canonicity",
  appearances: "appearances",
  gender: "gender",
} as const;
export type FilterCategoryID = (typeof FilterCategoryID)[keyof typeof FilterCategoryID];

export type FilterItem = {
  category: FilterCategoryID;
  id: string;
  label: string;
  description: string | ReactNode;
  state: boolean;
  threshold?: number; // Only for filters that require a numeric threshold
};
export type Filters = FilterItem[];

export type FilterCategoryMeta = {
  id: FilterCategoryID;
  name: string;
  state?: boolean; // Only for categories that can be toggled on/off as a whole
  label?: string; // Help text for the category toggle
};

export const RollType = {
  SKIP: "skip",
  COMMIT: "commit",
};
export type RollType = typeof RollType[keyof typeof RollType];
export type HistoryItem = {
  id: string;
  profiles: ProfileStates; // 3 profiles
  date: Date;
  rollType: RollType;
};