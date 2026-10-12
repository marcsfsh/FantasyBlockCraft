// The war's business (W8d, D-081): supplies drain, a short siege goes slower and sends smaller armies, the council's pressed
// effort goes faster; a convoy comes up the road to the stores; goblins hidden in the ash spring; the captains' tasks (a named
// warchief, captives, the stakes held against three waves, word carried, a standard taken back, the engines into the yard) and
// one that runs out of time; captives no one's target; the camp's life (sitting, sparring without harm, a song at night); salvage
// from the fallen and a standard borne back; the war record and its titles; the council drawn.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const clear=()=>{hostDismiss(null);for(const f of [...foes])removeFoe(f);foeSpots.clear();warArmies.length=0;fieldB.length=0;CONVOYS.length=0;MSN=null;};
const gy=(x,z)=>ground[Math.floor(x)+W*Math.floor(z)];
const add=(k,x,z,o)=>addFoe(k,x,foeStand(x,gy(x,z)+2,z,FOES[k].tall||2),z,Object.assign({st:'idle',t:99,hold:1},o||{}));
const toPL=(X,Z)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=gy(PL.x,PL.z)+1;};
const [X0,Z0]=at(P.uC0+40,12);gen(X0,Z0);toPL(X0,Z0);playing=false;warClk=1e9;clear();warS.clear();WARS.clear();warPlay=0;warStateTick();WC.clk=1;WC.a=1;
const w=WARS.get(P.id);w.cvT=1e12;
// supplies: they drain; short, the siege goes slower; the council's effort faster, the others a little slower
{const s0=warSup(w);for(let i=0;i<100;i++)warCampTick();const s1=w.sp;
  const prog=(sp,cs)=>{w.sp=sp;w.cs=cs;w.csT=cs?warPlay+1e6:0;const a=warEff(w,'ram'),b=warEff(w,'mine');for(let i=0;i<60;i++){warStateTick();warCampTick();}return [warEff(w,'ram')-a,warEff(w,'mine')-b];};
  const full=prog(0.9,null),short=prog(0.1,null),press=prog(0.9,'ram');w.cs=null;
  info('supplies',s0,'->',s1.toFixed(3),'in 100 s ; the ram in a minute: full',full[0].toFixed(5),'short',short[0].toFixed(5),'pressed',press[0].toFixed(5),'(the mine then',(press[1]/full[1]).toFixed(2)+')');
  assert(Math.abs(s0-s1-0.04)<0.002&&Math.abs(short[0]/full[0]-0.7)<0.05&&Math.abs(press[0]/full[0]-1.5)<0.05&&Math.abs(press[1]/full[1]-0.85)<0.05,'the siege eats its supplies; short of them the works go slower; an effort the council presses goes faster and the others a little slower');}
// short of supplies the hosts send a smaller army, and an army eats the stores
{w.sp=0.9;const A=warArmy(P,true),n1=A.C.length,sp=w.sp;clear();w.sp=0.1;const B=warArmy(P,true),n2=B.C.length;clear();w.sp=0.6;
  info('companies of an army: well supplied',n1,'; short',n2,'; the stores after an army',sp.toFixed(2));assert(n2<n1&&Math.abs(sp-0.85)<0.001,'short of supplies the hosts send a smaller army; an army eats the stores');}
// a convoy comes up the road behind the Leaguer to the stores
{const [X,Z]=at(P.uC0+190,0);gen(X,Z);toPL(X,Z);clear();w.cvT=warPlay;w.sp=0.3;warCampTick();const C=CONVOYS[0];
  info('a convoy:',!!C,C&&C.m.length,'on the road ; bearers loaded',C&&C.m.filter(f=>f.carry).length,'; an ambush laid',!!(C&&C.amb));
  assert(C&&C.m.length===9&&C.m.filter(f=>f.carry).length===4,'a convoy of four loaded bearers and five guards comes up the road');
  const l0=w.log.length;let done=run(420,()=>{if(foeClock%1<0.05)warCampTick();return !CONVOYS.length;});
  info('the convoy',done?'came to an end':'still on the road','; arrived',C.arr,'; supplies',w.sp.toFixed(2),'; the chronicle:',w.log.length>l0?w.log[w.log.length-1][1]:'');
  assert(done&&w.log.length===l0+1&&(C.arr>=2?w.sp>0.5:/lost/.test(w.log[w.log.length-1][1])),'the convoy reaches the stores and fills them (or is lost), and the chronicle says so');clear();}
gen(X0,Z0);toPL(X0,Z0);
// goblins hidden in the ash spring at the one who comes near
{const G=[0,1,2].map(i=>add('goblin',PL.x+8+i,PL.z+8,{hold:0,st:'sleep',t:999,ambP:1}));campAmbushSpring();const before=G.filter(g=>g.st!=='sleep').length;PL.x+=5;PL.z+=5;campAmbushSpring();const after=G.filter(g=>g.st==='chase').length;
  info('hidden goblins: up before',before,'; at 3 or so',after);assert(before===0&&after===3,'goblins hidden in the ash lie still, then spring all together');clear();toPL(X0,Z0);}
