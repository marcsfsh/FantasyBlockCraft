// Auto view distance (M3, D-025): the default view follows the frame rate, on 60 Hz and 120 Hz screens alike.
assert(settings.view===-1,'Auto is the default view');
const A=AUTO_VIEW;
assert(A.far>=56&&A.far<=104,'auto starts from the device ('+A.far+' blocks)');
const run=(dt,work,sec,log)=>{for(let t=0;t<sec;t+=dt)autoView(dt*(0.97+0.06*((t*7919)%1)),work);log.push(A.far);};
let l1=[];A.far=84;A.fast=1;A.refresh=1/60;run(1/60,4,10,l1);run(1/42,12,12,l1);run(1/60,4,20,l1);
info('60 Hz screen: smooth, then 42 fps, then smooth again: view',l1.join(' -> '),'blocks; refresh seen',(1/A.refresh).toFixed(0),'Hz');
assert(l1[0]>84&&l1[1]<l1[0]&&l1[2]>l1[1],'the view grows while smooth, shrinks when frames slow, and grows back');
let l2=[];A.far=84;A.fast=1;A.refresh=1/60;run(1/120,3,10,l2);run(1/80,6,10,l2);
info('120 Hz screen: smooth, then 80 fps: view',l2.join(' -> '),'blocks; refresh seen',(1/A.refresh).toFixed(0),'Hz');
assert(Math.round(1/A.refresh)>=110&&l2[1]<l2[0],'on a 120 Hz screen, falling to 80 fps pulls the view in');
assert(FOGF===A.far&&Math.abs(FOGN-FOGF*0.55)<1e-9,'the fog follows the auto view');
// Render resolution (0.12.1, D-034): Sharp draws at the screen's density, Fast at 1, Auto starts sharp and gives way under load
assert(settings.res==='auto'&&RES.ratio===resTarget(),'Auto is the default resolution');
DPR=2;settings.res='sharp';setRes(resTarget());const sharp=RES.ratio;settings.res='fast';setRes(resTarget());const fast=RES.ratio;
DPR=3;settings.res='sharp';setRes(resTarget());const sharp3=RES.ratio;settings.res='auto';setRes(resTarget());const auto3=RES.ratio;
info('pixel ratio on a 200% screen: Sharp',sharp,'Fast',fast,'; on a 300% screen: Sharp',sharp3,'Auto',auto3);
assert(sharp===2&&fast===1&&sharp3===3&&auto3===(TOUCH?1.5:2),'Sharp uses the full density, Fast one pixel per CSS pixel, Auto up to 2 (1.5 on touch)');
DPR=2;setRes(resTarget());
const r1=[];A.far=96;A.fast=0;A.refresh=1/60;AV_S.length=0;A.t=A.work=0;const step=(dt,work,sec)=>{run(dt,work,sec,[]);r1.push(A.far+'/'+RES.ratio);};
step(1/40,14,8);step(1/40,14,12);step(1/40,14,12);step(1/60,4,10);step(1/60,4,20);
info('Auto at 200%: slow for 32 s, then smooth for 30 s (view/ratio):',r1.join(' -> '));
const [f1,f2,f3,f4,f5]=r1.map(s=>s.split('/').map(Number));
assert(f1[0]>=72&&f1[1]===2,'when frames slow, the view comes in to 72 blocks before the resolution drops');
assert(f3[1]===1&&f3[0]<72,'then the resolution drops to 1, and only then the view below 72');
assert(f4[1]===2&&f4[0]<=f3[0]+3,'when frames are smooth again the resolution comes back first');
assert(f5[0]>f4[0],'and then the view grows');
settings.res='fast';assert(!resStep(0.25)&&!resStep(-0.25),'Sharp and Fast never step');
DPR=1;settings.res='auto';setRes(resTarget());
