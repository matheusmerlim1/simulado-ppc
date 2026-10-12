/* Prova Prática — questões 1 a 4 */

secaoPratica({
  h: "Prática · Q1 — 1000 threads incrementam, 1000 decrementam (1,5 ponto)",
  p: enunciado("Escreva um programa que instancie 1000 threads que incrementam em 1 uma variável compartilhada chamada <code>contador</code> e 1000 threads que decrementam em 1 essa mesma variável.") +
     "O enunciado não diz &ldquo;proteja&rdquo;, mas é isso que está sendo cobrado: sem exclusão mútua o resultado final <b>quase nunca</b> é zero, e muda a cada execução. Com proteção, é zero <b>sempre</b>.<br><br>" +
     "São 2000 threads e um único mutex (ou um semáforo iniciado em 1). Não é preciso guardar os 2000 identificadores em vetores separados — um vetor de <code>pthread_t</code> de 2000 posições resolve, e o <code>join</code> de todas vem num laço só.",
  anima: { cena: "corrida", modo: "sem", rotulo: "Ver a corrida acontecendo, instrução por instrução" },
  anotado: {
    enunciado: "Programa completo, com a região crítica protegida e os dois laços de <code>join</code> separados da criação.",
    linhas: [
      ["#include <stdio.h>\n#include <pthread.h>",
       "Compile com <code>gcc prog.c -o prog -pthread</code>. Sem a opção, o <code>pthread_create</code> nem liga."],
      ["#define N 1000",
       "Mil de cada tipo. Deixar o número num <code>#define</code> facilita testar com valores maiores — e com 10 000 o erro sem proteção fica ainda mais visível."],
      ["long contador = 0;",
       "A variável <b>compartilhada</b>: global, enxergada por todas as threads. É o recurso em disputa."],
      ["pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;",
       "O mutex que protege o contador. Inicializado estaticamente, sem precisar de <code>pthread_mutex_init</code>.", true],
      ["void *incrementa(void *arg) {\n    pthread_mutex_lock(&m);\n    contador++;\n    pthread_mutex_unlock(&m);\n    return NULL;\n}",
       "A região crítica é só o <code>contador++</code> — que, em código de máquina, são as três instruções ler, somar e gravar. O <code>lock</code>/<code>unlock</code> em volta faz as três acontecerem sem intercalação.", true],
      ["void *decrementa(void *arg) {\n    pthread_mutex_lock(&m);\n    contador--;\n    pthread_mutex_unlock(&m);\n    return NULL;\n}",
       "Espelho da anterior. Repare que as duas usam <b>o mesmo</b> mutex: dois mutexes diferentes não protegeriam nada, porque cada thread travaria o seu e as duas entrariam juntas."],
      ["int main(void) {\n    pthread_t t[2 * N];",
       "Um identificador por thread. Sem guardá-los, não há como dar <code>join</code> depois."],
      ["    for (int i = 0; i < N; i++) {\n        pthread_create(&t[i], NULL, incrementa, NULL);\n        pthread_create(&t[N + i], NULL, decrementa, NULL);\n    }",
       "Cria as 2000, intercalando os dois tipos — o que aumenta a chance de a intercalação ruim aparecer, se a proteção for removida. Nenhuma thread recebe parâmetro, então <code>NULL</code> basta.", true],
      ["    for (int i = 0; i < 2 * N; i++)\n        pthread_join(t[i], NULL);",
       "Laço <b>separado</b>, depois de todas criadas. Dar <code>join</code> dentro do laço de criação esperaria cada thread terminar antes de criar a próxima — o programa viraria sequencial e o erro nunca apareceria.", true],
      ["    printf(\"contador = %ld\\n\", contador);\n    pthread_mutex_destroy(&m);\n    return 0;\n}",
       "Só imprime depois dos 2000 <code>join</code>: antes disso o valor ainda muda. O <code>destroy</code> vem por último, quando ninguém mais usa o mutex."]
    ],
    saida: "<b>contador = 0</b>, em toda execução. Comente as duas linhas de <code>lock</code>/<code>unlock</code> e rode de novo algumas vezes: aparecem valores diferentes e quase nunca zero — é a demonstração da condição de corrida que a Q1 da teórica pede por escrito."
  },
  programa:{"arquivo": "contador.c", "cod": "/* Questao 1 — 1000 threads incrementam e 1000 decrementam o mesmo contador. */\n#include <stdio.h>\n#include <pthread.h>\n\n#define N 1000\n\nlong contador = 0;\npthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;\n\nvoid *incrementa(void *arg) {\n    pthread_mutex_lock(&mutex);           /* o MESMO mutex nas duas funcoes */\n    contador++;\n    pthread_mutex_unlock(&mutex);\n    return NULL;\n}\n\nvoid *decrementa(void *arg) {\n    pthread_mutex_lock(&mutex);\n    contador--;\n    pthread_mutex_unlock(&mutex);\n    return NULL;\n}\n\nint main(void) {\n    pthread_t inc[N], dec[N];\n\n    for (int i = 0; i < N; i++) {                 /* FORK */\n        pthread_create(&inc[i], NULL, incrementa, NULL);\n        pthread_create(&dec[i], NULL, decrementa, NULL);\n    }\n\n    for (int i = 0; i < N; i++) {                 /* JOIN */\n        pthread_join(inc[i], NULL);\n        pthread_join(dec[i], NULL);\n    }\n\n    printf(\"Contador: %ld\\n\", contador);          /* sempre 0 */\n    pthread_mutex_destroy(&mutex);\n    return 0;\n}", "compila": "gcc contador.c -o contador -pthread && ./contador", "saida": "Contador: 0", "nota": "São 2000 threads, cada uma com uma volta só. O resultado é <b>0</b> em toda execução — e continuaria 0 com qualquer intercalação, porque é o <b>mesmo</b> mutex nas duas funções. Tire as quatro linhas de trava e rode de novo: o número passa a variar."},
  box: "<b>Alternativa com semáforo:</b> <code>sem_t s; sem_init(&s, 0, 1);</code> e <code>sem_wait</code>/<code>sem_post</code> no lugar de <code>lock</code>/<code>unlock</code>. Funciona igual — mas o mutex é a escolha mais expressiva, porque aqui o problema é <b>só</b> exclusão mútua."
});

