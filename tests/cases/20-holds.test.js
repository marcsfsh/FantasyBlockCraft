// @seed 123456789 4242
// Dwarven holds are rare and vast (D-023): one per region of 160 x 160 chunks, several hundred blocks across, a few thousand apart.
const holds=[];for(let rx=-3;rx<=3;rx++)for(let rz=-3;rz<=3;rz++)holds.push(holdAt(rx,rz));
// 1. Spacing: distance from each hold to its nearest neighbour, in blocks
const nn=holds.map(a=>Math.min(...holds.filter(b=>b!==a).map(b=>Math.hypot(a.cx-b.cx,a.cz-b.cz)*CS)));
const mean=nn.reduce((s,v)=>s+v,0)/nn.length;
info('nearest-neighbour distance between holds: min',Math.round(Math.min(...nn)),'mean',Math.round(mean),'blocks');
assert(Math.min(...nn)>=1000,'holds are at least 1000 blocks apart');
assert(mean>=1600&&mean<=3500,'holds are a few thousand blocks apart on average');
// 2. Size and containment: the footprint (chunks inside the hold) of a sample of holds
let dmin=1e9,dmax=0,stray=0,inOwn=true;
for(const h of holds.slice(0,12)){let n=0;
  for(let a=-40;a<=40;a++)for(let b=-40;b<=40;b++){const cx=h.cx+a,cz=h.cz+b;if(!ruinZone(cx,cz))continue;n++;if(Math.hypot(a,b)>h.R*1.6)stray++;if(holdNear(cx,cz)!==h)inOwn=false;}
  const dia=2*Math.sqrt(n/Math.PI)*CS;dmin=Math.min(dmin,dia);dmax=Math.max(dmax,dia);}
info('hold footprint as an equal-area circle: diameter',Math.round(dmin),'to',Math.round(dmax),'blocks');
assert(dmin>=300&&dmax<=750,'every hold is several hundred blocks across');
assert(stray===0&&inOwn,'a hold stays inside its own region, close to its centre');
// 3. The spawn area is open country: no hold within 400 blocks of the origin
let near=0;for(let a=-25;a<=25;a++)for(let b=-25;b<=25;b++)if(ruinZone(a,b))near++;
assert(near===0,'no hold lies under the spawn area');
// 4. One name per hold, different between holds
const h0=holds[24],n0=holdOf(h0.cx,h0.cz).name;let same=true;for(let a=-8;a<=8;a+=4)for(let b=-8;b<=8;b+=4)if(holdOf(h0.cx+a,h0.cz+b).name!==n0)same=false;
const names=new Set(holds.map(h=>holdOf(h.cx,h.cz).name));
info('hold of region 0,0:',n0,'at X',h0.cx*CS+8,'Z',h0.cz*CS+8,'; distinct names',names.size,'of',holds.length);
assert(same,'every part of a hold carries the same name');
assert(names.size>=holds.length-2,'holds have their own names');
// 5. Some holds are inhabited (kept up, lit); their people arrive with settlements in E2
const inh=holds.filter(h=>h.inhabited).length;info('inhabited holds',inh,'of',holds.length);
assert(inh>=3&&inh<=holds.length*0.5,'some holds, not most, are inhabited');
assert(ruinI(h0.cx,h0.cz)<(h0.inhabited?0.25:1.01)&&ruinI(h0.cx,h0.cz)>=(h0.inhabited?0:0.55),'decay follows whether the hold is inhabited');
// 6. Mines spread out from each hold and fade with distance (Q12)
const ring=[[0,1,0,0],[1.2,1.5,0,0],[1.5,1.9,0,0],[1.9,9,0,0]];
for(const h of holds.slice(20,29))for(let a=-45;a<=45;a++)for(let b=-45;b<=45;b++){const d=holdReach(h,h.cx+a,h.cz+b);for(const r of ring)if(d>=r[0]&&d<r[1]){r[2]++;if(mineZone(h.cx+a,h.cz+b))r[3]++;}}
const share=r=>r[3]/Math.max(1,r[2]);
info('share of chunks with mines by distance from the hold centre (in hold radii): under 1',share(ring[0]).toFixed(2),'1.2-1.5',share(ring[1]).toFixed(2),'1.5-1.9',share(ring[2]).toFixed(2),'beyond 1.9',share(ring[3]).toFixed(2));
assert(share(ring[0])===1,'mines run under the whole hold');
assert(share(ring[1])>share(ring[2])&&share(ring[2])>0.02&&share(ring[1])<0.98,'mines thin out with distance');
assert(ring[3][3]===0,'no mines far from a hold');
let mnear=0;for(let a=-25;a<=25;a++)for(let b=-25;b<=25;b++)if(mineZone(a,b))mnear++;assert(mnear===0,'no mines under the spawn area');
