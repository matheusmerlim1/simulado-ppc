/* ═══════════════════════════════════════════════════════════
   LISTAS DE EXERCÍCIOS — uma por aula, questão a questão.

   Cada lista diz de que PDF saiu (a atividade) e a que PDF de
   conteúdo ela corresponde, para não restar dúvida sobre o par.
   Cada questão traz o enunciado, a resolução e, quando existe,
   o tópico da matéria onde o assunto está desenvolvido.
   ═══════════════════════════════════════════════════════════ */
const LISTAS = [
{
  id:"lab-processos",
  mod:"processos",
  nome:"Laboratório: Processos e Threads",
  atividade:"Lab_ProcessosThreads.pdf",
  conteudo:"PPC_02-ProcessosThreads.pdf",
  intro:"A lista deixa você escolher o modelo — fork/join com memória compartilhada, POSIX threads, Java Threads ou Go. As resoluções aqui usam <b>pthreads</b>, que é o que a prova prática cobra.",
  questoes:[
    {
      n:"1",
      t:"Uma thread por letra do alfabeto",
      enunciado:"Crie uma thread para imprimir cada letra do alfabeto. A letra deve chegar à thread <b>por parâmetro</b> — monte um vetor com as letras e passe a posição ou o dado. Não precisa sair em ordem. Não esqueça o <code>join</code> depois de criar todas.",
      resolucao:"<p>O enunciado esconde a armadilha mais comum de pthreads: <b>passar o endereço da variável do laço</b>. <code>pthread_create(&amp;t[i], NULL, imprime, &amp;i)</code> entrega a <i>mesma</i> posição de memória a todas as threads, e o laço continua mudando o valor. Saem letras repetidas e letras faltando, diferente a cada execução.</p><p>A correção é passar o endereço de algo que <b>não muda</b>: uma posição do próprio vetor de letras, ou uma entrada de um vetor de argumentos com uma posição por thread.</p><p>O <code>join</code> vai num <b>segundo laço</b>, depois de criar todas. Criar-e-esperar dentro do mesmo laço executa uma thread de cada vez: o programa fica correto e totalmente sequencial.</p>",
      cod:"char letras[26];\npthread_t t[26];\n\nfor (int i = 0; i < 26; i++) letras[i] = 'A' + i;\n\nfor (int i = 0; i < 26; i++)\n    pthread_create(&t[i], NULL, imprime, &letras[i]);   /* posicao fixa */\n\nfor (int i = 0; i < 26; i++)                            /* join DEPOIS */\n    pthread_join(t[i], NULL);\n\n/* ERRADO: &i e' a mesma variavel para todas, e ela muda\n   pthread_create(&t[i], NULL, imprime, &i);            */",
      ver:["processos", "POSIX Threads na prática"]
    },
    {
      n:"2",
      t:"Soma de dois vetores índice-a-índice",
      enunciado:"Algoritmo paralelo que soma dois vetores de inteiros posição a posição, guardando o resultado no primeiro vetor.",
      resolucao:"<p>É um <b>map</b> puro: a iteração <i>i</i> só lê e escreve a posição <i>i</i>. Não há dependência entre iterações nem região crítica — cada thread escreve em posições que mais ninguém toca, então não precisa de mutex nenhum.</p><p>Divida em <b>faixas contíguas</b> (thread 0 pega [0, n/p), thread 1 pega [n/p, 2n/p)…), não intercaladas. Faixas contíguas seguem a memória e aproveitam a linha de cache; intercalar (thread t pega i, i+p, i+2p…) faz as threads disputarem as mesmas linhas, que é falso compartilhamento.</p><p>Se <code>n</code> não divide por <code>p</code>, a última thread leva o resto — ou distribua o resto uma unidade por thread, que balanceia melhor.</p>",
      cod:"typedef struct { int ini, fim; } Faixa;\n\nvoid *soma(void *arg) {\n    Faixa *f = arg;\n    for (int i = f->ini; i < f->fim; i++)\n        a[i] = a[i] + b[i];        /* so' a posicao i: sem corrida */\n    return NULL;\n}\n\nfor (int t = 0; t < P; t++) {\n    faixa[t].ini = t * n / P;\n    faixa[t].fim = (t + 1) * n / P;\n    pthread_create(&th[t], NULL, soma, &faixa[t]);\n}\nfor (int t = 0; t < P; t++) pthread_join(th[t], NULL);",
      ver:["padroes", "Fork/Join"]
    },
    {
      n:"3",
      t:"Soma do vetor sem variável compartilhada",
      enunciado:"Algoritmo paralelo que soma todos os elementos de um vetor de inteiros. <b>Não</b> use variáveis compartilhadas entre as threads: cada thread tem a sua própria variável de acumulação, e só depois que todas terminam é que o valor final é obtido.",
      resolucao:"<p>É exatamente o padrão <b>fork/join com somas parciais</b>, e é o programa <code>forkjoin.c</code> que está publicado na matéria: cada thread acumula na própria <code>struct</code>, e o pai soma as parciais <b>depois dos joins</b>.</p><p>Por que o enunciado insiste em não compartilhar: um <code>total += v[i]</code> compartilhado precisaria de mutex a cada elemento — n travamentos. Com acumulador local são <b>p</b> somas no fim, e nenhuma trava durante o laço. É a mesma ideia do <code>reduction</code> do OpenMP, escrita à mão.</p><p>Compare com a questão 3 do laboratório de Exclusão Mútua, que pede o contrário de propósito — para você medir a diferença.</p>",
      ver:["padroes", "Fork/Join"]
    },
    {
      n:"4",
      t:"(Teórica) FIFO × Round Robin com uma thread rápida e uma lenta",
      enunciado:"Num sistema com duas threads, uma rápida e outra lenta, como o sistema se comporta se o escalonamento for (a) FIFO e (b) Round Robin?",
      resolucao:"<p><b>(a) FIFO</b> — sem preempção: quem pega a CPU roda até terminar. Tudo depende da ordem de chegada. Se a <b>lenta chega primeiro</b>, a rápida fica esperando o tempo inteiro dela: o tempo de resposta da rápida explode, mesmo ela precisando de pouca CPU. É o <b>efeito comboio</b>. Em compensação não há troca de contexto nenhuma, então o <i>throughput</i> total é o melhor possível e o comportamento é previsível.</p><p><b>(b) Round Robin</b> — cada thread recebe um quantum e é preemptada. A rápida termina em poucos quanta e sai do sistema; a lenta continua. O tempo médio de resposta cai muito, e nenhuma thread fica refém da outra. O preço são as <b>trocas de contexto</b>, que não existiam no FIFO.</p><p>O tamanho do quantum decide tudo: grande demais e o Round Robin vira FIFO; pequeno demais e o custo da troca passa a dominar o tempo útil.</p>",
      ver:["processos", "Escalonamento: FIFO x Round Robin"]
    }
  ]
},
{
  id:"lab-exclusao",
  mod:"exclusao",
  nome:"Laboratório: Exclusão Mútua",
  atividade:"Lab_ExclusaoMutua.pdf",
  conteudo:"PPC_03-ExclusaoMutua.pdf",
  questoes:[
    {
      n:"1",
      t:"1000 incrementam, 1000 decrementam — sem corrida",
      enunciado:"Programa com 1000 threads que incrementam um número e 1000 que decrementam o mesmo número, como visto em sala. Implemente a versão <b>sem a condição de corrida</b>.",
      resolucao:"<p>O valor certo é <b>0</b>: são 1000 somas e 1000 subtrações sobre o mesmo número. Sem proteção quase nunca dá zero, porque <code>n++</code> não é uma operação — são três (ler, somar, escrever) e duas threads podem ler o mesmo valor antes de qualquer uma escrever.</p><p>A correção é cercar o incremento e o decremento com o <b>mesmo</b> mutex. Tem de ser o mesmo: dois mutexes diferentes protegem nada. É o programa <code>travar.c</code> da matéria.</p><p>Alternativa mais barata, já que a região crítica é uma única operação: <code>__atomic_fetch_add(&amp;n, 1, __ATOMIC_SEQ_CST)</code> — uma instrução do processador, sem trava de software.</p>",
      cod:"pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;\nlong n = 0;\n\nvoid *mais(void *a) { pthread_mutex_lock(&m); n++; pthread_mutex_unlock(&m); return NULL; }\nvoid *menos(void *a){ pthread_mutex_lock(&m); n--; pthread_mutex_unlock(&m); return NULL; }\n\n/* 2000 threads depois: n == 0, sempre */",
      ver:["exclusao", "Por que contador++ não é atômico"]
    },
    {
      n:"2",
      t:"Uma thread por letra, imprimindo em ordem",
      enunciado:"Programa com mutexes/semáforos/monitores que cria uma thread para cada letra do alfabeto. As threads compartilham uma variável <code>letra</code>; depois de imprimir, a thread <b>incrementa</b> para a próxima letra, que será impressa pela próxima thread.",
      resolucao:"<p><b>Exclusão mútua não resolve esta questão.</b> Um mutex garante que só uma thread mexe na variável por vez, mas não diz <i>qual</i> entra primeiro — a ordem continua sendo a do escalonador. O que o enunciado pede é <b>sincronização por ordem</b>, que é um problema diferente.</p><p>Duas soluções corretas:</p><p><b>Variável de condição:</b> cada thread sabe a sua posição e espera num <code>while (letra != minha) pthread_cond_wait(&amp;c, &amp;m);</code>. Imprime, incrementa e faz <code>pthread_cond_broadcast</code>. O <code>while</code> (e não <code>if</code>) é obrigatório: despertar não garante que é a sua vez.</p><p><b>Cadeia de semáforos</b>, mais simples: um semáforo por letra, o primeiro em 1 e o resto em 0. Cada thread espera o seu, imprime e libera o do vizinho. Sem espera ocupada e sem broadcast acordando 25 threads à toa.</p>",
      cod:"sem_t s[26];\n\nsem_init(&s[0], 0, 1);                      /* so' a primeira comeca liberada */\nfor (int i = 1; i < 26; i++) sem_init(&s[i], 0, 0);\n\nvoid *tarefa(void *arg) {\n    int i = *(int *) arg;\n    sem_wait(&s[i]);                        /* espera a sua vez */\n    printf(\"%c\", letra);\n    letra++;                                /* so' esta thread mexe agora */\n    if (i + 1 < 26) sem_post(&s[i + 1]);    /* libera o proximo */\n    return NULL;\n}",
      ver:["exclusao", "Exclusão mútua não resolve ordem"]
    },
    {
      n:"3",
      t:"Soma do vetor COM variável compartilhada",
      enunciado:"Algoritmo paralelo que soma todos os elementos de um vetor de inteiros. Desta vez use uma <b>variável compartilhada</b> para computar o resultado final, em vez de calcular antes as somas parciais de cada thread.",
      resolucao:"<p>É o oposto da questão 3 do laboratório anterior, e é de propósito: o resultado é o mesmo, o desempenho não.</p><p>Com a variável compartilhada, cada elemento do vetor custa um <code>lock</code>/<code>unlock</code>: são <b>n</b> travamentos, e as threads passam o tempo enfileiradas no mesmo mutex. Com acumulador local são <b>p</b> travamentos, um por thread, no fim.</p><p>Meça os dois e compare — é comum a versão com variável compartilhada ficar <b>mais lenta que a serial</b>, porque além de travar ela ainda paga a coerência de cache arrastando a linha do acumulador de um núcleo para outro. É o programa <code>contador.c</code> da prova prática.</p>",
      cod:"/* o que o enunciado pede */\nvoid *soma(void *arg) {\n    Faixa *f = arg;\n    for (int i = f->ini; i < f->fim; i++) {\n        pthread_mutex_lock(&m);\n        total += v[i];               /* n travamentos */\n        pthread_mutex_unlock(&m);\n    }\n    return NULL;\n}",
      ver:["exclusao", "Granularidade: o erro que faz o paralelo ficar mais lento"]
    },
    {
      n:"4",
      t:"Somar N inteiros lidos de um arquivo",
      enunciado:"Arquivo com N números inteiros armazenados. Programa multithread que calcule a soma de todos eles.",
      resolucao:"<p>Duas decisões importantes antes de criar thread nenhuma:</p><p><b>Leia o arquivo uma vez só, antes.</b> Um <code>FILE *</code> compartilhado tem posição interna própria: duas threads lendo do mesmo ponteiro embaralham os dados. E mesmo com trava, I/O de disco não ganha nada com paralelismo — o gargalo é o dispositivo. Carregue para um vetor e paralelize o <b>cálculo</b>.</p><p>Se o arquivo não couber na memória, aí sim cada thread abre o <b>seu próprio</b> <code>FILE *</code> e usa <code>fseek</code> para a sua faixa — nunca o mesmo descritor.</p><p>Com o vetor em mãos, é a questão 3 do laboratório de processos: faixa por thread, acumulador local, soma das parciais depois dos joins.</p>",
      cod:"/* 1. leitura serial, uma vez */\nFILE *f = fopen(\"numeros.txt\", \"r\");\nlong n = 0;\nwhile (fscanf(f, \"%d\", &v[n]) == 1) n++;\nfclose(f);\n\n/* 2. soma paralela por faixas, com acumulador local */\nvoid *parcial(void *arg) {\n    Faixa *fx = arg;\n    long s = 0;\n    for (long i = fx->ini; i < fx->fim; i++) s += v[i];\n    fx->soma = s;                     /* uma escrita, no fim */\n    return NULL;\n}",
      ver:["desempenho", "Entrada e saída em programas paralelos"]
    },
    {
      n:"5",
      t:"Frequência de uma palavra, com o arquivo particionado",
      enunciado:"Conte a frequência de uma palavra num arquivo de texto. O arquivo deve ser particionado em N segmentos, cada um processado por uma thread. Cada thread conta e imprime a sua frequência; no final o resultado total é computado e impresso, por meio de uma <b>variável compartilhada</b>. <i>(Não é tão simples quanto parece…)</i>",
      resolucao:"<p>O \"não é tão simples\" do enunciado é a <b>fronteira entre os segmentos</b>. Cortar o arquivo em N pedaços iguais parte palavras ao meio: se \"paralela\" cair metade no segmento 2 e metade no 3, uma thread vê \"para\" e a outra vê \"lela\" — e a ocorrência <b>some da contagem</b>. Quanto mais threads, mais fronteiras, e o resultado muda conforme o número de threads: o sintoma clássico.</p><p>Duas correções:</p><p><b>1. Esticar até o fim da palavra.</b> Cada segmento começa onde o anterior terminou e vai até o próximo separador depois do seu limite nominal. As fronteiras deixam de cair no meio de palavras.</p><p><b>2. Sobrepor.</b> Cada segmento lê (tamanho da palavra &minus; 1) bytes a mais do segmento seguinte, e descarta qualquer casamento que <b>comece</b> antes do seu início. Assim nenhuma ocorrência é contada duas vezes nem perdida.</p><p>O outro cuidado é o que conta como ocorrência: procurar a substring crua faz \"paralela\" casar dentro de \"paralelamente\". Exija separador antes e depois.</p><p>O total compartilhado é a parte fácil: cada thread soma <b>uma vez</b> a própria contagem sob mutex, no fim.</p>",
      cod:"/* fronteira: estica ate o fim da palavra corrente */\nlong ini = id * tam / N;\nlong fim = (id + 1) * tam / N;\n\nif (id > 0)       while (ini < tam && !separador(texto[ini]))   ini++;\nif (id < N - 1)   while (fim < tam && !separador(texto[fim]))   fim++;\n\nlong minha = conta(texto, ini, fim, palavra);\nprintf(\"thread %d: %ld\\n\", id, minha);\n\npthread_mutex_lock(&m);\ntotal += minha;                 /* uma soma por thread */\npthread_mutex_unlock(&m);"
    },
    {
      n:"6",
      t:"(Demonstração) A variável de trava não funciona",
      enunciado:"Demonstre que a solução de exclusão mútua com <b>variável de trava</b> não funciona. Dica: simule uma ordem de escalonamento que gere uma condição de corrida em que um dos valores previamente salvos no vetor seja sobrescrito.",
      resolucao:"<p>O código é <code>while (trava == 1); trava = 1; /* região crítica */ trava = 0;</code> e o defeito está entre a primeira e a segunda linha: <b>testar e marcar são dois passos</b>, e o escalonador pode entrar no meio.</p><p>O traço que prova — duas threads, trava começando em 0:</p><p>Nenhuma das duas fez nada de errado. As duas leram <code>trava == 0</code> antes de qualquer uma escrever 1, e as duas entraram. Se a região crítica for <code>v[i] = meu_valor; i++;</code>, as duas escrevem no mesmo <code>i</code> e um dos valores é perdido — que é exatamente o que a dica manda mostrar.</p><p>A conclusão: a solução só funcionaria se <b>testar-e-marcar fosse uma operação única e indivisível</b>. É isso que a instrução <code>TSL</code>/<code>xchg</code> do processador faz, e é sobre ela que mutex e semáforo são construídos. Peterson resolve sem instrução especial, ao custo de espera ocupada.</p>",
      cod:"T1                          T2                    trava\n--------------------------------------------------------\nle trava (0)  -> passa                                0\n                            le trava (0) -> passa     0\n                            trava = 1                 1\n                            ENTRA na regiao critica   1\ntrava = 1                                             1\nENTRA na regiao critica                               1\n--------------------------------------------------------\n      as duas dentro ao mesmo tempo: exclusao quebrada",
      ver:["exclusao", "Soluções que NÃO funcionam"]
    }
  ]
},
{
  id:"lab-padroes",
  mod:"padroes",
  nome:"Laboratório: Padrões de Projeto Concorrente",
  atividade:"Lab_PadroesProjetoConcorrente.pdf",
  conteudo:"PPC_04-PadroesProjetoConcorrente.pdf",
  intro:"As sete questões são os padrões que a prova prática cobra. Cada resolução aponta para o programa completo correspondente na matéria — todos compilam e a saída publicada é a de uma execução real.",
  questoes:[
    {
      n:"1",
      t:"Quatro threads imprimem CAFE",
      enunciado:"Programa com 4 threads que imprime a palavra <b>CAFE</b>, havendo apenas uma thread imprimindo cada letra (<code>threadC</code>, <code>threadA</code>, <code>threadF</code>, <code>threadE</code>).",
      resolucao:"<p>O que se pede é <b>ordem total</b> entre quatro threads, e a ferramenta é uma <b>cadeia de semáforos</b>: um por letra, o primeiro iniciado em 1 e os demais em 0. Cada thread espera o seu semáforo, imprime e libera o da letra seguinte.</p><p>Mutex sozinho não serve: ele garante que só uma imprime por vez, não <i>qual</i>. A saída sairia EFAC, AFCE, qualquer coisa.</p><p>É o mesmo mecanismo da questão 2 do laboratório de Exclusão Mútua — ali com 26 letras, aqui com 4.</p>",
      cod:"sem_t sC, sA, sF, sE;\n\nsem_init(&sC, 0, 1);    /* C comeca liberada */\nsem_init(&sA, 0, 0);\nsem_init(&sF, 0, 0);\nsem_init(&sE, 0, 0);\n\nvoid *threadC(void *x){ sem_wait(&sC); printf(\"C\"); sem_post(&sA); return NULL; }\nvoid *threadA(void *x){ sem_wait(&sA); printf(\"A\"); sem_post(&sF); return NULL; }\nvoid *threadF(void *x){ sem_wait(&sF); printf(\"F\"); sem_post(&sE); return NULL; }\nvoid *threadE(void *x){ sem_wait(&sE); printf(\"E\"); return NULL; }\n\n/* a ordem de criacao das threads nao importa: a cadeia decide */",
      ver:["padroes", "Dormir e acordar"]
    },
    {
      n:"2",
      t:"Cinco threads imprimindo AAAAABBBBB",
      enunciado:"Cinco threads executam <code>write(\"A\")</code> … <code>write(\"B\")</code>. Implemente de forma que a saída seja <b>sempre</b> <code>AAAAABBBBB</code>.",
      resolucao:"<p>Não é ordem entre threads, é um <b>ponto de encontro</b>: todas precisam ter terminado o A antes de qualquer uma começar o B. Isso é uma <b>barreira</b> no meio da thread — e é exatamente a API que a questão 4 manda implementar.</p><p>Sem a barreira a saída sai intercalada (ABABAB…, AABABB…), porque nada impede a primeira thread de chegar ao B antes de a última chegar ao A.</p><p>Com semáforos: um contador protegido por mutex conta quem chegou; a thread que fecha a conta libera as outras. Note que só a <b>última</b> posta — as demais ficam bloqueadas.</p>",
      cod:"void *thread(void *arg) {\n    write(\"A\");\n\n    pthread_mutex_lock(&m);                 /* barreira */\n    chegaram++;\n    if (chegaram == 5) {\n        for (int i = 0; i < 4; i++) sem_post(&porta);   /* libera as outras */\n        pthread_mutex_unlock(&m);\n    } else {\n        pthread_mutex_unlock(&m);\n        sem_wait(&porta);\n    }\n\n    write(\"B\");\n    return NULL;\n}",
      ver:["padroes", "Barreiras"]
    },
    {
      n:"3",
      t:"Pipeline de estatísticas: soma, média, variância, desvio",
      enunciado:"Pipeline que computa soma, média, variância e desvio-padrão de uma lista de números, com <b>uma thread para cada</b> estatística. A média reutiliza o valor calculado pela thread de soma, e a variância espera o cálculo da média. Use a struct <code>tarefa_t</code> dada no enunciado.",
      resolucao:"<p>É o padrão <b>pipeline</b>: a dependência de dados define a ordem. Cada etapa espera um semáforo postado pela anterior — soma → média → variância → desvio.</p><p><b>A observação que vale a nota:</b> com <i>um único</i> vetor não existe paralelismo real aqui. As quatro etapas são sequenciais por dependência, e as threads passam o tempo esperando umas pelas outras — o programa fica mais lento que a versão serial, por causa do custo de criar e sincronizar as threads.</p><p>O pipeline só ganha quando há <b>vários conjuntos de dados em fluxo</b>: enquanto a variância trabalha no vetor 1, a soma já processa o vetor 2. Aí as quatro etapas rodam ao mesmo tempo, em dados diferentes, e o ganho tende ao número de estágios.</p><p>É o programa <code>pipeline.c</code> da matéria.</p>",
      cod:"typedef struct {\n    float *vetor; int tamanho;\n    float soma, media, variancia, desvio_padrao;\n} tarefa_t;\n\nsem_t pronto_soma, pronto_media, pronto_var;\n\nvoid *t_soma(void *a){ tarefa_t *t=a;\n    for (int i=0;i<t->tamanho;i++) t->soma += t->vetor[i];\n    sem_post(&pronto_soma); return NULL; }\n\nvoid *t_media(void *a){ tarefa_t *t=a;\n    sem_wait(&pronto_soma);\n    t->media = t->soma / t->tamanho;\n    sem_post(&pronto_media); return NULL; }\n\nvoid *t_var(void *a){ tarefa_t *t=a;\n    sem_wait(&pronto_media);\n    for (int i=0;i<t->tamanho;i++) {\n        float d = t->vetor[i] - t->media;\n        t->variancia += d * d;\n    }\n    t->variancia /= t->tamanho;\n    sem_post(&pronto_var); return NULL; }\n\nvoid *t_desvio(void *a){ tarefa_t *t=a;\n    sem_wait(&pronto_var);\n    t->desvio_padrao = sqrtf(t->variancia); return NULL; }",
      ver:["padroes", "Pipeline"]
    },
    {
      n:"4",
      t:"API de barreira com semáforos",
      enunciado:"Implemente uma API de barreiras usando semáforos, com <code>inicializar_barreira(barreira_t *b, int N)</code>, <code>esperar_barreira(barreira_t *b)</code> e <code>destruir_barreira(barreira_t *b)</code>.",
      resolucao:"<p>A struct guarda N, quantas já chegaram, um mutex para o contador e um semáforo onde as threads dormem. Em <code>esperar_barreira</code>: trava, incrementa; se ainda não chegou a N, destrava e dorme; se chegou, libera N&minus;1 vezes, zera o contador e segue.</p><p><b>A armadilha é o reuso.</b> Se a barreira for usada dentro de um laço, uma thread rápida pode dar a volta e chegar à barreira de novo antes de as lentas saírem da primeira — e ela consome um <code>post</code> que não era dela. A solução clássica é a <b>barreira de duas fases</b> (<i>turnstile</i>): dois semáforos, um que segura na entrada e outro na saída, garantindo que todas saíram antes de qualquer uma reentrar.</p><p>É o programa <code>barreira.c</code> da matéria.</p>",
      cod:"typedef struct {\n    int n, chegaram;\n    pthread_mutex_t m;\n    sem_t porta;\n} barreira_t;\n\nvoid inicializar_barreira(barreira_t *b, int N) {\n    b->n = N; b->chegaram = 0;\n    pthread_mutex_init(&b->m, NULL);\n    sem_init(&b->porta, 0, 0);\n}\n\nvoid esperar_barreira(barreira_t *b) {\n    pthread_mutex_lock(&b->m);\n    b->chegaram++;\n    if (b->chegaram == b->n) {\n        b->chegaram = 0;                                  /* pronta para a proxima */\n        for (int i = 0; i < b->n - 1; i++) sem_post(&b->porta);\n        pthread_mutex_unlock(&b->m);\n    } else {\n        pthread_mutex_unlock(&b->m);                      /* solta ANTES de dormir */\n        sem_wait(&b->porta);\n    }\n}\n\nvoid destruir_barreira(barreira_t *b) {\n    pthread_mutex_destroy(&b->m);\n    sem_destroy(&b->porta);\n}",
      ver:["padroes", "Barreiras"]
    },
    {
      n:"5",
      t:"Corrigir a starvation no Jantar dos Filósofos",
      enunciado:"A solução vista em sala para o deadlock do Jantar dos Filósofos tem o problema de <b>starvation</b>: existem filósofos que não estão bloqueados mas nunca são executados. Corrija esse problema.",
      resolucao:"<p>Na solução com <code>testa(i)</code>, um filósofo come sempre que os dois vizinhos não estão comendo. Com dois vizinhos se revezando, o do meio pode <b>nunca</b> encontrar os dois parados ao mesmo tempo: não há deadlock (o sistema progride) mas ele passa fome. Deadlock e starvation são problemas diferentes — veja a matéria de deadlocks.</p><p>Duas correções usuais:</p><p><b>Estado faminto com prioridade.</b> Acrescente o estado FAMINTO e impeça um filósofo de comer duas vezes seguidas enquanto um vizinho estiver faminto. O vizinho deixa de ser ultrapassado indefinidamente.</p><p><b>Fila FIFO.</b> Quem pede os garfos entra numa fila e é atendido em ordem de chegada. Garante ausência de starvation por construção, ao custo de menos paralelismo.</p><p>O programa <code>filosofos.c</code> e a animação do jantar mostram a solução sem deadlock; a correção da starvation é a camada a mais pedida aqui.</p>",
      ver:["deadlocks", "Deadlock x starvation"]
    },
    {
      n:"6",
      t:"Leitores e escritores com prioridade para o escritor",
      enunciado:"A solução vista em aula para leitores e escritores sempre posterga as escritas enquanto houver leitores. Corrija implementando o algoritmo que privilegia os escritores (Courtois, Heymans e Parnas, 1971).",
      resolucao:"<p>Na primeira solução, um leitor que chega enquanto outros leem entra direto. Com leitores chegando continuamente, o contador nunca zera e o escritor <b>nunca</b> escreve: é starvation do escritor.</p><p>A segunda solução de Courtois acrescenta um semáforo que <b>barra a entrada de novos leitores</b> assim que o primeiro escritor chega. Os leitores que já estão dentro terminam, o contador zera, o escritor entra. Com isso a espera do escritor passa a ser limitada.</p><p>O preço é simétrico: agora são os <b>leitores</b> que podem passar fome se houver escritores chegando sem parar. Não existe versão \"justa para os dois\" sem uma fila explícita — e essa troca é a resposta que a questão quer ouvir.</p><p>É o programa <code>leitores.c</code> da matéria.</p>",
      ver:["padroes", "Leitores e escritores"]
    },
    {
      n:"7",
      t:"Barbeiro sonolento",
      enunciado:"Simule a barbearia: sala de espera com N cadeiras e uma cadeira de barbear; sem clientes, o barbeiro dorme; o cliente que chega o acorda; se o barbeiro está ocupado, o cliente senta (se houver cadeira) ou <b>vai embora</b>. Cada cliente é uma thread, e o barbeiro também.",
      resolucao:"<p>Três semáforos e um contador: <code>clientes</code> (onde o barbeiro dorme), <code>barbeiros</code> (onde o cliente espera ser atendido), <code>mutex</code> protegendo <code>esperando</code>.</p><p>O cliente trava o mutex, olha <code>esperando</code>: se for menor que N, incrementa, posta <code>clientes</code> (acorda o barbeiro), destrava e espera <code>barbeiros</code>. Se a sala estiver cheia, destrava e <b>desiste</b> — o <code>return</code> é parte do enunciado.</p><p><b>A armadilha que só aparece rodando:</b> se todos os clientes desistirem, o barbeiro fica dormindo para sempre em <code>sem_wait(&amp;clientes)</code> e o programa não termina. É preciso um <b>sentinela de fechamento</b>: a main, depois do join de todos os clientes, marca a barbearia como fechada e posta <code>clientes</code> uma vez para o barbeiro acordar e sair. Foi assim que o <code>barbeiro.c</code> publicado na matéria travou na primeira versão.</p>",
      ver:["padroes", "Barbeiro sonolento"]
    }
  ]
},
{
  id:"lab-deadlocks",
  mod:"deadlocks",
  nome:"Laboratório: Deadlocks",
  atividade:"Lab_Deadlocks.pdf",
  conteudo:"PPC_05-Deadlock.pdf",
  questoes:[
    {
      n:"1",
      t:"Detecção com 4 processos e 5 tipos de recurso",
      enunciado:"Considere o estado de sistema com quatro processos P1…P4 e cinco tipos de recurso RS1…RS5. Mostre que há deadlock usando o algoritmo de detecção apresentado em classe.",
      resolucao:"<p><b>Atenção:</b> a tabela com o estado do sistema <b>não saiu no PDF</b> — o texto diz \"considere o seguinte estado abaixo\" e vem um espaço em branco. Pegue a matriz da sua cópia impressa; o método é o mesmo, só mudam os números.</p><p><b>O algoritmo</b>, com E = recursos existentes, A = disponíveis, C = alocação corrente e R = requisições:</p><p><b>1.</b> Procure uma linha <i>i</i> não marcada em R cuja requisição seja <b>≤ A</b> em todas as colunas.<br><b>2.</b> Se achar: esse processo pode terminar. Some a linha <i>i</i> de C em A (ele devolve o que tinha), marque a linha e volte ao passo 1.<br><b>3.</b> Se não achar nenhuma, as linhas <b>não marcadas</b> são os processos em <b>deadlock</b>.</p><p>O que prova o deadlock não é um processo travado: é sobrar linha não marcada quando nenhuma requisição cabe no disponível. A matéria traz o algoritmo aplicado passo a passo nos números da prova, e a animação mostra as marcações acontecendo.</p>",
      ver:["deadlocks", "Algoritmo de detecção"]
    },
    {
      n:"2",
      t:"Quais ordens de requisição são livres de deadlock",
      enunciado:"A e B precisam cada um das entradas 1, 2 e 3. Se os dois pedirem nessa ordem, não há deadlock; se B pedir na ordem 3, 2, 1, pode haver. Com três recursos há 3! ordens possíveis por processo. <b>Quais combinações estão livres de deadlock?</b>",
      resolucao:"<p>São 6 ordens para A e 6 para B: <b>36 combinações</b>. Destas, <b>12 são livres de deadlock</b> — exatamente aquelas em que <b>A e B pedem o mesmo recurso primeiro</b>.</p><p><b>Por que o primeiro recurso basta:</b> se os dois disputam o mesmo recurso logo de saída, um ganha e o outro bloqueia <b>sem ter nada na mão</b>. Um processo bloqueado que não segura recurso nenhum não pode fazer parte de uma espera circular — então o vencedor roda até o fim, devolve tudo, e só então o outro começa.</p><p>Se os primeiros pedidos forem diferentes, cada um consegue o seu e já existe intercalação que fecha o ciclo. Exemplo com A = (1,2,3) e B = (2,1,3): A pega 1, B pega 2, A pede 2 (de B), B pede 1 (de A) — deadlock.</p><p>Fixando A = (1,2,3), as ordens seguras de B são <b>(1,2,3) e (1,3,2)</b>: 2 das 6. Note que basta coincidir o primeiro; as ordens não precisam ser idênticas.</p><p>É a prevenção por <b>ordenação de recursos</b> — a mesma regra prática de \"trave sempre os mutexes na mesma ordem\".</p>",
      cod:"as 12 combinacoes livres de deadlock (A, B):\n\n   123-123   123-132   132-123   132-132      <- comecam por 1\n   213-213   213-231   231-213   231-231      <- comecam por 2\n   312-312   312-321   321-312   321-321      <- comecam por 3\n\nas outras 24 admitem uma intercalacao que trava.\n(verificado por varredura de todos os 36 pares e de\n todos os entrelacamentos possiveis de cada par)",
      ver:["deadlocks", "Como atacar cada condição"]
    },
    {
      n:"3",
      t:"Condição para o sistema nunca entrar em deadlock",
      enunciado:"Num sistema com <b>p</b> processos, cada um podendo requisitar no máximo <b>m</b> recursos de um total de <b>t</b> existentes, qual é a condição necessária para que o sistema seja sempre livre de deadlocks?",
      resolucao:"<p><b>t ≥ p · (m &minus; 1) + 1</b></p><p><b>O raciocínio:</b> o pior caso é todo mundo chegar perto do fim sem conseguir terminar. Um processo que já tem os <i>m</i> recursos de que precisa termina e devolve tudo — então o pior caso é cada processo segurando <b>m &minus; 1</b> e esperando o último. Isso dá <b>p(m &minus; 1)</b> recursos presos.</p><p>Se existir <b>pelo menos mais um</b> recurso além desses, algum processo consegue o seu <i>m</i>-ésimo, termina, devolve os <i>m</i> e desbloqueia os outros em cascata. Daí o <b>+1</b>.</p><p>Confira nos extremos: com m = 1 a condição vira t ≥ 1 — nunca há deadlock, porque ninguém espera segurando algo. Com p = 1 vira t ≥ m, que é só ter recurso suficiente para o único processo.</p>",
      cod:"exemplo: p = 3 processos, m = 2 recursos cada\n\n   t >= 3 * (2 - 1) + 1 = 4\n\ncom t = 3: cada processo pega 1 e pede o segundo -> deadlock\ncom t = 4: alguem consegue os 2, termina e devolve -> sempre sai",
      ver:["deadlocks", "Condição para nunca haver deadlock"]
    },
    {
      n:"4",
      t:"(Programação) Algoritmo do banqueiro",
      enunciado:"Implemente o algoritmo do banqueiro. Entrada: um arquivo com uma matriz n × 2 (coluna 0 = itens em posse do processo, coluna 1 = máximo que ele pode requisitar) e a quantidade N de recursos disponíveis. O programa pergunta qual processo <i>p</i> faz a requisição e quantos recursos pede, e imprime se o estado resultante é <b>seguro</b> ou não.",
      resolucao:"<p>É o banqueiro com <b>um único tipo de recurso</b>, que é a versão mais simples: vetores em vez de matrizes.</p><p>A requisição é concedida <b>provisoriamente</b> (posse += pedido, disponível −= pedido) e então se testa se o estado é seguro. Se não for, desfaz.</p><p><b>O teste de segurança:</b> procure um processo cuja necessidade restante (máximo − posse) caiba no disponível. Se achar, finja que ele termina e devolve tudo (disponível += posse). Repita. Se conseguir terminar <b>todos</b>, existe uma sequência segura e o estado é seguro. Se empacar com processos de fora, é inseguro.</p><p>Duas recusas antes do teste: pedir mais do que o próprio máximo é erro do processo; pedir mais do que o disponível faz ele esperar.</p><p>Estado inseguro <b>não</b> é deadlock — é um estado do qual o deadlock passa a ser possível. O banqueiro recusa por precaução. A matéria traz o exemplo resolvido com os números da prova.</p>",
      cod:"int seguro(int n, int posse[], int maximo[], int disp) {\n    int terminou[n], feitos = 0;\n    for (int i = 0; i < n; i++) terminou[i] = 0;\n\n    int mudou = 1;\n    while (mudou) {\n        mudou = 0;\n        for (int i = 0; i < n; i++) {\n            if (terminou[i]) continue;\n            if (maximo[i] - posse[i] <= disp) {    /* cabe no disponivel */\n                disp += posse[i];                  /* ele termina e devolve */\n                terminou[i] = 1; feitos++; mudou = 1;\n            }\n        }\n    }\n    return feitos == n;                            /* todos terminaram? */\n}\n\n/* requisicao de p por k recursos */\nposse[p] += k; disp -= k;\nif (!seguro(n, posse, maximo, disp)) {\n    posse[p] -= k; disp += k;                      /* desfaz */\n    puts(\"estado INSEGURO: requisicao negada\");\n} else puts(\"estado seguro: requisicao concedida\");",
      ver:["deadlocks", "Algoritmo do Banqueiro"]
    }
  ]
},
{
  id:"lab-petri",
  mod:"petri",
  nome:"Laboratório: Modelagem com Redes de Petri",
  atividade:"Lab_RedesPetri.pdf",
  conteudo:"PPC_06-RedesPetri.pdf",
  intro:"As duas questões estão resolvidas na matéria e na animação <b>Jantar dos filósofos em Petri</b>, que mostra os três modelos lado a lado — o que trava e os dois que previnem o deadlock.",
  questoes:[
    {
      n:"1",
      t:"Três modelos do Jantar dos Filósofos em Redes de Petri",
      enunciado:"Modele o Jantar dos Filósofos com Redes de Petri, em três versões: <b>(a)</b> cada garfo é um recurso e o filósofo pega primeiro o da esquerda, depois o da direita (implementação errada); <b>(b)</b> cada filósofo pega 2 garfos de um <i>pool</i> (prevenção atacando posse-e-espera); <b>(c)</b> cada garfo é um recurso pego em ordem (prevenção atacando a espera circular).",
      resolucao:"<p><b>(a) O modelo que trava.</b> Um lugar por garfo (1 ficha cada) e, por filósofo, duas transições em sequência: <i>pega esquerdo</i> e <i>pega direito</i>. Entre elas há um lugar intermediário \"com um garfo na mão\". É esse lugar que materializa a <b>posse-e-espera</b>: se todos os filósofos dispararem a primeira transição, todos os lugares de garfo zeram e nenhuma segunda transição fica habilitada. A rede fica sem transição habilitada nenhuma — <b>deadlock</b>.</p><p><b>(b) Pool de garfos.</b> Um único lugar com N fichas e uma transição que consome <b>2 de uma vez</b> (arco de peso 2). Ou o filósofo pega os dois, ou não pega nada: não existe estado intermediário com um garfo na mão, e a posse-e-espera desaparece. O preço é perder a identidade dos garfos — o modelo deixa de impedir que vizinhos comam juntos, a menos que se acrescente essa restrição.</p><p><b>(c) Ordem total.</b> Mantém os garfos individuais, mas o último filósofo pega o <b>direito antes do esquerdo</b>. Basta um invertido para quebrar o ciclo: o grafo de espera deixa de ter um caminho fechado e a <b>espera circular</b> é impossível.</p>",
      ver:["petri", "Jantar dos filósofos: os três modelos"]
    },
    {
      n:"2",
      t:"Provar com árvores de alcançabilidade",
      enunciado:"Usando árvores de alcançabilidade, prove que suas implementações do item anterior estão livres (ou não) de deadlocks.",
      resolucao:"<p>A árvore parte da marcação inicial e ramifica em cada transição habilitada, até que toda folha seja repetida (marcação já vista), coberta por ω, ou <b>morta</b>.</p><p><b>O que você procura é a folha morta:</b> uma marcação alcançável sem nenhuma transição habilitada. Ela é a prova do deadlock — e, ao contrário de rodar o programa várias vezes, é uma prova <b>exaustiva</b>: se não existe folha morta na árvore, não existe deadlock, ponto.</p><p><b>(a)</b> A árvore chega à marcação em que todo lugar de garfo está vazio e todo filósofo está no lugar intermediário. Nenhuma transição habilitada: folha morta, deadlock provado.</p><p><b>(b) e (c)</b> Todas as folhas são marcações repetidas — a rede sempre volta a um estado já visto, portanto sempre há como progredir. Sem folha morta: livres de deadlock.</p><p>Cuidado ao concluir: a árvore prova ausência de <b>deadlock</b>, não de <b>starvation</b>. Um filósofo pode nunca comer e a rede continuar viva — é a questão 5 do laboratório de Padrões.</p>",
      ver:["petri", "Árvore de alcançabilidade"]
    }
  ]
},
{
  id:"lista-hardware",
  mod:"hardware",
  nome:"Lista: Hardware Paralelo",
  atividade:"PPC-HardwareParalelo 1.pdf",
  conteudo:"PPC_07-HardwareParalelo.pdf",
  intro:"Lista de cálculo — três das cinco questões estão resolvidas passo a passo na matéria, nos tópicos marcados como <i>exemplo resolvido</i>.",
  questoes:[
    {
      n:"1",
      t:"Pipeline de 5 estágios de 10 ns",
      enunciado:"O processador tem pipeline de 5 estágios (Fetch, Decode, Execute, Mem-Read, Reg-Write), cada um com 10 ns de ciclo. <b>(a)</b> Qual o tempo para encher o pipeline? <b>(b)</b> Qual o tempo de execução do ciclo com o pipeline cheio? <b>(c)</b> Repita (a) e (b) com o Mem-Read durando 20 ns. <b>(d)</b> Qual o ganho em relação a uma implementação sem pipeline?",
      resolucao:"<p><b>(a)</b> Encher = a primeira instrução atravessar os 5 estágios: <b>5 × 10 = 50 ns</b>. A partir daí todos os estágios têm trabalho.</p><p><b>(b)</b> Com o pipeline cheio sai <b>uma instrução a cada 10 ns</b> — o ciclo é o de um estágio, não o da instrução inteira. A latência de cada instrução continua 50 ns; o que mudou foi a <b>vazão</b>.</p><p><b>(c)</b> O ciclo do pipeline é ditado pelo <b>estágio mais lento</b>: todos passam a valer 20 ns, porque os outros quatro ficam esperando o Mem-Read. Encher: <b>5 × 20 = 100 ns</b>. Com o pipeline cheio: <b>uma instrução a cada 20 ns</b>. Metade do desempenho anterior por causa de um único estágio — é por isso que se quebra o estágio lento em dois.</p><p><b>(d)</b> Sem pipeline, uma instrução ocupa a máquina inteira por 50 ns (caso original). Com pipeline sai uma a cada 10 ns: <b>ganho 5×</b>, que é o número de estágios. No caso (c): sem pipeline 4×10 + 20 = 60 ns por instrução, com pipeline 20 ns → <b>ganho 3×</b>.</p><p>Para <i>n</i> instruções o ganho real é 50n / (50 + 10(n−1)), que só tende a 5 quando <i>n</i> é grande — e isso ignorando bolhas.</p>",
      cod:"          (a) encher   (b) com o pipeline cheio   (d) ganho\noriginal   5 x 10 = 50ns      1 instr / 10ns              5x\nMem=20ns   5 x 20 = 100ns     1 instr / 20ns              3x\n\no ciclo do pipeline = o estagio MAIS LENTO\n  original: max(10,10,10,10,10) = 10ns\n  item (c): max(10,10,10,20,10) = 20ns",
      ver:["hardware", "Pipeline de instruções"]
    },
    {
      n:"2",
      t:"Cache: multiplicação matriz-vetor por linhas e por colunas",
      enunciado:"Dois laços que fazem <code>y[i] += A[i][j] * x[j]</code>, um percorrendo por linhas e outro por colunas. <b>(a)</b> Como uma matriz maior e uma cache maior afetam os dois pares de laços? <b>(b)</b> O que acontece com MAX = 8, cache de 4 linhas e cada linha guardando 4 doubles? <b>(c)</b> Quantos <i>misses</i> de leitura de A em cada par de laços, com mapeamento direto?",
      resolucao:"<p>Em C a matriz é guardada <b>por linhas</b>. O par (1) percorre A na ordem da memória; o par (2) pula MAX doubles a cada acesso.</p><p><b>(a)</b> <b>Cache maior</b> melhora os dois, e muito mais o par (2): a partir do ponto em que uma coluna inteira cabe na cache, o segundo laço para de expulsar o que vai reusar. <b>Matriz maior</b> piora os dois, mas o par (1) degrada suavemente (continua lendo em sequência) enquanto o (2) desaba assim que a matriz passa do tamanho da cache.</p><p><b>(b)</b> A tem 8×8 = 64 doubles = <b>16 linhas de memória</b> (4 doubles cada), e a cache guarda <b>4 linhas</b> = 16 doubles. A matriz é 4 vezes maior que a cache. No par (1) cada linha trazida é usada nos 4 acessos seguintes antes de sair. No par (2) a linha trazida é expulsa muito antes de o laço voltar a ela.</p><p><b>(c) Par (1), por linhas: 16 misses.</b> Lê-se A[0][0..7], A[1][0..7]… em sequência; cada uma das 16 linhas de memória entra na cache uma vez e serve 4 acessos. 16 misses e 48 acertos.</p><p><b>Par (2), por colunas: 64 misses</b> — um por acesso. Para j fixo, A[i][j] fica na linha de memória 2i + j/4; com i = 0…7 isso dá as linhas 0, 2, 4, 6, 8, 10, 12, 14, que no mapeamento direto (linha mod 4) caem só nos conjuntos 0 e 2. As linhas se expulsam antes de qualquer reuso: nenhum acerto.</p><p><b>4 vezes mais misses</b> com o mesmo número de operações, a mesma matriz e a mesma cache. Só mudou a ordem dos dois laços.</p>",
      cod:"A: 8 x 8 doubles = 64 doubles = 16 linhas de memoria\ncache: 4 linhas x 4 doubles = 16 doubles, mapeamento direto\n\nPOR LINHAS (par 1)\n  acessos na ordem da memoria: linha 0,0,0,0, 1,1,1,1, 2,...\n  cada linha entra uma vez e serve 4 acessos\n  -> 16 misses, 48 acertos\n\nPOR COLUNAS (par 2)\n  j fixo, i = 0..7  ->  linha de memoria 2i + j/4\n  j=0: linhas 0,2,4,6,8,10,12,14  ->  mod 4 = 0,2,0,2,0,2,0,2\n  cada acesso expulsa o anterior do mesmo conjunto\n  -> 64 misses, 0 acertos",
      ver:["hardware", "Cache e localidade"]
    },
    {
      n:"3",
      t:"Por que cache grande + muitas threads pode degradar",
      enunciado:"Por que a performance de um processador multithread pode <b>degradar</b> se ele tiver cache grande e executar muitas threads?",
      resolucao:"<p>Porque a cache é <b>compartilhada</b> e cada thread tem o seu conjunto de dados ativos. Com muitas threads, a cache efetiva por thread é o tamanho total dividido pelo número delas — e cada troca de contexto traz os dados da thread nova expulsando os da anterior. É a <b>poluição de cache</b>: a thread volta a executar e não encontra mais nada do que tinha deixado.</p><p>O \"cache grande\" piora de duas formas. Primeiro, cache grande é cache <b>mais lenta</b>: mais linhas para comparar, latência de acerto maior. Se o programa não aproveita o tamanho, paga a latência sem receber a taxa de acerto. Segundo, quanto maior o conjunto de trabalho que cabe, maior o volume que cada troca de contexto invalida.</p><p>Some a isso a <b>coerência</b>: mais threads escrevendo em linhas próximas significa mais invalidações entre núcleos, e o falso compartilhamento aparece sem que haja qualquer dado realmente compartilhado.</p><p>Conclusão prática: além de certo ponto, acrescentar threads aumenta o trabalho de memória mais do que o trabalho útil — e o tempo total sobe.</p>",
      ver:["hardware", "Cache e muitas threads"]
    },
    {
      n:"4",
      t:"Como uma máquina SIMD paralelizaria o laço",
      enunciado:"Como uma máquina SIMD iria paralelizar <code>y[i] += a * x[i]; sum += z[i] * z[i];</code> dentro de um laço de 0 a n?",
      resolucao:"<p>SIMD é <b>uma instrução operando sobre vários dados</b>. Em vez de iterar elemento a elemento, a máquina processa blocos de <i>W</i> elementos por instrução (W = 4 doubles num registrador de 256 bits, 8 num de 512).</p><p><b>A primeira linha é SIMD perfeita.</b> <code>y[i] += a * x[i]</code> é a operação AXPY: carrega W elementos de x, multiplica todos pelo escalar <i>a</i> replicado, soma aos W de y e guarda. Nenhuma dependência entre elementos.</p><p><b>A segunda linha é uma redução</b>, e aí está o detalhe da questão: <code>sum</code> é um escalar que todas as iterações atualizam. A máquina não acumula num escalar — ela mantém um <b>acumulador vetorial</b> com W somas parciais independentes e, no fim do laço, faz uma <b>redução horizontal</b> somando as W faixas entre si.</p><p>As duas contas são independentes, então ficam no mesmo laço vetorizado. Sobra o <b>resto</b>: se n não é múltiplo de W, as últimas n mod W iterações rodam escalares (ou com máscara).</p><p>Uma consequência que vale citar: a redução vetorial soma em ordem diferente da serial, e em ponto flutuante <b>o resultado pode diferir nos últimos dígitos</b>. É por isso que o compilador só vetoriza reduções de float com <code>-ffast-math</code> ou com a diretiva explícita do OpenMP.</p>",
      cod:"serial                        SIMD (W = 4 doubles)\n---------------------------------------------------------\nfor (i=0;i<n;i++) {           va = broadcast(a)\n  y[i] += a * x[i];           vsum = {0,0,0,0}\n  sum  += z[i] * z[i];\n}                             for (i=0;i+4<=n;i+=4) {\n                                vy = load(y+i)\n                                vx = load(x+i)\n                                store(y+i, vy + va*vx)\n\n                                vz = load(z+i)\n                                vsum = vsum + vz*vz   <- 4 parciais\n                              }\n                              sum = vsum[0]+vsum[1]+vsum[2]+vsum[3]\n                              for (; i<n; i++) { ... }   /* resto */",
      ver:["hardware", "Taxonomia de Flynn"]
    },
    {
      n:"5",
      t:"10¹² instruções em 1000 processadores: o custo da mensagem",
      enunciado:"Um programa precisa de 10<sup>12</sup> instruções e um sistema de um processador o resolve em 10<sup>6</sup> s (~12 dias), ou seja 10<sup>6</sup> instruções/s. Paralelizado em memória distribuída com p processadores, cada um executa 10<sup>12</sup>/p instruções e envia 10<sup>9</sup>(p−1) mensagens. <b>(a)</b> Com 10<sup>−9</sup> s por mensagem e p = 1000, quanto tempo leva? <b>(b)</b> E com 10<sup>−3</sup> s por mensagem?",
      resolucao:"<p><b>A computação é a mesma nos dois casos:</b> 10<sup>12</sup>/1000 = 10<sup>9</sup> instruções por processador, a 10<sup>6</sup> instruções/s → <b>1000 s</b>.</p><p>As mensagens: 10<sup>9</sup> × (1000 − 1) = <b>9,99 × 10<sup>11</sup></b> mensagens por processador.</p><p><b>(a)</b> 9,99 × 10<sup>11</sup> × 10<sup>−9</sup> = <b>999 s</b> de comunicação. Total ≈ 1000 + 999 = <b>~2000 s</b>, contra 10<sup>6</sup> s do serial: ganho de <b>~500×</b> com 1000 processadores (eficiência 0,5 — metade do tempo é comunicação).</p><p><b>(b)</b> 9,99 × 10<sup>11</sup> × 10<sup>−3</sup> = <b>~10<sup>9</sup> s</b>. Total ≈ 10<sup>9</sup> s, que é <b>mil vezes pior que o serial</b> — cerca de 30 anos contra 12 dias.</p><p>A lição: mesmo algoritmo, mesma máquina, mesmo número de processadores. O que decidiu entre ganhar 500× e perder 1000× foi só a <b>latência da rede</b>. Em memória distribuída, o custo da comunicação não é um detalhe de implementação — é o que define se vale a pena paralelizar.</p>",
      ver:["hardware", "Quando a comunicação mata o ganho"]
    }
  ]
},
{
  id:"lab-desempenho",
  mod:"desempenho",
  nome:"Laboratório: Projeto e Análise de Programas Paralelos",
  atividade:"PPC-Lab-ProjetoAnaliseProgramasParalelos.pdf",
  conteudo:"PPC_08-ProjetoAnaliseProgramasParalelos.pdf",
  intro:"Há duas versões do PDF na pasta: a segunda (<code>…ProgramasParalelos 1.pdf</code>) acrescenta a questão de Gustafson. As duas estão cobertas abaixo.",
  questoes:[
    {
      n:"1",
      t:"Ganhos e eficiências de T<sub>serial</sub> = n² e T<sub>paralelo</sub> = n²/p + log₂p",
      enunciado:"<b>(a)</b> Escreva um programa que encontre os ganhos e eficiências para diversos valores de n e p. <b>(b)</b> Rode para n = 10, 20, 40, 80, 160, 320 e p = 1, 2, 4, 8, 16, 32, 64, 128. O que acontece quando p aumenta e n fica fixo? E quando p é fixo e n aumenta?",
      resolucao:"<p>S = n² / (n²/p + log₂p) e E = S/p = n² / (n² + p·log₂p). A segunda forma é a que explica tudo: a eficiência só depende da razão entre <b>n²</b> e <b>p·log₂p</b>.</p><p><b>Com n fixo e p crescendo</b>, o ganho sobe mas cada vez menos, e a eficiência <b>cai sempre</b> — p·log₂p cresce mais rápido que p, então o denominador engole o ganho. Com n = 10 e p = 128, E já é 0,08: 92% da máquina desperdiçada. É a <b>escalabilidade forte</b>, e este programa não a tem.</p><p><b>Com p fixo e n crescendo</b>, a eficiência <b>sobe e tende a 1</b>: n² cresce muito mais rápido que o overhead log₂p, que nem depende de n. Com p = 8, a eficiência vai de 0,77 (n = 10) a 0,9997 (n = 320).</p><p>Juntando as duas: o programa é <b>fracamente escalável</b>. Para manter a eficiência ao dobrar p, basta aumentar n o suficiente — e como o overhead é logarítmico, um aumento modesto de n já resolve.</p><p>No programa, cuidado com o <code>log</code> de C: <code>log()</code> é natural, e log₂p = <code>log(p)/log(2)</code> ou <code>log2(p)</code>. E compile com <code>-lm</code>.</p>",
      cod:"eficiencia E = n^2 / (n^2 + p*log2(p))\n\n  n\\p      1      2      4      8     16     32     64    128\n ----------------------------------------------------------------\n   10   1,000  0,980  0,926  0,806  0,610  0,385  0,207  0,082\n   20   1,000  0,995  0,980  0,944  0,865  0,719  0,510  0,251\n   40   1,000  0,999  0,995  0,986  0,963  0,909  0,804  0,601\n   80   1,000  1,000  0,999  0,996  0,991  0,975  0,941  0,865\n  160   1,000  1,000  1,000  0,999  0,998  0,994  0,984  0,961\n  320   1,000  1,000  1,000  1,000  0,999  0,998  0,996  0,990\n\nler na horizontal: p cresce, n fixo   -> eficiencia CAI\nler na vertical:   n cresce, p fixo   -> eficiencia SOBE"
    },
    {
      n:"2",
      t:"Derivar o ganho linear da Lei de Gustafson",
      enunciado:"Derive uma expressão para o ganho linear da Lei de Gustafson vista em aula. <i>(questão presente só na segunda versão do PDF)</i>",
      resolucao:"<p>Gustafson parte de uma premissa diferente da de Amdahl: o que é fixo não é o <b>tamanho do problema</b>, é o <b>tempo</b>. Mede-se a execução <b>paralela</b> e pergunta-se quanto ela levaria em um processador.</p><p>Seja o tempo paralelo normalizado em 1, com fração serial <b>f</b> e fração paralela <b>1 − f</b>:</p><p>T<sub>paralelo</sub> = f + (1 − f) = 1</p><p>Em um único processador, a parte serial continua custando f, mas a parte paralela, que p processadores fizeram em (1 − f), custaria <b>p(1 − f)</b>:</p><p>T<sub>serial</sub> = f + p(1 − f)</p><p><b>S = f + p(1 − f) = p − f(p − 1)</b></p><p>É <b>linear em p</b>, com inclinação (1 − f) — por isso \"ganho escalonado\". Com f = 0,05 e p = 1000, Gustafson dá S = 950, enquanto Amdahl dá no máximo 20.</p><p>Não há contradição: Amdahl responde \"quanto mais rápido fica <b>este</b> problema\" e Gustafson responde \"que problema <b>maior</b> consigo resolver no mesmo tempo\". A fração serial de Gustafson é medida sobre a execução paralela e <b>encolhe</b> quando o problema cresce; a de Amdahl é fixa.</p>",
      ver:["desempenho", "Lei de Gustafson"]
    },
    {
      n:"3",
      t:"Overhead crescendo mais devagar (ou mais rápido) que T<sub>serial</sub>",
      enunciado:"Com T<sub>paralelo</sub> = T<sub>serial</sub>/p + T<sub>overhead</sub> e p fixo, aumentando o tamanho do problema: <b>(a)</b> demonstre que se T<sub>overhead</sub> cresce mais devagar que T<sub>serial</sub>, a eficiência aumenta; <b>(b)</b> demonstre que se cresce mais rápido, a eficiência diminui.",
      resolucao:"<p>Partindo das definições:</p><p>S = T<sub>serial</sub> / T<sub>paralelo</sub> = T<sub>serial</sub> / (T<sub>serial</sub>/p + T<sub>oh</sub>)</p><p>E = S/p = T<sub>serial</sub> / (T<sub>serial</sub> + p·T<sub>oh</sub>)</p><p>Dividindo numerador e denominador por T<sub>serial</sub>:</p><p><b>E = 1 / (1 + p · T<sub>oh</sub>/T<sub>serial</sub>)</b></p><p>Com p fixo, E depende <b>apenas</b> da razão r = T<sub>oh</sub>/T<sub>serial</sub>, e é <b>estritamente decrescente</b> em r (a derivada dE/dr = −p/(1+pr)² é negativa). Toda a demonstração se reduz a ver o que acontece com r.</p><p><b>(a)</b> Se T<sub>oh</sub> cresce mais devagar que T<sub>serial</sub>, então r <b>diminui</b> quando o problema cresce. Como E decresce com r, E <b>aumenta</b>. ∎</p><p><b>(b)</b> Se T<sub>oh</sub> cresce mais rápido, r <b>aumenta</b> e portanto E <b>diminui</b>. ∎</p><p>No limite: se r → 0, E → 1 (eficiência perfeita); se r → ∞, E → 0. É esse o conteúdo da escalabilidade fraca — e a razão de existirem problemas que só compensa paralelizar a partir de certo tamanho.</p>",
      ver:["desempenho", "Fontes de overhead"]
    },
    {
      n:"4",
      t:"Fator de balanceamento de duas implementações",
      enunciado:"Duas implementações com 4 threads. Implementação A: 4, 3, 7 e 5 s. Implementação B: 1, 8, 4 e 6 s. <b>(a)</b> Calcule o fator de balanceamento de cada uma. <b>(b)</b> Qual é a mais rápida?",
      resolucao:"<p>Fator de balanceamento = T<sub>médio</sub> / T<sub>máximo</sub>, e quanto mais perto de 1, menos thread parada.</p><p><b>Implementação A:</b> soma 4+3+7+5 = 19, média 4,75, máximo <b>7</b>.<br>fator = 4,75 / 7 = <b>0,679</b></p><p><b>Implementação B:</b> soma 1+8+4+6 = 19, média 4,75, máximo <b>8</b>.<br>fator = 4,75 / 8 = <b>0,594</b></p><p><b>(b) A é a mais rápida: 7 s contra 8 s.</b> A região paralela só acaba quando a <b>última</b> thread acaba — há uma barreira no fim. O tempo é o máximo, nunca a soma nem a média.</p><p>Repare que as duas fazem <b>exatamente o mesmo trabalho</b>: 19 s·thread. A diferença é só a distribuição. A capacidade comprada é 4 × 8 = 32 s·thread em B, das quais 13 viram espera (41% da máquina ociosa); em A são 4 × 7 = 28, com 9 de espera (32%).</p><p>O fator de balanceamento ordena corretamente as duas, o que é o ponto da questão: a de maior fator é a mais rápida, com o mesmo trabalho total.</p>",
      cod:"              threads          soma  media  maximo   fator   tempo\n  ------------------------------------------------------------------\n  A        4, 3, 7, 5          19   4,75     7     0,679     7 s\n  B        1, 8, 4, 6          19   4,75     8     0,594     8 s\n\n  mesmo trabalho (19 s.thread), tempos diferentes:\n  o que muda e' so' a distribuicao",
      ver:["desempenho", "Balanceamento de carga"]
    },
    {
      n:"5",
      t:"Quanto aumentar n para manter a eficiência",
      enunciado:"Com T<sub>serial</sub> = n ns e T<sub>paralelo</sub> = n/p + log₂(p) µs, se aumentarmos p por um fator k, encontre uma fórmula para o quanto devemos aumentar n a fim de manter a eficiência constante. Por quanto devemos aumentar n ao dobrar de 8 para 16 processos? O programa é escalável?",
      resolucao:"<p><b>Primeiro, as unidades</b> — é onde a questão derruba. T<sub>serial</sub> está em <b>ns</b> e o overhead em <b>µs</b>. Passando tudo para ns: T<sub>paralelo</sub> = n/p + 1000·log₂(p).</p><p>E = T<sub>serial</sub> / (p · T<sub>paralelo</sub>) = n / (n + 1000·p·log₂p)</p><p>Manter E constante ao trocar p por kp exige:</p><p>n / (p·log₂p) = n′ / (kp·log₂(kp))</p><p><b>n′ = n · k · log₂(kp) / log₂(p)</b></p><p><b>De p = 8 para p = 16</b> (k = 2): n′ = n · 2 · log₂16/log₂8 = n · 2 · 4/3 = <b>n · 8/3 ≈ 2,67 n</b>.</p><p>Ou seja: dobrar os processos exige aumentar o problema em <b>2,67 vezes</b>, não em 2. O programa <b>é escalável</b> — existe um crescimento finito de n que segura a eficiência, e é isso que define a escalabilidade fraca.</p><p>Mas é <b>fracamente</b> escalável, e com um porém: como n precisa crescer mais que p, o trabalho por processador aumenta a cada duplicação. O fator k·log₂(kp)/log₂(p) tende a k quando p cresce, então o excesso vai diminuindo — de 8 para 16 o fator é 2,67; de 1024 para 2048 já é 2,18.</p>",
      cod:"n' / n = k * log2(k*p) / log2(p)\n\n  de p=8 para p=16  (k=2):  2 * 4/3   = 2,67\n  de p=16 para p=32 (k=2):  2 * 5/4   = 2,50\n  de p=32 para p=64 (k=2):  2 * 6/5   = 2,40\n  de p=1024 p/ 2048 (k=2):  2 * 11/10 = 2,20\n\nsempre acima de 2, mas tendendo a 2: escalabilidade fraca",
      ver:["desempenho", "Escalabilidade forte e fraca"]
    }
  ]
},
{
  id:"lista-openmp",
  mod:"openmp",
  nome:"Lista: OpenMP",
  atividade:"PPC-OpenMP 1.pdf",
  conteudo:"PPC_09-OpenMP.pdf",
  intro:"A lista é um roteiro de <b>7 passos</b> aplicado a <b>7 algoritmos</b>. Todos estão resolvidos na matéria, cada um com o programa completo e a tabela medida com 1, 2, 4 e 8 threads numa máquina de 8 núcleos lógicos.",
  questoes:[
    {
      n:"—",
      t:"Os 7 passos, que valem para todos os algoritmos",
      enunciado:"Para cada algoritmo: <b>1.</b> implemente serial; <b>2.</b> meça o tempo com entrada grande; <b>3.</b> paralelize com OpenMP/MPI; <b>4.</b> meça o paralelo com a mesma entrada; <b>5.</b> obtenha o ganho; <b>6.</b> obtenha a eficiência; <b>7.</b> avalie a escalabilidade repetindo 4–6 com mais threads — forte ou fracamente escalável?",
      resolucao:"<p>Três detalhes decidem a nota, e nenhum deles está no enunciado:</p><p><b>T<sub>serial</sub> é o melhor algoritmo serial</b>, não o paralelo com uma thread. O algoritmo 4 existe para ensinar isso.</p><p><b>Uma medição não vale.</b> Descarte uma execução de aquecimento (a primeira paga cache fria e alocação de páginas) e fique com o melhor de várias.</p><p><b>Eficiência caindo é resultado</b>, não erro. O que se cobra é explicar por quê: overhead, memória saturada, desbalanceamento ou trabalho a mais.</p><p>Use <code>omp_get_wtime()</code>, nunca <code>clock()</code> — este soma o tempo de todas as threads e <i>cresce</i> com o paralelismo.</p>",
      ver:["openmp", "A lista de OpenMP: os 7 passos"]
    },
    {
      n:"1",
      t:"Monte Carlo para aproximar π",
      enunciado:"Implemente e paralelize o algoritmo de Monte Carlo para aproximação de π.",
      resolucao:"<p>Sorteia pontos no quadrado e conta os que caem no quarto de círculo: π ≈ 4·dentro/n. Um <code>reduction(+:dentro)</code> resolve a contagem.</p><p><b>A pegadinha é o gerador.</b> <code>rand()</code> guarda estado interno compartilhado: não é thread-safe e, nas versões em que é, serializa numa trava interna. Cada thread precisa do seu próprio estado e da sua própria semente.</p><p><b>Medido:</b> ganho 4,97× com 8 threads, eficiência 0,62 — o que melhor escala da lista, porque cada iteração é pura CPU.</p>",
      ver:["openmp", "Algoritmo 1 — Monte Carlo"]
    },
    {
      n:"2 e 3",
      t:"Média e desvio-padrão",
      enunciado:"A média de um conjunto de números e, em seguida, o desvio-padrão (que precisa da variância, que por sua vez precisa da média calculada na questão anterior).",
      resolucao:"<p>Duas reduções de soma, em <b>dois laços separados</b> — o desvio precisa da média pronta, então não dá para juntar numa passagem só.</p><p><b>Erro de fórmula que o próprio enunciado induz:</b> a variância é a <b>média</b> dos quadrados dos desvios. A soma tem de ser dividida por N antes da raiz; sem o /N o \"desvio\" cresce com o tamanho do vetor.</p><p><b>Medido:</b> ~4,3× e ~3,9× com 8 threads (eficiência ~0,5). O limite aqui não é a CPU, é a <b>largura de banda da memória</b>: pouca conta por elemento e o vetor inteiro lido. Mais threads não criam mais banda.</p>",
      ver:["openmp", "Algoritmos 2 e 3"]
    },
    {
      n:"4",
      t:"Série de potências 1/(1−x) = Σ xᵏ",
      enunciado:"A série de potências f(x) = 1/(1−x) = Σ x<sup>k</sup>. Converge para −1 &lt; x &lt; 1; teste com k = 10/100/1000.",
      resolucao:"<p><b>O algoritmo mais instrutivo da lista.</b> A forma natural usa recorrência (termo *= x), que é dependência carregada pelo laço e não paraleliza. Para paralelizar é preciso trocar por <code>pow(x,k)</code>, tornando os termos independentes.</p><p>A tabela dá ganho de <b>4,07×</b> com 8 threads. <b>E é uma mentira:</b> a medição foi contra a versão com <code>pow</code>, que já é 15× mais lenta que a recorrência (0,61 s contra 0,039 s). Contra o melhor algoritmo serial, o paralelo com 8 threads roda a <b>0,26×</b> — quatro vezes mais lento.</p><p>A resposta correta para este algoritmo é <b>não paralelizar</b>, e registrar o porquê: paralelizar exigiu trocar o algoritmo, e o algoritmo novo faz muito mais trabalho.</p>",
      ver:["openmp", "Algoritmo 4 — série geométrica"]
    },
    {
      n:"5",
      t:"Série de potências de eˣ",
      enunciado:"A série e<sup>x</sup> = Σ x<sup>k</sup>/k!.",
      resolucao:"<p>Há de novo uma recorrência (termo *= x/k), mas aqui a conclusão é <b>oposta à do algoritmo 4</b>: como se avalia e<sup>x</sup> para muitos valores de x, basta paralelizar o laço <b>de fora</b>. Cada iteração calcula uma série inteira, com a recorrência intacta dentro dela.</p><p><b>A regra geral:</b> antes de quebrar uma recorrência, procure um laço mais externo para paralelizar. É mais barato e mais preciso.</p><p><b>Medido:</b> ganho 3,69× com 8 threads; erro de 5×10<sup>−15</sup> contra a <code>exp()</code> da biblioteca com 40 termos.</p>",
      ver:["openmp", "Algoritmo 5 — e^x"]
    },
    {
      n:"6 e 7",
      t:"f(x) = 1/(1−eˣ) e a integral de −1 a 1",
      enunciado:"Avaliar a função f(x) = 1/(1−e<sup>x</sup>) e calcular a integral definida dela de −1 a 1.",
      resolucao:"<p>São um <b>map</b> e um <b>map + reduction</b>, sem dependência nenhuma. O cuidado aqui não é de concorrência, é <b>numérico</b>.</p><p>Em x = 0 temos e<sup>0</sup> = 1 e o denominador zera: f tem um <b>polo</b>, e o intervalo de integração passa por ele. A integral comum diverge; o que existe é o <b>valor principal de Cauchy</b>, que vale exatamente <b>1</b>.</p><p>A regra do <b>ponto médio</b> avalia em a + (i+0,5)h e nunca cai em x = 0 — por isso encontra esse valor (o programa dá 0,99999998). Trapézio ou Simpson avaliam nas bordas, acertam o zero e a soma inteira vira <code>inf</code> ou <code>nan</code>.</p><p><b>Medido:</b> o 6 dá 3,97× e o 7 dá 3,17× com 8 threads. No 6, com <b>1 thread</b> o ganho é 0,76 — a versão OpenMP é mais lenta que a serial, porque abrir a região paralela custa e o <code>reduction</code> impede otimizações que o laço serial recebe.</p>",
      ver:["openmp", "Algoritmos 6 e 7"]
    }
  ]
}
];
