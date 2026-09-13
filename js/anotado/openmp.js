/* Código comentado — OpenMP */
anotar([

{
  mod: "openmp",
  h: "reduction: o jeito certo de acumular",
  enunciado: "Some os <code>n</code> elementos de um vetor em paralelo com OpenMP, sem condição de corrida e sem perder o ganho.",
  linhas: [
    ["#include <omp.h>",
     "Necessário para as funções <code>omp_*</code>. Os <code>#pragma</code> dependem da opção <code>-fopenmp</code> na compilação — sem ela são ignorados em silêncio."],
    ["double soma = 0.0;",
     "Declarada <b>fora</b> da região paralela: por padrão seria <code>shared</code>, uma única variável para todas as threads."],
    ["/* ERRADO: #pragma omp parallel for */",
     "Sem cláusula nenhuma, todas as threads fariam <code>soma += v[i]</code> na mesma variável: é o <code>contador++</code> da P1, com atualizações perdidas.", true],
    ["#pragma omp parallel for reduction(+:soma)",
     "Cria um time de threads e divide as iterações entre elas. <code>reduction(+:soma)</code> dá a cada thread uma cópia <b>privada</b> de <code>soma</code>, iniciada em 0 — o elemento neutro da adição.", true],
    ["for (int i = 0; i < n; i++)",
     "O índice do laço paralelizado é privado automaticamente. Cada iteração roda <b>uma vez</b>, em alguma thread — o laço não é replicado."],
    ["    soma += v[i];",
     "Cada thread acumula na própria cópia: sem disputa, sem trava, em paralelo de verdade."],
    ["/* fim do laço: barreira implícita */",
     "As threads esperam umas às outras e as cópias são <b>combinadas</b> na <code>soma</code> original com o operador <code>+</code>.", true]
  ],
  saida: "Resultado correto e com speedup. Um <code>critical</code> em volta de <code>soma += v[i]</code> também acertaria, mas serializaria o laço — ficaria mais lento que o serial."
},

{
  mod: "openmp",
  h: "critical, atomic e a região crítica",
  enunciado: "Um histograma: várias iterações podem incrementar o mesmo <i>bin</i>. Compare <code>atomic</code> com <code>critical</code>.",
  linhas: [
    ["#pragma omp parallel for",
     "Paraleliza o laço. Aqui <code>reduction</code> não resolve diretamente, porque a posição escrita depende do <b>dado</b>, não do índice."],
    ["for (int i = 0; i < n; i++) {\n    int b = bin_de(v[i]);",
     "<code>b</code> é declarado <b>dentro</b> do laço, então é privado de cada thread. Calcular o bin não precisa de proteção."],
    ["    #pragma omp atomic\n    hist[b]++;",
     "Uma única operação de ler-modificar-gravar: <code>atomic</code> vira uma instrução atômica de hardware, <b>sem trava</b>. É o mais rápido para esse caso.", true],
    ["    /* alternativa: #pragma omp critical(hist) { hist[b]++; } */",
     "<code>critical</code> serializa um <b>bloco</b> qualquer com uma trava — mais caro. Dar nome (<code>hist</code>) evita compartilhar a trava global com outros <code>critical</code> sem nome.", true],
    ["}",
     "Barreira implícita no fim do <code>parallel for</code>."]
  ],
  saida: "As duas versões acertam a contagem. Quando os dados se concentram em poucos bins, a disputa cresce — e aí compensa privatizar: um histograma por thread, somados no final."
},

{
  mod: "openmp",
  h: "Medir o tempo (e o erro que custa nota)",
  enunciado: "Meça o tempo da multiplicação de matrizes para calcular speedup e eficiência com diferentes números de threads.",
  linhas: [
    ["double t0 = omp_get_wtime();",
     "Tempo de <b>parede</b>, em segundos. Nunca use <code>clock()</code>: ele soma o tempo de CPU de todas as threads e cresce conforme você paraleliza.", true],
    ["matmult(A, B, C, n);",
     "Só o trecho paralelizado fica entre as duas medições. Leitura de arquivo e alocação ficam de fora."],
    ["double t1 = omp_get_wtime();",
     "Marca o fim logo depois do trecho medido, antes de qualquer <code>printf</code>, que também custa tempo."],
    ["printf(\"tempo: %.6f s com %d threads\\n\",\n       t1 - t0, omp_get_max_threads());",
     "<code>omp_get_max_threads()</code> diz quantas threads a próxima região vai usar. <code>omp_get_num_threads()</code> aqui fora devolveria 1.", true],
    ["/* OMP_NUM_THREADS=1,2,4,8  ->  S = T1/Tp  e  E = S/p */",
     "Repete variando a variável de ambiente. T1 deveria ser o tempo do <b>melhor serial</b>, não do paralelo com 1 thread."]
  ],
  saida: "Com os tempos em mãos: speedup S = T<sub>serial</sub>/T<sub>p</sub> e eficiência E = S/p. Speedup abaixo de 1 com <code>clock()</code> é quase sempre erro de medição, não de paralelização."
}

]);
