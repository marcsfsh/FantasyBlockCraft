// ---- Sworn to the alliance (W4, D-071; Q140, Q145, Q166, Q168, Q169, Q172). The player may swear to the alliance (only the
// alliance) before the lords of the hosts in the Pavilion of the Three Banners (use one of them: a lord, a captain or a king of
// the hosts at a gate), or be named to it by the captains after fighting beside the hosts (ten of the wastes' creatures slain
// with soldiers of the hosts near); otherwise the player is a spectator. Sworn, the player rises by merit (a creature of the
// wastes slain: one; a battle won near: three) from Levy to Champion of the Three Peoples, each rank proclaimed by the heralds
// under the horns of the peoples; the quartermasters give arms and armour at each rank; from Sergeant a squad of the hosts (four)
// follows the player in the wastes and at the gates and fights at their side, from Captain a company (ten), made whole again as
// they fall; the stores give food, flares, lamp oil and, from Captain, kegs, once in ten minutes of play when the player comes
// to the wagons (no coin). Fallen while sworn near a gate or in the wastes, the player is carried by bearers to the field
// hospital and wakes there with their things. Saved as `sw`.
const WAR_RANKS=[['Levy of the Hosts',0],['Soldier of the Hosts',8],['Sergeant of the Hosts',25],['Captain of the Hosts',55],['Marshal of the Hosts',95],['Lord of the Hosts',150],['Champion of the Three Peoples',230]];
// what each rank is given, and by whom: [[item, count]...], the quartermaster
const WAR_GIFTS=[[[[372,1],[380,1],[206,6]],'the men\'s quartermaster'],[[[373,1],[206,8]],'the riders\' quartermaster'],[[[374,1],[381,1]],'the dwarves\' quartermaster'],
  [[[375,1],[342,1]],'the elves\' quartermaster'],[[[382,1]],'the dwarves\' armourers'],[[[376,1]],'the elves\' smiths'],[[[383,1],[RBANNER,4],[DBANNER,4],[EVBANNER,4]],'the lords of the three peoples']];
const WAR_SQUAD=[0,0,4,10,10,12,14],WAR_LORDS=new Set(['rnoble','elord','dlord','dking','rcapt','ecapt','dcapt','hcapt','wcapt','hthane','wking','wlord']);
let SW=saved&&saved.sw&&typeof saved.sw==='object'?saved.sw:null;if(!SW)SW={on:0,r:0,m:0,p:0,k:0,b:0,sup:-1e9,t:0};
const warSwornSave=()=>({sw:SW}),warSworn=()=>!!SW.on;
// is the player at war (near a gate's works or in the volcanic lands)?
function warZone(){const X=Math.floor(PL.x+OX),Z=Math.floor(PL.z+OZ);return !!wasteGateAt(X,Z,300)||!!warBasinAt(X,Z)||raidZone();}
// sworn: the oath, the first rank and its gifts
function warSwear(how){if(SW.on)return;SW.on=1;SW.r=0;SW.t=Math.round(warPlay);saveDirty=true;
  showText('The Oath of the Three Banners',(how==='deeds'?'The captains of the hosts have watched you fight beside them, and they call you to the Pavilion of the Three Banners. ':'You kneel in the Pavilion of the Three Banners before the lords of men, elves and dwarves. ')+
    'You swear by the realm\'s tower and star, the elves\' undying light and the mountain\'s anvil to hold the line against the wastes, to stand with the hosts until the fires of the Emberlords are put out, and to leave no one of the alliance on the field. '+
    'The lords take your hands in theirs. The heralds write your name in the roll of the hosts. You are '+WAR_RANKS[0][0]+'.');
  warProclaim(0);}
function warProclaim(r){const [n]=WAR_RANKS[r];toast('The heralds proclaim you '+n);['r','d','e'].forEach((p,i)=>setTimeout(()=>warSignal('muster',p,[PL.x,PL.y+4,PL.z]),i*1600));
  const [L,who]=WAR_GIFTS[r],got=[];if(SURV())for(const [id,c] of L){const left=addItem(id,c);if(left)toast('No room for '+nameOf(id));got.push((c>1?c+' ':'')+nameOf(id));}
  if(got.length)setTimeout(()=>toast(who[0].toUpperCase()+who.slice(1)+' give'+(/s$/.test(who)?'':'s')+' you '+got.join(', ')),2500);drawBar(true);
  const w=[...WARS.values()].find(w=>Math.hypot(w.X-(PL.x+OX),w.Z-(PL.z+OZ))<400);if(w)warLog(w,'You were named '+n+'.');}
// merit, and a rank when it is earned
function warMerit(n){if(!SW.on)return;SW.m+=n;let r=SW.r;while(r+1<WAR_RANKS.length&&SW.m>=WAR_RANKS[r+1][1])r++;if(r>SW.r){SW.r=r;warProclaim(r);}saveDirty=true;}
// the player slays a creature of the wastes (from foeSlain): merit, or, not yet sworn, deeds seen by the hosts
function warSwornSlain(f){const F=FOES[f.kind];if(F.folk||!warZone())return;SW.k++;
  if(SW.on){warMerit(1);return;}if(!foes.some(g=>!g.dead&&FOES[g.kind].folk&&!FOES[g.kind].civ&&Math.hypot(g.x-PL.x,g.z-PL.z)<24))return;
  SW.p++;if(SW.p===5)toast('The soldiers of the hosts mark how you fight');if(SW.p>=10)warSwear('deeds');saveDirty=true;}
