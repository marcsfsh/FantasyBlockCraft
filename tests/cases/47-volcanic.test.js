// The Volcanic Wastes remade (D-051, D-054): a great volcano and lesser ones in the terrain with crater lakes of lava held in rock, flows down their flanks
// and names of their own; rivers of lava that never meet water; fissures; black ash, cinder, crust, charred trees and vents; the
// Ashen Citadel and the Rift of Fire, their lava held; a burning sky with lightning, plumes over the craters and a soundscape.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
// lava below the ground must sit in sound rock (the owner's rule, as in 21-deep)
function unsoundLava(){let n=0;for(let z=1;z<D-1;z++)for(let x=1;x<W-1;x++){const g=ground[x+W*z];for(let y=FIRE_LV+1;y<g-2;y++){const i=I(x,y,z);if(world[i]!==LAVA)continue;
  const cx=Math.floor((x+OX)/CS),cz=Math.floor((z+OZ)/CS);if(ruinZone(cx,cz)||mineZone(cx,cz)||plannedLava(x+OX,y,z+OZ))continue;
  const held=j=>world[j]===LAVA||SOLID[world[j]],rests=j=>held(j-WD),b=i-WD;if(!(held(b)&&(world[b]===LAVA||rests(b))&&[i+1,i-1,i+W,i-W].every(j=>held(j)&&(world[j]===LAVA||rests(j)))))n++;}}return n;}
const count=ids=>{const c={};for(const id of ids)c[id]=0;for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z];for(let y=Math.max(0,g-3);y<Math.min(H,g+14);y++){const id=world[I(x,y,z)];if(c[id]!==undefined)c[id]++;}}return c;};
assert([BLACKASH,CINDER,LAVACRUST,CHARWOOD,SMOULDER,SULFUR,VENT].every(id=>BL[id]&&BL[id].t)&&BL[LAVACRUST].ember&&BL[SMOULDER].lum>0&&BL[VENT].lum>0,'the burnt land\'s blocks are defined, the crust, embers and vents glowing');
// ---- volcanoes
// the great volcano of each stretch (D-054) and the lesser ones, its satellites among them
const gs=new Map();for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const g=greatOf(stretchCell(landSite(i,j)));if(g)gs.set(g.key,g);}
const great=[...gs.values()].sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z)),lesser=[];
for(let i=-57;i<57;i++)for(let j=-57;j<57;j++){const v=volcAt(i,j);if(v)lesser.push(v);}for(const g of great)lesser.push(...g.sats);
let stretches=new Set();for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const c=stretchCell(landSite(i,j));if(LANDS[cellLand(c)].k==='volcanic')stretches.add(landKey(c.i,c.j));}
info('volcanic stretches within 8000 blocks',stretches.size,'; great volcanoes',great.length,'; lesser volcanoes',lesser.length,'; the nearest great:',great.slice(0,3).map(v=>v.name+' at X '+v.X+' Z '+v.Z+', '+v.Hv+' high, '+v.R+' across the foot, '+v.sats.length+' lesser about it').join('; '));
assert(great.length>=stretches.size-2&&great.every(v=>v.Hv>=80&&v.R>=80&&v.rimTop-v.lake>=10&&!isBlockedName(v.name.replace('The Burning Mountain of ',''))),'nearly every stretch of the wastes has a great volcano near its middle, at least 80 high, named');
assert(lesser.length>=great.length*2&&lesser.every(v=>v.Hv>=18&&v.Hv<great[0].Hv*0.5&&v.rimTop-v.lake>=7&&!isBlockedName(v.name)),'lesser volcanoes rise about them, at most half as high, each with a crater deeper than its lake');
assert(great.filter(g=>g.sats.length+lesser.filter(v=>!v.sat&&Math.hypot(v.X-g.X,v.Z-g.Z)<420).length>=2).length>=great.length*0.6,'most stretches hold several volcanoes about the great one');
const vs=great;
// (measured in the cone's own frame, D-056: its foot is warped and its crater stands off its middle)
{const v=vs[0],S=volcShape(v);gen(v.X,v.Z);const at=(X,y,Z)=>get(X-OX,y,Z-OZ);let lake=0,flank=0,rimLow=0,rimN=0;
  for(let dx=-v.R;dx<=v.R;dx++)for(let dz=-v.R;dz<=v.R;dz++){if(Math.hypot(dx,dz)>v.R*1.1)continue;const d=volcFrame(v,S,v.X+dx,v.Z+dz)[0];if(d>v.R)continue;
    if(d<v.rc*0.7&&at(v.X+dx,v.lake,v.Z+dz)===LAVA)lake++;
    if(d>v.rc*1.3){for(let y=v.base-6;y<=v.rimTop;y++)if(at(v.X+dx,y,v.Z+dz)===LAVA){flank++;break;}}
    if(d>=v.rc*1.05&&d<v.rc*1.25){rimN++;if(ground[(v.X+dx-OX)+W*(v.Z+dz-OZ)]<v.lake+1)rimLow++;}}
  const u=unsoundLava(),name=surfaceName(v.X,v.lake,v.Z);
  info(v.name,': lake lava',lake,'; flank columns with lava',flank,'; rim columns at or below the lake',rimLow,'of',rimN,'(the breaches); unsound lava',u);
  assert(lake>30&&flank>40&&rimLow<rimN*0.25&&u===0,v.name+' holds a lake of lava in its crater, spills it through breaches down its flanks, and its lava is held');
  // no great volcano is a perfect cone: its foot is warped, its crater off its middle, its flanks uneven
  const o={},foot=[],mid=[];for(let k=0;k<32;k++){const a=k/32*6.2832;let fd=0;for(let r=v.R*0.4;r<v.R*1.5;r+=3){colInfo(Math.round(v.X+Math.cos(a)*r),Math.round(v.Z+Math.sin(a)*r),o);if(o.h<v.base+v.Hv*0.15){fd=r;break;}}foot.push(fd);
    colInfo(Math.round(v.X+Math.cos(a)*v.R*0.5),Math.round(v.Z+Math.sin(a)*v.R*0.5),o);mid.push(o.h);}
  const fr=Math.max(...foot)/Math.max(1,Math.min(...foot)),mr=(Math.max(...mid)-Math.min(...mid))/v.Hv,off=Math.hypot(S.ox,S.oz);
  info(v.name,': the foot reaches',Math.min(...foot),'to',Math.max(...foot),'from the middle; halfway out the flanks stand',Math.min(...mid),'to',Math.max(...mid),'; the crater',off.toFixed(1),'off the middle');
  assert(fr>1.2&&mr>0.2&&off>v.R*0.04,v.name+' is no perfect cone: its foot warped, its flanks uneven, its crater off its middle');
  assert(name===v.name,'the volcano is a place of its own name ('+name+')');
  const c=count([BLACKASH,CINDER,LAVACRUST,CHARWOOD,SMOULDER,VENT,SULFUR,ASH,LAVA]);info('around it',Object.entries(c).map(([k,n])=>nameOf(+k)+' '+n).join(', '));
  assert(c[BLACKASH]>5000&&c[CINDER]>2000&&c[LAVACRUST]>500&&c[CHARWOOD]>40&&c[LAVA]>500,'the land around is black ash and cinder, crusted lava, lava and charred trees');}
