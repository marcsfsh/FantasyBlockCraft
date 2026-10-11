// ---- Building the realms of men (D-060). Every site has a layout of parts (walls, towers, houses, halls, lanes, wells, fields
// and the rest), each a box in the site's own frame (u from the side its road arrives on, at u = -R, toward the back; v across)
// with a column builder. A chunk builds its own columns only: for each column, every part whose box holds it writes that
// column's blocks, in the layout's order (so later parts stand over earlier ones). Pure functions of the plan; the ground under
// every site is already level (realmGround), a city's in tiers. Lamps are lit (genLit). Where folk stand is part of the layout.
const RBP=(X,y,Z,id)=>PW(X,y,Z,id,MODE_SET),RBS=(X,Z,y0,y1,id)=>{for(let y=y0;y<=y1;y++)PW(X,y,Z,id,MODE_SET);};
function siteFrame(s){if(s.fr)return s.fr;const d=DIRS[s.dir];return s.fr={fx:-d[0],fz:-d[1],sx:-d[1],sz:d[0]};}
const siteUV=(s,X,Z)=>{const f=siteFrame(s),dx=X-s.X,dz=Z-s.Z;return [dx*f.fx+dz*f.fz,dx*f.sx+dz*f.sz];};
const siteXZ=(s,u,v)=>{const f=siteFrame(s);return [s.X+u*f.fx+v*f.sx,s.Z+u*f.fz+v*f.sz];};
// the ground of a site at local (u, v): its level, a city's by tier
const siteG=(s,u,v)=>{if(s.terr){const [X,Z]=siteXZ(s,u,v);return elfGround(s,X,Z);}if(s.raw){const [X,Z]=siteXZ(s,u,v);return Math.round(woodGround(s,X,Z,elfRaw(s,X,Z)));}if(s.k!=='city')return s.T;const f=cityFrame(s);return (f.round?Math.hypot(u,v):Math.max(Math.abs(u),Math.abs(v)))<=s.R?s.T+cityTier(s,u,v)*f.step:s.T;};
// A part's own frame: a across its front, b back from its front; f is the side its front faces (0 toward -u, 1 +u, 2 -v, 3 +v)
function partAB(p,u,v){switch(p.f){case 0:return [v-p.v0,u-p.u0,p.v1-p.v0+1,p.u1-p.u0+1];case 1:return [p.v1-v,p.u1-u,p.v1-p.v0+1,p.u1-p.u0+1];
  case 2:return [p.u1-u,v-p.v0,p.u1-p.u0+1,p.v1-p.v0+1];default:return [u-p.u0,p.v1-v,p.u1-p.u0+1,p.v1-p.v0+1];}}
// a part centred on (u, v), w across and d deep, its front facing f
function partC(k,u,v,w,d,f,o){const ac=f<2,hw=Math.floor((ac?w:d)/2),hd=Math.floor((ac?d:w)/2);const W2=ac?w:d,D2=ac?d:w;
  return Object.assign({k:k,u0:u-hd,u1:u-hd+D2-1,v0:v-hw,v1:v-hw+W2-1,f:f},o||{});}
// a house on its core (u0..u1, v0..v1, as built), its front facing f, its box grown by its margins mg ([left, right, front,
// back]) and its porch; p.core keeps the core's box
function housePart(u0,u1,v0,v1,f,mg,o){const ac=f<2,W=ac?v1-v0+1:u1-u0+1,D=ac?u1-u0+1:v1-v0+1,core=[u0,u1,v0,v1],[mL,mR,mF0,mB]=mg,mF=mF0+(o.porch||0);
  if(f===0){v0-=mL;v1+=mR;u0-=mF;u1+=mB;}else if(f===1){v1+=mL;v0-=mR;u1+=mF;u0-=mB;}else if(f===2){u1+=mL;u0-=mR;v0-=mF;v1+=mB;}else{u0-=mL;u1+=mR;v1+=mF;v0-=mB;}
  return Object.assign({k:'house',u0:u0,u1:u1,v0:v0,v1:v1,f:f,W:W,D:D,mg:mg,core:core},o);}
