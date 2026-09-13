/* ═══════════════════════════════════════════════════════════
   Código comentado linha a linha — liga cada exemplo à seção da
   matéria pelo assunto e pelo título.

   anotar([{
     mod, h,                      seção de MATERIA a que pertence
     enunciado,                   o problema que o código resolve (HTML)
     linhas: [[código, porquê, chave?], ...]
                                  código em texto puro; "chave" destaca as
                                  linhas que decidem se o programa está certo
     saida,                       opcional: o que acontece ao rodar (HTML)
     mantemCod                    opcional: mantém também o cod da seção
   }])
   Carregado depois de materia.js.
   ═══════════════════════════════════════════════════════════ */

const ANOTACOES_SEM_SECAO = [];

function anotar(lista) {
  lista.forEach(a => {
    const bloco = MATERIA.find(m => m.mod === a.mod);
    const secao = bloco && bloco.secoes.find(s => s.h === a.h);
    if (!secao) { ANOTACOES_SEM_SECAO.push(a.mod + " · " + a.h); return; }

    secao.anotado = a;
    if (!a.mantemCod) delete secao.cod;        /* o anotado já mostra o código */
  });
}
