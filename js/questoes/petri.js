/* ─── Redes de Petri ────────────────────────────────────────
   P1 · 29 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"rp01", mod:"petri", dif:"facil", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"Quais são os elementos que compõem uma <b>Rede de Petri</b>?",
  opcoes:[
    "Lugares (círculos), transições (barras ou retângulos), arcos direcionados e fichas dentro dos lugares.",
    "Nós, arestas, pesos e caminhos mínimos entre os nós do grafo dirigido.",
    "Estados, eventos, guardas e ações, como numa máquina de estados UML.",
    "Processos, recursos, requisições e alocações, como no grafo de alocação visto no capítulo de deadlocks."
  ],
  correta:0,
  gabarito:"A rede é um <b>grafo bipartido</b>: arcos só ligam lugar&rarr;transição ou transição&rarr;lugar, nunca lugar&rarr;lugar. <b>Lugares</b> representam condições ou recursos; <b>transições</b> representam eventos/ações; <b>fichas</b> representam a disponibilidade do recurso ou a satisfação da condição. A distribuição de fichas pelos lugares num dado instante é a <b>marcação</b>, e ela é o estado do sistema."
},
{
  id:"rp02", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"Quando uma transição está <b>habilitada</b> e o que acontece ao <b>disparar</b>?",
  opcoes:[
    "Habilitada quando cada lugar de entrada tem fichas suficientes para o peso do arco; ao disparar, consome essas fichas e produz nas saídas.",
    "Habilitada quando <b>algum</b> lugar de entrada tem ficha; ao disparar, move essa ficha para todos os lugares de saída.",
    "Habilitada quando não há fichas nos lugares de saída; ao disparar, copia as fichas de entrada sem consumi-las.",
    "Está sempre habilitada; quem decide o disparo é o escalonador do sistema operacional da máquina em uso."
  ],
  correta:0,
  gabarito:"A condição é <b>conjuntiva</b> — <b>todos</b> os lugares de entrada precisam ter fichas suficientes. É isso que modela naturalmente o &ldquo;preciso dos <b>dois</b> garfos para comer&rdquo;. O disparo é <b>atômico</b>: consome e produz num só passo indivisível. O número de fichas não se conserva: uma transição com 2 arcos de entrada e 1 de saída destrói uma ficha líquida. Quando várias transições estão habilitadas, a escolha de qual dispara é <b>não determinística</b> — o que é justamente o que modela a incerteza do escalonador."
},
{
  id:"rp03", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Lab · Redes de Petri, Q2",
  enunciado:"Numa <b>árvore de alcançabilidade</b>, como se prova que o modelo possui deadlock?",
  opcoes:[
    "Encontrando uma <b>marcação morta</b> alcançável: um nó a partir do qual nenhuma transição está habilitada.",
    "Encontrando um nó que se repete na árvore, o que indicaria um ciclo infinito de disparos dentro da rede.",
    "Contando o total de fichas da rede: se ele diminuir, há deadlock no modelo.",
    "Verificando se a árvore tem mais folhas do que nós internos no total."
  ],
  correta:0,
  gabarito:"A árvore de alcançabilidade enumera todas as marcações atingíveis a partir da marcação inicial. Um nó <b>folha sem sucessores</b> (nenhuma transição habilitada) é uma <b>marcação morta</b> = deadlock. Provar a <b>ausência</b> de deadlock exige percorrer a árvore inteira e mostrar que <i>toda</i> marcação alcançável tem pelo menos uma transição habilitada. Nós que repetem uma marcação já vista fecham um ciclo e não precisam ser expandidos — é o que mantém a árvore finita para redes limitadas."
},
{
  id:"rp04", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Lab · Redes de Petri, Q1(a)",
  enunciado:"No modelo do Jantar dos Filósofos em que <b>cada garfo é um lugar com 1 ficha</b> e cada filósofo pega primeiro o da esquerda e depois o da direita, o que a árvore de alcançabilidade revela?",
  opcoes:[
    "Há uma <b>marcação morta</b>: se todos dispararem &ldquo;pega esquerdo&rdquo;, os lugares dos garfos zeram e nenhum &ldquo;pega direito&rdquo; habilita.",
    "Não há marcação morta: a rede é viva e essa implementação está correta como está.",
    "A rede é ilimitada, porque o número de fichas cresce indefinidamente a cada disparo.",
    "A árvore fica infinita e, por isso, nada pode ser concluído dela sobre deadlock."
  ],
  correta:0,
  gabarito:"O laboratório chama o item (a) explicitamente de <b>implementação errada</b>, e a árvore mostra por quê: a sequência de disparos <i>pega_esq(F1), pega_esq(F2), pega_esq(F3)</i> leva a uma marcação em que todos os lugares-garfo estão vazios e cada filósofo espera pelo garfo do vizinho. Nenhuma transição habilitada = <b>marcação morta</b> = deadlock. Repare que a modelagem em Petri torna a demonstração <b>formal</b>, e não apenas argumentativa — é exatamente isso que o Q2 do laboratório cobra."
},
{
  id:"rp05", mod:"petri", dif:"dificil", tipo:"mc",
  fonte:"Lab · Redes de Petri, Q1(b) e (c)",
  enunciado:"Os itens (b) e (c) do laboratório pedem dois modelos de Petri livres de deadlock para o Jantar dos Filósofos. Que estratégia de prevenção cada um representa?",
  opcoes:[
    "(b) uma <b>única transição</b> consome os dois garfos — ataca <b>posse-e-espera</b>; (c) ordem global de aquisição — ataca a <b>espera circular</b>.",
    "(b) ataca a exclusão mútua dos garfos e (c) ataca a não-preempção, permitindo tomar o garfo já pego pelo vizinho de mesa à direita.",
    "(b) ataca a espera circular e (c) ataca a posse-e-espera dos filósofos com fome.",
    "Os dois atacam a exclusão mútua, por caminhos diferentes dentro do mesmo modelo."
  ],
  correta:0,
  gabarito:"A elegância do modelo (b) em Petri: como o disparo de uma transição é <b>atômico</b>, uma única transição com dois arcos de entrada (um de cada garfo) expressa perfeitamente &ldquo;ou pego os dois, ou não pego nenhum&rdquo; — a posse-e-espera desaparece por construção. No modelo (c) a ordem é imposta pela topologia: as transições de aquisição são encadeadas de modo que o garfo de menor índice sempre venha primeiro, tornando a espera circular impossível. Em ambos, a árvore de alcançabilidade não tem marcação morta."
},
{
  id:"rp06", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"Como se modela <b>exclusão mútua</b> entre dois processos numa Rede de Petri?",
  opcoes:[
    "Um lugar <code>mutex</code> com <b>1 ficha</b>, entrada das transições &ldquo;entra na região crítica&rdquo; e saída das transições &ldquo;sai&rdquo;.",
    "Dois lugares independentes, um por processo, cada um com uma ficha inicial.",
    "Uma transição compartilhada pelos dois processos, sem lugares intermediários.",
    "Um único lugar com 2 fichas, uma para cada processo da rede modelada."
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
    "<b>Viva</b>: de qualquer marcação ainda é possível disparar qualquer transição — sem deadlock. <b>Segura</b>: nenhum lugar passa de 1 ficha.",
    "<b>Viva</b>: a rede tem pelo menos uma ficha. <b>Segura</b>: a rede não tem nenhum ciclo entre os lugares.",
    "<b>Viva</b>: todas as transições disparam pelo menos uma vez. <b>Segura</b>: o número total de fichas é constante em toda marcação alcançável.",
    "<b>Viva</b>: a árvore de alcançabilidade é finita. <b>Segura</b>: a rede é bipartida por construção."
  ],
  correta:0,
  gabarito:"<b>Vivacidade</b> é a propriedade que garante ausência de deadlock <i>e</i> de starvation estrutural: nenhuma parte da rede fica permanentemente inútil. <b>Limitação (boundedness)</b> garante que nenhum lugar acumule fichas indefinidamente — importante porque uma rede ilimitada tem árvore de alcançabilidade infinita. <b>Segura</b> é o caso particular de 1-limitada, típico de modelos de recursos únicos, como cada garfo do jantar."
},
{
  id:"rp09", mod:"petri", dif:"dificil", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"O que representa o <b>peso</b> de um arco numa Rede de Petri, e como ele é usado no Jantar dos Filósofos com <i>pool</i> de garfos?",
  opcoes:[
    "Quantas fichas o arco consome ou produz num disparo; com peso 2 saindo de <code>Garfos</code>, o filósofo tira 2 <b>atomicamente</b>.",
    "É a prioridade da transição: arcos de maior peso disparam primeiro que os demais.",
    "É o tempo, em milissegundos, que o disparo leva para se completar na rede.",
    "É a probabilidade de a transição ser escolhida quando várias estão habilitadas."
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
    "Dois lugares em oposição: <code>Vazios</code> com N fichas e <code>Cheios</code> com 0; produzir move de um ao outro e consumir, o inverso.",
    "Um único lugar <code>Buffer</code> com N fichas, compartilhado pelas duas transições.",
    "Dois lugares independentes, um para cada papel, sem nenhum arco ligando os dois lados do buffer de tamanho limitado.",
    "Uma transição só, com N arcos de entrada e N arcos de saída no buffer."
  ],
  correta:0,
  gabarito:"É a tradução direta dos dois semáforos de contagem: <code>Vazios</code> é o semáforo <code>vazio</code> inicializado em N, e <code>Cheios</code> é o semáforo <code>cheio</code> inicializado em 0. A soma das fichas nos dois lugares é sempre N — um <b>invariante de lugar</b>, que é exatamente a prova formal de que o buffer nunca estoura nem é lido vazio. Se houver múltiplos produtores/consumidores, acrescenta-se um lugar <code>mutex</code> com 1 ficha para proteger a estrutura."
},
{
  id:"rp12", mod:"petri", dif:"facil", tipo:"mc",
  fonte:"Lab · Redes de Petri",
  enunciado:"O que é a <b>marcação</b> de uma Rede de Petri?",
  opcoes:[
    "A distribuição das fichas pelos lugares num dado instante — o <b>estado</b> do sistema modelado.",
    "O conjunto de transições que já dispararam desde o início da execução.",
    "O peso atribuído a cada um dos arcos da rede, definido no desenho.",
    "A ordem em que as transições devem disparar na rede modelada."
  ],
  correta:0,
  gabarito:"A marcação é um vetor com o número de fichas de cada lugar, por exemplo M = (1, 0, 1, 1). A <b>marcação inicial</b> M<sub>0</sub> descreve o estado de partida, e cada disparo leva a uma nova marcação. O conjunto de todas as marcações atingíveis a partir de M<sub>0</sub> é o <b>conjunto de alcançabilidade</b>, que a árvore enumera — e é sobre ele que se provam deadlock, vivacidade e limitação."
},
{
  id:"rp13", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Slides · Redes de Petri · conflito",
  enunciado:"Um lugar <code>p1</code> com <b>uma</b> marca é entrada das transições <code>t1</code> e <code>t2</code>. O que caracteriza essa situação?",
  cod:"        t1 --> p2\n       /\n p1 (*)\n       \\\n        t2 --> p3",
  opcoes:[
    "As duas estão habilitadas, mas em <b>conflito</b>: a marca é uma só, então disparar uma <b>desabilita</b> a outra.",
    "As duas disparam ao mesmo tempo, e <code>p2</code> e <code>p3</code> recebem uma marca cada.",
    "Nenhuma está habilitada, porque uma única marca não basta para as duas transições de saída do mesmo lugar.",
    "Sempre dispara <code>t1</code>, porque está desenhada acima de <code>t2</code> no diagrama."
  ],
  correta:0,
  gabarito:"Duas transições habilitadas que compartilham a marca de um lugar de entrada estão em <b>conflito</b>. Só uma dispara, e o disparo consome a marca, desabilitando a outra.<br><br><b>Por que isso é uma qualidade do modelo:</b> o resultado passa a depender da ordem de disparo, que é <b>não determinística</b> — exatamente o que acontece com threads disputando um recurso quando quem decide é o escalonador.<br><br>&bull; As duas dispararem juntas só aconteceria numa rede com <b>duas</b> marcas em <code>p1</code>.<br>&bull; Achar que <code>t1</code> dispara por estar desenhada acima é o erro mais comum: a <b>posição no desenho não influencia nada</b>. A rede não tem prioridade nem tempo.<br><br><b>Cuidado na modelagem:</b> antes de desenhar um conflito, confirme que o sistema real também tem essa disputa."
},
{
  id:"rp14", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Slides · Redes de Petri · independência dos disparos",
  enunciado:"Duas transições estão habilitadas e <b>não compartilham</b> nenhum lugar de entrada. Qual disparar primeiro?",
  opcoes:[
    "Tanto faz: os disparos são <b>independentes</b> e a marcação final é a mesma — é assim que a rede modela <b>paralelismo</b>.",
    "A que tiver mais marcas no lugar de entrada, para não acumular fichas ali.",
    "As duas precisam disparar exatamente ao mesmo tempo, senão o modelo fica inconsistente.",
    "A ordem importa sempre: qualquer par de transições habilitadas está em conflito."
  ],
  correta:0,
  gabarito:"A regra de disparo é <b>local</b>: uma transição só olha para os próprios lugares de entrada e saída. Sem lugar em comum, uma não interfere na outra, e a marcação final é a mesma nas duas ordens.<br><br><b>É a distinção que vale ponto:</b><br>&bull; <b>Conflito</b> — compartilham entrada, disparar uma desabilita a outra: modela <b>disputa</b>.<br>&bull; <b>Independência</b> — não compartilham nada: modela <b>concorrência e paralelismo</b>.<br><br>Como o disparo é considerado <b>instantâneo</b>, a rede nunca precisa representar dois disparos simultâneos: basta escolher uma ordem qualquer entre eventos independentes. É a <b>ordenação parcial</b> dos eventos."
},
{
  id:"rp15", mod:"petri", dif:"facil", tipo:"mc",
  fonte:"Slides · Redes de Petri · modelagem",
  enunciado:"Ao modelar um sistema com Redes de Petri, o que cada elemento representa?",
  opcoes:[
    "<b>Lugares</b> = condições ou recursos, <b>transições</b> = eventos, <b>arcos</b> = a interação entre eles. O estado é a marcação.",
    "<b>Lugares</b> = eventos, <b>transições</b> = condições, e os arcos indicam a ordem cronológica.",
    "<b>Lugares</b> = processos, <b>transições</b> = processadores, e as marcas indicam o tempo gasto.",
    "<b>Lugares</b> = variáveis do programa, <b>transições</b> = linhas de código, e os arcos são os desvios do fluxo de execução."
  ],
  correta:0,
  gabarito:"É o vocabulário da modelagem: as <b>condições</b> do sistema viram lugares (&ldquo;CPU parada&rdquo;, &ldquo;processo na fila&rdquo;, &ldquo;garfo livre&rdquo;), os <b>eventos</b> viram transições (&ldquo;iniciar processamento&rdquo;, &ldquo;pegar garfo&rdquo;) e os arcos dizem quais condições um evento consome e quais produz.<br><br><b>Estado = marcação.</b> Cada disparo altera a marcação, e essa alteração <b>é</b> a mudança de estado do sistema modelado. Por isso a análise de estados alcançáveis responde perguntas sobre o sistema real.<br><br>A técnica serve a sistemas <b>orientados a eventos discretos</b>, com eventos concorrentes ou paralelos."
},
{
  id:"rp16", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Slides · Redes de Petri · escalonador",
  enunciado:"No modelo do escalonador — lugares <code>PFE</code> (fila de entrada), <code>PAR</code> (CPU parada), <code>PROC</code> (em processamento) e <code>PFS</code> (fila de saída) —, como se representa um sistema com <b>3 CPUs</b>, e quantas marcas podem aparecer em <code>PROC</code>?",
  opcoes:[
    "Colocando <b>3 marcas</b> em <code>PAR</code>. Em <code>PROC</code> podem aparecer até <b>3</b> marcas — um processamento por CPU disponível.",
    "Triplicando a rede inteira: três cópias de todos os lugares e transições.",
    "Colocando 3 marcas em <code>PFE</code>, já que são os processos que ocupam as CPUs.",
    "Acrescentando peso 3 ao arco que sai de <code>PAR</code>, para consumir as três de uma vez."
  ],
  correta:0,
  gabarito:"<b>A marca em <code>PAR</code> representa uma CPU livre.</b> Três CPUs, três marcas — e a estrutura da rede não muda em nada. É a elegância do modelo: a mesma rede serve para 1, 3 ou 100 CPUs.<br><br><code>INICIAR</code> consome uma marca de <code>PFE</code> e uma de <code>PAR</code>, e produz uma em <code>PROC</code>. Como há 3 marcas em <code>PAR</code>, <code>INICIAR</code> pode disparar até três vezes antes de <code>PAR</code> zerar: <code>PROC</code> chega a <b>3</b> marcas, e o lugar vira <b>3-limitado</b>.<br><br>Pôr peso 3 no arco que sai de <code>PAR</code> descreveria uma CPU que só começa a trabalhar quando as três estão livres — e consumiria as três de uma vez, o oposto do que se quer.<br><br><i>O tempo de processamento não é representado: interessa a interação entre os processos, não a duração.</i>"
},
{
  id:"rp17", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Slides · Redes de Petri · semáforo de tráfego",
  enunciado:"Um semáforo de trânsito é modelado com três lugares (<code>VERDE</code>, <code>AMARELO</code>, <code>VERMELHO</code>) em ciclo e <b>uma única marca</b>. O que essa marca única garante, e como se impede que <b>dois</b> semáforos de um cruzamento fiquem verdes ao mesmo tempo?",
  opcoes:[
    "A marca única deixa <b>só uma lâmpada</b> acesa por vez; para dois semáforos, um lugar <code>S</code> com <b>uma</b> marca libera o verde de um de cada vez.",
    "A marca única representa o tempo de cada fase do ciclo; para dois semáforos basta dobrar o número de marcas que circulam na rede inteira.",
    "Nada garante: é preciso um temporizador em cada transição para que as lâmpadas se alternem.",
    "Os dois semáforos ficam corretos sozinhos, porque a rede nunca permite dois eventos simultâneos."
  ],
  correta:0,
  gabarito:"<b>Um semáforo:</b> os três lugares em ciclo com uma marca circulando entre eles. Como a marca é uma só, exatamente uma condição é verdadeira a cada instante — uma lâmpada acesa.<br><br><b>Dois semáforos:</b> um lugar <code>S</code> com uma marca funciona como <b>permissão de abrir</b>. As transições que levam ao verde têm <code>S</code> como entrada, e as que saem do verde devolvem a marca. Com <code>S</code> = 1, só um verde por vez — <b>é exatamente o padrão do mutex</b>, aplicado ao cruzamento.<br><br>Dizer que a rede já resolve sozinha confunde os conceitos: ela não permite dois <i>disparos</i> simultâneos, mas nada impediria dois lugares de verde terem marca ao mesmo tempo se não houvesse o controle."
},
{
  id:"rp18", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Slides · Redes de Petri · mutex",
  enunciado:"No modelo do mutex (<code>FILA_ENTRADA</code> &rarr; <code>ENTRAR</code> &rarr; <code>RC</code> &rarr; <code>SAIR</code> &rarr; <code>FILA_SAIDA</code>, com o lugar <code>MUTEX</code> ligado a <code>ENTRAR</code> e recebendo de <code>SAIR</code>), o que acontece se <code>MUTEX</code> começar com <b>2</b> marcas?",
  opcoes:[
    "Dois processos passam a ficar em <code>RC</code> ao mesmo tempo: deixa de ser exclusão mútua e vira um <b>semáforo de contagem</b>.",
    "Nada muda: a transição <code>ENTRAR</code> continua consumindo uma marca por disparo.",
    "A rede trava, porque sobra uma marca que nunca chega a ser consumida por ninguém.",
    "Os processos passam a entrar duas vezes cada um na região crítica, em sequência."
  ],
  correta:0,
  gabarito:"A ficha de <code>MUTEX</code> <b>é</b> a trava, e o número de fichas é o número de processos que podem estar lá dentro ao mesmo tempo.<br><br>Com <b>1</b>: depois do primeiro <code>ENTRAR</code>, <code>MUTEX</code> fica vazio e a transição deixa de estar habilitada, mesmo havendo processos esperando na fila. Vale o invariante <b>RC + MUTEX = 1</b>.<br><br>Com <b>2</b>: dois disparos de <code>ENTRAR</code> acontecem antes de a trava esgotar, e <code>RC</code> chega a duas marcas. É a diferença entre <b>mutex</b> e <b>semáforo de contagem</b> — a mesma estrutura, só muda a marcação inicial.<br><br>Quem responde que nada muda ignora que a condição de habilitação olha para a <b>quantidade de marcas</b> disponíveis, e não para cada disparo isolado."
},
{
  id:"rp19", mod:"petri", dif:"dificil", tipo:"mc",
  fonte:"Slides · Redes de Petri · produtor-consumidor",
  enunciado:"No modelo do produtor-consumidor com fila de 3 espaços, <code>TAMANHO</code> começa com 3 marcas e <code>DADOS</code> com 0. <code>PRODUZIR</code> consome de <code>TAMANHO</code> e produz em <code>DADOS</code>; <code>CONSUMIR</code> faz o inverso. O que <b>prova</b> que o buffer nunca estoura nem é lido vazio?",
  opcoes:[
    "O <b>invariante de lugar</b> <code>TAMANHO</code> + <code>DADOS</code> = 3: com a fila cheia <code>PRODUZIR</code> desabilita; com ela vazia, <code>CONSUMIR</code> desabilita.",
    "O fato de <code>PRODUZIR</code> e <code>CONSUMIR</code> nunca estarem habilitadas ao mesmo tempo na rede.",
    "A marca que circula pelo lugar <code>PRODUTOR</code>, que impede duas produções seguidas.",
    "Nada prova: seria preciso um temporizador para que o consumo acompanhasse a produção dentro do mesmo ritmo da fila cheia."
  ],
  correta:0,
  gabarito:"Some as marcas de <code>TAMANHO</code> e <code>DADOS</code> em qualquer marcação alcançável: dá sempre <b>3</b>. Cada disparo tira uma de um e põe uma no outro. Isso é um <b>invariante de lugar</b>, e é uma <b>prova</b> — não um teste.<br><br>Dele saem as duas garantias:<br>&bull; <code>DADOS</code> nunca passa de 3 &rarr; o buffer não estoura;<br>&bull; <code>CONSUMIR</code> exige uma marca em <code>DADOS</code> &rarr; não se lê de um buffer vazio.<br><br>É a tradução exata dos semáforos <code>vazios</code> = N e <code>cheios</code> = 0 do código.<br><br>Dizer que as duas transições nunca estão habilitadas juntas é falso: com a fila parcialmente cheia, as duas <b>estão</b> habilitadas ao mesmo tempo — produtor e consumidor trabalham em paralelo, e é isso que se quer."
},
{
  id:"rp20", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Slides · Redes de Petri · eventos não primitivos",
  enunciado:"Numa Rede de Petri comum, o disparo é <b>instantâneo</b>. Como então modelar um evento que <b>leva tempo</b>, como o processamento de uma tarefa?",
  opcoes:[
    "Quebrando em <b>dois</b> eventos — início e término — com um <b>lugar</b> entre eles; a duração é o tempo que a marca fica ali.",
    "Associando um peso maior ao arco de saída, proporcional à duração do evento.",
    "Colocando várias marcas no lugar de entrada, uma para cada unidade de tempo.",
    "Não é possível: redes de Petri não representam eventos demorados de jeito nenhum."
  ],
  correta:0,
  gabarito:"Eventos instantâneos são chamados <b>primitivos</b>. Um evento <b>não primitivo</b> gasta tempo, e o jeito de representá-lo sem estender o formalismo é separar <b>início</b> e <b>término</b>, com um lugar no meio para o estado intermediário.<br><br>É exatamente o que o modelo do escalonador faz: <code>INICIAR</code> &rarr; <code>PROC</code> &rarr; <code>FINAL</code>. Enquanto a marca está em <code>PROC</code>, a tarefa &ldquo;está sendo executada&rdquo;.<br><br>Repare no ganho: esse lugar intermediário permite perguntar quantas tarefas estão em execução ao mesmo tempo — algo que um único evento instantâneo não conseguiria expressar.<br><br>Quando o <b>valor</b> da duração importa, aí sim é preciso uma <b>extensão</b>: redes temporizadas."
},
{
  id:"rp21", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Slides · Redes de Petri · abreviações e extensões",
  enunciado:"Qual é a diferença entre <b>abreviações</b> e <b>extensões</b> das Redes de Petri?",
  opcoes:[
    "<b>Abreviações</b> só simplificam o desenho (pesos, capacidade, cores); <b>extensões</b> mudam as regras e dão mais poder (inibidores, tempo).",
    "Abreviações valem só para redes pequenas; extensões, para redes com muitos lugares e transições.",
    "Abreviações são as redes de marcas coloridas; extensões são as que admitem vários arcos entre os mesmos dois elementos da rede desenhada.",
    "Não há diferença prática: os dois termos descrevem exatamente a mesma coisa na literatura."
  ],
  correta:0,
  gabarito:"A pergunta é sempre a mesma: <b>a rede passa a modelar algo que antes não modelava?</b><br><br>&bull; <b>Abreviações</b> — não. Um arco de peso 3 poderia ser desenhado como três arcos; uma rede colorida poderia ser expandida numa rede comum maior. Ganha-se legibilidade, não poder.<br>&bull; <b>Extensões</b> — sim. O <b>arco inibidor</b> permite testar a <b>ausência</b> de marcas, algo impossível na rede comum, e com ele a rede alcança o poder de uma <b>Máquina de Turing</b>. Tempo, prioridades e eventos externos também mudam as regras de disparo.<br><br>O preço das extensões é a análise: propriedades que eram decidíveis na rede comum podem deixar de ser."
},
{
  id:"rp22", mod:"petri", dif:"dificil", tipo:"mc",
  fonte:"Slides · Redes de Petri · arcos inibidores",
  enunciado:"O que faz um <b>arco inibidor</b> numa Rede de Petri?",
  opcoes:[
    "Liga um lugar a uma transição e só permite o disparo <b>quando o lugar não tem marcas</b> — é um teste de <b>ausência</b>.",
    "Impede permanentemente o disparo da transição a que está ligado na rede.",
    "Remove todas as marcas do lugar de origem quando a transição dispara.",
    "Liga duas transições e impede que disparem na mesma ordem duas vezes seguidas."
  ],
  correta:0,
  gabarito:"O arco comum pergunta &ldquo;<b>há</b> marca suficiente?&rdquo;. O inibidor pergunta o contrário: &ldquo;<b>está vazio?</b>&rdquo;. Ele não consome nada quando a transição dispara — só condiciona.<br><br><b>Para que serve:</b> modelar prioridade e exceções. &ldquo;Só atenda a fila secundária <b>se</b> a principal estiver vazia&rdquo; é imediato com um inibidor, e trabalhoso sem ele.<br><br><b>Por que é uma extensão e não uma abreviação:</b> testar ausência não é expressável numa rede comum. Com arcos inibidores, a rede ganha poder de <b>Máquina de Turing</b> — e, em troca, perde as garantias de análise que tornavam o formalismo atraente.<br><br>Remover todas as marcas do lugar no disparo é outra extensão: o <i>arco de esvaziamento</i> (<i>reset</i>)."
},
{
  id:"rp23", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Slides · Redes de Petri · capacidade e conservação",
  enunciado:"Uma rede em que <b>toda</b> transição tem o mesmo número de arcos de entrada e de saída é chamada de:",
  opcoes:[
    "<b>Conservativa</b> — as marcas não são criadas nem destruídas, e o total na rede fica constante.",
    "<b>Segura</b> — nenhum lugar da rede passa de uma única marca por vez.",
    "<b>Viva</b> — qualquer transição da rede sempre poderá disparar de novo em algum momento futuro.",
    "<b>Limitada</b> — existe um número máximo de marcas por lugar da rede."
  ],
  correta:0,
  gabarito:"São quatro propriedades que costumam ser confundidas:<br><br>&bull; <b>Conservativa</b> — cada disparo remove tantas marcas quantas produz, então o total na rede nunca muda. Serve para modelar recursos que apenas <b>circulam</b>, como o elevador ou a marca do semáforo.<br>&bull; <b>Segura</b> — nenhum lugar passa de 1 marca (caso particular de 1-limitada). Típico de recursos únicos, como cada garfo.<br>&bull; <b>K-limitada</b> — nenhum lugar passa de K marcas. Importa porque uma rede ilimitada tem árvore de alcançabilidade infinita.<br>&bull; <b>Viva</b> — a partir de qualquer marcação alcançável, ainda é possível disparar qualquer transição. Garante ausência de deadlock e de transições mortas.<br><br><i>Conservação é sobre o total de marcas; limitação, sobre o máximo por lugar.</i>"
},
{
  id:"rp24", mod:"petri", dif:"dificil", tipo:"mc",
  fonte:"Slides · Redes de Petri · árvore de alcançabilidade",
  enunciado:"Na construção da árvore de alcançabilidade, quando se substitui o número de marcas de um lugar pelo símbolo <b>&omega;</b>, e o que ele significa?",
  cod:"p1 (*) --> t --> p2      t devolve a marca a p1 e acrescenta uma em p2\n\nM0 = (1, 0)\nM1 = (1, 1)      disparo de t\nM2 = (1, 2)      disparo de t   ...\n\n            =>   (1, w)",
  opcoes:[
    "Quando a marcação é <b>maior ou igual</b> à de um ancestral do mesmo ramo: aquele lugar é <b>ilimitado</b>.",
    "Quando a marcação se repete exatamente: significa que a rede voltou ao seu estado inicial de partida.",
    "Quando a transição está em conflito com outra: o valor depende da ordem de disparo.",
    "Quando o lugar não tem arcos de saída: significa que as marcas ficam presas ali."
  ],
  correta:0,
  gabarito:"O raciocínio é o seguinte: se disparar <i>t</i> levou de M<sub>i</sub> a M<sub>i+1</sub> com M<sub>i+1</sub> &ge; M<sub>i</sub> em todos os lugares, então <i>t</i> continua habilitada e pode disparar <b>de novo</b>, gerando M<sub>i+2</sub> &ge; M<sub>i+1</sub>... Existe uma <b>sequência infinita</b> de disparos, e aquele lugar cresce sem limite. O <b>&omega;</b> representa &ldquo;qualquer quantidade&rdquo;.<br><br>Sem esse símbolo a árvore não terminaria. Com ele — mais a regra de que uma marcação <b>repetida</b> no ramo fecha o nó — a árvore fica <b>finita</b> para qualquer rede.<br><br><b>Para que serve na prática:</b> descobrir se algum recurso está sendo usado além da capacidade, ou se uma fila cresce indefinidamente. Um &omega; no lugar &ldquo;fila&rdquo; é um alerta de modelo — ou de sistema — sem controle de fluxo."
},
{
  id:"rp25", mod:"petri", dif:"facil", tipo:"vf",
  fonte:"Slides · Redes de Petri · modelagem abstrata",
  enunciado:"Os nomes dados aos lugares e às transições (<code>CPU_PARADA</code>, <code>INICIAR</code>, ...) fazem parte das regras de funcionamento da rede: trocá-los pode mudar quais transições disparam.",
  correta:1,
  gabarito:"<b>Falso.</b> As Redes de Petri são um formalismo <b>abstrato</b>: os rótulos não carregam significado nenhum para a rede. Quem determina o comportamento é só a estrutura — lugares, transições, arcos, pesos — e a marcação.<br><br>Os nomes existem para <b>nós</b>, que precisamos ligar o modelo ao sistema real.<br><br><b>A consequência interessante:</b> dois sistemas completamente diferentes — um semáforo de trânsito e um mutex de sistema operacional — podem ter <b>exatamente a mesma rede</b>. Provar uma propriedade num deles prova no outro. É o que permite reconhecer que o mesmo problema reaparece em contextos distintos."
},
{
  id:"rp26", mod:"petri", dif:"medio", tipo:"mc",
  fonte:"Slides · Redes de Petri · redes temporizadas",
  enunciado:"Entre as extensões que acrescentam <b>tempo</b> às Redes de Petri, qual descrição está correta?",
  opcoes:[
    "<b>T-temporizada</b>: tempo nas <b>transições</b>; <b>P-temporizada</b>: nos <b>lugares</b>; <b>estocástica</b>: T-temporizada com tempo aleatório.",
    "Na T-temporizada o tempo fica associado aos lugares, e na P-temporizada, às transições da rede que foi modelada.",
    "As redes temporizadas apenas ordenam os disparos, sem associar valores de tempo a nada.",
    "Só existe uma forma de acrescentar tempo: associar um relógio global à rede inteira."
  ],
  correta:0,
  gabarito:"As letras dizem onde o tempo mora: <b>T</b> de transição, <b>P</b> de <i>place</i> (lugar).<br><br>&bull; <b>T-temporizada</b> — ao disparar, as marcas saem dos lugares de entrada e ficam &ldquo;dentro&rdquo; da transição pelo tempo de disparo; só depois aparecem nas saídas. Com tempo zero, volta a ser a rede comum.<br>&bull; <b>P-temporizada</b> — a marca que chega a um lugar fica <b>indisponível</b> durante um tempo, e só marcas disponíveis habilitam transições.<br>&bull; <b>Estocástica</b> — T-temporizada com o tempo sorteado, em geral por uma exponencial. É a base para análise de desempenho.<br>&bull; <b>Temporal</b> (Merlin) — em vez de um valor, um <b>intervalo</b> [t<sub>mín</sub>, t<sub>máx</sub>] entre habilitar e disparar.<br><br>Nas redes comuns não existe medida de tempo: só a <b>ordenação parcial</b> dos eventos."
},
{
  id:"rp27", mod:"petri", dif:"medio", tipo:"vf",
  fonte:"Slides · Redes de Petri · disparo",
  enunciado:"Numa Rede de Petri comum, o disparo remove uma marca de cada lugar de entrada e acrescenta uma a cada lugar de saída — logo, o número total de marcas da rede se mantém constante.",
  correta:1,
  gabarito:"<b>Falso.</b> A primeira parte está certa, a conclusão não. O total só se conserva quando a transição tem o <b>mesmo número</b> de arcos de entrada e de saída.<br><br>&bull; Transição com <b>2 entradas e 1 saída</b> &rarr; a rede <b>perde</b> uma marca a cada disparo. É o caso do &ldquo;pegar os dois garfos&rdquo;: duas condições são consumidas para produzir uma.<br>&bull; Transição com <b>1 entrada e 2 saídas</b> &rarr; a rede <b>ganha</b> uma marca. Serve para modelar a criação de tarefas paralelas — o <i>fork</i>.<br><br>Redes em que <b>toda</b> transição equilibra entradas e saídas são chamadas <b>conservativas</b>, e aí sim o total é constante.<br><br>É justamente essa liberdade que permite modelar sincronização (juntar condições) e paralelismo (dividir em vários fluxos)."
}


]);
