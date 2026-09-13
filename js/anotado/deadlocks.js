/* Código comentado — Deadlocks */
anotar([

{
  mod: "deadlocks",
  h: "Como atacar cada condição",
  enunciado: "Duas funções transferem dinheiro entre contas, cada conta com o seu mutex. Uma trava <code>origem</code> e depois <code>destino</code>; a outra, chamada ao contrário, trava na ordem inversa. Corrija atacando a <b>espera circular</b>.",
  linhas: [
    ["void transferir(conta_t *origem, conta_t *destino, int valor) {",
     "Duas threads podem chamar <code>transferir(a, b)</code> e <code>transferir(b, a)</code> ao mesmo tempo."],
    ["    /* ERRADO: lock(&origem->m); lock(&destino->m); */",
     "A versão ingênua trava na ordem dos <b>parâmetros</b>. A thread 1 trava <code>a</code> e espera <code>b</code>; a thread 2 trava <code>b</code> e espera <code>a</code>. As quatro condições de Coffman valem.", true],
    ["    conta_t *primeira = origem->id < destino->id ? origem  : destino;\n    conta_t *segunda  = origem->id < destino->id ? destino : origem;",
     "<b>Correção.</b> Uma <b>ordem global</b>: o recurso de menor <code>id</code> sempre vem primeiro, não importa o sentido da transferência.", true],
    ["    pthread_mutex_lock(&primeira->m);\n    pthread_mutex_lock(&segunda->m);",
     "As duas threads agora disputam o <b>mesmo</b> primeiro mutex. Quem perde fica esperando de mãos vazias — e quem não segura nada não fecha ciclo.", true],
    ["    origem->saldo  -= valor;\n    destino->saldo += valor;",
     "A região crítica: as duas contas mudam juntas, sem ninguém ver o dinheiro &ldquo;no meio do caminho&rdquo;."],
    ["    pthread_mutex_unlock(&segunda->m);\n    pthread_mutex_unlock(&primeira->m);\n}",
     "A ordem de <b>destravar</b> não causa deadlock; soltar na ordem inversa é só convenção."]
  ],
  saida: "Nenhuma intercalação trava mais. Custo zero de desempenho: a correção é só disciplina de programação — por isso é a estratégia de prevenção mais usada."
},

{
  mod: "deadlocks",
  h: "Algoritmo do Banqueiro (exemplo resolvido)",
  mantemCod: true,
  enunciado: "O teste de segurança do Banqueiro para um tipo de recurso: existe alguma ordem em que <b>todos</b> os processos consigam chegar ao seu máximo e terminar?",
  linhas: [
    ["int estado_seguro(void) {\n    int terminou[N] = {0};",
     "Marca quem já conseguiu terminar nesta simulação. Nada aqui altera o estado real."],
    ["    int trabalho = disponivel;",
     "Uma <b>cópia</b> dos recursos livres. A simulação vai somando o que cada processo devolveria.", true],
    ["    for (int feitos = 0; feitos < N; ) {\n        int achou = 0;",
     "Repete até todos terminarem — ou até ninguém mais conseguir avançar."],
    ["        for (int i = 0; i < N; i++) {\n            if (!terminou[i] && maximo[i] - posse[i] <= trabalho) {",
     "Procura um processo cuja <b>necessidade restante</b> caiba no que está livre. Esse consegue ir até o fim no pior caso.", true],
    ["                trabalho += posse[i];",
     "Ao terminar, ele devolve tudo o que segura. Por isso a próxima rodada pode atender quem antes não cabia.", true],
    ["                terminou[i] = 1; feitos++; achou = 1;\n                break;",
     "Marca e <b>recomeça a varredura</b> do início, porque o trabalho aumentou."],
    ["            }\n        }\n        if (!achou) return 0;",
     "Ninguém cabe e ainda sobra processo: não existe sequência segura. O estado é <b>inseguro</b>.", true],
    ["    }\n    return 1;\n}",
     "Todos terminaram na simulação: estado <b>seguro</b>."]
  ],
  saida: "Para atender um pedido, o sistema concede <b>provisoriamente</b>, chama <code>estado_seguro()</code> e, se der 0, desfaz a concessão e faz o processo esperar."
}

]);
