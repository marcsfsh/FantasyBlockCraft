// ---- The Emberlords in the war, and their fates (W7b, D-075; Q161, Q177, Q178, Q185). Each found war's basin has its lord, the
// Emberlord of its great volcano's Ember Throne (`warLord`). While it lives it keeps its throne, but at the height of an assault
// it shows itself (on the Ashen Gate's wall while the gate stands, else on its crater's rim) and its servants grow bolder; before
// every warhost it roars from the mountain and drives them on; its mountain rumbles and erupts and ash falls, the sky over its
// basin darkens and the lightning comes nearer it, and its voice taunts the hosts and the player. Once the front stands at the
// foot of its mountain (W5) come the last battles: the hosts march on to the terrace before its gate and it sallies out to meet
// them; the dwarves break the mountain's five great vents one by one, its fire burning lower with each; and the loremasters of the
// elves and the dwarves come to bind it when one sworn to the alliance is there to hold their ring. Its fate is one of five
// (`w.el.fate`, and its entry in `ek`): slain in the hosts' final assault ('hosts'), slain by the player alone ('alone'), bound by
// the loremasters' rite ('bound'), cast down through the mountain's heart into the lava sea by a blasting keg when it is near its
// end ('cast', and perhaps to return), or its fire put out when the last vent is broken ('quenched').
const EW=new Map();
function warLord(w){if(EW.has(w.id))return EW.get(w.id);const P=wasteGateAt(w.X,w.Z,10),G=P&&P.B&&greatOf(P.B.chief),F=G&&fortOf(G),R=F&&F.great?{P:P,G:G,F:F,L:emberLord(F)}:null;EW.set(w.id,R);return R;}
const elOf=w=>w.el||(w.el={fate:null,vents:0,vt:0,sh:-1e9,rite:-1e9,ft0:0});
const warOfFort=F=>[...WARS.values()].find(w=>{const R=warLord(w);return R&&R.F.id===F.id;})||null;
const emberVents=F=>{const w=warOfFort(F);return w?elOf(w).vents:0;};
const EMBER_TAUNT={hosts:['"Men of the west! Your kings are dust, and your towers will follow them."','"Elves! Your light is old. I will put it out."','"Dwarves! I have eaten deeper stone than your halls."','"Come, little hosts. The mountain is hungry."'],
  you:['"I see you, little one. I will remember your face when it burns."','"You fight for kings who will forget your name."','"Come up to my throne, and I will make you a crown of fire."']};
const EMBER_FATE={hosts:L=>'In the hosts\' final assault '+L.n+' was slain before the Ember Throne.',alone:L=>L.n+' was slain by your hand alone.',
  bound:L=>'The loremasters of the elves and the dwarves bound '+L.n+' with chains of light, while you held their ring against its servants.',
  cast:L=>L.n+' was cast down through the heart of the mountain into the lava sea. Some say it will return.',quenched:L=>'The dwarves broke the last of the mountain\'s vents, and the fire of '+L.n+' went out.'};
// a fate befalls the lord: written, told, the lord gone from its throne
function emberFate(w,R,fate,f){const E=w?elOf(w):null;if(E&&E.fate)return;if(E){E.fate=fate;E.ft=Math.round(warPlay);}
  fallenLords.add(R.F.id);const k=emberKnown.get(R.F.id)||[null,R.L.n];k[2]=fate;emberKnown.set(R.F.id,k);saveDirty=true;
  if(w)warLog(w,EMBER_FATE[fate](R.L));emberAfterFate(R,fate,!!(f&&f.byP)&&fate==='alone'||!!(f&&f.byP&&fate==='hosts'));const near=Math.hypot(R.F.GX-(PL.x+OX),R.F.GZ-(PL.z+OZ))<700||w&&Math.hypot(w.X-(PL.x+OX),w.Z-(PL.z+OZ))<500;
  if(near){showName(R.L.n+(fate==='bound'?' is bound':fate==='cast'?' is cast down':fate==='quenched'?': its fire is out':' has fallen'));toast(EMBER_FATE[fate](R.L));}
  const g=f||foes.find(q=>isLord(q)&&!q.dead&&!q.show&&q.L&&q.L.F===R.F);if(g&&!g.dead){g.fate=fate;g.hp=0;g.dead=0.001;g.st='dead';g.sp=0;g.atk=0;if(g.lordOf)lordFalls(g);}}
