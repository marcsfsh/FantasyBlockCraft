// ---- Custom hosts (D-077): in creative the player summons hosts of the alliance or of the wastes, of any make and of thousands,
// from the war console (ui/war-console.js), and leads them. A host stands in ranks (`hostSlots`): shields and blades in front, the
// great beasts behind them, archers behind those, healers, bearers and standards at the back, horsemen on the wings. One the player
// leads follows behind them in the way they go, holds where it stands, marches to where they look, charges whatever of the other
// side is near, or looses a volley; a host summoned against the player forms where they look, facing them, and holds, advances on
// their hosts or charges (the wastes' charge by themselves once the foe is near). Its soldiers come in rank by rank (`HOST_RATE` a
// frame), keep their ranks unless charging, fight what comes within reach, and lie a while when they fall. Hosts are not saved;
// they are dismissed when the player leaves creative.
const HOSTS=[];let hostSeq=1;
const HOST_MAX=6000,HOST_RATE=40;
// the companies a host is made of: [key, label, table of FOE_HOME (or a kind), its captain, its standard bearer]
const HOST_UNITS={al:[['r','Men of the white realm','r_host','rcapt','rstd'],['kn','Knights and lancers','x_kn',null,null],['h','Riders of the plains','h_host','hcapt',null],
    ['e','High elves','e_host','ecapt','estd'],['w','Wood elves','w_host','wcapt',null],['d','Dwarves of the mountain','d_host','dcapt','dstd'],['g','Household guards','x_eg',null,null],['aid','Healers and bearers','x_aid',null,null]],
  o:[['oarmy','Orcs of the warhosts','oarmy','ochief',null],['oline','Shield orcs and crossbows','oline',null,null],['oscout','Goblins','oscout','gchief',null],['owolf','Wolf riders','owolf',null,null],
    ['oswarm','Goblin swarms and pot-throwers','oswarm',null,null],['oroused','Drummers and fire shamans','oroused',null,null],['troll','Ash trolls','troll',null,null],['otroll','Siege trolls','otroll','tdriver',null],['owb','War beasts','owb','tdriver',null]]};
// a host's make by default, in shares of its whole
const HOST_MIX={al:{r:30,kn:6,h:10,e:18,w:8,d:22,g:2,aid:4},o:{oarmy:45,oline:15,oscout:14,owolf:8,oswarm:7,oroused:5,troll:2,otroll:2,owb:2}};
const hostMake=(side,n)=>{const M=HOST_MIX[side],t=Object.values(M).reduce((a,b)=>a+b,0),o={},K=Object.keys(M);let left=n;for(const k of K){o[k]=Math.floor(n*M[k]/t);left-=o[k];}
  K.sort((a,b)=>(n*M[b]/t)%1-(n*M[a]/t)%1);for(let i=0;left>0;i++,left--)o[K[i%K.length]]++;return o;}; // (the shares rounded so that they come to n)
const hostLive=H=>H.m.filter(f=>!f.dead&&!f.gone);
const hostSoldiers=()=>{let n=0;for(const H of HOSTS)n+=H.q.length+hostLive(H).length;return n;};
const hostKind=(t,lead)=>FOES[t]?t:pickW(FOE_HOME[t]);
// the forward and across of a facing (the foes' yaw: atan2 of the way they look)
const hostAxes=face=>{const fx=Math.sin(face),fz=Math.cos(face);return [fx,fz,-fz,fx];};
// each soldier's place in the ranks, [kind, across, along] with along 0 at the front rank and less behind it
function hostSlots(kinds,form){
  const F=k=>FOES[k],big=k=>(F(k).tall||2)>2.5&&!F(k).mount,grp=[[],[],[],[],[],[]];
  for(const k of kinds){const G=F(k);grp[G.hound?5:G.mount?3:big(k)?1:G.civ||G.std||G.bear||G.heal?4:G.shot&&G.shot.k!=='fire'?2:0].push(k);}
  grp[0].sort((a,b)=>(F(b).pike||0)+(F(b).block||0)-(F(a).pike||0)-(F(a).block||0));
  if(form==='square')return hostSquare(grp); // (W8b: the square, the wall, the wedge and loose order; the line as before)
  const L=form==='loose'?1.9:form==='wall'?0.75:1,inf=grp[0].length+grp[2].length,files=Math.max(10,Math.min(90,Math.round(Math.sqrt(inf*3)))),out=[];let b=0;
  const ranks=(G,sp,dp)=>{const per=Math.max(4,Math.round(files*1.5/sp));for(let i=0;i<G.length;i++){const r=Math.floor(i/per),n=Math.min(per,G.length-r*per);out.push([G[i],((i%per)-(n-1)/2)*sp,b-r*dp]);}
    if(G.length)b-=Math.ceil(G.length/per)*dp+0.6;};
  if(form==='wedge'){let R=0;grp[0].forEach((k,i)=>{const r=Math.floor((Math.sqrt(8*i+1)-1)/2),c=i-r*(r+1)/2;R=r;out.push([k,(c-r/2)*1.5,-r*1.5]);});if(grp[0].length)b=-(R+1)*1.5-0.6;}
  else ranks(grp[0],1.5*L,1.7*L);
  ranks(grp[1],3.4,3.6);ranks(grp[2],1.6*L,1.7*L);ranks(grp[4],1.8,1.8);
  const w0=files*0.75*L+3.5;grp[3].forEach((k,i)=>{const s=i%2?1:-1,j=Math.floor(i/2);out.push([k,s*(w0+(j%5)*2.2),-Math.floor(j/5)*2.6]);}); // horsemen on the wings
  const per=Math.max(4,Math.round(files*1.5*L/2.4));grp[5].forEach((k,i)=>{const r=Math.floor(i/per),n=Math.min(per,grp[5].length-r*per);out.push([k,((i%per)-(n-1)/2)*2.4,2.4+r*1.8]);}); // the hounds before the line (W8b)
  return out;}
