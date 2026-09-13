/* Código comentado — Padrões de Projeto Concorrente */
anotar([

{
  mod: "padroes",
  h: "Barreiras",
  enunciado: "Implemente <code>esperar_barreira()</code> com semáforos: nenhuma das N threads passa até que todas tenham chegado.",
  linhas: [
    ["sem_t mutex;   /* sem_init(&mutex, 0, 1) */\nsem_t porta;   /* sem_init(&porta, 0, 0) */\nint chegaram = 0;",
     "<code>mutex</code> protege o contador; <code>porta</code> começa em <b>0</b> para que o <code>wait</code> nela bloqueie. <code>chegaram</code> é compartilhado.", true],
    ["void esperar_barreira(void) {\n    sem_wait(&mutex);",
     "O teste e o incremento do contador são região crítica: sem o mutex, dois <code>chegaram++</code> simultâneos se perdem e a barreira nunca abre."],
    ["    chegaram++;",
     "Registra a chegada desta thread."],
    ["    if (chegaram == N) {",
     "Esta é a <b>última</b> a chegar: não precisa esperar ninguém."],
    ["        for (int i = 0; i < N - 1; i++)\n            sem_post(&porta);",
     "Libera as <b>N&minus;1</b> que estão dormindo na porta. Um <code>post</code> para cada uma.", true],
    ["        sem_post(&mutex);\n    } else {",
     "A última solta o mutex e segue direto, sem dormir."],
    ["        sem_post(&mutex);",
     "As outras soltam o mutex <b>antes</b> de dormir. Se dormissem com ele, a próxima thread não conseguiria nem entrar para contar — deadlock.", true],
    ["        sem_wait(&porta);\n    }\n}",
     "Dorme até a última chegar. Como o semáforo guarda o sinal, não importa se o <code>post</code> vem antes ou depois deste <code>wait</code>."]
  ],
  saida: "Todas passam juntas, só depois da mais lenta. Esta versão é de <b>uso único</b>: para usar a barreira em várias rodadas seguidas é preciso a catraca dupla. Pronta nas bibliotecas: <code>pthread_barrier_wait</code> e <code>CyclicBarrier.await()</code>."
},

{
  mod: "padroes",
  h: "Produtor/consumidor",
  enunciado: "Um buffer de N posições entre um produtor e um consumidor. Nenhum item pode se perder, o buffer não pode estourar nem ser lido vazio, e ninguém pode ficar em espera ocupada.",
  linhas: [
    ["sem_t vazio;   /* sem_init(&vazio, 0, N) */\nsem_t cheio;   /* sem_init(&cheio, 0, 0) */\nsem_t mutex;   /* sem_init(&mutex, 0, 1) */",
     "Dois semáforos de <b>contagem</b> — lugares livres (começa em N) e itens prontos (começa em 0) — e um <b>binário</b> que protege a estrutura do buffer.", true],
    ["void *produtor(void *arg) {\n    while (1) {\n        int item = produzir();",
     "Produz <b>fora</b> da região crítica: travar durante o trabalho útil serializaria o programa."],
    ["        sem_wait(&vazio);",
     "Reserva um lugar. Com o buffer cheio, o produtor <b>dorme aqui</b> — ainda sem segurar o mutex.", true],
    ["        sem_wait(&mutex);",
     "Só agora trava o buffer. Inverter com a linha de cima faz o produtor dormir com o mutex na mão quando o buffer enche, e o consumidor nunca mais entra: deadlock.", true],
    ["        inserir(item);",
     "Mexe no buffer com exclusão mútua garantida."],
    ["        sem_post(&mutex);",
     "Solta o buffer o quanto antes."],
    ["        sem_post(&cheio);\n    }\n}",
     "Avisa que há mais um item. Se o consumidor dormia em <code>cheio</code>, é acordado."],
    ["void *consumidor(void *arg) {\n    while (1) {\n        sem_wait(&cheio);",
     "Espelho do produtor: espera haver item. Com o buffer vazio, dorme aqui, sem mutex.", true],
    ["        sem_wait(&mutex);\n        int item = retirar();\n        sem_post(&mutex);",
     "Retira sob exclusão mútua e solta logo."],
    ["        sem_post(&vazio);\n        consumir(item);\n    }\n}",
     "Devolve um lugar livre (acordando o produtor, se ele dormia) e consome <b>fora</b> da região crítica."]
  ],
  saida: "A regra que o exemplo ensina vale para a disciplina inteira: semáforos de condição <b>por fora</b>, mutex <b>por dentro</b> — nunca bloqueie segurando uma trava de que outro precisa para te liberar."
},

{
  mod: "padroes",
  h: "Leitores e escritores",
  enunciado: "Vários leitores podem ler a base ao mesmo tempo; um escritor precisa dela sozinho. Esta é a solução com prioridade para os leitores.",
  linhas: [
    ["sem_t mutex;   /* 1: protege rc     */\nsem_t db;      /* 1: trava a base   */\nint rc = 0;    /* leitores lendo    */",
     "<code>db</code> é a trava da base inteira. <code>rc</code> conta os leitores ativos e, por ser compartilhado, precisa do <code>mutex</code>.", true],
    ["void *leitor(void *arg) {\n    sem_wait(&mutex);\n    rc = rc + 1;",
     "Entra na contagem de leitores sob exclusão mútua."],
    ["    if (rc == 1) sem_wait(&db);",
     "Só o <b>primeiro</b> leitor trava a base — em nome de todos os leitores. Os seguintes entram direto, sem olhar para <code>db</code>.", true],
    ["    sem_post(&mutex);",
     "Solta o contador antes de ler: a leitura pode ser demorada e acontece em paralelo com outros leitores."],
    ["    ler_base();",
     "Leituras simultâneas são seguras: condição de corrida exige ao menos uma escrita."],
    ["    sem_wait(&mutex);\n    rc = rc - 1;",
     "Sai da contagem, de novo sob o mutex."],
    ["    if (rc == 0) sem_post(&db);\n    sem_post(&mutex);\n}",
     "Só o <b>último</b> leitor libera a base. Se as leituras se sobrepõem, <code>rc</code> nunca chega a zero.", true],
    ["void *escritor(void *arg) {\n    sem_wait(&db);\n    escrever_base();\n    sem_post(&db);\n}",
     "O escritor pede a base inteira e espera enquanto houver <b>qualquer</b> leitor. Com leitores chegando sem parar, ele espera para sempre: <i>starvation</i> do escritor.", true]
  ],
  saida: "Correto — sem corrida e sem deadlock —, mas <b>injusto</b> com o escritor. A correção de Courtois, Heymans e Parnas (1971) faz o primeiro escritor que chega fechar a porta para novos leitores."
},

{
  mod: "padroes",
  h: "Jantar dos filósofos",
  enunciado: "Solução de Tanenbaum: cada filósofo só pega os garfos quando <b>os dois</b> estão livres, decidido sob um mutex, e dorme num semáforo próprio enquanto espera.",
  linhas: [
    ["#define ESQ(i) (((i) + N - 1) % N)\n#define DIR(i) (((i) + 1) % N)",
     "Vizinhos do filósofo <code>i</code>. Soma-se N antes do resto porque, em C, <code>-1 % 5</code> dá <b>-1</b>, um índice inválido."],
    ["int   estado[N];   /* PENSANDO, FAMINTO, COMENDO */\nsem_t s[N];         /* sem_init(&s[i], 0, 0)     */\nsem_t mutex;        /* sem_init(&mutex, 0, 1)    */",
     "O estado de todos, protegido por um mutex, e <b>um semáforo por filósofo</b>, iniciado em 0, onde cada um dorme.", true],
    ["void testa(int i) {\n    if (estado[i] == FAMINTO &&\n        estado[ESQ(i)] != COMENDO &&\n        estado[DIR(i)] != COMENDO) {",
     "Pode comer se quer comer e <b>nenhum</b> vizinho está comendo — ou seja, os dois garfos estão livres."],
    ["        estado[i] = COMENDO;\n        sem_post(&s[i]);\n    }\n}",
     "Marca como comendo — pega os dois garfos <b>de uma vez</b> — e acorda o filósofo. Ninguém nunca segura um garfo só: some a posse-e-espera.", true],
    ["void pega_garfos(int i) {\n    sem_wait(&mutex);\n    estado[i] = FAMINTO;\n    testa(i);\n    sem_post(&mutex);",
     "Declara a fome e testa, tudo sob o mutex, para que o estado dos vizinhos não mude no meio do teste."],
    ["    sem_wait(&s[i]);\n}",
     "Se <code>testa</code> liberou, o <code>post</code> já está guardado e este <code>wait</code> passa direto. Se não, dorme aqui — <b>fora</b> do mutex.", true],
    ["void devolve_garfos(int i) {\n    sem_wait(&mutex);\n    estado[i] = PENSANDO;",
     "Volta a pensar: com o estado em <code>PENSANDO</code>, os dois garfos dele passam a contar como livres para os vizinhos."],
    ["    testa(ESQ(i));\n    testa(DIR(i));\n    sem_post(&mutex);\n}",
     "Os únicos que podem ter ganho a chance de comer são os dois vizinhos: testa os dois e acorda quem puder.", true]
  ],
  saida: "Sem deadlock, e dois filósofos não vizinhos podem comer ao mesmo tempo. Ainda pode haver <b>starvation</b>: dois vizinhos se revezando deixam o do meio com fome."
}

]);
