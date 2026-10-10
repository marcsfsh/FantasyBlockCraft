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
    // the Emberlord: a demon of fire and shadow, horned, maned with flame, on wings of smoke, a burning blade and a whip of fire
    ember:{scale:3.8,parts:[...legs(20,6,6,4),['body',null,[0,20,0],[-8,0,-5,16,20,10],[0.1,0,0]],['head','body',[0,20,1],[-4,0,-4,8,8,8],[-0.1,0,0],{head:1}],
      ['jaw','head',[0,1,4],[-3,-1,-1,6,3,4],0,{head:1}],['hornL','head',[-4,6,0],[-1,0,-1,2,6,2],[0.2,0,-1],{head:1}],['tipL','hornL',[0,6,0],[-1,0,-1,2,5,2],[-0.6,0,0.6],{head:1}],
      ['hornR','head',[4,6,0],[-1,0,-1,2,6,2],[0.2,0,1],{head:1,m:'hornL'}],['tipR','hornR',[0,6,0],[-1,0,-1,2,5,2],[-0.6,0,-0.6],{head:1,m:'tipL'}],
      ['mane','head',[0,4,-2],[-6,0,-4,12,10,5],[-0.3,0,0],{head:1,nb:1}],
      ['armL','body',[-8,19,0],[-6,-20,-3,6,20,6],[0,0,0.1]],['armR','body',[8,19,0],[0,-20,-3,6,20,6],[0,0,-0.1],{m:'armL'}],
      ['wingL','body',[-5,17,-5],[-28,-16,-0.5,28,26,1],[0,0.6,0.25],{nb:1}],['wingR','body',[5,17,-5],[0,-16,-0.5,28,26,1],[0,-0.6,-0.25],{nb:1,m:'wingL'}],
      ['wpn','armR',[3,-19,0],[-1,-1,-2,2,3,26],0,{nb:1}],['whip1','armL',[-3,-19,0],[-0.5,-0.5,0,1,1,10],[0.6,0,0],{nb:1}],['whip2','whip1',[0,0,10],[-0.5,-0.5,0,1,1,10],[0.3,0,0],{nb:1,m:'whip1'}],
      ['whip3','whip2',[0,0,10],[-0.5,-0.5,0,1,1,10],[0.3,0,0],{nb:1,m:'whip1'}],['tail','body',[0,2,-5],[-1,-1,-14,2,2,14],[0.5,0,0],{nb:1}]],
      coats:[[{hide:[44,24,22],crack:[255,140,30],flame:[255,190,60]},1]],
      paint(P,c){P.coat(['body','head','jaw','legL','armL','tail'],c.hide,14);P.cracks(['body','armL','legL','head','tail'],c.crack,0.09);P.rows('legL',['L','F','R','B'],17,20,[24,16,16]);
        P.coat(['hornL','tipL'],[34,26,24],10);P.coat(['mane'],[40,18,14],10);P.cracks(['mane'],[255,120,26],0.55);P.cracks(['mane'],c.flame,0.22);
        P.coat(['wingL'],[46,26,26],14);for(const f of ['F','B'])for(let k=0;k<4;k++)for(let t=0;t<26;t++)P.px('wingL',f,Math.max(0,Math.min(27,(f==='F'?27-Math.round(t*(0.3+k*0.25)):Math.round(t*(0.3+k*0.25))))),t,[22,14,14]);P.spots('wingL',['F','B'],[255,110,30],0.015);
        P.glowFaces(['wpn'],[255,170,50]);P.spots('wpn',['L','R','T'],[255,250,200],0.2);P.rect('wpn','L',0,0,4,3,[40,30,28]);P.rect('wpn','R',22,0,4,3,[40,30,28]);P.glowFaces(['whip1'],[255,120,30]);
        P.glowEyes('head',3,3,[255,250,200]);P.glowRect('jaw','F',1,1,4,1,[255,160,40]);}}
  });
})();