// a soldier's place in the world (local coordinates): its slot about the host's anchor, facing its way
function hostSlotAt(H,f){const [fx,fz,ax,az]=hostAxes(H.face);return [H.ax-OX+fx*f.sb+ax*f.sa,H.az-OZ+fz*f.sb+az*f.sa];}
// Summons a host: side 'al' or 'o'; make {unit key: count}; led by the player (behind them) or against them (where they look)
function hostSummon(side,make,led){
  if(creativeOnly())return null;const U=HOST_UNITS[side],kinds=[];let room=HOST_MAX-hostSoldiers();
  for(const [key,,t,cap,std] of U){const n=Math.max(0,Math.min(room,Math.round(+make[key]||0)));room-=n;for(let i=0;i<n;i++)kinds.push(cap&&i%50===0?cap:std&&i%100===1?std:hostKind(t));} // a captain to each fifty, a standard to each hundred
  if(!kinds.length){toast(room<=0?'No more: '+HOST_MAX+' soldiers of summoned hosts at most':'Choose how many of each');return null;}
  const yaw=PL.yaw,pf=[-Math.sin(yaw),-Math.cos(yaw)],H={id:hostSeq++,side:side,led:!!led,m:[],q:[],N:kinds.length,cmd:'hold',t0:foeClock,en:[],enT:0,quiet:0,pace:side==='al'?1.45:1.7,ci:0,form:'line'};
  if(led){H.face=Math.atan2(pf[0],pf[1]);H.ax=PL.x+OX-pf[0]*5;H.az=PL.z+OZ-pf[1]*5;H.cmd='follow';H.fx=PL.x+OX;H.fz=PL.z+OZ;}
  else{let [X,Z]=hostLook(70);const dx=X-(PL.x+OX),dz=Z-(PL.z+OZ),dl=Math.hypot(dx,dz)||1;let m=dl; // (its ranks within the loaded world: nearer, if need be)
    while(m>20){const x=PL.x+dx/dl*m,z=PL.z+dz/dl*m;if(x>40&&z>40&&x<W-40&&z<D-40)break;m-=5;}X=PL.x+OX+dx/dl*m;Z=PL.z+OZ+dz/dl*m;H.ax=X;H.az=Z;H.face=Math.atan2(-dx,-dz);}
  H.FA={hold:true,go:false,goT:0,gap:0,face:H.face,line:1,near:5};H.W={A:H.FA,r:0};
  const sl=hostSlots(kinds);for(let i=0;i<sl.length;i++)H.q.push(sl[i]);H.q.reverse(); // (the front ranks first)
  HOSTS.push(H);const nm=side==='al'?'the alliance':'the wastes';
  toast((led?'A host of '+nm+' comes to your banner, ':'A host of '+nm+' gathers against you, ')+kinds.length+' strong');if(led)setTimeout(()=>hint('host'),2500);warSignal('muster',side==='al'?'r':'o',[PL.x,PL.y+4,PL.z]);return H;}
