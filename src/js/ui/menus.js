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
    if(SURV()&&inv[i]&&durOf(inv[i].id)&&inv[i].d){const f=1-inv[i].d/durOf(inv[i].id),bb=document.createElement('i');bb.className='dur';bb.style.width=(f*80)+'%';bb.style.background='hsl('+(f*120|0)+',80%,50%)';sl.appendChild(bb);}
    sl.addEventListener('pointerdown',e=>{e.stopPropagation();if(i===sel&&TOUCH){openInv();return;}sel=i;drawBar();});bar.appendChild(sl);
  }
  if(!quiet){const id=curId();if(id)showName(nameOf(id));}
  updateHand();saveDirty=true;
}
(function(){
  const g=$('invgrid'),CATS=[['Tools',[BPTOOL,FILLTOOL,LADDER,PITON,ROPE]],['Terrain',[DEEP,GLOWMOSS,GRASS,DIRT,PATH,FARM_D,SNOWG,STONE,COBBLE,MOSSY,SAND,SANDSTONE,RSAND,TERO,TERB,TERT,GRAVEL,ICE,OBSID]],
    ['Wood and plants',[HEATHER,SNOWLEAF,LOG,BIRCH,SPRUCE,JLOG,...NEW_LOGS,PLANKS,...NEW_PLANKS,BOOKS,LEAVES,BLEAVES,SLEAVES,JLEAVES,...NEW_LEAVES,LITTER,NEEDLES,FMOSS,FERN,BLUEB,MOONP,CACTUS,TGRASS,FLOWR,FLOWY,DBUSH,BERRYB,MUSHB,WTURN]],['Building',[CHEST,BRICK,SBRICK,GLASS,WOOLW,WOOLR,WOOLY,WOOLG,WOOLB,WOOLK]],
    ['Ores',[COAL,COPO,TINO,ZINO,IRON,GOLD,PLATO,DIAMOND,TITO]],['Metals',[COPB,BRONB,BRASB,STEELB,TITB,PLATB]],['Dwarven',[BONES,COBWEB,SCONCE,LECTERN,DWBRICK,DWCRACK,DWTILE,DWPILLAR,RUNE,GOLDB,DWCHEST,BARREL]],['Light and special',[GLOWSHROOM,GLOWCAP,MUSHSTEM,AMETH,CALCITE,DRIPU,DRIPD,CRATE,POT3,WHEAT,TORCH,GLOW,LANTERN,DTORCH,DGLOW,DLANTERN,DSCONCE,WAYSTONE,CRYSTAL,WAYPT,TNT,SPONGE,WATER,FURN,BLAST]],['Items',Object.keys(ITEMS).map(Number)]].map(c=>[c[0],c[1].filter(id=>!BANNED.has(id))]).filter(c=>c[1].length);
  const seen=new Set();CATS.forEach(c=>c[1].forEach(id=>seen.add(id)));
  const rest=BL.map((b,i)=>b&&b.place&&!seen.has(i)&&!BANNED.has(i)?i:-1).filter(i=>i>=0);if(rest.length)CATS.push(['Other',rest]);
  CATS.forEach(([title,ids])=>{const h=document.createElement('div');h.className='inv-h';h.textContent=title;g.appendChild(h);
    ids.forEach(id=>{const nm=nameOf(id);const el=document.createElement('button');el.className='inv-item';el.title=nm;el.setAttribute('aria-label',nm);el.appendChild(icon(id));
      el.addEventListener('mouseenter',()=>{$('invname').textContent=nm;});
      el.addEventListener('click',()=>{hot[sel]=id;drawBar();closeInv();});g.appendChild(el);});});
})();
function openInv(){invOpen=true;
  const sv=SURV();$('lore').style.display='none';$('invsearch').style.display=sv?'none':'';$('invsearch').value='';filterBlocks('');$('bplist').style.display=sv?'none':'flex';if(!sv)renderBlueprints($('bplist')); // the Blueprint Tool is creative only (Q42)
  $('invgrid').style.display=sv?'none':'';$('invname').style.display=sv?'none':'';$('sinv').style.display=sv?'flex':'none';
  $('invtitle').textContent=sv?(box?nameOf(get(box.x,box.y,box.z)):'Inventory and crafting'):'Pick a block for slot '+(sel+1);heldSlot=-1;if(sv)renderSInv();
  $('inv').style.display='grid';hold=-1;if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;}
function closeInv(){invOpen=false;box=null;$('inv').style.display='none';lockOrPlay();}
$('inv').addEventListener('click',e=>{if(e.target.id==='inv')closeInv();});

// Overlay and settings
updateKeysHelp();
const fovr=$('fovr');fovr.value=settings.fov;fovr.addEventListener('input',()=>{settings.fov=+fovr.value;lsSet(SET_KEY,settings);});
const sens=$('sens');sens.value=settings.sens;sens.addEventListener('input',()=>{settings.sens=+sens.value;lsSet(SET_KEY,settings);});
function drawView(){[...$('viewseg').querySelectorAll('button')].forEach(b=>b.classList.toggle('on',+b.dataset.v===settings.view));if(settings.view<0){FOGF=AUTO_VIEW.far;FOGN=FOGF*0.55;}else{FOGN=VIEWS[settings.view][0];FOGF=VIEWS[settings.view][1];}}
$('viewseg').addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v===undefined)return;settings.view=+v;lsSet(SET_KEY,settings);drawView();});
drawView();
function segBind(id,key,parse){const el=$(id),draw=()=>[...el.querySelectorAll('button')].forEach(b=>b.classList.toggle('on',parse(b.dataset.v)===settings[key]));
  el.addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v===undefined)return;settings[key]=parse(v);lsSet(SET_KEY,settings);draw();});draw();}
