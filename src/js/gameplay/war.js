// ---- War at the gates of the wastes (D-067). The camp of the allied hosts, its siege works and the orcs' yard behind the
// gate are peopled from the spots of the gate's layout (warPlaces, through foePlaces): soldiers of men, elves and dwarves in
// their quarters, at the lines, the engines and the ram; orcs in their camp, at their forge and the troll's cage, archers on the
// gate's walk. While the player is near a gate the two sides send parties at each other (warTick): raiding parties out of the
// camp through the gap of the open leaf into the yard, or out of the yard against the lines; scouts slipping through (the
// allies' on down the long road, the goblins out round the camp); now and then an army, the three peoples marching together or
// a warhost of the wastes with its trolls and warchief. A party marches by waypoints (f.way, world coordinates, taken one by one
// as its home in the foes' 'return' step) and fights whatever of the other side it meets on the way (D-063). In creative they
// fight each other and never the player.
Object.assign(FOE_HOME,{owall:[['bowman',3],['raider',1]],oscout:[['goblin',2],['gslinger',2]],oarmy:[['raider',5],['bowman',2.5],['brute',2]],
  r_mant:[['rbow',2],['rspear',1]],r_lines:[['rspear',2],['rbow',1],['rsword',1]],e_lines:[['ebow',2],['esword',1]],d_ram:[['dhammer',2],['daxe',2]],d_treb:[['dxbow',1],['daxe',1]],
  e_scout:[['ebow',2]],w_scout:[['wbow',2],['wknife',1]],h_scout:[['hrider',2]]});
Object.assign(FOLK_N,{mant:[2,3],lines:[2,4],ram:[3,4],treb:[2,2],scout:[2,3]});Object.assign(FOLK_LEAD,{d_ram:'dcapt',r_lines:'rcapt'});FOE_N.owall=[2,3];
FOLK_SAY.siege=['You stand in {p}. Mind the watch, and keep clear of the lines when the throwers loose.','Men, elves and dwarves in one camp. My grandfather would not have believed it.',
  'The gate has held a hundred years. It will not hold a hundred more.','They come out by night, mostly. Goblins first, then the big ones.','Every stone they throw at us, we throw two back.',
  'The dwarves say the ram will break it before the snows. The elves say nothing, and smile.','When the gate falls, we march down the long road to the burning mountain.',
  'Keep your head down near the pass. Their archers on the wall do not miss twice.'];
const WAR_PEOPLE={r:'the men of the white realm',h:'the riders',e:'the high elves',w:'the wood elves',d:'the dwarves'},warS=new Map();let warClk=10;
// is the player near a gate's works (within 160)? (the foes' caps are higher there)
const warNear=()=>!!wasteGateAt(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),160);
// the spots of the gates near (X,Z): the folk's within 46 blocks, the orcs' within 64
function warPlaces(X,Z,out){for(const t of wgTile(Math.floor(X),Math.floor(Z))){const P=t.P,s=wgSite(P);
  s.lay.spots.forEach((p,i)=>{const [x,z]=siteXZ(s,p.u,p.v),folk=p.kind[1]==='_';if(Math.hypot(x-X,z-Z)>(folk?46:64))return;
    out.push({id:P.id+':'+i,x:x+0.5,y:p.y+1,z:z+0.5,R:p.R,kind:p.kind,folk:folk?1:0,s:s});});}}
