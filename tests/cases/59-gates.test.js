// The war at the gates of the wastes (D-067). The owner's fixes first: one great volcano to a basin, no cone cut in two (no gorge
// up a volcano), no geode or fossil over the ground, gullies shallower with their lava three deep. Then every basin's gate: the
// pass cut through the ring at the height of the lands outside, the yard inside, the road down in one straight line at one in two to the Ember Throne's causeway (D-087)
// to the floor, the camp of the allied hosts beyond the siege lines, three times the ground of the largest city of men. Built:
// the gate between its towers, one leaf barred and propped, the other ajar with a way through by its edge, the dwarves' ram at
// the barred leaf, the camp's pavilions, tents and banners of the three peoples, the orcs' camp in the yard; the places named.
// The war: both sides peopled, parties marching at each other by waypoints and fighting, the player left alone in creative; the
// armies: the hosts mustering in ranks in the camp and marching out, the wastes' warhost massing in the yard and charging.
// Last the Ember Stair inside each great volcano: from the Ember Throne's way in to a gallery over the crater, its cover of
// rock, its halls and caverns built and named, the lava of their pools held, their foes.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const count=(ids,x0,x1,z0,z1,y0,y1)=>{const c={};for(const id of ids)c[id]=0;for(let z=Math.max(0,z0);z<=Math.min(D-1,z1);z++)for(let x=Math.max(0,x0);x<=Math.min(W-1,x1);x++)for(let y=y0;y<=y1;y++){const id=world[I(x,y,z)];if(c[id]!==undefined)c[id]++;}return c;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
// ---- the fixes
const basins=new Map();for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const c=landSite(i,j);if(LANDS[cellLand(c)].k!=='volcanic')continue;const B=wasteBasin(c);basins.set(B.key,B);}
{const n=[];for(const B of basins.values()){const keys=new Set();for(const c of B.cells){const g=greatOf(stretchCell(c));if(g)keys.add(g.key);}n.push(keys.size);}
  info('basins of the wastes within 8000 blocks',basins.size,'; great volcanoes in each',n.join(' '));
  assert(n.every(k=>k<=1)&&n.filter(k=>k===1).length>=n.length-1,'one great volcano to a basin');}
const B7=wasteBasin(vc(2728,758)),V=greatOf(B7.chief);
{const o={};let g=0,cone=0;for(let Z=V.Z-400;Z<V.Z+400;Z+=3)for(let X=V.X-400;X<V.X+400;X+=3){colInfo(X,Z,o);if(o.vs>0.05){cone++;if(o.rvBot<999)g++;}}
  info(V.name,': columns of its cones sampled',cone,'; of them in a gorge',g);assert(cone>10000&&g===0,'no gorge cuts up a volcano: its cones stand whole');}
{let up=0,all=0;for(let WCX=Math.floor((V.X-700)/CS);WCX<Math.floor((V.X+700)/CS);WCX++)for(let WCZ=Math.floor((V.Z-700)/CS);WCZ<Math.floor((V.Z+700)/CS);WCZ++){const p=poiBase(WCX,WCZ);
    if(!p||(p.tp!=='geode'&&p.tp!=='fossil'))continue;all++;if(p.y>colInfo(p.x,p.z,{}).h-12)up++;}
  info('geodes and fossils under the main basin',all,'; any of them less than twelve under the ground',up);assert(up===0,'no geode or fossil hangs over the sunken floor');}
{const o={};let l3=0,l1=0,gul=0;for(let Z=V.Z-250;Z<V.Z+250;Z+=2)for(let X=V.X-250;X<V.X+250;X+=2){colInfo(X,Z,o);if(!o.vgul)continue;gul++;const dp=o.vlake-o.h+1;if(dp>=3)l3++;else if(dp===1)l1++;}
  info('gully columns with lava',gul,'; three deep',l3,'; one deep (at the foot)',l1);assert(gul>300&&l3>gul*0.5,'the gullies carry their lava three deep, thinning at the foot');}
