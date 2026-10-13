// ---- The works of the war (W2, D-069; Q142, Q146, Q149, Q154 to Q157). What the war does to the world follows from each gate's
// war (war-state.js) and is made through setBlock, so it is saved like the player's own changes, whenever the works are in the
// loaded world, a slice at a time (`warJob`): the barred leaf broken a step at a time by the ram (`warLeafCells`); the dwarves'
// mine dug under the ring from behind the siege lines toward the tower on the barred side and the goblins' countermine dug from the
// yard to meet it (`warMineCells`, walled all round like the dwarves' workings so no cave's water or lava comes in); ladders on the
// towers' faces and breaches in them as the assaults win the walls; graves and cairns behind the lines, one for every two of the
// hosts who fall there (`warGraveCells`); works set on fire by the orcs' pots, burning, charred, and in time rebuilt (`warIgnite`);
// and at the gate's fall (`warFall`), when all four efforts are done and the hosts come against the gate, the leaf shattered, the
// mine fired and the tower above it brought down in a heap of rubble, the orcs' camp in the yard burned, the banners of the three
// peoples hung on the tower left standing, and victory fires in the Leaguer. The ram's crew swings it (`warRamTick`), a siege tower
// is wheeled up to the wall (`warSiegeTower`), soldiers climb the ladders and the tower to the gate's walk (`f.climb`), the orcs
// pour burning pitch and drop stones on them from the walk (`warPitch`), sappers and goblins fight where the tunnels meet
// (`warMineFight`), the fallen lie a while (`WAR_LIE`) and crows come down to them (`warCrows`).
const WJ=[]; // jobs of block changes: {c: [[X, y, Z, id]...], i, n (cells a frame), done(all: no cell was out of the generated world)}
function warJob(cells,n,done){if(!cells.length){if(done)done(true);return;}WJ.push({c:cells,i:0,n:n||600,done:done,miss:0});}
function warJobsFrame(){const J=WJ[0];if(!J)return;let k=0;
  while(J.i<J.c.length&&k<J.n){const [X,y,Z,id]=J.c[J.i++],x=X-OX,z=Z-OZ;k++;if(x<0||z<0||x>=W||z>=D||y<1||y>=H||!genDone[(x>>4)+(z>>4)*NCX]){J.miss=1;continue;}if(get(x,y,z)!==id)setBlock(x,y,z,id,true);}
  if(J.i>=J.c.length){WJ.shift();if(J.done)J.done(!J.miss);}}
const warSet=(cells,P,u,v,y,id)=>{const [X,Z]=wgXZ(P,u,v);cells.push([X,y,Z,id]);};
// is a box of the gate's frame (u0..u1, v0..v1) loaded and generated?
function warLoaded(P,u0,u1,v0,v1){for(const u of [u0,(u0+u1)/2,u1])for(const v of [v0,(v0+v1)/2,v1]){const [X,Z]=wgXZ(P,Math.round(u),Math.round(v)),x=X-OX,z=Z-OZ;
  if(x<0||z<0||x>=W||z>=D||!genDone[(x>>4)+(z>>4)*NCX])return false;}return true;}
// the top of the ground at a point of the frame (a block's y), or -1 outside the loaded world
const warTop=(P,u,v)=>{const [X,Z]=wgXZ(P,Math.round(u),Math.round(v)),x=X-OX,z=Z-OZ;return x<0||z<0||x>=W||z>=D?-1:ground[x+W*z];};
// ---- The barred leaf: a hole beaten through it about where the ram strikes, wider at each quarter of the ram's work; at the fall,
// shattered, a few splinters left hanging and the wreck of it and its props thrown down behind
function warLeafCells(P,L){const g=P.hG,cs=P.cs,out=[],R=[0,1.8,3.2,5,99][L];
  for(let sv=1;sv<=20;sv++){const v=sv*cs,top=wgArch(g,sv);for(let u=-1;u<=1;u++)for(let y=g+1;y<top;y++){const [X,Z]=wgXZ(P,u,v),q=hsh(X*3+y,9871,Z);
    const d=Math.hypot(sv-10,(y-g-5)*0.8)+(q-0.5)*1.6;
    if(L>=4?q>0.12:d<R)out.push([X,y,Z,AIR]);else if(L<4&&d<R+1.2&&u===-1)out.push([X,y,Z,CHARWOOD]);}}
  if(L>=4){for(const sv of [4,5,11,12,17,18])for(let u=-14;u<=-2;u++){const pr=Math.round(g+13-(-2-u)*1.1);for(const y of [pr,pr-1])warSet(out,P,u,sv*cs,y,AIR);}
    for(let sv=1;sv<=19;sv++)for(let u=-9;u<=-2;u++){const [X,Z]=wgXZ(P,u,sv*cs),q=hsh(X,9873,Z);if(q<0.2)out.push([X,g+1,Z,q<0.1?ORCLOG:GATEIRON]);}}
  return out;}
// ---- The mine: from a shaft behind the siege lines (under its headframe) under the pass to a chamber under the tower on the barred
// side, three wide and three high at nine under the gate's level, propped every four, a lamp every twelve; the countermine from a
// hole in the yard to meet it four fifths of the way. Each carved as far as its effort has come, only where rock covers it, and its
// walls, floor and roof made sound wherever they would open on air, water or lava
const warMinePts=P=>({A:[P.uL+16,P.cs*66],B:[2,P.cs*28],C:[-14,P.cs*42]});
const WAR_MEET=0.6,warMineMid=P=>{const M=warMinePts(P);return [M.A[0]+(M.B[0]-M.A[0])*WAR_MEET,M.A[1]+(M.B[1]-M.A[1])*WAR_MEET];}; // where the countermine meets the mine (three fifths of its way since D-086)
function warTunnel(P,a,b,t0,t1,out,props){const g=P.hG,y0=g-9,L=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/L,uv=(b[1]-a[1])/L,inn=new Map(),sh=new Map();
  for(let s=t0*L;s<=t1*L;s+=0.5){const cu=a[0]+ux*s,cv=a[1]+uv*s;
    for(let o=-2;o<=2;o+=0.5){const u=Math.round(cu-uv*o),v=Math.round(cv+ux*o),k=u+','+v;if(Math.abs(o)<=1.25){if(!inn.has(k))inn.set(k,[u,v,s,o]);}else if(!sh.has(k))sh.set(k,[u,v]);}}
  const sound=(u,v,y)=>{const [X,Z]=wgXZ(P,u,v),x=X-OX,z=Z-OZ;if(x>=0&&z>=0&&x<W&&z<D&&!SOLID[get(x,y,z)])out.push([X,y,Z,BASALT]);};
  for(const [u,v,s,o] of inn.values()){if(warTop(P,u,v)<y0+4)continue; // (never where it would break the surface)
    const pr=props&&Math.floor(s)%4===0,lamp=props&&Math.floor(s)%12===6;sound(u,v,y0-1);sound(u,v,y0+3);
    for(let y=y0;y<=y0+2;y++){let id=AIR;if(pr&&Math.abs(o)>=0.75)id=y===y0+2?PLANKS:DPROP;if(pr&&y===y0+2)id=PLANKS;if(lamp&&o>=0.75&&y===y0+1&&!pr)id=DLAMP;warSet(out,P,u,v,y,id);}}
  for(const [k,[u,v]] of sh)if(!inn.has(k)&&warTop(P,u,v)>=y0+4)for(let y=y0-1;y<=y0+3;y++)sound(u,v,y);}
