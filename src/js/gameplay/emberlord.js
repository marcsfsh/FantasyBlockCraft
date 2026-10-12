// ---- The Emberlords remade (W7a, D-074; Q176, Q179, Q181 to Q184, Q187). Risen from the deep, each the dark lord of its basin,
// each answering to something that waits in the lava sea and has never been seen. One kind, each lord its own (`emberLord`, from
// its fortress): its name and epithet, its build (horns and arms: ember-models.js), its fire, its temper (how it fights and what
// it says) and its story, written in the journal once the player has seen it (`ek`). About twenty blocks tall. It fights in
// three phases by what is left of it: the blade that cleaves wide, the whip that drags and its thrown fire; then its wings and
// fire (long leaps, fire breath, fissures of fire along the ground, and the creatures it calls out of the fire: fire spirits,
// flame hounds and lesser demons); then it tears at the mountain (eruptions of fire about its foe, walls of fire, stones falling
// from the vault, and its hall flooding with lava from its rivers). When it falls, what it called burns out and the lava it
// loosed in its hall cools to obsidian and crust.
Object.assign(FOES.ember,{hp:1500,dmg:16,reach:12,dyr:14,walk:2.2,run:5.2,sight:64,cd:2.4,wind:0.9,shot:{dmg:7,v:22,lo:14,hi:56,cd:3.5,k:'hellfire',n:3},whip:{dmg:8,lo:9,hi:30,cd:4.5},tall:20,stride:7.5,lord:1});
FOES.ember2=Object.assign({},FOES.ember,{m:'ember2'});FOES.ember3=Object.assign({},FOES.ember,{m:'ember3'});
Object.assign(FOES,{
  fspirit:{n:'Fire Spirit',m:'fspirit',hp:14,dmg:4,reach:1.8,walk:1.6,run:5.4,sight:30,cd:1.1,wind:0.35,shot:{dmg:4,v:20,lo:4,hi:20,cd:2.6,k:'fire'},mass:0.9,drops:[],cause:'spirit'},
  fhound:{n:'Flame Hound',m:'fhound',hp:26,dmg:6,reach:1.9,walk:2,run:7,sight:32,cd:0.9,wind:0.3,mass:0.6,drops:[],cause:'hound'},
  ldemon:{n:'Lesser Demon',m:'ldemon',hp:60,dmg:9,reach:2.6,walk:1.5,run:4.8,sight:36,cd:1.3,wind:0.5,mass:0.3,tall:5,stride:1.8,drops:[[229,1,2,0.6]],cause:'demon'}});
Object.assign(DEATH,{hound:'A flame hound ran you down',spirit:'A fire spirit burned you',demon:'A lesser demon cut you down',breath:'An Emberlord\'s breath burned you to ash',erupt:'The fire of the mountain took you'});
const isLord=f=>!!FOES[f.kind].lord;
// ---- who each lord is
const EMBER_EP=['the Unquenched','Ashcrown','of the Burning Mouth','Doom of the Deep','the Cinder King','Flamewrought','the Smoulderer','Heart of Embers','the Black Flame','Bane of Kings','the Sundered','Gloomfire'],
  EMBER_FIRE=['the burning fire','the white flame','the crimson fire','the deep-fire'],EMBER_ARMS=['a burning great sword','a great axe of fire','a broad cleaver'],
  EMBER_AGE=['before the first kings of men came over the sea','in the long years when the elves still sang on the high places','when the dwarves first woke the deep forges','before the stars were named'];
