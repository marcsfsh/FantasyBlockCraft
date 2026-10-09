// ---- Maps (M5b, Q40): the explored world map, places discovered, your own markers, and the layer view on the minimap.
// The world map is drawn from the terrain plan (colInfo) for every chunk you have explored, four samples a side, so it costs no
// storage beyond the list of explored chunks. Explored chunks (ex), places (pl) and markers (mk) are saved with the world.
const EXPL_CAP=40000,PLACE_CAP=2000,MARK_CAP=200,explored=new Set(),places=[],markers=[];
const ckX=k=>Math.floor(k/131072)-65536,ckZ=k=>k%131072-65536;
const MARK_COLS=['#e8443a','#f2c230','#5ad25a','#4aa3ff','#c86cf0','#f08a3a'];
// saved as one 256-bit mask per region of 16 x 16 chunks: [region key, base64 of 32 bytes]
function exPack(){const R=new Map();for(const k of explored){const cx=ckX(k),cz=ckZ(k),rk=ckey(Math.floor(cx/16),Math.floor(cz/16));let m=R.get(rk);if(!m){m=new Uint8Array(32);R.set(rk,m);}const b=(cx&15)*16+(cz&15);m[b>>3]|=1<<(b&7);}
  return [...R].map(([rk,m])=>[rk,btoa(String.fromCharCode(...m))]);}
