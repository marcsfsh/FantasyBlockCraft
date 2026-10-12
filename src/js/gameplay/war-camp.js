// ---- The war's business (W8d, D-081): supplies and convoys, the council of war, the captains' tasks, captives, the life of the
// camp, ambushes in the ash, the player's war record and titles, salvage from the fallen and the hosts' standards brought back.
// Supplies (`w.sp`, 0 to 1, saved with the war): the siege eats them (an army of the hosts sent costs a twentieth) and convoys of
// bearers and guards bring them up the road behind the Leaguer every six to eight minutes (`campConvoy`); goblins may lie in wait
// for one in the ash. Short of supplies the siege's works go slower, the hosts send smaller armies and lose heart sooner.
// The council of war (`warCouncil`, using a lord of the hosts when sworn, or from the war console): the player hears where the war
// stands, and from Sergeant may press one effort for half an hour (it goes half again as fast, the others a little slower), and
// may ask the captains for a task (`MSN`): slay a named warchief, free captives held by goblins, hold the stakes against three
// waves, carry word across the lines, take back a fallen standard, or loose the engines into the yard; each with a mark of
// sparks over its place, a time to do it in, and merit, coin and the war's thanks when done.
let WREC=saved&&saved.wrc&&typeof saved.wrc==='object'?saved.wrc:null;if(!WREC)WREC={k:0,b:0,m:0,s:0,e:0,w:0,t:[]};
const warCampSave=()=>({wrc:WREC});
const warNight=()=>Math.sin((curT()-0.25)*Math.PI*2)<-0.05;
const warSup=w=>w.sp===undefined?0.6:w.sp;
let MSN=null,campT=0,campSingT=20,campAmbT=240,msnMk=0;const CONVOYS=[];
// ---- the war record and the titles it earns
const WAR_TITLES=[['k',10,'the Blooded'],['k',100,'Orc-Bane'],['k',400,'Scourge of the Wastes'],['s',3,'Banner-Taker'],['e',10,'Friend of the Engineers'],['w',5,'Mender of the Fallen'],
  ['b',3,'Veteran of the Field'],['m',5,'the Trusted'],['m',15,'Right Hand of the Lords']];
function warRec(k,n){WREC[k]=(WREC[k]||0)+(n||1);saveDirty=true;
  for(const [q,v,t] of WAR_TITLES)if(q===k&&WREC[k]>=v&&!WREC.t.includes(t)){WREC.t.push(t);toast('The hosts have a name for you now: '+t);['r','d','e'].forEach((p,i)=>setTimeout(()=>warSignal('muster',p,[PL.x,PL.y+4,PL.z]),i*1200));
    const w=[...WARS.values()].find(w=>Math.hypot(w.X-(PL.x+OX),w.Z-(PL.z+OZ))<400);if(w)warLog(w,'The hosts named you '+t+'.');}}
function warRecSlain(f){if(!FOES[f.kind].folk&&!FOES[f.kind].lord)warRec('k');}
const warTitle=()=>WREC.t.length?WREC.t[WREC.t.length-1]:'';
// ---- each second: supplies, the council's effort, convoys, ambushes, the task
const effPace=(w,k)=>{const E=WAR_EFF.find(e=>e[0]===k);return E[2]*60*(0.85+0.3*hsh(w.X,9861+k.length,w.Z));};
function warCampTick(){
  const rate=warRate();
  for(const w of WARS.values()){if(w.el&&w.el.fate)continue;if(w.sp===undefined)w.sp=0.6;w.sp=Math.max(0,w.sp-0.0004*rate);
    const short=w.sp<0.25,cs=w.cs&&warPlay<w.csT?w.cs:null;if(!short&&!cs)continue;
    if(w.s>=2){if(warFront(w)<1){const pace=60*60*(0.85+0.3*hsh(w.X,9921,w.Z));w.b.fr=(w.b.fr||0)+(cs==='fr'?0.5:0)*rate/pace-(short?0.3:0)*rate/pace;}continue;}
    for(const [k] of WAR_EFF){if(warEff(w,k)>=1)continue;const p=effPace(w,k);w.b[k]=(w.b[k]||0)+((cs===k?0.5:cs?-0.15:0)-(short?0.3:0))*rate/p;}}
  const P=wasteGateAt(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),300),w=P&&WARS.get(P.id);
  if(w&&!(w.el&&w.el.fate)){if(w.cvT===undefined)w.cvT=warPlay+120+Math.random()*120;if(warPlay>=w.cvT&&warAuto('a')){w.cvT=warPlay+360+Math.random()*120;if(!CONVOYS.some(C=>C.w===w))campConvoy(P,w);}}
  for(const v of WARS.values())if(v!==w&&v.cvT!==undefined&&warPlay>=v.cvT){v.cvT=warPlay+360+Math.random()*120;v.sp=Math.min(1,warSup(v)+0.25);} // (a convoy far from the player comes in unseen)
  for(let i=CONVOYS.length-1;i>=0;i--)if(convoyTick(CONVOYS[i]))CONVOYS.splice(i,1);
  campAmbush();if(MSN)msnTick();}
