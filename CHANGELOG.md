# Changelog

All notable changes to Fantasy BlockCraft. Newest first. Versions follow `package.json`.
Entries are grouped under **Game** (anything a player would notice) and **Tooling** (build, tests, CI, docs).

## Unreleased

## 0.37.0 (2026-10-12): the war at the gates of the wastes

Saves from 0.36.0 do not carry over (save key v27): the wastes are remade about their gates.

### Game
- **The Volcanic Wastes mended.**
  - Each basin has one great volcano. A basin of several stretches used to raise one for each, so two or three stood together.
  - No volcano is cut in two: the gorges of the wastes no longer slice through cones (they narrow and stop at a volcano's foot), and where two volcanoes' reaches overlap the higher ground wins instead of the first.
  - No crystal geode or fossil hangs in the air over a sunken basin's floor.
  - The gullies down the great volcano are a third as deep and half again as wide, and the lava in them is three deep, thinning toward the foot.
- **The Ashen Gate.** Every basin of the wastes has one way in for an army, on the side facing the nearest realm. The ring of ash mountains breaks into a pass cut down to the level of the lands outside, and across it the orcs have built a gate of basalt between two towers 64 high, the Emberlord's horned skull over the arch. One leaf is shut and propped with great beams; the other hangs ajar, its bar broken, and there is a way through by its edge.
  - **The Long Descent:** inside, a broad paved road runs down along the ring's inner wall at one in eight from the gate's yard to the floor of the wastes.
  - **The Gatewarden's Camp** fills the yard behind the gate: barricades of stakes, a palisade, the warlord's hall, tents of hide, a forge by a trough of lava, a troll's cage, a war drum and two stone-throwers aimed at the gate. Archers walk the gate's top.
  - **The siege:** at the shut leaf stands the dwarves' ram ("X the Gatebreaker"), its steel head in a bronze collar, slung under a shed of bronze plates on eight wheels. A covered way of mantlets leads back to the siege lines (ditch, rampart, palisade, towers, ballistae), with the dwarves' trebuchets and a siege tower of men behind them.
  - **The Leaguer:** beyond the lines lies the camp of the allied hosts, 250 blocks square, more than three times the ground of the largest city of men. It has a ditch, rampart and palisade with towers and four gates, streets and a muster field. In the middle the Pavilion of the Three Banners, where men, elves and dwarves hold council, faces a square with the three banners on tall poles. The men's lines of tents, timber halls, smithy and stables; the elves' round pavilions, watch-spire and archery range; the dwarves' granite redoubt with its forges, crane, trebuchet and a second ram; storehouses, wagons, wells, cook-fires and a field hospital.
  - **The war:** both camps are manned, and while you are near the gate the two sides keep sending raiding parties, scouts and now and then whole armies at each other through the gap. Allied raiders march from the lines into the orcs' yard; orc bands sally out against the lines; elven scouts slip through and on down the long road; goblins creep round the camp; men, elves and dwarves march together, or a warhost pours out with trolls and a warchief. They fight wherever they meet, hold a while, and march home. In creative they never turn on you. The camp's folk have their own words for a passer-by.
  - **The engines and the sound of it:** the dwarves' trebuchets loft stones over the wall into the yard and the orcs' throwers send burning pots onto the lines (for the look and the sound; they strike no one). Near the gate you hear the orcs' drums behind the wall, the hosts' horns, the clash of arms along the pass and hammering at the engines; the drums beat harder by night.
- **The Ember Stair.** Inside every great volcano a way winds up from a door in the Ember Throne's way in, round and round inside the mountain at one in six, two to three turns, up to a gallery open over the crater's lake of fire. It is part orc stronghold (dressed basalt, tiled floors, fire baskets, iron gates; the Gate of the Stair, the Barracks of the Ash Guard, the Forge of the Deep Fire, the Armoury of the Throne, the Shrine of the Emberlord, the Pit of the Stair) and part raw cave of the mountain's fire (cinder and obsidian, crusted lava, veins of magma; the Cavern of Cinders with its pool of lava, the Obsidian Hollow with its spires), each chamber held by orcs, goblins or trolls.
- The readout names the gate, the ram, the siege lines, the camp and its pavilion, the yard, the road, the stair and its chambers.
- New blocks (creative, Building): Tent Canvas, Gate Iron, Mantlet.
- The creative land tour gains the gates' works.

### Tooling
- New test case `59-gates`. `47-volcanic` and `55-strife` find their windows round about where the new terrain moved them (D-067).

## 0.36.0 (2026-10-11): the mountain dwarves

Saves from 0.35.0 do not carry over (save key v26): the dwarves are new to the world.

### Game
- **The mountain dwarves.** The High Mountains the high elves do not hold, and about half the stretches of the Pine Highlands and the Glacier Fields, are provinces of mountain kingdoms. They build on terraces cut into the mountains and delve under them. The old dwarven ruins are unchanged.
  - **Mountain holds:** walls of dressed granite with square towers and ballistae, a gatehouse with its portcullis, granite houses under steep slate, smithies, smelting furnaces glowing at their mouths, a headframe over the city's mine, treadwheel cranes, trebuchets behind the gate. At the back a massif of rock rises with the great gate cut in its face between two colossal kings of stone.
  - **Under the mountain:** the gate hall, the great hall on its columns with the king's seat, barracks, a great shaft with its hoist down through every level, the forge hall with its channel of molten iron, a cistern, and deep down a smelting hall and mines spreading in timbered galleries with ore in their walls. More is carved under each hold than stands over it.
  - **Bastions** with a squat keep, ballistae, a trebuchet and a garrison hall under the keep; **mining towns** round a headframe over two levels of mines; **lookouts** with a ballista and a beacon; **mines** under their headframes; stone roads with lamps on columns.
  - **Their folk:** axeguards with round shields, hammerers in plate with great hammers, crossbowmen, captains in winged helms, the Mountain King in crimson and gold, thanes, ladies, miners and smiths, all short and broad with braided beards. Neutral until one is struck, never hostile in creative; their horn sounds two deep notes. Their hosts march into the wastes like the other peoples'.
  - Their places sound of hammers, carts, picks and a deep chant.
- New blocks (creative, Building): Dwarven Granite, Granite Courses, Knotwork Granite, Hold Column, Bronze Plating, Forge Brick, Molten Iron, Hold Lamp, Iron Cogwheel, Ore Cart, Slag, Pit Prop, Banner of the Mountain, Anvil, Hold Flagstones.
- The creative land tour gains the dwarves' places.

### Tooling
- New test case `58-dwarves`.

## 0.35.0 (2026-10-11): the wood elves

Saves from 0.34.0 do not carry over (save key v25): the wood elves are new to the world.

### Game
- **The wood elves.** The forest kingdoms hold about half the stretches of the Elder Wood, Autumn Woods, Birch Glades, Ancient Giant Wood, Yew Wood and Silverwood. They build in and under the trees on the ground as it lies, and the forest grows on between their works.
  - **Cities in the trees:** great goldboughs with silver bark and golden crowns, platforms of pale planks round their trunks at shared heights, houses wrapped round the trunks under leaf thatch, stairs winding up, bridges with woven rails from tree to tree, lamps of pale light everywhere. A clipped hedge rings the city, its gate between two goldboughs under a bridge; the king's tree stands at the back with his hall high in it. A spring and an archery range lie by the way.
  - **The king's halls** under a hill: a forecourt over a stream, a gate of rootstone in the hill's face, a great hall on pillars like trees, the king's seat crowned with antlers, a cellar of casks and a guardroom.
  - **Tree-villages** round feasting glades, **watch-trees** standing alone, **glades** with long tables, casks and a fire; lamplit ways between them.
  - **Their folk:** wardens in hooded grey-green cloaks with long bows (they see and shoot farthest of any folk), blades with two long knives, guards of the halls in copper leaf armour with glaives, captains, the king under a crown of autumn leaves, lords, ladies and the folk of the glades. Neutral until one is struck, never hostile in creative; their horn sounds three rising notes. Their hosts march into the wastes like the other peoples'.
  - Their places sound of birds, distant singing and a harp by day, and of singing, crickets and owls by night.
- New blocks (creative, under Building and Wood and plants): Goldbough Bark, Goldbough Planks, Goldbough Leaves, Woodland Lamp, Woven Rail, Carved Wood, Rootstone, Clipped Hedge, Banner of the Wood, Leaf Thatch.
- The creative land tour gains the wood elves' places.

### Tooling
- New test case `57-woodelves`.

## 0.34.0 (2026-10-11): lava down the gullies, and the orcs' places

Saves from 0.33.0 do not carry over (save key v24): the volcanoes' gullies and the orcs' places are new to the world.

### Game
- **Lava down the gullies.** The gullies down every volcano's flanks have flat floors now, and most carry a stream of lava from high on the flank to the foot; the rest have floors of glowing crust. None runs down the side a mountain's fortress faces.
- **The orcs' places.** War camps, watchtowers, forges and fighting pits stand across the open floor of the Volcanic Wastes, each named and held by orcs:
  - **War camps** behind black palisades with gate towers, tents of hide round a fire, poles of skulls, the warchief's tent, cages, racks of spears.
  - **Watchtowers** of basalt, palisade and riveted iron, bowmen on a platform under a roof of hide.
  - **Forges** with a smelter glowing at its mouth, a trough of lava, anvils under an awning hung with chains.
  - **Fighting pits** walled in basalt with spikes along the rim and cages in the wall, sometimes with a troll in them.
- They show in the readout, on the world map and in the journal ("Places of the orcs"); the hosts of the peoples fall on them.
- New blocks (creative, Building): Black Palisade, Riveted Iron.

### Tooling
- New test case `56-orcs`.

## 0.33.0 (2026-10-11): the peoples against the wastes

Saves from 0.32.0 carry over (save key v23): the world is unchanged.

### Game
- **The peoples and the creatures of the wastes are foes.** Men, riders and elves on one side, orcs, trolls, goblins and the Emberlords on the other, fight wherever they meet, in creative too: they see each other, close in, strike, shoot and throw until one falls. Townsfolk flee. Each side keeps the peace within itself.
  - The folk never turn on a player who does them no harm: their blows and arrows strike only the creatures they fight (an arrow passes the player by). The creatures' arrows and stones still strike a player in survival.
  - A creature the player strikes turns from the folk it fights to the player. What falls to the other side leaves the player nothing.
- **Hosts in the wastes.** Every few minutes a host of the nearest people (men, riders or elves, four to six with a captain) marches through the Volcanic Wastes past the player and falls upon the warbands it meets. A host greets a passer-by in its own words and turns on a player who strikes one of it.

### Tooling
- New test case `55-strife`.

## 0.32.0 (2026-10-11): the high elves

Saves from 0.31.0 do not carry over (save key v23): the high elves are new to the world.

### Game
- **The high elves.** About half the stretches of the High Mountains, Alpine Meadows, Karst Crags, Fjords and Chalk Cliffs are held by the elder realms of the high elves, in pale elvenstone and gilded armour under their sign of a silver star over two leaves. They need no level ground: their cities climb the mountainsides in terraces, every building on its own platform behind dressed retaining walls with gilt rails.
  - **Hidden cities:** behind walls with many towers and a great pointed gate between statues of warriors, the way climbs by stairs to the high hall with its arcaded porch and great tower; halls with tall arched windows of stained glass under tracery, balconies of filigree and roofs of verdigris and dark shingle swept up from low eaves; slender towers with galleries and open belvederes under swept cones; pavilions under domes, pools with lamps standing in them, gardens, silver-leaved and blossoming trees; barracks, an armoury and a training ground by the gate.
  - **Fastnesses** with a great tower in a walled court, **refuges** of halls round a pavilion and pool, **watch-spires** on the heights, **gardens** of orchards and blossom.
  - **The elven ways:** paved roads with lamps on columns, hidden paths, bridges on slender piers.
- **Their folk:** spearwardens with glaives, bladewardens with curved blades and tall leaf-shaped shields, archers with tall bows, lord-captains in blue cloaks, all in gilded leaf-scale armour over wine-red robes under crested helms; knights on horses in long blue caparisons; elf-lords, elf-ladies, loremasters and smiths in flowing robes and gowns. Taller and stronger than men, their gates held by many, neutral until struck, with their own words and a clear high horn.
- Their cities sound of a harp, singing far off, chimes and birds.
- New blocks (creative, Building): Elvenstone, Elvenstone Courses, Carved Elvenstone, Elven Column, Elven Tracery, Elven Glass, Verdigris Roof, Elven Shingles, Gilt Filigree, Elven Lamp, Banner of the Elves, Golden Wood, Elven Mosaic.
- Creative: the land tour lists the high elves' places.

### Tooling
- New test case `54-elves`; `15-names` allows five refused pairs.

## 0.31.0 (2026-10-11): the riders of the plains

Saves from 0.30.0 do not carry over (save key v22): the riders are new to the world.

### Game
- **The riders of the plains.** About half the stretches of the Golden Steppe, the Heath Moors and the Barrow Hills are held by kingdoms of horse-lords in mail and green, under their sign of a white horse running. Each held stretch is a province:
  - **Hill town:** round terraces on a hill behind a palisade of sharpened logs over a ditch, timber towers under golden thatch, the way up by stairs between carved posts to the golden hall (carved and gilded, a long hearth, tapestries and shields, the high seat), longhouses of wattle under turf and thatch in rings round the terraces, stables, a paddock of horses, a smithy and stalls by the gate. Kings' mounds line the road before the king's seat.
  - **Hold:** a round fieldstone wall over a ditch, round gate towers capped in thatch, a round keep with a gallery, a training ring for horses.
  - **Steadings:** longhouses and a mead hall round a green and well, a paddock, a smithy, a fence of wattle hurdles, fields.
  - **Horse farms:** a long stable, a farmhouse and paddocks of horses. **Beacons** on the heights, kept lit.
  - **Roads:** the riders' road of beaten earth with carved posts and the horse heads, cart tracks, timber bridges.
- **Their folk:**
  - **Guards** in long mail and green cloaks bordered in gold, tall helms with a tail of white horsehair, round green shields with the white horse, pennoned spears; **bowmen** in quilted coats with short horn bows; **marshals** in gilded helms with a horn at the belt.
  - **Horsemen** ride saddled and caparisoned horses, gallop, and ride the roads in patrols.
  - **Freemen, freewomen, horse-herds and thanes** in woven borders, embroidered gowns and braids, hoods and crooks, green and gold.
  - Neutral like the white realm's folk, with their own greetings and a low horn when they take up arms. Horses in the paddocks stay penned until you ride one away.
- Their towns sound of voices, horses, hooves, a forge and a horn.
- No heather, bracken or reeds grow on the realms' sites.
- New blocks (creative, Building): Golden Thatch, Turf Roof, Wattle and Daub, Carved Oak, Fieldstone, Sharpened Stakes, Banner of the Riders, Horse-Head Gable, Hung Shields, Long Hearth, Tapestry, Gilded Oak, Rail Fence.
- Creative: the land tour lists the riders' places (a king's seat, a hill town, a hold, a steading, a beacon, a horse farm).

