// Items that are not blocks: fuel, raw ores, ingots, gems and pickaxes
const ITEMS={};
function item(id,n,kind,col,x){ITEMS[id]=Object.assign({n:n,kind:kind,col:col},x||{});}
item(200,'Coal','lump',[44,44,48]);item(201,'Stick','stick',[146,104,60]);
[['Copper',[204,112,64]],['Tin',[200,204,210]],['Zinc',[150,172,180]],['Iron',[214,206,196]],['Gold',[246,206,64]],['Platinum',[220,236,244]],['Moonsilver',[150,156,196]]].forEach((m,i)=>item(210+i,'Raw '+m[0],'lump',m[1]));
[['Copper',[214,120,68]],['Tin',[206,210,216]],['Zinc',[160,182,190]],['Iron',[222,222,218]],['Gold',[250,212,70]],['Bronze',[182,128,58]],['Brass',[226,188,86]],['Steel',[124,134,152]],['Moonsilver',[170,176,206]],['Platinum',[226,240,248]]].forEach((m,i)=>item(220+i,m[0]+' Ingot','ingot',m[1]));
item(230,'Diamond','gem',[96,232,222]);item(202,'Wheat','tile',null,{tile:83});item(203,'Copper Coin','coin',[214,120,68]);
item(208,'Wheat Seeds','seeds',[150,170,70]);item(209,'Potato','lump',[186,144,86]);item(269,'Baked Potato','lump',[222,176,92]);item(271,'Brass Cog','cog',[226,188,86]);item(272,'Gold Goblet','goblet',[246,206,64]);item(273,'Rune Tablet','tablet',[90,86,88]);item(274,'Dwarven Crown','crown',[246,206,64]);
item(270,'Glow Mushroom Cap','tile',null,{tile:118});
item(251,'Hoe','hoe',[150,112,62]);item(206,'Bread','bread',[196,140,70]);item(207,'Apple','apple',[210,40,40]);item(204,'Gold Coin','coin',[250,210,70]);item(205,'Platinum Coin','coin',[226,240,248]);
// Tools (M4, Q18, Q19, Q66). The metal ladder: wood, stone, copper, bronze, iron, steel, moonsilver, each faster and longer
// lasting than the one before, and each pickaxe the first that can mine the next metal's ore (ore tiers in blocks.js). A tool
// is {tool: kind, tier, speed, dur}: a pickaxe speeds stone, ore and metal, an axe wood, a shovel earth and sand, shears
// leaves, cloth and plants; dur is how many blocks it breaks before it wears out. Pickaxes keep their old ids 240 to 246.
const TOOL_LADDER=[['Wooden',[150,112,62],2,60],['Stone',[132,132,132],3,130],['Copper',[214,120,68],4,200],['Bronze',[182,128,58],5,280],
  ['Iron',[222,222,218],6.5,400],['Steel',[124,134,152],8,700],['Moonsilver',[170,176,206],10,1500]];
TOOL_LADDER.forEach((m,i)=>{const o={tier:i+1,speed:m[2],dur:m[3]};
  item(240+i,m[0]+' Pickaxe','pick',m[1],Object.assign({tool:'pick'},o));item(300+i,m[0]+' Axe','axe',m[1],Object.assign({tool:'axe'},o));
  item(310+i,m[0]+' Shovel','shovel',m[1],Object.assign({tool:'shovel'},o));});
