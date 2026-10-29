"""Nota de rosto de cada .jpg de uma pasta, comparando com as referencias do Andre.

uso: python -I capas/rosto/notas_pasta.py <pasta>
Imprime JSON {arquivo: {"nota": float|None, "rostos": N}} (mesma conta do verificar_rosto.py).
Quem decide o que barrar e o triar-cli.mjs, com o limiar de rosto.mjs.
"""
import importlib.util
import json
import os
import sys

import cv2
import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("verificar_rosto", os.path.join(AQUI, "verificar_rosto.py"))
vr = importlib.util.module_from_spec(spec)
spec.loader.exec_module(vr)


def referencias(rec):
    vetores = []
    for nome in vr.REFS:
        arq = os.path.join(vr.RAIZ, "referencias", nome + ".jpg")
        e = vr.embedding(rec, arq) if os.path.exists(arq) else None
        if e:
            vetores.append(e[0])
    if not vetores:
        sys.exit("sem rosto nas referencias")
    return vetores


def main(pasta):
    rec = vr.reconhecedor()
    refs = referencias(rec)
    saida = {}
    for nome in sorted(os.listdir(pasta)):
        if not nome.lower().endswith(".jpg"):
            continue
        e = vr.embedding(rec, os.path.join(pasta, nome))
        if e is None:
            saida[nome] = {"nota": None, "rostos": 0}
            continue
        vetor, n = e
        notas = sorted((float(rec.match(r, vetor, cv2.FaceRecognizerSF_FR_COSINE)) for r in refs),
                       reverse=True)
        saida[nome] = {"nota": round(float(np.mean(notas[:3])), 4), "rostos": n}
    print(json.dumps(saida))


if __name__ == "__main__":
    main(sys.argv[1])
