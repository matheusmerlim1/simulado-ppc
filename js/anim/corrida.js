/* ═══════════════════════════════════════════════════════════
   Cena: condição de corrida e exclusão mútua.
   Duas threads executam contador++ (LOAD, ADD, STORE) com a
   mesma intercalação azarada — sem proteção e com mutex.
   ═══════════════════════════════════════════════════════════ */
(function () {

  const INSTR = {
    sem: ["LOAD contador", "ADD 1", "STORE contador"],
    mutex: ["lock(m)", "LOAD contador", "ADD 1", "STORE contador", "unlock(m)"]
  };

  /* cada passo: o que mudou em relação ao anterior */
  const ROTEIRO = {
    sem: [
      [{}, "Duas threads vão executar <code>contador++</code> sobre a mesma variável. Em C é uma linha — mas o processador executa <b>três instruções</b>: ler, somar e gravar."],
      [{ t: 1, k: 0, r1: 0, e1: "executando" }, "<b>T1</b> executa <code>LOAD</code>: copia o contador (0) para o seu registrador."],
      [{ t: 2, k: 0, r2: 0, e1: "pronta", e2: "executando" }, "O escalonador troca de thread <b>antes</b> de T1 terminar. <b>T2</b> executa <code>LOAD</code> e também lê 0 — o valor antigo."],
      [{ t: 2, k: 1, r2: 1 }, "<b>T2</b> soma 1 no próprio registrador: 1."],
      [{ t: 2, k: 2, mem: 1, e2: "terminada" }, "<b>T2</b> grava 1 na memória e termina."],
      [{ t: 1, k: 1, r1: 1, e1: "executando" }, "<b>T1</b> volta de onde parou. O registrador dela ainda guarda o 0 que leu antes: soma 1 e obtém 1."],
      [{ t: 1, k: 2, mem: 1, e1: "terminada", alerta: true }, "<b>T1</b> grava 1 <b>por cima</b> do 1 de T2. Duas execuções de <code>contador++</code>, e o contador vale 1."],
      [{ fim: true, alerta: true }, "<b>Atualização perdida.</b> O incremento de T2 foi sobrescrito. Isso é <b>condição de corrida</b>: o resultado dependeu da ordem em que o escalonador intercalou as instruções. Com outra intercalação, daria 2 — e é por isso que o erro passa em tantos testes."]
    ],
    mutex: [
      [{}, "O mesmo cenário, agora com as três instruções entre <code>lock</code> e <code>unlock</code>. Esse trecho é a <b>região crítica</b>."],
      [{ t: 1, k: 0, dono: 1, e1: "executando" }, "<b>T1</b> chama <code>lock</code>: o mutex estava livre, e T1 passa a ser a dona."],
      [{ t: 1, k: 1, r1: 0 }, "<b>T1</b> lê o contador (0)."],
      [{ t: 2, k: 0, e1: "pronta", e2: "bloqueada", espera: true }, "O escalonador troca para <b>T2</b> no mesmo ponto azarado de antes. Mas T2 chama <code>lock</code>, encontra o mutex com T1 e <b>bloqueia</b> — sai da fila de prontos e não gasta CPU."],
      [{ t: 1, k: 2, r1: 1, e1: "executando" }, "Com T2 bloqueada, só <b>T1</b> pode avançar. Soma 1: 1."],
      [{ t: 1, k: 3, mem: 1 }, "<b>T1</b> grava 1."],
      [{ t: 1, k: 4, dono: 0, e1: "terminada", e2: "pronta", espera: false }, "<b>T1</b> destrava e termina. O mutex acorda T2, que volta à fila de prontos."],
      [{ t: 2, k: 0, dono: 2, e2: "executando" }, "<b>T2</b> finalmente adquire o mutex."],
      [{ t: 2, k: 1, r2: 1 }, "<b>T2</b> lê o contador — e agora encontra <b>1</b>, o valor já atualizado."],
      [{ t: 2, k: 2, r2: 2 }, "<b>T2</b> soma 1: 2."],
      [{ t: 2, k: 3, mem: 2 }, "<b>T2</b> grava 2."],
      [{ t: 2, k: 4, dono: 0, e2: "terminada" }, "<b>T2</b> destrava e termina."],
      [{ fim: true }, "<b>Contador = 2</b>, como esperado. O mutex não impediu a troca de contexto — impediu que T2 entrasse na região crítica enquanto T1 estava no meio dela."]
    ]
  };

  function roteiro(modo) {
    const base = {
      e1: "pronta", e2: "pronta", r1: null, r2: null, mem: 0, dono: 0,
      f1: -1, f2: -1, t: 0, k: -1, espera: false, alerta: false, fim: false
    };
    let atual = Object.assign({}, base);

    return ROTEIRO[modo].map(([delta, legenda]) => {
      const e = Object.assign({}, atual, { alerta: false, fim: false }, delta, { legenda });
      /* a instrução executada neste passo fica marcada como feita */
      if (delta.t && delta.k !== undefined && delta.e2 !== "bloqueada") {
        if (delta.t === 1) e.f1 = Math.max(e.f1, delta.k);
        else e.f2 = Math.max(e.f2, delta.k);
      }
      atual = e;
      return e;
    });
  }

  function montar(palco, modo) {
    const linhas = INSTR[modo];
    const thread = n =>
      '<div class="cor-thr" data-t="' + n + '">' +
        '<div class="cor-thr-cab"><b>T' + n + '</b><span class="cor-estado"></span></div>' +
        '<ol class="cor-instr">' + linhas.map(l => "<li><code>" + l + "</code></li>").join("") + "</ol>" +
        '<div class="cor-reg"><span class="rot">registrador</span><b>—</b></div>' +
      "</div>";

    palco.innerHTML =
      '<div class="cor-grade">' + thread(1) +
        '<div class="cor-mem">' +
          '<span class="rot">memória compartilhada</span>' +
          '<div class="cor-cel"><span>contador</span><b>0</b></div>' +
          (modo === "mutex" ? '<div class="cor-mutex"><span class="rot">mutex</span><b>livre</b></div>' : "") +
          '<div class="cor-placar"><span>esperado <b>2</b></span><span class="cor-obtido">obtido <b>—</b></span></div>' +
        "</div>" + thread(2) +
      "</div>";

    return function desenhar(e) {
      [1, 2].forEach(n => {
        const card = palco.querySelector('.cor-thr[data-t="' + n + '"]');
        const est = e["e" + n];
        card.className = "cor-thr est-" + est + (e.t === n && !e.fim ? " ativa" : "");
        card.querySelector(".cor-estado").textContent = est;
        card.querySelector(".cor-reg b").textContent = e["r" + n] === null ? "—" : e["r" + n];
        card.querySelectorAll(".cor-instr li").forEach((li, k) => {
          li.className = (k <= e["f" + n] ? "feita" : "") +
            (e.t === n && e.k === k && !e.fim ? (est === "bloqueada" ? " travou" : " agora") : "");
        });
      });

      const cel = palco.querySelector(".cor-cel");
      cel.querySelector("b").textContent = e.mem;
      cel.classList.toggle("alerta", e.alerta);

      const m = palco.querySelector(".cor-mutex");
      if (m) {
        m.querySelector("b").textContent = e.dono ? "com T" + e.dono + (e.espera ? " · T2 esperando" : "") : "livre";
        m.classList.toggle("ocupado", !!e.dono);
      }

      const obtido = palco.querySelector(".cor-obtido");
      obtido.querySelector("b").textContent = e.fim ? e.mem : "—";
      obtido.className = "cor-obtido" + (e.fim ? (e.mem === 2 ? " ok" : " err") : "");
    };
  }

  registrarAnimacao({
    id: "corrida",
    nome: "Condição de corrida",
    titulo: "Condição de corrida e exclusão mútua",
    ideia: "Duas threads executam contador++ com a mesma intercalação azarada. Sem proteção, um incremento se perde; com um mutex, a segunda espera a vez.",
    modos: [{ id: "sem", rotulo: "sem proteção" }, { id: "mutex", rotulo: "com mutex" }],
    montar, roteiro
  });
})();
