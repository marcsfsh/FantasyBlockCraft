// Blocks
const AIR=0,GRASS=1,DIRT=2,STONE=3,COBBLE=4,SAND=5,LOG=6,LEAVES=7,PLANKS=8,GLASS=9,WATER=10,BEDROCK=11,COAL=12,IRON=13,GOLD=14,DIAMOND=15,SNOWG=16,SANDSTONE=17,CACTUS=18,LAVA=19,BRICK=20,GRAVEL=21,TGRASS=22,FLOWR=23,FLOWY=24,DBUSH=25,SBRICK=26,
  TNT=27,GLOW=28,WOOLW=29,WOOLR=30,WOOLB=31,WOOLY=32,WOOLK=33,BIRCH=34,BLEAVES=35,SPRUCE=36,SLEAVES=37,ICE=38,OBSID=39,BOOKS=40,MOSSY=41,WOOLG=42;
const BL=[];
function def(id,n,t,o){BL[id]=Object.assign({n:n,t:t,solid:true,opq:true,occ:true,liquid:0,cross:false,emit:false,place:true,lum:0,leaf:false,snd:'stone'},o||{});}
const PLANT={solid:false,opq:false,occ:false,cross:true,snd:'soft'};
def(AIR,'Air',[0,0,0],{solid:false,opq:false,occ:false,place:false});
def(GRASS,'Grass Block',[0,2,1],{snd:'soft'});
def(DIRT,'Dirt',[2,2,2],{snd:'soft'});
def(STONE,'Stone',[3,3,3]);
def(COBBLE,'Cobblestone',[4,4,4]);
def(MOSSY,'Mossy Cobblestone',[49,49,49]);
def(SAND,'Sand',[5,5,5],{snd:'soft'});
def(GRAVEL,'Gravel',[25,25,25],{snd:'soft'});
def(LOG,'Oak Log',[7,7,6],{snd:'wood'});
def(BIRCH,'Birch Log',[41,41,40],{snd:'wood'});
def(SPRUCE,'Spruce Log',[44,44,43],{snd:'wood'});
def(LEAVES,'Oak Leaves',[8,8,8],{opq:false,leaf:true,snd:'soft'});
def(BLEAVES,'Birch Leaves',[42,42,42],{opq:false,leaf:true,snd:'soft'});
def(SLEAVES,'Spruce Leaves',[45,45,45],{opq:false,leaf:true,snd:'soft'});
def(PLANKS,'Oak Planks',[9,9,9],{snd:'wood'});
def(BOOKS,'Bookshelf',[9,9,48],{snd:'wood'});
def(GLASS,'Glass',[10,10,10],{opq:false,occ:false,snd:'glass'});
def(WATER,'Water',[11,11,11],{solid:false,opq:false,occ:false,liquid:1,place:false});
def(LAVA,'Lava',[23,23,23],{solid:false,liquid:2,emit:true,lum:13,place:false});
def(BEDROCK,'Bedrock',[12,12,12],{place:false});
def(COAL,'Coal Ore',[13,13,13]);
def(IRON,'Iron Ore',[14,14,14]);
def(GOLD,'Gold Ore',[15,15,15]);
def(DIAMOND,'Diamond Ore',[16,16,16]);
def(SNOWG,'Snowy Grass',[17,2,18],{snd:'soft'});
def(ICE,'Ice',[46,46,46],{snd:'glass'});
def(SANDSTONE,'Sandstone',[19,19,20]);
def(CACTUS,'Cactus',[22,22,21],{snd:'soft'});
def(BRICK,'Bricks',[24,24,24]);
def(SBRICK,'Stone Bricks',[30,30,30]);
def(OBSID,'Obsidian',[47,47,47]);
def(TNT,'Blasting Keg',[32,33,31],{snd:'soft'});
def(GLOW,'Glowstone',[34,34,34],{emit:true,lum:15,snd:'glass'});
def(WOOLW,'White Wool',[35,35,35],{snd:'soft'});
def(WOOLR,'Red Wool',[36,36,36],{snd:'soft'});
def(WOOLY,'Yellow Wool',[38,38,38],{snd:'soft'});
def(WOOLG,'Green Wool',[50,50,50],{snd:'soft'});
def(WOOLB,'Blue Wool',[37,37,37],{snd:'soft'});
def(WOOLK,'Black Wool',[39,39,39],{snd:'soft'});
def(TGRASS,'Tall Grass',[26,26,26],PLANT);
def(FLOWR,'Poppy',[27,27,27],PLANT);
def(FLOWY,'Dandelion',[28,28,28],PLANT);
def(DBUSH,'Bracken',[29,29,29],PLANT);
const TORCH=43,WAYPT=44;
def(TORCH,'Torch',[53,53,53],{solid:false,opq:false,occ:false,torch:true,lum:14,emit:true,snd:'wood'});
def(WAYPT,'Carved Waystone',[54,54,54],{emit:true,lum:12,snd:'glass'});
const SPONGE=45,CRYSTAL=46;
def(SPONGE,'Sponge',[55,55,55],{snd:'soft'});
def(CRYSTAL,'Cave Crystal',[56,56,56],{solid:false,opq:false,occ:false,cross:true,emit:true,lum:10,snd:'glass'});
BL[WATER].place=true;
const RSAND=47,TERO=48,TERB=49,TERT=50,JLOG=51,JLEAVES=52;
def(RSAND,'Red Sand',[58,58,58],{snd:'soft',fall:true});
def(TERO,'Orange Terracotta',[59,59,59]);
def(TERB,'Brown Terracotta',[60,60,60]);
def(TERT,'Tan Terracotta',[61,61,61]);
def(JLOG,'Dark Oak Log',[7,7,62],{snd:'wood'});
def(JLEAVES,'Dark Leaves',[63,63,63],{opq:false,leaf:true,snd:'soft'});
BL[SAND].fall=true;BL[GRAVEL].fall=true;
const COPO=53,TINO=54,ZINO=55,PLATO=56,TITO=57,COPB=58,BRONB=59,BRASB=60,STEELB=61,TITB=62,PLATB=63,FURN=64,BLAST=65,LANTERN=66;
def(COPO,'Copper Ore',[64,64,64]);def(TINO,'Tin Ore',[65,65,65]);def(ZINO,'Zinc Ore',[66,66,66]);def(PLATO,'Platinum Ore',[67,67,67]);def(TITO,'Moonsilver Ore',[68,68,68]);
def(COPB,'Block of Copper',[69,69,69]);def(BRONB,'Block of Bronze',[70,70,70]);def(BRASB,'Block of Brass',[71,71,71]);def(STEELB,'Block of Steel',[72,72,72]);def(TITB,'Block of Moonsilver',[73,73,73]);def(PLATB,'Block of Platinum',[74,74,74]);
const PATH=67,WHEAT=68,GRAVE=73,FARM_D=74,FARM_W=75,WHEAT0=76,WHEAT1=77,WHEAT2=78,POT0=79,POT1=80,POT2=81,POT3=82,GLOWSHROOM=92,CRATE=93,DRIPU=94,DRIPD=95,CALCITE=96,AMETH=97,MUSHSTEM=98,GLOWCAP=99,DWBRICK=110,DWTILE=111,DWPILLAR=112,GOLDB=113,RUNE=114,DWCHEST=115,DWCRACK=116,BARREL=117,LECTERN=118,SCONCE=119,BONES=120,COBWEB=121,SNOWLEAF=122,DEEP=123,GLOWMOSS=124,HEATHER=127;



