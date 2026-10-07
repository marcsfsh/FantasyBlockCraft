// Usage: node tools/check-syntax.mjs
// Bundles src/js in memory and compiles it as a classic script without running it (well under a second).
// Prints the source file and line of the first syntax error and exits 2, which a Claude Code hook shows to Claude.
import {syntaxError} from './lib.mjs';
const err=syntaxError();
if(err){console.error('Syntax error in the bundle: '+err);process.exit(2);}
console.log('bundle syntax ok');
