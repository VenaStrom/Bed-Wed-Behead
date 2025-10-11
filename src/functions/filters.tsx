import { Character, FilterCategoryID, FilterCategoryMeta, Filters } from "../types.ts";

export const defaultFilterCategories: FilterCategoryMeta[] = [
  {
    id: FilterCategoryID.miscellaneous,
    name: "Miscellaneous",
  },
  {
    id: FilterCategoryID.canonicity,
    name: "Canonicity",
  },
  {
    id: FilterCategoryID.appearances,
    name: "Appearances",
    state: false,
    label: "Filter by appearances on/off",
  },
  {
    id: FilterCategoryID.gender,
    name: "Gender",
    state: false,
    label: "Filter by gender on/off",
  }
] as const;

const defaultFiltersStatic = [
  {
    category: FilterCategoryID.miscellaneous,
    id: "only-with-images",
    label: "Only with images",
    description: "Show only characters that have an image associated with them.",
    state: false,
  },
  {
    category: FilterCategoryID.miscellaneous,
    id: "only-identified",
    label: "Only identified",
    description: "Show only characters that are not named 'Unidentified...'",
    state: false,
  },
  {
    category: FilterCategoryID.miscellaneous,
    id: "only-common",
    label: "Only common",
    description: "Show only characters that have many appearances.",
    state: false,
  },
  {
    category: FilterCategoryID.miscellaneous,
    id: "allow-droids",
    label: "Show Droids",
    description: "Show droid characters (may not be perfect).",
    state: true,
  },
  {
    category: FilterCategoryID.canonicity,
    id: "allow-canonical",
    label: "Show Canon",
    description: <>Show characters from the <a href="https://starwars.fandom.com/wiki/Canon#Canon_and_Legends_(2014-)" target="_blank">Disney canon</a>.</>,
    state: true,
  },
  {
    category: FilterCategoryID.canonicity,
    id: "allow-legends",
    label: "Show Legends",
    description: <>Show characters from <a href="https://starwars.fandom.com/wiki/Star_Wars_Legends#Legends" target="_blank">legends</a>.</>,
    state: true,
  },
  {
    category: FilterCategoryID.canonicity,
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
    category: FilterCategoryID.appearances,
    id: "allow-skywalker-saga",
    label: "Skywalker Saga",
    description: "Show characters that appeared in Episodes I-IX.",
    state: true,
  },
  {
    category: FilterCategoryID.appearances,
    id: "allow-the-clone-wars",
    label: "The Clone Wars",
    description: "Show characters that appeared in The Clone Wars (2008-2020)",
    state: true,
  },
  {
    category: FilterCategoryID.appearances,
    id: "allow-the-bad-batch",
    label: "The Bad Batch",
    description: "Show characters that appeared in The Bad Batch.",
    state: true,
  },
  {
    category: FilterCategoryID.appearances,
    id: "allow-rebels",
    label: "Rebels",
    description: "Show characters that appeared in Star Wars Rebels.",
    state: true,
  },
  {
    category: FilterCategoryID.appearances,
    id: "allow-andor-rogue-one",
    label: "Andor & Rogue One",
    description: "Show characters that appeared in Andor and Rogue One.",
    state: true,
  },
  {
    category: FilterCategoryID.appearances,
    id: "allow-mandalorian-tbobf",
    label: "The Mandalorian & TBOBF",
    description: "Show characters that appeared in The Mandalorian and The Book of Boba Fett.",
    state: true,
  },
  {
    category: FilterCategoryID.appearances,
    id: "allow-obi-wan-kenobi",
    label: "Obi-Wan Kenobi",
    description: "Show characters that appeared in Obi-Wan Kenobi.",
    state: true,
  },
  {
    category: FilterCategoryID.appearances,
    id: "allow-ahsoka",
    label: "Ahsoka",
    description: "Show characters that appeared in Ahsoka.",
    state: true,
  },
  {
    category: FilterCategoryID.appearances,
    id: "allow-the-acolyte",
    label: "The Acolyte",
    description: "Show characters that appeared in The Acolyte.",
    state: true,
  },
  {
    category: FilterCategoryID.appearances,
    id: "allow-skeleton-crew",
    label: "Skeleton Crew",
    description: "Show characters that appeared in Skeleton Crew.",
    state: true,
  },
  {
    category: FilterCategoryID.appearances,
    id: "allow-legacy-cartoons",
    label: "Old cartoons",
    description: "Show characters that appeared in old cartoons like Ewoks, Droids, etc.",
    state: true,
  },
  {
    category: FilterCategoryID.gender,
    id: "allow-males",
    label: "Show Males",
    description: "Solely based on the category 'Males'.",
    state: true,
  },
  {
    category: FilterCategoryID.gender,
    id: "allow-females",
    label: "Show Females",
    description: "Solely based on the category 'Females'.",
    state: true,
  },
  {
    category: FilterCategoryID.gender,
    id: "allow-other-genders",
    label: "Show Others",
    description: "Based on categories with specified pronouns beside he/him or she/her.",
    state: true,
  },
] as const;
type FilterID = (typeof defaultFiltersStatic)[number]["id"];
export const defaultFilters = defaultFiltersStatic as unknown as Filters;

