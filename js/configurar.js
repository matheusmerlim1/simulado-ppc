/* ═══════════════════════════════════════════════════════════
   Tela inicial — filtros, contagens e coleções prontas.
   ═══════════════════════════════════════════════════════════ */

/* Chips de assunto. Reconstruídos a cada troca de prova, porque
   a P1 e a P2 não têm os mesmos assuntos. */
function montarModulos() {
  const alvo = $("#modulos");
  const visiveis = modulosVisiveis();

  /* mantém só o que existe nesta prova; se esvaziar, marca tudo */
  conf.mods = new Set(Array.from(conf.mods).filter(m => visiveis.includes(m)));
  if (conf.mods.size === 0) visiveis.forEach(m => conf.mods.add(m));

  alvo.innerHTML = "";
  visiveis.forEach(mod => {
    const quantas = baseProva().filter(q => q.mod === mod).length;

    const chip = document.createElement("button");
    chip.className = "chip";
    chip.dataset.mod = mod;
    chip.setAttribute("aria-pressed", String(conf.mods.has(mod)));
    chip.innerHTML = MODULOS[mod].nome + ' <span class="cnt">' + quantas + "</span>";

    chip.addEventListener("click", () => {
      if (conf.mods.has(mod)) conf.mods.delete(mod);
      else conf.mods.add(mod);
      chip.setAttribute("aria-pressed", String(conf.mods.has(mod)));
      atualizarContagem();
    });

    alvo.appendChild(chip);
  });
}

/* Resolve uma coleção em lista de questões. */
function questoesDaColecao(colecao) {
  return colecao.ids
    ? colecao.ids.map(id => BANCO.find(q => q.id === id)).filter(Boolean)
    : BANCO.filter(colecao.filtro);
}

function montarColecoes() {
  const alvo = $("#colecoes");
  alvo.innerHTML = "";

  COLECOES.forEach(colecao => {
    const lista = questoesDaColecao(colecao);
    if (!lista.length) return;

    const cartao = document.createElement("button");
    cartao.className = "colecao";
    cartao.innerHTML =
      '<span class="t">' + colecao.t + "</span>" +
      '<span class="s">' + lista.length + " questões · " + colecao.s + "</span>";

    /* lista de ids preserva a ordem; filtro é sorteado */
    cartao.addEventListener("click", () =>
      iniciar(colecao.ids ? lista : embaralhar(lista)));

    alvo.appendChild(cartao);
  });
}

function atualizarContagem() {
  const base = baseProva();

  $$("#dificuldades .cnt").forEach(el => {
    el.textContent = base.filter(q => q.dif === el.dataset.cnt).length;
  });
  $$("#tipos .cnt").forEach(el => {
    el.textContent = base.filter(q => q.tipo === el.dataset.cnt).length;
  });

  const disponiveis = selecionadas().length;
  const naRodada = conf.qtd === 0 ? disponiveis : Math.min(conf.qtd, disponiveis);

  $("#contagem").innerHTML = disponiveis
    ? "<span>disponíveis</span><b>" + disponiveis + "</b>" +
      "<span>· nesta rodada</span><b>" + naRodada + "</b>"
    : "";

  $("#avisoVazio").classList.toggle("hidden", disponiveis > 0);
  $("#btnComecar").disabled = disponiveis === 0;
}

/* Monta a fila conforme os filtros e começa. */
function comecarSimulado() {
  let lista = selecionadas();

  if (conf.ordem === "rand") {
    lista = embaralhar(lista);
  } else {
    const ordemMod = Object.keys(MODULOS);
    lista = lista.slice().sort((a, b) =>
      ordemMod.indexOf(a.mod) - ordemMod.indexOf(b.mod) || a.id.localeCompare(b.id));
  }

  if (conf.qtd > 0) lista = lista.slice(0, conf.qtd);
  iniciar(lista);
}

/* ── ligações ────────────────────────────────────────────── */

/* grupo de chips que liga/desliga vários valores de um mesmo campo */
function ligarChips(seletor, campo, chaveDataset) {
  $$(seletor + " .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const valor = chip.dataset[chaveDataset];
      if (conf[campo].has(valor)) conf[campo].delete(valor);
      else conf[campo].add(valor);
      chip.setAttribute("aria-pressed", String(conf[campo].has(valor)));
      atualizarContagem();
    });
  });
}

/* grupo segmentado: exatamente uma opção ativa */
function ligarSegmentado(seletor, aoEscolher) {
  $$(seletor + " button").forEach(botao => {
    botao.addEventListener("click", () => {
      $$(seletor + " button").forEach(o =>
        o.setAttribute("aria-pressed", String(o === botao)));
      aoEscolher(botao);
      atualizarContagem();
    });
  });
}

function ligarConfiguracao() {
  $$("#provas .prova").forEach(botao => {
    botao.addEventListener("click", () => {
      conf.prova = botao.dataset.prova;
      $$("#provas .prova").forEach(o =>
        o.setAttribute("aria-pressed", String(o === botao)));
      montarModulos();
      atualizarContagem();
    });
  });

  ligarChips("#dificuldades", "difs",  "dif");
  ligarChips("#tipos",        "tipos", "tipo");

  ligarSegmentado("#qtd",   b => conf.qtd   = parseInt(b.dataset.qtd, 10));
  ligarSegmentado("#ordem", b => conf.ordem = b.dataset.ordem);

  $("#btnTodosMods").addEventListener("click", () => {
    const visiveis = modulosVisiveis();
    const todosMarcados = conf.mods.size === visiveis.length;
    conf.mods = new Set(todosMarcados ? [] : visiveis);
    $$("#modulos .chip").forEach(chip =>
      chip.setAttribute("aria-pressed", String(conf.mods.has(chip.dataset.mod))));
    atualizarContagem();
  });

  $("#btnComecar").addEventListener("click", comecarSimulado);
}
