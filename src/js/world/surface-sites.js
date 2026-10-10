// ---- Ruined surface sites, old roads and ancient waystones (Q71, Q72, D-024)
// One site at most per region of SITE_REG x SITE_REG chunks (384 blocks): a watchtower, a keep or a castle of the men of old,
// ruined, on ground level enough to build on. Old roads link each site to its nearest neighbours and run to the hold gates.
// Some sites, and the first gate of every hold, have an ancient waystone (attuned in M4).
const SITE_REG=24,SITE_KINDS=[['tower',4.5],['keep',3.5],['castle',2]];
const siteC=new Map(),TS2={};
function siteAt(rx,rz){
  const key=ckey(rx,rz);if(siteC.has(key))return siteC.get(key);if(siteC.size>4000)siteC.clear();
  let s=null;const r=rngAt(rx,6601,rz);
  if(r()<0.7){
    let tot=0;for(const k of SITE_KINDS)tot+=k[1];let v=r()*tot,kind=SITE_KINDS[0][0];for(const k of SITE_KINDS){v-=k[1];if(v<=0){kind=k[0];break;}}
    const R=kind==='tower'?3+(r()*3|0):kind==='keep'?5+(r()*3|0):13+(r()*5|0),H=kind==='tower'?9+(r()*8|0):kind==='keep'?7+(r()*5|0):6+(r()*3|0),seed=r(),way=r()<0.45;
    // a strategic spot (Q96): towers and castles on the highest, most commanding ground of the candidates, keeps by a river or in a
    // pass; never in a hollow
    let best=-1e9;
    for(let t=0;t<14;t++){
      const X=rx*SITE_REG*CS+64+(r()*(SITE_REG*CS-128)|0),Z=rz*SITE_REG*CS+64+(r()*(SITE_REG*CS-128)|0);
      let lo=1e9,hi=-1e9,bad=false;
      for(let a=-1;a<=1&&!bad;a++)for(let b=-1;b<=1&&!bad;b++){colInfo(X+a*(R+1),Z+b*(R+1),TS2);if(TS2.wet||TS2.lake||TS2.river||TS2.rvBot<999||TS2.b===0||TS2.b===1||TS2.b===11||TS2.h<=SEA+2)bad=true;lo=Math.min(lo,TS2.h);hi=Math.max(hi,TS2.h);}
      if(bad||hi-lo>(kind==='castle'?7:5)||gateNear(X,Z,R+4))continue;
      let ring=0,river=0;for(let k=0;k<8;k++){const a=k*0.785;ring+=hAt(Math.round(X+Math.cos(a)*36),Math.round(Z+Math.sin(a)*36));
        for(const d of [20,40]){colInfo(Math.round(X+Math.cos(a)*d),Math.round(Z+Math.sin(a)*d),TS2);if(TS2.river||TS2.bank)river=1;}}
      const prom=hi-ring/8;if(prom<-1)continue;
      const score=kind==='keep'?river*12+prom*0.4:prom;
      if(score>best){best=score;s={kind:kind,X:X,Z:Z,R:R,H:H,g:hi,seed:seed,way:way};}
    }
    if(s){const rr=mkRng(Math.floor(s.seed*1e9)+5),nm=fullName('human',rr,false);
      s.name=s.kind==='tower'?'The Watchtower of '+nm:s.kind==='keep'?'The Ruined Keep of '+nm:'The Ruins of Castle '+nm;}
  }
  siteC.set(key,s);return s;
}
const siteOf=(X,Z)=>siteAt(Math.floor(X/CS/SITE_REG),Math.floor(Z/CS/SITE_REG));
// Is a surface column within a site's footprint (plus a margin, and its waystone)?
function siteNear(X,Z,m){
  const rx=Math.floor(X/CS/SITE_REG),rz=Math.floor(Z/CS/SITE_REG);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=siteAt(rx+a,rz+b);if(!s)continue;const e=s.R+(m||0)+(s.way?6:2);if(Math.abs(X-s.X)<=e&&Math.abs(Z-s.Z)<=e)return s;}
  return null;
}
// ---- Old roads: between each site and its two nearest neighbours (in the regions around it), and from each hold gate to the
// nearest site. Each road wanders about its straight line; a column is on it when its offset from the line is near the wander.
function siteLinks(s){
  if(s.links)return s.links;const rx=Math.floor(s.X/CS/SITE_REG),rz=Math.floor(s.Z/CS/SITE_REG),c=[];
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(!a&&!b)continue;const t=siteAt(rx+a,rz+b);if(t){const d=Math.hypot(t.X-s.X,t.Z-s.Z);if(d<650)c.push([d,t]);}}
  c.sort((p,q)=>p[0]-q[0]);s.links=c.slice(0,2).map(p=>p[1]);return s.links;
}
function nearestSite(X,Z){const rx=Math.floor(X/CS/SITE_REG),rz=Math.floor(Z/CS/SITE_REG);let best=null,bd=700;
  for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const t=siteAt(rx+a,rz+b);if(!t)continue;const d=Math.hypot(t.X-X,t.Z-Z);if(d<bd){bd=d;best=t;}}return best;}
