// ---- Morale and the line (W8b, D-078). Every soldier of either side has a heart for the fight (`f.fear` against its nerve,
// `morNerve`): it sinks as it is hurt, as its fellows fall about it (the fallen of the last few seconds by cells of eight blocks,
// `MOR_D`; a captain or a standard counts four, one slain by the player two), when the other side outnumbers it, and near the
// great creatures; it rises near its own standards, captains, drums and heroes (`MOR_C`, the strength of each side by cells,
// rebuilt twice a second). When the fear passes the nerve the soldier routs (`f.rout`): it throws over the fight and runs from
// the other side, then rallies once it is clear and its heart has come back, or when a captain calls it in. An army or a host
// with a third of its soldiers running breaks (`G.mor.broken`): the rest waver and many run; the other side cheers when its field
// is clear. The Horn of the Hosts (414) sounded by the player puts heart into the folk about them for twenty seconds.
// Also here: the hosts' formations (line, shield wall, wedge, square, loose: `hostReform`, `morDmg`), the weight of a mounted
// charge and the wheel after it, the wounded (folk of the hosts who fall to a creature may lie wounded instead, `f.wnd`: healers,
// bearers or the player bring them back, or they die after 45 seconds), the war hounds of the hosts, the banner bearers of the
// warhosts and their banner taken as a trophy, and the soldiers' barks, war cries and cheers.
Object.assign(FOES,{
  obanner:{n:'Banner Bearer of the Warhost',m:'obanner',hp:30,dmg:4,reach:2.2,walk:1.3,run:4.4,sight:24,cd:1.3,wind:0.45,mass:0.45,std:1,drops:[[213,1,2,0.5],[200,1,2,0.5]],cause:'orc'},
  rhound:{n:'War Hound of the Hosts',m:'whound',hp:18,dmg:4,reach:1.6,walk:1.6,run:7.6,sight:30,cd:0.8,wind:0.25,mass:0.7,tall:1,folk:1,hound:1,nerve:1.2,drops:[],cause:'hound'}
});
DEATH.hound='A war hound of the hosts brought you down';
FOE_HOME.x_hd=[['rhound',1]];FOE_HOME.r_host.push(['rhound',0.5]);FOE_HOME.h_host.push(['rhound',0.4]);
HOST_UNITS.o[0][4]='obanner';HOST_UNITS.al.splice(7,0,['hd','War hounds','x_hd',null,null]);HOST_MIX.al.hd=3;
// ---- the heart of each soldier
const MOR_C=new Map(),MOR_D=new Map(),MOR_FORMS=['line','wall','wedge','square','loose'],
  MOR_FORM_N={line:'in ranks',wall:'in a shield wall',wedge:'in a wedge',square:'in a square',loose:'in loose order'};
let morT=0,morI=0,morBarkT=0,hornCD=0;
const morK=(x,z)=>(Math.floor(x/8)+16)*512+Math.floor(z/8)+16;
const morLead=f=>{const F=FOES[f.kind];return !!(F.std||F.boss||F.drum||f.hero||/capt$/.test(f.kind));};
const morBig=f=>{const F=FOES[f.kind];return !!(F.lord||F.mass<0.2&&(F.tall||2)>2.5&&!F.mount);};
function morNerve(f){const F=FOES[f.kind];if(F.lord||f.hero||F.civ||f.lastS)return 9;if(F.nerve)return F.nerve;
  return F.std||F.boss||/capt$/.test(f.kind)?2:F.elite?1.6:F.mass<0.2?1.5:F.folk?1:f.kind[0]==='g'?0.6:0.8;}
