/* Código comentado — Exclusão Mútua */
anotar([

{
  mod: "exclusao",
  h: "Por que contador++ não é atômico",
  enunciado: "Duas threads executam <code>contador++</code> sobre a mesma variável, que vale 5. Por que o resultado pode ser 6 em vez de 7?",
  linhas: [
    ["contador++;",
     "Em C parece uma operação só. O processador, porém, não tem uma instrução &ldquo;incrementa na memória e pronto&rdquo; que seja indivisível para o escalonador."],
    ["mov  eax, [contador]",
     "<b>1. Lê</b> o valor da memória para o registrador da thread. Se a troca de contexto cair logo depois daqui, a thread fica com um valor que pode envelhecer.", true],
    ["add  eax, 1",
     "<b>2. Soma</b> no registrador. A memória ainda não mudou — outra thread que ler agora vê o valor antigo."],
    ["mov  [contador], eax",
     "<b>3. Grava</b> de volta. Se outra thread gravou entre o passo 1 e este, a gravação dela é <b>sobrescrita</b>.", true],
    ["A le 5 ... troca ... B le 5\nA grava 6  ...  B grava 6",
     "A intercalação ruim: as duas leram 5 antes de qualquer uma gravar. Dois incrementos, um só efeito — a <b>atualização perdida</b>.", true]
  ],
  saida: "O valor final depende de onde o escalonador interrompe cada thread: <b>não determinismo</b>. As três instruções precisam ser tratadas como uma região crítica."
},

{
  mod: "exclusao",
  h: "Semáforo",
  enunciado: "Proteja <code>contador++</code> com um semáforo POSIX usado como trava.",
  linhas: [
    ["#include <semaphore.h>",
     "Declara <code>sem_t</code> e as funções <code>sem_*</code>."],
    ["sem_t s;",
     "O semáforo precisa ser <b>compartilhado</b> por todas as threads — global ou dentro de uma estrutura que todas recebem. Um semáforo por thread não protege nada.", true],
    ["sem_init(&s, 0, 1);",
     "Segundo argumento <b>0</b>: compartilhado só entre threads deste processo. Terceiro, <b>1</b>: começa livre e deixa entrar um de cada vez — exclusão mútua.", true],
    ["sem_wait(&s);",
     "Decrementa. Se estava em 1, vai a 0 e a thread entra. Se já estava em 0, a thread <b>bloqueia</b> até alguém dar <code>post</code> — sem gastar CPU."],
    ["    contador++;",
     "A região crítica. Só uma thread por vez chega aqui, então as três instruções de máquina não se intercalam com as de outra."],
    ["sem_post(&s);",
     "Incrementa e acorda uma thread que esperava. Esquecer esta linha trava todas as outras para sempre.", true],
    ["sem_destroy(&s);",
     "Libera o semáforo — só depois dos <code>join</code>, quando nenhuma thread o usa mais."]
  ],
  saida: "Com N incrementos e N decrementos, o contador termina em <b>0</b> em toda execução. Trocando o valor inicial para 0, o mesmo semáforo passa a servir para <b>sinalizar ordem</b>; para N, para contar recursos."
},

{
  mod: "exclusao",
  h: "Mutex",
  enunciado: "Proteja o mesmo <code>contador++</code> com um mutex de pthreads.",
  linhas: [
    ["pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;",
     "Cria o mutex já pronto para uso, sem precisar chamar <code>pthread_mutex_init</code>. Também tem de ser compartilhado.", true],
    ["pthread_mutex_lock(&m);",
     "Trava. Se outra thread é a dona, esta bloqueia até o <code>unlock</code>. A thread que travou passa a ser a <b>dona</b>."],
    ["    contador++;",
     "Região crítica protegida."],
    ["pthread_mutex_unlock(&m);",
     "Destrava. Só a <b>dona</b> pode fazer isso — é a diferença para o semáforo binário, em que qualquer thread pode dar <code>post</code>.", true],
    ["pthread_mutex_destroy(&m);",
     "Libera o mutex quando ninguém mais o usa."]
  ],
  saida: "Mesmo resultado do semáforo. Por ter dono, o mutex serve <b>só</b> para exclusão mútua — não dá para uma thread travar e outra liberar como sinal."
},

{
  mod: "exclusao",
  h: "Granularidade: o erro que faz o paralelo ficar mais lento",
  enunciado: "Cada thread soma a sua faixa do vetor num total compartilhado. Compare travar a cada elemento com travar uma vez só.",
  linhas: [
    ["for (i = p->inicio; i < p->fim; i++) {",
     "<b>Versão ruim.</b> Percorre a faixa desta thread."],
    ["    pthread_mutex_lock(&m);\n    soma_total += vetor[i];\n    pthread_mutex_unlock(&m);\n}",
     "Correta, mas trava e destrava <b>a cada elemento</b>. As threads passam o tempo disputando o mutex: na prática, uma soma por vez — mais lento que o serial.", true],
    ["long local = 0;",
     "<b>Versão boa.</b> Um acumulador <b>privado</b>, na pilha desta thread. Ninguém mais o enxerga, então não há corrida."],
    ["for (i = p->inicio; i < p->fim; i++)\n    local += vetor[i];",
     "O trabalho pesado roda <b>sem trava nenhuma</b>, em paralelo de verdade.", true],
    ["pthread_mutex_lock(&m);\nsoma_total += local;\npthread_mutex_unlock(&m);",
     "Uma única entrada na região crítica por thread, só para juntar o resultado. É a ideia que o <code>reduction</code> do OpenMP automatiza.", true]
  ],
  saida: "As duas versões dão a <b>mesma soma</b>. A diferença é só de desempenho — e ela decide se paralelizar valeu a pena."
},

{
  mod: "exclusao",
  h: "Exclusão mútua não resolve ordem",
  enunciado: "Quatro threads imprimem C, A, F e E. A saída precisa ser sempre <code>CAFE</code>, qualquer que seja a ordem de criação.",
  linhas: [
    ["sem_t sC, sA, sF, sE;",
     "Um semáforo por thread: cada um é a &ldquo;vez&rdquo; daquela letra."],
    ["sem_init(&sC, 0, 1);",
     "C começa <b>liberada</b>: é a primeira da corrente.", true],
    ["sem_init(&sA, 0, 0);\nsem_init(&sF, 0, 0);\nsem_init(&sE, 0, 0);",
     "As outras começam em <b>0</b>: quem chegar ao <code>wait</code> bloqueia até receber o sinal. Semáforo em 0 é sinalização, não trava.", true],
    ["void *threadC(void *arg) {\n    sem_wait(&sC);",
     "Passa direto, porque <code>sC</code> vale 1."],
    ["    printf(\"C\"); fflush(stdout);",
     "Imprime. O <code>fflush</code> descarrega a saída sem esperar o <code>\\n</code>, para a ordem aparecer de verdade."],
    ["    sem_post(&sA);\n    return NULL;\n}",
     "Passa a vez para A. É este <code>post</code> — e não a ordem de criação — que define quem vem depois.", true],
    ["void *threadA(void *arg) {\n    sem_wait(&sA);\n    printf(\"A\"); fflush(stdout);\n    sem_post(&sF);\n    return NULL;\n}",
     "Mesmo molde: espera a sua vez, imprime, passa para F. F faz o mesmo e passa para E; E não sinaliza ninguém."]
  ],
  saida: "Sempre <b>CAFE</b>, mesmo criando as threads na ordem E, F, A, C. Um mutex no lugar dos semáforos garantiria só que uma imprime por vez — não <b>qual</b>."
}

]);
