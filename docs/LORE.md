# Lore drafts (M7)

Setting text drafted for the owner's approval (Q28). Everything here is in the game since 0.23.0 and can be rewritten freely: no save depends on it. Names never use Tolkien's (`core/names.js` refuses them).

## Hold chronicles

Every dwarven hold has a chronicle of eight pages (`holdChronicle` in `src/js/ruins/holds-and-lore.js`). Each lectern in a hold holds one page, chosen by its position; the journal keeps the pages in chronicle order and marks the ones not yet found. Years rise from the hold's founding year by 8 to 67 a page. The hold's name, king, queen and guild are filled in.

| Page | Title | Draft |
|---|---|---|
| 1 | The Founding | In the year (founding) King (king) led the first delvers into the mountain and named the place (hold). The first hall was cut in a single winter, and the first lamp was lit in it on the longest night. |
| 2 | The First Deep | (Guild) broke through to the first deep and found tin and copper in good seams. The forges were lit, and it was decreed that they should never go out while the hold stood. |
| 3 | The Market Days | Brass for wheat, wheat for ale, ale for stories. Traders from the surface come up the gate road every season, and Queen (queen) buys every lantern in the row. |
| 4 | The Great Work | After long years of cutting, the hold has finished (one of: a cavern of living crystal that hums at night; a library of four hundred shelves cut into the living rock; a throne hall whose pillars are carved with the names of every delver; cisterns deep enough to keep the hold through a hundred dry years). The masons who began it did not live to see it done, and their names are cut over its door. |
| 5 | The Warning | The first line of the hold's turning (below). |
| 6 | The Lean Years | The second line. |
| 7 | The Leaving, or The Holding | Abandoned: the third line. Inhabited: "We did not leave. (Guild) found new work for every hand, and the lamps of (hold) were never let go out." |
| 8 | The Last Page, or The Present Day | Abandoned: "Roster of the last watch of (hold): eleven names, then a twelfth in a shaking hand. Below it, the words 'the lamps are out', and nothing more." Inhabited: "The halls of (hold) still ring with hammers. The gates stand open to anyone who comes in peace, though fewer travellers come up the old roads each year." |

The turnings (one per hold): the fire below rising; the veins running out; the roof failing; a cold spring flooding the cisterns; the guilds quarrelling until each leaves by its own gate. None is a war: the peoples stay peaceful (Q3, Q46).

Plazas keep their waymarkers (arrows toward a treasure room and the nearest gate). Every page still carries the margin notes toward treasure and the way up.

## Rune tablets

Read in this order, one per tablet used:

1. Strike once for the stone, once for the king, once for the ones below who never saw the sun.
2. The lamp that is never put out is the hold that is never lost.
3. Stone remembers what the delver forgets.
4. Whoever cuts the living crystal cuts the song out of the mountain.
5. Tin from the east, copper from the west, and brass from the meeting of the two.
6. Seal the deep gate behind you. What the fire takes, the fire keeps.
7. Seven steps between each landing, and a lamp at every seventh.
8. The guest at the gate is fed before the king.
9. Under the cracked tile, the savings of the careful.
10. Water finds the weak seam. So does greed.
11. Every hall was a cave once, and every cave will be a hall.
12. When the last lamp is out, leave the door open for the ones who come after.

## Names by people (Q26)

Every people named by a land has a naming style in `core/names.js`. Dwarf names are approved; the rest are drafts. Samples (one seed):

| People | Samples |
|---|---|
| Dwarf (approved) | Arkkin, Haldak, Ulmkin Kraglok, Karnfast, Fennrim, Daghald Magtun |
| Human | Alwick, Garric, Hewley Randwick, Osford, Edwin, Cenley Wilard |
| Halfling | Brambottom, Fennble, Pudbottom Mottbottom, Lobkin, Dillford, Cobwick Nibden |
| Gnome | Bixple, Pellbel, Dibbnock Tinkple, Quilkin, Nimzle, Fizznock Tinkpop |
| Goblin | Grubzik, Skabak, Mubsk Vexzik, Sniknit, Rikruk, Nagsk Vexsnag |
| Orc | Brakrok, Kromash, Hrudnak Rukrok, Muggor, Gashug, Drognak Rukgrim |
| Wood elf | Aelrael, Lirlan, Naedris Tharael, Sylion, Faevin, Caeldris Thamira |
| High elf | Aenoriel, Ithadir, Vaeoriel Quaoriel, Naridel, Ilmesse, Caloriel Quander |
| Drow | Draryn, Malaeth, Quarlyn Velryn, Nhelith, Jharzith, Ilvlyn Velnyss |
| Beastfolk | Arrtail, Hofka, Brintail Rhatail, Marrek, Grrun, Fangtail Rharro |
