// ---- Power: generators, copper wire, batteries and machines
const BATCAP=5000,powerBlocks=new Set(),batCharge=new Map(),genFuel=new Map(),poweredEF=new Set(),netInfo=new Map();
let pwT=0,sunPower=0;
const CONDUCT=new Uint8Array(256);[WIRE,COALGEN,WHEEL,SOLAR,BATTERY,LAMP_OFF,LAMP_ON,EFURN,CHARGER].forEach(i=>CONDUCT[i]=1);
function wetSide(x,y,z){return get(x+1,y,z)===WATER||get(x-1,y,z)===WATER||get(x,y,z+1)===WATER||get(x,y,z-1)===WATER||get(x,y+1,z)===WATER||get(x,y-1,z)===WATER;}
function powerTick(dt){
  pwT-=dt;if(pwT>0)return;pwT=1;
  const seen=new Set();netInfo.clear();poweredEF.clear();
  for(const s0 of powerBlocks){
    if(seen.has(s0))continue;
    const q=[s0],mem=[];seen.add(s0);
    while(q.length){const i=q.pop();mem.push(i);const x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;
      for(const F of FACES){const X=x+F.d[0],Y=y+F.d[1],Z=z+F.d[2];if(X<0||Z<0||Y<0||X>=W||Z>=D||Y>=H)continue;const j=I(X,Y,Z);if(!seen.has(j)&&powerBlocks.has(j)){seen.add(j);q.push(j);}}}
    let prod=0,cons=0,gens=0,nearCh=false;const bats=[],lamps=[],efs=[];
    for(const i of mem){
      const id=world[i],x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;
      if(id===COALGEN){gens++;const k=iToKey(i),f=genFuel.get(k)||0;if(f>0){prod+=12;genFuel.set(k,f-1);saveDirty=true;}}
      else if(id===WHEEL){gens++;if(wetSide(x,y,z))prod+=5;}
      else if(id===SOLAR){gens++;if(sky(x,y+1,z)>=0.99)prod+=Math.round(8*sunPower);}
      else if(id===BATTERY)bats.push(iToKey(i));
      else if(id===LAMP_OFF||id===LAMP_ON){cons+=1;lamps.push(i);}
      else if(id===EFURN){cons+=4;efs.push(i);}
      else if(id===CHARGER&&SURV()&&Math.hypot(x+.5-PL.x,y+.5-PL.y-0.9,z+.5-PL.z)<4)nearCh=true;
    }
    const charging=nearCh?inv.filter(q=>q&&ITEMS[q.id]&&ITEMS[q.id].power&&(q.e||0)<ITEMS[q.id].cap):[];
    let stored=0;for(const k of bats)stored+=batCharge.get(k)||0;
    const give=charging.length?Math.max(0,Math.min(charging.length*15,prod-cons+stored)):0;cons+=give;
    const cap=bats.length*BATCAP;let ok=true,net=prod-cons;
    if(net>=0){stored=Math.min(cap,stored+net);}
    else if(stored>=-net){stored+=net;}
    else{ok=false;stored=0;}
    if(bats.length){const each=stored/bats.length;for(const k of bats)batCharge.set(k,each);if(net)saveDirty=true;}
    for(const i of lamps){const want=ok?LAMP_ON:LAMP_OFF;if(world[i]!==want){const t=(i/W)|0;setBlock(i%W,(t/D)|0,t%D,want,true);}}
    if(ok)for(const i of efs)poweredEF.add(i);
    if(ok&&charging.length&&give>0){for(const q of charging)q.e=Math.min(ITEMS[q.id].cap,(q.e||0)+give/charging.length);const q0=charging[0];showName('Charging '+nameOf(q0.id)+' '+Math.round(100*q0.e/ITEMS[q0.id].cap)+'%');drawBar(true);saveDirty=true;}
    else if(nearCh&&charging.length)showName('Not enough power to charge');
    const info={prod:prod,cons:cons,stored:stored,cap:cap,gens:gens,ok:ok,size:mem.length};
    for(const i of mem)netInfo.set(i,info);
  }
}
function powerStatus(i){
  const n=netInfo.get(i);if(!n){toast('Not connected yet, give it a second');return;}
  let s=n.prod+' W made, '+n.cons+' W used';
  if(n.cap)s+=', batteries '+Math.round(100*n.stored/n.cap)+'%';
  if(!n.gens)s+=', no generator';else if(!n.ok)s+=', not enough power';
  toast(s);
}
function useGenerator(X,Y,Z){
  const i=I(X,Y,Z),k=iToKey(i),held=curId();
  if(held===200){
    let n=SURV()?Math.min(16,countOf(200)):16;if(!n){toast('Out of coal');return;}
    if(SURV())takeItems(200,n);genFuel.set(k,(genFuel.get(k)||0)+n*60);saveDirty=true;drawBar(true);tone(300,500,0.15,0.15);
  }
  const f=genFuel.get(k)||0;toast(f>0?'Generator has '+Math.ceil(f/60)+' minutes of coal. Hold coal and use it to add more.':'Generator is out of coal. Hold coal and use it to fuel it.');
}
// An electric furnace on a working network smelts without coal
function nearPoweredEF(){
  const px=Math.floor(PL.x),py=Math.floor(PL.y),pz=Math.floor(PL.z);
  for(const i of poweredEF){const x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;if(Math.abs(x-px)<=4&&Math.abs(z-pz)<=4&&y>=py-3&&y<=py+4)return true;}
  return false;
}
const elecRecipe=r=>r[3]==='f'&&nearPoweredEF();
function canCraft(r){if(r[3]&&!nearStation(r[3]))return false;const el=elecRecipe(r);return r[2].every(([ids,n])=>(el&&ids===200)||countOf(ids)>=n);}
function craft(r){
  if(!canCraft(r))return;if(roomFor(r[0])<r[1]){toast('Inventory full');return;}
  const el=elecRecipe(r);r[2].forEach(([ids,n])=>{if(!(el&&ids===200))takeItems(ids,n);});addItem(r[0],r[1]);
  tone(600,900,0.08,0.1);showName('+'+r[1]+' '+nameOf(r[0]));drawBar(true);renderSInv();
}
