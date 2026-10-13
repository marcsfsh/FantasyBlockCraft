// After an Emberlord's fall (W7c, D-076): its mountain's open lava cools when its chunks are made, the lava sea below untouched;
// the sky over its basin clears; its servants scatter; the war is won and ends; its relics, owed and given in the Leaguer, each
// with its use (the horn routs, the cloak keeps out fire, the heart glows); the monument on its crater's rim; the banners over the
// gate, the feast and the song; the land heals; something stirs below.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();};
let [X,Z]=at(60,0);gen(X,Z);toPL(X,Z);playing=false;clear();warS.clear();warArmies.length=0;WARS.clear();warPlay=0;warClk=1e9;warStateTick();
const w=WARS.get(P.id),R=warLord(w),G=R.G,F=R.F,S=volcShape(G);fallenLords.delete(F.id);
// its mountain dies: open lava cools, sources to obsidian and flows to crust; the lava sea far below is untouched
const lavaCount=()=>{let top=0,deep=0,obs=0;for(let x=0;x<W;x+=1)for(let z=0;z<D;z+=1){if(Math.hypot(x+OX-S.cx,z+OZ-S.cz)>G.R*1.2)continue;for(let y=1;y<H-1;y++){const id=world[I(x,y,z)];
  if(id===LAVA){if(y<G.base-40)deep++;else if(!SOLID[world[I(x,y+1,z)]]&&world[I(x,y+1,z)]!==LAVA)top++;}else if(id===OBSID&&y>=G.base-30)obs++;}}return [top,deep,obs];};
gen(Math.round(S.cx),Math.round(S.cz));const [t0,d0,o0]=lavaCount();fallenLords.add(F.id);gen(Math.round(S.cx),Math.round(S.cz));const [t1,d1,o1]=lavaCount();
info('about the crater: open lava',t0,'->',t1,'; obsidian',o0,'->',o1,'; the lava sea below',d0,'->',d1);
assert(t0>200&&t1===0&&o1>o0&&d1===d0,'a fallen lord\'s mountain dies: its open lava cools to obsidian and crust, the lava sea far below untouched');
// the sky over its basin clears; the war is won
{const [x,z]=at(-150,0);gen(x,z);toPL(x,z);const b0=LAND_WX.volcanic.burn;emberAfterTick();for(let i=0;i<400;i++)landWeather(0.5);
  emberFate(w,R,'quenched',null);info('the sky: clear',emberClearK,'; burning',LWX.burn.toFixed(2),'of',b0,'; the war:',warStage(w));
  assert(emberClearK===1&&LWX.burn<0.4&&warStage(w)==='The war is won','the sky over its basin clears, and its war is won');}
// its servants scatter: one place of the wastes in four keeps its creatures (along the front and about the mountain, D-083)
{const pl=[],seen=new Set(),FP=warFrontPath(P).concat(Array.from({length:24},(_,i)=>[G.X+Math.cos(i*0.2618)*(G.R*1.3+30),G.Z+Math.sin(i*0.2618)*(G.R*1.3+30)])),px=PL.x,pz=PL.z;for(let i=0;i<FP.length;i+=3){PL.x=FP[i][0]-OX;PL.z=FP[i][1]-OZ;for(const q of foePlaces())if(!q.folk&&q.kind!=='lord'&&!seen.has(q.id)){seen.add(q.id);pl.push(q);}}PL.x=px;PL.z=pz;const keep=pl.filter(q=>hsh(Math.round(q.x),9997,Math.round(q.z))<=0.25||!deadBasinAt(q.x,q.z));
  info('places of the wastes near',pl.length,'; still peopled',keep.length);assert(pl.length>=4&&keep.length<pl.length*0.5,'its servants scatter: most places of the wastes stand empty');}
