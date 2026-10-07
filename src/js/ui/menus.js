// Hotbar and block menu
function icon(id){if(isItem(id)){const c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').drawImage(itemIcon(id),0,0);return c;}return tileCanvas(isTool(id)?TOOLS[id][1]:BL[id].t[2]);}
let nameTimer=0;
function drawBar(quiet){
  const bar=$('bar');bar.innerHTML='';
  for(let i=0;i<9;i++){
    const id=SURV()?(inv[i]?inv[i].id:0):hot[i];
    const sl=document.createElement('div');sl.className='slot'+(i===sel?' on':'');if(id)sl.appendChild(icon(id));
    const n=document.createElement('span');n.textContent=i+1;sl.appendChild(n);
    if(SURV()&&inv[i]&&inv[i].c>1){const c=document.createElement('b');c.className='cnt';c.textContent=inv[i].c;sl.appendChild(c);}
    if(SURV()&&inv[i]&&ITEMS[inv[i].id]&&ITEMS[inv[i].id].power){const f=(inv[i].e||0)/ITEMS[inv[i].id].cap,bb=document.createElement('i');bb.className='dur';bb.style.width=(f*80)+'%';bb.style.background='#4ab0ff';sl.appendChild(bb);}
    if(SURV()&&inv[i]&&DUR[inv[i].id]&&inv[i].d){const f=1-inv[i].d/DUR[inv[i].id],bb=document.createElement('i');bb.className='dur';bb.style.width=(f*80)+'%';bb.style.background='hsl('+(f*120|0)+',80%,50%)';sl.appendChild(bb);}
    sl.addEventListener('pointerdown',e=>{e.stopPropagation();if(i===sel&&TOUCH){openInv();return;}sel=i;drawBar();});bar.appendChild(sl);
  }
  if(!quiet){const id=curId();if(id)showName(nameOf(id));}
  updateHand();saveDirty=true;
}
(function(){
  const g=$('invgrid'),CATS=[['Tools',[HOOK,FIREWORK,BPTOOL]],['Terrain',[DEEP,GLOWMOSS,GRASS,DIRT,PATH,FARM_D,SNOWG,STONE,COBBLE,MOSSY,SAND,SANDSTONE,RSAND,TERO,TERB,TERT,GRAVEL,ICE,OBSID]],
    ['Wood and plants',[HEATHER,SNOWLEAF,LOG,BIRCH,SPRUCE,JLOG,PLANKS,BOOKS,LEAVES,BLEAVES,SLEAVES,JLEAVES,CACTUS,TGRASS,FLOWR,FLOWY,DBUSH]],['Building',[BRICK,SBRICK,GLASS,WOOLW,WOOLR,WOOLY,WOOLG,WOOLB,WOOLK]],
    ['Ores',[COAL,COPO,TINO,ZINO,IRON,GOLD,PLATO,DIAMOND,TITO]],['Metals',[COPB,BRONB,BRASB,STEELB,TITB,PLATB]],['Power',[CHARGER,WIRE,COALGEN,WHEEL,SOLAR,BATTERY,LAMP_OFF,EFURN]],['Dwarven',[RAILX,RAILZ,BONES,COBWEB,SCONCE,LECTERN,DWBRICK,DWCRACK,DWTILE,DWPILLAR,RUNE,GOLDB,DWCHEST,BARREL]],['Light and special',[GLOWSHROOM,GLOWCAP,MUSHSTEM,AMETH,CALCITE,DRIPU,DRIPD,CRATE,POT3,TRADER,MINT,CRUSHER,SLUICE,WHEAT,TORCH,GLOW,LANTERN,CRYSTAL,WAYPT,TNT,SPONGE,WATER,FURN,BLAST]],['Items',Object.keys(ITEMS).map(Number)]].map(c=>[c[0],c[1].filter(id=>!BANNED.has(id))]).filter(c=>c[1].length);
  const seen=new Set();CATS.forEach(c=>c[1].forEach(id=>seen.add(id)));
  const rest=BL.map((b,i)=>b&&b.place&&!seen.has(i)?i:-1).filter(i=>i>=0);if(rest.length)CATS.push(['Other',rest]);
  CATS.forEach(([title,ids])=>{const h=document.createElement('div');h.className='inv-h';h.textContent=title;g.appendChild(h);
    ids.forEach(id=>{const nm=nameOf(id);const el=document.createElement('button');el.className='inv-item';el.title=nm;el.setAttribute('aria-label',nm);el.appendChild(icon(id));
      el.addEventListener('mouseenter',()=>{$('invname').textContent=nm;});
      el.addEventListener('click',()=>{hot[sel]=id;drawBar();closeInv();});g.appendChild(el);});});
})();
function openInv(){invOpen=true;
  $('trade').style.display='none';$('lore').style.display='none';$('bplist').style.display='flex';renderBlueprints($('bplist'));
  const sv=SURV();$('invgrid').style.display=sv?'none':'';$('invname').style.display=sv?'none':'';$('sinv').style.display=sv?'flex':'none';
  $('invtitle').textContent=sv?'Inventory and crafting':'Pick a block for slot '+(sel+1);heldSlot=-1;if(sv)renderSInv();
  $('inv').style.display='grid';hold=-1;if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;}
function closeInv(){invOpen=false;$('inv').style.display='none';lockOrPlay();}
$('inv').addEventListener('click',e=>{if(e.target.id==='inv')closeInv();});

// Overlay and settings
const KEYS_HTML=TOUCH
  ?'<div><b>Left side</b> drag to walk, push to the edge to run</div><div><b>Right side</b> drag to look</div><div><b>Tap</b> the view to place</div><div><b>Hold still</b> on the view to break</div><div><b>Arrow</b> jumps, double tap to fly</div><div><b>Tap TNT</b> with break to light it</div><div><b>Tap the selected slot</b> to swap its block</div><div><b>Arrow in midair</b> opens the glider</div><div><b>Hook</b> tap to fire, tap again to let go</div><div><b>Size</b> sets the brush, <b>Undo</b> rolls back</div><div><b>Swap</b> makes placing replace blocks</div><div><b>Photo mode</b> hides controls, tap to bring them back</div><div><b>Tap the map</b> to zoom out, then tap a waypoint to travel</div><div><b>Waypoints</b> shine a beam you can see from anywhere</div>'
  :'<div><b>WASD</b> move</div><div><b>Space</b> jump, swim up</div><div><b>Shift</b> sprint, or descend in flight</div><div><b>F</b> or double Space to fly</div><div><b>Left click</b> break, or light TNT</div><div><b>Right click</b> place</div><div><b>Middle click</b> pick block</div><div><b>1 to 9</b> or wheel to select</div><div><b>E</b> block menu</div><div><b>R</b> back to spawn</div><div><b>Space in midair</b> glide</div><div><b>Hook</b> right click to swing, again to let go</div><div><b>B</b> brush size</div><div><b>Z</b> undo</div><div><b>M</b> zoomed-out map</div><div><b>Double tap W</b> sprint</div><div><b>V</b> swap mode, placing replaces blocks</div><div><b>H</b> hide the HUD for screenshots</div><div><b>T</b> travel to your next waypoint</div><div><b>Waypoints</b> shine a beam you can see from anywhere</div>';
updateKeysHelp();
const fovr=$('fovr');fovr.value=settings.fov;fovr.addEventListener('input',()=>{settings.fov=+fovr.value;lsSet(SET_KEY,settings);});
const sens=$('sens');sens.value=settings.sens;sens.addEventListener('input',()=>{settings.sens=+sens.value;lsSet(SET_KEY,settings);});
function drawView(){[...$('viewseg').querySelectorAll('button')].forEach(b=>b.classList.toggle('on',+b.dataset.v===settings.view));FOGN=VIEWS[settings.view][0];FOGF=VIEWS[settings.view][1];}
$('viewseg').addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v===undefined)return;settings.view=+v;lsSet(SET_KEY,settings);drawView();});
drawView();
function segBind(id,key,parse){const el=$(id),draw=()=>[...el.querySelectorAll('button')].forEach(b=>b.classList.toggle('on',parse(b.dataset.v)===settings[key]));
  el.addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v===undefined)return;settings[key]=parse(v);lsSet(SET_KEY,settings);draw();});draw();}
