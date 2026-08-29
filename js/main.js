/* ═══════════════════════════════════════════════════════════
   Ponto de entrada — liga tudo e monta a tela inicial.
   ═══════════════════════════════════════════════════════════ */

/* Atalhos: 1–4 escolhem a alternativa, Enter verifica e avança.
   Dentro de um campo de texto, só Ctrl+Enter avança. */
function ligarTeclado() {
  document.addEventListener("keydown", (e) => {
    if ($("#telaQuestao").classList.contains("hidden")) return;

    const digitando = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    const q = run.fila[run.i];
    const resposta = run.resp[run.i];

    if (!digitando && /^[1-4]$/.test(e.key) && (q.tipo === "mc" || q.tipo === "vf")) {
      const opcao = $$("#qResposta .opc")[parseInt(e.key, 10) - 1];
      if (opcao && !opcao.disabled) { opcao.click(); e.preventDefault(); }
      return;
    }

    if (e.key === "Enter" && (!digitando || e.ctrlKey)) {
      e.preventDefault();
      if (resposta && resposta.verificado) $("#btnProxima").click();
      else $("#btnVerificar").click();
    }
  });
}

/* Botões presentes em mais de uma tela. */
function ligarNavegacaoGlobal() {
  $("#btnHome").addEventListener("click", voltarInicio);
  $("#btnInicio").addEventListener("click", voltarInicio);
  $("#btnInicioQ").addEventListener("click", voltarInicio);
  $("#btnEstudar").addEventListener("click", () => abrirEstudo());
  $("#btnIrMateria").addEventListener("click", () => abrirEstudo());
  $("#btnVoltarEstudo").addEventListener("click", voltarInicio);
  $("#btnTema").addEventListener("click", alternarTema);
}

function iniciarApp() {
  /* o tema já foi aplicado pelo script inline do <head>;
     aqui só garantimos a coerência se o armazenamento falhou lá */
  aplicarTema(lsGet("ppc-tema"));

  ligarNavegacaoGlobal();
  ligarConfiguracao();
  ligarQuestao();
  ligarResultado();
  ligarEstudo();
  ligarTeclado();

  $("#metaTotal").textContent = BANCO.length;
  montarModulos();
  montarColecoes();
  atualizarContagem();

  $("#trilha").style.display = "none";
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", iniciarApp);
else
  iniciarApp();
