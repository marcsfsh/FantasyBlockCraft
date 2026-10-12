// ---- The heroes of each war (W3, D-070; Q159, Q174). Every found war keeps three captains of the hosts and two warchiefs of the
// wastes by name (`w.hr`, saved with the war): each of a people (a captain or lord of the realm, a marshal of the riders, a
// lord-captain of the high elves, a captain of the wood, a captain or thane of the dwarves; a warchief of the orcs, a chieftain
// of the goblins), named in its people's style with an epithet. An army sent while the player is near is led by the one of its
// side who has led fewest (`A.hero`): the hero marches with its first company, two of the elite at its side, two and a half
// times as hard to kill and half again as hard a hitter; its coming, its deeds (those it slays) and its fall are told and written
// in the chronicle. The fallen stay dead: the hosts raise a cairn for each behind the lines (war-works.js), the journal remembers
// them, and a new captain or warchief takes up the command.
const HERO={r:{k:'rcapt',p:'realm',t:['Captain','Knight-Captain','Lord'],g:['rguard','rguard']},h:{k:'hcapt',p:'rider',t:['Marshal','Thane'],g:['hlancer','hlancer']},
  e:{k:'ecapt',p:'elder',t:['Lord-Captain','Warden'],g:['eblade','eblade']},w:{k:'wcapt',p:'woodelf',t:['Captain of the Wood'],g:['wknife','eblade']},
  d:{k:'dcapt',p:'dwarf',t:['Captain','Thane'],g:['diron','diron']},o:{k:'ochief',p:'orc',t:['Warchief','Gorechief'],g:['brute','oshield']},g:{k:'gchief',p:'goblin',t:['Chieftain'],g:['wolfrid','gswarm']}};
const HERO_EP={al:['the Bold','the Steadfast','Ironhand','the Grey','the Fair','Oathkeeper','the Unbowed','Stormhelm','Brightblade','the Watchful','Longspear','the Young'],
  or:['Skullsplitter','the Burnt','Gutripper','Blackmaw','the Flayer','Bonecrusher','Ashtongue','the Cruel','Ironjaw','Redhand']};
function heroNew(w,side){const H=w.hr,i=H.n++,r=rngAt(w.X+i*131,9911,w.Z),ps=side==='al'?['r','d','e','h','w']:['o','o','g'],p=ps[Math.floor(r()*ps.length)],D=HERO[p];
  const h={id:i,p:p,k:D.k,n:D.t[Math.floor(r()*D.t.length)]+' '+fullName(D.p,r,false)+' '+HERO_EP[side][Math.floor(r()*HERO_EP[side].length)],side:side,kills:0,bat:0,t0:Math.round(warPlay)};
  H[side].push(h);return h;}
function heroesOf(w){if(!w.hr)w.hr={n:0,al:[],or:[],dead:[]};while(w.hr.al.length<3)heroNew(w,'al');while(w.hr.or.length<2)heroNew(w,'or');return w.hr;}
// an army sent while the player is near: its hero (the one of its side who has led fewest), told
function warHeroLead(A){const w=WARS.get(A.P.id);if(!w||A.def)return;const H=heroesOf(w),L=H[A.al?'al':'or'].slice().sort((a,b)=>a.bat-b.bat);const h=L[0];A.hero=h;h.bat++;A.heroK0=h.kills;
  setTimeout(()=>toast(h.n+(A.al?' leads the hosts':' leads the warhost')),1800);saveDirty=true;}
// with the army's first company: the hero and two of the elite at its side
function warHeroSpawn(A,grp,o){const h=A.hero;if(!h||A.heroF||!grp.length)return;const g0=grp[0],D=HERO[h.p],out=[];
  for(const k of [h.k,...D.g]){const f=addFoe(k,g0.x+(Math.random()-0.5)*2,g0.y,g0.z+(Math.random()-0.5)*2,o||{});out.push(f);}
  const f=out[0];f.hero=h;f.hp=f.mhp=Math.round(FOES[h.k].hp*2.5);f.dmgK=1.5;A.heroF=f;grp.push(...out);}
// a blow that fells: the hero's deed counted; a hero fallen
function warHeroFell(g,by){if(by&&by.hero&&!g.cntH){g.cntH=1;by.hero.kills++;}if(g.hero&&!g.hero.dead)heroFalls(g.hero,by);}
function heroFalls(h,by){h.dead=1;const w=[...WARS.values()].find(w=>w.hr&&(w.hr.al.includes(h)||w.hr.or.includes(h)));if(!w)return;const H=w.hr,L=H[h.side];L.splice(L.indexOf(h),1);
  const who=by&&by.kind?(by.hero?by.hero.n:'a'+(/^[AEIOU]/.test(FOES[by.kind].n)?'n ':' ')+FOES[by.kind].n.toLowerCase()):'';
  H.dead.push({n:h.n,p:h.p,side:h.side,kills:h.kills,bat:h.bat,t:Math.round(warPlay),by:who});const nh=heroNew(w,h.side),near=Math.hypot(w.X-(PL.x+OX),w.Z-(PL.z+OZ))<400;
  warLog(w,h.n+' fell'+(who?' to '+who:'')+', having slain '+h.kills+(h.bat?' in '+h.bat+' battle'+(h.bat===1?'':'s'):'')+'.'+(h.side==='al'?' The hosts raise a cairn behind the lines.':'')+' '+nh.n+' takes up the command.');
  if(near){toast(h.n+' has fallen!');setTimeout(()=>toast(nh.n+' takes up the command'),3000);}saveDirty=true;}
// when an army is done: what its hero did
function warHeroDeeds(A,w){const h=A.hero;if(!h||h.dead)return null;const k=h.kills-(A.heroK0||0);return h.n+' led them'+(k?' and slew '+k:'')+'.';}
// near a hero of the wastes, once: a warning
function warHeroSeen(){for(const f of foes){if(!f.hero||f.dead||f.heroSeen||Math.hypot(f.x-PL.x,f.z-PL.z)>24)continue;f.heroSeen=1;if(!FOES[f.kind].folk)toast(f.hero.n+' of the wastes is here!');}}
// the journal: the heroes of each war, living and remembered
function warHeroJournal(w,out){if(!w.hr)return;const H=w.hr,line=h=>h.n+' (slain '+h.kills+', battles '+h.bat+')';
  out.push('Captains of the hosts: '+H.al.map(line).join('; ')+'.','Warchiefs of the wastes: '+H.or.map(line).join('; ')+'.');
  if(H.dead.length)out.push('Remembered: '+H.dead.map(d=>d.n+', fell in hour '+(d.t/3600).toFixed(1)+(d.by?' to '+d.by:'')+', slew '+d.kills).join('; ')+'.');}
