// Lava down the gullies and the orcs' places on the wastes (D-064). Most gullies of the volcanoes carry a stream of lava along
// their flat floors from high on the flank to the foot (the rest a floor of glowing crust), none on the quarter the mountain's
// fortress faces, the lava held. On the open floor of the wastes stand war camps, watchtowers, forges and fighting pits of the
// orcs: planned purely, apart from each other and from the volcanoes, flows, landmarks and the goblins' camps; built of black
// palisade, hide, riveted iron and basalt; named in the readout and the journal; peopled with orcs.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const at=(X,y,Z)=>get(X-OX,y,Z-OZ);
function unsoundLava(){let n=0;for(let z=1;z<D-1;z++)for(let x=1;x<W-1;x++){const g=ground[x+W*z];for(let y=FIRE_LV+1;y<g-2;y++){const i=I(x,y,z);if(world[i]!==LAVA)continue;
  const cx=Math.floor((x+OX)/CS),cz=Math.floor((z+OZ)/CS);if(ruinZone(cx,cz)||mineZone(cx,cz)||plannedLava(x+OX,y,z+OZ))continue;
  const held=j=>world[j]===LAVA||SOLID[world[j]],rests=j=>held(j-WD),b=i-WD;if(!(held(b)&&(world[b]===LAVA||rests(b))&&[i+1,i-1,i+W,i-W].every(j=>held(j)&&(world[j]===LAVA||rests(j)))))n++;}}return n;}
const o={};
// ---- the gullies of the nearest great volcano: lava in most, crust in the rest, none toward its fortress
{const gs=new Map();for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const g=greatOf(stretchCell(landSite(i,j)));if(g)gs.set(g.key,g);}
  const v=[...gs.values()].sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0],F=fortOf(v),fq=fortQuarters(v)[0].th;
  const lavaG=new Set(),crustG=new Set();let lava=0,nearFort=0,ring=0;
  for(let a=0;a<6.2832;a+=0.003){const X=Math.round(v.X+Math.cos(a)*v.R*0.62),Z=Math.round(v.Z+Math.sin(a)*v.R*0.62);colInfo(X,Z,o);ring++;
    const S=volcShape(v),[d,th]=volcFrame(v,S,X,Z);volcCone(v,S,d,th,X,Z);if(o.vgul){lava++;lavaG.add(VCG.k);if(Math.abs(angDiffV(th,fq))<0.36)nearFort++;}else if(o.vcrust&&VCG.lat<VCG.fw)crustG.add(VCG.k);}
  info(v.name,': on a ring halfway down its flank,',lava,'of',ring,'samples on gully lava, in',lavaG.size,'gullies; crust floors in',crustG.size,'; lava toward the fortress',nearFort,'; fortress faces',F?Math.atan2(F.oz,F.ox).toFixed(2):'-','(quarter',fq.toFixed(2)+')');
  assert(lavaG.size>=8&&lavaG.size>crustG.size&&nearFort===0,'most of the great volcano\'s gullies carry lava, the rest glowing crust, none toward its fortress');
  assert(F&&Math.abs(angDiffV(Math.atan2(F.oz,F.ox),fq))<0.01,'its fortress faces the quarter the gullies keep clear of');
  // in the world: a stretch of one gully, lava a block down in its floor between steep sides, the lava held
  let gx=0,gz=0;for(let a=0;a<6.2832&&!gx;a+=0.003){const X=Math.round(v.X+Math.cos(a)*v.R*0.62),Z=Math.round(v.Z+Math.sin(a)*v.R*0.62);colInfo(X,Z,o);if(o.vgul){gx=X;gz=Z;}}
  gen(gx,gz);let top=0,banks=0,n=0;for(let dx=-12;dx<=12;dx++)for(let dz=-12;dz<=12;dz++){const X=gx+dx,Z=gz+dz;colInfo(X,Z,o);if(!o.vgul)continue;n++;const h=o.h;if(at(X,h,Z)===LAVA)top++;}
  const u=unsoundLava();info('a gully at X',gx,'Z',gz,': gully lava columns',n,'; lava on top',top,'; unsound lava',u);
  assert(n>10&&top===n&&u===0,'the gully\'s floor holds a stream of lava, and the lava is held');}
