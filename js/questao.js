/* ═══════════════════════════════════════════════════════════
   Execução do simulado — trilha, renderização e correção.
   ═══════════════════════════════════════════════════════════ */

/* Uma questão só entra no placar depois de ter um veredito.
   Discursivas e código ficam com correto = null até a autoavaliação. */
function avaliada(resposta) {
  return !!resposta && resposta.verificado && typeof resposta.correto === "boolean";
}

function placar() {
  const feitas = run.resp.filter(avaliada);
  return { acertos: feitas.filter(r => r.correto).length, feitas: feitas.length };
}

/* ── início da rodada ────────────────────────────────────── */
function iniciar(lista) {
  if (!lista.length) return;

  run = { fila: lista, i: 0, resp: lista.map(() => null) };

  const trilha = $("#trilha");
  trilha.innerHTML = "";
  lista.forEach(() => trilha.appendChild(document.createElement("span")));

  mostrar("#telaQuestao");
  render();
}

/* ── indicadores do topo ─────────────────────────────────── */
function atualizarTrilha() {
  const segmentos = $$("#trilha span");
  run.resp.forEach((resposta, k) => {
    const seg = segmentos[k];
    if (!seg) return;
    seg.className = "";
    if (avaliada(resposta)) seg.classList.add(resposta.correto ? "is-ok" : "is-err");
    if (k === run.i) seg.classList.add("is-now");
  });
}

function atualizarPlacar() {
  const p = placar();
  $("#statQNum").textContent = (run.i + 1) + "/" + run.fila.length;
  $("#statANum").textContent = p.acertos + "/" + p.feitas;
}

/* ── renderização ────────────────────────────────────────── */
function render() {
  const q = run.fila[run.i];
  const resposta = run.resp[run.i];

  $("#qIdx").textContent   = String(run.i + 1).padStart(2, "0");
  $("#qMod").textContent   = MODULOS[q.mod].nome;
  $("#qDif").textContent   = DIF_NOME[q.dif];
  $("#qDif").className     = "selo dif-" + q.dif;
  $("#qFonte").textContent = q.fonte;          /* texto puro, sem HTML */
  $("#qEnunciado").innerHTML = q.enunciado;

  montarApoio(q);
  montarResposta(q, resposta);
  montarRetorno(q, resposta);

  atualizarTrilha();
  atualizarPlacar();

  const respondida = !!(resposta && resposta.verificado);
  $("#btnVoltar").disabled = run.i === 0;
  $("#btnVerificar").classList.toggle("hidden", respondida);
  $("#btnPular").classList.toggle("hidden", respondida);
  $("#btnProxima").classList.toggle("hidden", !respondida);
  $("#btnProxima").textContent =
    run.i === run.fila.length - 1 ? "Ver resultado" : "Próxima →";
}

/* material de apoio: bloco de código e tabelas de dados */
function montarApoio(q) {
  const alvo = $("#qExtra");
  alvo.innerHTML = "";

  if (q.cod) {
    const pre = document.createElement("pre");
    pre.className = "cod";
    pre.textContent = q.cod;                   /* textContent: código não é HTML */
    alvo.appendChild(pre);
  }
  if (q.tabela) {
    const bloco = document.createElement("div");
    bloco.innerHTML = q.tabela;
    alvo.appendChild(bloco);
  }
}

function montarResposta(q, resposta) {
  const alvo = $("#qResposta");
  alvo.innerHTML = "";
  const travado = !!(resposta && resposta.verificado);

  if (q.tipo === "mc" || q.tipo === "vf") {
    alvo.appendChild(montarAlternativas(q, resposta, travado));
    return;
  }
  montarCampoTexto(alvo, q, resposta, travado);
}

function montarAlternativas(q, resposta, travado) {
  const lista = document.createElement("div");
  lista.className = "opcoes";

  opcoesDe(q).forEach((texto, k) => {
    const opc = document.createElement("button");
    opc.className = "opc";
    opc.disabled = travado;
    opc.setAttribute("aria-pressed", String(!!resposta && resposta.escolha === k));
    opc.innerHTML = '<span class="letra">' + "ABCD"[k] + "</span><span>" + texto + "</span>";

    if (travado) {
      if (k === q.correta)             opc.classList.add("marc-ok");
      else if (k === resposta.escolha) opc.classList.add("marc-err");
      else                             opc.classList.add("apagada");
    }

    opc.addEventListener("click", () => {
      run.resp[run.i] = { escolha: k, verificado: false };
      $$("#qResposta .opc").forEach((o, j) =>
        o.setAttribute("aria-pressed", String(j === k)));
    });

    lista.appendChild(opc);
  });

  return lista;
}

