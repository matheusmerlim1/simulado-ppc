/* ═══════════════════════════════════════════════════════════
   PANORAMA — a disciplina inteira numa página, na ordem em que
   um assunto leva ao outro.

   estacoes: { mod, pergunta, texto, essencial:[HTML], prova, animacoes:[id] }
   Os ids de animacoes são os registrados em js/anim/.
   ═══════════════════════════════════════════════════════════ */
const PANORAMA = {

  /* os dois eixos da disciplina */
  eixos: [
    {
      nome: "Concorrência",
      prova: "P1",
      def: "Várias tarefas <b>em andamento</b> no mesmo intervalo de tempo, que se intercalam e disputam recursos. Acontece até com <b>um único núcleo</b>: o escalonador alterna entre elas.",
      foco: "O problema é a <b>corretude</b>: impedir corrida, deadlock e starvation."
    },
    {
      nome: "Paralelismo",
      prova: "P2",
      def: "Tarefas executando <b>literalmente ao mesmo tempo</b>, cada uma num núcleo. Exige hardware com mais de uma unidade de processamento.",
      foco: "O objetivo é o <b>desempenho</b>: ganhar tempo sem perder a corretude."
    }
  ],

  relacao: "Todo programa paralelo é concorrente — as tarefas continuam disputando dados e precisando de coordenação. Mas nem todo programa concorrente é paralelo. A P1 ensina a coordenar; a P2 ensina a fazer a coordenação valer a pena.",

  estacoes: [
    {
      mod: "processos",
      pergunta: "Como um programa vira várias linhas de execução?",
      texto: "Um <b>processo</b> é um programa em execução, com espaço de endereçamento próprio; uma <b>thread</b> é uma linha de execução dentro dele. Processos nascem com <code>fork()</code> e não compartilham memória; threads nascem com <code>pthread_create()</code> e compartilham quase tudo. Quem decide o que roda a cada instante é o <b>escalonador</b>.",
      essencial: [
        "<code>fork()</code> retorna duas vezes: o PID do filho no pai, 0 no filho, &minus;1 em erro.",
        "Depois do <code>fork()</code> não há memória compartilhada (<i>copy-on-write</i>); para compartilhar, <code>mmap</code> com <code>MAP_SHARED</code>.",
        "Threads dividem dados, heap e arquivos; cada uma tem a sua pilha, o seu contador de programa e o seu <code>errno</code>.",
        "Passe <code>&amp;idx[i]</code>, nunca <code>&amp;i</code>, e dê <code>pthread_join</code> fora do laço de criação.",
        "FIFO é não-preemptivo (efeito comboio); Round Robin reveza em fatias de tempo, ao custo de trocas de contexto."
      ],
      prova: "Contar processos criados por <code>fork</code> em laço, prever a saída com <i>copy-on-write</i> e comparar FIFO com Round Robin.",
      animacoes: ["processo", "paralelo"]
    },
    {
      mod: "exclusao",
      pergunta: "O que dá errado quando duas threads mexem no mesmo dado?",
      texto: "Se duas threads leem e escrevem a mesma variável, o resultado passa a depender da ordem em que o escalonador intercala as instruções: é a <b>condição de corrida</b>. O trecho que acessa o dado é a <b>região crítica</b>, e o tratamento é a <b>exclusão mútua</b> — um fluxo por vez ali dentro. Qualquer solução só funciona se testar e tomar a trava for uma operação atômica.",
      essencial: [
        "<code>contador++</code> são três instruções — ler, somar, gravar — e a troca de thread pode cair entre elas.",
        "Boa solução: exclusão garantida, nada assumido sobre velocidade ou número de CPUs, ninguém de fora bloqueia, ninguém espera para sempre.",
        "Variável de trava e alternância estrita falham; Peterson e TSL funcionam, mas em espera ocupada.",
        "<b>Semáforo</b> (contador sem dono: 1, N ou 0), <b>mutex</b> (trava com dono) e <b>monitor</b> (da linguagem, como <code>synchronized</code>).",
        "Mutex resolve corrida, não resolve ordem."
      ],
      prova: "Definir corrida, região crítica e exclusão mútua; diferenciar semáforo, mutex e monitor; apontar a região crítica num trecho de código.",
      animacoes: ["corrida"]
    },
    {
      mod: "padroes",
      pergunta: "Além de proteger, como fazer as threads trabalharem juntas?",
      texto: "Exclusão mútua impede o estrago; os <b>padrões</b> organizam a cooperação. Cada um é uma forma recorrente de ordenar eventos entre threads, montada com as mesmas peças: semáforo em 0 para sinalizar, contador para esperar todas, fila para distribuir trabalho. Os <b>problemas clássicos de IPC</b> são os casos de teste em que essas peças funcionam — ou travam.",
      essencial: [
        "Fork/join e travar-destravar são a base; dormir-e-acordar troca espera ocupada por bloqueio, com o risco do sinal perdido.",
        "<b>Barreira</b>: ninguém passa até todas chegarem (<code>pthread_barrier_t</code>, <code>CyclicBarrier</code>).",
        "<b>Pool de threads</b>: uma despachante e N operárias, com ou sem fila de requisições.",
        "<b>Pipeline</b>: estágios ligados por buffers, com vazão ditada pelo estágio mais lento.",
        "<b>Produtor-consumidor</b>: <code>vazios</code>=N e <code>cheios</code>=0 por fora, <code>mutex</code>=1 por dentro.",
        "Jantar dos filósofos, leitores e escritores, barbeiro sonolento — e os três fracassos possíveis: deadlock, livelock, starvation."
      ],
      prova: "Implementar com semáforos (CAFE, barreira, pipeline, produtor-consumidor) e explicar onde cada problema clássico trava ou deixa alguém com fome.",
      animacoes: ["produtor", "filosofos"]
    },
    {
      mod: "deadlocks",
      pergunta: "E quando as threads ficam esperando umas pelas outras para sempre?",
      texto: "<b>Deadlock</b> é um conjunto de processos bloqueados em que cada um espera um recurso que outro do conjunto segura. Ele só acontece se as <b>quatro condições de Coffman</b> valerem juntas. Tratar deadlock é escolher uma estratégia: ignorar, <b>detectar</b> e recuperar, <b>evitar</b> a cada pedido, ou <b>prevenir</b> quebrando uma das condições.",
      essencial: [
        "Coffman: exclusão mútua, posse e espera, não-preempção e espera circular.",
        "<b>Prevenir</b>: atacar uma condição — ordenar os recursos quebra a espera circular e é a mais prática.",
        "<b>Evitar</b>: o Banqueiro só concede se ainda existir uma sequência segura.",
        "<b>Detectar</b>: com as matrizes E, A, C e R, quem não consegue terminar está em deadlock.",
        "Nunca trava se <b>p(m&minus;1) + 1 &le; t</b>.",
        "Deadlock: ninguém progride. Starvation: um processo fica sempre para trás."
      ],
      prova: "Executar o algoritmo de detecção e o Banqueiro passo a passo, e dizer qual condição de Coffman cada solução ataca.",
      animacoes: ["filosofos", "deteccao"]
    },
    {
      mod: "petri",
      pergunta: "Como provar que um sistema concorrente não trava?",
      texto: "Testar não prova ausência de deadlock: o erro pode surgir uma vez em mil execuções. A <b>Rede de Petri</b> modela o sistema com lugares (condições e recursos), transições (eventos) e fichas (o estado). A partir dela é possível enumerar <b>todos</b> os estados alcançáveis e verificar se algum é uma marcação morta.",
      essencial: [
        "Grafo bipartido: arcos só ligam lugar &rarr; transição ou transição &rarr; lugar.",
        "Uma transição dispara quando cada entrada tem fichas suficientes, e o disparo é atômico.",
        "Um lugar com uma ficha modela uma trava; o par Vazios/Cheios modela um buffer.",
        "Marcação morta na árvore de alcançabilidade = deadlock.",
        "Rede <b>viva</b> (sempre dá para disparar tudo de novo), <b>limitada</b> (sem acúmulo infinito), <b>segura</b> (no máximo uma ficha por lugar)."
      ],
      prova: "Modelar o jantar dos filósofos na versão errada e na certa, e provar pela árvore de alcançabilidade.",
      animacoes: ["filosofos"]
    },
    {
      mod: "hardware",
      pergunta: "Por que o paralelismo virou obrigação?",
      texto: "Até meados dos anos 2000 bastava esperar o próximo processador. Com o limite de calor e de potência, a frequência parou de subir e os fabricantes passaram a <b>multiplicar núcleos</b>. Só que um programa serial continua usando um núcleo só: para ganhar desempenho é preciso reescrevê-lo — e conhecer a arquitetura que está por baixo.",
      essencial: [
        "Flynn: SISD, SIMD (GPU e vetorização), MISD (raro) e MIMD (multicore e clusters).",
        "Memória <b>compartilhada</b> (pthreads, OpenMP; o problema é sincronizar) &times; <b>distribuída</b> (MPI; o problema é comunicar).",
        "Pipeline de instruções: o ciclo é ditado pelo estágio mais lento.",
        "Localidade espacial e temporal: percorra a matriz na ordem em que ela está na memória — por linhas, em C.",
        "Threads demais disputam a cache: <i>thrashing</i> e falso compartilhamento."
      ],
      prova: "Classificar arquiteturas por Flynn, calcular o pipeline de instruções e contar faltas de cache em laços por linha e por coluna.",
      animacoes: ["paralelo"]
    },
    {
      mod: "desempenho",
      pergunta: "Paralelizar valeu a pena? Quanto?",
      texto: "Programa paralelo só se justifica medido. O <b>speedup</b> diz quantas vezes ficou mais rápido; a <b>eficiência</b>, quanto de cada núcleo foi aproveitado. A parte que continua serial impõe um teto (<b>Amdahl</b>), mas problemas maiores diluem essa parte (<b>Gustafson</b>). Todo o resto é <i>overhead</i>: comunicação, sincronização, criação de threads e desbalanceamento.",
      essencial: [
        "<b>S</b> = T<sub>serial</sub> / T<sub>paralelo</sub> &nbsp;·&nbsp; <b>E</b> = S / p.",
        "Amdahl: S = 1 / [(1&minus;P) + P/p], com teto 1/(1&minus;P).",
        "Gustafson: S = p &minus; &alpha;(p&minus;1), com o tempo fixo e o problema crescendo.",
        "Escalabilidade <b>forte</b> (problema fixo) &times; <b>fraca</b> (problema cresce junto).",
        "Com <code>join</code>, o tempo total é o da thread mais lenta.",
        "Distribuição por blocos, cíclica ou dinâmica, conforme o custo das iterações."
      ],
      prova: "Calcular speedup, eficiência, Amdahl e Gustafson, e escolher como distribuir a carga de um laço.",
      animacoes: ["paralelo"]
    },
    {
      mod: "openmp",
      pergunta: "Como paralelizar um laço sem escrever as threads à mão?",
      texto: "<b>OpenMP</b> é um conjunto de diretivas de compilador para memória compartilhada. Uma região paralela abre um time de threads e junta todas no final — é o fork/join da P1, automatizado. Continua sendo seu decidir o escopo das variáveis, onde há região crítica e como distribuir as iterações.",
      essencial: [
        "Compile com <code>-fopenmp</code>: sem ele os pragmas são ignorados em silêncio.",
        "<code>parallel for</code>: cada iteração roda uma vez, o índice é privado e há barreira implícita no fim.",
        "<code>shared</code>, <code>private</code> (sem valor inicial) e <code>firstprivate</code> (com o valor de antes).",
        "Para acumular: <code>reduction</code>, depois <code>atomic</code>, e só em último caso <code>critical</code>.",
        "<code>schedule(static)</code> para custo uniforme, <code>dynamic</code> para custo irregular.",
        "Meça com <code>omp_get_wtime()</code>, nunca com <code>clock()</code>."
      ],
      prova: "Corrigir condições de corrida com <code>reduction</code>, <code>atomic</code> ou <code>critical</code>, escolher o <code>schedule</code> e medir o speedup corretamente.",
      animacoes: ["corrida", "paralelo"]
    }
  ],

  /* as ideias que reaparecem de ponta a ponta */
  ideias: [
    ["Sincronizar é um compromisso", "Travar de menos corrompe o dado; travar demais serializa o programa e desfaz o paralelismo."],
    ["Nunca bloqueie segurando uma trava", "…de que outro precisa para te liberar. Está no produtor-consumidor, no banheiro unissex, no jantar e no barbeiro."],
    ["Mutex resolve corrida; semáforo em 0 resolve ordem", "Proteger um dado e impor uma sequência são problemas diferentes, com ferramentas diferentes."],
    ["Deadlock, livelock e starvation não são a mesma coisa", "Parados, ocupados sem progredir, ou um sempre para trás — e cada um tem a sua correção."],
    ["O mais lento manda", "O estágio mais lento do pipeline, a thread mais lenta do <code>join</code>, a parte serial de Amdahl."],
    ["Acertar em 9 de 10 execuções não prova nada", "Concorrência se verifica lendo o código, simulando intercalações ou modelando — não só testando."]
  ]
};
