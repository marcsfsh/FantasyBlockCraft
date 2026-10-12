// ---- The soldier's arms (W8a, D-078): the player's own fighting.
// The guard: a shield worn on the arm (equip slot 'arm') is raised with the place button while the hand holds a weapon or
// nothing (held, or for 0.7 seconds after a tap). Raised, it catches what comes from the front (within 60 degrees of the way the
// player looks): of a blow its guard (a troll's or a lord's at six tenths of it), every arrow, bolt, stone, javelin and axe, part
// of a rock or fire; raised in the last 0.3 seconds before a blow it parries it whole and staggers the one who struck. Each catch
// wears the shield. A blow struck with the shield up is a bash: less harm, a great shove, and a small foe staggered.
// Bows and the crossbow: the place button draws a bow (released, it looses as far as it was drawn; a tap draws it full and looses),
// and loads the crossbow (then looses it); each takes an arrow or a bolt in survival. Javelins and throwing axes are thrown.
// Player shots strike any creature (the folk take it ill, in survival) and game; arrows that struck home are half recovered
// from the slain; spent arrows stick where they fell a while. Blows: a running blow strikes harder, an axe cleaves into a second
// foe beside the first, a blow from the saddle grows with the horse's speed and the Knight's Lance couched at a gallop most of
// all; a galloping horse tramples small foes in its way.
let armsClk=0,guardOn=0,guardT0=-9,guardTap=-9,bowD=0,bowAuto=-1,xLoad=0,xReady=0,throwCD=0;
const ARMS_AMMO={bow:409,xbow:410};
const shieldOn=()=>{const q=equip.arm;return q&&ITEMS[q.id]&&ITEMS[q.id].guard?q:null;};
const armsGuardable=id=>!id||!!(ITEMS[id]&&(ITEMS[id].tool==='sword'||ITEMS[id].tool==='axe'||ITEMS[id].tool==='lance'));
const armsHas=id=>!SURV()||countOf(id)>0;
const armsSlow=()=>guardOn&&shieldOn()?ITEMS[shieldOn().id].slow:bowD>0?0.6:1;
const armsTake=id=>{if(SURV())takeItems(id,1);drawBar(true);};
// the place button with arms in hand: true if it was taken
function armsAct(held){
  const it=ITEMS[held];
  if(it&&it.tool==='bow'){if(bowD>0)return true;if(!armsHas(409)){toast('No arrows');return true;}bowD=1e-4;hint('bow');bowAuto=-1;burst(0.25,'bandpass',420,3,0.08);return true;}
  if(it&&it.tool==='xbow'){if(xReady){xReady=0;armsShoot('bolt',it.dmg,it.v,{pierce:1});wearHeld(1);burst(0.12,'highpass',1600,2,0.3);return true;}
    if(xLoad>0)return true;if(!armsHas(410)){toast('No crossbow bolts');return true;}xLoad=1e-4;burst(0.5,'bandpass',260,4,0.08);return true;}
  if(it&&it.throw){if(throwCD>0)return true;throwCD=0.6;armsShoot(it.throw.k,it.throw.dmg,it.throw.v,{id:held});const q=inv[sel];if(SURV()&&q){q.c--;if(!q.c)inv[sel]=null;}drawBar(true);swing=1;return true;}
  if(shieldOn()&&armsGuardable(held)){if(!guardOn)guardT0=armsClk;guardTap=armsClk+0.7;return true;}
  return false;}
