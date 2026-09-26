/* ═══════════════════════════════════════════════════════════
   PROVAS RESOLVIDAS — as questões da prova teórica e da prova
   prática, com a resposta desenvolvida.

   São dois assuntos separados na aba "matéria", para estudar uma
   prova de cada vez. Cada questão é uma seção no mesmo formato de
   materia.js — { h, p, svg, cod, anima, anotado, box } —, então o
   render é o mesmo.
   ═══════════════════════════════════════════════════════════ */

const PROVA_TEORICA = [];
const PROVA_PRATICA = [];

/* entram por referência: os arquivos seguintes só dão push */
MATERIA.unshift(
  { mod: "provaT", nome: "Prova teórica", prova: "resolvida", secoes: PROVA_TEORICA },
  { mod: "provaP", nome: "Prova prática", prova: "resolvida", secoes: PROVA_PRATICA }
);

function secaoTeorica(secao) { PROVA_TEORICA.push(secao); }
function secaoPratica(secao) { PROVA_PRATICA.push(secao); }

/* cabeçalho do enunciado, para a questão aparecer antes da resposta */
function enunciado(texto) {
  return '<div class="prova-enun"><span class="rot">enunciado</span>' + texto + "</div>";
}

secaoTeorica({
  h: "O que a prova teórica cobra",
  p: "É a prova de papel: <b>definições</b> (região crítica, corrida, exclusão mútua), <b>comparações</b> (semáforo, monitor e mutex), os <b>padrões de projeto concorrente</b>, as <b>condições de deadlock</b> e o que fazer com elas, <b>duas contas</b> — detecção e banqueiro — e um <b>modelo de Rede de Petri</b>.<br><br>" +
     "<b>Comece pelas contas.</b> Detecção e banqueiro são mecânicos: o passo a passo certo dá a questão inteira e não depende de redação. As definições vêm em seguida, por serem curtas. Deixe por último a que você menos domina.<br><br>" +
     "Nas questões abaixo, cada uma traz o <b>enunciado como caiu</b>, a resposta desenvolvida e os erros que mais custam ponto. Onde existe animação da matéria, há um botão para abri-la no passo a passo.",
  box: "<b>Um hábito que salva nota nas contas:</b> antes de calcular, confira a consistência dos dados copiados. Na detecção, <b>A + soma de cada coluna de C = E</b>. No banqueiro, a soma do que está alocado mais os livres tem de dar o total de recursos. Copiar a matriz errado leva todo o resto junto."
});

secaoPratica({
  h: "O que a prova prática cobra",
  p: "É a prova de teclado, com código rodando: <b>dois programas curtos</b> (um contador disputado por milhares de threads e uma palavra impressa em ordem), o <b>Jantar dos Filósofos</b> e uma <b>análise de código alheio</b>, em que se confere item a item de uma especificação e se aponta onde estão a condição de corrida e o deadlock.<br><br>" +
     "O enunciado quase nunca diz &ldquo;use um mutex&rdquo;. Ele diz <b>o que não pode acontecer</b> — &ldquo;sem deadlocks ou condições de corrida&rdquo;, &ldquo;apenas 1 thread para cada letra&rdquo; — e cabe a você escolher o mecanismo. As respostas abaixo trazem o programa <b>comentado linha a linha</b>, com o porquê de cada linha estar ali.",
  box: "<b>Antes de entregar, verifique três coisas:</b> (1) toda variável compartilhada é lida e escrita sob a mesma trava; (2) nenhuma thread bloqueia segurando uma trava de que outra precisa para liberá-la; (3) os <code>join</code> estão num laço <b>separado</b> do de criação — senão o programa vira sequencial e o erro de concorrência nem aparece."
});
