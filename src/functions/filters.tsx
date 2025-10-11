import { Character, FilterCategoryMeta, Filters } from "../types.ts";

export const defaultFilterCategories: FilterCategoryMeta[] = [
  {
    id: "miscellaneous",
    name: "Miscellaneous",
  },
  {
    id: "canonicity",
    name: "Canonicity",
  },
  {
    id: "appearances",
    name: "Appearances",
    state: false,
    label: "Filter by appearances on/off",
  },
  {
    id: "gender",
    name: "Gender",
    state: false,
    label: "Filter by gender on/off",
  }
] as const;

export const defaultFilters: Filters = [
  {
    category: "miscellaneous",
    id: "only-with-images",
    label: "Only with images",
    description: "Show only characters that have an image associated with them.",
    state: false,
  },
  {
    category: "miscellaneous",
    id: "only-identified",
    label: "Only identified",
    description: "Show only characters that are not named 'Unidentified...'",
    state: false,
  },
  {
    category: "miscellaneous",
    id: "only-common",
    label: "Only common",
    description: "Show only characters that have many appearances.",
    state: false,
  },
  {
    category: "miscellaneous",
    id: "allow-droids",
    label: "Show Droids",
    description: "Show droid characters (may not be perfect).",
    state: true,
  },
  {
    category: "canonicity",
    id: "allow-canonical",
    label: "Show Canon",
    description: <>Show characters from the <a href="https://starwars.fandom.com/wiki/Canon#Canon_and_Legends_(2014-)" target="_blank">Disney canon</a>.</>,
    state: true,
  },
  {
    category: "canonicity",
    id: "allow-legends",
    label: "Show Legends",
    description: <>Show characters from <a href="https://starwars.fandom.com/wiki/Star_Wars_Legends#Legends" target="_blank">legends</a>.</>,
    state: true,
  },
  {
    category: "canonicity",
    id: "allow-non-canonical",
    label: "Show Non-Canon",
    description: <>Show characters from <a href="https://starwars.fandom.com/wiki/Category:Non-canon_articles" target="_blank">non-canon</a> and <a href="https://starwars.fandom.com/wiki/Category:Non-canon_Legends_articles" target="_blank">non-canon legends</a>.</>,
    state: true,
    // When canon is selected, show canon + non-canon
    // When legends is selected, show legends + non-canon legends
    // When both are selected, show all four
    // When only this is selected, show only non-canon + non-canon legends
  },
  {
    category: "appearances",
    id: "allow-skywalker-saga",
    label: "Skywalker Saga",
    description: "Show characters that appeared in Episodes I-IX.",
    state: true,
  },
  {
    category: "appearances",
    id: "allow-the-clone-wars",
    label: "The Clone Wars",
    description: "Show characters that appeared in The Clone Wars (2008-2020)",
    state: true,
  },
  {
    category: "appearances",
    id: "allow-the-bad-batch",
    label: "The Bad Batch",
    description: "Show characters that appeared in The Bad Batch.",
    state: true,
  },
  {
    category: "appearances",
    id: "allow-rebels",
    label: "Rebels",
    description: "Show characters that appeared in Star Wars Rebels.",
    state: true,
  },
  {
    category: "appearances",
    id: "allow-andor-rogue-one",
    label: "Andor & Rogue One",
    description: "Show characters that appeared in Andor and Rogue One.",
    state: true,
  },
  {
    category: "appearances",
    id: "allow-mandalorian-tbobf",
    label: "The Mandalorian & TBOBF",
    description: "Show characters that appeared in The Mandalorian and The Book of Boba Fett.",
    state: true,
  },
  {
    category: "appearances",
    id: "allow-obi-wan-kenobi",
    label: "Obi-Wan Kenobi",
    description: "Show characters that appeared in Obi-Wan Kenobi.",
    state: true,
  },
  {
    category: "appearances",
    id: "allow-ahsoka",
    label: "Ahsoka",
    description: "Show characters that appeared in Ahsoka.",
    state: true,
  },
  {
    category: "appearances",
    id: "allow-the-acolyte",
    label: "The Acolyte",
    description: "Show characters that appeared in The Acolyte.",
    state: true,
  },
  {
    category: "appearances",
    id: "allow-skeleton-crew",
    label: "Skeleton Crew",
    description: "Show characters that appeared in Skeleton Crew.",
    state: true,
  },
  {
    category: "appearances",
    id: "allow-legacy-cartoons",
    label: "Old cartoons",
    description: "Show characters that appeared in old cartoons like Ewoks, Droids, etc.",
    state: true,
  },
  {
    category: "gender",
    id: "allow-males",
    label: "Show Males",
    description: "Solely based on the category 'Males'.",
    state: true,
  },
  {
    category: "gender",
    id: "allow-females",
    label: "Show Females",
    description: "Solely based on the category 'Females'.",
    state: true,
  },
  {
    category: "gender",
    id: "allow-other-genders",
    label: "Show Others",
    description: "Based on categories with specified pronouns beside he/him or she/her.",
    state: true,
  },
] as const;

export function filterChar(character: Character, filters: Filters): boolean {
  if (!filters) return true;
  return true;
}