// Claude Code PostToolUse hook: after an edit to src/, syntax-check the bundle (well under a second).
// Reads the hook's JSON from stdin; does nothing for edits outside src/. Exit 2 shows the error to Claude.
import path from 'node:path';
import {ROOT,syntaxError} from './lib.mjs';
let raw='';for await(const c of process.stdin)raw+=c;
let file='';try{const j=JSON.parse(raw||'{}'),t=j.tool_input||{};file=t.file_path||t.notebook_path||'';}catch(e){}
const rel=path.relative(ROOT,path.resolve(ROOT,file)).split(path.sep).join('/');
if(!rel.startsWith('src/'))process.exit(0);
const err=syntaxError();
if(err){console.error('Syntax error in the bundle after editing '+rel+': '+err);process.exit(2);}
