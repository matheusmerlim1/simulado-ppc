/* ═══════════════════════════════════════════════════════════
   Tela de estudo — matéria explicada e consulta rápida.
   ═══════════════════════════════════════════════════════════ */

let modMateria = MATERIA[0].mod;

function abrirEstudo(mod) {
  if (mod) modMateria = mod;
  montarFormulas();
  montarNavMateria();
  renderMateria();
  mostrar("#telaEstudo");
}

/* ── consulta rápida: fichas de fórmulas ─────────────────── */
function montarFormulas() {
  const alvo = $("#resumoGrid");
  if (alvo.childElementCount) return;          /* conteúdo fixo, monta uma vez */

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

  const cabecalho = document.createElement("div");
  cabecalho.className = "materia-titulo";
  cabecalho.innerHTML =
    "<h2>" + MODULOS[modMateria].nome + "</h2>" +
    '<span class="conta">' + bloco.secoes.length + " tópicos · " +
    quantasQuestoes + " questões no banco · " + MODULOS[modMateria].prova + "</span>";
  alvo.appendChild(cabecalho);

  bloco.secoes.forEach(secao => alvo.appendChild(montarSecao(secao)));

  $("#btnTreinarAssunto").textContent = "Treinar " + MODULOS[modMateria].nome;
  $("#btnTreinarAssunto").disabled = quantasQuestoes === 0;
}

/* Uma seção: título, texto, exemplo de código e caixa de destaque. */
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

/* ── ligações ────────────────────────────────────────────── */
function ligarEstudo() {
  $$("#abasEstudo button").forEach(aba => {
    aba.addEventListener("click", () => {
      $$("#abasEstudo button").forEach(o =>
        o.setAttribute("aria-pressed", String(o === aba)));

      const eMateria = aba.dataset.aba === "materia";
      $("#abaMateria").classList.toggle("hidden", !eMateria);
      $("#abaFormulas").classList.toggle("hidden", eMateria);
      $("#btnTreinarAssunto").classList.toggle("hidden", !eMateria);
    });
  });

  /* da matéria direto para as questões do mesmo assunto */
  $("#btnTreinarAssunto").addEventListener("click", () => {
    const lista = BANCO.filter(q => q.mod === modMateria);
    if (lista.length) iniciar(embaralhar(lista).slice(0, 10));
  });
}
