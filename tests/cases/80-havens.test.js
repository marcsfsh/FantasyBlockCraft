// The havens of the elves (D-088): where a province of the high elves meets the sea, a haven: its gate toward the land and the
// elven way to it from the city, terraces down to a quay at the water's edge, the harbour before it dredged deep, piers out
// into it with white ships moored at them (hulls of shipwood standing out of the water, sails, a swan's neck at the bow), a
// mole along one side with the lighthouse at its end, its great lamp a star of starglass; folk on the quay.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const B=(X,Y,Z)=>get(X-OX,Y,Z-OZ);
const hv=[],seen=new Set();let coast=0;
for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='elf')continue;
  const L=LANDS[cellLand(c)].k;if(L==='fjord'||L==='chalk')coast++;const P=provinceOf(c.i,c.j);for(const s of P.sites)if(s.k==='haven')hv.push(s);}
info('havens',hv.length,'in',coast,'coastal stretches of the high elves:',hv.map(s=>s.name+' ('+siteLayout(s).ships+' ships)').join(', '));
assert(hv.length>=3&&hv.every(s=>!isBlockedName(s.name.replace(/ Haven$/,''))),'the high elves have havens where their lands meet the sea, named');
assert(hv.every(s=>s.prov.roads.some(r=>r.k==='high'&&[r.a,r.b].some(p=>Math.hypot(p[0]-sitePort(s)[0],p[1]-sitePort(s)[1])<2))),'the elven way runs to every haven');
const s=hv.find(q=>siteLayout(q).ships>=2)||hv[0],L=siteLayout(s),hw=L.hw,q=L.qL,at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const [QX,QZ]=at(q,0);gen(QX,QZ);
// the quay along the water
{let n=0,ok=0,face=0;for(let v=-hw;v<=hw;v++){const [X,Z]=at(q-3,v);n++;const id=B(X,SEA+2,Z);if(id===EVSTONE||id===EVMOSAIC)ok++;const [x2,z2]=at(q+1,v);if(B(x2,SEA+2,z2)===EVCARVE&&B(x2,SEA-2,z2)===EVBRICK)face++;}
  info(s.name,': the quay',ok,'of',n,'paved at the water\'s height; its face of courses',face);assert(ok>=n*0.9&&face>=n*0.9,'a quay paved in elvenstone runs along the water, its face a wall of courses');}
// the harbour, dredged deep enough for ships
{let n=0,deep=0;for(let v=-hw+2;v<=hw-2;v++)for(const u of [q+3,q+8]){const [X,Z]=at(u,v);n++;let w=0;for(let y=SEA-4;y<=SEA;y++)if(B(X,y,Z)===WATER||B(X,y,Z)===EHULL||B(X,y,Z)===EVPILLAR||B(X,y,Z)===EVBRICK)w++;if(w===5)deep++;}
  info('the harbour: deep water (or hull and pier) five down at',deep,'of',n);assert(deep>=n*0.85,'the harbour before the quay is dredged deep');}
// the ships
{const ships=L.parts.filter(p=>p.k==='eship');for(const p of ships){let hull=0,sail=0,dry=0;for(let u=p.u0;u<=p.u1;u++)for(let v=p.v0;v<=p.v1;v++){const [X,Z]=at(u,v);for(let y=SEA-3;y<=SEA+22;y++){const id=B(X,y,Z);if(id===EHULL){hull++;if(y>SEA)dry++;}if(id===ESAIL)sail++;}}
    const [bx,bz]=at(p.u0+p.L+2,p.cv),beak=B(bx,SEA+10,bz),[mx,mz]=at(p.u0+p.mt,p.cv);
    info('a ship',p.L,'long: shipwood',hull,'(above the water',dry+')',' sail',sail,'; the beak of its swan\'s neck',BL[beak].n,'; its mast',BL[B(mx,SEA+12,mz)].n,'banner',BL[B(mx,SEA+20,mz)].n);
    assert(hull>=120&&dry>=40&&sail>=60&&beak===EVGOLD&&B(mx,SEA+20,mz)===EVBANNER,'a white ship of the elves lies at the pier, its hull out of the water, sail set, a swan at its bow');}
  assert(ships.length>=1,'ships lie in the haven');}
// the mole and the lighthouse with its great lamp
{const [lu,lv]=L.light,[LX,LZ]=at(lu,lv);let star=0,top=0;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let y=SEA;y<=SEA+50;y++){const id=B(LX+dx,y,LZ+dz);if(id===STARLAMP){star++;top=Math.max(top,y);}}
  const mole=L.parts.find(p=>p.k==='emole');let mb=0;for(let u=mole.u0;u<=mole.u1;u++){const [X,Z]=at(u,mole.cv);if(B(X,SEA+2,Z)===EVSTONE&&B(X,SEA-1,Z)===EVBRICK)mb++;}
  info('the lighthouse at',LX,LZ,': starglass in its lamp',star,'up to',top-SEA,'over the sea; the mole',mb,'of',mole.u1-mole.u0+1);
  assert(star>=9&&top>SEA+30&&mb>=(mole.u1-mole.u0+1)*0.9,'a mole runs along the harbour to the lighthouse, its great lamp of starglass high over the sea');}
// its name, and folk on the quay
{const rp=realmPlace(QX-Math.round(at(q,0)[0]-QX),QZ),[X,Z]=at(q-3,0),p2=realmPlace(X,Z);info('at the quay:',p2&&p2.name,'-',p2&&p2.line);assert(p2&&p2.name===s.name&&/^a haven of/.test(p2.line),'the haven has its name');
  PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=SEA+3;for(const f of [...foes])removeFoe(f);foeSpots.clear();foeSpawnTick();const F=foes.filter(f=>!f.dead&&f.spk==='e_quay');
  info('on the quay:',F.map(f=>FOES[f.kind].n).join(', '));assert(F.length>=2,'folk of the elves walk the quay');for(const f of [...foes])removeFoe(f);foeSpots.clear();}