### Tooling
- New test case `53-riders`; `52-realms` measures the white realm's own lands.

## 0.30.0 (2026-10-11): the realms of men

Saves from 0.29.0 do not carry over (save key v21): the realms of men are new to the world.

### Game
- **The realms of men.** About half the stretches of Green Hills, Overgrown Farmland, Wild Orchards, Flower Meadows and Old Terraces are held by kingdoms of high men, in white stone and black livery under their sign of a star over a tower. Each held stretch is a province:
  - **City:** a walled city in tiers (the royal city in three), its avenue climbing by stairs under arches to the citadel. It has a market square with a fountain and stalls, whitestone and timbered houses under slate, gardens, barracks and a training yard, a smithy and stables, the domed Hall of Lamps, and in the citadel a great hall, a statue of a king of old and the white tower.
  - **Castle:** a castle on the border.
  - **Villages:** thatched cottages round a green and well, an inn, a chapel with a bell tower, a smithy.
  - **Farmsteads:** farmsteads with hedged fields of wheat, potatoes, turnips and beans.
  - **Watchtowers:** watchtowers with beacons on the heights.
  - **Roads:** paved king's roads with lamp-topped milestones, country lanes, and bridges over the rivers.
- **Their folk:**
  - **Soldiers:** spearmen and swordsmen with kite shields, archers with longbows, captains in black cloaks, all in black surcoats over mail with the white sign, and tall crested helms.
  - **Townsfolk:** townsmen and townswomen, merchants, smiths, farmers and lords of the realm, each dressed by their trade.
  - **Behaviour:** they go about their places, patrol the king's roads, stop and turn to you, and greet you by the name of their town and kingdom. They are neutral: strike one and the guards near by take up arms while the townsfolk flee, until their wrath passes. Never in creative.