// ---- the orcs' places in a stretch of the wastes
const ps=[],kinds={};{const t0=process.hrtime.bigint();for(let i=Math.floor(1500/ORC_C);i<=Math.floor(4200/ORC_C);i++)for(let j=Math.floor(-1200/ORC_C);j<=Math.floor(1500/ORC_C);j++){const p=orcAt(i,j);if(p){ps.push(p);kinds[p.kind]=(kinds[p.kind]||0)+1;}}
  const ms=Number(process.hrtime.bigint()-t0)/1e6;
  info('orcs\' places in the wastes between X 1500 and 4200, Z -1200 and 1500:',ps.length,JSON.stringify(kinds),'; planned in',Math.round(ms),'ms; for example',ps.slice(0,4).map(p=>p.name).join(', '));
  assert(ps.length>=15&&['camp','tower','forge','pit'].every(k=>kinds[k]>=1),'war camps, watchtowers, forges and fighting pits of the orcs stand across the wastes');
  assert(ps.every(p=>!isBlockedName(p.name.replace(/^The (War Camp|Watch|Forge|Fighting Pit) of /,''))),'no name of theirs is one of Tolkien\'s');
  let clash=0;for(const p of ps){for(const q of ps)if(q!==p&&Math.hypot(q.X-p.X,q.Z-p.Z)<q.R+p.R+14)clash++;
    for(const v of volcanoesNear(p.X,p.Z,p.R+60))if(Math.hypot(v.X-p.X,v.Z-p.Z)<(v.great?v.R*1.15:v.R*0.95)+p.R*0.5)clash++;
    if(sigNear(p.X,p.Z,p.R+8)||siteNear(p.X,p.Z,p.R)||fortsNear(p.X,p.Z,p.R).length||warrenSpots(p.X,p.Z,p.R+8).some(s=>s.kind==='camp'))clash++;
    for(let k=0;k<16;k++){const a=k*0.3927;colInfo(Math.round(p.X+Math.cos(a)*p.R),Math.round(p.Z+Math.sin(a)*p.R),o);if(o.vflow||o.river||o.vfis||o.vlake||o.h<o.sl+3)clash++;}}
  assert(clash===0,'they keep apart, off the volcanoes, flows, rivers and fissures, the landmarks, the old sites, the fortresses and the goblins\' camps ('+clash+' clashes)');
  const p0=ps[0],key=JSON.stringify([p0.kind,p0.X,p0.Z,p0.g,p0.name,p0.dir]);orcC.clear();orcCandC.clear();const p1=orcAt(p0.i,p0.j);
  assert(p1&&JSON.stringify([p1.kind,p1.X,p1.Z,p1.g,p1.name,p1.dir])===key,'a place planned again from nothing is the same');}
const near=k=>ps.filter(p=>p.kind===k).sort((a,b)=>Math.hypot(a.X-2308,a.Z+175)-Math.hypot(b.X-2308,b.Z+175))[0];
const tally=(p,ids,m)=>{const c={};for(const id of ids)c[id]=0;for(let X=p.X-p.R-(m||0);X<=p.X+p.R+(m||0);X++)for(let Z=p.Z-p.R-(m||0);Z<=p.Z+p.R+(m||0);Z++)for(let y=p.g-8;y<p.g+22;y++){const id=at(X,y,Z);if(c[id]!==undefined)c[id]++;}return c;};
const names=c=>Object.entries(c).map(([id,n])=>nameOf(+id)+' '+n).join(', ');
// a war camp: its palisade, gate towers, tents, the fire, poles of skulls, banners and fire baskets; named; peopled
{const p=near('camp');gen(p.X,p.Z);const c=tally(p,[ORCLOG,STAKES,HIDE,MAGMA,SKULLS,BANNER,BRAZIER,SPIKES,GRATE,CHARWOOD]),o2=orcFrame(p);
  let open=0;for(let v=-1;v<=1;v++){const X=o2.wx(-17,v),Z=o2.wz(-17,v),h=hAt(X,Z);if(at(X,h+1,Z)===AIR&&at(X,h+2,Z)===AIR)open++;}
  info(p.name,'at X',p.X,'Z',p.Z,':',names(c),'; the gateway open',open,'of 3; unsound lava',unsoundLava());
  assert(c[ORCLOG]>300&&c[STAKES]>40&&c[HIDE]>150&&c[MAGMA]>=1&&c[SKULLS]>=4&&c[BANNER]>=3&&c[BRAZIER]>=4&&c[GRATE]>=8&&open===3,'a war camp stands behind its black palisade, with gate towers, tents of hide, a fire, poles of skulls, banners and fire baskets, its gateway open');
  assert(surfaceName(p.X,p.g+1,p.Z)===p.name&&BL[ORCLOG]&&BL[ORCIRON],'the readout names it');
  setMode('survival');playing=true;hp=20;dead=false;settings.time='day';for(const f of [...foes])removeFoe(f);foeSpots.clear();PL.x=p.X-OX+0.5;PL.z=p.Z-OZ+0.5;PL.y=p.g+1;
  const sp=foePlaces().filter(s=>s.kind==='ocamp'||s.kind==='ogate');foeSpawnTick();const orcs=foes.filter(f=>!FOES[f.kind].folk&&f.spot&&String(f.spot)[0]==='o');
  info('spots',sp.map(s=>s.kind).join(', '),'; orcs put out',orcs.map(f=>f.kind).join(', '));
  assert(sp.length===2&&orcs.length>=5&&orcs.every(f=>['raider','bowman','brute','ochief'].includes(f.kind)),'its orcs are about it: at the fire and at the gate');
  discoverTick(1);assert(JN.d.o.includes(p.name),'standing in it, it goes into the journal');
  for(const f of [...foes])removeFoe(f);foeSpots.clear();setMode('creative');}