// ---- convoys: four bearers under their loads and five guards up the road behind the Leaguer to its stores
function campConvoy(P,w){const s=wgSite(P);let st=null;for(let u=P.uC0+300;u>=P.uC0+200&&!st;u-=10){const [X,Z]=siteXZ(s,u,0);if(warAt(X+0.5,Z+0.5,40,88)>=0)st=u;} // (in sight, and within the 96 the folk are kept)
  if(st===null){w.sp=Math.min(1,warSup(w)+0.25);return null;} // (no road in reach: it comes in unseen)
  const [X,Z]=siteXZ(s,st,0),y=warAt(X+0.5,Z+0.5,0,999),o={prov:'wg:'+P.id,site:s},C={P:P,w:w,m:[],arr:0,t0:foeClock,amb:null};
  const way=[];for(let u=st-20;u>=P.uC0+150;u-=20){const [x,z]=siteXZ(s,u,0);way.push([x+0.5,z+0.5]);}const end=way[way.length-1];C.end=end;
  for(const [k,n] of [['rbear',4],['rsword',3],['rspear',2]])for(let i=0;i<n;i++){const f=addFoe(k,X-OX+0.5+(Math.random()-0.5)*3,y,Z-OZ+0.5+(Math.random()-0.5)*3,Object.assign({st:'idle',t:1},o));
    f.cv=C;f.carry=k==='rbear'?1:0;f.way=way.slice();const w0=f.way.shift();warAim(f,w0);f.wp=w0;f.st='return';f.t=40;f.pace=FOES[k].walk*1.3;C.m.push(f);}
  if(Math.random()<0.45){const k=Math.floor(way.length*0.4),q=way[Math.max(0,k)],sd=Math.random()<0.5?1:-1,[fx,fz]=siteXZ(s,st-20*(k+1),sd*14),ay=warAt(fx+0.5,fz+0.5,0,999);
    if(ay>=0){const G=spawnGroup('oscout',6,fx-OX+0.5,ay,fz-OZ+0.5,3,{});for(const g of G){g.st='sleep';g.t=999;g.amb=C;}C.amb=G;}}
  CONVOYS.push(C);
  if(Math.hypot(X-OX-PL.x,Z-OZ-PL.z)<160)toast('A convoy of the hosts comes up the road behind '+P.camp.replace(/^The /,'the ')+' with supplies');return C;}
