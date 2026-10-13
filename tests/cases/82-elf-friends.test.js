// Friendship with the elves (D-088): standing with each people, its ranks and their gifts, the name they give a friend and
// their tongue; speaking with their folk; trade for coin; the healers; the moonwells; a leaf-stone read; the histories at their
// lecterns and in the journal; an audience at the throne; their tasks (plants gathered, a relic brought from a ruin of the elder
// days, a letter carried, creatures of the wastes slain, a lost one led home); wardens at the border; their steeds and the
// whistle; the swan boat on the water; the warden's cloak and the starglass lantern; a bow from a friend.
setMode('survival');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const B=(X,Y,Z)=>get(X-OX,Y,Z-OZ);const TO=[];toast=m=>{if(m)TO.push(m);};let shown=null;showText=(t,x)=>{shown=[t,x];};
const reset=()=>{EF.e=EF.w=0;EF.ne=EF.nw='';EF.ge=EF.gw=0;EF.q=null;EF.tl=[];EF.au={};for(let i=0;i<inv.length;i++)inv[i]=null;};
const at=(s,u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[X-OX+W*(Z-OZ)]+1;};
reset();
// ---- the provinces, a city of each people, and its market
const seen=new Set();let eCity=null,wCity=null;
for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C)continue;
  const P=provinceOf(c.i,c.j);if(C.k==='elf'&&!eCity)eCity=P.sites.find(s=>s.k==='city'&&P.capital&&['market','heal','stable','throne'].every(q=>siteLayout(s).spots.some(p=>p.kind===q)));
  if(C.k==='wood'&&!wCity)wCity=P.sites.find(s=>s.k==='city'&&siteLayout(s).spots.some(p=>p.kind==='stable'));}
// ---- standing, ranks and gifts, the name
{assert(elfRank('e')===0&&elfRankName('e')==='Stranger','a stranger to the elves at first');
  elfGain('e',12,null);elfRankUp('e',1);const wb=countOf(417);elfGain('e',20,null);elfRankUp('e',2);
  info('standing with the high elves',EF.e,'(',elfRankName('e'),'); waybread given',wb,'; their name for you',EF.ne,'; a starglass lantern',countOf(421));
  assert(elfRank('e')===2&&wb>=4&&countOf(421)===1&&EF.ne&&!isBlockedName(EF.ne.split(' ')[0]),'standing rises through the ranks, each with its gift; a friend is given a name');}
// ---- their tongue
{const words=ELF_TONGUE.flatMap(t=>t[0].split(/[ ,]+/)).filter(Boolean),bad=words.filter(w=>isBlockedName(w));info('the elven tongue:',ELF_TONGUE.length,'sayings,',words.length,'words; blocked',bad.join(',')||'none');
  assert(ELF_TONGUE.length>=8&&!bad.length,'the elves greet in their own tongue, none of it borrowed');}
// ---- speaking with them; trade; healing
{const s=eCity,mk=s?siteLayout(s).spots.find(p=>p.kind==='market'):null,[X,Z]=at(s,mk.u,mk.v);gen(X,Z);toPL(X,Z,mk.y+1);for(const f of [...foes])removeFoe(f);foeSpots.clear();foeSpawnTick();
  const m=foes.find(f=>f.kind==='emerch');assert(!!m,'merchants keep the elven market');elfTalk(m,'e');info('speaking with',FOES[m.kind].n,': the panel open',invOpen);assert(invOpen,'speaking with one of them opens what they will say and do');closeInv();
  addItem(204,10);const p0=purse(),r=elfBuy('e',417,6,4),p1=purse();addItem(352,5);const r2=elfSell('e',352,3,5),p2=purse();
  info('trade:',r,'; purse',p0,'->',p1,';',r2,'; purse',p2,'; waybread',countOf(417));assert(p1===p0-elfPrice('e',6)*4&&p2===p1+elfOffer('e',3)*5&&countOf(352)===0,'their merchants trade for coin, buying and selling');
  assert(elfPrice('e',100)<100*ELF_BUYK[0]&&elfOffer('e',100)>100*ELF_SELLK[0],'a friend pays less and is paid more than a stranger');
  hp=4;elfHeal('e');info('healed:',hp);assert(hp===20,'their healers make the player whole');for(const f of [...foes])removeFoe(f);foeSpots.clear();}
// ---- a moonwell
{const s=eCity,p=siteLayout(s).parts.find(q=>q.k==='epool'&&q.moon),[X,Z]=at(s,p.cu,p.cv);gen(X,Z);let ms=null;for(let dx=-3;dx<=3&&!ms;dx++)for(let dz=-3;dz<=3&&!ms;dz++)for(let y=p.y-3;y<=p.y;y++)if(B(X+dx,y,Z+dz)===MOONSTONE){ms=[X+dx-OX,y,Z+dz-OZ];break;}
  toPL(X+3,Z,p.y+1);hp=5;EF.dr=-1;const ok=useMoonwell(...ms),h1=hp;hp=5;useMoonwell(...ms);info('the moonwell: healed to',h1,'; again the same night',hp);assert(ok&&h1===20&&hp===5,'a moonwell heals once a night');}
