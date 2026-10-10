// ---- Context hints (M5a, Q38): a short note the first time something happens, once per player (settings.seen) unless hints
// are turned off in the pause menu. Each names the control for the device in use (ctl in ui/controls.js).
const HINTS={
  start:()=>'Hold '+ctl('break')+' to mine. Press '+ctl('inventory')+' to open your pack and craft: logs make planks, planks make sticks, and both make tools.',
  ore:()=>'Ore gives raw metal. Build a furnace from 8 cobblestone and smelt the metal with coal into ingots for better tools.',
  tier:()=>'This needs a better pickaxe. Each pickaxe mines the next metal: stone for copper, copper for tin and gold, bronze for iron, iron for platinum, steel for moonsilver.',
  hunger:()=>'You are getting hungry. Hold food and press '+ctl('place')+' to eat. Cooked food fills you most.',
  dark:()=>"It is dark. Hold a torch, or wear a Miner's Lantern in your belt slot: it burns lamp oil or pitch candles.",
  lectern:()=>'A lectern. Press '+ctl('place')+" to read a page of the hold's chronicle; "+ctl('journal')+' opens your journal.',
  waystone:()=>'An Ancient Waystone. Press '+ctl('place')+' to attune it; you can travel between attuned stones.',
  box:()=>'Press '+ctl('place')+' to open it. What you leave inside stays there.',
  climb:()=>'Climbing: '+ctl('jump')+' goes up, '+ctl('sprint')+' goes down, and letting go holds you still.',
  grave:()=>'Your things are in a grave where you fell. Use it to get them back.',
  a_deer:()=>'A deer. Deer are shy: run at them and the herd bolts. Strike one to hunt it for venison and a hide.',
  a_rabbit:()=>'A rabbit. Quick to bolt; strike one to hunt it for meat.',
  a_sheep:()=>'A sheep. Use shears on it for wool (it grows back); strike it for mutton.',
  a_goat:()=>'A mountain goat. Press '+ctl('place')+' with an empty hand for milk.',
  a_hen:()=>'A wild hen. Press '+ctl('place')+' with an empty hand to take an egg.',
  a_boar:()=>'A boar. Strike one to hunt it for pork and a hide. The striped young are let be.',
  a_horse:()=>'A wild horse. Press '+ctl('place')+' to ride it, and again to get off; '+ctl('sprint')+' gallops.',
  a_hound:()=>'A stray hound. Feed it meat and it follows you; press '+ctl('place')+' to have it stay or follow.',
  a_mule:()=>'A wild mule. Feed it wheat, turnips, beans or an apple and it carries a pack for you.',
  // the foes of the Volcanic Wastes (D-052)
  f_goblin:()=>'A goblin cutter. Goblins come in packs and flee when hurt. A sword ('+ctl('break')+') is the best answer; armour in the body slot takes part of each blow.',
  f_gslinger:()=>'A goblin slinger. It keeps its distance and throws stones. Close in fast.',
  f_gfire:()=>'A goblin firecaller. Its fire flies slowly: step aside, then strike.',
  f_gchief:()=>'A goblin chieftain, the master of this warren. Its hoard is by its throne.',
  f_raider:()=>'An orc raider. Orcs roam the Volcanic Wastes in warbands. Fight them one at a time if you can.',
  f_bowman:()=>'An orc bowman. Its arrows reach far; get behind rock or get close.',
  f_brute:()=>'An orc brute. Its shield takes most of a blow from the front: strike it from the side or behind.',
  f_ochief:()=>'An orc warchief. When it sounds its horn the whole warband comes.',
  f_troll:()=>'An ash troll. Slow, but its blows send you flying and it throws rocks. Keep moving.',
  f_ember:()=>'An Emberlord: a demon of fire and shadow. Its whip reaches far and its fire comes in threes. Few survive it.'
};
let hintT=0,darkT=0;
function hint(id){
  if(settings.hints===false||!HINTS[id]||(settings.seen&&settings.seen[id]))return false;
  settings.seen=settings.seen||{};settings.seen[id]=1;lsSet(SET_KEY,settings);
  const el=$('hint');el.textContent=HINTS[id]();el.style.display='block';clearTimeout(hintT);hintT=setTimeout(()=>{el.style.display='none';},8000);return true;
}
// A few times a second while playing in survival: hints for the player's state and for what they look at
function hintTick(dt,hit){
  if(!SURV()||dead||!playing)return;
  hint('start');
  if(food<=14)hint('hunger');
  if(PL.climb)hint('climb');
  {const an=animalHit(8);if(an)hint('a_'+an.kind);} // the first time you look at each kind of animal (E1)
  {const fo=foeHit(14);if(fo)hint('f_'+fo.kind);} // and each kind of foe (D-052)
  if(hit){if(hit.id===LECTERN)hint('lectern');else if(hit.id===WAYSTONE)hint('waystone');else if(isBox(hit.id))hint('box');}
  if(lampLevel()[0]===0&&lampDark()){darkT+=dt;if(darkT>3)hint('dark');}else darkT=0;
}
