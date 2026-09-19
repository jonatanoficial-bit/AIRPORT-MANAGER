import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState} from '../js/core/state.js';
import {validateSave,parseSave} from '../js/core/saveManager.js';
import {Engine} from '../js/systems/engine.js';

const d=Object.fromEntries(['airports','aircraft','airlines','buildings','balance','research','events','scenarios'].map(k=>[k,JSON.parse(readFileSync(new URL('../data/'+k+'.json',import.meta.url)))]));
const engine=()=>new Engine(d,createState(d));
const add=(e,type)=>e.s.buildings.push({id:type+'-test',type,x:18,y:15,rotation:0,condition:100});

test('marcas reais têm arquivo SVG local e nomes distintos',()=>{
 const names=new Set(d.airlines.map(a=>a.name));
 assert.equal(names.size,d.airlines.length);
 for(const name of ['Azul Linhas Aéreas','GOL Linhas Aéreas','LATAM Airlines','Emirates','Lufthansa'])assert.ok(names.has(name));
 for(const a of d.airlines){const svg=readFileSync(new URL('../'+a.logo,import.meta.url),'utf8');assert.match(svg,/<svg\b/);assert.doesNotMatch(svg,/<script\b/i);}
});

test('companhia usa código real no novo voo',()=>{
 const e=engine(),destination=d.airports.find(a=>a.id!==e.s.airport.id&&a.country==='Brasil').id;
 e.contract({airlineId:'aurora',aircraftId:'atr',destination,frequency:1,hour:8,discount:10});
 assert.match(e.s.flights[0].code,/^AD\d+/);
});

test('save da parte 2 aceita companhias novas sem perder contrato anterior',()=>{
 const e=engine(),destination=d.airports.find(a=>a.id!==e.s.airport.id).id;
 for(const a of d.airlines.slice(7))delete e.s.airlines[a.id];
 e.s.contracts.push({id:'contract-old',airlineId:'brisa',aircraftId:'ej',destination,frequency:1,hour:8,discount:10,status:'ACTIVE',start:360,end:3000,lastScheduled:0,history:[],growth:false});
 const restored=parseSave(JSON.stringify(e.s),d);
 assert.equal(restored.contracts[0].aircraftId,'ej');
 assert.equal(restored.airlines.delta.relationship,60);
 validateSave(restored,d);
});

test('hangar e administração mudam desgaste e conservação',()=>{
 const baseline=engine(),improved=engine();add(baseline,'toilet');add(baseline,'shop');add(improved,'hangar');add(improved,'admin');
 baseline.hour();improved.hour();
 assert.ok(improved.s.maintenance.runway>baseline.s.maintenance.runway);
 const baseUpkeep=-baseline.s.economy.ledger.find(x=>x.note==='Conservação e frota').amount;
 const newUpkeep=-improved.s.economy.ledger.find(x=>x.note==='Conservação e frota').amount;
 assert.ok(newUpkeep<baseUpkeep);
});

test('centro operacional reduz ocupação da pista',()=>{
 const normal=engine(),controlled=engine();add(controlled,'control');
 const dummy={id:'test-flight',delays:{}};
 assert.ok(normal.runway(dummy));assert.ok(controlled.runway(dummy));
 assert.ok(controlled.s.resources.runways[0].until<normal.s.resources.runways[0].until);
});