// ---- Column builders
const RB={};
const lit=(X,y,Z)=>RBP(X,y,Z,LANTERN);
// A house or hall. Its core is p.W across by p.D deep, p.st storeys of p.sh, its front facing p.f; p.mg the margins about the
// core where its relief stands ([left, right, front, back]; below head height nothing stands in one unless p.gnd, so a city's
// lanes stay clear), p.porch rows of pillars before the front under a pediment. The walls by p.mat:
//   stone: white ashlar on a rock-faced plinth with toothed quoins, windows set back in their reveals over sills, a moulded
//     string course at each floor and a cornice on corbels at the eaves; p.pil pilasters between the windows (and pillars
//     down a hall), p.butt buttresses, p.batt a flat roof behind a parapet carried out on corbels
//   timber: a stone ground storey, the storeys above jettied out over the margins on beam ends, framed in timber and plaster
//   cottage: a cobble footing, plaster in a frame of logs, low thatch two blocks thick at its edges; with p.xchim a chimney up
//     the back gable, and about it a bench, flower boxes and a woodpile
//   wattle (the riders' longhouses, D-061): a fieldstone footing, wattle and daub between log posts, carved oak about the door,
//     the roof low and thick at its edges like a cottage's; p.pitch steepens a roof (2: two up for one across), p.horns sets
//     crossed horse heads on the gables, p.hearth a long hearth in the floor
// The roof is a gable along the depth (p.ridge 'a': along the width) of p.roof, its verges out over the gables, a finial on
// each gable of stone or timber, dormers in the roofs of the taller houses; inside, floors, a ladder, lamps, a few furnishings.
RB.house=(s,p,u,v,X,Z)=>{
  const [a,b]=partAB(p,u,v),mg=p.mg,pr=p.porch||0,ca=a-mg[0],cb=b-mg[2]-pr,W=p.W,D=p.D,g=p.y,st=p.st,sh=p.sh||4,eave=g+st*sh;
  const mat=p.mat,stone=mat==='stone',tim=mat==='timber',cot=mat==='cottage',wat=mat==='wattle',low=cot||wat,inA=ca>=0&&ca<W,inB=cb>=0&&cb<D,core=inA&&inB,r=hsh(X,9501,Z);
  const alongB=p.ridge!=='a',span=alongB?W:D,pos=alongB?ca:cb,rb=low?1:2,pit=p.pitch||1,ry=eave+rb+Math.min(pos,span-1-pos)*pit,roof=p.roof||SLATE;
  // the porch: pillars along its front under an entablature, the roof carried over it, a pediment with the realm's sign
  if(cb<0&&cb>=-pr&&inA){const fr=cb===-pr,col=fr&&(ca%2===0||ca===W-1);RBP(X,g,Z,WSTONE);
    for(let y=g+1;y<eave;y++)RBP(X,y,Z,col?WSPILLAR:AIR);RBP(X,eave,Z,col?WSCARVE:WSTRIM);
    for(let y=eave+1;y<ry;y++)RBP(X,y,Z,!fr?AIR:y===ry-1?WSTRIM:ca===W>>1&&y===eave+2?WSCARVE:WSBRICK);RBP(X,ry,Z,roof);return;}
  const ring=k=>tim&&k>0?[-mg[0],W-1+mg[1],-mg[2],D-1+mg[3]]:[0,W-1,0,D-1];
  const wh=low?2:Math.max(2,sh-2),sparse=p.pil||tim,winAt=(pa,L)=>sparse?pa%4===2&&pa<=L-3:L<=6?pa===(L>>1):pa>=2&&pa<=L-3&&pa%2===0;
  const dw=p.dw||1,dh=p.dh||2,dd=Math.abs(ca-p.door),ld=winAt(p.door+dw+1,W)?dw+2:dw+1;
  // a wall's own block, where no window, door or floor line is
  const wallOf=(k,dy,pa,L,cor)=>{
    if(stone||(tim&&k===0)){if(k===0&&dy===0)return WSROUGH;if(cor)return WSTONE;if((pa===1||pa===L-2)&&dy%2===1)return WSTONE;if(p.pil&&pa%4===0&&dy>0)return WSPILLAR;return WSBRICK;}
    if(tim){if(cor||pa%4===0)return LOG;return (pa+k+(dy>(sh>>1)?1:0))%2?TIMBER:PLASTER;}
    if(wat){if(dy===0&&k===0)return FSTONE;if(cor||pa%3===0)return LOG;return WATTLE;}
    if(dy===0&&k===0)return COBBLE;if(cor)return LOG;return pa%3===0?TIMBER:PLASTER;};
  if(core)RBP(X,g,Z,ca===0||ca===W-1||cb===0||cb===D-1?(cot?COBBLE:wat?FSTONE:WSROUGH):p.hearth&&ca===(W>>1)&&cb>1&&cb<D-2&&Math.abs(cb-(D>>1))<=Math.max(1,(D>>2)-1)?HEARTH:p.floor||PLANKS);
  for(let k=0;k<st;k++){const y0=g+1+k*sh,y1=y0+sh-1,R=ring(k),top=k===st-1,inR=ca>=R[0]&&ca<=R[1]&&cb>=R[2]&&cb<=R[3];
    const line=stone?WSTRIM:tim&&k===0?(top?WSTRIM:LOG):LOG; // the floor line: a moulded band, or a beam
    if(inR&&(ca===R[0]||ca===R[1]||cb===R[2]||cb===R[3])){ // the wall
      const eA=ca===R[0]||ca===R[1],eB=cb===R[2]||cb===R[3],cor=eA&&eB,pa=eB?ca-R[0]:cb-R[2],L=eB?R[1]-R[0]+1:R[3]-R[2]+1;
      const front=k===0&&cb===0,win=!cor&&winAt(pa,L)&&!(front&&dd<=dw);
      for(let y=y0;y<=y1;y++){const dy=y-y0;let id;
        if(y===y1)id=line;
        else if(win&&dy>=1&&dy<=wh)id=AIR; // the window's reveal: its glass stands one in
        else if(win&&dy===0&&k>0&&!low)id=stone?WSTONE:PLANKS; // its sill
        else id=wallOf(k,dy,pa,L,cor);
        if(front&&dd<dw&&dy<dh)id=AIR; // the door, its lintel and jambs, a lamp beside it
        else if(front&&dd<dw&&dy===dh)id=cot?LOG:wat?CTIMBER:dw>1?WSCARVE:WSTONE;
        else if(front&&dd===dw&&dy>=0&&dy<=dh&&wat)id=CTIMBER; // carved door posts
        else if(front&&dd===dw&&dy>0&&dy<dh)id=cot?LOG:WSPILLAR;
        else if(front&&p.lamp&&!mg[2]&&dd===ld&&dy===2)id=LANTERN;
        RBP(X,y,Z,id);}
    }else if(inR){ // inside: floors, the ladder, glass set back in the windows, lamps, furnishings, pillars down a hall
      const lad=st>1&&ca===1&&cb===D-2&&(!top||p.batt),fw=(pa,L)=>pa>0&&pa<L-1&&winAt(pa,L);
      const glass=(ca===R[0]+1||ca===R[1]-1)&&fw(cb-R[2],R[3]-R[2]+1)||(cb===R[3]-1||cb===R[2]+1&&!(k===0&&dd<=dw))&&fw(ca-R[0],R[1]-R[0]+1);
      for(let y=y0;y<=y1;y++){const dy=y-y0;let id=y===y1&&!top?PLANKS:AIR;
        if(lad)id=LADDER;
        else if(glass&&dy>=1&&dy<=wh)id=LGLASS;
        else if(p.pil&&dy<sh-1&&ca>1&&ca<W-2&&cb>1&&cb<D-2&&(ca===2||ca===W-3)&&cb%3===1)id=WSPILLAR;
        else if(ca===(W>>1)&&cb===(D>>1)&&y===y1-1&&!(p.hearth&&dy===0))id=LANTERN;
        else if(dy===0&&(ca===1||ca===W-2)&&(cb===1||cb===D-2)&&r<0.5)id=r<0.18?BARREL:r<0.34?CRATE:BOOKS;
        RBP(X,y,Z,id);}
    }else{ // the margin about this storey
      const sA=ca<R[0]||ca>R[1],sB=cb<R[2]||cb>R[3],corner=sA&&sB,pa=sB?ca-R[0]:cb-R[2],L=sB?R[1]-R[0]+1:R[3]-R[2]+1,frontM=cb<R[2]&&!sA;
      const win=!corner&&pa>=1&&pa<=L-2&&winAt(pa,L)&&!(k===0&&frontM&&dd<=dw),odd=corner||pa%2!==0;
      if(tim&&k===0&&st>1){RBP(X,y1,Z,LOG);if(odd)RBP(X,y1-1,Z,LOG);} // under a jetty: its floor beam on brackets
      else if(stone){
        RBP(X,y1,Z,WSTRIM); // a string course, or the cornice
        if(top&&odd)RBP(X,eave-1,Z,WSTONE); // the cornice's corbels
        if(win&&k>0)RBP(X,y0,Z,WSTONE); // a sill
        if(p.gnd&&k===0&&!(frontM&&dd<=dw))RBP(X,g+1,Z,WSROUGH); // the plinth stepped out
        if(p.gnd&&p.pil&&!corner&&pa%4===0)RBS(X,Z,Math.max(y0,g+2),Math.min(y1-1,eave-2),WSPILLAR);
        if(p.butt&&k===0&&(corner||sA&&!sB&&pa%2===1)){RBS(X,Z,g+1,eave-2,WSBRICK);RBP(X,eave-1,Z,WSTRIM);}}
      if(k===0&&frontM&&p.lamp&&dd===ld)RBP(X,g+3,Z,LANTERN);
      if(cot&&k===0&&p.gnd){const q=hsh(p.u0,9531,p.v0);
        if(frontM&&win){RBP(X,g+1,Z,PLANKS);RBP(X,g+2,Z,[FLOWR,FLOWY,LAVENDER,OXEYE][(hsh(X,9533,Z)*4)|0]);}
        else if(frontM&&dd===dw+1&&q<0.6)RBP(X,g+1,Z,PLANKS);
        else if(ca<0&&!sB&&cb>=1&&cb<=Math.min(3,D-2)&&q>0.35)RBS(X,Z,g+1,g+2,LOG);}}
  }
  const R=ring(st-1),inR=ca>=R[0]&&ca<=R[1]&&cb>=R[2]&&cb<=R[3],onR=inR&&(ca===R[0]||ca===R[1]||cb===R[2]||cb===R[3]);
  const sA=ca<R[0]||ca>R[1],sB=cb<R[2]||cb>R[3];
  // a flat roof behind a parapet carried out on corbels (the cornice and its corbels are the top storey's)
  if(p.batt){if(inR&&!onR)RBP(X,eave,Z,ca===1&&cb===D-2?LADDER:WSTONE);
    else if(!inR){const pa=sB?ca:cb;RBP(X,eave+1,Z,WSBRICK);if(sA&&sB||((pa%2)+2)%2===0)RBP(X,eave+2,Z,WSBRICK);}return;}
  // the gables and a frieze along the eaves carried up to the roof (a window in a gable), the loft, the roof
  const gableM=alongB?sB:sA,gableW=alongB?(cb===R[2]||cb===R[3]):(ca===R[0]||ca===R[1]),eaveW=alongB?(ca===R[0]||ca===R[1]):(cb===R[2]||cb===R[3]);
  const gpa=alongB?ca-R[0]:cb-R[2],gmid=(span-1)/2,gwall=stone?WSBRICK:wat?(gpa%3===0?LOG:WATTLE):gpa%3===0?TIMBER:PLASTER;
  if(onR){for(let y=eave+1;y<ry;y++){let id=gwall;
      if(gableW&&!eaveW){const o=Math.abs(pos-gmid),dy=y-eave;if(p.rose?(o<0.6&&dy>=2&&dy<=4)||(o>0.4&&o<1.6&&dy===3):!cot&&o<0.6&&dy===rb+1&&ry-eave>=rb+3)id=LGLASS;
        else if(wat&&o<0.6&&dy===rb+2&&ry-eave>=rb+4)id=CTIMBER;} // a carved boss high in a longhouse's gable
      RBP(X,y,Z,id);}}
  else if(inR){if(ry>eave+1)RBP(X,eave,Z,PLANKS);for(let y=eave+1;y<ry;y++)RBP(X,y,Z,AIR);}
  else if(low)RBP(X,ry-1,Z,roof); // the thatch thick at its edges
  else if(gableM&&ry-1>eave)RBP(X,ry-1,Z,stone?WSTRIM:PLANKS); // a barge board under the verge
  RBP(X,ry,Z,roof);for(let y=ry-1;y>ry-pit&&y>eave;y--)RBP(X,y,Z,roof); // a steep roof, its steps filled
  if(!cot&&gableM&&!(alongB?sA:sB)&&Math.abs(pos-gmid)<0.6)RBP(X,ry+1,Z,p.horns?HORNS:stone?WSPILLAR:LOG); // a finial on the gable
  // dormers in the upper roofs: a window at the wall's plane under a little gable of its own
  if(!cot&&st>=2&&span>=7&&inR){const p0=alongB?R[0]:R[2],p1=alongB?R[1]:R[3],q=pos-p0<=1?pos-p0:p1-pos<=1?p1-pos:-1;
    if(q>=0){const lo=alongB?R[2]:R[0],Lr=(alongB?R[3]:R[1])-lo+1,dl=(alongB?cb:ca)-lo,off=((dl-2)%4+4)%4,c=off===0?dl:off===1?dl-1:off===3?dl+1:-9,yW=ry-q;
      if(c>=2&&c<=Lr-3){if(dl===c){if(q===0){RBP(X,yW,Z,LGLASS);RBP(X,yW+1,Z,stone?WSTRIM:PLANKS);}else RBP(X,yW+1,Z,AIR);RBP(X,yW+2,Z,roof);}
        else if(q===0){RBP(X,yW,Z,stone?WSBRICK:PLASTER);RBP(X,yW+1,Z,roof);}}}}
  // chimneys: a stack through the roof, capped; or up the back gable outside a cottage, wider at its foot
  if(p.chim&&ca===p.chim[0]&&cb===p.chim[1]){RBS(X,Z,g+1,ry+1,stone?SBRICK:COBBLE);RBP(X,ry+2,Z,stone?WSTRIM:COBBLE);}
  if(p.xchim&&mg[3]&&cb===D){const o=Math.abs(ca-(W>>1));if(o===0)RBS(X,Z,g+1,eave+rb+Math.floor(gmid)+2,COBBLE);else if(o===1)RBS(X,Z,g+1,g+2,COBBLE);}
};
// A square tower of half-width p.h2 rising p.H over p.y, in a margin ring of p.mg (1 unless given) for its relief: a rock-faced
// foot (battered out into the margin with p.batt, outside a wall's inner face p.wr), toothed quoins, arrow slits set into its
// faces, a moulded band at p.band, a carved band under the top, and a parapet carried out on corbels with merlons; p.roof a
// slate spire within the parapet (twice as steep on towers of half-width 3 or more), p.ban a banner on its roof, p.fire a beacon, p.hollow floors and a ladder inside, p.bell an
// open belfry with a bell under the spire; p.gp keeps the margin out of a gate's passage (|v| up to p.gp)
RB.tower=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,m=Math.max(Math.abs(a),Math.abs(b)),h2=p.h2,g=p.y,top=g+p.H,mg=p.mg===undefined?1:p.mg;if(m>h2+mg)return;
  const t=Math.abs(a)>=Math.abs(b)?b:a; // along the face, from its middle
  if(m===h2+1){ // the margin ring
    if(p.gp!==undefined&&Math.abs(v)<=p.gp)return;if(p.wr&&Math.max(Math.abs(u),Math.abs(v))<p.wr-2)return;
    const cor=Math.abs(a)===m&&Math.abs(b)===m,alt=cor||((t%2)+2)%2===1;
    if(p.batt&&!(p.hollow&&b<0&&a===0)){RBP(X,g+1,Z,WSROUGH);RBP(X,g+2,Z,WSROUGH);}if(p.band)RBP(X,g+p.band,Z,WSTRIM);
    if(alt)RBP(X,top-1,Z,WSTONE);RBP(X,top,Z,WSTRIM);RBP(X,top+1,Z,WSBRICK);if(alt)RBP(X,top+2,Z,WSBRICK);return;}
  const ring=m===h2,cor=Math.abs(a)===h2&&Math.abs(b)===h2,slit=h2>=4?Math.abs(t)===2:t===0;
  RBP(X,g,Z,WSROUGH);
  for(let y=g+1;y<=top;y++){const dy=y-g;let id;
    if(ring){
      if(dy<=2)id=WSROUGH;else if(cor)id=WSTONE;else if(Math.abs(t)===h2-1&&dy%2===1)id=WSTONE;
      else if(y===top-2)id=t===0?WSCARVE:WSTRIM;else if(p.band&&dy===p.band)id=WSTRIM;
      else if(slit&&dy%7>=3&&dy%7<=4&&y<top-4)id=p.hollow?AIR:LGLASS;else id=WSBRICK;
      if(p.bell&&!cor&&t===0&&y>=top-4&&y<top-1)id=AIR; // the belfry's openings
      if(p.hollow&&b===-h2&&a===0&&dy>=1&&dy<=3)id=dy===3?WSTRIM:AIR;} // a door into a hollow tower, toward the front
    else if(p.hollow){const lad=Math.abs(a)===h2-1&&b===0;id=lad?LADDER:y===top?WSBRICK:dy%6===0?PLANKS:dy%6===5&&a===0&&b===0?LANTERN:AIR;}
    else if(p.bell&&y>=top-4)id=y===top?WSBRICK:y===top-1&&a===0&&b===0?GOLDB:AIR;
    else id=WSBRICK;
    RBP(X,y,Z,id);}
  if(mg===0&&!p.roof){if(ring&&!cor&&(Math.abs(a)+Math.abs(b))%2===0)RBP(X,top+1,Z,WSBRICK);if(cor){RBP(X,top+1,Z,WSBRICK);RBP(X,top+2,Z,WSBRICK);}}
  if(p.roof&&m<=h2){const k=h2>=3?2:1,ry=top+1+(h2-m)*k;for(let y=Math.max(top+1,ry-k+1);y<=ry;y++)RBP(X,y,Z,m===0?WSPILLAR:SLATE); // the spire, steeper on the great towers
    if(m===0){RBP(X,ry+1,Z,WSPILLAR);RBP(X,ry+2,Z,RBANNER);RBP(X,ry+3,Z,RBANNER);}}
  if(!p.roof&&a===0&&b===0){if(p.fire){RBS(X,Z,top+1,top+2,LOG);RBP(X,top+3,Z,BRAZIER);}else if(p.ban){RBS(X,Z,top+1,top+2,WSPILLAR);RBS(X,Z,top+3,top+4,RBANNER);}}
  if(p.fire&&!p.roof&&m===1&&!cor)RBP(X,top+1,Z,LOG);
};
// A curtain wall round a square site, p.r its outer face, three thick and p.H high, with a margin outside it for its relief: a
// rock-faced foot battered out, a moulded course over it, buttresses, and a parapet carried out on corbels with merlons along
// its top, over a walk three wide; p.arc a blind arcade along its inner face; p.low a low wall with plain merlons. The gate
// through the middle of its front (p.gw wide, p.gh high, a portcullis drawn up) is paved; the realm's sign is carved over it.
RB.cwall=(s,p,u,v,X,Z)=>{const m=Math.max(Math.abs(u),Math.abs(v)),R=p.r;if(m>R+1||m<R-2)return;const g=siteG(s,u,v),top=g+p.H,t=Math.abs(u)>=Math.abs(v)?v:u;
  const gateRow=-u>=R-2&&Math.abs(v)<=p.gw&&Math.abs(u)>=Math.abs(v);
  if(m===R+1){if(gateRow){RBP(X,g,Z,p.low?GRAVEL:PAVING);return;}
    RBP(X,g+1,Z,WSROUGH);if(p.low)return;RBP(X,g+2,Z,WSROUGH);
    const cor=Math.abs(u)===m&&Math.abs(v)===m,alt=cor||((t%2)+2)%2===1;
    if(!cor&&((t%10)+10)%10===5)RBS(X,Z,g+3,top-2,WSBRICK); // buttresses
    if(alt)RBP(X,top-1,Z,WSTONE);RBP(X,top,Z,WSTRIM);RBP(X,top+1,Z,WSBRICK);if(alt)RBP(X,top+2,Z,WSBRICK);return;}
  const loop=m===R&&!p.low&&((t%10)+10)%10===0; // arrow loops between the buttresses
  for(let y=g+1;y<=top;y++){let id=y<=g+2?WSROUGH:y===g+3&&m===R?WSTRIM:loop&&y>=top-4&&y<=top-3?AIR:WSBRICK;
    if(p.arc&&m===R-2){const q=((t%6)+6)%6;if(y===g+6)id=WSTRIM;else if(y>=g+2&&y<=g+5)id=q===0?WSPILLAR:(y<=g+4||q>=2&&q<=4)?AIR:WSBRICK;}
    if(gateRow){const dy=y-g,arch=Math.abs(v)===p.gw?p.gh-1:p.gh;if(dy<=arch)id=AIR;else if(dy===arch+1&&Math.abs(v)<p.gw&&u===-R+1)id=GRATE;}
    RBP(X,y,Z,id);}
  if(gateRow)RBP(X,g,Z,p.low?GRAVEL:PAVING);
  if(gateRow&&u===-R&&v===0)RBP(X,g+p.gh+3,Z,WSCARVE);
  if(p.low&&m===R&&!gateRow&&(Math.abs(u)+Math.abs(v))%2===0)RBP(X,top+1,Z,WSBRICK);
};
// The gatehouse's front between its two towers (p.v0 to p.v1, the passage p.gw either side of the middle): a wall two thick
// from over the arch to the towers' tops, the arch moulded with its shoulders stepped, the portcullis's teeth showing in its
// slot, the realm's sign over it, a parapet carried out on corbels in front, so the passage runs five deep to the gate
RB.gatefront=(s,p,u,v,X,Z)=>{const g=p.y,gh=p.gh,top=g+p.H,av=Math.abs(v),k=u-p.u0;RBP(X,g,Z,PAVING);
  if(k===0){const alt=av%2===1;if(alt)RBP(X,top-1,Z,WSTONE);RBP(X,top,Z,WSTRIM);RBP(X,top+1,Z,WSBRICK);if(alt)RBP(X,top+2,Z,WSBRICK);
    if(av<=p.gw)RBP(X,g+gh+1,Z,WSTRIM);return;}
  for(let y=g+1;y<=top;y++){const dy=y-g;let id=WSBRICK;
    if(av<p.gw&&dy<=gh||av===p.gw&&dy<gh)id=AIR;else if(av===p.gw&&dy===gh)id=WSTRIM;else if(dy===gh+1&&av<p.gw)id=k===1?WSTRIM:GRATE;
    else if(v===0&&dy===gh+3&&k===1)id=WSCARVE;else if(k===1&&(dy===gh+5||dy===top-g-2))id=WSTRIM;
    RBP(X,y,Z,id);}
};
// banners hung on the outer face of a wall: two blocks long, at p.y
RB.banner=(s,p,u,v,X,Z)=>{RBS(X,Z,p.y,p.y+(p.n||2)-1,RBANNER);};
// a ladder up a face from p.y0 to p.y1
RB.ladder=(s,p,u,v,X,Z)=>{RBS(X,Z,p.y0,p.y1,LADDER);};
// a lamp on a white post
RB.lamp=(s,p,u,v,X,Z)=>{const g=p.y;RBP(X,g,Z,WSBRICK);RBS(X,Z,g+1,g+2,WSPILLAR);RBP(X,g+3,Z,LANTERN);};
// the ground inside a city's walls: flagstones on the avenue between kerbs and in rings about the square's fountain, cobbled
// lanes with flagstones here and there; where a tier rises over the one below, a retaining wall of rock-faced stone under a
// moulded coping and a parapet with piers (a lamp on every other one), and now and then a buttress against its foot
RB.cground=(s,p,u,v,X,Z)=>{const m=Math.max(Math.abs(u),Math.abs(v));if(m>s.R-3)return;const t=cityTier(s,u,v),g=s.T+t*5;
  let low=t,high=t;for(const [du,dv] of [[1,0],[-1,0],[0,1],[0,-1]]){const q=cityTier(s,u+du,v+dv);low=Math.min(low,q);high=Math.max(high,q);}
  if(low<t){RBS(X,Z,s.T+low*5+1,g-1,WSROUGH);RBP(X,g,Z,WSTRIM);
    if(!p.stair(u,v)){const pier=((u+v)%7+7)%7===0;RBP(X,g+1,Z,pier?WSPILLAR:WSBRICK);if(pier)RBP(X,g+2,Z,((u+v)%14+14)%14===0?LANTERN:WSTRIM);}return;}
  if(high>t&&!p.stair(u,v)&&p.free(u,v)&&((u*3+v*5)%9+9)%9===0){RBS(X,Z,g+1,g+3,WSROUGH);RBP(X,g+4,Z,WSTRIM);}
  if(p.garden(u,v))return;const av=Math.abs(v);
  RBP(X,g,Z,p.square(u,v)?(Math.max(Math.abs(u-p.scu),av)%4===0?WSBRICK:PAVING):av<=4?(av===4?WSBRICK:PAVING):hsh(X,9503,Z)<0.7?COBBLE:PAVING);
};
// stairs up the avenue where it climbs a tier: five steps of one block between parapets that step with them, and over the top
// an arch on pillars, its shoulders stepped in, its head moulded with the realm's sign at the crown and merlons above
RB.cstair=(s,p,u,v,X,Z)=>{const k=u-p.u0,yl=p.y,av=Math.abs(v);
  if(av<=3){if(k<5){RBS(X,Z,yl+1,yl+k+1,WSBRICK);RBP(X,yl+k+1,Z,PAVING);}RBS(X,Z,yl+k+2,yl+12,AIR);}
  else if(k<5){RBS(X,Z,yl+1,yl+k+1,WSROUGH);RBP(X,yl+k+2,Z,WSTRIM);}
  if(k===5){if(av===4){RBS(X,Z,yl+6,yl+11,WSPILLAR);RBP(X,yl+12,Z,WSTRIM);RBP(X,yl+13,Z,WSBRICK);}
    else{if(av===3)RBP(X,yl+11,Z,WSTRIM);RBP(X,yl+12,Z,av===0?WSCARVE:WSTRIM);if(av%2===0)RBP(X,yl+13,Z,WSBRICK);}}};
