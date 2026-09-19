/* ═══════════════════════════════════════════════════════════
   Cena: grafo de alocação de recursos (slides de Deadlocks).
   Processos A, B, C e recursos R, S, T, uma unidade de cada.
     trava   : a sequência dos slides, que fecha o ciclo
     evitado : A e C com os mesmos pedidos, e B adiado pelo sistema
   Aresta recurso -> processo = posse; processo -> recurso = pedido.
   ═══════════════════════════════════════════════════════════ */
(function () {

  /* hexágono na ordem do ciclo: A -> S -> B -> T -> C -> R -> A */
  const POS = {
    A: [110, 45], S: [310, 45], B: [390, 150],
    T: [310, 255], C: [110, 255], R: [30, 150]
  };
  const PROCESSOS = ["A", "B", "C"];
  const RECURSOS = ["R", "S", "T"];

  const ROTEIRO = {
    trava: [
      [[], "Três processos (círculos) e três recursos (quadrados), uma unidade de cada. Seta <b>recurso &rarr; processo</b> é posse; seta <b>processo &rarr; recurso</b> é pedido pendente."],
      [[["pede", "A", "R"]], "<b>1)</b> A requisita R. Está livre: A recebe."],
      [[["pede", "B", "S"]], "<b>2)</b> B requisita S e recebe."],
      [[["pede", "C", "T"]], "<b>3)</b> C requisita T e recebe. Cada processo tem um recurso, e ninguém espera ainda."],
      [[["pede", "A", "S"]], "<b>4)</b> A requisita S, que está com B. A <b>bloqueia</b> — mas B ainda pode terminar e soltar S."],
      [[["pede", "B", "T"]], "<b>5)</b> B requisita T, que está com C. B bloqueia. C ainda roda: a cadeia ainda pode se desfazer."],
      [[["pede", "C", "R"]], "<b>6)</b> C requisita R, que está com A. O ciclo se fecha: <b>A &rarr; S &rarr; B &rarr; T &rarr; C &rarr; R &rarr; A</b>. Deadlock."],
      [[], "Com uma unidade de cada recurso, <b>ciclo no grafo = deadlock</b>. É o que o algoritmo de detecção procura: percorre os arcos guardando o caminho, e um nó repetido no caminho denuncia o ciclo."]
    ],
    evitado: [
      [[], "Os mesmos pedidos de A e C — mas agora o sistema <b>adia B</b>, porque atendê-lo agora levaria a um estado sem saída."],
      [[["pede", "A", "R"]], "A requisita R e recebe."],
      [[["pede", "C", "T"]], "C requisita T e recebe."],
      [[["pede", "A", "S"]], "A requisita S. Com B adiado, S está livre: A recebe e já tem tudo de que precisa."],
      [[["pede", "C", "R"]], "C requisita R, que está com A. C <b>bloqueia</b> — mas A não espera ninguém, então vai terminar."],
      [[["libera", "A", "R"]], "A termina e libera R. C, que esperava R, recebe e volta a executar."],
      [[["libera", "A", "S"], ["fim", "A"]], "A libera S. Em nenhum momento o grafo teve ciclo."],
      [[["libera", "C", "R"], ["libera", "C", "T"], ["fim", "C"]], "C termina e libera R e T. Só agora B roda, e encontra S e T livres. Adiar um processo na hora certa é a ideia da <b>alocação segura</b>: recusar uma concessão que leve a um estado sem saída."]
    ]
  };

  /* ── simulação ─────────────────────────────────────────── */
  function aplicar(s, [acao, p, r]) {
    if (acao === "pede") {
      if (s.dono[r] === null) s.dono[r] = p;
      else s.pede[p] = r;
    }
    if (acao === "libera") {
      s.dono[r] = null;
      const quem = PROCESSOS.find(x => s.pede[x] === r);
      if (quem) { s.pede[quem] = null; s.dono[r] = quem; }
    }
    if (acao === "fim") s.fim[p] = true;
  }

  function temCiclo(s) {
    /* com uma unidade por recurso: segue pedido -> dono até repetir ou parar */
    for (const inicio of PROCESSOS) {
      let p = inicio;
      const visto = new Set();
      while (p && s.pede[p]) {
        if (visto.has(p)) return true;
        visto.add(p);
        p = s.dono[s.pede[p]];
        if (p === inicio) return true;
      }
    }
    return false;
  }

  function roteiro(modo) {
    let s = { dono: { R: null, S: null, T: null }, pede: { A: null, B: null, C: null }, fim: { A: false, B: false, C: false } };
    return ROTEIRO[modo].map(([acoes, legenda]) => {
      s = { dono: Object.assign({}, s.dono), pede: Object.assign({}, s.pede), fim: Object.assign({}, s.fim) };
      acoes.forEach(a => aplicar(s, a));
      return { dono: Object.assign({}, s.dono), pede: Object.assign({}, s.pede),
               fim: Object.assign({}, s.fim), ciclo: temCiclo(s), legenda };
    });
  }

  /* ── desenho ───────────────────────────────────────────── */
  function seta(de, para, raio) {
    const [x1, y1] = POS[de], [x2, y2] = POS[para];
    const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
    const ux = dx / d, uy = dy / d;
    return [x1 + ux * raio, y1 + uy * raio, x2 - ux * (raio + 4), y2 - uy * (raio + 4)];
  }

  function montar(palco) {
    let svg = '<svg class="gr-mapa" viewBox="0 0 420 300" role="img" aria-label="Grafo de alocação de recursos">' +
      '<defs><marker id="gr-ponta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0 0 L10 5 L0 10 z"></path></marker></defs><g class="gr-arestas"></g>';
    RECURSOS.forEach(r => {
      const [x, y] = POS[r];
      svg += '<g class="gr-rec" data-n="' + r + '"><rect x="' + (x - 20) + '" y="' + (y - 20) + '" width="40" height="40" rx="6"></rect>' +
             '<text x="' + x + '" y="' + (y + 1) + '">' + r + "</text></g>";
    });
    PROCESSOS.forEach(p => {
      const [x, y] = POS[p];
      svg += '<g class="gr-proc" data-n="' + p + '"><circle cx="' + x + '" cy="' + y + '" r="22"></circle>' +
             '<text x="' + x + '" y="' + (y + 1) + '">' + p + "</text></g>";
    });
    svg += "</svg>";
    palco.innerHTML = svg +
      '<div class="gr-legenda"><span><i class="gr-l posse"></i>posse (recurso &rarr; processo)</span>' +
      '<span><i class="gr-l pedido"></i>pedido pendente (processo &rarr; recurso)</span></div>';

    return function desenhar(e) {
      let arestas = "";
      RECURSOS.forEach(r => {
        const p = e.dono[r];
        if (!p) return;
        const [a, b, c, d] = seta(r, p, 22);
        arestas += '<line class="gr-aresta posse' + (e.ciclo ? " ciclo" : "") + '" x1="' + a + '" y1="' + b +
                   '" x2="' + c + '" y2="' + d + '" marker-end="url(#gr-ponta)"></line>';
      });
      PROCESSOS.forEach(p => {
        const r = e.pede[p];
        if (!r) return;
        const [a, b, c, d] = seta(p, r, 22);
        arestas += '<line class="gr-aresta pedido' + (e.ciclo ? " ciclo" : "") + '" x1="' + a + '" y1="' + b +
                   '" x2="' + c + '" y2="' + d + '" marker-end="url(#gr-ponta)"></line>';
      });
      palco.querySelector(".gr-arestas").innerHTML = arestas;

      palco.querySelectorAll(".gr-proc").forEach(g => {
        const p = g.dataset.n;
        g.setAttribute("class", "gr-proc" + (e.pede[p] ? " espera" : "") +
                                (e.fim[p] ? " fim" : "") + (e.ciclo && e.pede[p] ? " ciclo" : ""));
      });
      palco.querySelectorAll(".gr-rec").forEach(g =>
        g.setAttribute("class", "gr-rec" + (e.dono[g.dataset.n] ? " ocupado" : "")));
    };
  }

  registrarAnimacao({
    id: "grafo",
    nome: "Grafo de alocação",
    titulo: "Como um deadlock se forma no grafo",
    ideia: "A sequência de pedidos dos slides: cada pedido atendido vira uma posse, cada pedido pendente vira uma espera — até o ciclo se fechar. E a mesma carga sem deadlock, com um processo adiado.",
    modos: [{ id: "trava", rotulo: "ordem que trava" }, { id: "evitado", rotulo: "B adiado" }],
    montar, roteiro
  });
})();
