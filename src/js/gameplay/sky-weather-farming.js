// Day, night and weather
const tintSet=new THREE.Color(1,0.82,0.66),flashC=new THREE.Color(0xdfe6ff);let flash=0,boltT=12;
const DAYLEN=1200;let dayN=0,tod=0.3,rainAmt=0,raining=false,rainT=120+Math.random()*120,snowing=false;
const cDay=new THREE.Color(0xa9d3ff),cNight=new THREE.Color(0x090e22),cSet=new THREE.Color(0xf0975a),cRain=new THREE.Color(0x6f7884),skyC=new THREE.Color(),tmpC=new THREE.Color(),sunC=new THREE.Color();
function curT(){return settings.time==='day'?0.5:settings.time==='night'?0.0:tod;}
function updSky(){
  const t=curT(),a=(t-0.25)*Math.PI*2,elev=Math.sin(a);
  sunDir.set(Math.cos(a)*0.85,elev,-0.38).normalize();
  const d=sstep(-0.12,0.22,elev),sunset=Math.max(0,1-Math.abs(elev)/0.24);
  U.skyMul.value=(0.16+0.84*d)*(1-0.3*rainAmt);
  U.skyTint.value.setRGB(0.6+0.4*d,0.7+0.3*d,1).lerp(tintSet,sunset*0.35*d);
  skyC.copy(cNight).lerp(cDay,d).lerp(cSet,sunset*0.5*Math.max(d,0.3));
  tmpC.copy(cRain).multiplyScalar(0.25+0.75*d);skyC.lerp(tmpC,rainAmt*0.65);tintSky(skyC); // the land's tint (M6h)
  stars.material.opacity=Math.max(0,1-d*1.7)*(1-rainAmt);
  {const v=(0.22+0.78*d)*(1-0.35*rainAmt);clouds.material.color.setRGB(v,v*(1-0.1*sunset*d),v*(1-0.22*sunset*d));} // warmer at sunset
  drawMoon(dayN%8);
  sunC.setHex(0xfff4c2).lerp(cSet,sunset*0.7);sun.material.color.copy(sunC);
  sun.visible=elev>-0.15;moon.visible=elev<0.2;
  U.skyMul.value=Math.min(1.2,U.skyMul.value+flash*0.9);skyC.lerp(flashC,flash*0.5);
  halo.visible=sun.visible&&rainAmt<0.6;halo.material.opacity=(0.55+0.45*sunset)*(1-rainAmt);
  paintDome(d,sunset);
  return d;
}
const NR=900,rainPos=new Float32Array(NR*6),drops=[];
for(let i=0;i<NR;i++)drops.push({x:0,y:-999,z:0});
entityKind({name:'rain',list:drops,persist:true});
const rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3).setUsage(THREE.DynamicDrawUsage));
const rainMat=new THREE.LineBasicMaterial({color:0xa4b8d4,transparent:true,opacity:0.5,depthWrite:false});
const rainLines=new THREE.LineSegments(rainGeo,rainMat);rainLines.frustumCulled=false;scene.add(rainLines);
function colTop(x,z){x=Math.floor(x);z=Math.floor(z);if(x<0||z<0||x>=W||z>=D)return -1;return hm[x+W*z]+1;}
function updWeather(dt,now){
  rainT-=dt;if(rainT<=0){raining=!raining;rainT=raining?60+Math.random()*90:(150+Math.random()*220)*(LWX.storm?0.5:1);} // storms come twice as often on the coasts and mountains
  flash=Math.max(0,flash-dt*3.5);
  if(rainAmt>0.75&&!snowing){boltT-=dt;if(boltT<=0){boltT=8+Math.random()*22;flash=1;const dl=0.4+Math.random()*2.5;burst(1.5,'lowpass',170,0.5,0.7,dl);burst(0.7,'lowpass',520,0.6,0.35,dl);buzz(30);}}
  rainAmt+=(((settings.weather&&raining)?1:0)-rainAmt)*Math.min(1,dt*0.25);
  const bx=Math.floor(PL.x),bz=Math.floor(PL.z),bi=(bx>=0&&bz>=0&&bx<W&&bz<D)?biome[bx+W*bz]:2;
  snowing=bi===6||(bi===5&&PL.y>=SEA+33); // High Mountains snow above their snow line (fillCol)
  landWeather(dt);if(LWX.snow>=1||(LWX.snow>0&&PL.y>SEA+60))snowing=true; // the cold lands' snow (M6h)
  // when it is dry, dust (the drylands) or ash (the volcanic and blighted lands) drifts in the air instead
  const dustN=rainAmt<0.1?Math.floor(NR*0.35*LWX.dust):0,dusty=rainAmt<0.1&&dustN>0;
  const n=dusty?dustN:Math.floor(NR*rainAmt),len=dusty?0.05:snowing?0.09:0.75;
  rainMat.color.setHex(dusty?(LWX.ash>0.5?0x8a8580:0xd8c08a):snowing?0xffffff:0xa4b8d4);rainMat.opacity=dusty?0.7:snowing?0.9:0.5;
  for(let i=0;i<n;i++){
    const p=drops[i];
    p.y-=(dusty?0.4:snowing?2.4:17)*dt;if(snowing||dusty){p.x+=Math.sin(now*0.001+i)*0.5*dt;p.z+=Math.cos(now*0.0013+i*1.7)*0.5*dt;}
    if(p.y<PL.y-10||p.y<colTop(p.x,p.z)||Math.abs(p.x-PL.x)>26||Math.abs(p.z-PL.z)>26){p.x=PL.x+(Math.random()-.5)*48;p.z=PL.z+(Math.random()-.5)*48;p.y=PL.y+8+Math.random()*14;if(p.y<colTop(p.x,p.z))p.y=-999;}
    const o=i*6;rainPos[o]=p.x;rainPos[o+1]=p.y;rainPos[o+2]=p.z;rainPos[o+3]=p.x;rainPos[o+4]=p.y+len;rainPos[o+5]=p.z;
  }
  rainGeo.setDrawRange(0,n*2);rainGeo.attributes.position.needsUpdate=true;rainLines.visible=n>0;
  ambTick(dt); // the land's and the layer's soundscape (M8); cave drips are part of it
  if(windGain){const sp=Math.hypot(PL.vx,PL.vy,PL.vz),lw=AMB.cur?AMB.cur.wind*(1+rainAmt):0;windGain.gain.value=settings.sound&&playing?Math.max(Math.max(0,Math.min(1,(sp-7)/18))*0.1,lw):0;}
  if(rainGain){const cx=Math.floor(PL.x),cz=Math.floor(PL.z),covered=PL.y+1<colTop(cx,cz);rainGain.gain.value=settings.sound&&!snowing?rainAmt*0.06*(covered?0.35:1):0;}
}

