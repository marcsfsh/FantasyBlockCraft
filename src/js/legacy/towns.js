// ---- Towns: one per 256x256 region, laid out on a street grid and built chunk by chunk
const TR=384,townCache=new Map(),T4={};
const TSTYLE={
  plains:{walls:[PLANKS,COBBLE,BRICK,SBRICK,WOOLW,PLANKS],corners:[LOG,LOG,SPRUCE,SBRICK],roofs:[TERO,TERB,BRICK,PLANKS,WOOLR,SPRUCE],floor:PLANKS,found:COBBLE,main:SBRICK,side:COBBLE,walk:STONE,post:LOG,flat:false,win:GLASS},
  jungle:{walls:[PLANKS,COBBLE,WOOLW],corners:[JLOG],roofs:[JLEAVES,TERO,PLANKS],floor:PLANKS,found:COBBLE,main:SBRICK,side:COBBLE,walk:MOSSY,post:JLOG,flat:false,win:GLASS},
  snow:{walls:[PLANKS,COBBLE,SBRICK],corners:[SPRUCE],roofs:[SPRUCE,TERB,WOOLK,PLANKS],floor:PLANKS,found:COBBLE,main:SBRICK,side:COBBLE,walk:STONE,post:SPRUCE,flat:false,win:GLASS},
  desert:{walls:[SANDSTONE,TERT,SANDSTONE,WOOLW],corners:[SANDSTONE,TERT],roofs:[SANDSTONE,TERT],floor:SANDSTONE,found:SANDSTONE,main:SBRICK,side:SANDSTONE,walk:TERT,post:SANDSTONE,flat:true,win:AIR}
};
const SIZES={hall:[11,9],chapel:[7,12],tavern:[11,8],library:[9,7],bank:[7,7],market:[9,7],clock:[5,5],bakery:[7,6],shop:[7,6],house2:[7,7],houseM:[7,6],houseS:[5,5],cottage:[5,5],manor:[11,9],smithy:[7,6],warehouse:[9,7],greenhouse:[7,5],barn:[9,7],windmill:[5,5],park:[9,8],yard:[7,6],farm:[9,11]};
function townPlan(RX,RZ){return null;
  const key=ckey(RX,RZ);if(townCache.has(key))return townCache.get(key);
  townCache.set(key,null);
  let t=null;const r=rngAt(RX,31,RZ);
  if(r()<0.55){
    const cx=RX*TR+110+(r()*164|0),cz=RZ*TR+110+(r()*164|0),R=28+(r()*15|0),o=colInfoBase(cx,cz,{});
    if([2,3,4,6,8].includes(o.b)&&o.h>=SEA+2&&o.h<=SEA+26&&!o.river){
      let sum=o.h,n=1,wet=0;
      for(let k=0;k<12;k++){const a=k/12*6.283,rr=k%2?R*0.5:R,q=colInfoBase(cx+Math.round(Math.cos(a)*rr),cz+Math.round(Math.sin(a)*rr),TTP);if(q.h<SEA){wet++;continue;}sum+=q.h;n++;}
      if(wet<=3){
        const style=o.b===4?'desert':o.b===6?'snow':o.b===8?'jungle':'plains';
        t={cx:cx,cz:cz,R:R,g0:Math.max(SEA+2,Math.round(sum/n)),biome:o.b===8?8:o.b===6?6:o.b===4?4:2,style:style,streets:[],lots:[],lamps:[],stalls:[]};
        const occ=[[cx-8,cz-8,cx+8,cz+8]];
        const offs=[0];for(let k=1;k<=2;k++)if(k*30<=R-8)offs.push(k*30,-k*30);
        for(const of of offs){const w=of===0?5:3;t.streets.push({ax:'x',c:cz+of,hw:(w-1)/2,a0:cx-R,a1:cx+R,main:of===0});t.streets.push({ax:'z',c:cx+of,hw:(w-1)/2,a0:cz-R,a1:cz+R,main:of===0});}
        const band=[];for(const s of t.streets){const e=s.hw+1;band.push(s.ax==='x'?[s.a0,s.c-e,s.a1,s.c+e]:[s.c-e,s.a0,s.c+e,s.a1]);}
        for(const sx of t.streets)if(sx.ax==='x')for(const sz of t.streets)if(sz.ax==='z'){const e=Math.max(sx.hw,sz.hw)+2;t.lamps.push([sz.c+e,sx.c+e],[sz.c-e,sx.c-e]);}
        t.lamps.push([cx-8,cz-8],[cx+8,cz+8],[cx-8,cz+8],[cx+8,cz-8]);
        t.stalls.push([cx-5,cz-5],[cx+5,cz-5],[cx-5,cz+5],[cx+5,cz+5]);
        const have={};
        const fits=(x0,z0,x1,z1)=>Math.max(Math.abs(x0-cx),Math.abs(x1-cx),Math.abs(z0-cz),Math.abs(z1-cz))<=R-1&&!occ.some(q=>x0<=q[2]&&x1>=q[0]&&z0<=q[3]&&z1>=q[1])&&!band.some(q=>x0<=q[2]&&x1>=q[0]&&z0<=q[3]&&z1>=q[1]);
        const ZONES={
          core:[['shop',3],['bakery',1.2],['house2',2],['houseM',1],['park',0.8],['cottage',0.6]],
          mid:[['cottage',3],['houseM',3],['house2',2],['manor',0.7],['smithy',0.5],['warehouse',0.6],['greenhouse',0.6],['yard',1.8],['park',0.6],['shop',0.5],['bakery',0.3]],
          out:[['cottage',2],['farm',2.2],['barn',1.1],['windmill',0.6],['yard',1.6],['houseM',1],['greenhouse',0.3]]};
        const wpick=list=>{let tot=0;for(const q of list)tot+=q[1];let x=r()*tot;for(const q of list){x-=q[1];if(x<=0)return q[0];}return list[0][0];};
        const LIMIT={smithy:2,windmill:2,barn:3,manor:2,warehouse:2,greenhouse:2,bakery:2};const cnt={};
        for(const s of t.streets)for(const sg of [1,-1]){
          let a=s.a0+2+(r()*3|0);
          while(a<s.a1-4){
            const mid=s.ax==='x'?[a,s.c]:[s.c,a],zone=Math.max(Math.abs(mid[0]-cx),Math.abs(mid[1]-cz));
            if(r()<0.16){a+=4+(r()*4|0);continue;}
            let cands;
            if(zone<34){cands=['hall','chapel','tavern','library','market','bank','clock'].filter(k=>!have[k]).slice(0,3);cands.push(wpick(ZONES.core),'cottage');}
            else{let tp=wpick(zone<R-12?ZONES.mid:ZONES.out);if(LIMIT[tp]&&(cnt[tp]||0)>=LIMIT[tp])tp='cottage';cands=[tp,'cottage'];}
            let placed=false;
            for(const cand of cands){
              const [wb,db]=SIZES[cand],sb=['shop','bank','hall','market','bakery','clock','tavern'].includes(cand)?(r()<0.5?0:1):cand==='farm'||cand==='park'||cand==='yard'?0:1+(r()*3|0);
              let x0,z0,x1,z1,face,ox0,oz0,ox1,oz1;
              if(s.ax==='x'){x0=a;x1=a+wb-1;ox0=x0;ox1=x1;const base=sg>0?s.c+s.hw+2:s.c-s.hw-2;
                if(sg>0){z0=base+sb;z1=z0+db-1;oz0=base;oz1=z1;face='N';}else{z1=base-sb;z0=z1-db+1;oz0=z0;oz1=base;face='S';}}
              else{z0=a;z1=a+wb-1;oz0=z0;oz1=z1;const base=sg>0?s.c+s.hw+2:s.c-s.hw-2;
                if(sg>0){x0=base+sb;x1=x0+db-1;ox0=base;ox1=x1;face='W';}else{x1=base-sb;x0=x1-db+1;ox0=x0;ox1=base;face='E';}}
              if(!fits(ox0,oz0,ox1,oz1))continue;
              occ.push([ox0-1,oz0-1,ox1+1,oz1+1]);t.lots.push({tp:cand,x0:x0,z0:z0,x1:x1,z1:z1,face:face,sb:sb,g:0,seed:r()});
              have[cand]=1;cnt[cand]=(cnt[cand]||0)+1;
              a+=wb+2+(r()*4|0);placed=true;break;
            }
            if(!placed)a+=2;
          }
        }
        if(R>=36)for(const [qx,qz] of [[1,1],[1,-1],[-1,1],[-1,-1]]){const x0=cx+qx*(R-3)-2,z0=cz+qz*(R-3)-2;if(fits(x0,z0,x0+4,z0+4)){occ.push([x0,z0,x0+4,z0+4]);t.lots.push({tp:'tower',x0:x0,z0:z0,x1:x0+4,z1:z0+4,face:'N',g:0,seed:r()});}}
        t.lots.forEach(l=>{l.g=t.g0;});
        if(t.lots.length<6)t=null;
      }
    }
  }
  townCache.set(key,t);return t;
}
function townAt(X,Z,m){const t=townPlan(Math.floor(X/TR),Math.floor(Z/TR));return t&&Math.max(Math.abs(X-t.cx),Math.abs(Z-t.cz))<=t.R+(m||0)?t:null;}
const pick=(arr,r)=>arr[Math.floor(r()*arr.length)];
function gableRoof(b,y0,roof,wall,ridge){
  const alongX=(b.x1-b.x0)>=(b.z1-b.z0);
  for(let k=0;k<10;k++){
    const y=y0+k;
    if(alongX){const zA=b.z0-1+k,zB=b.z1+1-k;if(zA>zB)break;
      for(let X=b.x0-1;X<=b.x1+1;X++){PW(X,y,zA,zB-zA<=1?ridge:roof,MODE_SET);PW(X,y,zB,zB-zA<=1?ridge:roof,MODE_SET);}
      for(let Z=zA+1;Z<zB;Z++){PW(b.x0,y,Z,wall,MODE_SET);PW(b.x1,y,Z,wall,MODE_SET);}
      if(zB-zA<=1)break;}
    else{const xA=b.x0-1+k,xB=b.x1+1-k;if(xA>xB)break;
      for(let Z=b.z0-1;Z<=b.z1+1;Z++){PW(xA,y,Z,xB-xA<=1?ridge:roof,MODE_SET);PW(xB,y,Z,xB-xA<=1?ridge:roof,MODE_SET);}
      for(let X=xA+1;X<xB;X++){PW(X,y,b.z0,wall,MODE_SET);PW(X,y,b.z1,wall,MODE_SET);}
      if(xB-xA<=1)break;}
  }
}
function interiorRing(b,fn){
  for(let X=b.x0+1;X<b.x1;X++){fn(X,b.z0+1);fn(X,b.z1-1);}
  for(let Z=b.z0+2;Z<b.z1-1;Z++){fn(b.x0+1,Z);fn(b.x1-1,Z);}
}
function nearDoor(b,X,Z){const mx=(b.x0+b.x1)>>1,mz=(b.z0+b.z1)>>1;return(b.face==='N'||b.face==='S')?Math.abs(X-mx)<=1&&(b.face==='N'?Z<=b.z0+2:Z>=b.z1-2):Math.abs(Z-mz)<=1&&(b.face==='W'?X<=b.x0+2:X>=b.x1-2);}
function hipRoof(b,y0,roof,ridge){
  for(let k=0;k<12;k++){
    const ax0=b.x0-1+k,ax1=b.x1+1-k,az0=b.z0-1+k,az1=b.z1+1-k;if(ax0>ax1||az0>az1)break;
    const last=ax1-ax0<=1||az1-az0<=1;
    for(let X=ax0;X<=ax1;X++)for(let Z=az0;Z<=az1;Z++)if(last||X===ax0||X===ax1||Z===az0||Z===az1)PW(X,y0+k,Z,last?ridge:roof,MODE_SET);
    if(last)return y0+k;
  }
  return y0;
}
function frontCells(b,depth,fn){
  for(let k=1;k<=depth;k++){
    if(b.face==='N')for(let X=b.x0;X<=b.x1;X++)fn(X,b.z0-k,k);
    if(b.face==='S')for(let X=b.x0;X<=b.x1;X++)fn(X,b.z1+k,k);
    if(b.face==='W')for(let Z=b.z0;Z<=b.z1;Z++)fn(b.x0-k,Z,k);
    if(b.face==='E')for(let Z=b.z0;Z<=b.z1;Z++)fn(b.x1+k,Z,k);
  }
}
function isDoorLine(b,X,Z){const mx=(b.x0+b.x1)>>1,mz=(b.z0+b.z1)>>1;return(b.face==='N'||b.face==='S')?X===mx:Z===mz;}
function frontYard(b,st,r){
  if(!b.sb)return;
  frontCells(b,b.sb,(X,Z)=>{
    for(let y=b.g+1;y<=b.g+4;y++)PW(X,y,Z,AIR,MODE_SET);
    if(isDoorLine(b,X,Z))PW(X,b.g,Z,st.flat?st.walk:PATH,MODE_SET);
    else{PW(X,b.g,Z,st.flat?SAND:GRASS,MODE_SET);if(r()<0.28)PW(X,b.g+1,Z,st.flat?DBUSH:pick([FLOWR,FLOWY,TGRASS],r),MODE_SET);}
  });
}
function chimney(b,top,r){
  const X=b.face==='E'?b.x0:b.x1,Z=b.face==='S'?b.z0:b.z1,m=pick([BRICK,COBBLE,SBRICK],r);
  for(let y=b.g+1;y<=top+2;y++)PW(X,y,Z,m,MODE_SET);
}
function porch(b,st,roof){
  if((b.sb||0)<2)return;
  const posts=[];frontCells(b,2,(X,Z,k)=>{PW(X,b.g,Z,PLANKS,MODE_SET);PW(X,b.g+4,Z,roof,MODE_SET);
    const end=(b.face==='N'||b.face==='S')?(X===b.x0||X===b.x1):(Z===b.z0||Z===b.z1);if(k===2&&end)posts.push([X,Z]);});
  for(const [X,Z] of posts)for(let y=b.g+1;y<=b.g+3;y++)PW(X,y,Z,st.post,MODE_SET);
}
// Generic building with optional hip roof, chimney and porch
function buildingT(b,st,o){
  const r=mkRng(Math.floor(b.seed*1e9)+5),g=b.g,fl=o.floors||1,wh=o.wallH||fl*4;
  const wall=o.wall||pick(st.walls,r),corner=o.corner||pick(st.corners,r),roof=o.roof||pick(st.roofs,r),ridge=st.flat?roof:corner;
  frontYard(b,st,r);
  for(let X=b.x0;X<=b.x1;X++)for(let Z=b.z0;Z<=b.z1;Z++){
    for(let y=g-1;y>g-7;y--)PW(X,y,Z,st.found,MODE_FILL);
    PW(X,g,Z,o.floor||st.floor,MODE_SET);for(let y=g+1;y<=g+wh+10;y++)PW(X,y,Z,AIR,MODE_SET);
  }
  const mx=(b.x0+b.x1)>>1,mz=(b.z0+b.z1)>>1,winEvery=o.winEvery||2;
  for(let X=b.x0;X<=b.x1;X++)for(let Z=b.z0;Z<=b.z1;Z++){
    const ex=X===b.x0||X===b.x1,ez=Z===b.z0||Z===b.z1;if(!ex&&!ez)continue;const corn=ex&&ez;
    const front=(b.face==='N'&&Z===b.z0)||(b.face==='S'&&Z===b.z1)||(b.face==='W'&&X===b.x0)||(b.face==='E'&&X===b.x1);
    const along=ex?Z:X,dc=(b.face==='N'||b.face==='S')?Math.abs(X-mx):Math.abs(Z-mz);
    for(let y=g+1;y<=g+wh;y++){
      let id=corn?corner:wall;const fy=(y-g-1)%4;
      if(!corn&&fl>1&&(y-g)%4===0)id=corner;
      if(front&&dc<=(o.wideDoor?1:0)&&y<=g+(o.wideDoor?3:2))id=AIR;
      else if(!corn&&fy===1&&(along%winEvery===0||(o.display&&front&&y<=g+2)))id=st.win;
      PW(X,y,Z,id,MODE_SET);
    }
  }
  if(fl>1){
    const dx=(b.x1-b.x0)>(b.z1-b.z0)?1:0,dz=1-dx,back=b.face==='S'||b.face==='E';
    for(let X=b.x0+1;X<b.x1;X++)for(let Z=b.z0+1;Z<b.z1;Z++)PW(X,g+4,Z,PLANKS,MODE_SET);
    const s0x=back?b.x0+1:b.x1-1,s0z=back?b.z0+1:b.z1-1,ddx=back?dx:-dx,ddz=back?dz:-dz;
    for(let k=0;k<3;k++){const X=s0x+ddx*k,Z=s0z+ddz*k;for(let y=g+1;y<=g+1+k;y++)PW(X,y,Z,st.found,MODE_SET);if(k<2)PW(X,g+4,Z,AIR,MODE_SET);}
    PW(mx,g+8,mz,LANTERN,MODE_SET);
  }
  PW(mx,g+(fl>1?3:wh),mz,LANTERN,MODE_SET);
  let top=g+wh+1;
  const kind=st.flat||o.roofKind==='flat'?'flat':o.roofKind||(r()<0.35?'hip':'gable');
  if(kind==='flat'){for(let X=b.x0;X<=b.x1;X++)for(let Z=b.z0;Z<=b.z1;Z++){PW(X,g+wh+1,Z,roof,MODE_SET);if((X===b.x0||X===b.x1||Z===b.z0||Z===b.z1)&&(X+Z)%2===0)PW(X,g+wh+2,Z,roof,MODE_SET);}top=g+wh+2;}
  else if(kind==='hip')top=hipRoof(b,g+wh+1,roof,ridge);
  else{gableRoof(b,g+wh+1,roof,wall,ridge);top=g+wh+1+Math.ceil(Math.min(b.x1-b.x0,b.z1-b.z0)/2)+1;}
  if(o.chimney&&!st.flat)chimney(b,top,r);
  if(o.porch&&!st.flat)porch(b,st,roof);
  return {wall:wall,roof:roof,corner:corner,wh:wh,top:top};
}
function lotT(l,st,t){
  const g=l.g,r=mkRng(Math.floor(l.seed*1e9)+11),mx=(l.x0+l.x1)>>1,mz=(l.z0+l.z1)>>1,ns=l.face==='N'||l.face==='S';
  const backCells=fn=>{if(l.face==='N')for(let X=l.x0+1;X<l.x1;X++)fn(X,l.z1-1);if(l.face==='S')for(let X=l.x0+1;X<l.x1;X++)fn(X,l.z0+1);if(l.face==='W')for(let Z=l.z0+1;Z<l.z1;Z++)fn(l.x1-1,Z);if(l.face==='E')for(let Z=l.z0+1;Z<l.z1;Z++)fn(l.x0+1,Z);};
  switch(l.tp){
    case 'cottage':buildingT(l,st,{chimney:r()<0.6,porch:r()<0.4});break;
    case 'houseS':case 'houseM':{buildingT(l,st,{chimney:r()<0.5,porch:r()<0.5});PW(l.x0+1,g+1,l.z1-1,BOOKS,MODE_SET);break;}
    case 'house2':buildingT(l,st,{floors:2,chimney:r()<0.6,porch:r()<0.3});break;
    case 'manor':{buildingT(l,st,{floors:2,wall:pick([BRICK,SBRICK,PLANKS,WOOLW],r),roofKind:'hip',chimney:true,porch:true,winEvery:2});
      backCells((X,Z)=>{if(r()<0.4)PW(X,g+1,Z,BOOKS,MODE_SET);});break;}
    case 'shop':{buildingT(l,st,{display:true});
      const wools=[[WOOLR,WOOLW],[WOOLB,WOOLW],[WOOLG,WOOLY],[WOOLY,WOOLW]][r()*4|0];let i=0;
      frontCells(l,1,(X,Z)=>{PW(X,g+3,Z,wools[(i++)%2],MODE_SET);});PW(l.x0+1,g+1,l.z0+1,TRADER,MODE_SET);break;}
    case 'bakery':{const m=buildingT(l,st,{display:true,chimney:true,roof:st.flat?undefined:pick([BRICK,TERO],r)});backCells((X,Z)=>{PW(X,g+1,Z,r()<0.5?FURN:PLANKS,MODE_SET);});PW(l.x0+1,g+1,l.z0+1,TRADER,MODE_SET);break;}
    case 'tavern':{buildingT(l,st,{floors:2,wall:pick([PLANKS,BRICK,COBBLE],r),chimney:true});
      for(let X=l.x0+2;X<l.x1-1;X+=3)for(let Z=l.z0+2;Z<l.z1-1;Z+=3)if(!nearDoor(l,X,Z))PW(X,g+1,Z,PLANKS,MODE_SET);PW(l.x0+1,g+1,l.z0+1,FURN,MODE_SET);break;}
    case 'library':{buildingT(l,st,{wallH:5,roofKind:'hip'});interiorRing(l,(X,Z)=>{if(!nearDoor(l,X,Z))for(let y=g+1;y<=g+3;y++)PW(X,y,Z,BOOKS,MODE_SET);});break;}
    case 'hall':{buildingT(l,st,{floors:2,wall:st.flat?SANDSTONE:SBRICK,corner:st.flat?TERT:COBBLE,roof:st.flat?SANDSTONE:BRICK,roofKind:'hip'});
      for(const d of [-2,2]){const X=ns?mx+d:(l.face==='W'?l.x0-1:l.x1+1),Z=ns?(l.face==='N'?l.z0-1:l.z1+1):mz+d;for(let y=g+1;y<=g+5;y++)PW(X,y,Z,st.post,MODE_SET);PW(X,g+6,Z,GLOW,MODE_SET);}
      break;}
    case 'bank':{buildingT(l,st,{wall:st.flat?SANDSTONE:SBRICK,corner:STEELB,roof:st.flat?SANDSTONE:SBRICK,roofKind:'flat',winEvery:3});
      for(const d of [-1,1]){const X=ns?mx+d*2:(l.face==='W'?l.x0-1:l.x1+1),Z=ns?(l.face==='N'?l.z0-1:l.z1+1):mz+d*2;for(let y=g+1;y<=g+4;y++)PW(X,y,Z,STEELB,MODE_SET);}
      backCells((X,Z)=>{PW(X,g+1,Z,pick([COPB,BRASB,BRONB,COPB],r),MODE_SET);});PW(mx,g+1,mz,TRADER,MODE_SET);PW(mx+(ns?1:0),g+1,mz+(ns?0:1),MINT,MODE_SET);break;}
    case 'market':{
      for(let X=l.x0;X<=l.x1;X++)for(let Z=l.z0;Z<=l.z1;Z++){for(let y=g-1;y>g-6;y--)PW(X,y,Z,st.found,MODE_FILL);PW(X,g,Z,st.main,MODE_SET);for(let y=g+1;y<=g+12;y++)PW(X,y,Z,AIR,MODE_SET);
        const edge=X===l.x0||X===l.x1||Z===l.z0||Z===l.z1;if(edge&&(X+Z)%2===0)for(let y=g+1;y<=g+4;y++)PW(X,y,Z,st.post,MODE_SET);}
      const rf=st.flat?SANDSTONE:pick([TERO,BRICK,SPRUCE],r);hipRoof(l,g+5,rf,rf);
      for(let X=l.x0+2;X<l.x1-1;X+=3){PW(X,g+1,mz-1,TRADER,MODE_SET);PW(X,g+1,mz+1,PLANKS,MODE_SET);}
      PW(mx,g+4,mz,LANTERN,MODE_SET);break;}
    case 'clock':{const w=st.flat?SANDSTONE:SBRICK,top=g+17;
      for(let X=l.x0;X<=l.x1;X++)for(let Z=l.z0;Z<=l.z1;Z++){for(let y=g-1;y>g-6;y--)PW(X,y,Z,st.found,MODE_FILL);const edge=X===l.x0||X===l.x1||Z===l.z0||Z===l.z1;
        for(let y=g;y<=top;y++)PW(X,y,Z,edge||y===g?w:AIR,MODE_SET);}
      PW(mx,top-3,l.z0,GLOW,MODE_SET);PW(mx,top-3,l.z1,GLOW,MODE_SET);PW(l.x0,top-3,mz,GLOW,MODE_SET);PW(l.x1,top-3,mz,GLOW,MODE_SET);
      for(let y=g+1;y<=g+2;y++)PW(ns?mx:(l.face==='W'?l.x0:l.x1),y,ns?(l.face==='N'?l.z0:l.z1):mz,AIR,MODE_SET);
      hipRoof(l,top+1,st.flat?SANDSTONE:pick([BRICK,TERB,SPRUCE],r),st.flat?TERT:COBBLE);break;}
    case 'chapel':{const m=buildingT(l,st,{wallH:6,wall:st.flat?SANDSTONE:pick([SBRICK,COBBLE],r),corner:st.flat?TERT:SBRICK,roof:st.flat?SANDSTONE:pick([BRICK,SPRUCE,TERB],r),roofKind:'gable'});
      const tx0=ns?mx-1:(l.face==='W'?l.x0:l.x1-2),tz0=ns?(l.face==='N'?l.z0:l.z1-2):mz-1,top=g+15;
      for(let X=tx0;X<tx0+3;X++)for(let Z=tz0;Z<tz0+3;Z++)for(let y=g+1;y<=top;y++){
        const edge=X===tx0||X===tx0+2||Z===tz0||Z===tz0+2,belfry=y>=top-3&&y<top&&!(X!==tx0+1&&Z!==tz0+1);
        PW(X,y,Z,edge&&!belfry?m.wall:AIR,MODE_SET);}
      PW(tx0+1,top-2,tz0+1,GLOW,MODE_SET);for(let X=tx0-1;X<=tx0+3;X++)for(let Z=tz0-1;Z<=tz0+3;Z++)PW(X,top,Z,m.roof,MODE_SET);PW(tx0+1,top+1,tz0+1,m.roof,MODE_SET);
      for(let y=g+1;y<=g+2;y++)PW(ns?mx:(l.face==='W'?l.x0:l.x1),y,ns?(l.face==='N'?l.z0:l.z1):mz,AIR,MODE_SET);
      break;}
    case 'warehouse':{buildingT(l,st,{wall:pick([COBBLE,PLANKS,SBRICK],r),roofKind:'flat',wideDoor:true,winEvery:4,floor:COBBLE});
      for(let X=l.x0+1;X<l.x1;X++)for(let Z=l.z0+1;Z<l.z1;Z++){if(nearDoor(l,X,Z)||isDoorLine(l,X,Z))continue;if(r()<0.45){const m=pick([LOG,PLANKS,COBBLE,SPRUCE,WOOLW],r),h=1+(r()*2|0);for(let y=g+1;y<=g+h;y++)PW(X,y,Z,m,MODE_SET);}}
      break;}
    case 'greenhouse':{
      for(let X=l.x0;X<=l.x1;X++)for(let Z=l.z0;Z<=l.z1;Z++){for(let y=g-1;y>g-6;y--)PW(X,y,Z,st.found,MODE_FILL);for(let y=g+1;y<=g+9;y++)PW(X,y,Z,AIR,MODE_SET);
        const ex=X===l.x0||X===l.x1,ez=Z===l.z0||Z===l.z1;PW(X,g,Z,ex||ez?st.found:DIRT,MODE_SET);
        if(ex||ez)for(let y=g+1;y<=g+3;y++)PW(X,y,Z,ex&&ez?st.post:GLASS,MODE_SET);
        else if(!isDoorLine(l,X,Z))PW(X,g+1,Z,pick([WHEAT,FLOWR,FLOWY,TGRASS,CACTUS],r),MODE_SET);}
      for(let y=g+1;y<=g+2;y++)PW(ns?mx:(l.face==='W'?l.x0:l.x1),y,ns?(l.face==='N'?l.z0:l.z1):mz,AIR,MODE_SET);
      hipRoof(l,g+4,GLASS,GLASS);PW(mx,g+4,mz,LANTERN,MODE_SET);break;}
    case 'barn':{const red=r()<0.6&&!st.flat;
      buildingT(l,st,{wallH:5,wall:red?WOOLR:PLANKS,corner:red?WOOLW:st.post,roof:st.flat?undefined:pick([SPRUCE,PLANKS,TERB],r),roofKind:'gable',wideDoor:true,winEvery:5,floor:DIRT});
      for(let X=l.x0+1;X<l.x1;X++)for(let Z=l.z0+1;Z<l.z1;Z++)if(!isDoorLine(l,X,Z)&&r()<0.35)PW(X,g+1,Z,WHEAT,MODE_SET);break;}
    case 'windmill':{const w=st.flat?SANDSTONE:COBBLE,top=g+10;
      for(let X=l.x0;X<=l.x1;X++)for(let Z=l.z0;Z<=l.z1;Z++){for(let y=g-1;y>g-6;y--)PW(X,y,Z,st.found,MODE_FILL);const edge=X===l.x0||X===l.x1||Z===l.z0||Z===l.z1;for(let y=g;y<=top;y++)PW(X,y,Z,edge||y===g?w:AIR,MODE_SET);}
      for(let y=g+1;y<=g+2;y++)PW(ns?mx:(l.face==='W'?l.x0:l.x1),y,ns?(l.face==='N'?l.z0:l.z1):mz,AIR,MODE_SET);
      hipRoof(l,top+1,st.flat?SANDSTONE:pick([SPRUCE,PLANKS],r),st.post);
      const hy=g+8,hx=ns?mx:(l.face==='W'?l.x0-1:l.x1+1),hz=ns?(l.face==='N'?l.z0-1:l.z1+1):mz;PW(hx,hy,hz,PLANKS,MODE_SET);
      for(let k=1;k<=4;k++){PW(hx,hy+k,hz,WOOLW,MODE_SET);PW(hx,hy-k,hz,WOOLW,MODE_SET);if(ns){PW(hx+k,hy,hz,WOOLW,MODE_SET);PW(hx-k,hy,hz,WOOLW,MODE_SET);}else{PW(hx,hy,hz+k,WOOLW,MODE_SET);PW(hx,hy,hz-k,WOOLW,MODE_SET);}}
      PW(mx,g+4,mz,LANTERN,MODE_SET);break;}
    case 'smithy':smithyP(l,{found:st.found,floor:COBBLE,post:st.post});PW(mx,g+1,mz,TRADER,MODE_SET);break;
    case 'farm':farmP(l);break;
    case 'yard':case 'park':{
      for(let X=l.x0;X<=l.x1;X++)for(let Z=l.z0;Z<=l.z1;Z++){for(let y=g+1;y<=g+9;y++)PW(X,y,Z,AIR,MODE_SET);
        const edge=X===l.x0||X===l.x1||Z===l.z0||Z===l.z1,gate=edge&&isDoorLine(l,X,Z);PW(X,g,Z,gate?PATH:st.flat?SAND:GRASS,MODE_SET);
        if(edge&&!gate)PW(X,g+1,Z,l.tp==='yard'?(st.flat?SANDSTONE:LEAVES):((X+Z)%3===0?st.post:AIR),MODE_SET);
        else if(!edge&&r()<0.22)PW(X,g+1,Z,st.flat?DBUSH:pick([FLOWR,FLOWY,TGRASS,TGRASS],r),MODE_SET);}
      const feat=r();
      if(feat<0.4&&!st.flat)treeP(mx,g+1,mz,r()<0.5?BIRCH:LOG,r()<0.5?BLEAVES:LEAVES,4,r);
      else if(feat<0.7){for(let dx=0;dx<=1;dx++)for(let dz=0;dz<=1;dz++){PW(mx+dx,g,mz+dz,WATER,MODE_SET);PW(mx+dx,g+1,mz+dz,AIR,MODE_SET);}}
      else{const gz={x0:mx-1,x1:mx+1,z0:mz-1,z1:mz+1};for(const [X,Z] of [[gz.x0,gz.z0],[gz.x1,gz.z0],[gz.x0,gz.z1],[gz.x1,gz.z1]])for(let y=g+1;y<=g+3;y++)PW(X,y,Z,st.post,MODE_SET);hipRoof(gz,g+4,st.flat?SANDSTONE:pick(st.roofs,r),st.post);PW(mx,g+1,mz,AIR,MODE_SET);}
      break;}
    case 'tower':{
      for(let X=l.x0;X<=l.x1;X++)for(let Z=l.z0;Z<=l.z1;Z++){
        for(let y=g-1;y>g-7;y--)PW(X,y,Z,st.found,MODE_FILL);
        const edge=X===l.x0||X===l.x1||Z===l.z0||Z===l.z1;
        for(let y=g;y<=g+12;y++)PW(X,y,Z,edge||y===g?(st.flat?SANDSTONE:COBBLE):AIR,MODE_SET);
        PW(X,g+12,Z,st.flat?SANDSTONE:SBRICK,MODE_SET);if(edge&&(X+Z)%2===0)PW(X,g+13,Z,st.flat?SANDSTONE:COBBLE,MODE_SET);
      }
      for(let y=g+1;y<=g+2;y++)PW(mx,y,l.z0,AIR,MODE_SET);
      for(let y=g+1;y<=g+11;y++)PW(mx,y,mz,st.post,MODE_SET);PW(mx,g+13,mz,LANTERN,MODE_SET);
      break;}
  }
}
function applyTown(){
  const t=townPlan(Math.floor(gx0/TR),Math.floor(gz0/TR));if(!t)return;
  const E=t.R+2;if(gx0+CS<t.cx-E||gx0>t.cx+E||gz0+CS<t.cz-E||gz0>t.cz+E)return;
  const st=TSTYLE[t.style],g=t.g0;
  const inC=(X,Z)=>X>=gx0&&X<gx0+CS&&Z>=gz0&&Z<gz0+CS;
  for(const s of t.streets){
    for(let a=Math.max(s.a0,s.ax==='x'?gx0:gz0);a<=Math.min(s.a1,(s.ax==='x'?gx0:gz0)+CS-1);a++)for(let p=-s.hw-1;p<=s.hw+1;p++){
      const X=s.ax==='x'?a:s.c+p,Z=s.ax==='x'?s.c+p:a;if(!inC(X,Z))continue;
      const curb=Math.abs(p)===s.hw+1;
      for(let y=g-1;y>g-5;y--)PW(X,y,Z,st.found,MODE_FILL);
      PW(X,g,Z,curb?st.walk:s.main?st.main:st.side,MODE_SET);
      for(let y=g+1;y<=g+5;y++)PW(X,y,Z,AIR,MODE_SET);
    }
  }
  for(let dx=-8;dx<=8;dx++)for(let dz=-8;dz<=8;dz++){const X=t.cx+dx,Z=t.cz+dz;if(!inC(X,Z))continue;for(let y=g-1;y>g-5;y--)PW(X,y,Z,st.found,MODE_FILL);PW(X,g,Z,(dx+dz)&1?st.main:st.walk,MODE_SET);for(let y=g+1;y<=g+6;y++)PW(X,y,Z,AIR,MODE_SET);}
  // fountain
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const X=t.cx+dx,Z=t.cz+dz,rim=Math.max(Math.abs(dx),Math.abs(dz))===2;PW(X,g+1,Z,rim?st.main:WATER,MODE_SET);if(!rim)PW(X,g,Z,st.main,MODE_SET);}
  for(let y=g+1;y<=g+3;y++)PW(t.cx,y,t.cz,st.main,MODE_SET);PW(t.cx,g+4,t.cz,LANTERN,MODE_SET);
  t.stalls.forEach(([X,Z],i)=>{const wl=[WOOLR,WOOLB,WOOLY,WOOLG][i];for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){if(dx&&dz)for(let y=g+1;y<=g+3;y++)PW(X+dx,y,Z+dz,st.post,MODE_SET);PW(X+dx,g+4,Z+dz,(dx+dz)&1?wl:WOOLW,MODE_SET);}PW(X,g+1,Z,TRADER,MODE_SET);});
  for(const [X,Z] of t.lamps){if(!inC(X,Z))continue;for(let y=g+1;y<=g+3;y++)PW(X,y,Z,st.post,MODE_SET);PW(X,g+4,Z,LANTERN,MODE_SET);}
  for(const l of t.lots){if(l.x1+2<gx0||l.x0-2>=gx0+CS||l.z1+2<gz0||l.z0-2>=gz0+CS)continue;lotT(l,st,t);}
}