// ---- every basin's gate
const gates=[...basins.values()].map(B=>wasteGateOf(B));
info('gates',gates.map(P=>P?P.name+' at X '+P.X+' Z '+P.Z+' facing '+['north','east','south','west'][P.dir]+', at '+P.hG+', the road '+Math.round(P.ramp.len)+' long down to '+P.ramp.yF:'none').join('; '));
assert(gates.every(P=>P),'every basin of the wastes has its gate');
assert(gates.every(P=>!isBlockedName(P.name.replace('The Ashen Gate of ',''))&&!isBlockedName(P.camp.replace('The Leaguer of ',''))),'their names are none of Tolkien\'s');
const P=wasteGateOf(B7),s=wgSite(P),at=(u,v)=>siteXZ(s,u,v).map(Math.round);
{const o={};const h=(u,v)=>colInfo(...at(u,v),o).h;
  const outside=[];for(let u=P.uC0+20;u<P.uC1;u+=40)for(let v=-100;v<=100;v+=50)outside.push(h(u,v));const level=outside.every(y=>y===P.hG);
  const walls=[h(0,-60),h(0,60),h(-40,-80),h(-40,80)],floor=h(0,0),yard=h(-40,0);
  let steep=0;const pp=P.ramp.pts;for(let i=1;i<pp.length;i++){const dl=pp[i][2]-pp[i-1][2],dy=pp[i-1][3]-pp[i][3];if(dl>0&&dy/dl>WG_GRADE+0.01)steep++;}
  let dev=0;const a0=pp[0],b0=pp[pp.length-1],lx=b0[0]-a0[0],lz=b0[1]-a0[1],ll=Math.hypot(lx,lz)||1;for(const q of pp)dev=Math.max(dev,Math.abs((q[0]-a0[0])*lz-(q[1]-a0[1])*lx)/ll);
  const G=greatOf(P.B.chief),Fo=G&&fortOf(G),cwL=Fo&&Fo.cw?Math.hypot(Fo.cw[0]+Fo.P.td+8,Fo.cw[1]):1e9,fa=Fo&&G.gth!==undefined?Math.abs(angDiffV(Math.atan2(Fo.oz,Fo.ox),G.gth)):9;
  const raw=[];for(let k=0;k<12;k++){const o2=wgRaw(...at(P.uC0+20+k*20,(k%5-2)*40));raw.push(o2.h);}raw.sort((a,b)=>a-b);
  info(P.name,': the gate at',P.hG,'(the lands outside about',raw[6]+'); its floor',floor,', the yard',yard,'; the ring either side',walls.join(' '),'; the camp level',level,'; the road',Math.round(P.ramp.len),'long from',P.hG,'to',P.ramp.yF,', steeper than one in two at',steep,'steps, off its line at most',dev.toFixed(1),'; the causeway on to the Ember Throne\'s stairs',Math.round(cwL),'long, the fortress facing',(fa*57.3).toFixed(0),'degrees off the road ; the yard',-P.uY,'deep');
  assert(floor===P.hG&&yard===P.hG&&Math.abs(P.hG-raw[6])<=12,'the gate stands at the height of the lands outside, the pass and the yard cut level to it');
  assert(walls.every(y=>y>P.hG+25),'the ring of ash mountains breaks for the pass, its walls high either side');
  assert(steep===0&&P.ramp.yF<=P.hG-60&&P.ramp.len>=120&&P.ramp.len<=340&&dev<1&&cwL<=200&&fa<0.5&&-P.uY>=70,'a short straight road, one in two, runs down from the yard to the floor, and a causeway on to the Ember Throne facing it (D-087)');
  assert(level,'the camp of the hosts is levelled at the gate\'s height');}
{let big=0,on=0;for(let i=-20;i<20;i++)for(let j=-20;j<20;j++){const Pv=provinceOf(i,j);if(!Pv)continue;for(const t of Pv.sites){if(t.k==='city')big=Math.max(big,(2*t.R)*(2*t.R));if(wasteGateNear(t.X,t.Z,t.R))on++;}}
  assert(on===0,'no site of the realms stands on a gate\'s works');
  const camp=WG_CAMP[0]*2*WG_CAMP[1];info('the camp',WG_CAMP[0],'by',2*WG_CAMP[1],'(',camp,') ; the largest city of men within 6400 blocks',Math.sqrt(big),'square (',big,')');
  assert(camp>=3*big,'the camp is three times the ground of the largest city');}
