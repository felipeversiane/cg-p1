#!/usr/bin/env python3
"""Transcreve o PDF fotografado em Markdown, uma página por arquivo.

Requer pdfinfo, pdfimages e Tesseract com o idioma português instalado.
Uso: python3 ocr_livro.py [--inicio 1 --fim 10] [--refazer]
"""

import argparse
import re
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import quote


PDF = Path(__file__).with_name("Karol - Computação Gráfica.pdf")
SAIDA = Path(__file__).with_name("livro-ocr")
FIGURA = re.compile(r"^FIGURA\s+(\d+(?:[.,]\d+)+)\s*[-–—=:]\s*(.*)$", re.M)


def comando(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout


def total_paginas():
    dados = comando("pdfinfo", str(PDF))
    return int(re.search(r"^Pages:\s+(\d+)$", dados, re.M).group(1))


def transcrever(pagina, destino):
    with tempfile.TemporaryDirectory() as pasta:
        prefixo = Path(pasta) / "pagina"
        comando("pdfimages", "-f", str(pagina), "-l", str(pagina), "-j", str(PDF), str(prefixo))
        imagens = list(Path(pasta).glob("pagina-*.jpg"))
        if len(imagens) != 1:
            raise RuntimeError(f"Página {pagina}: esperava uma imagem JPEG; encontrei {len(imagens)}")
        texto = comando("tesseract", str(imagens[0]), "stdout", "-l", "por", "--psm", "3").strip()
    if len(texto) < 20:
        texto = "**OCR insuficiente nesta página. Consulte a imagem original.**"
    origem = f"../../{quote(PDF.name)}#page={pagina}"
    conteudo = (
        f"# Página {pagina} do PDF\n\n"
        f"[Ver página original]({origem})\n\n"
        "> Transcrição automática: conferir fórmulas, símbolos e figuras no PDF.\n\n"
        f"{texto}\n"
    )
    temporario = destino.with_suffix(".tmp")
    temporario.write_text(conteudo, encoding="utf-8")
    temporario.replace(destino)


def criar_indices(total):
    paginas = sorted((SAIDA / "paginas").glob("[0-9][0-9][0-9].md"))
    pdf = f"../{quote(PDF.name)}"
    lista = "\n".join(f"- [Página {int(p.stem)}](paginas/{p.name})" for p in paginas)
    revisar = [p.stem for p in paginas if "OCR insuficiente" in p.read_text(encoding="utf-8")]
    (SAIDA / "README.md").write_text(
        "# Introdução à Computação Gráfica — transcrição OCR\n\n"
        f"[PDF original]({pdf}) · {len(paginas)}/{total} páginas processadas"
        f" · {len(revisar)} com OCR insuficiente\n\n"
        "O texto foi reconhecido automaticamente. Confira fórmulas, símbolos, tabelas e "
        "figuras na página original antes de usar em resumos. A numeração abaixo é a do PDF, "
        "que pode diferir da numeração impressa.\n\n"
        "Para refazer: `python3 ocr_livro.py --refazer` (requer `pdfinfo`, `pdfimages` e "
        "Tesseract com idioma `por`). Para conferir a estrutura: "
        "`python3 ocr_livro.py --verificar`.\n\n"
        "[Índice de figuras detectadas](figuras.md)\n\n"
        + (f"Páginas para revisão: {', '.join(revisar)}.\n\n" if revisar else "")
        + "## Páginas\n\n" + lista + "\n",
        encoding="utf-8",
    )
    figuras = []
    for pagina in paginas:
        texto = pagina.read_text(encoding="utf-8")
        for numero, legenda in FIGURA.findall(texto):
            legenda = legenda.strip(" -–—=|.")
            figuras.append(
                f"- **Figura {numero}** — {legenda} "
                f"([PDF, página {int(pagina.stem)}]({pdf}#page={int(pagina.stem)}))"
            )
    (SAIDA / "figuras.md").write_text(
        "# Figuras detectadas pelo OCR\n\n"
        "Índice automático por legenda; pode omitir figuras ou conter erros de leitura.\n\n"
        + "\n".join(figuras) + "\n",
        encoding="utf-8",
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inicio", type=int, default=1)
    parser.add_argument("--fim", type=int)
    parser.add_argument("--refazer", action="store_true")
    parser.add_argument("--verificar", action="store_true")
    args = parser.parse_args()
    total = total_paginas()
    if args.verificar:
        for pagina in range(1, total + 1):
            arquivo = SAIDA / "paginas" / f"{pagina:03}.md"
            if not arquivo.exists() or f"#page={pagina})" not in arquivo.read_text(encoding="utf-8"):
                raise RuntimeError(f"Página {pagina}: arquivo ou link de origem ausente")
        print(f"Estrutura válida: {total} páginas com links para o PDF")
        return
    fim = args.fim or total
    if not 1 <= args.inicio <= fim <= total:
        parser.error(f"intervalo deve estar entre 1 e {total}")
    (SAIDA / "paginas").mkdir(parents=True, exist_ok=True)
    for pagina in range(args.inicio, fim + 1):
        destino = SAIDA / "paginas" / f"{pagina:03}.md"
        if args.refazer or not destino.exists():
            transcrever(pagina, destino)
            print(f"Página {pagina}/{total} processada", flush=True)
    criar_indices(total)
    print(f"Índice: {SAIDA / 'README.md'}")


if __name__ == "__main__":
    main()
