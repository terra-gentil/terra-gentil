"""Casa cada 2K baixado da galeria do Flow com a capa 1K mais parecida e move para capas-2k/<slug>/<id>.jpg.

uso: python -I capas/place2k.py [pasta_1k]
Padrao da pasta 1K: Documents/Terra Gentil/lote82-1k (os 1K vistoriados + vistoria.json).
Processa os *_2K*.jpg de Downloads com 1792x2400. Casa por correlacao em 48x64 cinza e so move se
corr >= 0.90 e a 2a melhor for bem pior. Capa reprovada na vistoria e deixada em Downloads.
"""
import glob
import json
import os
import shutil
import sys

import numpy as np
from PIL import Image

HOME = os.path.expanduser("~")
REF = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HOME, "Documents", "Terra Gentil", "lote82-1k")
DL = os.path.join(HOME, "Downloads")
DEST = os.path.join(HOME, "Documents", "Terra Gentil", "capas-2k")


def sig(path):
    with Image.open(path) as im0:
        im = im0.convert("L").resize((48, 64), Image.BILINEAR)
    a = np.asarray(im, dtype=np.float64).ravel()
    a -= a.mean()
    return a / (np.linalg.norm(a) + 1e-9)


vistoria_arq = os.path.join(REF, "vistoria.json")
vistoria = json.load(open(vistoria_arq, encoding="utf8")) if os.path.exists(vistoria_arq) else {}
refs = {os.path.basename(f)[:-4]: sig(f) for f in glob.glob(os.path.join(REF, "*.jpg"))
        if os.path.basename(f)[:-4] in vistoria or not vistoria}
feitos = {}
for f in sorted(glob.glob(os.path.join(DL, "*_2K*.jpg")), key=os.path.getmtime):
    with Image.open(f) as im:
        if im.size != (1792, 2400):
            continue
    s = sig(f)
    sc = sorted(((float(s @ v), k) for k, v in refs.items()), reverse=True)
    (melhor, id_), (segundo, id2) = sc[0], sc[1]
    ok = melhor >= 0.90 and melhor - segundo >= 0.05
    aprovada = vistoria.get(id_, {}).get("veredito", "aprovada") == "aprovada"
    estado = "OK" if ok and aprovada else ("REPROVADA" if ok else "DUVIDA")
    print(os.path.basename(f)[:40], "->", id_, round(melhor, 3), "2o", id2, round(segundo, 3), estado)
    if estado == "OK":
        pasta = os.path.join(DEST, id_.rsplit("-", 2)[0])
        os.makedirs(pasta, exist_ok=True)
        destino = os.path.join(pasta, id_ + ".jpg")
        if os.path.exists(destino):
            os.remove(f)  # duplicata do mesmo 2K
        else:
            shutil.move(f, destino)
            feitos[id_] = True
print("movidos", len(feitos))
