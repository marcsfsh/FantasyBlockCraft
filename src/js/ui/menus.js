// Hotbar and block menu
function icon(id){if(isItem(id)){const c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').drawImage(itemIcon(id),0,0);return c;}return tileCanvas(isTool(id)?TOOLS[id][1]:BL[id].t[2]);}
let nameTimer=0;
function showName(t){const el=$('name');el.textContent=t;el.style.opacity=1;clearTimeout(nameTimer);nameTimer=setTimeout(()=>{el.style.opacity=0;},1400);}
function drawBar(quiet){
  const bar=$('bar');bar.innerHTML='';
  for(let i=0;i<9;i++){
    const id=SURV()?(inv[i]?inv[i].id:0):hot[i];
    const sl=document.createElement('div');sl.className='slot'+(i===sel?' on':'');if(id)sl.appendChild(icon(id));
    const n=document.createElement('span');n.textContent=i+1;sl.appendChild(n);
    if(SURV()&&inv[i]&&inv[i].c>1){const c=document.createElement('b');c.className='cnt';c.textContent=inv[i].c;sl.appendChild(c);}
    if(SURV()&&inv[i]&&DUR[inv[i].id]&&inv[i].d){const f=1-inv[i].d/DUR[inv[i].id],bb=document.createElement('i');bb.className='dur';bb.style.width=(f*80)+'%';bb.style.background='hsl('+(f*120|0)+',80%,50%)';sl.appendChild(bb);}
    sl.addEventListener('pointerdown',e=>{e.stopPropagation();if(i===sel&&TOUCH){openInv();return;}sel=i;drawBar();});bar.appendChild(sl);
  }
  if(!quiet){const id=curId();if(id)showName(nameOf(id));}
  updateHand();saveDirty=true;
}
(function(){
  const g=$('invgrid'),CATS=[['Tools',[HOOK,FIREWORK,BPTOOL]],['Terrain',[DEEP,GLOWMOSS,GRASS,DIRT,PATH,FARM_D,SNOWG,STONE,COBBLE,MOSSY,SAND,SANDSTONE,RSAND,TERO,TERB,TERT,GRAVEL,ICE,OBSID]],
    ['Wood and plants',[HEATHER,SNOWLEAF,LOG,BIRCH,SPRUCE,JLOG,PLANKS,BOOKS,LEAVES,BLEAVES,SLEAVES,JLEAVES,CACTUS,TGRASS,FLOWR,FLOWY,DBUSH]],['Building',[BRICK,SBRICK,GLASS,WOOLW,WOOLR,WOOLY,WOOLG,WOOLB,WOOLK]],
    ['Ores',[COAL,COPO,TINO,ZINO,IRON,GOLD,PLATO,DIAMOND,TITO]],['Metals',[COPB,BRONB,BRASB,STEELB,TITB,PLATB]],['Dwarven',[BONES,COBWEB,SCONCE,LECTERN,DWBRICK,DWCRACK,DWTILE,DWPILLAR,RUNE,GOLDB,DWCHEST,BARREL]],['Light and special',[GLOWSHROOM,GLOWCAP,MUSHSTEM,AMETH,CALCITE,DRIPU,DRIPD,CRATE,POT3,WHEAT,TORCH,GLOW,LANTERN,DTORCH,DGLOW,DLANTERN,DSCONCE,WAYSTONE,CRYSTAL,WAYPT,TNT,SPONGE,WATER,FURN,BLAST]],['Items',Object.keys(ITEMS).map(Number)]].map(c=>[c[0],c[1].filter(id=>!BANNED.has(id))]).filter(c=>c[1].length);
  const seen=new Set();CATS.forEach(c=>c[1].forEach(id=>seen.add(id)));
  const rest=BL.map((b,i)=>b&&b.place&&!seen.has(i)&&!BANNED.has(i)?i:-1).filter(i=>i>=0);if(rest.length)CATS.push(['Other',rest]);
  CATS.forEach(([title,ids])=>{const h=document.createElement('div');h.className='inv-h';h.textContent=title;g.appendChild(h);
    ids.forEach(id=>{const nm=nameOf(id);const el=document.createElement('button');el.className='inv-item';el.title=nm;el.setAttribute('aria-label',nm);el.appendChild(icon(id));
      el.addEventListener('mouseenter',()=>{$('invname').textContent=nm;});
      el.addEventListener('click',()=>{hot[sel]=id;drawBar();closeInv();});g.appendChild(el);});});
})();
function openInv(){invOpen=true;
  $('lore').style.display='none';$('bplist').style.display='flex';renderBlueprints($('bplist'));
  const sv=SURV();$('invgrid').style.display=sv?'none':'';$('invname').style.display=sv?'none':'';$('sinv').style.display=sv?'flex':'none';
  $('invtitle').textContent=sv?'Inventory and crafting':'Pick a block for slot '+(sel+1);heldSlot=-1;if(sv)renderSInv();
  $('inv').style.display='grid';hold=-1;if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;}
function closeInv(){invOpen=false;$('inv').style.display='none';lockOrPlay();}
$('inv').addEventListener('click',e=>{if(e.target.id==='inv')closeInv();});

// Overlay and settings
const KEYS_HTML=TOUCH
  ?'<div><b>Left side</b> drag to walk, push to the edge to run</div><div><b>Right side</b> drag to look</div><div><b>Tap</b> the view to place</div><div><b>Hold still</b> on the view to break</div><div><b>Arrow</b> jumps, double tap to fly</div><div><b>Tap a Blasting Keg</b> with break to light it</div><div><b>Tap the selected slot</b> to swap its block</div><div><b>Arrow in midair</b> opens the glider</div><div><b>Hook</b> tap to fire, tap again to let go</div><div><b>Size</b> sets the brush, <b>Undo</b> rolls back</div><div><b>Swap</b> makes placing replace blocks</div><div><b>Photo mode</b> hides controls, tap to bring them back</div><div><b>Tap the map</b> to zoom out, then tap a waypoint to travel</div><div><b>Waypoints</b> shine a beam you can see from anywhere</div>'
  :'<div><b>WASD</b> move</div><div><b>Space</b> jump, swim up</div><div><b>Shift</b> sprint, or descend in flight</div><div><b>F</b> or double Space to fly</div><div><b>Left click</b> break, or light a Blasting Keg</div><div><b>Right click</b> place</div><div><b>Middle click</b> pick block</div><div><b>1 to 9</b> or wheel to select</div><div><b>E</b> block menu</div><div><b>R</b> back to spawn</div><div><b>Space in midair</b> glide</div><div><b>Hook</b> right click to swing, again to let go</div><div><b>B</b> brush size</div><div><b>Z</b> undo</div><div><b>M</b> zoomed-out map</div><div><b>Double tap W</b> sprint</div><div><b>V</b> swap mode, placing replaces blocks</div><div><b>H</b> hide the HUD for screenshots</div><div><b>T</b> travel to your next waypoint</div><div><b>Waypoints</b> shine a beam you can see from anywhere</div>';
updateKeysHelp();
const fovr=$('fovr');fovr.value=settings.fov;fovr.addEventListener('input',()=>{settings.fov=+fovr.value;lsSet(SET_KEY,settings);});
const sens=$('sens');sens.value=settings.sens;sens.addEventListener('input',()=>{settings.sens=+sens.value;lsSet(SET_KEY,settings);});
function drawView(){[...$('viewseg').querySelectorAll('button')].forEach(b=>b.classList.toggle('on',+b.dataset.v===settings.view));FOGN=VIEWS[settings.view][0];FOGF=VIEWS[settings.view][1];}
$('viewseg').addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v===undefined)return;settings.view=+v;lsSet(SET_KEY,settings);drawView();});
drawView();
function segBind(id,key,parse){const el=$(id),draw=()=>[...el.querySelectorAll('button')].forEach(b=>b.classList.toggle('on',parse(b.dataset.v)===settings[key]));
  el.addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v===undefined)return;settings[key]=parse(v);lsSet(SET_KEY,settings);draw();});draw();}
