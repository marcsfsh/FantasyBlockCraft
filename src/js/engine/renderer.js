// Three.js setup
const canvas=$('c');
const renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,TOUCH?1.5:1.25));
renderer.setSize(innerWidth,innerHeight);
renderer.setClearColor(SKY);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.05,600);
camera.rotation.order='YXZ';scene.add(camera);
const tex=new THREE.CanvasTexture(atlas);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestMipmapLinearFilter;tex.generateMipmaps=true;tex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
let FOGF=settings.view<0?AUTO_VIEW.far:VIEWS[settings.view][1],FOGN=settings.view<0?FOGF*0.55:VIEWS[settings.view][0];
const U={caveMin:{value:0},lampR:{value:13},caveTint:{value:new THREE.Color(0.55,0.66,0.9)},skyTint:{value:new THREE.Color(1,1,1)},skyMul:{value:1},map:{value:tex},fogColor:{value:new THREE.Color(SKY)},fogNear:{value:FOGN},fogFar:{value:FOGF},lamp:{value:0.78},time:{value:0}};
const VS='attribute float light;attribute float blk;attribute float aov;varying vec2 vUv;varying float vL;varying float vB;varying float vA;varying float vD;varying vec3 vW;void main(){vUv=uv;vL=light;vB=blk;vA=aov;vW=position;vec4 mv=modelViewMatrix*vec4(position,1.0);vD=length(mv.xyz);gl_Position=projectionMatrix*mv;}';
const FS='uniform sampler2D map;uniform vec3 fogColor;uniform float fogNear;uniform float fogFar;uniform float opacity;uniform float alphaTest;uniform float lamp;uniform float time;uniform float wave;uniform float bright;uniform float skyMul;uniform vec3 skyTint;uniform float caveMin;uniform float lampR;uniform vec3 caveTint;varying vec2 vUv;varying float vL;varying float vB;varying float vA;varying float vD;varying vec3 vW;'+
  'void main(){vec4 t=texture2D(map,vUv);if(t.a<alphaTest)discard;float lm=lamp*vA*(1.0-smoothstep(3.0,lampR,vD));vec3 l=vB>1.5?vec3(1.0):max(max(max(vL*skyMul*skyTint,vec3(lm)*vec3(1.0,0.93,0.82)),vec3(1.0,0.8,0.55)*vB),caveTint*caveMin*vA)*bright;vec3 c=t.rgb*l;'+
  'if(wave>0.5){c*=0.95+0.07*sin(time*1.7+vW.x*0.9+vW.z*0.7)+0.05*sin(time*2.3-vW.x*0.5+vW.z*1.3);}float f=smoothstep(fogNear,fogFar,vD);gl_FragColor=vec4(mix(c,fogColor,f),t.a*opacity);}';
function mat(op,at,transp,wave,overlay){return new THREE.ShaderMaterial({uniforms:Object.assign({},U,{opacity:{value:op},alphaTest:{value:at},wave:{value:wave?1:0},bright:{value:1}},overlay?{skyMul:{value:1}}:{}),vertexShader:VS,fragmentShader:FS,transparent:transp,depthWrite:!transp&&!overlay,depthTest:!overlay,side:transp?THREE.DoubleSide:THREE.FrontSide});}
const matO=mat(1,0.5,false,false),matW=mat(0.72,0.0,true,true),matHand=mat(1,0.5,false,false,true);

