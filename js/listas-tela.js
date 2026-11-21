/* ═══════════════════════════════════════════════════════════
   LISTAS — a tela.

   Cada aula tem dois PDFs na pasta da disciplina: o do conteúdo
   (os slides) e o da atividade (a lista). Aqui os dois aparecem
   lado a lado, nomeados, para não restar dúvida sobre o par.

   Cada questão mostra o enunciado e esconde a resolução atrás de
   um "ver resolução" — ler o enunciado e tentar antes é o ponto.
   ═══════════════════════════════════════════════════════════ */

let listaAberta = null;

function listaDoModulo(mod) { return LISTAS.find(l => l.mod === mod); }

/* ── navegação entre listas ──────────────────────────────── */
function montarNavListas() {
  const nav = $("#navListas");

  if (nav.childElementCount) {
    $$("#navListas .chip").forEach(chip =>
      chip.setAttribute("aria-pressed", String(chip.dataset.lista === listaAberta)));
    return;
  }

  const ROTULO = {
    P1: "P1 &middot; Programação Concorrente",
    P2: "P2 &middot; Programação Paralela"
  };

  const grupos = [];
  LISTAS.forEach(lista => {
    const prova = (MODULOS[lista.mod] || {}).prova || "—";
    let grupo = grupos.find(g => g.prova === prova);
    if (!grupo) grupos.push(grupo = { prova: prova, listas: [] });
    grupo.listas.push(lista);
  });

  grupos.forEach(grupo => {
    const caixa = elem("div", "chip-grupo");
    const rotulo = elem("span", "grupo-rot");
    rotulo.innerHTML = ROTULO[grupo.prova] || grupo.prova;
    caixa.appendChild(rotulo);

    const linha = elem("div", "chips");
    grupo.listas.forEach(lista => {
      const nome = (MODULOS[lista.mod] || {}).nome || lista.nome;
      const chip = elem("button", "chip",
        nome + ' <span class="cnt">' + lista.questoes.length + "</span>");
      chip.type = "button";
      chip.dataset.lista = lista.id;
      chip.title = plural(lista.questoes.length, "questão", "questões");
      chip.setAttribute("aria-pressed", String(lista.id === listaAberta));
      chip.addEventListener("click", () => abrirLista(lista.id));
      linha.appendChild(chip);
    });

    caixa.appendChild(linha);
    nav.appendChild(caixa);
  });
}

function abrirLista(id) {
  const lista = LISTAS.find(l => l.id === id) || LISTAS[0];
  listaAberta = lista.id;

  $$("#navListas .chip").forEach(c =>
    c.setAttribute("aria-pressed", String(c.dataset.lista === lista.id)));

  const alvo = $("#listaConteudo");
  alvo.innerHTML = "";
  alvo.appendChild(montarCabecalhoLista(lista));

  const ol = elem("ol", "lista-questoes");
  lista.questoes.forEach(questao => ol.appendChild(montarQuestaoLista(questao, lista)));
  alvo.appendChild(ol);

  marcarRolaveis(alvo);
}

/* Os dois PDFs, nomeados, mais o atalho para a matéria. */
function montarCabecalhoLista(lista) {
  const cab = elem("div", "lista-cab");
  cab.innerHTML =
    "<h2>" + lista.nome + "</h2>" +
    '<div class="lista-pdfs">' +
      montarChipPdf("atividade", lista.atividade) +
      montarChipPdf("conteúdo", lista.conteudo) +
    "</div>" +
    (lista.intro ? '<p class="lista-intro">' + lista.intro + "</p>" : "");

  const meta = MODULOS[lista.mod];
  if (meta) {
    const ir = elem("button", "btn-mini anima", "ler a matéria de " + meta.nome + " &rarr;");
    ir.type = "button";
    ir.addEventListener("click", () => abrirTopicoMateria(lista.mod));
    const acoes = elem("div", "pan-acoes");
    acoes.appendChild(ir);
    cab.appendChild(acoes);
  }
  return cab;
}

function montarChipPdf(rotulo, arquivo) {
  return '<span class="pdf-chip pdf-' + (rotulo === "atividade" ? "atv" : "cont") + '">' +
    '<span class="rot">' + rotulo + "</span><code>" + arquivo + "</code></span>";
}

function montarQuestaoLista(questao, lista) {
  const item = elem("li", "lq");

  const cabecalho = elem("div", "lq-cab");
  cabecalho.innerHTML = '<span class="lq-n">' + questao.n + "</span><h3>" + questao.t + "</h3>";
  item.appendChild(cabecalho);

  const enunciado = elem("div", "lq-enun");
  enunciado.innerHTML = '<span class="rot">enunciado</span>' + questao.enunciado;
  item.appendChild(enunciado);

  const caixa = elem("details", "lq-res");
  const resumo = elem("summary", "", "ver resolução");
  caixa.appendChild(resumo);

  const corpo = elem("div", "lq-corpo");
  corpo.innerHTML = questao.resolucao;
  caixa.appendChild(corpo);

  if (questao.cod) {
    const pre = elem("pre", "cod");
    pre.textContent = questao.cod;            /* textContent: código não é HTML */
    caixa.appendChild(pre);
  }

  if (questao.ver) {
    const bloco = MATERIA.find(m => m.mod === questao.ver[0]);
    const secao = bloco && bloco.secoes.find(s => s.h.indexOf(questao.ver[1]) >= 0);
    if (secao) {
      const ir = elem("button", "btn-mini anima", "ver na matéria: " + secao.h + " &rarr;");
      ir.type = "button";
      ir.addEventListener("click", () => abrirTopicoMateria(questao.ver[0], questao.ver[1]));
      const acoes = elem("div", "pan-acoes");
      acoes.appendChild(ir);
      caixa.appendChild(acoes);
    }
  }

  item.appendChild(caixa);
  return item;
}

/* Abre a matéria no assunto (e no tópico, se vier o trecho do título). */
function abrirTopicoMateria(mod, trecho) {
  const bloco = MATERIA.find(m => m.mod === mod);
  if (!bloco) return;

  modMateria = mod;
  parteMateria = 0;
  montarNavMateria();
  mostrarAba("materia");

  const i = trecho ? bloco.secoes.findIndex(s => s.h.indexOf(trecho) >= 0) : -1;
  if (i >= 0) irParaTopico(i);
  else { renderMateria(); $("#navMateria").scrollIntoView({ block: "start" }); }
}