function warShaft(P,c,out,frame){const g=P.hG,top=Math.max(g-8,warTop(P,c[0],c[1]));
  for(let du=-1;du<=1;du++)for(let dv=-1;dv<=1;dv++)for(let y=g-9;y<=top;y++)warSet(out,P,c[0]+du,c[1]+dv,y,du===1&&dv===0?LADDER:AIR);
  if(frame){for(const du of [-2,2])for(const dv of [-2,2])for(let y=top+1;y<=top+4;y++)warSet(out,P,c[0]+du,c[1]+dv,y,DPROP);for(let d=-2;d<=2;d++){warSet(out,P,c[0]+d,c[1]-2,top+5,PLANKS);warSet(out,P,c[0]+d,c[1]+2,top+5,PLANKS);}
    for(let d=-1;d<=1;d++)warSet(out,P,c[0],c[1]+d,top+6,PLANKS);}
  else for(let d=-2;d<=2;d++)for(const e of [-2,2]){warSet(out,P,c[0]+d,c[1]+e,top+1,STAKES);warSet(out,P,c[0]+e,c[1]+d,top+1,STAKES);}}
function warMineCells(P,me,cm){const M=warMinePts(P),out=[],mid=warMineMid(P),g=P.hG;
  if(me>0){warShaft(P,M.A,out,true);warTunnel(P,M.A,M.B,0,Math.min(1,me),out,true);}
  if(me>=1)for(let du=-2;du<=2;du++)for(let dv=-2;dv<=2;dv++)for(let y=g-9;y<=g-7;y++)warSet(out,P,M.B[0]+du,M.B[1]+dv,y,y===g-9&&Math.abs(du)<=1&&Math.abs(dv)<=1&&(du+dv)%2===0?TNT:AIR);
  if(cm>0){warShaft(P,M.C,out,false);warTunnel(P,M.C,mid,0,Math.min(1,cm),out,false);}
  if(cm>=1&&me>=WAR_MEET)warGallery(P,mid,me,out);
  return out;}
const warCm=w=>Math.max(0,Math.min(1,(warEff(w,'mine')-0.25)/0.3)); // the goblins dig to meet the mine from a quarter of its way, and are there first (D-086)
// The Broken Gallery (D-086): where the two met, the fighting has dug out a long low hall about the meeting, five high, under the
// pass; propped on the dwarves' side and lit by their lamps, heaped with rubble and the goblins' leavings on the other, a brazier; its walls,
// floor and roof made sound as the tunnels' are, and only where rock covers it
function warGallery(P,c,me,out){const g=P.hG,y0=g-9,M=warMinePts(P),L=Math.hypot(M.B[0]-M.A[0],M.B[1]-M.A[1]),au=(M.B[0]-M.A[0])/L,av=(M.B[1]-M.A[1])/L,
    E=[M.A[0]+(M.B[0]-M.A[0])*Math.min(1,me),M.A[1]+(M.B[1]-M.A[1])*Math.min(1,me)],way=(u,v)=>wgLineD([M.A,E],u,v)<=1.6||wgLineD([M.C,c],u,v)<=1.6; // (the tunnels run on through it)
  const sound=(u,v,y)=>{const [X,Z]=wgXZ(P,u,v),x=X-OX,z=Z-OZ;if(x>=0&&z>=0&&x<W&&z<D&&!SOLID[get(x,y,z)])out.push([X,y,Z,BASALT]);},inn=new Set();
  for(let du=-9;du<=9;du++)for(let dv=-9;dv<=9;dv++){const u=Math.round(c[0])+du,v=Math.round(c[1])+dv,a=du*au+dv*av,b=-du*av+dv*au,q=hsh(u*7,9881,v);
    if(Math.hypot(a/8,b/4.5)>1+(q-0.5)*0.15||warTop(P,u,v)<y0+7)continue;inn.add(u+','+v);sound(u,v,y0-1);sound(u,v,y0+5);
    const prop=Math.abs(Math.abs(a)-4)<0.5&&Math.abs(Math.abs(b)-2.5)<0.5,dw=a<0; // (the dwarves came from A: a < 0)
    for(let y=y0;y<=y0+4;y++){let id=AIR;if(prop)id=y===y0+4?PLANKS:dw?DPROP:CHARWOOD;else if(dw&&Math.abs(b)<0.6&&(Math.abs(a+4)<0.6||Math.abs(a+7)<0.6)&&y===y0+4)id=DLAMP;else if(!dw&&y===y0&&Math.abs(a-5)<0.6&&Math.abs(b+2.5)<0.6)id=BRAZIER;
      else if(!dw&&y===y0&&q<0.18)id=q<0.06?SKULLS:q<0.12?GRAVEL:COBBLE;else if(dw&&y===y0&&Math.abs(a+6)<0.6&&Math.abs(b-2)<0.6)id=DCART;warSet(out,P,u,v,y,id);}}
  for(let du=-10;du<=10;du++)for(let dv=-10;dv<=10;dv++){const u=Math.round(c[0])+du,v=Math.round(c[1])+dv;if(inn.has(u+','+v))continue;
    if(!way(u,v)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([e,f])=>inn.has((u+e)+','+(v+f))))for(let y=y0-1;y<=y0+5;y++)sound(u,v,y);}}
// ---- Ladders and breaches: as the assaults win the walls, ladders stand against the towers' outer faces (two at each quarter: up
// the battered foot, then the face), and from the half a breach is beaten through each one's wall into the tower at the height of
// the walk, from where the door onto the walk is open to them
const WAR_LAD=[[26,1],[30,-1],[24,1],[32,-1],[28,1],[28,-1],[30,1],[26,-1]];
function warLadderCells(P,q){const g=P.hG,out=[];for(let i=0;i<Math.min(8,q*2);i++){const [av,sd]=WAR_LAD[i],v=av*sd;
    for(let y=g+1;y<=g+6;y++)warSet(out,P,11,v,y,LADDER);for(let y=g+7;y<=g+49;y++)warSet(out,P,10,v,y,LADDER);
    if(q>=2)for(let u=7;u<=9;u++)for(let y=g+49;y<=g+51;y++)warSet(out,P,u,v,y,AIR);}return out;}