segBind('timeseg','time',v=>v);
function drawMode(){[...$('modeseg').querySelectorAll('button')].forEach(b=>b.classList.toggle('on',b.dataset.v===mode));}
$('modeseg').addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v&&v!==mode){setMode(v);toast(v==='survival'?'Survival mode':'Creative mode');}});segBind('caveseg','cave',v=>+v);segBind('wxseg','weather',v=>v==='1');
const sndBtn=$('sndbtn');function drawSnd(){sndBtn.textContent=settings.sound?'Sound on':'Sound off';}drawSnd();
sndBtn.addEventListener('click',()=>{settings.sound=!settings.sound;lsSet(SET_KEY,settings);drawSnd();if(settings.sound)audioInit();});
$('play').addEventListener('click',lockOrPlay);
$('respawnbtn').addEventListener('click',revive);
$('photo').addEventListener('click',()=>{setPhoto(true);lockOrPlay();toast('');});
let confirmNew=false;
$('newworld').addEventListener('click',()=>{
  if(edits.size&&!confirmNew){confirmNew=true;$('newworld').textContent='Tap again to replace this world';return;}
  const sv=$('seedin').value.trim();
  if(sv){let n;if(/^\d+$/.test(sv))n=Number(sv)%2147483646+1;else{let h=0;for(const ch of sv)h=(Math.imul(31,h)+ch.charCodeAt(0))|0;n=Math.abs(h)%2147483646+1;}lsSet('blockcraft-nextseed',n);}
  lsDel(SAVE_KEY);skipSave=true;location.reload();
});
function showPause(){$('overlay').style.display='grid';$('play').textContent='Resume';$('status').textContent='Paused. Your world saves on its own.';}

