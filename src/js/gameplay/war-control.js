// ---- The war at the player's command (D-077, creative). The war's own clock (warPlay, by which the efforts, the front, the raids,
// the lords' vents and the healing of the land go on) may be stopped or hastened, five or twenty times; the war's events that come
// by themselves may each be stopped: the battles at the gates and beyond them (parties, scouts, armies, the engines, the deep's
// warbands), the raids on the bordering realms (raids, sieges, wolf riders, ambushes) and the Emberlords' wrath (rumbles,
// eruptions, taunts, showing themselves); and any of them may be made to happen now, from the war console (ui/war-console.js).
// In survival the war runs as it always does. Kept with the world as `wc`, with the make of the hosts last summoned.
let WC=saved&&saved.wc&&typeof saved.wc==='object'?saved.wc:null;if(!WC)WC={clk:1,a:1,r:1,e:1,hb:{al:hostMake('al',500),o:hostMake('o',500)}};
const warCtlSave=()=>({wc:WC});
const WAR_CLOCKS=[[0,'Stopped'],[1,'As it goes'],[5,'Five times as fast'],[20,'Twenty times as fast']];
const warRate=()=>SURV()?1:WC.clk; // seconds of the war's clock to each second of play
const warAuto=k=>SURV()||WC[k]!==0; // does this kind of event ('a' battles, 'r' raids, 'e' the lords) come by itself?
// the war the console works on: the gate within 300, the basin's war about the player, or the nearest found
function wcWar(){const X=PL.x+OX,Z=PL.z+OZ,P=wasteGateAt(Math.floor(X),Math.floor(Z),300);if(P)return {w:warFound(P),P:P,near:wasteGateAt(Math.floor(X),Math.floor(Z),200)===P}; // (near: where its armies march, as warMarch has it)
  const bw=warBasinWar(X,Z);if(bw)return {w:bw.w,P:bw.P,near:false};let best=null,bd=1e9;for(const w of WARS.values()){const d=Math.hypot(w.X-X,w.Z-Z);if(d<bd){bd=d;best=w;}}
  return best?{w:best,P:wasteGateAt(best.X,best.Z,10),near:false,d:Math.round(bd)}:null;}
// an effort (ram, mine, walls, sally) or the front set to v (0 to 1): what the battles have added is set so that, with the clock, it
// comes to v now; the marks passed are written again when it passes them again
function wcEffort(w,k,v){v=Math.max(0,Math.min(1,v));
  if(k==='fr'){if(!(w.s>=2))return false;const pace=warFrontPace(w);w.b.fr=v-(warPlay-(w.fallT||0))/pace;saveDirty=true;return true;}
  const E=WAR_EFF.find(e=>e[0]===k),pace=E[2]*60*(0.85+0.3*hsh(w.X,9861+k.length,w.Z));w.b[k]=v-(warPlay-w.f)/pace;w.m[k]=Math.min(w.m[k]||0,Math.floor(v*4));if(v<1)w.allT=0;saveDirty=true;return true;}
