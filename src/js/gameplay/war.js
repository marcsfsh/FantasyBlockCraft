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
function warArmy(P){
  if(Math.random()<0.5){let any=null;for(const fp of ['r_','d_','e_']){const g=warParty(P,fp+'host',4+Math.floor(Math.random()*2),warRoute(P,true),warFolk(P,fp,1));if(g&&!any)any=g;}
    if(any){toast('The allied hosts march on the gate: men, elves and dwarves together');foeCall(any[0],'alert');}}
  else{const r=warRoute(P,false),g=warParty(P,'oarmy',8+Math.floor(Math.random()*3),r,{lead:'ochief',back:1});if(g){warParty(P,'band',1,r,{lead:'troll',back:1});warParty(P,'oscout',3,r);toast('A warhost pours out of '+P.name.replace(/^The /,'the '));foeCall(g[0],'alert');}}}
// every few seconds near a gate: the parties' timers run down, and one is sent when its time comes (at most 26 marching at once)
function warTick(){
  if((warClk-=1)>0)return;warClk=5;const X=PL.x+OX,Z=PL.z+OZ,P=wasteGateAt(Math.floor(X),Math.floor(Z),160);if(!P)return;
  let st=warS.get(P.id);if(!st){st={raid:15+Math.random()*25,scout:35+Math.random()*40,army:120+Math.random()*120};warS.set(P.id,st);}for(const k in st)st[k]=Math.max(-5,st[k]-5);
  if(foes.filter(f=>f.war&&!f.dead).length>=26)return;
  if(Math.random()<0.55)warVolley(P);
  if(st.army<=0){st.army=240+Math.random()*180;st.raid=Math.max(st.raid,45);warArmy(P);}
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
