// Controls and interface (M5a): better defaults, rebinding with conflicts and reset, saved bindings, the help panel by device
// and mode, one-time hints, the readout toggle, renaming worlds.
while(genQ.length)processGenQ();
const store={};localStorage.setItem=(k,v)=>{store[k]=v;};
settings.binds={};loadBinds();
// ---- better defaults (Q37): travel is off D-pad up
assert(BINDS.pad[12]==='mapZoom'&&BINDS.pad[13]==='waypoint','D-pad up opens the map; travel moved to D-pad down');
assert(BINDS.keys.KeyI==='hud','I turns the readout on and off');
// ---- rebinding a key takes it from whatever had it, and the action keeps only the new key
assert(rebind('keys','inventory','KeyR'),'a key can be bound');
assert(BINDS.keys.KeyR==='inventory'&&!BINDS.keys.KeyE&&!Object.values(BINDS.keys).includes('respawn'),'R now opens the inventory, E is free, and spawn travel lost its key');
assert(settings.binds.keys.KeyR==='inventory'&&JSON.parse(store[SET_KEY]).binds.keys.KeyR==='inventory','the new binding is saved with the settings');
rebind('held','forward','KeyO');assert(BINDS.held.forward.join()==='KeyO'&&keyHeld('forward')===false,'a movement key can be rebound');
keys.KeyO=true;assert(keyHeld('forward'),'the new movement key moves');keys.KeyO=false;
rebind('keys','photo','KeyO');assert(BINDS.keys.KeyO==='photo'&&BINDS.held.forward.length===0,'binding a movement key elsewhere takes it from movement');
// ---- saved bindings load as they were; an action with nothing bound gets its default back if that key is free
const saved=JSON.parse(JSON.stringify(settings.binds));settings.binds=saved;loadBinds();
assert(BINDS.keys.KeyR==='inventory'&&!BINDS.keys.KeyE,'saved bindings come back as saved (E is not given back to the inventory)');
assert(BINDS.keys.KeyO==='photo'&&!BINDS.keys.KeyH,'photo keeps its new key only (H is not given back)');
assert(BINDS.held.forward.join()==='KeyW,ArrowUp','a movement control left with no key gets its defaults back on load');
// ---- controller: fixed buttons refuse, others rebind
assert(!rebind('pad','fly',0)&&BINDS.pad[0]===undefined,'the A button is fixed (jump) and cannot be rebound');
assert(rebind('pad','waypoint',12)&&BINDS.pad[12]==='waypoint'&&BINDS.pad[13]===undefined&&!Object.values(BINDS.pad).includes('mapZoom'),'a controller button can be rebound: it leaves its old button and takes the new one from the map');
// ---- the panel's capture: Esc cancels, a key binds, B cancels a controller capture
capture={kind:'keys',action:'mapZoom'};assert(captureInput('keys','Escape')==='cancelled'&&capture===null,'Esc cancels a key capture');
capture={kind:'keys',action:'mapZoom'};assert(captureInput('keys','KeyP')==='bound'&&BINDS.keys.KeyP==='mapZoom','a pressed key is bound');
capture={kind:'pad',action:'mapZoom'};assert(captureInput('pad',1)==='cancelled','B cancels a controller capture');
capture={kind:'pad',action:'mapZoom'};assert(captureInput('pad',7)==='fixed'&&BINDS.pad[7]===undefined,'a fixed controller button is refused');
capture={kind:'pad',action:'mapZoom'};assert(captureInput('pad',15)==='bound'&&BINDS.pad[15]==='mapZoom','a pressed controller button is bound');
// the controller capture goes through pollPad
const btn=()=>({pressed:false,value:0}),gp={connected:true,mapping:'standard',buttons:Array.from({length:17},btn),axes:[0,0,0,0]};
navigator.getGamepads=()=>[gp];setPadActive(true);capture={kind:'pad',action:'photo'};pollPad(0.016);gp.buttons[11]={pressed:true,value:1};pollPad(0.016);
assert(BINDS.pad[11]==='photo'&&capture===null,'pressing a controller button while the panel waits binds it');
gp.buttons[11]=btn();pollPad(0.016);setPadActive(false);
resetBinds();assert(BINDS.keys.KeyE==='inventory'&&BINDS.pad[13]==='waypoint'&&JSON.stringify(settings.binds)==='{}','reset brings back every default');
// ---- help (Q38): built from the bindings, by mode and device
setMode('survival');PAD.active=false;let h=helpHTML();
assert(/inventory and crafting/.test(h)&&!/noclip|brush size|fly on or off/i.test(h)&&/Grapnel/.test(h),'survival help on the keyboard shows survival controls and tips, none of the creative ones');
rebind('keys','inventory','KeyC');assert(/<b>C<\/b> inventory and crafting/.test(helpHTML()),'help follows a rebound key');resetBinds();
setMode('creative');h=helpHTML();assert(/block menu/.test(h)&&/noclip/.test(h)&&/brush size/.test(h)&&!/Grapnel/.test(h),'creative help shows the creative controls');
PAD.active=true;h=helpHTML();assert(/<b>RT<\/b>/.test(h)&&/<b>D-pad down<\/b> travel/.test(h),'controller help names the buttons in use');PAD.active=false;
info('survival keyboard help rows:',(setMode('survival'),helpRows().length),'; creative controller rows:',(setMode('creative'),PAD.active=true,helpRows().length));PAD.active=false;
// ---- hints (Q38): once each, naming the control for the device; off means off
settings.seen={};settings.hints=true;setMode('survival');
assert(hint('ore')&&!hint('ore')&&settings.seen.ore===1,'a hint shows once');
assert(JSON.parse(store[SET_KEY]).seen.ore===1,'hints seen are remembered with the settings');
PAD.active=false;assert(/right click/.test(HINTS.lectern())&&(PAD.active=true,/LT/.test(HINTS.lectern())),'hints name the control for the device (right click, LT)');PAD.active=false;
settings.hints=false;assert(!hint('lectern'),'with hints off nothing shows');settings.hints=true;
playing=true;dead=false;food=10;settings.seen={};hintTick(0.25,{id:WAYSTONE});
assert(settings.seen.start&&settings.seen.hunger&&settings.seen.waystone,'the hint tick notices a new survival world, hunger and a waystone in view');
food=20;playing=false;
// ---- the readout (Q39): on by default, the action turns it off and on
assert(settings.hud===true,'the readout is on by default');
runAction('hud');assert(settings.hud===false,'the readout action turns it off');runAction('hud');assert(settings.hud===true,'and on again');
// ---- worlds: rename keeps names unique
const w2=createWorld('Second world',777,'creative');
assert(renameWorld(w2.id,WORLD.name)&&WIX.list.find(x=>x.id===w2.id).name!==WORLD.name,'renaming to a taken name gets a number added');
assert(renameWorld(w2.id,'Deep Halls')&&WIX.list.find(x=>x.id===w2.id).name==='Deep Halls','a world can be renamed');
assert(!renameWorld(w2.id,'   '),'an empty name is refused');
deleteWorld(w2.id);setMode('creative');settings.seen={};
