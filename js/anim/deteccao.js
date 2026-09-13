/* ═══════════════════════════════════════════════════════════
   Cena: tratar deadlock por detecção e por evitação.
     deteccao  : matrizes E, A, C, R — o exemplo da matéria
     banqueiro : um tipo de recurso, pedido negado por insegurança
   ═══════════════════════════════════════════════════════════ */
(function () {

  /* ── detecção ──────────────────────────────────────────── */
  const E = [2, 4, 4, 1];
  const C = [[1, 0, 1, 0], [1, 0, 1, 0], [0, 1, 0, 1]];
  const R = [[1, 0, 0, 0], [1, 1, 0, 1], [0, 1, 2, 0]];
  const RS = ["RS1", "RS2", "RS3", "RS4"];

  function falhasDe(linha, A) { return R[linha].map((v, j) => v > A[j] ? j : -1).filter(j => j >= 0); }

  function roteiroDeteccao() {
    const passos = [];
    let A = [0, 3, 2, 0];
    let feito = [false, false, false];
    const push = (extra, legenda) =>
      passos.push(Object.assign({ A: A.slice(), feito: feito.slice(), testa: -1, falhas: [], cabe: false, morto: false }, extra, { legenda }));

    push({}, "<b>C</b> é o que cada processo segura, <b>R</b> o que ainda pede e <b>A</b> o que está livre. A pergunta do algoritmo: no cenário mais otimista, alguém consegue terminar?");
    push({ testa: 0, falhas: falhasDe(0, A) }, "<b>P1</b> pede 1 unidade de RS1, e há 0. Não pode avançar.");
    push({ testa: 1, falhas: falhasDe(1, A) }, "<b>P2</b> também precisa de RS1 — e de RS4, que está zerado. Não pode.");
    push({ testa: 2, cabe: true }, "<b>P3</b> cabe: 0&le;0, 1&le;3, 2&le;2, 0&le;0. No melhor cenário, P3 roda até o fim.");
    A = A.map((v, j) => v + C[2][j]);
    feito[2] = true;
    push({ testa: 2 }, "P3 termina e <b>devolve</b> o que segurava, (0 1 0 1). A passa a (0 4 2 1).");
    push({ testa: 0, falhas: falhasDe(0, A) }, "Nova rodada. <b>P1</b> continua pedindo RS1, que continua em 0.");
    push({ testa: 1, falhas: falhasDe(1, A) }, "<b>P2</b> também. E nenhum processo restante vai devolver RS1 — os dois que o seguram são justamente P1 e P2.");
    push({ morto: true }, "<b>P1 e P2 estão em deadlock.</b> Isso é o tratamento por <b>detecção</b>: o sistema deixa acontecer, descobre, e agora precisa recuperar — tomar um recurso à força, voltar a um <i>checkpoint</i> ou encerrar um dos dois.");
    return passos;
  }

  /* ── banqueiro ─────────────────────────────────────────── */
  const MAXIMO = [4, 6, 8];

  function roteiroBanqueiro() {
    const passos = [];
    let posse = [1, 4, 5], livres = 2;
    const push = (extra, legenda) =>
      passos.push(Object.assign({ posse: posse.slice(), livres, testa: -1, nao: [], sim: false, negado: false, seq: [] }, extra, { legenda }));

    push({}, "Banqueiro com um tipo de recurso. Cada processo declarou quanto pode precisar no <b>máximo</b>; há <b>2 livres</b>.");
    push({ testa: 2 }, "<b>P2 pede 1.</b> Primeiro, validar: o pedido cabe na necessidade dele (1 &le; 3) e há recurso livre (1 &le; 2).");
    posse = [1, 4, 6]; livres = 1;
    push({ testa: 2, sim: true }, "O sistema <b>simula</b> a concessão: P2 fica com 6, e sobra 1 livre. Ainda não concedeu nada de verdade.");
    push({ sim: true, nao: [0, 1, 2] }, "Procura uma sequência segura: P0 precisa de 3, P1 de 2, P2 de 2 — e só há 1 livre. <b>Ninguém</b> consegue chegar ao máximo e terminar.");
    posse = [1, 4, 5]; livres = 2;
    push({ negado: true }, "<b>Estado inseguro: pedido negado.</b> A simulação é desfeita e P2 espera. Inseguro não é deadlock — é a perda da garantia, e o banqueiro recusa antes.");
    push({ testa: 1, seq: [] }, "Para comparar, o estado atual é seguro. <b>P1</b> precisa de 2 e há 2: P1 pode ir até o fim.");
    push({ testa: 1, seq: [1], livresSim: 6 }, "P1 termina e devolve seus 4 (mais os 2 que recebeu): <b>6 livres</b>.");
    push({ testa: 0, seq: [1, 0], livresSim: 7 }, "<b>P0</b> precisa de 3 &le; 6: termina e devolve 1. <b>7 livres</b>.");
    push({ testa: -1, seq: [1, 0, 2], livresSim: 12 }, "<b>P2</b> precisa de 3 &le; 7: termina. Sequência segura <b>P1 &rarr; P0 &rarr; P2</b>. Isso é tratamento por <b>evitação</b>: cada pedido só é atendido se o sistema continuar num estado assim.");
    return passos;
  }

  function roteiro(modo) { return modo === "banqueiro" ? roteiroBanqueiro() : roteiroDeteccao(); }

  /* ── desenho ───────────────────────────────────────────── */
  function montar(palco, modo) {
    if (modo === "banqueiro") {
      palco.innerHTML =
        '<div class="det-wrap"><table class="det-tab">' +
          "<thead><tr><th></th><th>posse</th><th>máximo</th><th>precisa</th><th></th></tr></thead><tbody>" +
          [0, 1, 2].map(p => '<tr data-p="' + p + '"><th>P' + p + '</th><td class="po"></td><td>' + MAXIMO[p] +
            '</td><td class="ne"></td><td class="st"></td></tr>').join("") +
          "</tbody></table>" +
          '<div class="det-vetor"><span class="rot">livres</span><b class="det-livres"></b><span class="det-tag"></span></div>' +
          '<div class="det-seq"><span class="rot">sequência segura</span><b></b></div></div>';

      return function desenhar(e) {
        palco.querySelectorAll("tbody tr").forEach(tr => {
          const p = +tr.dataset.p;
          tr.querySelector(".po").textContent = e.posse[p];
          tr.querySelector(".ne").textContent = MAXIMO[p] - e.posse[p];
          tr.querySelector(".ne").className = "ne" + (e.nao.includes(p) ? " falha" : "");
          const pronto = e.seq.includes(p);
          tr.querySelector(".st").textContent = pronto ? "terminou" : "";
          tr.className = (e.testa === p ? "testa" : "") + (pronto ? " feito" : "");
        });
        palco.querySelector(".det-livres").textContent = e.livresSim !== undefined ? e.livresSim : e.livres;
        const tag = palco.querySelector(".det-tag");
        tag.textContent = e.negado ? "pedido negado" : e.sim ? "simulação" : e.livresSim !== undefined ? "simulando o futuro" : "";
        tag.className = "det-tag" + (e.negado ? " err" : e.sim || e.livresSim !== undefined ? " sim" : "");
        palco.querySelector(".det-seq b").textContent = e.seq.length ? e.seq.map(p => "P" + p).join(" → ") : "—";
      };
    }

    const cab = "<tr><th></th>" + RS.map(r => "<th>" + r + "</th>").join("") + "</tr>";
    const corpo = (M, cls) => [0, 1, 2].map(p =>
      '<tr data-p="' + p + '"><th>P' + (p + 1) + "</th>" +
      M[p].map((v, j) => '<td class="' + cls + '" data-j="' + j + '">' + v + "</td>").join("") + "</tr>").join("");

    palco.innerHTML =
      '<div class="det-wrap">' +
        '<div class="det-mats">' +
          '<div><span class="rot">C · alocação corrente</span><table class="det-tab det-c"><thead>' + cab + "</thead><tbody>" + corpo(C, "c") + "</tbody></table></div>" +
          '<div><span class="rot">R · requisições</span><table class="det-tab det-r"><thead>' + cab + "</thead><tbody>" + corpo(R, "r") + "</tbody></table></div>" +
        "</div>" +
        '<div class="det-vetores">' +
          '<div class="det-vetor"><span class="rot">E · existentes</span><b>(' + E.join(" ") + ")</b></div>" +
          '<div class="det-vetor"><span class="rot">A · disponíveis</span><b class="det-a"></b></div>' +
        "</div></div>";

    return function desenhar(e) {
      palco.querySelector(".det-a").textContent = "(" + e.A.join(" ") + ")";
      palco.querySelectorAll(".det-tab tbody tr").forEach(tr => {
        const p = +tr.dataset.p;
        tr.className = (e.testa === p ? "testa" : "") + (e.feito[p] ? " feito" : "") +
                       (e.morto && !e.feito[p] ? " morto" : "");
      });
      palco.querySelectorAll(".det-r td").forEach(td => {
        const p = +td.parentNode.dataset.p, j = +td.dataset.j;
        const testando = e.testa === p;
        td.className = "r" + (testando && e.falhas.includes(j) ? " falha" : "") +
                       (testando && e.cabe ? " cabe" : "");
      });
    };
  }

  registrarAnimacao({
    id: "deteccao",
    nome: "Detecção e banqueiro",
    titulo: "Tratar deadlock: detectar ou evitar",
    ideia: "Duas estratégias com a mesma pergunta — alguém consegue terminar? A detecção faz a pergunta depois do fato; o banqueiro, antes de cada pedido.",
    modos: [{ id: "deteccao", rotulo: "detecção" }, { id: "banqueiro", rotulo: "banqueiro" }],
    montar, roteiro
  });
})();
