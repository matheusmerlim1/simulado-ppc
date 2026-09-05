/* ─── Redes de Petri ────────────────────────────────────────
   P1 · 14 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"rp01", mod:"petri", dif:"facil", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"Quais são os elementos que compõem uma <b>Rede de Petri</b>?",
  opcoes:[
    "Lugares (círculos), transições (barras/retângulos), arcos direcionados e fichas/<i>tokens</i> (pontos dentro dos lugares).",
    "Nós, arestas, pesos e caminhos mínimos.",
    "Estados, eventos, guardas e ações, como numa máquina de estados UML.",
    "Processos, recursos, requisições e alocações."
  ],
  correta:0,
  gabarito:"A rede é um <b>grafo bipartido</b>: arcos só ligam lugar&rarr;transição ou transição&rarr;lugar, nunca lugar&rarr;lugar. <b>Lugares</b> representam condições ou recursos; <b>transições</b> representam eventos/ações; <b>fichas</b> representam a disponibilidade do recurso ou a satisfação da condição. A distribuição de fichas pelos lugares num dado instante é a <b>marcação</b>, e ela é o estado do sistema."
},
{
  id:"rp02", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"Quando uma transição está <b>habilitada</b> e o que acontece ao <b>disparar</b>?",
  opcoes:[
    "Está habilitada quando cada lugar de entrada tem pelo menos tantas fichas quanto o peso do arco correspondente; ao disparar, consome essas fichas dos lugares de entrada e produz fichas nos lugares de saída conforme os pesos dos arcos de saída.",
    "Está habilitada quando <b>algum</b> lugar de entrada tem ficha; ao disparar, move essa ficha para todos os lugares de saída.",
    "Está habilitada quando não há fichas nos lugares de saída; ao disparar, copia as fichas de entrada sem consumi-las.",
    "Está sempre habilitada; o disparo é decidido pelo escalonador do sistema operacional."
  ],
  correta:0,
  gabarito:"A condição é <b>conjuntiva</b> — <b>todos</b> os lugares de entrada precisam ter fichas suficientes. É isso que modela naturalmente o &ldquo;preciso dos <b>dois</b> garfos para comer&rdquo;. O disparo é <b>atômico</b>: consome e produz num só passo indivisível. O número de fichas não se conserva: uma transição com 2 arcos de entrada e 1 de saída destrói uma ficha líquida. Quando várias transições estão habilitadas, a escolha de qual dispara é <b>não determinística</b> — o que é justamente o que modela a incerteza do escalonador."
},
{
  id:"rp03", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Lab · Redes de Petri, Q2",
  enunciado:"Numa <b>árvore de alcançabilidade</b>, como se prova que o modelo possui deadlock?",
  opcoes:[
    "Encontrando uma <b>marcação morta</b> alcançável: um nó da árvore a partir do qual nenhuma transição está habilitada.",
    "Encontrando um nó que se repete na árvore, indicando um ciclo infinito.",
    "Contando o número total de fichas: se ele diminuir, há deadlock.",
    "Verificando se a árvore tem mais folhas do que nós internos."
  ],
  correta:0,
  gabarito:"A árvore de alcançabilidade enumera todas as marcações atingíveis a partir da marcação inicial. Um nó <b>folha sem sucessores</b> (nenhuma transição habilitada) é uma <b>marcação morta</b> = deadlock. Provar a <b>ausência</b> de deadlock exige percorrer a árvore inteira e mostrar que <i>toda</i> marcação alcançável tem pelo menos uma transição habilitada. Nós que repetem uma marcação já vista fecham um ciclo e não precisam ser expandidos — é o que mantém a árvore finita para redes limitadas."
},
{
  id:"rp04", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Lab · Redes de Petri, Q1(a)",
  enunciado:"No modelo do Jantar dos Filósofos em que <b>cada garfo é um lugar com 1 ficha</b> e cada filósofo pega primeiro o da esquerda e depois o da direita, o que a árvore de alcançabilidade revela?",
  opcoes:[
    "Existe uma marcação morta: se todos dispararem a transição &ldquo;pega esquerdo&rdquo;, os lugares dos garfos ficam vazios e nenhuma transição &ldquo;pega direito&rdquo; fica habilitada. <b>Há deadlock</b> — é a implementação errada do item (a).",
    "Não há marcação morta: a rede é viva e a implementação está correta.",
    "A rede é ilimitada, pois o número de fichas cresce indefinidamente.",
    "A árvore é infinita, logo nada pode ser concluído."
  ],
  correta:0,
  gabarito:"O laboratório chama o item (a) explicitamente de <b>implementação errada</b>, e a árvore mostra por quê: a sequência de disparos <i>pega_esq(F1), pega_esq(F2), pega_esq(F3)</i> leva a uma marcação em que todos os lugares-garfo estão vazios e cada filósofo espera pelo garfo do vizinho. Nenhuma transição habilitada = <b>marcação morta</b> = deadlock. Repare que a modelagem em Petri torna a demonstração <b>formal</b>, e não apenas argumentativa — é exatamente isso que o Q2 do laboratório cobra."
},
{
  id:"rp05", mod:"petri", dif:"dificil", tipo:"mc",
  fonte:"Lab · Redes de Petri, Q1(b) e (c)",
  enunciado:"Os itens (b) e (c) do laboratório pedem dois modelos de Petri livres de deadlock para o Jantar dos Filósofos. Que estratégia de prevenção cada um representa?",
  opcoes:[
    "(b) &ldquo;pegar 2 garfos de um pool&rdquo; — <b>uma única transição</b> consome as duas fichas atomicamente, atacando <b>posse-e-espera</b>. (c) &ldquo;garfos pegos em ordem&rdquo; — impõe ordem global de aquisição, atacando a <b>espera circular</b>.",
    "(b) ataca a exclusão mútua e (c) ataca a não-preempção.",
    "(b) ataca a espera circular e (c) ataca a posse-e-espera.",
    "Ambos atacam a exclusão mútua, por caminhos diferentes."
  ],
  correta:0,
  gabarito:"A elegância do modelo (b) em Petri: como o disparo de uma transição é <b>atômico</b>, uma única transição com dois arcos de entrada (um de cada garfo) expressa perfeitamente &ldquo;ou pego os dois, ou não pego nenhum&rdquo; — a posse-e-espera desaparece por construção. No modelo (c) a ordem é imposta pela topologia: as transições de aquisição são encadeadas de modo que o garfo de menor índice sempre venha primeiro, tornando a espera circular impossível. Em ambos, a árvore de alcançabilidade não tem marcação morta."
},
{
  id:"rp06", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"Como se modela <b>exclusão mútua</b> entre dois processos numa Rede de Petri?",
  opcoes:[
    "Um lugar &ldquo;mutex&rdquo; com <b>1 ficha</b>, ligado como entrada das transições &ldquo;entra na região crítica&rdquo; dos dois processos e como saída das transições &ldquo;sai da região crítica&rdquo;.",
    "Dois lugares independentes, um por processo, cada um com 1 ficha.",
    "Uma transição compartilhada pelos dois processos, sem lugares intermediários.",
    "Um lugar com 2 fichas, uma para cada processo."
  ],
  correta:0,
  gabarito:"A ficha única <b>é</b> a trava. Quando o processo A dispara sua transição de entrada, ele consome a ficha; a transição de entrada de B deixa de estar habilitada até que A dispare a saída e devolva a ficha ao lugar. Um lugar com 2 fichas modelaria um semáforo de contagem que permite 2 processos simultâneos — e portanto <b>não</b> haveria exclusão mútua."
},
{
  id:"rp07a", mod:"petri", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 7",
  enunciado:"Para modelar o Jantar dos Filósofos com <b>3 filósofos</b> em Rede de Petri, quais são os <b>lugares</b> e qual a <b>marcação inicial</b>?",
  chaves:[
    ["9 lugares","9 lugares","nove lugares","são 9"],
    ["Pensando_i","pensando","pensa"],
    ["Comendo_i","comendo","come"],
    ["Garfo_i","garfo"],
    ["1 ficha em Pensando e em cada Garfo","1 ficha","uma ficha","um token","1 token","1,1,1"],
    ["Comendo começa vazio","vazio","zero","sem ficha","0,0,0"]
  ],
  gabarito:"São <b>9 lugares</b>:<br><br>&bull; <code>Pensando_0</code>, <code>Pensando_1</code>, <code>Pensando_2</code> &mdash; marcação inicial: <b>1 ficha em cada</b> (todos começam pensando).<br>&bull; <code>Comendo_0</code>, <code>Comendo_1</code>, <code>Comendo_2</code> &mdash; inicialmente <b>vazios</b>.<br>&bull; <code>Garfo_0</code>, <code>Garfo_1</code>, <code>Garfo_2</code> &mdash; marcação inicial: <b>1 ficha em cada</b> (todos os garfos livres).<br><br>Escrevendo a marcação como um vetor [Pens0,Pens1,Pens2 | Com0,Com1,Com2 | G0,G1,G2]:<br><br><b>M<sub>0</sub> = [1,1,1 | 0,0,0 | 1,1,1]</b><br><br>Cada garfo tem exatamente 1 ficha porque é um recurso único — é isso que garante a exclusão mútua sobre ele."
},
{
  id:"rp07b", mod:"petri", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 7",
  enunciado:"Continuando o modelo: quais são as <b>transições</b> e seus arcos? Por que essa escolha evita o deadlock?",
  chaves:[
    ["6 transições, duas por filósofo","6 transições","seis transições","duas por filósofo","2 por filósofo"],
    ["Pega_i","pega"],
    ["Larga_i","larga","devolve","solta","libera"],
    ["Pega_i tem 3 arcos de entrada","três arcos","3 arcos","dois garfos","ambos os garfos","os dois garfos"],
    ["o disparo é atômico","atômic","atomic","de uma vez","indivisível"],
    ["logo não existe posse-e-espera","posse e espera","posse-e-espera","um garfo só","estado intermediário","deadlock"]
  ],
  gabarito:"São <b>6 transições</b>, duas por filósofo <i>i</i> (com <i>d</i> = (<i>i</i>+1) mod 3):<br><br>&bull; <code>Pega_i</code> &mdash; <b>entradas:</b> <code>Pensando_i</code>, <code>Garfo_i</code> e <code>Garfo_d</code>. <b>Saída:</b> <code>Comendo_i</code>.<br>&bull; <code>Larga_i</code> &mdash; <b>entrada:</b> <code>Comendo_i</code>. <b>Saídas:</b> <code>Pensando_i</code>, <code>Garfo_i</code> e <code>Garfo_d</code>.<br><br><b>Por que não há deadlock:</b> a transição <code>Pega_i</code> tem <b>três arcos de entrada</b> e só fica habilitada quando o filósofo está pensando <b>e</b> os dois garfos estão livres. Como o disparo é <b>atômico</b>, o estado intermediário &ldquo;segurando um garfo só&rdquo; <b>simplesmente não existe na rede</b>.<br><br>Isso ataca a condição de <b>posse-e-espera</b> por construção.<br><br><b>O que NÃO vale:</b> separar em <code>Pega_esquerdo_i</code> e <code>Pega_direito_i</code> — esse é o modelo (a) do laboratório, explicitamente chamado de implementação errada."
},
{
  id:"rp07c", mod:"petri", dif:"dificil", tipo:"disc",
  fonte:"Prova Teórica · Questão 7 · Lab Redes de Petri Q2",
  enunciado:"Prove, pela <b>árvore de alcançabilidade</b>, que esse modelo está livre de deadlocks.",
  chaves:[
    ["marcação inicial M0","marcação inicial","m0","1,1,1"],
    ["transições habilitadas","habilitad","habilita"],
    ["dispara Pega_0","dispar","pega"],
    ["Larga_0 devolve a M0","larga","volta","retorna","devolve"],
    ["os outros ramos são simétricos","simétric","simetria","rotação","análog","equivalente"],
    ["nenhuma marcação morta: rede viva, sem deadlock","marcação morta","sem marcação morta","viva","livre de deadlock","sempre há uma transição habilitada"]
  ],
  gabarito:"Marcação escrita como [Pens0,Pens1,Pens2 | Com0,Com1,Com2 | G0,G1,G2].<br><br><b>M<sub>0</sub> = [1,1,1 | 0,0,0 | 1,1,1]</b><br>Habilitadas: <code>Pega_0</code>, <code>Pega_1</code>, <code>Pega_2</code>.<br><br><b>Disparando <code>Pega_0</code></b> (consome Pens0, G0, G1):<br><b>M<sub>1</sub> = [0,1,1 | 1,0,0 | 0,0,1]</b><br>&bull; <code>Pega_1</code> precisa de G1 e G2 &rarr; G1 vazio. <b>Não habilitada.</b><br>&bull; <code>Pega_2</code> precisa de G2 e G0 &rarr; G0 vazio. <b>Não habilitada.</b><br>&bull; <code>Larga_0</code> precisa de Com0 &rarr; tem ficha. <b>Habilitada &check;</b><br><br>Disparando <code>Larga_0</code>, volta-se a M<sub>0</sub>.<br><br>Os ramos de <code>Pega_1</code> e <code>Pega_2</code> são <b>simétricos</b> por rotação dos índices, e levam a marcações análogas a M<sub>1</sub>.<br><br><b>Conclusão:</b> o conjunto de alcançabilidade tem apenas 4 marcações (M<sub>0</sub> e as três equivalentes a M<sub>1</sub>), e <b>todas têm pelo menos uma transição habilitada</b>. Não existe marcação morta &rArr; <b>a rede é viva e livre de deadlock</b>. Ela também é <b>segura</b> (1-limitada): nenhum lugar chega a ter 2 fichas.<br><br><i>Note ainda que com 3 filósofos e 3 garfos apenas <b>um</b> come por vez — o modelo é correto, mas com pouco paralelismo.</i>"
},
{
  id:"rp08", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"O que significa dizer que uma Rede de Petri é <b>viva</b> (<i>live</i>) e que é <b>segura</b> (<i>safe</i>)?",
  opcoes:[
    "<b>Viva</b>: a partir de qualquer marcação alcançável, é sempre possível disparar qualquer transição da rede em algum momento futuro — logo não há deadlock nem transições mortas. <b>Segura</b>: nenhum lugar contém mais de 1 ficha em nenhuma marcação alcançável (1-limitada).",
    "<b>Viva</b>: a rede tem pelo menos uma ficha. <b>Segura</b>: a rede não tem ciclos.",
    "<b>Viva</b>: todas as transições disparam pelo menos uma vez. <b>Segura</b>: o número total de fichas é constante.",
    "<b>Viva</b>: a árvore de alcançabilidade é finita. <b>Segura</b>: a rede é bipartida."
  ],
  correta:0,
  gabarito:"<b>Vivacidade</b> é a propriedade que garante ausência de deadlock <i>e</i> de starvation estrutural: nenhuma parte da rede fica permanentemente inútil. <b>Limitação (boundedness)</b> garante que nenhum lugar acumule fichas indefinidamente — importante porque uma rede ilimitada tem árvore de alcançabilidade infinita. <b>Segura</b> é o caso particular de 1-limitada, típico de modelos de recursos únicos, como cada garfo do jantar."
},
{
  id:"rp09", mod:"petri", dif:"dificil", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"O que representa o <b>peso</b> de um arco numa Rede de Petri, e como ele é usado no Jantar dos Filósofos com <i>pool</i> de garfos?",
  opcoes:[
    "O peso indica quantas fichas o arco consome (ou produz) num disparo. Com um lugar <code>Garfos</code> de 3 fichas e arco de peso 2 entrando na transição &ldquo;pega&rdquo;, o filósofo retira 2 garfos <b>atomicamente</b>.",
    "O peso é a prioridade da transição: arcos de maior peso disparam primeiro.",
    "O peso é o tempo, em milissegundos, que o disparo leva para completar.",
    "O peso é a probabilidade de a transição ser escolhida quando várias estão habilitadas."
  ],
  correta:0,
  gabarito:"Peso é <b>multiplicidade</b>: um arco de peso 2 exige 2 fichas para habilitar e consome 2 ao disparar. É o mecanismo que expressa &ldquo;preciso de 2 unidades do recurso, tudo ou nada&rdquo; — exatamente a prevenção de posse-e-espera do item (b) do laboratório. Redes de Petri básicas <b>não têm tempo nem probabilidade</b>; para isso existem extensões (redes temporizadas e estocásticas), que não fazem parte do modelo padrão cobrado."
},
{
  id:"rp10", mod:"petri", dif:"medio", tipo:"vf",
  fonte:"Lab · Redes de Petri",
  enunciado:"Quando várias transições estão habilitadas ao mesmo tempo numa Rede de Petri, a escolha de qual disparar é não determinística.",
  correta:0,
  gabarito:"<b>Verdadeiro.</b> E esse não determinismo é <b>a razão de o modelo servir para sistemas concorrentes</b>: ele representa fielmente o fato de que a ordem de execução é decidida pelo escalonador e não pode ser prevista. Por isso a árvore de alcançabilidade precisa explorar <b>todas</b> as escolhas possíveis — é assim que se encontram os deadlocks que aparecem apenas em escalonamentos raros, aqueles que os testes empíricos deixam passar."
},
{
  id:"rp11", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"Como se modela o padrão <b>produtor/consumidor</b> com buffer limitado de N posições numa Rede de Petri?",
  opcoes:[
    "Dois lugares em oposição: <code>Vazios</code> com N fichas e <code>Cheios</code> com 0. A transição &ldquo;produzir&rdquo; consome de <code>Vazios</code> e produz em <code>Cheios</code>; &ldquo;consumir&rdquo; faz o inverso.",
    "Um único lugar <code>Buffer</code> com N fichas, compartilhado pelas duas transições.",
    "Dois lugares independentes, um para o produtor e outro para o consumidor, sem arcos entre eles.",
    "Uma transição só, com N arcos de entrada e N de saída."
  ],
  correta:0,
  gabarito:"É a tradução direta dos dois semáforos de contagem: <code>Vazios</code> é o semáforo <code>vazio</code> inicializado em N, e <code>Cheios</code> é o semáforo <code>cheio</code> inicializado em 0. A soma das fichas nos dois lugares é sempre N — um <b>invariante de lugar</b>, que é exatamente a prova formal de que o buffer nunca estoura nem é lido vazio. Se houver múltiplos produtores/consumidores, acrescenta-se um lugar <code>mutex</code> com 1 ficha para proteger a estrutura."
},
{
  id:"rp12", mod:"petri", dif:"facil", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"O que é a <b>marcação</b> de uma Rede de Petri?",
  opcoes:[
    "A distribuição das fichas pelos lugares num dado instante — ou seja, o <b>estado</b> do sistema modelado.",
    "O conjunto de transições que já dispararam desde o início.",
    "O peso atribuído a cada arco da rede.",
    "A ordem em que as transições devem disparar."
  ],
  correta:0,
  gabarito:"A marcação é um vetor com o número de fichas de cada lugar, por exemplo M = (1, 0, 1, 1). A <b>marcação inicial</b> M<sub>0</sub> descreve o estado de partida, e cada disparo leva a uma nova marcação. O conjunto de todas as marcações atingíveis a partir de M<sub>0</sub> é o <b>conjunto de alcançabilidade</b>, que a árvore enumera — e é sobre ele que se provam deadlock, vivacidade e limitação."
}

]);