// ---- Graves: in rows on the field between the trebuchets and the camp, on the barred side, then the other; every tenth a cairn
const WAR_GRAVES=120;
function warGraveCells(P,n0,n1){const out=[],cs=P.cs;
  for(let i=n0;i<n1&&i<WAR_GRAVES;i++){const half=Math.floor(i/60),j=i%60,r=Math.floor(j/10),c=j%10,u=P.uL+30+r*3,v=(half?-cs:cs)*(54+c*4),y=warTop(P,u,v)+1;if(y<1)continue;
    if(i%10===9){for(let a=0;a<2;a++)for(let b=0;b<2;b++)warSet(out,P,u+a,v+b,y,COBBLE);warSet(out,P,u,v,y+1,MOSSY);}
    else{warSet(out,P,u,v,y,STONE);warSet(out,P,u,v,y+1,STONE);warSet(out,P,u+1,v,y,GRAVEL);}}
  return out;}
// ---- Fire: the works that burn (wood, cloth, hide, hay, stakes, banners) about a point catch; each burns half a minute or so, then
// is charred (wood) or gone (cloth, hide, hay), and fifteen minutes of play later it is rebuilt. Burning and charred cells smoke.
const WAR_BURN=new Set([LOG,PLANKS,TIMBER,ORCLOG,STAKES,CANVAS,HIDE,HAYBALE,WOOLW,WOOLR,WOOLB,WOOLY,WOOLK,WOOLG,MANTLET,DPROP,RBANNER,DBANNER,EVBANNER,HBANNER,WBANNER]),
  WAR_CLOTH=new Set([CANVAS,HIDE,HAYBALE,WOOLW,WOOLR,WOOLB,WOOLY,WOOLK,WOOLG,RBANNER,DBANNER,EVBANNER,HBANNER,WBANNER]);
// the war of the gate whose works are about a point (window coordinates), or null
const warAtGate=(x,z)=>{const P=wasteGateAt(Math.floor(x+OX),Math.floor(z+OZ),200);return P?WARS.get(P.id)||null:null;};
function warIgnite(w,x,y,z,r,cap){if(!w)return 0;if(!w.bn)w.bn=[];let n=0;const bx=Math.floor(x),by=Math.floor(y),bz=Math.floor(z),R=Math.ceil(r),have=new Set(w.bn.map(e=>e[0]));
  for(let dy=-R;dy<=R&&n<cap;dy++)for(let dz=-R;dz<=R&&n<cap;dz++)for(let dx=-R;dx<=R&&n<cap;dx++){if(dx*dx+dy*dy+dz*dz>r*r)continue;const X=bx+dx,Y=by+dy,Z=bz+dz;if(X<0||Z<0||X>=W||Z>=D||Y<1||Y>=H)continue;
    const id=world[I(X,Y,Z)];if(!WAR_BURN.has(id))continue;const k=X+OX+','+Y+','+(Z+OZ);if(have.has(k))continue;if(w.bn.length>=400)return n;
    w.bn.push([k,id,Math.round(warPlay),0]);have.add(k);n++;}
  if(n){burst(0.9,'lowpass',500,0.7,0.3,0,[x,y,z]);saveDirty=true;}return n;}
// every frame: flames and smoke from what burns near, the end of each burning (a second at a time), the rebuilding of what burned
// long ago
let warFireT=0;
function warFireFrame(dt){warFireT-=dt;const tick=warFireT<=0;if(tick)warFireT=1;
  for(const w of WARS.values())for(const B of [w.bn,w.rb]){if(!B||!B.length)continue; // (the works' fires, and the raids' on the realms, W6)
    for(let i=B.length-1;i>=0;i--){const e=B[i],[X,Y,Z]=e.c||(e.c=e[0].split(',').map(Number)),x=X-OX,z=Z-OZ,inW=x>=0&&z>=0&&x<W&&z<D,age=warPlay-e[2];if(age<0)continue; // (not yet caught)
      if(inW&&Math.hypot(x-PL.x,z-PL.z)<90){if(!e[3]&&Math.random()<dt*6){spawnP(x+Math.random(),Y+0.8,z+Math.random(),(Math.random()-.5)*0.4,1.6+Math.random(),(Math.random()-.5)*0.4,[1,0.45+Math.random()*0.35,0.08],0.6,-1.2);
          if(Math.random()<0.5)spawnP(x+0.5,Y+1.6,z+0.5,(Math.random()-.5)*0.3,0.9,(Math.random()-.5)*0.3,[0.28,0.27,0.26],2.6,-0.25);if(Math.random()<dt*0.6)AMB_EV.crackle([x,Y,z]);}
        else if(e[3]&&age<e[3]+120&&Math.random()<dt*0.5)spawnP(x+0.5,Y+0.6,z+0.5,(Math.random()-.5)*0.2,0.6,(Math.random()-.5)*0.2,[0.3,0.3,0.3],3,-0.15);}
      if(!tick||!inW||!genDone[(x>>4)+(z>>4)*NCX])continue;
      if(!e[3]&&age>25+(X*7+Z*3+Y)%15){e[3]=Math.max(1,Math.round(warPlay)-e[2]);if(get(x,Y,z)===e[1])setBlock(x,Y,z,WAR_CLOTH.has(e[1])?AIR:CHARWOOD,true);saveDirty=true;}
      else if(e[3]&&age>(B===w.rb?RAID_REB:e.q?300:900)){const c=get(x,Y,z);if(c===AIR||c===CHARWOOD)setBlock(x,Y,z,e[1],true);B.splice(i,1);saveDirty=true;}}}}
// ---- The ram (Q155): while its crew stands by it and the war at its gate goes on, a blow every three and a half seconds: the crew
// heave together, the beam booms on the leaf, the ground shakes near, dust and splinters fly from the leaf
let warRamT=0,warRamBlow=-9;
function warRamTick(dt,P,w){if(w.s>=2)return;warRamT-=dt;if(warRamT>0)return;warRamT=3.5;
  const [rx,rz]=wgXZ(P,16,P.cs*10),x=rx-OX,z=rz-OZ;if(Math.hypot(x-PL.x,z-PL.z)>70)return;
  const crew=foes.filter(f=>!f.dead&&!f.foe&&f.kind[0]==='d'&&FOES[f.kind].folk&&!FOES[f.kind].civ&&Math.hypot(f.x-x,f.z-z)<12);if(crew.length<2)return;
  const face=Math.atan2(-P.dx,-P.dz);for(const f of crew)if(!f.atk){f.atk=0.4;f.atkK='heave';f.yaw=f.hd=face;} // they heave together
  const [lx,lz]=wgXZ(P,1,P.cs*10),hx=lx-OX+0.5,hz=lz-OZ+0.5,y=P.hG+5,d=Math.hypot(hx-PL.x,hz-PL.z);warRamBlow=foeClock;
  setTimeout(()=>{sfxBoom(d*1.4,[hx,y,hz]);tone(46,38,0.9,0.18,0,'sine',[hx,y,hz]);burst(0.25,'bandpass',300,1.2,0.25,0.02,[hx,y,hz]);shake=Math.max(shake,Math.max(0,0.5*(1-d/40)));
    for(let k=0;k<22;k++)spawnP(hx+(Math.random()-.5)*3,y+(Math.random()-.5)*3,hz+(Math.random()-.5)*3,(Math.random()-.5)*3,Math.random()*2.5,(Math.random()-.5)*3,k%3?[0.42,0.38,0.32]:[0.2,0.16,0.12],1.2,6);},400);}
