# Simulado PPC

Simulado e resumo de **Programação Paralela e Concorrente** — CEFET/RJ, UNED Nova Friburgo,
Bacharelado em Sistemas de Informação.

**➜ https://matheusmerlim1.github.io/simulado-ppc**

Site estático, sem build e sem dependências além das fontes do Google.
É só abrir o `index.html`.

---

## O que tem

**181 questões** com gabarito comentado, montadas a partir das provas teórica e prática
anteriores, dos laboratórios e dos slides da disciplina.

| Prova | Assuntos |
|---|---|
| **P1** — Programação Concorrente | Processos e Threads · Exclusão Mútua · Padrões Concorrentes · Deadlocks · Redes de Petri |
| **P2** — Programação Paralela | Hardware Paralelo · Desempenho e Escalabilidade · OpenMP |

Quatro formatos de questão:

- **Múltipla escolha** e **V/F** — correção automática
- **Discursiva** — você escreve e a correção procura as palavras-chave da resposta.
  A busca é folgada de propósito: aceita sinônimos, ignora acento e maiúscula, não
  cobra ordem das palavras e pega as flexões (“compartilhado”, “compartilhadas”).
  O gabarito vem junto, e a nota é sua para ajustar — dá para dar a questão por
  inteira ou zerá-la depois de ler (é o formato da Prova Teórica)
- **Código** — um método por questão, com o contexto já dado; a verificação procura os
  elementos essenciais, pontua do mesmo jeito e mostra uma solução de referência
  comentada

**A nota é fracionada.** Cada questão vale 1, e as escritas valem o percentual de
palavras-chave que você acertou: 3 de 4 valem **0,75**. O placar soma essas frações
— uma rodada de 10 pode terminar em **7,4/10**. Objetivas continuam valendo 0 ou 1.
Abaixo de **60%** a questão fica vermelha e volta no “refazer só os erros”; entre 60%
e 99% ela fica âmbar, com os pontos que ganhou.

Além do simulado, a aba **Matéria** traz o resumo explicado da disciplina inteira:
73 tópicos com exemplos de código e os casos numéricos resolvidos passo a passo
(algoritmo do banqueiro, detecção de deadlock, árvore de alcançabilidade, pipeline,
faltas de cache, Amdahl, Gustafson, balanceamento de carga).

## Coleções prontas

Recortes que começam direto, sem configurar nada:

- Prova Teórica, questão a questão
- Prova Prática completa
- Definições em 1 minuto
- Deadlocks com conta
- Sincronizar threads em ordem (CAFE · BEBER · alfabeto · AAAAABBBBB)
- Contas da P2
- Escrever código
- Armadilhas de concorrência

## Recursos

- Filtros por prova, assunto, dificuldade, tipo e quantidade
- Barra de progresso com um segmento por questão, colorida por resultado
- Desempenho por assunto ao final, com revisão de todos os gabaritos
- Refazer só os erros
- Tema claro e escuro
- Atalhos: `1`–`4` escolhem a alternativa, `Enter` verifica e avança

## Estrutura

```
index.html              só marcação e a ordem de carregamento
css/estilo.css          tokens de cor e tipografia, claro e escuro
js/
├── nucleo.js           MODULOS, BANCO e registrar() — carrega primeiro
├── questoes/           um arquivo por assunto
│   ├── processos.js        25 questões
│   ├── exclusao.js         45
│   ├── padroes.js          24
│   ├── deadlocks.js        24
│   ├── petri.js            14
│   ├── hardware.js         17
│   ├── desempenho.js       16
│   └── openmp.js           16
├── resumo.js           fichas da aba "consulta rápida"
├── materia.js          os 73 tópicos explicados
├── colecoes.js         as coleções prontas
│
├── base.js             utilitários, estado, tema e navegação
├── configurar.js       tela inicial: filtros e contagens
├── questao.js          execução: trilha, renderização e correção
├── resultado.js        nota, desempenho por assunto e revisão
├── estudo.js           matéria e consulta rápida
└── main.js             liga tudo e monta a tela inicial
build.py                gera uma versão de arquivo único em dist/
```

Os arquivos JS são scripts clássicos, carregados na ordem declarada em
`index.html` — nada de módulos ES, para o site funcionar também ao abrir o
`index.html` direto do disco, sem servidor.

### Adicionar uma questão

Abra o arquivo do assunto em `js/questoes/` e acrescente um objeto ao
`registrar([...])`. Os campos estão documentados em `js/nucleo.js`.
O `id` é o prefixo de duas letras do assunto mais dois dígitos.

### Versão de arquivo único

```bash
python build.py
```

Gera `dist/simulado-ppc.html` — tudo embutido, abre com duplo clique,
bom para mandar por e-mail ou usar offline. A pasta `dist/` fica fora
do controle de versão.

## Fontes

Provas Teórica e Prática de semestres anteriores; laboratórios de Processos e Threads,
Exclusão Mútua, Padrões de Projeto Concorrente, Deadlocks, Redes de Petri, Introdução,
Hardware Paralelo, Projeto e Análise de Programas Paralelos e OpenMP; slides da disciplina
(Prof. Bruno Policarpo Toledo Freitas); Tanenbaum, *Sistemas Operacionais Modernos*, 4ª ed.;
Pacheco, *An Introduction to Parallel Programming*.

> As respostas são um estudo dirigido, **não** um gabarito oficial do professor.

O material da disciplina (PDFs, listas e provas digitalizadas) **não** faz parte deste
repositório — só o simulado.
