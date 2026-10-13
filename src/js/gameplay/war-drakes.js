// ---- The drakes and the night (W8e, D-082). Ash drakes: winged beasts of the wastes that come over the battles with the
// warhosts (and in the hosts the player summons against them), circle high, now and then dive on the hosts' soldiers (or the
// player in survival) breathing fire along their path, then climb away. Low in a dive they are in the archers' reach; the player's
// arrows and the bolt thrower reach them anywhere. Slain, a drake falls burning from the sky and leaves its scales (drakescale
// mail is made from them). The night: soldiers of both sides carry torches, the folk see less far and their archers reach less
// far (the orcs see in the dark), and the hosts' archers loose fire arrows. Rain puts out fire arrows and fire pots and weakens
// the shamans' fire; fog cuts every archer's reach; smoke rises in tall columns over what burns; the orcs chant before a charge.
Object.assign(FOES,{drake:{n:'Ash Drake',m:'drake',hp:120,dmg:8,reach:3,walk:3,run:14,sight:60,cd:1.5,wind:0.4,mass:0.1,tall:3,fly:1,drops:[[415,2,4,1],[SULFUR,1,2,0.5]],cause:'drake'}});
DEATH.drake='An ash drake\'s fire burned you';
FOE_HOME.x_od=[['drake',1]];HOST_UNITS.o.push(['od','Ash drakes','x_od',null,null]);
let drakeT=0,warNightK=0,warVisF=1,warVisO=1,warFogR=999,warTorchT=0,warSmokeT=0;
// where a drake circles: over its army, its host, or the player
function drakeCenter(f){if(f.hst){const [x,z]=hostMid(f.hst);return [x,z];}if(f.drA&&warArmies.includes(f.drA)&&f.drA.m.some(g=>!g.dead&&!g.gone))return warMid(f.drA);return [PL.x,PL.z];}
const drakeGround=(x,z)=>{const bx=Math.max(0,Math.min(W-1,Math.floor(x))),bz=Math.max(0,Math.min(D-1,Math.floor(z)));return ground[bx+W*bz]+1;};
// a drake's turn: circling, diving with its fire, climbing away; running (its heart gone) it flies off; slain it falls
function drakeStep(f,dt){
  const gy=drakeGround(f.x,f.z);f.gy=gy;f.sp=0;f.rad=2.2;if(f.hold&&!f.dead)return;f.hurt=Math.max(0,f.hurt-dt*3);
  if(f.dead){f.dead+=dt;f.vy=(f.vy||0)-18*dt;f.x+=(f.dvx||0)*dt;f.z+=(f.dvz||0)*dt;f.y=Math.max(gy,f.y+f.vy*dt);if(Math.random()<dt*20)spawnP(f.x,f.y+1,f.z,(Math.random()-.5),1,(Math.random()-.5),[1,0.45,0.1],0.6,-0.5);
    if(f.y<=gy&&!f.crash){f.crash=1;const d=Math.hypot(f.x-PL.x,f.z-PL.z);sfxBoom(d*1.4,[f.x,f.y,f.z]);shake=Math.max(shake,Math.max(0,0.5*(1-d/40)));for(let k=0;k<30;k++)spawnP(f.x,f.y+0.5,f.z,(Math.random()-.5)*5,Math.random()*4,(Math.random()-.5)*5,[0.35,0.32,0.3],1.2,6);
      if(d<150)toast('An ash drake falls burning from the sky');}return;}
  const [cx,cz]=drakeCenter(f);let tx,ty,tz,sp=11;
  if(f.rout){const a=Math.atan2(f.x-cx,f.z-cz);tx=f.x+Math.sin(a)*40;tz=f.z+Math.cos(a)*40;ty=gy+34;sp=14;if(Math.hypot(f.x-PL.x,f.z-PL.z)>90){removeFoe(f);return;}}
  else if(f.st==='dive'){const T=f.dvP?null:f.foe;if(!f.dvP&&(!T||T.dead||T.gone||T.wnd)){f.st='climb';f.t=3;}
    else{const X=f.dvP?PL.x:T.x,Z=f.dvP?PL.z:T.z,Y=f.dvP?PL.y:T.y,d=Math.hypot(X-f.x,Z-f.z);tx=X;tz=Z;ty=Y+3;sp=16*Math.max(0.3,Math.min(1,d/Math.max(1,(f.y-ty)*1.1))); // (high and near, it slows and drops)
      if(d<13&&f.y-gy<12&&!f.br){f.br=1.6;f.brn=1;drakeScreech(f);}if(d<2&&f.brn||(f.t-=dt)<=0){f.st='climb';f.t=3.5;f.brn=0;}}}
  if(f.st==='climb'){f.t-=dt;tx=f.x+Math.sin(f.yaw)*20;tz=f.z+Math.cos(f.yaw)*20;ty=gy+30;sp=13;if(f.t<=0)f.st='circle';}
  if(tx===undefined){f.ca=(f.ca||Math.random()*6.28)+dt*0.42;tx=cx+Math.sin(f.ca)*28;tz=cz+Math.cos(f.ca)*28;ty=drakeGround(cx,cz)+26;
    if((f.dT=(f.dT===undefined?4+Math.random()*6:f.dT)-dt)<=0){f.dT=9+Math.random()*7;drakeDive(f,cx,cz);}}
  // fly: turn toward the mark at a drake's rate, climb or sink at most 9 a second, never into the ground
  const dx=tx-f.x,dz=tz-f.z,dh=angTo(f.yaw,Math.atan2(dx,dz)),turn=Math.sign(dh)*Math.min(Math.abs(dh),2.1*dt);f.yaw+=turn;f.hd=f.yaw;f.bank=(f.bank||0)+((-turn/dt)*0.35-(f.bank||0))*Math.min(1,dt*4);
  f.fsp=(f.fsp||sp)+(sp-(f.fsp||sp))*Math.min(1,dt*2);const vy=Math.max(f.st==='dive'?-14:-9,Math.min(9,(ty-f.y)*1.2));f.dpitch=Math.atan2(-vy,f.fsp)*0.6;
  f.x+=Math.sin(f.yaw)*f.fsp*dt;f.z+=Math.cos(f.yaw)*f.fsp*dt;f.y=Math.max(gy+1.5,f.y+vy*dt);f.x=Math.max(2,Math.min(W-3,f.x));f.z=Math.max(2,Math.min(D-3,f.z));
  if(f.br>0){f.br-=dt;if(f.y-gy<12)drakeBreath(f,dt);} // (its fire reaches the ground only from low)
  if((f.wbT=(f.wbT||0)-dt)<=0){f.wbT=f.st==='dive'?1.2:0.55;const d=Math.hypot(f.x-PL.x,f.z-PL.z);if(d<70&&foeHear([f.x,f.y,f.z]))burst(0.35,'lowpass',140,0.9,0.22*(1-d/70),0,[f.x,f.y,f.z]);}}