// a fall counts against the heart of its own side about it for a while
function morDeath(g,byP){const k=morK(g.x,g.z);let d=MOR_D.get(k);if(!d)MOR_D.set(k,d=[0,0]);d[foeSd(g)]+=morLead(g)?4:byP?2:1;}
// twice a second: the strength of each side by cells, the fallen fading, each army's and host's heart; then each soldier about
// once a second, a slice each frame
function morFrame(dt){
  if(!foes.length)return;
  if((morT-=dt)<=0){morT=0.5;MOR_C.clear();const G=new Map();
    for(const [k,d] of MOR_D){d[0]*=0.92;d[1]*=0.92;if(d[0]+d[1]<0.05)MOR_D.delete(k);}
    for(const f of foes){if(f.dead||f.gone||f.wnd||FOES[f.kind].civ)continue;const A=f.army||f.hst,rt=f.rout>0;
      if(A){let g=G.get(A);if(!g)G.set(A,g=[0,0,0]);g[0]++;if(rt)g[1]++;else g[2]+=Math.min(1.5,(f.fear||0)/morNerve(f));}
      if(rt)continue;const s=foeSd(f),k=morK(f.x,f.z);let c=MOR_C.get(k);if(!c)MOR_C.set(k,c=[0,0,0,0,0,0]);c[s]++;if(morLead(f))c[2+s]++;if(morBig(f))c[4+s]+=FOES[f.kind].lord?4:1;}
    for(const [A,g] of G){const m=A.mor||(A.mor={broken:0});m.n=g[0];m.r=g[1];m.h=g[0]>g[1]?g[2]/(g[0]-g[1]):1;
      if(!m.broken&&g[0]>=12&&g[1]>=g[0]*0.34)morBreak(A);else if(m.broken&&g[1]<g[0]*0.08&&foeClock>m.broken+15)m.broken=0;}}
  const n=Math.min(foes.length,Math.ceil(foes.length*dt*1.1));for(let k=0;k<n;k++){morI=(morI+1)%foes.length;const f=foes[morI];if(f&&!f.dead&&!f.gone&&!f.wnd)morOne(f);}}
function morOne(f){
  const F=FOES[f.kind],nv=morNerve(f);if(nv>=9&&!f.rout&&!f.hero)return;
  const s=foeSd(f),o=1-s,cx=Math.floor(f.x/8)+16,cz=Math.floor(f.z/8)+16;let fr=0,en=0,ld=0,bg=0,dd=0;
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const k=(cx+i)*512+cz+j,c=MOR_C.get(k),d=MOR_D.get(k);if(c){fr+=c[s];en+=c[o];ld+=c[2+s];bg+=c[4+o];}if(d)dd+=d[s];}
  const hz=f.horn>foeClock;let T=0;
  if(en&&!hz)T=(f.war&&F.folk&&WARS.get(f.war)&&warSup(WARS.get(f.war))<0.25?0.1:0)+(1-f.hp/f.mhp)*0.5+Math.min(0.6,dd*0.06)+(en>fr*1.3?Math.min(0.5,(en/(fr+1)-1.3)*0.25):0)+Math.min(0.35,bg*0.1)-Math.min(0.4,(ld-(morLead(f)&&!f.rout?1:0))*0.12)-(f.steady>foeClock?0.1:0)-(f.driven>foeClock?0.1:0);
  f.fear=hz?0:Math.max(0,(f.fear||0)+(T-(f.fear||0))*0.5);
  if(f.rout){if(foeClock>=f.rout){if(f.fear<nv*0.55||!en)morRally(f);else f.rout=foeClock+3;}return;}
  // a hero sore pressed makes a last stand: it will not run, strikes harder and those about it take heart
  if(f.hero&&!f.lastS&&f.hp<f.mhp*0.3&&en>=3){f.lastS=1;f.dmgK=(f.dmgK||1)*1.5;morBark(f,'stand',1);foeNear(f.x,f.z,12,g=>{if(g!==f&&Math.hypot(g.x-f.x,g.z-f.z)<12){g.fear=0;g.horn=Math.max(g.horn||0,foeClock+12);if(g.rout)morRally(g);}},s);
    if(Math.hypot(f.x-PL.x,f.z-PL.z)<120)toast(f.hero.n+' makes a last stand!');return;}
  if(nv<9&&en&&f.fear>nv){morRout(f,6+Math.random()*6);return;}
  // a captain, a standard or a chief calls those of its side who run near it back to the fight
  if(morLead(f)&&!(f.ralT>foeClock)){let k=0;foeNear(f.x,f.z,14,g=>{if(g.rout&&!g.dead&&Math.hypot(g.x-f.x,g.z-f.z)<14){g.fear*=0.4;g.rout=Math.min(g.rout,foeClock+1.5);k++;}},s);if(k){f.ralT=foeClock+8;morBark(f,'rally');}}}
// to run: away from the other side about it, the fight thrown over
function morRout(f,t){let ex=0,ez=0,n=0;foeNear(f.x,f.z,18,g=>{if(g.dead||g.wnd||Math.hypot(g.x-f.x,g.z-f.z)>18)return;ex+=g.x;ez+=g.z;n++;},1-foeSd(f));
  if(!n&&f.foe){ex=f.foe.x;ez=f.foe.z;n=1;}f.rhd=n?Math.atan2(f.x-ex/n,f.z-ez/n):f.yaw+Math.PI;
  f.rout=foeClock+t;f.st='flee';f.t=99;f.foe=null;f.atk=0;f.chg=0;f.waitA=null;f.lineHold=null;f.fm=null;f.volT=0;if(Math.random()<0.3)foeCall(f,'hurt');morBark(f,'rout');}
