// ---- The war's new soldiers and creatures at work (W3, D-070; Q150, Q151, Q170, Q171): their kinds (FOES, models in
// war-models.js), how they shoot (bolts, javelins, thrown axes, fire pots), whom they strengthen and how. The hosts: knights and
// lancers charge in a wedge (`warWedge`, from warForm), pikemen stand in the front rank and strike harder at horsemen and the
// great creatures, crossbowmen, horse archers and outriders skirmish, glaive wardens and blade masters cleave a second foe,
// shieldbreakers' blows go through a shield, sappers dig the mine, engineers mend the works (the burned and broken are rebuilt
// three times as fast near one), healers mend the hurt about them, bearers carry the fallen to the field hospital, and a standard
// bearer's banner steadies those within 9 (a fifth less hurt). The wastes: wolf riders run down the lines, pot-throwers' pots burst
// in fire and set the works alight, war drummers and fire shamans drive the orcs about them on (a quarter harder blows) and troll
// drivers their trolls, siege trolls batter the siege lines' palisades (rebuilt later), war beasts throw those they strike far,
// shield orcs take most of a blow from the front, goblin skulkers come in swarms, orc crossbowmen shoot hard.
Object.assign(FOES,{
  rpike:{n:'Pikeman of the Realm',m:'rpike',hp:24,dmg:5,reach:3.8,walk:1.3,run:4.5,sight:24,cd:1.4,wind:0.5,block:0.25,mass:0.55,folk:1,pike:1,drops:[[223,1,1,0.3],[206,1,2,0.5]],cause:'guard'},
  rxbow:{n:'Crossbowman of the Realm',m:'rxbow',hp:20,dmg:3,reach:2,walk:1.3,run:4.5,sight:34,cd:1.2,wind:0.4,shot:{dmg:6,v:40,lo:4,hi:32,cd:2.6,k:'bolt'},keep:10,mass:0.55,folk:1,drops:[[201,2,4,0.6],[206,1,1,0.4]],cause:'rbolt'},
  rguard:{n:'Household Knight of the Realm',m:'rguard',hp:60,dmg:10,reach:2.6,walk:1.3,run:4.6,sight:28,cd:1.3,wind:0.5,block:0.3,mass:0.3,folk:1,elite:1,drops:[[227,1,2,0.6],[206,1,2,0.5]],cause:'guard'},
  rengin:{n:'Engineer of the Hosts',m:'rengin',hp:18,dmg:3,reach:1.8,walk:1.2,run:4.3,sight:20,cd:1.2,wind:0.4,mass:0.6,folk:1,eng:1,drops:[[206,1,2,0.5]],cause:'guard'},
  rbear:{n:'Bearer of the Hosts',m:'rbear',hp:16,dmg:1,reach:1.6,walk:1.4,run:4.6,sight:18,cd:1.2,wind:0.4,mass:0.6,folk:1,civ:1,bear:1,drops:[[206,1,1,0.3]],cause:'guard'},
  eheal:{n:'Healer of the Elves',m:'eheal',hp:22,dmg:1,reach:1.6,walk:1.3,run:4.8,sight:20,cd:1.2,wind:0.4,mass:0.6,folk:1,civ:1,heal:1,drops:[[206,1,1,0.3]],cause:'elf'},
  rstd:{n:'Standard Bearer of the Realm',m:'rstd',hp:30,dmg:4,reach:2.2,walk:1.3,run:4.5,sight:24,cd:1.3,wind:0.45,mass:0.5,folk:1,std:1,drops:[[206,1,2,0.5]],cause:'guard'},
  dstd:{n:'Standard Bearer of the Mountain',m:'dstd',hp:40,dmg:5,reach:2,walk:1.15,run:4.3,sight:26,cd:1.1,wind:0.4,mass:0.3,tall:1.7,folk:1,std:1,say:'dguard',drops:[[206,1,2,0.5]],cause:'dwarf'},
  estd:{n:'Standard Bearer of the Elves',m:'estd',hp:36,dmg:5,reach:2.3,walk:1.4,run:5,sight:30,cd:1.1,wind:0.4,mass:0.5,folk:1,std:1,say:'eguard',drops:[[206,1,2,0.5]],cause:'elf'},
  rknight:{n:'Knight of the Realm',m:'rknight',hp:56,dmg:9,reach:3.6,walk:1.8,run:7.5,sight:34,cd:1.4,wind:0.5,block:0.5,mass:0.2,tall:3,mount:1,folk:1,wedge:1,drops:[[223,1,2,0.4],[206,1,2,0.5]],cause:'knight'},
  hlancer:{n:'Lancer of the Riders',m:'hlancer',hp:40,dmg:7,reach:3.8,walk:1.7,run:7.4,sight:32,cd:1.4,wind:0.5,block:0.4,mass:0.25,tall:3,mount:1,folk:1,wedge:1,say:'hguard',drops:[[223,1,1,0.3],[206,1,2,0.5]],cause:'horse'},
  hharch:{n:'Horse Archer of the Riders',m:'hharch',hp:30,dmg:3,reach:2.4,walk:1.7,run:7,sight:36,cd:1.3,wind:0.4,shot:{dmg:4,v:30,lo:6,hi:30,cd:1.6,k:'arrow'},keep:16,mass:0.25,tall:3,mount:1,folk:1,say:'hguard',drops:[[201,2,4,0.6]],cause:'harrow'},
  hout:{n:'Outrider of the Riders',m:'hout',hp:30,dmg:4,reach:2.6,walk:1.8,run:7.6,sight:36,cd:1.2,wind:0.4,shot:{dmg:6,v:24,lo:4,hi:18,cd:2.4,k:'jav'},keep:9,mass:0.25,tall:3,mount:1,folk:1,say:'hguard',drops:[[206,1,2,0.4]],cause:'jav'},
  emarch:{n:'Mounted Archer of the Elves',m:'emarch',hp:40,dmg:4,reach:2.4,walk:1.8,run:7.4,sight:40,cd:1.2,wind:0.35,shot:{dmg:5,v:34,lo:6,hi:34,cd:1.5,k:'arrow'},keep:16,mass:0.22,tall:3,mount:1,folk:1,say:'eguard',drops:[[201,2,5,0.6]],cause:'earrow'},
  eglaive:{n:'Glaive Warden of the Elves',m:'eglaive',hp:40,dmg:8,reach:3.8,walk:1.4,run:5,sight:32,cd:1.3,wind:0.45,block:0.2,mass:0.45,folk:1,cleave:1,say:'eguard',drops:[[223,1,2,0.4],[206,1,2,0.5]],cause:'elf'},
  eblade:{n:'Blade Master of the Elves',m:'eblade',hp:54,dmg:9,reach:2.5,walk:1.5,run:5.4,sight:34,cd:0.7,wind:0.25,block:0.3,mass:0.4,folk:1,elite:1,cleave:1,say:'eguard',drops:[[223,1,2,0.5],[227,1,1,0.3]],cause:'elf'},
  wskirm:{n:'Skirmisher of the Wood',m:'wskirm',hp:22,dmg:4,reach:2,walk:1.6,run:6,sight:40,cd:0.8,wind:0.3,shot:{dmg:3,v:30,lo:4,hi:26,cd:1.2,k:'arrow'},keep:14,mass:0.6,folk:1,say:'wguard',drops:[[201,2,4,0.6]],cause:'warrow'},
  wlong:{n:'Sharpshooter of the Wood',m:'wlong',hp:22,dmg:3,reach:2,walk:1.4,run:5.2,sight:56,cd:1.1,wind:0.35,shot:{dmg:8,v:44,lo:8,hi:54,cd:2.8,k:'arrow'},keep:20,mass:0.6,folk:1,say:'wguard',drops:[[201,3,6,0.7]],cause:'warrow'},
  dthrow:{n:'Axe Thrower of the Mountain',m:'dthrow',hp:34,dmg:5,reach:2,walk:1.2,run:4.4,sight:30,cd:0.9,wind:0.35,shot:{dmg:6,v:20,lo:3,hi:16,cd:1.8,k:'axe'},keep:6,block:0.3,mass:0.3,tall:1.7,folk:1,say:'dguard',drops:[[223,1,1,0.4]],cause:'daxe'},
  dbreak:{n:'Shieldbreaker of the Mountain',m:'dbreak',hp:44,dmg:9,reach:2.4,walk:1.1,run:4.2,sight:28,cd:1.4,wind:0.55,mass:0.2,tall:1.7,folk:1,pierce:1,say:'dguard',drops:[[223,1,2,0.5]],cause:'dwarf'},
  diron:{n:'Ironclad of the Mountain',m:'diron',hp:80,dmg:11,reach:2.5,walk:1.05,run:3.9,sight:28,cd:1.3,wind:0.55,block:0.5,mass:0.12,tall:1.7,folk:1,elite:1,say:'dguard',drops:[[223,1,2,0.5],[227,1,1,0.3]],cause:'dwarf'},
  dsapper:{n:'Sapper of the Mountain',m:'dsapper',hp:30,dmg:5,reach:1.9,walk:1.2,run:4.3,sight:22,cd:1,wind:0.4,mass:0.35,tall:1.7,folk:1,sap:1,say:'dguard',drops:[[223,1,1,0.3]],cause:'dwarf'},
  wolfrid:{n:'Wolf Rider',m:'wolfrid',hp:26,dmg:4,reach:2.8,walk:1.8,run:8,sight:30,cd:1,wind:0.35,mass:0.35,tall:2,mount:1,flee:0.2,drops:[[200,1,3,0.6],[213,1,1,0.3]],cause:'wolf'},
  gpot:{n:'Goblin Pot-Thrower',m:'gpot',hp:9,dmg:1,reach:1.5,walk:1.4,run:4.4,sight:20,cd:1.2,wind:0.4,shot:{dmg:4,v:12,lo:5,hi:20,cd:3,k:'pot'},keep:10,flee:0.3,mass:0.8,drops:[[SULFUR,1,2,0.5],[200,1,2,0.4]],cause:'pot'},
  odrum:{n:'War Drummer',m:'odrum',hp:22,dmg:3,reach:2,walk:1.3,run:4.4,sight:22,cd:1.2,wind:0.4,mass:0.5,drum:1,keep:7,drops:[[213,1,2,0.5],[200,1,2,0.5]],cause:'orc'},
  oshaman:{n:'Fire Shaman',m:'oshaman',hp:24,dmg:3,reach:2,walk:1.3,run:4.2,sight:26,cd:1.2,wind:0.4,shot:{dmg:5,v:12,lo:4,hi:22,cd:2.8,k:'fire'},keep:10,mass:0.5,rouse:1,drops:[[SULFUR,1,3,0.6],[230,1,1,0.08]],cause:'fire'},
  strollr:{n:'Siege Troll',m:'strollr',hp:120,dmg:12,reach:3.8,walk:1.05,run:3.4,sight:22,cd:2.4,wind:0.9,block:0.3,mass:0.08,tall:3,siege:1,drops:[[386,1,2,1],[213,2,4,0.8]],cause:'troll'},
  wbeast:{n:'War Beast',m:'wbeast',hp:150,dmg:12,reach:3.4,walk:1.2,run:5.2,sight:24,cd:1.8,wind:0.6,mass:0.05,tall:3,knock:1,drops:[[386,1,1,0.6],[200,3,6,1]],cause:'beast'},
  oshield:{n:'Shield Orc',m:'oshield',hp:22,dmg:3,reach:2.6,walk:1.3,run:4.2,sight:22,cd:1.2,wind:0.4,block:0.75,mass:0.4,drops:[[213,1,2,0.5],[200,1,2,0.5]],cause:'orc'},
  gswarm:{n:'Goblin Skulker',m:'gswarm',hp:6,dmg:2,reach:1.4,walk:1.7,run:5.6,sight:16,cd:0.6,wind:0.22,flee:0.2,mass:0.9,drops:[[200,1,1,0.4]],cause:'goblin'},
  tdriver:{n:'Troll Driver',m:'tdriver',hp:26,dmg:3,reach:2,walk:1.4,run:4.4,sight:24,cd:1.1,wind:0.4,whip:{dmg:4,lo:2,hi:6,cd:3.5},mass:0.5,drive:1,drops:[[213,1,2,0.5],[200,1,2,0.5]],cause:'orc'},
  oxbow:{n:'Orc Crossbowman',m:'oxbow',hp:14,dmg:2,reach:2,walk:1.4,run:4.5,sight:30,cd:1.2,wind:0.4,shot:{dmg:5,v:38,lo:5,hi:30,cd:2.6,k:'bolt'},keep:12,mass:0.6,drops:[[201,2,4,0.6],[213,1,1,0.3]],cause:'obolt'}
});
Object.assign(DEATH,{rbolt:'A crossbowman of the realm shot you',knight:'A knight of the realm rode you down',jav:'An outrider\'s javelin found you',daxe:'A dwarf\'s thrown axe struck you',
  wolf:'A wolf rider ran you down',pot:'A goblin\'s fire pot burned you',beast:'A war beast trampled you',obolt:'An orc\'s crossbow bolt found you'});
