// Custom hosts (D-077): in creative a host of thousands, of the alliance or of the wastes, comes in rank by rank behind the player
// and is led: it follows the way they go, holds, marches to where they look, looses a volley and charges; a host summoned against
// the player forms where they look and fights; the crowd afar is drawn in instances and the nearest whole; hosts go when dismissed
// or when the player leaves creative; the orders have keys.
setMode('creative');
const gen=()=>{while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const clear=()=>{hostDismiss(null);for(const f of [...foes])removeFoe(f);foeSpots.clear();};
const fwd=()=>[-Math.sin(PL.yaw),-Math.cos(PL.yaw)];
const put=(x,z)=>{PL.x=x;PL.z=z;PL.y=ground[Math.floor(x)+W*Math.floor(z)]+1;};
// open ground: the heart of a stretch of the Golden Steppe
const t=landTour(LANDS.findIndex(L=>/Golden Steppe/.test(L.n)));gen();PL.pitch=-0.05;PL.yaw=0;playing=false;warClk=1e9;clear();
info('the steppe at',t&&t.X,t&&t.Z);
// the keys
assert(['warConsole','hostFollow','hostHold','hostMarch','hostCharge','hostVolley'].every(a=>ACTIONS[a]&&ACTIONS[a].crea)&&BINDS.keys.KeyK==='warConsole'&&BINDS.keys.KeyG==='hostFollow'&&BINDS.keys.KeyC==='hostCharge',
  'the war console and the orders to a host have their keys (K; G follow, Y hold, P march, C charge, O volley)');
// a host of 2000 of the alliance comes in, rank by rank, behind the player
WC.hb.al=hostMake('al',2000);const A=wcSummon('al',true);let frames=0;run(30,()=>{frames++;return !A.q.length;});
{const L=hostLive(A),[fx,fz]=fwd(),behind=L.filter(f=>(f.x-PL.x)*fx+(f.z-PL.z)*fz<0).length,kinds=new Set(L.map(f=>f.kind)),inPlace=L.filter(f=>{const [x,z]=hostSlotAt(A,f);return Math.hypot(f.x-x,f.z-z)<2;}).length;
  info('summoned',A.N,'; in the field',L.length,'(no footing for',A.lost||0,') after',frames,'frames ; behind the player',behind,'; in their places',inPlace,'; kinds',kinds.size);
  assert(A.N===2000&&L.length>=1500&&behind>=L.length*0.95&&inPlace>=L.length*0.9&&kinds.size>=20&&L.some(f=>f.kind==='rcapt')&&L.some(f=>f.kind==='rstd'),'a host of 2000 of the alliance comes in rank by rank behind the player, captains and standards among its companies');
  const S=hostSlots(L.map(f=>f.kind)),front=S.filter(q=>q[2]===0&&!FOES[q[0]].mount).map(q=>FOES[q[0]]),wings=S.filter(q=>FOES[q[0]].mount),arch=S.filter(q=>FOES[q[0]].shot&&!FOES[q[0]].mount);
  const inf=S.filter(q=>!FOES[q[0]].shot&&!FOES[q[0]].mount&&!FOES[q[0]].civ&&!FOES[q[0]].std&&!FOES[q[0]].bear);
  info('its ranks: front rank',front.length,'(pikes',front.filter(F=>F.pike).length+') ; archers behind from',Math.max(...arch.map(q=>q[2])).toFixed(1),'; horsemen on the wings beyond',Math.min(...wings.map(q=>Math.abs(q[1]))).toFixed(1));
  assert(front.length>=10&&front.every(F=>!F.shot&&!F.mount)&&Math.max(...arch.map(q=>q[2]))<Math.min(...inf.map(q=>q[2]))+0.01&&Math.min(...wings.map(q=>Math.abs(q[1])))>Math.max(...inf.map(q=>Math.abs(q[1]))),
    'in its ranks: blades and pikes in front, archers behind them, horsemen on the wings');}
// the crowd: those afar drawn as instances of their kind, the nearest whole
{const L=hostLive(A),far=L.filter(f=>f.far).length,whole=L.filter(f=>!f.far).length;info('drawn: whole',whole,'; afar',far,'; instances',crowdCount(),'in',CROWD.size,'batches ; the whole within',foeLodR.toFixed(1));
  assert(whole<=FOE_WHOLE*2&&far>=L.length-FOE_WHOLE*2&&crowdCount()>0,'in so great a crowd only the nearest are drawn whole, the rest as instances of their kind');}
// it follows the way the player goes
{const [fx,fz]=fwd();put(PL.x+fx*36,PL.z+fz*36);run(40);const L=hostLive(A),[mx,mz]=hostMid(A),ahead=(mx-PL.x)*fx+(mz-PL.z)*fz,ok=L.filter(f=>{const [x,z]=hostSlotAt(A,f);return Math.hypot(f.x-x,f.z-z)<3;}).length;
  info('the player went 36 on: the host\'s middle',ahead.toFixed(1),'from them along the way ; back in their places',ok,'of',L.length);assert(A.cmd==='follow'&&ahead<-5&&ahead>-45&&ok>=L.length*0.75,'a led host follows behind the player the way they go');}
// it holds where it stands
{hostCommand('hold');const [ax,az]=hostMid(A),[fx,fz]=fwd();put(PL.x+fx*30,PL.z+fz*30);run(20);const [bx,bz]=hostMid(A);info('holding: its middle moved',Math.hypot(bx-ax,bz-az).toFixed(1));
  assert(A.cmd==='hold'&&Math.hypot(bx-ax,bz-az)<3,'ordered to hold, it holds where it stands');}
// it marches to where the player looks
{PL.yaw+=Math.PI/2;PL.pitch=-0.2;const [X,Z]=hostLook(60);hostCommand('march');run(70);const L=hostLive(A),ok=L.filter(f=>{const [x,z]=hostSlotAt(A,f);return Math.hypot(f.x-x,f.z-z)<3;}).length;
  const fr=L.filter(f=>f.sb===0),fm=fr.reduce((a,f)=>[a[0]+f.x/fr.length,a[1]+f.z/fr.length],[0,0]),d=Math.hypot(fm[0]+OX-X,fm[1]+OZ-Z);
  info('marched to',Math.round(X),Math.round(Z),': its front rank\'s middle',d.toFixed(1),'from there ; in their places',ok,'of',L.length);assert(A.cmd==='march'&&d<10&&ok>=L.length*0.75,'ordered to march, it marches to where the player looks');PL.yaw-=Math.PI/2;}
// a host of the wastes against the player, where they look
{const PX=PL.x+OX,PZ=PL.z+OZ;regenerateAll(Math.round(PX),Math.round(PZ));gen();put(PX-OX,PZ-OZ);} // (the loaded world about the player again, as in the game)
WC.hb.o=hostMake('o',1000);PL.pitch=-0.02;const B=wcSummon('o',false);run(15,()=>!B.q.length);
{const L=hostLive(B),[mx,mz]=hostMid(B),d=Math.hypot(B.ax-OX-PL.x,B.az-OZ-PL.z),face=Math.abs(angTo(B.face,Math.atan2(PL.x+OX-B.ax,PL.z+OZ-B.az)));
  info('against the player:',L.length,'of',B.N,'formed',d.toFixed(0),'blocks off, facing them within',face.toFixed(2),'; kinds',[...new Set(L.map(f=>f.kind))].length,'; then',B.cmd);
  assert(L.length>=700&&d>=30&&face<0.6&&L.some(f=>f.kind==='ochief')&&L.some(f=>f.kind==='troll'||f.kind==='strollr'),'a host of the wastes summoned against the player forms where they look, facing them');}
// the volley and the charge
{const [mx,mz]=hostMid(A);
  // bring the two within bowshot: the enemy advances on the player's host
  hostOrder(B,'advance');run(60,()=>{const [x,z]=hostMid(B);return Math.hypot(x-mx,z-mz)<55;});
  const v=hostVolley(A);run(2);const shots0=shots.length;info('a volley:',v,'archers loose ; shots in the air',shots0);assert(v>=20,'at the order a volley: the host\'s archers loose together at the foe within bowshot');
  const a0=hostLive(A).length,b0=hostLive(B).length;hp=20;hostCommand('charge');let fights=0;
  run(150,()=>{fights=Math.max(fights,foes.filter(f=>!f.dead&&f.hst&&f.foe&&!f.foe.dead).length);return !hostLive(B).length||!hostLive(A).length;});
  const a1=hostLive(A).length,b1=hostLive(B).length;info('the charge: yours',a0,'->',a1,'; theirs',b0,'->',b1,'; fighting at once at most',fights,'; the player',hp);
  assert(fights>200&&(b0-b1)>=b0*0.6&&a1<a0&&hp===20,'ordered to charge, the host falls on the foe: hundreds fight at once, the field is won with losses, the player in creative untouched');}
// dismissed; and gone when the player leaves creative
{hostDismiss(null);run(1);info('dismissed: hosts',HOSTS.length,'; their soldiers left standing',foes.filter(f=>f.hst&&!f.dead).length);assert(!HOSTS.length&&!foes.some(f=>f.hst&&!f.dead),'dismissed, a host goes');
  WC.hb.al=hostMake('al',100);const C=wcSummon('al',true);run(2);const n=hostLive(C).length;setMode('survival');run(0.2);info('a host of',n,'(no footing for',(C.lost||0)+') ; in survival: hosts',HOSTS.length);
  assert(n>=60&&!HOSTS.length&&!foes.some(f=>f.hst&&!f.dead),'summoned hosts belong to creative: they go when the player leaves it');setMode('creative');}
// the most at once
{WC.hb.al=hostMake('al',HOST_MAX);const C=wcSummon('al',true),D2=wcSummon('al',true);info('the most at once',HOST_MAX,': a first host of',C&&C.N,'; another',D2?D2.N:'refused');
  assert(C&&C.N===HOST_MAX&&!D2&&hostMake('o',777).oarmy>0&&Object.values(hostMake('o',777)).reduce((a,b)=>a+b,0)===777,'no more than '+HOST_MAX+' summoned at once');hostDismiss(null);}
clear();
