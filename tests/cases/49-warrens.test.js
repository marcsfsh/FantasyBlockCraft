// The goblin warrens and the Emberlords' fortresses (D-052): under the Volcanic Wastes the crawlways and upper caves are a
// warren of halls on two levels,
// joined by tunnels, with ways in from the surface (a goblin camp before each) and a way down to the caves below. Its rock
// is volcanic, its halls hold huts, stores, pens, forges, shrines and a chief's throne, its lava is held in rock.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
function unsoundLava(){let n=0;for(let z=1;z<D-1;z++)for(let x=1;x<W-1;x++){const g=ground[x+W*z];for(let y=FIRE_LV+1;y<g-2;y++){const i=I(x,y,z);if(world[i]!==LAVA)continue;
  const cx=Math.floor((x+OX)/CS),cz=Math.floor((z+OZ)/CS);if(ruinZone(cx,cz)||mineZone(cx,cz)||plannedLava(x+OX,y,z+OZ))continue;
  const held=j=>world[j]===LAVA||SOLID[world[j]],rests=j=>held(j-WD),b=i-WD;if(!(held(b)&&(world[b]===LAVA||rests(b))&&[i+1,i-1,i+W,i-W].every(j=>held(j)&&(world[j]===LAVA||rests(j)))))n++;}}return n;}
// the warren regions near the middle of the world
const regs=[];for(let rx=-40;rx<40;rx++)for(let rz=-40;rz<40;rz++)if(warRegion(rx,rz))regs.push([rx,rz]);
regs.sort((a,b)=>Math.hypot(a[0],a[1])-Math.hypot(b[0],b[1]));
info('warren regions within 6400 blocks',regs.length,'; nearest',regs.slice(0,4).map(r=>r.join(',')).join(' '));
assert(regs.length>=4,'warrens lie under the Volcanic Wastes');
const plans=regs.slice(0,8).map(([rx,rz])=>caveBase(rx,rz));
const sum=B=>{const H2=B.war.halls.map(ni=>B.ch[B.nodes[ni].ch]);return B.war.name+': '+H2.length+' halls ('+H2.map(c=>c.wk+'@'+c.f+(c.chan?'~':'')).join(' ')+'), '+B.war.ents.length+' ways in, way down '+(B.war.down>=0?'at y '+Math.round(B.nodes[B.war.down].y):'none')+', tunnels '+B.edges.filter(e=>e.war).length+', falls '+B.falls.filter(f=>H2.some(c=>c.f<=f.fe&&f.fe<=c.f+3)).length;};
plans.slice(0,5).forEach(B=>info(sum(B)));
const good=plans.filter(B=>B.war.halls.length>=4&&B.war.ents.length>=1&&B.war.down>=0);
assert(good.length>=plans.length*0.75,'nearly every warren has at least four halls, a way in and a way down ('+good.length+' of '+plans.length+')');
assert(plans.every(B=>B.war.halls.every(ni=>{const c=B.ch[B.nodes[ni].ch];return c.f>=212&&c.f+c.h<=hAt(Math.floor(c.x),Math.floor(c.z))-10;})),'every hall lies between y 212 and ten blocks under the ground');
assert(plans.every(B=>B.edges.every(e=>e.war||e.pts.every((v,k)=>k%4!==1||v<WAR_Y0-8))),'no other cave passage climbs into a warren\'s band');
assert(plans.some(B=>B.war.halls.some(ni=>B.ch[B.nodes[ni].ch].chan)),'some halls have a channel of lava');
assert(!isBlockedName(plans[0].war.name.replace('The Warrens of ','')),'warrens have goblin names');
// the nearest warren built: its rock, its halls, its lava held, its camps
{const B=good[0],c=B.ch[B.nodes[B.war.halls[0]].ch];gen(Math.round(c.x),Math.round(c.z));
  const at=(X,y,Z)=>get(X-OX,y,Z-OZ),cnt={};
  for(let X=Math.floor(c.x-c.a-3);X<=c.x+c.a+3;X++)for(let Z=Math.floor(c.z-c.b-3);Z<=c.z+c.b+3;Z++)for(let y=c.f-1;y<=c.f+c.h+1;y++){const id=at(X,y,Z);if(id!==AIR){cnt[id]=(cnt[id]||0)+0;continue;}cnt[AIR]=(cnt[AIR]||0)+1; // what bounds and fills the open space
    for(const [a,b,e] of [[0,-1,0],[0,1,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]]){const q=at(X+a,y+b,Z+e);if(q!==AIR)cnt[q]=(cnt[q]||0)+1;}}
  const n=ids=>ids.reduce((s,id)=>s+(cnt[id]||0),0);
  info(c.wk,'hall at X',Math.round(c.x),'y',c.f,'Z',Math.round(c.z),':',[BASALT,CINDER,BLACKASH,MAGMA,LAVACRUST,OBSID,SULFUR,LAVA,TORCH,CHARWOOD,HIDE,SKULLS,BANNER,BONES,GOLDB,DWCHEST,CRATE,BARREL,GRATE,STONE].map(id=>nameOf(id)+' '+(cnt[id]||0)).join(', '));
  assert(n([BASALT,CINDER,BLACKASH,OBSID])>n([STONE])*1.5,'the warren is cut in volcanic rock, not grey stone');
  assert(n([TORCH,MAGMA,LAVACRUST,LAVA])>8&&n([BANNER,SKULLS,BONES,CHARWOOD])>6,'it is lit by fire and furnished by goblins');
  assert(c.wk!=='chief'||(n([GOLDB])>=2&&n([DWCHEST])>=1),'the chief\'s hall holds a throne and a hoard');
  const u=unsoundLava();info('unsound lava in the window',u);assert(u===0,'every lava block in the warren is held in rock');
  const name=layerName(c.f+2,Math.round(c.x),Math.round(c.z));assert(name===B.war.name,'underground there the readout names the warren ('+name+')');
  const e=B.war.ents[0];gen(Math.round(e.cx),Math.round(e.cz));let camp=0;for(let X=Math.floor(e.cx)-12;X<=e.cx+12;X++)for(let Z=Math.floor(e.cz)-12;Z<=e.cz+12;Z++)for(let y=e.cy-3;y<e.cy+5;y++){const id=at(X,y,Z);if(id===HIDE||id===SKULLS||id===BANNER||id===CHARWOOD)camp++;}
  info('camp before the way in at X',Math.round(e.cx),'Z',Math.round(e.cz),(e.flat?'(a pit)':'(a mouth)'),': hide, skulls, banners and stakes',camp,'; unsound lava',unsoundLava());
  assert(camp>20&&unsoundLava()===0,'a goblin camp stands before the way in');}
