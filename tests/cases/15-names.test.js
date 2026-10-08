// Names: original styles per people, and never one of Tolkien's names (D-019, Q25, Q26).
// 1. The blocklist catches exact names, near misses and distinctive roots, but not ordinary words
assert(['Durin','Thrain','Mordor','Khazdum','Moria','Smaug','Gandalf','Lothlorien'].every(isBlockedName),'Tolkien names and near misses are refused');
assert(!['Barrow Hills','Green Hills','Krag Fast','Ostrand','Hallow'].some(isBlockedName),'ordinary words and original names pass');
// 2. Every people's generator only produces allowed names, and rarely needs to redraw
let blocked=0,raw=0,total=0;const samples={};
for(const people of Object.keys(PEOPLES)){
  const r=mkRng(777+people.length);samples[people]=[];
  for(let k=0;k<3000;k++){const n=fullName(people,r,k%3===0);total++;if(isBlockedName(n))blocked++;if(k<4)samples[people].push(n);}
  const P=PEOPLES[people];for(const a of P.a)for(const b of P.b)if(isBlockedName(a+b))raw++;
}
info('sample names',Object.entries(samples).map(([p,s])=>p+': '+s.join(', ')).join(' | '));
info('syllable pairs the blocklist refuses',raw);
assert(blocked===0,'no generated name is blocked ('+total+' names across '+Object.keys(PEOPLES).length+' peoples)');
assert(raw<=3,'the syllable sets are original: at most 3 pairs ever need refusing');
// 3. Hold names (and their kings and queens) over a wide area are all allowed
let holdBad=[];for(let a=-60;a<=60;a+=8)for(let b=-60;b<=60;b+=8){const h=holdOf(a,b);for(const n of [h.name,h.king,h.queen])if(isBlockedName(n))holdBad.push(n);}
assert(holdBad.length===0,'hold, king and queen names are allowed'+(holdBad.length?' ('+holdBad.slice(0,5).join(', ')+')':''));
// 4. Every fixed name in the game passes, word by word
const fixed=[...BIOMES,...Object.values(RUIN_NAMES),...Object.values(POI_NAMES),...Object.values(CAVE_NAMES),...BL.filter(Boolean).map(b=>b.n),...Object.values(ITEMS).map(i=>i.n)];
const fixedBad=[];for(const s of fixed)for(const w of s.split(/[^A-Za-z]+/))if(w.length>=4&&isBlockedName(w))fixedBad.push(s);
assert(fixedBad.length===0,'no fixed place, block or item name uses a Tolkien name'+(fixedBad.length?' ('+fixedBad.join(', ')+')':''));
