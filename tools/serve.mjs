// Usage: node tools/serve.mjs [--watch] [--port=5173]
// Builds dist/web and serves it. With --watch it rebuilds when anything in src/ changes.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,buildWeb} from './lib.mjs';
const args=process.argv.slice(2),port=+((args.find(a=>a.startsWith('--port='))||'--port=5173').split('=')[1]);
const out=path.join(ROOT,'dist/web');
const rebuild=()=>{try{buildWeb(out);console.log('built '+new Date().toLocaleTimeString());}catch(e){console.error(e);}};
rebuild();
if(args.includes('--watch')){let t=null;fs.watch(path.join(ROOT,'src'),{recursive:true},()=>{clearTimeout(t);t=setTimeout(rebuild,150);});}
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.svg':'image/svg+xml'};
http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(out,p);
  if(!f.startsWith(out)||!fs.existsSync(f)){r.writeHead(404);r.end('not found');return;}
  r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(f).pipe(r);
}).listen(port,()=>console.log('http://localhost:'+port));
