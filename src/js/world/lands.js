// ---- Lands (M6a, D-039; Q108, Q118, Q119, Q124, Q131): the registry of every land, the transition map of which lands may
// border which, and the layout. The world is cut into cells about LS blocks across (jittered, with warped, organic edges); each
// cell takes one land from the climate at its centre (warmth, damp, relief, sea or coast), never one that may not border a
// neighbour, and often adopts a neighbour's common land, so common lands grow large and rare ones stay single cells.
// A land not built yet stands in with the look of a built land (look: the old biome id), so the layout holds when its family
// arrives in M6b to M6h. The Grey Shore and Lakes are edges, not areas: the shore where any land meets the sea, lakes inside lands.
// Warmth bands: 0 cold, 1 cool, 2 temperate, 3 warm, 4 hot. Damp: 0 dry, 1 middling, 2 wet. Relief (bits): 1 low, 2 hills, 4 high.
const LAND_FAM={kept:'Old lands',forest:'Forests (M6b)',high:'Highlands and cold (M6c)',coast:'Coasts and waters (M6d)',dry:'Dry and fiery (M6e)',strange:'Strange lands (M6f)',men:'Old lands of men (M6g)'};
const TIERS=['','common','uncommon','rare'],TIER_W=[0,6,2,1];
const LANDS=[];
// k key, n name, fam family, tier, t warmth range, m damp range, r relief bits, look (old biome id drawn until built),
// p naming people, s signature [landmark structure, natural feature]; o: sea (a sea land), coast (only beside the sea),
// built (has its own look now), never (keys it may not border), gorge (how often gorges cut it, 0 to 1), was (old land it replaces)
function land(k,n,fam,tier,t,m,r,look,p,s,o){LANDS.push(Object.assign({k:k,n:n,fam:fam,tier:tier,t:t,m:m,r:r,look:look,p:p,s:s,sea:false,coast:false,built:false,never:[],gorge:0.4},o||{}));}
// the old lands (built)
land('sea','The Western Sea','kept',1,[0,4],[0,2],7,0,'human',['a wreck on the shoals','sea stacks'],{sea:true,built:true,gorge:0});
land('green','Green Hills','kept',1,[1,3],[1,1],3,2,'halfling',['an earthwork hill fort','a lone great oak on a knoll'],{built:true,gorge:0.3});
land('elder','Elder Wood','kept',1,[2,3],[1,2],1,3,'woodelf',['a moss-grown woodland shrine','a hollow elder you can walk into'],{built:true});
land('moors','Heath Moors','kept',1,[1,2],[0,1],3,4,'human',['a watch cairn on a tor','granite tors'],{built:true,gorge:0.8});
land('mtn','High Mountains','kept',1,[0,3],[0,2],4,5,'dwarf',['a gatehouse in a high pass','a high tarn under the peaks'],{built:true,gorge:1});
land('barrow','Barrow Hills','kept',2,[1,2],[0,1],3,7,'human',['a great chambered barrow','long rows of standing stones'],{built:true,gorge:0.3});
land('shadow','Shadowed Forest','kept',2,[2,4],[2,2],3,8,'drow',['a temple sunk among the roots','a fallen giant spanning a hollow'],{built:true,gorge:0.5});
// old lands reworked into new ones (Q119): until their family is built they keep the old look and name
land('steppe','Golden Steppe','dry',1,[2,4],[0,0],3,10,'beastfolk',['a ring of horse stones','a lone rock outcrop over the grass'],{was:'Windswept Plains',gorge:0.3});
land('willow','Willow Vales','forest',1,[2,3],[2,2],1,11,'halfling',['a stilt house over the water','willow-ringed pools with islets'],{was:'Fens',gorge:0,built:true,col:[104,150,96]});
land('tundra','Frozen Tundra','high',1,[0,0],[0,1],3,6,'dwarf',['a frozen longhouse','frost mounds and ice wedges'],{was:'Northern Fells',gorge:0.6});
// forests (M6b)
land('autumn','Autumn Woods','forest',1,[1,2],[1,1],3,3,'woodelf',['a woodcutters\' lodge','a red-leaf glade around a still pond'],{built:true,col:[184,100,48]});
land('birch','Birch Glades','forest',1,[1,2],[1,2],3,2,'woodelf',['a birch-bark shrine','a ring of white birches round a clearing'],{built:true,col:[160,190,112]});
land('pine','Pine Highlands','forest',1,[0,1],[1,2],6,4,'dwarf',['a timber watch post','a lookout rock above the pines'],{gorge:0.7,built:true,col:[44,92,66]});
land('giant','Ancient Giant Wood','forest',3,[2,3],[2,2],1,3,'highelf',['a platform ruin high in a giant tree','a giant tree over forty blocks tall'],{never:['blight'],built:true,col:[34,76,36]});
land('yew','Yew Wood','forest',2,[1,2],[1,2],3,3,'woodelf',['a ruined archers\' hall','an ancient hollow yew'],{built:true,col:[54,82,52]});
land('silver','Silverwood','forest',2,[1,2],[1,2],3,2,'highelf',['a moon-gate arch','a silver-leaf grove round a spring'],{never:['blight','volcanic'],built:true,col:[170,194,186]});
// highlands and cold (M6c)
land('alpine','Alpine Meadows','high',2,[0,2],[1,2],4,5,'dwarf',['a shepherd\'s hut on the high pasture','a meadow tarn under a peak'],{gorge:0.8});
land('glacier','Glacier Fields','high',2,[0,0],[0,2],4,5,'dwarf',['a tower bound in the ice','crevasses and ice caves'],{gorge:0.6});
land('cloud','Cloud Forest Heights','high',2,[2,4],[1,2],4,5,'woodelf',['a mist shrine on a crag','mossy falls into the cloud'],{gorge:0.8});
land('karst','Karst Crags','high',2,[1,3],[0,1],6,4,'gnome',['a hermitage in a cliff','a great sinkhole into the caves'],{gorge:1});
// coasts and waters (M6d)
land('chalk','Chalk Cliffs','coast',2,[1,3],[0,2],3,2,'human',['a beacon tower on the cliff top','a chalk sea arch'],{coast:true,gorge:0.3});
land('isles','Rocky Isles','coast',2,[0,4],[0,2],7,0,'human',['a ruined chapel on an isle','sea arches and stacks'],{sea:true,coast:true,gorge:0});
land('fjord','Fjords','coast',2,[0,1],[0,2],6,5,'dwarf',['a boathouse at a fjord\'s head','a fall from the fjord wall'],{coast:true,gorge:0.8});
land('blacksand','Black Sand Shores','coast',2,[2,4],[0,2],1,10,'human',['a black-stone harbour wall','basalt columns on the shore'],{coast:true,gorge:0});
land('kelp','Kelp Shallows','coast',2,[2,4],[0,2],7,0,'human',['a sunken causeway','kelp forests'],{sea:true,coast:true,gorge:0});
land('bog','Raised Bogs','coast',2,[0,2],[2,2],1,11,'halfling',['an old plank trackway across the bog','a domed bog with pools and cotton grass'],{gorge:0});
// dry and fiery (M6e)
land('dry','Southern Drylands','dry',1,[4,4],[0,0],3,10,'beastfolk',['a temple half buried in sand','a dry wadi with an old well'],{gorge:0.6});
land('volcanic','Volcanic Wastes','dry',2,[3,4],[0,0],6,4,'drow',['a ruined fire shrine','a smoking cone with a lava lake held in rock'],{gorge:0.8});
land('blight','Blighted Lands','dry',2,[1,3],[0,1],3,4,'orc',['a dead lord\'s ruined hall','grey dead trees and ash pools'],{never:['flower','orchard','farm','giant','silver']});
// strange lands (M6f)
land('crystal','Crystal Barrens','strange',3,[0,1],[0,0],6,6,'gnome',['a crystal cutters\' ruin','crystal spires']);
land('glowcap','Glowcap Hollows','strange',3,[2,3],[2,2],3,8,'gnome',['a mushroom dwelling','giant glowing mushrooms in a hollow']);
land('petrified','Petrified Forest','strange',3,[3,4],[0,0],3,10,'beastfolk',['a waystation turned to stone','trees of stone']);
land('starfall','Starfall Craters','strange',3,[1,3],[0,1],3,4,'highelf',['a ruined star tower','a crater round a starmetal heart']);
// old lands of men (M6g)
land('farm','Overgrown Farmland','men',2,[1,3],[1,1],1,2,'human',['an abandoned manor farm','wild crops in old furrows'],{gorge:0.1});
land('orchard','Wild Orchards','men',2,[2,4],[1,1],1,2,'halfling',['an orchard keeper\'s cottage','rows of gnarled fruit trees'],{gorge:0.1});
land('flower','Flower Meadows','men',2,[2,3],[1,2],1,2,'halfling',['a shrine wreathed in flowers','bands of wildflowers'],{gorge:0.1});
land('terrace','Old Terraces','men',2,[2,4],[0,1],2,2,'human',['a terraced village ruin','stone-walled terraces down a hillside'],{gorge:0.2});
const LAND_I={};LANDS.forEach((L,i)=>{L.i=i;LAND_I[L.k]=i;});
// What a land shows as until it is built: its own name, or the old land it stands in for
const landShown=L=>L.built?L.n:L.was||BIOMES[L.look];
// ---- The transition map: two lands may border if their warmth bands are at most one apart, their damp at most one apart,
// and neither names the other in its never list. A land may always border itself.
const bandGap=(a,b)=>Math.max(0,b[0]-a[1],a[0]-b[1]);
function landsMeet(a,b){if(a===b)return true;const A=LANDS[a],B=LANDS[b];
  return bandGap(A.t,B.t)<=1&&bandGap(A.m,B.m)<=1&&!A.never.includes(B.k)&&!B.never.includes(A.k);}