// their shots: a bolt (short and fast), a javelin (long, lofted a little), a thrown axe (spinning), a fire pot (lofted; it bursts in
// flame where it lands, hurting the other side about it and setting the works alight)
Object.assign(SHOT_K,{bolt:{g:6,sz:0.14,col:[0.32,0.3,0.3]},jav:{g:10,sz:0.12,col:[0.5,0.4,0.28]},axe:{g:12,sz:0.3,col:[0.6,0.6,0.64],spin:1},pot:{g:14,sz:0.32,col:[1,0.5,0.15],glow:1,spin:1}});
// who fights in the hosts and the warhosts now
Object.assign(FOE_HOME,{r_host:[['rsword',2],['rspear',2],['rbow',1.5],['rpike',1.5],['rxbow',1]],h_host:[['hrider',3],['hbow',1],['hspear',0.5],['hharch',1.2],['hout',0.8]],
  e_host:[['esword',2],['espear',2],['ebow',2],['eknight',1],['eglaive',1],['emarch',0.6]],w_host:[['wbow',3],['wknife',2],['wguard',1.5],['wskirm',1.2],['wlong',0.8]],
  d_host:[['daxe',3],['dhammer',2],['dxbow',2],['dthrow',1.2],['dbreak',1]],
  x_kn:[['rknight',3],['hlancer',1.5]],x_aid:[['eheal',1],['rbear',2]],e_aid:[['eheal',1],['rbear',1]],x_eg:[['rguard',1],['eblade',1],['diron',1]],d_sap:[['dsapper',3],['daxe',1]],r_eng:[['rengin',2],['rpike',1]],
  oarmy:[['raider',4],['bowman',2],['brute',3],['oshield',2],['oxbow',1.2]],oline:[['oshield',4],['oxbow',2],['odrum',0.7]],owolf:[['wolfrid',1]],oswarm:[['gswarm',4],['gpot',1]],
  oroused:[['raider',3],['brute',2],['oshaman',0.8],['odrum',0.8]],otroll:[['strollr',1],['troll',0.6]],owb:[['wbeast',1]]});