// a temper: how it fights (cooldowns: leap, breath, summons, fissures, eruptions, walls, the whip) and what it says (on seeing a
// foe, at its wings, at the mountain)
const EMBER_TEMPER={
  proud:{d:'It is proud, and fights with its blade before all else, scorning to call on lesser things.',k:{l:1.2,b:1.1,s:1.6,fi:1,e:1,w:1.2,wh:1},
    t:['"You come before the Ember Throne. Kneel, and I may let you burn quickly."','"I was old when your kind first learned fire. Look upon it now."','"If I fall, I take the mountain with me!"']},
  cruel:{d:'It is cruel, and drags its foes to it with its whip to watch them burn.',k:{l:1,b:1,s:1.2,fi:1.1,e:1,w:1,wh:0.65},
    t:['"Another one for my gate. I will hang you beside the last."','"Run. I like it better when they run."','"Burn with me, then! Burn with all of it!"']},
  cunning:{d:'It is cunning, and fights from afar with fire and with the creatures it calls.',k:{l:1.3,b:1.1,s:0.7,fi:0.8,e:0.8,w:0.9,wh:1.1},
    t:['"So small, to come so far. Who sent you, I wonder?"','"You fight the fire. The fire has no end."','"Let the mountain itself have you!"']},
  wrathful:{d:'It is wrathful, and falls on its foes on its wings, breathing fire.',k:{l:0.7,b:0.7,s:1.2,fi:1,e:1,w:1.1,wh:1},
    t:['"Who dares?!"','"I will tear you from the sky and the earth!"','"Then let everything burn!"']}};
function emberLord(F){if(F.L)return F.L;const r=rngAt(F.GX,9981,F.GZ),k=Math.floor(r()*3),ci=Math.floor(r()*4),tk=Object.keys(EMBER_TEMPER)[Math.floor(r()*4)],ep=EMBER_EP[Math.floor(r()*EMBER_EP.length)];
  return F.L={id:F.id,name:F.lord,n:F.lord+' '+ep,kind:['ember','ember2','ember3'][k],ci:ci,arms:EMBER_ARMS[k],fire:EMBER_FIRE[ci],temper:tk,T:EMBER_TEMPER[tk],mt:F.v.name||'the great volcano',age:EMBER_AGE[Math.floor(r()*4)],F:F};}
function emberStory(L){return [L.n+' rose from the deep '+L.age+', when the fires under the world broke through at '+L.mt.replace(/^The /,'the ')+'.',
  'It made the Ember Throne its seat and the orcs, goblins and trolls of the wastes its servants. It answers to something that waits in the lava sea, and that no one has seen.',
  L.T.d,'Its fire is '+L.fire+'; it bears '+L.arms+' and a whip of fire.'];}
// the lords the player has seen (saved as ek: id -> [the hour first seen, its name])
const emberKnown=new Map(saved&&Array.isArray(saved.ek)?saved.ek:[]),emberSave=()=>({ek:[...emberKnown.entries()]});
// a fortress's lord in its hall (from foeSpawnTick)
function emberSpawn(F,x,y,z,o){const L=emberLord(F),f=addFoe(L.kind,x,y,z,Object.assign({ci:L.ci},o));f.L=L;f.ph3=1;return f;}
// ---- its powers: chosen in its chase (from stepFoe), struck as the wind-up ends (from foeStrike), and carried on each frame
const EMB_CD={l:14,b:10,s:26,fi:9,e:12,w:16},EMB_WIND={leap:0.7,breath:0.9,summon:1.2,fissure:0.8,erupt:1,wall:1};
const emberPhase=f=>f.hp>f.mhp*2/3?1:f.hp>f.mhp/3?2:3;
function emberChoose(f,dp,vis,E){if(f.atk||f.leap||f.breath>0)return;const p=f.ph3||1;if(p<2)return;const c=f.ec||(f.ec={l:4,b:2,s:3,fi:5,e:4,w:8});
  const T=(f.L||{T:EMBER_TEMPER.proud}).T.k,go=(k,key)=>{f.atk=EMB_WIND[k];f.atkK=k;c[key]=EMB_CD[key]*T[key]*(0.8+Math.random()*0.4);f.tgt=E?[E.x,E.y,E.z]:[PL.x,PL.y,PL.z];};
  if(vis&&dp>18&&dp<46&&c.l<=0)go('leap','l');
  else if(vis&&dp<22&&c.b<=0)go('breath','b');
  else if(c.s<=0&&foes.filter(g=>g.sum===f.id&&!g.dead).length<10)go('summon','s');
  else if(vis&&dp>8&&dp<30&&c.fi<=0)go('fissure','fi');
  else if(p>=3&&vis&&c.e<=0)go('erupt','e');
  else if(p>=3&&vis&&dp>10&&c.w<=0)go('wall','w');}
