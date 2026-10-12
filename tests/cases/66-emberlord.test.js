// The Emberlords remade (W7a, D-074): three builds in four fires, about twenty blocks tall; each lord its own name, temper and
// story; the way out of its fortress clear for it; its powers by phase: a blade that cleaves wide, a whip that drags, long leaps,
// fire breath, servants called out of the fire, fissures, eruptions and walls of fire; its hall flooding with lava when it tears
// at the mountain, and the lava cooling when it falls; the lords seen are written in the journal.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();EMB_HZ.length=0;};
// every build in every fire builds, about twenty tall; the summoned creatures build
{const bad=[],hs=[];for(const k of ['ember','ember2','ember3'])for(let ci=0;ci<4;ci++){try{const m=amBuild(k,ci,{});hs.push(m.box[4]);}catch(e){bad.push(k+'.'+ci+' '+e.message);}}
  for(const k of ['fspirit','fhound','ldemon'])for(let ci=0;ci<AM_KINDS[k].coats.length;ci++){try{amBuild(k,ci,{});}catch(e){bad.push(k+'.'+ci+' '+e.message);}}
  info('heights',hs.map(h=>h.toFixed(1)).join(' '),'; bad',bad.join(', '));assert(!bad.length&&hs.length===12&&hs.every(h=>h>18&&h<23),'three builds in four fires, about twenty blocks tall; fire spirits, flame hounds and lesser demons');}
// each lord its own
const gs=[...Array(31).keys()].flatMap(i=>[...Array(31).keys()].map(j=>greatOf(stretchCell(landSite(i-15,j-15))))).filter(Boolean),seen=new Set(),G=[];for(const g of gs){const F=fortOf(g);if(F&&!seen.has(F.id)){seen.add(F.id);G.push(F);}}
G.sort((a,b)=>Math.hypot(a.GX,a.GZ)-Math.hypot(b.GX,b.GZ));
{const L=G.map(emberLord),again=emberLord(Object.assign({},G[0],{L:null}));info('the lords:',L.map(l=>l.n+' ('+l.kind+', '+l.fire+', '+l.temper+')').join('; '));info('a story:',emberStory(L[0]).join(' '));
  assert(L.every(l=>/ /.test(l.n)&&FOES[l.kind].lord&&l.ci>=0&&l.ci<4&&EMBER_TEMPER[l.temper])&&again.n===L[0].n&&again.kind===L[0].kind&&again.temper===L[0].temper&&emberStory(L[0]).length===4,'each lord has its own name, build, fire, temper and story, the same every time');}
// the way out of its fortress is clear for it, from its throne to its gate
const F=G[0],S=fortSpots(F),P=F.P;{const lu=F.U1+F.Lh-P.steps-3-6*P.k;let minH=999;for(let u=lu;u>=0;u--){const X=F.GX-F.ox*u,Z=F.GZ-F.oz*u;if(Math.abs(X-(PL.x+OX))>90||Math.abs(Z-(PL.z+OZ))>90){gen(X,Z);PL.x=X-OX;PL.z=Z-OZ;}
    const x=X-OX,z=Z-OZ,y=fortFloor(F,u);let h=0;while(h<60&&!SOLID[get(x,y+h,z)])h++;minH=Math.min(minH,h);}
  info(F.name,': clear over the middle of the way out',minH,'; the lord stands',FOES.ember.tall);assert(minH>=FOES.ember.tall,'the gate and the way in of its fortress let its lord out');}
// its powers: on the open floor of the wastes, the player in survival, hardened
gen(S.hall.x,S.hall.z);clear();PL.x=S.lord.x-OX+8;PL.z=S.lord.z-OZ;PL.y=S.lord.y+1;foeSpawnTick();const lord=foes.find(f=>isLord(f));
info('in its hall:',lord&&lord.L.n,', a',lord&&lord.kind,'in coat',lord&&lord.ci,', its health',lord&&lord.hp);assert(lord&&lord.L===emberLord(F)&&lord.ci===lord.L.ci&&lord.kind===lord.L.kind,'its fortress\'s lord is that lord');
setMode('survival');playing=true;const tough=()=>{hp=20;hurtCD=0;};
const at=(d)=>{PL.x=lord.x+Math.sin(lord.yaw)*d;PL.z=lord.z+Math.cos(lord.yaw)*d;PL.y=lord.y;PL.vx=PL.vz=0;};
const only=(k)=>{lord.ec={l:99,b:99,s:99,fi:99,e:99,w:99};if(k)lord.ec[k]=0;lord.whipT=99;lord.shotT=99;lord.atkT=99;lord.st='chase';lord.vis=true;lord.losT=9;lord.atk=0;};
const keep=()=>{tough();lord.vis=true;lord.losT=9;};
// the whip drags (phase one)
{lord.hp=lord.mhp;only(null);lord.whipT=0;at(20);const d0=Math.hypot(PL.x-lord.x,PL.z-lord.z);let drag=0;run(3,()=>{keep();const v=(PL.vx*(lord.x-PL.x)+PL.vz*(lord.z-PL.z))/Math.hypot(lord.x-PL.x,lord.z-PL.z);drag=Math.max(drag,v);return drag>4;});
  info('the whip: the player 20 off pulled toward it at',drag.toFixed(1));assert(drag>4,'its whip drags its foe to it');}
