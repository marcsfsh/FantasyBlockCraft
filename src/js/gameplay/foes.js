// ---- Foes (D-052): the first hostile creatures, all of the Volcanic Wastes. Orc warbands (raiders, bowmen, brutes, now and
// then a warchief) and ash trolls roam its surface and hold the Ashen Citadel; goblins (cutters, slingers, firecallers and a
// chieftain) live in the warrens below and keep camp at their ways in; an Emberlord waits in each fortress in the great
// volcanoes, with orcs at its gate. In survival they hunt the player by sight, strike, shoot and throw; in creative they take
// no notice of the player at all. Like the animals they come and go around the player (Math.random is fine here); only the
// Emberlords that have fallen are saved (fk), so a fortress once emptied stays empty.
const FOES={
  // n name; m model; hp; dmg a blow; reach; walk and run (blocks a second); sight; cd between blows; wind the wind-up of a blow;
  // shot {dmg, v speed, lo and hi range, cd, k kind, n volley}; keep: the distance a shooter keeps; flee: share of health at
  // which it runs; block: share of a blow a shield takes from the front; mass: how far blows push it; tall: room it needs;
  // drops [[id, least, most, chance]]; cause: how the death screen names it
  goblin:{n:'Goblin Cutter',m:'goblin',hp:8,dmg:2,reach:1.5,walk:1.5,run:4.7,sight:14,cd:0.8,wind:0.3,flee:0.3,mass:0.8,drops:[[200,1,2,0.6],[339,1,2,0.3],[220,1,2,0.25]],cause:'goblin'},
  gslinger:{n:'Goblin Slinger',m:'gslinger',hp:6,dmg:1,reach:1.5,walk:1.4,run:4.4,sight:18,cd:1,wind:0.3,shot:{dmg:2,v:16,lo:4,hi:17,cd:2.2,k:'stone'},keep:7,flee:0.4,mass:0.8,drops:[[200,1,2,0.5],[221,1,2,0.3],[338,1,1,0.2]],cause:'stone'},
  gfire:{n:'Goblin Firecaller',m:'gfire',hp:9,dmg:1,reach:1.5,walk:1.3,run:4,sight:18,cd:1.2,wind:0.4,shot:{dmg:3,v:10,lo:4,hi:18,cd:3.2,k:'fire'},keep:9,flee:0.3,mass:0.8,drops:[[SULFUR,1,3,0.6],[338,1,2,0.4],[230,1,1,0.05]],cause:'fire'},
  gchief:{n:'Goblin Chieftain',m:'gchief',hp:34,dmg:5,reach:2,walk:1.3,run:4,sight:18,cd:1.2,wind:0.45,mass:0.5,boss:1,drops:[[224,2,5,1],[230,1,2,0.5],[372,1,1,0.35]],cause:'goblin'},
  raider:{n:'Orc Raider',m:'orc',hp:16,dmg:3,reach:2,walk:1.5,run:4.8,sight:22,cd:1.1,wind:0.4,mass:0.6,drops:[[213,1,2,0.5],[200,1,3,0.6],[352,1,1,0.3]],cause:'orc'},
  bowman:{n:'Orc Bowman',m:'obow',hp:12,dmg:2,reach:2,walk:1.5,run:4.6,sight:26,cd:1.2,wind:0.4,shot:{dmg:3,v:26,lo:5,hi:26,cd:2.4,k:'arrow'},keep:12,mass:0.6,drops:[[409,2,5,0.6],[328,1,3,0.4],[200,1,2,0.4]],cause:'arrow'},
  brute:{n:'Orc Brute',m:'obrute',hp:32,dmg:6,reach:2.3,walk:1.2,run:3.8,sight:20,cd:1.7,wind:0.6,block:0.6,mass:0.35,drops:[[404,1,1,0.15],[213,2,4,0.7],[227,1,2,0.3],[362,1,2,0.4]],cause:'orc'},
  ochief:{n:'Orc Warchief',m:'ochief',hp:48,dmg:7,reach:2.5,walk:1.4,run:4.4,sight:28,cd:1.4,wind:0.55,mass:0.3,boss:1,drops:[[227,2,4,1],[224,1,3,0.6],[374,1,1,0.25]],cause:'orc'},
  troll:{n:'Ash Troll',m:'troll',hp:70,dmg:8,reach:3.2,walk:1.1,run:3.6,sight:20,cd:2.2,wind:0.8,shot:{dmg:6,v:15,lo:8,hi:22,cd:7,k:'rock'},mass:0.15,tall:3,drops:[[386,1,2,1],[CINDER,2,5,0.6],[230,1,1,0.1]],cause:'troll'},
  // the Emberlord towers eleven blocks tall: a reach of eight, a whip of eighteen, fire thrown in threes from forty; it never
  // goes farther from its throne than the terrace before its gate (leash, set when it is placed)
  ember:{n:'Emberlord',m:'ember',hp:640,dmg:12,reach:8,dyr:9,walk:1.8,run:4.2,sight:50,cd:2.2,wind:0.8,shot:{dmg:6,v:18,lo:10,hi:44,cd:3.5,k:'hellfire',n:3},whip:{dmg:7,lo:6,hi:18,cd:4.5},mass:0.02,tall:12,stride:4.5,boss:1,lord:1,
    drops:[[377,1,1,1],[378,1,1,1],[229,4,8,1],[228,3,6,1],[224,6,12,1]],cause:'ember'},
  // ---- the folk of the realms of men (D-060): neutral. folk: of a realm; civ: townsfolk, who flee rather than fight. They take no
  // notice of the player until one of them is struck; then the realm's guards near by take up arms and its people flee (wrath)
  rspear:{n:'Spearman of the Realm',m:'rspear',hp:22,dmg:4,reach:2.7,walk:1.3,run:4.6,sight:24,cd:1.3,wind:0.45,block:0.5,mass:0.55,folk:1,drops:[[223,1,1,0.3],[206,1,2,0.5]],cause:'guard'},
  rsword:{n:'Swordsman of the Realm',m:'rsword',hp:24,dmg:5,reach:2.2,walk:1.35,run:4.7,sight:24,cd:1.1,wind:0.4,block:0.5,mass:0.55,folk:1,drops:[[223,1,1,0.35],[206,1,2,0.5]],cause:'guard'},
  rbow:{n:'Archer of the Realm',m:'rbow',hp:16,dmg:2,reach:2,walk:1.35,run:4.7,sight:30,cd:1.2,wind:0.4,shot:{dmg:3,v:28,lo:5,hi:28,cd:2.2,k:'arrow'},keep:11,mass:0.6,folk:1,drops:[[201,2,4,0.6],[206,1,1,0.4]],cause:'rarrow'},
  rcapt:{n:'Captain of the Realm',m:'rcapt',hp:44,dmg:7,reach:2.4,walk:1.35,run:4.6,sight:28,cd:1.1,wind:0.45,mass:0.4,folk:1,drops:[[227,1,2,0.6],[206,1,2,0.6]],cause:'guard'},
  rman:{n:'Townsman',m:'rman',hp:10,dmg:1,reach:1.6,walk:1.2,run:4.4,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[206,1,1,0.5]],cause:'guard'},
  rwoman:{n:'Townswoman',m:'rwoman',hp:10,dmg:1,reach:1.6,walk:1.2,run:4.4,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[207,1,2,0.5]],cause:'guard'},
  rmerch:{n:'Merchant',m:'rmerch',hp:12,dmg:1,reach:1.6,walk:1.1,run:4.2,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[224,1,1,0.3],[207,1,2,0.5]],cause:'guard'},
  rsmith:{n:'Smith',m:'rsmith',hp:16,dmg:2,reach:1.8,walk:1.1,run:4.2,sight:16,cd:1.2,wind:0.4,mass:0.6,folk:1,civ:1,drops:[[223,1,2,0.5]],cause:'guard'},
  rfarmer:{n:'Farmer',m:'rfarmer',hp:12,dmg:1,reach:1.8,walk:1.15,run:4.3,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[202,1,3,0.6],[209,1,2,0.4]],cause:'guard'},
  rnoble:{n:'Lord of the Realm',m:'rnoble',hp:14,dmg:1,reach:1.6,walk:1.05,run:4.2,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[224,1,2,0.6]],cause:'guard'},
  // the riders of the plains (D-061): say names the lines they greet with; mount: a horseman (three blocks tall, a horse's pace,
  // a long reach with the spear); fem: a woman's voice
  hspear:{n:'Guard of the Riders',m:'hspear',hp:22,dmg:4,reach:2.8,walk:1.3,run:4.7,sight:24,cd:1.3,wind:0.45,block:0.45,mass:0.55,folk:1,say:'hguard',drops:[[223,1,1,0.3],[206,1,2,0.5]],cause:'rider'},
  hbow:{n:'Bowman of the Riders',m:'hbow',hp:16,dmg:2,reach:2,walk:1.35,run:4.8,sight:30,cd:1.2,wind:0.4,shot:{dmg:3,v:28,lo:5,hi:28,cd:2,k:'arrow'},keep:11,mass:0.6,folk:1,say:'hguard',drops:[[201,2,4,0.6],[206,1,1,0.4]],cause:'harrow'},
  hcapt:{n:'Marshal of the Riders',m:'hcapt',hp:44,dmg:7,reach:2.4,walk:1.35,run:4.7,sight:28,cd:1.1,wind:0.45,block:0.45,mass:0.4,folk:1,drops:[[227,1,2,0.6],[206,1,2,0.6]],cause:'rider'},
  hrider:{n:'Horseman of the Riders',m:'hrider',hp:34,dmg:5,reach:3.2,walk:1.7,run:7,sight:32,cd:1.4,wind:0.5,block:0.4,mass:0.25,tall:3,mount:1,folk:1,say:'hguard',drops:[[223,1,1,0.3],[206,1,2,0.5]],cause:'horse'},
  hman:{n:'Freeman',m:'hman',hp:10,dmg:1,reach:1.6,walk:1.2,run:4.5,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[206,1,1,0.5]],cause:'rider'},
  hwoman:{n:'Freewoman',m:'hwoman',hp:10,dmg:1,reach:1.6,walk:1.2,run:4.5,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,fem:1,drops:[[207,1,2,0.5]],cause:'rider'},
  hherd:{n:'Horse-herd',m:'hherd',hp:12,dmg:1,reach:1.8,walk:1.25,run:4.6,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[202,1,2,0.5]],cause:'rider'},
  hthane:{n:'Thane of the Riders',m:'hthane',hp:16,dmg:2,reach:1.8,walk:1.05,run:4.3,sight:16,cd:1.2,wind:0.4,mass:0.65,folk:1,civ:1,drops:[[224,1,2,0.6]],cause:'rider'},
  hsmith:{n:'Smith',m:'rsmith',hp:16,dmg:2,reach:1.8,walk:1.1,run:4.2,sight:16,cd:1.2,wind:0.4,mass:0.6,folk:1,civ:1,drops:[[223,1,2,0.5]],cause:'rider'},
  // the high elves (D-062): strong in arms, their warriors stronger and keener-eyed than men's, their archers' reach long
  espear:{n:'Spearwarden of the Elves',m:'espear',hp:32,dmg:6,reach:3.2,walk:1.4,run:5,sight:32,cd:1.2,wind:0.4,block:0.3,mass:0.5,folk:1,say:'eguard',drops:[[223,1,2,0.4],[206,1,2,0.5]],cause:'elf'},
  esword:{n:'Bladewarden of the Elves',m:'esword',hp:32,dmg:7,reach:2.4,walk:1.4,run:5,sight:32,cd:1,wind:0.35,block:0.55,mass:0.5,folk:1,say:'eguard',drops:[[223,1,2,0.4],[206,1,2,0.5]],cause:'elf'},
  ebow:{n:'Archer of the Elves',m:'ebow',hp:24,dmg:3,reach:2,walk:1.45,run:5.1,sight:40,cd:1.1,wind:0.35,shot:{dmg:5,v:34,lo:5,hi:36,cd:1.6,k:'arrow'},keep:13,mass:0.55,folk:1,say:'eguard',drops:[[201,2,5,0.7],[206,1,1,0.4]],cause:'earrow'},
  ecapt:{n:'Lord-Captain of the Elves',m:'ecapt',hp:64,dmg:10,reach:2.6,walk:1.4,run:5,sight:36,cd:1,wind:0.4,block:0.5,mass:0.35,folk:1,drops:[[227,1,3,0.7],[224,1,2,0.5]],cause:'elf'},
  eknight:{n:'Knight of the Elves',m:'eknight',hp:48,dmg:8,reach:3.4,walk:1.8,run:7.5,sight:36,cd:1.3,wind:0.45,block:0.45,mass:0.2,tall:3,mount:1,folk:1,say:'eguard',drops:[[223,1,2,0.4],[227,1,1,0.3]],cause:'eknight'},
  elord:{n:'Elf-lord',m:'elord',hp:20,dmg:2,reach:1.8,walk:1.15,run:4.8,sight:18,cd:1.2,wind:0.4,mass:0.65,folk:1,civ:1,drops:[[224,1,2,0.5]],cause:'elf'},
  elady:{n:'Elf-lady',m:'elady',hp:18,dmg:1,reach:1.6,walk:1.15,run:4.8,sight:18,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,fem:1,drops:[[207,1,2,0.5]],cause:'elf'},
  elore:{n:'Loremaster',m:'elore',hp:16,dmg:1,reach:1.6,walk:1.05,run:4.6,sight:18,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[224,1,1,0.3]],cause:'elf'},
  esmith:{n:'Elven Smith',m:'esmith',hp:20,dmg:2,reach:1.8,walk:1.1,run:4.6,sight:18,cd:1.2,wind:0.4,mass:0.6,folk:1,civ:1,drops:[[223,1,3,0.6]],cause:'elf'},
  // the wood elves (D-065): wardens with long bows and the longest sight of any folk, blades with two long knives who strike
  // quickly, guards of the halls with glaives, captains; the king and the lords, the ladies, the folk of the glades
  wbow:{n:'Warden of the Wood',m:'wbow',hp:24,dmg:3,reach:2,walk:1.5,run:5.4,sight:44,cd:1.1,wind:0.35,shot:{dmg:4,v:34,lo:5,hi:38,cd:1.4,k:'arrow'},keep:12,mass:0.55,folk:1,say:'wguard',drops:[[201,2,5,0.7],[206,1,1,0.4]],cause:'warrow'},
  wknife:{n:'Blade of the Wood',m:'wknife',hp:26,dmg:5,reach:2,walk:1.5,run:5.6,sight:34,cd:0.6,wind:0.22,block:0.25,mass:0.5,folk:1,say:'wguard',drops:[[223,1,1,0.4],[206,1,2,0.5]],cause:'wood'},
  wguard:{n:'Guard of the Halls',m:'wguard',hp:30,dmg:5,reach:3,walk:1.4,run:5,sight:32,cd:1.1,wind:0.4,block:0.35,mass:0.5,folk:1,say:'wguard',drops:[[223,1,2,0.4],[206,1,2,0.5]],cause:'wood'},
  wcapt:{n:'Captain of the Wood',m:'wcapt',hp:54,dmg:8,reach:2.4,walk:1.5,run:5.5,sight:40,cd:0.8,wind:0.3,block:0.35,mass:0.4,folk:1,drops:[[227,1,2,0.6],[224,1,2,0.5]],cause:'wood'},
  wking:{n:'King of the Wood',m:'wking',hp:30,dmg:3,reach:2,walk:1.1,run:4.6,sight:20,cd:1.2,wind:0.4,mass:0.6,folk:1,civ:1,drops:[[224,2,4,0.6]],cause:'wood'},
  wlord:{n:'Lord of the Wood',m:'wlord',hp:20,dmg:2,reach:1.8,walk:1.15,run:4.8,sight:18,cd:1.2,wind:0.4,mass:0.65,folk:1,civ:1,drops:[[224,1,2,0.5]],cause:'wood'},
  wlady:{n:'Lady of the Wood',m:'wlady',hp:18,dmg:1,reach:1.6,walk:1.15,run:4.8,sight:18,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,fem:1,drops:[[207,1,2,0.5]],cause:'wood'},
  wfolk:{n:'Wood-elf',m:'wfolk',hp:16,dmg:1,reach:1.6,walk:1.2,run:5,sight:18,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[206,1,2,0.5],[202,1,2,0.4]],cause:'wood'},
  // the mountain dwarves (D-066): short, broad and heavy, slow on their feet but hard to move and hard to hurt; axeguards with
  // round shields, hammerers in plate with great hammers (the heaviest blows of any folk), crossbowmen who shoot far and hard but
  // slowly, captains; the king, thanes, ladies, miners and smiths
  daxe:{n:'Axeguard of the Mountain',m:'daxe',hp:36,dmg:6,reach:2,walk:1.2,run:4.4,sight:30,cd:0.9,wind:0.35,block:0.45,mass:0.3,tall:1.7,folk:1,say:'dguard',drops:[[223,1,2,0.5],[224,1,1,0.3]],cause:'dwarf'},
  dhammer:{n:'Hammerer of the Mountain',m:'dhammer',hp:46,dmg:9,reach:2.3,walk:1.1,run:4.2,sight:28,cd:1.3,wind:0.5,block:0.3,mass:0.2,tall:1.7,folk:1,say:'dguard',drops:[[223,1,2,0.5],[227,1,1,0.3]],cause:'dwarf'},
  dxbow:{n:'Crossbowman of the Mountain',m:'dxbow',hp:28,dmg:3,reach:1.8,walk:1.2,run:4.4,sight:38,cd:1.2,wind:0.4,shot:{dmg:7,v:40,lo:4,hi:34,cd:2.4,k:'arrow'},keep:10,mass:0.35,tall:1.7,folk:1,say:'dguard',drops:[[201,2,4,0.6],[223,1,1,0.3]],cause:'dbolt'},
  dcapt:{n:'Captain of the Hold',m:'dcapt',hp:70,dmg:10,reach:2.3,walk:1.2,run:4.4,sight:36,cd:0.9,wind:0.35,block:0.45,mass:0.15,tall:1.8,folk:1,drops:[[227,1,2,0.6],[224,1,2,0.5]],cause:'dwarf'},
  dking:{n:'Mountain King',m:'dking',hp:34,dmg:3,reach:2,walk:1,run:4,sight:20,cd:1.2,wind:0.4,mass:0.3,tall:1.8,folk:1,civ:1,drops:[[224,2,4,0.6]],cause:'dwarf'},
  dlord:{n:'Thane of the Hold',m:'dlord',hp:22,dmg:2,reach:1.8,walk:1.1,run:4.2,sight:18,cd:1.2,wind:0.4,mass:0.4,tall:1.7,folk:1,civ:1,drops:[[224,1,2,0.5]],cause:'dwarf'},
  dlady:{n:'Lady of the Hold',m:'dlady',hp:18,dmg:1,reach:1.6,walk:1.1,run:4.2,sight:18,cd:1.2,wind:0.4,mass:0.45,tall:1.7,folk:1,civ:1,fem:1,drops:[[207,1,2,0.5]],cause:'dwarf'},
  dminer:{n:'Miner of the Mountain',m:'dminer',hp:22,dmg:2,reach:1.8,walk:1.15,run:4.3,sight:18,cd:1.2,wind:0.4,mass:0.4,tall:1.7,folk:1,civ:1,drops:[[202,1,2,0.5],[206,1,1,0.3]],cause:'dwarf'},
  dsmith:{n:'Smith of the Mountain',m:'dsmith',hp:24,dmg:3,reach:1.8,walk:1.1,run:4.2,sight:18,cd:1.2,wind:0.4,mass:0.4,tall:1.7,folk:1,civ:1,drops:[[223,1,2,0.5]],cause:'dwarf'}
};
Object.assign(DEATH,{goblin:'A goblin got the better of you',stone:'A goblin’s sling stone found you',fire:'Goblin fire burned you',orc:'An orc cut you down',arrow:'An orc arrow found you',
  troll:'A troll crushed you',rock:'A troll’s thrown rock crushed you',ember:'An Emberlord burned you to ash',guard:'The guards of the realm cut you down',rarrow:'An archer of the realm shot you',
  rider:'The riders cut you down',harrow:'A bowman of the riders shot you',horse:'A horseman of the riders rode you down',
  elf:'The warriors of the elves struck you down',earrow:'An elven archer shot you',eknight:'A knight of the elves rode you down',
  wood:'The elves of the wood struck you down',warrow:'A warden of the wood shot you',dwarf:'The dwarves of the mountain struck you down',dbolt:'A crossbowman of the dwarves shot you'});
