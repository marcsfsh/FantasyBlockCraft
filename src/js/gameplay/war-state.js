// ---- The war at each gate (W1, D-068; Q138 to Q190). A war is kept for every gate the player has found (`WARS`, saved as `wr`,
// with the war's own play clock `wpc`), and moves on with play time wherever the player is (Q144, Q165): about an hour and a half
// of play takes a gate. The gate falls to four efforts at once (Q142, Q146): the ram's work on the barred leaf, the dwarves' mine
// under the ring, the assaults on the walls, and the orcs' sallies broken before the lines. Each grows with time (`WAR_EFF`, its
// pace a little different at each gate) and with the battles fought there (`warOutcome`: an army of the hosts that storms the
// yard, a warhost broken before the lines; a warhost that breaks through sets the ram and the sallies back a little). Every war
// ends well for the alliance (Q139). The war panel near a gate (Q158), the gates' wars and their lines on the world map
// (`warMapDraw`), and each gate's chronicle in the journal (`warJournal`).
const WAR_EFF=[['ram','The ram',85],['mine','The mine',95],['walls','The walls',80],['sally','The sallies',75]]; // [key, label, minutes of play to finish alone]
const WAR_MARK={ram:['The ram has cracked the barred leaf','The barred leaf splits under the ram','The barred leaf is breaking','The barred leaf can hold no longer'],
  mine:['The dwarves\' mine under the ring is begun','The mine under the ring is half dug','The mine is nearly under the tower','The mine lies under the tower, ready to be fired'],
  walls:['The siege towers are building and the ladders made','The siege towers are ready to be wheeled up','The assaults have half won the gate\'s walk','The gate\'s walk is all but taken'],
  sally:['The orcs\' sallies break on the siege lines','Half the warbands of the yard are spent','The Gatewarden\'s Camp is thinning','The orcs no longer dare to sally']};
const WARS=new Map();let warPlay=saved&&typeof saved.wpc==='number'?saved.wpc:0;
if(saved&&Array.isArray(saved.wr))for(const w of saved.wr)if(w&&w.id&&w.b&&Array.isArray(w.log))WARS.set(w.id,w);
const warSave=()=>({wr:[...WARS.values()],wpc:Math.round(warPlay)});
// how far an effort has come (0 to 1): its pace at this gate since the war was found, and what the battles have added or taken
function warEff(w,k){const E=WAR_EFF.find(e=>e[0]===k),pace=E[2]*60*(0.85+0.3*hsh(w.X,9861+k.length,w.Z));return Math.max(0,Math.min(1,(w.b[k]||0)+(warPlay-w.f)/pace));}
const warAll=w=>WAR_EFF.every(e=>warEff(w,e[0])>=1);
function warStage(w){const fr=w.s>=2?warFront(w):0;if(w.el&&w.el.fate)return 'The war is won';return w.s>=2?(fr<0.02?'The gate has fallen':fr<1?'The hosts push into the basin':'The hosts stand at the foot of the burning mountain'):warAll(w)?'The gate stands ready to fall':'The siege';}
function warLog(w,s){w.log.push([Math.round(warPlay),s]);if(w.log.length>80)w.log.splice(1,1);saveDirty=true;}
// the player comes within 200 of a gate's works: its war is found, and from then on it is kept
function warFound(P){let w=WARS.get(P.id);if(w)return w;
  w={id:P.id,n:P.name,X:P.X,Z:P.Z,camp:P.camp,f:Math.round(warPlay),b:{ram:0.02,mine:0,walls:0,sally:0.05},m:{},w:[0,0],log:[]};WARS.set(P.id,w);
  warLog(w,'You came to '+P.name.replace(/^The /,'the ')+'. The hosts of '+P.camp.replace(/^The /,'the ')+' have it under siege, and '+P.ram+'\'s ram stands at its barred leaf.');
  toast('The siege of '+P.name.replace(/^The /,'the ')+': you have found the war at the gate');return w;}
