// The dwarves' places enlarged (D-091): under every high hold the throne's court, the streets below with the ale-hall, the
// runesmith's chamber, the brewery, the market hall, the mushroom gardens, the baths (their water held sound) and the treasury,
// and the Hall of the Fathers with the kings' tombs; gem seams in the mines' walls; the rams' pens at the holds and the mining
// towns; the engineers by the trebuchets; waymarks on the Stone Road; and the prospectors' claims in the high lands outside the
// realms, worked or worked out, each with its adit walled sound, its camp and its strongbox, and a name.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const at=(X,y,Z)=>get(X-OX,y,Z-OZ);
const seen=new Set(),S={city:[],fort:[],village:[]};
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='dwarf')continue;
  for(const s of provinceOf(c.i,c.j).sites)if(S[s.k])S[s.k].push(s);}
// ---- the halls below, the court, the pens and the engines, in every hold
{const want=['dstreet','dale','drunes','dbrew','dmarket','dgarden','dbath','dvault','dfathers'],tally={};for(const s of S.city){const L=siteLayout(s);for(const k of want)tally[k]=(tally[k]||0)+(L.hold.some(q=>q.k===k)?1:0);}
  const court=S.city.filter(s=>['dthrone','danvil','dcourt'].every(k=>siteLayout(s).spots.some(p=>p.kind===k))).length,pens=S.city.filter(s=>siteLayout(s).pens).length+S.village.filter(s=>siteLayout(s).pens).length;
  info('holds',S.city.length,JSON.stringify(tally),'; with the throne\'s court',court,'; pens at',pens,'of',S.city.length+S.village.length,'holds and towns; trebuchets with engineers',S.city.filter(s=>siteLayout(s).trebs).length+S.fort.filter(s=>siteLayout(s).trebs).length);
  assert(S.city.length>=10&&want.every(k=>tally[k]>=S.city.length*0.9)&&court===S.city.length,'every hold has its court about the throne, its streets below and the halls along them, and the Hall of the Fathers');
  assert(pens>=(S.city.length+S.village.length)*0.7&&S.fort.filter(s=>siteLayout(s).trebs).length>=S.fort.length*0.7,'pens for the rams at the holds and towns; engineers by the trebuchets');}
// ---- the high hold generated: what stands in its halls; no water or lava where it should not be
{const cap=S.city.filter(c=>c.prov.capital).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0],L=siteLayout(cap);gen(cap.X,cap.Z);
  const ids=[DTOMB,DKEG,DVAT,DRUNE,MUSHBED,GOLDB,GEMHEAP,GEMORE,FEASTBOARD,LECTERN,GLOWSHROOM,BRAZIER],n={};for(const id of ids)n[id]=0;let stray=0,bath=0;
  for(const q of L.hold){for(let u=q.bu0-1;u<=q.bu1+1;u++)for(let v=q.bv0-1;v<=q.bv1+1;v++){const [x,z]=siteXZ(cap,u,v);for(let y=q.by0-3;y<=q.by1+1;y++){const id=at(x,y,z);if(n[id]!==undefined&&dIv(q,u,v))n[id]++;
    if(dIv(q,u,v)&&(id===LAVA||id===WATER&&!dwarfWaterAt(x,y,z)))stray++;if(q.k==='dbath'&&id===WATER&&dIv(q,u,v))bath++;}}}
  info(cap.name,': tombs',n[DTOMB],'kegs',n[DKEG],'vats',n[DVAT],'rune forge',n[DRUNE],'mushroom beds',n[MUSHBED],'gold',n[GOLDB],'gems',n[GEMHEAP],'gem seams',n[GEMORE],'boards',n[FEASTBOARD],'lecterns',n[LECTERN],'; the bath\'s water',bath,'; stray water or lava',stray);
  assert(n[DTOMB]>=10&&n[DKEG]>=8&&n[DVAT]>=4&&n[DRUNE]>=1&&n[MUSHBED]>=40&&n[GOLDB]>=20&&n[GEMHEAP]>=5&&n[FEASTBOARD]>=8&&n[LECTERN]>=2,'the halls are furnished: the kings\' tombs, the ale-hall\'s kegs and boards, the brewery\'s vats, the rune forge, the gardens\' beds, the treasury\'s gold and gems, the annals\' lecterns');
  assert(bath>=30&&stray===0,'the baths hold their water, and no water or lava reaches into the halls');
  const F=L.fathers,[fx,fz]=siteXZ(cap,(F.u0+F.u1)>>1,28).map(Math.round);let air=0;for(let y=F.y;y<F.y+6;y++)if(!SOLID[at(fx,y,fz)])air++;assert(air>=5,'the Hall of the Fathers is open under the deep');
  let gem=0;for(const q of L.hold.filter(q=>q.k==='gal'))for(let u=q.u0-1;u<=q.u1+1;u++)for(let v=q.v0-1;v<=q.v1+1;v++){const [x,z]=siteXZ(cap,u,v);for(let y=q.y0-1;y<=q.y1+1;y++)if(at(x,y,z)===GEMORE)gem++;}
  info('gem seams in the walls of its mines',gem);assert(gem>=2,'gems in the walls of the mines');}
