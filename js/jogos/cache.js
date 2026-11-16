/* ═══════════════════════════════════════════════════════════
   JOGO 1 — Acerto ou falta? (aula 07)

   Uma cache de 8 linhas recebe endereços um a um. O jogador decide
   se cada acesso é ACERTO ou FALTA, vendo o estado da cache.

   Os três modos são a MESMA cache (8 linhas de 16 bytes), mudando só
   o mapeamento — é esse o ponto: a mesma sequência de endereços dá
   números de falta bem diferentes conforme a associatividade.
   ═══════════════════════════════════════════════════════════ */

const CACHE_LINHA = 16;        /* bytes por linha */
const CACHE_LINHAS = 8;        /* linhas no total, nos três modos */

const CACHE_MODOS = {
  direto:      { vias: 1, conjuntos: 8, nome: "mapeamento direto" },
  conjuntos:   { vias: 2, conjuntos: 4, nome: "associativa de 2 vias" },
  associativa: { vias: 8, conjuntos: 1, nome: "totalmente associativa" }
};

/* ── lógica pura (testável, sem DOM) ─────────────────────── */

/* Roda a sequência de blocos numa cache com LRU e devolve um passo
   por acesso: em que conjunto caiu, se acertou e quem foi expulso. */
function simularCache(blocos, vias, conjuntos) {
  const estado = [];
  for (let c = 0; c < conjuntos; c++) estado.push([]);   /* [+recente ... -recente] */

  return blocos.map(function (bloco) {
    const conj = bloco % conjuntos;
    const linhas = estado[conj];
    const onde = linhas.indexOf(bloco);

    if (onde >= 0) {                        /* acerto: vira o mais recente */
      linhas.splice(onde, 1);
      linhas.unshift(bloco);
      return { bloco: bloco, conjunto: conj, acerto: true, expulso: null,
               foto: estado.map(l => l.slice()) };
    }

    let expulso = null;
    if (linhas.length === vias) expulso = linhas.pop();   /* LRU sai */
    linhas.unshift(bloco);
    return { bloco: bloco, conjunto: conj, acerto: false, expulso: expulso,
             foto: estado.map(l => l.slice()) };
  });
}

function faltasDe(blocos, vias, conjuntos) {
  return simularCache(blocos, vias, conjuntos).filter(p => !p.acerto).length;
}

/* Monta uma sequência que mostra o conflito: dois blocos que caem no
   MESMO conjunto do mapeamento direto (distantes de 8), mais dois
   blocos tranquilos. Em 1 via os dois primeiros se expulsam sempre;
   em 2 vias cabem os dois. */
function sequenciaCache(rng, quantos) {
  const base = inteiroEntre(rng, 0, 7);
  const briga = [base, base + CACHE_LINHAS];

  const calmos = [];
  while (calmos.length < 2) {
    const b = inteiroEntre(rng, 0, 23);
    if (b % CACHE_LINHAS !== base % CACHE_LINHAS && calmos.indexOf(b) < 0) calmos.push(b);
  }

  const blocos = [];
  for (let i = 0; i < quantos; i++) {
    /* 2 em cada 3 acessos são do par que briga: o conflito aparece */
    const r = rng();
    if (r < 0.66) blocos.push(briga[blocos.length % 2]);
    else blocos.push(calmos[inteiroEntre(rng, 0, 1)]);
  }
  return blocos;
}

/* endereço qualquer dentro do bloco: o jogador tem de achar o bloco */
function enderecoDoBloco(rng, bloco) {
  return bloco * CACHE_LINHA + inteiroEntre(rng, 0, CACHE_LINHA - 1);
}

function hex(n, casas) {
  let s = n.toString(16).toUpperCase();
  while (s.length < casas) s = "0" + s;
  return "0x" + s;
}

function bitsDe(n) { return Math.round(Math.log(n) / Math.log(2)); }