// ---- a leaf-stone, the lecterns' histories
{let col=null;for(const r of eCity.prov.roads.filter(r=>r.k==='high')){const ux=(r.b[0]-r.a[0])/r.len,uz=(r.b[1]-r.a[1])/r.len;for(let along=60;along<r.len&&!col;along+=1)for(let o=-22;o<=22&&!col;o++){const X=Math.round(r.a[0]+ux*along-uz*o),Z=Math.round(r.a[1]+uz*along+ux*o),rr=realmRoadAt(X,Z,1);
    if(rr&&rr.rd===r&&rr.off<0&&Math.abs(rr.off)>r.w+0.5&&Math.abs(rr.off)<=r.w+1.5&&Math.floor(rr.along)%144===72&&!realmSiteAt(X,Z,0)&&!colInfo(X,Z,{}).wet)col=[X,Z];}}
  if(col){gen(col[0],col[1]);const g=ground[col[0]-OX+W*(col[1]-OZ)];shown=null;useLeafStone(col[0]-OX,g+1,col[1]-OZ);info('a leaf-stone reads:',shown&&shown[1]);assert(shown&&/paces to the/.test(shown[1]),'a leaf-stone tells the way along the elven road');}
  const tl=EF.tl.length;elfTale(eCity,'e',false);elfTale(eCity,'e',true);const jt=journalText();info('tales read',EF.tl.length-tl,'; the journal has the Elder Days',/THE ELDER DAYS/.test(jt),'; first title',elfTales(eCity.prov.kingdom.key,eCity.prov.kingdom.name,'e')[0][0]);
  assert(EF.tl.length-tl===2&&/THE ELDER DAYS/.test(jt)&&jt.includes(elfTales(eCity.prov.kingdom.key,eCity.prov.kingdom.name,'e')[0][0]),'the histories of each realm are read at their lecterns, told by their loremasters, and kept in the journal');
  const ws=elfTales(eCity.prov.kingdom.key,eCity.prov.kingdom.name,'e').flatMap(t=>(t[0]+' '+t[1]).match(/[A-Z][a-z]+/g)),bad=ws.filter(w=>isBlockedName(w));assert(!bad.length,'no name in the histories is borrowed ('+bad.join(',')+')');}
// ---- an audience at the throne
{elfGain('e',40,null);const T=siteLayout(eCity).spots.find(p=>p.kind==='throne'),[X,Z]=at(eCity,T.u,T.v);gen(X,Z);toPL(X+2,Z,T.y+1);for(const f of [...foes])removeFoe(f);foeSpots.clear();foeSpawnTick();
  const k=foes.find(f=>f.kind==='eking'||f.kind==='equeen');assert(!!k,'the king or queen sits on the throne of the high seat');const n0=inv.filter(Boolean).length,msg=elfAudience(k,'e');
  info('an audience with the',FOES[k.kind].n,':',msg);assert(/gift from the throne/.test(msg)&&elfAudience(k,'e').indexOf('gift')<0,'the throne grants a friend an audience and a gift, once for each rank');
  for(const f of [...foes])removeFoe(f);foeSpots.clear();}
// ---- tasks: plants, a relic from a ruin, a letter, the wastes, a lost one
{const giver={kind:'elore',site:eCity},giver2={kind:'elord',site:eCity},s0=EF.e;
  let q=elfTaskGive(giver,'e','gather');addItem(q.it,q.need);assert(elfTaskReady(q),'plants gathered');const c0=purse();elfTaskDone(giver);info('gathered',q.need,nameOf(q.it),'; paid',purse()-c0,'; standing',EF.e-s0);assert(!EF.q&&purse()>c0&&EF.e>s0,'a task of gathering, done and paid');
  q=elfTaskGive(giver,'e','relic');info('a relic:',q.n);gen(q.X,q.Z);toPL(q.X,q.Z);elfTaskTick();const got=countOf(q.it);gen(q.fx,q.fz);toPL(q.fx,q.fz);elfTaskTick();info('found the relic',got,'; brought back',!EF.q);assert(got===1&&!EF.q,'a relic of the elder days brought back from a ruin');
  q=elfTaskGive(giver2,'e','letter');info('a letter:',q.n,'; carried',countOf(428));gen(q.X,q.Z);toPL(q.X,q.Z);elfTaskTick();assert(countOf(428)===0&&!EF.q,'a letter carried to another place of the elves');
  q=elfTaskGive({kind:'ecapt',site:eCity},'e','slay');const n=q.c;for(let i=0;i<n;i++)elfSlain({kind:'raider',x:PL.x+999,z:PL.z,dead:0});assert(elfTaskReady(EF.q),'creatures of the wastes slain for the captains');elfTaskDone(giver);assert(!EF.q,'and told');
  q=elfTaskGive(giver2,'e','lost');info('a lost one:',q.n);gen(q.X,q.Z);toPL(q.X,q.Z);elfTaskTick();const L=elfLost;assert(L&&L.lost,'the lost one is out there');PL.x=L.x+1;PL.z=L.z;elfTaskTick();assert(EF.q.found,'found, and follows');
  gen(q.fx,q.fz);toPL(q.fx,q.fz);elfTaskTick();elfLost.x=PL.x+1;elfLost.z=PL.z;elfTaskTick();info('brought home',!EF.q);assert(!EF.q,'the lost one led home');for(const f of [...foes])removeFoe(f);}
