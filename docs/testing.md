# Validação

Comando: `npm test`, Node.js >=20, sem dependências.

Testes automatizados: dados/estado inicial; três voos pontuais e receita única; JSON com continuação determinística; cancelamento liberando recursos; obra com pagamento único, pausa e conclusão; bloqueios de infraestrutura; falta de equipamento; tempestade; corrupção de save; invariantes de gates/pistas e save por 30 dias simulados.

`npm run build` também valida referências de importação e catálogos antes de preparar a distribuição. Isso não substitui QA de navegador. Não foram executadas inspeção visual ou sessões interativas completas em desktop/mobile; instalação PWA, IndexedDB real e atualização offline ainda precisam dessa verificação.

Roteiro de aceitação pendente: iniciar carreira, contratar rota, acompanhar ciclo no mapa, construir/pausar obra, observar filas, ajustar turnos, exportar/reimportar e comparar caixa, salvar/recarregar todos os slots, testar modo offline após primeira carga, verificar layout em 360/768/1440 px e teclado, confirmar console sem erros em Chrome/Edge/Firefox/Safari. Testar também URL Pages em subpasta e atualização entre duas builds com abas abertas.


## Parte 2 — 15/09/2026

16 testes automatizados aprovados (zero falhas), incluindo sugestão contratável nos 27 aeroportos brasileiros, alertas contextuais e cartões reais de gates/serviços. HTTP agora usa porta dinâmica e compara o conteúdo servido com os arquivos do projeto, evitando falso positivo de outro servidor local.

QA no navegador integrado: menu, criação de carreira, foto do pátio, proposta inicial, contrato com dois voos, avanço de tempo, serviço em gate, salvamento e seleção no catálogo. O navegador revelou e permitiu corrigir caminhos dos fundos CSS e captura incorreta de cliques pela marcação visual no body. Conferência visual desktop concluída; matriz completa mobile/multinavegador e offline em hospedagem continuam pendentes. A confirmação de obra pelo navegador sofreu timeout da ferramenta; cobrança/pausa/conclusão permanecem cobertas pelos testes do motor.


## Parte 3 — 18/09/2026

Testes adicionais cobrem os 14 SVGs locais, nomes únicos, código de voo da Azul, carregamento de saves da parte 2 com frota antiga, efeitos do hangar/administração e redução da ocupação da pista pelo centro operacional. Testes do motor continuam simulando 30 dias e validando o save. QA visual em navegador, mobile e Pages ainda deve ser repetido com a versão publicada.

## Parte 4 — 24/09/2026

26 testes automatizados aprovados. Os cinco novos casos validam nomes reais das aeronaves sem troca de IDs, previsão de rota sem mutação do estado, migração de saves da parte 3, recebimento/processamento/pagamento de carga e manutenção automática de pista e instalações. O build estático também valida sintaxe, imports, catálogos e manifest. A publicação no Pages é verificada após o push; a matriz completa de interação mobile e multinavegador continua pendente.