// ---- rivers of lava, and no lava touching water
// (in the sunken wastes, D-055, the rivers' level o.sl lies WB_DEP below the sea's)
{const o={};let rv=null;for(let d=0;d<4000&&!rv;d+=16)for(let a=0;a<48&&!rv;a++){const X=Math.round(vs[0].X+Math.cos(a/48*6.283)*d),Z=Math.round(vs[0].Z+Math.sin(a/48*6.283)*d);colInfo(X,Z,o);if(o.river&&o.wVolc>0.7&&o.h<o.sl-1)rv=[X,Z,o.sl];}
  gen(rv[0],rv[1]);let lavaR=0,water=0,touch=0;const SL=rv[2];
  for(let z=1;z<D-1;z++)for(let x=1;x<W-1;x++)for(let y=SL-8;y<=SL;y++){const id=world[I(x,y,z)];if(id===WATER)water++;if(id!==LAVA)continue;if(y===SL)lavaR++;for(const j of [I(x+1,y,z),I(x-1,y,z),I(x,y,z+1),I(x,y,z-1),I(x,y+1,z)])if(world[j]===WATER)touch++;}
  info('lava river near X',rv[0],'Z',rv[1],': lava at the surface',lavaR,'; water in the window',water,'; lava touching water',touch,'; unsound lava',unsoundLava());
  assert(lavaR>100&&touch===0&&unsoundLava()===0,'the rivers of the Volcanic Wastes run with lava, which never touches water and is held');}