// every frame: the guard, the draw, the crossbow's loading, a horse's trampling
function armsTick(dt){
  armsClk+=dt;throwCD-=dt;const held=curId(),it=ITEMS[held];
  const up=!!shieldOn()&&armsGuardable(held)&&!dead&&(hold===2||armsClk<guardTap);if(up&&!guardOn)guardT0=armsClk;guardOn=up?1:0;
  if(bowD>0){if(!it||it.tool!=='bow'){bowD=0;}else{if(bowAuto<0)bowAuto=hold===2?0:1;if(hold===2||bowAuto)bowD+=dt;const p=Math.min(1,bowD/it.draw);
    if(bowAuto&&p>=1||!bowAuto&&hold!==2){bowD=0;if(p>=0.3){armsTake(409);armsShoot('arrow',it.dmg*p,it.v*(0.45+0.55*p),{spread:(1-p)*0.05,arw:409});wearHeld(1);burst(0.15,'bandpass',900,2.5,0.2);}}}}
  if(xLoad>0){if(!it||it.tool!=='xbow')xLoad=0;else{xLoad+=dt;if(xLoad>=it.load){xLoad=0;xReady=1;armsTake(410);burst(0.08,'highpass',2400,3,0.25);showName('Crossbow loaded');}}}
  if(PL.ride){const v=Math.hypot(PL.vx,PL.vz);if(v>5){const fx=PL.vx/v,fz=PL.vz/v;foeNear(PL.x+fx,PL.z+fz,2,f=>{const F=FOES[f.kind];if(f.dead||f.show||F.mass<0.3||F.lord||(f.trT||0)>foeClock)return;
    const dx=f.x-PL.x,dz=f.z-PL.z,d=Math.hypot(dx,dz);if(d>2.2||dx*fx+dz*fz<0.2)return;f.trT=foeClock+0.8;foeStruck(f,3+v*0.5,fx,fz,{kb:9,stagger:1});burst(0.2,'lowpass',200,1,0.4,0,[f.x,f.y,f.z]);});}}}
// a shot of the player's: from the eye, the way it looks (a little astray if not drawn full)
function armsShoot(k,dmg,v,o){o=o||{};const e=eyePos(),d=camDir(),K=SHOT_K[k],sp=o.spread||0,ax=(Math.random()-0.5)*sp,ay=(Math.random()-0.5)*sp;
  const dx=d.x+ax,dy=d.y+ay,dz=d.z-ax,l=Math.hypot(dx,dy,dz)||1;
  const mat=new THREE.MeshBasicMaterial({color:new THREE.Color(K.col[0],K.col[1],K.col[2])}),m=new THREE.Mesh(shotGeo,mat);m.scale.set(K.sz,K.sz,K.sz);
  if(k==='arrow'){m.scale.set(0.06,0.06,0.9);}else if(k==='bolt'){m.scale.set(0.09,0.09,0.6);}else if(k==='jav'){m.scale.set(0.08,0.08,1.7);}else if(k==='axe'){m.scale.set(0.08,0.4,0.3);}m.frustumCulled=false;scene.add(m);
  shots.push({x:e.x+dx/l*0.6,y:e.y+dy/l*0.6-0.1,z:e.z+dz/l*0.6,vx:dx/l*v,vy:dy/l*v,vz:dz/l*v,k:k,dmg:dmg,from:null,side:'p',byP:1,atP:false,cause:k,life:5,m:m,pierce:o.pierce||0,hitL:[],arw:o.arw||0,item:o.id||0});}
// a player's shot strikes a creature: its harm (a shield takes some, from the front); the arrow kept for recovery
function armsHit(g,s){const l=Math.hypot(s.vx,s.vz)||1;foeStruck(g,s.dmg,s.vx/l,s.vz/l,{kb:s.k==='jav'||s.k==='axe'?4:2,shot:1,pierce:s.k==='bolt'});if(s.arw)g.arw=(g.arw||0)+1;
  if(s.byP&&foeHear([g.x,g.y,g.z]))burst(0.08,'bandpass',600,2,0.25,0,[g.x,g.y+1,g.z]);}
// ... or game (hunting with a bow)
function armsAnimal(s){for(const a of animals){if(a.dead||a===PL.ride)continue;const b=a.m.box;if(Math.abs(s.x-a.x)<Math.max(b[3],-b[0])+0.15&&Math.abs(s.z-a.z)<Math.max(b[5],-b[2])+0.15&&s.y>a.y-0.1&&s.y<a.y+b[4]+0.15){
  const l=Math.hypot(s.vx,s.vz)||1;animalStrike(a,s.dmg,s.vx/l,s.vz/l);return true;}}return false;}
