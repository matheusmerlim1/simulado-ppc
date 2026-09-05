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
   uma resposta é { escolha?, texto?, achadas?, total?, verificado, pontos }
   pontos vai de 0 a 1 e é o quanto a questão valeu: objetivas dão 0 ou 1,
   escritas dão a fração de palavras-chave encontradas (0,6 para 60%).
   Enquanto pontos for undefined a questão ainda não entrou no placar.      */
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

/* ── correção por palavras-chave ─────────────────────── */

/* A nota da questão é o próprio percentual — 60% valem 0,6 no placar.
   Este limite não corta pontos: só separa o que ainda merece revisão
   (abaixo dele a questão fica vermelha e volta no "refazer os erros"). */
const NOTA_MINIMA = 60;

/* Nota no formato da terra: 7,5 — e 7, não 7,0, quando for redonda. */
function fmtNota(valor) {
  const arred = Math.round(valor * 10) / 10;
  return (Number.isInteger(arred) ? String(arred) : arred.toFixed(1)).replace(".", ",");
}

/* Verde só com a questão inteira; âmbar da nota mínima para cima. */
function faixaDaNota(pontos) {
  if (pontos >= 1)                 return "ok";
  if (pontos >= NOTA_MINIMA / 100) return "parcial";
  return "err";
}

/* Compara ignorando caixa e acento: "Exclusão Mútua" casa com "exclusao mutua". */
function normalizar(texto) {
  return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* Casa por início de palavra, e não por pedaço solto: "up" não vale ponto
   dentro de "grupo". O fim fica livre de propósito, para que um radical como
   "compartilhad" continue pegando compartilhado, compartilhada e afins.
   Pedaço que já começa com símbolo ("+=", "->") casa como texto puro. */
function padraoParte(parte) {
  const escapado = parte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(/^[a-z0-9_]/.test(parte)
    ? "(^|[^a-z0-9_])" + escapado
    : escapado);
}

/* A ordem das palavras é livre: cada pedaço da variante é procurado por conta
   própria e todos precisam aparecer em algum lugar da resposta. Assim
   "recurso compartilhado" também casa com "compartilhado — esse recurso". */
function achouVariante(escrito, variante) {
  const bruto = normalizar(variante).trim();
  if (!bruto) return false;

  let partes = bruto.split(/\s+/);
  if (partes.length > 1)
    partes = partes.filter(p => /[a-z0-9_]/.test(p));   /* descarta "/" e "—" soltos */

  return partes.every(p => padraoParte(p).test(escrito));
}

/* Uma chave é uma string ou um array de sinônimos aceitos.
   Quando é array, o primeiro item é o rótulo exibido na correção. */
function corrigirChaves(texto, chaves) {
  const escrito = normalizar(texto || "").trim();

  const itens = chaves.map(chave => {
    const variantes = Array.isArray(chave) ? chave : [chave];
    return {
      rotulo: variantes[0],
      tem: escrito !== "" && variantes.some(v => achouVariante(escrito, v))
    };
  });

  const achadas = itens.filter(i => i.tem).length;
  return {
    itens: itens,
    achadas: achadas,
    total: itens.length,
    pct: itens.length ? Math.round(100 * achadas / itens.length) : 0
  };
}
