// ---- The hidden way and the war under the gate (D-085, D-086).
//
// The hidden way (hidLayout, siege-build.js): every minute or so while the player is near a gate that stands (sooner when they are
// by either of its mouths), a company of the hosts' best (the elves' blade masters, the wood's sharpshooters and wardens, now and
// then a household knight) sets out from the Leaguer's front gate, goes round the boulders into the passage and through it
// unseen (f.sneak: they look for no foe until they are out), comes out behind the rubble in the yard's wall and falls on the orcs'
// camp. In its chamber a few more wait their turn. The player who walks into it finds it (the discovery log).
//
// The war under the gate: the dwarves' mine and the goblins' countermine have met under the pass, in the Broken Gallery
// (warGallery, war-works.js), and there a battle goes on without end. While the player is down in the tunnels within reach of it,
// each side is kept up to its strength: axes, hammers, ironclads, crossbows and sappers of the mountain come up the mine from its
// shaft, and goblin cutters, slingers, skulkers, firecallers and pot-throwers (a chieftain now and then) up the countermine from
// the yard, from as far off as is out of the player's sight, and fall to in the gallery; the fallen lie a while (WAR_LIE).
Object.assign(FOE_HOME,{x_infil:[['eblade',2],['wlong',2],['wbow',1.2],['rguard',0.4]],x_hid:[['eblade',1],['wlong',1],['wbow',1]],
  d_mine:[['daxe',3],['dhammer',2],['diron',1],['dxbow',1.5],['dsapper',1]],g_mine:[['goblin',5],['gslinger',2],['gswarm',2],['gfire',1],['gpot',0.6]]});
Object.assign(FOLK_N,{hid:[2,3]});CAMP_ACT.x_hid='rest';
let hidT=25,underT=0;
// once a second (from warTick): the parties through the hidden way, and its finding
function hidTick(){const X=PL.x+OX,Z=PL.z+OZ,P=wasteGateAt(Math.floor(X),Math.floor(Z),160);if(!P)return;const s=wgSite(P),H=P.hid;if(!H)return;
  const [pu,pv]=wgUV(P,X,Z);if(wgLineD(H.line,pu,pv)<=2&&Math.abs(PL.y-P.hG-1)<3&&discover('s',H.n))toast('A secret way of the hosts through the ring of mountains');
  if((hidT-=1)>0)return;hidT=8;const w=WARS.get(P.id);if(!w||w.s>=2||!warAuto('a')||warLive()>=warCap()-10)return;
  const near=[[H.uo,H.vA],[H.ut,H.vY]].some(([u,v])=>Math.hypot(u-pu,v-pv)<45),G=hidSend(P);
  if(G){hidT=near?25+Math.random()*15:50+Math.random()*40;if(Math.hypot(G[0].x-PL.x,G[0].z-PL.z)<50)toast('A company of the hosts\' best slips away along the lines');}}
// sends a company along the hidden way from the first point of its route that is out of the player's sight (18 to 85 off) and
// loaded; its last point is the middle of the orcs' camp in the yard. Null if none.
function hidSend(P){const s=wgSite(P),H=P.hid;if(!H)return null;const yc=P.yc,R=H.route.concat([[Math.round((yc.ua+yc.ub)/2),yc.vm]]).map(p=>{const [X,Z]=siteXZ(s,p[0],p[1]),o=[X+0.5,Z+0.5];if(p[2])o[2]=1;if(p[3])o.out=1;return o;});
  for(let k=0;k<4;k++){const x=R[k][0]-OX,z=R[k][1]-OZ,bx=Math.floor(x),bz=Math.floor(z),d=Math.hypot(x-PL.x,z-PL.z);
    if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX]||d<18||d>85)continue;
    const G=spawnGroup('x_infil',4+Math.floor(Math.random()*3),x,ground[bx+W*bz],z,2.5,{prov:'wg:'+P.id,site:s,lead:null});if(!G.length)return null;
    for(const f of G){f.war=P.id;f.hid=P.id;f.sneak=1;f.way=R.slice(k+1);const w0=f.way.shift();warAim(f,w0);f.wp=w0;f.st='return';f.t=20;}
    return G;}
  return null;}
// every frame below the gate's level near the gallery (from warMineFight): each side brought up to its strength every three seconds
const underN=()=>[Math.round(8+6*warSz()),Math.round(10+8*warSz())];
function warUnderBattle(dt,P,w){if((underT-=dt)>0)return;underT=3;const M=warMinePts(P),mid=warMineMid(P),g=P.hG,[N0,N1]=underN(),c=wgXZ(P,Math.round(mid[0]),Math.round(mid[1]));
  let nd=0,ng=0;for(const f of foes)if(!f.dead&&f.mine===P.id){if(FOES[f.kind].folk)nd++;else ng++;}
  for(const [folk,n,N,tab,from] of [[1,nd,N0,'d_mine',M.A],[0,ng,N1,'g_mine',M.C]]){if(n>=N)continue;
    // the farthest dug point of its tunnel, at least 14 from the player and 10 from the gallery (out of sight round the tunnel)
    let best=null,bd=-1;for(let t=0.1;t<=0.9;t+=0.1){const u=Math.round(from[0]+(mid[0]-from[0])*t),v=Math.round(from[1]+(mid[1]-from[1])*t),[X,Z]=wgXZ(P,u,v),x=X+0.5-OX,z=Z+0.5-OZ,bx=Math.floor(x),bz=Math.floor(z);
      if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX]||get(bx,g-9,bz)!==AIR||get(bx,g-10,bz)===AIR||Math.hypot(u-mid[0],v-mid[1])<10)continue;
      const d=Math.hypot(x-PL.x,z-PL.z);if(d>=14&&d<70&&d>bd){bd=d;best=[x,z];}}
    if(!best)continue;const G=spawnGroup(tab,Math.min(4,N-n),best[0],g-9,best[1],1.2,folk?{prov:'wg:'+P.id,site:wgSite(P),lead:null}:{lead:Math.random()<0.15?'gchief':null});
    for(const f of G){f.mine=P.id;f.war=P.id;f.way=[[c[0]+0.5+(Math.random()-0.5)*6,c[1]+0.5+(Math.random()-0.5)*6]];const w0=f.way.shift();warAim(f,w0);f.wp=w0;f.st='return';f.t=20;}}}
