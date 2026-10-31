"""Tratamento anti-IA da capa: acabamento de foto de celular (ver TRATAMENTO-ANTI-IA.md).

uso: python -I capas/tratar_capa.py <entrada> <saida>
Entrada e saida podem ser um .jpg ou uma pasta (trata todos os .jpg, mesmo nome).
Deterministico: a semente do grao vem do nome do arquivo, mesma entrada da a mesma saida.
"""
import os
import sys
import zlib

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

CONTRASTE = 1.14
NITIDEZ = dict(radius=2, percent=70, threshold=2)
QUENTE = (1.04, 1.0, 0.94)  # vermelho +4%, verde igual, azul -6%
GRAO = 5.5  # desvio do ruido gaussiano, em niveis de 0 a 255
QUALIDADE = 92


def semente(nome):
    return zlib.crc32(os.path.basename(nome).encode("utf-8"))


def tratar(img, seed):
    img = ImageEnhance.Contrast(img.convert("RGB")).enhance(CONTRASTE)
    img = img.filter(ImageFilter.UnsharpMask(**NITIDEZ))
    px = np.asarray(img, dtype=np.float32) * np.array(QUENTE, dtype=np.float32)
    ruido = np.random.default_rng(seed).normal(0.0, GRAO, px.shape[:2])
    px += ruido[..., None]  # mesmo grao nos 3 canais, como sensor de celular em luz boa
    return Image.fromarray(np.clip(px, 0, 255).round().astype(np.uint8))


def tratar_arquivo(entrada, saida):
    with Image.open(entrada) as img:
        tratar(img, semente(entrada)).save(saida, quality=QUALIDADE, subsampling=0)


def main(entrada, saida):
    if os.path.isdir(entrada):
        os.makedirs(saida, exist_ok=True)
        nomes = sorted(n for n in os.listdir(entrada) if n.lower().endswith(".jpg"))
        for n in nomes:
            tratar_arquivo(os.path.join(entrada, n), os.path.join(saida, n))
        print(f"{len(nomes)} capa(s) tratada(s) em {saida}")
    else:
        tratar_arquivo(entrada, saida)
        print(saida)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