// every second while playing: the war's clock, finding a gate, each effort's marks (a quarter, a half...), and the panel
function warStateTick(){
  warPlay+=1;const X=PL.x+OX,Z=PL.z+OZ,P=wasteGateAt(Math.floor(X),Math.floor(Z),200),near=P?warFound(P):null;
  for(const w of WARS.values())for(const [k] of WAR_EFF){const q=Math.floor(warEff(w,k)*4);while(q>(w.m[k]||0)){const m=w.m[k]=(w.m[k]||0)+1,s=WAR_MARK[k][m-1];warLog(w,s+'.');if(w===near)toast(s);
      if(m===4&&warAll(w)&&w.s!==2){warLog(w,'All four are done. The hosts make ready for the last assault on the gate.');if(w===near)toast('The hosts make ready for the last assault on the gate');}}}
  // the fall (W2): the last assault's hosts at the leaf; or, the player away, ten minutes after all four were done (half an hour
  // near, should no assault come)
  for(const w of WARS.values()){if(w.s>=2||!warAll(w))continue;if(!w.allT)w.allT=Math.round(warPlay);
    const last=w===near&&warArmies.some(A=>A.last&&A.P===P&&A.m.some(f=>!f.dead&&!f.gone&&wgUV(P,f.x+OX,f.z+OZ)[0]<4));
    if(last||w!==near&&warPlay-w.allT>600||w===near&&warPlay-w.allT>1800)warFall(w,w===near,w===near?P:null);}
  if(near)warWorksTick(P,near);else{const bw=warBasinWar(X,Z);if(bw){wgSite(bw.P);warFrontTick(bw.P,bw.w);}} // (out on the basin's floor: its forward camps, W5)
  warRaidsTick(); // the raids on the bordering realms (W6)
  emberWarTick(); // the Emberlords in the war (W7b)
  emberAfterTick(); // after an Emberlord's fall (W7c)
  warPanel(near);}
// how a battle went (an army done: every soldier fallen or gone): its mark on the war, in the chronicle and on screen
function warOutcome(A){
  const w=WARS.get(A.P.id),N=A.m.length;if(!w||A.def||N<10)return;const fell=A.fell||0,reach=A.reach?A.reach.size:0;if(fell+reach<N*0.35)return; // fought out of sight
  const P=A.P,nm=P.name.replace(/^The /,'the ');let s=null;
  if(w.s>=2){if(A.al&&fell<N*0.5){w.b.fr=(w.b.fr||0)+0.04;s='The hosts pushed the front on into the basin; '+fell+' fell.';warSwornBattle(A);}else if(!A.al&&fell>=N*0.55){w.b.fr=(w.b.fr||0)+0.02;s='A warhost of '+N+' was broken before the front; '+fell+' of them fell.';warSwornBattle(A);}
    else if(!A.al){w.b.fr=Math.max(0,(w.b.fr||0)-0.02);s='A warhost of '+N+' drove the front back a little; '+fell+' of them fell.';}
    if(s){const d=warHeroDeeds(A,w);if(d)s+=' '+d;warLog(w,s);if(Math.hypot(w.X-(PL.x+OX),w.Z-(PL.z+OZ))<400)toast(s);}return;}
  if(A.al){if(reach>=N*0.2){w.b.walls=(w.b.walls||0)+0.05;w.b.ram=(w.b.ram||0)+0.03;w.w[0]++;warSwornBattle(A);s='The hosts stormed '+P.yard.replace(/^The /,'the ')+': '+reach+' went in through the gap, '+fell+' fell.';}
    else if(fell>=N*0.5){w.w[1]++;s='The hosts were thrown back at the gap of '+nm+'; '+fell+' fell.';}}
  else{if(reach>=N*0.25){w.b.ram=(w.b.ram||0)-0.02;w.b.sally=(w.b.sally||0)-0.02;w.w[1]++;s='A warhost of '+N+' broke through to the siege lines and set fire to the ram\'s shed before it was driven back; '+fell+' of them fell.';
      const [rx,rz]=wgXZ(P,18,P.cs*10);warIgnite(w,rx-OX,P.hG+4,rz-OZ,6,40);}
    else if(fell>=N*0.55){w.b.sally=(w.b.sally||0)+0.08;w.w[0]++;warSwornBattle(A);s='A warhost of '+N+' was broken before the siege lines; '+fell+' of them fell.';}}
  if(s){const d=warHeroDeeds(A,w);if(d)s+=' '+d;warLog(w,s);if(Math.hypot(w.X-(PL.x+OX),w.Z-(PL.z+OZ))<400)toast(s);}}
