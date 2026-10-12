// ---- The soldiers and creatures of the war (W3, D-070; Q150, Q151, Q170, Q171), built from each people's own parts and paint
// (MODEL_KIT) so they wear their people's look. For the hosts: knights of the realm on barded horses with lances, lancers of the
// riders, pikemen with bucklers and crossbowmen with a pavise on the back, the realm's household knights in plate with great
// swords; horse archers and outriders with javelins; the high elves' mounted archers, glaive wardens and blade masters with a
// blade in each hand; the wood elves' skirmishers and sharpshooters with great bows; the dwarves' axe throwers, shieldbreakers
// with war picks, ironclads with great axes, and sappers with pick and shovel; engineers of the realm, elven healers with a staff
// of white stone, bearers with a rolled litter (and the fallen across their shoulders), and a standard bearer of each people.
// For the wastes: goblin wolf riders on great wargs, goblin pot-throwers, war drummers, fire shamans, siege trolls armoured in
// iron with a ram, war beasts in chains, shield orcs, goblin skulkers, troll drivers with whips, and orc crossbowmen.
(function(){
  const {SK,ALL,SIDE,sh,hz,man,cloth,mail,plate,leather,band,rivets,boots,hands,face,sword,swordPaint,STEEL,SILVER,GOLD,BLACK}=FOLK_KIT;
  const R=MODEL_KIT.realm,H=MODEL_KIT.rider,E=MODEL_KIT.elf,Wd=MODEL_KIT.wood,Dw=MODEL_KIT.dwarf,F=MODEL_KIT.foe,K=n=>AM_KINDS[n];
  const drop=(ps,ns)=>ps.filter(p=>!ns.includes(p[0])),only=(ps,ns)=>ps.filter(p=>ns.includes(p[0]));
  const ASH=[112,82,52],IRON=[96,98,108];
  // ---- shared pieces
  // a horse's coat in fine hair, darker below the knee, hooves; the mane and tail in strands; eyes and nostrils
  const horseCoat=(P,Hc)=>{const hair=(n,col)=>P.map(n,ALL,(s,t,w,h,f)=>sh(col,hz(s,t>>2,901)*8+hz(s,t,903)*5-(f==='D'?18:f==='T'?0:t/h*10)));
    for(const n of ['hbody','neck','hhead','muzzle','earL','legFL','legBL'])hair(n,Hc.coat);
    for(const n of ['legFL','legBL'])P.map(n,SIDE,(s,t,w,h)=>t>=h-3?[44,38,34]:t>=h-12?sh(Hc.low,hz(s,t,905)*8):null);
    P.map('mane',ALL,(s,t)=>sh(Hc.mane,hz(s,0,907)*24));P.map('tail',ALL,(s,t,w,h)=>sh(Hc.mane,hz(s,0,909)*24-t/h*10));
    P.map('hhead',['L','R'],(s,t,w,h,f)=>{const e=f==='L'?w-4:3;return t>=2&&t<=3&&(s===e||s===e+(f==='L'?-1:1))?(t===2?[30,26,24]:[18,14,14]):null;});
    P.map('muzzle',['F'],(s,t,w,h)=>t>=h-3?[60,54,50]:(t===2&&(s===1||s===w-2))?[24,20,20]:null);};
  const HORSES=[{coat:[40,36,36],mane:[24,22,22],low:[28,26,26]},{coat:[120,70,40],mane:[34,28,26],low:[34,28,26]},{coat:[176,174,170],mane:[90,88,86],low:[110,108,106]},{coat:[150,84,46],mane:[170,100,60],low:[140,80,44]}];
  // a pole with a crossbar and a finial, and a banner hanging from it that sways (`flag`): painted by `fn(a, b)` on its face
  const standard=(arm,len)=>[['pole',arm||'armR',[1.5,-10,0.5],[-0.5,-10,-0.5,1,len,1],[0.12,0,0],{nb:1}],['bar','pole',[0,len-12,0],[-0.5,-0.5,-0.5,1,1,11],0,{nb:1}],
    ['fin','pole',[0,len-10,0],[-1,0,-1,2,3,2],0,{nb:1,tp:['y',0,0,0,0]}],['flag','pole',[0,len-12.5,0.5],[-0.5,-16,0,1,16,10],0,{nb:1}]];
  const standardPaint=(P,wood,metal,fn,fringe)=>{P.map('pole',ALL,(s,t)=>t%10===0?sh(metal,10):sh(wood,hz(s,t>>2,911)*10));P.map('bar',ALL,(s,t)=>sh(wood,hz(s,t,913)*10));plate(P,['fin'],metal);
    P.sheet('flag','x',(a,b)=>{if(b>=29&&(a%4===1||a%4===2))return 'cut';if(b>=27)return sh(fringe,(a%2?10:-10));return fn(a,b);});};
  // a crossbow: the stock along the forearm, its steel bow across, the string; a case of bolts at the hip
  const xbow=(arm,x)=>[['stock',arm||'armR',[x||1.5,-10,0.5],[-0.5,-1,-2,1,2,11]],['prod','stock',[0,0,8],[-5.5,-0.5,-0.5,11,1,1],[0,0.1,0],{nb:1,tp:['x',1,1,0,0]}],['xstr','stock',[0,0.4,7.4],[-5,-0.5,-0.5,10,1,1],0,{nb:1}],
    ['case','body',[4.6,2,-1.5],[-1,-3,-1,2,8,2],[0,0,-0.2],{nb:1}],['bolts','case',[0,5,0],[-1,0,-1,2,2,2],0,{nb:1}]];
  const xbowPaint=(P,wood,metal,fl)=>{P.map('stock',ALL,(s,t)=>sh(wood,hz(s,t>>1,915)*10+(t%6===0?-12:0)));plate(P,['prod'],metal);P.map('xstr',ALL,()=>[220,214,196]);
    leather(P,['case'],[90,62,38]);P.map('bolts',ALL,(s,t)=>(s+t)%2?[226,220,204]:fl);};
  // a horse's harness of leather with a gilt or bronze stud at each crossing
  const riderOf=(ps)=>only(ps,['body','head','armL','armR','thL','thR']);
  // ---- the hosts
  Object.assign(AM_KINDS,{
    // the pikeman of the realm: the soldier's mail and black surcoat, a pike of ash half again a spear's length couched low, a small
    // round buckler of black and silver on the forearm
    rpike:{res:2,tex:256,parts:R.soldier([['spear','armR',[1.5,-10,0.5],[-0.5,-14,-0.5,1,46,1],[0.6,0,0],{nb:1}],['lug','spear',[0,30,0],[-1.25,0,-0.75,2.5,1,1.5],0,{nb:1}],
        ['tipB','spear',[0,31,0],[-1,0,-0.5,2,5,1],0,{nb:1,tp:['y',0,1,0,0]}],['buck','armL',[-3.5,-6,0],[-1,-3.5,-3.5,1,7,7],0,{nb:1}]]),coats:R.coats(4),
      paint(P,c){R.soldierPaint(P,c);P.map('spear',ALL,(s,t)=>sh(ASH,hz(s,t>>2,917)*14+(t%12===0?-14:0)));plate(P,['lug'],STEEL);P.map('tipB',ALL,(s,t,w)=>sh([214,220,228],s===(w>>1)?-16:16));
        P.sheet('buck','x',(a,b)=>{const r=Math.hypot(a-6.5,b-6.5);return r>7?'cut':r>5.8?sh(SILVER,b<6?16:-8):r<1.6?sh(SILVER,24):sh(BLACK,hz(a,b,919)*8);});}},
    // the crossbowman of the realm: the crossbow and its bolts, a tall pavise slung on the back, black with the realm's sign
    rxbow:{res:2,tex:256,parts:R.soldier([...xbow(),['pav','body',[0,9.5,-2.7],[-5,-16,-1,10,17,1],[0.04,0,0],{nb:1}]]),coats:R.coats(5),
      paint(P,c){R.soldierPaint(P,c);xbowPaint(P,[104,74,46],IRON,[40,40,48]);
        P.sheet('pav','z',(a,b)=>{if(a===0||a===19||b===0||b===33)return sh(SILVER,b===0?16:0);if(R.SIGN(a-2,b-7))return [238,240,244];return sh(BLACK,hz(a,b,921)*8+(b%8===0?-6:0));});}},
    // the household knight: the lord's own, on foot in plate over the mail, a great helm with a slit and a plume, a great sword
    rguard:{res:2,tex:512,scale:1.04,parts:[...R.soldier([['cuir','body',[0,0,0],[-4.75,0.5,-2.75,9.5,10.5,5.5]],['ghelm','head',[0,0,0],[-3.75,-0.5,-3.75,7.5,8,7.5],0,{head:1}],
        ['gplume','ghelm',[0,8,-1],[-0.5,0,-3,1,5,6],[-0.3,0,0],{head:1,nb:1,tp:['y',1,0.5,0,-1]}],['cloak','body',[0,10.5,-2.8],[-4.5,-17,-0.5,9,17,1],[0.08,0,0],{nb:1}],...sword(16)],{plume:1})],coats:R.coats(3),
      paint(P,c){R.soldierPaint(P,c,{plume:1});plate(P,['cuir','ghelm'],SILVER);R.sign(P,'cuir','F',1,1,[30,30,40]);band(P,'cuir',SIDE,0,2,GOLD);
        P.map('ghelm',['F'],(s,t,w)=>t===6&&s>=2&&s<w-2?[14,14,18]:(s===(w>>1)&&t>7)?sh(SILVER,-20):(t>8&&(s+t)%3===0)?[30,30,36]:null);band(P,'ghelm',SIDE,0,2,GOLD);
        P.map('gplume',ALL,(s,t)=>sh([240,240,244],hz(s,t,923)*14+(s%2?-10:6)));cloth(P,['cloak'],[24,24,34],{off:2});band(P,'cloak',SIDE,30,34,SILVER);R.sign(P,'cloak','B',1,5,[238,240,244]);swordPaint(P,1);}},
    // the engineer of the realm: the smith's apron and gauntlets over a working tunic, a felt cap, a coil of rope and a mallet
    rengin:{res:2,tex:256,parts:[...K('rsmith').parts,['cap','head',[0,6,0],[-3.5,0,-3.5,7,2,7],0,{head:1,tp:['y',0.8,0.8,0,0]}],['coil','body',[-4.8,5,0],[-1,-3,-2.5,2,6,5],[0,0,-0.15],{nb:1}],
        ['rod','body',[3,10,-2.8],[-0.5,-14,-0.5,1,16,1],[0,0,0.3],{nb:1}]],coats:K('rsmith').coats,
      paint(P,c){K('rsmith').paint(P,c);cloth(P,['cap'],[70,60,90]);band(P,'cap',SIDE,0,1,[50,40,70]);P.map('coil',ALL,(s,t)=>sh([186,160,110],((s+t*2)%4===0?-30:(s+t*2)%4===1?14:0)+(t%3===0?-12:0)));
        P.map('rod',ALL,(s,t)=>t%4===0?[30,30,30]:[220,210,180]);}},
    // the bearer: a plain tunic under a white tabard with the healers' sign (a green branch), a litter rolled on the back; when he
    // carries one of the fallen, a body wrapped in its cloak lies across his shoulders (`load`, shown by placeFoe)
    rbear:{res:2,tex:256,parts:[...man(),['tunic','body',[0,0,0],[-4.5,-4,-2.5,9,15,5]],['tab','body',[0,0,0],[-4,-5,-2.75,8,15,5.5]],['belt','body',[0,0,0],[-5,3,-3,10,1,6]],
        ['lit','body',[0,11,-3.3],[-5,-1.5,-1.5,10,3,3],[0,0,0],{nb:1}],['load','body',[0,11.5,0],[-8,0,-2.5,16,3.5,5],0,{nb:1}]],coats:R.coats(6),
      paint(P,c){face(P,c);cloth(P,['armL','tunic','body'],[120,104,80]);hands(P,c);cloth(P,['legL'],[90,80,64]);boots(P,[80,58,38],19);
        cloth(P,['tab'],[228,226,218]);P.map('tab',['F','B'],(s,t,w)=>{const x=s-w/2+0.5,y=t-12;return Math.abs(x)<0.8&&y>-8&&y<6||Math.abs(Math.abs(x)-(6-y)*0.35)<0.7&&y>-6&&y<4?sh([60,120,60],hz(s,t,925)*8):null;});
        leather(P,['belt'],[80,54,32]);P.map('lit',ALL,(s,t,w,h,f)=>f==='L'||f==='R'?sh([200,190,160],(Math.hypot(s-w/2,t-h/2)%2<1?-14:6)):sh([200,190,160],hz(s,t,927)*10+(t%3===0?-10:0)));
        P.map('load',ALL,(s,t,w,h,f)=>f==='L'||f==='R'?sh(c.skin,-10):sh([70,60,52],hz(s,t,929)*12+(s%6===0?-14:0)));}},
    // ---- standard bearers: each people's banner on a tall pole, its sign large, a fringe at its foot; their banner steadies those
    // about them (war-units.js)
    rstd:{res:2,tex:512,parts:R.soldier([...standard('armR',40)]),coats:R.coats(7),
      paint(P,c){R.soldierPaint(P,c);standardPaint(P,[60,44,34],SILVER,(a,b)=>R.SIGN(a+3,b-6)?[238,240,244]:a<1||b<1?sh(SILVER,0):sh(BLACK,hz(a,b,931)*8),SILVER);}},
    dstd:{res:2,tex:512,scale:0.95,parts:[...Dw.dwarf(),...Dw.kit(),...Dw.helm(),...standard('armR',34)],coats:Dw.coats(6),
      paint(P,c){Dw.kitPaint(P,c);Dw.helmPaint(P);const rows=['................','.......1........','......111.......','..2..11111..2...','.222.11111.222..','22222111111222..','................','................',
        '..3333333333....','...33333333.....','.....3333.......','......33........','.....333........','....33333.......','................','................'];
        standardPaint(P,[86,60,38],Dw.BRZ,(a,b)=>{const q=(rows[b-6]||'')[a+3];return q==='1'?[236,236,240]:q==='2'?[200,204,214]:q==='3'?sh(GOLD,0):sh(Dw.BLUE,hz(a,b,933)*8);},GOLD);}},
    estd:{res:2,tex:512,scale:1.08,parts:E.warrior([...standard('armR',42)]),coats:E.coats(4),
      paint(P,c){E.warriorPaint(P,c);standardPaint(P,[58,40,32],E.GOLD,(a,b)=>{const q=E.SIGN(a+0,b-5);return q===1?E.WHITE:q===2?E.GOLD:sh(E.BLUE,hz(a,b,935)*8);},E.GOLD);}},
    // ---- the knight of the realm: a horse barded in black with a silver border and the realm's sign on its flanks, a steel
    // chanfron; the knight in mail and plate under the black surcoat, plumed, with the kite shield and a lance with a black pennon
    rknight:{res:2,tex:512,scale:1.04,parts:[...E.horse,...riderOf(E.riderParts),...drop(R.soldier([],{plume:1}),['legL','legR','toeL','toeR','body','head','armL','armR','grL','grR']),R.shield,
        ['lance','armR',[1.5,-10,0.5],[-0.5,-10,-0.5,1,42,1],[0.75,0,0],{nb:1}],['ltip','lance',[0,32,0],[-0.75,0,-0.75,1.5,4,1.5],0,{nb:1,tp:['y',0,0,0,0]}],['pen','lance',[0,24,0],[-0.5,-6,-10,1,6,10],0,{nb:1}]],
      coats:HORSES.map((h,k)=>[Object.assign({},R.coats(k)[k][0],{h:h}),k?1:2]),
      paint(P,c){horseCoat(P,c.h);P.map('hhead',['F','T'],(s,t)=>sh(STEEL,(s+t)%4===0?24:0));plate(P,['hspike'],STEEL);
        cloth(P,['capar'],BLACK);band(P,'capar',['L','R','F','B'],18,22,SILVER);R.sign(P,'capar','L',14,3,[238,240,244]);R.sign(P,'capar','R',14,3,[238,240,244]);
        leather(P,['saddle','cantle'],[60,40,30]);R.soldierPaint(P,c,{plume:1});P.map('thL',ALL,(s,t,w,h)=>t>=10?(t===h-1?[40,32,28]:sh(STEEL,hz(s,t,937)*8+(s===(w>>1)?24:0))):null);mail(P,['thL']);
        P.map('thL',SIDE,(s,t,w,h)=>t>=10?sh(STEEL,(t===10?24:0)+hz(s,t,939)*8):null);R.shieldPaint(P);P.map('lance',ALL,(s,t)=>t%10===0?sh(SILVER,0):sh([60,52,48],hz(s,t>>2,941)*8));plate(P,['ltip'],[220,226,234]);
        P.sheet('pen','x',(a,b)=>{if(a<8&&Math.abs(b-5.5)<(8-a)*0.7)return 'cut';return b===5||b===6?sh(SILVER,0):sh(BLACK,hz(a,b,943)*8);});}},
    // ---- the riders: the lancer, armed as the horseman with a longer lance and a long plume; the horse archer, quilted, with the
    // short bow; the outrider, light, with a bundle of javelins on his back and one in hand
    hlancer:{res:2,tex:512,parts:[...drop(K('hrider').parts,['spear','tipA','tipB','flag','hplume']),...H.spear(50,0.95),['hplume','helm',[0,5.5,-0.5],[-1,-13,-0.5,2,13,1],[0.42,0,0],{head:1,nb:1,tp:['-y',1.6,1,0,0]}]],
      coats:K('hrider').coats,paint(P,c){K('hrider').paint(P,c);P.map('hplume',ALL,(s,t,w,h)=>sh([238,236,228],hz(s,0,945)*26-t/h*14));}},
    hharch:{res:2,tex:512,parts:[...drop(K('hrider').parts,['spear','tipA','tipB','flag','shield','boss']),...only(K('hbow').parts,['bowU','bowUt','bowD','bowDt','bgrip','bstr','quiver','fletch'])],
      coats:K('hrider').coats,paint(P,c){K('hrider').paint(P,c);K('hbow').paint(P,c);}},
    hout:{res:2,tex:512,parts:[...drop(K('hrider').parts,['spear','tipA','tipB','flag','shield','boss']),['jav','armR',[1.5,-10,0.5],[-0.5,-6,-0.5,1,18,1],[0.3,0,0],{nb:1}],
        ['javt','jav',[0,12,0],[-0.75,0,-0.75,1.5,3,1.5],0,{nb:1,tp:['y',0,0,0,0]}],['javs','body',[2.5,4,-2.8],[-1.5,-6,-0.75,3,17,1.5],[0.15,0,-0.35],{nb:1}]],
      coats:K('hrider').coats,paint(P,c){K('hrider').paint(P,c);P.map('jav',ALL,(s,t)=>sh(ASH,hz(s,t>>2,947)*12));plate(P,['javt'],STEEL);
        P.map('javs',ALL,(s,t,w,h,f)=>f==='T'?((s%2)?sh(STEEL,10):[60,44,30]):(t<3?sh(STEEL,(s%2?10:-10)):t===8?[70,48,30]:sh(ASH,(s%2?-12:6))));}},
    // ---- the high elves: the mounted archer (the knight's horse, the archer's bow and cloak); the glaive warden with a great glaive
    // in both hands; the blade master in silver over white with a long blade in each hand and no shield
    emarch:{res:2,tex:512,scale:1.04,parts:[...E.horse,...drop(E.riderParts,['lance','ltip','flag','shield']),...only(K('ebow').parts,['cape','bowU','bowUt','bowD','bowDt','bgrip','bstr','quiver','fletch'])],
      coats:K('eknight').coats,paint(P,c){K('eknight').paint(P,c);K('ebow').paint(P,c);}},
    eglaive:{res:2,tex:256,scale:1.1,parts:E.warrior([['shaft','armR',[1.5,-10,0.5],[-0.5,-12,-0.5,1,38,1],[0.25,0,0],{nb:1}],['sock','shaft',[0,26,0],[-0.75,0,-0.75,1.5,2,1.5],0,{nb:1}],
        ['gl1','shaft',[0,28,0],[-0.5,0,-1.5,1,7,3],0,{nb:1}],['gl2','gl1',[0,7,0],[-0.5,0,-1.5,1,6,3],[-0.4,0,0],{nb:1,tp:['y',1,0,0,-0.8]}],['spk','shaft',[0,-12,0],[-0.5,-3,-0.5,1,3,1],0,{nb:1,tp:['-y',0,0,0,0]}]],{tall:1}),coats:E.coats(5),
      paint(P,c){E.warriorPaint(P,c,{gold:[236,206,120]});P.map('shaft',ALL,(s,t)=>t%8===0?sh(E.GOLD,10):sh([40,30,30],hz(s,t>>2,949)*8));plate(P,['sock','spk'],E.GOLD);
        for(const n of ['gl1','gl2'])P.map(n,ALL,(s,t,w,h,f)=>f==='L'||f==='R'?sh([222,228,236],s===0?-18:s===w-1?26:4):sh([232,236,242],10));}},
    eblade:{res:2,tex:256,scale:1.1,parts:E.warrior([...E.blade(15),['gripL','armL',[-1.5,-10.5,0.5],[-0.5,-0.5,-2.5,1,1,4],0,{nb:1}],['guardL','gripL',[0,0,1.5],[-0.5,-3,0,1,6,1],[0.3,0,0],{nb:1}],
        ['blL','gripL',[0,0,2],[-0.5,-1,0,1,2,13],[-0.08,0,0],{nb:1,tp:['z',1,0,0,0.5]}],['cape','body',[0,10.5,-2.9],[-4.5,-20,-0.5,9,20,1],[0.08,0,0],{nb:1}]],{tall:1,robe:11}),coats:E.coats(6),
      paint(P,c){E.warriorPaint(P,c,{gold:[214,220,232],robe:[226,226,232]});E.bladePaint(P);P.map('gripL',ALL,(s,t)=>(s+t)%2?sh(E.GOLD,0):[60,40,30]);plate(P,['guardL'],E.GOLD);
        P.map('blL',ALL,(s,t,w,h,f)=>f==='L'||f==='R'?sh([220,226,234],t===0?26:t===h-1?-10:t===1?-20:4):sh([230,234,240],12));cloth(P,['cape'],[230,232,238],{off:2});E.vine(P,'cape',SIDE,34,38,E.GOLD,[230,232,238]);E.sign(P,'cape','B',1,8,E.GOLD,[120,160,220]);}},
    // ---- the wood elves: the skirmisher, light, a short bow and a long knife, a green band at the brow; the sharpshooter, hooded
    // and cloaked, with a great bow taller than he is
    wskirm:{res:2,tex:256,scale:1.06,parts:[...man(),...Wd.jerkin(),...Wd.ears(),...Wd.hairB(6),['band','head',[0,5,0],[-3.5,0,-3.5,7,1,7],0,{head:1}],...Wd.bow(),...Wd.knife('R',5)],coats:Wd.coats(4),
      paint(P,c){Wd.jerkinPaint(P,c,[120,96,62]);Wd.bowPaint(P);Wd.knifePaint(P,'R');P.map('band',ALL,(s,t)=>sh(Wd.MOSS,(s%3===0?-14:6)));}},
    wlong:{res:2,tex:256,scale:1.08,parts:[...man(),...Wd.jerkin(),...Wd.ears(),...Wd.hairB(6),...Wd.hood(),
        ['bowU','armL',[-1.5,-10,1.5],[-0.5,0,-0.5,1,16,1],[-0.12,0,0],{nb:1,tp:['y',0.6,0.6,0,0]}],['bowUt','bowU',[0,16,0],[-0.5,0,-0.5,1,2,1],[0.8,0,0],{nb:1}],
        ['bowD','armL',[-1.5,-10,1.5],[-0.5,-16,-0.5,1,16,1],[0.12,0,0],{nb:1,tp:['-y',0.6,0.6,0,0]}],['bowDt','bowD',[0,-16,0],[-0.5,-2,-0.5,1,2,1],[-0.8,0,0],{nb:1}],
        ['bgrip','armL',[-1.5,-10,1.5],[-1,-1,-1,2,2,2],0,{nb:1}],['bstr','armL',[-1.5,-10,-0.4],[-0.5,-15,-0.5,1,30,1],0,{nb:1}],
        ['quiver','body',[2,5,-3.4],[-1,-2,-1,2,11,2],[0,0,0.4],{nb:1}],['fletch','quiver',[0,9,0],[-1,0,-1,2,3,2],0,{nb:1}]],coats:Wd.coats(5),
      paint(P,c){Wd.jerkinPaint(P,c,[100,84,58]);Wd.hoodPaint(P,Wd.CLOAK);Wd.bowPaint(P);Wd.leafSign(P,'cloak','B',2,10,Wd.MOSS,Wd.COP);}},
    // ---- the dwarves: the axe thrower with a bandolier of throwing axes; the shieldbreaker with a two-handed war pick; the
    // ironclad in plate from crown to foot with a great axe; the sapper with a mail shirt under the miner's leathers, pick and shovel
    dthrow:{res:2,tex:256,scale:0.95,parts:[...Dw.dwarf(),...Dw.kit(),...Dw.helm(),...Dw.axe(7),['bando','body',[0,5,0],[-5.5,-1,-3.5,11,2,7],[0,0,0.55],{nb:1}],
        ['ax1','bando',[-3,0,3.6],[-0.5,-1.5,0,1,3,1.5],0,{nb:1}],['ax2','bando',[0,0,3.6],[-0.5,-1.5,0,1,3,1.5],0,{nb:1,m:'ax1'}],['ax3','bando',[3,0,3.6],[-0.5,-1.5,0,1,3,1.5],0,{nb:1,m:'ax1'}]],coats:Dw.coats(7),
      paint(P,c){Dw.kitPaint(P,c);Dw.helmPaint(P);Dw.axePaint(P);leather(P,['bando'],[96,62,36]);P.map('ax1',ALL,(s,t,w,h,f)=>f==='L'||f==='R'?sh([200,204,210],t===0?24:0):sh(Dw.BRZ,0));}},
    dbreak:{res:2,tex:256,scale:0.97,parts:[...Dw.dwarf({beard:8}),...Dw.kit(),...Dw.helm(),['haft','armR',[1.75,-8.5,0.5],[-0.5,-0.5,-3,1,1,17]],['phead','haft',[0,0,13],[-1.5,-1.5,0,3,3,3],0,{nb:1}],
        ['spike','phead',[0,-1.5,1.5],[-0.5,-6,-0.75,1,6,1.5],0,{nb:1,tp:['-y',0,0.2,0,0]}],['peen','phead',[0,1.5,1.5],[-1.25,0,-1.25,2.5,3,2.5],0,{nb:1}],['fur','body',[0,10,0],[-5.75,-2,-3.75,11.5,3,7.5]]],coats:Dw.coats(8),
      paint(P,c){Dw.kitPaint(P,c);Dw.helmPaint(P);P.map('haft',ALL,(s,t)=>t%5===0?sh(Dw.BRZ,6):sh([86,60,38],hz(s,t>>2,951)*10));plate(P,['phead','spike','peen'],Dw.DIRON);band(P,'phead',SIDE,0,1,Dw.BRZ);
        P.map('fur',ALL,(s,t)=>sh([110,86,62],hz(s,t,953)*30+((s+t)%3===0?-16:0)));}},
    diron:{res:2,tex:512,scale:1,parts:[...drop(K('dhammer').parts,['haft','maul']),['haft','armR',[1.75,-8.5,0.5],[-0.5,-0.5,-3,1,1,17]],['axe','haft',[0,0,12],[-0.5,-6,0,1,10,4.5],0,{nb:1,tp:['z',1,0.5,0,-1]}],
        ['axe2','haft',[0,0,12],[-0.5,-1,-0.5,1,8,4],[Math.PI,0,0],{nb:1,tp:['z',1,0.5,0,-1]}],['crown','head',[0,8,0],[-0.5,0,-3,1,3,6],0,{head:1,nb:1}]],coats:Dw.coats(9),
      paint(P,c){K('dhammer').paint(P,c);for(const n of ['cuir','skirt','grL','helm','mask'])P.map(n,SIDE,(s,t,w,h)=>t===0||t===h-1?sh(GOLD,0):null);P.map('haft',ALL,(s,t)=>t%4===0?sh(GOLD,0):sh([60,42,30],hz(s,t>>2,955)*10));
        for(const n of ['axe','axe2'])P.map(n,ALL,(s,t,w,h,f)=>f==='L'||f==='R'?(t===0?sh([226,230,236],26):sh([150,154,164],s<2?-20:hz(s,t,957)*10)):sh(GOLD,6));plate(P,['crown'],GOLD);}},
    dsapper:{res:2,tex:256,scale:0.94,parts:[...K('dminer').parts,['shov','body',[3,4,-3.6],[-0.5,-8,-0.5,1,17,1],[0,0,0.35],{nb:1}],['shovb','shov',[0,-8,0],[-1.75,-5,-0.5,3.5,5,1],0,{nb:1}]],coats:Dw.coats(10),
      paint(P,c){K('dminer').paint(P,c);mail(P,['tunic']);band(P,'tunic',SIDE,24,28,Dw.BLUE);P.map('shov',ALL,(s,t)=>sh([110,80,50],hz(s,t>>2,959)*10));plate(P,['shovb'],Dw.DIRON);}},
    // ---- the healer: an elf of the houses of healing in white, a green stole worked with gold leaves, a satchel of herbs, a staff
    // of pale wood with a white stone that shines
    eheal:{res:2,tex:256,scale:1.06,parts:[...man(),['robe','body',[0,1,0],[-4.5,-12,-2.5,9,13,5],0,{tp:['-y',1.12,1.15,0,0]}],['stole','body',[0,0,0],[-2,-11,-2.75,4,22,5.5]],
        ['bag','body',[-4.6,2,0.5],[-1.25,-3,-2,2.5,4,4],0,{nb:1}],['strap','body',[0,5,0],[-5,-0.5,-3,10,1,6],[0,0,-0.6],{nb:1}],['circ','head',[0,5,0],[-3.5,0,-3.5,7,1,7],0,{head:1}],
        ['staff','armR',[1.5,-10,0.5],[-0.5,-9,-0.5,1,30,1],[0.12,0,0],{nb:1}],['stone','staff',[0,21,0],[-1,0,-1,2,2.5,2],0,{nb:1}],...E.ears(),...E.hairB(9)],coats:E.coats(7),
      paint(P,c){E.elfFace(P,c);cloth(P,['armL','body','robe'],[232,232,226]);hands(P,c);P.map('legL',ALL,()=>[200,198,190]);boots(P,[150,140,120],21);E.vine(P,'robe',SIDE,46,50,[150,190,140],[232,232,226]);
        P.map('stole',SIDE,(s,t)=>s===0||s===7?sh(E.GOLD,0):(t%6===2&&s>1&&s<6)?sh(E.GOLD,6):sh([70,120,74],hz(s,t,961)*8));leather(P,['bag','strap'],[120,90,56]);P.map('bag',['L'],(s,t)=>t===3?sh([120,160,90],0):null);
        plate(P,['circ'],[226,228,236]);P.map('staff',ALL,(s,t)=>sh([220,206,170],hz(s,t>>2,963)*8+(t%7===0?-14:0)));P.map('stone',ALL,()=>[236,244,255,200]);}}
  });
  // ---- the wastes
  const gobRider=[['body','hbody',[0,11,-1],[-3,0,-1.5,6,7,3],[0.2,0,0]],['cloth','body',[0,0,0],[-4,-3,-2,8,4,4]],['head','body',[0,7,1],[-3,-0.5,-3,6,5,6],[-0.3,0,0],{head:1}],
    ['nose','head',[0,1.5,3],[-0.5,-1,0,1,2,2],[0.2,0,0],{head:1}],['earL','head',[-3,3,0],[-5,-0.5,-0.5,5,1,2],[0,0.35,-0.35],{head:1}],['earR','head',[3,3,0],[0,-0.5,-0.5,5,1,2],[0,-0.35,0.35],{head:1,m:'earL'}],
    ['armL','body',[-3,6,0.5],[-2,-7,-1,2,7,2],[-0.6,0,0.08]],['armR','body',[3,6,0.5],[0,-7,-1,2,7,2],[-0.6,0,-0.08],{m:'armL'}],
    ['thL','body',[-2,0.5,0],[-1,-6,-1,2,6,2],[-0.6,0,-0.7]],['thR','body',[2,0.5,0],[-1,-6,-1,2,6,2],[-0.6,0,0.7],{m:'thL'}]];
  Object.assign(AM_KINDS,{
    // the wolf rider: a goblin on a great warg of the ash (shaggy grey-black, a mane of bristles along its back, a long jaw full of
    // teeth, eyes like coals) in a harness of hide and iron rings, a spear with a ragged pennon
    wolfrid:{res:2,tex:256,parts:[['legFL',null,[-2.5,8,7],[-1.5,-8,-1.5,3,8,3]],['legFR',null,[2.5,8,7],[-1.5,-8,-1.5,3,8,3],0,{m:'legFL'}],['legBL',null,[-2.5,8,-6],[-1.5,-8,-1.5,3,8,3]],['legBR',null,[2.5,8,-6],[-1.5,-8,-1.5,3,8,3],0,{m:'legBL'}],
        ['hbody',null,[0,8,0],[-4,0,-9,8,8,18]],['mane','hbody',[0,8,0],[-1.5,0,-8,3,2,14],0,{nb:1}],['neck','hbody',[0,5,8],[-3,-2,-2,6,7,5],[0.5,0,0]],
        ['hhead','neck',[0,4,2],[-3,-3,-1,6,6,6],[-0.5,0,0]],['muzzle','hhead',[0,-2,5],[-2,-1,0,4,3,5]],['jaw','muzzle',[0,-1,0],[-1.75,-1.5,0,3.5,1.5,4.5],[0.15,0,0]],
        ['earL','hhead',[-2,3,0],[-0.75,0,-0.75,1.5,3,1.5],[-0.2,0,-0.2]],['earR','hhead',[2,3,0],[-0.75,0,-0.75,1.5,3,1.5],[-0.2,0,0.2],{m:'earL'}],
        ['tail','hbody',[0,6,-9],[-1.5,-10,-1.5,3,10,3],[0.6,0,0]],['harn','hbody',[0,0,0],[-4.5,3,-3,9,5.5,7]],
        ...gobRider,['spear','armR',[1,-6.5,0],[-0.5,-6,-0.5,1,26,1],[0.4,0,0],{nb:1}],['stip','spear',[0,20,0],[-1,0,-0.5,2,3,1],0,{nb:1,tp:['y',0,0,0,0]}],['pen','spear',[0,16,0],[-0.5,-4,-6,1,4,6],0,{nb:1}]],
      coats:[[{fur:[64,60,58],skin:[118,136,62],inner:[150,110,100],rag:[96,72,46],eye:[255,214,60],weye:[255,120,30]},3],[{fur:[82,72,62],skin:[100,120,74],inner:[146,104,96],rag:[84,64,52],eye:[255,190,40],weye:[255,80,30]},2],
        [{fur:[46,44,46],skin:[136,132,82],inner:[156,112,98],rag:[110,84,52],eye:[255,120,40],weye:[255,170,40]},1]],
      paint(P,c){P.coat(['hbody','neck','hhead','muzzle','jaw','earL','legFL','legBL','tail'],c.fur,16);for(const n of ['hbody','neck','tail','legFL','legBL'])P.hair(n);P.coat(['mane'],[c.fur[0]-24,c.fur[1]-24,c.fur[2]-24],18);
        P.rows('legFL',['L','F','R','B'],13,16,[30,28,28]);P.rows('legBL',['L','F','R','B'],13,16,[30,28,28]);P.rows('muzzle',['F'],0,2,[24,20,20]);
        P.rows('jaw',['L','R','F'],0,1,[236,230,214]);P.rows('muzzle',['L','R'],4,6,[236,230,214]);P.glow('hhead','L',9,3,c.weye);P.glow('hhead','R',2,3,c.weye);P.coat(['earL'],[c.fur[0]-20,c.fur[1]-20,c.fur[2]-20],10);
        P.coat(['harn'],[70,50,34],12);P.rows('harn',['L','R','T'],0,2,[50,46,50]);P.spots('harn',['L','R'],[150,146,150],0.08);
        F.gobPaint(P,c);P.coat(['thL'],c.skin,14);P.rows('thL',['L','F','R','B'],8,12,[50,40,30]);P.coat(['spear'],[80,56,34],8);P.coat(['stip'],[150,146,150],10);P.coat(['pen'],[110,30,26],16);P.spots('pen',['L','R'],[60,20,18],0.3);}},
    // the pot-thrower: a goblin with a wicker basket of clay fire pots on his back and one alight in his hand
    gpot:{parts:[...F.gob(),['basket','body',[0,4,-2],[-2.5,-3,-3,5,6,3],0,{nb:1}],['pots','basket',[0,3,-1.5],[-2,0,-1,4,2,2],0,{nb:1}],['pot','armR',[1,-6.5,0],[-1,-1,-1,2,2,2],0,{nb:1}],['wick','pot',[0,1,0],[-0.5,0,-0.5,1,1,1],0,{nb:1}]],coats:F.gobCoats,
      paint(P,c){F.gobPaint(P,c);P.coat(['basket'],[150,120,70],14);P.rows('basket',['L','F','R','B'],1,2,[110,84,50]);P.rows('basket',['L','F','R','B'],4,5,[110,84,50]);P.coat(['pots','pot'],[150,80,50],12);P.glowFaces(['wick'],[255,170,50]);P.glow('pots','T',1,1,[255,140,40]);P.glow('pots','T',5,2,[255,140,40]);}},
    // the war drummer: an orc with a great drum of hide on a harness at his belly and a bone stick in each hand
    odrum:{scale:1.08,parts:[...F.orc(),['helm','head',[0,3,0],[-3.5,0,-3.5,7,4,7],0,{head:1}],['drum','body',[0,2,3],[-4,-4,0,8,8,6],[0.15,0,0],{nb:1}],['skin','drum',[0,0,6],[-3.5,-3.5,0,7,7,1],0,{nb:1}],
        ['stL','armL',[-1.5,-10,0],[-0.5,-0.5,-0.5,1,1,7],[0.6,0,0],{nb:1}],['stR','armR',[1.5,-10,0],[-0.5,-0.5,-0.5,1,1,7],[0.6,0,0],{nb:1,m:'stL'}]],coats:F.orcCoats,
      paint(P,c){F.orcPaint(P,c);P.coat(['helm'],c.iron,10);P.coat(['drum'],[90,40,30],12);P.rows('drum',['L','R','F','B'],0,1,c.iron);P.rows('drum',['L','R','F','B'],7,8,c.iron);P.spots('drum',['L','R'],[230,220,190],0.06);
        P.coat(['skin'],[200,184,150],10);P.rect('skin','F',5,5,4,4,[130,30,24]);P.coat(['stL'],[226,216,190],8);P.glow('stL','F',0,0,[255,140,40]);}},
    // the fire shaman: an orc in hides hung with bones, a headdress of horns, a staff crowned with a burning skull
    oshaman:{scale:1.06,parts:[...F.orc(),['robe','body',[0,0,0],[-5,-6,-3,10,16,6]],['horns','head',[0,6,0],[-4,0,-0.5,8,1,1],0,{head:1}],['hnL','horns',[-4,0,0],[-0.5,0,-0.5,1,4,1],[0,0,-0.4],{head:1,nb:1}],['hnR','horns',[4,0,0],[-0.5,0,-0.5,1,4,1],[0,0,0.4],{head:1,nb:1,m:'hnL'}],
        ['bones','body',[0,9,3],[-3,-3,0,6,3,1],0,{nb:1}],['staff','armR',[1.5,-10,0],[-0.5,-4,-0.5,1,22,1],[-0.2,0,0],{nb:1}],['skull','staff',[0,18,0],[-1.5,0,-1.5,3,3,3],0,{nb:1}],['flame','skull',[0,3,0],[-1,0,-1,2,3,2],0,{nb:1,tp:['y',0,0,0,0]}]],coats:F.orcCoats,
      paint(P,c){F.orcPaint(P,c);P.coat(['robe'],[70,50,40],16);P.fringe('robe',[40,28,22]);P.cracks(['robe'],[255,110,30],0.06);P.coat(['horns','hnL'],[210,196,170],8);P.coat(['bones'],[226,216,190],10);
        P.coat(['staff'],[60,40,30],8);P.coat(['skull'],[220,210,184],10);P.glow('skull','F',0,1,[255,90,30]);P.glow('skull','F',2,1,[255,90,30]);P.glowFaces(['flame'],[255,150,40]);P.glowEyes('head',2,2,[255,90,30]);}},
    // the siege troll: an ash troll armoured in plates of black iron chained over its back and shoulders, an iron cap, carrying a ram
    // of a whole trunk shod with iron
    strollr:{scale:1.45,parts:[...drop(K('troll').parts,['club']),['plB','body',[0,8,-5.5],[-7,-6,-1,14,13,2],0,{nb:1}],['plL','armL',[0,0,0],[-6,-4,-4,6,5,8]],['plR','armR',[0,0,0],[0,-4,-4,6,5,8],0,{m:'plL'}],
        ['cap','head',[0,4,0],[-4.5,0,-3.5,9,3,8],0,{head:1}],['ram','body',[0,3,8],[-2,-2,-4,4,4,26],[-0.45,0,0],{nb:1}],['ramh','ram',[0,0,22],[-2.5,-2.5,0,5,5,3],0,{nb:1}]],coats:K('troll').coats,
      paint(P,c){K('troll').paint(P,c);P.coat(['plB','plL','cap'],[40,38,42],10);P.spots('plB',['B','L','R'],[120,110,100],0.05);P.rows('plB',['B'],5,6,[70,66,70]);
        P.coat(['ram'],[80,60,42],12);P.rows('ram',['L','R','T','D'],0,2,[50,48,52]);P.coat(['ramh'],[52,50,54],8);P.glow('ramh','F',4,4,[255,120,30]);}},
    // the war beast: a great boar of the ash bred for war, a head lower than a troll but twice as heavy, plated in iron down its
    // back, an iron mask over its face, tusks shod with iron, chains hanging from its collar
    wbeast:{scale:1.6,parts:[['legL',null,[-3.5,9,-7],[-2,-9,-2,4,9,4]],['legR',null,[3.5,9,-7],[-2,-9,-2,4,9,4],0,{m:'legL'}],['body',null,[0,9,0],[-6,-1,-10,12,12,20]],
        ['armL','body',[-3.5,2,7],[-2,-10,-2,4,10,4]],['armR','body',[3.5,2,7],[-2,-10,-2,4,10,4],0,{m:'armL'}],['head','body',[0,3,10],[-4,-4,0,8,8,7],[0.2,0,0],{head:1}],
        ['snout','head',[0,-2,7],[-2.5,-2,0,5,4,3]],['tuskL','snout',[-2.5,0,1],[-0.5,0,-0.5,1,4,1],[0.4,0,-0.3]],['tuskR','snout',[2.5,0,1],[-0.5,0,-0.5,1,4,1],[0.4,0,0.3],{m:'tuskL'}],
        ['mask','head',[0,0,7],[-4.5,-1,0,9,5,1],0,{head:1}],['plates','body',[0,11,0],[-5,0,-9,10,2,18],0,{nb:1}],['spikes','plates',[0,2,0],[-0.5,0,-8,1,3,16],0,{nb:1,tp:['y',0,1,0,0]}],
        ['collar','body',[0,5,9],[-6.5,-3,-1.5,13,8,3]],['chainL','collar',[-6,-3,0],[-0.5,-9,-0.5,1,9,1],[0.3,0,0],{nb:1}],['chainR','collar',[6,-3,0],[-0.5,-9,-0.5,1,9,1],[0.3,0,0],{nb:1,m:'chainL'}],['tail','body',[0,8,-10],[-0.5,-5,-0.5,1,5,1],[0.6,0,0],{nb:1}]],
      coats:[[{hide:[70,56,48],iron:[44,42,46],eye:[255,120,30]},3],[{hide:[86,64,50],iron:[52,48,50],eye:[255,80,30]},1]],
      paint(P,c){P.coat(['body','head','snout','legL','armL'],c.hide,16);P.hair('body');P.spots('body',['L','R','T'],[c.hide[0]-30,c.hide[1]-30,c.hide[2]-30],0.12);P.rows('legL',['L','F','R','B'],15,18,[30,26,24]);P.rows('armL',['L','F','R','B'],15,20,[30,26,24]);
        P.coat(['tuskL'],[226,216,190],8);P.coat(['mask','plates','collar'],c.iron,10);P.spots('plates',['T','L','R'],[120,110,100],0.06);P.coat(['spikes'],[150,146,150],8);P.coat(['chainL'],[90,88,92],12);
        P.rows('chainL',['L','F','R','B'],0,30,[110,108,112]);P.glowEyes('mask',3,4,c.eye);P.rows('snout',['F'],2,4,[30,24,22]);P.coat(['tail'],c.hide,10);}},
    // the shield orc: an orc behind a tall shield of black iron plates with spikes at its foot, a short spear
    oshield:{parts:[...F.orc(),['helm','head',[0,0,0],[-3.5,-0.5,-3.5,7,8,7],0,{head:1}],['tower','armL',[-3,-6,0],[-1,-9,-5,1,17,10],0,{nb:1}],['tspk','tower',[0,-9,0],[-0.5,-2,-4,1,2,8],0,{nb:1,tp:['-y',0,1,0,0]}],
        ['spear','armR',[1.5,-10,0],[-0.5,-6,-0.5,1,20,1],[0.3,0,0],{nb:1}],['stip','spear',[0,14,0],[-1,0,-0.5,2,3,1],0,{nb:1,tp:['y',0,0,0,0]}]],coats:F.orcCoats,
      paint(P,c){F.orcPaint(P,c);P.coat(['helm','tower'],c.iron,10);P.rows('helm',['F'],2,3,[20,18,20]);P.glow('helm','F',2,2,c.eye);P.glow('helm','F',4,2,c.eye);P.rows('tower',['L'],0,1,[70,66,70]);P.rect('tower','L',8,0,4,34,[120,30,26]);
        P.spots('tower',['L'],[110,100,96],0.05);P.coat(['tspk'],[150,146,150],8);P.coat(['spear'],[80,56,34],8);P.coat(['stip'],[150,146,150],10);}},
    // the goblin skulker: small and quick, a knife in each hand, a rag over the face
    gswarm:{scale:0.85,parts:[...F.gob(),['wpn','armR',[1,-6.5,0],[-0.5,-0.5,-1,1,1,5],0,{nb:1}],['wpnL','armL',[-1,-6.5,0],[-0.5,-0.5,-1,1,1,5],0,{nb:1}],['rag','head',[0,0.5,3],[-3,-0.5,0,6,2,1],0,{head:1,nb:1}]],coats:F.gobCoats,
      paint(P,c){F.gobPaint(P,c);P.coat(['wpn','wpnL'],[170,170,176],10);P.coat(['rag'],[60,40,30],10);}},
    // the troll driver: an orc in a long hide coat with a whip of many tails and a goad of iron
    tdriver:{scale:1.1,parts:[...F.orc(),['coatT','body',[0,0,0],[-5,-8,-3,10,18,6]],['helm','head',[0,3,0],[-3.5,0,-3.5,7,4,7],0,{head:1}],['whip1','armR',[1.5,-10,0],[-0.5,-0.5,-0.5,1,1,6],[0.4,0,0],{nb:1}],
        ['whip2','whip1',[0,0,6],[-0.5,-0.5,-0.5,1,1,7],[0.4,0,0],{nb:1}],['whip3','whip2',[0,0,7],[-0.5,-0.5,-0.5,1,1,7],[0.4,0,0],{nb:1}],['goad','armL',[-1.5,-10,0],[-0.5,-4,-0.5,1,14,1],[0.3,0,0],{nb:1}]],coats:F.orcCoats,
      paint(P,c){F.orcPaint(P,c);P.coat(['coatT'],[80,62,46],14);P.fringe('coatT',[54,40,30]);P.coat(['helm'],c.iron,10);P.coat(['whip1'],[60,40,30],8);P.coat(['whip2','whip3'],[90,60,40],10);P.coat(['goad'],c.iron,10);P.glow('goad','T',0,0,[255,120,30]);}},
    // the orc crossbowman: a heavy crossbow of black iron, a hood, a case of bolts
    oxbow:{parts:[...F.orc(),['hood','head',[0,0,0],[-3.5,-0.5,-3.5,7,7,6],0,{head:1}],...xbow('armR',1.5)],coats:F.orcCoats,
      paint(P,c){F.orcPaint(P,c);P.coat(['hood'],[50,44,40],12);xbowPaint(P,[70,50,34],[52,50,54],[110,30,26]);}},
    // the banner bearer of a warhost (W8b): an orc in a horned helm with a tall pole of black wood, a spike at its head, a hide
    // banner of black and dull red on its crossbar with a burning eye, torn at the foot
    obanner:{scale:1.08,parts:[...F.orc(),['helm','head',[0,3,0],[-3.5,0,-3.5,7,4,7],0,{head:1}],['hnL','helm',[-3.5,2,0],[-1,0,-0.5,1,4,1],[0,0,0.5],{head:1,nb:1,tp:['y',0,0,0,0]}],['hnR','helm',[3.5,2,0],[0,0,-0.5,1,4,1],[0,0,-0.5],{head:1,nb:1,m:'hnL',tp:['y',0,0,0,0]}],...standard('armR',38)],coats:F.orcCoats,
      paint(P,c){F.orcPaint(P,c);P.coat(['helm'],c.iron,10);P.rows('helm',['F'],2,4,[20,18,20]);P.coat(['hnL'],[210,196,170],8);P.map('pole',ALL,(s,t)=>sh([52,40,32],hz(s,t>>2,951)*10+(t%9===0?-16:0)));P.map('bar',ALL,(s,t)=>sh([52,40,32],hz(s,t,953)*10));P.coat(['fin'],c.iron,8);
        P.sheet('flag','x',(a,b)=>{if(b>=13&&(a*7+b*3)%5<2)return 'cut';const dx=a-4.5,dy=b-6,r=Math.hypot(dx*0.85,dy*1.1);
          return Math.abs(dx)<0.8&&Math.abs(dy)<2?[24,10,8]:r<2.4?[250,150,40]:r<3.4?[170,50,26]:b===11?sh([110,30,24],0):sh([46,34,32],hz(a,b,955)*12);});}},
    // the war hound of the hosts (W8b): a big hound of the camps in a coat of mail over its back, a spiked collar of leather
    whound:{scale:1.2,parts:[...K('hound').parts,['mail','body',[0,2,0],[-3.5,0,-4.5,7,5,9],0,{nb:1}],['coll','head',[0,1,-1],[-3,-1,-1,6,3,2],0,{head:1,nb:1}]],
      coats:[[{coat:[150,110,70],saddle:[90,64,44],chest:[210,190,160],nose:[30,26,24]},3],[{coat:[52,46,44],saddle:[36,32,30],chest:[176,128,80],nose:[24,20,20],tan:1},2],[{coat:[140,136,130],saddle:[104,100,96],chest:[186,182,176],nose:[30,28,28],shag:1},1]],
      paint(P,c){K('hound').paint(P,c);mail(P,['mail']);P.rows('mail',['L','R','F','B'],0,1,[120,30,26]);P.coat(['coll'],[70,50,36],8);P.spots('coll',['L','R','F','B','T'],[200,200,206],0.3);}}
  });
})();