// a garden: grass left as it grows, a fruit tree in blossom or a white-leafed one, a box hedge round it
RB.garden=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,edge=a===0||b===0||a===W-1||b===D-1;
  RBP(X,g,Z,GRASS);if(edge){if(!(b===0&&Math.abs(a-(W>>1))<=1))RBP(X,g+1,Z,LEAVES);return;}
  const cx=W>>1,cz=D>>1,d=Math.hypot(a-cx,b-cz);if(d<0.5){RBS(X,Z,g+1,g+3,LOG);}
  if(d<=2.3)for(let y=g+3;y<=g+5;y++){const e=Math.hypot(a-cx,(y-g-4)*1.3,b-cz);if(e<=2.4&&!(d<0.5&&y<g+4))RBP(X,y,Z,p.bl?BLOSSOM:FRUITL);}
  else if(hsh(X,9505,Z)<0.3)RBP(X,g+1,Z,[FLOWR,FLOWY,LAVENDER,OXEYE][(hsh(X,9507,Z)*4)|0]);};
// a fountain: a basin of white stone under a moulded rim holding water; in its middle a fluted column carrying a bowl, the
// realm's sign carved over it and a lamp on top
RB.fountain=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,m=Math.max(Math.abs(a),Math.abs(b)),g=p.y;if(m>3)return;
  if(m===3){RBP(X,g,Z,WSROUGH);RBP(X,g+1,Z,WSTRIM);return;}RBP(X,g-1,Z,WSBRICK);RBP(X,g,Z,WATER);
  if(m===1&&(a===0||b===0))RBP(X,g+2,Z,WSTRIM);
  if(m===0){RBS(X,Z,g,g+2,WSPILLAR);RBP(X,g+3,Z,WSCARVE);RBP(X,g+4,Z,WSTRIM);RBP(X,g+5,Z,LANTERN);}};