- The readout names the place and the kingdom that holds it. Places of the realms and the folk you meet go in the journal. Towns have their own sounds: voices, carts, a bell, a forge, dogs at night.
- New blocks (creative, Building):
  - Whitestone, Whitestone Bricks, Carved Whitestone, Whitestone Pillar.
  - Slate Roof, Timbered Plaster, Braced Timber Frame, Thatch.
  - Banner of the Realm, Hay Bale, Paving Stones, Leaded Glass.
- Creative: the land tour takes you to the nearest royal city, city, castle, village, watchtower or farmstead.
- **The realms' buildings stand in relief:** rock-faced plinths, quoins, windows set back over sills, moulded string courses and corbelled cornices, jettied timber storeys, dormers, overhanging verges with finials, buttresses, corbelled parapets on towers and walls, arrow loops, a deep gatehouse, a domed hall on a drum, a chapel with lancets, a rose window and a belfry. Two new blocks: Rough Whitestone and Whitestone Moulding.
- **The folk in detail:** painted at twice the resolution, with mail in rings, riveted plate, stitched leather and cloth in folds; soldiers have nasal helms with cheek guards, layered pauldrons, vambraces, greaves, gauntlets, swords with guards and pommels, leaf-bladed spears, curved longbows; the townsfolk have laced bodices, fur trims, smocking, woven hats and a lord's chain of office.

### Tooling
- New test case `52-realms`. Province planning runs in a streaming step of its own, a slice of at most 6 ms a frame.
- Models can be painted at more than one texel to a pixel (`res`). `tools/shot.mjs --near=2` stands lined-up figures closer to the camera.

## 0.29.0 (2026-10-11): the Ember Throne, built with care

Saves from 0.28.0 do not carry over (save key v20): the fortresses in the volcanoes are rebuilt.

### Game
- **The Ember Throne rebuilt in detail**, and the orcs' warholds with it:
  - **The approach:** a stair between skull-topped walls climbs to a deep terrace. A moat of fire crosses it under a bridge lined with fire baskets, the paved way has a burning line down its middle, and obelisks stand at the corners.
  - **The guardians:** two of them flank the way, 42 blocks tall, in the Emberlord's likeness. Each rests its hands on a great sword set point down, its wings folded and edged with fire, horned, its eyes burning.
  - **The gate:** a pointed arch in rings of obsidian, fire and carving, with fangs at its mouth and the portcullis drawn up into it. Above it is the face of a demon, with a heavy brow over slanted burning eyes and horns rising over the battlements.
  - **The towers:** battered feet, fluted corners, slits lit from within, machicolations, spiked battlements, horns at the corners, pools of fire on their roofs and banners down their faces.
  - **The way in:** a pointed vault on ribs of fire, with fire baskets, skulls in niches under burning script, and fire hung on chains.
  - **The throne hall:** pointed vaults over the nave and aisles, ribbed with fire, and pillars on obsidian bases ringed with burning script, joined by arcades. Cages of fire hang on chains, and the rivers of fire are kerbed and bridged. Guardians stand in the aisles, and the dais's steps are written in fire. The throne is peaked and horned, with the hoard heaped about it. Behind it are the lord's burning sign and columns of lava behind grates.
- **No flat walls or ceilings:**
  - The vaults over the hall and the way in are coffered, with fire set into every other coffer, and cornices with fire baskets run along their springings.
  - The hall's side walls are lined with carved blind arches with a fire at each foot, and its end walls with sunk lancets. A deep arch behind the throne frames the lord's sign.
  - The towers are grooved, the way in's walls are coursed, and the facade carries ledges and panels.
  - The halls are a little brighter, so the relief shows.
- **The Volcanic Wastes are no longer black.**
  - The dark rock (black ash, cinder, basalt, obsidian, charred wood, lava crust and every kind of basalt brick) is painted lighter and with edges: wind ripples in the ash, rims round the cinder's pits, bevelled bricks, and glassy streaks in the obsidian.
  - The burning sky dims the day less.
  - By night the burning smoke lights the land a dull red, so it never sinks into black.
  - The goblin warrens are a little brighter.
  - Basalt, obsidian and black sand are lighter wherever they lie.
- New blocks: cracked basalt bricks, basalt tiles, carved basalt, ember script, obsidian bricks, basalt pillar, iron chain (climbable), fire basket and iron spikes (creative, Building).

### Tooling
- `tools/shot.mjs --tiles=` draws atlas tiles enlarged side by side.
- The test harness paints the whole atlas (its stand-in image data was 256 by 256). `47-volcanic` checks that the wastes' dark blocks keep their definition and that the burning sky leaves enough light.
- `49-warrens` checks the fortress's detail: its masonry, the pointed gate, the guardians, the tower pools and the lava behind the grates.

## 0.28.0 (2026-10-10): foes in the fire

Saves from 0.27.0 do not carry over (save key v19): the Volcanic Wastes have changed underground and in their volcanoes.

### Game
- **Foes in the Volcanic Wastes, and only there.** Orc warbands roam the wastes and hold the Ashen Citadel: raiders, bowmen who keep their distance, brutes behind shields, and a horned warchief whose war horn brings the band. Ash trolls three blocks tall, lava glowing in the cracks of their hide, swing basalt clubs and throw rocks. In creative they take no notice of you.
- **Goblin warrens** replace the crawlways and the upper caves under the wastes' sunken floor: halls on two levels cut in black rock seamed with magma, joined by propped tunnels, with hide huts round fire pits, stores, cages, forges, fire shrines, channels of lava and the chief's throne with its hoard. Goblin cutters, slingers and firecallers live there under a chieftain, some asleep in their dens, and keep camp at every way in. A way down leads on to the caves below.
- **The wastes are sunken.** Each stretch lies in a basin at least 800 blocks across, its floor about 90 below the lands around, walled by a ring of black ash mountains about 90 above them: climb some 90 blocks to the jagged crest, then go down some 180 by cliffs and shelves to the floor. Its rivers run with lava, and nothing inside the ring is water.
- **A grand volcano** rises near the middle of every basin, about 250 blocks high and 500 across, its burning crater some 70 blocks above the ring, with lesser cones about its foot and more lesser volcanoes across the floor. No volcano is a perfect cone: each is lopsided, its crater off its middle, steeper on some sides, scored by uneven gullies, its rim toothed; a great one has a scar where a flank fell away, a second summit on one shoulder and a lesser cone on another. From afar a hazed stand-in of the basin and its volcano shows beyond the loaded world, crater and flows glowing.
- **The Ember Throne:** in each great volcano an Emberlord's fortress built to its size, with a gate between towers fifty-eight blocks high, a long broad way in past troughs of lava, and under the summit a throne hall eighty blocks wide and fifty high. There waits the Emberlord, a demon of shadow and flame twelve blocks tall, built of angled, tapering shapes: hunched over great clawed legs, shoulders broad over a narrow waist, spines down its back; a horned skull thrust forward, narrowing to the muzzle, slanted burning eyes under a heavy brow, fangs and a burning maw; a mane of flame; and vast wings of tapering bones and torn membrane smouldering at their edges. It walks with a heavy rolling stride that shakes the ground, wings beating slowly, a burning blade in one hand and a whip of fire in the other, and it never leaves its fortress. Once fallen, it stays fallen. (You asked for balrogs; that name is Tolkien's, so these are the Emberlords.)
- **Foes walk:** their legs never swung before (a bug); now every foe strides.
- **Warholds:** the lesser volcanoes' fortresses are held by orcs under a warchief.
- **Fighting back:** swords from wood to moonsilver, and armour for a new body slot (Hide Jerkin, Iron Mail, Steel Plate, Moonsilver Mail). Foes leave iron, coal, leather, sulphur, troll hide and gold; the Emberlord leaves the Flamebrand and the Emberheart.
- **Lava flows like water:** break into it and it spreads, slowly, up to four blocks and falls down holes. Where it meets water it hardens into obsidian or basalt.
- The warrens and fortresses glow red inside, with war drums and goblin chatter in the rock.
- New blocks: hide canvas, iron grate, basalt bricks, ember bricks, skull totem, war banner.

