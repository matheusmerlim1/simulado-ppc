/* ─── Padrões de Projeto Concorrente ────────────────────────
   P1 · 24 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"pp01a", mod:"padroes", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(a)",
  enunciado:"Explique o padrão de projeto concorrente <b>Fork/Join</b>.",
  gabarito:"O fluxo principal <b>divide</b> (fork) o trabalho criando N fluxos que executam em paralelo, e depois <b>espera</b> (join) todos terminarem antes de seguir.<br><br>É o padrão base de toda a disciplina: <code>fork()</code> + <code>wait()</code> para processos, <code>pthread_create()</code> + <code>pthread_join()</code> para threads.<br><br>Combina naturalmente com <b>redução</b>: cada thread produz um resultado parcial numa variável privada e o mestre combina tudo depois do join — sem região crítica nenhuma."
},
{
  id:"pp01b", mod:"padroes", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(b)",
  enunciado:"Explique o padrão <b>Travar &amp; Destravar</b>.",
  gabarito:"Proteger uma região crítica adquirindo uma trava <b>antes</b> de entrar e liberando <b>depois</b> de sair: <code>lock</code>/<code>unlock</code>, <code>sem_wait</code>/<code>sem_post</code>.<br><br>É o padrão da <b>exclusão mútua</b>.<br><br><b>Riscos:</b> esquecer de destravar (o programa trava para sempre); travar dois recursos em ordens diferentes em threads diferentes (deadlock); e usar granularidade grossa demais, o que serializa o programa e mata o paralelismo."
},
{
  id:"pp01c", mod:"padroes", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(c)",
  enunciado:"Explique o padrão <b>Dormir e Acordar</b>.",
  gabarito:"Em vez de espera ocupada, a thread que não pode prosseguir se <b>bloqueia</b> (<code>sleep</code>) e é <b>acordada</b> por outra (<code>wakeup</code>) quando a condição muda. Economiza CPU, porque a thread bloqueada sai da fila do escalonador.<br><br><b>Problema clássico — o sinal perdido (<i>lost wakeup</i>):</b> se o <code>wakeup</code> chega <i>antes</i> de a thread conseguir dormir, o aviso se perde e ela dorme para sempre.<br><br><b>Como se resolve:</b> o semáforo <b>guarda o sinal num contador</b> — um <code>post</code> anterior faz o <code>wait</code> seguinte passar direto. Com variáveis de condição, testa-se a condição num <code>while</code> sob a mesma trava que o <code>wait</code> libera atomicamente."
},
{
  id:"pp01d", mod:"padroes", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(d)",
  enunciado:"Explique o padrão <b>Despachante-Operário</b>.",
  gabarito:"Uma thread <b>despachante</b> recebe as tarefas e as distribui para um conjunto fixo de threads <b>operárias</b>, que ficam esperando numa fila. Também se chama <i>thread pool</i>.<br><br><b>Vantagens:</b><br>&bull; as threads são criadas <b>uma única vez</b> e reaproveitadas — some o custo de criação por tarefa;<br>&bull; o tamanho do pool <b>limita a concorrência</b>: 10 000 tarefas não viram 10 000 threads disputando a CPU.<br><br><b>Atenção:</b> a fila de tarefas continua sendo <b>região crítica</b> e precisa de proteção — tipicamente um produtor/consumidor com semáforos."
},
{
  id:"pp01e", mod:"padroes", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(e)",
  enunciado:"Explique o padrão <b>Pipeline</b>.",
  gabarito:"A tarefa é quebrada em <b>estágios sequenciais</b> e cada estágio vira uma thread. O dado atravessa os estágios enquanto novos dados entram no início.<br><br><b>O que melhora:</b> a <b>vazão</b> — com o pipeline cheio, sai um item completo a cada tempo do <b>estágio mais lento</b>, e não a cada soma de todos os estágios.<br><b>O que não melhora:</b> a <b>latência</b> de um item individual, que ainda precisa passar por todos os estágios.<br><br><i>Exemplo do laboratório:</i> soma &rarr; média &rarr; variância &rarr; desvio padrão, em que cada estágio consome o resultado do anterior. Otimizar um pipeline significa atacar o estágio gargalo."
},
{
  id:"pp01f", mod:"padroes", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 3(f)",
  enunciado:"Explique o padrão <b>Barreiras</b>.",
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
}

]);
