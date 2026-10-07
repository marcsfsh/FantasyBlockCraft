// Claude Code Stop hook: before Claude finishes, make sure the committed playable copy (fantasy-blockcraft.html at the
// repository root) matches the source. If not, exit 2 so Claude rebuilds and commits it. Takes a few milliseconds.
import {playableStale} from './lib.mjs';
let raw='';for await(const c of process.stdin)raw+=c;
let again=false;try{again=!!JSON.parse(raw||'{}').stop_hook_active;}catch(e){}
if(again)process.exit(0); // already reminded once this turn; do not loop
const stale=playableStale();
if(stale){console.error(stale+'. Run npm run build and commit fantasy-blockcraft.html with the change (see CLAUDE.md).');process.exit(2);}
