import { ReactNode } from "react";
import { Character } from "../types.ts";

export type FilterOption = {
  id: string;
  label: string;
  help: string | ReactNode;
  state: boolean;
};
export type FilterCategory = {
  id: string;
  label: string;
  state?: boolean; // Only for categories that can be toggled on/off as a whole
  stateLabel?: string; // Help text for the category toggle
  filters: Record<string, FilterOption>;
};
export type Filter = Record<string, FilterCategory>;

export const defaultFilters: Filter = {
  "miscellaneous": {
    id: "miscellaneous",
    label: "Miscellaneous",
    filters: {
      "only-with-images": {
        id: "only-with-images",
        label: "Only with images",
        help: "Show only characters that have an image associated with them.",
        state: false,
      },
      "only-identified": {
        id: "only-identified",
        label: "Only identified",
        help: "Show only characters that are not named 'Unidentified...'",
        state: false,
      },
      "only-common": {
        id: "only-common",
        label: "Only common",
        help: "Show only characters that have many appearances.",
        state: false,
      },
      "allow-droids": {
        id: "allow-droids",
        label: "Show Droids",
        help: "Show droid characters (may not be perfect).",
        state: true,
      }
    },
  },
  "canonicity": {
    id: "canonicity",
    label: "Canonicity",
    filters: {
      "allow-canonical": {
        id: "allow-canonical",
        label: "Show Canon",
        help: <>Show characters from the <a href="https://starwars.fandom.com/wiki/Canon#Canon_and_Legends_(2014-)" target="_blank">Disney canon</a>.</>,
        state: true,
      },
      "allow-legends": {
        id: "allow-legends",
        label: "Show Legends",
        help: <>Show characters from <a href="https://starwars.fandom.com/wiki/Star_Wars_Legends#Legends" target="_blank">legends</a>.</>,
        state: true,
      },
      "allow-non-canonical": {
        // When canon is selected, show canon + non-canon
        // When legends is selected, show legends + non-canon legends
        // When both are selected, show all four
        // W"allow-non-canonical":hen only this is selected, show only non-canon + non-canon legends
        id: "allow-non-canonical",
        label: "Show Non-Canon",
        help: <>Show characters from <a href="https://starwars.fandom.com/wiki/Category:Non-canon_articles" target="_blank">non-canon</a> and <a href="https://starwars.fandom.com/wiki/Category:Non-canon_Legends_articles" target="_blank">non-canon legends</a>.</>,
        state: true,
      },
    },
  },
  "appearances": {
    id: "appearances",
    label: "Appearances",
    state: false,
    stateLabel: "Filter by appearances on/off",
    filters: {
      "allow-skywalker-saga": {
        id: "allow-skywalker-saga",
        label: "Skywalker Saga",
        help: "Show characters that appeared in Episodes I-IX.",
        state: true,
      },
      "allow-the-clone-wars": {
        id: "allow-the-clone-wars",
        label: "The Clone Wars",
        help: "Show characters that appeared in The Clone Wars (2008-2020)",
        state: true,
      },
      "allow-the-bad-batch": {
        id: "allow-the-bad-batch",
        label: "The Bad Batch",
        help: "Show characters that appeared in The Bad Batch.",
        state: true,
      },
      "allow-rebels": {
        id: "allow-rebels",
        label: "Rebels",
        help: "Show characters that appeared in Star Wars Rebels.",
        state: true,
      },
      "allow-andor-rogue-one": {
        id: "allow-andor-rogue-one",
        label: "Andor & Rogue One",
        help: "Show characters that appeared in Andor and Rogue One.",
        state: true,
      },
      "allow-mandalorian-tbobf": {
        id: "allow-mandalorian-tbobf",
        label: "The Mandalorian & TBOBF",
        help: "Show characters that appeared in The Mandalorian and The Book of Boba Fett.",
        state: true,
      },
      "allow-obi-wan-kenobi": {
        id: "allow-obi-wan-kenobi",
        label: "Obi-Wan Kenobi",
        help: "Show characters that appeared in Obi-Wan Kenobi.",
        state: true,
      },
      "allow-ahsoka": {
        id: "allow-ahsoka",
        label: "Ahsoka",
        help: "Show characters that appeared in Ahsoka.",
        state: true,
      },
      "allow-the-acolyte": {
        id: "allow-the-acolyte",
        label: "The Acolyte",
        help: "Show characters that appeared in The Acolyte.",
        state: true,
      },
      "allow-skeleton-crew": {
        id: "allow-skeleton-crew",
        label: "Skeleton Crew",
        help: "Show characters that appeared in Skeleton Crew.",
        state: true,
      },
      "allow-legacy-cartoons": {
        id: "allow-legacy-cartoons",
        label: "Old cartoons",
        help: "Show characters that appeared in old cartoons like Ewoks, Droids, etc.",
        state: true,
      }
    },
  },
  "gender": {
    id: "gender",
    label: "Gender",
    state: false,
    stateLabel: "Filter by gender on/off",
    filters: {
      "allow-males": {
        id: "allow-males",
        label: "Show Males",
        help: "Solely based on the category 'Males'.",
        state: true,
      },
      "allow-females": {
        id: "allow-females",
        label: "Show Females",
        help: "Solely based on the category 'Females'.",
        state: true,
      },
      "allow-other-genders": {
        id: "allow-other-genders",
        label: "Show Others",
        help: "Based on categories with specified pronouns beside he/him or she/her.",
        state: true,
      },
    },
  }
} as const;

export function filterChar(character: Character, filters: Filter): boolean {
  if (!filters) return true;
  return true;
}