- **See farther:** a new Loaded area setting in the pause menu (Near, Far, Farthest: 224, 320 or 416 blocks of world kept about you) lets the view reach up to 200 blocks, with two new view distances, Farther and Farthest. Auto picks Far on desktops and handhelds with 8 cores or more. Changing it saves and starts the game again.

### Tooling
- `tools/shot.mjs --foes[=kinds]` lines foes up (winding up, walking or asleep; turned by degrees, and `--far=` for an Emberlord).
- `tools/map.mjs` draws dry ground below the sea's level as land and the air above the ground as sky.
- Model parts can taper (frustums, wedges, spikes) through a `tp` option.
- The creative land tour no longer sends you to a cell the sunken wastes have taken.
- A test case can set the loaded area (`// @area 1`); new case `51-area`. `tools/shot.mjs --area= --viewd=`.
- New tests `48-lava-flow`, `49-warrens` (warrens and fortresses) and `50-foes`.

## 0.27.0 (2026-10-10): the Volcanic Wastes remade

Saves from 0.26.0 do not carry over (save key v18): the world has changed.

### Game
- **A burning sky:** over the Volcanic Wastes the sky turns black with a red glow on the horizon, the sun is a dull ember and the clouds go dark as smoke.
- **Blue lightning:** storms everywhere now throw forked bolts you can see, with thunder that follows by the distance. In the wastes half of them strike into the plumes over the craters.
- **Volcanoes:** named mountains up to seventy blocks high with a lake of lava in the crater, flows spilling through breaches down the flanks, older crusted flows, and smoke rising from the top. Lava bombs arc from the nearest.
- **Rivers and lakes of lava** in the wastes, turning to obsidian toward the sea, and fissures of lava across the plains.
- **A charred land:** black ash, cinder rock and grey ash; glowing lava crust; fumaroles ringed with sulphur; charred and still smouldering trees, fallen logs, basalt spires and obsidian shards; embers on the wind.
- **New landmarks:** the Ashen Citadel on its moat of lava, its spire crowned with fire, and the Rift of Fire with a river of lava along its floor. They replace the fire shrine and the smoking cone.
- **New blocks:** black ash, cinder rock, lava crust, charred wood, smouldering wood, sulphur crust and fumaroles (charred wood gives coal).
- **Sound:** crackling embers and far booms in the wastes.

### Tooling
- `tools/shot.mjs --bolt` holds a lightning strike in each view.
- New test `47-volcanic`; `40-dry` loses the smoking cone check.

## 0.26.0 (2026-10-10): E1 refined, animals worth looking at

Saves from 0.25.0 load as they are; the world is unchanged.

### Game
- **New animal models:** every kind is built from pixel boxes with its own painted coat, lit and fogged like the world, with a shadow beneath. Deer with stags' antlers and pale rumps, sheep in curly wool (white, brown or black), bearded goats with swept horns, speckled hens with red combs, bristly boars with tusks, horses in bay, chestnut, grey, dun or black with manes, socks and blazes, hounds in three coats, mules with long ears and, once befriended, their packs.
- **Young in the herds:** fawns with spots, lambs, kids, chicks, striped piglets and foals. They cannot be taken, shorn, milked or ridden.
- **They move like animals:** walking and galloping legs, hopping rabbits, pecking hens, grazing and chewing, turning to look at you, flicking ears and swishing tails, a hound that wags and sits, smooth turns, herds that stay together and bolt together, sleep at night. A struck animal flashes, hops back and calls out; one taken falls on its side.
- **Calls:** bleats, clucks, whinnies, brays, grunts, barks and a deer's bark, each from where the animal stands; hoofbeats while you ride.
- **Hints** the first time you see each kind; **creative** can bring any animal or its young to you (pause menu).
- Black sheep give black wool.

### Tooling
- `tools/shot.mjs --animals[=kinds]` lines animals up in front of the camera (young, stags, coats, walking, running, grazing or asleep by a suffix).
- `46-wildlife` covers models, coats, textures, turning, herd fright, gaits, sleep, the young, calls and the window shift.

## 0.25.0 (2026-10-10): E1, wildlife

Saves from 0.24.0 load as they are; the world is unchanged.

### Game
- **Animals in the lands that suit them:** deer, rabbits and boars in the woods, sheep and wild hens on the farmland and meadows, mountain goats on the heights, wild horses on the meadows and steppe, stray hounds and wild mules here and there. They wander, graze and flee if you run at them. None attacks.
- **Hunting:** strike an animal for meat and hides (an axe works best). Roast venison, mutton, rabbit and pork, boil eggs and cure hides into leather at a furnace. Six leather and two rope make a sturdy pack.
- **Wool, milk and eggs:** shear a sheep for two white wool; an empty hand milks a goat or takes an egg from a hen.
- **Riding:** use a wild horse to ride it, faster than running and jumping higher; use it again to get off.
- **Companions:** feed a stray hound meat, or a wild mule crops, and it follows you. Use it to make it stay or follow again. The mule carries a pack as big as a chest.
- **Discovery log:** a new category for the animals you meet.

### Tooling
- New test `46-wildlife`.

## 0.24.0 (2026-10-10): M8, audio

Saves from 0.23.0 load as they are; the world is unchanged.

### Game
- **Volume sliders** in the pause menu: master, effects and ambience.
- **Soundscapes by land and layer:** birdsong in the woods by day and crickets at night; surf and gulls by the sea; frogs in the bogs and vales; wind on the heights and in the dry lands; a low rumble and bubbling lava in the volcanic wastes; chimes in the crystal and star lands; creaks in the grey lands. Underground: drips in the caves, a deeper rumble lower down, lava near the fire below, far hammers in an inhabited hold. Rain quiets the birds.
- **Positional sound:** breaking and placing blocks, kegs going off, and every ambient sound are heard from where they happen; running water is heard from its direction. Best with headphones.
- No music, as planned (Q57).

### Tooling
- New test `45-audio` (a stand-in AudioContext records the sound graph).

## 0.23.0 (2026-10-10): M7, lore and chronicles

Saves from 0.22.0 load again (see the fix below); the world is unchanged.

### Game
- **Hold chronicles:** every dwarven hold has a chronicle of eight pages, from its founding to its fall, or to the present day for an inhabited hold. Each lectern holds one page.
- **The journal** (L, or the Journal button in the pause menu and on the world map): pages kept in the order of their chronicle, with the ones not yet found marked; the rune tablets you have read; the discovery log.
- **Rune tablets are readable:** use one from your hand to read its saying.
- **The discovery log** records the lands, layers, holds, remains of other peoples and relics you find, with a word on screen the first time.

### Fixed
- Saved worlds did not come back after a reload in 0.22.0: the loader still expected the old world data version. The saver and the loader now share one version number.

### Tooling
- New test `44-lore`; `docs/LORE.md` holds the lore drafts for approval.

## 0.22.0 (2026-10-09): M6h, ruins, water and weather

Old saves do not load: the world changed, and the save key is now `fantasy-blockcraft-save-v17`. This completes M6.

### Game
- **Ruins in many shapes (Q122):** watchtowers, keeps and castles each come in four layouts, face any of four ways and are more or less ruined. Towers may be square, ringed by a low wall or twinned; keeps may be round shells, have an inner hall or a gatehouse; castles may have an inner keep, an outer ring, round corner towers or a great hall with a dry well.
- **Ponds and springs** across the green and wooded lands, two blocks deep.
- **Rapids:** rocks stand up through the water along stretches of the rivers.
- **Hillside streams** run down the green and wooded hills to small pools, besides the waterfalls of the high lands.
- **Weather by land:** mist on the bogs, vales and Cloud Forest, storms on the coasts and mountains, snow in the cold lands, blowing dust in the drylands, ash in the volcanic and blighted lands, and skies tinted by the land. Fog never comes nearer than 38 blocks.
- **Caves near the surface** take on the land above: earthy with ferns under the woods, peaty under the bogs, icy under the cold lands, sandy with bones under the drylands, basalt and magma under the volcanic wastes, cobwebbed under the Shadowed Forest.
- **The old lands' landmarks:** an earthwork hill fort or the lone oak in the Green Hills; a woodland shrine or a hollow elder in the Elder Wood; a watch cairn or granite tors on the Heath Moors; a great chambered barrow or rows of standing stones in the Barrow Hills; a temple sunk in the roots or a fallen giant in the Shadowed Forest.

### Tooling
- New test `43-ruins-water-weather`; the world-hash snapshot is updated on purpose.