function convoyTick(C){const A=C.amb;
  if(A&&!C.sprung&&A.some(g=>!g.dead&&C.m.some(f=>!f.dead&&!f.gone&&Math.hypot(f.x-g.x,f.z-g.z)<14))){C.sprung=1;for(const g of A){if(g.dead)continue;let b=null,bd=99;for(const f of C.m){if(f.dead||f.gone)continue;const d=Math.hypot(f.x-g.x,f.z-g.z);if(d<bd){bd=d;b=f;}}
      g.st='chase';g.t=0;g.seen=0;if(b){g.foe=b;g.eseen=0;}}if(Math.hypot(A[0].x-PL.x,A[0].z-PL.z)<120)toast('Goblins spring out of the ash upon the convoy!');warCry(true,8,A[0].x,A[0].y+1,A[0].z);}
  for(const f of C.m){if(f.dead||f.gone||f.arr)continue;if(Math.hypot(f.x+OX-C.end[0],f.z+OZ-C.end[1])<5&&!(f.way&&f.way.length)){f.arr=1;C.arr+=f.carry?1:0;removeFoe(f);}}
  if(C.m.some(f=>!f.dead&&!f.gone&&!f.arr)&&foeClock-C.t0<400)return false;
  const ok=C.arr>=2||C.m.every(f=>f.gone&&!f.arr&&!f.dead)&&Math.hypot(C.end[0]-OX-PL.x,C.end[1]-OZ-PL.z)>120;
  if(ok){C.w.sp=Math.min(1,warSup(C.w)+0.3);warLog(C.w,'A convoy reached the Leaguer'+(C.sprung?' through an ambush in the ash':'')+'; the stores are full again.');toast('The convoy reaches the stores of '+C.P.camp.replace(/^The /,'the '));}
  else{warLog(C.w,'A convoy of the hosts was lost on the road behind the Leaguer.');toast('The convoy is lost: the stores of '+C.P.camp.replace(/^The /,'the ')+' go short');}
  if(A)for(const g of A)if(!g.dead&&g.st==='sleep')removeFoe(g);return true;}
// ---- ambushes in the ash: now and then in the wastes, goblins lie hidden ahead of a player on the move, and spring at them
function campAmbush(){if(!warAuto('a')||(campAmbT-=1)>0)return;campAmbT=240+Math.random()*180;const X=Math.floor(PL.x+OX),Z=Math.floor(PL.z+OZ);
  if(!warBasinAt(X,Z)||Math.hypot(PL.vx,PL.vz)<2||PL.ride&&false)return;const l=Math.hypot(PL.vx,PL.vz),x=PL.x+PL.vx/l*34,z=PL.z+PL.vz/l*34,bx=Math.floor(x),bz=Math.floor(z);
  if(bx<4||bz<4||bx>=W-4||bz>=D-4)return;const G=spawnGroup('oscout',5,x,ground[bx+W*bz]+1,z,4,{});for(const g of G){g.st='sleep';g.t=999;g.ambP=1;}return G;}
function campAmbushSpring(){for(const g of foes){if(!g.ambP||g.dead||g.st!=='sleep')continue;if(Math.hypot(g.x-PL.x,g.z-PL.z)<9){for(const h of foes)if(h.ambP&&!h.dead&&h.st==='sleep'&&Math.hypot(h.x-g.x,h.z-g.z)<12){h.st='chase';h.t=0;h.seen=0;h.ambP=0;}
    if(foeTarget())toast('Goblins burst out of the ash around you!');warCry(true,6,g.x,g.y+1,g.z);break;}}}
// ---- the council of war
function warCouncil(by){const X=PL.x+OX,Z=PL.z+OZ,P=wasteGateAt(Math.floor(X),Math.floor(Z),300);if(!P){toast('The council of war sits in the Pavilion of a Leaguer before an Ashen Gate');return;}
  const w=WARS.get(P.id)||warFound(P);invOpen=true;hold=-1;['invgrid','invname','sinv','bplist','invsearch'].forEach(id=>{$(id).style.display='none';});
  $('lore').style.display='block';$('invtitle').textContent='The council of war';cnRender(P,w);$('inv').style.display='grid';if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;}