// who lives where: weights by place (warren halls by kind, camps before the ways in, warbands and trolls on the surface)
const FOE_HOME={den:[['goblin',3],['gslinger',1.5]],store:[['goblin',2],['gslinger',1]],forge:[['goblin',2],['gfire',1.5]],pen:[['goblin',2],['gslinger',1]],shrine:[['gfire',3],['goblin',1]],
  lava:[['goblin',2],['gslinger',2]],chief:[['goblin',2],['gslinger',1],['gfire',1]],camp:[['goblin',3],['gslinger',2]],band:[['raider',5],['bowman',3],['brute',1.5]],gate:[['raider',3],['bowman',2],['brute',1]],
  // the orcs' places on the wastes (D-064): a war camp and its gate, a watchtower's platform and foot, a forge, a fighting pit
  ocamp:[['raider',5],['bowman',2],['brute',1.5]],ogate:[['raider',2],['bowman',2]],otower:[['bowman',3],['raider',1]],ofoot:[['raider',2],['brute',1]],oforge:[['brute',2],['raider',2]],opit:[['raider',3],['brute',2]]};
// the folk's places in a realm's sites (a layout's spots, siteLayout) and its roads (D-060)
Object.assign(FOE_HOME,{r_gate:[['rspear',3],['rbow',1]],r_gatein:[['rspear',2],['rsword',1]],r_barracks:[['rsword',2],['rspear',1]],r_drill:[['rsword',2],['rspear',1]],r_keep:[['rsword',1]],
  r_market:[['rmerch',3],['rwoman',2],['rman',2]],r_street:[['rman',2],['rwoman',2],['rspear',0.5]],r_smithy:[['rman',1]],r_citadel:[['rspear',2],['rsword',1]],r_hall:[['rsword',1],['rman',0.4]],
  r_citgate:[['rspear',1]],r_green:[['rman',2],['rwoman',2],['rfarmer',1]],r_lane:[['rfarmer',1],['rman',1]],r_farm:[['rwoman',1],['rfarmer',1]],r_field:[['rfarmer',1]],r_post:[['rspear',2],['rbow',2]],
  r_patrol:[['rspear',2],['rsword',1.5],['rbow',1]],
  // the riders' places (D-061): their halls are kept by guards, their towns full of folk, horsemen at the drill and on the roads
  h_gate:[['hspear',3],['hbow',1.5]],h_gatein:[['hspear',2],['hrider',1]],h_hall:[['hspear',1.5],['hman',1],['hwoman',1]],h_citgate:[['hspear',1]],
  h_street:[['hman',2],['hwoman',2],['hherd',0.6],['hspear',0.4]],h_market:[['hwoman',3],['hman',2]],h_smithy:[['hman',1]],h_stable:[['hherd',2],['hman',1]],
  h_paddock:[['hherd',1]],h_keep:[['hspear',2]],h_barracks:[['hspear',2],['hbow',1]],h_drill:[['hrider',2],['hspear',1]],h_green:[['hman',2],['hwoman',2],['hherd',1]],
  h_lane:[['hman',1],['hherd',1]],h_farm:[['hherd',2],['hwoman',1]],h_field:[['hman',1]],h_post:[['hspear',2],['hbow',2]],h_patrol:[['hrider',1]],
  // the high elves' places (D-062): strong in arms, their gates, walls and courts are held by many
  e_gate:[['espear',3],['esword',2],['ebow',2]],e_gatein:[['espear',2],['esword',2],['eknight',1]],e_hall:[['esword',2],['elord',1.5],['elady',1.5],['elore',1]],
  e_street:[['elord',2],['elady',2],['elore',1],['esword',0.6]],e_garden:[['elady',2],['elord',1.5],['elore',1.5]],e_barracks:[['esword',2],['espear',2],['ebow',1]],
  e_drill:[['esword',2],['ebow',2],['espear',1]],e_smithy:[['elore',1]],e_keep:[['esword',2],['espear',1],['ebow',1]],e_green:[['elord',1],['elady',2],['elore',1]],
  e_lane:[['elady',1],['elord',1]],e_farm:[['elady',1],['elord',1]],e_field:[['elady',1],['elore',1]],e_post:[['espear',2],['ebow',2]],e_patrol:[['eknight',1]],
  // the havens (D-088): folk on the quays and piers, shipwrights, the lighthouse's watch
  e_throne:[['esword',2],['elord',1]],e_seat:[['esword',1],['elord',1]],e_court:[['elord',2],['elady',2],['elore',1]],e_market:[['elady',2],['elord',1]],e_heal:[['eheal',2],['elady',1]],
  e_library:[['elore',3]],e_stable:[['elady',1],['elord',1]],w_market:[['wfolk',2],['wlady',1]],w_heal:[['wlady',1],['wfolk',1]],w_stable:[['wfolk',1]],
  e_quay:[['elady',2],['elord',2],['elore',1]],e_pier:[['elord',1],['elady',1]],e_wright:[['esmith',2],['elord',0.5]],e_light:[['ebow',1],['espear',1]],
  // a host of each people that marches through the Volcanic Wastes against its creatures (D-063)
  r_host:[['rsword',2],['rspear',2],['rbow',1.5]],h_host:[['hrider',3],['hbow',1],['hspear',0.5]],e_host:[['esword',2],['espear',2],['ebow',2],['eknight',1]],
  // the wood elves' places (D-065): wardens on the gate, the platforms and the watch-trees; the halls kept by guards; folk in the glades
  w_gate:[['wbow',2],['wguard',2]],w_deck:[['wbow',2],['wlady',0.6],['wlord',0.4]],w_street:[['wfolk',2],['wlady',1],['wbow',0.6]],w_hall:[['wguard',1],['wlady',1]],
  w_garden:[['wlady',1.5],['wfolk',1.5]],w_range:[['wbow',3]],w_keep:[['wguard',3],['wbow',1]],w_cellar:[['wfolk',1]],w_glade:[['wfolk',2],['wlady',1.5],['wlord',0.6],['wbow',0.5]],
  w_post:[['wbow',2]],w_patrol:[['wbow',1],['wknife',1]],w_host:[['wbow',3],['wknife',2],['wguard',1.5]],
  // the mountain dwarves' places (D-066): guards at the gates, crossbowmen on the towers, hammerers before the great gate and in
  // the king's hall, smiths at the forges, miners at the headframes and down in the mines
  d_gate:[['daxe',2],['dhammer',1],['dxbow',1]],d_gatein:[['daxe',2],['dxbow',1]],d_wall:[['dxbow',3]],d_street:[['dminer',1],['dsmith',0.6],['dlady',1],['dlord',0.4],['daxe',0.6]],
  d_forge:[['dsmith',3],['dminer',0.5]],d_mine:[['dminer',3]],d_deep:[['dminer',3],['daxe',0.3]],d_court:[['dhammer',2],['daxe',1]],d_door:[['dhammer',3]],
  d_hall:[['dlord',1],['dlady',1],['daxe',1],['dhammer',0.6]],d_keep:[['dhammer',3],['dlord',1]],d_barracks:[['daxe',2],['dhammer',1],['dxbow',1]],d_dforge:[['dsmith',3],['dminer',1]],
  d_smelt:[['dsmith',2],['dminer',2]],d_drill:[['daxe',2],['dhammer',2]],d_post:[['dxbow',2],['daxe',1]],d_patrol:[['daxe',1],['dxbow',1]],d_host:[['daxe',3],['dhammer',2],['dxbow',2]]});
const FOLK_N={gate:[2,3],gatein:[2,2],barracks:[2,3],drill:[3,4],keep:[2,2],market:[2,3],street:[1,2],smithy:[1,2],citadel:[2,2],hall:[2,3],citgate:[2,2],green:[2,3],lane:[1,1],farm:[2,2],field:[1,2],post:[2,3],patrol:[2,3],
    stable:[1,2],paddock:[1,1],deck:[2,3],quay:[2,3],pier:[1,2],wright:[1,2],light:[1,2],throne:[3,3],seat:[2,2],court:[2,3],heal:[2,3],library:[2,3],range:[2,3],cellar:[1,2],glade:[3,5],forge:[1,2],mine:[2,3],deep:[2,3],door:[2,3],court:[2,3],wall:[1,2],dforge:[2,4],smelt:[2,3]},
  FOLK_LEAD={r_barracks:'rcapt',r_keep:'rcapt',r_smithy:'rsmith',r_hall:'rnoble',r_farm:'rfarmer',h_hall:'hthane',h_keep:'hcapt',h_drill:'hcapt',h_smithy:'hsmith',h_farm:'hherd',h_gatein:'hcapt',
    e_hall:'elord',e_keep:'ecapt',e_wright:'esmith',e_throne:'elord',e_seat:'elord',e_heal:'eheal',e_drill:'ecapt',e_smithy:'esmith',e_gatein:'ecapt',e_barracks:'ecapt',r_host:'rcapt',h_host:'hcapt',e_host:'ecapt',w_hall:'wking',w_keep:'wking',w_gate:'wcapt',w_host:'wcapt',d_keep:'dking',d_gate:'dcapt',d_host:'dcapt',d_drill:'dcapt',d_barracks:'dcapt'};
const FOE_N={den:[3,5],store:[2,3],forge:[3,3],pen:[2,3],shrine:[2,3],lava:[2,3],chief:[3,4],camp:[3,5],band:[2,5],gate:[4,5],ocamp:[4,6],ogate:[2,2],otower:[2,3],ofoot:[1,2],oforge:[3,4],opit:[3,4]};
const foes=[],shots=[],foeSpots=new Map(),TFO={},foeGrid=new Map(),foeGridS=[new Map(),new Map()];let foeFrame=0;let foeT=0,foeId=1,foeClock=0,foeSnd=0,foeRadMax=1;
const fallenLords=new Set(saved&&Array.isArray(saved.fk)?saved.fk.map(String):[]),foeSave=()=>({fk:[...fallenLords]});
entityKind({name:'foes',list:foes,update:dt=>updFoes(dt),persist:true,shift:(dx,dz)=>{for(const f of foes){f.x-=dx;f.z-=dz;f.hx-=dx;f.hz-=dz;if(f.tx!==undefined){f.tx-=dx;f.tz-=dz;}}
  for(const s of shots){s.x-=dx;s.z-=dz;}}});
const pickW=L=>{let t=0;for(const l of L)t+=l[1];let v=Math.random()*t;for(const l of L){v-=l[1];if(v<=0)return l[0];}return L[0][0];};
// the ground a foe of height `tall` stands on near y (like standY, with room for its height), or -1
function foeStand(x,y,z,tall){const bx=Math.floor(x),bz=Math.floor(z);if(bx<0||bz<0||bx>=W||bz>=D)return -1;
  for(let yy=Math.floor(y)+1;yy>=Math.floor(y)-3;yy--){if(yy<1||yy>=H-tall)continue;if(!SOLID[get(bx,yy-1,bz)])continue;let ok=true;for(let k=0;k<tall&&ok;k++)if(SOLID[get(bx,yy+k,bz)])ok=false;if(ok)return yy;}return -1;}
