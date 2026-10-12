// The war's soldiers, creatures and heroes (W3, D-070): every new kind builds and stands; the new shots fly and a fire pot bursts
// among the hosts; pikes strike harder at horsemen and trolls, a banner steadies, a drum drives, a shieldbreaker's blow goes through
// a shield, a glaive cleaves a second foe, a healer mends, a bearer lifts the fallen and carries them off, a siege troll knocks a
// palisade apart (to be mended); in battle the knights form a wedge and charge; the armies bring their new companies and a named
// hero each, whose deeds are counted, whose fall is told and written, and for whom a cairn is raised and a new captain named.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),g=P.hG,cs=P.cs,at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const [X,Z]=at(60,0);gen(X,Z);PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;playing=false;
const clear=()=>{for(const f of [...foes])removeFoe(f);for(const sh of [...shots])scene.remove(sh.m);shots.length=0;foeSpots.clear();};
clear();warS.clear();warArmies.length=0;WARS.clear();warPlay=0;warClk=1e9;WJ.length=0;warStateTick();const w=WARS.get(P.id);
const NEW=['rpike','rxbow','rguard','rengin','rbear','eheal','rstd','dstd','estd','rknight','hlancer','hharch','hout','emarch','eglaive','eblade','wskirm','wlong','dthrow','dbreak','diron','dsapper',
  'wolfrid','gpot','odrum','oshaman','strollr','wbeast','oshield','gswarm','tdriver','oxbow'];
const y0=PL.y,put=(k,dx,dz,o)=>addFoe(k,PL.x+dx,foeStand(PL.x+dx,y0+2,PL.z+dz,FOES[k].tall||2),PL.z+dz,o||{});
// every kind builds, in every coat, and stands
{let bad=[];for(const k of NEW){try{if(!FOES[k]||!AM_KINDS[FOES[k].m])throw new Error('no kind');for(let ci=0;ci<AM_KINDS[FOES[k].m].coats.length;ci++)amBuild(FOES[k].m,ci,{});amMerged(FOES[k].m);put(k,0,8);}catch(e){bad.push(k+' '+e.message);}}
  run(1);info('new kinds',NEW.length,'; standing',foes.length,'; bad',bad.join(', '));assert(!bad.length&&foes.length===NEW.length,'every new soldier and creature builds, in every coat, and stands');clear();}
const pair=(a,b,d)=>{const A=put(a,-d/2,6),B=put(b,d/2,6);A.yaw=A.hd=Math.atan2(B.x-A.x,B.z-A.z);B.yaw=B.hd=Math.atan2(A.x-B.x,A.z-B.z);return [A,B];};
const blow=(A,B)=>{const h0=B.hp;foeHurtFoe(B,10,A,1,0,1,true);const d=h0-B.hp;B.hp=h0;return d;};
// blows: pikes against horse and troll, a banner steadies, a drum drives, a shieldbreaker goes through a shield, a glaive cleaves
{let [a,b]=pair('rpike','raider',2);const plain=blow(a,b);clear();[a,b]=pair('rpike','wolfrid',2);const vsMount=blow(a,b);clear();
  [a,b]=pair('raider','rsword',2);const sw0=blow(a,b);put('rstd',0,7);warUnitT=0;warUnitsFrame(0.01);const sw1=blow(a,b);clear();
  [a,b]=pair('raider','rsword',2);put('odrum',-2,4);warUnitT=0;warUnitsFrame(0.01);const dr=blow(a,b);clear();
  [a,b]=pair('rsword','oshield',2);const sh0=blow(a,b);clear();[a,b]=pair('dbreak','oshield',2);const sh1=blow(a,b);clear();
  [a,b]=pair('eglaive','raider',2);const c2=put('raider',1.5,7.2),c0=c2.hp;foeHurtFoe(b,10,a,1,0,1,true);const cl=c0-c2.hp;clear();
  info('a pike\'s blow: at a raider',plain,', at a wolf rider',vsMount,'; a sword at a swordsman',sw0,', under a banner',sw1,'; a raider driven by a drum',dr,'; at a shield orc: a sword',sh0.toFixed(1),', a shieldbreaker',sh1,'; a glaive\'s sweep takes',cl);
  assert(vsMount>plain*1.5&&sw1<sw0&&dr>sw0&&sh1>sh0*3&&cl>0,'pikes strike horsemen harder, banners steady, drums drive, shieldbreakers go through shields, glaives cleave a second foe');}
// shots: a bolt, a thrown axe, a javelin; a fire pot bursts among the hosts
{const k0=shots.length,[x1,o1]=pair('rxbow','raider',12);x1.foe=o1;foeShoot(x1,FOES.rxbow.shot,0);const [x2,o2]=pair('dthrow','raider',10);x2.foe=o2;foeShoot(x2,FOES.dthrow.shot,0);
  const [x3,o3]=pair('hout','raider',10);x3.foe=o3;foeShoot(x3,FOES.hout.shot,0);const kinds=shots.slice(k0).map(q=>q.k).join(',');clear();
  const [p,h]=pair('gpot','rspear',10),h0=h.hp;p.foe=h;foeShoot(p,FOES.gpot.shot,0);for(let i=0;i<80&&shots.length;i++)updShots(0.05);
  info('shots',kinds,'; a fire pot: the spearman',h0,'->',h.hp);assert(kinds==='bolt,axe,jav'&&h.hp<h0,'bolts, thrown axes and javelins fly; a fire pot bursts and burns the hosts where it lands');clear();}
