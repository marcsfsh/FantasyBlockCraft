// Turns the game bundle into a runnable test (or benchmark) bundle: pins the seed and pastes code at the /*@test-hook*/ marker.
// Shared by tests/run-tests.mjs and tools/bench.mjs.
import {bundleJS} from '../../tools/lib.mjs';
export const HOOK='/*@test-hook*/';
const SEED_RE=/const SEED=saved&&saved\.seed\?saved\.seed:\(nextSeed\|\|\(\(Math\.random\(\)\*2147483000\|0\)\+1\)\);/;
export function gameBundle(){
  const bundle=bundleJS();if(!bundle.includes(HOOK))throw new Error('The /*@test-hook*/ marker is missing from the game source');
  if(!SEED_RE.test(bundle))throw new Error('The SEED line changed; update SEED_RE in tests/harness/prepare.mjs');
  return bundle;
}
// Seeds a case pins with a comment such as "// @seed 777" or "// @seed 123456789 4242" (one run per seed).
export function pinnedSeeds(code){const m=code.match(/@seed\s+(\d[\d ,]*)/);return m?m[1].split(/[ ,]+/).filter(Boolean):[];}
export function prepare(bundle,code,seed){return bundle.replace(SEED_RE,'const SEED='+seed+';').replace(HOOK,()=>code);}
