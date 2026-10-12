// ---- Engines in the player's hands, and pitched battles (W8c, D-078).
// The engines: the player works a trebuchet of the siege lines (dtreb) or, once the gate has fallen, one of the orcs' catapults
// (ocata) turned on its masters. Used (looking at its timbers) the player takes its rope; then the use button looses where they
// look, up to 260 blocks off, a stone (or a burning pot) that breaks the wastes' soldiers about where it lands; the crew wind it
// back, the quicker for engineers of the hosts about it; a mark of sparks shows where it will land; walking away leaves it. A bolt
// thrower (a block the player sets down anywhere) looses a great bolt through four foes in a line, loaded with a crossbow bolt.
// Pitched battles: now and then both sides take the field at once (`fieldBattle`) in a named battle. When the two are within 90 a
// champion of each steps out and they fight alone between the lines (`f.duel`): the side whose champion wins takes heart, the other
// loses it. When both armies are done the battle is told (`fieldReport`): who held the field, the fallen, the duel and the
// player's part; it is written in the war's chronicle, marked on the world map (`w.pb`), and a rider gallops back with the word.
// Marching columns raise dust.
let engOn=null,engT=0,engMk=0;const ENG_R=260,thrT=new Map(),fieldB=[];
DEATH.engine='A stone from an engine fell on you';
// the engine whose timbers stand at (x, z), at a gate within 200
function engAt(x,z){const P=wasteGateAt(Math.floor(x+OX),Math.floor(z+OZ),200);if(!P)return null;const s=wgSite(P),w=WARS.get(P.id),[u,v]=wgUV(P,x+OX,z+OZ);
  for(const e of s.lay.parts){if(e.k!=='dtreb'&&!(e.k==='ocata'&&w&&w.s>=2))continue;if(u<e.u0-1||u>e.u1+1||v<e.v0-1||v>e.v1+1)continue;
    const [ex,ez]=siteXZ(s,(e.u0+e.u1)/2,(e.v0+e.v1)/2);return {P:P,e:e,x:ex+0.5-OX,z:ez+0.5-OZ,y:(e.y||P.hG)+11,orc:e.k==='ocata'};}
  return null;}
const engCrew=E=>{let n=0;for(const f of foes)if(!f.dead&&FOES[f.kind].eng&&Math.hypot(f.x-E.x,f.z-E.z)<14)n++;return n;};
// the use button: loose the engine the player works, or take one's rope (looking at it)
function engAct(){
  if(engOn){engLoose();return true;}
  const th=raycast(eyePos(),camDir(),6);if(!th||th.id===BOLTTHR)return false;const E=engAt(th.x+0.5,th.z+0.5);if(!E)return false;
  engOn=E;engT=Math.min(engT,foeClock+1);toast('You take the '+(E.orc?'catapult\'s':'trebuchet\'s')+' rope. Look where to loose and use again; walk away to leave it'+(engCrew(E)?'. Its crew stand ready':''));hint('engine');return true;}
// where the shot will land: the ground where the player looks, or 200 on along the way they look
function engMark(){const e=eyePos(),d=camDir(),hit=raycast(e,d,ENG_R);if(hit)return [hit.x+0.5,hit.y+1,hit.z+0.5];
  const l=Math.hypot(d.x,d.z)||1,x=PL.x+d.x/l*200,z=PL.z+d.z/l*200,bx=Math.floor(x),bz=Math.floor(z);return [x,bx>=0&&bz>=0&&bx<W&&bz<D?ground[bx+W*bz]+1:PL.y,z];}