// Sun and clouds
const sunDir=new THREE.Vector3(0.45,0.75,-0.5).normalize();
const moon=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshBasicMaterial({color:0xdfe6f2,fog:false,depthWrite:false}));scene.add(moon);
const starGeo=new THREE.BufferGeometry(),sp=new Float32Array(900*3);
for(let i=0;i<900;i++){const u=tr()*2-1,a=tr()*6.2832,r=Math.sqrt(1-u*u);sp[i*3]=Math.cos(a)*r*380;sp[i*3+1]=Math.abs(u)*380+20;sp[i*3+2]=Math.sin(a)*r*380;}
starGeo.setAttribute('position',new THREE.BufferAttribute(sp,3));
const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false,transparent:true,opacity:0,depthWrite:false}));stars.frustumCulled=false;scene.add(stars);
const sun=new THREE.Mesh(new THREE.PlaneGeometry(46,46),new THREE.MeshBasicMaterial({color:0xfff4c2,fog:false,depthWrite:false}));
scene.add(sun);
const domeGeo=new THREE.SphereGeometry(470,24,14),domeCol=new Float32Array(domeGeo.attributes.position.count*3);
domeGeo.setAttribute('color',new THREE.BufferAttribute(domeCol,3));
const dome=new THREE.Mesh(domeGeo,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,depthWrite:false,fog:false}));
dome.renderOrder=-10;dome.frustumCulled=false;scene.add(dome);
const haloC=document.createElement('canvas');haloC.width=haloC.height=64;
(function(){const g=haloC.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,240,200,0.9)');gr.addColorStop(0.25,'rgba(255,220,160,0.35)');gr.addColorStop(1,'rgba(255,200,140,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);})();
const halo=new THREE.Mesh(new THREE.PlaneGeometry(170,170),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(haloC),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));
halo.renderOrder=-5;scene.add(halo);
const zenC=new THREE.Color(),cZen=new THREE.Color(0x4a86df),glowC=new THREE.Color(),dv=new THREE.Vector3();
function paintDome(d,sunset){
  zenC.copy(skyC).multiplyScalar(0.55+0.2*d).lerp(cZen,0.55*d*(1-rainAmt));
  glowC.setHex(0xffd9a0).lerp(cSet,sunset);
  const pos=domeGeo.attributes.position,glow=sun.visible?(0.25+0.5*sunset)*(1-rainAmt):0;
  for(let i=0;i<pos.count;i++){
    dv.set(pos.getX(i),pos.getY(i),pos.getZ(i)).normalize();
    const t=Math.pow(Math.max(0,Math.min(1,dv.y*1.5)),0.7),sd=Math.max(0,dv.dot(sunDir)),gl=Math.pow(sd,10)*glow;
    domeCol[i*3]=skyC.r+(zenC.r-skyC.r)*t+glowC.r*gl;domeCol[i*3+1]=skyC.g+(zenC.g-skyC.g)*t+glowC.g*gl;domeCol[i*3+2]=skyC.b+(zenC.b-skyC.b)*t+glowC.b*gl;
  }
  domeGeo.attributes.color.needsUpdate=true;
}
// Soft shadow under the player
const shC=document.createElement('canvas');shC.width=shC.height=32;
(function(){const g=shC.getContext('2d'),gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(0,0,0,0.6)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);})();
const pShadow=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.9),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shC),transparent:true,depthWrite:false}));
pShadow.rotation.x=-Math.PI/2;scene.add(pShadow);
const cc=document.createElement('canvas');cc.width=cc.height=64;
(function(){const g=cc.getContext('2d');g.fillStyle='#fff';for(let i=0;i<46;i++){const x=tr()*64|0,y=tr()*64|0,w=3+(tr()*9|0),h=2+(tr()*5|0);for(let ox=-64;ox<=0;ox+=64)for(let oy=-64;oy<=0;oy+=64)g.fillRect(x+ox+64,y+oy+64,w,h),g.fillRect(x+ox,y+oy,w,h);}})();
const ctex=new THREE.CanvasTexture(cc);ctex.magFilter=THREE.NearestFilter;ctex.minFilter=THREE.NearestFilter;ctex.wrapS=ctex.wrapT=THREE.RepeatWrapping;ctex.repeat.set(2,2);
const clouds=new THREE.Mesh(new THREE.PlaneGeometry(1536,1536),new THREE.MeshBasicMaterial({map:ctex,transparent:true,opacity:0.82,depthWrite:false,side:THREE.DoubleSide}));
clouds.rotation.x=-Math.PI/2;clouds.position.y=H+22;scene.add(clouds);

