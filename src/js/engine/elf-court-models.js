// ---- The elves' court, their merchants and mariners (D-088), with the high elves' and the wood's parts and painters
// (MODEL_KIT.elf, MODEL_KIT.wood): the king of an elder realm in a lord's robes under a long mantle of deep blue bordered in white,
// the star on its back, a crown of gold with a pale stone, a sceptre bearing a star; the queen in a gown under a mantle and
// crown; the herald in a tabard of blue with the star over his robe, a horn at his hip; the merchant with a pack and a scroll;
// the mariner in a sea-grey cloak with a coil of rope on his shoulder; the wood's merchant in a tunic with a pack and a basket.
(function(){
  const {ALL,SIDE,sh,hz,cloth,plate,leather,band}=FOLK_KIT,E=MODEL_KIT.elf,WD=MODEL_KIT.wood,{GOLD,BLUE,WHITE,sign}=E;
  const base=k=>AM_KINDS[k].parts.map(p=>p.slice());
  const recoat=(k,o)=>AM_KINDS[k].coats.map(([c,w],i)=>[Object.assign({},c,typeof o==='function'?o(c,i):o),w]);
  const crown=()=>[['crown','head',[0,5,0],[-3.75,0,-3.75,7.5,2,7.5],0,{head:1}],['crownP','crown',[0,2,3.75],[-0.5,0,-0.5,1,2,1],0,{head:1,nb:1,tp:['y',1,0,0,0]}]];
  const crownPaint=P=>{plate(P,['crown'],GOLD);P.map('crown',SIDE,(s,t)=>t===2&&s%3===1?[150,220,240]:t===0?sh(GOLD,-24):null);P.map('crownP',ALL,()=>[226,236,246,200]);};
  const mantle=(len)=>[['mantle','body',[0,10.5,-2.9],[-5,-len,-0.5,10,len,1],[0.06,0,0],{nb:1,tp:['-y',1.25,1,0,0]}]];
  const mantlePaint=(P,col)=>{cloth(P,['mantle'],col,{off:2});P.map('mantle',ALL,(s,t,w,h)=>s<2||s>=w-2||t>=h-2?((s*7+t*3)%9===0?[30,30,34]:[238,238,242]):null);sign(P,'mantle','B',2,10,WHITE,GOLD);};
  Object.assign(AM_KINDS,{
    eking:{res:2,tex:256,scale:1.12,parts:[...base('elord'),...crown(),...mantle(22),['scep','armR',[1.5,-10,0.5],[-0.5,-4,-0.5,1,17,1],[0.12,0,0],{nb:1}],['scepS','scep',[0,13,0],[-1,0,-1,2,2,2],0,{nb:1}]],
      coats:recoat('elord',()=>({cl:[236,236,240],cl2:[30,48,96]})),
      paint(P,c){AM_KINDS.elord.paint(P,c);crownPaint(P);mantlePaint(P,BLUE);P.map('scep',ALL,(s,t)=>t%5===0?sh(GOLD,20):sh(GOLD,-10));P.map('scepS',ALL,()=>[230,242,255,200]);}},
    equeen:{res:2,tex:256,scale:1.1,parts:[...base('elady'),...crown(),...mantle(23)],coats:recoat('elady',(c,i)=>({cl:[[236,238,242],[200,214,236],[226,226,214],[214,200,226]][i%4]})),
      paint(P,c){AM_KINDS.elady.paint(P,c);crownPaint(P);mantlePaint(P,BLUE);}},
    eherald:{res:2,tex:256,scale:1.08,parts:[...base('elord'),['tabard','body',[0,0,0],[-4.9,-8,-2.9,9.8,18,5.8]],['horn','body',[4.6,2,0],[-0.5,-1,-2,1,2,4],0,{nb:1,tp:['z',1,0.5,0,0]}]],
      coats:recoat('elord',()=>({cl:[30,48,96],cl2:[236,236,240]})),
      paint(P,c){AM_KINDS.elord.paint(P,c);cloth(P,['tabard'],BLUE);P.map('tabard',['L','R'],(s,t)=>sh(GOLD,-10));sign(P,'tabard','F',-3,3,WHITE,GOLD);sign(P,'tabard','B',-3,3,WHITE,GOLD);
        P.map('tabard',['F','B'],(s,t,w,h)=>t>=h-1?sh(GOLD,0):null);plate(P,['horn'],[230,214,170]);band(P,'horn',SIDE,0,1,GOLD);}},
    emerch:{res:2,tex:256,scale:1.06,parts:[...base('elord').filter(p=>p[0]!=='circ'),['pack','body',[0,3,-3.2],[-3.5,-1,-2.5,7,9,3],0,{nb:1}],['roll','pack',[0,8,0],[-4,0,-1,8,2,2],0,{nb:1}],
        ['scroll','armR',[1.5,-10,1.5],[-0.75,-0.75,-2.5,1.5,1.5,5],[0.3,0,0],{nb:1}]],
      coats:recoat('elord',(c,i)=>({cl:[[120,84,50],[70,96,70],[96,70,90],[60,80,110]][i%4],cl2:[200,190,160]})),
      paint(P,c){AM_KINDS.elord.paint(P,c);leather(P,['pack'],[110,76,46]);band(P,'pack',SIDE,6,7,GOLD);cloth(P,['roll'],[160,40,50]);P.map('scroll',ALL,(s,t,w,h,f)=>f==='T'||f==='D'?[180,150,90]:[236,228,206]);}},
    emariner:{res:2,tex:256,scale:1.08,parts:[...base('elord').filter(p=>p[0]!=='circ'),['cloak','body',[0,10.5,-2.9],[-4.75,-20,-0.5,9.5,20,1],[0.1,0,0],{nb:1}],['coil','body',[2.8,7,0],[-1.2,-3,-3,2.4,6,6],[0,0,0.2],{nb:1}]],
      coats:recoat('elord',()=>({cl:[96,110,124],cl2:[200,206,212]})),
      paint(P,c){AM_KINDS.elord.paint(P,c);cloth(P,['cloak'],[110,124,136],{off:2});P.map('cloak',ALL,(s,t,w,h)=>t>=h-2?[230,232,236]:null);
        P.map('coil',ALL,(s,t)=>sh([196,170,120],((s+t)%3===0?-24:6)+hz(s,t,701)*8));}},
    wmerch:{res:2,tex:256,scale:1.06,parts:[...base('wfolk'),['pack','body',[0,3,-3.2],[-3.5,-1,-2.5,7,9,3],0,{nb:1}],['basket','armR',[1.5,-10,1.5],[-2,-2,-2,4,3,4],0,{nb:1}]],
      coats:recoat('wfolk',(c,i)=>({cl:[[110,84,54],[76,104,60],[120,100,60]][i%3]})),
      paint(P,c){AM_KINDS.wfolk.paint(P,c);leather(P,['pack'],[110,76,46]);band(P,'pack',SIDE,6,7,[200,170,90]);P.map('basket',ALL,(s,t,w,h,f)=>f==='T'?((s+t)%2?[220,60,60]:[230,200,90]):sh([170,130,80],((s+t)%2?-14:8)));}}
  });
  // ---- the steeds of the elves (D-088): the elven horse, silver-white, pale gold or moon-grey under a saddle-cloth of deep blue
  // bordered in gold with a silver star, a bridle of blue; the great elk of the wood elves, half again a deer's size, its antlers
  // wide and many-tined, a saddle-cloth of green and gold; and the swan boat, a hull of white with feathered sides, a gilt seat and
  // a swan's neck curving up from the bow to a gilt beak
  const H=AM_KINDS.horse,DE=AM_KINDS.deer,TACK=[['saddle','body',[0,10,-1],[-4,0,-4,8,1,7]],['cantle','saddle',[0,1,-4],[-3,0,0,6,2,1]],['scloth','body',[0,0,-1],[-5.25,3,-5.5,10.5,7.5,10]]];
  const tackPaint=(P,col,trim,star)=>{P.coat(['saddle','cantle'],[96,64,40],6);P.coat(['scloth'],col,5);for(const f of ['L','R','T'])P.rows('scloth',[f],0,1,trim);if(star){P.rect('scloth','L',3,3,2,2,[236,240,246]);P.rect('scloth','R',3,3,2,2,[236,240,246]);}};
  AM_KINDS.ehorse={parts:[...H.parts.map(p=>p.slice()),...TACK],scale:1.06,tex:256,
    coats:[[{coat:[232,232,228],mane:[246,246,242],low:[214,214,210],name:'silver'},3],[{coat:[214,206,186],mane:[246,236,206],low:[196,186,166],name:'pale gold'},2],[{coat:[178,180,184],mane:[236,236,240],low:[150,150,156],dapple:1,name:'moon-grey'},2]],
    paint(P,c,f){H.paint(P,c,f);tackPaint(P,[30,48,96],[224,188,98],1);P.rows('head',['L','R'],1,2,[30,48,96]);}};
  const ant=DE.parts.filter(p=>/^(ant|tine)/.test(p[0])).map(p=>{const q=p.slice(),o=Object.assign({},q[5]||{});delete o.only;q[5]=o;return q;});
  AM_KINDS.elk={parts:[...DE.parts.filter(p=>!/^(ant|tine)/.test(p[0])).map(p=>p.slice()),...ant,['tineL3','antL',[0,7,0],[-0.5,0,0,1,1,3],[-1.1,0,0],{m:'tineL1'}],['tineR3','antR',[0,7,0],[-0.5,0,0,1,1,3],[-1.1,0,0],{m:'tineL1'}],
      ['saddle','body',[0,8,-1],[-3.5,0,-3,7,1,6]],['scloth','body',[0,0,-1],[-4.25,2,-4,8.5,6.5,8]]].map(p=>p[0]==='antL'||p[0]==='antR'?[p[0],p[1],p[2],[-0.5,0,-0.5,1,10,1],p[4],p[5]]:p),scale:1.55,tex:256,
    coats:[[{coat:[150,108,66],back:[118,82,48],belly:[226,206,170],rump:[236,226,206],nose:[38,30,28],hoof:[44,38,34],ant:[232,226,206]},3],[{coat:[150,146,136],back:[120,116,108],belly:[220,214,200],rump:[236,232,222],nose:[40,36,34],hoof:[44,40,38],ant:[226,226,230]},1]],
    paint(P,c,f){DE.paint(P,c,f);P.coat(['antL','tineL1'],c.ant,10);P.coat(['saddle'],[96,64,40],6);P.coat(['scloth'],[60,96,52],5);for(const fc of ['L','R','T'])P.rows('scloth',[fc],0,1,[214,182,84]);}};
  AM_KINDS.swanboat={parts:[['hull',null,[0,8,0],[-11,-6,-18,22,8,30]],['bow','hull',[0,0,12],[-11,-6,0,22,8,14],0,{tp:['z',0.15,1,0,2]}],['stern','hull',[0,0,-18],[-11,-6,-8,22,8,8],0,{tp:['-z',0.6,1,0,1]}],
      ['wingL','hull',[-11,2,-4],[-1,-6,-14,2,9,24],[0,0,-0.15],{tp:['y',1,0.7,0,-2]}],['wingR','hull',[11,2,-4],[-1,-6,-14,2,9,24],[0,0,0.15],{m:'wingL',tp:['y',1,0.7,0,-2]}],
      ['seat','hull',[0,2,-4],[-9,0,-3,18,2,6]],['neck','bow',[0,1,12],[-2,0,-2,4,22,4],[-0.2,0,0]],['shead','neck',[0,22,0],[-2,-2,-2,4,5,8],[0.35,0,0]],['beak','shead',[0,-0.5,6],[-1,-1,0,2,2,5],0,{tp:['z',0.5,0.5,0,-0.5]}]],
    coats:[[{coat:[240,240,236]},1]],tex:256,
    paint(P,c,f){P.coat(['hull','bow','stern','wingL','neck','shead'],c.coat,5);P.rows('hull',['L','R','F','B'],0,1,[224,188,98]);P.coat(['seat'],[198,152,84],8);P.coat(['beak'],[224,188,98],8);P.eyes('shead',1,1,[18,14,14]);
      P.rows('wingL',['L','R'],2,3,[214,214,210]);P.rows('wingL',['L','R'],5,6,[214,214,210]);P.face('hull','T',[198,152,84],8);}};
  // a white ship of the havens under sail (seen setting out into the west, elf-life.js): the swan boat's lines at four times its
  // size with a mast, a yard and a bellied white sail with the silver star, the banner at the masthead
  AM_KINDS.whiteship={scale:4,tex:256,parts:[['hull',null,[0,6,0],[-12,-6,-30,24,9,48]],['bow','hull',[0,0,18],[-12,-6,0,24,9,16],0,{tp:['z',0.1,1,0,3]}],['stern','hull',[0,0,-30],[-12,-6,-6,24,11,6],0,{tp:['-z',0.6,1,0,2]}],
      ['neck','bow',[0,3,16],[-2,0,-2,4,20,4],[-0.25,0,0]],['shead','neck',[0,20,0],[-2,-2,-2,4,5,8],[0.4,0,0]],['beak','shead',[0,-0.5,6],[-1,-1,0,2,2,5],0,{tp:['z',0.5,0.5,0,-0.5]}],
      ['mast','hull',[0,3,0],[-1,0,-1,2,44,2]],['yard','mast',[0,40,1],[-16,-1,-1,32,2,2]],['sail','yard',[0,-1,1],[-15,-30,-0.5,30,30,1],[0.12,0,0]],['flag','mast',[0,44,0],[-0.5,-6,0,1,6,8]]],
    coats:[[{coat:[240,240,236]},1]],
    paint(P,c,f){P.coat(['hull','bow','stern','neck','shead'],c.coat,5);P.rows('hull',['L','R'],0,1,[224,188,98]);P.face('hull','T',[198,152,84],8);P.coat(['beak'],[224,188,98],8);P.eyes('shead',1,1,[18,14,14]);
      P.coat(['mast','yard'],[198,152,84],8);P.coat(['sail'],[242,240,234],4);P.rect('sail','F',13,10,4,8,[206,214,230]);P.rect('sail','F',11,12,8,4,[206,214,230]);P.rect('sail','B',13,10,4,8,[206,214,230]);P.coat(['flag'],[30,48,96],6);}};
})();
