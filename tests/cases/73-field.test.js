// Engines and pitched battles (W8c, D-078): the player takes a trebuchet's rope at the siege lines and looses where they look,
// breaking the wastes' soldiers where the stone falls, then waits on the crew; walking away leaves it; a bolt thrower set down
// looses a great bolt through several foes, loaded with crossbow bolts; a pitched battle brings both sides at once under a name;
// champions step out and fight alone, and the side whose champion wins takes heart; the battle is told in the chronicle, marked on
// the map, and a rider gallops back with the word.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);updWarStones(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const clear=()=>{hostDismiss(null);for(const f of [...foes])removeFoe(f);foeSpots.clear();warArmies.length=0;fieldB.length=0;engOn=null;};
const gy=(x,z)=>ground[Math.floor(x)+W*Math.floor(z)];
const add=(k,x,z,o)=>addFoe(k,x,foeStand(x,gy(x,z)+2,z,FOES[k].tall||2),z,Object.assign({st:'idle',t:99,hold:1},o||{}));
const look=(x,y,z)=>{const e=eyePos();PL.yaw=Math.atan2(-(x-PL.x),-(z-PL.z));PL.pitch=Math.atan2(y-e.y,Math.hypot(x-PL.x,z-PL.z));};
const e0=s.lay.parts.find(p=>p.k==='dtreb'),[EX,EZ]=siteXZ(s,(e0.u0+e0.u1)/2,(e0.v0+e0.v1)/2);gen(EX,EZ);playing=false;warClk=1e9;clear();inv[sel]=null;
// the trebuchet: its rope taken, a stone loosed where the player looks
{const cx=EX-OX+0.5,cz=EZ-OZ+0.5;let ty=-1;for(let y=P.hG+12;y>=P.hG-2&&ty<0;y--)if(SOLID[get(Math.floor(cx),y,Math.floor(cz))])ty=y;
  PL.x=cx+5;PL.z=cz;PL.y=gy(PL.x,PL.z)+1;look(cx,ty+0.5,cz);act(2);const on=!!engOn;info('the trebuchet at',EX,EZ,': its timbers at height',ty,'; the rope taken',on,'; the crew',on&&engCrew(engOn));
  assert(on&&!engOn.orc,'looking at a trebuchet of the siege lines, the use button takes its rope');
  PL.y=Math.max(PL.y,ty+4);PL.fly=true; // (up on the frame, to see over the lines)
  let tx=0,tz=0,best=0;for(let a=0;a<6.28;a+=0.3)for(const dd of [40,70,100]){look(PL.x+Math.sin(a)*dd,PL.y-14,PL.z+Math.cos(a)*dd);const [x,,z]=engMark(),d=Math.hypot(x-PL.x,z-PL.z);if(d>best&&d<120&&x>4&&z>4&&x<W-4&&z<D-4){best=d;tx=x;tz=z;}}PL.fly=false; // (the farthest open ground in sight)
  const O=[];for(let i=0;i<6;i++)O.push(add('raider',tx+(i%3-1)*1.3,tz+(Math.floor(i/3)-0.5)*1.3));for(const f of O)f.hp=f.mhp=40;
  look(tx,gy(tx,tz)+0.6,tz);const [mx,,mz]=engMark();info('the mark',Math.hypot(mx-tx,mz-tz).toFixed(1),'from where the orcs stand,',best.toFixed(0),'off');
  const n0=warStones.length;act(2);const loosed=warStones.length===n0+1&&warStones[warStones.length-1].byP;act(2);const again=warStones.length===n0+1;
  run(8,()=>warStones.length===n0);const hurt=O.filter(f=>f.dead||f.hp<40).length;
  info('loosed',loosed,'; at once again',!again?'loosed':'the crew winding it back','; of 6 orcs where it fell',hurt,'hurt or slain');
  assert(best>30&&Math.hypot(mx-tx,mz-tz)<3&&loosed&&again&&hurt>=3,'the stone flies where the player looks and breaks the orcs there; then the crew must wind it back');
  PL.x+=16;run(0.2);info('walked away: still at the engine',!!engOn);assert(!engOn,'walking away leaves the engine');clear();}
// the bolt thrower: set down, loaded with a bolt, it looses a great bolt that passes through several
{setMode('survival');playing=true;inv.fill(null);hp=20;const bx=Math.floor(PL.x)-2,bz=Math.floor(PL.z),by=Math.floor(PL.y);setBlock(bx,by,bz,BOLTTHR);look(bx+0.5,by+0.5,bz+0.5);
  const s0=shots.length;act(2);const none=shots.length===s0;inv[1]={id:410,c:3,d:0};act(2);const S=shots[shots.length-1];
  info('the bolt thrower: without bolts it looses',!none,'; with them',!!(S&&S.byP),'pierce',S&&S.pierce,'harm',S&&S.dmg,'; bolts left',countOf(410));
  assert(BL[BOLTTHR]&&RECIPES.some(r=>r[0]===BOLTTHR)&&none&&S&&S.byP&&S.pierce===3&&S.dmg>=20&&countOf(410)===2,'a bolt thrower needs a crossbow bolt and looses a great bolt that passes through as many as four');
  setBlock(bx,by,bz,AIR);clear();inv.fill(null);setMode('creative');playing=false;}
