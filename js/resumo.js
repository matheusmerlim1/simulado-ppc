/* ═══════════════════════════════════════════════════════════
   Consulta rápida — fichas de fórmulas e definições.
   Formato: { t: título, corpo: [ [termo, definição em HTML], ... ] }
   ═══════════════════════════════════════════════════════════ */
const RESUMO = [
{
  t:"Exclusão mútua — o trio", corpo:[
  ["Região crítica","Trecho de código que acessa recurso compartilhado onde o acesso simultâneo corrompe o resultado."],
  ["Condição de corrida","O resultado depende da ordem de intercalação das instruções pelo escalonador."],
  ["Exclusão mútua","Garantia de que no máximo um fluxo esteja na região crítica por vez."],
  ["Relação","Corrida = problema · Região crítica = onde · Exclusão mútua = solução."]
]},
{
  t:"Primitivas de sincronização", corpo:[
  ["Semáforo","<code>wait/P</code> decrementa e bloqueia se ficar negativo; <code>signal/V</code> incrementa e acorda um. Sem dono. Serve para exclusão mútua (=1), contagem (=N) e ordem (=0)."],
  ["Mutex","Trava binária <b>com dono</b>: só quem travou destrava. <code>lock</code>/<code>unlock</code>/<code>trylock</code>. Só para exclusão mútua."],
  ["Monitor","Construção de <b>linguagem</b>: exclusão mútua implícita + variáveis de condição (<code>wait</code> libera o monitor e bloqueia; <code>signal</code> acorda)."],
  ["Regra de ouro","Nunca bloqueie num semáforo de condição segurando o mutex de exclusão — é deadlock certo."]
]},
{
  t:"Padrões de projeto concorrente", corpo:[
  ["Fork/Join","Divide o trabalho em N fluxos e espera todos terminarem. Combina com redução."],
  ["Travar &amp; Destravar","Adquire trava antes e libera depois da região crítica."],
  ["Dormir e acordar","Bloqueia em vez de espera ocupada. Risco: <b>sinal perdido</b>."],
  ["Despachante-operário","Pool de threads reutilizadas consumindo de uma fila de tarefas."],
  ["Pipeline","Estágios sequenciais, um por thread. Vazão ditada pelo <b>estágio mais lento</b>."],
  ["Barreiras","Ninguém passa até que todos cheguem. Separa fases dependentes."]
]},
{
  t:"Deadlock — 4 condições de Coffman", corpo:[
  ["1. Exclusão mútua","Recurso é exclusivo. <b>Ataque:</b> spooling (raramente viável)."],
  ["2. Posse e espera","Segura um e pede outro. <b>Ataque:</b> requisitar tudo de uma vez."],
  ["3. Não-preempção","Não se toma o recurso à força. <b>Ataque:</b> preempção com checkpoint/rollback."],
  ["4. Espera circular","Cadeia P1&rarr;P2&rarr;P1. <b>Ataque:</b> ordenação global de recursos &mdash; o mais prático."],
  ["Estratégias","<b>Prevenção</b> (quebra uma condição) · <b>Evitação</b> (Banqueiro) · <b>Detecção + recuperação</b> · <b>Avestruz</b> (ignora)."],
  ["Livre de deadlock","Com p processos pedindo até m recursos de um total t: <b>p(m&minus;1) + 1 &le; t</b>."]
]},
{
  t:"Algoritmos de deadlock", corpo:[
  ["Detecção (matricial)","Ache um processo com linha de <b>R &le; A</b>; execute-o e devolva sua linha de <b>C</b> a <b>A</b>. Repita. Se sobrar processo, os que sobraram estão em deadlock."],
  ["Banqueiro (evitação)","(1) valide o pedido; (2) simule a concessão; (3) procure sequência segura — quem tem <code>máximo &minus; posse &le; livres</code> executa e devolve tudo. Sem sequência = inseguro = <b>nega</b>."],
  ["Consistência","Para cada recurso: soma da coluna de C + disponível = existente (E)."],
  ["Inseguro &ne; deadlock","Inseguro é a perda da <i>garantia</i>, não a certeza do travamento."]
]},
{
  t:"Redes de Petri", corpo:[
  ["Elementos","Lugares (condições/recursos), transições (eventos), arcos com peso, fichas."],
  ["Marcação","Distribuição das fichas = estado do sistema."],
  ["Habilitação","<b>Todos</b> os lugares de entrada precisam de fichas &ge; peso do arco. Disparo é <b>atômico</b>."],
  ["Deadlock","<b>Marcação morta</b> alcançável na árvore de alcançabilidade: nenhuma transição habilitada."],
  ["Viva / Segura","<b>Viva</b>: nenhuma transição morre &rArr; sem deadlock. <b>Segura</b>: nenhum lugar passa de 1 ficha."],
  ["Exclusão mútua","Um lugar &lsquo;mutex&rsquo; com 1 ficha, entrada das transições de entrada e saída das de saída."]
]},
{
  t:"Taxonomia de Flynn", corpo:[
  ["SISD","Uma instrução, um dado. Von Neumann clássico. Determinístico."],
  ["SIMD","Uma unidade de controle, várias ULAs. Síncrono e determinístico. GPUs, vetoriais."],
  ["MISD","Várias instruções sobre o mesmo dado. Raro. Ex.: vários algoritmos de criptografia."],
  ["MIMD","Instruções e dados diferentes. Multicore, clusters, supercomputadores."],
  ["MIMD &mdash; memória","<b>Compartilhada</b>: acesso comum, comunica por estruturas (pthreads, OpenMP). <b>Distribuída</b>: memória privada, comunica por mensagens (MPI)."]
]},
{
  t:"Desempenho — fórmulas", corpo:[
  ["Speedup","<span class='formula'>S = T_serial / T_paralelo</span>"],
  ["Eficiência","<span class='formula'>E = S / p = T_serial / (p × T_paralelo)</span>"],
  ["Amdahl (problema fixo)","<span class='formula'>S(p) = 1 / [ (1−P) + P/p ]   →   S_max = 1/(1−P)</span>"],
  ["Gustafson (tempo fixo)","<span class='formula'>S(p) = p − α(p−1),  α = fração serial</span>"],
  ["Balanceamento","<span class='formula'>fator = tempo_médio / tempo_máximo   (1 = perfeito)</span> Tempo total do programa = tempo da <b>thread mais lenta</b>."],
  ["Escalabilidade","<b>Forte</b>: E constante com p&uarr; e problema fixo. <b>Fraca</b>: E constante com p&uarr; e problema crescendo junto."],
  ["Partição por blocos","<span class='formula'>my_min = n × (MAX/p) ;  my_max = (n+1) × (MAX/p)</span> O último nó absorve o resto."],
  ["Soma em árvore","<b>log₂(p)</b> etapas contra p&minus;1 da acumulação sequencial. <code>divisor</code> começa em 2 e dobra; <code>core_difference</code> começa em 1 e dobra."]
]},
{
  t:"OpenMP — o essencial", corpo:[
  ["Compilar / medir","<code>gcc prog.c -o prog -fopenmp</code> · tempo com <code>omp_get_wtime()</code>, <b>nunca</b> <code>clock()</code>."],
  ["Threads","<code>num_threads(n)</code> &gt; <code>omp_set_num_threads()</code> &gt; <code>OMP_NUM_THREADS</code> &gt; nº de núcleos."],
  ["Escopo","<code>shared</code> (padrão) · <code>private</code> (não inicializada!) · <code>firstprivate</code> (inicializada). O índice do <code>for</code> já é privado."],
  ["Redução","<code>reduction(+:soma)</code> — cópia privada por thread + combinação final. Sempre preferível a <code>critical</code> em acumuladores."],
  ["Exclusão mútua","<code>atomic</code> para uma operação simples de memória; <code>critical</code> para blocos (dê nome às regiões distintas!)."],
  ["Escalonamento","<code>static</code> para carga uniforme · <code>dynamic</code> para carga irregular · <code>guided</code> meio-termo."],
  ["Sincronização","Barreira implícita no fim de <code>for</code>/<code>single</code>/<code>sections</code>; <code>nowait</code> a remove; <code>barrier</code> a força."],
  ["Tarefas","<code>sections</code> = paralelismo de tarefas (bom para pipeline); <code>for</code> = paralelismo de dados."]
]}
];