// slain (from emberFalls): by the player with none of the hosts near, alone; else in the hosts' assault; or cast down
function emberFateOnDeath(f){if(f.show||!f.L||f.fate)return;const w=warOfFort(f.L.F),R=w?warLord(w):{F:f.L.F,L:f.L,G:f.L.F.v};
  const hosts=foes.filter(g=>!g.dead&&FOES[g.kind].folk&&!FOES[g.kind].civ&&Math.hypot(g.x-f.x,g.z-f.z)<40).length;
  emberFate(w,R,f.cast?'cast':f.byP&&hosts<3?'alone':'hosts',f);}
// ---- the mountain's vents, broken by the dwarves once the front stands at its foot
function emberVent(w,R,E){const n=E.vents,th=(n*72+hsh(R.G.X,9993,R.G.Z)*72)*Math.PI/180,S=volcShape(R.G),X=S.cx+Math.cos(th)*R.G.R*0.55,Z=S.cz+Math.sin(th)*R.G.R*0.55;
  warLog(w,'The dwarves broke the '+['first','second','third','fourth','last'][Math.min(4,n-1)]+' of the mountain\'s five great vents. The fire of '+R.L.name+' burns lower.');
  const x=X-OX,z=Z-OZ,d=Math.hypot(x-PL.x,z-PL.z);if(d<400)toast('The dwarves have broken one of the mountain\'s great vents');
  if(x>=0&&z>=0&&x<W&&z<D){const y=ground[Math.floor(x)+W*Math.floor(z)]+1;sfxBoom(d,[x,y,z]);for(let k=0;k<60;k++)spawnP(x+(Math.random()-.5)*4,y+Math.random()*3,z+(Math.random()-.5)*4,(Math.random()-.5)*3,4+Math.random()*8,(Math.random()-.5)*3,[0.85,0.85,0.86],4,-0.2);}
  for(const f of foes)if(isLord(f)&&!f.show&&!f.dead&&f.L&&f.L.F===R.F){f.mhp=Math.round(FOES[f.kind].hp*(1-0.12*n));f.hp=Math.min(f.hp,f.mhp);}
  if(n>=5)emberFate(w,R,'quenched',null);}
// ---- showing itself, at the height of an assault: on the gate's wall, or on its crater's rim; its servants made bolder
const emberShows=[];let emberSkyK=0;
function emberShow(w,R){const E=elOf(w);E.sh=Math.round(warPlay);const P=R.P,L=R.L;let at=null,where='';
  if(!(w.s>=2)){const sd=wgUV(P,PL.x+OX,PL.z+OZ)[1]<0?-1:1;for(const v of [44,40,46,48]){const [X,Z]=wgXZ(P,0,sd*v),x=X-OX,z=Z-OZ;if(x<2||z<2||x>=W-2||z>=D-2)continue;const y=foeStand(x+0.5,P.hG+50,z+0.5,FOES[L.kind].tall);if(y>0){at=[x+0.5,y,z+0.5];break;}}where='on the wall of '+P.name.replace(/^The /,'the ');}
  else{const S=volcShape(R.G),dx=PL.x+OX-S.cx,dz=PL.z+OZ-S.cz,dl=Math.hypot(dx,dz)||1,X=S.cx+dx/dl*(R.G.rc+3),Z=S.cz+dz/dl*(R.G.rc+3),x=X-OX,z=Z-OZ;
    if(x>=2&&z>=2&&x<W-2&&z<D-2){const y=foeStand(x,R.G.rimTop+3,z,FOES[L.kind].tall);if(y>0)at=[x,y,z];}where='on the rim of its crater';}
  toast(L.n+' shows itself '+where+'!');setTimeout(()=>toast(L.name+': '+EMBER_TAUNT.hosts[Math.floor(Math.random()*EMBER_TAUNT.hosts.length)]),2500);
  for(const f of foes)if(!f.dead&&!FOES[f.kind].folk&&!isLord(f)&&!f.bold&&Math.hypot(f.x-PL.x,f.z-PL.z)<160){f.bold=1;f.dmgK=(f.dmgK||1)*1.2;}
  if(!at){burst(3,'lowpass',70,0.6,0.5,1.2,[PL.x,PL.y+20,PL.z]);strike(false);return null;}
  const f=addFoe(L.kind,at[0],at[1],at[2],{ci:L.ci,hold:1,show:1,st:'idle'});f.L=L;f.hp=f.mhp=1e7;f.yaw=f.hd=Math.atan2(PL.x-f.x,PL.z-f.z);emberShows.push({f:f,t:25});foeCall(f,'alert');setTimeout(()=>foeCall(f,'alert'),1400);
  for(let k=0;k<40;k++)spawnP(f.x+(Math.random()-.5)*6,f.y+Math.random()*16,f.z+(Math.random()-.5)*6,(Math.random()-.5)*2,1+Math.random()*3,(Math.random()-.5)*2,f.fc||[1,0.5,0.1],1,1);return f;}