// to come back: it turns about and takes up its way again (its place in a host, its march, or the nearest foe)
function morRally(f){f.rout=0;f.st='return';f.hx=f.x;f.hz=f.z;f.t=0;f.hex=false;f.fear=Math.min(f.fear||0,0.3);}
// an army or a host breaks: the word goes round, its horns sound the retreat, and the rest of it wavers, many of them running
function morBreak(A){const m=A.mor;m.broken=foeClock;A.brk=1;const L=A.m.filter(f=>!f.dead&&!f.gone&&!f.wnd&&!f.rout);if(!L.length)return;let x=0,z=0;for(const f of L){x+=f.x;z+=f.z;}x/=L.length;z/=L.length;
  for(const f of L){const nv=morNerve(f);if(nv>=9)continue;f.fear=(f.fear||0)+0.5;if(f.fear>nv*0.8)morRout(f,8+Math.random()*6);}
  const al=A.side?A.side==='al':!!A.al;warSignal('retreat',al?'r':'o',[x,PL.y+3,z]);
  if(Math.hypot(x-PL.x,z-PL.z)<160)toast(A.led?'Your host breaks and runs! Sound the horn or call them back':A.side?'The host against you breaks and flees!':al?'The hosts break and fall back!':'The warhost breaks and flees!');}
// the field won: those left standing cheer, arms raised, with a shout
function morCheer(L){let x=0,z=0,n=0,one=null;for(const f of L){if(!f.kind||f.dead||f.wnd||f.foe&&!f.foe.dead)continue;f.cheer=foeClock+4+Math.random()*2;x+=f.x;z+=f.z;n++;if(!one||Math.hypot(f.x-PL.x,f.z-PL.z)<Math.hypot(one.x-PL.x,one.z-PL.z))one=f;}
  if(!n)return;const orc=!FOES[one.kind].folk;warCry(orc,Math.min(20,(4+n)>>1),x/n,PL.y+2,z/n);morBark(one,'cheer',1);}
// ---- what they say: a soldier near the player now and then (one line in five seconds at most)
const MOR_BARK={
  rout:{r:['Fall back! Fall back!','They are too many!','Run, or die here!'],h:['Away! The line is broken!','To the horses, ride clear!'],e:['The line is lost! Withdraw!','Back, back to the hill!'],
    w:['Into the trees! Scatter!','Back to the green!'],d:['Give ground, give ground!','Back to the shield-ring!'],o:['Run! Run, you worms!','It is the end of us!','Back to the fire, back!']},
  rally:{r:['Stand! Stand with me!','Form on me! Form!'],h:['Turn your horses! With me!','Rally to the horn!'],e:['Hold! Hold the line with me!','Turn and stand!'],w:['To me, children of the wood!'],
    d:['Shields up! On me!','Back in the line, cousins!'],o:['Turn around, or I gut you myself!','Back in line, maggots!']},
  wound:{r:['I am hit... help me!','My leg! Somebody!'],h:['My horse is down... help!'],e:['I am wounded. Do not leave me.'],w:['Help... I cannot stand.'],d:['Bah! A scratch... help me up.']},
  cry:{r:['For hearth and crown!','The realm! The realm!'],h:['Hooves and thunder!','For the open plains!'],e:['Light of the high places!','For the stars above the peaks!'],
    w:['For the green deep!','Leaf and arrow!'],d:['Stone and hammer!','The mountain stands!'],o:['Burn them! Break them!','Blood for the fire!','Crush them!']},
  cheer:{r:['The field is ours!','They run! They run!'],h:['Victory! Sound the horns!'],e:['They are broken. The day is ours.'],w:['The wood stands!'],d:['Ha! Not one step did we give!'],o:['Ours! The field is ours!']},
  stand:{r:['Come then! Not one step back!'],h:['Here I stand. Come and take me!'],e:['I will hold this ground. Come!'],w:['You will not pass this tree!'],d:['Come and break on me!'],o:['I am not done with you!']},
  loose:{r:['Loose!','Away she goes!','Mind the arm!'],d:['Loose!','Stand clear of the arm!'],h:['Loose!'],e:['Loose!'],w:['Loose!'],o:['Throw it! Throw!']},
  bind:{r:['My thanks. I owe you my life.'],h:['You have a rider\'s thanks.'],e:['I will not forget this.'],w:['The wood remembers kindness.'],d:['I owe you a debt, friend.']}};
