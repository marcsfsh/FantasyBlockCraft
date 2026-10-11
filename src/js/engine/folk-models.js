// ---- The folk of the realms of men (D-060): soldiers and townsfolk, built like the foes (foe-models.js) from boxes measured in
// pixels with painted coats, but in human proportions (about 1.9 blocks tall). The soldiers wear the realm's livery: a black
// surcoat over mail with the white star-and-tower on the breast, a silver bordered hem, a tall crested helm with cheek guards;
// spearmen and swordsmen carry a black kite shield with the sign, archers a longbow, the captain a black cloak and a plume.
// The townsfolk dress by their trade: a tunic and hose, a long gown with an apron, a merchant's robe and hat, a smith's apron, a
// farmer's smock and straw hat, a lord's robe of black and silver. Faces have eyes, brows and a mouth; some men are bearded.
(function(){
  const SK=[[226,186,152],[204,160,122],[176,128,94],[142,96,66],[232,198,170]],HAIR=[[40,30,24],[70,46,30],[112,76,44],[150,96,52],[150,146,140],[30,26,26]];
  const legs=()=>[['legL',null,[-2,12,0],[-2,-12,-2,4,12,4]],['legR',null,[2,12,0],[-2,-12,-2,4,12,4],0,{m:'legL'}]];
  const arms=r=>[['armL','body',[-4,10.5,0],[-3,-11,-1.5,3,11,3],[r||0,0,0.06]],['armR','body',[4,10.5,0],[0,-11,-1.5,3,11,3],[r||0,0,-0.06],{m:'armL'}]];
  const man=()=>[...legs(),['body',null,[0,12,0],[-4,0,-2,8,11,4]],['head','body',[0,11,0],[-3,0,-3,6,7,6],0,{head:1}],...arms()];
  // the realm's sign in small: a star over a tower, 5 wide and 9 high (1 white, 2 the dark window)
  const SIGN=['..1..','.111.','11111','.111.','1.1.1','.....','1.1.1','11111','11211','11111'];
  const sign=(P,n,f,s0,t0,col)=>{for(let t=0;t<SIGN.length;t++)for(let s=0;s<5;s++){const c=SIGN[t][s];if(c==='1')P.px(n,f,s0+s,t0+t,col);else if(c==='2')P.px(n,f,s0+s,t0+t,[40,40,52]);}};
  // a face on the front of the head: eyes with whites, brows, a nose's shadow, a mouth; a beard where the coat has one
  const face=(P,c,o)=>{const sk=c.skin,dk=[sk[0]-34,sk[1]-34,sk[2]-30];P.coat(['head'],sk,6);
    P.rect('head','F',1,3,1,1,[236,236,232]);P.rect('head','F',2,3,1,1,c.eye||[54,72,96]);P.rect('head','F',3,3,1,1,c.eye||[54,72,96]);P.rect('head','F',4,3,1,1,[236,236,232]);
    P.rect('head','F',1,2,2,1,c.hair);P.rect('head','F',3,2,2,1,c.hair);P.px('head','F',2,4,dk);P.px('head','F',3,4,dk);P.rect('head','F',2,5,2,1,[150,84,74]);
    // hair: the top and back, down the sides to the ears, a fringe
    P.face('head','T',c.hair,10);P.rows('head',['B'],0,o&&o.long?7:4,c.hair);P.rows('head',['L','R'],0,2,c.hair);P.rect('head','L',0,2,3,1,c.hair);P.rect('head','R',3,2,3,1,c.hair);P.rows('head',['F'],0,1,c.hair);
    if(o&&o.long){P.rect('head','L',0,2,2,5,c.hair);P.rect('head','R',4,2,2,5,c.hair);}
    if(c.beard){P.rect('head','F',1,5,1,2,c.hair);P.rect('head','F',4,5,1,2,c.hair);P.rect('head','F',1,6,4,1,c.hair);P.rows('head',['L','R'],5,7,c.hair);}};
  const hands=(P,c)=>{P.rows('armL',['L','F','R','B','D'],9,11,c.skin);};
  const boots=(P,col)=>{P.rows('legL',['L','F','R','B'],8,12,col);P.face('legL','D',col,6);P.rows('legL',['L','F','R','B'],8,9,[col[0]+22,col[1]+20,col[2]+16]);};
  // ---- soldiers
  const BLACK=[30,32,40],SILVER=[198,204,214],MAIL=[124,128,136],STEEL=[170,176,186];
  const mail=(P,ns)=>{for(const n of ns)P.coat([n],MAIL,10);for(const n of ns)P.spots(n,['L','F','R','B'],[MAIL[0]+40,MAIL[1]+40,MAIL[2]+40],0.18);};
  const soldier=(extra,o)=>[...man(),['coat','body',[0,0,0],[-4.5,-5,-2.5,9,16,5]],
    ['helm','head',[0,3,0],[-3.5,0,-3.5,7,5,7],0,{head:1,tp:['y',0.62,0.62,0,0]}],['brim','head',[0,3,0],[-3.5,-0.5,-3.5,7,1,7],0,{head:1}],
    ['gL','head',[-3,3,0],[-0.5,-3,-1,1,3,3],0,{head:1}],['gR','head',[3,3,0],[-0.5,-3,-1,1,3,3],0,{head:1,m:'gL'}],
    ['crest','helm',[0,4.5,0],[-0.5,0,-3,1,(o&&o.plume)?5:3,7],0,{head:1,nb:1,tp:['y',1,0.7,0,-0.5]}],
    ['pL','armL',[0,0,0],[-3.5,-2.5,-2,4,3,4]],['pR','armR',[0,0,0],[-0.5,-2.5,-2,4,3,4],0,{m:'pL'}],...extra];
  const soldierPaint=(P,c,o)=>{face(P,c);mail(P,['armL','legL']);hands(P,c);boots(P,[46,34,26]);
    P.coat(['coat'],BLACK,5);P.rows('coat',['L','F','R','B'],14,16,SILVER);P.rows('coat',['L','F','R','B'],8,9,[96,70,40]);P.px('coat','F',4,8,[200,170,90]);
    sign(P,'coat','F',2,1,[236,238,242]);P.rows('coat',['L','R'],0,1,SILVER);P.face('coat','T',BLACK,4);
    P.coat(['helm','brim','gL','pL'],STEEL,10);P.rows('helm',['L','F','R','B'],4,5,[STEEL[0]-30,STEEL[1]-30,STEEL[2]-30]);P.rows('brim',['L','F','R','B'],0,1,SILVER);
    P.coat(['crest'],o&&o.plume?[236,236,240]:[226,226,230],8);if(o&&o.plume)P.rows('crest',['L','R'],0,2,[30,30,40]);};
  // the kite shield: black, a silver rim, the sign in white
  const shield=['shield','armL',[-3.5,-6,0],[-1,-7,-4,1,12,8],0,{nb:1,tp:['-y',1,0.15,0,0]}];
  const shieldPaint=P=>{P.coat(['shield'],BLACK,5);P.rows('shield',['L','R'],0,1,SILVER);for(const f of ['L','R']){P.rect('shield',f,0,0,1,12,SILVER);P.rect('shield',f,7,0,1,12,SILVER);}
    sign(P,'shield','L',1,1,[236,238,242]);sign(P,'shield','R',2,1,[236,238,242]);};
  const coats=b=>SK.map((s,i)=>[{skin:s,hair:HAIR[(i*2+b)%HAIR.length],beard:(i+b)%3===0},i===4?1:2]);
  Object.assign(AM_KINDS,{
    rspear:{parts:soldier([shield,['spear','armR',[1.5,-10,0.5],[-0.5,-7,-0.5,1,30,1],[0.15,0,0],{nb:1}],['tip','spear',[0,23,0],[-1,0,-0.5,2,4,1],0,{nb:1,tp:['y',0,1,0,0]}]]),coats:coats(0),
      paint(P,c){soldierPaint(P,c);shieldPaint(P);P.coat(['spear'],[96,70,44],8);P.coat(['tip'],STEEL,10);}},
    rsword:{parts:soldier([shield,['wpn','armR',[1.5,-10,0],[-0.5,-1,-1,1,2,12],0,{nb:1,tp:['z',1,0,0,0]}],['hilt','wpn',[0,0,1],[-0.5,-2,0,1,4,1],0,{nb:1}]]),coats:coats(1),
      paint(P,c){soldierPaint(P,c);shieldPaint(P);P.coat(['wpn'],[206,210,218],10);P.rect('wpn','T',0,0,1,3,[90,62,40]);P.rect('wpn','L',0,0,3,2,[90,62,40]);P.rect('wpn','R',9,0,3,2,[90,62,40]);P.coat(['hilt'],[200,170,90],8);}},
    rbow:{parts:soldier([['bow','armL',[-1.5,-10,1],[-0.5,-8,-0.5,1,18,1],0,{nb:1,tp:['y',1,0.6,0,0.6]}],['quiver','body',[2,6,-2.5],[-1,-3,-2,2,10,2],[0.3,0,0.2],{nb:1}]]),coats:coats(2),
      paint(P,c){soldierPaint(P,c);P.coat(['bow'],[110,76,44],8);P.rows('bow',['L','F','R','B'],8,10,[200,170,90]);P.coat(['quiver'],[86,58,36],8);P.rows('quiver',['L','F','R','B'],0,2,[236,236,232]);}},
    rcapt:{scale:1.05,parts:soldier([['cape','body',[0,10.5,-2.4],[-4.5,-17,-0.5,9,17,1],[0.1,0,0],{nb:1}],['wpn','armR',[1.5,-10,0],[-0.5,-1,-1,1,2,13],0,{nb:1,tp:['z',1,0,0,0]}],['hilt','wpn',[0,0,1],[-0.5,-2.5,0,1,5,1],0,{nb:1}]],{plume:1}),coats:coats(3),
      paint(P,c){soldierPaint(P,c,{plume:1});P.coat(['cape'],[24,24,32],5);P.rows('cape',['F','B','L','R'],15,17,SILVER);sign(P,'cape','B',2,3,[236,238,242]);P.coat(['wpn'],[220,224,232],10);P.coat(['hilt'],[226,196,100],8);P.coat(['pL'],SILVER,8);}},
    // ---- townsfolk
    rman:{parts:[...man(),['tunic','body',[0,0,0],[-4.5,-4,-2.5,9,15,5]]],
      coats:[[{skin:SK[0],hair:HAIR[1],cl:[110,80,52],hose:[70,74,60],beard:1},2],[{skin:SK[1],hair:HAIR[0],cl:[70,96,74],hose:[96,78,56]},2],[{skin:SK[2],hair:HAIR[2],cl:[132,60,48],hose:[60,60,70],beard:1},2],
        [{skin:SK[3],hair:HAIR[5],cl:[90,90,120],hose:[80,66,50]},1],[{skin:SK[4],hair:HAIR[4],cl:[150,130,90],hose:[70,60,50],beard:1},1]],
      paint(P,c){face(P,c);hands(P,c);P.coat(['armL'],c.cl,8);hands(P,c);P.coat(['legL'],c.hose,8);boots(P,[70,50,34]);P.coat(['tunic'],c.cl,8);P.rows('tunic',['L','F','R','B'],8,9,[60,44,30]);P.px('tunic','F',4,8,[180,150,90]);
        P.rows('tunic',['L','F','R','B'],14,15,[c.cl[0]-24,c.cl[1]-24,c.cl[2]-24]);P.rect('tunic','F',3,0,3,3,[c.cl[0]-20,c.cl[1]-20,c.cl[2]-20]);}},
    rwoman:{parts:[...man(),['gown','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.25,1.3,0,0]}],['hairB','head',[0,1,-3],[-3,-4,-0.5,6,7,1],0,{head:1,nb:1}]],
      coats:[[{skin:SK[0],hair:HAIR[2],cl:[120,40,44],ap:[220,214,196]},2],[{skin:SK[1],hair:HAIR[0],cl:[54,80,120],ap:[214,206,186]},2],[{skin:SK[2],hair:HAIR[3],cl:[96,110,60],ap:[226,220,204]},2],
        [{skin:SK[3],hair:HAIR[5],cl:[130,96,150],ap:[220,212,196]},1],[{skin:SK[4],hair:HAIR[4],cl:[90,70,52],ap:[200,196,180]},1]],
      paint(P,c){face(P,c,{long:1});P.coat(['hairB'],c.hair,10);P.hair('hairB');P.coat(['armL'],c.cl,8);hands(P,c);P.coat(['body'],c.cl,8);P.coat(['legL'],[70,52,40],6);
        P.coat(['gown'],c.cl,8);P.rect('gown','F',2,1,5,12,c.ap);P.rows('gown',['L','F','R','B'],13,14,[c.cl[0]-30,c.cl[1]-30,c.cl[2]-30]);P.rows('body',['F'],3,4,[c.cl[0]+30,c.cl[1]+30,c.cl[2]+30]);}},
    rmerch:{parts:[...man(),['robe','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.15,1.15,0,0]}],['hat','head',[0,6,0],[-4,0,-4,8,1,8],0,{head:1}],['crown','hat',[0,1,0],[-3,0,-3,6,3,6],0,{head:1}],
      ['purse','body',[3.5,1,1],[-1,-3,-1,2,3,2],0,{nb:1}]],
      coats:[[{skin:SK[1],hair:HAIR[1],cl:[110,30,40],trim:[220,180,80],beard:1},2],[{skin:SK[0],hair:HAIR[4],cl:[30,70,90],trim:[200,200,210]},2],[{skin:SK[2],hair:HAIR[0],cl:[90,60,110],trim:[220,180,80],beard:1},1]],
      paint(P,c){face(P,c);P.coat(['armL'],c.cl,8);hands(P,c);P.coat(['body','robe'],c.cl,8);P.rect('robe','F',4,0,1,13,c.trim);P.rows('robe',['L','F','R','B'],12,14,c.trim);P.rows('body',['L','F','R','B'],0,1,c.trim);
        P.coat(['legL'],[60,40,30],6);P.coat(['hat'],[40,32,30],6);P.coat(['crown'],[50,40,36],6);P.rows('crown',['L','F','R','B'],2,3,c.trim);P.coat(['purse'],[120,84,50],8);}},
    rsmith:{parts:[...man(),['apron','body',[0,0,0],[-4.5,-6,-2.5,9,15,5]],['ham','armR',[1.5,-10,0],[-0.5,-0.5,-0.5,1,1,6],[0.3,0,0],{nb:1}],['hhead','ham',[0,0,5],[-1,-1.5,0,2,3,2],0,{nb:1}]],
      coats:[[{skin:SK[1],hair:HAIR[0],beard:1},2],[{skin:SK[2],hair:HAIR[5],beard:1},2],[{skin:SK[3],hair:HAIR[1]},1]],
      paint(P,c){face(P,c);P.coat(['armL'],c.skin,8);P.spots('armL',['L','F','R','B'],[c.skin[0]-20,c.skin[1]-20,c.skin[2]-20],0.1);P.coat(['body'],[120,110,96],8);P.coat(['legL'],[70,60,50],6);boots(P,[50,36,26]);
        P.coat(['apron'],[96,64,40],10);P.rows('apron',['L','R','B'],0,8,[120,110,96]);P.face('apron','T',[120,110,96],6);P.rect('apron','F',0,0,9,1,[70,46,30]);P.spots('apron',['F'],[60,40,28],0.08);
        P.coat(['ham'],[96,70,44],6);P.coat(['hhead'],[90,92,100],8);}},
    rfarmer:{parts:[...man(),['smock','body',[0,0,0],[-4.5,-5,-2.5,9,16,5]],['hatb','head',[0,6,0],[-5,0,-5,10,1,10],0,{head:1,nb:1}],['hatc','hatb',[0,1,0],[-3,0,-3,6,2,6],0,{head:1}],
      ['hoe','armR',[1.5,-10,0.5],[-0.5,-6,-0.5,1,24,1],[0.15,0,0],{nb:1}],['blade','hoe',[0,17,0],[-0.5,0,0,1,1,4],0,{nb:1}]],
      coats:[[{skin:SK[1],hair:HAIR[2],cl:[176,160,120],beard:1},2],[{skin:SK[2],hair:HAIR[1],cl:[150,140,104]},2],[{skin:SK[0],hair:HAIR[4],cl:[160,150,112],beard:1},1]],
      paint(P,c){face(P,c);P.coat(['armL'],c.cl,8);hands(P,c);P.coat(['body','smock'],c.cl,10);P.rows('smock',['L','F','R','B'],8,9,[90,64,40]);P.coat(['legL'],[96,80,56],8);boots(P,[70,52,34]);
        P.coat(['hatb','hatc'],[214,186,108],14);P.rows('hatc',['L','F','R','B'],1,2,[150,60,40]);P.coat(['hoe'],[110,80,50],6);P.coat(['blade'],[120,124,130],8);}},
    rnoble:{scale:1.03,parts:[...man(),['robe','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.2,1.2,0,0]}],['mantle','body',[0,10.5,-2.4],[-4.5,-17,-0.5,9,17,1],[0.08,0,0],{nb:1}],
      ['circ','head',[0,5,0],[-3.5,0,-3.5,7,1,7],0,{head:1}]],
      coats:[[{skin:SK[0],hair:HAIR[0],beard:1},2],[{skin:SK[4],hair:HAIR[4],beard:1},1],[{skin:SK[1],hair:HAIR[5]},1]],
      paint(P,c){face(P,c);P.coat(['armL'],BLACK,6);hands(P,c);P.coat(['body','robe'],BLACK,6);sign(P,'body','F',2,1,[236,238,242]);P.rect('robe','F',4,0,1,13,SILVER);P.rows('robe',['L','F','R','B'],12,14,SILVER);
        P.coat(['legL'],[30,30,36],6);P.coat(['mantle'],[200,204,214],6);P.rows('mantle',['F','B'],0,2,[30,30,40]);P.coat(['circ'],SILVER,8);P.px('circ','F',3,0,[120,170,230]);}}
  });
})();