Object.assign(FOLK_N,{eng:[2,2],sap:[2,3],aid:[2,3]});
// ---- Blows: what each side's units add to a blow (from foeHurtFoe): [the hurt, the push]
function warDmg(g,n,by,kb,blow){if(!by||!by.kind)return [n,kb];const B=FOES[by.kind],G=FOES[g.kind];
  if(by.driven>foeClock)n*=1.25;if(by.chg&&blow){n*=1.8;kb*=2;by.chg=0;}
  if(B.pike&&(G.mount||(G.tall||2)>2.5))n*=1.6;if(B.knock)kb*=3;if(g.steady>foeClock)n*=0.8;return morDmg(g,n,by,kb,blow);} // (the horn, the charge and the formations: W8b)
// a glaive warden's or blade master's sweep takes a second foe within its reach, for half
function warCleave(g,n,by,ux,uz,blow){if(!blow||!by||!FOES[by.kind]||!FOES[by.kind].cleave||by.cleaving)return;const B=FOES[by.kind];
  for(const h of foes){if(h===g||h.dead||foeSide(h)===foeSide(by)||Math.hypot(h.x-by.x,h.z-by.z)-foeRad(h)>B.reach+0.4)continue;by.cleaving=1;foeHurtFoe(h,n*0.5,by,ux,uz,3,true);by.cleaving=0;break;}}
