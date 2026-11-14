/* ─── Desempenho e Escalabilidade ───────────────────────────
   P2 · 48 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"ds01", mod:"desempenho", dif:"facil", tipo:"mc",
  fonte:"Slides · Projeto e Análise",
  enunciado:"Como se calculam o <b>ganho (speedup)</b> e a <b>eficiência</b> de um programa paralelo?",
  opcoes:[
    "S = T<sub>serial</sub> / T<sub>paralelo</sub> &nbsp;e&nbsp; E = S / p, onde p é o número de processadores.",
    "S = T<sub>paralelo</sub> / T<sub>serial</sub> &nbsp;e&nbsp; E = S &times; p, onde p é o número de processadores usados.",
    "S = T<sub>serial</sub> &minus; T<sub>paralelo</sub> &nbsp;e&nbsp; E = S / T<sub>serial</sub>, em segundos.",
    "S = p / T<sub>paralelo</sub> &nbsp;e&nbsp; E = p &times; S, onde p é o número de processadores."
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
    "Amdahl fixa o <b>tamanho do problema</b> e mede quanto mais rápido ele fica; Gustafson fixa o <b>tempo</b> e mede quanto maior ele pode ser.",
    "Amdahl vale para memória compartilhada e Gustafson para memória distribuída, por causa da rede.",
    "Amdahl considera o overhead de comunicação no cálculo e Gustafson o ignora por completo.",
    "São a mesma lei, escritas de formas algebricamente equivalentes e com o mesmo limite."
  ],
  correta:0,
  gabarito:"É uma diferença de <b>pergunta</b>, não de matemática. Amdahl (<i>strong scaling</i>) fixa o problema: a parte serial vira um teto intransponível. Gustafson (<i>weak scaling</i>) observa que, na prática, quem ganha mais processadores usa-os para resolver problemas <b>maiores</b> — e como a parte paralela normalmente cresce com o tamanho do problema enquanto a serial permanece quase constante, a <b>fração serial encolhe</b> e o ganho se aproxima do linear: <b>S(p) = p &minus; &alpha;(p&minus;1)</b>, com &alpha; a fração serial. Simulação climática e treinamento de redes neurais são casos típicos de Gustafson."
},
{
  id:"ds04", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Escalabilidade",
  enunciado:"Qual é a diferença entre escalabilidade <b>forte</b> e <b>fraca</b>?",
  opcoes:[
    "Forte: a eficiência se mantém aumentando p com o <b>problema fixo</b>. Fraca: mantém-se aumentando p <b>e</b> o problema juntos.",
    "Forte: o programa roda em memória compartilhada. Fraca: roda em memória distribuída, com troca explícita de mensagens.",
    "Forte: o ganho obtido é superlinear. Fraca: o ganho é sublinear em qualquer número de núcleos.",
    "Forte: o programa usa mais de quatro threads. Fraca: usa até quatro threads simultâneas."
  ],
  correta:0,
  gabarito:"Escalabilidade <b>forte</b> é uma exigência dura: dobrar p com a mesma entrada e manter a eficiência significa que o <i>overhead</i> praticamente não cresce. Poucos programas conseguem. Escalabilidade <b>fraca</b> é mais comum e ainda muito útil: se você pode dobrar o problema quando dobra os processadores, a máquina maior resolve o problema maior no mesmo tempo. É exatamente o que o roteiro do Trabalho pede para avaliar: <i>&ldquo;um programa fortemente escalável mantém a mesma eficiência quando os recursos computacionais aumentam&rdquo;</i>."
},
{
  id:"ds05", mod:"desempenho", dif:"dificil", tipo:"mc",
  fonte:"Lab · Projeto e Análise, Q1",
  enunciado:"Seja T<sub>serial</sub> = n<sup>2</sup> e T<sub>paralelo</sub> = n<sup>2</sup>/p + log<sub>2</sub>(p). O que acontece com ganho e eficiência quando <b>p aumenta e n fica fixo</b>? E quando <b>p fica fixo e n aumenta</b>?",
  opcoes:[
    "Com n fixo e p crescendo a <b>eficiência cai</b> (log<sub>2</sub>p passa a dominar); com p fixo e n crescendo ela <b>sobe</b> e tende a 1.",
    "Nos dois casos a eficiência aumenta, porque o overhead é sempre desprezível diante do cálculo.",
    "Nos dois casos a eficiência cai, porque o termo log<sub>2</sub>p cresce nas duas situações.",
    "Com n fixo e p crescendo a eficiência sobe; com p fixo e n crescendo ela cai e tende a 0."
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
    "A é mais rápida (7 s contra 8 s) e mais balanceada: média/máximo 4,75/7 &asymp; 0,68 contra 4,75/8 &asymp; 0,59.",
    "B é mais rápida, porque tem a thread que termina mais cedo, com apenas 1 s de trabalho.",
    "As duas levam o mesmo tempo, já que a soma dos tempos das threads é 19 s nas duas.",
    "A é mais rápida, mas B é a mais balanceada, por ter a menor diferença entre a thread mais rápida e a mais lenta."
  ],
  correta:0,
  gabarito:"O erro clássico é somar os tempos. Num programa paralelo com <i>join</i> ao final, <b>o tempo total é o da thread mais lenta</b>: A leva <b>7 s</b> e B leva <b>8 s</b>.<br><br><b>Fator de balanceamento</b> = tempo médio / tempo máximo (1 = perfeito):<br>&bull; A: média = 19/4 = 4,75 &rarr; 4,75/7 = <b>0,68</b><br>&bull; B: média = 19/4 = 4,75 &rarr; 4,75/8 = <b>0,59</b><br><br>Equivalentemente, pelo <i>desbalanceamento</i> (máximo/média, sendo 1 o ideal): A = 1,47 e B = 1,68. Por qualquer das medidas, <b>A vence nos dois critérios</b>. O tempo ocioso total (&sum;(máx &minus; t<sub>i</sub>)) é 9 s em A e 13 s em B — trabalho de processador jogado fora."
},
{
  id:"ds07", mod:"desempenho", dif:"dificil", tipo:"mc",
  fonte:"Lab · Projeto e Análise, Q5",
  enunciado:"Com T<sub>serial</sub> = n e T<sub>paralelo</sub> = n/p + log<sub>2</sub>(p), por quanto devemos aumentar <b>n</b> para manter a eficiência constante ao dobrar p de <b>8 para 16</b>? O programa é escalável?",
  opcoes:[
    "Por um fator de <b>8/3 &asymp; 2,67</b>. É <b>fracamente escalável</b>: mantém a eficiência, mas só crescendo o problema mais que p.",
    "Por um fator de 2, exatamente como p. O programa é fortemente escalável nesse intervalo.",
    "Por um fator de 4, o dobro do crescimento de p. O programa não é escalável nem fracamente.",
    "Não é preciso aumentar n: a eficiência já se mantém sozinha quando p dobra de 8 para 16."
  ],
  correta:0,
  gabarito:"<b>E = T<sub>serial</sub> / (p &middot; T<sub>paralelo</sub>) = n / (n + p&middot;log<sub>2</sub>p)</b>.<br>Manter E constante exige manter a razão <b>n / (p&middot;log<sub>2</sub>p)</b> constante.<br><br>&bull; p = 8: p&middot;log<sub>2</sub>p = 8 &times; 3 = <b>24</b><br>&bull; p = 16: p&middot;log<sub>2</sub>p = 16 &times; 4 = <b>64</b><br><br>Logo n deve crescer por <b>64/24 = 8/3 &asymp; 2,67&times;</b>.<br><br>Como <b>é possível</b> manter a eficiência aumentando o problema, o programa é <b>escalável em sentido fraco</b>. Não é fortemente escalável, pois com n fixo a eficiência cairia. Note ainda que 2,67 &gt; 2: o problema precisa crescer <b>mais rápido</b> que o número de processadores, o que limita a escalabilidade na prática — em algum momento o problema não cabe mais na memória.<br><br><i>Fórmula geral: ao multiplicar p por k, n deve ser multiplicado por</i> <code>k &middot; log2(kp) / log2(p)</code>."
},
{
  id:"ds08", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Lab · Projeto e Análise, Q3",
  enunciado:"Seja T<sub>paralelo</sub> = T<sub>serial</sub>/p + T<sub>overhead</sub>, com p fixo e o tamanho do problema aumentando. O que acontece com a eficiência?",
  opcoes:[
    "Se T<sub>overhead</sub> cresce <b>mais devagar</b> que T<sub>serial</sub> a eficiência <b>sobe</b>; se cresce mais rápido, ela <b>cai</b>.",
    "A eficiência sempre aumenta com o tamanho do problema, qualquer que seja o overhead envolvido no cálculo.",
    "A eficiência não depende do tamanho do problema, apenas do número de processadores.",
    "A eficiência sempre diminui, porque mais dados significam sempre mais comunicação."
  ],
  correta:0,
  gabarito:"Desenvolvendo: <b>E = T<sub>s</sub> / (p&middot;T<sub>p</sub>) = T<sub>s</sub> / (T<sub>s</sub> + p&middot;T<sub>oh</sub>)</b>. A eficiência é governada pela razão <b>T<sub>oh</sub>/T<sub>s</sub></b>. Se o trabalho útil cresce mais rápido que o custo de coordenação, essa razão cai e E &rarr; 1. Se o <i>overhead</i> cresce mais rápido (uma comunicação O(n<sup>2</sup>) contra um cálculo O(n), por exemplo), a razão explode e E &rarr; 0. É por isso que aumentar o tamanho do problema é a receita usual para melhorar a eficiência — <b>desde que</b> o overhead se comporte."
},
{
  id:"ds09", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Definições / Projeto e Análise",
  enunciado:"Quais são as principais fontes de <b>overhead</b> num programa paralelo?",
  opcoes:[
    "Comunicação, sincronização (travas e barreiras), criação de threads, desbalanceamento de carga e a parte serial.",
    "Apenas o tempo gasto na criação e na destruição das threads, pago uma vez por execução.",
    "Apenas a comunicação em rede, presente somente nas máquinas de memória distribuída.",
    "O consumo extra de memória RAM, que ocupa espaço mas não afeta o tempo de execução."
  ],
  correta:0,
  gabarito:"Overhead é, por definição, <i>&ldquo;o tempo necessário para coordenar tarefas executadas concorrentemente ou em paralelo&rdquo;</i>. Reconhecer as fontes é o que permite atacar o problema certo: se o gargalo é sincronização, reduza a granularidade da região crítica (como na soma com acumulador local); se é desbalanceamento, mude o escalonamento para dinâmico; se é comunicação, aumente a granularidade das tarefas."
},
{
  id:"ds10", mod:"desempenho", dif:"dificil", tipo:"mc",
  fonte:"Slides · Projeto e Análise",
  enunciado:"É possível observar <b>speedup superlinear</b> (S &gt; p, com eficiência maior que 1)? Por quê?",
  opcoes:[
    "Sim, em geral por efeito de cache: cada processador fica com uma fatia menor dos dados, que passa a caber na cache.",
    "Não, nunca: isso violaria a conservação do trabalho computacional total do programa.",
    "Sim, mas apenas em memória distribuída, por causa da largura de banda agregada da rede de interconexão entre os nós.",
    "Sim, sempre que o número de threads criadas exceder o número de núcleos da máquina."
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
    "O <b>(B)</b>: cada iteração lê <code>a[i-1]</code>, escrito pela anterior — dependência carregada pelo laço.",
    "O <b>(A)</b>: escreve num vetor compartilhado por todas as threads do time, o que exige exclusão mútua.",
    "O <b>(D)</b>: chama uma função dentro do laço, e chamadas de função não são paralelizáveis.",
    "Nenhum deles: os quatro laços são diretamente paralelizáveis com uma única diretiva."
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
    "Todos O(n<sup>2</sup>), já que os quatro percorrem vetores com dois laços encaixados.",
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
    "Porque a soma em <b>árvore</b> combina os parciais em log<sub>2</sub>(p) etapas, contra p&minus;1 etapas do mestre recebendo um a um.",
    "Porque a segunda versão usa menos memória compartilhada para guardar os valores parciais.",
    "Porque a primeira versão tem condição de corrida no acumulador e a segunda não tem.",
    "Porque a segunda usa mais núcleos na fase de cálculo das parciais, antes da fase de combinação dos resultados."
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
    "4&times; — foi exatamente o quanto a rotina otimizada acelerou.",
    "2,5&times; — a rotina otimizada representava 40% do tempo total.",
    "1,6&times; — o novo tempo seria 100/1,6 = 62,5 s no total."
  ],
  correta:0,
  gabarito:"É a Lei de Amdahl em sua forma geral (<i>a lei do ganho decrescente</i>): a parte não otimizada continua custando 60 s. Novo tempo = 60 + 40/4 = <b>70 s</b>, logo S = 100/70 = <b>1,43&times;</b>. Mesmo que a rotina ficasse <b>infinitamente</b> rápida, o teto seria 100/60 = 1,67&times;. A moral: <b>otimize primeiro o que ocupa mais tempo</b> — meça antes de paralelizar."
},
{
  id:"ds16", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Definições",
  enunciado:"O que são <b>comunicação</b> e <b>sincronização</b> nas definições da disciplina?",
  opcoes:[
    "Comunicação é a troca de dados entre tarefas simultâneas; sincronização é a coordenação delas no tempo.",
    "Comunicação ocorre só entre processos e sincronização só entre threads do mesmo processo.",
    "Comunicação é a criação das tarefas e sincronização é a destruição delas ao final.",
    "São sinônimos: toda comunicação implica sincronização, e toda sincronização troca dados."
  ],
  correta:0,
  gabarito:"Comunicação move <b>dados</b>; sincronização coordena <b>momentos</b>. As duas são fontes de <i>overhead</i> e ambas se manifestam nos padrões concorrentes da P1: o pipeline comunica (passa resultados de estágio a estágio) e a barreira sincroniza (todos esperam). Tratar as duas como sinônimos é o erro clássico: existe sincronização pura, como a barreira, em que <b>nenhum dado é trocado</b>."
},
{
  id:"ds17", mod:"desempenho", dif:"facil", tipo:"mc",
  fonte:"Slides · Projeto e análise de programas paralelos",
  enunciado:"O que caracteriza um programa <b>SPMD</b> (<i>Single Program Multiple Data</i>)?",
  opcoes:[
    "Um único programa roda em todas as threads, e cada uma usa o seu identificador para saber em que pedaço trabalhar.",
    "Cada thread executa um programa-fonte diferente, compilado à parte e carregado pelo escalonador do sistema.",
    "Uma instrução é aplicada a vários dados ao mesmo tempo por várias ULAs em <i>lockstep</i>, como na GPU.",
    "O programa é dividido em estágios, e cada thread executa um estágio diferente sobre o mesmo fluxo de dados."
  ],
  correta:0,
  gabarito:"SPMD é a forma como quase todo programa paralelo é escrito: <b>um</b> código-fonte, que cada thread executa inteiro. O que muda entre elas é o <b>identificador</b> — é com ele que a thread calcula a faixa de dados que lhe cabe.<br><br>O exemplo dos slides é o <code>if (sou a thread 0) … else …</code>. Na prática, com p threads não se usa <code>if</code>: calcula-se <code>ini = id * (N/p)</code> e <code>fim = (id+1) * (N/p)</code>.<br><br>A última alternativa descreve o <b>pipeline</b>, que é divisão <b>funcional</b> — ali cada thread faz coisa diferente."
},
{
  id:"ds18", mod:"desempenho", dif:"facil", tipo:"mc",
  fonte:"Slides · Projeto e análise de programas paralelos",
  enunciado:"Qual a diferença entre <b>SPMD</b> e o <b>SIMD</b> da taxonomia de Flynn?",
  opcoes:[
    "SPMD é software: cada thread tem o seu fluxo e pode desviar. SIMD é hardware: as ULAs andam em <i>lockstep</i>.",
    "São o mesmo conceito com nomes diferentes; SPMD é o termo usado na taxonomia de Flynn para multiprocessadores.",
    "SPMD vale só para memória distribuída e SIMD, só para memória compartilhada entre os núcleos.",
    "SIMD é software aplicado a vetores e SPMD é a instrução vetorial que o processador executa."
  ],
  correta:0,
  gabarito:"A confusão é comum porque as siglas são parecidas, mas os níveis são outros.<br><br>&bull; <b>SIMD</b> é uma classe de <b>hardware</b>: uma unidade de controle, várias ULAs executando a <b>mesma instrução</b> no mesmo ciclo. Quem desvia, atrasa todo mundo — é a divergência de fluxo.<br>&bull; <b>SPMD</b> é um estilo de <b>software</b>: o mesmo código em várias threads, cada uma com o seu contador de programa. Duas threads SPMD podem estar em linhas completamente diferentes do arquivo.<br><br>Um programa SPMD roda numa máquina MIMD — e pode, lá dentro, usar instruções SIMD."
},
{
  id:"ds19", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Projeto e análise de programas paralelos",
  enunciado:"Na análise do programa sequencial, qual a diferença entre divisão <b>funcional</b> e divisão de <b>domínio</b>?",
  opcoes:[
    "Funcional divide <b>tarefas diferentes</b> entre as threads; a de domínio divide <b>os dados</b> entre threads que fazem o mesmo.",
    "Funcional divide os dados em faixas iguais; a de domínio divide pela função matemática aplicada a cada faixa.",
    "Funcional vale para memória compartilhada; a de domínio, para troca de mensagens em cluster.",
    "Funcional é feita pelo compilador; a de domínio precisa ser escrita à mão pelo programador."
  ],
  correta:0,
  gabarito:"<b>Funcional</b> é quando as threads fazem coisas <b>diferentes</b>: decodificar, filtrar, gravar. O pipeline é o exemplo típico, e o número de threads fica limitado ao número de etapas.<br><br><b>De domínio</b> é quando todas fazem a <b>mesma coisa</b> sobre pedaços diferentes dos dados. É o caso da soma de vetores, da multiplicação de matrizes e de quase todo laço paralelizado — e escala com o tamanho da entrada, não com o número de etapas do algoritmo.<br><br>Quase tudo que cai em prova é divisão de domínio."
},
{
  id:"ds20", mod:"desempenho", dif:"facil", tipo:"mc",
  fonte:"Slides · Projeto e análise de programas paralelos",
  enunciado:"O que é um <b><i>hotspot</i></b>, e por que procurá-lo antes de paralelizar?",
  opcoes:[
    "O trecho onde o programa gasta mais tempo — é o único lugar onde paralelizar muda o total.",
    "O trecho com mais variáveis compartilhadas, que concentra as disputas por trava entre as threads.",
    "A thread que termina por último e segura o <code>join</code> das demais no fim de cada fase.",
    "A região de memória mais acessada, que acaba ficando permanentemente na cache L1 do núcleo."
  ],
  correta:0,
  gabarito:"<i>Hotspot</i> é onde o tempo é gasto, e se descobre com <b>profiling</b> — não com palpite. Paralelizar um trecho que consome 2% do tempo tem teto de ganho de <b>1,02&times;</b>, por mais núcleos que a máquina tenha.<br><br>É por isso que a aula coloca o <i>profiling</i> <b>antes</b> da escrita das threads: o relatório do <code>gprof</code> responde se vale a pena começar.<br><br>A thread que termina por último é outro problema — <b>desbalanceamento</b> —, e também custa desempenho, mas não é o que se chama de <i>hotspot</i>."
},
{
  id:"ds21", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Padrões de projeto paralelo",
  enunciado:"Qual a diferença entre os padrões <b>map</b> e <b>stencil</b>?",
  opcoes:[
    "No map cada saída depende de um elemento; no stencil, de uma <b>vizinhança</b> — e daí vem a comunicação.",
    "No map as saídas são independentes; no stencil elas precisam ser calculadas em sequência, uma após a outra.",
    "O map vale para vetores e o stencil, só para matrizes quadradas de lado par, por causa da janela.",
    "O stencil é o map aplicado duas vezes seguidas sobre o mesmo conjunto de dados de entrada."
  ],
  correta:0,
  gabarito:"O <b>map</b> aplica o mesmo <i>kernel</i> a cada elemento: a saída <i>i</i> depende da entrada <i>i</i>. A divisão é trivial e <b>não há comunicação</b> entre as faixas.<br><br>O <b>stencil</b> generaliza isso para uma <b>vizinhança</b> — o exemplo da aula é o filtro da média, em que cada saída é a média da janela 3&times;3 em volta. Quando dois nós ficam com blocos vizinhos, a janela de um precisa de células que estão com o outro: são as <i>ghost cells</i>, e elas custam comunicação.<br><br>As saídas continuam independentes entre si no stencil — o que muda é <b>de quantas entradas</b> cada uma depende."
},
{
  id:"ds22", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Padrões de projeto paralelo",
  enunciado:"O que faz o padrão <b>reduction</b> (redução)?",
  opcoes:[
    "Combina os resultados intermediários num só — as parciais de cada nó viram o resultado final.",
    "Reduz o número de threads conforme o problema encolhe, liberando núcleos para outro trabalho.",
    "Diminui o tamanho do conjunto de dados antes de distribuí-lo entre os nós de processamento.",
    "Reduz o overhead de comunicação agrupando as mensagens pequenas numa mensagem maior."
  ],
  correta:0,
  gabarito:"Redução é a <b>combinação</b> dos parciais. No exemplo da aula, o vetor de 8 elementos é somado por dois nós: no passo 1 cada um soma a sua metade (10 e 26) e no passo 2 as duas parciais viram <b>36</b>.<br><br>É o único dos quatro padrões em que os nós <b>precisam se falar</b>. Por isso a forma da combinação importa: o mestre recebendo de todos leva <b>p&minus;1</b> etapas, enquanto a combinação <b>em árvore</b> leva <b>log<sub>2</sub>(p)</b>.<br><br>Em OpenMP, a cláusula <code>reduction(+:soma)</code> faz exatamente isso: cópia privada por thread e combinação no fim."
},
{
  id:"ds23", mod:"desempenho", dif:"facil", tipo:"mc",
  fonte:"Slides · Testes e correção",
  enunciado:"Como a aula recomenda verificar se a versão paralela está <b>correta</b>?",
  opcoes:[
    "Rodando as duas sobre a mesma entrada e comparando as saídas — por arquivo ou pelo <i>hash</i> delas.",
    "Medindo o tempo das duas: se a paralela for mais rápida, o resultado está correto por construção.",
    "Conferindo se a paralela compila sem nenhum aviso com a opção <code>-Wall</code> ligada no gcc.",
    "Rodando a paralela uma vez e conferindo o resultado à mão, com uma entrada bem pequena."
  ],
  correta:0,
  gabarito:"A versão <b>sequencial é o gabarito</b>: ela produz o resultado certo, mesmo que devagar. Guardá-la no repositório é o que permite comparar depois, com <code>diff</code> nos arquivos de saída ou com o <i>hash</i>, que é mais rápido para saídas grandes.<br><br>E rode <b>várias vezes</b>: condição de corrida é intermitente. Vinte execuções com <code>md5sum | sort -u</code> mostram em uma linha se há não determinismo.<br><br>Tempo não diz nada sobre correção — um programa com corrida costuma ser rápido e errado."
},
{
  id:"ds24", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Criação de threads",
  enunciado:"Qual a diferença entre criação <b>estática</b> e <b>dinâmica</b> de threads?",
  opcoes:[
    "Estática cria as threads uma vez e elas vivem até o fim; dinâmica cria sob demanda, pagando o custo a cada vez.",
    "Estática é decidida em tempo de compilação e a dinâmica, em tempo de ligação do programa executável.",
    "Estática vale para processos e a dinâmica, para threads do mesmo processo em memória compartilhada.",
    "Estática distribui as iterações em blocos e a dinâmica as entrega sob demanda, como no <code>schedule</code>."
  ],
  correta:0,
  gabarito:"<b>Estática:</b> as threads nascem uma vez e executam até o fim da tarefa. É o caso do <i>pool</i> e do <code>parallel for</code>.<br><br><b>Dinâmica:</b> há uma thread principal que cria novas threads <b>conforme a necessidade</b>. É mais flexível e é o que se usa quando a carga é imprevisível.<br><br>O preço da dinâmica é um dos <b>fatores de risco</b> da aula: <b>criação excessiva de threads</b>. Cada <code>pthread_create</code> custa entrada no kernel e alocação de pilha; com tarefas curtas, esse custo come o ganho e o programa fica mais lento que o sequencial.<br><br>A última alternativa descreve o <code>schedule(static)</code> e o <code>schedule(dynamic)</code> do OpenMP, que distribuem <b>iterações</b>, e não threads."
},
{
  id:"ds25", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Execução segura de funções",
  enunciado:"Por que a função <code>strtok</code> não é segura para uso em várias threads?",
  opcoes:[
    "Porque guarda o ponto onde parou numa variável <code>static</code>, que as threads sobrescrevem umas das outras.",
    "Porque aloca memória com <code>malloc</code> a cada chamada, e o alocador não é reentrante em C.",
    "Porque escreve na string original, e duas threads não podem ler a mesma string ao mesmo tempo.",
    "Porque depende do <i>locale</i>, que é global e muda o separador usado para quebrar a string."
  ],
  correta:0,
  gabarito:"A assinatura entrega o problema: na segunda chamada passa-se <code>NULL</code> e a função &ldquo;continua de onde parou&rdquo;. Esse <b>onde parou</b> mora numa variável <code>static</code> dentro da biblioteca — uma só, para o processo inteiro.<br><br>Com duas threads quebrando strings ao mesmo tempo, uma sobrescreve o estado da outra. E <b>mutex do lado de fora não resolve</b> de forma geral, porque o estado é escondido e persiste entre chamadas.<br><br>A saída é a versão <b>reentrante</b>: <code>strtok_r</code>, que recebe esse estado por parâmetro. O mesmo vale para <code>rand_r</code>, <code>localtime_r</code> e companhia — e a aula manda <b>consultar o manual</b> (<code>man pthreads</code>) antes de usar função de biblioteca em programa paralelo."
},
{
  id:"ds26", mod:"desempenho", dif:"facil", tipo:"mc",
  fonte:"Slides · Entrada/Saída",
  enunciado:"Quais suposições a aula pede para adotar sobre <b>entrada e saída</b> num programa paralelo?",
  opcoes:[
    "Só a thread mestre lê de <code>stdin</code>; a depuração vai para <code>stderr</code>, com o número da thread.",
    "Todas as threads leem de <code>stdin</code>, e o sistema entrega uma linha para cada uma em ordem.",
    "Nenhuma thread pode escrever em <code>stdout</code>; a saída fica por conta do processo pai.",
    "Cada thread abre o seu próprio arquivo de saída, e o programa junta tudo no final da execução."
  ],
  correta:0,
  gabarito:"As regras da aula: <b>só a mestre lê</b> da entrada-padrão; todas <i>podem</i> escrever em <code>stdout</code> e <code>stderr</code>, mas <b>é melhor que só uma escreva</b>; um arquivo é lido por uma thread de cada vez; e a depuração sai no <b><code>stderr</code></b> <b>com a identificação da thread</b>.<br><br>O motivo do <code>stderr</code>: ele não tem buffer de linha, então a mensagem aparece na hora — inclusive quando o programa trava logo depois, que é justamente quando ela é mais útil.<br><br>Sem o número da thread, a saída de depuração de 8 threads é uma lista de linhas sem dono."
},
{
  id:"ds27", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Medição de tempo",
  enunciado:"Um programa paralelo foi medido com o <code>time</code> do shell e a saída foi esta. O que ela diz?",
  cod:"$ time ./programa\n\nreal    0m1,204s\nuser    0m4,610s\nsys     0m0,090s",
  opcoes:[
    "O programa levou 1,2 s de relógio usando cerca de 4 núcleos: o <code>user</code> é a CPU somada das threads.",
    "O programa levou 4,6 s, e o <code>real</code> mede apenas a fatia da thread principal do processo.",
    "Houve erro de medição: o tempo de CPU não pode passar do tempo de relógio em nenhum caso.",
    "O programa ficou 3,4 s bloqueado esperando entrada e saída de disco durante a execução."
  ],
  correta:0,
  gabarito:"<b><code>real</code></b> é o <i>wall time</i>, o tempo do relógio de parede — é esse que entra no cálculo do <i>speedup</i>.<br><br><b><code>user</code></b> é o tempo de CPU <b>somado de todas as threads</b>. Por isso ele pode ser <b>maior</b> que o <code>real</code>: 4,6 s de CPU em 1,2 s de relógio indica que cerca de <b>4 núcleos</b> trabalharam juntos.<br><br>Se o <code>user</code> fosse próximo do <code>real</code>, o paralelismo não estaria acontecendo. E se o <code>real</code> fosse muito maior que <code>user + sys</code>, o programa estaria <b>esperando</b> — disco, rede ou travas."
},
{
  id:"ds28", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Medição de tempo",
  enunciado:"Um aluno mede o trecho paralelo com <code>clock()</code> e vê o tempo <b>crescer</b> conforme aumenta o número de threads, embora o programa termine mais rápido. Por quê?",
  opcoes:[
    "Em várias plataformas o <code>clock()</code> mede <b>tempo de CPU</b>, que cresce com o número de threads.",
    "O <code>clock()</code> tem resolução de 1 segundo, o que esconde qualquer ganho menor do que isso.",
    "O <code>CLOCKS_PER_SEC</code> muda de máquina para máquina, o que invalida a divisão do resultado.",
    "O <code>clock()</code> só pode ser chamado pela thread mestre, e devolve zero em todas as demais."
  ],
  correta:0,
  gabarito:"É a pegadinha clássica da medição. O que interessa é o <b><i>wall time</i></b>, mas o <code>clock()</code> em Linux conta <i>ticks</i> de <b>processador</b>: com 4 threads trabalhando 1 s cada, ele devolve 4 s enquanto o relógio marcou 1 s.<br><br>Quanto mais threads, maior o número — exatamente o contrário do que o aluno queria mostrar.<br><br><b>O que usar:</b> <code>omp_get_wtime()</code> em OpenMP, <code>clock_gettime(CLOCK_MONOTONIC, …)</code> em C puro, ou o <code>real</code> do <code>time</code> do shell."
},
{
  id:"ds29", mod:"desempenho", dif:"facil", tipo:"mc",
  fonte:"Slides · Análise estatística",
  enunciado:"Por que a aula manda executar o teste de desempenho <b>várias vezes</b> em vez de uma só?",
  opcoes:[
    "Porque o tempo varia entre execuções; a média e o desvio padrão dizem se a diferença é real.",
    "Porque a primeira execução aquece a cache e todas as seguintes dão exatamente o mesmo tempo.",
    "Porque o compilador otimiza um pouco mais a cada execução do mesmo binário na máquina.",
    "Porque o escalonador só espalha as threads por todos os núcleos a partir da terceira execução."
  ],
  correta:0,
  gabarito:"O tempo de uma execução sofre interferência de outros processos, do estado da cache e da frequência do processador. Uma medição só não distingue ganho de ruído.<br><br>Daí as três estatísticas da aula: <b>média</b>, <b>variância</b> e <b>desvio padrão</b>. É o desvio que dá sentido ao número — comparar <b>10,0 s ± 0,1 s</b> com <b>9,5 s ± 2,0 s</b> não autoriza dizer que a segunda versão é mais rápida.<br><br>Na prática: descarte a primeira execução (ela paga o aquecimento da cache) e informe no relatório quantas execuções foram feitas."
},
{
  id:"ds30", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Profiling",
  enunciado:"Entre as ferramentas de <i>profiling</i> citadas na aula, qual associação está correta?",
  opcoes:[
    "<b>gprof</b> (com <code>gcc -pg</code>) dá o tempo por função; o <b>cachegrind</b>, os <i>misses</i> de cache.",
    "<b>gprof</b> mede os <i>misses</i> de cache e o <b>callgrind</b> dá o tempo por função chamada no programa.",
    "O <b>Valgrind</b> só detecta vazamento de memória; para tempo por função, o jeito é o <code>time</code>.",
    "O <b>gprof</b> exige o programa compilado com <code>-O3</code> e não gera nenhum arquivo intermediário."
  ],
  correta:0,
  gabarito:"<b>gprof</b>, da suíte gcc: compile com <code>-pg</code>, rode (o programa gera o <code>gmon.out</code>) e leia o relatório — tempo por função, número de chamadas e quem chamou quem.<br><br><b>Valgrind</b> é um analisador de uso de recursos, com duas ferramentas citadas: <code>--tool=cachegrind</code> para a <b>memória cache</b> e <code>--tool=callgrind</code> para as <b>chamadas de função</b>.<br><br>A coluna que decide o projeto é a <code>% time</code> do gprof: ela diz se o trecho que você pensa em paralelizar tem peso suficiente para valer a pena."
},
{
  id:"ds31", mod:"desempenho", dif:"dificil", tipo:"mc",
  fonte:"Slides · Profiling",
  enunciado:"O relatório do <code>gprof</code> mostra que a função <code>multiplica</code> consome <b>30%</b> do tempo, e é a única que você consegue paralelizar. Qual é o <b>teto</b> do ganho?",
  opcoes:[
    "<b>1,43&times;</b>: com 30% paralelizável, o limite é 1/(1 &minus; 0,3), por mais núcleos que existam.",
    "<b>3,3&times;</b>, que é o inverso da fração paralelizável do tempo total do programa medido.",
    "<b>30&times;</b>, porque cada ponto percentual vira um núcleo aproveitado no limite teórico.",
    "Não há teto: basta aumentar o número de núcleos para o ganho continuar crescendo sempre."
  ],
  correta:0,
  gabarito:"É a Lei de Amdahl lida no relatório do profiler. Com p &rarr; &infin;, o tempo da parte paralelizável vai a zero e sobra a parte serial:<br><br>S<sub>max</sub> = 1 / (1 &minus; 0,30) = 1 / 0,70 &asymp; <b>1,43&times;</b>.<br><br>Mesmo com 1000 núcleos, o programa fica no máximo 43% mais rápido — porque 70% do tempo continua sendo executado em sequência.<br><br><b>A conclusão prática:</b> antes de escrever qualquer thread, olhe a coluna <code>% time</code>. Se o maior hotspot não tem peso, o caminho é trocar o algoritmo, não paralelizar."
},
{
  id:"ds32", mod:"desempenho", dif:"medio", tipo:"mc",
  fonte:"Slides · Fatores de risco da paralelização",
  enunciado:"Um programa cria <b>uma thread por item</b> de uma lista de 100 000 itens, cada um com poucos microssegundos de trabalho — e fica <b>mais lento</b> que a versão sequencial. Qual fator de risco é esse?",
  opcoes:[
    "Criação excessiva de threads: o custo de criar e destruir supera o trabalho de cada item.",
    "Contenção: as threads disputam a mesma trava e passam o tempo todo esperando a vez delas.",
    "Desbalanceamento: uma thread ficou com quase todo o trabalho e as outras esperam por ela.",
    "Falta de vetorização: o compilador não conseguiu usar as instruções SIMD dentro do laço."
  ],
  correta:0,
  gabarito:"É o terceiro dos fatores de risco da aula. Cada <code>pthread_create</code> custa entrada no kernel e alocação de pilha — na casa de dezenas de microssegundos. Se o trabalho de cada item leva menos que isso, o programa gasta mais criando threads do que calculando.<br><br><b>A correção</b> é o padrão <b>despachante-operário</b>: um <i>pool</i> com tantas threads quanto núcleos, criadas uma vez, consumindo os 100 000 itens de uma fila. O custo de criação passa a ser pago uma vez só.<br><br>Os outros dois fatores de risco da aula — contenção e desbalanceamento — também derrubam desempenho, mas aqui o sintoma (ficar mais lento que o serial com tarefas minúsculas) aponta para a criação."
},
{
  id:"ds33", mod:"desempenho", dif:"facil", tipo:"vf",
  fonte:"Slides · Padrões de projeto paralelo",
  enunciado:"No padrão <b>stencil</b>, cada valor de saída depende de um <b>único</b> elemento da entrada.",
  correta:1,
  gabarito:"<b>Falso.</b> Isso é o <b>map</b>. No stencil, cada saída depende de uma <b>vizinhança</b> — no filtro da média da aula, dos 9 valores da janela 3&times;3 em volta da célula.<br><br>É essa dependência de vizinhos que faz o stencil precisar de <b>comunicação</b> nas bordas entre blocos de nós diferentes, enquanto o map não precisa de nenhuma."
},
{
  id:"ds34", mod:"desempenho", dif:"facil", tipo:"vf",
  fonte:"Slides · Medição de tempo",
  enunciado:"Na saída do comando <code>time</code> do shell, a linha <code>real</code> é o tempo de relógio (<i>wall time</i>) — o que interessa para calcular o <i>speedup</i>.",
  correta:0,
  gabarito:"<b>Verdadeiro.</b> <code>real</code> é o tempo do relógio de parede, do começo ao fim da execução. É ele que entra em S = T<sub>serial</sub> / T<sub>paralelo</sub>.<br><br>As outras duas linhas são tempo de <b>CPU</b>: <code>user</code> (somado de todas as threads, em modo usuário) e <code>sys</code> (dentro do núcleo). Num programa paralelo, <code>user</code> costuma ser maior que <code>real</code> — e essa diferença é a própria medida de quantos núcleos trabalharam."
},
{
  id:"ds35", mod:"desempenho", dif:"facil", tipo:"code",
  fonte:"Prática · Medição de tempo",
  enunciado:"Meça o tempo da função <code>funcao_a_medir()</code> com <code>clock()</code>, como nos slides. Escreva as <b>4 linhas</b>: as duas leituras do relógio e a impressão do tempo em segundos.",
  cod:"#include <stdio.h>\n#include <time.h>\n\nvoid funcao_a_medir(void);\n\nint main(void) {\n    /* escreva aqui */\n\n    return 0;\n}",
  chaves:["clock","CLOCKS_PER_SEC","printf"],
  modelo:"    long int inicio = clock();\n    funcao_a_medir();\n    long int fim = clock();\n\n    printf(\"total: %.3f s\\n\", (float)(fim - inicio) / (float)CLOCKS_PER_SEC);",
  gabarito:"A conta é <code>(ticks_fim &minus; ticks_inicio) / CLOCKS_PER_SEC</code>, e o <code>(float)</code> é obrigatório: sem ele a divisão é inteira e o tempo sai <b>0</b> para qualquer coisa que leve menos de um segundo.<br><br><b>A ressalva que vale a nota:</b> em Linux o <code>clock()</code> mede <b>tempo de CPU</b>, não o relógio. Para medir o ganho de um programa paralelo use <code>omp_get_wtime()</code>, <code>clock_gettime(CLOCK_MONOTONIC, …)</code> ou o <code>real</code> do comando <code>time</code>.<br><br>Meça só o trecho de interesse: ler o arquivo de entrada não faz parte do que você paralelizou."
},
{
  id:"ds36", mod:"desempenho", dif:"facil", tipo:"code",
  fonte:"Prática · SPMD",
  enunciado:"Escreva as <b>duas atribuições</b> que dão a faixa de trabalho da thread no estilo SPMD: <code>N</code> elementos divididos entre <code>p</code> threads, esta é a de identificador <code>id</code>, e a <b>última</b> fica com o resto da divisão.",
  cod:"/* chamada por cada thread: faixa(1000, 3, id, &ini, &fim) */\nvoid faixa(int N, int p, int id, int *ini, int *fim) {\n    /* escreva as 2 atribuicoes */\n}",
  chaves:["ini","fim","id","p"],
  modelo:"    *ini = id * (N / p);\n    *fim = (id == p - 1) ? N : (id + 1) * (N / p);",
  gabarito:"É a conta que faz o SPMD funcionar: o mesmo código em todas as threads, e o <code>id</code> dizendo em que pedaço cada uma trabalha.<br><br><b>O detalhe do resto:</b> com N = 1000 e p = 3, <code>N/p</code> é 333 e três faixas de 333 cobrem apenas 999 elementos. Por isso a última thread vai até <code>N</code> — senão o último elemento nunca é processado, e o programa fica certo em quase todo teste.<br><br>A alternativa é distribuir o resto entre as primeiras threads, o que balanceia melhor quando o resto é grande."
},
{
  id:"ds37", mod:"desempenho", dif:"medio", tipo:"code",
  fonte:"Lab · Projeto e análise de programas paralelos, Q1",
  enunciado:"O laboratório dá T<sub>serial</sub> = n² e T<sub>paralelo</sub> = n²/p + log<sub>2</sub>(p). Escreva o <b>corpo da função</b> que calcula e imprime o ganho e a eficiência para um par (n, p).",
  cod:"#include <stdio.h>\n#include <math.h>      /* compilar com -lm */\n\nvoid linha(double n, int p) {\n    /* escreva: Tserial, Tparalelo, S = Tserial/Tparalelo, E = S/p\n       e um printf com n, p, S e E                               */\n}",
  chaves:["log2","printf",["s =","speedup","ganho"],["e =","eficiencia"]],
  modelo:"    double t_serial   = n * n;\n    double t_paralelo = n * n / p + log2(p);\n\n    double S = t_serial / t_paralelo;\n    double E = S / p;\n\n    printf(\"n=%4.0f  p=%3d  S=%7.2f  E=%5.2f\\n\", n, p, S, E);",
  gabarito:"Com <b>p = 1</b> o <code>log2(1)</code> é 0, então T<sub>paralelo</sub> = T<sub>serial</sub>, S = 1 e E = 1 — é a conferência de que a fórmula foi digitada certa.<br><br>Rodando para n = 10, 20, 40, 80, 160, 320 e p = 1, 2, 4, …, 128, aparecem as duas tendências que o laboratório pergunta:<br><br>&bull; com <b>n fixo e p crescendo</b>, o termo <code>log2(p)</code> passa a pesar e a <b>eficiência cai</b>;<br>&bull; com <b>p fixo e n crescendo</b>, o n² domina o log e a <b>eficiência sobe</b>, tendendo a 1.<br><br>É o mesmo fenômeno da escalabilidade fraca: para manter a eficiência ao aumentar p, é preciso aumentar o problema junto."
},
{
  id:"ds38", mod:"desempenho", dif:"facil", tipo:"code",
  fonte:"Lab · Projeto e análise de programas paralelos, Q3",
  enunciado:"Escreva o corpo da função que devolve o <b>fator de balanceamento</b> de uma execução: a média dos tempos das threads dividida pelo <b>maior</b> deles.",
  cod:"/* tempos[] tem o tempo de cada uma das n threads */\ndouble fator_balanceamento(double tempos[], int n) {\n    /* escreva aqui */\n}",
  chaves:["for",["soma","media"],["maior","max"],"return"],
  modelo:"    double soma = 0, maior = 0;\n\n    for (int i = 0; i < n; i++) {\n        soma += tempos[i];\n        if (tempos[i] > maior) maior = tempos[i];\n    }\n\n    return (soma / n) / maior;",
  gabarito:"Fator = T<sub>médio</sub> / T<sub>max</sub>. Quanto mais perto de <b>1</b>, melhor distribuído está o trabalho; perto de 0, uma thread carrega quase tudo.<br><br>Nos tempos do laboratório — A = {4, 3, 7, 5} e B = {1, 8, 4, 6} — as duas têm média <b>4,75</b>, mas o máximo muda: 7 contra 8. Fator de A &asymp; <b>0,68</b>, de B &asymp; <b>0,59</b>.<br><br>E o <b>máximo é o tempo da execução</b>, porque o <code>join</code> espera a thread mais lenta: A também é a mais rápida, com 7 s contra 8 s. Melhor balanceamento e menor tempo andam juntos aqui."
},
{
  id:"ds39", mod:"desempenho", dif:"facil", tipo:"disc",
  fonte:"Aula 08 · Projeto e Análise · Métricas",
  enunciado:"Defina <b>ganho (speedup)</b> e <b>eficiência</b>. Qual tempo deve ser usado como T<sub>serial</sub>, e por que a escolha errada invalida a análise?",
  chaves:[["S = T_serial / T_paralelo", "T serial", "Tserial", "S =", "razão", "razao", "dividido"], ["E = S / p", "E = S", "S/p", "dividido pelo número de processadores"], ["T_serial é o melhor algoritmo serial conhecido", "melhor algoritmo serial", "melhor versão serial", "melhor serial"], ["não é o paralelo com uma thread", "uma thread", "1 thread", "p = 1", "não é o paralelo", "nao e o paralelo"], ["usar a base errada infla o ganho", "infla", "superestima", "aumenta", "mentira", "errado", "mascara"]],
  gabarito:"<b>Ganho:</b> S = T<sub>serial</sub> / T<sub>paralelo</sub> — quantas vezes o programa ficou mais rápido.<br><br><b>Eficiência:</b> E = S / p — quanto de cada processador virou trabalho útil. Com S = 4 e p = 4, E = 1 (ganho linear, o ideal). Com S = 3,2 e p = 4, E = 0,8: 20% se perdeu em <i>overhead</i>.<br><br><b>Qual T<sub>serial</sub>:</b> o tempo do <b>melhor algoritmo serial conhecido</b> para o problema — <b>não</b> o programa paralelo rodando com uma thread.<br><br><b>Por que isso invalida a análise:</b> a versão paralela com p = 1 já carrega o custo do OpenMP (abrir a região, a cópia do <code>reduction</code>, otimizações perdidas) e pode até usar um <b>algoritmo diferente</b>, escolhido só por ser paralelizável. Usá-la como base <b>infla todos os ganhos da tabela</b>.<br><br>O caso extremo é o algoritmo 4 da lista de OpenMP: ganho de 4,07&times; contra a base errada e de <b>0,26&times;</b> contra o melhor serial — a paralelização, na verdade, deixou o programa quatro vezes mais lento."
},
{
  id:"ds40", mod:"desempenho", dif:"medio", tipo:"disc",
  fonte:"Aula 08 · Projeto e Análise · Lei de Amdahl",
  enunciado:"Enuncie a <b>lei de Amdahl</b>. Um programa tem <b>5%</b> de parte estritamente serial: qual é o ganho máximo com infinitos processadores? E com 16?",
  chaves:[["S = 1 / (f + (1-f)/p)", "1 / (f", "fração serial", "fracao serial", "fórmula", "formula"], ["com p infinito S = 1/f", "1/f", "1 / 0,05", "limite"], ["o teto é 20 vezes", "20"], ["com 16 processadores cerca de 9,1", "9,1", "9.1", "9,14", "9"], ["a parte serial domina", "parte serial", "domina", "limita", "gargalo", "não adianta", "nao adianta"]],
  gabarito:"<b>Lei de Amdahl:</b> se uma fração <b>f</b> do programa é estritamente serial e o resto paraleliza perfeitamente, então<br><br>S(p) = 1 / ( f + (1 &minus; f)/p )<br><br><b>Com p → ∞:</b> S = 1/f = 1/0,05 = <b>20&times;</b>. Esse é o <b>teto absoluto</b>, por mais processadores que existam.<br><br><b>Com p = 16:</b><br>S = 1 / (0,05 + 0,95/16) = 1 / (0,05 + 0,0594) = 1 / 0,1094 = <b>9,14&times;</b><br>Eficiência: 9,14/16 = 0,57 — com 5% de serial, já se perde 43% dos processadores em 16.<br><br><b>A leitura que importa:</b> dobrar de 16 para 32 processadores levaria o ganho de 9,14 para apenas 10,6. A parte serial passa a dominar o tempo total, e investir em mais processadores deixa de compensar — compensa <b>reduzir f</b>.<br><br>Amdahl supõe <b>problema de tamanho fixo</b>. É essa suposição que a lei de Gustafson questiona."
},
{
  id:"ds41", mod:"desempenho", dif:"medio", tipo:"disc",
  fonte:"Aula 08 · Projeto e Análise · Amdahl × Gustafson",
  enunciado:"Amdahl diz que o ganho tem um teto baixo; Gustafson diz que máquinas paralelas são úteis. As duas leis se contradizem? Explique.",
  chaves:[["não se contradizem, respondem perguntas diferentes", "não se contradizem", "nao se contradizem", "perguntas diferentes", "hipóteses diferentes", "pressupostos"], ["Amdahl fixa o tamanho do problema", "tamanho fixo", "problema fixo", "mesmo problema", "fixa"], ["Gustafson fixa o tempo e aumenta o problema", "aumenta o problema", "problema maior", "cresce", "tempo fixo", "escala o problema"], ["na prática usa-se mais processador para resolver problemas maiores", "problemas maiores", "mais dados", "maior resolução", "na prática", "na pratica"]],
  gabarito:"<b>Não se contradizem</b> — elas respondem a perguntas diferentes, com hipóteses diferentes.<br><br><b>Amdahl</b> pergunta: <i>“tenho este problema, de tamanho fixo; quanto mais rápido ele fica com p processadores?”</i> Com o tamanho fixo, a parte serial é uma constante que não encolhe, e o ganho bate num teto de 1/f. É a lei da <b>escalabilidade forte</b>.<br><br><b>Gustafson</b> pergunta: <i>“tenho este tempo disponível; que problema consigo resolver com p processadores?”</i> Na prática, quem compra uma máquina maior quase nunca quer a mesma simulação mais rápida — quer uma malha mais fina, mais partículas, mais dados. Quando o problema cresce junto com p, a parte paralela cresce e a <b>fração serial encolhe</b>. O ganho escalonado fica S = p &minus; f(p &minus; 1), que cresce quase linearmente. É a lei da <b>escalabilidade fraca</b>.<br><br><b>Em uma frase:</b> Amdahl descreve o limite de acelerar o mesmo trabalho; Gustafson descreve o ganho de fazer mais trabalho no mesmo tempo. Ambas estão certas — a pergunta é qual delas corresponde ao seu uso real."
},
{
  id:"ds42", mod:"desempenho", dif:"facil", tipo:"disc",
  fonte:"Aula 08 · Projeto e Análise · Escalabilidade",
  enunciado:"Diferencie <b>escalabilidade forte</b> e <b>escalabilidade fraca</b>, e diga qual delas as tabelas da lista de OpenMP medem.",
  chaves:[["forte: problema fixo, mais processadores", "problema fixo", "tamanho fixo", "mesmo problema", "forte"], ["fraca: problema cresce junto com p", "cresce", "aumenta", "proporcional", "por processador", "fraca"], ["na forte quer-se manter a eficiência", "eficiência", "eficiencia", "manter", "cai"], ["as tabelas medem escalabilidade forte", "forte", "N fixo", "tamanho fixo", "mesmo N"]],
  gabarito:"&bull; <b>Escalabilidade forte</b> — o problema tem <b>tamanho fixo</b> e aumenta-se o número de processadores. A pergunta é: o tempo cai proporcionalmente? A eficiência se mantém? É o cenário de Amdahl, e é difícil: com N fixo, a fatia de cada thread encolhe e o <i>overhead</i> passa a pesar.<br><br>&bull; <b>Escalabilidade fraca</b> — o problema <b>cresce junto</b> com o número de processadores, mantendo o trabalho por processador constante. A pergunta é: o tempo se mantém? É o cenário de Gustafson, e é mais fácil de sustentar.<br><br><b>As tabelas da lista medem escalabilidade FORTE.</b> O passo 7 manda repetir com 1, 2, 4 e 8 threads <b>mantendo N</b>. Por isso a eficiência cair de ~1,0 para ~0,5 é o resultado normal — e a análise pedida é explicar <b>por quê</b>: overhead da região paralela, saturação da banda de memória, núcleos lógicos em vez de físicos ou desbalanceamento.<br><br>Para medir a fraca, bastaria multiplicar N pelo número de threads a cada linha da tabela e verificar se o tempo fica constante."
},
{
  id:"ds43", mod:"desempenho", dif:"medio", tipo:"disc",
  fonte:"Aula 08 · Projeto e Análise · Balanceamento (exercício de cálculo)",
  enunciado:"Quatro threads levaram 10 s, 12 s, 9 s e 20 s. Calcule o tempo total da região paralela, o <b>fator de balanceamento</b> e diga quanto tempo foi desperdiçado.",
  chaves:[["o total é 20 s, o da thread mais lenta", "20", "mais lenta", "máximo", "maximo", "pior"], ["a média é 12,75", "12,75", "12.75", "51/4"], ["o fator é 0,64", "0,64", "0.64", "64%"], ["desperdiçaram-se 29 s de 80", "29", "80", "36%", "ocioso"]],
  gabarito:"<b>Tempo total:</b> a região paralela só termina quando a <b>última</b> thread termina — há uma barreira implícita no fim. Logo T = <b>20 s</b>, o tempo da mais lenta. As outras três ficam <b>paradas</b> esperando.<br><br><b>Tempo médio:</b> (10 + 12 + 9 + 20) / 4 = 51/4 = <b>12,75 s</b>.<br><br><b>Fator de balanceamento:</b> T<sub>médio</sub> / T<sub>máximo</sub> = 12,75 / 20 = <b>0,64</b>. Quanto mais perto de 1, melhor o balanceamento; 0,64 indica um desequilíbrio sério.<br><br><b>Desperdício:</b> capacidade total = 4 × 20 = 80 s·thread; trabalho útil = 51 s·thread. Perderam-se <b>29 s·thread</b>, ou <b>36%</b> da máquina, em espera.<br><br><b>O que fazer:</b> se as iterações têm custo imprevisível, trocar <code>schedule(static)</code> por <code>dynamic</code> ou <code>guided</code>. Se o custo é previsível e decrescente, <code>guided</code>. Se a divisão do trabalho é estrutural, repensar a decomposição."
},
{
  id:"ds44", mod:"desempenho", dif:"facil", tipo:"disc",
  fonte:"Aula 08 · Projeto e Análise · Metodologia de medição",
  enunciado:"Por que uma única medição de tempo não é confiável? Descreva o procedimento correto e explique o que é o <b>aquecimento</b>.",
  chaves:[["a máquina tem outras coisas rodando", "outros processos", "sistema operacional", "ruído", "ruido", "variação", "variacao", "interferência"], ["a primeira execução paga cache fria", "cache fria", "cache", "primeira", "alocação", "alocacao", "first touch", "páginas"], ["descartar a primeira execução", "descartar", "ignorar", "jogar fora", "aquecimento", "warm"], ["repetir e usar o melhor ou a mediana", "repetir", "melhor de", "mediana", "várias", "varias", "média", "media"], ["relatar a dispersão", "desvio", "dispersão", "dispersao", "variação", "mínimo e máximo", "intervalo"]],
  gabarito:"<b>Por que uma medição não basta:</b> o tempo medido inclui tudo o que mais estava acontecendo na máquina — outros processos, o escalonador do sistema operacional, variação de frequência da CPU. Duas execuções seguidas do mesmo programa podem diferir facilmente em 20%.<br><br><b>O aquecimento:</b> a <b>primeira</b> execução é sistematicamente mais lenta porque paga coisas que só acontecem uma vez — trazer os dados para a cache, alocar de fato as páginas de memória (<i>first touch</i>), carregar as bibliotecas. Ela mede o sistema operacional, não o algoritmo. Por isso roda-se uma vez e <b>descarta-se</b> o resultado.<br><br><b>O procedimento:</b><br><b>1.</b> Uma execução de aquecimento, descartada.<br><b>2.</b> Repetir a medição N vezes (3 a 10).<br><b>3.</b> Ficar com o <b>melhor</b> tempo (o mais próximo do algoritmo puro) ou com a <b>mediana</b> (mais robusta que a média, que uma execução ruim distorce).<br><b>4.</b> Relatar também a <b>dispersão</b> — se os tempos variam muito, a conclusão é frágil.<br><b>5.</b> Usar <code>omp_get_wtime()</code>, não <code>clock()</code>.<br><br><b>Armadilha real:</b> se você chamar a mesma função pura com os mesmos argumentos N vezes, o compilador com <code>-O2</code> pode calcular <b>uma vez só</b> — e o melhor de N vira 0,000 s. Tempo zero é sinal de erro de medição, não de velocidade."
},
{
  id:"ds45", mod:"desempenho", dif:"medio", tipo:"disc",
  fonte:"Aula 08 · Projeto e Análise · Overhead",
  enunciado:"Cite as principais <b>fontes de overhead</b> de um programa paralelo e explique por que a eficiência cai à medida que se acrescentam threads mesmo quando não há nenhum erro no código.",
  chaves:[["criar e destruir threads", "criar", "criação", "criacao", "abrir", "time de threads"], ["sincronização: barreiras e travas", "barreira", "sincroniz", "trava", "critical", "espera"], ["comunicação e coerência de cache", "comunicação", "comunicacao", "coerência", "coerencia", "invalidação", "falso compartilhamento"], ["desbalanceamento de carga", "desbalance", "balanceamento", "carga", "ociosa"], ["trabalho extra que a versão serial não faz", "trabalho a mais", "trabalho extra", "redundante", "algoritmo diferente", "cálculo extra"], ["com p maior o overhead cresce e a fatia útil encolhe", "cresce", "encolhe", "fatia", "menor", "proporção", "proporcao"]],
  gabarito:"<b>As fontes:</b><br><br>&bull; <b>Criação e destruição de threads</b> — abrir a região paralela, criar o time, a barreira implícita no fim.<br>&bull; <b>Sincronização</b> — barreiras, <code>critical</code>, <code>atomic</code>, a combinação do <code>reduction</code>. Toda thread que espera é capacidade perdida.<br>&bull; <b>Comunicação e coerência</b> — mensagens em memória distribuída; invalidações de linha de cache e <b>falso compartilhamento</b> em memória compartilhada.<br>&bull; <b>Desbalanceamento</b> — a região termina no tempo da thread mais lenta; as demais ficam ociosas.<br>&bull; <b>Contenção por recursos</b> — a banda de memória e as caches L3 são compartilhadas e não crescem com o número de threads.<br>&bull; <b>Trabalho extra</b> — algoritmos paralelos frequentemente fazem mais operações que o melhor serial (é o caso do <code>pow</code> no algoritmo 4).<br><br><b>Por que a eficiência cai:</b> a parte útil é dividida por p e <b>encolhe</b>, enquanto a maioria desses custos <b>cresce</b> com p — mais threads para sincronizar, mais caches para manter coerentes, mais disputa pela mesma memória. Numa forma simplificada, E = 1 / (1 + p·T<sub>oh</sub>/T<sub>serial</sub>): o denominador cresce com p.<br><br>Por isso <b>eficiência decrescente é o comportamento normal</b>, e o que se pede na análise é identificar <b>qual</b> dessas fontes domina no seu caso."
},
{
  id:"ds46", mod:"desempenho", dif:"facil", tipo:"disc",
  fonte:"Aula 08 · Projeto e Análise · Medição de tempo",
  enunciado:"Qual é a diferença entre <b>relógio de parede</b> e <b>tempo de CPU</b>? Por que usar <code>clock()</code> para medir um programa OpenMP leva a uma conclusão absurda?",
  chaves:[["relógio de parede é o tempo real decorrido", "parede", "real", "decorrido", "cronômetro", "cronometro", "wall"], ["tempo de CPU soma o tempo de todas as threads", "soma", "todas as threads", "acumula", "total das threads"], ["com p threads o clock() dá cerca de p vezes mais", "p vezes", "multiplica", "cresce", "maior", "aumenta com as threads"], ["pareceria que o paralelo ficou mais lento", "mais lento", "piorou", "ganho menor que 1", "absurdo", "conclusão errada"], ["usar omp_get_wtime", "omp_get_wtime", "wtime", "gettimeofday", "relógio de parede"]],
  gabarito:"&bull; <b>Relógio de parede</b> (<i>wall clock</i>) — o tempo real decorrido, o que um cronômetro mediria. É o que interessa ao usuário.<br>&bull; <b>Tempo de CPU</b> — quanto tempo de processador foi consumido, <b>somando todas as threads</b>.<br><br><b>O absurdo:</b> num programa serial os dois coincidem. Num programa com 8 threads que roda 2 s de parede com todos os núcleos ocupados, o tempo de CPU é cerca de <b>16 s</b>. Como <code>clock()</code> em várias plataformas reporta o tempo de CPU acumulado, o “tempo” medido <b>cresce</b> conforme se acrescentam threads.<br><br>A conclusão seria que paralelizar deixou o programa mais lento — exatamente o contrário do que aconteceu. Na verdade a paralelização funcionou, e o que aumentou foi o trabalho <b>somado</b> dos processadores.<br><br><b>Use <code>omp_get_wtime()</code>:</b> devolve segundos de parede em ponto flutuante, com boa resolução, e está disponível em qualquer implementação de OpenMP. Meça só a região de interesse, deixando de fora a leitura dos dados.<br><br><b>Aliás:</b> o tempo de CPU não é inútil — a razão entre ele e o de parede é uma boa medida de quantos processadores você realmente manteve ocupados."
},
{
  id:"ds47", mod:"desempenho", dif:"dificil", tipo:"disc",
  fonte:"Aula 08 · Projeto e Análise · Eficiência e overhead",
  enunciado:"Usando E = 1 / (1 + p·T<sub>oh</sub>/T<sub>serial</sub>), calcule a eficiência para p = 4 e p = 16 quando T<sub>serial</sub> = 100 ms e o overhead por processador é T<sub>oh</sub> = 2 ms. Que conclusão de projeto isso sugere?",
  chaves:[["com p = 4 a eficiência é 0,926", "0,92", "0.92", "0,93", "92", "93"], ["com p = 16 cai para 0,758", "0,75", "0.75", "0,76", "75", "76"], ["o overhead total cresce com p", "cresce", "aumenta", "proporcional a p", "p vezes"], ["enquanto a parte útil por processador encolhe", "encolhe", "diminui", "menor", "fatia", "divide"], ["há um número ótimo de processadores", "ótimo", "otimo", "ponto", "não compensa", "nao compensa", "limite", "parar de aumentar"]],
  gabarito:"<b>Com p = 4:</b><br>E = 1 / (1 + 4 × 2/100) = 1 / 1,08 = <b>0,926</b> → ganho S = 3,70<br><br><b>Com p = 16:</b><br>E = 1 / (1 + 16 × 2/100) = 1 / 1,32 = <b>0,758</b> → ganho S = 12,1<br><br><b>O que a fórmula diz:</b> o overhead <b>total</b> é p·T<sub>oh</sub> — ele cresce linearmente com o número de processadores (mais threads para criar, mais barreiras a sincronizar, mais caches a manter coerentes). Ao mesmo tempo, a parte útil de cada processador é T<sub>serial</sub>/p, que <b>encolhe</b>. A razão entre custo e trabalho piora dos dois lados.<br><br><b>A conclusão de projeto:</b> existe um número de processadores além do qual acrescentar mais deixa de compensar. Quadruplicar de 4 para 16 multiplicou o ganho por apenas 3,3 e jogou fora um quarto da máquina.<br><br>A alavanca mais eficaz quase nunca é comprar mais processadores — é <b>reduzir T<sub>oh</sub></b>: menos barreiras, regiões paralelas maiores (abrir uma vez em vez de uma por laço), menos sincronização e eliminação de falso compartilhamento."
},
{
  id:"ds48", mod:"desempenho", dif:"medio", tipo:"disc",
  fonte:"Aula 08 · Projeto e Análise · Resultados suspeitos",
  enunciado:"Você mediu eficiência <b>1,15</b> com 4 threads — ganho <i>superlinear</i>. Isso é possível? Quais são as explicações plausíveis e qual é a mais provável numa lista de exercícios?",
  chaves:[["é possível, por efeito de cache", "cache", "possível", "possivel", "existe", "cabe"], ["com p threads há p vezes mais cache disponível", "mais cache", "soma das caches", "L1", "L2", "cada núcleo tem"], ["os dados passam a caber", "caber", "cabe", "dividido", "fatia menor"], ["mas o mais provável é erro de medição", "erro", "medição", "medicao", "base errada", "T serial", "sem aquecimento", "engano"]],
  gabarito:"<b>Sim, é possível</b> — chama-se ganho <b>superlinear</b>, e a causa real mais comum é o <b>efeito de cache</b>.<br><br>Com p threads em p núcleos, a soma das caches L1 e L2 disponíveis é p vezes maior, e cada thread trabalha com uma fatia p vezes menor dos dados. Um vetor que não cabia na cache com uma thread pode caber em pedaços com quatro — e aí o programa deixa de esperar a RAM. Como cada falta de cache custa centenas de ciclos, o ganho pode passar de p.<br><br>Outras causas legítimas: em buscas, uma thread pode encontrar a resposta cedo e encerrar o trabalho das demais.<br><br><b>Mas numa lista de exercícios a explicação mais provável é erro de medição:</b><br><br>&bull; T<sub>serial</sub> medido <b>sem aquecimento</b> — a versão serial pagou a cache fria e a alocação de páginas, e a paralela, rodando depois, já achou tudo pronto;<br>&bull; uma única execução de cada, com a máquina ocupada durante a serial;<br>&bull; o compilador otimizando as duas versões de forma diferente;<br>&bull; trabalho a menos na versão paralela (um resultado que não é usado e foi eliminado).<br><br><b>O que fazer:</b> repetir com aquecimento e melhor de N, conferir que as duas versões produzem o <b>mesmo resultado</b>, e só então reportar — explicando a causa, se o efeito persistir."
}

]);
