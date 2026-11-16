/* ═══════════════════════════════════════════════════════════
   JOGOS — motor.

   Cada jogo é registrado com registrarJogo({
     id, nome, titulo, ideia, regras (html),
     modos:  [{ id, rotulo }],
     montar: (palco, modo, api) => void
   })

   O motor cuida da casca: título, seletor de modo, regras, placar,
   barra de progresso, botão de recomeçar e a linha de resposta.
   O jogo cuida só do seu tabuleiro, e fala com o motor pela api:

     api.dizer(html, tom)          tom: "ok", "erro" ou nada
     api.marcar(acertos, total)    atualiza placar e barra
     api.encerrar(html)            fecha a rodada com um resumo
     api.recomeçar()               remonta o modo atual

   A lógica de cada jogo (cache, pipeline, escalonamento) fica em
   funções puras, separadas do DOM, para poderem ser testadas.
   ═══════════════════════════════════════════════════════════ */

const JOGOS = [];
function registrarJogo(def) { JOGOS.push(def); }

const jogoAberto = { def: null, modo: null };

/* gerador com semente: a mesma semente dá sempre o mesmo desafio,
   o que também deixa o jogo testável */
function criarSorteio(semente) {
  let s = (semente >>> 0) || 1;
  return function () {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

/* inteiro em [a, b] */
function inteiroEntre(rng, a, b) { return a + Math.floor(rng() * (b - a + 1)); }

/* ── navegação entre jogos ───────────────────────────────── */
function montarNavJogos() {
  const nav = $("#navJogos");
  if (nav.childElementCount) return;

  JOGOS.forEach(def => {
    const chip = elem("button", "chip", def.nome);
    chip.dataset.jogo = def.id;
    chip.addEventListener("click", () => abrirJogo(def.id));
    nav.appendChild(chip);
  });
}

function abrirJogo(id, modo) {
  const def = JOGOS.find(j => j.id === id) || JOGOS[0];
  jogoAberto.def = def;

  $$("#navJogos .chip").forEach(c =>
    c.setAttribute("aria-pressed", String(c.dataset.jogo === def.id)));

  $("#jogo").innerHTML =
    '<article class="jogo">' +
      '<div class="jogo-cab">' +
        "<h2>" + def.titulo + "</h2>" +
        '<p class="jogo-ideia">' + def.ideia + "</p>" +
        '<div class="seg jogo-modos" role="group" aria-label="Variação"></div>' +
      "</div>" +
      '<details class="jogo-regras">' +
        "<summary>como jogar</summary>" +
        '<div class="jogo-regras-txt">' + def.regras + "</div>" +
      "</details>" +
      '<div class="jogo-barra">' +
        '<span class="jogo-placar">&mdash;</span>' +
        '<div class="jogo-trilho"><span></span></div>' +
        '<button class="btn btn-sec jogo-novo" type="button">recomeçar</button>' +
      "</div>" +
      '<div class="jogo-palco"></div>' +
      '<div class="jogo-fala" role="status" aria-live="polite"></div>' +
    "</article>";

  const modos = $("#jogo .jogo-modos");
  def.modos.forEach(m => {
    const b = elem("button", "", m.rotulo);
    b.type = "button";
    b.dataset.modo = m.id;
    b.addEventListener("click", () => trocarModoJogo(m.id));
    modos.appendChild(b);
  });
  if (def.modos.length < 2) modos.classList.add("hidden");

  $("#jogo .jogo-novo").addEventListener("click", () => trocarModoJogo(jogoAberto.modo));

  trocarModoJogo(modo || def.modos[0].id);
}

function trocarModoJogo(modo) {
  const def = jogoAberto.def;
  jogoAberto.modo = modo;

  $$("#jogo .jogo-modos button").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.modo === modo)));

  const palco = $("#jogo .jogo-palco");
  palco.innerHTML = "";
  palco.className = "jogo-palco palco-" + def.id;

  $("#jogo .jogo-fala").className = "jogo-fala";
  $("#jogo .jogo-fala").innerHTML = "";
  $("#jogo .jogo-placar").innerHTML = "&mdash;";
  $("#jogo .jogo-trilho span").style.width = "0%";

  def.montar(palco, modo, apiDoJogo());
}

function apiDoJogo() {
  return {
    dizer: function (html, tom) {
      const fala = $("#jogo .jogo-fala");
      fala.className = "jogo-fala" + (tom ? " fala-" + tom : "");
      fala.innerHTML = html;
    },
    marcar: function (acertos, total) {
      $("#jogo .jogo-placar").innerHTML =
        "<b>" + acertos + "</b> de " + total;
      $("#jogo .jogo-trilho span").style.width =
        (total ? Math.round(100 * acertos / total) : 0) + "%";
    },
    encerrar: function (html) {
      const fala = $("#jogo .jogo-fala");
      fala.className = "jogo-fala fala-fim";
      fala.innerHTML = html;
    },
    recomecar: function () { trocarModoJogo(jogoAberto.modo); }
  };
}