// the way between the camp and the orcs' camp (wgWay), in world coordinates, inward from the camp or the other way
function warRoute(P,inward){const s=wgSite(P),R=wgWay(P);return (inward?R:R.slice().reverse()).map(([u,v])=>siteXZ(s,u,v));}
// down the long road from its head (for the allies' scouts)
function warRoadDown(P){const s=wgSite(P),out=[siteXZ(s,-26,P.side*36),siteXZ(s,P.uY+8,P.side*36)];const p=P.ramp.pts;for(let i=6;i<p.length;i+=6)out.push([p[i][0],p[i][1]]);return out;}
// Sends a party of n from table along the route: it starts at the first waypoint in the loaded world, generated, 30 to 85
// blocks from the player (out of the way, and well within the reach at which marching foes and folk are let go); null if none.
// With o.back it holds a while where the route ends, then marches back the way it came (f.back)
function warParty(P,table,n,route,o){
  let k=0;for(;k<route.length;k++){const [X,Z]=route[k],x=X-OX,z=Z-OZ,bx=Math.floor(x),bz=Math.floor(z),d=Math.hypot(x-PL.x,z-PL.z);if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])continue;if(d>=30&&d<=85)break;}
  if(k>=route.length-1)return null;const [X,Z]=route[k],x=X-OX,z=Z-OZ,g=ground[Math.floor(x)+W*Math.floor(z)];
  const grp=spawnGroup(table,n,x,g,z,3,Object.assign({lead:null},o||{}));if(!grp.length)return null;
  for(const f of grp){f.war=P.id;f.way=route.slice(k+1).map(w=>[w[0],w[1]]);if(o&&o.back)f.back=route.slice(k,-1).reverse().map(w=>[w[0],w[1]]);const w=f.way.shift();f.hx=w[0]-OX;f.hz=w[1]-OZ;f.st='return';f.t=Math.max(0,Math.hypot(f.hx-f.x,f.hz-f.z)/FOES[f.kind].walk-20);}
  return grp;}
const warFolk=(P,fp,back)=>({prov:'wg:'+P.id,site:wgSite(P),lead:FOLK_LEAD[fp+'host']||null,back:back});
function warRaid(P){
  if(Math.random()<0.55){const fp=['r_','h_','e_','w_','d_'][Math.floor(Math.random()*5)],g=warParty(P,fp+'host',4+Math.floor(Math.random()*3),warRoute(P,true),warFolk(P,fp,1));
    if(g){toast('A raiding party of '+WAR_PEOPLE[fp[0]]+' makes for the gate');foeCall(g[0],'alert');}}
  else{const g=warParty(P,'band',5+Math.floor(Math.random()*3),warRoute(P,false),{lead:Math.random()<0.3?'ochief':null,back:1});if(g){toast('Orcs sally from the gate against the siege lines');foeCall(g[0],'alert');}}}
function warScout(P){
  if(Math.random()<0.5){const fp=Math.random()<0.5?'e_':'w_',g=warParty(P,fp+'scout',2+Math.floor(Math.random()*2),warRoute(P,true).concat(warRoadDown(P)),warFolk(P,fp));if(g)toast('Scouts of '+WAR_PEOPLE[fp[0]]+' slip through the gate');}
  else{const s=wgSite(P),r=warRoute(P,false);r.push(siteXZ(s,P.uC0+40,(Math.random()<0.5?-1:1)*(WG_CAMP[1]+16)),siteXZ(s,P.uC0+160,(Math.random()<0.5?-1:1)*(WG_CAMP[1]+16)));
    const g=warParty(P,'oscout',3,r);if(g)toast('Goblin scouts creep out along the pass');}}