// a market stall: posts and a striped awning, a counter of planks with wares on it
RB.stall=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,post=(a===0||a===W-1)&&(b===0||b===D-1);
  if(post)RBS(X,Z,g+1,g+3,LOG);RBP(X,g+4,Z,(a+(p.c||0))%2?WOOLW:p.wool||WOOLR);
  if(b===0&&!post){RBP(X,g+1,Z,PLANKS);const w=hsh(X,9509,Z);RBP(X,g+2,Z,w<0.3?FLOWR:w<0.5?WHEAT:w<0.65?POT3:AIR);}
  if(b===D-1&&!post&&hsh(X,9511,Z)<0.6)RBP(X,g+1,Z,hsh(X,9513,Z)<0.5?BARREL:CRATE);};
// a well: a ring of stone round water, posts and a little roof
RB.well=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,m=Math.max(Math.abs(a),Math.abs(b)),g=p.y;if(m>1)return;
  if(m===0){RBS(X,Z,g-4,g-1,WATER);RBP(X,g,Z,WATER);RBS(X,Z,g+1,g+3,AIR);RBP(X,g+4,Z,p.roof||PLANKS);return;}
  RBP(X,g,Z,COBBLE);RBP(X,g+1,Z,COBBLE);const cor=Math.abs(a)===1&&Math.abs(b)===1;if(cor)RBS(X,Z,g+2,g+3,LOG);RBP(X,g+4,Z,p.roof||PLANKS);
  RBS(X,Z,g-4,g-1,COBBLE);};
// a statue of a king of old: on a rock-faced plinth under a moulded cap, the king in white stone, cloaked, broad in the
// shoulder, the realm's sign on his breast, a sword held point-down before him, a crown of gold
RB.statue=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,g=p.y;if(Math.abs(a)>1||Math.abs(b)>1)return;RBP(X,g+1,Z,WSROUGH);RBP(X,g+2,Z,WSTRIM);
  if(a===0&&b===0){RBS(X,Z,g+3,g+6,WSTONE);RBP(X,g+5,Z,WSCARVE);RBP(X,g+7,Z,WSTONE);RBP(X,g+8,Z,GOLDB);}
  else if(b===0&&Math.abs(a)===1)RBP(X,g+6,Z,WSTONE);
  else if(a===0&&b===1)RBS(X,Z,g+3,g+6,WSTONE);
  else if(a===0&&b===-1){RBS(X,Z,g+3,g+4,WSPILLAR);RBP(X,g+5,Z,WSTRIM);}};
// lanes and paths: a strip of path (p.id), the grass cleared of its plants above
RB.lane=(s,p,u,v,X,Z)=>{RBP(X,p.y,Z,p.id||PATH);RBP(X,p.y+1,Z,AIR);};
// The Hall of Lamps: a square hall of white stone on a rock-faced foot, fluted pilasters between tall windows set back in their
// reveals, a moulded cornice with the realm's sign at the middle of each face, a portico of two pillars before its door; on its
// roof a parapet with lamps at the corners, a drum ringed with windows and a dome of slate on ribs of white stone, a lantern on
// its crown; inside it is open up into the dome, lamps hung about it
RB.dome=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,H=p.H,c=(W-1)/2,dx=a-c,dz=b-(D-1)/2,m=Math.max(Math.abs(dx),Math.abs(dz)),wl=c-1;
  const t=Math.abs(dx)>=Math.abs(dz)?dz:dx,at=Math.abs(t),door=dz<0&&Math.abs(dx)<=1&&-dz>=Math.abs(dx);
  if(m>wl){const cor=Math.abs(dx)>wl&&Math.abs(dz)>wl;if(!door)RBP(X,g+1,Z,WSROUGH);
    if(!cor&&!door&&at%3===0)RBS(X,Z,g+2,g+H-1,WSPILLAR);
    if(dz<0&&-dz>Math.abs(dx)&&Math.abs(dx)===2)RBS(X,Z,g+1,g+H-1,WSPILLAR); // the portico
    RBP(X,g+H,Z,WSTRIM);return;}
  const edge=m===wl,cor=edge&&Math.abs(dx)===wl&&Math.abs(dz)===wl,win=at%3===1&&at<wl-1;RBP(X,g,Z,edge?WSROUGH:WSTONE);
  for(let y=g+1;y<=g+H;y++){let id=AIR;const dy=y-g;
    if(edge){id=dy<=1?WSROUGH:cor?WSPILLAR:y===g+H?(t===0?WSCARVE:WSTRIM):win&&dy>=3&&dy<=H-2?AIR:WSBRICK;if(door&&dy<=4)id=AIR;}
    else if(m===wl-1&&dy>=3&&dy<=H-2){const tt=Math.abs(dx)===wl-1?Math.abs(dz):Math.abs(dx);if(tt%3===1&&tt<wl-1)id=LGLASS;}
    else if(dy===H-1&&Math.abs(dx)===3&&Math.abs(dz)===3)id=LANTERN;
    RBP(X,y,Z,id);}
  const rd=wl-3,d=Math.hypot(dx,dz),yd=g+H+4,rr=rd+0.5;
  if(edge){RBP(X,g+H+1,Z,WSTRIM);if(cor){RBP(X,g+H+2,Z,WSPILLAR);RBP(X,g+H+3,Z,LANTERN);}return;}
  if(d>rr){RBP(X,g+H,Z,WSTONE);return;} // the roof about the drum
  if(d>rd-0.5){for(let y=g+H;y<yd;y++)RBP(X,y,Z,y===g+H+2&&((Math.round(Math.atan2(dz,dx)/6.2832*20)%2)+2)%2===0?LGLASS:WSBRICK);RBP(X,yd,Z,WSTRIM);}
  const hi=yd+Math.round(Math.sqrt(Math.max(0,rr*rr-d*d))),lo=d+1<rr?yd+Math.round(Math.sqrt(rr*rr-(d+1)*(d+1))):yd,rib=Math.abs(dx)<0.6||Math.abs(dz)<0.6||Math.abs(Math.abs(dx)-Math.abs(dz))<0.6;
  if(d<=rd-0.5)for(let y=g+H;y<=Math.min(lo,hi-1);y++)RBP(X,y,Z,AIR);
  for(let y=Math.min(lo+1,hi);y<=hi;y++)RBP(X,y,Z,d<1?WSTRIM:rib?WSTONE:SLATE);
  if(d<1){RBP(X,hi+1,Z,WSPILLAR);RBP(X,hi+2,Z,LANTERN);}};