// ---- From the gate's walk (Q156): while the orcs hold the walk and the hosts press at the gate's foot, now and then burning pitch
// poured over the parapet or a stone dropped: the pitch burns those of the hosts within 2.5 of where it falls (10), the stone
// strikes those within 1.6 (12); either hurts a player in survival under it. The ram's crew are safe under its shed's bronze roof.
let warPitchT=0;
function warPitch(dt,P,w){if(w.s>=2)return;warPitchT-=dt;if(warPitchT>0)return;warPitchT=5+Math.random()*4;
  const g=P.hG,foot=foes.filter(f=>{if(f.dead||f.climb||!FOES[f.kind].folk||FOES[f.kind].civ||Math.abs(f.y-g-1)>3)return false;const [u,v]=wgUV(P,f.x+OX,f.z+OZ);return u>=3&&u<=16&&Math.abs(v)<=36&&!(u>=2&&Math.abs(v*P.cs-10)<=7);});
  const walk=foes.filter(f=>!f.dead&&!FOES[f.kind].folk&&f.y>g+40&&Math.hypot(f.x-PL.x,f.z-PL.z)<110);if(!foot.length||!walk.length)return;
  const t=foot[Math.floor(Math.random()*foot.length)],v=wgUV(P,t.x+OX,t.z+OZ)[1],tw=Math.abs(v)>20,[X,Z]=wgXZ(P,tw?10:3,Math.round(v)),x=X-OX+0.5,z=Z-OZ+0.5,tx=t.x,tz=t.z,top=tw?g+65:g+49;
  if(Math.random()<0.55){
    for(let k=0;k<40;k++){const q=k/40;spawnP(x+(tx-x)*q*0.4+(Math.random()-.5)*0.6,top-q*2,z+(tz-z)*q*0.4+(Math.random()-.5)*0.6,(tx-x)*0.25,-2-Math.random()*4,(tz-z)*0.25,k%2?[0.08,0.06,0.05]:[1,0.42,0.06],2.2,10);}
    burst(1.4,'lowpass',700,0.6,0.35,0,[tx,g+2,tz]);
    setTimeout(()=>{for(const f of foes){if(f.dead||!FOES[f.kind].folk||Math.hypot(f.x-tx,f.z-tz)>2.5)continue;f.hp-=10;f.hurt=1;if(f.hp<=0){f.dead=0.001;f.st='dead';f.sp=0;f.foe=null;}}
      if(foeTarget()&&Math.hypot(PL.x-tx,PL.z-tz)<2.5&&Math.abs(PL.y-g-1)<3)foeHurtPlayer(8,'pitch',0.1,0.1,2);
      for(let k=0;k<18;k++)spawnP(tx+(Math.random()-.5)*3,g+1.2,tz+(Math.random()-.5)*3,0,1.4,0,[1,0.5,0.1],0.9,-0.6);burst(0.8,'highpass',1800,0.6,0.12,0,[tx,g+1,tz]);},1600);}
  else{const m=new THREE.Mesh(shotGeo,new THREE.MeshBasicMaterial({color:new THREE.Color(0.3,0.29,0.28)}));m.scale.set(0.9,0.9,0.9);m.frustumCulled=false;scene.add(m);
    const T=Math.sqrt(2*(top-g-1)/16);warStones.push({x:x,y:top,z:z,vx:(tx-x)/T,vz:(tz-z)/T,vy:0,fire:false,life:T+0.5,m:m,hit:warDropHit});}}
function warDropHit(s){for(const f of foes){if(f.dead||!FOES[f.kind].folk||Math.hypot(f.x-s.x,f.z-s.z)>1.6||Math.abs(f.y-s.y)>3)continue;f.hp-=12;f.hurt=1;f.vy=Math.max(f.vy,2);if(f.hp<=0){f.dead=0.001;f.st='dead';f.sp=0;f.foe=null;}}
  if(foeTarget()&&Math.hypot(PL.x-s.x,PL.z-s.z)<1.6&&Math.abs(PL.y-s.y)<3)foeHurtPlayer(7,'wstone',0.1,0.1,3);}
DEATH.pitch='Burning pitch from the gate\'s walk fell on you';DEATH.wstone='A stone dropped from the gate\'s walk struck you';
// ---- The siege tower (Q156): a tower of timber faced with mantlets, wheeled up against the gate's wall on the side of the open leaf
// once the assaults have half won the walls (rolled up from the lines when the player sees it come, else standing there), its
// drawbridge let down onto the walk. Drawn as one mesh of block-textured cubes; soldiers climb its back to the walk.
const warTowers=entityKind({name:'warTowers',list:[],persist:false,shift:()=>{},update:dt=>{for(const T of warTowers){if(T.k<1){T.k=Math.min(1,T.k+dt/50);T.snd-=dt;
    if(T.snd<=0){T.snd=0.45+Math.random()*0.3;const at=[T.m.position.x,T.y+1,T.m.position.z];burst(0.5,'lowpass',120,1,0.18,0,at);if(Math.random()<0.4)tone(330+Math.random()*90,260,0.4,0.03,0,'triangle',at);}} // the wheels rumble and creak
  const X=T.ax+(T.bx-T.ax)*T.k,Z=T.az+(T.bz-T.az)*T.k;T.m.position.set(X-OX,T.y+(T.k<1?Math.abs(Math.sin(T.k*90))*0.04:0),Z-OZ);}}});
function warTowerGeo(){if(warTowerGeo.g)return warTowerGeo.g;const m=newM(),C=new Map(),put=(x,y,z,id)=>C.set(x+','+y+','+z,[x,y,z,id]);
  // the frame: corner posts of logs, a floor of planks every eight, the sides closed with mantlets but for slits; the platform and the
  // drawbridge let down from its top toward the wall (local -z); wheels at the corners
  for(let y=0;y<48;y++)for(let a=0;a<7;a++)for(let b=0;b<7;b++){const edge=a===0||a===6||b===0||b===6,corner=(a===0||a===6)&&(b===0||b===6);if(!edge&&!(y%8===0&&y>0))continue;
    if(!corner&&edge&&y%8!==0&&(y%8===4||y%8===5)&&(a===3||b===3))continue; // slits
    put(a,y,b,corner?LOG:y%8===0?PLANKS:MANTLET);}
  for(let a=0;a<7;a++)for(let b=0;b<6;b++)put(a,47,-b-1,PLANKS);
  for(const [a,b] of [[0,0],[6,0],[0,6],[6,6]])put(a,-1,b,LOG);
  for(const [x,y,z,id] of C.values()){const bl=BL[id];for(const F of FACES){if(C.has((x+F.d[0])+','+(y+F.d[1])+','+(z+F.d[2])))continue;const base=m.p.length/3;
    for(const c of F.c){m.p.push(x+c[0]-3.5,y+c[1]+(y<0?0.5:0),z+c[2]-3.5);pushUV(m.u,bl.t[F.tf],c[3],c[4]);m.l.push(F.s);m.b.push(0);m.a.push(F.s);}m.i.push(base,base+1,base+2,base+2,base+1,base+3);}}
  return warTowerGeo.g=mkGeo(m);}
