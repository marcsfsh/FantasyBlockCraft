// ---- The Emberlords remade (W7a, D-074; Q179, Q181, Q183): one kind, each lord its own. Every lord is about twenty blocks tall
// (the scale of the D-055 model grown from about twelve; every part a whole number of texels across, or its paint lands in the
// wrong channels), in one of three builds: the swept horns and the burning great sword
// (`ember`), horns that curl back like a ram's and a great axe (`ember2`), or a crown of spikes and a broad cleaver (`ember3`);
// and in one of four fires: the burning (orange), the white flame, the crimson, the deep-fire (violet, the fire of what lies in
// the lava sea). And the creatures it calls out of the fire: fire spirits (a burning core in a sheath of flame, drifting over the
// ground), flame hounds (black hounds with burning manes) and lesser demons (horned and winged, half the height of a troll's
// shoulder again, with a jagged blade).
(function(){
  const E=AM_KINDS.ember,F=MODEL_KIT.foe;E.scale=7.4;
  const FIRES=[null,
    {hide:[44,40,40],dark:[22,20,20],fire:[255,220,140],hot:[255,250,220],white:[255,255,240],bone:[58,52,48],ivory:[224,216,196],memb:[60,46,40],eye:[255,255,236],rib:[230,180,110],edge:[255,214,130],
      fl:[[255,252,226],[255,230,160],[250,196,96],[220,140,56]],skull:[38,34,32],whip:[255,214,140],blade:[255,240,190]},
    {hide:[30,10,10],dark:[14,6,6],fire:[232,44,24],hot:[255,128,80],white:[255,200,170],bone:[48,22,20],ivory:[200,170,150],memb:[72,10,10],eye:[255,170,130],rib:[190,30,20],edge:[236,44,30],
      fl:[[255,150,100],[238,76,44],[204,34,22],[136,14,12]],skull:[24,8,8],whip:[240,50,30],blade:[255,110,70]},
    {hide:[24,18,32],dark:[12,9,18],fire:[190,96,255],hot:[236,196,255],white:[246,232,255],bone:[40,32,52],ivory:[196,186,214],memb:[44,22,64],eye:[240,214,255],rib:[150,70,220],edge:[200,116,255],
      fl:[[242,206,255],[204,136,255],[152,84,232],[92,42,172]],skull:[20,14,28],whip:[196,110,255],blade:[220,170,255]}];
  for(let k=1;k<FIRES.length;k++)E.coats.push([FIRES[k],1]);
  const swap=(ps,ch)=>ps.map(p=>ch[p[0]]?ch[p[0]](p.slice()):p);
  // the ram: the horns run out to the side and curl back, down and forward under themselves; a great axe, its haft long and dark,
  // its head a broad burning crescent
  const ram={hornL:p=>(p[4]=[-0.55,0,1.4],p),tipL:p=>(p[4]=[-1.35,0,0.25],p),tip2L:p=>(p[4]=[-1.25,0,0.35],p),
    hornR:p=>(p[4]=[-0.55,0,-1.4],p),tipR:p=>(p[4]=[-1.35,0,-0.25],p),tip2R:p=>(p[4]=[-1.25,0,-0.35],p),
    wpn:p=>(p[3]=[-1,-1,-6,2,2,36],p[5]=Object.assign({},p[5],{tp:null}),p)};
  // the crown: short horns swept up, and a ring of spikes round the brow; a cleaver, broad and flat, notched along its back
  const crown={hornL:p=>(p[3]=[-1.5,0,-1.5,3,6,3],p[4]=[-0.2,0,0.55],p),tipL:p=>(p[3]=[-1,0,-1,2,5,2],p[2]=[0,6,0],p[4]=[-0.3,0,-0.2],p),tip2L:p=>(p[3]=[-0.5,0,-0.5,1,3,1],p[2]=[0,5,0],p),
    hornR:p=>(p[3]=[-1.5,0,-1.5,3,6,3],p[4]=[-0.2,0,-0.55],p),tipR:p=>(p[3]=[-1,0,-1,2,5,2],p[2]=[0,6,0],p[4]=[-0.3,0,0.2],p),tip2R:p=>(p[3]=[-0.5,0,-0.5,1,3,1],p[2]=[0,5,0],p),
    wpn:p=>(p[3]=[-1,-5,-3,2,10,30],p[5]=Object.assign({},p[5],{tp:['z',0.8,0.9,0,1]}),p)};
  const axeParts=[['haftC','wpn',[0,0,-6],[-1.5,-1.5,-2,3,3,3],0,{nb:1}],['axe','wpn',[0,0,26],[-1,-10,-4,2,10,8],0,{nb:1,tp:['-y',0.6,1.5,0,0]}],
    ['axeB','wpn',[0,0,26],[-1,0,-2,2,3,4],0,{nb:1,tp:['y',0.5,0.4,0,0]}]];
  const crownParts=[0,1,2,3,4].map(i=>{const a=(i-2)*0.5;return ['crn'+i,'head',[Math.sin(a)*3.4,2.8,1+Math.cos(a)*2.2],[-1,0,-1,2,5-Math.abs(i-2),2],[-0.35,0,-a*0.5],Object.assign({head:1,tp:['y',0,0,0,0]},i?{m:'crn0'}:{})];});
  const base=E.paint;
  Object.assign(AM_KINDS,{
    ember2:{scale:E.scale,tex:256,parts:swap(E.parts,ram).filter(p=>p[0]!=='guard').concat(axeParts),coats:E.coats,
      paint(P,c){base(P,c);P.coat(['wpn'],[40,30,26],8);P.rows('wpn',['L','R','T','D'],0,36,[40,30,26]);P.coat(['haftC'],[24,20,20],4);P.glowFaces(['axe'],c.blade);P.spots('axe',['L','R'],c.white,0.2);
        P.rows('axe',['L','R'],0,3,[34,26,24]);P.coat(['axeB'],[34,26,24],6);P.glowRect('axeB','L',1,1,2,2,c.fire);P.coat(['hornL'],[86,70,58],10);P.coat(['tipL'],[60,48,42],8);}},
    ember3:{scale:E.scale,tex:256,parts:swap(E.parts,crown).concat(crownParts),coats:E.coats,
      paint(P,c){base(P,c);P.rect('wpn','L',0,0,30,2,[34,26,24]);P.rect('wpn','R',0,0,30,2,[34,26,24]);for(let k=4;k<28;k+=5){P.rect('wpn','L',k,0,1,3,[20,16,16]);P.rect('wpn','R',k,0,1,3,[20,16,16]);}
        P.coat(['crn0'],[40,30,28],6);P.rows('crn0',['L','F','R','B'],0,2,c.fire);P.glow('crn0','F',0,0,c.hot);}},
    // a fire spirit: a burning core and head in crossed sheets of flame, wisps for arms, a tail of fire beneath it; it drifts a
    // little over the ground
    fspirit:{scale:1.3,tex:128,parts:[['body',null,[0,20,0],[-3,-5,-3,6,10,6],0,{tp:['-y',0.4,0.4,0,0]}],['head','body',[0,5,0],[-2.5,0,-2.5,5,5,5],0,{head:1,tp:['y',0.7,0.7,0,0]}],
        ['flA','body',[0,-8,0],[-7,0,-0.5,14,22,1],0,{nb:1}],['flB','body',[0,-8,0],[-0.5,0,-7,1,22,14],0,{nb:1}],
        ['armL','body',[-3.5,3,0],[-1,-7,-1,2,7,2],[0,0,0.3],{tp:['-y',0.2,0.2,0,0]}],['armR','body',[3.5,3,0],[-1,-7,-1,2,7,2],[0,0,-0.3],{m:'armL',tp:['-y',0.2,0.2,0,0]}],
        ['wisp','body',[0,-5,0],[-1.5,-9,-1.5,3,9,3],0,{nb:1,tp:['-y',0,0,0,0]}]],
      coats:[[{core:[255,214,120],hot:[255,250,220],fl:[[255,236,170],[255,180,70],[240,110,30],[190,50,18]]},3],[{core:[255,170,90],hot:[255,230,190],fl:[[255,200,140],[250,130,60],[220,70,30],[150,30,16]]},2]],
      paint(P,c){P.glowFaces(['body','armL','wisp'],c.core);P.glowFaces(['head'],c.hot);P.glowEyes('head',2,2,[255,255,255]);
        const flame=salt=>(a,b)=>{const h=22,top=h*(0.4+0.6*Math.abs(Math.sin(a*0.9+salt)));const up=h-1-b;if(up>top)return 'cut';const q=up/top,L=c.fl[q<0.25?0:q<0.55?1:q<0.8?2:3];return [L[0],L[1],L[2],200];};
        P.sheet('flA','z',flame(1.1));P.sheet('flB','x',flame(2.7));}},
    // a flame hound: a lean black hound, cracked with fire, a mane of flame down its back, burning eyes and a burning tail
    fhound:{scale:1.25,tex:128,parts:[['legL',null,[-2.5,10,-6],[-1.5,-10,-1.5,3,10,3],0,{tp:['-y',0.7,0.7,0,0.3]}],['legR',null,[2.5,10,-6],[-1.5,-10,-1.5,3,10,3],0,{m:'legL',tp:['-y',0.7,0.7,0,0.3]}],
        ['body',null,[0,10,0],[-4,-1,-9,8,8,18],0,{tp:['z',1.1,1.15,0,0.5]}],['armL','body',[-2.5,1,7],[-1.5,-11,-1.5,3,11,3],0,{tp:['-y',0.7,0.7,0,0.3]}],['armR','body',[2.5,1,7],[-1.5,-11,-1.5,3,11,3],0,{m:'armL',tp:['-y',0.7,0.7,0,0.3]}],
        ['head','body',[0,5,9],[-3,-3,0,6,6,6],[0.15,0,0],{head:1}],['snout','head',[0,-1.5,6],[-2,-1.5,0,4,3,4],0,{head:1,tp:['z',0.8,0.7,0,-0.3]}],
        ['earL','head',[-2,3,1.5],[-1,0,-1,2,3,2],[-0.3,0,0.3],{head:1,tp:['y',0,0,0,0]}],['earR','head',[2,3,1.5],[-1,0,-1,2,3,2],[-0.3,0,-0.3],{head:1,m:'earL',tp:['y',0,0,0,0]}],
        ['mane','body',[0,6,0],[-0.5,0,-8,1,7,16],0,{nb:1}],['tail','body',[0,5,-9],[-1,-1,-9,2,2,9],[-0.6,0,0],{nb:1,tp:['-z',0.4,0.4,0,0]}],['tailF','tail',[0,0,-9],[-0.5,0,-3,1,6,6],0,{nb:1}]],
      coats:[[{hide:[26,22,22],fire:[255,130,30],eye:[255,220,120],fl:[[255,214,120],[255,150,44],[230,80,24],[170,34,16]]},3],[{hide:[40,30,28],fire:[255,100,30],eye:[255,180,90],fl:[[255,190,110],[250,120,40],[210,60,22],[140,24,14]]},1]],
      paint(P,c){P.coat(['body','head','snout','legL','armL','earL','tail'],c.hide,10);P.cracks(['body','legL','armL','head'],c.fire,0.03);P.glowEyes('head',2,2,c.eye);P.rows('snout',['F'],1,3,[16,12,12]);
        P.glowRect('snout','D',1,1,2,2,c.fire);const flame=(h,salt)=>(a,b)=>{const top=h*(0.35+0.65*Math.abs(Math.sin(a*0.8+salt)));const up=h-1-b;if(up>top)return 'cut';const q=up/top,L=c.fl[q<0.3?0:q<0.6?1:q<0.85?2:3];return [L[0],L[1],L[2],200];};
        P.sheet('mane','x',flame(7,1.9));P.sheet('tailF','x',flame(6,0.4));}},
    // a lesser demon: hunched and horned, small wings of torn membrane, a tail, cracked with fire, a jagged blade
    ldemon:{scale:2.3,tex:128,parts:[...F.legs(12,3,3,2.4),['body',null,[0,12,0],[-5,0,-3,10,12,6],[0.3,0,0],{tp:['y',1.3,1,0,-0.5]}],['head','body',[0,12,1.5],[-3,0,-3,6,6,6],[-0.3,0,0],{head:1,tp:['z',0.8,0.8,0,-0.4]}],
        ['jaw','head',[0,0,0],[-2.5,-1.5,0,5,2,5],[0.2,0,0],{head:1}],['hornL','head',[-2.5,5,0],[-1,0,-1,2,6,2],[-0.5,0,0.6],{head:1,tp:['y',0,0,0,0]}],['hornR','head',[2.5,5,0],[-1,0,-1,2,6,2],[-0.5,0,-0.6],{head:1,m:'hornL',tp:['y',0,0,0,0]}],
        ...F.arms(5,11,0,3,12,3),['wingL','body',[-3,10,-3],[-13,-10,-0.5,13,13,1],[-0.4,-0.5,-0.3],{nb:1}],['wingR','body',[3,10,-3],[0,-10,-0.5,13,13,1],[-0.4,0.5,0.3],{nb:1}],
        ['tail','body',[0,1,-3],[-1,-1,-11,2,2,11],[-0.7,0,0],{nb:1,tp:['-z',0.3,0.3,0,0]}],['wpn','armR',[1.5,-11,0],[-0.5,-1.5,-1,1,3,13],[0.5,0,0],{nb:1,tp:['z',0.6,0.3,0,0]}]],
      coats:[[{hide:[40,24,22],fire:[255,120,30],eye:[255,214,110],memb:[70,22,18]},3],[{hide:[50,40,36],fire:[255,90,26],eye:[255,170,80],memb:[60,30,24]},2]],
      paint(P,c){P.coat(['body','head','jaw','legL','armL','tail'],c.hide,12);P.cracks(['body','legL','armL'],c.fire,0.04);P.glowRect('body','F',4,5,2,4,c.fire);P.glowEyes('head',2,3,c.eye);P.glowRect('jaw','F',1,0,3,1,c.fire);
        P.coat(['hornL'],[60,48,42],8);P.glowFaces(['wpn'],[255,150,50]);P.rows('wpn',['L','R'],0,1,[34,26,24]);
        const memb=(a,b)=>{const lim=12-Math.abs(Math.sin(a*0.7))*5;if(b>lim)return 'cut';if(b>lim-1)return [c.fire[0],c.fire[1]*0.6,c.fire[2],200];return [c.memb[0]-b*1.5,c.memb[1],c.memb[2]];};
        P.sheet('wingL','z',memb);P.sheet('wingR','z',(a,b)=>memb(12-a,b));}}
  });
})();
