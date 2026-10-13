// Into the basin and beneath it (W5, D-072): beyond a fallen gate the front moves out across the floor with play time; forward
// camps rise as it passes (a palisade ring, a watchtower, banners), written in the chronicle, each with its garrison; the armies'
// ways lead to the front; a place of the wastes cleared with the hosts near is taken and their garrison holds it; underground in
// the basin a company of the hosts goes with the player; a battle won pushes the front on.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P);playing=false;
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();};
WARS.clear();warPlay=0;warArmies.length=0;WJ.length=0;
const w={id:P.id,n:P.name,X:P.X,Z:P.Z,camp:P.camp,f:0,b:{ram:1,mine:1,walls:1,sally:1},m:{ram:4,mine:4,walls:4,sally:4},w:[0,0],log:[[0,'x']]};WARS.set(P.id,w);warFall(w,false,P);
// the front with play time
const F=warFrontPath(P),f0=warFront(w),st0=warStage(w);warPlay+=360;const f1=warFront(w),st1=warStage(w);
info('the front\'s way',F.length,'points; at the fall',f0,st0,'; six minutes on',f1.toFixed(2),st1);
assert(F.length>=4&&f0===0&&st0==='The gate has fallen'&&f1>0.2&&f1<0.5&&st1==='The hosts push into the basin','beyond the fallen gate the front moves out across the basin\'s floor with play time');
// the first forward camp: built where loaded, in the chronicle, garrisoned
{const C=warCampAt(P,0);gen(C[0],C[1]);PL.x=C[0]-OX+0.5;PL.z=C[1]-OZ+12.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;
  for(let i=0;i<5;i++){warFrontTick(P,w);let k=0;while(WJ.length&&k++<2000)warJobsFrame();}
  let logs=0,planks=0;for(let dx=-10;dx<=10;dx++)for(let dz=-10;dz<=10;dz++){const x=C[0]-OX+dx,z=C[1]-OZ+dz;for(let y=C[3]-2;y<C[3]+12;y++){const b=get(x,y,z);if(b===LOG)logs++;if(b===PLANKS)planks++;}}
  const out=[];warFrontPlaces(C[0],C[1],out);info('the first camp at',C[0],C[1],': logs',logs,', planks',planks,'; camps',w.ap.fc,'; garrison spots',out.map(q=>q.kind).join(' '),'; chronicle',w.log[w.log.length-1][1]);
  assert(w.ap.fc===1&&logs>=100&&planks>=20&&/forward camp/.test(w.log[w.log.length-1][1])&&out.some(q=>q.folk),'a forward camp rises where the front has passed, written in the chronicle, with its garrison');}
// the armies' ways lead to the front
{const FW=warFrontWays(P,w),fa=warFrontAt(P,w),e=FW.inA[FW.inA.length-1],o=FW.out[FW.out.length-1];
  info('the hosts\' way ends',Math.hypot(e[0]-fa[0],e[1]-fa[1]).toFixed(0),'past the front; the warhosts\' way ends',Math.hypot(o[0]-fa[0],o[1]-fa[1]).toFixed(0),'from it');
  assert(Math.hypot(e[0]-fa[0],e[1]-fa[1])<80&&Math.hypot(o[0]-fa[0],o[1]-fa[1])<50,'the hosts march down to the front, the warhosts come at it');}
// a place of the wastes cleared with the hosts near is taken and held
{clear();const y=PL.y,o=addFoe('raider',PL.x+2,y,PL.z,{spot:'otest'});addFoe('rspear',PL.x+4,y,PL.z,{});o.dead=0.001;o.st='dead';run(0.2);
  const held=warHeld({id:'otest',x:PL.x+OX,y:y,z:PL.z+OZ,R:4,kind:'ocamp'});info('taken',WAR_CL.has('otest'),'; held as',held.kind,held.folk,'; chronicle',w.log[w.log.length-1][1]);
  assert(WAR_CL.has('otest')&&w.cl.includes('otest')&&held.folk&&held.kind[1]==='_','a place of the wastes cleared with the hosts near is taken, and their garrison holds it');clear();}
// underground in the basin: a company of the hosts with the player
{const bx=Math.floor(PL.x),bz=Math.floor(PL.z),g=ground[bx+W*bz],y0=g-20;for(let dx=-14;dx<=14;dx++)for(let dz=-14;dz<=14;dz++)for(let y=y0;y<y0+4;y++)setBlock(bx+dx,y,bz+dz,AIR,true);
  for(let dx=-14;dx<=14;dx++)for(let dz=-14;dz<=14;dz++)setBlock(bx+dx,y0-1,bz+dz,STONE,true);PL.y=y0;let n=0;
  for(let k=0;k<20;k++){warFolT[2]=0;warDeepTick();n=foes.filter(f=>f.follow===2&&!f.dead).length;if(n>=6)break;}
  info('the company underground',n);assert(n===6,'underground in the fallen basin a company of the hosts goes with the player');clear();}
// a battle won pushes the front on
{const b0=w.b.fr||0,A={P:P,al:true,m:new Array(40).fill(0),fell:16,reach:new Set(),C:[]};warOutcome(A);info('a battle: the front\'s gain',((w.b.fr||0)-b0).toFixed(2),'; chronicle',w.log[w.log.length-1][1]);
  assert((w.b.fr||0)>b0&&/pushed the front/.test(w.log[w.log.length-1][1]),'a battle won pushes the front on');}
