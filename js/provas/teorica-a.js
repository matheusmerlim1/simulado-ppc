/* Prova Teórica — questões 1, 2 e 3 */

secaoProva({
  h: "Teórica · Q1 — Região crítica, condição de corrida e exclusão mútua",
  p: enunciado("Defina <i>Região Crítica</i>, <i>Condição de Corrida</i> e <i>Exclusão Mútua</i>. Qual é a relação entre esses conceitos?") +
     "<b>Região crítica</b> é o trecho de código em que um fluxo de execução acessa um <b>recurso compartilhado</b> — uma variável global, um arquivo, uma estrutura de dados — de forma que o acesso simultâneo de outro fluxo possa corromper o resultado. Não é o dado: é o <b>trecho de código</b> que mexe nele.<br><br>" +
     "<b>Condição de corrida</b> é a situação em que o resultado final do programa depende da <b>ordem em que as instruções dos fluxos são intercaladas</b> pelo escalonador. O sintoma é o <b>não determinismo</b>: com a mesma entrada, execuções diferentes produzem resultados diferentes — e às vezes o resultado sai certo por acaso, o que faz o erro passar nos testes.<br><br>" +
     "<b>Exclusão mútua</b> é a propriedade — e o conjunto de mecanismos que a garantem — que assegura que <b>no máximo um fluxo por vez</b> esteja dentro da região crítica. É implementada com travas, semáforos, mutexes ou monitores.<br><br>" +
     "<b>A relação, que é o que a questão realmente pede:</b><br>" +
     "&bull; a <b>condição de corrida</b> é o <i>problema</i>;<br>" +
     "&bull; a <b>região crítica</b> é <i>onde</i> o problema acontece;<br>" +
     "&bull; a <b>exclusão mútua</b> é a <i>solução</i>.<br><br>" +
     "Na prática o raciocínio é sempre este: identifica-se a região crítica e aplica-se exclusão mútua sobre ela, o que elimina a condição de corrida.",
  anotado: {
    enunciado: "O exemplo que sustenta a resposta: por que <code>contador++</code>, uma linha só em C, tem região crítica.",
    linhas: [
      ["contador++;   /* em C, parece indivisível */",
       "Uma linha da linguagem não é uma instrução do processador. O compilador gera três."],
      ["mov  eax, [contador]",
       "<b>1. Lê</b> o valor da memória para um registrador <b>da thread</b>. Se a troca de contexto cair aqui, essa thread guarda um valor que vai envelhecer.", true],
      ["add  eax, 1",
       "<b>2. Soma</b> no registrador. A memória ainda não mudou."],
      ["mov  [contador], eax",
       "<b>3. Grava</b> de volta, por cima do que estiver lá — inclusive por cima do que outra thread gravou nesse meio-tempo.", true],
      ["A le 5 ... troca ... B le 5\nA grava 6  ...  B grava 6",
       "A intercalação infeliz: dois incrementos, um só efeito. É a <b>atualização perdida</b>, e é exatamente a condição de corrida.", true]
    ],
    saida: "As três instruções juntas são a <b>região crítica</b>. Protegê-las com um mutex ou um semáforo é aplicar <b>exclusão mútua</b>, e o resultado deixa de depender da ordem de escalonamento."
  },
  box: "<b>O que faz perder ponto:</b> (1) definir região crítica como &ldquo;a variável compartilhada&rdquo; — é o <i>trecho de código</i>; (2) dizer que condição de corrida é &ldquo;quando duas threads usam a mesma variável&rdquo; — só há corrida se ao menos uma <b>escreve</b>; (3) responder as três definições e <b>esquecer a relação</b>, que é metade da questão."
});

