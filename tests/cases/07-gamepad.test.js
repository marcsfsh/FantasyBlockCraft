// A simulated Xbox-layout controller drives menus and play.
const btn=()=>({pressed:false,value:0});
const gp={connected:true,mapping:'standard',buttons:Array.from({length:17},btn),axes:[0,0,0,0],vibrationActuator:{playEffect:()=>{}}};
navigator.getGamepads=()=>[gp];
if(typeof PointerEvent==='undefined')globalThis.PointerEvent=function(t,o){this.type=t;Object.assign(this,o);};
if(typeof MouseEvent==='undefined')globalThis.MouseEvent=function(t,o){this.type=t;Object.assign(this,o);};
const clicks=[];document.elementFromPoint=()=>({tagName:'BUTTON',dispatchEvent:e=>clicks.push(e.type),closest:()=>null});
const press=(i,v=1)=>{gp.buttons[i]={pressed:v>0.5,value:v};},rel=i=>{gp.buttons[i]={pressed:false,value:0};},tap=i=>{press(i);pollPad(0.016);rel(i);pollPad(0.016);};
playing=false;pollPad(0.016);assert(!PAD.active,'controller idle until used');
press(0);pollPad(0.016);assert(PAD.active,'pressing A activates the controller');assert(clicks.includes('click'),'A clicks under the menu pointer');rel(0);pollPad(0.016);
tap(9);assert(playing,'Menu starts play without pointer lock');
setMode('creative');PL.fly=true;const x0=PL.x,z0=PL.z,yaw0=PL.yaw;
gp.axes=[0,-1,0.8,0];for(let k=0;k<30;k++){pollPad(1/60);update(1/60);}gp.axes=[0,0,0,0];
assert(Math.hypot(PL.x-x0,PL.z-z0)>1,'left stick moves');assert(Math.abs(PL.yaw-yaw0)>0.3,'right stick turns');
const s0=sel;tap(5);assert(sel===(s0+1)%9,'RB selects the next slot');
press(7);pollPad(0.016);assert(hold===0,'RT starts breaking');rel(7);pollPad(0.016);assert(hold===-1,'releasing RT stops');
tap(3);assert(invOpen,'Y opens the block menu');tap(1);assert(!invOpen,'B closes it');
tap(9);assert(!playing,'Menu pauses');
