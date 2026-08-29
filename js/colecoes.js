/* ═══════════════════════════════════════════════════════════
   Coleções prontas — recortes que começam sem configurar nada.

   Uma coleção define OU uma lista de ids (na ordem em que devem
   aparecer), OU um filtro sobre o banco (embaralhado ao iniciar).
   ═══════════════════════════════════════════════════════════ */
const COLECOES = [
  {
    t:"Prova Teórica, questão a questão",
    s:"as 7 questões, divididas em partes curtas",
    ids:["em01a","em01b","em01c","em01d",
         "em02a","em02b","em02c","em02d",
         "pp01a","pp01b","pp01c","pp01d","pp01e","pp01f",
         "dl01a","dl01b","dl01c","dl01d","dl01e",
         "dl05","dl06",
         "rp07a","rp07b","rp07c"]
  },
  {
    t:"Prova Prática completa",
    s:"código curto, um método por vez",
    ids:["em14","pp11","dl16","em20a","em20b","em20c","em20d"]
  },
  {
    t:"Definições em 1 minuto",
    s:"só os conceitos, resposta curta",
    ids:["em01a","em01b","em01c",
         "em02a","em02b","em02c",
         "pp01a","pp01b","pp01c","pp01d","pp01e","pp01f"]
  },
  {
    t:"Deadlocks com conta",
    s:"banqueiro · detecção · limites",
    ids:["dl05","dl06","dl08","dl09","dl17","dl07","dl18"]
  },
  {
    t:"Sincronizar threads em ordem",
    s:"CAFE · BEBER · alfabeto · AAAAABBBBB",
    ids:["pp10","pp11","pp12","em15","pp13","pp13b"]
  },
  {
    t:"Só as difíceis da P1",
    s:"filtro por nível",
    filtro:(q) => q.dif === "dificil" && MODULOS[q.mod].prova === "P1"
  },
  {
    t:"Contas da P2",
    s:"pipeline · cache · speedup · escalabilidade",
    ids:["hw04","hw05","hw06","hw10","ds02","ds05","ds06","ds07","ds15"]
  },
  {
    t:"Escrever código",
    s:"um método por questão",
    filtro:(q) => q.tipo === "code"
  },
  {
    t:"Armadilhas de concorrência",
    s:"onde todo mundo erra",
    ids:["em05","em06","em19","pp05","pp07","pp18","om06","om10","pt13","pt14"]
  }
];
