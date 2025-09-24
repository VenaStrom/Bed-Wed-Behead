
export type ProfileState = {
  name: string | null;
  wikiLink: string | null;
  imageLink: string | null;
};

/** 
 * `n`: pretty name
 * `r`: wiki route
 * `i`: image link (optional)
 * `c`: categories
 */
export type Character = {
  n: string;
  // Only the path part of the URL, e.g. Luke_Skywalker excluding https://starwars.fandom.com/wiki/
  r: string;
  i?: string | undefined; // Omit if not present for size optimization
  c?: string[] | undefined;
};