const LAND_MEET=LANDS.map((_,a)=>LANDS.map((_,b)=>landsMeet(a,b)));
// ---- Cells: a site per cell (jittered by up to a quarter cell), the climate at the site, and the land
const LS=320,LCELL=new Map(),landKey=(i,j)=>(i+32768)*65536+(j+32768);
function landClimate(X,Z){
  const C=fbm2(X/1700,Z/1700,3,11.3),T=fbm2(X/4200,Z/4200,2,151.9),M=fbm2(X/3200,Z/3200,2,701.9),R=fbm2(X/1500,Z/1500,2,73.1);
  return{sea:C<-0.17,tb:T<-0.24?0:T<-0.09?1:T<0.09?2:T<0.24?3:4,mb:M<-0.12?0:M<0.12?1:2,rb:R>0.17?4:R>0.0?2:1};
}
function landSite(i,j){
  const key=landKey(i,j);let c=LCELL.get(key);if(c)return c;if(LCELL.size>60000)LCELL.clear();
  const x=(i+0.5+(hsh(i,8101,j)-0.5)*0.5)*LS,z=(j+0.5+(hsh(i,8103,j)-0.5)*0.5)*LS;
  c={i:i,j:j,x:x,z:z,cl:landClimate(x,z),pr:hsh(i,8111,j),L:-1,coastal:null};LCELL.set(key,c);return c;
}
const LN8=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
function cellCoastal(c){if(c.coastal===null){c.coastal=false;for(const [a,b] of LN8)if(landSite(c.i+a,c.j+b).cl.sea!==c.cl.sea){c.coastal=true;break;}}return c.coastal;}
// How badly a land fits a cell's climate (lower is better); Infinity where it cannot go at all
function landFit(L,c){
  const cl=c.cl;if(L.sea!==cl.sea)return Infinity;if(L.coast&&!cellCoastal(c))return Infinity;
  return bandGap(L.t,[cl.tb,cl.tb])*3+bandGap(L.m,[cl.mb,cl.mb])+((L.r&cl.rb)?0:1.5);
}
// The land of a cell. Neighbours with a higher priority are settled first; this cell then keeps a land every one of them may
// border. Settled neighbours' common lands spread to it eight times in ten when they suit its climate (uncommon ones two in ten).
function cellLand(c){
  if(c.L>=0)return c.L;
  const hi=[];for(const [a,b] of LN8){const n=landSite(c.i+a,c.j+b);if(n.pr>c.pr)hi.push(cellLand(n));}
  // a land a settled diagonal neighbour has, where neither cell between them has it, would meet it only at a corner (a pinch)
  const pinch=new Set();for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const d=landSite(c.i+a,c.j+b),e1=landSite(c.i+a,c.j),e2=landSite(c.i,c.j+b);
    if(d.pr>c.pr&&e1.pr>c.pr&&e2.pr>c.pr){const L=cellLand(d);if(cellLand(e1)!==L&&cellLand(e2)!==L)pinch.add(L);}}
  const ok=L=>hi.every(h=>LAND_MEET[L][h])&&!pinch.has(L);
  let best=Infinity;const fit=LANDS.map(L=>{const f=landFit(L,c);if(f<best)best=f;return f;});
  const cand=LANDS.filter((L,k)=>fit[k]<=best);
  // bridge a corner: where two settled side neighbours share a land and the settled cell diagonally between them does not, the
  // two would meet only at a point, so this cell takes their land when it can
  for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const e1=landSite(c.i+a,c.j),e2=landSite(c.i,c.j+b),d=landSite(c.i+a,c.j+b);
    if(e1.pr>c.pr&&e2.pr>c.pr&&d.pr>c.pr){const L=cellLand(e1);if(cellLand(e2)===L&&cellLand(d)!==L&&fit[L]<Infinity&&ok(L))return c.L=L;}}
  // adopt a neighbour's land
  const ad=hsh(c.i,8123,c.j);
  for(const h of hi){const L=LANDS[h];if(fit[h]<=best+0.5&&(L.tier===1?ad<0.8:L.tier===2?ad<0.2:false)&&ok(h))return c.L=h;}
  // or draw one by tier from the best fits, then from any land that fits at all, keeping only lands the neighbours may border
  const draw=list=>{let tot=0;for(const L of list)tot+=TIER_W[L.tier];let u=hsh(c.i,8127,c.j)*tot;for(const L of list){u-=TIER_W[L.tier];if(u<=0)return L.i;}return list.length?list[list.length-1].i:-1;};
  let L=draw(cand.filter(x=>ok(x.i)));
  if(L<0){const any=LANDS.filter((x,k)=>fit[k]<Infinity&&ok(k)).sort((a,b)=>fit[a.i]-fit[b.i]);if(any.length)L=draw(any.filter(x=>fit[x.i]<=fit[any[0].i]));}
  if(L<0){const any=LANDS.filter((x,k)=>fit[k]<Infinity&&hi.every(h=>LAND_MEET[k][h]));if(any.length)L=draw(any);}
  if(L<0)L=draw(cand); // nothing may border every neighbour: keep the best fit (the tests check this never happens)
  return c.L=L;
}
// ---- Per column: the blend of nearby cells. Each cell's weight falls from 1 at the border to 0 at blend/2 blocks inside the
// next cell; weights are added up by look for the terrain, and the column's land is the heaviest one, chosen against a patchy
// threshold near borders so lands mix over the band (Q92). Mountains and the sea blend wider.
const LOOK_BLEND=[110,70,70,70,110,220,70,110,70,70,70,70],LW=new Float64Array(LANDS.length),LWL=new Float64Array(12),LSC=[];
for(let k=0;k<16;k++)LSC.push({c:null,d:0});
function landsAt(X,Z,o){
  const wx=X+fbm2(X/280,Z/280,1,8201.3)*45+fbm2(X/60,Z/60,1,8203.9)*5,wz=Z+fbm2(X/280,Z/280,1,8207.1)*45+fbm2(X/60,Z/60,1,8209.7)*5; // never folds over
  const ci=Math.floor(wx/LS-0.5),cj=Math.floor(wz/LS-0.5);let n=0,d1=Infinity,c1=null;
  for(let b=-1;b<=2;b++)for(let a=-1;a<=2;a++){const c=landSite(ci+a,cj+b),d=Math.hypot(wx-c.x,wz-c.z),s=LSC[n++];s.c=c;s.d=d;if(d<d1){d1=d;c1=c;}}
  LW.fill(0);LWL.fill(0);let wsea=0,wall=0,wland=0;
  let dm=Infinity,dn=Infinity;
  for(let k=0;k<n;k++){const s=LSC[k],L=LANDS[cellLand(s.c)],lk=L.look;
    if(lk===5){if(s.d<dm)dm=s.d;}else if(s.d<dn)dn=s.d;
    const w=sstep(LOOK_BLEND[lk],0,s.d-d1);if(w<=0)continue; // each cell's own width, so weights never jump where the nearest cell changes
    LW[L.i]+=w;wall+=w;if(L.sea)wsea+=w;else{LWL[lk]+=w;wland+=w;}}
  o.wS=wsea/wall;for(let k=0;k<12;k++)LWL[k]=wland>0?LWL[k]/wland:0;
  o.w2=LWL[2];o.w3=LWL[3];o.w4=LWL[4];o.w5=LWL[5];o.w6=LWL[6];o.w7=LWL[7];o.w8=LWL[8];o.w10=LWL[10];o.w11=LWL[11];
  o.area=c1.L; // the land of the cell the column lies in: the layout before border mixing (maps, sizes, the transition map)
  o.mdep=dm<Infinity?(dn-dm)/2:-999; // how far inside a mountain land (blocks), for the high peaks at its heart
  // the column's land: the heaviest, or the second against a patchy threshold
  let a1=-1,a2=-1;for(let k=0;k<LW.length;k++){if(!LW[k])continue;if(a1<0||LW[k]>LW[a1]){a2=a1;a1=k;}else if(a2<0||LW[k]>LW[a2])a2=k;}
  const dth=fbm2(X/16,Z/16,1,2711.3)*0.4;
  o.land=a2>=0&&LW[a2]/(LW[a1]+LW[a2])>0.5+dth?a2:a1;
  let g=0;for(let k=0;k<LW.length;k++)if(LW[k])g+=LW[k]*LANDS[k].gorge;o.gz=g/wall;
  // the cell the column's land comes from (the nearest of that land), for its name and climate
  let bc=null,bd=Infinity;for(let k=0;k<n;k++){const s=LSC[k];if(s.c.L===o.land&&s.d<bd){bd=s.d;bc=s.c;}}
  o.lcell=landKey(bc.i,bc.j);o.tb=bc.cl.tb;
  return o;
}
// ---- Stretch names (Q131): each stretch of a land has its own name in its people's style. Neighbouring cells of the same land
// share the name of the highest-priority cell among them, so a stretch spans a few cells.
const LNAME=new Map();
function stretchCell(c){let best=c;for(const [a,b] of LN8){const n=landSite(c.i+a,c.j+b);if(cellLand(n)===cellLand(c)&&n.pr>best.pr)best=n;}return best===c?c:stretchCell(best);}
function stretchName(key){
  let s=LNAME.get(key);if(s)return s;if(LNAME.size>20000)LNAME.clear();
  const i=Math.floor(key/65536)-32768,j=key%65536-32768,c=stretchCell(landSite(i,j)),L=LANDS[cellLand(c)];
  const w=nameWord(L.p,rngAt(c.i,8131,c.j)),base=landShown(L);
  s=L.sea?'The Sea of '+w:(base.startsWith('The ')?base.slice(4):base)+' of '+w;LNAME.set(key,s);return s;
}
// The name the readout shows on open land: the stretch's name, or the edge it is on (the Grey Shore, a lake, open sea)
const TLN={};
function landPlaceName(X,Z){colInfo(X,Z,TLN);if(TLN.lake)return BIOMES[9];if(TLN.b===1)return BIOMES[1];if(TLN.b===0&&!LANDS[TLN.land].sea)return BIOMES[0];return stretchName(TLN.lcell);}
// Where a new world starts (M6a): the nearest cell centre of a built land that is open lowland (not sea, mountains or fens),
// on dry ground, searching outward from X 0, Z 0; the window is centred there before generation
function landSpawn(){
  const o={};let best=null,bd=Infinity;
  for(let r=0;r<=6&&!best;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const c=landSite(a,b),L=LANDS[cellLand(c)];
    if(L.sea||!L.built||L.look===5||L.look===11)continue;const X=Math.round(c.x),Z=Math.round(c.z);colInfo(X,Z,o);
    if(o.h<SEA+3||o.wet||o.lake||o.river||o.b===0||o.b===9)continue;const d=Math.hypot(X,Z);if(d<bd){bd=d;best=[X,Z];}}
  return best||[0,0];
}
// The nearest cell centre of a land to a point (for the land tour), searching outward ring by ring up to rmax cells
function nearestLand(k,X,Z,rmax){
  const ci=Math.floor(X/LS),cj=Math.floor(Z/LS);let best=null,bd=Infinity;
  for(let r=0;r<=rmax;r++){
    for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const c=landSite(ci+a,cj+b);
      if(cellLand(c)!==k)continue;const d=Math.hypot(c.x-X,c.z-Z);if(d<bd){bd=d;best=c;}}
    if(best&&bd<(r-1)*LS)break;}
  return best?{X:Math.round(best.x),Z:Math.round(best.z),d:Math.round(bd)}:null;
}