## 0.21.0 (2026-10-09): M6g, old lands of men

Old saves do not load: the world changed, and the save key is now `fantasy-blockcraft-save-v16`. Every land of the registry is now built.

### Game
- **Four old lands of men:**
  - **Overgrown Farmland:** fields of old furrows run one way or the other, wild wheat, turnips and potatoes in them.
  - **Wild Orchards:** fruit trees in rows, some in blossom; their leaves give apples often.
  - **Flower Meadows:** bands of wildflowers, with oxeye daisies and lavender among them.
  - **Old Terraces:** hillsides stepped every three blocks, held up by stone retaining walls.
- **Small structures across the lands (Q123, Q125):** old bridges over rivers, mills on their banks, jetties on lakes, deserted farmsteads, cairns on hilltops, abandoned camps, beacon hills, and chapels with their graveyards. About one chunk in 120 has one; each is named in the readout.
- **Dry-stone walls** run across the farmland, green hills, orchards and terraces.
- **Landmarks and features:** an abandoned manor farm or old furrows with a scarecrow; an orchard keeper's cottage or old fruit rows; a flower shrine or bands of wildflowers; a terraced village or stone terraces.
- **Landmarks are places:** the readout names every land's landmark and feature, and they are kept on the world map.
- **New blocks:** orchard leaves, blossom, oxeye daisy, lavender.

### Tooling
- New test `42-men`; the world-hash snapshot is updated on purpose.

## 0.20.0 (2026-10-09): M6f, strange lands

Old saves do not load: the world changed, and the save key is now `fantasy-blockcraft-save-v15`.

### Game
- **Four rare strange lands:**
  - **Crystal Barrens:** pale ground of calcite and gravel, spires of amethyst, now and then tipped with a glowing prism shard.
  - **Glowcap Hollows:** giant mushrooms with pale caps and softly glowing gills over moss and glowshrooms.
  - **Petrified Forest:** trees turned to stone on sand, some with amber in them.
  - **Starfall Craters:** green land pocked with craters, their floors of scorched stone.
- **Rare finds (Q130), kept for later magic:** prism shards, amber and starmetal ore.
- **Landmarks and features:** a crystal cutters' ruin or crystal spires; a mushroom dwelling or giant glowcaps; a waystation of stone or a grove of stone trees; a ruined star tower or the crater of the starmetal heart.

### Tooling
- New test `41-strange`; the world-hash snapshot is updated on purpose.

## 0.19.0 (2026-10-09): M6e, dry and fiery

Old saves do not load: the world changed, and the save key is now `fantasy-blockcraft-save-v14`.

### Game
- **Four dry and fiery lands:**
  - **Southern Drylands:** dunes of sand and red sand over sandstone, cactus and dead bushes.
  - **Golden Steppe** (the Windswept Plains, reworked): golden grass and tall steppe grass, a lone oak here and there.
  - **Volcanic Wastes:** broken ground of ash and basalt with basalt spires; under them the rock over the Fire Below glows with magma stone.
  - **Blighted Lands:** dead grass and grey dead trees.
- **Landmarks and features:** a sand-buried temple or a dry wadi with a well that still holds water; a ring of horse stones or a lone outcrop; a fire shrine or a smoking cone with a lava lake held in its crater; a dead lord's hall or a grey grove round pits of ash.
- **New blocks:** golden grass, steppe grass, volcanic ash, magma stone (glows), dead grass, dead wood (makes planks).

### Tooling
- New test `40-dry`; the world-hash snapshot is updated on purpose.

## 0.18.0 (2026-10-09): M6d, coasts and waters

Old saves do not load: the world changed, and the save key is now `fantasy-blockcraft-save-v13`.

### Game
- **Six coast and water lands:**
  - **Chalk Cliffs:** green downs that end in white chalk cliffs dropping sheer to the sea, flint gravel at their foot.
  - **Rocky Isles:** islands of rock and turf rising out of the sea, gravel shallows round them.
  - **Fjords:** mountains cut by deep sea inlets with steep walls, spruces on their sides.
  - **Black Sand Shores:** low dark grassland with basalt outcrops and beaches of black sand.
  - **Kelp Shallows:** shallow sandy sea floors under swaying kelp and seagrass.
  - **Raised Bogs:** peat, red and green bog moss, cotton grass, dark pools.
- **Landmarks and features:** a wreck on the shoals or sea stacks (the Western Sea); an isle chapel or a sea arch; a sunken causeway or a kelp forest; a beacon tower on the cliffs or a chalk arch in the sea; a fjord boathouse or a fall from the fjord wall; a harbour wall or basalt columns; an old trackway across the bog or a domed bog with pools on its crown.
- **Water plants:** kelp and seagrass grow inside the water (you swim through them), in the Western Sea too; lily pads float on lakes and on the pools of the vales and bogs.
- **The Grey Shore** gains driftwood.
- **New blocks:** chalk, black sand, basalt, peat, bog moss, kelp, seagrass, lily pad, cotton grass.

### Tooling
- New test `39-coasts`; the world-hash snapshot is updated on purpose.

## 0.17.0 (2026-10-09): M6c, highlands and cold

Old saves do not load: the world changed, and the save key is now `fantasy-blockcraft-save-v12`.

### Game
- **Five highland and cold lands:**
  - **Alpine Meadows:** high pastures of grass, gentians and edelweiss, a few spruces, snow only on the highest ground.
  - **Glacier Fields:** glacier ice and packed snow over the heights.
  - **Cloud Forest Heights:** gnarled mistwood trees trailing leaves over forest moss and ferns.
  - **Karst Crags:** bare limestone on the ridges and limestone pillars standing out of the turf.
  - **Frozen Tundra** (the Northern Fells, reworked): snow with patches of tundra moss and stunted spruces.
- **Landmarks and features:** a shepherd's hut or a meadow tarn; a tower bound in ice or an ice cave; a mist shrine or mossy falls from a crag; a cliff hermitage (two rooms and a ladder inside a crag) or a great sinkhole whose shaft winds down to a cave passage (Q132); a frozen longhouse or frost mounds. The High Mountains gain a gatehouse in a high pass or a high tarn.
- **Waterfalls (Q126):** on steep ground in the mountains, alpine meadows, cloud forest and karst, a spring cascades down the slope over a stony bed to a pool. Shaped still water: it never floods (Q129).
- **New blocks:** limestone, glacier ice, packed snow, tundra moss, mistwood (log, leaves, planks), gentian, edelweiss.

### Tooling
- New test `38-highlands`; the world-hash snapshot is updated on purpose.

## 0.16.0 (2026-10-09): M6b, the forests

Old saves do not load: the world changed, and the save key is now `fantasy-blockcraft-save-v11`.

### Game
- **Seven forests, each its own:**
  - **Autumn Woods:** red and golden maples over a floor of fallen leaves, ferns and old oaks.
  - **Birch Glades:** tall white birches in groves, bluebells beneath them, open glades between.
  - **Pine Highlands:** tall pines on hilly ground over a floor of needles, rocky outcrops, snow on the cold heights.
  - **Ancient Giant Wood** (rare): greatwood trees 22 to 31 blocks high with buttress roots, over forest moss and ferns.
  - **Willow Vales** (the Fens, reworked): willows of their own wood leaning over the pools and reeds.
  - **Yew Wood:** dark, broad yews, some two blocks thick, over moss and ferns.
  - **Silverwood:** slender white trees with silver leaves, and moonpetals that glow faintly in the grass.
- **Landmarks and features (Q124):** each stretch of forest has its land's landmark or natural feature, or (four in ten) neither: a woodcutters' lodge or a red-leaf glade round a pond; a birch-bark shrine or a ring of white birches; a timber watch post or a lookout rock; a platform high in a giant or the Great Tree (40 or more high); a stilt house or willow pools with an islet; an archers' hall or a hollow yew you can walk into; a moon gate or a silver spring.
- **New woods (Q130):** maple, pine, greatwood, yew, silverwood and willow, each with logs, leaves and planks; leaf litter, pine needle floor and forest moss; ferns, bluebells and moonpetals. Any planks make sticks, chests and wooden tools.
- Forests have their own colours on the world map.

### Tooling
- New test `37-forests`; the world-hash snapshot is updated on purpose.

## 0.15.0 (2026-10-09): M6a, lands groundwork

Old saves do not load: the world is generated anew, and the save key is now `fantasy-blockcraft-save-v10`.

