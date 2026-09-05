/* ═══════════════════════════════════════════════════════════
   Execução do simulado — trilha, renderização e correção.
   ═══════════════════════════════════════════════════════════ */

/* Uma questão só entra no placar depois de receber nota.
   Sem palavras-chave para corrigir, ela espera a autoavaliação. */
function avaliada(resposta) {
  return !!resposta && resposta.verificado && typeof resposta.pontos === "number";
}

/* Soma as notas parciais: 3 questões com 1, 0,75 e 0,4 dão 2,15 de 3. */
function placar() {
  const feitas = run.resp.filter(avaliada);
  return {
    pontos: feitas.reduce((soma, r) => soma + r.pontos, 0),
    feitas: feitas.length
  };
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
    if (avaliada(resposta)) seg.classList.add("is-" + faixaDaNota(resposta.pontos));
    if (k === run.i) seg.classList.add("is-now");
  });
}

function atualizarPlacar() {
  const p = placar();
  $("#statQNum").textContent = (run.i + 1) + "/" + run.fila.length;
  $("#statANum").textContent = fmtNota(p.pontos) + "/" + p.feitas;
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
  dica.textContent = q.chaves
    ? "A correção procura as palavras-chave da resposta e dá uma nota percentual."
    : "Sem resposta automática: você compara com o gabarito e marca você mesmo.";
  alvo.appendChild(dica);
}

/* ── gabarito ────────────────────────────────────────────── */
function montarRetorno(q, resposta) {
  const alvo = $("#qRetorno");
  alvo.innerHTML = "";
  if (!resposta || !resposta.verificado) return;

  const automatica = q.tipo === "mc" || q.tipo === "vf";
  const porChaves  = !automatica && typeof resposta.achadas === "number";
  const caixa = document.createElement("div");
  caixa.className = "retorno" +
    (avaliada(resposta) ? " r-" + faixaDaNota(resposta.pontos) : "");

  const cabecalho = document.createElement("div");
  cabecalho.className = "retorno-cab";
  const marca = { ok:"✓", parcial:"◐", err:"✗" };
  cabecalho.textContent = automatica
    ? (resposta.pontos ? "✓ Certo" : "✗ Errado")
    : porChaves
    ? marca[faixaDaNota(resposta.pontos)] +
      (resposta.ajustada ? " Nota ajustada à mão"
                         : " Nota " + Math.round(resposta.pontos * 100) + "%") +
      " — vale " + fmtNota(resposta.pontos) + " da questão"
    : resposta.pontos === 1 ? "✓ Marcado como acerto"
    : resposta.pontos === 0 ? "✗ Marcado como erro"
    : "Gabarito";
  caixa.appendChild(cabecalho);

  const corpo = document.createElement("div");
  corpo.className = "retorno-corpo";

  if (porChaves) {
    const nota = corrigirChaves(resposta.texto, q.chaves);
    corpo.appendChild(montarNota(nota));
    corpo.appendChild(montarChecklist(nota));
  }

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

  if (!automatica) caixa.appendChild(montarAutoavaliacao(resposta, porChaves));

  alvo.appendChild(caixa);
}

/* nota percentual: quantas palavras-chave apareceram na resposta */
function montarNota(nota) {
  const bloco = document.createElement("div");
  bloco.className = "nota-chaves";
  bloco.innerHTML =
    '<div class="nota-topo"><b>Nota automática</b>' +
    '<span class="nota-val">' + nota.pct + "%</span></div>" +
    '<div class="nota-trilho"><span class="nota-fill"></span></div>' +
    '<p class="nota-obs">' + nota.achadas + " de " + nota.total +
    " palavras-chave · abaixo de " + NOTA_MINIMA +
    "% a questão volta no refazer os erros</p>";

  /* mesma faixa da trilha e da caixa, para o cartoão contar uma história só */
  const cor = { ok:"var(--ok)", parcial:"var(--sinal)", err:"var(--err)" };

  /* largura aplicada no quadro seguinte, para a transição acontecer */
  requestAnimationFrame(() => {
    const barra = bloco.querySelector(".nota-fill");
    barra.style.width = nota.pct + "%";
    barra.style.background = cor[faixaDaNota(nota.pct / 100)];
  });

  return bloco;
}

/* palavras-chave encontradas (ou não) na resposta escrita */
function montarChecklist(nota) {
  const lista = document.createElement("ul");
  lista.className = "checklist";

  nota.itens.forEach(item => {
    const li = document.createElement("li");
    li.className = item.tem ? "tem" : "falta";
    li.textContent = (item.tem ? "✓ " : "✗ ") + item.rotulo;
    lista.appendChild(li);
  });

  return lista;
}

/* A nota por palavras-chave é um indicador, não um juiz: o gabarito manda, e
   depois de lê-lo o aluno pode dar a questão por inteira ou zerá-la. */
function montarAutoavaliacao(resposta, porChaves) {
  const bloco = document.createElement("div");
  bloco.className = "autoaval";
  bloco.innerHTML = '<span class="lbl">' +
    (porChaves ? "Leu o gabarito? A nota é sua para ajustar:"
               : "Como você foi?") + "</span>";

  const rotulos = porChaves ? ["Vale inteira", "Zerar"] : ["Acertei", "Errei"];

  [[rotulos[0], 1], [rotulos[1], 0]].forEach(([rotulo, valor]) => {
    const botao = document.createElement("button");
    const ativo = resposta.pontos === valor;
    botao.className = "btn " + (ativo ? "btn-primario" : "btn-sec");
    botao.style.padding = "8px 18px";
    botao.setAttribute("aria-pressed", String(ativo));
    botao.textContent = rotulo;
    botao.addEventListener("click", () => {
      run.resp[run.i].pontos = valor;
      run.resp[run.i].ajustada = true;
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
    resposta.pontos = resposta.escolha === q.correta ? 1 : 0;
  } else if (q.chaves) {
    const nota = corrigirChaves(resposta.texto, q.chaves);
    resposta.achadas = nota.achadas;
    resposta.total   = nota.total;
    resposta.pontos  = nota.pct / 100;         /* 60% viram 0,6 no placar */
  } else {
    delete resposta.pontos;                    /* aguarda autoavaliação */
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
