/* ═══════════════════════════════════════════════════════════
   JOGO 2 — Desentope o pipeline (aula 07)

   Um programinha de 6 instruções passa por um pipeline de 5 estágios.
   O jogador reordena as instruções para tirar as bolhas, e o jogo
   recusa qualquer troca que mude o resultado do programa — é assim
   que RAW, WAR e WAW deixam de ser sigla e viram regra.

   Modelo (o mesmo que a aula usa):
     estágios IF ID EX MEM WB, um ciclo cada; emissão em ordem.
     com adiantamento:  ULA -> uso = 0 bolhas;  load -> uso = 1 bolha.
     sem adiantamento:  o valor só existe depois do WB = 3 bolhas.
   ═══════════════════════════════════════════════════════════ */

const PIPE_PROGRAMA = [
  { id: "i1", txt: "R1 = MEM[R8]",   esc: "R1", le: ["R8"],        load: true  },
  { id: "i2", txt: "R2 = R1 + R9",   esc: "R2", le: ["R1", "R9"],  load: false },
  { id: "i3", txt: "R3 = R10 + R11", esc: "R3", le: ["R10", "R11"],load: false },
  { id: "i4", txt: "R4 = MEM[R12]",  esc: "R4", le: ["R12"],       load: true  },
  { id: "i5", txt: "R5 = R4 * R3",   esc: "R5", le: ["R4", "R3"],  load: false },
  { id: "i6", txt: "R9 = R13 - R14", esc: "R9", le: ["R13", "R14"],load: false }
];

const PIPE_ESTAGIOS = ["IF", "ID", "EX", "MEM", "WB"];

/* ── lógica pura (testável, sem DOM) ─────────────────────── */

/* Que dependência existe de a para b, sendo a ANTES de b no programa?
   Devolve "RAW", "WAR", "WAW" ou null. */
function dependencia(a, b) {
  if (b.le.indexOf(a.esc) >= 0) return "RAW";    /* b lê o que a escreve */
  if (a.le.indexOf(b.esc) >= 0) return "WAR";    /* b escreve o que a lê  */
  if (a.esc === b.esc)          return "WAW";    /* as duas escrevem igual */
  return null;
}

/* Uma ordem só vale se todo par dependente mantiver a ordem original. */
function ordemValida(ordem, prog) {
  for (let i = 0; i < prog.length; i++) {
        for (let j = i + 1; j < prog.length; j++) {
      if (!dependencia(prog[i], prog[j])) continue;
      if (ordem.indexOf(i) > ordem.indexOf(j)) return false;
    }
  }
  return true;
}

/* Qual par quebrou, para poder explicar ao jogador. */
function parQuebrado(ordem, prog) {
  for (let i = 0; i < prog.length; i++) {
    for (let j = i + 1; j < prog.length; j++) {
      const d = dependencia(prog[i], prog[j]);
      if (d && ordem.indexOf(i) > ordem.indexOf(j))
        return { de: prog[i], para: prog[j], tipo: d };
    }
  }
  return null;
}

/* Distância mínima entre as emissões de produtor e consumidor. */
function distanciaMinima(produtor, adiantamento) {
  if (!adiantamento) return 4;              /* espera o WB: 3 bolhas */
  return produtor.load ? 2 : 1;             /* load-use: 1 bolha; ULA: nenhuma */
}

/* Simula o pipeline e devolve o ciclo de emissão de cada instrução. */
function simularPipeline(ordem, prog, adiantamento) {
  const emissao = [];
  let anterior = 0;

  ordem.forEach(function (idx, pos) {
    let ciclo = pos === 0 ? 1 : anterior + 1;

    for (let p = 0; p < pos; p++) {
      const antes = prog[ordem[p]];
      if (dependencia(antes, prog[idx]) !== "RAW") continue;
      ciclo = Math.max(ciclo, emissao[p] + distanciaMinima(antes, adiantamento));
    }

    emissao.push(ciclo);
    anterior = ciclo;
  });

  const ultimo = emissao[emissao.length - 1];
  const ciclos = ultimo + PIPE_ESTAGIOS.length - 1;
  const bolhas = ultimo - 1 - (ordem.length - 1);
  return { emissao: emissao, ciclos: ciclos, bolhas: bolhas };
}