function extractCategory(catID: FilterCategoryID, cats: FilterCategoryMeta[], filters: Filters) {
  const catExists = cats.find(c => c.id === catID);
  if (!catExists) return null;
  return {
    ...catExists,
    filters: Object.fromEntries(filters.filter(f => f.category === catID).map(f => ([f.id, f.state]))) as Record<FilterID, boolean>
  };
}

export function filterChar(character: Character, filters: Filters, categories: FilterCategoryMeta[]): boolean {
  if (!filters) return true;

  const miscellaneous = extractCategory(FilterCategoryID.miscellaneous, categories, filters);
  if (miscellaneous && miscellaneous.state !== false) {
    if (miscellaneous.filters["only-with-images"] && !character.image) return false;
    if (miscellaneous.filters["only-identified"] && character.name.startsWith("Unidentified")) return false;
    if (miscellaneous.filters["only-common"] && (!character.canonAppearances || character.canonAppearances.length < 5) && (!character.legendsAppearances || character.legendsAppearances.length < 5)) return false;
    if (!miscellaneous.filters["allow-droids"] && character.categories && character.categories.some(c => c.toLowerCase().includes("droid"))) return false;
  }

  const canonicity = extractCategory(FilterCategoryID.canonicity, categories, filters);
  const appearances = extractCategory(FilterCategoryID.appearances, categories, filters);
  const gender = extractCategory(FilterCategoryID.gender, categories, filters);

  return true;
}

// Canonicity magic strings picked from category-lookup.json
const canonHash = "dc5d0a47";
const nonCanonHash = "6cca68f1";
const legendsHash = "a3b84346";
const nonCanonLegendsHash = "42a381df";

export function filterCharacters(characters: Character[], filters: Filters, categories: FilterCategoryMeta[], categoryLookup: Record<string, string>): Character[] {
  if (filters.length === 0) return characters;

  const miscellaneous = extractCategory(FilterCategoryID.miscellaneous, categories, filters);
  if (miscellaneous && miscellaneous.state !== false) {
    characters = characters.filter(c => {
      if (miscellaneous.filters["only-with-images"] && !c.image) return false;
      if (miscellaneous.filters["only-identified"] && c.name.startsWith("Unidentified")) return false;
      if (miscellaneous.filters["only-common"] && (c.canonAppearances?.length || 0) + (c.legendsAppearances?.length || 0) < 20) return false;
      if (!miscellaneous.filters["allow-droids"] && c.categories && c.categories.some(hash => categoryLookup[hash].toLowerCase().includes("droid"))) return false;
      return true;
    });
  }

  const canonicity = extractCategory(FilterCategoryID.canonicity, categories, filters);
  if (canonicity && canonicity.state !== false) {
    characters = characters.filter(c => {
      if (!canonicity.filters["allow-canonical"] && c.categories && c.categories.includes(canonHash)) return false;
      if (!canonicity.filters["allow-legends"] && c.categories && c.categories.includes(legendsHash)) return false;
      if (!canonicity.filters["allow-non-canonical"] && c.categories && (c.categories.includes(nonCanonHash) || c.categories.includes(nonCanonLegendsHash))) return false;
      return true;
    });
  }

  return characters;
}