### Game
- **A new map of lands.** The world is laid out from a registry of 37 lands in seven families, on a transition map that keeps unlikely neighbours apart (no winter land beside a desert). Common lands now stretch over several hundred blocks, and no land is smaller than 215 x 215 blocks. The old lands keep their looks; lands still to be built (forests in M6b, and so on) show as an old land until their family arrives, so their places will not move. See `docs/LANDS.md`.
- **Names for every stretch of land,** in the style of a people ("Elder Wood of Lirwen", "The Sea of Randbert"), shown when you arrive and written faintly on the world map.
- **Gorges in place of the cracks.** The hairline ravines (1 to 3 blocks wide, up to 66 deep) are gone. Gorges are about a third as many, at least 7 blocks wide at the floor, step back in ledges of 5 to a rim 16 to 40 across, and run up to about 60 deep; the deepest still reach the caves. None cut beside water or the sea.
- **New worlds start on open land** of an old land near the middle of the world (a cell of Green Hills, Elder Wood, the moors or the like), never at sea.
- **Retired saves are cleared** from browser storage when the game starts (worlds from save keys before v10).
- **Creative land tour:** a list of every land in the pause menu (planned ones marked); Go takes you to the heart of the nearest stretch.

### Tooling
- **Two bytes per block:** the world holds block ids above 255 (blocks 0 to 199 and from 1024; items 200 to 1023).
- **`npm run lands`** (`tools/lands.mjs`) draws the land layout and writes `docs/LANDS.md` from the registry, for the owner's approval.
- New test `36-lands`; `06-biomes` and others follow the new layout; the world-hash snapshot is updated on purpose.

## 0.14.0 (2026-10-09): M5b, maps and creative tools

Old saves do not load: the save format gained the explored map, places and markers, and the save key is now `fantasy-blockcraft-save-v9`. The world itself is unchanged.

### Game
- **World map:** press M (D-pad up on the controller) for a map of everywhere you have explored, with the places you have found, your waystones and your own markers. Drag to move it, zoom with the wheel or the buttons; tap to place a marker or remove one. It is saved with the world. In survival it needs a map. The minimap zoom moved to J.
- **Layer view:** underground, the minimap shows the passages and rooms at your depth instead of the land far above.
- **Creative:**
  - Search the block menu.
  - Brushes up to 13 blocks wide.
  - The Fill Tool: break for one corner, place for the other, then fill the box with a hotbar block, replace one kind of block, or clear it.
  - In the pause menu: set the time of day, bring rain or clear skies, go to coordinates, and build a test structure (watchtower, keep, castle, barrow, stone ring, waystone, dungeon room) where you look. Undo takes it away.
  - On the world map, tap a spot and travel there.

### Tooling
- New test 35-maps-creative; 33-survival-systems and 34-controls adjusted (D-037).

## 0.13.0 (2026-10-09): M5a, controls and interface

No change to the world or the save format: 0.12 worlds keep working.

### Game
- **Rebind your controls:** a Controls panel in the pause menu lists every action with its keyboard keys and controller button. Tap one, then press the new key or button; Esc or B cancels; Reset brings back the defaults. A key you take for one action is freed from the one that had it.
- **Better defaults:** on the controller, travel moved to D-pad down and D-pad up now opens the map, so a slip no longer moves you. I turns the readout on and off.
- **Hints:** short one-time notes the first time something happens in survival (your first mining, ore, a pickaxe too weak, hunger, darkness, a lectern, a waystone, a chest, climbing, a grave). They name the right key or button for what you are using. Turn them off in the pause menu.
- **Help that fits:** the pause menu's help now shows the keys you have set, for the keyboard, controller or touch, and only what applies to survival or creative.
- **Readout switch:** the readout (fps, position, place name) is on by default and can be turned off with I or in the pause menu.
- **Worlds:** rename a world, and see when each was last played.

### Tooling
- New test 34-controls (defaults, rebinding and conflicts, saved bindings, capture, help by mode and device, hints, readout, renaming) (D-036).

## 0.12.2 (2026-10-09): crisp textures on Windows desktops

No change to the world or the save format.

### Game
- **Textures are crisp again on Windows.** Close-up blocks showed smoothed, blurry textures on desktop browsers because of anisotropic filtering, which Direct3D applies to near textures too. It is turned off; every block now shows its square pixels, as on phones (D-035).

## 0.12.1 (2026-10-09): sharper textures on desktop

No change to the world or the save format: 0.12.0 worlds keep working.

### Game
- **Sharp textures on high-resolution desktop screens.** The game now draws at the screen's full pixel density (it was capped at 1.25 times on desktop, which blurred textures on screens scaled to 150% or 200%).
- **Resolution** in the pause menu: Auto (default; full density, lowered only if frames slow down, after the view distance), Sharp (always full density) and Fast (one pixel per screen point, for slower machines).
- The readout shows the resolution in use.

### Tooling
- 29-view checks the resolution choices and how Auto gives way under load and comes back (D-034).

## 0.12.0 (2026-10-09): M4b, storage, the worn lamp, earned travel and food

Old saves do not load: the world changed (foraging plants) and the save key is now `fantasy-blockcraft-save-v8`.

### Game
- **Chests:** build an Oak Chest (8 planks) and keep things in it. Supply crates, dwarven chests and barrels in the world now keep whatever you leave in them instead of vanishing. Open a container with the place button; the inventory screen shows it above your pack, and tapping a slot moves that stack across. A container must be empty before you can break it.
- **More room:** a Woven Pack (+9 slots) and a Sturdy Pack (+18, made from a woven one) for the pack slot, and a Satchel (+9) for the bag slot, up to 63 slots.
- **The worn lamp:** a Miner's Lantern in the belt slot lights the way without taking up your hand. It burns Lamp Oil (20 minutes, pressed from wheat seeds) or Pitch Candles (8 minutes, plant fibre and coal) only while it is dark, taking more from your pack as it runs out. Without it there is no light around you in survival; a torch in hand still lights a smaller circle. The deep caves are darker the further down you go. Creative keeps its lamp.
- **Earned travel:** R no longer teleports in survival. Touch an Ancient Waystone to attune it; a Carved Waystone (expensive: diamonds, platinum, stone bricks, a rune stone) works as soon as you place it. Stand by a waystone and use it (or T, or the map) to choose where to travel; only waystone to waystone. Creative travels freely as before.
- **Food:** turnips and beans to plant (as they are) and harvest with the sickle; bilberry bushes on the moors and in the woods, brown mushrooms in the woods, and wild turnips in open country to forage; tall grass sometimes gives beans. Cook roast turnips, pottage, bilberry tart and roast mushrooms at a furnace.
- The Caves setting's middle option is now called Normal.
- Fixed: the survival inventory could show the creative block menu after using creative mode (0.11.0).

### Tooling
- New test 33-survival-systems (containers, packs, lantern fuel, depth light, travel rules, crops, sickle, foraging). 13-survival updated for containers that keep leftovers; 32-items counts the new wild plants. New world-hash snapshot (surface band only).

## 0.11.0 (2026-10-09): M4a, tools, climbing and finding the way

No change to the world or the save format: 0.10.0 worlds keep working.

### Game
- **The metal ladder:** wood, stone, copper, bronze, iron, steel and moonsilver pickaxes, each faster and longer lasting than the last. Each one is the first that can mine the next metal: a stone pickaxe for copper, copper for tin and gold, bronze for iron, iron for platinum and diamonds, steel for moonsilver, moonsilver for obsidian.
- **Axes and shovels** in every metal: an axe cuts wood two to ten times faster than bare hands depending on its metal, and a shovel does the same for earth and sand.
- **Bronze shears** keep leaves, cobwebs, grass and flowers whole. The **gold sickle** cuts every plant within two blocks in one stroke and harvests ripe wheat and potatoes, replanting them. The **platinum pickaxe** is the fastest made pickaxe and soon worn.
- **Climbing:** ladders (sticks), iron pitons (one iron ingot makes 8), and rope (plant fibre from grass and bracken). Jump climbs, down or sprint climbs down, letting go holds you in place; no fall damage while climbing. Ladders need a wall and ground below; pitons go into rock at any height; rope unrolls down from where you place it as far as you carry.
- **The grapnel** replaces the grappling hook: throw it at a wall below a ledge (up to 24 blocks away) and it catches the top edge and hangs your rope down to the ground. Break the hook to take it back with all its rope.
- **Finding the way in survival:** the minimap shows only while you carry a **map**; a **compass** shows X, Z and which way you face; a **depth gauge** shows your height and how far below the surface you are. Creative shows everything as before.
- **Signal flares** replace fireworks: a flare climbs about 60 blocks, then burns red as it drifts down, visible from far away. Made from a stick, a glow mushroom cap and coal.
- **The Blasting Keg** looks like a dwarven keg now; its side no longer says TNT.
- **The Blueprint Tool is creative only.**
- **A starting kit** for new survival worlds: a wooden pickaxe and axe, a map, 8 torches and 4 bread.
- Supply crates can hold rope, ladders, flares and a grapnel; smithies and armouries hold axes, shovels and pitons.
- Fixed: cold sconces, burnt-out torches and dim glowstone could not be broken in survival.