function warSiegeTower(P,w,roll){if(warTowers.some(T=>T.id===P.id))return;const g=P.hG,cs=P.cs,[ax,az]=wgXZ(P,P.uL-6,-cs*20),[bx,bz]=wgXZ(P,10,-cs*14),m=new THREE.Mesh(warTowerGeo(),matO);m.frustumCulled=false;
  m.rotation.y=Math.atan2(-P.dx,-P.dz)+Math.PI;scene.add(m);warTowers.push({id:P.id,ax:ax+0.5,az:az+0.5,bx:bx+0.5,bz:bz+0.5,y:g+1,k:roll?0:1,snd:0,m:m});
  if(roll)toast('A siege tower is wheeled up to the gate\'s wall');}
// ---- Climbing (the ladders and the siege tower): a soldier at the foot of one climbs it hand over hand, then crosses onto the walk
// or into the tower through its breach (`f.climb`: where it climbs, the top's height, where it comes out); before the walls are
// half won the defenders throw those who reach the top down again
function warClimbStep(f,dt){const C=f.climb;if(C.y0===undefined)C.y0=f.y;
  if(!C.ph){f.x+=(C.x-f.x)*Math.min(1,dt*4);f.z+=(C.z-f.z)*Math.min(1,dt*4);f.y=Math.min(C.y1,f.y+2.2*dt);f.gy=f.y;f.vy=0;f.sp=0.8;f.yaw=f.hd=C.face;
    if(f.y>=C.y1){if(C.fall){f.climb=null;f.gy=C.y0;f.vy=2;f.kvx=-Math.sin(C.face)*3;f.kvz=-Math.cos(C.face)*3;f.hp-=8;f.hurt=1;foeCall(f,'hurt');
        if(f.hp<=0){f.dead=0.001;f.st='dead';f.sp=0;f.foe=null;}else{f.st='return';f.t=0;}}else C.ph=1;}return;}
  const dx=C.ox-f.x,dz=C.oz-f.z,d=Math.hypot(dx,dz);f.y=f.gy=C.y1;f.vy=0;f.sp=1.3;f.yaw=f.hd=Math.atan2(dx,dz);
  if(d<0.3){f.x=C.ox;f.z=C.oz;f.climb=null;f.st='return';f.t=0;f.hx=f.x;f.hz=f.z;}else{const k=Math.min(d,1.3*dt)/d;f.x+=dx*k;f.z+=dz*k;}}
// during an assault of the hosts at a gate whose walls are not yet won: every four seconds the nearest soldier of a hosts' army within
// 26 of the foot of each ladder and of the siege tower is sent up it (one to each, so they climb spaced out); those who win the
// walk stay to hold it (`f.held`)
let warClimbT=0;
function warClimbTick(dt,P,w){warClimbT-=dt;if(warClimbT>0||w.s>=2)return;warClimbT=4;const q=Math.floor(warEff(w,'walls')*4);if(q<1)return;
  const g=P.hG,face=Math.atan2(-P.dx,-P.dz),pts=[];
  for(let i=0;i<Math.min(8,q*2);i++){const [av,sd]=WAR_LAD[i];pts.push({u:12,v:av*sd,cu:10.3,y1:g+49,fall:q<2,go:[[6,av*sd],[0,sd*25],[0,sd*21],[0,sd*12]]});}
  if(warTowers.some(T=>T.id===P.id&&T.k>=1))pts.push({u:15,v:-P.cs*14,cu:13.8,y1:g+49,go:[[1,-P.cs*14],[0,-P.cs*8]]});
  const C=[];for(const f of foes){if(f.dead||f.climb||f.held||f.cK||!f.army||!f.army.al||f.foe||f.waitA||FOES[f.kind].mount)continue;const [fu,fv]=wgUV(P,f.x+OX,f.z+OZ);if(fu<=40&&fu>=2)C.push([f,fu,fv]);}
  for(const p of pts){let best=null,bd=26;for(const c of C){if(c[0].cK)continue;const d=Math.hypot(c[1]-p.u,c[2]-p.v);if(d<bd){bd=d;best=c[0];}}if(!best)continue;const f=best;f.cK=1;
    const xz=(u,v)=>{const [X,Z]=wgXZ(P,u,v);return [X+0.5-OX,Z+0.5-OZ];},[bx,bz]=wgXZ(P,p.u,p.v),[cx,cz]=xz(p.cu,p.v),[ox,oz]=xz(p.go[0][0],p.go[0][1]);
    f.way=[[bx+0.5,bz+0.5,1],{climb:{x:cx,z:cz,y1:p.y1,ox:ox,oz:oz,face:face,fall:p.fall}}].concat(p.fall?(f.wp?[f.wp]:[]).concat(f.way||[]):p.go.slice(1).map(([u,v])=>{const [X,Z]=wgXZ(P,u,v);return [X+0.5,Z+0.5,1];}));
    if(!p.fall){f.held=1;f.back=null;const A=f.army,i=A.m.indexOf(f);if(i>=0)A.m.splice(i,1);f.army=null;}
    const w0=f.way.shift();warAim(f,w0);f.wp=w0;f.st='return';f.t=20;}}
// ---- Underground (Q149): when the player is in the tunnels, a few sappers stand at the mine's face and goblins at the
// countermine's, digging (the ring of picks); once the two have met, the battle in the Broken Gallery (warUnderBattle, D-086)
let warMineT=0,warPickT=0;
function warMineFight(dt,P,w){if(w.s>=2)return;const g=P.hG;if(PL.y>g-2)return;const M=warMinePts(P),mid=warMineMid(P),ap=w.ap||{},me=ap.me||0,cm=ap.cm||0,[pu,pv]=wgUV(P,PL.x+OX,PL.z+OZ);
  const at=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],seg=(a,b,t)=>t>0&&wgLineD([a,at(a,b,t)],pu,pv)<14,met=me>=WAR_MEET&&cm>=1&&Math.hypot(pu-mid[0],pv-mid[1])<60;
  if(!met&&!seg(M.A,M.B,me)&&!seg(M.C,mid,cm))return;if(met)warUnderBattle(dt,P,w); // the battle in the Broken Gallery (D-086)
  const faces=[];if(me>0.05&&me<1)faces.push(['d_sap',at(M.A,M.B,me-0.04),1]);if(cm>0.05&&cm<1)faces.push(['den',at(M.C,mid,cm-0.04),0]);
  warPickT-=dt;if(warPickT<=0){warPickT=0.6+Math.random()*0.5;for(const [,[u,v]] of faces){const [X,Z]=wgXZ(P,Math.round(u),Math.round(v)),x=X-OX+0.5,z=Z-OZ+0.5;
    if(Math.hypot(x-PL.x,z-PL.z)<40){burst(0.05,'highpass',2600+Math.random()*1400,1.5,0.22,0,[x,g-8,z]);burst(0.12,'bandpass',520,1,0.12,0.02,[x,g-8,z]);}}}
  warMineT-=dt;if(warMineT>0||met)return;warMineT=12;if(foes.some(f=>!f.dead&&f.mine===P.id))return;
  for(const [tab,[u,v],folk] of faces){const [X,Z]=wgXZ(P,Math.round(u),Math.round(v));
    for(const f of spawnGroup(tab,folk?2:3,X+0.5-OX,g-9,Z+0.5-OZ,1.2,folk?{prov:'wg:'+P.id,site:wgSite(P)}:{})){f.mine=P.id;f.war=P.id;f.hx=f.x;f.hz=f.z;}}}
