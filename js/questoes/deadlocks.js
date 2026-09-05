/* ─── Deadlocks ─────────────────────────────────────────────
   P1 · 24 questões
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
    "Numerar globalmente os recursos e exigir que todo processo os requisite em ordem crescente de numeração.",
    "Fazer o processo requisitar todos os recursos de que precisa de uma só vez, no início.",
    "Permitir que o sistema tome recursos à força de processos bloqueados.",
    "Usar spooling para que um daemon monopolize o dispositivo."
  ],
  correta:0,
  gabarito:"A ordenação global torna o ciclo impossível: para fechar um ciclo, algum processo teria de estar segurando o recurso <i>j</i> e pedindo o recurso <i>i</i> com <i>i &lt; j</i>, o que a regra proíbe. As outras alternativas atacam, respectivamente, <b>posse e espera</b>, <b>não-preempção</b> e <b>exclusão mútua</b>."
},
{
  id:"dl04", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Qual a diferença entre <b>prevenção</b> e <b>evitação</b> (<i>avoidance</i>) de deadlocks?",
  opcoes:[
    "A prevenção altera as regras de requisição para que uma das 4 condições nunca valha; a evitação deixa as regras livres e decide, a cada pedido, se concedê-lo mantém o sistema num estado seguro.",
    "A prevenção acontece em tempo de compilação e a evitação em tempo de ligação.",
    "A prevenção detecta o deadlock depois que ele ocorre e a evitação o desfaz com rollback.",
    "São sinônimos: as duas usam o algoritmo do Banqueiro."
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
    "Sim. Apenas P3 pode executar; depois dele A = (0 4 2 1) e nem P1 nem P2 conseguem seus pedidos — P1 e P2 estão em deadlock.",
    "Não. A sequência segura P3, P1, P2 conclui todos os processos.",
    "Sim, os três processos estão em deadlock desde o início: nenhum pedido pode ser atendido.",
    "Não é possível determinar sem conhecer a ordem de chegada dos processos."
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
    "<b>Não.</b> Conceder deixaria apenas 1 livre, e nenhum processo conseguiria completar seu máximo — o estado resultante é inseguro, então o pedido é negado e B espera.",
    "<b>Sim.</b> Com 2 livres há folga suficiente; a sequência segura A, B, C, D continua existindo.",
    "<b>Sim</b>, porque B ainda está longe do seu máximo de 6 recursos.",
    "<b>Não</b>, porque o estado atual já é inseguro, mesmo antes do pedido."
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
    "Apenas uma: <b>1,2,3</b>, idêntica à de A.",
    "Três: 1,2,3 / 1,3,2 / 2,1,3.",
    "Todas as seis, porque com apenas dois processos não pode haver espera circular."
  ],
  correta:0,
  gabarito:"O deadlock exige que A segure X e queira Y enquanto B segura Y e quer X. Verificando cada ordem de B:<br>&bull; <b>1,2,3</b> &check; &mdash; ambos pedem 1 primeiro; quem pegar 1 segue até o fim, o outro espera. Sem ciclo.<br>&bull; <b>1,3,2</b> &check; &mdash; mesmo argumento: o recurso 1 funciona como um portão de entrada.<br>&bull; <b>2,1,3</b> &#10007; &mdash; A pega 1, B pega 2; A quer 2, B quer 1. <b>Deadlock.</b><br>&bull; <b>2,3,1</b> &#10007; &mdash; A pega 1, B pega 2 e 3; A quer 2, B quer 1. <b>Deadlock.</b><br>&bull; <b>3,1,2</b> &#10007; &mdash; A pega 1 e 2, B pega 3; A quer 3, B quer 1. <b>Deadlock.</b><br>&bull; <b>3,2,1</b> &#10007; &mdash; A pega 1 e 2, B pega 3; A quer 3, B quer 2. <b>Deadlock.</b><br><br><b>Resposta: 2 das 6.</b> A moral do exercício é justamente a prevenção por <b>ordenação de recursos</b>: se ambos começam pelo recurso de menor índice, a espera circular fica impossível — não importa a ordem dos demais."
},
{
  id:"dl09", mod:"deadlocks", dif:"dificil", tipo:"mc",
  fonte:"Lab · Deadlocks, Q3",
  enunciado:"Num sistema com <b>p</b> processos, em que cada um pode requisitar no máximo <b>m</b> recursos de um total de <b>t</b> existentes, qual é a condição necessária para que o sistema seja <b>sempre</b> livre de deadlocks?",
  opcoes:[
    "<code>p &times; (m &minus; 1) + 1 &le; t</code>",
    "<code>p &times; m &le; t</code>",
    "<code>m &le; t / p</code>",
    "<code>p + m &le; t</code>"
  ],
  correta:0,
  gabarito:"Considere o <b>pior caso</b>: cada um dos <i>p</i> processos já conseguiu <i>m</i>&minus;1 recursos e falta exatamente 1 para cada um terminar. Isso consome <i>p</i>(<i>m</i>&minus;1) recursos. Se ainda sobrar <b>pelo menos 1</b> recurso, algum processo consegue completar, termina, devolve seus <i>m</i> recursos e destrava a fila em cascata. Logo a condição é <b>p(m&minus;1) + 1 &le; t</b>.<br><br><i>Exemplo:</i> 3 processos precisando de até 2 recursos cada exigem t &ge; 3&times;1+1 = <b>4</b> recursos para nunca travar. Com t = 3 (que é o caso do Jantar dos Filósofos com 3 filósofos e 3 garfos!) o deadlock é possível — e é exatamente o que acontece quando os três pegam o garfo da esquerda ao mesmo tempo.<br><br>A alternativa <code>p&times;m &le; t</code> também evita deadlock, mas é <b>suficiente e desnecessariamente forte</b>: reservar o máximo para todos ao mesmo tempo desperdiça recursos."
},
{
  id:"dl10", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Por que a solução ingênua do <b>Jantar dos Filósofos</b> — cada filósofo pega primeiro o garfo da esquerda e depois o da direita — pode travar?",
  opcoes:[
    "Se todos pegarem o garfo da esquerda ao mesmo tempo, cada um segura um garfo e espera pelo da direita, que está com o vizinho: espera circular perfeita.",
    "Porque dois filósofos podem pegar o mesmo garfo simultaneamente, corrompendo o estado.",
    "Porque um filósofo pode comer com um garfo só, deixando os outros sem talher.",
    "Porque o número de garfos é sempre menor que o número de filósofos."
  ],
  correta:0,
  gabarito:"É o exemplo didático das quatro condições de Coffman ao mesmo tempo: exclusão mútua (um garfo, um filósofo), posse e espera (segura o esquerdo, pede o direito), não-preempção (ninguém arranca garfo da mão do outro) e espera circular (F1&rarr;F2&rarr;F3&rarr;F1). Note que o número de garfos <b>é igual</b> ao de filósofos — a alternativa (d) é falsa. E não há condição de corrida: cada garfo é devidamente protegido; o problema é a <b>ordem</b> de aquisição."
},
{
  id:"dl11", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks / Lab Redes de Petri",
  enunciado:"Quais destas são soluções corretas para o deadlock do Jantar dos Filósofos, e qual condição de Coffman cada uma ataca?",
  opcoes:[
    "Pegar os dois garfos atomicamente (ataca posse-e-espera); numerar os garfos e pegá-los em ordem crescente (ataca espera circular); deixar um filósofo canhoto, invertendo sua ordem (ataca espera circular).",
    "Aumentar o número de garfos para o dobro do de filósofos (ataca exclusão mútua).",
    "Fazer cada filósofo dormir um tempo aleatório antes de pegar o garfo (ataca não-preempção).",
    "Permitir que um filósofo tome o garfo da mão do vizinho (ataca posse-e-espera)."
  ],
  correta:0,
  gabarito:"As três soluções da alternativa correta são as vistas em aula e reaparecem no laboratório de Redes de Petri. Sobre a alternativa (c): dormir um tempo aleatório <b>reduz a probabilidade</b> do deadlock, mas não o elimina — é uma correção falsa, e um erro clássico em prova. Uma quarta solução válida é limitar a <b>4 filósofos</b> à mesa por vez (com 5 lugares), usando um semáforo de contagem — também ataca posse-e-espera. Vale citar ainda que a solução do garfo canhoto é a mais elegante: basta <b>um</b> filósofo com a ordem invertida para quebrar o ciclo."
},
{
  id:"dl12", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Num <b>grafo de alocação de recursos</b>, quando a existência de um ciclo é condição <b>suficiente</b> para afirmar que há deadlock?",
  opcoes:[
    "Quando cada tipo de recurso tem apenas <b>uma</b> instância. Com múltiplas instâncias, o ciclo é apenas necessário, não suficiente.",
    "Sempre — todo ciclo no grafo indica deadlock.",
    "Nunca — o grafo só serve para visualização, e a detecção exige o algoritmo matricial.",
    "Quando o número de processos é maior que o número de recursos."
  ],
  correta:0,
  gabarito:"Com uma instância por tipo, ciclo &equiv; deadlock. Com <b>múltiplas instâncias</b>, um processo do ciclo pode receber uma instância livre de outro lugar, terminar e quebrar a cadeia — o ciclo existe, mas não há deadlock. Por isso, para recursos com múltiplas instâncias, usa-se o <b>algoritmo matricial de detecção</b> (com E, A, C e R), como na Questão 5 da Prova Teórica."
},
{
  id:"dl13", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"O que é o <b>algoritmo do avestruz</b> (<i>ostrich algorithm</i>)?",
  opcoes:[
    "Ignorar o problema deliberadamente, assumindo que deadlocks são raros o suficiente para que o custo de preveni-los não compense — é o que a maioria dos sistemas operacionais de uso geral faz.",
    "Executar o algoritmo de detecção a cada requisição de recurso.",
    "Reiniciar automaticamente todos os processos bloqueados após um tempo limite.",
    "Requisitar todos os recursos antecipadamente para evitar posse-e-espera."
  ],
  correta:0,
  gabarito:"UNIX e Windows adotam essa postura para a maioria dos recursos: prevenir custa desempenho e restringe o programador, detectar custa processamento, e deadlocks acontecem raramente em sistemas de uso geral. O usuário reinicia o processo travado e a vida segue. Em sistemas <b>críticos</b> (tempo real, bancos de dados, controle industrial) a história muda, e aí valem a prevenção, a evitação ou a detecção com <i>rollback</i>."
},
{
  id:"dl14", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Quais são as formas de <b>recuperação</b> depois que um deadlock é detectado?",
  opcoes:[
    "Preempção (tomar temporariamente o recurso de um processo), <i>rollback</i> a um <i>checkpoint</i> anterior, e eliminação de um ou mais processos do ciclo.",
    "Aumentar dinamicamente o número de recursos até que o ciclo se desfaça.",
    "Reduzir a prioridade dos processos envolvidos até que o escalonador os libere.",
    "Reiniciar o sistema operacional — é a única forma segura."
  ],
  correta:0,
  gabarito:"As três da alternativa correta. A <b>preempção</b> depende da natureza do recurso e costuma ser feita manualmente. O <b>rollback</b> exige que os processos salvem estado periodicamente (<i>checkpoints</i>), o que é comum em bancos de dados. A <b>eliminação</b> é a mais grosseira: escolhe-se a vítima — de preferência a que causa menos prejuízo, e que possa ser reexecutada do começo sem efeitos colaterais."
},
{
  id:"dl15", mod:"deadlocks", dif:"medio", tipo:"mc",
  fonte:"Slides · Deadlocks",
  enunciado:"Qual é a diferença entre <b>deadlock</b> e <b>starvation</b>?",
  opcoes:[
    "No deadlock, um conjunto de processos está bloqueado esperando uns pelos outros e ninguém progride. Na starvation, o sistema progride, mas um processo específico é sistematicamente preterido e nunca obtém o recurso.",
    "Deadlock ocorre entre threads e starvation entre processos.",
    "Deadlock é permanente e starvation é sempre resolvido pelo escalonador após um tempo.",
    "São o mesmo fenômeno, com nomes diferentes conforme o número de recursos envolvidos."
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
    "Cada processo declara antecipadamente sua necessidade <b>máxima</b> de cada tipo de recurso, e o número de processos e de recursos é fixo.",
    "Todos os processos devem ter a mesma prioridade e o escalonador deve ser FIFO.",
    "Cada tipo de recurso deve ter apenas uma instância.",
    "Os recursos precisam ser preemptáveis."
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
    "É um compromisso: a cada requisição que não pode ser atendida (detecção imediata, mas cara), ou periodicamente / quando a utilização de CPU cair abaixo de um limiar (mais barato, porém tardio).",
    "Apenas uma vez, na inicialização do sistema operacional.",
    "A cada troca de contexto do escalonador, sem exceção.",
    "Somente depois que o usuário reportar que o sistema travou."
  ],
  correta:0,
  gabarito:"Rodar a cada requisição negada detecta o deadlock no instante em que ele se forma e identifica com precisão os processos envolvidos, mas o custo é alto. Rodar periodicamente (ou disparado por uma queda na utilização de CPU — sintoma típico de processos travados) é bem mais barato, com a desvantagem de que vários ciclos podem já ter se formado, dificultando escolher a vítima da recuperação."
}

]);