// ---- Armies (D-067): an invasion is massive. An army is a column of companies (`warAllied`, `warOrcs`: some 116 of the hosts
// or 114 of the wastes at the "massive" size of the war setting, settings.war). The allies muster in the camp when the player is
// in it: the companies march out of their quarters by the streets to the muster field inside the great gate or to the square
// before the pavilion, whichever is nearer, and stand there in ranks by people (men, dwarves, elves) facing the gate; when all
// are in (or a while has passed) the horns sound and they march out rank by rank, through the lines and the gate's gap, half to
// storm the Gatewarden's Camp and half on down the Long Descent; they hold a while, then march back. The orcs come up the Long
// Descent company by company when the player is in the yard or on the road, mass in ranks before the gate and charge, half
// against the siege lines and the engines, half on into the Leaguer to its square. Elsewhere the companies come one after
// another along the army's way from as near as is out of the way (`warEntry`). The other side calls defenders to its lines
// (`warDefend`). An army's soldiers march at one pace (`f.pace`) in files about its way (`f.fo`, `warAim`).
const WAR_SIZE=[0.35,0.65,1],warArmies=[];
const warSz=()=>WAR_SIZE[settings.war>=0&&settings.war<3?settings.war:2],warCap=()=>Math.round(60+110*warSz());
const warLive=()=>{let n=0;for(const f of foes)if(f.war&&!f.dead)n++;return n;};
// the next waypoint, the file's offset across the leg (an exact point, such as a place in the ranks, has none)
function warAim(f,w){const wx=w[0]-OX,wz=w[1]-OZ;f.hex=!!w[2];if(w[2]||f.fo===undefined){f.hx=wx+(w[2]?0:((f.id%3)-1)*0.8);f.hz=wz+(w[2]?0:(f.id%2?0.5:-0.5));return;}
  const lx=wx-f.x,lz=wz-f.z,l=Math.hypot(lx,lz)||1;f.hx=wx-lz/l*f.fo;f.hz=wz+lx/l*f.fo;}
// may a soldier waiting in the ranks march? (its rank's turn after the horns)
const warGo=f=>{const w=f.waitA,A=w.A;return !A.hold&&A.go&&foeClock>=A.goT+w.r*A.gap;};
// a point (world) a company may form at: in the loaded world, generated, lo to hi blocks from the player; its ground, or -1
function warAt(X,Z,lo,hi){const x=X-OX,z=Z-OZ,bx=Math.floor(x),bz=Math.floor(z),d=Math.hypot(x-PL.x,z-PL.z);if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX]||d<lo||d>hi)return -1;return ground[bx+W*bz];}
// places in ranks for n on open ground: the front at (u0, v0) in the gate's frame, facing dir (+1 toward +u), files across; each
// [X, Z, 1 (exact), its rank (counted from r0)]
function warRanks(s,u0,v0,dir,n,files,y,r0){
  const out=[];for(let r=0;out.length<n&&r<40;r++)for(let c=0;c<files&&out.length<n;c++){const [X,Z]=siteXZ(s,u0-dir*r*1.8,v0+(c-(files-1)/2)*1.6),x=X+0.5-OX,z=Z+0.5-OZ;
    if(x<2||z<2||x>=W-2||z>=D-2)continue;const yy=foeStand(x,y+1,z,2);if(yy<0||Math.abs(yy-y)>1||foeWet(x,yy,z))continue;out.push([X+0.5,Z+0.5,1,(r0||0)+r]);}
  return out;}
// the companies of an army of the hosts (def: the camp's defenders), each {t: table, fp, n, lead, g: its block in the ranks}
function warAllied(def){const k=warSz(),C=[],add=(fp,n,lead,m,g)=>{const q=Math.max(1,Math.round(m*k));for(let i=0;i<q;i++)C.push({t:fp+'host',fp:fp,n:n,lead:lead,g:g});};
  if(def){add('r_',8,'rcapt',2,0);add('d_',8,'dcapt',1,1);add('e_',7,'ecapt',1,2);}
  else{add('r_',9,'rcapt',4,0);add('h_',6,'hcapt',2,0);add('d_',9,'dcapt',4,1);add('e_',8,'ecapt',3,2);add('w_',8,'wcapt',1,2);}
  return C;}
// the companies of a warhost of the wastes (def: the yard's defenders): orcs under warchiefs, goblins, trolls among them
function warOrcs(def){const k=warSz(),C=[],add=(t,n,lead,m)=>{const q=Math.max(1,Math.round(m*k));for(let i=0;i<q;i++)C.push({t:t,n:n,lead:i<2?lead:null,g:0});};
  if(def){add('band',8,'ochief',2);add('oscout',8,null,1);add('band',1,'troll',1);}
  else{add('oarmy',10,'ochief',8);add('oscout',10,'gchief',3);add('band',1,'troll',4);
    for(let i=C.length-1,j=0;i>0;i--)if(C[i].lead==='troll'){const t=C.splice(i,1)[0];C.splice(2+3*j++,0,t);}}
  return C;}