// a smithy: a stone hearth with its fire under a hood and a chimney up the back wall, a furnace, an anvil of iron, water to
// quench in, under a gabled roof on posts open at the front, a beam across it
RB.smithy=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,back=b===D-1,side=a===0||a===W-1;RBP(X,g,Z,COBBLE);
  for(let y=g+1;y<=g+4;y++)RBP(X,y,Z,back||(side&&b>0)?(y===g+4?LOG:COBBLE):side||y===g+4&&b===0?LOG:AIR);
  const ry=g+5+Math.min(a,W-1-a);if(!side&&(b===0||back))for(let y=g+5;y<ry;y++)RBP(X,y,Z,back?COBBLE:PLANKS);RBP(X,ry,Z,p.roof||SLATE);
  if(b===D-2&&a===1){RBP(X,g+1,Z,COBBLE);RBP(X,g+2,Z,BRAZIER);RBP(X,g+4,Z,COBBLE);}if(back&&a===1)RBS(X,Z,g+5,ry+2,COBBLE);
  if(b===D-2&&a===2)RBP(X,g+1,Z,FURN);if(b===2&&a===2)RBP(X,g+1,Z,STEELB);if(b===D-2&&a===W-2)RBP(X,g+1,Z,BARREL);
  if(b===1&&a===W-2){RBP(X,g,Z,COBBLE);RBP(X,g+1,Z,WATER);}};
// a training yard: sand, straw men on posts, archery butts
RB.yard=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y;RBP(X,g,Z,a===0||b===0||a===W-1||b===D-1?WSBRICK:hsh(X,9515,Z)<0.5?SAND:GRAVEL);
  if(a%4===2&&b===3){RBP(X,g+1,Z,LOG);RBP(X,g+2,Z,HAYBALE);RBP(X,g+3,Z,WOOLW);}
  if(b===D-2&&a%4===1&&a<W-1){RBS(X,Z,g+1,g+2,HAYBALE);RBP(X,g+3,Z,WOOLR);}};
// stables: stalls open at the front between posts, a hayloft over them under a gabled slate roof, hay and a water trough
RB.stable=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,back=b===D-1,end=a===0||a===W-1,ry=g+4+Math.min(b,D-1-b);RBP(X,g,Z,back?COBBLE:hsh(X,9517,Z)<0.4?HAYBALE:DIRT);
  for(let y=g+1;y<=g+3;y++)RBP(X,y,Z,back||end?PLANKS:b===0&&a%3===0?LOG:a%3===0&&b<D-1&&y===g+1?PLANKS:AIR);
  RBP(X,g+4,Z,b===0&&!end?LOG:PLANKS);for(let y=g+5;y<ry;y++)RBP(X,y,Z,end?PLANKS:y===g+5&&b>0&&b<D-1&&hsh(X,9535,Z)<0.4?HAYBALE:AIR);RBP(X,ry,Z,p.roof||SLATE);
  if(b===D-2&&a%3===2)RBP(X,g+1,Z,HAYBALE);if(b===1&&a%3===2){RBP(X,g,Z,COBBLE);RBP(X,g+1,Z,WATER);}};
// a haystack
RB.hay=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,g=p.y,m=Math.abs(a)+Math.abs(b);if(m>2)return;RBS(X,Z,g+1,g+(m===0?3:m===1?2:1),HAYBALE);};
// a field: tilled earth on the land as it lies, crops in rows, a hedge round it with a gap at the front
RB.field=(s,p,u,v,X,Z)=>{if(realmRoadAt(X,Z,1)||realmSiteAt(X,Z,2))return;const o=colInfo(X,Z,TRB);if(o.wet||o.river||o.lake||o.b===0||o.h<o.sl+2)return;const g=o.h;if(slopeAt(X,Z,g)>1)return;
  const [a,b,W,D]=partAB(p,u,v),edge=a===0||b===0||a===W-1||b===D-1;
  if(edge){if(!(b===0&&Math.abs(a-(W>>1))<=1)){RBP(X,g,Z,GRASS);RBP(X,g+1,Z,LEAVES);if(hsh(X,9519,Z)<0.4)RBP(X,g+2,Z,LEAVES);}return;}
  if(a%5===0){RBP(X,g,Z,FARM_W);RBP(X,g+1,Z,AIR);return;}RBP(X,g,Z,FARM_D);RBP(X,g+1,Z,p.crop);RBP(X,g+2,Z,AIR);};
const TRB={};
// ---- Layouts
function siteLayout(s){if(s.lay)return s.lay;const L={parts:[],spots:[],pads:[]};s.lay=L;
  const r=rngAt(Math.round(s.X),9521,Math.round(s.Z));
  if(s.prov.cult.k==='dwarf')dwarfLayout(s,L,r);else if(s.prov.cult.k==='wood')woodLayout(s,L,r);else if(s.prov.cult.k==='elf')elfLayout(s,L,r);else if(s.prov.cult.k==='horse')riderLayout(s,L,r);else if(s.k==='city')cityLayout(s,L,r);else if(s.k==='village')villageLayout(s,L,r);else if(s.k==='farm')farmLayout(s,L,r);else if(s.k==='fort')fortLayout(s,L,r);else outpostLayout(s,L,r);
  // the margins about houses, towers and walls, where their relief stands
  for(const p of L.parts){if(p.k==='house'){if(!p.mg){const o=p.ov||0;p.mg=[o,o,o,o];}if(p.gnd===undefined)p.gnd=s.k!=='city';}
    else if(p.k==='tower'){const e=p.mg===undefined?1:p.mg;p.u0-=e;p.u1+=e;p.v0-=e;p.v1+=e;}else if(p.k==='cwall'){p.u0--;p.u1++;p.v0--;p.v1++;}}
  for(const p of L.parts){p.bu0=Math.min(p.u0,p.u1);p.bu1=Math.max(p.u0,p.u1);p.bv0=Math.min(p.v0,p.v1);p.bv1=Math.max(p.v0,p.v1);}
  return L;}
