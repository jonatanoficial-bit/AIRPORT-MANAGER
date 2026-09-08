# Cobertura da Bíblia-Mãe — build 0.1.0

Esta entrega é uma base jogável; não é a implementação integral das 52 páginas. Não há alegação de simulação aeronáutica certificada ou reprodução geográfica fiel.

| Área | Situação nesta build |
|---|---|
| Stack e entrega | HTML/CSS/JS modular, JSON, ZIP, workflow Pages e cache offline |
| Carreira | Nome, companhia, avatar, aeroporto, dificuldade, capital e quatro cenários |
| Aeroportos | 27 brasileiros e 36 globais conceituais; nomes e parâmetros distintos, mesma grade básica; globais com códigos internos fictícios |
| Voos | Máquina de estados, gate compatível reservado, pistas e taxiway exclusivos, atraso, cancelamento e desvio |
| Turnaround | Serviços com dependências, equipe, desgaste e equipamentos limitados; sem deslocamento físico individual dos veículos |
| Passageiros | Filas agregadas de check-in, segurança, bagagem, imigração e alfândega; satisfação e conexões simplificadas; não há agentes individuais |
| Construção | Grade, zonas, rotação, colisão, custo, duração, pausa, cancelamento e expansão de terreno |
| Rede física | Conexões operacionais presumidas pela zona; não há grafo construível, pathfinding ou validação de acessibilidade física |
| Equipes | Oito categorias, contratação, treinamento, disponibilidade por turno, moral, fadiga e salários agregados |
| Economia | Caixa, tarifas, receitas de voos/comércio/estacionamento, custos, multas, dívida e histórico diário |
| Companhias | Sete fictícias; requisitos, incentivo, aceitação/contraproposta calculada, renovação, crescimento e abandono |
| Progressão | Níveis 1–10 com requisitos e conquistas; balanceamento de campanha inteira ainda precisa playtest |
| Clima e eventos | Sete condições e cinco incidentes, efeitos de pista/rampa/equipe/bagagem; clima sorteado não usa perfil regional completo |
| Pesquisa | Nove melhorias instantâneas mediante custo; sem fila temporal de laboratório |
| Carga | Quantidade agregada e receita; sem cadeia logística/armazenamento detalhado |
| Especializações | Seleção registrada, turismo afeta demanda; demais objetivos ainda sem mecânicas exclusivas completas |
| Edifícios | Capacidade, gates, comércio, conforto, energia e segurança afetam operação; hangar, administração, controle e bases de combustível/catering ainda não têm toda a função específica prevista |
| Interface | Menu, carreira e 14 vistas de gestão; mapa vetorial tático, retratos/fotos fornecidos, layout responsivo |
| Arte e áudio | 24 fotos WebP, ícone e vetores provisórios; sem sprites finais, malhas ou trilha; áudio limitado a aviso sintetizado |
| Saves | IndexedDB, três slots, autosaves/backups, export/import validado; primeira versão, sem migração de formatos anteriores |
| Testes | Motor determinístico e invariantes automatizados; sem QA visual/interativo completo em navegadores ou dispositivos |

Outras simplificações: escala única para plantas de aeroportos, uma taxiway lógica compartilhada, ocupação visual de filas aproximada, segmentos de passageiros percentuais, primeira frequência contratada chega em 15 minutos independentemente da hora escolhida (dias seguintes seguem a hora), sem integração de dados externos, multiplayer, editor de rotas físicas, demolição/relocalização ou integração com serviços reais. Constantes e textos ainda parcialmente no código. O evento de feriado aumenta a demanda programada em 20%, ainda sujeito a balanceamento.