// every channel in several warrens is held, built
{let hc=0,bad=0;for(const B of plans.slice(0,6))for(const ni of B.war.halls){const c=B.ch[B.nodes[ni].ch];if(!c.chan)continue;hc++;gen(Math.round(c.x),Math.round(c.z));
  let lava=0;for(let X=Math.floor(c.x-c.a);X<=c.x+c.a;X++)for(let Z=Math.floor(c.z-c.b);Z<=c.z+c.b;Z++)if(get(X-OX,c.f-1,Z-OZ)===LAVA)lava++;const u=unsoundLava();if(u||lava<6)bad++;
  info('channel in',c.wk,'hall at X',Math.round(c.x),'Z',Math.round(c.z),': lava',lava,'; unsound',u);if(hc>=4)break;}
  assert(hc>=2&&bad===0,'channels of lava cross the halls\' floors, held in rock');}
// ---- the Emberlords' fortresses in the great volcanoes
{const vs=[];for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const v=volcAt(i,j);if(v)vs.push(v);}vs.sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z));
  const fs=vs.map(fortOf).filter(Boolean);info('fortresses in',fs.length,'of',vs.length,'volcanoes:',fs.slice(0,4).map(F=>F.name+' in '+F.v.name+' (gate X '+F.GX+' Z '+F.GZ+', hall '+F.Lh+' deep, '+F.Hh+' high, '+F.Dd+' down)').join('; '));
  assert(fs.length>=vs.length/2&&fs.every(F=>!isBlockedName(F.lord)),'most great volcanoes hold an Emberlord\'s fortress, its lord named');
  const F=fs[0],S=fortSpots(F),at=(X,y,Z)=>get(X-OX,y,Z-OZ);gen(Math.round(S.hall.x),Math.round(S.hall.z));let bb=0,eb=0,lava=0;
  for(let X=F.box[0];X<=F.box[1];X++)for(let Z=F.box[2];Z<=F.box[3];Z++){const [u,v]=fortUV(F,X,Z);for(let y=F.box[4];y<=F.box[5];y++){const id=at(X,y,Z);if(id===BASBRICK)bb++;else if(id===EMBRICK)eb++;else if(id===LAVA&&y===fortFloor(F,u)-1&&fortLavaUV(F,u,v))lava++;}}
  const thr=at(Math.floor(S.lord.x+F.ox*-9),F.Fh+3,Math.floor(S.lord.z+F.oz*-9)),u=unsoundLava();
  info(F.name,': basalt bricks',bb,'; ember bricks',eb,'; lava in its troughs',lava,'; the throne',nameOf(thr),'; unsound lava',u,'; named there',layerName(F.Fh+2,Math.floor(S.hall.x),Math.floor(S.hall.z)));
  assert(bb>5000&&eb>300&&lava>30&&thr===OBSID&&u===0,'the fortress stands: gate, towers, a hall in, a throne hall with rivers of lava held in its floor and an obsidian throne');
  assert(layerName(F.Fh+2,Math.floor(S.hall.x),Math.floor(S.hall.z))===F.name&&surfaceName(F.GX+F.ox*6,F.Fy,F.GZ+F.oz*6)===F.name,'within and before it the readout names the fortress');}
