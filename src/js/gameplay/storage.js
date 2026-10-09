// ---- Storage (M4b, Q20, Q67): chests you make and the chests, crates and barrels of the old world hold items by world position.
// A world container rolls its loot from its position the first time it is opened and keeps whatever is left after that; one
// you build starts empty. Contents are saved with the world (save data `cs`). A container that holds anything (or a world one
// never opened) cannot be broken: empty it first. In survival the inventory screen shows the container beside the pack;
// tapping a slot on either side moves that stack across. Creative only looks inside.
const BOX_SLOTS=27,boxes=new Map(),BOX_IDS=new Set([CHEST,CRATE,DWCHEST,BARREL]);
let box=null; // the open container: {k, x, y, z} in window coordinates
if(saved&&Array.isArray(saved.cs))saved.cs.forEach(([k,sl])=>{const a=new Array(BOX_SLOTS).fill(null);(sl||[]).forEach(([i,id,c,d])=>{if(i<BOX_SLOTS&&(ITEMS[id]||BL[id]))a[i]={id:id,c:c,d:d||0};});boxes.set(k,a);});
const boxSave=()=>[...boxes].map(([k,a])=>[k,a.map((q,i)=>q&&[i,q.id,q.c,q.d||0]).filter(Boolean)]);
// The loot a world container holds when first opened, decided by where it sits (the tables are in underground-sites.js)
function lootOf(id,WX,Y,WZ){
  const dw=id===DWCHEST,TBL=dw?(ROOM_LOOT[roomAt(WX,Y,WZ)]||DWLOOT):id===BARREL?BARRELLOOT:LOOT,r=rngAt(WX,Y*13+7,WZ),rolls=(dw?4:2)+(r()*3|0);
  let tot=0;for(const l of TBL)tot+=l[3];
  const out=[];for(let k=0;k<rolls;k++){let v=r()*tot,it=TBL[0];for(const l of TBL){v-=l[3];if(v<=0){it=l;break;}}out.push([it[0],it[1]+Math.floor(r()*(it[2]-it[1]+1))]);}
  return out;
}
// The slots of the container at window position (x,y,z), rolling a world container's loot on first use
function boxAt(x,y,z,keep){
  const k=wkey(x+OX,y,z+OZ);let a=boxes.get(k);if(a)return a;
  a=new Array(BOX_SLOTS).fill(null);const id=get(x,y,z);
  if(id!==CHEST)for(const [it,n] of lootOf(id,x+OX,y,z+OZ))boxPut(a,it,n,0);
  if(keep)boxes.set(k,a);return a;
}
// Put n of id into slots a (stacking first); returns what did not fit
function boxPut(a,id,n,d){
  if(stackMax(id)>1)for(const q of a)if(n>0&&q&&q.id===id&&q.c<stackMax(id)){const t=Math.min(n,stackMax(id)-q.c);q.c+=t;n-=t;}
  for(let i=0;i<a.length&&n>0;i++)if(!a[i]){const t=Math.min(n,stackMax(id));a[i]={id:id,c:t,d:d||0};n-=t;}
  return n;
}
const boxEmpty=a=>a.every(q=>!q);
// Can the container be broken now? World containers must be opened and emptied; a built chest only emptied
function boxBusy(x,y,z){const a=boxes.get(wkey(x+OX,y,z+OZ));return a?!boxEmpty(a):get(x,y,z)!==CHEST;}
function boxGone(X,Y,Z){boxes.delete(wkey(X,Y,Z));} // the block went away (creative or empty)
function openBox(x,y,z){
  const id=get(x,y,z);
  if(!SURV()){const a=boxAt(x,y,z,false),L=a.filter(Boolean).map(q=>q.c+' '+nameOf(q.id));toast(L.length?'Inside: '+L.join(', '):'It is empty');return;}
  boxAt(x,y,z,true);box={k:wkey(x+OX,y,z+OZ),x:x,y:y,z:z};saveDirty=true;
  sfxBlock(PLANKS,false);tone(700,900,0.1,0.06);openInv();
}
// Move one stack between the open container and the inventory; tools keep their wear
function boxTake(i){
  const a=boxes.get(box.k),q=a&&a[i];if(!q)return;
  if(stackMax(q.id)===1){const f=freeSlot();if(f<0){toast('Inventory full');return;}inv[f]={id:q.id,c:1,d:q.d||0};a[i]=null;}
  else{const left=addItem(q.id,q.c);if(left===q.c){toast('Inventory full');return;}if(left)q.c=left;else a[i]=null;}
  saveDirty=true;drawBar(true);
}
function boxGive(i){
  const a=boxes.get(box.k),q=inv[i];if(!a||!q)return;
  const left=boxPut(a,q.id,q.c,q.d);if(left===q.c){toast('The '+nameOf(get(box.x,box.y,box.z)).toLowerCase()+' is full');return;}
  if(left)q.c=left;else inv[i]=null;saveDirty=true;drawBar(true);
}
function boxTakeAll(){const a=boxes.get(box.k);for(let i=0;i<a.length;i++)if(a[i])boxTake(i);}
// The container's column on the inventory screen (replaces the crafting list while a container is open)
function renderBox(col){
  const a=boxes.get(box.k)||[],h=document.createElement('div');h.className='inv-h';h.textContent=nameOf(get(box.x,box.y,box.z))+': tap a slot to take it, or a pack slot to put it in';col.appendChild(h);
  const g=document.createElement('div');g.className='sgrid';
  a.forEach((q,i)=>{const b=document.createElement('button');b.className='sslot';
    if(q){b.appendChild(icon(q.id));if(q.c>1){const n=document.createElement('span');n.className='n';n.textContent=q.c;b.appendChild(n);}b.title=nameOf(q.id);}
    b.addEventListener('click',()=>{boxTake(i);renderSInv();});g.appendChild(b);});
  col.appendChild(g);
  const all=document.createElement('button');all.className='wide';all.textContent='Take everything';all.addEventListener('click',()=>{boxTakeAll();renderSInv();});col.appendChild(all);
}
function isBox(id){return id===CHEST||id===CRATE||id===DWCHEST||id===BARREL;}
