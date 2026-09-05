/* ─── Exclusão Mútua ────────────────────────────────────────
   P1 · 31 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"em01a", mod:"exclusao", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 1",
  enunciado:"Defina <b>Região Crítica</b>.",
  chaves:[
    ["trecho de código","trecho","parte do código","região do código","pedaço do código"],
    ["recurso compartilhado","compartilhad","variável global","memória comum"],
    ["acesso simultâneo","ao mesmo tempo","simultân","concorrent","dois fluxos"],
    ["corromper o resultado","corromp","inconsistent","resultado errado","dado errado"]
  ],
  gabarito:"<b>Região crítica</b> é o trecho de código em que um fluxo de execução acessa um <b>recurso compartilhado</b> (variável, arquivo, estrutura de dados) de forma que o acesso simultâneo de outro fluxo possa corromper o resultado.<br><br><i>Exemplo:</i> em <code>contador++</code>, a região crítica é justamente esse incremento, porque ele vira <i>ler &rarr; somar &rarr; escrever</i> na memória."
},
{
  id:"em01b", mod:"exclusao", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 1",
  enunciado:"Defina <b>Condição de Corrida</b>.",
  chaves:[
    ["depende da ordem","ordem de execução","ordem das instruções","intercal","entrelaç"],
    ["escalonador","escalonamento","sistema operacional decide"],
    ["não determinismo","nao deterministico","indetermin","imprevisível"],
    ["mesma entrada, resultados diferentes","mesma entrada","execuções diferentes","resultados diferentes","resultado diferente","às vezes dá certo"]
  ],
  gabarito:"<b>Condição de corrida</b> é a situação em que o resultado final do programa depende da <b>ordem em que as instruções dos fluxos são intercaladas</b> pelo escalonador.<br><br>O sintoma é o <b>não determinismo</b>: com a mesma entrada, execuções diferentes dão resultados diferentes — e às vezes o resultado sai certo por acaso, o que faz o bug passar nos testes."
},
{
  id:"em01c", mod:"exclusao", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 1",
  enunciado:"Defina <b>Exclusão Mútua</b>.",
  chaves:[
    ["no máximo um por vez","um por vez","apenas um","somente um","só um","um único"],
    ["região crítica","seção crítica"],
    ["fluxo de execução","thread","processo"],
    ["mutex, semáforo ou monitor","mutex","semáforo","trava","lock","monitor"]
  ],
  gabarito:"<b>Exclusão mútua</b> é a propriedade — e o conjunto de mecanismos que a garantem — que assegura que <b>no máximo um fluxo de execução por vez</b> esteja dentro da região crítica.<br><br>É implementada com travas, semáforos, mutexes ou monitores."
},
{
  id:"em01d", mod:"exclusao", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 1",
  enunciado:"Qual é a <b>relação</b> entre região crítica, condição de corrida e exclusão mútua?",
  chaves:[
    ["condição de corrida","corrida"],
    ["é o problema","problema"],
    ["região crítica"],
    ["é onde acontece","onde","local","lugar"],
    ["exclusão mútua"],
    ["é a solução","solução","resolve","elimina","corrige"]
  ],
  gabarito:"&bull; A <b>condição de corrida</b> é o <i>problema</i>.<br>&bull; A <b>região crítica</b> é <i>onde</i> o problema acontece.<br>&bull; A <b>exclusão mútua</b> é a <i>solução</i>.<br><br>Na prática: identifica-se a região crítica e aplica-se exclusão mútua sobre ela, eliminando a condição de corrida.<br><br><b>Observação que vale ponto:</b> a exclusão mútua também é uma das quatro condições de Coffman para deadlock. Ou seja, a solução de um problema é ingrediente do outro — travar demais, ou em ordens diferentes, troca a corrida por travamento."
},
{
  id:"em02a", mod:"exclusao", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 2",
  enunciado:"O que é um <b>semáforo</b>? Quais são suas primitivas e como elas funcionam?",
  chaves:[
    ["variável inteira","inteiro","contador","valor inteiro","número"],
    ["operações atômicas","atômic","atomic","indivisível"],
    ["down / wait / P(s)","down","wait","p(s)","sem_wait"],
    ["up / signal / V(s)","up","signal","v(s)","sem_post"],
    ["bloqueia numa fila de espera","bloquei","fila de espera","dorme","adormece"],
    ["valor inicial: 1, N ou 0","valor inicial","binário","de contagem","inicializ","inicial"]
  ],
  gabarito:"<b>Semáforo</b> é uma variável inteira não-negativa com duas operações <b>atômicas</b>:<br><br>&bull; <code>down / wait / P(s)</code> — decrementa o contador; se ele ficar negativo, o processo <b>bloqueia</b> numa fila de espera.<br>&bull; <code>up / signal / V(s)</code> — incrementa o contador; se havia alguém bloqueado, <b>acorda</b> um deles.<br><br>O valor inicial define o uso:<br>&bull; <b>1</b> &rarr; semáforo binário, para exclusão mútua;<br>&bull; <b>N</b> &rarr; semáforo de contagem, controla N instâncias de um recurso;<br>&bull; <b>0</b> &rarr; sinalização, para impor <b>ordem</b> de execução entre threads.<br><br>Em POSIX: <code>sem_init</code>, <code>sem_wait</code>, <code>sem_post</code>, <code>sem_destroy</code>."
},
{
  id:"em02b", mod:"exclusao", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 2",
  enunciado:"O que é um <b>mutex</b>? Quais suas primitivas e qual a diferença essencial para um semáforo binário?",
  chaves:[
    ["trava binária","binári","trava","travar"],
    ["tem dono (ownership)","dono","ownership","proprietári","quem travou"],
    ["lock","lock","pthread_mutex_lock","travar"],
    ["unlock","unlock","pthread_mutex_unlock","destravar"],
    ["trylock","trylock","sem bloquear","tenta travar"],
    ["só quem travou pode destravar","quem travou pode destravar","mesma thread","a própria thread","só a thread"]
  ],
  gabarito:"<b>Mutex</b> é uma trava binária <b>com dono</b>. Primitivas: <code>lock</code> (trava, bloqueando se já estiver travado), <code>unlock</code> (destrava) e <code>trylock</code> (tenta sem bloquear). Em POSIX: <code>pthread_mutex_lock/unlock</code>.<br><br><b>Diferença essencial:</b> só a thread que travou pode destravar (<i>ownership</i>). O semáforo binário não tem dono — qualquer thread pode dar <code>post</code>.<br><br><b>Consequência prática:</b> o mutex serve <i>exclusivamente</i> para exclusão mútua, mas em troca permite detectar erros e implementar herança de prioridade. O semáforo, por não ter dono, também serve para <b>sinalizar</b> entre threads (A espera, B libera) — algo que o mutex não faz."
},
{
  id:"em02c", mod:"exclusao", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 2",
  enunciado:"O que é um <b>monitor</b>? Como ele garante exclusão mútua e o que são as variáveis de condição?",
  chaves:[
    ["construção de linguagem","linguagem","compilador","synchronized"],
    ["exclusão mútua implícita","implícit","automátic","garantida pelo compilador"],
    ["variáveis de condição","variável de condição","condition"],
    ["wait","wait","espera"],
    ["signal","signal","acorda","sinaliz"],
    ["o wait libera o monitor","libera o monitor","libera a trava","solta o monitor","libera o mutex"]
  ],
  gabarito:"<b>Monitor</b> é uma construção de <b>linguagem</b> (não de biblioteca): um módulo em que os dados são privados e <b>todos os procedimentos têm exclusão mútua implícita</b>, garantida pelo compilador. Apenas um processo fica ativo dentro do monitor por vez.<br><br>Para esperar por condições usa-se <b>variáveis de condição</b>, com duas primitivas:<br>&bull; <code>wait(c)</code> — <b>libera o monitor</b> e bloqueia a thread;<br>&bull; <code>signal(c)</code> — acorda uma thread que esperava em <code>c</code>.<br><br>O detalhe crítico é o <code>wait</code> liberar o monitor ao bloquear: sem isso ninguém mais conseguiria entrar para sinalizar, e o monitor travaria.<br><br><b>Vantagem:</b> o programador não pode esquecer de destravar. Exemplo real: <code>synchronized</code> em Java. Em C não existe monitor nativo — daí a disciplina trabalhar com semáforos e mutexes."
},
{
  id:"em02d", mod:"exclusao", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 2",
  enunciado:"Compare semáforo, mutex e monitor: quando usar cada um?",
  chaves:[
    ["mutex"],
    ["semáforo"],
    ["monitor"],
    ["proteger a região crítica","região crítica","exclusão mútua"],
    ["contar N instâncias ou impor ordem","n instâncias","contar","impor ordem","sinaliz","ordem de execução"],
    ["monitor é o mais seguro","mais seguro","compilador","linguagem oferece"]
  ],
  gabarito:"<b>Mutex</b> — quando o problema é <b>só</b> proteger uma região crítica. É o mais simples e o mais seguro dos dois de biblioteca, porque tem dono.<br><br><b>Semáforo</b> — quando é preciso mais que exclusão mútua: contar N instâncias de um recurso (<code>=N</code>) ou impor <b>ordem</b> de execução entre threads (<code>=0</code>). É o mais poderoso e o mais fácil de errar: nada amarra o <code>wait</code> ao <code>post</code>, e bloquear nele segurando um mutex é deadlock na certa.<br><br><b>Monitor</b> — quando a linguagem oferece. É o mais seguro dos três, porque a exclusão mútua é responsabilidade do compilador.<br><br><b>Resumo:</b> segurança cresce de semáforo &rarr; mutex &rarr; monitor; poder de expressão cresce no sentido contrário."
},
{
  id:"em03", mod:"exclusao", dif:"facil", tipo:"mc",
  fonte:"Slides / Tanenbaum cap. 2",
  enunciado:"Quais condições uma boa solução de exclusão mútua precisa satisfazer?",
  opcoes:[
    "(1) Nunca dois processos simultaneamente na região crítica; (2) nenhuma suposição sobre velocidade ou número de CPUs; (3) nenhum processo fora da sua região crítica pode bloquear outro; (4) nenhum processo deve esperar eternamente para entrar.",
    "(1) Só um processo por CPU; (2) todos os processos com a mesma prioridade; (3) o escalonador deve ser FIFO; (4) sem preempção.",
    "(1) Uso obrigatório de semáforos; (2) espera ocupada proibida; (3) prioridade fixa; (4) memória compartilhada.",
    "(1) Nenhum processo pode ser interrompido; (2) as regiões críticas devem ter o mesmo tamanho; (3) o número de processos deve ser par; (4) sem variáveis globais."
  ],
  correta:0,
  gabarito:"São as quatro condições clássicas de Tanenbaum. A (1) é a exclusão mútua propriamente dita; a (2) impede soluções que só funcionem em certa velocidade relativa; a (3) elimina a alternância estrita; e a (4) é a ausência de <i>starvation</i>. Repare que desativar interrupções violaria a (2) num sistema multiprocessador — desativar interrupção de um núcleo não impede outro núcleo de entrar na região crítica."
},
{
  id:"em04", mod:"exclusao", dif:"medio", tipo:"mc",
  fonte:"Slides · Exclusão Mútua",
  enunciado:"Por que <code>contador++</code> pode gerar condição de corrida mesmo sendo uma única linha em C?",
  cod:"/* contador++ vira, em assembly, algo como: */\n    mov  eax, [contador]     ; 1) LE  o valor da memoria\n    add  eax, 1              ; 2) INCREMENTA no registrador\n    mov  [contador], eax     ; 3) ESCREVE de volta na memoria",
  opcoes:[
    "Porque a operação vira três instruções de máquina (ler, incrementar, escrever) e o escalonador pode trocar de thread entre elas, fazendo um incremento sobrescrever o outro.",
    "Porque o compilador C não garante a ordem de avaliação dos operandos.",
    "Porque <code>int</code> não cabe num registrador em máquinas de 64 bits.",
    "Não gera — <code>++</code> é atômico por definição na linguagem C."
  ],
  correta:0,
  gabarito:"A operação é <b>read-modify-write</b>, não atômica. Se duas threads lêem 5 ao mesmo tempo, ambas calculam 6 e ambas escrevem 6: dois incrementos produziram um só. É exatamente o que faz a Questão 1 da Prova Prática (1000 threads incrementando + 1000 decrementando) terminar com um valor diferente de zero sem proteção."
},
{
  id:"em05", mod:"exclusao", dif:"dificil", tipo:"mc",
  fonte:"Lab · Exclusão Mútua, Q6",
  enunciado:"Por que a solução de exclusão mútua com <b>variável de trava</b> (<i>lock variable</i>) não funciona?",
  cod:"int trava = 0;                 /* variavel compartilhada */\n\nvoid entra_regiao_critica(void) {\n    while (trava == 1)         /* A) espera enquanto estiver travado */\n        ;\n    trava = 1;                 /* B) trava */\n}\n\nvoid sai_regiao_critica(void) {\n    trava = 0;\n}",
  opcoes:[
    "Porque testar a trava (A) e escrevê-la (B) não é uma operação atômica: duas threads podem ler <code>trava == 0</code> antes que qualquer uma escreva 1, e ambas entram na região crítica.",
    "Porque a variável <code>trava</code> precisa ser <code>volatile</code>, e sem isso o compilador remove o laço.",
    "Porque a espera ocupada consome CPU, o que torna a solução incorreta.",
    "Porque só funciona com dois processos; com três ou mais estaria correta."
  ],
  correta:0,
  gabarito:"O problema é a <b>janela entre o teste e a escrita</b>. É a demonstração pedida no Q6 do laboratório: simule um escalonamento em que a thread A sai do <code>while</code> (viu trava = 0) e é preemptada <i>antes</i> de fazer <code>trava = 1</code>; a thread B também vê 0, entra, e agora as duas estão na região crítica. Note que a própria variável de trava virou uma nova região crítica — é um problema circular. A saída é uma instrução atômica de hardware (<code>TSL</code>, <code>XCHG</code>, <i>compare-and-swap</i>) ou um algoritmo como o de Peterson. A espera ocupada e o <code>volatile</code> são problemas reais, mas secundários: o erro de <b>correção</b> é a não-atomicidade."
},
{
  id:"em06", mod:"exclusao", dif:"dificil", tipo:"mc",
  fonte:"Slides / Tanenbaum cap. 2",
  enunciado:"A solução por <b>alternância estrita</b> garante exclusão mútua, mas é considerada ruim. Qual condição de uma boa solução ela viola?",
  cod:"/* processo 0 */                    /* processo 1 */\nwhile (TRUE) {                     while (TRUE) {\n    while (turno != 0) ;               while (turno != 1) ;\n    regiao_critica();                  regiao_critica();\n    turno = 1;                         turno = 0;\n    regiao_nao_critica();              regiao_nao_critica();\n}                                  }",
  opcoes:[
    "&ldquo;Nenhum processo fora da sua região crítica pode bloquear outro processo&rdquo; — se o processo 0 demorar na região <b>não</b> crítica, o processo 1 fica travado esperando a vez.",
    "&ldquo;Nunca dois processos simultaneamente na região crítica&rdquo; — a alternância permite os dois entrarem.",
    "&ldquo;Nenhuma suposição sobre o número de CPUs&rdquo; — a solução só funciona em máquina de um núcleo.",
    "Não viola nenhuma; a alternância estrita é a solução recomendada para dois processos."
  ],
  correta:0,
  gabarito:"A alternância estrita força a ordem 0, 1, 0, 1, ... Se o processo 0 sai da região crítica, faz <code>turno = 1</code> e vai fazer um trabalho longo fora dela, o processo 1 executa sua região crítica, devolve <code>turno = 0</code> e <b>não pode entrar de novo</b> — mesmo com a região crítica livre — até que o processo 0 volte. Um processo que está fora da região crítica está bloqueando o outro. Além disso há espera ocupada. O algoritmo de <b>Peterson</b> corrige isso combinando um vetor de interesse (<code>flag[]</code>) com a variável <code>turno</code>."
},
{
  id:"em07", mod:"exclusao", dif:"medio", tipo:"mc",
  fonte:"Slides · Exclusão Mútua",
  enunciado:"Qual é a diferença essencial entre um <b>semáforo binário</b> e um <b>mutex</b>?",
  opcoes:[
    "O mutex tem <b>dono</b>: só a thread que o travou pode destravá-lo. O semáforo binário pode ser liberado por qualquer thread, o que permite usá-lo também para sinalização entre threads.",
    "O mutex é implementado em hardware e o semáforo em software.",
    "O semáforo só funciona entre processos e o mutex só entre threads.",
    "Não há diferença prática: são dois nomes para a mesma primitiva."
  ],
  correta:0,
  gabarito:"A <b>posse (ownership)</b> é a diferença que importa na prova. Ela permite ao mutex detectar erros (destravar algo que você não travou) e implementar herança de prioridade. Como o semáforo não tem dono, ele serve para um caso que o mutex não cobre: a thread A faz <code>sem_wait</code> e fica esperando até que a thread B faça <code>sem_post</code> — que é como se constrói ordem de execução, barreiras e o padrão produtor/consumidor."
},
{
  id:"em08", mod:"exclusao", dif:"medio", tipo:"mc",
  fonte:"Slides · Exclusão Mútua",
  enunciado:"O que exatamente fazem as primitivas de um semáforo?",
  opcoes:[
    "<code>wait/down/P</code> decrementa o contador e bloqueia a thread se ele ficar negativo; <code>signal/up/V</code> incrementa e acorda uma thread bloqueada, se houver.",
    "<code>wait</code> incrementa o contador e <code>signal</code> decrementa.",
    "<code>wait</code> pausa a thread por um tempo fixo; <code>signal</code> envia um sinal UNIX (<code>SIGUSR1</code>) para acordá-la.",
    "As duas travam o semáforo; a diferença é que <code>signal</code> não bloqueia."
  ],
  correta:0,
  gabarito:"São operações <b>atômicas</b>, garantidas pelo sistema operacional. <code>wait</code> (P, de <i>proberen</i>) decrementa e, se não houver recurso disponível, coloca a thread numa fila de bloqueados — sem espera ocupada. <code>signal</code> (V, de <i>verhogen</i>) incrementa e retira alguém da fila. Em POSIX: <code>sem_wait()</code> e <code>sem_post()</code>."
},
{
  id:"em09", mod:"exclusao", dif:"medio", tipo:"mc",
  fonte:"Slides · POSIX / semaphore.h",
  enunciado:"Na chamada <code>sem_init(&s, 0, 1)</code>, o que significam o segundo e o terceiro argumentos?",
  opcoes:[
    "O <code>0</code> indica que o semáforo é compartilhado apenas entre threads do mesmo processo; o <code>1</code> é o valor inicial do contador.",
    "O <code>0</code> é o valor inicial do contador; o <code>1</code> é o número máximo de threads.",
    "O <code>0</code> é a prioridade e o <code>1</code> é o tempo limite de espera em segundos.",
    "O <code>0</code> desliga a espera ocupada e o <code>1</code> liga o modo binário."
  ],
  correta:0,
  gabarito:"Assinatura: <code>sem_init(sem_t *sem, int pshared, unsigned int value)</code>. Com <code>pshared = 0</code> o semáforo vive na memória do processo e só as threads dele o enxergam; com valor diferente de zero ele pode ser compartilhado entre processos (e precisa estar em memória compartilhada, via <code>mmap</code>). O <code>value</code> inicial define o comportamento: <b>1</b> para exclusão mútua, <b>0</b> para sinalização/ordenação, <b>N</b> para contar N recursos."
},
{
  id:"em10", mod:"exclusao", dif:"medio", tipo:"mc",
  fonte:"Slides · Exclusão Mútua",
  enunciado:"O que é <b>espera ocupada</b> (<i>busy waiting</i>) e qual seu principal problema?",
  opcoes:[
    "É ficar num laço testando uma condição sem liberar a CPU; desperdiça tempo de processamento e, num sistema com prioridades, pode causar inversão de prioridade.",
    "É a thread ser bloqueada pelo sistema operacional numa fila de espera até que o recurso seja liberado.",
    "É o tempo que o kernel gasta trocando o contexto entre duas threads.",
    "É quando duas threads esperam uma pela outra indefinidamente."
  ],
  correta:0,
  gabarito:"O laço <code>while (trava) ;</code> queima fatias de CPU inteiras sem fazer trabalho útil. O caso patológico é o <b>problema da inversão de prioridade</b>: um processo de alta prioridade em espera ocupada impede o processo de baixa prioridade — que está dentro da região crítica — de ser escalonado para sair dela. O sistema trava. A alternativa é bloquear a thread (<code>sleep/wakeup</code>, semáforos, mutexes), o que devolve a CPU. <i>Spinlocks</i> ainda são usados quando a espera é comprovadamente curtíssima. A última alternativa descreve deadlock."
},
{
  id:"em11", mod:"exclusao", dif:"medio", tipo:"mc",
  fonte:"Slides · Exclusão Mútua",
  enunciado:"O que faz a instrução de hardware <code>TSL</code> (<i>Test and Set Lock</i>) e por que ela resolve o problema da variável de trava?",
  opcoes:[
    "Lê o valor da trava para um registrador e escreve 1 nela em <b>uma única operação indivisível</b>, bloqueando o barramento de memória durante a operação.",
    "Desabilita as interrupções do processador enquanto a região crítica é executada.",
    "Faz o escalonador adiar a preempção da thread até que ela saia da região crítica.",
    "Coloca a thread numa fila de espera do kernel sem consumir CPU."
  ],
  correta:0,
  gabarito:"<code>TSL RX, LOCK</code> lê e escreve <b>atomicamente</b>, travando o barramento para que nenhum outro núcleo acesse a palavra de memória no meio da operação. É isso que fecha a janela entre o teste e a escrita que quebrava a variável de trava. Instruções equivalentes: <code>XCHG</code> (x86) e <i>compare-and-swap</i>. Note que ela ainda produz espera ocupada — resolve a <b>correção</b>, não a eficiência."
},
{
  id:"em12", mod:"exclusao", dif:"medio", tipo:"vf",
  fonte:"Slides · Exclusão Mútua",
  enunciado:"Duas threads que apenas <b>lêem</b> a mesma variável compartilhada, sem nunca escrever nela, provocam condição de corrida.",
  correta:1,
  gabarito:"<b>Falso.</b> Condição de corrida exige pelo menos <b>uma escrita</b> concorrente. Leituras simultâneas de um dado que ninguém modifica são sempre seguras e não precisam de exclusão mútua. É justamente esse fato que motiva o problema dos <b>leitores e escritores</b>: permitir vários leitores ao mesmo tempo, mas apenas um escritor sozinho."
},
{
  id:"em13", mod:"exclusao", dif:"dificil", tipo:"mc",
  fonte:"Lab · Exclusão Mútua, Q5",
  enunciado:"O laboratório pede para contar a frequência de uma palavra num arquivo particionado em N segmentos, um por thread, e avisa: <i>&ldquo;não é tão simples quanto parece&rdquo;</i>. Qual é a dificuldade?",
  opcoes:[
    "Uma ocorrência da palavra pode ficar <b>partida na fronteira</b> entre dois segmentos, deixando de ser contada por qualquer thread (ou sendo contada duas vezes).",
    "Threads não podem abrir o mesmo arquivo simultaneamente em UNIX.",
    "A soma final das frequências parciais não pode ser feita com variável compartilhada.",
    "O número de segmentos precisa ser potência de 2 para a divisão funcionar."
  ],
  correta:0,
  gabarito:"O corte é feito por <b>bytes</b>, não por palavras. Se a palavra procurada é &ldquo;paralelo&rdquo; e a fronteira cai entre &ldquo;para&rdquo; e &ldquo;lelo&rdquo;, nenhuma das duas threads a reconhece. Soluções: (a) fazer cada segmento avançar até o próximo separador antes de terminar; (b) sobrepor os segmentos em (tamanho da palavra &minus; 1) bytes e tratar a duplicidade; (c) deixar cada thread começar a contar só depois do primeiro separador do seu bloco e terminar a última palavra iniciada dentro dele. E além disso ainda há a região crítica na variável compartilhada do total."
},
{
  id:"em14", mod:"exclusao", dif:"facil", tipo:"code",
  fonte:"Prova Prática · Questão 1",
  enunciado:"1000 threads incrementam e 1000 decrementam o mesmo <code>contador</code>. Escreva <b>apenas as duas funções</b> de thread, livres de condição de corrida.",
  cod:"long contador = 0;\npthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;\n\n/* o main cria 1000 threads com incrementa e 1000 com decrementa,\n   e depois espera todas com pthread_join */",
  chaves:["pthread_mutex_lock","pthread_mutex_unlock","contador"],
  modelo:"void *incrementa(void *arg) {\n    pthread_mutex_lock(&mutex);\n    contador++;\n    pthread_mutex_unlock(&mutex);\n    return NULL;\n}\n\nvoid *decrementa(void *arg) {\n    pthread_mutex_lock(&mutex);\n    contador--;\n    pthread_mutex_unlock(&mutex);\n    return NULL;\n}",
  gabarito:"A região crítica é o <code>contador++</code> / <code>contador--</code>, porque cada um vira <i>ler-modificar-escrever</i> na memória.<br><br><b>O detalhe que vale a questão:</b> tem que ser o <b>mesmo</b> mutex nas duas funções. Com mutexes diferentes, cada um protege contra si mesmo e nada contra o outro — a corrida continua. Com o mesmo mutex, o resultado é sempre <b>0</b>.<br><br>Com semáforo seria <code>sem_wait(&s)</code> / <code>sem_post(&s)</code>, com <code>sem_init(&s, 0, 1)</code>."
},
{
  id:"em15", mod:"exclusao", dif:"medio", tipo:"code",
  fonte:"Lab · Exclusão Mútua, Q2",
  enunciado:"26 threads compartilham a variável <code>letra</code>. Escreva <b>apenas a função</b> <code>tarefa</code>, de modo que o alfabeto saia <b>em ordem</b>: cada thread imprime, incrementa <code>letra</code> e libera a próxima.",
  cod:"char  letra = 'a';       /* variavel COMPARTILHADA */\nsem_t vez[26];           /* vez[0] inicia em 1; os demais em 0 */\n\n/* o main inicializa os semaforos, cria as 26 threads passando\n   o indice por parametro, e espera todas */",
  chaves:["sem_wait","sem_post","letra"],
  modelo:"void *tarefa(void *arg) {\n    int id = *(int *)arg;\n\n    sem_wait(&vez[id]);              /* espera a SUA vez */\n\n    printf(\"%c\", letra);\n    letra++;                         /* prepara a proxima letra */\n\n    if (id + 1 < 26)\n        sem_post(&vez[id + 1]);      /* libera a proxima thread */\n\n    return NULL;\n}",
  gabarito:"O ponto da questão: <b>exclusão mútua sozinha não resolve</b>. Um mutex garantiria que só uma thread mexe em <code>letra</code> por vez, mas a ordem de saída continuaria aleatória.<br><br>O que se pede é <b>sincronização de ordem</b>, e a ferramenta é a <b>cadeia de semáforos</b>: cada thread espera no seu e libera o da seguinte. Como só uma thread está ativa por vez, a exclusão mútua vem de brinde.<br><br>O <code>if</code> no final evita estourar o vetor na última thread."
},
{
  id:"em16", mod:"exclusao", dif:"facil", tipo:"code",
  fonte:"Lab · Exclusão Mútua, Q3",
  enunciado:"Escreva <b>apenas a função</b> <code>somar</code>, que acumula a faixa da thread na variável <b>compartilhada</b> <code>soma_total</code> — protegendo corretamente a região crítica.",
  cod:"int  vetor[1000];\nlong soma_total = 0;                              /* COMPARTILHADA */\npthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;\n\ntypedef struct { int inicio, fim; } Params;",
  chaves:["pthread_mutex_lock","pthread_mutex_unlock","soma_total"],
  modelo:"void *somar(void *arg) {\n    Params *p = (Params *)arg;\n    long local = 0;\n\n    for (int i = p->inicio; i < p->fim; i++)\n        local += vetor[i];            /* acumula FORA da regiao critica */\n\n    pthread_mutex_lock(&mutex);       /* so o resultado entra na trava */\n    soma_total += local;\n    pthread_mutex_unlock(&mutex);\n\n    free(p);\n    return NULL;\n}",
  gabarito:"A versão literal do enunciado seria travar o mutex a <b>cada iteração</b>. Ela está <i>correta</i>, mas é lentíssima: o mutex serializa tudo e o programa paralelo fica mais devagar que o serial.<br><br>A solução acima acumula num <code>local</code> e entra na região crítica <b>uma vez por thread</b> — mesmo resultado, granularidade muito melhor. Essa discussão sobre <b>granularidade da região crítica</b> vale nota, e é a mesma ideia por trás do <code>reduction</code> do OpenMP na P2."
},
{
  id:"em17", mod:"exclusao", dif:"dificil", tipo:"mc",
  fonte:"Slides · Exclusão Mútua",
  enunciado:"Duas threads travam os mesmos dois mutexes, mas em ordens diferentes. Qual é a consequência?",
  cod:"/* thread A */                     /* thread B */\npthread_mutex_lock(&m1);          pthread_mutex_lock(&m2);\npthread_mutex_lock(&m2);          pthread_mutex_lock(&m1);\n    /* ... */                         /* ... */\npthread_mutex_unlock(&m2);        pthread_mutex_unlock(&m1);\npthread_mutex_unlock(&m1);        pthread_mutex_unlock(&m2);",
  opcoes:[
    "Deadlock: A pode ficar com <code>m1</code> esperando <code>m2</code> enquanto B fica com <code>m2</code> esperando <code>m1</code>.",
    "Condição de corrida: as duas entram na região crítica ao mesmo tempo.",
    "Nada de errado — a ordem de travamento é irrelevante.",
    "Inversão de prioridade, resolvida pelo escalonador."
  ],
  correta:0,
  gabarito:"É o deadlock clássico, com as quatro condições de Coffman satisfeitas: exclusão mútua (mutex), posse-e-espera (cada uma segura um e pede o outro), não-preempção (ninguém arranca o mutex do outro) e espera circular (A&rarr;B&rarr;A). A correção padrão é <b>impor uma ordem global de travamento</b> — sempre <code>m1</code> antes de <code>m2</code> — o que ataca a espera circular. É a mesma solução do Jantar dos Filósofos por ordenação de garfos."
},
{
  id:"em18", mod:"exclusao", dif:"medio", tipo:"mc",
  fonte:"Slides · Monitores",
  enunciado:"O que caracteriza um <b>monitor</b> e o que são suas <b>variáveis de condição</b>?",
  opcoes:[
    "É uma construção de linguagem em que os dados são privados e todos os procedimentos têm exclusão mútua implícita; as variáveis de condição oferecem <code>wait</code> (libera o monitor e bloqueia) e <code>signal</code> (acorda quem esperava).",
    "É uma estrutura de dados da biblioteca pthreads, criada com <code>pthread_monitor_init()</code>.",
    "É um processo do sistema operacional que vigia as regiões críticas dos outros processos.",
    "É outro nome para semáforo de contagem."
  ],
  correta:0,
  gabarito:"A vantagem do monitor é que a exclusão mútua é responsabilidade do <b>compilador</b>, não do programador — não existe &ldquo;esqueci o unlock&rdquo;. O detalhe crítico do <code>wait</code>: ele <b>libera o monitor</b> ao bloquear, senão ninguém mais entraria para sinalizar. Em Java, isso é <code>synchronized</code> com <code>wait()</code>/<code>notify()</code>. Monitor não existe como tipo nativo em C — daí a disciplina trabalhar com semáforos e mutexes."
},
{
  id:"em19", mod:"exclusao", dif:"dificil", tipo:"mc",
  fonte:"Prova Prática · análise de código",
  enunciado:"Analise a função abaixo, de uma simulação de banheiro compartilhado. Qual é o defeito?",
  cod:"sem_t mutex;   /* inicializado em 1 */\nsem_t vazio;   /* inicializado em 1 */\nint mulheres_no_banheiro = 0;\n\nvoid mulher_quer_entrar(int id) {\n    sem_wait(&mutex);\n    if (mulheres_no_banheiro == 0) {\n        sem_wait(&vazio);                    /* <-- bloqueia SEGURANDO o mutex */\n        printf(\"BANHEIRO COM MULHER\\n\");\n    }\n    mulheres_no_banheiro++;\n    printf(\"Mulher %d entrou do banheiro\\n\", id);\n    sem_post(&mutex);\n}",
  opcoes:[
    "Deadlock: a thread pode bloquear em <code>sem_wait(&vazio)</code> <b>ainda segurando</b> <code>mutex</code>; quem está no banheiro precisará do <code>mutex</code> para sair e liberar <code>vazio</code>, e ninguém avança.",
    "Condição de corrida em <code>mulheres_no_banheiro++</code>, porque o incremento está fora da região crítica.",
    "O <code>printf</code> não é <i>thread-safe</i> e corrompe a saída padrão.",
    "Nenhum: a função está correta, apenas mal indentada."
  ],
  correta:0,
  gabarito:"É o caso da Questão 4 da Prova Prática. A primeira mulher a chegar encontra o banheiro com homem, bloqueia em <code>sem_wait(&vazio)</code> — e continua com o <code>mutex</code> na mão. O homem que está lá dentro chama <code>homem_sai()</code>, que precisa do <code>mutex</code> para decrementar o contador e dar <code>sem_post(&vazio)</code>: ele bloqueia. <b>Deadlock</b> perfeito (posse-e-espera + espera circular). A correção é nunca bloquear num semáforo de condição segurando o mutex de exclusão: solte o <code>mutex</code> antes do <code>sem_wait(&vazio)</code> e retome depois, ou use variável de condição, cujo <code>wait</code> libera o mutex automaticamente."
},
{
  id:"em20a", mod:"exclusao", dif:"medio", tipo:"disc",
  fonte:"Prova Prática · Questão 4",
  enunciado:"No problema dos <b>Banheiros UNISSEX</b> (o banheiro fica VAZIO, COM MULHER ou COM HOMEM; várias pessoas do mesmo gênero podem entrar juntas), qual é a estrutura de sincronização correta? Descreva os semáforos e a regra.",
  chaves:[
    ["variante de leitores e escritores","leitores e escritores","leitores","escritores"],
    ["mutex protege os contadores","mutex","contador"],
    ["semáforo vazio = posse do banheiro","vazio","posse do banheiro","banheiro livre"],
    ["o primeiro do gênero adquire vazio","o primeiro","primeiro a entrar"],
    ["o último a sair libera vazio","o último","último a sair"],
    ["nunca bloquear segurando o mutex","solta o mutex","libera o mutex antes","sem segurar o mutex","fora do mutex","antes de bloquear"]
  ],
  gabarito:"É uma variante de <b>leitores e escritores</b>, com dois &ldquo;tipos de leitor&rdquo; mutuamente exclusivos.<br><br><b>Semáforos:</b><br>&bull; <code>sem_t mutex</code> = 1 — protege os contadores <code>homens_no_banheiro</code> e <code>mulheres_no_banheiro</code>.<br>&bull; <code>sem_t vazio</code> = 1 — representa a <b>posse do banheiro</b> por um gênero.<br><br><b>Regra de ouro:</b> o <b>primeiro</b> do seu gênero a entrar adquire <code>vazio</code>; o <b>último</b> a sair libera <code>vazio</code>. Quem está no meio apenas ajusta o contador e entra direto.<br><br><b>Restrição de implementação:</b> nunca chamar <code>sem_wait(&vazio)</code> segurando o <code>mutex</code> — é preciso soltar o mutex antes de bloquear e retomá-lo depois."
},
{
  id:"em20b", mod:"exclusao", dif:"medio", tipo:"code",
  fonte:"Prova Prática · Questão 4",
  enunciado:"Escreva <b>apenas o procedimento</b> <code>mulher_quer_entrar</code>, sem deadlock e sem condição de corrida.",
  cod:"sem_t mutex;   /* = 1, protege os contadores */\nsem_t vazio;   /* = 1, posse do banheiro        */\nint mulheres_no_banheiro = 0;\nint homens_no_banheiro   = 0;",
  chaves:["sem_wait","sem_post","mutex","vazio"],
  modelo:"void mulher_quer_entrar(int id) {\n    sem_wait(&mutex);\n\n    if (mulheres_no_banheiro == 0) {\n        sem_post(&mutex);        /* SOLTA o mutex antes de bloquear */\n        sem_wait(&vazio);        /* aqui pode esperar muito tempo   */\n        sem_wait(&mutex);        /* retoma para mexer no contador   */\n        printf(\"BANHEIRO COM MULHER\\n\");\n    }\n\n    mulheres_no_banheiro++;\n    printf(\"Mulher %d entrou do banheiro\\n\", id);\n\n    sem_post(&mutex);\n}",
  gabarito:"O erro que a prova cobra é exatamente este: chamar <code>sem_wait(&vazio)</code> <b>segurando</b> o <code>mutex</code>. Se a mulher bloqueia ali com o mutex na mão, o homem que está dentro não consegue o mutex para sair e liberar <code>vazio</code> — <b>deadlock</b> (posse-e-espera + espera circular).<br><br>Por outro lado, testar <code>mulheres_no_banheiro == 0</code> ou incrementar <b>fora</b> do mutex gera <b>condição de corrida</b>: duas mulheres leem 0 ao mesmo tempo e ambas tentam adquirir <code>vazio</code> — uma fica presa para sempre."
},
{
  id:"em20c", mod:"exclusao", dif:"facil", tipo:"code",
  fonte:"Prova Prática · Questão 4",
  enunciado:"Escreva <b>apenas o procedimento</b> <code>mulher_sai</code>.",
  cod:"sem_t mutex;   /* = 1 */\nsem_t vazio;   /* = 1 */\nint mulheres_no_banheiro = 0;",
  chaves:["sem_wait","sem_post","mulheres_no_banheiro"],
  modelo:"void mulher_sai(int id) {\n    sem_wait(&mutex);\n\n    mulheres_no_banheiro--;\n    printf(\"Mulher %d saiu do banheiro\\n\", id);\n\n    if (mulheres_no_banheiro == 0) {\n        printf(\"BANHEIRO VAZIO\\n\");\n        sem_post(&vazio);        /* a ULTIMA devolve o banheiro */\n    }\n\n    sem_post(&mutex);\n}",
  gabarito:"Aqui o <code>sem_post(&vazio)</code> pode ficar dentro do <code>mutex</code> sem problema: <code>post</code> <b>nunca bloqueia</b>. O perigo só existe com <code>wait</code>.<br><br>O <code>if</code> é o espelho da regra do <code>mulher_quer_entrar</code>: só a última a sair libera a posse do banheiro. Se você der <code>sem_post(&vazio)</code> incondicionalmente, o contador do semáforo passa de 1 e dois gêneros conseguem entrar ao mesmo tempo."
},
{
  id:"em20d", mod:"exclusao", dif:"dificil", tipo:"disc",
  fonte:"Prova Prática · Questão 4",
  enunciado:"Na implementação entregue pelo aluno (a que veio do ChatGPT), onde surgem a <b>condição de corrida</b> e o <b>deadlock</b>? A solução correta ainda tem algum problema?",
  chaves:[
    ["sem_wait(&vazio) segurando o mutex","segurando o mutex","com o mutex","dentro do mutex","sem soltar o mutex"],
    ["deadlock","deadlock","impasse","presos","travad"],
    ["contador mexido fora do mutex","fora do mutex","sem o mutex","sem proteção","fora da região crítica"],
    ["condição de corrida","corrida"],
    ["duas leem 0 ao mesmo tempo / incremento perdido","duas mulheres","ambas","ao mesmo tempo","incremento perdido","se perde"],
    ["ainda há starvation","starvation","inanição","fome","turnstile","fila justa","nunca entra"]
  ],
  gabarito:"<b>Deadlock:</b> chamar <code>sem_wait(&vazio)</code> <b>segurando</b> o <code>mutex</code>. A primeira mulher a chegar com um homem dentro bloqueia ali e continua com o mutex; o homem precisa do mutex para sair e liberar <code>vazio</code>. Os dois ficam presos — posse-e-espera + espera circular.<br><br><b>Condição de corrida:</b> testar <code>if (mulheres_no_banheiro == 0)</code> ou fazer <code>mulheres_no_banheiro++</code> <b>fora</b> do mutex. Duas mulheres podem ler 0 ao mesmo tempo e <b>ambas</b> tentarem adquirir <code>vazio</code> (uma fica presa para sempre), ou os incrementos se perdem e o contador nunca zera — o banheiro fica ocupado eternamente.<br><br><b>Sim, a solução correta ainda tem um problema: <i>starvation</i>.</b> Um fluxo contínuo de mulheres impede qualquer homem de entrar, porque o contador nunca chega a zero. Corrige-se com um <i>turnstile</i> (um semáforo de entrada que os recém-chegados precisam atravessar) ou com uma fila justa por ordem de chegada."
},
{
  id:"em21", mod:"exclusao", dif:"facil", tipo:"mc",
  fonte:"Slides · Exclusão Mútua",
  enunciado:"Um programa concorrente executa 10 vezes e dá o resultado certo em 9 delas. O que isso indica?",
  opcoes:[
    "Uma condição de corrida: o resultado depende do escalonamento, e acertar às vezes não é prova de correção.",
    "Que o programa está correto e a execução errada foi falha de hardware.",
    "Que falta memória compartilhada entre as threads.",
    "Que o número de threads não é múltiplo do número de núcleos."
  ],
  correta:0,
  gabarito:"Este é o traço característico do bug de concorrência: <b>não determinismo</b>. Como a intercalação depende do escalonador, da carga da máquina e do número de núcleos, um programa com condição de corrida pode passar em muitos testes e falhar em produção. É por isso que a análise da região crítica precisa ser feita <b>lendo o código</b>, e não só testando — exatamente o que a Questão 4 da Prova Prática cobra."
},
{
  id:"em22", mod:"exclusao", dif:"medio", tipo:"mc",
  fonte:"Slides · Peterson",
  enunciado:"Como o algoritmo de Peterson garante exclusão mútua entre dois processos?",
  cod:"int interesse[2] = {0, 0};\nint vez;\n\nvoid entra(int eu) {\n    int outro = 1 - eu;\n    interesse[eu] = 1;                    /* declaro que quero entrar */\n    vez = outro;                          /* cedo a vez ao outro      */\n    while (interesse[outro] && vez == outro)\n        ;                                 /* espero */\n}\n\nvoid sai(int eu) { interesse[eu] = 0; }",
  opcoes:[
    "Combinando um vetor de interesse (quem quer entrar) com uma variável <code>vez</code> que cede a preferência ao outro — quem cedeu por último espera.",
    "Desabilitando as interrupções durante toda a região crítica.",
    "Usando a instrução atômica <code>TSL</code> para testar e travar simultaneamente.",
    "Alternando estritamente a vez entre os dois processos, um de cada vez."
  ],
  correta:0,
  gabarito:"O truque é o <b>gesto de cortesia</b>: cada processo escreve <code>vez = outro</code>. Se os dois chegam juntos, a segunda escrita sobrescreve a primeira, e apenas um fica preso no <code>while</code> — o desempate é garantido. E, ao contrário da alternância estrita, quando o outro processo <b>não</b> tem interesse (<code>interesse[outro] == 0</code>) a entrada é imediata, sem precisar esperar a vez chegar. Peterson resolve as quatro condições, mas ainda usa espera ocupada e só funciona para dois processos."
}

]);