const foeWet=(x,y,z)=>{const id=get(Math.floor(x),y,Math.floor(z));return isWetId(id)||id===LAVA||get(Math.floor(x),y-1,Math.floor(z))===LAVA;};
function addFoe(kind,x,y,z,o){
  const F=FOES[kind],K=AM_KINDS[F.m],ci=o&&o.ci!==undefined&&K.coats[o.ci]?o.ci:amCoat(F.m,Math.random()),m=amBuild(F.m,ci,{});scene.add(m.grp);scene.add(m.shadow);
  const f=Object.assign({id:foeId++,kind:kind,x:x,y:y,z:z,gy:y,vy:0,kvx:0,kvz:0,yaw:Math.random()*6.283,hd:0,sp:0,st:'idle',t:1+Math.random()*2,hp:F.hp,mhp:F.hp,hx:x,hy:y,hz:z,grp:0,
    ph:Math.random()*6,amp:0,atk:0,atkK:'',atkT:0,foe:null,eseen:0,scanT:Math.random()*0.5,shotT:1+Math.random()*2,whipT:3,seen:0,losT:0,vis:false,lk:0,lkT:0,hurt:0,ct:4+Math.random()*10,lt:0,eL:1,eB:0,det:0,detT:0,ci:ci,m:m},o||{});
  f.hd=f.yaw;if(!f.grp)f.grp=f.id;foes.push(f);placeFoe(f,0);return f;
}
function removeFoe(f){f.gone=1;scene.remove(f.m.grp);scene.remove(f.m.shadow);f.m.mat.dispose();f.m.shadow.material.dispose();const i=foes.indexOf(f);if(i>=0)foes.splice(i,1);}
// a group of `n` from a place's table around (x,z) near height y, sharing a group and a home; spread within r
function spawnGroup(table,n,x,y,z,r,o){
  let lead=null;const out=[];
  for(let i=0;i<n;i++){const kind=i===0&&o&&o.lead?o.lead:pickW(FOE_HOME[table]),tall=FOES[kind].tall||2;let p=null;
    for(let k=0;k<14&&!p;k++){const a=Math.random()*6.283,d=Math.random()*r,xx=x+Math.cos(a)*d,zz=z+Math.sin(a)*d,yy=foeStand(xx,y+1,zz,tall);if(yy>0&&!foeWet(xx,yy,zz))p=[xx,yy,zz];}
    if(!p)continue;const f=addFoe(kind,p[0],p[1],p[2],Object.assign({grp:lead?lead.grp:0,spot:o&&o.spot,prov:o&&o.prov,site:o&&o.site},o&&o.sleep&&Math.random()<o.sleep?{st:'sleep',t:999}:{}));if(!lead)lead=f;out.push(f);}
  return out;
}
// ---- Where foes come from: the places near the player (warren halls and camps, fortresses, the Ashen Citadel) are peopled
// once while you are near; out on the wastes warbands and trolls come and go
const FOE_CAP=16;
function foePlaces(){
  const X=PL.x+OX,Z=PL.z+OZ,out=[];
  // a warren's halls fill while you are underground near them (or right above); the camps at its ways in whenever you are near
  const bx=Math.floor(PL.x),bz=Math.floor(PL.z),under=bx>=0&&bz>=0&&bx<W&&bz<D&&PL.y<ground[bx+W*bz]-6;
  for(const s of warrenSpots(X,Z,60))if(s.kind==='camp'||(under?Math.hypot(s.x-X,s.z-Z)<52:Math.hypot(s.x-X,s.z-Z)<28))out.push(s);
  for(const F of fortsNear(X,Z,80)){const S=fortSpots(F),id=F.id;out.push({id:id+'g',x:S.guards[0].x,y:F.Fy,z:S.guards[0].z,R:6,kind:'gate'});if(!F.great||!fallenLords.has(id))out.push({id:id,x:S.lord.x,y:S.lord.y,z:S.lord.z,R:F.great?1:5,kind:'lord',F:F});}
  const sg=sigNear(X,Z,60);if(sg&&sg.kind==='citadel')out.push({id:'s'+sg.X+','+sg.Z,x:sg.X,y:sg.g,z:sg.Z,R:9,kind:'citadel'});
  // the orcs' places on the wastes (D-064): each spot within 64 blocks; a warchief may lead the camp, a troll fight in the pit
  for(const p of orcsNear(X,Z,64))orcSpots(p).forEach((s,k)=>{if(Math.hypot(s.x-X,s.z-Z)<64)out.push(Object.assign({id:'o'+p.i+','+p.j+','+k},s));});
  // the realms of men (D-060): each spot of a site's layout within 46 blocks
  for(const s of realmTile(Math.floor(X),Math.floor(Z)).sites){if(Math.hypot(s.X-X,s.Z-Z)>s.R+70)continue;const L=siteLayout(s);
    L.spots.forEach((p,i)=>{const [x,z]=siteXZ(s,p.u,p.v);if(Math.hypot(x-X,z-Z)>46)return;out.push({id:s.id+':'+i,x:x+0.5,y:p.y>0?p.y+1:hAt(Math.round(x),Math.round(z))+1,z:z+0.5,R:p.kind==='gate'||p.kind==='post'||p.kind==='citgate'?2.5:4,kind:s.prov.cult.fp+p.kind,folk:1,horses:p.horses||0,s:s});});}
  warPlaces(X,Z,out); // the gates of the wastes: the camp of the hosts, the siege works, the orcs' yard (D-067)
  warFrontPlaces(X,Z,out); // the forward camps beyond a fallen gate (W5)
  stairSpots(X,PL.y,Z,out); // the halls and caverns of the Ember Stair (D-067)
  return out;
}
function foeSpawnTick(){
  const X=PL.x+OX,Z=PL.z+OZ;
  // a place is peopled once while the player is near; it may be again after they have gone well away
  for(const [id,rec] of foeSpots)if(Math.hypot(rec.x-X,rec.z-Z)>(rec.folk?86:120))foeSpots.delete(id); // the folk's places refill sooner: they are many and close together
  const wn=warNear(),live=foes.filter(f=>!f.dead&&!f.hst).length; // (the nearest places first, D-084); by a gate of the wastes there are more of both (D-067); (the war's fallen, lying, do not count, W2)
  for(const s0 of foePlaces().sort((a,b)=>Math.hypot(a.x-X,a.z-Z)-Math.hypot(b.x-X,b.z-Z))){const s=warHeld(s0),folk=!!s.folk; /* (a place the hosts have stormed is theirs, W5) */if(foeSpots.has(s.id)||(!folk&&live>=(wn?42:28)&&s.kind!=='lord'))continue;if(!folk&&s.kind!=='lord'&&fallenLords.size&&hsh(Math.round(s.x),9997,Math.round(s.z))>0.25&&deadBasinAt(s.x,s.z))continue; /* (a fallen lord's servants scatter, W7c) */const x=s.x-OX,z=s.z-OZ;if(x<2||z<2||x>=W-2||z>=D-2||!genDone[(Math.floor(x)>>4)+(Math.floor(z)>>4)*NCX])continue;
    if(folk&&folkCount()>=FOLK_CAP+(wn?(campIn()?70:14):0))continue; /* (the Leaguer is full of life: D-084) */foeSpots.set(s.id,{x:s.x,z:s.z,folk:folk});const o={spot:s.id};
    if(s.kind==='lord'&&s.F.great){const f=emberSpawn(s.F,x,s.y,z,{spot:s.id,lordOf:s.id,st:'idle',t:3,leash:fortSpots(s.F).reach});f.yaw=f.hd=Math.atan2(s.F.ox,s.F.oz);continue;}
    if(s.kind==='lord'){spawnGroup('gate',4,x,s.y,z,5,{spot:s.id,lead:'ochief'});continue;}
    if(s.kind==='citadel'){spawnGroup('band',4+Math.floor(Math.random()*3),x,s.y,z,s.R,{spot:s.id,lead:'ochief'});continue;}
    if(folk){const k=s.kind.slice(2),N=FOLK_N[k]||[1,2],night=ambNight()&&!['gate','gatein','post','citgate','barracks','keep','citadel'].includes(k);
      for(const f of spawnGroup(s.kind,Math.max(1,N[0]+Math.floor(Math.random()*(N[1]-N[0]+1))-(night&&!CAMP_ACT[s.kind]?1:0)),x,s.y,z,s.R,{spot:s.id,lead:s.kind==='r_throne'?menThroneLead(s.s):s.kind==='h_seat'?riderSeatLead(s.s):s.kind==='d_dthrone'?dwarfSeatLead(s.s):s.kind==='e_throne'?(hsh(s.s.prov.kingdom.key.length,9831,[...s.s.prov.kingdom.key].reduce((a,c)=>a+c.charCodeAt(0),0))<0.5?'eking':'equeen'):FOLK_LEAD[s.kind]||null,prov:s.s.prov.key,site:s.s}))f.spk=s.kind; // (its place's work, D-084)
      if(s.horses)folkHorses(s,x,z);continue;}
    const N=FOE_N[s.kind]||[2,3],n=N[0]+Math.floor(Math.random()*(N[1]-N[0]+1));
    spawnGroup(s.kind,n,x,s.y,z,s.R,{spot:s.id,lead:s.kind==='chief'?'gchief':s.stair==='cavern'&&Math.random()<0.5?'troll':s.kind==='ocamp'&&Math.random()<0.35?'ochief':s.kind==='opit'&&Math.random()<0.4?'troll':null,sleep:s.kind==='den'?0.45:s.kind==='ocamp'&&ambNight()?0.4:0});}
  folkPatrol();warTick();
  // now and then a host of the nearest people marches through the wastes against their creatures (D-063): from out of sight
  // behind the player to as far again beyond, one host at a time, every few minutes
  hostT-=1;if(hostT<=0){hostT=20;if(warAuto('a')&&!foes.some(f=>f.host&&!f.dead)&&folkCount()<FOLK_CAP-6){const p=wasteGround(46,60),H=p&&hostOf(PL.x+OX,PL.z+OZ);if(H){hostT=150+Math.random()*90;
    const grp=spawnGroup(H.C.fp+'host',4+Math.floor(Math.random()*3),p.x,p.g,p.z,4,{lead:FOLK_LEAD[H.C.fp+'host'],prov:H.key}),hx=2*PL.x-p.x,hz=2*PL.z-p.z;
    for(const f of grp){f.host=H;f.hx=hx+(Math.random()-0.5)*6;f.hz=hz+(Math.random()-0.5)*6;f.st='return';f.t=60;}
    if(grp.length){toast('A host of '+H.k.replace(/^The /,'the ')+' marches through the wastes');foeCall(grp[0],'alert');}}}}
  // the wastes: a warband (sometimes led by a warchief) or a troll, out of sight, on open ground of the volcanic land
  const roam=foes.filter(f=>!f.spot&&!f.dead&&!FOES[f.kind].folk).length,cap=(ambNight()?14:10)-Math.max(0,live-FOE_CAP);if(roam>=cap||Math.random()>0.35)return;
  const p=wasteGround(38,66);if(!p)return;
  if(Math.random()<0.2)spawnGroup('band',1,p.x,p.g,p.z,2,{lead:'troll'});
  else spawnGroup('band',2+Math.floor(Math.random()*3)+(Math.random()<0.12?1:0),p.x,p.g,p.z,5,{lead:Math.random()<0.12?'ochief':null});
}
// open ground of the volcanic land d0 to d1 blocks from the player, behind them (out of sight), or null
function wasteGround(d0,d1){
  const a=PL.yaw+Math.PI+(Math.random()-0.5)*Math.PI*1.4,d=d0+Math.random()*(d1-d0),x=PL.x-Math.sin(a)*d,z=PL.z-Math.cos(a)*d,bx=Math.floor(x),bz=Math.floor(z);
  if(bx<3||bz<3||bx>=W-3||bz>=D-3)return null;const g=ground[bx+W*bz];if(g<=SEA-WB_DEP||!genDone[(bx>>4)+(bz>>4)*NCX]||PL.y<g-14)return null;
  colInfo(bx+OX,bz+OZ,TFO);if(TFO.wVolc<0.55||TFO.vflow||TFO.vfis||TFO.vlake)return null;const top=get(bx,g,bz);if(!SOLID[top]||top===LAVA)return null;
  return {x:x,z:z,g:g};
}
// the people whose held stretch lies nearest (X,Z), and its kingdom: they send the hosts into the wastes there (kept per cell)
const hostC=new Map();let hostT=45;
function hostOf(X,Z){
  const i0=Math.floor(X/LS),j0=Math.floor(Z/LS),key=i0*65536+j0;if(hostC.has(key))return hostC.get(key);if(hostC.size>200)hostC.clear();let best=null,bd=1e9;
  for(let r=1;r<=8&&!best;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const c=stretchCell(landSite(i0+a,j0+b)),C=realmHeld(c);if(!C)continue;
    const d=Math.hypot(c.x-X,c.z-Z);if(d<bd){bd=d;best={C:C,c:c};}}
  const H=best?{C:best.C,key:'host:'+best.C.k+best.c.i+','+best.c.j,k:kingdomOf(best.c,best.C).name}:null;hostC.set(key,H);return H;
}
// ---- The folk of the realms (D-060): neutral until struck. A blow to any of them sets their province's wrath (eased away over a
// minute or two, longer for a death): its guards near by take up arms against the player, its townsfolk flee; never in
// creative. Patrols walk the king's roads; folk greet the player who comes close and looks at them.
const FOLK_CAP=34,realmWrath=new Map();let folkGreetT=0;
const folkCount=()=>{let n=0;for(const f of foes)if(FOES[f.kind].folk&&!f.dead&&!f.hst)n++;return n;}; // (a summoned host's soldiers do not count: D-077)
const folkWrath=f=>!!f.prov&&((realmWrath.get(f.prov)||0)>0||menOutlaw(f)||riderOutlaw(f)||dwarfOutlaw(f)); // (or the player outlawed in its kingdom, D-089; banished by the riders, D-090, or the dwarves, D-091)
function folkProvoke(f,secs){if(!f.prov||!foeTarget())return;const was=folkWrath(f);realmWrath.set(f.prov,Math.max(realmWrath.get(f.prov)||0,secs));
  for(const g of foes){if(g.dead||g.prov!==f.prov||Math.hypot(g.x-f.x,g.z-f.z)>40)continue;const G=FOES[g.kind];
    if(G.civ){if(Math.hypot(g.x-PL.x,g.z-PL.z)<18){g.st='flee';g.t=4+Math.random()*3;}}else if(g.st!=='chase'){g.st='chase';g.seen=0;g.t=0;g.ct=Math.random()*0.8;}}
  if(!was){elfStruck(f);menStruck(f);riderStruck(f);dwarfStruck(f);toast(f.host?'The host of '+f.host.k.replace(/^The /,'the ')+' turns on you':'The folk of '+(f.site?f.site.name:'the realm')+' take up arms against you');foeCall(f,'alert');}}
// a patrol on the king's road (two to four soldiers, now and then with their captain), out of sight, walking the road
function folkPatrol(){
  if(folkCount()>=FOLK_CAP-4||Math.random()>0.25)return;const X=PL.x+OX,Z=PL.z+OZ,T=realmTile(Math.floor(X),Math.floor(Z));
  const roads=T.roads.filter(r=>r.k==='high');if(!roads.length)return;if(foes.some(f=>f.road&&!f.dead))return;
  const rd=roads[Math.floor(Math.random()*roads.length)],t=Math.random(),px=rd.a[0]+(rd.b[0]-rd.a[0])*t,pz=rd.a[1]+(rd.b[1]-rd.a[1])*t,d=Math.hypot(px-X,pz-Z);
  if(d<34||d>70)return;const x=px-OX,z=pz-OZ,bx=Math.floor(x),bz=Math.floor(z);if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])return;
  const C=rd.P.cult,horse=C.k==='horse',grp=spawnGroup(C.fp+'patrol',2+Math.floor(Math.random()*2),x,ground[bx+W*bz],z,horse||C.k==='elf'?3:2,{lead:C.k==='white'&&Math.random()<0.3?'rcapt':null,prov:rd.P.key,site:rd.P.sites[0]});
  const dir=Math.random()<0.5?1:-1;for(const f of grp){f.road={rd:rd,dir:dir,along:t*rd.len};f.st='idle';f.t=0.5;}
}
// the horses of a riders' paddock (D-061): put out once while the player is near, penned until one is ridden away
function folkHorses(s,x,z){for(const a of [...animals])if(a.spot===s.id&&!a.tame)removeAnimal(a);
  for(let i=0;i<s.horses;i++){const xx=x+(Math.random()-0.5)*4,zz=z+(Math.random()-0.5)*4,yy=standY(xx,s.y+1,zz);if(yy<0||wetAt(xx,yy,zz))continue;
    addAnimal(/^e_/.test(s.kind)?'ehorse':/^w_/.test(s.kind)?'elk':'horse',xx,yy,zz,{spot:s.id,pen:{x:x,z:z,r:2.6},young:i>0&&Math.random()<0.3&&!/^[ew]_/.test(s.kind)});}} // (the elves' stables keep elven horses, the wood's pens great elk: D-088)