// its relics, owed (it fell away from the player) and given in the Leaguer; each with its use
setMode('survival');inv.fill(null);for(const k in equip)equip[k]=null;
{const k=emberKnown.get(F.id);info('owed relics:',k&&k[3]);const [x,z]=at(P.uC0+40,0);gen(x,z);toPL(x,z);emberAfterTick();const has=id=>inv.some(q=>q&&q.id===id);
  const want=EMBER_RELICS(R.L.kind);info('given:',inv.filter(Boolean).map(q=>nameOf(q.id)).join(', '));assert(want.every(has)&&!emberKnown.get(F.id)[3],'its relics are kept by the lords of the hosts and given in the Leaguer: its horn or crown, the cloak of its wing, its blade and its heart');}
{const h=want=>{const o=[];for(let i=0;i<4;i++)o.push(addFoe('raider',PL.x+4+i,foeStand(PL.x+4+i,PL.y+2,PL.z,2),PL.z,{}));return o;};const o=h();o.forEach(f=>{f.st='chase';});
  emberRelicT=0;emberRelicUse(379);info('the horn sounded: fleeing',o.filter(f=>f.st==='flee').length,'of',o.length);assert(o.every(f=>f.st==='flee'),'sounded, the horn of a fallen lord sends the wastes\' creatures near fleeing');clear();}
{hp=20;hurtCD=0;equip.body={id:385,c:1,d:0};hurt(6,'lava');const a=hp;hurtCD=0;hurt(6,'orc');const b=hp;equip.body=null;info('the cloak: after lava',a,'; after an orc\'s blow',b);
  assert(a===20&&b<20,'the cloak of the Ember Wing keeps out fire and lava, though not blades');hp=20;}
{inv[sel]={id:378,c:1};const L=lampLevel();info('the Emberheart in hand: light',L[1]);assert(L[1]>=12,'the Emberheart glows in the hand');inv[sel]=null;}
setMode('creative');
// the banners over the gate, the feast and the song in the Leaguer
{const E=elOf(w);emberAfterTick();const [gx,gz]=at(40,0);gen(gx,gz);toPL(gx,gz);for(let i=0;i<4;i++){emberAfterTick();let k=0;while(WJ.length&&k++<5000)warJobsFrame();}while(genQ.length)processGenQ();const [bx,bz]=wgXZ(P,0,0),ban=get(bx-OX,P.hG+53,bz-OZ);
  info('the feast',E.feast,'; the banners over the gate',E.ban2,BL[ban].n,'; the chronicle:',w.log.slice(-2).map(l=>l[1]).join(' | '));
  assert(E.feast===1&&E.ban2===1&&ban===EVBANNER&&w.log.some(l=>/victory feast/.test(l[1])),'a victory feast in the Leaguer, and the three banners raised over the Ashen Gate');}
// the monument on its crater's rim
{const E=elOf(w),[mx,mz]=emberMonumentAt({G:G,P:P});gen(mx,mz);toPL(mx+8,mz+8);for(let i=0;i<4&&E.mon!==1;i++){emberAfterTick();let k=0;while(WJ.length&&k++<5000)warJobsFrame();}
  const y0=ground[mx-OX+W*(mz-OZ)],ids=new Set();for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)for(let y=y0;y<y0+12;y++)ids.add(get(mx-OX+a,y,mz-OZ+b));
  info('the monument at',mx,mz,':',E.mon,[...ids].map(i=>BL[i].n).join(', '));assert(E.mon===1&&[WSPILLAR,EVPILLAR,DWPILLAR,RBANNER,EVBANNER,DBANNER,OBSID].every(i=>ids.has(i)),'the three peoples raise a monument on its crater\'s rim');}
// the land heals where the player goes
{const [x,z]=at(-150,0);gen(x,z);toPL(x,z);elOf(w).ft=Math.round(warPlay-7200);const n0=emberHealN;for(let i=0;i<300;i++)emberAfterTick();
  info('healed columns',emberHealN-n0);assert(emberHealN-n0>20,'the land slowly heals: grass and flowers grow on the ash');}
// something stirs below
{PL.y=G.base-60;emberStirT=1;emberAfterTick();info('below: the stirring again in',Math.round(emberStirT),'s');assert(emberStirT>200,'deep under its basin, something stirs in the lava sea');}
fallenLords.delete(F.id);