### Tooling
- New test 32-items (tool ladder, recipes reachable from the starting kit, climbing, rope, grapnel, navigation, sickle, flares). 10-content-tables checks every block has a hardness, material and tier.

## 0.10.0 (2026-10-09): M3.5b, a natural surface

Old saves do not load: the world changed and the save key is now `fantasy-blockcraft-save-v7`.

### Game
- **Rivers in valleys.** Rivers rise in the hills and run to the sea or a lake in valleys that widen with the land around them, shelving into sandy or gravel banks. River ravines with 20 to 30 block walls are gone.
- **Mountain ranges** with ridgelines, valleys between them, saddles to cross, and peaks along the ridges. Far fewer sheer drops.
- **Smoother ground:** gentle lands are about half as bumpy. Moors, mountains, the Shadowed Forest and the fens keep their character.
- **Lands blend** over a wide border: trees, ground cover and snow mix in patches instead of stopping on a line.
- **Barrows** only on the Barrow Hills, in clusters (burial grounds and beside old roads), facing every way, round or long, small to large, some with the roof fallen in.
- **Trees in groves** with clearings between, thicker in valleys and by water.
- **Boulders** on the moors, in the mountains and on slopes; rare on gentle ground. The stray little stone towers and wells are gone.
- **Ruined towers, keeps and castles** stand on commanding ground (towers and castles on high ground, keeps by rivers), on an earth bank that slopes down to the land instead of a stone plinth.
- Ruined stairways stand at the foot of a slope.

### Tooling
- New test 31-natural-surface; 06-biomes, 07-gamepad and 16-worlds adjusted (D-031). New world-hash snapshot.

## 0.9.1 (2026-10-09): M3.5a.2, noclip

No change to the world or the save format: 0.9.0 worlds keep working.

### Game
- **Noclip in creative mode:** fly straight through blocks. **N** on the keyboard, the **Clip** button on touch, or **Noclip** in the pause menu (for the controller). Turning it on also turns flying on; turning it off inside rock lifts you up to the first place you fit. Survival mode refuses it and switching to survival turns it off. The info panel shows "Noclip" while it is on.

### Tooling
- New test 30-noclip.

## 0.9.0 (2026-10-09): M3.5a, the underground rewritten

Old saves do not load: the world changed and the save key is now `fantasy-blockcraft-save-v6`.

### Game
- **Cave systems instead of noise caves.** Each area of about 160 x 160 blocks has one to three systems: a main passage that winds down from an entrance through the depths, branches that end in chambers, loops back, and shafts. Passages only meet at junctions and never cut through each other or through rooms.
- **Far less hollow rock** (about 1.5% of the rock under spawn, against about 28%), in fewer, bigger, connected caves that get roomier the deeper you go: passages 3 to 6 wide near the surface, halls up to 38 across in the deep.
- **Chambers with shape:** domed halls with natural pillars, tall rifts with ledges (some with an opening high in the wall), stepped halls going down to a lake, and stalagmites, stalactites and columns.
- **Ways down:** cave mouths at the foot of slopes and sinkholes with a ramp spiralling down, walkable descents, shafts, streams of pools stepping down a passage, links between the deepest halls of neighbouring areas, and passages from the caves into the mines of a nearby hold.
- **The Fire Below:** smooth islands and great pillars that flare at both ends; most areas' caves reach it by a causeway of fallen rock to an island, and some deep halls have a gorge with lava at the bottom or a lava fall pouring into a pool.
- **No floating lava:** lava follows the same rule as water and lies only in sound rock.
- Old mineshafts and ruined stairways are much rarer; dungeon rooms and points of interest open onto the new passages.

### Tooling
- `npm run map` (`tools/map.mjs`): height, cave and section maps of the generated world, for before and after comparisons.
- Tests 21-deep and 23-entrances rewritten for cave systems (no passage crossings, depth profile, sound water and lava, walkable entrances and hold links); 24-places checks eight windows; 28-meshing's vertex check changed (D-029). New world-hash snapshot.

## 0.8.0 (2026-10-09): M3b sky light and a livelier look

No change to the world or the save format: 0.7.0 worlds keep working (the moon phase starts from the first day in an older save).

### Game
- **Sky light spreads sideways** under overhangs and into cave mouths, fading over about 15 blocks, instead of stopping at the edge of the roof above.
- **Animated water and lava.** Water is a deeper blue, shimmers slowly and catches glints of sun; the lava sea rolls, with brighter crests.
- **Lamps and glowing blocks show through fog** from further away and pulse slightly. **Plants sway.**
- **Blocky clouds** that stay put in the world and drift slowly, coloured at sunset and dark at night.
- **Moon phases:** eight, one per day; the day count is saved with the world.
- Fixed: distant water and leaves showed grid lines (texture edges bleeding into each other).
- Fixed: the sky showed at the far edge of the lava sea and other big caverns.

### Tooling
- `npm run shots` (`tools/shot.mjs`): screenshots of set views in headless Chromium, failing on shader errors (D-026).
- 02-lighting and 27-streaming require exact sky light too; 02-lighting also relights after about 800 edits. D-027.

## 0.7.0 (2026-10-08): M3a performance

No change to the world or the save format: 0.6.0 worlds keep working.