function morBark(f,k,force){const F=FOES[f.kind];if(F.hound||!playing||!force&&foeClock<morBarkT||Math.hypot(f.x-PL.x,f.z-PL.z)>40)return;const B=MOR_BARK[k],p=F.folk?f.kind[0]:'o',L=B&&(B[p]||B.r);if(!L)return;
  morBarkT=foeClock+5;toast((f.hero?f.hero.n:F.n)+': "'+L[Math.floor(Math.random()*L.length)]+'"');}
// the war cry of the side nearest the player as the lines meet or a charge goes in
function morCry(L){let one=null,bd=40;for(const f of L){if(f.dead||FOES[f.kind].hound)continue;const d=Math.hypot(f.x-PL.x,f.z-PL.z);if(d<bd){bd=d;one=f;}}if(one)morBark(one,'cry');}
// ---- blows and shots in the line: the horn's heart, the weight of a charge, and what each formation gives (from warDmg)
function morDmg(g,n,by,kb,blow){
  const B=FOES[by.kind];if(by.horn>foeClock)n*=1.15;
  if(B.mount&&blow&&by.sp>3.2){n*=1.5;kb*=1.6;by.wheelT=foeClock+1.6;by.wheelH=by.yaw;} // the weight of a mounted charge, then the wheel
  if(by.fm==='wedge'&&blow&&by.chgT>foeClock)n*=1.25;
  const fm=g.fm,front=Math.abs(angTo(g.yaw,Math.atan2(by.x-g.x,by.z-g.z)))<1.2,held=g.lineHold&&g.lineHold.hold;
  if(fm==='wall'&&held&&front){if(blow)n*=0.7;else if(Math.random()<0.7){n=0;kb=0;if(foeHear([g.x,g.y,g.z]))burst(0.1,'bandpass',2600,4,0.15,0,[g.x,g.y+1.2,g.z]);}}
  else if((fm==='square'||fm==='brace'&&front)&&B.mount&&blow){n*=0.5;by.kvx-=Math.sin(by.yaw)*4;by.kvz-=Math.cos(by.yaw)*4;by.stagger=foeClock+0.8;by.wheelT=0;}
  else if(fm==='loose'&&!blow&&Math.random()<0.3){n=0;kb=0;}
  return [n,kb];}
// the formation of the hosts' line in battle: a shield wall against many archers, braced against many horsemen
function morPick(en){if(en.length<6)return null;let s=0,m=0;for(const g of en){const G=FOES[g.kind];if(G.mount)m++;else if(G.shot)s++;}return m>=en.length*0.2?'brace':s>=en.length*0.3?'wall':null;}
// ---- formations of a summoned host (from the console or the key): every soldier to its place in the new order
function hostReform(H,form){if(!MOR_FORMS.includes(form))return;H.form=form;const L=hostLive(H).filter(f=>!f.wnd),kinds=L.map(f=>f.kind).concat(H.q.map(q=>q[0])),S=hostSlots(kinds,form),by=new Map();
  for(const s of S){let a=by.get(s[0]);if(!a)by.set(s[0],a=[]);a.push(s);}
  L.sort((a,b)=>b.sb-a.sb);for(const f of L){const a=by.get(f.kind),s=a&&a.shift();if(!s)continue;f.sa=s[1];f.sb=s[2];f.sf=s[3]||0;f.fm=form;}
  H.q=[];for(const a of by.values())for(const s of a)H.q.push(s);H.q.sort((a,b)=>a[2]-b[2]);
  for(const f of L)hostStep(H,f);}
function hostFormNext(){const L=HOSTS.filter(H=>H.led&&hostLive(H).length);if(creativeOnly())return;if(!L.length){toast('You lead no host. Summon one from the war console ('+ctl('warConsole')+')');return;}
  const f=MOR_FORMS[(MOR_FORMS.indexOf(L[0].form||'line')+1)%MOR_FORMS.length];for(const H of L)hostReform(H,f);
  toast('Your host forms '+MOR_FORM_N[f]+({wall:': shields locked against arrows, slower',wedge:': its charge strikes harder',square:': facing every way, proof against horsemen',loose:': spread against arrows and fire'}[f]||''));}
