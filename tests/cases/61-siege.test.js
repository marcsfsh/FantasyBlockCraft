// The works of the war (W2, D-069): the gate's walk runs into its towers' doors; as the efforts grow the barred leaf is holed, the
// mine and the countermine are dug (sound all round), ladders stand on the towers with breaches above them and a siege tower comes,
// all saved as edits; a soldier climbs a ladder into a tower and out onto the walk; sappers and goblins come to the tunnels' faces;
// the works burn, char and are rebuilt; the fallen lie a while and crows come; graves fill behind the lines; the last assault
// takes the gate: the leaf shattered, the tower over the mine brought down, the banners of the peoples on the other, the yard and
// the walk held by the hosts; and a war away from the player falls on its own.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),g=P.hG,cs=P.cs,at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const B=(u,v,y)=>{const [X,Z]=wgXZ(P,u,v);return get(X-OX,y,Z-OZ);},jobs=()=>{let k=0;while(WJ.length&&k++<2000)warJobsFrame();};
const [X,Z]=at(70,0);gen(X,Z);const toPL=(u,v,y)=>{const [x,z]=at(u,v);PL.x=x-OX+0.5;PL.z=z-OZ+0.5;PL.y=y!==undefined?y:ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;};toPL(70,0);
// the walk runs into the towers' doors
assert(B(0,20,g+48)!==AIR&&B(0,20,g+49)===AIR&&B(0,-20,g+48)!==AIR&&B(0,22,g+50)===AIR,'the gate\'s walk runs on to the doors of its towers');
playing=false;for(const f of [...foes])removeFoe(f);foeSpots.clear();warS.clear();warArmies.length=0;WARS.clear();warPlay=0;warClk=1e9;WJ.length=0;warTowers.length=0;
const e00=edits.size;warStateTick();const w=WARS.get(P.id);assert(!!w,'the war is found');jobs(); // (the mine has met the countermine from the war's start, D-086: its works are made now)
const tick=()=>{for(let i=0;i<14;i++){warWorksTick(P,w);jobs();}};
// the works as the efforts grow: the ram half way, the mine three fifths dug, the walls half won
const e0=edits.size;w.b={ram:0.55,mine:0.6,walls:0.55,sally:0.3};w.f=warPlay;tick();
const M=warMinePts(P),mid=warMineMid(P),A0=w.ap;
let dug=0,n=0,sound=0,sn=0;for(let t=0.02;t<=0.58;t+=0.01){const u=Math.round(M.A[0]+(M.B[0]-M.A[0])*t),v=Math.round(M.A[1]+(M.B[1]-M.A[1])*t),top=(()=>{const [x,z]=wgXZ(P,u,v);return ground[x-OX+W*(z-OZ)];})();if(top<g-5)continue;n++;
  const c=B(u,v,g-8);if(c===AIR||c===PLANKS||c===TIMBER||c===LANTERN)dug++;sn++;if(SOLID[B(u,v,g-6)]&&SOLID[B(u,v,g-10)])sound++;}
