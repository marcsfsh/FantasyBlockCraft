// ---- The folk of the high elves (D-062), built and painted like the other folk (FOLK_KIT): boxes measured in pixels, two texels
// to a pixel, a little taller than men (scale 1.08), with pointed ears and long hair, beardless.
// Their warriors go in gilded armour of overlapping leaf-shaped scales over long robes of deep wine red: a high collar, layered
// pauldrons like leaves, a skirt of pointed lames, vambraces and greaves with a raised rib; close helms with cheek guards swept
// forward and a tall blade of a crest rising toward the back. Spearwardens carry glaives with long curved blades on dark shafts
// bound in gold; bladewardens long curved swords and tall shields shaped like a leaf, a gold midrib down them and the elves'
// star above; archers tall bows with recurved tips and quivers of white-fletched arrows, a long cloak; lord-captains armour more
// richly worked under a blue cloak with the star; knights ride horses in long blue caparisons with a gilded chanfron, a lance with
// a long pennon. The folk of their cities: lords in long robes with hanging sleeves and borders of gold vines, a circlet with a
// stone; ladies in flowing gowns with trailing sleeves, girdles of gold and circlets with a pendant gem, their hair to the waist;
// loremasters in hooded robes with an embroidered stole, a book in hand; smiths in fine tunics under a gold-trimmed apron.
(function(){
  const {SK,ALL,SIDE,sh,hz,man,cloth,mail,plate,leather,band,rivets,boots,hands,face,STEEL,SILVER}=FOLK_KIT;
  const GOLD=[224,188,98],WINE=[112,28,40],BLUE=[30,48,96],WHITE=[236,236,240];
  const ESKIN=[[236,214,194],[226,200,176],[214,184,156],[240,222,206]],EHAIR=[[34,28,30],[226,204,150],[200,202,206],[112,70,40],[20,18,22],[236,222,180]];
  const coats=b=>ESKIN.map((s,i)=>[{skin:s,hair:EHAIR[(i*2+b)%EHAIR.length],eye:[[90,120,150],[110,124,136],[96,130,110]][(i+b)%3]},i===3?1:2]);
  // the elves' sign: a star of six rays, the upright ray longest, over two leaves swept up and out (16 by 14 texels)
  const SIGN=(x,y)=>{const cx=x-7.5,cy=y-5,ang=Math.atan2(cy,cx),r=Math.hypot(cx,cy),k=Math.abs(Math.cos(ang*3));if(r<(Math.abs(cx)<0.6?5.5:k>0.97?4:1.3))return 1;
    if(y>=9&&y<=13&&((x>=2&&x<=6&&Math.abs(y-(13-(6-x)*0.8))<0.8)||(x>=9&&x<=13&&Math.abs(y-(13-(x-9)*0.8))<0.8)))return 2;return 0;};
  const sign=(P,n,f,s0,t0,c1,c2)=>P.map(n,[f],(s,t)=>{const q=SIGN(s-s0,t-t0);return q===1?sh(c1,hz(s,t,501)*6):q===2?sh(c2,hz(s,t,503)*6):null;});
  // gilded leaf-scales: rows of pointed scales, each lit at its head and shadowed at its edges, every other row offset
  const scales=(P,ns,col)=>{for(const n of ns)P.map(n,ALL,(s,t,w,h,f)=>{if(f==='T')return sh(col,14);if(f==='D')return sh(col,-36);
    const r=t%4,c=(s+((t>>2)%2)*2)%4,inn=Math.abs(c-1.5)<=(r<2?2:3.6-r);return inn?sh(col,(r===0?20:r===1?8:-6)+(c===0?6:0)+hz(s,t,505)*6-t/h*8):sh([120,84,40],hz(s,t,507)*8);});};
  // pointed lames hanging side by side, each with a raised rib
  const lames=(P,ns,col)=>{for(const n of ns)P.map(n,ALL,(s,t,w,h,f)=>{if(f==='T'||f==='D')return sh(col,f==='T'?10:-30);const c=s%3,tip=t>=h-2&&c!==1&&t===h-1;
    return tip?[0,0,0,1]:sh(col,(c===1?18:c===0?-14:0)+(t===0?16:0)+hz(s,t,509)*6);});};
  // a vine of gold worked along a band of rows
  const vine=(P,n,fs,t0,t1,col,ground)=>P.map(n,fs,(s,t)=>{if(t<t0||t>=t1)return null;const m=(t1-t0-1)/2,wv=t0+m+Math.sin(s*0.9)*m*0.8,on=Math.abs(t-wv)<0.7||(s%5===2&&Math.abs(t-(wv+(s%10<5?-1:1)))<0.8);
    return on?sh(col,hz(s,t,511)*8):sh(ground,-16+hz(s,t,513)*6);});
  const ears=()=>[['earL','head',[-3,3.2,0.5],[-0.5,0,-0.5,1,3,1.5],[-0.35,0,0.45],{head:1,nb:1,tp:['y',1,0.2,0,-0.5]}],['earR','head',[3,3.2,0.5],[-0.5,0,-0.5,1,3,1.5],[-0.35,0,-0.45],{head:1,nb:1,m:'earL',tp:['y',1,0.2,0,-0.5]}]];
  const hairB=(len)=>[['hairB','head',[0,1,-3],[-3,-len,-1,6,len+5,1],0,{head:1,nb:1}]];
  const elfFace=(P,c,o)=>{face(P,c,Object.assign({long:1},o||{}));P.map('earL',ALL,(s,t)=>sh(c.skin,hz(s,t,515)*6-(t>3?0:4)));P.map('hairB',ALL,(s,t,w,h)=>sh(c.hair,hz(s,0,517)*20+(t%4===0?-6:0)-(t>h-3?10:0)));};
  // ---- the warriors
  const kit=(robeH,o)=>[['robe','body',[0,1,0],[-4.5,-robeH,-2.5,9,robeH+10,5],0,{tp:['-y',1.15,1.2,0,0]}],['cuirass','body',[0,0,0],[-4.75,1,-2.75,9.5,10,5.5]],
    ['gorget','body',[0,10,0],[-3.75,0,-3,7.5,2,6]],['faulds','body',[0,1,0],[-5,-5,-3,10,6,6],0,{tp:['-y',1.12,1.1,0,0]}],
    ['pL','armL',[0,0.5,0],[-3.75,-3,-2.25,4.5,3.5,4.5],[0,0,0.12],{tp:['-y',1.15,1.1,0,0]}],['pR','armR',[0,0.5,0],[-0.75,-3,-2.25,4.5,3.5,4.5],[0,0,-0.12],{m:'pL',tp:['-y',1.15,1.1,0,0]}],
    ['vL','armL',[0,-6,0],[-3.5,-4,-2,4,4,4]],['vR','armR',[0,-6,0],[-0.5,-4,-2,4,4,4],0,{m:'vL'}],
    ['grL','legL',[0,0,0],[-2.5,-10,-2.5,5,6,5]],['grR','legR',[0,0,0],[-2.5,-10,-2.5,5,6,5],0,{m:'grL'}],
    ['helm','head',[0,3.5,0],[-3.5,0,-3.5,7,4,7],0,{head:1,tp:['y',0.8,0.85,0,0]}],
    ['crest','helm',[0,3.5,0.5],[-0.5,0,-4.5,1,o&&o.tall?4.5:3.5,7],[0.08,0,0],{head:1,nb:1,tp:['z',1,0.25,0,-1.2]}],
    ['chL','head',[-3,3.5,1],[-0.5,-3.5,-1.5,1,3.5,4],0,{head:1,tp:['-y',1,0.6,0,0.5]}],['chR','head',[3,3.5,1],[-0.5,-3.5,-1.5,1,3.5,4],0,{head:1,m:'chL',tp:['-y',1,0.6,0,0.5]}],
    ...ears(),...hairB(5)];
  const warrior=(extra,o)=>[...man(),...kit(o&&o.robe||9,o),...extra];
  const warriorPaint=(P,c,o)=>{const ac=o&&o.gold||GOLD,rc=o&&o.robe||WINE;elfFace(P,c,{eyeRow:4});
    mail(P,['armL','legL']);hands(P,c,[96,70,48]);boots(P,[86,60,40],20);
    cloth(P,['robe','body'],rc);vine(P,'robe',SIDE,(o&&o.robeT)||36,(o&&o.robeT||36)+4,ac,rc);
    scales(P,['cuirass'],ac);P.map('cuirass',['F'],(s,t,w)=>Math.abs(s-w/2+0.5)<1&&t>1?sh(ac,24):null); // a raised rib down the breast
    plate(P,['gorget'],ac);rivets(P,'gorget',SIDE,1,3,ac);lames(P,['faulds'],ac);
    scales(P,['pL'],ac);band(P,'pL',SIDE,5,7,sh(ac,-20));
    plate(P,['vL','grL'],ac);P.map('vL',SIDE,(s,t,w)=>s===(w>>1)?sh(ac,30):null);P.map('grL',SIDE,(s,t,w)=>s===(w>>1)?sh(ac,30):t===0?sh(ac,-30):null);
    plate(P,['helm','chL'],ac);P.map('helm',SIDE,(s,t)=>t===6||t===7?sh(ac,-24):(s+t)%6===0&&t<5?sh(ac,26):null); // its band and engraving
    P.map('crest',ALL,(s,t,w,h,f)=>sh(ac,(f==='L'||f==='R'?(t===0?24:t%3===0?-14:0):10)+hz(s,t,519)*6));};
  // the tall shield like a leaf: a pointed oval with a gold rim and midrib, the star above on wine red; within, a grip of leather
  const shield=(at)=>[['shield','armL',at||[-3.5,-5,0],[-1,-7,-3.5,1,15,7],0,{nb:1}]];
  const shieldPaint=(P,field)=>{P.sheet('shield','x',(a,b)=>{const H=30,cy=b/H,half=Math.sin(Math.PI*Math.min(1,Math.max(0,cy)))*7.2,dx=Math.abs(a-6.5);
      if(dx>half)return 'cut';if(dx>half-1.2)return sh(GOLD,(cy<0.5?16:-10));if(dx<0.7)return sh(GOLD,10);
      const q=SIGN(a+1,b-4);if(q===1&&b>=4&&b<14)return sh(WHITE,0);
      return sh(field,(dx<2?6:0)+hz(a,b,521)*8+(b%6===0?-6:0));});
    P.map('shield',['R'],(s,t,w,h)=>t>=12&&t<=16&&s>=3&&s<=10?[80,56,34]:null);};
  // a long elven blade, curving a little toward its point, a long grip, a guard swept forward like two leaves, a pommel
  const blade=(len,hand,a=Math.round(len*1.2)/2)=>[['grip','armR',hand||[1.5,-10.5,0.5],[-0.5,-0.5,-2.5,1,1,4],0,{nb:1}],['pommel','grip',[0,0,-2.5],[-0.5,-1,-1,1,2,1],0,{nb:1,tp:['-z',1,0.4,0,0]}],
    ['guard','grip',[0,0,1.5],[-0.5,-3,0,1,6,1],[0.3,0,0],{nb:1,tp:['z',1,0.6,0,0]}],['bl1','grip',[0,0,2],[-0.5,-1,0,1,2,a],0,{nb:1}],
    ['bl2','bl1',[0,0,a],[-0.5,-1,0,1,2,len-a],[-0.2,0,0],{nb:1,tp:['z',1,0,0,0.5]}]];
  const bladePaint=P=>{P.map('grip',ALL,(s,t)=>(s+t)%2?sh(GOLD,0):[60,40,30]);plate(P,['pommel','guard'],GOLD);
    for(const n of ['bl1','bl2'])P.map(n,ALL,(s,t,w,h,f)=>f==='L'||f==='R'?sh([220,226,234],t===0?26:t===h-1?-10:t===1?-20:4):sh([230,234,240],12));
    P.map('bl1',['L','R'],(s,t)=>s<6&&t===1?sh(GOLD,0):null);}; // gold worked near the hilt
  Object.assign(AM_KINDS,{
    // the spearwarden: a glaive, its long blade curving back from a gold socket
    espear:{res:2,tex:256,scale:1.08,parts:warrior([['shaft','armR',[1.5,-10,0.5],[-0.5,-9,-0.5,1,30,1],[0.12,0,0],{nb:1}],['sock','shaft',[0,21,0],[-0.75,0,-0.75,1.5,2,1.5],0,{nb:1}],
        ['gl1','shaft',[0,23,0],[-0.5,0,-1,1,5,2],0,{nb:1}],['gl2','gl1',[0,5,0],[-0.5,0,-1,1,4,2],[-0.35,0,0],{nb:1,tp:['y',1,0,0,-0.6]}]]),coats:coats(0),
      paint(P,c){warriorPaint(P,c);P.map('shaft',ALL,(s,t,w,h)=>t%9===0?sh(GOLD,10):sh([58,40,32],hz(s,t>>2,523)*10));plate(P,['sock'],GOLD);
        for(const n of ['gl1','gl2'])P.map(n,ALL,(s,t,w,h,f)=>f==='L'||f==='R'?sh([220,226,234],s===0?-18:s===w-1?24:2):sh([230,234,240],10));}},
    esword:{res:2,tex:256,scale:1.08,parts:warrior([...shield(),...blade(12)]),coats:coats(1),
      paint(P,c){warriorPaint(P,c);shieldPaint(P,WINE);bladePaint(P);}},
    // the archer: lighter, a long cloak, a tall bow and a quiver on the back
    ebow:{res:2,tex:256,scale:1.08,parts:warrior([['cape','body',[0,10.5,-2.9],[-4.5,-19,-0.5,9,19,1],[0.08,0,0],{nb:1}],
        ['bowU','armL',[-1.5,-10,1.5],[-0.5,0,-0.5,1,11,1],[-0.18,0,0],{nb:1,tp:['y',0.6,0.6,0,0]}],['bowUt','bowU',[0,11,0],[-0.5,0,-0.5,1,2,1],[0.8,0,0],{nb:1}],
        ['bowD','armL',[-1.5,-10,1.5],[-0.5,-11,-0.5,1,11,1],[0.18,0,0],{nb:1,tp:['-y',0.6,0.6,0,0]}],['bowDt','bowD',[0,-11,0],[-0.5,-2,-0.5,1,2,1],[-0.8,0,0],{nb:1}],
        ['bgrip','armL',[-1.5,-10,1.5],[-1,-1,-1,2,2,2],0,{nb:1}],['bstr','armL',[-1.5,-10,-0.4],[-0.5,-10,-0.5,1,20,1],0,{nb:1}],
        ['quiver','body',[1.5,5,-3.2],[-1,-2,-1,2,10,2],[0,0,0.4],{nb:1}],['fletch','quiver',[0,8,0],[-1,0,-1,2,3,2],0,{nb:1}]],{robe:7}),coats:coats(2),
      paint(P,c){warriorPaint(P,c,{robeT:30});cloth(P,['cape'],WINE,{off:2});vine(P,'cape',SIDE,32,36,GOLD,WINE);
        for(const n of ['bowU','bowD'])P.map(n,ALL,(s,t)=>t%6===0?sh(GOLD,10):sh([196,160,104],hz(s,t>>1,525)*10+(s===0?10:0)));
        P.map('bowUt',ALL,()=>sh(GOLD,10));P.map('bowDt',ALL,()=>sh(GOLD,10));P.map('bgrip',ALL,(s,t)=>(s+t)%2?[60,40,30]:sh(GOLD,0));P.map('bstr',ALL,()=>[236,232,220]);
        leather(P,['quiver'],[96,40,44]);band(P,'quiver',SIDE,0,2,GOLD);band(P,'quiver',SIDE,10,12,GOLD);P.map('fletch',ALL,(s,t)=>(s+t)%2?[244,244,240]:[200,200,206]);}},
    // the lord-captain: armour richly worked, a blue cloak with the star, a tall crest, a blade, the leaf shield
    ecapt:{res:2,tex:256,scale:1.1,parts:warrior([['cape','body',[0,10.5,-2.9],[-4.5,-20,-0.5,9,20,1],[0.08,0,0],{nb:1}],['clasp','body',[0,10,-2.6],[-4.5,-1,-0.5,9,1,1],0,{nb:1}],...shield(),...blade(13)],{tall:1}),coats:coats(3),
      paint(P,c){warriorPaint(P,c,{gold:[232,200,112]});cloth(P,['cape'],BLUE,{off:2});vine(P,'cape',SIDE,34,38,[214,216,226],BLUE);sign(P,'cape','B',1,8,WHITE,GOLD);
        P.map('clasp',ALL,(s,t,w)=>s<3||s>=w-3?sh(GOLD,20):[30,40,80]);shieldPaint(P,BLUE);bladePaint(P);}},
    // ---- the folk of their cities
    elord:{res:2,tex:256,scale:1.08,parts:[...man(),['robe','body',[0,1,0],[-4.5,-12,-2.5,9,13,5],0,{tp:['-y',1.1,1.15,0,0]}],['over','body',[0,0,0],[-4.75,-6,-2.75,9.5,17,5.5]],
        ['slvL','armL',[0,-5,0],[-3.5,-8,-2,4,8,4],0,{tp:['-y',1.5,1.6,-0.5,0]}],['slvR','armR',[0,-5,0],[-0.5,-8,-2,4,8,4],0,{m:'slvL',tp:['-y',1.5,1.6,0.5,0]}],
        ['sash','body',[0,0,0],[-5,2,-3,10,1,6]],['circ','head',[0,5,0],[-3.5,0,-3.5,7,1,7],0,{head:1}],...ears(),...hairB(7)],
      coats:[[{skin:ESKIN[0],hair:EHAIR[0],cl:[40,72,60],cl2:[70,40,80]},2],[{skin:ESKIN[1],hair:EHAIR[1],cl:[70,40,80],cl2:[40,60,90]},2],[{skin:ESKIN[2],hair:EHAIR[2],cl:[90,60,40],cl2:[40,72,60]},1],[{skin:ESKIN[3],hair:EHAIR[4],cl:[30,48,96],cl2:[110,30,44]},1]],
      paint(P,c){elfFace(P,c);cloth(P,['armL','body','robe'],c.cl2);hands(P,c);P.map('legL',ALL,()=>[50,40,40]);boots(P,[60,44,40],21);
        cloth(P,['over','slvL'],c.cl);vine(P,'over',SIDE,28,34,GOLD,c.cl);P.map('over',['F'],(s,t,w)=>Math.abs(s-w/2+0.5)<2?(s+t)%3===0?sh(GOLD,0):sh(c.cl,-24):null);
        vine(P,'slvL',SIDE,10,16,GOLD,c.cl);plate(P,['sash'],GOLD);P.map('sash',['F'],(s)=>s>=8&&s<=11?[200,60,60]:null);
        plate(P,['circ'],[220,222,230]);P.map('circ',['F'],(s)=>s===6||s===7?[120,200,240]:null);}},
    elady:{res:2,tex:256,scale:1.06,parts:[...man(),['gown','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.3,1.35,0,0]}],['girdle','body',[0,0,0],[-5,1.5,-3,10,1,6]],
        ['slvL','armL',[0,-5,0],[-3.5,-10,-2,4,10,4],0,{tp:['-y',1.7,1.8,-0.6,0]}],['slvR','armR',[0,-5,0],[-0.5,-10,-2,4,10,4],0,{m:'slvL',tp:['-y',1.7,1.8,0.6,0]}],
        ['circ','head',[0,5,0],[-3.5,0,-3.5,7,1,7],0,{head:1}],['gem','circ',[0,-1,3.5],[-0.5,-1,0,1,1.5,0.5],0,{head:1,nb:1}],...ears(),...hairB(11),
        ['braidL','head',[-2.5,1,1.5],[-1,-9,-0.5,2,9,1.5],[0,0,0.05],{head:1,nb:1}],['braidR','head',[2.5,1,1.5],[-1,-9,-0.5,2,9,1.5],[0,0,-0.05],{head:1,nb:1,m:'braidL'}]],
      coats:[[{skin:ESKIN[0],hair:EHAIR[1],cl:[230,232,236]},2],[{skin:ESKIN[3],hair:EHAIR[0],cl:[170,200,184]},2],[{skin:ESKIN[1],hair:EHAIR[5],cl:[160,180,214]},2],[{skin:ESKIN[2],hair:EHAIR[3],cl:[200,170,200]},1]],
      paint(P,c){elfFace(P,c);P.map('braidL',ALL,(s,t,w,h)=>sh(c.hair,((t+s)%3===0?-18:6)+hz(s,t,527)*8));
        cloth(P,['armL','body','gown','slvL'],c.cl);hands(P,c);P.map('legL',ALL,()=>[180,170,160]);boots(P,[170,160,150],22);
        vine(P,'gown',SIDE,46,52,[214,190,120],c.cl);vine(P,'slvL',SIDE,14,18,[214,190,120],c.cl);
        P.map('body',['F'],(s,t,w)=>t<4&&Math.abs(s-w/2+0.5)<(4-t)+1?sh(c.skin,-4):t===4&&Math.abs(s-w/2+0.5)<5?sh(GOLD,(s%2?10:-6)):null);
        plate(P,['girdle'],GOLD);P.map('girdle',['F'],(s)=>s%3===0?[120,200,240]:null);plate(P,['circ'],[226,228,236]);P.map('gem',ALL,()=>[150,220,250,200]);}},
    elore:{res:2,tex:256,scale:1.06,parts:[...man(),['robe','body',[0,1,0],[-4.5,-12,-2.5,9,13,5],0,{tp:['-y',1.12,1.15,0,0]}],['stole','body',[0,0,0],[-2,-11,-2.75,4,22,5.5]],
        ['cowl','body',[0,10.5,-0.5],[-4.5,-2,-3,9,3,5.5]],['book','armR',[1.5,-10,1.5],[-1,-2,-2,2,4,3],[0.4,0,0],{nb:1}],...ears(),...hairB(6)],
      coats:[[{skin:ESKIN[1],hair:EHAIR[2],cl:[44,52,84]},2],[{skin:ESKIN[0],hair:EHAIR[0],cl:[70,70,80]},2],[{skin:ESKIN[2],hair:EHAIR[3],cl:[60,44,70]},1]],
      paint(P,c){elfFace(P,c);cloth(P,['armL','body','robe','cowl'],c.cl);hands(P,c);P.map('legL',ALL,()=>[50,46,50]);boots(P,[60,50,46],21);
        // the stole embroidered with letters in gold
        P.map('stole',SIDE,(s,t)=>s===0||s===7?sh(GOLD,0):(t%5<3&&(s*3+t)%4!==0)?sh(GOLD,hz(s,t,529)*10-6):sh([120,30,40],hz(s,t,531)*8));
        leather(P,['book'],[96,40,36]);band(P,'book',SIDE,3,5,GOLD);P.map('book',['T'],(s,t)=>[230,222,200]);}},
    esmith:{res:2,tex:256,scale:1.06,parts:[...man(),['tunic','body',[0,0,0],[-4.5,-4,-2.5,9,15,5]],['apron','body',[0,0,0],[-4.75,-7,-2.75,9.5,16,5.5]],
        ['ham','armR',[1.5,-10,0],[-0.5,-0.5,-0.5,1,1,6],[0.3,0,0],{nb:1}],['hhead','ham',[0,0,5],[-1,-1.5,0,2,3,2],0,{nb:1}],...ears(),...hairB(6)],
      coats:[[{skin:ESKIN[2],hair:EHAIR[0]},2],[{skin:ESKIN[1],hair:EHAIR[3]},1]],
      paint(P,c){elfFace(P,c);cloth(P,['armL','body','tunic'],[150,140,120]);hands(P,c);P.map('legL',ALL,()=>[70,60,52]);boots(P,[60,44,34],20);
        leather(P,['apron'],[96,66,42],1);P.map('apron',['L','R','B','T'],(s,t,w,h,f)=>f==='T'||t<14?sh([150,140,120],hz(s,t,533)*8):null);band(P,'apron',['F'],0,2,GOLD);
        P.map('apron',['F'],(s,t,w)=>s===0||s===w-1?sh(GOLD,-6):null);P.map('ham',ALL,(s,t)=>(t%4===0)?sh(GOLD,0):sh([70,50,40],hz(s,t,535)*10));plate(P,['hhead'],[200,206,216]);}}
  });
  // ---- the knight: a horse in a long caparison of blue with a gold border and the star, a gilded chanfron and crest; its rider
  // armoured as a bladewarden, the leaf shield on his arm and a lance with a long pennon
  const horse=[['legFL',null,[-3,14,7],[-2,-14,-2,4,14,4]],['legFR',null,[3,14,7],[-2,-14,-2,4,14,4],0,{m:'legFL'}],['legBL',null,[-3,14,-7],[-2,-14,-2,4,14,4]],['legBR',null,[3,14,-7],[-2,-14,-2,4,14,4],0,{m:'legBL'}],
    ['hbody',null,[0,14,0],[-5,0,-10,10,10,20]],['neck','hbody',[0,7,8],[-2,-2,-3,4,11,6],[0.55,0,0]],['mane','neck',[0,0,0],[-1,-1,-4,2,13,2],0,{nb:1}],
    ['hhead','neck',[0,9.5,0],[-2.5,-2,-3,5,5,6],[0.6,0,0]],['muzzle','hhead',[0,-1,3],[-2,-1,0,4,4,5]],['hspike','hhead',[0,3,0.5],[-0.5,0,-0.5,1,3,1],[-0.4,0,0],{nb:1,tp:['y',0,0,0,0]}],
    ['earL','hhead',[-1.5,3,-1.5],[-0.5,0,-0.5,1,3,1],[-0.15,0,-0.12]],['earR','hhead',[1.5,3,-1.5],[-0.5,0,-0.5,1,3,1],[-0.15,0,0.12],{m:'earL'}],
    ['tail','hbody',[0,9,-10],[-1.5,-12,-1.5,3,12,3],[0.35,0,0]],
    ['capar','hbody',[0,0,0],[-5.5,-1.5,-10.5,11,12,21]],['saddle','hbody',[0,10.5,-2],[-4,0,-4,8,1,7]],['cantle','saddle',[0,1,-4],[-3,0,0,6,2,1]]];
  const riderParts=[['body','hbody',[0,11.5,-2.5],[-4,0,-2,8,11,4]],['head','body',[0,11,0],[-3,0,-3,6,7,6],0,{head:1}],
    ['armL','body',[-4,10.5,0],[-3,-11,-1.5,3,11,3],[-0.55,0,0.06]],['armR','body',[4,10.5,0],[0,-11,-1.5,3,11,3],[-0.55,0,-0.06],{m:'armL'}],
    ['thL','body',[-2,0.5,0],[-2,-11,-2,4,11,4],[-0.5,0,-0.42]],['thR','body',[2,0.5,0],[-2,-11,-2,4,11,4],[-0.5,0,0.42],{m:'thL'}],
    ...kit(4).filter(p=>!/^gr/.test(p[0])),...shield([-3.5,-4,0]),
    ['lance','armR',[1.5,-10,0.5],[-0.5,-10,-0.5,1,40,1],[0.75,0,0],{nb:1}],['ltip','lance',[0,30,0],[-0.75,0,-0.75,1.5,4,1.5],0,{nb:1,tp:['y',0,0,0,0]}],
    ['flag','lance',[0,22,0],[-0.5,-6,-10,1,6,10],0,{nb:1}]];
  AM_KINDS.eknight={res:2,tex:512,scale:1.04,parts:[...horse,...riderParts],
    coats:[[{h:{coat:[228,226,220],mane:[240,240,236],low:[210,206,200]}},3],[{h:{coat:[178,176,172],mane:[96,94,92],low:[120,118,116],dapple:1}},2],[{h:{coat:[200,190,170],mane:[236,230,214],low:[180,170,150]}},1]]
      .map(([h,w],k)=>[Object.assign({},coats(k)[k%4][0],h),w]),
    paint(P,c){const H=c.h,hair=(n,col)=>P.map(n,ALL,(s,t,w,h,f)=>sh(col,hz(s,t>>2,537)*8+hz(s,t,539)*5-(f==='D'?18:f==='T'?0:t/h*10)));
      for(const n of ['hbody','neck','hhead','muzzle','earL','legFL','legBL'])hair(n,H.coat);
      if(H.dapple)P.map('hbody',['T','L','R','B'],(s,t)=>amHash(s>>1,t>>1,541)<0.22?sh([214,212,208],hz(s,t,543)*8):null);
      for(const n of ['legFL','legBL'])P.map(n,SIDE,(s,t,w,h)=>t>=h-3?[60,56,52]:t>=h-12?sh(H.low,hz(s,t,545)*8):null);
      P.map('mane',ALL,(s,t)=>sh(H.mane,hz(s,0,547)*24));P.map('tail',ALL,(s,t,w,h)=>sh(H.mane,hz(s,0,549)*24-t/h*10));
      // the gilded chanfron over the face, its crest; the bridle of blue and gold
      P.map('hhead',['F','T'],(s,t)=>sh(GOLD,(s+t)%4===0?24:0));P.map('muzzle',['T'],(s,t,w,h)=>t<h-2?sh(GOLD,(s+t)%4===0?24:0):null);plate(P,['hspike'],GOLD);
      P.map('hhead',['L','R'],(s,t,w,h,f)=>{const e=f==='L'?w-4:3;return t>=2&&t<=3&&(s===e||s===e+(f==='L'?-1:1))?(t===2?[30,26,24]:[18,14,14]):(t===1?[40,52,100]:null);});
      P.map('muzzle',['F'],(s,t,w,h)=>t>=h-3?[64,58,54]:(t===2&&(s===1||s===w-2))?[24,20,20]:null);
      // the caparison: blue, long, a gold border woven with a vine, the star on each flank
      cloth(P,['capar'],BLUE);vine(P,'capar',['L','R','F','B'],18,24,GOLD,BLUE);sign(P,'capar','L',12,2,WHITE,GOLD);sign(P,'capar','R',12,2,WHITE,GOLD);
      P.map('capar',['T'],(s,t)=>sh(BLUE,-8+hz(s,t,551)*6));leather(P,['saddle','cantle'],[96,40,44]);band(P,'cantle',SIDE,0,1,GOLD);
      // the rider
      warriorPaint(P,c);P.map('thL',ALL,(s,t,w,h)=>t>=10?(t===h-1?[50,40,32]:sh(GOLD,hz(s,t,553)*8+(s===(w>>1)?24:0))):sh(WINE,hz(s,t,555)*8));
      shieldPaint(P,BLUE);P.map('lance',ALL,(s,t)=>t%10===0?sh(GOLD,10):sh([230,226,214],hz(s,t>>2,557)*8));plate(P,['ltip'],[220,226,234]);
      P.sheet('flag','x',(a,b)=>{if(a<8&&Math.abs(b-5.5)<(8-a)*0.7)return 'cut';return b===5||b===6?sh(GOLD,0):sh(BLUE,hz(a,b,559)*8);});}};
  MODEL_KIT.elf={coats,warrior,warriorPaint,kit,shield,shieldPaint,blade,bladePaint,sign,SIGN,scales,lames,vine,ears,hairB,elfFace,horse,riderParts,GOLD,WINE,BLUE,WHITE,ESKIN,EHAIR};
})();