function engLoose(){const E=engOn;if(foeClock<engT){toast('The crew are winding the arm back down: '+Math.ceil(engT-foeClock)+' s');return;}
  const [tx,ty,tz]=engMark(),c=engCrew(E);warRec('e');engT=foeClock+(SURV()?(c>=2?5:c?8:14):2);
  const x=E.x,y=E.y,z=E.z,T=2.4+Math.hypot(tx-x,tz-z)/90,g=16,mat=new THREE.MeshBasicMaterial({color:E.orc?new THREE.Color(1,0.5,0.12):new THREE.Color(0.34,0.33,0.32),transparent:E.orc,opacity:E.orc?0.92:1}),m=new THREE.Mesh(shotGeo,mat);
  m.scale.set(0.9,0.9,0.9);m.frustumCulled=false;scene.add(m);warStones.push({x:x,y:y,z:z,vx:(tx-x)/T,vz:(tz-z)/T,vy:(ty-y)/T+0.5*g*T,fire:E.orc,life:T+1.5,m:m,hit:engHit,byP:1});
  sfxBoom(Math.hypot(x-PL.x,z-PL.z)*1.6,[x,y,z]);burst(0.6,'lowpass',120,0.9,0.4,0.1,[x,y,z]);shake=Math.max(shake,0.15);
  const cr=foes.find(f=>!f.dead&&FOES[f.kind].eng&&Math.hypot(f.x-E.x,f.z-E.z)<14);if(cr)morBark(cr,'loose',1);}
// it lands: the wastes' soldiers within four or so broken and thrown (the player credited), a pot's fire; the player near it hurt
function engHit(s){const r=s.fire?4:4.5,dm=s.fire?14:22,x=s.x,y=s.y,z=s.z;let n=0;msnEngine(s);
  for(const g of foes){const G=FOES[g.kind];if(g.dead||G.folk||G.lord)continue;const dx=g.x-x,dz=g.z-z,d=Math.hypot(dx,dz);if(d>r||Math.abs(g.y-y)>5)continue;
    foeStruck(g,dm*(1-d/(r+1.5)),dx||0.1,dz||0.1,{kb:9,shot:1,pierce:1,stagger:1});n++;}
  if(s.fire)for(let k=0;k<24;k++)spawnP(x+(Math.random()-.5)*3,y+0.3,z+(Math.random()-.5)*3,(Math.random()-.5)*3,Math.random()*3,(Math.random()-.5)*3,[1,0.45+Math.random()*0.3,0.1],0.8,2);
  const d=Math.hypot(x-PL.x,z-PL.z);sfxBoom(d*1.2,[x,y,z]);shake=Math.max(shake,Math.max(0,0.5*(1-d/40)));
  if(foeTarget()&&d<3&&Math.abs(PL.y-y)<3)hurt(8,'engine');if(n>=3&&d<300)toast('A fine shot: '+n+' of the wastes caught where it fell');}
// every frame: the engine left when the player walks away, and the mark of where it will land
function engTick(dt){if(!engOn)return;const E=engOn;if(Math.hypot(PL.x-E.x,PL.z-E.z)>10){engOn=null;toast('You leave the engine');return;}
  if((engMk-=dt)>0)return;engMk=0.12;const [x,y,z]=engMark(),k=foeClock<engT;for(let i=0;i<3;i++)spawnP(x+(Math.random()-.5)*1.5,y+0.2,z+(Math.random()-.5)*1.5,0,0.8,0,k?[0.6,0.6,0.6]:[1,0.3,0.15],0.5,-0.2);}
// a bolt thrower set down by the player: loaded with a crossbow bolt, it looses a great bolt where the player looks, through four
function engBolt(x,y,z){const k=x+','+y+','+z;if(foeClock<(thrT.get(k)||0)){toast('The bolt thrower is being wound: '+Math.ceil(thrT.get(k)-foeClock)+' s');return true;}
  if(!armsHas(410)){toast('No crossbow bolts to load it');return true;}armsTake(410);thrT.set(k,foeClock+(SURV()?3:1));if(thrT.size>64)thrT.delete(thrT.keys().next().value);
  armsShoot('bolt',20,70,{pierce:3});burst(0.25,'highpass',900,1.2,0.4,0,[x+0.5,y+0.5,z+0.5]);burst(0.4,'lowpass',200,1,0.3,0,[x+0.5,y+0.5,z+0.5]);swing=1;hint('bolt');return true;}