const warN=C=>C.reduce((a,c)=>a+c.n,0);
// points in the gate's frame to world points (an exact one keeps its mark)
const warW=(s,L)=>L.map(([u,v,e])=>{const [X,Z]=siteXZ(s,u,v);return e?[X+0.5,Z+0.5,1]:[X+0.5,Z+0.5];});
// the road's line down from its head, every third point (some 18 blocks), as far as len along it
function warRoad(P,len){const out=[];const p=P.ramp.pts;for(let i=3;i<p.length&&p[i][2]<=len;i+=3)out.push([p[i][0],p[i][1]]);return out;}
// the allies' ways from the camp's great gate: to storm the orcs' camp (inA) or on down the road (inB); the orcs' ways out of the
// gap: against the lines and the engines (outA) or on into the camp to its square (outB)
function warWays(P){if(P.ways)return P.ways;const s=wgSite(P),w=[[P.uC0+16,0],[P.uC0+4,0],[P.uC0-8,0]].concat(wgWay(P).slice(1)),cs=P.cs,c0=P.uC0,ub=P.uL+12;
  const inA=warW(s,w),inB=warW(s,w.slice(0,11).concat([[-26,-cs*3],[-26,P.side*36],[P.uY+8,P.side*36]])).concat(warRoad(P,170));
  const out=w.slice(3,10).reverse(),outA=warW(s,out.concat([[ub+4,-12],[ub+8,-20],[ub+8,20]])),outB=warW(s,out.concat([[c0-8,0],[c0+4,0],[c0+16,0],[c0+28,0],[c0+60,3],[c0+100,4],[c0+116,4]]));
  return P.ways={inA:inA,inB:inB,outA:outA,outB:outB};}
// where the orcs come up the road from: the farthest point down it from 34 to 76 blocks from the player (its index), or -1
function warUp(P){const p=P.ramp.pts;let best=-1;for(let i=3;i<p.length;i+=3)if(warAt(p[i][0],p[i][1],34,76)>=0)best=i;return best;}
// the first point of a way from 30 to 85 from the player, loaded and generated (an army without a muster comes in there), or -1
function warEntry(R){for(let k=0;k<R.length-1;k++)if(warAt(R[k][0],R[k][1],30,85)>=0)return k;return -1;}
// Starts an army of the hosts (al) or of the wastes at the gate, and the other side's defenders
function warArmy(P,al){
  const s=wgSite(P),X=PL.x+OX,Z=PL.z+OZ,[pu,pv]=wgUV(P,X,Z),c0=P.uC0,g=P.hG,C=al?warAllied(false):warOrcs(false),N=warN(C);
  const A={P:P,al:al,C:C,i:0,m:[],t0:foeClock,nt:foeClock+2,lt:foeClock,go:false,goT:0,gap:al?2.2:2.8,pace:al?1.45:1.7,N:N,face:0,mus:null};
  if(al){// the muster: the field inside the great gate or the square, whichever is nearer the player, if within 80
    const dF=Math.hypot(pu-(c0+28),pv),dS=Math.hypot(pu-(c0+120),pv),sq=dS<dF;
    if(Math.min(dF,dS)<=80){const u0=c0+(sq?113:18),side=-P.cs;
      // the ranks: the men (and riders) on their side, the dwarves in the middle, the elves on theirs; five files to each
      for(let b=0;b<3;b++){A['rk'+b]=warRanks(s,u0,[side*9,0,-side*9][b],-1,warN(C.filter(c=>c.g===b)),5,g,b*12);A['ri'+b]=0;}
      const [ax,az]=siteXZ(s,u0,0),[bx,bz]=siteXZ(s,u0-10,0);A.face=Math.atan2(bx-ax,bz-az);
      A.mus={sq:sq,pre:sq?[[c0+112,4],[c0+104,4],[c0+100,4],[c0+60,3],[c0+28,0]]:[],home:sq?[]:warW(s,[[c0+28,0]])};}
    toast(A.mus?'The horns of '+P.camp.replace(/^The /,'the ')+' sound: the hosts muster '+(A.mus.sq?'in the square':'on the field'):'The allied hosts come against the gate, '+N+' strong');}
  else{// the orcs mass before the gate when the player is in the yard or on the road and the road is in reach
    const near=pu<0&&Math.abs(pv)<90||wgRoadNear(P,P.ramp.all,X,Z)[0]<40;
    if(near&&warUp(P)>=0){A.rk0=warRanks(s,-12,P.side*37,1,N,14,g,0);A.ri0=0;const [ax,az]=siteXZ(s,-11,0),[bx,bz]=siteXZ(s,0,0);A.face=Math.atan2(bx-ax,bz-az);A.mus={yard:1,pre:[[-18,P.side*22],[-18,-P.cs*2]],home:warW(s,[[-14,-P.cs*2],[-20,-P.cs*3],[-26,-P.cs*3],[-26,P.yc.vm],[P.yc.ub-10,P.yc.vm]])};}
    toast(A.mus?'Drums on '+P.road.replace(/^The /,'the ')+': a warhost of the wastes comes up to the gate':'A warhost pours out of '+P.name.replace(/^The /,'the ')+', '+N+' strong');}
  warArmies.push(A);warHorn(A);warDefend(P,!al);return A;}
