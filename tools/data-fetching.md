
## Character Links
Due to the limits of the MediaWiki API it's hard to get page links in a category. Therefore we download the HTML of each category page and parse it.

### Getting all character links
```bash
node tools/character-links/scrape-category-lists.ts 
# Saves character links into tools/out/character-links.raw.json
# Also saves all scraped HTML files into tools/cache/categories for quicker re-runs
```

### Pruning 
Mainly to remove dupes but also the redundant `/wiki/` prefix but can be expanded later if needed.
```bash
node tools/character-links/prune-character-links.ts
# Reads tools/out/character-links.raw.json and saves pruned version to tools/out/character-links.pruned.json
```

### Minimizing for Web deployment
```bash
node tools/character-links/minimize-character-links.ts
# Reads tools/out/character-links.pruned.json and saves minimized version to tools/out/character-links.minimized.json
```
The minimized file is structured like this:
```json
{
  "singleLineData": "name1?name2?name3?...",
  "joiningCharacter": "?"
}
```
but with no whitespace. Without further compression the size difference is almost 1/2. 1.1 MB -> 600 KB 

## Getting Character Details
```bash
node tools/character-meta/fetch-character-meta.ts
# Reads tools/out/character-links.pruned.json and fetches the Wookieepedia API
# Saves character objects to tools/out/characters.raw.json
# Saves category lookup to tools/out/category-lookup.json and tools/out/category-lookup-reverse.json
```
The lookup is a mapping of category hash (sha256 truncated to 64 bits) to category name for more compact storage.