// what the folk say to a passer-by (the place and the kingdom by name)
const FOLK_SAY={
  guard:['Hail, traveller. Keep the peace within these walls.','The roads of {k} are watched. Go safely.','Walk freely, stranger, but draw no blade here.','Mind the king\'s law in {p}.','Nothing stirs on the border tonight. Long may it stay so.'],
  rcapt:['You stand in {p}, of {k}. The king\'s peace holds here.','My men keep the roads from the hills to the river. Travel by day.','If you have seen smoke in the east, speak of it to me.'],
  rman:['Good day to you.','Have you come far? The roads are long.','They say the ash lands burn brighter every year.','The harvest was good. The king\'s granaries are full.','Welcome to {p}.'],
  rwoman:['Good day, traveller.','The well water is the sweetest in {k}.','Mind the carts on the avenue.','There is bread at the market, if you are hungry.'],
  rmerch:['Wares from every corner of {k}!','Fine cloth and good iron. Trade will come in better days.','The southern road is safe again, they say.'],
  rsmith:['Steel for the king\'s guard. Mind the sparks.','A good blade wants a good arm behind it.','The forge never sleeps in {p}.'],
  rfarmer:['Fair weather for the harvest, by the look of it.','The fields of {p} feed half the city.','Watch your step in the furrows.'],
  rnoble:['Welcome to {p}. The king\'s peace is upon this hall.','The white tower has stood a thousand years. It will stand a thousand more.','You are far from home, I think. Be welcome here.'],
  // the riders (D-061)
  hguard:['Halt and be known, stranger. Then go on in peace.','The plains of {k} are wide, but they are watched.','You are welcome in {p} while you keep the peace.','Few walk where we ride. Where is your horse?','The beacons are dark tonight. Long may they stay so.'],
  hcapt:['I am a marshal of the riders of {p}. Speak your errand.','Our horses run from the hills to the river. Nothing crosses the grass unseen.','If you ride east, keep clear of the burning lands.'],
  hman:['Well met.','The grass is high this year. The herds grow fat.','Have you seen the king\'s horses? Finer were never foaled.','There is mead in the hall tonight, if you are thirsty.','Welcome to {p}.'],
  hwoman:['Well met, traveller.','The hearth in {p} is never let go out.','Mind the foals by the paddock.','My brothers ride with the riders of {k}.'],
  hherd:['Easy now. They are skittish with strangers.','Every horse in {p} knows my whistle.','The wolves came close last winter, but not one foal was lost.'],
  hthane:['Be welcome in the hall of {p}. Lay aside your blade at the door.','The kings of {k} sleep in their mounds beside the road. We keep their memory green.','Sit by the fire, guest. The hall is open to friends.'],
  hsmith:['Shoes for horses and heads for spears. Mind the sparks.','The riders of {p} ride on my iron.','A loose shoe can lose a battle.'],
  // the high elves (D-062)
  eguard:['You walk in {p}, stranger. Walk softly.','The watch on the walls of {k} has not slept in a thousand years.','Few find their way here, and fewer still unbidden.','Keep your blade sheathed and you are welcome.','The stars are bright over the mountains tonight.'],
  ecapt:['I keep the gates of {p}. Speak, and be known.','Our blades were forged when these mountains were young.','Dark things stir in the burning lands. We are watching.'],
  elord:['Be welcome in {p}, traveller. Rest here as long as you need.','The world grows old, and we remember it young.','Even here the years are felt, though slowly.'],
  elady:['The fountains of {p} sing at night, if you listen.','You have come far. Sit a while by the water.','There is much beauty yet in the world.'],
  elore:['The histories of {k} fill a hundred halls. I have read but a few.','Every stone here was laid with a song.','Ask, and I will tell you what I know of the elder days.'],
  esmith:['Steel that sings is steel well made.','A blade from these forges never dulls in a worthy hand.','The forges of {p} burn white, not red.'],
  // the wood elves (D-065)
  wguard:['The trees saw you coming long before we did.','You walk under the boughs of {k}. Tread lightly.','Stay on the lamplit ways, stranger, and none will trouble you.','Our bows are quick, but our welcome is quicker, for those who mean no harm.'],
  wcapt:['I keep the ways of {p}. Few pass that I do not see.','The spiders and the dark things keep to the old woods. We keep them there.','You are welcome in {k}, while the lamps are lit.'],
  wking:['Few walk freely in my halls. You may count yourself among them.','The wood remembers every king. It will remember me a little while yet.','Be welcome in {p}, traveller. There is wine, and song, if you will stay.'],
  wlord:['The leaves turn gold here every year, and every year it is new to us.','Have you heard the singing in the high trees? It goes on all night.','Welcome to {p}.'],
  wlady:['Walk softly. The trees are listening.','The lamps of {p} were lit before your grandfather\'s grandfather was born.','There is a spring under the great tree. Drink, if you are weary.'],
  wfolk:['Come and sit by the fire, there is room.','The feast lasts till the stars go out.','We have not had a stranger at our tables for many a year.','Mind the roots in the dark.'],
  // the mountain dwarves (D-066)
  dguard:['Stone remembers. Mind you do as well.','You stand in the halls of {k}. Keep your hands where I can see them.','Hammer and anvil, stranger. That is our greeting.','The mountain is deep and our watch is long.'],
  dcapt:['I hold the gate of {p}. Nothing passes that I have not weighed.','Our engines are wound and our bolts are sharp. Be glad you come in peace.','The orcs of the fire have learned the weight of our hammers.'],
  dking:['Every stone of {p} was cut by the hands of my fathers.','Gold is soft. Iron is honest. Remember that, traveller.','Be welcome under the mountain, while you keep faith with it.'],
  dlord:['The forges of {p} have not gone cold in nine hundred years.','Our ledgers are as long as our beards. Longer, some say.','Welcome to {p}.'],
  dlady:['Mind the steps. They are older than your kingdom.','The deep halls are warm, whatever the snows say.','Have you seen the great hall by lamplight? You should.'],
  dminer:['There is a seam of iron down there as thick as a door.','Keep to the lit galleries. The dark ones are dark for a reason.','Pick, prop and lamp. That is all a miner needs.'],
  dsmith:['Hot iron waits for no one. Stand aside.','That blade of yours wants a better edge. Bring it to the forge.','Hear that? That is the mountain singing.'],
  // a host in the wastes (D-063)
  host:['We march against the creatures of the ash, for {k}.','Keep close, traveller. The ash hides many foes.','The orcs grow bold. {k} will not wait for them at its gates.','If the horns sound, stand behind our line.','Not all who march out of {k} march home again.']};
function folkGreet(){
  if(folkGreetT>0||!playing||dead)return;const d=camDir();
  for(const f of foes){const F=FOES[f.kind];if(!F.folk||F.hound||f.wnd||f.dead||f.greeted||f.foe||folkWrath(f))continue;const dx=f.x-PL.x,dz=f.z-PL.z,dp=Math.hypot(dx,dz);if(dp>3.6||Math.abs(f.y-PL.y)>2)continue;
    if((dx*d.x+dz*d.z)/(dp||1)<0.75)continue;f.greeted=1;folkGreetT=7;const eg=elfPeopleOf(f)&&elfGreet(f,F)||menPeopleOf(f)&&!f.host&&menGreet(f,F)||riderPeopleOf(f)&&!f.host&&riderGreet(f,F)||dwarfPeopleOf(f)&&!f.host&&dwarfGreet(f,F);if(eg){toast(eg);foeCall(f,'idle');return;}const L=f.host&&FOLK_SAY.host||f.site&&f.site.k==='wgate'&&FOLK_SAY.siege||FOLK_SAY[f.kind]||FOLK_SAY[F.say]||FOLK_SAY.guard;
    const p=f.site?f.site.name:'the realm',k=f.site?f.site.prov.kingdom.name.replace(/^The /,'the '):f.host?f.host.k.replace(/^The /,'the '):'the kingdom';
    toast((f.hero?f.hero.n:F.n)+': "'+L[Math.floor(Math.random()*L.length)].replace('{p}',p).replace('{k}',k)+'"');foeCall(f,'idle');return;}
}
// ---- Behaviour
// can a foe see the player? A ray from its eyes to the player's, through anything but solid opaque blocks
function foeSees(f){return foeSeesAt(f,PL.x,PL.y+EYE,PL.z,FOES[f.kind].sight*2.6);}
function foeSeesAt(f,tx,ty,tz,lim){const ex=f.x,ey=f.y+f.m.box[4]*0.85,ez=f.z,d=Math.hypot(tx-ex,ty-ey,tz-ez),n=Math.ceil(d*2);
  if(d>lim)return false;for(let k=1;k<n;k++){const q=k/n,id=get(Math.floor(ex+(tx-ex)*q),Math.floor(ey+(ty-ey)*q),Math.floor(ez+(tz-ez)*q));if(OPQ[id]&&SOLID[id])return false;}return true;}
// ---- Strife (D-063): the creatures of the wastes and the folk of the realms are foes to each other wherever they meet, in
// creative too. Each looks about every half second for the nearest of the other side it can see; it keeps to the one it fights
// unless another is plainly nearer, and lets it go when long unseen or far. A player it hunts comes first when plainly nearer.
// A new fight rallies its fellows near by; townsfolk flee. Their blows and shots wound each other (never one of their own side);
// what falls to the other side leaves nothing for the player.
const foeRad=f=>f.rad||(f.rad=Math.max(f.m.box[3],-f.m.box[0])),foeSide=f=>!FOES[f.kind].folk,foeSd=f=>f.sd!==undefined?f.sd:(f.sd=FOES[f.kind].folk?0:1);
// the living about (x,z) within r, from the grid of four-block cells built each frame in updFoes (an army is many: D-077), of one
// side only if sd is given (0 the folk, 1 the wastes); where the cells would outnumber the creatures, all of them
function foeNear(x,z,r,fn,sd){const c0=Math.max(0,Math.floor((x-r)/4)+8),c1=Math.min(255,Math.floor((x+r)/4)+8),d0=Math.max(0,Math.floor((z-r)/4)+8),d1=Math.min(255,Math.floor((z+r)/4)+8);
  if((c1-c0+1)*(d1-d0+1)>foes.length){for(const g of foes)if(!g.dead&&!g.gone&&(sd===undefined||foeSd(g)===sd))fn(g);return;}
  const G=sd===undefined?foeGrid:foeGridS[sd];for(let i=c0;i<=c1;i++)for(let j=d0;j<=d1;j++){const c=G.get(i*256+j);if(c)for(const g of c)if(!g.gone)fn(g);}}
const foeEyeOn=(f,g,lim)=>foeSeesAt(f,g.x,g.y+g.m.box[4]*0.6,g.z,lim);
function foeScan(f,F,tg){
  if(f.rout||f.msg||f.sneak)return; // (running: W8b; a rider with word of a battle: W8c; slipping through the hidden way: D-085)
  if(f.duel&&!f.duel.dead&&!f.duel.gone&&!f.duel.wnd){f.foe=f.duel;f.eseen=0;return;} // a champion fights only the other (W8c)
  let E=f.foe;const sr=f.st==='sleep'?Math.min(4,F.sight*0.3):F.sight*(F.folk&&warNightK?0.7:1),far=g=>f.leash&&Math.hypot(g.x-f.hx,g.z-f.hz)>f.leash+12;
  if(E){const d=Math.hypot(E.x-f.x,E.z-f.z);if(foeEyeOn(f,E,F.sight*2.6))f.eseen=0;else f.eseen+=0.5;
    if(!(f.hst&&f.hst.cmd==='charge')/* (a summoned host's charge keeps its foe: D-077) */&&(f.eseen>6||d>F.sight*2.5||far(E))){f.foe=E=null;if(f.st==='chase'||f.st==='flee'){f.st='return';f.atk=0;f.t=0;}}}
  const hunts=tg&&f.vis&&!F.civ&&(!F.folk||folkWrath(f)),pd=Math.hypot(PL.x-f.x,PL.z-f.z);
  if(E&&hunts&&pd<Math.hypot(E.x-f.x,E.z-f.z)-3){f.foe=null;f.st='chase';f.seen=0;return;}
  let best=null,bd=E?Math.hypot(E.x-f.x,E.z-f.z)-3:sr;if(hunts&&f.st==='chase'&&!E)bd=Math.min(bd,pd-3);if(foes.length>300)bd=Math.min(bd,40); // (in a crowd, a nearer foe only within 40: D-077)
  foeNear(f.x,f.z,bd,g=>{if(g===f||g===E||g.dead||g.show||g.wnd||g.cap||g.duel||g.msg)return;const d=Math.hypot(g.x-f.x,g.z-f.z);
    if(d>=bd||Math.abs(g.y-f.y)>14||far(g)||!foeEyeOn(f,g,sr+2))return;best=g;bd=d;},1-foeSd(f)); // (the other side's only)
  if(best){f.foe=best;f.eseen=0;if(!E)foeRally(f,best);else foeEngage(f);}
}
function foeEngage(g){if(g.rout||g.wnd)return;if(FOES[g.kind].civ){if(g.st!=='flee'){g.st='flee';g.t=4+Math.random()*3;}}else if(g.st!=='chase'){g.st='chase';g.seen=0;g.t=0;}}
function foeRally(f,E){
  const one=g=>{if(g.dead||g.foe&&g!==f)return;if(g!==f&&(g.grp!==f.grp||Math.hypot(g.x-f.x,g.z-f.z)>20||g.st==='chase'))return;
    g.foe=E;g.eseen=0;foeEngage(g);if(g!==f&&!FOES[g.kind].civ&&Math.random()<0.5)g.ct=Math.random()*0.6;};
  if(foes.length>200){one(f);foeNear(f.x,f.z,20,g=>{if(g!==f)one(g);},foeSd(f));}else for(const g of foes)one(g); // (in a crowd, those about it from the grid)
  foeCall(f,'alert');}
// a blow or a shot from the other side: less through a shield from the front, a push back; it turns on the one who struck
// unless it already fights; slain, it falls
function foeHurtFoe(g,n,by,ux,uz,kb,blow){
  if(g.dead)return;const G=FOES[g.kind];[n,kb]=warDmg(g,n,by,kb,blow); // the war's units (W3)
  if(blow&&G.block&&!(by&&by.kind&&FOES[by.kind].pierce)&&g.st!=='sleep'&&Math.abs(angTo(g.yaw,Math.atan2(by.x-g.x,by.z-g.z)))<1.05){n*=1-G.block;if(foeHear([g.x,g.y,g.z]))burst(0.12,'bandpass',2600,4,0.2,0,[g.x,g.y+1.2,g.z]);}
  g.hp-=n;g.hurt=1;g.kvx+=ux*kb*G.mass;g.kvz+=uz*kb*G.mass;if(blow&&G.mass>0.3)g.vy=Math.max(g.vy,2);
  for(let k=0;k<4;k++)spawnP(g.x,g.y+g.m.box[4]*0.6,g.z,(Math.random()-.5)*2,1+Math.random()*2,(Math.random()-.5)*2,isLord(g)?g.fc||[1,0.5,0.1]:[0.5,0.1,0.08],0.5,8);
  if(g.st==='sleep')g.st='idle';
  if(!g.foe&&g.st!=='chase'&&!g.rout&&!g.wnd&&!by.gone&&!by.dead){g.foe=by;g.eseen=0;foeRally(g,by);}else foeCall(g,'hurt');
  if(g.hp<=0&&!morWound(g,by))foeFalls(g,by);warCleave(g,n,by,ux,uz,blow); // (or lies wounded: W8b)
}
function foeFalls(g,by){const G=FOES[g.kind];elfLament(g);g.dead=0.001;g.st='dead';g.sp=0;g.atk=0;g.foe=null;g.wnd=0;g.rout=0;morDeath(g);if(g.lordOf)lordFalls(g);warHeroFell(g,by);
  if(G.boss&&!g.lordOf&&Math.hypot(g.x-PL.x,g.z-PL.z)<48){const n=FOES[by.kind].n.toLowerCase();toast('The '+G.n.toLowerCase()+' is slain by a'+(/^[aeiou]/.test(n)?'n ':' ')+n);}}
