
## Character Links

### Initial Scrape
```bash
node tools/scrape/scrape-character-links.ts 
# Saves character links into tools/out/character-links.json
# Also saves all scraped HTML files into tools/cache/categories for quicker re-runs
```

### Pruning 
Mainly to remove dupes but also the redundant `/wiki/` prefix but can be expanded later if needed.
```bash
node tools/scrape/prune-character-links.ts
# Reads tools/out/character-links.json and saves pruned version to tools/out/character-links.pruned.json
```

### Minimizing for Web deployment
```bash
node tools/scrape/minimize-character-links.ts
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

## Scraping Character Details
```bash
node tools/scrape/extract-characters.ts
# Reads tools/out/character-links.pruned.json and scrapes each character page
# Saves character details to tools/out/characters.json
# Saves category lookup to tools/out/categories.json
```
The lookup is a mapping of category hash (sha256 truncated to 64 bits) to category name for more compact storage.