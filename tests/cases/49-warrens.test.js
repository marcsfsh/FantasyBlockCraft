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
assert(plans.every(B=>B.war.halls.every(ni=>{const c=B.ch[B.nodes[ni].ch];return c.f>=130&&c.f+c.h<=hAt(Math.floor(c.x),Math.floor(c.z))-10;})),'every hall lies between y 130 and ten blocks under the ground');
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
// ---- the Emberlord's fortress in each great volcano, warholds of the orcs in some lesser ones (D-054)
{const gs=new Map();for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const g=greatOf(stretchCell(landSite(i,j)));if(g)gs.set(g.key,g);}
  const great=[...gs.values()].sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z)),lesser=[];for(let i=-57;i<57;i++)for(let j=-57;j<57;j++){const v=volcAt(i,j);if(v)lesser.push(v);}for(const g of great)lesser.push(...g.sats);
  const thrones=great.map(fortOf).filter(Boolean),holds=lesser.map(fortOf).filter(Boolean);
  info('Ember Thrones in',thrones.length,'of',great.length,'great volcanoes; warholds in',holds.length,'of',lesser.length,'lesser:',thrones.slice(0,3).map(F=>F.name+' in '+F.v.name+' (gate X '+F.GX+' Z '+F.GZ+', hall '+F.Lh+' deep, '+(2*F.P.hw+1)+' wide, '+F.Hh+' high)').join('; '));
  assert(thrones.length===great.length&&thrones.every(F=>F.great&&F.Hh>=26&&!isBlockedName(F.lord)),'every great volcano holds an Ember Throne, its hall at least 26 high, its lord named');
  assert(holds.length>=2&&holds.every(F=>!F.great&&/Warhold/.test(F.name)),'some lesser volcanoes hold warholds of the orcs');
  const F=thrones[0],S=fortSpots(F),at=(X,y,Z)=>get(X-OX,y,Z-OZ);gen(Math.round(S.hall.x),Math.round(S.hall.z));let bb=0,eb=0,lava=0;
  for(let X=F.box[0];X<=F.box[1];X++)for(let Z=F.box[2];Z<=F.box[3];Z++){const [u,v]=fortUV(F,X,Z);for(let y=F.box[4];y<=F.box[5];y++){const id=at(X,y,Z);if(id===BASBRICK)bb++;else if(id===EMBRICK)eb++;else if(id===LAVA&&y===fortFloor(F,u)-1&&fortLavaUV(F,u,v))lava++;}}
  const E=F.U1+F.Lh,tX=F.GX-F.ox*(E-3),tZ=F.GZ-F.oz*(E-3),thr=at(tX,F.Fh+F.P.steps,tZ),u0=unsoundLava();let room=0;for(let y=F.Fh;y<F.Fh+F.Hh;y++)if(at(Math.floor(S.lord.x),y,Math.floor(S.lord.z))===AIR)room++;
  info(F.name,': basalt bricks',bb,'; ember bricks',eb,'; lava in its troughs',lava,'; the throne',nameOf(thr),'; open above the lord\'s place',room,'; unsound lava',u0,'; named there',layerName(F.Fh+2,Math.floor(S.hall.x),Math.floor(S.hall.z)));
  assert(bb>20000&&eb>1000&&lava>100&&thr===OBSID&&room>=FOES.ember.tall+10&&u0===0,'the Ember Throne stands: towers, a broad way in, a vast throne hall with room for its lord, rivers of lava held in its floor and an obsidian throne');
  assert(layerName(F.Fh+2,Math.floor(S.hall.x),Math.floor(S.hall.z))===F.name&&surfaceName(F.GX+F.ox*6,F.Fy,F.GZ+F.oz*6)===F.name,'within and before it the readout names the fortress');
  // its detail (D-058): weathered and carved masonry, burning script, fire baskets, chains and spikes; a pointed gate; the two
  // guardians before it (each with burning eyes and horns); fire in the towers' pools and behind the grates of the back wall
  {const d=fortD(F),wX=(u,v)=>F.GX-F.ox*u+F.px*v,wZ=(u,v)=>F.GZ-F.oz*u+F.pz*v,A=(u,v,y)=>at(wX(u,v),y,wZ(u,v)),ids=[BASCRACK,BASTILE,BASCARVE,EMGLYPH,OBSBRICK,BASPILLAR,CHAIN,BRAZIER,SPIKES],c={};for(const id of ids)c[id]=0;
    const tally=()=>{for(let X=F.box[0];X<=F.box[1];X++)for(let Z=F.box[2];Z<=F.box[3];Z++)for(let y=F.box[4];y<=F.box[5];y++){const id=at(X,y,Z);if(c[id]!==undefined)c[id]++;}};
    tally();const fallAt=()=>{let n=0;for(let y=F.Fh;y<=F.Fh+d.lfH;y++)if(A(d.E,F.P.lv,y)===LAVA&&A(d.E-1,F.P.lv,y)===GRATE)n++;return n;},fall=fallAt();
    gen(wX(-8,0),wZ(-8,0));tally(); // the front, a window away from the hall (its far end may be counted twice; no matter)
    const openUp=v=>{let y=F.Fy;while(y<F.Fy+F.P.gh+8&&(A(1,v,y)===AIR||A(1,v,y)===GRATE))y++;return y-F.Fy;},g0=openUp(0),g1=openUp(F.P.gw-1);let eyes=0,horns=0,pool=0;
    for(const sd of [-1,1])for(let u=d.us-d.sw;u<=d.us+d.sw;u++)for(let v=d.vs-d.sw-2;v<=d.vs+d.sw+2;v++)for(let y=F.Fy+d.ph;y<=F.Fy+d.ph+13*F.P.k;y++){const id=A(u,sd*v,y);if(id===MAGMA)eyes++;else if(id===OBSID&&y>=F.Fy+d.ph+9*F.P.k)horns++;}
    for(let a=-F.P.ts;a<=F.P.ts;a++)for(let b=-F.P.ts;b<=F.P.ts;b++)if(A(-F.P.ts+b,F.P.tv+a,F.Fy+F.P.th)===LAVA)pool++;
    info(F.name,'detail:',ids.map(id=>nameOf(id)+' '+c[id]).join(', '),'; gate open',g0,'high in the middle and',g1,'at its side; guardians: eye blocks',eyes,', horn blocks',horns,'; tower pool',pool,'; lava behind grates',fall,'; unsound lava at the front',unsoundLava());
    assert(c[BASCRACK]>2000&&c[BASTILE]>2000&&c[BASCARVE]>200&&c[EMGLYPH]>200&&c[OBSBRICK]>2000&&c[BASPILLAR]>300&&c[CHAIN]>50&&c[BRAZIER]>30&&c[SPIKES]>30,'the Ember Throne is built in weathered, carved and burning masonry, with fire baskets, chains and spikes');
    assert(g0>=F.P.gh-1&&g1<g0-3&&eyes>=8&&horns>=8,'its gate is a pointed arch, and guardians with burning eyes and horns stand before it');
    assert(pool>0&&fall===d.lfH+1&&unsoundLava()===0,'fire pools on its towers, and lava stands behind grates in the back wall of its hall, all of it held');
    // relief (D-058): no big face is flat. Grooves down the towers (counted at the front); then, in the hall's window, coffers
    // sunk in the nave's vault, blind arches sunk in the side walls, lancets in the back wall and coffers over the way in
    let groove=0;for(let hy=F.P.ts+2;hy<=F.P.th-5;hy++)for(let a=-F.P.ts+1;a<F.P.ts;a++)if(A(-2*F.P.ts,F.P.tv+a,F.Fy+hy)===AIR)groove++;
    gen(Math.round(S.hall.x),Math.round(S.hall.z));let cof=0,blind=0,lanc=0,wcof=0;
    for(let pu=4;pu<F.Lh-d.dz;pu++){const u=F.U1+pu;for(let v=-d.nw;v<=d.nw;v++)for(let dy=d.sN+2;dy<F.Hh;dy++){const ad=archD(Math.abs(v),dy,d.nw,d.sN,d.rN);if(ad>0.45&&ad<=1.45&&A(u,v,F.Fh+dy)===AIR)cof++;}
      for(const v of [-F.P.hw-1,F.P.hw+1])for(let dy=1;dy<d.sA;dy++)if(A(u,v,F.Fh+dy)===AIR)blind++;}
    for(let v=-F.P.hw;v<=F.P.hw;v++)for(let dy=1;dy<F.Hh;dy++)if(Math.abs(v)>F.P.lv+F.P.k&&A(d.E-1,v,F.Fh+dy)===AIR&&A(d.E-2,v,F.Fh+dy)===AIR)lanc++;
    gen(wX(Math.round(F.U1/2),0),wZ(Math.round(F.U1/2),0));for(let u=8;u<F.U1-8;u++)for(let v=-F.P.cw;v<=F.P.cw;v++)for(let dy=d.sC+2;dy<=F.P.ch+2;dy++){const fl=fortFloor(F,u),ad=archD(Math.abs(v),dy,F.P.cw,d.sC,d.rC);if(ad>0.45&&ad<=1.45&&A(u,v,fl+dy)===AIR)wcof++;}
    info(F.name,'relief: tower grooves',groove,'; coffers in the nave vault',cof,'; blind arches in the side walls',blind,'; lancets in the back wall',lanc,'; coffers over the way in',wcof,'; unsound lava in the hall',unsoundLava());
    assert(groove>60&&cof>800&&blind>300&&lanc>40&&wcof>200,'its walls and vaults stand in relief: grooved towers, coffered vaults, blind arches and lancets');}
  const H2=holds[0],S2=fortSpots(H2);gen(Math.round(S2.hall.x),Math.round(S2.hall.z));let hb=0;for(let X=H2.box[0];X<=H2.box[1];X++)for(let Z=H2.box[2];Z<=H2.box[3];Z++)for(let y=H2.box[4];y<=H2.box[5];y++)if(at(X,y,Z)===BASBRICK)hb++;
  const u1=unsoundLava();info(H2.name,': basalt bricks',hb,'; unsound lava',u1);assert(hb>5000&&u1===0,'a warhold stands in a lesser volcano, its lava held');}