secaoProva({
  h: "Teórica · Q2 — Semáforos, monitores e mutexes",
  p: enunciado("Compare semáforos, monitores e mutexes. Quais são suas primitivas? Como elas funcionam?") +
     "<b>Semáforo</b> (Dijkstra, 1965) é uma estrutura com uma <b>variável inteira</b> e uma <b>lista de processos bloqueados</b>. Duas operações <b>atômicas</b>:<br>" +
     "&bull; <code>wait</code> / <code>down</code> / <code>P(s)</code> — decrementa o contador; se ficar negativo, o processo <b>bloqueia</b> nessa lista;<br>" +
     "&bull; <code>post</code> / <code>signal</code> / <code>up</code> / <code>V(s)</code> — incrementa; se havia alguém bloqueado, <b>acorda</b> um.<br>" +
     "O <b>valor inicial</b> define o papel: <b>1</b> → exclusão mútua; <b>N</b> → conta N instâncias de um recurso; <b>0</b> → impõe <b>ordem</b> entre threads. Em POSIX: <code>sem_init</code>, <code>sem_wait</code>, <code>sem_post</code>, <code>sem_destroy</code>.<br><br>" +
     "<b>Mutex</b> é uma trava binária <b>com dono</b>. Primitivas: <code>lock</code> (trava, bloqueando se preciso), <code>unlock</code> (destrava) e <code>trylock</code> (tenta sem bloquear). Em POSIX: <code>pthread_mutex_lock/unlock</code>. A diferença essencial para o semáforo binário é o <b>ownership</b>: <b>só a thread que travou pode destravar</b>.<br><br>" +
     "<b>Monitor</b> é uma construção de <b>linguagem</b>, não de biblioteca: um módulo cujos dados são privados e cujos procedimentos têm <b>exclusão mútua implícita</b>, garantida pelo compilador. Apenas um processo fica ativo dentro do monitor por vez. Para esperar por condições existem as <b>variáveis de condição</b>: <code>wait(c)</code> <b>libera o monitor</b> e bloqueia; <code>signal(c)</code> acorda quem esperava. Exemplo real: <code>synchronized</code> em Java, com <code>wait()</code> e <code>notify()</code>/<code>notifyAll()</code>.<br><br>" +
     "<b>Como fechar a comparação:</b><br>" +
     "&bull; <b>Poder de expressão</b> — semáforo &gt; mutex &gt; monitor. Só o semáforo conta recursos e impõe ordem.<br>" +
     "&bull; <b>Segurança</b> — monitor &gt; mutex &gt; semáforo. Só o monitor impede o programador de esquecer de destravar.<br>" +
     "&bull; <b>Quando usar</b> — mutex quando o problema é <b>só</b> proteger uma região crítica; semáforo quando é preciso contar ou ordenar; monitor quando a linguagem oferece.",
  cod: "SEMAFORO                    MUTEX                        MONITOR\n" +
       "sem_t s;                    pthread_mutex_t m;           synchronized void f() {\n" +
       "sem_init(&s, 0, 1);         pthread_mutex_lock(&m);          /* regiao critica */\n" +
       "sem_wait(&s);                   contador++;                  /* trava implicita */\n" +
       "    contador++;             pthread_mutex_unlock(&m);    }\n" +
       "sem_post(&s);\n\n" +
       "inicial 1 -> exclusao       tem DONO: so quem travou     o compilador trava\n" +
       "inicial N -> conta N        pode destravar               e destrava por voce\n" +
       "inicial 0 -> ordem",
  box: "<b>A pegadinha da questão:</b> ela pede <b>as primitivas</b> e <b>como funcionam</b>. Não basta listar <code>wait</code>/<code>post</code> — é preciso dizer o que cada uma faz com o contador e com a fila de bloqueados. E a diferença entre semáforo binário e mutex (o <b>dono</b>) é o ponto que separa a resposta completa da incompleta."
});

