// Seeded random and noise
function mkRng(s){return function(){s=(s*16807)%2147483647;return s/2147483647;};}
const wr=mkRng(SEED),tr=mkRng(424242);
const perm=new Uint8Array(512);
(function(){const r=mkRng((SEED^0x5bd1e995)>>>0||7),p=[];for(let i=0;i<256;i++)p[i]=i;for(let i=255;i>0;i--){const j=Math.floor(r()*(i+1));const t=p[i];p[i]=p[j];p[j]=t;}for(let i=0;i<512;i++)perm[i]=p[i&255];})();
const fade=t=>t*t*t*(t*(t*6-15)+10),lerp=(a,b,t)=>a+t*(b-a);
function grad(h,x,y,z){h&=15;const u=h<8?x:y,v=h<4?y:(h===12||h===14?x:z);return((h&1)?-u:u)+((h&2)?-v:v);}
function noise3(x,y,z){
  let X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z);x-=X;y-=Y;z-=Z;X&=255;Y&=255;Z&=255;
  const u=fade(x),v=fade(y),w=fade(z),p=perm;
  const A=p[X]+Y,AA=p[A]+Z,AB=p[A+1]+Z,B=p[X+1]+Y,BA=p[B]+Z,BB=p[B+1]+Z;
  return lerp(lerp(lerp(grad(p[AA],x,y,z),grad(p[BA],x-1,y,z),u),lerp(grad(p[AB],x,y-1,z),grad(p[BB],x-1,y-1,z),u),v),
              lerp(lerp(grad(p[AA+1],x,y,z-1),grad(p[BA+1],x-1,y,z-1),u),lerp(grad(p[AB+1],x,y-1,z-1),grad(p[BB+1],x-1,y-1,z-1),u),v),w);
}
function fbm2(x,z,oct,o){let a=1,f=1,s=0,n=0;for(let i=0;i<oct;i++){s+=a*noise3(x*f+o,0.31+i*7.13,z*f+o);n+=a;a*=0.5;f*=2;}return s/n;}
const pick=(arr,r)=>arr[Math.floor(r()*arr.length)];
const sstep=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};