// before every warhost: a roar from the mountain, and they come on bolder (from warTick)
function emberDrive(A){const w=WARS.get(A.P.id),R=w&&warLord(w);if(!R||elOf(w).fate||fallenLords.has(R.F.id))return;A.drive=1;
  toast('From the mountain '+R.L.name+' roars, and the warhost comes on');burst(3.2,'lowpass',70,0.5,0.6,0.8,[PL.x,PL.y+30,PL.z]);burst(2.2,'lowpass',140,0.6,0.35,1.1,[PL.x,PL.y+30,PL.z]);}
// ---- the last battles: the hosts' way on to the terrace before its gate (from warFrontWays), and its sally to meet them
function emberWayIn(w,from){const R=warLord(w);if(!R||elOf(w).fate||fallenLords.has(R.F.id))return [];const F=R.F,T=[F.GX+F.ox*12,F.GZ+F.oz*12];return raidRoute(from,T).slice(1).map(q=>[q[0]+0.5,q[1]+0.5]);}
function emberSally(w,R){const F=R.F,X=F.GX+F.ox*10,Z=F.GZ+F.oz*10,x=X-OX,z=Z-OZ;if(x<2||z<2||x>=W-2||z>=D-2||!genDone[(x>>4)+(z>>4)*NCX])return null;
  if(foes.some(f=>isLord(f)&&!f.show&&!f.dead&&f.L&&f.L.F===F))return null;const y=foeStand(x+0.5,F.Fy+2,z+0.5,FOES[R.L.kind].tall);if(y<0)return null;
  foeSpots.set(F.id,{x:X,z:Z});const f=emberSpawn(F,x+0.5,y,z+0.5,{spot:F.id,lordOf:F.id,st:'idle',t:1,leash:fortSpots(F).reach+90});f.yaw=f.hd=Math.atan2(F.ox,F.oz);f.sally=1;
  toast(R.L.n+' comes out of its gate to meet the hosts!');foeCall(f,'alert');return f;}
// ---- the rite: the loremasters of the elves and the dwarves, come to bind it, held in their ring by the player
let emberRiteS=null;
function emberRite(w,R,cx,cy,cz){const E=elOf(w);E.rite=Math.round(warPlay);const L=[],ring=[];
  for(let i=0;i<8;i++){const a=i/8*6.283,k=i<4?(i%2?'dlord':'elore'):(i%2?'diron':'eblade'),r=i<4?4:7,x=cx+Math.sin(a)*r,z=cz+Math.cos(a)*r,y=foeStand(x,cy+2,z,2);if(y<0)continue;
    const f=addFoe(k,x,y,z,{prov:'wg:'+R.P.id,site:wgSite(R.P),st:'idle',t:1});f.rite=1;if(i<4){f.hold=1;f.hp=f.mhp=FOES[k].hp*4;f.yaw=f.hd=Math.atan2(cx-x,cz-z);L.push(f);}else ring.push(f);}
  if(L.length<3){for(const f of L.concat(ring))removeFoe(f);return null;}
  emberRiteS={w:w,R:R,L:L,ring:ring,t:150,wave:8,x:cx,y:cy,z:cz};toast('The loremasters of the elves and the dwarves have come to bind '+R.L.name+'. Hold their ring!');return emberRiteS;}
