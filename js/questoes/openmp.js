/* ─── OpenMP ────────────────────────────────────────────────
   P2 · 16 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"om01", mod:"openmp", dif:"facil", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"O que faz a diretiva <code>#pragma omp parallel for</code> e como se compila um programa OpenMP?",
  opcoes:[
    "Cria um time de threads e distribui as iterações do laço seguinte entre elas; compila-se com <code>gcc prog.c -o prog -fopenmp</code>.",
    "Executa o laço p vezes, uma em cada thread; compila-se com <code>-pthread</code>.",
    "Marca o laço como região crítica; compila-se com <code>-lomp</code>.",
    "Vetoriza o laço com instruções SIMD; não requer nenhuma opção de compilação."
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
    "Cria uma cópia privada de <code>soma</code> em cada thread, inicializada com o elemento neutro do operador (0 para <code>+</code>), e ao final combina todas as cópias na variável original com esse operador.",
    "Protege <code>soma</code> com um mutex a cada iteração do laço.",
    "Reduz o número de threads usadas no laço, para evitar disputa pela variável.",
    "Faz a variável <code>soma</code> ser compartilhada por todas as threads, sem proteção."
  ],
  correta:0,
  gabarito:"É exatamente o padrão do Q3 do laboratório de Processos e Threads da P1, automatizado: acumulador <b>privado</b> por thread e combinação ao final. A combinação é feita de forma eficiente pelo runtime, tipicamente em árvore. Sem o <code>reduction</code>, <code>soma</code> seria compartilhada e o <code>+=</code> criaria condição de corrida. Usar <code>critical</code> a cada iteração até corrigiria o resultado, mas serializaria o laço inteiro — a versão com <code>reduction</code> é ordens de grandeza mais rápida. Cada operador tem seu neutro: <code>+</code>&rarr;0, <code>*</code>&rarr;1, <code>max</code>&rarr;&minus;&infin;."
},
{
  id:"om03", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Qual a diferença entre as cláusulas <code>private</code>, <code>shared</code> e <code>firstprivate</code>?",
  opcoes:[
    "<code>shared</code>: uma única variável para todas as threads. <code>private</code>: cada thread tem sua cópia, <b>não inicializada</b>. <code>firstprivate</code>: cópia privada, <b>inicializada</b> com o valor que a variável tinha antes da região paralela.",
    "<code>private</code> e <code>firstprivate</code> são sinônimos; <code>shared</code> é o oposto dos dois.",
    "<code>shared</code> copia o valor para cada thread; <code>private</code> mantém uma variável única.",
    "As três controlam o número de threads que acessam a variável simultaneamente."
  ],
  correta:0,
  gabarito:"A armadilha está no <code>private</code>: a cópia entra na região paralela com <b>lixo</b>, não com o valor anterior — se você precisa do valor de entrada, use <code>firstprivate</code>. Por padrão, as variáveis declaradas fora da região são <code>shared</code>, mas o <b>índice do laço</b> paralelizado é sempre privado automaticamente. Boa prática defensiva: usar <code>default(none)</code> e declarar explicitamente o escopo de cada variável."
},
{
  id:"om04", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Qual a diferença entre <code>#pragma omp critical</code> e <code>#pragma omp atomic</code>?",
  opcoes:[
    "<code>critical</code> serializa um <b>bloco de código</b> qualquer com uma trava; <code>atomic</code> vale só para uma <b>operação simples de leitura-modificação-escrita</b> sobre uma posição de memória, e usa instruções atômicas do processador — bem mais rápido.",
    "<code>atomic</code> protege blocos e <code>critical</code> protege apenas variáveis simples.",
    "São idênticas em função; <code>atomic</code> é apenas a sintaxe mais nova.",
    "<code>critical</code> só funciona dentro de laços <code>for</code>; <code>atomic</code> funciona em qualquer lugar."
  ],
  correta:0,
  gabarito:"Prefira <code>atomic</code> quando a operação for do tipo <code>x += expr</code>, <code>x++</code>, <code>x = x &amp; expr</code> — o compilador emite uma instrução atômica de hardware, sem trava. Use <code>critical</code> quando precisar proteger várias linhas ou uma chamada de função. Atenção: <b>duas regiões <code>critical</code> sem nome compartilham a mesma trava global</b>, o que serializa trechos independentes — dê nomes distintos (<code>#pragma omp critical(nome)</code>) quando forem regiões diferentes. E para reduções, prefira <code>reduction</code> aos dois."
},
{
  id:"om05", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Qual a diferença entre <code>schedule(static)</code> e <code>schedule(dynamic)</code>, e quando usar cada um?",
  opcoes:[
    "<code>static</code> divide as iterações em blocos fixos antes da execução — melhor quando todas as iterações custam o mesmo. <code>dynamic</code> distribui blocos sob demanda, conforme as threads terminam — melhor quando o custo por iteração é irregular ou desconhecido.",
    "<code>static</code> usa sempre uma thread e <code>dynamic</code> usa todas as disponíveis.",
    "<code>static</code> é para laços com número conhecido de iterações e <code>dynamic</code> para laços <code>while</code>.",
    "<code>dynamic</code> é sempre mais rápido, pois adapta-se à máquina."
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
    "<code>soma</code> é compartilhada e <code>soma += v[i]</code> é uma operação não atômica: há condição de corrida. Corrige-se com <code>reduction(+:soma)</code>.",
    "O índice <code>i</code> precisa ser declarado <code>private</code> explicitamente.",
    "Falta uma barreira <code>#pragma omp barrier</code> depois do laço.",
    "O vetor <code>v</code> precisa ser declarado <code>shared</code> explicitamente."
  ],
  correta:0,
  gabarito:"É a condição de corrida da P1 reaparecendo na P2. <code>soma += v[i]</code> é <i>load-modify-store</i>: duas threads lêem o mesmo valor e uma sobrescreve o resultado da outra — incrementos se perdem, e o resultado varia a cada execução. A correção idiomática é <code>#pragma omp parallel for reduction(+:soma)</code>.<br><br>Sobre as demais: o índice do laço paralelizado <b>já é privado por padrão</b>; existe uma <b>barreira implícita</b> ao fim do <code>for</code>; e variáveis externas <b>já são shared</b> por padrão."
},
{
  id:"om07", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Como se define o número de threads em OpenMP e como se mede o tempo de execução?",
  opcoes:[
    "Pela cláusula <code>num_threads(4)</code>, pela função <code>omp_set_num_threads(4)</code> ou pela variável de ambiente <code>OMP_NUM_THREADS</code>; o tempo mede-se com <code>omp_get_wtime()</code>.",
    "Apenas pela variável de ambiente <code>OMP_THREADS</code>; o tempo mede-se com <code>clock()</code>.",
    "Pela cláusula <code>threads(4)</code>; o tempo mede-se com <code>time()</code>.",
    "O número de threads é sempre igual ao de núcleos e não pode ser alterado; usa-se <code>omp_time()</code>."
  ],
  correta:0,
  gabarito:"A precedência é: cláusula <code>num_threads</code> &gt; <code>omp_set_num_threads()</code> &gt; <code>OMP_NUM_THREADS</code> &gt; padrão (número de núcleos). Para o Trabalho, o mais prático é variar <code>OMP_NUM_THREADS</code> sem recompilar.<br><br>Sobre a medição: use <b><code>omp_get_wtime()</code></b>, que devolve tempo de <i>parede</i> em segundos. <code>clock()</code> da libc mede tempo <b>de CPU somado de todas as threads</b> — com 4 threads ele <i>aumenta</i> conforme você paraleliza, e daria um &ldquo;speedup&rdquo; menor que 1. É um erro que já custou muita nota em relatório."
},
{
  id:"om08", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Para que servem <code>#pragma omp barrier</code> e a cláusula <code>nowait</code>?",
  opcoes:[
    "<code>barrier</code> força todas as threads do time a esperarem umas pelas outras naquele ponto; <code>nowait</code> <b>remove</b> a barreira implícita no fim de um <code>for</code> ou <code>single</code>, deixando as threads seguirem adiante.",
    "<code>barrier</code> cria uma região crítica e <code>nowait</code> a libera.",
    "<code>barrier</code> encerra o time de threads e <code>nowait</code> o mantém vivo.",
    "As duas são equivalentes: <code>nowait</code> é o nome antigo de <code>barrier</code>."
  ],
  correta:0,
  gabarito:"É a barreira da P1, agora como diretiva. Construções como <code>for</code>, <code>single</code> e <code>sections</code> já têm barreira implícita no final; <code>nowait</code> a remove quando o resultado daquela fase não é necessário para a fase seguinte, evitando que todas fiquem presas à thread mais lenta. Use com cuidado: remover uma barreira necessária cria condição de corrida silenciosa. A região <code>parallel</code>, essa, sempre tem barreira no fim — não há <code>nowait</code> para ela."
},
{
  id:"om09", mod:"openmp", dif:"medio", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"Qual a diferença entre <code>#pragma omp single</code> e <code>#pragma omp master</code>?",
  opcoes:[
    "<code>single</code>: o bloco é executado por <b>uma</b> thread qualquer do time, e há barreira implícita ao final. <code>master</code>: executado obrigatoriamente pela thread 0, <b>sem</b> barreira implícita.",
    "<code>single</code> executa em todas as threads uma vez cada; <code>master</code> executa só na thread 0.",
    "As duas são idênticas; <code>master</code> é apenas a forma obsoleta.",
    "<code>single</code> cria uma nova thread e <code>master</code> reutiliza a principal."
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
    "A região crítica é o incremento de <code>hist[k]</code>: duas threads podem incrementar o mesmo <i>bin</i> simultaneamente. A melhor solução é dar a cada thread um <b>histograma privado</b> e somá-los ao final; <code>atomic</code> funciona, mas é mais lento sob disputa.",
    "Não há região crítica: cada iteração escreve numa posição diferente de <code>hist</code>.",
    "A região crítica é a leitura de <code>v[i]</code>, que precisa de <code>critical</code>.",
    "A solução é usar <code>schedule(dynamic)</code>, que elimina a disputa pelos bins."
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
    "Para distribuir <b>blocos de código diferentes</b> entre as threads do time — cada <code>section</code> é executada por uma thread. É o paralelismo de <b>tarefas</b>, útil para montar um pipeline.",
    "Para dividir um laço em seções contíguas, equivalente a <code>schedule(static)</code>.",
    "Para dividir o programa em regiões críticas independentes.",
    "Para separar as variáveis privadas das compartilhadas."
  ],
  correta:0,
  gabarito:"Enquanto <code>for</code> é paralelismo de <b>dados</b> (a mesma operação sobre elementos diferentes), <code>sections</code> é paralelismo de <b>tarefas</b> (operações diferentes ao mesmo tempo). É a construção natural para o pipeline soma&rarr;média&rarr;variância&rarr;desvio do laboratório da P1: cada estágio numa <code>section</code>. Limitação: o paralelismo é fixo no número de seções escritas no código — mais threads que seções deixa threads ociosas. Em OpenMP moderno, <code>task</code> é mais flexível."
},
{
  id:"om14", mod:"openmp", dif:"facil", tipo:"mc",
  fonte:"Trabalho / Lab · OpenMP",
  enunciado:"O que retornam <code>omp_get_thread_num()</code> e <code>omp_get_num_threads()</code>?",
  opcoes:[
    "<code>omp_get_thread_num()</code> devolve o identificador da thread atual dentro do time (0 para a mestre); <code>omp_get_num_threads()</code> devolve quantas threads há no time atual.",
    "As duas devolvem o número de núcleos da máquina.",
    "<code>omp_get_thread_num()</code> devolve o total de threads e <code>omp_get_num_threads()</code> o índice da thread atual.",
    "<code>omp_get_thread_num()</code> devolve o PID e <code>omp_get_num_threads()</code> o TID do sistema operacional."
  ],
  correta:0,
  gabarito:"São os equivalentes do <code>rank</code> que se passava manualmente às pthreads na P1. Cuidado com a pegadinha: chamada <b>fora</b> de uma região paralela, <code>omp_get_num_threads()</code> devolve <b>1</b> (o time tem só a thread mestre) — para saber quantas threads serão usadas, use <code>omp_get_max_threads()</code>."
},
{
  id:"om15", mod:"openmp", dif:"dificil", tipo:"mc",
  fonte:"Trabalho de Paralelização · Selection sort",
  enunciado:"Por que o <b>selection sort</b> é difícil de paralelizar bem, mesmo tendo laços aninhados?",
  opcoes:[
    "O laço externo é <b>inerentemente sequencial</b> (cada passo depende do vetor deixado pelo anterior); só o laço interno de busca do mínimo é paralelizável, e como ele encolhe a cada passo, o overhead acaba dominando.",
    "Porque o selection sort usa recursão, e OpenMP não suporta recursão.",
    "Porque o algoritmo é O(n log n) e o overhead cresce mais rápido que isso.",
    "Porque não há região crítica nenhuma, e sem região crítica não há o que paralelizar."
  ],
  correta:0,
  gabarito:"O laço externo tem <b>dependência entre iterações</b>: a posição <i>i</i> só pode ser definida depois que as <i>i</i>&minus;1 anteriores já foram. Resta paralelizar a busca do mínimo (laço interno), que é uma <b>redução com <code>min</code></b> — e essa busca vai ficando cada vez menor, até que o custo de abrir e sincronizar o time de threads supere o trabalho útil. Resultado esperado no relatório: <i>speedup</i> modesto e eficiência baixa, o que é uma <b>conclusão válida e esperada</b> — o trabalho pede a análise, não que todo algoritmo escale bem. O heap sort tem o mesmo tipo de problema na fase de extração."
}

]);
