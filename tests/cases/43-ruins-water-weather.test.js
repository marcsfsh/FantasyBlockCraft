// Ruins, water and weather (M6h): watchtowers, keeps and castles in four layouts each; ponds, springs, rapids and hillside
// streams; weather and skies by land; caves near the surface in the land's character; landmarks and features for the old kept lands.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
function unsound(){let n=0;for(let z=1;z<D-1;z++)for(let x=1;x<W-1;x++){const g=ground[x+W*z];for(let y=FIRE_LV+1;y<g-2;y++){const i=I(x,y,z);if(world[i]!==WATER)continue;
  const held=j=>world[j]===WATER||SOLID[world[j]],rests=j=>held(j-WD),b=i-WD;
  if(!(held(b)&&(world[b]===WATER||rests(b))&&[i+1,i-1,i+W,i-W].every(j=>held(j)&&(world[j]===WATER||rests(j)))))n++;}}return n;}
// ---- ruin layouts (Q122)
{const lay={tower:new Set(),keep:new Set(),castle:new Set()},faces=new Set();let castle=null;
  for(let a=-12;a<12;a++)for(let b=-12;b<12;b++){const s=siteAt(a,b);if(!s)continue;const sk=Math.floor(s.seed*1e6);lay[s.kind].add(Math.floor(hsh(sk,8801,1)*4));faces.add(Math.floor(hsh(sk,8803,2)*4));if(s.kind==='castle'&&!castle)castle=s;}
  info('ruin layouts seen: towers',lay.tower.size,'keeps',lay.keep.size,'castles',lay.castle.size,'; facings',faces.size);
  assert(lay.tower.size>=3&&lay.keep.size>=3&&lay.castle.size>=3&&faces.size===4,'watchtowers, keeps and castles each come in at least three layouts, facing all four ways');
  gen(castle.X,castle.Z);let st=0;for(let dx=-castle.R;dx<=castle.R;dx++)for(let dz=-castle.R;dz<=castle.R;dz++)for(let y=castle.g+1;y<=castle.g+castle.H;y++){const id=get(castle.X+dx-OX,y,castle.Z+dz-OZ);if(id===SBRICK||id===COBBLE||id===MOSSY)st++;}
  assert(st>200,castle.name+' stands at X '+castle.X+', Z '+castle.Z+' ('+st+' blocks of stone)');}
// ---- ponds and springs
{let p=null,n=0,sp=0;for(let a=-60;a<60;a++)for(let b=-60;b<60;b++){const t=pondAt(a,b);if(t){n++;if(t.spring)sp++;if(!p&&!t.spring&&t.R>=3)p=t;}}
  info('ponds in 120 x 120 chunks',n,'of them springs',sp);assert(n>=120&&sp>=30,'ponds and springs are found across the lands');
  gen(p.X,p.Z);let w=0,cells=0;for(let dx=-p.R;dx<=p.R;dx++)for(let dz=-p.R;dz<=p.R;dz++)if(Math.hypot(dx,dz)<p.R+0.5){cells++;if(get(p.X+dx-OX,p.h,p.Z+dz-OZ)===WATER&&get(p.X+dx-OX,p.h-1,p.Z+dz-OZ)===WATER)w++;}
  const u=unsound();
  assert(w===cells&&u===0,'a pond at X '+p.X+', Z '+p.Z+' holds its water two deep ('+w+' of '+cells+'), and no water in the window is unsound ('+u+')');}
// ---- hillside streams (with the high lands' waterfalls)
{let f=null,n=0;for(let a=-150;a<150;a++)for(let b=-150;b<150;b++){const t=fallAt(a,b);if(t&&t.stream){n++;if(!f)f=t;}}
  info('hillside streams in 300 x 300 chunks',n);assert(n>=20,'hillside streams run down the hills');
  gen(f.X,f.Z);const run=f.path.slice(0,-1);let w=0;for(const [x,z,h] of run)if(get(x-OX,h+1,z-OZ)===WATER)w++;
  assert(w===run.length&&get(f.end[0]-OX,f.end[2],f.end[1]-OZ)===WATER,'a stream at X '+f.X+', Z '+f.Z+' runs '+run.length+' blocks with water all the way to its pool');}