// sends the army's next company: out of its quarters (a muster in the camp), up the road (a muster in the yard), or in along its
// way; null if it found no place to come from
function warCompany(A){
  const P=A.P,s=wgSite(P),c=A.C[A.i],W2=warWays(P),c0=P.uC0,side=-P.cs,odd=A.i%2;
  if(A.mus&&A.al){// out of the quarters by the streets
    const own=c.fp==='d_'?[[160,0],[180,0],[200,0],[125,side*40]]:c.fp==='e_'||c.fp==='w_'?[[125,-side*44],[125,-side*64],[125,-side*84],[80,0]]:[[125,side*50],[125,side*70],[125,side*90],[80,0]];
    let at=null;for(const q of own.concat([[60,0],[100,0],[150,0],[40,0]])){const [X,Z]=siteXZ(s,c0+q[0],q[1]);if(warAt(X+0.5,Z+0.5,22,88)>=0){at=q;break;}}
    if(!at)return null;const U=at[0],V=at[1],sg=Math.sign(V||side);
    const path=U>154?[[c0+153,0],[c0+153,sg*17],[c0+126,sg*17]]:Math.abs(V)>5?[[c0+125,sg*22]]:[],cu=path.length?125:U;
    if(!A.mus.sq){if(cu>=104)path.push([c0+125,4]);for(const q of [[112,4],[104,4],[100,4],[60,3],[46,0]])if(q[0]<cu)path.push([c0+q[0],q[1]]);}
    const [X,Z]=siteXZ(s,c0+U,V);return warSpawn(A,c,X+0.5,Z+0.5,warW(s,path),odd?W2.inB:W2.inA);}
  if(A.mus){// up the Long Descent, to the head of the road, along the paved way behind the barricades and through their gap
    const k=warUp(P);if(k<0)return null;const p=P.ramp.pts,up=[];for(let i=k-3;i>=3;i-=3)up.push([p[i][0],p[i][1]]);
    return warSpawn(A,c,p[k][0],p[k][1],up.concat(warW(s,[[P.uY+8,P.side*36],[-40,P.side*37]])),odd?W2.outB:W2.outA);}
  const route=A.al?(odd?W2.inB:W2.inA):(odd?W2.outB:W2.outA),k=warEntry(route);if(k<0)return null;
  return warSpawn(A,c,route[k][0],route[k][1],[],route.slice(k+1),true);}
