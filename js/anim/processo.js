/* ═══════════════════════════════════════════════════════════
   Cena: o processo por dentro.
     fork    : fork() retorna duas vezes, cópia na escrita, wait e zumbi
     estados : novo, pronto, executando, bloqueado e terminado
   ═══════════════════════════════════════════════════════════ */
(function () {

  /* ── fork() e wait() ───────────────────────────────────── */
  const CODIGO = [
    "int x = 10;",
    "pid_t pid = fork();",
    "if (pid == 0) {",
    "    x = 100;          /* filho */",
    "    exit(0);",
    "} else {",
    "    wait(NULL);       /* pai */",
    "    printf(\"x = %d\\n\", x);",
    "}"
  ];

  const ROTEIRO_FORK = [
    [{}, "Um único processo, o <b>pai</b> (PID 1234), começa a executar o programa."],
    [{ pl: 0, pe: "executando", px: 10 }, "O pai cria <code>x = 10</code> na sua memória."],
    [{ pl: 1, fe: "pronto", fx: 10, ppid: 1235, fpid: 0, pagina: "compartilhada" },
     "<code>fork()</code> cria o <b>filho</b> (PID 1235) como cópia do pai — e <b>retorna duas vezes</b>: no pai devolve 1235, no filho devolve 0. As páginas de memória ainda são as mesmas; só serão copiadas quando alguém escrever."],
    [{ pl: 6, pe: "bloqueado" },
     "No pai, <code>pid</code> vale 1235: o <code>if</code> é falso e ele vai para o <code>else</code>. Chama <code>wait(NULL)</code> e, como nenhum filho terminou, <b>bloqueia</b> — sai da CPU."],
    [{ fl: 2, fe: "executando" }, "O escalonador põe o filho para rodar. Nele, <code>pid</code> vale 0: o <code>if</code> é verdadeiro."],
    [{ fl: 3, fx: 100, pagina: "copiada" },
     "O filho escreve em <code>x</code>. <b>Só agora a página é copiada</b> (<i>copy-on-write</i>): o filho passa a ter a sua própria <code>x = 100</code>, e a do pai continua 10. Depois do <code>fork</code> não existe memória compartilhada."],
    [{ fl: 4, fe: "zumbi" },
     "O filho termina com <code>exit(0)</code> e vira <b>zumbi</b>: já não executa, mas guarda o código de saída até o pai recolhê-lo."],
    [{ fl: -1, fe: "recolhido", pl: 6, pe: "executando" },
     "O pai é acordado: <code>wait</code> devolve e <b>recolhe</b> o filho, que sai da tabela de processos."],
    [{ pl: 7, saida: "x = 10" }, "O pai imprime <code>x = 10</code>. A mudança do filho aconteceu na cópia dele."],
    [{ pl: -1, pe: "terminado", fim: true },
     "<code>fork</code> devolve duas vezes; a memória é copiada só na escrita; <code>wait</code> bloqueia o pai e recolhe o filho. Sem o <code>wait</code>, o filho ficaria zumbi — e, se o pai terminasse antes, o filho viraria <b>órfão</b>, adotado pelo <code>init</code>."]
  ];

  /* ── estados do processo ───────────────────────────────── */
  const CAIXAS = {
    novo:       [10, 30, 110],
    pronto:     [190, 30, 110],
    executando: [370, 30, 120],
    terminado:  [560, 30, 100],
    bloqueado:  [280, 170, 120]
  };

  const SETAS = {
    admitir:   ["M120 60 L186 60", 153, 50, "admitido"],
    despachar: ["M300 48 L366 48", 333, 40, "despacho"],
    preempcao: ["M370 74 L304 74", 337, 92, "fim da fatia"],
    sair:      ["M490 60 L556 60", 523, 50, "exit"],
    esperaES:  ["M440 90 C440 140 420 180 404 196", 468, 150, "pede E/S"],
    fimES:     ["M280 196 C250 180 240 140 244 94", 206, 150, "E/S concluída"]
  };

  const ROTEIRO_ESTADOS = [
    [{}, "O ciclo de vida de um processo. Dois processos, <b>P</b> e <b>Q</b>, vão percorrê-lo num único núcleo."],
    [{ P: "pronto", seta: "admitir" }, "P é criado e <b>admitido</b>: vai para a fila de prontos. Pronto quer dizer que só falta a CPU."],
    [{ Q: "pronto", seta: "admitir" }, "Q também é admitido e entra na fila, atrás de P."],
    [{ P: "executando", seta: "despachar" }, "O escalonador <b>despacha</b> P: ele ganha a CPU."],
    [{ P: "pronto", Q: "executando", seta: "preempcao" },
     "A fatia de tempo de P acabou (Round Robin): <b>preempção</b>. P volta para a fila de prontos e Q é despachado."],
    [{ Q: "bloqueado", P: "executando", seta: "esperaES" },
     "Q pede uma leitura de disco. Não adianta segurar a CPU esperando: Q vai para <b>bloqueado</b>, e P volta a executar."],
    [{ Q: "pronto", seta: "fimES" },
     "O disco termina e gera uma interrupção. Q <b>não</b> volta direto para a CPU: vai para pronto e espera a vez."],
    [{ P: "terminado", Q: "executando", seta: "sair" }, "P chega ao fim com <code>exit</code>. Q é despachado."],
    [{ Q: "terminado", seta: "sair" }, "Q também termina."],
    [{ seta: "", fim: true },
     "Só existe um caminho para a CPU: <b>a partir de pronto</b>. Bloqueado nunca vai direto para executando — é o erro mais comum nos diagramas de prova. E um processo bloqueado não gasta CPU nenhuma, ao contrário da espera ocupada."]
  ];

  function roteiro(modo) {
    if (modo === "estados") {
      let atual = { P: "novo", Q: "novo", seta: "", fim: false };
      return ROTEIRO_ESTADOS.map(([delta, legenda]) =>
        (atual = Object.assign({}, atual, { fim: false }, delta, { legenda })));
    }
    let atual = {
      pl: -1, pe: "executando", px: null, ppid: null,
      fl: -1, fe: "", fx: null, fpid: null,
      pagina: "", saida: "", fim: false
    };
    return ROTEIRO_FORK.map(([delta, legenda]) =>
      (atual = Object.assign({}, atual, { fim: false }, delta, { legenda })));
  }

  /* ── desenho ───────────────────────────────────────────── */
  function montarFork(palco) {
    const proc = (quem, nome, pid) =>
      '<div class="proc-card" data-quem="' + quem + '">' +
        '<div class="cor-thr-cab"><b>' + nome + ' <span class="rot">PID ' + pid + '</span></b><span class="cor-estado"></span></div>' +
        '<div class="proc-vars">' +
          '<span class="rot">pid</span><b class="v-pid">—</b>' +
          '<span class="rot">x</span><b class="v-x">—</b>' +
        "</div>" +
        '<div class="proc-pagina"></div>' +
      "</div>";

    palco.innerHTML =
      '<div class="proc-grade">' +
        '<ol class="cor-instr proc-cod">' + CODIGO.map(l => "<li><code>" + l.replace(/</g, "&lt;") + "</code></li>").join("") + "</ol>" +
        '<div class="proc-lado">' + proc("pai", "Pai", 1234) + proc("filho", "Filho", 1235) +
          '<div class="proc-saida"><span class="rot">saída</span><b>—</b></div>' +
        "</div>" +
      "</div>";

    return function desenhar(e) {
      palco.querySelectorAll(".proc-cod li").forEach((li, k) => {
        const doPai = k === e.pl, doFilho = k === e.fl;
        li.className = (doPai || doFilho) ? (doPai && e.pe === "bloqueado" ? "travou" : "agora") : "";
        li.dataset.quem = doPai && doFilho ? "ambos" : doPai ? "pai" : doFilho ? "filho" : "";
      });

      [["pai", e.pe, e.ppid, e.px], ["filho", e.fe, e.fpid, e.fx]].forEach(([quem, est, pid, x]) => {
        const card = palco.querySelector('.proc-card[data-quem="' + quem + '"]');
        card.className = "proc-card est-" + (est || "inexistente");
        card.querySelector(".cor-estado").textContent = est || "ainda não existe";
        card.querySelector(".v-pid").textContent = pid === null ? "—" : pid;
        card.querySelector(".v-x").textContent = x === null ? "—" : x;
        const pag = card.querySelector(".proc-pagina");
        pag.textContent = !e.pagina || est === "recolhido" ? "" :
          e.pagina === "compartilhada" ? "página de x: compartilhada (só leitura)" :
          "página de x: cópia própria";
        pag.className = "proc-pagina" + (e.pagina === "copiada" ? " copiada" : "");
      });

      const saida = palco.querySelector(".proc-saida b");
      saida.textContent = e.saida || "—";
    };
  }

  function montarEstados(palco) {
    let svg = '<svg class="est-mapa" viewBox="0 0 670 250" role="img" aria-label="Diagrama de estados do processo">' +
      '<defs><marker id="seta-est" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M0 0 L10 5 L0 10 z"></path></marker></defs>';

    Object.keys(SETAS).forEach(id => {
      const [d, lx, ly, rotulo] = SETAS[id];
      svg += '<g class="est-seta" data-s="' + id + '"><path d="' + d + '" marker-end="url(#seta-est)"></path>' +
             '<text x="' + lx + '" y="' + ly + '">' + rotulo + "</text></g>";
    });
    Object.keys(CAIXAS).forEach(nome => {
      const [x, y, w] = CAIXAS[nome];
      svg += '<g class="est-caixa" data-e="' + nome + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="60" rx="10"></rect>' +
             '<text x="' + (x + w / 2) + '" y="' + (y + 21) + '">' + nome + "</text></g>";
    });
    ["P", "Q"].forEach(id =>
      svg += '<g class="est-token tok-' + id + '" data-p="' + id + '"><circle r="12"></circle><text y="1">' + id + "</text></g>");
    svg += "</svg>";
    palco.innerHTML = svg;

    return function desenhar(e) {
      ["P", "Q"].forEach((id, k) => {
        const [x, y, w] = CAIXAS[e[id]];
        const g = palco.querySelector('.est-token[data-p="' + id + '"]');
        g.style.transform = "translate(" + (x + w / 2 + (k ? 16 : -16)) + "px, " + (y + 42) + "px)";
      });
      palco.querySelectorAll(".est-seta").forEach(s =>
        s.classList.toggle("ativa", s.dataset.s === e.seta));
      palco.querySelectorAll(".est-caixa").forEach(c => {
        const ocupado = e.P === c.dataset.e || e.Q === c.dataset.e;
        c.classList.toggle("ocupada", ocupado && c.dataset.e !== "novo");
      });
    };
  }

  registrarAnimacao({
    id: "processo",
    nome: "Processos: fork e estados",
    titulo: "O processo por dentro",
    ideia: "Como fork() cria um segundo processo, por que o filho não enxerga as mudanças do pai, e por quais estados um processo passa até terminar.",
    modos: [{ id: "fork", rotulo: "fork() e wait()" }, { id: "estados", rotulo: "estados do processo" }],
    montar: (palco, modo) => modo === "estados" ? montarEstados(palco) : montarFork(palco),
    roteiro
  });
})();