// ---- Every frame: the banners' steadying and the drums' driving (twice a second), healing, bearers, drums, the shamans' fire,
// siege trolls at the palisades
let warUnitT=0,warDrumT=0;
function warUnitsFrame(dt){
  warDrumT-=dt;if(warDrumT<=0){warDrumT=0.5;for(const f of foes){if(f.dead)continue;const F=FOES[f.kind];if(!F.drum||Math.hypot(f.x-PL.x,f.z-PL.z)>70||!AX||!settings.sound||!foeHear([f.x,f.y,f.z]))continue;
      const at=[f.x,f.y+1,f.z],fast=f.st==='chase'||f.war;burst(0.3,'lowpass',85,1.2,0.4,0,at);tone(72,48,0.28,0.2,0,'sine',at);if(fast){burst(0.2,'lowpass',110,1.2,0.3,0.25,at);tone(80,52,0.22,0.15,0.25,'sine',at);}}}
  for(const f of foes){if(f.dead)continue;const F=FOES[f.kind];
    if(F.rouse&&Math.random()<dt*10)spawnP(f.x+Math.sin(f.yaw+0.4)*0.6,f.y+3+Math.random()*0.4,f.z+Math.cos(f.yaw+0.4)*0.6,(Math.random()-.5)*0.3,0.8,(Math.random()-.5)*0.3,[1,0.5+Math.random()*0.3,0.1],0.5,-0.6);
    if(F.heal&&f.healFx>0){f.healFx-=dt;if(Math.random()<dt*12)spawnP(f.x+(Math.random()-.5)*2,f.y+0.5+Math.random()*1.5,f.z+(Math.random()-.5)*2,0,0.6,0,[0.75,0.95,0.6],0.8,-0.3);}}
  warUnitT-=dt;if(warUnitT>0)return;warUnitT=0.5;
  // the banners and the drums
  for(const f of foes){if(f.dead)continue;const F=FOES[f.kind];if(!F.std&&!F.drum&&!F.rouse&&!F.drive)continue;const r=F.std?9:F.drive?10:12;
    for(const g of foes){if(g.dead||g===f||Math.abs(g.x-f.x)>r||Math.abs(g.z-f.z)>r||Math.hypot(g.x-f.x,g.z-f.z)>r)continue;const G=FOES[g.kind];
      if(F.std&&!G.folk===!F.folk)g.steady=foeClock+1;else if((F.drum||F.rouse)&&!G.folk&&g.kind!=='troll'&&g.kind!=='strollr')g.driven=foeClock+1;else if(F.drive&&(g.kind==='troll'||g.kind==='strollr'))g.driven=foeClock+1;}}
  // healers: those of the hosts about them mended a little, three a second's half
  for(const f of foes){if(f.dead||!FOES[f.kind].heal||f.st==='flee')continue;let k=0;for(const g of foes){if(g.dead||!FOES[g.kind].folk||g.hp>=g.mhp||Math.hypot(g.x-f.x,g.z-f.z)>6)continue;g.hp=Math.min(g.mhp,g.hp+1.5);if(g.wnd&&g.hp>=g.mhp*0.4)morStand(g);k++;}if(k)f.healFx=0.6;}
  warBearers();warSiegeTrolls();}
