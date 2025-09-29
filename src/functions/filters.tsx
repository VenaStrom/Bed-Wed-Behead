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
    filters: [
      // Skywalker saga,
      // The Clone Wars,
      // Rebels,
      // The Bad Batch,
      // The Mandalorian & TBOBF,
      // Obi - Wan Kenobi,
      // Andor & Rogue One,
      // Ahsoka,
      // The Acolyte,
      // Skeleton Crew,
    ],
  }
];