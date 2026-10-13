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

## The elves (D-088)

Drafts for the owner, in `gameplay/elves.js`.

**Their tongue** (`ELF_TONGUE`): words of our own, checked against the blocklist (`82-elf-friends`).

| Saying | Its meaning |
|---|---|
| Saelith ynnor | Well met beneath the stars |
| Tavael oressa, quilar | Walk in light, traveller |
| Liathe nysse sorae | The road is long, but the night is kind |
| Faerel auvrin vael | Rest here; the watch is kept |
| Ynnor saeth, vaelis | The stars keep you, friend |
| Orrin tavael quessa | Go in peace, and come again |
| Sylvar ithae | The leaves remember |
| Shaen tavrel, ynnor sael | Go softly; the trees will know you |
| Quessa naeth oryn | Our hall is open to you |
| Vaelis, auvrin tae | Friend, sit with us |

**The name they give a friend** (`elfNaming`): a word in the people's naming style and an epithet: Starwalker, the Far-come, Friend of the Lamps, the Wayfarer, Light-bearer (the high elves); Leaf-walker, the Quiet Foot, Friend of the Boughs, Bright-eye, the Wanderer (the wood elves).

**The histories** (`elfTales`): eight tales for each kingdom, its names drawn for that kingdom. The high elves: The Founding; The Lamps of (a loremaster); The War of the Fire; The Elder Realms; The Moonwells; The Stars of the Elves (the Lamp of the north that never sets, a Crown of summer, the Long Road the dead walk, the Ship low over the sea in autumn); The Haven of (a haven); The Dwindling. The wood elves: The Waking of the Wood; The First Goldbough; The Long Hunt; The Halls under the Hill; The Feast of (a singer); The Fire in the East; The Stars over the Wood (the Silver Bough, a Crown, the Falling Leaf); The Leaving.

## The white realm (D-089)

Drafts for the owner, in `gameplay/men.js` and `world/old-kingdom.js`.

**Ranks** (`MEN_RANK`): Stranger, Freeman of the Realm, Friend of the Realm, Esquire of the Realm, Knight of the Realm, Lord of the Realm. A knight is hailed "good knight", a lord "my lord".

**The chronicles of the kings** (`menTales`): eight for each kingdom, read at the lectern in the house of the kings at its hallows and kept in the journal; the kings' names are drawn for each kingdom in the realm's naming style.

| Chronicle | What it tells |
|---|---|
| The Founding | When the old kingdom fell, the first king gathered its last lords at the fords of the south and raised the white tower; the star over the tower is the realm's sign still. |
| The Silver Tree | A king brought a seedling of silver from the ruins of the old kings and set it in the citadel's court; while it lives the line of the kings will not fail, and it flowers when the realm is saved. |
| The Kings' Gate | Two kings of stone stand where the old road crosses the hills, their hands raised against the east; nobody now living knows their names. A king had their faces cleaned of moss, and wept. |
| The War of the Ash | In one king's days the fire of the wastes came west, and the realm stood with the elves and the dwarves before the Ashen Gate. The king did not come home; his shield hangs in the great hall. |
| The Beacons | A king set beacons on every height from the border to the royal city, so that a fire lit at the edge of the realm is seen at the king's window before the night is out. |
| The Long Peace | Under a king the roads were paved and kerbed, a lamp on every milestone, and a child could walk from the border to the sea with a purse of gold and keep it. |
| The Ships of (a king) | A king built the harbours and the cogs of the realm; some have not come back, and their names are read in the hallows every spring. |
| The Dwindling | The realm is smaller than it was. The lists, the courts and the markets are as they were, but the old kingdom's cities are grass, and the east is burning. |

**The ruins of the old kingdom** (`OLD_NAMES`): The Kings' Gate of (a name), The Crowned King of (a name), The Fallen City of (a name), The Old Beacon of (a name), The Tomb of King (a name of men). Their chests hold the crown of an old king, the seal of the old kings and the cup of the old kings.

**The knight's arms** (`ARMS_F`, `ARMS_C`, `ARMS_T`), chosen at the heralds' table and told in words ("a tree in silver on blue"): fields of black, red, blue, green, white or gold; a star, a tower, a sword, a tree, a ship or a crown; in silver, gold or black.