// a pitched battle: both sides at once, under a name
{const [X,Z]=at(P.uC0+40,12);gen(X,Z);PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=gy(PL.x,PL.z)+1;warS.clear();WARS.clear();warPlay=0;warStateTick();clear();
  const w=WARS.get(P.id),msg=wcDo('pitched'),F=fieldB[0];info('a pitched battle:',F&&F.n,'; armies',warArmies.length,F&&F.A.al,F&&!F.B.al,'; said',JSON.stringify(msg));
  assert(F&&/^the Battle before /.test(F.n)&&warArmies.includes(F.A)&&warArmies.includes(F.B)&&F.A.al&&!F.B.al&&F.A.fb===F,'a pitched battle brings the hosts and a warhost onto the field at once, under a name');
  const n2=fieldName(P,w);info('the next would be',n2);assert(/^the Second Battle/.test(n2),'battles at one gate are told apart');clear();
// the champions: a hero or the strongest of each steps out; they fight alone; the side of the one who wins takes heart
  const x=Math.floor(PL.x)+6.5,z=Math.floor(PL.z)-9.5,A={m:[],al:true},B={m:[]},F2={A:A,B:B,w:w,P:P,n:'the Battle of the test',t0:foeClock,pk:0,duel:null,X:0,Z:0};
  {const y0=Math.floor(PL.y);for(let dz=-9;dz<=9;dz++)for(let dx=-8;dx<=8;dx++){const X=Math.floor(x)+dx,Z=Math.floor(z)+dz;for(let y=y0-3;y<y0;y++)setBlock(X,y,Z,STONE);for(let y=y0;y<y0+6;y++)setBlock(X,y,Z,AIR);ground[X+W*Z]=y0-1;}} // (a level field for them)
  for(let i=0;i<6;i++){A.m.push(add('rsword',x-3+i,z-6));B.m.push(add('raider',x-3+i,z+6));}const a=add('rguard',x,z-2,{hold:0}),b=add('ochief',x,z+2,{hold:0});A.m.push(a);B.m.push(b);
  const r=add('raider',x+2,z+1,{hold:0});B.m.push(r);a.hp=b.hp=24;const D=fieldDuel(F2,A.m,B.m);
  let other=0;run(40,()=>{if(r.foe===a)other=1;return a.dead||b.dead||a.wnd;});duelTick(F2);
  const win=D.w===1?A:B,lose=D.w===1?B:A,hw=win.m.filter(f=>!f.dead&&f.horn>foeClock).length,fl=lose.m.filter(f=>!f.dead&&f.fear>=0.3).length;
  info('the champions',D.a.kind,'and',D.b.kind,'; the winner',D.wn,'; another orc went at the champion',!!other,'; heartened',hw,'; disheartened',fl);
  assert(D.a===a&&D.b===b&&D.w&&!other&&hw>=5&&fl>=5,'a champion of each side fights alone between the lines; its side takes heart when it wins and the other loses it');clear();
// the battle told, written, marked on the map, and a rider with the word
  const A3={m:[],al:true,brk:0},B3={m:[],brk:1},F3={A:A3,B:B3,w:w,P:P,n:'the Battle before the test',t0:foeClock,pk:4,duel:{w:1,wn:'Captain Hild',ln:'a warchief',end:1},X:PL.x+OX+20,Z:PL.z+OZ};
  for(let i=0;i<20;i++)A3.m.push({dead:i<4?1:0});for(let i=0;i<30;i++)B3.m.push({dead:i<18?1:0});const l0=w.log.length,p0=(w.pb||[]).length,txt=fieldReport(F3),rider=foes.find(f=>f.msg);
  const strokes=[];fieldMap({set strokeStyle(c){strokes.push(c);},lineWidth:0,beginPath(){},moveTo(){},lineTo(){},stroke(){}},v=>v,v=>v,w);
  info(txt);info('written',w.log.length-l0,'; on the map',(w.pb||[]).length-p0,'drawn',strokes.join(' '),'; a rider',rider&&rider.kind);
  assert(/held the field/.test(txt)&&/The hosts held/.test(txt)&&/broke and fled/.test(txt)&&/single combat/.test(txt)&&/You slew 4/.test(txt)&&w.log.length===l0+1&&w.pb.length===p0+1&&strokes.includes('#2a4c9c')&&rider,
    'the battle is told: who held the field, the fallen, the duel and the player\'s part; written in the chronicle, marked on the map, and a rider takes the word back');
  clear();}
