// Texture atlas, drawn pixel by pixel
const TS=16,AC=8,AR=64,AW=TS*AC,AH=TS*AR;
const atlas=document.createElement('canvas');atlas.width=AW;atlas.height=AH;
const actx=atlas.getContext('2d'),im=actx.createImageData(AW,AH),dat=im.data;
const cl=v=>v<0?0:v>255?255:v|0;
function P(t,x,y,c,a){if(x<0||y<0||x>15||y>15)return;const X=(t%AC)*TS+x,Y=((t/AC)|0)*TS+y,i=(Y*AW+X)*4;dat[i]=cl(c[0]);dat[i+1]=cl(c[1]);dat[i+2]=cl(c[2]);dat[i+3]=a===undefined?255:a;}
const sh=(c,v)=>[c[0]+v,c[1]+v,c[2]+v];
function fill(t,c,vr){for(let y=0;y<TS;y++)for(let x=0;x<TS;x++)P(t,x,y,sh(c,(tr()-.5)*vr));}
function clear(t){for(let y=0;y<TS;y++)for(let x=0;x<TS;x++)P(t,x,y,[0,0,0],0);}
function voronoi(t,base,line,n){
  const pts=[];for(let i=0;i<n;i++)pts.push([tr()*16,tr()*16,(tr()-.5)*36]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    let d1=1e9,d2=1e9,k=0;
    for(let i=0;i<n;i++)for(let ox=-16;ox<=16;ox+=16)for(let oy=-16;oy<=16;oy+=16){
      const dx=x+.5-pts[i][0]-ox,dy=y+.5-pts[i][1]-oy,d=Math.sqrt(dx*dx+dy*dy);
      if(d<d1){d2=d1;d1=d;k=i;}else if(d<d2)d2=d;
    }
    if(d2-d1<1.1)P(t,x,y,sh(line,(tr()-.5)*12));else P(t,x,y,sh(base,pts[k][2]+(tr()-.5)*14+(d1<2.2?12:0)));
  }
}
function ore(t,c){fill(t,[128,128,128],22);for(let i=0;i<5;i++){const x=1+(tr()*12|0),y=1+(tr()*12|0);P(t,x,y,c);P(t,x+1,y,sh(c,-22));P(t,x,y+1,sh(c,-14));if(tr()<.6)P(t,x+1,y+1,sh(c,16));}}
function rings(t,inner,outer,bark){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5);P(t,x,y,d>6.8?sh(bark,(tr()-.5)*16):sh(((d|0)%2)?inner:outer,(tr()-.5)*12));}}
function leaves(t,c,hole){for(let y=0;y<16;y++)for(let x=0;x<16;x++){if(tr()<hole)P(t,x,y,[0,0,0],0);else P(t,x,y,sh(c,(tr()-.5)*50));}}
function wool(t,c){for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(t,x,y,sh(c,(tr()-.5)*12+((x+y)%4===0?-10:0)+((x-y+16)%4===0?6:0)));}
(function drawTiles(){
  const G=[95,159,53];
  fill(0,G,34);
  fill(2,[134,96,67],28);for(let i=0;i<16;i++)P(2,tr()*16|0,tr()*16|0,[100,72,48]);
  fill(1,[134,96,67],28);for(let i=0;i<16;i++)P(1,tr()*16|0,4+tr()*12|0,[100,72,48]);
  for(let x=0;x<16;x++){const d=3+(tr()*3|0);for(let y=0;y<d;y++)P(1,x,y,sh(G,(tr()-.5)*30));}
  fill(3,[128,128,128],22);for(let i=0;i<12;i++){const x=tr()*14|0,y=tr()*16|0;P(3,x,y,[104,104,104]);P(3,x+1,y,[110,110,110]);}
  voronoi(4,[124,124,124],[74,74,74],7);
  fill(5,[219,206,158],18);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(6,x,y,sh([109,85,50],(x%4===0?-26:0)+((x*5+y*3)%7===0?-12:0)+(tr()-.5)*18));
  rings(7,[182,148,92],[158,126,76],[100,78,46]);
  leaves(8,[58,124,38],0.2);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const b=y>>2;let v=(tr()-.5)*14;if(y%4===3)v-=34;if(x===((b*7+4)&15))v-=30;P(9,x,y,sh([168,134,82],v));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const e=x===0||y===0||x===15||y===15;if(e)P(10,x,y,[214,236,244]);else if((x-y===4||x-y===5||x-y===-7)&&x>2&&x<13)P(10,x,y,[232,246,252],190);else P(10,x,y,[0,0,0],0);}
  fill(11,[52,98,210],18);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(12,x,y,tr()<.5?sh([48,48,48],(tr()-.5)*24):sh([118,118,118],(tr()-.5)*30));
  ore(13,[30,30,30]);ore(14,[216,175,147]);ore(15,[250,212,60]);ore(16,[96,232,222]);
  fill(17,[240,246,250],10);
  fill(18,[134,96,67],28);for(let x=0;x<16;x++){const d=3+(tr()*3|0);for(let y=0;y<d;y++)P(18,x,y,sh([240,246,250],(tr()-.5)*10));}
  fill(19,[218,203,152],10);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c=[214,198,146];if(y<3)c=[225,212,163];else if(y===3||y===12)c=[196,180,128];else if(y>12)c=[205,189,136];P(20,x,y,sh(c,(tr()-.5)*10));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){let v=(x%4===1?-22:0)+(tr()-.5)*14;if(x===0||x===15)v-=26;if(x%4===3&&y%5===2)P(21,x,y,[230,230,180]);else P(21,x,y,sh([72,140,50],v));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5);P(22,x,y,sh([84,152,58],(Math.abs(d-5)<.7?-24:0)+(tr()-.5)*12));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const n=tr();P(23,x,y,n<.14?[255,222,80]:sh([222,94,20],(tr()-.5)*50));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const r=y>>2,off=r%2?4:0;if(y%4===3||(x+off)%8===7)P(24,x,y,sh([186,176,164],(tr()-.5)*12));else P(24,x,y,sh([150,72,56],(tr()-.5)*22));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const r=tr();P(25,x,y,r<.3?[152,142,132]:r<.6?[112,106,100]:r<.8?[132,118,104]:[88,84,82]);}
  clear(26);for(let i=0;i<10;i++){const x=tr()*16|0,h=6+(tr()*9|0);for(let y=15;y>15-h;y--)P(26,x,y,sh([88,150,48],(tr()-.5)*28+(15-y)*2));}
  function flower(t,c){clear(t);for(let y=7;y<16;y++)P(t,7,y,[62,128,40]);P(t,6,12,[70,140,44]);P(t,8,10,[70,140,44]);
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)P(t,7+dx,5+dy,dx||dy?sh(c,(tr()-.5)*20):[60,40,20]);P(t,7,3,c);P(t,5,5,c);P(t,9,5,c);P(t,7,7,c);}
  flower(27,[214,40,36]);flower(28,[246,218,48]);
  clear(29);for(let b=0;b<6;b++){let x=6+(tr()*4|0),y=15;const dir=tr()<.5?-1:1;for(let k=0;k<9;k++){P(29,x,y,[122,86,40]);y--;if(tr()<.5)x+=dir;if(x<0||x>15)break;}}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const r=y>>3;if(y%8===7||(x+(r?8:0))%16===15)P(30,x,y,sh([84,84,84],(tr()-.5)*10));else P(30,x,y,sh([124,124,124],(tr()-.5)*18+(y%8===0||(x+(r?8:0))%16===0?14:0)));}
  // Blasting Keg (Q44): oak staves under iron hoops with a red dwarven rune; the same draws from the shared stream as before
  const KR=[[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[0,1,1,0]];
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const hoop=y===2||y===3||y===12||y===13;P(31,x,y,hoop?sh([62,60,64],(tr()-.5)*10+(y===2||y===12?16:0)):sh([150,104,58],(tr()-.5)*22+(x%4===0?-26:0)));}
  for(let r=0;r<5;r++)for(let c=0;c<4;c++)if(KR[r][c])P(31,6+c,5+r,[176,40,30]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const cx=(x%8)-3.5,cy=(y%8)-3.5,d=Math.hypot(cx,cy);P(32,x,y,d<1.2?[48,40,34]:d<2.6?sh([118,82,46],(tr()-.5)*14):sh([156,112,64],(tr()-.5)*20));}
  fill(33,[136,96,54],22);
  voronoi(34,[236,196,108],[150,108,48],8);for(let i=0;i<14;i++)P(34,tr()*16|0,tr()*16|0,[255,240,190]);
  wool(35,[232,232,228]);wool(36,[176,46,40]);wool(37,[52,70,168]);wool(38,[236,196,46]);wool(39,[34,32,36]);wool(50,[90,130,40]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(40,x,y,sh([222,220,210],(tr()-.5)*14));
  for(let i=0;i<9;i++){const x=tr()*13|0,y=tr()*16|0,l=2+(tr()*3|0);for(let k=0;k<l;k++)P(40,x+k,y,[44,40,36]);}
  rings(41,[214,196,140],[196,176,120],[220,218,206]);
  leaves(42,[104,150,62],0.2);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(43,x,y,sh([74,52,32],(x%3===0?-14:0)+(tr()-.5)*14));
  rings(44,[140,104,60],[118,86,50],[74,52,32]);
  leaves(45,[44,86,52],0.14);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(46,x,y,sh([150,190,240],(tr()-.5)*10+((x+y)%9===0?24:0)+((x*2+y)%13===0?16:0)));
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(47,x,y,tr()<.12?[74,52,116]:sh([22,16,34],(tr()-.5)*14));
  const BC=[[140,40,34],[50,70,130],[60,110,50],[150,120,60],[90,50,100]];
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const plank=y<2||y>13||y===7||y===8;P(48,x,y,plank?sh([168,134,82],(tr()-.5)*14-(y===1||y===8?22:0)):[40,28,18]);}
  for(const r0 of [2,9]){let x=1;while(x<15){const w=1+(tr()*2|0),c=BC[tr()*5|0],h=4+(tr()<.3?-1:0);for(let k=0;k<w&&x<15;k++,x++)for(let y=r0+5-h;y<r0+5;y++)P(48,x,y,sh(c,(tr()-.5)*14+(k===0?12:0)));x++;}}
  voronoi(49,[124,124,124],[74,74,74],7);for(let i=0;i<70;i++)P(49,tr()*16|0,tr()*16|0,sh([80,120,52],(tr()-.5)*30));
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(51,x,y,sh([168,174,184],(tr()-.5)*12+((x+y)%7===0?30:0)-(y>11?20:0)));
  clear(52);for(let y=1;y<11;y++){P(52,7,y,[190,196,206]);P(52,8,y,[130,136,146]);}P(52,7,0,[122,86,40]);P(52,8,0,[122,86,40]);
  [[6,11],[5,12],[5,13],[6,14],[7,14],[8,14],[9,13],[10,12],[10,11],[11,10],[4,12],[4,13]].forEach(([x,y])=>P(52,x,y,[176,182,192]));P(52,9,14,[120,126,136]);P(52,10,13,[120,126,136]);
  clear(53);for(let y=6;y<16;y++)for(let x=7;x<=8;x++)P(53,x,y,y===6?[255,238,150]:y===7?[255,198,72]:y===8?[236,132,40]:sh([112,82,46],x===8?-18:0));
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const e=Math.max(Math.abs(x-7.5),Math.abs(y-7.5));P(54,x,y,e>6?sh([40,36,60],(tr()-.5)*10):e>4.5?[70,64,96]:sh([90,240,255],-e*14+(tr()-.5)*10));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const hole=((x*7+y*13)%11===0)||((x*3+y*5)%17===0);P(55,x,y,hole?[150,130,40]:sh([214,196,74],(tr()-.5)*24));}
  clear(56);for(let s2=0;s2<4;s2++){const bx=3+s2*3+(tr()*2|0),h=6+(tr()*8|0),w=s2%2?1:2;for(let y=15;y>15-h;y--)for(let k=0;k<w;k++){const tip=y<17-h;P(56,bx+k,y,tip?[240,200,255]:sh([176,96,232],(15-y)*4+(k?-20:0)));}}
  clear(57);for(let y=4;y<15;y++)for(let x=6;x<10;x++)P(57,x,y,y<6?[240,240,230]:sh(((y>>1)%2)?[210,40,40]:[240,210,60],x===9?-30:0));P(57,8,3,[90,70,50]);P(57,8,2,[90,70,50]);P(57,9,1,[255,200,80]);
  ore(64,[214,118,66]);for(let i=0;i<4;i++)P(64,2+(tr()*12|0),2+(tr()*12|0),[96,170,130]);
  ore(65,[214,218,224]);ore(66,[134,160,170]);ore(67,[236,246,252]);for(let i=0;i<5;i++)P(67,tr()*16|0,tr()*16|0,[255,255,255]);
  fill(68,[92,92,98],20);for(let i=0;i<6;i++){const x=1+(tr()*12|0),y=1+(tr()*12|0);P(68,x,y,[178,170,226]);P(68,x+1,y,[132,124,184]);P(68,x,y+1,[150,142,204]);}
  function metal(t,c){for(let y=0;y<16;y++)for(let x=0;x<16;x++){let v=(tr()-.5)*8;if(x===0||y===0)v+=34;else if(x===15||y===15)v-=40;else if(x===1||y===1)v+=14;else if(x===14||y===14)v-=16;if((x+y)%11===0&&x>1&&y>1&&x<14&&y<14)v+=20;if((x===3||x===12)&&(y===3||y===12))v-=34;P(t,x,y,sh(c,v));}}
  metal(69,[206,116,66]);metal(70,[178,124,56]);metal(71,[222,184,82]);metal(72,[120,130,148]);metal(73,[164,170,200]);metal(74,[222,236,244]);
  voronoi(75,[118,118,118],[70,70,70],8);
  voronoi(76,[118,118,118],[70,70,70],8);for(let y=8;y<14;y++)for(let x=4;x<12;x++)P(76,x,y,y>11?[230,120,40]:y>10?[120,50,20]:[24,22,20]);for(let x=3;x<13;x++)P(76,x,7,[60,60,60]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const e=x===0||y===0||x===15||y===15;P(77,x,y,e?[80,80,80]:sh([128,128,128],(tr()-.5)*14+((x===7||x===8)&&y>3&&y<12?-30:0)));}
  metal(78,[96,102,116]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(102,x,y,(y+x)%4<2?sh([214,120,68],(tr()-.5)*14):sh([150,74,40],(tr()-.5)*10));
  metal(103,[110,116,128]);for(let y=4;y<12;y++)for(let x=4;x<12;x++)P(103,x,y,y%2?[40,40,44]:(y>8?[230,120,40]:[70,70,76]));
  metal(104,[96,102,114]);for(let k=5;k<11;k++){P(104,k,7,[40,40,44]);P(104,k,8,[40,40,44]);}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5),spoke=Math.abs(x-7.5)<1||Math.abs(y-7.5)<1||Math.abs(x-y)<1||Math.abs(x+y-15)<1;P(106,x,y,d>6.8?sh([110,80,46],(tr()-.5)*10):d<1.6?[80,82,88]:spoke?sh([168,134,82],-10):sh([126,96,58],(tr()-.5)*10),d>7.6?0:255);}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(107,x,y,sh([168,134,82],(tr()-.5)*12-(x%4===3?26:0)));
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const line=x%5===0||y%5===0;P(108,x,y,line?[180,186,196]:sh([36,56,120],(tr()-.5)*10+((x+y)%7===0?30:0)));}
  metal(109,[150,156,166]);
  metal(110,[90,96,108]);for(let y=3;y<13;y++)for(let x=6;x<10;x++)P(110,x,y,y<6?[60,60,64]:[90,210,110]);
  metal(111,[120,126,138]);P(111,4,7,[220,60,50]);P(111,4,8,[220,60,50]);P(111,11,7,[40,40,44]);P(111,11,8,[40,40,44]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const e=x<2||y<2||x>13||y>13;P(112,x,y,e?[120,124,134]:sh([150,160,170],(tr()-.5)*10));P(113,x,y,e?[150,154,164]:sh([255,250,226],-Math.hypot(x-7.5,y-7.5)*3));}
  metal(114,[132,138,150]);for(let y=6;y<12;y++)for(let x=4;x<12;x++)P(114,x,y,y>9?[255,150,50]:[50,40,36]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const r2=y>>2,off=r2%2?4:0,m=y%4===3||(x+off)%8===7;P(128,x,y,m?sh([40,36,34],(tr()-.5)*6):sh([74,66,62],(tr()-.5)*12+(y%4===0?8:0)));P(136,x,y,m?[40,36,34]:sh([70,62,58],(tr()-.5)*14));}
  for(let i=0;i<3;i++){let x=tr()*16|0,y=tr()*16|0;for(let k=0;k<9;k++){P(136,x,y,[20,18,18]);x+=(tr()*3|0)-1;y+=1;}}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const g=((x+y)%8===0||(x-y+16)%8===0)&&x>0&&y>0&&x<15&&y<15,e=x===0||y===0||x===15||y===15;P(129,x,y,e?[34,32,34]:g?[214,170,70]:sh([62,60,66],(tr()-.5)*8));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const band=y<2||y>13;P(130,x,y,band?sh([206,162,64],(tr()-.5)*14):sh([82,76,72],(x%4===1?-22:x%4===3?10:0)+(tr()-.5)*8));const d=Math.hypot(x-7.5,y-7.5);P(131,x,y,d>6.5?[206,162,64]:sh([82,76,72],((d|0)%2)?-12:6));}
  metal(132,[234,188,64]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const rn=(x===4&&y>2&&y<13)||(y===4&&x>3&&x<9)||(x===11&&y>4&&y<12)||(x-y===2&&x>8&&x<13)||(y===10&&x>5&&x<11);P(133,x,y,rn?[255,170,70]:sh([54,50,52],(tr()-.5)*10));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const band=y===2||y===3||y===12||y===13,clasp=x>=6&&x<=9&&y>=6&&y<=9;P(134,x,y,clasp?[230,190,80]:band?[200,156,60]:sh([92,62,40],(tr()-.5)*12-(x%4===0?14:0)));P(135,x,y,(x<2||y<2||x>13||y>13)?[200,156,60]:sh([100,68,44],(tr()-.5)*12-(y%4===0?16:0)));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const hoop=y===3||y===12;P(137,x,y,hoop?[96,98,104]:sh([150,106,62],(tr()-.5)*12-(x%3===0?18:0)));const d=Math.hypot(x-7.5,y-7.5);P(138,x,y,d>6.6?[96,98,104]:sh([150,106,62],((d*1.4|0)%2)?-12:4));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const page=x>2&&x<13&&y>3&&y<13;P(139,x,y,page?(x===7||x===8?[150,130,100]:sh([232,222,196],(y%2?-12:0))):sh([120,84,52],(tr()-.5)*12));P(140,x,y,sh([120,84,52],(tr()-.5)*12-(y%4===0?18:0)+(x>5&&x<10?10:0)));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(62,x,y,sh([50,38,30],(tr()-.5)*14+((x%4===0)?-12:0)+(tr()<0.06?14:0)));
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const hole=tr()<0.12;P(63,x,y,hole?[0,0,0]:sh([32,54,36],(tr()-.5)*26),hole?0:255);}
  clear(29);for(const [bx,len,ang] of [[7,11,-0.5],[8,12,0.15],[6,9,0.7],[9,10,-0.9]])for(let k=0;k<len;k++){const x=Math.max(0,Math.min(15,Math.round(bx+Math.sin(ang)*k*0.6))),y=15-k;P(29,x,y,[150,96,40]);if(k>2&&k%2===0){if(x>0)P(29,x-1,y,[176,116,52]);if(x<15&&y>0)P(29,x+1,y-1,[132,84,34]);}}
  clear(148);for(let k=0;k<30;k++){const x=3+(tr()*10|0),y=5+(tr()*9|0);P(148,x,y,tr()<0.6?[160,88,178]:[122,62,146]);}for(let x=4;x<12;x+=2)for(let y=11;y<16;y++)P(148,x+(y%2),y,[72,94,54]);
  clear(147);for(let y=0;y<16;y++)for(let x=0;x<16;x++){if(y%4===1||y%4===2){if(x>=1&&x<=14)P(147,x,y,sh([112,78,44],(tr()-.5)*20));}if(x===3||x===12)P(147,x,y,[150,152,158]);if(x===4||x===11)P(147,x,y,[104,106,112]);}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(145,x,y,sh([62,64,74],(tr()-.5)*14+((x+y*3)%11===0?-14:0)+(y%5===0&&x%3===0?10:0)));
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const g=tr();P(146,x,y,g<0.12?[150,255,190]:g<0.2?[110,220,150]:sh([58,108,52],(tr()-.5)*30));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const hole=tr()<0.1;P(143,x,y,hole?[0,0,0]:sh([238,244,250],(tr()-.5)*14),hole?0:255);const snow=y<3+(tr()*3|0),h2=tr()<0.14;P(144,x,y,h2?[0,0,0]:snow?sh([236,242,248],(tr()-.5)*12):sh([44,86,52],(tr()-.5)*40),h2?0:255);}
  clear(141);for(const [x0,y0,x1,y1] of [[2,13,9,11],[6,14,13,12],[4,10,8,15],[9,15,12,10]]){const n=8;for(let k=0;k<=n;k++){const x=Math.round(x0+(x1-x0)*k/n),y=Math.round(y0+(y1-y0)*k/n);P(141,x,y,[226,220,200]);P(141,x,y+1,[180,174,156]);}}
  for(let y=9;y<12;y++)for(let x=10;x<14;x++)P(141,x,y,(x===11&&y===10)||(x===12&&y===10)?[40,36,30]:[230,224,206]);
  clear(142);for(let k=0;k<16;k++){P(142,k,k,[230,230,234],170);P(142,15-k,k,[230,230,234],170);P(142,7,k,[230,230,234],140);P(142,k,7,[230,230,234],140);}for(const rr of [3,6]){for(let a=0;a<32;a++){const x=Math.round(7.5+Math.cos(a/32*6.283)*rr),y=Math.round(7.5+Math.sin(a/32*6.283)*rr);P(142,x,y,[220,220,226],150);}}
  clear(121);for(let y=0;y<16;y++){const w=Math.max(0,Math.round((y-1)/2.6));for(let x=8-w;x<8+w;x++)P(121,x,y,sh([150,128,108],(tr()-.5)*16+(x<8?14:-10)));}
  clear(122);for(let y=0;y<16;y++){const w=Math.max(0,Math.round((15-y)/2.6));for(let x=8-w;x<8+w;x++)P(122,x,y,sh([150,128,108],(tr()-.5)*16+(x<8?14:-10)));}
  fill(123,[226,224,214],12);for(let i=0;i<10;i++)P(123,tr()*16|0,tr()*16|0,[196,194,186]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(124,x,y,sh([150,90,210],(tr()-.5)*30+(((x*3+y*5)%7)===0?40:0)));
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){P(125,x,y,sh([220,214,196],(tr()-.5)*12-(x%4===0?14:0)));P(126,x,y,sh([200,190,170],Math.hypot(x-7.5,y-7.5)<5?-20:0));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(127,x,y,sh([70,200,230],(tr()-.5)*24+((x+y)%5===0?36:0)));
  clear(118);for(const [cx,cy,rr,st] of [[5,9,3,13],[11,7,2.5,12],[8,4,2,9]]){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-cx,(y-cy)*1.5);if(d<rr&&y<=cy)P(118,x,y,sh([80,220,240],(y<cy-1?20:0)+(tr()-.5)*30));}for(let y=cy+1;y<16&&y<=st+3;y++)P(118,Math.round(cx),y,[200,230,220]);}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const band=y<2||y>13||y===7||y===8,edge=x<2||x>13;P(119,x,y,band||edge?sh([110,112,120],(tr()-.5)*10):sh([160,124,74],(tr()-.5)*14-(x%5===0?20:0)));P(120,x,y,(x<2||y<2||x>13||y>13)?[110,112,120]:sh([150,116,68],(tr()-.5)*14-((x+y)%6===0?16:0)));}
  metal(116,[100,106,118]);for(let y=4;y<12;y++)for(let x=5;x<11;x++)P(116,x,y,y<6?[255,210,60]:[40,44,52]);P(116,7,8,[90,200,255]);P(116,8,9,[90,200,255]);P(116,7,10,[90,200,255]);
  metal(117,[120,126,138]);for(let k=4;k<12;k++)P(117,k,7,[60,180,240]);
  metal(115,[110,116,128]);for(let k=3;k<13;k+=3)for(let j=3;j<13;j++)P(115,k,j,[60,62,70]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){P(93,x,y,sh([128,92,60],(tr()-.5)*16-(y%4===0?26:0)));P(94,x,y,sh([82,56,38],(tr()-.5)*12-(y%4===0?18:0)));}
  [[95,4,[120,190,70]],[96,8,[110,180,60]],[97,12,[170,180,70]]].forEach(([t,h,c])=>{clear(t);for(let i=0;i<7;i++){const x=1+i*2+(tr()*2|0),hh=Math.max(2,h-(tr()*3|0));for(let y=15;y>15-hh;y--)P(t,x,y,sh(c,(tr()-.5)*24));}});
  [[98,3],[99,6],[100,9],[101,10]].forEach(([t,h])=>{clear(t);for(let i=0;i<5;i++){const cx=2+i*3,hh=Math.max(2,h-(tr()*3|0));for(let y=15;y>15-hh;y--){P(t,cx,y,[60,130,50]);if(y<14&&tr()<0.7){P(t,cx-1,y,[80,160,60]);P(t,cx+1,y,[70,150,56]);}}if(t===101&&tr()<0.8){P(t,cx,15-hh,[240,240,230]);P(t,cx+1,15-hh,[230,220,120]);}}});
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const ed=x<3||x>12||y<2||(y<5&&(x<5||x>10));P(92,x,y,ed?[0,0,0]:sh([132,132,136],(tr()-.5)*16+((x===7||x===8)&&y>3&&y<11||y===6&&x>4&&x<11?-40:0)),ed?0:255);}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(87,x,y,(x%5===2||y%5===2)?[150,196,246]:sh([40,92,170],(tr()-.5)*10));for(let k=3;k<13;k++){P(87,k,12,[240,246,252]);P(87,3,k,[240,246,252]);P(87,12,k,[240,246,252]);}for(let k=0;k<5;k++){P(87,3+k,7-k,[240,246,252]);P(87,12-k,7-k,[240,246,252]);}
  metal(88,[118,122,132]);for(let x=3;x<13;x++){P(88,x,6,[40,40,44]);P(88,x,7,[60,60,66]);}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const roll=(y>=3&&y<=6)||(y>=9&&y<=12),edge=x===0||x===15||y===0||y===15;P(89,x,y,edge?[90,94,104]:roll?sh([150,154,164],(x%3===0?-40:0)):[34,34,38]);}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const ch=x>=5&&x<=10;P(90,x,y,ch?sh([60,110,200],(y%3===0?24:0)+(tr()-.5)*10):sh([168,134,82],(tr()-.5)*12-(x===4||x===11?30:0)));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(91,x,y,sh([168,134,82],(tr()-.5)*12-(y%4===3?30:0)+((x+y*2)%7===0?-14:0)));
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const top=y<3,coin=Math.hypot(x-7.5,y-9)<2.6;P(84,x,y,top?sh([150,112,64],(tr()-.5)*10):coin?[250,210,70]:sh([168,134,82],(tr()-.5)*14-(y%4===3?26:0)));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const e=x===0||y===0||x===15||y===15;P(86,x,y,e?[110,80,46]:sh([176,140,86],(tr()-.5)*12));}P(86,6,6,[250,210,70]);P(86,7,6,[250,210,70]);P(86,9,8,[214,120,68]);P(86,10,8,[214,120,68]);
  metal(85,[110,118,134]);for(let y=5;y<11;y++)for(let x=5;x<11;x++)P(85,x,y,Math.hypot(x-7.5,y-7.5)<3?[250,210,70]:[70,74,84]);
  fill(81,[152,122,78],16);for(let i=0;i<18;i++)P(81,tr()*16|0,tr()*16|0,[122,96,60]);
  fill(82,[134,96,67],28);for(let x=0;x<16;x++)for(let y=0;y<2+(tr()*2|0);y++)P(82,x,y,sh([152,122,78],(tr()-.5)*16));
  clear(83);for(let i=0;i<7;i++){const x=1+i*2+(tr()*2|0),h=8+(tr()*5|0);for(let y=15;y>15-h;y--)P(83,x,y,y<19-h?sh([226,186,80],(tr()-.5)*30):sh([170,170,70],(tr()-.5)*20));P(83,x+1,16-h,[214,170,64]);}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const r=y>>2,off=r%2?4:0;P(79,x,y,(y%4===3||(x+off)%8===7)?[60,60,64]:sh([110,108,112],(tr()-.5)*12));}
  for(let y=8;y<14;y++)for(let x=5;x<11;x++)P(79,x,y,y>11?[250,150,50]:[30,26,24]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const e=x<2||y<2||x>13||y>13,bar=x===7||x===8;P(80,x,y,e?sh([216,176,72],(x+y)%3?0:-26):bar?[190,150,60]:sh([255,236,170],-Math.hypot(x-7.5,y-7.5)*6));}
  fill(58,[192,104,50],18);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){P(59,x,y,sh([162,84,40],(tr()-.5)*8));P(60,x,y,sh([112,70,52],(tr()-.5)*8));P(61,x,y,sh([204,164,122],(tr()-.5)*8));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(62,x,y,tr()<.05?[70,110,40]:sh([92,72,34],(x%3===1?-16:0)+((y+x*3)%9===0?-12:0)+(tr()-.5)*14));
  leaves(63,[42,124,30],0.15);
  // cold lights (D-023), drawn from their lit tiles without the shared random stream
  const px=(t,x,y)=>{const i=((((t/AC)|0)*TS+y)*AW+(t%AC)*TS+x)*4;return[dat[i],dat[i+1],dat[i+2],dat[i+3]];};
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const e=x<2||y<2||x>13||y>13,bar=x===7||x===8,c=px(80,x,y);
    P(192,x,y,e||bar?[c[0]*0.62,c[1]*0.58,c[2]*0.5]:sh([58,54,50],(x*7+y*3)%5*3-Math.hypot(x-7.5,y-7.5)*2));
    const g=px(34,x,y),m=(g[0]+g[1]+g[2])/3;P(194,x,y,[m*0.42+30,m*0.4+28,m*0.36+26]);}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const c=px(3,x,y),rune=(x===7||x===8)&&y>2&&y<13||(y===5||y===10)&&x>4&&x<11;P(195,x,y,rune?[120,190,230]:[c[0]*0.85+10,c[1]*0.85+12,c[2]*0.85+18]);} // waystone: worn stone with a glowing rune
  clear(193);for(let y=6;y<16;y++)for(let x=7;x<=8;x++)P(193,x,y,y<=7?[38,32,30]:y===8?[64,50,40]:sh([112,82,46],x===8?-18:0));
  // climbing gear (M4): ladder, rope, iron piton, grapnel hook; patterned without the shared random stream
  const nz=(x,y,k)=>((x*73+y*151+k*29)%13)-6;
  clear(196);for(let y=0;y<16;y++)for(const x of [2,3,12,13])P(196,x,y,sh([138,98,56],nz(x,y,1)*2+(x===2||x===12?14:-8)));
  for(const r of [2,7,12])for(let x=4;x<12;x++){P(196,x,r,sh([152,110,64],nz(x,r,2)*2+8));P(196,x,r+1,sh([112,80,44],nz(x,r,3)*2));}
  clear(197);for(let y=0;y<16;y++){const o=(y>>1)%2;P(197,7,y,sh([170,136,86],o?18:-6));P(197,8,y,sh([140,108,64],o?-10:10));}
  clear(198);for(let x=3;x<13;x++){P(198,x,7,[150,154,164]);P(198,x,8,[96,100,110]);}for(let y=4;y<12;y++){P(198,11,y,[176,180,190]);P(198,12,y,[110,114,124]);}P(198,3,6,[200,204,212]);
  clear(199);for(let y=8;y<16;y++){const o=(y>>1)%2;P(199,7,y,sh([170,136,86],o?18:-6));P(199,8,y,sh([140,108,64],o?-10:10));}
  for(let y=0;y<9;y++){P(199,7,y,[170,174,184]);P(199,8,y,[110,114,124]);}
  for(const s2 of [-1,1])for(let k=0;k<5;k++){const x=s2<0?6-k:9+k,y=k<3?1+k:5-(k-3)*2;P(199,x,y,s2<0?[190,194,204]:[120,124,134]);P(199,x,y+1,[90,94,104]);}
  // storage and food (M4b): oak chest top and side, bilberry bush, brown mushroom, turnip and bean stages; no shared random draws
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const e=x===0||y===0||x===15||y===15,pl=y%5===4;
    P(200,x,y,e?[92,62,34]:sh([168,124,72],nz(x,y,4)*2+(pl?-30:0)));P(201,x,y,e||y===6?[84,58,32]:sh([160,118,68],nz(x,y,5)*2+(y%5===2?-24:0)));}
  for(let y=5;y<9;y++)for(let x=6;x<10;x++)P(201,x,y,(x===6||x===9||y===8)?[70,70,78]:[176,178,186]);
  clear(202);for(let y=6;y<16;y++)for(let x=1;x<15;x++){const d=Math.hypot((x-7.5)/7,(y-11)/5.2);if(d<1&&(x*5+y*3)%7)P(202,x,y,sh([58,104,46],nz(x,y,6)*3-(y>13?16:0)));}
  for(const [x,y] of [[4,9],[7,8],[10,10],[12,8],[5,12],[9,12],[3,11],[11,13],[7,11]]){P(202,x,y,[70,84,170]);P(202,x+1,y,[46,52,120]);P(202,x,y+1,[40,44,104]);}
  clear(203);for(let y=10;y<16;y++)for(let x=7;x<9;x++)P(203,x,y,[222,212,190]);for(let y=6;y<11;y++)for(let x=3;x<13;x++){const d=Math.hypot((x-7.5)/5,(y-10)/4);if(d<1)P(203,x,y,y===10?[96,70,48]:sh([150,102,62],nz(x,y,7)*2+(x<7&&y<8?18:0)));}
  [[204,4,0],[205,8,0],[206,11,1]].forEach(([t,h,root])=>{clear(t);for(const ox of [4,7,10])for(let k=0;k<h;k++){const x=ox+Math.round(Math.sin(k*0.9+ox)*0.8);P(t,x,15-k-(root?2:0),sh([84,146,56],nz(x,k,8)*3+(k>h-3?14:0)));P(t,x+1,15-k-(root?2:0),[64,118,42]);}
    if(root)for(let y=12;y<16;y++)for(let x=4;x<12;x++){const d=Math.hypot((x-7.5)/4,(y-14.5)/2.6);if(d<1)P(t,x,y,y<14?[160,90,170]:[232,226,214]);}});
  [[207,5,0],[208,10,0],[209,15,1]].forEach(([t,h,pods])=>{clear(t);for(let k=0;k<h;k++){const x=7+Math.round(Math.sin(k*0.7)*1.5);P(t,x,15-k,[76,132,50]);if(k%3===1){P(t,x-1,15-k,[96,160,62]);P(t,x+1,14-k,[96,160,62]);}}
    if(pods)for(const [x,y] of [[4,4],[10,6],[5,9],[11,11]]){for(let k=0;k<4;k++)P(t,x,y+k,[150,196,92]);P(t,x+1,y+1,[120,168,70]);}});
  // the forests (M6b): six woods, three forest floors, fern, bluebells and moonpetal; hashed noise, no shared random draws
  const hn=(x,y,k)=>{let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(k,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;};
  const bark=(t,c,k,stripe)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(t,x,y,sh(c,(hn(x,y,k)-.5)*22+(x%4===stripe?-24:0)+(hn(x>>1,y>>2,k+1)<.15?-18:0)));};
  const ring=(t,a,b,c,k)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5);P(t,x,y,d>6.8?sh(c,(hn(x,y,k)-.5)*16):sh(((d|0)%2)?a:b,(hn(x,y,k+1)-.5)*12));}};
  const leaf=(t,c,hole,k,spark)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const q=hn(x,y,k);if(q<hole)P(t,x,y,[0,0,0],0);else P(t,x,y,spark&&hn(x,y,k+7)<spark[1]?spark[0]:sh(c,(hn(x,y,k+3)-.5)*50));}};
  const plank=(t,c,k)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const b=y>>2;let v=(hn(x,y,k)-.5)*14;if(y%4===3)v-=30;if(x===((b*7+4)&15))v-=26;P(t,x,y,sh(c,v));}};
  const floorTop=(t,cs,k)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const q=hn(x,y,k);P(t,x,y,sh(cs[Math.floor(q*cs.length)],(hn(x,y,k+2)-.5)*20));}};
  const floorSide=(t,top,k)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=2+Math.floor(hn(x,0,k)*3);P(t,x,y,y<d?sh(top,(hn(x,y,k+1)-.5)*24):sh([134,96,67],(hn(x,y,k+2)-.5)*28+(hn(x,y,k+3)<.06?-34:0)));}};
  bark(147,[96,70,52],11,1);ring(148,[196,150,104],[170,126,84],[96,70,52],12);leaf(149,[192,58,34],0.18,13,[[236,150,40],0.12]);leaf(150,[222,164,40],0.18,14,[[240,206,90],0.1]);plank(151,[186,128,86],15);
  bark(152,[92,62,40],21,2);ring(153,[204,164,108],[176,138,86],[92,62,40],22);leaf(154,[34,92,52],0.22,23);plank(155,[200,160,106],25);
  bark(156,[120,64,46],31,0);ring(157,[178,96,66],[150,78,52],[120,64,46],32);leaf(158,[44,96,40],0.14,33);plank(159,[166,92,64],35);
  bark(160,[110,52,40],41,3);ring(161,[204,120,80],[176,96,62],[110,52,40],42);leaf(162,[28,70,40],0.12,43);plank(163,[184,98,66],45);
  bark(164,[206,208,206],51,1);ring(165,[226,222,206],[204,198,180],[196,198,196],52);leaf(166,[176,200,196],0.2,53,[[236,244,242],0.15]);plank(167,[226,222,206],55);
  bark(168,[110,96,70],61,2);ring(169,[196,180,132],[170,154,108],[110,96,70],62);leaf(170,[122,160,62],0.24,63);plank(171,[198,184,136],65);
  floorTop(172,[[176,70,36],[212,120,40],[150,92,44],[110,72,40]],71);floorSide(173,[176,90,40],72);
  floorTop(174,[[132,86,46],[112,72,40],[156,104,58]],74);floorSide(175,[132,86,46],75);
  floorTop(176,[[70,118,44],[58,102,38],[86,134,52]],77);floorSide(177,[70,118,44],78);
  clear(178);for(let f=0;f<5;f++){const ox=2+f*3,h=7+Math.floor(hn(f,0,81)*7),dir=f%2?1:-1;for(let k=0;k<h;k++){const x=ox+Math.round(dir*k*0.25),y=15-k;P(178,x,y,[62,126,44]);if(k>1&&k%2===0){P(178,x-1,y,[84,150,56]);P(178,x+1,y,[84,150,56]);}}}
  clear(179);for(let f=0;f<4;f++){const ox=3+f*3,h=8+Math.floor(hn(f,1,82)*5);for(let k=0;k<h;k++)P(179,ox,15-k,[70,130,48]);for(let k=0;k<4;k++){P(179,ox+1,16-h+k*2,[88,96,206]);P(179,ox+1,17-h+k*2,[60,64,160]);}}
  clear(180);for(let y=8;y<16;y++)P(180,7,y,[86,140,110]);for(let a=0;a<6;a++){const x=7+Math.round(Math.cos(a)*2.5),y=6+Math.round(Math.sin(a)*2.5);P(180,x,y,[232,240,255]);P(180,(x+7)>>1,(y+6)>>1,[200,214,250]);}P(180,7,6,[250,236,150]);
  // highlands and cold (M6c): limestone, glacier ice, packed snow, tundra moss, mistwood, gentian, edelweiss
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){P(181,x,y,sh([206,202,186],(hn(x,y,91)-.5)*18+(y%5===0&&hn(x,y,92)<.6?-20:0)+(hn(x>>2,y>>1,93)<.12?-26:0)));
    P(182,x,y,sh([150,200,236],(hn(x,y,94)-.5)*16+((x+y*2)%9===0?24:0)));P(183,x,y,sh([226,232,240],(hn(x,y,95)-.5)*14));}
  floorTop(184,[[122,118,70],[104,102,64],[140,128,80],[96,110,72]],96);floorSide(185,[118,114,70],97);
  bark(186,[70,86,58],98,2);for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(hn(x,y,99)<.3)P(186,x,y,[88,130,62]);ring(187,[176,160,120],[150,136,98],[70,86,58],100);
  leaf(188,[60,120,84],0.16,101,[[150,190,150],0.1]);plank(189,[150,140,104],102);
  clear(190);for(let f=0;f<3;f++){const ox=3+f*5;for(let k=0;k<7;k++)P(190,ox,15-k,[62,120,52]);for(let dy=0;dy<3;dy++)for(let dx=-1;dx<=1;dx++)P(190,ox+dx,7-dy+Math.abs(dx),[44,74,200]);}
  clear(191);for(let f=0;f<3;f++){const ox=3+f*5;for(let k=0;k<6;k++)P(191,ox,15-k,[140,150,130]);for(let a=0;a<5;a++){P(191,ox+Math.round(Math.cos(a*1.26)*2),8+Math.round(Math.sin(a*1.26)*2),[236,236,226]);}P(191,ox,8,[226,206,90]);}
  // coasts and waters (M6d): chalk, black sand, basalt (top and side), peat, bog moss, kelp, seagrass, lily pad, cotton grass
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){P(210,x,y,sh([236,234,224],(hn(x,y,111)-.5)*12+(hn(x>>1,y,112)<.05?-60:0)));P(211,x,y,sh([68,65,70],(hn(x,y,113)-.5)*28+(hn(x,y,114)<.06?44:0)+(hn(x>>1,y>>1,300)<.18?-12:0)));
    const e=x===0||x===15||y===0||y===15||((x+y*3)%11===0&&hn(x,y,115)<.5);P(212,x,y,sh([92,91,98],(hn(x,y,116)-.5)*14+(e?-34:(x===1||y===1)?10:0)));P(213,x,y,sh([88,87,94],(hn(x,y,117)-.5)*14+(x%5===0?-34:x%5===1?12:x%5===4?-8:0)+(y===(((x/5|0)*7+3)&15)?-22:0)));
    P(214,x,y,sh([74,52,36],(hn(x,y,118)-.5)*22+(hn(x,y>>1,119)<.15?16:0)));const q=hn(x,y,120);P(215,x,y,sh(q<.35?[204,92,84]:q<.7?[222,150,72]:[150,178,72],(hn(x,y,121)-.5)*20));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=2+Math.floor(hn(x,0,122)*2);P(216,x,y,y<d?sh([160,90,56],(hn(x,y,123)-.5)*20):sh([74,52,36],(hn(x,y,124)-.5)*22));}
  clear(217);for(let f=0;f<3;f++){const ox=3+f*5;for(let y=0;y<16;y++){const x=ox+Math.round(Math.sin(y*0.6+f)*1.2);P(217,x,y,[64,110,40]);P(217,x+1,y,[86,132,52]);if(y%4===f)P(217,x+2,y,[100,148,60]);}}
  clear(218);for(let f=0;f<7;f++){const ox=1+f*2,h=6+Math.floor(hn(f,2,125)*9);for(let k=0;k<h;k++)P(218,ox+(k>h/2?(f%2?1:-1):0),15-k,sh([60,140,70],(hn(f,k,126)-.5)*30));}
  clear(219);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5),a=Math.atan2(y-7.5,x-7.5);if(d<7&&!(a>-0.25&&a<0.25&&d>1.5))P(219,x,y,sh([62,130,48],(hn(x,y,127)-.5)*24+(d>6?-20:0)));}P(219,5,5,[236,206,226]);P(219,6,5,[250,230,240]);P(219,5,6,[226,190,214]);
  clear(220);for(let f=0;f<4;f++){const ox=2+f*4,h=8+Math.floor(hn(f,3,128)*6);for(let k=0;k<h;k++)P(220,ox,15-k,[96,130,64]);for(let dy=0;dy<3;dy++)for(let dx=-1;dx<=1;dx++)P(220,ox+dx,16-h-dy,[244,244,236]);}
  // dry and fiery (M6e): golden grass (top, side), steppe grass, ash, magma stone, dead grass (top, side), dead wood (rings, bark)
  floorTop(221,[[208,176,82],[222,192,96],[190,158,70],[230,204,120]],131);floorSide(222,[208,176,82],132);
  clear(223);for(let f=0;f<8;f++){const ox=1+f*2,h=6+Math.floor(hn(f,4,133)*9),lean=f%3-1;for(let k=0;k<h;k++)P(223,ox+Math.round(k*lean*0.15),15-k,sh([220,186,96],(hn(f,k,134)-.5)*30+(k>h-3?20:0)));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){P(224,x,y,sh([112,108,104],(hn(x,y,135)-.5)*26+(hn(x,y,136)<.05?-30:0)));const m=hn(x>>1,y>>1,137);P(225,x,y,m<.3?sh([250,130,30],(hn(x,y,138)-.5)*40):sh([76,60,54],(hn(x,y,139)-.5)*22+(hn(x>>1,y>>1,301)<.2?-12:0)));}
  floorTop(226,[[128,122,96],[112,108,88],[140,130,104],[96,94,82]],140);floorSide(227,[124,118,94],141);
  bark(228,[104,100,94],142,1);ring(229,[150,144,132],[130,124,114],[104,100,94],143);
  // strange lands (M6f): prism shard, petrified wood (side, rings), amber, starmetal ore, scorched stone, glowcap flesh and gills, pale grass
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const f=((x+y)%5===0)||((x-y+16)%7===0);P(230,x,y,f?[250,250,255]:sh([196,214,250],(hn(x,y,151)-.5)*40+(y<8?18:0)));
    P(231,x,y,sh([150,140,124],(hn(x,y,152)-.5)*20+(x%4===1?-22:0)));const d=Math.hypot(x-7.5,y-7.5);P(232,x,y,sh(((d|0)%2)?[176,164,146]:[156,146,130],(hn(x,y,153)-.5)*14));
    P(233,x,y,sh([226,150,40],(hn(x,y,154)-.5)*30+(hn(x>>1,y>>1,155)<.2?30:0)));P(235,x,y,sh([84,76,80],(hn(x,y,156)-.5)*24+(hn(x,y,157)<.08?50:0)+(hn(x>>2,y,302)<.12?-16:0)));
    P(236,x,y,sh([176,150,206],(hn(x,y,158)-.5)*20+(hn(x>>1,y>>1,159)<.18?40:0)));P(237,x,y,(x%3===0)?[120,240,210]:sh([90,160,170],(hn(x,y,160)-.5)*20));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(234,x,y,sh([128,128,128],(hn(x,y,163)-.5)*22));for(let i=0;i<5;i++){const x=1+Math.floor(hn(i,0,164)*12),y=1+Math.floor(hn(i,1,164)*12);P(234,x,y,[150,190,255]);P(234,x+1,y,[128,168,233]);P(234,x,y+1,[136,176,241]);P(234,x+1,y+1,[170,210,255]);}
  floorTop(238,[[176,196,160],[190,206,176],[160,182,150],[206,214,196]],161);floorSide(239,[176,196,160],162);
  // old lands of men (M6g): orchard leaves with apples, blossom, oxeye daisy, lavender
  leaf(240,[64,132,44],0.16,171,[[200,40,36],0.06]);leaf(241,[236,196,214],0.18,172,[[250,236,244],0.2]);
  clear(242);for(let f=0;f<3;f++){const ox=3+f*5,h=7+Math.floor(hn(f,5,173)*5);for(let k=0;k<h;k++)P(242,ox,15-k,[70,130,48]);const cy=15-h;for(let a=0;a<8;a++)P(242,ox+Math.round(Math.cos(a*0.785)*2),cy+Math.round(Math.sin(a*0.785)*2),[244,244,236]);P(242,ox,cy,[236,196,60]);}
  // the burnt land (D-051)
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    const rip=(y+Math.floor(hn(x>>2,0,303)*3))%5;P(244,x,y,sh([66,62,60],(hn(x,y,180)-.5)*16+(hn(x,y,181)<.07?42:0)+(hn(x>>1,y>>1,182)<.2?-10:0)+(rip===0?-14:rip===1?8:0))); // black ash: soft, flecked with grey, rippled by the wind
    const pit=hn(x,y,183);P(245,x,y,pit<.12?[30,24,24]:pit<.17?sh([124,62,42],(hn(x,y,184)-.5)*20):sh([84,76,76],(hn(x,y,185)-.5)*24+(hn(x>>1,y>>1,186)<.3?-12:0)+(pit<.24?12:0))); // cinder: porous, rusty pits
    // lava crust: black plates with glowing seams between them
    {let d1=99,d2=99;for(let k=0;k<5;k++){const px=hn(k,0,187)*16,py=hn(k,1,187)*16;for(const ox of [-16,0,16])for(const oy of [-16,0,16]){const d=Math.hypot(x-px-ox,y-py-oy);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}}
      P(246,x,y,d2-d1<0.75?sh([240,(d2-d1<0.35?150:80),24],(hn(x,y,188)-.5)*30):d2-d1<1.3?sh([70,26,18],(hn(x,y,188)-.5)*16):sh([58,52,52],(hn(x,y,189)-.5)*16+(d2-d1>2.6?12:0)));}
    // charred wood: black bark split in grey cracks; its rings; smouldering bark glows in its cracks
    const crack=hn(x,y>>2,190)<.18||hn(x,(y+2)>>2,191)<.06;P(247,x,y,crack?sh([124,116,110],(hn(x,y,192)-.5)*16):sh([52,46,44],(hn(x,y,193)-.5)*14+(x%3===0?-10:x%3===1?6:0)));
    P(249,x,y,crack?sh([255,120+hn(x,y,194)*80,30],(hn(x,y,195)-.5)*20):sh([54,40,36],(hn(x,y,196)-.5)*14+(x%3===0?-10:0)));
    const r=Math.hypot(x-7.5,y-7.5);P(248,x,y,r>6.5?sh([48,42,40],(hn(x,y,304)-.5)*10):sh([88,80,74],(Math.floor(r)%2?-16:6)+(hn(x,y,197)-.5)*10));
    P(250,x,y,sh([176,154,64],(hn(x,y,198)-.5)*30+(hn(x>>1,y>>1,199)<.25?26:0)+(hn(x,y,200)<.08?-50:0))); // sulphur
    // fumarole: cinder round a glowing throat
    const t=Math.hypot(x-7.5,y-7.5);P(251,x,y,t<2.6?sh([255,150,40],(hn(x,y,201)-.5)*40):t<4?sh([200,170,60],(hn(x,y,202)-.5)*30):sh([84,76,76],(hn(x,y,203)-.5)*22));
  }
  // The foes' places (D-052): hide canvas stitched in panels, an iron grate, basalt bricks, the same with glowing mortar, a pole
  // of skulls and a ragged war banner (the last two drawn like plants)
  clear(253);clear(256);clear(257);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    const seam=x===7||y===7,stitch=(x===6||x===8)&&y%3===0||(y===6||y===8)&&x%3===0;
    P(252,x,y,seam?[78,52,32]:stitch?[196,170,128]:sh([150,108,70],(hn(x,y,210)-.5)*18+(hn(x>>2,y>>2,211)<.25?-16:0)+(hn(x,y,212)<.05?-26:0)));
    const bar=(x%5===1||x%5===2),band=y===3||y===12;if(bar||band)P(253,x,y,sh([66,64,70],(x%5===1&&!band?18:0)+(hn(x,y,213)-.5)*14+(hn(x,y,214)<.1?-20:0)));
    const row=y>>2,off=row%2?4:0,mort=y%4===3||(x+off)%8===7;
    const bev=(y%4===0?16:y%4===2?-8:0)+((x+off)%8===0?8:(x+off)%8===6?-6:0);
    P(254,x,y,mort?sh([34,31,35],(hn(x,y,215)-.5)*8):sh([86,82,90],(hn(x,y,216)-.5)*16+(hn((x+off)>>3,row,217)-.5)*20+bev));
    P(255,x,y,mort?sh([250,(hn(x,y,218)<.5?120:170),34],(hn(x,y,219)-.5)*30):sh([74,70,76],(hn(x,y,220)-.5)*14+(hn((x+off)>>3,row,221)-.5)*16+bev));
  }
  for(let y=0;y<16;y++){P(256,7,y,sh([60,44,32],(hn(7,y,222)-.5)*14));P(256,8,y,sh([44,32,24],(hn(8,y,222)-.5)*14));}
  for(const sy of [1,8])for(let y=0;y<5;y++)for(let x=5;x<11;x++){const eye=y===2&&(x===6||x===9),jaw=y===4&&(x===5||x===10);if(jaw)continue;P(256,x,sy+y,eye?[20,14,12]:sh([222,214,190],(hn(x,y+sy,223)-.5)*24-(y===4?30:0)));}
  for(let y=0;y<16;y++)P(257,2,y,sh([58,40,28],(hn(2,y,224)-.5)*12));
  for(let y=1;y<13;y++)for(let x=3;x<14;x++){if(y>9&&hn(x,0,225)<(y-9)/4)continue;const em=Math.abs(x-8)+Math.abs(y-5)*1.3<3.2&&!(Math.abs(x-8)+Math.abs(y-5)*1.3<1.4);
    P(257,x,y,em?[24,20,20]:sh([148,30,24],(hn(x,y,226)-.5)*22+(x===3?-20:0)));}
  clear(243);for(let f=0;f<5;f++){const ox=2+f*3,h=8+Math.floor(hn(f,6,174)*6);for(let k=0;k<h;k++)P(243,ox,15-k,k>h-5?sh([150,110,210],(hn(f,k,175)-.5)*30):[90,130,80]);}
  // The Emberlords' masonry (D-058): cracked basalt bricks, polished tiles, a carved panel (a flame between horns), burning
  // script, obsidian bricks, a fluted pillar, a chain, a basket of fire and a row of spikes (the last two drawn like plants)
  clear(265);clear(269);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    const row=y>>2,off=row%2?4:0,mort=y%4===3||(x+off)%8===7,chip=hn((x+off)>>3,row,230)<.35&&((x+off)%8===6||(x+off)%8===0)&&(y%4===0||y%4===2);
    P(258,x,y,mort||chip?sh([30,28,31],(hn(x,y,231)-.5)*8):sh([80,76,84],(hn(x,y,232)-.5)*18+(hn((x+off)>>3,row,233)-.5)*22+(hn(x>>1,y>>1,234)<.18?-12:0)+(y%4===0?14:y%4===2?-8:0)));
    const tx=x&7,ty=y&7,tl=(hn(x>>3,y>>3,235)-.5)*10;
    P(259,x,y,tx===0||ty===0?sh([32,30,36],(hn(x,y,236)-.5)*6):sh([78,76,86],tl+(tx===1||ty===1?14:tx===7||ty===7?-10:0)+(hn(x,y,237)-.5)*7+((tx+ty)===8&&hn(x,y,238)<.5?8:0)));
    // carved: a frame, and a flame rising between two horns, cut into the stone (dark in the cut, lit along its lower edge)
    const fw=y>=3&&y<=13?(y<9?(y-3)*0.55:(13-y)*0.8):-9,dx=Math.abs(x-7.5),flame=fw>0&&dx<=fw+0.5&&dx>=fw-0.7,horn=(y>=3&&y<=8&&Math.abs(dx-(2.5+(8-y)*0.55))<0.6),frame=x===1||x===14||y===1||y===14;
    P(260,x,y,flame||horn||frame?[36,32,38]:sh([90,86,94],(hn(x,y,239)-.5)*12+((flame||horn||frame)?0:(x===2||x===15||y===2||y===15)?10:0)));
    P(261,x,y,y===1||y===14?[42,39,44]:sh([76,72,78],(hn(x,y,240)-.5)*12));
    const ob=y%4===3||(x+off)%8===7;P(262,x,y,ob?sh([22,17,30],(hn(x,y,241)-.5)*6):sh([54,42,72],(hn(x,y,242)-.5)*14+((x+2*y)%9===0&&hn(x,y,243)<.6?44:0)+(hn((x+off)>>3,row,244)-.5)*10+(y%4===0?14:y%4===2?-8:0)+((x+off)%8===0?8:0)));
    const r=Math.hypot(x-7.5,y-7.5);P(263,x,y,r>7?[44,42,48]:sh([88,84,92],(Math.abs(r-5)<0.6?-18:0)+(r<1.5?-10:0)+(hn(x,y,245)-.5)*10));
    P(264,x,y,sh([86,82,90],(x%4===0?-32:x%4===1?16:0)+(y===0||y===15?-14:0)+(hn(x,y,246)-.5)*10+(hn(x>>2,y,247)<.08?-14:0)));
    // a basket of fire: an iron rim round glowing coals (top), iron underneath, bars with coals low and flames high (sides)
    const coal=hn(x>>1,y>>1,248),hot=coal<.3?[255,214,96]:coal<.65?[244,120,32]:[110,34,18];
    P(266,x,y,x===0||y===0||x===15||y===15?sh([72,68,70],(hn(x,y,249)-.5)*10):sh(hot,(hn(x,y,250)-.5)*30));
    P(267,x,y,sh([64,60,66],(x%5===2||y%5===2?14:0)+(hn(x,y,251)-.5)*10));
    const bar=x%5===0,band=y===0||y===8||y===15,fl=y<8?(hn(x,0,252)*8>y+(hn(x,y,253)<.3?2:0)?0:1):2;
    P(268,x,y,bar||band?sh([74,70,72],(bar&&!band?(x===0?-8:8):0)+(hn(x,y,254)-.5)*10):fl===0?[34,18,14]:fl===1?sh(y<4?[255,226,120]:[255,150,40],(hn(x,y,255)-.5)*30):sh(hot,(hn(x,y,256)-.5)*24));
  }
  // the burning script: two rows of angular signs, each a stem with two or three strokes branching from it
  for(const [ry,sr] of [[3,0],[9,1]])for(let g=0;g<4;g++){const x0=1+g*4,glow=[255,130+Math.floor(hn(g,sr,258)*60),36],B=[[[2,0]],[[2,4]],[[0,2]],[[0,0]],[[2,1],[2,2]],[[0,3],[0,4]]];
    for(let y=0;y<5;y++)P(261,x0+1,ry+y,glow);const a=Math.floor(hn(g,sr,257)*6),b=(a+1+Math.floor(hn(g,sr,259)*5))%6;for(const q of [a,b])for(const [dx,dy] of B[q])P(261,x0+dx,ry+dy,glow);
    if(hn(g,sr,260)<.4)for(const [dx,dy] of B[(b+3)%6])P(261,x0+dx,ry+dy,glow);}
  // cracks across the cracked bricks
  for(let c=0;c<3;c++){let x=Math.floor(hn(c,1,262)*16),y=Math.floor(hn(c,2,262)*6);for(let k=0;k<11;k++){P(258,x&15,y&15,[24,21,24]);if(hn(c,k,263)<.35)P(258,(x+1)&15,y&15,[44,40,44]);x+=hn(c,k,264)<.5?1:-1;y+=hn(c,k,265)<.7?1:0;}}
  // the chain: front-on rings and side-on links in turn
  for(const y0 of [4,12])for(let y=y0+1;y<y0+5;y++){P(265,7,y&15,[96,92,100]);P(265,8,y&15,[56,54,60]);}
  for(const y0 of [0,8]){for(let y=y0+1;y<y0+5;y++){P(265,6,y,[100,96,104]);P(265,9,y,[58,56,62]);}for(const y of [y0,y0+5]){P(265,7,y,[88,84,92]);P(265,8,y,[70,68,74]);}}
  // spikes on a bar, their tips rusted dark
  for(const [cx,top] of [[3,5],[8,2],[12,6]])for(let y=top;y<16;y++){const w=(y-top)/(15-top)*1.6;for(let x=Math.floor(cx-w);x<=Math.ceil(cx+w);x++)if(Math.abs(x-cx)<=w+0.2)P(269,x,y,y<top+3?[96,40,30]:sh([66,64,70],(x<cx?14:-6)+(hn(x,y,261)-.5)*10));}
  for(let x=1;x<15;x++){P(269,x,12,[52,50,56]);P(269,x,13,[40,38,44]);}
  // The realms of men (D-060): dressed whitestone with faint veins and an edge to every block; whitestone ashlar in long courses,
  // bevelled; the realm's sign (an eight-pointed star over a tower) raised on a sunk panel; a fluted pillar; overlapping slate
  // scales; white plaster in dark timbers, plain and braced; thatch; the realm's banner (black, a silver border, the star and
  // tower in white, swallow-tailed); hay bound with cord; flagstones; leaded glass in diamonds
  clear(280);clear(284);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    const vein=Math.abs(fbm2((x+3)/5,(y+hn(x>>2,0,320)*3)/5,1,9301.7))<0.06;
    P(270,x,y,sh([214,210,198],(hn(x,y,321)-.5)*10+(vein?-14:0)+(x===0||y===0?8:x===15||y===15?-18:0)+(hn(x>>2,y>>2,322)-.5)*6));
    const row=y>>2,off=row%2?8:0,jx=(x+off)%16,mort=y%4===3||jx===15;
    P(271,x,y,mort?sh([150,146,136],(hn(x,y,323)-.5)*6):sh([208,204,192],(hn(x,y,324)-.5)*8+(hn((x+off)>>4,row,325)-.5)*12+(y%4===0?12:y%4===2?-8:0)+(jx===0?8:jx===14?-8:0)));
    const r=Math.hypot(x-7.5,y-7.5);P(273,x,y,r>7?sh([176,172,160],(hn(x,y,326)-.5)*6):sh([214,210,198],(Math.abs(r-5)<0.6?-26:0)+(r<1.5?-8:0)+(hn(x,y,327)-.5)*8));
    P(274,x,y,sh([212,208,196],(x%4===0?-34:x%4===1?14:x%4===3?-8:0)+(y<=1?(y===0?-10:12):y>=14?(y===15?-22:6):0)+(hn(x,y,328)-.5)*6));
    // slate: rows of scales four high, staggered, lit along their upper edge and shaded along the lower
    const sr=y>>2,sx=(x+(sr%2?2:0))%4,sy=y%4;P(275,x,y,sh([74,82,96],(hn((x+(sr%2?2:0))>>2,sr,329)-.5)*18+(sy===0?16:sy===3?-22:0)+(sx===0?-12:0)+(hn(x,y,330)-.5)*6));
    const beam=y<=1||y>=14||x<=1||x>=14,wood=sh([88,60,38],(hn(x,y>>1,331)-.5)*14+(y===1||x===1?-10:0)),plas=sh([228,222,206],(hn(x,y,332)-.5)*10+(hn(x>>2,y>>2,333)<.15?-10:0));
    P(276,x,y,beam?wood:plas);const br=Math.abs((x-1)-(14-y))<=1.2&&x>1&&x<14&&y>1&&y<14;P(277,x,y,beam||br?wood:plas);
    // thatch: straws laid at a slant, darker in bands; the side shows the cut ends in rows
    P(278,x,y,sh([198,166,88],(hn(x,(x+y*2)>>1,334)-.5)*26+((x+2*y)%5===0?-22:0)+(hn(x>>2,y,335)-.5)*10));
    P(279,x,y,sh([190,158,82],(hn(x,y>>2,336)-.5)*20+(y%4===3?-30:y%4===0?12:0)+(x%2?-6:4)+(hn(x,y,337)-.5)*10));
    const band=x===4||x===11,rim=x===0||y===0||x===15||y===15;
    P(281,x,y,band?[96,70,40]:sh([206,176,96],(Math.floor(Math.hypot(x-7.5,y-7.5))%2?-14:6)+(hn(x,y,338)-.5)*20+(rim?-12:0)));
    P(282,x,y,band?[96,70,40]:sh([200,170,90],(y%2?-10:6)+(hn(x>>1,y,339)-.5)*24));
    // leaded glass: lead in a lattice of diamonds round pale panes
    const lead=x===0||y===0||x===15||y===15||(x+y)%6===2||(x-y+18)%6===2;P(284,x,y,lead?[66,66,72]:sh([196,220,214],(hn(x,y,345)-.5)*12+((x+y)%6===3?18:0)),lead?255:120);
  }
  // rough whitestone: big rock-faced blocks in two courses, each face bulging (lit above and to the left, shaded below), chisel
  // pocks, deep joints; the moulding: a band of profile (a lit fillet, a bead, a shaded hollow, a plain face, a dark drip line)
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const row=y>>3,off=row?6:0,jx=(x+off)%12,bx=Math.floor((x+off)/12),cy=y&7,joint=cy===7||jx===11;
    const bulge=(3.5-Math.abs(cy-3.2))*3+(5.5-Math.abs(jx-5))*1.6,c=hn(x,y,352)<.12?-16:0;
    P(285,x,y,joint?sh([118,114,104],(hn(x,y,353)-.5)*8):sh([196,192,178],bulge+(cy===0?14:cy===6?-18:0)+(jx===0?8:jx===10?-12:0)+c+(hn(x,y,354)-.5)*12+(hn(bx,row,355)-.5)*14));
    const prof=[16,22,-6,10,4,-20,-28,0,2,0,-2,4,0,-4,-16,-30][y];P(286,x,y,sh([214,210,198],prof+(hn(x,y,356)-.5)*6+(y===3&&x%4===0?-10:0)+(hn(x>>2,y,357)-.5)*4));}
  // the realm's sign, drawn pixel by pixel: an eight-pointed star (a square core, long rays up, down and across, short ones on the
  // diagonals) over a tower with two merlons, a lit window and a wider footing
  const SIGN=(x,y)=>{if(x>=7&&x<=8&&y>=3&&y<=4)return 1;if(x>=7&&x<=8&&(y===1||y===2||y===5))return 1;if((y===3||y===4)&&((x>=4&&x<=6)||(x>=9&&x<=11)))return 1;
    if((x===6||x===9)&&(y===2||y===5))return 1;if((x===5||x===10)&&(y===1||y===6))return 1;
    if(y>=8&&y<=13&&x>=6&&x<=9)return y>=10&&y<=11&&x>=7&&x<=8?2:1;if(y===7&&(x===6||x===9))return 1;if(y===14&&x>=5&&x<=10)return 1;return 0;};
  // carved on whitestone: a sunk panel, the sign raised, shadowed below and to the right, the window cut dark
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const fr=x===0||y===0||x===15||y===15,f=SIGN(x,y);let c;
    if(fr)c=sh([214,210,198],(x===0||y===0?10:-18)+(hn(x,y,346)-.5)*6);
    else if(f===2)c=[120,116,108];else if(f===1)c=sh([242,238,228],(hn(x,y,347)-.5)*6);
    else if(SIGN(x-1,y)===1||SIGN(x,y-1)===1)c=[148,144,134];
    else c=sh([184,180,168],(hn(x,y,348)-.5)*8+(x===1||y===1?-16:x===14||y===14?8:0));
    P(272,x,y,c);}
  // the banner: a pole at the left, the black cloth with its silver border, swallow-tailed, the sign in white
  for(let y=0;y<16;y++)P(280,1,y,sh([110,84,52],(hn(1,y,349)-.5)*12));for(let x=1;x<16;x++)P(280,x,0,[150,140,110]);
  for(let y=1;y<16;y++)for(let x=2;x<16;x++){const cut=y>12&&Math.abs(x-8.5)<(y-12)*1.5;if(cut)continue;
    const edge=x===2||x===15||y===1||(y>12&&Math.abs(Math.abs(x-8.5)-(y-12)*1.5)<1)||(y===15),f=SIGN(x-1,y+(y>=8?0:0));
    P(280,x,y,edge?[200,204,212]:f===1?[238,240,244]:f===2?[60,64,80]:sh([24,26,40],(hn(x,y,350)-.5)*8));}
  // flagstones, laid: five stones to a face, each its own tone, in dark joints
  {const FS=[[0,0,6,5],[7,0,15,7],[0,6,6,15],[7,8,10,15],[11,8,15,15]];
    for(let y=0;y<16;y++)for(let x=0;x<16;x++){let k=0;for(;k<FS.length;k++){const q=FS[k];if(x>=q[0]&&x<=q[2]&&y>=q[1]&&y<=q[3])break;}const q=FS[k];
      const joint=x===q[0]||y===q[1],lip=x===q[2]||y===q[3];P(283,x,y,joint?sh([100,98,92],(hn(x,y,341)-.5)*8):sh([176,172,160],(hn(k,0,342)-.5)*24+(hn(x,y,343)-.5)*10+(lip?-10:x===q[0]+1||y===q[1]+1?8:0)));}}
  // The riders of the plains (D-061). Golden thatch: straws combed one way, bound every few rows, its cut ends in rows on the
  // side; turf: grass in tufts with a few flowers over layered sod and roots; wattle: hazel rods woven through stakes, daubed
  // in ochre clay; carved oak: interlaced strands raised on dark oak, rings on its ends; fieldstone: rounded stones in pale lime
  // mortar; the palisade's stakes, sharpened; the riders' banner, a white horse's head on green with a gold border and fringe;
  // crossed horse heads for a gable; a round shield (green with a gold sun and a boss) hung on planks; a long hearth's embers
  // in their stone kerb; a tapestry of green and gold; gilded oak, gold leaf in a lattice on dark wood; a rail fence
  for(const t of [295,296,297,301,304,305])clear(t);
  {const pts=[];for(let k=0;k<9;k++)pts.push([((k%3)*5.3+1.5+hn(k,1,361)*3.5)%16,(Math.floor(k/3)*5.3+1.5+hn(k,2,361)*3.5)%16,hn(k,3,362)]);
   for(let y=0;y<16;y++)for(let x=0;x<16;x++){
    P(287,x,y,sh([224,190,92],(hn(x>>1,y*3+(x&1),363)-.5)*26+(x%3===0?-12:x%3===1?8:0)+(y%5===4?-26:0)+(hn(x>>2,y>>2,364)-.5)*12));
    P(288,x,y,sh([218,184,88],(hn(x,y>>1,365)-.5)*22+(y%5===4?-30:y%5===0?14:0)+(x%2?-8:6)+(hn(x,y,366)-.5)*8));
    const fl=hn(x,y,367);P(289,x,y,fl<.025?[236,214,90]:fl<.04?[236,236,226]:sh([92,146,56],(hn(x,y,368)-.5)*28+((x*7+y*3)%5===0?18:0)));
    // the side of a turf roof: grass grown long and hanging over the sod in strands, mossy and darker toward the foot, a little
    // earth and root showing between the strands at the bottom
    const strand=hn(x,0,369),low=y>=11+Math.floor(strand*4);P(290,x,y,low&&hn(x,y,372)<.35?sh([74,56,38],(hn(x,y,373)-.5)*16):
      sh(low?[62,96,42]:[82,134,52],(strand-.5)*30+(y===0?14:0)+(hn(x,y>>1,370)-.5)*14-y*1.4+((x+Math.floor(y/3))%4===0?-10:0)));
    const stake=x===3||x===8||x===13,rod=((y>>1)+(x>4&&x<12?1:0))%2,dab=fbm2(x/5,y/5,2,374.1)>-0.05;
    P(291,x,y,x===0||y===0||x===15||y===15?sh([88,60,38],(hn(x,y,375)-.5)*10):dab?sh([204,178,128],(hn(x,y,376)-.5)*18+(hn(x>>1,y>>1,377)<.15?-14:0)):stake?sh([96,66,40],(hn(x,y,378)-.5)*10):sh([138,100,60],(rod?12:-14)+(y%2?-10:6)+(hn(x,y,379)-.5)*10));
    const r=Math.hypot(x-7.5,y-7.5);P(292,x,y,sh([110,74,44],(Math.floor(r)%2?-14:6)+(r>7?-24:0)+(hn(x,y,380)-.5)*8));
    const s1=Math.abs(x-7.5-Math.sin(y*0.8)*4)<1.3,s2=Math.abs(x-7.5+Math.sin(y*0.8)*4)<1.3,band=x<=1||x>=14;
    P(293,x,y,band?sh([86,56,34],(x===0||x===15?-16:6)+(hn(x,y,381)-.5)*8):s1||s2?sh([150,104,62],(s1&&s2?12:0)+(hn(x,y,382)-.5)*10):sh([70,46,28],(hn(x,y,383)-.5)*10));
    let d1=99,d2=99,id=0;for(let k=0;k<pts.length;k++)for(const ox of [-16,0,16])for(const oy of [-16,0,16]){const d=Math.hypot(x-pts[k][0]-ox,y-pts[k][1]-oy);if(d<d1){d2=d1;d1=d;id=k;}else if(d<d2)d2=d;}
    P(294,x,y,d2-d1<1.1?sh([182,174,156],(hn(x,y,384)-.5)*10):sh([[138,132,122],[150,138,118],[122,120,116],[160,150,130]][Math.floor(pts[id][2]*4)],(d1<2.2?14:0)-(d1>3.5?12:0)+(hn(x,y,385)-.5)*12));
    const fire=hn(x,y,386),rim=x<=1||y<=1||x>=14||y>=14;P(299,x,y,rim?sh([150,140,124],(hn(x>>1,y>>1,387)-.5)*24):fire<.3?[255,190,80]:fire<.55?[236,110,40]:fire<.7?[140,40,20]:(x+y)%5===0?[60,40,30]:[200,80,30]);
    P(300,x,y,y<2?sh([120,60,30],(hn(x,y,388)-.5)*20):sh([146,138,124],(d2-d1<1.1?20:0)+(hn(x,y,389)-.5)*16));
    const lat=(x+y)%6===0||(x-y+18)%6===0;P(302,x,y,lat?sh([228,188,82],(hn(x,y,390)-.5)*20+((x+y)%6===0?10:0)):sh([74,48,30],(hn(x,y,391)-.5)*10+(x<1||x>14?-10:0)));
    P(303,x,y,Math.hypot(x-7.5,y-7.5)>6.5?sh([228,188,82],(hn(x,y,392)-.5)*16):sh([86,58,36],(Math.floor(Math.hypot(x-7.5,y-7.5))%2?-12:4)));
    const sr=Math.hypot(x-7.5,y-7.5),ang=Math.atan2(y-7.5,x-7.5),ray=Math.abs(Math.sin(ang*4))>0.8;
    P(298,x,y,sr>7?sh([150,108,62],(y%4===3?-22:0)+(hn(x,y>>2,393)-.5)*12):sr>6.2?sh([196,160,70],(hn(x,y,394)-.5)*12):sr<1.6?sh([160,164,170],sr<0.8?30:0):sr<4.5&&ray?sh([220,180,74],(hn(x,y,395)-.5)*10):sh([40,96,52],(hn(x,y,396)-.5)*12+(x<y?6:0)));
  }}
  // the palisade's stakes: three to a block, pointed
  for(const [cx,top] of [[2.5,1],[7.5,3],[12.5,0]])for(let y=top;y<16;y++){const w=Math.min(2.2,(y-top)*0.7+0.4);for(let x=0;x<16;x++)if(Math.abs(x-cx)<=w)P(295,x,y,y<top+3?sh([170,130,84],(x<cx?14:-8)):sh([96,68,42],(x<cx?10:-10)+(hn(x,y,397)-.5)*14+(y%5===0?-12:0)));}
  // the riders' banner: a pole, the green cloth in a gold border, a white horse's head, a fringe of gold
  {const HEAD=['......11......','.....1111.....','....111111....','...11111111...','..1111111111..','..111.111111..','.111111111111.','1111..1111111.','11....111111..','......111111..','......1111111.','.....111111111'];
   for(let y=0;y<16;y++)P(296,1,y,sh([110,84,52],(hn(1,y,398)-.5)*12));for(let x=1;x<16;x++)P(296,x,0,[160,140,100]);
   for(let y=1;y<16;y++)for(let x=2;x<16;x++){const fringe=y===15&&x%2===0;if(y===15&&!fringe)continue;const border=x===2||x===15||y===1||y===14;
     const hy=y-2,hx=x-2,hd=hy>=0&&hy<HEAD.length&&hx>=0&&hx<14&&HEAD[hy][hx]==='1';
     P(296,x,y,fringe?[220,180,70]:border?sh([214,176,72],(hn(x,y,399)-.5)*10):hd?sh([238,238,232],(hn(x,y,400)-.5)*8):sh([36,96,52],(hn(x,y,401)-.5)*10));}}
  // crossed horse heads at a gable's peak: two boards crossing, each ending in a carved head turned outward, a gold eye
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const b1=Math.abs((x-2)-(15-y))<=1.1&&y>=5,b2=Math.abs((13-x)-(15-y))<=1.1&&y>=5;
    const hL=Math.hypot(x-3.2,y-3.6)<2.4||(x>=0&&x<=2&&y>=4&&y<=5),hR=Math.hypot(x-12.3,y-3.6)<2.4||(x>=13&&x<=15&&y>=4&&y<=5);
    if(b1||b2||hL||hR)P(297,x,y,(x===2&&y===3)||(x===13&&y===3)?[230,190,80]:sh([90,60,36],(b1&&b2?14:0)+(hn(x,y,402)-.5)*14+((x+y)%4===0?-10:0)));}
  // a tapestry on its rod: green, a gold border of interlace, a gold knot in the middle, tassels
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){if(y===0){P(301,x,y,[120,90,56]);continue;}if(x<2||x>13)continue;if(y===15&&x%3!==0)continue;
    const brd=x===2||x===13||y===1||y===14,knot=Math.abs(Math.hypot(x-7.5,y-8)-3)<0.8||Math.abs(x-7.5)<0.6&&Math.abs(y-8)<4||Math.abs(y-8)<0.6&&Math.abs(x-7.5)<4;
    P(301,x,y,y===15?[214,176,72]:brd?sh([214,176,72],((x+y)%2?12:-8)):knot?sh([222,184,78],(hn(x,y,403)-.5)*10):sh([30,84,48],(hn(x,y,404)-.5)*10+(x%4===0?-6:0)));}
  // a rail fence: posts at the sides, two rails, open between
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const post=x<=1||x>=14,rail=(y>=3&&y<=5)||(y>=10&&y<=12);if(post||rail)P(304,x,y,sh([124,90,56],(post?(x===0||x===15?-14:4):(y===3||y===10?12:y===5||y===12?-14:0))+(hn(x,y,405)-.5)*12));
    if(x<=1&&y<=1||x>=14&&y>=14||x<=1&&y>=14||x>=14&&y<=1||(y>=7&&y<=8))P(305,x,y,sh([124,90,56],(hn(x,y,406)-.5)*12));}
  // obsidian (D-059): repainted here, with hashes only, so the shared stream that painted it first is unchanged
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const st=(x+y+Math.floor(hn(0,y>>2,305)*5))%9,cc=Math.hypot(x-4-hn(1,0,306)*8,y-4-hn(2,0,306)*8);
    P(47,x,y,st===0?sh([132,110,184],(hn(x,y,307)-.5)*16):st===1?sh([84,66,124],(hn(x,y,308)-.5)*10):hn(x,y,309)<.07?[104,78,156]:sh([42,32,62],(hn(x,y,310)-.5)*12+(Math.abs(cc-3.5)<0.7||Math.abs(cc-6.5)<0.7?14:0)));}
  actx.putImageData(im,0,0);
})();
// Average tile colors for particles
const TAVG=[];
for(let t=0;t<AC*AR;t++){let r=0,g=0,b=0,n=0;for(let y=0;y<16;y++)for(let x=0;x<16;x++){const i=((((t/AC)|0)*16+y)*AW+(t%AC)*16+x)*4;if(dat[i+3]>100){r+=dat[i];g+=dat[i+1];b+=dat[i+2];n++;}}n=n||1;TAVG[t]=[r/n/255,g/n/255,b/n/255];}

