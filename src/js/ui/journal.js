// ---- The journal and the discovery log (M7, D-047; Q17, Q27): pages read at lecterns, kept in order by hold; rune tablets read
// from the pack; the lands, layers, holds, remains and relics found. Saved with the world as jn; a world saved before M7 starts
// with an empty journal. The game still works with no goal at all: nothing here is required.
const TABLETS=[ // what the rune tablets say, read in this order (drafts for the owner, docs/LORE.md)
  'Strike once for the stone, once for the king, once for the ones below who never saw the sun.',
  'The lamp that is never put out is the hold that is never lost.',
  'Stone remembers what the delver forgets.',
  'Whoever cuts the living crystal cuts the song out of the mountain.',
  'Tin from the east, copper from the west, and brass from the meeting of the two.',
  'Seal the deep gate behind you. What the fire takes, the fire keeps.',
  'Seven steps between each landing, and a lamp at every seventh.',
  'The guest at the gate is fed before the king.',
  'Under the cracked tile, the savings of the careful.',
  'Water finds the weak seam. So does greed.',
  'Every hall was a cave once, and every cave will be a hall.',
  'When the last lamp is out, leave the door open for the ones who come after.'
];
const DISC=[['l','Lands',()=>LANDS.length],['y','Layers',()=>LAYER_BANDS.length],['h','Holds',null],['r','Remains of other peoples',null],['q','Relics',()=>RELICS.size]];
const LAYER_BANDS=['Crawlways','The Upper Caves','The Old Workings','The Great Caverns','The Deep','The Fire Below'];
const layerBand=y=>y<12?5:y<100?4:y<152?3:y<204?2:y<260?1:0;
const JN={h:{},t:0,d:{l:[],y:[],h:[],r:[],q:[]}};
if(saved&&saved.jn){const j=saved.jn;if(j.h)for(const k in j.h)JN.h[k]={n:String(j.h[k].n),p:(j.h[k].p||[]).filter(x=>x>=0&&x<CHRON_N)};JN.t=j.t|0;if(j.d)for(const [c] of DISC)if(Array.isArray(j.d[c]))JN.d[c]=j.d[c].slice(0,500);}
const journalSave=()=>({jn:JN});
// A chronicle page read at a lectern: kept once, in the order of the chronicle
function journalPage(cx,cz,k){
  const H0=holdNear(cx,cz),key=H0.rx+','+H0.rz,h=holdOf(cx,cz);let e=JN.h[key];if(!e)e=JN.h[key]={n:h.name,p:[]};
  if(e.p.includes(k))return false;e.p.push(k);e.p.sort((a,b)=>a-b);saveDirty=true;toast('A page of the chronicle of '+h.name+' is in your journal ('+e.p.length+' of '+CHRON_N+')');discover('h',h.name);return true;
}
// Reading a rune tablet: the next saying, in order
function readTablet(){const i=JN.t%TABLETS.length;if(JN.t<TABLETS.length){JN.t++;saveDirty=true;}showText('A rune tablet ('+(i+1)+' of '+TABLETS.length+')',TABLETS[i]+(JN.t<=TABLETS.length?'\n\nThe saying is copied into your journal.':''));tone(380,300,0.3,0.05);}
// The discovery log: a name recorded once in its category, with a word on screen the first time
function discover(c,v){const L=JN.d[c];if(!L||v===undefined||v===null||v===''||L.includes(v))return false;L.push(v);saveDirty=true;
  if(c!=='h'&&ready&&playing)toast('Discovered: '+(c==='l'?LANDS[LAND_I[v]].n:c==='q'?nameOf(v):v));return true;}
// Once a second: the land, layer, hold and remains around the player
let discT=0;
function discoverTick(dt){
  discT-=dt;if(discT>0||!ready)return;discT=1;
  if(LWX.k)discover('l',LWX.k);
  const bx=Math.floor(PL.x),bz=Math.floor(PL.z);if(bx<0||bz<0||bx>=W||bz>=D)return;const yy=Math.floor(PL.y),X=bx+OX,Z=bz+OZ;
  if(yy<ground[bx+W*bz]-3){discover('y',LAYER_BANDS[layerBand(yy)]);const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);
    if(yy<100&&ruinZone(cx,cz))discover('h',holdOf(cx,cz).name);const m=remainsNear(X,yy,Z);if(m)discover('r',m.name);}
}
// The journal: chronicle pages by hold (pages not yet found are marked), the tablets read, and the discovery log
function journalText(){
  const out=[],keys=Object.keys(JN.h);
  out.push('CHRONICLES');
  if(!keys.length)out.push('No pages yet. Lecterns in the dwarven holds keep the pages of each hold\'s chronicle.');
  for(const key of keys){const e=JN.h[key],[rx,rz]=key.split(',').map(Number),H0=holdAt(rx,rz),P=holdChronicle(H0.cx,H0.cz);
    out.push('','The Chronicle of '+e.n+' ('+e.p.length+' of '+CHRON_N+' pages)');
    for(let k=0;k<CHRON_N;k++)out.push(e.p.includes(k)?(k+1)+'. '+P[k][0]+'. '+P[k][1]:(k+1)+'. (a page not yet found)');}
  out.push('','RUNE TABLETS ('+Math.min(JN.t,TABLETS.length)+' of '+TABLETS.length+')');
  if(!JN.t)out.push('None read yet. Rune tablets turn up in the old holds; hold one and use it to read it.');
  for(let i=0;i<Math.min(JN.t,TABLETS.length);i++)out.push((i+1)+'. '+TABLETS[i]);
  out.push('','DISCOVERIES');
  for(const [c,n,tot] of DISC){const L=JN.d[c],names=c==='l'?L.map(k=>LANDS[LAND_I[k]].n):c==='q'?L.map(nameOf):L;out.push(n+': '+L.length+(tot?' of '+tot():'')+(names.length?' ('+names.join(', ')+')':''));}
  return out.join('\n');
}
function openJournal(){if(invOpen)closeInv();if(WM.open)closeWorldMap();showText('Journal',journalText());}