let cdug=0,cn=0;for(let t=0.02;t<=0.38;t+=0.02){const u=Math.round(M.C[0]+(mid[0]-M.C[0])*t),v=Math.round(M.C[1]+(mid[1]-M.C[1])*t);cn++;if(B(u,v,g-8)===AIR)cdug++;}
info('applied',JSON.stringify(A0),'; leaf at the ram',B(0,cs*10,g+5),', above',B(0,cs*3,g+20),'; mine dug',dug,'of',n,', sound above and below',sound,'of',sn,'; countermine dug',cdug,'of',cn,'; edits',edits.size-e0);
assert(B(0,cs*10,g+5)===AIR&&B(-1,cs*10,g+5)===AIR&&B(0,cs*3,g+20)!==AIR,'the ram has holed the barred leaf where it strikes, and only there');
assert(n>20&&dug>=n*0.9&&sound>=sn*0.9&&cn>5&&cdug>=cn*0.8,'the mine and the countermine are dug as far as their efforts have come, with sound roof and floor');
assert(B(11,26,g+3)===LADDER&&B(10,26,g+30)===LADDER&&B(10,-30,g+30)===LADDER&&B(8,26,g+50)===AIR&&B(8,-30,g+50)===AIR,'ladders stand on both towers, with breaches above them');
assert(warTowers.some(T=>T.id===P.id),'a siege tower is wheeled up');
assert(edits.size-e00>1500,'the works are saved as edits');
{const sv=JSON.parse(JSON.stringify(warSave()));assert(sv.wr[0].ap&&sv.wr[0].ap.leaf===2&&sv.wr[0].ap.lad===2,'what the works have done is saved with the war');}
// a soldier of the hosts climbs a ladder into the tower and comes out on the walk
{const [x,z]=at(16,26),y=ground[x-OX+W*(z-OZ)]+1,f=addFoe('rsword',x-OX+0.5,y,z-OZ+0.5,{});f.army={al:true,m:[f]};f.way=[];f.st='idle';f.t=0.5;warClimbT=0;let top=0,up=false;
  run(70,()=>{top=Math.max(top,f.y);if(f.climb)up=true;const [u,v]=wgUV(P,f.x+OX,f.z+OZ);return !f.climb&&Math.abs(f.y-g-49)<0.6&&Math.abs(u)<=2&&Math.abs(v)<=14;});
  const [u,v]=wgUV(P,f.x+OX,f.z+OZ);info('the climber: climbed',up,', highest',(top-g).toFixed(1),'over the gate\'s level; ends at u',u.toFixed(1),'v',v.toFixed(1),'height',(f.y-g).toFixed(1),', holding',!!f.held);
  assert(up&&top>=g+48.9&&Math.abs(u)<=2&&Math.abs(v)<=14&&Math.abs(f.y-g-49)<0.6&&f.held,'a soldier climbs a ladder, goes in by the breach and out by the tower\'s door onto the walk');removeFoe(f);}
// the tunnels: sappers and goblins at their faces when the player is down there
{const t=0.3,u=Math.round(M.A[0]+(M.B[0]-M.A[0])*t),v=Math.round(M.A[1]+(M.B[1]-M.A[1])*t);toPL(u,v,g-9);warMineT=0;warMineFight(0.1,P,w);
  const sap=foes.filter(f=>f.mine===P.id&&FOES[f.kind].folk).length,gob=foes.filter(f=>f.mine===P.id&&!FOES[f.kind].folk).length;info('in the mine: sappers',sap,', goblins',gob);
  assert(sap>=1&&gob>=1,'sappers stand at the mine\'s face and goblins at the countermine\'s');for(const f of [...foes])removeFoe(f);toPL(70,0);}
// fire: a log set alight burns, is charred, and is rebuilt
{const [x,z]=at(60,-40),bx=x-OX,bz=z-OZ,y=ground[bx+W*bz]+1;setBlock(bx,y,bz,LOG,true);const k=warIgnite(w,bx+0.5,y+0.5,bz+0.5,1,4);
  warPlay+=60;warFireFrame(1.1);const c1=get(bx,y,bz);warPlay+=900;warFireFrame(1.1);const c2=get(bx,y,bz);
  info('fire: caught',k,', after a minute',BL[c1].n,', after fifteen',BL[c2].n);assert(k>=1&&c1===CHARWOOD&&c2===LOG,'the works burn, are charred and are rebuilt');}