secaoPratica({
  h: "Prática · Q2 — Imprimir BEBER com uma thread por letra (1,5 ponto)",
  p: enunciado("Escreva um programa concorrente que imprima a palavra <b>BEBER</b>. Seu programa deverá instanciar <u>apenas 1 thread para cada letra</u> — ou seja, não pode haver 2 threads para imprimir as letras &lsquo;E&rsquo; separadamente!") +
     "<b>A pegadinha está no enunciado.</b> BEBER tem 5 letras, mas só <b>3 distintas</b>: B, E e R. Como não pode haver duas threads para a mesma letra, são <b>3 threads</b> — e a thread do B imprime <b>duas vezes</b>, assim como a do E.<br><br>" +
     "Isso não é um problema de exclusão mútua, e sim de <b>ordem</b>. Mutex não resolve: ele garante que só uma imprime por vez, não <b>qual</b>. A ferramenta certa é o <b>semáforo iniciado em 0</b>, que bloqueia até alguém sinalizar.<br><br>" +
     "São <b>5 passos</b> na sequência B → E → B → E → R, então são <b>5 semáforos</b>, um para cada vez de imprimir. Só o primeiro começa liberado.",
  anotado: {
    enunciado: "Três threads, cinco semáforos encadeados: cada thread espera a sua vez, imprime e libera a próxima.",
    linhas: [
      ["sem_t b1, e1, b2, e2, r1;",
       "Um semáforo por <b>posição</b> da palavra: b1 é a vez do primeiro B, e1 a do primeiro E, e assim por diante."],
      ["sem_init(&b1, 0, 1);",
       "O primeiro começa em <b>1</b>: a thread do B passa direto e a palavra começa.", true],
      ["sem_init(&e1, 0, 0);\nsem_init(&b2, 0, 0);\nsem_init(&e2, 0, 0);\nsem_init(&r1, 0, 0);",
       "Todos os outros em <b>0</b>: quem chegar ao <code>sem_wait</code> bloqueia até receber o sinal. Semáforo em 0 é sinalização, não trava.", true],
      ["void *threadB(void *arg) {\n    sem_wait(&b1);\n    printf(\"B\"); fflush(stdout);\n    sem_post(&e1);",
       "Primeira vez do B: passa (b1 valia 1), imprime e libera o E. O <code>fflush</code> descarrega a saída sem esperar um <code>\\n</code>, para a ordem aparecer de verdade no terminal.", true],
      ["    sem_wait(&b2);\n    printf(\"B\"); fflush(stdout);\n    sem_post(&e2);\n    return NULL;\n}",
       "<b>A mesma thread</b> volta a esperar, agora em b2, para imprimir o segundo B. É isto que atende à exigência de uma única thread por letra.", true],
      ["void *threadE(void *arg) {\n    sem_wait(&e1);\n    printf(\"E\"); fflush(stdout);\n    sem_post(&b2);",
       "O E espera o sinal do primeiro B, imprime e devolve a vez ao B."],
      ["    sem_wait(&e2);\n    printf(\"E\"); fflush(stdout);\n    sem_post(&r1);\n    return NULL;\n}",
       "Segunda vez do E, que então libera o R."],
      ["void *threadR(void *arg) {\n    sem_wait(&r1);\n    printf(\"R\\n\"); fflush(stdout);\n    return NULL;\n}",
       "Último da corrente: imprime e <b>não sinaliza ninguém</b>."],
      ["pthread_create(&t[0], NULL, threadR, NULL);\npthread_create(&t[1], NULL, threadE, NULL);\npthread_create(&t[2], NULL, threadB, NULL);",
       "Criadas de propósito na ordem <b>inversa</b>: a saída continua BEBER. Quem manda é a corrente de semáforos, não a ordem de criação — e mostrar isso é a prova de que a solução está certa.", true]
    ],
    saida: "<b>BEBER</b>, em toda execução. Se o programa fosse feito com uma thread por <i>posição</i> (5 threads), a saída também sairia certa — mas violaria o enunciado, que proíbe duas threads para o mesmo caractere."
  },
  programa:{"arquivo": "beber.c", "cod": "/* Questao 2 — imprimir BEBER com uma unica thread por letra.\n   3 threads (B, E, R) e 5 semaforos, um por posicao da palavra.   */\n#include <stdio.h>\n#include <pthread.h>\n#include <semaphore.h>\n\nsem_t b1, e1, b2, e2, r1;      /* a vez de cada posicao */\n\nvoid *threadB(void *arg) {\n    sem_wait(&b1);                        /* comeca liberado */\n    printf(\"B\"); fflush(stdout);\n    sem_post(&e1);                        /* libera o 1o E   */\n\n    sem_wait(&b2);                        /* a MESMA thread volta */\n    printf(\"B\"); fflush(stdout);\n    sem_post(&e2);\n    return NULL;\n}\n\nvoid *threadE(void *arg) {\n    sem_wait(&e1);\n    printf(\"E\"); fflush(stdout);\n    sem_post(&b2);                        /* devolve a vez ao B */\n\n    sem_wait(&e2);\n    printf(\"E\"); fflush(stdout);\n    sem_post(&r1);\n    return NULL;\n}\n\nvoid *threadR(void *arg) {\n    sem_wait(&r1);\n    printf(\"R\\n\"); fflush(stdout);\n    return NULL;                          /* ultimo: nao sinaliza ninguem */\n}\n\nint main(void) {\n    pthread_t t[3];\n\n    sem_init(&b1, 0, 1);                  /* so o primeiro comeca em 1 */\n    sem_init(&e1, 0, 0);\n    sem_init(&b2, 0, 0);\n    sem_init(&e2, 0, 0);\n    sem_init(&r1, 0, 0);\n\n    pthread_create(&t[0], NULL, threadR, NULL);   /* ordem INVERSA de proposito: */\n    pthread_create(&t[1], NULL, threadE, NULL);   /* quem manda e a corrente de  */\n    pthread_create(&t[2], NULL, threadB, NULL);   /* semaforos, nao a criacao    */\n\n    for (int i = 0; i < 3; i++) pthread_join(t[i], NULL);\n\n    sem_destroy(&b1); sem_destroy(&e1); sem_destroy(&b2);\n    sem_destroy(&e2); sem_destroy(&r1);\n    return 0;\n}", "compila": "gcc beber.c -o beber -pthread && ./beber", "saida": "BEBER", "nota": "Rodei 20 vezes seguidas: <b>BEBER</b> nas 20. Repare que o <code>main</code> cria as threads na ordem R, E, B — invertida de propósito. Quem impõe a ordem da saída é a corrente de semáforos, não a ordem de criação."},
  box: "<b>Variação que já caiu:</b> a mesma ideia com a palavra <b>CAFE</b>, em que todas as letras são distintas — aí são 4 threads e 4 semáforos, um por letra, e cada thread imprime uma vez só. A estrutura da corrente é idêntica."
});

