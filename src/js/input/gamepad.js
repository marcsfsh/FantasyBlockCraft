// ---- Controller support: Xbox-layout pads through the browser Gamepad API
// (ROG Ally / Ally X in Armoury Crate gamepad mode, Xbox and most PC controllers)
const PAD={active:false,prev:[],lx:0,ly:0,jump:false,down:false,sprint:false,rt:false,lt:false,cx:innerWidth/2,cy:innerHeight/2,gp:null,rep:0};
const padCur=document.createElement('div');padCur.id='padcur';
padCur.innerHTML='<svg viewBox="0 0 24 24" width="30" height="30"><path d="M3 2l15 9-6.5 1.5L15 20l-3 1.5-3.5-7.5L3 19z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>';
document.body.appendChild(padCur);
function padDZ(x,y,d){const m=Math.hypot(x,y);if(m<d)return[0,0];const s=Math.min(1,(m-d)/(1-d))/m;return[x*s,y*s];}
function setPadActive(on){if(PAD.active===on)return;PAD.active=on;document.body.classList.toggle('gp',on);if(!on){padCur.style.display='none';PAD.lx=PAD.ly=0;PAD.jump=PAD.down=PAD.sprint=false;if(playing&&!TOUCH&&document.pointerLockElement!==canvas){playing=false;hold=-1;if(!invOpen&&!dead)showPause();}}updateKeysHelp();}
function padRumble(strong,weak,ms){const g=PAD.gp;if(!PAD.active||!g||!g.vibrationActuator)return;try{g.vibrationActuator.playEffect('dual-rumble',{duration:ms,strongMagnitude:strong,weakMagnitude:weak});}catch(e){}}
addEventListener('gamepadconnected',()=>toast('Controller connected'));
addEventListener('gamepaddisconnected',()=>{setPadActive(false);toast('Controller disconnected');});
addEventListener('mousemove',e=>{if(PAD.active&&Math.abs(e.movementX)+Math.abs(e.movementY)>6)setPadActive(false);});
addEventListener('keydown',()=>{if(PAD.active)setPadActive(false);},true);
function padEls(){return document.elementFromPoint(PAD.cx,PAD.cy);}
function padClick(btn){
  const el=padEls();if(!el)return;
  if(el.tagName==='SELECT'){el.selectedIndex=(el.selectedIndex+1)%el.options.length;el.dispatchEvent(new Event('change',{bubbles:true}));return;}
  const o={bubbles:true,cancelable:true,clientX:PAD.cx,clientY:PAD.cy,button:btn,buttons:btn===2?2:1,view:window};
  el.dispatchEvent(new PointerEvent('pointerdown',{...o,pointerType:'mouse',isPrimary:true}));el.dispatchEvent(new MouseEvent('mousedown',o));
  el.dispatchEvent(new PointerEvent('pointerup',{...o,pointerType:'mouse',isPrimary:true}));el.dispatchEvent(new MouseEvent('mouseup',o));
  if(btn===0)el.dispatchEvent(new MouseEvent('click',o));else el.dispatchEvent(new MouseEvent('contextmenu',o));
  buzz(8);
}
function padSlider(dir){
  const el=padEls();if(!el)return false;
  const r=el.tagName==='INPUT'&&el.type==='range'?el:(el.closest&&el.closest('label')?el.closest('label').querySelector('input[type=range]'):null);
  if(!r)return false;const st=+r.step||1;r.value=Math.min(+r.max,Math.max(+r.min,+r.value+dir*st));
  r.dispatchEvent(new Event('input',{bubbles:true}));r.dispatchEvent(new Event('change',{bubbles:true}));return true;
}
function padScroll(dy){let el=padEls();while(el&&el!==document.body){const cs=getComputedStyle(el);if(el.scrollHeight>el.clientHeight+2&&/(auto|scroll)/.test(cs.overflowY)){el.scrollTop+=dy;return;}el=el.parentElement;}}
function pollPad(dt){
  const list=navigator.getGamepads?navigator.getGamepads():[];let gp=null;
  for(const g of list)if(g&&g.connected&&g.buttons.length>=16){gp=g;break;}
  PAD.gp=gp;if(!gp){PAD.lx=PAD.ly=0;PAD.jump=PAD.down=false;return;}
  const now=[];for(let i=0;i<17;i++){const b=gp.buttons[i];now[i]=!!b&&(b.pressed||b.value>0.5);}
  const ed=i=>now[i]&&!PAD.prev[i];
  const [lx,ly]=padDZ(gp.axes[0]||0,gp.axes[1]||0,0.16),[rx,ry]=padDZ(gp.axes[2]||0,gp.axes[3]||0,0.14);
  const rtv=gp.buttons[7]?gp.buttons[7].value:0,ltv=gp.buttons[6]?gp.buttons[6].value:0;
  if(!PAD.active&&(now.some(Boolean)||lx||ly||rx||ry||rtv>0.3||ltv>0.3))setPadActive(true);
  if(!PAD.active){PAD.prev=now;return;}
  const ui=!ready||!playing||invOpen;
  padCur.style.display=ui?'block':'none';
  if(ui){
    PAD.lx=PAD.ly=0;PAD.jump=PAD.down=false;PAD.rt=PAD.lt=false;if(hold>=0)hold=-1;
    const sp=(500+1300*Math.hypot(lx,ly))*dt*Math.max(1,Math.min(innerWidth,innerHeight)/800);
    PAD.cx=Math.max(0,Math.min(innerWidth-2,PAD.cx+lx*sp));PAD.cy=Math.max(0,Math.min(innerHeight-2,PAD.cy+ly*sp));
    // d-pad nudges the pointer, or steps a slider sideways; held d-pad repeats
    const dp=[12,13,14,15].find(i=>now[i]);
    if(dp===undefined)PAD.rep=0;else if(ed(dp)||(PAD.rep-=dt)<=0){PAD.rep=ed(dp)?0.35:0.07;
      if(dp===14||dp===15){if(!padSlider(dp===15?1:-1))PAD.cx=Math.max(0,Math.min(innerWidth-2,PAD.cx+(dp===15?18:-18)));}
      else PAD.cy=Math.max(0,Math.min(innerHeight-2,PAD.cy+(dp===13?18:-18)));}
    if(ed(4))padSlider(-1);if(ed(5))padSlider(1);
    if(ry)padScroll(ry*1100*dt);
    if(ed(0))padClick(0);
    if(ed(2))padClick(2);
    if(ed(1)||ed(3)||ed(9)){if(invOpen)closeInv();else if(ready&&!dead&&$('overlay').style.display!=='none'&&(ed(1)||ed(9)))lockOrPlay();}
    padCur.style.transform='translate('+PAD.cx+'px,'+PAD.cy+'px)';
  }else{
    PAD.lx=lx;PAD.ly=ly;PAD.jump=now[0];PAD.down=now[1];
    const look=3.1*settings.sens,cv=v=>v*Math.abs(v)*0.7+v*0.3;
    PL.yaw-=cv(rx)*look*dt;PL.pitch-=cv(ry)*look*0.75*dt;PL.pitch=Math.max(-1.55,Math.min(1.55,PL.pitch));
    if(ed(0))jumpPress();
    if(ed(10))PAD.sprint=!PAD.sprint;if(Math.hypot(lx,ly)<0.25)PAD.sprint=false;
    const rtOn=PAD.rt?rtv>0.2:rtv>0.4,ltOn=PAD.lt?ltv>0.2:ltv>0.4;
    if(rtOn&&!PAD.rt){act(0);hold=0;holdT=0.28;}if(!rtOn&&PAD.rt&&hold===0)hold=-1;PAD.rt=rtOn;
    if(ltOn&&!PAD.lt){act(2);if(!isTool(curId())){hold=2;holdT=0.28;}}if(!ltOn&&PAD.lt&&hold===2)hold=-1;PAD.lt=ltOn;
    for(const b in BINDS.pad)if(ed(+b)){const a=BINDS.pad[b];if(a==='pause'){PAD.rt=PAD.lt=false;PAD.cx=innerWidth/2;PAD.cy=innerHeight/2;}runAction(a);}
  }
  PAD.prev=now;
}
const PAD_HTML='<div><b>Left stick</b> move, click it to sprint</div><div><b>Right stick</b> look, click it to pick a block</div><div><b>A</b> jump, swim up, double tap to fly</div><div><b>B</b> fly down</div><div><b>X</b> fly on or off</div><div><b>Y</b> block menu</div><div><b>RT</b> break, hold to mine</div><div><b>LT</b> place or use</div><div><b>LB / RB</b> change slot</div><div><b>D-pad up</b> next waypoint</div><div><b>D-pad down</b> map zoom</div><div><b>D-pad left / right</b> undo, brush size</div><div><b>View</b> replace mode</div><div><b>Menu</b> pause</div><div><b>In menus</b> left stick moves the pointer, A clicks, X right clicks, B goes back, right stick scrolls, d-pad or bumpers adjust sliders</div>';
function updateKeysHelp(){const k=$('keys');if(k)k.innerHTML=PAD.active?PAD_HTML:KEYS_HTML;}


