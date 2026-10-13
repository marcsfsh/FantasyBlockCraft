// Standing with the riders (D-090): its ranks and their gifts; their tongue (words of our own) and greetings; trade for coin;
// horses bought, tended, shod, barded and named (and kept so through a save); the smith; justice (a blow and its amends, a
// slaying and banishment); the riders' tasks (the war-arrow carried in time or too late, a strayed horse led home, a bounty,
// supplies, a boast worth twice as much); the war-horn and the riding; horse stones, picture stones, skeps; the songs of the
// kings and the journal; the ruins of the forefathers in the discovery log; the peace of the golden hall.
setMode('survival');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const B=(X,Y,Z)=>get(X-OX,Y,Z-OZ);const TO=[];toast=m=>{if(m)TO.push(m);};let shown=null;showText=(t,x)=>{shown=[t,x];};
const reset=()=>{RH.r=0;RH.sw=0;RH.th='';RH.g=0;RH.q=null;RH.sg=[];RH.sgn={};RH.au={};RH.out={};for(let i=0;i<inv.length;i++)inv[i]=null;};
const at=(s,u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[X-OX+W*(Z-OZ)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();};
reset();
const seen=new Set();let city=null,P0=null;
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='horse')continue;const P=provinceOf(c.i,c.j);
  if(!city){city=P.sites.find(s=>s.k==='city'&&['market','smithy','stable','leech','scop'].every(q=>siteLayout(s).spots.some(p=>p.kind===q)));if(city)P0=P;}}
const spot=(s,k)=>{const p=siteLayout(s).spots.find(q=>q.kind===k),[X,Z]=at(s,p.u,p.v);return [X,Z,p.y];};
const folkAt=(s,k,kind)=>{const [X,Z,y]=spot(s,k);gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();return foes.find(f=>!f.dead&&(kind?f.kind===kind:f.spk==='h_'+k));};
// ---- ranks and gifts; the tongue
{assert(riderRank()===0&&riderRankName()==='Stranger','a stranger to the riders at first');riderGain(12,null);riderRankUp(1);const oc=countOf(448);riderGain(20,null);riderRankUp(2);
  info('standing',RH.r,'(',riderRankName(),'); oatcakes given',oc,'; honey',countOf(447));assert(riderRank()===2&&oc>=3&&countOf(447)>=2,'standing rises through the ranks, each with its gift');
  RH.r=200;assert(riderRank()===3,'no one is a sworn rider but by the oath');RH.sw=1;assert(riderRank()===4,'a sworn rider once the oath is sworn');RH.r=300;assert(riderRank()===5,'a sworn rider of great standing is a thane');RH.sw=0;RH.r=32;
  const words=RIDER_TONGUE.flatMap(t=>t[0].replace(/[!,]/g,'').split(' '));info('their tongue:',RIDER_TONGUE.slice(0,3).map(t=>t[0]+' ('+t[1]+')').join('; '));
  assert(RIDER_TONGUE.length>=10&&words.every(w=>!isBlockedName(w)),'the riders\' tongue: words of our own, none of them blocked');}
// ---- speaking with them; trade
{const m=folkAt(city,'market');assert(!!m,'folk keep the market');riderTalk(m);assert(invOpen,'speaking with one of them opens what they will say and do');closeInv();
  const g=riderGreet(m,FOES[m.kind]);info('a hall-friend is greeted:',g);
  addItem(204,10);const n0=countOf(449),p0=purse(),r=riderBuy(449,4,2),p1=purse();addItem(352,4);const r2=riderSell(352,3,4),p2=purse();
  info('trade:',r,'; purse',p0,'->',p1,';',r2,'; purse',p2);assert(p1===p0-riderPrice(4)*2&&p2===p1+riderOffer(3)*4&&countOf(449)===n0+2,'the riders trade for coin, buying and selling');}