// a company of the army at (X,Z): each to its place in the ranks (if the army musters), there to wait for the horns, then on along
// the army's way; at its end it holds a while and marches back the way it came
function warSpawn(A,c,X,Z,path,route,direct){
  const P=A.P,y=warAt(X,Z,0,999);if(y<0)return null;
  const grp=spawnGroup(c.t,c.n,X-OX,y,Z-OZ,4,A.al?{lead:c.lead,prov:'wg:'+P.id,site:wgSite(P)}:{lead:c.lead});if(!grp.length)return null;
  const pre=A.mus&&A.mus.pre?warW(wgSite(P),A.mus.pre):[];
  for(const f of grp){const F=FOES[f.kind];f.war=P.id;f.army=A;f.fo=((A.m.length%4)-1.5)*1.25;A.m.push(f);let way=path.slice();
    if(A.mus&&!direct){const R=A['rk'+c.g],q=R&&A['ri'+c.g]<R.length?R[A['ri'+c.g]++]:null;if(q)way.push([q[0],q[1],1]);way.push({A:A,r:q?q[3]:36});if(!A.def)way=way.concat(pre);}
    way=way.concat(route);f.way=way;if(!A.def){f.back=route.slice(0,-1).reverse().concat(pre.slice().reverse(),A.mus&&A.mus.home||[]);f.holdT=25;}
    f.pace=Math.min(A.pace,F.walk*1.4);
    const w=f.way.shift();if(w.A){f.waitA=w;f.st='idle';f.t=1;}else{warAim(f,w);f.st='return';f.t=Math.max(0,Math.hypot(f.hx-f.x,f.hz-f.z)/F.walk-20);}}
  return grp;}
// the other side's defenders: to the nearest of their lines within 85 of the player, in ranks, there to hold
function warDefend(P,al){
  const s=wgSite(P),X=PL.x+OX,Z=PL.z+OZ,[pu,pv]=wgUV(P,X,Z),c0=P.uC0,g=P.hG,C=al?warAllied(true):warOrcs(true);
  // the allies' lines: the siege lines, inside the camp's great gate, before the pavilion; the orcs': before their barricades
  const L=al?[[P.uL+11,0],[c0+20,0],[c0+113,0]]:[[-15,-P.cs*2]];let best=null,bd=86;for(const q of L){const d=Math.hypot(pu-q[0],pv-q[1]);if(d<bd){bd=d;best=q;}}
  if(!best)return null;const dir=al?-1:1;
  const A={P:P,al:al,C:C,i:0,m:[],t0:foeClock,nt:foeClock+4,lt:foeClock,go:false,hold:true,gap:2,pace:1.5,N:warN(C),def:1,face:0,mus:{at:best,pre:[]},rk0:warRanks(s,best[0],best[1],dir,warN(C),12,g,0),ri0:0};
  const [ax,az]=siteXZ(s,best[0],best[1]),[bx,bz]=siteXZ(s,best[0]+dir*10,best[1]);A.face=Math.atan2(bx-ax,bz-az);
  for(const c of C)c.g=0;warArmies.push(A);toast(al?'The Leaguer sounds the alarm: to the lines!':P.yard+' beats to arms');return A;}