// ---- Pitched battles
const FIELD_ORD=['','Second ','Third ','Fourth ','Fifth ','Sixth ','Seventh ','Eighth ','Ninth ','Tenth '];
function fieldName(P,w){const n=w.pbn||0;w.pbn=n+1;return 'the '+(FIELD_ORD[n]||'')+'Battle '+(w.s>=2?'of '+P.road.replace(/^The /,'the '):'before '+P.name.replace(/^The /,'the '));}
function fieldBattle(P){const w=WARS.get(P.id);if(!w)return null;const A=warArmy(P,true),B=warArmy(P,false);emberDrive(B);
  const F={P:P,w:w,A:A,B:B,n:fieldName(P,w),t0:foeClock,pk:0,duel:null,X:0,Z:0};A.fb=F;B.fb=F;fieldB.push(F);saveDirty=true;
  toast('Both sides take the field together: '+F.n.replace(/^the /,'The ')+' begins');return F;}
const fieldNm=f=>f.hero?f.hero.n:'a '+FOES[f.kind].n.toLowerCase();
// the champion of a side: its hero, a chief, or its strongest on foot (no archers, horsemen, great beasts or hounds)
function fieldChamp(L){let best=null,bs=-1;for(const f of L){const G=FOES[f.kind];if(G.lord||G.civ||G.mount||G.shot||G.hound||G.std||f.rout||f.wnd||G.mass<0.2)continue;
  const s=(f.hero?1000:0)+(G.boss?500:0)+f.mhp*(f.dmgK||1)+G.dmg*3;if(s>bs){bs=s;best=f;}}return best;}
function fieldDuel(F,la,lb){const a=fieldChamp(la),b=fieldChamp(lb);if(!a||!b){F.duel={end:1};return null;}
  F.duel={a:a,b:b,t:foeClock};a.duel=b;b.duel=a;for(const f of [a,b]){f.foe=f.duel;f.eseen=0;f.st='chase';f.seen=0;f.t=0;f.waitA=null;f.lineHold=null;f.horn=foeClock+60;f.fear=0;}
  if(Math.hypot(a.x-PL.x,a.z-PL.z)<160)toast('Champions step out between the lines: '+fieldNm(a)+' of the hosts, and '+fieldNm(b)+' of the wastes');
  warCry(false,6,a.x,a.y+2,a.z);warCry(true,6,b.x,b.y+2,b.z);return F.duel;}
function duelTick(F){const D=F.duel,a=D.a,b=D.b,ea=!!(a.dead||a.gone||a.wnd),eb=!!(b.dead||b.gone||b.wnd);
  if(!ea&&!eb&&foeClock-D.t<50)return;D.end=1;a.duel=b.duel=null;const near=Math.hypot(a.x-PL.x,a.z-PL.z)<160;
  if(ea===eb){if(near)toast('The champions are parted as the lines close');return;}
  const al=!ea,win=al?a:b,lose=al?b:a;D.w=al?1:2;D.wn=fieldNm(win);D.ln=fieldNm(lose);
  for(const f of (al?F.A:F.B).m)if(!f.dead){f.fear=0;f.horn=Math.max(f.horn||0,foeClock+15);}
  for(const f of (al?F.B:F.A).m)if(!f.dead)f.fear=(f.fear||0)+0.35;
  warCry(!al,14,win.x,win.y+2,win.z);if(near)toast(D.wn.replace(/^a /,'A ')+' slays '+D.ln+' between the lines! '+(al?'The hosts roar and take heart':'The wastes howl, and the hosts\' hearts sink'));}
// once a second: the champions when the armies near each other, the duel, and the battle told when both armies are done
function fieldTick(){
  for(let i=fieldB.length-1;i>=0;i--){const F=fieldB[i],la=F.A.m.filter(f=>!f.dead&&!f.gone),lb=F.B.m.filter(f=>!f.dead&&!f.gone);
    if(la.length&&lb.length){const [ax,az]=warMid(F.A),[bx,bz]=warMid(F.B);F.X=(ax+bx)/2+OX;F.Z=(az+bz)/2+OZ;if(!F.duel&&F.A.go&&F.B.go&&Math.hypot(ax-bx,az-bz)<90)fieldDuel(F,la,lb);}
    if(F.duel&&!F.duel.end)duelTick(F);
    if(!warArmies.includes(F.A)&&!warArmies.includes(F.B)||foeClock-F.t0>900){fieldReport(F);fieldB.splice(i,1);}}}
