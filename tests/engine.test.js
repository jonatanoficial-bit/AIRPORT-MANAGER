import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState} from '../js/core/state.js';
import {Engine,FINAL} from '../js/systems/engine.js';
import {validateData} from '../js/core/data.js';
import {parseSave,validateSave} from '../js/core/saveManager.js';
const d=Object.fromEntries(['airports','aircraft','airlines','buildings','balance','research','events','scenarios'].map(k=>[k,JSON.parse(readFileSync(new URL('../data/'+k+'.json',import.meta.url)))]));
function setup(){const s=createState(d);s.world.weatherUntil=100000;return new Engine(d,s);}
function route(e){return e.contract({airlineId:'aurora',aircraftId:'atr',destination:d.airports.find(a=>a.id!==e.s.airport.id&&a.country==='Brasil').id,frequency:3,hour:8,discount:10});}
test('bases e estado inicial válidos',()=>{validateData(d);validateSave(setup().s,d);});
test('rota conclui voos, libera recursos e paga uma única vez',()=>{const e=setup();route(e);e.tick(600);assert.ok(e.s.statistics.completed>=3);assert.ok(e.s.statistics.onTime>=3);assert.ok(e.s.gates.every(g=>!g.flightId));assert.equal(e.s.resources.taxi,null);const f=e.s.flights.find(f=>f.paid),cash=e.s.economy.cash;e.depart(f);assert.equal(e.s.economy.cash,cash);assert.equal(e.s.statistics.completed,3);});
test('retomada JSON conserva resultado determinístico',()=>{const e=setup();route(e);e.tick(40);const resumed=new Engine(d,parseSave(JSON.stringify(e.s),d));e.tick(2000);resumed.tick(2000);assert.deepEqual(resumed.s,e.s);});
test('cancelamento libera gate, pista e táxi',()=>{const e=setup();route(e);while(!e.s.gates.some(g=>g.flightId))e.tick();const f=e.s.flights.find(f=>f.gateId);e.cancelFlight(f.id);assert.ok(e.s.gates.every(g=>g.flightId!==f.id));assert.ok(e.s.resources.runways.every(r=>r.flightId!==f.id));assert.notEqual(e.s.resources.taxi,f.id);assert.equal(f.state,'CANCELLED');});
test('obra cobra uma vez, pausa e ativa sem duplicar',()=>{const e=setup(),cash=e.s.economy.cash;e.build('gate',14,6);const c=e.s.construction[0],after=e.s.economy.cash;assert.ok(after<cash);e.constructionAction(c.id,'pause');e.tick(10);assert.equal(c.progress,0);e.constructionAction(c.id,'pause');e.tick(c.duration+10);assert.equal(e.s.buildings.filter(b=>b.id===c.id).length,1);assert.equal(e.s.gates.length,3);assert.equal(e.s.economy.ledger.filter(x=>x.category==='Obras').length,1);assert.throws(()=>e.build('gate',14,6));});
test('aeronave grande e rota internacional exigem infraestrutura',()=>{const e=setup();assert.ok(e.requirements('atlantica','a330',d.airports.find(a=>a.country!=='Brasil').id).length>=3);});
test('falta de equipamento impede serviço e provoca atraso',()=>{const e=setup();e.s.inventory.fuel.count=0;route(e);e.tick(200);assert.equal(e.s.statistics.completed,0);assert.ok(e.s.flights.some(f=>Object.keys(f.delays).some(x=>x.startsWith('Equipamento:'))));});
test('tempestade fecha rampa e pista',()=>{const e=setup();e.s.world.weather=d.balance.weather.findIndex(w=>w.ramp===0);assert.ok(e.s.world.weather>=0);route(e);e.tick(100);assert.equal(e.s.statistics.completed,0);assert.ok(e.s.flights.some(f=>f.delays['Clima / pista fechada']>0));});
test('save rejeita corrupção básica',()=>{const e=setup();for(const mutate of [s=>s.saveVersion=999,s=>s.economy.cash=NaN,s=>s.staff.service.count=-1,s=>s.gates.push({...s.gates[0]})]){const s=structuredClone(e.s);mutate(s);assert.throws(()=>validateSave(s,d));}assert.throws(()=>parseSave('{',d));});
test('30 dias preservam invariantes e save',()=>{const e=setup();route(e);for(let i=0;i<30*24;i++){e.tick(60);const occupied=e.s.gates.map(g=>g.flightId).filter(Boolean);assert.equal(new Set(occupied).size,occupied.length);assert.ok(e.s.resources.runways.length<=1+e.count('runway'));assert.ok(e.s.flights.filter(f=>FINAL.includes(f.state)).every(f=>!occupied.includes(f.id)));validateSave(structuredClone(e.s),d);}assert.ok(Number.isFinite(e.s.economy.cash));assert.ok(e.s.economy.history.length>=29);});
