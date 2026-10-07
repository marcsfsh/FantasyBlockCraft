// ---- Blueprints: copy a built area and rebuild it elsewhere
const BP_KEY='blockcraft-blueprints';let blueprints=lsGet(BP_KEY)||[];
const BP={a:null,b:null,sel:-1,rot:0};
const bpBox=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1,1,1)),new THREE.LineBasicMaterial({color:0x3a9cff}));bpBox.visible=false;scene.add(bpBox);
function bpDims(bp,rot){return rot&1?[bp.d,bp.h,bp.w]:[bp.w,bp.h,bp.d];}
function markBox(){const a=BP.a,b=BP.b;return[Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.min(a[2],b[2]),Math.abs(a[0]-b[0])+1,Math.abs(a[1]-b[1])+1,Math.abs(a[2]-b[2])+1];}
function bpTool(hit){
  if(BP.sel>=0){placeBlueprint(hit);return;}
  if(!BP.a){BP.a=[hit.x+OX,hit.y,hit.z+OZ];toast('First corner set. Now click the opposite corner.');return;}
  if(!BP.b){BP.b=[hit.x+OX,hit.y,hit.z+OZ];const m=markBox();if(m[3]>32||m[4]>32||m[5]>32){toast('Too big: 32 blocks per side at most');BP.b=null;return;}toast('Marked '+m[3]+'x'+m[4]+'x'+m[5]+'. Click again to save it, or X to clear.');return;}
  const m=markBox(),ids=[];let n=0;
  for(let y=0;y<m[4];y++)for(let z=0;z<m[5];z++)for(let x=0;x<m[3];x++){
    const lx=m[0]+x-OX,lz=m[2]+z-OZ;let id=(lx<0||lz<0||lx>=W||lz>=D)?0:world[I(lx,m[1]+y,lz)];
    if(id&&(BL[id].liquid||id===BEDROCK))id=0;if(id)n++;
    const last=ids.length-2;if(last>=0&&ids[last]===id)ids[last+1]++;else ids.push(id,1);
  }
  if(!n){toast('That area is empty');return;}
  const bp={name:'Blueprint '+(blueprints.length+1),w:m[3],h:m[4],d:m[5],n:n,rle:ids};
  blueprints.push(bp);if(!lsSet(BP_KEY,blueprints))toast('Could not save, storage is full');else toast('Saved '+bp.name+' ('+n+' blocks). Pick it from the block menu to build it.');
  BP.a=BP.b=null;tone(900,1300,0.1,0.1);
}
function needFor(id){if(!id||!BL[id]||BL[id].liquid||BL[id].cross||BL[id].leaf||id===BEDROCK)return null;if(id===GRASS||id===SNOWG||id===PATH)return DIRT;return id;}
function placeBlueprint(hit){
  const bp=blueprints[BP.sel];if(!bp)return;
  const [W2,H2,D2]=bpDims(bp,BP.rot),ox=hit.px,oy=hit.py,oz=hit.pz,list=[],need={};
  let x=0,y=0,z=0;
  for(let k=0;k<bp.rle.length;k+=2)for(let c=0;c<bp.rle[k+1];c++){
    const id=bp.rle[k];
    if(id){
      let rx,rz;if(BP.rot===0){rx=x;rz=z;}else if(BP.rot===1){rx=bp.d-1-z;rz=x;}else if(BP.rot===2){rx=bp.w-1-x;rz=bp.d-1-z;}else{rx=z;rz=bp.w-1-x;}
      const X=ox+rx,Y=oy+y,Z=oz+rz;
      if(X>=0&&Z>=0&&X<W&&Z<D&&Y>=0&&Y<H){const cur=world[I(X,Y,Z)];
        if(cur===AIR||BL[cur].liquid||BL[cur].cross){const nd=needFor(id);if(SURV()&&!nd){}else{list.push([X,Y,Z,id]);if(SURV())need[nd]=(need[nd]||0)+1;}}}
    }
    if(++x>=bp.w){x=0;if(++z>=bp.d){z=0;y++;}}
  }
  if(!list.length){toast('Nothing to build here');return;}
  if(SURV()){
    const miss=Object.keys(need).map(Number).filter(id=>countOf(id)<need[id]).map(id=>(need[id]-countOf(id))+' '+nameOf(id));
    if(miss.length){toast('Missing '+miss.slice(0,3).join(', ')+(miss.length>3?' and more':''));return;}
    for(const id in need)takeItems(Number(id),need[id]);
  }
  beginAct();list.forEach(([X,Y,Z,id])=>setBlock(X,Y,Z,id));endAct();
  drawBar(true);toast('Built '+list.length+' blocks');sfxBlock(PLANKS,true);swing=1;
}
function updBpPreview(){
  if(curId()!==BPTOOL||photo){bpBox.visible=false;return;}
  const hit=raycast(eyePos(),camDir(),BP.sel>=0?12:6);let x0,y0,z0,w,h,d;
  if(BP.sel>=0&&blueprints[BP.sel]){if(!hit){bpBox.visible=false;return;}[w,h,d]=bpDims(blueprints[BP.sel],BP.rot);x0=hit.px;y0=hit.py;z0=hit.pz;}
  else if(BP.a){const b=BP.b||(hit?[hit.x+OX,hit.y,hit.z+OZ]:BP.a),a=BP.a;x0=Math.min(a[0],b[0])-OX;y0=Math.min(a[1],b[1]);z0=Math.min(a[2],b[2])-OZ;w=Math.abs(a[0]-b[0])+1;h=Math.abs(a[1]-b[1])+1;d=Math.abs(a[2]-b[2])+1;}
  else{bpBox.visible=false;return;}
  bpBox.visible=true;bpBox.scale.set(w+0.04,h+0.04,d+0.04);bpBox.position.set(x0+w/2,y0+h/2,z0+d/2);
}
function renderBlueprints(box){
  box.innerHTML='';
  const h=document.createElement('div');h.className='inv-h';h.textContent='Blueprints: hold the Blueprint Tool, click two corners, then click again to save. Q rotates, X clears.';box.appendChild(h);
  blueprints.forEach((bp,i)=>{
    const row=document.createElement('div');row.className='rec';
    const t=document.createElement('div');t.className='t';t.textContent=bp.name+(BP.sel===i?' (selected, turn '+BP.rot*90+')':'');
    const sm=document.createElement('small');sm.textContent=bp.w+' x '+bp.h+' x '+bp.d+', '+bp.n+' blocks';t.appendChild(sm);row.appendChild(t);
    const mk=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.addEventListener('click',fn);row.appendChild(b);};
    mk(BP.sel===i?'Rotate':'Use',()=>{if(BP.sel===i)BP.rot=(BP.rot+1)%4;else{BP.sel=i;BP.rot=0;}BP.a=BP.b=null;renderBlueprints(box);});
    mk('Delete',()=>{blueprints.splice(i,1);lsSet(BP_KEY,blueprints);if(BP.sel===i)BP.sel=-1;else if(BP.sel>i)BP.sel--;renderBlueprints(box);});
    box.appendChild(row);
  });
  if(BP.sel>=0){const row=document.createElement('div');row.className='rec';const t=document.createElement('div');t.className='t';t.textContent='Mark a new area instead';row.appendChild(t);const b=document.createElement('button');b.textContent='Mark';b.addEventListener('click',()=>{BP.sel=-1;BP.a=BP.b=null;renderBlueprints(box);});row.appendChild(b);box.appendChild(row);}
}
