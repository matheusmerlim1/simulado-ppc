/* ─── Processos e Threads ───────────────────────────────────
   P1 · 25 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"pt01", mod:"processos", dif:"facil", tipo:"mc",
  fonte:"Slides · Processos e Threads",
  enunciado:"O que a chamada de sistema <code>fork()</code> devolve em cada um dos dois processos que passam a existir depois dela?",
  opcoes:[
    "No pai, o PID do filho; no filho, 0. Em caso de falha, retorna &minus;1 no pai.",
    "Nos dois processos, o PID do filho.",
    "No pai, 0; no filho, o PID do pai.",
    "Nos dois processos, 0 &mdash; o PID só é obtido depois com <code>getpid()</code>."
  ],
  correta:0,
  gabarito:"<code>fork()</code> retorna <b>duas vezes</b>, uma em cada processo. O pai recebe o PID do filho (valor positivo), o filho recebe <b>0</b>, e um valor negativo indica erro na criação. É exatamente esse retorno diferente que permite escrever <code>if (pid = fork()) { /* pai */ } else { /* filho */ }</code>, como no exemplo <code>fork.c</code> da disciplina."
},
{
  id:"pt02", mod:"processos", dif:"facil", tipo:"mc",
  fonte:"Slides · Processos e Threads",
  enunciado:"Qual a diferença entre <code>wait()</code> e <code>waitpid()</code>?",
  opcoes:[
    "<code>wait()</code> suspende até que <b>qualquer</b> filho termine; <code>waitpid()</code> espera o filho com o PID indicado.",
    "<code>wait()</code> espera todos os filhos de uma vez; <code>waitpid()</code> espera apenas um.",
    "<code>wait()</code> bloqueia o filho; <code>waitpid()</code> bloqueia o pai.",
    "Não há diferença — <code>waitpid()</code> é apenas o nome POSIX moderno de <code>wait()</code>."
  ],
  correta:0,
  gabarito:"Atenção ao detalhe que o professor destaca nos slides: <code>wait()</code> devolve assim que <b>um filho qualquer</b> termina. Se você criou 26 filhos e quer esperar todos, precisa chamar <code>wait(NULL)</code> 26 vezes (ou usar <code>waitpid()</code> para cada PID específico)."
},
{
  id:"pt03", mod:"processos", dif:"facil", tipo:"mc",
  fonte:"Slides · Processos e Threads",
  enunciado:"Quais são as áreas principais da memória de um processo UNIX?",
  opcoes:[
    "Texto (código), Dados (incluindo BSS), Heap e Pilha.",
    "Cache L1, Cache L2, RAM e swap.",
    "Kernel, usuário, vídeo e rede.",
    "Registradores, pilha e memória compartilhada."
  ],
  correta:0,
  gabarito:"<b>Texto</b>: o código do programa. <b>Dados</b>: variáveis estáticas — a parte não inicializada é a <b>BSS</b>. <b>Heap</b>: memória dinâmica (<code>malloc</code>). <b>Pilha</b>: estados temporários, variáveis locais, parâmetros e retornos de funções. No kernel, cada processo ainda tem uma entrada na tabela de descritores com seus atributos e estado de execução."
},
{
  id:"pt04", mod:"processos", dif:"medio", tipo:"vf",
  fonte:"Slides · Processos e Threads",
  enunciado:"Logo após o <code>fork()</code>, o kernel já copiou fisicamente todas as páginas de memória do pai para o filho.",
  correta:1,
  gabarito:"<b>Falso.</b> O <code>fork()</code> faz uma cópia <i>rasa</i>: as páginas do filho são, no primeiro momento, exatamente as mesmas do pai. A cópia só acontece quando alguém <b>escreve</b> — aí a página é duplicada e a execução segue a partir do ponto da alteração. Isso é o <b>copy-on-write (COW)</b>."
},
{
  id:"pt05", mod:"processos", dif:"dificil", tipo:"mc",
  fonte:"Exemplo · 03_fork-cow/fork-cow.c",
  enunciado:"No exemplo <code>fork-cow.c</code>, o pai inicializa um vetor de 100 inteiros com zeros, cria um filho que escreve 1 em todas as posições, espera o filho com <code>waitpid()</code> e então soma o vetor. Qual soma o <b>pai</b> imprime?",
  cod:"int vetor[VECTOR_SIZE];          // vetor comum, na pilha do processo\n\nfor (i = 0; i < VECTOR_SIZE; i++) vetor[i] = 0;\n\nif (pid = fork()) {\n    waitpid(pid, &exit_status, 0);\n    int soma = 0;\n    for (i = 0; i < VECTOR_SIZE; i++) soma += vetor[i];\n    printf(\"[PAI] Soma: %d\", soma);   // <-- ?\n} else {\n    for (i = 0; i < VECTOR_SIZE; i++) vetor[i] = 1;\n}",
  opcoes:[
    "0 &mdash; a escrita do filho disparou o copy-on-write e alterou apenas a cópia dele.",
    "100 &mdash; pai e filho compartilham o vetor depois do <code>fork()</code>.",
    "50 &mdash; metade das páginas é copiada e metade é compartilhada.",
    "Indefinido, porque há condição de corrida entre pai e filho."
  ],
  correta:0,
  gabarito:"O pai imprime <b>0</b>. O vetor é memória comum do processo, não memória compartilhada. Quando o filho escreve, o COW duplica a página: o filho passa a enxergar a cópia dele (soma 100) e o pai continua com a original (soma 0). Não há condição de corrida porque <b>não existe dado compartilhado</b> — para compartilhar de verdade é preciso <code>mmap()</code> com <code>MAP_SHARED</code>, que é justamente o exemplo seguinte da aula."
},
{
  id:"pt06", mod:"processos", dif:"medio", tipo:"mc",
  fonte:"Slides · Memória Compartilhada (UNIX)",
  enunciado:"Qual combinação de <i>flags</i> do <code>mmap()</code> cria uma região de memória compartilhada entre pai e filho, sem mapear nenhum arquivo?",
  cod:"void *mmap(void *addr, size_t length, int prot, int flags,\n           int fd, off_t offset);",
  opcoes:[
    "<code>MAP_SHARED | MAP_ANONYMOUS</code>, com <code>PROT_READ | PROT_WRITE</code>",
    "<code>MAP_PRIVATE | MAP_ANONYMOUS</code>, com <code>PROT_READ | PROT_WRITE</code>",
    "<code>MAP_SHARED | MAP_FIXED</code>, com <code>PROT_EXEC</code>",
    "<code>MAP_PRIVATE | MAP_SHARED</code>, com <code>PROT_NONE</code>"
  ],
  correta:0,
  gabarito:"<code>MAP_SHARED</code> faz as atualizações se propagarem para todos os processos que mapeiam a mesma página; <code>MAP_ANONYMOUS</code> diz que não estamos mapeando arquivo nenhum (por isso <code>fd = 0</code> e <code>offset = 0</code>). Com <code>MAP_PRIVATE</code> cada processo teria sua própria cópia — e voltaríamos ao comportamento do COW. Os bits de proteção precisam ser coerentes com as <i>flags</i>: o usual é <code>PROT_READ|PROT_WRITE</code>."
},
{
  id:"pt07", mod:"processos", dif:"medio", tipo:"mc",
  fonte:"Slides · POSIX Threads",
  enunciado:"O que as threads de um mesmo processo <b>compartilham</b> e o que é <b>privado</b> de cada uma?",
  opcoes:[
    "Compartilham a memória global (dados e heap), descritores de arquivo e PID; cada thread tem sua própria pilha, contador de programa, <code>errno</code> e máscara de sinais.",
    "Compartilham a pilha e o contador de programa; cada uma tem seu próprio heap.",
    "Compartilham absolutamente tudo — não há estado privado por thread.",
    "Não compartilham nada; a comunicação é feita apenas por troca de mensagens."
  ],
  correta:0,
  gabarito:"Todas as threads dividem o espaço de endereçamento do processo: memória de dados, heap, IDs (PID, grupo, sessão, usuário), terminal, descritores de arquivos abertos, travas, sinais e diretório de trabalho. São <b>específicos de cada thread</b>: o thread ID, a pilha, o contador de programa, a variável <code>errno</code>, a máscara de sinais, a pilha alternativa de sinais e a política/prioridade de escalonamento."
},
{
  id:"pt08", mod:"processos", dif:"facil", tipo:"mc",
  fonte:"Slides · POSIX Threads",
  enunciado:"Como se compila um programa que usa POSIX Threads pela linha de comando?",
  opcoes:[
    "<code>gcc programa.c -o programa -pthread</code>",
    "<code>gcc programa.c -o programa -lthreads</code>",
    "<code>gcc programa.c -o programa -fopenmp</code>",
    "Não é preciso nenhuma opção — <code>pthread.h</code> já é parte da libc padrão."
  ],
  correta:0,
  gabarito:"A opção <code>-pthread</code> liga a biblioteca e ainda define as macros de compilação corretas para código <i>thread-safe</i>. <code>-fopenmp</code> é para OpenMP (assunto da P2). No Code::Blocks, o equivalente é adicionar <code>pthread</code> em <i>Project &rarr; Build Options &rarr; Linker Settings</i>."
},
{
  id:"pt09", mod:"processos", dif:"medio", tipo:"mc",
  fonte:"Slides · Parâmetros de Thread",
  enunciado:"Sobre <code>pthread_attr_setdetachstate()</code>, qual afirmação está correta?",
  opcoes:[
    "Os valores possíveis são <code>PTHREAD_CREATE_DETACHED</code> e <code>PTHREAD_CREATE_JOINABLE</code>, sendo <i>joinable</i> o padrão; numa thread <i>detached</i> não se pode dar <code>pthread_join()</code>.",
    "Os valores possíveis são <code>SCHED_FIFO</code> e <code>SCHED_RR</code>, sendo FIFO o padrão.",
    "Define se a thread compartilha ou não o heap com o processo pai.",
    "Só pode ser chamada depois de <code>pthread_create()</code>, sobre uma thread já em execução."
  ],
  correta:0,
  gabarito:"O padrão é <b>joinable</b>: a thread guarda seu estado de término até que alguém chame <code>pthread_join()</code>. Uma thread <i>detached</i> libera seus recursos sozinha ao terminar, e por isso não pode ser aguardada com <code>join</code>. Os atributos são preparados antes com <code>pthread_attr_init()</code> e liberados com <code>pthread_attr_destroy()</code>."
},
{
  id:"pt10", mod:"processos", dif:"medio", tipo:"mc",
  fonte:"Slides · Parâmetros de Thread",
  enunciado:"Quais são as políticas de escalonamento aceitas por <code>pthread_attr_setschedpolicy()</code>?",
  opcoes:[
    "<code>SCHED_FIFO</code>, <code>SCHED_RR</code> e <code>SCHED_OTHER</code>",
    "<code>SCHED_LIFO</code>, <code>SCHED_SJF</code> e <code>SCHED_PRIO</code>",
    "<code>PTHREAD_INHERIT_SCHED</code> e <code>PTHREAD_EXPLICIT_SCHED</code>",
    "<code>SCHED_BATCH</code> e <code>SCHED_IDLE</code> apenas"
  ],
  correta:0,
  gabarito:"<code>SCHED_FIFO</code> (tempo real, sem fatia de tempo), <code>SCHED_RR</code> (tempo real, com <i>round robin</i>) e <code>SCHED_OTHER</code> (o escalonamento comum, de tempo compartilhado). <code>PTHREAD_INHERIT_SCHED</code>/<code>EXPLICIT_SCHED</code> pertencem a outra função — <code>pthread_attr_setinheritsched()</code>, que define se a thread herda a configuração da thread-pai. A prioridade em si vai por <code>pthread_setschedprio()</code>, e só faz efeito com FIFO ou RR."
},
{
  id:"pt11", mod:"processos", dif:"dificil", tipo:"mc",
  fonte:"Slides · POSIX Threads / NPTL",
  enunciado:"Sobre a implementação de threads no Linux, qual afirmação está correta?",
  opcoes:[
    "LinuxThreads e NPTL são implementações 1:1; ambas usam <code>clone()</code> para criar a thread, e a NPTL usa <code>futex()</code> para sincronização.",
    "A NPTL é uma implementação N:1 — muitas threads de usuário sobre uma única thread de kernel.",
    "A NPTL cria threads com <code>fork()</code> e as sincroniza com sinais.",
    "LinuxThreads é a implementação atual e NPTL foi abandonada."
  ],
  correta:0,
  gabarito:"Ambas são <b>1:1</b> (uma thread de usuário para uma thread de kernel), o que permite escalonamento simultâneo em múltiplos núcleos. As duas usam a chamada <code>clone()</code>; o diferencial da <b>NPTL</b> (<i>Native POSIX Threads Library</i>, a atual) é usar <code>futex()</code> — <i>fast userspace mutex</i> — para sincronizar sem entrar no kernel quando não há disputa. LinuxThreads está em desuso."
},
{
  id:"pt12", mod:"processos", dif:"facil", tipo:"mc",
  fonte:"Slides · Java Threads",
  enunciado:"Em Java, quais são as duas maneiras de criar uma thread e qual método efetivamente a inicia?",
  opcoes:[
    "Herdar de <code>Thread</code> ou implementar <code>Runnable</code>; a thread é iniciada com <code>start()</code>.",
    "Herdar de <code>Thread</code> ou implementar <code>Runnable</code>; a thread é iniciada chamando <code>run()</code>.",
    "Apenas herdando de <code>Thread</code>; inicia-se com <code>start()</code>.",
    "Apenas implementando <code>Runnable</code>; inicia-se com <code>execute()</code>."
  ],
  correta:0,
  gabarito:"Chamar <code>run()</code> diretamente executa o método <b>na thread atual</b>, sem criar concorrência nenhuma — é o erro clássico. Quem cria a nova linha de execução é <code>start()</code>. Espera-se o término com <code>join()</code>. Em geral <code>Runnable</code> é preferível, porque pode ser implementada por qualquer classe (Java não tem herança múltipla), enquanto <code>Thread</code> traz os métodos de controle de execução."
},
{
  id:"pt13", mod:"processos", dif:"dificil", tipo:"mc",
  fonte:"Exemplo · 05_pthread/pthread_shared.c",
  enunciado:"O exemplo <code>pthread_shared.c</code> cria 4 threads e tem os <code>pthread_join()</code> desativados por <code>#if 0</code>. O que pode acontecer ao executar?",
  cod:"pthread_create(&thread_id[0], NULL, Hello, &data[0]);\npthread_create(&thread_id[1], NULL, Hello, &data[1]);\npthread_create(&thread_id[2], NULL, Hello, &data[2]);\npthread_create(&thread_id[3], NULL, Hello, &data[3]);\n\n#if 0\n    pthread_join(thread_id[0], NULL);\n    /* ... */\n#endif\n\nreturn 0;   // main termina aqui",
  opcoes:[
    "A <code>main</code> retorna, o processo inteiro termina e algumas (ou todas) as threads podem nunca imprimir nada.",
    "O programa fica travado para sempre, esperando as threads.",
    "As 4 threads sempre imprimem na ordem 0, 1, 2, 3 antes de o programa sair.",
    "O compilador recusa o programa: <code>pthread_create()</code> exige um <code>join</code> correspondente."
  ],
  correta:0,
  gabarito:"Quando a thread principal retorna de <code>main</code>, é como chamar <code>exit()</code>: <b>todo o processo acaba</b>, levando junto as threads que ainda estavam rodando. Como cada <code>Hello()</code> ainda executa um laço longo antes de retornar, é bem provável que nenhuma chegue a terminar. Daí o aviso do laboratório: <i>&ldquo;não se esqueça de fazer um join após criar todas as threads!&rdquo;</i>"
},
{
  id:"pt14", mod:"processos", dif:"dificil", tipo:"mc",
  fonte:"Lab · Processos e Threads, Q1",
  enunciado:"Num laço que dá <code>fork()</code> 26 vezes para criar 26 filhos, por que o <code>exit(0)</code> dentro do bloco do filho é indispensável?",
  cod:"for (i = 0; i < ALFABETO; i++) {\n    pid = fork();\n    if (pid == 0) {\n        printf(\"PID %d imprimindo letra: %c\\n\", getpid(), vetorLetra[i]);\n        exit(0);            // <-- indispensável\n    } else if (pid < 0) {\n        perror(\"erro no fork\"); exit(1);\n    }\n}",
  opcoes:[
    "Sem ele, cada filho continua o laço e passa a criar filhos próprios — o número de processos cresce exponencialmente em vez de linearmente.",
    "Sem ele, o filho vaza memória, mas o número de processos continua sendo 26.",
    "Sem ele, o pai não consegue mais chamar <code>wait()</code>.",
    "É apenas boa prática de estilo; o comportamento é idêntico com ou sem ele."
  ],
  correta:0,
  gabarito:"O filho herda o <b>mesmo ponto de execução</b> do pai, incluindo o laço e o valor de <code>i</code>. Sem o <code>exit(0)</code>, ele volta ao <code>for</code> e também começa a criar filhos. Em vez de 26 processos você teria da ordem de 2<sup>26</sup> — uma <i>fork bomb</i> acidental. O <code>exit(0)</code> encerra o filho logo após ele fazer o seu trabalho."
},
{
  id:"pt15", mod:"processos", dif:"medio", tipo:"vf",
  fonte:"Slides · Processos e Threads",
  enunciado:"Threads em espaço de kernel podem ser escalonadas ao mesmo tempo em núcleos diferentes, mas são mais custosas para o kernel do que threads em espaço de usuário.",
  correta:0,
  gabarito:"<b>Verdadeiro.</b> É o compromisso apresentado nos slides: threads de kernel custam mais (cada criação e cada troca de contexto passa pelo sistema operacional), mas em compensação o escalonador as enxerga individualmente e pode colocá-las em núcleos distintos ao mesmo tempo — que é o que dá <b>paralelismo real</b>."
},
{
  id:"pt16", mod:"processos", dif:"medio", tipo:"mc",
  fonte:"Slides · Memória Compartilhada (UNIX)",
  enunciado:"Quais são as formas de compartilhar dados entre múltiplos processos em UNIX citadas na disciplina?",
  opcoes:[
    "Memória compartilhada, sockets, pipes e troca de mensagens.",
    "Apenas memória compartilhada via <code>mmap()</code>.",
    "Variáveis globais, já que o filho herda o espaço de endereçamento do pai.",
    "Registradores do processador e a pilha do processo pai."
  ],
  correta:0,
  gabarito:"São as quatro listadas nos slides. A alternativa das variáveis globais é a armadilha: depois do <code>fork()</code> o filho <i>herda</i> os valores, mas por causa do copy-on-write cada um passa a ter a sua cópia — não há compartilhamento real."
},
{
  id:"pt17a", mod:"processos", dif:"medio", tipo:"disc",
  fonte:"Lab · Processos e Threads, Q4(a)",
  enunciado:"Num sistema com 2 threads, uma <b>rápida</b> e uma <b>lenta</b>, como o sistema se comporta com escalonamento <b>FIFO</b>?",
  gabarito:"FIFO é <b>não-preemptivo</b>: a thread que chega primeiro executa até terminar ou bloquear.<br><br>&bull; Se a <b>lenta</b> chega primeiro, a rápida fica parada o tempo todo esperando — é o <b>efeito comboio</b>. O tempo médio de resposta fica péssimo.<br>&bull; Se a <b>rápida</b> chega primeiro, ela sai logo e tudo parece ótimo.<br><br>Ou seja: o resultado depende inteiramente da <b>ordem de chegada</b>. Em compensação, não há custo de troca de contexto."
},
{
  id:"pt17b", mod:"processos", dif:"medio", tipo:"disc",
  fonte:"Lab · Processos e Threads, Q4(b)",
  enunciado:"E com escalonamento <b>Round Robin</b>? Compare com o FIFO.",
  gabarito:"Round Robin é <b>preemptivo</b>, com fatia de tempo <i>q</i>: as duas threads alternam a cada fatia.<br><br>A thread <b>rápida</b> termina bem antes, porque precisa de poucas fatias; a lenta continua sozinha depois. O tempo de resposta fica <b>justo e previsível</b>, independente da ordem de chegada — ao custo de trocas de contexto adicionais.<br><br>O valor de <i>q</i> importa: <i>q</i> grande demais faz o RR degenerar em FIFO; <i>q</i> pequeno demais faz o <i>overhead</i> de troca de contexto dominar o tempo útil.<br><br><b>Conclusão:</b> com cargas desiguais, o Round Robin protege a thread curta e o FIFO a penaliza."
},
{
  id:"pt18", mod:"processos", dif:"facil", tipo:"code",
  fonte:"Lab · Processos e Threads, Q1",
  enunciado:"O <code>main</code> abaixo já está pronto. Escreva <b>apenas a função</b> <code>imprime</code>, que recebe a posição do vetor por parâmetro e imprime a letra correspondente.",
  cod:"char letras[] = \"abcdefghijklmnopqrstuvwxyz\";\n\n/* ---- JA PRONTO, nao precisa escrever ---- */\nint main(void) {\n    pthread_t t[26];\n    int idx[26];\n    for (int i = 0; i < 26; i++) {\n        idx[i] = i;\n        pthread_create(&t[i], NULL, imprime, &idx[i]);\n    }\n    for (int i = 0; i < 26; i++) pthread_join(t[i], NULL);\n    return 0;\n}",
  chaves:["arg","printf","letras"],
  modelo:"void *imprime(void *arg) {\n    int i = *(int *)arg;          /* recupera a posicao recebida */\n    printf(\"%c\\n\", letras[i]);\n    return NULL;\n}",
  gabarito:"São três linhas. O único cuidado é o <b>cast do parâmetro</b>: <code>void *</code> precisa virar <code>int *</code> antes de ser desreferenciado.<br><br>Repare por que o <code>main</code> usa <code>idx[i]</code> e não <code>&i</code>: se todas as threads recebessem o endereço da <b>mesma</b> variável <code>i</code>, ela continuaria mudando enquanto elas iniciam — várias imprimiriam a mesma letra e outras nenhuma."
},
{
  id:"pt18b", mod:"processos", dif:"facil", tipo:"code",
  fonte:"Lab · Processos e Threads, Q1",
  enunciado:"Agora o inverso: a função da thread já existe. Escreva <b>apenas os dois laços</b> do <code>main</code> que criam as 26 threads e esperam por todas.",
  cod:"char letras[] = \"abcdefghijklmnopqrstuvwxyz\";\n\n/* ---- JA PRONTA ---- */\nvoid *imprime(void *arg) {\n    int i = *(int *)arg;\n    printf(\"%c\\n\", letras[i]);\n    return NULL;\n}\n\nint main(void) {\n    pthread_t t[26];\n    int idx[26];\n\n    /* ESCREVA AQUI */\n\n    return 0;\n}",
  chaves:["pthread_create","pthread_join","for"],
  modelo:"    for (int i = 0; i < 26; i++) {\n        idx[i] = i;                    /* uma variavel POR thread */\n        pthread_create(&t[i], NULL, imprime, &idx[i]);\n    }\n\n    for (int i = 0; i < 26; i++)\n        pthread_join(t[i], NULL);",
  gabarito:"Dois laços separados: um cria <b>todas</b>, o outro espera <b>todas</b>. O erro comum é dar <code>pthread_join</code> dentro do laço de criação — isso espera cada thread terminar antes de criar a próxima, e o programa vira sequencial.<br><br>A armadilha do parâmetro: passe <code>&idx[i]</code>, nunca <code>&i</code>."
},
{
  id:"pt19", mod:"processos", dif:"facil", tipo:"code",
  fonte:"Lab · Processos e Threads, Q2",
  enunciado:"Escreva <b>apenas a função</b> <code>somar</code>, que soma <code>vetorA</code> e <code>vetorB</code> índice a índice na faixa que recebeu, guardando o resultado em <code>vetorA</code>.",
  cod:"int vetorA[100], vetorB[100];\n\ntypedef struct { int inicio, fim; } Params;\n\n/* o main ja divide o vetor em faixas e passa um Params por thread */",
  chaves:["inicio","fim","vetora"],
  modelo:"void *somar(void *arg) {\n    Params *p = (Params *)arg;\n\n    for (int i = p->inicio; i < p->fim; i++)\n        vetorA[i] = vetorA[i] + vetorB[i];\n\n    free(p);\n    return NULL;\n}",
  gabarito:"Note que <b>não há região crítica</b>: cada thread escreve em posições diferentes de <code>vetorA</code> e nenhuma lê o que a outra escreve. Não precisa de mutex nenhum — este é o caso mais confortável de paralelismo de dados."
},
{
  id:"pt20", mod:"processos", dif:"facil", tipo:"code",
  fonte:"Lab · Processos e Threads, Q3",
  enunciado:"Escreva <b>apenas a função</b> <code>somar</code>, que acumula a soma da sua faixa num campo <b>privado</b> da própria struct — sem usar variável compartilhada.",
  cod:"int vetor[100];\n\ntypedef struct {\n    int  inicio, fim;\n    long soma;        /* acumulador PRIVADO desta thread */\n} Params;",
  chaves:["inicio","fim","soma"],
  modelo:"void *somar(void *arg) {\n    Params *p = (Params *)arg;\n\n    p->soma = 0;\n    for (int i = p->inicio; i < p->fim; i++)\n        p->soma += vetor[i];\n\n    return NULL;                 /* NAO da free: o main ainda le p->soma */\n}",
  gabarito:"Cada thread escreve só no <code>soma</code> da <b>sua</b> struct, então não existe região crítica e nenhum mutex é necessário.<br><br>Cuidado para <b>não</b> liberar a struct aqui — o <code>main</code> ainda vai ler <code>p-&gt;soma</code> depois do <code>join</code>."
},
{
  id:"pt20b", mod:"processos", dif:"facil", tipo:"code",
  fonte:"Lab · Processos e Threads, Q3",
  enunciado:"As threads já terminaram e cada uma deixou sua soma parcial em <code>params[i]-&gt;soma</code>. Escreva <b>apenas o trecho</b> que combina as parciais no total e libera a memória.",
  cod:"Params *params[4];\n\n/* ... criacao das threads e os 4 pthread_join ja aconteceram ... */\n\nlong total = 0;\n\n/* ESCREVA AQUI */\n\nprintf(\"Soma total: %ld\\n\", total);",
  chaves:["for","soma","+="],
  modelo:"    for (int i = 0; i < 4; i++) {\n        total += params[i]->soma;\n        free(params[i]);\n    }",
  gabarito:"Esta é a fase de <b>redução</b> do padrão fork/join. Ela roda na thread principal, <b>depois</b> de todos os <code>pthread_join</code> — por isso não há concorrência e não precisa de proteção.<br><br>Dois erros comuns: imprimir o total <i>dentro</i> do laço (você vê somas parciais em vez do resultado) e fazer a redução antes dos joins (lê valores que ainda não foram escritos)."
},
{
  id:"pt21", mod:"processos", dif:"facil", tipo:"vf",
  fonte:"Slides · Apresentação da disciplina",
  enunciado:"Programação concorrente e programação paralela são a mesma coisa: em ambas os fluxos de execução compartilham recursos e interagem entre si.",
  correta:1,
  gabarito:"<b>Falso.</b> Pela definição usada na disciplina: na <b>programação concorrente</b> o programa gera várias linhas de execução que <i>compartilham recursos computacionais e interagem entre si</i>. Na <b>programação paralela</b> há execução simultânea de partes independentes, que <i>não trocam informações durante a execução</i> — cada uma tem sua área de dados. Concorrência trata de coordenar disputas; paralelismo, de dividir trabalho para ir mais rápido."
},
{
  id:"pt22", mod:"processos", dif:"medio", tipo:"mc",
  fonte:"Slides · fork-exec",
  enunciado:"Qual é o papel da família de chamadas <code>exec()</code> logo após um <code>fork()</code>?",
  opcoes:[
    "Substituir a imagem do processo filho por um novo programa, mantendo o mesmo PID.",
    "Criar um segundo processo filho, irmão do primeiro.",
    "Devolver o controle ao processo pai imediatamente.",
    "Duplicar as páginas de memória do pai no filho, desfazendo o copy-on-write."
  ],
  correta:0,
  gabarito:"O par <b>fork + exec</b> é como o UNIX cria processos que executam <i>outro</i> programa: o <code>fork()</code> duplica o processo e, no filho, o <code>exec()</code> troca todo o conteúdo (texto, dados, heap, pilha) pelo do novo executável — mas o PID continua o mesmo. O pai segue no <code>wait()</code> até receber o <i>status</i> de saída do filho."
}

]);