// the events, now: each returns what to tell the player
const WC_NEED='Go to the gate first: within 200 blocks of its works';
function wcDo(what,arg){
  const C=wcWar();if(!C)return 'No war found yet. The Ashen Gates stand in the rings of ash mountains about the Volcanic Wastes';
  const {w,P}=C,R=warLord(w),fallen=w.s>=2,E=elOf(w);
  switch(what){
    case 'army':case 'warhost':case 'last':{if(!C.near||!P)return WC_NEED;if(E.fate)return 'The war is won: no army marches';
      if(what==='last'){if(fallen)return 'The gate has fallen already';for(const [k] of WAR_EFF)if(warEff(w,k)<1)wcEffort(w,k,1);}
      const A=warArmy(P,what!=='warhost');if(!A.al)emberDrive(A);if(what==='last'){A.last=1;return 'The last assault: the hosts come against '+P.name.replace(/^The /,'the ')+' with all their strength';}
      return A.al?'The hosts march, '+A.N+' strong':'A warhost comes, '+A.N+' strong';}
    case 'drakes':{const A=warArmies.find(A=>!A.al&&!A.def);const [cx,cz]=A?warMid(A):[PL.x,PL.z];drakeSpawn(cx,cz,A);drakeSpawn(cx,cz,A);return 'Ash drakes come over '+(A?'the warhost':'you');}
    case 'pitched':{if(!C.near||!P)return WC_NEED;if(E.fate)return 'The war is won: no army marches';const F=fieldBattle(P);return F?'':'No battle';}
    case 'party':case 'sally':{if(!C.near||!P)return WC_NEED;warRaid(P,what==='party'?'al':'o');return '';}
    case 'scouts':case 'goblins':{if(!C.near||!P)return WC_NEED;warScout(P,what==='scouts'?'al':'o');return '';}
    case 'engines':{if(!C.near||!P)return WC_NEED;const n0=warStones.length;for(let i=0;i<24&&warStones.length<n0+3;i++)warVolley(P);return warStones.length>n0?'The engines loose':'Go nearer the siege lines to see the engines loose';}
    case 'fall':{if(fallen)return 'The gate has fallen already';for(const [k] of WAR_EFF)wcEffort(w,k,1);warFall(w,!!C.near,C.near?P:null);return C.near?'':w.n+' has fallen';}
    case 'effort':{const [k,v]=arg;return wcEffort(w,k,v)?'':'Not until the gate has fallen';}
    case 'raid':case 'siege':{let B=null;for(let k=0;k<40000&&!B;k++)B=warBorder(w);if(!B)return 'No realm borders this war';if(!w.rd)warRaidsTick();
      const X=PL.x+OX,Z=PL.z+OZ,L=B.S.filter(e=>what==='siege'?e.s.k==='city'||e.s.k==='fort':RAID_MAX[e.s.k]>0).sort((a,b)=>Math.hypot(a.s.X-X,a.s.Z-Z)-Math.hypot(b.s.X-X,b.s.Z-Z));
      if(!L.length)return 'No place of the borderlands to '+what;const r=raidBegin(w,B,w.rd,{s:L[0].s,siege:what==='siege'});
      return r?(Math.hypot(L[0].s.X-X,L[0].s.Z-Z)<900?'':'The wastes march on '+L[0].s.name+', '+Math.round(Math.hypot(L[0].s.X-X,L[0].s.Z-Z))+' blocks from you'):'No raid';}
    case 'roam':case 'ambush':{if(!realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ)))return 'Stand in a province bordering a war';if(what==='roam')raidRoamT=0;else raidAmbT=0;raidBorderTick();return '';}
    case 'erupt':case 'show':case 'drive':case 'sally2':case 'rite':case 'fate':{if(!R)return 'This war has no lord';if(E.fate||fallenLords.has(R.F.id))return R.L.n+'\'s fate is told already';
      if(what==='erupt'){const d=Math.hypot(PL.x+OX-R.G.X,PL.z+OZ-R.G.Z);emberErupt(w,R,d);return d<900?'':R.L.mt.replace(/^the /,'The ')+' erupts, '+Math.round(d)+' blocks from you';}
      if(what==='show'){if(!C.near&&!fallen)return WC_NEED;emberShow(w,R);return '';} // (on the gate's wall; after its fall on its crater's rim, if that is near)
      if(what==='drive'){const A=warArmies.filter(A=>!A.al&&!A.def&&A.P.id===w.id);if(!A.length)return 'No warhost of this war is marching';for(const a of A)emberDrive(a);return R.L.n+' roars from its mountain and drives the warhosts on';}
      const F=R.F,tX=F.GX+F.ox*10,tZ=F.GZ+F.oz*10,dg=Math.hypot(PL.x+OX-tX,PL.z+OZ-tZ);
      if(what==='sally2'){if(dg>150)return 'Go before the gate of its fortress first';const f=emberSally(w,R);return f?'':'It does not come out now';}
      if(what==='rite'){if(dg>90)return 'Go before the gate of its fortress first';if(emberRiteS)return 'The rite is under way';const y=foeStand(PL.x,PL.y+2,PL.z,2);if(y<0)return 'Stand on open ground';emberRite(w,R,PL.x,y,PL.z);return '';}
      if(what==='fate'){if(!EMBER_FATE[arg])return '';emberFate(w,R,arg,null);return '';}}
  }
  return '';}
// the war console's controls for the hosts: summon from the make kept in WC.hb
function wcSummon(side,led){const H=hostSummon(side,WC.hb[side],led);saveDirty=true;return H;}
