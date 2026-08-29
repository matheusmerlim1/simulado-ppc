/* ═══════════════════════════════════════════════════════════
   Tela de resultado — nota, desempenho por assunto e revisão.
   ═══════════════════════════════════════════════════════════ */

function finalizar() {
  const p = placar();
  const total = run.fila.length;
  const pct = p.feitas ? Math.round(100 * p.acertos / p.feitas) : 0;

  $("#resEyebrow").textContent = p.feitas < total
    ? "Simulado encerrado · " + (total - p.feitas) + " sem resposta"
    : "Simulado encerrado";

  $("#resNota").innerHTML = p.acertos + "<small>/" + p.feitas + "</small>";
  $("#resFrase").textContent = fraseDoResultado(p.feitas, pct) +
                               " Aproveitamento: " + pct + "%.";

  montarBarras();
  montarRevisao();

  $("#btnRefazerErros").disabled = erradas().length === 0;
  mostrar("#telaResultado");
}

function fraseDoResultado(feitas, pct) {
  if (!feitas)  return "Você não respondeu nenhuma questão desta rodada.";
  if (pct >= 85) return "Domínio consistente do conteúdo. Vale rodar a coleção das difíceis para achar o que ainda escapa.";
  if (pct >= 70) return "Base sólida, com pontos a fechar. Comece pela revisão abaixo, dos assuntos mais fracos.";
  if (pct >= 50) return "Metade do caminho. Leia os gabaritos com atenção e refaça só os erros.";
  return "Vale voltar ao resumo de fórmulas e definições antes de repetir a rodada.";
}

function erradas() {
  return run.fila.filter((q, k) => avaliada(run.resp[k]) && !run.resp[k].correto);
}

/* ── desempenho por assunto, do pior para o melhor ───────── */
function montarBarras() {
  const alvo = $("#resBarras");
  alvo.innerHTML = "";

  const porMod = {};
  run.fila.forEach((q, k) => {
    if (!avaliada(run.resp[k])) return;
    porMod[q.mod] = porMod[q.mod] || { ok: 0, n: 0 };
    porMod[q.mod].n++;
    if (run.resp[k].correto) porMod[q.mod].ok++;
  });

  const mods = Object.keys(porMod);
  if (!mods.length) {
    alvo.innerHTML = '<p style="color:var(--muted);font-size:.9rem">' +
                     "Nada respondido nesta rodada.</p>";
    return;
  }

  mods.sort((a, b) => (porMod[a].ok / porMod[a].n) - (porMod[b].ok / porMod[b].n));

  mods.forEach(mod => {
    const dado = porMod[mod];
    const fracao = dado.ok / dado.n;

    const linha = document.createElement("div");
    linha.className = "barra-linha";
    linha.innerHTML =
      '<span class="barra-nome">' + MODULOS[mod].nome + "</span>" +
      '<span class="barra-trilho"><span class="barra-fill" style="width:0%"></span></span>' +
      '<span class="barra-val">' + dado.ok + "/" + dado.n + "</span>";
    alvo.appendChild(linha);

    /* largura aplicada no quadro seguinte, para a transição acontecer */
    requestAnimationFrame(() => {
      const barra = linha.querySelector(".barra-fill");
      barra.style.width = Math.round(fracao * 100) + "%";
      barra.style.background =
        fracao >= 0.7 ? "var(--ok)" : fracao >= 0.4 ? "var(--sinal)" : "var(--err)";
    });
  });
}

/* ── revisão: todas as questões, com gabarito recolhível ─── */
function montarRevisao() {
  const alvo = $("#resRevisao");
  alvo.innerHTML = "";

  run.fila.forEach((q, k) => {
    const resposta = run.resp[k];
    const item = document.createElement("div");
    item.className = "rev-item";

    const marca = !avaliada(resposta) ? "–" : resposta.correto ? "✓" : "✗";
    const classe = !avaliada(resposta) ? "" : resposta.correto ? "ok" : "err";
    const semTags = q.enunciado.replace(/<[^>]+>/g, "");
    const resumo = semTags.length > 150 ? semTags.slice(0, 150) + "…" : semTags;

    const cabecalho = document.createElement("button");
    cabecalho.className = "rev-cab";
    cabecalho.setAttribute("aria-expanded", "false");
    cabecalho.innerHTML = '<span class="rev-mark ' + classe + '">' + marca + "</span>" +
                          "<span>" + resumo + "</span>";

    const corpo = document.createElement("div");
    corpo.className = "rev-corpo retorno-corpo hidden";

    let html = "";
    if (q.tipo === "mc" || q.tipo === "vf")
      html += "<p><b>Resposta certa:</b> " + "ABCD"[q.correta] + ") " +
              opcoesDe(q)[q.correta] + "</p><br>";
    corpo.innerHTML = html + q.gabarito;

    if (q.modelo) {
      const pre = document.createElement("pre");
      pre.className = "cod";
      pre.textContent = q.modelo;
      corpo.appendChild(pre);
    }

    cabecalho.addEventListener("click", () => {
      const aberto = !corpo.classList.toggle("hidden");
      cabecalho.setAttribute("aria-expanded", String(aberto));
    });

    item.appendChild(cabecalho);
    item.appendChild(corpo);
    alvo.appendChild(item);
  });
}

function ligarResultado() {
  $("#btnRefazerErros").addEventListener("click", () => {
    const lista = erradas();
    if (lista.length) iniciar(embaralhar(lista));
  });
  $("#btnMesmo").addEventListener("click", () => iniciar(run.fila.slice()));
  $("#btnNovo").addEventListener("click", () => { run = null; mostrar("#telaInicio"); });
}
