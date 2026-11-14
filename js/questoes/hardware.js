/* ─── Hardware Paralelo ─────────────────────────────────────
   P2 · 32 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"hw01", mod:"hardware", dif:"facil", tipo:"mc",
  fonte:"Slides · Taxonomia de Flynn",
  enunciado:"Sobre o que a <b>Taxonomia de Flynn</b> classifica as arquiteturas de computadores?",
  opcoes:[
    "Sobre o fluxo de <b>instruções</b> e o fluxo de <b>dados</b>: SISD, SIMD, MISD e MIMD.",
    "Sobre o número de núcleos, a frequência de relógio e o tamanho da cache do processador.",
    "Sobre o tipo de memória usada: compartilhada ou distribuída.",
    "Sobre os níveis da hierarquia de cache: L1, L2 e L3."
  ],
  correta:0,
  gabarito:"São dois eixos, cada um com dois valores: <i>Single/Multiple Instruction</i> &times; <i>Single/Multiple Data</i>. <b>SISD</b> é a arquitetura clássica de Von Neumann; <b>SIMD</b> aplica a mesma instrução a muitos dados (GPUs, instruções vetoriais); <b>MISD</b> é rara; <b>MIMD</b> abrange supercomputadores, clusters e PCs multicore. Memória compartilhada versus distribuída é uma <b>subdivisão do MIMD</b>, não um eixo da taxonomia."
},
{
  id:"hw02", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Slides · Taxonomia de Flynn",
  enunciado:"O que caracteriza uma arquitetura <b>SIMD</b>?",
  opcoes:[
    "Uma única unidade de controle envia a mesma instrução a várias ULAs, que a aplicam sobre dados diferentes; execução síncrona.",
    "Cada unidade de processamento executa instruções diferentes sobre dados diferentes, de forma assíncrona e independente das demais.",
    "Várias instruções diferentes são aplicadas ao mesmo dado, em fluxos simultâneos sobre a mesma entrada.",
    "Uma única instrução opera sobre um único dado por vez, como nos computadores sequenciais clássicos."
  ],
  correta:0,
  gabarito:"O ponto-chave do SIMD é a <b>única unidade de controle</b>: as ULAs andam em <i>lockstep</i>. Isso é ótimo para problemas com alta regularidade (visão computacional, álgebra linear, gráficos), mas quando o código tem desvio condicional, parte das ULAs fica <b>ociosa esperando</b> — é a divergência de fluxo. As descrições rivais são as de <b>MIMD</b> (instruções diferentes, assíncronas), <b>MISD</b> (várias instruções sobre o mesmo dado) e <b>SISD</b> (uma instrução, um dado)."
},
{
  id:"hw03", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Slides · Taxonomia de Flynn",
  enunciado:"Qual é a diferença entre MIMD com <b>memória compartilhada</b> e MIMD com <b>memória distribuída</b>?",
  opcoes:[
    "Na compartilhada todos acessam a mesma memória e trocam dados por estruturas comuns; na distribuída cada nó tem memória privada e troca mensagens.",
    "Na compartilhada há um só processador com vários núcleos; na distribuída há vários processadores independentes, cada um com seu próprio barramento de memória.",
    "A compartilhada é sempre mais rápida, qualquer que seja o número de processadores envolvidos no cálculo.",
    "A distribuída não permite paralelismo real: cada nó apenas alterna entre tarefas, de forma concorrente."
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
    "Enche em 10 ns; com o pipeline cheio, sai uma instrução completa a cada 50 ns.",
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
    "Enche em 100 ns; sai 1 instrução a cada 20 ns; sem pipeline ela levaria 60 ns, logo o ganho é de <b>3&times;</b>.",
    "Enche em 60 ns; sai 1 instrução a cada 12 ns; sem pipeline ela levaria 60 ns, logo o ganho é de 5&times;.",
    "Enche em 50 ns; sai 1 instrução a cada 10 ns; o estágio mais lento não muda o ritmo, e o ganho é de 6&times;.",
    "Enche em 100 ns; sai 1 instrução a cada 60 ns; o pipeline só esconde a latência, e não há ganho algum."
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
    "(1) 16 misses — a linha de cache traz 4 doubles usados em seguida. (2) 64 misses — o salto de 8 doubles expulsa a linha antes do reuso.",
    "(1) 64 misses — percorrer por linhas desperdiça cada linha de cache trazida da memória. (2) 16 misses — o acesso por colunas é o mais eficiente em C.",
    "(1) 16 misses e (2) 16 misses — o padrão de acesso não muda nada; só o tamanho da matriz importa para a cache.",
    "(1) 8 misses e (2) 8 misses — uma falta por linha da matriz nos dois laços, já que a cache tem 4 linhas."
  ],
  correta:0,
  gabarito:"A matriz tem 8&times;8 = 64 <code>double</code>s e, em C, é armazenada <b>por linhas</b> (<i>row-major</i>).<br><br><b>Laço (1), por linhas:</b> <code>A[i][j]</code> avança sequencialmente na memória. O acesso a <code>A[i][0]</code> traz a linha de cache com <code>A[i][0..3]</code>; os três seguintes são <i>hits</i>. Resultado: 1 miss a cada 4 acessos = 64/4 = <b>16 misses</b>. Excelente <b>localidade espacial</b>.<br><br><b>Laço (2), por colunas:</b> com <code>j</code> fixo, o programa acessa <code>A[0][j]</code>, <code>A[1][j]</code>, ... — saltos de 8 doubles, ou 2 linhas de cache. Como a cache só tem 4 linhas, quando o laço volta para <code>j+1</code> a linha de <code>A[0][j]</code> já foi expulsa. Nenhum dos 3 doubles trazidos junto chega a ser reaproveitado: <b>64 misses</b>, um por acesso.<br><br><b>Sobre os itens (a) e (b) do laboratório:</b> uma cache maior beneficia muito mais o laço (2) (a partir do momento em que a matriz inteira couber, ele passa a ter os mesmos 16 misses); uma matriz maior piora ambos, mas destrói o (2). Moral: <b>percorra as matrizes na ordem em que estão na memória</b> — e isso vale antes mesmo de paralelizar."
},
{
  id:"hw07", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Slides · Hardware Paralelo",
  enunciado:"O que são <b>localidade espacial</b> e <b>localidade temporal</b>?",
  opcoes:[
    "Espacial: acessar um endereço torna provável o acesso aos vizinhos. Temporal: torna provável um novo acesso ao mesmo endereço.",
    "Espacial: o dado está na mesma máquina que o processador. Temporal: o dado é usado dentro do mesmo ciclo de relógio da CPU.",
    "Espacial: diz respeito à cache L1, mais próxima. Temporal: diz respeito à cache L2, mais distante e mais lenta.",
    "Espacial: threads que rodam no mesmo núcleo físico. Temporal: threads que rodam na mesma fatia de tempo."
  ],
  correta:0,
  gabarito:"São os dois princípios que fazem a cache funcionar. A <b>localidade espacial</b> é explorada trazendo uma <i>linha</i> inteira de memória e não apenas a palavra pedida — por isso percorrer o vetor sequencialmente é rápido. A <b>localidade temporal</b> é explorada mantendo o dado na cache após o uso — por isso variáveis de laço e acumuladores são baratos. O laço por colunas do exercício anterior destrói a localidade espacial."
},
{
  id:"hw08", mod:"hardware", dif:"dificil", tipo:"mc",
  fonte:"Lab · Hardware Paralelo, Q3",
  enunciado:"Por que o desempenho de um processador <i>multithread</i> pode <b>degradar</b> se ele tiver uma cache grande e executar muitas threads?",
  opcoes:[
    "As threads disputam a mesma cache: cada troca de contexto expulsa os dados da anterior, e a cache grande demora a reaquecer.",
    "Caches grandes têm latência de acesso menor, e isso gera conflito no barramento entre as threads ativas que disputam a memória.",
    "O número de threads não pode passar do número de linhas de cache, senão o processador gera uma exceção.",
    "Threads compartilham o mesmo espaço de endereçamento e por isso não chegam a usar a cache de dados."
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
    "A linha (1) é vetorizada direto; a (2) é uma <b>redução</b>: acumula-se em somas parciais vetoriais, combinadas em árvore no fim.",
    "As duas linhas são vetorizadas diretamente, pois nenhuma delas tem dependência entre as iterações do laço.",
    "Nenhuma das duas pode ser vetorizada, porque o corpo do laço tem duas instruções distintas em sequência.",
    "Só a linha (2) pode ser vetorizada; a (1) tem dependência verdadeira em <code>y[i]</code> entre iterações."
  ],
  correta:0,
  gabarito:"A linha (1) é o caso ideal do SIMD: cada iteração escreve numa posição distinta de <code>y</code> e lê uma distinta de <code>x</code> — <b>sem dependência entre iterações</b>. Já a linha (2) acumula tudo numa <b>única variável escalar</b>, criando dependência de uma iteração para a outra. A saída padrão é manter um vetor de acumuladores parciais (um por &ldquo;pista&rdquo; do SIMD) e, no fim, reduzi-los em árvore, em log<sub>2</sub>(p) passos. Este é exatamente o mesmo raciocínio que na P1 separava a soma com acumulador privado da soma com variável compartilhada — e é o que o <code>reduction(+:sum)</code> do OpenMP automatiza."
},
{
  id:"hw10", mod:"hardware", dif:"dificil", tipo:"mc",
  fonte:"Lab · Hardware Paralelo, Q5",
  enunciado:"Um programa precisa de 10<sup>12</sup> instruções e um sistema de um só processador executa 10<sup>6</sup> instruções por segundo (levando 10<sup>6</sup> s &asymp; 12 dias). Paralelizado para memória distribuída com <b>p = 1000</b>, cada processador executa 10<sup>12</sup>/p instruções e envia 10<sup>9</sup>(p&minus;1) mensagens. Quanto tempo o programa leva se cada mensagem custar <b>10<sup>&minus;9</sup> s</b>?",
  opcoes:[
    "Cerca de <b>2000 s</b>: 1000 s de computação (10<sup>9</sup> instruções a 10<sup>6</sup>/s) e &asymp; 999 s de comunicação.",
    "Cerca de 1000 s: só a computação conta, porque o custo de cada mensagem é desprezível nessa escala.",
    "Cerca de 10<sup>6</sup> s: o mesmo tempo do serial, já que dividir não muda o total de instruções.",
    "Cerca de 10<sup>9</sup> s: a comunicação domina, com uma mensagem para cada instrução executada."
  ],
  correta:0,
  gabarito:"<b>Computação:</b> 10<sup>12</sup>/1000 = 10<sup>9</sup> instruções por processador, a 10<sup>6</sup> instr/s &rarr; <b>10<sup>3</sup> = 1000 s</b>.<br><b>Comunicação:</b> 10<sup>9</sup> &times; (1000&minus;1) = 9,99&times;10<sup>11</sup> mensagens &times; 10<sup>&minus;9</sup> s &rarr; <b>&asymp; 999 s</b>.<br><b>Total &asymp; 1999 s</b>, contra 10<sup>6</sup> s do serial — <i>speedup</i> de cerca de <b>500&times;</b> com 1000 processadores (eficiência &asymp; 0,5), porque metade do tempo é gasta se comunicando.<br><br><b>Compare com o item (b):</b> se a mensagem custasse 10<sup>&minus;3</sup> s, a comunicação levaria 9,99&times;10<sup>8</sup> s &asymp; 10<sup>9</sup> s — <b>mil vezes pior que o programa serial</b>. Mesmo algoritmo, mesma máquina, mesmo número de processadores: só mudou o custo da mensagem. É a demonstração mais direta de que, em memória distribuída, <b>a rede pode aniquilar todo o ganho</b>."
},
{
  id:"hw11", mod:"hardware", dif:"facil", tipo:"mc",
  fonte:"Slides · Apresentação da disciplina",
  enunciado:"Por que, a partir de 2005, os fabricantes passaram a colocar múltiplos processadores num único circuito integrado em vez de continuar aumentando a frequência?",
  opcoes:[
    "Porque o aumento de frequência esbarrou na potência e no calor: o ganho por geração caiu de 100% a cada 2 anos para ~20% ao ano.",
    "Porque os transistores pararam de diminuir de tamanho, o que encerrou a Lei de Moore e congelou a densidade dos circuitos integrados.",
    "Porque os compiladores passaram a converter sozinhos os programas seriais em código paralelo equivalente.",
    "Porque a memória RAM ficou mais barata que o processador, deslocando o investimento dos fabricantes."
  ],
  correta:0,
  gabarito:"A Lei de Moore (mais transistores) continuou valendo por um bom tempo; o que quebrou foi o aumento de <b>frequência</b>, barrado pela dissipação de potência. A saída foi usar os transistores extras para colocar mais <b>núcleos</b>. E aí vem a consequência que motiva a disciplina inteira, citada nos slides: <i>&ldquo;simplesmente acrescentar processadores não vai magicamente melhorar o desempenho de programas seriais&rdquo;</i> — alguém precisa reescrever o programa."
},
{
  id:"hw12", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Slides · Definições",
  enunciado:"O que é <b>granularidade</b> em programação paralela?",
  opcoes:[
    "Uma medida de quanta comunicação há entre as tarefas — granularidade fina é muita comunicação para pouco cálculo.",
    "O número de núcleos disponíveis na máquina para executar as tarefas em paralelo, incluindo os virtuais.",
    "O tamanho em bytes do bloco de dados que cada tarefa processa a cada chamada da função paralela.",
    "A menor fatia de tempo que o escalonador concede a uma thread antes de trocar de contexto."
  ],
  correta:0,
  gabarito:"<b>Granularidade fina</b>: tarefas pequenas, comunicação frequente. Bom para balanceamento de carga, ruim porque o <i>overhead</i> pode dominar. <b>Granularidade grossa</b>: tarefas grandes, pouca comunicação. Melhor razão cálculo/comunicação, mas risco de desbalanceamento. Escolher a granularidade certa é uma das decisões centrais de projeto — e é exatamente o que se ajusta com <code>schedule(static|dynamic, chunk)</code> no OpenMP."
},
{
  id:"hw13", mod:"hardware", dif:"medio", tipo:"mc",
  fonte:"Lab · Introdução, Q1",
  enunciado:"Para distribuir o laço <code>for (i = 0; i &lt; MAX; i++) sum += i;</code> entre <b>p</b> nós de processamento, qual fórmula dá o intervalo de cada nó <b>n</b>?",
  opcoes:[
    "<code>my_min = n &times; (MAX/p)</code> e <code>my_max = (n+1) &times; (MAX/p)</code>, com o último nó pegando o resto da divisão.",
    "<code>my_min = n</code> e <code>my_max = MAX &minus; n</code>, com os intervalos se sobrepondo nas bordas.",
    "<code>my_min = n &times; p</code> e <code>my_max = MAX/p</code>, dividindo o laço pelo número de nós.",
    "<code>my_min = 0</code> e <code>my_max = MAX</code> em todos os nós, com a soma protegida por um mutex compartilhado entre eles."
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
    "Distribuição <b>cíclica</b> (<i>round-robin</i>) ou <b>dinâmica</b>, para cada thread receber uma mistura de índices baratos e caros.",
    "Distribuição em blocos contíguos, que divide o laço em p faixas iguais e é sempre a mais eficiente.",
    "Execução em uma única thread, já que o custo variável impede qualquer divisão proveitosa do laço.",
    "Ordenar os índices pelo custo antes de dividir, para que as faixas fiquem com o mesmo peso."
  ],
  correta:0,
  gabarito:"Com distribuição em <b>blocos</b>, a thread que fica com o último bloco pega os índices mais caros e trabalha muito mais que as outras: as demais terminam e esperam, e o tempo total é o da thread mais lenta. É <b>desbalanceamento de carga</b> puro.<br><br>Na distribuição <b>cíclica</b> cada thread recebe índices espalhados por toda a faixa, e os custos se equilibram — a solução analítica quando o padrão de crescimento é conhecido. Se o custo fosse <b>imprevisível</b>, a resposta seria distribuição <b>dinâmica</b> (fila de tarefas / despachante-operário), que em OpenMP é <code>schedule(dynamic)</code>. Note que <code>sum</code> continua sendo uma redução, e precisa de tratamento próprio."
},
{
  id:"hw15", mod:"hardware", dif:"dificil", tipo:"mc",
  fonte:"Lab · Introdução, Q3",
  enunciado:"Na <b>soma em árvore</b> com p núcleos (p sendo potência de 2), quantas etapas de comunicação são necessárias e como se determina, na iteração corrente, quem envia e quem recebe?",
  opcoes:[
    "São <b>log<sub>2</sub>(p)</b> etapas: um <code>divisor</code> que dobra a cada iteração diz quem recebe, e um <code>core_difference</code> diz com quem.",
    "São p etapas, uma por núcleo, e o núcleo mestre recebe de todos os outros em sequência, somando um a um.",
    "São p/2 etapas, e em todas elas cada núcleo se comunica com o vizinho imediato à direita, somando o valor recebido.",
    "É uma etapa só: todos os núcleos enviam ao núcleo 0 ao mesmo tempo, e ele soma tudo no fim."
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
    "Núcleo é a unidade de processamento dentro de um processador; nó é um computador completo, com memória própria.",
    "Núcleo é o computador inteiro da instalação; nó é cada uma das threads em execução dentro dele.",
    "São sinônimos nas arquiteturas modernas, e os textos usam um ou outro indiferentemente.",
    "Núcleo é a unidade lógica vista pelo sistema operacional; nó é a unidade física do hardware."
  ],
  correta:0,
  gabarito:"A distinção importa quando se fala em escala: um <b>nó</b> de um cluster tem vários <b>núcleos</b>. Dentro do nó, memória compartilhada e OpenMP; entre nós, memória distribuída e MPI. Programas de alto desempenho costumam ser <b>híbridos</b>: MPI para comunicar entre nós e OpenMP para explorar os núcleos de cada um."
},
{
  id:"hw18", mod:"hardware", dif:"facil", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Arquitetura",
  enunciado:"O que é o <b>gargalo de Von Neumann</b>? Como a arquitetura de <b>Harvard</b> o ataca, e em que sentido um processador moderno é “Harvard modificado”?",
  chaves:[["instruções e dados na mesma memória", "mesma memória", "mesma memoria", "memória única", "memoria unica", "um barramento"], ["a CPU não busca instrução e dado ao mesmo tempo", "ao mesmo tempo", "simultân", "simultan", "disputa", "não pode buscar"], ["a memória é muito mais lenta que a CPU", "mais lenta", "lentidão", "lentidao", "velocidade", "abismo", "diferença de velocidade"], ["Harvard separa as duas memórias e barramentos", "separa", "duas memórias", "duas memorias", "dois barramentos", "memórias distintas"], ["a L1 é dividida em L1-I e L1-D", "L1", "cache de instruções", "cache de instrucoes", "L1-I", "dividida"]],
  gabarito:"<b>O gargalo:</b> na arquitetura de Von Neumann instruções e dados ficam na <b>mesma memória</b>, acessada por um <b>único barramento</b>. Dois efeitos: a CPU não consegue buscar uma instrução e um dado no mesmo ciclo, e a memória é muito mais lenta que o processador — uma diferença que só cresceu desde os anos 80.<br><br><b>Harvard:</b> separa memória de instruções e memória de dados, cada uma com seu barramento. As duas buscas acontecem em paralelo.<br><br><b>Harvard modificado:</b> é o que você tem na sua máquina. A memória principal é única (Von Neumann), mas a <b>cache L1 é dividida</b> em L1-I (instruções) e L1-D (dados), cada uma com seu caminho até o núcleo. Harvard onde faz diferença, Von Neumann onde a flexibilidade importa.<br><br>Cache, pipeline, predição de desvios e execução especulativa existem, em última análise, para disfarçar esse gargalo."
},
{
  id:"hw19", mod:"hardware", dif:"medio", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Cache (exercício de cálculo)",
  enunciado:"Uma cache de <b>32 KB</b> tem linhas de <b>64 bytes</b> e é <b>associativa de 8 vias</b>. Endereços de 32 bits. Calcule quantos bits têm o deslocamento, o índice do conjunto e a tag.",
  chaves:[["512 linhas", "512"], ["64 conjuntos", "64 conjuntos", "64 conj"], ["deslocamento de 6 bits", "6 bits", "desloc"], ["índice de 6 bits", "índice", "indice", "conjunto"], ["tag de 20 bits", "20 bits", "20"]],
  gabarito:"<b>Linhas:</b> 32 768 B / 64 B = <b>512 linhas</b>.<br><br><b>Conjuntos:</b> 512 linhas / 8 vias = <b>64 conjuntos</b>.<br><br><b>Deslocamento</b> (byte dentro da linha): log<sub>2</sub>(64) = <b>6 bits</b>.<br><br><b>Índice</b> (qual conjunto): log<sub>2</sub>(64) = <b>6 bits</b>.<br><br><b>Tag:</b> 32 &minus; 6 &minus; 6 = <b>20 bits</b>.<br><br><code>| tag 20 | índice 6 | desloc 6 |</code><br><br><b>Variações:</b> se fosse <b>mapeamento direto</b> (1 via), haveria 512 conjuntos → índice de 9 bits e tag de 17. Se fosse <b>totalmente associativa</b>, haveria 1 conjunto → índice de 0 bits e tag de 26.<br><br>Note o padrão: mais associatividade → menos conjuntos → índice menor e tag maior."
},
{
  id:"hw20", mod:"hardware", dif:"medio", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Mapeamento",
  enunciado:"Compare os três mapeamentos de cache — <b>direto</b>, <b>totalmente associativo</b> e <b>associativo por conjuntos</b> — quanto a custo, velocidade de busca e faltas por conflito.",
  chaves:[["direto: uma única posição possível", "uma posição", "uma posicao", "única", "unica", "mod", "posição fixa"], ["direto é barato e rápido mas sofre conflito", "barato", "simples", "rápido", "rapido", "conflito"], ["totalmente associativo: qualquer lugar", "qualquer", "qualquer lugar", "qualquer linha"], ["mas precisa comparar todas as tags", "todas as tags", "comparar todas", "caro", "custoso", "lento"], ["por conjuntos é o meio-termo usado na prática", "meio-termo", "meio termo", "compromisso", "n vias", "vias", "na prática", "na pratica"]],
  gabarito:"&bull; <b>Direto</b> — cada bloco de memória tem <b>uma única</b> posição possível (bloco mod número de linhas). Hardware baratíssimo e busca imediata: compara-se <b>uma</b> tag. O defeito é grave: dois endereços que mapeiam na mesma linha se expulsam o tempo todo, mesmo com a cache quase vazia — são as <b>faltas por conflito</b>.<br><br>&bull; <b>Totalmente associativo</b> — qualquer bloco em qualquer linha. Elimina as faltas por conflito e aproveita a cache ao máximo. Em troca, é preciso comparar a tag com <b>todas</b> as linhas simultaneamente: muitos comparadores, caro em área e energia. Só é viável em caches pequenas, como a TLB.<br><br>&bull; <b>Associativo por conjuntos (n vias)</b> — o endereço escolhe o <b>conjunto</b>, e dentro dele o bloco pode ocupar qualquer uma das n vias. Comparam-se apenas n tags. Com 4 ou 8 vias as faltas por conflito praticamente desaparecem a um custo aceitável — é o que se usa em todas as máquinas atuais.<br><br>Quando o conjunto enche, a política de substituição (normalmente <b>LRU</b>) escolhe a vítima."
},
{
  id:"hw21", mod:"hardware", dif:"facil", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Políticas de escrita",
  enunciado:"Explique <b>write-through</b> e <b>write-back</b>. Qual é usada nas máquinas atuais e por quê?",
  chaves:[["write-through escreve nos dois níveis na hora", "write-through", "escreve nos dois", "imediat", "na hora", "sempre atualiza"], ["write-back só escreve na cache e marca como suja", "write-back", "suja", "dirty", "só na cache", "so na cache"], ["e grava quando a linha é expulsa", "expuls", "substitu", "despejo", "ao sair", "quando sai"], ["write-back gera muito menos tráfego", "menos tráfego", "menos trafego", "menos escrita", "mais rápido", "mais rapido", "economiza"], ["é a usada hoje", "usada", "atual", "moderna", "hoje", "padrão", "padrao"]],
  gabarito:"&bull; <b>Write-through</b> — toda escrita vai para a cache <b>e</b> para o nível de baixo imediatamente. O nível inferior está sempre consistente, o que simplifica muito a coerência e a recuperação de falhas. O custo é tráfego: cada escrita atravessa a hierarquia.<br><br>&bull; <b>Write-back</b> — a escrita fica só na cache, e a linha é marcada como <b>suja (dirty)</b>. O nível de baixo só é atualizado quando a linha for <b>expulsa</b>. Várias escritas na mesma linha custam um único acesso lá embaixo.<br><br><b>Nas máquinas atuais usa-se write-back</b>, porque o tráfego de memória é o recurso mais escasso — e mais ainda em multiprocessadores, onde o barramento é compartilhado. O preço é a complexidade: é preciso o bit de sujo e um protocolo de coerência para que nenhum núcleo leia um valor velho.<br><br><b>Na falta de escrita:</b> <i>write-allocate</i> traz a linha para a cache antes de escrever (combina com write-back); <i>no-write-allocate</i> escreve direto no nível de baixo (combina com write-through)."
},
{
  id:"hw22", mod:"hardware", dif:"facil", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Cache (exercício de cálculo)",
  enunciado:"Uma cache tem tempo de acerto de <b>4 ciclos</b>, taxa de falta de <b>5%</b> e penalidade de falta de <b>200 ciclos</b>. Calcule o tempo médio de acesso. Quanto melhoraria se a taxa de falta caísse para 1%?",
  chaves:[["14 ciclos", "14"], ["6 ciclos", "6 ciclos", "= 6"], ["2,3 vezes mais rápido", "2,3", "2.3", "2,33", "mais que o dobro", "duas vezes"], ["T = T_hit + taxa x penalidade", "T_hit", "tempo de acerto", "taxa", "penalidade", "fórmula", "formula"]],
  gabarito:"<b>Fórmula:</b> T<sub>médio</sub> = T<sub>acerto</sub> + taxa<sub>falta</sub> × penalidade<sub>falta</sub><br><br><b>Com 5%:</b> 4 + 0,05 × 200 = 4 + 10 = <b>14 ciclos</b>.<br><br><b>Com 1%:</b> 4 + 0,01 × 200 = 4 + 2 = <b>6 ciclos</b>.<br><br><b>Ganho:</b> 14 / 6 = <b>2,33&times; mais rápido</b> — sem trocar uma linha de algoritmo, apenas melhorando a <b>localidade</b> dos acessos.<br><br>Repare o que a conta revela: com 5% de falta, <b>10 dos 14 ciclos</b> (71% do tempo) são gastos esperando a memória. É por isso que percorrer uma matriz por linhas em vez de por colunas pode multiplicar a velocidade de um programa — e é o tipo de ganho que não aparece na contagem de operações."
},
{
  id:"hw23", mod:"hardware", dif:"medio", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Memória virtual",
  enunciado:"Para que servem a <b>memória virtual</b> e a <b>TLB</b>? Por que programas paralelos que varrem muita memória se beneficiam de <b>HugePages</b>?",
  chaves:[["cada processo tem um espaço virtual próprio", "virtual", "espaço próprio", "espaco proprio", "isolamento", "endereço virtual"], ["a MMU traduz usando a tabela de páginas", "tradu", "tabela de páginas", "tabela de paginas", "MMU", "página", "pagina"], ["a TLB é uma cache de traduções", "TLB", "cache de tradu", "acelera a tradução", "guarda traduções"], ["páginas maiores cobrem mais memória com a mesma TLB", "cobertura", "mais memória", "mais memoria", "2 MB", "menos entradas", "menos TLB miss"]],
  gabarito:"<b>Memória virtual:</b> cada processo enxerga um espaço de endereços contínuo e só seu. A <b>MMU</b> traduz endereço virtual → físico usando a <b>tabela de páginas</b>, em blocos de tamanho fixo (classicamente 4 KB). Isso dá <b>isolamento</b> entre processos e permite usar mais memória do que existe fisicamente, empurrando páginas frias para o disco (<b>swap</b>).<br><br><b>TLB:</b> consultar a tabela de páginas seria um acesso à memória a <b>cada</b> acesso à memória. A TLB é uma cache pequena e muito rápida só de traduções recentes. Um <b>TLB miss</b> custa caro — é um passeio pela tabela de páginas.<br><br><b>HugePages:</b> com 64 entradas de TLB e páginas de 4 KB, a cobertura é de apenas 256 KB — um vetor de 100 MB dá TLB miss quase sempre. Com páginas de <b>2 MB</b> a mesma TLB cobre 128 MB. Programas paralelos tipicamente varrem vetores grandes, exatamente o caso em que isso decide o desempenho.<br><br><b>Ligação com OpenMP:</b> o <i>first touch</i> — a primeira escrita numa página decide onde ela mora. Por isso a inicialização do vetor deve ser paralelizada com o <b>mesmo</b> <code>schedule</code> do laço de trabalho."
},
{
  id:"hw24", mod:"hardware", dif:"medio", tipo:"code",
  fonte:"Aula 07 · Hardware Paralelo · Dependências",
  enunciado:"Classifique cada par de instruções abaixo como <b>RAW</b>, <b>WAR</b> ou <b>WAW</b>, e <b>indique</b> quais podem ser eliminadas por renomeação de registradores.",
  cod:"par A:\n  i1:  R1 = R2 + R3\n  i2:  R4 = R1 + R5\n\npar B:\n  i1:  R4 = R1 + R5\n  i2:  R1 = R2 + R3\n\npar C:\n  i1:  R1 = R2 + R3\n  i2:  R1 = R4 + R5",
  chaves:[["A é RAW", "A", "RAW"], ["B é WAR", "B", "WAR"], ["C é WAW", "C", "WAW"], ["só B e C somem com renomeação", "renomea", "B e C", "WAR e WAW", "nome", "falsa"], ["RAW é dependência verdadeira", "verdadeira", "real", "não pode", "nao pode", "não elimina"]],
  modelo:"par A: RAW (read after write) — dependência VERDADEIRA, não pode ser eliminada\npar B: WAR (write after read) — antidependência, some com renomeação\npar C: WAW (write after write) — dependência de saída, some com renomeação",
  gabarito:"<b>Par A — RAW</b> (<i>read after write</i>): i2 <b>lê</b> R1, que i1 <b>escreve</b>. É a dependência <b>verdadeira</b>: existe um dado real sendo passado. <b>Não pode ser eliminada</b> — i2 precisa esperar. É ela que limita o paralelismo.<br><br><b>Par B — WAR</b> (<i>write after read</i>, antidependência): i2 <b>escreve</b> em R1, que i1 <b>lê</b>. Nenhum dado vai de i1 para i2 — o conflito é só pelo <b>nome</b> do registrador. <b>Some com renomeação</b>: o hardware dá a i2 um registrador físico diferente e as duas podem ir juntas.<br><br><b>Par C — WAW</b> (<i>write after write</i>, dependência de saída): as duas escrevem em R1. Também é conflito de nome e também <b>some com renomeação</b>.<br><br><b>A ponte com OpenMP:</b> a “dependência carregada pelo laço” que impede o <code>parallel for</code> é uma RAW entre iterações. Quando o conflito é só de nome (a mesma variável temporária reusada a cada iteração), a solução é <code>private</code> — que é renomeação, exatamente o que o processador faz."
},
{
  id:"hw25", mod:"hardware", dif:"medio", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Pipeline",
  enunciado:"O que é um <b>hazard</b> de dados e o que é <b>adiantamento (forwarding)</b>? Por que um <code>load</code> seguido do uso imediato do dado ainda custa uma bolha mesmo com forwarding?",
  chaves:[["hazard é quando o pipeline não pode avançar", "não pode avançar", "nao pode avancar", "trava", "para", "atrasa"], ["o operando ainda não está pronto", "operando", "não está pronto", "nao esta pronto", "ainda não", "RAW"], ["forwarding pega o resultado direto da saída da ULA", "ULA", "direto", "saída", "saida", "atalho", "sem esperar o registrador"], ["o load só tem o dado depois do estágio MEM", "MEM", "memória", "memoria", "depois", "mais tarde", "estágio de memória"]],
  gabarito:"<b>Hazard de dados:</b> o pipeline não pode avançar no próximo ciclo porque a instrução seguinte precisa de um operando que ainda <b>não foi produzido</b> — é uma dependência RAW batendo no pipeline. A solução ingênua é inserir <b>bolhas</b> (<i>stalls</i>): ciclos em que nada anda.<br><br><b>Forwarding (adiantamento, ou <i>bypassing</i>):</b> em vez de esperar o resultado percorrer o pipeline até ser gravado no registrador, pega-se o valor <b>direto da saída da ULA</b> e injeta-se na entrada da instrução seguinte. Numa cadeia de operações aritméticas isso elimina as bolhas por completo.<br><br><b>Por que o <code>load</code> é diferente:</b> o dado de um <code>load</code> só existe depois do estágio <b>MEM</b>, que vem <b>depois</b> do EX. A instrução seguinte precisaria do valor no seu próprio EX, que acontece ao mesmo tempo que o MEM do load. Não dá para adiantar algo que ainda não foi lido: resta <b>uma bolha</b> (o <i>load-use hazard</i>).<br><br><b>Como se resolve de verdade:</b> execução <b>fora de ordem</b> — o processador adianta uma instrução independente para preencher o buraco. Um bom compilador faz o mesmo estaticamente, reordenando o código."
},
{
  id:"hw26", mod:"hardware", dif:"facil", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Pipeline (exercício de cálculo)",
  enunciado:"Um pipeline tem <b>5 estágios</b> de 1 ciclo cada. Calcule o tempo para executar <b>100</b> instruções com e sem pipeline, e o ganho. Qual é o teto do ganho?",
  chaves:[["sem pipeline 500 ciclos", "500"], ["com pipeline 104 ciclos", "104", "5 + 99"], ["ganho 4,81", "4,81", "4.81", "4,8"], ["o teto é 5, o número de estágios", "teto", "limite", "5", "número de estágios", "numero de estagios"]],
  gabarito:"<b>Sem pipeline:</b> cada instrução ocupa os 5 estágios antes da próxima começar: 5 × 100 = <b>500 ciclos</b>.<br><br><b>Com pipeline:</b> a primeira instrução leva 5 ciclos para sair; depois disso sai uma por ciclo. k + (n &minus; 1) = 5 + 99 = <b>104 ciclos</b>.<br><br><b>Ganho:</b> 500 / 104 = <b>4,81&times;</b>.<br><br><b>Teto:</b> o ganho tende a <b>k = 5</b> (o número de estágios) quando n cresce. Com 1000 instruções seria 5000/1004 = 4,98&times;.<br><br><b>Duas observações que valem nota:</b> o pipeline <b>não diminui</b> o tempo de uma instrução individual (a latência continua 5 ciclos) — ele aumenta a <b>vazão</b>. E este cálculo supõe o pipeline <b>cheio o tempo todo</b>: hazards de dados, de controle e estruturais inserem bolhas e afastam o resultado real desse teto."
},
{
  id:"hw27", mod:"hardware", dif:"medio", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Desvios",
  enunciado:"Por que o processador precisa <b>prever</b> desvios? O que é <b>execução especulativa</b>? Explique por que o mesmo laço pode rodar várias vezes mais rápido com um vetor <b>ordenado</b> do que com um vetor aleatório.",
  chaves:[["o destino do desvio só é conhecido depois", "depois", "só se sabe", "so se sabe", "não se sabe", "avaliar a condição"], ["esperar esvaziaria o pipeline", "esvazia", "parar", "bolha", "flush", "travaria"], ["especular é executar o caminho previsto sem confirmar", "especul", "antecipa", "adianta", "sem gravar", "provisório", "descarta se errar"], ["errar custa de 15 a 20 ciclos", "penalidade", "15", "20", "ciclos", "recarregar"], ["com vetor ordenado o preditor acerta quase sempre", "ordenado", "acerta", "previsível", "previsivel", "padrão", "padrao", "histórico"]],
  gabarito:"<b>Por que prever:</b> cerca de uma instrução em cada cinco é um desvio, e o processador só sabe para onde ir depois de <b>avaliar a condição</b>. Esperar por isso esvaziaria o pipeline a cada <code>if</code> — num pipeline profundo, seria jogar fora dezenas de ciclos o tempo todo.<br><br><b>Execução especulativa:</b> o <b>preditor de desvios</b> aposta num caminho e o processador <b>executa as instruções daquele lado</b>, sem gravar nada definitivamente. Se a previsão se confirma, os resultados são efetivados e nada se perdeu. Se erra, tudo é descartado e o pipeline recarregado — uma penalidade da ordem de <b>15 a 20 ciclos</b>.<br><br><b>O vetor ordenado:</b> considere <code>if (v[i] &gt;= 128) soma += v[i];</code><br><br>&bull; Com dados <b>aleatórios</b>, a condição alterna sem padrão. O preditor acerta metade das vezes, e cada erro custa um esvaziamento completo.<br>&bull; Com o vetor <b>ordenado</b>, há uma longa sequência de “não” seguida de uma longa sequência de “sim”. O preditor, que trabalha com <b>histórico</b>, acerta quase sempre.<br><br>Mesmo código, mesmos dados, até 5&times; de diferença. A alternativa é remover o desvio: <code>soma += v[i] * (v[i] &gt;= 128);</code> não tem o que prever.<br><br><b>Nota de segurança:</b> foi a execução especulativa que abriu <b>Spectre</b> e <b>Meltdown</b> — o resultado era descartado, mas o rastro deixado na cache podia ser lido."
},
{
  id:"hw28", mod:"hardware", dif:"medio", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Despacho múltiplo",
  enunciado:"Compare <b>superescalar</b> e <b>VLIW</b>: quem decide quais instruções vão juntas, e quais são as vantagens e desvantagens de cada abordagem?",
  chaves:[["no superescalar o hardware decide em tempo de execução", "hardware", "em execução", "em execucao", "dinâmic", "dinamic", "o processador decide"], ["no VLIW o compilador decide", "compilador", "estátic", "estatic", "em compilação", "antes de rodar"], ["o superescalar roda binário antigo sem recompilar", "binário", "binario", "compatív", "compativ", "qualquer programa", "sem recompilar"], ["mas gasta muitos transistores e energia", "transistor", "energia", "caro", "complexo", "área", "area"], ["o VLIW é simples mas o binário é preso à máquina", "simples", "barato", "preso", "não roda", "nao roda", "recompilar", "depende da máquina"]],
  gabarito:"Os dois buscam o mesmo: executar <b>mais de uma instrução por ciclo</b>. Diferem em <b>quem decide</b>.<br><br><b>Superescalar — o hardware decide, em tempo de execução.</b> O processador analisa dependências, renomeia registradores, reordena e despacha para várias unidades funcionais.<br>&bull; <i>Vantagem:</i> funciona com <b>qualquer binário</b>, inclusive programas compilados há vinte anos; adapta-se ao que acontece de fato (um cache miss, por exemplo).<br>&bull; <i>Desvantagem:</i> toda essa lógica custa transistores, área e <b>energia</b>. É a maior parte da complexidade de um x86 moderno.<br><br><b>VLIW — o compilador decide, em tempo de compilação.</b> Ele monta pacotes de instruções que sabidamente podem ir juntas; o hardware só executa o pacote.<br>&bull; <i>Vantagem:</i> processador muito mais simples e econômico; o compilador enxerga o programa inteiro, não só a janela de instruções.<br>&bull; <i>Desvantagem:</i> o compilador precisa conhecer a máquina em detalhe, e o binário <b>não roda</b> numa versão diferente dela. O que não é previsível em compilação (cache miss) vira <code>nop</code> no pacote.<br><br><b>Onde cada um está:</b> superescalar nas CPUs de uso geral; VLIW em DSPs, aceleradores e GPUs, onde o código é recompilado para o alvo."
},
{
  id:"hw29", mod:"hardware", dif:"medio", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Multithreading de hardware",
  enunciado:"O que é <b>multithreading de hardware</b> (<i>hyper-threading</i>)? Use-o para explicar por que, numa máquina de <b>8 núcleos lógicos</b>, a eficiência costuma cair bruscamente ao passar de 4 para 8 threads.",
  chaves:[["o núcleo guarda o estado de duas threads", "estado", "duas threads", "mais de uma thread", "contexto"], ["e alterna para preencher as bolhas", "bolha", "alterna", "preenche", "ociosidade", "espera", "cache miss"], ["as unidades de execução continuam sendo as mesmas", "mesmas unidades", "compartilham", "não duplica", "nao duplica", "unidades de execução", "mesma ULA"], ["8 lógicos podem ser 4 físicos", "4 físicos", "4 fisicos", "físicos", "fisicos", "lógicos", "logicos", "metade"], ["o ganho típico é de 15% a 30%", "15", "20", "30", "pouco", "não dobra", "nao dobra"]],
  gabarito:"<b>O que é:</b> o núcleo mantém o estado arquitetural de <b>duas ou mais threads</b> (registradores, contador de programa) e alterna entre elas instrução a instrução. Quando uma thread trava — esperando um cache miss, por exemplo — a outra usa as unidades de execução que ficariam ociosas.<br><br><b>O que ele não faz:</b> duplicar as unidades funcionais, as caches L1/L2 ou a largura de banda. Ele aumenta o <b>aproveitamento</b> do que existe, não a capacidade. O ganho típico fica entre <b>15% e 30%</b>, não 100%.<br><br><b>Por que a eficiência cai de 4 para 8:</b> uma máquina de “8 núcleos lógicos” costuma ter <b>4 físicos</b> com 2 threads cada.<br><br>&bull; Até 4 threads, cada uma pega um núcleo físico inteiro — eficiência alta.<br>&bull; De 5 a 8, as threads passam a <b>dividir</b> as mesmas unidades de execução e as mesmas caches L1 e L2. O trabalho dobra, a capacidade real cresce uns 20%.<br><br>O resultado é exatamente o que as medições mostram: o ganho ainda sobe um pouco (4,0 → 4,97, por exemplo), mas a eficiência despenca (0,95 → 0,62). <b>Isso é esperado e deve ser escrito assim na análise</b> — não é erro de medição."
},
{
  id:"hw30", mod:"hardware", dif:"medio", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Coerência de cache",
  enunciado:"Por que um multiprocessador de memória compartilhada precisa de um <b>protocolo de coerência de cache</b>? Cite os estados do <b>MESI</b> e explique a diferença entre <b>coerência</b> e <b>consistência</b>.",
  chaves:[["cada núcleo tem a sua própria cache", "cada núcleo", "cada nucleo", "própria cache", "propria cache", "L1", "cópias"], ["um núcleo escreve e o outro fica com valor velho", "valor velho", "desatualizado", "antigo", "cópia errada", "inconsistente"], ["MESI: modificada, exclusiva, compartilhada, inválida", "Modif", "Exclusiv", "Shared", "compartilhad", "Inválid", "Invalid"], ["coerência trata de uma posição de memória", "uma posição", "uma posicao", "mesma variável", "mesma posição", "um endereço"], ["consistência trata da ordem entre posições diferentes", "ordem", "entre posições", "entre variáveis", "posições diferentes", "barreira de memória"]],
  gabarito:"<b>Por que é preciso:</b> em memória compartilhada cada núcleo tem a <b>sua</b> cache L1. Se dois núcleos carregaram a mesma linha e um deles escreve, o outro continua enxergando o valor velho. Sem um protocolo, o programa simplesmente lê dados errados.<br><br><b>MESI</b> — quatro estados por linha de cache:<br><br>&bull; <b>M</b>odified — só esta cache tem a linha, e ela está <b>suja</b> (a memória está desatualizada).<br>&bull; <b>E</b>xclusive — só esta cache tem a linha, e ela está limpa.<br>&bull; <b>S</b>hared — várias caches têm a linha, todas limpas.<br>&bull; <b>I</b>nvalid — a linha não vale; qualquer acesso é falta.<br><br>Em barramento as caches ficam <b>bisbilhotando</b> (<i>snooping</i>) o tráfego; em máquinas maiores um <b>diretório</b> registra quem tem o quê.<br><br><b>Coerência &times; consistência:</b><br><br>&bull; <b>Coerência</b> trata de <b>uma</b> posição de memória: todos os núcleos veem a mesma sequência de valores para aquela variável.<br>&bull; <b>Consistência</b> trata da <b>ordem entre posições diferentes</b>: se o núcleo A escreveu x e depois y, o núcleo B pode perfeitamente ver y antes de x. É para controlar isso que existem as barreiras de memória — e o <code>#pragma omp flush</code>.<br><br>A coerência é automática, mas <b>não é de graça</b>: cada escrita numa linha compartilhada gera mensagens de invalidação. É esse custo que torna o <b>falso compartilhamento</b> um problema sério."
},
{
  id:"hw31", mod:"hardware", dif:"medio", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Redes de interconexão (exercício de cálculo)",
  enunciado:"Numa rede com latência <b>l = 10 μs</b> e banda <b>b = 1 GB/s</b>, compare o tempo de enviar 1 MB em <b>uma</b> mensagem e em <b>1000</b> mensagens de 1 KB. Que lição prática isso dá?",
  chaves:[["t = l + n/b", "l + n/b", "latência mais", "latencia mais", "fórmula", "formula"], ["uma mensagem: ~1010 us", "1010", "1,01", "1 ms", "1010 us"], ["mil mensagens: ~11000 us", "11000", "11 ms", "11000 us", "11 mil"], ["cerca de 11 vezes pior", "11 vezes", "11x", "dez vezes", "muito pior"], ["agrupar dados em mensagens grandes", "agrupar", "juntar", "mensagens grandes", "poucas mensagens", "evitar mensagens pequenas"]],
  gabarito:"<b>Fórmula:</b> t = l + n / b<br><br><b>Uma mensagem de 1 MB:</b><br>t = 10 μs + 1 MB / 1 GB/s = 10 + 1000 = <b>1010 μs</b><br><br><b>Mil mensagens de 1 KB:</b><br>t = 1000 × (10 μs + 1 μs) = <b>11 000 μs</b><br><br><b>Cerca de 11&times; pior</b> — e o motivo é inteiramente a latência: 1000 × 10 μs = 10 000 μs só de custo fixo. O tempo de transmissão dos dados (1000 μs) é o mesmo nos dois casos.<br><br><b>A lição:</b> <b>muitas mensagens pequenas são péssimas.</b> A latência é paga inteira a cada mensagem, independentemente do tamanho. Agrupar dados numa mensagem grande costuma ser a otimização mais rentável em memória distribuída — e é a mesma ideia que está por trás de escolher um <i>chunk</i> grande no <code>schedule(dynamic)</code>: não pagar o custo fixo mais vezes do que o necessário."
},
{
  id:"hw32", mod:"hardware", dif:"medio", tipo:"disc",
  fonte:"Aula 07 · Hardware Paralelo · Topologias",
  enunciado:"Defina <b>diâmetro</b>, <b>grau</b> e <b>largura de bisseção</b> de uma rede de interconexão. Com p = 1024 nós, compare o anel, o hipercubo e a rede totalmente conectada.",
  chaves:[["diâmetro é a maior distância entre dois nós", "maior distância", "maior distancia", "pior caso", "mais longe", "saltos"], ["grau é o número de links por nó", "links por nó", "ligações", "ligacoes", "conexões por nó", "custo do nó"], ["bisseção é quantos links cortar para dividir a rede", "cortar", "dividir", "em duas", "metade", "congestionamento"], ["anel tem diâmetro 512", "512", "p/2", "anel"], ["hipercubo tem diâmetro 10", "10", "log", "hipercubo"], ["totalmente conectada tem diâmetro 1 mas é inviável", "1", "inviável", "inviavel", "caro", "muitos links", "p(p-1)/2"]],
  gabarito:"&bull; <b>Diâmetro</b> — a maior distância (em saltos) entre dois nós quaisquer. Limita o <b>pior caso</b> de latência.<br>&bull; <b>Grau</b> — quantos links cada nó tem. Define o <b>custo</b> do hardware: portas, cabos, consumo.<br>&bull; <b>Largura de bisseção</b> — quantos links é preciso cortar para partir a rede em duas metades. Mede a resistência a <b>congestionamento</b> quando metade da máquina fala com a outra metade.<br><br><b>Com p = 1024:</b><br><br>&bull; <b>Anel</b> — diâmetro p/2 = <b>512</b>, grau 2, bisseção 2. Baratíssimo e lento: uma mensagem pode dar meia volta na máquina.<br>&bull; <b>Hipercubo</b> — diâmetro log<sub>2</sub>(1024) = <b>10</b>, grau 10, bisseção 512. Os três números equilibrados: é por isso que ele costuma ser a resposta “certa” nas questões.<br>&bull; <b>Totalmente conectada</b> — diâmetro <b>1</b>, o ideal; mas grau 1023 por nó e p(p&minus;1)/2 ≈ <b>524 mil links</b>. Inviável.<br><br>O hipercubo é o compromisso clássico: o diâmetro cresce apenas com o <b>logaritmo</b> do número de nós, e o grau também."
}

]);