// a defenders' company: out of the camp's great gate, the muster field or the street (the allies), or out of the orcs' camp
function warDefCompany(A){
  const P=A.P,s=wgSite(P),c=A.C[A.i],c0=P.uC0,y=P.yc,cs=P.cs,to=A.mus.at;
  const from=A.al?[[c0+28,0],[c0+60,3],[c0+4,0],[c0+100,4]]:[[y.ub-10,y.vm],[y.ua+12,y.vm]];let at=null;
  for(const q of from){const [X,Z]=siteXZ(s,q[0],q[1]);if(warAt(X+0.5,Z+0.5,18,90)>=0){at=q;break;}}if(!at)return null;
  const path=A.al?(to[0]<c0&&at[0]>c0?[[c0+4,0],[P.uL+14,0]]:to[0]>c0+60&&at[0]<c0+100?[[c0+100,4],[c0+112,4]]:[]):[[-26,y.vm],[-26,-cs*3],[-20,-cs*2]];
  const [X,Z]=siteXZ(s,at[0],at[1]);return warSpawn(A,c,X+0.5,Z+0.5,warW(s,path),[]);}
// horns from the camp (the men's silver horn, the dwarves' deep one, the elves' clear one), or the drums and war horns of the wastes
function warHorn(A){if(!AX||!settings.sound)return;const s=wgSite(A.P),[X,Z]=A.al?siteXZ(s,A.P.uC0+60,0):siteXZ(s,-30,0),at=[X-OX,A.P.hG+4,Z-OZ];
  if(A.al){tone(392,392,0.7,0.08,0,'triangle',at);tone(523,523,1.2,0.08,0.6,'triangle',at);tone(110,110,1.5,0.08,1.6,'sawtooth',at);tone(147,147,2,0.07,2.9,'triangle',at);tone(440,440,1.1,0.07,4.2,'triangle',at);tone(660,660,1.8,0.06,5.1,'triangle',at);}
  else{AMB_EV.drums(at);tone(155,150,1.6,0.12,0.4,'sawtooth',at);tone(116,112,2,0.12,2.2,'sawtooth',at);}}
// every second: each army sends its next company when its time comes (and the war is under its cap), and its ranks march when
// all are in or a while has passed; an army is done when all of it has fallen or gone, or the player has left its gate
function warMarch(){
  const X=PL.x+OX,Z=PL.z+OZ,here=wasteGateAt(Math.floor(X),Math.floor(Z),200);
  for(let a=warArmies.length-1;a>=0;a--){const A=warArmies[a];
    if(A.P!==here)A.i=A.C.length;
    if(A.i<A.C.length&&foeClock>=A.nt&&warLive()<warCap()){const g=A.def?warDefCompany(A):warCompany(A);A.i++;A.nt=foeClock+(A.mus&&!A.def?2.5:4);if(g)A.lt=foeClock;}
    const live=A.m.filter(f=>!f.dead&&!f.gone);
    if(A.mus&&!A.def&&!A.go){const ready=live.filter(f=>f.waitA&&f.st==='idle').length;
      if(A.i>=A.C.length&&(ready>=live.length*0.85||foeClock>A.lt+(A.al?55:80))||foeClock>A.t0+200){A.go=true;A.goT=foeClock+3;warHorn(A);
        if(live.length)toast(A.al?'The allied hosts march on '+A.P.name.replace(/^The /,'the ')+': men, elves and dwarves, '+live.length+' strong':'The warhost of '+A.P.name.replace(/^The /,'the ')+' charges, '+live.length+' strong');}}
    if(A.i>=A.C.length&&!live.length)warArmies.splice(a,1);}}
// every second the armies march (warMarch); every five near a gate the parties' timers run down, and one is sent when its time
// comes: now and then an army (the hosts' and the wastes' more or less in turn), raids and scouts between while no army is out,
// under the war's cap (warCap: 170 marching at once at the massive size)
function warTick(){
  warMarch();if((warClk-=1)>0)return;warClk=5;const X=PL.x+OX,Z=PL.z+OZ,P=wasteGateAt(Math.floor(X),Math.floor(Z),160);if(!P)return;
  let st=warS.get(P.id);if(!st){st={raid:15+Math.random()*25,scout:35+Math.random()*40,army:75+Math.random()*75,al:Math.random()<0.5};warS.set(P.id,st);}for(const k of ['raid','scout','army'])st[k]=Math.max(-5,st[k]-5);
  if(Math.random()<0.55)warVolley(P);
  const busy=warArmies.some(A=>A.P===P&&!A.def&&(A.i<A.C.length||A.m.some(f=>!f.dead&&!f.gone)));if(warLive()>=warCap()-(busy?0:20))return;
  if(st.army<=0&&!busy){st.army=300+Math.random()*120;st.raid=Math.max(st.raid,60);st.scout=Math.max(st.scout,40);st.al=Math.random()<(st.al?0.3:0.7);warArmy(P,st.al);}
  else if(busy)return;
  else if(st.raid<=0){st.raid=50+Math.random()*60;warRaid(P);}
  else if(st.scout<=0){st.scout=70+Math.random()*80;warScout(P);}}
