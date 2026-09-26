/* ═══════════════════════════════════════════════════════════
   Núcleo — estruturas compartilhadas por todos os arquivos de dados.
   Carregado antes de tudo em index.html.
   ═══════════════════════════════════════════════════════════ */

/* Assuntos da disciplina, na ordem em que aparecem na interface.
   A chave é o campo "mod" de cada questão. */
const MODULOS = {
  processos:  { nome:"Processos e Threads",       prova:"P1" },
  exclusao:   { nome:"Exclusão Mútua",            prova:"P1" },
  padroes:    { nome:"Padrões Concorrentes",      prova:"P1" },
  deadlocks:  { nome:"Deadlocks",                 prova:"P1" },
  petri:      { nome:"Redes de Petri",            prova:"P1" },
  hardware:   { nome:"Hardware Paralelo",         prova:"P2" },
  desempenho: { nome:"Desempenho e Escalabilidade", prova:"P2" },
  openmp:     { nome:"OpenMP",                    prova:"P2" }
};

/* As duas avaliações da disciplina. A prática é a prova em que se escreve
   código; a teórica é a de papel — conceitos, comparações, traços e contas. */
const AVALIACOES = {
  teorica: { nome:"Teórica", desc:"conceitos, comparações, traços de execução e contas" },
  pratica: { nome:"Prática", desc:"escrever, completar e analisar código" }
};

/* A regra abaixo classifica quase tudo; estes são os casos em que ela erraria.
   Pedem decisão de implementação ou leitura de código, mas não são tipo "code". */
const EXCECOES_PRATICA = new Set(["em13", "em35", "om06", "pt14"]);

function avaliacaoDe(q) {
  if (EXCECOES_PRATICA.has(q.id)) return "pratica";
  if (q.tipo === "code") return "pratica";
  return /Prática|Análise de (código|log)|Exemplo/.test(q.fonte) ? "pratica" : "teorica";
}

/* Banco de questões. Cada arquivo de js/questoes/ chama registrar(). */
const BANCO = [];

/* Campos de uma questão
   ─────────────────────
   id         identificador único: 2 letras do assunto + 2 dígitos (+ letra)
   mod        chave em MODULOS
   dif        facil | medio | dificil
   tipo       mc (múltipla escolha) | vf | disc (discursiva) | code
   fonte      de onde a questão saiu — exibido como texto puro, sem HTML
   enunciado  HTML
   cod        opcional: bloco de código exibido com o enunciado (texto puro)
   tabela     opcional: HTML de tabela ou dados
   opcoes     mc: exatamente 4 alternativas em HTML
   correta    mc: índice 0–3 · vf: 0 (verdadeiro) ou 1 (falso)
   chaves     disc/code: palavras-chave procuradas na resposta escrita.
              Cada item e uma string ou um array de sinonimos aceitos, sendo
              o primeiro o rotulo exibido na correcao. A nota da questao e o
              percentual de itens encontrados (ver NOTA_MINIMA em base.js).
   modelo     code: solução de referência (texto puro)
   gabarito   HTML da explicação                                        */
function registrar(questoes) {
  BANCO.push.apply(BANCO, questoes);
}
