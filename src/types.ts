
export type ProfileState = {
  name: string | null;
  wikiLink: string | null;
  imageLink: string | null;
};

export type Character = {
  name: string;
  // Only the path part of the URL, e.g. Luke_Skywalker excluding "https://starwars.fandom.com/wiki/"
  route: string;
  image?: string | undefined; // Omit if not present for size optimization. Only the route part of the URL. Excludes "https://static.wikia.nocookie.net/starwars/images/"
  categories?: string[] | undefined;
};