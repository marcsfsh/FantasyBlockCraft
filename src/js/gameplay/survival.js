// ---- Survival: health, hunger, air, damage, death and graves
let hp=20,food=20,exh=0,air=10,hurtCD=0,regenT=0,starveT=0,drownT=0,fallTop=null,dead=false,eatCD=0;
if(saved&&typeof saved.hp==='number'){hp=Math.max(1,saved.hp);food=saved.food;}
const DUR={255:4000,251:150,240:60,241:132,242:180,243:260,244:250,245:600,246:1600,247:120},FOOD={270:2,206:5,207:4,209:1,269:5};
const graves=new Map();
if(saved&&Array.isArray(saved.gv))saved.gv.forEach(q=>graves.set(q[0],q[1]));
function wearHeld(n){
  if(!SURV())return;const q=inv[sel];if(!q||!DUR[q.id])return;
  q.d=(q.d||0)+n;if(q.d>=DUR[q.id]){inv[sel]=null;toast('Your '+nameOf(q.id)+' broke');burst(0.3,'highpass',3000,1,0.3);}
  drawBar(true);
}
function hurt(n,cause){
  if(!SURV()||dead||n<=0)return;
  if(hurtCD>0&&cause!=='fell'&&cause!=='blew up'&&cause!=='void')return;
  hp=Math.max(0,hp-n);hurtCD=0.5;exh+=0.1;shake=Math.max(shake,0.35);buzz(40);padRumble(0.7,0.5,220);
  tone(220,120,0.18,0.25);const f=$('hurt');f.style.opacity=0.55;setTimeout(()=>{f.style.opacity=0;},120);
  drawStats();if(hp<=0)die(cause);
}
const DEATH={fell:'You fell from a high place',lava:'You tried to swim in lava',drowned:'You drowned',cactus:'You hugged a cactus','blew up':'You were blown up',void:'You fell out of the world'};
function die(cause){
  dead=true;hold=-1;G.on=false;
  const items=inv.filter(Boolean).map(q=>[q.id,q.c,q.d||0]);inv.fill(null);
  let msg=DEATH[cause]||'You died';
  if(items.length){
    let x=Math.floor(PL.x),y=Math.max(1,Math.floor(PL.y)),z=Math.floor(PL.z),ok=false;
    for(let k=0;k<12&&y+k<H-1;k++){const id=get(x,y+k,z);if(id===AIR||BL[id].cross||id===WATER){y+=k;ok=true;break;}}
    if(ok&&x>=0&&z>=0&&x<W&&z<D){setBlock(x,y,z,GRAVE,true);graves.set(wkey(x+OX,y,z+OZ),items);msg+='. Your things are in a grave at '+(x+OX)+', '+y+', '+(z+OZ)+'.';}
    else msg+='. Your things were lost.';
  }
  drawBar(true);saveDirty=true;
  $('deathmsg').textContent=msg;$('death').style.display='grid';
  if(document.pointerLockElement)document.exitPointerLock();playing=false;
}
function revive(){
  hp=20;food=20;exh=0;air=10;fallTop=null;dead=false;$('death').style.display='none';respawn();drawStats();lockOrPlay();
}
function openGrave(X,Y,Z){
  const k=wkey(X+OX,Y,Z+OZ),items=graves.get(k);
  if(!items){setBlock(X,Y,Z,AIR,true);return;}
  const left=[];for(const [id,c,d] of items){const before=inv.findIndex(q=>!q);const lost=addItem(id,c);if(lost)left.push([id,lost,d]);else if(d&&DUR[id]){const q=inv.find(q=>q&&q.id===id&&!q.d);if(q)q.d=d;}}
  if(left.length){graves.set(k,left);toast('Inventory full, some things are still in the grave');}
  else{graves.delete(k);setBlock(X,Y,Z,AIR,true);showName('You got your things back');}
  drawBar(true);saveDirty=true;
}
function eat(){
  const q=inv[sel];if(!q||!FOOD[q.id]||eatCD>0)return;
  if(food>=20){toast('You are not hungry');return;}
  food=Math.min(20,food+FOOD[q.id]);q.c--;if(!q.c)inv[sel]=null;eatCD=0.6;swing=1;
  burst(0.12,'bandpass',600,1,0.3);burst(0.12,'bandpass',500,1,0.25,0.15);showName('+'+FOOD[q.id]+' food');drawBar(true);drawStats();
}
function cactusNear(){
  const x0=Math.floor(PL.x-HW-0.06),x1=Math.floor(PL.x+HW+0.06),z0=Math.floor(PL.z-HW-0.06),z1=Math.floor(PL.z+HW+0.06),y0=Math.floor(PL.y-0.05),y1=Math.floor(PL.y+PH);
  for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)if(get(x,y,z)===CACTUS)return true;return false;
}
function survivalTick(dt,inLiq,moved,sprinting){
  hurtCD=Math.max(0,hurtCD-dt);eatCD=Math.max(0,eatCD-dt);
  if(!SURV()||dead){air=10;return;}
  // falling
  if(inLiq||PL.fly||G.on)fallTop=PL.y;
  else if(PL.ground){if(fallTop!==null&&fallTop-PL.y>3.5)hurt(Math.floor(fallTop-PL.y-3),'fell');fallTop=PL.y;}
  else fallTop=fallTop===null?PL.y:Math.max(fallTop,PL.y);
  // lava, cactus
  if(liquidAt(PL.x,PL.y+0.2,PL.z)===2||liquidAt(PL.x,PL.y+1.2,PL.z)===2)hurt(4,'lava');
  if(cactusNear())hurt(1,'cactus');
  // air
  if(get(Math.floor(PL.x),Math.floor(PL.y+EYE),Math.floor(PL.z))===WATER){air-=dt;if(air<=0){air=0;drownT+=dt;if(drownT>=1){drownT=0;hurt(2,'drowned');}}}
  else{air=Math.min(10,air+dt*5);drownT=0;}
  // hunger
  exh+=moved*(sprinting?0.1:0.01)+dt*0.003;
  while(exh>=4){exh-=4;food=Math.max(0,food-1);}
  if(food>=18&&hp<20){regenT+=dt;if(regenT>=4){regenT=0;hp++;exh+=3;}}else regenT=0;
  if(food===0){starveT+=dt;if(starveT>=4){starveT=0;if(hp>1)hurt(1,'starved');}}else starveT=0;
  drawStats();
}
// Hearts, hunger and air above the hotbar
function iconURL(pat,col,dark){
  const c=document.createElement('canvas');c.width=9;c.height=9;const g=c.getContext('2d');
  pat.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='#'){g.fillStyle=col;g.fillRect(x,y,1,1);}else if(ch==='o'){g.fillStyle=dark;g.fillRect(x,y,1,1);}else if(ch==='w'){g.fillStyle='#fff';g.fillRect(x,y,1,1);}}));
  return c.toDataURL();
}
const HEART=['.oo...oo.','o##o.o##o','o#w#o###o','o#######o','.o#####o.','..o###o..','...o#o...','....o....','.........'];
const FOODP=['....oo...','...o##o..','..o#w##o.','..o####o.','.o####o..','o###oo...','o#oo.....','.o.......','.........'];
const BUB=['..ooo....','.o###o...','o#w###o..','o#####o..','o#####o..','.o###o...','..ooo....','.........','.........'];
const ICONS={hf:iconURL(HEART,'#d83a2c','#2a0a08'),he:iconURL(HEART,'#3a2420','#1a0a08'),ff:iconURL(FOODP,'#c88a3a','#3a2008'),fe:iconURL(FOODP,'#3a3024','#1a1408'),b:iconURL(BUB,'#7ab8ff','#123a6a')};
let statsKey='';
function drawStats(){
  const el=$('stats');
  if(!SURV()){el.style.display='none';return;}
  el.style.display='flex';
  const key=hp+'|'+food+'|'+Math.ceil(air);if(key===statsKey)return;statsKey=key;
  const row=(n,full,empty,half)=>{let h='';for(let i=0;i<10;i++){const v=n-i*2;h+='<img src="'+(v>=2?full:v===1?half:empty)+'"'+(v===1?' class="half"':'')+'>';}return h;};
  $('hearts').innerHTML=row(hp,ICONS.hf,ICONS.he,ICONS.hf);
  $('food').innerHTML=row(food,ICONS.ff,ICONS.fe,ICONS.ff);
  const a=Math.ceil(air);$('air').innerHTML=a<10?row(a*2,ICONS.b,'',ICONS.b).replace(/<img src="">/g,''):'';
}
let heldSlot=-1;
function renderSInv(){
  const box=$('sinv');box.innerHTML='';
  const grid=document.createElement('div');grid.className='sgrid';
  inv.forEach((q,i)=>{const b=document.createElement('button');b.className='sslot'+(i<9?' hb':'')+(i===heldSlot?' held':'');
    if(q&&DUR[q.id]&&q.d){const f=1-q.d/DUR[q.id],bb=document.createElement('i');bb.className='dur';bb.style.width=(f*80)+'%';bb.style.background='hsl('+(f*120|0)+',80%,50%)';b.appendChild(bb);}
    if(q){b.appendChild(icon(q.id));if(q.c>1){const n=document.createElement('span');n.className='n';n.textContent=q.c;b.appendChild(n);}b.title=nameOf(q.id);}
    b.addEventListener('click',()=>{
      if(heldSlot<0){if(inv[i])heldSlot=i;}
      else{const a=inv[heldSlot],c=inv[i];
        if(a&&c&&a.id===c.id&&heldSlot!==i){const k=Math.min(a.c,stackMax(c.id)-c.c);c.c+=k;a.c-=k;if(!a.c)inv[heldSlot]=null;}
        else{inv[heldSlot]=c;inv[i]=a;}
        heldSlot=-1;drawBar(true);}
      renderSInv();});
    grid.appendChild(b);});
  const left=document.createElement('div');left.className='scol';
  const h1=document.createElement('div');h1.className='inv-h';h1.textContent='Hotbar is the top row. Tap two slots to swap them.';left.appendChild(h1);left.appendChild(grid);
  const recs=document.createElement('div');recs.className='recipes';
  const hf=nearStation('f'),hb=nearStation('b');
  const h2=document.createElement('div');h2.className='inv-h';h2.textContent='Crafting'+(hb?', blast furnace nearby':hf?', furnace nearby':'');recs.appendChild(h2);
  const order=RECIPES.map((r,i)=>[r,i]).sort((a,b)=>(canCraft(b[0])-canCraft(a[0]))||(a[1]-b[1]));
  order.forEach(([r])=>{
    const ok=canCraft(r),row=document.createElement('div');row.className='rec'+(ok?'':' no');
    row.appendChild(icon(r[0]));
    const t=document.createElement('div');t.className='t';t.textContent=nameOf(r[0])+(r[1]>1?' x'+r[1]:'');
    const sm=document.createElement('small');sm.textContent=r[2].map(([ids,n])=>n+' '+(Array.isArray(ids)?'Any Log':nameOf(ids))).join(', ')+(r[3]==='f'?' (furnace)':r[3]==='b'?' (blast furnace)':'');
    t.appendChild(sm);row.appendChild(t);
    const btn=document.createElement('button');btn.textContent='Craft';btn.disabled=!ok;btn.addEventListener('click',()=>craft(r));row.appendChild(btn);
    recs.appendChild(row);
  });
  box.appendChild(left);box.appendChild(recs);
}
let airT=0,lagX=0,lagY=0,lastYaw=0,lastPitch=0,stepD=0,wasLiq=false,sel=0,brushR=0,gliding=false,sprintLatch=false,lastW=0;
const G={on:false,t:0,ax:0,ay:0,az:0,bx:0,by:0,bz:0,len:1};
function fireHook(){
  if(G.on){releaseHook(false);return;}
  const hit=raycast(eyePos(),camDir(),48);
  if(!hit||!SOLID[hit.id]){toast('Nothing to hook within 48 blocks');tone(300,200,0.1,0.1);return;}
  G.on=true;G.t=0;G.bx=hit.x;G.by=hit.y;G.bz=hit.z;
  G.ax=(hit.x+hit.px)/2+0.5;G.ay=(hit.y+hit.py)/2+0.5;G.az=(hit.z+hit.pz)/2+0.5;
  const e=eyePos();G.len=Math.hypot(G.ax-e.x,G.ay-e.y,G.az-e.z);
  tone(1300,300,0.18,0.16);burst(0.12,'highpass',3000,1,0.12);swing=1;gliding=false;buzz(12);
}
function releaseHook(boost){G.on=false;if(boost)PL.vy=Math.max(PL.vy,6.5);}
let swapMode=false,photo=false;
function toggleSwap(){if(!swapMode&&creativeOnly())return;swapMode=!swapMode;$('tSwap').classList.toggle('on',swapMode);selBox.material.color.setHex(swapMode?0xffc83a:0x000000);toast(swapMode?'Swap mode: place replaces blocks':'Swap mode off');}
function setPhoto(on){photo=on;$('hud').style.display=on?'none':'block';updateHand();if(on)toast('');}
const rockets=[];
const FWC=[[1,.3,.3],[1,.85,.3],[.4,1,.5],[.4,.7,1],[.9,.45,1],[1,1,1]];
function launchFirework(){
  const hit=raycast(eyePos(),camDir(),8),d=camDir();
  const x=hit?hit.px+.5:PL.x+d.x*2,y=hit?hit.py+.2:PL.y+1,z=hit?hit.pz+.5:PL.z+d.z*2;
  rockets.push({x:x,y:y,z:z,vx:(Math.random()-.5)*1.5,vy:20+Math.random()*6,vz:(Math.random()-.5)*1.5,t:1.0+Math.random()*0.5});
  burst(0.6,'bandpass',2600,0.8,0.18);swing=1;buzz(10);
}
function updRockets(dt){
  for(let i=rockets.length-1;i>=0;i--){
    const r=rockets[i];r.t-=dt;r.vy-=6*dt;r.x+=r.vx*dt;r.y+=r.vy*dt;r.z+=r.vz*dt;
    spawnP(r.x,r.y,r.z,(Math.random()-.5),-1,(Math.random()-.5),[1,.8,.4],0.4,2);
    if(r.t<=0||SOLID[get(Math.floor(r.x),Math.floor(r.y),Math.floor(r.z))]){
      rockets.splice(i,1);
      const c1=FWC[Math.random()*FWC.length|0],c2=FWC[Math.random()*FWC.length|0],n=110+(Math.random()*60|0),sp=7+Math.random()*5,ring=Math.random()<0.3;
      for(let k=0;k<n;k++){let ux,uy,uz;if(ring){const a=k/n*6.283;ux=Math.cos(a);uy=(Math.random()-.5)*0.15;uz=Math.sin(a);}else{uy=Math.random()*2-1;const a=Math.random()*6.283,q=Math.sqrt(1-uy*uy);ux=Math.cos(a)*q;uz=Math.sin(a)*q;}
        const s2=sp*(0.85+Math.random()*0.3);spawnP(r.x,r.y,r.z,ux*s2,uy*s2,uz*s2,k%2?c1:c2,1.2+Math.random()*0.8,3);}
      const dist=Math.hypot(r.x-PL.x,r.y-PL.y,r.z-PL.z),v=Math.max(0.05,1-dist/120);
      burst(0.5,'lowpass',900,0.7,0.5*v,dist/340);for(let k=0;k<6;k++)burst(0.05,'highpass',5000,1,0.12*v,dist/340+0.15+k*0.07+Math.random()*0.05);
    }
  }
}
function sphere(cx,cy,cz,r,fn){for(let dy=-r;dy<=r;dy++)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){if(dx*dx+dy*dy+dz*dz>r*r+r)continue;const x=cx+dx,y=cy+dy,z=cz+dz;if(x<0||z<0||y<0||x>=W||z>=D||y>=H)continue;fn(x,y,z,world[I(x,y,z)]);}}
function cycleBrush(){if(creativeOnly())return;brushR=(brushR+1)%4;const w=brushR*2+1;toast(brushR?'Brush '+w+' blocks wide':'Brush off');$('tBrush').textContent=w+'x';}
function jumpPress(){
  const n=performance.now();
  if(SURV()){lastSpace=n;return;}
  if(n-lastSpace<280){gliding=false;toggleFly();lastSpace=0;return;}
  lastSpace=n;
  if(!PL.ground&&!PL.fly&&!G.on){gliding=!gliding;if(gliding)toast('Gliding');}
}
function camDir(){return new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);}
function eyePos(){return new THREE.Vector3(PL.x,PL.y+EYE,PL.z);}
// Blocks you use with right click; using a block wins over using what you hold (food, seeds, hoe, hook)
function useBlock(th){
  const f={[GRAVE]:openGrave,[CRATE]:openCrate,[DWCHEST]:openCrate,[BARREL]:openCrate,[LECTERN]:openLore}[th.id];
  if(!f)return false;f(th.x,th.y,th.z);return true;
}
function act(btn){
  const held=curId();
  if(btn===2){const th=raycast(eyePos(),camDir(),6);if(th&&useBlock(th))return;}
  if(btn===2&&held===HOOK){fireHook();return;}
  if(btn===2&&held===FIREWORK){launchFirework();return;}
  if(btn===2&&(held===208||held===209||held===251)){const fh=raycast(eyePos(),camDir(),6);if(fh&&farmUse(fh,held))return;if(held!==209)return;}
  if(btn===2&&FOOD[held]&&SURV()){eat();return;}
  if(btn===2){const th=raycast(eyePos(),camDir(),6);
    if(held===BPTOOL){if(th)bpTool(th);else if(BP.sel>=0)toast('Aim at the ground to build');return;}}
  if(btn===0&&SURV())return;
  const hit=raycast(eyePos(),camDir(),6);if(!hit)return;
  if(btn===0){
    swing=1;
    if(hit.id===TNT&&brushR===0){beginAct();prime(hit.x,hit.y,hit.z,4);endAct();buzz(15);return;}
    if(hit.id===BEDROCK&&brushR===0)return;
    beginAct();
    breakFx(hit.x,hit.y,hit.z,hit.id,BL[hit.id].cross?6:16);sfxBlock(hit.id,false);buzz(10);
    if(brushR===0)setBlock(hit.x,hit.y,hit.z,AIR);
    else sphere(hit.x,hit.y,hit.z,brushR,(x,y,z,id)=>{if(id&&id!==BEDROCK&&!BL[id].liquid){if(Math.random()<0.12)breakFx(x,y,z,id,3);setBlock(x,y,z,AIR);}});
    endAct();
  }else if(btn===2){
    let tx=hit.px,ty=hit.py,tz=hit.pz;const id=held;if(!id||isTool(id)||isItem(id)||!BL[id]||(SURV()&&id===WATER))return;
    if(swapMode){
      beginAct();
      const ok=(old)=>old&&old!==BEDROCK&&old!==id&&!BL[old].liquid&&!BL[old].cross;
      if(brushR===0){if(ok(hit.id))setBlock(hit.x,hit.y,hit.z,id);}
      else sphere(hit.x,hit.y,hit.z,brushR,(x,y,z,old)=>{if(ok(old))setBlock(x,y,z,id);});
      endAct();swing=1;sfxBlock(id,true);buzz(8);return;
    }
    if(BL[hit.id].cross){tx=hit.x;ty=hit.y;tz=hit.z;}
    if(ty<0||ty>=H)return;
    beginAct();
    if(brushR===0){
      if(((BL[id].cross||BL[id].torch)&&!SOLID[get(tx,ty-1,tz)])||(BL[id].solid&&hitsPlayer(tx,ty,tz))){endAct();return;}
      setBlock(tx,ty,tz,id);
    }else sphere(tx,ty,tz,brushR,(x,y,z,old)=>{if((old===AIR||BL[old].liquid||BL[old].cross)&&!(BL[id].solid&&hitsPlayer(x,y,z))&&!((BL[id].cross||BL[id].torch)&&!SOLID[get(x,y-1,z)]))setBlock(x,y,z,id);});
    if(SURV()&&world[I(tx,ty,tz)]===id){const q=inv[sel];q.c--;if(!q.c)inv[sel]=null;drawBar(true);}
    if(id===SPONGE)sphere(tx,ty,tz,4,(x,y,z,old)=>{if(old===WATER)setBlock(x,y,z,AIR,true);});
    endAct();swing=1;sfxBlock(id,true);buzz(8);
  }else if(btn===1){
    if(SURV()){const k=inv.findIndex((q,j)=>j<9&&q&&q.id===hit.id);if(k>=0){sel=k;drawBar();}return;}
    const k=hot.indexOf(hit.id);
    if(k>=0)sel=k;else if(BL[hit.id].place)hot[sel]=hit.id;
    drawBar();
  }
}
function toggleFly(){if(SURV()&&!PL.fly){toast('Flying is a creative mode ability');return;}PL.fly=!PL.fly;PL.vy=0;$('tFly').classList.toggle('on',PL.fly);$('tDown').style.display=PL.fly?'grid':'none';toast(PL.fly?'Flying':'Walking');}
let toastT=0;
function toast(s){const t=$('toast');if(!s){t.style.display='none';return;}t.textContent=s;t.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>{t.style.display='none';},1300);}
addEventListener('keydown',e=>{
  if(e.target&&e.target.tagName==='INPUT')return;
  keys[e.code]=true;
  if(!ready)return;
  if(e.code==='KeyE'&&!e.repeat){invOpen?closeInv():openInv();return;}
  // Esc closes the inventory; browsers refuse pointer lock from Esc, so show the pause menu rather than re-locking
  if(e.code==='Escape'&&invOpen&&!e.repeat){invOpen=false;$('inv').style.display='none';if(TOUCH||PAD.active)lockOrPlay();else showPause();return;}
  if(!playing)return;
  if(e.code.startsWith('Digit')){const n=+e.code.slice(5);if(n>=1&&n<=9){sel=n-1;drawBar();}}
  if(e.code==='KeyF'&&!e.repeat)toggleFly();
  if(e.code==='KeyR'&&!e.repeat)respawn();
  if(e.code==='Space'){e.preventDefault();if(!e.repeat)jumpPress();}
  if(e.code==='KeyW'&&!e.repeat){const n=performance.now();if(n-lastW<300)sprintLatch=true;lastW=n;}
  if(e.code==='KeyB'&&!e.repeat)cycleBrush();
  if(e.code==='KeyV'&&!e.repeat)toggleSwap();
  if(e.code==='KeyH'&&!e.repeat)setPhoto(!photo);
  if(e.code==='KeyT'&&!e.repeat)nextWaypoint();
  if(e.code==='KeyQ'&&!e.repeat&&BP.sel>=0){BP.rot=(BP.rot+1)%4;toast('Blueprint turned '+BP.rot*90+' degrees');}
  if(e.code==='KeyX'&&!e.repeat&&(BP.sel>=0||BP.a)){BP.sel=-1;BP.a=BP.b=null;toast('Blueprint cleared');}
  if((e.code==='KeyZ'||e.code==='KeyU')&&!e.repeat)undo();
  if(e.code==='KeyM'&&!e.repeat)mmZoom=(mmZoom+1)%3;
});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='KeyW')sprintLatch=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;hold=-1;});
document.addEventListener('mousemove',e=>{
  if(document.pointerLockElement!==canvas)return;
  const s=0.0022*settings.sens;
  PL.yaw-=e.movementX*s;PL.pitch-=e.movementY*s;PL.pitch=Math.max(-1.55,Math.min(1.55,PL.pitch));
});
document.addEventListener('mousedown',e=>{
  if(document.pointerLockElement!==canvas)return;
  act(e.button);if(e.button===0||(e.button===2&&!isTool(curId()))){hold=e.button;holdT=0.28;}
});
document.addEventListener('mouseup',()=>{hold=-1;});
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('wheel',e=>{if(!playing||invOpen)return;sel=(sel+(e.deltaY>0?1:-1)+9)%9;drawBar();},{passive:true});
document.addEventListener('pointerlockchange',()=>{
  if(document.pointerLockElement===canvas){playing=true;$('overlay').style.display='none';}
  else{playing=false;hold=-1;if(!invOpen&&!dead)showPause();}
});
document.addEventListener('pointerlockerror',()=>{playing=false;hold=-1;if(!invOpen&&!dead)showPause();}); // a refused lock falls back to the pause menu
function lockOrPlay(){
  audioInit();
  if(TOUCH||PAD.active){playing=true;$('overlay').style.display='none';}
  else canvas.requestPointerLock();
}