// ---- horses: bought, tended, shod, barded, named; kept so through a save
{const l=folkAt(city,'leech','hleech');assert(!!l,'a horse-healer keeps the stables');addItem(205,3);
  const h=riderLeadOut('horse',3);info('a dun from the dealer:',AM_KINDS.horse.coats[h.ci][0].name);assert(h.tame&&AM_KINDS.horse.coats[h.ci][0].name==='dun','the horse-dealer sells horses of the plains');
  h.hp=2;const r0=riderTend(0);const p0=purse(),r1=riderTend(1);info(r0,'|',r1,'; shod',h.shod,'; paid',p0-purse());assert(h.hp===ANIMALS.horse.hp&&h.shod===1&&p0-purse()===6,'the horse-healer tends your horse and shoes it');
  riderBuy(452,60,1);sel=inv.findIndex(q=>q&&q.id===452);useBarding();PL.ride=h;const cut=armourCut(9);PL.ride=null;const cut0=armourCut(9);info('barded:',h.bard,'; a blow of 9 to its rider',cut,'(unbarded',cut0,')');assert(h.bard===1&&cut<cut0,'barding put on your horse takes a third off the blows its rider takes');
  const nm=riderNameHorse();info(nm);assert(h.nm&&!isBlockedName(h.nm),'the herds name your horse');
  const rec=wildRec(h),nm0=h.nm;removeAnimal(h);wildPending.push(rec);wildRestore();const h2=animals.find(a=>a.uid===rec[5]);info('after a save: shod',h2&&h2.shod,'barded',h2&&h2.bard,'named',h2&&h2.nm);
  assert(h2&&h2.shod===1&&h2.bard===1&&h2.nm===nm0,'a horse keeps its shoes, its barding and its name through a save');
  const s=folkAt(city,'smithy');inv[0]={id:450,c:1,d:300};const r5=menMend();info('the smith:',r5);assert(inv[0].d===0,'the riders\' smiths mend arms and tools');}
// ---- justice
{const g=folkAt(city,'market'),r0=RH.r;riderStruck(g);assert(RH.r<r0,'striking the riders\' folk costs standing');
  riderSlain(g);info('slew one: banished',riderOutlaw(g),'; the folk turn on the player',folkWrath(g));assert(riderOutlaw(g)&&folkWrath(g),'whoever slays one of their folk is banished from the kingdom');
  addItem(205,3);const r=riderAmends(g);info(r);assert(!riderOutlaw(g)&&!folkWrath(g),'the blood-price paid ends the banishment');RH.r=40;}
// ---- the riders' tasks
{const s=city;RH.q=null;const q=riderTaskGive(s,'arrow');info('the war-arrow:',q.n,'; carrying it',countOf(460));assert(q&&countOf(460)===1,'a task: the war-arrow given to carry');
  const r0=RH.r;gen(q.X,q.Z);toPL(q.X,q.Z);riderTaskTick();info('at',q.tn,': task done',!RH.q,'; standing',r0,'->',RH.r);assert(!RH.q&&countOf(460)===0&&RH.r>r0,'the war-arrow carried in time');
  const q2=riderTaskGive(s,'arrow');toPL(s.X,s.Z);RH.pt+=q2.lim+1;TO.length=0;riderTaskTick();info(TO.join(' | '));assert(!RH.q&&countOf(460)===0&&TO.some(m=>/too late/i.test(m)),'too late with the war-arrow, the task is lost');
  const q3=riderTaskGive(s,'stray');gen(q3.X,q3.Z);toPL(q3.X,q3.Z);riderTaskTick();const st=riderStray;assert(!!st,'the strayed horse is out there');toPL(Math.floor(st.x+OX),Math.floor(st.z+OZ));riderTaskTick();
  info('found',q3.who,': following',st.st,'tame',st.tame);assert(q3.found&&st.st==='follow','a strayed horse found takes the halter and follows');st.x=q3.fx-OX;st.z=q3.fz-OZ;riderTaskTick();assert(!RH.q&&!animals.includes(st),'the strayed horse led home');
  const q4=riderTaskGive(s,"bounty"),nb=q4.c;for(let i=0;i<nb;i++)riderSlain({kind:'raider',x:PL.x,z:PL.z});assert(riderTaskReady(q4),'the bounty earned');riderTaskDone();
  const q5=riderTaskGive(s,'supply',0,1);info('a boast:',q5.n,'; reward',q5.rw);addItem(q5.it,q5.need);assert(q5.boast&&riderTaskReady(q5),'a boast is a task');const p0=purse();riderTaskDone();assert(purse()-p0===q5.rw&&q5.rw===2*(12+q5.need*2),'a boast made good is paid twice');}
// ---- the war-horn and the riding
{toPL(city.X,city.Z);clear();TO.length=0;RH.hn=-1e9;riderHorn();info(TO.join(' | '));assert(TO.some(m=>/sworn rider/.test(m)),'the war-horn answers only a sworn rider');
  RH.sw=1;RH.r=150;RH.hn=-1e9;const [X,Z]=[P0.cx|0,P0.cz|0];gen(city.X,city.Z);toPL(city.X+20,city.Z+20);clear();riderHorn();const R=foes.filter(f=>(f.kind==='hrider'||f.kind==='hcapt')&&f.aid>MN.pt);
  info('a riding answers the horn:',R.length);assert(R.length>=6,'a sworn rider\'s war-horn calls a riding');RH.sw=0;RH.r=40;clear();}