// ---- rapids: rocks through the water of a river
{let at=null;for(let r=0;r<400&&!at;r+=4)for(let k=0;k<64&&!at;k++){const X=Math.round(Math.cos(k/64*6.283)*r*16),Z=Math.round(Math.sin(k/64*6.283)*r*16);if(colInfo(X,Z,{}).river&&fbm2(X/48,Z/48,1,8947.3)>0.35)at=[X,Z];}
  gen(at[0],at[1]);let rocks=0;for(let z=0;z<D;z++)for(let x=0;x<W;x++){const X=x+OX,Z=z+OZ;if(rapidAt(X,Z)&&get(x,SEA-1,z)!==WATER&&SOLID[get(x,SEA-1,z)])rocks++;}
  info('rapid rocks in the window at X',at[0],'Z',at[1],rocks);assert(rocks>=10,'rocks stand in the river at its rapids');}
// ---- weather by land
{assert(Object.keys(LAND_WX).every(k=>LAND_I[k]!==undefined),'every weather profile names a land');
  const at=k=>{const c=nearestLand(LAND_I[k],0,0,48);gen(c.X,c.Z);PL.x=c.X-OX+0.5;PL.z=c.Z-OZ+0.5;LWX.t=0;for(let i=0;i<300;i++)landWeather(0.1);return {k:LWX.k,fog:LWX.fog,dust:LWX.dust,ta:LWX.ta,storm:LWX.storm,snow:LWX.snow};};
  const bog=at('bog'),tun=at('tundra'),green=at('green'),dry=at('dry');
  info('weather: bog',JSON.stringify(bog),'; dry',JSON.stringify(dry),'; tundra',JSON.stringify(tun),'; green',JSON.stringify(green));
  assert(bog.fog>0.4&&dry.dust>0.4&&dry.ta>0.2&&tun.snow===1&&green.fog<0.05,'mist lies on the bogs, dust blows and the sky warms in the drylands, snow falls on the tundra, the green hills stay clear');}
// ---- caves near the surface by land (Q132): ferns and earth under the woods
{const c=nearestLand(LAND_I.birch,0,0,48);gen(c.X,c.Z);let fern=0; // ferns grow nowhere else below the ground
  for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z];for(let y=g-60;y<g-6;y++)if(world[I(x,y,z)]===FERN)fern++;}
  info('ferns in the caves under the Birch Glades',fern);assert(fern>=10,'the caves under a wood are earthy and grow ferns');}
// ---- the old kept lands' landmarks and features
const find=kind=>{for(let r=0;r<50;r++)for(let i=-r;i<=r;i++)for(let j=-r;j<=r;j++){if(Math.max(Math.abs(i),Math.abs(j))!==r)continue;const s=sigOf(stretchCell(landSite(i,j)));if(s&&s.kind===kind)return s;}return null;};
const fd=s=>{const f=Math.floor(s.seed*4);return [[1,0,-1,0][f],[0,1,0,-1][f]];},at=(s,dx,y,dz)=>get(s.X+dx-OX,y,s.Z+dz-OZ),stone=id=>id===STONE||id===MOSSY||id===COBBLE;
for(const [kind,check] of [['hillfort',s=>{const [fx,fz]=fd(s);return at(s,-fx*8,s.g+2,-fz*8)===GRASS;}],['loneoak',s=>at(s,0,s.g+6,0)===LOG],['wshrine',s=>at(s,0,s.g+1,0)===SBRICK],
  ['hollowelder',s=>{const [fx,fz]=fd(s);return at(s,0,s.g+3,0)===AIR&&at(s,-fx*2,s.g+3,-fz*2)===LOG;}],['watchcairn',s=>stone(at(s,0,s.g+5,0))],['tors',s=>at(s,0,s.g+1,0)===STONE],
  ['greatbarrow',s=>{const [fx,fz]=fd(s);return at(s,-2*fx,s.g+1,-2*fz)===GRAVE;}],['stonerows',s=>{let n=0;for(let k=-3;k<=3;k++)for(let y=s.g-3;y<=s.g+4;y++)for(const c of [-3,3]){const [fx,fz]=fd(s);if(stone(at(s,fx*k*3-fz*c,y,fz*k*3+fx*c)))n++;}return n>=12;}],
  ['sunktemple',s=>at(s,0,s.g-2,0)===SBRICK],['fallen',s=>at(s,0,s.g+2,0)===JLOG]]){
  const s=find(kind);assert(s,'a '+kind+' is found');if(!s)continue;gen(s.X,s.Z);assert(check(s),s.name+' stands at X '+s.X+', Z '+s.Z+' in the '+LANDS[LAND_I[s.land]].n);}
