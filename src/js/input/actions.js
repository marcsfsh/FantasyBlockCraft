// ---- Input actions: named actions, and the keys and controller buttons bound to them.
// Keyboard, controller and touch all dispatch through runAction, so a rebinding screen (M5) only edits settings.binds.
// Held controls (movement, jump, sprint) are read with keyHeld; analog sticks, triggers and the mouse stay in their own code.
const ACTIONS={
  inventory:{name:'Inventory',run:()=>{invOpen?closeInv():openInv();},anytime:true},
  jump:{name:'Jump, swim up, double tap to fly',run:()=>jumpPress()},
  fly:{name:'Fly on or off',run:()=>toggleFly()},
  respawn:{name:'Back to spawn',run:()=>respawn()},
  brush:{name:'Brush size',run:()=>cycleBrush()},
  swap:{name:'Replace mode',run:()=>toggleSwap()},
  photo:{name:'Photo mode',run:()=>setPhoto(!photo)},
  waypoint:{name:'Travel to the next waypoint',run:()=>nextWaypoint()},
  bpRotate:{name:'Turn blueprint',run:()=>{if(BP.sel>=0){BP.rot=(BP.rot+1)%4;toast('Blueprint turned '+BP.rot*90+' degrees');}}},
  bpClear:{name:'Clear blueprint',run:()=>{if(BP.sel>=0||BP.a){BP.sel=-1;BP.a=BP.b=null;toast('Blueprint cleared');}}},
  undo:{name:'Undo',run:()=>undo()},
  undoOrClear:{name:'Undo, or clear the blueprint',run:()=>{if(BP.sel>=0||BP.a)ACTIONS.bpClear.run();else undo();}},
  brushOrRotate:{name:'Brush size, or turn the blueprint',run:()=>{if(BP.sel>=0)ACTIONS.bpRotate.run();else cycleBrush();}},
  mapZoom:{name:'Map zoom',run:()=>{mmZoom=(mmZoom+1)%3;}},
  pick:{name:'Pick the block you look at',run:()=>act(1)},
  pause:{name:'Pause',run:()=>{playing=false;hold=-1;showPause();}},
  hotbarPrev:{name:'Previous slot',run:()=>{sel=(sel+8)%9;drawBar();}},
  hotbarNext:{name:'Next slot',run:()=>{sel=(sel+1)%9;drawBar();}}
};
for(let n=1;n<=9;n++)ACTIONS['slot'+n]={name:'Slot '+n,run:()=>{sel=n-1;drawBar();}};
// Default bindings: keyboard codes (KeyboardEvent.code) and standard-mapping controller button numbers
const BIND_DEFAULTS={
  keys:{KeyE:'inventory',Space:'jump',KeyF:'fly',KeyR:'respawn',KeyB:'brush',KeyV:'swap',KeyH:'photo',KeyT:'waypoint',KeyQ:'bpRotate',KeyX:'bpClear',KeyZ:'undo',KeyU:'undo',KeyM:'mapZoom',
        Digit1:'slot1',Digit2:'slot2',Digit3:'slot3',Digit4:'slot4',Digit5:'slot5',Digit6:'slot6',Digit7:'slot7',Digit8:'slot8',Digit9:'slot9'},
  held:{forward:['KeyW','ArrowUp'],back:['KeyS','ArrowDown'],left:['KeyA','ArrowLeft'],right:['KeyD','ArrowRight'],jump:['Space'],sprint:['ShiftLeft','ShiftRight']},
  // 0 A jump and 1 B down are held, 6/7 triggers place and break, 10 L3 sprint: those stay in the controller code
  pad:{2:'fly',3:'inventory',4:'hotbarPrev',5:'hotbarNext',8:'swap',9:'pause',11:'pick',12:'waypoint',13:'mapZoom',14:'undoOrClear',15:'brushOrRotate'}
};
const BINDS={};
function loadBinds(){const b=settings.binds||{};for(const k of ['keys','held','pad'])BINDS[k]=Object.assign({},BIND_DEFAULTS[k],b[k]||{});}
loadBinds();
function runAction(name){const a=ACTIONS[name];if(!a)return false;a.run();return true;}
function keyHeld(action){const codes=BINDS.held[action];if(!codes)return false;for(const c of codes)if(keys[c])return true;return false;}