def(GLOWSHROOM,'Glow Mushroom',[118,118,118],{solid:false,opq:false,occ:false,cross:true,emit:true,lum:11,snd:'soft'});def(CRATE,'Supply Crate',[120,120,119],{snd:'wood'});
def(DRIPU,'Stalagmite',[121,121,121],{solid:false,opq:false,occ:false,cross:true});def(DRIPD,'Stalactite',[122,122,122],{solid:false,opq:false,occ:false,cross:true});
def(DWBRICK,'Dwarven Brick',[128,128,128]);def(DWTILE,'Dwarven Floor Tile',[129,129,129]);def(DWPILLAR,'Dwarven Pillar',[131,131,130]);
def(GOLDB,'Block of Gold',[132,132,132]);def(RUNE,'Rune Stone',[133,133,133],{emit:true,lum:8});def(DWCHEST,'Dwarven Chest',[135,128,134],{snd:'wood'});
def(DWCRACK,'Cracked Dwarven Brick',[136,136,136]);def(LECTERN,'Lectern',[139,9,140],{snd:'wood'});def(DEEP,'Deepstone',[145,145,145]);def(HEATHER,'Heather',[148,148,148],PLANT);def(GLOWMOSS,'Glowing Moss',[146,146,146],{emit:true,lum:7,snd:'soft'});
def(SNOWLEAF,'Snowy Spruce Leaves',[143,144,144],{opq:false,leaf:true,snd:'soft'});def(BONES,'Bone Pile',[141,141,141],{solid:false,opq:false,occ:false,cross:true});def(COBWEB,'Cobweb',[142,142,142],{solid:false,opq:false,occ:false,cross:true,snd:'soft'});
def(SCONCE,'Wall Sconce',[53,53,53],{solid:false,opq:false,occ:false,sconce:true,lum:14,emit:true,snd:'wood'});def(BARREL,'Barrel',[138,138,137],{snd:'wood'});
def(CALCITE,'Calcite',[123,123,123]);def(AMETH,'Amethyst',[124,124,124],{emit:true,lum:7,snd:'glass'});def(MUSHSTEM,'Mushroom Stem',[126,126,125],{snd:'wood'});def(GLOWCAP,'Glowing Cap',[127,127,127],{emit:true,lum:13,snd:'soft'});
def(FARM_D,'Farmland',[93,2,2],{snd:'soft'});def(FARM_W,'Wet Farmland',[94,2,2],{snd:'soft',place:false});
[[WHEAT0,'Wheat Sprouts',95],[WHEAT1,'Young Wheat',96],[WHEAT2,'Growing Wheat',97],[POT0,'Potato Sprouts',98],[POT1,'Young Potatoes',99],[POT2,'Growing Potatoes',100],[POT3,'Potatoes',101]]
  .forEach(([id,n,t])=>def(id,n,[t,t,t],{solid:false,opq:false,occ:false,cross:true,snd:'soft',place:id===POT3}));
def(GRAVE,'Grave',[92,92,92],{place:false,opq:false,occ:false});

def(PATH,'Dirt Path',[81,2,82],{snd:'soft'});def(WHEAT,'Wheat',[83,83,83],{solid:false,opq:false,occ:false,cross:true,snd:'soft'});
def(FURN,'Furnace',[77,77,76]);def(BLAST,'Blast Furnace',[78,78,79]);def(LANTERN,'Brass Lantern',[80,80,80],{emit:true,lum:15,snd:'glass'});
// How long each block takes to break by hand, what it is made of, and the pickaxe tier it needs to drop anything
BL.forEach(b=>{if(b){b.hard=1;b.mat='misc';b.tier=0;}});
function setH(ids,hard,mat,tier){ids.forEach(i=>{BL[i].hard=hard;BL[i].mat=mat;BL[i].tier=tier||0;});}
setH([GRASS,DIRT,SAND,GRAVEL,SNOWG,RSAND,CACTUS,SPONGE,PATH],0.6,'soft');setH([TGRASS,FLOWR,FLOWY,DBUSH,TORCH,WHEAT,HEATHER],0,'soft');
setH([LEAVES,BLEAVES,SLEAVES,JLEAVES,SNOWLEAF],0.3,'soft');setH([LOG,BIRCH,SPRUCE,JLOG,PLANKS,BOOKS],2.2,'wood');
setH([WOOLW,WOOLR,WOOLY,WOOLG,WOOLB,WOOLK],0.8,'cloth');setH([TNT],0.1,'soft');setH([GLASS,GLOW,ICE,CRYSTAL],0.45,'misc');
// Cold lights: what is left of the old peoples' lamps after the ages (Q8, D-023). Generation writes them in place of lit ones
// outside inhabited holds (COLD_OF, used by PW); coal relights lanterns, sconces and torches (crafting.js).
const DLANTERN=69,DSCONCE=70,DTORCH=71,DGLOW=72;
def(DLANTERN,'Cold Lantern',[192,192,192],{snd:'glass'});
def(DSCONCE,'Cold Sconce',[193,193,193],{solid:false,opq:false,occ:false,sconce:true,snd:'wood'});
def(DTORCH,'Burnt-out Torch',[193,193,193],{solid:false,opq:false,occ:false,torch:true,snd:'wood'});
def(DGLOW,'Dim Glowstone',[194,194,194],{snd:'glass'});
// Ancient waystones stand at old sites and hold gates (Q71); attunement comes in M4. Their runes still glow faintly.
const WAYSTONE=83;def(WAYSTONE,'Ancient Waystone',[195,195,195],{emit:true,lum:6});
// Climbing gear (M4, Q45, Q66). Climbable blocks (climb) hold the player: jump climbs, down or sprint descends, nothing holds still.
// A ladder or piton is a panel on the wall beside it (wall); a ladder needs ground or a ladder under it, a piton holds anywhere on
// rock. Rope hangs straight down through open space; the grapnel is the hook at the top of a rope thrown up to a ledge.
const LADDER=84,ROPE=85,PITON=86,GRAPNEL=87;
const CLIMB={solid:false,opq:false,occ:false,climb:true,snd:'wood'};
def(LADDER,'Ladder',[196,196,196],Object.assign({wall:true},CLIMB));def(PITON,'Iron Piton',[198,198,198],Object.assign({wall:true},CLIMB,{snd:'stone'}));
def(ROPE,'Rope',[197,197,197],Object.assign({cross:true},CLIMB,{snd:'soft'}));def(GRAPNEL,'Grapnel Hook',[199,199,199],Object.assign({wall:true,place:false},CLIMB,{snd:'stone'}));
// Storage and food (M4b): a chest you can build, two crops (turnips, beans) and wild plants to forage
const CHEST=88,BERRYB=89,MUSHB=90,WTURN=91,TURN0=108,TURN1=109,TURN2=125,BEAN0=126,BEAN1=128,BEAN2=129;
def(CHEST,'Oak Chest',[200,200,201],{snd:'wood'});
def(BERRYB,'Bilberry Bush',[202,202,202],PLANT);def(MUSHB,'Brown Mushroom',[203,203,203],PLANT);def(WTURN,'Wild Turnip',[206,206,206],PLANT);
[[TURN0,'Turnip Sprouts',204],[TURN1,'Young Turnips',205],[TURN2,'Turnips',206],[BEAN0,'Bean Sprouts',207],[BEAN1,'Young Beans',208],[BEAN2,'Bean Plants',209]]
  .forEach(([id,n,t])=>def(id,n,[t,t,t],Object.assign({},PLANT,{place:false})));