// ---- The war panel (Q158): near a found gate, its stage, the four efforts and how many stand on each side about the player
function warPanel(w){
  const el=$('warpanel');if(!el)return;if(!w||photo){el.style.display='none';return;}el.style.display='block';
  let al=0,orc=0;const X=PL.x,Z=PL.z;for(const f of foes){if(f.dead||Math.hypot(f.x-X,f.z-Z)>160)continue;if(FOES[f.kind].folk){if(!FOES[f.kind].civ)al++;}else orc++;}
  const bar=v=>'<span class="wb"><i style="width:'+Math.round(v*100)+'%"></i></span>';
  el.innerHTML='<b>'+w.n+'</b><div>'+warStage(w)+'</div>'+WAR_EFF.map(([k,lab])=>'<div class="we">'+lab+' '+bar(warEff(w,k))+' '+Math.round(warEff(w,k)*100)+'%</div>').join('')+
    '<div>The hosts '+al+', the wastes '+orc+'</div>'+emberPanel(w)+warRaidPanel(w)+(w.s>=2?warFrontPanel(wasteGateAt(w.X,w.Z,10)||{},w):'')+warArmies.filter(A=>A.hero&&!A.hero.dead&&A.P.id===w.id).map(A=>'<div>'+A.hero.n+' leads '+(A.al?'the hosts':'the warhost')+'</div>').join('')+warSwornPanel();}
// ---- On the world map: each found gate's war, its stage and how far the siege has come, and the two lines across the pass
function warMapDraw(g,sx,sz){
  for(const w of WARS.values()){const P=wasteGateAt(w.X,w.Z,10);const x=sx(w.X),y=sz(w.Z);
    if(P){const line=(u,c)=>{const [ax,az]=wgXZ(P,u,-wgHalf(P,u)+4),[bx,bz]=wgXZ(P,u,wgHalf(P,u)-4);g.strokeStyle=c;g.lineWidth=4;g.beginPath();g.moveTo(sx(ax),sz(az));g.lineTo(sx(bx),sz(bz));g.stroke();};
      line(P.uL+4,'#2a4c9c');line(-22,'#a82a1a');warFrontMap(g,sx,sz,P,w);}warRaidMap(g,sx,sz,w);
    g.strokeStyle='#5a0e06';g.lineWidth=3;g.beginPath();g.moveTo(x-7,y-7);g.lineTo(x+7,y+7);g.moveTo(x+7,y-7);g.lineTo(x-7,y+7);g.stroke();
    const p=Math.round(WAR_EFF.reduce((a,e)=>a+warEff(w,e[0]),0)/4*100);g.fillStyle='#5a0e06';g.fillText(warStage(w)+' of '+w.n.replace(/^The /,'the ')+', '+p+'%',x,y+22);}}
// ---- In the journal: each found war's chronicle, oldest first
function warJournal(out){
  out.push('','THE WARS OF THE WASTES');if(!WARS.size)out.push('None found yet. The Ashen Gates stand in the rings of ash mountains about the Volcanic Wastes.');
  for(const w of WARS.values()){out.push('','The War at '+w.n+' ('+warStage(w).toLowerCase()+'; '+WAR_EFF.map(([k,lab])=>lab.toLowerCase()+' '+Math.round(warEff(w,k)*100)+'%').join(', ')+'; battles won '+w.w[0]+', lost '+w.w[1]+')');
    warHeroJournal(w,out);warRaidJournal(w,out);for(const [t,s] of w.log)out.push('Hour '+(t/3600).toFixed(1)+'. '+s);}
  warSwornJournal(out);}
