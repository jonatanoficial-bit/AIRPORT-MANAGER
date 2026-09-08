import {VERSION} from './state.js';
import {STATES} from '../systems/engine.js';
const MAX=8*1024*1024;
export function validateSave(s,data){
 if(!s||typeof s!=='object'||s.saveVersion!==VERSION)throw Error('Versão de save incompatível. Esperado: '+VERSION);
 for(const key of ['meta','player','airport','world','economy','staff','inventory','reputation','statistics','settings','passengersSummary','maintenance','resources'])if(!s[key]||typeof s[key]!=='object'||Array.isArray(s[key]))throw Error('Save incompleto: '+key);
 for(const key of ['flights','gates','buildings','construction','contracts','research','events'])if(!Array.isArray(s[key]))throw Error('Lista inválida: '+key);
 if(!data.airports.some(a=>a.id===s.airport.id))throw Error('Aeroporto do save não instalado.');
 const walk=(v,depth=0)=>{if(depth>30)throw Error('Estrutura excede o limite.');if(typeof v==='number'&&!Number.isFinite(v))throw Error('Número inválido no save.');if(typeof v==='string'&&v.length>10000)throw Error('Texto excede o limite.');if(v&&typeof v==='object')for(const k of Object.keys(v)){if(['__proto__','prototype','constructor'].includes(k))throw Error('Propriedade não permitida.');walk(v[k],depth+1);}};walk(s);
 if(!Number.isFinite(s.economy.cash)||!Number.isInteger(s.world.minute)||s.world.minute<0||!Number.isInteger(s.statistics.nextId))throw Error('Estado financeiro ou relógio inválido.');
 const number=(v,min=0,max=Number.MAX_SAFE_INTEGER)=>{if(!Number.isFinite(v)||v<min||v>max)throw Error('Campo numérico ausente ou fora do limite.');};
 for(const key of ['debt','loanDays','rate','fee','initialCash'])number(s.economy[key]);
 for(const key of ['income','cost','investment'])number(s.economy.today?.[key]);
 number(s.airport.level,1,10);number(s.airport.runwayLength,1000,4000);number(s.airport.land,1,2);number(s.world.weatherUntil);number(s.meta.rng,0,4294967295);
 for(const key of ['completed','cancelled','onTime','nextId','expansions','profitableDays'])number(s.statistics[key]);
 for(const key of ['global','passengers','airlines','punctuality','security','infrastructure','sustainability','reliability','public','maturity'])number(s.reputation[key],0,100);
 for(const key of ['checkin','security','baggage','immigration','customs'])number(s.passengersSummary.queues?.[key]);
 for(const key of ['total','today','wait','satisfaction','connections','missed'])number(s.passengersSummary[key]);
 number(s.maintenance.runway,0,100);number(s.maintenance.closedUntil);
 if(![0,1,2,4].includes(s.settings.speed)||!Array.isArray(s.resources.runways)||!s.airlines||!s.statistics.delayCauses)throw Error('Recursos inválidos.');
 for(const a of data.airlines)number(s.airlines[a.id]?.relationship,0,100);
 if(s.flights.length>2000||s.buildings.length>500||s.gates.length>500||s.construction.length>1000||s.contracts.length>300)throw Error('Quantidade de entidades acima do limite.');
 const unique=a=>new Set(a.map(x=>x.id)).size===a.length;
 if(![s.flights,s.gates,s.buildings,s.contracts,s.construction].every(unique))throw Error('IDs duplicados.');
 for(const b of s.buildings.concat(s.construction))if(!data.buildings.some(d=>d.id===b.type)||!Number.isFinite(b.x)||!Number.isFinite(b.y)||b.x<0||b.x>28||b.y<0||b.y>20)throw Error('Construção inválida.');
 const assigned=new Set();for(const g of s.gates){if(g.flightId){if(assigned.has(g.flightId)||!s.flights.some(f=>f.id===g.flightId&&f.gateId===g.id))throw Error('Reserva de gate inconsistente.');assigned.add(g.flightId);}}
 for(const f of s.flights)if(!data.aircraft.some(p=>p.id===f.aircraftId)||!data.airlines.some(a=>a.id===f.airlineId)||!f.schedule||!f.tasks||!f.delays||!Number.isFinite(f.passengers))throw Error('Voo inválido.');
 for(const f of s.flights){if(!STATES[f.state]||!data.airports.some(a=>a.id===f.destination)||!s.contracts.some(c=>c.id===f.contractId))throw Error('Referência de voo inválida.');number(f.since);number(f.schedule.arrival);number(f.schedule.departure);number(f.tonnes);number(f.passengers);number(f.priority,0,1);if(f.state==='TURNAROUND')for(const t of data.balance.services)number(f.tasks[t.id]);}
 for(const c of s.contracts){if(!data.airlines.some(a=>a.id===c.airlineId&&a.fleet.includes(c.aircraftId))||!data.airports.some(a=>a.id===c.destination)||!['ACTIVE','CANCELLED','RENEWAL_PENDING','EXPIRED','ACCEPTED'].includes(c.status)||!Array.isArray(c.history))throw Error('Contrato inválido.');number(c.frequency,1,8);number(c.hour,0,23);number(c.discount,0,40);number(c.start);number(c.end);number(c.lastScheduled,-1);}
 for(const g of s.gates){number(g.class,1,4);number(g.x,0,28);number(g.y,0,20);}
 for(const b of s.buildings)number(b.condition,0,100);
 for(const c of s.construction){if(!['PLANNED','FUNDED','BUILDING','PAUSED','COMPLETED','ACTIVE','CANCELLED'].includes(c.state))throw Error('Estado de obra inválido.');number(c.duration,1);number(c.progress,0,c.duration);number(c.cost);}
 for(const r of s.resources.runways){number(r.until);if(!s.flights.some(f=>f.id===r.flightId))throw Error('Reserva de pista inválida.');}
 if(s.resources.taxi!==null&&!s.flights.some(f=>f.id===s.resources.taxi))throw Error('Reserva de táxi inválida.');
 if(s.research.some(id=>!data.research.some(r=>r.id===id)))throw Error('Pesquisa desconhecida.');
 for(const e of s.events){if(!data.events.some(d=>d.id===e.id)||!Array.isArray(e.choices))throw Error('Evento desconhecido.');number(e.until);for(const c of e.choices){number(c.cost);number(c.factor,0,1);}}
 for(const id of ['service','security','clean','baggage','maintenance','operations','fire','admin']){const g=s.staff[id];if(!g||!Number.isInteger(g.count)||g.count<0||g.count>80||!Array.isArray(g.shifts)||g.shifts.length!==4||!g.shifts.every(n=>Number.isFinite(n)&&n>=0&&n<=1))throw Error('Equipe inválida.');}
 for(const id of ['stairs','bus','baggage','fuel','gpu','clean','catering','pushback'])if(!s.inventory[id]||!Number.isInteger(s.inventory[id].count)||s.inventory[id].count<0)throw Error('Frota de solo inválida.');
 for(const g of Object.values(s.staff)){number(g.training,.1,1.5);number(g.morale,0,100);number(g.fatigue,0,100);}
 for(const e of Object.values(s.inventory))number(e.condition,0,100);
 if(!data.balance.difficulty[s.settings.difficulty]||!data.balance.weather[s.world.weather])throw Error('Configuração inválida.');
 if(!Array.isArray(s.statistics.log)||!Array.isArray(s.statistics.achievements)||!Array.isArray(s.economy.ledger)||!Array.isArray(s.economy.history))throw Error('Histórico inválido.');
 s.player.name=String(s.player.name||'Administrador').slice(0,60);s.player.company=String(s.player.company||'Aeroportos').slice(0,80);return s;
}
export function parseSave(text,data){if(text.length>MAX)throw Error('Arquivo maior que 8 MB.');return validateSave(JSON.parse(text),data);}
export class SaveManager {
 constructor(data){this.data=data;this.db=null;this.last='';}
 async init(){this.db=await new Promise((resolve,reject)=>{const r=indexedDB.open('airport-empire-brasil',1);r.onupgradeneeded=()=>r.result.createObjectStore('saves');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(Error('Não foi possível abrir o armazenamento. Use exportação JSON.'));});return this;}
 async get(key){return new Promise((resolve,reject)=>{const r=this.db.transaction('saves').objectStore('saves').get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
 async put(key,value){return new Promise((resolve,reject)=>{const t=this.db.transaction('saves','readwrite');t.objectStore('saves').put(value,key);t.oncomplete=resolve;t.onerror=()=>reject(t.error);});}
 async save(state,slot='manual-1'){const snapshot=structuredClone(state);validateSave(snapshot,this.data);const old=await this.get(slot);if(old){try{parseSave(old,this.data);await this.put(slot+'-backup',old);}catch{/* preserve existing backups */}}if(slot==='auto'){const prior=await this.get('auto-1');if(prior)await this.put('auto-2',prior);const latest=await this.get('auto');if(latest)await this.put('auto-1',latest);}await this.put(slot,JSON.stringify(snapshot));this.last=new Date().toLocaleTimeString('pt-BR');}
 async load(slot='manual-1'){let error;const keys=slot==='auto'?['auto','auto-1','auto-2','auto-backup']:[slot,slot+'-backup'];for(const key of keys){const text=await this.get(key);if(!text)continue;try{return parseSave(text,this.data);}catch(e){error=e;}}throw error||Error('Este slot ainda está vazio.');}
}
