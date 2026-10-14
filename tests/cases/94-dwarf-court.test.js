// The court of the dwarves (D-091): the king or the queen on the throne of a high hold (a thane in a lesser hold), the anvilguard
// either side of the dais, the warden of the hold, the loremaster and the court; an audience and its gift; the oath sworn at the
// throne and its gifts (the hold-ring, the horn of the hold, the plate of the mountain, a rune of warding); kinship, a hall and its
// key; the new folk built whole; the great ram, the caravan pony and the raven built, and a ram that springs up a ledge.
setMode('survival');playing=true;dead=false;hp=20;
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const TO=[];toast=m=>{if(m)TO.push(m);};let shown=null;showText=(t,x)=>{shown=[t,x];};
const at=(s,u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[X-OX+W*(Z-OZ)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();for(const a of [...animals])removeAnimal(a);};
DW.r=0;DW.sw=0;DW.kin='';DW.g=0;DW.q=null;DW.au={};for(let i=0;i<inv.length;i++)inv[i]=null;
const seen=new Set();let cap=null,town=null;
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='dwarf')continue;const P=provinceOf(c.i,c.j);
  for(const s of P.sites){if(s.k!=='city')continue;if(P.capital&&!cap)cap=s;if(!P.capital&&!town)town=s;}}
const spot=(s,k)=>{const p=siteLayout(s).spots.find(q=>q.kind===k),[X,Z]=at(s,p.u,p.v);return [X,Z,p.y];};
// ---- the throne, its anvilguard and its court
let ruler=null;
{const [X,Z,y]=spot(cap,'dthrone');gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();ruler=foes.find(f=>f.kind==='dking'||f.kind==='dqueen');const A=foes.filter(f=>f.kind==='danvil'),C=foes.filter(f=>f.spk==='d_dcourt');
  info(cap.name,': on the throne',ruler&&FOES[ruler.kind].n,'; anvilguard',A.length,'; the court',C.map(f=>FOES[f.kind].n).join(', '));
  assert(ruler&&ruler.kind===dwarfSeatLead(cap)&&A.length>=3&&C.length>=3&&C.some(f=>f.kind==='dhward'),'the king or the queen on the throne, the anvilguard about the dais, the warden of the hold and the court');
  const [X2,Z2,y2]=spot(town,'dthrone');gen(X2,Z2);toPL(X2,Z2,y2+1);clear();foeSpawnTick();const th=foes.find(f=>f.spk==='d_dthrone'&&f.kind==='dlord');info(town.name,': on its throne',th&&FOES[th.kind].n);
  assert(!!th,'a thane holds the throne of a lesser hold');}
// ---- an audience
{const [X,Z,y]=spot(cap,'dthrone');gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();ruler=foes.find(f=>f.kind==='dking'||f.kind==='dqueen');
  const r0=dwarfAudience(ruler);DW.r=12;const r1=dwarfAudience(ruler),c1=countOf(462),r2=dwarfAudience(ruler),c2=countOf(462);info('a stranger:',r0);info('a guest:',r1,'; and again: ale',c1,'->',c2);
  assert(/stranger/i.test(r0)&&/gift/i.test(r1)&&c1>=2&&c2===c1,'the throne grants an audience, and a gift once for each rank');}
// ---- the oath
{DW.r=150;assert(dwarfRank()===3,'a friend of the mountain');const K=cap.prov.kingdom;dwarfAudience(ruler);dwarfOath(ruler,K);info('the oath:',shown&&shown[1].slice(0,110));
  assert(DW.sw===1&&dwarfRank()===4&&/anvil/.test(shown[1]),'a friend of great standing swears the oath on the anvil before the throne');
  dwarfGift(4);info('the oath\'s gifts: hold-ring',countOf(474),'; horn',countOf(473),'; plate',countOf(472),'; rune of warding',countOf(480));assert(countOf(474)===1&&countOf(473)===1&&countOf(472)===1&&countOf(480)===1,'the oathbound is given the hold-ring, the horn of the hold, the plate of the mountain and a rune of warding');
  const d=foes.find(f=>f.kind==='danvil');d.bow=0;const g=dwarfGreet(d,FOES[d.kind]);info('an anvilguard greets the oathbound:',g);assert(d.bow>foeClock&&/Oathbound/.test(g),'the dwarves bow to the oathbound');}