**What the folk say** (`FOLK_SAY`), among others: the king, "Be welcome in (the city), traveller. The king's peace is on you here." The queen, "The silver tree has not flowered in my lifetime. I hope to see it." The warden of the hallows, "Speak softly. The kings sleep here." The knight of the tourney, "There is no shame in a fall at the tilt; only in not riding." The watchman, "The tenth hour, and all is well." A child, "We're playing at the War of the Ash! I'm the king!"

**The crier's news** (`menNews`): the hosts still before the Ashen Gate, or the gate fallen and the hosts marching on; raiders burning farms on the border and the beacons lit; an Emberlord fallen and the silver tree in flower; the king's orders for the roads and the beacons; jousting at the lists.

## The riders (D-090)

Drafts for the owner, in `gameplay/riders.js` and `world/forefathers.js`.

**Ranks** (`RH_RANK`): Stranger, Guest of the Hall, Hall-friend, Friend of the Riders, Sworn Rider, Thane of the Riders.

**Their tongue** (`RIDER_TONGUE`): words of our own, checked against the blocklist (`89-rider-standing`).

| Saying | Its meaning |
|---|---|
| Holdra venn, ferrin | Well met, wayfarer |
| Grasa ronn thi helda | The grass and the wind keep you |
| Sela una hrosk | Hearth and horse |
| Vindr tharn, ferrin | Ride swift, wayfarer |
| Medra fullan! | A full cup! |
| Holdu wethra, skildra | Keep the oath, shield-friend |
| Ernas oldra sweran | The old ones sleep in the mounds |
| Tharn hrosk, varm heorth | A swift horse and a warm hearth |
| Vela sunnar | Fair sun to you |
| Ferrin, saeta oss | Wayfarer, sit with us |

**The songs of the kings** (`riderSongs`): eight for each kingdom, sung by the lay-singers and the wardens of the mounds and kept in the journal; the kings' names are drawn for each kingdom in the riders' naming style.

| Song | What it tells |
|---|---|
| The Coming out of the North | The first king led the riders down out of the cold north with their herds; where his horse first drank, the first hall stood. |
| The White Horse on the Hill | They found the horses of their forefathers cut white into the chalk of the hills; the white horse running became their sign. |
| The Golden Hall | A king raised the golden hall on the hill, its posts carved with every horse he had loved, its roof gilded so it shone a day's ride away. |
| The Windsteed | A king walked after a great silver horse of the wild herds for a summer until it let him lay a hand on its neck; the windsteeds carry only the sworn. |
| The Long Ride | When the white realm was hard pressed, a king rode with every horse in the land three days and nights across the plains and came to the field at dawn. |
| The Mounds of the Kings | A king was laid in the first of the great mounds with his horse beside him, and the barrowbloom came up white on it the next spring. |
| The War of the Ash | The fire came west out of the wastes, and the riders rode with the elves and the dwarves to the Ashen Gate. The war is not over. |
| The Grass Grows Long | The herds are fewer than they were, and the halls of the forefathers are ash on the hills; but the grass grows long, and the riders still ride. |

**The ruins of the forefathers** (`FATHER_NAMES`): The White Horse of (a name), The Stone Ring of (a name), The Stone Ship of (a name), The Burned Hall of (a name), The Picture Stones of (a name). Their hoard chests hold the bracteate, the golden horn and the arm-ring of the forefathers. A picture stone shows a sun over the sea, a ship under a square sail with her oars out, riders with spears, and at its foot a horse with no rider.

**The oath** (`riderOath`): "I will ride when the riders ride, and hold where they hold, and keep faith with the high seat while the grass grows." The hall answers: "Holdu wethra, skildra!"

**Horses the herds name** (`RIDER_HNAMES`): Swiftmane, Windfoot, Grassrunner, Greyflank, Sunmane, Stormhoof, Fleetwind, Duskmane, Brightfoot, Hillrunner.

**What the folk say** (`FOLK_SAY`), among others: the king, "My fathers came out of the north with nothing but their horses." The queen, "The cup goes round the hall, and every rider drinks from it." A doorwarden, "Lay aside your blade at the door. It will be here when you come out." A shieldmaiden, "My shield has turned an orc's axe. It will turn yours." The warden of the mounds, "The barrowbloom came up white again this spring." A child, "I am a king of the riders and this is my horse!"
