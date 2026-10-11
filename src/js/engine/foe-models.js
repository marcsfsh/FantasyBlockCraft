// ---- The foes' models (D-052): goblins, orcs, trolls and the Emberlords, built like the animals (animal-models.js) from boxes
// measured in pixels with painted coats, but standing on two legs. Eyes, cracks of fire, flames and burning blades are drawn
// with glowing pixels, so the foes show in the dark of the warrens. Weapons and gear (nb: not counted in the body's bounds)
// hang from the hands, so the arms carry them through a swing.
(function(){
  const legs=(y,w,d,x)=>[['legL',null,[-x,y,0],[-w/2,-y,-d/2,w,y,d]],['legR',null,[x,y,0],[-w/2,-y,-d/2,w,y,d],0,{m:'legL'}]];
  const arms=(px,py,pz,w,l,d,rot)=>[['armL','body',[-px,py,pz],[-w,-l,-d/2,w,l,d],[rot||0,0,0.08]],['armR','body',[px,py,pz],[0,-l,-d/2,w,l,d],[rot||0,0,-0.08],{m:'armL'}]];
  // the goblins: small, hunched, big-eared and long-armed
  const gob=()=>[...legs(6,2,2,1.5),['body',null,[0,6,0],[-3,0,-1.5,6,7,3],[0.3,0,0]],['cloth','body',[0,0,0],[-4,-3,-2,8,4,4]],
    ['head','body',[0,7,1],[-3,-0.5,-3,6,5,6],[-0.3,0,0],{head:1}],['nose','head',[0,1.5,3],[-0.5,-1,0,1,2,2],[0.2,0,0],{head:1}],
    ['earL','head',[-3,3,0],[-5,-0.5,-0.5,5,1,2],[0,0.35,-0.35],{head:1}],['earR','head',[3,3,0],[0,-0.5,-0.5,5,1,2],[0,-0.35,0.35],{head:1,m:'earL'}],
    ...arms(3,6,0.5,2,7,2,0.25)];
  const gobPaint=(P,c)=>{P.coat(['body','head','nose','earL','legL','armL'],c.skin,14);P.face('earL','F',c.inner,8);P.coat(['cloth'],c.rag,16);P.fringe('cloth',[c.rag[0]-30,c.rag[1]-30,c.rag[2]-30]);
    P.rows('legL',['L','F','R','B'],5,6,[50,40,30]);P.glowEyes('head',2,2,c.eye);P.rows('head',['F'],3,4,[40,30,26]);P.spots('head',['F','L','R','T'],[c.skin[0]-26,c.skin[1]-26,c.skin[2]-20],0.12);};
  const gobCoats=[[{skin:[118,136,62],inner:[150,110,100],rag:[96,72,46],eye:[255,214,60]},3],[{skin:[100,120,74],inner:[146,104,96],rag:[84,64,52],eye:[255,190,40]},2],[{skin:[136,132,82],inner:[156,112,98],rag:[110,84,52],eye:[255,120,40]},1]];
  // the orcs: tall, broad, tusked, in black iron
  const orc=()=>[...legs(12,3,3,2.2),['body',null,[0,12,0],[-4.5,0,-2.5,9,11,5],[0.12,0,0]],['cloth','body',[0,0,0],[-5,-4,-3,10,5,6]],
    ['head','body',[0,11,0.6],[-3,0,-3,6,6,6],[-0.12,0,0],{head:1}],['jaw','head',[0,0.5,2],[-2.5,-1.5,-1,5,2,3],0,{head:1}],
    ['tuskL','jaw',[-2,0.5,1.5],[-0.5,0,-0.5,1,2,1],[0,0,-0.15],{head:1}],['tuskR','jaw',[2,0.5,1.5],[-0.5,0,-0.5,1,2,1],[0,0,0.15],{head:1,m:'tuskL'}],
    ['earL','head',[-3,4,0],[-2,-0.5,-0.5,2,2,1],[0,0,-0.5],{head:1}],['earR','head',[3,4,0],[0,-0.5,-0.5,2,2,1],[0,0,0.5],{head:1,m:'earL'}],
    ...arms(4.5,10,0,3,11,3),['shL','armL',[0,0,0],[-4,-2,-2,4,3,4]],['shR','armR',[0,0,0],[0,-2,-2,4,3,4],0,{m:'shL'}]];
  const orcPaint=(P,c)=>{P.coat(['body','head','jaw','earL','legL','armL'],c.skin,12);P.coat(['tuskL'],[226,216,190],6);P.coat(['shL'],c.iron,10);P.spots('shL',['T','L','R','F','B'],[c.iron[0]+40,c.iron[1]+22,c.iron[2]],0.1);
    P.coat(['cloth'],c.cloth,12);P.fringe('cloth',[c.cloth[0]-28,c.cloth[1]-26,c.cloth[2]-24]);P.rows('body',['L','F','R','B'],7,11,c.iron);P.rows('body',['F'],5,6,[70,52,36]);
    P.rows('legL',['L','F','R','B'],9,12,[40,36,34]);P.rows('armL',['L','F','R','B'],8,11,[c.skin[0]-24,c.skin[1]-24,c.skin[2]-24]);P.glowEyes('head',2,2,c.eye);P.rows('head',['F'],4,5,[30,26,24]);
    P.spots('head',['F','L','R'],[c.skin[0]-30,c.skin[1]-30,c.skin[2]-30],0.1);};
  const orcCoats=[[{skin:[92,104,78],iron:[52,50,54],cloth:[110,40,30],eye:[255,190,40]},3],[{skin:[78,86,56],iron:[46,44,48],cloth:[70,56,40],eye:[255,150,30]},2],[{skin:[104,96,84],iron:[58,54,56],cloth:[90,30,26],eye:[255,80,40]},2],[{skin:[72,74,70],iron:[40,38,42],cloth:[40,36,34],eye:[255,214,60]},1]];
  const HAFT=[80,56,34],blade=(P,n,len,metal)=>{P.coat([n],metal,10);P.rect(n,'L',0,0,3,9,HAFT);P.rect(n,'R',len-3,0,3,9,HAFT);P.rect(n,'T',0,0,9,3,HAFT);P.rect(n,'D',0,len-3,9,3,HAFT);P.face(n,'B',HAFT);};
  Object.assign(AM_KINDS,{
    goblin:{parts:[...gob(),['wpn','armR',[1,-6.5,0],[-0.5,-0.5,-1,1,1,6],0,{nb:1}]],coats:gobCoats,
      paint(P,c){gobPaint(P,c);blade(P,'wpn',6,[170,170,176]);}},
    gslinger:{parts:[...gob(),['cap','head',[0,3,0],[-3.5,0,-3.5,7,2,7],0,{head:1}],['sling','armR',[1,-6.5,0],[-0.5,-4,-0.5,1,4,1],0,{nb:1}],['pouch','body',[2.5,1,1],[-1,-2,-1,2,2,2],0,{nb:1}]],coats:gobCoats,
      paint(P,c){gobPaint(P,c);P.coat(['cap','pouch'],[110,80,50],12);P.coat(['sling'],[150,120,80],10);P.rows('cap',['L','F','R','B'],1,2,[80,56,34]);}},
    gfire:{parts:[...gob(),['robe','body',[0,0,0],[-3.5,-5,-2,7,11,4]],['hood','head',[0,0,0],[-3.5,-0.5,-3.5,7,6,6],0,{head:1}],
      ['staff','armR',[1,-6.5,0],[-0.5,-3,-0.5,1,16,1],[-0.2,0,0],{nb:1}],['gem','staff',[0,13,0],[-1,0,-1,2,2,2],0,{nb:1}]],coats:gobCoats,
      paint(P,c){gobPaint(P,c);P.coat(['robe','hood'],[60,30,30],14);P.rows('robe',['L','F','R','B'],8,11,[90,40,30]);P.cracks(['robe'],[255,120,30],0.08);
        P.coat(['staff'],[70,50,36],10);P.glowFaces(['gem'],[255,150,40]);P.glowEyes('head',2,2,[255,90,30]);}},
    gchief:{scale:1.4,parts:[...gob(),['crown','head',[0,4,0],[-3.5,0,-3.5,7,2,7],0,{head:1}],['cape','body',[0,7,-1.6],[-3.5,-10,-1,7,10,1],[0.15,0,0],{nb:1}],
      ['shL','armL',[0,0,0],[-3,-2,-1.5,3,2,3]],['shR','armR',[0,0,0],[0,-2,-1.5,3,2,3],0,{m:'shL'}],['wpn','armR',[1,-6.5,0],[-0.5,-2,-1,1,4,9],0,{nb:1}]],coats:gobCoats,
      paint(P,c){gobPaint(P,c);P.coat(['crown'],[220,180,60],16);for(let s=0;s<7;s+=2)for(const f of ['L','F','R','B'])P.px('crown',f,s,0,[255,226,110]);P.glow('crown','F',3,1,[220,40,40]);
        P.coat(['cape'],[120,26,24],14);P.coat(['shL'],[226,214,190],12);blade(P,'wpn',9,[150,150,158]);P.glowEyes('head',2,2,[255,60,40]);}},
    orc:{parts:[...orc(),['helm','head',[0,3,0],[-3.5,0,-3.5,7,4,7],0,{head:1}],['wpn','armR',[1.5,-10,0],[-0.5,-2,-1,1,4,10],0,{nb:1}]],coats:orcCoats,
      paint(P,c){orcPaint(P,c);P.coat(['helm'],c.iron,10);P.rows('helm',['F'],2,4,[20,18,20]);blade(P,'wpn',10,[150,146,150]);}},
    obow:{parts:[...orc(),['hood','head',[0,0,0],[-3.5,-0.5,-3.5,7,7,6],0,{head:1}],['bow','armL',[-1.5,-10,1],[-0.5,-7,-0.5,1,15,1],0,{nb:1}],
      ['quiver','body',[2,6,-2.5],[-1,-3,-2,2,9,2],[0.3,0,0.2],{nb:1}]],coats:orcCoats,
      paint(P,c){orcPaint(P,c);P.coat(['hood'],[60,54,46],12);P.coat(['bow'],[90,62,38],10);P.coat(['quiver'],[96,66,40],10);P.rows('quiver',['L','F','R','B'],0,2,[200,190,170]);}},
    obrute:{scale:1.18,parts:[...orc(),['helm','head',[0,0,0],[-3.5,-0.5,-3.5,7,8,7],0,{head:1}],['shield','armL',[-3,-6,0],[-1,-5,-4,1,10,8],0,{nb:1}],
      ['haft','armR',[1.5,-10,0],[-0.5,-0.5,-2,1,1,12],0,{nb:1}],['maul','haft',[0,0,9],[-2,-2,0,4,4,5],0,{nb:1}]],coats:orcCoats,
      paint(P,c){orcPaint(P,c);P.coat(['helm','shield','maul'],c.iron,10);P.rows('helm',['F'],2,3,[20,18,20]);P.glow('helm','F',2,2,c.eye);P.glow('helm','F',4,2,c.eye);
        P.spots('shield',['L','R'],[110,40,30],0.25);P.rect('shield','L',3,0,2,10,[120,30,26]);P.coat(['haft'],[80,56,34],8);}},
    ochief:{scale:1.22,parts:[...orc(),['helm','head',[0,3,0],[-3.5,0,-3.5,7,4,7],0,{head:1}],['hornL','helm',[-3.5,3,0],[-1,0,-1,2,5,2],[0,0,-0.9],{head:1}],['hornR','helm',[3.5,3,0],[-1,0,-1,2,5,2],[0,0,0.9],{head:1,m:'hornL'}],
      ['pole','body',[0,4,-3],[-0.5,0,-0.5,1,22,1],[-0.1,0,0],{nb:1}],['flag','pole',[0,21,0],[0.5,-9,-0.5,8,9,1],0,{nb:1}],
      ['haft','armR',[1.5,-10,0],[-0.5,-0.5,-2,1,1,14],0,{nb:1}],['axe','haft',[0,0,10],[-0.5,-4,0,1,8,4],0,{nb:1}]],coats:orcCoats,
      paint(P,c){orcPaint(P,c);P.coat(['helm'],[36,34,38],10);P.coat(['hornL'],[210,196,170],10);P.coat(['pole','haft'],[70,50,34],8);P.coat(['flag'],[130,24,22],14);P.glowRect('flag','F',3,3,2,3,[255,120,30]);P.glowRect('flag','B',3,3,2,3,[255,120,30]);
        P.coat(['axe'],[120,116,122],10);P.rows('axe',['L','R'],0,1,[200,200,206]);P.rows('cloth',['F','B'],0,2,[150,30,26]);}},
    // the ash troll: hulking, hunched, long-armed, grey hide split with glowing cracks, a club of basalt
    troll:{scale:1.4,parts:[...legs(13,6,6,4),['body',null,[0,13,0],[-8,0,-5,16,15,10],[0.4,0,0]],['head','body',[0,14,4],[-4,-2,-3,8,7,7],[-0.45,0,0],{head:1}],
      ['jaw','head',[0,-1,3],[-3.5,-2,-2,7,3,5],0,{head:1}],['nose','head',[0,2,4],[-1,-2,0,2,3,2],0,{head:1}],['tuskL','jaw',[-2.5,0.5,2.5],[-0.5,0,-0.5,1,2,1],0,{head:1}],['tuskR','jaw',[2.5,0.5,2.5],[-0.5,0,-0.5,1,2,1],0,{head:1,m:'tuskL'}],
      ['armL','body',[-8,13,1],[-5,-22,-3,5,22,6],[0.25,0,0.05]],['armR','body',[8,13,1],[0,-22,-3,5,22,6],[0.25,0,-0.05],{m:'armL'}],
      ['club','armR',[2.5,-21,0],[-2,-2,-2,4,4,16],[1.1,0,0],{nb:1}],['sp1','body',[-3,13,-4],[-1,0,-1,2,4,2],[-0.5,0,0],{nb:1}],['sp2','body',[3,11,-4.5],[-1,0,-1,2,4,2],[-0.6,0,0],{nb:1,m:'sp1'}],['sp3','body',[0,7,-5],[-1,0,-1,2,4,2],[-0.7,0,0],{nb:1,m:'sp1'}]],
      coats:[[{hide:[70,66,64],crack:[255,130,30]},3],[{hide:[84,72,62],crack:[255,90,26]},2]],
      paint(P,c){P.coat(['body','head','jaw','nose','legL','armL'],c.hide,18);P.spots('body',['T','L','R','B'],[c.hide[0]+30,c.hide[1]+30,c.hide[2]+28],0.12);P.cracks(['body','armL','legL'],c.crack,0.06);
        P.coat(['tuskL'],[220,206,176],8);P.coat(['club'],[46,44,48],14);P.cracks(['club'],c.crack,0.05);P.coat(['sp1'],[50,48,50],12);P.glowEyes('head',2,3,[255,170,50]);P.rows('jaw',['F'],0,1,[30,22,20]);}},
    // the Emberlord (D-054, D-055, D-056): a towering demon of shadow and flame, built of straight-edged tapering shapes. Hunched over
    // great digitigrade legs, its torso a wedge broad at the shoulders and narrow at the waist, spines down its back; a horned
    // skull thrust low and forward, narrowing to the muzzle, with a heavy angled brow over two slanted burning slits, cheek spurs,
    // fangs and an open burning maw; tapering arms with elbow spurs and claws; a mane of flame streaming back; vast wings of
    // tapering bones with a torn membrane between them. A burning blade in the right hand, a whip of fire in the left.
    ember:{scale:4.4,tex:256,parts:[
      ['legL',null,[-6,22.5,0],[-4,-13,-4,8,14,8],[-0.6,0,0.06],{tp:['-y',0.65,0.65,0,0.6]}],['legR',null,[6,22.5,0],[-4,-13,-4,8,14,8],[-0.6,0,-0.06],{m:'legL',tp:['-y',0.65,0.65,0,0.6]}],
      ['shinL','legL',[0,-12,0.3],[-2.5,-13,-2.5,5,13,5],[1.15,0,0],{tp:['-y',0.7,0.8,0,0]}],['shinR','legR',[0,-12,0.3],[-2.5,-13,-2.5,5,13,5],[1.15,0,0],{m:'shinL',tp:['-y',0.7,0.8,0,0]}],
      ['spurL','shinL',[0,-10,-2],[-1,-1,-4,2,2,4],[0.6,0,0],{tp:['-z',0,0,0,0]}],['spurR','shinR',[0,-10,-2],[-1,-1,-4,2,2,4],[0.6,0,0],{m:'spurL',tp:['-z',0,0,0,0]}],
      ['footL','shinL',[0,-12.5,0],[-3,-2,-2,6,3,10],[-0.55,0,0],{tp:['z',0.6,0.5,0,-0.6]}],['footR','shinR',[0,-12.5,0],[-3,-2,-2,6,3,10],[-0.55,0,0],{m:'footL',tp:['z',0.6,0.5,0,-0.6]}],
      ['toeL1','footL',[-1.6,-1,7.5],[-1,-1,0,2,2,4],[0.25,-0.2,0],{tp:['z',0,0,0,-0.6]}],['toeL2','footL',[0,-1,8],[-1,-1,0,2,2,4],[0.25,0,0],{m:'toeL1',tp:['z',0,0,0,-0.6]}],['toeL3','footL',[1.6,-1,7.5],[-1,-1,0,2,2,4],[0.25,0.2,0],{m:'toeL1',tp:['z',0,0,0,-0.6]}],
      ['toeR1','footR',[-1.6,-1,7.5],[-1,-1,0,2,2,4],[0.25,-0.2,0],{m:'toeL1',tp:['z',0,0,0,-0.6]}],['toeR2','footR',[0,-1,8],[-1,-1,0,2,2,4],[0.25,0,0],{m:'toeL1',tp:['z',0,0,0,-0.6]}],['toeR3','footR',[1.6,-1,7.5],[-1,-1,0,2,2,4],[0.25,0.2,0],{m:'toeL1',tp:['z',0,0,0,-0.6]}],
      ['body',null,[0,22.5,0],[-6,-2,-5,12,15,10],[0.7,0,0],{tp:['y',1.45,1.15,0,0]}],['chest','body',[0,12,1],[-9,-1,-6.5,18,13,13],[0.25,0,0],{tp:['y',1.3,0.8,0,-1.2]}],
      ['spn1','chest',[0,3,-6.6],[-1,0,-1,2,7,2],[-1.25,0,0],{nb:1,tp:['y',0,0,0,0]}],['spn2','chest',[0,7,-6.4],[-1,0,-1,2,8,2],[-1.15,0,0],{nb:1,m:'spn1',tp:['y',0,0,0,0]}],
      ['spn3','chest',[0,11,-6],[-1,0,-1,2,6,2],[-1.05,0,0],{nb:1,m:'spn1',tp:['y',0,0,0,0]}],['spn4','body',[0,6,-5.4],[-1,0,-1,2,5,2],[-1.3,0,0],{nb:1,m:'spn1',tp:['y',0,0,0,0]}],
      ['shL','chest',[-11,11,-1],[-2,0,-2,4,7,4],[-0.5,0,0.75],{nb:1,tp:['y',0,0,0,0]}],['shR','chest',[11,11,-1],[-2,0,-2,4,7,4],[-0.5,0,-0.75],{nb:1,m:'shL',tp:['y',0,0,0,0]}],
      ['neck','chest',[0,10,2.5],[-3.5,-1,-3.5,7,6,7],[-0.35,0,0],{tp:['y',0.8,0.8,0,0.8]}],
      ['head','neck',[0,4.5,1],[-4,-2.5,-3,8,6,9],[-0.7,0,0],{head:1,tp:['z',0.55,0.7,0,-0.6]}],
      ['browL','head',[-2,2.6,3.2],[-2.5,-1,-1,5,2,5],[0.15,0.25,-0.32],{head:1,tp:['z',0.6,0.5,0,-0.4]}],['browR','head',[2,2.6,3.2],[-2.5,-1,-1,5,2,5],[0.15,-0.25,0.32],{head:1,m:'browL',tp:['z',0.6,0.5,0,-0.4]}],
      ['eyeL','head',[-1.35,1.3,4.1],[-1,-0.5,-0.5,2,1,1],[0,0.3,-0.3],{head:1,tp:['-x',1,0.5,0,-0.2]}],['eyeR','head',[1.35,1.3,4.1],[-1,-0.5,-0.5,2,1,1],[0,-0.3,0.3],{head:1,m:'eyeL',tp:['x',1,0.5,0,-0.2]}],
      ['jaw','head',[0,-2.5,-1],[-3.5,-2,0,7,2,8],[0.4,0,0],{head:1,tp:['z',0.6,0.8,0,0.2]}],
      ['fangL','head',[-1.4,-2.3,4.8],[-0.5,-2,-0.5,1,2,1],0,{head:1,tp:['-y',0,0,0,0]}],['fangR','head',[1.4,-2.3,4.8],[-0.5,-2,-0.5,1,2,1],0,{head:1,m:'fangL',tp:['-y',0,0,0,0]}],
      ['tuskL','jaw',[-1.8,0,6],[-0.5,0,-0.5,1,2,1],0,{head:1,m:'fangL',tp:['y',0,0,0,0]}],['tuskR','jaw',[1.8,0,6],[-0.5,0,-0.5,1,2,1],0,{head:1,m:'fangL',tp:['y',0,0,0,0]}],
      ['chkL','head',[-3.6,-0.5,0.5],[-1,-1,-5,2,2,5],[0.1,-0.5,0],{head:1,tp:['-z',0,0,0,0]}],['chkR','head',[3.6,-0.5,0.5],[-1,-1,-5,2,2,5],[0.1,0.5,0],{head:1,m:'chkL',tp:['-z',0,0,0,0]}],
      ['hornL','head',[-3.2,2.5,1],[-2,0,-2,4,8,4],[0.25,0,1.15],{head:1,tp:['y',0.65,0.65,0,0]}],['tipL','hornL',[0,8,0],[-1.5,0,-1.5,3,8,3],[0.9,0,-0.95],{head:1,tp:['y',0.5,0.5,0,0]}],['tip2L','tipL',[0,8,0],[-1,0,-1,2,7,2],[0.55,0,-0.45],{head:1,tp:['y',0,0,0,0]}],
      ['hornR','head',[3.2,2.5,1],[-2,0,-2,4,8,4],[0.25,0,-1.15],{head:1,m:'hornL',tp:['y',0.65,0.65,0,0]}],['tipR','hornR',[0,8,0],[-1.5,0,-1.5,3,8,3],[0.9,0,0.95],{head:1,m:'tipL',tp:['y',0.5,0.5,0,0]}],['tip2R','tipR',[0,8,0],[-1,0,-1,2,7,2],[0.55,0,0.45],{head:1,m:'tip2L',tp:['y',0,0,0,0]}],
      ['maneA','chest',[0,11,-2],[-10,0,-0.5,20,16,1],[-1.2,0,0],{nb:1}],['maneB','chest',[0,11,-2],[-0.5,0,-8,1,16,16],[-1.2,0,0],{nb:1}],
      ['crest','chest',[0,5,-6.5],[-0.5,-6,-7,1,14,7],0,{nb:1}],
      ['armL','chest',[-11,9,0],[-6,-15,-3.5,6,16,7],[-1.25,0,-0.2],{tp:['-y',0.7,0.75,0.5,0]}],['armR','chest',[11,9,0],[0,-15,-3.5,6,16,7],[-1.25,0,0.2],{m:'armL',tp:['-y',0.7,0.75,-0.5,0]}],
      ['foreL','armL',[-3,-15,0],[-3,-16,-3,6,16,6],[-0.6,0,0],{tp:['-y',0.7,0.7,0,0.4]}],['foreR','armR',[3,-15,0],[-3,-16,-3,6,16,6],[-0.6,0,0],{m:'foreL',tp:['-y',0.7,0.7,0,0.4]}],
      ['elbL','foreL',[0,-1,-2.5],[-1,-1,-5,2,2,5],[0.3,0,0],{nb:1,tp:['-z',0,0,0,0]}],['elbR','foreR',[0,-1,-2.5],[-1,-1,-5,2,2,5],[0.3,0,0],{nb:1,m:'elbL',tp:['-z',0,0,0,0]}],
      ['handL','foreL',[0,-16,0.3],[-3,-4,-2.5,6,4,5],0,{tp:['-y',0.85,0.9,0,0.3]}],['handR','foreR',[0,-16,0.3],[-3,-4,-2.5,6,4,5],0,{m:'handL',tp:['-y',0.85,0.9,0,0.3]}],
      ['clL1','handL',[-2,-4,1],[-0.5,-4,-0.5,1,4,1],[0.35,0,0],{nb:1,tp:['-y',0,0,0,0.6]}],['clL2','handL',[0,-4,1.3],[-0.5,-4,-0.5,1,4,1],[0.35,0,0],{nb:1,m:'clL1',tp:['-y',0,0,0,0.6]}],['clL3','handL',[2,-4,1],[-0.5,-4,-0.5,1,4,1],[0.35,0,0],{nb:1,m:'clL1',tp:['-y',0,0,0,0.6]}],
      ['clR1','handR',[-2,-4,1],[-0.5,-4,-0.5,1,4,1],[0.35,0,0],{nb:1,m:'clL1',tp:['-y',0,0,0,0.6]}],['clR2','handR',[0,-4,1.3],[-0.5,-4,-0.5,1,4,1],[0.35,0,0],{nb:1,m:'clL1',tp:['-y',0,0,0,0.6]}],['clR3','handR',[2,-4,1],[-0.5,-4,-0.5,1,4,1],[0.35,0,0],{nb:1,m:'clL1',tp:['-y',0,0,0,0.6]}],
      ['wpn','handR',[0,-3,0],[-1,-1.5,-3,2,3,34],[0.55,0,0],{nb:1,tp:['z',0.5,0.15,0,0]}],['guard','wpn',[0,0,1],[-5,-1,0,10,2,2],0,{nb:1,tp:['x',0.6,0.6,0,0]}],
      ['whip1','handL',[0,-4,0],[-0.5,-0.5,0,1,1,12],[1.2,0,0],{nb:1}],['whip2','whip1',[0,0,12],[-0.5,-0.5,0,1,1,12],[0.35,0,0],{nb:1,m:'whip1'}],
      ['whip3','whip2',[0,0,12],[-0.5,-0.5,0,1,1,12],[0.35,0,0],{nb:1,m:'whip1'}],['whip4','whip3',[0,0,12],[-0.5,-0.5,0,1,1,12],[0.3,0,0],{nb:1,m:'whip1'}],
      ['tail','body',[0,0,-5],[-2,-2,-14,4,4,14],[-0.9,0,0],{nb:1,tp:['-z',0.55,0.55,0,0]}],['tail2','tail',[0,0,-14],[-1,-1,-12,2,2,12],[-0.4,0,0],{nb:1,tp:['-z',0.25,0.25,0,0]}],
      ['wingL','chest',[-5,9,-6.5],[-28,-30,-0.5,28,34,1],[-0.85,-0.6,-0.55],{nb:1}],['wbL','wingL',[0,3,0],[-28,-1,-1,28,3,2],0,{nb:1,tp:['-x',0.45,0.5,0,0]}],
      ['wingL2','wingL',[-28,4,0],[-32,-36,-0.5,32,40,1],[0,-0.35,-0.35],{nb:1}],['wcL','wingL2',[-0.5,3.5,0],[-1,0,-1,2,5,2],[0,0,0.5],{nb:1,tp:['y',0,0,0,0]}],['fL0','wingL2',[-0.5,3.5,0],[-32,-1,-1,32,2,2],0,{nb:1,tp:['-x',0.35,0.4,0,0]}],['fL1','wingL2',[-0.5,3.5,0],[-30,-0.5,-0.5,30,1,1],[0,0,0.44],{nb:1,tp:['-x',0.3,0.3,0,0]}],['fL2','wingL2',[-0.5,3.5,0],[-38,-0.5,-0.5,38,1,1],[0,0,0.942],{nb:1,tp:['-x',0.3,0.3,0,0]}],['fL3','wingL2',[-0.5,3.5,0],[-40,-0.5,-0.5,40,1,1],[0,0,1.351],{nb:1,tp:['-x',0.3,0.3,0,0]}],['fL4','wingL2',[-0.5,3.5,0],[-36,-0.5,-0.5,36,1,1],[0,0,1.571],{nb:1,tp:['-x',0.3,0.3,0,0]}],
      ['wingR','chest',[5,9,-6.5],[0,-30,-0.5,28,34,1],[-0.85,0.6,0.55],{nb:1}],['wbR','wingR',[0,3,0],[0,-1,-1,28,3,2],0,{nb:1,m:'wbL',tp:['x',0.45,0.5,0,0]}],
      ['wingR2','wingR',[28,4,0],[0,-36,-0.5,32,40,1],[0,0.35,0.35],{nb:1}],['wcR','wingR2',[0.5,3.5,0],[-1,0,-1,2,5,2],[0,0,-0.5],{nb:1,m:'wcL',tp:['y',0,0,0,0]}],['fR0','wingR2',[0.5,3.5,0],[0,-1,-1,32,2,2],0,{nb:1,m:'fL0',tp:['x',0.35,0.4,0,0]}],['fR1','wingR2',[0.5,3.5,0],[0,-0.5,-0.5,30,1,1],[0,0,-0.44],{nb:1,m:'fL1',tp:['x',0.3,0.3,0,0]}],['fR2','wingR2',[0.5,3.5,0],[0,-0.5,-0.5,38,1,1],[0,0,-0.942],{nb:1,m:'fL2',tp:['x',0.3,0.3,0,0]}],['fR3','wingR2',[0.5,3.5,0],[0,-0.5,-0.5,40,1,1],[0,0,-1.351],{nb:1,m:'fL3',tp:['x',0.3,0.3,0,0]}],['fR4','wingR2',[0.5,3.5,0],[0,-0.5,-0.5,36,1,1],[0,0,-1.571],{nb:1,m:'fL4',tp:['x',0.3,0.3,0,0]}]],
      coats:[[{hide:[36,21,19],dark:[18,11,11],fire:[255,130,30],hot:[255,214,110],white:[255,248,214],bone:[46,34,30],ivory:[206,192,164],memb:[74,22,18]},1]],
      paint(P,c){
        P.coat(['body','chest','neck','legL','shinL','footL','armL','foreL','handL','tail','tail2'],c.hide,12);
        P.cracks(['legL','shinL','armL','foreL','tail'],c.fire,0.014);P.cracks(['body','chest','neck'],c.fire,0.012);
        // the burning heart in the chest, a few ribs glowing through the hide
        P.glowRect('chest','F',7,3,4,4,c.fire);P.glowRect('chest','F',8,4,2,2,c.hot);P.glowRect('chest','T',8,8,2,3,c.fire);
        for(let k=0;k<3;k++){const t=2+k*4;P.glowRect('chest','F',3,t,3,1,[200,70,20]);P.glowRect('chest','F',12,t,3,1,[200,70,20]);}
        P.glowRect('body','F',5,2,2,9,c.fire);P.glowRect('body','F',5,4,1,5,c.hot);
        // the skull: near black, a seam of fire along the muzzle, the brow darker still; burning slits for eyes; the maw on fire
        P.coat(['head','jaw'],[30,18,16],8);P.cracks(['head'],c.fire,0.02);P.coat(['browL'],c.dark,4);P.glowFaces(['eyeL'],[255,238,160]);
        P.glowRect('head','D',1,2,6,7,c.fire);P.glowRect('jaw','T',1,1,5,7,c.hot);P.glowRect('jaw','F',1,0,5,1,c.fire);P.glow('head','F',1,3,c.fire);P.glow('head','F',6,3,c.fire);
        P.coat(['fangL','chkL','clL1','toeL1','spurL','elbL'],c.ivory,10);P.rows('chkL',['L','R','T','D'],0,1,c.bone);
        P.coat(['hornL'],[72,58,50],10);P.coat(['tipL'],[46,38,34],8);P.coat(['tip2L'],[22,18,18],4);
        P.coat(['spn1','shL'],[40,26,22],8);P.rows('spn1',['L','F','R','B'],0,3,c.fire);P.rows('shL',['L','F','R','B'],0,2,c.fire);
        P.rows('handL',['L','F','R','B'],3,4,c.bone);P.face('footL','D',c.dark,4);
        // the flames: crossed sheets, white at the root to red at the tips, cut into tongues
        const flame=(w,h,salt)=>(a,b)=>{const top=h*(0.35+0.65*Math.abs(Math.sin(a*0.85+salt)*Math.cos(a*0.37+salt*2)));const up=h-1-b;if(up>top)return 'cut';const q=up/Math.max(1,top);
          return q<0.25?[255,196,90,200]:q<0.55?[255,150,44,200]:q<0.8?[240,90,24,200]:[190,38,18,200];};
        P.sheet('maneA','z',flame(20,16,1.3));P.sheet('maneB','x',flame(16,16,2.9));P.sheet('crest','x',(a,b)=>{const top=14*(0.3+0.7*Math.abs(Math.sin(a*1.3+0.7)));return b<14-top?'cut':flame(7,14,4.1)(a,b);});
        // the blade burns, the whip is fire, the tail ends in flame
        P.glowFaces(['wpn'],[255,170,50]);P.spots('wpn',['L','R','T'],c.white,0.2);P.rect('wpn','L',0,0,5,3,[34,26,24]);P.rect('wpn','R',29,0,5,3,[34,26,24]);P.coat(['guard'],[34,26,24],6);P.glowRect('guard','F',4,0,2,2,c.fire);
        P.glowFaces(['whip1'],[255,120,30]);P.glowRect('tail2','L',8,0,4,2,c.fire);P.glowRect('tail2','R',0,0,4,2,c.fire);P.glowRect('tail2','B',0,0,2,2,c.hot);
        // the wings: bones of their own over a dark membrane hung in scallops between the fingers, torn here and there, the torn
        // edges smouldering. Each side is painted in its own frame (the wrist is at the far end of the left wing's texture)
        const H=(a,b,k)=>((Math.sin(a*12.9898+b*78.233+k)*43758.5453)%1+1)%1;
        const inner=(a,b)=>{const w=28,body=a/(w-1),lim=33-10*body-5*Math.abs(Math.sin(body*Math.PI*2));
          if(b>lim)return 'cut';if(b>lim-6&&H(a>>1,b>>1,3)<0.12)return 'cut';if(b<=1)return c.bone;if(a>w-3)return c.bone;
          if(b>lim-1.3||(b>lim-7&&H(a>>1,(b+1)>>1,3)<0.12))return [255,96,26,200];return [c.memb[0]-b*0.8,c.memb[1]-b*0.3,c.memb[2]-b*0.2];};
        const FING=[[Math.PI*1.0,32],[Math.PI*0.86,30],[Math.PI*0.7,38],[Math.PI*0.57,40],[Math.PI*0.5,36]];
        const outer=(a,b)=>{const dx=a-31,dy=b,r=Math.hypot(dx,dy),ang=Math.atan2(dy,dx);if(ang>Math.PI+0.01||ang<FING[FING.length-1][0]-0.01)return 'cut';
          let lim=0,bone=false;for(let k=0;k+1<FING.length;k++){const [a0,l0]=FING[k],[a1,l1]=FING[k+1];if(ang<=a0+0.001&&ang>=a1-0.001){const u=(a0-ang)/(a0-a1);lim=l0+(l1-l0)*u-7*Math.sin(Math.PI*u);}}
          for(const [fa,fl] of FING)if(r<=fl+0.5&&Math.abs(Math.sin(ang-fa))*r<0.8)bone=true;
          if(bone)return r<4?c.ivory:c.bone;if(r>lim)return 'cut';if(r>lim-7&&H(a>>1,b>>1,5)<0.14)return 'cut';
          if(r>lim-1.3||(r>lim-8&&(H((a+1)>>1,b>>1,5)<0.14||H(a>>1,(b+1)>>1,5)<0.14)))return [255,96,26,200];const k2=Math.min(1,r/40);return [c.memb[0]-24*k2,c.memb[1]-10*k2,c.memb[2]-8*k2];};
        P.sheet('wingL','z',inner);P.sheet('wingR','z',(a,b)=>inner(27-a,b));P.sheet('wingL2','z',outer);P.sheet('wingR2','z',(a,b)=>outer(31-a,b));
        P.coat(['wbL','fL0','fL1','fL2','fL3','fL4'],c.bone,8);P.coat(['wcL'],c.ivory,8);}}
  });
})();
