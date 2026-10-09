// ---- Controls (M5a, Q37, Q38, Q39): names for keys and buttons, the rebinding panel in the pause menu, the help panel built from
// the bindings in use (by device and by mode), and the readout toggle.
const KEY_NAMES={Space:'Space',ShiftLeft:'Left Shift',ShiftRight:'Right Shift',ControlLeft:'Left Ctrl',ControlRight:'Right Ctrl',AltLeft:'Left Alt',AltRight:'Right Alt',
  ArrowUp:'Up',ArrowDown:'Down',ArrowLeft:'Left',ArrowRight:'Right',Tab:'Tab',Enter:'Enter',Backspace:'Backspace',CapsLock:'Caps Lock',Backquote:'`',Minus:'-',Equal:'=',
  BracketLeft:'[',BracketRight:']',Semicolon:';',Quote:"'",Comma:',',Period:'.',Slash:'/',Backslash:'\\'};
const keyName=c=>KEY_NAMES[c]||(c.startsWith('Key')?c.slice(3):c.startsWith('Digit')?c.slice(5):c.replace(/^Numpad/,'Num '));
const PAD_NAMES=['A','B','X','Y','LB','RB','LT','RT','View','Menu','Left stick click','Right stick click','D-pad up','D-pad down','D-pad left','D-pad right'];
const padName=b=>PAD_NAMES[b]||('Button '+b);
const keysOf=a=>Object.keys(BINDS.keys).filter(c=>BINDS.keys[c]===a);
const padOf=a=>Object.keys(BINDS.pad).filter(b=>BINDS.pad[b]===a).map(Number);
// How the player does an action on the device in use, for hints: 'right click', 'LT', 'the pack button'...
function ctl(a){
  const dev=PAD.active?'pad':TOUCH?'touch':'keys';
  const fixed={place:{keys:'right click',pad:'LT',touch:'tapping the view'},break:{keys:'left click',pad:'RT',touch:'holding on the view'},
    jump:{keys:keyName(BINDS.held.jump[0]||'Space'),pad:'A',touch:'the arrow'},sprint:{keys:keyName(BINDS.held.sprint[0]||'ShiftLeft'),pad:'B',touch:'the down arrow'},
    inventory:{touch:'the pack button'}};
  if(fixed[a]&&fixed[a][dev])return fixed[a][dev];
  if(dev==='pad'){const b=padOf(a);return b.length?padName(b[0]):'the pause menu';}
  if(dev==='touch')return 'its button';
  const k=keysOf(a);return k.length?keyName(k[0]):'the pause menu';
}
// ---- Help (Q38): what each control does in this mode, on this device
const HELP={inventory:['inventory and crafting','block menu'],worldMap:['world map: places, waystones and your markers'],mapZoom:['minimap zoom'],waypoint:['travel to the next waystone, from beside one','travel to the next waystone'],
  photo:['hide the HUD for screenshots'],hud:['readout on or off'],pick:['select the block you look at in the hotbar','pick the block you look at'],pause:['pause and settings'],
  hotbarPrev:['previous slot'],hotbarNext:['next slot'],fly:[null,'fly on or off'],noclip:[null,'noclip: fly through blocks'],respawn:[null,'back to spawn'],brush:[null,'brush size'],
  swap:[null,'replace mode: placing replaces blocks'],undo:[null,'undo'],bpRotate:[null,'turn the blueprint'],bpClear:[null,'clear the blueprint'],
  undoOrClear:[null,'undo, or clear the blueprint'],brushOrRotate:[null,'brush size, or turn the blueprint']};
const helpText=a=>{const h=HELP[a];if(!h)return null;return SURV()?h[0]:(h[1]===undefined?h[0]:h[1]);};
const TIPS_SURV=[['Grapnel','place it at a wall below a ledge to hang rope'],['Waystones','touch one to attune it; travel only between attuned stones'],
  ['Lantern','wear it in the belt slot; it burns lamp oil or pitch candles in the dark'],['Chests','what you leave in them stays']];