// a square of a host: its blades and great creatures on four faces two deep, each facing out; archers, banners and horsemen inside
function hostSquare(grp){const P=grp[0].concat(grp[1]),I=grp[2].concat(grp[4],grp[3],grp[5]),out=[],n=P.length,m=Math.max(3,Math.ceil(n/8)),h=m*0.7+1.6;
  P.forEach((k,i)=>{const s=i%4,j=Math.floor(i/4),t=(Math.floor(j/2)-(m-1)/2)*1.4,o=h-(j%2)*1.4;out.push(s===0?[k,t,o,0]:s===1?[k,o,-t,-Math.PI/2]:s===2?[k,-t,-o,Math.PI]:[k,-o,t,Math.PI/2]);});
  const q=Math.max(1,Math.floor(2*(h-2.4)/1.6)+1);I.forEach((k,i)=>{const r=Math.floor(i/q);out.push([k,((i%q)-(q-1)/2)*1.6,h-2.4-r*1.6,0]);});return out;}
// ---- the wounded: one of the hosts struck down by a creature may lie wounded (three in ten); they cry for help, healers and
// bearers come for them, the player may bind their wounds, and they die if none comes in 45 seconds
function morWound(g,by){const G=FOES[g.kind];if(!G.folk||G.civ||G.hound||g.hero||!(g.war||g.hst)||!by||!by.kind||g.wnd||Math.random()>0.3)return false;
  g.hp=1;g.wnd=foeClock+45;g.st='idle';g.foe=null;g.atk=0;g.sp=0;g.waitA=null;g.lineHold=null;g.rout=0;g.t=99;g.fm=null;morBark(g,'wound');return true;}
function morWoundStep(f,dt){f.sp=0;f.atk=0;if(foeClock>f.wnd){f.wnd=0;f.hp=0;foeFalls(f,f);}else if(Math.random()<dt*0.4)spawnP(f.x,f.y+0.3,f.z,(Math.random()-.5)*0.4,0.3,(Math.random()-.5)*0.4,[0.55,0.08,0.06],0.35,6);}
function morStand(f){f.wnd=0;f.hp=Math.max(f.hp,Math.round(f.mhp*0.4));f.st='return';f.hx=f.x;f.hz=f.z;f.t=0;f.fear=0;}
// the player binds a wounded soldier's wounds (the use button, looking at them)
function morBind(){const f=foeHit(3.5);if(!f||!f.wnd)return false;warRec('w');f.hp=Math.max(f.hp,Math.round(f.mhp*0.5));morStand(f);swing=1;morBark(f,'bind',1);
  for(let k=0;k<10;k++)spawnP(f.x+(Math.random()-.5),f.y+0.6+Math.random(),f.z+(Math.random()-.5),0,0.6,0,[0.75,0.95,0.6],0.8,-0.3);return true;}
// ---- the Horn of the Hosts: the folk within 40 take heart (no fear for twenty seconds, blows a little harder, the running turn
// back); the wastes' creatures within 24 falter; then a minute before the player has the breath for it again
function morHorn(held){const it=ITEMS[held];if(!it||!it.horn)return false;
  if(foeClock<hornCD){toast('You have not the breath for the horn yet ('+Math.ceil(hornCD-foeClock)+' s)');return true;}
  hornCD=foeClock+(SURV()?60:6);let n=0,t=0;swing=1;
  for(const f of foes){if(f.dead||f.gone||f.wnd)continue;const F=FOES[f.kind],d=Math.hypot(f.x-PL.x,f.z-PL.z);if(d>40)continue;
    if(F.folk&&!F.civ&&!folkWrath(f)){f.fear=0;f.horn=foeClock+20;if(f.rout)morRally(f);n++;}else if(!F.folk&&!F.lord&&d<24){f.fear=(f.fear||0)+0.45;t++;}}
  for(const H of HOSTS)if(H.led&&H.mor)H.mor.broken=0;
  warSignal('advance','r',[PL.x,PL.y+2,PL.z]);setTimeout(()=>warSignal('muster','r',[PL.x,PL.y+2,PL.z]),1500);
  toast(n?'You sound the Horn of the Hosts: '+n+' about you take heart'+(t?', and the foe falters':''):'You sound the Horn of the Hosts. Its call rolls over the land');return true;}
// a banner of the warhost taken from the one who bore it
function morSlain(f){if(f.kind!=='obanner')return '';warRec('s');if(!SURV())return '';const left=addItem(OBANNER,1);return left?'':'their banner';}
// the hearts of the armies at a gate, for the war panel
function morPanel(w){const A=warArmies.filter(A=>A.P.id===w.id&&A.mor&&A.mor.n),word=m=>m.broken?'broken, fleeing':m.h<0.35?'steady':m.h<0.7?'wavering':'near breaking';
  return A.length?'<div>'+A.map(a=>(a.al?'The hosts\' hearts ':'The warhost\'s hearts ')+word(a.mor)).join('; ')+'</div>':'';}