const supWord=v=>v>=0.75?'plenty':v>=0.4?'enough':v>=0.25?'short':'starving';
function cnRender(P,w){const el=$('lore');el.innerHTML='';const crea=!SURV(),may=crea||SW.on&&SW.r>=2,cs=w.cs&&warPlay<w.csT?w.cs:null,now=msg=>{if(msg)toast(msg);saveDirty=true;cnRender(P,w);};
  const text=t=>{const d=document.createElement('div');d.textContent=t;d.style.marginBottom='6px';el.appendChild(d);};
  const row=()=>{const r=document.createElement('div');r.className='wcrow';el.appendChild(r);return r;};
  const btn=(r,label,fn)=>{const b=document.createElement('button');b.className='wide';b.style.marginTop='0';b.textContent=label;b.addEventListener('click',fn);r.appendChild(b);return b;};
  text('The lords of men, elves and dwarves sit about the map of '+P.name.replace(/^The /,'the ')+'. '+warStage(w)+'.');
  if(SW.on){const r=SW.r,nx=WAR_RANKS[r+1];text('You: '+WAR_RANKS[r][0]+(warTitle()?', called '+warTitle():'')+'. Merit '+SW.m+(nx?' ('+nx[1]+' for '+nx[0]+')':'')+'; battles won beside the hosts '+SW.b+'; creatures of the wastes slain '+SW.k+'.'+(WAR_SQUAD[r]?' Your '+(WAR_SQUAD[r]>4?'company':'squad')+' of '+WAR_SQUAD[r]+' follows you in the wastes and at the gates.':''));}
  text('Supplies: '+supWord(warSup(w))+' ('+Math.round(warSup(w)*100)+'%)'+(CONVOYS.some(C=>C.w===w)?'; a convoy is on the road':'')+'.'+(cs?' The council presses '+(cs==='fr'?'the front':WAR_EFF.find(e=>e[0]===cs)[1].toLowerCase())+' for '+Math.ceil((w.csT-warPlay)/60)+' minutes more.':''));
  if(may){const r=row();if(w.s>=2){if(warFront(w)<1)btn(r,'Press the front',()=>{w.cs='fr';w.csT=warPlay+1800;warLog(w,'At your counsel the lords pressed the front.');now('The lords will press the front');});}
    else for(const [k,lab] of WAR_EFF)if(warEff(w,k)<1)btn(r,'Press '+lab.toLowerCase(),()=>{w.cs=k;w.csT=warPlay+1800;warLog(w,'At your counsel the lords pressed '+lab.toLowerCase()+'.');now('The lords will press '+lab.toLowerCase());});}
  else text('From Sergeant the lords will hear your counsel on the war.');
  {const r=row();if(MSN)btn(r,'Give up your task ('+MSN.n+')',()=>{msnEnd(false,'You give up the task');now('');});else if(crea||SW.on)btn(r,'Ask the captains for a task',()=>{const m=msnGive(P,w);now(m?'':'The captains have no task for you now');if(m)closeInv();});
    btn(r,'Leave the council',()=>closeInv());}}
// ---- the captains' tasks
const MSN_K=['chief','captives','hold','word','standard','engines'];
const dirWord=(dx,dz)=>['north','north-east','east','south-east','south','south-west','west','north-west'][Math.round((Math.atan2(dx,-dz)/(Math.PI/4)+8))%8];
function msnSpot(P,w){const s=wgSite(P),[pu]=wgUV(P,PL.x+OX,PL.z+OZ);for(let k=0;k<40;k++){const u=pu-50-Math.random()*70;if(w.s>=2?u>-10:u>P.uC0-10)continue; // (toward the gate from the player: in the siege lines or on the field before them, or in the basin)
  const v=(Math.random()-0.5)*80,[X,Z]=siteXZ(s,u,v),y=warAt(X+0.5,Z+0.5,30,100);if(y>=0)return [X+0.5,Z+0.5,y];}return null;}
