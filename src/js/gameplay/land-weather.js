// ---- Weather by land (M6h, D-046; Q127, Q128): mist and fog, storms, drifting dust and ash, and tinted skies, by the land the player
// stands in, easing from one land's weather into the next. Still cosmetic. Fog never closes in nearer than 38 blocks (Q128).
const LAND_WX={willow:{fog:0.5},bog:{fog:0.6},cloud:{fog:0.8,storm:1},shadow:{fog:0.4},giant:{fog:0.35},yew:{fog:0.3},moors:{fog:0.35},barrow:{fog:0.3},
  glowcap:{fog:0.5,tint:[0.75,0.95,1],ta:0.25},fjord:{fog:0.35,storm:1,snow:1},sea:{fog:0.15,storm:1},kelp:{fog:0.2,storm:1},isles:{fog:0.3,storm:1},chalk:{storm:1},blacksand:{storm:1,fog:0.2},mtn:{storm:1},
  blight:{fog:0.5,tint:[0.8,0.85,0.72],ta:0.4,dust:0.4,ash:1},volcanic:{tint:[0.85,0.6,0.5],ta:0.45,dust:0.7,ash:1},dry:{tint:[1,0.88,0.68],ta:0.35,dust:0.6},petrified:{tint:[1,0.86,0.7],ta:0.3,dust:0.4},
  steppe:{tint:[1,0.95,0.8],ta:0.2,dust:0.15},crystal:{tint:[0.88,0.82,1],ta:0.3,snow:1},starfall:{tint:[0.8,0.76,1],ta:0.25},autumn:{tint:[1,0.9,0.8],ta:0.15},silver:{tint:[0.92,0.95,1],ta:0.2},
  tundra:{snow:1},glacier:{snow:1,fog:0.3},alpine:{snow:0.5}};
const LWX={fog:0,ta:0,dust:0,ash:0,storm:0,snow:0,tint:new THREE.Color(1,1,1),k:'',t:0},TLW={},tintTmp=new THREE.Color(),tintMul=new THREE.Color();
function landWeather(dt){
  LWX.t-=dt;if(LWX.t<=0){LWX.t=0.5;colInfo(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),TLW);LWX.k=LANDS[TLW.land].k;}
  const p=LAND_WX[LWX.k]||{},f=Math.min(1,dt*0.3);
  LWX.fog+=((p.fog||0)-LWX.fog)*f;LWX.ta+=((p.ta||0)-LWX.ta)*f;LWX.dust+=((p.dust||0)-LWX.dust)*f;LWX.ash+=((p.ash||0)-LWX.ash)*f;LWX.storm=p.storm||0;LWX.snow=p.snow||0;
  if(p.tint)LWX.tint.lerp(tintTmp.setRGB(p.tint[0],p.tint[1],p.tint[2]),f);
}
// the sky takes on the land's tint
function tintSky(c){tintMul.copy(c).multiply(LWX.tint);c.lerp(tintMul,LWX.ta);}