// a watchtower: its foot of basalt, the stage of palisade and iron, the platform with its fire baskets under a roof of hide, the chain up
{const p=near('tower');gen(p.X,p.Z);const c=tally(p,[BASBRICK,BASCRACK,ORCLOG,ORCIRON,HIDE,BRAZIER,CHAIN,SPIKES,STAKES]);
  info(p.name,'at X',p.X,'Z',p.Z,':',names(c),'; on its platform',nameOf(at(p.X,p.g+12,p.Z)));
  assert(c[ORCIRON]>=20&&c[ORCLOG]>=12&&c[HIDE]>=40&&c[BRAZIER]>=2&&c[CHAIN]>=12&&at(p.X,p.g+12,p.Z)===CHARWOOD&&at(p.X,p.g+13,p.Z)===AIR,'a watchtower rises on its basalt foot to a platform under a roof of hide, a chain to climb');
  const s=orcSpots(p)[0];assert(s.kind==='otower'&&s.y===p.g+12,'its bowmen stand on the platform');}
// a forge: the smelter glowing at its mouth, a trough of lava held in basalt, anvils of riveted iron under an awning
{const p=near('forge');gen(p.X,p.Z);const c=tally(p,[BASBRICK,EMBRICK,MAGMA,LAVA,ORCIRON,HIDE,CHAIN,BASTILE]),u=unsoundLava();
  info(p.name,'at X',p.X,'Z',p.Z,':',names(c),'; unsound lava',u);
  assert(c[EMBRICK]>=16&&c[MAGMA]>=9&&c[LAVA]===10&&c[ORCIRON]>=3&&c[HIDE]>=70&&c[CHAIN]>=3&&u===0,'a forge has its smelter, a trough of lava held in basalt, anvils under an awning hung with chains');}
// a fighting pit: four blocks down, walled in basalt, spikes along its rim, cages in its wall, a chain to climb out
{const p=near('pit');gen(p.X,p.Z);const c=tally(p,[BASBRICK,BASCRACK,SPIKES,GRATE,CHAIN,BRAZIER,SKULLS]);
  info(p.name,'at X',p.X,'Z',p.Z,':',names(c),'; the floor at',p.g-4,'is',nameOf(at(p.X,p.g-4,p.Z)),'; above it',nameOf(at(p.X,p.g-3,p.Z)));
  assert(c[SPIKES]>=30&&c[GRATE]>=12&&c[CHAIN]>=4&&[CINDER,BLACKASH].includes(at(p.X,p.g-4,p.Z))&&at(p.X,p.g-3,p.Z)===AIR,'a fighting pit is sunk four blocks, walled, its rim set with spikes, cages in its wall');
  assert(orcSpots(p)[0].kind==='opit'&&orcSpots(p)[0].y===p.g-4,'its fighters stand on its floor');}
// the new blocks keep their definition under the burning light (D-059)
{const lum=(t,x,y)=>{const i=((((t/AC)|0)*16+y)*AW+(t%AC)*16+x)*4;return 0.299*dat[i]+0.587*dat[i+1]+0.114*dat[i+2];};
  const stat=t=>{let s=0,q=0;for(let y=0;y<16;y++)for(let x=0;x<16;x++){const l=lum(t,x,y);s+=l;q+=l*l;}const m=s/256;return [m,Math.sqrt(Math.max(0,q/256-m*m))];};
  const rows=[];let bad=0;for(const id of [ORCLOG,ORCIRON])for(const t of new Set(BL[id].t)){const [m,sd]=stat(t);rows.push(nameOf(id)+' '+t+': '+Math.round(m)+' ±'+Math.round(sd));if(m<50||sd<8)bad++;}
  info('new blocks, mean brightness ± spread:',rows.join('; '));assert(!bad,'the orcs\' new blocks are bright enough and grained enough to keep their definition');}
