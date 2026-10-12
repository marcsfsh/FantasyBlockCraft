// ---- The folk of the wood elves (D-065), built and painted like the other folk (FOLK_KIT): boxes measured in pixels, two texels
// to a pixel, a little taller than men, pointed ears, long hair, beardless. Their wardens go as the forest's own: hooded cloaks of
// grey-green that blur against the trees over jerkins of soft leather, leaf-shaped plates of copper at the shoulder and the
// forearm, long bows of pale wood and quivers at the back; the blades carry two long knives curving like leaves; the guards of
// the king's halls wear armour of overlapping copper leaves over long robes of deep green, helms with a leaf crest swept back,
// and glaives; captains a green cloak with the golden leaf of the wood over their armour. The king goes in long robes of silver
// and moss under a crown of autumn leaves and red berries, a staff of pale wood in hand; lords in green with silver leaves at the
// brow; ladies in gowns of white, silver or pale green, their hair long and braided; the folk of the glades in tunics of green
// and brown with hoods thrown back.
(function(){
  const {ALL,SIDE,sh,hz,man,cloth,mail,plate,leather,band,rivets,boots,hands,face}=FOLK_KIT;
  const COP=[168,120,76],GOLD=[222,184,92],SILV=[214,218,226],DEEP=[34,64,44],MOSS=[86,104,70],CLOAK=[104,116,98],BARKC=[96,70,46];
  const WSKIN=[[236,214,194],[226,200,176],[218,190,164],[240,224,206]],WHAIR=[[232,214,160],[206,208,210],[150,84,40],[44,32,26],[240,228,186],[176,120,64]];
  const coats=b=>WSKIN.map((s,i)=>[{skin:s,hair:WHAIR[(i*2+b)%WHAIR.length],eye:[[100,130,96],[110,124,136],[120,104,70]][(i+b)%3]},i===3?1:2]);
  // the leaf of the wood: a pointed oval with a midrib and veins (13 by 16 texels), for cloaks and shields
  const LEAF=(x,y)=>{const cx=x-6,cy=y-8;if((cx*cx)/18+(cy*cy)/50>1||cy>6.5)return 0;if(Math.abs(cx)<0.6&&cy<7)return 2;if(Math.abs(Math.abs(cx)-(cy+8)*0.15-0.3)<0.4&&Math.abs(cx)>1)return 2;return 1;};
  const leafSign=(P,n,f,s0,t0,c1,c2)=>P.map(n,[f],(s,t)=>{const q=LEAF(s-s0,t-t0);return q===1?sh(c1,hz(s,t,601)*8):q===2?sh(c2,hz(s,t,603)*6):null;});
  // overlapping copper leaves: rows of pointed scales lit at their tips, every other row offset
  const leaves=(P,ns,col)=>{for(const n of ns)P.map(n,ALL,(s,t,w,h,f)=>{if(f==='T')return sh(col,12);if(f==='D')return sh(col,-34);
    const r=t%4,c=(s+((t>>2)%2)*2)%4,inn=Math.abs(c-1.5)<=(r<2?2:3.6-r);return inn?sh(col,(r===3?-14:r===2?4:16)+(c===1?6:0)+hz(s,t,605)*6):sh([90,56,30],hz(s,t,607)*8);});};
  // a vine of leaves embroidered along a band of rows
  const vine=(P,n,fs,t0,t1,col,ground)=>P.map(n,fs,(s,t)=>{if(t<t0||t>=t1)return null;const m=(t1-t0-1)/2,wv=t0+m+Math.sin(s*0.8)*m*0.8,on=Math.abs(t-wv)<0.7||(s%4===1&&Math.abs(t-(wv+(s%8<4?-1:1)))<0.8);
    return on?sh(col,hz(s,t,609)*8):sh(ground,-14+hz(s,t,611)*6);});
  const ears=()=>[['earL','head',[-3,3.2,0.5],[-0.5,0,-0.5,1,3,1.5],[-0.35,0,0.45],{head:1,nb:1,tp:['y',1,0.2,0,-0.5]}],['earR','head',[3,3.2,0.5],[-0.5,0,-0.5,1,3,1.5],[-0.35,0,-0.45],{head:1,nb:1,m:'earL',tp:['y',1,0.2,0,-0.5]}]];
  const hairB=len=>[['hairB','head',[0,1,-3],[-3,-len,-1,6,len+5,1],0,{head:1,nb:1}]];
  const elfFace=(P,c,o)=>{face(P,c,Object.assign({long:1},o||{}));P.map('earL',ALL,(s,t)=>sh(c.skin,hz(s,t,613)*6-(t>3?0:4)));P.map('hairB',ALL,(s,t,w,h)=>sh(c.hair,hz(s,0,615)*20+(t%4===0?-6:0)-(t>h-3?10:0)));};
  // a hood (up) and a cloak falling from it to the calf
  const hood=()=>[['hood','head',[0,0,0],[-3.75,0,-3.75,7.5,7.75,7.5],0,{head:1,tp:['y',0.85,0.8,0,-0.3]}],['cloak','body',[0,10.5,-2.9],[-4.75,-20,-0.5,9.5,20,1],[0.07,0,0],{nb:1}]];
  const hoodPaint=(P,col)=>{P.map('hood',ALL,(s,t,w,h,f)=>f==='F'&&t<h-1&&s>1&&s<w-2?null:sh(col,hz(s,t,617)*10+(t===h-1?-12:0)+(f==='T'?6:0)));cloth(P,['cloak'],col,{off:2});
    P.map('cloak',SIDE,(s,t,w,h)=>t>h-4?sh(col,-16+hz(s,t,619)*8):null);};
  // a long bow of pale wood, recurved at its tips, and a quiver at the back
  const bow=()=>[['bowU','armL',[-1.5,-10,1.5],[-0.5,0,-0.5,1,12,1],[-0.16,0,0],{nb:1,tp:['y',0.6,0.6,0,0]}],['bowUt','bowU',[0,12,0],[-0.5,0,-0.5,1,2,1],[0.8,0,0],{nb:1}],
    ['bowD','armL',[-1.5,-10,1.5],[-0.5,-12,-0.5,1,12,1],[0.16,0,0],{nb:1,tp:['-y',0.6,0.6,0,0]}],['bowDt','bowD',[0,-12,0],[-0.5,-2,-0.5,1,2,1],[-0.8,0,0],{nb:1}],
    ['bgrip','armL',[-1.5,-10,1.5],[-1,-1,-1,2,2,2],0,{nb:1}],['bstr','armL',[-1.5,-10,-0.4],[-0.5,-11,-0.5,1,22,1],0,{nb:1}],
    ['quiver','body',[2,5,-3.4],[-1,-2,-1,2,10,2],[0,0,0.4],{nb:1}],['fletch','quiver',[0,8,0],[-1,0,-1,2,3,2],0,{nb:1}]];
  const bowPaint=P=>{for(const n of ['bowU','bowD'])P.map(n,ALL,(s,t)=>t%5===0?sh(COP,10):sh([214,196,150],hz(s,t>>1,621)*10+(s===0?10:0)));
    P.map('bowUt',ALL,()=>sh(COP,10));P.map('bowDt',ALL,()=>sh(COP,10));P.map('bgrip',ALL,(s,t)=>(s+t)%2?[70,50,34]:sh(COP,0));P.map('bstr',ALL,()=>[236,232,220]);
    leather(P,['quiver'],[110,74,44]);band(P,'quiver',SIDE,0,2,COP);P.map('fletch',ALL,(s,t)=>(s+t)%2?[230,230,220]:[96,120,84]);};
  // a long knife curving like a leaf, its hilt bound in leather, a little guard of copper (len in half blocks)
  const knife=(side,len)=>{const a=side==='L'?'armL':'armR',x=side==='L'?-1.5:1.5,n=side==='L'?'kL':'kR',sw=side==='L'?0.25:-0.25;
    return [[n+'g',a,[x,-10.5,0.5],[-0.5,-0.5,-1.5,1,1,3],0,{nb:1}],[n+'x',n+'g',[0,0,1.5],[-0.5,-1.5,0,1,3,1],0,{nb:1}],
      [n+'1',n+'g',[0,0,2],[-0.5,-1,0,1,2,len],0,{nb:1}],[n+'2',n+'1',[0,0,len],[-0.5,-1,0,1,2,3],[sw,0,0],{nb:1,tp:['z',1,0,0,0.5]}]];};
  const knifePaint=(P,side)=>{const n=side==='L'?'kL':'kR';P.map(n+'g',ALL,(s,t)=>(s+t)%2?[70,48,32]:[110,80,52]);plate(P,[n+'x'],COP);
    for(const q of [n+'1',n+'2'])P.map(q,ALL,(s,t,w,h,f)=>f==='L'||f==='R'?sh([212,218,224],t===0?24:t===h-1?-12:4):sh([226,230,234],10));};
  // a jerkin of soft leather to the thigh, leaf plates of copper on the shoulders, bracers, a belt
  const jerkin=()=>[['jerk','body',[0,0,0],[-4.5,-4,-2.5,9,15,5]],['pL','armL',[0,0.5,0],[-3.75,-3,-2.25,4.5,3.5,4.5],[0,0,0.12],{tp:['-y',1.15,1.1,0,0]}],
    ['pR','armR',[0,0.5,0],[-0.75,-3,-2.25,4.5,3.5,4.5],[0,0,-0.12],{m:'pL',tp:['-y',1.15,1.1,0,0]}],['vL','armL',[0,-6,0],[-3.5,-4,-2,4,4,4]],['vR','armR',[0,-6,0],[-0.5,-4,-2,4,4,4],0,{m:'vL'}],
    ['belt','body',[0,0,0],[-5,0.5,-3,10,1,6]]];
  const jerkinPaint=(P,c,col,o)=>{elfFace(P,c,{eyeRow:4});cloth(P,['armL','body'],o&&o.under||MOSS);hands(P,c,[90,64,42]);P.map('legL',ALL,(s,t)=>sh([72,64,52],hz(s,t,623)*8));boots(P,[86,62,40],21);
    leather(P,['jerk'],col);P.map('jerk',['F'],(s,t,w)=>Math.abs(s-w/2+0.5)<1?sh(col,-24):t%6===0?sh(col,10):null);
    leaves(P,['pL'],COP);plate(P,['vL'],COP);P.map('vL',SIDE,(s,t,w)=>s===(w>>1)?sh(COP,26):null);leather(P,['belt'],[70,48,30]);P.map('belt',['F'],(s,t,w)=>Math.abs(s-w/2+0.5)<1.5?sh(COP,10):null);};
  // the guards' armour: copper leaves over a long robe of deep green, a helm with a leaf crest swept back, greaves
  const kit=robeH=>[['robe','body',[0,1,0],[-4.5,-robeH,-2.5,9,robeH+10,5],0,{tp:['-y',1.15,1.2,0,0]}],['cuirass','body',[0,0,0],[-4.75,1,-2.75,9.5,10,5.5]],
    ['faulds','body',[0,1,0],[-5,-5,-3,10,6,6],0,{tp:['-y',1.12,1.1,0,0]}],
    ['pL','armL',[0,0.5,0],[-3.75,-3,-2.25,4.5,3.5,4.5],[0,0,0.12],{tp:['-y',1.15,1.1,0,0]}],['pR','armR',[0,0.5,0],[-0.75,-3,-2.25,4.5,3.5,4.5],[0,0,-0.12],{m:'pL',tp:['-y',1.15,1.1,0,0]}],
    ['vL','armL',[0,-6,0],[-3.5,-4,-2,4,4,4]],['vR','armR',[0,-6,0],[-0.5,-4,-2,4,4,4],0,{m:'vL'}],
    ['grL','legL',[0,0,0],[-2.5,-10,-2.5,5,6,5]],['grR','legR',[0,0,0],[-2.5,-10,-2.5,5,6,5],0,{m:'grL'}],
    ['helm','head',[0,3.5,0],[-3.5,0,-3.5,7,4,7],0,{head:1,tp:['y',0.85,0.85,0,0]}],
    ['crest','helm',[0,3,-0.5],[-0.5,0,-1,1,3,6],[-0.5,0,0],{head:1,nb:1,tp:['y',1,0.2,0,-2]}],
    ...ears(),...hairB(6)];
  const guardPaint=(P,c)=>{elfFace(P,c,{eyeRow:4});mail(P,['armL','legL']);hands(P,c,[90,64,42]);boots(P,[86,60,40],20);
    cloth(P,['robe','body'],DEEP);vine(P,'robe',SIDE,34,38,COP,DEEP);leaves(P,['cuirass'],COP);leaves(P,['faulds'],sh(COP,-10));leaves(P,['pL'],COP);
    plate(P,['vL','grL'],COP);P.map('grL',SIDE,(s,t,w)=>s===(w>>1)?sh(COP,26):null);
    plate(P,['helm'],COP);P.map('helm',SIDE,(s,t)=>t===6||t===7?sh(COP,-26):(s*3+t)%7===0&&t<5?sh(COP,22):null);
    P.map('crest',ALL,(s,t,w,h,f)=>sh(GOLD,(f==='L'||f==='R'?(t%2?-10:8):10)+hz(s,t,625)*6));};
  const robed=(robeH,hair)=>[...man(),['robe','body',[0,1,0],[-4.5,-robeH,-2.5,9,robeH+1,5],0,{tp:['-y',1.15,1.2,0,0]}],['over','body',[0,0,0],[-4.75,-6,-2.75,9.5,17,5.5]],
    ['slvL','armL',[0,-5,0],[-3.5,-8,-2,4,8,4],0,{tp:['-y',1.5,1.6,-0.5,0]}],['slvR','armR',[0,-5,0],[-0.5,-8,-2,4,8,4],0,{m:'slvL',tp:['-y',1.5,1.6,0.5,0]}],...ears(),...hairB(hair)];
  Object.assign(AM_KINDS,{
    // the warden: hooded, cloaked, a long bow and quiver, knives at the belt
    wbow:{res:2,tex:256,scale:1.08,parts:[...man(),...jerkin(),...hood(),...bow(),...ears(),...hairB(4)],coats:coats(0),
      paint(P,c){jerkinPaint(P,c,[110,82,50]);hoodPaint(P,CLOAK);bowPaint(P);P.map('hairB',ALL,(s,t,w,h)=>sh(c.hair,hz(s,0,615)*20-(t>h-3?10:0)));}},
    // the blade: two long knives, leaf plates, a short cloak
    wknife:{res:2,tex:256,scale:1.08,parts:[...man(),...jerkin(),['cape','body',[0,10.5,-2.9],[-4.5,-12,-0.5,9,12,1],[0.08,0,0],{nb:1}],...knife('L',4),...knife('R',4),...ears(),...hairB(6)],coats:coats(1),
      paint(P,c){jerkinPaint(P,c,[96,70,44],{under:DEEP});cloth(P,['cape'],MOSS,{off:2});vine(P,'cape',SIDE,18,22,COP,MOSS);knifePaint(P,'L');knifePaint(P,'R');}},
    // the guard of the halls: copper leaves over deep green, the leaf-crested helm, a glaive
    wguard:{res:2,tex:256,scale:1.08,parts:[...man(),...kit(9),['shaft','armR',[1.5,-10,0.5],[-0.5,-9,-0.5,1,30,1],[0.12,0,0],{nb:1}],['sock','shaft',[0,21,0],[-0.75,0,-0.75,1.5,2,1.5],0,{nb:1}],
        ['gl1','shaft',[0,23,0],[-0.5,0,-1,1,5,2],0,{nb:1}],['gl2','gl1',[0,5,0],[-0.5,0,-1,1,4,2],[-0.35,0,0],{nb:1,tp:['y',1,0,0,-0.6]}]],coats:coats(2),
      paint(P,c){guardPaint(P,c);P.map('shaft',ALL,(s,t)=>t%8===0?sh(COP,10):sh([86,60,40],hz(s,t>>2,627)*10));plate(P,['sock'],COP);
        for(const n of ['gl1','gl2'])P.map(n,ALL,(s,t,w,h,f)=>f==='L'||f==='R'?sh([212,218,224],s===0?-18:s===w-1?24:2):sh([226,230,234],10));}},
    // the captain: the guard's armour under a green cloak with the leaf of the wood, a knife in each hand
    wcapt:{res:2,tex:256,scale:1.1,parts:[...man(),...kit(8),['cape','body',[0,10.5,-2.9],[-4.5,-20,-0.5,9,20,1],[0.08,0,0],{nb:1}],...knife('L',5),...knife('R',5)],coats:coats(3),
      paint(P,c){guardPaint(P,c);cloth(P,['cape'],[40,84,52],{off:2});vine(P,'cape',SIDE,34,38,GOLD,[40,84,52]);leafSign(P,'cape','B',2,10,GOLD,[150,110,40]);knifePaint(P,'L');knifePaint(P,'R');}},
    // the king: long robes of silver and moss, an open overrobe, a crown of autumn leaves and red berries, a staff of pale wood
    wking:{res:2,tex:256,scale:1.14,parts:[...robed(13,11),['crown','head',[0,5.5,0],[-3.75,0,-3.75,7.5,1,7.5],0,{head:1}],
        ['twF','crown',[0,1,3.5],[-3,0,-0.5,6,3,1],0,{head:1,nb:1,tp:['y',1,0.4,0,0]}],['twL','crown',[-3.5,1,0],[-0.5,0,-3,1,3,6],0,{head:1,nb:1,tp:['y',1,0.4,0,0]}],['twR','crown',[3.5,1,0],[-0.5,0,-3,1,3,6],0,{head:1,nb:1,m:'twL',tp:['y',1,0.4,0,0]}],
        ['staff','armR',[1.5,-10,0.5],[-0.5,-10,-0.5,1,34,1],[0.05,0,0],{nb:1}],['knob','staff',[0,24,0],[-1,0,-1,2,3,2],0,{nb:1}]],
      coats:[[{skin:WSKIN[3],hair:WHAIR[4],cl:[206,210,214],cl2:[70,86,60]},3],[{skin:WSKIN[0],hair:WHAIR[1],cl:[200,204,196],cl2:[80,60,44]},1]],
      paint(P,c){elfFace(P,c);cloth(P,['armL','body','robe'],c.cl);hands(P,c);P.map('legL',ALL,()=>[90,90,96]);boots(P,[80,70,60],21);
        cloth(P,['over','slvL'],c.cl2);vine(P,'over',SIDE,28,34,[196,200,206],c.cl2);vine(P,'slvL',SIDE,10,16,[196,200,206],c.cl2);vine(P,'robe',SIDE,40,46,[150,154,160],c.cl);
        P.map('crown',ALL,(s,t)=>(s+t)%3===0?[160,40,34]:sh([200,120,50],hz(s,t,629)*16));
        for(const n of ['twF','twL'])P.map(n,ALL,(s,t,w,h)=>(s*5+t*3)%7===0?[176,30,30]:t>=h-2&&s%2?null:sh(s%3?[214,140,52]:[170,76,40],hz(s,t,631)*14));
        P.map('staff',ALL,(s,t)=>t%11===0?sh(SILV,0):sh([206,190,150],hz(s,t>>2,633)*10));P.map('knob',ALL,(s,t)=>sh([226,240,255],-t*4));}},
    // a lord: robes of green, a circlet of silver leaves
    wlord:{res:2,tex:256,scale:1.08,parts:[...robed(12,8),['circ','head',[0,5,0],[-3.5,0,-3.5,7,1,7],0,{head:1}]],
      coats:[[{skin:WSKIN[0],hair:WHAIR[0],cl:[54,90,60],cl2:[96,74,50]},2],[{skin:WSKIN[1],hair:WHAIR[3],cl:[70,96,70],cl2:[120,96,60]},2],[{skin:WSKIN[2],hair:WHAIR[2],cl:[60,80,90],cl2:[80,100,60]},1]],
      paint(P,c){elfFace(P,c);cloth(P,['armL','body','robe'],c.cl2);hands(P,c);P.map('legL',ALL,()=>[60,52,44]);boots(P,[70,54,40],21);
        cloth(P,['over','slvL'],c.cl);vine(P,'over',SIDE,28,34,[206,210,216],c.cl);vine(P,'slvL',SIDE,10,16,[206,210,216],c.cl);
        plate(P,['circ'],SILV);P.map('circ',SIDE,(s)=>s%3===1?sh(SILV,20):null);}},
    // a lady: a gown of white, silver or pale green with trailing sleeves, a silver circlet, hair to the waist and braided
    wlady:{res:2,tex:256,scale:1.06,parts:[...man(),['gown','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.3,1.35,0,0]}],['girdle','body',[0,0,0],[-5,1.5,-3,10,1,6]],
        ['slvL','armL',[0,-5,0],[-3.5,-10,-2,4,10,4],0,{tp:['-y',1.7,1.8,-0.6,0]}],['slvR','armR',[0,-5,0],[-0.5,-10,-2,4,10,4],0,{m:'slvL',tp:['-y',1.7,1.8,0.6,0]}],
        ['circ','head',[0,5,0],[-3.5,0,-3.5,7,1,7],0,{head:1}],...ears(),...hairB(12),
        ['braidL','head',[-2.5,1,1.5],[-1,-9,-0.5,2,9,1.5],[0,0,0.05],{head:1,nb:1}],['braidR','head',[2.5,1,1.5],[-1,-9,-0.5,2,9,1.5],[0,0,-0.05],{head:1,nb:1,m:'braidL'}]],
      coats:[[{skin:WSKIN[3],hair:WHAIR[0],cl:[236,236,240]},3],[{skin:WSKIN[0],hair:WHAIR[4],cl:[200,208,214]},2],[{skin:WSKIN[1],hair:WHAIR[5],cl:[176,200,170]},2],[{skin:WSKIN[2],hair:WHAIR[3],cl:[214,206,180]},1]],
      paint(P,c){elfFace(P,c);P.map('braidL',ALL,(s,t)=>sh(c.hair,((t+s)%3===0?-18:6)+hz(s,t,635)*8));
        cloth(P,['armL','body','gown','slvL'],c.cl);hands(P,c);P.map('legL',ALL,()=>[190,186,176]);boots(P,[180,176,166],22);
        vine(P,'gown',SIDE,46,52,[176,196,150],c.cl);vine(P,'slvL',SIDE,14,18,[176,196,150],c.cl);
        P.map('body',['F'],(s,t,w)=>t<4&&Math.abs(s-w/2+0.5)<(4-t)+1?sh(c.skin,-4):t===4&&Math.abs(s-w/2+0.5)<5?sh(SILV,(s%2?10:-6)):null);
        plate(P,['girdle'],SILV);plate(P,['circ'],SILV);P.map('circ',['F'],(s)=>s===6||s===7?[200,240,220]:null);}},
    // the folk of the glades: a tunic of green or brown, the hood thrown back on the shoulders, a belt, soft boots
    wfolk:{res:2,tex:256,scale:1.06,parts:[...man(),['tunic','body',[0,0,0],[-4.5,-5,-2.5,9,16,5]],['hoodB','body',[0,10,-2.75],[-4,-3,-1,8,4,2]],['belt','body',[0,0,0],[-5,0.5,-3,10,1,6]],...ears(),...hairB(7)],
      coats:[[{skin:WSKIN[0],hair:WHAIR[0],cl:[76,104,60]},2],[{skin:WSKIN[1],hair:WHAIR[2],cl:[110,84,54]},2],[{skin:WSKIN[2],hair:WHAIR[3],cl:[90,110,90]},2],[{skin:WSKIN[3],hair:WHAIR[5],cl:[120,100,60]},1]],
      paint(P,c){elfFace(P,c);cloth(P,['armL','body','tunic'],c.cl);hands(P,c);P.map('legL',ALL,(s,t)=>sh([84,74,60],hz(s,t,637)*8));boots(P,[96,70,46],21);
        vine(P,'tunic',SIDE,26,30,[200,170,90],c.cl);cloth(P,['hoodB'],sh(c.cl,-14));leather(P,['belt'],[80,56,34]);}}
  });
  MODEL_KIT.wood={coats,leafSign,leaves,vine,ears,hairB,elfFace,hood,hoodPaint,bow,bowPaint,knife,knifePaint,jerkin,jerkinPaint,kit,COP,GOLD,SILV,DEEP,MOSS,CLOAK,BARKC};
})();
