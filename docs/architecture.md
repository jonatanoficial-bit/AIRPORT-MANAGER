# Arquitetura

`js/core/state.js` cria o estado serializável e o RNG LCG. `js/systems/engine.js` avança um minuto por tick; não depende de DOM. Eventos internos usam `eventBus.js`. `js/core/data.js` carrega e valida JSON. `js/core/saveManager.js` valida snapshots e mantém slots IndexedDB. `js/ui/map.js` desenha a grade Canvas. `js/app.js` liga painéis e ações ao motor; `css/game.css` controla apresentação.

Ordem por minuto: relógio, expiração de pista, obras, clima/eventos, voos por prioridade/horário, filas, custos horários, fechamento diário, reputação, contratos e conquistas. Gate é reservado antes do pouso; taxiway tem reserva conservadora única. Receita de voo usa sinalizador paid para evitar cobrança duplicada. Obras cobram na contratação; pausa não cobra novamente.

Estado contém meta/player/airport/world/economy/flights/contracts/airlines/passengersSummary/staff/construction/inventory/buildings/gates/maintenance/reputation/research/events/statistics/settings/resources/tutorial. O RNG e relógio viajam no save. Não se usa Date.now para decisões de simulação; apenas identidade/data de criação.

O servidor local é ferramenta de desenvolvimento e não integra a simulação. O build publica só HTML, manifest, sw, assets, css, data e js. O cache offline é isolado por escopo e hash do conteúdo. Sem chamadas externas de telemetria.
