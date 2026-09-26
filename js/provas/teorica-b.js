/* Prova Teórica — questões 4, 5, 6 e 7 */

secaoTeorica({
  h: "Teórica · Q4 — As quatro condições de deadlock e como atacá-las",
  p: enunciado("Para um deadlock acontecer, são necessárias 4 condições: <i>exclusão mútua</i>, <i>não-preempção</i>, <i>posse e espera</i> e <i>espera circular</i>. Explique-as. Quais delas podem ser atacadas para <u>prevenir</u> deadlocks, e o que deve ser feito nesses casos?") +
     "<b>As quatro (Coffman).</b> Precisam valer <b>ao mesmo tempo</b>; basta quebrar uma para tornar o deadlock impossível.<br><br>" +
     "&bull; <b>Exclusão mútua</b> — cada recurso está atribuído a exatamente um processo ou está livre; não pode ser usado por dois ao mesmo tempo.<br>" +
     "&bull; <b>Posse e espera</b> — um processo que já detém recursos pode requisitar novos e ficar bloqueado esperando, <b>sem soltar</b> o que já tem.<br>" +
     "&bull; <b>Não-preempção</b> — um recurso já concedido não pode ser tomado à força; só o processo que o detém pode liberá-lo, voluntariamente.<br>" +
     "&bull; <b>Espera circular</b> — existe uma cadeia circular de dois ou mais processos, cada um esperando por um recurso detido pelo próximo (P1 → P2 → … → P1).<br><br>" +
     "<b>Quais dá para atacar, e como:</b><br><br>" +
     "&bull; <b>Espera circular — sim, e é a mais prática.</b> Impor uma <b>ordenação global (numeração) dos recursos</b> e exigir que todo processo os requisite em ordem crescente. Funciona porque, para fechar um ciclo, algum processo teria de segurar o recurso <i>j</i> e pedir o recurso <i>i</i> com <i>i</i> &lt; <i>j</i> — exatamente o que a regra proíbe. Custo: só disciplina de programação.<br><br>" +
     "&bull; <b>Posse e espera — sim.</b> Exigir que o processo requisite <b>todos</b> os recursos de uma vez, no início; se algum não estiver disponível, não recebe nenhum e espera. Variação: obrigá-lo a <b>liberar tudo</b> antes de pedir um novo conjunto. Custos: nem sempre se sabe de antemão o que será preciso, a utilização dos recursos cai (ficam reservados sem uso) e há risco de <i>starvation</i> para quem precisa de muitos.<br><br>" +
     "&bull; <b>Exclusão mútua — raramente.</b> Só com <b>spooling</b>: em vez de dar o recurso ao processo, um daemon monopoliza o dispositivo e enfileira os pedidos (caso da impressora). Não funciona para recursos intrinsecamente exclusivos, como uma entrada de tabela ou um registro de banco de dados.<br><br>" +
     "&bull; <b>Não-preempção — na prática, não se ataca.</b> Exigiria tomar o recurso à força salvando e restaurando estado (<i>checkpoint</i> e <i>rollback</i>), o que só é viável para CPU e memória. Tirar uma impressora no meio da impressão, ou um mutex no meio de uma região crítica, deixa o sistema inconsistente.",
  cod: "CONDICAO            ATACA-SE?    COMO\n" +
       "---------------------------------------------------------------\n" +
       "Exclusao mutua      raramente    spooling (um unico daemon usa)\n" +
       "Posse e espera      SIM          pedir tudo de uma vez, no inicio\n" +
       "Nao-preempcao       nao          (so CPU e memoria toleram)\n" +
       "Espera circular     SIM          ordem global: pedir em ordem crescente",
  box: "<b>A resposta completa tem duas partes</b> — explicar as quatro <b>e</b> dizer quais são atacáveis com o quê. Quem só explica as condições entrega metade. E o exemplo que amarra tudo: no Jantar dos Filósofos, pegar os dois garfos atomicamente ataca <b>posse e espera</b>; numerar os garfos ataca <b>espera circular</b>."
});