// the slain: half the arrows that struck it come back
function armsSlain(f){if(f.arw&&SURV()){const n=Math.floor(f.arw*0.5+Math.random()*0.6);if(n>0){addItem(409,n);return n+' '+nameOf(409);}}return '';}
// the guard against a blow or a shot coming from (ux, uz) toward the player: {n, kb} or {parry}
function armsGuard(n,ux,uz,by,cause){const q=shieldOn();if(!guardOn||!q||!SURV())return {n:n,kb:1};const fx=-Math.sin(PL.yaw),fz=-Math.cos(PL.yaw);if(-(fx*ux+fz*uz)<0.5)return {n:n,kb:1};
  const S=ITEMS[q.id],shot=by&&by.life!==undefined,F=by&&!shot&&by.kind?FOES[by.kind]:null,big=F&&(F.lord||F.mass<0.2),G=S.guard*(big?0.6:1),wear=k=>{q.d=(q.d||0)+k;if(q.d>=S.dur){equip.arm=null;toast('Your '+S.n+' is broken');burst(0.4,'highpass',2600,1,0.35);}saveDirty=true;};
  if(F&&armsClk-guardT0<0.3){wear(1);by.stagger=foeClock+(big?0.6:1.4);by.atk=0;armsSpark(by,true);swing=1;hint('parry');return {parry:1};} // parried
  if(shot&&/^(arrow|stone|bolt|jav|axe)$/.test(by.k)){wear(1);armsSpark(null,false);return {parry:1};} // caught on the shield
  wear(n>8?2:1);armsSpark(null,false);return {n:Math.max(0,Math.round(n*(1-(shot?G*0.6:G)))),kb:0.4};}
function armsSpark(f,ring){const e=eyePos(),d=camDir(),x=e.x+d.x*0.9,y=e.y-0.25,z=e.z+d.z*0.9;for(let k=0;k<(ring?14:6);k++)spawnP(x,y,z,(Math.random()-.5)*3,Math.random()*2.5,(Math.random()-.5)*3,ring?[1,0.85,0.4]:[0.7,0.6,0.5],0.25,10);
  if(ring){tone(1900,1700,0.25,0.12);tone(2600,2300,0.4,0.06,0.02);}else burst(0.12,'bandpass',520,2,0.35);}
// a blow of the player's on a creature, from melee or shot: its harm and push, the folk provoked, the struck turning on the player
function foeStruck(f,dmg,kx,kz,o){o=o||{};const F=FOES[f.kind];if(f.dead)return;
  if(F.block&&f.st!=='sleep'&&!o.pierce&&Math.abs(angTo(f.yaw,Math.atan2(PL.x-f.x,PL.z-f.z)))<1.05){dmg*=1-F.block*(o.shot?0.7:1);burst(0.12,'bandpass',2600,4,0.25,0,[f.x,f.y+1.2,f.z]);}
  f.hp-=dmg;f.hurt=1;const kl=Math.hypot(kx,kz)||1,kb=(o.kb||5)*F.mass;f.kvx=kx/kl*kb;f.kvz=kz/kl*kb;if(F.mass>0.3)f.vy=Math.max(f.vy,o.kb>6?3.5:2.5);
  if(o.stagger&&F.mass>0.3&&!F.lord){f.stagger=foeClock+o.stagger;f.atk=0;}
  for(let k=0;k<6;k++)spawnP(f.x,f.y+f.m.box[4]*0.6,f.z,(Math.random()-.5)*2,1+Math.random()*2,(Math.random()-.5)*2,isLord(f)?f.fc||[1,0.5,0.1]:[0.5,0.1,0.08],0.5,8);
  if(F.folk)folkProvoke(f,90);
  if(f.foe&&foeTarget()&&!F.civ&&(!F.folk||folkWrath(f))){f.foe=null;f.st='chase';f.seen=0;f.vis=true;} // it turns from the creature it fought to the player
  if(f.st!=='chase'&&f.st!=='flee'&&foeTarget())foeAlert(f);if(f.st==='sleep'){f.st='idle';}foeCall(f,'hurt');
  if(f.hp<=0)foeSlain(f);}
