import { ReactNode } from "react";

export type FilterOption = {
  id: string;
  label: string;
  help: string | ReactNode;
  state: boolean;
}
export type Filter = {
  id: string;
  label: string;
  filters: FilterOption[];
  state?: boolean; // Only for categories that can be toggled on/off as a whole
  stateLabel?: string; // Help text for the category toggle
}[];
export const defaultFilters: Filter = [
  {
    id: "miscellaneous",
    label: "Miscellaneous",
    filters: [
      {
        id: "only-with-images",
        label: "Only with images",
        help: "Show only characters that have an image associated with them.",
        state: false,
      },
      {
        id: "only-identified",
        label: "Only identified",
        help: "Show only characters that are not named 'Unidentified...'",
        state: false,
      },
      {
        id: "only-common",
        label: "Only common",
        help: "Show only characters that have many appearances.",
        state: false,
      },
    ],
  },
  {
    id: "canonicity",
    label: "Canonicity",
    filters: [
      {
        id: "allow-canonical",
        label: "Show Canon",
        help: <>Show characters from the <a href="https://starwars.fandom.com/wiki/Canon#Canon_and_Legends_(2014-)" target="_blank">Disney canon</a>.</>,
        state: true,
      },
      {
        id: "allow-legends",
        label: "Show Legends",
        help: <>Show characters from <a href="https://starwars.fandom.com/wiki/Star_Wars_Legends#Legends" target="_blank">legends</a>.</>,
        state: true,
      },
      {
        // When canon is selected, show canon + non-canon
        // When legends is selected, show legends + non-canon legends
        // When both are selected, show all four
        // When only this is selected, show only non-canon + non-canon legends
        id: "allow-non-canonical",
        label: "Show Non-Canon",
        help: <>Show characters from <a href="https://starwars.fandom.com/wiki/Category:Non-canon_articles" target="_blank">non-canon</a> and <a href="https://starwars.fandom.com/wiki/Category:Non-canon_Legends_articles" target="_blank">non-canon legends</a>.</>,
        state: true,
      },
    ],
  },
  {
    id: "appearances",
    label: "Appearances",
    state: false,
    stateLabel: "Filter by appearances on/off",
    filters: [
      {
        id: "allow-skywalker-saga",
        label: "Skywalker Saga",
        help: "Show characters that appeared in Episodes I-IX.",
        state: true,
      },
      {
        id: "allow-the-clone-wars",
        label: "The Clone Wars",
        help: "Show characters that appeared in The Clone Wars (2008-2020)",
        state: true,
      },
      {
        id: "allow-the-bad-batch",
        label: "The Bad Batch",
        help: "Show characters that appeared in The Bad Batch.",
        state: true,
      },
      {
        id: "allow-rebels",
        label: "Rebels",
        help: "Show characters that appeared in Star Wars Rebels.",
        state: true,
      },
      {
        id: "allow-mandalorian-tbof",
        label: "The Mandalorian & TBOBF",
        help: "Show characters that appeared in The Mandalorian and The Book of Boba Fett.",
        state: true,
      },
      {
        id: "allow-obi-wan-kenobi",
        label: "Obi-Wan Kenobi",
        help: "Show characters that appeared in Obi-Wan Kenobi.",
        state: true,
      },
      {
        id: "allow-andor-rogue-one",
        label: "Andor & Rogue One",
        help: "Show characters that appeared in Andor and Rogue One.",
        state: true,
      },
      {
        id: "allow-ahsoka",
        label: "Ahsoka",
        help: "Show characters that appeared in Ahsoka.",
        state: true,
      },
      {
        id: "allow-the-acolyte",
        label: "The Acolyte",
        help: "Show characters that appeared in The Acolyte.",
        state: true,
      },
      {
        id: "allow-skeleton-crew",
        label: "Skeleton Crew",
        help: "Show characters that appeared in Skeleton Crew.",
        state: true,
      },
      {
        id: "allow-legacy-cartoons",
        label: "Legacy cartoons",
        help: <>Show characters that appeared in legacy cartoons (Ewoks, Droids, etc.). See <a href="https://starwars.fandom.com/wiki/Category:Legends_animated_television_series" target="_blank">here</a> and <a href="https://starwars.fandom.com/wiki/Category:Star_Wars_Vintage_Collection" target="_blank">here</a> for reference.</>,
        state: true,
      }
    ],
  }
];