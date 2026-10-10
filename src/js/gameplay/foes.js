// ---- Foes (D-052): the first hostile creatures, all of the Volcanic Wastes. Orc warbands (raiders, bowmen, brutes, now and
// then a warchief) and ash trolls roam its surface and hold the Ashen Citadel; goblins (cutters, slingers, firecallers and a
// chieftain) live in the warrens below and keep camp at their ways in; an Emberlord waits in each fortress in the great
// volcanoes, with orcs at its gate. In survival they hunt the player by sight, strike, shoot and throw; in creative they take
// no notice of the player at all. Like the animals they come and go around the player (Math.random is fine here); only the
// Emberlords that have fallen are saved (fk), so a fortress once emptied stays empty.
const FOES={
  // n name; m model; hp; dmg a blow; reach; walk and run (blocks a second); sight; cd between blows; wind the wind-up of a blow;
  // shot {dmg, v speed, lo and hi range, cd, k kind, n volley}; keep: the distance a shooter keeps; flee: share of health at
  // which it runs; block: share of a blow a shield takes from the front; mass: how far blows push it; tall: room it needs;
  // drops [[id, least, most, chance]]; cause: how the death screen names it
  goblin:{n:'Goblin Cutter',m:'goblin',hp:8,dmg:2,reach:1.5,walk:1.5,run:4.7,sight:14,cd:0.8,wind:0.3,flee:0.3,mass:0.8,drops:[[200,1,2,0.6],[339,1,2,0.3],[220,1,2,0.25]],cause:'goblin'},
  gslinger:{n:'Goblin Slinger',m:'gslinger',hp:6,dmg:1,reach:1.5,walk:1.4,run:4.4,sight:18,cd:1,wind:0.3,shot:{dmg:2,v:16,lo:4,hi:17,cd:2.2,k:'stone'},keep:7,flee:0.4,mass:0.8,drops:[[200,1,2,0.5],[221,1,2,0.3],[338,1,1,0.2]],cause:'stone'},
  gfire:{n:'Goblin Firecaller',m:'gfire',hp:9,dmg:1,reach:1.5,walk:1.3,run:4,sight:18,cd:1.2,wind:0.4,shot:{dmg:3,v:10,lo:4,hi:18,cd:3.2,k:'fire'},keep:9,flee:0.3,mass:0.8,drops:[[SULFUR,1,3,0.6],[338,1,2,0.4],[230,1,1,0.05]],cause:'fire'},
  gchief:{n:'Goblin Chieftain',m:'gchief',hp:34,dmg:5,reach:2,walk:1.3,run:4,sight:18,cd:1.2,wind:0.45,mass:0.5,boss:1,drops:[[224,2,5,1],[230,1,2,0.5],[372,1,1,0.35]],cause:'goblin'},
  raider:{n:'Orc Raider',m:'orc',hp:16,dmg:3,reach:2,walk:1.5,run:4.8,sight:22,cd:1.1,wind:0.4,mass:0.6,drops:[[213,1,2,0.5],[200,1,3,0.6],[352,1,1,0.3]],cause:'orc'},
  bowman:{n:'Orc Bowman',m:'obow',hp:12,dmg:2,reach:2,walk:1.5,run:4.6,sight:26,cd:1.2,wind:0.4,shot:{dmg:3,v:26,lo:5,hi:26,cd:2.4,k:'arrow'},keep:12,mass:0.6,drops:[[201,2,4,0.6],[328,1,3,0.4],[200,1,2,0.4]],cause:'arrow'},
  brute:{n:'Orc Brute',m:'obrute',hp:32,dmg:6,reach:2.3,walk:1.2,run:3.8,sight:20,cd:1.7,wind:0.6,block:0.6,mass:0.35,drops:[[213,2,4,0.7],[227,1,2,0.3],[362,1,2,0.4]],cause:'orc'},
  ochief:{n:'Orc Warchief',m:'ochief',hp:48,dmg:7,reach:2.5,walk:1.4,run:4.4,sight:28,cd:1.4,wind:0.55,mass:0.3,boss:1,drops:[[227,2,4,1],[224,1,3,0.6],[374,1,1,0.25]],cause:'orc'},
  troll:{n:'Ash Troll',m:'troll',hp:70,dmg:8,reach:3.2,walk:1.1,run:3.6,sight:20,cd:2.2,wind:0.8,shot:{dmg:6,v:15,lo:8,hi:22,cd:7,k:'rock'},mass:0.15,tall:3,drops:[[386,1,2,1],[CINDER,2,5,0.6],[230,1,1,0.1]],cause:'troll'},
  // the Emberlord towers eleven blocks tall: a reach of eight, a whip of eighteen, fire thrown in threes from forty; it never
  // goes farther from its throne than the terrace before its gate (leash, set when it is placed)
  ember:{n:'Emberlord',m:'ember',hp:640,dmg:12,reach:8,dyr:9,walk:1.8,run:4.2,sight:50,cd:2.2,wind:0.8,shot:{dmg:6,v:18,lo:10,hi:44,cd:3.5,k:'hellfire',n:3},whip:{dmg:7,lo:6,hi:18,cd:4.5},mass:0.02,tall:12,stride:4.5,boss:1,lord:1,
    drops:[[377,1,1,1],[378,1,1,1],[229,4,8,1],[228,3,6,1],[224,6,12,1]],cause:'ember'}
};
Object.assign(DEATH,{goblin:'A goblin got the better of you',stone:'A goblin’s sling stone found you',fire:'Goblin fire burned you',orc:'An orc cut you down',arrow:'An orc arrow found you',
  troll:'A troll crushed you',rock:'A troll’s thrown rock crushed you',ember:'An Emberlord burned you to ash'});