// a dive: at one of the other side under it (or the player, in survival, three times in ten when near)
function drakeDive(f,cx,cz){let best=null,bd=1e9,bestC=null,bdC=1e9;
  foeNear(cx,cz,60,g=>{if(g.dead||g.wnd||g.cap||FOES[g.kind].fly||Math.hypot(g.x-cx,g.z-cz)>60)return;const d=Math.hypot(g.x-f.x,g.z-f.z)+Math.random()*20;if(FOES[g.kind].civ){if(d<bdC){bdC=d;bestC=g;}}else if(d<bd){bd=d;best=g;}},0); // (the hosts' soldiers; townsfolk only where no soldier is near)
  if(!best)best=bestC;
  if(foeTarget()&&Math.hypot(PL.x-cx,PL.z-cz)<60&&(!best||Math.random()<0.3)){f.dvP=1;f.foe=null;}else if(best){f.dvP=0;f.foe=best;}else return;
  f.st='dive';f.t=9;f.br=0;}
// its fire: along the way it flies, down to the ground before it; the other side's soldiers there and the player are burned
function drakeBreath(f,dt){const fx=Math.sin(f.yaw),fz=Math.cos(f.yaw),gy=f.gy;
  for(let k=0;k<5;k++){const q=Math.random();spawnP(f.x+fx*(2+q*5),f.y-0.5-q*(f.y-gy-0.5),f.z+fz*(2+q*5),fx*3+(Math.random()-.5)*2,-2-Math.random()*2,fz*3+(Math.random()-.5)*2,[1,0.4+Math.random()*0.4,0.08],0.5,-0.5);}
  if((f.brT=(f.brT||0)-dt)>0)return;f.brT=0.2;const px=f.x+fx*4.5,pz=f.z+fz*4.5,hit=(x,z)=>{const dx=x-f.x,dz=z-f.z,d=Math.hypot(dx,dz);return d<8&&(d<2.5||(dx*fx+dz*fz)/d>0.55);}; // (in a cone before it, down to the ground)
  foeNear(f.x,f.z,9,g=>{if(g.dead||foeSd(g)!==0||g.y>f.y||!hit(g.x,g.z))return;foeHurtFoe(g,5,f,fx,fz,3);},0);
  if(foeTarget()&&PL.y<f.y&&hit(PL.x,PL.z))foeHurtPlayer(4,'drake',fx,fz,3,f);
  if(Math.random()<0.4&&foeHear([px,gy,pz]))burst(0.5,'lowpass',420,0.8,0.25,0,[px,gy+1,pz]);}
