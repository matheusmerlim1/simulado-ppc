# -*- coding: utf-8 -*-
"""Gera uma versão de arquivo único a partir dos fontes separados.

O site do GitHub Pages usa os arquivos como estão (index.html + css/ + js/).
Este script serve para quando se quer um HTML solto, sem pastas — para
mandar por e-mail, abrir offline ou publicar como artifact.

    python build.py

Saídas em dist/ (fora do controle de versão):
    simulado-ppc.html   página completa, abre com duplo clique
    fragmento.html      sem <html>/<head>/<body>, para embutir em outra página
"""
import io
import os
import re
import sys

RAIZ = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(RAIZ, "dist")


def ler(caminho_rel):
    caminho = os.path.join(RAIZ, caminho_rel.replace("/", os.sep))
    if not os.path.isfile(caminho):
        sys.exit("arquivo não encontrado: " + caminho_rel)
    with io.open(caminho, encoding="utf-8") as f:
        return f.read()


def escrever(nome, conteudo):
    if not os.path.isdir(DIST):
        os.makedirs(DIST)
    destino = os.path.join(DIST, nome)
    with io.open(destino, "w", encoding="utf-8", newline="\n") as f:
        f.write(conteudo)
    print("  dist/%-22s %8d bytes" % (nome, len(conteudo.encode("utf-8"))))


html = ler("index.html")

# ── CSS local vira <style> ────────────────────────────────────
def inlinar_css(m):
    href = m.group(1)
    if href.startswith("http"):
        return m.group(0)                    # fontes do Google continuam externas
    return "<style>\n" + ler(href).rstrip() + "\n</style>"


html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inlinar_css, html)

# ── scripts locais viram um <script> único, na mesma ordem ────
fontes_js = re.findall(r'<script src="([^"]+)"></script>', html)
if not fontes_js:
    sys.exit("nenhum <script src> encontrado em index.html")

juntos = "\n\n".join(
    "/* ═══ %s ═══ */\n%s" % (src, ler(src).rstrip()) for src in fontes_js
)

# o primeiro <script src> vira o bloco inteiro; os demais somem
primeiro = True
def inlinar_js(m):
    global primeiro
    if primeiro:
        primeiro = False
        return "<script>\n" + juntos + "\n</script>"
    return ""


html = re.sub(r'<script src="[^"]+"></script>\n?', inlinar_js, html)
html = re.sub(r"\n{3,}", "\n\n", html)

escrever("simulado-ppc.html", html)

# ── fragmento: do <title> até antes de </body> ───────────────
ini = html.index("<title>")
fim = html.index("</body>")
escrever("fragmento.html", html[ini:fim].strip() + "\n")

print("\n%d arquivos JS embutidos, na ordem declarada em index.html" % len(fontes_js))
