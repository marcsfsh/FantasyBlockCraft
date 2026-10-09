// ---- Survival: health, hunger, air, damage, death and graves
let hp=20,food=20,exh=0,air=10,hurtCD=0,regenT=0,starveT=0,drownT=0,fallTop=null,dead=false,eatCD=0;
if(saved&&typeof saved.hp==='number'){hp=Math.max(1,saved.hp);food=saved.food;}
const FOOD={270:2,206:5,207:4,209:1,269:5,330:2,331:1,332:2,333:1,334:5,335:9,336:7,337:4};
const graves=new Map();
if(saved&&Array.isArray(saved.gv))saved.gv.forEach(q=>graves.set(q[0],q[1]));
function wearHeld(n){
  if(!SURV())return;const q=inv[sel];if(!q||!durOf(q.id))return;
  q.d=(q.d||0)+n;if(q.d>=durOf(q.id)){inv[sel]=null;toast('Your '+nameOf(q.id)+' broke');burst(0.3,'highpass',3000,1,0.3);}
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
  dead=true;hold=-1;
  const items=inv.filter(Boolean).map(q=>[q.id,q.c,q.d||0]);inv.fill(null);
  for(const s in equip)if(equip[s]){items.push([equip[s].id,1,equip[s].d||0]);equip[s]=null;}
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
  const hadGrave=/grave/.test($('deathmsg').textContent);hp=20;food=20;exh=0;air=10;fallTop=null;dead=false;$('death').style.display='none';respawn();drawStats();lockOrPlay();if(hadGrave)hint('grave');
}
function openGrave(X,Y,Z){
  const k=wkey(X+OX,Y,Z+OZ),items=graves.get(k);
  if(!items){setBlock(X,Y,Z,AIR,true);return;}
  const left=[];for(const [id,c,d] of items){const es=equipSlotOf(id);if(es&&!equip[es]){equip[es]={id:id,c:1,d:d||0};continue;} // lanterns, packs and bags go back on first
    const lost=addItem(id,c);if(lost)left.push([id,lost,d]);else if(d&&durOf(id)){const q=inv.find(q=>q&&q.id===id&&!q.d);if(q)q.d=d;}}
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
  lampTick(dt);
  if(!SURV()||dead){air=10;return;}
  // falling
  if(inLiq||PL.fly||PL.climb)fallTop=PL.y;
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
// ---- The worn lamp (M4b, Q36, Q65). In survival the light around the player comes only from a lantern in the belt slot or a
// light held in the hand (a torch, a lantern block, glowstone...). The lantern burns its fuel only in the dark, taking lamp oil
// or pitch candles from the pack as it runs out. Creative keeps the old carried lamp. Returns [strength, reach in blocks].
const LAMP_ADJ=[-3,0,6]; // the Caves setting (Dark, Normal, Bright) shortens or lengthens the reach
function lampLevel(){
  const adj=LAMP_ADJ[settings.cave||0]||0;
  if(!SURV())return[[0.78,0.95,1][settings.cave||0],[13,20,26][settings.cave||0]];
  const b=equip.belt;if(b&&ITEMS[b.id].lamp&&b.d>0)return[1,18+adj];
  const h=curId(),lum=h&&h<200&&BL[h]?BL[h].lum:0;if(lum>=8)return[0.9,Math.max(5,3+lum*0.6+adj)];
  return[0,4];
}
const lampDark=()=>{const x=Math.floor(PL.x),y=Math.floor(PL.y+EYE),z=Math.floor(PL.z);return Math.max(sky(x,y,z)*U.skyMul.value,bl(x,y,z))<0.4;};
let lampWarned=false;
function lampTick(dt){
  const b=equip.belt;if(!SURV()||!b||!ITEMS[b.id].lamp)return;
  if(b.d<=0||lampDark())b.d-=dt;
  if(b.d<=0){const f=[338,339].find(id=>countOf(id)>0);
    if(f){takeItems(f,1);b.d=Math.max(0,b.d)+ITEMS[f].fuel;lampWarned=false;drawBar(true);}
    else{b.d=0;if(!lampWarned){lampWarned=true;toast('Your lantern has gone out: it needs lamp oil or pitch candles');}}}
}
function lampFuelText(){const b=equip.belt;if(!b||!ITEMS[b.id].lamp)return '';const m=Math.ceil(b.d/60),spare=countOf(338)*20+countOf(339)*8;
  return b.d>0?m+' min of light'+(spare?', '+spare+' min more in the pack':''):'out of fuel';}
// Ambient light in caves falls with depth (M4b): full above y260, a quarter of it by y60
const depthDim=y=>Math.max(0.25,Math.min(1,(y-60)/200*0.75+0.25));
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
  const root=$('sinv');root.innerHTML='';
  const grid=document.createElement('div');grid.className='sgrid';
  inv.slice(0,invCap()).forEach((q,i)=>{const b=document.createElement('button');b.className='sslot'+(i<9?' hb':'')+(i===heldSlot?' held':'');
    if(q&&durOf(q.id)&&q.d){const f=1-q.d/durOf(q.id),bb=document.createElement('i');bb.className='dur';bb.style.width=(f*80)+'%';bb.style.background='hsl('+(f*120|0)+',80%,50%)';b.appendChild(bb);}
    if(q){b.appendChild(icon(q.id));if(q.c>1){const n=document.createElement('span');n.className='n';n.textContent=q.c;b.appendChild(n);}b.title=nameOf(q.id);}
    b.addEventListener('click',()=>{
      if(box){boxGive(i);renderSInv();return;} // a container is open: the stack goes into it
      if(heldSlot<0){if(inv[i])heldSlot=i;}
      else{const a=inv[heldSlot],c=inv[i];
        if(a&&c&&a.id===c.id&&heldSlot!==i){const k=Math.min(a.c,stackMax(c.id)-c.c);c.c+=k;a.c-=k;if(!a.c)inv[heldSlot]=null;}
        else{inv[heldSlot]=c;inv[i]=a;}
        heldSlot=-1;drawBar(true);}
      renderSInv();});
    grid.appendChild(b);});
  let er=null;if(Object.values(ITEMS).some(it=>it.equip)){er=document.createElement('div');er.className='sgrid eq';
    for(const s in EQUIP_SLOTS){const q=equip[s],b=document.createElement('button');b.className='sslot';b.title=EQUIP_SLOTS[s]+(q?': '+nameOf(q.id)+(ITEMS[q.id].lamp?' ('+lampFuelText()+')':''):'');
      if(q)b.appendChild(icon(q.id));else{const t=document.createElement('span');t.className='n';t.textContent=EQUIP_SLOTS[s];b.appendChild(t);}
      b.addEventListener('click',()=>{if(heldSlot>=0){if(equipSlotOf(inv[heldSlot]&&inv[heldSlot].id)===s&&!equipFrom(heldSlot))toast('No room');heldSlot=-1;}else if(q&&!unequip(s))toast(ITEMS[q.id].slots?'Empty the extra slots first':'Inventory full');drawBar(true);renderSInv();});
      er.appendChild(b);}}
  const left=document.createElement('div');left.className='scol';
  const h1=document.createElement('div');h1.className='inv-h';h1.textContent=box?'Your pack: tap a slot to put it in the '+nameOf(get(box.x,box.y,box.z)).toLowerCase()+'.':'Hotbar is the top row. Tap two slots to swap them.';left.appendChild(h1);left.appendChild(grid);
  if(er){const h2=document.createElement('div');h2.className='inv-h';h2.textContent='Equipment: tap an item, then its slot. Tap a filled slot to take it off.';left.appendChild(h2);left.appendChild(er);}
  const recs=document.createElement('div');recs.className='recipes';
  if(box){renderBox(recs);root.appendChild(recs);root.appendChild(left);return;} // the container first, above a long pack
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
  root.appendChild(left);root.appendChild(recs);
}
let airT=0,lagX=0,lagY=0,lastYaw=0,lastPitch=0,stepD=0,wasLiq=false,sel=0,brushR=0,gliding=false,sprintLatch=false,lastW=0;
// ---- Climbing gear (M4, Q45, Q66). Rope unrolls downward through open space from where it is placed; taking a rope takes it
// and everything hanging below it. The grapnel is thrown at a wall below its top edge: it catches the lip and hangs rope from
// there, as much as you carry (in creative as much as it needs).
const ROPE_MAX=48;
function ropeFits(x,y,z){return get(x,y,z)===AIR&&y>0;}
// Hang rope from (x,y,z) downward, at most n blocks; returns how many were hung
function hangRope(x,y,z,n){let k=0;while(k<n&&ropeFits(x,y-k,z)){setBlock(x,y-k,z,ROPE);k++;}return k;}
function ropeLeft(){return SURV()?countOf(ROPE):ROPE_MAX;}
// Take down the rope hanging below (x,y,z); returns how many blocks of rope came down
function ropeBelow(x,y,z){let n=0;for(let yy=y-1;yy>0&&get(x,yy,z)===ROPE;yy--){setBlock(x,yy,z,AIR);n++;}return n;}
function placeRope(tx,ty,tz){
  const above=get(tx,ty+1,tz),wall=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>OPQ[get(tx+a,ty,tz+b)]);
  if(above===AIR&&!wall){toast('Rope needs something to hang from');return;}
  const n=hangRope(tx,ty,tz,Math.min(ROPE_MAX,ropeLeft()));if(SURV()&&n)takeItems(ROPE,n);
  if(n>1)showName(n+' blocks of rope');sfxBlock(ROPE,true);swing=1;buzz(8);drawBar(true);
}
// Where a grapnel aimed at this wall would catch: the first top edge up to 10 blocks above the hit with room to stand on it
function grapnelLip(hit){
  const fx=hit.px-hit.x,fz=hit.pz-hit.z;if(hit.py!==hit.y||(fx===0&&fz===0))return null;
  for(let y=hit.y;y<Math.min(H-3,hit.y+10);y++){
    if(!SOLID[get(hit.x,y,hit.z)]||get(hit.px,y,hit.pz)!==AIR)return null;
    if(!SOLID[get(hit.x,y+1,hit.z)]&&!SOLID[get(hit.x,y+2,hit.z)])return{x:hit.px,y:y,z:hit.pz};}
  return null;
}
function throwGrapnel(){
  const hit=raycast(eyePos(),camDir(),24);
  if(!hit||!SOLID[hit.id]){toast('Nothing for the grapnel to catch within 24 blocks');tone(300,200,0.1,0.1);return;}
  const lip=grapnelLip(hit);if(!lip){toast('Throw the grapnel at a wall below a ledge');tone(300,200,0.1,0.1);return;}
  if(ropeLeft()<1){toast('You need rope to hang from the grapnel');return;}
  beginAct();setBlock(lip.x,lip.y,lip.z,GRAPNEL);const n=hangRope(lip.x,lip.y-1,lip.z,ropeLeft());endAct();
  if(SURV()){takeItems(322,1);if(n)takeItems(ROPE,n);}
  const short=ropeFits(lip.x,lip.y-1-n,lip.z);let gap=0;if(short)while(gap<64&&ropeFits(lip.x,lip.y-1-n-gap,lip.z))gap++;
  tone(1300,300,0.18,0.16);burst(0.12,'highpass',3000,1,0.12);swing=1;buzz(12);drawBar(true);
  toast(short?'The grapnel caught; the rope ends '+gap+' blocks above the ground':'The grapnel caught the ledge');
}
// Breaking a rope or the grapnel also takes down the rope below it; returns what that gives back
function ropeTake(id,x,y,z){const n=ropeBelow(x,y,z)+(id===ROPE?1:0);const out=[];if(id===GRAPNEL)out.push([322,1]);if(n)out.push([ROPE,n]);return out;}
// Is the player's body in a climbable block (ladder, piton, rope, grapnel)?
function onClimb(){
  const x0=Math.floor(PL.x-HW),x1=Math.floor(PL.x+HW),y0=Math.floor(PL.y),y1=Math.floor(PL.y+PH-0.2),z0=Math.floor(PL.z-HW),z1=Math.floor(PL.z+HW);
  for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)if(BL[get(x,y,z)].climb)return true;return false;
}
// Ladders stand on the ground or on a ladder and lean on a wall; pitons are driven into rock
function canHang(id,x,y,z){
  const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>get(x+a,y,z+b));
  if(id===LADDER)return nb.some(n=>OPQ[n])&&(SOLID[get(x,y-1,z)]||get(x,y-1,z)===LADDER);
  if(id===PITON)return nb.some(n=>OPQ[n]&&(BL[n].mat==='stone'||BL[n].mat==='ore'));
  return true;
}
let swapMode=false,photo=false;
function toggleSwap(){if(!swapMode&&creativeOnly())return;swapMode=!swapMode;$('tSwap').classList.toggle('on',swapMode);selBox.material.color.setHex(swapMode?0xffc83a:0x000000);toast(swapMode?'Swap mode: place replaces blocks':'Swap mode off');}
function setPhoto(on){photo=on;$('hud').style.display=on?'none':'block';updateHand();if(on)toast('');}
// ---- Signal flares (M4, Q45): a flare climbs about 60 blocks, then burns red and drifts down slowly, seen from far away
const flares=[];
entityKind({name:'flares',list:flares,update:dt=>updFlares(dt)});
const flareMat=new THREE.MeshBasicMaterial({color:0xff5030,fog:false}),flareGeo=new THREE.SphereGeometry(0.35,8,6);
function launchFlare(){
  const d=camDir(),x=PL.x+d.x*0.8,y=PL.y+1.6,z=PL.z+d.z*0.8,m=new THREE.Mesh(flareGeo,flareMat);m.position.set(x,y,z);scene.add(m);
  flares.push({x:x,y:y,z:z,vx:d.x*2,vy:30,vz:d.z*2,t:2.2,burn:10,m:m});
  if(SURV()){const q=inv[sel];q.c--;if(!q.c)inv[sel]=null;drawBar(true);}
  burst(0.6,'bandpass',2600,0.8,0.18);swing=1;buzz(10);
}
function updFlares(dt){
  for(let i=flares.length-1;i>=0;i--){
    const f=flares[i];
    if(f.t>0){f.t-=dt;f.vy-=6*dt;spawnP(f.x,f.y,f.z,(Math.random()-.5),-1,(Math.random()-.5),[1,.8,.4],0.4,2);
      if(f.t<=0){f.vx*=0.2;f.vz*=0.2;const dist=Math.hypot(f.x-PL.x,f.y-PL.y,f.z-PL.z);burst(0.5,'lowpass',700,0.7,0.4*Math.max(0.05,1-dist/160),dist/340);}}
    else{f.burn-=dt;f.vy+=(-1.6-f.vy)*Math.min(1,dt*2);if(Math.random()<dt*30)spawnP(f.x,f.y,f.z,(Math.random()-.5)*1.5,-0.5,(Math.random()-.5)*1.5,[1,.35+Math.random()*.3,.2],1.6,0.4);
      f.m.scale.setScalar(1.6+0.4*Math.sin(f.burn*23)+Math.min(1,Math.hypot(f.x-PL.x,f.z-PL.z)/80)*3);}
    f.x+=f.vx*dt;f.y+=f.vy*dt;f.z+=f.vz*dt;f.m.position.set(f.x,f.y,f.z);
    if(f.burn<=0||(f.t>0&&SOLID[get(Math.floor(f.x),Math.floor(f.y),Math.floor(f.z))])){scene.remove(f.m);flares.splice(i,1);}
  }
}
function sphere(cx,cy,cz,r,fn){for(let dy=-r;dy<=r;dy++)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){if(dx*dx+dy*dy+dz*dz>r*r+r)continue;const x=cx+dx,y=cy+dy,z=cz+dz;if(x<0||z<0||y<0||x>=W||z>=D||y>=H)continue;fn(x,y,z,world[I(x,y,z)]);}}
function cycleBrush(){if(creativeOnly())return;brushR=(brushR+1)%4;const w=brushR*2+1;toast(brushR?'Brush '+w+' blocks wide':'Brush off');$('tBrush').textContent=w+'x';}
function jumpPress(){
  const n=performance.now();
  if(SURV()){lastSpace=n;return;}
  if(n-lastSpace<280){gliding=false;toggleFly();lastSpace=0;return;}
  lastSpace=n;
  if(!PL.ground&&!PL.fly){gliding=!gliding;if(gliding)toast('Gliding');}
}
// where the player looks and from where, from the player's view angles (the camera follows them every frame)
function camDir(){const cp=Math.cos(PL.pitch);return{x:-Math.sin(PL.yaw)*cp,y:Math.sin(PL.pitch),z:-Math.cos(PL.yaw)*cp};}
function eyePos(){return{x:PL.x,y:PL.y+EYE,z:PL.z};}
// Blocks you use with right click; using a block wins over using what you hold (food, seeds, hoe, hook)
function useBlock(th){
  const f={[GRAVE]:openGrave,[CRATE]:openBox,[DWCHEST]:openBox,[BARREL]:openBox,[CHEST]:openBox,[LECTERN]:openLore,[WAYSTONE]:useWaystone,[WAYPT]:useWaystone,[CALCITE]:(x,y,z)=>get(x,y-1,z)===WAYSTONE?useWaystone(x,y-1,z):false}[th.id];
  if(!f)return false;return f(th.x,th.y,th.z)!==false;
}
function act(btn){
  const held=curId();
  if(btn===2){const th=raycast(eyePos(),camDir(),6);if(th&&useBlock(th))return;}
  if(btn===2&&held===322){throwGrapnel();return;}
  if(btn===2&&held===326){launchFlare();return;}
  if(btn===2&&(PLANT_OF[held]||held===251)){const fh=raycast(eyePos(),camDir(),6);if(fh&&farmUse(fh,held))return;if(!FOOD[held])return;}
  if(btn===2&&FOOD[held]&&SURV()){eat();return;}
  if(btn===2){const th=raycast(eyePos(),camDir(),6);
    if(held===BPTOOL){if(creativeOnly())return;if(th)bpTool(th);else if(BP.sel>=0)toast('Aim at the ground to build');return;}}
  if(btn===0&&SURV())return;
  const hit=raycast(eyePos(),camDir(),6);if(!hit)return;
  if(btn===0){
    swing=1;
    if(hit.id===TNT&&brushR===0){beginAct();prime(hit.x,hit.y,hit.z,4);endAct();buzz(15);return;}
    if(hit.id===BEDROCK&&brushR===0)return;
    beginAct();
    breakFx(hit.x,hit.y,hit.z,hit.id,BL[hit.id].cross?6:16);sfxBlock(hit.id,false);buzz(10);
    if(brushR===0){setBlock(hit.x,hit.y,hit.z,AIR);if(hit.id===ROPE||hit.id===GRAPNEL)ropeBelow(hit.x,hit.y,hit.z);}
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
    if(BL[hit.id].cross&&!BL[hit.id].climb){tx=hit.x;ty=hit.y;tz=hit.z;}
    if(ty<0||ty>=H)return;
    if(id===ROPE&&brushR===0){if(get(tx,ty,tz)!==AIR)return;beginAct();placeRope(tx,ty,tz);endAct();return;}
    if((id===LADDER||id===PITON)&&!canHang(id,tx,ty,tz)){toast(id===LADDER?'A ladder needs a wall and the ground or a ladder below':'Pitons go into rock');return;}
    beginAct();
    if(brushR===0){
      if(((BL[id].cross||BL[id].torch)&&!BL[id].climb&&!SOLID[get(tx,ty-1,tz)])||(BL[id].solid&&hitsPlayer(tx,ty,tz))){endAct();return;}
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
function toggleFly(){if(SURV()&&!PL.fly){toast('Flying is a creative mode ability');return;}if(PL.fly&&PL.noclip){toggleNoclip();return;}PL.fly=!PL.fly;PL.vy=0;$('tFly').classList.toggle('on',PL.fly);$('tDown').style.display=PL.fly?'grid':'none';toast(PL.fly?'Flying':'Walking');}
// Noclip (creative, M3.5a.2): fly through blocks. Turning it on also turns flying on; turning it off inside rock lifts the
// player up to the first place they fit, as respawning does, and leaves them flying.
function toggleNoclip(){
  if(SURV()&&!PL.noclip){toast('Noclip is a creative mode ability');return;}
  PL.noclip=!PL.noclip;if(PL.noclip&&!PL.fly)toggleFly();
  if(!PL.noclip){while(collide()&&PL.y<H)PL.y++;}
  $('tClip').classList.toggle('on',PL.noclip);drawClip();toast(PL.noclip?'Noclip: flying through blocks':'Noclip off');
}
let toastT=0;
function toast(s){const t=$('toast');if(!s){t.style.display='none';return;}t.textContent=s;t.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>{t.style.display='none';},1300);}
addEventListener('keydown',e=>{
  if(e.target&&e.target.tagName==='INPUT')return;
  keys[e.code]=true;
  if(!ready)return;
  const a=BINDS.keys[e.code];
  if(a&&ACTIONS[a]&&ACTIONS[a].anytime&&!e.repeat){runAction(a);return;}
  // Esc closes the inventory; browsers refuse pointer lock from Esc, so show the pause menu rather than re-locking
  if(e.code==='Escape'&&invOpen&&!e.repeat){invOpen=false;box=null;$('inv').style.display='none';if(TOUCH||PAD.active)lockOrPlay();else showPause();return;}
  if(!playing)return;
  if(e.code==='Space')e.preventDefault();
  if(BINDS.held.forward.includes(e.code)&&!e.repeat){const n=performance.now();if(n-lastW<300)sprintLatch=true;lastW=n;} // double tap forward to sprint
  if(a&&!e.repeat)runAction(a);
});
addEventListener('keyup',e=>{keys[e.code]=false;if(BINDS.held.forward.includes(e.code))sprintLatch=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;hold=-1;});
document.addEventListener('mousemove',e=>{
  if(document.pointerLockElement!==canvas)return;
  const s=0.0022*settings.sens;
  PL.yaw-=e.movementX*s;PL.pitch-=e.movementY*s;PL.pitch=Math.max(-1.55,Math.min(1.55,PL.pitch));
});
document.addEventListener('mousedown',e=>{
  if(document.pointerLockElement!==canvas)return;
  act(e.button);if(e.button===0||(e.button===2&&!oneShot(curId()))){hold=e.button;holdT=0.28;}
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