function exUnpack(list){for(const [rk,s64] of list){const rx=ckX(rk),rz=ckZ(rk),bin=atob(s64);for(let b=0;b<256;b++)if(bin.charCodeAt(b>>3)&(1<<(b&7)))explored.add(ckey(rx*16+(b>>4),rz*16+(b&15)));}}
if(saved&&Array.isArray(saved.ex))try{exUnpack(saved.ex);}catch(e){}
if(saved&&Array.isArray(saved.pl))for(const [n,X,Z] of saved.pl)places.push({n:n,X:X,Z:Z});
if(saved&&Array.isArray(saved.mk))for(const [X,Z,n,c] of saved.mk)markers.push({X:X,Z:Z,n:String(n).slice(0,30),c:c});
const mapSave=()=>({ex:exPack(),pl:places.map(p=>[p.n,p.X,p.Z]),mk:markers.map(m=>[m.X,m.Z,m.n,m.c])});
function exploreChunk(cx,cz){const k=ckey(cx,cz);if(explored.has(k))return;if(explored.size>=EXPL_CAP)explored.delete(explored.values().next().value);explored.add(k);wmDirty.add(ckey(Math.floor(cx/16),Math.floor(cz/16)));}
// Places: a named place the readout shows (a site, a hold, a point of interest, remains...) is kept the first time you are there.
// Lands, their stretches and the general names of cave layers are not places.
const PLACE_SKIP=new Set([...BIOMES,...Object.values(CAVE_NAMES),...Object.values(DEEP_NAMES),'Underground','Caves','The Fire Below','The Great Caverns','The Old Workings','Crawlways','An Old Road','An Ancient Waystone']);
function notePlace(n,X,Z){
  if(!n||PLACE_SKIP.has(n))return false;
  for(const p of places)if(p.n===n&&Math.hypot(p.X-X,p.Z-Z)<160)return false;
  if(places.length>=PLACE_CAP)places.shift();places.push({n:n,X:X,Z:Z});saveDirty=true;return true;
}
// ---- Drawing the explored map: regions of 16 x 16 chunks, 4 pixels a chunk (one per 4 blocks), drawn when first needed
const WM_PAL=[[52,92,150],[186,176,146],[112,158,82],[62,112,58],[138,112,122],[132,132,138],[196,204,210],[122,148,92],[46,76,52],[60,104,170],[168,166,104],[88,118,88]];
const wmRegions=new Map(),wmDirty=new Set(),TW={};
function wmColor(X,Z){
  colInfo(X,Z,TW);const h=TW.h;
  if(TW.lake||h<SEA||TW.b===0||TW.b===9){const d=Math.min(1,(SEA-h)/30);return[46-20*d,96-40*d,170-50*d];}
  if(TW.river&&h<=SEA+1)return[70,120,200];
  const c=WM_PAL[TW.b]||[120,140,100],e=Math.max(0,Math.min(1,(h-SEA)/160));
  if(TW.b===5&&h>SEA+110||TW.b===6)return[214+30*e,218+30*e,224+28*e];
  const k=0.8+0.45*e;return[c[0]*k,c[1]*k,c[2]*k];
}
function wmRegion(rx,rz){
  const key=ckey(rx,rz);let c=wmRegions.get(key);
  if(c&&!wmDirty.has(key))return c;
  if(!c){c=document.createElement('canvas');c.width=c.height=64;wmRegions.set(key,c);}
  const g=c.getContext('2d'),im=g.createImageData(64,64);
  for(let a=0;a<16;a++)for(let b=0;b<16;b++){const cx=rx*16+a,cz=rz*16+b;if(!explored.has(ckey(cx,cz)))continue;
    for(let sz=0;sz<4;sz++)for(let sx=0;sx<4;sx++){const col=wmColor(cx*CS+sx*4+2,cz*CS+sz*4+2),i=((b*4+sz)*64+a*4+sx)*4;im.data[i]=cl(col[0]);im.data[i+1]=cl(col[1]);im.data[i+2]=cl(col[2]);im.data[i+3]=255;}}
  g.putImageData(im,0,0);wmDirty.delete(key);return c;
}
// ---- The world map screen: drag or the arrows to pan, the wheel or + and - to zoom, tap to place a marker or pick one
const WM={open:false,X:0,Z:0,s:1,pick:null,drag:null};
function openWorldMap(){
  if(SURV()&&!carries(325)){toast('You need a map to see where you have been');return;}
  WM.open=true;WM.X=PL.x+OX;WM.Z=PL.z+OZ;WM.pick=null;playing=false;hold=-1;if(document.pointerLockElement)document.exitPointerLock();
  $('wmap').style.display='block';wmPanel();drawWorldMap();
}
function closeWorldMap(){if(!WM.open)return;WM.open=false;$('wmap').style.display='none';lockOrPlay();}
const wmCan=()=>$('wmc');
function wmToWorld(px,py){return[WM.X+(px-innerWidth/2)/WM.s,WM.Z+(py-innerHeight/2)/WM.s];} // the map canvas fills the window
function drawWorldMap(){
  if(!WM.open)return;
  const c=wmCan(),g=c.getContext('2d');if(c.width!==innerWidth||c.height!==innerHeight){c.width=innerWidth;c.height=innerHeight;}
  const w=c.width,h=c.height,s=WM.s,sx=X=>(X-WM.X)*s+w/2,sz=Z=>(Z-WM.Z)*s+h/2;
  g.fillStyle='#d6c69e';g.fillRect(0,0,w,h);g.imageSmoothingEnabled=false;
  const R=256,r0x=Math.floor((WM.X-w/2/s)/R),r1x=Math.floor((WM.X+w/2/s)/R),r0z=Math.floor((WM.Z-h/2/s)/R),r1z=Math.floor((WM.Z+h/2/s)/R);let budget=6,pending=false;
  for(let rz=r0z;rz<=r1z;rz++)for(let rx=r0x;rx<=r1x;rx++){const key=ckey(rx,rz),have=wmRegions.has(key)&&!wmDirty.has(key);
    if(!have){let any=false;for(let a=0;a<16&&!any;a++)for(let b=0;b<16;b++)if(explored.has(ckey(rx*16+a,rz*16+b))){any=true;break;}if(!any)continue;if(budget--<=0){pending=true;continue;}}
    g.drawImage(wmRegion(rx,rz),sx(rx*R),sz(rz*R),R*s+0.5,R*s+0.5);}
  g.textAlign='center';
  // stretch names (Q131), faint over the land, wherever you have explored the middle of one of the stretch's cells
  if(s<=2){const seen=new Map();g.font='italic 20px VT323, monospace';g.fillStyle='rgba(42,28,14,0.55)';
    for(let j=Math.floor((WM.Z-h/2/s)/LS)-1;j<=Math.floor((WM.Z+h/2/s)/LS)+1;j++)for(let i=Math.floor((WM.X-w/2/s)/LS)-1;i<=Math.floor((WM.X+w/2/s)/LS)+1;i++){
      const c=landSite(i,j);if(!explored.has(ckey(Math.floor(c.x/CS),Math.floor(c.z/CS))))continue;const n=stretchName(landKey(i,j)),e=seen.get(n);if(e){e.x+=c.x;e.z+=c.z;e.k++;}else seen.set(n,{x:c.x,z:c.z,k:1});}
    for(const [n,e] of seen)g.fillText(n,sx(e.x/e.k),sz(e.z/e.k));}
  g.font='16px VT323, monospace';
  for(const p of places){const x=sx(p.X),y=sz(p.Z);if(x<-80||y<-20||x>w+80||y>h+20)continue;g.fillStyle='#3a2a16';g.fillRect(x-2,y-2,4,4);g.fillStyle='#2a1c0e';g.fillText(p.n,x,y-6);}
  waypoints.forEach(m=>{const k=keyXYZ(m.userData.k),x=sx(k[0]+0.5),y=sz(k[2]+0.5);g.fillStyle=m.userData.c||'#5ff2ff';g.strokeStyle='#111';g.lineWidth=1.5;
    g.beginPath();g.moveTo(x,y-7);g.lineTo(x+6,y);g.lineTo(x,y+7);g.lineTo(x-6,y);g.closePath();g.fill();g.stroke();g.fillStyle='#10202a';g.fillText(wpName(m.userData.k),x,y+18);});
  for(const m of markers){const x=sx(m.X),y=sz(m.Z);g.fillStyle=m.c;g.strokeStyle='#111';g.lineWidth=2;g.beginPath();g.arc(x,y,6,0,6.3);g.fill();g.stroke();g.fillStyle='#111';g.fillText(m.n,x,y-10);}
  const px=sx(PL.x+OX),py=sz(PL.z+OZ);g.save();g.translate(px,py);g.rotate(-PL.yaw);g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=2;g.beginPath();g.moveTo(0,-10);g.lineTo(7,8);g.lineTo(0,4);g.lineTo(-7,8);g.closePath();g.stroke();g.fill();g.restore();
  g.textAlign='left';g.fillStyle='#2a1c0e';g.fillText('N',w/2-4,18);
  if(WM.pick){const x=sx(WM.pick.X),y=sz(WM.pick.Z);g.strokeStyle='#111';g.lineWidth=2;g.strokeRect(x-8,y-8,16,16);}
  if(pending)requestAnimationFrame(drawWorldMap); // more regions to draw: a few each frame
}
function wmPanel(){
  const p=$('wmpanel');p.innerHTML='';const add=(t,fn)=>{const b=document.createElement('button');b.textContent=t;b.addEventListener('click',e=>{e.stopPropagation();fn();});p.appendChild(b);return b;};
  if(WM.pick){const P=WM.pick,m=P.m;const lab=document.createElement('span');lab.textContent=(m?m.n:'X '+Math.round(P.X)+' Z '+Math.round(P.Z))+'  ';p.appendChild(lab);
    if(m)add('Remove marker',()=>{markers.splice(markers.indexOf(m),1);saveDirty=true;WM.pick=null;wmPanel();drawWorldMap();});
    else{const inp=document.createElement('input');inp.placeholder='Marker name';inp.maxLength=30;inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')addB.click();});p.appendChild(inp);
      const addB=add('Add marker',()=>{addMarker(P.X,P.Z,inp.value);WM.pick=null;wmPanel();drawWorldMap();});}
    if(!SURV())add('Travel here',()=>{closeWorldMap();goTo(P.X,P.Z);});
    add('Cancel',()=>{WM.pick=null;wmPanel();drawWorldMap();});
  }else{add('+',()=>wmZoom(2));add('-',()=>wmZoom(0.5));add('Up',()=>wmPan(0,-1));add('Down',()=>wmPan(0,1));add('Left',()=>wmPan(-1,0));add('Right',()=>wmPan(1,0));add('Centre',()=>{WM.X=PL.x+OX;WM.Z=PL.z+OZ;drawWorldMap();});add('Close',closeWorldMap);
    const t=document.createElement('span');t.textContent=SURV()?'  Tap the map to place a marker':'  Tap the map to place a marker or travel';p.appendChild(t);}
}
function wmZoom(f){WM.s=Math.max(0.125,Math.min(8,WM.s*f));drawWorldMap();}
function wmPan(dx,dz){WM.X+=dx*innerWidth*0.3/WM.s;WM.Z+=dz*innerHeight*0.3/WM.s;drawWorldMap();}
function addMarker(X,Z,n){if(markers.length>=MARK_CAP){toast('You have '+MARK_CAP+' markers already');return null;}const m={X:Math.round(X),Z:Math.round(Z),n:String(n||'').trim().slice(0,30)||'Marker '+(markers.length+1),c:MARK_COLS[markers.length%MARK_COLS.length]};markers.push(m);saveDirty=true;return m;}
function wmTap(px,py){const [X,Z]=wmToWorld(px,py);let m=null,bd=12/WM.s;for(const k of markers){const d=Math.hypot(k.X-X,k.Z-Z);if(d<bd){bd=d;m=k;}}WM.pick={X:m?m.X:X,Z:m?m.Z:Z,m:m};wmPanel();drawWorldMap();}
(function(){
  const c=wmCan();
  c.addEventListener('pointerdown',e=>{WM.drag={x:e.clientX,y:e.clientY,X:WM.X,Z:WM.Z,moved:false};});
  c.addEventListener('pointermove',e=>{const d=WM.drag;if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.abs(dx)+Math.abs(dy)>6)d.moved=true;if(d.moved){WM.X=d.X-dx/WM.s;WM.Z=d.Z-dy/WM.s;drawWorldMap();}});
  c.addEventListener('pointerup',e=>{const d=WM.drag;WM.drag=null;if(d&&!d.moved)wmTap(e.clientX,e.clientY);});
  c.addEventListener('wheel',e=>{e.preventDefault();wmZoom(e.deltaY<0?1.25:0.8);},{passive:false});
  addEventListener('keydown',e=>{if(!WM.open||(e.target&&e.target.tagName==='INPUT'))return;const a=BINDS.keys[e.code];
    if(e.code==='Escape'||a==='worldMap'){e.preventDefault();e.stopImmediatePropagation();closeWorldMap();}},true);
})();
// ---- The layer view (Q40): underground, the near minimap shows a slice at your feet: open space light, rock dark by its colour
const layerImg=document.createElement('canvas');layerImg.width=layerImg.height=64;let layerT=0,layerOn=false;
function layerWanted(){const x=Math.floor(PL.x),z=Math.floor(PL.z);return mmZoom===0&&x>=0&&z>=0&&x<W&&z<D&&PL.y<ground[x+W*z]-4&&caveF>0.5;}
function drawLayer(){
  const g=layerImg.getContext('2d'),im=g.createImageData(64,64),y=Math.floor(PL.y),x0=Math.floor(PL.x)-32,z0=Math.floor(PL.z)-32;
  for(let z=0;z<64;z++)for(let x=0;x<64;x++){const id=get(x0+x,y,z0+z),up=get(x0+x,y+1,z0+z),i=(z*64+x)*4;let r,gg,b;
    if(id===WATER||up===WATER){r=50;gg=100;b=210;}else if(id===LAVA||up===LAVA){r=250;gg=120;b=30;}
    else if(!SOLID[id]||!SOLID[up]){const fl=SOLID[get(x0+x,y-1,z0+z)];r=fl?176:120;gg=fl?178:122;b=fl?168:130;}
    else{const c=TAVG[BL[id].t[0]];r=c[0]*110;gg=c[1]*110;b=c[2]*110;}
    im.data[i]=r;im.data[i+1]=gg;im.data[i+2]=b;im.data[i+3]=255;}
  g.putImageData(im,0,0);
}
