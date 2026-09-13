/* ═══════════════════════════════════════════════════════════
   Tela de estudo — panorama, matéria explicada, consulta rápida
   e animações.
   ═══════════════════════════════════════════════════════════ */

let modMateria = MATERIA[0].mod;
let abaEstudo = "panorama";

const ABAS_ESTUDO = {
  panorama:  "#abaPanorama",
  materia:   "#abaMateria",
  formulas:  "#abaFormulas",
  animacoes: "#abaAnimacoes"
};

/* abrirEstudo()               volta à última aba usada
   abrirEstudo(mod)            matéria do assunto
   abrirEstudo(null, "aba")    aba específica                 */
function abrirEstudo(mod, aba) {
  if (mod) modMateria = mod;
  montarPanorama();
  montarFormulas();
  montarNavMateria();
  renderMateria();
  montarNavAnimacoes();
  mostrar("#telaEstudo");
  mostrarAba(aba || (mod ? "materia" : abaEstudo));
}

function mostrarAba(aba) {
  abaEstudo = aba;
  $$("#abasEstudo button").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.aba === aba)));
  Object.keys(ABAS_ESTUDO).forEach(k =>
    $(ABAS_ESTUDO[k]).classList.toggle("hidden", k !== aba));
  $("#btnTreinarAssunto").classList.toggle("hidden", aba !== "materia");

  if (aba !== "animacoes") pausarAnimacao();
  if (aba === "animacoes" && !player.cena) abrirAnimacao(ANIMACOES[0].id);
}

function treinarAssunto(mod) {
  const lista = BANCO.filter(q => q.mod === mod);
  if (lista.length) iniciar(embaralhar(lista).slice(0, 10));
}

/* ── panorama ────────────────────────────────────────────── */
function montarPanorama() {
  const alvo = $("#abaPanorama");
  if (alvo.childElementCount) return;          /* conteúdo fixo, monta uma vez */

  const eixos = document.createElement("div");
  eixos.className = "pan-eixos";
  PANORAMA.eixos.forEach(e => {
    const card = document.createElement("div");
    card.className = "pan-eixo";
    card.innerHTML = "<h3>" + e.nome + " <span>" + e.prova + "</span></h3><p>" + e.def + "</p><p>" + e.foco + "</p>";
    eixos.appendChild(card);
  });
  alvo.appendChild(eixos);

  const relacao = document.createElement("p");
  relacao.className = "pan-relacao";
  relacao.innerHTML = PANORAMA.relacao;
  alvo.appendChild(relacao);

  const trilha = document.createElement("ol");
  trilha.className = "pan-trilha";
  PANORAMA.estacoes.forEach((est, k) => trilha.appendChild(montarEstacao(est, k)));
  alvo.appendChild(trilha);

  const cab = document.createElement("div");
  cab.className = "bloco-cab";
  cab.style.marginTop = "40px";
  cab.innerHTML = "<h2>O que atravessa a disciplina inteira</h2>";
  alvo.appendChild(cab);

  const ideias = document.createElement("div");
  ideias.className = "pan-ideias";
  PANORAMA.ideias.forEach(([titulo, texto]) => {
    const card = document.createElement("div");
    card.className = "pan-ideia";
    card.innerHTML = "<b>" + titulo + "</b><span>" + texto + "</span>";
    ideias.appendChild(card);
  });
  alvo.appendChild(ideias);
}

function montarEstacao(est, k) {
  const modulo = MODULOS[est.mod];
  const qtd = BANCO.filter(q => q.mod === est.mod).length;

  const item = document.createElement("li");
  item.className = "pan-est";
  item.dataset.prova = modulo.prova;
  item.innerHTML =
    '<span class="pan-num">' + String(k + 1).padStart(2, "0") + "</span>" +
    '<div class="pan-card">' +
      "<h3>" + modulo.nome + ' <span class="selo">' + modulo.prova + " · " + qtd + " questões</span></h3>" +
      '<p class="pan-perg">' + est.pergunta + "</p>" +
      '<div class="pan-texto">' + est.texto + "</div>" +
      '<ul class="pan-ess">' + est.essencial.map(e => "<li>" + e + "</li>").join("") + "</ul>" +
      '<p class="pan-prova"><b>Na prova</b>' + est.prova + "</p>" +
      '<div class="pan-acoes"></div>' +
    "</div>";

  const acoes = item.querySelector(".pan-acoes");
  const botao = (rotulo, classe, acao) => {
    const b = document.createElement("button");
    b.className = "btn-mini" + (classe ? " " + classe : "");
    b.innerHTML = rotulo;
    b.addEventListener("click", acao);
    acoes.appendChild(b);
  };

  botao("Ler em detalhe &rarr;", "", () => {
    modMateria = est.mod;
    montarNavMateria();
    renderMateria();
    mostrarAba("materia");
    $("#navMateria").scrollIntoView({ block: "start", behavior: "smooth" });
  });

  (est.animacoes || []).forEach(id => {
    const cena = ANIMACOES.find(c => c.id === id);
    if (!cena) return;
    botao("&#9654; " + cena.nome, "anima", () => {
      mostrarAba("animacoes");
      abrirAnimacao(id);
      $("#abaAnimacoes").scrollIntoView({ block: "start", behavior: "smooth" });
    });
  });

  if (qtd) botao("Treinar " + qtd, "", () => treinarAssunto(est.mod));
  return item;
}

