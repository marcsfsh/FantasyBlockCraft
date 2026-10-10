// ---- Animal models (E1 refined, D-050). Every kind is built from boxes measured in pixels, sixteen to a block like the terrain's
// textures. Each box is unwrapped onto a small texture (the box layout: top and bottom above a strip of the four sides) painted
// from hashed noise per kind and coat, so the animals have the same crisp pixel look as the blocks. Parts hang from pivots,
// so legs, heads, ears, wings and tails can swing. A shader of their own lights them like the world: sky and block light
// where they stand, the lamp, the glow of caves, fog, and a darker shade on the sides and underneath.
//   part: [name, parent, pivot [x,y,z] (from the parent's pivot, or the feet), box [x,y,z,w,h,d] (from the pivot),
//          rest rotation [x,y,z] in radians, options {m: share the texture of another part, only/not: a coat flag,
//          dyn: shown only while a state is on (shorn, pack), head: part of the head (bigger on the young)}]
// Faces of a box on its texture: L (-x), F (+z, the front), R (+x), B (-z), T (top), D (underneath). On a side face s runs left
// to right as seen from outside and t from the top down.
const AM_TEX=128,AM_PX=1/16;
const AM_FACES={L:[-1,0,0],R:[1,0,0],T:[0,1,0],D:[0,-1,0],F:[0,0,1],B:[0,0,-1]};
// the rectangle of one face of a box w x h x d placed at (u,v) on the texture
function amRect(f,u,v,w,h,d){return f==='T'?[u+d,v,w,d]:f==='D'?[u+d+w,v,w,d]:f==='L'?[u,v+d,d,h]:f==='F'?[u+d,v+d,w,h]:f==='R'?[u+d+w,v+d,d,h]:[u+2*d+w,v+d,w,h];}
// a box with its faces mapped onto the texture (24 corners; three.js's own box maps every face to the whole texture)
function amBoxGeo(b,u,v){
  const [x0,y0,z0,w,h,d]=b,x1=x0+w,y1=y0+h,z1=z0+d,pos=[],nor=[],uv=[],idx=[];
  // for each face: four corners in image order (top left, top right, bottom left, bottom right)
  const C={L:[[x0,y1,z0],[x0,y1,z1],[x0,y0,z0],[x0,y0,z1]],F:[[x0,y1,z1],[x1,y1,z1],[x0,y0,z1],[x1,y0,z1]],R:[[x1,y1,z1],[x1,y1,z0],[x1,y0,z1],[x1,y0,z0]],
    B:[[x1,y1,z0],[x0,y1,z0],[x1,y0,z0],[x0,y0,z0]],T:[[x0,y1,z0],[x1,y1,z0],[x0,y1,z1],[x1,y1,z1]],D:[[x0,y0,z1],[x1,y0,z1],[x0,y0,z0],[x1,y0,z0]]};
  for(const f in C){const [ru,rv,rw,rh]=amRect(f,u,v,w,h,d),n=AM_FACES[f],k=pos.length/3;
    const T=[[ru,rv],[ru+rw,rv],[ru,rv+rh],[ru+rw,rv+rh]];
    C[f].forEach((p,i)=>{pos.push(p[0]*AM_PX,p[1]*AM_PX,p[2]*AM_PX);nor.push(n[0],n[1],n[2]);uv.push(T[i][0]/AM_TEX,1-T[i][1]/AM_TEX);});
    idx.push(k,k+2,k+1,k+1,k+2,k+3);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeBoundingSphere();return g;
}
// ---- The kinds. Coats (pal) are per individual; flags: stag (antlers), young.
const AM_KINDS={
  deer:{parts:[
    ['legFL',null,[-2.5,12,5],[-1.5,-12,-1.5,3,12,3]],['legFR',null,[2.5,12,5],[-1.5,-12,-1.5,3,12,3],0,{m:'legFL'}],['legBL',null,[-2.5,12,-5.5],[-1.5,-12,-1.5,3,12,3],0,{m:'legFL'}],['legBR',null,[2.5,12,-5.5],[-1.5,-12,-1.5,3,12,3],0,{m:'legFL'}],
    ['body',null,[0,12,0],[-4,0,-8,8,8,16]],['neck','body',[0,6,6],[-2,-1,-2,4,9,5],[0.55,0,0]],
    ['head','neck',[0,8,0.5],[-2.5,-1,-2.5,5,5,6],[-0.55,0,0],{head:1}],['muzzle','head',[0,0,3.5],[-1.5,-1,0,3,3,3],0,{head:1}],
    ['earL','head',[-2.5,3,-1],[-3,-0.5,-1,3,1,2],[0,0,-0.45],{head:1}],['earR','head',[2.5,3,-1],[0,-0.5,-1,3,1,2],[0,0,0.45],{m:'earL',head:1}],
    ['antL','head',[-1.5,4,-1],[-0.5,0,-0.5,1,7,1],[-0.3,0,-0.35],{only:'stag'}],['tineL1','antL',[0,2,0],[-0.5,0,0,1,1,3],[-0.5,0,0],{only:'stag'}],['tineL2','antL',[0,5,0],[-0.5,0,0,1,1,3],[-0.8,0,0],{only:'stag',m:'tineL1'}],
    ['antR','head',[1.5,4,-1],[-0.5,0,-0.5,1,7,1],[-0.3,0,0.35],{only:'stag',m:'antL'}],['tineR1','antR',[0,2,0],[-0.5,0,0,1,1,3],[-0.5,0,0],{only:'stag',m:'tineL1'}],['tineR2','antR',[0,5,0],[-0.5,0,0,1,1,3],[-0.8,0,0],{only:'stag',m:'tineL1'}],
    ['tail','body',[0,7,-8],[-1.5,-4,-1,3,4,1],[0.25,0,0]]],
    coats:[[{coat:[148,94,56],back:[118,72,42],belly:[226,206,170],rump:[236,226,206],nose:[38,30,28],hoof:[44,38,34],ant:[204,186,150]},3],[{coat:[132,96,66],back:[104,74,50],belly:[214,196,166],rump:[230,220,200],nose:[38,30,28],hoof:[44,38,34],ant:[196,180,146]},2]],
    flags:{stag:0.4},
    paint(P,c,f){P.coat(['body','neck','head','muzzle','legFL','tail','earL'],c.coat,9);P.face('body','T',c.back,8);P.face('neck','B',c.back,8);
      P.belly('body',c.belly,1);P.face('body','B',c.rump,5);P.face('tail','B',c.rump,4);P.face('tail','D',c.rump,4);
      P.rows('muzzle',['F'],0,1,c.nose);P.face('muzzle','D',c.belly,5);P.eyes('head',1,1);P.rows('legFL',['L','F','R','B'],10,12,c.hoof);P.face('legFL','D',c.hoof,3);
      P.face('earL','F',c.belly,5);P.coat(['antL','tineL1'],c.ant,12);
      if(f.young){P.spots('body',['T','L','R'],[240,226,200],0.13,0,5);P.spots('neck',['L','R'],[240,226,200],0.06,0,6);}}},
  rabbit:{parts:[
    ['legBL',null,[-1.5,2.5,-1.5],[-1,-2.5,-2.5,2,3,4]],['legBR',null,[1.5,2.5,-1.5],[-1,-2.5,-2.5,2,3,4],0,{m:'legBL'}],
    ['legFL',null,[-1.5,2,2.5],[-0.5,-2,-0.5,1,2,1]],['legFR',null,[1.5,2,2.5],[-0.5,-2,-0.5,1,2,1],0,{m:'legFL'}],
    ['body',null,[0,2,0],[-2.5,0,-3.5,5,5,7],[-0.1,0,0]],['head','body',[0,4,3],[-2,-1,-0.5,4,4,4],0,{head:1}],
    ['earL','head',[-1,3,0.5],[-0.5,0,-0.5,1,5,2],[-0.25,0,-0.12],{head:1}],['earR','head',[1,3,0.5],[-0.5,0,-0.5,1,5,2],[-0.25,0,0.12],{m:'earL',head:1}],
    ['tail','body',[0,3.5,-3.5],[-1,-1,-2,2,2,2]]],
    coats:[[{coat:[138,114,90],belly:[214,204,190],inner:[206,160,150],nose:[200,140,140]},3],[{coat:[128,124,118],belly:[216,212,206],inner:[204,166,160],nose:[196,140,140]},2],[{coat:[160,132,98],belly:[226,214,196],inner:[210,166,154],nose:[204,144,144]},1]],
    paint(P,c){P.coat(['body','head','legBL','legFL','earL'],c.coat,20);P.belly('body',c.belly,1);P.coat(['tail'],[236,232,226],6);P.face('earL','F',c.inner,6);
      P.rows('head',['F'],2,3,c.belly);P.px('head','F',1,2,c.nose);P.px('head','F',2,2,c.nose);P.eyes('head',1,1);P.face('legBL','D',c.belly,4);}},
  sheep:{parts:[
    ['legFL',null,[-2.5,8,4.5],[-1.5,-8,-1.5,3,8,3]],['legFR',null,[2.5,8,4.5],[-1.5,-8,-1.5,3,8,3],0,{m:'legFL'}],['legBL',null,[-2.5,8,-4.5],[-1.5,-8,-1.5,3,8,3],0,{m:'legFL'}],['legBR',null,[2.5,8,-4.5],[-1.5,-8,-1.5,3,8,3],0,{m:'legFL'}],
    ['cuffFL','legFL',[0,0,0],[-2,-3,-2,4,3,4],0,{dyn:'wool'}],['cuffFR','legFR',[0,0,0],[-2,-3,-2,4,3,4],0,{m:'cuffFL',dyn:'wool'}],['cuffBL','legBL',[0,0,0],[-2,-3,-2,4,3,4],0,{m:'cuffFL',dyn:'wool'}],['cuffBR','legBR',[0,0,0],[-2,-3,-2,4,3,4],0,{m:'cuffFL',dyn:'wool'}],
    ['body',null,[0,8,0],[-4,0,-7,8,7,14]],['wool','body',[0,0,0],[-5,-1,-8,10,9,16],0,{dyn:'wool'}],
    ['head','body',[0,6,7],[-2.5,-3,-1,5,5,6],[0.35,0,0],{head:1}],['cap','head',[0,0,0],[-3,1,-2,6,2,4],0,{dyn:'wool',head:1}],
    ['earL','head',[-2.5,1,1],[-3,-0.5,-1,3,1,2],[0,0,0.35],{head:1}],['earR','head',[2.5,1,1],[0,-0.5,-1,3,1,2],[0,0,-0.35],{m:'earL',head:1}],
    ['tail','body',[0,5,-7],[-1,-4,-1,2,4,2],[0.2,0,0]]],
    coats:[[{wool:[230,226,214],skin:[214,190,174],face:[60,54,52],leg:[72,64,60]},16],[{wool:[118,90,68],skin:[196,170,150],face:[54,44,40],leg:[64,54,48],brown:1},3],[{wool:[54,50,48],skin:[150,130,120],face:[40,36,36],leg:[48,42,40],black:1},1]],
    paint(P,c,f){const w=f.young?[238,234,224]:c.wool;P.wool(['wool','cap','cuffFL','tail'],w);P.coat(['body'],c.skin,8);P.coat(['head','earL','legFL'],f.young?[226,212,196]:c.face,7);
      P.eyes('head',1,1,[20,18,18],[200,190,150]);P.rows('head',['F'],3,5,f.young?[200,180,170]:[40,36,36]);P.rows('legFL',['L','F','R','B'],7,8,[40,36,34]);}},
  goat:{parts:[
    ['legFL',null,[-2.5,10,4.5],[-1,-10,-1,2,10,2]],['legFR',null,[2.5,10,4.5],[-1,-10,-1,2,10,2],0,{m:'legFL'}],['legBL',null,[-2.5,10,-4.5],[-1,-10,-1,2,10,2],0,{m:'legFL'}],['legBR',null,[2.5,10,-4.5],[-1,-10,-1,2,10,2],0,{m:'legFL'}],
    ['body',null,[0,10,0],[-3.5,0,-6.5,7,7,13]],['neck','body',[0,5,5],[-1.5,-1,-1.5,3,6,4],[0.4,0,0]],
    ['head','neck',[0,5,0.5],[-2,-1,-1,4,4,6],[-0.15,0,0],{head:1}],['beard','head',[0,-1,4],[-0.5,-3,-0.5,1,3,1],0,{not:'young',head:1}],
    ['hornL','head',[-1,3,0.5],[-0.5,0,-0.5,1,3,1],[-0.7,0,-0.15],{not:'young',head:1}],['tipL','hornL',[0,3,0],[-0.5,0,-0.5,1,3,1],[-0.9,0,0],{not:'young',m:'hornL',head:1}],
    ['hornR','head',[1,3,0.5],[-0.5,0,-0.5,1,3,1],[-0.7,0,0.15],{not:'young',m:'hornL',head:1}],['tipR','hornR',[0,3,0],[-0.5,0,-0.5,1,3,1],[-0.9,0,0],{not:'young',m:'hornL',head:1}],
    ['earL','head',[-2,2,1],[-3,-0.5,-0.5,3,1,1],[0,0,0.25],{head:1}],['earR','head',[2,2,1],[0,-0.5,-0.5,3,1,1],[0,0,-0.25],{m:'earL',head:1}],
    ['tail','body',[0,6,-6.5],[-1,0,-1,2,3,1],[-0.5,0,0]]],
    coats:[[{coat:[220,216,206],shade:[176,170,160],horn:[140,128,108],hoof:[60,54,50]},3],[{coat:[150,128,104],shade:[96,80,64],horn:[120,110,96],hoof:[50,44,40]},2],[{coat:[96,92,88],shade:[60,58,56],horn:[150,140,120],hoof:[40,36,34]},1]],
    paint(P,c){P.coat(['body','neck','head','earL','tail','beard'],c.coat,10);P.fringe('body',c.shade);P.coat(['legFL'],c.shade,8);P.rows('legFL',['L','F','R','B'],8,10,c.hoof);
      P.coat(['hornL'],c.horn,10);P.eyes('head',1,1,[30,26,20],[196,170,90]);P.rows('head',['F'],2,4,c.shade);}},
  hen:{parts:[
    ['legL',null,[-1,3,0.5],[-0.5,-3,-0.5,1,3,1]],['legR',null,[1,3,0.5],[-0.5,-3,-0.5,1,3,1],0,{m:'legL'}],
    ['footL','legL',[0,-3,0],[-1,0,-1,2,1,3]],['footR','legR',[0,-3,0],[-1,0,-1,2,1,3],0,{m:'footL'}],
    ['body',null,[0,3,0],[-2.5,0,-3,5,5,6],[-0.12,0,0]],['head','body',[0,4,2],[-1.5,0,-1,3,4,3],0,{head:1}],
    ['beak','head',[0,2,2],[-0.5,-0.5,0,1,1,2],0,{head:1}],['comb','head',[0,4,0.5],[-0.5,0,-1,1,2,3],0,{not:'young',head:1}],['wattle','head',[0,1,2],[-0.5,-2,0,1,2,1],0,{not:'young',head:1}],
    ['wingL','body',[-2.5,4,0],[-1,-3,-2.5,1,3,5]],['wingR','body',[2.5,4,0],[0,-3,-2.5,1,3,5],0,{m:'wingL'}],
    ['tail','body',[0,4,-3],[-1.5,0,-2,3,4,2],[-0.5,0,0],{not:'young'}]],
    coats:[[{plume:[156,98,52],dark:[96,58,30],breast:[186,128,70]},3],[{plume:[232,228,216],dark:[196,190,176],breast:[240,236,226]},2],[{plume:[58,56,56],dark:[230,226,220],breast:[70,68,68],speck:1},1]],
    paint(P,c,f){const pl=f.young?[236,210,92]:c.plume;P.coat(['body','head','wingL','tail'],pl,10);if(!f.young){P.spots('body',['T','L','R','B'],c.dark,c.speck?0.25:0.18,0,9);P.spots('wingL',['L','R','T'],c.dark,0.3,0,9);P.face('body','F',c.breast,8);P.coat(['tail'],c.dark,14);}
      P.coat(['beak','legL','footL'],[214,170,58],8);P.coat(['comb','wattle'],[204,40,36],10);P.eyes('head',1,1,[20,18,16]);}},
  boar:{parts:[
    ['legFL',null,[-3,5,5.5],[-1.5,-5,-1.5,3,5,3]],['legFR',null,[3,5,5.5],[-1.5,-5,-1.5,3,5,3],0,{m:'legFL'}],['legBL',null,[-3,5,-5.5],[-1.5,-5,-1.5,3,5,3],0,{m:'legFL'}],['legBR',null,[3,5,-5.5],[-1.5,-5,-1.5,3,5,3],0,{m:'legFL'}],
    ['body',null,[0,5,0],[-4.5,0,-8,9,9,16]],['ridge','body',[0,9,0],[-1,-0.5,-7,2,2,12],0,{not:'young'}],
    ['head','body',[0,5,8],[-3.5,-4,-1,7,7,6],[0.25,0,0],{head:1}],['snout','head',[0,-2.5,5],[-2,-1.5,0,4,3,3],0,{head:1}],
    ['tuskL','snout',[-2,-0.5,2],[-0.5,0,-0.5,1,2,1],[0,0,-0.25],{not:'young',head:1}],['tuskR','snout',[2,-0.5,2],[-0.5,0,-0.5,1,2,1],[0,0,0.25],{not:'young',m:'tuskL',head:1}],
    ['earL','head',[-2.5,3,1.5],[-1,0,-0.5,2,3,1],[-0.3,0,-0.3],{head:1}],['earR','head',[2.5,3,1.5],[-1,0,-0.5,2,3,1],[-0.3,0,0.3],{m:'earL',head:1}],
    ['tail','body',[0,7,-8],[-0.5,-5,-0.5,1,5,1],[0.25,0,0]]],
    coats:[[{coat:[86,66,52],ridge:[46,36,30],snout:[64,50,44],disc:[150,116,106]},3],[{coat:[104,84,68],ridge:[60,46,36],snout:[76,60,50],disc:[160,124,112]},1]],
    paint(P,c,f){P.coat(['body','head','snout','legFL','earL','tail'],c.coat,16);P.coat(['ridge'],c.ridge,12);P.face('body','T',c.ridge,12);P.face('snout','F',c.disc,6);
      P.px('snout','F',1,1,[40,30,28]);P.px('snout','F',2,1,[40,30,28]);P.coat(['tuskL'],[232,224,204],5);P.eyes('head',1,2,[16,12,12]);P.rows('legFL',['L','F','R','B'],4,5,[36,30,28]);
      if(f.young){P.stripes('body',[198,160,110],c.coat);}}},
  horse:{parts:[
    ['legFL',null,[-3,14,7],[-2,-14,-2,4,14,4]],['legFR',null,[3,14,7],[-2,-14,-2,4,14,4]],['legBL',null,[-3,14,-7],[-2,-14,-2,4,14,4]],['legBR',null,[3,14,-7],[-2,-14,-2,4,14,4]],
    ['body',null,[0,14,0],[-5,0,-10,10,10,20]],['neck','body',[0,7,8],[-2,-2,-3,4,11,6],[0.55,0,0]],['mane','neck',[0,0,0],[-1,-1,-4,2,13,2]],
    ['head','neck',[0,9.5,0],[-2.5,-2,-3,5,5,6],[0.6,0,0],{head:1}],['muzzle','head',[0,-1,3],[-2,-1,0,4,4,5],0,{head:1}],
    ['earL','head',[-1.5,3,-1.5],[-0.5,0,-0.5,1,3,1],[-0.15,0,-0.12],{head:1}],['earR','head',[1.5,3,-1.5],[-0.5,0,-0.5,1,3,1],[-0.15,0,0.12],{m:'earL',head:1}],
    ['tail','body',[0,9,-10],[-1.5,-12,-1.5,3,12,3],[0.35,0,0]]],
    coats:[[{coat:[128,72,42],mane:[34,28,26],low:[34,28,26],name:'bay'},3],[{coat:[158,86,46],mane:[176,104,62],low:[150,82,46],name:'chestnut'},2],[{coat:[178,176,172],mane:[96,94,92],low:[120,118,116],dapple:1,name:'grey'},2],
      [{coat:[196,160,104],mane:[58,46,38],low:[58,46,38],stripe:1,name:'dun'},1],[{coat:[48,44,44],mane:[30,28,28],low:[30,28,28],name:'black'},1]],
    paint(P,c,f){P.coat(['body','neck','head','muzzle','earL','legFL','legFR','legBL','legBR'],c.coat,7);P.coat(['mane','tail'],c.mane,16);P.hair('mane');P.hair('tail');
      if(c.dapple)P.spots('body',['T','L','R','B'],[214,212,208],0.22,0,4);if(c.stripe)P.rect('body','T',4,0,2,20,c.mane);
      for(const l of ['legFL','legFR','legBL','legBR']){P.rows(l,['L','F','R','B'],7,14,c.low);P.rows(l,['L','F','R','B'],12,14,[40,34,30]);}
      // white socks and a blaze on some coats (decided by the coat's seed)
      if(P.r()<0.5)for(const l of ['legFL','legBR'])P.rows(l,['L','F','R','B'],8,12,[226,222,214]);
      if(P.r()<0.45){P.rect('head','F',2,0,1,5,[230,226,218]);P.rect('muzzle','T',1,0,2,5,[230,226,218]);P.rect('muzzle','F',1,0,2,2,[230,226,218]);}
      P.rows('muzzle',['F'],2,4,[50,40,38]);P.px('muzzle','F',0,1,[24,20,20]);P.px('muzzle','F',3,1,[24,20,20]);P.eyes('head',2,1,[18,14,14]);}},
  hound:{parts:[
    ['legFL',null,[-1.8,8,4],[-1,-8,-1,2,8,2]],['legFR',null,[1.8,8,4],[-1,-8,-1,2,8,2],0,{m:'legFL'}],['legBL',null,[-1.8,8,-4],[-1,-8,-1,2,8,2],0,{m:'legFL'}],['legBR',null,[1.8,8,-4],[-1,-8,-1,2,8,2],0,{m:'legFL'}],
    ['body',null,[0,8,0],[-3,0,-6,6,6,12]],['head','body',[0,5,6],[-2.5,-1,-1,5,5,5],0,{head:1}],['snout','head',[0,0,4],[-1.5,-1,0,3,2,4],0,{head:1}],
    ['earL','head',[-2.5,3.5,1],[-1,-4,-1,1,4,2],[0,0,0.15],{head:1}],['earR','head',[2.5,3.5,1],[0,-4,-1,1,4,2],[0,0,-0.15],{m:'earL',head:1}],
    ['tail','body',[0,5.5,-6],[-0.5,0,-0.5,1,6,1],[-1.05,0,0]]],
    coats:[[{coat:[176,134,90],saddle:[94,70,50],chest:[226,208,180],nose:[34,28,26]},3],[{coat:[140,136,130],saddle:[104,100,96],chest:[186,182,176],nose:[30,28,28],shag:1},2],[{coat:[52,46,44],saddle:[36,32,30],chest:[176,128,80],nose:[24,20,20],tan:1},2]],
    paint(P,c){P.coat(['body','head','snout','legFL','tail'],c.coat,c.shag?18:9);P.face('body','T',c.saddle,8);P.rows('body',['L','R'],0,3,c.saddle);P.coat(['earL'],c.saddle,8);
      P.belly('body',c.chest,1);P.face('body','F',c.chest,6);P.face('snout','T',c.tan?c.chest:c.coat,6);P.rows('snout',['F'],0,1,c.nose);P.face('snout','D',c.chest,6);
      if(c.tan)P.rows('legFL',['L','F','R','B'],4,8,c.chest);P.eyes('head',1,1,[20,16,14],[150,110,60]);}},
  mule:{parts:[
    ['legFL',null,[-2.5,12,6],[-1.5,-12,-1.5,3,12,3]],['legFR',null,[2.5,12,6],[-1.5,-12,-1.5,3,12,3],0,{m:'legFL'}],['legBL',null,[-2.5,12,-6],[-1.5,-12,-1.5,3,12,3],0,{m:'legFL'}],['legBR',null,[2.5,12,-6],[-1.5,-12,-1.5,3,12,3],0,{m:'legFL'}],
    ['body',null,[0,12,0],[-4.5,0,-8.5,9,9,17]],['neck','body',[0,6,7],[-2,-2,-2.5,4,9,5],[0.6,0,0]],['mane','neck',[0,0,0],[-0.5,0,-3.5,1,9,1]],
    ['head','neck',[0,8,0],[-2.5,-2,-2.5,5,5,5],[0.65,0,0],{head:1}],['muzzle','head',[0,-1,2.5],[-2,-1,0,4,4,4],0,{head:1}],
    ['earL','head',[-1.5,3,-1],[-1,0,-0.5,2,6,1],[-0.2,0,-0.3],{head:1}],['earR','head',[1.5,3,-1],[-1,0,-0.5,2,6,1],[-0.2,0,0.3],{m:'earL',head:1}],
    ['tail','body',[0,8,-8.5],[-0.5,-9,-0.5,1,9,1],[0.25,0,0]],['tuft','tail',[0,-9,0],[-1,-3,-1,2,3,2]],
    ['bagL','body',[-4.5,2,0],[-2,0,-3,2,5,6],0,{dyn:'pack'}],['bagR','body',[4.5,2,0],[0,0,-3,2,5,6],0,{m:'bagL',dyn:'pack'}],['roll','body',[0,9,-1],[-3,0,-3,6,2,5],0,{dyn:'pack'}]],
    coats:[[{coat:[112,96,84],pale:[200,186,168],mane:[52,44,40]},3],[{coat:[86,72,64],pale:[186,170,152],mane:[40,34,30]},2],[{coat:[138,126,116],pale:[214,204,190],mane:[70,62,58]},1]],
    paint(P,c){P.coat(['body','neck','head','muzzle','earL','legFL','tail'],c.coat,9);P.belly('body',c.pale,1);P.face('muzzle','F',c.pale,6);P.face('muzzle','T',c.pale,6);P.face('muzzle','D',c.pale,6);
      P.px('muzzle','F',0,1,[30,24,22]);P.px('muzzle','F',3,1,[30,24,22]);P.coat(['mane','tuft'],c.mane,12);P.hair('mane');P.rect('body','T',4,0,1,17,c.mane);
      P.face('earL','F',c.pale,6);P.rows('earL',['L','F','R','B'],0,1,c.mane);P.rows('legFL',['L','F','R','B'],10,12,[40,34,30]);P.eyes('head',1,1,[18,14,14]);
      P.coat(['bagL','roll'],[124,82,48],10);P.rows('bagL',['L','F','R','B'],1,2,[70,46,26]);P.rows('roll',['L','R'],0,2,[150,130,96]);}}
};
// ---- The texture of one coat: parts packed onto a 128 x 128 canvas (shelf packing), each face filled by the kind's paint
function amLayout(K){
  if(K.uv)return K.uv;const keys=[];for(const p of K.parts){const o=p[5]||{};if(!o.m&&!keys.some(k=>k[0]===p[0]))keys.push([p[0],p[3]]);}
  const sz=keys.map(([n,b])=>[n,2*(b[3]+b[5]),b[5]+b[4],b]).sort((a,b)=>b[2]-a[2]);
  const uv={};let x=0,y=0,rowH=0;for(const [n,w,h,b] of sz){if(x+w>AM_TEX){x=0;y+=rowH+1;rowH=0;}if(y+h>AM_TEX)throw new Error('animal texture overflow '+n);uv[n]=[x,y,b];x+=w+1;rowH=Math.max(rowH,h);} // a pixel apart
  return K.uv=uv;
}
const amTexC=new Map();
function amHash(x,y,s){let h=(x*374761393+y*668265263+s*1442695041)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;}
function amTexture(kind,ci,flags){
  const key=kind+':'+ci+':'+(flags.young?1:0)+(flags.stag?1:0);if(amTexC.has(key))return amTexC.get(key);
  const K=AM_KINDS[kind],uv=amLayout(K),c=K.coats[ci][0],cv=document.createElement('canvas');cv.width=cv.height=AM_TEX;
  const g=cv.getContext('2d'),img=g.createImageData(AM_TEX,AM_TEX),D=img.data;let seed=1+ci*977+kind.length*131,rs=seed;
  const cl=v=>v<0?0:v>255?255:v|0,set=(x,y,col,a)=>{if(x<0||y<0||x>=AM_TEX||y>=AM_TEX)return;const i=(y*AM_TEX+x)*4;D[i]=cl(col[0]);D[i+1]=cl(col[1]);D[i+2]=cl(col[2]);D[i+3]=a===undefined?255:a;};
  const src=n=>{const p=K.parts.find(q=>q[0]===n);const o=p&&p[5]||{};return o.m||n;};
  const rect=(n,f)=>{const u=uv[src(n)];if(!u)return null;const b=u[2];return amRect(f,u[0],u[1],b[3],b[4],b[5]);};
  const noisy=(col,amt,x,y)=>{const v=(amHash(x,y,seed)-0.5)*2*amt;return [col[0]+v,col[1]+v,col[2]+v];};
  const P={
    r:()=>{rs=(rs*16807)%2147483647;return rs/2147483647;},
    face(n,f,col,amt){const R=rect(n,f);if(!R)return;for(let t=0;t<R[3];t++)for(let s=0;s<R[2];s++)set(R[0]+s,R[1]+t,noisy(col,amt||0,R[0]+s,R[1]+t));},
    // every face of these parts in one colour with noise, the sides a little darker toward the bottom
    coat(ns,col,amt){for(const n of ns)for(const f in AM_FACES){const R=rect(n,f);if(!R)continue;for(let t=0;t<R[3];t++)for(let s=0;s<R[2];s++){const k=(f==='T'||f==='D')?0:-(t/Math.max(1,R[3]))*10;set(R[0]+s,R[1]+t,noisy([col[0]+k,col[1]+k,col[2]+k],amt,R[0]+s,R[1]+t));}}},
    // the underside, and the lowest rows of the sides, in the belly colour
    belly(n,col,rows){P.face(n,'D',col,5);for(const f of ['L','R','F','B']){const R=rect(n,f);if(!R)continue;for(let s=0;s<R[2];s++){const r=rows+(amHash(R[0]+s,R[1],seed+31)<0.5?0:1);for(let t=R[3]-r;t<R[3];t++){const i=((R[1]+t)*AM_TEX+R[0]+s)*4,k=(t-(R[3]-r)+1)/(r+1)*0.8;
      set(R[0]+s,R[1]+t,noisy([D[i]+(col[0]-D[i])*k,D[i+1]+(col[1]-D[i+1])*k,D[i+2]+(col[2]-D[i+2])*k],4,R[0]+s,R[1]+t));}}}},
    rows(n,fs,t0,t1,col){for(const f of fs){const R=rect(n,f);if(!R)continue;for(let t=Math.max(0,t0);t<Math.min(R[3],t1);t++)for(let s=0;s<R[2];s++)set(R[0]+s,R[1]+t,noisy(col,6,R[0]+s,R[1]+t));}},
    rect(n,f,s0,t0,w,h,col){const R=rect(n,f);if(!R)return;for(let t=t0;t<Math.min(R[3],t0+h);t++)for(let s=s0;s<Math.min(R[2],s0+w);s++)set(R[0]+s,R[1]+t,noisy(col,5,R[0]+s,R[1]+t));},
    px(n,f,s,t,col){const R=rect(n,f);if(R&&s<R[2]&&t<R[3])set(R[0]+s,R[1]+t,col);},
    spots(n,fs,col,dens,t0,t1){for(const f of fs){const R=rect(n,f);if(!R)continue;for(let t=t0||0;t<Math.min(R[3],t1||R[3]);t++)for(let s=0;s<R[2];s++)if(amHash(R[0]+s,R[1]+t,seed+77)<dens)set(R[0]+s,R[1]+t,noisy(col,8,R[0]+s,R[1]+t));}},
    // eyes on both sides of the head: a dark pupil `fromFront` pixels behind the front, `row` pixels down, with a light glint
    eyes(n,fromFront,row,col,ring){const L=rect(n,'L'),R=rect(n,'R');if(!L)return;const e=col||[22,18,16];
      set(L[0]+L[2]-1-fromFront,L[1]+row,e);set(R[0]+fromFront,R[1]+row,e);if(ring){set(L[0]+L[2]-2-fromFront,L[1]+row,ring);set(R[0]+fromFront+1,R[1]+row,ring);}},
    // wool: soft curls of light and shade
    wool(ns,col){for(const n of ns)for(const f in AM_FACES){const R=rect(n,f);if(!R)continue;for(let t=0;t<R[3];t++)for(let s=0;s<R[2];s++){const x=R[0]+s,y=R[1]+t,c1=amHash(x>>1,y>>1,seed+5),c2=amHash(x,y,seed+9);
      const k=(c1<0.3?-16:c1>0.75?10:0)+(c2-0.5)*10-(f==='D'?18:0);set(x,y,[col[0]+k,col[1]+k,col[2]+k]);}}},
    // hair: streaks down the length
    hair(n){for(const f in AM_FACES){const R=rect(n,f);if(!R)continue;for(let s=0;s<R[2];s++){const k=(amHash(R[0]+s,0,seed+13)-0.5)*30;for(let t=0;t<R[3];t++){const i=((R[1]+t)*AM_TEX+R[0]+s)*4;D[i]=cl(D[i]+k);D[i+1]=cl(D[i+1]+k);D[i+2]=cl(D[i+2]+k);}}}},
    // a ragged darker fringe along the bottom of the sides (a shaggy coat)
    fringe(n,col){for(const f of ['L','R','F','B']){const R=rect(n,f);if(!R)continue;for(let s=0;s<R[2];s++){const h=1+Math.floor(amHash(R[0]+s,R[1],seed+21)*3);for(let t=R[3]-h;t<R[3];t++)set(R[0]+s,R[1]+t,noisy(col,6,R[0]+s,R[1]+t));}}},
    // stripes along the body (wild piglets)
    stripes(n,col,base){for(const f of ['L','R','T']){const R=rect(n,f);if(!R)continue;for(let t=0;t<R[3];t++)for(let s=0;s<R[2];s++)if(((f==='T'?s:t)>>1)%2===0)set(R[0]+s,R[1]+t,noisy(col,10,R[0]+s,R[1]+t));}}
  };
  K.paint(P,c,flags);
  // fill what the paint left (shared faces never left empty), then a one-pixel darker rim on every face so edges read
  for(const n in uv){for(const f in AM_FACES){const R=amRect(f,uv[n][0],uv[n][1],uv[n][2][3],uv[n][2][4],uv[n][2][5]);
    for(let t=0;t<R[3];t++)for(let s=0;s<R[2];s++){const i=((R[1]+t)*AM_TEX+R[0]+s)*4;if(!D[i+3]){D[i]=128;D[i+1]=110;D[i+2]=96;D[i+3]=255;}}}}
  g.putImageData(img,0,0);const tx=new THREE.CanvasTexture(cv);tx.amData=D;tx.magFilter=THREE.NearestFilter;tx.minFilter=THREE.NearestFilter;tx.generateMipmaps=false;tx.anisotropy=1; // no mipmaps: a coat never bleeds into the part beside it
  amTexC.set(key,tx);return tx;
}
// ---- The shader: the world's light where the animal stands (eL sky, eB block light, updated a few times a second), the lamp
// and the cave glow as the terrain has them, a darker shade on sides and underneath, a red flash when struck, and the fog
const AM_VS='varying vec2 vUv;varying float vD;varying vec3 vN;void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);vec4 mv=modelViewMatrix*vec4(position,1.0);vD=length(mv.xyz);gl_Position=projectionMatrix*mv;}';
const AM_FS='uniform sampler2D map;uniform vec3 fogColor;uniform float fogNear;uniform float fogFar;uniform float lamp;uniform float lampR;uniform float skyMul;uniform vec3 skyTint;uniform float caveMin;uniform vec3 caveTint;'+
  'uniform float eL;uniform float eB;uniform float hurt;uniform float fade;varying vec2 vUv;varying float vD;varying vec3 vN;'+
  'void main(){vec4 t=texture2D(map,vUv);if(t.a<0.5)discard;float side=0.7+0.16*abs(vN.z);float sh=vN.y>=0.0?mix(side,1.0,vN.y):mix(side,0.52,-vN.y);'+
  'float lm=lamp*(1.0-smoothstep(3.0,lampR,vD));vec3 l=max(max(vec3(eL*skyMul)*skyTint,vec3(lm)*vec3(1.0,0.93,0.82)),max(vec3(1.0,0.8,0.55)*eB,caveTint*caveMin));'+
  'vec3 c=t.rgb*l*sh;c=mix(c,vec3(0.85,0.12,0.08)*max(0.35,l.r),hurt*0.55);float f=smoothstep(fogNear,fogFar,vD);gl_FragColor=vec4(mix(c,fogColor,f),fade);}';
function amMaterial(tex){
  return new THREE.ShaderMaterial({uniforms:{map:{value:tex},fogColor:U.fogColor,fogNear:U.fogNear,fogFar:U.fogFar,lamp:U.lamp,lampR:U.lampR,skyMul:U.skyMul,skyTint:U.skyTint,caveMin:U.caveMin,caveTint:U.caveTint,
    eL:{value:1},eB:{value:0},hurt:{value:0},fade:{value:1}},vertexShader:AM_VS,fragmentShader:AM_FS});
}
// ---- One animal's model: a root at its feet, the parts as groups at their pivots, a soft shadow beneath
const amGeoC=new Map();
let amShadowTex=null;
function amShadowMat(){
  if(!amShadowTex){const cv=document.createElement('canvas');cv.width=cv.height=32;const g=cv.getContext('2d'),gr=g.createRadialGradient(16,16,2,16,16,16);gr.addColorStop(0,'rgba(0,0,0,0.85)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);amShadowTex=new THREE.CanvasTexture(cv);}
  return new THREE.MeshBasicMaterial({map:amShadowTex,transparent:true,depthWrite:false,opacity:0.35,color:0x000000,polygonOffset:true,polygonOffsetFactor:-2});
}
const amShadowGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2);
function amBuild(kind,ci,flags){
  const K=AM_KINDS[kind],uv=amLayout(K),mat=amMaterial(amTexture(kind,ci,flags)),root=new THREE.Group(),parts={},dyn=[];
  for(const [n,par,piv,b,rot,o0] of K.parts){const o=o0||{};if(o.only&&!flags[o.only])continue;if(o.not&&flags[o.not])continue;
    const gk=kind+':'+n,u=uv[o.m||n];let geo=amGeoC.get(gk);if(!geo){geo=amBoxGeo(b,u[0],u[1]);amGeoC.set(gk,geo);}
    const grp=new THREE.Group();grp.position.x=piv[0]*AM_PX;grp.position.y=piv[1]*AM_PX;grp.position.z=piv[2]*AM_PX;const r=rot||[0,0,0];grp.rotation.x=r[0];grp.rotation.y=r[1];grp.rotation.z=r[2];grp.userData.rest=r.slice();
    const m=new THREE.Mesh(geo,mat);m.frustumCulled=false;grp.add(m);(par&&parts[par]?parts[par]:root).add(grp);parts[n]=grp;if(o.dyn)dyn.push([grp,o.dyn]);}
  // the young: smaller, with a bigger head (the head's own root grows; what hangs from it grows with it)
  const sc=flags.young?0.58:1;root.scale.setScalar(sc);const big={};
  if(flags.young)for(const p of K.parts){const o=p[5]||{};if(!o.head||!parts[p[0]])continue;const par=K.parts.find(q=>q[0]===p[1]);if(par&&(par[5]||{}).head)continue;parts[p[0]].scale.setScalar(1.3);big[p[0]]=1;}
  const body=new THREE.Group();body.add(root);
  const shadow=new THREE.Mesh(amShadowGeo,amShadowMat());shadow.renderOrder=1;
  // its bounds at rest, in blocks around its feet facing +z: for aiming, pushing and the shadow's size
  const bx=amBounds(K,flags,sc,big);
  return {grp:body,root:root,parts:parts,mat:mat,dyn:dyn,shadow:shadow,box:bx,sc:sc};
}
// The bounds of a model at rest: every box's corners carried through its parts' pivots and rotations (x, then y, then z, as
// three.js turns them), ears, horns, antlers, tails and packs left out
function amBounds(K,flags,sc,big){
  const rotP=(v,r)=>{let [x,y,z]=v;let c=Math.cos(r[0]),s=Math.sin(r[0]);[y,z]=[y*c-z*s,y*s+z*c];c=Math.cos(r[1]);s=Math.sin(r[1]);[x,z]=[x*c+z*s,-x*s+z*c];c=Math.cos(r[2]);s=Math.sin(r[2]);[x,y]=[x*c-y*s,x*s+y*c];return [x,y,z];};
  const chain=n=>{const out=[];let p=K.parts.find(q=>q[0]===n);while(p){out.push(p);p=p[1]?K.parts.find(q=>q[0]===p[1]):null;}return out;};
  const lo=[1e9,1e9,1e9],hi=[-1e9,-1e9,-1e9];
  for(const p of K.parts){const o=p[5]||{};if(o.only&&!flags[o.only])continue;if(o.not&&flags[o.not])continue;if(o.dyn==='pack'||/^ear|^horn|^tip|^ant|^tine|^tail|^tuft|^comb|^tusk/.test(p[0]))continue;
    const b=p[3],ch=chain(p[0]);
    for(let i=0;i<8;i++){let v=[b[0]+(i&1?b[3]:0),b[1]+(i&2?b[4]:0),b[2]+(i&4?b[5]:0)];
      for(const q of ch){if(big[q[0]])v=v.map(t=>t*1.3);v=rotP(v,q[4]||[0,0,0]);v=[v[0]+q[2][0],v[1]+q[2][1],v[2]+q[2][2]];}
      for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],v[k]);hi[k]=Math.max(hi[k],v[k]);}}}
  const f=AM_PX*sc;return [lo[0]*f,Math.max(0,lo[1]*f),lo[2]*f,hi[0]*f,hi[1]*f,hi[2]*f];
}
// choose a coat by weight
function amCoat(kind,q){const C=AM_KINDS[kind].coats;let t=0;for(const c of C)t+=c[1];let v=q*t;for(let i=0;i<C.length;i++){v-=C[i][1];if(v<=0)return i;}return 0;}
