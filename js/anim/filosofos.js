/* ═══════════════════════════════════════════════════════════
   Cena: jantar dos filósofos — deadlock e dois tratamentos.
   O filósofo i usa os garfos i e (i+1) % 5.
     ingenua : pega i, depois i+1                  (trava)
     ordem   : pega o de menor número primeiro     (quebra espera circular)
     dois    : pega os dois de uma vez ou nenhum   (quebra posse-e-espera)
   ═══════════════════════════════════════════════════════════ */
(function () {

  const N = 5;
  const garfosDe = i => [i, (i + 1) % N];

  function ordemDe(modo, i) {
    const [a, b] = garfosDe(i);
    return modo === "ordem" ? [Math.min(a, b), Math.max(a, b)] : [a, b];
  }

  /* ── simulador ─────────────────────────────────────────── */
  function novoEstado() {
    return { dono: Array(N).fill(null), est: Array(N).fill("pensando"), espera: Array(N).fill(null), ciclo: false };
  }
  const clonar = s => ({ dono: s.dono.slice(), est: s.est.slice(), espera: s.espera.slice(), ciclo: s.ciclo });

  /* um passo do filósofo f: pede o próximo garfo que ainda não tem */
  function avancar(s, modo, f) {
    const g = ordemDe(modo, f).find(x => s.dono[x] !== f);
    if (g === undefined) { s.est[f] = "comendo"; s.espera[f] = null; return; }
    if (s.dono[g] !== null) { s.est[f] = "esperando"; s.espera[f] = g; return; }

    s.dono[g] = f;
    s.espera[f] = null;
    s.est[f] = garfosDe(f).every(x => s.dono[x] === f) ? "comendo" : "segurando";
  }

  function podeComer(s, f) { return garfosDe(f).every(g => s.dono[g] === null); }

  function aplicar(s, modo, [acao, f]) {
    if (acao === "pega") avancar(s, modo, f);

    if (acao === "larga") {
      const soltos = garfosDe(f);
      soltos.forEach(g => { s.dono[g] = null; });
      s.est[f] = "pensando";
      /* quem dormia esperando um desses garfos acorda e segue */
      soltos.forEach(g => {
        const quem = s.espera.findIndex(x => x === g);
        if (quem >= 0) {
          s.espera[quem] = null;
          avancar(s, modo, quem);                          /* pega o garfo que esperava */
          while (s.est[quem] === "segurando") avancar(s, modo, quem);   /* e segue */
        }
      });
    }

    if (acao === "testa") {
      if (podeComer(s, f)) { garfosDe(f).forEach(g => { s.dono[g] = f; }); s.est[f] = "comendo"; s.espera[f] = null; }
      else { s.est[f] = "esperando"; s.espera[f] = "ambos"; }
    }

    if (acao === "larga2") {
      garfosDe(f).forEach(g => { s.dono[g] = null; });
      s.est[f] = "pensando";
      [(f + N - 1) % N, (f + 1) % N].forEach(v => {
        if (s.est[v] === "esperando" && podeComer(s, v)) aplicar(s, modo, ["testa", v]);
      });
    }

    /* espera circular: todos esperando um garfo que outro segura */
    s.ciclo = s.est.every(e => e === "esperando") && s.espera.every(g => g !== null && g !== "ambos");
  }

  const ROTEIRO = {
    ingenua: [
      [[], "Cada filósofo é uma thread. Para comer, pega o garfo <b>i</b> e depois o <b>i+1</b> — um de cada vez."],
      [[["pega", 0]], "F0 pega o garfo 0. O escalonador troca de thread."],
      [[["pega", 1]], "F1 pega o garfo 1."],
      [[["pega", 2]], "F2 pega o garfo 2."],
      [[["pega", 3]], "F3 pega o garfo 3."],
      [[["pega", 4]], "F4 pega o garfo 4. Todos os garfos saíram da mesa: cada filósofo tem exatamente um."],
      [[["pega", 0]], "F0 tenta o garfo 1: está com F1. F0 <b>bloqueia segurando o garfo 0</b>."],
      [[["pega", 1], ["pega", 2], ["pega", 3]], "F1, F2 e F3 fazem o mesmo: cada um espera o garfo do vizinho, sem soltar o seu."],
      [[["pega", 4]], "F4 tenta o garfo 0, que está com F0. O ciclo fecha: <b>F0 &rarr; F1 &rarr; F2 &rarr; F3 &rarr; F4 &rarr; F0</b>. Deadlock."],
      [[], "É a sequência exata dos slides. As quatro condições de Coffman valem juntas: cada garfo é exclusivo, todos seguram um e pedem outro, ninguém toma garfo à força e a espera é circular."]
    ],
    ordem: [
      [[], "Mesma mesa, uma regra nova: cada filósofo pega primeiro o garfo de <b>menor número</b>. Para F0 a F3 nada muda. F4, que usa os garfos 4 e 0, passa a pegar o <b>0</b> primeiro."],
      [[["pega", 0]], "F0 pega o garfo 0."],
      [[["pega", 1], ["pega", 2], ["pega", 3]], "F1, F2 e F3 pegam os garfos 1, 2 e 3 — a mesma sequência que travou antes."],
      [[["pega", 4]], "F4 tenta primeiro o garfo 0, que está com F0. F4 bloqueia, mas <b>de mãos vazias</b>: o garfo 4 continua na mesa."],
      [[["pega", 0], ["pega", 1], ["pega", 2]], "F0, F1 e F2 tentam o segundo garfo e bloqueiam, cada um esperando o do vizinho."],
      [[["pega", 3]], "F3 tenta o garfo 4: <b>livre</b>. F3 come. O ciclo não fechou porque F4 não segura nada."],
      [[["larga", 3]], "F3 devolve os garfos 3 e 4. F2, que esperava o 3, pega e come."],
      [[["larga", 2]], "F2 devolve 2 e 3: F1 come."],
      [[["larga", 1]], "F1 devolve 1 e 2: F0 come."],
      [[["larga", 0]], "F0 devolve 0 e 1. F4 finalmente pega o 0, depois o 4, e come."],
      [[["larga", 4]], "Todos comeram. Basta um filósofo pegando na ordem inversa — o &ldquo;canhoto&rdquo; — para <b>quebrar a espera circular</b>: com uma ordem global dos garfos, o ciclo não tem como fechar."]
    ],
    dois: [
      [[], "Agora cada filósofo só pega garfos se os <b>dois</b> estiverem livres, testando sob um mutex. Senão, espera sem pegar nenhum."],
      [[["testa", 0]], "F0 testa os garfos 0 e 1: livres. Pega os dois e come."],
      [[["testa", 1]], "F1 testa: o garfo 1 está com F0. F1 espera — <b>sem pegar nenhum</b>."],
      [[["testa", 2]], "F2 testa os garfos 2 e 3: livres. F2 come junto com F0 — dois filósofos não vizinhos comendo ao mesmo tempo."],
      [[["testa", 3], ["testa", 4]], "F3 precisa do 3 (com F2) e F4 precisa do 0 (com F0). Os dois esperam de mãos vazias."],
      [[["larga2", 0]], "F0 devolve os garfos e testa os vizinhos: F4 encontra 4 e 0 livres e come; F1 ainda não, porque o 2 está com F2."],
      [[["larga2", 2]], "F2 devolve 2 e 3. F1 encontra 1 e 2 livres e come; F3 ainda espera o 4, que está com F4."],
      [[["larga2", 4]], "F4 devolve 4 e 0. F3 encontra 3 e 4 livres e come."],
      [[["larga2", 1], ["larga2", 3]], "Ninguém travou e ninguém segurou garfo sozinho: a <b>posse-e-espera</b> nunca acontece. É a solução de <code>take_forks</code>/<code>test</code> — que ainda pode deixar alguém com fome, se os vizinhos se revezarem."]
    ]
  };

  const COFFMAN = [
    ["exclusao", "Exclusão mútua", "cada garfo com um só filósofo"],
    ["posse", "Posse e espera", "segura um e pede outro"],
    ["preempcao", "Não-preempção", "ninguém toma garfo à força"],
    ["circular", "Espera circular", "F0 → F1 → … → F0"]
  ];
  const QUEBRADA = { ordem: "circular", dois: "posse" };

  function roteiro(modo) {
    let s = novoEstado();
    return ROTEIRO[modo].map(([acoes, legenda]) => {
      s = clonar(s);
      acoes.forEach(a => aplicar(s, modo, a));
      return Object.assign(clonar(s), { legenda });
    });
  }

  function montar(palco, modo) {
    const C = 150;
    const pos = (graus, r) => {
      const rad = (graus - 90) * Math.PI / 180;
      return [C + r * Math.cos(rad), C + r * Math.sin(rad)];
    };

    let svg = '<svg class="fil-mesa" viewBox="0 0 300 300" role="img" aria-label="Mesa com cinco filósofos e cinco garfos">' +
      '<circle class="fil-tampo" cx="150" cy="150" r="72"></circle>';
    for (let g = 0; g < N; g++)
      svg += '<g class="fil-garfo" data-g="' + g + '"><line x1="0" y1="-11" x2="0" y2="11"></line>' +
             '<text x="0" y="-15">' + g + "</text></g>";
    for (let i = 0; i < N; i++) {
      const [x, y] = pos(i * 72, 122);
      svg += '<g class="fil-pessoa" data-f="' + i + '">' +
        '<circle cx="' + x + '" cy="' + y + '" r="21"></circle>' +
        '<text class="fil-nome" x="' + x + '" y="' + (y + 1) + '">F' + i + "</text>" +
        '<text class="fil-esp" x="' + x + '" y="' + (y + (y > C ? 36 : -30)) + '"></text></g>';
    }
    svg += "</svg>";

    const coff = '<ul class="fil-coffman"><li class="cab">Condições de Coffman</li>' +
      COFFMAN.map(([id, nome, dica]) =>
        '<li data-c="' + id + '"><b>' + nome + "</b><span>" + dica + "</span><i></i></li>").join("") +
      "</ul>";

    palco.innerHTML = '<div class="fil-grade">' + svg + coff + "</div>";

    return function desenhar(e) {
      palco.querySelectorAll(".fil-garfo").forEach(el => {
        const g = +el.dataset.g;
        const dono = e.dono[g];
        let ang = g * 72 - 36;
        let r = 58;
        if (dono !== null) { ang += dono === g ? 24 : -24; r = 92; }
        const [x, y] = pos(ang, r);
        el.style.transform = "translate(" + x + "px, " + y + "px)";
        el.querySelector("line").setAttribute("transform", "rotate(" + ang + ")");
        el.classList.toggle("preso", dono !== null);
        el.classList.toggle("ciclo", e.ciclo);
      });

      palco.querySelectorAll(".fil-pessoa").forEach(el => {
        const f = +el.dataset.f;
        el.setAttribute("class", "fil-pessoa est-" + e.est[f] + (e.ciclo ? " ciclo" : ""));
        const esp = e.espera[f];
        el.querySelector(".fil-esp").textContent =
          e.est[f] === "comendo" ? "comendo" :
          esp === "ambos" ? "espera 2" :
          esp !== null ? "espera G" + esp : "";
      });

      palco.querySelectorAll(".fil-coffman li[data-c]").forEach(li => {
        const quebrada = QUEBRADA[modo] === li.dataset.c;
        const ativa = li.dataset.c !== "circular" || e.ciclo;
        li.className = quebrada ? "quebrada" : e.ciclo ? "vale" : ativa ? "" : "ainda";
        li.querySelector("i").textContent = quebrada ? "quebrada" : e.ciclo ? "vale" : ativa ? "vale" : "não fechou";
      });
    };
  }

  registrarAnimacao({
    id: "filosofos",
    nome: "Jantar dos filósofos",
    titulo: "Jantar dos filósofos: deadlock e tratamento",
    ideia: "Cinco filósofos, cinco garfos. A versão ingênua trava; as duas correções atacam condições diferentes de Coffman.",
    modos: [
      { id: "ingenua", rotulo: "ingênua" },
      { id: "ordem", rotulo: "garfos em ordem" },
      { id: "dois", rotulo: "dois de uma vez" }
    ],
    montar, roteiro
  });
})();
