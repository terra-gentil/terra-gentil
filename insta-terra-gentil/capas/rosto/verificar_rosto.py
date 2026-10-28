"""Compara o rosto de cada capa com as fotos de referencia do Andre (OpenCV YuNet + SFace).

uso: python -I capas/rosto/verificar_rosto.py [--gravar]
Sem --gravar so imprime a tabela. Com --gravar escreve capas/banco/rosto.json
(id -> nota e sha256), que o teste capas/rosto.test.mjs confere.
Modelos (fora do git): Documents/Terra Gentil/modelos-rosto/*.onnx
"""
import hashlib
import json
import os
import sys

import cv2
import numpy as np

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # .../capas
MODELOS = os.path.join(os.path.expanduser("~"), "Documents", "Terra Gentil", "modelos-rosto")
REFS = ["andre-chroma-1", "andre-chroma-2", "andre-chroma-3", "andre-bone-logo",
        "andre-rua-1", "andre-rua-2"]


DET = None


def detector(largura, altura):
    global DET
    if DET is None:
        caminho = os.path.join(MODELOS, "face_detection_yunet_2023mar.onnx")
        DET = cv2.FaceDetectorYN.create(caminho, "", (largura, altura), 0.6, 0.3, 5000)
    DET.setInputSize((largura, altura))
    return DET


def reconhecedor():
    return cv2.FaceRecognizerSF.create(os.path.join(MODELOS, "face_recognition_sface_2021dec.onnx"), "")


def embedding(rec, caminho):
    """Vetor do maior rosto da imagem (ou None). Gira a imagem se o rosto nao aparece."""
    img = cv2.imread(caminho)
    if img is None:
        return None
    for giro in (None, cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_90_COUNTERCLOCKWISE):
        base = img if giro is None else cv2.rotate(img, giro)
        alt, larg = base.shape[:2]
        det = detector(larg, alt)
        _, rostos = det.detect(base)
        if rostos is not None and len(rostos):
            maior = max(rostos, key=lambda r: r[2] * r[3])
            return rec.feature(rec.alignCrop(base, maior)), len(rostos)
    return None


def sha256(caminho):
    return hashlib.sha256(open(caminho, "rb").read()).hexdigest()


def main():
    rec = reconhecedor()
    refs = []
    for nome in REFS:
        arq = os.path.join(RAIZ, "referencias", nome + ".jpg")
        if os.path.exists(arq):
            e = embedding(rec, arq)
            if e:
                refs.append(e[0])
    if not refs:
        sys.exit("sem rosto nas referencias")
    indice = json.load(open(os.path.join(RAIZ, "banco", "indice.json"), encoding="utf-8"))["capas"]
    itens = [(c["id"], os.path.join(RAIZ, "banco", *c["arquivo"].split("/")), "banco") for c in indice]
    pasta_rep = os.path.join(RAIZ, "reprovadas")
    for raiz, _, arquivos in os.walk(pasta_rep):
        for a in sorted(arquivos):
            itens.append((os.path.splitext(a)[0], os.path.join(raiz, a), "reprovada"))
    saida = {}
    for id_, caminho, onde in itens:
        e = embedding(rec, caminho)
        if e is None:
            saida[id_] = {"nota": None, "rostos": 0, "onde": onde, "sha256": sha256(caminho)}
            continue
        vetor, n = e
        notas = sorted((float(rec.match(r, vetor, cv2.FaceRecognizerSF_FR_COSINE)) for r in refs),
                       reverse=True)
        nota = round(float(np.mean(notas[:3])), 4)
        saida[id_] = {"nota": nota, "rostos": n, "onde": onde, "sha256": sha256(caminho)}
    if "--gravar" in sys.argv:
        destino = os.path.join(RAIZ, "banco", "rosto.json")
        corpo = {"_sobre": "Nota de rosto (cosseno SFace, media das 3 melhores referencias).",
                 "capas": {k: v for k, v in saida.items() if v["onde"] == "banco"}}
        with open(destino, "w", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(corpo, indent=2, ensure_ascii=False) + "\n")
    for id_, v in sorted(saida.items(), key=lambda kv: (kv[1]["nota"] is None, kv[1]["nota"] or 0)):
        print(f"{v['onde'][:4]} {id_:32s} {v['nota']} rostos={v['rostos']}")


if __name__ == "__main__":
    main()