// bearers: each goes to the nearest of the hosts' fallen within 40, lifts them and carries them back toward the field hospital
// in the Leaguer; out of sight they are gone in
function warHosp(P){const s=wgSite(P),L=s.lay.parts.find(p=>p.k==='lghosp');return L?siteXZ(s,(L.u0+L.u1)/2,(L.v0+L.v1)/2):siteXZ(s,P.uC0+190,0);}
function warBearers(){
  for(const f of foes){if(f.dead||!FOES[f.kind].bear||f.foe&&!f.foe.dead||f.st==='flee')continue;
    if(f.carry){if(Math.hypot(f.x-PL.x,f.z-PL.z)>80&&f.st!=='flee'){removeFoe(f);}else if(f.st==='idle'&&!(f.way&&f.way.length)){f.carry=0;f.bT=0;}continue;}
    const c=f.bT&&(f.bT.dead||f.bT.wnd)&&!f.bT.gone?f.bT:null;
    if(c){if(Math.hypot(c.x-f.x,c.z-f.z)<1.8){removeFoe(c);f.carry=1;f.bT=null;foeCall(f,'idle');const P=wasteGateAt(Math.floor(f.x+OX),Math.floor(f.z+OZ),200);
        if(P){const [u]=wgUV(P,f.x+OX,f.z+OZ),R=warRoute(P,false).filter(q=>wgUV(P,q[0],q[1])[0]>u+2),[hx,hz]=warHosp(P);f.way=R.map(q=>[q[0]+0.5,q[1]+0.5]).concat([[hx+0.5,hz+0.5]]);const w0=f.way.shift();warAim(f,w0);f.wp=w0;f.st='return';f.t=30;}
        else{f.way=[];f.st='return';f.hx=f.x-Math.sin(f.yaw)*40;f.hz=f.z-Math.cos(f.yaw)*40;f.t=30;}}
      else if(f.st!=='return'){f.way=[];warAim(f,[c.x+OX,c.z+OZ,1]);f.st='return';f.t=20;}continue;}
    let best=null,bd=40;for(const g of foes){if(!(g.dead||g.wnd)||g.gone||!(g.war||g.hst)||!FOES[g.kind].folk||g.claim&&g.claim!==f&&!g.claim.dead)continue;const d=Math.hypot(g.x-f.x,g.z-f.z);if(d<bd){bd=d;best=g;}}
    if(best){best.claim=f;f.bT=best;f.way=[];f.waitA=null;f.lineHold=null;f.back=null;warAim(f,[best.x+OX,best.z+OZ,1]);f.st='return';f.t=20;}}}
