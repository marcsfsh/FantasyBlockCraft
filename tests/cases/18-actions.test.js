// Input actions: every binding names a real action, held controls read through keyHeld, and rebinding (M5) takes effect.
const all=[...Object.values(BINDS.keys),...Object.values(BINDS.pad)];
assert(all.every(a=>ACTIONS[a]),'every key and controller binding names an existing action');
assert(Object.keys(BIND_DEFAULTS.held).every(h=>Array.isArray(BINDS.held[h])&&BINDS.held[h].length),'every held control has default keys');
// Running actions
const s0=sel;runAction('hotbarNext');assert(sel===(s0+1)%9,'the next-slot action moves the hotbar');runAction('slot3');assert(sel===2,'slot actions select a slot');
const z0=mmZoom;runAction('mapZoom');assert(mmZoom===(z0+1)%3,'the map-zoom action cycles the map');
// Held controls
keys.ArrowUp=true;const f1=keyHeld('forward');keys.ArrowUp=false;assert(f1&&!keyHeld('forward'),'held movement reads every key bound to it');
// Rebinding a key and a controller button
settings.binds={keys:{KeyG:'mapZoom'},pad:{12:'mapZoom'},held:{forward:['KeyI']}};loadBinds();
assert(BINDS.keys.KeyG==='mapZoom'&&BINDS.keys.KeyE==='inventory','a rebound key is added and the other defaults remain');
keys.KeyI=true;assert(keyHeld('forward'),'held controls follow the new binding');keys.KeyI=false;
const btn=()=>({pressed:false,value:0}),gp={connected:true,mapping:'standard',buttons:Array.from({length:17},btn),axes:[0,0,0,0]};
navigator.getGamepads=()=>[gp];playing=true;invOpen=false;
pollPad(0.016);const z1=mmZoom;gp.buttons[12]={pressed:true,value:1};pollPad(0.016);
assert(mmZoom===(z1+1)%3,'a rebound controller button runs its new action (D-pad up opens the map instead of travelling)');
settings.binds={};loadBinds();
