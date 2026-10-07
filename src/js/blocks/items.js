// Items that are not blocks: fuel, raw ores, ingots, gems and pickaxes
const ITEMS={};
function item(id,n,kind,col,x){ITEMS[id]=Object.assign({n:n,kind:kind,col:col},x||{});}
item(200,'Coal','lump',[44,44,48]);item(201,'Stick','stick',[146,104,60]);
[['Copper',[204,112,64]],['Tin',[200,204,210]],['Zinc',[150,172,180]],['Iron',[214,206,196]],['Gold',[246,206,64]],['Platinum',[220,236,244]],['Moonsilver',[150,156,196]]].forEach((m,i)=>item(210+i,'Raw '+m[0],'lump',m[1]));
[['Copper',[214,120,68]],['Tin',[206,210,216]],['Zinc',[160,182,190]],['Iron',[222,222,218]],['Gold',[250,212,70]],['Bronze',[182,128,58]],['Brass',[226,188,86]],['Steel',[124,134,152]],['Moonsilver',[170,176,206]],['Platinum',[226,240,248]]].forEach((m,i)=>item(220+i,m[0]+' Ingot','ingot',m[1]));
item(230,'Diamond','gem',[96,232,222]);item(202,'Wheat','tile',null,{tile:83});item(203,'Copper Coin','coin',[214,120,68]);
[['Copper',[204,112,64]],['Tin',[200,204,210]],['Zinc',[150,172,180]],['Iron',[196,176,160]],['Gold',[246,206,64]],['Platinum',[220,236,244]],['Moonsilver',[150,156,196]]].forEach((m,i)=>item(260+i,'Crushed '+m[0],'dust',m[1]));
item(267,'Gold Nugget','nugget',[250,210,70]);item(268,'Platinum Nugget','nugget',[226,240,248]);item(250,'Gold Pan','pan',[120,124,132]);item(208,'Wheat Seeds','seeds',[150,170,70]);item(209,'Potato','lump',[186,144,86]);item(269,'Baked Potato','lump',[222,176,92]);item(271,'Brass Cog','cog',[226,188,86]);item(272,'Gold Goblet','goblet',[246,206,64]);item(273,'Rune Tablet','tablet',[90,86,88]);item(274,'Dwarven Crown','crown',[246,206,64]);
item(270,'Glow Mushroom Cap','tile',null,{tile:118});
item(252,'Power Drill','drill',[128,134,148],{power:'drill',tier:6,speed:14,cap:2400});item(253,'Jackhammer','jack',[150,150,160],{power:'jack',tier:6,speed:30,cap:2000});item(254,'Chainsaw','saw',[230,120,40],{power:'saw',tier:0,speed:25,cap:1500});
item(251,'Hoe','hoe',[150,112,62]);item(206,'Bread','bread',[196,140,70]);item(207,'Apple','apple',[210,40,40]);item(204,'Gold Coin','coin',[250,210,70]);item(205,'Platinum Coin','coin',[226,240,248]);
[['Runeforged',[110,220,250],7,18,255],['Wooden',[150,112,62],1,2],['Stone',[132,132,132],2,4],['Copper',[214,120,68],3,5],['Bronze',[182,128,58],4,6],['Iron',[222,222,218],5,7],['Steel',[124,134,152],6,9],['Moonsilver',[170,176,206],7,12],['Platinum',[226,240,248],4,15]]
  .forEach((m,i,arr)=>{const id=m[4]||240+i-1;item(id,m[0]+' Pickaxe','pick',m[1],{pick:true,tier:m[2],speed:m[3]});});
const isItem=id=>id>=200;
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
  else if(it.kind==='pick'){
    for(let k=0;k<10;k++){g.fillStyle=k%3?'#8a6036':'#634422';g.fillRect(2+k,13-k,2,2);}
    for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-2,y-14);if(d>=9.6&&d<=12&&Math.abs((x-2)-(14-y))<=7)px(x,y,(d>11?-36:d<10.4?28:0));}
  }
  iconCache[id]=c;return c;
}