// Selection outline
const selBox=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.006,1.006,1.006)),new THREE.LineBasicMaterial({color:0x000000,transparent:true,opacity:0.65}));
selBox.visible=false;scene.add(selBox);
const faceHi=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.16,depthWrite:false,side:THREE.DoubleSide}));
faceHi.visible=false;scene.add(faceHi);const faceN=new THREE.Vector3();

// Meshing
const FACES=[
  {d:[-1,0,0],s:0.78,tf:2,ax:[1,2],c:[[0,1,0,0,1],[0,0,0,0,0],[0,1,1,1,1],[0,0,1,1,0]]},
  {d:[1,0,0],s:0.78,tf:2,ax:[1,2],c:[[1,1,1,0,1],[1,0,1,0,0],[1,1,0,1,1],[1,0,0,1,0]]},
  {d:[0,-1,0],s:0.55,tf:1,ax:[0,2],c:[[1,0,1,1,0],[0,0,1,0,0],[1,0,0,1,1],[0,0,0,0,1]]},
  {d:[0,1,0],s:1.0,tf:0,ax:[0,2],c:[[0,1,1,1,1],[1,1,1,0,1],[0,1,0,1,0],[1,1,0,0,0]]},
  {d:[0,0,-1],s:0.9,tf:2,ax:[0,1],c:[[1,0,0,0,0],[0,0,0,1,0],[1,1,0,0,1],[0,1,0,1,1]]},
  {d:[0,0,1],s:0.9,tf:2,ax:[0,1],c:[[0,0,1,0,0],[1,0,1,1,0],[0,1,1,0,1],[1,1,1,1,1]]}
];
const CROSS=[[[0,0,0],[1,0,1],[0,1,0],[1,1,1]],[[1,0,0],[0,0,1],[1,1,0],[0,1,1]]],CUV=[[0,0],[1,0],[0,1],[1,1]];
const AOF=[0.42,0.62,0.8,1];
const occ=(x,y,z)=>{const id=get(x,y,z);return id&&BL[id].occ?1:0;};
const UE=0.004;
function pushUV(arr,t,u,v){const c=t%AC,r=(t/AC)|0;arr.push((c+UE+u*(1-2*UE))/AC,1-(r+1)/AR+(UE+v*(1-2*UE))/AR);}
const chunks=new Array(NCX*NCZ);
// Growable typed buffers: much cheaper than pushing into plain arrays while meshing
class FB{constructor(T){this.T=T;this.a=new T(1024);this.n=0;}
  grow(k){if(this.n+k>this.a.length){const b=new this.T(Math.max(this.a.length*2,this.n+k));b.set(this.a);this.a=b;}}
  push(a,b,c,d,e,f){const n=arguments.length;this.grow(n);const A=this.a;if(n>6){for(let k=0;k<n;k++)A[this.n++]=arguments[k];return;}A[this.n++]=a;if(n>1){A[this.n++]=b;if(n>2){A[this.n++]=c;if(n>3){A[this.n++]=d;A[this.n++]=e;A[this.n++]=f;}}}}
  get length(){return this.n;}
  view(){return this.a.subarray(0,this.n);}}
function newM(){return{p:new FB(Float32Array),u:new FB(Float32Array),l:new FB(Float32Array),b:new FB(Float32Array),a:new FB(Float32Array),i:new FB(Uint32Array)};}
function mkGeo(m){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(m.p.view().slice(),3));g.setAttribute('uv',new THREE.BufferAttribute(m.u.view().slice(),2));g.setAttribute('light',new THREE.BufferAttribute(m.l.view().slice(),1));g.setAttribute('blk',new THREE.BufferAttribute(m.b.view().slice(),1));g.setAttribute('aov',new THREE.BufferAttribute(m.a.view().slice(),1));g.setIndex(new THREE.BufferAttribute(m.i.view().slice(),1));g.computeBoundingSphere();return g;}
function wDrop(x,y,z){if(get(x,y+1,z)===WATER)return 0;return 0.12+lvl[I(x,y,z)]*0.1;}
