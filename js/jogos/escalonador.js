/* ═══════════════════════════════════════════════════════════
   JOGO 3 — Escolha o schedule (aulas 08 e 09)

   Um laço de 24 iterações com custos diferentes vai para 4 threads.
   O jogador escolhe a política de distribuição; o jogo mostra o
   Gantt, o tempo total e o fator de balanceamento, e compara com
   todas as outras políticas.

   Cada pedaço entregue em tempo de execução (dynamic e guided) custa
   uma ida à fila compartilhada — é por isso que dynamic,1 equilibra
   lindamente e mesmo assim costuma perder.
   ═══════════════════════════════════════════════════════════ */

const ESC_ITERACOES = 24;
const ESC_THREADS = 4;
const ESC_CUSTO_FILA = 0.6;      /* custo de pegar um pedaço na fila */

const ESC_POLITICAS = [
  { id: "static",   rotulo: "static",    tipo: "static",  chunk: 0 },
  { id: "static2",  rotulo: "static,2",  tipo: "static",  chunk: 2 },
  { id: "dyn4",     rotulo: "dynamic,4", tipo: "dynamic", chunk: 4 },
  { id: "dyn1",     rotulo: "dynamic,1", tipo: "dynamic", chunk: 1 },
  { id: "guided",   rotulo: "guided",    tipo: "guided",  chunk: 1 }
];

/* ── lógica pura (testável, sem DOM) ─────────────────────── */

/* A lista de pedaços (início, fim) que cada política produz. */
function pedacosDe(n, p, tipo, chunk) {
  const lista = [];

  if (tipo === "static" && !chunk) {          /* blocos contíguos iguais */
    const base = Math.floor(n / p), resto = n % p;
    let i = 0;
    for (let t = 0; t < p; t++) {
      const tam = base + (t < resto ? 1 : 0);
      if (tam) lista.push([i, i + tam]);
      i += tam;
    }
    return lista;
  }

  if (tipo === "guided") {                    /* pedaços que vão encolhendo */
    let i = 0;
    while (i < n) {
      const tam = Math.max(chunk, Math.ceil((n - i) / p));
      lista.push([i, Math.min(n, i + tam)]);
      i += tam;
    }
    return lista;
  }

  for (let i = 0; i < n; i += chunk)          /* chunks fixos, em ordem */
    lista.push([i, Math.min(n, i + chunk)]);
  return lista;
}

function somaCusto(custos, de, ate) {
  let s = 0;
  for (let i = de; i < ate; i++) s += custos[i];
  return s;
}

/* Roda a política e devolve o Gantt, o tempo total e o balanceamento. */
function simularEscalonamento(custos, p, tipo, chunk, custoFila) {
  const n = custos.length;
  const pedacos = pedacosDe(n, p, tipo, chunk);
  const relogio = [];
  for (let t = 0; t < p; t++) relogio.push(0);

  const fila = tipo === "static" ? 0 : custoFila;
  const fatias = [];

  pedacos.forEach(function (pd, k) {
    /* static: o pedaço k é de quem já está decidido. dynamic/guided:
       de quem estiver livre primeiro. */
    let t = 0;
    if (tipo === "static") {
      t = chunk ? k % p : k;
    } else {
      for (let j = 1; j < p; j++) if (relogio[j] < relogio[t]) t = j;
    }

    const ini = relogio[t];
    const dur = fila + somaCusto(custos, pd[0], pd[1]);
    relogio[t] = ini + dur;
    fatias.push({ thread: t, ini: ini, fim: relogio[t], de: pd[0], ate: pd[1], fila: fila });
  });

  const maximo = Math.max.apply(null, relogio);
  const media = relogio.reduce((a, b) => a + b, 0) / p;

  return {
    fatias: fatias,
    porThread: relogio,
    total: maximo,
    balanceamento: maximo ? media / maximo : 1,
    pedacos: pedacos.length
  };
}

/* Os custos de cada iteração, conforme o perfil escolhido. */
function custosDoPerfil(perfil, n, rng) {
  const c = [];
  for (let i = 0; i < n; i++) {
    if (perfil === "uniforme")   c.push(5);
    else if (perfil === "decrescente") c.push(Math.max(1, 12 - Math.floor(i / 2)));
    else                         c.push(inteiroEntre(rng, 1, 12));   /* imprevisível */
  }
  return c;
}