// the gate built
gen(...at(20,0));
{const [gx,gz]=at(0,0),g=P.hG,cs=P.cs,L=(u,v)=>{const [x,z]=at(u,v);return [x-OX,z-OZ];},blk=(u,v,y)=>{const [x,z]=L(u,v);return get(x,y,z);};
  const c=count([GATEIRON,ORCIRON,BASBRICK,OBSBRICK,EMGLYPH,BANNER,STEELB,DBRONZE,MANTLET,LOG,SKULLS],gx-OX-60,gx-OX+60,gz-OZ-60,gz-OZ+60,g-4,g+72);
  let tower=0;for(let y=g+80;y>g;y--)if(blk(0,cs*28,y)!==AIR){tower=y-g;break;}
  let gap=true;for(const u of [4,0,-4,-8,-12,-16])for(let y=g+1;y<=g+3;y++)if(SOLID[blk(u,-cs*2,y)])gap=false;
  let ajar=0;for(let u=-14;u<=-4;u++)for(let v=-20;v<=-4;v++)if(blk(u,v*cs,g+10)===GATEIRON)ajar++;
  let barred=0;for(let v=1;v<=20;v++)if(blk(0,v*cs,g+10)===GATEIRON||blk(0,v*cs,g+10)===ORCIRON)barred++;
  info('at the gate:',Object.entries(c).map(([k,n])=>nameOf(+k)+' '+n).join(', '),'; the towers',tower,'high; the barred leaf across',barred,'; the open leaf in the yard',ajar,'; the way through by its edge',gap);
  assert(tower>=64&&c[EMGLYPH]>10&&c[BANNER]>20&&barred>=18,'the gate stands between its towers, 64 high, the barred leaf shut across its half');
  assert(ajar>=8&&gap,'the other leaf hangs ajar into the yard, with a way through by its edge');
  assert(blk(2,cs*10,g+5)===STEELB&&c[DBRONZE]>100&&c[MANTLET]>50,'the dwarves\' ram, its head of steel against the barred leaf, under its shed of bronze; mantlets and a covered way behind it');
  const [ax,az]=L(P.uY,-50),[bx,bz]=L(-12,50),ny=count([HIDE,ORCLOG,STAKES,MAGMA,LAVA],Math.min(ax,bx),Math.max(ax,bx),Math.min(az,bz),Math.max(az,bz),g-2,g+14);
  info('the orcs\' camp in the yard:',Object.entries(ny).map(([k,n])=>nameOf(+k)+' '+n).join(', '));
  assert(ny[HIDE]>100&&ny[ORCLOG]>150&&ny[STAKES]>40,'the orcs\' camp in the yard: tents of hide, a palisade of black logs, barricades of stakes');
  const names=[at(0,cs*28),at(16,cs*10),at(P.uL+16,0),at(-40,0)].map(([x,z])=>wasteGateName(x,z));info('the places:',names.join(' | '));
  assert(names[0]===P.name&&names[1]===P.ram&&/^The Siege Lines/.test(names[2])&&names[3]===P.yard,'the gate, the ram, the siege lines and the orcs\' yard are places of their own names');}
