/* ═══════════════════════════════════════════════════════════
   Animações — motor do player.

   Cada cena é registrada com registrarAnimacao({
     id, nome, titulo, ideia,
     modos:   [{ id, rotulo }],
     montar:  (palco, modo) => desenhar(estado),   monta o DOM uma vez
     roteiro: (modo) => [estado, ...]              cada estado tem .legenda
   })
   Os passos são estados completos, e não deltas: voltar um passo é só
   desenhar o estado anterior.
   ═══════════════════════════════════════════════════════════ */

const ANIMACOES = [];
function registrarAnimacao(def) { ANIMACOES.push(def); }

const VELOCIDADES = [["devagar", 2400], ["normal", 1400], ["rápido", 700]];

const player = {
  cena: null, modo: null, passos: [], i: 0,
  desenhar: null, tocando: false, timer: null, ms: 1400
};

/* número com vírgula e no máximo duas casas: 2.25 -> "2,25" */
function fmtDec(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }

function elem(tag, classe, html) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/* ── navegação entre cenas ───────────────────────────────── */
function montarNavAnimacoes() {
  const nav = $("#navAnimacoes");
  if (nav.childElementCount) return;

  ANIMACOES.forEach(cena => {
    const chip = elem("button", "chip", cena.nome);
    chip.dataset.anim = cena.id;
    chip.addEventListener("click", () => abrirAnimacao(cena.id));
    nav.appendChild(chip);
  });
}

function abrirAnimacao(id, modo) {
  const cena = ANIMACOES.find(c => c.id === id) || ANIMACOES[0];
  pausarAnimacao();
  player.cena = cena;

  $$("#navAnimacoes .chip").forEach(c =>
    c.setAttribute("aria-pressed", String(c.dataset.anim === cena.id)));

  const alvo = $("#animacao");
  alvo.innerHTML =
    '<article class="anim">' +
      '<div class="anim-cab">' +
        "<h2>" + cena.titulo + "</h2>" +
        '<p class="anim-ideia">' + cena.ideia + "</p>" +
        '<div class="seg anim-modos" role="group" aria-label="Variação"></div>' +
      "</div>" +
      '<div class="anim-palco"></div>' +
      '<div class="anim-legenda" aria-live="polite"></div>' +
      '<div class="anim-trilho"><span></span></div>' +
      '<div class="anim-controles">' +
        '<button class="anim-btn" data-acao="inicio" title="Voltar ao início" aria-label="Voltar ao início">&#8634;</button>' +
        '<button class="anim-btn" data-acao="ant" title="Passo anterior (←)" aria-label="Passo anterior">&#9664;</button>' +
        '<button class="anim-btn anim-play" data-acao="play" title="Reproduzir (espaço)" aria-label="Reproduzir">&#9654;</button>' +
        '<button class="anim-btn" data-acao="prox" title="Próximo passo (→)" aria-label="Próximo passo">&#9654;&#10073;</button>' +
        '<span class="anim-conta"></span>' +
        '<div class="seg anim-vel" role="group" aria-label="Velocidade"></div>' +
      "</div>" +
    "</article>";

  const modos = alvo.querySelector(".anim-modos");
  cena.modos.forEach(m => {
    const b = elem("button", "", m.rotulo);
    b.dataset.modo = m.id;
    b.addEventListener("click", () => trocarModo(m.id));
    modos.appendChild(b);
  });
  if (cena.modos.length < 2) modos.classList.add("hidden");

  const vel = alvo.querySelector(".anim-vel");
  VELOCIDADES.forEach(([rotulo, ms]) => {
    const b = elem("button", "", rotulo);
    b.setAttribute("aria-pressed", String(ms === player.ms));
    b.addEventListener("click", () => {
      player.ms = ms;
      vel.querySelectorAll("button").forEach(o =>
        o.setAttribute("aria-pressed", String(o === b)));
    });
    vel.appendChild(b);
  });

  alvo.querySelectorAll(".anim-controles [data-acao]").forEach(b =>
    b.addEventListener("click", () => acaoAnimacao(b.dataset.acao)));

  trocarModo(modo || cena.modos[0].id);
}

function trocarModo(modo) {
  pausarAnimacao();
  const cena = player.cena;
  player.modo = modo;

  $$("#animacao .anim-modos button").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.modo === modo)));

  const palco = $("#animacao .anim-palco");
  palco.innerHTML = "";
  palco.className = "anim-palco palco-" + cena.id;
  player.desenhar = cena.montar(palco, modo);
  player.passos = cena.roteiro(modo);
  irParaPasso(0);
}

/* ── reprodução ──────────────────────────────────────────── */
function irParaPasso(i) {
  const n = player.passos.length;
  player.i = Math.max(0, Math.min(n - 1, i));
  const estado = player.passos[player.i];

  player.desenhar(estado);
  $("#animacao .anim-legenda").innerHTML = estado.legenda;
  $("#animacao .anim-conta").textContent = "passo " + (player.i + 1) + " de " + n;
  $("#animacao .anim-trilho span").style.width =
    (n > 1 ? (100 * player.i / (n - 1)) : 100) + "%";

  $("#animacao [data-acao='ant']").disabled = player.i === 0;
  $("#animacao [data-acao='prox']").disabled = player.i === n - 1;
}

function acaoAnimacao(acao) {
  if (acao === "play")   return player.tocando ? pausarAnimacao() : tocarAnimacao();
  pausarAnimacao();
  if (acao === "inicio") irParaPasso(0);
  if (acao === "ant")    irParaPasso(player.i - 1);
  if (acao === "prox")   irParaPasso(player.i + 1);
}

function tocarAnimacao() {
  if (!player.cena) return;
  if (player.i === player.passos.length - 1) irParaPasso(0);   /* do fim, recomeça */
  player.tocando = true;
  atualizarBotaoPlay();
  agendarPasso();
}

function agendarPasso() {
  clearTimeout(player.timer);
  player.timer = setTimeout(() => {
    const palco = $("#animacao .anim-palco");
    /* saiu da aba ou da tela: para sozinho */
    if (!player.tocando || !palco || palco.offsetParent === null) return pausarAnimacao();

    irParaPasso(player.i + 1);
    if (player.i === player.passos.length - 1) pausarAnimacao();
    else agendarPasso();
  }, player.ms);
}

function pausarAnimacao() {
  player.tocando = false;
  clearTimeout(player.timer);
  atualizarBotaoPlay();
}

function atualizarBotaoPlay() {
  const b = $("#animacao [data-acao='play']");
  if (!b) return;
  b.innerHTML = player.tocando ? "&#10073;&#10073;" : "&#9654;";
  b.setAttribute("aria-label", player.tocando ? "Pausar" : "Reproduzir");
  b.title = player.tocando ? "Pausar (espaço)" : "Reproduzir (espaço)";
}

/* ← → passam, espaço toca/pausa — só com a aba de animações à vista */
function ligarAnimacoes() {
  document.addEventListener("keydown", (e) => {
    const aba = $("#abaAnimacoes");
    if (!aba || aba.offsetParent === null || !player.cena) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;

    if (e.key === "ArrowRight") { acaoAnimacao("prox"); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { acaoAnimacao("ant"); e.preventDefault(); }
    else if (e.key === " " && !/^BUTTON$/.test(document.activeElement.tagName)) {
      acaoAnimacao("play"); e.preventDefault();
    }
  });
}
