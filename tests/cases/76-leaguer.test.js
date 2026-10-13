// The Leaguer's life (D-084): the camp of the hosts is full of people at their work. Its places (the muster field, the range, the
// tents of the three peoples, the cook-fires, the wagons, the field hospital, the sentries' beat, knots of talk) are peopled when
// the player is in the camp, well past the folk allowed elsewhere; the muster drills in ranks to a sergeant's call, the blows on
// one beat; archers loose at the butts and their arrows harm no one and stand where they strike; smiths strike sparks; cooks
// kneel at the fires; bearers carry loads to the stores and back; the sick lie until they are mended, then go back to the lines;
// sentries walk their beat; soldiers stand and talk in knots.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=9;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const clear=()=>{hostDismiss(null);for(const f of [...foes])removeFoe(f);foeSpots.clear();warArmies.length=0;fieldB.length=0;CONVOYS.length=0;MSN=null;};
const gy=(x,z)=>ground[Math.floor(x)+W*Math.floor(z)];
const toPL=(X,Z)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=gy(PL.x,PL.z)+1;};
const [X0,Z0]=at(P.uC0+110,0);gen(X0,Z0);toPL(X0,Z0);playing=false;warClk=1e9;clear();warS.clear();WARS.clear();warPlay=0;warStateTick();WC.clk=1;WC.a=1;settings.time='day';
const w=WARS.get(P.id);w.cvT=1e12;
// the places of the Leaguer, and its people
const need=['x_muster','w_range','r_tents','e_tents','d_tents','x_cook','x_haul','x_sick','x_sentry','x_chat'],K=new Map();for(const p of s.lay.spots)K.set(p.kind,(K.get(p.kind)||0)+1);
info('the Leaguer\'s places:',need.map(k=>k+' '+(K.get(k)||0)).join(', '));assert(need.every(k=>K.get(k)&&FOE_HOME[k]),'the Leaguer has its muster field, range, tents of the three peoples, cook-fires, wagons, hospital, sentries and knots of talk');
const spotOf=k=>s.lay.spots.find(p=>p.kind===k);
// where the player stands in it, every place within reach is peopled, many more than elsewhere
{let n=0;const by={};for(const [U,V] of [[150,0],[60,0]]){const [X,Z]=at(P.uC0+U,V);toPL(X,Z);for(let i=0;i<3;i++)foeSpawnTick();}
  for(const f of foes)if(!f.dead&&f.site===s&&FOES[f.kind].folk){n++;const a=CAMP_ACT[f.spk]||'about';by[a]=(by[a]||0)+1;}
  info('in the Leaguer:',n,'folk (elsewhere at most',FOLK_CAP+')',JSON.stringify(by),'; the player in it',campIn());
  assert(campIn()&&n>FOLK_CAP+14&&Object.keys(by).length>=5,'the Leaguer is full of people at work, far more than the folk elsewhere');clear();}
// a place peopled alone, with the player beside it
const people=k=>{clear();const p=spotOf(k),[X,Z]=at(p.u,p.v);toPL(X+8,Z+8);foeSpots.clear();foeSpawnTick();return foes.filter(f=>!f.dead&&f.spk===k);};
// the muster field: ranks, the sergeant before them, every blow on one beat, his call
{const L=people('x_muster');let beat=0;campShoutT=0;
  run(25,()=>{const sw=L.filter(f=>!f.drL&&f.atkK==='spar'&&f.atk>0);if(sw.length>=3&&new Set(sw.map(f=>f.drB)).size===1)beat=Math.max(beat,sw.length);});const shout=campShoutT>0;
  const lead=L.find(f=>f.drL),off=L.filter(f=>f.drS&&!f.drL).map(f=>Math.hypot(f.x-f.drS[0],f.z-f.drS[1])),fa=lead?Math.abs(angDiffV(lead.hd,L.find(f=>!f.drL).hd)):0;
  info('the muster:',L.length,'with',lead?FOES[lead.kind].n:'no one','before them; off their places at most',Math.max(...off).toFixed(1),'; striking together',beat,'; the call',shout,'; facing them',fa.toFixed(2));
  assert(L.length>=8&&lead&&Math.max(...off)<2.5&&beat>=3&&shout&&fa>2.5,'the muster drills in ranks before its sergeant, striking on one beat to his call');}