// the war: both sides peopled, parties sent and fighting; in creative the player is left alone
{const [X,Z]=at(40,-P.cs*22);PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;playing=true;hp=20;
  for(const f of [...foes])removeFoe(f);foeSpots.clear();warS.clear();
  const places=foePlaces().filter(p=>p.id.startsWith(P.id));info('spots near the ram:',places.map(p=>p.kind).join(' '));
  assert(places.some(p=>p.folk)&&places.some(p=>!p.folk),'both sides stand about the ram: the hosts\' soldiers and the orcs');
  let sent=new Set(),allies=0,orcs=0,fights=0,dead=[0,0];
  for(let k=0;k<60;k++){run(5);for(const f of foes){if(f.war&&!sent.has(f.id)){sent.add(f.id);if(FOES[f.kind].folk)allies++;else orcs++;}if(f.war&&f.foe)fights++;}}
  for(const f of foes)if(f.war&&f.dead)dead[FOES[f.kind].folk?0:1]++;
  info('in five minutes by the ram: marching',allies,'of the hosts and',orcs,'orcs and goblins; fighting seen',fights,'times; the player',hp);
  assert(allies>=8&&orcs>=6&&fights>20&&hp===20,'the two sides send their parties at each other and fight along the pass; the player in creative is left alone');}
// the armies (the owner: "have armies muster in the camp. i want invasions to be massive"): the hosts muster in ranks on the
// camp's field and march out through its great gate; the wastes' warhost comes up the Long Descent, masses before the gate and
// charges; the yard calls its defenders; far off, a soldier is drawn as one mesh
const army=(label,pu,pv,al,sec)=>{gen(...at(pu,pv));const [X,Z]=at(pu,pv);PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;playing=true;hp=20;
  for(const f of [...foes])removeFoe(f);foeSpots.clear();warS.clear();warArmies.length=0;warClk=1e9;
  const A=warArmy(P,al),R={A:A,ranks:0,go:-1,beyond:0,far:0,whole:0,one:0,max:0};
  for(let k=0;k<sec;k++){run(1);const m=A.m.filter(f=>!f.dead&&!f.gone);R.max=Math.max(R.max,m.length);if(!A.go)R.ranks=Math.max(R.ranks,m.filter(f=>f.waitA&&f.st==='idle').length);else if(R.go<0)R.go=k+1;
    for(const f of m){const u=wgUV(P,f.x+OX,f.z+OZ)[0];if(al?u<P.uC0-10:u>8)R.beyond++;}
    if(k===sec-1)for(const f of foes){if(f.dead)continue;const d=Math.hypot(f.x-PL.x,f.z-PL.z);if(f.far){R.far++;if(d>foeLodR*0.9)R.one++;}else if(d<=34)R.whole++;}R.crowd=crowdCount();} // (three.js is not here: the headless harness stands in for it; the screenshots show the look)
  return R;};
{const R=army('the hosts',P.uC0+40,12,true,150),A=R.A;
  info('the hosts muster:',A.mus&&(A.mus.sq?'in the square':'on the field'),'; companies',A.C.length,'of',A.N,'(men, riders, dwarves, elves, wood elves) ; in their ranks before the horns',R.ranks,'of',R.max,'; they march at',R.go,'s ; soldier-seconds out beyond the great gate',R.beyond,'; the player',hp);
  assert(A.mus&&!A.mus.sq&&A.N>=100&&R.max>=100&&R.ranks>=R.max*0.8&&R.go>0&&R.beyond>200&&hp===20,'a massive army of the hosts musters in ranks on the camp\'s field, then marches out through its great gate');
  info('drawn far off in the crowd',R.one,'of',R.far,'(instances drawn',R.crowd+') ; whole near by',R.whole);assert(R.far>10&&R.one===R.far&&R.crowd>0&&R.whole>5,'soldiers far off are drawn as instances of their kind in the crowd (D-077), those near whole');}
{const R=army('the warhost',-30,P.side*20,false,170),A=R.A; // (170 s: it may wait for its last companies before it charges)
  info('the warhost:',A.mus&&A.mus.yard?'masses in the yard':'comes in','; companies',A.C.length,'of',A.N,'(orcs, goblins, trolls) ; massed before the charge',R.ranks,'of',R.max,'; it charges at',R.go,'s ; soldier-seconds out through the gate',R.beyond,'; the player',hp);
  assert(A.mus&&A.mus.yard&&A.N>=100&&R.max>=100&&R.ranks>=R.max*0.75&&R.go>0&&R.beyond>200&&hp===20,'a massive warhost comes up the Long Descent, masses in ranks before the gate and charges out through it');}
{for(const f of [...foes])removeFoe(f);foeSpots.clear();warArmies.length=0;const D0=warDefend(P,false);
  info('the yard\'s defenders',D0?D0.N:0,'to their ranks before the gap',D0?D0.rk0.length:0);assert(D0&&D0.N>=20&&D0.rk0.length>=D0.N,'the yard calls its defenders to ranks before the gap when the hosts come');warArmies.length=0;for(const f of [...foes])removeFoe(f);}