// siege trolls: one at the hosts' palisades, mantlets or stakes (what burns) within reach of its ram knocks out a few of them
// every three seconds, with a boom and splinters; they are mended with the burned works, fifteen minutes later
function warSiegeTrolls(){
  for(const f of foes){if(f.dead||!FOES[f.kind].siege||!f.war||(f.ramT||0)>foeClock||Math.hypot(f.x-PL.x,f.z-PL.z)>90)continue;const w=WARS.get(f.war);if(!w)continue;
    const fx=f.x+Math.sin(f.yaw)*2.6,fz=f.z+Math.cos(f.yaw)*2.6,out=[];
    for(let dy=0;dy<=4&&out.length<3;dy++)for(let dx=-1;dx<=1&&out.length<3;dx++)for(let dz=-1;dz<=1&&out.length<3;dz++){const x=Math.floor(fx)+dx,y=Math.floor(f.y)+dy,z=Math.floor(fz)+dz;if(x<0||z<0||x>=W||z>=D)continue;
      const id=world[I(x,y,z)];if(WAR_BURN.has(id))out.push([x,y,z,id]);}
    if(!out.length)continue;f.ramT=foeClock+3;f.atk=0.9;f.atkK='blow';if(!w.bn)w.bn=[];
    for(const [x,y,z,id] of out){const k=x+OX+','+y+','+(z+OZ);if(w.bn.length<400&&!w.bn.some(e=>e[0]===k))w.bn.push([k,id,Math.round(warPlay),1]);setBlock(x,y,z,AIR,true);breakFx(x,y,z,id,8);}
    const d=Math.hypot(fx-PL.x,fz-PL.z);sfxBoom(d*1.6,[fx,f.y+2,fz]);shake=Math.max(shake,Math.max(0,0.4*(1-d/30)));saveDirty=true;}}
// ---- The wedge (Q150): in battle the hosts' knights and lancers form a wedge before the line, its point toward the foe, and at
// the horn charge together, each at the nearest foe, the first blow of the charge striking near twice as hard
function warWedge(A,live,cx,cz,fx,fz){const K=live.filter(f=>FOES[f.kind].wedge);if(K.length<3)return [];const ax=-fz,az=fx,FW={hold:true,go:false,goT:0,gap:0.1,face:Math.atan2(fx,fz),line:1};
  let y=0;for(const f of K)y+=f.y;y=Math.round(y/K.length);
  K.forEach((f,i)=>{const r=Math.floor((Math.sqrt(8*i+1)-1)/2),c=i-r*(r+1)/2;let x=cx+fx*(12-r*2.8)+ax*(c-r/2)*2.6,z=cz+fz*(12-r*2.8)+az*(c-r/2)*2.6;if(foeStand(x,y+1,z,3)<0){x=f.x;z=f.z;}warHoldAt(f,x+OX,z+OZ,FW);});
  A.wedge={FW:FW,m:K,t:foeClock+6};return K;}
function warWedgeTick(A,en){const Wg=A.wedge;if(!Wg||foeClock<Wg.t)return;A.wedge=null;A.charged=(A.charged||0)+1;Wg.FW.hold=false;Wg.FW.go=true;Wg.FW.goT=foeClock;
  const [x,z]=warMid(A);warSignal('advance','r',[x,A.P.hG+4,z]);setTimeout(()=>warCry(false,14,x,A.P.hG+2,z),600);
  for(const f of Wg.m){if(f.dead||f.rout||f.wnd)continue;let best=null,bd=80;for(const g of en){if(g.dead)continue;const d=Math.hypot(g.x-f.x,g.z-f.z);if(d<bd){bd=d;best=g;}}
    f.waitA=null;f.lineHold=null;f.chg=1;if(best){f.foe=best;f.eseen=0;f.st='chase';f.seen=0;f.t=0;}}
  if(Math.hypot(x-PL.x,z-PL.z)<120)toast('The knights charge!');}
