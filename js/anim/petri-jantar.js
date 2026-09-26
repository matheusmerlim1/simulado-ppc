/* ═══════════════════════════════════════════════════════════
   Cena: o Jantar dos Filósofos em Rede de Petri — os modelos que
   o laboratório pede, com 3 filósofos.

     errado  (a) pega o da esquerda e depois o da direita  -> TRAVA
     pool    (b) dois garfos de um pool                    -> posse-e-espera
     ordem   (c) garfos pegos em ordem crescente           -> espera circular
     atomico     dois garfos identificados num só disparo  -> resposta da prova

   Usa o motor de petri.js pela fábrica window.petriCena.
   ═══════════════════════════════════════════════════════════ */
(function () {

  const C = [350, 330], CAIXA = [700, 690];
  const pos = (ang, raio) => {
    const a = (ang - 90) * Math.PI / 180;
    return [Math.round(C[0] + raio * Math.cos(a)), Math.round(C[1] + raio * Math.sin(a))];
  };

  /* ── (a) e (c): dois passos, muda só qual garfo vem primeiro ── */
  function redeDoisPassos(ordem) {
    const r = { caixa: CAIXA, lugares: {}, transicoes: {}, arcos: [], inicial: {} };
    for (let i = 0; i < 3; i++) {
      const f = 120 * i + 60;                       /* setor do filósofo i */
      const [g1, g2] = ordem(i);                    /* 1º e 2º garfo pedidos */

      r.lugares["G" + i]    = pos(120 * i, 88);
      r.lugares["Pens" + i] = pos(f - 50, 262);
      r.lugares["Tem" + i]  = pos(f - 10, 262);     /* segurando só o 1º garfo */
      r.lugares["Come" + i] = pos(f + 32, 262);
      r.transicoes["Pega1_" + i] = pos(f - 32, 170);
      r.transicoes["Pega2_" + i] = pos(f + 10, 170);
      r.transicoes["Larga" + i]  = pos(f + 50, 170);

      r.arcos.push(
        ["Pens" + i, "Pega1_" + i], ["G" + g1, "Pega1_" + i], ["Pega1_" + i, "Tem" + i],
        ["Tem" + i, "Pega2_" + i], ["G" + g2, "Pega2_" + i], ["Pega2_" + i, "Come" + i],
        ["Come" + i, "Larga" + i], ["Larga" + i, "Pens" + i],
        ["Larga" + i, "G" + g1], ["Larga" + i, "G" + g2]);

      r.inicial["G" + i] = 1;
      r.inicial["Pens" + i] = 1;
      r.inicial["Tem" + i] = 0;
      r.inicial["Come" + i] = 0;
    }
    return r;
  }

  /* ── (b): um único lugar com todos os garfos, arcos de peso 2 ── */
  function redePool() {
    const r = { caixa: CAIXA, lugares: { Garfos: C.slice() }, transicoes: {}, arcos: [], inicial: { Garfos: 3 } };
    for (let i = 0; i < 3; i++) {
      const f = 120 * i + 60;
      r.lugares["Pens" + i] = pos(f - 42, 258);
      r.lugares["Come" + i] = pos(f + 42, 258);
      r.transicoes["Pega" + i]  = pos(f - 16, 158);
      r.transicoes["Larga" + i] = pos(f + 16, 158);
      r.arcos.push(
        ["Pens" + i, "Pega" + i], ["Garfos", "Pega" + i, 2], ["Pega" + i, "Come" + i],
        ["Come" + i, "Larga" + i], ["Larga" + i, "Pens" + i], ["Larga" + i, "Garfos", 2]);
      r.inicial["Pens" + i] = 1;
      r.inicial["Come" + i] = 0;
    }
    return r;
  }

  /* ── o modelo da prova: uma transição pega os dois garfos ── */
  function redeAtomico() {
    const r = { caixa: [700, 580], lugares: {}, transicoes: {}, arcos: [], inicial: {} };
    const c2 = [350, 285];
    const p2 = (ang, raio) => {
      const a = (ang - 90) * Math.PI / 180;
      return [Math.round(c2[0] + raio * Math.cos(a)), Math.round(c2[1] + raio * Math.sin(a))];
    };
    for (let i = 0; i < 3; i++) {
      const d = (i + 1) % 3, f = 120 * i + 60;
      r.lugares["G" + i]    = p2(120 * i, 92);
      r.lugares["Pens" + i] = p2(f - 40, 256);
      r.lugares["Come" + i] = p2(f + 40, 256);
      r.transicoes["Pega" + i]  = p2(f - 20, 162);
      r.transicoes["Larga" + i] = p2(f + 20, 162);
      r.arcos.push(
        ["Pens" + i, "Pega" + i], ["G" + i, "Pega" + i], ["G" + d, "Pega" + i],
        ["Pega" + i, "Come" + i], ["Come" + i, "Larga" + i],
        ["Larga" + i, "Pens" + i], ["Larga" + i, "G" + i], ["Larga" + i, "G" + d]);
      r.inicial["G" + i] = 1;
      r.inicial["Pens" + i] = 1;
      r.inicial["Come" + i] = 0;
    }
    return r;
  }

  const REDES = {
    "jantar-errado": redeDoisPassos(i => [i, (i + 1) % 3]),
    "jantar-ordem":  redeDoisPassos(i => [Math.min(i, (i + 1) % 3), Math.max(i, (i + 1) % 3)]),
    "jantar-pool":   redePool(),
    "jantar-atomico": redeAtomico()
  };

  const ROTEIROS = {
    "jantar-errado": [
      [null, "<b>Item (a) do laboratório.</b> Cada garfo é um recurso, e o filósofo pega <b>primeiro o da esquerda</b> e só depois o da direita — por isso cada filósofo tem <b>duas</b> transições e um lugar <code>Tem</code> no meio: é nele que ele fica segurando um garfo só."],
      ["Pega1_0", "<b>Pega1_0</b> dispara: o filósofo 0 sai de <code>Pens0</code> levando o garfo <code>G0</code>. Agora ele está em <code>Tem0</code> — <b>segurando um garfo e querendo outro</b>."],
      ["Pega1_1", "O escalonador dá a vez ao filósofo 1, que pega <code>G1</code>."],
      ["Pega1_2", "E ao filósofo 2, que pega <code>G2</code>. Os três garfos saíram da mesa."],
      [null, "<b>Nenhuma transição está habilitada.</b><br>&bull; <code>Pega1_i</code> precisa de <code>Pens_i</code> — os três estão vazios.<br>&bull; <code>Pega2_0</code> precisa de <code>G1</code>, que está com o filósofo 1; <code>Pega2_1</code> precisa de <code>G2</code>; <code>Pega2_2</code> precisa de <code>G0</code>.<br>&bull; <code>Larga_i</code> precisa de <code>Come_i</code> — os três estão vazios.<br><br>Esta é uma <b>marcação morta</b>: a rede não é viva. <b>Deadlock provado</b> — e essa é exatamente a resposta do item 2 do laboratório para o modelo (a)."],
      [null, "O que a rede mostra é a condição de <b>posse-e-espera</b> desenhada: o lugar <code>Tem_i</code> <b>existe</b>, e é nele que cada filósofo fica preso com meio jantar na mão. Os outros dois modelos atacam justamente isso — um elimina o lugar do meio, o outro impede que o ciclo se feche."]
    ],
    "jantar-ordem": [
      [null, "<b>Item (c) do laboratório.</b> Mesma estrutura de (a) — dois passos e o lugar <code>Tem</code> —, mas com uma regra: <b>pega-se primeiro o garfo de menor número</b>. Para os filósofos 0 e 1 nada muda; o filósofo 2, que usa <code>G2</code> e <code>G0</code>, passa a pedir o <b>G0</b> primeiro."],
      ["Pega1_0", "Filósofo 0 pega <code>G0</code>, o menor dos seus."],
      ["Pega1_1", "Filósofo 1 pega <code>G1</code>. Repare que <code>Pega1_2</code> <b>não</b> está habilitada: ela precisa de <code>G0</code>, que está com o filósofo 0."],
      [null, "<b>Aqui está a diferença.</b> O filósofo 2 continua em <code>Pens2</code>, de <b>mãos vazias</b> — e quem não segura nada não participa de espera circular. Olhe as habilitadas: <code>Pega2_1</code> precisa de <code>G2</code>, que está livre."],
      ["Pega2_1", "Filósofo 1 pega o segundo garfo e <b>come</b>. A cadeia nunca fechou o ciclo."],
      ["Larga1", "Ele devolve <code>G1</code> e <code>G2</code>. Agora <code>Pega2_0</code> fica habilitada."],
      ["Pega2_0", "Filósofo 0 pega <code>G1</code> e come."],
      ["Larga0", "Devolve <code>G0</code> e <code>G1</code> — e só agora <code>Pega1_2</code> se habilita."],
      ["Pega1_2", "Filósofo 2 finalmente pega o <code>G0</code>."],
      ["Pega2_2", "E o <code>G2</code>: come."],
      [null, "<b>Em nenhuma marcação a rede ficou sem transição habilitada.</b> A ordenação global dos recursos quebra a <b>espera circular</b>: para fechar o ciclo, alguém teria de segurar um garfo maior e pedir um menor — e a regra proíbe."]
    ],
    "jantar-pool": [
      [null, "<b>Item (b) do laboratório.</b> Os garfos deixam de ser identificados: há <b>um único lugar</b> <code>Garfos</code> com 3 fichas. Cada <code>Pega_i</code> consome <b>2 fichas de uma vez</b> — é o que significa o <b>peso 2</b> no arco."],
      [null, "Como o arco tem peso 2, <code>Pega_i</code> só fica habilitada com <b>pelo menos 2 fichas</b> no pool. E o disparo é atômico: ou leva as duas, ou não leva nenhuma. <b>Não existe lugar intermediário</b> — a posse-e-espera desaparece da estrutura."],
      ["Pega0", "Filósofo 0 pega dois garfos e come. Sobrou <b>1</b> ficha no pool."],
      [null, "<code>Pega1</code> e <code>Pega2</code> precisam de 2 fichas e só há 1: <b>não estão habilitadas</b>. Mas <code>Larga0</code> está — a rede continua viva."],
      ["Larga0", "O filósofo 0 devolve os dois garfos: o pool volta a 3."],
      ["Pega1", "Agora é a vez do filósofo 1."],
      ["Larga1", "E ele devolve."],
      [null, "<b>Nunca há marcação morta</b>: sempre existe alguém comendo que pode largar, ou fichas suficientes para alguém pegar. Livre de deadlock.<br><br><b>Ressalva que vale ponto:</b> o pool <b>abstrai a identidade</b> dos garfos. Com 3 filósofos e 3 garfos o modelo coincide com a realidade (só um come por vez), mas com 5 filósofos ele permitiria que dois <b>vizinhos</b> comessem juntos — fisicamente impossível. O modelo prova ausência de deadlock, não a restrição de vizinhança."]
    ],
    "jantar-atomico": [
      [null, "<b>O modelo pedido na prova teórica:</b> garfos identificados, e <b>uma única transição</b> <code>Pega_i</code> com <b>três arcos de entrada</b> — <code>Pens_i</code>, <code>G_i</code> e <code>G_d</code>. Marcação inicial: uma ficha em cada <code>Pens</code> e em cada <code>G</code>."],
      ["Pega0", "<b>Pega0</b> dispara: consome o pensar e os <b>dois</b> garfos num único passo indivisível. O estado &ldquo;segurando um garfo só&rdquo; não existe nesta rede."],
      [null, "<code>Pega1</code> precisa de <code>G1</code> e <code>G2</code> — o <code>G1</code> está com o filósofo 0. <code>Pega2</code> precisa de <code>G2</code> e <code>G0</code> — o <code>G0</code> também. Nenhuma habilitada; <code>Larga0</code> sim."],
      ["Larga0", "Larga0 devolve o filósofo a <code>Pens0</code> e os dois garfos à mesa: voltamos à marcação inicial."],
      ["Pega1", "A vez do filósofo 1. Os ramos são <b>simétricos</b> por rotação dos índices."],
      ["Larga1", "E devolve os dois garfos, voltando à marcação inicial."],
      [null, "<b>O conjunto de alcançabilidade tem 4 marcações</b> — a inicial e as três com um filósofo comendo — e todas têm transição habilitada: rede <b>viva</b> e <b>livre de deadlock</b>. É também <b>segura</b>: nenhum lugar passa de 1 ficha.<br><br>Compare com o modelo (b): aqui os garfos <b>continuam identificados</b>, então a restrição de vizinhança está preservada. É a versão mais fiel ao problema."]
    ]
  };

  window.petriCena({
    id: "petri-jantar",
    nome: "Jantar em Rede de Petri",
    titulo: "Jantar dos Filósofos: os modelos em Rede de Petri",
    ideia: "Os três modelos que o laboratório pede, com 3 filósofos — o errado, que trava, e os dois que previnem o deadlock atacando condições diferentes — mais o modelo atômico pedido na prova.",
    modos: [
      { id: "jantar-errado", rotulo: "(a) esquerda e direita" },
      { id: "jantar-pool", rotulo: "(b) pool de garfos" },
      { id: "jantar-ordem", rotulo: "(c) garfos em ordem" },
      { id: "jantar-atomico", rotulo: "dois de uma vez" }
    ],
    redes: REDES,
    roteiros: ROTEIROS
  });
})();
