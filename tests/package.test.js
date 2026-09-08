import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
async function walk(dir){const result=[];for(const e of await readdir(path.join(root,dir),{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())result.push(...await walk(p));else result.push(p);}return result;}
test('todos os módulos têm sintaxe válida',async()=>{for(const file of await walk('js')){if(!file.endsWith('.js'))continue;const p=spawnSync(process.execPath,['--check',file],{cwd:root,encoding:'utf8'});assert.equal(p.status,0,p.stderr);}});
test('manifest aponta para imagens existentes',async()=>{const manifest=JSON.parse(await readFile(path.join(root,'data/asset-manifest.json'),'utf8'));for(const item of Object.values(manifest)){assert.ok(item.path);assert.ok((await readFile(path.join(root,item.path))).length>0);}});
test('servidor responde HTML, CSS, módulos e todos os catálogos',async()=>{const child=spawn(process.execPath,['serve.js'],{cwd:root,stdio:['ignore','pipe','pipe']});try{await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Servidor não iniciou')),10000);child.stdout.once('data',()=>{clearTimeout(timeout);resolve();});child.once('error',reject);child.once('exit',code=>{clearTimeout(timeout);reject(Error('Servidor encerrou: '+code));});});for(const file of ['index.html','css/game.css',...(await walk('js')),...(await walk('data'))]){const response=await fetch('http://127.0.0.1:4173/'+file);assert.equal(response.status,200,file);assert.ok((await response.text()).length>0);}const response=await fetch('http://127.0.0.1:4173/ausente.json');assert.equal(response.status,404);}finally{child.kill();}});