const roadSegC=new Map();
// Road segments that may touch chunk (WCX,WCZ): [x0,z0,x1,z1], sorted endpoints so both chunks along a road agree
function roadSegs(WCX,WCZ){
  const key=ckey(WCX,WCZ);let segs=roadSegC.get(key);if(segs)return segs;if(roadSegC.size>4000)roadSegC.clear();
  segs=[];const seen=new Set(),X0=WCX*CS,Z0=WCZ*CS,M=24;
  const add=(ax,az,bx,bz)=>{if(ax>bx||(ax===bx&&az>bz)){[ax,bx]=[bx,ax];[az,bz]=[bz,az];}const k=ax+','+az+','+bx+','+bz;if(seen.has(k))return;seen.add(k);
    if(Math.max(ax,bx)+M<X0||Math.min(ax,bx)-M>X0+CS||Math.max(az,bz)+M<Z0||Math.min(az,bz)-M>Z0+CS)return;segs.push([ax,az,bx,bz]);};
  const rx=Math.floor(WCX/SITE_REG),rz=Math.floor(WCZ/SITE_REG);
  for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const s=siteAt(rx+a,rz+b);if(!s)continue;for(const t of siteLinks(s))add(s.X,s.Z,t.X,t.Z);}
  const hs=new Set();for(const [a,b] of [[-44,-44],[44,-44],[-44,44],[44,44],[0,0]])hs.add(holdNear(WCX+a,WCZ+b));
  for(const h of hs)for(const g of holdGates(h)){const gx=g.cx*CS+8,gz=g.cz*CS+8,t=nearestSite(gx,gz);if(t)add(gx,gz,t.X,t.Z);}
  roadSegC.set(key,segs);return segs;
}
function oldRoadAt(X,Z){
  for(const [ax,az,bx,bz] of roadSegs(Math.floor(X/CS),Math.floor(Z/CS))){
    const dx=bx-ax,dz=bz-az,L=Math.hypot(dx,dz);if(L<1)continue;const ux=dx/L,uz=dz/L,px=X+0.5-ax,pz=Z+0.5-az,t=px*ux+pz*uz;if(t<0||t>L)continue;
    const off=-px*uz+pz*ux,fade=Math.min(1,t/40,(L-t)/40),wob=fbm2((ax+ux*t)/110,(az+uz*t)/110,2,6701.3)*26*fade;
    if(Math.abs(off-wob)<1.6)return true;}
  return false;
}
// Lay the roads on the chunk's own columns: worn dirt path with old stones, off water, steep slopes, sites and gate terraces
// the ground of the new lands (M6) that a road is laid over, as over grass
const ROAD_GROUND=new Set([LITTER,NEEDLES,FMOSS,TMOSS,LIMESTONE,PSNOW,CHALK,BLACKSAND,PEAT,BOGMOSS,BASALT,GOLDGRASS,ASH,DEADGRASS,RSAND,CALCITE,PALEG,SCORCH]);
function applyRoads(lcx,lcz){
  const WCX=OX/CS+lcx,WCZ=OZ/CS+lcz;if(!roadSegs(WCX,WCZ).length)return;
  for(let z=0;z<CS;z++)for(let x=0;x<CS;x++){const X=WCX*CS+x,Z=WCZ*CS+z;if(!oldRoadAt(X,Z))continue;
    colInfo(X,Z,TS2);if(TS2.wet||TS2.lake||TS2.river||TS2.rvBot<999||TS2.h<=SEA)continue;const g=TS2.h;if(slopeAt(X,Z,g)>=3||siteNear(X,Z,0)||gateNear(X,Z,0))continue;
    const lx=lcx*CS+x,lz=lcz*CS+z,i=I(lx,g,lz),top=world[i];if(![GRASS,DIRT,SNOWG,SAND,GRAVEL,STONE,PATH].includes(top)&&!ROAD_GROUND.has(top))continue;
    const q=hsh(X,6702,Z);world[i]=q<0.1?COBBLE:q<0.22?GRAVEL:PATH;lvl[i]=0;
    const up=world[i+W*D];if(up&&BL[up].cross){world[i+W*D]=AIR;}}
}
// ---- Building a site (and its waystone); every chunk the site touches rebuilds it, clipped by PW
function applySites(WCX,WCZ){
  const rx0=Math.floor((WCX-2)/SITE_REG),rx1=Math.floor((WCX+2)/SITE_REG),rz0=Math.floor((WCZ-2)/SITE_REG),rz1=Math.floor((WCZ+2)/SITE_REG);
  for(let rx=rx0;rx<=rx1;rx++)for(let rz=rz0;rz<=rz1;rz++){const s=siteAt(rx,rz);if(!s)continue;const e=s.R+8;if(s.X+e<gx0||s.X-e>gx0+CS||s.Z+e<gz0||s.Z-e>gz0+CS)continue;buildSite(s);}
}
function waystoneP(X,Z,g){
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){PW(X+a,g,Z+b,SBRICK,MODE_SET);for(let y=g-1;y>g-6;y--)PW(X+a,y,Z+b,STONE,MODE_FILL);for(let y=g+1;y<=g+4;y++)PW(X+a,y,Z+b,AIR,MODE_SET);}
  PW(X,g+1,Z,WAYSTONE,MODE_SET);PW(X,g+2,Z,WAYSTONE,MODE_SET);PW(X,g+3,Z,CALCITE,MODE_SET);
}
function buildSite(s){
  const r=mkRng(Math.floor(s.seed*1e9)+9),X=s.X,Z=s.Z,R=s.R,g=s.g,H=s.H,stone=()=>{const q=r();return q<0.45?SBRICK:q<0.75?COBBLE:MOSSY;};
  // level ground: earth built up to the floor wherever the ground is lower (never floating), and open air above
  const pad=(x,z,floorId)=>{for(let y=g-1;y>g-12;y--){const c=GW(x,y,z);if(c<0||(SOLID[c]&&c!==LEAVES&&!BL[c].leaf))break;PW(x,y,z,DIRT,MODE_SET);}PW(x,g,z,floorId,MODE_SET);for(let y=g+1;y<=g+H+6;y++)PW(x,y,z,AIR,MODE_SET);};
  // the ground shaped around the site (Q96): an earth bank sloping down from the footprint, one block per block, instead of a plinth
  {const F=s.kind==='tower'?R+1.5:R+3.5;
    for(let dx=-Math.ceil(F)-8;dx<=Math.ceil(F)+8;dx++)for(let dz=-Math.ceil(F)-8;dz<=Math.ceil(F)+8;dz++){const x=X+dx,z=Z+dz;if(x<gx0||x>=gx0+CS||z<gz0||z>=gz0+CS)continue;
      const d=s.kind==='tower'?Math.hypot(dx,dz):Math.max(Math.abs(dx),Math.abs(dz)),out=d-F;if(out<=0||out>8)continue;
      colInfo(x,z,TS2);const gl=TS2.h,tgt=g-Math.ceil(out);if(tgt<=gl||TS2.wet)continue;const top=topBlock(TS2),cap=top===SNOWG||top===SAND||top===GRAVEL?top:GRASS;
      for(let y=gl;y<=tgt;y++)PW(x,y,z,y===tgt?cap:DIRT,y===gl?MODE_SET:MODE_FILL);}} // around tree trunks, never through them
  // Layouts (M6h, Q122): four plans for each kind, turned to face any of four ways, and more or less ruined (decay). The plan, the
  // facing and the decay come from the site's seed, so the stream above keeps its draws.
  const sk=Math.floor(s.seed*1e6),layout=Math.floor(hsh(sk,8801,1)*4),face=Math.floor(hsh(sk,8803,2)*4),decay=0.15+hsh(sk,8805,3)*0.6;
  const rx=(dx,dz)=>face===0?dx:face===1?-dz:face===2?-dx:dz,rz=(dx,dz)=>face===0?dz:face===1?dx:face===2?-dz:-dx;
  const P=(dx,y,dz,id,m)=>PW(X+rx(dx,dz),y,Z+rz(dx,dz),id,m===undefined?MODE_SET:m),pd=(dx,dz,id)=>pad(X+rx(dx,dz),Z+rz(dx,dz),id);
  const ragged=(x,z,h)=>Math.max(1,h-Math.floor(hsh(x,6603,z)*(2+6*decay))-(hsh(x,6604,z)<0.05+0.25*decay?h:0)); // broken wall tops and gaps
  const ring=(R2,h,gateOK)=>{for(let dx=-R2-1;dx<=R2+1;dx++)for(let dz=-R2-1;dz<=R2+1;dz++){const d=Math.hypot(dx,dz);if(d>R2+0.5||d<=R2-0.6)continue;if(gateOK&&dz>0&&Math.abs(dx)<=1)continue;const hh=ragged(X+dx,Z+dz,h),b0=Math.min(g,hAt(X+rx(dx,dz),Z+rz(dx,dz)));for(let y=b0-1;y<=b0+hh&&y<=g+hh;y++)P(dx,y,dz,stone());}}; // from the ground up, where the land falls away
  const roundTower=(cx,cz,R2,h,door)=>{for(let dx=-R2-1;dx<=R2+1;dx++)for(let dz=-R2-1;dz<=R2+1;dz++){const d=Math.hypot(dx,dz);if(d>R2+0.5)continue;pd(cx+dx,cz+dz,d>R2-0.6?stone():COBBLE);
      if(d>R2-0.6){const isDoor=door&&dz>R2-1.5&&dx===0,hh=Math.max(2,Math.round(h*(1-0.5*decay*hsh(X+cx+dx,6605,Z+cz+dz))));for(let y=1;y<=hh;y++)if(!(isDoor&&y<=2)&&hsh(X+cx+dx,g+y,Z+cz+dz)>0.05+0.3*decay*y/h)P(cx+dx,g+y,cz+dz,stone());}}};
  if(s.kind==='tower'){
    if(layout===1){ // a square tower
      for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++){const m=Math.max(Math.abs(dx),Math.abs(dz));pd(dx,dz,m===R?stone():COBBLE);
        if(m===R){const door=dz===R&&dx===0,hh=Math.max(2,Math.round(H*(1-0.5*decay*hsh(X+dx,6605,Z+dz))));for(let y=1;y<=hh;y++)if(!(door&&y<=2)&&hsh(X+dx,g+y,Z+dz)>0.05+0.3*decay*y/H)P(dx,g+y,dz,stone());}}}
    else roundTower(0,0,R,H,true);
    if(layout===2)ring(R+4,3,true); // a low ring wall round it
    if(layout===3){const r2=Math.max(2,R-1);roundTower(R+r2+2,0,r2,H-3,false);for(let t=R;t<=R+2;t++)for(let y=1;y<=3;y++)P(t,g+y,0,stone());} // a lesser tower joined to it
    for(let y=4;y<H-1;y+=4)for(let dx=-R+1;dx<=R-1;dx++)for(let dz=-R+1;dz<=R-1;dz++)if((layout===1||Math.hypot(dx,dz)<R-0.6)&&hsh(X+dx,g+y,Z+dz)<0.55)P(dx,g+y,dz,PLANKS); // what is left of the floors
    P(0,g+1,-R+1,CRATE);P(1,g+1,0,DTORCH);
  }else{
    const wallH=H,inner=s.kind==='castle'&&layout!==3?5:0,round=s.kind==='keep'&&layout===1,roundCorners=s.kind==='castle'&&layout===2;
    for(let dx=-R-3;dx<=R+3;dx++)for(let dz=-R-3;dz<=R+3;dz++){const m=round?Math.hypot(dx,dz):Math.max(Math.abs(dx),Math.abs(dz)),cx=!round&&Math.abs(dx)>=R-2&&Math.abs(dz)>=R-2;
      if(m>R+(cx?2:0)+(round?0.5:0))continue;
      const corner=!round&&Math.abs(Math.abs(dx)-R)<=2&&Math.abs(Math.abs(dz)-R)<=2,towerWall=corner&&(roundCorners?Math.abs(Math.hypot(Math.abs(dx)-R,Math.abs(dz)-R)-2)<0.7:(Math.abs(Math.abs(dx)-R)===2||Math.abs(Math.abs(dz)-R)===2));
      if(roundCorners&&corner&&Math.hypot(Math.abs(dx)-R,Math.abs(dz)-R)>2.5)continue;
      const wall=round?m>R-0.6:m===R;
      pd(dx,dz,!wall&&!towerWall?(s.kind==='castle'?GRASS:hsh(X+dx,g,Z+dz)<0.3?PLANKS:COBBLE):stone());
      const gate=Math.abs(dx)<=1&&dz>0&&wall; // the gateway
      let h=0;if(towerWall)h=ragged(X+dx,Z+dz,wallH+(roundCorners?6:4));else if(wall&&!corner)h=gate?0:ragged(X+dx,Z+dz,wallH);
      for(let y=1;y<=h;y++)P(dx,g+y,dz,stone());
      if(gate)for(let y=4;y<=5&&wallH>5;y++)P(dx,g+y,dz,stone());}
    if(s.kind==='keep'&&layout===3)for(const side of [-1,1])for(let a=0;a<=2;a++)for(let b=0;b<=2;b++)if(R-1+b>R)pd(side*(2+a),R-1+b,stone()); // standing on levelled ground
    if(s.kind==='keep'&&layout===3)for(const side of [-1,1])for(let a=0;a<=2;a++)for(let b=0;b<=2;b++)for(let y=1;y<=ragged(X+side*3,Z+R,wallH+3);y++)if(a!==1||b!==1)P(side*(2+a),g+y,R-1+b,stone()); // a gatehouse of two little towers
    if(s.kind==='keep'&&layout===2){for(let dx=-R+2;dx<=R-2;dx++)for(let dz=-R+1;dz<=-R+5;dz++){const e=Math.abs(dx)===R-2||dz===-R+1||dz===-R+5;P(dx,g,dz,PLANKS);if(e&&!(dz===-R+5&&dx===0))for(let y=1;y<=ragged(X+dx,Z+dz,4);y++)P(dx,g+y,dz,stone());else if(!e&&hsh(X+dx,8807,Z+dz)<0.4)P(dx,g+5,dz,PLANKS);}} // a hall inside the walls
    if(s.kind==='castle'&&layout===1)ring(R+3,3,true); // an outer ring wall
    if(inner){ // the castle's own keep in the middle, its door facing the gate
      for(let dx=-inner;dx<=inner;dx++)for(let dz=-inner;dz<=inner;dz++){const m=Math.max(Math.abs(dx),Math.abs(dz));P(dx,g,dz,m<inner?PLANKS:stone());
        if(m===inner){const door=Math.abs(dx)<=0&&dz===inner,h=ragged(X+dx,Z+dz,H+5);for(let y=1;y<=h;y++)if(!(door&&y<=3))P(dx,g+y,dz,stone());}}
      P(-inner+1,g+1,-inner+1,CRATE);P(inner-1,g+1,-inner+1,BARREL);P(0,g+1,-inner+1,DWCHEST);
    }else if(s.kind==='castle'){ // a great hall at the back of the courtyard and a dry well before it
      for(let dx=-5;dx<=5;dx++)for(let dz=-R+2;dz<=-R+8;dz++){const e=Math.abs(dx)===5||dz===-R+2||dz===-R+8;P(dx,g,dz,PLANKS);if(e&&!(dz===-R+8&&Math.abs(dx)<=1))for(let y=1;y<=ragged(X+dx,Z+dz,H+2);y++)P(dx,g+y,dz,stone());}
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(a||b){P(a,g+1,b+2,COBBLE);P(a,g,b+2,COBBLE);}P(0,g,2,AIR);P(0,g-1,2,AIR);P(0,g-2,2,GRAVEL);
      P(-4,g+1,-R+3,CRATE);P(4,g+1,-R+3,BARREL);P(0,g+1,-R+3,DWCHEST);
    }else{P(-R+1,g+1,-R+1,CRATE);P(R-1,g+1,-R+1,BARREL);P(R-1,g+1,-R+2,BARREL);
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(a||b)P(a,g+1,b-2,COBBLE);P(0,g+1,-2,DTORCH);} // a cold hearth
    for(let k=0;k<8;k++){const a=(r()*(2*R-3)|0)-R+2,b=(r()*(2*R-3)|0)-R+2,hh=1+(r()*2|0);for(let y=1;y<=hh;y++)P(a,g+y,b,y===1?GRAVEL:COBBLE,MODE_AIR);} // rubble
  }
  if(s.way)waystoneP(X+s.R+4,Z,s.g);
}
// What to call a place on the surface
function surfaceName(X,Y,Z){
  const s=siteNear(X,Z,1);if(s){if(s.way&&Math.abs(X-(s.X+s.R+4))<=2&&Math.abs(Z-s.Z)<=2)return 'An Ancient Waystone';return s.name;}
  const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);if(gateNear(X,Z,0))return 'The Gate of '+holdOf(cx,cz).name;
  if(stairwayNear(X,Z,1))return 'A Ruined Stairway';
  const sg=sigNear(X,Z,0);if(sg)return sg.name; // the lands' landmarks and features (M6) are places
  const sm=smallNear(X,Z,-4);if(sm)return SMALL_NAMES[sm.kind];
  if(oldRoadAt(X,Z))return 'An Old Road';
  {const ci=Math.floor(X/VOLC_C),cj=Math.floor(Z/VOLC_C);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const v=volcCand(ci+a,cj+b)&&volcAt(ci+a,cj+b);if(v&&Math.hypot(X-v.X,Z-v.Z)<v.R*0.9)return v.name;}} // the volcanoes (D-051)
  return null;
}
