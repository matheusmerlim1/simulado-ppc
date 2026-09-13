/* Código comentado — Processos e Threads */
anotar([

{
  mod: "processos",
  h: "fork(): a chamada que retorna duas vezes",
  enunciado: "Crie um processo filho, faça o pai esperar <b>especificamente</b> por ele e trate o caso de erro.",
  linhas: [
    ["pid_t pid = fork();",
     "Duplica o processo. A partir daqui existem <b>dois</b> processos executando a próxima linha, cada um com a sua cópia de <code>pid</code>.", true],
    ["if (pid > 0) {",
     "Só é verdade no <b>pai</b>: lá o <code>fork</code> devolveu o PID do filho, que é positivo."],
    ["    waitpid(pid, &status, 0);",
     "O pai bloqueia até <b>este</b> filho terminar. Sem isso, o pai pode acabar antes e o filho vira órfão; e o filho que termina fica zumbi até ser recolhido.", true],
    ["} else if (pid == 0) {",
     "Só é verdade no <b>filho</b>: nele o <code>fork</code> devolveu 0. É a única forma de o mesmo código tomar caminhos diferentes."],
    ["    exit(0);",
     "Encerra o filho aqui. Se o <code>fork</code> estiver num laço e faltar o <code>exit</code>, o filho volta ao laço e cria filhos próprios — uma <i>fork bomb</i> acidental.", true],
    ["} else {",
     "Sobrou o terceiro retorno possível: <b>&minus;1</b>. Nenhum filho foi criado."],
    ["    perror(\"erro no fork\");\n}",
     "Mostra o motivo (limite de processos, falta de memória). Ignorar esse caso faz o pai seguir como se o filho existisse."]
  ],
  saida: "O pai só continua depois do <code>exit(0)</code> do filho. Um erro de <code>fork</code> não cria processo nenhum e é informado."
},

{
  mod: "processos",
  h: "Copy-on-write: por que o filho não vê as mudanças do pai",
  enunciado: "O filho preenche o vetor com 1 e o pai soma o vetor depois de esperar o filho. O que o pai imprime?",
  linhas: [
    ["int vetor[100];\nfor (i = 0; i < 100; i++) vetor[i] = 0;",
     "Vetor zerado <b>antes</b> do <code>fork</code>: pai e filho começam enxergando os mesmos zeros."],
    ["if (pid = fork()) {",
     "Atribui e testa ao mesmo tempo. O valor é diferente de zero só no <b>pai</b>, então este bloco é o do pai.", true],
    ["    waitpid(pid, &status, 0);",
     "Garante que o filho já terminou de escrever antes de o pai somar — assim não dá para culpar a ordem de execução pelo resultado."],
    ["    soma = 0;\n    for (i = 0; i < 100; i++) soma += vetor[i];",
     "O pai soma o <b>seu</b> vetor. As páginas dele nunca foram escritas pelo filho."],
    ["    printf(\"[PAI] soma = %d\", soma);",
     "Imprime <b>0</b>. É a prova de que não há memória compartilhada depois do <code>fork</code>.", true],
    ["} else {",
     "Bloco do filho: aqui <code>fork</code> devolveu 0."],
    ["    for (i = 0; i < 100; i++) vetor[i] = 1;",
     "A primeira escrita dispara o <i>copy-on-write</i>: o sistema copia a página e o filho passa a escrever na <b>cópia dele</b>.", true],
    ["}",
     "Se a intenção fosse compartilhar, o vetor teria de vir de <code>mmap</code> com <code>MAP_SHARED</code>."]
  ],
  saida: "<b>[PAI] soma = 0</b>. O filho, se somasse, veria 100 — na cópia dele. Sem dado compartilhado, também não há condição de corrida."
},

{
  mod: "processos",
  h: "POSIX Threads na prática",
  enunciado: "Crie 4 threads, cada uma imprimindo o próprio número, e só termine o programa depois que todas acabarem.",
  linhas: [
    ["#include <pthread.h>",
     "Declara <code>pthread_t</code>, <code>pthread_create</code> e <code>pthread_join</code>. Compile com <code>-pthread</code>."],
    ["void *tarefa(void *arg) {",
     "A assinatura é obrigatória: recebe e devolve <code>void *</code>, para caber qualquer tipo de dado."],
    ["    int id = *(int *)arg;",
     "Converte o ponteiro genérico de volta para <code>int *</code> e lê o valor <b>logo no início</b>, antes que alguém o mude.", true],
    ["    printf(\"thread %d\\n\", id);\n    return NULL;\n}",
     "O trabalho da thread. <code>return NULL</code> encerra só esta thread, não o processo."],
    ["pthread_t t[4];\nint idx[4];",
     "Um identificador e <b>um inteiro por thread</b>. Cada thread vai receber o endereço da sua própria posição.", true],
    ["for (int i = 0; i < 4; i++) {\n    idx[i] = i;",
     "Guarda o número numa posição que não muda mais."],
    ["    pthread_create(&t[i], NULL, tarefa, &idx[i]);\n}",
     "Cria a thread passando <code>&idx[i]</code>. Com <code>&i</code>, todas receberiam o endereço da <b>mesma</b> variável, que continua mudando — várias imprimiriam o mesmo número.", true],
    ["for (int i = 0; i < 4; i++)\n    pthread_join(t[i], NULL);",
     "Um laço <b>separado</b> espera todas. Dar <code>join</code> dentro do laço de criação esperaria cada thread antes de criar a próxima: o programa viraria sequencial.", true],
    ["return 0;",
     "Só chega aqui com as 4 terminadas. Sem os <code>join</code>, o <code>main</code> poderia acabar e matar as threads no meio."]
  ],
  saida: "As 4 linhas saem <b>em qualquer ordem</b> — quem decide é o escalonador —, mas cada número aparece exatamente uma vez."
}

]);