function emberRiteTick(dt){const S=emberRiteS;if(!S)return;S.t-=dt;S.wave-=dt;const live=S.L.filter(f=>!f.dead&&!f.gone);
  if(Math.random()<dt*3)for(const f of live)spawnP(f.x,f.y+2.2,f.z,(S.x-f.x)*0.4,1.5,(S.z-f.z)*0.4,[0.85,0.92,1],1.2,0);
  if(S.wave<=0&&S.t>10){S.wave=18+Math.random()*6;let x=0,z=0,y=-1;for(let k=0;k<8&&y<0;k++){const a=Math.random()*6.283;x=S.x+Math.sin(a)*26;z=S.z+Math.cos(a)*26;y=x>=2&&z>=2&&x<W-2&&z<D-2?foeStand(x,S.y+2,z,2):-1;}
    if(y>0){const g=spawnGroup(Math.random()<0.5?'band':'oroused',3+Math.floor(Math.random()*3),x,y,z,3,{});for(const k of ['fhound','fspirit'])g.push(addFoe(k,x+1,y,z+1,{}));for(const f of g){f.foe=live[Math.floor(Math.random()*live.length)]||null;f.st='chase';f.eseen=0;}
      toast('The servants of '+S.R.L.name+' come against the ring');}}
  if(Math.abs(S.t-75)<dt)toast('The chains of light are half woven');
  const far=Math.hypot(PL.x-S.x,PL.z-S.z)>150;
  if(live.length<2||far){toast(far?'You left the ring, and the loremasters withdraw':'The rite is broken. The loremasters who live withdraw');warLog(S.w,'The loremasters of the elves and the dwarves tried to bind '+S.R.L.name+', and the rite was broken.');emberRiteEnd(S);return;}
  if(S.t<=0){for(let k=0;k<120;k++)spawnP(S.x+(Math.random()-.5)*8,S.y+Math.random()*20,S.z+(Math.random()-.5)*8,(Math.random()-.5)*2,Math.random()*4,(Math.random()-.5)*2,[0.9,0.95,1],2,0);emberFate(S.w,S.R,'bound',null);emberRiteEnd(S);}}
function emberRiteEnd(S){for(const f of S.L.concat(S.ring))if(!f.dead){f.hold=0;f.rite=0;}emberRiteS=null;}
// ---- a blasting keg bursting by a lord near its end (from explode): the floor breaks and it falls through into the lava sea
function emberBlast(x,y,z){for(const f of foes){if(!isLord(f)||f.show||f.dead||f.cast||(f.ph3||1)<3||Math.hypot(f.x-x,f.z-z)>10||Math.abs(f.y-y)>12)continue;f.cast=1;f.sink=3;f.hold=1;
    toast('The floor breaks under '+(f.L?f.L.name:'the Emberlord')+'!');const fy=Math.floor(f.y);for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){if(a*a+b*b>10)continue;const X=Math.floor(f.x)+a,Z=Math.floor(f.z)+b;if(X<0||Z<0||X>=W||Z>=D)continue;for(let k=1;k<=2;k++)if(get(X,fy-k,Z)!==BEDROCK)setBlock(X,fy-k,Z,k===1?LAVA:AIR,true);}}}