// where the player looks: the ground there (world coordinates), or as far as `d` ahead
function hostLook(d){const hit=raycast(eyePos(),camDir(),Math.max(d,200));if(hit&&Math.hypot(hit.x+0.5-PL.x,hit.z+0.5-PL.z)>=Math.min(40,d))return [hit.x+OX+0.5,hit.z+OZ+0.5];
  return [PL.x+OX-Math.sin(PL.yaw)*d,PL.z+OZ-Math.cos(PL.yaw)*d];}
// the next few of a host's soldiers come in, each at its place (or near it, where there is footing)
function hostCome(H){
  for(let k=0;k<HOST_RATE&&H.q.length;k++){const [kind,sa,sb,sf]=H.q.pop(),F=FOES[kind],tall=F.tall||2,f0={sa:sa,sb:sb},[x,z]=hostSlotAt(H,f0);let p=null;
    for(const [dx,dz] of [[0,0],[0.7,0],[-0.7,0],[0,0.7],[0,-0.7],[1.4,1.4],[-1.4,-1.4]]){const bx=Math.floor(x+dx),bz=Math.floor(z+dz);if(bx<2||bz<2||bx>=W-2||bz>=D-2||!genDone[(bx>>4)+(bz>>4)*NCX])continue;
      const y=foeStand(x+dx,ground[bx+W*bz]+2,z+dz,tall);if(y>0&&!foeWet(x+dx,y,z+dz)){p=[x+dx,y,z+dz];break;}}
    if(!p){H.lost=(H.lost||0)+1;continue;}
    const f=addFoe(kind,p[0],p[1],p[2],{st:'idle',t:1,grp:1e6+H.id*1000+Math.floor(H.m.length/50)});f.hst=H;f.sa=sa;f.sb=sb;f.sf=sf||0;f.fm=H.form;f.yaw=f.hd=H.face+f.sf;f.hx=f.x;f.hz=f.z;f.waitA=H.W;f.lineHold=H.FA;f.pace=Math.min(H.pace,F.walk*1.4);H.m.push(f);}}
// the anchor that puts the host's ranks about where its soldiers stand now (its middle less their places' mean)
function hostHere(H){const L=hostLive(H);if(!L.length)return;const [mx,mz]=hostMid(H),[fx,fz,ax,az]=hostAxes(H.face);let a=0,b=0;for(const f of L){a+=f.sa;b+=f.sb;}a/=L.length;b/=L.length;
  H.ax=mx+OX-fx*b-ax*a;H.az=mz+OZ-fz*b-az*a;}
// the living of the other side about a host (each second), nearest its middle first; the charge picks among the nearest 300
function hostFoes(H){const [cx,cz]=hostMid(H),out=[],ally=H.side==='al';for(const g of foes){if(g.dead||g.gone||g.show||g.wnd||!FOES[g.kind].folk===!ally||FOES[g.kind].civ&&!ally)continue;const d=Math.hypot(g.x-cx,g.z-cz);if(d<160){g.hd2=d;out.push(g);}}
  out.sort((a,b)=>a.hd2-b.hd2);H.en=out;H.en0=out.slice(0,300);return out;}
function hostMid(H){const L=hostLive(H);if(!L.length)return [H.ax-OX,H.az-OZ];let x=0,z=0;for(const f of L){x+=f.x;z+=f.z;}return [x/L.length,z/L.length];}
const hostNearest=(f,L,r)=>{let best=null,bd=r;for(const g of L){if(g.dead||g.gone||g.wnd)continue;const d=Math.hypot(g.x-f.x,g.z-f.z);if(d<bd){bd=d;best=g;}}return best;};
// one soldier's turn: in the charge, at the nearest foe; else to its place in the ranks, there to stand facing the host's way
function hostStep(H,f){
  if(f.rout||f.wnd)return; // (running, or lying wounded: W8b)
  if(H.cmd==='charge'){if(f.foe&&!f.foe.dead&&!f.foe.gone)return;const g=hostNearest(f,H.en0||H.en,180);if(g){f.foe=g;f.eseen=0;f.st='chase';f.seen=0;f.t=0;f.waitA=null;f.lineHold=null;return;}}
  if(f.st==='chase'||f.st==='flee')return;
  f.waitA=H.W;f.lineHold=H.FA;const F=FOES[f.kind],[tx,tz]=hostSlotAt(H,f),d=Math.hypot(tx-f.x,tz-f.z);
  if((d>70||d>3&&f.stuck>8)&&Math.hypot(f.x-PL.x,f.z-PL.z)>(d>70?40:24)){const bx=Math.floor(tx),bz=Math.floor(tz);if(bx>=2&&bz>=2&&bx<W-2&&bz<D-2&&genDone[(bx>>4)+(bz>>4)*NCX]){const y=foeStand(tx,ground[bx+W*bz]+2,tz,F.tall||2);if(y>0){f.x=tx;f.z=tz;f.y=f.gy=y;f.stuck=0;return;}}} // a straggler far behind, or stuck, catches up out of sight
  if(d>1.1){f.hx=tx;f.hz=tz;f.hex=true;f.way=[];f.st='return';f.t=d/F.walk+10;f.pace=d>9?F.run:Math.min(H.pace,F.walk*1.4)*(H.form==='wall'?0.8:1);}
  else if(f.st==='idle')f.hd=H.face+(f.sf||0);}
