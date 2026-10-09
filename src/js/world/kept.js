// ---- The old kept lands get their own landmarks and features (M6h, D-046; Q121): the Green Hills, the Elder Wood, the Heath
// Moors, the Barrow Hills and the Shadowed Forest, the five lands that had none since M6a.
Object.assign(SIGS,{
  green:[['hillfort','Earthwork Hill Fort',12],['loneoak','The Lone Oak',8]],
  elder:[['wshrine','Woodland Shrine',6],['hollowelder','Hollow Elder',7]],
  moors:[['watchcairn','Watch Cairn',6],['tors','Granite Tors',10]],
  barrow:[['greatbarrow','Great Chambered Barrow',12],['stonerows','Rows of Standing Stones',13]],
  shadow:[['sunktemple','Temple Sunk in the Roots',10],['fallen','The Fallen Giant',12]]
});
// raise the ground to y over a column (earth below, grass on top), then clear above it
function keptMound(x,z,y,top){for(let yy=y-1;yy>y-10;yy--){const c=GW(x,yy,z);if(c>0&&SOLID[c]&&!BL[c].leaf)break;PW(x,yy,z,DIRT,MODE_SET);}PW(x,y,z,top||GRASS,MODE_SET);for(let k=1;k<=4;k++)PW(x,y+k,z,AIR,MODE_SET);}
function keptBuild(s,r){
  const X=s.X,Z=s.Z,g=s.g,face=Math.floor(s.seed*4),fx=[1,0,-1,0][face],fz=[0,1,0,-1][face];
  switch(s.kind){
    case 'hillfort':{ // two rings of earth bank with a ditch between, a gap for the gate, the stones of a hall inside
      for(let dx=-12;dx<=12;dx++)for(let dz=-12;dz<=12;dz++){const d=Math.hypot(dx,dz),gate=(dx*fx+dz*fz)>d*0.93;if(gate)continue;
        if(d>=10.5&&d<12)keptMound(X+dx,Z+dz,g+1);else if(d>=7&&d<9)keptMound(X+dx,Z+dz,g+2);else if(d>=9&&d<10.5){PW(X+dx,g,Z+dz,GRASS,MODE_SET);PW(X+dx,g+1,Z+dz,AIR,MODE_SET);}}
      for(let a=-3;a<=3;a++)for(let b=-2;b<=2;b++)if((Math.abs(a)===3||Math.abs(b)===2)&&r()<0.6)PW(X+a,g+1,Z+b,r()<0.4?MOSSY:COBBLE,MODE_SET);break;}
    case 'loneoak':{ // a knoll with one wide old oak on it
      for(let dx=-7;dx<=7;dx++)for(let dz=-7;dz<=7;dz++){const d=Math.hypot(dx,dz);if(d<7)keptMound(X+dx,Z+dz,g+Math.round(3*(1-d/7)));}
      const b=g+4;for(let y=b;y<b+8;y++)for(let a=0;a<2;a++)for(let c=0;c<2;c++)PW(X+a,y,Z+c,LOG,MODE_SET);
      for(let k=0;k<4;k++){const ax=[1,0,-1,0][k],az=[0,1,0,-1][k];for(let t=1;t<=4;t++)PW(X+(ax>0?1:0)+ax*t,b+5+(t>>1),Z+(az>0?1:0)+az*t,LOG,MODE_SET);}
      for(let dx=-7;dx<=8;dx++)for(let dy=-2;dy<=4;dy++)for(let dz=-7;dz<=8;dz++){const d=Math.hypot(dx-0.5,dy*1.5,dz-0.5);if(d<=7&&!(d>6&&r()<0.4))PW(X+dx,b+9+dy,Z+dz,LEAVES,MODE_AIR);}break;}
    case 'wshrine':{ // a mossy floor, four pillars, a low altar with a cold lantern on it
      sigFloor(X-3,Z-3,X+3,Z+3,g,MOSSY,6);
      for(const [a,b] of [[-3,-3],[3,-3],[-3,3],[3,3]]){const t=2+(r()*3|0);for(let y=g+1;y<=g+t;y++)PW(X+a,y,Z+b,r()<0.5?MOSSY:SBRICK,MODE_SET);}
      PW(X,g+1,Z,SBRICK,MODE_SET);PW(X,g+2,Z,LANTERN,MODE_SET);
      for(let k=0;k<10;k++){const a=X-3+(r()*7|0),b=Z-3+(r()*7|0);if(a!==X||b!==Z)PW(a,g+1,b,r()<0.6?FERN:MUSHB,MODE_AIR);}break;}
    case 'hollowelder':{ // an old elder five blocks thick, hollow inside with a way in, under a broad crown
      const R=2.5;for(let y=g-1;y<=g+9;y++)for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){const d=Math.hypot(dx,dz);if(d>R+0.4)continue;
        const inside=d<R-0.9&&y>=g+1&&y<=g+6;PW(X+dx,y,Z+dz,inside?AIR:y<g+1?DIRT:LOG,MODE_SET);}
      PW(X+fx*2,g+1,Z+fz*2,AIR,MODE_SET);PW(X+fx*2,g+2,Z+fz*2,AIR,MODE_SET);PW(X,g,Z,FMOSS,MODE_SET);PW(X-fz,g+1,Z+fx,MUSHB,MODE_SET);
      for(let dx=-7;dx<=7;dx++)for(let dy=0;dy<=5;dy++)for(let dz=-7;dz<=7;dz++){const d=Math.hypot(dx,(dy-2)*1.6,dz);if(d<=7&&!(d>6.2&&r()<0.4))PW(X+dx,g+9+dy,Z+dz,LEAVES,MODE_AIR);}break;}
    case 'watchcairn':{ // a granite tor with a cairn of stones on top where a watch fire burned
      for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){const d=Math.hypot(dx,dz),t=Math.round(4*(1-d/4.6));for(let y=g+1;y<=g+t;y++)PW(X+dx,y,Z+dz,STONE,MODE_SET);}
      const top=g+4;for(let y=top+1;y<=top+4;y++)for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)if(y<top+3||(!dx&&!dz))PW(X+dx,y,Z+dz,r()<0.4?MOSSY:COBBLE,MODE_SET);
      PW(X,top+5,Z,GRAVEL,MODE_SET);break;}
    case 'tors':{ // stacks of weathered granite slabs standing out of the heather
      for(let k=0;k<4;k++){const a=k*1.7+s.seed*6,d=k?5+r()*3:0,cx=Math.round(X+Math.cos(a)*d),cz=Math.round(Z+Math.sin(a)*d),h=4+(r()*5|0);let w=2;
        for(let y=g+1-1;y<=g+h;y++){if(y>g+1&&r()<0.35)w=Math.max(1,w-1);for(let dx=-w;dx<=w;dx++)for(let dz=-w;dz<=w;dz++)if(Math.abs(dx)+Math.abs(dz)<=w+1)PW(cx+dx,y,cz+dz,STONE,MODE_SET);}}break;}
    case 'greatbarrow':{ // a long mound with a stone-lined passage between two standing stones into a chamber of bones
      const along=(t,c,y,id)=>PW(X+fx*t-fz*c,y,Z+fz*t+fx*c,id,MODE_SET);
      for(let t=-11;t<=11;t++)for(let c=-6;c<=6;c++){const e=Math.hypot(t/11,c/6);if(e<1){const top=g+Math.round(5*Math.sqrt(1-e*e));for(let y=g+1;y<top;y++)along(t,c,y,DIRT);along(t,c,top,GRASS);}}
      for(let t=4;t<=11;t++)for(let c=-1;c<=1;c++)for(let y=g;y<=g+3;y++)along(t,c,y,y===g?SBRICK:Math.abs(c)===1||y===g+3?(r()<0.4?MOSSY:SBRICK):AIR);
      for(let t=-3;t<=3;t++)for(let c=-2;c<=2;c++)for(let y=g;y<=g+4;y++){const wall=Math.abs(t)===3||Math.abs(c)===2||y===g||y===g+4;along(t,c,y,wall?(r()<0.4?MOSSY:SBRICK):AIR);}
      for(let y=g+1;y<=g+2;y++)along(3,0,y,AIR);
      along(-2,0,g+1,GRAVE);along(-2,1,g+1,BONES);along(1,-1,g+1,BONES);along(0,1,g+1,CHEST);
      for(const c of [-2,2])for(let y=g+1;y<=g+4;y++)along(12,c,y,STONE);for(let t=12;t<=13;t++)for(let c=-1;c<=1;c++)for(let y=g+1;y<=g+3;y++)along(t,c,y,AIR);break;}
    case 'stonerows':{ // two long rows of standing stones running across the hill
      for(const c of [-3,3])for(let t=-12;t<=12;t+=3){const h=2+(r()*3|0),x=X+fx*t-fz*c,z=Z+fz*t+fx*c,b=hAt(x,z);if(r()<0.15)continue;
        PW(x,b,z,STONE,MODE_SET);for(let y=b+1;y<=b+h;y++)PW(x,y,z,r()<0.3?MOSSY:STONE,MODE_SET);}break;}
    case 'sunktemple':{ // a temple floor sunk three blocks among the roots, broken pillars, steps down, cobwebs in the corners
      const f=g-3;for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){PW(X+dx,f-1,Z+dz,STONE,MODE_SET);PW(X+dx,f,Z+dz,Math.abs(dx)===6||Math.abs(dz)===6?MOSSY:SBRICK,MODE_SET);
        const wall=Math.abs(dx)===6||Math.abs(dz)===6;for(let y=f+1;y<=g+2;y++)PW(X+dx,y,Z+dz,wall&&y<=g?(r()<0.5?MOSSY:SBRICK):AIR,MODE_SET);}
      for(let t=0;t<=3;t++)for(let c=-1;c<=1;c++){const x=X+fx*(6-t)-fz*c,z=Z+fz*(6-t)+fx*c;for(let y=f+1;y<=g+2;y++)PW(x,y,z,y<=g-t?SBRICK:AIR,MODE_SET);}
      for(const [a,b] of [[-3,-3],[3,-3],[-3,3],[3,3]]){const t=2+(r()*4|0);for(let y=f+1;y<=f+t;y++)PW(X+a,y,Z+b,SBRICK,MODE_SET);}
      for(let k=-6;k<=6;k++)if(r()<0.7)PW(X+k,g+1+(k&1),Z+(k>>1),JLOG,MODE_SET); // a root across the top
      for(const [a,b] of [[-5,-5],[5,-5],[-5,5],[5,5]])PW(X+a,f+3,Z+b,COBWEB,MODE_AIR);PW(X,f+1,Z,SBRICK,MODE_SET);PW(X,f+2,Z,LANTERN,MODE_SET);break;}
    case 'fallen':{ // a giant fallen across a hollow, its roots torn up at one end
      for(let t=-11;t<=11;t++)for(let c=-5;c<=5;c++){const d=Math.abs(c)/5,dep=Math.round(3*(1-d*d)*(1-Math.abs(t)/14));if(dep<1)continue;const x=X+fx*t-fz*c,z=Z+fz*t+fx*c;
        for(let y=g-dep+1;y<=g+1;y++)PW(x,y,z,AIR,MODE_SET);PW(x,g-dep,z,GRASS,MODE_SET);}
      for(let t=-11;t<=9;t++)for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(Math.abs(a)+Math.abs(b)<2||t<-8)PW(X+fx*t-fz*a,g+2+b,Z+fz*t+fx*a,JLOG,MODE_SET);
      for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)if(Math.hypot(a,b)<3.4&&r()<0.75)PW(X+fx*10-fz*a,g+2+b,Z+fz*10+fx*a,r()<0.5?DIRT:JLOG,MODE_SET);
      for(let k=0;k<12;k++){const t=-10+(r()*20|0);PW(X+fx*t,g+4,Z+fz*t,r()<0.5?FMOSS:MUSHB,MODE_AIR);}break;}
  }
}
