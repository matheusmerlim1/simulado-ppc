/* ═══════════════════════════════════════════════════════════
   Cena: concorrência × paralelismo.
   Três tarefas (A=4, B=2, C=3 unidades de CPU) escalonadas em
   Round Robin com fatia de 1 unidade, em 1, 2 ou 3 núcleos.
   ═══════════════════════════════════════════════════════════ */
(function () {

  const TAREFAS = [["A", 4], ["B", 2], ["C", 3]];
  const TOTAL = { A: 4, B: 2, C: 3 };
  const SERIAL = 9;

  /* grade[t][n] = tarefa no núcleo n durante a fatia t (null = ocioso) */
  function escalonar(nucleos) {
    let fila = TAREFAS.map(t => t[0]);
    const feito = { A: 0, B: 0, C: 0 };
    const grade = [];

    while (fila.length) {
      const rodando = fila.slice(0, nucleos);
      rodando.forEach(id => feito[id]++);
      const linha = rodando.slice();
      while (linha.length < nucleos) linha.push(null);
      grade.push(linha);
      /* quem não terminou volta para o fim da fila */
      fila = fila.slice(nucleos).concat(rodando.filter(id => feito[id] < TOTAL[id]));
    }
    return grade;
  }

  function lista(ids) {
    if (ids.length === 1) return ids[0];
    return ids.slice(0, -1).join(", ") + " e " + ids[ids.length - 1];
  }

  function roteiro(modo) {
    const nucleos = parseInt(modo, 10);
    const grade = escalonar(nucleos);
    const T = grade.length;
    const passos = [];
    const progresso = t => {               /* unidades feitas até a fatia t, inclusive */
      const p = { A: 0, B: 0, C: 0 };
      for (let s = 0; s <= t; s++) grade[s].forEach(id => { if (id) p[id]++; });
      return p;
    };

    passos.push({
      t: -1, grade, nucleos, cpu: grade[0].map(() => null), feito: { A: 0, B: 0, C: 0 }, trocas: 0,
      legenda: "Três tarefas prontas: <b>A</b> precisa de 4 unidades de CPU, <b>B</b> de 2 e <b>C</b> de 3. " +
        (nucleos === 1
          ? "Há um único núcleo, então só uma pode executar por vez."
          : "Há " + nucleos + " núcleos: até " + nucleos + " podem executar ao mesmo tempo.") +
        " O escalonador é Round Robin, com fatia de 1 unidade."
    });

    let trocas = 0;
    for (let t = 0; t < T; t++) {
      const rodando = grade[t].filter(Boolean);
      const antes = t > 0 ? progresso(t - 1) : { A: 0, B: 0, C: 0 };
      const agora = progresso(t);
      const esperando = TAREFAS.map(x => x[0])
        .filter(id => antes[id] < TOTAL[id] && !rodando.includes(id));
      /* terminou na fatia anterior: completa antes dela, incompleta antes de antes */
      const anteantes = progresso(t - 2);
      const terminaram = TAREFAS.map(x => x[0])
        .filter(id => antes[id] === TOTAL[id] && anteantes[id] < TOTAL[id]);

      if (t > 0) grade[t].forEach((id, n) => { if (id && grade[t - 1][n] && grade[t - 1][n] !== id) trocas++; });

      let texto = "<b>t = " + t + "</b> · ";
      if (terminaram.length) texto += lista(terminaram) + (terminaram.length > 1 ? " terminaram" : " terminou") + " e saiu da fila. ";

      if (nucleos === 1) {
        texto += "<b>" + rodando[0] + "</b> executa";
        texto += esperando.length ? "; " + lista(esperando) + (esperando.length > 1 ? " esperam" : " espera") + " na fila de prontos." : " sozinha.";
        if (t > 0 && grade[t - 1][0] !== rodando[0] && antes[grade[t - 1][0]] < TOTAL[grade[t - 1][0]])
          texto += " A fatia de " + grade[t - 1][0] + " acabou: <b>troca de contexto</b>, e " + grade[t - 1][0] + " volta para o fim da fila.";
        if (t === 1) texto += " Isso é <b>concorrência</b>: as tarefas avançam intercaladas, nunca juntas.";
      } else {
        texto += rodando.length > 1
          ? "<b>" + lista(rodando) + "</b> executam ao mesmo tempo, cada uma num núcleo — <b>paralelismo</b>."
          : "Só <b>" + rodando[0] + "</b> ainda tem trabalho.";
        if (esperando.length) texto += " " + lista(esperando) + (esperando.length > 1 ? " esperam" : " espera") + ": há mais tarefas que núcleos, então ainda existe <b>concorrência</b>.";
        const ociosos = grade[t].filter(id => !id).length;
        if (ociosos) texto += " " + (ociosos > 1 ? ociosos + " núcleos ficam ociosos." : "Um núcleo fica ocioso.");
      }

      passos.push({ t, grade, nucleos, cpu: grade[t], feito: agora, trocas, legenda: texto });
    }

    const S = SERIAL / T;
    let fim = "<b>Tudo pronto em " + T + " unidades de tempo</b>, com " + trocas + " trocas de contexto. ";
    if (nucleos === 1)
      fim += "Nenhuma tarefa rodou junto com outra: foi concorrência pura. O revezamento dá impressão de simultaneidade, mas o trabalho total continua sendo 9.";
    else if (nucleos === 2)
      fim += "Speedup de 9/" + T + " = <b>" + fmtDec(S) + "</b> com 2 núcleos. Houve paralelismo (duas ao mesmo tempo) e concorrência (a terceira esperou a vez).";
    else
      fim += "Speedup de 9/" + T + " = <b>" + fmtDec(S) + "</b> — e não 3. Com um núcleo por tarefa, quem manda é a mais longa, <b>A</b>: no fim, dois núcleos ficaram ociosos. É a mesma lição de Amdahl e do <code>join</code>: o mais lento manda.";

    const ultimo = passos[passos.length - 1];
    passos.push({ t: T, grade, nucleos, cpu: grade[0].map(() => null), feito: { A: 4, B: 2, C: 3 }, trocas: ultimo.trocas, legenda: fim });
    return passos;
  }

  function montar(palco, modo) {
    const nucleos = parseInt(modo, 10);
    const T = escalonar(nucleos).length;

    let html = '<div class="par-topo"><div class="par-cpus">';
    for (let n = 0; n < nucleos; n++)
      html += '<div class="par-cpu"><span class="rot">núcleo ' + n + '</span><b class="par-slot" data-n="' + n + '">—</b></div>';
    html += '</div><div class="par-relogio"><span class="rot">relógio</span><b class="par-t">—</b>' +
            '<span class="rot">trocas</span><b class="par-trocas">0</b></div></div>';

    html += '<div class="par-tarefas">';
    TAREFAS.forEach(([id, total]) => {
      html += '<div class="par-tarefa" data-id="' + id + '">' +
        '<b class="tk tk-' + id + '">' + id + '</b>' +
        '<span class="par-barra">';
      for (let u = 0; u < total; u++) html += '<i></i>';
      html += '</span><span class="par-estado">pronta</span></div>';
    });
    html += '</div>';

    html += '<div class="par-gantt-wrap"><table class="par-gantt"><thead><tr><th>t</th>';
    for (let t = 0; t < T; t++) html += "<th>" + t + "</th>";
    html += "</tr></thead><tbody>";
    for (let n = 0; n < nucleos; n++) {
      html += "<tr><th>N" + n + "</th>";
      for (let t = 0; t < T; t++) html += '<td data-t="' + t + '" data-n="' + n + '"></td>';
      html += "</tr>";
    }
    html += "</tbody></table></div>";
    palco.innerHTML = html;

    return function desenhar(e) {
      palco.querySelectorAll(".par-slot").forEach((slot, n) => {
        const id = e.cpu[n];
        slot.textContent = id || "—";
        slot.className = "par-slot" + (id ? " tk tk-" + id : "");
      });
      palco.querySelector(".par-t").textContent = e.t < 0 ? "—" : e.t >= e.grade.length ? "fim" : e.t;
      palco.querySelector(".par-trocas").textContent = e.trocas;

      TAREFAS.forEach(([id, total]) => {
        const linha = palco.querySelector('.par-tarefa[data-id="' + id + '"]');
        linha.querySelectorAll(".par-barra i").forEach((u, k) =>
          u.className = k < e.feito[id] ? "tk-" + id : "");
        const rodando = e.cpu.includes(id);
        const estado = e.feito[id] === total && !rodando ? "terminada" : rodando ? "executando" : "pronta";
        const rot = linha.querySelector(".par-estado");
        rot.textContent = estado;
        rot.className = "par-estado est-" + estado;
      });

      palco.querySelectorAll(".par-gantt td").forEach(td => {
        const t = +td.dataset.t, n = +td.dataset.n;
        const id = e.grade[t][n];
        const visivel = t <= e.t;
        td.textContent = visivel && id ? id : "";
        td.className = (visivel && id ? "tk tk-" + id : "") + (t === e.t ? " agora" : "");
      });
    };
  }

  registrarAnimacao({
    id: "paralelo",
    nome: "Concorrência × paralelismo",
    titulo: "Concorrência × paralelismo",
    ideia: "As mesmas três tarefas num núcleo, em dois e em três. Com um núcleo elas se revezam; com vários, executam ao mesmo tempo.",
    modos: [{ id: "1", rotulo: "1 núcleo" }, { id: "2", rotulo: "2 núcleos" }, { id: "3", rotulo: "3 núcleos" }],
    montar, roteiro
  });
})();