// a hit about a point (window coordinates) on the player and on the folk; a lord's servants and its own kind are spared
function emberHit(src,x,y,z,r,dmg,cause,kb,up){
  if(foeTarget()&&Math.hypot(PL.x-x,PL.z-z)<r&&PL.y>y-3&&PL.y<y+5){const d=Math.hypot(PL.x-x,PL.z-z)||1;foeHurtPlayer(dmg,cause,(PL.x-x)/d,(PL.z-z)/d,kb||2);if(up)PL.vy=Math.max(PL.vy,up);}
  for(const g of foes){if(g.dead||!FOES[g.kind].folk)continue;const d=Math.hypot(g.x-x,g.z-z);if(d>r+foeRad(g)*0.5||g.y<y-3||g.y>y+5)continue;foeHurtFoe(g,dmg,src,(g.x-x)/(d||1),(g.z-z)/(d||1),kb||2);if(up)g.vy=Math.max(g.vy,up*0.8);}}
function emberStrike(f,F){const k=f.atkK,E=f.foe&&!f.foe.dead&&!f.foe.gone?f.foe:null,T=(f.L||{T:EMBER_TEMPER.proud}).T.k,tg=foeTarget();
  const tx=E?E.x:PL.x,tz=E?E.z:PL.z,ty=E?E.y:PL.y,dx=tx-f.x,dz=tz-f.z,dp=Math.hypot(dx,dz)||1,ux=dx/dp,uz=dz/dp;
  if(k==='blow'){foeCall(f,'blow');const R=F.reach+1,dm=Math.round(F.dmg*(f.dmgK||1)); // the blade cleaves wide: everything before it
    if(tg&&!E||tg&&Math.hypot(PL.x-f.x,PL.z-f.z)<R){const px=PL.x-f.x,pz=PL.z-f.z,pd=Math.hypot(px,pz);if(pd<R&&Math.abs(angTo(f.yaw,Math.atan2(px,pz)))<1.25&&Math.abs(PL.y-f.y)<F.dyr)foeHurtPlayer(dm,F.cause,px/(pd||1),pz/(pd||1),7);}
    for(const g of foes){if(g.dead||!FOES[g.kind].folk)continue;const gx=g.x-f.x,gz=g.z-f.z,gd=Math.hypot(gx,gz);if(gd-foeRad(g)>R||Math.abs(angTo(f.yaw,Math.atan2(gx,gz)))>1.25||Math.abs(g.y-f.y)>F.dyr)continue;foeHurtFoe(g,dm,f,gx/(gd||1),gz/(gd||1),6,true);}
    for(let q=-6;q<=6;q++){const a=f.yaw+q*0.2;spawnP(f.x+Math.sin(a)*R*0.8,f.y+2,f.z+Math.cos(a)*R*0.8,Math.sin(a)*2,1,Math.cos(a)*2,f.fc||[1,0.5,0.1],0.6,2);}
    burst(0.6,'lowpass',160,0.8,0.45,0,[f.x,f.y+3,f.z]);shake=Math.max(shake,0.5*Math.max(0,1-Math.hypot(PL.x-f.x,PL.z-f.z)/40));return true;}
  if(k==='whip'){burst(0.3,'highpass',2000,0.8,0.35,0,[f.x,f.y+6,f.z]);f.whipT=F.whip.cd*T.wh;if(dp>F.whip.hi+1.2||Math.abs(ty-f.y)>8)return true; // the whip drags its foe to it
    for(let q=0;q<14;q++){const s=q/14;spawnP(f.x+dx*s,f.y+8-s*6,f.z+dz*s,0,0.6,0,f.fc||[1,0.5,0.1],0.5,0);}
    if(E){foeHurtFoe(E,F.whip.dmg,f,0,0,0);E.kvx-=ux*14;E.kvz-=uz*14;}else if(tg)foeHurtPlayer(F.whip.dmg,F.cause,-ux,-uz,13);return true;}
  if(k==='breath'){f.breath=1.8;f.brT=0;foeCall(f,'alert');return true;}
  if(k==='leap'){const t=f.tgt||[tx,ty,tz];let best=null;for(const q of [5,10,16]){const lx=t[0]-ux*q,lz=t[2]-uz*q;if(f.leash&&Math.hypot(lx-f.hx,lz-f.hz)>f.leash)continue;const ly=lx>=0&&lz>=0&&lx<W&&lz<D?foeStand(lx,t[1]+2,lz,F.tall):-1;if(ly>0&&Math.abs(ly-t[1])<8){best=[lx,ly,lz];break;}}
    if(!best)return true;f.leap={x0:f.x,y0:f.y,z0:f.z,x1:best[0],y1:best[1],z1:best[2],t:0,T:1.2+Math.hypot(best[0]-f.x,best[2]-f.z)/60};f.yaw=f.hd=Math.atan2(best[0]-f.x,best[2]-f.z);
    burst(0.8,'lowpass',260,0.7,0.35,0,[f.x,f.y+8,f.z]);return true;}
  if(k==='summon'){const p=f.ph3||2,K=p>=3?['fhound','ldemon','fspirit','ldemon']:['fspirit','fhound','fspirit'];let n=0;
    for(const kind of K){for(let a=0;a<8;a++){const an=Math.random()*6.283,d=6+Math.random()*6,x=f.x+Math.sin(an)*d,z=f.z+Math.cos(an)*d;if(x<2||z<2||x>=W-2||z>=D-2)continue;const y=foeStand(x,f.y+2,z,FOES[kind].tall||2);
      if(y<0||Math.abs(y-f.y)>6||foeWet(x,y,z))continue;const g=addFoe(kind,x,y,z,{sum:f.id,st:'chase',t:0,war:f.war});g.foe=E||null;n++;for(let q=0;q<16;q++)spawnP(x,y+Math.random()*2,z,(Math.random()-.5)*3,Math.random()*4,(Math.random()-.5)*3,f.fc||[1,0.5,0.1],0.6,3);break;}}
    if(n&&Math.hypot(PL.x-f.x,PL.z-f.z)<70)toast((f.L?f.L.name:'The Emberlord')+' calls its servants out of the fire');burst(1,'lowpass',300,0.8,0.4,0,[f.x,f.y+4,f.z]);return true;}
  if(k==='fissure'){const L=Math.min(30,dp+6),ax=f.x+ux*3,az=f.z+uz*3;EMB_HZ.push({k:'fis',f:f,X:ax+OX,Z:az+OZ,X2:ax+ux*L+OX,Z2:az+uz*L+OZ,y:f.y,t:0,warn:1,T:4.5,tk:0});burst(0.9,'lowpass',120,0.8,0.4,0,[f.x,f.y,f.z]);return true;}
  if(k==='erupt'){const t=f.tgt||[tx,ty,tz];for(let i=0;i<5;i++){const a=Math.random()*6.283,d=i?2+Math.random()*7:0,x=t[0]+Math.sin(a)*d,z=t[2]+Math.cos(a)*d,y=x>=0&&z>=0&&x<W&&z<D?foeStand(x,t[1]+1,z,1):-1;
      if(y>0)EMB_HZ.push({k:'eru',f:f,X:x+OX,Z:z+OZ,y:y,t:0,warn:1.2+i*0.25,T:1.9+i*0.25,tk:0});}foeCall(f,'alert');return true;}
  if(k==='wall'){const m=Math.min(dp*0.55,dp-4),cx=f.x+ux*m,cz=f.z+uz*m;EMB_HZ.push({k:'wall',f:f,X:cx-uz*9+OX,Z:cz+ux*9+OZ,X2:cx+uz*9+OX,Z2:cz-ux*9+OZ,y:foeStand(cx,f.y+2,cz,1)>0?foeStand(cx,f.y+2,cz,1):f.y,t:0,warn:0.6,T:10,tk:0});return true;}
  return false;}
