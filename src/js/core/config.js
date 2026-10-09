const $=id=>document.getElementById(id);
// Touch layout: the Touch setting (auto/on/off, read before settings load) or, on auto, a coarse pointer with no precise pointer at all
const TOUCH=(p=>p==='on'||(p!=='off'&&window.matchMedia('(pointer:coarse)').matches&&!window.matchMedia('(any-pointer:fine)').matches))((lsGet('blockcraft-settings-v1')||{}).touch);
if(TOUCH)document.body.classList.add('touch');

// Settings and save data
const W=224,D=224,H=512,SEA=310,CS=16,NCX=W/CS,NCZ=D/CS,VOL=W*H*D;
const SKY=0xa9d3ff,SAVE_KEY='fantasy-blockcraft-save-v8',SET_KEY='blockcraft-settings-v1';
function lsGet(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
function lsDel(k){try{localStorage.removeItem(k);}catch(e){}}
// Worlds: an index under SAVE_KEY ({active, list:[{id,name,seed,mode,created,played}]}) and each world's data under SAVE_KEY+':'+id.
// Bumping SAVE_KEY retires every world: saves always yield to updates (D-019).
for(const k of ['fantasy-blockcraft-save-v1','fantasy-blockcraft-save-v2','fantasy-blockcraft-save-v3','fantasy-blockcraft-save-v4','blockcraft-nextseed'])lsDel(k); // retired formats: free their storage
const worldKey=id=>SAVE_KEY+':'+id;
function worldIndex(){const x=lsGet(SAVE_KEY);return x&&Array.isArray(x.list)?x:{active:null,list:[]};}
function newWorldEntry(name,seed,mode){return{id:'w'+Date.now().toString(36)+(Math.random()*1679616|0).toString(36),name:name,seed:seed||((Math.random()*2147483000|0)+1),mode:mode==='creative'?'creative':'survival',created:Date.now(),played:Date.now()};}
const WIX=worldIndex();
if(!WIX.list.some(w=>w.id===WIX.active)){if(!WIX.list.length)WIX.list.push(newWorldEntry('World 1',0,(lsGet(SET_KEY)||{}).newMode));WIX.active=WIX.list[0].id;lsSet(SAVE_KEY,WIX);}
const WORLD=WIX.list.find(w=>w.id===WIX.active);
const saved=(d=>d&&d.v===8&&d.seed===WORLD.seed?d:null)(lsGet(worldKey(WORLD.id)));
const SEED=WORLD.seed;
const settings=Object.assign({touch:'auto',cave:1,fov:75,sens:1,view:-1,sound:true,time:'cycle',weather:true},lsGet(SET_KEY)||{});
const VIEWS=[[34,70],[50,90],[60,98]];
// Auto view distance (view -1, the default; M3, D-025): start from the device, then follow the frame rate.
// AUTO_VIEW.far moves between 56 and 104 blocks; the near fog is 55% of it.
const AUTO_VIEW={far:(()=>{const m=navigator.deviceMemory,c=navigator.hardwareConcurrency||4;return TOUCH||(m&&m<4)?64:c>=8?96:84;})(),refresh:1/60,t:0,n:0,sum:0,work:0,fast:1};