// ---- The gate's fall (Q142, Q146): when the four efforts are done, the next army of the hosts to come against the gate (or, the
// player away, ten minutes after) takes it. Near, it is seen: the leaf is shattered, the mine fired and the tower above it falls,
// the horns of the peoples sound and the hosts storm the yard; the orcs' camp burns and the Leaguer rejoices. From then the hosts
// hold the yard and the walk.
function warFall(w,near,P){if(w.s>=2)return;w.s=2;w.fallT=Math.round(warPlay);const nm=w.n.replace(/^The /,'the ');
  warLog(w,'The gate has fallen. The ram broke the barred leaf, the mine under the ring was fired and brought down the tower above it, the walls were won and the warbands of the yard broken. The hosts hold the Gatewarden\'s Camp of '+nm+'.');
  if(near){toast(w.n+' has fallen!');setTimeout(()=>toast('The hosts storm the Gatewarden\'s Camp'),2500);setTimeout(()=>toast('The Leaguer rejoices: the horns of the three peoples sound and victory fires are lit'),9000);
    const y=P?P.hG+6:PL.y+6;['r','d','e','h','w'].forEach((p,i)=>setTimeout(()=>warSignal('advance',p,[PL.x,y,PL.z]),i*900));warCheer();}
  saveDirty=true;}
// the folk about the player cheer for a while, arms raised
function warCheer(){const t=foeClock+90;for(const f of foes)if(!f.dead&&FOES[f.kind].folk&&Math.hypot(f.x-PL.x,f.z-PL.z)<140)f.cheer=t+Math.random()*20;
  setTimeout(()=>warCry(false,20,PL.x+8,PL.y+2,PL.z),1200);}
// the tower above the mine: its outer half broken off in a slant (low toward the pass, high toward the yard), the rest a heap of
// rubble about its foot, the chamber of the mine fallen in; with a blast and dust
function warTowerCells(P){const g=P.hG,cs=P.cs,out=[],M=warMinePts(P);
  for(let av=20;av<=36;av++)for(let u=-10;u<=10;u++){if(u<=3&&u>=-3&&(av===20||av===36))continue;const v=av*cs,[X,Z]=wgXZ(P,u,v),x=X-OX,z=Z-OZ;if(x<0||z<0||x>=W||z>=D)continue;
    const cut=Math.round(g+20+(10-u)*1.7+hsh(X,9881,Z)*6);for(let y=cut;y<=g+72;y++)if(world[I(x,y,z)]!==AIR)out.push([X,y,Z,AIR]);}
  for(let du=-16;du<=16;du++)for(let dv=-16;dv<=16;dv++){const d=Math.hypot(du,dv),u=du,v=cs*28+dv,av=Math.abs(v);if(d>16||av>=20&&av<=36&&Math.abs(u)<=10||Math.abs(u)<=3&&av<=50||av<=20&&Math.abs(u)<=1)continue;
    const [X,Z]=wgXZ(P,u,v),x=X-OX,z=Z-OZ;if(x<0||z<0||x>=W||z>=D)continue;let y=g-2;while(y<=g+6&&world[I(x,y,z)]!==AIR)y++;if(y>g+6)continue;
    const h=Math.round(6-d*0.42+(hsh(X,9883,Z)-0.5)*2.5);for(let k=0;k<h;k++)out.push([X,y+k,Z,hsh(X*5+k,9885,Z)<0.4?BASCRACK:hsh(X,9887+k,Z)<0.5?BASBRICK:COBBLE]);}
  for(let du=-2;du<=2;du++)for(let dv=-2;dv<=2;dv++)for(let y=g-9;y<=g-7;y++)warSet(out,P,M.B[0]+du,M.B[1]+dv,y,hsh(du*7+y,9889,dv)<0.6?GRAVEL:COBBLE);
  return out;}
function warBlast(x,y,z){const d=Math.hypot(x-PL.x,z-PL.z);sfxBoom(d*0.6,[x,y,z]);setTimeout(()=>sfxBoom(d,[x,y+10,z]),350);setTimeout(()=>burst(3,'lowpass',160,0.7,0.5*Math.max(0.1,1-d/150),0,[x,y,z]),700); // the blast, then the stones falling
  shake=Math.max(shake,Math.max(0,1.2*(1-d/90)));
  for(let k=0;k<160;k++)spawnP(x+(Math.random()-.5)*12,y+Math.random()*30,z+(Math.random()-.5)*12,(Math.random()-.5)*8,Math.random()*6,(Math.random()-.5)*8,k%4?[0.4,0.37,0.33]:[1,0.5,0.12],2.5+Math.random()*2,4);}
// the cairns of the hosts' fallen heroes (W3): in a row before the graves, each a mound of stones capped with moss and its
// people's banner on a pole
const HERO_BAN={r:RBANNER,h:HBANNER,e:EVBANNER,w:WBANNER,d:DBANNER};
function warCairnCells(P,w,n0,n1){const out=[],D=w.hr.dead.filter(d=>d.side==='al'),cs=P.cs;
  for(let i=n0;i<n1&&i<20;i++){const u=P.uL+26,v=(i%2?-cs:cs)*(54+Math.floor(i/2)*7),y=warTop(P,u,v)+1;if(y<1)continue;
    for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){warSet(out,P,u+a,v+b,y,COBBLE);if(!a||!b)warSet(out,P,u+a,v+b,y+1,a||b?COBBLE:MOSSY);}warSet(out,P,u,v,y+2,MOSSY);
    for(let k=3;k<=5;k++)warSet(out,P,u,v,y+k,HERO_BAN[D[i]&&D[i].p]||RBANNER);}
  return out;}