// ---- horse stones, picture stones, skeps
{const rd=city.prov.roads.find(r=>r.k==='high'&&r.len>100);const [X,Z]=[Math.round((rd.a[0]+rd.b[0])/2),Math.round((rd.a[1]+rd.b[1])/2)];gen(X,Z);let hs=null;
  for(let dx=-90;dx<=90&&!hs;dx++)for(let dz=-90;dz<=90&&!hs;dz++){const x=X-OX+dx,z=Z-OZ+dz;if(x<0||z<0||x>=W||z>=D)continue;for(let y=SEA-10;y<SEA+100;y++)if(world[I(x,y,z)]===HSTONE){hs=[x,y,z];break;}}
  shown=null;useHorseStone(...hs);info('a horse stone:',shown&&shown[1]);assert(shown&&/paces/.test(shown[1]),'a horse stone tells the road and the distance to its places');
  const v=city.prov.sites.find(q=>q.k==='village'&&q.R>=24)||P0.sites.find(q=>q.k==='farm');gen(v.X,v.Z);let sk=null;for(let dx=-v.R-6;dx<=v.R+6&&!sk;dx++)for(let dz=-v.R-6;dz<=v.R+6&&!sk;dz++){const x=v.X-OX+dx,z=v.Z-OZ+dz;for(let y=SEA-10;y<SEA+80;y++)if(world[I(x,y,z)]===SKEP){sk=[x,y,z];break;}}
  const h0=countOf(447);useSkep(...sk);const h1=countOf(447);useSkep(...sk);info('honey from a skep:',h0,'->',h1,'->',countOf(447));assert(h1===h0+1&&countOf(447)===h1,'a skep gives honey once a day');}
// ---- the songs of the kings; the journal
{const c=folkAt(city,'scop');assert(!!c&&c.kind==='hscop','a lay-singer in the golden hall');shown=null;riderSong(city,true);info(shown&&shown[0]);assert(shown&&RH.sg.length===1,'the lay-singer sings a song of the kings');
  for(let i=0;i<8;i++)riderSong(city,true);const out=[];riderJournal(out);info(out.slice(0,4).join(' / '));assert(RH.sg.length===8&&out.some(l=>/The Coming out of the North/.test(l))&&out.every(l=>!/undefined/.test(l)),'the songs are kept in the journal');
  const K=riderKings(city.prov.kingdom.key);assert(K.every(n=>!isBlockedName(n)),'the kings\' names are our own');}
// ---- the forefathers' ruins found
{let o=null;for(let i=-90;i<90&&!o;i++)for(let j=-90;j<90&&!o;j++){const q=fathersAt(i,j);if(q&&q.name)o=q;}gen(o.X,o.Z);toPL(o.X,o.Z);const r0=RH.r;riderT=0;riderFrame(0.01);info(o.name,': in the discovery log',JN.d.g.includes(o.name),'; standing',r0,'->',RH.r);
  assert(JN.d.g.includes(o.name)&&RH.r===r0+2,'a ruin of the forefathers found is written in the discovery log');
  let ps=null;const pp=[];for(let i=-90;i<90&&!ps;i++)for(let j=-90;j<90&&!ps;j++){const q=fathersAt(i,j);if(q&&(q.kind==='ship'||q.kind==='stones'))ps=q;}if(ps){gen(ps.X,ps.Z);for(let dx=-14;dx<=14&&!pp.length;dx++)for(let dz=-14;dz<=14&&!pp.length;dz++)for(let y=ps.g-2;y<ps.g+6;y++)if(B(ps.X+dx,y,ps.Z+dz)===PICSTONE){pp.push(ps.X+dx-OX,y,ps.Z+dz-OZ);break;}
    shown=null;usePicStone(...pp);info('a picture stone:',shown&&shown[1].slice(0,60));assert(shown&&/ship/.test(shown[1]),'a picture stone shows what is carved on it');}}
// ---- the peace of the golden hall
{const s=city.prov.capital?city:city,L=siteLayout(s),H=L.hall,[X,Z]=at(s,(H.u0+H.u1)>>1,1);gen(X,Z);toPL(X,Z,H.y+1);clear();const [x,y,z]=[PL.x+1,H.y+1,PL.z];const g=addFoe('hdoor',x,y,z,{site:s,prov:s.prov.key,st:'idle',t:9});
  const hp0=g.hp;TO.length=0;foeStruck(g,6,1,0);info('a blow in the golden hall:',TO.join(' | '),'; its health',hp0,'->',g.hp,'; wrath',folkWrath(g));assert(g.hp===hp0&&!folkWrath(g)&&TO.some(m=>/golden hall/.test(m)),'no blade is drawn in the golden hall');
  toPL(s.X+s.R+20,s.Z);foeStruck(g,6,1,0);assert(g.hp<hp0,'outside the hall a blow lands');realmWrath.clear();RH.out={};clear();}
setMode('creative');
