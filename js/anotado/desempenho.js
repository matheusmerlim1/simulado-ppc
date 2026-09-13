/* Código comentado — Desempenho e Escalabilidade */
anotar([

{
  mod: "desempenho",
  h: "Dependência de dados",
  enunciado: "Antes de paralelizar, classifique cada laço: dá para dividir as iterações entre threads sem mudar o resultado?",
  linhas: [
    ["for (i = 0; i < n; i++)\n    c[i] = a[i] + b[i];",
     "<b>Paralelizável.</b> A iteração <code>i</code> lê só <code>a[i]</code> e <code>b[i]</code> e escreve só em <code>c[i]</code>. Nenhuma iteração usa o que outra escreveu, então qualquer ordem — ou todas ao mesmo tempo — dá o mesmo resultado.", true],
    ["for (i = 0; i < n; i++)\n    soma += v[i];",
     "<b>Redução.</b> Todas escrevem na mesma <code>soma</code>, então há região crítica. Mas a adição é associativa: cada thread acumula um parcial privado e os parciais são somados no fim — <code>reduction(+:soma)</code>.", true],
    ["for (i = 1; i < n; i++)\n    a[i] = a[i-1] + b[i];",
     "<b>Não paralelizável como está.</b> A iteração <code>i</code> lê <code>a[i-1]</code>, que a iteração anterior acabou de escrever: é uma dependência <b>carregada pelo laço</b>. Dividindo entre threads, uma leria um valor que outra ainda não calculou.", true],
    ["/* soma de prefixos paralela */",
     "Colocar <code>parallel for</code> no terceiro laço compila e roda — e dá resultado errado. A saída é trocar de <b>algoritmo</b>, não de diretiva."]
  ],
  saida: "A pergunta que resolve os três casos: <b>alguma iteração lê o que outra escreveu?</b> Se não, paralelize direto; se é só um acumulador, use redução; se sim, repense o algoritmo."
}

]);
