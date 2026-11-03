"""Leva as fotos do Flow de um livro para o ebook em 2K (regra do Andre: sempre 2K).

uso: python -I casar2k.py TG002
1. Move de Downloads os 1K da ferramenta (<id>.jpg, ids da fila) para fotos-flow/1k/TG002/.
2. Casa cada *_2K*.jpg de Downloads com o 1K mais parecido (correlacao em 48x64 cinza,
   corr >= 0.90 e 2a melhor bem pior) e move para fotos-flow/originais/TG002/<id>.jpg.
3. Trata (anti-IA, capas/tratar_capa.py) o 2K para ebooks/TG002/<id>.jpg.
Mostra os ids que ainda estao sem 2K.
"""
import glob
import json
import os
import shutil
import sys

import numpy as np
from PIL import Image

HOME = os.path.expanduser("~")
EBOOKS = os.path.join(HOME, "Documents", "Terra Gentil", "ebooks")
DL = os.path.join(HOME, "Downloads")
REPO = r"C:\Gitlab_hz\terra-gentil-site\terra-gentil\insta-terra-gentil"
sys.path.insert(0, os.path.join(REPO, "capas"))
from tratar_capa import tratar_arquivo  # noqa: E402


def sig(path):
    with Image.open(path) as im0:
        im = im0.convert("L").resize((48, 64), Image.BILINEAR)
    a = np.asarray(im, dtype=np.float64).ravel()
    a -= a.mean()
    return a / (np.linalg.norm(a) + 1e-9)


livro = sys.argv[1].upper()
fila = json.load(open(os.path.join(REPO, "gama-ebooks", f"fila-fotos-{livro.lower()}.json"), encoding="utf8"))
ids = [f["id"] for f in fila["fotos"]]
p1k = os.path.join(EBOOKS, "fotos-flow", "1k", livro)
p2k = os.path.join(EBOOKS, "fotos-flow", "originais", livro)
os.makedirs(p1k, exist_ok=True)
os.makedirs(p2k, exist_ok=True)

for i in ids:
    baixado = os.path.join(DL, i + ".jpg")
    if os.path.exists(baixado):
        shutil.move(baixado, os.path.join(p1k, i + ".jpg"))

refs = {i: sig(os.path.join(p1k, i + ".jpg")) for i in ids if os.path.exists(os.path.join(p1k, i + ".jpg"))}
if len(refs) < 2:
    sys.exit(f"faltam 1K em {p1k} ({len(refs)} de {len(ids)})")

for f in sorted(glob.glob(os.path.join(DL, "*_2K*.jpg")), key=os.path.getmtime):
    with Image.open(f) as im:
        if min(im.size) < 1500:
            continue
    s = sig(f)
    (melhor, id_), (segundo, _) = sorted(((float(s @ v), k) for k, v in refs.items()), reverse=True)[:2]
    if melhor < 0.90 or melhor - segundo < 0.05:
        continue  # 2K de outro livro ou de capa, fica em Downloads
    destino = os.path.join(p2k, id_ + ".jpg")
    if os.path.exists(destino):
        os.remove(f)  # duplicata
        continue
    shutil.move(f, destino)
    print(id_, round(melhor, 3))

faltam = []
for i in ids:
    orig = os.path.join(p2k, i + ".jpg")
    if os.path.exists(orig):
        tratar_arquivo(orig, os.path.join(EBOOKS, livro, i + ".jpg"))
        with Image.open(orig) as im:
            print("ok", i, im.size)
    else:
        faltam.append(i)
print("sem 2K:", ", ".join(faltam) if faltam else "nenhum")
