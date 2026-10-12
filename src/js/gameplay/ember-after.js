// ---- After an Emberlord's fall (W7c, D-076; Q186, Q187). Its mountain dies: every open lava cell of the great volcano and its
// flows, from under its foot to over its rim, cools (sources to obsidian, the rest to lava crust) as a change of the world kept by
// the fallen lords in the save, made in each chunk as it is generated after the player's edits (`deadMount`), and at once in the
// loaded world by reloading it. The sky over its basin clears (`emberClearK`, read by the land's weather), its servants scatter
// (one place of the wastes in four keeps its creatures, and the war's warhosts, raids and engines stop), and the land slowly heals
// where the player goes (grass and flowers on the ash, more as time passes). It leaves its relics (its horn or its crown, a cloak of
// its wing, its blade, its heart; dropped where it falls to the player, else kept by the lords of the hosts and given in any
// Leaguer), its name and story (the journal), a monument on its crater's rim raised by the three peoples, and now and then deep
// under its basin something stirs in the lava sea. In its war's Leaguer a victory feast is held, the three banners are raised over
// the Ashen Gate, and the heralds sing of it.
const deadKey=v=>'f'+(v.key||v.i+','+v.j),deadVolc=v=>!!v&&!!v.great&&fallenLords.has(deadKey(v));
// in a chunk as it is generated, after the edits: on a dead mountain each open lava cell cools (bottom up, so only the top of a
// pool or a flow; the lava sea far below is untouched)
function deadMount(lcx,lcz,WCX,WCZ){if(!fallenLords.size)return;const X0=WCX*CS+8,Z0=WCZ*CS+8;
  for(const v of volcanoesNear(X0,Z0,460)){if(!deadVolc(v))continue;const S=volcShape(v),R=v.R*1.3+12;if(Math.hypot(X0-S.cx,Z0-S.cz)>R+12)continue;
    const y0=Math.max(1,v.base-30),y1=Math.min(H-2,(v.rimTop||v.base+200)+12);
    for(let z=0;z<CS;z++)for(let x=0;x<CS;x++){if(Math.hypot(WCX*CS+x-S.cx,WCZ*CS+z-S.cz)>R)continue;const lx=lcx*CS+x,lz=lcz*CS+z;
      for(let y=y0;y<=y1;y++){const i=I(lx,y,lz);if(world[i]!==LAVA||world[i+WD]===LAVA)continue;world[i]=lvl[i]?LAVACRUST:OBSID;lvl[i]=0;}}}}
// the basin of a point if its lord has fallen
function deadBasinAt(X,Z){const B=warBasinAt(Math.floor(X),Math.floor(Z));if(B){const G=greatOf(B.chief);return G&&deadVolc(G)?{B:B,G:G,F:fortOf(G),P:wasteGateOf(B)}:null;}
  for(const v of volcanoesNear(X,Z,320))if(deadVolc(v)&&Math.hypot(X-v.X,Z-v.Z)<v.R*1.4){const F=fortOf(v),w=F&&warOfFort(F);return {B:null,G:v,F:F,P:w?warLord(w).P:null};} // (on the mountain itself)
  return null;}
// ---- the relics: dropped to the player who slays it (FOES drops), else owed and given in any Leaguer
const EMBER_RELICS=k=>[k==='ember3'?384:379,385,377,378];
FOES.ember.drops=FOES.ember.drops.concat([[379,1,1,1],[385,1,1,1]]);FOES.ember2.drops=FOES.ember.drops.slice();FOES.ember3.drops=FOES.ember.drops.filter(d=>d[0]!==379).concat([[384,1,1,1]]);
function emberOwe(R){const k=emberKnown.get(R.F.id);if(k){k[3]=1;saveDirty=true;}}
let emberRelicT=0;
function emberRelicUse(id){if(warPlay<emberRelicT){toast('The '+(id===384?'crown':'horn')+' must rest a while');return true;}emberRelicT=warPlay+90;let n=0;
  for(const f of foes)if(!f.dead&&!FOES[f.kind].folk&&!isLord(f)&&Math.hypot(f.x-PL.x,f.z-PL.z)<36){f.foe=null;f.st='flee';f.t=12+Math.random()*4;f.bold=0;n++;}
  warSignal('advance','d',[PL.x,PL.y+2,PL.z]);burst(1.6,'lowpass',90,0.6,0.4,0,[PL.x,PL.y+2,PL.z]);for(let k=0;k<30;k++)spawnP(PL.x,PL.y+1.5,PL.z,(Math.random()-.5)*6,Math.random()*3,(Math.random()-.5)*6,[1,0.5,0.15],0.8,1);
  toast(id===384?'You raise the crown of a fallen lord':'You sound the horn of a fallen lord');if(n)setTimeout(()=>toast('The creatures of the wastes flee before it'),1500);return true;}