const foeTarget=()=>SURV()&&!dead&&playing; // in creative (and when dead or paused) foes take no notice of the player
function foeAlert(f){for(const g of foes){if(g.dead||g.st==='chase'||g.st==='flee'||g.foe)continue;if(g===f||(g.grp===f.grp&&Math.hypot(g.x-f.x,g.z-f.z)<20)){if(FOES[g.kind].civ){g.st='flee';g.t=4+Math.random()*3;continue;}g.st='chase';g.seen=0;g.t=0;if(g!==f&&Math.random()<0.5)g.ct=Math.random()*0.6;}}
  foeCall(f,'alert');}
function foeHome(f,r){for(let k=0;k<6;k++){const a=Math.random()*6.283,d=1+Math.random()*r,tx=f.hx+Math.sin(a)*d,tz=f.hz+Math.cos(a)*d,ty=foeStand(tx,f.y,tz,FOES[f.kind].tall||2);
  if(ty>0&&Math.abs(ty-f.y)<=2&&!foeWet(tx,ty,tz)){f.tx=tx;f.tz=tz;return true;}}return false;}
function stepFoe(f,dt){
  if(FOES[f.kind].fly){drakeStep(f,dt);return;} // a drake in the air (W8e)
  const F=FOES[f.kind],pdx=PL.x-f.x,pdz=PL.z-f.z,pdp=Math.hypot(pdx,pdz),pdy=PL.y-f.y,tg=foeTarget();
  f.hurt=Math.max(0,f.hurt-dt*3);f.atkT-=dt;f.shotT-=dt;f.whipT-=dt;f.detT-=dt;f.scanT-=dt;
  if(f.dead){f.dead+=dt;f.sp=0;return;}
  if(f.wnd){morWoundStep(f,dt);return;} // lying wounded (W8b)
  if(f.cap||f.rest){f.sp=0;f.atk=0;return;} // a captive, bound (W8d); one of the sick in the field hospital (D-084)
  if(f.hold){f.sp=f.holdSp||0;f.hd=f.yaw;if(f.holdAtk!==undefined)f.atk=f.holdAtk;return;}
  if(f.climb){warClimbStep(f,dt);return;} // up a ladder or the siege tower (W2)
  if(f.leap||f.breath>0){f.sp=0;return;} // an Emberlord on its wings, or breathing fire (W7a)
  if(f.volT&&foeClock>=f.volT){f.volT=0;const G=f.volG;f.volG=null;if(G&&!G.dead&&!G.gone&&!f.atk){f.foe=G;f.eseen=0;f.yaw=f.hd=Math.atan2(G.x-f.x,G.z-f.z);f.atk=0.45;f.atkK='shot';f.volley=1;f.shotT=FOES[f.kind].shot.cd;}} // a volley at the captain's horn (W1)
  f.t-=dt;
  // sight: noticed when near and in view (sleepers only close by); lost when long unseen or far
  f.losT-=dt;if(tg&&f.losT<=0&&pdp<F.sight*2.6+4){f.losT=0.35+Math.random()*0.15;f.vis=pdp<F.sight*2.6&&Math.abs(pdy)<14&&foeSees(f);}
  // a foe of the other side (D-063): the one it fights while it stands; a fresh look about every half second
  if(f.foe&&(f.foe.dead||f.foe.gone||f.foe.wnd)){f.foe=null;f.scanT=0;if(f.st==='chase'||f.st==='flee'){f.st='return';f.atk=0;f.t=0;}}
  if(f.scanT<=0){f.scanT=0.4+Math.random()*0.2;foeScan(f,F,tg);}
  const E=f.foe,dx=E?E.x-f.x:pdx,dz=E?E.z-f.z:pdz,dp=E?Math.hypot(dx,dz):pdp,dy=E?E.y-f.y:pdy,vis=E?f.eseen===0:f.vis,er=E?foeRad(E):0;
  if(!tg&&!E){if(f.st==='chase'||f.st==='flee'){f.st='return';f.atk=0;}}
  else if(f.st!=='chase'&&f.st!=='flee'){const rr=(f.st==='sleep'?Math.min(4,F.sight*0.3):F.sight)*(F.folk?1:cloakHide());if(tg&&f.vis&&pdp<rr&&(!F.folk||folkWrath(f)&&(!F.civ||pdp<14)))foeAlert(f);}
  else if(f.st==='chase'&&!E){f.seen=f.vis?0:f.seen+dt;if(f.seen>8||pdp>F.sight*2.5){f.st='return';f.atk=0;}}
  if(f.leash&&f.st==='chase'&&!E&&Math.hypot(PL.x-f.hx,PL.z-f.hz)>f.leash+12){f.st='return';f.atk=0;}
  if(F.folk&&f.st==='chase'&&!E&&!folkWrath(f)){f.st='return';f.atk=0;} // the realm's wrath has passed
  if(F.flee&&(tg||E)&&f.st==='chase'&&!f.fled&&f.hp<f.mhp*F.flee){f.st='flee';f.t=3+Math.random()*2;f.fled=true;foeCall(f,'hurt');}
  if(f.st==='flee'&&f.t<=0){if(!F.civ)f.st='chase';else if(E&&dp<16||tg&&folkWrath(f)&&pdp<16)f.t=3+Math.random()*2;else{f.st='return';f.t=0;f.foe=null;}}
  if(f.rout)f.st='flee'; // running from the fight (W8b)
  let want=0,face=false;
  switch(f.st){
    case 'sleep':break;
    case 'idle':if(f.camp){if(f.camp.t>foeClock&&!f.foe){if(f.camp.o)f.hd=Math.atan2(f.camp.o.x-f.x,f.camp.o.z-f.z);break;}f.camp=null;} // the camp's life: sitting, sparring (W8d)
      if(f.waitA){if(warGo(f)){f.st='return';f.t=0;f.hex=false;}else f.hd=f.waitA.A.face+(f.sf||0);break;} // in the ranks, waiting for the horns (D-067)
      if(f.back&&f.backT&&foeClock>f.backT){if(f.army&&!f.army.ret){f.army.ret=1;warHorn(f.army,'retreat');}f.way=f.back;f.back=null;f.st='return';f.t=0;f.hx=f.x;f.hz=f.z;break;} // a party marches back (D-067)
      if(F.folk&&pdp<4&&!folkWrath(f)){face=true;break;} // a passer-by: they stop and turn to them
      if(f.t<=0){if(f.road&&folkRoadStep(f)){f.st='walk';f.t=20;}else if(Math.random()<(F.folk&&!F.civ&&f.spot?0.3:0.5)&&foeHome(f,F.folk?(F.civ?7:4):6)){f.st='walk';f.t=10;}else f.t=1.5+Math.random()*3;}break;
    case 'walk':{const tdx=f.tx-f.x,tdz=f.tz-f.z,d=Math.hypot(tdx,tdz);if(d<0.6||f.t<=0){f.st='idle';f.t=f.road?0.2:1+Math.random()*3;}else if(F.folk&&pdp<3&&!folkWrath(f)){f.st='idle';f.t=2;}else{f.hd=Math.atan2(tdx,tdz);want=F.walk;}break;}
    case 'return':{const tdx=f.hx-f.x,tdz=f.hz-f.z,d=Math.hypot(tdx,tdz);
      // a party's or an army's next waypoint (D-067): a place in the ranks is reached exactly; a mark there waits for the horns
      if(f.war&&f.stuck>15&&pdp>24){const ty=foeStand(f.hx,f.y+3,f.hz,F.tall||2);if(ty>0&&Math.abs(ty-f.y)<6){f.x=f.hx;f.z=f.hz;f.y=f.gy=ty;f.stuck=0;}else{removeFoe(f);return;}} // a straggler stuck out of sight finds its way (D-067)
      if(f.t<-30&&d>=2.5&&f.wp&&(f.retry||0)<2){f.retry=(f.retry||0)+1;f.hx=f.wp[0]-OX;f.hz=f.wp[1]-OZ;f.t=Math.min(20,d/F.walk);} // a leg overrun: once more straight at the waypoint itself
      else if(d<(f.hex?1.1:2.5)||f.t<-30){if(f.waitA&&!warGo(f)){f.st='idle';f.t=1;}
        else if(f.way&&f.way.length){const w=f.way.shift();if(w.out)f.sneak=0;if(w.climb){f.climb=w.climb;f.waitA=null;}else if(w.A){f.waitA=w;f.st='idle';f.t=1;}else{f.waitA=null;warAim(f,w);f.wp=w;f.retry=0;f.rdS=0;f.rdN=0;f.t=Math.max(0,Math.hypot(f.hx-f.x,f.hz-f.z)/(f.pace||F.walk)-20);}} // a leg's time: some 30 s over its walk
        else{f.waitA=null;f.hex=false;f.st='idle';f.t=2;if(f.back&&!f.backT)f.backT=foeClock+(f.holdT||20)+Math.random()*25;}}else{f.hdW=Math.atan2(tdx,tdz);f.hd=f.hdW;if(f.rdT>0){f.rdT-=dt;f.hd+=f.rdA;}want=f.pace||F.walk*1.3;}break;}
    case 'flee':if(f.rout){if(f.stuck>0.5){f.rhd+=f.id%2?1:-1;f.stuck=0;}f.hd=f.rhd+Math.sin(foeClock*1.3+f.id)*0.25;want=F.run*0.95;break;} // (a rout: away from the other side, W8b)
      f.hd=Math.atan2(-dx,-dz)+Math.sin(foeClock*1.7+f.id)*0.4;want=F.run;break;
    case 'chase':{if(f.stagger>foeClock){f.atk=0;face=true;break;} // staggered by a parry or a bash (W8a)
      if(f.wheelT>foeClock){f.hd=f.wheelH;want=F.run;break;} // a horseman rides on through after the blow of its charge, then wheels (W8b)
      // against a creature its girth counts: the blow lands on its near side
      const toward=Math.atan2(dx,dz),S=F.shot,de=dp-er;face=true;if(F.lord)emberChoose(f,dp,vis,E); // its wings and fire (W7a)
      // ranged: shoot when in range and in view, keeping a distance; otherwise close in
      if(S&&vis&&dp>=S.lo&&dp<=warShotHi(F,S.hi)&&f.shotT<=0&&!f.atk){f.atk=0.45;f.atkK='shot';f.shotT=S.cd*(0.8+Math.random()*0.4);}
      if(F.whip&&vis&&dp>=F.whip.lo&&dp<=F.whip.hi&&f.whipT<=0&&!f.atk){f.atk=0.55;f.atkK='whip';f.whipT=F.whip.cd;}
      if(de<F.reach+0.2&&Math.abs(dy)<(F.dyr||2.4)&&f.atkT<=0&&!f.atk){f.atk=F.wind;f.atkK='blow';f.atkT=F.cd;}
      if(F.keep&&de<F.keep&&!f.atk){f.hd=toward+Math.PI+(f.id%2?0.5:-0.5);want=F.walk*1.2;}
      else if(F.keep&&S&&dp<=S.hi*0.8&&vis){f.hd=toward+(Math.floor(foeClock/3+f.id)%2?1.4:-1.4);want=F.walk*0.6;}
      else if(de>F.reach*0.8){f.hd=toward;want=de>6?F.run:F.walk*1.6;}
      if(f.lineHold&&f.lineHold.hold&&f.waitA&&(S||de>(f.lineHold.near||5)))want=0; // the line holds until the foe is upon it (W1)
      if(f.atk)want*=0.25;
      // a way round what blocks it
      if(f.det&&f.detT>0)f.hd+=f.det*1.1;break;}
  }
  // the blow, the shot or the lash lands at the end of its wind-up
  if(f.atk>0){f.atk-=dt;if(f.atk<=0){f.atk=0;foeStrike(f,F);}}
  // turn and move like the animals: steps of one block up, drops of up to three, never into water or lava
  const tall=F.tall||2,turn=F.mass<0.2?2.6:F.mass<0.5?4:6;
  if(face&&!want)f.hd=Math.atan2(dx,dz);
  const dh=angTo(f.yaw,f.hd);f.yaw+=Math.sign(dh)*Math.min(Math.abs(dh),turn*dt*(f.st==='chase'?1.5:1));
  if(Math.abs(dh)>1.3)want*=0.3;f.sp+=(want-f.sp)*Math.min(1,dt*6);if(f.sp<0.01)f.sp=0;
  const mx=Math.sin(f.yaw)*f.sp+f.kvx,mz=Math.cos(f.yaw)*f.sp+f.kvz;f.kvx*=Math.max(0,1-dt*5);f.kvz*=Math.max(0,1-dt*5);
  if(Math.abs(mx)+Math.abs(mz)>1e-4){const nx=f.x+mx*dt,nz=f.z+mz*dt,ml=Math.hypot(mx,mz),rr=Math.max(0.25,f.m.box[5]*0.8),fx=f.x+mx/ml*rr,fz=f.z+mz/ml*rr;
    const gn=foeStand(nx,f.y+0.05,nz,tall),gf=foeStand(fx,f.y+0.05,fz,tall),ok=!(f.leash&&Math.hypot(nx-f.hx,nz-f.hz)>f.leash)&&gn>0&&gf>0&&gn-f.y<=1.01&&gf-f.y<=1.01&&f.y-gn<=3&&f.y-gf<=3&&!foeWet(nx,gn,nz)&&!foeWet(fx,gf,fz);
    if(ok){f.x=nx;f.z=nz;f.gy=gn;f.stuck=0;f.rdB=0;}else{f.sp*=0.2;f.kvx=f.kvz=0;f.stuck=(f.stuck||0)+dt;if(f.st==='walk'){f.st='idle';f.t=0.5;}else if(f.st==='chase'&&f.detT<=0){f.det=Math.random()<0.5?1:-1;f.detT=0.9;}
      else if(f.st==='return'&&f.way){f.rdB=(f.rdB||0)+dt;if(!(f.rdT>0)||f.rdB>0.4){f.rdB=0;f.rdN=Math.min(3,(f.rdN||0)+1); // round what blocks a marching party: to the open side, wider each time it fails
        const W0=f.hdW!==undefined?f.hdW:f.yaw,A=[0.9,1.4,2][f.rdN-1],free=k=>foeStand(f.x+Math.sin(W0+k*A)*0.7,f.y+0.05,f.z+Math.cos(W0+k*A)*0.7,tall)>0&&foeStand(f.x+Math.sin(W0+k*A)*1.4,f.y+0.05,f.z+Math.cos(W0+k*A)*1.4,tall)>0;
        const pf=f.rdS||(f.id%2?1:-1);f.rdS=free(pf)?pf:free(-pf)?-pf:-pf;f.rdA=f.rdS*A;f.rdT=0.9;}}
      else if(f.st==='flee'||f.st==='return')f.hd=f.yaw+(f.id%2?1:-1)*(1.4+Math.random());}}
  const gy=foeStand(f.x,f.y+0.05,f.z,tall);if(gy>0)f.gy=gy;
  if(f.vy>0||f.y>f.gy+0.001){f.vy-=24*dt;f.y+=f.vy*dt;if(f.y<=f.gy){f.y=f.gy;f.vy=0;}}else if(f.y<f.gy)f.y=Math.min(f.gy,f.y+5*dt);
  // room from each other and the player
  const r1=foeRad(f)+0.1;
  if(pdp<r1+0.3&&pdp>0.01){f.kvx-=pdx/pdp*dt*14;f.kvz-=pdz/pdp*dt*14;}
  const gx=Math.floor(f.x/4)+8,gz=Math.floor(f.z/4)+8; // (those about it, from the grid of four-block cells: an army is many)
  const rm=r1+foeRadMax,mx4=f.x/4-Math.floor(f.x/4),mz4=f.z/4-Math.floor(f.z/4),i0=rm>=4||mx4*4<rm?-1:0,i1=rm>=4||mx4*4>4-rm?1:0,j0=rm>=4||mz4*4<rm?-1:0,j1=rm>=4||mz4*4>4-rm?1:0; // (only the cells within reach)
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const c=foeGrid.get((gx+i)*256+gz+j);if(c)for(const g of c){if(g===f||g.dead)continue;const ex=f.x-g.x,ez=f.z-g.z,e2=ex*ex+ez*ez,rr=r1+foeRad(g);if(e2<rr*rr&&e2>1e-4){const e=Math.sqrt(e2);f.kvx+=ex/e*(rr-e)*dt*6;f.kvz+=ez/e*(rr-e)*dt*6;}}}
  // the head turns to whom it faces when near; now and then a call
  if(dp<12&&f.st!=='sleep'){f.lkT=Math.max(-0.8,Math.min(0.8,angTo(f.yaw,Math.atan2(dx,dz))));}else f.lkT*=0.9;
  f.ct-=dt;if(f.ct<=0){f.ct=(f.st==='chase'?3:8)+Math.random()*10;if(pdp<36&&f.st!=='sleep')foeCall(f,f.st==='chase'?'alert':'idle');}
}
// a patrol's next stretch of road: twelve blocks on in the way it walks, turning back at the road's ends; its home moves with it
function folkRoadStep(f){const R=f.road,rd=R.rd;R.along+=R.dir*12;if(R.along<0||R.along>rd.len){R.dir=-R.dir;R.along=Math.max(0,Math.min(rd.len,R.along));}
  const q=R.along/(rd.len||1),tx=rd.a[0]+(rd.b[0]-rd.a[0])*q-OX+((f.id%3)-1)*1.2,tz=rd.a[1]+(rd.b[1]-rd.a[1])*q-OZ+((f.id%2)?0.8:-0.8),ty=foeStand(tx,f.y+2,tz,2);
  if(ty<0)return false;f.tx=tx;f.tz=tz;f.hx=tx;f.hz=tz;return true;}