// ---- every second (from warStateTick): the vents and the hosts' last assault away; near, the lord's presence, its sally, the rite
let emberRumT=20,emberEruT=60,emberTauntT=90;
function emberWarTick(){const X=PL.x+OX,Z=PL.z+OZ;let near=null,nd=1e9,inB=false;
  for(const w of WARS.values()){const R=warLord(w);if(!R)continue;const E=elOf(w);if(E.fate)continue;if(fallenLords.has(R.F.id)){E.fate=(emberKnown.get(R.F.id)||[])[2]||'hosts';continue;}
    if(w.s>=2&&warFront(w)>=1){if(!E.vt)E.vt=Math.round(warPlay+480+240*hsh(w.X+E.vents,9991,w.Z));if(!E.ft0)E.ft0=Math.round(warPlay);
      if(warPlay>=E.vt){E.vents++;E.vt=Math.round(warPlay+480+240*hsh(w.X+E.vents,9991,w.Z));emberVent(w,R,E);if(E.fate)continue;}
      if(warPlay-E.ft0>2100+2100*hsh(w.X,9995,w.Z)&&Math.hypot(X-R.F.GX,Z-R.F.GZ)>400){emberFate(w,R,'hosts',null);continue;}} // (the hosts' final assault, fought out away from the player, 35 to 70 minutes on)
    const B=warBasinAt(Math.floor(X),Math.floor(Z)),d=Math.hypot(X-R.G.X,Z-R.G.Z);if((B&&B.key===R.P.B.key||Math.hypot(X-w.X,Z-w.Z)<300)&&d<nd){near=w;nd=d;inB=!!B;}}
  for(let i=emberShows.length-1;i>=0;i--){const s=emberShows[i];s.t-=1;if(s.t<=0||s.f.gone){if(!s.f.gone){for(let k=0;k<50;k++)spawnP(s.f.x+(Math.random()-.5)*6,s.f.y+Math.random()*18,s.f.z+(Math.random()-.5)*6,0,2+Math.random()*3,0,s.f.fc||[1,0.5,0.1],1.2,-0.5);removeFoe(s.f);}emberShows.splice(i,1);}}
  for(const f of foes)if(!f.bold&&!f.dead&&f.army&&f.army.drive){f.bold=1;f.dmgK=(f.dmgK||1)*1.15;}
  emberSkyK=0;if(!near)return;const R=warLord(near),E=elOf(near);emberSkyK=Math.max(inB?0.3:0,Math.min(1,1-nd/900));
  // its mountain rumbles and erupts; ash falls; its voice
  if((emberRumT-=1)<=0){emberRumT=20+Math.random()*25;const v=Math.max(0.12,1-nd/800);burst(3,'lowpass',55,0.5,0.45*v,0,[PL.x,PL.y-4,PL.z]);shake=Math.max(shake,0.3*v);}
  if((emberEruT-=1)<=0){emberEruT=80+Math.random()*80;E.ash=40;const S=volcShape(R.G),sx=S.cx-OX,sz=S.cz-OZ,v=Math.max(0.15,1-nd/700);toast(R.L.mt.replace(/^the /,'The ')+' erupts');
    burst(3.5,'lowpass',60,0.5,0.6*v,nd/343,[sx,R.G.rimTop,sz]);if(nd<300)for(let k=0;k<80;k++){const a=Math.random()*6.283,s=4+Math.random()*10;spawnP(sx,R.G.rimTop+2,sz,Math.cos(a)*s,18+Math.random()*20,Math.sin(a)*s,[1,0.45+Math.random()*0.3,0.1],5,9);}}
  if((emberTauntT-=1)<=0){emberTauntT=150+Math.random()*110;const you=SW.on||emberKnown.has(R.F.id),T=you&&Math.random()<0.5?EMBER_TAUNT.you:EMBER_TAUNT.hosts;toast(R.L.name+': '+T[Math.floor(Math.random()*T.length)]);}
  // at the height of an assault it shows itself
  if(warPlay-E.sh>300&&warArmies.some(A=>A.P.id===near.id&&A.m.filter(f=>!f.dead&&f.foe).length>=6))emberShow(near,R);
  // the last battles: its sally, and the loremasters' rite for one sworn to the alliance
  const F=R.F,dg=Math.hypot(X-(F.GX+F.ox*10),Z-(F.GZ+F.oz*10));
  if(near.s>=2&&warFront(near)>=1&&dg<160)emberSally(near,R);
  if(!emberRiteS&&near.s>=2&&SW.on&&warPlay-E.rite>900&&(dg<60||fortName(Math.floor(X),Math.floor(PL.y),Math.floor(Z))===F.name)){const yy=foeStand(PL.x,PL.y+2,PL.z,2);if(yy>0)emberRite(near,R,PL.x,yy,PL.z);}}
// ash falling about the player after an eruption (from emberFrame)
function emberAsh(dt){for(const w of WARS.values()){const E=w.el;if(!E||!(E.ash>0))continue;E.ash-=dt;for(let k=0;k<dt*30;k++)spawnP(PL.x+(Math.random()-.5)*30,PL.y+8+Math.random()*6,PL.z+(Math.random()-.5)*30,0.3,-1.2-Math.random(),0.1,[0.42,0.4,0.4],6,0.05);}}
// the panel: its lord, the vents, its fate
function emberPanel(w){const R=warLord(w);if(!R)return '';const E=elOf(w);return '<div>'+R.L.n+(E.fate?': '+{hosts:'slain',alone:'slain by you',bound:'bound',cast:'cast down',quenched:'its fire put out'}[E.fate]:E.vents?', vents broken '+E.vents+' of 5':', on its throne')+'</div>';}