// Gold and platinum are for special tools (Q68): a platinum pickaxe is very fast but soon worn; the runeforged one is a relic
item(247,'Platinum Pickaxe','pick',[226,240,248],{tool:'pick',tier:5,speed:14,dur:150});item(255,'Runeforged Pickaxe','pick',[110,220,250],{tool:'pick',tier:7,speed:18,dur:4000});
ITEMS[251].tool='hoe';ITEMS[251].dur=150;
item(320,'Gold Sickle','sickle',[246,206,64],{tool:'sickle',speed:1,dur:250});item(321,'Bronze Shears','shears',[182,128,58],{tool:'shears',speed:8,dur:240});
// Climbing and finding the way (Q45, Q66): the grapnel catches a ledge and hangs rope from it; a map shows the minimap in
// survival, a compass where you are and which way you face, a depth gauge how deep you are. Signal flares replace fireworks.
item(322,'Grapnel','grapnel',[150,154,164],{once:true});item(323,'Compass','compass',[214,120,68],{one:true});item(324,'Depth Gauge','gauge',[226,188,86],{one:true});
item(325,'Map','map',[222,204,156],{one:true});item(326,'Signal Flare','flare',[214,60,40],{once:true});item(327,'Parchment','parchment',[226,214,180]);item(328,'Plant Fibre','fibre',[140,166,80]);
// Food (M4b, Q52): two crops planted as they are, foraged bilberries and mushrooms, and dishes cooked at a furnace
item(330,'Turnip','turnip',[176,110,176]);item(331,'Beans','beans',[150,196,92]);item(332,'Bilberries','berries',[70,84,170]);item(333,'Brown Mushroom','tile',null,{tile:203});
item(334,'Roast Turnip','turnip',[206,140,90]);item(335,'Pottage','bowl',[170,130,70]);item(336,'Bilberry Tart','tart',[196,150,90]);item(337,'Roast Mushrooms','tile',null,{tile:203});
// The worn lamp (M4b, Q36, Q65): a lantern for the belt slot that burns lamp oil or pitch candles (fuel: seconds of light)
item(338,'Lamp Oil','oil',[214,180,70],{fuel:1200});item(339,'Pitch Candle','candle',[60,52,46],{fuel:480});item(340,"Miner's Lantern",'lantern',[214,120,68],{equip:'belt',lamp:true,one:true});
// More room (M4b, Q67): a pack for the pack slot (woven, then sturdy) and a satchel for the bag slot add inventory rows
item(341,'Woven Pack','pack',[150,170,96],{equip:'pack',slots:9,one:true});item(342,'Sturdy Pack','pack',[150,110,60],{equip:'pack',slots:18,one:true});item(343,'Satchel','satchel',[170,140,90],{equip:'bag',slots:9,one:true});
const durOf=id=>(ITEMS[id]&&ITEMS[id].dur)||0;
// Held to use once per press: holding the button does not repeat it
const oneShot=id=>isTool(id)||!!(ITEMS[id]&&ITEMS[id].once);
const isItem=id=>id>=200&&id<1024; // blocks are 0 to 199 and 1024 up (M6a, two bytes per block)
function nameOf(id){return isItem(id)?ITEMS[id].n:isTool(id)?TOOLS[id][0]:BL[id].n;}
const iconCache={};
function itemIcon(id){
  if(iconCache[id])return iconCache[id];
  const it=ITEMS[id],c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d'),col=it.col;
  const px=(x,y,v,a)=>{g.fillStyle='rgba('+cl(col[0]+v)+','+cl(col[1]+v)+','+cl(col[2]+v)+','+(a||1)+')';g.fillRect(x,y,1,1);};
  const r=mkRng(id*977+13);
  if(it.kind==='lump'){for(let y=3;y<13;y++)for(let x=3;x<13;x++){const d=Math.hypot(x-7.5,(y-8)*1.15)+r()*1.2;if(d<5.2)px(x,y,(d>4.2?-40:0)+(x<7&&y<8?24:0)+(r()-.5)*30);}}
  else if(it.kind==='ingot'){for(let y=5;y<12;y++){const inset=y<7?2:y<9?1:0;for(let x=2+inset;x<14-inset;x++)px(x,y,y<7?36:y>9?-36:0+(x+y)%5===0?18:0);}}
  else if(it.kind==='gem'){for(let y=3;y<13;y++){const w=y<6?y-2:12-y;for(let x=8-w;x<=8+w;x++)px(x,y,(x<8?30:-10)+(y<6?20:0));}}
  else if(it.kind==='dust'){for(let y=6;y<14;y++)for(let x=1;x<15;x++){const top=6+Math.abs(x-7.5)*0.9;if(y>=top&&r()<0.85)px(x,y,(r()-.5)*60+(y<9?20:0));}}
  else if(it.kind==='nugget'){for(const [cx,cy,rr] of [[6,9,2.2],[10,7,1.6],[9,11,1.4]])for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-cx,y-cy);if(d<rr)px(x,y,(d>rr-0.8?-36:x<cx?28:0));}}
  else if(it.kind==='cog'){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5),a=Math.atan2(y-7.5,x-7.5),tooth=Math.cos(a*8)>0.3;if((d<5.2||(tooth&&d<6.8))&&d>1.8)px(x,y,(d>5?-20:0)+(x<7?18:0));}}
  else if(it.kind==='goblet'){for(let y=2;y<14;y++){const w=y<7?4-Math.floor((y-2)/3):y<11?1:3;for(let x=8-w;x<8+w;x++)px(x,y,(x<8?26:-10));}g.fillStyle='#d83a2c';g.fillRect(6,3,4,1);}
  else if(it.kind==='tablet'){for(let y=2;y<14;y++)for(let x=3;x<13;x++)px(x,y,(x===3||y===2?20:x===12||y===13?-20:0));g.fillStyle='#ffaa46';g.fillRect(5,5,1,6);g.fillRect(5,5,4,1);g.fillRect(9,7,1,5);g.fillRect(7,10,3,1);}
  else if(it.kind==='crown'){for(let y=6;y<13;y++)for(let x=2;x<14;x++)px(x,y,y===12?-30:(x<7?20:0));for(const x of [2,5,8,11,13])for(let y=3;y<6;y++)px(Math.min(x,13),y,10);g.fillStyle='#d83a2c';g.fillRect(5,8,2,2);g.fillStyle='#5ad8e6';g.fillRect(9,8,2,2);}
  else if(it.kind==='seeds'){for(const [x,y] of [[4,9],[7,6],[10,9],[6,11],[9,12],[11,6],[5,5]]){px(x,y,0);px(x+1,y,-20);px(x,y+1,-30);}}
  else if(it.kind==='drill'){g.fillStyle='#e0a030';g.fillRect(3,6,7,5);g.fillStyle='#6a6e78';g.fillRect(10,7,3,3);g.fillStyle='#c8ccd4';g.fillRect(13,8,3,1);g.fillStyle='#303238';g.fillRect(4,11,3,4);g.fillStyle='#fff';g.fillRect(4,7,2,1);}
  else if(it.kind==='jack'){g.fillStyle='#30323a';g.fillRect(3,2,10,2);g.fillStyle='#e0b030';g.fillRect(5,4,6,6);g.fillStyle='#8a8e98';g.fillRect(7,10,2,4);g.fillStyle='#c8ccd4';g.fillRect(7,14,2,2);}
  else if(it.kind==='saw'){g.fillStyle='#e07828';g.fillRect(2,6,6,6);g.fillStyle='#30323a';g.fillRect(3,4,4,2);g.fillStyle='#b8bcc6';g.fillRect(8,8,7,3);g.fillStyle='#50545e';for(let x=8;x<15;x+=2){g.fillRect(x,7,1,1);g.fillRect(x+1,11,1,1);}}
  else if(it.kind==='hoe'){for(let k=0;k<10;k++){g.fillStyle=k%3?'#8a6036':'#634422';g.fillRect(2+k,13-k,2,2);}g.fillStyle='#9a9ea8';g.fillRect(8,2,6,2);g.fillRect(12,4,2,2);g.fillStyle='#6a6e78';g.fillRect(8,3,6,1);}
  else if(it.kind==='bread'){for(let y=5;y<13;y++)for(let x=2;x<14;x++){const d=Math.hypot((x-7.5)/6,(y-9)/4);if(d<1)px(x,y,(y<8?20:0)+(d>0.8?-40:0)+((x-y)%4===0&&y<9?-30:0));}}
  else if(it.kind==='apple'){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,(y-9)*1.1);if(d<5.2)px(x,y,(d>4.4?-40:0)+(x<6&&y<8?40:0));}g.fillStyle='#5a3a1a';g.fillRect(8,2,1,3);g.fillStyle='#4a9a3a';g.fillRect(9,2,3,2);}
  else if(it.kind==='pan'){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot((x-7.5)/7,(y-9)/4);if(d<1)px(x,y,d>0.78?-30:d>0.6?10:30);}g.fillStyle='#fad246';g.fillRect(6,9,1,1);g.fillRect(9,8,1,1);}
  else if(it.kind==='coin'){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5);if(d<6.2)px(x,y,d>5.2?-40:(d<3.4&&((x+y)%3===0))?-22:(x<7&&y<7?26:0));}}
  else if(it.kind==='tile')g.drawImage(atlas,(it.tile%AC)*16,((it.tile/AC)|0)*16,16,16,0,0,16,16);
  else if(it.kind==='stick'){for(let k=0;k<11;k++){g.fillStyle=k%3?'#92683c':'#6e4c2a';g.fillRect(3+k,13-k,2,2);}}
  else if(it.kind==='axe'||it.kind==='shovel'){
    for(let k=0;k<10;k++){g.fillStyle=k%3?'#8a6036':'#634422';g.fillRect(2+k,13-k,2,2);}
    if(it.kind==='axe'){for(let y=1;y<9;y++)for(let x=7;x<15;x++){const u=x-y;if(u>=3&&u<=8&&x+y>=11&&x+y<=19)px(x,y,u===8?-36:u<=4?28:0);}}
    else for(let y=0;y<7;y++)for(let x=9;x<16;x++){const d=Math.hypot(x-12.5,y-3);if(d<3.2)px(x,y,d>2.4?-34:(x<12?24:0));}}
  else if(it.kind==='sickle'){for(let k=0;k<4;k++){g.fillStyle=k%2?'#8a6036':'#634422';g.fillRect(2+k,13-k,2,2);}
    for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-8.5,y-7);if(d>=4.2&&d<=6&&!(x<8&&y>7))px(x,y,d>5.3?-34:d<4.8?30:0);}}
  else if(it.kind==='shears'){for(const s of [-1,1])for(let k=0;k<8;k++)px(5+k,8+s*Math.round(k*0.35)-(s<0?1:0)+(k>5?s:0),k<3?-10:24);
    g.fillStyle='#634422';for(const [x,y] of [[2,5],[2,10]]){g.fillRect(x,y,3,2);g.fillRect(x,y+2,1,1);g.fillRect(x+2,y-1,1,1);}}
  else if(it.kind==='grapnel'){g.fillStyle='#8a6a3a';for(let y=9;y<16;y++)g.fillRect(7+(y%2),y,1,1);
    for(let y=2;y<10;y++)px(7,y,y<4?20:0),px(8,y,-20);for(const s of [-1,1])for(let k=0;k<4;k++)px(7.5+s*(2+k*0.6)|0,3+k-(k>2?2:0),s<0?24:-14);}
  else if(it.kind==='compass'){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5);if(d<6.4)px(x,y,d>5.3?-30:d>4.7?20:0);}
    g.fillStyle='#e8e2d0';for(let y=4;y<12;y++)for(let x=4;x<12;x++)if(Math.hypot(x-7.5,y-7.5)<4.3)g.fillRect(x,y,1,1);
    g.fillStyle='#c83228';g.fillRect(7,4,2,4);g.fillStyle='#3a3a44';g.fillRect(7,8,2,4);}
  else if(it.kind==='gauge'){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-8.5);if(d<6)px(x,y,d>5?-30:10);}
    g.fillStyle='#ece6d4';for(let y=5;y<13;y++)for(let x=4;x<12;x++)if(Math.hypot(x-7.5,y-8.5)<3.9)g.fillRect(x,y,1,1);
    g.fillStyle='#2a2a30';for(let k=0;k<4;k++)g.fillRect(7+Math.round(k*0.7),8+k,1,1);px(7,1,0);px(8,1,0);px(7,2,-20);px(8,2,-20);}
  else if(it.kind==='map'){for(let y=2;y<14;y++)for(let x=1;x<15;x++)px(x,y,(x===1||x===14?-30:0)+(((x/4)|0)%2?-12:0));
    g.fillStyle='#5a8a4a';g.fillRect(3,5,4,3);g.fillRect(9,8,4,3);g.fillStyle='#4a6ab0';g.fillRect(6,9,3,2);g.fillStyle='#b83a2a';g.fillRect(10,4,2,2);}
  else if(it.kind==='flare'){for(let y=5;y<15;y++)for(let x=6;x<10;x++)px(x,y,(x===6?24:x===9?-26:0)+(y%4===0?-30:0));
    g.fillStyle='#634422';g.fillRect(7,15,2,1);g.fillStyle='#ffd070';g.fillRect(7,2,2,3);g.fillStyle='#fff4c0';g.fillRect(7,3,2,1);}
  else if(it.kind==='parchment'){for(let y=2;y<14;y++)for(let x=3;x<13;x++)px(x,y,(x===3||y===2?18:x===12||y===13?-28:0)+((x*7+y*3)%11===0?-14:0));
    g.fillStyle='#8a7a5a';for(const y of [5,7,9,11])g.fillRect(5,y,6,1);}
  else if(it.kind==='fibre'){for(let k=0;k<5;k++)for(let y=2;y<14;y++){const x=3+k*2+Math.round(Math.sin((y+k*3)/2.2));px(x,y,(k%2?-20:16)+(y%3?0:-14));}}
  else if(it.kind==='turnip'){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,(y-9.5)*1.1);if(d<5)px(x,y,(y<8?0:40)+(d>4.2?-36:0)+(x<6?16:0));}g.fillStyle='#4f8f36';g.fillRect(6,1,1,4);g.fillRect(8,0,1,5);g.fillRect(10,2,1,3);}
  else if(it.kind==='beans'){for(const [cx,cy] of [[5,6],[10,7],[7,11]])for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot((x-cx)/2.2,(y-cy)/1.6);if(d<1)px(x,y,d>0.75?-36:(x<cx?20:0));}}
  else if(it.kind==='berries'){for(const [cx,cy] of [[5,6],[10,6],[7,10],[11,11],[4,11]])for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-cx,y-cy);if(d<2.3)px(x,y,d>1.6?-36:(x<cx&&y<cy?40:0));}}
  else if(it.kind==='bowl'){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot((x-7.5)/7,(y-8)/3);if(y>=8&&Math.hypot((x-7.5)/7,(y-8)/6)<1)g.fillStyle='#8a5a30',g.fillRect(x,y,1,1);else if(d<1&&y<9)px(x,y,(x*3+y)%5?0:-30);}}
  else if(it.kind==='tart'){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot((x-7.5)/7,(y-9)/4.5);if(d<1)px(x,y,d>0.8?-20:0);}g.fillStyle='#3a3c88';for(const [x,y] of [[5,8],[8,7],[10,9],[7,10],[4,10],[9,11]])g.fillRect(x,y,2,1);}
  else if(it.kind==='oil'){for(let y=4;y<15;y++){const w=y<7?1:y<9?3:4;for(let x=8-w;x<8+w;x++)px(x,y,(x<8?20:-10)+(y>11?-20:0));}g.fillStyle='#6a4a2a';g.fillRect(7,2,2,2);}
  else if(it.kind==='candle'){for(let y=6;y<15;y++)for(let x=6;x<10;x++)px(x,y,x===6?24:x===9?-20:0);g.fillStyle='#2a2420';g.fillRect(7,4,1,2);g.fillStyle='#ffc850';g.fillRect(7,2,2,2);g.fillStyle='#fff2b0';g.fillRect(7,3,1,1);}
  else if(it.kind==='lantern'){for(let y=3;y<14;y++)for(let x=4;x<12;x++){const e=x===4||x===11||y===3||y===13;px(x,y,e?-10:0);}g.fillStyle='#ffd27a';g.fillRect(6,5,4,7);g.fillStyle='#fff3c4';g.fillRect(7,7,2,3);g.fillStyle='#3a2a1a';g.fillRect(7,1,2,2);}
  else if(it.kind==='pack'||it.kind==='satchel'){const sat=it.kind==='satchel';for(let y=sat?6:3;y<14;y++)for(let x=3;x<13;x++)px(x,y,(x===3||y===(sat?6:3)?20:x===12||y===13?-30:0)+((x+y)%4===0?-10:0));
    g.fillStyle='#4a3420';g.fillRect(3,sat?8:6,10,1);g.fillRect(7,sat?8:6,2,3);if(sat){g.fillRect(4,2,1,4);g.fillRect(11,2,1,4);g.fillRect(4,2,8,1);}}
  else if(it.kind==='pick'){
    for(let k=0;k<10;k++){g.fillStyle=k%3?'#8a6036':'#634422';g.fillRect(2+k,13-k,2,2);}
    for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-2,y-14);if(d>=9.6&&d<=12&&Math.abs((x-2)-(14-y))<=7)px(x,y,(d>11?-36:d<10.4?28:0));}
  }
  iconCache[id]=c;return c;
}
const RELICS=new Set([271,272,273,274,255,PRISM,AMBER,STARORE]); // relics for the discovery log (M7)