// every frame: soldiers come in, each host's commands are carried out a slice of its soldiers at a time, the led hosts follow
function hostFrame(dt){
  if(!HOSTS.length)return;if(SURV()){hostDismiss(null,'Your summoned hosts go back where they came from: they belong to creative');return;}
  for(let h=HOSTS.length-1;h>=0;h--){const H=HOSTS[h];hostCome(H);const L=hostLive(H);
    if(!H.q.length&&!L.length){HOSTS.splice(h,1);if(!H.gone)toast(H.led?'Your host is gone: the last of it has fallen':'The host against you is gone');continue;}
    if((H.enT-=dt)<=0){H.enT=1;H.m=H.m.filter(f=>!f.gone);const en=hostFoes(H);hostAuto(H,en);if(h===0)hostClearDead();}
    if(H.led&&H.cmd==='follow')hostFollow(H);
    const n=Math.max(1,Math.ceil(L.length/12));for(let k=0;k<n&&L.length;k++){H.ci=(H.ci+1)%L.length;hostStep(H,L[H.ci]);}}}
// a led host following: behind the player, facing the way they went (it moves once they have gone four blocks)
function hostFollow(H){const X=PL.x+OX,Z=PL.z+OZ,dx=X-H.fx,dz=Z-H.fz,d=Math.hypot(dx,dz);if(d<4)return;
  H.face=Math.atan2(dx,dz);H.FA.face=H.face;H.fx=X;H.fz=Z;H.ax=X-Math.sin(H.face)*5;H.az=Z-Math.cos(H.face)*5;}
// what a host does by itself: a charge with no foe left near holds where it is; a host against the player advancing charges when
// near, and the wastes' charge as soon as the foe is within 45
function hostAuto(H,en){const [cx,cz]=hostMid(H);let near=1e9;for(const g of en)near=Math.min(near,Math.hypot(g.x-cx,g.z-cz));
  if(H.cmd==='charge'){if(near>150){if((H.quiet+=1)>=5){hostOrder(H,'hold');morCheer(hostLive(H));if(H.led)toast('The field is yours: your host holds where it stands');}}else H.quiet=0;return;}
  if(!H.led&&H.cmd==='advance'){const T=HOSTS.filter(G=>G.led&&hostLive(G).length);let tx=PL.x,tz=PL.z;if(T.length)[tx,tz]=hostMid(T[0]);H.face=Math.atan2(tx-cx,tz-cz);H.FA.face=H.face;H.ax=tx+OX-Math.sin(H.face)*20;H.az=tz+OZ-Math.cos(H.face)*20;}
  if(!H.led&&near<(H.cmd==='advance'?30:45)&&(H.side==='o'||H.cmd==='advance'))hostOrder(H,'charge');}