// a blow, a shot or a lash, as its wind-up ends
function foeStrike(f,F){if(F.lord&&emberStrike(f,F))return; // an Emberlord's blows and powers (W7a)
  if(f.atkK==='spar'){const ax=f.x+Math.sin(f.yaw)*0.9,az=f.z+Math.cos(f.yaw)*0.9;if(f.smith){if(foeHear([ax,f.y,az]))tone(1100+Math.random()*200,900,0.15,0.06,0,'square',[ax,f.y+1,az]);for(let k=0;k<5;k++)spawnP(ax,f.y+0.9,az,(Math.random()-.5)*2,Math.random()*2,(Math.random()-.5)*2,[1,0.7,0.25],0.35,6);} // a smith's hammer on the anvil (D-084)
    else if(foeHear([f.x,f.y,f.z]))burst(0.1,'bandpass',2400,5,0.12,0,[f.x,f.y+1.3,f.z]);return;} // sparring in the camp: the clash, no harm (W8d)
  if(f.atkK==='pshot'){campArrow(f);return;} // an arrow loosed at the butts (D-084)
  const E=f.foe&&!f.foe.dead&&!f.foe.gone?f.foe:null;
  if(E){const dx=E.x-f.x,dz=E.z-f.z,dp=Math.hypot(dx,dz),dy=E.y-f.y,ux=dx/(dp||1),uz=dz/(dp||1);
    if(f.atkK==='blow'){foeCall(f,'blow');if(dp-foeRad(E)<F.reach+0.7&&Math.abs(dy)<(F.dyr||2.6))foeHurtFoe(E,F.dmg*(f.dmgK||1),f,ux,uz,F.mass<0.2?9:5,true);}
    else if(f.atkK==='whip'){burst(0.25,'highpass',2200,0.8,0.3,0,[f.x,f.y+2,f.z]);if(dp<F.whip.hi+1.2&&Math.abs(dy)<4){foeHurtFoe(E,F.whip.dmg,f,ux*0.6,uz*0.6,4);
      for(let k=0;k<10;k++){const q=k/10;spawnP(f.x+dx*q,f.y+2.2-q*1.2,f.z+dz*q,0,0.6,0,[1,0.5,0.1],0.4,0);}}}
    else if(f.atkK==='shot'){const S=F.shot;for(let k=0;k<(S.n||1);k++)foeShoot(f,S,f.volley?2.2+k:k);f.volley=0;}
    return;}
  const dx=PL.x-f.x,dz=PL.z-f.z,dp=Math.hypot(dx,dz),dy=PL.y-f.y,tg=foeTarget();
  if(f.atkK==='blow'){foeCall(f,'blow');if(tg&&dp<F.reach+0.7&&Math.abs(dy)<(F.dyr||2.6)){foeHurtPlayer(Math.round(F.dmg*(f.dmgK||1)),F.cause,dx/(dp||1),dz/(dp||1),F.mass<0.2?9:5,f);}}
  else if(f.atkK==='whip'){burst(0.25,'highpass',2200,0.8,0.3,0,[f.x,f.y+2,f.z]);if(tg&&dp<F.whip.hi+1.2&&Math.abs(dy)<4){foeHurtPlayer(F.whip.dmg,F.cause,-dx/(dp||1)*0.6,-dz/(dp||1)*0.6,4);
    for(let k=0;k<10;k++){const q=k/10;spawnP(f.x+dx*q,f.y+2.2-q*1.2,f.z+dz*q,0,0.6,0,[1,0.5,0.1],0.4,0);}}}
  else if(f.atkK==='shot'){const S=F.shot;for(let k=0;k<(S.n||1);k++)foeShoot(f,S,k);}
}
// a hit on the player: the blow, knocked back and up, less through armour
function foeHurtPlayer(n,cause,ux,uz,kb,by){if(!foeTarget())return;const G=armsGuard(n,ux,uz,by,cause);if(G.parry)return;n=G.n;kb*=G.kb; /* a shield's guard (W8a) */const before=hp;hurt(armourCut(n),cause);if(hp<before){PL.vx+=ux*kb;PL.vz+=uz*kb;PL.vy=Math.max(PL.vy,3.5);PL.ground=false;}}
// ---- Shots: arrows, sling stones, goblin fire, a troll's rock and an Emberlord's fire, flying by speed and weight
const SHOT_K={arrow:{g:9,sz:0.12,col:[0.42,0.32,0.22]},stone:{g:14,sz:0.14,col:[0.5,0.5,0.52]},fire:{g:0,sz:0.3,col:[1,0.55,0.12],glow:1},rock:{g:16,sz:0.55,col:[0.28,0.27,0.28]},hellfire:{g:0,sz:0.9,col:[1,0.5,0.1],glow:1}};
const shotGeo=new THREE.BoxGeometry(1,1,1);
function foeShoot(f,S,k){
  const K=SHOT_K[S.k],ex=f.x+Math.sin(f.yaw)*0.6,ey=f.y+f.m.box[4]*0.8,ez=f.z+Math.cos(f.yaw)*0.6,E=f.foe&&!f.foe.dead&&!f.foe.gone?f.foe:null;
  // lead the player (or the creature it fights) a little, and loft a heavy shot so it lands
  const tx=E?E.x:PL.x,ty=E?E.y+E.m.box[4]*0.55:PL.y+1.1,tz=E?E.z:PL.z,tvx=E?Math.sin(E.yaw)*E.sp:PL.vx,tvz=E?Math.cos(E.yaw)*E.sp:PL.vz;
  const d=Math.hypot(tx-ex,tz-ez),t=d/S.v,ax=tx+tvx*t*0.6+(k?(Math.random()-0.5)*k*2.5:0),az=tz+tvz*t*0.6+(k?(Math.random()-0.5)*k*2.5:0);
  const vx=(ax-ex)/t,vz=(az-ez)/t,vy=(ty-ey)/t+0.5*K.g*t;
  const mat=new THREE.MeshBasicMaterial({color:new THREE.Color(K.col[0],K.col[1],K.col[2]),transparent:!!K.glow,opacity:K.glow?0.92:1}),m=new THREE.Mesh(shotGeo,mat);
  m.scale.x=m.scale.y=m.scale.z=K.sz;if(S.k==='arrow'){m.scale.z=0.9;m.scale.x=m.scale.y=0.07;}else if(S.k==='bolt'){m.scale.z=0.6;m.scale.x=m.scale.y=0.1;}else if(S.k==='jav'){m.scale.z=1.7;m.scale.x=m.scale.y=0.08;}else if(S.k==='axe'){m.scale.set(0.08,0.4,0.3);}m.frustumCulled=false;scene.add(m);
  shots.push({x:ex,y:ey,z:ez,vx:vx,vy:vy,vz:vz,k:S.k,dmg:S.dmg,from:f,side:foeSide(f),atP:!FOES[f.kind].folk||folkWrath(f),cause:S.k==='stone'?'stone':S.k==='rock'?'rock':S.k==='arrow'?'arrow':FOES[f.kind].cause,life:4,m:m});
  warShotK(f,S,shots[shots.length-1]); // fire arrows at night, the rain on fire (W8e)
  if(foeHear([ex,ey,ez])){if(S.k==='fire'||S.k==='hellfire')burst(0.5,'lowpass',S.k==='fire'?500:220,0.8,S.k==='fire'?0.25:0.4,0,[ex,ey,ez]);else if(S.k==='arrow')burst(0.12,'bandpass',1800,2,0.2,0,[ex,ey,ez]);else burst(0.18,'lowpass',300,1,0.25,0,[ex,ey,ez]);}
}
function updShots(dt){
  for(let i=shots.length-1;i>=0;i--){const s=shots[i],K=SHOT_K[s.k];s.life-=dt;let gone=s.life<=0,id=0;
    const n=Math.max(1,Math.ceil(Math.hypot(s.vx,s.vy,s.vz)*dt/0.45)),h=dt/n; // (in steps of under half a block, so that a fast shot passes nothing by: W8a)
    let C=null;if(foes.length>64&&n>1){C=[];const L=Math.hypot(s.vx,s.vz)*dt;foeNear(s.x+s.vx*dt/2,s.z+s.vz*dt/2,L/2+foeRadMax+K.sz,g=>C.push(g),s.byP?undefined:s.side?0:1);} // (those along its way this frame, gathered once for all its steps)
    for(let st=0;st<n&&!gone;st++){s.vy-=K.g*h;s.x+=s.vx*h;s.y+=s.vy*h;s.z+=s.vz*h;id=get(Math.floor(s.x),Math.floor(s.y),Math.floor(s.z));
    if(SOLID[id]){gone=true;break;}
    if(s.atP&&s.x>PL.x-HW-K.sz&&s.x<PL.x+HW+K.sz&&s.z>PL.z-HW-K.sz&&s.z<PL.z+HW+K.sz&&s.y>PL.y-K.sz&&s.y<PL.y+PH+K.sz){
      const v=Math.hypot(s.vx,s.vz)||1;foeHurtPlayer(s.dmg,s.cause,s.vx/v,s.vz/v,s.k==='rock'?7:2,s);gone=true;break;}
    // a shot strikes a creature of the other side (D-063); it passes its own
    {let hit=null;const one=g=>{if(hit||g.dead||g.wnd||g.cap||!s.byP&&g.duel&&s.from!==g.duel||(s.byP?g.show||s.hitL.includes(g):foeSide(g)===s.side))return;const r=foeRad(g)+K.sz;if(Math.abs(s.x-g.x)<r&&Math.abs(s.z-g.z)<r&&s.y>g.y-K.sz&&s.y<g.y+g.m.box[4]+K.sz)hit=g;};
      if(C)for(const g of C)one(g);else if(foes.length>64)foeNear(s.x,s.z,foeRadMax+K.sz,one,s.byP?undefined:s.side?0:1);else for(const g of foes)one(g); // (in a crowd, those about it from the grid)
      if(hit&&s.byP){armsHit(hit,s);if(s.pierce>0){s.pierce--;s.hitL.push(hit);}else gone=true;} // the player's shot (W8a)
      else if(hit){const v=Math.hypot(s.vx,s.vz)||1;foeHurtFoe(hit,s.dmg,s.from,s.vx/v,s.vz/v,s.k==='rock'?7:2);gone=true;}
      if(!gone&&s.byP&&armsAnimal(s))gone=true;}}
    if(s.fireA&&Math.random()<0.6)spawnP(s.x,s.y,s.z,0,0.2,0,[1,0.55,0.15],0.3,-0.3); // a fire arrow (W8e)
    if((s.k==='fire'||s.k==='hellfire')&&Math.random()<(s.k==='fire'?0.6:1))spawnP(s.x,s.y,s.z,(Math.random()-.5)*0.5,0.3,(Math.random()-.5)*0.5,[1,0.45+Math.random()*0.3,0.1],0.35,-0.5);
    if(gone){if(s.k==='fire'||s.k==='hellfire')for(let k=0;k<(s.k==='fire'?8:24);k++)spawnP(s.x,s.y,s.z,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,[1,0.5,0.1],0.5,4);
      else if(s.k==='rock')for(let k=0;k<6;k++)spawnP(s.x,s.y,s.z,(Math.random()-.5)*3,Math.random()*3,(Math.random()-.5)*3,[0.3,0.3,0.3],0.6,14);
      if(s.k==='pot'){for(let k=0;k<14;k++)spawnP(s.x,s.y+0.4,s.z,(Math.random()-.5)*4,Math.random()*3,(Math.random()-.5)*4,[1,0.5+Math.random()*0.3,0.1],0.6,3);burst(0.5,'lowpass',380,1,0.35,0,[s.x,s.y,s.z]);warSplash(s.x,s.y,s.z,!FOES[s.from.kind].folk);} // a fire pot bursts (W3)
      if(SOLID[id]&&(s.k==='arrow'||s.k==='bolt'||s.k==='jav'))armsStick(s);else{scene.remove(s.m);s.m.material.dispose();}shots.splice(i,1);continue;} // (spent arrows stick a while, W8a)
    s.m.position.x=s.x;s.m.position.y=s.y;s.m.position.z=s.z;s.m.rotation.y=Math.atan2(s.vx,s.vz);s.m.rotation.x=K.spin?s.life*14:-Math.atan2(s.vy,Math.hypot(s.vx,s.vz));}
}
// ---- The parts in motion: legs and arms in step, a wind-up and a blow, a bow drawn, a sling whirled, wings that beat,
// a whip that trails, a fall when slain
function placeFoe(f,dt){
  const F=FOES[f.kind],M=f.m,P=M.parts,root=M.root,rest=g=>g.userData.rest,sp=f.sp,big=F.mass<0.2;
  const ph0=f.ph;f.ph+=sp*dt/(F.stride||(big?1.6:F.walk>1.4?0.9:1.1))*6.2832;
  if(F.stride&&F.tall>5&&Math.floor(f.ph/Math.PI)!==Math.floor(ph0/Math.PI)&&sp>0.3){const d=Math.hypot(f.x-PL.x,f.z-PL.z);if(d<48){burst(0.5,'lowpass',90,0.8,0.4*(1-d/48),0,[f.x,f.y,f.z]);shake=Math.max(shake,0.35*(1-d/48));}} // its footfalls shake the ground
  f.amp+=((sp>0.05?Math.min(1,0.45+sp/F.run*0.8):0)-f.amp)*Math.min(1,dt*6);
  f.lk+=(f.lkT-f.lk)*Math.min(1,dt*4);
  const amp=f.amp*(big?0.5:0.8),s1=Math.sin(f.ph),w=F.wind||0.4,prog=f.atk>0?1-f.atk/(f.atkK==='shot'?0.45:f.atkK==='whip'?0.55:w):0;
  const far=f.far;if(!far){ // (seen from afar its limbs are not drawn: D-077)
  if(P.legL){P.legL.rotation.x=rest(P.legL)[0]+s1*amp;P.legR.rotation.x=rest(P.legR)[0]-s1*amp;}
  if(P.armL){P.armL.rotation.x=rest(P.armL)[0]-s1*amp*0.8;P.armR.rotation.x=rest(P.armR)[0]+s1*amp*0.8;P.armL.rotation.z=rest(P.armL)[2];P.armR.rotation.z=rest(P.armR)[2];}
  // the attack: the right arm (or both, for a shot or a lash) raised through the wind-up, then brought down at once
  if(f.atk>0&&P.armR){const up=Math.min(1,prog*1.4);
    if(f.atkK==='blow'||f.atkK==='spar'){P.armR.rotation.x=rest(P.armR)[0]-2.6*up;if(big)P.armL.rotation.x=rest(P.armL)[0]-1.4*up;}
    else if(f.atkK==='shot'||f.atkK==='pshot'){if(F.shot&&F.shot.k==='arrow'){P.armL.rotation.x=-1.5;P.armR.rotation.x=-1.5;P.armR.rotation.z=0.6*up;}else{P.armR.rotation.x=rest(P.armR)[0]-2.8*up;}}
    else if(f.atkK==='whip'){P.armL.rotation.x=-1.2*up;P.armL.rotation.z=0.9*up;}}
  else if(f.swing>0&&P.armR){f.swing=Math.max(0,f.swing-dt*5);P.armR.rotation.x=rest(P.armR)[0]+0.7*f.swing;} // the follow-through
  if(P.legFL&&!F.mount){const a=f.amp*0.9;P.legFL.rotation.x=P.legBR.rotation.x=s1*a;P.legFR.rotation.x=P.legBL.rotation.x=-s1*a;if(P.head)P.head.rotation.x=f.atk>0?-0.6*Math.min(1,prog*1.4):0;}} // a hound's gait and its bite (W8b)
  if(f.st==='sleep'&&P.body){root.rotation.x+=(-1.45-root.rotation.x)*Math.min(1,dt*2);root.position.y=0.25;}
  else if(f.stagger>foeClock&&!f.dead){root.rotation.x+=(-0.32-root.rotation.x)*Math.min(1,dt*10);} // staggered (W8a)
  else if(f.cap&&!f.dead){root.rotation.x=0.2;root.position.y=-0.45;if(P.armL&&!far){P.armL.rotation.x=P.armR.rotation.x=0.6;}} // a captive on its knees, its hands bound behind it (W8d)
  else if(f.camp&&f.camp.k==='sit'&&!f.dead&&P.legL&&!F.mount){root.position.y=-0.6;if(!far){P.legL.rotation.x=P.legR.rotation.x=-1.4;}} // sitting by the fire (W8d)
  else if(F.fly&&!f.dead){root.rotation.x=f.dpitch||0;root.rotation.z=f.bank||0;} // a drake's pitch and bank (W8e)
  else if((f.wnd||f.rest)&&!f.dead){root.rotation.x+=(1.25-root.rotation.x)*Math.min(1,dt*4);root.position.y=0.3;if(P.armR&&!far)P.armR.rotation.x=-2.3+Math.sin(foeClock*2+f.id)*0.4;} // lying wounded on its back, an arm raised for help (W8b)
  else if(!f.dead){root.rotation.x*=1-Math.min(1,dt*6);root.position.y=0;}
  if(!far){if(P.head){P.head.rotation.y=f.lk*0.7;}
  if(P.wingL){const b=Math.sin(foeClock*(f.st==='chase'?3.2:1.4))*0.25;P.wingL.rotation.y=rest(P.wingL)[1]+b;P.wingR.rotation.y=rest(P.wingR)[1]-b;}
  if(P.whip1){const k=f.atkK==='whip'&&f.atk>0?prog:0,wv=Math.sin(foeClock*4+f.id)*0.25;P.whip1.rotation.x=rest(P.whip1)[0]-k*1.4+wv;P.whip2.rotation.x=rest(P.whip2)[0]+wv*1.2;P.whip3.rotation.x=rest(P.whip3)[0]+wv*1.5;}
  if(P.tail)P.tail.rotation.y=Math.sin(foeClock*1.3+f.id)*0.3;
  if(F.fly&&P.wingL2){const k=f.dead?0:Math.sin(foeClock*(f.st==='dive'?2.5:5.5)+f.id),r=g=>g.userData.rest[2];P.wingL.rotation.z=r(P.wingL)+k*0.6;P.wingR.rotation.z=r(P.wingR)-k*0.6;P.wingL2.rotation.z=r(P.wingL2)+k*0.4;P.wingR2.rotation.z=r(P.wingR2)-k*0.4;} // its wings beat (W8e)
  if(P.flag)P.flag.rotation.y=Math.sin(foeClock*2.1+f.id)*0.25;if(P.load)P.load.visible=!!f.carry; // a bearer's burden (W3)
  if(P.sling&&f.atkK==='shot'&&f.atk>0)P.sling.rotation.y=foeClock*20;}
  if(f.dead){const q=Math.min(1,f.dead/0.4);root.rotation.x=-q*1.5708;root.position.y=q*0.25-Math.max(0,f.dead-(f.war||f.hst?WAR_LIE-1:1.6))*0.6;}
  else if(far){}
  else if(f.atkK==='heave'&&f.atk>0&&P.armL){const k=Math.min(1,prog*1.6);P.armL.rotation.x=P.armR.rotation.x=-1.5+0.5*k;} // the ram's crew heave (W2)
  else if(f.climb&&!f.climb.ph&&P.armL){const k=Math.sin(foeClock*8+f.id);P.armL.rotation.x=-2.6+k*0.4;P.armR.rotation.x=-2.6-k*0.4;if(P.legL){P.legL.rotation.x=-0.4+k*0.5;P.legR.rotation.x=-0.4-k*0.5;}}
  else if(F.drum&&!f.atk&&P.armL){const k=Math.sin(foeClock*9+f.id);P.armL.rotation.x=-0.9+k*0.5;P.armR.rotation.x=-0.9-k*0.5;} // the drummer beats (W3)
  else if(f.bow>foeClock&&!f.atk&&!f.foe&&P.body){const k=Math.min(1,(f.bow-foeClock)*1.2,(2-(f.bow-foeClock))*3);P.body.rotation.x=0.55*Math.max(0,k);if(P.armR)P.armR.rotation.x=-0.6*Math.max(0,k);} // a bow (D-088)
  else if(f.cheer>foeClock&&!f.atk&&!f.foe&&P.armL){const k=Math.abs(Math.sin(foeClock*3+f.id));P.armL.rotation.x=-2.7-0.3*k;P.armR.rotation.x=-2.5-0.4*k;root.position.y=Math.max(0,Math.sin(foeClock*5+f.id))*0.15;}
  if(F.lord&&!f.dead&&f.st!=='sleep')emberPose(f,P,root,prog);
  if(F.mount&&!f.dead&&!far)riderPose(f,P,amp);
  if(F.mount&&!f.dead&&Math.floor(f.ph/Math.PI)!==Math.floor(ph0/Math.PI)&&sp>0.5){const d=Math.hypot(f.x-PL.x,f.z-PL.z);if(d<40&&AX&&settings.sound&&foeHear([f.x,f.y,f.z]))burst(0.06,'bandpass',sp>3?520:760,3,0.22*(1-d/40),0,[f.x,f.y,f.z]);} // hoofbeats
  if(!far){M.grp.position.set(f.x,f.y,f.z);M.grp.rotation.y=f.yaw;}
  const lod=!F.lord&&(Math.hypot(f.x-PL.x,f.z-PL.z)>(f.far?foeLodR*0.9:foeLodR)||f.dead>1&&(f.war||f.hst));if(lod!==!!f.far)foeLod(f,lod); // (the war's fallen, lying, as one)
  // light where it stands (eased), the struck flash; the shadow
  f.lt-=dt;if(f.lt<=0){f.lt=0.25;const lx=Math.floor(f.x),ly=Math.floor(f.y+Math.max(0.5,M.box[4]*0.5)),lz=Math.floor(f.z);f.eLT=sky(lx,ly,lz);f.eBT=bl(lx,ly,lz);if(!dt){f.eL=f.eLT;f.eB=f.eBT;}}
  if(f.eLT!==undefined){f.eL+=(f.eLT-f.eL)*Math.min(1,dt*4);f.eB+=(f.eBT-f.eB)*Math.min(1,dt*4);}
  if(!f.far){const u=M.mat.uniforms;u.eL.value=f.eL;u.eB.value=f.lordOf?Math.max(f.eB,0.55):f.eB;u.hurt.value=f.hurt;}
  const sh=M.shadow,b=M.box,dist=Math.hypot(f.x-PL.x,f.z-PL.z),vis=dist<U.fogFar.value+10;
  if(!f.far){sh.position.set(f.x,f.gy+0.02,f.z);sh.rotation.y=f.yaw;sh.scale.set((b[3]-b[0])*1.2,1,(b[5]-b[2])*1.1);
    sh.material.opacity=f.dead>1?0:0.4*Math.max(0,1-(f.y-f.gy)/2)*Math.max(0,1-dist/Math.max(20,U.fogFar.value))*Math.min(1,f.eL*1.3+f.eB);}
  M.grp.visible=vis;sh.visible=vis&&!f.far&&sh.material.opacity>0.01;if(f.far&&vis)crowdPut(f,M,root); // (afar, one of a crowd: D-077)
  // an Emberlord sheds embers
  if(F.lord&&vis&&!f.dead&&Math.random()<dt*14)spawnP(f.x+(Math.random()-.5)*2,f.y+1+Math.random()*4,f.z+(Math.random()-.5)*2,(Math.random()-.5)*0.6,0.8+Math.random(),(Math.random()-.5)*0.6,[1,0.4+Math.random()*0.3,0.08],1.2,-0.4);
}
// Seen from afar (D-067): beyond 34 blocks a foe or one of the folk is drawn as one mesh, its parts baked at rest (`amMerged`),
// and its parts leave the scene (so their matrices are not worked out each frame); within 30 it is drawn whole again. Since D-077
// those afar are instances of their kind's merged model (`crowdPut`, engine/crowd.js), and in a crowd only the nearest
// `FOE_WHOLE` are drawn whole (`foeLodR`, worked out twice a second in updFoes)
const FOE_WHOLE=40;let foeLodR=34,foeLodT=0;
function foeLod(f,far){const M=f.m;f.far=far;if(far)scene.remove(M.grp);else{M.grp.position.set(f.x,f.y,f.z);M.grp.rotation.y=f.yaw;scene.add(M.grp);}}
// A horseman's gait (D-061): at a walk the horse's legs move in diagonal pairs, at the gallop the forelegs reach together and the
// hind legs drive under, its body rocking and its neck nodding; the rider rises with each stride, the shield arm and the rein
// hand steady, the spear arm still but for its blow
function riderPose(f,P,amp){
  const rest=g=>g.userData.rest[0],ph=f.ph,s=Math.sin(ph),gal=f.sp>3.2,a=Math.min(1,amp*1.4);
  if(gal){P.legFL.rotation.x=Math.sin(ph)*0.95*a;P.legFR.rotation.x=Math.sin(ph-0.45)*0.95*a;P.legBL.rotation.x=Math.sin(ph+Math.PI)*0.85*a;P.legBR.rotation.x=Math.sin(ph+Math.PI-0.45)*0.85*a;}
  else{P.legFL.rotation.x=s*0.55*a;P.legBR.rotation.x=s*0.5*a;P.legFR.rotation.x=-s*0.55*a;P.legBL.rotation.x=-s*0.5*a;}
  P.hbody.rotation.x=gal?Math.cos(ph)*0.07*a:0;P.neck.rotation.x=rest(P.neck)+(gal?Math.sin(ph+0.6)*0.14:Math.sin(ph*2)*0.04)*a;
  P.body.position.y=(11.5+Math.abs(Math.sin(ph))*(gal?1.1:0.4)*a)*AM_PX;P.body.rotation.x=gal?-0.12*a:0;
  P.armL.rotation.x=rest(P.armL);P.armL.rotation.z=P.armL.userData.rest[2];if(!(f.atk>0)&&!(f.swing>0))P.armR.rotation.x=rest(P.armR);}