// victory fires on the Leaguer's muster field: a ring of logs about a bed of embers, three of them; burnt out after twenty minutes
const WAR_FIRES=[[30,-16],[30,16],[42,0]];
function warFireCells(P,lit){const out=[];for(const [du,dv] of WAR_FIRES){const u=P.uC0+du,v=dv,y=warTop(P,u,v)+1;if(y<1)continue;
  warSet(out,P,u,v,y,lit?HEARTH:CHARWOOD);for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])warSet(out,P,u+a,v+b,y,lit?LOG:CHARWOOD);}return out;}
// ---- Every second, for the war of the gate near the player: its works brought up to its state where they are loaded, one job at
// a time (w.ap: what is done; a job that met ground not yet made is tried again a little later)
function warWorksTick(P,w){if(!P||!w||WJ.length)return;wgSite(P);w.ap=w.ap||{leaf:0,me:0,cm:0,lad:0,gr:0,fall:0,ban:0,fire:0};const A=w.ap,g=P.hG,recent=w.s>=2&&warPlay-(w.fallT||0)<180;
  const due=k=>!(A.wt&&A.wt[k]>warPlay),done=(k,ok)=>{if(!ok){A.wt=A.wt||{};A.wt[k]=warPlay+20;}saveDirty=true;return ok;};
  const L=w.s>=2?4:Math.min(3,Math.floor(warEff(w,'ram')*4));
  if(L>A.leaf&&due('leaf')&&warLoaded(P,-16,4,-24,24)){warJob(warLeafCells(P,L),800,ok=>{if(done('leaf',ok))A.leaf=L;});return;}
  const me=Math.floor(Math.min(1,warEff(w,'mine'))*20)/20,cm=Math.floor(warCm(w)*20)/20;
  if((me>A.me||cm>A.cm)&&due('me')&&warLoaded(P,0,40,-40,40)){warJob(warMineCells(P,me,cm),900,ok=>{if(done('me',ok)){A.me=me;A.cm=cm;}});return;}
  const lq=w.s>=2?4:Math.floor(warEff(w,'walls')*4);if(lq>A.lad&&due('lad')&&warLoaded(P,6,12,-36,36)){warJob(warLadderCells(P,lq),600,ok=>{if(done('lad',ok))A.lad=lq;});return;}
  if(lq>=2&&!warTowers.some(T=>T.id===P.id)&&warLoaded(P,4,P.uL,-30,30)){const [pu,pv]=wgUV(P,PL.x+OX,PL.z+OZ);warSiegeTower(P,w,!A.st&&Math.hypot(pu-60,pv)<120);A.st=1;}
  const gn=Math.min(WAR_GRAVES,Math.floor((w.fa||0)/2));if(gn>A.gr&&due('gr')&&warLoaded(P,P.uL+30,P.uL+48,-20,20)){warJob(warGraveCells(P,A.gr,gn),400,ok=>{if(done('gr',ok))A.gr=gn;});return;}
  if(w.s>=2&&!A.fall&&due('fall')&&warLoaded(P,-26,26,-60,60)){if(recent&&!A.bl){A.bl=1;const [tx,tz]=wgXZ(P,0,P.cs*28);warBlast(tx-OX,g+14,tz-OZ);const [cx,cz]=wgXZ(P,(P.yc.ua+P.yc.ub)>>1,P.yc.vm);warIgnite(w,cx-OX,g+2,cz-OZ,26,300);}
    warJob(warTowerCells(P),recent?2500:4000,ok=>{if(done('fall',ok))A.fall=1;});return;}
  if(w.s>=2&&A.fall&&!A.ban&&due('ban')&&warLoaded(P,-12,12,-36,36)){const out=[],cs=-P.cs;for(let y=g+30;y<=g+46;y++){warSet(out,P,10,cs*25,y,RBANNER);warSet(out,P,10,cs*31,y,DBANNER);}for(let y=g+20;y<=g+30;y++)warSet(out,P,-10,cs*28,y,EVBANNER);
    warJob(out,400,ok=>{if(done('ban',ok))A.ban=1;});return;}
  const hc=w.hr?w.hr.dead.filter(d=>d.side==='al').length:0;if(hc>(A.hc||0)&&due('hc')&&warLoaded(P,P.uL+24,P.uL+30,-92,92)){const n0=A.hc||0;warJob(warCairnCells(P,w,n0,hc),200,ok=>{if(done('hc',ok))A.hc=hc;});return;}
  const lit=w.s>=2&&warPlay-(w.fallT||0)<1200;if(w.s>=2&&A.fire!==(lit?1:2)&&due('fire')&&warLoaded(P,P.uC0+26,P.uC0+44,-18,18))warJob(warFireCells(P,lit),100,ok=>{if(done('fire',ok))A.fire=lit?1:2;});
  warFrontTick(P,w);} // the forward camps beyond the fallen gate (W5)
// the fallen of the war (counted once each, from updFoes): the hosts' fill the graves; they lie a while (WAR_LIE seconds; past
// WAR_DEAD of them, the longest fallen are cleared first)
const WAR_LIE=150,WAR_DEAD=50;
function warFallen(f){const w=WARS.get(f.war);if(!w)return;if(FOES[f.kind].folk)w.fa=(w.fa||0)+1;else w.fo=(w.fo||0)+1;}
function warClearDead(){const L=foes.filter(f=>f.dead&&f.war&&!f.gone);if(L.length<=WAR_DEAD)return;L.sort((a,b)=>b.dead-a.dead);for(let i=0;i<L.length-WAR_DEAD;i++)removeFoe(L[i]);}
// ---- Crows (Q157): over the fallen near the player a few circle, now and then drop to the ground among them, and caw
const crowParts=[];let crowMat=null;
function crowMesh(){if(!crowMat){crowMat=new THREE.MeshBasicMaterial({color:new THREE.Color(0.07,0.07,0.08)});for(const s of [[0.2,0.18,0.42],[0.14,0.14,0.15],[0.05,0.05,0.12],[0.16,0.03,0.2],[0.5,0.03,0.24]])crowParts.push(new THREE.BoxGeometry(s[0],s[1],s[2]));}
  const g=new THREE.Group(),bx=(i,x,y,z,p)=>{const m=new THREE.Mesh(crowParts[i],crowMat);m.position.set(x,y,z);(p||g).add(m);return m;};
  bx(0,0,0,0);bx(1,0,0.07,0.27);bx(2,0,0.05,0.39);bx(3,0,0.01,-0.3);const wl=new THREE.Group(),wr=new THREE.Group();bx(4,-0.25,0,0,wl);bx(4,0.25,0,0,wr);wl.position.set(-0.1,0.06,0);wr.position.set(0.1,0.06,0);g.add(wl);g.add(wr);
  g.userData.w=[wl,wr];return g;}