// the blade cleaves wide: two of the realm's soldiers before it, either side
{const a=lord.yaw,k1=addFoe('rspear',lord.x+Math.sin(a-0.6)*7,lord.y,lord.z+Math.cos(a-0.6)*7,{}),k2=addFoe('rspear',lord.x+Math.sin(a+0.6)*7,lord.y,lord.z+Math.cos(a+0.6)*7,{});k1.hp=k2.hp=999;
  lord.foe=k1;lord.atkK='blow';emberStrike(lord,FOES[lord.kind]);info('the blade: the two struck to',k1.hp,'and',k2.hp);assert(k1.hp<999&&k2.hp<999,'its blade cleaves wide, through all before it');removeFoe(k1);removeFoe(k2);lord.foe=null;}
// wings and fire (phase two): a leap, the breath, its servants, a fissure
lord.hp=Math.round(lord.mhp*0.55);run(0.1);const ph2=lord.ph3;
{only('l');at(32);const d0=Math.hypot(PL.x-lord.x,PL.z-lord.z);let up=0,leapt=0;run(5,()=>{keep();if(lord.leap){leapt=1;up=Math.max(up,lord.y-lord.leap.y0);}return leapt&&!lord.leap;});
  const d1=Math.hypot(PL.x-lord.x,PL.z-lord.z);info('phase',ph2,'; a leap: from',d0.toFixed(0),'to',d1.toFixed(0),'off, rising',up.toFixed(1));assert(ph2===2&&leapt&&d1<d0-12&&up>6,'hurt, it takes to its wings and leaps down where its foe stands');}
{only('b');at(14);const h0=hp;let br=0,burnt=0;run(4,()=>{if(lord.breath>0)br=1;if(hp<20)burnt=1;hp=20;hurtCD=0;lord.vis=true;lord.losT=9;return br&&lord.breath<=0;});info('the breath:',br,'; it burned the player',burnt);assert(br&&burnt,'it breathes fire on its foe');}
{only('s');at(20);run(3,()=>{keep();return foes.some(g=>g.sum===lord.id);});run(0.5,keep);const sm=foes.filter(g=>g.sum===lord.id).map(g=>g.kind);info('called:',sm.join(' '));assert(sm.length>=2&&sm.every(k=>['fspirit','fhound','ldemon'].includes(k)),'it calls its servants out of the fire');}
{only('fi');at(18);EMB_HZ.length=0;run(3,()=>{keep();return EMB_HZ.some(h=>h.k==='fis');});info('a fissure:',EMB_HZ.map(h=>h.k).join(' '));assert(EMB_HZ.some(h=>h.k==='fis'),'it opens fissures of fire along the ground');}
// it tears at the mountain (phase three): eruptions, a wall of fire, stones, the hall flooding
lord.hp=Math.round(lord.mhp*0.25);run(0.1);const ph3=lord.ph3;
{only('e');at(16);EMB_HZ.length=0;run(3,()=>{keep();return EMB_HZ.some(h=>h.k==='eru');});const eru=EMB_HZ.filter(h=>h.k==='eru').length;only('w');at(24);run(3,()=>{keep();return EMB_HZ.some(h=>h.k==='wall');});
  info('phase',ph3,'; eruptions',eru,'; a wall',EMB_HZ.some(h=>h.k==='wall'),'; stones falling',EMB_HZ.filter(h=>h.k==='rock').length);assert(ph3===3&&eru>=3&&EMB_HZ.some(h=>h.k==='wall'),'near its end the fire of the mountain erupts about its foe and walls of fire rise');}
const floor=()=>{let n=0;for(let u=F.U1;u<F.U1+F.Lh;u++)for(let v=-P.hw;v<=P.hw;v++){const x=F.GX-F.ox*u+F.px*v-OX,z=F.GZ-F.oz*u+F.pz*v-OZ;if(x>=0&&z>=0&&x<W&&z<D&&get(x,F.Fh,z)===LAVA)n++;}return n;};
{only(null);lord.whipT=99;at(12);for(let i=0;i<40;i++){run(1,keep);for(let k=0;k<6;k++)flowStep();}const n=floor();
  info('the hall floods: lava over its floor',n,'; the flood at bay',F.flood&&F.flood.u);assert(F.flood&&n>40,'tearing at the mountain, it floods its hall with lava from its rivers');}
// it falls: what it called burns out, the lava cools, the journal tells of it
{const sm0=foes.filter(g=>g.sum===lord.id&&!g.dead).length;lord.hp=1;foeHurtFoe(lord,999,addFoe('rspear',lord.x+3,lord.y,lord.z,{}),0,0,0);run(1);const left=foes.filter(g=>g.sum===lord.id&&!g.dead).length,lava=floor();
  let crust=0;for(let u=F.U1;u<F.U1+F.Lh;u++)for(let v=-P.hw;v<=P.hw;v++){const x=F.GX-F.ox*u+F.px*v-OX,z=F.GZ-F.oz*u+F.pz*v-OZ;if(x>=0&&z>=0&&x<W&&z<D&&[OBSID,LAVACRUST].includes(get(x,F.Fh,z)))crust++;}
  info('fallen:',lord.dead>0,'; its servants',sm0,'->',left,'; lava on the floor',lava,'; cooled to obsidian and crust',crust);assert(lord.dead>0&&left===0&&lava===0&&crust>40&&fallenLords.has(F.id),'when it falls its servants burn out and the lava in its hall cools');
  const out=[];emberJournal(out);info('the journal:',out.slice(0,4).join(' | '));assert(emberKnown.has(F.id)&&out.includes('THE EMBERLORDS')&&out.some(l=>l.includes(lord.L.n))&&JSON.stringify(emberSave()).includes(F.id),'the lords seen are written in the journal, with their stories, and saved');}
setMode('creative');playing=false;clear();