secaoPratica({
  h: "Prática · Q3 — Jantar dos Filósofos com 3 filósofos (4,0 pontos)",
  p: enunciado("O problema do Jantar dos Filósofos visto em aula é definido por: filósofos comem ou pensam; para comer, precisam pegar 2 garfos; existe um número de garfos igual ao número de filósofos (3 filósofos, 3 garfos). Implemente o problema em qualquer linguagem, considerando 3 filósofos. <u>Seu programa não deverá possuir deadlocks ou condições de corrida.</u>") +
     "É a questão de maior peso da prova, e o enunciado diz exatamente o que será verificado: <b>nem deadlock, nem condição de corrida</b>.<br><br>" +
     "<b>Por que a solução ingênua trava:</b> se cada filósofo pega o garfo da esquerda e depois o da direita, existe a intercalação em que todos pegam o da esquerda ao mesmo tempo — cada um segura um garfo e espera pelo do vizinho. As quatro condições de Coffman valem juntas.<br><br>" +
     "<b>A correção mais simples de defender numa prova</b> é atacar a <b>posse-e-espera</b>: o filósofo só pega garfos se <b>os dois</b> estiverem livres, e essa verificação acontece sob um mutex. Assim ninguém nunca segura um garfo só. Quem não pode comer <b>dorme</b> num semáforo próprio, em vez de ficar tentando — o que também evita espera ocupada e livelock.",
  anima: { cena: "filosofos", modo: "dois", rotulo: "Ver esta solução animada (os dois garfos de uma vez)" },
  anotado: {
    enunciado: "Solução com vetor de estados (Tanenbaum), adaptada para N = 3. Cada filósofo é uma thread; o teste dos garfos é a região crítica.",
    linhas: [
      ["#define N 3\n#define ESQ(i) (((i) + N - 1) % N)\n#define DIR(i) (((i) + 1) % N)",
       "Vizinhos do filósofo <code>i</code>. Soma-se N antes do resto porque, em C, <code>-1 % 3</code> dá <b>-1</b> — um índice inválido que leria fora do vetor.", true],
      ["enum { PENSANDO, FAMINTO, COMENDO };\nint estado[N];",
       "O estado de cada filósofo. É o <b>dado compartilhado</b> do programa — e, portanto, a região crítica a proteger."],
      ["sem_t mutex;      /* sem_init(&mutex, 0, 1) */\nsem_t s[N];       /* sem_init(&s[i], 0, 0) */",
       "<code>mutex</code> protege o vetor de estados. <code>s[i]</code>, iniciado em <b>0</b>, é onde o filósofo <i>i</i> <b>dorme</b> enquanto não pode comer.", true],
      ["void testa(int i) {\n    if (estado[i] == FAMINTO &&\n        estado[ESQ(i)] != COMENDO &&\n        estado[DIR(i)] != COMENDO) {",
       "As três condições juntas: ele quer comer e <b>nenhum</b> vizinho está comendo — ou seja, os dois garfos dele estão livres. Com 3 filósofos, os dois vizinhos de <i>i</i> são os outros dois.", true],
      ["        estado[i] = COMENDO;\n        sem_post(&s[i]);\n    }\n}",
       "Marca como comendo — o que equivale a <b>pegar os dois garfos de uma vez</b> — e acorda o filósofo. Aqui está a ausência de posse-e-espera.", true],
      ["void pega_garfos(int i) {\n    sem_wait(&mutex);\n    estado[i] = FAMINTO;\n    testa(i);\n    sem_post(&mutex);",
       "Declara a fome e testa, tudo sob o mutex, para que o estado dos vizinhos não mude no meio da verificação. <b>Isto elimina a condição de corrida.</b>", true],
      ["    sem_wait(&s[i]);\n}",
       "Se <code>testa</code> liberou, o <code>post</code> já está guardado no semáforo e este <code>wait</code> passa direto. Se não, o filósofo dorme aqui — <b>fora</b> do mutex, senão ninguém mais entraria para liberá-lo.", true],
      ["void devolve_garfos(int i) {\n    sem_wait(&mutex);\n    estado[i] = PENSANDO;\n    testa(ESQ(i));\n    testa(DIR(i));\n    sem_post(&mutex);\n}",
       "Ao largar, os únicos que podem ter ganho a chance de comer são os dois vizinhos: testa os dois e acorda quem puder.", true],
      ["void *filosofo(void *arg) {\n    int i = *(int *)arg;\n    for (int r = 0; r < 100; r++) {\n        /* pensa */\n        pega_garfos(i);\n        printf(\"filosofo %d comendo\\n\", i);\n        devolve_garfos(i);\n    }\n    return NULL;\n}",
       "O laço de vida do filósofo. Passe <code>&idx[i]</code> na criação, nunca <code>&i</code> — senão todos recebem o endereço da mesma variável, que continua mudando."]
    ],
    saida: "O programa roda até o fim sem travar, e nenhum filósofo segura um garfo sozinho em momento nenhum. <b>Ainda pode haver <i>starvation</i></b>: com 3 filósofos, dois podem se revezar e deixar o terceiro com fome. Se o enunciado pedisse ausência de inanição, seria preciso acrescentar uma senha de chegada."
  },
  programa:{"arquivo": "jantar3.c", "cod": "/* Questao 3 — Jantar dos Filosofos com 3 filosofos.\n   Vetor de estados (Tanenbaum): pega os dois garfos de uma vez, sob mutex. */\n#include <stdio.h>\n#include <pthread.h>\n#include <semaphore.h>\n\n#define N 3\n#define REFEICOES 100\n#define ESQ(i) (((i) + N - 1) % N)      /* +N antes do resto: -1 % 3 da -1 em C */\n#define DIR(i) (((i) + 1) % N)\n\nenum { PENSANDO, FAMINTO, COMENDO };\nint estado[N];\nint comeu[N];\n\nsem_t mutex;        /* 1: protege o vetor de estados */\nsem_t s[N];         /* 0: e aqui que o filosofo i dorme */\n\nvoid testa(int i) {\n    if (estado[i] == FAMINTO &&\n        estado[ESQ(i)] != COMENDO &&\n        estado[DIR(i)] != COMENDO) {\n        estado[i] = COMENDO;            /* equivale a pegar os DOIS garfos */\n        sem_post(&s[i]);\n    }\n}\n\nvoid pega_garfos(int i) {\n    sem_wait(&mutex);\n    estado[i] = FAMINTO;\n    testa(i);\n    sem_post(&mutex);\n    sem_wait(&s[i]);                    /* dorme FORA do mutex */\n}\n\nvoid devolve_garfos(int i) {\n    sem_wait(&mutex);\n    estado[i] = PENSANDO;\n    testa(ESQ(i));                      /* os vizinhos podem ter ganho a vez */\n    testa(DIR(i));\n    sem_post(&mutex);\n}\n\nvoid *filosofo(void *arg) {\n    int i = *(int *)arg;\n    for (int r = 0; r < REFEICOES; r++) {\n        /* pensa */\n        pega_garfos(i);\n        comeu[i]++;                     /* comendo: so o filosofo i mexe aqui */\n        devolve_garfos(i);\n    }\n    return NULL;\n}\n\nint main(void) {\n    pthread_t t[N];\n    int id[N];\n\n    sem_init(&mutex, 0, 1);\n    for (int i = 0; i < N; i++) sem_init(&s[i], 0, 0);\n\n    for (int i = 0; i < N; i++) {\n        id[i] = i;                      /* um endereco por thread */\n        pthread_create(&t[i], NULL, filosofo, &id[i]);\n    }\n    for (int i = 0; i < N; i++) pthread_join(t[i], NULL);\n\n    for (int i = 0; i < N; i++)\n        printf(\"filosofo %d comeu %d vezes\\n\", i, comeu[i]);\n    return 0;\n}", "compila": "gcc jantar3.c -o jantar3 -pthread && ./jantar3", "saida": "filosofo 0 comeu 100 vezes\nfilosofo 1 comeu 100 vezes\nfilosofo 2 comeu 100 vezes", "nota": "Cem refeições por filósofo, e o programa termina — não trava. Como cada um só come quando <b>os dois</b> garfos estão livres, nunca existe o estado &ldquo;segurando um e esperando o outro&rdquo;, que é a posse-e-espera."},
  box: "<b>Outras soluções aceitáveis</b>, se você souber defender: <b>(1)</b> numerar os garfos e pegá-los em ordem crescente — ataca a espera circular, e basta um filósofo &ldquo;canhoto&rdquo; para quebrar o ciclo; <b>(2)</b> limitar a N&minus;1 filósofos à mesa com um semáforo de contagem iniciado em 2.<br><br><b>O que não vale:</b> dormir um tempo aleatório antes de pegar o garfo. Isso só reduz a <i>probabilidade</i> do deadlock — não o elimina.<br><br><b>A resolução que circulou da prova usa a opção (1):</b> um <code>pthread_mutex_t garfo[3]</code>, cada filósofo travando o garfo da esquerda e depois o da direita, <b>menos o filósofo 2</b>, que inverte a ordem. É mais curta de escrever e igualmente defensável — só lembre de dizer <b>qual condição de Coffman</b> ela ataca (a espera circular) e de notar que, sem condição de parada, o laço <code>while (1)</code> roda para sempre."
});