const warCrows=entityKind({name:'warCrows',list:[],persist:false,shift:(dx,dz)=>{for(const c of warCrows){c.x-=dx;c.z-=dz;c.cx-=dx;c.cz-=dz;c.sx-=dx;c.sz-=dz;c.tx-=dx;c.tz-=dz;}},update:dt=>updCrows(dt)});
// a crow's call, made by hand: two to four harsh, falling caws, each a buzzing sawtooth through a narrow band about 1.4 kHz with a
// fast flutter, and a breath of rasp; each a little lower than the one before
function crowCaw(at){if(!AX||!settings.sound)return;const p=panner(at[0],at[1],at[2]),n=2+(Math.random()*3|0),f0=640+Math.random()*120;
  for(let i=0;i<n;i++){const d=i*(0.3+Math.random()*0.08),f=f0*(1-i*0.03);voice(f,f*0.74,0.2+Math.random()*0.05,0.05,{type:'sawtooth',form:1450,q:2.2,vib:31,vd:0.05,delay:d},p);burst(0.16,'bandpass',1900,1.3,0.035,d+0.01,p);}}
function updCrows(dt){
  for(let i=warCrows.length-1;i>=0;i--){const c=warCrows[i],[wl,wr]=c.m.userData.w;c.t-=dt;c.cw-=dt;
    if(c.f.gone||c.leave){if(!c.leave){c.leave=1;c.life=8;}c.life-=dt;c.r+=3*dt;c.cy+=2.5*dt;if(c.st==='ground')c.st='air';if(c.life<=0){scene.remove(c.m);warCrows.splice(i,1);continue;}}
    if(c.st==='air'){c.a+=dt*c.sp/c.r;c.x=c.cx+Math.cos(c.a)*c.r;c.z=c.cz+Math.sin(c.a)*c.r;c.y=c.cy+Math.sin(c.a*1.7)*0.6;c.m.rotation.set(0,-c.a,0.25);
      const fl=Math.sin(c.a*0.7+c.ph)>-0.2?Math.sin(foeClock*15+c.ph)*0.7:0.12;wl.rotation.z=fl;wr.rotation.z=-fl;
      if(c.t<=0&&!c.leave){c.st='down';c.t=3;c.sx=c.x;c.sy=c.y;c.sz=c.z;c.tx=c.f.x+(Math.random()-.5)*3;c.tz=c.f.z+(Math.random()-.5)*3;c.ty=c.f.gy+0.08;}}
    else if(c.st==='down'||c.st==='up'){const k=Math.max(0,c.t/3),q=1-k;c.x=c.sx+(c.tx-c.sx)*q;c.z=c.sz+(c.tz-c.sz)*q;c.y=c.sy+(c.ty-c.sy)*(c.st==='down'?1-k*k:q*q);
      c.m.rotation.set(0,Math.atan2(c.tx-c.sx,c.tz-c.sz),0);const fl=Math.sin(foeClock*18+c.ph)*0.8;wl.rotation.z=fl;wr.rotation.z=-fl;
      if(c.t<=0){if(c.st==='down'){c.st='ground';c.t=5+Math.random()*7;}else{c.st='air';c.t=8+Math.random()*12;}}}
    else{wl.rotation.z=-0.15;wr.rotation.z=0.15;c.m.rotation.x=Math.max(0,Math.sin(foeClock*5+c.ph))*0.5;if(Math.random()<dt*0.6){c.m.rotation.y+=(Math.random()-.5)*2;c.x+=(Math.random()-.5)*0.3;c.z+=(Math.random()-.5)*0.3;}
      if(c.t<=0){c.st='up';c.t=3;c.m.rotation.x=0;c.sx=c.x;c.sy=c.y;c.sz=c.z;c.tx=c.cx+Math.cos(c.a)*c.r;c.tz=c.cz+Math.sin(c.a)*c.r;c.ty=c.cy;}}
    c.m.position.set(c.x,c.y,c.z);if(c.cw<=0){c.cw=5+Math.random()*10;if(Math.hypot(c.x-PL.x,c.z-PL.z)<50)crowCaw([c.x,c.y,c.z]);}}}
// each second: as many crows as one for every three of the fallen near the player (at most seven); none when none lie near
function warCrowTick(){const near=foes.filter(f=>f.dead>3&&f.war&&!f.gone&&Math.hypot(f.x-PL.x,f.z-PL.z)<70),want=Math.min(7,Math.floor(near.length/3));
  if(!near.length){for(const c of warCrows)if(!c.leave){c.leave=1;c.life=8;}return;}if(warCrows.filter(c=>!c.leave).length>=want)return;
  const f=near[Math.floor(Math.random()*near.length)],m=crowMesh(),cy=f.gy+12+Math.random()*7;scene.add(m);
  warCrows.push({f:f,cx:f.x,cz:f.z,cy:cy,r:5+Math.random()*5,a:Math.random()*6.28,sp:4+Math.random()*2,ph:Math.random()*6,x:f.x,y:cy,z:f.z,sx:0,sy:0,sz:0,tx:0,ty:0,tz:0,t:6+Math.random()*10,cw:2+Math.random()*6,st:'air',life:8,m:m});}
// engineers of the hosts mend what burned or was broken within 20 of them three times as fast (W3)
function warMend(){const E=foes.filter(f=>!f.dead&&FOES[f.kind].eng);if(!E.length)return;for(const w of WARS.values()){if(!w.bn)continue;for(const e of w.bn){if(e.q)continue;const [X,Y,Z]=e.c||(e.c=e[0].split(',').map(Number));
  for(const f of E)if(Math.abs(f.x+OX-X)<20&&Math.abs(f.z+OZ-Z)<20){e.q=1;break;}}}}
// ---- Every frame: the jobs, the fires, the crows, and near a gate the ram, the walk's defence, the climbing, the tunnels, the
// victory fires' flames
let warWorksT=0;
function warWorksFrame(dt){warJobsFrame();warFireFrame(dt);warWorksT-=dt;if(warWorksT<=0){warWorksT=1;warClearDead();warCrowTick();warMend();}
  const P=wasteGateAt(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),160),w=P&&WARS.get(P.id);if(!w)return;wgSite(P);warRamTick(dt,P,w);warPitch(dt,P,w);warClimbTick(dt,P,w);warMineFight(dt,P,w);
  if(w.ap&&w.ap.fire===1)for(const [du,dv] of WAR_FIRES){const [X,Z]=wgXZ(P,P.uC0+du,dv),x=X-OX+0.5,z=Z-OZ+0.5;if(Math.hypot(x-PL.x,z-PL.z)>100||Math.random()>dt*14)continue;const y=warTop(P,P.uC0+du,dv)+1;
    spawnP(x+(Math.random()-.5)*1.6,y+0.6,z+(Math.random()-.5)*1.6,(Math.random()-.5)*0.4,2+Math.random()*1.5,(Math.random()-.5)*0.4,[1,0.5+Math.random()*0.3,0.1],0.8,-1.4);
    if(Math.random()<0.4)spawnP(x,y+2.5,z,(Math.random()-.5)*0.4,1.2,(Math.random()-.5)*0.4,[0.3,0.29,0.28],3,-0.3);if(Math.random()<0.08)AMB_EV.crackle([x,y,z]);}}
