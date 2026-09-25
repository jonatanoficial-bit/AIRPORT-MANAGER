import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState} from '../js/core/state.js';
import {parseSave} from '../js/core/saveManager.js';
import {Engine} from '../js/systems/engine.js';

const d=Object.fromEntries(['airports','aircraft','airlines','buildings','balance','research','events','scenarios'].map(k=>[k,JSON.parse(readFileSync(new URL('../data/'+k+'.json',import.meta.url)))]));
const engine=()=>new Engine(d,createState(d));
const building=(type,id=type+'-part4')=>({id,type,x:20,y:16,rotation:0,condition:100});

test('aeronaves exibem modelos reais sem alterar IDs dos saves',()=>{
 const models=Object.fromEntries(d.aircraft.map(a=>[a.id,a.name]));
 assert.equal(models.atr,'ATR 72-600');
 assert.equal(models.ej,'Embraer E190-E2');
 assert.equal(models.a320,'Airbus A320neo');
 assert.equal(models.b737,'Boeing 737 MAX 8');
 assert.equal(models.b787,'Boeing 787-9');
 assert.equal(models.cargo,'Boeing 767-300F');
});

test('previsão de rota calcula demanda, receita e pressão sem alterar a carreira',()=>{
 const e=engine(),before=structuredClone(e.s);
 const destination=d.airports.find(a=>a.id!==e.s.airport.id&&a.country===e.airport().country).id;
 const result=e.routeForecast({airlineId:'aurora',aircraftId:'atr',destination,frequency:2,hour:8,discount:10});
 assert.ok(result.occupancy>=.2&&result.occupancy<=.98);
 assert.ok(result.pax>0);
 assert.ok(result.revenuePerFlight>0);
 assert.equal(result.dailyRevenue,result.revenuePerFlight*2);
 assert.ok(['Baixo','Moderado','Alto'].includes(result.risk));
 assert.deepEqual(e.s,before);
});

test('save da parte 3 recebe carga e automações sem perder progresso',()=>{
 const e=engine();
 e.s.economy.cash=765432;
 delete e.s.cargoSummary;
 delete e.s.maintenance.autoRunway;
 delete e.s.maintenance.autoFacilities;
 const restored=parseSave(JSON.stringify(e.s),d);
 assert.equal(restored.economy.cash,765432);
 assert.deepEqual(restored.cargoSummary,{stored:0,accepted:0,processed:0,rejected:0,today:0,revenue:0,pendingRevenue:0});
 assert.equal(restored.maintenance.autoRunway,false);
 assert.equal(restored.maintenance.autoFacilities,false);
});

test('carga ocupa armazém, é processada e paga receita logística',()=>{
 const e=engine();
 e.s.buildings.push(building('cargo'));
 const flight={id:'cargo-flight',code:'M3001',contractId:'cargo-contract',airlineId:'cargo',aircraftId:'cargo',destination:d.airports.find(a=>a.id!==e.s.airport.id).id,international:false,schedule:{arrival:360,departure:500},state:'AT_GATE',since:360,gateId:'gate-1',passengers:0,occupancy:1,tonnes:35,delays:{},tasks:{},arrivalsProcessed:false,paid:false,priority:0};
 e.s.flights.push(flight);
 e.flightTick(flight,{});
 assert.equal(e.s.cargoSummary.accepted,35);
 assert.equal(e.s.cargoSummary.stored,35);
 for(let i=0;i<60;i++){e.s.world.minute++;e.cargo();}
 assert.ok(e.s.cargoSummary.processed>0);
 assert.ok(e.s.cargoSummary.stored<35);
 assert.ok(e.s.cargoSummary.revenue>0);
 assert.ok(e.s.economy.ledger.some(row=>row.category==='Carga'));
});

test('manutenção automática respeita limites e caixa disponível',()=>{
 const e=engine();
 e.s.buildings.push(building('shop','shop-auto'));
 e.s.maintenance.runway=50;
 e.s.maintenance.autoRunway=true;
 e.s.maintenance.autoFacilities=true;
 e.s.buildings.find(b=>b.id==='shop-auto').condition=40;
 e.automaticMaintenance();
 assert.equal(e.s.maintenance.runway,100);
 assert.equal(e.s.buildings.find(b=>b.id==='shop-auto').condition,100);
 assert.ok(e.s.maintenance.closedUntil>e.s.world.minute);
 assert.ok(e.s.economy.ledger.filter(row=>row.category==='Manutenção').length>=2);
});

test('assistente de construção encontra local válido sem cobrar antes da confirmação',()=>{
 const e=engine(),cash=e.s.economy.cash;
 const spot=e.findBuildSpot('gate');
 assert.ok(spot);
 assert.equal(e.buildReason('gate',spot.x,spot.y,spot.rotation),'');
 assert.equal(e.s.economy.cash,cash);
 e.build('gate',spot.x,spot.y,spot.rotation);
 assert.ok(e.s.economy.cash<cash);
 assert.equal(e.s.construction.length,1);
});