// The city: walls and towers round it, the gatehouse at the front, the avenue up through the tiers to the citadel; a square with
// a fountain and a market where the avenue crosses the first row of lanes; houses in a grid of lots between lanes (stone and
// timbered, two and three storeys), gardens among them; barracks and a training yard, a smithy and stables by the gate, an inn,
// the domed Hall of Lamps; in the citadel the great hall with its porch, the white tower, a court with a king's statue
function cityLayout(s,L,r){
  const R=s.R,f=cityFrame(s),cu=f.cu,rt=s.tiers>=3?f.r2:f.r1,P=L.parts,g0=s.T,tierY=t=>g0+t*5;
  const bounds=[];if(s.tiers>=3)bounds.push({r:f.r1,t:1},{r:f.r2,t:2});else bounds.push({r:f.r1,t:1});
  // where the avenue climbs: five rows before each boundary along it
  const stairAt=(u,v)=>Math.abs(v)<=4&&bounds.some(B=>u>=cu-B.r-5&&u<=cu-B.r);
  const lots=[],taken=(u0,u1,v0,v1)=>lots.some(q=>!(u1<q[0]||u0>q[1]||v1<q[2]||v0>q[3]));
  const fb=cu-f.r1,sq={u0:-R+28,u1:Math.min(-R+43,fb-7),v:22}; // the square: astride the avenue, behind the barracks rows
  if(sq.u1-sq.u0<10){sq.u0=-R+17;sq.u1=Math.min(-R+32,fb-7);}
  const gardens=[];
  P.push({k:'cground',u0:-R,u1:R,v0:-R,v1:R,f:0,stair:stairAt,garden:(u,v)=>gardens.some(q=>u>=q[0]&&u<=q[1]&&v>=q[2]&&v<=q[3]),square:(u,v)=>u>=sq.u0&&u<=sq.u1&&Math.abs(v)<=sq.v,scu:(sq.u0+sq.u1)>>1,
    free:(u,v)=>!P.some(q=>q.k!=='cground'&&q.k!=='cwall'&&u>=q.bu0-1&&u<=q.bu1+1&&v>=q.bv0-1&&v<=q.bv1+1)});
  lots.push([sq.u0,sq.u1,-sq.v,sq.v]);
  // the citadel's ground is its own
  const cit=[cu-rt,cu+rt,-rt,rt];lots.push(cit);
  // stairs and arches up the avenue
  for(const B of bounds){const u0=cu-B.r-5;P.push({k:'cstair',u0:u0,u1:u0+5,v0:-4,v1:4,f:0,y:tierY(B.t-1)});lots.push([u0-1,u0+6,-5,5]);}
  // lots: 9 by 9 in cells of 12, lanes of 3 between them; the first column beside the avenue faces it, the rest face the gate
  const cells=[];
  for(let cuI=0;;cuI++){const u0=-R+5+cuI*12,u1=u0+8;if(u1>R-5)break;
    for(let cvI=0;;cvI++){const v0=5+cvI*12,v1=v0+8;if(v1>R-5)break;for(const sg of [1,-1]){const a0=sg>0?v0:-v1,a1=sg>0?v1:-v0;cells.push({u0:u0,u1:u1,v0:a0,v1:a1,ci:cuI,cj:cvI,sg:sg});}}}
  const tierOf=(c)=>{const ts=new Set();for(const [uu,vv] of [[c.u0-1,c.v0-1],[c.u1+1,c.v0-1],[c.u0-1,c.v1+1],[c.u1+1,c.v1+1],[(c.u0+c.u1)>>1,(c.v0+c.v1)>>1]])ts.add(cityTier(s,uu,vv));return ts.size===1?[...ts][0]:-1;};
  // the special buildings by the gate and on the avenue
  const special=new Map(),want=(ci,cj,sg,k)=>{special.set(ci+','+cj+','+sg,k);};
  const sgA=r()<0.5?1:-1;want(0,0,sgA,'barracks');want(0,1,sgA,'barracks2');want(1,0,sgA,'yard');want(1,1,sgA,'yard2');want(0,0,-sgA,'smithy');want(0,1,-sgA,'stable');
  for(const c of cells){if(taken(c.u0,c.u1,c.v0,c.v1))continue;const t=tierOf(c);if(t<0)continue;const g=tierY(t),key=c.ci+','+c.cj+','+c.sg,sp=special.get(key);
    const faceAv=c.cj===0?(c.sg>0?2:3):0; // toward the avenue, or toward the gate
    if(sp==='barracks'||sp==='barracks2'){if(sp==='barracks'){const other=cells.find(q=>q.ci===c.ci&&q.cj===1&&q.sg===c.sg);if(other&&tierOf(other)===t&&!taken(other.u0,other.u1,other.v0,other.v1)){
        const v0=Math.min(c.v0,other.v0),v1=Math.max(c.v1,other.v1);P.push(housePart(c.u0,c.u1,v0,v1,0,[1,1,1,1],{y:g,st:2,sh:5,mat:'stone',roof:SLATE,door:Math.floor((v1-v0)/2),dw:2,dh:3,lamp:true,ridge:'a',chim:[2,8],pil:true}));
        L.spots.push({kind:'barracks',u:c.u0-2,v:(v0+v1)/2,y:g});lots.push([c.u0,c.u1,v0,v1]);}}continue;}
    if(sp==='yard'||sp==='yard2'){if(sp==='yard'){const other=cells.find(q=>q.ci===c.ci&&q.cj===1&&q.sg===c.sg);if(other&&tierOf(other)===t){const v0=Math.min(c.v0,other.v0),v1=Math.max(c.v1,other.v1);
        P.push({k:'yard',u0:c.u0,u1:c.u1,v0:v0,v1:v1,f:0,y:g});L.spots.push({kind:'drill',u:(c.u0+c.u1)/2,v:(v0+v1)/2,y:g});lots.push([c.u0,c.u1,v0,v1]);}}continue;}
    if(sp==='smithy'){P.push({k:'smithy',u0:c.u0,u1:c.u1,v0:c.v0,v1:c.v1,f:faceAv,y:g});L.spots.push({kind:'smithy',u:(c.u0+c.u1)/2,v:c.sg*3,y:g});continue;}
    if(sp==='stable'){P.push({k:'stable',u0:c.u0,u1:c.u1,v0:c.v0,v1:c.v1,f:0,y:g});continue;}
    const q=r();
    if(q<0.11){gardens.push([c.u0,c.u1,c.v0,c.v1]);P.push({k:'garden',u0:c.u0,u1:c.u1,v0:c.v0,v1:c.v1,f:0,y:g,bl:r()<0.5});continue;}
    if(q<0.4&&c.cj>0){ // two narrow houses side by side, their gables to the lane
      const w1=4+(r()<0.5?1:0),f0=faceAv;const st1=r()<0.5?3:2,st2=r()<0.5?3:2,m1=r()<0.5?'stone':'timber',m2=r()<0.5?'stone':'timber';
      P.push(housePart(c.u0,c.u1,c.v0,c.v0+w1-1,f0,[1,0,1,1],{y:g,st:st1,sh:4,mat:m1,roof:SLATE,door:Math.floor(w1/2),lamp:true,ridge:'b',chim:[1,8]}));
      P.push(housePart(c.u0,c.u1,c.v0+w1,c.v1,f0,[0,1,1,1],{y:g,st:st2,sh:4,mat:m2,roof:SLATE,door:Math.floor((9-w1)/2),lamp:true,ridge:'b',chim:[1,8]}));
      L.spots.push({kind:'street',u:c.u0-2,v:(c.v0+c.v1)/2,y:g});continue;}
    const st=r()<0.45?3:2,mat=r()<0.55?'stone':'timber';
    P.push(housePart(c.u0,c.u1,c.v0,c.v1,faceAv,[1,1,1,1],{y:g,st:st,sh:4,mat:mat,roof:SLATE,door:4,lamp:true,ridge:r()<0.5?'a':'b',chim:[1,8]}));
    if(q>0.75)L.spots.push({kind:'street',u:c.u0-2,v:(c.v0+c.v1)/2,y:g});}
  // the square: flagstones, the fountain, stalls round it, lamps
  const scu=(sq.u0+sq.u1)>>1,sg0=tierY(cityTier(s,scu,0));
  P.push({k:'fountain',u0:scu-3,u1:scu+3,v0:-3,v1:3,cu:scu,cv:0,y:sg0});
  const wools=[WOOLR,WOOLB,WOOLY,WOOLG];let nst=0;
  for(const sg of [1,-1])for(let k=0;k<3;k++){const v0=sg>0?8+k*5:-(8+k*5)-3,u0=sq.u0+1;P.push({k:'stall',u0:u0,u1:u0+2,v0:v0,v1:v0+3,f:0,y:sg0,wool:wools[(nst++)%4],c:k});
    P.push({k:'stall',u0:sq.u1-3,u1:sq.u1-1,v0:v0,v1:v0+3,f:1,y:sg0,wool:wools[(nst++)%4],c:k});}
  L.spots.push({kind:'market',u:scu,v:12,y:sg0},{kind:'market',u:scu,v:-12,y:sg0},{kind:'street',u:scu-6,v:0,y:sg0});
  for(const [uu,vv] of [[sq.u0,sq.v],[sq.u0,-sq.v],[sq.u1,sq.v],[sq.u1,-sq.v]])P.push({k:'lamp',u0:uu,u1:uu,v0:vv,v1:vv,f:0,y:sg0});
  // lamps up the avenue, on both sides, every ten blocks (not on the stairs)
  for(let u=-R+6;u<cu-rt-2;u+=10)for(const vv of [4,-4]){if(stairAt(u,vv)||(u>=sq.u0&&u<=sq.u1))continue;P.push({k:'lamp',u0:u,u1:u,v0:vv,v1:vv,f:0,y:tierY(cityTier(s,u,vv))});}
  L.spots.push({kind:'street',u:-R+8,v:0,y:g0},{kind:'street',u:Math.round((sq.u1+cu-rt)/2),v:0,y:tierY(cityTier(s,Math.round((sq.u1+cu-rt)/2),0))});
  // the Hall of Lamps: a domed hall on a lot beside the avenue in the upper ring (or the lower), and an inn on the avenue
  {let best=null;for(const c of cells){if(c.sg!==1&&c.sg!==-1)continue;const q=[c,...[[1,0],[0,1],[1,1]].map(([a,b])=>cells.find(x=>x.ci===c.ci+a&&x.cj===c.cj+b&&x.sg===c.sg))];
      if(q.some(x=>!x)||q.some(x=>special.has(x.ci+','+x.cj+','+x.sg)))continue;const u0=c.u0,u1=c.u0+20,v0=Math.min(...q.map(x=>x.v0)),v1=Math.max(...q.map(x=>x.v1));
      if(v1-v0!==20||taken(u0-1,u1+1,v0,v1))continue;const t=tierOf({u0:u0,u1:u1,v0:v0,v1:v1});if(t<0)continue;const sc=-c.cj*3-Math.abs(c.ci-2)+hsh(c.ci,9529,c.cj);if(!best||sc>best.sc)best={u0:u0,u1:u1,v0:v0,v1:v1,t:t,sg:c.sg,cj:c.cj,sc:sc};}
    if(best){const g=tierY(best.t);for(let k=P.length-1;k>=0;k--){const q=P[k];const cb=q.core||[q.u0,q.u1,q.v0,q.v1];if((q.k==='house'||q.k==='garden')&&cb[0]>=best.u0&&cb[1]<=best.u1&&Math.min(cb[2],cb[3])>=best.v0&&Math.max(cb[2],cb[3])<=best.v1)P.splice(k,1);}
      for(let k=gardens.length-1;k>=0;k--){const q=gardens[k];if(q[0]>=best.u0&&q[1]<=best.u1&&q[2]>=best.v0&&q[3]<=best.v1)gardens.splice(k,1);}
      lots.push([best.u0,best.u1,best.v0,best.v1]);P.push({k:'dome',u0:best.u0,u1:best.u1,v0:best.v0,v1:best.v1,f:best.cj===0?(best.sg>0?2:3):0,y:g,H:9});
      L.spots.push({kind:'street',u:best.u0-2,v:(best.v0+best.v1)/2,y:g});}}
  // the citadel: a court before the great hall, the white tower behind it, gardens either side; guards at its arch
  {const ct=s.tiers>=3?2:1,g=tierY(ct),tw=s.tiers>=3?4:3,tu=cu+rt-tw-2,hu1=tu-tw-2,hw=Math.min(7,rt-5),hd=Math.max(7,Math.min(18,hu1-(cu-rt+8)-2)),hu0=hu1-hd-1;
    P.push(housePart(hu0+2,hu1,-hw,hw,0,[1,1,0,1],{y:g,st:1,sh:8,mat:'stone',roof:SLATE,door:hw,dw:2,dh:4,lamp:true,ridge:'b',porch:2,pil:true,floor:WSTONE,gnd:true}));
    {const H=s.tiers>=3?40:30;P.push({k:'tower',u0:tu-tw,u1:tu+tw,v0:-tw,v1:tw,cu:tu,cv:0,h2:tw,H:H,y:g,roof:true,batt:true,band:Math.round(H*0.6)});}
    P.push({k:'statue',u0:hu0-6,u1:hu0-4,v0:-1,v1:1,cu:hu0-5,cv:0,y:g});
    for(const sg of [1,-1]){const gv0=sg>0?hw+3:-rt+2,gv1=sg>0?rt-2:-hw-3;if(gv1-gv0>=4){gardens.push([cu-rt+3,cu+rt-3,gv0,gv1]);P.push({k:'garden',u0:cu-rt+3,u1:cu+rt-3,v0:gv0,v1:gv1,f:0,y:g,bl:true});}}
    for(const vv of [3,-3])P.push({k:'lamp',u0:hu0-3,u1:hu0-3,v0:vv,v1:vv,f:0,y:g});
    L.spots.push({kind:'citadel',u:hu0-8,v:0,y:g},{kind:'hall',u:hu0+Math.round(hd/2),v:0,y:g},{kind:'citgate',u:cu-rt+2,v:0,y:g});}
  // walls, towers at the corners and along the sides, the gatehouse; banners, ladders
  P.push({k:'cwall',u0:-R,u1:R,v0:-R,v1:R,f:0,r:R,H:11,gw:2,gh:7,arc:true});
  const tw=(cu0,cv0,h2,H,o)=>P.push(Object.assign({k:'tower',u0:cu0-h2,u1:cu0+h2,v0:cv0-h2,v1:cv0+h2,cu:cu0,cv:cv0,h2:h2,H:H,y:siteG(s,cu0,cv0),batt:true,wr:R,band:Math.round(H*0.55)},o||{}));
  for(const [a,b] of [[-1,-1],[-1,1],[1,-1],[1,1]])tw(a*(R-1),b*(R-1),4,17,{ban:true});
  const n=Math.max(1,Math.round(2*R/30));for(let k=1;k<n;k++){const t2=Math.round(-R+k*2*R/n);for(const sd of [-1,1]){tw(t2,sd*(R-1),3,15);if(Math.abs(t2)>8)tw(sd*(R-1),t2,3,15);}}
  tw(-(R-1),6,3,19,{ban:true,gp:2});tw(-(R-1),-6,3,19,{ban:true,gp:2});P.push({k:'gatefront',u0:-R-3,u1:-R-1,v0:-2,v1:2,f:0,y:g0,gw:2,gh:7,H:19});
  for(const vv of [6,-6])P.push({k:'banner',u0:-R-3,u1:-R-3,v0:vv,v1:vv,f:0,y:g0+12,n:3});
  for(const vv of [10,-10])P.push({k:'ladder',u0:-R+3,u1:-R+3,v0:vv,v1:vv,f:0,y0:g0+1,y1:g0+11});
  L.spots.push({kind:'gate',u:-R-6,v:0,y:g0},{kind:'gatein',u:-R+5,v:0,y:g0});
}
// A village: a green with a well in the middle, lanes out to the road and back, cottages round the green facing it (timbered
// plaster on cobble, thatched), an inn, a chapel of white stone with a bell tower, a smithy; haystacks and kitchen gardens
function villageLayout(s,L,r){
  const R=s.R,g=s.T,P=L.parts,small=R<24,rg=small?6:9,rs=small?11:17; // a hamlet (small) has a smaller green and its cottages closer in
  P.push({k:'lane',u0:-R,u1:-rg+2,v0:-1,v1:1,f:0,y:g});P.push({k:'lane',u0:rg-2,u1:R-2,v0:-1,v1:1,f:0,y:g});P.push({k:'lane',u0:-1,u1:1,v0:-R+3,v1:-rg+2,f:0,y:g});P.push({k:'lane',u0:-1,u1:1,v0:rg-2,v1:R-3,f:0,y:g});
  P.push({k:'ring',u0:-rg,u1:rg,v0:-rg,v1:rg,f:0,y:g,r:rg});
  P.push({k:'well',u0:-1,u1:1,v0:-1,v1:1,cu:0,cv:0,y:g,roof:THATCH});
  const slots=[];for(let k=0;k<8;k++){const a=(k*45+22.5)*Math.PI/180,rd=rs+(k%2)*2,cu0=Math.round(Math.cos(a)*rd),cv0=Math.round(Math.sin(a)*rd);
    slots.push([cu0,cv0,Math.abs(cu0)>Math.abs(cv0)?(cu0<0?1:0):(cv0<0?3:2)]);}
  const kinds=['chapel','inn','smithy'];
  const order=slots.map((q,i)=>[q,hsh(i,9523,Math.round(s.X))]).sort((a,b)=>a[1]-b[1]).map(q=>q[0]);
  order.forEach((q,i)=>{const [cu0,cv0,f]=q,kind=kinds[i]||'cottage',w=kind==='chapel'?7:kind==='inn'?9:7,d=kind==='chapel'?11:kind==='inn'?11:9;
    if(Math.max(Math.abs(cu0),Math.abs(cv0))+Math.max(w,d)/2>R-1)return;
    if(kind==='smithy'){P.push(partC('smithy',cu0,cv0,7,6,f,{y:g}));L.spots.push({kind:'smithy',u:cu0,v:cv0,y:g});return;}
    if(kind==='chapel'){P.push(partC('house',cu0,cv0,w+2,d+2,f,{W:w,D:d,mg:[1,1,1,1],y:g,st:1,sh:6,mat:'stone',roof:SLATE,door:3,dw:1,dh:3,lamp:true,ridge:'b',floor:WSTONE,butt:true,rose:true}));
      const p=P[P.length-1],bt=f===0?[p.u1-2,cv0]:f===1?[p.u0+2,cv0]:f===2?[cu0,p.v1-2]:[cu0,p.v0+2];P.push({k:'tower',u0:bt[0]-1,u1:bt[0]+1,v0:bt[1]-1,v1:bt[1]+1,cu:bt[0],cv:bt[1],h2:1,H:16,y:g,roof:true,mg:0,bell:true});return;}
    const ov=1,W=w-2*ov,D=d-2*ov;P.push(partC('house',cu0,cv0,w,d,f,{W:W,D:D,y:g,st:kind==='inn'?2:1,sh:4,mat:kind==='inn'?'timber':'cottage',ov:ov,roof:THATCH,door:Math.floor(W/2),dw:1,dh:2,lamp:kind==='inn',ridge:'b',chim:kind==='inn'?[1,D-1]:null,xchim:kind!=='inn'}));
    if(kind==='inn')L.spots.push({kind:'green',u:cu0*0.6,v:cv0*0.6,y:g});
    // a kitchen garden or a haystack behind
    const bu=f===0?cu0+d/2+2:f===1?cu0-d/2-2:cu0,bv=f===2?cv0+d/2+2:f===3?cv0-d/2-2:cv0;if(Math.max(Math.abs(bu),Math.abs(bv))<R-2){if(hsh(i,9525,Math.round(s.Z))<0.5)P.push({k:'hay',u0:Math.round(bu)-2,u1:Math.round(bu)+2,v0:Math.round(bv)-2,v1:Math.round(bv)+2,cu:Math.round(bu),cv:Math.round(bv),y:g});}});
  L.spots.push({kind:'green',u:-4,v:4,y:g},{kind:'green',u:4,v:-4,y:g},{kind:'lane',u:-R+4,v:0,y:g});
  fieldsRound(s,L,r,6);
}
// A farmstead: a farmhouse and a great barn across a yard, a well, haystacks; its fields about it
function farmLayout(s,L,r){
  const g=s.T,P=L.parts;
  P.push({k:'lane',u0:-s.R,u1:-3,v0:-1,v1:1,f:0,y:g});
  P.push(partC('house',-1,-7,9,11,3,{W:7,D:9,y:g,st:1,sh:4,mat:'cottage',ov:1,roof:THATCH,door:3,ridge:'b',xchim:true}));
  P.push(partC('house',1,8,11,13,2,{W:9,D:11,y:g,st:1,sh:6,mat:'cottage',ov:1,roof:SLATE,door:4,dw:2,dh:4,ridge:'b'}));
  P.push({k:'well',u0:-5,u1:-3,v0:2,v1:4,cu:-4,cv:3,y:g});P.push({k:'hay',u0:6,u1:10,v0:-4,v1:0,cu:8,cv:-2,y:g});
  L.spots.push({kind:'farm',u:-4,v:0,y:g});
  fieldsRound(s,L,r,4);
}
// fields in a ring about an open site: n rectangles beyond its edge, each a different crop
function fieldsRound(s,L,r,n){const base=s.R+s.M,crops=[WHEAT,WHEAT,POT3,TURN2,BEAN2,WHEAT];
  for(let k=0;k<n;k++){const a=(k+0.3+r()*0.4)/n*6.283,d=base+4+r()*10,u=Math.round(Math.cos(a)*d),v=Math.round(Math.sin(a)*d),w=10+Math.floor(r()*8),dd=8+Math.floor(r()*6),f=Math.abs(Math.cos(a))>Math.abs(Math.sin(a))?(Math.cos(a)>0?0:1):(Math.sin(a)>0?2:3);
    L.parts.push(partC('field',u,v,w,dd,f,{crop:crops[(k+(r()*6|0))%6]}));if(k<2)L.spots.push({kind:'field',u:u,v:v,y:-1});}}
