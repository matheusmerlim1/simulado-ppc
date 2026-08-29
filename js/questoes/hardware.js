/* ─── Hardware Paralelo ─────────────────────────────────────
   P2 · 17 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"hw01", mod:"hardware", dif:"facil", tipo:"mc",
  fonte:"Slides · Taxonomia de Flynn",
  enunciado:"Sobre o que a <b>Taxonomia de Flynn</b> classifica as arquiteturas de computadores?",
  opcoes:[
    "Sobre o fluxo de <b>instruções</b> e o fluxo de <b>dados</b> que podem ser utilizados por ciclo: SISD, SIMD, MISD e MIMD.",
    "Sobre o número de núcleos e a frequência do processador.",
    "Sobre o tipo de memória: compartilhada ou distribuída.",
    "Sobre a hierarquia de cache: L1, L2 e L3."
  ],
  correta:0,
  gabarito:"São dois eixos, cada um com dois valores: <i>Single/Multiple Instruction</i> &times; <i>Single/Multiple Data</i>. <b>SISD</b> é a arquitetura clássica de Von Neumann; <b>SIMD</b> aplica a mesma instrução a muitos dados (GPUs, instruções vetoriais); <b>MISD</b> é rara; <b>MIMD</b> abrange supercomputadores, clusters e PCs multicore. Memória compartilhada versus distribuída é uma <b>subdivisão do MIMD</b>, não um eixo da taxonomia."
},
{
  id:"hw02", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Slides · Taxonomia de Flynn",
  enunciado:"O que caracteriza uma arquitetura <b>SIMD</b>?",
  opcoes:[
    "Uma única unidade de controle envia a mesma instrução para múltiplas ULAs, que a executam sobre dados diferentes ou aguardam a próxima; execução síncrona e determinística.",
    "Cada unidade de processamento executa instruções diferentes sobre dados diferentes, de forma assíncrona.",
    "Múltiplas instruções são aplicadas ao mesmo dado, como em vários algoritmos de criptografia tentando quebrar a mesma mensagem.",
    "Uma única instrução opera sobre um único dado por vez, como nos computadores clássicos."
  ],
  correta:0,
  gabarito:"O ponto-chave do SIMD é a <b>única unidade de controle</b>: as ULAs andam em <i>lockstep</i>. Isso é ótimo para problemas com alta regularidade (visão computacional, álgebra linear, gráficos), mas quando o código tem desvio condicional, parte das ULAs fica <b>ociosa esperando</b> — é a divergência de fluxo. As outras alternativas descrevem MIMD, MISD e SISD, nessa ordem."
},
{
  id:"hw03", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Slides · Taxonomia de Flynn",
  enunciado:"Qual é a diferença entre MIMD com <b>memória compartilhada</b> e MIMD com <b>memória distribuída</b>?",
  opcoes:[
    "Na compartilhada, todas as unidades acessam a mesma memória e se comunicam por estruturas de dados comuns; na distribuída, cada processador tem memória privada e a comunicação é por troca explícita de mensagens.",
    "Na compartilhada há um só processador; na distribuída há vários.",
    "A compartilhada é sempre mais rápida, independentemente do número de processadores.",
    "A distribuída não permite paralelismo real, apenas concorrência."
  ],
  correta:0,
  gabarito:"Memória compartilhada é o modelo do seu PC multicore — e é onde vivem pthreads e OpenMP. Memória distribuída é o modelo de <i>cluster</i> — e é onde vive o MPI. A escolha muda tudo: em memória compartilhada o problema é a <b>sincronização</b> (regiões críticas, cache coerente); em memória distribuída o problema é o <b>custo da comunicação</b>, que pode dominar o tempo total, como mostra o exercício 5 do laboratório de Hardware."
},
{
  id:"hw04", mod:"hardware", dif:"dificil", tipo:"mc",
  fonte:"Lab · Hardware Paralelo, Q1",
  enunciado:"Um processador tem pipeline de 5 estágios (Fetch, Decode, Execute, Mem-Read, Reg-Write), cada um com ciclo de <b>10 ns</b>. Qual o tempo para encher o pipeline e qual a vazão com ele cheio?",
  opcoes:[
    "Enche em 50 ns; com o pipeline cheio, sai uma instrução completa a cada 10 ns.",
    "Enche em 10 ns; com o pipeline cheio, sai uma instrução a cada 50 ns.",
    "Enche em 50 ns; com o pipeline cheio, sai uma instrução a cada 50 ns.",
    "Enche em 5 ns; com o pipeline cheio, sai uma instrução a cada 2 ns."
  ],
  correta:0,
  gabarito:"<b>Encher</b> = todos os 5 estágios ocupados = 5 &times; 10 = <b>50 ns</b> — que é também a latência de uma instrução isolada. <b>Com o pipeline cheio</b>, a cada ciclo de 10 ns uma instrução <i>sai</i> do último estágio: a vazão é de <b>1 instrução a cada 10 ns</b>. Repare que a latência individual não melhorou — melhorou a vazão, exatamente como no padrão pipeline da P1."
},
{
  id:"hw05", mod:"hardware", dif:"dificil", tipo:"mc",
  fonte:"Lab · Hardware Paralelo, Q1(c) e (d)",
  enunciado:"No mesmo processador de 5 estágios, o estágio <b>Mem-Read passa a durar 20 ns</b> (os demais continuam com 10 ns). Qual o novo tempo de enchimento, a nova vazão e o ganho em relação à implementação <b>sem</b> pipeline?",
  opcoes:[
    "Enche em 100 ns; sai 1 instrução a cada 20 ns; sem pipeline uma instrução levaria 60 ns, logo o ganho é de <b>3&times;</b>.",
    "Enche em 60 ns; sai 1 instrução a cada 12 ns; ganho de 5&times;.",
    "Enche em 50 ns; sai 1 instrução a cada 10 ns; ganho de 6&times;.",
    "Enche em 100 ns; sai 1 instrução a cada 60 ns; ganho de 1&times; (nenhum)."
  ],
  correta:0,
  gabarito:"O relógio do pipeline é ditado pelo <b>estágio mais lento</b>: todos passam a durar 20 ns, senão o dado não estaria pronto quando o próximo estágio o buscasse.<br>&bull; <b>Enchimento</b> = 5 &times; 20 = <b>100 ns</b>.<br>&bull; <b>Vazão</b> = 1 instrução a cada <b>20 ns</b>.<br>&bull; <b>Sem pipeline</b>, uma instrução leva a soma real dos estágios: 10+10+10+20+10 = <b>60 ns</b>.<br>&bull; <b>Ganho</b> = 60 / 20 = <b>3&times;</b> (contra 5&times; do caso balanceado).<br><br>Lição: um único estágio desbalanceado <b>rouba desempenho de todo o pipeline</b>, porque os outros quatro ficam ociosos 10 ns por ciclo. É o mesmo princípio do balanceamento de carga entre threads."
},
{
  id:"hw06", mod:"hardware", dif:"dificil", tipo:"mc",
  fonte:"Lab · Hardware Paralelo, Q2",
  enunciado:"Compare os dois laços de multiplicação matriz&times;vetor. Considere <code>MAX = 8</code>, uma cache de <b>4 linhas</b>, cada linha guardando <b>4 doubles</b>, com mapeamento direto. Quantas faltas (<i>misses</i>) na leitura de <code>A</code> em cada par de laços?",
  cod:"/* (1) por LINHAS */                  /* (2) por COLUNAS */\nfor (i = 0; i < MAX; i++)            for (j = 0; j < MAX; j++)\n  for (j = 0; j < MAX; j++)            for (i = 0; i < MAX; i++)\n    y[i] += A[i][j] * x[j];              y[i] += A[i][j] * x[j];",
  opcoes:[
    "(1) 16 misses — 1 a cada 4 acessos, pois cada linha de cache traz 4 doubles usados em sequência. (2) 64 misses — todo acesso falha, porque o salto de 8 doubles evicta as linhas antes do reuso.",
    "(1) 64 misses e (2) 16 misses — o acesso por colunas é o mais eficiente em C.",
    "(1) 16 e (2) 16 — o padrão de acesso não afeta a cache, apenas o tamanho da matriz.",
    "(1) 8 e (2) 8 — uma falta por linha da matriz, em ambos os casos."
  ],
  correta:0,
  gabarito:"A matriz tem 8&times;8 = 64 <code>double</code>s e, em C, é armazenada <b>por linhas</b> (<i>row-major</i>).<br><br><b>Laço (1), por linhas:</b> <code>A[i][j]</code> avança sequencialmente na memória. O acesso a <code>A[i][0]</code> traz a linha de cache com <code>A[i][0..3]</code>; os três seguintes são <i>hits</i>. Resultado: 1 miss a cada 4 acessos = 64/4 = <b>16 misses</b>. Excelente <b>localidade espacial</b>.<br><br><b>Laço (2), por colunas:</b> com <code>j</code> fixo, o programa acessa <code>A[0][j]</code>, <code>A[1][j]</code>, ... — saltos de 8 doubles, ou 2 linhas de cache. Como a cache só tem 4 linhas, quando o laço volta para <code>j+1</code> a linha de <code>A[0][j]</code> já foi expulsa. Nenhum dos 3 doubles trazidos junto chega a ser reaproveitado: <b>64 misses</b>, um por acesso.<br><br><b>Sobre os itens (a) e (b) do laboratório:</b> uma cache maior beneficia muito mais o laço (2) (a partir do momento em que a matriz inteira couber, ele passa a ter os mesmos 16 misses); uma matriz maior piora ambos, mas destrói o (2). Moral: <b>percorra as matrizes na ordem em que estão na memória</b> — e isso vale antes mesmo de paralelizar."
},
{
  id:"hw07", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Slides · Hardware Paralelo",
  enunciado:"O que são <b>localidade espacial</b> e <b>localidade temporal</b>?",
  opcoes:[
    "Espacial: se um endereço é acessado, os vizinhos provavelmente serão acessados logo. Temporal: se um endereço é acessado, ele provavelmente será acessado de novo em breve.",
    "Espacial: o dado está na mesma máquina. Temporal: o dado está no mesmo ciclo de relógio.",
    "Espacial: refere-se à cache L1. Temporal: refere-se à cache L2.",
    "Espacial: threads no mesmo núcleo. Temporal: threads na mesma fatia de tempo."
  ],
  correta:0,
  gabarito:"São os dois princípios que fazem a cache funcionar. A <b>localidade espacial</b> é explorada trazendo uma <i>linha</i> inteira de memória e não apenas a palavra pedida — por isso percorrer o vetor sequencialmente é rápido. A <b>localidade temporal</b> é explorada mantendo o dado na cache após o uso — por isso variáveis de laço e acumuladores são baratos. O laço por colunas do exercício anterior destrói a localidade espacial."
},
{
  id:"hw08", mod:"hardware", dif:"dificil", tipo:"mc",
  fonte:"Lab · Hardware Paralelo, Q3",
  enunciado:"Por que o desempenho de um processador <i>multithread</i> pode <b>degradar</b> se ele tiver uma cache grande e executar muitas threads?",
  opcoes:[
    "As threads competem pela mesma cache: cada troca de contexto traz os dados de outra thread e expulsa os da anterior (<i>cache thrashing</i>). A cache grande demora mais para ser reaquecida, e a taxa de acerto efetiva por thread despenca.",
    "Caches grandes têm latência de acesso menor, o que causa conflito no barramento.",
    "O número de threads não pode exceder o número de linhas de cache, senão o processador gera exceção.",
    "Threads não usam cache — apenas processos usam."
  ],
  correta:0,
  gabarito:"Cada thread tem seu próprio <i>working set</i>. Se a soma dos conjuntos de trabalho não cabe na cache, as threads passam a se <b>expulsar mutuamente</b>: a thread A carrega seus dados, é preemptada, a thread B expulsa tudo, e quando A volta precisa recarregar. O tempo gasto reaquecendo a cache pode superar o ganho da concorrência. Um efeito relacionado é o <b>falso compartilhamento</b>: duas threads escrevendo em variáveis distintas que caem na <b>mesma linha de cache</b> forçam invalidações constantes entre os núcleos, mesmo sem haver compartilhamento lógico algum."
},
{
  id:"hw09", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Lab · Hardware Paralelo, Q4",
  enunciado:"Como uma máquina <b>SIMD</b> paralelizaria o código abaixo?",
  cod:"sum = 0.0;\nfor (i = 0; i < n; i++) {\n    y[i] += a * x[i];      /* (1) */\n    sum  += z[i] * z[i];   /* (2) */\n}",
  opcoes:[
    "A linha (1) é vetorizada diretamente — a mesma operação sobre elementos independentes. A linha (2) é uma <b>redução</b>: há dependência em <code>sum</code>, então é preciso acumular em somas parciais vetoriais e combiná-las ao final, em árvore.",
    "As duas linhas são vetorizadas diretamente, pois não há dependências.",
    "Nenhuma das duas pode ser vetorizada, porque o laço tem duas instruções distintas.",
    "Só a linha (2) pode ser vetorizada; a (1) tem dependência em <code>y[i]</code>."
  ],
  correta:0,
  gabarito:"A linha (1) é o caso ideal do SIMD: cada iteração escreve numa posição distinta de <code>y</code> e lê uma distinta de <code>x</code> — <b>sem dependência entre iterações</b>. Já a linha (2) acumula tudo numa <b>única variável escalar</b>, criando dependência de uma iteração para a outra. A saída padrão é manter um vetor de acumuladores parciais (um por &ldquo;pista&rdquo; do SIMD) e, no fim, reduzi-los em árvore, em log<sub>2</sub>(p) passos. Este é exatamente o mesmo raciocínio que na P1 separava a soma com acumulador privado da soma com variável compartilhada — e é o que o <code>reduction(+:sum)</code> do OpenMP automatiza."
},
{
  id:"hw10", mod:"hardware", dif:"dificil", tipo:"mc",
  fonte:"Lab · Hardware Paralelo, Q5",
  enunciado:"Um programa precisa de 10<sup>12</sup> instruções e um sistema de um só processador executa 10<sup>6</sup> instruções por segundo (levando 10<sup>6</sup> s &asymp; 12 dias). Paralelizado para memória distribuída com <b>p = 1000</b>, cada processador executa 10<sup>12</sup>/p instruções e envia 10<sup>9</sup>(p&minus;1) mensagens. Quanto tempo o programa leva se cada mensagem custar <b>10<sup>&minus;9</sup> s</b>?",
  opcoes:[
    "Cerca de <b>2000 s</b>: 1000 s de computação (10<sup>9</sup> instruções a 10<sup>6</sup>/s) mais &asymp; 999 s de comunicação.",
    "Cerca de 1000 s: só a computação conta, pois a comunicação é desprezível.",
    "Cerca de 10<sup>6</sup> s: o mesmo tempo do programa serial.",
    "Cerca de 10<sup>9</sup> s: a comunicação domina completamente."
  ],
  correta:0,
  gabarito:"<b>Computação:</b> 10<sup>12</sup>/1000 = 10<sup>9</sup> instruções por processador, a 10<sup>6</sup> instr/s &rarr; <b>10<sup>3</sup> = 1000 s</b>.<br><b>Comunicação:</b> 10<sup>9</sup> &times; (1000&minus;1) = 9,99&times;10<sup>11</sup> mensagens &times; 10<sup>&minus;9</sup> s &rarr; <b>&asymp; 999 s</b>.<br><b>Total &asymp; 1999 s</b>, contra 10<sup>6</sup> s do serial — <i>speedup</i> de cerca de <b>500&times;</b> com 1000 processadores (eficiência &asymp; 0,5), porque metade do tempo é gasta se comunicando.<br><br><b>Compare com o item (b):</b> se a mensagem custasse 10<sup>&minus;3</sup> s, a comunicação levaria 9,99&times;10<sup>8</sup> s &asymp; 10<sup>9</sup> s — <b>mil vezes pior que o programa serial</b>. Mesmo algoritmo, mesma máquina, mesmo número de processadores: só mudou o custo da mensagem. É a demonstração mais direta de que, em memória distribuída, <b>a rede pode aniquilar todo o ganho</b>."
},
{
  id:"hw11", mod:"hardware", dif:"facil", tipo:"mc",
  fonte:"Slides · Apresentação da disciplina",
  enunciado:"Por que, a partir de 2005, os fabricantes passaram a colocar múltiplos processadores num único circuito integrado em vez de continuar aumentando a frequência?",
  opcoes:[
    "Porque o aumento de frequência esbarrou na potência dissipada e no calor gerado — o ganho de desempenho por geração caiu de 100% a cada 2 anos para cerca de 20% ao ano.",
    "Porque os transistores pararam de diminuir de tamanho, encerrando a Lei de Moore.",
    "Porque os programas seriais passaram a ser automaticamente convertidos em paralelos pelos compiladores.",
    "Porque a memória RAM ficou mais barata que o processador."
  ],
  correta:0,
  gabarito:"A Lei de Moore (mais transistores) continuou valendo por um bom tempo; o que quebrou foi o aumento de <b>frequência</b>, barrado pela dissipação de potência. A saída foi usar os transistores extras para colocar mais <b>núcleos</b>. E aí vem a consequência que motiva a disciplina inteira, citada nos slides: <i>&ldquo;simplesmente acrescentar processadores não vai magicamente melhorar o desempenho de programas seriais&rdquo;</i> — alguém precisa reescrever o programa."
},
{
  id:"hw12", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Slides · Definições",
  enunciado:"O que é <b>granularidade</b> em programação paralela?",
  opcoes:[
    "Uma medida de quão frequentemente ocorre comunicação entre as tarefas em execução — granularidade fina significa muita comunicação para pouco cálculo.",
    "O número de núcleos disponíveis na máquina.",
    "O tamanho em bytes de cada dado processado por uma tarefa.",
    "A menor fatia de tempo que o escalonador concede a uma thread."
  ],
  correta:0,
  gabarito:"<b>Granularidade fina</b>: tarefas pequenas, comunicação frequente. Bom para balanceamento de carga, ruim porque o <i>overhead</i> pode dominar. <b>Granularidade grossa</b>: tarefas grandes, pouca comunicação. Melhor razão cálculo/comunicação, mas risco de desbalanceamento. Escolher a granularidade certa é uma das decisões centrais de projeto — e é exatamente o que se ajusta com <code>schedule(static|dynamic, chunk)</code> no OpenMP."
},
{
  id:"hw13", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Lab · Introdução, Q1",
  enunciado:"Para distribuir o laço <code>for (i = 0; i &lt; MAX; i++) sum += i;</code> entre <b>p</b> nós de processamento, qual fórmula dá o intervalo de cada nó <b>n</b>?",
  opcoes:[
    "<code>my_min = n &times; (MAX/p)</code> e <code>my_max = (n+1) &times; (MAX/p)</code>, com o último nó absorvendo o resto da divisão.",
    "<code>my_min = n</code> e <code>my_max = MAX &minus; n</code>.",
    "<code>my_min = n &times; p</code> e <code>my_max = MAX/p</code>.",
    "<code>my_min = 0</code> e <code>my_max = MAX</code> para todos os nós, com sincronização por mutex."
  ],
  correta:0,
  gabarito:"É a <b>partição por blocos</b>: divide-se <code>MAX</code> em p faixas contíguas. Cuidado obrigatório: se <code>MAX</code> não for múltiplo de <code>p</code>, os elementos finais ficariam de fora — por isso o último nó recebe <code>my_max = MAX</code>. Cada nó calcula sua soma parcial em variável privada e, ao final, um nó mestre acumula tudo (ou faz-se a soma em árvore). É a mesma partição usada nos laboratórios de threads da P1."
},
{
  id:"hw14", mod:"hardware", dif:"dificil", tipo:"mc",
  fonte:"Lab · Introdução, Q2",
  enunciado:"Considere o laço abaixo, em que <code>Compute_value(i)</code> tem tempo de execução <b>linearmente crescente</b> com <i>i</i>. Qual estratégia de paralelização é a mais adequada?",
  cod:"for (int i = 0; i < MAX; i++) {\n    x = Compute_value(i);   /* tempo cresce com i */\n    sum += x;\n}",
  opcoes:[
    "Distribuição <b>cíclica</b> (<i>round-robin</i>: a thread <i>t</i> pega os índices <i>t</i>, <i>t+p</i>, <i>t+2p</i>, ...) ou <b>dinâmica</b>, para que cada thread receba uma mistura de índices baratos e caros.",
    "Distribuição em blocos contíguos, que é sempre a mais eficiente.",
    "Usar uma única thread, já que o tempo é variável.",
    "Ordenar o vetor antes de dividir, para igualar os custos."
  ],
  correta:0,
  gabarito:"Com distribuição em <b>blocos</b>, a thread que fica com o último bloco pega os índices mais caros e trabalha muito mais que as outras: as demais terminam e esperam, e o tempo total é o da thread mais lenta. É <b>desbalanceamento de carga</b> puro.<br><br>Na distribuição <b>cíclica</b> cada thread recebe índices espalhados por toda a faixa, e os custos se equilibram — a solução analítica quando o padrão de crescimento é conhecido. Se o custo fosse <b>imprevisível</b>, a resposta seria distribuição <b>dinâmica</b> (fila de tarefas / despachante-operário), que em OpenMP é <code>schedule(dynamic)</code>. Note que <code>sum</code> continua sendo uma redução, e precisa de tratamento próprio."
},
{
  id:"hw15", mod:"hardware", dif:"dificil", tipo:"mc",
  fonte:"Lab · Introdução, Q3",
  enunciado:"Na <b>soma em árvore</b> com p núcleos (p sendo potência de 2), quantas etapas de comunicação são necessárias e como se determina, na iteração corrente, quem envia e quem recebe?",
  opcoes:[
    "São <b>log<sub>2</sub>(p)</b> etapas. Usa-se um <code>divisor</code> que começa em 2 e dobra a cada iteração (se <code>core % divisor == 0</code> o núcleo recebe e acumula; senão envia) e um <code>core_difference</code> que começa em 1 e também dobra, indicando com qual núcleo se comunicar.",
    "São p etapas, uma por núcleo, e o núcleo mestre recebe de todos sequencialmente.",
    "São p/2 etapas, e os núcleos se comunicam sempre com o vizinho imediato.",
    "É apenas 1 etapa: todos enviam ao núcleo 0 simultaneamente."
  ],
  correta:0,
  gabarito:"Na iteração 0: <code>divisor = 2</code>, <code>core_difference = 1</code>. Como 0 % 2 = 0, o núcleo 0 <b>recebe</b>; 1 % 2 = 1, o núcleo 1 <b>envia</b>. E como 0 + 1 = 1 e 1 &minus; 1 = 0, eles se comunicam entre si. Na iteração 1, <code>divisor = 4</code> e <code>core_difference = 2</code>: o 0 recebe do 2, o 4 recebe do 6, e assim por diante. Depois de <b>log<sub>2</sub>(p)</b> etapas, o núcleo 0 tem o total.<br><br>Compare com a acumulação ingênua do núcleo mestre, que é <b>O(p)</b>: com p = 1024, a árvore faz <b>10</b> etapas contra 1023. É o exemplo dos slides sobre por que <i>&ldquo;é muito improvável que um programa tradutor encontre essa forma&rdquo;</i> — a paralelização automática não descobre esse tipo de reorganização."
},
{
  id:"hw16", mod:"hardware", dif:"facil", tipo:"vf",
  fonte:"Slides · Apresentação da disciplina",
  enunciado:"Basta acrescentar mais processadores a uma máquina para que os programas seriais existentes fiquem mais rápidos.",
  correta:1,
  gabarito:"<b>Falso.</b> É a frase que abre a disciplina: <i>&ldquo;simplesmente acrescentar processadores não vai magicamente melhorar o desempenho de programas seriais&rdquo;</i>. Um programa serial usa <b>um</b> núcleo; os outros ficam ociosos. Existem duas saídas: reescrever o programa em paralelo, ou usar programas tradutores que convertem serial em paralelo — e os slides observam que os tradutores raramente encontram as boas reorganizações, como a soma em árvore."
},
{
  id:"hw17", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Slides · Definições",
  enunciado:"Nas definições da disciplina, qual a diferença entre <b>CPU/núcleo</b> e <b>nó (node)</b>?",
  opcoes:[
    "Núcleo é a unidade de processamento dentro de um processador; nó é um computador completo, com processador(es), memória própria etc.",
    "Núcleo é o computador inteiro; nó é uma das threads em execução.",
    "São sinônimos em arquiteturas modernas.",
    "Núcleo é a unidade lógica do sistema operacional; nó é a unidade física do hardware."
  ],
  correta:0,
  gabarito:"A distinção importa quando se fala em escala: um <b>nó</b> de um cluster tem vários <b>núcleos</b>. Dentro do nó, memória compartilhada e OpenMP; entre nós, memória distribuída e MPI. Programas de alto desempenho costumam ser <b>híbridos</b>: MPI para comunicar entre nós e OpenMP para explorar os núcleos de cada um."
}

]);
