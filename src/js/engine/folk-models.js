// ---- The folk of the realms of men (D-060): soldiers and townsfolk, built like the foes (foe-models.js) from boxes measured in
// pixels, in human proportions (about 1.9 blocks tall), and painted at two texels to a pixel (res 2) so their gear shows
// its make: mail in rows of rings, plate lit along its edges and riveted, cloth hanging in folds, leather stitched.
// The soldiers wear the realm's livery: a black surcoat over mail with the white star-and-tower on the breast and a silver hem,
// a belt with a buckle, a conical helm with a nasal, cheek guards and a white crest over a mail collar, layered pauldrons,
// vambraces and greaves; spearmen carry a leaf-bladed spear, swordsmen a sword with its guard and pommel, both a black kite
// shield with the sign; archers a curved longbow and a quiver of fletched arrows; captains a black cloak with the sign, a
// gilded sword and a white plume. The townsfolk dress by their trade: a tunic with a belt and purse, a laced gown with an
// apron, a merchant's fur-trimmed robe and feathered hat, a smith's stitched leather apron and hammer, a farmer's smocked
// shirt and woven straw hat, a lord's robe embroidered in silver under a white mantle, a chain of office and a circlet.
// The painting helpers are shared with the riders' folk (rider-models.js, D-061) as FOLK_KIT.
const FOLK_KIT=(function(){
  const SK=[[226,186,152],[204,160,122],[176,128,94],[142,96,66],[232,198,170]],HAIR=[[40,30,24],[70,46,30],[112,76,44],[150,96,52],[150,146,140],[30,26,26]];
  const ALL=['L','F','R','B','T','D'],SIDE=['L','F','R','B'],sh=(c,k)=>[c[0]+k,c[1]+k,c[2]+k],hz=(s,t,q)=>amHash(s,t,q)-0.5;
  const legs=()=>[['legL',null,[-2,12,0],[-2,-12,-2,4,12,4]],['legR',null,[2,12,0],[-2,-12,-2,4,12,4],0,{m:'legL'}],
    ['toeL','legL',[0,0,0],[-2,-12,2,4,2,1]],['toeR','legR',[0,0,0],[-2,-12,2,4,2,1],0,{m:'toeL'}]];
  const arms=r=>[['armL','body',[-4,10.5,0],[-3,-11,-1.5,3,11,3],[r||0,0,0.06]],['armR','body',[4,10.5,0],[0,-11,-1.5,3,11,3],[r||0,0,-0.06],{m:'armL'}]];
  const man=()=>[...legs(),['body',null,[0,12,0],[-4,0,-2,8,11,4]],['head','body',[0,11,0],[-3,0,-3,6,7,6],0,{head:1}],...arms()];
  // ---- painting at two texels to a pixel
  // cloth: folds hanging down it (a shaded and a lit line every few texels), a faint weave, darker toward the hem
  const cloth=(P,ns,col,o)=>{const off=o&&o.off||0;for(const n of ns)P.map(n,ALL,(s,t,w,h,f)=>{const top=f==='T'||f==='D',q=(s+off)%5;
    return sh(col,(top?0:q===0?-14:q===1?8:0)+hz(s,t,11)*7+((s+t)%2?2:-2)-(f==='D'?16:top?0:t/h*12));});};
  // mail: rows of rings, each lit along its upper edge and dark in its gap, every other row offset
  const MAIL=[126,130,138];
  const mail=(P,ns)=>{for(const n of ns)P.map(n,ALL,(s,t,w,h)=>{const r=(s+(t>>1))%2,u=t%2;return sh(MAIL,(r===0?(u===0?34:6):(u===0?-6:-30))+hz(s,t,13)*8-t/h*10);});};
  // plate: steel lit along its top, shaded at its foot, a highlight running down it, its side edges dark
  const STEEL=[172,178,188],SILVER=[204,210,220],GOLD=[214,176,84],BLACK=[30,32,42];
  const plate=(P,ns,col)=>{for(const n of ns)P.map(n,ALL,(s,t,w,h,f)=>{if(f==='T')return sh(col,18+hz(s,t,17)*6);if(f==='D')return sh(col,-32);
    return sh(col,(t===0?30:t===1?12:t===h-1?-34:0)+(s===Math.floor(w/3)?20:s===Math.floor(w/3)+1?8:0)+(s===0||s===w-1?-14:0)+hz(s,t,19)*6-t/h*10);});};
  // leather: stained and creased, stitched along its edges
  const leather=(P,ns,col,soft)=>{const k=soft?0.45:1;for(const n of ns)P.map(n,ALL,(s,t,w,h)=>{const st=w>4&&h>4&&(s===1||s===w-2||t===1||t===h-2)&&(s+t)%2===0;
    return st?sh(col,30):sh(col,(hz(s>>1,t>>1,23)*16+hz(s,t,29)*8)*k-t/h*8);});};
  // a band of rows (lit along its top), rivets along a row, boots with their soles and toes, hands bare or gloved
  const band=(P,n,fs,t0,t1,col)=>P.map(n,fs,(s,t)=>t>=t0&&t<t1?sh(col,(t===t0?22:t===t1-1?-14:0)+hz(s,t,31)*6):null);
  const rivets=(P,n,fs,t,step,col)=>P.map(n,fs,(s,tt)=>s%step!==step>>1?null:tt===t?sh(col,44):tt===t+1?sh(col,-26):null);
  const boots=(P,col,h0)=>{P.map('legL',ALL,(s,t,w,h,f)=>f==='D'?[34,26,20]:t>=h0?(t===h-1?[40,30,24]:t===h0?sh(col,24):sh(col,hz(s,t,33)*12+((t-h0)%4===0?-10:0))):null);
    P.map('toeL',ALL,(s,t,w,h,f)=>f==='D'||t===h-1?[40,30,24]:sh(col,(f==='T'?18:0)+hz(s,t,35)*10));};
  const hands=(P,c,glove)=>P.map('armL',ALL,(s,t,w,h,f)=>f==='D'||t>=h-4?(glove?sh(glove,(t===h-4?24:0)+hz(s,t,61)*10-(f==='D'?20:0)):sh(c.skin,hz(s,t,63)*6-(t===h-4?14:0))):null);
  // the realm's sign as it is worked on cloth and painted on shields, sixteen texels square: an eight-pointed star (long rays
  // up, down and across, short ones on the diagonals) over a slender tower with three merlons and a wider footing
  const SIGN_ROWS=['.......11.......','.....1.11.1.....','......1111......','...1111111111...','......1111......','.....1.11.1.....','.......11.......','................',
    '.....1.11.1.....','.....111111.....','......1111......','......1111......','......1111......','......1111......','.....111111.....','....11111111....'];
  const SIGN=(x,y)=>x>=0&&y>=0&&x<16&&y<16&&SIGN_ROWS[y][x]==='1'?1:0;
  const sign=(P,n,f,s0,t0,col)=>P.map(n,[f],(s,t)=>SIGN(s-s0,t-t0)?sh(col,hz(s,t,37)*6):null);
  // a face: eyes with their whites, irises and lids, brows, the nose's shading and nostrils, cheeks, lips; hair over the crown,
  // down the back and over the ears, a fringe with its parting; a beard round the mouth and down the jaw where the coat has one
  const face=(P,c,o)=>{const sk=c.skin,er=(o&&o.eyeRow!==undefined?o.eyeRow:3)*2,hr=c.hair,lg=o&&o.long;
    P.map('head',ALL,(s,t,w,h,f)=>sh(sk,hz(s,t,41)*6-(f==='D'?20:0)));
    P.map('head',['F'],(s,t)=>{const L=s>=2&&s<=4,R=s>=7&&s<=9;
      if(t===er-1&&(L||R))return sh(hr,-10);
      if((t===er||t===er+1)&&(L||R)){const m=L?s-2:9-s;if(m===1)return t===er?[26,22,22]:(c.eye||[70,100,140]);return t===er?sh(sk,-26):[236,234,228];}
      if(t===er+2&&(s===5||s===6))return sh(sk,s===5?-16:-6);if(t===er+3&&(s===5||s===6))return sh(sk,s===5?-36:-24);
      if((t===er+3||t===er+4)&&(s===2||s===3||s===8||s===9))return [sk[0]+6,sk[1]-12,sk[2]-10];
      if(t===er+5&&s>=4&&s<=7)return [150,80,72];if(t===er+6&&s>=5&&s<=6)return [186,122,110];return null;});
    P.map('head',['T'],(s,t)=>sh(hr,hz(s,t,43)*16+(s===5?-16:0)));
    P.map('head',['B'],(s,t,w,h)=>t<(lg?h:12)?sh(hr,hz(s,0,45)*18+(t%3===0?-6:0)+(t===11&&!lg?-12:0)):null);
    P.map('head',['L','R'],(s,t,w,h,f)=>{const back=f==='L'?s<5:s>=w-5;if(t<3||back&&t<(lg?h:Math.max(er+2,11)))return sh(hr,hz(s,0,47)*16+(t%3===0?-5:0));
      return t>=er&&t<=er+2&&(f==='L'?s===6||s===7:s===4||s===5)?sh(sk,t===er+1?-26:-14):null;});
    P.map('head',['F'],(s,t)=>t<2||t===2&&(s<2||s>9)?sh(hr,hz(s,0,49)*16+(s===4&&t<2?-22:0)):null);
    if(lg)P.map('head',['F'],(s,t,w,h)=>(s===0||s===w-1)&&t<h-2?sh(hr,hz(s,t,51)*14):null);
    if(c.beard)P.map('head',['F','L','R'],(s,t,w,h,f)=>{if(f==='F'){const lip=t===er+5&&s>=4&&s<=7||t===er+6&&s>=5&&s<=6;if(lip)return null;
        if(t>=er+5||t===er+4&&(s<=3||s>=8)||t>=er+3&&(s<=1||s>=10))return sh(hr,hz(s,t,53)*20+(t===er+4?6:0));return null;}
      return t>=er+3&&(f==='L'?s>=6:s<=5)?sh(hr,hz(s,t,55)*18):null;});};
  // ---- soldiers
  const soldier=(extra,o)=>[...man(),['coat','body',[0,0,0],[-4.5,-5,-2.5,9,16,5]],['belt','body',[0,0,0],[-5,2,-3,10,1,6]],
    ['avent','head',[0,0,0],[-3.5,-2,-3.5,7,2,7],0,{head:1}],
    ['helm','head',[0,4,0],[-3.5,0,-3.5,7,4,7],0,{head:1,tp:['y',0.62,0.62,0,0]}],['brim','head',[0,4,0],[-3.5,-0.5,-3.5,7,1,7],0,{head:1}],
    ['nasal','head',[0,4,0],[-0.5,-2,3,1,2,1],0,{head:1}],
    ['chL','head',[-3,4,0],[-0.5,-3,-1,1,3,3],0,{head:1}],['chR','head',[3,4,0],[-0.5,-3,-1,1,3,3],0,{head:1,m:'chL'}],
    ['crest','helm',[0,4,0],[-0.5,0,-3,1,(o&&o.plume)?5:3,7],0,{head:1,nb:1,tp:['y',1,0.7,0,-0.5]}],
    ['pL','armL',[0,0,0],[-3.5,-2.5,-2,4,3,4],0,{tp:['y',0.8,0.8,0,0]}],['pR','armR',[0,0,0],[-0.5,-2.5,-2,4,3,4],0,{m:'pL',tp:['y',0.8,0.8,0,0]}],
    ['lL','armL',[0,-2.5,0],[-3.5,-2,-2,4,2,4],0,{tp:['-y',1.1,1.1,0,0]}],['lR','armR',[0,-2.5,0],[-0.5,-2,-2,4,2,4],0,{m:'lL',tp:['-y',1.1,1.1,0,0]}],
    ['vL','armL',[0,-6,0],[-3.5,-4,-2,4,4,4]],['vR','armR',[0,-6,0],[-0.5,-4,-2,4,4,4],0,{m:'vL'}],
    ['grL','legL',[0,0,0],[-2.5,-9,-2.5,5,5,5]],['grR','legR',[0,0,0],[-2.5,-9,-2.5,5,5,5],0,{m:'grL'}],...extra];
  const soldierPaint=(P,c,o)=>{const capt=o&&o.plume;face(P,c,{eyeRow:4});mail(P,['armL','legL','avent','body']);hands(P,c,STEEL);boots(P,[70,50,34],18);
    // the surcoat: black, hanging in folds, a silver hem and edging, the sign on breast and back, a slit up the front
    cloth(P,['coat'],BLACK);band(P,'coat',SIDE,28,32,SILVER);P.map('coat',['L','R'],(s,t)=>t<2?sh(SILVER,hz(s,t,65)*6):null);
    P.map('coat',['F','B'],(s,t)=>(s===8||s===9)&&t>=24?[16,16,22]:null);sign(P,'coat','F',1,3,[238,240,244]);sign(P,'coat','B',1,3,[238,240,244]);
    // the belt and its buckle
    leather(P,['belt'],[86,58,34]);P.map('belt',['F'],(s,t)=>s>=9&&s<=11?(s===10&&t===1?[60,44,26]:sh(GOLD,t===0?20:0)):null);
    // the helm: its plates joined down the middle, a silver brow band riveted, the nasal and the cheek guards studded
    plate(P,['helm','nasal','chL'],STEEL);P.map('helm',SIDE,(s,t,w)=>s===(w>>1)||s===(w>>1)-1?sh(STEEL,s===(w>>1)?-26:22):null);
    plate(P,['brim'],SILVER);rivets(P,'brim',SIDE,0,3,SILVER);P.map('chL',['L','R'],(s,t)=>(s+t)%3===0&&t>0?sh(STEEL,36):null);
    P.map('crest',ALL,(s,t,w,h,f)=>sh(capt?[240,240,244]:[228,228,232],hz(s,t,67)*14+(f==='L'||f==='R'?(s%2?-12:6):0)));
    // pauldrons and their lames, vambraces, greaves banded at the knee: steel and riveted, silver on the captain
    plate(P,['pL','lL','vL','grL'],capt?SILVER:STEEL);rivets(P,'pL',SIDE,4,4,STEEL);rivets(P,'vL',SIDE,1,4,STEEL);
    band(P,'grL',SIDE,0,3,sh(STEEL,10));rivets(P,'grL',SIDE,4,5,STEEL);};
  // the kite shield: black, rimmed and riveted in silver, the sign in white; its inner face planked, with a strap across
  const shield=['shield','armL',[-3.5,-6,0],[-1,-7,-4,1,12,8],0,{nb:1,tp:['-y',1,0.15,0,0]}];
  const shieldPaint=P=>{P.map('shield',ALL,(s,t,w,h,f)=>{
      if(f==='R')return t>=8&&t<=10?sh([70,46,28],hz(s,t,73)*8):t%5===0?[70,48,30]:sh([116,82,50],hz(s,t,71)*14);
      if(f!=='L')return sh(SILVER,hz(s,t,75)*6-10);if(s===0||s===w-1||t===0)return sh(SILVER,(t===0?18:0)+hz(s,t,77)*6);
      return (s===1||s===w-2||t===1)&&(s+t)%3===0?sh(SILVER,30):sh(BLACK,hz(s,t,79)*8+(s<4?6:0));});
    sign(P,'shield','L',0,3,[238,240,244]);};
  const coats=b=>SK.map((s,i)=>[{skin:s,hair:HAIR[(i*2+b)%HAIR.length],beard:(i+b)%3===0,eye:[[70,100,140],[90,70,50],[80,110,90]][(i+b)%3]},i===4?1:2]);
  // a sword: a leather grip bound with wire, a pommel and a cross-guard, the blade lit along its edges with a dark fuller down it
  const sword=len=>[['grip','armR',[1.5,-10.5,0.5],[-0.5,-0.5,-1.5,1,1,3],0,{nb:1}],['pommel','grip',[0,0,-1.5],[-1,-1,-1,2,2,1],0,{nb:1}],
    ['guard','grip',[0,0,1.5],[-0.5,-2.5,0,1,5,1],0,{nb:1}],['blade','grip',[0,0,2.5],[-0.5,-1,0,1,2,len],0,{nb:1,tp:['z',1,0,0,0]}]];
  const swordPaint=(P,gold)=>{P.map('grip',ALL,(s,t)=>(s+t)%3===0?sh([180,180,190],20):sh([74,50,32],hz(s,t,81)*10));plate(P,['pommel','guard'],gold?GOLD:STEEL);
    P.map('blade',ALL,(s,t,w,h,f)=>f==='L'||f==='R'?sh([214,218,226],t===0||t===h-1?22:t===1?-34:-8+hz(s,t,83)*6):sh([226,230,236],10));};
  Object.assign(AM_KINDS,{
    rspear:{res:2,tex:256,parts:soldier([shield,['spear','armR',[1.5,-10,0.5],[-0.5,-7,-0.5,1,29,1],[0.15,0,0],{nb:1}],
        ['lug','spear',[0,21,0],[-1.5,0,-0.5,3,1,1],0,{nb:1}],['tipA','spear',[0,22,0],[-1,0,-0.5,2,2,1],0,{nb:1,tp:['-y',0.4,1,0,0]}],
        ['tipB','spear',[0,24,0],[-1,0,-0.5,2,4,1],0,{nb:1,tp:['y',0,1,0,0]}]]),coats:coats(0),
      paint(P,c){soldierPaint(P,c);shieldPaint(P);
        // an ash shaft, bound in two places; steel lugs; the leaf blade lit along its edges, a dark midrib
        P.map('spear',ALL,(s,t,w,h)=>t>=24&&t<=30||t>=h-30&&t<=h-24?((t>>1)%2?[60,40,26]:[150,120,80]):sh([112,82,52],hz(s,t>>2,85)*14));
        plate(P,['lug'],STEEL);P.map('tipA',ALL,(s,t,w)=>sh([206,212,220],s===(w>>1)?-18:10));P.map('tipB',ALL,(s,t,w)=>sh([214,220,228],s===(w>>1)||s===(w>>1)-1?-16:16));}},
    rsword:{res:2,tex:256,parts:soldier([shield,['sheath','body',[-4.6,2,0.5],[-0.5,-10,-1,1,10,2],[0.3,0,0.08],{nb:1}],...sword(11)]),coats:coats(1),
      paint(P,c){soldierPaint(P,c);shieldPaint(P);swordPaint(P);leather(P,['sheath'],[60,40,26]);band(P,'sheath',SIDE,0,2,STEEL);band(P,'sheath',SIDE,18,20,STEEL);}},
    rbow:{res:2,tex:256,parts:soldier([['bowU','armL',[-1.5,-10,1.5],[-0.5,0,-0.5,1,9,1],[-0.22,0,0],{nb:1,tp:['y',0.6,0.6,0,0]}],
        ['bowD','armL',[-1.5,-10,1.5],[-0.5,-9,-0.5,1,9,1],[0.22,0,0],{nb:1,tp:['-y',0.6,0.6,0,0]}],['bgrip','armL',[-1.5,-10,1.5],[-1,-1,-1,2,2,2],0,{nb:1}],
        ['bstr','armL',[-1.5,-10,-0.5],[-0.5,-8,-0.5,1,16,1],0,{nb:1}],
        ['quiver','body',[2,6,-2.5],[-1,-3,-2,2,10,2],[0.3,0,0.2],{nb:1}],['fletch','quiver',[0,7,-1],[-1,0,-1,2,2,2],0,{nb:1}]]),coats:coats(2),
      paint(P,c){soldierPaint(P,c);
        // the bow's limbs of yew, dark at their nocks; its grip bound in cord; a pale string; a stitched quiver and red-and-white fletching
        P.map('bowU',ALL,(s,t)=>sh([124,86,48],hz(s,t>>1,87)*12+(s===0?10:0)+(t<2?-24:0)));P.map('bowD',ALL,(s,t,w,h)=>sh([124,86,48],hz(s,t>>1,89)*12+(s===0?10:0)+(t>=h-2?-24:0)));
        P.map('bgrip',ALL,(s,t)=>(t+s)%2?[72,50,30]:[200,170,100]);P.map('bstr',ALL,()=>[228,224,210]);
        leather(P,['quiver'],[96,62,36]);band(P,'quiver',SIDE,0,3,[60,40,26]);P.map('fletch',ALL,(s,t)=>(s+t)%2?[238,236,230]:[150,40,36]);}},
    rcapt:{res:2,tex:256,scale:1.05,parts:soldier([['cape','body',[0,10.5,-2.4],[-4.5,-17,-0.5,9,17,1],[0.1,0,0],{nb:1}],['clasp','body',[0,10,-2.2],[-4.5,-1,-0.5,9,1,1],0,{nb:1}],
        ['sheath','body',[-4.6,2,0.5],[-0.5,-11,-1,1,11,2],[0.3,0,0.08],{nb:1}],...sword(12)],{plume:1}),coats:coats(3),
      paint(P,c){soldierPaint(P,c,{plume:1});cloth(P,['cape'],[24,24,34],{off:2});band(P,'cape',SIDE,30,34,SILVER);sign(P,'cape','B',1,5,[238,240,244]);
        P.map('clasp',ALL,(s,t,w)=>s<3||s>=w-3?sh(GOLD,(t===0?20:0)+hz(s,t,91)*8):[30,30,40]);
        // a silver sash across the surcoat, the captain's mark
        P.map('coat',['F'],(s,t)=>Math.abs((s+t)-22)<=1&&t<22?sh(SILVER,(s+t)===21?16:0):null);swordPaint(P,1);leather(P,['sheath'],[40,30,30]);band(P,'sheath',SIDE,0,2,GOLD);band(P,'sheath',SIDE,20,22,GOLD);}},
    // ---- townsfolk
    rman:{res:2,tex:256,parts:[...man(),['tunic','body',[0,0,0],[-4.5,-4,-2.5,9,15,5]],['belt','body',[0,0,0],[-5,3,-3,10,1,6]],['pouch','body',[2.5,3.5,2.5],[-1,-3,0,2,3,1],0,{nb:1}]],
      coats:[[{skin:SK[0],hair:HAIR[1],cl:[110,80,52],hose:[70,74,60],beard:1},2],[{skin:SK[1],hair:HAIR[0],cl:[70,96,74],hose:[96,78,56]},2],[{skin:SK[2],hair:HAIR[2],cl:[132,60,48],hose:[60,60,70],beard:1},2],
        [{skin:SK[3],hair:HAIR[5],cl:[90,90,120],hose:[80,66,50],eye:[90,70,50]},1],[{skin:SK[4],hair:HAIR[4],cl:[150,130,90],hose:[70,60,50],beard:1},1]],
      paint(P,c){face(P,c);cloth(P,['armL','tunic','body'],c.cl);hands(P,c);cloth(P,['legL'],c.hose,{off:1});boots(P,[78,56,36],19);
        band(P,'tunic',SIDE,26,30,sh(c.cl,-22));P.map('armL',SIDE,(s,t,w,h)=>t>=h-7&&t<h-4?sh(c.cl,t===h-7?14:-10):null);
        // the neck opening, laced
        P.map('tunic',['F'],(s,t)=>t<6&&Math.abs(s-8.5)<=(6-t)*0.4+0.5?(t%2===0&&Math.abs(s-8.5)<1?[220,200,160]:sh(c.skin,-10)):null);
        leather(P,['belt'],[80,54,32]);P.map('belt',['F'],(s)=>s>=9&&s<=10?[200,180,120]:null);leather(P,['pouch'],[110,76,44]);}},
    rwoman:{res:2,tex:256,parts:[...man(),['gown','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.25,1.3,0,0]}],['girdle','body',[0,0,0],[-5,1.5,-3,10,1,6]],
        ['hairB','head',[0,1,-3],[-3,-4,-0.5,6,7,1],0,{head:1,nb:1}],['braid','hairB',[0,-4,0],[-1,-5,-0.5,2,5,1],0,{head:1,nb:1}]],
      coats:[[{skin:SK[0],hair:HAIR[2],cl:[120,40,44],ap:[220,214,196]},2],[{skin:SK[1],hair:HAIR[0],cl:[54,80,120],ap:[214,206,186],eye:[90,70,50]},2],[{skin:SK[2],hair:HAIR[3],cl:[96,110,60],ap:[226,220,204]},2],
        [{skin:SK[3],hair:HAIR[5],cl:[130,96,150],ap:[220,212,196],eye:[90,70,50]},1],[{skin:SK[4],hair:HAIR[4],cl:[90,70,52],ap:[200,196,180]},1]],
      paint(P,c){face(P,c,{long:1});P.map('hairB',ALL,(s,t)=>sh(c.hair,hz(s,0,93)*20+(t%4===0?-6:0)));P.map('braid',ALL,(s,t)=>sh(c.hair,((t+s)%3===0?-18:6)+hz(s,t,95)*8));
        cloth(P,['armL','body','gown'],c.cl);hands(P,c);P.map('legL',ALL,(s,t)=>sh([70,52,40],hz(s,t,97)*8));boots(P,[62,44,30],20);
        // the bodice laced up the front, a pale shift at the neck, the apron with its pocket and hem, the gown's hem
        P.map('body',['F'],(s,t)=>t<4&&s>=4&&s<=11?sh([226,220,206],hz(s,t,99)*6):(s===7||s===8)&&t>=4&&t<18?(t%3===0?[230,220,190]:sh(c.cl,-24)):null);
        P.map('gown',['F'],(s,t,w,h)=>s>=4&&s<=13&&t<h-2?sh(c.ap,(s===4||s===13?-18:0)+(t>=10&&t<=14&&s>=6&&s<=9?(t===10?-20:-8):0)+(t===h-3?-16:0)+hz(s,t,101)*8):null);
        band(P,'gown',SIDE,24,28,sh(c.cl,-28));leather(P,['girdle'],[110,80,44]);P.map('girdle',['F'],(s,t)=>s===13&&t>0?[200,170,90]:null);}},
    rmerch:{res:2,tex:256,parts:[...man(),['robe','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.15,1.15,0,0]}],['hat','head',[0,6,0],[-4,0,-4,8,1,8],0,{head:1}],['crown','hat',[0,1,0],[-3,0,-3,6,3,6],0,{head:1}],
        ['feather','crown',[2,2,-2],[-0.5,0,-0.5,1,5,1],[-0.5,0,-0.4],{head:1,nb:1,tp:['y',1,0.3,0,0]}],['purse','body',[3.5,1,1],[-1,-3,-1,2,3,2],0,{nb:1}],['belt','body',[0,0,0],[-5,1.5,-3,10,1,6]]],
      coats:[[{skin:SK[1],hair:HAIR[1],cl:[110,30,40],trim:[220,180,80],beard:1},2],[{skin:SK[0],hair:HAIR[4],cl:[30,70,90],trim:[200,200,210],eye:[90,70,50]},2],[{skin:SK[2],hair:HAIR[0],cl:[90,60,110],trim:[220,180,80],beard:1},1]],
      paint(P,c){face(P,c);cloth(P,['armL','body','robe'],c.cl);hands(P,c);P.map('legL',ALL,()=>[60,40,30]);boots(P,[70,46,30],20);
        // fur down the front, round the hem and the cuffs; rings on the fingers; a purse with its drawstring
        const fur=(s,t)=>sh([206,192,170],hz(s,t,103)*26+((s+t)%3===0?-14:0));
        P.map('robe',SIDE,(s,t,w,h)=>t>=h-4?fur(s,t):null);P.map('body',['F'],(s,t)=>s>=6&&s<=9?fur(s,t):null);
        P.map('robe',['F'],(s,t)=>s>=7&&s<=10?fur(s,t):null);P.map('armL',SIDE,(s,t,w,h)=>t>=h-8&&t<h-4?fur(s,t):t===h-2&&s%3===1?sh(c.trim,30):null);
        leather(P,['belt'],[70,46,30]);P.map('belt',['F'],(s)=>s>=9&&s<=10?sh(c.trim,20):null);
        P.map('hat',ALL,(s,t)=>sh([40,32,30],hz(s,t,105)*10));P.map('crown',ALL,(s,t,w,h)=>t>=h-2&&h>2?sh(c.trim,t===h-2?20:0):sh([52,40,36],hz(s,t,107)*10));
        P.map('feather',ALL,(s,t)=>sh([236,232,220],t%2?-18:8));leather(P,['purse'],[130,90,52]);P.map('purse',SIDE,(s,t)=>t===1?sh(c.trim,10):null);}},
    rsmith:{res:2,tex:256,parts:[...man(),['apron','body',[0,0,0],[-4.5,-6,-2.5,9,15,5]],['ham','armR',[1.5,-10,0],[-0.5,-0.5,-0.5,1,1,6],[0.3,0,0],{nb:1}],['hhead','ham',[0,0,5],[-1,-1.5,0,2,3,2],0,{nb:1}],
        ['glove','armL',[0,-9,0],[-3.5,-2,-2,4,3,4]],['gloveR','armR',[0,-9,0],[-0.5,-2,-2,4,3,4],0,{m:'glove'}]],
      coats:[[{skin:SK[1],hair:HAIR[0],beard:1},2],[{skin:SK[2],hair:HAIR[5],beard:1,eye:[90,70,50]},2],[{skin:SK[3],hair:HAIR[1],eye:[90,70,50]},1]],
      paint(P,c){face(P,c);
        // bare forearms below rolled sleeves, sooted; a shirt; the leather apron stitched, its pocket, soot and scorches; gauntlets
        P.map('armL',ALL,(s,t)=>t<8?sh([150,138,118],(t===7?-16:t===6?12:0)+hz(s,t,109)*8):sh(c.skin,hz(s,t,111)*8+(amHash(s,t,113)<0.12?-30:0)));
        cloth(P,['body'],[150,138,118]);P.map('legL',ALL,(s,t)=>sh([76,64,52],hz(s,t,115)*8));boots(P,[52,38,26],18);
        leather(P,['apron'],[100,66,40],1);P.map('apron',['L','R','B','T'],(s,t,w,h,f)=>f==='T'||t<16?sh([150,138,118],hz(s,t,117)*8):null);
        P.map('apron',['F'],(s,t)=>t>=14&&t<=19&&s>=4&&s<=13?sh([86,56,34],t===14?18:(s===4||s===13)?-12:0):amHash(s,t,119)<0.025?[58,40,28]:null);
        P.map('apron',['F'],(s,t)=>t===0||t===1&&(s<3||s>14)?[60,40,24]:null);leather(P,['glove'],[84,60,40]);
        P.map('ham',ALL,(s,t)=>sh([96,70,44],hz(s,t,121)*12+(t%4===0?-14:0)));plate(P,['hhead'],[96,98,108]);}},
    rfarmer:{res:2,tex:256,parts:[...man(),['smock','body',[0,0,0],[-4.5,-5,-2.5,9,16,5]],['sash','body',[0,0,0],[-5,3,-3,10,1,6]],['hatb','head',[0,6,0],[-5,0,-5,10,1,10],0,{head:1,nb:1}],['hatc','hatb',[0,1,0],[-3,0,-3,6,2,6],0,{head:1}],
        ['hoe','armR',[1.5,-10,0.5],[-0.5,-6,-0.5,1,24,1],[0.15,0,0],{nb:1}],['blade','hoe',[0,17,0],[-0.5,-0.5,0,1,1,4],0,{nb:1,tp:['z',1,2,0,-0.5]}]],
      coats:[[{skin:SK[1],hair:HAIR[2],cl:[176,160,120],beard:1},2],[{skin:SK[2],hair:HAIR[1],cl:[150,140,104],eye:[90,70,50]},2],[{skin:SK[0],hair:HAIR[4],cl:[160,150,112],beard:1},1]],
      paint(P,c){face(P,c);cloth(P,['armL','body','smock'],c.cl);hands(P,c);cloth(P,['legL'],[96,80,56],{off:2});boots(P,[74,54,34],18);
        // the smocking across the chest in rows of stitches, a patch, mud at the hem, a red sash
        P.map('smock',['F','B'],(s,t)=>t>=2&&t<=9&&s>=3&&s<=14&&t%2===0&&(s+(t>>1))%2===0?sh(c.cl,-30):null);
        P.map('smock',SIDE,(s,t,w,h)=>t>=h-3?sh([96,76,50],hz(s,t,123)*16):null);P.map('smock',['L'],(s,t)=>t>=12&&t<=17&&s>=3&&s<=7?sh([120,100,70],(s===3||s===7||t===12||t===17)?-20:0):null);
        P.map('sash',ALL,(s,t)=>sh([150,60,40],hz(s,t,125)*10+(s%4===0?-12:0)));
        // straw woven in rings on the hat's brim and rows on its crown, a red band round it
        P.map('hatb',ALL,(s,t,w,h,f)=>sh([216,188,108],(f==='T'||f==='D'?(Math.floor(Math.hypot(s-w/2,t-h/2))%2?-16:8):0)+((s+t)%2?-10:6)+hz(s,t,127)*12));
        P.map('hatc',ALL,(s,t,w,h,f)=>f!=='T'&&t>=h-2?sh([150,56,40],t===h-2?14:0):sh([210,182,104],((s+t)%2?-12:6)+hz(s,t,129)*10));
        P.map('hoe',ALL,(s,t)=>sh([116,84,52],hz(s,t>>2,131)*14));plate(P,['blade'],[118,122,130]);}},
    rnoble:{res:2,tex:256,scale:1.03,parts:[...man(),['robe','body',[0,1,0],[-4.5,-13,-2.5,9,14,5],0,{tp:['-y',1.2,1.2,0,0]}],['mantle','body',[0,10.5,-2.4],[-4.5,-17,-0.5,9,17,1],[0.08,0,0],{nb:1}],
        ['collar','body',[0,10,0],[-4.5,-1,-2.5,9,2,5]],['circ','head',[0,5,0],[-3.5,0,-3.5,7,1,7],0,{head:1}]],
      coats:[[{skin:SK[0],hair:HAIR[0],beard:1},2],[{skin:SK[4],hair:HAIR[4],beard:1},1],[{skin:SK[1],hair:HAIR[5],eye:[90,70,50]},1]],
      paint(P,c){face(P,c);cloth(P,['armL','body','robe'],BLACK);hands(P,c);P.map('legL',ALL,()=>[30,30,36]);boots(P,[36,30,30],20);
        // silver embroidery: a running pattern down the front and round the hem and cuffs; the sign on the breast; a signet ring
        const emb=(s,t)=>sh(SILVER,((s+t)%4===0?18:(s-t+40)%4===0?-10:0)+hz(s,t,133)*6);
        P.map('robe',['F'],(s,t)=>s>=7&&s<=10?(s===7||s===10?sh(SILVER,-20):emb(s,t)):null);P.map('robe',SIDE,(s,t,w,h)=>t>=h-5?emb(s,t):null);
        P.map('armL',SIDE,(s,t,w,h)=>t>=h-8&&t<h-4?emb(s,t):t===h-2&&s===2?[230,200,110]:null);sign(P,'body','F',0,4,[238,240,244]);
        // the white mantle with its dark spots, an ermine collar, a chain of office across the shoulders, the circlet with its stone
        P.map('mantle',ALL,(s,t,w,h)=>(s*3+t*5)%11===0&&t%4===2?[24,24,30]:sh([226,228,234],hz(s,t,135)*8-t/h*10));band(P,'mantle',SIDE,30,34,SILVER);
        P.map('collar',ALL,(s,t)=>(s*3+t*5)%7===0?[24,24,30]:sh([234,234,238],hz(s,t,137)*10));
        P.map('body',['F'],(s,t)=>Math.abs(t-3-Math.abs(s-7.5)*0.45)<0.6&&t<8?sh(GOLD,(s+t)%2?24:-10):null);
        plate(P,['circ'],GOLD);P.map('circ',['F'],(s)=>s===6||s===7?[110,170,230]:null);}}
  });
  MODEL_KIT.realm={soldier,soldierPaint,shield,shieldPaint,coats,sign,SIGN};
  return {SK,HAIR,ALL,SIDE,sh,hz,legs,arms,man,cloth,mail,plate,leather,band,rivets,boots,hands,face,sword,swordPaint,STEEL,SILVER,GOLD,BLACK};
})();