/* Menor número de ciclos entre todas as ordens válidas. */
function melhorOrdemPipeline(prog, adiantamento) {
  let melhor = null;

  (function permutar(resto, atual) {
    if (!resto.length) {
      if (!ordemValida(atual, prog)) return;
      const r = simularPipeline(atual, prog, adiantamento);
      if (!melhor || r.ciclos < melhor.ciclos)
        melhor = { ordem: atual.slice(), ciclos: r.ciclos, bolhas: r.bolhas };
      return;
    }
    for (let k = 0; k < resto.length; k++)
      permutar(resto.slice(0, k).concat(resto.slice(k + 1)), atual.concat([resto[k]]));
  })(prog.map((_, k) => k), []);

  return melhor;
}

/* ── jogo ────────────────────────────────────────────────── */
registrarJogo({
  id: "pipeline",
  nome: "Desentope o pipeline",
  titulo: "Desentope o pipeline",
  ideia: "Reordene as instruções para o pipeline parar de engasgar — sem mudar " +
         "o resultado do programa.",
  regras:
    "<p>O pipeline tem 5 estágios (<code>IF ID EX MEM WB</code>) e emite em ordem. " +
    "Quando uma instrução precisa de um valor que ainda não existe, o pipeline insere " +
    "<b>bolhas</b> — ciclos em que nada anda.</p>" +
    "<p><b>Com adiantamento:</b> resultado de ULA chega a tempo (0 bolhas); " +
    "um <code>load</code> seguido do uso ainda custa <b>1 bolha</b>, porque o dado só " +
    "existe depois do MEM.<br>" +
    "<b>Sem adiantamento:</b> o valor só pode ser lido depois do WB — <b>3 bolhas</b>.</p>" +
    "<p>Use &#9650; e &#9660; para mover. A troca é <b>recusada</b> se quebrar uma " +
    "dependência: RAW (lê o que o outro escreve) é verdadeira e nunca pode ser invertida; " +
    "WAR e WAW são conflitos de nome — o processador as resolve renomeando registradores, " +
    "mas aqui, mexendo no código-fonte, elas também têm de ser respeitadas.</p>",
  modos: [
    { id: "com",  rotulo: "com adiantamento" },
    { id: "sem",  rotulo: "sem adiantamento" }
  ],

  montar: function (palco, modo, api) {
    const adiantamento = modo === "com";
    const prog = PIPE_PROGRAMA;
    let ordem = prog.map((_, k) => k);

    const inicial = simularPipeline(ordem, prog, adiantamento);
    const otimo = melhorOrdemPipeline(prog, adiantamento);
    const ganhoMax = Math.max(1, inicial.ciclos - otimo.ciclos);

    palco.innerHTML =
      '<div class="pp-conta">' +
        '<span class="pp-ciclos"><span class="rot">ciclos</span><b>&mdash;</b></span>' +
        '<span class="pp-bolhas"><span class="rot">bolhas</span><b>&mdash;</b></span>' +
        '<span class="pp-meta"><span class="rot">mínimo possível</span><b>' +
          otimo.ciclos + "</b></span>" +
      "</div>" +
      '<ol class="pp-lista"></ol>' +
      '<div class="pp-diagrama" role="img" aria-label="Diagrama do pipeline"></div>';

    const lista = palco.querySelector(".pp-lista");
    const diagrama = palco.querySelector(".pp-diagrama");

    function mover(pos, passo) {
      const alvo = pos + passo;
      if (alvo < 0 || alvo >= ordem.length) return;

      const tentativa = ordem.slice();
      tentativa[pos] = ordem[alvo];
      tentativa[alvo] = ordem[pos];

      if (!ordemValida(tentativa, prog)) {
        const q = parQuebrado(tentativa, prog);
        api.dizer("✗ Não dá: <code>" + q.para.txt + "</code> depende de <code>" +
                  q.de.txt + "</code> — dependência <b>" + q.tipo + "</b>" +
                  (q.tipo === "RAW"
                    ? " (lê <code>" + q.de.esc + "</code>, que a outra escreve). " +
                      "É verdadeira: inverter muda o resultado."
                    : q.tipo === "WAR"
                      ? " (escreve <code>" + q.para.esc + "</code>, que a outra lê). " +
                        "É conflito de nome, mas no código-fonte muda o resultado igual."
                      : " (as duas escrevem <code>" + q.de.esc + "</code>). " +
                        "Quem escreve por último define o valor final."),
                  "erro");
        return;
      }

      ordem = tentativa;
      desenhar(true);
    }

    function desenhar(avisar) {
      const r = simularPipeline(ordem, prog, adiantamento);

      palco.querySelector(".pp-ciclos b").textContent = r.ciclos;
      palco.querySelector(".pp-bolhas b").textContent = r.bolhas;
      api.marcar(Math.max(0, inicial.ciclos - r.ciclos), ganhoMax);

      /* lista de instruções */
      lista.innerHTML = "";
      ordem.forEach(function (idx, pos) {
        const item = elem("li", "pp-item");
        item.innerHTML =
          '<code>' + prog[idx].txt + "</code>" +
          (prog[idx].load ? '<span class="pp-tag">load</span>' : "");

        const subir = elem("button", "pp-seta", "&#9650;");
        subir.type = "button";
        subir.title = "subir " + prog[idx].txt;
        subir.setAttribute("aria-label", "subir " + prog[idx].txt);
        subir.disabled = pos === 0;
        subir.addEventListener("click", () => mover(pos, -1));

        const descer = elem("button", "pp-seta", "&#9660;");
        descer.type = "button";
        descer.title = "descer " + prog[idx].txt;
        descer.setAttribute("aria-label", "descer " + prog[idx].txt);
        descer.disabled = pos === ordem.length - 1;
        descer.addEventListener("click", () => mover(pos, +1));

        const botoes = elem("span", "pp-setas");
        botoes.appendChild(subir);
        botoes.appendChild(descer);
        item.appendChild(botoes);
        lista.appendChild(item);
      });

      /* diagrama de ciclos */
      diagrama.innerHTML = "";
      const largura = r.ciclos;
      const cabeca = elem("div", "pp-linha pp-cabeca");
      cabeca.appendChild(elem("span", "pp-nome", ""));
      for (let c = 1; c <= largura; c++)
        cabeca.appendChild(elem("span", "pp-cel pp-num", String(c)));
      diagrama.appendChild(cabeca);

      ordem.forEach(function (idx, pos) {
        const linha = elem("div", "pp-linha");
        linha.appendChild(elem("span", "pp-nome", prog[idx].id));
        const inicio = r.emissao[pos];
        for (let c = 1; c <= largura; c++) {
          const et = c - inicio;
          const dentro = et >= 0 && et < PIPE_ESTAGIOS.length;
          const parado = pos > 0 && c < inicio && c > r.emissao[pos - 1];
          linha.appendChild(elem("span",
            "pp-cel" + (dentro ? " e-" + PIPE_ESTAGIOS[et] : parado ? " bolha" : ""),
            dentro ? PIPE_ESTAGIOS[et] : parado ? "&middot;" : ""));
        }
        diagrama.appendChild(linha);
      });

      if (r.ciclos <= otimo.ciclos) {
        api.encerrar("✓ <b>" + r.ciclos + " ciclos</b>, o mínimo possível para este " +
          "programa " + (adiantamento ? "com" : "sem") + " adiantamento — " +
          "você tirou <b>" + (inicial.ciclos - r.ciclos) + "</b> ciclos dos " +
          inicial.ciclos + " iniciais.<br><br>" +
          (adiantamento
            ? "Repare que as bolhas que sobraram (se sobraram) são de <code>load</code>: " +
              "nem o adiantamento resolve, porque o dado só existe depois do MEM. " +
              "A saída é ter uma instrução independente para encaixar no buraco."
            : "Sem adiantamento tudo espera o WB, e nem reordenando se chega perto do " +
              "caso com adiantamento — compare os dois modos. É por isso que o " +
              "adiantamento existe em qualquer processador real."));
      } else if (avisar) {
        api.dizer("Ordem válida. Agora são <b>" + r.ciclos + " ciclos</b> e <b>" +
                  r.bolhas + "</b> bolha(s). Faltam " + (r.ciclos - otimo.ciclos) +
                  " para o mínimo.", "ok");
      }
    }

    api.dizer("O programa começa com <b>" + inicial.ciclos + " ciclos</b> e <b>" +
              inicial.bolhas + "</b> bolha(s). Dá para chegar a <b>" + otimo.ciclos +
              "</b>.");
    desenhar(false);
  }
});
