/* ═══════════════════════════════════════════════════════════
   Cena: Redes de Petri — lugares, transições, arcos e marcas.

   Uma rede é { lugares, transicoes, arcos, inicial, caixa } e o
   simulador é genérico: habilitada = toda entrada tem marcas >= peso;
   disparar consome as entradas e produz nas saídas, de uma só vez.
   ═══════════════════════════════════════════════════════════ */
(function () {

  const REDES = {
    disparo: {
      caixa: [470, 285],
      lugares: {
        p1: [60, 55], p2: [245, 55], p3: [245, 155], p4: [420, 105],
        p5: [60, 235], p6: [245, 235]
      },
      transicoes: { t1: [152, 55], t2: [335, 105], t3: [152, 235] },
      arcos: [["p1", "t1"], ["t1", "p2"], ["p2", "t2"], ["p3", "t2"], ["t2", "p4"],
              ["p5", "t3"], ["t3", "p6"]],
      inicial: { p1: 1, p2: 0, p3: 1, p4: 0, p5: 0, p6: 0 }
    },
    conflito: {
      caixa: [410, 275],
      lugares: { p1: [70, 80], p2: [330, 35], p3: [330, 125], p4: [70, 225], p5: [330, 225] },
      transicoes: { t1: [200, 35], t2: [200, 125], t3: [200, 225] },
      arcos: [["p1", "t1"], ["t1", "p2"], ["p1", "t2"], ["t2", "p3"], ["p4", "t3"], ["t3", "p5"]],
      inicial: { p1: 1, p2: 0, p3: 0, p4: 1, p5: 0 }
    },
    mutex: {
      caixa: [530, 265],
      lugares: {
        FILA_ENTRADA: [60, 70], RC: [280, 70], FILA_SAIDA: [480, 70], MUTEX: [280, 195]
      },
      transicoes: { ENTRAR: [168, 70], SAIR: [385, 70] },
      arcos: [["FILA_ENTRADA", "ENTRAR"], ["ENTRAR", "RC"], ["RC", "SAIR"],
              ["SAIR", "FILA_SAIDA"], ["MUTEX", "ENTRAR"], ["SAIR", "MUTEX"]],
      inicial: { FILA_ENTRADA: 2, RC: 0, FILA_SAIDA: 0, MUTEX: 1 }
    },
    produtor: {
      caixa: [550, 225],
      lugares: { PRODUTOR: [52, 105], TAMANHO: [265, 40], DADOS: [265, 170], CONSUMIDOR: [498, 105] },
      transicoes: { PRODUZIR: [152, 105], CONSUMIR: [385, 105] },
      arcos: [["PRODUTOR", "PRODUZIR"], ["PRODUZIR", "PRODUTOR"], ["TAMANHO", "PRODUZIR"],
              ["PRODUZIR", "DADOS"], ["DADOS", "CONSUMIR"], ["CONSUMIR", "TAMANHO"],
              ["CONSUMIDOR", "CONSUMIR"], ["CONSUMIR", "CONSUMIDOR"]],
      inicial: { PRODUTOR: 1, TAMANHO: 3, DADOS: 0, CONSUMIDOR: 1 }
    }
  };

  /* ── simulador ─────────────────────────────────────────── */
  const peso = ([, , p]) => p || 1;
  const entradas = (rede, t) => rede.arcos.filter(a => a[1] === t);
  const saidas = (rede, t) => rede.arcos.filter(a => a[0] === t);

  function habilitada(rede, m, t) {
    return entradas(rede, t).every(a => (m[a[0]] || 0) >= peso(a));
  }
  function habilitadas(rede, m) {
    return Object.keys(rede.transicoes).filter(t => habilitada(rede, m, t));
  }
  function disparar(rede, m, t) {
    const novo = Object.assign({}, m);
    entradas(rede, t).forEach(a => { novo[a[0]] -= peso(a); });
    saidas(rede, t).forEach(a => { novo[a[1]] += peso(a); });
    return novo;
  }

  /* ── roteiros: [transição a disparar (ou null), legenda] ── */
  const ROTEIRO = {
    disparo: [
      [null, "Os três elementos: <b>lugares</b> (círculos) são condições ou recursos, <b>transições</b> (barras) são eventos, e as <b>marcas</b> dentro dos lugares são o estado. A distribuição das marcas é a <b>marcação</b>."],
      [null, "Só <b>t1</b> está habilitada. <b>t2</b> tem duas entradas e só <code>p3</code> tem marca — a condição é <b>conjuntiva</b>, precisa de todas. <b>t3</b> tem uma entrada só, <code>p5</code>, que está vazia."],
      ["t1", "<b>t1</b> dispara: remove a marca de <code>p1</code> e põe uma em <code>p2</code>. O disparo é <b>atômico</b> — não existe instante em que a marca esteja fora dos dois lugares."],
      [null, "Agora <code>p2</code> e <code>p3</code> têm marca: <b>t2</b> ficou habilitada. Foi o disparo de t1 que criou a condição — é assim que a rede encadeia eventos."],
      ["t2", "<b>t2</b> dispara: remove uma marca de <b>cada</b> entrada (<code>p2</code> e <code>p3</code>) e põe <b>uma</b> em <code>p4</code>. Duas marcas entraram, uma saiu: o total <b>não se conserva</b>."],
      [null, "Nenhuma transição habilitada: esta marcação é <b>morta</b> — o equivalente, no modelo, a um sistema travado. E <b>t3</b> nunca disparou: é uma <b>transição morta</b>, um evento que o sistema jamais executa."]
    ],
    conflito: [
      [null, "<code>p1</code> tem <b>uma</b> marca e é entrada de <b>t1</b> e <b>t2</b>. Embaixo, <code>p4</code> alimenta <b>t3</b>, que não depende de ninguém."],
      [null, "Habilitadas: <b>t1</b>, <b>t2</b> e <b>t3</b>. Mas t1 e t2 disputam a <b>mesma</b> marca: estão em <b>conflito</b> — disparar uma desabilita a outra."],
      ["t1", "Disparou <b>t1</b>: a marca foi para <code>p2</code> e <b>t2</b> ficou desabilitada. <code>p3</code> nunca receberá marca por este caminho."],
      ["reset", "Voltemos à marcação inicial para ver o outro desfecho."],
      ["t2", "Desta vez disparou <b>t2</b>: a marca foi para <code>p3</code>. <b>Mesma rede, mesma marcação inicial, resultado diferente</b> — o modelo é <b>não determinístico</b>, e é justamente isso que representa a imprevisibilidade do escalonador."],
      ["t3", "<b>t3</b> disparou de qualquer jeito. Ela não compartilha lugar de entrada com ninguém: é <b>independente</b>, e a ordem em que dispara em relação a t1 ou t2 não muda nada. Conflito modela <b>disputa</b>; independência modela <b>paralelismo</b>."]
    ],
    mutex: [
      [null, "Modelo de um <b>mutex</b>. Dois processos esperando em <code>FILA_ENTRADA</code>, a região crítica em <code>RC</code>, e o lugar <code>MUTEX</code> com <b>uma única marca</b>: ela <b>é</b> a trava."],
      ["ENTRAR", "<b>ENTRAR</b> dispara: consome um processo da fila <b>e</b> a marca do mutex, e põe uma marca em <code>RC</code>. Um processo está na região crítica."],
      [null, "Ainda há processo esperando em <code>FILA_ENTRADA</code>, mas <b>ENTRAR</b> não está habilitada: <code>MUTEX</code> está vazio. <b>É a exclusão mútua, garantida pela estrutura da rede</b> — não por uma regra externa."],
      ["SAIR", "<b>SAIR</b> dispara: o processo vai para <code>FILA_SAIDA</code> e a marca <b>volta</b> para <code>MUTEX</code>. A trava foi liberada."],
      ["ENTRAR", "Com o mutex livre, o segundo processo entra."],
      ["SAIR", "E sai. Repare no invariante: <code>RC</code> + <code>MUTEX</code> = 1 <b>sempre</b>. Ou a trava está livre, ou há exatamente um processo na região crítica."],
      [null, "Se <code>MUTEX</code> começasse com <b>2</b> marcas, dois processos entrariam juntos em <code>RC</code> — deixaria de ser mutex e viraria um semáforo de contagem."]
    ],
    produtor: [
      [null, "<b>Produtor-consumidor</b> com fila de 3 espaços. <code>TAMANHO</code> conta os lugares <b>livres</b> (3) e <code>DADOS</code>, os itens <b>prontos</b> (0). As marcas em <code>PRODUTOR</code> e <code>CONSUMIDOR</code> dizem que cada um está pronto para agir."],
      ["PRODUZIR", "<b>PRODUZIR</b> consome um espaço livre e devolve a marca ao produtor: <code>TAMANHO</code> 3&rarr;2, <code>DADOS</code> 0&rarr;1."],
      ["PRODUZIR", "De novo: <code>TAMANHO</code> 2&rarr;1, <code>DADOS</code> 1&rarr;2."],
      ["PRODUZIR", "E de novo. <code>TAMANHO</code> chegou a <b>0</b>: a fila encheu."],
      [null, "<b>PRODUZIR</b> deixou de estar habilitada, porque <code>TAMANHO</code> está vazio. O produtor está bloqueado — e no modelo isso não é uma regra à parte, é a <b>falta de marca</b> num lugar de entrada."],
      ["CONSUMIR", "<b>CONSUMIR</b> dispara: tira um item de <code>DADOS</code> e devolve um espaço a <code>TAMANHO</code>."],
      ["PRODUZIR", "Com um espaço livre, o produtor volta a produzir."],
      [null, "O invariante: <code>TAMANHO</code> + <code>DADOS</code> = <b>3</b> em toda marcação alcançável. É a <b>prova formal</b> de que o buffer nunca estoura nem é lido vazio — a mesma garantia que, em código, vem dos semáforos <code>vazios</code> e <code>cheios</code>."]
    ]
  };

  function roteiro(modo) {
    const rede = REDES[modo];
    let m = Object.assign({}, rede.inicial);
    return ROTEIRO[modo].map(([acao, legenda]) => {
      let disparou = null;
      if (acao === "reset") m = Object.assign({}, rede.inicial);
      else if (acao) { m = disparar(rede, m, acao); disparou = acao; }
      return { m: Object.assign({}, m), hab: habilitadas(rede, m), disparou, legenda };
    });
  }

  /* ── desenho ───────────────────────────────────────────── */
  const RAIO = { lugar: 25, transicao: 24 };

  function pontos(rede) {
    const p = {};
    Object.keys(rede.lugares).forEach(k => { p[k] = { xy: rede.lugares[k], tipo: "lugar" }; });
    Object.keys(rede.transicoes).forEach(k => { p[k] = { xy: rede.transicoes[k], tipo: "transicao" }; });
    return p;
  }

  /* arco em curva suave: arcos opostos entre os mesmos nós se separam */
  function curva(de, para) {
    const [x1, y1] = de.xy, [x2, y2] = para.xy;
    const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1;
    const ux = dx / d, uy = dy / d;
    const a = [x1 + ux * RAIO[de.tipo], y1 + uy * RAIO[de.tipo]];
    const b = [x2 - ux * (RAIO[para.tipo] + 5), y2 - uy * (RAIO[para.tipo] + 5)];
    const mx = (a[0] + b[0]) / 2 - uy * 13, my = (a[1] + b[1]) / 2 + ux * 13;
    return { d: "M" + a[0] + " " + a[1] + " Q" + mx + " " + my + " " + b[0] + " " + b[1], meio: [mx, my] };
  }

  function montar(palco, modo) {
    const rede = REDES[modo];
    const nos = pontos(rede);

    let svg = '<svg class="pn-rede" viewBox="0 0 ' + rede.caixa[0] + " " + rede.caixa[1] +
      '" role="img" aria-label="Rede de Petri"><defs>' +
      '<marker id="pn-ponta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0 0 L10 5 L0 10 z"></path></marker></defs><g class="pn-arcos">';

    rede.arcos.forEach(a => {
      const c = curva(nos[a[0]], nos[a[1]]);
      svg += '<path class="pn-arco" d="' + c.d + '" marker-end="url(#pn-ponta)"></path>';
      if (peso(a) > 1)
        svg += '<text class="pn-peso" x="' + c.meio[0] + '" y="' + c.meio[1] + '">' + peso(a) + "</text>";
    });
    svg += "</g>";

    Object.keys(rede.transicoes).forEach(t => {
      const [x, y] = rede.transicoes[t];
      svg += '<g class="pn-trans" data-t="' + t + '">' +
        '<rect x="' + (x - 7) + '" y="' + (y - 26) + '" width="14" height="52" rx="3"></rect>' +
        '<text x="' + x + '" y="' + (y - 34) + '">' + t + "</text></g>";
    });

    Object.keys(rede.lugares).forEach(p => {
      const [x, y] = rede.lugares[p];
      svg += '<g class="pn-lugar" data-p="' + p + '"><circle cx="' + x + '" cy="' + y + '" r="25"></circle>' +
        '<g class="pn-marcas"></g>' +
        '<text class="pn-conta" x="' + x + '" y="' + (y + 1) + '"></text>' +
        '<text class="pn-nome" x="' + x + '" y="' + (y + 42) + '">' + p + "</text></g>";
    });
    svg += "</svg>";
    palco.innerHTML = svg +
      '<div class="pn-estado"><span class="rot">marcação</span><b></b>' +
      '<span class="rot">habilitadas</span><i></i></div>';

    const PONTOS = { 1: [[0, 0]], 2: [[-9, 0], [9, 0]], 3: [[0, -9], [-9, 6], [9, 6]],
                     4: [[-9, -9], [9, -9], [-9, 9], [9, 9]] };

    return function desenhar(e) {
      Object.keys(rede.lugares).forEach(p => {
        const g = palco.querySelector('.pn-lugar[data-p="' + p + '"]');
        const [x, y] = rede.lugares[p];
        const n = e.m[p] || 0;
        g.querySelector(".pn-marcas").innerHTML = n && n <= 4
          ? PONTOS[n].map(([dx, dy]) => '<circle class="pn-marca" cx="' + (x + dx) + '" cy="' + (y + dy) + '" r="5"></circle>').join("")
          : "";
        g.querySelector(".pn-conta").textContent = n > 4 ? n : "";
        g.setAttribute("class", "pn-lugar" + (n ? " tem" : ""));
      });

      Object.keys(rede.transicoes).forEach(t => {
        const g = palco.querySelector('.pn-trans[data-t="' + t + '"]');
        g.setAttribute("class", "pn-trans" + (e.hab.includes(t) ? " hab" : "") +
                                (e.disparou === t ? " disparou" : ""));
      });

      const marc = Object.keys(rede.lugares).map(p => e.m[p] || 0).join(", ");
      palco.querySelector(".pn-estado b").textContent = "(" + marc + ")";
      palco.querySelector(".pn-estado i").textContent = e.hab.length ? e.hab.join(", ") : "nenhuma";
      palco.querySelector(".pn-estado i").className = e.hab.length ? "" : "morta";
    };
  }

  registrarAnimacao({
    id: "petri",
    nome: "Redes de Petri",
    titulo: "Rede de Petri: marcas, disparo e modelagem",
    ideia: "Lugares são condições, transições são eventos e as marcas são o estado. Disparar uma transição consome as entradas e produz nas saídas — de uma vez só.",
    modos: [
      { id: "disparo", rotulo: "habilitação e disparo" },
      { id: "conflito", rotulo: "conflito e independência" },
      { id: "mutex", rotulo: "exclusão mútua" },
      { id: "produtor", rotulo: "produtor-consumidor" }
    ],
    montar, roteiro
  });
})();