// an order to a host: follow, hold, march (to where the player looks), charge, advance (a host against the player)
function hostOrder(H,cmd){
  const [cx,cz]=hostMid(H);H.quiet=0;
  if(cmd==='hold'){hostHere(H);if(H.cmd==='charge'){const L=hostLive(H);for(const f of L)if(!f.foe&&f.st!=='chase'){f.waitA=H.W;f.lineHold=H.FA;}}}
  else if(cmd==='march'){const [X,Z]=hostLook(60);H.face=Math.atan2(X-(PL.x+OX),Z-(PL.z+OZ));H.ax=X;H.az=Z;}
  else if(cmd==='follow'){H.fx=PL.x+OX;H.fz=PL.z+OZ;const pf=[-Math.sin(PL.yaw),-Math.cos(PL.yaw)];H.face=Math.atan2(pf[0],pf[1]);H.ax=H.fx-pf[0]*5;H.az=H.fz-pf[1]*5;}
  else if(cmd==='charge'){hostFoes(H);for(const f of hostLive(H)){f.waitA=null;f.lineHold=null;if(H.form==='wedge')f.chgT=foeClock+8;}H.ci=0;morCry(hostLive(H));}
  H.FA.face=H.face;H.cmd=cmd;H.FA.hold=cmd!=='charge';
  const people=H.side==='al'?'r':'o',[mx,mz]=hostMid(H);warSignal(cmd==='charge'?'advance':cmd==='hold'?'muster':'advance',people,[mx,PL.y+3,mz]);if(cmd==='charge')setTimeout(()=>warCry(H.side==='o',18,mx,PL.y+2,mz),600);
  // every soldier at once (not a slice): the ranks move together
  for(const f of hostLive(H))hostStep(H,f);}
// orders to the hosts the player leads (from the keys and the console)
function hostCommand(cmd){if(creativeOnly())return;const L=HOSTS.filter(H=>H.led&&(H.q.length||hostLive(H).length));if(!L.length){toast('You lead no host. Summon one from the war console ('+ctl('warConsole')+')');return;}
  if(cmd==='volley'){let n=0;for(const H of L)n+=hostVolley(H);toast(n?'Loose! '+n+' archers draw and loose':'No archer of yours has a foe within bowshot');return;}
  for(const H of L)hostOrder(H,cmd);toast({follow:'Your host follows you',hold:'Your host holds where it stands',march:'Your host marches to where you look',charge:'Charge! Your host falls on the foe'}[cmd]);}
// a volley: each archer of the host at a foe within 60 of it, at once on the horn
function hostVolley(H){const en=hostFoes(H);let n=0;if(!en.length)return 0;const [mx,mz]=hostMid(H);
  for(const f of hostLive(H)){const S=FOES[f.kind].shot;if(!S||S.k==='fire'||f.atk)continue;const T=en.filter(g=>Math.hypot(g.x-f.x,g.z-f.z)<60);if(!T.length)continue;f.volT=foeClock+0.6+Math.random()*0.4;f.volG=T[Math.floor(Math.random()*T.length)];n++;}
  if(n)warSignal('volley',H.side==='al'?'r':'o',[mx,PL.y+3,mz]);return n;}
// the fallen of the summoned hosts lie a while; beyond HOST_DEAD the longest fallen go first
const HOST_DEAD=400;
function hostClearDead(){const L=foes.filter(f=>f.dead&&f.hst&&!f.gone);if(L.length<=HOST_DEAD)return;L.sort((a,b)=>b.dead-a.dead);for(let i=0;i<L.length-HOST_DEAD;i++)removeFoe(L[i]);}
// sends hosts away: one, or all of them (H null)
function hostDismiss(H,say){for(const G of H?[H]:HOSTS.slice()){G.gone=1;for(const f of G.m)if(!f.gone)removeFoe(f);G.q.length=0;const i=HOSTS.indexOf(G);if(i>=0)HOSTS.splice(i,1);}if(say)toast(say);}
// the bar of orders while the player leads a host, and the counts
function hostBar(){const el=$('hostbar');if(!el)return;const L=HOSTS.filter(H=>H.led),E=HOSTS.filter(H=>!H.led);if(!HOSTS.length||photo||SURV()){el.style.display='none';return;}el.style.display='block';
  const c=A=>A.reduce((a,H)=>a+hostLive(H).length,0),n=A=>A.reduce((a,H)=>a+H.N,0),cmd={follow:'following you',hold:'holding',march:'marching',charge:'charging',advance:'advancing'};
  const k=a=>TOUCH?'':' ['+ctl(a)+']';
  el.querySelector('.hc').textContent=(L.length?'Your host '+c(L)+' of '+n(L)+', '+cmd[L[0].cmd]+(L[0].form&&L[0].form!=='line'?', '+MOR_FORM_N[L[0].form]:''):'')+(L.length&&E.length?'; ':'')+(E.length?'against you '+c(E)+' of '+n(E)+', '+cmd[E[0].cmd]:'');
  for(const b of el.querySelectorAll('button')){const a=b.dataset.a;b.style.display=L.length?'':'none';b.textContent=b.dataset.n+k(a);}}