// a healer mends; a bearer lifts one of the fallen and carries them off
{const hurt=put('rsword',0,6);hurt.hp=5;put('eheal',1.5,6);for(let i=0;i<10;i++){warUnitT=0;warUnitsFrame(0.5);}const healed=hurt.hp;clear();
  const dead=put('rspear',2,12);dead.war=P.id;dead.dead=0.5;dead.st='dead';const b=put('rbear',0,5);let lifted=false;run(30,()=>{if(b.carry)lifted=true;return lifted&&Math.hypot(b.x-dead.x,b.z-dead.z)>6;});
  info('a healer: 5 ->',healed,'; a bearer lifted the fallen',lifted,', the body gone',!!dead.gone,', carried',Math.hypot(b.x-dead.x,b.z-dead.z).toFixed(1),'off');
  assert(healed>=15&&lifted&&dead.gone&&Math.hypot(b.x-dead.x,b.z-dead.z)>6,'a healer mends the hurt about them; a bearer lifts one of the fallen and carries them off');clear();}
// a siege troll knocks a palisade apart; the broken stakes are mended later
{const t=put('strollr',0,6);t.war=P.id;t.yaw=t.hd=0;const fx=Math.floor(t.x+Math.sin(0)*2.6),fz=Math.floor(t.z+Math.cos(0)*2.6),fy=Math.floor(t.y);for(let dy=0;dy<3;dy++)setBlock(fx,fy+dy,fz,STAKES,true);
  const n0=w.bn?w.bn.length:0;warSiegeTrolls();const broke=(w.bn?w.bn.length:0)-n0,gone=get(fx,fy,fz)===AIR;warPlay+=1000;warFireT=0;warFireFrame(1.1);const back=get(fx,fy,fz)===STAKES;
  info('a siege troll broke',broke,'; gone',gone,'; mended',back);assert(broke>=1&&gone&&back,'a siege troll knocks the hosts\' palisade apart, and it is mended in time');clear();}
// the armies: their new companies, their heroes, the knights' wedge; a hero's fall, a cairn, a new captain; the journal
{clear();playing=true;const AL=warArmy(P,true),OR=warArmy(P,false),seen={};let wedge=0,charge=0;
  for(let k=0;k<160;k++){run(1);for(const f of foes)if(!f.dead)seen[f.kind]=1;if(AL.wedge)wedge=1;if(foes.some(f=>f.chg))charge=1;}
  const hostKinds=['rknight','rstd','dstd','estd','eheal'].filter(k=>seen[k]),orcKinds=['oshield','wolfrid','gswarm','strollr','tdriver','wbeast'].filter(k=>seen[k]);
  info('the hosts brought',hostKinds.join(' '),'; the warhost',orcKinds.join(' '),'; heroes',AL.hero&&AL.hero.n,'and',OR.hero&&OR.hero.n,'; wedge',wedge,'charge',charge);
  assert(hostKinds.length>=4&&orcKinds.length>=4,'the armies bring their new companies: knights, standards, healers; shield orcs, wolf riders, skulkers, siege trolls and their drivers');
  assert(!!AL.hero&&!!OR.hero&&/ /.test(AL.hero.n)&&!!AL.heroF&&wedge&&charge,'each army has a named hero at its head, and the knights form a wedge and charge');
  playing=false;clear();warArmies.length=0;
  const H=heroesOf(w),h=H.al[0],f=put(h.k,0,6);f.hero=h;const o=put('brute',1.5,6);foeHurtFoe(o,999,f,1,0,1,true);const k1=h.kills;
  const n0=H.al.length,d0=H.dead.length;foeHurtFoe(f,999,o,1,0,1,true);
  info('the hero',h.n,'slew',k1,'; fell:',H.dead.length-d0,'; captains now',H.al.length,'; chronicle:',w.log[w.log.length-1][1]);
  assert(k1===1&&H.dead.length===d0+1&&H.al.length===n0&&H.al.every(q=>q!==h)&&/fell to/.test(w.log[w.log.length-1][1]),'a hero\'s deeds are counted; fallen, the hero is written in the chronicle and a new captain takes up the command');
  for(let i=0;i<20;i++){warWorksTick(P,w);let k=0;while(WJ.length&&k++<2000)warJobsFrame();}
  const u=P.uL+26,v=cs*54,ty=warTop(P,u,v)+1,[cx,cz]=wgXZ(P,u,v),cairn=get(cx-OX,ty,cz-OZ),ban=get(cx-OX,ty+4,cz-OZ);info('the cairn:',BL[cairn].n,', its banner',BL[ban].n);
  assert(cairn===COBBLE&&[RBANNER,HBANNER,EVBANNER,WBANNER,DBANNER].includes(ban),'a cairn with its people\'s banner is raised for the fallen hero behind the lines');
  const out=[];warJournal(out);assert(out.some(l=>/^Remembered: /.test(l)&&l.includes(h.n))&&out.some(l=>/^Captains of the hosts: /.test(l)),'the journal names the captains and remembers the fallen');}