// ---- the sunken wastes (D-055): each basin at least 750 across, its floor about 90 below the lands about it, walled by a ring of
// ash mountains about 90 above them; nothing in it is water, and its lava is held
{const o={},med=a=>{a.sort((p,q)=>p-q);return a[a.length>>1];};const rows=[];
  for(const g of great.slice(0,6)){const edge=[];let fl=[],cr=[],out=[];
    for(let k=0;k<16;k++){const th=k/16*6.2832,ux=Math.cos(th),uz=Math.sin(th);let e=-1,top=0,ok=true;
      for(let d=0;d<1400;d+=6){colInfo(Math.round(g.X+ux*d),Math.round(g.Z+uz*d),o);
        if(e<0){if(o.bs>=0)e=d;else if(d>g.R*1.35&&o.vs===0&&!o.river&&!o.vflow)fl.push(o.h);}
        else if(d<e+WB_IN+WB_CR+30)top=Math.max(top,o.h);
        else if(d>e+WB_END+30&&d<e+WB_END+150&&o.wS<0.05&&o.wVolc<0.2)out.push(o.h);
        if(e<0&&d>=1394)ok=false;}
      edge.push(e<0?1400:e);if(ok&&e>=0)cr.push(top);}
    let across=1e9;for(let k=0;k<8;k++)across=Math.min(across,edge[k]+edge[k+8]);
    rows.push({n:g.name,across:across,floor:med(fl),crest:med(cr),out:out.length?med(out):null});}
  info('basins:',rows.map(q=>q.n.replace('The Burning Mountain of ','')+' '+q.across+' across, floor '+q.floor+', crest '+q.crest+', lands about '+q.out).join('; '));
  assert(rows.every(q=>q.across>=750),'every basin of the wastes is at least 750 blocks across its floor');
  const wo=rows.filter(q=>q.out!==null);
  const dn=med(wo.map(q=>q.out-q.floor)),up=med(wo.map(q=>q.crest-q.out));info('median: the floor',dn,'below the lands about, the crest',up,'above them');
  assert(wo.length>=3&&dn>=75&&dn<=105&&up>=70&&up<=125&&wo.every(q=>q.out-q.floor>=60&&q.crest-q.out>=35&&q.crest-q.floor>=150),'the floor lies about 90 below the lands about it, the ring about 90 above them: up some 90 to the crest and down some 180 to the floor');
  // a window on the ring's inner wall: no water on the ground inside the ring (water in the caves under it is held as anywhere), lava held
  const g=great[0];let wx=0,wz=0;for(let d=0;d<1400;d+=4){colInfo(g.X+d,g.Z,o);if(o.bs>=WB_IN*0.5){wx=g.X+d;wz=g.Z;break;}}
  gen(wx,wz);let water=0,dry=0;for(let z=0;z<D;z++)for(let x=0;x<W;x++){colInfo(x+OX,z+OZ,o);if(o.sl>=SEA)continue;dry++;for(let y=ground[x+W*z]-2;y<ground[x+W*z]+40;y++)if(world[I(x,y,z)]===WATER)water++;}
  const u=unsoundLava();info('on the ring near X',wx,'Z',wz,': columns inside the ring',dry,'; water there',water,'; unsound lava',u);
  assert(dry>1000&&water===0&&u===0,'inside the ring nothing on the ground is water, and the lava is held');}