// ---- the monument on its crater's rim, toward its gate: a platform of the men's white stone, three pillars (the men's, the elves'
// and the dwarves'), each under its people's banners, and in their midst a block of obsidian crowned with gold
function emberMonumentAt(Db){const S=volcShape(Db.G),dx=Db.P?Db.P.X-S.cx:Db.F.ox,dz=Db.P?Db.P.Z-S.cz:Db.F.oz,dl=Math.hypot(dx,dz)||1;return [Math.round(S.cx+dx/dl*(Db.G.rc+6)),Math.round(S.cz+dz/dl*(Db.G.rc+6))];}
function emberMonumentCells(Db){const [X,Z]=emberMonumentAt(Db),x=X-OX,z=Z-OZ;if(x<4||z<4||x>=W-4||z>=D-4||!genDone[(x>>4)+(z>>4)*NCX])return null;const y0=ground[x+W*z],out=[],put=(a,y,b,id)=>out.push([X+a,y,Z+b,id]);
  for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){put(a,y0,b,WSBRICK);for(let y=y0+1;y<y0+14;y++)put(a,y,b,AIR);}
  for(const [a,b,pil,ban] of [[0,-2,WSPILLAR,RBANNER],[-2,2,EVPILLAR,EVBANNER],[2,2,DWPILLAR,DBANNER]]){for(let y=y0+1;y<y0+9;y++)put(a,y,b,pil);put(a,y0+9,b,ban);put(a,y0+10,b,ban);}
  put(0,y0+1,0,OBSID);put(0,y0+2,0,OBSID);put(0,y0+3,0,GILDED);return out;}
// ---- the three banners over the Ashen Gate, and the feast in the Leaguer
function emberGateBanners(P){const out=[],g=P.hG;for(const [v,id] of [[-3,RBANNER],[0,EVBANNER],[3,DBANNER]]){const [X,Z]=wgXZ(P,0,v);for(let y=g+49;y<g+52;y++)out.push([X,y,Z,FENCE]);for(let y=g+52;y<g+56;y++)out.push([X,y,Z,id]);}return out;}
function emberFeastCells(P){const out=[],s=wgSite(P),g=P.hG;for(const v of [-4,4])for(let u=P.uC0+28;u<=P.uC0+40;u++){const [X,Z]=siteXZ(s,u,v).map(Math.round),x=X-OX,z=Z-OZ;if(x<0||z<0||x>=W||z>=D)continue;const y=ground[x+W*z]+1;out.push([X,y,Z,CTIMBER]);if(u%4===0)out.push([X,y+1,Z,LANTERN]);}return out;}
function emberSong(R){const L=R.L,notes=[392,440,494,523,494,440,392,349,392,440,523,587,523,494,440,392];notes.forEach((f,i)=>setTimeout(()=>tone(f,f,0.45,0.07),i*420));
  const lines=['The heralds sing: "Hear now of the fall of '+L.name+', '+L.n.slice(L.name.length+1)+',"','"who rose from the deep and sat upon the Ember Throne of '+L.mt.replace(/^The /,'the ')+',"',
    '"'+({hosts:'and the hosts of the three peoples cast it down before its gate,',alone:'and one who stood alone in its hall struck it down,',bound:'and the loremasters bound it in chains of light,',cast:'and it fell through the mountain\'s heart into the lava sea,',quenched:'and the dwarves broke the mountain, and its fire went out,'}[R.fate]||'and it fell,')+'"',
    '"Sing it in the halls of the three peoples, and let the mountain sleep."'];lines.forEach((l,i)=>setTimeout(()=>toast(l),1500+i*3200));}