secaoProva({
  h: "Teórica · Q3 — Os seis padrões de projeto concorrente",
  p: enunciado("Explique os seguintes padrões de projeto concorrente: (a) Fork/Join, (b) Travar &amp; Destravar, (c) Dormir e acordar, (d) Despachante-operário, (e) Pipeline, (f) Barreiras.") +
     "<b>(a) Fork/Join.</b> O fluxo principal <b>divide</b> o trabalho criando N fluxos que executam em paralelo e depois <b>espera</b> todos terminarem antes de seguir. É o padrão base: <code>fork()</code>+<code>wait()</code> para processos, <code>pthread_create()</code>+<code>pthread_join()</code> para threads. Combina naturalmente com <b>redução</b>: cada thread acumula um resultado parcial numa variável privada e o mestre combina tudo depois do join — sem região crítica nenhuma.<br><br>" +
     "<b>(b) Travar &amp; Destravar.</b> Adquirir uma trava <b>antes</b> de entrar na região crítica e liberá-la <b>depois</b> de sair: <code>lock</code>/<code>unlock</code>, <code>sem_wait</code>/<code>sem_post</code>. É o padrão da exclusão mútua. <b>Riscos:</b> esquecer de destravar (trava para sempre); travar dois recursos em ordens diferentes em threads diferentes (deadlock); granularidade grossa demais, que serializa o programa.<br><br>" +
     "<b>(c) Dormir e acordar.</b> Em vez de espera ocupada, a thread que não pode prosseguir se <b>bloqueia</b> (<code>sleep</code>) e é <b>acordada</b> por outra (<code>wakeup</code>) quando a condição muda. Economiza CPU, porque a thread bloqueada sai da fila do escalonador. <b>Problema clássico — o sinal perdido:</b> se o <code>wakeup</code> chega <i>antes</i> de a thread conseguir dormir, o aviso se perde e ela dorme para sempre. O semáforo resolve porque <b>guarda o sinal no contador</b>.<br><br>" +
     "<b>(d) Despachante-operário.</b> Uma thread <b>despachante</b> recebe as tarefas e as distribui para um conjunto <b>fixo</b> de threads <b>operárias</b>, criadas de antemão — é o <i>thread pool</i>. Ganhos: as threads são criadas uma única vez (some o custo de criação por tarefa) e o tamanho do pool <b>limita a concorrência</b>. <b>Com fila</b>, as tarefas que chegam com todas ocupadas esperam; <b>sem fila</b>, são descartadas. A fila é região crítica.<br><br>" +
     "<b>(e) Pipeline.</b> A tarefa é quebrada em <b>estágios sequenciais</b> e cada estágio vira uma thread, ligados por buffers. Melhora a <b>vazão</b> — com o pipeline cheio, sai um item a cada tempo do <b>estágio mais lento</b> —, mas não a <b>latência</b> de um item, que ainda atravessa todos os estágios. Otimizar um pipeline é atacar o gargalo.<br><br>" +
     "<b>(f) Barreiras.</b> Ponto de sincronização em que <b>nenhuma thread passa até que todas cheguem</b>. Serve para separar fases de um cálculo em que a fase seguinte depende do que todas produziram na anterior. Implementa-se com um contador protegido por mutex e um semáforo iniciado em 0; prontas nas bibliotecas: <code>pthread_barrier_t</code> e <code>CyclicBarrier</code>. Custo: todas ficam limitadas à thread mais lenta.",
  cod: "PADRAO                O QUE RESOLVE              COM O QUE SE FAZ\n" +
       "----------------------------------------------------------------------\n" +
       "Fork/Join             dividir e esperar          create + join\n" +
       "Travar & Destravar    exclusao mutua             mutex / semaforo = 1\n" +
       "Dormir e acordar      esperar sem gastar CPU     sleep/wakeup, semaforo\n" +
       "Despachante-operario  reaproveitar threads       pool + fila (prod/cons)\n" +
       "Pipeline              vazao em etapas            buffers entre estagios\n" +
       "Barreiras             sincronizar fases          contador + semaforo = 0",
  box: "<b>Como responder em 2 pontos:</b> para cada padrão, <b>uma frase</b> dizendo o que ele faz, <b>uma</b> dizendo com que mecanismo se implementa, e <b>uma</b> com o risco ou a limitação. São seis itens numa questão só — respostas longas demais em (a) costumam deixar (e) e (f) pela metade."
});