// ---- hazards on the ground (world coordinates): fissures, walls of fire, eruptions, falling stones
const EMB_HZ=[];
const segD=(x,z,ax,az,bx,bz)=>{const vx=bx-ax,vz=bz-az,l2=vx*vx+vz*vz||1,t=Math.max(0,Math.min(1,((x-ax)*vx+(z-az)*vz)/l2));return Math.hypot(x-ax-vx*t,z-az-vz*t);};
function emberHazards(dt){for(let i=EMB_HZ.length-1;i>=0;i--){const h=EMB_HZ[i],c=h.f.fc||[1,0.5,0.1];h.t+=dt;const live=h.t>=h.warn;h.tk-=dt;
    const ax=h.X-OX,az=h.Z-OZ,near=Math.hypot(ax-PL.x,az-PL.z)<120;
    if(h.k==='fis'||h.k==='wall'){const bx=h.X2-OX,bz=h.Z2-OZ,L=Math.hypot(bx-ax,bz-az);
      if(near)for(let k=0;k<(live?8:3);k++){const s=Math.random(),x=ax+(bx-ax)*s,z=az+(bz-az)*s;
        if(!live)spawnP(x,h.y+0.1,z,0,0.2,0,[c[0],c[1]*0.7,c[2]*0.5],0.3,0);else spawnP(x+(Math.random()-.5)*0.6,h.y+0.2,z+(Math.random()-.5)*0.6,(Math.random()-.5)*0.4,h.k==='wall'?4+Math.random()*4:2+Math.random()*2,(Math.random()-.5)*0.4,c,0.7,-0.2);}
      if(live&&h.tk<=0){h.tk=0.5;const r=h.k==='wall'?1.4:1.7;
        if(foeTarget()&&segD(PL.x,PL.z,ax,az,bx,bz)<r&&PL.y>h.y-2&&PL.y<h.y+(h.k==='wall'?7:3))foeHurtPlayer(h.k==='wall'?5:4,'ember',0,0,0.5);
        for(const g of foes)if(!g.dead&&FOES[g.kind].folk&&segD(g.x,g.z,ax,az,bx,bz)<r+0.4&&Math.abs(g.y-h.y)<4)foeHurtFoe(g,5,h.f,0,0,0.5);}}
    else if(h.k==='eru'||h.k==='rock'){
      if(!live){if(near&&Math.random()<dt*20)spawnP(ax+(Math.random()-.5)*2,h.k==='rock'?h.y+9:h.y+0.1,az+(Math.random()-.5)*2,0,h.k==='rock'?-3:0.3,0,h.k==='rock'?[0.35,0.33,0.32]:[c[0],c[1]*0.6,c[2]*0.4],0.4,h.k==='rock'?2:0);}
      else if(!h.done){h.done=1;if(h.k==='eru'){for(let k=0;k<40;k++)spawnP(ax+(Math.random()-.5)*1.5,h.y+Math.random(),az+(Math.random()-.5)*1.5,(Math.random()-.5)*2,6+Math.random()*8,(Math.random()-.5)*2,c,0.9,-0.6);
          burst(0.7,'lowpass',180,0.8,0.4,0,[ax,h.y,az]);emberHit(h.f,ax,h.y,az,2.7,12,'erupt',3,9);}
        else{for(let k=0;k<20;k++)spawnP(ax,h.y+0.5,az,(Math.random()-.5)*4,Math.random()*3,(Math.random()-.5)*4,[0.35,0.33,0.32],0.5,6);burst(0.4,'lowpass',140,0.8,0.35,0,[ax,h.y,az]);emberHit(h.f,ax,h.y,az,2.2,8,'ember',2);}}}
    if(h.t>=h.T)EMB_HZ.splice(i,1);}}
