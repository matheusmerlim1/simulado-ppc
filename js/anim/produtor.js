/* ═══════════════════════════════════════════════════════════
   Cena: produtor-consumidor com semáforos.
   Buffer de 3 posições. Na ordem certa ninguém trava; com as duas
   primeiras linhas do produtor invertidas, o buffer cheio vira deadlock.
   ═══════════════════════════════════════════════════════════ */
(function () {

  const CODIGO = {
    certa: ["sem_wait(&vazios);", "sem_wait(&mutex);", "inserir(item);", "sem_post(&mutex);", "sem_post(&cheios);"],
    invertida: ["sem_wait(&mutex);", "sem_wait(&vazios);", "inserir(item);", "sem_post(&mutex);", "sem_post(&cheios);"],
    consumidor: ["sem_wait(&cheios);", "sem_wait(&mutex);", "retirar();", "sem_post(&mutex);", "sem_post(&vazios);"]
  };

  /* pl / cl = linha de código em destaque no produtor / consumidor (-1 = nenhuma) */
  const ROTEIRO = {
    certa: [
      [{}, "Um buffer de 3 lugares. <code>vazios</code> = 3 conta os lugares livres, <code>cheios</code> = 0 conta os itens prontos e <code>mutex</code> = 1 protege o buffer."],
      [{ pl: 1, pe: "executando", vazios: 2, mutex: 0 }, "O <b>produtor</b> reserva um lugar (<code>vazios</code> 3&rarr;2) e trava o buffer (<code>mutex</code> 1&rarr;0)."],
      [{ pl: 4, buf: [1], mutex: 1, cheios: 1 }, "Insere o item 1, destrava o buffer e avisa que há um item pronto (<code>cheios</code> 0&rarr;1)."],
      [{ pl: 4, buf: [1, 2], vazios: 1, cheios: 2 }, "O produtor é mais rápido e produz de novo: item 2. <code>vazios</code> = 1, <code>cheios</code> = 2."],
      [{ pl: 4, buf: [1, 2, 3], vazios: 0, cheios: 3 }, "Item 3. O buffer encheu: <code>vazios</code> = 0."],
      [{ pl: 0, pe: "bloqueado", fv: "produtor" }, "O produtor faz o item 4 e chama <code>sem_wait(&vazios)</code>. Vale 0: não há lugar, e ele <b>dorme</b>. Repare que bloqueou <b>antes</b> de pegar o mutex — o buffer continua livre."],
      [{ cl: 1, ce: "executando", cheios: 2, mutex: 0 }, "O <b>consumidor</b> chega: há item pronto (<code>cheios</code> 3&rarr;2) e o buffer está livre, então ele o trava."],
      [{ cl: 3, buf: [2, 3], mutex: 1 }, "Retira o item 1 e destrava o buffer."],
      [{ cl: 4, ce: "pensando", pl: 0, pe: "executando", fv: "" }, "Avisa que abriu um lugar: <code>sem_post(&vazios)</code>. Havia alguém dormindo nesse semáforo — o <b>produtor é acordado</b> e passa do <code>sem_wait</code>."],
      [{ pl: 4, cl: -1, buf: [2, 3, 4], mutex: 1, cheios: 3, pe: "pensando" }, "O produtor trava o buffer, insere o item 4 no lugar liberado e avisa: <code>cheios</code> = 3."],
      [{ pl: -1, fim: true }, "Nenhum item se perdeu e ninguém girou em espera ocupada: quem não podia seguir <b>dormiu no semáforo certo</b>. Os semáforos de contagem vêm por fora; o mutex, por dentro."]
    ],
    invertida: [
      [{}, "O mesmo buffer, com um erro no produtor: ele trava o <code>mutex</code> <b>antes</b> de verificar se há lugar."],
      [{ pl: 4, buf: [1, 2, 3], vazios: 0, cheios: 3 }, "O produtor faz os itens 1, 2 e 3 normalmente. Enquanto há lugar, a ordem das duas linhas não faz diferença nenhuma."],
      [{ pl: 0, pe: "executando", mutex: 0, dono: "produtor" }, "Item 4. O produtor trava o buffer primeiro: <code>mutex</code> 1&rarr;0."],
      [{ pl: 1, pe: "bloqueado", fv: "produtor" }, "Só agora verifica o lugar: <code>vazios</code> = 0, e o produtor dorme. Mas dorme <b>com o mutex na mão</b>."],
      [{ cl: 0, ce: "executando", cheios: 2 }, "O <b>consumidor</b> chega: há itens prontos (<code>cheios</code> 3&rarr;2)."],
      [{ cl: 1, ce: "bloqueado", fm: "consumidor", morto: true }, "Tenta travar o buffer para retirar um item. O mutex está com o produtor, que está dormindo. O consumidor <b>bloqueia</b>."],
      [{ fim: true, morto: true }, "<b>Deadlock.</b> O produtor espera um lugar que só o consumidor pode abrir; o consumidor espera o mutex que só o produtor pode soltar. É a regra que atravessa a disciplina: <b>nunca bloqueie segurando uma trava de que outro precisa para te liberar</b>."]
    ]
  };

  function roteiro(modo) {
    let atual = {
      vazios: 3, cheios: 0, mutex: 1, buf: [], dono: "",
      pl: -1, pe: "pensando", cl: -1, ce: "pensando",
      fv: "", fm: "", morto: false, fim: false
    };
    return ROTEIRO[modo].map(([delta, legenda]) => {
      atual = Object.assign({}, atual, { fim: false }, delta, { legenda });
      return atual;
    });
  }

  function montar(palco, modo) {
    const lado = (quem, rotulo, linhas) =>
      '<div class="pc-thr" data-quem="' + quem + '">' +
        '<div class="cor-thr-cab"><b>' + rotulo + '</b><span class="cor-estado"></span></div>' +
        '<ol class="cor-instr">' + linhas.map(l => "<li><code>" + l + "</code></li>").join("") + "</ol>" +
      "</div>";

    const sem = (nome, inicial) =>
      '<div class="pc-sem" data-sem="' + nome + '"><span class="rot">' + nome + '</span><b>' + inicial +
      '</b><span class="pc-fila"></span></div>';

    palco.innerHTML =
      '<div class="pc-grade">' +
        lado("produtor", "Produtor", CODIGO[modo]) +
        '<div class="pc-meio">' +
          '<span class="rot">buffer (3 lugares)</span>' +
          '<div class="pc-buffer"><i></i><i></i><i></i></div>' +
          '<div class="pc-sems">' + sem("vazios", 3) + sem("cheios", 0) + sem("mutex", 1) + "</div>" +
        "</div>" +
        lado("consumidor", "Consumidor", CODIGO.consumidor) +
      "</div>";

    return function desenhar(e) {
      [["produtor", e.pl, e.pe], ["consumidor", e.cl, e.ce]].forEach(([quem, linha, est]) => {
        const card = palco.querySelector('.pc-thr[data-quem="' + quem + '"]');
        card.className = "pc-thr est-" + est + (e.morto && est === "bloqueado" ? " morto" : "");
        card.querySelector(".cor-estado").textContent = est;
        card.querySelectorAll(".cor-instr li").forEach((li, k) =>
          li.className = k === linha ? (est === "bloqueado" ? "travou" : "agora") : "");
      });

      palco.querySelectorAll(".pc-buffer i").forEach((slot, k) => {
        slot.textContent = e.buf[k] !== undefined ? e.buf[k] : "";
        slot.className = e.buf[k] !== undefined ? "cheio" : "";
      });

      const filas = { vazios: e.fv, cheios: "", mutex: e.fm };
      ["vazios", "cheios", "mutex"].forEach(nome => {
        const s = palco.querySelector('.pc-sem[data-sem="' + nome + '"]');
        s.querySelector("b").textContent = e[nome];
        s.querySelector(".pc-fila").textContent =
          (nome === "mutex" && e.dono && e.mutex === 0 ? "com " + e.dono : "") +
          (filas[nome] ? (nome === "mutex" && e.dono ? " · " : "") + "dormindo: " + filas[nome] : "");
        s.classList.toggle("zero", e[nome] === 0);
        s.classList.toggle("morto", e.morto && !!filas[nome]);
      });
    };
  }

  registrarAnimacao({
    id: "produtor",
    nome: "Produtor-consumidor",
    titulo: "Produtor-consumidor com semáforos",
    ideia: "Os semáforos contam lugares livres e itens prontos; o mutex protege o buffer. A ordem em que o produtor os pede decide se o sistema flui ou trava.",
    modos: [{ id: "certa", rotulo: "ordem certa" }, { id: "invertida", rotulo: "ordem invertida" }],
    montar, roteiro
  });
})();
