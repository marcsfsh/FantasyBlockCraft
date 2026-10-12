// The war at the player's command (D-077, creative): the war's clock stopped or hastened (and running as it goes in survival);
// the events that come by themselves stopped (battles, raids, the lord's wrath) and let run again; any event made to happen now:
// the hosts' army and a warhost, the last assault, parties, scouts, the engines, efforts and the front set by hand, the gate's fall,
// a raid and a siege on the borderlands, an eruption, the lord on the wall, its fate; kept with the world; the console drawn.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;};
const clear=()=>{hostDismiss(null);for(const f of [...foes])removeFoe(f);foeSpots.clear();warArmies.length=0;EMB_HZ.length=0;emberShows.length=0;};
let [X,Z]=at(P.uC0+40,12);gen(X,Z);toPL(X,Z);playing=false;clear();warS.clear();WARS.clear();warPlay=0;warClk=1e9;warStateTick();
const w=WARS.get(P.id),R=warLord(w),E=elOf(w);info('the war at',P.name,'; its lord',R&&R.L.n);
// the clock: stopped, as it goes, twenty times as fast; in survival always as it goes
{const e0=warEff(w,'ram'),p0=warPlay;WC.clk=0;for(let i=0;i<30;i++)warStateTick();const p1=warPlay,e1=warEff(w,'ram');
  WC.clk=20;for(let i=0;i<30;i++)warStateTick();const p2=warPlay,e2=warEff(w,'ram');WC.clk=1;for(let i=0;i<30;i++)warStateTick();const p3=warPlay,e3=warEff(w,'ram');
  setMode('survival');WC.clk=0;for(let i=0;i<10;i++)warStateTick();const p4=warPlay;setMode('creative');WC.clk=1;
  info('the war\'s clock: stopped',p1-p0,'s ; twenty times',p2-p1,'s (the ram',(e2-e1).toFixed(4),'against',(e3-e2).toFixed(4),'as it goes) ; in survival, stopped in creative',p4-p3,'s');
  assert(p1===p0&&e1===e0&&p2-p1===600&&Math.abs((e2-e1)-20*(e3-e2))<1e-6&&p4-p3===10,'the war\'s clock may be stopped or hastened in creative; in survival it runs as it goes');}
// the events that come by themselves, stopped: no parties, armies, raids or eruptions for ten minutes
{WC.a=WC.r=WC.e=0;const st={raid:0,scout:0,army:0,al:false};warS.set(P.id,st);const n0=(w.rd||{n:0}).n;if(w.rd)w.rd.nx=0;emberEruT=emberRumT=emberTauntT=1;E.ash=0;
  for(let i=0;i<600;i++){warClk=1;warTick();if(i%5===0){foeT-=0.05;updFoes(0.05);}}const sent=foes.filter(f=>f.war&&!f.dead).length+warArmies.length;
  info('stopped for ten minutes: soldiers sent',sent,'; raids begun',(w.rd||{n:0}).n-n0,'; ash',E.ash);assert(sent===0&&(w.rd||{n:0}).n===n0&&!(E.ash>0),'stopped, the war\'s events do not come by themselves');
  WC.a=WC.r=WC.e=1;st.raid=st.scout=st.army=0;let came=0;for(let i=0;i<30&&!came;i++){warClk=1;warTick();came=foes.filter(f=>f.war&&!f.dead).length+warArmies.length;}
  info('let run again: soldiers sent',came);assert(came>0,'let run again, they come');clear();}
// now: the hosts' army and a warhost, driven by its lord
{const r1=wcDo('army'),A=warArmies.find(A=>A.al&&!A.def),r2=wcDo('warhost'),B=warArmies.find(A=>!A.al&&!A.def);info(r1,'|',r2,'; driven',B&&B.drive);
  assert(A&&A.N>=100&&B&&B.N>=100&&B.drive,'at the console the hosts attack, or a warhost comes, its lord driving it, when the player wishes');clear();}
{const k0=foes.length;wcDo('party');const al=foes.filter(f=>f.war&&FOES[f.kind].folk).length;wcDo('sally');const o=foes.filter(f=>f.war&&!FOES[f.kind].folk).length;wcDo('scouts');wcDo('goblins');const sc=foes.filter(f=>f.war).length-al-o;
  {const [lx,lz]=at(P.uL+18,6);gen(lx,lz);toPL(lx,lz);}const s0=warStones.length;wcDo('engines');info('a raiding party of the hosts',al,'; orcs sallying',o,'; scouts of both sides',sc,'; stones and pots loosed',warStones.length-s0);
  assert(al>=4&&o>=5&&sc>=4&&warStones.length>s0,'raiding parties, sallies, scouts and the engines at the console\'s word');clear();}
// its lord: the mountain erupts, it shows itself on the wall, its fate
{E.ash=0;wcDo('erupt');{const [gx,gz]=at(40,0);gen(gx,gz);toPL(gx,gz);}wcDo('show');info('erupting: ash',E.ash,'; on the wall',emberShows.length);assert(E.ash>0&&emberShows.length===1,'its mountain erupts and it shows itself on the gate\'s wall at the console\'s word');clear();
  wcDo('fate','bound');info('its fate',E.fate);assert(E.fate==='bound'&&fallenLords.has(R.F.id),'its fate chosen at the console');fallenLords.delete(R.F.id);E.fate=null;const k=emberKnown.get(R.F.id);if(k)k[2]=undefined;}
// efforts by hand; the last assault; the gate falls
{wcDo('effort',['ram',0.5]);wcDo('effort',['mine',1]);info('the ram',warEff(w,'ram').toFixed(3),'; the mine',warEff(w,'mine').toFixed(3));
  assert(Math.abs(warEff(w,'ram')-0.5)<1e-6&&warEff(w,'mine')===1,'each effort set by hand');
  const r=wcDo('last'),A=warArmies.find(A=>A.last);info(r,'; all four done',warAll(w));assert(A&&warAll(w),'the last assault when the player wishes');clear();
  wcDo('fall');info('the gate:',warStage(w));assert(w.s>=2,'the gate falls at the console\'s word (twice pressed)');
  wcDo('effort',['fr',0.5]);info('the front',warFront(w).toFixed(3));assert(Math.abs(warFront(w)-0.5)<1e-6,'beyond the gate the front set by hand');}
// the borderlands: a raid and a siege on the nearest places
{const r1=wcDo('raid'),L1=w.rd&&w.rd.L[w.rd.L.length-1],r2=wcDo('siege'),L2=w.rd&&w.rd.L[w.rd.L.length-1];info('a raid:',r1||'(near)',L1&&L1.k,'; a siege:',r2||'(near)',L2&&L2.k);
  assert(L1&&L1.k==='raid'&&L2&&L2.k==='siege'&&L1!==L2,'a raid or a siege on the bordering realms when the player wishes');}
// kept with the world; the console drawn
{WC.clk=5;WC.r=0;const J=JSON.parse(JSON.stringify(warCtlSave()));info('kept:',JSON.stringify(J.wc).slice(0,120));assert(J.wc.clk===5&&J.wc.r===0&&J.wc.hb.al.r>0,'the war console\'s settings are kept with the world');
  WC.clk=1;WC.r=1;let ok=true;try{openWarConsole();wcRender();closeInv();}catch(e){ok=false;info('console:',e.message);}assert(ok,'the war console draws');}
clear();WARS.clear();playing=false;