// who lives where: weights by place (warren halls by kind, camps before the ways in, warbands and trolls on the surface)
const FOE_HOME={den:[['goblin',3],['gslinger',1.5]],store:[['goblin',2],['gslinger',1]],forge:[['goblin',2],['gfire',1.5]],pen:[['goblin',2],['gslinger',1]],shrine:[['gfire',3],['goblin',1]],
  lava:[['goblin',2],['gslinger',2]],chief:[['goblin',2],['gslinger',1],['gfire',1]],camp:[['goblin',3],['gslinger',2]],band:[['raider',5],['bowman',3],['brute',1.5]],gate:[['raider',3],['bowman',2],['brute',1]]};
const FOE_N={den:[3,5],store:[2,3],forge:[3,3],pen:[2,3],shrine:[2,3],lava:[2,3],chief:[3,4],camp:[3,5],band:[2,5],gate:[4,5]};
const foes=[],shots=[],foeSpots=new Map(),TFO={};let foeT=0,foeId=1,foeClock=0,foeSnd=0;
const fallenLords=new Set(saved&&Array.isArray(saved.fk)?saved.fk.map(String):[]),foeSave=()=>({fk:[...fallenLords]});
entityKind({name:'foes',list:foes,update:dt=>updFoes(dt),persist:true,shift:(dx,dz)=>{for(const f of foes){f.x-=dx;f.z-=dz;f.hx-=dx;f.hz-=dz;if(f.tx!==undefined){f.tx-=dx;f.tz-=dz;}}
  for(const s of shots){s.x-=dx;s.z-=dz;}}});
const pickW=L=>{let t=0;for(const l of L)t+=l[1];let v=Math.random()*t;for(const l of L){v-=l[1];if(v<=0)return l[0];}return L[0][0];};
// the ground a foe of height `tall` stands on near y (like standY, with room for its height), or -1
function foeStand(x,y,z,tall){const bx=Math.floor(x),bz=Math.floor(z);if(bx<0||bz<0||bx>=W||bz>=D)return -1;
  for(let yy=Math.floor(y)+1;yy>=Math.floor(y)-3;yy--){if(yy<1||yy>=H-tall)continue;if(!SOLID[get(bx,yy-1,bz)])continue;let ok=true;for(let k=0;k<tall&&ok;k++)if(SOLID[get(bx,yy+k,bz)])ok=false;if(ok)return yy;}return -1;}
