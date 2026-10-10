// ---- Names: one style per people from original syllables, and a blocklist so no generated name is one of Tolkien's
// Styles other than dwarf are first drafts for the owner to approve (D-019, Q26, Q28). Each name is two syllables: a + b.
const PEOPLES={
  dwarf:{a:['Ark','Bram','Brod','Dag','Drom','Fenn','Gald','Gorm','Hald','Harn','Jor','Kald','Karn','Krag','Lod','Mag','Nord','Orm','Rag','Rund','Skar','Stav','Torg','Ulm','Vald','Varn','Yorm'],
         b:['ak','ard','brek','dal','dek','fast','gar','hald','kin','lok','mund','nir','rak','rek','rim','stad','tun','und','vek','ulf']},
  human:{a:['Al','Bran','Cen','Ed','Gar','Hal','Mar','Os','Rand','Wil','Ber','Col','Dun','Hew','Lan','Tob'],b:['ric','wen','mund','ford','ley','wick','ton','bert','win','ard','helm','ston']},
  halfling:{a:['Bram','Cob','Dill','Fenn','Hob','Lob','Mott','Nib','Tam','Wil','Pud','Ros'],b:['ble','by','kin','wick','bottom','son','well','ford','den','hay']},
  gnome:{a:['Bix','Fizz','Nim','Pell','Quil','Tink','Wob','Zan','Dibb','Mox'],b:['bel','dle','kin','nock','ple','wick','zle','pop','rin']},
  goblin:{a:['Grub','Nag','Rik','Skab','Snik','Vex','Zog','Krik','Mub','Pik'],b:['ak','eek','nit','sk','zik','gut','ruk','snag','wort']},
  orc:{a:['Brak','Drog','Gash','Krom','Mug','Ruk','Thog','Zag','Hrud','Vurk'],b:['ash','dush','gor','nak','rok','tuk','ug','grim','bar']},
  woodelf:{a:['Ael','Cael','Fae','Lir','Syl','Tha','Ver','Ilsa','Nae','Rhi'],b:['lan','wen','ion','dris','rael','thas','vin','mira','sorn']},
  highelf:{a:['Aen','Cal','Ilm','Ith','Nar','Qua','Sel','Tar','Vae','Ys'],b:['adir','enor','idel','oriel','uvar','esse','ander','ithra']},
  drow:{a:['Dra','Ilv','Jhar','Mal','Nhel','Vel','Xun','Zar','Quar','Shy'],b:['aeth','dra','ith','lyn','ryn','vex','zith','nyss','ra']},
  fiend:{a:['Vor','Kael','Azh','Ghul','Skar','Thra','Ulm','Zhar','Ruuk','Xal'],b:['gath','rax','zul','thar','vex','okk','dun','ash','ruun']}, // the Emberlords (D-052)
  beastfolk:{a:['Arr','Fang','Grr','Hoof','Mar','Rha','Tusk','Whis','Brin','Ska'],b:['ka','mane','rek','tail','th','uun','rro','hide']}
};
// Proper names from Tolkien's works (lowercase, letters only). Exact matches, near misses (one letter off) and the roots below are refused.
const TOLKIEN=('aragorn arathorn arda arnor arwen azog bagend balin balrog bard beorn beleriand bifur bilbo bofur bolg bombur boromir bree brandybuck '+
 'buckland celeborn celebrimbor dain denethor dori dwalin dunedain durin edoras elendil elrond elros elwing entwash eomer eowyn erebor eregion eriador '+
 'esgaroth fangorn faramir feanor fili fingolfin finrod frodo galadriel gamgee gandalf gil-galad gimli gloin glorfindel gollum gondolin gondor gorbag grima '+
 'grishnakh hobbiton imladris isengard isildur ithilien khazad kili lothlorien lorien legolas lugburz luthien mandos manwe melkor meriadoc merry minastirith '+
 'mirkwood mithril mithrandir moria mordor morgoth morannon nazgul nargothrond nori numenor oin orthanc osgiliath palantir pippin radagast rivendell '+
 'rohan rohirrim samwise saruman sauron shagrat shelob silmaril smaug smeagol thingol thorin thrain thranduil thror bombadil treebeard tuor turin '+
 'uglukh ugluk ungoliant valinor varda wormtongue zirak zirakzigil kibilnala baraddur dol guldur dolguldur erech helmsdeep hornburg mithlond angmar '+
 'erebluin nimrodel anduin brandywine baranduin gwaihir shadowfax beregond eorl theoden theodred hama gamling haldir elladan '+
 'elrohir amroth imrahil halbarad lindir erestor glorfindel undomiel elessar estel strider ithil anor angband utumno thangorodrim tirion alqualonde '+
 'telperion laurelin yavanna aule ulmo orome tulkas nienna irmo varda estel khazaddum azanulbizar celebrant nenya vilya narya ringil anglachel narsil anduril sting glamdring orcrist').split(' ').filter(Boolean).map(s=>s.replace(/[^a-z]/g,''));
const TOLKIEN_SET=new Set(TOLKIEN);
const TOLKIEN_ROOTS=['khaz','durin','moria','mordor','gondor','erebor','sauron','morgoth','thror','thrain','thorin','smaug','rivendell','lorien','isengard','numenor','mithril','nazgul','silmaril','gandalf','aragorn','galadriel','legolas','gimli'];
const normName=s=>s.toLowerCase().replace(/[^a-z]/g,'');
function nearOne(a,b){ // edit distance at most 1
  if(a===b)return true;const la=a.length,lb=b.length;if(Math.abs(la-lb)>1)return false;
  let i=0,j=0,e=0;while(i<la&&j<lb){if(a[i]===b[j]){i++;j++;continue;}if(++e>1)return false;if(la>lb)i++;else if(lb>la)j++;else{i++;j++;}}
  return e+(la-i)+(lb-j)<=1;
}
function isBlockedName(s){
  const n=normName(s);if(n.length<3)return false;if(TOLKIEN_SET.has(n))return true;
  for(const r of TOLKIEN_ROOTS)if(n.includes(r))return true;
  for(const t of TOLKIEN)if(t.length>=5&&t[0]===n[0]&&nearOne(n,t))return true;
  return false;
}
// One name word in a people's style, drawn from the stream r (deterministic); doubled vowels at the join collapse, and blocked names are skipped by drawing again
function nameWord(people,r){const P=PEOPLES[people];let w='';for(let k=0;k<40;k++){w=(pick(P.a,r)+pick(P.b,r)).replace(/([aeiou])\1/gi,'$1');if(!isBlockedName(w))return w;}return w;}
// A full name of one or two words; the two-word form is also checked as a whole
function fullName(people,r,two){for(let k=0;k<40;k++){const n=nameWord(people,r)+(two?' '+nameWord(people,r):'');if(!isBlockedName(n))return n;}return nameWord(people,r);}
