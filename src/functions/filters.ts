
export const defaultFilters = [
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
      },
    ],
  },
];
export type Filter = {
  id: string;
  label: string;
  filters: {
    id: string;
    label: string;
    help: string;
    state: boolean;
  }[];
}[];