// A castle: a curtain wall with towers at its corners and a gatehouse, a keep at the back with turrets and the realm's banner,
// barracks along one wall, stables along the other, a well and a training yard in the bailey
function fortLayout(s,L,r){
  const R=s.R,g=s.T,P=L.parts;
  P.push({k:'lane',u0:-R+3,u1:1,v0:-2,v1:2,f:0,y:g,id:PAVING});
  P.push(housePart(2,14,-6,6,0,[1,1,1,1],{y:g,st:4,sh:5,mat:'stone',roof:SLATE,door:6,dw:2,dh:3,lamp:true,ridge:'b',pil:true,floor:WSTONE,batt:true}));
  for(const [a,b] of [[2,-6],[2,6],[14,-6],[14,6]])P.push({k:'tower',u0:a-1,u1:a+1,v0:b-1,v1:b+1,cu:a,cv:b,h2:1,H:24,y:g,ban:a===14});
  P.push(housePart(-14,9,13,18,2,[1,1,1,1],{y:g,st:2,sh:4,mat:'stone',roof:SLATE,door:12,lamp:true,ridge:'a',chim:[2,5]}));
  P.push({k:'stable',u0:-14,u1:5,v0:-18,v1:-13,f:3,y:g});
  P.push({k:'yard',u0:-15,u1:-6,v0:-9,v1:6,f:0,y:g});
  P.push({k:'well',u0:-3,u1:-1,v0:8,v1:10,cu:-2,cv:9,y:g});
  P.push({k:'cwall',u0:-R,u1:R,v0:-R,v1:R,f:0,r:R,H:12,gw:2,gh:6});
  const tw=(cu0,cv0,h2,H,o)=>P.push(Object.assign({k:'tower',u0:cu0-h2,u1:cu0+h2,v0:cv0-h2,v1:cv0+h2,cu:cu0,cv:cv0,h2:h2,H:H,y:g,batt:true,wr:R,band:Math.round(H*0.55)},o||{}));
  for(const [a,b] of [[-1,-1],[-1,1],[1,-1],[1,1]])tw(a*(R-1),b*(R-1),4,19,{ban:true});
  tw(-(R-1),6,3,18,{ban:true,gp:2});tw(-(R-1),-6,3,18,{ban:true,gp:2});P.push({k:'gatefront',u0:-R-3,u1:-R-1,v0:-2,v1:2,f:0,y:g,gw:2,gh:6,H:18});
  for(const vv of [6,-6])P.push({k:'banner',u0:-R-3,u1:-R-3,v0:vv,v1:vv,f:0,y:g+11,n:3});
  P.push({k:'ladder',u0:-R+3,u1:-R+3,v0:9,v1:9,f:0,y0:g+1,y1:g+12});
  L.spots.push({kind:'gate',u:-R-6,v:0,y:g},{kind:'drill',u:-10,v:-2,y:g},{kind:'keep',u:-1,v:0,y:g},{kind:'barracks',u:-6,v:10,y:g});
}
// A watchtower: a tall tower with a beacon on its roof inside a low walled yard, a guardhouse of timber, hay and barrels
function outpostLayout(s,L,r){
  const R=s.R,g=s.T,P=L.parts;
  P.push({k:'lane',u0:-R+1,u1:R-1,v0:-R+1,v1:R-1,f:0,y:g,id:GRAVEL});
  P.push({k:'cwall',u0:-R,u1:R,v0:-R,v1:R,f:0,r:R,H:3,gw:1,gh:3,low:true});
  P.push({k:'tower',u0:0,u1:6,v0:-3,v1:3,cu:3,cv:0,h2:3,H:22,y:g,hollow:true,fire:true,batt:true,band:11});
  P.push(housePart(-6,-2,-6,-2,3,[1,1,1,1],{y:g,st:1,sh:4,mat:'timber',roof:SLATE,door:2,ridge:'b'}));
  P.push({k:'hay',u0:-5,u1:-1,v0:3,v1:7,cu:-3,cv:5,y:g});
  L.spots.push({kind:'post',u:-2,v:0,y:g});
}
// ---- the ring path round a village green
RB.ring=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v);if(d>=p.r-1.5&&d<p.r+0.5)RBP(X,p.y,Z,PATH);};
// ---- Roads: paved with flagstones between kerbs of white stone (the king's roads), lanes of beaten earth; a bridge of stone
// or planks where a road crosses water; on the king's roads a white milestone with a lamp every 72 blocks
function realmRoadCol(X,Z,x,z){
  const rr=realmRoadAt(X,Z,1);if(!rr)return;const s=realmSiteAt(X,Z,0);if(s)return;if(rr.rd.P.cult.k==='horse')return riderRoadCol(X,Z,x,z,rr);if(rr.rd.P.cult.k==='elf')return elfRoadCol(X,Z,x,z,rr);if(rr.rd.P.cult.k==='wood')return woodRoadCol(X,Z,x,z,rr);if(rr.rd.P.cult.k==='dwarf')return dwarfRoadCol(X,Z,x,z,rr);const o=colInfo(X,Z,TRB),g=o.h,rd=rr.rd,hi=rd.k==='high',ao=Math.abs(rr.off);
  const wet=o.wet||o.river||o.lake||o.b===0||g<o.sl+1;
  if(ao>rd.w+0.5){ // just beside the road: the milestones
    if(hi&&!wet&&ao<=rd.w+1.5&&rr.off>0&&Math.floor(rr.along)%72===36){RBP(X,g,Z,WSBRICK);RBS(X,Z,g+1,g+2,WSPILLAR);RBP(X,g+3,Z,LANTERN);}return;}
  if(wet){const y=Math.max(o.sl,o.lake||0)+2,edge=ao>rd.w-0.5;RBP(X,y,Z,hi?WSBRICK:PLANKS);if(edge)RBP(X,y+1,Z,hi?WSBRICK:PLANKS);RBS(X,Z,y+(edge?2:1),y+3,AIR);
    if(Math.floor(rr.along)%6===0)for(let yy=y-1;yy>=Math.max(1,g-1);yy--)RBP(X,yy,Z,hi?WSBRICK:LOG);return;}
  const top=world[I(x,g,z)];if(top===AIR||top===WATER)return;
  RBP(X,g,Z,hi?(ao>rd.w-0.5?WSBRICK:PAVING):hsh(X,9527,Z)<0.15?GRAVEL:PATH);for(let y=g+1;y<=g+3;y++){const id=world[I(x,y,z)];if(id&&!SOLID[id])RBP(X,y,Z,AIR);else if(SOLID[id]&&y===g+1)RBP(X,y,Z,AIR);}
}
// ---- Per chunk: every site that reaches the chunk builds the parts over its columns; then the roads
function applyRealms(WCX,WCZ){
  const x0=WCX*CS,z0=WCZ*CS,T=realmTile(x0,z0);if(!T.sites.length&&!T.roads.length)return;
  genLit=true;
  try{
    for(const s of T.sites){const e=s.R+s.M+40;if(s.X+e<x0||s.X-e>x0+CS-1||s.Z+e<z0||s.Z-e>z0+CS-1)continue;const L=siteLayout(s);
      // the chunk's box in the site's frame, and the parts it meets
      let u0=1e9,u1=-1e9,v0=1e9,v1=-1e9;for(const [X,Z] of [[x0,z0],[x0+CS-1,z0],[x0,z0+CS-1],[x0+CS-1,z0+CS-1]]){const [u,v]=siteUV(s,X,Z);u0=Math.min(u0,u);u1=Math.max(u1,u);v0=Math.min(v0,v);v1=Math.max(v1,v);}
      const ps=L.parts.filter(p=>!(p.bu1<u0||p.bu0>u1||p.bv1<v0||p.bv0>v1));if(!ps.length)continue;
      for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){const X=x0+lx,Z=z0+lz,[u,v]=siteUV(s,X,Z);
        for(const p of ps)if(u>=p.bu0&&u<=p.bu1&&v>=p.bv0&&v<=p.bv1)RB[p.k](s,p,u,v,X,Z);}}
    if(T.roads.length)for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++)realmRoadCol(x0+lx,z0+lz,x0+lx-OX,z0+lz-OZ);
  }finally{genLit=false;}
}