// the battle told: in the chronicle, to the player if near, on the map; a rider takes the word back to the camp
function fieldReport(F){const {A,B,w,P}=F,na=A.m.length,nb=B.m.length;if(na+nb<10)return null;const fa=A.m.filter(f=>f.dead).length,fb=B.m.filter(f=>f.dead).length;
  const won=B.brk&&!A.brk?true:A.brk&&!B.brk?false:fa/(na||1)<=fb/(nb||1),D=F.duel;
  let s=F.n.replace(/^the /,'The ')+': the hosts '+na+' strong against a warhost of '+nb+'. '+(won?'The hosts held the field':'The wastes held the field')+'; '+fa+' of the hosts fell and '+fb+' of the wastes'+
    (B.brk?', and the warhost broke and fled':'')+(A.brk?', and the hosts broke and fell back':'')+'.'+(D&&D.w?' Between the lines '+D.wn+' slew '+D.ln+' in single combat.':'')+(F.pk?' You slew '+F.pk+' of the wastes.':'');
  warLog(w,s);if(F.pk)warRec('b');if(!w.pb)w.pb=[];if(F.X||F.Z){w.pb.push([Math.round(F.X),Math.round(F.Z),won?1:0,F.n]);if(w.pb.length>12)w.pb.shift();}
  const d=Math.hypot(F.X-OX-PL.x,F.Z-OZ-PL.z);if(d<400)toast(s);
  if(won)morCheer(A.m.filter(f=>!f.dead&&!f.gone));else morCheer(B.m.filter(f=>!f.dead&&!f.gone));
  if(d<150)fieldRider(F,won);saveDirty=true;return s;}
// a rider of the hosts gallops from the field back to the camp with word of the battle; it fights no one
function fieldRider(F,won){const x=F.X-OX,z=F.Z-OZ,bx=Math.floor(x),bz=Math.floor(z);if(bx<2||bz<2||bx>=W-2||bz>=D-2)return null;const y=foeStand(x,ground[bx+W*bz]+2,z,3);if(y<0)return null;
  const f=addFoe('hout',x,y,z,{st:'idle',t:1,prov:'wg:'+F.P.id,site:wgSite(F.P)});f.msg=1;const [hx,hz]=warHosp(F.P);warAim(f,[hx+0.5,hz+0.5,1]);f.way=[];f.st='return';f.t=60;f.pace=FOES.hout.run;
  toast('A rider gallops back to '+F.P.camp.replace(/^The /,'the ')+' with word '+(won?'of victory':'of the battle'));return f;}
// the player's part: those of the wastes they slay in a pitched battle
function fieldSlain(f){if(f.army&&f.army.fb)f.army.fb.pk++;}
// marching columns raise dust on dry ground, four times a second
let fieldDT=0,fieldST=0;
function fieldFrame(dt){engTick(dt);if((fieldST-=dt)<=0){fieldST=1;fieldTick();}
  if((fieldDT-=dt)>0)return;fieldDT=0.25;let n=0;
  for(const f of foes){if(n>=24)break;if(f.dead||!(f.war||f.hst)||f.sp<1.2||f.far||(f.id+foeFrame)%5)continue;const id=get(Math.floor(f.x),Math.floor(f.y)-1,Math.floor(f.z));
    if(id===GRASS||isWetId(id))continue;n++;spawnP(f.x+(Math.random()-.5)*0.6,f.y+0.15,f.z+(Math.random()-.5)*0.6,(Math.random()-.5)*0.6,0.5+Math.random()*0.4,(Math.random()-.5)*0.6,[0.52,0.48,0.42],1.1,-0.05);}}
// battle sites on the world map: crossed swords, blue where the hosts held the field, red where the wastes did
function fieldMap(g,sx,sz,w){for(const [X,Z,won] of w.pb||[]){const x=sx(X),y=sz(Z);g.strokeStyle=won?'#2a4c9c':'#a82a1a';g.lineWidth=2;g.beginPath();g.moveTo(x-5,y-5);g.lineTo(x+5,y+5);g.moveTo(x+5,y-5);g.lineTo(x-5,y+5);g.stroke();}}