// the captains' tasks
{const res=[];const kill=L=>{for(const g of L)if(!g.dead){g.hp=0;foeFalls(g,g);}};
  let M=msnGive(P,w,'chief');res.push('chief '+(M&&M.n));const m0=WREC.m;kill([M.f]);msnTick();res.push('done '+(!MSN&&WREC.m===m0+1));const ok1=M&&/^slay Warchief /.test(M.n)&&!MSN&&WREC.m===m0+1;clear();
  M=msnGive(P,w,'captives');const C=M.C.slice(),o=add('raider',C[0].x+2,C[0].z,{hold:0});o.foe=null;foeScan(o,FOES.raider,false);const tgt=o.foe&&o.foe.cap;removeFoe(o);
  kill(M.G);msnTick();const ok2=C.every(c=>!c.cap&&c.st==='return')&&!tgt&&!MSN;res.push('captives freed '+ok2);clear();
  M=msnGive(P,w,'word');PL.x=M.X-OX;PL.z=M.Z-OZ;msnTick();const ok3=!MSN;res.push('word '+ok3);toPL(X0,Z0);clear();
  setMode('survival');inv.fill(null);M=msnGive(P,w,'standard');kill([M.f]);msnTick();const ok4=!MSN&&countOf(RBANNER)===1&&countOf(204)===2;res.push('standard '+ok4);clear();inv.fill(null);setMode('creative');
  M=msnGive(P,w,'engines');const [ex,ez]=siteXZ(s,-30,0);for(let i=0;i<3;i++)msnEngine({x:ex-OX,z:ez-OZ});msnTick();const ok5=!MSN;res.push('engines '+ok5);clear();
  M=msnGive(P,w,'hold');PL.x=M.X-OX;PL.z=M.Z-OZ;PL.y=gy(PL.x,PL.z)+1;let waves=0;run(95,()=>{if(foeClock%1<0.05){msnTick();if(MSN)waves=MSN.wv;}return !MSN;});const ok6=!MSN&&waves===3;res.push('held, waves '+waves);toPL(X0,Z0);clear();
  M=msnGive(P,w,'chief');M.t0=foeClock-M.lim-1;const m1=WREC.m;msnTick();const ok7=!MSN&&WREC.m===m1;res.push('out of time '+ok7);clear();
  info(res.join(' ; '));assert(ok1&&ok2&&ok3&&ok4&&ok5&&ok6&&ok7,'the tasks: a named warchief slain, captives freed (and no one\'s target), word carried, a standard taken back (coin and the banner), stones into the yard, the stakes held through three waves; a task out of time fails');}
// the camp's life: soldiers of the Leaguer sit and spar (without harm); at night by the fires a song
{const L=[];for(let i=0;i<8;i++)L.push(add('rsword',PL.x+3+(i%4)*1.5,PL.z+3+Math.floor(i/4)*1.5,{hold:0,site:s,t:2}));const hp0=L.reduce((a,f)=>a+f.hp,0);let spar=0,sit=0;
  settings.time='night';campSingT=0.5;run(40,()=>{for(const f of L){if(f.atkK==='spar'&&f.atk>0)spar=1;if(f.camp&&f.camp.k==='sit'&&f.m.root.position.y<-0.5)sit=1;}});settings.time='cycle';
  info('the camp: sitting',sit,'; sparring',spar,'; harm done',hp0-L.reduce((a,f)=>a+f.hp,0),'; the song again in',campSingT.toFixed(0),'s');assert(sit&&spar&&L.reduce((a,f)=>a+f.hp,0)===hp0,'soldiers of the Leaguer sit by the fires and spar without harm');clear();}
// salvage from the fallen of the wastes; a fallen standard borne back
{const look=f=>{const e=eyePos();PL.yaw=Math.atan2(-(f.x-PL.x),-(f.z-PL.z));PL.pitch=Math.atan2(f.y+0.2-e.y,Math.hypot(f.x-PL.x,f.z-PL.z));};
  const o=add('raider',PL.x,PL.z-2.2);foeFalls(o,o);look(o);inv[sel]=null;act(2);const a=!!o.salv;const r=add('rstd',PL.x+2.2,PL.z);foeFalls(r,r);look(r);const s0=WREC.s;act(2);
  info('salvage from a fallen orc',a,'; a fallen standard borne back',!!r.salv,'standards',s0,'->',WREC.s);assert(a&&r.salv&&WREC.s===s0+1,'the fallen of the wastes can be searched, and a fallen standard of the hosts borne back');clear();}
// the record and its names; the panel, the journal, the save; the council drawn
{WREC.k=1;const t0=WREC.t.length;warRec('k',9);const named=WREC.t.includes('the Blooded');const out=[];campJournal(out);warCouncil(null);const open=invOpen;closeInv();
  info('ten slain: named',WREC.t.slice(t0).join(','),'; the journal',out[1],'; the panel',campPanel(w).replace(/<[^>]+>/g,' '),'; the council open',open);
  assert(named&&out[1]==='YOUR WAR RECORD'&&/Supplies/.test(campPanel(w))&&warCampSave().wrc===WREC&&open,'the war record earns names, is in the journal and the panel and is saved; the council of war opens');}
clear();
