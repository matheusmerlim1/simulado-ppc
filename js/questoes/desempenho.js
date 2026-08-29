/* ─── Desempenho e Escalabilidade ───────────────────────────
   P2 · 16 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"ds01", mod:"desempenho", dif:"facil", tipo:"mc",
  fonte:"Slides · Projeto e Análise",
  enunciado:"Como se calculam o <b>ganho (speedup)</b> e a <b>eficiência</b> de um programa paralelo?",
  opcoes:[
    "S = T<sub>serial</sub> / T<sub>paralelo</sub> &nbsp;e&nbsp; E = S / p, onde p é o número de processadores.",
    "S = T<sub>paralelo</sub> / T<sub>serial</sub> &nbsp;e&nbsp; E = S &times; p.",
    "S = T<sub>serial</sub> &minus; T<sub>paralelo</sub> &nbsp;e&nbsp; E = S / T<sub>serial</sub>.",
    "S = p / T<sub>paralelo</sub> &nbsp;e&nbsp; E = p &times; S."
  ],
  correta:0,
  gabarito:"O <b>ganho</b> diz quantas vezes o programa ficou mais rápido; a <b>eficiência</b> diz o quanto de cada processador está sendo realmente aproveitado. Se S = 4 com p = 4, então E = 1 (100%, ganho linear — o caso ideal). Se S = 2 com p = 4, então E = 0,5: metade da capacidade se perde em <i>overhead</i>. Detalhe importante para o Trabalho: T<sub>serial</sub> é o tempo do <b>melhor algoritmo serial</b>, e não o tempo do programa paralelo rodando com 1 thread."
},
{
  id:"ds02", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Lei de Amdahl",
  enunciado:"Um programa tem 90% do seu tempo paralelizável e 10% inerentemente serial. Pela <b>Lei de Amdahl</b>, qual é o ganho máximo, mesmo com infinitos processadores?",
  opcoes:[
    "<b>10&times;</b> — o limite é 1/(fração serial) = 1/0,1.",
    "Ilimitado, desde que se use processadores suficientes.",
    "90&times;, um por ponto percentual paralelizável.",
    "1,9&times;, pela soma das duas frações."
  ],
  correta:0,
  gabarito:"A Lei de Amdahl: <b>S(p) = 1 / [ (1&minus;P) + P/p ]</b>, com P a fração paralelizável. Quando p &rarr; &infin;, o termo P/p some e sobra S = 1/(1&minus;P) = 1/0,1 = <b>10</b>. Ou seja: mesmo com um milhão de núcleos, aqueles 10% seriais continuam custando 10% do tempo original. A mensagem é dura — <b>a parte serial é o teto</b>, e otimizá-la costuma render mais que aumentar p."
},
{
  id:"ds03", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Lei de Gustafson",
  enunciado:"Qual é a diferença fundamental entre a <b>Lei de Amdahl</b> e a <b>Lei de Gustafson</b>?",
  opcoes:[
    "Amdahl mantém o <b>tamanho do problema fixo</b> e pergunta quanto mais rápido ele fica; Gustafson mantém o <b>tempo fixo</b> e pergunta quanto maior pode ser o problema resolvido — por isso Gustafson prevê ganho aproximadamente linear.",
    "Amdahl vale para memória compartilhada e Gustafson para memória distribuída.",
    "Amdahl considera o overhead de comunicação e Gustafson o ignora.",
    "São a mesma lei, escritas de formas algebricamente equivalentes."
  ],
  correta:0,
  gabarito:"É uma diferença de <b>pergunta</b>, não de matemática. Amdahl (<i>strong scaling</i>) fixa o problema: a parte serial vira um teto intransponível. Gustafson (<i>weak scaling</i>) observa que, na prática, quem ganha mais processadores usa-os para resolver problemas <b>maiores</b> — e como a parte paralela normalmente cresce com o tamanho do problema enquanto a serial permanece quase constante, a <b>fração serial encolhe</b> e o ganho se aproxima do linear: <b>S(p) = p &minus; &alpha;(p&minus;1)</b>, com &alpha; a fração serial. Simulação climática e treinamento de redes neurais são casos típicos de Gustafson."
},
{
  id:"ds04", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Escalabilidade",
  enunciado:"Qual é a diferença entre escalabilidade <b>forte</b> e <b>fraca</b>?",
  opcoes:[
    "Forte: a eficiência se mantém quando aumentamos p com o <b>tamanho do problema fixo</b>. Fraca: a eficiência se mantém quando aumentamos p <b>e</b> o tamanho do problema na mesma proporção.",
    "Forte: o programa roda em memória compartilhada. Fraca: roda em memória distribuída.",
    "Forte: o ganho é superlinear. Fraca: o ganho é sublinear.",
    "Forte: usa mais de 4 threads. Fraca: usa até 4 threads."
  ],
  correta:0,
  gabarito:"Escalabilidade <b>forte</b> é uma exigência dura: dobrar p com a mesma entrada e manter a eficiência significa que o <i>overhead</i> praticamente não cresce. Poucos programas conseguem. Escalabilidade <b>fraca</b> é mais comum e ainda muito útil: se você pode dobrar o problema quando dobra os processadores, a máquina maior resolve o problema maior no mesmo tempo. É exatamente o que o roteiro do Trabalho pede para avaliar: <i>&ldquo;um programa fortemente escalável mantém a mesma eficiência quando os recursos computacionais aumentam&rdquo;</i>."
},
{
  id:"ds05", mod:"desempenho", dif:"dificil", tipo:"mc",
  fonte:"Lab · Projeto e Análise, Q1",
  enunciado:"Seja T<sub>serial</sub> = n<sup>2</sup> e T<sub>paralelo</sub> = n<sup>2</sup>/p + log<sub>2</sub>(p). O que acontece com ganho e eficiência quando <b>p aumenta e n fica fixo</b>? E quando <b>p fica fixo e n aumenta</b>?",
  opcoes:[
    "Com n fixo e p crescendo, o ganho cresce cada vez menos e a <b>eficiência cai</b> (o termo log<sub>2</sub>p passa a dominar). Com p fixo e n crescendo, a <b>eficiência aumenta</b> e tende a 1.",
    "Nos dois casos a eficiência aumenta.",
    "Nos dois casos a eficiência cai.",
    "Com n fixo e p crescendo a eficiência aumenta; com p fixo e n crescendo ela cai."
  ],
  correta:0,
  gabarito:"Substituindo nas fórmulas: <b>E = T<sub>serial</sub> / (p &times; T<sub>paralelo</sub>) = n<sup>2</sup> / (n<sup>2</sup> + p&middot;log<sub>2</sub>p)</b>.<br><br><b>n fixo, p &uarr;:</b> o numerador não muda e o denominador cresce com <i>p</i>&middot;log<sub>2</sub><i>p</i> &rarr; <b>E cai</b>. Faz sentido: o trabalho útil por processador diminui enquanto o custo de coordenação cresce. Com n = 10 e p = 128, o <i>overhead</i> já supera o cálculo.<br><br><b>p fixo, n &uarr;:</b> o n<sup>2</sup> cresce muito mais rápido que a constante <i>p</i>&middot;log<sub>2</sub><i>p</i> &rarr; <b>E &rarr; 1</b>. O <i>overhead</i> vira ruído diante do cálculo.<br><br>Este exercício <b>é</b> a definição prática de escalabilidade fraca: para manter E constante ao aumentar p, é preciso aumentar n junto."
},
{
  id:"ds06", mod:"desempenho", dif:"dificil", tipo:"mc",
  fonte:"Lab · Projeto e Análise, Q4",
  enunciado:"Duas implementações de um programa paralelo com 4 threads têm os tempos abaixo (em segundos). Qual é a mais rápida e qual é a mais balanceada?",
  tabela:"<div class='tabela-wrap'><table class='dados'><tr><th></th><th>Implementação A</th><th>Implementação B</th></tr><tr><th>Thread 0</th><td>4</td><td>1</td></tr><tr><th>Thread 1</th><td>3</td><td>8</td></tr><tr><th>Thread 2</th><td>7</td><td>4</td></tr><tr><th>Thread 3</th><td>5</td><td>6</td></tr><tr><th>Soma</th><td>19</td><td>19</td></tr></table></div>",
  opcoes:[
    "A é mais rápida (7 s contra 8 s) e também mais balanceada: fator média/máximo = 4,75/7 &asymp; 0,68 contra 4,75/8 &asymp; 0,59.",
    "B é mais rápida, porque tem a thread que termina mais cedo (1 s).",
    "As duas levam o mesmo tempo, já que a soma dos tempos é 19 s nas duas.",
    "A é mais rápida, mas B é mais balanceada."
  ],
  correta:0,
  gabarito:"O erro clássico é somar os tempos. Num programa paralelo com <i>join</i> ao final, <b>o tempo total é o da thread mais lenta</b>: A leva <b>7 s</b> e B leva <b>8 s</b>.<br><br><b>Fator de balanceamento</b> = tempo médio / tempo máximo (1 = perfeito):<br>&bull; A: média = 19/4 = 4,75 &rarr; 4,75/7 = <b>0,68</b><br>&bull; B: média = 19/4 = 4,75 &rarr; 4,75/8 = <b>0,59</b><br><br>Equivalentemente, pelo <i>desbalanceamento</i> (máximo/média, sendo 1 o ideal): A = 1,47 e B = 1,68. Por qualquer das medidas, <b>A vence nos dois critérios</b>. O tempo ocioso total (&sum;(máx &minus; t<sub>i</sub>)) é 9 s em A e 13 s em B — trabalho de processador jogado fora."
},
{
  id:"ds07", mod:"desempenho", dif:"dificil", tipo:"mc",
  fonte:"Lab · Projeto e Análise, Q5",
  enunciado:"Com T<sub>serial</sub> = n e T<sub>paralelo</sub> = n/p + log<sub>2</sub>(p), por quanto devemos aumentar <b>n</b> para manter a eficiência constante ao dobrar p de <b>8 para 16</b>? O programa é escalável?",
  opcoes:[
    "Por um fator de <b>8/3 &asymp; 2,67</b>. O programa é <b>fracamente escalável</b>: dá para manter a eficiência, mas só aumentando o problema mais que proporcionalmente ao aumento de p.",
    "Por um fator de 2, exatamente como p. O programa é fortemente escalável.",
    "Por um fator de 4. O programa não é escalável.",
    "Não é preciso aumentar n; a eficiência já se mantém sozinha."
  ],
  correta:0,
  gabarito:"<b>E = T<sub>serial</sub> / (p &middot; T<sub>paralelo</sub>) = n / (n + p&middot;log<sub>2</sub>p)</b>.<br>Manter E constante exige manter a razão <b>n / (p&middot;log<sub>2</sub>p)</b> constante.<br><br>&bull; p = 8: p&middot;log<sub>2</sub>p = 8 &times; 3 = <b>24</b><br>&bull; p = 16: p&middot;log<sub>2</sub>p = 16 &times; 4 = <b>64</b><br><br>Logo n deve crescer por <b>64/24 = 8/3 &asymp; 2,67&times;</b>.<br><br>Como <b>é possível</b> manter a eficiência aumentando o problema, o programa é <b>escalável em sentido fraco</b>. Não é fortemente escalável, pois com n fixo a eficiência cairia. Note ainda que 2,67 &gt; 2: o problema precisa crescer <b>mais rápido</b> que o número de processadores, o que limita a escalabilidade na prática — em algum momento o problema não cabe mais na memória.<br><br><i>Fórmula geral: ao multiplicar p por k, n deve ser multiplicado por</i> <code>k &middot; log2(kp) / log2(p)</code>."
},
{
  id:"ds08", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Lab · Projeto e Análise, Q3",
  enunciado:"Seja T<sub>paralelo</sub> = T<sub>serial</sub>/p + T<sub>overhead</sub>, com p fixo e o tamanho do problema aumentando. O que acontece com a eficiência?",
  opcoes:[
    "Se T<sub>overhead</sub> cresce <b>mais devagar</b> que T<sub>serial</sub>, a eficiência <b>aumenta</b>; se cresce <b>mais rápido</b>, a eficiência <b>diminui</b>.",
    "A eficiência sempre aumenta com o tamanho do problema, qualquer que seja o overhead.",
    "A eficiência não depende do tamanho do problema, apenas de p.",
    "A eficiência sempre diminui, porque mais dados significam mais comunicação."
  ],
  correta:0,
  gabarito:"Desenvolvendo: <b>E = T<sub>s</sub> / (p&middot;T<sub>p</sub>) = T<sub>s</sub> / (T<sub>s</sub> + p&middot;T<sub>oh</sub>)</b>. A eficiência é governada pela razão <b>T<sub>oh</sub>/T<sub>s</sub></b>. Se o trabalho útil cresce mais rápido que o custo de coordenação, essa razão cai e E &rarr; 1. Se o <i>overhead</i> cresce mais rápido (uma comunicação O(n<sup>2</sup>) contra um cálculo O(n), por exemplo), a razão explode e E &rarr; 0. É por isso que aumentar o tamanho do problema é a receita usual para melhorar a eficiência — <b>desde que</b> o overhead se comporte."
},
{
  id:"ds09", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Definições / Projeto e Análise",
  enunciado:"Quais são as principais fontes de <b>overhead</b> num programa paralelo?",
  opcoes:[
    "Comunicação entre tarefas, sincronização (travas e barreiras), criação e destruição de threads, desbalanceamento de carga e a parte serial que não pôde ser paralelizada.",
    "Apenas o tempo de criação das threads.",
    "Apenas a comunicação em rede, presente somente em memória distribuída.",
    "O consumo extra de memória RAM, que não afeta o tempo de execução."
  ],
  correta:0,
  gabarito:"Overhead é, por definição, <i>&ldquo;o tempo necessário para coordenar tarefas executadas concorrentemente ou em paralelo&rdquo;</i>. Reconhecer as fontes é o que permite atacar o problema certo: se o gargalo é sincronização, reduza a granularidade da região crítica (como na soma com acumulador local); se é desbalanceamento, mude o escalonamento para dinâmico; se é comunicação, aumente a granularidade das tarefas."
},
{
  id:"ds10", mod:"desempenho", dif:"dificil", tipo:"mc",
  fonte:"Slides · Projeto e Análise",
  enunciado:"É possível observar <b>speedup superlinear</b> (S &gt; p, com eficiência maior que 1)? Por quê?",
  opcoes:[
    "Sim, geralmente por efeito de cache: com p processadores, cada um trabalha sobre uma fatia menor dos dados, que pode caber inteira na cache — algo que não acontecia na versão serial.",
    "Não, nunca: seria violar a conservação do trabalho computacional.",
    "Sim, mas apenas em memória distribuída, por causa da largura de banda da rede.",
    "Sim, sempre que o número de threads exceder o número de núcleos."
  ],
  correta:0,
  gabarito:"O efeito é real e a explicação mais comum é a <b>cache agregada</b>: p processadores somam p caches. Se o problema inteiro não cabia na cache de um núcleo mas 1/p dele cabe, a versão paralela tem uma taxa de acerto muito melhor e cada operação fica mais barata — as duas versões não estão fazendo o mesmo trabalho por operação. Outra causa é algorítmica (busca em que uma thread encontra a resposta cedo e encerra as demais). Fora esses casos, S &gt; p normalmente indica <b>erro de medição</b>, tipicamente comparar contra um T<sub>serial</sub> mal otimizado."
},
{
  id:"ds11", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Trabalho de Paralelização · item 3.4",
  enunciado:"O trabalho pede para indicar no código serial as <b>regiões críticas</b> e as <b>dependências de dados</b>, alertando que a dependência é <i>entre iterações das threads</i>. Qual laço abaixo <b>não pode</b> ser paralelizado diretamente?",
  cod:"/* (A) */                        /* (B) */\nfor (i = 0; i < n; i++)          for (i = 1; i < n; i++)\n    c[i] = a[i] + b[i];              a[i] = a[i-1] + b[i];\n\n/* (C) */                        /* (D) */\nfor (i = 0; i < n; i++)          for (i = 0; i < n; i++)\n    soma += v[i];                    y[i] = f(x[i]);",
  opcoes:[
    "O (B): cada iteração lê <code>a[i-1]</code>, escrito pela iteração anterior — é uma dependência de laço verdadeira, que impede a paralelização direta.",
    "O (A), porque escreve num vetor compartilhado.",
    "O (D), porque chama uma função dentro do laço.",
    "Nenhum: todos os quatro são diretamente paralelizáveis."
  ],
  correta:0,
  gabarito:"<b>(A) e (D)</b> são perfeitamente paralelos: cada iteração escreve numa posição própria e lê posições que ninguém altera.<br><b>(C)</b> tem uma <b>região crítica</b> em <code>soma</code>, mas é o padrão conhecido de <b>redução</b> — resolve-se com acumulador privado por thread (ou <code>reduction(+:soma)</code>).<br><b>(B)</b> é o caso genuinamente problemático: a iteração <i>i</i> depende do resultado da iteração <i>i&minus;1</i>. É uma <b>dependência carregada pelo laço</b> (<i>loop-carried dependency</i>), e nenhuma diretiva a resolve — o laço é intrinsecamente sequencial. Paralelizá-lo exige trocar de algoritmo (nesse caso, uma soma de prefixos paralela, ou <i>scan</i>)."
},
{
  id:"ds12", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Trabalho de Paralelização · item 3.2",
  enunciado:"Quais são as complexidades assintóticas de pior caso dos algoritmos do Trabalho de Paralelização?",
  opcoes:[
    "Multiplicação matricial O(n<sup>3</sup>); Selection sort O(n<sup>2</sup>); Heap sort O(n&nbsp;log&nbsp;n); Histograma O(n).",
    "Multiplicação matricial O(n<sup>2</sup>); Selection sort O(n&nbsp;log&nbsp;n); Heap sort O(n<sup>2</sup>); Histograma O(n&nbsp;log&nbsp;n).",
    "Todos O(n<sup>2</sup>), por operarem sobre vetores.",
    "Multiplicação matricial O(n<sup>3</sup>); Selection sort O(n&nbsp;log&nbsp;n); Heap sort O(n&nbsp;log&nbsp;n); Histograma O(n<sup>2</sup>)."
  ],
  correta:0,
  gabarito:"<b>Multiplicação matricial</b> clássica: três laços aninhados sobre n &rarr; O(n<sup>3</sup>).<br><b>Selection sort</b>: para cada posição, varre o resto do vetor em busca do mínimo &rarr; O(n<sup>2</sup>) em qualquer caso.<br><b>Heap sort</b>: n remoções da raiz, cada uma com <i>heapify</i> O(log n) &rarr; O(n log n).<br><b>Histograma</b>: uma passada pelo vetor incrementando o contador correspondente &rarr; O(n).<br><br>Isso importa para a análise: o histograma, sendo O(n), tem pouquíssimo cálculo por elemento, o que faz o <i>overhead</i> de sincronização pesar muito na versão paralela — e é justamente onde os incrementos dos <i>bins</i> viram região crítica."
},
{
  id:"ds13", mod:"desempenho", dif:"facil", tipo:"vf",
  fonte:"Slides · Projeto e Análise",
  enunciado:"Se um programa paralelo com 4 threads tem ganho de 3,2, sua eficiência é de 80%.",
  correta:0,
  gabarito:"<b>Verdadeiro.</b> E = S/p = 3,2/4 = 0,8 = <b>80%</b>. Em outras palavras, 20% da capacidade dos 4 processadores foi consumida por <i>overhead</i>: sincronização, comunicação, criação de threads, desbalanceamento e a parte serial. É esse tipo de cálculo que preenche as tabelas de resultados do Trabalho de Paralelização."
},
{
  id:"ds14", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Programas paralelos",
  enunciado:"Nos slides, a soma de n valores por p núcleos é apresentada em duas versões de combinação dos resultados parciais. Por que a segunda é melhor?",
  opcoes:[
    "Porque a acumulação em <b>árvore</b> combina os parciais em log<sub>2</sub>(p) etapas paralelas, enquanto o núcleo mestre recebendo de todos, um a um, gasta p&minus;1 etapas sequenciais.",
    "Porque a segunda versão usa menos memória compartilhada.",
    "Porque a primeira versão tem condição de corrida e a segunda não.",
    "Porque a segunda usa mais núcleos na fase de cálculo das somas parciais."
  ],
  correta:0,
  gabarito:"A fase de cálculo é idêntica; o que muda é a <b>combinação</b>. Com p = 8: o mestre sequencial faz 7 somas em série; a árvore faz 3 rodadas (4 somas em paralelo, depois 2, depois 1). Com p = 1024, são 1023 etapas contra <b>10</b>. Os slides usam esse exemplo para justificar por que se escreve programas paralelos à mão: <i>&ldquo;é muito improvável que um programa tradutor encontre essa forma&rdquo;</i>."
},
{
  id:"ds15", mod:"desempenho", dif:"dificil", tipo:"mc",
  fonte:"Slides · Lei de Amdahl",
  enunciado:"Um programa leva 100 s. Você otimiza uma rotina que consome 40 s, tornando-a <b>4 vezes</b> mais rápida. Qual o ganho global?",
  opcoes:[
    "1,43&times; — o novo tempo é 60 + 40/4 = 70 s, logo S = 100/70.",
    "4&times; — a rotina ficou 4 vezes mais rápida.",
    "2,5&times; — a rotina representava 40% do tempo.",
    "1,6&times; — o novo tempo é 100/1,6."
  ],
  correta:0,
  gabarito:"É a Lei de Amdahl em sua forma geral (<i>a lei do ganho decrescente</i>): a parte não otimizada continua custando 60 s. Novo tempo = 60 + 40/4 = <b>70 s</b>, logo S = 100/70 = <b>1,43&times;</b>. Mesmo que a rotina ficasse <b>infinitamente</b> rápida, o teto seria 100/60 = 1,67&times;. A moral: <b>otimize primeiro o que ocupa mais tempo</b> — meça antes de paralelizar."
},
{
  id:"ds16", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Definições",
  enunciado:"O que são <b>comunicação</b> e <b>sincronização</b> nas definições da disciplina?",
  opcoes:[
    "Comunicação é a troca de dados entre tarefas executando simultaneamente; sincronização é a coordenação dessas tarefas paralelas em tempo real.",
    "Comunicação ocorre só entre processos e sincronização só entre threads.",
    "Comunicação é a criação das tarefas; sincronização é a destruição delas.",
    "São sinônimos: toda comunicação implica sincronização e vice-versa."
  ],
  correta:0,
  gabarito:"Comunicação move <b>dados</b>; sincronização coordena <b>momentos</b>. As duas são fontes de <i>overhead</i> e ambas se manifestam nos padrões concorrentes da P1: o pipeline comunica (passa resultados de estágio a estágio) e a barreira sincroniza (todos esperam). A alternativa (d) erra porque existe sincronização pura, como a barreira, em que nenhum dado é trocado."
}

]);
