// Touch controls: floating stick on the left, look anywhere on the right.
// A quick tap on the right side places, holding still on it breaks.
const joy={id:null,ox:0,oy:0},look={id:null,lx:0,ly:0,sx:0,sy:0,t0:0,moved:false,breaking:false};
function joyRest(){
  const jb=$('joyb'),jk=$('joyk');
  const x=Math.max(90,innerWidth*0.12),y=innerHeight-(innerHeight>innerWidth?190:110);
  jb.style.left=jk.style.left=x+'px';jb.style.top=jk.style.top=y+'px';jk.classList.remove('run');
}
if(TOUCH){
  const jb=$('joyb'),jk=$('joyk');joyRest();
  canvas.addEventListener('touchstart',e=>{
    e.preventDefault();if(photo){setPhoto(false);return;}if(!playing)return;
    for(const t of e.changedTouches){
      if(t.clientX<innerWidth*0.42&&joy.id===null){joy.id=t.identifier;joy.ox=t.clientX;joy.oy=t.clientY;jb.style.left=jk.style.left=t.clientX+'px';jb.style.top=jk.style.top=t.clientY+'px';}
      else if(look.id===null){look.id=t.identifier;look.lx=look.sx=t.clientX;look.ly=look.sy=t.clientY;look.t0=performance.now();look.moved=false;look.breaking=false;}
    }
  },{passive:false});
  canvas.addEventListener('touchmove',e=>{
    e.preventDefault();
    for(const t of e.changedTouches){
      if(t.identifier===joy.id){let dx=t.clientX-joy.ox,dy=t.clientY-joy.oy;const m=Math.hypot(dx,dy);if(m>56){dx*=56/m;dy*=56/m;}const r=Math.min(1,m/56),rr=r<0.14?0:(r-0.14)/0.86,inv=m>0?rr/(Math.min(m,56)/56||1):0;tch.jx=dx/56*inv;tch.jy=dy/56*inv;jk.style.left=(joy.ox+dx)+'px';jk.style.top=(joy.oy+dy)+'px';jk.classList.toggle('run',m>54);}
      else if(t.identifier===look.id){
        const s=0.0055*settings.sens;
        PL.yaw-=(t.clientX-look.lx)*s;PL.pitch-=(t.clientY-look.ly)*s;PL.pitch=Math.max(-1.55,Math.min(1.55,PL.pitch));
        look.lx=t.clientX;look.ly=t.clientY;
        if(Math.hypot(t.clientX-look.sx,t.clientY-look.sy)>12){look.moved=true;if(look.breaking){look.breaking=false;hold=-1;}}
      }
    }
  },{passive:false});
  const end=e=>{for(const t of e.changedTouches){
    if(t.identifier===joy.id){joy.id=null;tch.jx=tch.jy=0;joyRest();}
    if(t.identifier===look.id){
      if(!look.moved&&!look.breaking&&performance.now()-look.t0<250&&playing)act(2);
      if(look.breaking)hold=-1;
      look.id=null;look.breaking=false;
    }
  }};
  canvas.addEventListener('touchend',end);canvas.addEventListener('touchcancel',end);
  const btn=(id,down,up)=>{const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();audioInit();if(id!=='tFly'&&id!=='tSwap')el.classList.add('on');down();});
    const u=()=>{if(id!=='tFly'&&id!=='tSwap')el.classList.remove('on');if(up)up();};el.addEventListener('pointerup',u);el.addEventListener('pointercancel',u);el.addEventListener('pointerleave',u);};
  btn('tJump',()=>{tch.jump=true;jumpPress();},()=>{tch.jump=false;});
  btn('tDown',()=>{tch.down=true;},()=>{tch.down=false;});
  btn('tBreak',()=>{act(0);hold=0;holdT=0.3;},()=>{hold=-1;});
  btn('tPlace',()=>{act(2);if(!isTool(curId())){hold=2;holdT=0.3;}},()=>{hold=-1;});
  btn('tBrush',()=>{runAction('brush');});
  btn('tSwap',()=>{runAction('swap');});
  btn('tUndo',()=>{runAction('undo');});
  btn('tFly',()=>{runAction('fly');});
  btn('tInv',()=>{runAction('inventory');});
  btn('tPause',()=>{runAction('pause');});
  addEventListener('resize',joyRest);
}