const foeWet=(x,y,z)=>{const id=get(Math.floor(x),y,Math.floor(z));return isWetId(id)||id===LAVA||get(Math.floor(x),y-1,Math.floor(z))===LAVA;};
function addFoe(kind,x,y,z,o){
  const F=FOES[kind],K=AM_KINDS[F.m],ci=o&&o.ci!==undefined&&K.coats[o.ci]?o.ci:amCoat(F.m,Math.random()),m=amBuild(F.m,ci,{});scene.add(m.grp);scene.add(m.shadow);
  const f=Object.assign({id:foeId++,kind:kind,x:x,y:y,z:z,gy:y,vy:0,kvx:0,kvz:0,yaw:Math.random()*6.283,hd:0,sp:0,st:'idle',t:1+Math.random()*2,hp:F.hp,mhp:F.hp,hx:x,hy:y,hz:z,grp:0,
    ph:Math.random()*6,amp:0,atk:0,atkK:'',atkT:0,shotT:1+Math.random()*2,whipT:3,seen:0,losT:0,vis:false,lk:0,lkT:0,hurt:0,ct:4+Math.random()*10,lt:0,eL:1,eB:0,det:0,detT:0,ci:ci,m:m},o||{});
  f.hd=f.yaw;if(!f.grp)f.grp=f.id;foes.push(f);placeFoe(f,0);return f;
}
function removeFoe(f){scene.remove(f.m.grp);scene.remove(f.m.shadow);f.m.mat.dispose();f.m.shadow.material.dispose();const i=foes.indexOf(f);if(i>=0)foes.splice(i,1);}
// a group of `n` from a place's table around (x,z) near height y, sharing a group and a home; spread within r
function spawnGroup(table,n,x,y,z,r,o){
  let lead=null;const out=[];
  for(let i=0;i<n;i++){const kind=i===0&&o&&o.lead?o.lead:pickW(FOE_HOME[table]),tall=FOES[kind].tall||2;let p=null;
    for(let k=0;k<14&&!p;k++){const a=Math.random()*6.283,d=Math.random()*r,xx=x+Math.cos(a)*d,zz=z+Math.sin(a)*d,yy=foeStand(xx,y+1,zz,tall);if(yy>0&&!foeWet(xx,yy,zz))p=[xx,yy,zz];}
    if(!p)continue;const f=addFoe(kind,p[0],p[1],p[2],Object.assign({grp:lead?lead.grp:0,spot:o&&o.spot},o&&o.sleep&&Math.random()<o.sleep?{st:'sleep',t:999}:{}));if(!lead)lead=f;out.push(f);}
  return out;
}
// ---- Where foes come from: the places near the player (warren halls and camps, fortresses, the Ashen Citadel) are peopled
// once while you are near; out on the wastes warbands and trolls come and go
const FOE_CAP=16;
function foePlaces(){
  const X=PL.x+OX,Z=PL.z+OZ,out=[];
  // a warren's halls fill while you are underground near them (or right above); the camps at its ways in whenever you are near
  const bx=Math.floor(PL.x),bz=Math.floor(PL.z),under=bx>=0&&bz>=0&&bx<W&&bz<D&&PL.y<ground[bx+W*bz]-6;
  for(const s of warrenSpots(X,Z,60))if(s.kind==='camp'||(under?Math.hypot(s.x-X,s.z-Z)<52:Math.hypot(s.x-X,s.z-Z)<28))out.push(s);
  for(const F of fortsNear(X,Z,80)){const S=fortSpots(F),id=F.id;out.push({id:id+'g',x:S.guards[0].x,y:F.Fy,z:S.guards[0].z,R:6,kind:'gate'});if(!F.great||!fallenLords.has(id))out.push({id:id,x:S.lord.x,y:S.lord.y,z:S.lord.z,R:F.great?1:5,kind:'lord',F:F});}
  const sg=sigNear(X,Z,60);if(sg&&sg.kind==='citadel')out.push({id:'s'+sg.X+','+sg.Z,x:sg.X,y:sg.g,z:sg.Z,R:9,kind:'citadel'});
  return out;
}
function foeSpawnTick(){
  const X=PL.x+OX,Z=PL.z+OZ;
  // a place is peopled once while the player is near; it may be again after they have gone well away
  for(const [id,rec] of foeSpots)if(Math.hypot(rec.x-X,rec.z-Z)>120)foeSpots.delete(id);
  for(const s of foePlaces()){if(foeSpots.has(s.id)||(foes.length>=28&&s.kind!=='lord'))continue;const x=s.x-OX,z=s.z-OZ;if(x<2||z<2||x>=W-2||z>=D-2||!genDone[(Math.floor(x)>>4)+(Math.floor(z)>>4)*NCX])continue;
    foeSpots.set(s.id,{x:s.x,z:s.z});const o={spot:s.id};
    if(s.kind==='lord'&&s.F.great){const f=addFoe('ember',x,s.y,z,{spot:s.id,lordOf:s.id,st:'idle',t:3,leash:fortSpots(s.F).reach});f.yaw=f.hd=Math.atan2(s.F.ox,s.F.oz);continue;}
    if(s.kind==='lord'){spawnGroup('gate',4,x,s.y,z,5,{spot:s.id,lead:'ochief'});continue;}
    if(s.kind==='citadel'){spawnGroup('band',4+Math.floor(Math.random()*3),x,s.y,z,s.R,{spot:s.id,lead:'ochief'});continue;}
    const N=FOE_N[s.kind]||[2,3],n=N[0]+Math.floor(Math.random()*(N[1]-N[0]+1));
    spawnGroup(s.kind,n,x,s.y,z,s.R,{spot:s.id,lead:s.kind==='chief'?'gchief':null,sleep:s.kind==='den'?0.45:0});}
  // the wastes: a warband (sometimes led by a warchief) or a troll, out of sight, on open ground of the volcanic land
  const roam=foes.filter(f=>!f.spot&&!f.dead).length,cap=(ambNight()?14:10)-Math.max(0,foes.length-FOE_CAP);if(roam>=cap||Math.random()>0.35)return;
  const a=PL.yaw+Math.PI+(Math.random()-0.5)*Math.PI*1.4,d=38+Math.random()*28,x=PL.x-Math.sin(a)*d,z=PL.z-Math.cos(a)*d,bx=Math.floor(x),bz=Math.floor(z);
  if(bx<3||bz<3||bx>=W-3||bz>=D-3)return;const g=ground[bx+W*bz];if(g<=SEA||!genDone[(bx>>4)+(bz>>4)*NCX]||PL.y<g-14)return;
  colInfo(bx+OX,bz+OZ,TFO);if(TFO.wVolc<0.55||TFO.vflow||TFO.vfis||TFO.vlake)return;const top=get(bx,g,bz);if(!SOLID[top]||top===LAVA)return;
  if(Math.random()<0.2)spawnGroup('band',1,x,g,z,2,{lead:'troll'});
  else spawnGroup('band',2+Math.floor(Math.random()*3)+(Math.random()<0.12?1:0),x,g,z,5,{lead:Math.random()<0.12?'ochief':null});
}
// ---- Behaviour
// can a foe see the player? A ray from its eyes to the player's, through anything but solid opaque blocks
function foeSees(f){const F=FOES[f.kind],ex=f.x,ey=f.y+f.m.box[4]*0.85,ez=f.z,tx=PL.x,ty=PL.y+EYE,tz=PL.z,d=Math.hypot(tx-ex,ty-ey,tz-ez),n=Math.ceil(d*2);
  if(d>F.sight*2.6)return false;for(let k=1;k<n;k++){const q=k/n,id=get(Math.floor(ex+(tx-ex)*q),Math.floor(ey+(ty-ey)*q),Math.floor(ez+(tz-ez)*q));if(OPQ[id]&&SOLID[id])return false;}return true;}
const foeTarget=()=>SURV()&&!dead&&playing; // in creative (and when dead or paused) foes take no notice of the player
function foeAlert(f){for(const g of foes){if(g.dead||g.st==='chase'||g.st==='flee')continue;if(g===f||(g.grp===f.grp&&Math.hypot(g.x-f.x,g.z-f.z)<20)){g.st='chase';g.seen=0;g.t=0;if(g!==f&&Math.random()<0.5)g.ct=Math.random()*0.6;}}
  foeCall(f,'alert');}
function foeHome(f,r){for(let k=0;k<6;k++){const a=Math.random()*6.283,d=1+Math.random()*r,tx=f.hx+Math.sin(a)*d,tz=f.hz+Math.cos(a)*d,ty=foeStand(tx,f.y,tz,FOES[f.kind].tall||2);
  if(ty>0&&Math.abs(ty-f.y)<=2&&!foeWet(tx,ty,tz)){f.tx=tx;f.tz=tz;return true;}}return false;}
