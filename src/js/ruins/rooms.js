// ---- More single-chunk rooms
function statueP(X,Y,Z,head){PW(X,Y,Z,DWBRICK,MODE_SET);PW(X,Y+1,Z,CALCITE,MODE_SET);PW(X,Y+2,Z,CALCITE,MODE_SET);PW(X,Y+3,Z,head||GOLDB,MODE_SET);}
function brazierP(X,Y,Z){PW(X,Y,Z,DWPILLAR,MODE_SET);PW(X,Y+1,Z,GLOW,MODE_SET);}
function dwRoom2(t,cx,cz,yb,r){
  const h=curH||ROOM_HALF[t],hh=curHH||ROOM_H[t],notDoor=(dx,dz)=>Math.abs(dx)>2&&Math.abs(dz)>2;
  switch(t){
    case 'quarters':{dwShell(cx,cz,h,yb,hh,r);
      for(const side of [-1,1])for(let b=-4;b<=4;b+=2){if(!b)continue;const X=cx+b,Z=cz+side*(h-1),col=pick([WOOLR,WOOLB,WOOLG,WOOLY,WOOLW],r);
        PW(X,yb,Z,PLANKS,MODE_SET);PW(X,yb,Z-side,col,MODE_SET);if(r()<0.25)PW(X,yb,Z-side*2,DWCHEST,MODE_SET);else if(r()<0.4)PW(X,yb,Z-side*2,BARREL,MODE_SET);}
      for(const a of [-h+1,h-1]){PW(cx+a,yb,cz,PLANKS,MODE_SET);PW(cx+a,yb+1,cz,PLANKS,MODE_SET);}
      PW(cx,yb+hh-1,cz,LANTERN,MODE_SET);break;}
    case 'office':{dwShell(cx,cz,h,yb,hh,r);
      PW(cx,yb,cz,LECTERN,MODE_SET);for(const [a,b] of [[-2,-2],[2,-2],[-2,2],[2,2]]){PW(cx+a,yb,cz+b,PLANKS,MODE_SET);PW(cx+a+1,yb,cz+b,PLANKS,MODE_SET);PW(cx+a,yb,cz+b+1,BARREL,MODE_SET);}
      ringCells(h,(dx,dz)=>{if(notDoor(dx,dz)&&dz===-h+1)for(let y=yb;y<yb+3;y++)PW(cx+dx,y,cz+dz,BOOKS,MODE_SET);});
      PW(cx+h-1,yb,cz+h-1,DWCHEST,MODE_SET);PW(cx,yb+hh-1,cz,RUNE,MODE_SET);PW(cx-3,yb+hh-1,cz+3,LANTERN,MODE_SET);break;}
    case 'tavern':{dwShell(cx,cz,h,yb,hh,r);
      for(const b of [-3,3])for(let a=-4;a<=4;a++){PW(cx+a,yb,cz+b,PLANKS,MODE_SET);if(a%2===0){PW(cx+a,yb,cz+b-1,BARREL,MODE_SET);PW(cx+a,yb,cz+b+1,BARREL,MODE_SET);}}
      for(let a=-5;a<=5;a++)if(Math.abs(a)>2){PW(cx+a,yb,cz-6,BARREL,MODE_SET);PW(cx+a,yb+1,cz-6,BARREL,MODE_SET);}
      PW(cx+6,yb,cz,FURN,MODE_SET);for(let y=yb+1;y<yb+hh;y++)PW(cx+6,y,cz,DWBRICK,MODE_SET);break;}
    case 'bath':{dwShell(cx,cz,h,yb,hh,r,(dx,dz)=>Math.max(Math.abs(dx),Math.abs(dz))<=3?WATER:CALCITE);
      for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)PW(cx+dx,yb-2,cz+dz,CALCITE,MODE_SET);
      for(const a of [-4,4]){PW(cx+a,yb+hh-1,cz,LANTERN,MODE_SET);PW(cx,yb+hh-1,cz+a,RUNE,MODE_SET);}
      for(const b of [-h+1,h-1])for(let a=-3;a<=3;a++)if(Math.abs(a)>1)PW(cx+a,yb,cz+b,CALCITE,MODE_SET);break;}
    case 'games':{dwShell(cx,cz,h,yb,hh,r,(dx,dz)=>Math.max(Math.abs(dx),Math.abs(dz))<=4?((dx+dz)&1?CALCITE:DWTILE):DWTILE);
      for(let dx=-4;dx<=4;dx+=2){PW(cx+dx,yb,cz-4,CALCITE,MODE_SET);PW(cx+dx,yb,cz+4,BRASB,MODE_SET);}
      for(const dx of [-4,4]){PW(cx+dx,yb+1,cz-4,CALCITE,MODE_SET);PW(cx+dx,yb+1,cz+4,BRASB,MODE_SET);}
      PW(cx,yb+1,cz-4,GOLDB,MODE_SET);PW(cx,yb+1,cz+4,GOLDB,MODE_SET);
      PW(cx+6,yb,cz+6,BARREL,MODE_SET);PW(cx-6,yb,cz+6,DWCHEST,MODE_SET);break;}
    case 'arena':{dwShell(cx,cz,h,yb,hh,r);
      for(let dx=-h+1;dx<=h-1;dx++)for(let dz=-h+1;dz<=h-1;dz++){const ring=Math.max(Math.abs(dx),Math.abs(dz));
        if(ring<=3){PW(cx+dx,yb-1,cz+dz,AIR,MODE_SET);PW(cx+dx,yb-2,cz+dz,AIR,MODE_SET);PW(cx+dx,yb-3,cz+dz,SAND,MODE_SET);PW(cx+dx,yb-4,cz+dz,DWBRICK,MODE_SET);}
        else if(ring===5)PW(cx+dx,yb,cz+dz,DWTILE,MODE_SET);}
      for(const [a,b] of [[-4,-4],[4,-4],[-4,4],[4,4]])brazierP(cx+a,yb,cz+b);PW(cx,yb-2,cz-3,STEELB,MODE_SET);PW(cx+1,yb-2,cz+3,STEELB,MODE_SET);
      PW(cx+h-1,yb,cz,DWCHEST,MODE_SET);break;}
    case 'shrine':{dwShell(cx,cz,h,yb,hh,r,(dx,dz)=>Math.abs(Math.hypot(dx,dz)-3)<0.6?RUNE:DWTILE);
      PW(cx,yb,cz-h+1,GOLDB,MODE_SET);PW(cx,yb+1,cz-h+1,AMETH,MODE_SET);PW(cx,yb+2,cz-h+1,CRYSTAL,MODE_SET);
      statueP(cx-3,yb,cz-h+1,CALCITE);statueP(cx+3,yb,cz-h+1,CALCITE);
      for(let b=0;b<=3;b+=2)for(const a of [-3,-2,2,3])PW(cx+a,yb,cz+b,PLANKS,MODE_SET);
      brazierP(cx-2,yb,cz-2);brazierP(cx+2,yb,cz-2);PW(cx,yb,cz-2,LECTERN,MODE_SET);if(r()<0.6)PW(cx+1,yb,cz-h+1,DWCHEST,MODE_SET);break;}
    case 'cistern':{dwShell(cx,cz,h,yb,hh,r,(dx,dz)=>Math.max(Math.abs(dx),Math.abs(dz))<=4?WATER:DWTILE,true);
      for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){for(let y=yb-4;y<yb-1;y++)PW(cx+dx,y,cz+dz,WATER,MODE_SET);PW(cx+dx,yb-5,cz+dz,DWBRICK,MODE_SET);}
      for(const a of [-3,0,3])for(const b of [-3,0,3]){if(!a&&!b)continue;for(let y=yb-5;y<yb+hh;y++)PW(cx+a,y,cz+b,y===yb+hh-3?BRASB:DWPILLAR,MODE_SET);}
      for(const a of [-3,3])PW(cx+a,yb+hh-4,cz,LANTERN,MODE_SET);break;}
    case 'kitchen':{dwShell(cx,cz,h,yb,hh,r);
      for(const a of [-4,-2,2,4]){PW(cx+a,yb,cz-6,FURN,MODE_SET);for(let y=yb+1;y<yb+hh;y++)PW(cx+a,y,cz-6,DWBRICK,MODE_SET);PW(cx+a,yb+2,cz-5,DWBRICK,MODE_SET);}
      for(let a=-3;a<=3;a++)PW(cx+a,yb,cz,PLANKS,MODE_SET);
      for(let b=-4;b<=4;b+=2)PW(cx+6,yb,cz+b,BARREL,MODE_SET);
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)PW(cx-5+a,yb,cz+4+b,(a||b)?STEELB:WATER,MODE_SET);
      PW(cx+6,yb,cz+5,DWCHEST,MODE_SET);break;}
    case 'armory':{dwShell(cx,cz,h,yb,hh,r);
      ringCells(h,(dx,dz)=>{if(Math.abs(dx)>2&&Math.abs(dz)>2||(Math.abs(dx)===h-1&&Math.abs(dz)>2)||(Math.abs(dz)===h-1&&Math.abs(dx)>2)){PW(cx+dx,yb,cz+dz,(dx+dz)&1?STEELB:BRASB,MODE_SET);PW(cx+dx,yb+1,cz+dz,(dx+dz)&1?DWPILLAR:STEELB,MODE_SET);}});
      for(const a of [-3,0,3])for(const b of [-2,2]){PW(cx+a,yb,cz+b,STEELB,MODE_SET);PW(cx+a,yb+1,cz+b,STEELB,MODE_SET);PW(cx+a,yb+2,cz+b,b<0?BRASB:COPB,MODE_SET);}
      PW(cx-5,yb,cz,DWCHEST,MODE_SET);PW(cx+5,yb,cz,DWCHEST,MODE_SET);break;}
    case 'statuary':{dwShell(cx,cz,h,yb,hh,r,(dx,dz)=>Math.abs(dx)<=1?(dz%2?RUNE:DWTILE):CALCITE);
      for(const a of [-4,4])for(const b of [-4,0,4]){statueP(cx+a,yb,cz+b,b===0?GOLDB:CALCITE);PW(cx+a+(a<0?1:-1),yb,cz+b,DWBRICK,MODE_SET);}
      for(const b of [-6,6])brazierP(cx,yb,cz+b);break;}
    case 'minehall':{postFns.push(()=>{for(let b=-6;b<=6;b++)if(GW(cx-4,yb,cz+b)===AIR)PW(cx-4,yb,cz+b,RAILZ,MODE_SET);});dwShell(cx,cz,h,yb,hh,r,(dx,dz)=>Math.max(Math.abs(dx),Math.abs(dz))<=2?DWBRICK:DWTILE);
      for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const e=Math.max(Math.abs(dx),Math.abs(dz))===2;for(let y=yb-12;y<yb;y++)PW(cx+dx,y,cz+dz,e?DWBRICK:AIR,MODE_SET);if(e)PW(cx+dx,yb,cz+dz,(dx+dz)%2?STEELB:DWPILLAR,MODE_SET);}
      for(let y=yb-11;y<yb;y++){const k=(y-yb+11)%8,ring=[[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]][k];PW(cx+ring[0],y-1,cz+ring[1],DWTILE,MODE_SET);}
      for(let y=yb+1;y<yb+hh;y++){PW(cx-2,y,cz-2,STEELB,MODE_SET);PW(cx+2,y,cz+2,STEELB,MODE_SET);}
      for(let dx=-2;dx<=2;dx++)PW(cx+dx,yb+hh-2,cz,STEELB,MODE_SET);PW(cx,yb+hh-3,cz,LANTERN,MODE_SET);
      const ores=yb<30?[IRON,GOLD,PLATO,COAL]:[COAL,COPO,TINO,IRON];
      ores.forEach((o,i)=>{const b=-5+i*3;for(let dx=5;dx<=6;dx++){PW(cx+dx,yb,cz+b,o,MODE_SET);PW(cx+dx,yb,cz+b+1,o,MODE_SET);}});
      for(let b=-5;b<=5;b+=2)PW(cx-6,yb,cz+b,BARREL,MODE_SET);PW(cx-6,yb,cz+6,DWCHEST,MODE_SET);break;}
  }
}