// The forests (M6b, D-040; Q130): six new woods (log, leaves, planks), forest floors and plants. The first block ids above 1023.
const MAPLE=1024,MAPLEL=1025,MAPLEG=1026,MAPLEP=1027,PINE=1028,PINEL=1029,PINEP=1030,GREAT=1031,GREATL=1032,GREATP=1033,YEW=1034,YEWL=1035,YEWP=1036,
  SILV=1037,SILVL=1038,SILVP=1039,WILLOW=1040,WILLOWL=1041,WILLOWP=1042,LITTER=1043,NEEDLES=1044,FMOSS=1045,FERN=1046,BLUEB=1047,MOONP=1048;
const LEAFD={opq:false,leaf:true,snd:'soft'};
[[MAPLE,MAPLEP,'Maple',147,148,151],[PINE,PINEP,'Pine',152,153,155],[GREAT,GREATP,'Greatwood',156,157,159],[YEW,YEWP,'Yew',160,161,163],[SILV,SILVP,'Silverwood',164,165,167],[WILLOW,WILLOWP,'Willow',168,169,171]]
  .forEach(([log,pl,n,bark,ring,plank])=>{def(log,n+' Log',[ring,ring,bark],{snd:'wood'});def(pl,n+' Planks',[plank,plank,plank],{snd:'wood'});});
