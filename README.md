# Airport Empire Brasil — 0.1.0

Build jogável de desenvolvimento, em português, de gestão aeroportuária. HTML, CSS e JavaScript modular; sem backend, conta ou dependências de execução. Inclui 24 imagens convertidas dos arquivos fornecidos pelo criador. **Ainda não corresponde à totalidade da Bíblia-Mãe nem à arte final AAA.** Veja [cobertura e limitações](docs/coverage.md).

## Jogar no computador

1. Extraia o ZIP inteiro.
2. Com Node.js 20 ou superior instalado, abra o terminal nesta pasta e execute `npm start`.
3. Abra `http://127.0.0.1:4173`. Não abra index.html diretamente por file://: os módulos e JSON precisam de servidor HTTP.

Não há instalação de pacotes. Alternativa: `python -m http.server 4173` nesta pasta.

## Publicar no GitHub Pages

1. Crie um repositório e envie o conteúdo extraído, com `index.html` na raiz e incluindo `.github/workflows/pages.yml`.
2. Em Settings → Pages, escolha GitHub Actions como origem.
3. Faça push na branch `main` ou execute manualmente o workflow “Testar e publicar no Pages”. Caso use outra branch, ajuste pages.yml.
4. O workflow executa os testes, gera `dist/` e publica. O endereço aparece na execução e em Settings → Pages.

Alternativa sem Actions: publique a raiz pela opção Deploy from a branch. O ZIP já inclui sw.js gerado. Após editar arquivos, execute `npm run build` para renovar o cache offline.

Os caminhos são relativos e suportam publicação em subpasta de repositório. Nenhuma publicação foi feita automaticamente durante a criação deste pacote.

## Primeiro voo

Inicie uma carreira, escolha um aeroporto brasileiro e abra Companhias. Negocie com Aurora Regional, aeronave regional ATR e outro destino brasileiro. Comece com três frequências e incentivo de 10%. O primeiro voo chega em 15 minutos simulados. Acompanhe os serviços no mapa ou em Voos. Expanda apenas quando o caixa e a capacidade permitirem. Os custos continuam mesmo sem voos.

Barra inferior: pausa e velocidades 1×, 2×, 4×. O botão “+ 1 hora” avança explicitamente 60 minutos, inclusive quando pausado. Diálogos pausam o relógio enquanto estão abertos. Construções usam coordenadas de grade e zonas; a parcela leste precisa ser comprada.

## Preservar carreiras

Três slots manuais, autosave a cada 30 segundos e backups rotativos em IndexedDB. Em Configurações → Exportar JSON, baixe uma cópia independente. Limpar dados do navegador pode apagar slots locais; o ZIP contém o jogo, não carreiras criadas posteriormente. Importar JSON restaura a sessão, então salve em um slot. Saves pertencem à origem do site: localhost e GitHub Pages têm armazenamentos separados.

## Desenvolvimento

`npm test` executa testes do motor e dos saves. `npm run build` valida dados/imports, gera cache offline e copia arquivos públicos para dist. O service worker instala um conjunto versionado; feche as abas antigas para ativar uma atualização. A primeira visita requer rede e sucesso no cache; depois o jogo pode funcionar offline.

Documentos: [arquitetura](docs/architecture.md), [dados](docs/data-schema.md), [arte](docs/assets.md), [testes](docs/testing.md), [continuidade](docs/roadmap.md), [cobertura](docs/coverage.md).
