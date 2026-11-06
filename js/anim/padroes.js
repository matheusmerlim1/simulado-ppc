/* ═══════════════════════════════════════════════════════════
   Cena: os quatro padrões de projeto paralelo da aula 8, cada um
   dividindo os mesmos dados entre dois nós, P0 e P1.

     fork/join  soma de dois vetores — cada nó numa metade
     map        um kernel por saída — a saída f vai para o nó f%2
     stencil    filtro da média 3x3 — cada nó num bloco da grade
     reducao    soma do vetor — parciais e depois a combinação

   Os valores são calculados aqui, não escritos à mão: o que a
   tela mostra é o resultado da conta.
   ═══════════════════════════════════════════════════════════ */
(function () {

  const N = 8;
  const V1 = [1, 2, 3, 4, 5, 6, 7, 8];
  const V2 = [10, 20, 30, 40, 50, 60, 70, 80];
  const G  = [1, 2, 3, 4, 5, 6, 7, 8];

  const LADO = 6;                                  /* grade do stencil */
  const grade = [];
  for (let r = 0; r < LADO; r++) {
    grade.push([]);
    for (let c = 0; c < LADO; c++) grade[r].push((r * LADO + c) % 9 + 1);
  }

  /* os dois blocos do slide: um em cima à esquerda, outro embaixo à direita */
  const BLOCO = [
    { no: 0, celulas: [[1, 1], [1, 2], [2, 1], [2, 2]] },
    { no: 1, celulas: [[3, 3], [3, 4], [4, 3], [4, 4]] }
  ];

  function media3x3(r, c) {
    let s = 0;
    for (let i = r - 1; i <= r + 1; i++)
      for (let j = c - 1; j <= c + 1; j++) s += grade[i][j];
    return Math.round(s / 9);
  }

  /* ── roteiros ──────────────────────────────────────────── */

  function roteiroForkJoin() {
    const passos = [];
    passos.push({ feitos: 0, ativos: [], legenda:
      "<b>fork/join</b> é a divisão mais simples: o vetor tem 8 posições e há 2 nós, " +
      "então <b>P0</b> fica com as posições 0 a 3 e <b>P1</b> com as 4 a 7. Nenhuma posição " +
      "depende de outra — é o caso <b>embaraçosamente paralelo</b>." });

    for (let k = 0; k < 4; k++) {
      passos.push({ feitos: k + 1, ativos: [k, k + 4], legenda:
        "Os dois nós trabalham <b>ao mesmo tempo</b>: P0 calcula a posição " + k +
        " (" + V1[k] + " + " + V2[k] + " = " + (V1[k] + V2[k]) + ") enquanto P1 calcula a posição " +
        (k + 4) + " (" + V1[k + 4] + " + " + V2[k + 4] + " = " + (V1[k + 4] + V2[k + 4]) + ")." });
    }

    passos.push({ feitos: 4, ativos: [], fim: true, legenda:
      "<b>join</b>: o fluxo principal espera os dois terminarem e o vetor soma está completo. " +
      "Com 2 nós o tempo cai pela metade — e cairia a um quarto com 4 nós, porque " +
      "<b>não há comunicação nenhuma</b> entre as faixas." });
    return passos;
  }

  function roteiroMap() {
    const passos = [];
    passos.push({ feitos: 0, ativos: [], legenda:
      "No <b>map</b>, a mesma função — o <b><i>kernel</i></b> — é aplicada para produzir cada saída. " +
      "O exemplo da aula é a Transformada Discreta de Cossenos: cada <b>G(f)</b> percorre o " +
      "vetor <b>g</b> inteiro. As saídas são independentes entre si, então G(0) vai para P0, " +
      "G(1) para P1, e assim por diante." });

    for (let k = 0; k < 4; k++) {
      passos.push({ feitos: k + 1, ativos: [2 * k, 2 * k + 1], legenda:
        "P0 calcula <b>G(" + (2 * k) + ")</b> e P1 calcula <b>G(" + (2 * k + 1) + ")</b>, cada um " +
        "lendo <b>todo</b> o vetor g. Ler o mesmo dado ao mesmo tempo não é problema: " +
        "leitura simultânea não causa condição de corrida." });
    }

    passos.push({ feitos: 4, ativos: [], fim: true, legenda:
      "As 8 saídas ficaram prontas em 4 rodadas. <b>Diferença para o fork/join:</b> ali cada nó " +
      "lia só a sua faixa; aqui <b>todos leem o vetor inteiro</b> — o que se divide são as " +
      "<b>saídas</b>, não a entrada." });
    return passos;
  }

  function roteiroStencil() {
    const passos = [];
    passos.push({ feitas: [], janelas: [], legenda:
      "No <b>stencil</b>, cada saída depende de uma <b>vizinhança</b>. O exemplo da aula é o " +
      "filtro da média (passa-baixa): o novo valor de uma célula é a média dos <b>9</b> valores " +
      "da janela 3&times;3 em volta dela. P0 cuida de um bloco da imagem e P1 de outro." });

    for (let k = 0; k < 4; k++) {
      const janelas = BLOCO.map(b => ({ r: b.celulas[k][0], c: b.celulas[k][1], no: b.no }));
      const feitas = [];
      BLOCO.forEach(b => {
        for (let i = 0; i <= k; i++)
          feitas.push({ r: b.celulas[i][0], c: b.celulas[i][1], no: b.no,
                        v: media3x3(b.celulas[i][0], b.celulas[i][1]) });
      });
      passos.push({ feitas, janelas, legenda:
        "A janela de P0 está na célula (" + janelas[0].r + "," + janelas[0].c + ") e dá <b>" +
        media3x3(janelas[0].r, janelas[0].c) + "</b>; a de P1, na (" + janelas[1].r + "," +
        janelas[1].c + "), dá <b>" + media3x3(janelas[1].r, janelas[1].c) + "</b>. " +
        "Repare que a janela <b>invade as células vizinhas</b> — é isso que diferencia o stencil do map." });
    }

    const todas = [];
    BLOCO.forEach(b => b.celulas.forEach(([r, c]) =>
      todas.push({ r, c, no: b.no, v: media3x3(r, c) })));
    passos.push({ feitas: todas, janelas: [], fim: true, legenda:
      "Blocos prontos. <b>O custo escondido do stencil:</b> quando dois nós ficam com blocos " +
      "<b>vizinhos</b>, a janela de um precisa de células que estão com o outro. Essas bordas " +
      "trocadas são as <i>ghost cells</i> — comunicação que o map não tem, e que aparece no " +
      "overhead quando se aumenta o número de nós." });
    return passos;
  }

  function roteiroReducao() {
    const passos = [];
    const soma = (ini, fim) => V1.slice(ini, fim).reduce((a, b) => a + b, 0);

    passos.push({ etapa: 0, lidos: 0, parciais: [0, 0], total: null, legenda:
      "Na <b>redução</b>, o que se combina são os <b>resultados intermediários</b>. O vetor tem " +
      "8 elementos e cada nó soma a sua metade — nenhuma trava, porque cada parcial é uma " +
      "variável <b>privada</b> do nó." });

    for (let k = 0; k < 4; k++) {
      passos.push({ etapa: 1, lidos: k + 1, parciais: [soma(0, k + 1), soma(4, 5 + k)],
        ativos: [k, k + 4], total: null, legenda:
        "P0 acumula o " + V1[k] + " (parcial = <b>" + soma(0, k + 1) + "</b>) e P1 acumula o " +
        V1[k + 4] + " (parcial = <b>" + soma(4, 5 + k) + "</b>). As duas somas correm em paralelo, " +
        "sem se enxergar." });
    }

    passos.push({ etapa: 2, lidos: 4, parciais: [10, 26], total: null, enviando: true, legenda:
      "<b>Passo 1 terminado:</b> P0 tem 10 e P1 tem 26. Agora vem a parte que o fork/join não " +
      "tem — a <b>combinação</b>. P1 envia a parcial dele para P0." });

    passos.push({ etapa: 3, lidos: 4, parciais: [10, 26], total: 36, fim: true, legenda:
      "<b>Passo 2:</b> P0 soma as duas parciais e chega a <b>36</b>. Com 2 nós é uma etapa de " +
      "combinação; com p nós, o mestre recebendo de todos leva <b>p&minus;1</b> etapas, e a " +
      "combinação <b>em árvore</b> leva <b>log<sub>2</sub>(p)</b>." });
    return passos;
  }

  function roteiro(modo) {
    if (modo === "forkjoin") return roteiroForkJoin();
    if (modo === "map")      return roteiroMap();
    if (modo === "stencil")  return roteiroStencil();
    return roteiroReducao();
  }

  /* ── desenho ───────────────────────────────────────────── */

  function cabecalho(texto) {
    return '<div class="ppl-nos"><span class="ppl-no no0">P0</span>' +
           '<span class="ppl-no no1">P1</span><span class="ppl-oque">' + texto + "</span></div>";
  }

  function linhaVetor(rotulo, valores, classe) {
    let h = '<div class="ppl-linha ' + classe + '"><span class="rot">' + rotulo + "</span>";
    valores.forEach((v, i) =>
      h += '<b class="ppl-cel" data-i="' + i + '">' + (v === null ? "" : v) + "</b>");
    return h + "</div>";
  }

  function montarForkJoin(palco) {
    palco.innerHTML = cabecalho("soma de dois vetores") +
      linhaVetor("v1", V1, "entrada") +
      linhaVetor("v2", V2, "entrada") +
      linhaVetor("soma", V1.map(() => null), "saida");

    const saidas = palco.querySelectorAll(".saida .ppl-cel");
    return function desenhar(e) {
      saidas.forEach((cel, i) => {
        const dono = i < 4 ? 0 : 1;
        const pronto = (i < 4 ? i : i - 4) < e.feitos;
        cel.textContent = pronto ? V1[i] + V2[i] : "";
        cel.className = "ppl-cel" + (pronto ? " pronta no" + dono : "") +
                        (e.ativos.includes(i) ? " agora" : "");
      });
      palco.querySelectorAll(".entrada .ppl-cel").forEach((cel, i) =>
        cel.className = "ppl-cel" + (e.ativos.includes(i) ? " agora" : ""));
    };
  }

  function montarMap(palco) {
    palco.innerHTML = cabecalho("um kernel por saída") +
      linhaVetor("g", G, "entrada") +
      linhaVetor("G", G.map(() => null), "saida");

    const saidas = palco.querySelectorAll(".saida .ppl-cel");
    const entradas = palco.querySelectorAll(".entrada .ppl-cel");
    return function desenhar(e) {
      saidas.forEach((cel, f) => {
        const pronto = Math.floor(f / 2) < e.feitos;
        cel.textContent = pronto ? "G" + f : "";
        cel.className = "ppl-cel" + (pronto ? " pronta no" + (f % 2) : "") +
                        (e.ativos.includes(f) ? " agora" : "");
      });
      /* no map a entrada inteira e lida a cada saida */
      entradas.forEach(cel => cel.className = "ppl-cel" + (e.ativos.length ? " lendo" : ""));
    };
  }

  function montarStencil(palco) {
    let h = cabecalho("filtro da média 3&times;3") + '<div class="ppl-grade">';
    for (let r = 0; r < LADO; r++)
      for (let c = 0; c < LADO; c++)
        h += '<b class="ppl-cel" data-r="' + r + '" data-c="' + c + '">' + grade[r][c] + "</b>";
    palco.innerHTML = h + "</div>";

    const celulas = palco.querySelectorAll(".ppl-grade .ppl-cel");
    return function desenhar(e) {
      celulas.forEach(cel => {
        const r = +cel.dataset.r, c = +cel.dataset.c;
        const feita = e.feitas.find(f => f.r === r && f.c === c);
        const naJanela = e.janelas.find(j => Math.abs(j.r - r) <= 1 && Math.abs(j.c - c) <= 1);
        const centro = e.janelas.find(j => j.r === r && j.c === c);

        cel.textContent = feita ? feita.v : grade[r][c];
        cel.className = "ppl-cel" +
          (feita ? " pronta no" + feita.no : "") +
          (naJanela ? " janela j" + naJanela.no : "") +
          (centro ? " agora" : "");
      });
    };
  }

  function montarReducao(palco) {
    palco.innerHTML = cabecalho("soma dos elementos") +
      linhaVetor("vetor", V1, "entrada") +
      '<div class="ppl-parciais">' +
        '<div class="ppl-parcial p0"><span class="rot">parcial de P0</span><b>0</b></div>' +
        '<div class="ppl-seta">&rarr;</div>' +
        '<div class="ppl-parcial p1"><span class="rot">parcial de P1</span><b>0</b></div>' +
      "</div>" +
      '<div class="ppl-total"><span class="rot">total</span><b>—</b></div>';

    const entradas = palco.querySelectorAll(".entrada .ppl-cel");
    const p0 = palco.querySelector(".ppl-parcial.p0 b");
    const p1 = palco.querySelector(".ppl-parcial.p1 b");
    const seta = palco.querySelector(".ppl-seta");
    const total = palco.querySelector(".ppl-total b");

    return function desenhar(e) {
      entradas.forEach((cel, i) => {
        const dono = i < 4 ? 0 : 1;
        const lido = (i < 4 ? i : i - 4) < e.lidos;
        cel.className = "ppl-cel" + (lido ? " pronta no" + dono : "") +
                        (e.ativos && e.ativos.includes(i) ? " agora" : "");
      });
      p0.textContent = e.parciais[0];
      p1.textContent = e.parciais[1];
      seta.className = "ppl-seta" + (e.enviando ? " ativa" : "");
      total.textContent = e.total === null ? "—" : e.total;
      total.className = e.total === null ? "" : "pronta no0";
    };
  }

  function montar(palco, modo) {
    if (modo === "forkjoin") return montarForkJoin(palco);
    if (modo === "map")      return montarMap(palco);
    if (modo === "stencil")  return montarStencil(palco);
    return montarReducao(palco);
  }

  registrarAnimacao({
    id: "padroes-paralelos",
    nome: "Padrões de projeto paralelo",
    titulo: "Os quatro padrões de projeto paralelo",
    ideia: "Os mesmos dois nós, P0 e P1, dividindo os dados de quatro formas diferentes: " +
           "por faixa, por saída, por bloco com vizinhança, e combinando parciais.",
    modos: [
      { id: "forkjoin", rotulo: "fork/join" },
      { id: "map",      rotulo: "map" },
      { id: "stencil",  rotulo: "stencil" },
      { id: "reducao",  rotulo: "redução" }
    ],
    montar, roteiro
  });
})();