// the player's blow, its reach and power (foeAct): a running blow, the saddle and the lance, the bash; an axe's cleave
const armsReach=()=>PL.ride&&ITEMS[curId()]&&ITEMS[curId()].tool==='lance'?6:4.6;
function armsBlow(f,held){const it=ITEMS[held],v=Math.hypot(PL.vx,PL.vz);let dmg=hitPower(held),kb=5,st=0,say='';
  if(it&&it.tool==='lance')dmg=PL.ride?6+v*2.6:4;
  else if(PL.ride)dmg*=1+v/10;
  else if(v>5){dmg*=1.4;kb=8;say='run';}
  if(guardOn&&!PL.ride){dmg*=0.4;kb=14;st=1;const q=shieldOn();if(q){q.d=(q.d||0)+1;saveDirty=true;}say='bash';burst(0.2,'lowpass',300,1.5,0.35,0,[f.x,f.y+1,f.z]);}
  if(PL.ride&&v>5){kb=10;st=1;say='charge';}
  const kx=f.x-PL.x,kz=f.z-PL.z;foeStruck(f,dmg,kx,kz,{kb:kb,stagger:st});
  if(it&&it.tool==='axe'){const d=camDir(),dl=Math.hypot(d.x,d.z)||1;let best=null,bd=3.4;
    for(const g of foes){if(g===f||g.dead||g.show)continue;const dx=g.x-PL.x,dz=g.z-PL.z,dd=Math.hypot(dx,dz);if(dd>=bd||(dx*d.x+dz*d.z)/(dd*dl||1)<0.6)continue;best=g;bd=dd;}
    if(best){foeStruck(best,dmg*0.6,best.x-PL.x,best.z-PL.z,{kb:4});say='cleave';}}
  return say;}
// the view while a bow is drawn (narrower), and the arms in the hand: the bow upright and drawn, the shield on the left arm
function armsFov(){const it=ITEMS[curId()];return bowD>0&&it&&it.tool==='bow'?-9*Math.min(1,bowD/it.draw):0;}
const shieldItem=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({transparent:true,alphaTest:0.5,depthTest:false,depthWrite:false,side:THREE.DoubleSide}));
shieldItem.renderOrder=1001;shieldItem.frustumCulled=false;shieldItem.visible=false;camera.add(shieldItem);let shieldTexId=0;
function armsPose(){const it=ITEMS[curId()],q=shieldOn();
  if(it&&(it.tool==='bow'||it.tool==='xbow')){const p=it.tool==='bow'?(bowD>0?Math.min(1,bowD/it.draw):0):xReady?1:0;handItem.rotation.set(0.1,-0.2,it.tool==='bow'?1.05:0.3);handItem.position.x-=0.06+0.05*p;handItem.position.z+=0.08*p;}
  shieldItem.visible=!!q&&!photo&&!dead;if(!q)return;if(shieldTexId!==q.id){shieldTexId=q.id;shieldItem.material.map=itemTex(q.id);shieldItem.material.needsUpdate=true;}
  const k=guardOn?1:0;shieldItem.position.set(-0.52+0.3*k,-0.42+0.22*k,-0.78+0.18*k);shieldItem.rotation.set(0,0.35-0.3*k,0.1);shieldItem.scale.setScalar((TOUCH?0.5:0.6)+0.25*k);shieldItem.material.color.setScalar(matHand.uniforms.bright.value);}
// spent arrows, bolts and javelins stay where they struck the ground a while (at most 150; the oldest go first)
const armsStuck=[];
entityKind({name:'spent arrows',list:armsStuck,persist:false,shift:(dx,dz)=>{for(const s of armsStuck){s.m.position.x-=dx;s.m.position.z-=dz;}},clear:()=>{for(const s of armsStuck)scene.remove(s.m);armsStuck.length=0;},
  update:dt=>{for(let i=armsStuck.length-1;i>=0;i--){const s=armsStuck[i];s.t-=dt;if(s.t<=0){scene.remove(s.m);s.m.material.dispose();armsStuck.splice(i,1);}}}});
function armsStick(s){s.m.position.set(s.x-s.vx*0.012,s.y-s.vy*0.012,s.z-s.vz*0.012);armsStuck.push({m:s.m,t:30});if(armsStuck.length>150){const o=armsStuck.shift();scene.remove(o.m);o.m.material.dispose();}}
