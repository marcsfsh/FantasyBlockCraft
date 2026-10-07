const $=id=>document.getElementById(id);
const TOUCH=window.matchMedia('(pointer:coarse)').matches;
if(TOUCH)document.body.classList.add('touch');

// Settings and save data
const W=224,D=224,H=384,SEA=310,CS=16,NCX=W/CS,NCZ=D/CS,VOL=W*H*D;
const SKY=0xa9d3ff,SAVE_KEY='fantasy-blockcraft-save-v1',SET_KEY='blockcraft-settings-v1';
function lsGet(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
function lsDel(k){try{localStorage.removeItem(k);}catch(e){}}
const saved=lsGet(SAVE_KEY);
const nextSeed=lsGet('blockcraft-nextseed');if(nextSeed!==null)lsDel('blockcraft-nextseed');
const SEED=saved&&saved.seed?saved.seed:(nextSeed||((Math.random()*2147483000|0)+1));
const settings=Object.assign({cave:1,fov:75,sens:1,view:TOUCH?0:1,sound:true,time:'cycle',weather:true},lsGet(SET_KEY)||{});
const VIEWS=[[34,70],[50,90],[60,98]];