function msnGive(P,w,k){if(MSN)return null;const s=wgSite(P),kinds=MSN_K.filter(q=>q!=='engines'||w.s<2),K=k||kinds[Math.floor(Math.random()*kinds.length)];let M=null;
  if(K==='word'){const C=[[P.uC0+150,P.cs*80],[P.uC0+20,-P.cs*90],[P.uL+10,P.cs*70],[P.uC0+180,-P.cs*60]].map(([u,v])=>siteXZ(s,u,v)).filter(([X,Z])=>{const d=Math.hypot(X-PL.x-OX,Z-PL.z-OZ);return d>70&&d<260;});
    if(!C.length)return null;const [X,Z]=C[0];M={k:K,X:X+0.5,Z:Z+0.5,lim:150,n:'carry word to the captains across the lines'};}
  else if(K==='hold'){const [X,Z]=siteXZ(s,w.s>=2?-30:P.uL+4,(Math.random()-0.5)*30);M={k:K,X:X+0.5,Z:Z+0.5,lim:150,n:'hold the stakes until relieved',hold:90,away:0,wv:0};}
  else if(K==='engines'){const [X,Z]=siteXZ(s,-30,0);M={k:K,X:X+0.5,Z:Z+0.5,lim:600,n:'loose three stones into the yard from the trebuchets',hits:0};}
  else{const S=msnSpot(P,w);if(!S)return null;const [X,Z,y]=S,x=X-OX,z=Z-OZ;M={k:K,X:X,Z:Z,lim:600};
    if(K==='chief'){const G=spawnGroup('oarmy',6,x,y,z,4,{lead:'ochief'}),f=G.shift();if(!f||f.kind!=='ochief'){for(const g of G)removeFoe(g);if(f)removeFoe(f);return null;}f.hp=f.mhp=110;f.dmgK=1.4;f.nm='Warchief '+fullName('orc',Math.random,false)+' '+HERO_EP.or[Math.floor(Math.random()*HERO_EP.or.length)];M.f=f;M.G=G;M.n='slay '+f.nm;}
    else if(K==='captives'){const G=spawnGroup('oscout',6,x,y,z,4,{}),C=[];for(let i=0;i<3;i++){const k2=['rsword','rspear','dthrow','wbow'][Math.floor(Math.random()*4)],cx=x+(i-1)*1.4,cy=foeStand(cx,y+1,z+1,2);if(cy<0)continue;const c=addFoe(k2,cx,cy,z+1,{st:'idle',t:999,prov:'wg:'+P.id,site:s});c.cap=1;C.push(c);}
      if(!C.length){for(const g of G)removeFoe(g);return null;}M.G=G;M.C=C;M.n='free the captives the goblins hold';}
    else if(K==='standard'){const G=spawnGroup('oarmy',5,x,y,z,4,{lead:'obanner'}),f=G.shift();if(!f||f.kind!=='obanner'){for(const g of G)removeFoe(g);if(f)removeFoe(f);return null;}f.rstd=1;M.f=f;M.G=G;M.n='take back the fallen standard of the realm';}}
  if(!M)return null;M.P=P;M.w=w;M.t0=foeClock;MSN=M;const d=Math.hypot(M.X-OX-PL.x,M.Z-OZ-PL.z);
  toast('A captain gives you a task: '+M.n+'. '+(d>8?'Its place lies '+dirWord(M.X-OX-PL.x,M.Z-OZ-PL.z)+', '+Math.round(d)+' blocks off; a mark of sparks rises over it.':'Here.')+' You have '+Math.round(M.lim/60*10)/10+' minutes');hint('task');return M;}
