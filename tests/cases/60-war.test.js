// The war at the gate (W1, D-068): subtitles that stay and stack; the war kept for each gate found, its four efforts growing with
// play time and with the battles fought, saved and read back; armies that meet in battle: the hosts forming a line that holds,
// their archers loosing volleys at the captain's horn, the wastes charging in a mass; the engines striking where they land; the
// war on the world map and in the journal.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),at=(u,v)=>siteXZ(s,u,v).map(Math.round);
// subtitles
{const a=toastLen('A raiding party of the dwarves makes for the gate'),b=toastLen('Hi'),c=toastLen('word '.repeat(60));
  info('subtitles last',b/1000,'s (a short line),',a/1000,'s (a raid),',c/1000,'s (a very long line)');assert(b>=7000&&a>b&&c<=12000,'subtitles stay at least seven seconds, longer lines longer, up to twelve');}
// the war found, its efforts with play time, saved and read back
const [X,Z]=at(60,0);gen(X,Z);PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;playing=true;
for(const f of [...foes])removeFoe(f);foeSpots.clear();warS.clear();warArmies.length=0;WARS.clear();warPlay=0;warClk=1e9;
warStateTick();const w=WARS.get(P.id);
assert(!!w&&w.log.length===1,'coming near the gate finds its war, written in its chronicle');
const eff=()=>WAR_EFF.map(([k])=>Math.round(warEff(w,k)*100)).join('/');
const e0=eff();warPlay+=1800;const e1=eff();warPlay+=5400;const e2=eff();
info('the four efforts (the ram, the mine, the walls, the sallies): at first',e0,'; after half an hour',e1,'; after two hours',e2,';',warStage(w));
assert(WAR_EFF.every(([k])=>warEff(w,k)>=1)&&warStage(w)==='The gate stands ready to fall'&&e1.split('/').every((v,i)=>i===1?+v>=Math.round(WAR_MEET*100):+v>15&&+v<60),'the efforts grow with play time, all four done in under two hours (the mine already past its meeting with the countermine, D-086)');
warStateTick();info('marks in the chronicle',w.log.length);assert(w.log.length>=17,'each effort\'s quarter marks go into the chronicle');
{const sv=JSON.parse(JSON.stringify(warSave()));assert(Array.isArray(sv.wr)&&sv.wr.length===1&&sv.wr[0].id===P.id&&sv.wpc===Math.round(warPlay),'the war is saved (wr, wpc)');}
warPlay=0;WARS.clear();warStateTick();const W0=WARS.get(P.id);
// the battle: an army of each side comes in along its way and they meet in the pass
let vs=0;const _fs=foeShoot;foeShoot=function(f,S,k){if(f.volley)vs++;return _fs(f,S,k);};
const AL=warArmy(P,true),OR=warArmy(P,false);let line=0,charge=0,fights=0,folkFell=0,orcFell=0,held=0;
for(let k=0;k<150;k++){run(1);
  line=Math.max(line,AL.m.filter(f=>!f.dead&&f.lineHold&&f.lineHold===AL.line).length);held=Math.max(held,AL.m.filter(f=>!f.dead&&f.waitA&&f.waitA.A===AL.line&&f.st==='idle').length);
  charge=Math.max(charge,OR.m.filter(f=>!f.dead&&f.st==='chase').length);fights=Math.max(fights,foes.filter(f=>!f.dead&&f.foe&&f.war).length);}
folkFell=AL.fell||0;orcFell=OR.fell||0;
info('the hosts',AL.N,'(entering:',AL.mus?'muster':'along the way)','; in their line',line,', holding their places',held,'; the warhost',OR.N,', charging at once',charge,'; fighting at once',fights,'; volley arrows',vs,'; fallen: the hosts',folkFell,', the wastes',orcFell);
assert(AL.bat!==undefined&&line>=20&&held>=10,'the hosts form a line across the foe\'s way and hold their places');
assert(charge>=20,'the warhost charges in a mass');
assert(vs>=10,'archers loose volleys at the captain\'s horn');
assert(fights>=30&&folkFell+orcFell>=20,'the armies meet and fight');
foeShoot=_fs;
// the engines strike: a trebuchet stone among orcs, a pot among the hosts
{for(const f of [...foes])removeFoe(f);const y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1,o=addFoe('raider',PL.x+10,y,PL.z,{}),h=addFoe('rspear',PL.x+10.5,y,PL.z+0.5,{}),o0=o.hp,h0=h.hp;
  warSplash(PL.x+10,y,PL.z,false);const o1=o.hp,h1=h.hp;warSplash(PL.x+10,y,PL.z,true);
  info('a stone: the orc',o0,'->',o1,', the spearman',h0,'->',h1,'; a pot: the spearman',h1,'->',h.hp);assert(o1<o0&&h1===h0&&h.hp<h1,'the engines\' shots hurt the other side where they land');for(const f of [...foes])removeFoe(f);}
// the war on the map and in the journal
{let n=0;const g={fillText:()=>n++,beginPath:()=>{},moveTo:()=>{},lineTo:()=>{},stroke:()=>{},set strokeStyle(v){},set lineWidth(v){},set fillStyle(v){}};warMapDraw(g,x=>x,z=>z);
  const out=[];warJournal(out);info('the journal:',out.slice(0,4).join(' | '));assert(n>=1&&out.some(l=>/^The War at The Ashen Gate/.test(l)),'the war is on the world map and in the journal');}
