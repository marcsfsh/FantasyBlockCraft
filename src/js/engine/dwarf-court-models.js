// ---- The dwarves' court and the folk of their life (D-091), from their own parts and painters (FOLK_KIT, MODEL_KIT.dwarf): the
// queen of the mountain in crimson and gold under a crown, her braids looped and pinned in gold, a sceptre; the anvilguard of
// the throne in gilded plate under crested helms with masks, great double-bladed axes and blue cloaks; the warden of the hold in
// a dark robe with the keys of the hold at his belt and his staff; the loremaster, white-bearded, hooded in grey-blue with the
// great book under his arm; the runesmith, his apron marked with runes that glow, a blue hood, a rune-stone in his hand; the
// brewer in shirt-sleeves under his apron with a tankard; the merchant in a furred coat and a broad hat with his purse; the
// gemcutter with his lens; the mushroom-farmer with a basket of mushrooms on his back; the children of the hold (a boy with a toy
// hammer, a girl with her braids looped like her mother's); the ram-riders of the mountain, axeguards astride great rams in
// the mountain's saddle-cloth; the prospector under a broad hat with his pack and his pick; the deepwarden in a dark hooded cloak
// with a lantern on a pole; and the engineer with a coil of rope and a measuring rod. Their beasts: the great ram of the
// mountain (wild, or saddled when it is someone's), the shaggy pony of the caravans with its packs, and the raven.
(function(){
  const {ALL,SIDE,sh,hz,cloth,mail,plate,leather,band,rivets,boots,hands,STEEL,GOLD}=FOLK_KIT,D=MODEL_KIT.dwarf,{coats,dwarf,dface,kit,kitPaint,helm,helmPaint,axe,axePaint,shield,shieldPaint,sign,BRZ,BLUE,CRIM,DIRON}=D;
  const base=(k,drop)=>AM_KINDS[k].parts.filter(p=>!(drop||[]).includes(p[0])).map(p=>p.slice());
  const recoat=(k,o)=>AM_KINDS[k].coats.map(([c,w],i)=>[Object.assign({},c,typeof o==='function'?o(c,i):o),w]);
  // a painter that passes over the parts a model has dropped (as the riders' court does)
  const skip=(P,names)=>{const set=new Set(names);return new Proxy(P,{get(t,k){const f=t[k];if(typeof f!=='function')return f;
    return (n,...a)=>Array.isArray(n)?f.call(t,n.filter(x=>!set.has(x)),...a):set.has(n)?undefined:f.call(t,n,...a);}});};
  const crown=()=>[['crown','head',[0,6.5,0],[-3.75,0,-3.75,7.5,1.5,7.5],0,{head:1}],['cpt','crown',[0,1.5,0],[-3.75,0,-3.75,7.5,1.5,7.5],0,{head:1,nb:1}]];
  const crownPaint=P=>{plate(P,['crown'],GOLD);P.map('cpt',ALL,(s,t,w,h,f)=>f==='T'||f==='D'?null:s%3===1?sh(GOLD,t===h-1?20:4):null);P.map('crown',['F'],s=>s===6||s===7?[200,40,60]:null);};
  const braid=(P,c,n)=>P.map(n,ALL,(s,t)=>t===1?sh(GOLD,10):sh(c.hair,((t+s)%3===0?-16:6)+hz(s,t,801)*8));
  const kids=coats(1).map(([c,w])=>[Object.assign({},c),w]);
  // the rider's seat on a ram: the dwarf's body on the ram's back, thighs over its flanks (legs and toes dropped)
  const seat=()=>dwarf().filter(p=>!['legL','legR','toeL','toeR'].includes(p[0])).map(p=>p[0]==='body'?['body','hbody',[0,11.5,-1],[-5,0,-3,10,10,6]]:p.slice());
  const RAMC=[{coat:[214,206,188],shade:[170,160,140],horn:[150,132,100]},{coat:[120,104,84],shade:[84,72,58],horn:[176,160,126]},{coat:[70,64,60],shade:[46,42,40],horn:[188,174,140]}];
  // the ram's frame for a rider (riderPose moves its legs, hbody and neck)
  const ramParts=()=>[['legFL',null,[-2.5,9,5],[-1.5,-9,-1.5,3,9,3]],['legFR',null,[2.5,9,5],[-1.5,-9,-1.5,3,9,3],0,{m:'legFL'}],['legBL',null,[-2.5,9,-5],[-1.5,-9,-1.5,3,9,3]],['legBR',null,[2.5,9,-5],[-1.5,-9,-1.5,3,9,3],0,{m:'legBL'}],
    ['hbody',null,[0,9,0],[-4.5,0,-8,9,9,16]],['neck','hbody',[0,6,7],[-2,-2,-2,4,7,4],[0.5,0,0]],['hhead','neck',[0,6,0],[-2.25,-2,-2,4.5,4.5,6],[0.35,0,0]],
    ['rhL','hhead',[-2,2,0],[-3,-1,-1,3,2,2.5],[0,0,0.2],{nb:1}],['rcL','rhL',[-3,0,0.5],[-1.5,-4,-1,2,4,2.5],[0.5,0,0],{nb:1}],
    ['rhR','hhead',[2,2,0],[0,-1,-1,3,2,2.5],[0,0,-0.2],{nb:1,m:'rhL'}],['rcR','rhR',[3,0,0.5],[-0.5,-4,-1,2,4,2.5],[0.5,0,0],{nb:1,m:'rcL'}],
    ['tail','hbody',[0,6,-8],[-1,-2,-1,2,3,1],[-0.3,0,0]],['scloth','hbody',[0,0,0],[-5,3,-5,10,6.5,9]],['saddle','hbody',[0,9,-1],[-3.5,0,-3,7,1,6]]];
  const ramPaint=(P,r)=>{P.map('hbody',ALL,(s,t,w,h,f)=>sh(r.coat,hz(s>>1,t>>1,805)*16-(f==='D'?20:0)+((s+t)%3===0?-8:0)));for(const n of ['neck','hhead','tail'])P.map(n,ALL,(s,t)=>sh(r.coat,hz(s,t,807)*14));
    for(const n of ['legFL','legBL'])P.map(n,ALL,(s,t,w,h)=>t>h-4?[44,38,34]:sh(r.shade,hz(s,t,809)*10));P.map('hhead',['F'],(s,t)=>(t===5||t===6)&&(s===1||s===7)?[20,16,14]:t<3?sh(r.shade,0):null);
    for(const n of ['rhL','rcL'])P.map(n,ALL,(s,t)=>sh(r.horn,(t%2?-16:8)+hz(s,t,811)*8));
    cloth(P,['scloth'],BLUE);band(P,'scloth',SIDE,0,2,GOLD);sign(P,'scloth','L',2,0);sign(P,'scloth','R',2,0);leather(P,['saddle'],[96,62,36]);};
  Object.assign(AM_KINDS,{
    // the queen of the mountain
    dqueen:{res:2,tex:256,scale:0.97,parts:[...base('dlady',['bun']),['mantle','body',[0,9,0],[-6,-3,-3.75,12,3.5,7.5]],['cape','body',[0,10,-3.2],[-5,-16,-0.5,10,16,1],[0.05,0,0],{nb:1}],...crown(),
        ['staff','armR',[1.75,-8.5,0.5],[-0.5,-6,-0.5,1,17,1],[0.05,0,0],{nb:1}],['knob','staff',[0,11,0],[-1,0,-1,2,2,2],0,{nb:1}]],
      coats:recoat('dlady',(c,i)=>({cl:CRIM,hair:[[150,146,140],[164,98,48],[72,46,28],[212,208,202]][i%4]})),
      paint(P,c){AM_KINDS.dlady.paint(skip(P,['bun']),c);band(P,'dress',SIDE,4,7,GOLD);cloth(P,['mantle'],[226,220,206]);P.map('mantle',ALL,(s,t)=>(s*3+t*5)%7===0?[40,36,34]:null);
        cloth(P,['cape'],CRIM,{off:2});band(P,'cape',SIDE,28,32,GOLD);sign(P,'cape','B',2,8);crownPaint(P);P.map('staff',ALL,(s,t)=>t%6===0?sh(GOLD,0):sh(DIRON,hz(s,t>>2,813)*10));plate(P,['knob'],GOLD);}},
    // the anvilguard: the hammerer's plate gilded, a crest on the helm, a blue cloak, a great double-bladed axe
    danvil:{res:2,tex:256,scale:1,parts:[...base('dhammer',['maul']),['crest','head',[0,8,0],[-0.5,0,-3,1,2.5,6],0,{head:1,nb:1}],['cape','body',[0,10,-3.2],[-5,-15,-0.5,10,15,1],[0.06,0,0],{nb:1}],
        ['gaxe','haft',[0,0,11],[-0.5,-4.5,-0.5,1,9,4.5],0,{nb:1}]],coats:coats(3),
      paint(P,c){AM_KINDS.dhammer.paint(skip(P,['maul']),c);band(P,'cuir',SIDE,0,3,GOLD);band(P,'skirt',SIDE,0,2,GOLD);P.map('helm',SIDE,(s,t,w)=>s===(w>>1)||t===0?sh(GOLD,10):null);
        band(P,'pL',SIDE,0,3,GOLD);plate(P,['crest'],GOLD);cloth(P,['cape'],BLUE,{off:2});band(P,'cape',SIDE,26,30,GOLD);sign(P,'cape','B',2,6);
        P.map('gaxe',ALL,(s,t,w,h,f)=>f==='L'||f==='R'?(s===w-1||s===0?sh([226,230,236],24):sh(STEEL,hz(s,t,815)*10+(t===h>>1?-20:0))):sh(GOLD,0));}},
    // the warden of the hold: a dark robe, the keys at his belt, his staff of office
    dhward:{res:2,tex:256,scale:0.98,parts:[...base('dlord'),['keys','body',[-4.8,1,1],[-0.5,-3,-1.5,1,3,3],0,{nb:1}],['staff','armR',[1.75,-8.5,0.5],[-0.5,-6,-0.5,1,18,1],[0.05,0,0],{nb:1}],['knob','staff',[0,12,0],[-1,0,-1,2,2,2],0,{nb:1}]],
      coats:recoat('dlord',()=>({cl:[44,48,62]})),
      paint(P,c){AM_KINDS.dlord.paint(P,c);P.map('keys',ALL,(s,t)=>(s+t)%2?sh(DIRON,16):sh(BRZ,0));P.map('staff',ALL,(s,t)=>t%8===0?sh(BRZ,10):sh([70,52,36],hz(s,t>>2,817)*10));plate(P,['knob'],BRZ);}},
    // the loremaster: hooded, white-bearded, the great book under his arm
    dlore:{res:2,tex:256,scale:0.96,parts:[...base('dlord',['circ','chain']),['hood','head',[0,0,-0.5],[-3.75,0,-3.75,7.5,7.75,5.5],0,{head:1}],['book','armL',[-1.5,-6,1.5],[-1.25,-3,-2.5,2.5,6,5],0,{nb:1}]],
      coats:recoat('dlord',(c,i)=>({cl:[62,78,104],hair:[[212,208,202],[176,172,166],[150,146,140]][i%3]})),
      paint(P,c){AM_KINDS.dlord.paint(skip(P,['circ','chain']),c);cloth(P,['hood'],[62,78,104]);P.map('hood',['F'],(s,t,w)=>s>=1&&s<w-1&&t<12?null:sh([62,78,104],-10));
        P.map('book',ALL,(s,t,w,h,f)=>f==='F'||f==='B'||f==='T'||f==='D'?sh([226,214,180],(t%2?-10:0)):sh([110,40,36],(s===1||s===w-2?20:0)+hz(s,t,819)*8));}},
    // the runesmith: the smith's apron marked with runes glowing blue, a blue hood, a rune-stone in his left hand
    drune:{res:2,tex:256,scale:0.96,parts:[...base('dsmith'),['hood','head',[0,0,-0.5],[-3.75,0,-3.75,7.5,7.75,5.5],0,{head:1}],['stone','armL',[-1.75,-9,1],[-1.25,-2,-1.25,2.5,3,2.5],0,{nb:1}]],coats:coats(2),
      paint(P,c){AM_KINDS.dsmith.paint(P,c);cloth(P,['hood'],[40,56,112]);P.map('apron',['F'],(s,t)=>(t%7===2&&s%5<3)||(s%5===1&&t%7<4&&t%7>0)?[120,200,255]:null);
        P.map('stone',ALL,(s,t,w,h,f)=>f==='F'&&(s===2||t===2)?[150,226,255]:sh([128,126,124],hz(s,t,821)*14));}},
    // the brewer: linen sleeves under the apron, a tankard in his right hand
    dbrew:{res:2,tex:256,scale:0.97,parts:[...base('dsmith',['haft','hmr']),['mug','armR',[1.75,-9.5,1],[-1.25,-1,-1.25,2.5,3,2.5],0,{nb:1}]],coats:coats(4),
      paint(P,c){AM_KINDS.dsmith.paint(skip(P,['haft','hmr']),c);cloth(P,['armL','body'],[200,186,156]);P.map('armL',ALL,(s,t,w,h)=>t>h-4?sh(c.skin,0):null);
        leather(P,['apron'],[120,84,50]);P.map('mug',ALL,(s,t,w,h,f)=>f==='T'?[240,234,214]:t%3===0?sh(BRZ,14):sh([150,100,56],hz(s,t,823)*10));}},
    // the merchant: a furred coat, a broad hat, his purse at his belt
    dmerch:{res:2,tex:256,scale:0.96,parts:[...base('dlord',['circ','chain']),['hat','head',[0,6.5,0],[-3.5,0,-3.5,7,2,7],0,{head:1}],['brim','head',[0,6.5,0],[-4.75,-0.5,-4.75,9.5,1,9.5],0,{head:1}],
        ['purse','body',[4.8,1,1.5],[-0.5,-3,-1.5,1.5,3,3],0,{nb:1}]],coats:recoat('dlord',(c,i)=>({cl:[[46,92,60],[120,70,40],[80,60,110]][i%3]})),
      paint(P,c){AM_KINDS.dlord.paint(skip(P,['circ','chain']),c);cloth(P,['hat','brim'],[60,44,30]);band(P,'hat',SIDE,0,1,GOLD);P.map('purse',ALL,(s,t)=>t===0?sh(GOLD,0):sh([140,96,52],hz(s,t,825)*10));}},
    // the gemcutter: the miner's tunic and apron, a lens before one eye
    dgem:{res:2,tex:256,scale:0.94,parts:[...base('dminer',['lamp','haft','pick']),['loupe','head',[1.5,3.5,3],[-1,-1,0,2,2,1.5],0,{head:1,nb:1}]],coats:coats(5),
      paint(P,c){AM_KINDS.dminer.paint(skip(P,['lamp','haft','pick']),c);P.map('loupe',ALL,(s,t,w,h,f)=>f==='F'&&s>0&&s<w-1&&t>0&&t<h-1?[170,220,240]:sh(BRZ,10));}},
    // the mushroom-farmer: a hood, a basket of mushrooms on his back
    dfarm:{res:2,tex:256,scale:0.94,parts:[...base('dminer',['lamp','haft','pick','cap']),['hood','head',[0,0,-0.5],[-3.75,0,-3.75,7.5,7.75,5.5],0,{head:1}],
        ['basket','body',[0,5,-4],[-3,-3,-2.5,6,6,3]],['shrooms','basket',[0,3,0],[-2.5,0,-1.25,5,1.5,2.5],0,{nb:1}]],coats:coats(0),
      paint(P,c){AM_KINDS.dminer.paint(skip(P,['lamp','haft','pick','cap']),c);cloth(P,['hood'],[96,76,56]);P.map('basket',ALL,(s,t)=>(s+t)%2?sh([170,130,80],4):sh([130,96,56],0));
        P.map('shrooms',ALL,(s,t)=>(s>>1)%2?[206,70,56]:[214,190,150]);}},
    // the children of the hold: a boy with a toy hammer, a girl with looped braids (no beards yet)
    dchild:{res:2,tex:256,scale:0.66,parts:[...dwarf({nobeard:1}),['tunic','body',[0,0,0],[-5.25,-4,-3.25,10.5,14,6.5]],['haft','armR',[1.75,-8.5,0.5],[-0.5,-0.5,-1,1,1,5]],['hmr','haft',[0,0,3.5],[-1,-1,0,2,2,2.5],0,{nb:1}]],
      coats:kids.map(([c,w],i)=>[Object.assign({},c,{cl:[[60,90,140],[140,60,50],[70,110,70]][i%3]}),w]),
      paint(P,c){dface(P,c);cloth(P,['armL','body','tunic'],c.cl);band(P,'tunic',SIDE,0,2,sh(c.cl,-40));hands(P,c);boots(P,[80,60,40],7);P.map('legL',ALL,(s,t)=>t<7?sh([90,80,70],0):null);
        P.map('haft',ALL,(s,t)=>sh([140,104,60],hz(s,t,827)*8));P.map('hmr',ALL,(s,t)=>sh([110,80,50],hz(s,t,829)*8));}},
    dgirl:{res:2,tex:256,scale:0.64,parts:[...dwarf({nobeard:1}),['dress','body',[0,1,0],[-5.25,-8,-3.25,10.5,9,6.5],0,{tp:['-y',1.15,1.12,0,0]}],
        ['loopL','head',[-3.25,2.5,0],[-1,-2,-1.5,1.5,4,3],0,{head:1,nb:1}],['loopR','head',[3.25,2.5,0],[-0.5,-2,-1.5,1.5,4,3],0,{head:1,nb:1,m:'loopL'}]],
      coats:kids.map(([c,w],i)=>[Object.assign({},c,{cl:[[150,60,70],[60,110,150],[170,130,60]][i%3]}),w]),
      paint(P,c){dface(P,c);cloth(P,['armL','body','dress'],c.cl);band(P,'dress',SIDE,10,12,[236,232,220]);hands(P,c);boots(P,[90,60,40],9);braid(P,c,'loopL');}},
    // the ram-rider: an axeguard on a great ram in the mountain's saddle-cloth
    dramr:{res:2,tex:256,parts:[...ramParts(),...seat(),['thL','body',[-2.5,0.5,0],[-2.25,-7,-2.25,4.5,7,4.5],[-0.6,0,-0.45]],['thR','body',[2.5,0.5,0],[-2.25,-7,-2.25,4.5,7,4.5],[-0.6,0,0.45],{m:'thL'}],
        ...kit(),...helm(),...axe(12),shield],coats:coats(0).map(([c,w],i)=>[Object.assign({},c,{r:RAMC[i%3]}),w]),
      paint(P,c){const Q=skip(P,['legL','legR','toeL','toeR']);kitPaint(Q,c);helmPaint(P);axePaint(P);shieldPaint(P);mail(P,['thL']);P.map('thL',ALL,(s,t,w,h)=>t>h-6?sh([70,50,34],hz(s,t,831)*8):null);ramPaint(P,c.r);}},
    // the prospector: a broad hat in place of the cap, a pack with a blanket rolled on it, the pick
    dprosp:{res:2,tex:256,scale:0.95,parts:[...base('dminer',['cap','lamp']),['hat','head',[0,5,0],[-3.5,0,-3.5,7,2.5,7],0,{head:1}],['brim','head',[0,5,0],[-5,-0.5,-5,10,1,10],0,{head:1}],
        ['pack','body',[0,4,-4],[-4,-4,-2,8,8,3]],['roll','pack',[0,4.5,-1],[-4.5,0,-1.5,9,2.5,2.5],0,{nb:1}]],coats:coats(1),
      paint(P,c){AM_KINDS.dminer.paint(skip(P,['cap','lamp']),c);cloth(P,['tunic','body','armL'],[120,108,84]);leather(P,['hat','brim'],[110,84,54]);leather(P,['pack'],[100,72,44]);P.map('roll',ALL,(s,t)=>(s>>2)%2?[150,60,50]:[190,170,130]);}},
    // the deepwarden: the axeguard's kit under a dark hooded cloak, a lantern on a pole
    ddeep:{res:2,tex:256,scale:0.96,parts:[...base('daxe',['shield']),['cape','body',[0,10,-3.2],[-5,-15,-0.5,10,15,1],[0.06,0,0],{nb:1}],['cowl','head',[0,1,-1],[-4,0,-3.5,8,6.5,4],0,{head:1}],
        ['pole','armL',[-1.75,-8.5,0.5],[-0.5,-0.5,-1,1,1,11]],['lant','pole',[0,-0.5,10],[-1.25,-3.5,-1.25,2.5,3,2.5],0,{nb:1}]],coats:coats(2),
      paint(P,c){AM_KINDS.daxe.paint(skip(P,['shield']),c);cloth(P,['cape','cowl'],[52,54,62],{off:2});P.map('pole',ALL,(s,t)=>sh([80,60,40],hz(s,t>>2,833)*8));
        P.map('lant',ALL,(s,t,w,h)=>s===0||s===w-1||t===0||t===h-1?sh(BRZ,-10):[255,214,120]);}},
    // the engineer: the smith's apron and a leather cap, a coil of rope over the shoulder, a mallet, a measuring rod
    dengin:{res:2,tex:256,scale:0.96,parts:[...base('dsmith'),['cap','head',[0,5,0],[-3.5,0,-3.5,7,2.5,7],0,{head:1,tp:['y',0.8,0.8,0,0]}],['coil','body',[-2,8,0],[-3,-6,-3.5,6,7,7],[0,0,0.6],{nb:1}],
        ['rod','armL',[-1.75,-8.5,0.5],[-0.5,-10,-0.5,1,14,1],0,{nb:1}]],coats:coats(3),
      paint(P,c){AM_KINDS.dsmith.paint(P,c);cloth(P,['body','armL'],[96,84,70]);P.map('armL',ALL,(s,t,w,h)=>t>h-4?sh(c.skin,0):null);leather(P,['cap'],[100,72,46]);
        P.map('coil',ALL,(s,t)=>(t+s)%3===0?[150,130,90]:[196,176,128]);P.map('rod',ALL,(s,t)=>(t>>1)%2?[226,214,180]:[60,44,30]);}}
  });
  // ---- the great ram of the mountain: thick-legged and shaggy, its horns curled about its ears; saddled when it is someone's
  AM_KINDS.ram={parts:[['legFL',null,[-2.5,9,5],[-1.5,-9,-1.5,3,9,3]],['legFR',null,[2.5,9,5],[-1.5,-9,-1.5,3,9,3],0,{m:'legFL'}],['legBL',null,[-2.5,9,-5],[-1.5,-9,-1.5,3,9,3],0,{m:'legFL'}],['legBR',null,[2.5,9,-5],[-1.5,-9,-1.5,3,9,3],0,{m:'legFL'}],
      ['body',null,[0,9,0],[-4.5,0,-8,9,9,16]],['ruff','body',[0,4,6],[-5,-1,-2.5,10,6,4]],['neck','body',[0,6,7],[-2,-2,-2,4,7,4],[0.5,0,0]],
      ['head','neck',[0,6,0],[-2,-2,-2,4,5,6],[0.35,0,0],{head:1}],['beard','head',[0,-2,3.5],[-1,-3,-0.5,2,3,1],0,{head:1}],
      ['hornL','head',[-2,2,0],[-3,-1,-1,3,2,3],[0,0,0.2],{head:1}],['tipL','hornL',[-3,0,0.5],[-1,-4,-1,2,4,3],[0.5,0,0],{head:1}],
      ['hornR','head',[2,2,0],[0,-1,-1,3,2,3],[0,0,-0.2],{m:'hornL',head:1}],['tipR','hornR',[3,0,0.5],[-1,-4,-1,2,4,3],[0.5,0,0],{m:'tipL',head:1}],
      ['earL','head',[-2,1,1.5],[-2,-0.5,-0.5,2,1,1],[0,0,0.3],{head:1}],['earR','head',[2,1,1.5],[0,-0.5,-0.5,2,1,1],[0,0,-0.3],{m:'earL',head:1}],
      ['tail','body',[0,6,-8],[-1,-2,-1,2,3,1],[-0.3,0,0]],['scloth','body',[0,0,0],[-5,3,-5,10,6,9],0,{dyn:'pack'}],['saddle','body',[0,9,-1],[-3.5,0,-3,7,1,6],0,{dyn:'pack'}]],
    scale:1.3,tex:128,coats:RAMC.map((c,i)=>[c,[3,2,1][i]]),
    paint(P,c){P.coat(['body','neck','ruff','earL','tail','beard'],c.coat,16);P.fringe('body',c.shade);P.fringe('ruff',c.shade);P.coat(['head'],c.coat,10);P.rows('head',['F'],0,3,c.shade);
      P.coat(['legFL'],c.shade,10);P.rows('legFL',['L','F','R','B'],7,9,[44,38,34]);P.coat(['hornL','tipL'],c.horn,12);P.eyes('head',1,1,[30,24,16],[200,170,80]);
      P.coat(['scloth'],BLUE,6);P.rows('scloth',['L','F','R','B'],11,13,GOLD);P.coat(['saddle'],[96,62,36],8);}};
  // ---- the pony of the caravans: the mule's frame a little smaller, shaggy, its packs always on
  const MU=AM_KINDS.mule;
  AM_KINDS.pony={parts:MU.parts.map(p=>{const q=p.slice();if(q[5]&&q[5].dyn){q[5]=Object.assign({},q[5]);delete q[5].dyn;}if(q[0]==='earL'||q[0]==='earR')q[3]=[q[3][0],0,-0.5,q[3][3],3,1];return q;}),scale:0.9,tex:MU.tex,
    coats:[[{coat:[120,92,64],pale:[200,180,150],mane:[56,44,36]},3],[{coat:[86,80,76],pale:[180,174,166],mane:[40,36,34]},2],[{coat:[170,140,100],pale:[226,210,180],mane:[90,70,50]},2]],
    paint(P,c,f){MU.paint(P,c,f);P.fringe('body',c.mane);P.coat(['bagL','roll'],[60,74,120],10);P.rows('bagL',['L','F','R','B'],1,2,[214,176,84]);}};
  // ---- the raven: black, a heavy beak, its wings folded
  AM_KINDS.raven={parts:[['legL',null,[-0.75,2,0.5],[-0.5,-2,-0.5,1,2,1]],['legR',null,[0.75,2,0.5],[-0.5,-2,-0.5,1,2,1],0,{m:'legL'}],
      ['body',null,[0,2,0],[-1.5,0,-2.5,3,3,5],[-0.25,0,0]],['head','body',[0,2.5,2.5],[-1,0,-0.5,2,2,2],0,{head:1}],['beak','head',[0,0.75,1.5],[-0.5,-0.5,0,1,1,2],0,{head:1}],
      ['wingL','body',[-1.5,2.75,0],[-1,-2,-2,1,2,4]],['wingR','body',[1.5,2.75,0],[0,-2,-2,1,2,4],0,{m:'wingL'}],['tail','body',[0,2,-2.5],[-1,-0.5,-3,2,1,3],[-0.3,0,0]]],
    scale:1,tex:64,coats:[[{c:[30,30,36]},3],[{c:[40,38,46]},1]],
    paint(P,c){P.coat(['body','head','wingL','tail'],c.c,8);P.coat(['beak','legL'],[34,32,30],4);P.eyes('head',0,0,[10,10,10]);}};
})();