// ---- The engines (D-067): now and then the dwarves' trebuchets loft a stone over the wall into the yard, or the orcs' throwers a
// burning pot onto the siege lines. They fly and land for the look and the sound only, and strike no one.
const warStones=entityKind({name:'warStones',list:[],update:dt=>updWarStones(dt),persist:false,shift:(dx,dz)=>{for(const s of warStones){s.x-=dx;s.z-=dz;}}});
function warVolley(P){
  const s=wgSite(P),orc=Math.random()<0.45,eng=s.lay.parts.filter(p=>p.k===(orc?'ocata':'dtreb')&&p.u0<P.uC0);if(!eng.length)return;const e=eng[Math.floor(Math.random()*eng.length)];
  const [ox,oz]=siteXZ(s,(e.u0+e.u1)/2,(e.v0+e.v1)/2),tu=orc?P.uL-12+Math.random()*44:-60+Math.random()*40,[tx,tz]=siteXZ(s,tu,(Math.random()-0.5)*80);
  const x=ox-OX+0.5,z=oz-OZ+0.5,y=P.hG+(orc?8:12),T=3.2+Math.random()*0.8,g=16,ty=P.hG+1;if(Math.hypot(x-PL.x,z-PL.z)>110)return;
  const mat=new THREE.MeshBasicMaterial({color:orc?new THREE.Color(1,0.5,0.12):new THREE.Color(0.32,0.31,0.3),transparent:orc,opacity:orc?0.92:1}),m=new THREE.Mesh(shotGeo,mat);m.scale.set(0.8,0.8,0.8);m.frustumCulled=false;scene.add(m);
  warStones.push({x:x,y:y,z:z,vx:(tx-ox)/T,vz:(tz-oz)/T,vy:(ty-y)/T+0.5*g*T,fire:orc,life:T+1,m:m});burst(0.3,'lowpass',160,1,0.3,0,[x,y,z]);}
function updWarStones(dt){
  for(let i=warStones.length-1;i>=0;i--){const s=warStones[i];s.life-=dt;s.vy-=16*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;s.m.position.set(s.x,s.y,s.z);s.m.rotation.x+=dt*3;s.m.rotation.y+=dt*2;
    if(s.fire&&Math.random()<0.7)spawnP(s.x,s.y,s.z,(Math.random()-.5)*0.4,0.2,(Math.random()-.5)*0.4,[1,0.5,0.1],0.4,-0.3);
    const bx=Math.floor(s.x),bz=Math.floor(s.z),hit=s.life<=0||bx<0||bz<0||bx>=W||bz>=D||SOLID[get(bx,Math.floor(s.y),bz)];
    if(hit){for(let k=0;k<(s.fire?16:10);k++)spawnP(s.x,s.y+0.5,s.z,(Math.random()-.5)*4,Math.random()*3.5,(Math.random()-.5)*4,s.fire?[1,0.5,0.1]:[0.32,0.3,0.28],0.6,s.fire?3:14);
      burst(s.fire?0.6:0.5,'lowpass',s.fire?380:140,1.1,0.45,0,[s.x,s.y,s.z]);scene.remove(s.m);s.m.material.dispose();warStones.splice(i,1);}}}