### Game
- **Smoother streaming.** New terrain is built a little each frame (about half a millisecond per frame on the test machine) instead of a whole chunk in one frame, which caused the stutter when moving.
- **Lighter meshing.** Above ground, cave interiors far below the surface are no longer meshed (about 77% fewer vertices at spawn, chunks mesh four to five times faster). Underground, meshing reaches as far as the cave fog setting lets you see.
- **No long freeze on waypoint travel** or respawning far away: the area right around you appears at once and the rest streams in.
- **Auto view distance**, the new default (Near, Normal and Far are still there): it starts from your device and adjusts to keep the frame rate up.
- The info panel shows frame time (average, worst, and the game's own work), the auto view distance and how much terrain is still streaming.
- The minimap redraws ten times a second, autosave no longer rewrites the save every 5 seconds, and the explored map's memory is capped.
- Fixed: after loading or travelling, some light deep underground could be a level too dark.

### Tooling
- `GEN_STEPS` and `genJob` (staged generation), worm points indexed by chunk, `meshFloor` and `MESH_DEEP`, `AUTO_VIEW` and `autoView`; the benchmark gains a per-frame streaming step.
- New tests 27-streaming, 28-meshing, 29-view. D-025.

## 0.6.0 (2026-10-08): M2b world restructure, part two

Old saves do not load: the world changed and the save key is now `fantasy-blockcraft-save-v5`.

### Game
- **Hold gates.** Each hold has up to three gates on the highest ground above its outer ring: a terrace with pillars and braziers over a spiral stair down to the hold's upper floor (y82). Plaza waymarkers point to the nearest gate (reading them no longer fails).
- **Ways down from open land:** cave mouths in steep slopes that wind down into the caves, small ruined stairways on level ground, and deeper ravines. One is usually within about 80 to 90 blocks.
- **Dungeon rooms are rarer and varied** (Forgotten Crypt, Old Storeroom, Old Cells, Sunken Chapel), and **points of interest are rarer**. Every one opens onto a cave; crystal geodes and fossils stay sealed in the rock.
- **Remains of other peoples** in the deep caverns away from the holds: goblin warrens, gnome workshops, drow halls and nameless ruins older than the holds, some only as scattered leftovers.
- **Ruined watchtowers, keeps and castles** on the surface, each with a name, linked by **old roads** that also lead to the hold gates.
- **Ancient waystones** (a new block) at some ruined sites and at the first gate of every hold. Attuning to them comes in a later update.
- **Underground water no longer floats.** Every underground pool, lake and river sits in sound rock, with nothing floating under or beside it; there is much less of it, and ceiling springs are gone.
- The location display names gates, ruined stairways, old roads, sites, waystones, dungeon rooms and remains.

### Tooling
- New `world/remains.js` and `world/surface-sites.js`; `caveAnchor`, `caveMouth`, `deepRim` in `world/caves.js`; `deepOpenAt`, `deepWaterAt` in `world/deep-caves.js`; ruined stairways, dungeon rooms, `tunnelTo` and `surfTaken` in `world/features.js`; `drainCaveWater` in `world/chunk-generation.js`.
- New tests 23-entrances, 24-places, 25-remains, 26-surface; 05-underground and 21-deep require sound underground water. D-024.

## 0.5.0 (2026-10-08): M2a world restructure, part one

Old saves do not load: the world changed and the save key is now `fantasy-blockcraft-save-v4`.

### Game
- **The world is 512 blocks tall.** Sea level is unchanged, so there are about 200 blocks of sky and the hearts of mountain ranges rise far higher than before. The underground keeps its depth.
- **Dwarven holds are rare and vast.** The city no longer runs under the whole world: each region of about 2560 x 2560 blocks has one hold, 400 to 575 blocks across, with one name. About 3 in 10 holds are inhabited: kept up and lit, though their people only arrive in a later update. None lies under the spawn area; the nearest is usually 1500 to 2500 blocks away.
- **Mines belong to holds,** running under each hold and thinning out around it.
- **The deep is natural** away from the holds: large caverns in two tiers, underground lakes and rivers (all at y64), and caverns dressed in their region's character (The Crystal Deeps, The Fungal Deeps, The Mossy Deeps, The Dripstone Deeps, The Deep Caverns). The location display names them, and names a hold's deeps and mines after the hold.
- **The Fire Below is a lava sea:** open lava (surface at y8) with rock pillars and islands under most of the land.
- **The old lights are out.** Lanterns, sconces, torches and glowstone found in ruins, mines, camps and towers are cold: new blocks Cold Lantern, Cold Sconce, Burnt-out Torch and Dim Glowstone. Coal relights a cold lantern, sconce or torch. Rune stones, crystals and glowing fungi still shine, and inhabited holds keep their lamps lit.
- The Hall of a Thousand Pillars is rarer: a few per hold.

### Tooling
- New `world/deep-caves.js`; holds, `holdNear` and `holdReach` in `ruins/city-plan.js`; mines follow `holdReach`; `PW` writes cold lights unless `genLit`.
- New tests 20-holds, 21-deep, 22-old-lights. 03-ruin-graph, 04-doorways and the city plan in 09-world-hash now check the hold of region (0,0). The world-hash snapshot was re-recorded. D-023.

## 0.4.0 (2026-10-08): M1b foundations, part two

No change to the world or the save format: 0.3.0 worlds keep working.

### Game
- No visible changes. Controls, menus and the world play as in 0.3.0.

### Tooling
- Entity registry (`engine/entities.js`): moving things register once and are shifted, cleared and updated by the registry.
- Input action layer (`input/actions.js`): keyboard, controller and touch dispatch named actions through bindings that `settings.binds` can override, ready for the M5 rebinding screen.
- Equipment slots (belt, pack, bag) in the player model, saved with the world, ready for M4.
- New tests: 17-entities, 18-actions, 19-equipment. ES modules are deferred until after M2 (D-022).

## 0.3.0 (2026-10-08): M1a foundations, part one

Old saves do not load: the save format changed (key `fantasy-blockcraft-save-v3`), and the world itself changed.

### Game
- **Several worlds.** New world no longer replaces your world: the pause menu lists your worlds to play, export to a file, delete, or import from a file. Give a new world a name and, optionally, a seed.
- A seed typed as a whole number is used exactly (777 used to give seed 778).
- **Removed for the setting:** power (wire, generators, water wheels, solar panels, batteries, electric lamps and furnaces, chargers, drills, jackhammers, chainsaws), trading counters, coin mints, coins in loot, ore processing (crusher, gold pan, sluice, crushed ores, nuggets), and rails in the mines and the city. The alchemist's lab, the outpost, the mine junctions and the Machine Hall have period-fitting objects in their place.
- Hold, king and queen names come from a new dwarven name style and never match Tolkien's names (the old generator could produce Durin, Thrain and Mordor).
- The leftover Town and Sky Island labels and map markers are gone.
- Saves no longer grow on their own: flowing water, spreading grass and snow are saved only where you changed things yourself. Crops you plant still keep their growth.

### Tooling
- The town, road, power, trading and ore-processing code is deleted (`legacy/` is gone); mining moved to `gameplay/mining.js`, crafting and `BANNED` to `gameplay/crafting.js`.
- New `core/names.js` with name styles for ten peoples (dwarf, plus drafts for the others) and a Tolkien-name blocklist.
- New tests: 15-names and 16-worlds; the content test refuses removed content.

## 0.2.0 (2026-10-08): M0 bug sweep

Old saves do not load: the save format changed (key `fantasy-blockcraft-save-v2`), and the retired v1 save is deleted from browser storage.

### Game
- Fixed: everything built or dug above height 127 (that is, all surface work) reloaded deep underground and shifted sideways. Undo and waypoints used the wrong positions for the same reason.
- Fixed: crops under a roof or underground never grew. Lit farmland grows anywhere now, at the same rate as surface farms.
- Fixed: High Mountains snowed at every height; snow now starts at the mountain snow line. Heath Moors and Barrow Hills get rain again.
- Fixed: the seed 777 blocked doorway. Doorway clearing now reaches the wall line, and lecterns (lore) are no longer removed by decay.
- Crates, barrels and dwarven chests no longer lose loot that does not fit: with a full pack they stay closed and say so. In creative they show their contents without being emptied.
- Blasts no longer destroy graves or containers (a blast used to empty a grave into your pack wherever you stood).
- Right-clicking a lectern, crate, grave or counter now uses it even with food, seeds or a hoe in hand.
- Pausing (or opening the inventory) now pauses lit kegs, falling blocks and flowing water.
- Esc closes the inventory and shows the pause menu.
- Moving the mouse while playing with a controller now pauses cleanly instead of leaving the game without mouse control.
- New pause-menu setting Touch: Auto / On / Off. Auto only picks the touch layout when there is no mouse or trackpad.
- Banned power blocks no longer appear in the creative menu.
- Text: the HUD and help call the keg a Blasting Keg; lore says moonsilver, not titanium; the unreachable "You starved" message is gone (hunger stays non-lethal).
- Chunk generation is about 25% faster (the deepstone noise is computed once per column), with an identical world.

### Tooling
- New tests: 11-saves (world keys and a save round-trip), 12-weather-farming, 13-survival, 14-engine. The doorway walk test also runs seed 777.

## Project setup (2026-10-07 to 2026-10-08)

### Tooling
- Recorded the direction interview (`docs/DIRECTION_QA.md`, 76 questions) and the build order (`docs/MILESTONES.md`); logged D-019; listed the bugs found by a full code read in `docs/KNOWN_ISSUES.md`.
- The playable single-file build is now committed at the repository root (`fantasy-blockcraft.html`), so the latest game can be downloaded from GitHub without Actions. `npm run build` refreshes it; `npm run check` and a Claude Code Stop hook catch a stale copy.
- Imported the modular source into this repository.
- Added `CLAUDE.md` and this changelog.
- Added `.gitattributes` (LF line endings everywhere).
- Vendored three.js r128 in `vendor/`; the game folder build now runs offline. The single-file build is unchanged.
- Added `npm run check` and `npm run check:syntax`.
- Added a determinism test (08), a world-hash snapshot test for two seeds (09), `snapshot()` and multi-seed cases in the harness, and `npm run bench` with a baseline in `docs/PERF.md`.
- Added `.claude/settings.json`: permission rules for the project's scripts, node and git, and a post-edit syntax-check hook for `src/`.
- Added a content-tables test (10) and seven project skills in `.claude/skills/`.
- Added `docs/ROADMAP.md` (known work only) and `docs/ES_MODULES_PLAN.md` (plan, not started).
- Added GitHub Actions: CI (tests, both builds, downloadable artifacts) and Pages (publishes `main`, skips itself while Pages is off).

## 0.1.0 (2026-10-05)

### Game
- The single HTML file split into a modular source with two build targets. No gameplay changes.