// the camp built, its quarters and names
gen(...at(P.uC0+125,0));
{const c=count([CANVAS,WOOLW,WOOLB,WOOLY,WOOLK,RBANNER,EVBANNER,DBANNER,DGRAN,STAKES,LOG,LANTERN,PAVING,EVROOF],0,W-1,0,D-1,P.hG-4,P.hG+30); // (the window holds the camp but for its edges)
  info('the camp:',Object.entries(c).map(([k,n])=>nameOf(+k)+' '+n).join(', '));
  assert(c[CANVAS]>3000&&c[RBANNER]>0&&c[EVBANNER]>0&&c[DBANNER]>0&&c[DGRAN]>200&&c[EVROOF]>50&&c[STAKES]>150&&c[PAVING]>500,'the camp of men, elves and dwarves: tents in their lines, the elves\' pavilions, the dwarves\' redoubt, the square, the three banners, a palisade all round');
  const [px,pz]=at(P.uC0+141,0),[cx,cz]=at(P.uC0+60,40);info('names:',wasteGateName(px,pz),'|',wasteGateName(cx,cz));
  assert(wasteGateName(px,pz)==='The Pavilion of the Three Banners'&&wasteGateName(cx,cz)===P.camp,'the camp and the pavilion of its council are places');
  PL.x=px-OX+0.5;PL.z=pz-OZ-0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;const f=foePlaces().filter(p=>p.id.startsWith(P.id)&&p.folk);info('the folk\'s places about the square:',f.map(p=>p.kind).join(' '));assert(f.length>=3,'the camp is peopled');}
// the new blocks keep their definition under the burning light (D-059)
{const lum=(t,x,y)=>{const i=((((t/AC)|0)*16+y)*AW+(t%AC)*16+x)*4;return 0.299*dat[i]+0.587*dat[i+1]+0.114*dat[i+2];};let s2=0,q=0;const t=BL[GATEIRON].t[0];for(let y=0;y<16;y++)for(let x=0;x<16;x++){const l=lum(t,x,y);s2+=l;q+=l*l;}
  const m=s2/256,sd=Math.sqrt(q/256-m*m);info('gate iron: brightness',Math.round(m),'±',Math.round(sd));assert(m>=50&&sd>=8&&BL[CANVAS]&&BL[MANTLET],'the new blocks are defined, the gate iron bright enough to keep its definition');}
// ---- the Ember Stair
const greats=[];for(const B of basins.values()){const g=greatOf(B.chief);if(g)greats.push(g);}
{const rows=[];let ok=0;for(const g of greats){const H=stairOf(g);if(!H){rows.push(g.name+': none');continue;}const p=H.pts;let ang=0;for(let i=1;i<H.top0;i++)ang+=angDiffV(Math.atan2(p[i-1][1]-g.Z,p[i-1][0]-g.X),Math.atan2(p[i][1]-g.Z,p[i][0]-g.X));
    const rise=p[H.top0-1][2]-p[0][2],turns=Math.abs(ang)/6.283;rows.push(H.name+' '+Math.round(rise)+' up in '+turns.toFixed(1)+' turns, '+H.ch.length+' chambers');if(rise>=(g.lake-g.base)*0.8&&p[H.top0-1][2]>=g.lake+3&&turns>=1.5&&H.ch.length>=6)ok++;}
  info('the stairs:',rows.join('; '));assert(ok>=greats.length-1,'every great volcano has its stair, winding round inside it from its fortress up to its crater');}
