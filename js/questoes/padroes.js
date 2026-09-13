/* ─── Padrões de Projeto Concorrente ────────────────────────
   P1 · 37 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"pp01a", mod:"padroes", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(a)",
  enunciado:"Explique o padrão de projeto concorrente <b>Fork/Join</b>.",
  chaves:[
    ["divide o trabalho (fork)","divide","fork","dividir","cria n"],
    ["executa em paralelo","paralelo","simultaneamente","ao mesmo tempo"],
    ["espera todos terminarem (join)","espera","join","aguarda","esperar"],
    ["fork() / pthread_create()","pthread_create","fork()","criar threads","criação"],
    ["wait() / pthread_join()","pthread_join","wait()"],
    ["combina com redução","reduç","resultado parcial","parciais","combina","mestre"]
  ],
  gabarito:"O fluxo principal <b>divide</b> (fork) o trabalho criando N fluxos que executam em paralelo, e depois <b>espera</b> (join) todos terminarem antes de seguir.<br><br>É o padrão base de toda a disciplina: <code>fork()</code> + <code>wait()</code> para processos, <code>pthread_create()</code> + <code>pthread_join()</code> para threads.<br><br>Combina naturalmente com <b>redução</b>: cada thread produz um resultado parcial numa variável privada e o mestre combina tudo depois do join — sem região crítica nenhuma."
},
{
  id:"pp01b", mod:"padroes", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(b)",
  enunciado:"Explique o padrão <b>Travar &amp; Destravar</b>.",
  chaves:[
    ["protege a região crítica","região crítica","seção crítica"],
    ["trava antes de entrar","antes","adquire","trava antes"],
    ["destrava depois de sair","depois","libera","destrava","solta"],
    ["lock / sem_wait","lock","sem_wait","travar","down"],
    ["unlock / sem_post","unlock","sem_post","destravar","up"],
    ["riscos: esquecer de destravar, deadlock, granularidade","esquecer","deadlock","granularidade","serializ"]
  ],
  gabarito:"Proteger uma região crítica adquirindo uma trava <b>antes</b> de entrar e liberando <b>depois</b> de sair: <code>lock</code>/<code>unlock</code>, <code>sem_wait</code>/<code>sem_post</code>.<br><br>É o padrão da <b>exclusão mútua</b>.<br><br><b>Riscos:</b> esquecer de destravar (o programa trava para sempre); travar dois recursos em ordens diferentes em threads diferentes (deadlock); e usar granularidade grossa demais, o que serializa o programa e mata o paralelismo."
},
{
  id:"pp01c", mod:"padroes", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(c)",
  enunciado:"Explique o padrão <b>Dormir e Acordar</b>.",
  chaves:[
    ["evita a espera ocupada","espera ocupada","busy wait","busy-wait","espera ativa"],
    ["a thread se bloqueia (sleep)","bloquei","dorme","sleep","dormir"],
    ["e é acordada por outra (wakeup)","acorda","wakeup","acordad","despert"],
    ["economiza CPU","economiza","poupa","não gasta cpu","sai da fila","libera a cpu"],
    ["problema do sinal perdido","sinal perdido","lost wakeup","perde o sinal","aviso se perde","acorda antes"],
    ["o semáforo guarda o sinal no contador","contador","guarda o sinal","while","variável de condição","atomicamente"]
  ],
  gabarito:"Em vez de espera ocupada, a thread que não pode prosseguir se <b>bloqueia</b> (<code>sleep</code>) e é <b>acordada</b> por outra (<code>wakeup</code>) quando a condição muda. Economiza CPU, porque a thread bloqueada sai da fila do escalonador.<br><br><b>Problema clássico — o sinal perdido (<i>lost wakeup</i>):</b> se o <code>wakeup</code> chega <i>antes</i> de a thread conseguir dormir, o aviso se perde e ela dorme para sempre.<br><br><b>Como se resolve:</b> o semáforo <b>guarda o sinal num contador</b> — um <code>post</code> anterior faz o <code>wait</code> seguinte passar direto. Com variáveis de condição, testa-se a condição num <code>while</code> sob a mesma trava que o <code>wait</code> libera atomicamente."
},
{
  id:"pp01d", mod:"padroes", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(d)",
  enunciado:"Explique o padrão <b>Despachante-Operário</b>.",
  chaves:[
    ["uma thread despachante distribui","despachante","dispatcher","distribui"],
    ["threads operárias fixas","operári","worker","trabalhador","conjunto fixo"],
    ["fila de tarefas","fila"],
    ["também chamado thread pool","thread pool","pool"],
    ["threads criadas uma vez e reaproveitadas","uma única vez","reaproveit","reutiliz","custo de criação","some o custo"],
    ["o pool limita a concorrência","limita","tamanho do pool","não vira 10"]
  ],
  gabarito:"Uma thread <b>despachante</b> recebe as tarefas e as distribui para um conjunto fixo de threads <b>operárias</b>, que ficam esperando numa fila. Também se chama <i>thread pool</i>.<br><br><b>Vantagens:</b><br>&bull; as threads são criadas <b>uma única vez</b> e reaproveitadas — some o custo de criação por tarefa;<br>&bull; o tamanho do pool <b>limita a concorrência</b>: 10 000 tarefas não viram 10 000 threads disputando a CPU.<br><br><b>Atenção:</b> a fila de tarefas continua sendo <b>região crítica</b> e precisa de proteção — tipicamente um produtor/consumidor com semáforos."
},
{
  id:"pp01e", mod:"padroes", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(e)",
  enunciado:"Explique o padrão <b>Pipeline</b>.",
  chaves:[
    ["tarefa quebrada em estágios sequenciais","estágio","estagio","etapas","fases"],
    ["cada estágio é uma thread","cada estágio","uma thread","thread por estágio"],
    ["melhora a vazão","vazão","throughput","produtividade"],
    ["no ritmo do estágio mais lento","mais lento","gargalo","estágio lento"],
    ["não melhora a latência de um item","latência","latencia","tempo de um item"]
  ],
  gabarito:"A tarefa é quebrada em <b>estágios sequenciais</b> e cada estágio vira uma thread. O dado atravessa os estágios enquanto novos dados entram no início.<br><br><b>O que melhora:</b> a <b>vazão</b> — com o pipeline cheio, sai um item completo a cada tempo do <b>estágio mais lento</b>, e não a cada soma de todos os estágios.<br><b>O que não melhora:</b> a <b>latência</b> de um item individual, que ainda precisa passar por todos os estágios.<br><br><i>Exemplo do laboratório:</i> soma &rarr; média &rarr; variância &rarr; desvio padrão, em que cada estágio consome o resultado do anterior. Otimizar um pipeline significa atacar o estágio gargalo."
},
{
  id:"pp01f", mod:"padroes", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(f)",
  enunciado:"Explique o padrão <b>Barreiras</b>.",
  chaves:[
    ["ponto de sincronização","sincroniz"],
    ["ninguém passa até que todas cheguem","todas cheguem","todas chegarem","esperar todas","até que todas","todas as threads"],
    ["separa fases do cálculo","fase","etapa","depende do resultado anterior"],
    ["contador protegido por mutex","contador","mutex","conta"],
    ["bloqueiam num semáforo e a última libera","semáforo","post","a última","libera"],
    ["custo: todas presas à thread mais lenta","mais lenta","nowait","desperdíci","custo"]
  ],
  gabarito:"Ponto de sincronização em que <b>nenhuma thread passa até que todas cheguem</b>.<br><br><b>Para que serve:</b> separar fases de um cálculo em que a fase seguinte depende do resultado que <b>todas</b> as threads produziram na fase anterior.<br><br><b>Como se implementa:</b> um contador protegido por mutex conta quem chegou; todas bloqueiam num semáforo iniciado em 0, e a última a chegar faz N&minus;1 <code>post</code>, liberando as demais.<br><br><b>Custo:</b> todas ficam limitadas à thread mais lenta — barreira desnecessária é desperdício puro. Em OpenMP, a cláusula <code>nowait</code> existe justamente para remover a barreira implícita quando ela não é necessária."
},
{
  id:"pp02", mod:"padroes", dif:"facil", tipo:"mc",
  fonte:"Slides · Padrões Concorrentes",
  enunciado:"Qual descrição corresponde ao padrão <b>Fork/Join</b>?",
  opcoes:[
    "O fluxo principal divide o trabalho criando vários fluxos paralelos e depois espera todos terminarem antes de prosseguir.",
    "Cada thread executa um estágio distinto e passa o resultado para a próxima.",
    "Uma thread distribui tarefas de uma fila para um conjunto fixo de threads operárias.",
    "Nenhuma thread avança até que todas cheguem ao mesmo ponto do código."
  ],
  correta:0,
  gabarito:"Fork/Join é o padrão base: <code>pthread_create()</code> em laço (fork) seguido de <code>pthread_join()</code> em laço (join). As outras alternativas descrevem, respectivamente, <b>pipeline</b>, <b>despachante-operário</b> e <b>barreira</b>."
},
{
  id:"pp03", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Slides · Padrões Concorrentes",
  enunciado:"Qual é a vantagem do padrão <b>despachante-operário</b> sobre criar uma nova thread para cada tarefa que chega?",
  opcoes:[
    "As threads são criadas uma só vez e reaproveitadas, eliminando o custo de criação/destruição por tarefa e limitando o número de threads simultâneas.",
    "Elimina completamente a necessidade de exclusão mútua no programa.",
    "Garante que as tarefas sejam processadas exatamente na ordem em que chegam.",
    "Permite que cada tarefa use mais memória do que caberia numa thread comum."
  ],
  correta:0,
  gabarito:"Criar thread custa caro (entrada no kernel, alocação de pilha). Com um <i>pool</i>, esse custo é pago uma vez. O pool também funciona como <b>controle de admissão</b>: 10 000 tarefas não viram 10 000 threads disputando a CPU. Cuidado com a alternativa (b): a <b>fila de tarefas continua sendo região crítica</b> e precisa de proteção — tipicamente um produtor/consumidor com semáforos."
},
{
  id:"pp04", mod:"padroes", dif:"medio", tipo:"vf",
  fonte:"Slides · Padrões Concorrentes",
  enunciado:"Um pipeline aumenta a vazão do sistema, mas não reduz — e pode até aumentar — o tempo de processamento de um item individual.",
  correta:0,
  gabarito:"<b>Verdadeiro.</b> Um item ainda precisa passar por todos os estágios, e ainda paga o custo de sincronização entre eles — a <b>latência</b> individual não melhora. O ganho é de <b>vazão</b>: com o pipeline cheio, sai um item completo a cada tempo do <b>estágio mais lento</b>, e não a cada soma de todos os estágios. É o mesmo raciocínio do pipeline de instruções do processador, cobrado no laboratório de Hardware Paralelo."
},
{
  id:"pp05", mod:"padroes", dif:"dificil", tipo:"mc",
  fonte:"Slides · Dormir e acordar",
  enunciado:"O que é o problema do <b>sinal perdido</b> (<i>lost wakeup</i>) no padrão dormir-e-acordar?",
  opcoes:[
    "O <code>wakeup</code> é enviado antes de a thread conseguir dormir; como o sinal não é guardado, ela dorme depois e nunca mais é acordada.",
    "Duas threads recebem o mesmo <code>wakeup</code> e ambas entram na região crítica.",
    "O sinal é entregue à thread errada por causa da máscara de sinais.",
    "A thread acorda sozinha antes da hora, sem ter recebido nenhum <code>wakeup</code>."
  ],
  correta:0,
  gabarito:"É o furo clássico da solução ingênua de produtor/consumidor: o consumidor testa o <i>buffer</i>, vê que está vazio e é preemptado <b>antes</b> de chamar <code>sleep()</code>; o produtor insere um item e chama <code>wakeup()</code>, que se perde porque ninguém estava dormindo; o consumidor então dorme para sempre. É por isso que o <b>semáforo guarda o sinal num contador</b> — um <code>sem_post</code> anterior faz o <code>sem_wait</code> seguinte passar direto. Com variáveis de condição, a proteção é testar a condição num <code>while</code> sob a mesma trava que o <code>wait</code> libera atomicamente."
},
{
  id:"pp06", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Slides · Produtor/Consumidor",
  enunciado:"Na solução do produtor/consumidor com buffer de N posições, quais semáforos são usados e com que valores iniciais?",
  opcoes:[
    "<code>vazio</code> = N (posições livres), <code>cheio</code> = 0 (itens disponíveis) e <code>mutex</code> = 1 (acesso ao buffer).",
    "<code>vazio</code> = 0, <code>cheio</code> = N e <code>mutex</code> = 0.",
    "Apenas um <code>mutex</code> = 1; os outros dois são desnecessários.",
    "<code>produtor</code> = 1 e <code>consumidor</code> = 1, alternando estritamente."
  ],
  correta:0,
  gabarito:"São três semáforos com papéis distintos: dois <b>de contagem</b> (<code>vazio</code> conta espaços livres, <code>cheio</code> conta itens prontos) e um <b>binário</b> para a exclusão mútua no buffer. O produtor faz <code>wait(vazio) &rarr; wait(mutex) &rarr; insere &rarr; post(mutex) &rarr; post(cheio)</code>; o consumidor é o espelho. Não confundir os papéis: os de contagem sincronizam <i>ordem/disponibilidade</i>, o mutex protege a <i>estrutura</i>."
},
{
  id:"pp07", mod:"padroes", dif:"dificil", tipo:"mc",
  fonte:"Slides · Produtor/Consumidor",
  enunciado:"No produtor/consumidor, o que acontece se o produtor inverter a ordem e fizer <code>sem_wait(&mutex)</code> antes de <code>sem_wait(&vazio)</code>?",
  cod:"/* ERRADO */                        /* CORRETO */\nsem_wait(&mutex);                  sem_wait(&vazio);\nsem_wait(&vazio);                  sem_wait(&mutex);\ninsere_item();                     insere_item();\nsem_post(&mutex);                  sem_post(&mutex);\nsem_post(&cheio);                  sem_post(&cheio);",
  opcoes:[
    "Deadlock quando o buffer enche: o produtor bloqueia em <code>vazio</code> segurando o <code>mutex</code>, e o consumidor não consegue o <code>mutex</code> para retirar um item e liberar espaço.",
    "Condição de corrida: dois produtores inserem no mesmo índice do buffer.",
    "Nada muda; a ordem dos <code>sem_wait</code> é irrelevante.",
    "O buffer passa a aceitar mais de N itens, corrompendo a memória."
  ],
  correta:0,
  gabarito:"Regra prática que vale para toda a P1: <b>nunca bloqueie num semáforo de condição segurando o mutex de exclusão</b>. Adquira sempre primeiro o semáforo de contagem (que pode fazer você esperar muito) e só depois o mutex (que é segurado por pouco tempo). É exatamente o mesmo erro da questão do banheiro na Prova Prática."
},
{
  id:"pp08", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Lab · Padrões Concorrentes, Q6",
  enunciado:"Qual é a limitação da solução vista em aula para o problema dos <b>leitores e escritores</b>?",
  opcoes:[
    "Ela sempre posterga as escritas enquanto houver leitores chegando: um fluxo contínuo de leitores causa <i>starvation</i> dos escritores.",
    "Ela permite que um escritor e um leitor acessem o dado ao mesmo tempo.",
    "Ela só funciona com no máximo dois leitores simultâneos.",
    "Ela provoca deadlock sempre que houver mais escritores do que leitores."
  ],
  correta:0,
  gabarito:"A solução simples dá <b>prioridade aos leitores</b>: enquanto o contador de leitores não zerar, o escritor não entra — e ele nunca zera se leitores continuarem chegando. Não é deadlock (os leitores progridem), é <b>starvation</b> do escritor. O Q6 do laboratório pede exatamente a correção: implementar o algoritmo de Courtois <i>et al.</i> (1971, <i>Concurrent control with readers and writers</i>) que privilegia os escritores, usando um semáforo adicional que bloqueia a entrada de <b>novos</b> leitores quando há escritor esperando."
},
{
  id:"pp09", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Slides · Barreiras",
  enunciado:"Como se implementa uma <b>barreira</b> para N threads usando semáforos?",
  opcoes:[
    "Um contador protegido por mutex conta as threads que chegaram; todas bloqueiam num semáforo inicializado em 0, e a N-ésima a chegar faz N&minus;1 <code>post</code> (ou libera um <i>turnstile</i> em cascata).",
    "Cada thread chama <code>sleep()</code> por um tempo fixo, calculado para que todas acordem juntas.",
    "Todas as threads travam o mesmo mutex e só a última o destrava.",
    "Um semáforo inicializado em N; cada thread faz <code>sem_wait</code> e a barreira abre quando ele chega a zero."
  ],
  correta:0,
  gabarito:"A estrutura é <code>{ int n_total, n_chegaram; sem_t mutex; sem_t porta; }</code>. Cada thread trava o mutex, incrementa <code>n_chegaram</code>, verifica se é a última; se não for, destrava e faz <code>sem_wait(&porta)</code>; se for, dá <code>sem_post(&porta)</code> N&minus;1 vezes. É a API pedida no Q4 do laboratório: <code>inicializar_barreira()</code>, <code>esperar_barreira()</code> e <code>destruir_barreira()</code>. Para reutilizar a barreira em várias fases é preciso zerar o contador com cuidado — o padrão de <b>duas fases</b> (<i>turnstile</i> duplo) evita que uma thread rápida atravesse a barreira duas vezes."
},
{
  id:"pp10", mod:"padroes", dif:"facil", tipo:"code",
  fonte:"Lab · Padrões Concorrentes, Q1",
  enunciado:"Escreva <b>apenas as 4 funções de thread</b> que imprimem a palavra <b>CAFE</b> — uma thread por letra, na ordem certa.",
  cod:"sem_t sA, sF, sE;    /* todos inicializados em 0 */\n\n/* o main inicializa os semaforos, cria as 4 threads em qualquer\n   ordem e espera todas com pthread_join */",
  chaves:["sem_wait","sem_post","printf"],
  modelo:"void *threadC(void *a) { printf(\"C\"); sem_post(&sA); return NULL; }\n\nvoid *threadA(void *a) { sem_wait(&sA); printf(\"A\"); sem_post(&sF); return NULL; }\n\nvoid *threadF(void *a) { sem_wait(&sF); printf(\"F\"); sem_post(&sE); return NULL; }\n\nvoid *threadE(void *a) { sem_wait(&sE); printf(\"E\"); return NULL; }",
  gabarito:"O padrão é a <b>cadeia de sinalização</b>: cada thread espera no seu semáforo e libera o da seguinte.<br><br>Dois detalhes que valem ponto:<br>&bull; todos os semáforos começam em <b>0</b> (fechados) e só a thread <code>C</code> não espera — é ela que dá a partida;<br>&bull; a última (<code>E</code>) não precisa liberar ninguém.<br><br>A ordem de <code>pthread_create()</code> é irrelevante, e é essa a graça: a corretude vem da sincronização, não da sorte do escalonador."
},
{
  id:"pp11", mod:"padroes", dif:"medio", tipo:"code",
  fonte:"Prova Prática · Questão 2",
  enunciado:"Escreva <b>apenas as funções de thread</b> que imprimem a palavra <b>BEBER</b>. Atenção: só pode haver <b>1 thread por letra</b> — não pode ter duas threads para os dois &lsquo;E&rsquo;, nem para os dois &lsquo;B&rsquo;.",
  cod:"/* BEBER = B E B E R  ->  5 letras, mas so 3 DISTINTAS.\n   Logo sao 3 threads: B imprime 2x, E imprime 2x, R imprime 1x. */\n\nsem_t vezB;   /* = 1, comeca liberada */\nsem_t vezE;   /* = 0 */\nsem_t vezR;   /* = 0 */",
  chaves:["sem_wait","sem_post","printf"],
  modelo:"void *threadB(void *a) {\n    sem_wait(&vezB); printf(\"B\"); sem_post(&vezE);   /* posicao 1 */\n    sem_wait(&vezB); printf(\"B\"); sem_post(&vezE);   /* posicao 3 */\n    return NULL;\n}\n\nvoid *threadE(void *a) {\n    sem_wait(&vezE); printf(\"E\"); sem_post(&vezB);   /* posicao 2 */\n    sem_wait(&vezE); printf(\"E\"); sem_post(&vezR);   /* posicao 4 */\n    return NULL;\n}\n\nvoid *threadR(void *a) {\n    sem_wait(&vezR); printf(\"R\\n\");                  /* posicao 5 */\n    return NULL;\n}",
  gabarito:"A pegadinha está no enunciado: BEBER tem <b>5 letras mas só 3 distintas</b>. Como não pode haver duas threads para o mesmo caractere, a thread <code>B</code> imprime <b>duas vezes</b>, em momentos diferentes, e a <code>E</code> também.<br><br>É a mesma cadeia de semáforos do CAFE, só que agora ela <b>volta</b>: B &rarr; E &rarr; B &rarr; E &rarr; R. Cada thread faz <code>sem_wait</code> no próprio semáforo tantas vezes quantas letras precisa imprimir.<br><br>Criar 5 threads é o erro que o enunciado proíbe explicitamente."
},
{
  id:"pp12", mod:"padroes", dif:"medio", tipo:"code",
  fonte:"Lab · Padrões Concorrentes, Q2",
  enunciado:"Cinco threads executam <code>printf(\"A\")</code>, depois uma barreira, depois <code>printf(\"B\")</code> — a saída tem que ser sempre <code>AAAAABBBBB</code>. Escreva <b>apenas a função</b> <code>esperar_barreira</code>.",
  cod:"#define N 5\n\nint   chegaram = 0;\nsem_t mutex;      /* = 1, protege 'chegaram'    */\nsem_t porta;      /* = 0, onde as threads dormem */\n\n/* ---- JA PRONTA ---- */\nvoid *tarefa(void *arg) {\n    printf(\"A\");\n    esperar_barreira();\n    printf(\"B\");\n    return NULL;\n}",
  chaves:["sem_wait","sem_post","chegaram"],
  modelo:"void esperar_barreira(void) {\n    sem_wait(&mutex);\n    chegaram++;\n\n    if (chegaram == N) {                 /* a ULTIMA a chegar... */\n        for (int i = 0; i < N - 1; i++)\n            sem_post(&porta);            /* ...libera todas as outras */\n        sem_post(&mutex);\n    } else {\n        sem_post(&mutex);                /* SOLTA o mutex... */\n        sem_wait(&porta);                /* ...e so entao dorme  */\n    }\n}",
  gabarito:"O exercício existe para você <b>reconhecer o padrão barreira</b>. Não importa a ordem dos A's entre si nem a dos B's — o que a saída exige é que a fase A termine em <b>todas</b> as threads antes que a fase B comece em qualquer uma.<br><br><b>Detalhe obrigatório:</b> soltar o <code>mutex</code> <b>antes</b> do <code>sem_wait(&porta)</code>. Se você dormir segurando o mutex, ninguém mais consegue incrementar o contador e o programa trava — o mesmo erro do banheiro e do produtor/consumidor."
},
{
  id:"pp13", mod:"padroes", dif:"facil", tipo:"code",
  fonte:"Lab · Padrões Concorrentes, Q3",
  enunciado:"Num pipeline que calcula soma &rarr; média &rarr; variância &rarr; desvio padrão, escreva <b>apenas o estágio</b> <code>estagio_media</code>, que depende do resultado da soma.",
  cod:"typedef struct {\n    float *vetor; int tamanho;\n    float soma, media, variancia, desvio_padrao;\n} tarefa_t;\n\nsem_t pronto_soma, pronto_media, pronto_var;   /* todos = 0 */\n\n/* ---- JA PRONTO ---- */\nvoid *estagio_soma(void *arg) {\n    tarefa_t *t = arg;\n    t->soma = 0;\n    for (int i = 0; i < t->tamanho; i++) t->soma += t->vetor[i];\n    sem_post(&pronto_soma);\n    return NULL;\n}",
  chaves:["sem_wait","sem_post","media"],
  modelo:"void *estagio_media(void *arg) {\n    tarefa_t *t = arg;\n\n    sem_wait(&pronto_soma);          /* DEPENDE do estagio anterior */\n\n    t->media = t->soma / t->tamanho;\n\n    sem_post(&pronto_media);         /* libera o proximo estagio */\n    return NULL;\n}",
  gabarito:"O esqueleto de todo estágio de pipeline tem três partes: <b>espera</b> o estágio anterior, <b>calcula</b>, <b>libera</b> o próximo.<br><br>Um semáforo por dependência, todos iniciados em <b>0</b>. Sem o <code>sem_wait</code>, a média seria calculada com <code>t-&gt;soma</code> ainda em lixo — condição de corrida clássica de dependência de dados."
},
{
  id:"pp13b", mod:"padroes", dif:"facil", tipo:"code",
  fonte:"Lab · Padrões Concorrentes, Q3",
  enunciado:"No mesmo pipeline, escreva <b>apenas o estágio</b> <code>estagio_variancia</code>, que depende da média.",
  cod:"typedef struct {\n    float *vetor; int tamanho;\n    float soma, media, variancia, desvio_padrao;\n} tarefa_t;\n\nsem_t pronto_soma, pronto_media, pronto_var;   /* todos = 0 */\n\n/* variancia = media dos quadrados dos desvios em relacao a media */",
  chaves:["sem_wait","sem_post","variancia"],
  modelo:"void *estagio_variancia(void *arg) {\n    tarefa_t *t = arg;\n\n    sem_wait(&pronto_media);         /* DEPENDE da media */\n\n    t->variancia = 0;\n    for (int i = 0; i < t->tamanho; i++) {\n        float d = t->vetor[i] - t->media;\n        t->variancia += d * d;\n    }\n    t->variancia /= t->tamanho;\n\n    sem_post(&pronto_var);           /* libera o estagio do desvio */\n    return NULL;\n}",
  gabarito:"Mesma estrutura do estágio anterior: espera, calcula, libera.<br><br><b>Observação de desempenho que pode ser cobrada:</b> com <b>um único</b> vetor, o pipeline não acelera nada — os estágios são estritamente sequenciais por causa das dependências. O ganho aparece quando <b>vários vetores</b> entram em fila: enquanto a variância processa o vetor 1, a soma já trabalha no vetor 2."
},
{
  id:"pp14", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Lab · Padrões Concorrentes, Q5",
  enunciado:"A solução para o deadlock do Jantar dos Filósofos apresentada em aula tem o problema de <b>starvation</b>. O que isso significa?",
  opcoes:[
    "Existem filósofos que não estão bloqueados, mas que nunca chegam a ser executados — nunca conseguem comer, embora o sistema como um todo progrida.",
    "Todos os filósofos ficam bloqueados esperando uns pelos outros e o programa trava por completo.",
    "Os filósofos comem, mas o programa acaba consumindo toda a memória disponível.",
    "Dois filósofos pegam o mesmo garfo simultaneamente, corrompendo o estado."
  ],
  correta:0,
  gabarito:"Diferença que cai em prova: no <b>deadlock</b> ninguém progride, todos estão bloqueados. Na <b>starvation</b> o sistema progride — alguns filósofos comem repetidamente — mas um filósofo específico é sistematicamente preterido e espera indefinidamente. A correção pedida no Q5 é introduzir <b>justiça</b>: uma fila de espera por ordem de chegada, ou um esquema de prioridade crescente para quem espera há mais tempo. A alternativa (d) descreve condição de corrida."
},
{
  id:"pp15", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Lab · Padrões Concorrentes, Q7",
  enunciado:"No problema do <b>barbeiro sonolento</b> (barbearia com N cadeiras de espera e 1 cadeira de barbear), qual conjunto de semáforos modela corretamente o problema?",
  opcoes:[
    "<code>clientes</code> = 0 (clientes esperando), <code>barbeiros</code> = 0 (barbeiro pronto) e <code>mutex</code> = 1 protegendo o contador de clientes na sala.",
    "Apenas <code>mutex</code> = 1, já que só há um barbeiro.",
    "<code>cadeiras</code> = N e <code>mutex</code> = N, um para cada cadeira de espera.",
    "<code>barbeiro</code> = 1 e <code>cliente</code> = 1, alternando estritamente."
  ],
  correta:0,
  gabarito:"É a solução clássica de Dijkstra. O barbeiro faz <code>wait(clientes)</code> — e é aí que ele &ldquo;dorme&rdquo; quando não há ninguém. O cliente trava o <code>mutex</code>, verifica se há cadeira livre; se não houver, vai embora (não é bloqueio, é desistência); se houver, incrementa o contador, faz <code>post(clientes)</code> (acorda o barbeiro), destrava o mutex e faz <code>wait(barbeiros)</code>. Repare que o padrão <b>dormir e acordar</b> está no coração do problema, e que a desistência quando a sala está cheia é o que impede o bloqueio infinito."
},
{
  id:"pp16", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Slides · Padrões Concorrentes",
  enunciado:"Num pipeline de 4 estágios com tempos de 2 ms, 5 ms, 3 ms e 2 ms, qual é a vazão do sistema com o pipeline cheio?",
  opcoes:[
    "Um item a cada 5 ms — o tempo do estágio mais lento.",
    "Um item a cada 12 ms — a soma de todos os estágios.",
    "Um item a cada 3 ms — a média dos estágios.",
    "Um item a cada 2 ms — o tempo do estágio mais rápido."
  ],
  correta:0,
  gabarito:"O pipeline anda no ritmo do <b>gargalo</b>. Os estágios de 2 ms e 3 ms ficam ociosos parte do tempo, esperando o de 5 ms. A latência de um item continua sendo 12 ms (ele atravessa os quatro), mas sai um item completo a cada 5 ms. Otimizar um pipeline significa atacar o estágio mais lento — quebrá-lo em dois, ou replicá-lo. É o mesmo princípio do pipeline de instruções: o ciclo de relógio é ditado pelo estágio mais demorado."
},
{
  id:"pp17", mod:"padroes", dif:"facil", tipo:"vf",
  fonte:"Slides · Padrões Concorrentes",
  enunciado:"Uma barreira só faz sentido em programas com fases: ela separa etapas de cálculo em que a fase seguinte depende do resultado que <b>todas</b> as threads produziram na fase anterior.",
  correta:0,
  gabarito:"<b>Verdadeiro.</b> Se não há dependência entre fases, a barreira só introduz espera desnecessária — todas as threads ficam limitadas pela mais lenta, e o desbalanceamento de carga vira custo direto. Barreira usada sem necessidade é um erro de desempenho comum; em OpenMP, é por isso que existe a cláusula <code>nowait</code>, que remove a barreira implícita no fim de um <code>for</code>."
},
{
  id:"pp18", mod:"padroes", dif:"dificil", tipo:"mc",
  fonte:"Slides · Padrões Concorrentes",
  enunciado:"Por que uma barreira reutilizável (usada em várias fases seguidas) precisa de <b>duas</b> fases de sincronização (<i>turnstile</i> duplo)?",
  opcoes:[
    "Porque uma thread rápida pode atravessar a barreira, terminar a fase seguinte e chegar de novo à barreira antes que as threads lentas tenham saído da primeira passagem, zerando o contador na hora errada.",
    "Porque semáforos POSIX não podem ser reutilizados depois de um <code>sem_post</code>.",
    "Porque o mutex precisa ser destruído e recriado entre as fases.",
    "Porque o número de threads pode mudar entre uma fase e outra."
  ],
  correta:0,
  gabarito:"É a condição de corrida sutil da barreira. Se a thread rápida volta e incrementa <code>chegaram</code> antes de as lentas terem saído, o contador fica errado e a barreira libera cedo (ou trava). A solução de duas fases: a primeira porta só abre quando todos chegam; a segunda porta só abre quando todos passaram pela primeira — só então o contador é zerado com segurança. Esse é o cuidado que separa uma implementação correta da API de barreiras pedida no Q4 do laboratório."
},
{
  id:"pp19", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Slides · Jantar dos Filósofos",
  enunciado:"Os slides do Jantar dos Filósofos pedem para prevenir deadlock e inanição, e citam um terceiro problema: o <b>livelock</b>. O que o caracteriza?",
  opcoes:[
    "As threads <b>não estão bloqueadas</b> — continuam executando e mudando de estado —, mas reagem umas às outras de modo que nenhuma progride: pegam um garfo, veem o outro ocupado, soltam e tentam de novo, todas no mesmo ritmo.",
    "Todas as threads ficam bloqueadas esperando umas pelas outras, sem consumir CPU.",
    "Uma única thread é sistematicamente preterida pelo escalonador enquanto as demais progridem.",
    "O programa termina, mas com o resultado errado por causa de uma condição de corrida."
  ],
  correta:0,
  gabarito:"Os três problemas se distinguem por <b>quem progride</b> e <b>se há CPU sendo gasta</b>:<br><br>&bull; <b>Deadlock</b> — todos bloqueados esperando uns pelos outros. Ninguém progride, a CPU fica ociosa.<br>&bull; <b>Livelock</b> — todos <b>ativos</b>, a CPU fica a 100%, e mesmo assim ninguém progride. É um deadlock &ldquo;em movimento&rdquo;.<br>&bull; <b>Starvation</b> — o sistema progride, mas uma thread específica fica sempre para trás.<br><br>O livelock nasce justamente da <b>tentativa educada</b> de evitar o deadlock: &ldquo;se não consegui o segundo garfo, solto o primeiro e tento de novo&rdquo;. Se todos os filósofos fizerem isso em sincronia, soltam e pegam juntos para sempre.<br><br><b>Por que é traiçoeiro:</b> o programa parece estar trabalhando — o monitor de sistema mostra a CPU ocupada —, ao contrário do deadlock, em que o processo fica visivelmente parado.<br><br>A saída é <b>quebrar a simetria</b>: uma espera aleatória antes de tentar de novo (que torna o livelock improvável, como o <i>backoff</i> exponencial da Ethernet) ou uma regra que decida quem tenta primeiro."
},
{
  id:"pp20", mod:"padroes", dif:"dificil", tipo:"mc",
  fonte:"Análise de log · Jantar dos Filósofos em Java",
  enunciado:"Um jantar com 6 filósofos em Java deveria rodar 10 000 refeições por filósofo. O log de uma execução termina exatamente assim, e o processo não imprime mais nada. O que aconteceu?",
  cod:"/* cada filosofo:  garfos[direita].acquire();   com direita  = id\n                  garfos[esquerda].acquire();  com esquerda = (id+1) % 6 */\n\n   ... 1914 linhas antes ...\nFilosofo[ 0 ] Peguei o garfo 0\nFilosofo[ 1 ] Peguei o garfo 1\nFilosofo[ 4 ] Peguei o garfo 5\nFilosofo[ 4] Comendo (pela 226-esima vez)\nFilosofo[ 4 ] Pensando ...\nFilosofo[ 5 ] Pensando ...\nFilosofo[ 5 ] Peguei o garfo 5\nFilosofo[ 3 ] Peguei o garfo 4\nFilosofo[ 3] Comendo (pela 99-esima vez)\nFilosofo[ 3 ] Pensando ...\nFilosofo[ 2 ] Peguei o garfo 3\nFilosofo[ 2] Comendo (pela 32-esima vez)\nFilosofo[ 2 ] Pensando ...\nFilosofo[ 2 ] Peguei o garfo 2\nFilosofo[ 3 ] Peguei o garfo 3\nFilosofo[ 4 ] Peguei o garfo 4\n                                         <- e nada mais",
  opcoes:[
    "<b>Deadlock</b>: a última ação de <b>cada um</b> dos 6 filósofos foi pegar o garfo da direita. Cada um segura o seu e espera o da esquerda, que está com o vizinho — espera circular fechada.",
    "<b>Starvation</b>: o filósofo 0 comeu bem menos vezes que o 4 e ficou esperando para sempre.",
    "O programa terminou normalmente; o log só parece cortado porque o buffer da saída padrão não foi descarregado.",
    "<b>Livelock</b>: os filósofos continuam pegando e soltando garfos, mas o Java suprime as mensagens repetidas."
  ],
  correta:0,
  gabarito:"<b>Como se lê um log de concorrência:</b> procure a <b>última ação de cada thread</b>. Aqui ela é, para os seis:<br><br><code>F0 pegou G0 &nbsp; F1 pegou G1 &nbsp; F2 pegou G2 &nbsp; F3 pegou G3 &nbsp; F4 pegou G4 &nbsp; F5 pegou G5</code><br><br>Cada filósofo <i>i</i> segura o garfo <i>i</i> (sua direita) e bloqueou em <code>acquire()</code> esperando o garfo <i>i</i>+1, que é justamente a direita do vizinho. <b>F0 &rarr; F1 &rarr; F2 &rarr; F3 &rarr; F4 &rarr; F5 &rarr; F0</b>: as quatro condições de Coffman valem ao mesmo tempo.<br><br><b>Por que não é as outras:</b><br>&bull; Não é <b>starvation</b> — ninguém progride, nem o F4 que comia mais.<br>&bull; Não é <b>livelock</b> — <code>Semaphore.acquire()</code> <b>bloqueia</b> a thread; não há ninguém soltando e tentando de novo.<br><br><b>O detalhe didático:</b> o deadlock só apareceu depois de centenas de refeições. Ele é <b>probabilístico</b> — depende de uma intercalação específica —, e por isso um programa desses passa em muitos testes antes de travar em produção.<br><br>A diferença de refeições (F4 com 227, F0 com 18) mostra ainda que o escalonador <b>não é justo</b>, mas isso não é a causa da parada."
},
{
  id:"pp21", mod:"padroes", dif:"dificil", tipo:"mc",
  fonte:"Análise de código · Jantar dos Filósofos com mutex",
  enunciado:"Esta versão do jantar <b>não tem deadlock</b>. Qual é o custo dela?",
  cod:"for (n = 0; n < 10000; n++) {\n    while (1) {\n        sem_wait(mutex);\n\n        sem_getvalue(&garfos[esquerda], &value);\n        if (value == 1)  sem_wait(&garfos[esquerda]);\n        else { sem_post(mutex); sched_yield(); continue; }\n\n        sem_getvalue(&garfos[direita], &value);\n        if (value == 1) { sem_wait(&garfos[direita]); break; }\n        else {\n            sem_post(&garfos[esquerda]);\n            sem_post(mutex); sched_yield(); continue;\n        }\n    }\n\n    usleep(1000);\n    printf(\"%d: O filosofo %d estah comendo!\\n\", n++, filosofo);\n\n    sem_post(&garfos[esquerda]);\n    sem_post(&garfos[direita]);\n    sem_post(mutex);                 /* <-- so aqui */\n}",
  opcoes:[
    "O <code>mutex</code> só é liberado <b>depois da refeição</b>: enquanto um filósofo come, nenhum outro sequer consegue olhar os garfos. Só <b>um</b> come por vez, mesmo havendo garfos para dois — e quem falha fica em espera ocupada com <code>sched_yield</code>.",
    "Ela pode travar se dois filósofos chamarem <code>sem_getvalue</code> ao mesmo tempo.",
    "O <code>sched_yield</code> bloqueia a thread até o garfo ser liberado, o que reintroduz o deadlock.",
    "Nenhum: é a solução ótima, com até dois filósofos não vizinhos comendo simultaneamente."
  ],
  correta:0,
  gabarito:"<b>Por que não trava:</b> o teste e a tomada dos dois garfos acontecem sob o mesmo mutex, então ou o filósofo leva os dois, ou solta tudo e não fica com nenhum. É o ataque à <b>posse-e-espera</b>.<br><br><b>O custo está na última linha.</b> O <code>sem_post(mutex)</code> vem depois de comer. Com 5 filósofos e 5 garfos, dois não vizinhos poderiam comer juntos — aqui, nunca. O programa virou <b>sequencial</b>.<br><br>Repare numa consequência curiosa: como o mutex fica retido do teste até a devolução, os semáforos dos garfos viraram <b>decoração</b>. É o mutex, e só ele, que garante tudo.<br><br><b>Segundo custo:</b> quem não consegue os garfos solta o mutex, chama <code>sched_yield()</code> e tenta de novo — <b>espera ocupada</b>. A thread não dorme; volta à fila de prontos e gasta CPU testando.<br><br><b>Terceiro detalhe:</b> <code>sem_getvalue</code> seguido de <code>sem_wait</code> é um teste-depois-uso que só é seguro porque todos seguram o mutex. Fora dele, seria uma condição de corrida.<br><br><b>E um bug de brinde:</b> <code>n</code> é incrementado duas vezes por volta (no <code>for</code> e no <code>printf</code>), então cada filósofo come cerca de 5 000 vezes, não 10 000.<br><br>A versão sem esses custos é a de <code>take_forks</code>/<code>test</code>, que <b>bloqueia</b> o filósofo num semáforo próprio em vez de fazê-lo tentar em laço."
},
{
  id:"pp22", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Slides · Pool de Threads",
  enunciado:"Num pool de threads, o que muda entre a versão <b>sem fila</b> e a versão <b>com fila</b> quando chega uma requisição e todas as operárias estão ocupadas?",
  opcoes:[
    "Sem fila, a requisição é <b>descartada</b>; com fila, o despachante a enfileira e uma operária a consome quando ficar livre.",
    "Sem fila, o despachante cria uma thread nova só para ela; com fila, ele bloqueia até alguém terminar.",
    "Sem fila, a própria thread despachante executa a requisição; com fila, ela é descartada.",
    "Nada muda: a fila serve apenas para devolver as respostas na ordem de chegada."
  ],
  correta:0,
  gabarito:"Pelos slides, um pool é um conjunto de threads <b>criadas antecipadamente</b> para o mesmo trabalho, porque criar e destruir threads a cada tarefa custa tempo. A estrutura tem <b>uma despachante</b>, <b>N operárias</b> e, <b>opcionalmente</b>, uma fila.<br><br>&bull; <b>Sem fila</b> — as operárias dormem (<i>sleep</i>) e a despachante acorda uma (<i>wakeup</i>). Se todas estão ocupadas, o dado que chega é <b>descartado</b>. Faz sentido quando dado velho perde o valor: quadros de vídeo, leituras de sensor.<br>&bull; <b>Com fila</b> — a despachante coloca a tarefa na fila e as operárias a &ldquo;percebem&rdquo; e consomem depois. A fila é um <b>produtor-consumidor</b>, com tudo o que isso exige.<br><br><b>O cuidado que vale ponto:</b> a fila precisa ser <b>limitada</b>. Sem limite, uma rajada maior que a capacidade de processamento faz a fila crescer até esgotar a memória — e aí é preciso decidir de novo entre bloquear a despachante ou descartar.<br><br>A alternativa B é justamente o que o pool existe para evitar: uma thread nova por tarefa."
},
{
  id:"pp23", mod:"padroes", dif:"dificil", tipo:"mc",
  fonte:"Análise de código · Pool de Threads em Java",
  enunciado:"O que se pode afirmar sobre a saída deste programa?",
  cod:"class ClasseComRunnable implements Runnable {\n    private int numberOfThreads = 0;\n\n    public void run() {\n        this.numberOfThreads++;\n        System.out.println(\"Passei: \" + this.numberOfThreads);\n    }\n}\n\nClasseComRunnable c = new ClasseComRunnable();\nExecutorService e = Executors.newFixedThreadPool(5);\n\nfor (int i = 0; i < 10; i++)\n    e.execute(c);                    /* o MESMO objeto, 10 vezes */\n\ne.shutdown();",
  opcoes:[
    "As 10 tarefas rodam em até 5 threads sobre o <b>mesmo objeto</b> <code>c</code>: <code>numberOfThreads++</code> é uma condição de corrida, então os valores podem se repetir, pular e sair fora de ordem — e o último pode nem ser 10.",
    "Imprime sempre de 1 a 10 em ordem, porque o pool executa as tarefas numa fila.",
    "Imprime só 5 linhas, porque o pool tem apenas 5 threads.",
    "Não imprime nada: <code>shutdown()</code> cancela na hora as tarefas ainda não executadas."
  ],
  correta:0,
  gabarito:"<b>A condição de corrida:</b> <code>execute(c)</code> não copia o objeto — as 10 tarefas apontam para a <b>mesma instância</b>, e o campo <code>numberOfThreads</code> é compartilhado pelas 5 threads do pool. <code>++</code> é lê-soma-escreve, então incrementos se perdem. E o <code>println</code> lê o campo <b>de novo</b>, depois de outras threads talvez já o terem mudado: duas tarefas podem imprimir o mesmo número.<br><br><b>Por que não as outras:</b><br>&bull; A fila do pool define <b>quem pega a próxima tarefa</b>, não a ordem de execução entre 5 threads simultâneas.<br>&bull; 5 é o número de <b>threads</b>, não de tarefas: as 10 são executadas, reaproveitando as threads.<br>&bull; <code>shutdown()</code> só para de <b>aceitar</b> tarefas novas; as já enviadas terminam. Quem tenta interromper é <code>shutdownNow()</code>.<br><br><b>Correções:</b> <code>AtomicInteger</code>, um método <code>synchronized</code>, ou um <code>Runnable</code> novo por tarefa. E um detalhe de nome: o contador conta <b>execuções</b>, não threads."
},
{
  id:"pp24", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Slides · Barreiras · implementação",
  enunciado:"Quais são as barreiras prontas das bibliotecas de C (pthreads) e de Java, e como são usadas?",
  opcoes:[
    "Em C, <code>pthread_barrier_t</code>: <code>pthread_barrier_init(&b, NULL, N)</code>, cada thread chama <code>pthread_barrier_wait(&b)</code> e no fim <code>pthread_barrier_destroy</code>. Em Java, <code>CyclicBarrier</code>: <code>new CyclicBarrier(N)</code> e <code>await()</code> em cada thread.",
    "Em C, <code>pthread_join</code> em cada uma das N threads; em Java, <code>Thread.join()</code>.",
    "Em C, <code>sem_init(&b, 0, N)</code>; em Java, <code>new Semaphore(N)</code> — barreira e semáforo são o mesmo mecanismo.",
    "Em C, <code>pthread_mutex_lock</code> seguido de <code>pthread_cond_wait</code>; em Java, um bloco <code>synchronized</code>."
  ],
  correta:0,
  gabarito:"O <b>N</b> passado na inicialização é quantas threads precisam chegar para a barreira abrir.<br><br><b>Detalhes que valem ponto:</b><br>&bull; <code>pthread_barrier_wait</code> devolve <code>PTHREAD_BARRIER_SERIAL_THREAD</code> para <b>uma</b> das threads e 0 para as demais — útil para eleger uma única thread que faça o trabalho de junção depois da fase.<br>&bull; <code>CyclicBarrier</code> é <b>cíclica</b>: depois de abrir, rearma sozinha para a próxima rodada. Se uma das threads for interrompida enquanto as outras esperam, a barreira &ldquo;quebra&rdquo; e todas recebem <code>BrokenBarrierException</code> — em vez de esperarem para sempre por quem não vem.<br><br><b>Por que <code>join</code> não é barreira:</b> <code>join</code> espera a thread <b>terminar</b>. A barreira é um ponto de encontro <b>no meio</b> da execução — depois dela, todas continuam trabalhando.<br><br><b>Por que semáforo iniciado em N não é barreira:</b> ele deixaria N threads passarem <b>uma a uma</b>, sem esperar por ninguém. Com semáforos, a barreira começa em <b>0</b> e precisa de um contador."
},
{
  id:"pp25", mod:"padroes", dif:"dificil", tipo:"mc",
  fonte:"Exemplo · Barreiras impondo ordem",
  enunciado:"Sem as chamadas a <code>pthread_barrier_wait</code>, este programa costuma imprimir C, B, A. Com elas, qual é a saída?",
  cod:"pthread_barrier_init(&barreiraB, NULL, 2);\npthread_barrier_init(&barreiraC, NULL, 2);\n\nvoid *ThreadA(void *arg) {\n    for (int i = 0; i < 100000000; i++);     /* A e a mais lenta */\n    printf(\"Eu sou a Thread A\\n\");\n    pthread_barrier_wait(&barreiraB);\n    return NULL;\n}\n\nvoid *ThreadB(void *arg) {\n    pthread_barrier_wait(&barreiraB);\n    for (int i = 0; i < 10000; i++);\n    printf(\"Eu sou a Thread B\\n\");\n    pthread_barrier_wait(&barreiraC);\n    return NULL;\n}\n\nvoid *ThreadC(void *arg) {\n    pthread_barrier_wait(&barreiraC);\n    printf(\"Eu sou a Thread C\\n\");\n    return NULL;\n}",
  opcoes:[
    "Sempre <b>A, B, C</b>. Uma barreira de tamanho 2 é um ponto de encontro entre duas threads: B só imprime depois de encontrar A em <code>barreiraB</code> — e A só chega lá depois de imprimir —; C só imprime depois de encontrar B em <code>barreiraC</code>.",
    "Continua C, B, A: barreiras apenas reúnem threads, não definem ordem entre elas.",
    "A primeiro; B e C depois, em qualquer ordem, porque as duas barreiras abrem juntas.",
    "O programa trava: uma barreira de tamanho 2 num programa com 3 threads nunca se completa."
  ],
  correta:0,
  gabarito:"O segredo está na <b>posição</b> de cada chamada:<br><br>&bull; na thread que deve vir <b>antes</b>, a barreira fica <b>depois</b> do <code>printf</code>;<br>&bull; na thread que deve vir <b>depois</b>, a barreira fica <b>antes</b> do <code>printf</code>.<br><br>Assim B não consegue imprimir enquanto A não tiver impresso e chegado a <code>barreiraB</code>, por mais lenta que A seja. E a mesma amarração entre B e C encadeia a terceira.<br><br><b>Por que não trava (alternativa D):</b> cada barreira tem exatamente <b>dois participantes</b> — A e B em <code>barreiraB</code>, B e C em <code>barreiraC</code>. As duas se completam. O tamanho da barreira é o número de threads que passam <b>por ela</b>, não o total do programa.<br><br><b>Nuance:</b> a barreira é <b>simétrica</b> — ela também faria A esperar se A chegasse antes de B. Para impor ordem basta um mecanismo assimétrico, e é o que a versão com semáforos iniciados em 0 faz: A dá <code>post</code> sem esperar ninguém, B dá <code>wait</code>."
},
{
  id:"pp26", mod:"padroes", dif:"medio", tipo:"vf",
  fonte:"Exemplo · Barreiras com semáforos",
  enunciado:"Na versão com semáforos do exemplo A, B, C, <code>barreiraB</code> começa em 0; A faz <code>sem_post(&barreiraB)</code> depois de imprimir e B faz <code>sem_wait(&barreiraB)</code> antes de imprimir. Se A der o <code>post</code> antes de B chegar ao <code>wait</code>, o sinal se perde e B dorme para sempre.",
  correta:1,
  gabarito:"<b>Falso.</b> O semáforo <b>guarda o sinal no contador</b>. O <code>post</code> antecipado faz <code>barreiraB</code> ir de 0 para 1; quando B chega ao <code>wait</code>, encontra 1, decrementa e passa direto, sem bloquear.<br><br>É exatamente o que distingue o semáforo do par <code>sleep</code>/<code>wakeup</code>, em que o aviso <b>evapora</b> se ninguém estiver dormindo — o problema do sinal perdido.<br><br>Por isso a ordem de escalonamento das threads não importa: se B chegar primeiro, espera; se A chegar primeiro, deixa o crédito guardado. Nos dois casos B imprime depois de A."
},
{
  id:"pp27", mod:"padroes", dif:"dificil", tipo:"mc",
  fonte:"Análise de código · Leitores e Escritores",
  enunciado:"Quantas threads escritoras este trecho cria, e qual é a consequência?",
  cod:"#define N_LEITORES   3\n#define N_ESCRITORES 1\n\npthread_t threads[N_ESCRITORES + N_LEITORES];\nint id;\n\nfor (id = 0; id < N_LEITORES; id++)\n    pthread_create(&threads[id], NULL, Leitor, &thread_data[id]);\n\nfor ( ; id < N_ESCRITORES; id++)\n    pthread_create(&threads[id], NULL, Escritor, &thread_data[id]);\n\nfor (id = 0; id < N_ESCRITORES + N_LEITORES; id++)\n    pthread_join(threads[id], NULL);",
  opcoes:[
    "<b>Nenhuma.</b> O segundo laço começa com <code>id = 3</code> e testa <code>3 &lt; 1</code>, que já é falso. O escritor nunca existe — e o último <code>pthread_join</code> recebe um <code>pthread_t</code> que nunca foi criado, o que é comportamento indefinido.",
    "Uma, como definido em <code>N_ESCRITORES</code>.",
    "Três, uma para cada leitor, porque o laço reaproveita o contador <code>id</code>.",
    "Uma, mas ela só roda depois que todos os leitores terminam, porque foi criada por último."
  ],
  correta:0,
  gabarito:"O segundo laço <b>continua</b> a contagem de onde o primeiro parou — então o limite precisa ser <b>acumulado</b>:<br><br><code>for ( ; id &lt; N_LEITORES + N_ESCRITORES; id++)</code><br><br><b>Por que o bug é traiçoeiro:</b> o programa compila, roda, os leitores leem e ele termina — tudo parece funcionar. Mas o problema de leitores e escritores <b>nunca é exercitado</b>, porque não há escritor. Um teste que &ldquo;não mostrou starvation do escritor&rdquo; não provou nada.<br><br>Pior: <code>threads[3]</code> não foi inicializado e é passado a <code>pthread_join</code>. Pode travar, pode falhar em silêncio, pode parecer funcionar — é indefinido.<br><br>A alternativa D descreve um erro de raciocínio comum: a <b>ordem de criação</b> não determina a ordem de execução. Quem decide é o escalonador."
},
{
  id:"pp28", mod:"padroes", dif:"medio", tipo:"mc",
  fonte:"Slides · Pipeline",
  enunciado:"Como os slides estruturam um pipeline implementado com threads?",
  opcoes:[
    "O primeiro passo é só <b>produtor</b> (lê arquivo ou base de dados); cada passo intermediário <b>consome</b> do buffer anterior, processa e <b>produz</b> no seguinte; o último é só <b>consumidor</b> (imprime ou grava). Entre dois passos há sempre um buffer.",
    "Todas as threads leem do mesmo buffer de entrada e escrevem num mesmo buffer de saída.",
    "Uma thread despachante distribui as etapas para operárias, que devolvem os resultados a ela.",
    "Cada passo chama diretamente a função do passo seguinte, sem estrutura intermediária."
  ],
  correta:0,
  gabarito:"Um pipeline é uma <b>corrente de produtores-consumidores</b>: cada junção entre dois passos é um buffer com seus três semáforos (<code>vazios</code>, <code>cheios</code>, <code>mutex</code>).<br><br>O buffer é o que <b>desacopla</b> as velocidades. Se um passo é mais lento, o buffer de entrada dele enche, o passo anterior bloqueia em <code>vazios</code> e a pressão se propaga para trás até o produtor. É por isso que a vazão do pipeline inteiro é ditada pelo <b>passo mais lento</b>.<br><br><b>Não confunda com o despachante-operário</b> (alternativa C): no pool, todas as operárias fazem o <b>mesmo</b> trabalho sobre tarefas diferentes. No pipeline, cada passo faz um trabalho <b>diferente</b> sobre o mesmo fluxo de dados."
},
{
  id:"pp29", mod:"padroes", dif:"medio", tipo:"disc",
  fonte:"Slides · Leitores e Escritores",
  enunciado:"Na solução vista em aula para leitores e escritores, um contador <code>rc</code> conta os leitores e o semáforo <code>db</code> trava a base: o <b>primeiro</b> leitor trava <code>db</code> e o <b>último</b> o libera. O que acontece com um escritor quando <b>existem muitas leituras</b> chegando?",
  chaves:[
    ["o escritor espera indefinidamente","espera indefinidamente","nunca entra","nunca consegue","espera para sempre","fica esperando","fica bloqueado"],
    ["starvation do escritor","starvation","inanição","adiado"],
    ["rc nunca chega a zero","nunca zera","nunca chega a zero","não zera","rc"],
    ["leitores novos entram sem esperar","novos leitores","leitor novo","entram direto","sem esperar","continuam entrando","continuam chegando"],
    ["só o último leitor libera db","último leitor","libera o db","libera db"],
    ["não é deadlock: os leitores progridem","não é deadlock","leitores progridem","continuam lendo","sistema progride"]
  ],
  gabarito:"<b>O escritor espera indefinidamente — <i>starvation</i> do escritor.</b><br><br>Numa linha do tempo:<br>&bull; L1 chega: <code>rc</code> vai a 1 e L1 trava <code>db</code>.<br>&bull; E chega e bloqueia em <code>db</code>.<br>&bull; L2 chega: <code>rc</code> vai a 2. Como não é o primeiro leitor, <b>entra direto</b>, sem olhar para <code>db</code>.<br>&bull; L1 sai: <code>rc</code> volta a 1 — mas <code>db</code> continua travado, porque L1 não é o último.<br>&bull; L3 chega antes de L2 sair...<br><br>Se as leituras se <b>sobrepõem</b>, <code>rc</code> nunca chega a zero, ninguém dá <code>sem_post(db)</code> e o escritor nunca entra. A solução dá <b>prioridade aos leitores</b>.<br><br><b>Não é deadlock:</b> os leitores continuam progredindo. É uma questão de <b>justiça</b>, não de segurança.<br><br><b>Consequência prática:</b> numa base de dados, os leitores passam a ler um dado cada vez mais velho, porque a escrita nunca é aplicada.<br><br><b>Correção:</b> o algoritmo de Courtois, Heymans e Parnas (1971), em que o primeiro escritor que chega <b>fecha a porta</b> para novos leitores — ou uma fila justa por ordem de chegada."
},
{
  id:"pp30", mod:"padroes", dif:"facil", tipo:"vf",
  fonte:"Slides · Implementação da sincronização",
  enunciado:"Para usar semáforos na implementação de barreiras e de outras sincronizações, inicia-se o semáforo em <b>0</b>: assim o <code>wait()</code> bloqueia a thread até que outra faça <code>post()</code>.",
  correta:0,
  gabarito:"<b>Verdadeiro.</b> É a propriedade que os slides destacam: com o semáforo em 0, <code>wait()</code> <b>bloqueia</b>, e cada <code>post()</code> desbloqueia exatamente uma thread. No modelo de Dijkstra, um valor <b>negativo</b> indica quantas threads estão bloqueadas nele.<br><br>Com isso o semáforo deixa de ser uma trava e vira um mecanismo de <b>sinalização</b> — a base de barreiras, de ordem entre threads (CAFE) e do dormir-e-acordar.<br><br><b>Detalhe de POSIX:</b> na prática, <code>sem_getvalue</code> não costuma devolver valores negativos — no Linux ele devolve 0 quando há threads esperando. O contador negativo é o modelo conceitual."
},
{
  id:"pp31", mod:"padroes", dif:"medio", tipo:"code",
  fonte:"Exemplo · Jantar dos Filósofos com take_forks",
  enunciado:"Na solução do jantar com vetor de estados, escreva <b>apenas a função</b> <code>test(i)</code>, que decide se o filósofo <code>i</code> pode comer e, se puder, o libera.",
  cod:"#define N 5\nenum estado { EATING, HUNGRY, THINKING };\n\nint   state[N];         /* estado de cada filosofo        */\nsem_t filosofos[N];     /* sem_init(&filosofos[i], 0, 0)  */\nsem_t mutex;            /* sem_init(&mutex, 0, 1)         */\n\nvoid take_forks(int i) {\n    sem_wait(&mutex);\n    state[i] = HUNGRY;\n    test(i);\n    sem_post(&mutex);\n    sem_wait(&filosofos[i]);      /* bloqueia se test() nao liberou */\n}\n\nvoid put_forks(int i) {\n    sem_wait(&mutex);\n    state[i] = THINKING;\n    test((i + 1) % N);            /* os vizinhos podem comer agora? */\n    test((i + N - 1) % N);\n    sem_post(&mutex);\n}",
  chaves:[
    ["state","estado"],
    ["HUNGRY","FAMINTO"],
    ["EATING","COMENDO"],
    ["% N","%N"],
    ["sem_post"],
    ["filosofos"]
  ],
  modelo:"void test(int i) {\n    int esquerda = (i + 1) % N;\n    int direita  = (i + N - 1) % N;\n\n    if (state[i] == HUNGRY &&\n        state[esquerda] != EATING &&\n        state[direita]  != EATING) {\n\n        state[i] = EATING;\n        sem_post(&filosofos[i]);    /* libera o sem_wait de take_forks */\n    }\n}",
  gabarito:"<b>As três condições</b> precisam valer juntas: o filósofo quer comer, e <b>nenhum</b> dos dois vizinhos está comendo.<br><br><b>Por que funciona sem deadlock:</b> <code>test</code> é sempre chamada com o <code>mutex</code> na mão, então o estado dos três filósofos é lido e alterado de forma atômica. O filósofo passa de faminto para comendo <b>de uma vez</b>, com os dois garfos — nunca segura só um. É o ataque à <b>posse-e-espera</b>.<br><br><b>O papel do semáforo por filósofo</b> (iniciado em 0): o <code>sem_wait</code> em <code>take_forks</code> é o <i>sleep</i>, e o <code>sem_post</code> em <code>test</code> é o <i>wakeup</i>. Quando <code>test(i)</code> dá certo logo de cara, o <code>post</code> acontece <b>antes</b> do <code>wait</code> — e como o semáforo guarda o sinal, o <code>wait</code> seguinte passa direto. Sem sinal perdido.<br><br><b>Detalhe de C:</b> o vizinho é <code>(i + N - 1) % N</code>, e não <code>(i - 1) % N</code>. Em C, o resto de um número negativo é negativo: para <code>i = 0</code>, <code>-1 % 5</code> dá <b>-1</b>, um índice inválido.<br><br><b>O que ela ainda não resolve:</b> <i>starvation</i> — dois vizinhos podem se revezar para sempre e deixar o do meio com fome."
}


]);
