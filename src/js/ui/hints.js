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
  grave:()=>'Your things are in a grave where you fell. Use it to get them back.'
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
  if(hit){if(hit.id===LECTERN)hint('lectern');else if(hit.id===WAYSTONE)hint('waystone');else if(isBox(hit.id))hint('box');}
  if(lampLevel()[0]===0&&lampDark()){darkT+=dt;if(darkT>3)hint('dark');}else darkT=0;
}
