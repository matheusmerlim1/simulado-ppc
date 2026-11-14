/* ─── OpenMP ────────────────────────────────────────────────
   P2 · 39 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"om01", mod:"openmp", dif:"facil", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"O que faz a diretiva <code>#pragma omp parallel for</code> e como se compila um programa OpenMP?",
  opcoes:[
    "Cria um time de threads e divide as iterações do laço entre elas; compila-se com <code>gcc prog.c -o prog -fopenmp</code>.",
    "Executa o laço inteiro em cada uma das p threads do time, uma após a outra; compila-se com <code>gcc prog.c -o prog -pthread</code>.",
    "Marca o laço como região crítica de acesso exclusivo; compila-se com <code>gcc prog.c -o prog -lomp</code>.",
    "Vetoriza o laço com instruções SIMD do processador; não exige nenhuma opção de compilação."
  ],
  correta:0,
  gabarito:"A diretiva combina <code>parallel</code> (cria o time de threads) com <code>for</code> (particiona o espaço de iteração entre elas). <b>Cada iteração é executada uma única vez</b>, por uma das threads — não é o laço inteiro replicado. Sem <code>-fopenmp</code> o compilador simplesmente <b>ignora</b> os pragmas e gera um programa serial que compila e roda sem erro nenhum, o que é uma armadilha clássica ao medir tempos. Há uma <b>barreira implícita</b> ao fim do <code>for</code>."
},
{
  id:"om02", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"O que faz a cláusula <code>reduction(+:soma)</code>?",
  cod:"double soma = 0.0;\n\n#pragma omp parallel for reduction(+:soma)\nfor (int i = 0; i < n; i++)\n    soma += v[i];",
  opcoes:[
    "Dá a cada thread uma cópia privada de <code>soma</code>, iniciada em 0, e combina todas na variável original ao final.",
    "Protege <code>soma</code> com um mutex implícito a cada iteração do laço, uma thread por vez.",
    "Reduz o número de threads usadas no laço, para diminuir a disputa pela variável compartilhada.",
    "Faz <code>soma</code> ser compartilhada por todas as threads, sem proteção nenhuma contra corrida."
  ],
  correta:0,
  gabarito:"É exatamente o padrão do Q3 do laboratório de Processos e Threads da P1, automatizado: acumulador <b>privado</b> por thread e combinação ao final. A combinação é feita de forma eficiente pelo runtime, tipicamente em árvore. Sem o <code>reduction</code>, <code>soma</code> seria compartilhada e o <code>+=</code> criaria condição de corrida. Usar <code>critical</code> a cada iteração até corrigiria o resultado, mas serializaria o laço inteiro — a versão com <code>reduction</code> é ordens de grandeza mais rápida. Cada operador tem seu neutro: <code>+</code>&rarr;0, <code>*</code>&rarr;1, <code>max</code>&rarr;&minus;&infin;."
},
{
  id:"om03", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Qual a diferença entre as cláusulas <code>private</code>, <code>shared</code> e <code>firstprivate</code>?",
  opcoes:[
    "<code>shared</code>: uma só variável para todas. <code>private</code>: cópia por thread, <b>não inicializada</b>. <code>firstprivate</code>: cópia <b>já inicializada</b>.",
    "<code>private</code> e <code>firstprivate</code> são sinônimos, e <code>shared</code> é o oposto dos dois na região paralela.",
    "<code>shared</code> copia o valor para cada thread e <code>private</code> mantém uma variável única para todas.",
    "As três controlam quantas threads podem acessar a variável ao mesmo tempo dentro do laço paralelo, uma thread de cada vez."
  ],
  correta:0,
  gabarito:"A armadilha está no <code>private</code>: a cópia entra na região paralela com <b>lixo</b>, não com o valor anterior — se você precisa do valor de entrada, use <code>firstprivate</code>. Por padrão, as variáveis declaradas fora da região são <code>shared</code>, mas o <b>índice do laço</b> paralelizado é sempre privado automaticamente. Boa prática defensiva: usar <code>default(none)</code> e declarar explicitamente o escopo de cada variável."
},
{
  id:"om04", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Qual a diferença entre <code>#pragma omp critical</code> e <code>#pragma omp atomic</code>?",
  opcoes:[
    "<code>critical</code> serializa um <b>bloco</b> qualquer com uma trava; <code>atomic</code> cobre só uma operação simples de memória, com instrução do processador.",
    "<code>atomic</code> protege blocos de código inteiros e <code>critical</code> protege apenas variáveis simples.",
    "São idênticas em função; <code>atomic</code> é apenas a sintaxe mais nova, mantida por compatibilidade.",
    "<code>critical</code> só funciona dentro de laços <code>for</code> e <code>atomic</code> funciona em qualquer lugar."
  ],
  correta:0,
  gabarito:"Prefira <code>atomic</code> quando a operação for do tipo <code>x += expr</code>, <code>x++</code>, <code>x = x &amp; expr</code> — o compilador emite uma instrução atômica de hardware, sem trava. Use <code>critical</code> quando precisar proteger várias linhas ou uma chamada de função. Atenção: <b>duas regiões <code>critical</code> sem nome compartilham a mesma trava global</b>, o que serializa trechos independentes — dê nomes distintos (<code>#pragma omp critical(nome)</code>) quando forem regiões diferentes. E para reduções, prefira <code>reduction</code> aos dois."
},
{
  id:"om05", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Qual a diferença entre <code>schedule(static)</code> e <code>schedule(dynamic)</code>, e quando usar cada um?",
  opcoes:[
    "<code>static</code> divide em blocos fixos antes de rodar, bom quando as iterações custam o mesmo; <code>dynamic</code> entrega sob demanda, bom quando o custo varia.",
    "<code>static</code> usa sempre uma só thread e <code>dynamic</code> usa todas as threads do time, uma por bloco.",
    "<code>static</code> é para laços com número conhecido de iterações e <code>dynamic</code> para laços <code>while</code>, cujo total de iterações não se conhece em tempo de compilação.",
    "<code>dynamic</code> é sempre mais rápido, porque se adapta sozinho à máquina e à carga do momento, sem ajuste."
  ],
  correta:0,
  gabarito:"<code>static</code> tem <i>overhead</i> praticamente zero (a divisão é calculada uma vez) e boa localidade de cache — é o padrão. <code>dynamic</code> paga o custo de coordenação da fila de tarefas a cada bloco entregue, mas evita que uma thread azarada com as iterações caras atrase todo mundo. É a mesma escolha do Q2 do laboratório de Introdução, com <code>Compute_value(i)</code> de custo crescente: bloco estático desbalanceia, distribuição cíclica ou dinâmica equilibra. <code>guided</code> é o meio-termo — blocos grandes no começo, que vão diminuindo."
},
{
  id:"om06", mod:"openmp", dif:"dificil", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"O código abaixo, compilado com <code>-fopenmp</code>, imprime um valor errado e diferente a cada execução. Por quê?",
  cod:"double soma = 0.0;\n\n#pragma omp parallel for\nfor (int i = 0; i < n; i++) {\n    soma += v[i];\n}\n\nprintf(\"%f\\n\", soma);",
  opcoes:[
    "<code>soma</code> é compartilhada e <code>soma += v[i]</code> não é atômica: há condição de corrida. Corrige-se com <code>reduction(+:soma)</code>.",
    "O índice <code>i</code> precisa ser declarado <code>private</code> explicitamente na diretiva.",
    "Falta um <code>#pragma omp barrier</code> logo depois do laço, antes de imprimir o resultado.",
    "O vetor <code>v</code> precisa ser declarado <code>shared</code> explicitamente na diretiva."
  ],
  correta:0,
  gabarito:"É a condição de corrida da P1 reaparecendo na P2. <code>soma += v[i]</code> é <i>load-modify-store</i>: duas threads lêem o mesmo valor e uma sobrescreve o resultado da outra — incrementos se perdem, e o resultado varia a cada execução. A correção idiomática é <code>#pragma omp parallel for reduction(+:soma)</code>.<br><br>Sobre as demais: o índice do laço paralelizado <b>já é privado por padrão</b>; existe uma <b>barreira implícita</b> ao fim do <code>for</code>; e variáveis externas <b>já são shared</b> por padrão."
},
{
  id:"om07", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Como se define o número de threads em OpenMP e como se mede o tempo de execução?",
  opcoes:[
    "Por <code>num_threads(4)</code>, <code>omp_set_num_threads(4)</code> ou <code>OMP_NUM_THREADS</code>; o tempo, com <code>omp_get_wtime()</code>.",
    "Apenas pela variável de ambiente <code>OMP_THREADS</code>; o tempo, com a função <code>clock()</code>.",
    "Pela cláusula <code>threads(4)</code> na diretiva paralela; o tempo, com a função <code>time()</code>.",
    "O número de threads é fixo e igual ao de núcleos da máquina; o tempo, com a função <code>omp_time()</code>."
  ],
  correta:0,
  gabarito:"A precedência é: cláusula <code>num_threads</code> &gt; <code>omp_set_num_threads()</code> &gt; <code>OMP_NUM_THREADS</code> &gt; padrão (número de núcleos). Para o Trabalho, o mais prático é variar <code>OMP_NUM_THREADS</code> sem recompilar.<br><br>Sobre a medição: use <b><code>omp_get_wtime()</code></b>, que devolve tempo de <i>parede</i> em segundos. <code>clock()</code> da libc mede tempo <b>de CPU somado de todas as threads</b> — com 4 threads ele <i>aumenta</i> conforme você paraleliza, e daria um &ldquo;speedup&rdquo; menor que 1. É um erro que já custou muita nota em relatório."
},
{
  id:"om08", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Para que servem <code>#pragma omp barrier</code> e a cláusula <code>nowait</code>?",
  opcoes:[
    "<code>barrier</code> faz as threads esperarem umas pelas outras naquele ponto; <code>nowait</code> remove a barreira implícita do fim do <code>for</code>.",
    "<code>barrier</code> cria uma região crítica e <code>nowait</code> libera essa região para as demais threads.",
    "<code>barrier</code> encerra o time de threads e <code>nowait</code> o mantém vivo até o fim do programa.",
    "As duas são equivalentes: <code>nowait</code> é o nome antigo da mesma diretiva de espera."
  ],
  correta:0,
  gabarito:"É a barreira da P1, agora como diretiva. Construções como <code>for</code>, <code>single</code> e <code>sections</code> já têm barreira implícita no final; <code>nowait</code> a remove quando o resultado daquela fase não é necessário para a fase seguinte, evitando que todas fiquem presas à thread mais lenta. Use com cuidado: remover uma barreira necessária cria condição de corrida silenciosa. A região <code>parallel</code>, essa, sempre tem barreira no fim — não há <code>nowait</code> para ela."
},
{
  id:"om09", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Qual a diferença entre <code>#pragma omp single</code> e <code>#pragma omp master</code>?",
  opcoes:[
    "<code>single</code>: o bloco roda em <b>uma</b> thread qualquer, com barreira implícita no final. <code>master</code>: roda na thread 0, <b>sem</b> barreira.",
    "<code>single</code> executa em todas as threads, uma vez em cada uma delas; <code>master</code> executa só na thread 0, a mestre do time.",
    "As duas são idênticas, e <code>master</code> é apenas a forma obsoleta, mantida nos compiladores.",
    "<code>single</code> cria uma thread nova para o bloco e <code>master</code> reutiliza a thread principal."
  ],
  correta:0,
  gabarito:"Use <code>single</code> quando qualquer thread serve (imprimir um cabeçalho, alocar uma estrutura) e você quer que as outras esperem o resultado — a barreira vem de graça. Use <code>master</code> quando a tarefa precisa ser da thread 0 (por exemplo, chamadas de bibliotecas que só funcionam na thread principal) e você <b>não</b> quer bloquear as demais; se precisar sincronizar, acrescente um <code>barrier</code> explícito."
},
{
  id:"om10", mod:"openmp", dif:"dificil", tipo:"mc",
  fonte:"Trabalho de Paralelização · Histograma",
  enunciado:"Ao paralelizar o cálculo de um <b>histograma</b> (contar quantas vezes cada valor aparece), qual é a região crítica e qual a melhor solução?",
  cod:"#pragma omp parallel for\nfor (int i = 0; i < n; i++)\n    hist[ v[i] - minimo ]++;      /* <-- corrida! */",
  opcoes:[
    "A região crítica é o incremento de <code>hist[k]</code>; a melhor saída é um <b>histograma privado</b> por thread, somado ao final.",
    "Não há região crítica: cada iteração escreve numa posição diferente de <code>hist</code>.",
    "A região crítica é a leitura de <code>v[i]</code>, que precisa de um <code>critical</code> em volta.",
    "A saída é usar <code>schedule(dynamic)</code>, que por si só elimina a disputa pelos bins."
  ],
  correta:0,
  gabarito:"Ao contrário da soma de vetores, aqui iterações <b>diferentes escrevem na mesma posição</b> sempre que os valores caem no mesmo <i>bin</i> — o índice depende do <b>dado</b>, não do <b>i</b>. Duas soluções válidas:<br>&bull; <code>#pragma omp atomic</code> antes do incremento — simples, mas com muita disputa quando os dados se concentram em poucos bins;<br>&bull; <b>privatização + redução</b>: cada thread mantém seu próprio vetor de contagens e, no fim, os vetores são somados. Muito mais rápido, ao custo de memória (nº de threads &times; nº de bins). Em OpenMP moderno: <code>reduction(+:hist[:num_bins])</code>.<br><br>Note ainda o <b>falso compartilhamento</b>: bins vizinhos caem na mesma linha de cache, e mesmo com <code>atomic</code> os núcleos ficam invalidando as linhas uns dos outros."
},
{
  id:"om11", mod:"openmp", dif:"facil", tipo:"code",
  fonte:"Trabalho de Paralelização · Multiplicação Matricial",
  enunciado:"Escreva <b>apenas a diretiva OpenMP</b> que paraleliza corretamente a multiplicação matricial abaixo. Indique o escopo das variáveis.",
  cod:"void matmult(float **A, float **B, float **C, int n) {\n    int i, j, k;\n\n    /* ESCREVA A DIRETIVA AQUI */\n    for (i = 0; i < n; i++)\n        for (j = 0; j < n; j++) {\n            float soma = 0.0f;\n            for (k = 0; k < n; k++)\n                soma += A[i][k] * B[k][j];\n            C[i][j] = soma;\n        }\n}",
  chaves:["#pragma omp","parallel for","private"],
  modelo:"    #pragma omp parallel for private(j, k) shared(A, B, C, n) schedule(static)",
  gabarito:"<b>Por que <code>j</code> e <code>k</code> precisam ser <code>private</code>:</b> variáveis declaradas fora da região paralela são <code>shared</code> por padrão. Se fossem compartilhadas, todas as threads incrementariam os mesmos contadores e o resultado seria lixo. Só o <code>i</code> (índice do laço paralelizado) já é privado automaticamente.<br><br><b>Por que o laço externo:</b> maior granularidade (cada thread recebe n<sup>2</sup> operações) e melhor localidade de cache. Paralelizar o laço de <code>k</code> criaria uma redução e pagaria o custo de abrir e fechar o time n<sup>2</sup> vezes.<br><br><b>Sem região crítica:</b> cada thread escreve em linhas distintas de <code>C</code> e apenas lê A e B — não precisa de <code>critical</code>, <code>atomic</code> nem <code>reduction</code>.<br><br><i>Declarar <code>for (int j = ...)</code> dentro do bloco também resolve, por construção.</i>"
},
{
  id:"om12", mod:"openmp", dif:"facil", tipo:"code",
  fonte:"Lab · OpenMP",
  enunciado:"Escreva <b>apenas o trecho paralelo</b> que soma o vetor <code>x</code> em OpenMP, sem condição de corrida.",
  cod:"double *x;        /* vetor com n elementos */\nlong    n;\n\ndouble soma = 0.0;\n\n/* ESCREVA AQUI o laco paralelo */\n\ndouble media = soma / n;",
  chaves:["#pragma omp","reduction","for"],
  modelo:"    #pragma omp parallel for reduction(+:soma)\n    for (long i = 0; i < n; i++)\n        soma += x[i];",
  gabarito:"Sem o <code>reduction</code>, <code>soma</code> seria compartilhada e o <code>+=</code> criaria condição de corrida — é a mesma armadilha do <code>contador++</code> da P1, agora em OpenMP.<br><br><b>O que o <code>reduction(+:soma)</code> faz:</b> cria uma cópia privada de <code>soma</code> em cada thread, inicializada com o elemento neutro do operador (0 para <code>+</code>), e ao final combina todas as cópias na variável original.<br><br>Usar <code>critical</code> a cada iteração também daria o resultado certo, mas serializaria o laço inteiro — ficaria mais lento que a versão serial."
},
{
  id:"om12b", mod:"openmp", dif:"facil", tipo:"code",
  fonte:"Trabalho de Paralelização · item 3.6",
  enunciado:"Escreva <b>apenas as linhas</b> que medem corretamente o tempo de execução de um trecho paralelo em OpenMP, para calcular <i>speedup</i>.",
  cod:"#include <omp.h>\n\n/* ESCREVA a marcacao de tempo em volta da chamada abaixo */\n\n    matmult(A, B, C, n);\n\n/* e imprima o tempo decorrido em segundos */",
  chaves:["omp_get_wtime"],
  modelo:"    double t0 = omp_get_wtime();\n\n    matmult(A, B, C, n);\n\n    double t1 = omp_get_wtime();\n\n    printf(\"tempo: %.6f s com %d threads\\n\", t1 - t0, omp_get_max_threads());",
  gabarito:"<b>Use <code>omp_get_wtime()</code>, nunca <code>clock()</code>.</b> Esse é o erro que mais custa nota em relatório: <code>clock()</code> da libc mede tempo de <b>CPU somado de todas as threads</b> — com 4 threads ele <i>aumenta</i> conforme você paraleliza, e o &ldquo;speedup&rdquo; calculado sai menor que 1.<br><br><code>omp_get_wtime()</code> devolve tempo de <b>parede</b> em segundos, que é o que interessa para S = T<sub>serial</sub>/T<sub>paralelo</sub>.<br><br>Meça só o trecho que você paralelizou — deixe leitura de arquivo e alocação fora da medição."
},
{
  id:"om13", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Para que serve <code>#pragma omp sections</code>?",
  opcoes:[
    "Distribui <b>blocos de código diferentes</b> entre as threads — uma por <code>section</code>. É o paralelismo de tarefas, útil no pipeline.",
    "Divide um laço em seções contíguas, de forma equivalente ao que faz <code>schedule(static)</code>.",
    "Divide o programa em regiões críticas independentes entre si, uma por bloco de código.",
    "Separa as variáveis privadas das compartilhadas na região paralela, com uma seção para cada grupo de variáveis declaradas."
  ],
  correta:0,
  gabarito:"Enquanto <code>for</code> é paralelismo de <b>dados</b> (a mesma operação sobre elementos diferentes), <code>sections</code> é paralelismo de <b>tarefas</b> (operações diferentes ao mesmo tempo). É a construção natural para o pipeline soma&rarr;média&rarr;variância&rarr;desvio do laboratório da P1: cada estágio numa <code>section</code>. Limitação: o paralelismo é fixo no número de seções escritas no código — mais threads que seções deixa threads ociosas. Em OpenMP moderno, <code>task</code> é mais flexível."
},
{
  id:"om14", mod:"openmp", dif:"facil", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"O que retornam <code>omp_get_thread_num()</code> e <code>omp_get_num_threads()</code>?",
  opcoes:[
    "<code>omp_get_thread_num()</code> devolve o número da thread atual (0 é a mestre); <code>omp_get_num_threads()</code>, o tamanho do time.",
    "As duas devolvem o número de núcleos da máquina, independentemente do time de threads.",
    "<code>omp_get_thread_num()</code> devolve o total de threads e <code>omp_get_num_threads()</code>, o índice da atual.",
    "<code>omp_get_thread_num()</code> devolve o PID do processo e <code>omp_get_num_threads()</code>, o TID da thread."
  ],
  correta:0,
  gabarito:"São os equivalentes do <code>rank</code> que se passava manualmente às pthreads na P1. Cuidado com a pegadinha: chamada <b>fora</b> de uma região paralela, <code>omp_get_num_threads()</code> devolve <b>1</b> (o time tem só a thread mestre) — para saber quantas threads serão usadas, use <code>omp_get_max_threads()</code>."
},
{
  id:"om15", mod:"openmp", dif:"dificil", tipo:"mc",
  fonte:"Trabalho de Paralelização · Selection sort",
  enunciado:"Por que o <b>selection sort</b> é difícil de paralelizar bem, mesmo tendo laços aninhados?",
  opcoes:[
    "O laço externo é <b>sequencial</b> — cada passo depende do vetor deixado pelo anterior; só o interno paraleliza, e ele encolhe a cada passo.",
    "Porque o selection sort é recursivo, e o OpenMP não dá suporte a chamadas recursivas dentro de uma região paralela já aberta.",
    "Porque o algoritmo é O(n log n) e o overhead das threads cresce mais rápido que isso.",
    "Porque não há região crítica alguma, e sem região crítica não há o que paralelizar."
  ],
  correta:0,
  gabarito:"O laço externo tem <b>dependência entre iterações</b>: a posição <i>i</i> só pode ser definida depois que as <i>i</i>&minus;1 anteriores já foram. Resta paralelizar a busca do mínimo (laço interno), que é uma <b>redução com <code>min</code></b> — e essa busca vai ficando cada vez menor, até que o custo de abrir e sincronizar o time de threads supere o trabalho útil. Resultado esperado no relatório: <i>speedup</i> modesto e eficiência baixa, o que é uma <b>conclusão válida e esperada</b> — o trabalho pede a análise, não que todo algoritmo escale bem. O heap sort tem o mesmo tipo de problema na fase de extração."
},
{
  id:"om16", mod:"openmp", dif:"facil", tipo:"code",
  fonte:"Lista de OpenMP · Algoritmo 1 (a)",
  enunciado:"O trecho abaixo aproxima π por Monte Carlo e já está correto na versão serial. Escreva <b>apenas a diretiva</b> que falta para paralelizá-lo.",
  cod:"long dentro = 0;\n\n/* ESCREVA A DIRETIVA AQUI */\nfor (long i = 0; i < n; i++) {\n    double x = sorteia();\n    double y = sorteia();\n    if (x*x + y*y <= 1.0) dentro++;\n}\n\ndouble pi = 4.0 * dentro / n;",
  chaves:["#pragma omp", "parallel for", ["reduction", "reduction(+:dentro)", "reducao"]],
  modelo:"#pragma omp parallel for reduction(+:dentro)",
  gabarito:"<code>dentro</code> é acumulada por todas as iterações: sem <code>reduction(+:dentro)</code> há <b>condição de corrida</b> no incremento e o resultado sai menor que o correto, variando a cada execução.<br><br><code>x</code> e <code>y</code> são declaradas <b>dentro</b> do laço, então já são privadas de cada iteração — não precisam de <code>private</code>. O <code>i</code> também é privado automaticamente, por ser o índice do laço paralelizado."
},
{
  id:"om17", mod:"openmp", dif:"medio", tipo:"disc",
  fonte:"Lista de OpenMP · Algoritmo 1 (b)",
  enunciado:"No Monte Carlo, por que usar <code>rand()</code> dentro do laço paralelo é um erro? Qual é a correção?",
  chaves:[["rand() guarda estado interno", "estado interno", "estado global", "estado compartilhado", "variável estática"], ["não é thread-safe", "thread-safe", "thread safe", "nao e seguro"], ["ou serializa numa trava interna", "serializa", "trava interna", "lock interno", "fica mais lento"], ["dar um estado por thread", "um estado por thread", "estado próprio", "rand_r", "gerador próprio", "estado privado"], ["com sementes diferentes", "semente", "sementes distintas", "omp_get_thread_num"]],
  gabarito:"<b>O problema:</b> <code>rand()</code> guarda o estado do gerador numa variável interna <b>compartilhada</b>. Duas threads chamando ao mesmo tempo leem e escrevem esse estado sem proteção — não é <i>thread-safe</i>, e a sequência produzida deixa de ter as propriedades estatísticas esperadas.<br><br>Nas implementações em que <code>rand()</code> <b>é</b> segura, ela consegue isso com uma trava interna: aí não há corrida, mas todas as threads se enfileiram na mesma trava e o programa fica <b>mais lento com mais threads</b>.<br><br><b>A correção:</b> cada thread com o seu próprio estado e a sua própria semente — <code>rand_r(&amp;semente)</code> com <code>semente = base + omp_get_thread_num()</code>, ou um gerador escrito à mão cujo estado é uma variável local da região paralela."
},
{
  id:"om18", mod:"openmp", dif:"facil", tipo:"disc",
  fonte:"Lista de OpenMP · Algoritmo 1 (c)",
  enunciado:"Medindo o Monte Carlo obteve-se T<sub>serial</sub> = 0,512 s e, com 8 threads, T<sub>8</sub> = 0,103 s. Calcule o ganho e a eficiência e comente o resultado.",
  chaves:[["S = 4,97", "4,97", "4.97", "4,9", "aproximadamente 5"], ["E = 0,62", "0,62", "0.62", "62%"], ["o ganho não é linear", "não é linear", "nao e linear", "sublinear", "abaixo de 8"], ["38% da capacidade se perde", "overhead", "perde", "desperdi", "núcleos lógicos", "hyper"]],
  gabarito:"<b>Ganho:</b> S = T<sub>serial</sub> / T<sub>8</sub> = 0,512 / 0,103 = <b>4,97&times;</b>.<br><br><b>Eficiência:</b> E = S / p = 4,97 / 8 = <b>0,62</b>.<br><br><b>Comentário:</b> o ganho é claramente sublinear — com 8 threads o ideal seria 8&times;. Cerca de 38% da capacidade dos processadores não virou trabalho útil. As causas prováveis: o custo de abrir e fechar a região paralela, e o fato de os 8 núcleos <b>lógicos</b> serem provavelmente 4 físicos com <i>hyper-threading</i> — duas threads lógicas dividindo as mesmas unidades de execução não entregam o dobro.<br><br>Ainda assim este é o algoritmo que <b>melhor escala</b> da lista, porque cada iteração é pura CPU e não toca memória compartilhada."
},
{
  id:"om19", mod:"openmp", dif:"facil", tipo:"code",
  fonte:"Lista de OpenMP · Algoritmos 2 e 3 (a)",
  enunciado:"Complete as <b>duas</b> diretivas que paralelizam o cálculo da média e do desvio-padrão de um vetor de <code>n</code> elementos.",
  cod:"double soma = 0.0;\n/* DIRETIVA 1 */\nfor (long i = 0; i < n; i++) soma += x[i];\ndouble media = soma / n;\n\ndouble sq = 0.0;\n/* DIRETIVA 2 */\nfor (long i = 0; i < n; i++) {\n    double d = x[i] - media;\n    sq += d * d;\n}\ndouble desvio = sqrt(sq / n);",
  chaves:["#pragma omp", "parallel for", ["reduction", "reduction(+:soma)", "reducao"]],
  modelo:"/* DIRETIVA 1 */  #pragma omp parallel for reduction(+:soma)\n/* DIRETIVA 2 */  #pragma omp parallel for reduction(+:sq)",
  gabarito:"Duas reduções de soma, uma em cada laço.<br><br><b>Por que precisam ser dois laços separados:</b> o desvio depende da <code>media</code> <b>pronta</b>. Juntar os dois numa passagem só daria errado — cada iteração usaria uma média parcial diferente.<br><br><code>media</code> é lida, nunca escrita, dentro do segundo laço: pode continuar <code>shared</code> sem problema. <code>d</code> é declarada dentro do laço, logo já é privada."
},
{
  id:"om20", mod:"openmp", dif:"medio", tipo:"disc",
  fonte:"Lista de OpenMP · Algoritmos 2 e 3 (b)",
  enunciado:"A média e o desvio-padrão deram ganho de ~3,7&times; com 4 threads (E ≈ 0,93) mas apenas ~4,2&times; com 8 threads (E ≈ 0,52). Por que dobrar as threads quase não melhorou?",
  chaves:[["o gargalo é a memória", "memória", "memoria", "banda", "largura de banda", "memory bound", "limitado por memória"], ["pouca conta por elemento", "pouca conta", "poucas operações", "uma soma", "baixa intensidade", "razão", "operações por byte"], ["a banda é compartilhada", "compartilhad", "mesmo barramento", "disputa", "saturad"], ["mais threads não criam mais banda", "não adianta", "nao adianta", "não aumenta", "satura", "teto"]],
  gabarito:"Porque o limite deixou de ser a CPU e passou a ser a <b>memória</b>.<br><br>Cada iteração faz <b>pouquíssima conta</b> — uma leitura e uma soma na média; uma leitura, uma subtração e uma multiplicação no desvio — e precisa ler o vetor inteiro. A razão entre operações e bytes lidos é baixíssima.<br><br>A <b>largura de banda</b> até a RAM é um recurso <b>compartilhado</b> por todos os núcleos. Com 4 threads ela ainda dá conta; com 8, as threads passam a disputar o mesmo barramento e ficam esperando dado. Acrescentar threads não acrescenta banda.<br><br><b>É um resultado, não um erro.</b> A conclusão correta no relatório é que o algoritmo é <i>memory bound</i> e que o teto de escalabilidade é dado pela memória, não pelo número de núcleos."
},
{
  id:"om21", mod:"openmp", dif:"facil", tipo:"code",
  fonte:"Lista de OpenMP · Algoritmos 2 e 3 (c)",
  enunciado:"O trecho abaixo compila, roda e não tem condição de corrida — mas o desvio-padrão que ele imprime <b>cresce</b> conforme o vetor aumenta, mesmo com os mesmos valores se repetindo. Encontre e corrija o erro.",
  cod:"double sq = 0.0;\n\n#pragma omp parallel for reduction(+:sq)\nfor (long i = 0; i < n; i++) {\n    double d = x[i] - media;\n    sq += d * d;\n}\n\ndouble desvio = sqrt(sq);\nprintf(\"desvio = %f\\n\", desvio);",
  chaves:[["falta dividir por n", "dividir por n", "/ n", "sq / n", "média dos quadrados", "variância"], ["sqrt(sq / n)", "sqrt(sq / n)", "sqrt(sq/n)"]],
  modelo:"double desvio = sqrt(sq / n);",
  gabarito:"<b>O erro é de fórmula, não de concorrência.</b> A variância é a <b>média</b> dos quadrados dos desvios: a soma tem de ser dividida por <code>n</code> antes da raiz.<br><br>Sem o <code>/n</code>, o que se calcula é a raiz da <b>soma</b>, que naturalmente cresce com o tamanho do vetor — daí o sintoma descrito.<br><br><b>Correção:</b> <code>double desvio = sqrt(sq / n);</code><br><br>Vale a atenção: este erro aparece em enunciados de lista com frequência, e a parte paralela do código está perfeita. Nem todo bug num programa paralelo é um bug de paralelismo."
},
{
  id:"om22", mod:"openmp", dif:"facil", tipo:"disc",
  fonte:"Lista de OpenMP · Algoritmo 4 (a)",
  enunciado:"Por que o laço abaixo não pode receber um <code>#pragma omp parallel for</code>?<br><br><code>for (i = 0; i &lt; k; i++) { soma += termo; termo *= x; }</code>",
  chaves:[["termo depende da iteração anterior", "iteração anterior", "iteracao anterior", "depende do anterior", "recorrência", "recorrencia"], ["é uma dependência carregada pelo laço", "dependência carregada", "dependencia carregada", "loop-carried", "carregada pelo laço"], ["RAW entre iterações", "RAW", "leitura após escrita", "verdadeira"], ["a ordem das iterações não é garantida", "ordem", "qualquer ordem", "nao ha ordem", "resultado errado"]],
  gabarito:"Porque <code>termo</code> <b>carrega estado</b> de uma iteração para a próxima: o valor usado na iteração <i>i</i> é o que a iteração <i>i</i>&minus;1 deixou. Isso é uma <b>dependência carregada pelo laço</b> — uma dependência RAW (leitura após escrita) entre iterações.<br><br>O <code>parallel for</code> distribui as iterações entre as threads sem garantia nenhuma de ordem. A iteração 5.000.000 pode começar antes da 3, e aí ela lê um <code>termo</code> que não é o dela. O resultado sai errado e <b>diferente a cada execução</b>.<br><br>Declarar <code>termo</code> como <code>private</code> não resolve: privatizar remove o conflito de nome, mas a dependência aqui é de <b>valor</b>. Cada thread passaria a ter um <code>termo</code> não inicializado."
},
{
  id:"om23", mod:"openmp", dif:"medio", tipo:"code",
  fonte:"Lista de OpenMP · Algoritmo 4 (b)",
  enunciado:"Reescreva a soma de x<sup>k</sup> de forma que as iterações fiquem <b>independentes</b> e possam ser paralelizadas. Escreva o laço completo com a diretiva.",
  cod:"/* versao serial com recorrencia - NAO paraleliza */\ndouble soma = 0.0, termo = 1.0;\nfor (long i = 0; i < k; i++) {\n    soma += termo;\n    termo *= x;\n}\n\n/* ESCREVA AQUI A VERSAO PARALELIZAVEL */",
  chaves:["#pragma omp", "parallel for", ["reduction", "reduction(+:soma)"], ["pow", "pow(x", "potência", "potencia"]],
  modelo:"double soma = 0.0;\n\n#pragma omp parallel for reduction(+:soma)\nfor (long i = 0; i < k; i++)\n    soma += pow(x, (double) i);",
  gabarito:"A recorrência precisa sumir: cada termo tem de ser calculado <b>a partir do próprio <code>i</code></b>, sem olhar para o anterior. Com <code>pow(x, i)</code> as iterações ficam independentes e o <code>reduction(+:soma)</code> cuida da soma.<br><br><b>O preço:</b> a recorrência fazia <b>uma multiplicação</b> por termo; <code>pow</code> custa dezenas de ciclos. Trocou-se um algoritmo barato e sequencial por um caro e paralelo. Se isso compensa ou não é exatamente o que a letra (c) pede para avaliar.<br><br>Compile com <code>-lm</code>: <code>pow</code> está na biblioteca matemática."
},
{
  id:"om24", mod:"openmp", dif:"dificil", tipo:"disc",
  fonte:"Lista de OpenMP · Algoritmo 4 (c)",
  enunciado:"Um colega mediu a série de potências e apresentou: versão com <code>pow</code> serial = 0,610 s; a mesma com 8 threads = 0,150 s; <b>ganho 4,07&times;</b>. Ele concluiu que a paralelização foi um sucesso. Na mesma máquina, a versão serial com recorrência leva <b>0,039 s</b>. Critique a conclusão.",
  chaves:[["a base de comparação está errada", "base", "referência", "referencia", "T serial", "comparação errada", "baseline"], ["T_serial é o melhor algoritmo serial", "melhor algoritmo serial", "melhor versão serial", "melhor serial"], ["o ganho real é 0,26x", "0,26", "0.26", "menor que 1", "menor que um", "0,039 / 0,150"], ["ficou mais lento que o serial", "mais lento", "piorou", "pior que o serial"], ["paralelizar exigiu trocar o algoritmo", "trocar o algoritmo", "outro algoritmo", "trabalho a mais", "pow custa", "trabalho extra"]],
  gabarito:"<b>A conclusão está errada porque a base de comparação está errada.</b><br><br>O ganho de 4,07&times; compara o algoritmo com <code>pow</code> paralelo contra o algoritmo com <code>pow</code> <b>serial</b>. Isso mede só a qualidade da paralelização daquele algoritmo — não diz se valeu a pena.<br><br>Por definição, T<sub>serial</sub> é o tempo do <b>melhor algoritmo serial conhecido</b>, que aqui é a recorrência, com 0,039 s. O ganho real é<br><br>S = 0,039 / 0,150 = <b>0,26&times;</b><br><br>Ou seja: a versão paralela com 8 threads é cerca de <b>4 vezes mais lenta</b> que a versão serial original. A paralelização <b>piorou</b> o programa.<br><br><b>A causa:</b> para paralelizar foi preciso trocar o algoritmo, e o algoritmo novo faz muito mais trabalho — 40 milhões de chamadas a <code>pow</code> no lugar de 40 milhões de multiplicações. As 8 threads não dão conta de devolver esse custo.<br><br><b>A recomendação correta:</b> não paralelizar este algoritmo. E registrar isso no relatório — é uma conclusão válida e vale nota."
},
{
  id:"om25", mod:"openmp", dif:"medio", tipo:"disc",
  fonte:"Lista de OpenMP · Algoritmo 5 (a)",
  enunciado:"No algoritmo 5 (e<sup>x</sup> pela série) a recorrência <code>termo *= x / i</code> foi <b>mantida</b>, enquanto no algoritmo 4 ela precisou ser eliminada. Por que a decisão é diferente?",
  chaves:[["o paralelismo está no laço de fora", "laço de fora", "laco externo", "laço externo", "laco de fora", "outro laço", "vários valores de x"], ["a recorrência fica dentro de uma iteração", "dentro de uma iteração", "dentro da iteração", "nao atravessa", "não atravessa", "inteira dentro"], ["não há dependência entre iterações do laço externo", "independente", "sem dependência", "sem dependencia", "nao ha dependencia"], ["e assim ela continua barata", "barata", "mais rápido", "sem custo extra", "evita pow", "mais preciso"]],
  gabarito:"Porque no algoritmo 5 existe um <b>laço mais externo</b> para paralelizar: a série é avaliada para <b>muitos valores de x</b>.<br><br>Paralelizando o laço de fora, cada iteração calcula uma série <b>inteira</b>, com a recorrência acontecendo <b>dentro</b> dela. A dependência continua existindo, mas não atravessa a fronteira entre iterações do laço paralelizado — e é só isso que o OpenMP exige.<br><br>No algoritmo 4 só havia <b>um</b> laço, e a dependência estava justamente nele. Não havia para onde subir.<br><br><b>A regra prática:</b> antes de quebrar uma recorrência, procure um laço mais externo. Paralelizar por fora é mais barato (mais trabalho por iteração, menos sincronização) e preserva o algoritmo eficiente."
},
{
  id:"om26", mod:"openmp", dif:"facil", tipo:"code",
  fonte:"Lista de OpenMP · Algoritmo 5 (b)",
  enunciado:"Complete a diretiva do laço que compara a série com a <code>exp()</code> da biblioteca e guarda o <b>maior</b> erro encontrado.",
  cod:"double erro = 0.0;\n\n/* ESCREVA A DIRETIVA AQUI */\nfor (long i = 0; i < n; i++) {\n    y[i] = exp_serie(x[i], K);\n    double e = fabs(y[i] - exp(x[i]));\n    if (e > erro) erro = e;\n}",
  chaves:["#pragma omp", "parallel for", ["reduction(max", "reduction(max:erro)", "max:erro", "reducao de maximo"]],
  modelo:"#pragma omp parallel for reduction(max:erro)",
  gabarito:"<code>reduction</code> não serve só para soma. Com o operador <code>max</code>, cada thread recebe uma cópia privada de <code>erro</code> inicializada com o <b>menor valor possível</b>, acha o maior erro da sua faixa, e no final o OpenMP combina todas pegando o maior de todos.<br><br>Sem isso, <code>erro</code> seria compartilhada e o par <code>if (e &gt; erro) erro = e;</code> seria uma clássica condição de corrida: duas threads podem testar antes de qualquer uma escrever, e um dos máximos se perde.<br><br><code>y[i]</code> não precisa de proteção nenhuma: cada iteração escreve na <b>sua</b> posição."
},
{
  id:"om27", mod:"openmp", dif:"facil", tipo:"code",
  fonte:"Lista de OpenMP · Algoritmos 6 e 7 (a)",
  enunciado:"Complete a diretiva da integral de f pela regra do ponto médio.",
  cod:"double h = (b - a) / m, soma = 0.0;\n\n/* ESCREVA A DIRETIVA AQUI */\nfor (long i = 0; i < m; i++)\n    soma += f(a + (i + 0.5) * h);\n\ndouble integral = soma * h;",
  chaves:["#pragma omp", "parallel for", ["reduction", "reduction(+:soma)"]],
  modelo:"#pragma omp parallel for reduction(+:soma)",
  gabarito:"É um <i>map + reduction</i> perfeito: cada iteração avalia f num ponto que depende apenas de <code>i</code>, e todas somam no mesmo acumulador.<br><br><code>h</code>, <code>a</code> e <code>m</code> são lidas e nunca escritas: podem ficar <code>shared</code>. A multiplicação final por <code>h</code> fica <b>fora</b> do laço — distribuí-la para dentro daria o mesmo resultado matemático, com m multiplicações a mais."
},
{
  id:"om28", mod:"openmp", dif:"medio", tipo:"disc",
  fonte:"Lista de OpenMP · Algoritmos 6 e 7 (b)",
  enunciado:"A função do algoritmo 6 é f(x) = 1/(1 &minus; e<sup>x</sup>), e o algoritmo 7 pede a integral dela de &minus;1 a 1. Que cuidado <b>numérico</b> o enunciado esconde, e por que a regra do ponto médio funciona onde a do trapézio falharia?",
  chaves:[["há um polo em x = 0", "polo", "x = 0", "singularidade", "denominador zera", "divisão por zero", "divisao por zero"], ["porque e^0 = 1", "e^0", "e elevado a 0", "exp(0)", "igual a 1"], ["o ponto médio nunca cai em x = 0", "ponto médio", "ponto medio", "nunca cai", "não avalia", "nao avalia", "meio do subintervalo"], ["o trapézio avalia nas bordas", "trapézio", "trapezio", "borda", "extremo", "inf", "nan"], ["o valor é o valor principal de Cauchy", "valor principal", "Cauchy", "cancelam", "simetria"]],
  gabarito:"<b>O cuidado:</b> em x = 0 temos e<sup>0</sup> = 1, o denominador zera e f tem um <b>polo</b>. O intervalo de integração [&minus;1, 1] passa exatamente por ele.<br><br><b>Por que o ponto médio funciona:</b> ela avalia f no <b>meio</b> de cada subintervalo, em x<sub>i</sub> = a + (i + 0,5)h. Com um número par de subintervalos simétricos em torno de zero, nenhum ponto médio cai em x = 0. Já a regra do trapézio (e a de Simpson) avaliam nas <b>bordas</b> dos subintervalos — uma delas é x = 0, f retorna <code>inf</code>, e a soma inteira vira <code>inf</code> ou <code>nan</code>.<br><br><b>O que o número significa:</b> a integral comum diverge. O que a soma encontra é o <b>valor principal de Cauchy</b> — as contribuições &minus;1/x dos dois lados do polo se cancelam por simetria. Ele vale exatamente <b>1</b>, e o programa dá 0,99999998.<br><br>Repare que nada disso tem a ver com paralelismo: é um erro que existiria igual na versão serial."
},
{
  id:"om29", mod:"openmp", dif:"dificil", tipo:"disc",
  fonte:"Lista de OpenMP · Algoritmos 6 e 7 (c)",
  enunciado:"Ao medir o algoritmo 6, a versão OpenMP rodando com <b>1 thread</b> levou 0,188 s, enquanto a versão serial levou 0,143 s — ou seja, ganho de <b>0,76</b>. Como isso é possível, se o trabalho é o mesmo?",
  chaves:[["abrir a região paralela custa", "custo", "overhead", "abrir", "criar o time", "região paralela", "regiao paralela"], ["o reduction acrescenta cópia e combinação", "reduction", "cópia privada", "copia privada", "combinação", "combinacao"], ["o compilador otimiza os dois laços de forma diferente", "compilador", "otimiza", "vetoriza", "vetorização", "vetorizacao", "código diferente"], ["com 1 thread o paralelismo não compensa nada", "não compensa", "nao compensa", "nenhum ganho", "sem paralelismo", "só custo", "so custo"]],
  gabarito:"Não é ruído de medição — é o <b>custo da paralelização</b> aparecendo sozinho, sem nenhum benefício para compensá-lo.<br><br>Com p = 1 o programa faz todo o trabalho que o serial faz, <b>mais</b>:<br><br>&bull; abrir e fechar a região paralela (criar o time, a barreira implícita do fim);<br>&bull; criar a cópia privada do <code>reduction</code> e combiná-la no fim;<br>&bull; e, o mais importante, o laço gerado para o OpenMP <b>não é o mesmo código</b> que o compilador gera para o laço serial. Limites dinâmicos e o acumulador do <code>reduction</code> costumam impedir otimizações — vetorização, principalmente — que o laço serial recebe de graça.<br><br><b>O que isso ensina:</b> a linha de p = 1 da tabela não é “a versão serial”. Ela mede quanto custa o OpenMP. Usá-la como T<sub>serial</sub> <b>infla</b> todos os ganhos da tabela — que é o mesmo erro cobrado no algoritmo 4."
},
{
  id:"om30", mod:"openmp", dif:"facil", tipo:"disc",
  fonte:"Lista de OpenMP · Compilação",
  enunciado:"O que acontece se você compilar um programa com <code>#pragma omp parallel for</code> e <b>esquecer</b> a flag <code>-fopenmp</code>? E para que serve a macro <code>_OPENMP</code>?",
  chaves:[["os pragmas são ignorados", "ignorad", "ignora", "comentário", "comentario", "não faz efeito"], ["compila e roda serial", "serial", "sequencial", "uma thread"], ["o resultado continua correto", "correto", "certo", "mesmo resultado", "sem erro", "sem aviso"], ["mas as funções omp_ não existem e o link quebra", "omp_get", "link", "undefined", "não existe", "nao existe", "erro de ligação"], ["_OPENMP permite o #ifdef", "#ifdef", "ifdef", "versão", "versao", "detectar", "portátil", "portatil"]],
  gabarito:"<b>Os <code>#pragma</code> são ignorados em silêncio.</b> Por definição, um pragma desconhecido não é erro. O programa compila, roda e dá o <b>resultado certo</b> — só que <b>serial</b>, e sem nenhum aviso.<br><br>É a primeira coisa a verificar quando o “paralelo” tem exatamente o tempo do serial.<br><br><b>O que quebra:</b> as <b>funções</b> da biblioteca — <code>omp_get_wtime()</code>, <code>omp_get_thread_num()</code>, <code>omp_set_num_threads()</code>. Sem <code>-fopenmp</code> o <code>&lt;omp.h&gt;</code> não é encontrado e o link falha.<br><br><b>A macro <code>_OPENMP</code></b> é definida automaticamente pelo compilador quando a flag está presente, com a data da versão do padrão (por exemplo <code>202111</code>). Serve para escrever código portátil: <code>#ifdef _OPENMP</code> inclui o cabeçalho e usa as funções; o <code>#else</code> fornece substitutos seriais. O mesmo fonte passa a compilar nas duas situações."
},
{
  id:"om31", mod:"openmp", dif:"medio", tipo:"code",
  fonte:"Lista de OpenMP · Forma canônica",
  enunciado:"O compilador recusa o laço abaixo com um erro de forma canônica. Diga qual é o problema e reescreva o laço de modo que ele possa ser paralelizado.",
  cod:"/* procura o primeiro indice onde v[i] == alvo */\nint achou = -1;\n\n#pragma omp parallel for\nfor (int i = 0; i < n; i++) {\n    if (v[i] == alvo) {\n        achou = i;\n        break;          /* <- o compilador reclama daqui */\n    }\n}",
  chaves:[["#pragma omp parallel for", "#pragma omp", "parallel for"], ["continue no lugar do break", "continue"], ["critical para atualizar o índice", "critical", "atomic"]],
  modelo:"int achou = n;        /* n = \"nao achou\" */\n\n#pragma omp parallel for\nfor (int i = 0; i < n; i++) {\n    if (i > achou) continue;        /* ja achou um anterior: pula */\n    if (v[i] == alvo) {\n        #pragma omp critical\n        if (i < achou) achou = i;   /* guarda o MENOR indice */\n    }\n}\nif (achou == n) achou = -1;",
  gabarito:"<b>O problema:</b> o <code>break</code> não entra na <b>forma canônica</b>. O OpenMP precisa saber <b>quantas iterações existem</b> antes de começar, para distribuí-las entre as threads; um laço que pode parar no meio não tem esse número. Pela mesma razão são proibidos <code>return</code>, <code>goto</code> para fora e <code>exit</code>. O <code>continue</code>, sim, é permitido — ele encerra apenas <b>aquela</b> iteração.<br><br><b>A reescrita:</b> troca-se a parada por uma <b>variável compartilhada</b> com o melhor índice até agora. O <code>continue</code> faz as iterações posteriores saírem imediatamente, e o <code>critical</code> protege a atualização.<br><br><b>O custo:</b> todas as iterações ainda são percorridas, só que a maioria custa um teste. Não é tão rápido quanto parar de verdade — é a troca que o OpenMP impõe. Para buscas que terminam muito cedo, a versão serial pode continuar ganhando."
},
{
  id:"om32", mod:"openmp", dif:"medio", tipo:"code",
  fonte:"Lista de OpenMP · Série de Leibniz",
  enunciado:"O código abaixo calcula π pela série de Leibniz. Ele imprime um valor <b>errado</b>, e diferente a cada execução. Aponte a causa e corrija.",
  cod:"double soma = 0.0, fator = 1.0;\n\n#pragma omp parallel for reduction(+:soma)\nfor (int k = 0; k < n; k++) {\n    soma += fator / (2 * k + 1);\n    fator = -fator;\n}\n\ndouble pi = 4.0 * soma;",
  chaves:[["#pragma omp parallel for", "#pragma omp", "parallel for"], ["reduction(+:soma)", "reduction"], ["o sinal derivado de k", "k % 2", "k%2", "(-1)", "pow(-1"]],
  modelo:"double soma = 0.0;\n\n#pragma omp parallel for reduction(+:soma)\nfor (int k = 0; k < n; k++)\n    soma += ((k % 2 == 0) ? 1.0 : -1.0) / (2 * k + 1);\n\ndouble pi = 4.0 * soma;",
  gabarito:"<b>A causa:</b> <code>fator</code> é declarada fora da região paralela, portanto é <code>shared</code>, e seu valor na iteração <i>k</i> depende do que a iteração <i>k</i>&minus;1 deixou. É uma <b>dependência carregada pelo laço</b> disfarçada de variável auxiliar.<br><br>Como a ordem das iterações não é garantida e todas as threads escrevem em <code>fator</code>, cada execução lê uma sequência de sinais diferente. Daí o resultado errado e instável.<br><br><b>A correção:</b> derivar o sinal <b>do próprio <code>k</code></b>, eliminando o estado. As iterações ficam independentes.<br><br><b>Alternativa equivalente:</b> manter <code>fator</code> e declará-la <code>private(fator)</code>, atribuindo <code>fator = (k % 2 == 0) ? 1.0 : -1.0;</code> <b>dentro</b> do laço. Só privatizar sem recalcular <b>não resolve</b>: a cópia privada nasce sem valor definido."
},
{
  id:"om33", mod:"openmp", dif:"medio", tipo:"disc",
  fonte:"Lista de OpenMP · reduction",
  enunciado:"Explique o que o OpenMP faz exatamente ao encontrar <code>reduction(+:soma)</code>. Por que isso é melhor que proteger o <code>soma += ...</code> com <code>critical</code>?",
  chaves:[["cria uma cópia privada em cada thread", "cópia privada", "copia privada", "privada", "uma por thread"], ["inicializada com o elemento neutro", "neutro", "zero", "identidade", "elemento neutro"], ["e combina todas no fim", "combina", "soma no fim", "junta", "ao final"], ["o critical trava a cada iteração", "cada iteração", "cada iteracao", "toda iteração", "serializa", "enfileira", "trava sempre"], ["a redução trava uma vez por thread", "uma vez", "só no fim", "so no fim", "p vezes"]],
  gabarito:"<b>O que o OpenMP faz — três passos:</b><br><br><b>1.</b> Cria uma <b>cópia privada</b> de <code>soma</code> em cada thread.<br><b>2.</b> Inicializa cada cópia com o <b>elemento neutro</b> do operador — 0 para <code>+</code>, 1 para <code>*</code>, o maior valor possível para <code>min</code>, e assim por diante.<br><b>3.</b> Ao final da região, <b>combina</b> todas as cópias com o operador, acrescentando ao valor que a variável tinha antes.<br><br><b>Por que é melhor que <code>critical</code>:</b> com <code>critical</code> <b>toda iteração</b> passa pela mesma trava. As threads se enfileiram, e num laço de soma — onde a iteração é baratíssima — o tempo passa a ser dominado pela sincronização; é comum ficar mais lento que o serial.<br><br>Com <code>reduction</code> cada thread trabalha livre na sua cópia e há <b>uma única</b> combinação no fim: p operações de sincronização em vez de n.<br><br>É a mesma ideia do fork/join com somas parciais, escrita em uma linha."
},
{
  id:"om34", mod:"openmp", dif:"facil", tipo:"disc",
  fonte:"Lista de OpenMP · schedule",
  enunciado:"Compare <code>schedule(static)</code>, <code>schedule(dynamic)</code>, <code>schedule(guided)</code> e <code>schedule(runtime)</code>, dizendo em que situação cada um é a escolha certa.",
  chaves:[["static divide em blocos iguais de antemão", "static", "antes", "antecipad", "blocos iguais", "custo igual", "sem overhead"], ["dynamic entrega sob demanda", "dynamic", "sob demanda", "quando termina", "fila", "desbalanceado", "imprevisível", "imprevisivel"], ["guided usa pedaços decrescentes", "guided", "decrescente", "diminui", "encolhe", "grandes no começo"], ["runtime lê OMP_SCHEDULE", "runtime", "OMP_SCHEDULE", "variável de ambiente", "variavel de ambiente", "sem recompilar"]],
  gabarito:"&bull; <b><code>static</code></b> — as iterações são divididas em blocos iguais <b>antes</b> de começar. Custo de distribuição praticamente zero. É a escolha quando todas as iterações custam o <b>mesmo</b>.<br><br>&bull; <b><code>dynamic</code></b> — cada thread pega um <i>chunk</i> da fila quando termina o anterior. Balanceia bem quando o custo por iteração é <b>imprevisível</b>, ao preço de uma ida à fila compartilhada por chunk.<br><br>&bull; <b><code>guided</code></b> — como o dinâmico, mas os pedaços vão <b>encolhendo</b>: grandes no começo (pouca sincronização) e pequenos no fim (bom acabamento). Indicado quando o custo das iterações <b>decresce</b> — laço triangular, busca do mínimo no selection sort.<br><br>&bull; <b><code>runtime</code></b> — não decide nada na compilação: lê a variável de ambiente <code>OMP_SCHEDULE</code>. É a opção para <b>experimentar</b> políticas sem recompilar, que é o que o Trabalho pede.<br><br><b>Cuidado com o chunk:</b> <code>dynamic,1</code> dá o melhor balanceamento teórico e costuma ser o mais lento, porque cada iteração paga uma sincronização."
},
{
  id:"om35", mod:"openmp", dif:"dificil", tipo:"code",
  fonte:"Lista de OpenMP · task",
  enunciado:"<b>Reescreva</b> o laço abaixo para percorrer a lista encadeada em paralelo, chamando <code>processa(q)</code> para cada nó. <code>parallel for</code> não serve aqui — use tarefas.",
  cod:"/* No *lista; cada no tem um campo prox */\n\nfor (No *q = lista; q != NULL; q = q->prox)\n    processa(q);\n\n/* REESCREVA EM PARALELO */",
  chaves:["#pragma omp parallel", ["single", "omp single"], ["task", "omp task"], ["firstprivate", "firstprivate(q)"]],
  modelo:"#pragma omp parallel\n{\n    #pragma omp single            /* UMA thread percorre e cria as tarefas */\n    for (No *q = lista; q != NULL; q = q->prox) {\n        #pragma omp task firstprivate(q)\n        processa(q);              /* qualquer thread do time executa */\n    }\n}                                 /* barreira implicita espera tudo */",
  gabarito:"<b>Por que não dá <code>parallel for</code>:</b> a lista não tem número de iterações conhecido de antemão nem índice inteiro — não está na forma canônica.<br><br><b>As três peças:</b><br><br>&bull; <code>parallel</code> cria o time de threads;<br>&bull; <code>single</code> faz <b>uma</b> thread percorrer a lista e criar as tarefas. Sem ele, <b>todas</b> as threads percorreriam, e cada nó seria processado tantas vezes quantas forem as threads;<br>&bull; <code>task</code> enfileira o trabalho; qualquer thread ociosa o executa.<br><br><b><code>firstprivate(q)</code> é obrigatório.</b> <code>q</code> é a variável do laço e continua avançando enquanto as tarefas esperam na fila. Sem <code>firstprivate</code> todas as tarefas leriam o <code>q</code> atual — na prática, <code>NULL</code>. <code>firstprivate</code> copia o <b>valor no momento da criação</b> da tarefa.<br><br>A barreira implícita no fim do <code>parallel</code> garante que tudo terminou; se fosse preciso esperar antes disso, usaria-se <code>#pragma omp taskwait</code>."
},
{
  id:"om36", mod:"openmp", dif:"dificil", tipo:"code",
  fonte:"Lista de OpenMP · Falso compartilhamento",
  enunciado:"O código abaixo dá o resultado <b>correto</b> e não tem condição de corrida, mas fica <b>mais lento</b> conforme se acrescentam threads. Explique e corrija.",
  cod:"double parcial[8];\n\n#pragma omp parallel num_threads(8)\n{\n    int id = omp_get_thread_num();\n    parcial[id] = 0.0;\n\n    #pragma omp for\n    for (long i = 0; i < n; i++)\n        parcial[id] += v[i];\n}\n\ndouble soma = 0.0;\nfor (int t = 0; t < 8; t++) soma += parcial[t];",
  chaves:[["acumulador em variável local", "variável local", "variavel local", "double meu", "acumulador local"], ["#pragma omp for", "omp for"], ["escrever no vetor uma vez só", "omp_get_thread_num"], ["ou simplesmente reduction", "reduction"]],
  modelo:"/* solucao 1: acumula em variavel local, escreve UMA vez */\n#pragma omp parallel num_threads(8)\n{\n    double meu = 0.0;\n    #pragma omp for\n    for (long i = 0; i < n; i++) meu += v[i];\n    parcial[omp_get_thread_num()] = meu;\n}\n\n/* solucao 2, melhor ainda: deixar o reduction resolver */\ndouble soma = 0.0;\n#pragma omp parallel for num_threads(8) reduction(+:soma)\nfor (long i = 0; i < n; i++) soma += v[i];",
  gabarito:"<b>O problema é <i>falso compartilhamento</i>.</b> Oito <code>double</code> ocupam 64 bytes — exatamente <b>uma linha de cache</b>. As threads escrevem em posições <b>diferentes</b>, então não há corrida nenhuma e o resultado é correto. Mas a cache não trabalha com bytes, e sim com linhas inteiras.<br><br>Cada escrita de uma thread faz o protocolo de coerência <b>invalidar a linha</b> nas caches das outras sete, que precisam buscá-la de novo para escrever. A linha fica sendo arrastada de um núcleo para outro a cada iteração. Elas não compartilham dado — compartilham a <b>linha</b>. Daí o nome.<br><br><b>A correção:</b> acumular numa <b>variável local</b> (que vive em registrador) e escrever no vetor <b>uma única vez</b>, no fim. Melhor ainda é deixar o <code>reduction</code> fazer isso — é exatamente o que ele faz.<br><br><b>Alternativa quando o vetor é mesmo necessário:</b> <i>padding</i> — espaçar as posições com uma struct de 64 bytes, para cada uma cair numa linha diferente."
},
{
  id:"om37", mod:"openmp", dif:"medio", tipo:"disc",
  fonte:"Lista de OpenMP · Sincronização",
  enunciado:"Quando usar <code>critical</code>, quando usar <code>atomic</code> e quando usar <code>reduction</code>? Ordene-os do mais rápido para o mais lento.",
  chaves:[["reduction é o mais rápido", "reduction", "redução", "reducao", "mais rápido", "mais rapido"], ["atomic é uma instrução do processador", "atomic", "instrução", "instrucao", "hardware", "uma operação", "lock xadd"], ["critical é uma trava para qualquer bloco", "critical", "trava", "bloco", "qualquer código", "mais geral", "mais lento"], ["reduction só serve para acumular com um operador", "acumular", "operador", "associativ", "soma"]],
  gabarito:"<b>Do mais rápido para o mais lento: <code>reduction</code> &gt; <code>atomic</code> &gt; <code>critical</code>.</b><br><br>&bull; <b><code>reduction(op:var)</code></b> — para <b>acumular</b> com um operador associativo (+, *, min, max, &amp;&amp;…). Cada thread trabalha numa cópia privada e há <b>uma</b> combinação no fim. Sempre que couber, é esta a escolha.<br><br>&bull; <b><code>atomic</code></b> — para <b>uma única</b> operação de leitura-modificação-escrita numa posição de memória (<code>x += a</code>, <code>x++</code>). Usa uma instrução atômica do processador, sem trava de software. Serve quando o destino <b>varia</b> e não dá para reduzir, como no histograma: <code>hist[v[i]]++</code>.<br><br>&bull; <b><code>critical</code></b> — para um <b>bloco qualquer</b> de código que precisa ser exclusivo. É o mais geral e o mais caro: uma trava de software, e por padrão <b>todos</b> os <code>critical</code> sem nome do programa disputam a mesma trava (dar nomes diferentes separa as travas).<br><br><b>Regra prática:</b> tente <code>reduction</code>; se o destino varia, <code>atomic</code>; se nem isso, <code>critical</code> — e então pergunte-se se o algoritmo não deveria ser outro."
},
{
  id:"om38", mod:"openmp", dif:"facil", tipo:"disc",
  fonte:"Lista de OpenMP · Metodologia",
  enunciado:"Descreva os <b>sete passos</b> pedidos em todos os algoritmos da lista e cite dois cuidados de medição que afetam diretamente a nota.",
  chaves:[["escrever a versão serial", "serial", "sequencial"], ["medir o tempo serial", "medir", "tempo", "cronometr"], ["paralelizar com OpenMP", "paraleliz", "OpenMP", "pragma"], ["calcular o ganho S = Ts/Tp", "ganho", "speedup", "Ts/Tp", "S ="], ["calcular a eficiência E = S/p", "eficiência", "eficiencia", "E = S", "S/p"], ["repetir com 1, 2, 4, 8 threads", "repetir", "variar", "1, 2, 4", "número de threads", "numero de threads", "escalabilidade"], ["descartar um aquecimento", "aquecimento", "warm", "descartar", "primeira execução", "primeira execucao", "cache fria"], ["usar o melhor de várias execuções", "melhor de", "várias execuções", "varias execucoes", "repetições", "repeticoes", "média de", "mediana"]],
  gabarito:"<b>Os sete passos:</b><br><br><b>1.</b> Escrever a versão <b>serial</b> do algoritmo.<br><b>2.</b> Medir T<sub>serial</sub>.<br><b>3.</b> Paralelizar com OpenMP.<br><b>4.</b> Medir T<sub>paralelo</sub>.<br><b>5.</b> Calcular o ganho S = T<sub>serial</sub> / T<sub>paralelo</sub>.<br><b>6.</b> Calcular a eficiência E = S / p.<br><b>7.</b> Repetir com 1, 2, 4, 8… threads e analisar a <b>escalabilidade</b>.<br><br><b>Cuidados de medição:</b><br><br>&bull; <b>Descartar um aquecimento.</b> A primeira execução paga cache fria e alocação de páginas (<i>first touch</i>); ela mede o sistema operacional, não o algoritmo.<br><br>&bull; <b>Repetir e ficar com o melhor</b> (ou com a mediana) de várias execuções. Uma medição isolada carrega tudo o que mais estava rodando na máquina.<br><br>&bull; <b>T<sub>serial</sub> é o melhor algoritmo serial</b>, não a versão paralela com uma thread. Esse é o erro que o algoritmo 4 da lista existe para ensinar.<br><br>&bull; Usar <code>omp_get_wtime()</code> (relógio de parede) e não <code>clock()</code>, que soma o tempo de <b>todas</b> as threads e cresce com o paralelismo."
}

]);