// ---- every frame (from updFoes): each lord's phase, breath and leap, the hazards, its flooding hall; the lords seen
let emberT=0;
function emberFrame(dt){emberHazards(dt);emberFloodTick(dt);emberT-=dt;const sec=emberT<=0;if(sec)emberT=1;
  for(const f of foes){if(!isLord(f))continue;
    if(f.dead){if(!f.emberDone){f.emberDone=1;emberFalls(f);}continue;}
    if(!f.fc&&f.L)f.fc=AM_KINDS.ember.coats[f.L.ci][0].fire.map(v=>v/255);
    if(f.ec)for(const k in f.ec)f.ec[k]-=dt;
    // seen
    if(sec&&f.L&&!emberKnown.has(f.L.id)&&Math.hypot(f.x-PL.x,f.z-PL.z)<70&&foeSees(f)){emberKnown.set(f.L.id,[Math.round(warPlay),f.L.n]);saveDirty=true;showName(f.L.n);toast(f.L.n+', lord of '+f.L.F.name.replace(/^The /,'the '));setTimeout(()=>toast(f.L.n+': '+f.L.T.t[0]),2600);}
    // its phase
    const p=emberPhase(f);if(p>(f.ph3||1)){f.ph3=p;const nm=f.L?f.L.n:'The Emberlord',close=Math.hypot(f.x-PL.x,f.z-PL.z)<90;foeCall(f,'alert');shake=Math.max(shake,close?1:0);
      if(close){toast(p===2?nm+' spreads its wings':nm+' tears at the mountain!');if(f.L)setTimeout(()=>toast(f.L.name+': '+f.L.T.t[p-1]),2000);}
      if(p===3){f.tear=2.5;if(f.L&&f.lordOf)emberFlood(f.L.F);}}
    if(f.tear>0)f.tear-=dt;
    // the breath: a cone of fire from its maw at its foe, burning what stands in it
    if(f.breath>0){f.breath-=dt;f.brT-=dt;const E=f.foe&&!f.foe.dead?f.foe:null,tx=E?E.x:PL.x,tz=E?E.z:PL.z;f.hd=Math.atan2(tx-f.x,tz-f.z);f.yaw+=angTo(f.yaw,f.hd)*Math.min(1,dt*3);
      const mx=f.x+Math.sin(f.yaw)*7,mz=f.z+Math.cos(f.yaw)*7,my=f.y+13,ty=(E?E.y:PL.y)+1;
      for(let k=0;k<10;k++){const a=f.yaw+(Math.random()-.5)*0.6,v=14+Math.random()*8,dy=(ty-my)/22;spawnP(mx,my,mz,Math.sin(a)*v,dy*v+(Math.random()-.5)*2,Math.cos(a)*v,f.fc||[1,0.5,0.1],0.5+Math.random()*0.5,-0.4);}
      if(f.brT<=0){f.brT=0.25;burst(0.3,'bandpass',300,0.6,0.25,0,[mx,my,mz]);
        const inCone=(x,y,z)=>{const vx=x-mx,vz=z-mz,d=Math.hypot(vx,vz);return d<26&&Math.abs(angTo(f.yaw,Math.atan2(vx,vz)))<0.5&&y<my+3;};
        if(foeTarget()&&inCone(PL.x,PL.y,PL.z))foeHurtPlayer(3,'breath',Math.sin(f.yaw),Math.cos(f.yaw),1);
        for(const g of foes)if(!g.dead&&FOES[g.kind].folk&&inCone(g.x,g.y,g.z))foeHurtFoe(g,3,f,Math.sin(f.yaw),Math.cos(f.yaw),1);}}
    // the leap: up on its wings and down where its foe stands, the ground shaken and those about the landing thrown down
    if(f.leap){const J=f.leap;J.t+=dt;const q=Math.min(1,J.t/J.T);f.x=J.x0+(J.x1-J.x0)*q;f.z=J.z0+(J.z1-J.z0)*q;f.y=J.y0+(J.y1-J.y0)*q+Math.sin(q*Math.PI)*(8+J.T*4);f.gy=f.y;
      if(q>=1){f.leap=null;f.y=f.gy=J.y1;shake=Math.max(shake,Math.max(0,1.2-Math.hypot(PL.x-f.x,PL.z-f.z)/40));sfxBoom(Math.hypot(PL.x-f.x,PL.z-f.z)*0.5,[f.x,f.y,f.z]);
        for(let k=0;k<50;k++){const a=Math.random()*6.283;spawnP(f.x+Math.sin(a)*3,f.y+0.5,f.z+Math.cos(a)*3,Math.sin(a)*8,1+Math.random()*2,Math.cos(a)*8,[0.3,0.28,0.27],1.4,1);}emberHit(f,f.x,f.y,f.z,8,10,'ember',9,5);}}
    // falling stones from the vault while it tears at the mountain
    if(sec&&f.ph3>=3&&Math.hypot(f.x-PL.x,f.z-PL.z)<50&&Math.random()<0.6){const near=Math.random()<0.6,cx=near?PL.x:f.x,cz=near?PL.z:f.z,a=Math.random()*6.283,d=Math.random()*9,x=cx+Math.sin(a)*d,z=cz+Math.cos(a)*d,y=x>=0&&z>=0&&x<W&&z<D?foeStand(x,f.y+1,z,1):-1;
      if(y>0)EMB_HZ.push({k:'rock',f:f,X:x+OX,Z:z+OZ,y:y,t:0,warn:1,T:1.4,tk:0});}}
  if(sec)emberCoolTick();}