// the range: arrows loosed at the butts, harming no one, standing where they strike
{const L=people('w_range'),hp0=L.reduce((a,f)=>a+f.hp,0),s0=armsStuck.length;let shot=0,harm=0;const seen=new Set();
  run(25,()=>{for(const q of shots)if(!seen.has(q)&&q.k==='arrow'){seen.add(q);shot++;if(q.dmg||q.atP)harm++;}});
  info('the range:',L.length,'archers; arrows loosed',shot,'(with harm',harm+'); stood in the butts',armsStuck.length-s0);
  assert(L.length>=2&&shot>=4&&harm===0&&L.reduce((a,f)=>a+f.hp,0)===hp0&&armsStuck.length>s0,'archers loose at the butts; the arrows harm no one and stand where they strike');}
// the smithy: hammer and sparks
{const L=people('r_smithy');let ham=0;const p0=parts.length;let sparks=0;run(10,()=>{for(const f of L)if(f.smith&&f.atk>0)ham=1;sparks=Math.max(sparks,parts.length-p0);});
  info('the smithy:',L.length,'at work; hammering',ham,'; sparks',sparks);assert(L.length&&ham&&sparks>0,'smiths hammer at the smithy in a spray of sparks');}
// the cook-fires: kneeling, facing the fire, the steam
{const L=people('x_cook');run(6);const sitting=L.filter(f=>f.camp&&f.camp.k==='sit'&&f.m.root.position.y<-0.5).length;
  info('the cook-fires:',L.length,'cooks,',sitting,'kneeling');assert(L.length>=2&&sitting===L.length,'cooks kneel at the cook-fires');}
// the wagons: bearers carry loads to the stores and back
{const L=people('x_haul'),x0=L.map(f=>[f.x,f.z]);let loaded=0,far=0;run(40,()=>{loaded=Math.max(loaded,L.filter(f=>f.carry).length);L.forEach((f,i)=>{far=Math.max(far,Math.hypot(f.x-x0[i][0],f.z-x0[i][1]));});});
  info('the wagons:',L.length,'bearers; loaded at once',loaded,'; gone',far.toFixed(0),'blocks');assert(L.length>=3&&loaded>=1&&far>8,'bearers carry loads between the wagons and the stores');}
// the field hospital: the sick lie until mended, then go back to the lines
{const L=people('x_sick');run(2);const lying=L.filter(f=>f.rest&&f.hp<f.mhp).length;for(const f of L)f.hp=f.mhp;run(4);const up=L.filter(f=>!f.rest&&f.spk==='').length;
  info('the hospital:',L.length,'sick,',lying,'lying hurt; mended and gone back',up);
  assert(L.length>=3&&lying===L.length&&up===L.length,'the sick lie in the field hospital until they are mended, then go back to the lines');}
// the sentries walk their beat
{const L=people('x_sentry'),x0=L.map(f=>[f.x,f.z]);let far=0;run(30,()=>{L.forEach((f,i)=>{far=Math.max(far,Math.hypot(f.x-x0[i][0],f.z-x0[i][1]));});});
  info('the sentries:',L.length,'; walked',far.toFixed(0));assert(L.length>=1&&far>15,'sentries walk their beat inside the rampart');}
// knots of talk: they face each other
{const L=people('x_chat');run(8);const face=L.filter(f=>{const c=foeSpots.get(f.spot);return f.st!=='idle'||Math.abs(angDiffV(f.hd,Math.atan2(c.x-OX-f.x,c.z-OZ-f.z)))<0.3;}).length;
  info('a knot of talk:',L.length,', facing in',face);assert(L.length>=3&&face===L.length,'soldiers stand and talk in knots among the tents');}
clear();settings.time='cycle';
