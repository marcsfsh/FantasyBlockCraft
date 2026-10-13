// The war under the gate (D-086): from the war's start the dwarves' mine has met the goblins' countermine under the pass, three
// fifths of its way; where they met the fighting has dug out the Broken Gallery, five high, propped and lamplit on the dwarves'
// side, rubble and skulls on the goblins', sound all round, the tunnels running on into it. When the player is down there a
// battle goes on without end: each side kept up to its strength by companies coming up its own tunnel, dwarves against goblins,
// the fallen replaced; when the gate has fallen it is over.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=9;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),g=P.hG,at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const B=(u,v,y)=>{const [X,Z]=wgXZ(P,u,v);return get(X-OX,y,Z-OZ);},jobs=()=>{let k=0;while(WJ.length&&k++<2000)warJobsFrame();};
const M=warMinePts(P),mid=warMineMid(P),[X,Z]=at(Math.round(mid[0]),Math.round(mid[1]));gen(X,Z);
const toPL=(u,v,y)=>{const [x,z]=at(u,v);PL.x=x-OX+0.5;PL.z=z-OZ+0.5;PL.y=y!==undefined?y:ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;};toPL(Math.round(mid[0])+30,0);
playing=false;for(const f of [...foes])removeFoe(f);foeSpots.clear();warS.clear();warArmies.length=0;WARS.clear();warPlay=0;warClk=1e9;WJ.length=0;warStateTick();const w=WARS.get(P.id);jobs();
for(let i=0;i<14;i++){warWorksTick(P,w);jobs();}
// the mine has met the countermine from the start; the gallery
{const me=warEff(w,'mine'),cm=warCm(w);info('at the war\'s start: the mine',me.toFixed(2),'; the countermine',cm.toFixed(2),'; applied',JSON.stringify(w.ap),'; the chronicle:',w.log[0][1]);
  assert(me>=WAR_MEET&&cm>=1&&w.ap.me>=WAR_MEET&&w.ap.cm>=1&&/fight there in the dark/.test(w.log[0][1]),'from the war\'s start the dwarves\' mine has met the goblins\' countermine under the pass');
  let air=0,n=0,floor=0,roof=0,lamps=0,props=0,mess=0,wet=0;const mu=Math.round(mid[0]),mv=Math.round(mid[1]);
  for(let du=-9;du<=9;du++)for(let dv=-9;dv<=9;dv++){const u=mu+du,v=mv+dv;let col=0;for(let y=g-9;y<=g-5;y++){const id=B(u,v,y);if(id===AIR)col++;if(id===DLAMP)lamps++;if(id===DPROP||id===CHARWOOD)props++;if(id===SKULLS||id===COBBLE||id===DCART)mess++;}
    if(col>=4){n++;if(SOLID[B(u,v,g-10)])floor++;if(SOLID[B(u,v,g-4)]||B(u,v,g-4)===DLAMP)roof++;}
    for(let y=g-10;y<=g-4;y++){const id=B(u,v,y);if(isWetId(id)||id===LAVA)wet++;}}
  info('the Broken Gallery at',mu,mv,': open columns',n,'; floored',floor,'; roofed',roof,'; lamps',lamps,'; props',props/4,'; rubble, skulls, a cart',mess,'; water or lava',wet);
  assert(n>=80&&floor===n&&roof===n&&lamps>=1&&props>=8&&mess>=3&&wet===0,'where they met is the Broken Gallery, five high, propped and lit, strewn, sound all round');
  let mo=0,mn=0,co=0,cn=0;for(let t=0.05;t<=1.001;t+=0.05){for(const [a,b,k] of [[M.A,mid,0],[M.C,mid,1]]){const u=Math.round(a[0]+(b[0]-a[0])*t),v=Math.round(a[1]+(b[1]-a[1])*t);
    const [x,z]=wgXZ(P,u,v);if(ground[x-OX+W*(z-OZ)]<g-4)continue;const op=B(u,v,g-9)!==undefined&&!SOLID[B(u,v,g-9)]&&!SOLID[B(u,v,g-8)];if(k){cn++;if(op)co++;}else{mn++;if(op)mo++;}}}
  info('the mine open to it',mo,'of',mn,'; the countermine',co,'of',cn);assert(mo>=mn*0.9&&co>=cn*0.9,'the mine and the countermine run on into it');}
// the battle without end
{toPL(Math.round(mid[0]),Math.round(mid[1]),g-9);underT=0;const ids=new Set();let maxD=0,maxG=0,fought=0,fell=0;
  run(60,()=>{let d=0,gb=0;for(const f of foes){if(f.mine!==P.id)continue;ids.add(f.id);if(f.dead){continue;}if(FOES[f.kind].folk)d++;else gb++;if(f.foe)fought=1;}maxD=Math.max(maxD,d);maxG=Math.max(maxG,gb);fell=foes.filter(f=>f.mine===P.id&&f.dead).length;});
  const [N0,N1]=underN(),kinds=new Set(foes.filter(f=>f.mine===P.id).map(f=>f.kind));
  info('a minute below: dwarves at once up to',maxD,'of',N0,'; goblins',maxG,'of',N1,'; fought',fought,'; lying fallen',fell,'; in all',ids.size,'; kinds',[...kinds].join(','));
  assert(maxD>=N0-2&&maxG>=N1-2&&fought&&fell>=3&&ids.size>N0+N1,'below the gate the dwarves and the goblins fight on, each side made up again as it falls');
  const yOK=foes.filter(f=>f.mine===P.id&&!f.dead).every(f=>f.y<g-4);info('all below ground',yOK);assert(yOK,'the battle stays in the tunnels');}
// once the gate has fallen it is over
{for(const f of [...foes])removeFoe(f);w.s=2;underT=0;run(8);const n=foes.filter(f=>f.mine===P.id).length;w.s=0;info('after the fall, below:',n);assert(n===0,'when the gate has fallen the war under it is over');}
for(const f of [...foes])removeFoe(f);