// ---- the hall floods: from the end of its rivers by the dais toward the way in, one bay of the rivers rising over the floor every
// second and a half, and the lava running out over it from there
function emberFlood(F){if(F.flood)return;const P=F.P,E=F.U1+F.Lh,u1=E-P.steps-6,u0=F.U1+4;F.flood={u:u1,u0:u0,t:0};}
function emberFloodTick(dt){for(const f of foes){if(!isLord(f)||f.dead||!f.L)continue;const F=f.L.F,Fl=F.flood;if(!Fl||Fl.u<Fl.u0)continue;Fl.t-=dt;if(Fl.t>0)continue;Fl.t=1.5;const P=F.P;
    for(let du=0;du<4&&Fl.u>=Fl.u0;du++,Fl.u--){if(fortBridge(F,Fl.u-F.U1))continue;for(const s of [-1,1])for(let a=P.lv;a<P.lv+P.k;a++){const v=s*a,X=F.GX-F.ox*Fl.u+F.px*v,Z=F.GZ-F.oz*Fl.u+F.pz*v,x=X-OX,z=Z-OZ;
      if(x<0||z<0||x>=W||z>=D||get(x,F.Fh,z)!==AIR)continue;setBlock(x,F.Fh,z,LAVA,true);if(Math.random()<0.3)spawnP(x+0.5,F.Fh+1,z+0.5,0,2,0,[1,0.5,0.1],0.6,0);}}}}