function montarCampoTexto(alvo, q, resposta, travado) {
  const campo = document.createElement("textarea");
  campo.className = "resp" + (q.tipo === "disc" ? " disc" : "");
  campo.placeholder = q.tipo === "disc"
    ? "Escreva sua resposta como escreveria na prova. Depois compare com o gabarito."
    : "Escreva seu código aqui. Tab indenta.";
  campo.value = (resposta && resposta.texto) || "";
  campo.disabled = travado;

  campo.addEventListener("input", () => {
    const atual = run.resp[run.i] || { verificado: false };
    atual.texto = campo.value;
    run.resp[run.i] = atual;
  });

  /* Tab indenta em vez de sair do campo */
  campo.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const ini = campo.selectionStart, fim = campo.selectionEnd;
    campo.value = campo.value.slice(0, ini) + "  " + campo.value.slice(fim);
    campo.selectionStart = campo.selectionEnd = ini + 2;
  });

  alvo.appendChild(campo);

  const dica = document.createElement("p");
  dica.className = "dica-campo";
  dica.textContent = q.tipo === "disc"
    ? "Sem resposta automática: você compara com o gabarito e marca você mesmo."
    : "A verificação procura os elementos essenciais e mostra uma solução de referência.";
  alvo.appendChild(dica);
}

/* ── gabarito ────────────────────────────────────────────── */
function montarRetorno(q, resposta) {
  const alvo = $("#qRetorno");
  alvo.innerHTML = "";
  if (!resposta || !resposta.verificado) return;

  const automatica = q.tipo === "mc" || q.tipo === "vf";
  const caixa = document.createElement("div");
  caixa.className = "retorno" +
    (resposta.correto === true ? " r-ok" : resposta.correto === false ? " r-err" : "");

  const cabecalho = document.createElement("div");
  cabecalho.className = "retorno-cab";
  cabecalho.textContent = automatica
    ? (resposta.correto ? "✓ Certo" : "✗ Errado")
    : resposta.correto === true  ? "✓ Marcado como acerto"
    : resposta.correto === false ? "✗ Marcado como erro"
    : "Gabarito";
  caixa.appendChild(cabecalho);

  const corpo = document.createElement("div");
  corpo.className = "retorno-corpo";

  if (q.tipo === "code" && q.chaves) corpo.appendChild(montarChecklist(q, resposta));

  const explicacao = document.createElement("div");
  explicacao.innerHTML = q.gabarito;
  corpo.appendChild(explicacao);

  if (q.modelo) {
    const rotulo = document.createElement("p");
    rotulo.innerHTML = "<b>Solução de referência</b>";
    rotulo.style.marginTop = "14px";
    corpo.appendChild(rotulo);

    const pre = document.createElement("pre");
    pre.className = "cod";
    pre.textContent = q.modelo;
    corpo.appendChild(pre);
  }

  caixa.appendChild(corpo);

  if (!automatica && resposta.correto === null)
    caixa.appendChild(montarAutoavaliacao());

  alvo.appendChild(caixa);
}

/* elementos essenciais encontrados (ou não) na resposta de código */
function montarChecklist(q, resposta) {
  const escrito = (resposta.texto || "").toLowerCase();
  const lista = document.createElement("ul");
  lista.className = "checklist";

  q.chaves.forEach(chave => {
    const tem = escrito.indexOf(chave.toLowerCase()) !== -1;
    const item = document.createElement("li");
    item.className = tem ? "tem" : "falta";
    item.textContent = (tem ? "✓ " : "✗ ") + chave;
    lista.appendChild(item);
  });

  return lista;
}

function montarAutoavaliacao() {
  const bloco = document.createElement("div");
  bloco.className = "autoaval";
  bloco.innerHTML = '<span class="lbl">Como você foi?</span>';

  [["Acertei", true], ["Errei", false]].forEach(([rotulo, valor]) => {
    const botao = document.createElement("button");
    botao.className = "btn " + (valor ? "btn-primario" : "btn-sec");
    botao.style.padding = "8px 18px";
    botao.textContent = rotulo;
    botao.addEventListener("click", () => {
      run.resp[run.i].correto = valor;
      render();
    });
    bloco.appendChild(botao);
  });

  return bloco;
}

/* ── ações ───────────────────────────────────────────────── */
function verificar() {
  const q = run.fila[run.i];
  const resposta = run.resp[run.i] || {};

  if (q.tipo === "mc" || q.tipo === "vf") {
    if (resposta.escolha === undefined || resposta.escolha === null) {
      const primeira = $("#qResposta .opc");
      if (primeira) primeira.focus();
      return;
    }
    resposta.correto = resposta.escolha === q.correta;
  } else {
    resposta.correto = null;                   /* aguarda autoavaliação */
  }

  resposta.verificado = true;
  run.resp[run.i] = resposta;
  render();
}

function avancar() {
  if (run.i < run.fila.length - 1) { run.i++; render(); }
  else finalizar();
}

function ligarQuestao() {
  $("#btnVerificar").addEventListener("click", verificar);
  $("#btnPular").addEventListener("click", avancar);
  $("#btnProxima").addEventListener("click", avancar);
  $("#btnVoltar").addEventListener("click", () => {
    if (run.i > 0) { run.i--; render(); }
  });
}
