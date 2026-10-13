// @area 1
// The hidden way (D-085): beside the pass of every gate the hosts have cut a secret passage through the ring of ash mountains,
// from beside the end of the siege lines to the back of the orcs' yard. It runs three wide and three high at the gate's height,
// covered by rock all the way, walled and floored sound, timbered and lamplit, with a chamber halfway; its outer mouth behind a
// screen of boulders and a hide flap, its inner behind rubble in the yard's wall; it has a name, found by walking in. A company
// of the hosts' best sets out from the Leaguer, goes through it unseen (looking for no foe) and comes out in the yard; some wait
// their turn in its chamber.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=9;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
// every gate has one
{const bs=new Map();for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const c=landSite(i,j);if(LANDS[cellLand(c)].k!=='volcanic')continue;const B=wasteBasin(c);bs.set(B.key,B);}
  let n=0;const has=[];for(const B of bs.values()){const P=wasteGateOf(B);if(!P)continue;n++;wgSite(P);if(P.hid&&!isBlockedName(P.hid.n.replace('The Hidden Way of ','')))has.push(P.hid.n+' ('+(P.hid.uo-P.hid.ut+Math.abs(P.hid.vA-P.hid.vY))+' long)');}
  info('gates',n,'; hidden ways',has.length+':',has.join(', '));assert(n>=6&&has.length===n,'beside every gate the hosts have their hidden way through the ring, named');}
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),H=P.hid,g=P.hG,sd=H.sd,at=(u,v)=>siteXZ(s,u,v).map(Math.round),B=(u,v,y)=>{const [X,Z]=at(u,v);return get(X-OX,y,Z-OZ);};
const [X0,Z0]=at(30,H.vA);gen(X0,Z0);const toPL=(u,v,y)=>{const [x,z]=at(u,v);PL.x=x-OX+0.5;PL.z=z-OZ+0.5;PL.y=y;};toPL(60,H.vA,g+1);
playing=false;warClk=1e9;for(const f of [...foes])removeFoe(f);foeSpots.clear();warS.clear();WARS.clear();warPlay=0;warStateTick();
// its build: open along its line, covered, walled, floored; timbered and lit; the chamber; the mouths screened
{let n=0,open=0,cov=0,walls=0,wn=0,lamps=0,props=0,wet=0;const cells=[];
  for(let u=H.ut;u<=H.uo;u++)cells.push([u,H.vA]);for(let v=H.vA;sd*v>=WG_WY+3;v-=sd)cells.push([H.ut,v]);
  for(const [u,v] of cells){n++;let ok=true;for(let y=g+1;y<=g+3;y++)if(B(u,v,y)!==AIR&&B(u,v,y)!==HIDE)ok=false;if(ok)open++;if(SOLID[B(u,v,g)]&&SOLID[B(u,v,g+4)]||Math.abs(u-H.um)<=3)cov++;
    const along=v===H.vA&&u!==H.ut;for(const e of [-2,2]){const [a,b]=along?[u,v+sd*e]:[u+e,v];if(Math.abs(a-H.um)<=4&&Math.abs(b-H.vA)<=4)continue;for(let y=g+1;y<=g+3;y++){wn++;const id=B(a,b,y);if(SOLID[id]||id===DLAMP)walls++;if(id===DLAMP&&y===g+2)lamps++;if(id===DPROP)props++;}}
    for(const [a,b] of [[u,v],[u+1,v],[u-1,v],[u,v+1],[u,v-1]])for(let y=g;y<=g+4;y++){const id=B(a,b,y);if(isWetId(id)||id===LAVA)wet++;}}
  const cc={};for(let a=-3;a<=3;a++)for(let c=-3;c<=3;c++){const id=B(H.um+a,H.vA+c,g+1);if(id!==AIR)cc[BL[id].n]=(cc[BL[id].n]||0)+1;}
  const flapO=[-1,0,1].every(c=>B(H.uo,H.vA+c,g+3)===HIDE),flapI=[-1,0,1].every(d=>B(H.ut+d,sd*(WG_WY+2),g+3)===HIDE);let scr=0;for(let u=H.m+1;u<=H.m+3;u++)for(let c=0;c<=5;c++)if(SOLID[B(u,H.vA+sd*c,g+1)])scr++;
  let rub=0;for(const d of [-4,-3,-2,2,3,4])for(let v=WG_WY-3;v<=WG_WY;v++)if(SOLID[B(H.ut+d,sd*v,g+1)])rub++;
  info(H.n,': its line',n,'long; open',open,'; covered',cov,'; walls',walls,'of',wn,'; lamps',lamps,'; props',props/3,'; water or lava by it',wet,'; the chamber',JSON.stringify(cc),'; flaps',flapO,flapI,'; screen',scr,'; rubble',rub);
  assert(n>=100&&open>=n*0.97&&cov>=n*0.97&&walls>=wn*0.97&&wet===0,'the hidden way runs open through the rock, covered, walled and floored sound all the way');
  assert(lamps>=4&&props>=n/7&&cc['Supply Crate']&&cc['Barrel']&&cc['Hay Bale'],'it is timbered and lamplit, with a chamber of stores and bedding halfway');
  assert(flapO&&flapI&&scr>=10&&rub>=8,'its mouths are hidden: a hide flap over each, a tumble of boulders before the outer, rubble about the inner in the yard');}