function msnTick(){const M=MSN,t=foeClock-M.t0;if(t>M.lim){msnEnd(false,'Time ran out for your task: '+M.n);return;}
  if(M.k==='chief'&&M.f.dead)msnEnd(true,M.f.nm+' is slain');
  else if(M.k==='standard'&&M.f.dead){if(SURV())addItem(RBANNER,1);warRec('s');msnEnd(true,'You have taken back the standard of the realm');}
  else if(M.k==='captives'){if(M.G.every(g=>g.dead||g.gone)){const [hx,hz]=warHosp(M.P);for(const c of M.C){if(c.dead||c.gone)continue;c.cap=0;c.cheer=foeClock+3;c.way=[];warAim(c,[hx+0.5,hz+0.5,1]);c.st='return';c.t=60;}morBark(M.C[0],'bind',1);msnEnd(true,'The captives are free');}}
  else if(M.k==='word'&&Math.hypot(M.X-OX-PL.x,M.Z-OZ-PL.z)<8)msnEnd(true,'The captains have your word');
  else if(M.k==='engines'&&M.hits>=3)msnEnd(true,'Three stones fell into the yard');
  else if(M.k==='hold'){const x=M.X-OX,z=M.Z-OZ;if(Math.hypot(x-PL.x,z-PL.z)>25){if((M.away+=1)>8){msnEnd(false,'You left the stakes');return;}}else M.away=0;
    if(M.wv<3&&t>=10+M.wv*25){M.wv++;const s=wgSite(M.P),[u,v]=wgUV(M.P,M.X,M.Z),[X,Z]=siteXZ(s,u-38,v),y=warAt(X+0.5,Z+0.5,0,999);
      if(y>=0){const G=spawnGroup(M.wv===3?'oarmy':'oscout',5+M.wv,X-OX+0.5,y,Z-OZ+0.5,4,{});for(const g of G){g.hx=x;g.hz=z;g.st='chase';g.seen=0;g.t=0;}if(G.length)toast('They come at the stakes! ('+M.wv+' of 3)');}}
    if(t>=M.hold)msnEnd(true,'You held the stakes; the relief comes up');}}
function msnEnd(ok,say){const M=MSN;MSN=null;if(!M)return;if(!ok){toast(say);if(M.G)for(const g of M.G)if(!g.dead&&!g.gone&&Math.hypot(g.x-PL.x,g.z-PL.z)>40)removeFoe(g);if(M.C)for(const c of M.C)if(!c.dead&&!c.gone)removeFoe(c);return;}
  warRec('m');if(SW.on)warMerit(8);let got='';if(SURV()){addItem(204,2);got=' The captain gives you 2 gold coins.';drawBar(true);}
  if(M.k==='chief'||M.k==='standard')M.w.b.sally=(M.w.b.sally||0)+0.02;warLog(M.w,'You did a task for the captains: '+M.n+'.');toast(say+'. Task done.'+got);['r','d','e'].forEach((p,i)=>setTimeout(()=>warSignal('muster',p,[PL.x,PL.y+4,PL.z]),i*1500));}
// an engine's stone that falls inside the gate counts for the task to loose into the yard
function msnEngine(s){if(MSN&&MSN.k==='engines'&&wgUV(MSN.P,s.x+OX,s.z+OZ)[0]<0)MSN.hits++;}
// ---- every half second: the task's mark, the camp's life, the ambushes springing; at night by the fires a song
function campFrame(dt){
  if(MSN&&(msnMk-=dt)<=0){msnMk=0.4;const x=MSN.X-OX,z=MSN.Z-OZ,bx=Math.floor(x),bz=Math.floor(z);if(Math.hypot(x-PL.x,z-PL.z)<220&&bx>=0&&bz>=0&&bx<W&&bz<D){const y=ground[bx+W*bz]+1;for(let k=0;k<6;k++)spawnP(x+(Math.random()-.5)*0.6,y+Math.random()*14,z+(Math.random()-.5)*0.6,0,1.5,0,[1,0.85,0.35],1.2,-0.4);}}
  if((campT-=dt)>0)return;campT=0.5;campAmbushSpring();let sit=[];
  for(const f of foes){if(f.dead||!f.site||f.site.k!=='wgate'||f.war||f.hst||f.cv||f.cap||f.wnd)continue;const F=FOES[f.kind];if(!F.folk||F.civ||F.mount||F.hound||Math.hypot(f.x-PL.x,f.z-PL.z)>60)continue;
    const c=f.camp;if(c&&(c.t<foeClock||f.foe||f.st==='chase')){f.camp=null;f.t=1;continue;}
    if(c){if(c.k==='sit')sit.push(f);else if(c.k==='spar'&&!f.atk&&Math.random()<0.45){f.atk=F.wind;f.atkK='spar';}continue;}
    if(f.st!=='idle'||Math.random()>0.03)continue;
    if(Math.random()<0.5){f.camp={k:'sit',t:foeClock+20+Math.random()*25};f.t=99;}
    else{let o=null;for(const g of foes)if(g!==f&&!g.camp&&!g.dead&&g.site===f.site&&g.st==='idle'&&FOES[g.kind].folk&&!FOES[g.kind].civ&&!FOES[g.kind].mount&&Math.hypot(g.x-f.x,g.z-f.z)<6){o=g;break;}
      if(o){const t=foeClock+12+Math.random()*10;f.camp={k:'spar',t:t,o:o};o.camp={k:'spar',t:t,o:f};f.t=o.t=99;}}}
  if(sit.length>=3&&warNight()&&(campSingT-=0.5)<=0){campSingT=40+Math.random()*30;let x=0,z=0;for(const f of sit){x+=f.x;z+=f.z;}x/=sit.length;z/=sit.length;campSong(x,sit[0].y+1,z);if(Math.hypot(x-PL.x,z-PL.z)<30)toast('Soldiers of the hosts sing low by the fires');}}