function drakeScreech(f){if(!foeHear([f.x,f.y,f.z]))return;const at=[f.x,f.y,f.z];voice(1300,520,1.1,0.08,{type:'sawtooth',form:2200,q:2,vib:20,vd:0.12},at);voice(900,380,1.2,0.06,{form:1500,q:2,vib:14,vd:0.1,delay:0.08},at);}
// drakes over the battles: a warhost on the march near the player sends one or two, once, four times in ten
function drakeTick(){if(!warAuto('a'))return;for(const A of warArmies){if(A.al||A.def||!A.go||A.drk)continue;A.drk=1;if(Math.random()>0.4)continue;const [mx,mz]=warMid(A);if(Math.hypot(mx-PL.x,mz-PL.z)>140)continue;
    const n=warSz()>0.6?2:1;for(let i=0;i<n;i++)drakeSpawn(mx,mz,A);if(Math.hypot(mx-PL.x,mz-PL.z)<120)toast('Ash drakes come over the battle with the warhost!');}}
function drakeSpawn(cx,cz,A){const a=Math.random()*6.28,x=Math.max(4,Math.min(W-5,cx+Math.sin(a)*50)),z=Math.max(4,Math.min(D-5,cz+Math.cos(a)*50)),f=addFoe('drake',x,drakeGround(x,z)+28,z,{st:'circle',t:1});f.rad=2.2;f.drA=A||null;f.ca=a;return f;}
// ---- the night and the weather in war (each second)
function warSkyTick(){warNightK=warNight()?1:0;const rain=raining&&rainAmt>0.3;warVisF=(warNightK?0.75:1)*(rain?0.85:1);warVisO=rain?0.85:1;warFogR=U.fogFar.value*0.85;}
// a shot's range, the night, the rain and the fog considered
const warShotHi=(F,hi)=>Math.min(hi*(F.folk?warVisF:warVisO),Math.max(14,warFogR));
// a foe's shot (from foeShoot): at night the hosts' archers loose fire arrows; rain weakens the shamans' fire
function warShotK(f,S,s){if(raining&&rainAmt>0.3){if(S.k==='fire')s.dmg=Math.round(s.dmg*0.6);return;}
  if(warNightK&&S.k==='arrow'&&FOES[f.kind].folk&&Math.random()<0.5){s.fireA=1;s.dmg=Math.round(s.dmg*1.25);s.m.material.color.setRGB(1,0.55,0.15);}}
// every frame: torches at night among the soldiers about the player, and smoke in tall columns over what burns
function warNightFrame(dt){
  if(warNightK&&(warTorchT-=dt)<=0){warTorchT=0.1;let n=0;for(const f of foes){if(n>=30)break;if(f.dead||f.far||f.wnd||f.cap||FOES[f.kind].fly||FOES[f.kind].hound||FOES[f.kind].mount&&f.id%2)continue;const F=FOES[f.kind];
    if(!(f.war||f.hst||f.site&&f.site.k==='wgate'||!F.folk)||f.id%(F.folk?4:5))continue;if(Math.hypot(f.x-PL.x,f.z-PL.z)>50)continue;n++;
    const a=f.yaw+0.9,h=(f.m.box[4]||2)*0.95;spawnP(f.x+Math.sin(a)*0.5,f.y+h,f.z+Math.cos(a)*0.5,(Math.random()-.5)*0.2,0.7,(Math.random()-.5)*0.2,[1,0.55+Math.random()*0.2,0.15],0.35,-0.8);}}
  if((warSmokeT-=dt)>0)return;warSmokeT=0.4;const cells=new Map();
  for(const w of WARS.values())for(const B of [w.bn,w.rb]){if(!B)continue;for(const e of B){if(e[3]||warPlay<e[2])continue;const [X,Y,Z]=e.c||(e.c=e[0].split(',').map(Number)),k=(X>>3)+','+(Z>>3);if(!cells.has(k))cells.set(k,[X-OX,Y,Z-OZ]);}}
  let n=0;for(const [x,y,z] of cells.values()){if(n>=8)break;const d=Math.hypot(x-PL.x,z-PL.z);if(d>240||d<20)continue;n++;
    for(let k=0;k<3;k++)spawnP(x+(Math.random()-.5)*2,y+3+Math.random()*12,z+(Math.random()-.5)*2,(Math.random()-.5)*0.4,1.2+Math.random()*0.6,(Math.random()-.5)*0.4,[0.2,0.19,0.19],6,-0.1);}}
// the orcs' war chant before a charge: a beat of drums under many rough voices, the words told to the player near
const WAR_CHANT=['Gash! Gash! Burn the stone!','Blood and ash! Blood and ash!','Break them! Break them! Break them!'];
function warChant(x,y,z){const d=Math.hypot(x-PL.x,z-PL.z);if(d>110)return;if(d<80)toast('The orcs chant: "'+WAR_CHANT[Math.floor(Math.random()*WAR_CHANT.length)]+'"');if(!AX||!settings.sound)return;const p=panner(x,y,z);
  for(let b=0;b<8;b++){const t=b*0.5;burst(0.25,'lowpass',90,1.2,0.4,t,p);for(let i=0;i<5;i++){const f=85+Math.random()*40;voice(f,f*0.85,0.28,0.035,{type:'sawtooth',form:420+Math.random()*200,q:1.6,vib:6,vd:0.06,delay:t+0.05+Math.random()*0.05},p);}}}