// a battle the hosts won with the player near (from warOutcome)
function warSwornBattle(A){if(!SW.on||Math.hypot(...warMid(A).map((v,i)=>v-(i?PL.z:PL.x)))>150)return;SW.b++;warMerit(3);}
// using one of the lords of the hosts: the oath, or (sworn) where the player stands
function warOathAct(){const f=foeHit(4.6);if(!f||f.dead||!FOES[f.kind].folk||!(WAR_LORDS.has(f.kind)||f.hero)||!(f.site&&f.site.k==='wgate'||f.war))return false;
  if(!SW.on){warSwear('oath');return true;}const r=SW.r,nx=WAR_RANKS[r+1];
  showText(WAR_RANKS[r][0],'Sworn in hour '+(SW.t/3600).toFixed(1)+' of the war. Merit '+SW.m+(nx?' ('+nx[1]+' for '+nx[0]+')':'')+'; battles won beside the hosts '+SW.b+'; creatures of the wastes slain '+SW.k+'. '+
    (WAR_SQUAD[r]?'Your '+(WAR_SQUAD[r]>4?'company':'squad')+' of '+WAR_SQUAD[r]+' follows you in the wastes and at the gates.':'From Sergeant a squad of the hosts will follow you.'));return true;}
// ---- the squad: as many of the hosts as the rank gives, following the player in the wastes and at the gates, each to a place
// about them, fighting what comes near; the fallen replaced one at a time
const WAR_SQ_T=['r_host','d_host','e_host','w_host','h_host'];
function warSquadTick(){const n=SW.on&&warZone()?WAR_SQUAD[SW.r]:0;warFollow(1,n,WAR_SQ_T,'Your '+(n>4?'company':'squad')+' of the hosts falls in behind you');}
// ---- the stores: at the Leaguer's wagons, once in ten minutes of play
function warStores(P){if(!SW.on||warPlay-SW.sup<600||!SURV())return;const s=wgSite(P),L=s.lay.parts.filter(p=>p.k==='lgwagon');if(!L.length)return;
  let u=0,v=0;for(const p of L){u+=(p.u0+p.u1)/2;v+=(p.v0+p.v1)/2;}const [X,Z]=siteXZ(s,u/L.length,v/L.length);if(Math.hypot(X-(PL.x+OX),Z-(PL.z+OZ))>18)return;
  SW.sup=Math.round(warPlay);const G=[[206,4],[335,2],[326,2],[338,1]].concat(SW.r>=3?[[TNT,2]]:[]),got=[];for(const [id,c] of G){if(!addItem(id,c))got.push(c+' '+nameOf(id));}
  drawBar(true);toast('The quartermaster hands you '+got.join(', '));saveDirty=true;}
// ---- the hospital: fallen while sworn at war, the player is carried there (from die)
let warWake=null;
function warHospitalWake(){if(!SW.on||!SURV())return false;const X=Math.floor(PL.x+OX),Z=Math.floor(PL.z+OZ);let P=wasteGateAt(X,Z,400);
  if(!P){const B=warBasinAt(X,Z);P=B&&wasteGateOf(B);}
  if(!P)return false;const [hx,hz]=warHosp(P);warWake=[hx+0.5,hz+0.5];return true;}
function warWakeUp(){const [X,Z]=warWake;warWake=null;if(Math.abs(X-(PL.x+OX))>W/2-40||Math.abs(Z-(PL.z+OZ))>D/2-40)regenerateAll(X,Z);
  const x=X-OX,z=Z-OZ;let y=H-2;while(y>1&&!SOLID[get(Math.floor(x),y,Math.floor(z))])y--;PL.x=x;PL.z=z;PL.y=y+1;PL.vx=PL.vy=PL.vz=0;while(collide()&&PL.y<H-2)PL.y++;
  fallTop=null;gliding=false;hp=14;toast('You wake in the field hospital of the Leaguer');}
// ---- every second (from warTick): the squad, the stores
function warSwornTick(){if(!SW.on)return;warSquadTick();const P=wasteGateAt(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),300);if(P)warStores(P);}
// the journal and the panel
function warSwornJournal(out){if(!SW.on){out.push('','YOUR PART','You have not sworn to the alliance. Use one of the lords of the hosts in the Leaguer of a gate to swear the oath, or fight beside the hosts.');return;}
  out.push('','YOUR PART',WAR_RANKS[SW.r][0]+', sworn in hour '+(SW.t/3600).toFixed(1)+'. Merit '+SW.m+'; battles won beside the hosts '+SW.b+'; creatures of the wastes slain '+SW.k+'.');}
const warSwornPanel=()=>SW.on?'<div>You: '+WAR_RANKS[SW.r][0]+' (merit '+SW.m+')</div>':'';
