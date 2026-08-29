/* ═══════════════════════════════════════════════════════════
   Base — utilitários, estado compartilhado, tema e navegação.
   Carregado antes dos demais arquivos de interface.
   ═══════════════════════════════════════════════════════════ */

/* ── atalhos de DOM ──────────────────────────────────────── */
const $  = (seletor) => document.querySelector(seletor);
const $$ = (seletor) => Array.from(document.querySelectorAll(seletor));

const DIF_NOME = { facil:"Fácil", medio:"Médio", dificil:"Difícil" };

/* ── estado compartilhado ────────────────────────────────── */

/* filtros da tela inicial */
const conf = {
  prova: "P1",
  mods:  new Set(),
  difs:  new Set(["facil", "medio", "dificil"]),
  tipos: new Set(["mc", "vf", "disc", "code"]),
  qtd:   10,
  ordem: "rand"
};

/* rodada em andamento: { fila:[questões], i:índice atual, resp:[respostas] }
   uma resposta é { escolha?, texto?, verificado, correto }
   com correto = true | false | null (aguardando autoavaliação)         */
let run = null;

/* ── armazenamento local, tolerante a falha ──────────────── */
function lsGet(chave) {
  try { return localStorage.getItem(chave); } catch (e) { return null; }
}
function lsSet(chave, valor) {
  try { localStorage.setItem(chave, valor); } catch (e) { /* ignora */ }
}

/* ── tema ────────────────────────────────────────────────── */
function aplicarTema(tema) {
  if (tema === "dark" || tema === "light")
    document.documentElement.setAttribute("data-theme", tema);
  else
    document.documentElement.removeAttribute("data-theme");
}

function alternarTema() {
  const atual = document.documentElement.getAttribute("data-theme");
  const escuroAgora = atual === "dark" ||
    (!atual && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const novo = escuroAgora ? "light" : "dark";
  aplicarTema(novo);
  lsSet("ppc-tema", novo);
}

/* ── utilitários ─────────────────────────────────────────── */
function embaralhar(lista) {
  const v = lista.slice();
  for (let i = v.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [v[i], v[j]] = [v[j], v[i]];
  }
  return v;
}

/* ── consultas ao banco ──────────────────────────────────── */
function provaDe(q)   { return MODULOS[q.mod].prova; }

/* verdadeiro/falso não guarda alternativas no banco */
function opcoesDe(q)  { return q.tipo === "vf" ? ["Verdadeiro", "Falso"] : q.opcoes; }

function baseProva() {
  return BANCO.filter(q => conf.prova === "PF" || provaDe(q) === conf.prova);
}

function selecionadas() {
  return baseProva().filter(q =>
    conf.mods.has(q.mod) && conf.difs.has(q.dif) && conf.tipos.has(q.tipo));
}

function modulosVisiveis() {
  return Object.keys(MODULOS)
    .filter(k => conf.prova === "PF" || MODULOS[k].prova === conf.prova);
}

/* ── navegação entre telas ───────────────────────────────── */
const TELAS = ["#telaInicio", "#telaQuestao", "#telaResultado", "#telaEstudo"];

function mostrar(tela) {
  TELAS.forEach(s => $(s).classList.toggle("hidden", s !== tela));

  const emProva = tela === "#telaQuestao";
  $("#statQ").classList.toggle("hidden", !emProva);
  $("#statA").classList.toggle("hidden", !emProva);
  $("#btnInicio").classList.toggle("hidden", tela === "#telaInicio");
  $("#trilha").style.display = emProva ? "flex" : "none";

  window.scrollTo(0, 0);
}

/* Volta ao início. Só confirma se houver respostas a perder. */
function voltarInicio() {
  const emProva = !$("#telaQuestao").classList.contains("hidden");
  const temRespostas = run && run.resp.some(r => r && r.verificado);

  if (emProva && temRespostas &&
      !confirm("Sair do simulado em andamento? As respostas desta rodada serão perdidas."))
    return;

  run = null;
  mostrar("#telaInicio");
}