secaoTeorica({
  h: "Teórica · Q5 — Detecção de deadlock (resolvida com os números da prova)",
  p: enunciado("Considere o estado de sistema ao lado, com três processos P1, P2, P3 e quatro tipos de recursos RS1, RS2, RS3, RS4. Ele está em deadlock? Justifique utilizando o algoritmo de detecção estudado em aula.") +
     "<b>Confira a consistência antes de começar.</b> Para cada recurso, <b>A + soma da coluna de C = E</b>:<br>" +
     "RS1: 0 + (1+1+0) = 2 ✓ &nbsp;·&nbsp; RS2: 3 + (0+0+1) = 4 ✓ &nbsp;·&nbsp; RS3: 2 + (1+1+0) = 4 ✓ &nbsp;·&nbsp; RS4: 0 + (0+0+1) = 1 ✓<br><br>" +
     "<b>O algoritmo:</b> procure um processo cuja linha de <b>R</b> caiba em <b>A</b> (componente a componente); execute-o e devolva a linha dele de <b>C</b> para <b>A</b>. Repita. Quem sobrar está em deadlock.",
  anima: { cena: "deteccao", modo: "deteccao", rotulo: "Ver o passo a passo animado, com estes números" },
  cod: "E = (2  4  4  1)        A = (0  3  2  0)\n\n" +
       "       C (tem)                    R (ainda pede)\n" +
       "     RS1 RS2 RS3 RS4            RS1 RS2 RS3 RS4\n" +
       "P1    1   0   1   0              1   0   0   0\n" +
       "P2    1   0   1   0              1   1   0   1\n" +
       "P3    0   1   0   1              0   1   2   0\n\n" +
       "RODADA 1   com A = (0 3 2 0)\n" +
       "  P1 pede (1 0 0 0): precisa de 1 de RS1, ha 0.        NAO\n" +
       "  P2 pede (1 1 0 1): precisa de RS1 (ha 0) e RS4 (0).  NAO\n" +
       "  P3 pede (0 1 2 0): 0<=0, 1<=3, 2<=2, 0<=0.           SIM\n" +
       "     P3 executa, termina e devolve a sua linha de C = (0 1 0 1)\n" +
       "     A = (0 3 2 0) + (0 1 0 1) = (0 4 2 1)\n\n" +
       "RODADA 2   com A = (0 4 2 1)\n" +
       "  P1 pede (1 0 0 0): RS1 continua em 0.                NAO\n" +
       "  P2 pede (1 1 0 1): RS1 continua em 0.                NAO\n\n" +
       "=> P1 e P2 estao em DEADLOCK",
  box: "<b>Por que P1 e P2 travam:</b> os dois esperam por <b>RS1</b>, e as duas unidades existentes de RS1 estão justamente com eles (1 com P1, 1 com P2). Ninguém mais vai devolver RS1.<br><br><b>Erro que custa a questão:</b> parar na primeira rodada e declarar deadlock geral. P3 <b>não</b> está em deadlock — ele não cabia de cara, mas coube depois. &ldquo;Não dá para atender agora&rdquo; nunca é, sozinho, prova de deadlock."
});

secaoTeorica({
  h: "Teórica · Q6 — Algoritmo do Banqueiro (resolvida com os números da prova)",
  p: enunciado("Considere o estado de alocação de recursos para os processos A, B, C e D ao lado. Suponha que o processo <b>B solicite 1 recurso</b>. O sistema irá ou não dar a esse processo? Responda utilizando o Algoritmo do Banqueiro estudado em aula.") +
     "<b>Resposta: não.</b> O pedido é legítimo e há recurso livre, mas conceder deixaria o sistema num <b>estado inseguro</b> — então o banqueiro nega e B espera.<br><br>" +
     "O banqueiro tem três passos: <b>(1)</b> validar o pedido, <b>(2)</b> simular a concessão e <b>(3)</b> testar se ainda existe <b>sequência segura</b>, desfazendo se não existir.",
  cod: "ESTADO ATUAL                      livres = 2\n" +
       "  proc   tem   maximo   ainda precisa\n" +
       "   A      2      6           4\n" +
       "   B      1      6           5\n" +
       "   C      1      5           4\n" +
       "   D      2      4           2\n" +
       "  (total de recursos = 2+1+1+2 + 2 livres = 8)\n\n" +
       "PASSO 1 - o estado atual e seguro?\n" +
       "  D precisa de 2 e ha 2   -> D termina e devolve 4   livres = 4\n" +
       "  A precisa de 4 e ha 4   -> A termina e devolve 6   livres = 6\n" +
       "  B precisa de 5 e ha 6   -> B termina e devolve 6   livres = 7\n" +
       "  C precisa de 4 e ha 7   -> C termina\n" +
       "  SEQUENCIA SEGURA: D -> A -> B -> C       (estado seguro)\n\n" +
       "PASSO 2 - simular B recebendo 1 recurso\n" +
       "   A 2/6 (4)   B 2/6 (4)   C 1/5 (4)   D 2/4 (2)   livres = 1\n\n" +
       "PASSO 3 - existe sequencia segura agora?\n" +
       "  menor necessidade restante = D, com 2.  Ha 1 livre.\n" +
       "  Nenhum processo consegue chegar ao maximo -> ESTADO INSEGURO\n\n" +
       "=> o pedido e NEGADO; a simulacao e desfeita e B espera",
  box: "<b>Inseguro não é deadlock.</b> Se o pedido fosse atendido, nada travaria naquele instante — os processos poderiam até devolver recursos sem pedir o máximo. O que se perde é a <b>garantia</b> de que todos terminam, e o banqueiro é conservador de propósito.<br><br><b>Para ganhar a questão inteira:</b> mostre a sequência segura do estado atual (é ela que prova que o estado de partida era seguro), a simulação, e a conclusão com o pedido negado."
});

