/* ═══════════════════════════════════════════════════════════
   MATÉRIA — resumo explicado, com exemplos
   Cada módulo tem seções: h (título), p (texto), cod (código),
   box (exemplo trabalhado ou alerta).
   ═══════════════════════════════════════════════════════════ */
const MATERIA = [

/* ══════════════ 1. PROCESSOS E THREADS ══════════════ */
{ mod:"processos", secoes:[
  {
    h:"O que é um processo em UNIX",
    p:"Um processo é um programa em execução, com seu próprio espaço de endereçamento. Esse espaço tem quatro áreas:<br><br>&bull; <b>Texto</b> — o código do programa.<br>&bull; <b>Dados</b> — variáveis estáticas e globais. A parte não inicializada é a <b>BSS</b>.<br>&bull; <b>Heap</b> — memória dinâmica, o que você pega com <code>malloc</code>.<br>&bull; <b>Pilha</b> — variáveis locais, parâmetros e endereços de retorno das funções.<br><br>No kernel, cada processo tem uma entrada na <b>tabela de descritores de processos</b>, com seus atributos (nome, PIDs, arquivos abertos) e o estado de execução.",
    cod:"0xFFF...  ┌──────────────┐\n          │    Pilha     │  ← cresce para baixo\n          ├──────────────┤\n          │      ↓       │\n          │      ↑       │\n          ├──────────────┤\n          │     Heap     │  ← cresce para cima (malloc)\n          ├──────────────┤\n          │  Dados / BSS │  ← globais e estáticas\n          ├──────────────┤\n          │    Texto     │  ← código do programa\n0x000...  └──────────────┘"
  },
  {
    h:"fork(): a chamada que retorna duas vezes",
    p:"<code>fork()</code> cria um processo filho duplicando o pai. O detalhe que confunde todo mundo: ela <b>retorna duas vezes</b>, uma em cada processo, com valores diferentes.<br><br>&bull; No <b>pai</b>: o PID do filho (número positivo).<br>&bull; No <b>filho</b>: <b>0</b>.<br>&bull; Em caso de erro: <b>&minus;1</b>, e nenhum filho é criado.<br><br>É esse retorno diferente que permite os dois processos seguirem caminhos distintos a partir da mesma linha de código.",
    cod:"pid_t pid = fork();\n\nif (pid > 0) {\n    /* PAI: pid contem o numero do filho */\n    waitpid(pid, &status, 0);      /* espera ESTE filho */\n} else if (pid == 0) {\n    /* FILHO: continua daqui, com uma copia da memoria */\n    exit(0);                       /* essencial em laco! */\n} else {\n    perror(\"erro no fork\");\n}",
    box:"<b>Armadilha do laço.</b> Num <code>for</code> que dá <code>fork()</code> 26 vezes, o filho herda o mesmo ponto de execução — inclusive o laço. Sem o <code>exit(0)</code>, cada filho volta ao <code>for</code> e passa a criar filhos próprios: em vez de 26 processos você teria da ordem de 2<sup>26</sup>. É uma <i>fork bomb</i> acidental."
  },
  {
    h:"wait() e waitpid()",
    p:"<code>wait(NULL)</code> suspende o pai até que <b>um filho qualquer</b> termine. Se você criou 26 filhos e quer esperar todos, precisa chamar <code>wait</code> 26 vezes.<br><br><code>waitpid(pid, &status, 0)</code> espera o filho <b>específico</b> daquele PID.<br><br>Sem o <code>wait</code>, o pai pode terminar antes dos filhos, e eles viram órfãos adotados pelo <code>init</code>."
  },
  {
    h:"Copy-on-write: por que o filho não vê as mudanças do pai",
    p:"O <code>fork()</code> faz uma cópia <b>rasa</b>: no primeiro momento, as páginas de memória do filho são <i>exatamente as mesmas</i> do pai. A duplicação só acontece quando alguém <b>escreve</b> — aí aquela página é copiada e cada processo segue com a sua versão. Isso é o <b>copy-on-write (COW)</b>.<br><br>A consequência prática: depois do <code>fork()</code>, <b>não existe memória compartilhada</b>. Os dois processos têm valores iguais, mas não são o mesmo dado.",
    cod:"int vetor[100];\nfor (i = 0; i < 100; i++) vetor[i] = 0;\n\nif (pid = fork()) {\n    waitpid(pid, &status, 0);\n    soma = 0;\n    for (i = 0; i < 100; i++) soma += vetor[i];\n    printf(\"[PAI] soma = %d\", soma);      /* imprime 0 */\n} else {\n    for (i = 0; i < 100; i++) vetor[i] = 1;\n    /* o filho ve soma = 100, mas na COPIA dele */\n}",
    box:"<b>Resultado do exemplo:</b> o pai imprime <b>0</b> e o filho enxerga 100. Não há condição de corrida, porque não há dado compartilhado — há duas cópias independentes."
  },
  {
    h:"Memória compartilhada com mmap()",
    p:"Para processos compartilharem dados de verdade, é preciso pedir uma página compartilhada ao kernel:<br><br><code>void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset)</code><br><br>&bull; <code>addr</code> = <code>NULL</code> deixa o kernel escolher onde mapear.<br>&bull; <code>length</code> deve caber todas as variáveis compartilhadas.<br>&bull; <code>prot</code> = <code>PROT_READ|PROT_WRITE</code> (bits de proteção).<br>&bull; <code>flags</code> = <code>MAP_SHARED|MAP_ANONYMOUS</code> — compartilhada e sem arquivo por trás.<br>&bull; <code>fd</code> e <code>offset</code> = 0, já que não mapeamos arquivo.<br><br>Com <code>MAP_PRIVATE</code> cada processo teria a própria cópia, e voltaríamos ao comportamento do COW.<br><br>Outras formas de comunicação entre processos em UNIX: <b>sockets</b>, <b>pipes</b> e <b>troca de mensagens</b>.",
    cod:"int *vetor = (int *) mmap(NULL,\n                          sizeof(int) * 100,\n                          PROT_READ | PROT_WRITE,\n                          MAP_ANONYMOUS | MAP_SHARED,\n                          0, 0);\n\n/* agora pai e filho enxergam o MESMO vetor */\n\nmunmap(vetor, sizeof(int) * 100);"
  },
  {
    h:"Threads: o que é compartilhado e o que é privado",
    p:"Um processo pode ter várias threads. Todas dividem o mesmo espaço de endereçamento — e é por isso que a concorrência entre threads é mais barata (e mais perigosa) que entre processos.<br><br><b>Compartilhado por todas:</b> memória de dados, heap, todos os IDs (PID, grupo, sessão, usuário), terminal, descritores de arquivos abertos, travas, sinais, modos de criação de arquivos, diretório de trabalho e <i>timers</i>.<br><br><b>Privado de cada thread:</b> o thread ID, a <b>pilha</b>, o contador de programa, a variável <code>errno</code>, a máscara de sinais, a pilha alternativa de sinais e a política/prioridade de escalonamento. No Linux, também afinidade de CPU e capacidades."
  },
  {
    h:"POSIX Threads na prática",
    p:"No Linux, a implementação atual é a <b>NPTL</b> (<i>Native POSIX Threads Library</i>), que é <b>1:1</b> — cada thread de usuário corresponde a uma thread de kernel, o que permite escalonamento simultâneo em vários núcleos. Ela usa <code>clone()</code> para criar e <code>futex()</code> para sincronizar. A antiga LinuxThreads está em desuso.<br><br>Compile sempre com <code>-pthread</code>.",
    cod:"#include <pthread.h>\n\nvoid *tarefa(void *arg) {\n    int id = *(int *)arg;\n    printf(\"thread %d\\n\", id);\n    return NULL;\n}\n\nint main(void) {\n    pthread_t t[4];\n    int idx[4];                       /* um int POR thread */\n\n    for (int i = 0; i < 4; i++) {\n        idx[i] = i;\n        pthread_create(&t[i], NULL, tarefa, &idx[i]);\n    }\n    for (int i = 0; i < 4; i++)\n        pthread_join(t[i], NULL);     /* espera TODAS */\n    return 0;\n}\n\n/* gcc prog.c -o prog -pthread */",
    box:"<b>Dois erros clássicos.</b> (1) Passar <code>&i</code> em vez de <code>&idx[i]</code>: todas as threads receberiam o endereço da <i>mesma</i> variável, que continua mudando — várias imprimiriam o mesmo valor. (2) Dar <code>pthread_join</code> dentro do laço de criação: isso espera cada thread terminar antes de criar a próxima, e o programa vira sequencial."
  },
  {
    h:"Atributos de thread",
    p:"Configurados com <code>pthread_attr_init()</code> antes do <code>create</code>, e destruídos com <code>pthread_attr_destroy()</code>.<br><br>&bull; <b><i>Detach state</i></b> — <code>PTHREAD_CREATE_JOINABLE</code> (padrão) ou <code>PTHREAD_CREATE_DETACHED</code>. Numa thread <i>detached</i> não se pode dar <code>join</code>: ela libera os próprios recursos ao terminar.<br>&bull; <b>Herança de escalonamento</b> — <code>PTHREAD_INHERIT_SCHED</code> (padrão) ou <code>PTHREAD_EXPLICIT_SCHED</code>.<br>&bull; <b>Política</b> — <code>SCHED_FIFO</code>, <code>SCHED_RR</code> ou <code>SCHED_OTHER</code>.<br>&bull; <b>Prioridade</b> — <code>pthread_setschedprio()</code>; maior valor = maior prioridade, e só faz efeito com FIFO ou RR."
  },
  {
    h:"Threads em Java",
    p:"Há duas formas: <b>herdar de <code>Thread</code></b> ou <b>implementar <code>Runnable</code></b>. Em geral <code>Runnable</code> é melhor, porque qualquer classe pode implementá-la (Java não tem herança múltipla).<br><br>Em ambos os casos implementa-se <code>run()</code>, mas quem <b>cria</b> a nova linha de execução é <code>start()</code>. Chamar <code>run()</code> diretamente executa o método na thread atual, sem concorrência nenhuma — é o erro clássico. Espera-se o término com <code>join()</code>.",
    cod:"class Tarefa implements Runnable {\n    private int id;\n    Tarefa(int id) { this.id = id; }\n\n    public void run() {\n        System.out.println(\"thread \" + id);\n    }\n}\n\nThread t = new Thread(new Tarefa(1));\nt.start();     // CRIA a thread  (run() apenas executaria aqui)\nt.join();      // espera terminar"
  },
  {
    h:"Escalonamento: FIFO x Round Robin",
    p:"Com duas threads, uma rápida e uma lenta:<br><br><b>FIFO</b> (não-preemptivo) — quem chega primeiro executa até terminar. Se a lenta chega primeiro, a rápida espera o tempo todo: é o <b>efeito comboio</b>. O resultado depende inteiramente da ordem de chegada. Não há custo de troca de contexto.<br><br><b>Round Robin</b> (preemptivo, com fatia <i>q</i>) — as duas alternam. A rápida termina bem antes, porque precisa de poucas fatias. O tempo de resposta fica justo e previsível, ao custo de trocas de contexto. Se <i>q</i> for grande demais, o RR degenera em FIFO; se for pequeno demais, o <i>overhead</i> domina."
  }
]},

/* ══════════════ 2. EXCLUSÃO MÚTUA ══════════════ */
{ mod:"exclusao", secoes:[
  {
    h:"Os três conceitos e como se ligam",
    p:"<b>Região crítica</b> — o trecho de código em que um fluxo acessa um recurso compartilhado de forma que o acesso simultâneo de outro possa corromper o resultado.<br><br><b>Condição de corrida</b> — a situação em que o resultado final depende da <b>ordem em que as instruções são intercaladas</b> pelo escalonador. O sintoma é o não determinismo: mesma entrada, resultados diferentes.<br><br><b>Exclusão mútua</b> — a garantia de que no máximo <b>um</b> fluxo por vez está dentro da região crítica.<br><br><b>A relação:</b> a corrida é o <i>problema</i>, a região crítica é <i>onde</i> ele acontece, a exclusão mútua é a <i>solução</i>.",
    box:"<b>Cuidado:</b> um programa com condição de corrida pode acertar em 9 de 10 execuções. Acertar às vezes não é prova de correção — o bug de concorrência se acha <b>lendo o código</b> e identificando a região crítica, não só testando."
  },
  {
    h:"Por que contador++ não é atômico",
    p:"Uma única linha em C vira três instruções de máquina. O escalonador pode trocar de thread <b>entre</b> elas.",
    cod:"contador++;         /* em C, parece atomico */\n\n/* mas em assembly vira: */\n    mov  eax, [contador]     ; 1) LE da memoria\n    add  eax, 1              ; 2) INCREMENTA no registrador\n    mov  [contador], eax     ; 3) ESCREVE de volta\n\n/* thread A le 5 ... preempcao ... thread B le 5\n   A escreve 6            ...      B escreve 6\n   -> dois incrementos viraram UM  */",
    box:"<b>É por isso</b> que 1000 threads incrementando e 1000 decrementando, sem proteção, quase nunca terminam em zero — e o valor final muda a cada execução."
  },
  {
    h:"O que uma boa solução precisa garantir",
    p:"As quatro condições de Tanenbaum:<br><br><b>1.</b> Nunca dois processos simultaneamente na região crítica.<br><b>2.</b> Nenhuma suposição sobre velocidade ou número de CPUs.<br><b>3.</b> Nenhum processo <b>fora</b> da sua região crítica pode bloquear outro.<br><b>4.</b> Nenhum processo deve esperar eternamente para entrar (ausência de <i>starvation</i>).<br><br>Desativar interrupções, por exemplo, viola a condição 2 num sistema multiprocessador: desligar a interrupção de um núcleo não impede outro núcleo de entrar na região crítica."
  },
  {
    h:"Soluções que NÃO funcionam (e por quê)",
    p:"<b>Variável de trava.</b> O teste e a escrita da trava <b>não são atômicos</b>: duas threads podem ler <code>trava == 0</code> antes que qualquer uma escreva 1, e ambas entram. Repare que a própria variável de trava virou uma nova região crítica — o problema é circular.<br><br><b>Alternância estrita.</b> Garante exclusão mútua, mas viola a condição 3: se o processo 0 demora na região <b>não</b> crítica, o processo 1 fica travado esperando a vez, mesmo com a região crítica livre. Além disso usa espera ocupada.",
    cod:"/* VARIAVEL DE TRAVA -- ERRADA */\nint trava = 0;\n\nvoid entra(void) {\n    while (trava == 1) ;   /* A) le */\n    trava = 1;             /* B) escreve  <- janela entre A e B! */\n}\n\n/* ALTERNANCIA ESTRITA -- correta mas ruim */\n/* processo 0 */            /* processo 1 */\nwhile (turno != 0) ;        while (turno != 1) ;\nregiao_critica();           regiao_critica();\nturno = 1;                  turno = 0;"
  },
  {
    h:"Peterson e TSL: as soluções que funcionam",
    p:"<b>Algoritmo de Peterson</b> combina um vetor de interesse com uma variável <code>turno</code>. O truque é o <b>gesto de cortesia</b>: cada processo cede a vez ao outro. Se os dois chegam juntos, a segunda escrita sobrescreve a primeira e apenas um fica preso no laço — o desempate é garantido. E quando o outro não tem interesse, a entrada é imediata.<br><br><b>TSL</b> (<i>Test and Set Lock</i>) é uma instrução de <b>hardware</b> que lê a trava para um registrador e escreve 1 nela em <b>uma única operação indivisível</b>, travando o barramento de memória. É isso que fecha a janela entre o teste e a escrita. Equivalentes: <code>XCHG</code> (x86) e <i>compare-and-swap</i>.<br><br>As duas ainda usam <b>espera ocupada</b>: resolvem a correção, não a eficiência.",
    cod:"/* PETERSON, para 2 processos */\nint interesse[2] = {0, 0};\nint vez;\n\nvoid entra(int eu) {\n    int outro = 1 - eu;\n    interesse[eu] = 1;                 /* quero entrar   */\n    vez = outro;                       /* cedo a vez     */\n    while (interesse[outro] && vez == outro) ;\n}\n\nvoid sai(int eu) { interesse[eu] = 0; }"
  },
  {
    h:"Espera ocupada e inversão de prioridade",
    p:"<b>Espera ocupada</b> (<i>busy waiting</i>) é ficar num laço testando uma condição sem liberar a CPU. Desperdiça fatias inteiras de processamento.<br><br>O caso patológico é a <b>inversão de prioridade</b>: um processo de <b>alta</b> prioridade em espera ocupada impede o processo de <b>baixa</b> prioridade — que está dentro da região crítica — de ser escalonado para sair dela. O sistema trava.<br><br>A alternativa é <b>bloquear</b> a thread (semáforos, mutexes, monitores), devolvendo a CPU. <i>Spinlocks</i> ainda são usados quando a espera é comprovadamente curtíssima."
  },
  {
    h:"Semáforo",
    p:"Variável inteira não-negativa com duas operações <b>atômicas</b>:<br><br>&bull; <code>wait / down / P(s)</code> — decrementa; se ficar negativo, <b>bloqueia</b> numa fila.<br>&bull; <code>signal / up / V(s)</code> — incrementa; se havia alguém bloqueado, <b>acorda</b> um.<br><br>O valor inicial define o papel: <b>1</b> para exclusão mútua, <b>N</b> para contar N recursos, <b>0</b> para impor <b>ordem</b> de execução.<br><br>É o mais flexível — e o mais fácil de errar, porque nada amarra o <code>wait</code> ao <code>post</code>.",
    cod:"#include <semaphore.h>\n\nsem_t s;\nsem_init(&s, 0, 1);      /* 0 = so entre threads deste processo\n                            1 = valor inicial (exclusao mutua) */\n\nsem_wait(&s);            /* entra na regiao critica */\n    contador++;\nsem_post(&s);            /* sai */\n\nsem_destroy(&s);"
  },
  {
    h:"Mutex",
    p:"Trava binária <b>com dono</b>: só a thread que travou pode destravar. Primitivas: <code>lock</code>, <code>unlock</code> e <code>trylock</code>.<br><br>Essa posse (<i>ownership</i>) é a diferença essencial para o semáforo binário. Ela permite detectar erros e implementar herança de prioridade, mas restringe o mutex à exclusão mútua — ele não serve para sinalizar entre threads.",
    cod:"pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;\n\npthread_mutex_lock(&m);\n    contador++;\npthread_mutex_unlock(&m);\n\npthread_mutex_destroy(&m);"
  },
  {
    h:"Monitor",
    p:"Construção de <b>linguagem</b>, não de biblioteca: um módulo em que os dados são privados e todos os procedimentos têm exclusão mútua <b>implícita</b>, garantida pelo compilador. Só um processo fica ativo dentro do monitor por vez.<br><br>Para esperar por condições usa-se <b>variáveis de condição</b>: <code>wait(c)</code> <b>libera o monitor</b> e bloqueia; <code>signal(c)</code> acorda quem esperava. O <code>wait</code> liberar o monitor é essencial — sem isso ninguém entraria para sinalizar.<br><br>A grande vantagem: o programador não pode esquecer de destravar. Exemplo real: <code>synchronized</code> em Java. Em C não existe monitor nativo.",
    cod:"// Java\npublic synchronized void inserir(int x) {\n    while (cheio())\n        wait();          // libera o monitor e dorme\n    buffer[n++] = x;\n    notifyAll();         // acorda quem esperava\n}"
  },
  {
    h:"Granularidade: o erro que faz o paralelo ficar mais lento",
    p:"Proteger corretamente não basta — <b>onde</b> você tranca importa. Travar o mutex a cada iteração serializa o laço inteiro, e o programa paralelo fica mais devagar que o serial.<br><br>A saída é acumular numa variável local e entrar na região crítica <b>uma vez por thread</b>. Mesmo resultado, granularidade muito melhor. É a mesma ideia que o <code>reduction</code> do OpenMP automatiza na P2.",
    cod:"/* RUIM: trava 250 vezes */\nfor (i = p->inicio; i < p->fim; i++) {\n    pthread_mutex_lock(&m);\n    soma_total += vetor[i];\n    pthread_mutex_unlock(&m);\n}\n\n/* BOM: trava 1 vez */\nlong local = 0;\nfor (i = p->inicio; i < p->fim; i++)\n    local += vetor[i];\n\npthread_mutex_lock(&m);\nsoma_total += local;\npthread_mutex_unlock(&m);"
  },
  {
    h:"Exclusão mútua não resolve ordem",
    p:"Se o enunciado pede que o alfabeto saia <b>em ordem</b>, ou que a saída seja exatamente <code>CAFE</code>, um mutex não resolve: ele garante que só uma thread mexe no dado por vez, mas a ordem continua entregue ao escalonador.<br><br>Para <b>ordem</b> use <b>sinalização</b>: uma cadeia de semáforos iniciados em 0, em que cada thread espera no seu e libera o da próxima."
  }
]},

/* ══════════════ 3. PADRÕES CONCORRENTES ══════════════ */
{ mod:"padroes", secoes:[
  {
    h:"Fork/Join",
    p:"O fluxo principal <b>divide</b> o trabalho criando N fluxos paralelos e depois <b>espera</b> todos terminarem. É o padrão base: <code>fork()</code>+<code>wait()</code> ou <code>pthread_create()</code>+<code>pthread_join()</code>.<br><br>Combina naturalmente com <b>redução</b>: cada thread produz um parcial numa variável privada, e o mestre combina depois do join — sem região crítica nenhuma.",
    cod:"for (i = 0; i < P; i++)                 /* FORK */\n    pthread_create(&t[i], NULL, tarefa, &param[i]);\n\nfor (i = 0; i < P; i++)                 /* JOIN */\n    pthread_join(t[i], NULL);\n\nlong total = 0;                         /* REDUCAO, ja sem concorrencia */\nfor (i = 0; i < P; i++)\n    total += param[i].parcial;"
  },
  {
    h:"Travar & Destravar",
    p:"Adquirir a trava antes da região crítica e liberá-la depois. É o padrão da exclusão mútua.<br><br><b>Riscos:</b> esquecer o <code>unlock</code>; travar recursos em ordens diferentes em threads diferentes (deadlock); granularidade grossa demais, que mata o paralelismo."
  },
  {
    h:"Dormir e acordar, e o sinal perdido",
    p:"Em vez de espera ocupada, a thread se <b>bloqueia</b> e é <b>acordada</b> por outra quando a condição muda.<br><br>O furo clássico é o <b>sinal perdido</b> (<i>lost wakeup</i>): o consumidor testa o buffer, vê que está vazio e é preemptado <b>antes</b> de chamar <code>sleep()</code>; o produtor insere um item e chama <code>wakeup()</code>, que se perde porque ninguém dormia; o consumidor então dorme para sempre.<br><br><b>A proteção:</b> o semáforo <b>guarda o sinal num contador</b> — um <code>post</code> anterior faz o <code>wait</code> seguinte passar direto. Com variáveis de condição, testa-se a condição num <code>while</code> sob a mesma trava que o <code>wait</code> libera atomicamente."
  },
  {
    h:"Despachante-operário (thread pool)",
    p:"Uma thread despachante distribui tarefas de uma fila para um conjunto fixo de operárias.<br><br><b>Ganhos:</b> as threads são criadas uma só vez e reaproveitadas — some o custo de criação por tarefa; e o tamanho do pool limita a concorrência (10 000 tarefas não viram 10 000 threads).<br><br><b>Atenção:</b> a fila de tarefas continua sendo região crítica, tipicamente um produtor/consumidor."
  },
  {
    h:"Pipeline",
    p:"A tarefa é quebrada em estágios sequenciais, um por thread. O dado atravessa os estágios enquanto novos dados entram no início.<br><br>Melhora a <b>vazão</b>, não a <b>latência</b>: com o pipeline cheio, sai um item a cada tempo do <b>estágio mais lento</b>. Com estágios de 2, 5, 3 e 2 ms, a latência de um item é 12 ms, mas sai um item a cada <b>5 ms</b>.<br><br>Otimizar um pipeline significa atacar o gargalo — quebrá-lo em dois, ou replicá-lo.",
    cod:"/* pipeline de estatisticas: cada estagio espera o anterior */\n\nvoid *estagio_media(void *arg) {\n    tarefa_t *t = arg;\n    sem_wait(&pronto_soma);       /* 1. ESPERA a dependencia */\n    t->media = t->soma / t->tamanho;   /* 2. CALCULA */\n    sem_post(&pronto_media);      /* 3. LIBERA o proximo */\n    return NULL;\n}",
    box:"<b>Detalhe de desempenho:</b> com <b>um único</b> conjunto de dados o pipeline não acelera nada — os estágios são estritamente sequenciais. O ganho aparece quando vários dados entram em fila."
  },
  {
    h:"Barreiras",
    p:"Nenhuma thread passa até que todas cheguem. Serve para separar fases em que a fase seguinte depende do que <b>todas</b> produziram na anterior.<br><br>Se não há dependência entre fases, a barreira só introduz espera: todas ficam limitadas à mais lenta.",
    cod:"void esperar_barreira(void) {\n    sem_wait(&mutex);\n    chegaram++;\n\n    if (chegaram == N) {              /* a ULTIMA a chegar */\n        for (int i = 0; i < N - 1; i++)\n            sem_post(&porta);         /* libera todas */\n        sem_post(&mutex);\n    } else {\n        sem_post(&mutex);             /* SOLTA o mutex... */\n        sem_wait(&porta);             /* ...e so entao dorme */\n    }\n}",
    box:"<b>Barreira reutilizável</b> precisa de <b>duas fases</b> (<i>turnstile</i> duplo): uma thread rápida pode atravessar, terminar a fase seguinte e voltar à barreira antes das lentas saírem, zerando o contador na hora errada."
  },
  {
    h:"Produtor/consumidor",
    p:"Três semáforos com papéis distintos:<br><br>&bull; <code>vazio</code> = N — conta espaços livres.<br>&bull; <code>cheio</code> = 0 — conta itens prontos.<br>&bull; <code>mutex</code> = 1 — protege a estrutura do buffer.<br><br>Os dois primeiros são de <b>contagem</b> e sincronizam disponibilidade; o terceiro é <b>binário</b> e dá exclusão mútua.",
    cod:"/* PRODUTOR */                  /* CONSUMIDOR */\nsem_wait(&vazio);              sem_wait(&cheio);\nsem_wait(&mutex);              sem_wait(&mutex);\n    insere_item();                 retira_item();\nsem_post(&mutex);              sem_post(&mutex);\nsem_post(&cheio);              sem_post(&vazio);",
    box:"<b>Regra de ouro de toda a P1:</b> nunca bloqueie num semáforo de <b>condição</b> segurando o <b>mutex</b> de exclusão. Inverter as duas primeiras linhas do produtor causa deadlock quando o buffer enche: ele bloqueia em <code>vazio</code> com o mutex na mão, e o consumidor não consegue o mutex para liberar espaço."
  },
  {
    h:"Leitores e escritores",
    p:"Vários leitores podem acessar o dado ao mesmo tempo; um escritor precisa de acesso exclusivo. Isso é seguro porque leituras simultâneas <b>não</b> causam condição de corrida — corrida exige pelo menos uma escrita.<br><br><b>Limitação da solução simples:</b> ela dá prioridade aos leitores. Enquanto o contador de leitores não zerar, o escritor não entra — e ele nunca zera se leitores continuarem chegando. Não é deadlock (os leitores progridem), é <b>starvation</b> do escritor.<br><br>A correção é o algoritmo de Courtois <i>et al.</i> (1971), que usa um semáforo adicional para bloquear a entrada de <b>novos</b> leitores quando há escritor esperando."
  },
  {
    h:"Jantar dos filósofos",
    p:"Filósofos comem ou pensam; para comer precisam de 2 garfos; há tantos garfos quanto filósofos.<br><br><b>A solução ingênua trava:</b> se todos pegarem o garfo da esquerda ao mesmo tempo, cada um segura um e espera pelo do vizinho — espera circular perfeita, com as quatro condições de Coffman satisfeitas.<br><br><b>Soluções corretas:</b><br>&bull; pegar os <b>dois garfos atomicamente</b> &rarr; ataca posse-e-espera;<br>&bull; <b>numerar os garfos</b> e pegá-los em ordem crescente &rarr; ataca espera circular (basta <b>um</b> filósofo canhoto para quebrar o ciclo);<br>&bull; limitar a N&minus;1 filósofos à mesa com um semáforo de contagem &rarr; ataca posse-e-espera.<br><br><b>Não vale:</b> dormir um tempo aleatório antes de pegar o garfo — isso só reduz a probabilidade do deadlock.",
    box:"<b>Mesmo sem deadlock, ainda há <i>starvation</i>:</b> um filósofo pode nunca ser escalonado para comer, embora o sistema progrida. Corrige-se com uma fila justa por ordem de chegada."
  },
  {
    h:"Barbeiro sonolento",
    p:"Barbearia com N cadeiras de espera e 1 de barbear. Sem clientes, o barbeiro dorme; quando chega um cliente, ele acorda; se chega outro com o barbeiro ocupado, senta (se houver lugar) ou vai embora.<br><br><b>Semáforos:</b> <code>clientes</code> = 0 (clientes esperando — é aqui que o barbeiro dorme), <code>barbeiros</code> = 0 (barbeiro pronto) e <code>mutex</code> = 1 (protege o contador de clientes na sala).<br><br>O padrão <b>dormir e acordar</b> está no coração do problema, e a desistência quando a sala está cheia é o que impede o bloqueio infinito."
  }
]},

/* ══════════════ 4. DEADLOCKS ══════════════ */
{ mod:"deadlocks", secoes:[
  {
    h:"As quatro condições de Coffman",
    p:"Um deadlock exige que <b>todas as quatro</b> valham ao mesmo tempo. Basta quebrar uma para torná-lo impossível — e é isso que as estratégias de prevenção fazem.<br><br><b>1. Exclusão mútua</b> — cada recurso está atribuído a um processo ou disponível.<br><b>2. Posse e espera</b> — um processo que já tem recursos pode pedir novos sem soltar os atuais.<br><b>3. Não-preempção</b> — recursos concedidos não podem ser tomados à força.<br><b>4. Espera circular</b> — existe uma cadeia P1 &rarr; P2 &rarr; ... &rarr; P1 de processos esperando uns pelos outros.",
    cod:"/* deadlock de manual: dois mutexes em ordens opostas */\n\n/* thread A */                /* thread B */\nlock(&m1);                    lock(&m2);\nlock(&m2);   <-- espera       lock(&m1);   <-- espera\n\n/* A tem m1 e quer m2 · B tem m2 e quer m1 */"
  },
  {
    h:"Como atacar cada condição",
    p:"<b>Exclusão mútua</b> — <i>spooling</i>: um daemon monopoliza o dispositivo e enfileira os pedidos (caso da impressora). Não funciona para recursos intrinsecamente exclusivos. É a <b>menos atacável</b>.<br><br><b>Posse e espera</b> — requisitar <b>todos</b> os recursos de uma vez, no início; ou liberar tudo antes de pedir um novo conjunto. Custa utilização baixa e exige saber a demanda antecipadamente.<br><br><b>Não-preempção</b> — tomar o recurso à força, com <i>checkpoint</i>/rollback. Só viável para CPU e memória.<br><br><b>Espera circular</b> — <b>ordenação global dos recursos</b>: todo processo os requisita em ordem numérica crescente. É a <b>mais prática</b>, e a resposta esperada na prova.",
    box:"<b>Na vida real</b> ataca-se espera circular (ordenação) ou posse-e-espera (alocação total antecipada). As outras duas raramente compensam."
  },
  {
    h:"As quatro estratégias",
    p:"&bull; <b>Prevenção</b> — estrutural e estática: mudar as regras de requisição para que uma das condições nunca valha.<br>&bull; <b>Evitação</b> (<i>avoidance</i>) — dinâmica: a cada pedido, simular a concessão e negá-la se o estado resultante for inseguro. É o <b>algoritmo do Banqueiro</b>.<br>&bull; <b>Detecção e recuperação</b> — deixar acontecer, detectar e desfazer (preempção, rollback a um checkpoint, ou matar um processo do ciclo).<br>&bull; <b>Algoritmo do avestruz</b> — ignorar o problema. É o que UNIX e Windows fazem para a maioria dos recursos: prevenir custa desempenho, detectar custa processamento, e deadlocks são raros em sistemas de uso geral."
  },
  {
    h:"Grafo de alocação de recursos",
    p:"Processos e recursos como nós; setas indicam posse e requisição.<br><br>Com <b>uma instância por tipo</b> de recurso, ciclo &equiv; deadlock.<br><br>Com <b>múltiplas instâncias</b>, o ciclo é condição <b>necessária mas não suficiente</b>: um processo do ciclo pode receber uma instância livre de outro lugar, terminar e quebrar a cadeia. Nesse caso é preciso usar o algoritmo matricial de detecção."
  },
  {
    h:"Algoritmo de detecção (exemplo resolvido)",
    p:"Quatro estruturas: <b>E</b> = recursos existentes, <b>A</b> = disponíveis, <b>C</b> = alocação corrente (linha por processo), <b>R</b> = requisições pendentes.<br><br><b>O algoritmo:</b> ache um processo cuja linha de <b>R</b> seja &le; <b>A</b>; execute-o e devolva a linha dele de <b>C</b> para <b>A</b>. Repita. Se sobrar processo que não avança, ele está em deadlock.<br><br><i>Confira sempre a consistência: soma de cada coluna de C + A = E.</i>",
    cod:"C (alocado)        R (pede)        E = (2 4 4 1)\nP1  1 0 1 0        1 0 0 0        A = (0 3 2 0)\nP2  1 0 1 0        1 1 0 1\nP3  0 1 0 1        0 1 2 0\n\nRodada 1, A = (0 3 2 0):\n  P1 pede (1 0 0 0) -> precisa 1 de RS1, ha 0.  NAO\n  P2 pede (1 1 0 1) -> precisa 1 de RS1, ha 0.  NAO\n  P3 pede (0 1 2 0) -> 0<=0, 1<=3, 2<=2, 0<=0.  SIM\n\n  P3 executa e devolve C3 = (0 1 0 1)\n  A = (0 4 2 1)\n\nRodada 2:\n  P1 pede (1 0 0 0) -> RS1 continua 0.  NAO\n  P2 pede (1 1 0 1) -> RS1 continua 0.  NAO\n\n=> P1 e P2 estao em DEADLOCK"
  },
  {
    h:"Algoritmo do Banqueiro (exemplo resolvido)",
    p:"É <b>evitação</b>: antes de conceder um pedido, o sistema simula a concessão e verifica se ainda existe uma <b>sequência segura</b> — uma ordem em que todos os processos conseguem chegar ao seu máximo e terminar.<br><br><b>Os três passos:</b> (1) validar o pedido; (2) simular a concessão; (3) testar a segurança e <b>desfazer</b> se for inseguro.<br><br><b>Premissas:</b> cada processo declara sua necessidade <b>máxima</b> antecipadamente, e o número de processos e recursos é fixo. É a maior crítica prática ao algoritmo.",
    cod:"Processo  Utilizado  Maximo  Ainda precisa\n   A          2         6          4\n   B          1         6          5\n   C          1         5          4\n   D          2         4          2\nLivres: 2\n\n1) O estado ATUAL e seguro?\n   D precisa 2, ha 2  -> executa, devolve 4.  Livres = 4\n   A precisa 4, ha 4  -> executa, devolve 6.  Livres = 6\n   B precisa 5, ha 6  -> executa, devolve 6.  Livres = 7\n   C precisa 4, ha 7  -> executa.\n   Sequencia segura: D, A, B, C.  SEGURO\n\n2) E se B pedir 1 recurso?\n   B fica com 2 e ainda precisa 4.  Livres = 1\n   A precisa 4 > 1   X\n   B precisa 4 > 1   X\n   C precisa 4 > 1   X\n   D precisa 2 > 1   X\n   Nenhuma sequencia segura.  INSEGURO\n\n=> o pedido e NEGADO. B espera, mesmo havendo 1 livre.",
    box:"<b>Estado inseguro &ne; deadlock.</b> Inseguro é a perda da <i>garantia</i>, não a certeza do travamento — os processos podem simplesmente não pedir seus máximos. O Banqueiro é conservador de propósito."
  },
  {
    h:"Condição para nunca haver deadlock",
    p:"Com <b>p</b> processos, cada um pedindo no máximo <b>m</b> recursos de um total <b>t</b>:<br><br><b>p &times; (m &minus; 1) + 1 &le; t</b><br><br><b>Raciocínio:</b> no pior caso, cada processo já tem <i>m</i>&minus;1 recursos e falta 1 para terminar — isso consome p(m&minus;1). Se sobrar <b>pelo menos 1</b>, alguém completa, termina, devolve tudo e destrava a fila em cascata.<br><br><i>Exemplo:</i> 3 filósofos precisando de 2 garfos cada exigiriam t &ge; 3&times;1+1 = <b>4</b> garfos para nunca travar. Como só há 3, o deadlock é possível — exatamente o que acontece quando todos pegam o garfo da esquerda."
  },
  {
    h:"Deadlock x starvation",
    p:"<b>Deadlock</b> é uma questão de <b>segurança</b>: um conjunto de processos está bloqueado esperando uns pelos outros e <b>ninguém</b> progride.<br><br><b>Starvation</b> é uma questão de <b>justiça</b>: o sistema progride — alguns processos são atendidos repetidamente — mas um processo específico é sistematicamente preterido e espera indefinidamente.<br><br>Resolver deadlock é impedir a espera circular. Resolver starvation é garantir justiça: filas FIFO, envelhecimento (<i>aging</i>) de prioridade."
  }
]},

/* ══════════════ 5. REDES DE PETRI ══════════════ */
{ mod:"petri", secoes:[
  {
    h:"Elementos da rede",
    p:"Uma Rede de Petri é um <b>grafo bipartido</b>: arcos só ligam lugar&rarr;transição ou transição&rarr;lugar, nunca dois do mesmo tipo.<br><br>&bull; <b>Lugares</b> (círculos) — condições ou recursos.<br>&bull; <b>Transições</b> (barras/retângulos) — eventos ou ações.<br>&bull; <b>Arcos</b> — com <b>peso</b> (multiplicidade), que por padrão é 1.<br>&bull; <b>Fichas</b> (<i>tokens</i>, pontos dentro dos lugares) — disponibilidade do recurso ou satisfação da condição.<br><br>A distribuição das fichas num instante é a <b>marcação</b>, e ela é o <b>estado</b> do sistema. A marcação inicial é M<sub>0</sub>.",
    cod:"       (Pensando)              lugar com 1 ficha\n            |\n            v\n        [ Pega ]                 transicao\n         ^     ^\n         |     |\n     (Garfo0) (Garfo1)           entradas adicionais\n            |\n            v\n        (Comendo)"
  },
  {
    h:"Habilitação e disparo",
    p:"Uma transição está <b>habilitada</b> quando <b>cada</b> lugar de entrada tem pelo menos tantas fichas quanto o peso do arco correspondente. A condição é <b>conjuntiva</b> — é isso que modela naturalmente o &ldquo;preciso dos <b>dois</b> garfos para comer&rdquo;.<br><br>Ao <b>disparar</b>, a transição consome as fichas dos lugares de entrada e produz fichas nos de saída, conforme os pesos. O disparo é <b>atômico</b>: consome e produz num só passo indivisível.<br><br>O número de fichas <b>não se conserva</b>: uma transição com 2 arcos de entrada e 1 de saída destrói uma ficha líquida.<br><br>Quando várias transições estão habilitadas, a escolha é <b>não determinística</b> — e é justamente isso que torna o modelo adequado para sistemas concorrentes, porque representa a imprevisibilidade do escalonador."
  },
  {
    h:"Modelando exclusão mútua",
    p:"Um lugar <code>mutex</code> com <b>1 ficha</b>, ligado como entrada das transições &ldquo;entra na região crítica&rdquo; dos dois processos e como saída das transições &ldquo;sai&rdquo;.<br><br>A ficha única <b>é</b> a trava: quando A dispara sua entrada, consome a ficha; a entrada de B deixa de estar habilitada até que A devolva.<br><br>Um lugar com 2 fichas modelaria um semáforo de contagem que permite 2 processos simultâneos — e não haveria exclusão mútua."
  },
  {
    h:"Modelando produtor/consumidor",
    p:"Dois lugares em oposição: <code>Vazios</code> com N fichas e <code>Cheios</code> com 0. A transição &ldquo;produzir&rdquo; consome de <code>Vazios</code> e produz em <code>Cheios</code>; &ldquo;consumir&rdquo; faz o inverso.<br><br>É a tradução direta dos dois semáforos de contagem. A soma das fichas nos dois lugares é sempre N — um <b>invariante de lugar</b>, que é a prova formal de que o buffer nunca estoura nem é lido vazio."
  },
  {
    h:"Jantar dos filósofos: o modelo errado e o certo",
    p:"<b>Modelo errado</b> (item (a) do laboratório): transições separadas <code>Pega_esquerdo</code> e <code>Pega_direito</code>. A árvore de alcançabilidade encontra a marcação em que todos dispararam &ldquo;pega esquerdo&rdquo;: todos os lugares-garfo vazios, nenhuma transição habilitada. É uma <b>marcação morta</b> = deadlock.<br><br><b>Modelo certo</b>: uma <b>única</b> transição <code>Pega_i</code> com três arcos de entrada (Pensando_i, Garfo_i, Garfo_d). Como o disparo é atômico, o estado &ldquo;segurando um garfo só&rdquo; <b>não existe na rede</b> — a posse-e-espera desaparece por construção.",
    cod:"Modelo correto, 3 filosofos (d = (i+1) mod 3):\n\nLUGARES (9)                       M0\n  Pensando_0, _1, _2              1, 1, 1\n  Comendo_0,  _1, _2              0, 0, 0\n  Garfo_0,    _1, _2              1, 1, 1\n\nTRANSICOES (6)\n  Pega_i  : entradas  Pensando_i, Garfo_i, Garfo_d\n            saida     Comendo_i\n  Larga_i : entrada   Comendo_i\n            saidas    Pensando_i, Garfo_i, Garfo_d"
  },
  {
    h:"Árvore de alcançabilidade (exemplo resolvido)",
    p:"A árvore enumera todas as marcações atingíveis a partir de M<sub>0</sub>. Um nó <b>sem sucessores</b> — nenhuma transição habilitada — é uma <b>marcação morta</b>, ou seja, deadlock.<br><br>Provar a <b>ausência</b> de deadlock exige percorrer a árvore inteira e mostrar que toda marcação alcançável tem pelo menos uma transição habilitada. Nós que repetem uma marcação já vista fecham um ciclo e não precisam ser expandidos — é o que mantém a árvore finita.",
    cod:"Marcacao = [Pens0,Pens1,Pens2 | Com0,Com1,Com2 | G0,G1,G2]\n\nM0 = [1,1,1 | 0,0,0 | 1,1,1]\n     habilitadas: Pega_0, Pega_1, Pega_2\n\n  --Pega_0-->  M1 = [0,1,1 | 1,0,0 | 0,0,1]\n       Pega_1 precisa G1,G2 -> G1 vazio.  nao\n       Pega_2 precisa G2,G0 -> G0 vazio.  nao\n       Larga_0                            SIM\n  --Larga_0--> volta a M0\n\n  Pega_1 e Pega_2: ramos simetricos.\n\n=> 4 marcacoes alcancaveis, TODAS com transicao habilitada\n=> sem marcacao morta => rede VIVA, livre de deadlock\n=> nenhum lugar passa de 1 ficha => rede SEGURA"
  },
  {
    h:"Propriedades da rede",
    p:"&bull; <b>Viva</b> (<i>live</i>) — a partir de qualquer marcação alcançável é sempre possível disparar qualquer transição em algum momento futuro. Garante ausência de deadlock <b>e</b> de transições mortas.<br>&bull; <b>Limitada</b> (<i>bounded</i>) — nenhum lugar acumula fichas indefinidamente. Importante porque uma rede ilimitada tem árvore de alcançabilidade infinita.<br>&bull; <b>Segura</b> (<i>safe</i>) — caso particular de 1-limitada: nenhum lugar passa de 1 ficha. Típico de modelos de recursos únicos, como cada garfo."
  }
]},

/* ══════════════ 6. HARDWARE PARALELO ══════════════ */
{ mod:"hardware", secoes:[
  {
    h:"Por que existe programação paralela",
    p:"De 1986 a 2002, o desempenho dos microprocessadores dobrava a cada 2 anos — bastava esperar a próxima geração. A partir de 2002 o ganho caiu para cerca de 20% ao ano.<br><br>Depois de 2005, em vez de continuar aumentando a <b>frequência</b> (barrada pela dissipação de potência e pelo calor), os fabricantes passaram a colocar <b>múltiplos núcleos</b> num único circuito integrado.<br><br>E aí vem a frase que motiva a disciplina inteira: <b>simplesmente acrescentar processadores não vai magicamente melhorar o desempenho de programas seriais</b>. Um programa serial usa um núcleo; os outros ficam ociosos. Alguém precisa reescrever o programa."
  },
  {
    h:"Taxonomia de Flynn",
    p:"Classifica arquiteturas por dois eixos: fluxo de <b>instruções</b> e fluxo de <b>dados</b> por ciclo.<br><br>&bull; <b>SISD</b> — uma instrução, um dado. A arquitetura clássica de Von Neumann. Execução determinística.<br>&bull; <b>SIMD</b> — uma unidade de controle envia a mesma instrução para <b>múltiplas ULAs</b>, que operam sobre dados diferentes. Síncrono e determinístico. Bom para problemas regulares (visão computacional, álgebra linear, gráficos). GPUs e instruções vetoriais.<br>&bull; <b>MISD</b> — múltiplas instruções sobre o mesmo dado. Raro; exemplo: vários algoritmos de criptografia tentando revelar a mesma mensagem.<br>&bull; <b>MIMD</b> — instruções e dados diferentes, síncrono ou assíncrono. Supercomputadores, clusters, PCs multicore.",
    box:"<b>Limitação do SIMD:</b> quando o código tem desvio condicional, parte das ULAs fica <b>ociosa esperando</b> — é a divergência de fluxo."
  },
  {
    h:"MIMD: memória compartilhada x distribuída",
    p:"<b>Memória compartilhada</b> — todas as unidades acessam a mesma memória e se comunicam por estruturas de dados comuns. É o seu PC multicore. Ferramentas: pthreads, OpenMP. O problema principal é a <b>sincronização</b>.<br><br><b>Memória distribuída</b> — cada processador tem memória privada; a comunicação é por <b>troca explícita de mensagens</b>. É o cluster. Ferramenta: MPI. O problema principal é o <b>custo da comunicação</b>.<br><br><b>Nó x núcleo:</b> um <b>nó</b> é um computador completo; um <b>núcleo</b> é uma unidade de processamento dentro do processador. Programas de alto desempenho costumam ser <b>híbridos</b>: MPI entre nós, OpenMP dentro de cada um."
  },
  {
    h:"Pipeline de instruções (exemplo resolvido)",
    p:"O pipeline quebra a execução em estágios; com ele cheio, sai uma instrução por ciclo. O ciclo do relógio é ditado pelo <b>estágio mais lento</b>.",
    cod:"5 estagios de 10 ns cada (Fetch, Decode, Execute, Mem-Read, Reg-Write)\n\n  encher o pipeline = 5 x 10 = 50 ns\n  com o pipeline cheio, sai 1 instrucao a cada 10 ns\n  sem pipeline, 1 instrucao levaria 50 ns\n  ganho = 50 / 10 = 5x\n\n\nAgora Mem-Read passa a levar 20 ns:\n\n  o relogio inteiro passa a 20 ns (estagio mais lento manda)\n  encher = 5 x 20 = 100 ns\n  com o pipeline cheio, sai 1 instrucao a cada 20 ns\n  sem pipeline = 10+10+10+20+10 = 60 ns\n  ganho = 60 / 20 = 3x       (contra 5x do caso balanceado)",
    box:"<b>Lição:</b> um único estágio desbalanceado rouba desempenho de todo o pipeline — os outros quatro ficam ociosos 10 ns por ciclo. É o mesmo princípio do balanceamento de carga entre threads."
  },
  {
    h:"Cache e localidade (exemplo resolvido)",
    p:"<b>Localidade espacial</b> — se um endereço é acessado, os vizinhos provavelmente serão logo. Por isso a cache traz uma <b>linha</b> inteira, e não só a palavra pedida.<br><br><b>Localidade temporal</b> — se um endereço é acessado, provavelmente será acessado de novo em breve. Por isso o dado fica na cache depois do uso.<br><br>Em C, matrizes são armazenadas <b>por linhas</b> (<i>row-major</i>). Percorrer por colunas destrói a localidade espacial.",
    cod:"MAX = 8  ->  A[8][8] = 64 doubles\ncache: 4 linhas x 4 doubles = 16 doubles, mapeamento direto\n\n(1) POR LINHAS               (2) POR COLUNAS\nfor (i...)                   for (j...)\n  for (j...)                   for (i...)\n    y[i] += A[i][j]*x[j];        y[i] += A[i][j]*x[j];\n\n(1) A[i][j] avanca sequencialmente na memoria.\n    Cada linha de cache traz 4 doubles: 1 falta + 3 acertos.\n    -> 64/4 = 16 MISSES\n\n(2) salto de 8 doubles = 2 linhas de cache.\n    Com so 4 linhas, quando o laco volta para j+1 a linha\n    de A[0][j] ja foi expulsa. Nada e reaproveitado.\n    -> 64 MISSES",
    box:"<b>Antes de paralelizar, percorra as matrizes na ordem em que estão na memória.</b> Uma cache maior beneficia muito mais o laço (2); uma matriz maior piora os dois, mas destrói o (2)."
  },
  {
    h:"Cache e muitas threads",
    p:"O desempenho de um processador <i>multithread</i> pode <b>degradar</b> com muitas threads: cada uma tem seu próprio conjunto de trabalho, e se a soma não cabe na cache elas passam a se <b>expulsar mutuamente</b> (<i>cache thrashing</i>). O tempo gasto reaquecendo a cache pode superar o ganho da concorrência.<br><br>Efeito relacionado: o <b>falso compartilhamento</b> — duas threads escrevendo em variáveis distintas que caem na <b>mesma linha de cache</b> forçam invalidações constantes entre os núcleos, mesmo sem haver compartilhamento lógico nenhum."
  },
  {
    h:"Quando a comunicação mata o ganho (exemplo resolvido)",
    p:"Em memória distribuída, o custo da mensagem pode aniquilar todo o benefício da paralelização. Mesmo algoritmo, mesma máquina, mesmo número de processadores — só muda o custo da mensagem.",
    cod:"Programa: 10^12 instrucoes.  1 processador faz 10^6 instr/s\n  -> serial: 10^6 s (~12 dias)\n\nCom p = 1000 processadores:\n  computacao: 10^12/1000 = 10^9 instr -> 10^9/10^6 = 1000 s\n  mensagens : 10^9 x (1000-1) = 9,99 x 10^11\n\n(a) mensagem custa 10^-9 s:\n    comunicacao = 9,99x10^11 x 10^-9 = 999 s\n    TOTAL = 1000 + 999 = ~2000 s     (speedup ~500x)\n\n(b) mensagem custa 10^-3 s:\n    comunicacao = 9,99x10^11 x 10^-3 = ~10^9 s\n    TOTAL = ~10^9 s  ->  MIL VEZES PIOR que o serial"
  }
]},

/* ══════════════ 7. DESEMPENHO E ESCALABILIDADE ══════════════ */
{ mod:"desempenho", secoes:[
  {
    h:"Speedup e eficiência",
    p:"<b>Ganho (speedup):</b> S = T<sub>serial</sub> / T<sub>paralelo</sub> — quantas vezes o programa ficou mais rápido.<br><br><b>Eficiência:</b> E = S / p — quanto de cada processador está sendo realmente aproveitado.<br><br>Se S = 4 com p = 4, então E = 1 (ganho linear, o caso ideal). Se S = 3,2 com p = 4, então E = 0,8: 20% da capacidade se perdeu em <i>overhead</i>.<br><br><b>Detalhe que vale nota no Trabalho:</b> T<sub>serial</sub> é o tempo do <b>melhor algoritmo serial</b>, e não o tempo do programa paralelo rodando com 1 thread.",
    box:"<b>Speedup superlinear</b> (S &gt; p) existe e a causa mais comum é a <b>cache agregada</b>: com p processadores, cada um trabalha sobre 1/p dos dados, que pode caber inteiro na cache. Fora casos assim, S &gt; p geralmente indica erro de medição."
  },
  {
    h:"Lei de Amdahl",
    p:"Com o <b>tamanho do problema fixo</b>, a parte serial é um teto intransponível:<br><br><b>S(p) = 1 / [ (1&minus;P) + P/p ]</b>, com P a fração paralelizável.<br><br>Quando p &rarr; &infin;, o termo P/p some e sobra <b>S<sub>máx</sub> = 1/(1&minus;P)</b>.",
    cod:"Programa com 90% paralelizavel (P = 0,9):\n  S(4)  = 1 / (0,1 + 0,9/4)  = 3,08\n  S(16) = 1 / (0,1 + 0,9/16) = 6,4\n  S(inf)= 1 / 0,1            = 10   <- TETO\n\nForma geral (lei do ganho decrescente):\n  Programa leva 100 s. Uma rotina de 40 s fica 4x mais rapida.\n  novo tempo = 60 + 40/4 = 70 s\n  ganho      = 100/70 = 1,43x\n  (mesmo com a rotina infinitamente rapida: 100/60 = 1,67x)",
    box:"<b>Otimize primeiro o que ocupa mais tempo.</b> Meça antes de paralelizar."
  },
  {
    h:"Lei de Gustafson",
    p:"Amdahl fixa o problema e pergunta quanto mais rápido ele fica. <b>Gustafson fixa o tempo</b> e pergunta quanto <b>maior</b> pode ser o problema resolvido.<br><br><b>S(p) = p &minus; &alpha;(p&minus;1)</b>, com &alpha; a fração serial.<br><br>Na prática, quem ganha mais processadores usa-os para problemas maiores. Como a parte paralela cresce com o tamanho do problema enquanto a serial permanece quase constante, a <b>fração serial encolhe</b> e o ganho se aproxima do linear.<br><br>Simulação climática e treinamento de redes neurais são casos típicos de Gustafson."
  },
  {
    h:"Escalabilidade forte e fraca",
    p:"<b>Forte</b> — a eficiência se mantém quando aumentamos p com o <b>tamanho do problema fixo</b>. Exigência dura: significa que o <i>overhead</i> praticamente não cresce. Poucos programas conseguem.<br><br><b>Fraca</b> — a eficiência se mantém quando aumentamos p <b>e</b> o tamanho do problema junto. Mais comum e ainda muito útil.<br><br>É o que o roteiro do Trabalho pede para avaliar, repetindo as medições com número crescente de threads.",
    cod:"Exemplo: T_serial = n^2 ,  T_paralelo = n^2/p + log2(p)\n\n  E = T_serial / (p x T_paralelo) = n^2 / (n^2 + p*log2(p))\n\n  n fixo, p aumenta  -> denominador cresce  -> E CAI\n  p fixo, n aumenta  -> n^2 domina          -> E -> 1\n\n\nExemplo: T_serial = n ,  T_paralelo = n/p + log2(p)\n\n  E = n / (n + p*log2(p))\n  manter E constante = manter n / (p*log2 p) constante\n\n  p = 8  -> 8 x 3 = 24\n  p = 16 -> 16 x 4 = 64\n\n  n deve crescer 64/24 = 8/3 = ~2,67x  ao dobrar p\n  -> escalavel FRACAMENTE (n cresce mais rapido que p)"
  },
  {
    h:"Balanceamento de carga (exemplo resolvido)",
    p:"Num programa com <i>join</i> ao final, <b>o tempo total é o da thread mais lenta</b>. Somar os tempos é o erro clássico.<br><br><b>Fator de balanceamento</b> = tempo médio / tempo máximo (1 = perfeito).",
    cod:"          Implementacao A   Implementacao B\nThread 0         4                 1\nThread 1         3                 8\nThread 2         7                 4\nThread 3         5                 6\nSoma            19                19\n\nTempo total (= o MAXIMO):   A = 7 s     B = 8 s\nMedia:                      4,75        4,75\nFator (media/max):          0,68        0,59\nOcioso total:                9 s        13 s\n\n=> A e mais rapida E mais balanceada."
  },
  {
    h:"Fontes de overhead",
    p:"<i>Overhead</i> é o tempo necessário para <b>coordenar</b> tarefas concorrentes ou paralelas:<br><br>&bull; comunicação entre tarefas;<br>&bull; sincronização (travas e barreiras);<br>&bull; criação e destruição de threads;<br>&bull; desbalanceamento de carga;<br>&bull; a parte serial que não pôde ser paralelizada.<br><br>Reconhecer a fonte é o que permite atacar o problema certo: se o gargalo é sincronização, reduza a granularidade da região crítica; se é desbalanceamento, mude o escalonamento para dinâmico; se é comunicação, aumente a granularidade das tarefas.<br><br><b>Granularidade fina</b> = tarefas pequenas, muita comunicação — bom para balanceamento, ruim para <i>overhead</i>. <b>Grossa</b> = o inverso."
  },
  {
    h:"Distribuir o trabalho: blocos, cíclico e dinâmico",
    p:"<b>Por blocos</b> — cada nó fica com uma faixa contígua:<br><code>my_min = n &times; (MAX/p)</code>, <code>my_max = (n+1) &times; (MAX/p)</code>, com o último nó absorvendo o resto da divisão. Ótimo quando todas as iterações custam o mesmo.<br><br><b>Cíclico</b> (<i>round-robin</i>) — a thread <i>t</i> pega os índices <i>t</i>, <i>t+p</i>, <i>t+2p</i>... Use quando o custo cresce de forma <b>conhecida</b> com o índice: cada thread recebe uma mistura de itens baratos e caros.<br><br><b>Dinâmico</b> — fila de tarefas, cada thread pega a próxima ao terminar. Use quando o custo é <b>imprevisível</b>. É o despachante-operário, e em OpenMP é <code>schedule(dynamic)</code>.",
    box:"Se <code>Compute_value(i)</code> demora cada vez mais conforme <i>i</i> cresce, a distribuição em <b>blocos</b> desbalanceia: a thread do último bloco trabalha muito mais e as outras esperam. Cíclica ou dinâmica resolve."
  },
  {
    h:"Soma em árvore",
    p:"Depois que cada núcleo calculou sua soma parcial, a combinação pode ser feita de duas formas.<br><br>&bull; <b>Mestre sequencial</b> — recebe de todos, um a um: <b>p&minus;1</b> etapas.<br>&bull; <b>Árvore</b> — pares combinam em paralelo, depois pares de pares: <b>log<sub>2</sub>(p)</b> etapas.<br><br>Com p = 1024, são <b>10</b> etapas contra 1023.",
    cod:"divisor        comeca em 2 e DOBRA a cada iteracao\ncore_difference comeca em 1 e DOBRA a cada iteracao\n\nse (core % divisor == 0)  -> RECEBE e acumula\nsenao                     -> ENVIA e sai\n\ncom quem?  recebe de (core + core_difference)\n           envia  para (core - core_difference)\n\nIteracao 0: divisor=2, diff=1  -> 0<-1, 2<-3, 4<-5, 6<-7\nIteracao 1: divisor=4, diff=2  -> 0<-2, 4<-6\nIteracao 2: divisor=8, diff=4  -> 0<-4\n\n(p = 8  ->  log2(8) = 3 etapas)",
    box:"Os slides usam esse exemplo para justificar por que se escreve programas paralelos à mão: <i>&ldquo;é muito improvável que um programa tradutor encontre essa forma&rdquo;</i>."
  },
  {
    h:"Dependência de dados",
    p:"Antes de paralelizar um laço, verifique se uma iteração depende do resultado de outra.",
    cod:"/* PARALELIZAVEL: cada iteracao escreve numa posicao propria */\nfor (i = 0; i < n; i++)  c[i] = a[i] + b[i];\n\n/* REDUCAO: regiao critica, mas com solucao conhecida */\nfor (i = 0; i < n; i++)  soma += v[i];\n\n/* NAO PARALELIZAVEL: le o que a iteracao anterior escreveu */\nfor (i = 1; i < n; i++)  a[i] = a[i-1] + b[i];\n     /* dependencia carregada pelo laco (loop-carried) */\n     /* so muda com outro algoritmo: soma de prefixos paralela */"
  }
]},

/* ══════════════ 8. OPENMP ══════════════ */
{ mod:"openmp", secoes:[
  {
    h:"Como funciona",
    p:"OpenMP é um conjunto de <b>diretivas de compilador</b> para memória compartilhada. O modelo é <b>fork-join</b>: ao encontrar uma região paralela, a thread mestre cria um <b>time</b> de threads; ao final da região, todas se juntam de novo.<br><br>Compile com <code>-fopenmp</code>. <b>Sem essa opção o compilador ignora os pragmas em silêncio</b> e gera um programa serial que compila e roda sem erro — armadilha clássica ao medir tempos.",
    cod:"#include <omp.h>\n\n#pragma omp parallel                 /* cria o time */\n{\n    int id = omp_get_thread_num();   /* 0 .. n-1 */\n    int n  = omp_get_num_threads();\n    printf(\"thread %d de %d\\n\", id, n);\n}                                    /* barreira implicita aqui */\n\n/* gcc prog.c -o prog -fopenmp */",
    box:"<code>omp_get_num_threads()</code> chamada <b>fora</b> de uma região paralela devolve <b>1</b>. Para saber quantas threads serão usadas, use <code>omp_get_max_threads()</code>."
  },
  {
    h:"parallel for",
    p:"<code>parallel for</code> combina a criação do time com a divisão das iterações entre as threads. Cada iteração é executada <b>uma única vez</b>, por uma das threads — não é o laço inteiro replicado.<br><br>O índice do laço paralelizado já é <b>privado automaticamente</b>. Há uma <b>barreira implícita</b> no final.",
    cod:"#pragma omp parallel for\nfor (int i = 0; i < n; i++)\n    c[i] = a[i] + b[i];"
  },
  {
    h:"Escopo das variáveis",
    p:"Por padrão, variáveis declaradas <b>fora</b> da região paralela são <code>shared</code>.<br><br>&bull; <code>shared(x)</code> — uma única variável para todas.<br>&bull; <code>private(x)</code> — cada thread tem sua cópia, <b>não inicializada</b> (entra com lixo!).<br>&bull; <code>firstprivate(x)</code> — cópia privada, <b>inicializada</b> com o valor de antes da região.<br><br>Boa prática defensiva: <code>default(none)</code> e declarar o escopo de tudo explicitamente.",
    cod:"int i, j, k;\n\n/* j e k sao contadores INTERNOS de cada thread: precisam ser private,\n   senao todas incrementam o mesmo contador e o resultado e lixo.     */\n#pragma omp parallel for private(j, k) shared(A, B, C, n)\nfor (i = 0; i < n; i++)\n    for (j = 0; j < n; j++) {\n        float soma = 0.0f;            /* local -> privada por construcao */\n        for (k = 0; k < n; k++)\n            soma += A[i][k] * B[k][j];\n        C[i][j] = soma;\n    }"
  },
  {
    h:"reduction: o jeito certo de acumular",
    p:"<code>reduction(op:var)</code> cria uma cópia privada da variável em cada thread, inicializada com o <b>elemento neutro</b> do operador, e ao final combina todas as cópias na variável original — de forma eficiente, tipicamente em árvore.<br><br>Neutros: <code>+</code>&rarr;0, <code>*</code>&rarr;1, <code>max</code>&rarr;&minus;&infin;.<br><br>É exatamente o padrão do acumulador privado da P1, automatizado.",
    cod:"/* ERRADO: condicao de corrida em soma */\ndouble soma = 0.0;\n#pragma omp parallel for\nfor (int i = 0; i < n; i++) soma += v[i];\n\n/* CERTO */\ndouble soma = 0.0;\n#pragma omp parallel for reduction(+:soma)\nfor (int i = 0; i < n; i++) soma += v[i];",
    box:"Usar <code>critical</code> a cada iteração também dá o resultado certo, mas serializa o laço inteiro — fica mais lento que a versão serial."
  },
  {
    h:"critical, atomic e a região crítica",
    p:"&bull; <code>#pragma omp atomic</code> — para <b>uma</b> operação simples de leitura-modificação-escrita (<code>x += expr</code>, <code>x++</code>). O compilador emite uma instrução atômica de hardware, sem trava. Bem mais rápido.<br>&bull; <code>#pragma omp critical</code> — serializa um <b>bloco</b> de código qualquer, com uma trava.<br><br><b>Cuidado:</b> duas regiões <code>critical</code> <b>sem nome</b> compartilham a mesma trava global, o que serializa trechos independentes. Dê nomes distintos: <code>#pragma omp critical(nome)</code>.<br><br>Para acumuladores, prefira <code>reduction</code> aos dois."
  },
  {
    h:"schedule: como distribuir as iterações",
    p:"&bull; <code>schedule(static)</code> — divide em blocos fixos antes da execução. <i>Overhead</i> praticamente zero e boa localidade de cache. É o padrão. Use quando todas as iterações custam o mesmo.<br>&bull; <code>schedule(dynamic)</code> — distribui blocos sob demanda, conforme as threads terminam. Paga o custo da fila, mas evita que uma thread azarada atrase todo mundo. Use com carga irregular.<br>&bull; <code>schedule(guided)</code> — meio-termo: blocos grandes no começo, que vão diminuindo.",
    cod:"/* custo cresce com i: static desbalanceia, dynamic equilibra */\n#pragma omp parallel for schedule(dynamic, 16) reduction(+:soma)\nfor (int i = 0; i < n; i++)\n    soma += compute_value(i);"
  },
  {
    h:"Sincronização: barrier, nowait, single, master",
    p:"&bull; <code>#pragma omp barrier</code> — força todas as threads do time a esperarem umas pelas outras.<br>&bull; <code>nowait</code> — <b>remove</b> a barreira implícita no fim de um <code>for</code>, <code>single</code> ou <code>sections</code>. Use quando a fase seguinte não depende do resultado da anterior. Remover uma barreira necessária cria condição de corrida silenciosa.<br>&bull; <code>#pragma omp single</code> — o bloco é executado por <b>uma</b> thread qualquer, com barreira implícita no final.<br>&bull; <code>#pragma omp master</code> — executado obrigatoriamente pela thread 0, <b>sem</b> barreira.<br><br>A região <code>parallel</code> sempre tem barreira no fim — não há <code>nowait</code> para ela."
  },
  {
    h:"sections: paralelismo de tarefas",
    p:"Enquanto <code>for</code> é paralelismo de <b>dados</b> (a mesma operação sobre elementos diferentes), <code>sections</code> é paralelismo de <b>tarefas</b>: cada <code>section</code> é um bloco de código diferente, executado por uma thread.<br><br>É a construção natural para montar um pipeline. Limitação: o paralelismo é fixo no número de seções escritas — mais threads que seções deixa threads ociosas.",
    cod:"#pragma omp parallel sections\n{\n    #pragma omp section\n    { calcula_soma(); }\n\n    #pragma omp section\n    { calcula_maximo(); }\n}"
  },
  {
    h:"Medir o tempo (e o erro que custa nota)",
    p:"Use <b><code>omp_get_wtime()</code></b>, que devolve tempo de <b>parede</b> em segundos.<br><br><b>Nunca use <code>clock()</code></b> da libc: ele mede tempo de <b>CPU somado de todas as threads</b>. Com 4 threads o valor <i>aumenta</i> conforme você paraleliza, e o &ldquo;speedup&rdquo; calculado sai menor que 1.<br><br>Meça só o trecho paralelizado — deixe leitura de arquivo e alocação fora da medição. E use entradas grandes: o roteiro do Trabalho sugere calibrar para o serial levar de 20 a 30 segundos.",
    cod:"double t0 = omp_get_wtime();\n\nmatmult(A, B, C, n);\n\ndouble t1 = omp_get_wtime();\nprintf(\"tempo: %.6f s com %d threads\\n\",\n       t1 - t0, omp_get_max_threads());\n\n/* varie OMP_NUM_THREADS em 1,2,4,8 e calcule\n   S = T1/Tp   e   E = S/p                     */"
  },
  {
    h:"Histograma: quando o índice depende do dado",
    p:"Ao contrário da soma de vetores, no histograma iterações <b>diferentes escrevem na mesma posição</b> sempre que os valores caem no mesmo <i>bin</i> — o índice depende do <b>dado</b>, não do <b>i</b>. Há região crítica.<br><br>Duas soluções: <code>atomic</code> (simples, mas com muita disputa quando os dados se concentram) ou <b>privatização + redução</b> — cada thread mantém seu próprio vetor de contagens, somados no final. Muito mais rápido, ao custo de memória.<br><br>Cuidado ainda com o <b>falso compartilhamento</b>: bins vizinhos caem na mesma linha de cache.",
    cod:"/* ERRADO: corrida no incremento */\n#pragma omp parallel for\nfor (int i = 0; i < n; i++)\n    hist[ v[i] - minimo ]++;\n\n/* OK: atomico */\n#pragma omp parallel for\nfor (int i = 0; i < n; i++) {\n    #pragma omp atomic\n    hist[ v[i] - minimo ]++;\n}\n\n/* MELHOR: histogramas privados + reducao */\n#pragma omp parallel for reduction(+:hist[:num_bins])\nfor (int i = 0; i < n; i++)\n    hist[ v[i] - minimo ]++;"
  },
  {
    h:"Nem todo algoritmo escala — e isso é uma conclusão válida",
    p:"O <b>selection sort</b> tem laço externo <b>inerentemente sequencial</b>: a posição <i>i</i> só pode ser definida depois das <i>i</i>&minus;1 anteriores. Resta paralelizar a busca do mínimo (uma redução com <code>min</code>), que vai <b>encolhendo</b> a cada passo, até o custo de sincronizar superar o trabalho útil.<br><br>Resultado esperado: <i>speedup</i> modesto e eficiência baixa. O heap sort tem o mesmo problema na fase de extração.<br><br>O Trabalho pede a <b>análise</b>, não que todo algoritmo escale bem — relatar honestamente por que um algoritmo não escala vale nota."
  }
]}

];