// ---- a mining town's pen; a waymark on the Stone Road
{const v=S.village.filter(s=>siteLayout(s).pens).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0],p=siteLayout(v).pens[0];gen(v.X,v.Z);let fence=0,hay=0;const [px,pz]=siteXZ(v,p.u,p.v).map(Math.round);
  for(let dx=-7;dx<=7;dx++)for(let dz=-7;dz<=7;dz++)for(let y=p.y;y<p.y+6;y++){const id=at(px+dx,y,pz+dz);if(id===FENCE)fence++;if(id===HAYBALE)hay++;}info(v.name,'\'s pen: fence',fence,'hay',hay);assert(fence>=12&&hay>=2,'a pen for the rams: fenced, with hay under its shelter');
  const rd=S.city[0].prov.roads.find(r=>r.len>150)||S.city[0].prov.roads[0];let wm=0;for(let k=0;k<=8&&!wm;k++){const X=Math.round(rd.a[0]+(rd.b[0]-rd.a[0])*k/8),Z=Math.round(rd.a[1]+(rd.b[1]-rd.a[1])*k/8);gen(X,Z);
    for(let dx=-60;dx<=60;dx++)for(let dz=-60;dz<=60;dz++){const x=X-OX+dx,z=Z-OZ+dz;if(x<0||z<0||x>=W||z>=D)continue;for(let y=SEA;y<H-2;y++)if(world[I(x,y,z)]===DWAY)wm++;}}
  info('waymarks about a road of the dwarves',wm);assert(wm>=1,'waymarks stand beside the Stone Road');}
// ---- the prospectors' claims
{const C=[];for(let i=-90;i<90;i++)for(let j=-90;j<90;j++){const o=claimsAt(i,j);if(o)C.push(o);}const ab=C.filter(o=>o.ab);
  info('claims',C.length,'(worked out',ab.length+')','e.g.',C.slice(0,3).map(o=>o.name).join(', '));
  assert(C.length>=6&&ab.length>=1&&ab.length<C.length&&C.every(o=>!isBlockedName(o.who)),'prospectors\' claims in the high lands, worked and worked out, named');
  assert(C.every(o=>!realmOfColumn(o.X,o.Z)&&!realmNear(o.X,o.Z,8)&&!elderNear(o.X,o.Z,8)&&!oldNear(o.X,o.Z,8)&&!fathersNear(o.X,o.Z,8)),'they keep off the realms, the elder elves\' ruins, the old kingdom\'s and the forefathers\'');
  for(const o of [C.sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z)).find(q=>!q.ab),ab[0]]){gen(o.X,o.Z);const [fx,fz]=ELD4[o.dir],m={};for(const id of [DPROP,DLAMP,DSTRONG,COBWEB,SLATE,DCART,WATER,LAVA])m[id]=0;let air=0;
    for(let a=-14;a<=o.n+2;a++)for(let b=-10;b<=10;b++){const x=o.X+a*fx-b*fz,z=o.Z+a*fz+b*fx;for(let y=o.g-6;y<o.g+12;y++){const id=at(x,y,z);if(m[id]!==undefined)m[id]++;const inA=a>=1&&a<=o.n&&Math.abs(b)<=1&&y>=o.g+1&&y<=o.g+4;if(inA&&!SOLID[id])air++;if(inA&&(id===WATER||id===LAVA))m.wet=(m.wet||0)+1;}}
    info(o.name,': props',m[DPROP],'lamps',m[DLAMP],'cobwebs',m[COBWEB],'strongbox',m[DSTRONG],'slate',m[SLATE],'cart',m[DCART],'; the adit open',air,'of',o.n*12,'; water or lava in it',m.wet||0,'; its name here',surfaceName(o.X,o.g+1,o.Z));
    assert(m[DPROP]>=12&&m[DSTRONG]===1&&m[SLATE]>=8&&air>=o.n*12*0.75&&!(m.wet>0)&&surfaceName(o.X,o.g+1,o.Z)===o.name&&(o.ab?m[COBWEB]>=1:m[DLAMP]>=1),'a '+(o.ab?'worked-out':'worked')+' claim: its adit timbered and walled sound, its camp with the strongbox, its name');}}
