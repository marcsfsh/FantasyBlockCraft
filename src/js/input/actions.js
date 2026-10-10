// ---- Input actions: named actions, and the keys and controller buttons bound to them.
// Keyboard, controller and touch all dispatch through runAction, so a rebinding screen (M5) only edits settings.binds.
// Held controls (movement, jump, sprint) are read with keyHeld; analog sticks, triggers and the mouse stay in their own code.
const ACTIONS={
  inventory:{name:'Inventory',run:()=>{invOpen?closeInv():openInv();},anytime:true},
  jump:{name:'Jump, swim up, double tap to fly',run:()=>jumpPress()},
  fly:{name:'Fly on or off',crea:1,run:()=>toggleFly()},
  noclip:{name:'Noclip on or off (fly through blocks)',crea:1,run:()=>toggleNoclip()},
  respawn:{name:'Back to spawn',crea:1,run:()=>{if(SURV()){toast('In survival you travel from waystone to waystone');return;}respawn();}},
  brush:{name:'Brush size',crea:1,run:()=>cycleBrush()},
  swap:{name:'Replace mode',crea:1,run:()=>toggleSwap()},
  photo:{name:'Photo mode',run:()=>setPhoto(!photo)},
  hud:{name:'Readout on or off',run:()=>setHud(!settings.hud)},
  waypoint:{name:'Travel to the next waystone',run:()=>nextWaypoint()},
  bpRotate:{name:'Turn blueprint',crea:1,run:()=>{if(BP.sel>=0){BP.rot=(BP.rot+1)%4;toast('Blueprint turned '+BP.rot*90+' degrees');}}},
  bpClear:{name:'Clear blueprint',crea:1,run:()=>{if(BP.sel>=0||BP.a){BP.sel=-1;BP.a=BP.b=null;toast('Blueprint cleared');}}},
  undo:{name:'Undo',crea:1,run:()=>undo()},
  undoOrClear:{name:'Undo, or clear the blueprint',crea:1,run:()=>{if(BP.sel>=0||BP.a)ACTIONS.bpClear.run();else undo();}},
  brushOrRotate:{name:'Brush size, or turn the blueprint',crea:1,run:()=>{if(BP.sel>=0)ACTIONS.bpRotate.run();else cycleBrush();}},
  mapZoom:{name:'Map zoom',run:()=>{mmZoom=(mmZoom+1)%3;}},
  worldMap:{name:'World map',run:()=>{WM.open?closeWorldMap():openWorldMap();}},
  journal:{name:'Journal',run:()=>{invOpen?closeInv():openJournal();},anytime:true},
  pick:{name:'Pick the block you look at',run:()=>act(1)},
  pause:{name:'Pause',run:()=>{playing=false;hold=-1;showPause();}},
  hotbarPrev:{name:'Previous slot',run:()=>{sel=(sel+8)%9;drawBar();}},
  hotbarNext:{name:'Next slot',run:()=>{sel=(sel+1)%9;drawBar();}}
};
for(let n=1;n<=9;n++)ACTIONS['slot'+n]={name:'Slot '+n,run:()=>{sel=n-1;drawBar();}};
// Default bindings: keyboard codes (KeyboardEvent.code) and standard-mapping controller button numbers
const BIND_DEFAULTS={
  keys:{KeyE:'inventory',Space:'jump',KeyF:'fly',KeyN:'noclip',KeyR:'respawn',KeyB:'brush',KeyV:'swap',KeyH:'photo',KeyT:'waypoint',KeyQ:'bpRotate',KeyX:'bpClear',KeyZ:'undo',KeyU:'undo',KeyM:'worldMap',KeyL:'journal',KeyJ:'mapZoom',KeyI:'hud',
        Digit1:'slot1',Digit2:'slot2',Digit3:'slot3',Digit4:'slot4',Digit5:'slot5',Digit6:'slot6',Digit7:'slot7',Digit8:'slot8',Digit9:'slot9'},
  held:{forward:['KeyW','ArrowUp'],back:['KeyS','ArrowDown'],left:['KeyA','ArrowLeft'],right:['KeyD','ArrowRight'],jump:['Space'],sprint:['ShiftLeft','ShiftRight']},
  // 0 A jump and 1 B down are held, 6/7 triggers place and break, 10 L3 sprint: those stay in the controller code (PAD_FIXED).
  // Travel sits on D-pad down since M5 (Q37): D-pad up, easy to press by accident, opens the world map (M5b).
  pad:{2:'fly',3:'inventory',4:'hotbarPrev',5:'hotbarNext',8:'swap',9:'pause',11:'pick',12:'worldMap',13:'waypoint',14:'undoOrClear',15:'brushOrRotate'}
};
const BINDS={};
const PAD_FIXED={0:'jump',1:'down',6:'place',7:'break',10:'sprint'};
// Saved bindings (settings.binds, M5) are kept as they are; a default comes back only for an action left with no key or button
// at all, and only if its key or button is free, so actions added in later versions still get one.
function loadBinds(){
  const b=settings.binds||{},h={};
  for(const a in BIND_DEFAULTS.held)h[a]=[...(b.held&&Array.isArray(b.held[a])&&b.held[a].length?b.held[a]:BIND_DEFAULTS.held[a])];BINDS.held=h;
  const heldCodes=new Set(Object.values(h).flat());
  for(const k of ['keys','pad']){const m={};for(const [c,a] of Object.entries(b[k]||{}))if(ACTIONS[a]&&!(k==='keys'&&heldCodes.has(c))&&!(k==='pad'&&PAD_FIXED[c]))m[c]=a;
    const bound=new Set(Object.values(m));for(const [c,a] of Object.entries(BIND_DEFAULTS[k]))if(!bound.has(a)&&m[c]===undefined&&!(k==='keys'&&heldCodes.has(c)))m[c]=a;
    BINDS[k]=m;}
}
function saveBinds(){settings.binds={keys:Object.assign({},BINDS.keys),pad:Object.assign({},BINDS.pad),held:JSON.parse(JSON.stringify(BINDS.held))};lsSet(SET_KEY,settings);}
// Bind a key (kind 'keys' or 'held') or a controller button ('pad') to an action. It replaces what the action had, and is taken
// away from whatever else used it. Returns false for the controller's fixed buttons.
function rebind(kind,action,code){
  if(kind==='pad'){if(PAD_FIXED[code]!==undefined)return false;for(const c in BINDS.pad)if(BINDS.pad[c]===action)delete BINDS.pad[c];BINDS.pad[code]=action;saveBinds();return true;}
  delete BINDS.keys[code];for(const a in BINDS.held)BINDS.held[a]=BINDS.held[a].filter(c=>c!==code);
  if(kind==='held')BINDS.held[action]=[code];else{for(const c in BINDS.keys)if(BINDS.keys[c]===action)delete BINDS.keys[c];BINDS.keys[code]=action;}
  saveBinds();return true;
}
function resetBinds(){settings.binds={};lsSet(SET_KEY,settings);loadBinds();}
loadBinds();
function runAction(name){const a=ACTIONS[name];if(!a)return false;a.run();return true;}
function keyHeld(action){const codes=BINDS.held[action];if(!codes)return false;for(const c of codes)if(keys[c])return true;return false;}
