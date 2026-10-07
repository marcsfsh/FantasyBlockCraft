// ---- Ore processing: gold pan, sluices and the crusher
let panCool=0,sluiceT=0;
const sluices=new Set(),sluiceStore=new Map();
function usePan(){
  if(panCool>0)return;
  const e=eyePos(),d=camDir();let wet=liquidAt(PL.x,PL.y+0.2,PL.z)===1;
  for(let t=0;t<5&&!wet;t+=0.4){const id=get(Math.floor(e.x+d.x*t),Math.floor(e.y+d.y*t),Math.floor(e.z+d.z*t));if(id===WATER)wet=true;else if(id&&SOLID[id])break;}
  if(!wet){toast('Aim the pan at water, ideally a river');return;}
  panCool=1.1;swing=1;wearHeld(1);burst(0.45,'bandpass',800,0.7,0.22);
  const o=colInfoBase(Math.floor(PL.x)+OX,Math.floor(PL.z)+OZ,T4),mult=o.river?1.8:1,r=Math.random();
  for(let k=0;k<8;k++)spawnP(e.x+d.x*1.2,e.y-0.4,e.z+d.z*1.2,(Math.random()-.5)*2,1+Math.random()*2,(Math.random()-.5)*2,[.75,.85,1],0.5,14);
  let got=0;if(r<0.045*mult)got=268;else if(r<0.28*mult)got=267;
  if(got){if(addItem(got,1))toast('Inventory full');else{showName('+1 '+nameOf(got));tone(1700,2300,0.08,0.07);}drawBar(true);}
  else showName('Just silt');
}
function sluiceWet(i){const x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;return get(x+1,y,z)===WATER||get(x-1,y,z)===WATER||get(x,y,z+1)===WATER||get(x,y,z-1)===WATER||get(x,y+1,z)===WATER;}
function tickSluices(dt){
  sluiceT-=dt;if(sluiceT>0)return;sluiceT=10;
  for(const i of sluices){
    if(world[i]!==SLUICE||!sluiceWet(i))continue;
    const k=iToKey(i);let st=sluiceStore.get(k);if(!st){st={g:0,p:0};sluiceStore.set(k,st);}
    const r=Math.random();if(r<0.04&&st.p<64)st.p++;else if(r<0.3&&st.g<64)st.g++;else continue;
    saveDirty=true;const x=i%W,t=(i/W)|0;for(let q=0;q<5;q++)spawnP(x+.5,((t/D)|0)+1,(t%D)+.5,(Math.random()-.5)*1.5,1.5,(Math.random()-.5)*1.5,[1,.85,.3],0.6,10);
  }
}
function collectSluice(X,Y,Z){
  const k=wkey(X+OX,Y,Z+OZ),st=sluiceStore.get(k),wet=sluiceWet(I(X,Y,Z));
  if(!st||(!st.g&&!st.p)){toast(wet?'The sluice is working. Check back in a while.':'A sluice needs water flowing beside or over it');return;}
  const lost=addItem(267,st.g)+addItem(268,st.p);
  showName('Collected '+st.g+' gold and '+st.p+' platinum nuggets');st.g=0;st.p=0;if(lost)toast('Inventory full');saveDirty=true;drawBar(true);tone(1500,2000,0.08,0.08);
}
