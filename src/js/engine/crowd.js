// ---- Crowds seen from afar (D-077). A foe or one of the folk beyond the nearest whole ones (foeLod) is one instance of its kind's
// merged model (`amMerged`) in an instanced mesh for each model and coat, so a host of thousands takes a few dozen draw calls. Each
// instance carries its own place, facing, fall and light (sky, block light, the struck flash); the batches are filled each frame
// by placeFoe (`crowdPut`) and closed by updFoes (`crowdFrame`). Those behind the eye are left out.
const CROWD=new Map();
const AM_VSI='attribute vec3 inst;varying vec3 vI;varying vec2 vUv;varying float vD;varying vec3 vN;void main(){vUv=uv;vI=inst;mat4 m=modelMatrix*instanceMatrix;vN=normalize(mat3(m)*normal);vec4 mv=viewMatrix*m*vec4(position,1.0);vD=length(mv.xyz);gl_Position=projectionMatrix*mv;}';
const AM_FSI=(()=>{const a='uniform float eL;uniform float eB;uniform float hurt;';if(!AM_FS.includes(a))throw new Error('crowd.js: the animal shader changed');
  return '#define eL vI.x\n#define eB vI.y\n#define hurt vI.z\n'+AM_FS.replace(a,'varying vec3 vI;');})();
let crowdEye=null;
// one batch per model and coat: the model's merged geometry (its buffers shared) with its own instance attributes, room for cap
function crowdBatch(f,M){const F=FOES[f.kind],key=F.m+':'+f.ci;let B=CROWD.get(key);if(B&&B.n<B.cap)return B;
  const cap=B?B.cap*2:64,g0=amMerged(F.m,F.mount?P=>riderPose({ph:0,sp:0,atk:0,swing:0},P,0):F.bear?P=>{P.load.scale.setScalar(0.001);}:null),g=new THREE.BufferGeometry();
  for(const k of ['position','normal','uv'])g.setAttribute(k,g0.attributes[k]);g.setIndex(g0.index);
  const at=new THREE.InstancedBufferAttribute(new Float32Array(cap*3),3);at.setUsage(THREE.DynamicDrawUsage);g.setAttribute('inst',at);
  const mat=B?B.mat:new THREE.ShaderMaterial({uniforms:{map:{value:M.mat.uniforms.map.value},fogColor:U.fogColor,fogNear:U.fogNear,fogFar:U.fogFar,lamp:U.lamp,lampR:U.lampR,skyMul:U.skyMul,skyTint:U.skyTint,
    caveMin:U.caveMin,caveTint:U.caveTint,fade:{value:1}},vertexShader:AM_VSI,fragmentShader:AM_FSI});
  const mesh=new THREE.InstancedMesh(g,mat,cap);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;scene.add(mesh);
  const N={key:key,mesh:mesh,mat:mat,at:at,cap:cap,n:0,used:0};
  if(B){N.mesh.instanceMatrix.array.set(B.mesh.instanceMatrix.array.subarray(0,B.n*16));at.array.set(B.at.array.subarray(0,B.n*3));N.n=B.n;scene.remove(B.mesh);B.mesh.dispose();} // (grown: twice the room; its model's buffers are shared, so its geometry is not disposed)
  CROWD.set(key,N);return N;}
// one afar: its place and facing, its fall when slain, its step's bob, its scale; its light
function crowdPut(f,M,root){
  if(!crowdEye){const d=camDir();crowdEye=[PL.x,PL.z,d.x,d.z,Math.hypot(d.x,d.z)||1];}
  const E=crowdEye;if(((f.x-E[0])*E[2]+(f.z-E[1])*E[3])/E[4]<-8)return; // behind the eye
  const B=crowdBatch(f,M),i=B.n++,e=B.mesh.instanceMatrix.array,o=i*16,s=root.scale.x,ct=Math.cos(f.yaw),st=Math.sin(f.yaw),cp=Math.cos(root.rotation.x),sp=Math.sin(root.rotation.x);
  e[o]=ct*s;e[o+1]=0;e[o+2]=-st*s;e[o+3]=0;e[o+4]=st*sp*s;e[o+5]=cp*s;e[o+6]=ct*sp*s;e[o+7]=0;e[o+8]=st*cp*s;e[o+9]=-sp*s;e[o+10]=ct*cp*s;e[o+11]=0;
  e[o+12]=f.x;e[o+13]=f.y+root.position.y+Math.abs(Math.sin(f.ph))*0.08*f.amp;e[o+14]=f.z;e[o+15]=1;
  const a=B.at.array;a[i*3]=f.eL;a[i*3+1]=f.eB;a[i*3+2]=f.hurt;}
// the frame's batches closed: each draws what it was given
function crowdFrame(){crowdEye=null;for(const B of CROWD.values()){B.mesh.count=B.n;B.mesh.visible=B.n>0;if(B.n){B.mesh.instanceMatrix.needsUpdate=true;B.at.needsUpdate=true;}B.used=B.n;B.n=0;}}
const crowdCount=()=>{let n=0;for(const B of CROWD.values())n+=B.used;return n;};
