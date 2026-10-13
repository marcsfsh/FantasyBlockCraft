// ---- The white realm's court and its people (D-089), from the realm's own parts and painters (FOLK_KIT, MODEL_KIT.realm): the
// king of the realm in black robes worked in silver under a long black mantle with the white sign on its back, a tall crown of
// silver with the star at its brow and white stones about it, a sceptre with a star; the queen in a gown of white or silver
// under the mantle and the crown; the guard of the citadel in silver helm and white plume, a black cloak over the realm's mail;
// the herald in a tabard of black and white with the sign, his long trumpet of gold; the healer in white with a coif and a
// satchel of herbs; the innkeeper in his apron with a tankard; the minstrel in a bright doublet with a lute and a feathered cap;
// the town crier in his robe and hat with a bell; the watchman of the night in a black cloak with a lantern on a pole; children;
// the shepherd with his crook; the sailor in a striped shirt and a knitted cap with a coil of rope; the warden of the hallows
// in grey under a hood with a lantern; and the knights of the tourney in their own colours. Their beasts and ships: the
// charger in a caparison, the ox, the wagon with its team, and a cog of the realm under sail.
(function(){
  const {ALL,SIDE,sh,hz,cloth,plate,leather,band,mail,STEEL,SILVER,GOLD,BLACK}=FOLK_KIT,R=MODEL_KIT.realm,WHITE=[238,240,244];
  const base=(k,drop)=>AM_KINDS[k].parts.filter(p=>!(drop||[]).includes(p[0])).map(p=>p.slice());
  const recoat=(k,o)=>AM_KINDS[k].coats.map(([c,w],i)=>[Object.assign({},c,typeof o==='function'?o(c,i):o),w]);
  // a painter that passes over the parts a model has dropped, so a kind's own painting can be reused for a model made from it
  const skip=(P,names)=>{const set=new Set(names);return new Proxy(P,{get(t,k){const f=t[k];if(typeof f!=='function')return f;
    return (n,...a)=>Array.isArray(n)?f.call(t,n.filter(x=>!set.has(x)),...a):set.has(n)?undefined:f.call(t,n,...a);}});};
  const crown=()=>[['crownR','head',[0,5,0],[-3.75,0,-3.75,7.5,2.5,7.5],0,{head:1}],['crownS','crownR',[0,2.5,3.75],[-1,0,-0.5,2,2.5,1],0,{head:1,nb:1}]];
  const crownPaint=P=>{plate(P,['crownR'],SILVER);P.map('crownR',SIDE,(s,t,w,h)=>t===h-2&&s%3===1?[226,236,250]:t===0?sh(SILVER,-30):null);P.map('crownS',ALL,(s,t)=>sh([248,250,255],(s+t)%2?-10:10));};
  const mantle=len=>['mantle','body',[0,10.5,-2.4],[-4.5,-len,-0.5,9,len,1],[0.08,0,0],{nb:1}];
  const mantlePaint=P=>{cloth(P,['mantle'],[22,22,30],{off:2});P.map('mantle',ALL,(s,t,w,h)=>s<2||s>=w-2||t>=h-2?sh(SILVER,hz(s,t,941)*6):null);R.sign(P,'mantle','B',1,8,WHITE);};
  const lanternPaint=(P,n)=>P.map(n,ALL,(s,t,w,h)=>s===0||s===w-1||t===0||t===h-1?sh(GOLD,-20):[255,226,140]);
  Object.assign(AM_KINDS,{
    rking:{res:2,tex:256,scale:1.1,parts:[...base('rnoble',['mantle']),mantle(22),...crown(),['scep','armR',[1.5,-10,0.5],[-0.5,-4,-0.5,1,17,1],[0.12,0,0],{nb:1}],['scepS','scep',[0,13,0],[-1,0,-1,2,2,2],0,{nb:1}]],
      coats:recoat('rnoble',(c,i)=>({hair:[[150,146,140],[70,46,30],[40,30,24]][i%3],beard:1})),
      paint(P,c){AM_KINDS.rnoble.paint(P,c);mantlePaint(P);crownPaint(P);P.map('scep',ALL,(s,t)=>t%5===0?sh(SILVER,20):sh(SILVER,-14));P.map('scepS',ALL,(s,t)=>sh([250,250,255],(s+t)%2?-14:8));}},
    rqueen:{res:2,tex:256,scale:1.06,parts:[...base('rwoman'),mantle(23),...crown()],coats:recoat('rwoman',(c,i)=>{const g=[[232,232,236],[206,212,226],[226,222,206]][i%3];return {cl:g,ap:g};}),
      paint(P,c){AM_KINDS.rwoman.paint(P,c);mantlePaint(P);crownPaint(P);band(P,'gown',SIDE,24,28,SILVER);}},
    rcguard:{res:2,tex:256,scale:1.05,parts:[...base('rspear',['crest']),['crest','helm',[0,4,0],[-0.5,0,-3,1,7,7],0,{head:1,nb:1,tp:['y',1,0.6,0,-1]}],['cape','body',[0,10.5,-2.4],[-4.5,-18,-0.5,9,18,1],[0.1,0,0],{nb:1}]],coats:R.coats(4),
      paint(P,c){AM_KINDS.rspear.paint(P,c);plate(P,['helm','brim','nasal','chL','pL','lL','vL','grL'],SILVER);P.map('crest',ALL,(s,t)=>sh([246,246,248],hz(s,t,943)*10+(s%2?-8:4)));
        cloth(P,['cape'],[22,22,30],{off:2});band(P,'cape',SIDE,32,36,SILVER);R.sign(P,'cape','B',1,6,WHITE);}},
    rherald:{res:2,tex:256,scale:1.03,parts:[...base('rman'),['tabard','body',[0,0,0],[-5,-5,-3,10,16,6]],['hat','head',[0,6,0],[-3.5,0,-3.5,7,1.5,7],0,{head:1}],
        ['trump','armR',[1.5,-10.5,0.5],[-0.5,-0.5,0,1,1,9],[1.3,0,0],{nb:1,tp:['z',2.5,2.5,0,0]}]],coats:recoat('rman',()=>({})),
      paint(P,c){AM_KINDS.rman.paint(P,c);P.map('tabard',ALL,(s,t,w,h,f)=>{const q=((s<w/2)?0:1)^((t<h/2)?0:1);return f==='T'||f==='D'?sh(BLACK,0):q?sh(WHITE,hz(s,t,945)*6):sh(BLACK,hz(s,t,947)*6);});
        P.map('tabard',SIDE,(s,t,w,h)=>t>=h-2?sh(SILVER,0):null);R.sign(P,'tabard','F',2,4,[238,240,244]);R.sign(P,'tabard','B',2,4,[238,240,244]);
        P.map('hat',ALL,(s,t)=>sh(BLACK,hz(s,t,949)*8));plate(P,['trump'],GOLD);}},
    rheal:{res:2,tex:256,parts:[...base('rwoman'),['coif','head',[0,4,0],[-3.25,0,-3.25,6.5,3.5,6.5],0,{head:1}],['satch','body',[-3.5,2,1],[-1,-3,-1.5,2,3.5,3],0,{nb:1}]],
      coats:recoat('rwoman',()=>({cl:[232,232,226],ap:[170,172,168]})),
      paint(P,c){AM_KINDS.rwoman.paint(P,c);P.map('coif',ALL,(s,t,w,h,f)=>f==='F'&&t>=1?[0,0,0,1]:sh([242,242,238],hz(s,t,951)*6));leather(P,['satch'],[120,84,50]);P.map('satch',['T'],(s,t)=>(s+t)%2?[90,150,80]:[150,104,200]);}},
    rinn:{res:2,tex:256,scale:1.04,parts:[...base('rman'),['apron','body',[0,0,0],[-5,-6,-3,10,12,6]],['tank','armR',[1.5,-10.5,1],[-1,-1.5,-1,2,3,2],0,{nb:1}]],coats:recoat('rman',(c,i)=>({beard:1})),
      paint(P,c){AM_KINDS.rman.paint(P,c);P.map('apron',ALL,(s,t,w,h,f)=>f==='B'||f==='T'?sh(c.cl,0):sh([232,226,210],hz(s,t,953)*8+(t===h-1?-16:0)));P.map('tank',ALL,(s,t)=>t===0?[242,238,226]:sh([150,152,160],s===0?20:-6));}},
    rminst:{res:2,tex:256,parts:[...base('rman'),['lute','body',[1.5,4,2.75],[-3,-3,-1,6,6,2],[0,0,0.7],{nb:1}],['lneck','lute',[0,3,0],[-0.5,0,-0.5,1,8,1],0,{nb:1}],
        ['mcap','head',[0,6,0],[-3.5,0,-3.5,7,1.5,7],[0,0,0.15],{head:1}],['mfeath','mcap',[2,1,-2],[-0.5,0,-0.5,1,5,1],[-0.6,0,-0.3],{head:1,nb:1}]],
      coats:recoat('rman',(c,i)=>({cl:[[176,40,44],[44,100,60],[220,170,50],[60,80,150],[150,60,140]][i%5]})),
      paint(P,c){AM_KINDS.rman.paint(P,c);P.map('tunic',SIDE,(s,t)=>(s>>2)%2?sh([236,226,180],hz(s,t,955)*6):null);
        P.map('lute',ALL,(s,t,w,h,f)=>f==='F'&&Math.hypot(s-5.5,t-5.5)<1.6?[40,30,24]:sh([176,120,60],hz(s,t,957)*10));P.map('lneck',ALL,(s,t)=>sh([110,74,44],t%3===0?16:0));
        P.map('mcap',ALL,(s,t)=>sh(c.cl,-30+hz(s,t,959)*8));P.map('mfeath',ALL,(s,t)=>sh([236,232,220],t%2?-18:8));}},
    rcrier:{res:2,tex:256,scale:1.04,parts:[...base('rmerch'),['bell','armR',[1.5,-11,1],[-1.25,-2.5,-1.25,2.5,2.5,2.5],0,{nb:1,tp:['-y',1.6,1.6,0,0]}]],coats:recoat('rmerch',(c,i)=>({cl:[[150,30,36],[30,80,60],[40,40,90]][i%3]})),
      paint(P,c){AM_KINDS.rmerch.paint(P,c);plate(P,['bell'],GOLD);}},
    rwatch:{res:2,tex:256,parts:R.soldier([['cape','body',[0,10.5,-2.4],[-4.5,-17,-0.5,9,17,1],[0.1,0,0],{nb:1}],['pole','armR',[1.5,-10,0.5],[-0.5,-7,-0.5,1,28,1],[0.15,0,0],{nb:1}],
        ['plamp','pole',[0,21,0],[-1.25,-3,-1.25,2.5,3,2.5],0,{nb:1}],['phook','pole',[0,21,0],[-0.5,0,-0.5,1,1,1],0,{nb:1}]]),coats:R.coats(1),
      paint(P,c){R.soldierPaint(P,c);cloth(P,['cape'],[22,22,30],{off:2});band(P,'cape',SIDE,30,34,SILVER);P.map('pole',ALL,(s,t)=>sh([100,74,48],hz(s,t>>2,961)*12));lanternPaint(P,'plamp');plate(P,['phook'],STEEL);}},
    rchild:{res:2,tex:256,scale:0.62,parts:base('rman'),coats:recoat('rman',(c,i)=>({beard:0,cl:[[150,70,50],[70,110,160],[90,130,70],[180,150,70],[120,80,130]][i%5]})),paint(P,c){AM_KINDS.rman.paint(P,c);}},
    rgirl:{res:2,tex:256,scale:0.6,parts:base('rwoman'),coats:recoat('rwoman',(c,i)=>({cl:[[180,60,80],[90,120,180],[200,170,90],[100,150,110],[160,110,170]][i%5]})),paint(P,c){AM_KINDS.rwoman.paint(P,c);}},
    rshep:{res:2,tex:256,parts:[...base('rfarmer',['hoe','blade']),['crook','armR',[1.5,-10,0.5],[-0.5,-8,-0.5,1,26,1],[0.1,0,0],{nb:1}],['crookH','crook',[0,18,0],[-0.5,0,0,1,1,3],0,{nb:1}],['crookT','crookH',[0,0,3],[-0.5,-3,-0.5,1,3,1],0,{nb:1}]],
      coats:recoat('rfarmer',()=>({})),paint(P,c){AM_KINDS.rfarmer.paint(skip(P,['hoe','blade']),c);P.map('crook',ALL,(s,t)=>sh([126,92,58],hz(s,t>>2,963)*12));P.map('crookH',ALL,()=>[118,86,54]);P.map('crookT',ALL,()=>[118,86,54]);}},
    rsailor:{res:2,tex:256,parts:[...base('rman'),['kcap','head',[0,6,0],[-3.25,0,-3.25,6.5,1.5,6.5],0,{head:1}],['coil','body',[2.75,7,0],[-1.25,-3,-3,2.5,6,6],[0,0,0.2],{nb:1}]],
      coats:recoat('rman',(c,i)=>({cl:[[50,70,120],[150,40,40],[60,90,110]][i%3]})),
      paint(P,c){AM_KINDS.rman.paint(P,c);P.map('tunic',SIDE,(s,t)=>t%4<2?[232,232,228]:null);P.map('armL',SIDE,(s,t,w,h)=>t<h-4&&t%4<2?[232,232,228]:null);
        P.map('kcap',ALL,(s,t)=>sh([150,40,40],(s%2?-10:6)));P.map('coil',ALL,(s,t)=>sh([196,170,120],((s+t)%3===0?-24:6)+hz(s,t,965)*8));}},
    rwarden:{res:2,tex:256,parts:[...base('rman'),['robe','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.2,1.2,0,0]}],['hoodB','head',[0,0,-3.25],[-3.75,-1,-1,7.5,8.5,1]],
        ['hoodT','head',[0,7,0],[-3.75,0,-3.75,7.5,1,7.5],0,{head:1}],['lant','armR',[1.5,-11,1],[-1,-2.5,-1,2,2.5,2],0,{nb:1}]],coats:recoat('rman',()=>({cl:[120,120,124]})),
      paint(P,c){AM_KINDS.rman.paint(P,c);cloth(P,['robe','hoodB','hoodT','armL','body'],[118,118,122]);lanternPaint(P,'lant');}}
  });
  // the knights of the tourney: the realm's knight on a barded horse, his caparison, shield and plume in his own colours
  const JC=[[[176,36,40],[214,176,84]],[[44,70,150],[236,236,240]],[[54,110,60],[214,176,84]],[[214,176,64],[30,30,36]],[[236,236,240],[176,36,40]],[[30,30,40],[204,210,220]]];
  AM_KINDS.rjoust=Object.assign({},AM_KINDS.rknight,{uv:undefined,parts:AM_KINDS.rknight.parts.map(p=>p.slice()),coats:JC.map(([cap,trim],i)=>[Object.assign({},AM_KINDS.rknight.coats[i%AM_KINDS.rknight.coats.length][0],{cap:cap,trim:trim}),1]),
    paint(P,c){AM_KINDS.rknight.paint(P,c);cloth(P,['capar'],c.cap);band(P,'capar',SIDE,18,22,c.trim);P.map('capar',['L','R'],(s,t)=>Math.abs((s%12)-6)<2&&t<16?sh(c.trim,0):null);
      P.map('shield',['L'],(s,t,w,h)=>s===0||s===w-1||t===0?null:Math.abs(s-(w-1)/2)<=1.5||t>=6&&t<=8?sh(c.trim,hz(s,t,967)*6):sh(c.cap,hz(s,t,969)*8));P.map('crest',ALL,(s,t)=>sh(c.trim,hz(s,t,971)*10));}});
  // ---- the charger: a warhorse under a caparison of the realm's black bordered in silver (or red and gold, or blue and white),
  // a saddle and a plume on its head
  const H=AM_KINDS.horse;
  AM_KINDS.charger={parts:[...H.parts.map(p=>p.slice()),['capar','body',[0,0,0],[-6,-4,-11,12,13,22]],['saddle','body',[0,10,-1],[-4,0,-4,8,1,7]],['cantle','saddle',[0,1,-4],[-3,0,0,6,2,1]],['hplume','head',[0,3,0],[0,0,-1,1,4,1],0,{head:1}]],
    scale:1.12,tex:256,coats:[[{coat:[48,44,44],mane:[30,28,28],low:[30,28,28],cap:[24,24,32],trim:[204,210,220],name:'black'},3],[{coat:[178,176,172],mane:[96,94,92],low:[120,118,116],dapple:1,cap:[160,32,36],trim:[214,176,84],name:'grey'},2],
      [{coat:[128,72,42],mane:[34,28,26],low:[34,28,26],cap:[40,64,140],trim:[236,236,240],name:'bay'},2]],
    paint(P,c,f){H.paint(P,c,f);P.coat(['capar'],c.cap,6);for(const fc of ['L','R','F','B'])P.rows('capar',[fc],11,13,c.trim);P.rows('capar',['T'],0,1,c.trim);
      R.sign(P,'capar','L',3,0,c.trim);R.sign(P,'capar','R',3,0,c.trim);P.coat(['saddle','cantle'],[70,46,30],6);P.coat(['hplume'],c.trim,8);}};
  // ---- the ox: broad and heavy, horned, a dewlap at its throat
  AM_KINDS.ox={tex:128,scale:1.05,parts:[['legFL',null,[-3.5,8,7],[-1.5,-8,-1.5,3,8,3]],['legFR',null,[3.5,8,7],[-1.5,-8,-1.5,3,8,3]],['legBL',null,[-3.5,8,-7],[-1.5,-8,-1.5,3,8,3]],['legBR',null,[3.5,8,-7],[-1.5,-8,-1.5,3,8,3]],
      ['body',null,[0,8,0],[-5,0,-10,10,11,20]],['head','body',[0,8,10],[-3,-5,0,6,7,7],[0.2,0,0],{head:1}],['muzzle','head',[0,-5,6],[-2,0,0,4,3,2],0,{head:1}],
      ['hornL','head',[-3,1,3],[-4,0,-1,4,2,2],[0,0,-0.4],{head:1,tp:['-x',0.4,0.4,0,1]}],['hornR','head',[3,1,3],[0,0,-1,4,2,2],[0,0,0.4],{head:1,tp:['x',0.4,0.4,0,1]}],
      ['dewlap','head',[0,-5,1],[-1,-3,0,2,3,4],0,{head:1}],['tail','body',[0,10,-10],[-1,-10,-1,2,10,2],[0.15,0,0]]],
    coats:[[{coat:[122,78,46],low:[90,58,34],horn:[226,214,184],name:'brown'},3],[{coat:[156,74,40],low:[120,54,30],horn:[226,214,184],name:'red'},2],[{coat:[214,200,170],low:[176,160,130],horn:[210,196,166],name:'pale'},2]],
    paint(P,c,f){P.coat(['body','head','dewlap','legFL','legFR','legBL','legBR','tail'],c.coat,8);P.coat(['muzzle'],[196,150,140],6);P.coat(['hornL','hornR'],c.horn,6);P.eyes('head',2,2,[20,16,14]);
      for(const l of ['legFL','legFR','legBL','legBR']){P.rows(l,['L','F','R','B'],5,8,c.low);P.rows(l,['L','F','R','B'],7,8,[40,34,30]);}P.rows('tail',['L','F','R','B'],7,10,c.low);}};
  // ---- a wagon of the king's roads: a team of two oxen yoked to its pole, a bed of planks on four wheels, a hooped cover of
  // canvas, the driver on the box in a hat
  const OX=AM_KINDS.ox.parts,ox=(sd,pre)=>OX.map(p=>{const q=p.slice();q[0]=pre+p[0];if(q[1])q[1]=pre+q[1];q[2]=q[1]?q[2]:[q[2][0]+sd*6,q[2][1],q[2][2]+30];if(q[5]&&q[5].m)q[5]=Object.assign({},q[5],{m:'xL'+q[5].m});else if(sd>0){q[5]=Object.assign({},q[5]||{},{m:'xL'+p[0]});}return q;});
  AM_KINDS.wagon={tex:256,scale:1,parts:[...ox(-1,'xL'),...ox(1,'xR'),['yoke',null,[0,20,40],[-12,-1,-1,24,2,2]],['pole',null,[0,11,12],[-1,-1,0,2,2,28]],
      ['bed',null,[0,10,0],[-7,0,-14,14,4,26]],['cover','bed',[0,4,-1],[-7,0,-11,14,12,22],0,{tp:['y',0.7,1,0,0]}],
      ['whFL',null,[-8,6,7],[-1,-6,-6,2,12,12]],['whFR',null,[8,6,7],[-1,-6,-6,2,12,12],0,{m:'whFL'}],['whBL',null,[-8,6,-9],[-1,-6,-6,2,12,12],0,{m:'whFL'}],['whBR',null,[8,6,-9],[-1,-6,-6,2,12,12],0,{m:'whFL'}],
      ['dbody','bed',[0,4,9],[-3,0,-2,6,9,4]],['dhead','dbody',[0,9,0],[-3,0,-3,6,6,6],0,{head:1}],['dhat','dhead',[0,6,0],[-4,0,-4,8,1,8],0,{head:1}]],
    coats:AM_KINDS.ox.coats.map(([c,w])=>[Object.assign({},c,{cl:[[40,90,60],[120,40,40],[60,70,120]][w%3]}),w]),
    paint(P,c,f){P.coat(['xLbody','xLhead','xLdewlap','xLlegFL','xLlegFR','xLlegBL','xLlegBR','xLtail'],c.coat,8);P.coat(['xLmuzzle'],[196,150,140],6);P.coat(['xLhornL','xLhornR'],c.horn,6);P.eyes('xLhead',2,2,[20,16,14]);
      for(const l of ['xLlegFL','xLlegFR','xLlegBL','xLlegBR'])P.rows(l,['L','F','R','B'],7,8,[40,34,30]);
      P.coat(['yoke','pole'],[110,80,50],10);P.coat(['bed'],[140,100,60],10);P.rows('bed',['L','R','F','B'],0,1,[90,64,40]);P.coat(['cover'],[230,224,204],5);P.rows('cover',['L','R'],3,4,[200,190,170]);P.rows('cover',['L','R'],8,9,[200,190,170]);
      P.coat(['whFL'],[96,70,44],8);P.rect('whFL','L',5,0,2,12,[70,50,32]);P.rect('whFL','L',0,5,12,2,[70,50,32]);P.rect('whFL','R',5,0,2,12,[70,50,32]);P.rect('whFL','R',0,5,12,2,[70,50,32]);
      P.coat(['dbody'],c.cl,10);P.coat(['dhead'],[214,176,140],4);P.eyes('dhead',2,2,[30,24,22]);P.coat(['dhat'],[150,120,70],8);}};
  // ---- a cog of the realm under sail (setting out from a port or coming in, men-life.js): a round hull of tarred planks with
  // castles fore and aft, a mast with a yard and the square sail of the realm, the banner at its head
  AM_KINDS.cog={scale:4,tex:256,parts:[['hull',null,[0,6,0],[-12,-6,-26,24,10,44]],['bow','hull',[0,0,18],[-12,-6,0,24,10,10],0,{tp:['z',0.3,1,0,2]}],['aft','hull',[0,10,-24],[-12,0,-2,24,6,12]],
      ['fore','hull',[0,10,12],[-11,0,-2,22,5,10]],['mast','hull',[0,4,0],[-1,0,-1,2,44,2]],['yard','mast',[0,38,1],[-17,-1,-1,34,2,2]],['sail','yard',[0,-1,1],[-16,-28,-0.5,32,28,1],[0.1,0,0]],['flag','mast',[0,44,0],[0,-6,0,1,6,8]]],
    coats:[[{coat:[46,36,28]},1]],
    paint(P,c,f){P.coat(['hull','bow','aft','fore'],c.coat,6);P.rows('hull',['L','R'],0,1,[120,104,78]);P.rows('aft',['L','R','B'],0,1,[120,104,78]);P.face('hull','T',[150,112,70],8);P.face('aft','T',[150,112,70],8);P.face('fore','T',[150,112,70],8);
      P.coat(['mast','yard'],[118,86,54],8);P.coat(['sail'],[238,236,226],4);R.sign(P,'sail','F',8,6,[30,32,42]);R.sign(P,'sail','B',8,6,[30,32,42]);P.coat(['flag'],[24,24,32],6);}};
})();