// ---- every second (from warStateTick): the clearing sky, the dead mountain's lava reloaded, the healing land, the stirring below,
// the monument, the banners, the feast and the song, the relics owed
let emberClearK=0,emberReload=0,emberHealN=0,emberStirT=240;
function emberAfterTick(){const X=PL.x+OX,Z=PL.z+OZ;
  if(emberReload>0&&(emberReload-=1)<=0){toast('The fire of the mountain dies, and its lava cools to stone');regenerateAll(X,Z);}
  const Db=fallenLords.size?deadBasinAt(X,Z):null;emberClearK=Db?1:0;
  // the relics the lords of the hosts keep for the player, given in any Leaguer
  const Pg=wasteGateAt(Math.floor(X),Math.floor(Z),300);if(Pg&&SURV()&&wgUV(Pg,X,Z)[0]>Pg.uC0-30)for(const [id,k] of emberKnown){if(!k[3])continue;const F=[...FORT_C.values()].find(F=>F&&F.id===id);if(!F)continue;
    const got=[];for(const r of EMBER_RELICS(emberLord(F).kind)){if(!addItem(r,1))got.push(nameOf(r));}k[3]=0;saveDirty=true;drawBar(true);toast('The lords of the hosts give you the relics of '+k[1]+': '+got.join(', '));}
  // the war won: the feast, the banners over the gate, the song (once each, in the Leaguer or by the gate)
  for(const w of WARS.values()){const E=w.el;if(!E||!E.fate)continue;const R=warLord(w);if(!R)continue;const P=R.P,[u]=wgUV(P,X,Z),d=Math.hypot(X-w.X,Z-w.Z);
    if(!E.ban2&&d<200&&warLoaded(P,-2,2,-4,4)){E.ban2=-1;warJob(emberGateBanners(P),300,ok=>{E.ban2=ok?1:0;if(ok)warLog(w,'The three banners of the peoples were raised over '+P.name.replace(/^The /,'the ')+'.');saveDirty=true;});}
    if(!E.feast&&u>P.uC0-10&&u<P.uC1&&d<450){E.feast=1;saveDirty=true;toast('A victory feast in the Leaguer!');warCheer();const c=emberFeastCells(P);if(c.length)warJob(c,300,()=>{});setTimeout(()=>emberSong(Object.assign({fate:E.fate},R)),4000);warLog(w,'The hosts held a victory feast in the Leaguer, and the heralds sang of the fall of '+R.L.name+'.');}}
  if(!Db)return;
  // the monument on its crater's rim
  const w=WARS.get(Db.P&&Db.P.id),E=w&&elOf(w);if(E&&!E.mon){const c=emberMonumentCells(Db);if(c){E.mon=-1;warJob(c,300,ok=>{E.mon=ok?1:0;if(ok)warLog(w,'The three peoples raised a monument on the rim of the crater where '+warLord(w).L.name+' had its throne.');saveDirty=true;});}}
  // the land heals: grass and flowers on the ash about the player, more as time passes
  const bx=Math.floor(PL.x),bz=Math.floor(PL.z),onTop=bx>=0&&bz>=0&&bx<W&&bz<D&&PL.y>=ground[bx+W*bz]-2;
  if(onTop&&emberHealN<800){const t0=E&&E.ft||0,p=Math.min(0.9,0.15+(warPlay-t0)/3600*0.5);if(Math.random()<p){const a=Math.random()*6.283,r=6+Math.random()*24,x=Math.floor(PL.x+Math.sin(a)*r),z=Math.floor(PL.z+Math.cos(a)*r);
    if(x>=0&&z>=0&&x<W&&z<D){const y=ground[x+W*z],id=get(x,y,z);if([BLACKASH,CINDER,ASH].includes(id)&&get(x,y+1,z)===AIR){setBlock(x,y,z,GRASS,true);emberHealN++;if(Math.random()<0.35)setBlock(x,y+1,z,[TGRASS,TGRASS,FLOWR,FLOWY][Math.floor(Math.random()*4)],true);}}}}
  // something stirs below
  if(PL.y<Db.G.base-40&&(emberStirT-=1)<=0){emberStirT=300+Math.random()*180;burst(4,'lowpass',40,0.5,0.6,0,[PL.x,PL.y-20,PL.z]);shake=Math.max(shake,0.5);toast('Far below, something stirs in the lava sea');}}
// a lord's fate: its mountain dies at once in the loaded world; its relics owed unless the player slew it (from emberFate)
function emberAfterFate(R,fate,byP){const S=volcShape(R.G);if(Math.hypot(S.cx-(PL.x+OX),S.cz-(PL.z+OZ))<R.G.R*1.3+W)emberReload=6;if(!byP)emberOwe(R);
  const w=warOfFort(R.F);if(w)setTimeout(()=>warLog(w,'As it fell, something stirred far below in the lava sea.'),10);}