function helpRows(){
  const s=SURV(),rows=[];
  if(PAD.active){
    rows.push(['Left stick','move; click it to sprint'],['Right stick','look'],['A','jump, swim up, climb'+(s?'':'; double tap to fly')],['B',s?'climb down':'fly down, climb down'],
      ['RT',s?'break, hold to mine':'break'],['LT',s?'place, use, eat':'place, use']);
    for(const b of Object.keys(BINDS.pad).map(Number).sort((x,y)=>x-y)){const t=helpText(BINDS.pad[b]);if(t)rows.push([padName(b),t]);}
  }else if(TOUCH){
    rows.push(['Left side','drag to walk, push to the edge to run'],['Right side','drag to look'],['Tap','the view to place'+(s?', use or eat':'')],['Hold still','on the view to break'],
      ['Arrow','jump, climb'+(s?'':'; double tap to fly')],['Down arrow',s?'climb down':'fly down, climb down'],['Tap the map','to zoom out'+(s?'':', then tap a waystone to travel')]);
    if(!s)rows.push(['Clip','noclip: fly through blocks'],['Size','brush size'],['Undo','roll back'],['Swap','placing replaces blocks']);
  }else{
    const mv=['forward','left','back','right'].map(a=>keyName(BINDS.held[a][0]||'?')).join(' ');
    rows.push([mv,'move'],[keyName(BINDS.held.jump[0]||'?'),'jump, swim up, climb'+(s?'':'; double tap to fly')],
      [keyName(BINDS.held.sprint[0]||'?'),'sprint, climb down'+(s?'':', fly down')+'; double tap forward to sprint'],
      ['Left click',s?'hold to break; light a Blasting Keg':'break; light a Blasting Keg'],['Right click',s?'place; use chests, lecterns and waystones; eat':'place; use blocks'],
      ['Middle click',helpText('pick')],['1 to 9, wheel','choose a hotbar slot']);
    const seen=new Set();for(const c of Object.keys(BINDS.keys)){const a=BINDS.keys[c];if(a.startsWith('slot')||seen.has(a))continue;const t=helpText(a);if(!t)continue;seen.add(a);rows.push([keysOf(a).map(keyName).join(' or '),t]);}
    rows.push(['Esc','pause and settings']);
  }
  if(s)rows.push(...TIPS_SURV);else rows.push(['Fill Tool','break sets one corner, place the other; then fill, replace or clear the box'],['Pause menu','time of day, rain, go to coordinates, test structures']);
  return rows;
}
const escH=t=>String(t).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[ch]);
function helpHTML(){return helpRows().map(([k,t])=>'<div><b>'+escH(k)+'</b> '+escH(t)+'</div>').join('');}
// ---- The readout (Q39): on by default, I or the pause menu turns it off
function setHud(on){settings.hud=on;lsSet(SET_KEY,settings);$('info').style.display=on?'':'none';const el=$('hudseg');if(el)[...el.querySelectorAll('button')].forEach(b=>b.classList.toggle('on',(b.dataset.v==='1')===on));}
// ---- Rebinding (Q37): every remappable action with its keyboard keys and controller button; tap a cell, then press the new one
const BIND_ROWS=[['held','forward','Move forward'],['held','back','Move back'],['held','left','Move left'],['held','right','Move right'],['held','jump','Jump, swim up, climb'],
  ['held','sprint','Sprint, climb down'],['act','inventory','Inventory'],['act','pick','Pick block'],['act','hotbarPrev','Previous slot'],['act','hotbarNext','Next slot'],
  ['act','worldMap','World map'],['act','mapZoom','Minimap zoom'],['act','waypoint','Travel to the next waystone'],['act','photo','Photo mode'],['act','hud','Readout on or off'],['act','pause','Pause'],
  ['act','fly','Fly (creative)'],['act','noclip','Noclip (creative)'],['act','brush','Brush size (creative)'],['act','swap','Replace mode (creative)'],['act','undo','Undo (creative)'],
  ['act','undoOrClear','Undo or clear blueprint (creative)'],['act','brushOrRotate','Brush or turn blueprint (creative)'],['act','respawn','Back to spawn (creative)'],
  ['act','bpRotate','Turn blueprint (creative)'],['act','bpClear','Clear blueprint (creative)'],...[1,2,3,4,5,6,7,8,9].map(n=>['act','slot'+n,'Slot '+n])];
let capture=null; // {kind:'keys'|'held'|'pad', action}
function bindLabel(kind,a){
  if(kind==='pad'){if(a==='jump')return 'A (fixed)';if(a==='sprint')return 'Left stick click (fixed)';const b=padOf(a);return b.length?b.map(padName).join(', '):'None';}
  const k=kind==='held'?BINDS.held[a]:keysOf(a);return k.length?k.map(keyName).join(', '):'None';
}
function renderControls(){
  const box=$('ctl');if(!box)return;box.innerHTML='';
  const h=document.createElement('div');h.className='inv-h';h.textContent='Controls: tap a key or button, then press the new one. Esc or B cancels.';box.appendChild(h);
  const t=document.createElement('div');t.className='ctlgrid';
  const head=(x)=>{const d=document.createElement('div');d.className='ch';d.textContent=x;t.appendChild(d);};head('Action');head('Keyboard');head('Controller');
  for(const [kind,a,label] of BIND_ROWS){
    const n=document.createElement('div');n.textContent=label;t.appendChild(n);
    const cell=(k,enabled,other)=>{const b=document.createElement('button');const on=capture&&capture.kind===k&&capture.action===a;
      b.textContent=on?(k==='pad'?'Press a button':'Press a key'):enabled?bindLabel(k,a):(other||'-');b.disabled=!enabled;if(on)b.className='on';
      b.addEventListener('click',()=>{capture={kind:k,action:a};renderControls();});t.appendChild(b);};
    cell(kind==='held'?'held':'keys',!(kind==='act'&&a.startsWith('undoOr'))&&!(kind==='act'&&(a==='brushOrRotate'||a==='pause')));
    cell('pad',kind==='act'&&!a.startsWith('slot'),a==='jump'||a==='sprint'?bindLabel('pad',a):'-');
  }
  box.appendChild(t);
  const r=document.createElement('button');r.textContent='Reset all to defaults';r.addEventListener('click',()=>{resetBinds();capture=null;renderControls();updateKeysHelp();toast('Controls reset');});box.appendChild(r);
}
// Finish a capture with a key code or a button number; returns what happened, for the panel and the tests
function captureInput(kind,code){
  if(!capture)return 'none';
  if(kind==='keys'&&code==='Escape'){capture=null;renderControls();return 'cancelled';}
  if(kind==='pad'&&code===1&&capture.kind==='pad'){capture=null;renderControls();return 'cancelled';}
  if((kind==='pad')!==(capture.kind==='pad'))return 'ignored';
  if(capture.kind==='pad'&&(capture.action==='jump'||capture.action==='sprint')){capture=null;renderControls();return 'fixed';}
  const ok=rebind(capture.kind,capture.action,code);
  if(!ok)toast(padName(code)+' is fixed: '+PAD_FIXED[code]);
  capture=null;renderControls();updateKeysHelp();return ok?'bound':'fixed';
}
addEventListener('keydown',e=>{if(!capture||capture.kind==='pad')return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)captureInput('keys',e.code);},true);
