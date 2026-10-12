// ---- The folk of the mountain dwarves (D-066), built and painted like the other folk (FOLK_KIT): boxes measured in pixels, two
// texels to a pixel. A dwarf stands a little under a block and a half: short thick legs, a broad deep body, heavy arms reaching to
// the hip, a big nose, bushy brows, and a beard falling to the belt, its ends braided and bound in bronze and gold. Their
// warriors wear the mountain's livery of deep blue with the golden anvil under three peaks: axeguards a knee-long mail coat under
// the tabard, a round helm with a nasal and cheek plates, a bearded axe and a round shield rimmed in bronze; hammerers plate over
// mail, a helm with a mask of steel and bronze brows, a great hammer; crossbowmen a brimmed kettle hat and a jerkin of leather
// over mail, the crossbow and a case of bolts; captains a winged helm and a blue cloak bearing the anvil, a gilded axe. The king
// goes in crimson and gold over mail under a crown, his beard white and long, a rune staff in hand; thanes in fur-trimmed robes
// with a circlet and a chain of office; ladies in long dresses banded in embroidery, their hair braided in loops and pinned with
// gold; miners in leather caps with a lamp, a pick on the shoulder; smiths in leather aprons with their arms bare, a hammer.
(function(){
  const {ALL,SIDE,sh,hz,cloth,mail,plate,leather,band,rivets,boots,hands,face,STEEL,GOLD}=FOLK_KIT;
  const BRZ=[186,138,72],BLUE=[40,56,112],CRIM=[134,36,40],DIRON=[96,98,106];
  const DSKIN=[[226,182,148],[208,162,126],[190,140,106],[234,198,168],[172,124,92]],DHAIR=[[122,62,30],[72,46,28],[42,34,30],[164,98,48],[150,146,140],[212,208,202],[178,76,36]];
  const coats=b=>DSKIN.map((s,i)=>[{skin:s,hair:DHAIR[(i*3+b)%DHAIR.length],eye:[[70,90,120],[80,60,40],[60,80,60]][(i+b)%3]},i===4?1:2]);
  // the skeleton: short thick legs, a broad deep body, a man's head (so FOLK_KIT's face paints it), thick arms to the hip; a big
  // nose; the beard from under the nose to the belt with two braids at its foot, a moustache over it; long hair down the back
  const dwarf=(o)=>{o=o||{};const bl=o.beard||9;return [['legL',null,[-2.5,7,0],[-2.25,-7,-2.25,4.5,7,4.5]],['legR',null,[2.5,7,0],[-2.25,-7,-2.25,4.5,7,4.5],0,{m:'legL'}],
    ['toeL','legL',[0,0,0],[-2.25,-7,2.25,4.5,2,1.5]],['toeR','legR',[0,0,0],[-2.25,-7,2.25,4.5,2,1.5],0,{m:'toeL'}],
    ['body',null,[0,7,0],[-5,0,-3,10,10,6]],['head','body',[0,10,0],[-3,0,-3,6,7,6],0,{head:1}],
    ['armL','body',[-5,9.5,0],[-3.5,-9,-2,3.5,9,4],[0,0,0.08]],['armR','body',[5,9.5,0],[0,-9,-2,3.5,9,4],[0,0,-0.08],{m:'armL'}],
    ['nose','head',[0,3,3],[-1,-1,0,2,2.5,1.5],0,{head:1,nb:1}],
    ['hairB','head',[0,1,-3],[-3,-5,-1,6,10,1],0,{head:1,nb:1}],
    ...(o.nobeard?[]:[['beard','head',[0,2.5,3],[-3,-bl,-0.25,6,bl+0.5,1.5],[0.1,0,0],{head:1,nb:1,tp:['-y',0.55,1,0,0]}],['must','head',[0,2.6,3.6],[-3.25,-0.75,-0.5,6.5,1.5,1],0,{head:1,nb:1}],
      ['brdL','beard',[-1,-bl,0.5],[-0.5,-3,-0.5,1,3,1],0,{head:1,nb:1}],['brdR','beard',[1,-bl,0.5],[-0.5,-3,-0.5,1,3,1],0,{head:1,nb:1,m:'brdL'}]])];};
  const dface=(P,c,o)=>{face(P,c,Object.assign({eyeRow:3},o||{}));P.map('nose',ALL,(s,t,w,h,f)=>sh(c.skin,hz(s,t,701)*6+(f==='D'?-24:f==='F'?4:-6)+(t===0&&f!=='T'?-10:0)));
    P.map('head',['F'],(s,t)=>t===4&&(s>=1&&s<=4||s>=7&&s<=10)?sh(c.hair,-8+hz(s,t,703)*14):null); // bushy brows
    P.map('hairB',ALL,(s,t,w,h)=>sh(c.hair,hz(s,0,705)*20+(t%4===0?-6:0)-(t>h-3?10:0)));
    P.map('beard',ALL,(s,t,w,h,f)=>sh(c.hair,(s%3===0?-18:s%3===1?10:0)+hz(s,t,707)*10-t/h*8+(f==='B'?-20:0)));
    P.map('must',ALL,(s,t)=>sh(c.hair,(s%2?-10:6)+hz(s,t,709)*8));
    P.map('brdL',ALL,(s,t,w,h)=>t===1||t===h-2?sh(c.ring||BRZ,18):sh(c.hair,((t+s)%3===0?-16:6)+hz(s,t,711)*8));};
  // the mountain's sign: a golden anvil under three white peaks (sixteen texels square), for tabards, cloaks and shields
  const SROWS=['................','.......1........','......111.......','..2..11111..2...','.222.11111.222..','22222111111222..','................','................',
    '..3333333333....','...33333333.....','.....3333.......','......33........','.....333........','....33333.......','................','................'];
  const sign=(P,n,f,s0,t0)=>P.map(n,[f],(s,t)=>{const x=s-s0,y=t-t0;if(x<0||y<0||x>15||y>15)return null;const q=SROWS[y][x];
    return q==='1'?[236,236,240]:q==='2'?[200,204,214]:q==='3'?sh(GOLD,hz(s,t,713)*10+(y===8?16:0)):null;});
  // a knee-long mail coat, a tabard of the livery over it with a gold hem, a belt with a bronze buckle
  const kit=()=>[['coat','body',[0,0,0],[-5.25,-5,-3.25,10.5,15,6.5]],['tab','body',[0,0,0],[-4,-5.5,-3.5,8,15,7]],['belt','body',[0,0,0],[-5.5,1.5,-3.5,11,1.5,7]],
    ['pL','armL',[0,0,0],[-4,-2.5,-2.5,4.5,3,5],0,{tp:['y',0.85,0.85,0,0]}],['pR','armR',[0,0,0],[-0.5,-2.5,-2.5,4.5,3,5],0,{m:'pL',tp:['y',0.85,0.85,0,0]}],
    ['vL','armL',[0,-5,0],[-3.75,-3.5,-2.25,4,3.5,4.5]],['vR','armR',[0,-5,0],[-0.25,-3.5,-2.25,4,3.5,4.5],0,{m:'vL'}]];
  const kitPaint=(P,c)=>{dface(P,c);mail(P,['armL','legL','body','coat']);hands(P,c,[96,70,44]);boots(P,[70,50,34],7);
    cloth(P,['tab'],BLUE);band(P,'tab',SIDE,26,30,GOLD);sign(P,'tab','F',0,2);sign(P,'tab','B',0,2);
    leather(P,['belt'],[86,58,34]);P.map('belt',['F'],(s,t,w)=>Math.abs(s-w/2+0.5)<1.5?sh(BRZ,t===0?20:0):null);
    plate(P,['pL','vL'],STEEL);band(P,'pL',SIDE,0,2,BRZ);rivets(P,'vL',SIDE,2,3,BRZ);};
  // the round helm: steel in plates, a bronze brow band riveted, a nasal and cheek plates; (o.wings) bronze wings swept back
  const helm=o=>[['helm','head',[0,4.5,0],[-3.5,0,-3.5,7,3.5,7],0,{head:1,tp:['y',0.7,0.7,0,0]}],['brow','head',[0,4.5,0],[-3.75,-0.5,-3.75,7.5,1,7.5],0,{head:1}],
    ['nasal','head',[0,4.5,3.5],[-0.5,-2.5,0,1,2.5,1],0,{head:1,nb:1}],['chL','head',[-3.3,4.5,1],[-0.5,-3,-1.5,1,3,3],0,{head:1,nb:1}],['chR','head',[3.3,4.5,1],[-0.5,-3,-1.5,1,3,3],0,{head:1,nb:1,m:'chL'}],
    ...(o&&o.wings?[['wgL','helm',[-3.5,1.5,0],[-0.5,0,-2,1,4,4],[-0.5,0,0.3],{head:1,nb:1,tp:['y',1,0.3,0,-1.2]}],['wgR','helm',[3.5,1.5,0],[-0.5,0,-2,1,4,4],[-0.5,0,-0.3],{head:1,nb:1,m:'wgL',tp:['y',1,0.3,0,-1.2]}]]:[])];
  const helmPaint=(P,o)=>{plate(P,['helm','nasal','chL'],STEEL);P.map('helm',SIDE,(s,t,w)=>s===(w>>1)?sh(STEEL,24):null);plate(P,['brow'],BRZ);rivets(P,'brow',SIDE,0,3,GOLD);
    if(o&&o.wings)P.map('wgL',ALL,(s,t,w,h,f)=>sh(BRZ,(f==='L'||f==='R'?(t%2?-14:10):6)+hz(s,t,715)*8));};
  // the bearded axe: an iron-shod haft, the blade hooked down beneath it, edged bright
  const axe=(len,gold)=>[['haft','armR',[1.75,-8.5,0.5],[-0.5,-0.5,-2,1,1,len]],['axe','haft',[0,0,len-4],[-0.5,-4.5,0,1,6.5,3.5],0,{nb:1,tp:['z',1,0.6,0,-1]}]];
  const axePaint=(P,gold)=>{P.map('haft',ALL,(s,t,w,h,f)=>t%6===0?sh(BRZ,8):sh([92,64,40],hz(s,t>>2,717)*10));
    P.map('axe',ALL,(s,t,w,h,f)=>f==='L'||f==='R'?(t===0?sh([226,230,236],26):sh(gold?GOLD:[188,192,200],s<2?-20:hz(s,t,719)*10)):sh(gold?GOLD:[200,204,210],6));};
  // the round shield: blue within a bronze rim, a bronze boss, the sign
  const shield=['shield','armL',[-3.75,-4.5,0],[-1,-5,-5,1,10,10],0,{nb:1}];
  const shieldPaint=P=>P.map('shield',ALL,(s,t,w,h,f)=>{if(f!=='L')return f==='R'?sh([96,68,42],hz(s,t,721)*10):sh(BRZ,0);const d=Math.hypot(s-w/2+0.5,t-h/2+0.5);
    if(d>w/2)return null;if(d>w/2-1.5)return sh(BRZ,hz(s,t,723)*10+(d>w/2-0.7?-16:10));if(d<2)return sh(BRZ,d<1?24:6);
    return (SROWS[Math.max(0,Math.min(15,Math.round((t-2)*16/(h-4))))]||'')[Math.max(0,Math.min(15,Math.round((s-2)*16/(w-4))))]==='3'?sh(GOLD,0):sh(BLUE,hz(s,t,725)*8);});
  Object.assign(AM_KINDS,{
    // the axeguard: mail and the tabard, the round helm, a bearded axe and a round shield
    daxe:{res:2,tex:256,scale:0.95,parts:[...dwarf(),...kit(),...helm(),...axe(11),shield],coats:coats(0),
      paint(P,c){kitPaint(P,c);helmPaint(P);axePaint(P);shieldPaint(P);}},
    // the hammerer: plate over mail, a masked helm, a great hammer
    dhammer:{res:2,tex:256,scale:0.97,parts:[...dwarf({beard:7}),...kit(),['cuir','body',[0,0,0],[-5.5,1,-3.5,11,9.5,7],0,{tp:['-y',0.95,0.9,0,0]}],['skirt','body',[0,1,0],[-5.5,-5.5,-3.5,11,6,7],0,{tp:['-y',1.12,1.1,0,0]}],
        ['grL','legL',[0,0,0],[-2.5,-5.5,-2.5,5,4.5,5]],['grR','legR',[0,0,0],[-2.5,-5.5,-2.5,5,4.5,5],0,{m:'grL'}],
        ['helm','head',[0,0,0],[-3.5,1.5,-3.5,7,6.5,7],0,{head:1,tp:['y',0.8,0.8,0,0]}],['mask','head',[0,3,3.5],[-3,-1.5,0,6,4,1],0,{head:1,nb:1}],
        ['haft','armR',[1.75,-8.5,0.5],[-0.5,-0.5,-3,1,1,15]],['maul','haft',[0,0,11],[-2,-2,0,4,4,5],0,{nb:1}]],coats:coats(1),
      paint(P,c){kitPaint(P,c);plate(P,['cuir','skirt','grL','helm'],STEEL);P.map('skirt',SIDE,(s,t)=>t%3===0?sh(STEEL,-24):null);band(P,'cuir',SIDE,0,2,BRZ);sign(P,'cuir','F',3,3);
        P.map('helm',SIDE,(s,t,w)=>s===(w>>1)?sh(BRZ,10):null);plate(P,['mask'],STEEL);P.map('mask',['F'],(s,t,w)=>t===4&&(s>=1&&s<=4||s>=7&&s<=10)?[20,20,24]:t===5?sh(BRZ,14):s===5||s===6?sh(STEEL,26):null);
        P.map('haft',ALL,(s,t)=>t%5===0?sh(BRZ,6):sh([86,60,38],hz(s,t>>2,727)*10));plate(P,['maul'],DIRON);P.map('maul',SIDE,(s,t)=>(s+t)%4===0?sh(BRZ,8):null);}},
    // the crossbowman: a brimmed kettle hat, leather over mail, the crossbow and a case of bolts
    dxbow:{res:2,tex:256,scale:0.95,parts:[...dwarf(),['jerk','body',[0,0,0],[-5.25,-4,-3.25,10.5,14,6.5]],['belt','body',[0,0,0],[-5.5,1.5,-3.5,11,1.5,7]],
        ['hat','head',[0,5,0],[-3.5,0,-3.5,7,2.5,7],0,{head:1,tp:['y',0.75,0.75,0,0]}],['brim','head',[0,5,0],[-4.75,-0.5,-4.75,9.5,1,9.5],0,{head:1}],
        ['stock','armR',[1.75,-8.5,0.5],[-0.5,-0.75,-2,1,1.5,9]],['prod','stock',[0,0,6],[-4.5,-0.5,-0.5,9,1,1],[0,0.1,0],{nb:1,tp:['x',1,1,0,0]}],
        ['case','body',[4.5,2,-2],[-1,-3,-1,2,7,2],[0,0,-0.2],{nb:1}],['bolts','case',[0,4,0],[-0.75,0,-0.75,1.5,2,1.5],0,{nb:1}]],coats:coats(2),
      paint(P,c){dface(P,c);mail(P,['armL','legL','body']);hands(P,c,[100,74,48]);boots(P,[74,52,34],7);leather(P,['jerk'],[112,80,50]);band(P,'jerk',SIDE,24,28,BLUE);
        leather(P,['belt'],[80,54,32]);plate(P,['hat','brim'],STEEL);band(P,'hat',SIDE,0,1,BRZ);
        P.map('stock',ALL,(s,t)=>sh([110,78,48],hz(s,t>>1,729)*10+(t%6===0?-12:0)));plate(P,['prod'],DIRON);leather(P,['case'],[90,62,38]);P.map('bolts',ALL,(s,t)=>(s+t)%2?[220,214,196]:[60,70,110]);}},
    // the captain: the axeguard's kit under a winged helm and a blue cloak with the sign, a gilded axe and the shield
    dcapt:{res:2,tex:256,scale:1,parts:[...dwarf({beard:10}),...kit(),...helm({wings:1}),['cape','body',[0,10,-3.2],[-5,-15,-0.5,10,15,1],[0.06,0,0],{nb:1}],...axe(12),shield],coats:coats(3),
      paint(P,c){kitPaint(P,c);helmPaint(P,{wings:1});cloth(P,['cape'],BLUE,{off:2});band(P,'cape',SIDE,26,30,GOLD);sign(P,'cape','B',2,6);axePaint(P,1);shieldPaint(P);plate(P,['pL'],sh(STEEL,10));band(P,'pL',SIDE,0,3,GOLD);}},
    // the king: crimson and gold over mail, a crown, a long white beard, a rune staff of iron with a gold head
    dking:{res:2,tex:256,scale:1.02,parts:[...dwarf({beard:12}),['robe','body',[0,1,0],[-5.25,-8,-3.25,10.5,9,6.5],0,{tp:['-y',1.12,1.12,0,0]}],['over','body',[0,0,0],[-5.5,-4,-3.5,11,14.5,7]],
        ['mantle','body',[0,9,0],[-6,-3,-3.75,12,3.5,7.5]],['crown','head',[0,6.5,0],[-3.75,0,-3.75,7.5,1.5,7.5],0,{head:1}],['cpt','crown',[0,1.5,0],[-3.75,0,-3.75,7.5,1.5,7.5],0,{head:1,nb:1}],
        ['staff','armR',[1.75,-8.5,0.5],[-0.5,-10,-0.5,1,28,1],[0.05,0,0],{nb:1}],['knob','staff',[0,18,0],[-1.25,0,-1.25,2.5,3,2.5],0,{nb:1}]],
      coats:[[{skin:DSKIN[3],hair:DHAIR[5],ring:GOLD},3],[{skin:DSKIN[0],hair:DHAIR[4],ring:GOLD},1]],
      paint(P,c){dface(P,c);mail(P,['armL','legL','body']);hands(P,c);boots(P,[80,40,34],7);cloth(P,['robe','over'],CRIM);band(P,'over',SIDE,26,29,GOLD);band(P,'robe',SIDE,14,17,GOLD);
        P.map('over',['F'],(s,t,w)=>Math.abs(s-w/2+0.5)<1.2?sh(GOLD,hz(s,t,731)*10):null);cloth(P,['mantle'],[226,220,206]);P.map('mantle',ALL,(s,t)=>(s*3+t*5)%7===0?[40,36,34]:null);
        plate(P,['crown'],GOLD);P.map('cpt',ALL,(s,t,w,h,f)=>f==='T'||f==='D'?null:s%3===1?sh(GOLD,t===h-1?20:4):null);P.map('crown',['F'],(s)=>s===6||s===7?[60,140,200]:null);
        P.map('staff',ALL,(s,t)=>t%9===0?sh(GOLD,0):sh(DIRON,hz(s,t>>2,733)*10));plate(P,['knob'],GOLD);}},
    // a thane: a robe trimmed in fur, a circlet, a chain of office
    dlord:{res:2,tex:256,scale:0.97,parts:[...dwarf(),['robe','body',[0,1,0],[-5.25,-8,-3.25,10.5,9,6.5],0,{tp:['-y',1.1,1.1,0,0]}],['over','body',[0,0,0],[-5.5,-4,-3.5,11,14.5,7]],
        ['fur','body',[0,9,0],[-5.75,-1,-3.75,11.5,2.5,7.5]],['circ','head',[0,5.5,0],[-3.5,0,-3.5,7,1,7],0,{head:1}],['chain','body',[0,9,3.5],[-3.5,-5,0,7,5,0.5],0,{nb:1,tp:['-y',0.4,1,0,0]}]],
      coats:[[{skin:DSKIN[0],hair:DHAIR[0],cl:[60,80,120],ring:GOLD},2],[{skin:DSKIN[1],hair:DHAIR[2],cl:[110,60,40],ring:GOLD},2],[{skin:DSKIN[2],hair:DHAIR[4],cl:[60,90,70],ring:BRZ},1]],
      paint(P,c){dface(P,c);cloth(P,['armL','body','robe','over'],c.cl);band(P,'over',SIDE,26,29,GOLD);hands(P,c);boots(P,[70,50,36],7);P.map('legL',ALL,(s,t)=>t<7?sh(c.cl,-30):null);
        cloth(P,['fur'],[150,120,90]);P.map('fur',ALL,(s,t)=>(s+t)%2?sh([150,120,90],14):sh([110,84,60],0));plate(P,['circ'],GOLD);P.map('chain',ALL,(s,t)=>(s+t)%2?sh(GOLD,10):null);}},
    // a lady of the hold: a long dress banded in embroidery, braids in loops pinned with gold, a girdle
    dlady:{res:2,tex:256,scale:0.94,parts:[...dwarf({nobeard:1}),['dress','body',[0,1,0],[-5.25,-8,-3.25,10.5,9,6.5],0,{tp:['-y',1.18,1.15,0,0]}],['girdle','body',[0,1.5,0],[-5.5,0,-3.5,11,1,7]],
        ['loopL','head',[-3.25,2.5,0],[-1,-2,-1.5,1.5,4,3],0,{head:1,nb:1}],['loopR','head',[3.25,2.5,0],[-0.5,-2,-1.5,1.5,4,3],0,{head:1,nb:1,m:'loopL'}],
        ['bun','head',[0,5,-3.5],[-2,0,-1,4,3,1.5],0,{head:1,nb:1}]],
      coats:[[{skin:DSKIN[3],hair:DHAIR[0],cl:[120,40,44]},2],[{skin:DSKIN[0],hair:DHAIR[3],cl:[50,70,120]},2],[{skin:DSKIN[1],hair:DHAIR[6],cl:[70,100,70]},2],[{skin:DSKIN[2],hair:DHAIR[1],cl:[150,120,70]},1]],
      paint(P,c){dface(P,c);cloth(P,['armL','body','dress'],c.cl);band(P,'dress',SIDE,12,15,GOLD);band(P,'body',SIDE,16,18,GOLD);hands(P,c);boots(P,[90,60,40],10);
        plate(P,['girdle'],GOLD);for(const n of ['loopL','bun'])P.map(n,ALL,(s,t)=>t===1?sh(GOLD,10):sh(c.hair,((t+s)%3===0?-16:6)+hz(s,t,735)*8));}},
    // a miner: a leather cap with its lamp, a rough tunic and an apron, a pick
    dminer:{res:2,tex:256,scale:0.94,parts:[...dwarf(),['tunic','body',[0,0,0],[-5.25,-4,-3.25,10.5,14,6.5]],['apron','body',[0,0,3.3],[-4,-4.5,0,8,10,0.5]],['belt','body',[0,0,0],[-5.5,1.5,-3.5,11,1.5,7]],
        ['cap','head',[0,5,0],[-3.5,0,-3.5,7,2.5,7],0,{head:1,tp:['y',0.8,0.8,0,0]}],['lamp','cap',[0,0.5,3.5],[-1,-0.5,0,2,2,1],0,{head:1,nb:1}],
        ['haft','armR',[1.75,-8.5,0.5],[-0.5,-0.5,-2,1,1,10]],['pick','haft',[0,0,8],[-0.5,-4,0,1,8,1.5],0,{nb:1,tp:['y',1,0.5,0,0]}]],coats:coats(4),
      paint(P,c){dface(P,c);cloth(P,['armL','body','tunic'],[110,96,80]);hands(P,c,[86,66,46]);boots(P,[70,52,36],7);P.map('legL',ALL,(s,t)=>t<7?sh([90,76,60],hz(s,t,737)*8):null);
        leather(P,['apron','cap'],[96,70,46]);leather(P,['belt'],[70,50,30]);P.map('lamp',ALL,(s,t,w,h,f)=>f==='F'?[255,226,140]:sh(BRZ,0));
        P.map('haft',ALL,(s,t)=>sh([110,80,50],hz(s,t>>2,739)*10));plate(P,['pick'],DIRON);}},
    // a smith: a leather apron over bare arms, a hammer
    dsmith:{res:2,tex:256,scale:0.95,parts:[...dwarf(),['apron','body',[0,0,0],[-5.25,-5,-3.25,10.5,15,6.5]],['belt','body',[0,0,0],[-5.5,1.5,-3.5,11,1.5,7]],
        ['haft','armR',[1.75,-8.5,0.5],[-0.5,-0.5,-1,1,1,7]],['hmr','haft',[0,0,5],[-1.25,-1.25,0,2.5,2.5,3],0,{nb:1}]],coats:coats(5),
      paint(P,c){dface(P,c);P.map('armL',ALL,(s,t)=>sh(c.skin,hz(s,t,741)*8-(t<6?0:4)));P.map('body',ALL,()=>sh(c.skin,-6));boots(P,[70,52,36],7);P.map('legL',ALL,(s,t)=>t<7?sh([80,70,60],hz(s,t,743)*8):null);
        leather(P,['apron'],[100,66,40]);leather(P,['belt'],[70,50,30]);P.map('apron',['F'],(s,t)=>t%9===4?sh([100,66,40],-20):null);
        P.map('haft',ALL,(s,t)=>sh([110,80,50],hz(s,t>>1,745)*10));plate(P,['hmr'],DIRON);}}
  });
  MODEL_KIT.dwarf={coats,dwarf,dface,kit,kitPaint,helm,helmPaint,axe,axePaint,shield,shieldPaint,sign,BRZ,BLUE,CRIM,DIRON};
})();