// its name, and finding it
{toPL(H.um+10,H.vA,g+1);const nm=wasteGateName(...at(H.um+10,H.vA));JN.d.s=JN.d.s.filter(x=>x!==H.n);hidT=99;hidTick();const found=JN.d.s.includes(H.n);
  info('its name',nm,'; found by walking in',found);assert(nm===H.n&&found,'it has its name, and walking into it finds it');}
// some wait their turn in its chamber, sitting
{toPL(H.um+12,H.vA,g+1);foeSpots.clear();foeSpawnTick();const L=foes.filter(f=>!f.dead&&f.spk==='x_hid');run(3);const sit=L.filter(f=>f.camp&&f.camp.k==='sit').length;
  info('in the chamber:',L.map(f=>FOES[f.kind].n).join(', '),'; sitting',sit);assert(L.length>=2&&sit===L.length,'some of the hosts\' best wait their turn in its chamber');for(const f of [...foes])removeFoe(f);foeSpots.clear();}
// a company goes through it unseen and comes out in the orcs' yard
{toPL(60,H.vA,g+1);const G=hidSend(P);const kinds=G?G.map(f=>f.kind):[];const o=(()=>{const [x,z]=at(H.um-6,H.vA-sd*12);return addFoe('raider',x-OX+0.5,g+1,z-OZ+0.5,{st:'idle',t:99,hold:1});})();
  let looked=0,inT=0,out=0,maxIn=0;const seen=f=>{const [u,v]=wgUV(P,f.x+OX,f.z+OZ);return [u,v];};
  for(let k=0;k<16&&G;k++){if(k===6){toPL(H.ut+20,sd*30,g+1);removeFoe(o);}run(10,()=>{for(const f of G){if(f.sneak&&f.foe)looked++;}});
    for(const f of G){const [u,v]=seen(f);if(f.sneak&&wgLineD(H.line,u,v)<=2)inT++;if(!f.sneak&&!f.gone&&u<0&&Math.abs(v)<WG_WY&&u>P.uY)out++;}if(G.every(f=>f.gone||f.dead||!f.sneak))maxIn=Math.max(maxIn,1);}
  const left=G?G.filter(f=>!f.gone&&!f.dead):[];info('the company:',kinds.join(','),'; seen in the passage',inT,'times; looked for a foe while hidden',looked,'; out in the yard',left.filter(f=>{const [u,v]=seen(f);return !f.sneak&&u<0&&u>P.uY&&Math.abs(v)<WG_WY;}).length,'of',left.length);
  assert(G&&G.length>=4&&kinds.every(k=>['eblade','wlong','wbow','rguard'].includes(k))&&inT>0&&looked===0&&out>0&&left.every(f=>!f.sneak),'a company of the hosts\' best goes through it unseen and comes out in the orcs\' yard');}
for(const f of [...foes])removeFoe(f);