/* ── consulta rápida: fichas de fórmulas ─────────────────── */
function montarFormulas() {
  const alvo = $("#resumoGrid");
  if (alvo.childElementCount) return;

  RESUMO.forEach(ficha => {
    const cartao = document.createElement("div");
    cartao.className = "ficha";

    const itens = ficha.corpo
      .map(([termo, definicao]) => "<dt>" + termo + "</dt><dd>" + definicao + "</dd>")
      .join("");

    cartao.innerHTML = "<h3>" + ficha.t + "</h3><dl>" + itens + "</dl>";
    alvo.appendChild(cartao);
  });
}

/* ── navegação por assunto ───────────────────────────────── */
function montarNavMateria() {
  const nav = $("#navMateria");

  if (nav.childElementCount) {                 /* já montado: só atualiza o ativo */
    $$("#navMateria .chip").forEach(chip =>
      chip.setAttribute("aria-pressed", String(chip.dataset.mod === modMateria)));
    return;
  }

  MATERIA.forEach(bloco => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.dataset.mod = bloco.mod;
    chip.setAttribute("aria-pressed", String(bloco.mod === modMateria));
    chip.innerHTML = MODULOS[bloco.mod].nome +
                     ' <span class="cnt">' + MODULOS[bloco.mod].prova + "</span>";

    chip.addEventListener("click", () => {
      modMateria = bloco.mod;
      $$("#navMateria .chip").forEach(o =>
        o.setAttribute("aria-pressed", String(o === chip)));
      renderMateria();
      nav.scrollIntoView({ block: "start", behavior: "smooth" });
    });

    nav.appendChild(chip);
  });
}

/* ── conteúdo do assunto escolhido ───────────────────────── */
function renderMateria() {
  const alvo = $("#materiaConteudo");
  const bloco = MATERIA.find(m => m.mod === modMateria);
  alvo.innerHTML = "";
  if (!bloco) return;

  const quantasQuestoes = BANCO.filter(q => q.mod === modMateria).length;
  const comentados = bloco.secoes.filter(s => s.anotado).length;

  const cabecalho = document.createElement("div");
  cabecalho.className = "materia-titulo";
  cabecalho.innerHTML =
    "<h2>" + MODULOS[modMateria].nome + "</h2>" +
    '<span class="conta">' + bloco.secoes.length + " tópicos · " +
    (comentados ? comentados + " códigos comentados · " : "") +
    quantasQuestoes + " questões no banco · " + MODULOS[modMateria].prova + "</span>";
  alvo.appendChild(cabecalho);

  bloco.secoes.forEach(secao => alvo.appendChild(montarSecao(secao)));

  $("#btnTreinarAssunto").textContent = "Treinar " + MODULOS[modMateria].nome;
  $("#btnTreinarAssunto").disabled = quantasQuestoes === 0;
}

/* Uma seção: título, texto, código anotado, código solto e caixa de destaque. */
function montarSecao(secao) {
  const artigo = document.createElement("article");
  artigo.className = "secao";

  const titulo = document.createElement("h3");
  titulo.innerHTML = "<span>" + secao.h + "</span>";
  artigo.appendChild(titulo);

  if (secao.p) {
    const texto = document.createElement("div");
    texto.className = "secao-texto";
    texto.innerHTML = secao.p;
    artigo.appendChild(texto);
  }
  if (secao.anotado) artigo.appendChild(montarAnotado(secao.anotado));
  if (secao.cod) {
    const pre = document.createElement("pre");
    pre.className = "cod";
    pre.textContent = secao.cod;               /* textContent: código não é HTML */
    artigo.appendChild(pre);
  }
  if (secao.box) {
    const caixa = document.createElement("div");
    caixa.className = "box";
    caixa.innerHTML = secao.box;
    artigo.appendChild(caixa);
  }

  return artigo;
}

/* Código comentado linha a linha.
   anotado = { enunciado, linhas: [[código, porquê, chave?], ...], saida? } */
function montarAnotado(a) {
  const bloco = document.createElement("div");
  bloco.className = "anotado";

  const enunciado = document.createElement("div");
  enunciado.className = "ano-enun";
  enunciado.innerHTML = '<span class="rot">exemplo comentado</span>' + a.enunciado;
  bloco.appendChild(enunciado);

  a.linhas.forEach(([codigo, porque, chave]) => {
    const linha = document.createElement("div");
    linha.className = "ano-l" + (chave ? " chave" : "");

    const pre = document.createElement("pre");
    pre.textContent = codigo;                  /* código é texto puro */
    const explicacao = document.createElement("p");
    explicacao.innerHTML = porque;

    linha.appendChild(pre);
    linha.appendChild(explicacao);
    bloco.appendChild(linha);
  });

  if (a.saida) {
    const saida = document.createElement("div");
    saida.className = "ano-saida";
    saida.innerHTML = a.saida;
    bloco.appendChild(saida);
  }
  return bloco;
}

/* ── ligações ────────────────────────────────────────────── */
function ligarEstudo() {
  $$("#abasEstudo button").forEach(aba =>
    aba.addEventListener("click", () => mostrarAba(aba.dataset.aba)));

  /* da matéria direto para as questões do mesmo assunto */
  $("#btnTreinarAssunto").addEventListener("click", () => treinarAssunto(modMateria));
}
