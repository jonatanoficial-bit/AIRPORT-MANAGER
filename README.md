# Airport Empire Brasil — 0.4.0

Build jogável de desenvolvimento, em português, de gestão aeroportuária. HTML, CSS e JavaScript modular; sem backend, conta ou dependências de execução. Inclui 24 imagens convertidas dos arquivos fornecidos pelo criador. **Ainda não corresponde à totalidade da Bíblia-Mãe nem à arte final AAA.** Veja [cobertura e limitações](docs/coverage.md).

## Jogar no computador

1. Extraia o ZIP inteiro.
2. Com Node.js 20 ou superior instalado, abra o terminal nesta pasta e execute `npm start`.
3. Abra `http://127.0.0.1:4189`. Não abra index.html diretamente por file://: os módulos e JSON precisam de servidor HTTP.

Não há instalação de pacotes. Alternativa: `python -m http.server 4189` nesta pasta.

## Publicar no GitHub Pages

1. O projeto está no repositório AIRPORT-MANAGER, com `index.html` na raiz e `.github/workflows/pages.yml`.
2. Em Settings → Pages, escolha GitHub Actions como origem.
3. Faça push na branch `main` ou execute manualmente o workflow “Testar e publicar no Pages”. Caso use outra branch, ajuste pages.yml.
4. O workflow executa os testes, gera `dist/` e publica. O endereço aparece na execução e em Settings → Pages.

Alternativa sem Actions: publique a raiz pela opção Deploy from a branch. O ZIP já inclui sw.js gerado. Após editar arquivos, execute `npm run build` para renovar o cache offline.

Os caminhos são relativos e suportam publicação em subpasta de repositório. O código-fonte está versionado no GitHub. A URL pública do Pages depende da configuração de GitHub Pages no repositório.

## Primeiro voo

Inicie uma carreira, escolha um aeroporto brasileiro e abra Companhias. Negocie com Azul Linhas Aéreas, aeronave regional ATR e outro destino brasileiro. Comece com três frequências e incentivo de 10%. O primeiro voo chega em 15 minutos simulados. Acompanhe os serviços no mapa ou em Voos. Expanda apenas quando o caixa e a capacidade permitirem. Os custos continuam mesmo sem voos.

Barra inferior: pausa e velocidades 1×, 2×, 4×. O botão “+ 1 hora” avança explicitamente 60 minutos, inclusive quando pausado. Diálogos pausam o relógio enquanto estão abertos. Construções usam coordenadas de grade e zonas; a parcela leste precisa ser comprada.

## Preservar carreiras

Três slots manuais, autosave a cada 30 segundos e backups rotativos em IndexedDB. Em Configurações → Exportar JSON, baixe uma cópia independente. Limpar dados do navegador pode apagar slots locais; o ZIP contém o jogo, não carreiras criadas posteriormente. Importar JSON restaura a sessão, então salve em um slot. Saves pertencem à origem do site: localhost e GitHub Pages têm armazenamentos separados.

## Desenvolvimento

`npm test` executa testes do motor e dos saves. `npm run build` valida dados/imports, gera cache offline e copia arquivos públicos para dist. O service worker instala um conjunto versionado; feche as abas antigas para ativar uma atualização. A primeira visita requer rede e sucesso no cache; depois o jogo pode funcionar offline.

Documentos: [arquitetura](docs/architecture.md), [dados](docs/data-schema.md), [arte](docs/assets.md), [testes](docs/testing.md), [continuidade](docs/roadmap.md), [cobertura](docs/coverage.md).


## Parte 2 — visual e fluxo de jogo

A vista inicial agora destaca o pátio fotográfico, gates clicáveis, voos ativos e uma próxima decisão baseada no estado real. A construção continua no mapa, com catálogo ilustrado e seleção mantida após obras. Equipes, passageiros, companhias e equipamentos recebem imagens próprias. Botões, foco por teclado e layouts compactos foram redesenhados.

Use **Preparar rota** para preencher uma proposta compatível; revise os termos antes de assinar. **+10 min** avança exatamente dez minutos mesmo em pausa. Os requisitos de nível ficam em um painel expansível. Saves de versão 1 permanecem compatíveis. As limitações de simulação da primeira parte continuam documentadas em docs/coverage.md.

Se uma versão antiga permanecer após atualização, feche todas as abas do jogo e reabra. Não limpe dados do navegador para atualizar: isso pode apagar carreiras. O servidor local aceita uma porta alternativa via variável PORT e serve a pasta do próprio script.


## Parte 3 — companhias e operação

O catálogo apresenta Azul, GOL, LATAM e outras companhias reais com logos locais que funcionam offline. São marcas de terceiros usadas para identificação visual em uma simulação independente; contratos, parâmetros e frota foram simplificados para o jogo e não representam acordos reais.

Hangar reduz desgaste; base de combustível e central de catering aceleram as tarefas correspondentes; administração reduz conservação; centro operacional reduz ocupação da pista e tempo de táxi. A descrição de cada efeito aparece no painel de construção. Especializações passam a alterar demanda, carga, receita comercial ou custo. Saves da parte 2 continuam carregáveis.

## Parte 4 — planejamento e logística

A negociação mostra demanda, ocupação, receita bruta diária e pressão estimada sobre gates e serviços antes da assinatura. A carga recebida ocupa o terminal e os armazéns, passa pela triagem ao longo do tempo e só então gera receita; carga sem espaço é recusada e afeta a relação com a companhia.

Na infraestrutura, o jogador pode ativar manutenção preventiva automática para pista e instalações. A automação respeita o caixa e mantém os reparos manuais disponíveis. Os nomes das aeronaves agora usam modelos reais, mantendo os mesmos IDs internos para preservar saves. Carreiras das partes anteriores continuam compatíveis com a versão 1 do formato.

A loja de construção organiza estruturas em cinco categorias. Escolher uma opção não cobra nada: selecione a estrutura, clique no mapa ou use **Encontrar espaço livre**, confira investimento, caixa restante, prazo, zona e benefício, e só então confirme a compra. Posições inválidas aparecem em vermelho com uma explicação direta.
