// ---- Coins and trading counters
const COINV={203:1,204:10,205:100};
const BANNED=new Set([WIRE,COALGEN,WHEEL,SOLAR,BATTERY,LAMP_OFF,LAMP_ON,EFURN,CHARGER,252,253,254]);
for(let i=RECIPES.length-1;i>=0;i--){const rc=RECIPES[i];if(BANNED.has(rc[0])||rc[2].some(q=>BANNED.has(q[0])))RECIPES.splice(i,1);}
for(const T of [ARMORY_L,FOOD_L,SCHOLAR_L,SMITH_L,TREASURE_L,DWLOOT,LOOT,BARRELLOOT])for(let i=T.length-1;i>=0;i--)if(BANNED.has(T[i][0]))T.splice(i,1);
const VAL={200:2,201:0.25,202:1,210:4,211:5,212:5,213:6,214:40,215:300,216:60,220:8,221:10,222:10,223:12,224:80,225:12,226:12,227:20,228:150,229:800,230:200,
  240:2,241:4,242:30,243:45,244:45,245:70,246:500,247:2500};
VAL[208]=0.4;VAL[209]=1;VAL[269]=2.5;VAL[251]=3;VAL[206]=3;VAL[207]=2;VAL[271]=15;VAL[272]=120;VAL[273]=60;VAL[274]=900;VAL[GOLDB]=700;VAL[TORCH]=0.3;VAL[GLASS]=1;VAL[WOOLW]=1;VAL[WOOLR]=1;VAL[PLANKS]=0.5;VAL[LOG]=1;VAL[COBBLE]=0.15;VAL[LANTERN]=20;VAL[FURN]=3;VAL[DIRT]=0.1;VAL[SAND]=0.15;
VAL[BRICK]=1;VAL[SBRICK]=0.5;VAL[SANDSTONE]=0.4;VAL[TERO]=0.6;VAL[TERB]=0.6;VAL[CACTUS]=0.5;VAL[FLOWR]=0.5;VAL[FLOWY]=0.5;VAL[CRYSTAL]=15;VAL[GLOW]=6;VAL[BOOKS]=4;VAL[TNT]=6;
const CATALOGS={
  'General goods':[[TORCH,16],[GLASS,8],[WOOLW,8],[PLANKS,16],[LOG,8],[COBBLE,32],[LANTERN,1],[201,16],[BOOKS,2]],
  'Metalworks':[[200,8],[220,4],[221,4],[222,4],[223,4],[225,4],[226,4],[227,2],[242,1],[243,1],[244,1],[245,1],[FURN,1]],
  'Farm and garden':[[208,8],[209,4],[269,4],[251,1],[206,4],[207,4],[202,8],[DIRT,16],[SAND,16],[CACTUS,4],[FLOWR,4],[FLOWY,4],[LOG,8]],
  "Builder's supply":[[BRICK,16],[SBRICK,16],[SANDSTONE,16],[GLASS,16],[TERO,16],[TERB,16],[WOOLR,8],[LANTERN,1],[GLOW,4]],
  'Antiquarian':[[271,4],[272,1],[273,1],[274,1],[GOLDB,1],[230,1]],
  'Jeweler':[[272,1],[274,1],[214,2],[224,1],[215,1],[229,1],[230,1],[CRYSTAL,4]]
};
function priceOf(v){
  v=Math.max(1,Math.round(v));
  if(v>=100&&v%100<15)return[205,Math.round(v/100)];
  if(v>=10)return[204,Math.max(1,Math.round(v/10))];
  return[203,v];
}
function tradeOffers(X,Y,Z){
  const x=X-OX,z=Z-OZ;let furnace=false,mint=false;
  for(let dy=-1;dy<=1;dy++)for(let dz=-4;dz<=4;dz++)for(let dx=-4;dx<=4;dx++){const id=get(x+dx,Y+dy,z+dz);if(id===FURN)furnace=true;if(id===MINT)mint=true;}
  if(mint)return{name:'Bank',offers:[[[203,10],[204,1]],[[204,1],[203,10]],[[204,10],[205,1]],[[205,1],[204,10]],[[204,9],[224,1]],[[205,9],[229,1]]]};
  const names=Object.keys(CATALOGS),name=furnace?'Metalworks':names[Math.floor(hsh(X,Y*7+3,Z)*names.length)];
  const r=rngAt(X,61+Y,Z),pool=CATALOGS[name].slice(),offers=[];
  const n=Math.min(pool.length,4+(r()*3|0));
  for(let k=0;k<n;k++){
    const [id,cnt]=pool.splice(Math.floor(r()*pool.length),1)[0],v=(VAL[id]||1)*cnt,mode=r();
    const relic=id>=271&&id<=274;
    if(mode<0.7&&!relic)offers.push([priceOf(v*1.3),[id,cnt]]);
    if(mode>0.4||relic)offers.push([[id,cnt],priceOf(v*0.7)]);
  }
  return{name:name,offers:offers};
}
let tradeAt=null;
function openTrade(X,Y,Z){
  tradeAt=[X+OX,Y,Z+OZ];invOpen=true;hold=-1;
  $('invgrid').style.display='none';$('invname').style.display='none';$('sinv').style.display='none';$('trade').style.display='flex';
  $('bplist').style.display='none';$('lore').style.display='none';renderTrade();$('inv').style.display='grid';if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;
}
function renderTrade(){
  const T=tradeOffers(tradeAt[0],tradeAt[1],tradeAt[2]),box=$('trade');box.innerHTML='';
  $('invtitle').textContent=T.name+' counter';
  const purse=document.createElement('div');purse.className='inv-h';
  purse.textContent='Your coins: '+countOf(203)+' copper, '+countOf(204)+' gold, '+countOf(205)+' platinum. 10 copper = 1 gold, 10 gold = 1 platinum.';box.appendChild(purse);
  T.offers.forEach(([give,get])=>{
    const ok=countOf(give[0])>=give[1]&&(SURV()?roomFor(get[0])>=get[1]:true),row=document.createElement('div');row.className='rec'+(ok?'':' no');
    row.appendChild(icon(give[0]));
    const t=document.createElement('div');t.className='t';t.textContent=give[1]+' '+nameOf(give[0]);
    const sm=document.createElement('small');sm.textContent='for '+get[1]+' '+nameOf(get[0]);t.appendChild(sm);row.appendChild(t);row.appendChild(icon(get[0]));
    const b=document.createElement('button');b.textContent='Trade';b.disabled=!ok;
    b.addEventListener('click',()=>{if(countOf(give[0])<give[1])return;if(roomFor(get[0])<get[1]){toast('Inventory full');return;}
      takeItems(give[0],give[1]);addItem(get[0],get[1]);tone(1400,1800,0.06,0.08);tone(1800,2200,0.06,0.06,0.07);showName('+'+get[1]+' '+nameOf(get[0]));drawBar(true);renderTrade();});
    row.appendChild(b);box.appendChild(row);
  });
  if(!SURV()){const n=document.createElement('div');n.className='inv-h';n.textContent='Trading uses your survival inventory. Switch to survival mode to trade.';box.appendChild(n);}
}
