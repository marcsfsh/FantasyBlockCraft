// Morale and the line (W8b, D-078): soldiers outnumbered, hurt and watching their fellows fall rout and run from the other side,
// then rally once clear; standards and captains hold them; a host with a third running breaks; the hosts' formations (shield wall,
// wedge, square, loose order) and what each gives; the weight of a mounted charge; the wounded, mended by healers or by the player,
// or dying; war hounds that run down and bite; the warhost's banner taken as a trophy; the Horn of the Hosts.
setMode('creative');
const gen=()=>{while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const clear=()=>{hostDismiss(null);for(const f of [...foes])removeFoe(f);foeSpots.clear();MOR_D.clear();};
const t=landTour(LANDS.findIndex(L=>/Golden Steppe/.test(L.n)));gen();PL.pitch=-0.05;PL.yaw=0;playing=false;warClk=1e9;clear();
const add=(k,x,z,o)=>{const y=foeStand(x,ground[Math.floor(x)+W*Math.floor(z)]+2,z,FOES[k].tall||2);return addFoe(k,x,y>0?y:PL.y,z,Object.assign({st:'idle',t:99,hold:1},o||{}));};
const cx=PL.x+12,cz=PL.z-20,mid=L=>[L.reduce((a,f)=>a+f.x,0)/L.length,L.reduce((a,f)=>a+f.z,0)/L.length];
const band=(k,n,x,z,w,o)=>{const L=[];for(let i=0;i<n;i++)L.push(add(k,x+(i%w)*1.4,z+Math.floor(i/w)*1.4,o));return L;};
const dead=(k,n,x,z)=>{for(let i=0;i<n;i++)morDeath({x:x,z:z,kind:k});};
// the new hands and things
{const ok=FOES.obanner&&AM_KINDS[FOES.obanner.m]&&FOES.rhound&&AM_KINDS[FOES.rhound.m]&&HOST_UNITS.al.some(u=>u[0]==='hd')&&HOST_UNITS.o[0][4]==='obanner'&&hostMake('al',100).hd>0;
  info('banner bearers of the warhosts, war hounds of the hosts; the horn',ITEMS[414]&&ITEMS[414].n,'; the banner',BL[OBANNER]&&BL[OBANNER].n);
  assert(ok&&ITEMS[414]&&itemIcon(414)&&RECIPES.some(r=>r[0]===414)&&BL[OBANNER]&&ACTIONS.hostForm&&BINDS.keys.Digit0==='hostForm','the banner bearer, the war hound, the Horn of the Hosts, the trophy banner and the formation key exist');}
// a rout: orcs hurt, outnumbered and seeing their fellows fall run from the folk and strike no one; the folk stand
{const O=band('raider',8,cx,cz,4),Fk=band('rsword',40,cx+5,cz-4,8);for(const f of O)f.hp=Math.round(f.mhp*0.4);dead('raider',6,cx+2,cz+1);run(5);
  const r=O.filter(f=>f.rout).length,rf=Fk.filter(f=>f.rout).length;info('the orcs routing',r,'of',O.length,'; their fear',(O.reduce((a,f)=>a+f.fear,0)/O.length).toFixed(2),'; the folk routing',rf);
  assert(r>=6&&rf===0,'hurt, outnumbered and with their fellows fallen about them, the orcs rout; the folk stand');
  const Rr=O.filter(f=>f.rout),[ax,az]=mid(Rr),[fx,fz]=mid(Fk),d0=Math.hypot(ax-fx,az-fz),hp0=Fk.reduce((a,f)=>a+f.hp,0);for(const f of Rr)f.hold=0;run(4);const [bx,bz]=mid(Rr),d1=Math.hypot(bx-fx,bz-fz);
  info('they run: from',d0.toFixed(1),'to',d1.toFixed(1),'from the folk ; the folk struck',hp0-Fk.reduce((a,f)=>a+f.hp,0));assert(d1>d0+8&&Fk.reduce((a,f)=>a+f.hp,0)===hp0,'routing, they run from the other side and strike no one');
  for(const f of Fk)removeFoe(f);const ok=run(16,()=>Rr.every(f=>!f.rout));info('clear of the foe, all rallied',ok,'; then',Rr.map(f=>f.st).join(' '));assert(ok,'clear of the foe and their hearts back, they rally');clear();}
// standards and captains: a banner among them holds their hearts; a captain calls the running back
{const fear=ban=>{MOR_D.clear();const O=band('raider',8,cx,cz,4);if(ban)O.push(add('obanner',cx+2,cz+0.7));band('rsword',24,cx+5,cz-4,8);for(const f of O)f.hp=Math.round(f.mhp*0.6);dead('raider',3,cx+2,cz+1);run(2.5);
    const L=O.filter(f=>f.kind==='raider'),v=L.reduce((a,f)=>a+f.fear,0)/L.length;clear();return v;};
  const a=fear(false),b=fear(true);info('the orcs\' fear: without a banner',a.toFixed(2),'; with one',b.toFixed(2));assert(b<a-0.1,'a banner of the warhost among them holds their hearts');
  const R=band('rsword',6,cx,cz,3);for(const f of R){f.hold=0;morRout(f,20);}const R2=band('rsword',6,cx+30,cz,3);for(const f of R2){f.hold=0;morRout(f,20);}add('rcapt',cx+1,cz+1);run(3);
  const back=R.filter(f=>!f.rout).length,back2=R2.filter(f=>!f.rout).length;info('running men called back by a captain',back,'of 6 ; with no captain',back2,'of 6');assert(back>=4&&back2===0,'a captain calls the running back');clear();}
// a host breaks: with a third of it running the rest waver
{WC.hb.o=hostMake('o',100);const H=wcSummon('o',false);run(6,()=>!H.q.length);const L=hostLive(H);for(const f of L.slice(0,38))morRout(f,30);let fr=0;
  const br=run(2,()=>{if(H.mor&&H.mor.broken){const S=L.filter(f=>!f.rout&&!f.dead&&morNerve(f)<9);fr=S.filter(f=>f.fear>=0.4).length/(S.length||1);return true;}});
  info('a host of',L.length,'with 38 running: broken',!!br,'; the rest wavering',fr.toFixed(2));assert(br&&fr>=0.5,'a host with a third of it running breaks, and the rest waver');clear();}
// the formations
{const K=[];for(let i=0;i<60;i++)K.push('rsword');for(let i=0;i<20;i++)K.push('rbow');for(let i=0;i<10;i++)K.push('rknight');for(let i=0;i<6;i++)K.push('rhound');
  const line=hostSlots(K),line2=hostSlots(K,'line'),sq=hostSlots(K,'square'),wall=hostSlots(K,'wall'),wedge=hostSlots(K,'wedge'),loose=hostSlots(K,'loose');
  const faces=new Set(sq.map(q=>Math.round((q[3]||0)*100))),gap=S=>{const f=S.filter(q=>q[0]==='rsword'&&q[2]===0).map(q=>q[1]).sort((a,b)=>a-b);let m=99;for(let i=1;i<f.length;i++)m=Math.min(m,f[i]-f[i-1]);return m;};
  const tip=wedge.filter(q=>q[0]==='rsword'&&q[2]===0).length,hd=line.filter(q=>q[0]==='rhound');
  info('the line',JSON.stringify(line)===JSON.stringify(line2),'; the square faces',faces.size,'; across the front: line',gap(line).toFixed(2),'wall',gap(wall).toFixed(2),'loose',gap(loose).toFixed(2),'; the wedge\'s point',tip,'; hounds before the line from',Math.min(...hd.map(q=>q[2])).toFixed(1));
  assert(JSON.stringify(line)===JSON.stringify(line2)&&faces.size===4&&gap(wall)<1.2&&gap(loose)>2.5&&tip===1&&hd.every(q=>q[2]>0),'ranks as before, a square facing four ways, a tight shield wall, loose order spread out, a wedge with one at its point, hounds before the line');
  // (on a levelled field behind the player, so that the ground does not stop them)
  {const y0=Math.floor(PL.y),bx=Math.floor(PL.x),bz=Math.floor(PL.z);for(let dz=-6;dz<=24;dz++)for(let dx=-16;dx<=16;dx++){for(let y=y0-3;y<y0;y++)setBlock(bx+dx,y,bz+dz,STONE);for(let y=y0;y<y0+6;y++)setBlock(bx+dx,y,bz+dz,AIR);ground[bx+dx+W*(bz+dz)]=y0-1;}PL.y=y0;}
  PL.yaw=0;WC.hb.al={r:80,hd:6};const H=wcSummon('al',true);run(12,()=>!H.q.length);hostCommand('hold');run(1);hostReform(H,'square');run(20);
  const L=hostLive(H),P=L.filter(f=>{const [x,z]=hostSlotAt(H,f);return Math.hypot(f.x-x,f.z-z)<2.5;}),inP=P.length,side=P.filter(f=>f.sf).length,out=P.filter(f=>f.sf&&Math.abs(angTo(f.yaw,H.face+f.sf))<0.6).length;
  info('a host of',L.length,'formed a square:',inP,'in their places ;',out,'of',side,'on the sides facing out');assert(H.form==='square'&&inP>=L.length*0.9&&side>=L.length*0.25&&out>=side*0.8&&L.every(f=>f.fm==='square'),'ordered into a square, the host forms one, its faces looking out');
  hostFormNext();info('the formation key: now',H.form);assert(H.form==='loose','the key turns the host to the next formation');clear();}
// what each formation gives, the horn's heart and the weight of a charge (blows and shots through warDmg)
{const g=add('rsword',cx,cz),a=add('bowman',cx,cz+10),k=add('rknight',cx,cz+4),o=add('raider',cx,cz+2);g.yaw=0;g.lineHold={hold:true};
  const N=400,zero=(by,blow)=>{let z=0;for(let i=0;i<N;i++)if(warDmg(g,5,by,2,blow)[0]===0)z++;return z/N;};
  g.fm='wall';const wz=zero(a,false),wb=warDmg(g,10,o,5,true)[0];g.yaw=Math.PI;const wbk=warDmg(g,10,o,5,true)[0];g.yaw=0;
  g.fm='loose';const lz=zero(a,false);g.fm='square';k.sp=0;const sq=warDmg(g,10,k,5,true)[0],stag=k.stagger>foeClock;g.fm=null;k.stagger=0;
  k.sp=6;const ch=warDmg(g,10,k,5,true)[0],wh=k.wheelT>foeClock;k.sp=0;o.fm='wedge';o.chgT=foeClock+5;const wd=warDmg(g,10,o,5,true)[0];o.fm=null;o.horn=foeClock+5;const hn=warDmg(g,10,o,5,true)[0];o.horn=0;
  info('the shield wall: shots turned',wz.toFixed(2),', a blow of 10 from the front',wb.toFixed(1),', from behind',wbk.toFixed(1),'; loose order: shots missing',lz.toFixed(2),'; a square against a knight',sq.toFixed(1),'(it recoils',stag+') ; a charging knight',ch.toFixed(1),'(it rides on',wh+') ; a wedge\'s charge',wd.toFixed(1),'; after the horn',hn.toFixed(1));
  assert(wz>0.6&&wz<0.8&&Math.abs(wb-7)<0.01&&wbk===10&&lz>0.2&&lz<0.4&&sq===5&&stag&&ch===15&&wh&&Math.abs(wd-12.5)<0.01&&Math.abs(hn-11.5)<0.01,'a shield wall turns most arrows and blunts blows from the front, loose order lets arrows by, a square throws back horsemen, a mounted charge strikes hard and rides on, a wedge\'s charge and the horn strike harder');
  info('the line against',['bowman','wolfrid'].map(k=>k+': '+morPick(new Array(10).fill(0).map((_,i)=>({kind:i<4?k:'raider'})))).join(', '));
  assert(morPick(new Array(10).fill(0).map((_,i)=>({kind:i<4?'bowman':'raider'})))==='wall'&&morPick(new Array(10).fill(0).map((_,i)=>({kind:i<3?'wolfrid':'raider'})))==='brace','the hosts\' line locks shields against archers and braces against horsemen');clear();}
// the wounded: some of the hosts struck down lie wounded; the foe passes them by; a healer, the player, or death
{const L=band('rspear',60,cx,cz,10,{war:1}),o=add('raider',cx-6,cz);for(const g of L)foeHurtFoe(g,999,o,1,0,1,true);run(0.1);
  const Wd=L.filter(g=>g.wnd&&!g.dead),D=L.filter(g=>g.dead);info('of 60 struck down',Wd.length,'lie wounded,',D.length,'dead');assert(Wd.length>=8&&Wd.length<=32&&Wd.length+D.length===60,'some of the hosts struck down lie wounded');
  for(const g of D)removeFoe(g);for(const g of Wd.slice(3))removeFoe(g);Wd.length=3;
  for(const [i,dx] of [[1,20],[2,40]]){const g=Wd[i];g.x=cx+dx;g.z=cz;g.y=foeStand(g.x,ground[Math.floor(g.x)+W*Math.floor(g.z)]+2,g.z,2);} // (apart, out of the healer's reach)
  o.foe=null;o.hold=0;o.st='idle';foeScan(o,FOES.raider,false);info('an orc among the wounded fights',o.foe&&o.foe.kind);assert(!o.foe,'the foe passes the wounded by');removeFoe(o);
  const h=add('eheal',Wd[0].x+1,Wd[0].z);run(6);info('a healer by the first: it stands',!Wd[0].wnd,'with',Wd[0].hp,'of',Wd[0].mhp);assert(!Wd[0].wnd&&Wd[0].hp>=Wd[0].mhp*0.4,'a healer mends the wounded until they stand');
  const b=Wd[1];PL.x=b.x+2;PL.z=b.z;PL.y=b.y;const e=eyePos();PL.yaw=Math.atan2(-(b.x-PL.x),-(b.z-PL.z));PL.pitch=Math.atan2(b.y+0.4-e.y,2);inv[sel]=null;act(2);info('the player binds the second\'s wounds: it stands',!b.wnd,'with',b.hp);assert(!b.wnd&&b.hp>=b.mhp*0.5,'the player binds a wounded soldier\'s wounds');
  const c=Wd[2];c.wnd=foeClock+0.5;run(1);info('the third, none coming: dead',!!c.dead);assert(c.dead,'the wounded die if none comes');clear();}
// a war hound runs down an orc and bites; its legs move as it runs
{const hd=add('rhound',cx,cz,{hold:0}),o=add('raider',cx,cz-8);o.hp=o.mhp=99;hd.foe=o;hd.st='chase';let leg=0;run(6,()=>{leg=Math.max(leg,Math.abs(hd.m.parts.legFL.rotation.x));return o.hp<99-8;});
  info('a war hound: the orc',o.hp,'of 99 ; its legs swing',leg.toFixed(2));assert(o.hp<99&&leg>0.2,'a war hound runs at the foe and bites');clear();}
// the banner taken; the horn sounded
{setMode('survival');playing=true;inv.fill(null);hp=20;const b=add('obanner',PL.x,PL.z-2.5);b.hp=1;inv[sel]={id:374,c:1,d:0};armsBlow(b,374);info('the banner bearer slain: banners in hand',countOf(OBANNER));assert(countOf(OBANNER)===1,'the banner of a warhost is taken from the one who bore it');clear();
  const R=band('rsword',6,PL.x+4,PL.z,3);for(const f of R){f.hold=0;morRout(f,30);f.fear=2;}const O=band('raider',4,PL.x-6,PL.z+6,2);
  inv[sel]={id:414,c:1,d:0};hornCD=0;act(2);const rall=R.filter(f=>!f.rout&&f.fear===0&&f.horn>foeClock).length,fal=O.filter(f=>f.fear>=0.4).length;act(2);
  info('the horn: of 6 running',rall,'turn back with heart; of 4 orcs',fal,'falter ; again at once: ready in',Math.ceil(hornCD-foeClock),'s');
  assert(rall===6&&fal===4&&hornCD-foeClock>50,'the Horn of the Hosts turns the running back and puts heart in them, and the foe falters; then it needs a minute');
  clear();setMode('creative');playing=false;inv.fill(null);}
clear();
