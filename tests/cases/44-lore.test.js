// Lore and chronicles (M7): each hold has an ordered chronicle; lecterns hold its pages and the journal keeps them in order (the
// checkpoint: three pages read in one hold); rune tablets are readable; the discovery log fills as you go; the journal is saved.
setMode('survival');
// ---- chronicles: eight pages, years rising, abandoned holds end in the leaving, inhabited ones in the present day
{let ab=null,inh=null,ok=true;for(let rx=-4;rx<=4;rx++)for(let rz=-4;rz<=4;rz++){const H=holdAt(rx,rz),P=holdChronicle(H.cx,H.cz);
    const ys=P.map(p=>+(p[1].match(/[Yy]ear (\d+)/)||[0,0])[1]);if(P.length!==CHRON_N||ys.some((y,i)=>i&&y<=ys[i-1]))ok=false;
    if(H.inhabited&&!inh)inh=P;if(!H.inhabited&&!ab)ab=P;}
  info('an abandoned chronicle ends:',ab[7][0],'; an inhabited one:',inh[7][0]);
  assert(ok&&ab[6][0]==='The Leaving'&&inh[7][0]==='The Present Day','every hold has eight pages in order, ending in its fall or in the present day');}
// ---- the checkpoint: read three pages in one hold and see them ordered in the journal
{const H=holdAt(0,0);regenerateAll(H.cx*CS+8,H.cz*CS+8);while(genQ.length)processGenQ();
  const found=new Map();for(let z=0;z<D;z++)for(let x=0;x<W;x++)for(let y=20;y<100;y++)if(world[I(x,y,z)]===LECTERN){const X=x+OX,Z=z+OZ;
    if(holdNear(Math.floor(X/CS),Math.floor(Z/CS))!==H||roomAt(X,y,Z)==='plaza')continue;const k=lecternPage(X,y,Z);if(!found.has(k))found.set(k,[x,y,z]);}
  info('lecterns in the window by page',[...found.keys()].sort().join(' '));
  assert(found.size>=3,'the hold has lecterns holding at least three different pages');
  const pick=[...found.entries()].slice(0,3).reverse();for(const [k,[x,y,z]] of pick)openLore(x,y,z);closeInv();
  const name=holdOf(H.cx,H.cz).name,e=JN.h[H.rx+','+H.rz],txt=journalText(),pos=e.p.map(k=>txt.indexOf((k+1)+'. '+holdChronicle(H.cx,H.cz)[k][0]));
  info('journal pages of',name,e.p.join(' '));
  assert(e.p.length===3&&e.p.every((k,i)=>!i||k>e.p[i-1])&&pos.every((p,i)=>p>=0&&(!i||p>pos[i-1])),'three pages read out of order stand in the journal in the order of the chronicle');
  assert(txt.includes('(a page not yet found)'),'pages not yet found are marked');
  openLore(...pick[0][1]);closeInv();assert(JN.h[H.rx+','+H.rz].p.length===3,'reading a page again does not add it twice');
  assert(JN.d.h.includes(name),'the hold is in the discovery log');}
// ---- rune tablets
{const t0=JN.t;readTablet();closeInv();readTablet();closeInv();assert(JN.t===t0+2&&journalText().includes(TABLETS[1]),'rune tablets are read in turn and copied into the journal');}
// ---- the discovery log: lands, layers, relics
{PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+2;LWX.t=0;landWeather(0.1);discT=0;discoverTick(1);
  PL.y=150;discT=0;discoverTick(1);addItem(272,1);
  info('discoveries',JSON.stringify(JN.d));
  assert(JN.d.l.length>=1&&JN.d.y.includes('The Great Caverns')&&JN.d.q.includes(272),'the discovery log records the land, the layer and a relic');}
// ---- saved with the world
{const store={};localStorage.setItem=(k,v)=>{store[k]=v;};saveNow();const sv=JSON.parse(store[worldKey(WORLD.id)]||'null');assert(sv&&sv.v===SAVE_V&&sv.jn&&Object.keys(sv.jn.h).length>=1&&sv.jn.t>=2,'the journal is saved with the world, at the version the loader reads');}
// ---- the journal has a key, and every people has names
assert(BINDS.keys.KeyL==='journal','the journal opens with L');
{const peoples=new Set(LANDS.map(L=>L.p));let bad=[];for(const p of peoples){if(!PEOPLES[p]){bad.push(p);continue;}const r=mkRng(7);for(let i=0;i<40;i++){const n=fullName(p,r,i%2===0);if(isBlockedName(n))bad.push(n);}}
  info('peoples named by the lands',[...peoples].join(' '));assert(!bad.length,'every people of the lands has a naming style that never gives a blocked name '+bad.join(' '));}
