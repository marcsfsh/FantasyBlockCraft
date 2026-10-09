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