// ---- fissures
{const o={};let n=0;for(let X=-6000;X<6000;X+=7)for(let Z=-200;Z<200;Z+=7){colInfo(X,Z,o);if(o.vfis)n++;}assert(n>0,'fissures split the plains ('+n+' columns sampled)');}
// ---- the citadel and the rift
const find=kind=>{for(let r=0;r<40;r++)for(let i=-r;i<=r;i++)for(let j=-r;j<=r;j++){if(Math.max(Math.abs(i),Math.abs(j))!==r)continue;const s=sigOf(stretchCell(landSite(i,j)));if(s&&s.kind===kind)return s;}return null;};
{const s=find('citadel');gen(s.X,s.Z);const at=(dx,y,dz)=>get(s.X+dx-OX,y,s.Z+dz-OZ);let moat=0;for(let a=-15;a<=15;a++)for(const b of [-15,15])if(at(a,s.g-1,b)===LAVA)moat++;
  info(s.name,'at X',s.X,'Z',s.Z,'; moat lava',moat,'; unsound lava',unsoundLava());
  assert(at(0,s.g+41,0)===MAGMA&&at(0,s.g+20,3)!==AIR&&moat>20&&unsoundLava()===0,'the Ashen Citadel stands, its spire crowned with fire forty blocks up, ringed by a moat of lava held in rock');}
{const s=find('rift');gen(s.X,s.Z);let lava=0,lv=new Set();for(let dx=-14;dx<=14;dx++)for(let dz=-14;dz<=14;dz++)for(let y=s.g-30;y<s.g-15;y++)if(get(s.X+dx-OX,y,s.Z+dz-OZ)===LAVA){lava++;lv.add(y);}
  info(s.name,'at X',s.X,'Z',s.Z,'; lava',lava,'at levels',[...lv].sort().join(' '),'; unsound lava',unsoundLava());
  assert(lava>20&&lv.size===2&&unsoundLava()===0,'the Rift of Fire has a river of lava at its bottom, level and held');}
// ---- sky, lightning, plumes and sound
{const v=vs[0];gen(v.X+v.R+30,v.Z);PL.x=v.X+v.R+30-OX+0.5;PL.z=v.Z-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+2;landWeatherNow();
  assert(LWX.k==='volcanic'&&LWX.burn===1&&LAND_WX.volcanic.ash,'the sky burns over the Volcanic Wastes, with ash on the wind');
  const b=strike(false);assert(b.segs.length>=18&&bolts.includes(b),'lightning strikes, a bolt of '+b.segs.length+' segments with its branches');
  for(let i=0;i<30;i++)updBolts(0.05);assert(!bolts.includes(b),'and is gone in a moment');
  updPlumes(0.1);assert(plumes.size>=1&&[...plumes.values()][0].puffs.length===PUFFS,'smoke rises over the crater nearby');
  const P=ambLand('volcanic');assert(P.rumble>0&&P.day.crackle>0&&P.day.boom>0,'the ground rumbles, embers crackle and far eruptions boom');}
// ---- the wastes' dark rock keeps its definition (D-059): every dark block of the wastes is painted bright enough, with enough
// contrast inside its face, that the burning light does not turn it to black; and the burning sky dims the day but leaves a red
// glow by night (its strength, skyMul; its red tint is a three.js colour, which the harness stands in for)
{const lum=(t,x,y)=>{const i=((((t/AC)|0)*16+y)*AW+(t%AC)*16+x)*4;return 0.299*dat[i]+0.587*dat[i+1]+0.114*dat[i+2];};
  const stat=t=>{let s=0,q=0;for(let y=0;y<16;y++)for(let x=0;x<16;x++){const l=lum(t,x,y);s+=l;q+=l*l;}const m=s/256;return [m,Math.sqrt(Math.max(0,q/256-m*m))];};
  const dark={BLACKASH,CINDER,LAVACRUST,CHARWOOD,BASALT,OBSID,BLACKSAND,SCORCH,BASBRICK,BASCRACK,BASTILE,BASCARVE,OBSBRICK,BASPILLAR},rows=[];let bad=[];
  for(const [n,id] of Object.entries(dark))for(const t of new Set(BL[id].t)){const [m,sd]=stat(t);rows.push(n+' '+t+': '+Math.round(m)+' ±'+Math.round(sd));if(m<(id===OBSID||id===OBSBRICK?40:50)||sd<8)bad.push(n+' '+t);}
  info('dark blocks, mean brightness ± spread:',rows.join('; '));
  assert(!bad.length,'the wastes\' dark blocks are bright enough, and varied enough inside a face, to keep their definition'+(bad.length?' (not: '+bad.join(', ')+')':''));
  const keep=[U.skyMul.value,U.skyTint.value.clone(),LWX.burn];LWX.burn=1;
  U.skyMul.value=1;burnSkyTick(1);const day=U.skyMul.value;U.skyMul.value=0.16;burnSkyTick(0);const night=U.skyMul.value;
  U.skyMul.value=keep[0];U.skyTint.value.copy(keep[1]);LWX.burn=keep[2];
  info('the burning sky\'s light (skyMul): by day',day.toFixed(2),'of plain daylight; by night',night.toFixed(2),'(plain night 0.16)');
  assert(day>=0.7&&night>=0.3,'under the burning sky the day is dimmed but not dark, and the night keeps a red glow');}