def(MAPLEL,'Red Maple Leaves',[149,149,149],LEAFD);def(MAPLEG,'Golden Maple Leaves',[150,150,150],LEAFD);def(PINEL,'Pine Needles',[154,154,154],LEAFD);
def(GREATL,'Greatwood Leaves',[158,158,158],LEAFD);def(YEWL,'Yew Leaves',[162,162,162],LEAFD);def(SILVL,'Silverleaf',[166,166,166],LEAFD);def(WILLOWL,'Willow Leaves',[170,170,170],LEAFD);
def(LITTER,'Leaf Litter',[172,2,173],{snd:'soft'});def(NEEDLES,'Pine Needle Floor',[174,2,175],{snd:'soft'});def(FMOSS,'Forest Moss',[176,2,177],{snd:'soft'});
def(FERN,'Fern',[178,178,178],PLANT);def(BLUEB,'Bluebells',[179,179,179],PLANT);def(MOONP,'Moonpetal',[180,180,180],Object.assign({},PLANT,{emit:true,lum:5}));
const NEW_LOGS=[MAPLE,PINE,GREAT,YEW,SILV,WILLOW],NEW_PLANKS=[MAPLEP,PINEP,GREATP,YEWP,SILVP,WILLOWP],NEW_LEAVES=[MAPLEL,MAPLEG,PINEL,GREATL,YEWL,SILVL,WILLOWL];
setH(NEW_LOGS,2.2,'wood');setH(NEW_PLANKS,2.2,'wood');setH(NEW_LEAVES,0.3,'soft');setH([LITTER,NEEDLES,FMOSS],0.6,'soft');setH([FERN,BLUEB,MOONP],0,'soft');
// Highlands and cold (M6c, D-041): limestone, glacier ice, packed snow, tundra moss, mistwood, gentians and edelweiss
const LIMESTONE=1049,GLACIER=1050,PSNOW=1051,TMOSS=1052,MISTW=1053,MISTL=1054,MISTP=1055,GENTIAN=1056,EDELW=1057;
def(LIMESTONE,'Limestone',[181,181,181]);def(GLACIER,'Glacier Ice',[182,182,182],{snd:'glass'});def(PSNOW,'Packed Snow',[183,183,183],{snd:'soft'});
def(TMOSS,'Tundra Moss',[184,2,185],{snd:'soft'});def(MISTW,'Mistwood Log',[187,187,186],{snd:'wood'});def(MISTL,'Mistwood Leaves',[188,188,188],LEAFD);def(MISTP,'Mistwood Planks',[189,189,189],{snd:'wood'});
def(GENTIAN,'Gentian',[190,190,190],PLANT);def(EDELW,'Edelweiss',[191,191,191],PLANT);
NEW_LOGS.push(MISTW);NEW_PLANKS.push(MISTP);NEW_LEAVES.push(MISTL);
setH([LIMESTONE],3,'stone',1);setH([GLACIER],0.6,'misc');setH([PSNOW,TMOSS],0.6,'soft');setH([MISTW,MISTP],2.2,'wood');setH([MISTL],0.3,'soft');setH([GENTIAN,EDELW],0,'soft');
// Coasts and waters (M6d, D-042): chalk, black sand, basalt, peat, bog moss; water plants drawn inside the water (wet: the cell
// counts as water for swimming and the water's surface) and lily pads lying on it (pad)
const CHALK=1058,BLACKSAND=1059,BASALT=1060,PEAT=1061,BOGMOSS=1062,KELP=1063,SEAGRASS=1064,LILYPAD=1065,COTTONG=1066;
def(CHALK,'Chalk',[210,210,210]);def(BLACKSAND,'Black Sand',[211,211,211],{snd:'soft'});def(BASALT,'Basalt',[212,212,213]);def(PEAT,'Peat',[214,214,214],{snd:'soft'});
def(BOGMOSS,'Bog Moss',[215,214,216],{snd:'soft'});
def(KELP,'Kelp',[217,217,217],Object.assign({},PLANT,{wet:true}));def(SEAGRASS,'Seagrass',[218,218,218],Object.assign({},PLANT,{wet:true}));
def(LILYPAD,'Lily Pad',[219,219,219],{solid:false,opq:false,occ:false,pad:true,snd:'soft'});def(COTTONG,'Cotton Grass',[220,220,220],PLANT);
setH([CHALK],2,'stone',1);setH([BASALT],4,'stone',1);setH([BLACKSAND,PEAT,BOGMOSS],0.6,'soft');setH([KELP,SEAGRASS,LILYPAD,COTTONG],0,'soft');
// Dry and fiery (M6e, D-043): golden steppe grass, volcanic ash and magma stone, the blight's dead grass and dead wood
const GOLDGRASS=1067,STEPPEG=1068,ASH=1069,MAGMA=1070,DEADGRASS=1071,DEADWOOD=1072;
def(GOLDGRASS,'Golden Grass Block',[221,2,222],{snd:'soft'});def(STEPPEG,'Steppe Grass',[223,223,223],PLANT);def(ASH,'Volcanic Ash',[224,224,224],{snd:'soft'});
def(MAGMA,'Magma Stone',[225,225,225],{emit:true,lum:7});def(DEADGRASS,'Dead Grass Block',[226,2,227],{snd:'soft'});def(DEADWOOD,'Dead Wood',[229,229,228],{snd:'wood'});
setH([GOLDGRASS,ASH,DEADGRASS],0.6,'soft');setH([STEPPEG],0,'soft');setH([MAGMA],5,'stone',1);setH([DEADWOOD],2.2,'wood');
// Strange lands (M6f, D-044): rare finds (Q130) and the stuff of the strange lands
const PRISM=1073,PETRIWOOD=1074,AMBER=1075,STARORE=1076,SCORCH=1077,CAPB=1078,CAPG=1079,PALEG=1080;
def(PRISM,'Prism Shard',[230,230,230],{emit:true,lum:9,snd:'glass'});def(PETRIWOOD,'Petrified Wood',[232,232,231]);def(AMBER,'Amber',[233,233,233],{emit:true,lum:4,snd:'glass'});
def(STARORE,'Starmetal Ore',[234,234,234]);def(SCORCH,'Scorched Stone',[235,235,235]);def(CAPB,'Glowcap Flesh',[236,236,236],{snd:'soft'});def(CAPG,'Glowcap Gills',[237,237,237],{emit:true,lum:6,snd:'soft'});
def(PALEG,'Pale Grass Block',[238,2,239],{snd:'soft'});
setH([PRISM,AMBER],0.8,'misc');setH([PETRIWOOD],3,'stone',1);setH([STARORE],7,'ore',5);setH([SCORCH],4,'stone',1);setH([CAPB,CAPG],0.6,'soft');setH([PALEG],0.6,'soft');
// Old lands of men (M6g, D-045): orchard leaves (apples), blossom, oxeye daisies, lavender
const FRUITL=1081,BLOSSOM=1082,OXEYE=1083,LAVENDER=1084;
def(FRUITL,'Orchard Leaves',[240,240,240],LEAFD);def(BLOSSOM,'Blossom',[241,241,241],LEAFD);def(OXEYE,'Oxeye Daisy',[242,242,242],PLANT);def(LAVENDER,'Lavender',[243,243,243],PLANT);
NEW_LEAVES.push(FRUITL,BLOSSOM);setH([FRUITL,BLOSSOM],0.3,'soft');setH([OXEYE,LAVENDER],0,'soft');
// The burnt land (D-051): black ash and cinder over the Volcanic Wastes, crusts of cooling lava that still glow in their cracks,
// trees charred to the heart (some still smouldering), yellow sulphur round the smoking vents
const BLACKASH=1085,CINDER=1086,LAVACRUST=1087,CHARWOOD=1088,SMOULDER=1089,SULFUR=1090,VENT=1091;
def(BLACKASH,'Black Ash',[244,244,244],{snd:'soft'});def(CINDER,'Cinder Rock',[245,245,245]);def(LAVACRUST,'Lava Crust',[246,246,246],{emit:true,ember:true,lum:5});
def(CHARWOOD,'Charred Wood',[248,248,247],{snd:'wood'});def(SMOULDER,'Smouldering Wood',[248,248,249],{snd:'wood',emit:true,ember:true,lum:6});
def(SULFUR,'Sulphur Crust',[250,250,250],{snd:'soft'});def(VENT,'Fumarole',[251,245,245],{emit:true,ember:true,lum:4});
setH([BLACKASH,SULFUR],0.6,'soft');setH([CINDER,VENT],3,'stone',1);setH([LAVACRUST],4,'stone',1);setH([CHARWOOD,SMOULDER],1.6,'wood');
// The foes' places (D-052): goblin tents and orc camps of hide, iron grates for pens and gates, the basalt bricks of the fire
// demons' fortresses (some with mortar that still glows), poles of skulls and the ragged banners of the warbands
const HIDE=1092,GRATE=1093,BASBRICK=1094,EMBRICK=1095,SKULLS=1096,BANNER=1097;
def(HIDE,'Hide Canvas',[252,252,252],{snd:'soft'});def(GRATE,'Iron Grate',[253,253,253],{opq:false,occ:false});def(BASBRICK,'Basalt Bricks',[254,254,254]);
def(EMBRICK,'Ember Bricks',[255,255,255],{emit:true,ember:true,lum:4});def(SKULLS,'Skull Totem',[256,256,256],{solid:false,opq:false,occ:false,cross:true});
def(BANNER,'War Banner',[257,257,257],{solid:false,opq:false,occ:false,cross:true,snd:'soft'});
setH([HIDE],0.8,'soft');setH([GRATE],6,'metal',3);setH([BASBRICK,EMBRICK],5,'stone',1);setH([SKULLS,BANNER],0,'soft');
// The Emberlords' masonry (D-058): bricks cracked by heat and age, polished floor tiles, carved panels, script that still burns,
// obsidian bricks, fluted pillars, chains hung from the vaults, iron baskets of fire, and spikes along the battlements
const BASCRACK=1098,BASTILE=1099,BASCARVE=1100,EMGLYPH=1101,OBSBRICK=1102,BASPILLAR=1103,CHAIN=1104,BRAZIER=1105,SPIKES=1106;
def(BASCRACK,'Cracked Basalt Bricks',[258,258,258]);def(BASTILE,'Basalt Tiles',[259,259,259]);def(BASCARVE,'Carved Basalt',[254,254,260]);
def(EMGLYPH,'Ember Script',[254,254,261],{emit:true,ember:true,lum:5});def(OBSBRICK,'Obsidian Bricks',[262,262,262]);def(BASPILLAR,'Basalt Pillar',[263,263,264]);
def(CHAIN,'Iron Chain',[265,265,265],Object.assign({cross:true},CLIMB,{snd:'stone'}));def(BRAZIER,'Fire Basket',[266,266,268],{emit:true,ember:true,lum:14,snd:'stone'});
def(SPIKES,'Iron Spikes',[269,269,269],{solid:false,opq:false,occ:false,cross:true,snd:'stone'});
// The realms of men (D-060): the pale stone of their cities and walls (dressed blocks, coursed ashlar, the realm's star-and-
// tower carved in relief, fluted pillars), roofs of slate, timbered plaster and thatch for the country, the realm's banner, hay,
// paving for the king's roads and leaded windows
const WSTONE=1107,WSBRICK=1108,WSCARVE=1109,WSPILLAR=1110,SLATE=1111,PLASTER=1112,TIMBER=1113,THATCH=1114,RBANNER=1115,HAYBALE=1116,PAVING=1117,LGLASS=1118;
// and for the relief of their buildings: rock-faced whitestone for plinths and the feet of walls, a moulded band for string
// courses, cornices and copings
const WSROUGH=1119,WSTRIM=1120;
// The riders of the plains (D-061): golden thatch for their halls and turf for their houses, wattle and daub, carved and gilded
// oak, fieldstone, the sharpened stakes of a palisade, their banner (a white horse on green), crossed horse heads for gable
// ends, shields hung on a wall, a long hearth, tapestries, a rail fence for paddocks
const GTHATCH=1121,TURF=1122,WATTLE=1123,CTIMBER=1124,FSTONE=1125,STAKES=1126,HBANNER=1127,HORNS=1128,SHIELDS=1129,HEARTH=1130,TAPESTRY=1131,GILDED=1132,FENCE=1133;
def(WSTONE,'Whitestone',[270,270,270]);def(WSBRICK,'Whitestone Bricks',[271,271,271]);def(WSCARVE,'Carved Whitestone',[270,270,272]);
def(WSPILLAR,'Whitestone Pillar',[273,273,274]);def(SLATE,'Slate Roof',[275,275,275]);def(PLASTER,'Timbered Plaster',[276,276,276]);
def(TIMBER,'Braced Timber Frame',[276,276,277]);def(THATCH,'Thatch',[278,278,279],{snd:'soft'});
def(RBANNER,'Banner of the Realm',[280,280,280],{solid:false,opq:false,occ:false,cross:true,snd:'soft'});def(HAYBALE,'Hay Bale',[281,281,282],{snd:'soft'});
def(PAVING,'Paving Stones',[283,283,283]);def(WSROUGH,'Rough Whitestone',[285,285,285]);def(WSTRIM,'Whitestone Moulding',[270,270,286]);def(LGLASS,'Leaded Glass',[284,284,284],{opq:false,occ:false,snd:'glass'});
setH([WSTONE,WSBRICK,WSCARVE,WSPILLAR,PAVING,WSROUGH,WSTRIM],4,'stone',1);
def(GTHATCH,'Golden Thatch',[287,287,288],{snd:'soft'});def(TURF,'Turf Roof',[289,2,290],{snd:'soft'});def(WATTLE,'Wattle and Daub',[291,291,291],{snd:'wood'});
def(CTIMBER,'Carved Oak',[292,292,293],{snd:'wood'});def(FSTONE,'Fieldstone',[294,294,294]);def(STAKES,'Sharpened Stakes',[295,295,295],{solid:false,opq:false,occ:false,cross:true,snd:'wood'});
def(HBANNER,'Banner of the Riders',[296,296,296],{solid:false,opq:false,occ:false,cross:true,snd:'soft'});def(HORNS,'Horse-Head Gable',[297,297,297],{solid:false,opq:false,occ:false,cross:true,snd:'wood'});
def(SHIELDS,'Hung Shields',[9,9,298],{snd:'wood'});def(HEARTH,'Long Hearth',[299,294,300],{emit:true,ember:true,lum:13});def(TAPESTRY,'Tapestry',[301,301,301],{solid:false,opq:false,occ:false,cross:true,snd:'soft'});
def(GILDED,'Gilded Oak',[303,303,302],{snd:'wood'});def(FENCE,'Rail Fence',[305,305,304],{opq:false,occ:false,snd:'wood'});
setH([GTHATCH,TURF],0.6,'soft');setH([WATTLE,CTIMBER,GILDED,SHIELDS,FENCE],2,'wood');setH([FSTONE,HEARTH],3,'stone',1);setH([STAKES],1,'wood');setH([HBANNER,TAPESTRY,HORNS],0,'soft');setH([SLATE],2.5,'stone',1);setH([PLASTER,TIMBER],2,'wood');setH([THATCH,HAYBALE],0.6,'soft');setH([RBANNER],0,'soft');setH([LGLASS],0.5,'misc');
setH([BASCRACK,BASTILE,BASCARVE,EMGLYPH,BASPILLAR],5,'stone',1);setH([OBSBRICK],20,'stone',7);setH([CHAIN,SPIKES],1.5,'metal',2);setH([BRAZIER],3,'metal',2);
const isWetId=id=>id===WATER||!!(BL[id]&&BL[id].wet);
// the high elves (D-062): elvenstone and its courses, carved elvenstone (a vine in relief), slender columns, tracery and stained
// glass for their arched windows, roofs of verdigris copper and of dark shingles, gilt filigree for rails and screens, their
// lamps, their banner (a silver star over two leaves on deep blue), golden wood, and mosaic floors
const EVSTONE=1134,EVBRICK=1135,EVCARVE=1136,EVPILLAR=1137,EVTRACERY=1138,EVGLASS=1139,EVROOF=1140,EVSHINGLE=1141,EVGOLD=1142,EVLAMP=1143,EVBANNER=1144,EVWOOD=1145,EVMOSAIC=1146;
def(EVSTONE,'Elvenstone',[306,306,306]);def(EVBRICK,'Elvenstone Courses',[307,307,307]);def(EVCARVE,'Carved Elvenstone',[306,306,308]);def(EVPILLAR,'Elven Column',[310,310,309]);
def(EVTRACERY,'Elven Tracery',[311,311,311],{opq:false,occ:false});def(EVGLASS,'Elven Glass',[312,312,312],{opq:false,occ:false,snd:'glass'});
def(EVROOF,'Verdigris Roof',[313,313,313]);def(EVSHINGLE,'Elven Shingles',[315,315,315]);def(EVGOLD,'Gilt Filigree',[316,316,316],{opq:false,occ:false});
def(EVLAMP,'Elven Lamp',[317,317,317],{opq:false,occ:false,emit:true,lum:15,snd:'glass'});def(EVBANNER,'Banner of the Elves',[318,318,318],{solid:false,opq:false,occ:false,cross:true,snd:'soft'});
def(EVWOOD,'Golden Wood',[319,319,319],{snd:'wood'});def(EVMOSAIC,'Elven Mosaic',[320,320,320]);
// The orcs' places on the wastes (D-064): a palisade of charred logs bound in iron, and plates of riveted iron
const ORCLOG=1147,ORCIRON=1148;
def(ORCLOG,'Black Palisade',[322,322,321],{snd:'wood'});def(ORCIRON,'Riveted Iron',[323,323,323],{snd:'stone'});
setH([ORCLOG],2,'wood');setH([ORCIRON],6,'metal',2);
// The wood elves (D-065): the goldbough, their great tree, its silver bark, pale planks and golden leaves; their lamps of pale
// light, woven rails, wood carved in flowing lines, rootstone (stone carved like roots, for the king's halls), clipped hedges,
// the banner of the wood (a golden leaf on green), and leaf thatch for their roofs
const WBARK=1149,WPLANK=1150,WLEAF=1151,WLAMP=1152,WRAIL=1153,WCARVE=1154,WROOT=1155,WHEDGE=1156,WBANNER=1157,WTHATCH=1158;
def(WBARK,'Goldbough Bark',[325,325,324],{snd:'wood'});def(WPLANK,'Goldbough Planks',[326,326,326],{snd:'wood'});def(WLEAF,'Goldbough Leaves',[327,327,327],LEAFD);
def(WLAMP,'Woodland Lamp',[328,328,328],{opq:false,occ:false,emit:true,lum:14,snd:'glass'});def(WRAIL,'Woven Rail',[329,329,329],{opq:false,occ:false,snd:'wood'});
def(WCARVE,'Carved Wood',[326,326,330],{snd:'wood'});def(WROOT,'Rootstone',[331,331,331]);def(WHEDGE,'Clipped Hedge',[332,332,332],{snd:'soft'});
def(WBANNER,'Banner of the Wood',[333,333,333],{solid:false,opq:false,occ:false,cross:true,snd:'soft'});def(WTHATCH,'Leaf Thatch',[334,334,334],{snd:'soft'});
NEW_LOGS.push(WBARK);NEW_PLANKS.push(WPLANK);NEW_LEAVES.push(WLEAF);
// The mountain dwarves (D-066): dressed granite in great blocks and in long courses, granite carved in angular knotwork inlaid
// with bronze, fluted columns banded in bronze, riveted bronze plating, firebrick black with soot, molten iron that glows in
// their forges and channels (it never flows), the hold's lamps of bronze, cogwheels of iron, ore carts, slag, pit props of
// oiled timber banded in iron, the banner of the mountain (a golden anvil under three peaks on deep blue), anvils, and the
// polished flagstones of their halls
const DGRAN=1159,DCOURSE=1160,DKNOT=1161,DCOL=1162,DBRONZE=1163,DFORGE=1164,DMOLTEN=1165,DLAMP=1166,DGEAR=1167,DCART=1168,DSLAG=1169,DPROP=1170,DBANNER=1171,DANVIL=1172,DFLAG=1173;
def(DGRAN,'Dwarven Granite',[335,335,335]);def(DCOURSE,'Granite Courses',[335,335,336]);def(DKNOT,'Knotwork Granite',[335,335,337]);def(DCOL,'Hold Column',[338,338,339]);
def(DBRONZE,'Bronze Plating',[340,340,340],{snd:'stone'});def(DFORGE,'Forge Brick',[341,341,341]);def(DMOLTEN,'Molten Iron',[342,342,342],{emit:true,ember:true,lum:15});
def(DLAMP,'Hold Lamp',[343,343,343],{opq:false,occ:false,emit:true,lum:15,snd:'glass'});def(DGEAR,'Iron Cogwheel',[345,345,344],{snd:'stone'});
def(DCART,'Ore Cart',[346,347,347],{snd:'stone'});def(DSLAG,'Slag',[348,348,348]);def(DPROP,'Pit Prop',[349,349,350],{snd:'wood'});
def(DBANNER,'Banner of the Mountain',[351,351,351],{solid:false,opq:false,occ:false,cross:true,snd:'soft'});def(DANVIL,'Anvil',[352,353,353],{snd:'stone'});def(DFLAG,'Hold Flagstones',[354,354,354]);
// The war at the gate of the wastes (D-067): the canvas of the allied hosts' tents, weathered linen in panels with its seams;
// the iron of the Ashen Gate's leaves, black plates studded in a lattice between heavy bands, rust bleeding from the studs; and
// the mantlets of the siege lines, heavy planks bound in iron, scorched, with the stubs of arrows in them
const CANVAS=1174,GATEIRON=1175,MANTLET=1176,OBANNER=1177,BOLTTHR=1178;
def(CANVAS,'Tent Canvas',[355,355,355],{snd:'soft'});def(GATEIRON,'Gate Iron',[356,356,356],{snd:'stone'});def(MANTLET,'Mantlet',[357,357,357],{snd:'wood'});def(OBANNER,'Banner of the Warhost',[358,358,358],{solid:false,opq:false,occ:false,cross:true,snd:'soft'});def(BOLTTHR,'Bolt Thrower',[359,359,359],{solid:false,opq:false,occ:false,cross:true,snd:'wood'});
// The elves enlarged (D-088): moonstone, pale stone that holds a soft light; the starglass lamp, a star of clear crystal in a
// silver cage; the elven throne of golden wood and elvenstone, gilt; three elven plants (starbloom, a white star that glows a
// little; silverfern; dawnlily, pale gold); the leaf-stone that marks the elven ways; weathered elvenstone, cracked and mossed,
// for the ruins of the elder days; shipwood, white-painted planks of their ships; the elven sail, white with a silver star; the
// elder chest of elvenstone bound in gold; the awning of an elven market, blue and white
const MOONSTONE=1179,STARLAMP=1180,ETHRONE=1181,STARBLOOM=1182,SILVFERN=1183,DAWNLILY=1184,LEAFSTONE=1185,EVOLD=1186,EHULL=1187,ESAIL=1188,ECHEST=1189,EAWNING=1190;
def(MOONSTONE,'Moonstone',[360,360,360],{emit:true,lum:9});def(STARLAMP,'Starglass Lamp',[361,361,361],{opq:false,occ:false,emit:true,lum:15,snd:'glass'});
def(ETHRONE,'Elven Throne',[362,362,363],{snd:'wood'});def(STARBLOOM,'Starbloom',[364,364,364],Object.assign({},PLANT,{emit:true,lum:4}));def(SILVFERN,'Silverfern',[365,365,365],PLANT);def(DAWNLILY,'Dawnlily',[366,366,366],PLANT);
def(LEAFSTONE,'Leaf-stone',[306,306,367]);def(EVOLD,'Weathered Elvenstone',[368,368,368]);def(EHULL,'Shipwood',[369,369,369],{snd:'wood'});def(ESAIL,'Elven Sail',[370,370,370],{snd:'soft'});
def(ECHEST,'Elder Chest',[372,372,371],{snd:'stone'});def(EAWNING,'Market Awning',[373,373,373],{snd:'soft'});
// The white realm enlarged (D-089): the silver tree of the royal citadel (white bark, silver leaves with pale blossom); the notice
// board of a market or a green; the hanging signs of the inn and the smithy; the tapestry of the realm and the shield hung in a
// hall; the effigy on a tomb; the stained glass of the hallows; the milestone of the king's roads, its letters cut; heartsease,
// the healers' herb; a headstone; the tilt barrier of the lists, striped; the throne of the realm in black and silver; the
// maypole, wound with ribbons; tarred planks and the sail of the realm for its ships; weathered whitestone for the ruins of the
// old kingdom and the chest of the old kings; pavilion cloth, striped; and the banner of the player's own arms
const SILVBARK=1191,SILVLEAF=1192,NOTICE=1193,INNSIGN=1194,SMITHSIGN=1195,RTAP=1196,WSHIELD=1197,EFFIGY=1198,STGLASS=1199,MILESTONE=1200,HEARTSEASE=1201,HEADSTONE=1202,TILTRAIL=1203,RTHRONE=1204,MAYPOLE=1205,TARHULL=1206,RSAIL=1207,OLDSTONE=1208,OLDCHEST=1209,PAVCLOTH=1210,MYARMS=1211;
const HANG={solid:false,opq:false,occ:false,cross:true,snd:'soft'};
def(SILVBARK,'Silver Bark',[375,375,374],{snd:'wood'});def(SILVLEAF,'Silver Leaves',[376,376,376],LEAFD);def(NOTICE,'Notice Board',[9,9,377],{snd:'wood'});
def(INNSIGN,'Inn Sign',[378,378,378],Object.assign({},HANG,{snd:'wood'}));def(SMITHSIGN,"Smith's Sign",[379,379,379],Object.assign({},HANG,{snd:'wood'}));def(RTAP,'Tapestry of the Realm',[380,380,380],HANG);
def(WSHIELD,'Shield of the Realm',[381,381,381],Object.assign({},HANG,{snd:'wood'}));def(EFFIGY,'Tomb Effigy',[382,270,383]);def(STGLASS,'Stained Glass',[384,384,384],{opq:false,occ:false,snd:'glass'});
def(MILESTONE,'Milestone',[270,270,385]);def(HEARTSEASE,'Heartsease',[386,386,386],PLANT);def(HEADSTONE,'Headstone',[395,395,387]);def(TILTRAIL,'Tilt Barrier',[388,388,388],{snd:'wood'});
def(RTHRONE,'Throne of the Realm',[389,389,390]);def(MAYPOLE,'Maypole',[392,392,391],{snd:'wood'});def(TARHULL,'Tarred Planks',[393,393,393],{snd:'wood'});def(RSAIL,'Sail of the Realm',[394,394,394],{snd:'soft'});
def(OLDSTONE,'Weathered Whitestone',[395,395,395]);def(OLDCHEST,'Chest of the Old Kings',[397,397,396]);def(PAVCLOTH,'Pavilion Cloth',[398,398,398],{snd:'soft'});def(MYARMS,'Banner of Your Arms',[399,399,399],HANG);
setH([NOTICE,TILTRAIL,MAYPOLE,TARHULL,SILVBARK],2,'wood');setH([SILVLEAF],0.4,'soft');setH([INNSIGN,SMITHSIGN,WSHIELD],0.6,'wood');setH([RTAP,MYARMS],0,'soft');setH([RSAIL,PAVCLOTH],0.8,'soft');
// The riders enlarged (D-090): barrowbloom, small and white, on the kings' mounds and the cairns of the fallen; the bee skep of
// coiled straw; the tapestry of the riders (the white horse on green under a gilt border) and their round shield, hung; the
// horse stone that tells the way beside the riders' roads; the high seat of the riders, carved and gilded; the race pennon of
// green and gold on its pole; the picture stone of the forefathers, carved with ships, horses and riders; the hoard chest of
// the forefathers, dark oak in knotwork iron; the feasting board, laid; and the grey standing stone of the old rings
const BARROWBLOOM=1212,SKEP=1213,HTAP=1214,HSHIELD=1215,HSTONE=1216,HSEAT=1217,PENNON=1218,PICSTONE=1219,FCHEST=1220,FEASTBOARD=1221,STANDSTONE=1222;
def(BARROWBLOOM,'Barrowbloom',[400,400,400],PLANT);def(SKEP,'Bee Skep',[401,9,402],{snd:'soft'});def(HTAP,'Tapestry of the Riders',[403,403,403],HANG);
def(HSHIELD,'Shield of the Riders',[404,404,404],Object.assign({},HANG,{snd:'wood'}));def(HSTONE,'Horse Stone',[405,294,406]);def(HSEAT,'High Seat of the Riders',[407,292,408],{snd:'wood'});
def(PENNON,'Race Pennon',[409,409,409],Object.assign({},HANG,{snd:'wood'}));def(PICSTONE,'Picture Stone',[410,410,411]);def(FCHEST,'Hoard Chest of the Forefathers',[412,412,413],{snd:'wood'});
def(FEASTBOARD,'Feasting Board',[292,292,414],{snd:'wood'});def(STANDSTONE,'Standing Stone',[415,415,416]);
setH([BARROWBLOOM,HTAP],0,'soft');setH([SKEP],0.6,'soft');setH([HSHIELD,PENNON],0.6,'wood');setH([HSEAT,FEASTBOARD,FCHEST],2,'wood');setH([HSTONE,PICSTONE,STANDSTONE],4,'stone',1);
// The dwarves enlarged (D-091): the gem seam in the mines' walls, crystals of green, red and blue in the rock; a heap of cut gems and
// gold in the treasuries; the rune forge, an anvil whose face is cut with runes that glow blue; the tomb of a king of the
// mountain, his effigy in granite on its lid; the brewing vat of riveted copper, foaming; an ale keg on its rack, a brass tap in
// it; the waymark of the Stone Road, a granite post cut with runes and the ways; the deep drum, a great hide drum hooped in
// bronze; the mushroom bed of dark loam threaded with white; and the prospector's strongbox, oak bound in iron
const GEMORE=1223,GEMHEAP=1224,DRUNE=1225,DTOMB=1226,DVAT=1227,DKEG=1228,DWAY=1229,DDRUM=1230,MUSHBED=1231,DSTRONG=1232;
def(GEMORE,'Gem Seam',[417,417,417]);def(GEMHEAP,'Heap of Gems',[418,418,418],{emit:true,lum:5,snd:'glass'});def(DRUNE,'Rune Forge',[419,335,420],{emit:true,lum:9});
def(DTOMB,'Tomb of a King',[421,335,422]);def(DVAT,'Brewing Vat',[423,340,424]);def(DKEG,'Ale Keg',[425,425,426],{snd:'wood'});def(DWAY,'Waymark of the Stone Road',[427,335,428]);
def(DDRUM,'Deep Drum',[429,349,430],{snd:'wood'});def(MUSHBED,'Mushroom Bed',[431,2,432],{snd:'soft'});def(DSTRONG,"Prospector's Strongbox",[433,433,434],{snd:'wood'});
setH([GEMORE],6,'ore',4);setH([GEMHEAP],1.5,'misc');setH([DRUNE,DVAT],5,'metal',2);setH([DTOMB,DWAY],5,'stone',1);setH([DKEG,DDRUM,DSTRONG],2,'wood');setH([MUSHBED],0.6,'soft');
setH([EFFIGY,MILESTONE,HEADSTONE,RTHRONE,OLDSTONE],4,'stone',1);setH([STGLASS],0.5,'misc');setH([HEARTSEASE],0,'soft');setH([OLDCHEST],2.5,'stone');
setH([MOONSTONE,LEAFSTONE,EVOLD],4,'stone',1);setH([STARLAMP],0.5,'misc');setH([ETHRONE,EHULL],2,'wood');setH([STARBLOOM,SILVFERN,DAWNLILY],0,'soft');setH([ESAIL,EAWNING],0.8,'soft');setH([ECHEST],2.5,'stone');
setH([CANVAS],0.8,'soft');setH([OBANNER],0,'soft');setH([BOLTTHR],1.5,'wood');setH([GATEIRON],8,'metal',3);setH([MANTLET],2,'wood');
setH([DGRAN,DCOURSE,DKNOT,DCOL,DFLAG],5,'stone',1);setH([DBRONZE,DGEAR,DCART,DANVIL],5,'metal',2);setH([DFORGE,DSLAG],3,'stone',1);setH([DMOLTEN],5,'stone',2);setH([DLAMP],0.5,'misc');setH([DPROP],2,'wood');setH([DBANNER],0,'soft');
setH([WBARK,WPLANK,WCARVE,WRAIL],2,'wood');setH([WLEAF,WHEDGE,WTHATCH],0.4,'soft');setH([WLAMP],0.5,'misc');setH([WROOT],4,'stone',1);setH([WBANNER],0,'soft');
setH([EVSTONE,EVBRICK,EVCARVE,EVPILLAR,EVMOSAIC,EVTRACERY],4.5,'stone',1);setH([EVROOF,EVGOLD],4,'metal',2);setH([EVSHINGLE],2.5,'stone',1);setH([EVGLASS,EVLAMP],0.5,'misc');setH([EVBANNER],0,'soft');setH([EVWOOD],2,'wood');
const NID=4096,COLD_OF=new Uint16Array(NID);COLD_OF[LANTERN]=DLANTERN;COLD_OF[SCONCE]=DSCONCE;COLD_OF[TORCH]=DTORCH;COLD_OF[GLOW]=DGLOW;
setH([STONE,COBBLE,MOSSY,SBRICK,FURN,WAYPT],4,'stone',1);setH([DEEP],6,'stone',1);setH([GLOWMOSS],1.5,'misc');setH([SANDSTONE,TERO,TERB,TERT],3,'stone',1);setH([BRICK],5,'stone',1);
// Ore tiers follow the metal ladder (M4, Q19): each pickaxe is the first that can mine the next metal's ore
setH([COAL],5,'ore',1);setH([COPO,ZINO],5,'ore',2);setH([TINO,GOLD],5,'ore',3);setH([IRON],5,'ore',4);setH([PLATO,DIAMOND],6,'ore',5);setH([TITO],8,'ore',6);
setH([OBSID],25,'stone',7);setH([COPB,BRONB,BRASB,STEELB,TITB,PLATB,BLAST],6,'metal',2);setH([LANTERN,DLANTERN],1,'misc');setH([WAYSTONE],-1,'stone');setH([FARM_D,FARM_W],0.6,'soft');setH([GLOWSHROOM],0,'soft');setH([CRATE],1.5,'wood');setH([DRIPU,DRIPD],0.6,'stone',1);setH([CALCITE],3,'stone',1);setH([DWBRICK,DWTILE,DWPILLAR,DWCRACK,RUNE],5,'stone',1);setH([GOLDB],6,'metal',2);setH([DWCHEST,BARREL,LECTERN],2,'wood');setH([DWCRACK],2.5,'stone',1);setH([SCONCE],0.2,'misc');setH([BONES,COBWEB],0.3,'soft');setH([AMETH],2,'misc');setH([MUSHSTEM],1.5,'wood');setH([GLOWCAP],0.6,'soft');setH([WHEAT0,WHEAT1,WHEAT2,POT0,POT1,POT2,POT3],0,'soft');setH([GRAVE],0.5,'misc');setH([DSCONCE,DTORCH],0.2,'misc');setH([DGLOW],0.45,'misc');setH([LADDER],0.5,'wood');setH([CHEST],2,'wood');setH([BERRYB,MUSHB,WTURN,TURN0,TURN1,TURN2,BEAN0,BEAN1,BEAN2],0,'soft');setH([ROPE],0.2,'soft');setH([PITON,GRAPNEL],0.4,'misc');
BL[BEDROCK].hard=-1;BL[WATER].hard=-1;BL[LAVA].hard=-1;
const OPQ=new Uint8Array(NID),LUM=new Uint8Array(NID),SOLID=new Uint8Array(NID);
BL.forEach((b,i)=>{if(!b)return;OPQ[i]=b.opq?1:0;LUM[i]=b.lum;SOLID[i]=b.solid?1:0;});
const BIOMES=['The Western Sea','Grey Shore','Green Hills','Elder Wood','Heath Moors','High Mountains','Frozen Tundra','Barrow Hills','Shadowed Forest','Lake','Golden Steppe','Willow Vales'];
const BANDS=[TERO,TERT,TERB,TERO,TERO,TERT,TERB,TERB];
// Tools drawn as a block in the hand. The grappling hook (100) and fireworks (101) gave way to the grapnel and signal flares (M4, Q45).
// The Fill Tool (M5b) marks a box to fill, replace or clear (creative)
const BPTOOL=102,FILLTOOL=103,isTool=id=>id===BPTOOL||id===FILLTOOL,TOOLS={102:['Blueprint Tool',87,87],103:['Fill Tool',85,85]};