// ---- wardens at the border
{const P=eCity.prov,[X,Z]=at(eCity,-eCity.R-40,0);gen(X,Z);toPL(X,Z);elfProv='x';elfMet.clear();playing=true;elfBorder();const W0=elfWard;playing=false;
  info('at the border of',P.kingdom.name,': wardens',W0?W0.G.map(f=>FOES[f.kind].n).join(', '):'none');assert(W0&&W0.G.length===2,'wardens come out to meet one who comes into an elven realm');
  for(const f of W0.G){f.x=PL.x+1;f.z=PL.z;}TO.length=0;elfWardTick();info('hailed:',TO[TO.length-1]);assert(!elfWard&&/Welcome home|guest|stranger/i.test(TO.join(' ')),'and hail them by their standing');for(const f of [...foes])removeFoe(f);}
// ---- a steed and the whistle; a great elk of the wood
{for(const a of [...animals])removeAnimal(a);const msg=elfSteedAsk({},'e'),s=elfSteedOf();info('at the stables:',msg);assert(s&&s.kind==='ehorse'&&s.tame&&countOf(429)>=1,'a friend of the high elves is given an elven horse and a whistle');
  s.x=PL.x+30;s.z=PL.z;elfWhistle();for(let i=0;i<200;i++){stepAnimal(s,0.05);}info('whistled: it comes within',Math.hypot(s.x-PL.x,s.z-PL.z).toFixed(1));assert(Math.hypot(s.x-PL.x,s.z-PL.z)<6,'the whistle calls the steed');
  assert(ANIMALS.ehorse.gallop>ANIMALS.horse.run+5&&ANIMALS.elk.leap>11,'the elven horse is the fastest steed, the great elk leaps high');for(const a of [...animals])removeAnimal(a);
  EF.w=40;const m2=elfSteedAsk({},'w');assert(elfSteedOf()&&elfSteedOf().kind==='elk','a friend of the wood elves is given a great elk');for(const a of [...animals])removeAnimal(a);}
// ---- the swan boat
{let hv=null;seen.clear();for(let i=-25;i<25&&!hv;i++)for(let j=-25;j<25&&!hv;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='elf')continue;hv=provinceOf(c.i,c.j).sites.find(s=>s.k==='haven');}
  const L=siteLayout(hv),[X,Z]=at(hv,L.qL+8,0);gen(X,Z);let wy=SEA;while(!isWetId(B(X,wy,Z))&&wy>SEA-6)wy--;const b=addAnimal('swanboat',X-OX+0.5,wy+0.65,Z-OZ+0.5,{tame:true,st:'idle',t:9});
  mount(b);const x0=PL.x,z0=PL.z,[fx,fz]=siteXZ(hv,1,0).map((v,i)=>v-(i?hv.Z:hv.X));for(let i=0;i<60;i++)boatStep(0.05,fx,fz,true);const moved=Math.hypot(PL.x-x0,PL.z-z0),onW=isWetId(get(Math.floor(PL.x),Math.floor(PL.y-0.65),Math.floor(PL.z)));
  for(let i=0;i<600;i++)boatStep(0.05,-fx,-fz,true);const stillW=isWetId(get(Math.floor(PL.x),Math.floor(PL.y-0.65),Math.floor(PL.z)));dismount();const land=!isWetId(get(Math.floor(PL.x),Math.floor(PL.y),Math.floor(PL.z)))&&SOLID[get(Math.floor(PL.x),Math.floor(PL.y)-1,Math.floor(PL.z))];
  info('the swan boat: rowed',moved.toFixed(1),'blocks on the water',onW,'; toward the quay it stops on the water',stillW,'; stepping out onto land',land);assert(moved>8&&onW&&stillW&&land,'a swan boat carries the player over the water, never onto land, and they step out onto the shore');removeAnimal(b);}
// ---- the cloak, the lantern, a bow
{equip.body={id:424,d:0};const h=cloakHide();equip.body=null;equip.belt={id:421,d:0};const lm=lampLevel();equip.belt=null;info('the warden\'s cloak hides to',h,'of sight; the starglass lantern',JSON.stringify(lm));
  assert(h===0.5&&lm[0]===1&&lm[1]>=20,'the warden\'s cloak hides the wearer from the wastes; the starglass lantern shines without oil');
  const f=addFoe('elord',PL.x+2,PL.y,PL.z,{site:eCity,prov:eCity.prov.key});EF.e=80;const g=elfGreet(f,FOES[f.kind]);info('a trusted friend is greeted:',g,'; bowing',f.bow>foeClock);assert(g&&f.bow>foeClock,'the elves bow to a trusted friend');removeFoe(f);}
setMode('creative');reset();