// The Emberlord's gait (D-055): hunched and heavy, its body rolling over each stride and dipping as a foot comes down, the shins
// folding under it on the back swing, arms swaying low, the head thrust forward and bobbing; the wings beat slowly (harder in the
// chase, flung wide as it strikes), the outer wing lagging the inner; its flames, whip and tail never rest.
function emberPose(f,P,root,prog){
  const rest=g=>g.userData.rest[0],ph=f.ph,s=Math.sin(ph),c=Math.cos(ph),a=Math.min(1,f.amp*1.6),t=foeClock+f.id*1.7,chase=f.st==='chase',up=f.atk>0?Math.min(1,prog*1.4):0;
  P.legL.rotation.x=rest(P.legL)+s*0.42*a;P.legR.rotation.x=rest(P.legR)-s*0.42*a;
  P.shinL.rotation.x=rest(P.shinL)+Math.max(0,c)*0.7*a;P.shinR.rotation.x=rest(P.shinR)+Math.max(0,-c)*0.7*a;
  P.footL.rotation.x=rest(P.footL)-Math.max(0,c)*0.35*a+Math.max(0,-s)*0.2*a;P.footR.rotation.x=rest(P.footR)-Math.max(0,-c)*0.35*a+Math.max(0,s)*0.2*a;
  root.position.y=-Math.abs(s)*0.4*a;const br=Math.sin(t*0.8);
  P.body.rotation.z=s*0.08*a;P.body.rotation.x=rest(P.body)+Math.abs(c)*0.06*a+br*0.02;P.chest.rotation.y=-s*0.14*a;P.chest.rotation.x=rest(P.chest)+br*0.035;
  P.head.rotation.x=rest(P.head)-Math.abs(c)*0.06*a-br*0.02-(f.breath>0?0.25:0);P.head.rotation.y=f.lk*0.7;P.jaw.rotation.x=rest(P.jaw)+(chase?0.15:0)+Math.max(0,Math.sin(t*0.6))*0.12+up*0.25+(f.breath>0?0.55:0);
  P.armL.rotation.x=rest(P.armL)-s*0.3*a;P.armR.rotation.x=rest(P.armR)+s*0.3*a;P.armL.rotation.z=P.armL.userData.rest[2];P.armR.rotation.z=P.armR.userData.rest[2];
  P.foreL.rotation.x=rest(P.foreL)-Math.max(0,s)*0.25*a;P.foreR.rotation.x=rest(P.foreR)-Math.max(0,-s)*0.25*a;
  // its blows: the blade raised high over the shoulder through the wind-up, brought down; the whip drawn back and cracked
  if(f.atk>0){if(f.atkK==='blow'||f.atkK==='shot'){P.armR.rotation.x=rest(P.armR)-2.5*up;P.foreR.rotation.x=rest(P.foreR)+0.5*up;P.chest.rotation.y+=0.35*up;}
    else if(f.atkK==='whip'){P.armL.rotation.x=rest(P.armL)-2*up;P.armL.rotation.z=P.armL.userData.rest[2]-0.7*up;P.foreL.rotation.x=rest(P.foreL)+0.4*up;P.chest.rotation.y-=0.3*up;}}
  else if(f.swing>0){P.armR.rotation.x=rest(P.armR)+0.6*f.swing;P.foreR.rotation.x=rest(P.foreR)-0.3*f.swing;}
  if(f.tear>0){const k=Math.min(1,f.tear)*(0.8+0.2*Math.sin(t*9));P.armL.rotation.x=rest(P.armL)-2.7*k;P.armR.rotation.x=rest(P.armR)-2.7*k;P.chest.rotation.x=rest(P.chest)-0.3*k;} // tearing at the mountain (W7a)
  const rate=f.leap?3.2:chase?2.1:0.85,bt=Math.sin(t*rate),bt2=Math.sin(t*rate-0.9),fl=f.leap?1:f.atk>0?up:0,amp1=f.leap?0.5:chase||(f.ph3||1)>=2?0.3:0.13;
  for(const [w,w2,k] of [[P.wingL,P.wingL2,1],[P.wingR,P.wingR2,-1]]){const r=w.userData.rest,r2=w2.userData.rest;
    w.rotation.z=r[2]-k*(amp1*bt+0.25*fl);w.rotation.y=r[1]-k*(0.08*bt-0.3*fl);w.rotation.x=r[0]+0.05*bt;w2.rotation.z=r2[2]-k*(amp1*1.3*bt2+0.2*fl);w2.rotation.y=r2[1]-k*0.12*bt2;}
  const fk=1+0.13*Math.sin(t*9.3)+0.07*Math.sin(t*23.7);P.maneA.scale.y=fk;P.maneB.scale.y=2-fk;P.crest.scale.y=1+0.15*Math.sin(t*11.1+1);
  const wk=f.atkK==='whip'&&f.atk>0?up:0,lash=f.atkK==='whip'&&f.atk<=0&&f.swing>0?f.swing:0;
  P.whip1.rotation.x=rest(P.whip1)+0.18*Math.sin(t*1.9)-1.6*wk+0.8*lash;P.whip2.rotation.x=rest(P.whip2)+0.28*Math.sin(t*1.9-0.8)-0.6*wk+0.7*lash;
  P.whip3.rotation.x=rest(P.whip3)+0.35*Math.sin(t*1.9-1.6)+0.5*wk;P.whip4.rotation.x=rest(P.whip4)+0.4*Math.sin(t*1.9-2.4)+0.6*wk;P.whip2.rotation.y=0.2*Math.sin(t*1.3);
  P.tail.rotation.y=0.35*Math.sin(t*1.1);P.tail2.rotation.y=0.45*Math.sin(t*1.1-0.8);P.tail.rotation.x=rest(P.tail)+0.08*Math.sin(t*0.7);
}
function updFoes(dt){
  if(!ready)return;foeClock+=dt;foeHitCD=Math.max(0,foeHitCD-dt);updShots(dt);
  for(const [k,t] of realmWrath){if(t-dt<=0)realmWrath.delete(k);else realmWrath.set(k,t-dt);}folkGreetT-=dt;folkGreet();elfFrame(dt);menFrame(dt);riderFrame(dt);dwarfFrame(dt);
  foeT-=dt;if(foeT<=0){foeT=1;if(playing)foeSpawnTick();warHeroSeen();for(const f of foes)if(!f.dead&&Math.hypot(f.x-PL.x,f.z-PL.z)<16)discover(FOES[f.kind].folk?'p':'f',FOES[f.kind].n);}
  warSoundTick(dt);warWorksFrame(dt);warNightFrame(dt);warUnitsFrame(dt);emberFrame(dt);hostFrame(dt);morFrame(dt);fieldFrame(dt);campFrame(dt); // the din of the fighting and the battle music (W1); the works of the war (W2); its units at work (W3)
  foeFrame++;foeGrid.clear();foeGridS[0].clear();foeGridS[1].clear();foeRadMax=1;
  for(const g of foes){if(g.dead)continue;const k=(Math.floor(g.x/4)+8)*256+Math.floor(g.z/4)+8;let c=foeGrid.get(k);if(!c)foeGrid.set(k,c=[]);c.push(g);const S=foeGridS[foeSd(g)];let e=S.get(k);if(!e)S.set(k,e=[]);e.push(g);if(!FOES[g.kind].fly)foeRadMax=Math.max(foeRadMax,foeRad(g));}
  foeDin=Math.min(18,foeDin+dt*12);
  if((foeLodT-=dt)<=0){foeLodT=0.5;foeLodR=34;const ds=[];for(const f of foes)if(!f.dead&&!FOES[f.kind].lord){const d=Math.hypot(f.x-PL.x,f.z-PL.z);if(d<34)ds.push(d);}
    if(ds.length>FOE_WHOLE){ds.sort((a,b)=>a-b);foeLodR=Math.max(6,ds[FOE_WHOLE]);}} // (in a crowd, the nearest FOE_WHOLE whole: D-077)
  for(let i=foes.length-1;i>=0;i--){const f=foes[i];
    if(f.dead&&f.war&&!f.cntW){f.cntW=1;warFallen(f);} // the war's fallen lie a while (W2)
    if(f.dead&&f.spot&&!f.cntS){f.cntS=1;warSpotFell(f);} // a place of the wastes stormed (W5)
    if(f.dead>(f.war||f.hst?WAR_LIE:2.6)){removeFoe(f);continue;}
    if(f.x<0||f.z<0||f.x>=W||f.z>=D||!f.hst&&Math.hypot(f.x-PL.x,f.z-PL.z)>(FOES[f.kind].folk?(f.spot?72:96):f.spot?130:96)){removeFoe(f);continue;} // (a summoned host is kept while in the loaded world: D-077)
    if(foes.length>300&&f.far&&!f.dead&&!f.climb&&!f.lordOf){const k=!f.foe&&(f.st==='idle'||f.st==='sleep')&&f.sp<0.01?4:2;f.idt=(f.idt||0)+dt;if((foeFrame+f.id)%k){placeFoe(f,0);continue;}stepFoe(f,f.idt);f.idt=0;} // (in a crowd, those afar every other frame, those standing every fourth: D-077)
    else{f.idt=0;stepFoe(f,dt);}if(!f.gone)placeFoe(f,dt);}
  crowdFrame();
}
// ---- Calls: each kind's own (synthesized like every sound in the game), from where it stands
// a battle's din (D-067): of the calls, blows and shots of many, some eighteen a second are heard, the near ones always, none beyond 64
let foeDin=18;
function foeHear(at){const d=Math.hypot(at[0]-PL.x,at[2]-PL.z);if(d>64)return false;if(d<10)return true;if(foeDin<1)return false;foeDin--;return true;}
function foeCall(f,what){
  if(!AX||!settings.sound)return;const at=[f.x,f.y+f.m.box[4]*0.85,f.z],k=f.kind,p=what==='hurt'?1.2:what==='alert'?1.1:1;if(!foeHear(at))return;
  if(k[0]==='g'){if(what==='alert'||what==='hurt')for(let i=0;i<3;i++)voice(700*p+Math.random()*200,900*p,0.12,0.07,{type:'square',form:1400,q:2,delay:i*0.11},at);
    else for(let i=0;i<2;i++)voice(520+Math.random()*160,640,0.14,0.05,{form:1100,q:2,delay:i*0.18,vib:14,vd:0.1},at);}
  else if(k==='troll'||k==='strollr'){voice(110*p,70,what==='alert'?1.2:0.7,0.12,{form:240,q:1.2,vib:4,vd:0.06},at);if(what==='blow')burst(0.4,'lowpass',160,0.8,0.3,0.1,at);}
  else if(k==='wolfrid'){if(what==='alert'){tone(260,480,0.5,0.06,0,'triangle',at);tone(480,440,0.9,0.06,0.5,'triangle',at);tone(440,240,0.6,0.05,1.4,'triangle',at);for(let i=0;i<3;i++)voice(700+Math.random()*200,900,0.1,0.05,{type:'square',form:1400,q:2,delay:0.3+i*0.12},at);} // the warg howls, its rider whoops
    else{burst(0.4,'bandpass',300,2,0.12,0,at);voice(110*p,90,0.4,0.06,{form:400,q:1.5,vib:24,vd:0.15},at);}} // a snarl (W3)
  else if(k==='wbeast'){voice(80*p,60,0.8,0.14,{form:260,q:1,vib:9,vd:0.1},at);if(what!=='idle')voice(400*p,250,0.6,0.08,{form:1200,q:2,vib:20,vd:0.08,delay:0.3},at);} // the war beast grunts and squeals (W3)
  else if(FOES[k].fly){voice(1000*p,480,0.7,0.06,{type:'sawtooth',form:1800,q:2,vib:14,vd:0.1},at);return;} // a drake's cry (W8e)
  else if(FOES[k].hound){if(what==='alert'||what==='blow')for(let i=0;i<2;i++)voice(560*p,380*p,0.12,0.1,{form:900,q:1.4,delay:i*0.22},at);else if(what==='hurt')voice(900,1200,0.4,0.06,{type:'sine',form:1200,q:1},at);else voice(420,330,0.15,0.05,{form:800,q:1.4},at);return;} // the war hounds bark and yelp (W8b)
  else if(FOES[k].folk){const fem=k==='rwoman'||FOES[k].fem;if(FOES[k].civ){if(what==='alert'||what==='hurt')voice((fem?520:330)*p,(fem?680:430),0.35,0.08,{form:1200,q:1.6,vib:8,vd:0.06},at);else voice((fem?300:190)+Math.random()*30,(fem?330:210),0.4,0.035,{form:900,q:1.2},at);}
    else{if(what==='alert'&&k[0]==='d'&&(k==='dcapt'||Math.random()<0.35)){tone(110,110,1.3,0.08,0,'sawtooth',at);tone(147,147,1.8,0.07,1.1,'triangle',at);} // the dwarves' horn, two deep notes
      else if(what==='alert'&&k[0]==='w'&&(k==='wcapt'||Math.random()<0.35)){tone(330,330,0.6,0.07,0,'triangle',at);tone(392,392,0.6,0.07,0.5,'triangle',at);tone(494,494,1.2,0.07,1,'triangle',at);} // the wood elves' horn, three rising notes
      else if(what==='alert'&&k[0]==='e'&&(k==='ecapt'||Math.random()<0.35)){tone(440,440,1.1,0.07,0,'triangle',at);tone(660,660,1.8,0.06,0.9,'triangle',at);} // the elves' horn, clear and high
      else if(what==='alert'&&k[0]==='h'&&(k==='hcapt'||Math.random()<0.35)){tone(147,147,1.1,0.1,0,'sawtooth',at);tone(196,196,1.4,0.09,0.9,'triangle',at);} // the riders' horn, low and long
      else if(what==='alert'&&(k==='rcapt'||Math.random()<0.3)){tone(392,392,0.5,0.08,0,'triangle',at);tone(523,523,0.9,0.08,0.45,'triangle',at);} // a silver horn
      if(FOES[k].mount&&what!=='blow'&&Math.random()<0.5)voice(420*p,260,0.7,0.06,{form:900,q:2,vib:16,vd:0.18},at); // the horse whinnies
      voice(150*p,120,what==='alert'?0.45:0.3,0.07,{form:700,q:1.3,vib:5,vd:0.04},at);}}
  else if(FOES[k].lord){voice(70*p,45,what==='alert'?1.8:1.1,0.16,{form:200,q:0.9,vib:3,vd:0.08},at);burst(1.2,'lowpass',400,0.6,0.22,0,at);}
  else{if(what==='alert'&&(k==='ochief'||Math.random()<0.25))tone(155,150,1.2,0.12,0,'sawtooth',at); // a war horn
    voice(180*p,130,what==='alert'?0.5:0.3,0.09,{form:520,q:1.4,vib:6,vd:0.05},at);}
  if(what==='blow')burst(0.14,'bandpass',900,1.5,0.16,0,at);
}
// ---- Striking a foe (first, nearer than any animal): the held weapon's power, a shield taking some from the front, a push
// back; slain, it falls and leaves what it carried to you
function foeHit(reach){
  const e=eyePos(),d=camDir(),o=[e.x,e.y,e.z],v=[d.x,d.y,d.z];let best=null,bt=reach;const bh=raycast(e,d,reach);
  if(bh&&SOLID[get(bh.x,bh.y,bh.z)]){const t=rayBox(o,v,[bh.x,bh.y,bh.z],[bh.x+1,bh.y+1,bh.z+1],reach);if(t>=0)bt=Math.min(bt,t);} // a blow passes through plants and grass
  for(const f of foes){if(f.dead)continue;const c=Math.cos(f.yaw),s=Math.sin(f.yaw),ox=o[0]-f.x,oz=o[2]-f.z,b=f.m.box;
    const t=rayBox([ox*c-oz*s,o[1]-f.y,ox*s+oz*c],[v[0]*c-v[2]*s,v[1],v[0]*s+v[2]*c],[b[0],b[1],b[2]],[b[3],b[4],b[5]],bt);if(t>=0&&t<bt){bt=t;best=f;}}
  if(best){const a=animalHit(reach);if(a&&Math.hypot(a.x-e.x,a.z-e.z)<Math.hypot(best.x-e.x,best.z-e.z))return null;}
  return best;
}
let foeHitCD=0;
function foeAct(btn){
  if(btn!==0)return false;const f=foeHit(armsReach());if(!f)return false;const held=curId(),it=ITEMS[held];
  if(foeHitCD>0)return true;foeHitCD=it&&it.tool==='sword'?0.32:it&&it.tool==='axe'?0.5:it&&it.tool==='lance'?0.7:0.4;swing=1;
  armsBlow(f,held);wearHeld(1); // its power from the arms in hand, the saddle, a run or the shield (W8a)
  return true;
}
function foeSlain(f){
  const F=FOES[f.kind],got=[];f.byP=1;f.dead=0.001;f.st='dead';f.sp=0;f.atk=0;if(F.folk)folkProvoke(f,180);
  if(SURV())for(const [id,lo,hi,ch] of F.drops)if(Math.random()<ch){const n=lo+Math.floor(Math.random()*(hi-lo+1)),left=addItem(id,n);if(left)toast('No room for '+nameOf(id));got.push(n+' '+nameOf(id));}
  const ar=armsSlain(f);if(ar)got.push(ar); // (arrows recovered, W8a)
  const bn=morSlain(f);if(bn)got.push(bn);morDeath(f,1);fieldSlain(f);warRecSlain(f); // (a warhost's banner taken; their hearts sink: W8b)
  drawBar(true);toast('The '+F.n.toLowerCase()+' is slain'+(got.length?'. You took '+got.join(', '):''));
  if(f.lordOf)lordFalls(f);warSwornSlain(f);elfSlain(f);elfLament(f);menSlain(f);menPassing(f);riderSlain(f);riderPassing(f);dwarfSlain(f);dwarfPassing(f);
}
function lordFalls(f){fallenLords.add(f.lordOf);saveDirty=true;if(!f.L)showName('The Emberlord has fallen');for(let k=0;k<60;k++)spawnP(f.x+(Math.random()-.5)*3,f.y+Math.random()*5,f.z+(Math.random()-.5)*3,(Math.random()-.5)*4,Math.random()*4,(Math.random()-.5)*4,[1,0.4+Math.random()*0.4,0.1],1.4,2);
  burst(2.5,'lowpass',200,0.7,0.5,0,[f.x,f.y+2,f.z]);}
// armour (D-052): a coat in the body slot takes a share of every blow from a foe, and wears
function armourCut(n){if(PL.ride&&PL.ride.bard)n=Math.max(1,Math.round(n*0.67));if(runeOn('ward'))n=Math.max(1,Math.round(n*0.85)); // (the rune of warding: D-091) // a barded horse takes a third off its rider's harm (D-090)
  const q=equip.body;if(!q||!SURV())return n;const it=ITEMS[q.id];q.d=(q.d||0)+1;if(q.d>=it.dur){equip.body=null;toast('Your '+it.n+' is worn through');}return Math.max(1,Math.round(n*(1-it.armor)));}
