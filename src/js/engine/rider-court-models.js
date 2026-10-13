// ---- The riders' court and the folk of their life (D-090), from their own parts and painters (FOLK_KIT, MODEL_KIT.rider): the
// king of the riders in green and gold under a long green mantle with the white horse on its back, a circlet of gold with its
// tines, his beard grey; the queen in her gown and mantle under the circlet, the cup of welcome in her hand; the doorwardens of
// the golden hall in gilded helms; the king's counsellor in a long dark robe with a staff; the shieldmaidens, armed as the guards
// with their braids under the helm; the lay-singer with his lyre; the horse-healer in a pale hood with a satchel of herbs; the
// horse-dealer in a broad hat with a whip; children (a boy with a hobby horse); the warden of the mounds in grey with a
// lantern; and the riders of the race in their silks. Their beasts: the windsteed, a great horse of the wild herds, silver-white
// with a mane like spray; the steppe cattle, shaggy and long-horned.
(function(){
  const {ALL,SIDE,sh,hz,cloth,plate,leather,band,GOLD}=FOLK_KIT,R=MODEL_KIT.rider,GREEN=R.GREEN;
  const base=(k,drop)=>AM_KINDS[k].parts.filter(p=>!(drop||[]).includes(p[0])).map(p=>p.slice());
  const recoat=(k,o)=>AM_KINDS[k].coats.map(([c,w],i)=>[Object.assign({},c,typeof o==='function'?o(c,i):o),w]);
  // a painter that passes over the parts a model has dropped (as the white realm's court does)
  const skip=(P,names)=>{const set=new Set(names);return new Proxy(P,{get(t,k){const f=t[k];if(typeof f!=='function')return f;
    return (n,...a)=>Array.isArray(n)?f.call(t,n.filter(x=>!set.has(x)),...a):set.has(n)?undefined:f.call(t,n,...a);}});};
  const circlet=()=>[['hcrown','head',[0,4.5,0],[-3.75,0,-3.75,7.5,1.5,7.5],0,{head:1}],['hcrownT','hcrown',[0,1.5,3.75],[-0.5,0,-0.5,1,1.5,1],0,{head:1,nb:1}]];
  const circletPaint=P=>{plate(P,['hcrown'],GOLD);P.map('hcrown',SIDE,(s,t)=>s%4===1?[170,40,40]:t===0?sh(GOLD,-24):null);plate(P,['hcrownT'],GOLD);};
  const mantle=len=>['cape','body',[0,10.5,-2.4],[-4.5,-len,-0.5,9,len,1],[0.06,0,0],{nb:1}];
  const mantlePaint=(P,len)=>{cloth(P,['cape'],[30,58,34],{off:2});R.woven(P,'cape',SIDE,len*2-8,len*2,GOLD,[30,58,34]);R.horseSign(P,'cape','B',1,10,sh(GOLD,10));};
  const SILKS=[[40,110,60],[214,176,84],[236,234,224],[160,40,40],[50,70,150],[30,30,34]];
  const rdrop=[...R.helmParts(),...R.shieldParts([-3.5,-5,0]),...R.spear(40,0.75)].map(p=>p[0]);
  Object.assign(AM_KINDS,{
    hking:{res:2,tex:256,scale:1.06,parts:[...base('hthane').map(p=>p[0]==='cape'?mantle(22):p),...circlet()],
      coats:recoat('hthane',(c,i)=>({hair:[[196,190,180],[214,206,186],[168,160,150]][i%3],beard:1})),
      paint(P,c){AM_KINDS.hthane.paint(P,c);mantlePaint(P,22);circletPaint(P);}},
    hqueen:{res:2,tex:256,scale:1.03,parts:[...base('hwoman'),mantle(22),...circlet(),['cup','armR',[1.5,-10.5,1],[-1,-1.5,-1,2,3,2],0,{nb:1}]],
      coats:recoat('hwoman',(c,i)=>({cl:[[60,98,64],[226,220,200],[120,40,40]][i%3],emb:GOLD})),
      paint(P,c){AM_KINDS.hwoman.paint(P,c);mantlePaint(P,22);circletPaint(P);plate(P,['cup'],GOLD);P.map('cup',['T'],()=>[150,96,40]);}},
    hdoor:{res:2,tex:256,scale:1.04,parts:base('hspear'),coats:recoat('hspear',()=>({beard:1})),
      paint(P,c){AM_KINDS.hspear.paint(P,c);plate(P,['helm','brim'],GOLD);P.map('helm',SIDE,(s)=>s%4===0?sh(GOLD,-24):null);}},
    hcouns:{res:2,tex:256,parts:[...base('hman'),['robe','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.2,1.2,0,0]}],['staff','armR',[1.5,-10,0.5],[-0.5,-8,-0.5,1,27,1],[0.15,0,0],{nb:1}]],
      coats:recoat('hman',(c,i)=>({hair:[[196,190,180],[170,164,156]][i%2],beard:1,cl:[[44,52,74],[64,44,60],[52,60,50]][i%3],emb:GOLD})),
      paint(P,c){AM_KINDS.hman.paint(P,c);cloth(P,['robe'],c.cl);R.woven(P,'robe',SIDE,20,27,GOLD,c.cl);P.map('staff',ALL,(s,t)=>t>=48?sh(GOLD,0):sh([110,80,52],hz(s,t>>2,1051)*14));}},
    hmaid:{res:2,tex:256,parts:[...base('hspear'),['braidL','head',[-2.5,1,1.5],[-1,-9,-0.5,2,9,1.5],[0,0,0.05],{head:1,nb:1}],['braidR','head',[2.5,1,1.5],[-1,-9,-0.5,2,9,1.5],[0,0,-0.05],{head:1,nb:1,m:'braidL'}]],
      coats:recoat('hspear',(c,i)=>({beard:0,hair:[[226,196,120],[200,160,96],[232,214,164]][i%3]})),
      paint(P,c){AM_KINDS.hspear.paint(P,c);P.map('braidL',ALL,(s,t,w,h)=>t>=h-2?sh(GOLD,-10):sh(c.hair,((t+s)%3===0?-20:6)+hz(s,t,1053)*8));}},
    hscop:{res:2,tex:256,parts:[...base('hman'),['lyre','armL',[1,-8,2],[-2,-3,0,4,7,1],[0.6,0,0.2],{nb:1}]],
      coats:recoat('hman',(c,i)=>({cl:[[120,40,40],[60,40,90],[40,90,60]][i%3],emb:GOLD})),
      paint(P,c){AM_KINDS.hman.paint(P,c);P.map('lyre',ALL,(s,t,w,h)=>s<=1||s>=w-2||t>=h-2?sh([130,90,50],hz(s,t,1055)*10):t<=1?sh([110,74,40],0):s%2===0?[226,206,140]:[0,0,0,1]);}},
    hleech:{res:2,tex:256,parts:[...base('hherd'),['satch','body',[-3.5,2,1],[-1,-3,-1.5,2,3.5,3],0,{nb:1}]],coats:recoat('hherd',()=>({hd:[196,186,150]})),
      paint(P,c){AM_KINDS.hherd.paint(P,c);leather(P,['satch'],[120,84,50]);P.map('satch',['T'],(s,t)=>(s+t)%2?[90,150,80]:[200,190,120]);}},
    hdealer:{res:2,tex:256,parts:[...base('hman'),['hat','head',[0,6,0],[-4,0,-4,8,1,8],0,{head:1}],['hatC','hat',[0,1,0],[-2.5,0,-2.5,5,2,5],0,{head:1}],['whip','armR',[1.5,-10,0.5],[-0.5,-6,-0.5,1,14,1],[0.6,0,0],{nb:1}]],
      coats:recoat('hman',(c,i)=>({cl:[[150,62,44],[70,82,110],[176,150,100]][i%3]})),
      paint(P,c){AM_KINDS.hman.paint(P,c);P.map('hat',ALL,(s,t)=>sh([96,76,52],hz(s,t,1057)*10));P.map('hatC',ALL,(s,t)=>t===0?sh(GOLD,-20):sh([96,76,52],hz(s,t,1059)*10));P.map('whip',ALL,(s,t)=>t>=20?sh([60,44,30],0):sh([120,88,56],hz(s,t,1061)*10));}},
    hchild:{res:2,tex:256,scale:0.62,parts:[...base('hman'),['hobby','armR',[1.5,-9,0.5],[-0.5,-10,-0.5,1,14,1],[0.5,0,0],{nb:1}],['hobbyH','hobby',[0,4,0],[-1,0,-0.5,2,3,4],0,{nb:1}]],
      coats:recoat('hman',(c,i)=>({beard:0,cl:[[150,70,50],[70,110,160],[90,130,70],[180,150,70]][i%4]})),
      paint(P,c){AM_KINDS.hman.paint(P,c);P.map('hobby',ALL,(s,t)=>sh([130,96,60],hz(s,t,1063)*10));P.map('hobbyH',ALL,(s,t,w,h,f)=>f==='F'&&t===1?[30,24,20]:t>=h-1?[60,46,34]:sh([226,222,212],hz(s,t,1065)*8));}},
    hgirl:{res:2,tex:256,scale:0.6,parts:base('hwoman'),coats:recoat('hwoman',(c,i)=>({cl:[[180,60,80],[90,120,180],[200,170,90],[100,150,110]][i%4]})),paint(P,c){AM_KINDS.hwoman.paint(P,c);}},
    hwarden:{res:2,tex:256,parts:[...base('hherd',['staff','crook','crook2']),['lant','armR',[1.5,-10.5,1],[-1,-3,-1,2,3,2],0,{nb:1}]],coats:recoat('hherd',()=>({hd:[110,110,104],beard:1,hair:[196,190,180]})),
      paint(P,c){AM_KINDS.hherd.paint(skip(P,['staff','crook','crook2']),c);P.map('lant',ALL,(s,t,w,h)=>s===0||s===w-1||t===0||t===h-1?sh(GOLD,-30):[255,226,140]);}},
    hracer:{res:2,tex:256,parts:base('hrider',rdrop),coats:recoat('hrider',(c,i)=>({silk:SILKS[i%SILKS.length]})),
      paint(P,c){AM_KINDS.hrider.paint(skip(P,rdrop),c);cloth(P,['coat','cape'],c.silk);band(P,'coat',SIDE,0,3,sh(c.silk,-40));cloth(P,['scloth'],c.silk,{off:1});band(P,'scloth',SIDE,0,2,GOLD);}}
  });
  // ---- the windsteed: the wild horse grown greater, silver-white, its mane and tail like blown spray
  const HS=AM_KINDS.horse;
  AM_KINDS.windsteed={parts:HS.parts.map(p=>p.slice()),scale:1.14,tex:HS.tex,coats:[[{coat:[232,234,238],mane:[250,250,252],low:[206,208,216],name:'silver'},3],[{coat:[214,216,222],mane:[244,244,248],low:[190,192,200],dapple:1,name:'dappled silver'},1]],
    paint(P,c,f){P.coat(['body','neck','head','muzzle','earL','legFL','legFR','legBL','legBR'],c.coat,5);P.coat(['mane','tail'],c.mane,10);P.hair('mane');P.hair('tail');
      if(c.dapple)P.spots('body',['T','L','R','B'],[246,246,250],0.2,0,4);for(const l of ['legFL','legFR','legBL','legBR']){P.rows(l,['L','F','R','B'],8,14,c.low);P.rows(l,['L','F','R','B'],12,14,[70,66,62]);}
      P.rows('muzzle',['F'],2,4,[120,110,110]);P.px('muzzle','F',0,1,[40,34,34]);P.px('muzzle','F',3,1,[40,34,34]);P.eyes('head',2,1,[30,40,60]);}};
  // ---- steppe cattle: the ox's frame, shaggy, with long horns sweeping out and up
  const OX=AM_KINDS.ox;
  AM_KINDS.kine={tex:128,scale:1,parts:OX.parts.map(p=>p[0]==='hornL'?['hornL','head',[-3,1,3],[-6,0,-1,6,2,2],[0,0,-0.5],{head:1,tp:['-x',0.4,0.4,0,1]}]:p[0]==='hornR'?['hornR','head',[3,1,3],[0,0,-1,6,2,2],[0,0,0.5],{head:1,tp:['x',0.4,0.4,0,1]}]:p.slice()),
    coats:[[{coat:[128,82,48],low:[96,60,36],horn:[232,220,190],name:'brown'},3],[{coat:[60,50,44],low:[40,34,30],horn:[226,214,184],name:'black'},2],[{coat:[196,166,112],low:[150,124,84],horn:[230,218,188],name:'dun'},2]],
    paint(P,c,f){P.coat(['body','head','dewlap','legFL','legFR','legBL','legBR','tail'],c.coat,18);P.coat(['muzzle'],[176,140,130],6);P.coat(['hornL','hornR'],c.horn,6);P.eyes('head',2,2,[20,16,14]);
      for(const l of ['legFL','legFR','legBL','legBR']){P.rows(l,['L','F','R','B'],5,8,c.low);P.rows(l,['L','F','R','B'],7,8,[40,34,30]);}P.rows('tail',['L','F','R','B'],7,10,c.low);}};
})();