// a slow song of a few voices about the fires: a phrase in a minor key, answered
function campSong(x,y,z){if(!AX||!settings.sound||Math.hypot(x-PL.x,z-PL.z)>45)return;const p=panner(x,y,z),N=[220,261.63,246.94,220,196,220,164.81,196,220];
  for(let v=0;v<3;v++){const k=[1,0.5,0.75][v];N.forEach((f,i)=>voice(f*k*(1+(Math.random()-0.5)*0.01),f*k,0.9,0.02,{form:700+v*200,q:1.4,vib:4,vd:0.02,delay:i*0.75+v*0.04},p));}}
// ---- salvage: the use button on one of the fallen (lying) of the wastes takes what it carried; on a fallen standard bearer of the
// hosts, its standard is borne back to the lines
function campSalvage(){const e=eyePos(),d=camDir();let best=null,bd=3.6;
  for(const f of foes){if(!f.dead||f.salv||f.gone)continue;const dx=f.x-e.x,dz=f.z-e.z,dl=Math.hypot(dx,dz);if(dl>bd||dl<0.2)continue;if((dx*d.x+dz*d.z)/dl/Math.hypot(d.x,d.z||1e-6)<0.8)continue;best=f;bd=dl;}
  if(!best)return false;best.salv=1;const F=FOES[best.kind];swing=1;
  if(F.folk){if(!F.std){toast('One of the hosts, fallen. The bearers will come for them');return true;}warRec('s');if(SW.on)warMerit(3);toast('You take up the fallen standard and bear it back to the lines');saveDirty=true;return true;}
  const got=[];if(SURV()){for(const [id,lo,hi,ch] of [[409,1,4,0.5],[410,1,3,0.25],[203,1,4,0.5],[223,1,1,0.2],[200,1,2,0.3]])if(Math.random()<ch){const n=lo+Math.floor(Math.random()*(hi-lo+1));if(!addItem(id,n))got.push(n+' '+nameOf(id));}drawBar(true);}
  toast(got.length?'From the fallen you take '+got.join(', '):'The fallen carried nothing worth taking');return true;}
// the war panel and the journal: supplies, the task, the player's record and names
function campPanel(w){return '<div>Supplies '+supWord(warSup(w))+' ('+Math.round(warSup(w)*100)+'%)'+(CONVOYS.some(C=>C.w===w)?', a convoy on the road':'')+'</div>'+(MSN?'<div>Your task: '+MSN.n+' ('+Math.max(0,Math.ceil((MSN.lim-(foeClock-MSN.t0))/60))+' min)</div>':'')+(warTitle()?'<div>Called '+warTitle()+'</div>':'');}
function campJournal(out){out.push('','YOUR WAR RECORD','Creatures of the wastes slain '+WREC.k+'; pitched battles fought '+WREC.b+'; tasks done for the captains '+WREC.m+'; standards and banners taken '+WREC.s+'; stones loosed from the engines '+WREC.e+'; wounded tended '+WREC.w+'.'+
  (WREC.t.length?' The hosts call you '+WREC.t.join(', ')+'.':''));}
