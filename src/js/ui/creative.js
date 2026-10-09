// ---- Creative tools (M5b, Q76): searching the block menu, the Fill Tool, going to coordinates, time and weather, and placing
// the world's structures to try them out. Everything here is creative only; edits go through setBlock, so they save and undo.
// Search: the block menu shows only blocks whose name holds the text typed (categories with nothing left are hidden)
function filterBlocks(q){
  q=String(q||'').trim().toLowerCase();let head=null,shown=0,total=0;
  for(const el of $('invgrid').children){if(el.className==='inv-h'){if(head)head.style.display=shown?'':'none';head=el;shown=0;continue;}
    const ok=!q||(el.title||'').toLowerCase().includes(q);el.style.display=ok?'':'none';if(ok){shown++;total++;}}
  if(head)head.style.display=shown?'':'none';return total;
}
// ---- The Fill Tool: break sets the first corner, place the second; then fill the box with a hotbar block, replace one block
// with another inside it, or clear it. Up to 64 blocks a side and 131072 blocks in all.
const FILL={a:null,b:null,only:null},FILL_SIDE=64,FILL_MAX=131072;
const fillBoxM=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1,1,1)),new THREE.LineBasicMaterial({color:0xffa030}));fillBoxM.visible=false;scene.add(fillBoxM);
function fillDims(){const a=FILL.a,b=FILL.b;return[Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.min(a[2],b[2]),Math.abs(a[0]-b[0])+1,Math.abs(a[1]-b[1])+1,Math.abs(a[2]-b[2])+1];}
function fillCorner(which,hit){
  FILL[which]=[hit.x+OX,hit.y,hit.z+OZ];
  if(FILL.a&&FILL.b){const d=fillDims();if(d[3]>FILL_SIDE||d[4]>FILL_SIDE||d[5]>FILL_SIDE||d[3]*d[4]*d[5]>FILL_MAX){toast('Too big: '+FILL_SIDE+' blocks a side and '+FILL_MAX+' blocks at most');FILL[which]=null;return;}
    FILL.only=null;openFill();}
  else toast(which==='a'?'First corner set. Place to set the second.':'Second corner set. Break to set the first.');
}
function updFillBox(){
  const show=!SURV()&&curId()===FILLTOOL&&FILL.a&&!photo;fillBoxM.visible=!!show;if(!show)return;
  const a=FILL.a,b=FILL.b||a,x0=Math.min(a[0],b[0])-OX,y0=Math.min(a[1],b[1]),z0=Math.min(a[2],b[2])-OZ;
  fillBoxM.scale.set(Math.abs(a[0]-b[0])+1.02,Math.abs(a[1]-b[1])+1.02,Math.abs(a[2]-b[2])+1.02);
  fillBoxM.position.set(x0+fillBoxM.scale.x/2-0.01,y0+fillBoxM.scale.y/2-0.01,z0+fillBoxM.scale.z/2-0.01);
}
// What is in the box: [id, count] by count, air left out
function fillCensus(){const d=fillDims(),n={};for(let y=d[1];y<d[1]+d[4];y++)for(let z=d[2];z<d[2]+d[5];z++)for(let x=d[0];x<d[0]+d[3];x++){const id=get(x-OX,y,z-OZ);if(id)n[id]=(n[id]||0)+1;}
  return Object.entries(n).map(([k,v])=>[+k,v]).sort((a,b)=>b[1]-a[1]);}