/* ── jogo ────────────────────────────────────────────────── */
registrarJogo({
  id: "escalonador",
  nome: "Escolha o schedule",
  titulo: "Escolha o schedule",
  ideia: "24 iterações, 4 threads. Olhe o custo de cada iteração e escolha a " +
         "cláusula <code>schedule</code> que termina primeiro.",
  regras:
    "<p>As barras mostram quanto custa cada iteração do laço. Escolha a política e o jogo " +
    "simula a distribuição, mostrando o <b>tempo total</b> (que é o da thread mais lenta, " +
    "por causa da barreira do fim) e o <b>fator de balanceamento</b> " +
    "T<sub>médio</sub>/T<sub>máximo</sub> — quanto mais perto de 1, menos thread parada.</p>" +
    "<p><b>static</b> divide tudo antes de começar: custo de distribuição zero. " +
    "<b>static,2</b> faz o mesmo, mas em pedaços pequenos intercalados (cíclico). " +
    "<b>dynamic</b> e <b>guided</b> entregam sob demanda, e cada pedaço pego custa uma ida " +
    "à fila compartilhada (" + ESC_CUSTO_FILA + " aqui) — é esse custo que faz " +
    "<code>dynamic,1</code>, que equilibra melhor que todos, muitas vezes perder.</p>" +
    "<p>São 3 rodadas. Você ganha o ponto escolhendo a política mais rápida.</p>",
  modos: [
    { id: "uniforme",    rotulo: "custo igual" },
    { id: "decrescente", rotulo: "custo decrescente" },
    { id: "imprevisivel",rotulo: "imprevisível" }
  ],

  montar: function (palco, modo, api) {
    const RODADAS = 3;
    const rng = criarSorteio(Date.now() & 0xffff);
    let rodada = 0, acertos = 0, custos = [], resultados = [];

    const NOTA = {
      uniforme:
        "Com todas as iterações custando igual não há o que balancear: a divisão estática " +
        "acerta de primeira e não paga nada para distribuir. Toda política dinâmica aqui só " +
        "acrescenta idas à fila.",
      decrescente:
        "Custo que decresce é o caso do laço triangular e da busca do mínimo no selection " +
        "sort. O <code>static</code> em blocos contíguos é o pior possível: a primeira thread " +
        "fica com todas as iterações caras. Distribuir em pedaços pequenos intercalados " +
        "(<b>cíclico</b>, que é o <code>static,2</code>) resolve sem pagar fila nenhuma.",
      imprevisivel:
        "Quando não dá para prever o custo de cada iteração, só a distribuição sob demanda " +
        "equilibra. A escolha fica entre equilibrar melhor (chunk pequeno) e pagar menos fila " +
        "(chunk grande) — e o <code>guided</code> existe justamente para pegar os dois: " +
        "pedaços grandes no começo, pequenos no fim."
    };

    palco.innerHTML =
      '<div class="es-rodada"><span class="rot">rodada</span><b>&mdash;</b></div>' +
      '<div class="es-custos" role="img" aria-label="Custo de cada iteração"></div>' +
      '<div class="es-escolha" role="group" aria-label="Política de distribuição"></div>' +
      '<div class="es-saida"></div>';

    const barras = palco.querySelector(".es-custos");
    const escolha = palco.querySelector(".es-escolha");
    const saida = palco.querySelector(".es-saida");

    ESC_POLITICAS.forEach(function (pol) {
      const b = elem("button", "btn btn-sec es-pol", "<code>" + pol.rotulo + "</code>");
      b.type = "button";
      b.dataset.pol = pol.id;
      b.addEventListener("click", () => escolher(pol));
      escolha.appendChild(b);
    });

    function novaRodada() {
      custos = custosDoPerfil(modo, ESC_ITERACOES, rng);
      resultados = ESC_POLITICAS.map(function (pol) {
        const r = simularEscalonamento(custos, ESC_THREADS, pol.tipo, pol.chunk, ESC_CUSTO_FILA);
        return { pol: pol, r: r };
      });

      palco.querySelector(".es-rodada b").textContent = (rodada + 1) + " de " + RODADAS;
      saida.innerHTML = "";
      escolha.querySelectorAll(".es-pol").forEach(b => {
        b.disabled = false;
        b.classList.remove("es-melhor", "es-pior");
      });

      const maior = Math.max.apply(null, custos);
      barras.innerHTML = "";
      custos.forEach(function (c, i) {
        const col = elem("span", "es-barra");
        col.style.height = Math.round(100 * c / maior) + "%";
        col.title = "iteração " + i + ": custo " + c;
        barras.appendChild(col);
      });

      api.marcar(acertos, RODADAS);
      api.dizer("Custos de " + Math.min.apply(null, custos) + " a " + maior +
                ". Qual <code>schedule</code> termina primeiro?");
    }

    function escolher(pol) {
      const melhor = resultados.reduce((a, b) => b.r.total < a.r.total ? b : a);
      const meu = resultados.find(x => x.pol.id === pol.id);
      const certo = Math.abs(meu.r.total - melhor.r.total) < 1e-9;
      if (certo) acertos++;

      escolha.querySelectorAll(".es-pol").forEach(b => { b.disabled = true; });
      escolha.querySelector('[data-pol="' + melhor.pol.id + '"]').classList.add("es-melhor");
      if (!certo) escolha.querySelector('[data-pol="' + pol.id + '"]').classList.add("es-pior");

      desenharGantt(meu);
      rodada++;
      api.marcar(acertos, RODADAS);

      const msg = (certo ? "✓ " : "✗ ") +
        "<code>" + pol.rotulo + "</code> terminou em <b>" + fmtDec(meu.r.total) +
        "</b> com balanceamento <b>" + fmtDec(meu.r.balanceamento) + "</b>" +
        (certo ? " — era a melhor." :
          "; a melhor era <code>" + melhor.pol.rotulo + "</code>, com <b>" +
          fmtDec(melhor.r.total) + "</b>.");

      if (rodada >= RODADAS) {
        api.encerrar("<b>" + acertos + " de " + RODADAS + "</b>. " + msg + "<br><br>" +
                     NOTA[modo]);
      } else {
        api.dizer(msg, certo ? "ok" : "erro");
        const prox = elem("button", "btn btn-sec es-prox", "próxima rodada &rarr;");
        prox.type = "button";
        prox.addEventListener("click", novaRodada);
        saida.appendChild(prox);
      }
    }

    function desenharGantt(meu) {
      const escala = Math.max.apply(null, resultados.map(x => x.r.total));

      let html = '<div class="es-gantt">';
      for (let t = 0; t < ESC_THREADS; t++) {
        html += '<div class="es-linha"><span class="es-nome">t' + t + "</span>" +
                '<span class="es-faixa">';
        meu.r.fatias.filter(f => f.thread === t).forEach(function (f) {
          html += '<span class="es-fatia" style="left:' +
            (100 * f.ini / escala) + "%;width:" + (100 * (f.fim - f.ini) / escala) + '%" ' +
            'title="iterações ' + f.de + "–" + (f.ate - 1) + " (" +
            (f.ate - f.de) + ')"></span>';
        });
        html += "</span><span class=\"es-tempo\">" + fmtDec(meu.r.porThread[t]) + "</span></div>";
      }
      html += "</div>";

      html += '<table class="es-tabela"><caption>Todas as políticas nesta rodada</caption>' +
              "<thead><tr><th scope=\"col\">schedule</th><th scope=\"col\">tempo</th>" +
              "<th scope=\"col\">balanceamento</th><th scope=\"col\">pedaços</th></tr></thead><tbody>";
      resultados.slice().sort((a, b) => a.r.total - b.r.total).forEach(function (x) {
        html += "<tr" + (x.pol.id === meu.pol.id ? ' class="es-eu"' : "") + ">" +
          "<th scope=\"row\"><code>" + x.pol.rotulo + "</code></th>" +
          "<td>" + fmtDec(x.r.total) + "</td>" +
          "<td>" + fmtDec(x.r.balanceamento) + "</td>" +
          "<td>" + x.r.pedacos + "</td></tr>";
      });
      html += "</tbody></table>";

      saida.innerHTML = html;
    }

    novaRodada();
  }
});