/* ── jogo ────────────────────────────────────────────────── */
registrarJogo({
  id: "cache",
  nome: "Acerto ou falta?",
  titulo: "Acerto ou falta?",
  ideia: "A cache tem 8 linhas de 16 bytes. Para cada endereço, diga se o acesso " +
         "vai acertar ou faltar — e veja o conflito aparecer.",
  regras:
    "<p>Chega um <b>endereço</b> por vez. Antes de responder, faça a conta que a prova pede:</p>" +
    "<p><b>1.</b> o <b>bloco</b> é o endereço dividido pelo tamanho da linha " +
    "(16 bytes &rarr; os 4 bits de baixo são o deslocamento).<br>" +
    "<b>2.</b> o <b>conjunto</b> é o bloco módulo o número de conjuntos.<br>" +
    "<b>3.</b> olhe o conjunto na tabela: se o bloco está lá, é <b>acerto</b>.</p>" +
    "<p>Quando um conjunto cheio recebe bloco novo, sai o <b>menos usado recentemente</b> (LRU). " +
    "No fim, a mesma sequência é comparada nos três mapeamentos.</p>",
  modos: [
    { id: "direto",      rotulo: "direto (1 via)" },
    { id: "conjuntos",   rotulo: "2 vias" },
    { id: "associativa", rotulo: "totalmente assoc." }
  ],

  montar: function (palco, modo, api) {
    const cfg = CACHE_MODOS[modo];
    const rng = criarSorteio(Date.now() & 0xffff);
    const TOTAL = 12;

    const blocos = sequenciaCache(rng, TOTAL);
    const enderecos = blocos.map(b => enderecoDoBloco(rng, b));
    const passos = simularCache(blocos, cfg.vias, cfg.conjuntos);

    const bitsDesloc = bitsDe(CACHE_LINHA);
    const bitsIndice = cfg.conjuntos > 1 ? bitsDe(cfg.conjuntos) : 0;

    let i = 0, acertos = 0;

    palco.innerHTML =
      '<div class="cc-topo">' +
        '<div class="cc-end">' +
          '<span class="rot">endereço</span>' +
          '<b class="cc-valor">&mdash;</b>' +
          '<span class="cc-dec"></span>' +
        "</div>" +
        '<div class="cc-corte">' +
          '<span class="rot">formato do endereço</span>' +
          "<code>tag &middot; " +
            (bitsIndice ? "conjunto " + bitsIndice + " bits &middot; " : "sem índice &middot; ") +
            "desloc " + bitsDesloc + " bits</code>" +
        "</div>" +
      "</div>" +
      '<div class="cc-grade" role="group" aria-label="Estado da cache"></div>' +
      '<div class="cc-botoes">' +
        '<button class="btn btn-sec cc-resp" type="button" data-r="1">acerto</button>' +
        '<button class="btn btn-sec cc-resp" type="button" data-r="0">falta</button>' +
      "</div>";

    const grade = palco.querySelector(".cc-grade");
    const celulas = [];

    for (let c = 0; c < cfg.conjuntos; c++) {
      const linha = elem("div", "cc-conj");
      linha.appendChild(elem("span", "cc-rot", "conj " + c));
      const vias = [];
      for (let v = 0; v < cfg.vias; v++) {
        const cel = elem("span", "cc-cel", "&mdash;");
        linha.appendChild(cel);
        vias.push(cel);
      }
      celulas.push(vias);
      grade.appendChild(linha);
    }

    function pintar(foto, conjAtivo) {
      for (let c = 0; c < cfg.conjuntos; c++) {
        const guardados = (foto && foto[c]) || [];
        for (let v = 0; v < cfg.vias; v++) {
          const cel = celulas[c][v];
          const bloco = guardados[v];
          cel.innerHTML = bloco === undefined ? "&mdash;" : "bloco " + bloco;
          cel.className = "cc-cel" +
            (bloco === undefined ? " vazia" : "") +
            (v === 0 && bloco !== undefined ? " recente" : "") +
            (c === conjAtivo ? " ativo" : "");
        }
      }
    }

    function perguntar() {
      if (i >= TOTAL) return fechar();
      palco.querySelector(".cc-valor").textContent = hex(enderecos[i], 3);
      palco.querySelector(".cc-dec").textContent = "(" + enderecos[i] + " em decimal)";
      api.marcar(acertos, TOTAL);
    }

    function responder(disseAcerto) {
      if (i >= TOTAL) return;
      const passo = passos[i];
      const certo = disseAcerto === passo.acerto;
      if (certo) acertos++;

      pintar(passo.foto, passo.conjunto);

      const conta = "endereço " + hex(enderecos[i], 3) + " &rarr; bloco <b>" +
        passo.bloco + "</b> &rarr; conjunto <b>" + passo.conjunto + "</b>";
      const oque = passo.acerto
        ? "o bloco já estava no conjunto: <b>ACERTO</b>."
        : (passo.expulso === null
            ? "o conjunto tinha espaço livre: <b>FALTA</b> (a primeira vez sempre falta)."
            : "o conjunto estava cheio: <b>FALTA</b>, e saiu o bloco " +
              passo.expulso + ", o menos usado recentemente.");

      api.dizer((certo ? "✓ " : "✗ ") + conta + " — " + oque, certo ? "ok" : "erro");

      i++;
      api.marcar(acertos, TOTAL);
      if (i >= TOTAL) fechar(); else perguntar();
    }

    function fechar() {
      palco.querySelectorAll(".cc-resp").forEach(b => { b.disabled = true; });
      palco.querySelector(".cc-valor").innerHTML = "fim";
      palco.querySelector(".cc-dec").textContent = "";

      const comp = [
        ["mapeamento direto", faltasDe(blocos, 1, 8)],
        ["associativa de 2 vias", faltasDe(blocos, 2, 4)],
        ["totalmente associativa", faltasDe(blocos, 8, 1)]
      ];

      api.encerrar(
        "<b>" + acertos + " de " + TOTAL + "</b> em " + cfg.nome + ".<br><br>" +
        "A <b>mesma</b> sequência de " + TOTAL + " acessos, nas três caches de 8 linhas:<br>" +
        comp.map(c => "&bull; " + c[0] + ": <b>" + c[1] + "</b> faltas").join("<br>") +
        "<br><br>A diferença não é tamanho — as três têm 8 linhas. É <b>onde cada bloco " +
        "pode ficar</b>: no direto, dois blocos distantes de 8 disputam a mesma linha e se " +
        "expulsam para sempre. São as <b>faltas por conflito</b>.");
    }

    palco.querySelectorAll(".cc-resp").forEach(b =>
      b.addEventListener("click", () => responder(b.dataset.r === "1")));

    pintar(null, -1);
    api.dizer("Cache de 8 linhas &times; 16 bytes, " + cfg.nome +
              " &mdash; " + cfg.conjuntos + " conjunto(s) de " + cfg.vias + " via(s).");
    perguntar();
  }
});
