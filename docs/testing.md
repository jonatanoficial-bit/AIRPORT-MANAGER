# Validação

Comando: `npm test`, Node.js >=20, sem dependências.

Testes automatizados: dados/estado inicial; três voos pontuais e receita única; JSON com continuação determinística; cancelamento liberando recursos; obra com pagamento único, pausa e conclusão; bloqueios de infraestrutura; falta de equipamento; tempestade; corrupção de save; invariantes de gates/pistas e save por 30 dias simulados.

`npm run build` também valida referências de importação e catálogos antes de preparar a distribuição. Isso não substitui QA de navegador. Não foram executadas inspeção visual ou sessões interativas completas em desktop/mobile; instalação PWA, IndexedDB real e atualização offline ainda precisam dessa verificação.

Roteiro de aceitação pendente: iniciar carreira, contratar rota, acompanhar ciclo no mapa, construir/pausar obra, observar filas, ajustar turnos, exportar/reimportar e comparar caixa, salvar/recarregar todos os slots, testar modo offline após primeira carga, verificar layout em 360/768/1440 px e teclado, confirmar console sem erros em Chrome/Edge/Firefox/Safari. Testar também URL Pages em subpasta e atualização entre duas builds com abas abertas.