function stepFoe(f,dt){
  const F=FOES[f.kind],dx=PL.x-f.x,dz=PL.z-f.z,dp=Math.hypot(dx,dz),dy=PL.y-f.y,tg=foeTarget();
  f.hurt=Math.max(0,f.hurt-dt*3);f.atkT-=dt;f.shotT-=dt;f.whipT-=dt;f.detT-=dt;
  if(f.dead){f.dead+=dt;f.sp=0;return;}
  if(f.hold){f.sp=f.holdSp||0;f.hd=f.yaw;if(f.holdAtk!==undefined)f.atk=f.holdAtk;return;}
  f.t-=dt;
  // sight: noticed when near and in view (sleepers only close by); lost when long unseen or far
  f.losT-=dt;if(tg&&f.losT<=0&&dp<F.sight*2.6+4){f.losT=0.35+Math.random()*0.15;f.vis=dp<F.sight*2.6&&Math.abs(dy)<14&&foeSees(f);}
  if(!tg){if(f.st==='chase'||f.st==='flee'){f.st='return';f.atk=0;}}
  else if(f.st!=='chase'&&f.st!=='flee'){const rr=f.st==='sleep'?Math.min(4,F.sight*0.3):F.sight;if(f.vis&&dp<rr)foeAlert(f);}
  else if(f.st==='chase'){f.seen=f.vis?0:f.seen+dt;if(f.seen>8||dp>F.sight*2.5){f.st='return';f.atk=0;}}
  if(f.leash&&f.st==='chase'&&Math.hypot(PL.x-f.hx,PL.z-f.hz)>f.leash+12){f.st='return';f.atk=0;}
  if(F.flee&&tg&&f.st==='chase'&&!f.fled&&f.hp<f.mhp*F.flee){f.st='flee';f.t=3+Math.random()*2;f.fled=true;foeCall(f,'hurt');}
  if(f.st==='flee'&&f.t<=0)f.st='chase';
  let want=0,face=false;
  switch(f.st){
    case 'sleep':break;
    case 'idle':if(f.t<=0){if(Math.random()<0.5&&foeHome(f,6)){f.st='walk';f.t=10;}else f.t=1.5+Math.random()*3;}break;
    case 'walk':{const tdx=f.tx-f.x,tdz=f.tz-f.z,d=Math.hypot(tdx,tdz);if(d<0.6||f.t<=0){f.st='idle';f.t=1+Math.random()*3;}else{f.hd=Math.atan2(tdx,tdz);want=F.walk;}break;}
    case 'return':{const tdx=f.hx-f.x,tdz=f.hz-f.z,d=Math.hypot(tdx,tdz);if(d<2.5||f.t<-30){f.st='idle';f.t=2;}else{f.hd=Math.atan2(tdx,tdz);want=F.walk*1.3;}break;}
    case 'flee':f.hd=Math.atan2(-dx,-dz)+Math.sin(foeClock*1.7+f.id)*0.4;want=F.run;break;
    case 'chase':{
      const toward=Math.atan2(dx,dz),S=F.shot;face=true;
      // ranged: shoot when in range and in view, keeping a distance; otherwise close in
      if(S&&f.vis&&dp>=S.lo&&dp<=S.hi&&f.shotT<=0&&!f.atk){f.atk=0.45;f.atkK='shot';f.shotT=S.cd*(0.8+Math.random()*0.4);}
      if(F.whip&&f.vis&&dp>=F.whip.lo&&dp<=F.whip.hi&&f.whipT<=0&&!f.atk){f.atk=0.55;f.atkK='whip';f.whipT=F.whip.cd;}
      if(dp<F.reach+0.2&&Math.abs(dy)<(F.dyr||2.4)&&f.atkT<=0&&!f.atk){f.atk=F.wind;f.atkK='blow';f.atkT=F.cd;}
      if(F.keep&&dp<F.keep&&!f.atk){f.hd=toward+Math.PI+(f.id%2?0.5:-0.5);want=F.walk*1.2;}
      else if(F.keep&&S&&dp<=S.hi*0.8&&f.vis){f.hd=toward+(Math.floor(foeClock/3+f.id)%2?1.4:-1.4);want=F.walk*0.6;}
      else if(dp>F.reach*0.8){f.hd=toward;want=dp>6?F.run:F.walk*1.6;}
      if(f.atk)want*=0.25;
      // a way round what blocks it
      if(f.det&&f.detT>0)f.hd+=f.det*1.1;break;}
  }
  // the blow, the shot or the lash lands at the end of its wind-up
  if(f.atk>0){f.atk-=dt;if(f.atk<=0){f.atk=0;foeStrike(f,F);}}
  // turn and move like the animals: steps of one block up, drops of up to three, never into water or lava
  const tall=F.tall||2,turn=F.mass<0.2?2.6:F.mass<0.5?4:6;
  if(face&&!want)f.hd=Math.atan2(dx,dz);
  const dh=angTo(f.yaw,f.hd);f.yaw+=Math.sign(dh)*Math.min(Math.abs(dh),turn*dt*(f.st==='chase'?1.5:1));
  if(Math.abs(dh)>1.3)want*=0.3;f.sp+=(want-f.sp)*Math.min(1,dt*6);if(f.sp<0.01)f.sp=0;
  const mx=Math.sin(f.yaw)*f.sp+f.kvx,mz=Math.cos(f.yaw)*f.sp+f.kvz;f.kvx*=Math.max(0,1-dt*5);f.kvz*=Math.max(0,1-dt*5);
  if(Math.abs(mx)+Math.abs(mz)>1e-4){const nx=f.x+mx*dt,nz=f.z+mz*dt,ml=Math.hypot(mx,mz),rr=Math.max(0.25,f.m.box[5]*0.8),fx=f.x+mx/ml*rr,fz=f.z+mz/ml*rr;
    const gn=foeStand(nx,f.y+0.05,nz,tall),gf=foeStand(fx,f.y+0.05,fz,tall),ok=!(f.leash&&Math.hypot(nx-f.hx,nz-f.hz)>f.leash)&&gn>0&&gf>0&&gn-f.y<=1.01&&gf-f.y<=1.01&&f.y-gn<=3&&f.y-gf<=3&&!foeWet(nx,gn,nz)&&!foeWet(fx,gf,fz);
    if(ok){f.x=nx;f.z=nz;f.gy=gn;f.stuck=0;}else{f.sp*=0.2;f.kvx=f.kvz=0;f.stuck=(f.stuck||0)+dt;if(f.st==='walk'){f.st='idle';f.t=0.5;}else if(f.st==='chase'&&f.detT<=0){f.det=Math.random()<0.5?1:-1;f.detT=0.9;}
      else if(f.st==='flee'||f.st==='return')f.hd=f.yaw+(f.id%2?1:-1)*(1.4+Math.random());}}
  const gy=foeStand(f.x,f.y+0.05,f.z,tall);if(gy>0)f.gy=gy;
  if(f.vy>0||f.y>f.gy+0.001){f.vy-=24*dt;f.y+=f.vy*dt;if(f.y<=f.gy){f.y=f.gy;f.vy=0;}}else if(f.y<f.gy)f.y=Math.min(f.gy,f.y+5*dt);
  // room from each other and the player
  const r1=Math.max(f.m.box[3],-f.m.box[0])+0.1;
  if(dp<r1+0.3&&dp>0.01){f.kvx-=dx/dp*dt*14;f.kvz-=dz/dp*dt*14;}
  for(const g of foes){if(g===f||g.dead)continue;const ex=f.x-g.x,ez=f.z-g.z,e=Math.hypot(ex,ez),rr=r1+Math.max(g.m.box[3],-g.m.box[0]);if(e<rr&&e>0.01){f.kvx+=ex/e*(rr-e)*dt*6;f.kvz+=ez/e*(rr-e)*dt*6;}}
  // the head turns to the player when near; now and then a call
  if(dp<12&&f.st!=='sleep'){f.lkT=Math.max(-0.8,Math.min(0.8,angTo(f.yaw,Math.atan2(dx,dz))));}else f.lkT*=0.9;
  f.ct-=dt;if(f.ct<=0){f.ct=(f.st==='chase'?3:8)+Math.random()*10;if(dp<36&&f.st!=='sleep')foeCall(f,f.st==='chase'?'alert':'idle');}
}
// a blow, a shot or a lash, as its wind-up ends
function foeStrike(f,F){
  const dx=PL.x-f.x,dz=PL.z-f.z,dp=Math.hypot(dx,dz),dy=PL.y-f.y,tg=foeTarget();
  if(f.atkK==='blow'){foeCall(f,'blow');if(tg&&dp<F.reach+0.7&&Math.abs(dy)<(F.dyr||2.6)){foeHurtPlayer(F.dmg,F.cause,dx/(dp||1),dz/(dp||1),F.mass<0.2?9:5);}}
  else if(f.atkK==='whip'){burst(0.25,'highpass',2200,0.8,0.3,0,[f.x,f.y+2,f.z]);if(tg&&dp<F.whip.hi+1.2&&Math.abs(dy)<4){foeHurtPlayer(F.whip.dmg,F.cause,-dx/(dp||1)*0.6,-dz/(dp||1)*0.6,4);
    for(let k=0;k<10;k++){const q=k/10;spawnP(f.x+dx*q,f.y+2.2-q*1.2,f.z+dz*q,0,0.6,0,[1,0.5,0.1],0.4,0);}}}
  else if(f.atkK==='shot'){const S=F.shot;for(let k=0;k<(S.n||1);k++)foeShoot(f,S,k);}
}
// a hit on the player: the blow, knocked back and up, less through armour
function foeHurtPlayer(n,cause,ux,uz,kb){if(!foeTarget())return;const before=hp;hurt(armourCut(n),cause);if(hp<before){PL.vx+=ux*kb;PL.vz+=uz*kb;PL.vy=Math.max(PL.vy,3.5);PL.ground=false;}}
// ---- Shots: arrows, sling stones, goblin fire, a troll's rock and an Emberlord's fire, flying by speed and weight
const SHOT_K={arrow:{g:9,sz:0.12,col:[0.42,0.32,0.22]},stone:{g:14,sz:0.14,col:[0.5,0.5,0.52]},fire:{g:0,sz:0.3,col:[1,0.55,0.12],glow:1},rock:{g:16,sz:0.55,col:[0.28,0.27,0.28]},hellfire:{g:0,sz:0.9,col:[1,0.5,0.1],glow:1}};
const shotGeo=new THREE.BoxGeometry(1,1,1);
function foeShoot(f,S,k){
  const K=SHOT_K[S.k],ex=f.x+Math.sin(f.yaw)*0.6,ey=f.y+f.m.box[4]*0.8,ez=f.z+Math.cos(f.yaw)*0.6;
  // lead the player a little, and loft a heavy shot so it lands
  const tx=PL.x,ty=PL.y+1.1,tz=PL.z,d=Math.hypot(tx-ex,tz-ez),t=d/S.v,ax=tx+PL.vx*t*0.6+(k?(Math.random()-0.5)*k*2.5:0),az=tz+PL.vz*t*0.6+(k?(Math.random()-0.5)*k*2.5:0);
  const vx=(ax-ex)/t,vz=(az-ez)/t,vy=(ty-ey)/t+0.5*K.g*t;
  const mat=new THREE.MeshBasicMaterial({color:new THREE.Color(K.col[0],K.col[1],K.col[2]),transparent:!!K.glow,opacity:K.glow?0.92:1}),m=new THREE.Mesh(shotGeo,mat);
  m.scale.x=m.scale.y=m.scale.z=K.sz;if(S.k==='arrow'){m.scale.z=0.9;m.scale.x=m.scale.y=0.07;}m.frustumCulled=false;scene.add(m);
  shots.push({x:ex,y:ey,z:ez,vx:vx,vy:vy,vz:vz,k:S.k,dmg:S.dmg,cause:S.k==='stone'?'stone':S.k==='rock'?'rock':S.k==='arrow'?'arrow':FOES[f.kind].cause,life:4,m:m});
  if(S.k==='fire'||S.k==='hellfire')burst(0.5,'lowpass',S.k==='fire'?500:220,0.8,S.k==='fire'?0.25:0.4,0,[ex,ey,ez]);else if(S.k==='arrow')burst(0.12,'bandpass',1800,2,0.2,0,[ex,ey,ez]);else burst(0.18,'lowpass',300,1,0.25,0,[ex,ey,ez]);
}
function updShots(dt){
  for(let i=shots.length-1;i>=0;i--){const s=shots[i],K=SHOT_K[s.k];s.life-=dt;s.vy-=K.g*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;
    let gone=s.life<=0;const id=get(Math.floor(s.x),Math.floor(s.y),Math.floor(s.z));
    if(!gone&&SOLID[id])gone=true;
    if(!gone&&s.x>PL.x-HW-K.sz&&s.x<PL.x+HW+K.sz&&s.z>PL.z-HW-K.sz&&s.z<PL.z+HW+K.sz&&s.y>PL.y-K.sz&&s.y<PL.y+PH+K.sz){
      const v=Math.hypot(s.vx,s.vz)||1;foeHurtPlayer(s.dmg,s.cause,s.vx/v,s.vz/v,s.k==='rock'?7:2);gone=true;}
    if((s.k==='fire'||s.k==='hellfire')&&Math.random()<(s.k==='fire'?0.6:1))spawnP(s.x,s.y,s.z,(Math.random()-.5)*0.5,0.3,(Math.random()-.5)*0.5,[1,0.45+Math.random()*0.3,0.1],0.35,-0.5);
    if(gone){if(s.k==='fire'||s.k==='hellfire')for(let k=0;k<(s.k==='fire'?8:24);k++)spawnP(s.x,s.y,s.z,(Math.random()-.5)*3,Math.random()*2,(Math.random()-.5)*3,[1,0.5,0.1],0.5,4);
      else if(s.k==='rock')for(let k=0;k<6;k++)spawnP(s.x,s.y,s.z,(Math.random()-.5)*3,Math.random()*3,(Math.random()-.5)*3,[0.3,0.3,0.3],0.6,14);
      scene.remove(s.m);s.m.material.dispose();shots.splice(i,1);continue;}
    s.m.position.x=s.x;s.m.position.y=s.y;s.m.position.z=s.z;s.m.rotation.y=Math.atan2(s.vx,s.vz);s.m.rotation.x=-Math.atan2(s.vy,Math.hypot(s.vx,s.vz));}
}
// ---- The parts in motion: legs and arms in step, a wind-up and a blow, a bow drawn, a sling whirled, wings that beat,
// a whip that trails, a fall when slain
function placeFoe(f,dt){
  const F=FOES[f.kind],M=f.m,P=M.parts,root=M.root,rest=g=>g.userData.rest,sp=f.sp,big=F.mass<0.2;
  const ph0=f.ph;f.ph+=sp*dt/(F.stride||(big?1.6:F.walk>1.4?0.9:1.1))*6.2832;
  if(F.stride&&Math.floor(f.ph/Math.PI)!==Math.floor(ph0/Math.PI)&&sp>0.3){const d=Math.hypot(f.x-PL.x,f.z-PL.z);if(d<48){burst(0.5,'lowpass',90,0.8,0.4*(1-d/48),0,[f.x,f.y,f.z]);shake=Math.max(shake,0.35*(1-d/48));}} // its footfalls shake the groundf.amp+=((sp>0.05?Math.min(1,0.45+sp/F.run*0.8):0)-f.amp)*Math.min(1,dt*6);
  f.lk+=(f.lkT-f.lk)*Math.min(1,dt*4);
  const amp=f.amp*(big?0.5:0.8),s1=Math.sin(f.ph),w=F.wind||0.4,prog=f.atk>0?1-f.atk/(f.atkK==='shot'?0.45:f.atkK==='whip'?0.55:w):0;
  if(P.legL){P.legL.rotation.x=rest(P.legL)[0]+s1*amp;P.legR.rotation.x=rest(P.legR)[0]-s1*amp;}
  if(P.armL){P.armL.rotation.x=rest(P.armL)[0]-s1*amp*0.8;P.armR.rotation.x=rest(P.armR)[0]+s1*amp*0.8;P.armL.rotation.z=rest(P.armL)[2];P.armR.rotation.z=rest(P.armR)[2];}
  // the attack: the right arm (or both, for a shot or a lash) raised through the wind-up, then brought down at once
  if(f.atk>0){const up=Math.min(1,prog*1.4);
    if(f.atkK==='blow'){P.armR.rotation.x=rest(P.armR)[0]-2.6*up;if(big)P.armL.rotation.x=rest(P.armL)[0]-1.4*up;}
    else if(f.atkK==='shot'){if(F.shot.k==='arrow'){P.armL.rotation.x=-1.5;P.armR.rotation.x=-1.5;P.armR.rotation.z=0.6*up;}else{P.armR.rotation.x=rest(P.armR)[0]-2.8*up;}}
    else if(f.atkK==='whip'){P.armL.rotation.x=-1.2*up;P.armL.rotation.z=0.9*up;}}
  else if(f.swing>0){f.swing=Math.max(0,f.swing-dt*5);P.armR.rotation.x=rest(P.armR)[0]+0.7*f.swing;} // the follow-through
  if(f.st==='sleep'&&P.body){root.rotation.x+=(-1.45-root.rotation.x)*Math.min(1,dt*2);root.position.y=0.25;}
  else if(!f.dead){root.rotation.x*=1-Math.min(1,dt*6);root.position.y=0;}
  if(P.head){P.head.rotation.y=f.lk*0.7;}
  if(P.wingL){const b=Math.sin(foeClock*(f.st==='chase'?3.2:1.4))*0.25;P.wingL.rotation.y=rest(P.wingL)[1]+b;P.wingR.rotation.y=rest(P.wingR)[1]-b;}
  if(P.whip1){const k=f.atkK==='whip'&&f.atk>0?prog:0,wv=Math.sin(foeClock*4+f.id)*0.25;P.whip1.rotation.x=rest(P.whip1)[0]-k*1.4+wv;P.whip2.rotation.x=rest(P.whip2)[0]+wv*1.2;P.whip3.rotation.x=rest(P.whip3)[0]+wv*1.5;}
  if(P.tail)P.tail.rotation.y=Math.sin(foeClock*1.3+f.id)*0.3;
  if(P.flag)P.flag.rotation.y=Math.sin(foeClock*2.1+f.id)*0.25;
  if(P.sling&&f.atkK==='shot'&&f.atk>0)P.sling.rotation.y=foeClock*20;
  if(f.dead){const q=Math.min(1,f.dead/0.4);root.rotation.x=-q*1.5708;root.position.y=q*0.25-Math.max(0,f.dead-1.6)*0.6;}
  M.grp.position.set(f.x,f.y,f.z);M.grp.rotation.y=f.yaw;
  // light where it stands (eased), the struck flash; the shadow
  f.lt-=dt;if(f.lt<=0){f.lt=0.25;const lx=Math.floor(f.x),ly=Math.floor(f.y+Math.max(0.5,M.box[4]*0.5)),lz=Math.floor(f.z);f.eLT=sky(lx,ly,lz);f.eBT=bl(lx,ly,lz);if(!dt){f.eL=f.eLT;f.eB=f.eBT;}}
  if(f.eLT!==undefined){f.eL+=(f.eLT-f.eL)*Math.min(1,dt*4);f.eB+=(f.eBT-f.eB)*Math.min(1,dt*4);}
  const u=M.mat.uniforms;u.eL.value=f.eL;u.eB.value=f.lordOf?Math.max(f.eB,0.55):f.eB;u.hurt.value=f.hurt;
  const sh=M.shadow,b=M.box,dist=Math.hypot(f.x-PL.x,f.z-PL.z);sh.position.set(f.x,f.gy+0.02,f.z);sh.rotation.y=f.yaw;sh.scale.set((b[3]-b[0])*1.2,1,(b[5]-b[2])*1.1);
  sh.material.opacity=f.dead>1?0:0.4*Math.max(0,1-(f.y-f.gy)/2)*Math.max(0,1-dist/Math.max(20,U.fogFar.value))*Math.min(1,f.eL*1.3+f.eB);
  const vis=dist<U.fogFar.value+10;M.grp.visible=vis;sh.visible=vis&&sh.material.opacity>0.01;
  // an Emberlord sheds embers
  if(f.kind==='ember'&&vis&&!f.dead&&Math.random()<dt*14)spawnP(f.x+(Math.random()-.5)*2,f.y+1+Math.random()*4,f.z+(Math.random()-.5)*2,(Math.random()-.5)*0.6,0.8+Math.random(),(Math.random()-.5)*0.6,[1,0.4+Math.random()*0.3,0.08],1.2,-0.4);
}
function updFoes(dt){
  if(!ready)return;foeClock+=dt;foeHitCD=Math.max(0,foeHitCD-dt);updShots(dt);
  foeT-=dt;if(foeT<=0){foeT=1;if(playing)foeSpawnTick();for(const f of foes)if(!f.dead&&Math.hypot(f.x-PL.x,f.z-PL.z)<16)discover('f',FOES[f.kind].n);}
  for(let i=foes.length-1;i>=0;i--){const f=foes[i];
    if(f.dead>2.6){removeFoe(f);continue;}
    if(f.x<0||f.z<0||f.x>=W||f.z>=D||Math.hypot(f.x-PL.x,f.z-PL.z)>(f.spot?130:96)){removeFoe(f);continue;}
    stepFoe(f,dt);placeFoe(f,dt);}
}
// ---- Calls: each kind's own (synthesized like every sound in the game), from where it stands
function foeCall(f,what){
  if(!AX||!settings.sound)return;const at=[f.x,f.y+f.m.box[4]*0.85,f.z],k=f.kind,p=what==='hurt'?1.2:what==='alert'?1.1:1;
  if(k[0]==='g'){if(what==='alert'||what==='hurt')for(let i=0;i<3;i++)voice(700*p+Math.random()*200,900*p,0.12,0.07,{type:'square',form:1400,q:2,delay:i*0.11},at);
    else for(let i=0;i<2;i++)voice(520+Math.random()*160,640,0.14,0.05,{form:1100,q:2,delay:i*0.18,vib:14,vd:0.1},at);}
  else if(k==='troll'){voice(110*p,70,what==='alert'?1.2:0.7,0.12,{form:240,q:1.2,vib:4,vd:0.06},at);if(what==='blow')burst(0.4,'lowpass',160,0.8,0.3,0.1,at);}
  else if(k==='ember'){voice(70*p,45,what==='alert'?1.8:1.1,0.16,{form:200,q:0.9,vib:3,vd:0.08},at);burst(1.2,'lowpass',400,0.6,0.22,0,at);}
  else{if(what==='alert'&&(k==='ochief'||Math.random()<0.25))tone(155,150,1.2,0.12,0,'sawtooth',at); // a war horn
    voice(180*p,130,what==='alert'?0.5:0.3,0.09,{form:520,q:1.4,vib:6,vd:0.05},at);}
  if(what==='blow')burst(0.14,'bandpass',900,1.5,0.16,0,at);
}
// ---- Striking a foe (first, nearer than any animal): the held weapon's power, a shield taking some from the front, a push
// back; slain, it falls and leaves what it carried to you
function foeHit(reach){
  const e=eyePos(),d=camDir(),o=[e.x,e.y,e.z],v=[d.x,d.y,d.z];let best=null,bt=reach;const bh=raycast(e,d,reach);
  if(bh&&SOLID[get(bh.x,bh.y,bh.z)]){const t=rayBox(o,v,[bh.x,bh.y,bh.z],[bh.x+1,bh.y+1,bh.z+1],reach);if(t>=0)bt=Math.min(bt,t);} // a blow passes through plants and grass
  for(const f of foes){if(f.dead)continue;const c=Math.cos(f.yaw),s=Math.sin(f.yaw),ox=o[0]-f.x,oz=o[2]-f.z,b=f.m.box;
    const t=rayBox([ox*c-oz*s,o[1]-f.y,ox*s+oz*c],[v[0]*c-v[2]*s,v[1],v[0]*s+v[2]*c],[b[0],b[1],b[2]],[b[3],b[4],b[5]],bt);if(t>=0&&t<bt){bt=t;best=f;}}
  if(best){const a=animalHit(reach);if(a&&Math.hypot(a.x-e.x,a.z-e.z)<Math.hypot(best.x-e.x,best.z-e.z))return null;}
  return best;
}
let foeHitCD=0;
function foeAct(btn){
  if(btn!==0)return false;const f=foeHit(4.6);if(!f)return false;const F=FOES[f.kind],held=curId(),it=ITEMS[held];
  if(foeHitCD>0)return true;foeHitCD=it&&it.tool==='sword'?0.32:it&&it.tool==='axe'?0.5:0.4;swing=1;
  let dmg=hitPower(held);const front=Math.abs(angTo(f.yaw,Math.atan2(PL.x-f.x,PL.z-f.z)))<1.05;
  if(F.block&&front&&f.st!=='sleep'){dmg*=1-F.block;burst(0.12,'bandpass',2600,4,0.25,0,[f.x,f.y+1.2,f.z]);}
  f.hp-=dmg;f.hurt=1;const kx=f.x-PL.x,kz=f.z-PL.z,kd=Math.hypot(kx,kz)||1;f.kvx=kx/kd*5*F.mass;f.kvz=kz/kd*5*F.mass;if(F.mass>0.3)f.vy=2.5;
  wearHeld(1);for(let k=0;k<6;k++)spawnP(f.x,f.y+f.m.box[4]*0.6,f.z,(Math.random()-.5)*2,1+Math.random()*2,(Math.random()-.5)*2,f.kind==='ember'?[1,0.5,0.1]:[0.5,0.1,0.08],0.5,8);
  if(f.st!=='chase'&&f.st!=='flee'&&foeTarget())foeAlert(f);if(f.st==='sleep'){f.st='idle';}foeCall(f,'hurt');
  if(f.hp<=0)foeSlain(f);
  return true;
}
function foeSlain(f){
  const F=FOES[f.kind],got=[];f.dead=0.001;f.st='dead';f.sp=0;f.atk=0;
  if(SURV())for(const [id,lo,hi,ch] of F.drops)if(Math.random()<ch){const n=lo+Math.floor(Math.random()*(hi-lo+1)),left=addItem(id,n);if(left)toast('No room for '+nameOf(id));got.push(n+' '+nameOf(id));}
  drawBar(true);toast('The '+F.n.toLowerCase()+' is slain'+(got.length?'. You took '+got.join(', '):''));
  if(f.lordOf){fallenLords.add(f.lordOf);saveDirty=true;showName('The Emberlord has fallen');for(let k=0;k<60;k++)spawnP(f.x+(Math.random()-.5)*3,f.y+Math.random()*5,f.z+(Math.random()-.5)*3,(Math.random()-.5)*4,Math.random()*4,(Math.random()-.5)*4,[1,0.4+Math.random()*0.4,0.1],1.4,2);
    burst(2.5,'lowpass',200,0.7,0.5,0,[f.x,f.y+2,f.z]);}
}
// armour (D-052): a coat in the body slot takes a share of every blow from a foe, and wears
function armourCut(n){const q=equip.body;if(!q||!SURV())return n;const it=ITEMS[q.id];q.d=(q.d||0)+1;if(q.d>=it.dur){equip.body=null;toast('Your '+it.n+' is worn through');}return Math.max(1,Math.round(n*(1-it.armor)));}
