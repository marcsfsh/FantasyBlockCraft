// Sworn to the alliance (W4, D-071): a spectator until sworn; the oath before a lord of the hosts at a gate, the first rank and
// the quartermasters' gifts; merit raising the rank, proclaimed, with better arms; the squad that comes and follows; the stores
// at the wagons, once in ten minutes; fallen at war, carried to the field hospital with one's things; named by deeds after
// fighting beside the hosts; a battle won near adds merit; saved; in the journal.
setMode('survival');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),g=P.hG,at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(u,v)=>{const [x,z]=at(u,v);PL.x=x-OX+0.5;PL.z=z-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;};
const [X,Z]=at(P.uC0+100,0);gen(X,Z);toPL(P.uC0+100,0);playing=false;
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();};clear();warS.clear();warArmies.length=0;WARS.clear();warPlay=0;warClk=1e9;
inv.fill(null);for(const k in equip)equip[k]=null;SW={on:0,r:0,m:0,p:0,k:0,b:0,sup:-1e9,t:0};
const has=id=>inv.some(q=>q&&q.id===id);
assert(!warSworn(),'a spectator until sworn');
// the oath: using a lord of the hosts at the gate's camp
{PL.yaw=0;PL.pitch=0;const lx=PL.x,lz=PL.z-2.2,ly=foeStand(lx,PL.y+2,lz,2),L=addFoe('rnoble',lx,ly,lz,{site:s,prov:'wg:'+P.id});L.yaw=Math.PI;
  const ok=warOathAct();info('the oath:',ok,'; sworn',warSworn(),'; rank',WAR_RANKS[SW.r][0],'; gifts: copper sword',has(372),', hide jerkin',has(380),', bread',has(206));
  assert(ok&&warSworn()&&SW.r===0&&has(372)&&has(380)&&has(206),'using a lord of the hosts swears the oath: Levy of the Hosts, with a sword, a jerkin and bread from the quartermaster');clear();}
// merit: the rank rises, with better arms
{warMerit(30);info('merit',SW.m,'; rank',WAR_RANKS[SW.r][0],'; iron sword',has(374),', iron mail',has(381));assert(SW.r===2&&has(374)&&has(381),'merit raises the rank, proclaimed, and the quartermasters give better arms');}
// the squad: it comes and follows
{gen(...at(P.uL+20,40));toPL(P.uL+20,40);let n=0;for(let k=0;k<40;k++){warFolT[1]=0;warSquadTick();run(0.5);n=foes.filter(f=>f.follow&&!f.dead).length;if(n>=4)break;}
  const [x2,z2]=at(P.uL+5,40);PL.x=x2-OX+0.5;PL.z=z2-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;
  for(let k=0;k<30;k++){warSquadTick();run(0.5);}const near=foes.filter(f=>f.follow&&!f.dead&&Math.hypot(f.x-PL.x,f.z-PL.z)<9).length;
  info('the squad: came',n,'; near after the player moved 15',near);assert(n===4&&near>=3,'a Sergeant\'s squad of four comes and follows');clear();}
// the stores at the wagons
{gen(...at(P.uC0+100,0));const L=s.lay.parts.filter(p=>p.k==='lgwagon');let u=0,v=0;for(const p of L){u+=(p.u0+p.u1)/2;v+=(p.v0+p.v1)/2;}toPL(u/L.length,v/L.length);
  const b0=inv.filter(q=>q&&q.id===206).reduce((a,q)=>a+q.c,0);warStores(P);const b1=inv.filter(q=>q&&q.id===206).reduce((a,q)=>a+q.c,0);warStores(P);const b2=inv.filter(q=>q&&q.id===206).reduce((a,q)=>a+q.c,0);
  info('the stores: bread',b0,'->',b1,'->',b2,'; flares',has(326));assert(b1===b0+4&&b2===b1&&has(326),'the stores give food and flares at the wagons, once in ten minutes');}
// fallen at war: carried to the field hospital, with one's things
{toPL(40,0);const n0=inv.filter(Boolean).length;die('orc');const woke=!!warWake;revive();const [hx,hz]=warHosp(P),d=Math.hypot(PL.x+OX-hx,PL.z+OZ-hz);
  info('fallen: carried',woke,'; woke',d.toFixed(1),'from the hospital; things',n0,'->',inv.filter(Boolean).length,'; graves',graves.size);
  assert(woke&&d<4&&inv.filter(Boolean).length===n0,'fallen while sworn at war, the player wakes in the field hospital with their things');}
// named by deeds: ten of the wastes slain beside the hosts
{gen(...at(P.uL+20,0));toPL(P.uL+20,0);SW={on:0,r:0,m:0,p:0,k:0,b:0,sup:-1e9,t:0};const y=PL.y;addFoe('rspear',PL.x+3,y,PL.z,{});for(let i=0;i<10;i++){const o=addFoe('raider',PL.x+1,y,PL.z+1,{});foeSlain(o);}
  info('by deeds: sworn',warSworn(),'; rank',WAR_RANKS[SW.r][0]);assert(warSworn()&&SW.r===0,'ten of the wastes slain beside the hosts: named to the alliance by deeds');clear();}
// a battle won near adds merit; saved; in the journal
{const A={P:P,al:true,m:[],C:[]};const m0=SW.m;warSwornBattle(A);const sv=JSON.parse(JSON.stringify(warSwornSave()));const out=[];warJournal(out);
  info('a battle: merit',m0,'->',SW.m,'; saved',JSON.stringify(sv).slice(0,60),'; journal',out[out.indexOf('YOUR PART')+1]);
  assert(SW.m===m0+3&&SW.b===1&&sv.sw.on===1&&out.some(l=>/^Levy of the Hosts, sworn/.test(l)),'a battle won near adds merit; the oath is saved and in the journal');}