secaoTeorica({
  h: "Teórica · Q7 — Rede de Petri do Jantar dos Filósofos, sem deadlock",
  p: enunciado("Crie um modelo de Rede de Petri para representar o Problema do Jantar dos Filósofos, considerando <b>3 filósofos</b>. <u>Seu modelo não deverá possuir deadlocks.</u>") +
     "A chave está em <b>não permitir o estado &ldquo;segurando um garfo só&rdquo;</b>. Isso se consegue com <b>uma única transição</b> que pega os dois garfos — como o disparo é atômico, o estado intermediário não existe na rede, e a condição de <b>posse-e-espera</b> desaparece por construção.<br><br>" +
     "<b>Lugares (9)</b>, com <i>d</i> = (<i>i</i>+1) mod 3:<br>" +
     "&bull; <code>Pensando_0</code>, <code>Pensando_1</code>, <code>Pensando_2</code> — marcação inicial: <b>1 ficha em cada</b>;<br>" +
     "&bull; <code>Comendo_0</code>, <code>Comendo_1</code>, <code>Comendo_2</code> — inicialmente <b>vazios</b>;<br>" +
     "&bull; <code>Garfo_0</code>, <code>Garfo_1</code>, <code>Garfo_2</code> — <b>1 ficha em cada</b> (a ficha única é o que garante a exclusão sobre o garfo).<br><br>" +
     "<b>Transições (6)</b>, duas por filósofo:<br>" +
     "&bull; <code>Pega_i</code> — <b>entradas:</b> <code>Pensando_i</code>, <code>Garfo_i</code> e <code>Garfo_d</code>. <b>Saída:</b> <code>Comendo_i</code>.<br>" +
     "&bull; <code>Larga_i</code> — <b>entrada:</b> <code>Comendo_i</code>. <b>Saídas:</b> <code>Pensando_i</code>, <code>Garfo_i</code> e <code>Garfo_d</code>.<br><br>" +
     "<b>É este o desenho que se entrega na prova</b> — com a marcação inicial indicada pelas fichas:",
  rede: "jantar-atomico",
  legenda: "M<sub>0</sub> = uma ficha em cada <code>Pens</code> (todos pensando) e uma em cada <code>G</code> (garfos livres). Repare nos <b>três arcos de entrada</b> de cada <code>Pega</code>: é o que faz os dois garfos serem tomados num único disparo.",
  anima: { cena: "petri-jantar", modo: "jantar-atomico", rotulo: "Ver a rede disparando, passo a passo" },
  cod: "M0 = [ Pens0,Pens1,Pens2 | Com0,Com1,Com2 | G0,G1,G2 ]\n" +
       "   = [   1,    1,    1   |  0,   0,   0   |  1, 1, 1 ]\n\n" +
       "PROVA POR ARVORE DE ALCANCABILIDADE\n\n" +
       "M0 = [1,1,1 | 0,0,0 | 1,1,1]   habilitadas: Pega_0, Pega_1, Pega_2\n\n" +
       "  dispara Pega_0  (consome Pens0, G0 e G1)\n" +
       "  M1 = [0,1,1 | 1,0,0 | 0,0,1]\n" +
       "     Pega_1 precisa de G1 e G2 -> G1 vazio.   NAO habilitada\n" +
       "     Pega_2 precisa de G2 e G0 -> G0 vazio.   NAO habilitada\n" +
       "     Larga_0 precisa de Com0   -> tem ficha.  HABILITADA\n" +
       "  dispara Larga_0 -> volta a M0\n\n" +
       "  os ramos de Pega_1 e Pega_2 sao SIMETRICOS por rotacao dos indices\n\n" +
       "CONJUNTO DE ALCANCABILIDADE: 4 marcacoes (M0 e as tres do tipo M1)\n" +
       "Todas tem pelo menos uma transicao habilitada -> nao ha marcacao morta\n" +
       "=> a rede e VIVA e LIVRE DE DEADLOCK (e segura: nenhum lugar passa de 1)",
  box: "<b>O que NÃO vale:</b> separar em <code>Pega_esquerdo_i</code> e <code>Pega_direito_i</code>. Esse é o modelo (a) do laboratório, explicitamente chamado de implementação errada: a árvore chega à marcação em que os três dispararam &ldquo;pega esquerdo&rdquo;, todos os garfos estão vazios e nenhuma transição está habilitada — <b>marcação morta</b>.<br><br><b>Observação que vale ponto:</b> com 3 filósofos e 3 garfos, apenas <b>um</b> come por vez. O modelo está correto, mas com pouco paralelismo — e dizer isso mostra que você entendeu o que a rede representa."
});