segBind('timeseg','time',v=>v);
// creative tools in the pause menu (M5b): time of day, the weather now, going to coordinates, test structures
$('invsearch').addEventListener('input',e=>filterBlocks(e.target.value));$('invsearch').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape')closeInv();});
$('todr').addEventListener('input',e=>{setTimeOfDay(e.target.value);[...$('timeseg').querySelectorAll('button')].forEach(b=>b.classList.remove('on'));});
$('wxnow').addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v){setWeatherNow(v==='rain');toast(v==='rain'?'Rain is coming':'The sky clears');}});
$('gobtn').addEventListener('click',()=>{if(creativeOnly())return;if(goTo($('gox').value,$('goz').value,$('goy').value))lockOrPlay();else toast('Type X and Z as numbers');});
['gox','goy','goz'].forEach(id=>$(id).addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')$('gobtn').click();}));
{const sel=$('stampsel');for(const k in STAMPS){const o=document.createElement('option');o.value=k;o.textContent=STAMPS[k];sel.appendChild(o);}
  $('stampbtn').addEventListener('click',()=>{if(stampHere(sel.value))lockOrPlay();});}
{const sel=$('toursel');for(const f in LAND_FAM){const g=document.createElement('optgroup');g.label=LAND_FAM[f];
    for(const L of LANDS)if(L.fam===f){const o=document.createElement('option');o.value=L.i;o.textContent=L.n+(L.built?'':' (planned)');g.appendChild(o);}sel.appendChild(g);}
  $('tourbtn').addEventListener('click',()=>{if(landTour(+sel.value))lockOrPlay();});}
segBind('hintseg','hints',v=>v==='1');
$('hudseg').addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v!==undefined)setHud(v==='1');});setHud(settings.hud!==false);
$('ctlbtn').addEventListener('click',()=>{const c=$('ctl'),open=c.style.display==='none';c.style.display=open?'':'none';capture=null;if(open)renderControls();});
segBind('resseg','res',v=>v);$('resseg').addEventListener('click',()=>{setRes(resTarget());}); // Auto restarts from the full density
segBind('touchseg','touch',v=>v);$('touchseg').addEventListener('click',e=>{if(e.target.dataset&&e.target.dataset.v){saveNow();location.reload();}}); // the layout is chosen at load
function drawClip(){[...$('clipseg').querySelectorAll('button')].forEach(b=>b.classList.toggle('on',b.dataset.v===(PL.noclip?'1':'0')));}
$('clipseg').addEventListener('click',e=>{const v=e.target.dataset&&e.target.dataset.v;if(v&&(v==='1')!==PL.noclip)toggleNoclip();});drawClip();
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
    const sm=document.createElement('small');sm.textContent='seed '+w.seed+', '+w.mode+(w.played?', played '+new Date(w.played).toLocaleDateString():'');t.appendChild(sm);row.appendChild(t);
    const btn=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.addEventListener('click',fn);row.appendChild(b);return b;};
    btn('Rename',()=>{const inp=document.createElement('input');inp.value=w.name;inp.maxLength=40;inp.setAttribute('aria-label','New name for '+w.name);t.replaceChildren(inp);inp.focus();inp.select();
      const done=ok=>{if(ok&&renameWorld(w.id,inp.value))toast('Renamed to '+WIX.list.find(x=>x.id===w.id).name);renderWorlds();};
      inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')done(true);else if(e.key==='Escape')done(false);});inp.addEventListener('blur',()=>done(true));});
    if(w.id!==WIX.active)btn('Play',()=>switchWorld(w.id));
    btn('Export',()=>{const txt=exportWorld(w.id);if(txt){downloadText(w.name.replace(/[^\w -]+/g,'').trim().replace(/ +/g,'-')+'.fbcworld.json',txt);toast('Exported '+w.name);}});
    if(w.id!==WIX.active)btn(delArm===w.id?'Sure?':'Delete',()=>{if(delArm!==w.id){delArm=w.id;renderWorlds();return;}delArm=null;deleteWorld(w.id);toast('Deleted '+w.name);renderWorlds();});
    box.appendChild(row);
  });
  const imp=document.createElement('button');imp.textContent='Import a world file';imp.addEventListener('click',()=>$('importfile').click());box.appendChild(imp);
}
renderWorlds();
$('importfile').addEventListener('change',e=>{const f=e.target.files&&e.target.files[0];if(!f)return;f.text().then(txt=>{try{const w=importWorld(txt);toast('Imported '+w.name);renderWorlds();}catch(err){toast(err.message);}e.target.value='';});});
function showPause(){renderWorlds();updateKeysHelp();$('overlay').style.display='grid';$('play').textContent='Resume';$('status').textContent='Paused. Your world saves on its own.';}