const H=stairOf(V);
{const o={};let n=0,low=0;const p=H.pts;for(let i=0;i<H.top0-30;i++){colInfo(Math.round(p[i][0]),Math.round(p[i][1]),o);n++;if(o.h-(p[i][2]+STAIR_H)<8)low++;}
  info(H.name,': points',n,'with less than eight of rock over them',low);assert(low<=n*0.02,'the stair keeps its rock over it, up to the summit');
  const kinds=H.ch.map(c=>c.kind);info('its chambers:',kinds.join(' '));assert(kinds.filter(k=>STAIR_HALLS.includes(k)).length>=3&&kinds.filter(k=>STAIR_CAVES.includes(k)).length>=2&&kinds.includes('gallery'),'part stronghold, part cave: halls of the orcs and caverns of fire, a gallery at the top');}
{const c=H.ch.find(q=>q.kind==='cavern');gen(Math.round(c.x),Math.round(c.z));const x=Math.round(c.x)-OX,z=Math.round(c.z)-OZ;let air=0;for(let y=c.y+1;y<=c.y+12;y++)if(get(x,y,z)===AIR)air++;
  const cc=count([LAVA,MAGMA,OBSID,CINDER,LAVACRUST],x-16,x+16,z-16,z+16,c.y-3,c.y+22);let loose=0;for(let a=-16;a<=16;a++)for(let b=-16;b<=16;b++)for(let y=c.y-2;y<=c.y+2;y++){if(get(x+a,y,z+b)!==LAVA)continue;
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const id=get(x+a+dx,y,z+b+dz);if(id!==LAVA&&!SOLID[id])loose++;}if(!SOLID[get(x+a,y-1,z+b)]&&get(x+a,y-1,z+b)!==LAVA)loose++;}
  info(STAIR_NAMES.cavern,'at X',Math.round(c.x),'Z',Math.round(c.z),': open',air,'of 12 over its middle;',Object.entries(cc).map(([k,n])=>nameOf(+k)+' '+n).join(', '),'; lava not held',loose,'; named',stairName(Math.round(c.x),c.y+2,Math.round(c.z)));
  assert(air===12&&cc[LAVA]>10&&cc[MAGMA]>0&&loose===0&&stairName(Math.round(c.x),c.y+2,Math.round(c.z))===STAIR_NAMES.cavern,'a cavern of the stair is carved, its pool of lava held in its floor, and named');
  const sp=[];stairSpots(c.x,c.y,c.z,sp);assert(sp.some(q=>q.stair==='cavern'),'its foes have their place');}
{const c=H.ch.find(q=>q.kind==='barracks');gen(Math.round(c.x),Math.round(c.z));const x=Math.round(c.x)-OX,z=Math.round(c.z)-OZ;const cc=count([BASPILLAR,BRAZIER,BASTILE,HIDE],x-14,x+14,z-14,z+14,c.y,c.y+12);
  info(STAIR_NAMES.barracks,':',Object.entries(cc).map(([k,n])=>nameOf(+k)+' '+n).join(', '));assert(cc[BASPILLAR]>20&&cc[BRAZIER]>4&&cc[BASTILE]>100&&cc[HIDE]>4,'a hall of the orcs\' stronghold in it: pillars, fire baskets, a floor of tiles, their bedding');}
// ---- the creative tour finds the gate's works
{const t=gateTour('camp');info('the tour to the camp:',t&&t.X,t&&t.Z);assert(t&&wasteGateName(t.X,t.Z),'the creative tour takes the player to the gate\'s works');}
