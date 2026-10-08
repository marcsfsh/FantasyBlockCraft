---
name: add-block-or-item
description: Checklist for adding or changing a Fantasy BlockCraft block or item - block ids, texture tile allocation in the atlas, hardness and sounds, the creative menu, recipes, the BANNED set and loot tables - and the tests that guard them.
---

# Add a block or item

First check the setting: nothing modern, original names, things the old peoples made should feel ancient (`docs/DESIGN.md`).

## Ids
- **Blocks:** constants and `def(id,name,[top,bottom,side],opts)` in `src/js/blocks/blocks.js`. The world is a `Uint8Array`, so ids are 0 to 255. Never use 101 to 107: saves store water levels as `100 + level`. 100 to 102 are tool ids (`HOOK`, `FIREWORK`, `BPTOOL`). Items use 200 and up.
- **Items:** `item(id,name,kind,colour,extra)` in `src/js/blocks/items.js`; `kind` picks a drawn icon, or `'tile'` with `{tile:N}` for an atlas icon.
- `npm test -- content-tables` prints the free block ids and unreferenced atlas tiles, and fails on id clashes.
- Never renumber an existing id: saves store ids.

## Texture tiles (src/js/blocks/atlas.js)
- The atlas is `AC=8` columns by `AR=32` rows of 16 x 16 tiles: tile `t` sits at column `t%8`, row `t/8|0`, 256 tiles in all.
- Pick a tile the content test lists as unreferenced, then `grep -n "(N," src/js/blocks/atlas.js` to be sure nothing paints it.
- Painters (`fill`, `P`, `voronoi`, `ore`, ...) draw from the shared stream `tr()`. **Add new painting at the end of the painting code** (just before the closing `})();` above `TAVG`), never in the middle, or every later tile and the stars and clouds in `renderer.js` change.
- `def` options: `solid`, `opq` (blocks light and hides faces), `occ`, `cross` (plant), `flat`, `liquid`, `emit` and `lum` (0 to 15 block light), `leaf`, `place` (false hides it from menus), `snd`.

## Hardness and sounds
- `setH([ids],hard,mat,tier)` near the end of `blocks.js`: `hard` is break time, `mat` is `soft`/`wood`/`stone`/`ore`/`metal`/`misc` (which tool is best), `tier` is the pickaxe tier needed (pickaxes in `items.js`: wooden 1, stone 2, copper 3, bronze and platinum 4, iron 5, steel 6, moonsilver and runeforged 7). Unset blocks get `hard 1, misc, tier 0`. `hard -1` is unbreakable.
- `snd` in `def` options picks the step and break sound: `soft`, `wood`, `stone`, `glass` (`SND` in `src/js/engine/audio.js`).
- Drops: `dropsFor(id)` in `src/js/gameplay/player-and-input.js` (default: the block itself).

## Menus, recipes, trade, loot
- **Creative menu:** add the id to the right category in `CATS` in `src/js/ui/menus.js`. Placeable blocks not listed fall into "Other".
- **Recipes:** `RECIPES` in `src/js/gameplay/crafting.js`, `[output, count, [[ingredient or list, count], ...], station]`; station `'f'` furnace, `'c'` crusher, `'m'` mint, none for the hand.
- **BANNED** in `src/js/gameplay/crafting.js` keeps defined items out of play (today: coins, until settlement traders in E2): recipes, menus and loot tables are filtered by it. Never add a modern item; the content test refuses power, trade, ore-processing and rail items.
- **Names:** anything named after a person or place uses `core/names.js` (`nameWord`, `fullName`, `isBlockedName`); `15-names` checks every fixed name too.
- **Loot:** `[id, min, max, weight]` tables `LOOT`, `BARRELLOOT` (`src/js/world/underground-sites.js`), `DWLOOT`, `ARMORY_L`, `FOOD_L`, `SCHOLAR_L`, `SMITH_L`, `TREASURE_L` and `ROOM_LOOT` by room type (`src/js/ruins/megastructures.js`). Loot is rolled from the chest's world position when opened, so changing a table changes chest contents in existing worlds but not the world hash.

## Generation
A new block only changes the world if generation places it. If it does, follow the `worldgen-change` skill (snapshot and save key).

## Tests
`npm test -- content-tables smoke world-hash`, then the full suite and both builds. Expect `world-hash` to pass unless generation places the block.

## In-game check to request
Where to find it (creative category, recipe, or seed and place), what it looks like, its sound and how long it takes to break with which pickaxe.
