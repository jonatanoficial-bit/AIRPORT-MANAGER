# Dados e saves

Cada catálogo é JSON UTF-8. IDs devem ser únicos e estáveis: saves referenciam IDs, não nomes. Não remova IDs já usados sem implementar migração.

| Arquivo | Conteúdo |
|---|---|
| airports.json | id, name, country, uf, codes, demand, tourism, landCost, maxRunways, restrições e perfil |
| aircraft.json | família, porte, assentos, pista mínima, nível, turnaround e carga |
| airlines.json | companhia fictícia, frota por IDs, nível, reputação mínima e sensibilidade a preço |
| buildings.json | custo, duração em minutos, zona, nível, effect/amount, asset e footprint |
| balance.json | caixa, custos, dificuldades, clima, serviços/dependências e requisitos de nível |
| research.json | custo, nível e pré-requisitos |
| events.json | duração, modificador e respostas com custo/fator de duração |
| scenarios.json | cenário, seed, capital e dívida |
| asset-manifest.json | chaves de arte e metadados da imagem fonte |

Edifícios usam atualmente footprint 2×1, rotação 1×2. Alterar footprint JSON sozinho não altera o algoritmo de colisão. Efeitos novos exigem implementação no motor; IDs novos de pesquisa/eventos precisam lógica correspondente. A validação de dados cobre IDs/referências básicas, não todos os erros semânticos.

Save: saveVersion=1; JSON de até 8 MB na importação. Validação de versão, estrutura, números, limites, referências principais, gates, recursos, pesquisas e eventos. Formatos desconhecidos são rejeitados sem substituir a sessão corrente. Backups são procurados quando o slot principal está inválido. A validação reduz corrupção acidental, não é mecanismo antifraude: um jogo local pode ser editado pelo jogador.