// the fallen lie a while, crows come down to them, graves fill behind the lines
{const fa0=w.fa||0,L=[];for(let i=0;i<9;i++){const x=PL.x+(i%3)*2-2,z=PL.z+Math.floor(i/3)*2+4,f=addFoe('rspear',x,PL.y,z,{});f.war=P.id;f.dead=0.001;f.st='dead';L.push(f);}
  run(12);const lying=L.filter(f=>!f.gone&&foes.includes(f)).length;info('the fallen: lying after 12 s',lying,'of 9; counted',(w.fa||0)-fa0,'; crows',warCrows.length);
  assert(lying===9&&(w.fa||0)-fa0===9&&warCrows.length>=2,'the war\'s fallen lie a while, are counted, and crows come');
  w.fa=40;tick();info('graves',w.ap.gr);assert(w.ap.gr===20&&B(P.uL+30,cs*54,warTop(P,P.uL+30,cs*54)+1)===STONE,'a grave behind the lines for every two of the hosts who fell');for(const f of [...foes])removeFoe(f);}
// the last assault: all four done, the hosts' army comes, and when they reach the leaf the gate falls
{w.b={ram:1,mine:1,walls:1,sally:1};tick();const tnt=B(M.B[0],M.B[1],g-9);warS.set(P.id,{raid:99,scout:99,army:0,al:false});warClk=0;warTick();const A=warArmies.find(a=>a.last);
  assert(tnt===TNT&&!!A&&A.al,'with all four done the mine is charged and the hosts send the last assault');
  const [x,z]=at(2,-cs*4),f=addFoe('rsword',x-OX+0.5,g+1,z-OZ+0.5,{});A.m.push(f);warStateTick();
  assert(w.s===2&&warStage(w)==='The gate has fallen'&&/The gate has fallen/.test(w.log[w.log.length-1][1]),'the hosts at the leaf: the gate falls, and the chronicle tells it');
  for(const f of [...foes])removeFoe(f);warArmies.length=0;tick();
  let lf=0,ln=0;for(let sv=1;sv<=20;sv++)for(let y=g+1;y<wgArch(g,sv);y+=3){ln++;if(B(0,sv*cs,y)===AIR)lf++;}
  info('after the fall: the leaf',lf,'of',ln,'open; the fallen tower at the walk\'s height',B(9,cs*28,g+40),'its foot',B(9,cs*28,g+10),'; the mine\'s chamber',BL[B(M.B[0],M.B[1],g-8)].n,'; banner on the other tower',BL[B(10,-cs*25,g+35)].n,'; applied',JSON.stringify(w.ap));
  assert(lf>=ln*0.8,'the barred leaf is shattered');
  assert(B(9,cs*28,g+40)===AIR&&B(-9,cs*28,g+60)===AIR&&B(9,cs*28,g+10)!==AIR&&B(9,-cs*28,g+40)!==AIR,'the tower over the mine is brought down, its stump standing; the other stands');
  assert([GRAVEL,COBBLE].includes(B(M.B[0],M.B[1],g-8))&&B(10,-cs*25,g+35)===RBANNER&&B(10,-cs*31,g+35)===DBANNER,'the mine\'s chamber has fallen in; the banners of the peoples hang on the tower left standing');
  const out=[],[gx,gz]=at(0,0);warPlaces(gx,gz,out);const ks=[...new Set(out.map(p=>p.kind))];info('spots at the gate after the fall',ks.join(' '));
  assert(out.length&&out.every(p=>p.folk)&&out.some(p=>p.kind==='e_lines'&&p.y>g+40),'the hosts hold the yard and the walk');}
// a war far from the player falls on its own, ten minutes after its four efforts are done
{const w2={id:'wgfar',n:'The Ashen Gate of Far',X:P.X+40000,Z:P.Z,camp:'The Leaguer of Far',f:0,b:{ram:1,mine:1,walls:1,sally:1},m:{ram:4,mine:4,walls:4,sally:4},w:[0,0],log:[[0,'x']]};WARS.set(w2.id,w2);
  warStateTick();const s1=w2.s;w2.allT=warPlay-700;warStateTick();info('the far war:',s1,'->',w2.s,warStage(w2));assert(s1!==2&&w2.s===2,'a war away from the player falls on its own after a while');WARS.delete(w2.id);}
