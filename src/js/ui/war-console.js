// ---- The war console (D-077, creative; from the pause menu or its key): the war about the player (the gate within 300, the
// basin's war, or the nearest found), its clock, the events that come by themselves (each stopped or let run), its efforts and its
// front set by hand, any of its events made to happen now (gate, borderlands, Emberlord), and the hosts summoned and led. What
// cannot be undone (the gate's fall, a lord's fate) asks to be pressed twice.
let wcArm=null;
function openWarConsole(){
  if(creativeOnly())return;if(WM.open)closeWorldMap();
  invOpen=true;hold=-1;['invgrid','invname','sinv','bplist','invsearch'].forEach(id=>{$(id).style.display='none';});
  $('lore').style.display='block';$('invtitle').textContent='War console';wcRender();
  $('inv').style.display='grid';if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;
}
function wcRender(){
  const el=$('lore'),top=el.scrollTop;el.innerHTML='';const C=wcWar(),now=(msg,close)=>{if(msg)toast(msg);saveDirty=true;if(close)closeInv();else wcRender();};
  const head=t=>{const h=document.createElement('div');h.className='inv-h';h.textContent=t;el.appendChild(h);};
  const row=lab=>{const r=document.createElement('div');r.className='wcrow';if(lab!==undefined){const s=document.createElement('span');s.className='lab';s.textContent=lab;r.appendChild(s);}el.appendChild(r);return r;};
  const btn=(r,label,fn,on)=>{const b=document.createElement('button');b.className='wide'+(on?' on':'');b.style.marginTop='0';b.textContent=label;b.addEventListener('click',fn);r.appendChild(b);return b;};
  const twice=(r,label,fn)=>{const k=label,b=btn(r,wcArm===k?'Press again: it cannot be undone':label,()=>{if(wcArm===k){wcArm=null;fn();}else{wcArm=k;wcRender();setTimeout(()=>{if(wcArm===k){wcArm=null;if(invOpen)wcRender();}},4000);}});return b;};
  const text=t=>{const d=document.createElement('div');d.textContent=t;d.style.marginBottom='6px';el.appendChild(d);};
  // the war
  head('The war');
  if(!C){text('No war found yet. The Ashen Gates stand in the rings of ash mountains about the Volcanic Wastes.');btn(row(),'Go to the nearest gate',()=>{if(gateTour('camp'))closeInv();});}
  else{const {w,P}=C;text(w.n+': '+warStage(w).toLowerCase()+(C.near?', here':C.d?', '+C.d+' blocks away':''));
    const r=row();btn(r,'Go to its camp',()=>{if(gateTour('camp'))closeInv();});btn(r,'Go to its gate',()=>{if(gateTour('gate'))closeInv();});}
  // its clock and the events that come by themselves
  head('The war\'s clock (efforts, the front, raids, the lords\' vents)');{const r=row();for(const [v,n] of WAR_CLOCKS)btn(r,n,()=>{WC.clk=v;now('');},WC.clk===v);}
  head('Events that come by themselves');
  for(const [k,n] of [['a','Battles at the gates and beyond'],['r','Raids on the bordering realms'],['e','The Emberlords\' wrath']]){const r=row(n);btn(r,'On',()=>{WC[k]=1;now('');},WC[k]!==0);btn(r,'Stopped',()=>{WC[k]=0;now('');},WC[k]===0);}
  if(C){const {w,P}=C,R=warLord(w),E=elOf(w),fallen=w.s>=2;
    // the efforts or the front, by hand
    const pct=[0,0.25,0.5,0.75,1];
    if(!fallen){head('The siege');for(const [k,lab] of WAR_EFF){const r=row(lab+' '+Math.round(warEff(w,k)*100)+'%');for(const v of pct)btn(r,Math.round(v*100)+'%',()=>now(wcDo('effort',[k,v])));}}
    else{head('The front beyond the gate');const r=row('The front '+Math.round(warFront(w)*100)+'%');for(const v of pct)btn(r,Math.round(v*100)+'%',()=>now(wcDo('effort',['fr',v])));}
    // now: at the gate
    head('Make it happen now'+(C.near?'':' (the gate\'s events: go to the gate first)'));
    {const r=row();btn(r,'The hosts attack',()=>now(wcDo('army'),1));btn(r,'A warhost attacks',()=>now(wcDo('warhost'),1));btn(r,'A pitched battle',()=>now(wcDo('pitched'),1));btn(r,'Ash drakes',()=>now(wcDo('drakes'),1));btn(r,'The council of war',()=>{closeInv();warCouncil(null);});if(!fallen)btn(r,'The last assault',()=>now(wcDo('last'),1));
      btn(r,'A raiding party of the hosts',()=>now(wcDo('party'),1));btn(r,'Orcs sally',()=>now(wcDo('sally'),1));btn(r,'Scouts of the hosts',()=>now(wcDo('scouts'),1));btn(r,'Goblin scouts',()=>now(wcDo('goblins'),1));
      btn(r,'The engines loose',()=>now(wcDo('engines'),1));if(!fallen)twice(r,'The gate falls',()=>now(wcDo('fall'),1));}
    head('The bordering realms');{const r=row();btn(r,'A raid on the nearest place',()=>now(wcDo('raid'),1));btn(r,'A siege of the nearest city or castle',()=>now(wcDo('siege'),1));
      btn(r,'Wolf riders, here',()=>now(wcDo('roam'),1));btn(r,'An ambush on the road, here',()=>now(wcDo('ambush'),1));}
    if(R){head('Its Emberlord: '+R.L.n);
      if(E.fate||fallenLords.has(R.F.id))text('Its fate is told: '+(EMBER_FATE[E.fate||'hosts'](R.L)));
      else{const r=row();btn(r,'Its mountain erupts',()=>now(wcDo('erupt'),1));btn(r,fallen?'It shows itself on its crater\'s rim':'It shows itself on the gate\'s wall',()=>now(wcDo('show'),1));btn(r,'It drives the warhosts on',()=>now(wcDo('drive'),1));
        btn(r,'Go before its gate',()=>{const F=R.F;if(goTo(Math.round(F.GX+F.ox*24),Math.round(F.GZ+F.oz*24))){PL.yaw=Math.atan2(F.ox,F.oz);closeInv();}});
        btn(r,'It comes out to meet you',()=>now(wcDo('sally2'),1));btn(r,'The loremasters\' rite',()=>now(wcDo('rite'),1));
        const f=row('Its fate:');for(const [k,n] of [['hosts','Slain by the hosts'],['bound','Bound'],['cast','Cast down'],['quenched','Its fire put out']])twice(f,n,()=>now(wcDo('fate',k),1));}}}
  // the hosts
  head('Hosts to summon (up to '+HOST_MAX+' in all)');
  const side=WC.hs==='o'?'o':'al',M=WC.hb[side]||(WC.hb[side]=hostMake(side,500));
  {const r=row();btn(r,'Of the alliance',()=>{WC.hs='al';now('');},side==='al');btn(r,'Of the wastes',()=>{WC.hs='o';now('');},side==='o');}
  for(const [k,lab] of HOST_UNITS[side]){const r=row(lab),i=document.createElement('input');i.type='number';i.min='0';i.max=String(HOST_MAX);i.step='10';i.value=String(M[k]||0);
    i.addEventListener('keydown',e=>e.stopPropagation());i.addEventListener('change',()=>{M[k]=Math.max(0,Math.min(HOST_MAX,Math.round(+i.value||0)));now('');});r.appendChild(i);
    btn(r,'+10',()=>{M[k]=Math.min(HOST_MAX,(M[k]||0)+10);now('');});btn(r,'+100',()=>{M[k]=Math.min(HOST_MAX,(M[k]||0)+100);now('');});btn(r,'0',()=>{M[k]=0;now('');});}
  {const tot=Object.values(M).reduce((a,b)=>a+(+b||0),0),r=row('In all '+tot);for(const n of [100,500,1000,2000,4000])btn(r,'Make it '+n,()=>{WC.hb[side]=hostMake(side,n);now('');});}
  {const r=row();btn(r,'Summon it to lead',()=>{if(wcSummon(side,true))closeInv();});btn(r,'Summon it against you, where you look',()=>{if(wcSummon(side,false))closeInv();});}
  if(HOSTS.length){head('The hosts summoned');
    for(const H of HOSTS){const n=hostLive(H).length,r=row((H.led?'Yours, ':'Against you, ')+'of '+(H.side==='al'?'the alliance':'the wastes')+': '+n+' of '+H.N+', '+{follow:'following you',hold:'holding',march:'marching',charge:'charging',advance:'advancing'}[H.cmd]);
      if(H.led){for(const [c,lab] of [['follow','Follow'],['hold','Hold'],['march','March to where you look'],['charge','Charge']])btn(r,lab,()=>{hostOrder(H,c);now('',c==='march'||c==='charge');});btn(r,'Volley',()=>{const v=hostVolley(H);now(v?'Loose! '+v+' archers draw and loose':'No archer of yours has a foe within bowshot',1);});}
      else for(const [c,lab] of [['hold','Hold'],['advance','Advance on you'],['charge','Charge']])btn(r,lab,()=>{hostOrder(H,c);now('',1);});
      {const r2=row('Formation: '+MOR_FORM_N[H.form||'line']+(H.mor&&H.mor.broken?' (broken, running)':''));for(const fm of MOR_FORMS)btn(r2,{line:'Ranks',wall:'Shield wall',wedge:'Wedge',square:'Square',loose:'Loose order'}[fm],()=>{hostReform(H,fm);now('',1);});}
      btn(r,'Dismiss',()=>{hostDismiss(H,'The host is dismissed');now('');});}
    text('Orders as you play: follow '+ctl('hostFollow')+', hold '+ctl('hostHold')+', march to where you look '+ctl('hostMarch')+', charge '+ctl('hostCharge')+', volley '+ctl('hostVolley')+', change formation '+ctl('hostForm')+'.');}
  el.scrollTop=top;
}