let flameT=0;
function torchFx(dt){
  flameT-=dt;if(flameT>0)return;flameT=0.14;let n=0;
  for(const i of torches){
    const x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;if(Math.abs(x-PL.x)>18||Math.abs(z-PL.z)>18||Math.abs(y-PL.y)>14)continue;
    spawnP(x+.5+(Math.random()-.5)*.06,y+.68,z+.5+(Math.random()-.5)*.06,(Math.random()-.5)*.15,0.5+Math.random()*.4,(Math.random()-.5)*.15,Math.random()<.75?[1,.78,.3]:[.45,.43,.42],0.35+Math.random()*.25,-0.4);
    if(++n>50)break;
  }
}
// Grass slowly spreads onto exposed dirt near the player
// ---- Farming: hoe, farmland, seeds and crops that grow over time
const CROP_NEXT={};CROP_NEXT[WHEAT0]=WHEAT1;CROP_NEXT[WHEAT1]=WHEAT2;CROP_NEXT[WHEAT2]=WHEAT;CROP_NEXT[POT0]=POT1;CROP_NEXT[POT1]=POT2;CROP_NEXT[POT2]=POT3;
CROP_NEXT[TURN0]=TURN1;CROP_NEXT[TURN1]=TURN2;CROP_NEXT[BEAN0]=BEAN1;CROP_NEXT[BEAN1]=BEAN2;
// What each seed or crop item plants (M4b adds turnips and beans, planted as they are)
const PLANT_OF={208:WHEAT0,209:POT0,330:TURN0,331:BEAN0};
function waterNear(x,y,z){for(let dz=-4;dz<=4;dz++)for(let dx=-4;dx<=4;dx++)if(get(x+dx,y,z+dz)===WATER||get(x+dx,y+1,z+dz)===WATER)return true;return false;}
function farmUse(hit,held){
  const top=hit.py===hit.y+1,above=get(hit.x,hit.y+1,hit.z);
  if(held===251){
    if(!top||![GRASS,DIRT,PATH,SNOWG].includes(hit.id)||!(above===AIR||BL[above].cross))return false;
    if(above!==AIR)setBlock(hit.x,hit.y+1,hit.z,AIR,true);
    setBlock(hit.x,hit.y,hit.z,waterNear(hit.x,hit.y,hit.z)?FARM_W:FARM_D,true);wearHeld(1);swing=1;sfxBlock(DIRT,false);breakFx(hit.x,hit.y+0.4,hit.z,DIRT,5);return true;
  }
  if((hit.id===FARM_D||hit.id===FARM_W)&&top&&above===AIR){
    setBlock(hit.x,hit.y+1,hit.z,PLANT_OF[held],true);
    if(SURV()){const q=inv[sel];q.c--;if(!q.c)inv[sel]=null;drawBar(true);}
    swing=1;sfxBlock(TGRASS,true);return true;
  }
  return false;
}
function farmTick(x,y,z,top,up){
  const wet=waterNear(x,y,z),want=wet?FARM_W:FARM_D;
  if(want!==top)setBlock(x,y,z,want,true);
  if(CROP_NEXT[up]){const lit=sky(x,y+1,z)*U.skyMul.value>0.45||bl(x,y+1,z)>0.5;if(lit&&Math.random()<(wet?0.45:0.15))setBlock(x,y+1,z,CROP_NEXT[up],true);}
  else if(up===AIR&&!wet&&Math.random()<0.08)setBlock(x,y,z,DIRT,true);
}
// Farmland anywhere (under roofs, underground) is tracked here, so crops grow wherever they have light
const farms=new Set(),isFarm=id=>id===FARM_D||id===FARM_W;
function randomTicks(){autoEdit=true;try{tickWork();}finally{autoEdit=false;}}
function tickWork(){
  for(const i of farms){const x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;if(Math.abs(x-PL.x)>24||Math.abs(z-PL.z)>24||y>=H-1)continue;if(Math.random()<40/2304)farmTick(x,y,z,world[i],world[i+W*D]);} // same odds as a ticked surface column
  for(let k=0;k<40;k++){
    const x=Math.floor(PL.x+(Math.random()-.5)*48),z=Math.floor(PL.z+(Math.random()-.5)*48);
    if(x<1||z<1||x>=W-1||z>=D-1)continue;
    const y=hm[x+W*z];if(y<1||y>=H-1)continue;
    const top=world[I(x,y,z)],up=world[I(x,y+1,z)];
    if(isFarm(top))continue; // ticked above
    if(top===GRASS&&snowing&&rainAmt>0.5&&up===AIR&&(biome[x+W*z]===5||biome[x+W*z]===6)){setBlock(x,y,z,SNOWG,true);continue;}
    if(top!==DIRT||OPQ[up]||BL[up].liquid)continue;
    let g=0;for(let dx=-1;dx<=1&&!g;dx++)for(let dz=-1;dz<=1&&!g;dz++)for(let dy=-1;dy<=1;dy++){const id=get(x+dx,y+dy,z+dz);if(id===GRASS||id===SNOWG){g=id;break;}}
    if(g)setBlock(x,y,z,g,true);
  }
}
let tickT=0;

