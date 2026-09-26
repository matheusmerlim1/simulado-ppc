/* ═══════════════════════════════════════════════════════════
   PROVAS RESOLVIDAS — a prova teórica e a prova prática da
   disciplina, questão a questão, com a resposta desenvolvida.

   Entra como o primeiro assunto da aba "matéria". Cada questão é
   uma seção no mesmo formato de materia.js: { h, p, cod, anotado,
   box }, então o render é o mesmo.
   ═══════════════════════════════════════════════════════════ */

const PROVAS_SECOES = [];

/* o bloco entra por referência: os arquivos seguintes só dão push */
MATERIA.unshift({
  mod: "provas",
  nome: "Provas resolvidas",
  prova: "P1",
  secoes: PROVAS_SECOES
});

function secaoProva(secao) { PROVAS_SECOES.push(secao); }

/* cabeçalho do enunciado, para a questão aparecer antes da resposta */
function enunciado(texto) {
  return '<div class="prova-enun"><span class="rot">enunciado</span>' + texto + "</div>";
}

secaoProva({
  h: "Como estas duas provas são cobradas",
  p: enunciado("<b>Prova Teórica</b> — 7 questões, todas valendo 2 pontos. <b>Escolha 5</b> e indique-as na prova.<br><b>Prova Prática</b> — 4 questões: 1,5 + 1,5 + 4,0 + 3,0 pontos, com código rodando.") +
     "A teórica é de papel: definições, comparações, os padrões de projeto, as condições de deadlock e <b>duas contas</b> — detecção e banqueiro — além de um modelo de Rede de Petri. A prática é de teclado: dois programas curtos, o Jantar dos Filósofos e uma <b>análise de código alheio</b>.<br><br><b>Escolher 5 de 7 muda a estratégia.</b> Vale começar pelas duas contas (5 e 6): elas são mecânicas, dão a nota cheia se o passo a passo estiver certo e não dependem de redação. Depois as definições (1 e 2), que são curtas. Deixe por último a que você menos domina — e lembre de <b>indicar na prova</b> quais cinco você escolheu; sem isso, a correção escolhe por você.",
  box: "<b>Nas respostas abaixo</b>, cada questão traz o enunciado como caiu, a resposta desenvolvida, os erros que mais custam ponto e — nas de código — o programa comentado linha a linha."
});
