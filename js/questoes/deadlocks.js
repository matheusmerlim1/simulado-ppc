/* ─── Deadlocks ─────────────────────────────────────────────
   P1 · 38 questões
   ─────────────────────────────────────────────────────────── */
registrar([

{
  id:"dl01a", mod:"deadlocks", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 4",
  enunciado:"Explique a condição de <b>exclusão mútua</b>. Ela pode ser atacada para prevenir deadlocks? Como?",
  chaves:[
    ["recurso atribuído a um único processo","um processo","um por vez","exclusiv","não pode ser usado por dois"],
    ["ou está disponível","disponível","livre"],
    ["é a menos atacável","menos atacável","dificilmente","em geral não","quase nunca"],
    ["spooling","spooling","spool","daemon","fila de impressão","enfileira"],
    ["exemplo da impressora","impressora"]
  ],
  gabarito:"<b>A condição:</b> cada recurso está ou atribuído a exatamente um processo, ou disponível. Não pode ser usado por dois ao mesmo tempo.<br><br><b>Pode ser atacada?</b> Só em alguns casos, e é a <b>menos atacável</b> das quatro.<br><br><b>Como:</b> por <b>spooling</b> — em vez de dar o recurso ao processo, um daemon monopoliza o dispositivo e enfileira os pedidos. O caso clássico é a impressora: nenhum processo trava a impressora, todos escrevem na fila.<br><br><b>Limite:</b> não funciona para recursos intrinsecamente exclusivos, como uma entrada de tabela ou um registro de banco de dados."
},
{
  id:"dl01b", mod:"deadlocks", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 4",
  enunciado:"Explique a condição de <b>posse e espera</b>. Ela pode ser atacada? Como?",
  chaves:[
    ["já detém recursos","já detém","já tem","já possui","segura","posse"],
    ["e requisita novos","requisita","pede novos","solicita","espera por outro"],
    ["sem soltar o que já tem","sem soltar","sem liberar","não libera","mantém"],
    ["pedir todos os recursos de uma vez","todos de uma vez","todos no início","de uma só vez","atomicamente","tudo de uma vez","todos os recursos"],
    ["ou liberar tudo antes de pedir mais","liberar tudo","soltar tudo","libera tudo"],
    ["custo: baixa utilização e starvation","baixa utilização","utilização","desperdíci","starvation","inanição"]
  ],
  gabarito:"<b>A condição:</b> um processo que já detém recursos pode requisitar novos e ficar bloqueado esperando por eles, <b>sem soltar</b> o que já tem.<br><br><b>Pode ser atacada? Sim</b> — é uma das duas estratégias práticas.<br><br><b>Como:</b> exigir que o processo requisite <b>todos os recursos de uma vez</b>, no início; se algum não estiver disponível, ele não recebe nenhum e espera. Alternativa: obrigá-lo a <b>liberar tudo</b> antes de pedir um novo conjunto.<br><br><b>Custos:</b> nem sempre se sabe de antemão o que será preciso; há baixa utilização (recursos ficam reservados sem uso); e há risco de <i>starvation</i> para processos que precisam de muitos recursos.<br><br><i>É o que faz a solução do Jantar dos Filósofos que pega os dois garfos atomicamente.</i>"
},
{
  id:"dl01c", mod:"deadlocks", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 4",
  enunciado:"Explique a condição de <b>não-preempção</b>. Ela pode ser atacada? Como?",
  chaves:[
    ["recurso não pode ser tomado à força","não pode ser tomado","não pode ser retirado","à força","não preempt","sem preempção"],
    ["só o dono libera, voluntariamente","voluntariamente","voluntári","quem detém","o próprio processo"],
    ["atacar seria tomar o recurso à força","tomar à força","preempção","retirar","tomar o recurso","preemptar"],
    ["checkpoint e rollback","checkpoint","salvar o estado","rollback","restaurar"],
    ["só serve para CPU e memória","cpu","memória"],
    ["senão o sistema fica inconsistente","inconsistent","impressora","no meio","não dá"]
  ],
  gabarito:"<b>A condição:</b> um recurso já concedido não pode ser tomado à força; apenas o processo que o detém pode liberá-lo, voluntariamente.<br><br><b>Pode ser atacada?</b> Em geral não — é a segunda menos atacável.<br><br><b>Como, quando dá:</b> permitir que o sistema <b>tome o recurso à força</b>, salvando e restaurando o estado depois (<i>checkpoint</i> e <i>rollback</i>). Só é viável para recursos cujo estado pode ser salvo: CPU e memória, por exemplo.<br><br><b>Limite:</b> tirar uma impressora no meio de uma impressão, ou um mutex no meio de uma região crítica, deixa o sistema inconsistente."
},
{
  id:"dl01d", mod:"deadlocks", dif:"facil", tipo:"disc",
  fonte:"Prova Teórica · Questão 4",
  enunciado:"Explique a condição de <b>espera circular</b>. Ela pode ser atacada? Como?",
  chaves:[
    ["cadeia circular de processos","cadeia circular","circular","ciclo","cadeia"],
    ["cada um espera o recurso do próximo","espera por um recurso","detido pelo próximo","segurado pelo próximo","p1","espera o próximo"],
    ["é a mais prática de atacar","mais prática","mais fácil","a preferida","sim"],
    ["ordenação global / numeração dos recursos","ordenação","numeração","numerar","ordem global","numerados"],
    ["requisitar em ordem crescente","ordem crescente","mesma ordem","ordem numérica","sempre na mesma ordem"]
  ],
  gabarito:"<b>A condição:</b> existe uma cadeia circular de dois ou mais processos, cada um esperando por um recurso detido pelo próximo da cadeia (P1 &rarr; P2 &rarr; ... &rarr; P1).<br><br><b>Pode ser atacada? Sim — é a mais prática de todas.</b><br><br><b>Como:</b> impor uma <b>ordenação global (numeração) dos recursos</b> e exigir que todo processo os requisite em ordem numérica crescente.<br><br><b>Por que funciona:</b> para fechar um ciclo, algum processo teria de estar segurando o recurso <i>j</i> e pedindo o recurso <i>i</i> com <i>i &lt; j</i> — exatamente o que a regra proíbe.<br><br><i>É a solução para travar múltiplos mutexes sempre na mesma ordem, e para o Jantar dos Filósofos com garfos numerados (o &ldquo;filósofo canhoto&rdquo;).</i>"
},
{
  id:"dl01e", mod:"deadlocks", dif:"medio", tipo:"disc",
  fonte:"Prova Teórica · Questão 4",
  enunciado:"Das quatro condições, quais são as mais práticas de atacar na vida real, e por quê?",
  chaves:[
    ["espera circular"],
    ["posse e espera","posse e espera","posse-e-espera"],
    ["numerar recursos e pedir em ordem","numer","ordenação","ordem crescente","mesma ordem"],
    ["exclusão mútua não compensa","exclusão mútua"],
    ["não-preempção não compensa","não-preempção","nao preempcao","preempção"],
    ["por quê: spooling limitado, salvar estado inviável","spooling","salvar","inviável","razão de ser","custo alto"]
  ],
  gabarito:"Na prática só duas são atacáveis com custo aceitável:<br><br><b>1. Espera circular</b> — a preferida. Basta numerar os recursos e sempre pedi-los em ordem crescente. Não exige saber a demanda futura, não desperdiça recursos e o custo é só disciplina de programação.<br><br><b>2. Posse e espera</b> — viável quando dá para saber tudo de que se precisa antecipadamente. Custa utilização baixa dos recursos.<br><br><b>Por que as outras duas não:</b> a <b>exclusão mútua</b> é a razão de ser da maioria dos recursos (só dá para atacá-la com spooling, em casos específicos); e a <b>não-preempção</b> exigiria salvar e restaurar estado, o que é inviável para a maioria dos recursos.<br><br><b>Vale lembrar</b> que prevenir não é a única saída: existem ainda a <b>evitação</b> (Banqueiro), a <b>detecção e recuperação</b>, e o <b>algoritmo do avestruz</b> — ignorar o problema, que é o que UNIX e Windows fazem."
},
{
  id:"dl02", mod:"deadlocks", dif:"facil", tipo:"mc",
  fonte:"Prova Teórica · Questão 4",
  enunciado:"Quais são as quatro condições necessárias para a ocorrência de um deadlock?",
  opcoes:[
    "Exclusão mútua, posse e espera, não-preempção e espera circular.",
    "Exclusão mútua, starvation, preempção e prioridade fixa.",
    "Condição de corrida, região crítica, espera ocupada e inversão de prioridade.",
    "Espera circular, escalonamento FIFO, memória compartilhada e múltiplos núcleos."
  ],
  correta:0,
  gabarito:"São as condições de <b>Coffman</b>, e são <b>necessárias e conjuntas</b>: basta quebrar uma delas para que o deadlock se torne impossível. Esse é justamente o princípio das estratégias de prevenção."
},
{
  id:"dl03", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Prova Teórica · Questão 4",
  enunciado:"Qual estratégia ataca a condição de <b>espera circular</b>?",
  opcoes:[
    "Numerar globalmente os recursos e exigir que todo processo os requisite em ordem crescente.",
    "Fazer o processo requisitar todos os recursos de que precisa de uma só vez, logo no início da execução.",
    "Permitir que o sistema tome recursos à força dos processos que estão bloqueados.",
    "Usar spooling para que um daemon monopolize o dispositivo disputado pelos processos."
  ],
  correta:0,
  gabarito:"A ordenação global torna o ciclo impossível: para fechar um ciclo, algum processo teria de estar segurando o recurso <i>j</i> e pedindo o recurso <i>i</i> com <i>i &lt; j</i>, o que a regra proíbe. As outras alternativas atacam, respectivamente, <b>posse e espera</b>, <b>não-preempção</b> e <b>exclusão mútua</b>."
},
{
  id:"dl04", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Qual a diferença entre <b>prevenção</b> e <b>evitação</b> (<i>avoidance</i>) de deadlocks?",
  opcoes:[
    "A prevenção muda as regras de requisição para que uma das 4 condições nunca valha; a evitação decide a cada pedido se o estado segue seguro.",
    "A prevenção acontece em tempo de compilação e a evitação, em tempo de ligação do programa final.",
    "A prevenção detecta o deadlock depois dele acontecer e a evitação o desfaz com um rollback.",
    "São sinônimos: as duas usam o algoritmo do Banqueiro para decidir cada pedido de recurso."
  ],
  correta:0,
  gabarito:"<b>Prevenção</b> é estrutural e estática: ordenar recursos, exigir alocação total antecipada. <b>Evitação</b> é dinâmica: o sistema conhece de antemão a demanda máxima de cada processo e, a cada requisição, simula a concessão — se o estado resultante for <b>inseguro</b>, o pedido é negado (o processo espera). O <b>algoritmo do Banqueiro</b> é o exemplo canônico de evitação. A terceira alternativa descreve <b>detecção e recuperação</b>."
},
{
  id:"dl05", mod:"deadlocks", dif:"dificil", tipo:"mc",
  fonte:"Prova Teórica · Questão 5",
  enunciado:"Considere o estado de sistema com três processos (P1, P2, P3) e quatro tipos de recursos. <b>E</b> é o vetor de recursos existentes, <b>A</b> o de disponíveis, <b>C</b> a matriz de alocação corrente e <b>R</b> a matriz de requisições. O sistema está em deadlock? Aplique o algoritmo de detecção.",
  tabela:"<div class='tabela-wrap'><table class='dados'><tr><th></th><th colspan='4'>C &mdash; alocação corrente</th><th style='border:0;width:18px'></th><th colspan='4'>R &mdash; requisições</th></tr><tr><th></th><th>RS1</th><th>RS2</th><th>RS3</th><th>RS4</th><th style='border:0'></th><th>RS1</th><th>RS2</th><th>RS3</th><th>RS4</th></tr><tr><th>P1</th><td>1</td><td>0</td><td>1</td><td>0</td><td style='border:0'></td><td>1</td><td>0</td><td>0</td><td>0</td></tr><tr><th>P2</th><td>1</td><td>0</td><td>1</td><td>0</td><td style='border:0'></td><td>1</td><td>1</td><td>0</td><td>1</td></tr><tr><th>P3</th><td>0</td><td>1</td><td>0</td><td>1</td><td style='border:0'></td><td>0</td><td>1</td><td>2</td><td>0</td></tr></table></div><p style='margin-top:12px;font-family:var(--f-mono);font-size:13px'>E = (2&nbsp; 4&nbsp; 4&nbsp; 1)&nbsp;&nbsp;&nbsp;&nbsp;A = (0&nbsp; 3&nbsp; 2&nbsp; 0)</p>",
  opcoes:[
    "Sim. Só P3 pode executar; depois dele A = (0 4 2 1) e nem P1 nem P2 cabem — os dois estão em deadlock.",
    "Não. A sequência segura P3, P1, P2 conclui todos os processos, um após o outro.",
    "Sim, os três processos estão em deadlock desde o início: nenhum pedido pode ser atendido pelo sistema agora.",
    "Não é possível determinar sem conhecer a ordem de chegada dos processos ao sistema."
  ],
  correta:0,
  gabarito:"<b>Passo a passo do algoritmo de detecção</b> (procura um processo cuja linha de R seja &le; A, executa-o e devolve seus recursos):<br><br><b>Rodada 1</b>, com A = (0 3 2 0):<br>&bull; P1 pede (1 0 0 0) &rarr; precisa de 1 de RS1, só há 0. <b>Não pode.</b><br>&bull; P2 pede (1 1 0 1) &rarr; precisa de 1 de RS1, só há 0. <b>Não pode.</b><br>&bull; P3 pede (0 1 2 0) &rarr; 0&le;0, 1&le;3, 2&le;2, 0&le;0. <b>Pode executar!</b><br><br>P3 termina e devolve sua linha de C = (0 1 0 1). Agora <b>A = (0 4 2 1)</b>.<br><br><b>Rodada 2</b>:<br>&bull; P1 pede (1 0 0 0) &rarr; RS1 continua em 0. <b>Não pode.</b><br>&bull; P2 pede (1 1 0 1) &rarr; RS1 continua em 0. <b>Não pode.</b><br><br>Nenhum processo restante pode avançar e nenhum vai liberar nada. <b>P1 e P2 estão em deadlock</b> — os dois esperam por RS1, cujas 2 unidades existentes estão travadas justamente com eles.<br><br><i>Confira a consistência dos dados: a soma de cada coluna de C mais A deve dar E. RS1: 1+1+0+0 = 2 &check;</i>"
},
{
  id:"dl06", mod:"deadlocks", dif:"dificil", tipo:"mc",
  fonte:"Prova Teórica · Questão 6",
  enunciado:"Considere o estado de alocação abaixo, com 2 recursos livres. Suponha que o processo <b>B solicite 1 recurso</b>. Pelo <b>Algoritmo do Banqueiro</b>, o sistema irá ou não atender esse pedido?",
  tabela:"<div class='tabela-wrap'><table class='dados'><tr><th>Processo</th><th>Utilizado</th><th>Máximo</th><th>Ainda precisa</th></tr><tr><th>A</th><td>2</td><td>6</td><td>4</td></tr><tr><th>B</th><td>1</td><td>6</td><td>5</td></tr><tr><th>C</th><td>1</td><td>5</td><td>4</td></tr><tr><th>D</th><td>2</td><td>4</td><td>2</td></tr></table></div><p style='margin-top:12px;font-family:var(--f-mono);font-size:13px'>Recursos livres: 2</p>",
  opcoes:[
    "<b>Não.</b> Conceder deixaria apenas 1 livre e ninguém completaria o máximo: o estado fica inseguro, então B espera.",
    "<b>Sim.</b> Com 2 livres há folga suficiente; a sequência segura A, B, C, D continua existindo.",
    "<b>Sim</b>, porque B ainda está longe do seu máximo de 6 recursos no total.",
    "<b>Não</b>, porque o estado atual já era inseguro, mesmo antes desse pedido."
  ],
  correta:0,
  gabarito:"<b>1) O estado atual é seguro?</b> Livres = 2. Falta: A=4, B=5, C=4, <b>D=2</b>.<br>D precisa de 2 e há 2 &rarr; D executa e devolve os 4 que passou a ter. Livres = <b>4</b>.<br>A precisa de 4 e há 4 &rarr; A executa e devolve 6. Livres = <b>6</b>.<br>B precisa de 5 e há 6 &rarr; B executa e devolve 6. Livres = <b>7</b>.<br>C precisa de 4 e há 7 &rarr; C executa. <b>Sequência segura: D, A, B, C.</b> O estado atual <b>é seguro</b>.<br><br><b>2) E se B receber 1 recurso?</b> B passa a ter 2 e ainda precisa de 4; livres caem para <b>1</b>.<br>&bull; A precisa de 4 &gt; 1 &#10007;<br>&bull; B precisa de 4 &gt; 1 &#10007;<br>&bull; C precisa de 4 &gt; 1 &#10007;<br>&bull; D precisa de 2 &gt; 1 &#10007;<br>Nenhum processo consegue completar. Não existe sequência segura &rarr; o estado seria <b>inseguro</b>.<br><br><b>Conclusão:</b> o Banqueiro <b>nega o pedido</b>. B fica bloqueado esperando, mesmo havendo um recurso livre. Lembre-se: estado inseguro não é sinônimo de deadlock — é um estado a partir do qual o sistema <i>não pode mais garantir</i> que evitará o deadlock. O Banqueiro é conservador de propósito."
},
{
  id:"dl07", mod:"deadlocks", dif:"medio", tipo:"vf",
  fonte:"Slides · Deadlocks",
  enunciado:"Todo estado inseguro leva necessariamente a um deadlock.",
  correta:1,
  gabarito:"<b>Falso.</b> Um estado <b>inseguro</b> é aquele em que <i>não existe garantia</i> de sequência segura — mas os processos podem, na prática, não requisitar seus máximos, e tudo terminar bem. O deadlock é uma <i>possibilidade</i>, não uma certeza. A recíproca vale: todo estado de deadlock é inseguro. É justamente por isso que o algoritmo do Banqueiro é criticado por ser conservador demais e desperdiçar recursos."
},
{
  id:"dl08", mod:"deadlocks", dif:"dificil", tipo:"mc",
  fonte:"Lab · Deadlocks, Q2",
  enunciado:"Dois processos, A e B, precisam cada um das três entradas 1, 2 e 3 de uma base de dados. A sempre as requisita na ordem <b>1, 2, 3</b>. Das 3! = 6 ordens possíveis para B, quais estão <b>livres de deadlock</b>?",
  opcoes:[
    "Duas: <b>1,2,3</b> e <b>1,3,2</b> — as ordens em que B também pede o recurso 1 primeiro.",
    "Apenas uma: <b>1,2,3</b>, idêntica à ordem usada por A nos três pedidos.",
    "Três: <b>1,2,3</b>, <b>1,3,2</b> e <b>2,1,3</b>, por começarem com 1 ou com 2.",
    "Todas as seis: com apenas dois processos não há espera circular possível entre eles."
  ],
  correta:0,
  gabarito:"O deadlock exige que A segure X e queira Y enquanto B segura Y e quer X. Verificando cada ordem de B:<br>&bull; <b>1,2,3</b> &check; &mdash; ambos pedem 1 primeiro; quem pegar 1 segue até o fim, o outro espera. Sem ciclo.<br>&bull; <b>1,3,2</b> &check; &mdash; mesmo argumento: o recurso 1 funciona como um portão de entrada.<br>&bull; <b>2,1,3</b> &#10007; &mdash; A pega 1, B pega 2; A quer 2, B quer 1. <b>Deadlock.</b><br>&bull; <b>2,3,1</b> &#10007; &mdash; A pega 1, B pega 2 e 3; A quer 2, B quer 1. <b>Deadlock.</b><br>&bull; <b>3,1,2</b> &#10007; &mdash; A pega 1 e 2, B pega 3; A quer 3, B quer 1. <b>Deadlock.</b><br>&bull; <b>3,2,1</b> &#10007; &mdash; A pega 1 e 2, B pega 3; A quer 3, B quer 2. <b>Deadlock.</b><br><br><b>Resposta: 2 das 6.</b> A moral do exercício é justamente a prevenção por <b>ordenação de recursos</b>: se ambos começam pelo recurso de menor índice, a espera circular fica impossível — não importa a ordem dos demais."
},
{
  id:"dl09", mod:"deadlocks", dif:"dificil", tipo:"mc",
  fonte:"Lab · Deadlocks, Q3",
  enunciado:"Num sistema com <b>p</b> processos, em que cada um pode requisitar no máximo <b>m</b> recursos de um total de <b>t</b> existentes, qual é a condição necessária para que o sistema seja <b>sempre</b> livre de deadlocks?",
  opcoes:[
    "<code>p &times; (m &minus; 1) + 1 &le; t</code> — cada processo pode ficar a um recurso do seu máximo.",
    "<code>p &times; m &le; t</code> — há recursos para todos atingirem o máximo ao mesmo tempo.",
    "<code>m &le; t / p</code> — cada processo recebe uma fatia igual dos recursos existentes no sistema.",
    "<code>p + m &le; t</code> — sobram recursos depois de contar processos e pedidos."
  ],
  correta:0,
  gabarito:"Considere o <b>pior caso</b>: cada um dos <i>p</i> processos já conseguiu <i>m</i>&minus;1 recursos e falta exatamente 1 para cada um terminar. Isso consome <i>p</i>(<i>m</i>&minus;1) recursos. Se ainda sobrar <b>pelo menos 1</b> recurso, algum processo consegue completar, termina, devolve seus <i>m</i> recursos e destrava a fila em cascata. Logo a condição é <b>p(m&minus;1) + 1 &le; t</b>.<br><br><i>Exemplo:</i> 3 processos precisando de até 2 recursos cada exigem t &ge; 3&times;1+1 = <b>4</b> recursos para nunca travar. Com t = 3 (que é o caso do Jantar dos Filósofos com 3 filósofos e 3 garfos!) o deadlock é possível — e é exatamente o que acontece quando os três pegam o garfo da esquerda ao mesmo tempo.<br><br>A alternativa <code>p&times;m &le; t</code> também evita deadlock, mas é <b>suficiente e desnecessariamente forte</b>: reservar o máximo para todos ao mesmo tempo desperdiça recursos."
},
{
  id:"dl10", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Por que a solução ingênua do <b>Jantar dos Filósofos</b> — cada filósofo pega primeiro o garfo da esquerda e depois o da direita — pode travar?",
  opcoes:[
    "Se todos pegarem o garfo da esquerda ao mesmo tempo, cada um segura um e espera o da direita, com o vizinho.",
    "Porque dois filósofos podem pegar o mesmo garfo simultaneamente, corrompendo o estado compartilhado da mesa inteira.",
    "Porque um filósofo pode comer com um garfo só, deixando os outros sem talher nenhum.",
    "Porque o número de garfos da mesa é sempre menor que o de filósofos sentados."
  ],
  correta:0,
  gabarito:"É o exemplo didático das quatro condições de Coffman ao mesmo tempo: exclusão mútua (um garfo, um filósofo), posse e espera (segura o esquerdo, pede o direito), não-preempção (ninguém arranca garfo da mão do outro) e espera circular (F1&rarr;F2&rarr;F3&rarr;F1). Note que o número de garfos <b>é igual</b> ao de filósofos — dizer que há menos garfos do que filósofos é falso. E não há condição de corrida: cada garfo é devidamente protegido; o problema é a <b>ordem</b> de aquisição."
},
{
  id:"dl11", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks / Lab Redes de Petri",
  enunciado:"Quais destas são soluções corretas para o deadlock do Jantar dos Filósofos, e qual condição de Coffman cada uma ataca?",
  opcoes:[
    "Pegar os dois garfos atomicamente (posse-e-espera); numerá-los e pegar em ordem crescente, ou deixar um canhoto (espera circular).",
    "Aumentar o número de garfos para o dobro do número de filósofos (ataca a exclusão mútua).",
    "Fazer cada filósofo dormir um tempo aleatório antes de pegar o garfo (ataca a não-preempção).",
    "Permitir que um filósofo tome o garfo da mão do vizinho que o segura (ataca a posse-e-espera)."
  ],
  correta:0,
  gabarito:"As três soluções corretas são as vistas em aula e reaparecem no laboratório de Redes de Petri. Sobre dormir um tempo aleatório: isso <b>reduz a probabilidade</b> do deadlock, mas não o elimina — é uma correção falsa, e um erro clássico em prova. Uma quarta solução válida é limitar a <b>4 filósofos</b> à mesa por vez (com 5 lugares), usando um semáforo de contagem — também ataca posse-e-espera. Vale citar ainda que a solução do garfo canhoto é a mais elegante: basta <b>um</b> filósofo com a ordem invertida para quebrar o ciclo."
},
{
  id:"dl12", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Num <b>grafo de alocação de recursos</b>, quando a existência de um ciclo é condição <b>suficiente</b> para afirmar que há deadlock?",
  opcoes:[
    "Quando cada tipo de recurso tem apenas <b>uma</b> instância; com várias, o ciclo é necessário mas não suficiente.",
    "Sempre: qualquer ciclo no grafo de alocação indica um deadlock já formado entre os processos envolvidos nele.",
    "Nunca: o grafo só serve para visualizar, e a detecção exige o algoritmo matricial.",
    "Quando o número de processos é maior que o número de recursos existentes."
  ],
  correta:0,
  gabarito:"Com uma instância por tipo, ciclo &equiv; deadlock. Com <b>múltiplas instâncias</b>, um processo do ciclo pode receber uma instância livre de outro lugar, terminar e quebrar a cadeia — o ciclo existe, mas não há deadlock. Por isso, para recursos com múltiplas instâncias, usa-se o <b>algoritmo matricial de detecção</b> (com E, A, C e R), como na Questão 5 da Prova Teórica."
},
{
  id:"dl13", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"O que é o <b>algoritmo do avestruz</b> (<i>ostrich algorithm</i>)?",
  opcoes:[
    "Ignorar o problema de propósito, supondo deadlocks raros demais para compensar o custo de preveni-los.",
    "Executar o algoritmo de detecção a cada requisição de recurso feita por um processo qualquer do sistema.",
    "Reiniciar automaticamente todos os processos bloqueados depois de um tempo limite.",
    "Requisitar todos os recursos antecipadamente para evitar a posse-e-espera."
  ],
  correta:0,
  gabarito:"UNIX e Windows adotam essa postura para a maioria dos recursos: prevenir custa desempenho e restringe o programador, detectar custa processamento, e deadlocks acontecem raramente em sistemas de uso geral. O usuário reinicia o processo travado e a vida segue. Em sistemas <b>críticos</b> (tempo real, bancos de dados, controle industrial) a história muda, e aí valem a prevenção, a evitação ou a detecção com <i>rollback</i>."
},
{
  id:"dl14", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Quais são as formas de <b>recuperação</b> depois que um deadlock é detectado?",
  opcoes:[
    "Preempção (tomar o recurso por um tempo), <i>rollback</i> a um <i>checkpoint</i> anterior e eliminação de processos do ciclo.",
    "Aumentar dinamicamente o número de recursos do sistema até que o ciclo de espera entre os processos se desfaça sozinho.",
    "Reduzir a prioridade dos processos envolvidos até o escalonador os liberar.",
    "Reiniciar o sistema operacional — é a única forma realmente segura de sair."
  ],
  correta:0,
  gabarito:"As três da alternativa correta. A <b>preempção</b> depende da natureza do recurso e costuma ser feita manualmente. O <b>rollback</b> exige que os processos salvem estado periodicamente (<i>checkpoints</i>), o que é comum em bancos de dados. A <b>eliminação</b> é a mais grosseira: escolhe-se a vítima — de preferência a que causa menos prejuízo, e que possa ser reexecutada do começo sem efeitos colaterais."
},
{
  id:"dl15", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Qual é a diferença entre <b>deadlock</b> e <b>starvation</b>?",
  opcoes:[
    "No deadlock ninguém do conjunto progride; na starvation o sistema progride, mas um processo é sempre preterido.",
    "Deadlock ocorre entre threads e starvation, entre processos do sistema operacional.",
    "Deadlock é permanente e starvation é sempre resolvida pelo escalonador depois.",
    "São o mesmo fenômeno, com nomes diferentes conforme o número de recursos."
  ],
  correta:0,
  gabarito:"A distinção é conceitual e cai em prova: deadlock é uma questão de <b>segurança</b> (nada acontece), starvation é uma questão de <b>justiça</b> (as coisas acontecem, mas não para todos). Resolver deadlock é impedir a espera circular; resolver starvation é garantir justiça — filas FIFO, envelhecimento (<i>aging</i>) de prioridade. É por isso que o Q5 do laboratório de Padrões Concorrentes pede para corrigir a starvation de uma solução do Jantar dos Filósofos <b>que já está livre de deadlock</b>."
},
{
  id:"dl16", mod:"deadlocks", dif:"medio", tipo:"code",
  fonte:"Prova Prática · Questão 3",
  enunciado:"Escreva <b>apenas a função</b> <code>filosofo</code> do Jantar dos Filósofos com 3 filósofos, <b>sem deadlock</b> e sem condição de corrida.",
  cod:"#define N 3\n\npthread_mutex_t garfo[N];    /* 1 mutex por garfo */\n\n/* o filosofo i usa os garfos i (esquerda) e (i+1)%N (direita)\n   o main inicializa os mutexes, cria as 3 threads e da join */",
  chaves:["pthread_mutex_lock","pthread_mutex_unlock","garfo"],
  modelo:"void *filosofo(void *arg) {\n    int id  = *(int *)arg;\n    int esq = id;\n    int dir = (id + 1) % N;\n\n    /* PREVENCAO por ORDENACAO: pega sempre o de MENOR indice primeiro.\n       Isso quebra a espera circular -- o filosofo N-1 fica \"canhoto\".  */\n    int primeiro = (esq < dir) ? esq : dir;\n    int segundo  = (esq < dir) ? dir : esq;\n\n    for (int r = 0; r < 5; r++) {\n        printf(\"Filosofo %d pensando\\n\", id);\n\n        pthread_mutex_lock(&garfo[primeiro]);\n        pthread_mutex_lock(&garfo[segundo]);\n\n        printf(\"Filosofo %d COMENDO\\n\", id);\n\n        pthread_mutex_unlock(&garfo[segundo]);\n        pthread_mutex_unlock(&garfo[primeiro]);\n    }\n    return NULL;\n}",
  gabarito:"<b>Sem condição de corrida:</b> cada garfo é um mutex; ninguém usa um garfo sem tê-lo travado.<br><br><b>Sem deadlock:</b> a solução ataca a <b>espera circular</b> pela ordenação dos garfos. Com N=3, os filósofos 0 e 1 pegam esquerda&rarr;direita, mas o filósofo 2 (garfos 2 e 0) pega o <b>0 primeiro</b> — é o &ldquo;canhoto&rdquo; que quebra o ciclo.<br><br><b>Alternativa igualmente aceita</b> (ataca posse-e-espera): um mutex <code>sala</code> envolvendo a aquisição dos dois garfos, tornando-a atômica.<br><br><b>NÃO é aceito:</b> colocar <code>sleep</code> aleatório antes de pegar o garfo — isso só reduz a probabilidade do deadlock."
},
{
  id:"dl17", mod:"deadlocks", dif:"medio", tipo:"code",
  fonte:"Lab · Deadlocks, Q4",
  enunciado:"No algoritmo do banqueiro, escreva <b>apenas a função</b> <code>estado_seguro</code>, que devolve 1 se existe uma sequência segura e 0 caso contrário.",
  cod:"/* posse[i]  = recursos que o processo i ja tem\n   maximo[i] = recursos que o processo i pode vir a pedir no total\n   n         = quantidade de processos\n   disp      = recursos livres no momento                          */\n\nint estado_seguro(int posse[], int maximo[], int n, int disp);",
  chaves:["posse","maximo","disp","for"],
  modelo:"int estado_seguro(int posse[], int maximo[], int n, int disp) {\n    int terminou[64] = {0};\n    int concluidos = 0;\n\n    while (concluidos < n) {\n        int avancou = 0;\n\n        for (int i = 0; i < n; i++) {\n            int falta = maximo[i] - posse[i];\n\n            if (!terminou[i] && falta <= disp) {\n                disp += posse[i];        /* termina e DEVOLVE tudo */\n                terminou[i] = 1;\n                concluidos++;\n                avancou = 1;\n            }\n        }\n\n        if (!avancou) return 0;          /* ninguem avancou: INSEGURO */\n    }\n    return 1;                            /* todos concluiram: SEGURO */\n}",
  gabarito:"O algoritmo é uma <b>varredura repetida</b>: procure um processo cuja necessidade restante (<code>maximo &minus; posse</code>) caiba nos disponíveis; ao encontrar, some a posse dele aos disponíveis (ele termina e devolve tudo) e marque-o como concluído.<br><br><b>A parada é o que define a resposta:</b> se numa varredura completa <b>ninguém</b> avançou, não existe sequência segura e o estado é inseguro.<br><br>Teste com os dados da Prova Teórica — A(2,6) B(1,6) C(1,5) D(2,4) e 2 livres: devolve 1, com a sequência D, A, B, C. Conceda 1 a B (posse 2, disp 1) e ela passa a devolver 0."
},
{
  id:"dl18", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Quais são as premissas que o <b>algoritmo do Banqueiro</b> exige para funcionar?",
  opcoes:[
    "Cada processo declara antes a necessidade <b>máxima</b> de cada recurso, e os números de processos e de recursos são fixos.",
    "Todos os processos precisam ter a mesma prioridade, e o escalonador deve ser FIFO, sem nenhuma preempção durante a execução.",
    "Cada tipo de recurso deve ter apenas uma instância disponível em todo o sistema.",
    "Todos os recursos envolvidos precisam ser preemptáveis pelo sistema operacional."
  ],
  correta:0,
  gabarito:"A necessidade de declarar a demanda máxima antecipadamente é a maior crítica prática ao Banqueiro: raramente um programa sabe de antemão quanto de cada recurso vai precisar. Somam-se a isso a suposição de número fixo de processos e recursos (na prática processos entram e saem, e dispositivos falham) e o custo de rodar o teste de segurança a cada requisição. Por isso, na prática, quase ninguém o implementa — mas ele cai na prova."
},
{
  id:"dl19", mod:"deadlocks", dif:"facil", tipo:"vf",
  fonte:"Slides · Deadlocks",
  enunciado:"Para haver deadlock, basta que exista espera circular entre os processos.",
  correta:1,
  gabarito:"<b>Falso.</b> As quatro condições de Coffman são <b>necessárias em conjunto</b>. Espera circular sozinha não basta: se os recursos fossem preemptáveis, o sistema simplesmente tomaria um deles e quebraria o ciclo; se não houvesse exclusão mútua, todos usariam o recurso ao mesmo tempo. Além disso, num sistema com múltiplas instâncias por recurso, um ciclo no grafo pode existir sem que haja deadlock."
},
{
  id:"dl20", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Quando faz sentido executar o algoritmo de <b>detecção</b> de deadlocks?",
  opcoes:[
    "É um compromisso: a cada pedido não atendido (caro, mas imediato) ou periodicamente, quando a CPU ociosa sugerir travamento.",
    "Apenas uma vez, durante a inicialização do sistema operacional da máquina.",
    "A cada troca de contexto feita pelo escalonador de processos, sem exceção.",
    "Somente depois que o usuário reportar à equipe que o sistema está travado."
  ],
  correta:0,
  gabarito:"Rodar a cada requisição negada detecta o deadlock no instante em que ele se forma e identifica com precisão os processos envolvidos, mas o custo é alto. Rodar periodicamente (ou disparado por uma queda na utilização de CPU — sintoma típico de processos travados) é bem mais barato, com a desvantagem de que vários ciclos podem já ter se formado, dificultando escolher a vítima da recuperação."
},
{
  id:"dl21", mod:"deadlocks", dif:"facil", tipo:"mc",
  fonte:"Slides · Deadlocks · recursos",
  enunciado:"Os slides separam os recursos em <b>preemptáveis</b> e <b>não-preemptáveis</b>. Qual par está classificado corretamente?",
  opcoes:[
    "Memória é preemptável — vai para o disco e volta sem dano; a impressora no meio de um trabalho não é.",
    "Impressora é preemptável, porque vários processos enviam trabalhos a ela; memória, por ser compartilhada, não é.",
    "Todo recurso de hardware é preemptável; só os de software, como travas, não são.",
    "Processador é não-preemptável, porque um processo nunca perde a CPU antes do fim."
  ],
  correta:0,
  gabarito:"A pergunta é: <b>dá para tirar o recurso do processo sem prejudicá-lo?</b><br><br>&bull; <b>Preemptável</b> — memória (o sistema salva a página em disco e devolve depois) e o próprio processador (a troca de contexto é exatamente isso).<br>&bull; <b>Não-preemptável</b> — impressora no meio de uma impressão, gravador de mídia no meio de uma gravação, um mutex no meio de uma região crítica.<br><br><b>Por que importa:</b> deadlocks com recursos preemptáveis se resolvem tomando o recurso de volta. Os deadlocks que exigem as estratégias da matéria são os que envolvem recursos <b>não-preemptáveis</b> — e é por isso que a condição de não-preempção quase nunca é atacada."
},
{
  id:"dl22", mod:"deadlocks", dif:"facil", tipo:"mc",
  fonte:"Slides · Deadlocks · definição formal",
  enunciado:"Qual é a definição formal de deadlock?",
  opcoes:[
    "Um conjunto está em deadlock se <b>cada</b> processo espera um evento que só <b>outro processo do mesmo conjunto</b> pode causar.",
    "Um processo está em deadlock quando espera por um recurso além de um limite de tempo definido.",
    "Deadlock é quando dois processos disputam a mesma variável e o resultado varia conforme a ordem em que cada execução acontece.",
    "Um conjunto está em deadlock quando todos estão prontos, mas o escalonador não escolhe nenhum."
  ],
  correta:0,
  gabarito:"O ponto central é o <b>fechamento</b>: a espera de cada um só pode ser resolvida por alguém de dentro do grupo — que também está esperando. Normalmente o evento é a <b>liberação de um recurso</b>.<br><br>Consequência, nas palavras dos slides: nenhum processo do conjunto pode <b>executar</b>, <b>liberar recursos</b> ou <b>ser acordado</b>. Por isso o deadlock não se resolve sozinho, por mais que se espere.<br><br><b>Por que não as outras:</b> um limite de tempo de espera só detecta espera longa, não um ciclo; disputar a mesma variável é <b>condição de corrida</b>; e processos prontos que o escalonador não escolhe estão com um problema de <b>escalonamento</b>, não bloqueados."
},
{
  id:"dl23", mod:"deadlocks", dif:"medio", tipo:"vf",
  fonte:"Slides · Deadlocks · uso de recursos",
  enunciado:"Usar um recurso segue sempre a sequência requisitar, usar e liberar. Quando uma requisição não pode ser atendida, a única possibilidade é o sistema <b>bloquear</b> o processo até o recurso ficar livre.",
  correta:1,
  gabarito:"<b>Falso.</b> Os slides dão duas possibilidades: <b>bloquear</b> o processo, ou devolver um <b>código de erro</b> e deixá-lo seguir.<br><br>A segunda muda o problema de lugar: se o processo, ao receber o erro, dorme um pouco e tenta de novo em laço, ele não fica bloqueado — mas pode ficar girando para sempre sem conseguir o recurso. É <b>espera ocupada</b>, e com vários processos fazendo o mesmo em sincronia, <b>livelock</b>.<br><br>É o caso do <code>trylock</code> e de <code>sem_trywait</code>: não bloqueiam, mas deixam a decisão do que fazer com quem chamou."
},
{
  id:"dl24", mod:"deadlocks", dif:"dificil", tipo:"mc",
  fonte:"Slides · Deadlocks · como ocorrem",
  enunciado:"Três processos A, B e C e três recursos R, S e T, cada um com uma única unidade. O escalonador intercala os pedidos na ordem abaixo. Em qual pedido o <b>deadlock se fecha</b>?",
  cod:"1) A requisita R\n2) B requisita S\n3) C requisita T\n4) A requisita S\n5) B requisita T\n6) C requisita R",
  opcoes:[
    "No <b>6</b>. Até o 5, C ainda roda e poderia terminar liberando T; quando C pede R, que está com A, o ciclo se fecha.",
    "No <b>4</b>, porque é o primeiro pedido que não pode ser atendido na hora.",
    "No <b>5</b>, porque a partir dele já há dois processos bloqueados ao mesmo tempo, A esperando por S e B esperando por T.",
    "Em nenhum: com três recursos para três processos, cada um consegue o seu."
  ],
  correta:0,
  gabarito:"No grafo de alocação, cada pedido atendido vira uma aresta <b>recurso &rarr; processo</b> e cada pedido pendente, uma aresta <b>processo &rarr; recurso</b>:<br><br>&bull; 1–3: R&rarr;A, S&rarr;B, T&rarr;C. Todos atendidos.<br>&bull; 4: A&rarr;S. A bloqueia, mas B ainda pode terminar.<br>&bull; 5: B&rarr;T. B bloqueia, mas C ainda pode terminar e soltar T.<br>&bull; 6: C&rarr;R. Agora <b>todos</b> esperam alguém do grupo: ciclo fechado.<br><br><b>Bloquear não é o mesmo que travar</b>: enquanto houver no grupo alguém que progride, a cadeia se desfaz sozinha.<br><br><b>E o sistema podia ter evitado:</b> se o escalonador tivesse adiado B, A e C terminariam — o mesmo conjunto de pedidos, em outra ordem, sem deadlock. É a ideia por trás da alocação segura."
},
{
  id:"dl25", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Detecção com 1 recurso de cada tipo",
  enunciado:"No algoritmo de detecção com <b>um recurso de cada tipo</b>, parte-se de cada nó do grafo, percorrendo arcos ainda não marcados e guardando os nós visitados numa lista L. O que indica que existe deadlock?",
  opcoes:[
    "O nó atual <b>já aparece na lista L</b>: o caminho voltou a um nó por onde já passou — há ciclo.",
    "Um nó sem nenhum arco de saída ainda desmarcado para seguir adiante.",
    "A lista L ficar vazia depois de voltar ao nó inicial da busca.",
    "Um recurso com mais de um arco de entrada no grafo de alocação."
  ],
  correta:0,
  gabarito:"É uma busca em profundidade à procura de <b>ciclo</b>:<br><br>1. Começa com L vazia e todos os arcos desmarcados.<br>2. Insere o nó atual no fim de L.<br>3. Se o nó <b>já estava em L</b>, há ciclo: termina.<br>4. Se há arco de saída desmarcado, marca-o e segue por ele.<br>5. Se não há, é beco sem saída: remove o nó de L e volta ao anterior. Se o beco for o nó inicial, não há ciclo a partir dele.<br><br>O algoritmo é repetido partindo de cada nó do grafo.<br><br><b>Por que só com um recurso de cada tipo:</b> com uma instância por tipo, ciclo equivale a deadlock. Com várias instâncias, o ciclo é necessário mas não suficiente, e é preciso o algoritmo com as matrizes E, A, C e R.<br><br>Um nó sem arcos de saída é apenas o beco sem saída do passo 5, e L vazia ao voltar ao início significa justamente que <b>não</b> se achou ciclo."
},
{
  id:"dl26", mod:"deadlocks", dif:"dificil", tipo:"mc",
  fonte:"Slides · Detecção com múltiplos recursos",
  enunciado:"Aplique o algoritmo de detecção ao estado abaixo, com três processos e quatro tipos de recurso. Existe deadlock?",
  tabela:"<div class='tabela-wrap'><table class='dados'><tr><th></th><th colspan='4'>C &mdash; alocação corrente</th><th style='border:0;width:18px'></th><th colspan='4'>R &mdash; requisições</th></tr><tr><th></th><th>RS1</th><th>RS2</th><th>RS3</th><th>RS4</th><th style='border:0'></th><th>RS1</th><th>RS2</th><th>RS3</th><th>RS4</th></tr><tr><th>P1</th><td>0</td><td>0</td><td>1</td><td>0</td><td style='border:0'></td><td>2</td><td>0</td><td>0</td><td>1</td></tr><tr><th>P2</th><td>2</td><td>0</td><td>0</td><td>1</td><td style='border:0'></td><td>1</td><td>0</td><td>1</td><td>0</td></tr><tr><th>P3</th><td>0</td><td>0</td><td>0</td><td>0</td><td style='border:0'></td><td>0</td><td>0</td><td>0</td><td>0</td></tr></table></div><p style='margin-top:12px;font-family:var(--f-mono);font-size:13px'>E = (4&nbsp; 2&nbsp; 3&nbsp; 1)&nbsp;&nbsp;&nbsp;&nbsp;A = (2&nbsp; 2&nbsp; 2&nbsp; 0)</p>",
  opcoes:[
    "<b>Não.</b> P2 cabe, termina e devolve (2 0 0 1): A vira (4 2 2 1), e então P1 e P3 cabem. Ordem <b>P2, P1, P3</b>.",
    "<b>Sim</b>, P1 está em deadlock, porque pede um RS4 e não há nenhum livre.",
    "<b>Sim</b>, P1 e P2 estão em deadlock, porque os dois pedem RS1 ao mesmo tempo e só há uma unidade disponível.",
    "Não dá para saber sem conhecer a ordem em que os processos chegaram."
  ],
  correta:0,
  gabarito:"<b>Rodada 1</b>, com A = (2 2 2 0):<br>&bull; P1 pede (2 0 0 1): precisa de 1 de RS4, há 0. <b>Não cabe.</b><br>&bull; P2 pede (1 0 1 0): 1&le;2, 0&le;2, 1&le;2, 0&le;0. <b>Cabe.</b> P2 termina e devolve (2 0 0 1).<br><br>A = (4 2 2 1).<br><br><b>Rodada 2:</b> P1 pede (2 0 0 1) &le; (4 2 2 1). <b>Cabe</b>, e devolve (0 0 1 0): A = (4 2 3 1) = E.<br>P3 não pede nada e termina de qualquer forma.<br><br><b>Não há deadlock.</b><br><br>O erro mais comum é parar na primeira rodada. &ldquo;Não dá para atender agora&rdquo; <b>não é</b> deadlock: o RS4 que P1 espera está com P2, que consegue terminar e devolvê-lo.<br><br><i>Confira sempre: A + soma de cada coluna de C = E. RS4: 0 + 0 + 1 + 0 = 1.</i>"
},
{
  id:"dl27", mod:"deadlocks", dif:"dificil", tipo:"mc",
  fonte:"Slides · Estados seguros e inseguros",
  enunciado:"Há 10 recursos de um único tipo. Partindo de um estado seguro, o sistema entregou mais um recurso ao processo A, chegando ao estado abaixo. Esse estado é seguro?",
  tabela:"<div class='tabela-wrap'><table class='dados'><tr><th>Processo</th><th>Tem</th><th>Máximo</th><th>Ainda precisa</th></tr><tr><th>A</th><td>4</td><td>9</td><td>5</td></tr><tr><th>B</th><td>2</td><td>4</td><td>2</td></tr><tr><th>C</th><td>2</td><td>7</td><td>5</td></tr></table></div><p style='margin-top:12px;font-family:var(--f-mono);font-size:13px'>Livres: 2 &nbsp;·&nbsp; total de recursos: 10</p>",
  opcoes:[
    "<b>Não.</b> B termina e devolve 4, mas A e C precisam de 5 cada e só há 4 livres: ninguém mais chega ao máximo.",
    "<b>Sim.</b> B termina e devolve 4; depois A termina, e por fim C encerra.",
    "<b>Sim</b>, porque ainda há 2 livres e nenhum processo está bloqueado agora.",
    "<b>Não</b>, porque o estado já está em deadlock: A pediu além do que havia."
  ],
  correta:0,
  gabarito:"Um estado é <b>seguro</b> se existe <b>alguma</b> ordem em que todos conseguem pedir o máximo e terminar.<br><br>&bull; Precisam: A = 5, B = 2, C = 5. Livres = 2.<br>&bull; Só B cabe. B termina e devolve os 4 que terá: livres = 4.<br>&bull; A precisa de 5, C precisa de 5. Nenhum cabe em 4.<br><br><b>Inseguro.</b> Antes do pedido, com A em 3, havia 3 livres, e a sequência B, C, A funcionava — foi aquele recurso a mais que tirou a garantia.<br><br><b>Inseguro não é deadlock</b>: nada está travado agora, e A pode até devolver recursos sem pedir o máximo. Mas o sistema perdeu a <b>garantia</b> de que todos terminam — e é exatamente isso que o banqueiro se recusa a fazer."
},
{
  id:"dl28", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Alocação segura · trajetória de recursos",
  enunciado:"No gráfico de trajetória de recursos, dois processos A e B usam uma impressora e um plotter. Por que o escalonador não pode deixar a execução entrar na <b>região insegura</b>?",
  opcoes:[
    "Porque ali cada processo já segura um dos recursos e ainda vai pedir o outro: <b>qualquer</b> caminho termina no deadlock.",
    "Porque dentro dela os dois processos usam a impressora ao mesmo tempo, violando a exclusão mútua exigida pelo dispositivo.",
    "Porque a região insegura é onde o processador fica ocioso, desperdiçando tempo.",
    "Porque ali o sistema precisaria de mais recursos do que existem fisicamente."
  ],
  correta:0,
  gabarito:"O gráfico põe o progresso de A num eixo e o de B no outro. As áreas em que os dois usariam a mesma impressora (ou o mesmo plotter) ao mesmo tempo são <b>proibidas</b> — a exclusão mútua impede entrar nelas.<br><br>A <b>região insegura</b> é o canto delimitado por essas áreas: A já tem a impressora e B já tem o plotter, e cada um ainda vai precisar do recurso do outro. Dali, qualquer avanço bate numa área proibida. O deadlock é <b>inevitável</b>.<br><br><b>A decisão certa</b> é tomada antes de entrar: quando B pede a impressora no ponto crítico, o sistema a nega e suspende B até A liberar os dois recursos. É a lógica da <b>alocação segura</b> — e o banqueiro é a versão algorítmica dela.<br><br>Dois processos usando a impressora ao mesmo tempo descreve as <b>áreas proibidas</b>, e não a região insegura."
},
{
  id:"dl29", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Banqueiro para 1 recurso",
  enunciado:"Pelo banqueiro com um tipo de recurso, qual destes estados é <b>inseguro</b>? (em cada processo: tem / máximo)",
  cod:"(a) A 0/6   B 0/5   C 0/4   D 0/7    livres: 10\n(b) A 1/6   B 1/5   C 2/4   D 4/7    livres: 2\n(c) A 1/6   B 2/5   C 2/4   D 4/7    livres: 1",
  opcoes:[
    "Só o <b>(c)</b>: com 1 livre, ninguém consegue completar o máximo — C precisaria de 2, B de 3, D de 3 e A de 5.",
    "O <b>(b)</b>, porque com apenas 2 livres nenhum processo consegue terminar.",
    "O <b>(a)</b>, porque a soma dos máximos (22) é maior que o total de recursos (10).",
    "Os três são seguros, porque nenhum processo pediu mais do que o seu máximo."
  ],
  correta:0,
  gabarito:"&bull; <b>(a) Seguro.</b> Ninguém tem nada e há 10 livres: qualquer processo, sozinho, consegue seu máximo. A soma dos máximos passar do total <b>não</b> é problema — os processos não precisam do máximo ao mesmo tempo.<br>&bull; <b>(b) Seguro.</b> C precisa de 2 e há 2: C termina e devolve 4, livres = 4. Aí D (precisa de 3) ou B (precisa de 4) terminam, e assim por diante.<br>&bull; <b>(c) Inseguro.</b> B pegou mais um, e sobra 1 livre. O menor &ldquo;ainda precisa&rdquo; é o de C, 2. Ninguém cabe.<br><br>A passagem de (b) para (c) é exatamente o pedido que o banqueiro teria <b>negado</b>: B pedir 1 recurso parecia inofensivo, mas levava a um estado sem sequência segura."
},
{
  id:"dl30", mod:"deadlocks", dif:"facil", tipo:"mc",
  fonte:"Slides · Sumário das técnicas de prevenção",
  enunciado:"Qual linha do quadro-resumo da prevenção está <b>correta</b>?",
  opcoes:[
    "<b>Não-preempção:</b> não se ataca na prática — tirar a impressora no meio do trabalho o estraga.",
    "<b>Espera circular:</b> obter todos os recursos antes de começar a execução.",
    "<b>Posse e espera:</b> ordenar a obtenção dos recursos por numeração.",
    "<b>Exclusão mútua:</b> deixar vários processos usarem a mesma impressora ao mesmo tempo, em paralelo."
  ],
  correta:0,
  gabarito:"O quadro dos slides:<br><br>&bull; <b>Exclusão mútua</b> &rarr; um único processo usa o recurso (o <i>spooler</i>: só o daemon de impressão toca na impressora).<br>&bull; <b>Posse e espera</b> &rarr; obter todos os recursos antes da execução.<br>&bull; <b>Não-preempção</b> &rarr; não se ataca.<br>&bull; <b>Espera circular</b> &rarr; ordenar a obtenção dos recursos.<br><br>Duas das alternativas trazem esses métodos <b>trocados</b> entre espera circular e posse-e-espera — é a pegadinha mais comum. E deixar vários processos usarem a impressora não é prevenção: a impressão simultânea embaralharia as páginas; o que se faz é tirar dos processos o acesso direto ao dispositivo."
},
{
  id:"dl31", mod:"deadlocks", dif:"medio", tipo:"vf",
  fonte:"Slides · Deadlocks sem recursos",
  enunciado:"Deadlocks só acontecem com recursos físicos, como impressoras e unidades de disco.",
  correta:1,
  gabarito:"<b>Falso.</b> Os slides chamam de <b>deadlocks &ldquo;sem recursos&rdquo;</b> os que acontecem quando dois processos esperam um pelo outro terminar alguma tarefa — por exemplo, com <b>semáforos</b>.<br><br>O caso típico: cada processo precisa dar <code>down</code> em dois semáforos — o <code>mutex</code> e outro. Se um faz na ordem mutex, outro e o segundo faz na ordem outro, mutex, os dois podem bloquear segurando um e esperando o outro. É o produtor-consumidor com as linhas trocadas.<br><br>Semáforos, mutexes, travas de banco de dados e mensagens esperadas são &ldquo;recursos&rdquo; para efeito de deadlock: as mesmas quatro condições valem, e as mesmas correções também — como pedir sempre na mesma ordem."
},
{
  id:"dl32", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Jantar dos Filósofos com deadlocks",
  enunciado:"Os slides aplicam ao Jantar dos Filósofos as três estratégias ativas de tratamento. Qual associação está correta?",
  opcoes:[
    "<b>Detecção:</b> uma thread inspeciona os semáforos. <b>Alocação segura:</b> uma distribuidora centraliza a entrega dos garfos. <b>Prevenção:</b> ordem na tomada dos garfos.",
    "<b>Detecção:</b> ordem na tomada dos garfos. <b>Alocação segura:</b> cada filósofo inspeciona os vizinhos. <b>Prevenção:</b> matar um filósofo do ciclo.",
    "<b>Detecção:</b> uma thread distribuidora entrega os garfos. <b>Alocação segura:</b> ordem dos garfos. <b>Prevenção:</b> uma thread inspeciona os semáforos.",
    "As três levam à mesma implementação: um mutex em volta da mesa inteira, do primeiro ao último filósofo da rodada."
  ],
  correta:0,
  gabarito:"Cada estratégia age num momento diferente:<br><br>&bull; <b>Detecção</b> — deixa travar e descobre depois: uma thread à parte olha os semáforos e percebe que todos os garfos estão presos e todos os filósofos esperando. Depois é preciso recuperar.<br>&bull; <b>Alocação segura</b> — decide a cada pedido: uma thread distribuidora recebe os pedidos e só entrega garfos se o estado continuar seguro. É centralizada, como o banqueiro.<br>&bull; <b>Prevenção</b> — muda as regras para que o ciclo seja impossível: numerar os garfos e pegá-los em ordem.<br><br>Pôr um mutex em volta da mesa inteira também funciona, mas serializa tudo — só um filósofo come por vez."
},
{
  id:"dl33", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Starvation",
  enunciado:"Um sistema entrega um recurso disputado sempre ao processo de <b>menor duração</b>. O que pode acontecer, e qual solução os slides indicam?",
  opcoes:[
    "Processos longos podem ser adiados indefinidamente — <b>starvation</b>. A solução indicada é atender por ordem de chegada (<b>FCFS</b>).",
    "Deadlock entre os processos curtos. A solução indicada é o algoritmo do banqueiro, que nega os pedidos que levam a estados inseguros.",
    "Nada de errado: dar prioridade aos processos curtos minimiza o tempo médio de espera.",
    "Livelock entre os processos longos. A solução indicada é eliminar um deles do sistema."
  ],
  correta:0,
  gabarito:"Priorizar os curtos é ótimo para o tempo médio quando chegam muitas tarefas rápidas — é por isso que a política é tentadora. Mas se sempre houver algum curto na fila, o longo <b>nunca</b> é atendido.<br><br>Não é deadlock: o sistema progride o tempo todo, só que sempre com os outros. É <b>starvation</b>, um problema de <b>justiça</b>, e não de segurança.<br><br>A correção dos slides é <b>FCFS</b> (<i>first come, first served</i>): atender por ordem de chegada garante que todo processo, cedo ou tarde, chega à frente da fila. Outra saída é o envelhecimento (<i>aging</i>): a prioridade de quem espera cresce com o tempo."
},
{
  id:"dl34", mod:"deadlocks", dif:"medio", tipo:"disc",
  fonte:"Slides · Estratégias para lidar com deadlocks",
  enunciado:"Quais são as quatro estratégias para lidar com deadlocks? Explique cada uma e diga quando cada uma compensa.",
  chaves:[
    ["ignorar o problema (avestruz)","avestruz","ignorar","fingir que não"],
    ["detecção e recuperação","detecção","detectar","recuperação","recuperar"],
    ["alocação segura / evitação","alocação segura","evitação","evitar","banqueiro","estado seguro"],
    ["prevenção","prevenção","prevenir","atacar uma das condições","quebrar uma das condições"],
    ["recuperar: preempção, rollback ou matar processo","rollback","checkpoint","matar","preempção","eliminar"],
    ["quando compensa: raro, custo alto, UNIX/Windows","raro","raramente","custo","unix","windows"]
  ],
  gabarito:"<b>1. Ignorar (algoritmo do avestruz).</b> Fingir que deadlocks não existem. Razoável quando acontecem raramente, a prevenção é cara e a recuperação é barata. UNIX e Windows fazem isso: troca-se corretude por conveniência.<br><br><b>2. Detecção e recuperação.</b> Deixar acontecer, detectar — ciclo no grafo, com um recurso de cada tipo, ou as matrizes E, A, C e R, com vários — e recuperar: por <b>preempção</b> do recurso, <b>rollback</b> a um ponto salvo, ou <b>matando</b> um processo do ciclo.<br><br><b>3. Alocação segura (evitação).</b> A cada pedido, simular a concessão e negá-la se o estado resultante for inseguro — o <b>banqueiro</b>. Exige conhecer os máximos antecipadamente.<br><br><b>4. Prevenção.</b> Mudar as regras para que uma das quatro condições de Coffman nunca valha. Na prática: ordenar os recursos (espera circular) ou pedir tudo de uma vez (posse e espera).<br><br><b>Resumo:</b> ignorar custa nada e arrisca travar; prevenir custa flexibilidade; evitar custa conhecer o futuro; detectar custa processamento e uma recuperação que pode perder trabalho."
}


]);