// ---- kinship
{DW.r=260;dwarfKin(ruler,cap.prov.kingdom);info('kinship:',shown&&shown[1].slice(0,110),'; rank',dwarfRankName());assert(DW.kin===cap.name&&dwarfRank()===5&&countOf(475)===1&&countOf(476)===1,'an oathbound friend of great standing is made kin, with a hall and its key');
  const out=[];dwarfJournal(out);info(out[out.length-1]);assert(/Kin of the Mountain/.test(out[out.length-1]),'the journal keeps the kinship');}
// ---- the new folk, built whole; the beasts
{const ks=['dqueen','danvil','dhward','dlore','drune','dbrew','dmerch','dmint','dgem','dfarm','dkeep','dchild','dgirl','dramr','dprosp','ddeep','dengin'];const bad=[];clear();
  for(const k of ks){const f=addFoe(k,PL.x+2,PL.y,PL.z,{st:'idle',t:9});if(!f||!f.m||!(f.m.box[4]>0))bad.push(k);}info('the dwarves\' new folk built:',ks.length-bad.length,'of',ks.length,bad.join(','));assert(!bad.length,'the dwarves\' new folk are built');
  const hb=amBuild('danvil',0,{}).box,cb=amBuild('dchild',0,{}).box,rb=amBuild('dramr',0,{}).box;info('heights: anvilguard',hb[4].toFixed(2),'child',cb[4].toFixed(2),'ram-rider',rb[4].toFixed(2));assert(cb[4]<hb[4]*0.8&&rb[4]>hb[4],'their children small, their ram-riders tall in the saddle');
  clear();for(const k of ['ram','pony','raven']){const a=addAnimal(k,PL.x+3,PL.y,PL.z,{});assert(a&&a.m,'the '+ANIMALS[k].n.toLowerCase()+' is built');removeAnimal(a);}
  assert(FOES.danvil.elite&&FOES.danvil.dmg>FOES.dhammer.dmg&&FOES.ddeep.hp>=FOES.daxe.hp,'the anvilguard strike hardest, the deepwardens stand as the axeguards');}
// ---- the great ram springs up a ledge that a horse cannot
{gen(cap.X,cap.Z);const x0=Math.floor(PL.x),z0=Math.floor(PL.z);let y0=PL.y|0;
  const flat=(x,z,y)=>{for(let dx=-3;dx<=6;dx++)for(let dz=-2;dz<=2;dz++){for(let yy=y-2;yy<y;yy++)setBlock(x+dx,yy,z+dz,STONE,true);for(let yy=y;yy<y+6;yy++)setBlock(x+dx,yy,z+dz,AIR,true);}for(let dz=-2;dz<=2;dz++)for(let dx=3;dx<=6;dx++)for(let yy=y;yy<y+2;yy++)setBlock(x+dx,yy,z+dz,STONE,true);};
  const climb=kind=>{clear();flat(x0,z0,y0);const a=addAnimal(kind,x0+0.5,y0,z0+0.5,{tame:true});mount(a);PL.x=x0+0.5;PL.z=z0+0.5;PL.y=y0;PL.vx=PL.vy=PL.vz=0;PL.yaw=-Math.PI/2;
    PL.pitch=0;for(const c in keys)keys[c]=false;keys.KeyW=true;let top=PL.y;for(let i=0;i<30;i++){update(0.05);top=Math.max(top,PL.y);}keys.KeyW=false;dismount();removeAnimal(a);return top-y0;};
  const r=climb('ram'),h=climb('horse');info('up a ledge of two: the ram rose',r.toFixed(1),'; a horse',h.toFixed(1));assert(r>=1.9&&h<1.5,'a great ram springs up a ledge of two that a horse balks at');}
DW.sw=0;DW.kin='';DW.r=0;setMode('creative');