secaoPratica({
  h: "Prática · Q4 — Analisar o código dos Banheiros UNISSEX (3,0 pontos)",
  p: enunciado("Um aluno, ao receber um trabalho de programação, resolveu colocar a descrição e a especificação no ChatGPT, entregando o código retornado. Para cada item da &ldquo;Especificação&rdquo;, indique se ela foi implementada corretamente ou não e em quais linhas do código elas estão implementadas. Ainda, caso haja condição de corrida ou deadlock na implementação, indique em quais linhas e dê um exemplo de como ela ocorre.") +
     "<b>O problema:</b> o banheiro fica em um de três estados — VAZIO, COM MULHER ou COM HOMEM. Várias pessoas do mesmo gênero podem estar dentro ao mesmo tempo; gêneros diferentes, não. É uma variante de <b>leitores e escritores</b>, com dois &ldquo;tipos de leitor&rdquo; mutuamente exclusivos.<br><br>" +
     "<b>A estrutura correta:</b> um semáforo <code>mutex</code> = 1 protegendo os contadores <code>homens_no_banheiro</code> e <code>mulheres_no_banheiro</code>, e um semáforo <code>vazio</code> = 1 representando a <b>posse do banheiro</b> por um gênero. A regra de ouro: o <b>primeiro</b> do seu gênero a entrar adquire <code>vazio</code>; o <b>último</b> a sair o libera. Quem está no meio apenas ajusta o contador e entra direto.<br><br>" +
     "<b>Como responder item a item:</b> a questão não pede para reescrever o código — pede <b>leitura</b>. Para cada letra da especificação, aponte a linha (ou diga que não foi implementada) e justifique em uma frase:",
  cod: "ITEM  O QUE EXIGE                                  ONDE PROCURAR NO CODIGO\n" +
       "---------------------------------------------------------------------------\n" +
       "(a)   executavel pelo terminal Linux              main + compilacao\n" +
       "(b)   terminar automaticamente ao fim             joins das threads e saida\n" +
       "(c)   thread GeradorHomens, 1ms a 4ms,            laco do gerador + usleep\n" +
       "      cada homem e uma thread \"Homem\"\n" +
       "(d)   thread GeradorMulheres, a cada 1ms          idem, para mulheres\n" +
       "(e)   homens impares desde 1; mulheres pares      contador de id de cada gerador\n" +
       "      desde 2\n" +
       "(f)   homem usa 1ms; mulher usa 2ms               usleep dentro da thread pessoa\n" +
       "(g)   homens so chamam homem_quer_entrar          corpo da thread Homem\n" +
       "      e homem_sai\n" +
       "(h)   mulheres so chamam mulher_quer_entrar       corpo da thread Mulher\n" +
       "      e mulher_sai\n" +
       "(i)   imprimir BANHEIRO COM MULHER / COM HOMEM    dentro do if do PRIMEIRO\n" +
       "      ao entrar no banheiro vazio                 (contador == 0)\n" +
       "(j)   imprimir BANHEIRO VAZIO ao esvaziar         dentro do if do ULTIMO\n" +
       "                                                  (contador == 0 apos --)\n" +
       "(k)   \"Mulher n entrou/saiu do banheiro\"          printf com o id, nos 4 proc.\n" +
       "      e o mesmo para homens\n" +
       "(l)   parar apos os n homens e m mulheres         join dos geradores e contagem",
  anotado: {
    enunciado: "Este é <b>todo</b> o código que a prova mostra: a página 2 de 4, linhas 1 a 24, do jeito que o ChatGPT devolveu. As páginas 3 e 4 — com <code>mulher_sai</code>, os dois procedimentos dos homens, os geradores e o <code>main</code> — não foram fotografadas, então só dá para avaliar o que está aqui. Os dois defeitos que a questão procura estão nestas linhas.",
    linhas: [
      ["1   #include <stdio.h>\n2   #include <stdlib.h>\n3   #include <pthread.h>\n4   #include <semaphore.h>\n5   #include <unistd.h>",
       "Os cabeçalhos certos para o que o programa usa: <code>printf</code>, <code>atoi</code>, threads, semáforos e <code>usleep</code>. A presença de <code>unistd.h</code> indica que os tempos de uso do item <b>(f)</b> seriam feitos com <code>usleep</code> — o que é o esperado."],
      ["7   int total_homens, total_mulheres;",
       "Os totais que o item <b>(l)</b> manda receber pela linha de comando. São escritos uma vez só, no <code>main</code>, antes de as threads existirem: não precisam de proteção."],
      ["9   int homens_no_banheiro = 0;\n10  int mulheres_no_banheiro = 0;",
       "Os dois contadores <b>compartilhados</b>. São eles que dizem em qual dos três estados o banheiro está — e, como várias threads os leem e escrevem, são a <b>região crítica</b> do programa inteiro."],
      ["12  sem_t mutex;\n13  sem_t vazio;",
       "<b>Um único <code>mutex</code> para os dois gêneros.</b> É a decisão que abre caminho para o deadlock da linha 18: a mulher que bloqueia segurando esse mutex impede o homem de sair, porque <code>homem_sai</code> precisa do <b>mesmo</b> mutex. Com <b>uma trava por contador</b> (<code>mutex_h</code> e <code>mutex_m</code>) o problema desaparece.<br><br>O <code>vazio</code>, esse, está certo: é a <b>posse do banheiro</b> por um gênero, e deve começar em 1.", true],
      ["15  void mulher_quer_entrar(int id) {",
       "Procedimento chamado por cada thread <code>Mulher</code> ao chegar. Atende ao item <b>(h)</b>."],
      ["16      sem_wait(&mutex);",
       "Entra na região crítica que protege os contadores. <b>Correto</b> — e é o que garante que o teste da linha 17 e o incremento da linha 21 não se intercalem com os de outra mulher."],
      ["17      if (mulheres_no_banheiro == 0) {",
       "Testa se é a <b>primeira</b> do seu gênero. A ideia está certa: só a primeira precisa tomar posse do banheiro."],
      ["18          sem_wait(&vazio);",
       "<b>AQUI ESTÁ O DEADLOCK.</b> A primeira mulher bloqueia neste semáforo <b>segurando o <code>mutex</code></b> da linha 16. Ela só será liberada quando o último homem sair — mas <code>homem_sai</code> precisa do <code>mutex</code> para decrementar o contador dele, e o mutex está justamente com ela. Os dois ficam presos: <b>posse-e-espera</b> mais <b>espera circular</b>.", true],
      ["19          printf(\"BANHEIRO COM MULHER\\n\");\n20      }",
       "Atende ao item <b>(i)</b>, e está no lugar certo — dentro do <code>if</code> da primeira."],
      ["21      mulheres_no_banheiro++;",
       "Incremento <b>protegido</b> pelo mutex. Se estivesse fora, seria a <b>condição de corrida</b>: duas mulheres poderiam ler 0 ao mesmo tempo, ambas tentarem adquirir <code>vazio</code> (uma ficaria presa para sempre), ou os incrementos se perderiam e o contador nunca zeraria — deixando o banheiro ocupado eternamente.", true],
      ["22      printf(\"Mulher %d entrou do banheiro\\n\", id);",
       "Atende ao item <b>(k)</b>."],
      ["23      sem_post(&mutex);\n24  }",
       "Sai da região crítica. Correto — mas tarde demais: se a execução bloqueou na linha 18, nunca se chega aqui."]
    ],
    saida: "<b>A correção:</b> soltar o mutex <b>antes</b> de bloquear e retomá-lo depois — <code>if (mulheres == 0) { sem_post(&mutex); sem_wait(&vazio); sem_wait(&mutex); }</code> — ou reorganizar para que o <code>sem_wait(&vazio)</code> aconteça fora da região crítica. A regra que atravessa a disciplina: <b>nunca bloqueie segurando uma trava de que outro precisa para te liberar</b>."
  },
  programa:{"arquivo": "unissex.c", "cod": "/* Banheiros UNISSEX — versao corrigida da Questao 4.\n   Uso: ./unissex <homens> <mulheres>                                  */\n#include <stdio.h>\n#include <stdlib.h>\n#include <pthread.h>\n#include <semaphore.h>\n#include <unistd.h>\n\nint total_homens, total_mulheres;\nint homens_no_banheiro = 0, mulheres_no_banheiro = 0;\n\nsem_t mutex_h;      /* 1: protege o contador dos homens   */\nsem_t mutex_m;      /* 1: protege o contador das mulheres */\nsem_t vazio;        /* 1: posse do banheiro por um genero */\n\n/* ── mulheres ─────────────────────────────────────────── */\nvoid mulher_quer_entrar(int id) {\n    sem_wait(&mutex_m);\n    mulheres_no_banheiro++;\n    if (mulheres_no_banheiro == 1) {         /* a PRIMEIRA toma posse */\n        sem_wait(&vazio);                    /* seguro: o mutex dos homens e outro */\n        printf(\"BANHEIRO COM MULHER\\n\");\n    }\n    sem_post(&mutex_m);\n    printf(\"Mulher %d entrou no banheiro\\n\", id);\n}\n\nvoid mulher_sai(int id) {\n    sem_wait(&mutex_m);\n    mulheres_no_banheiro--;\n    printf(\"Mulher %d saiu do banheiro\\n\", id);\n    if (mulheres_no_banheiro == 0) {         /* a ULTIMA devolve a posse */\n        printf(\"BANHEIRO VAZIO\\n\");\n        sem_post(&vazio);\n    }\n    sem_post(&mutex_m);\n}\n\n/* ── homens ───────────────────────────────────────────── */\nvoid homem_quer_entrar(int id) {\n    sem_wait(&mutex_h);\n    homens_no_banheiro++;\n    if (homens_no_banheiro == 1) {\n        sem_wait(&vazio);\n        printf(\"BANHEIRO COM HOMEM\\n\");\n    }\n    sem_post(&mutex_h);\n    printf(\"Homem %d entrou no banheiro\\n\", id);\n}\n\nvoid homem_sai(int id) {\n    sem_wait(&mutex_h);\n    homens_no_banheiro--;\n    printf(\"Homem %d saiu do banheiro\\n\", id);\n    if (homens_no_banheiro == 0) {\n        printf(\"BANHEIRO VAZIO\\n\");\n        sem_post(&vazio);\n    }\n    sem_post(&mutex_h);\n}\n\n/* ── as pessoas ───────────────────────────────────────── */\nvoid *Mulher(void *arg) {\n    int id = *(int *)arg;\n    mulher_quer_entrar(id);\n    usleep(2000);                            /* 2 ms usando o banheiro */\n    mulher_sai(id);\n    return NULL;\n}\n\nvoid *Homem(void *arg) {\n    int id = *(int *)arg;\n    homem_quer_entrar(id);\n    usleep(1000);                            /* 1 ms usando o banheiro */\n    homem_sai(id);\n    return NULL;\n}\n\n/* ── os geradores ─────────────────────────────────────── */\npthread_t *th_h, *th_m;\nint *id_h, *id_m;\n\nvoid *GeradorHomens(void *arg) {\n    for (int i = 0; i < total_homens; i++) {\n        id_h[i] = 2 * i + 1;                 /* impares a partir de 1 */\n        pthread_create(&th_h[i], NULL, Homem, &id_h[i]);\n        usleep(1000 + rand() % 3001);        /* entre 1 ms e 4 ms */\n    }\n    return NULL;\n}\n\nvoid *GeradorMulheres(void *arg) {\n    for (int i = 0; i < total_mulheres; i++) {\n        id_m[i] = 2 * i + 2;                 /* pares a partir de 2 */\n        pthread_create(&th_m[i], NULL, Mulher, &id_m[i]);\n        usleep(1000);                        /* a cada 1 ms */\n    }\n    return NULL;\n}\n\nint main(int argc, char **argv) {\n    pthread_t g_h, g_m;\n\n    total_homens   = argc > 1 ? atoi(argv[1]) : 3;\n    total_mulheres = argc > 2 ? atoi(argv[2]) : 3;\n\n    th_h = malloc(total_homens   * sizeof *th_h);  id_h = malloc(total_homens   * sizeof *id_h);\n    th_m = malloc(total_mulheres * sizeof *th_m);  id_m = malloc(total_mulheres * sizeof *id_m);\n\n    sem_init(&mutex_h, 0, 1);\n    sem_init(&mutex_m, 0, 1);\n    sem_init(&vazio,   0, 1);                /* banheiro comeca livre */\n\n    pthread_create(&g_h, NULL, GeradorHomens,   NULL);\n    pthread_create(&g_m, NULL, GeradorMulheres, NULL);\n    pthread_join(g_h, NULL);\n    pthread_join(g_m, NULL);                 /* geradores terminaram de criar */\n\n    for (int i = 0; i < total_homens;   i++) pthread_join(th_h[i], NULL);\n    for (int i = 0; i < total_mulheres; i++) pthread_join(th_m[i], NULL);\n\n    printf(\"fim: %d homens e %d mulheres usaram o banheiro\\n\",\n           total_homens, total_mulheres);\n    return 0;\n}", "compila": "gcc unissex.c -o unissex -pthread && ./unissex 3 3", "saida": "BANHEIRO COM HOMEM\nHomem 1 entrou no banheiro\nHomem 1 saiu do banheiro\nBANHEIRO VAZIO\nBANHEIRO COM MULHER\nMulher 2 entrou no banheiro\nMulher 4 entrou no banheiro\nMulher 2 saiu do banheiro\nMulher 4 saiu do banheiro\nBANHEIRO VAZIO\nBANHEIRO COM HOMEM\nHomem 3 entrou no banheiro\nHomem 5 entrou no banheiro\nHomem 3 saiu do banheiro\nHomem 5 saiu do banheiro\nBANHEIRO VAZIO\nBANHEIRO COM MULHER\nMulher 6 entrou no banheiro\nMulher 6 saiu do banheiro\nBANHEIRO VAZIO\nfim: 3 homens e 3 mulheres usaram o banheiro", "nota": "Esta é a implementação que a questão <b>não</b> pede (ela pede a análise), mas que mostra como seria sem os defeitos: <b>duas travas</b>, uma por contador, e o <code>sem_wait(&amp;vazio)</code> da primeira pessoa de cada gênero sem segurar a trava do outro gênero. A ordem das linhas muda a cada execução; o que <b>nunca</b> muda é o essencial — entre um <code>BANHEIRO COM HOMEM</code> e o <code>BANHEIRO VAZIO</code> seguinte não aparece nenhuma mulher, e vice-versa."},
  box: "<b>Exemplo de deadlock para escrever na prova:</b> o banheiro está COM HOMEM (um homem dentro, <code>vazio</code> tomado). Chega uma mulher: pega o <code>mutex</code> (linha 16), vê <code>mulheres == 0</code> (linha 17) e bloqueia em <code>sem_wait(&vazio)</code> (linha 18), <b>com o mutex na mão</b>. O homem termina e chama <code>homem_sai</code>, que começa com <code>sem_wait(&mutex)</code> — e bloqueia. Ninguém libera <code>vazio</code>, ninguém libera o <code>mutex</code>.<br><br><b>E mesmo a versão corrigida tem um problema:</b> <i>starvation</i>. Um fluxo contínuo de mulheres impede qualquer homem de entrar, porque o contador nunca chega a zero. Corrige-se com um <i>turnstile</i> — um semáforo de entrada que os recém-chegados precisam atravessar — ou com uma fila por ordem de chegada.<br><br><b>Cuidado com uma resolução que circula em PDF:</b> ela afirma que a linha 17 usa atribuição (<code>if (mulheres_no_banheiro = 0)</code>) em vez de comparação. <b>A foto da prova mostra <code>==</code></b> — a comparação está certa. Apontar esse &ldquo;erro&rdquo; na prova custaria pontos; o defeito que existe de verdade é o bloqueio da linha 18 dentro da região crítica.<br><br><i>Observação: a foto da prova mostra a página 2 de 4, com a especificação e o começo do código. Os demais procedimentos (</i><code>homem_quer_entrar</code><i>, </i><code>mulher_sai</code><i> e </i><code>homem_sai</code><i>) seguem o mesmo molde — verifique em cada um se há bloqueio dentro da região crítica e se o contador é alterado sob o mutex.</i>"
});