segBind('timeseg','time',v=>v);
segBind('touchseg','touch',v=>v);$('touchseg').addEventListener('click',e=>{if(e.target.dataset&&e.target.dataset.v){saveNow();location.reload();}}); // the layout is chosen at load
function drawMode(){[...$('modeseg').querySelectorAll('button')].forEach(b=>b.classList.toggle('on',b.dataset.v===mode));}
$('modeseg').addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v&&v!==mode){setMode(v);toast(v==='survival'?'Survival mode':'Creative mode');}});segBind('caveseg','cave',v=>+v);segBind('wxseg','weather',v=>v==='1');
const sndBtn=$('sndbtn');function drawSnd(){sndBtn.textContent=settings.sound?'Sound on':'Sound off';}drawSnd();
sndBtn.addEventListener('click',()=>{settings.sound=!settings.sound;lsSet(SET_KEY,settings);drawSnd();if(settings.sound)audioInit();});
$('play').addEventListener('click',lockOrPlay);
$('respawnbtn').addEventListener('click',revive);
$('photo').addEventListener('click',()=>{setPhoto(true);lockOrPlay();toast('');});
$('newworld').addEventListener('click',()=>{const w=createWorld($('worldname').value.trim(),parseSeed($('seedin').value),settings.newMode||mode);switchWorld(w.id);});
// The world list: play another world, export any world to a file, delete worlds you are not in, import a file
let delArm=null;
function renderWorlds(){
  const box=$('worlds');box.innerHTML='';
  const h=document.createElement('div');h.className='inv-h';h.textContent='Your worlds';box.appendChild(h);
  [...WIX.list].sort((a,b)=>(b.played||0)-(a.played||0)).forEach(w=>{
    const row=document.createElement('div');row.className='wrow'+(w.id===WIX.active?' on':'');
    const t=document.createElement('div');t.className='t';t.textContent=w.name+(w.id===WIX.active?' (playing)':'');
    const sm=document.createElement('small');sm.textContent='seed '+w.seed+', '+w.mode;t.appendChild(sm);row.appendChild(t);
    const btn=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.addEventListener('click',fn);row.appendChild(b);return b;};
    if(w.id!==WIX.active)btn('Play',()=>switchWorld(w.id));
    btn('Export',()=>{const txt=exportWorld(w.id);if(txt){downloadText(w.name.replace(/[^\w -]+/g,'').trim().replace(/ +/g,'-')+'.fbcworld.json',txt);toast('Exported '+w.name);}});
    if(w.id!==WIX.active)btn(delArm===w.id?'Sure?':'Delete',()=>{if(delArm!==w.id){delArm=w.id;renderWorlds();return;}delArm=null;deleteWorld(w.id);toast('Deleted '+w.name);renderWorlds();});
    box.appendChild(row);
  });
  const imp=document.createElement('button');imp.textContent='Import a world file';imp.addEventListener('click',()=>$('importfile').click());box.appendChild(imp);
}
renderWorlds();
$('importfile').addEventListener('change',e=>{const f=e.target.files&&e.target.files[0];if(!f)return;f.text().then(txt=>{try{const w=importWorld(txt);toast('Imported '+w.name);renderWorlds();}catch(err){toast(err.message);}e.target.value='';});});
function showPause(){renderWorlds();$('overlay').style.display='grid';$('play').textContent='Resume';$('status').textContent='Paused. Your world saves on its own.';}