// Fill the box with id; with only set, change only the blocks of that kind. Returns how many blocks changed.
function applyFill(id,only){
  const d=fillDims();let n=0;beginAct();
  for(let y=d[1];y<d[1]+d[4];y++)for(let z=d[2];z<d[2]+d[5];z++)for(let x=d[0];x<d[0]+d[3];x++){
    const lx=x-OX,lz=z-OZ;if(lx<0||lz<0||lx>=W||lz>=D||y<0||y>=H)continue;const cur=world[I(lx,y,lz)];
    if(cur===BEDROCK||cur===id||(only!==null&&cur!==only))continue;setBlock(lx,y,lz,id);n++;}
  endAct();return n;
}
function openFill(){
  invOpen=true;hold=-1;['invgrid','invname','sinv','bplist','invsearch'].forEach(id=>{$(id).style.display='none';});
  const el=$('lore'),d=fillDims();el.innerHTML='';el.style.display='block';$('invtitle').textContent='Fill Tool: '+d[3]+' x '+d[4]+' x '+d[5];
  const row=(t)=>{const r=document.createElement('div');r.className='inv-h';r.textContent=t;el.appendChild(r);const g=document.createElement('div');g.className='fillrow';el.appendChild(g);return g;};
  const btn=(g,label,fn,on,id)=>{const b=document.createElement('button');b.className='wide'+(on?' on':'');if(id){b.appendChild(icon(id));}b.appendChild(document.createTextNode(label));b.addEventListener('click',fn);g.appendChild(b);};
  const census=fillCensus(),r1=row('Change only:');
  btn(r1,'Anything',()=>{FILL.only=null;openFill();},FILL.only===null);
  for(const [id,c] of census.slice(0,8))btn(r1,' '+nameOf(id)+' ('+c+')',()=>{FILL.only=id;openFill();},FILL.only===id,id);
  const r2=row('Fill with a hotbar block:'),done=n=>{toast(n+' blocks changed');closeInv();};
  for(const id of [...new Set(hot)])if(BL[id]&&BL[id].place&&!isTool(id))btn(r2,' '+nameOf(id),()=>done(applyFill(id,FILL.only)),false,id);
  const r3=row('Or:');btn(r3,'Clear to air',()=>done(applyFill(AIR,FILL.only)));btn(r3,'Forget the box',()=>{FILL.a=FILL.b=null;closeInv();});btn(r3,'Close',()=>closeInv());
  $('inv').style.display='grid';if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;
}
// ---- Go to coordinates (creative): loads the area and puts you on the ground there, or at height Y if given
function goTo(X,Z,Y){
  X=Math.round(+X);Z=Math.round(+Z);if(!isFinite(X)||!isFinite(Z)||Math.abs(X)>2e6||Math.abs(Z)>2e6)return false;
  if(Math.abs(X-(PL.x+OX))>W/2-40||Math.abs(Z-(PL.z+OZ))>D/2-40)regenerateAll(X,Z);
  const x=X-OX,z=Z-OZ;let y=+Y;
  if(Y===undefined||Y===''||!isFinite(y)){y=H-2;while(y>1&&!SOLID[get(x,y,z)])y--;y++;}
  PL.x=x+0.5;PL.z=z+0.5;PL.y=Math.max(1,Math.min(H-2,y));PL.vx=PL.vy=PL.vz=0;if(!PL.noclip)while(collide()&&PL.y<H-2)PL.y++;
  fallTop=null;gliding=false;toast('You go to X '+X+' Z '+Z);return true;
}
// ---- Time and weather (creative)
function setTimeOfDay(h){settings.time='fixed';tod=((+h/24)%1+1)%1;lsSet(SET_KEY,settings);}
function setWeatherNow(rain){settings.weather=true;raining=!!rain;rainT=rain?240:400;if(!rain)rainAmt=Math.min(rainAmt,0.3);lsSet(SET_KEY,settings);}
// ---- Test structures (creative): build one of the world's structures where you look. The builder runs once for each chunk it
// touches, as generation does, and every block it changed becomes an ordinary edit (saved, lit, undoable).
const STAMPS={tower:'Watchtower',keep:'Ruined keep',castle:'Castle ruins',barrow:'Barrow',ring:'Stone ring',waystone:'Ancient waystone',dungeon:'Dungeon room (below)'};
function stampAt(kind,X,g,Z){
  const seed=hsh(X,9901,Z),rs=()=>mkRng(Math.floor(seed*1e9));let run,rad,y0,y1;
  if(kind==='tower'||kind==='keep'||kind==='castle'){const R=kind==='tower'?4:kind==='keep'?6:14,Hh=kind==='tower'?12:kind==='keep'?9:7,s={kind:kind,X:X,Z:Z,R:R,H:Hh,g:g,seed:seed,way:false};
    run=()=>buildSite(s);rad=R+12;y0=g-14;y1=g+Hh+12;}
  else if(kind==='barrow'){const o={rot:(seed*4)|0,sz:1,long:false,broken:false};run=()=>barrowP(X,g,Z,rs(),o);rad=14;y0=g-8;y1=g+10;}
  else if(kind==='ring'){run=()=>stoneRingP(X,g,Z,rs(),1);rad=12;y0=g-4;y1=g+10;}
  else if(kind==='waystone'){run=()=>waystoneP(X,Z,g);rad=3;y0=g-7;y1=g+6;}
  else if(kind==='dungeon'){const d={kind:DUNGEON_KINDS[(seed*4)|0],X:X,Z:Z,y:g-12,hw:4,hh:5,a:{x:X+10,y:g+1,z:Z}};run=()=>dungeonP(d,rs());rad=14;y0=g-14;y1=g+4;} // its tunnel comes up beside the spot
  else return 0;
  const x0=Math.max(0,X-rad-OX),x1=Math.min(W-1,X+rad-OX),z0=Math.max(0,Z-rad-OZ),z1=Math.min(D-1,Z+rad-OZ);y0=Math.max(0,y0);y1=Math.min(H-1,y1);
  const nx=x1-x0+1,nz=z1-z0+1,ny=y1-y0+1,old=new Uint8Array(nx*ny*nz),K=(x,y,z)=>((y-y0)*nz+(z-z0))*nx+(x-x0);
  for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)old[K(x,y,z)]=world[I(x,y,z)];
  const sx=gx0,sz=gz0;
  try{for(let cz=Math.floor((z0+OZ)/CS);cz<=Math.floor((z1+OZ)/CS);cz++)for(let cx=Math.floor((x0+OX)/CS);cx<=Math.floor((x1+OX)/CS);cx++){gx0=cx*CS;gz0=cz*CS;run();}}
  finally{gx0=sx;gz0=sz;}
  let n=0;beginAct();
  for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){const i=I(x,y,z),now=world[i],was=old[K(x,y,z)];if(now!==was){world[i]=was;setBlock(x,y,z,now,true);n++;}}
  endAct();return n;
}
function stampHere(kind){
  if(creativeOnly())return 0;const hit=raycast(eyePos(),camDir(),64);if(!hit){toast('Look at the ground where it should stand');return 0;}
  const n=stampAt(kind,hit.x+OX,hit.y,hit.z+OZ);toast(n?'Built a '+STAMPS[kind].toLowerCase()+' ('+n+' blocks); undo removes it':'Nothing was built here');return n;
}
