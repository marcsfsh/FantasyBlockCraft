// ---- The folk of the riders of the plains (D-061), built and painted like the white realm's (folk-models.js, whose painting
// helpers they share through FOLK_KIT): boxes measured in pixels, two texels to a pixel.
// The riders go in long mail to the knee under green cloaks bordered in gold, their sign a white horse running on green. Their
// helms are tall cones with a gilt brow band, cheek guards and a nasal, a tail of white horsehair streaming from the crown; their
// fair hair hangs long beneath. Guards carry an ash spear with a leaf blade and a green pennon and a round shield of green boards
// with a gilt rim, a boss and the horse; bowmen go in quilted coats with a short horn-tipped bow and a quiver at the hip;
// marshals in gilded helms with a long plume, a sword with a gold hilt and a horn at the belt. Horsemen ride armed as the guards
// with a longer spear, on horses in a green saddlecloth with the horse on its flank, a saddle, a breast collar and a bridle.
// The folk of the steadings: freemen in knee-length tunics with woven borders and cross-gartered legs, a cloak pinned at the
// shoulder and a long knife; freewomen in long gowns with embroidered hems and necklines, a fillet and two braids, keys at the
// girdle; horse-herds in leather and a hood with a coil of rope and a crook; thanes in green and gold, a fur-collared cloak, a
// great brooch, an arm ring and a sword.
(function(){
  const {SK,ALL,SIDE,sh,hz,legs,arms,man,cloth,mail,plate,leather,band,rivets,boots,hands,face,sword,swordPaint,STEEL,GOLD}=FOLK_KIT;
  const GREEN=[50,92,48],DGREEN=[34,64,36],WHITE=[236,234,224],BRONZE=[176,132,70],MAILC=[126,130,138];
  const HAIR=[[222,186,112],[198,154,86],[162,114,62],[120,82,46],[232,214,164],[92,64,42]];
  const coats=b=>SK.map((s,i)=>[{skin:s,hair:HAIR[(i*2+b)%HAIR.length],beard:(i+b)%2===0,eye:[[80,120,160],[110,130,140],[90,120,90]][(i+b)%3]},i===4?1:2]);
  // the riders' sign: a white horse running, sixteen texels by twelve, its head toward high s
  const HORSE_ROWS=['................','...........1....','..........111...','.........11111..','........111..11.','.......111......','.11111111111....',
    '1..11111111.....','1..111111111....','...11.....11....','..1..1...1..1...','.1....1.1....1..'];
  const HORSE=(x,y)=>x>=0&&y>=0&&x<16&&y<12&&HORSE_ROWS[y][x]==='1';
  const horseSign=(P,n,f,s0,t0,col)=>P.map(n,[f],(s,t)=>HORSE(s-s0,t-t0)?sh(col,hz(s,t,201)*6):null);
  // a woven border: a band of rows in gold with a running zigzag through it in the cloth's own darker shade
  const woven=(P,n,fs,t0,t1,col,ground)=>P.map(n,fs,(s,t)=>{if(t<t0||t>=t1)return null;const m=t1-t0,k=t-t0;if(k===0||k===m-1)return sh(ground,-30);
    const z=Math.abs(((s%6)+6)%6-3);return Math.abs(k-1-z*(m-3)/3)<0.7?sh(ground,-20):sh(col,(k===1?16:0)+hz(s,t,203)*8);});
  // ---- the soldiers: a long hauberk of mail to the knee over a green tunic, a belt with a round gilt buckle, the green cloak
  // with its woven border pinned by a round brooch, the helm and its horsehair, leather vambraces, long hair under the helm
  const helmParts=o=>[['avent','head',[0,0,0],[-3.5,-2,-3.5,7,2,7],0,{head:1}],
    ['helm','head',[0,4,0],[-3.5,0,-3.5,7,5,7],0,{head:1,tp:['y',0.42,0.42,0,0]}],['brim','head',[0,4,0],[-3.5,-0.5,-3.5,7,1.5,7],0,{head:1}],
    ['knob','helm',[0,5,0],[-0.5,0,-0.5,1,1,1],0,{head:1,nb:1}],
    ['hplume','helm',[0,5.5,-0.5],[-1,-(o&&o.long?13:10),-0.5,2,o&&o.long?13:10,1],[0.42,0,0],{head:1,nb:1,tp:['-y',1.6,1,0,0]}],
    ['nasal','head',[0,4,0],[-0.5,-2.5,3,1,2.5,1],0,{head:1}],
    ['chL','head',[-3,4,0],[-0.5,-3.5,-1,1,3.5,3],0,{head:1}],['chR','head',[3,4,0],[-0.5,-3.5,-1,1,3.5,3],0,{head:1,m:'chL'}],
    ['hairB','head',[0,1,-3],[-2.5,-4,-1,5,6,1],0,{head:1,nb:1}]];
  const kit=(coatH,capeH,capeR)=>[['coat','body',[0,0,0],[-4.5,-coatH+11,-2.5,9,coatH,5],0,{tp:['-y',1.1,1.12,0,0]}],['belt','body',[0,0,0],[-5,2,-3,10,1,6]],
    ['cape','body',[0,10.5,-2.4],[-4.5,-capeH,-0.5,9,capeH,1],[capeR,0,0],{nb:1}],['brooch','body',[3,9.5,2.2],[-1,-1,0,2,2,1],0,{nb:1}],
    ['vL','armL',[0,-6,0],[-3.5,-4,-2,4,4,4]],['vR','armR',[0,-6,0],[-0.5,-4,-2,4,4,4],0,{m:'vL'}]];
  const soldier=(extra,o)=>[...man(),...kit(o&&o.coatH||18,16,0.1),...helmParts(o),...extra];
  const helmPaint=(P,c,o)=>{const gilt=o&&o.gilt;
    plate(P,['helm','nasal','chL'],gilt?GOLD:STEEL);P.map('helm',SIDE,(s,t,w)=>s%4===0?sh(gilt?GOLD:STEEL,-24):s%4===1?sh(gilt?GOLD:STEEL,18):null); // its plates, joined by ribs
    plate(P,['brim','knob'],gilt?[230,196,110]:GOLD);P.map('brim',SIDE,(s,t)=>t===1&&s%3===1?sh(GOLD,40):t===2&&s%3===1?sh(GOLD,-30):null); // the brow band, its studs
    P.map('brim',['F'],(s,t,w)=>Math.abs(s-(w>>1)+0.5)<2&&t<3?sh(WHITE,hz(s,t,205)*6):null); // a white boss over the nasal
    P.map('chL',['L','R'],(s,t)=>(s+t)%3===0&&t>0?sh(STEEL,40):null);
    // the horsehair: white, in strands, spreading toward its end
    P.map('hplume',ALL,(s,t,w,h)=>sh([238,236,228],hz(s,0,207)*26+(t%5===0?-8:0)-t/h*14));
    P.map('hairB',ALL,(s,t)=>sh(c.hair,hz(s,0,209)*22+(t%4===0?-8:0)));};
  const soldierPaint=(P,c,o)=>{const gilt=o&&o.gilt,quilt=o&&o.quilt;face(P,c,{eyeRow:4,long:1});
    // the hauberk: mail in rings over the arms and down to the knee, its hem and sleeves edged in leather, the green tunic's
    // border showing below it; slit up the front and back for riding
    mail(P,['armL','avent','body','coat']);hands(P,c,[104,72,44]);cloth(P,['legL'],[84,74,58],{off:1});
    if(quilt){cloth(P,['coat','body'],[118,104,72]);P.map('coat',SIDE,(s,t)=>(s+t)%6===0||(s-t+60)%6===0?sh([118,104,72],-26):null);P.map('body',SIDE,(s,t)=>(s+t)%6===0||(s-t+60)%6===0?sh([118,104,72],-26):null);}
    P.map('coat',['F','B'],(s,t,w,h)=>(s===w/2-1||s===w/2)&&t>=h-12?sh(DGREEN,-10):null);
    P.map('coat',SIDE,(s,t,w,h)=>t>=h-3?sh(GREEN,(t===h-3?14:-6)+hz(s,t,211)*8):t===h-4?[70,50,30]:null);
    if(gilt)P.map('coat',SIDE,(s,t,w,h)=>t===h-5?sh(GOLD,hz(s,t,213)*8):null);
    P.map('armL',SIDE,(s,t,w,h)=>t===10?[70,50,30]:null);
    // boots to the knee, bound with crossed straps
    boots(P,[96,66,40],12);P.map('legL',SIDE,(s,t,w,h)=>t>=12&&t<h-2&&((s+t)%6===0||(s-t+60)%6===0)?[52,36,24]:null);
    // the belt and its round gilt buckle, studs along it
    leather(P,['belt'],[80,54,32]);P.map('belt',['F'],(s,t)=>s>=8&&s<=11?(Math.hypot(s-9.5,t-0.5)<1.2?[70,50,30]:sh(GOLD,t===0?24:0)):s%4===1&&t===1?sh(GOLD,10):null);
    // the cloak: green, in folds, its border woven in gold; the brooch
    cloth(P,['cape'],gilt?[40,76,42]:GREEN,{off:2});woven(P,'cape',SIDE,26,32,GOLD,GREEN);
    P.map('cape',['L','R'],(s,t)=>sh(GOLD,hz(s,t,215)*8));if(gilt)horseSign(P,'cape','B',1,6,WHITE);
    plate(P,['brooch'],GOLD);P.map('brooch',['F'],(s,t)=>s===1&&t===1||s===2&&t===2?[200,60,50]:null);
    leather(P,['vL'],[110,76,44]);P.map('vL',SIDE,(s,t)=>t===2||t===5?[60,42,26]:(s%3===0&&t>2&&t<5)?[200,170,110]:null); // laced
    helmPaint(P,c,o);};
  // the round shield: green boards in a gilt rim with rivets round it, the white horse; within, planks and a strap; a boss
  const shieldParts=(at)=>[['shield','armL',at||[-3.5,-6,0],[-1,-5,-5,1,10,10],0,{nb:1}],['boss','shield',[-1,0,0],[-1,-1.5,-1.5,1,3,3],0,{nb:1}]];
  const shieldPaint=P=>{P.sheet('shield','x',(a,b)=>{const dx=a-9.5,dy=b-9.5,r=Math.hypot(dx,dy);if(r>10)return 'cut';
      if(r>8.6)return sh(GOLD,(dy<-3?18:dy>3?-14:0)+hz(a,b,217)*6);
      if(r>7.6&&(Math.round(Math.atan2(dy,dx)*12/Math.PI)%2===0))return r>8.1?sh(GOLD,30):sh(GOLD,-20);
      if(HORSE(a-2,b-4))return sh(WHITE,hz(a,b,219)*6);
      return sh(GREEN,(a%5===0?-16:a%5===1?6:0)+hz(a>>1,b,221)*10+(r>7?-10:0));});
    P.map('shield',['R'],(s,t,w,h)=>{const a=w-1-s,r=Math.hypot(a-9.5,t-9.5);if(r>10)return null;return t>=8&&t<=11?sh([80,56,34],hz(s,t,223)*8):sh([128,92,56],(a%5===0?-18:0)+hz(a>>1,t,225)*12);});
    plate(P,['boss'],GOLD);};
  // an ash spear with a long leaf blade over its socket, and a green pennon with a gold stripe and a swallowtail
  const spear=(len,rot)=>[['spear','armR',[1.5,-10,0.5],[-0.5,-8,-0.5,1,len,1],[rot,0,0],{nb:1}],
    ['tipA','spear',[0,len-8,0],[-0.75,0,-0.75,1.5,2,1.5],0,{nb:1,tp:['y',0.6,0.6,0,0]}],['tipB','spear',[0,len-6,0],[-1,0,-0.5,2,6,1],0,{nb:1,tp:['y',0,1,0,0]}],
    ['flag','spear',[0,len-12,0],[-0.5,-4,-7,1,4,7],0,{nb:1}]];
  const spearPaint=P=>{P.map('spear',ALL,(s,t,w,h)=>t>=h-24&&t<=h-20||t>=24&&t<=28?((t>>1)%2?[60,40,26]:[200,170,100]):sh([132,98,60],hz(s,t>>2,227)*14));
    plate(P,['tipA'],STEEL);P.map('tipB',ALL,(s,t,w)=>sh([216,222,230],s===(w>>1)||s===(w>>1)-1?-18:18));
    P.sheet('flag','x',(a,b)=>{if(a<5&&Math.abs(b-3.5)<(5-a)*0.75)return 'cut';return b===3||b===4?sh(GOLD,hz(a,b,229)*8):sh(GREEN,(a%4===0?-10:0)+hz(a,b,231)*8);});};
  Object.assign(AM_KINDS,{
    hspear:{res:2,tex:256,parts:soldier([...shieldParts(),...spear(34,0.15)]),coats:coats(0),
      paint(P,c){soldierPaint(P,c);shieldPaint(P);spearPaint(P);}},
    // the bowman: a quilted coat to the thigh, the short bow of horn and wood with its tips curved forward, a quiver at the hip
    hbow:{res:2,tex:256,parts:soldier([['bowU','armL',[-1.5,-10,1.5],[-0.5,0,-0.5,1,7,1],[-0.3,0,0],{nb:1,tp:['y',0.6,0.6,0,0]}],
        ['bowUt','bowU',[0,7,0],[-0.5,0,-0.5,1,2,1],[0.9,0,0],{nb:1}],['bowD','armL',[-1.5,-10,1.5],[-0.5,-7,-0.5,1,7,1],[0.3,0,0],{nb:1,tp:['-y',0.6,0.6,0,0]}],
        ['bowDt','bowD',[0,-7,0],[-0.5,-2,-0.5,1,2,1],[-0.9,0,0],{nb:1}],['bgrip','armL',[-1.5,-10,1.5],[-1,-1,-1,2,2,2],0,{nb:1}],
        ['bstr','armL',[-1.5,-10,-0.2],[-0.5,-7,-0.5,1,14,1],0,{nb:1}],
        ['quiver','body',[4.6,4,0.5],[-1,-8,-1.5,2,9,3],[0.1,0,0.12],{nb:1}],['fletch','quiver',[0,1,0],[-1,0,-1.5,2,2,3],0,{nb:1}]],{coatH:15}),coats:coats(1),
      paint(P,c){soldierPaint(P,c,{quilt:1});
        P.map('bowU',ALL,(s,t)=>sh([150,112,64],hz(s,t>>1,233)*12+(s===0?10:0)));P.map('bowD',ALL,(s,t)=>sh([150,112,64],hz(s,t>>1,235)*12+(s===0?10:0)));
        P.map('bowUt',ALL,()=>[226,214,190]);P.map('bowDt',ALL,()=>[226,214,190]);P.map('bgrip',ALL,(s,t)=>(t+s)%2?[70,48,30]:[180,60,46]);P.map('bstr',ALL,()=>[230,226,212]);
        leather(P,['quiver'],[112,74,42]);band(P,'quiver',SIDE,0,3,GOLD);band(P,'quiver',SIDE,12,14,[70,48,30]);P.map('quiver',['F','B'],(s,t)=>t>3&&t<12&&(s+t)%4===0?sh(GOLD,0):null);
        P.map('fletch',ALL,(s,t)=>(s+t)%2?[238,236,230]:[60,110,56]);}},
    // the marshal: a gilded helm with a long plume, gilt at the hauberk's hem, the horse on the cloak; a gold-hilted sword
    // and a horn bound in gold at the belt
    hcapt:{res:2,tex:256,scale:1.05,parts:soldier([...shieldParts(),['sheath','body',[-4.6,2,0.5],[-0.5,-11,-1,1,11,2],[0.3,0,0.08],{nb:1}],...sword(12),
        ['horn','body',[4.8,3,1],[-1,-1,-3,2,2,6],[0.2,0.3,0],{nb:1,tp:['-z',0.4,0.4,0,0.6]}]],{long:1}),coats:coats(3),
      paint(P,c){soldierPaint(P,c,{gilt:1});shieldPaint(P);swordPaint(P,1);leather(P,['sheath'],[50,70,44]);band(P,'sheath',SIDE,0,2,GOLD);band(P,'sheath',SIDE,20,22,GOLD);
        P.map('horn',ALL,(s,t,w,h,f)=>{const z=f==='F'||f==='B'?0:f==='L'?s:w-1-s;return z%4===0?sh(GOLD,20):sh([226,212,182],hz(s,t,237)*10-(f==='D'?14:0));});
        // a gold ring about the neck
        P.map('avent',['F','L','R'],(s,t)=>t===3?sh(GOLD,(s%2?10:-6)):null);}},
    // the horseman: a horse in a green saddlecloth with the horse on its flanks, a saddle, a breast collar and a bridle; on it a
    // rider armed as the guards, with a longer spear
    hrider:{res:2,tex:256,parts:[
        ['legFL',null,[-3,14,7],[-2,-14,-2,4,14,4]],['legFR',null,[3,14,7],[-2,-14,-2,4,14,4],0,{m:'legFL'}],['legBL',null,[-3,14,-7],[-2,-14,-2,4,14,4]],['legBR',null,[3,14,-7],[-2,-14,-2,4,14,4],0,{m:'legBL'}],
        ['hbody',null,[0,14,0],[-5,0,-10,10,10,20]],['neck','hbody',[0,7,8],[-2,-2,-3,4,11,6],[0.55,0,0]],['mane','neck',[0,0,0],[-1,-1,-4,2,13,2],0,{nb:1}],
        ['hhead','neck',[0,9.5,0],[-2.5,-2,-3,5,5,6],[0.6,0,0]],['muzzle','hhead',[0,-1,3],[-2,-1,0,4,4,5]],
        ['earL','hhead',[-1.5,3,-1.5],[-0.5,0,-0.5,1,3,1],[-0.15,0,-0.12]],['earR','hhead',[1.5,3,-1.5],[-0.5,0,-0.5,1,3,1],[-0.15,0,0.12],{m:'earL'}],
        ['tail','hbody',[0,9,-10],[-1.5,-12,-1.5,3,12,3],[0.35,0,0]],
        ['scloth','hbody',[0,0,0],[-5.5,2.5,-7,11,8,10]],['saddle','hbody',[0,10.5,-2],[-4,0,-4,8,1,7]],['cantle','saddle',[0,1,-4],[-3,0,0,6,2,1]],['pommel','saddle',[0,1,3],[-1.5,0,-1,3,2,1]],
        ['breast','hbody',[0,0,10],[-4.5,4,-0.5,9,2,1]],
        ['body','hbody',[0,11.5,-2.5],[-4,0,-2,8,11,4]],['head','body',[0,11,0],[-3,0,-3,6,7,6],0,{head:1}],...arms(-0.55),
        ['thL','body',[-2,0.5,0],[-2,-11,-2,4,11,4],[-0.5,0,-0.42]],['thR','body',[2,0.5,0],[-2,-11,-2,4,11,4],[-0.5,0,0.42],{m:'thL'}],
        ['stL','thL',[0,-11,0.5],[-1.5,-1,-1.5,3,1,3],0,{nb:1}],['stR','thR',[0,-11,0.5],[-1.5,-1,-1.5,3,1,3],0,{m:'stL',nb:1}],
        ...kit(13,12,0.5),...helmParts(),...shieldParts([-3.5,-5,0]),...spear(40,0.75)],
      coats:[[0,{coat:[128,72,42],mane:[34,28,26],low:[34,28,26]}],[1,{coat:[178,176,172],mane:[96,94,92],low:[120,118,116],dapple:1}],[2,{coat:[158,86,46],mane:[176,104,62],low:[150,82,46]}],
        [3,{coat:[220,216,206],mane:[236,234,226],low:[200,196,188]}],[4,{coat:[48,44,44],mane:[30,28,28],low:[30,28,28]}],[0,{coat:[196,160,104],mane:[58,46,38],low:[58,46,38],stripe:1}]]
        .map(([i,h],k)=>[Object.assign({},coats(k)[i][0],{h:h,sock:k%2===0,blaze:k%3!==1}),k===3?1:2]),
      paint(P,c){
        // the horse: its coat in fine hair, darker on the legs below the knee, the hooves, socks and a blaze on some; the mane
        // and tail in strands; the eyes, nostrils and mouth
        const H=c.h,hair=(n,col,k)=>P.map(n,ALL,(s,t,w,h,f)=>sh(col,hz(s,t>>2,239)*(k||8)+hz(s,t,241)*5-(f==='D'?18:f==='T'?0:t/h*10)));
        for(const n of ['hbody','neck','hhead','muzzle','earL','legFL','legBL'])hair(n,H.coat);
        if(H.dapple)P.map('hbody',['T','L','R','B'],(s,t)=>amHash(s>>1,t>>1,243)<0.22?sh([214,212,208],hz(s,t,245)*8):null);if(H.stripe)P.map('hbody',['T'],(s,t,w)=>Math.abs(s-w/2+0.5)<1?H.mane:null);
        for(const n of ['legFL','legBL'])P.map(n,SIDE,(s,t,w,h)=>t>=h-3?[40,34,30]:t>=h-8&&c.sock?sh([228,224,216],hz(s,t,247)*6):t>=h-14?sh(H.low,hz(s,t,249)*8):null);
        for(const n of ['legFL','legBL'])P.map(n,['D'],()=>[34,30,28]);
        P.map('mane',ALL,(s,t)=>sh(H.mane,hz(s,0,251)*30+(t%6===0?-8:0)));P.map('tail',ALL,(s,t,w,h)=>sh(H.mane,hz(s,0,253)*30-t/h*10));
        if(c.blaze){P.map('hhead',['F'],(s,t,w)=>Math.abs(s-w/2+0.5)<1.5?[232,228,220]:null);P.map('muzzle',['T'],(s,t,w)=>Math.abs(s-w/2+0.5)<1.5?[232,228,220]:null);}
        P.map('muzzle',['F'],(s,t,w,h)=>t>=h-3?[54,44,40]:(t===2&&(s===1||s===w-2))?[24,20,20]:null);
        P.map('hhead',['L','R'],(s,t,w,h,f)=>{const e=f==='L'?w-4:3;return t>=2&&t<=3&&(s===e||s===e+(f==='L'?-1:1))?(t===2?[30,26,24]:[18,14,14]):null;});
        // the bridle: a browband, a cheek strap and a noseband in leather, a gilt rosette, a steel ring at the bit
        P.map('hhead',['L','R'],(s,t,w,h,f)=>{const c0=f==='L'?w-6:5;return s===c0||s===c0+(f==='L'?-1:1)?[70,46,28]:null;});P.map('hhead',['F','T'],(s,t,w,h,f)=>f==='F'&&t===1?[70,46,28]:null);
        P.map('muzzle',['L','R','T'],(s,t,w,h,f)=>f==='T'?(t===2?[70,46,28]:null):(t===2?[70,46,28]:t===4&&(f==='L'?s===w-3:s===2)?sh(STEEL,30):null));
        P.map('hhead',['L','R'],(s,t,w,h,f)=>t===2&&s===(f==='L'?w-6:5)?sh(GOLD,24):null);
        // the reins down the neck to the rider's hands
        P.map('neck',['L','R'],(s,t,w,h,f)=>s===(f==='L'?w-2:1)||s===(f==='L'?w-3:2)?[66,44,26]:null);
        // the saddlecloth: green, a woven gold border, the horse on each flank; the saddle and its stitched seat; the breast collar
        cloth(P,['scloth'],GREEN);woven(P,'scloth',['L','R','F','B'],12,16,GOLD,GREEN);horseSign(P,'scloth','L',2,0,WHITE);horseSign(P,'scloth','R',2,0,WHITE);
        leather(P,['saddle','cantle','pommel'],[104,64,36]);P.map('saddle',['T'],(s,t,w,h)=>s%4===0||t%4===0?[78,46,26]:null);band(P,'cantle',SIDE,0,1,GOLD);band(P,'pommel',SIDE,0,1,GOLD);
        leather(P,['breast'],[80,52,30]);P.map('breast',['F'],(s,t,w)=>Math.abs(s-w/2+0.5)<2?sh(GOLD,(t===0?20:-4)):s%4===2?sh(GOLD,0):null);
        // the rider
        soldierPaint(P,c);P.map('thL',ALL,(s,t,w,h,f)=>t>=10?(t===h-1?[40,30,24]:sh([96,66,40],hz(s,t,255)*10+((s+t)%6===0||(s-t+60)%6===0?-36:0))):sh(MAILC,((s+(t>>1))%2===0?(t%2===0?30:4):(t%2===0?-6:-28))));
        plate(P,['stL'],STEEL);shieldPaint(P);spearPaint(P);}},
    // ---- the folk of the steadings
    hman:{res:2,tex:256,parts:[...man(),['tunic','body',[0,0,0],[-4.5,-5,-2.5,9,16,5],0,{tp:['-y',1.12,1.12,0,0]}],['belt','body',[0,0,0],[-5,3,-3,10,1,6]],
        ['cape','body',[0,10.5,-2.4],[-4.5,-11,-0.5,9,11,1],[0.08,0,0],{nb:1}],['brooch','body',[3,9.5,2.2],[-1,-1,0,2,2,1],0,{nb:1}],['seax','body',[0,3.5,3],[-3.5,-1,0,6,1.5,1],[0,0,0.12],{nb:1}],
        ['hairB','head',[0,1,-3],[-2.5,-4,-1,5,6,1],0,{head:1,nb:1}]],
      coats:[[{skin:SK[0],hair:HAIR[0],cl:[76,104,62],emb:[214,176,84],hose:[110,92,64],beard:1},2],[{skin:SK[1],hair:HAIR[2],cl:[132,92,56],emb:[60,100,60],hose:[80,72,58]},2],
        [{skin:SK[2],hair:HAIR[1],cl:[150,62,44],emb:[220,190,110],hose:[96,86,66],beard:1},2],[{skin:SK[0],hair:HAIR[4],cl:[176,156,112],emb:[150,62,44],hose:[100,84,60],beard:1},1],[{skin:SK[3],hair:HAIR[3],cl:[70,82,110],emb:[214,176,84],hose:[86,74,58]},1]],
      paint(P,c){face(P,c,{long:1});P.map('hairB',ALL,(s,t)=>sh(c.hair,hz(s,0,257)*22+(t%4===0?-8:0)));
        cloth(P,['armL','tunic','body'],c.cl);hands(P,c);cloth(P,['legL'],c.hose,{off:1});boots(P,[92,64,40],21);
        // borders woven at the hem, the cuffs and round the neck; cross-gartering up the legs; the cloak and its brooch
        woven(P,'tunic',SIDE,25,31,c.emb,c.cl);P.map('armL',SIDE,(s,t,w,h)=>t>=h-8&&t<h-4?(t===h-8||t===h-5?sh(c.cl,-26):sh(c.emb,(s%3===0?-18:6))):null);
        P.map('body',['F'],(s,t,w)=>t<3&&Math.abs(s-w/2+0.5)<5?(t===2?sh(c.emb,(s%2?10:-10)):sh(c.skin,-8)):null);
        P.map('legL',SIDE,(s,t,w,h)=>t>=6&&t<h-3&&((s+t)%5===0||(s-t+50)%5===0)?[200,182,140]:null);
        cloth(P,['cape'],sh(c.cl,-30),{off:2});band(P,'cape',SIDE,18,22,sh(c.emb,-20));plate(P,['brooch'],BRONZE);P.map('brooch',['F'],(s,t)=>(s+t)%2===0?sh(BRONZE,30):null);
        leather(P,['belt'],[86,58,34]);P.map('belt',['F'],(s)=>s>=9&&s<=10?sh(BRONZE,20):null);
        leather(P,['seax'],[70,46,28]);P.map('seax',ALL,(s,t,w)=>s<3?sh([120,90,60],hz(s,t,259)*10):s===3||s===w-1?sh(BRONZE,10):null);}},
    hwoman:{res:2,tex:256,parts:[...man(),['gown','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.25,1.3,0,0]}],['girdle','body',[0,0,0],[-5,1.5,-3,10,1,6]],
        ['keys','body',[2.5,1.5,3],[-0.5,-4,0,1.5,4,0.5],0,{nb:1}],['fillet','head',[0,5,0],[-3.5,0,-3.5,7,1,7],0,{head:1}],
        ['hairB','head',[0,1,-3],[-3,-6,-1,6,9,1],0,{head:1,nb:1}],['braidL','head',[-2.5,1,1.5],[-1,-8,-0.5,2,8,1.5],[0,0,0.05],{head:1,nb:1}],['braidR','head',[2.5,1,1.5],[-1,-8,-0.5,2,8,1.5],[0,0,-0.05],{head:1,nb:1,m:'braidL'}]],
      coats:[[{skin:SK[0],hair:HAIR[0],cl:[60,98,64],emb:[214,176,84]},2],[{skin:SK[1],hair:HAIR[4],cl:[150,64,50],emb:[226,206,150]},2],[{skin:SK[2],hair:HAIR[2],cl:[176,150,100],emb:[60,96,60]},2],
        [{skin:SK[4],hair:HAIR[1],cl:[96,72,120],emb:[214,176,84]},1],[{skin:SK[3],hair:HAIR[5],cl:[110,84,58],emb:[200,170,110]},1]],
      paint(P,c){face(P,c,{long:1});P.map('hairB',ALL,(s,t)=>sh(c.hair,hz(s,0,261)*20+(t%4===0?-6:0)));
        P.map('braidL',ALL,(s,t,w,h)=>t>=h-2?sh(c.emb,-10):sh(c.hair,((t+s)%3===0?-20:6)+hz(s,t,263)*8));
        cloth(P,['armL','body','gown'],c.cl);hands(P,c);P.map('legL',ALL,(s,t)=>sh([80,60,44],hz(s,t,265)*8));boots(P,[80,56,36],21);
        // the neckline and the hem embroidered, the cuffs banded, the girdle with its keys, the fillet worked in the same thread
        P.map('body',['F'],(s,t,w)=>t<5&&Math.abs(s-w/2+0.5)<(5-t)*0.8+1?(t===4||Math.abs(s-w/2+0.5)>=(5-t)*0.8?sh(c.emb,(s+t)%2?14:-10):sh(c.skin,-6)):null);
        woven(P,'gown',SIDE,20,27,c.emb,c.cl);P.map('armL',SIDE,(s,t,w,h)=>t>=h-7&&t<h-4?sh(c.emb,(s%2?-14:8)):null);
        leather(P,['girdle'],[120,86,48]);P.map('girdle',['F'],(s,t)=>s===13?sh(BRONZE,20):null);P.map('keys',ALL,(s,t)=>t%3===0?sh(BRONZE,30):sh(BRONZE,-10));
        P.map('fillet',ALL,(s,t)=>sh(c.emb,(s%3===0?-20:8)+hz(s,t,267)*6));}},
    hherd:{res:2,tex:256,parts:[...man(),['jerkin','body',[0,0,0],[-4.5,-4,-2.5,9,15,5]],['belt','body',[0,0,0],[-5,2.5,-3,10,1,6]],
        ['hood','body',[0,11,0],[-4.5,-2,-3,9,2.5,6]],['cowl','head',[0,0,-3.5],[-3,-3,-0.5,6,5,1],0,{head:1,nb:1}],['pointH','cowl',[0,-2,-0.5],[-1,-6,-0.5,2,6,1],[0.25,0,0],{head:1,nb:1}],
        ['coil','body',[-4.8,5,0],[-1,-3,-2.5,2,6,5],[0,0,-0.15],{nb:1}],
        ['staff','armR',[1.5,-10,0.5],[-0.5,-8,-0.5,1,27,1],[0.15,0,0],{nb:1}],['crook','staff',[0,19,0],[-0.5,0,-0.5,1,1,4],0,{nb:1}],['crook2','staff',[0,19,3],[-0.5,-2,0,1,2,1],0,{nb:1}]],
      coats:[[{skin:SK[1],hair:HAIR[2],hd:[70,92,56],beard:1},2],[{skin:SK[2],hair:HAIR[0],hd:[110,80,50]},2],[{skin:SK[3],hair:HAIR[5],hd:[86,70,52],beard:1},1]],
      paint(P,c){face(P,c,{long:1});cloth(P,['armL','body'],[164,148,112]);hands(P,c);cloth(P,['legL'],[90,76,58]);boots(P,[84,58,36],16);
        P.map('legL',SIDE,(s,t,w,h)=>t>=8&&t<16&&(s+t)%4===0?[60,46,32]:null);
        // a jerkin of hide laced up the front, its edges stitched; a hood over the shoulders with its point hanging behind
        leather(P,['jerkin'],[124,88,54],1);P.map('jerkin',['F'],(s,t,w)=>Math.abs(s-w/2+0.5)<1?(t%3===0?[220,200,150]:[60,40,26]):null);
        cloth(P,['hood','cowl','pointH'],c.hd);P.map('hood',SIDE,(s,t,w,h)=>t===h-1?sh(c.hd,-28):null);
        leather(P,['belt'],[70,48,30]);
        // the coil of rope: twisted strands in loops
        P.map('coil',ALL,(s,t)=>sh([186,160,110],((s+t*2)%4===0?-30:(s+t*2)%4===1?14:0)+(t%3===0?-12:0)));
        P.map('staff',ALL,(s,t)=>sh([120,88,56],hz(s,t>>2,269)*16+(t%9===0?-14:0)));P.map('crook',ALL,(s,t)=>sh([120,88,56],hz(s,t,271)*12));P.map('crook2',ALL,(s,t)=>sh([120,88,56],hz(s,t,273)*12));}},
    hthane:{res:2,tex:256,scale:1.03,parts:[...man(),['tunic','body',[0,0,0],[-4.5,-8,-2.5,9,19,5],0,{tp:['-y',1.12,1.15,0,0]}],['belt','body',[0,0,0],[-5,3,-3,10,1,6]],
        ['cape','body',[0,10.5,-2.4],[-4.5,-18,-0.5,9,18,1],[0.06,0,0],{nb:1}],['fur','body',[0,10,0],[-5,-1,-3,10,2.5,6]],['brooch','body',[3,9,3],[-1.5,-1.5,0,3,3,1],0,{nb:1}],
        ['ring','armL',[0,-5,0],[-3.5,-1,-2,4,1,4]],['ringR','armR',[0,-5,0],[-0.5,-1,-2,4,1,4],0,{m:'ring'}],
        ['sheath','body',[-4.6,2,0.5],[-0.5,-11,-1,1,11,2],[0.3,0,0.08],{nb:1}],['shilt','sheath',[0,0,0],[-0.5,0,-0.5,1,3,1],0,{nb:1}],['sguard','sheath',[0,0,0],[-1,0,-1.5,2,1,4],0,{nb:1}],
        ['hairB','head',[0,1,-3],[-2.5,-4,-1,5,6,1],0,{head:1,nb:1}]],
      coats:[[{skin:SK[0],hair:HAIR[0],beard:1},2],[{skin:SK[4],hair:HAIR[4],beard:1},1],[{skin:SK[1],hair:HAIR[2],eye:[90,70,50],beard:1},1]],
      paint(P,c){face(P,c,{long:1});P.map('hairB',ALL,(s,t)=>sh(c.hair,hz(s,0,275)*22+(t%4===0?-8:0)));
        cloth(P,['armL','body','tunic'],[44,86,46]);hands(P,c);cloth(P,['legL'],[60,52,40]);boots(P,[70,46,30],20);
        // gold thread: a broad border at the hem and down the front, bands at the cuffs; the horse on the breast; a gold collar
        woven(P,'tunic',SIDE,28,36,GOLD,[44,86,46]);P.map('tunic',['F'],(s,t,w)=>Math.abs(s-w/2+0.5)<1.5&&t<28?sh(GOLD,(t%3===0?-16:8)):null);
        P.map('armL',SIDE,(s,t,w,h)=>t>=h-8&&t<h-4?sh(GOLD,(s+t)%3===0?-18:6):null);horseSign(P,'body','F',0,6,WHITE);
        P.map('body',['F'],(s,t,w)=>t<2?sh(GOLD,t===0?20:-6):null);
        // the cloak: deep green, in folds, bordered in gold; a collar of grey fur; the great brooch with its garnets
        cloth(P,['cape'],[30,58,34],{off:2});woven(P,'cape',SIDE,28,36,GOLD,[30,58,34]);horseSign(P,'cape','B',1,8,sh(GOLD,10));
        P.map('fur',ALL,(s,t)=>sh([150,140,128],hz(s,t,277)*30+((s+t)%3===0?-16:0)));
        plate(P,['brooch'],GOLD);P.map('brooch',['F'],(s,t,w,h)=>Math.hypot(s-w/2+0.5,t-h/2+0.5)<1.2?[170,40,40]:(s+t)%3===0?sh(GOLD,30):null);
        plate(P,['ring'],GOLD);P.map('ring',SIDE,(s)=>s%2?sh(GOLD,-20):null);
        leather(P,['belt'],[60,40,26]);P.map('belt',['F'],(s,t)=>s>=8&&s<=11?sh(GOLD,t===0?24:0):s%3===0&&t===1?sh(GOLD,10):null);
        leather(P,['sheath'],[50,70,44]);band(P,'sheath',SIDE,0,2,GOLD);band(P,'sheath',SIDE,20,22,GOLD);P.map('shilt',ALL,(s,t)=>(s+t)%2?[70,48,30]:sh(GOLD,0));plate(P,['sguard'],GOLD);}}
  });
  MODEL_KIT.rider={coats,soldier,soldierPaint,helmParts,kit,shieldParts,shieldPaint,spear,spearPaint,horseSign,woven,GREEN,DGREEN,WHITE,BRONZE,HORSE};
})();