// ---- when a lord falls: what it called burns out, and the lava loosed in its hall cools (now if loaded, else when next loaded)
const emberCooled=new Set();
function emberFalls(f){for(const g of foes)if(g.sum===f.id&&!g.dead){g.hp=0;g.dead=0.001;g.st='dead';for(let k=0;k<10;k++)spawnP(g.x,g.y+1,g.z,(Math.random()-.5)*2,Math.random()*3,(Math.random()-.5)*2,f.fc||[1,0.5,0.1],0.5,1);}
  for(let i=EMB_HZ.length-1;i>=0;i--)if(EMB_HZ[i].f===f)EMB_HZ.splice(i,1);
  if(f.L){showName(f.L.n+' has fallen');if(f.L.F.flood)f.L.F.flood.u=-1e9;emberCool(f.L.F);}}
function emberCool(F){const P=F.P,E=F.U1+F.Lh;let all=true;
  for(let u=F.U1-8;u<E;u++)for(let v=-P.hw;v<=P.hw;v++){const X=F.GX-F.ox*u+F.px*v,Z=F.GZ-F.oz*u+F.pz*v,x=X-OX,z=Z-OZ;if(x<0||z<0||x>=W||z>=D||!genDone[(x>>4)+(z>>4)*NCX]){all=false;continue;}
    for(let y=F.Fh;y<=F.Fh+2;y++)if(get(x,y,z)===LAVA)setBlock(x,y,z,lvl[I(x,y,z)]?LAVACRUST:OBSID,true);}
  if(all)emberCooled.add(F.id);}
function emberCoolTick(){if(!fallenLords.size)return;for(const F of fortsNear(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),60))if(F.great&&fallenLords.has(F.id)&&!emberCooled.has(F.id))emberCool(F);}
// ---- the journal: the lords the player has seen, their stories, the fallen
function emberJournal(out){if(!emberKnown.size)return;out.push('','THE EMBERLORDS');
  for(const [id,[t,n]] of emberKnown){const F=[...FORT_C.values()].find(F=>F&&F.id===id),fell=fallenLords.has(id);out.push('',n+(fell?' (fallen)':'')+', first seen in hour '+(t/3600).toFixed(1)+'.');if(F)out.push(...emberStory(emberLord(F)));}}
