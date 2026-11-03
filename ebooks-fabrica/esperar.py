"""Espera os downloads de um livro chegarem em Downloads.

uso: python -I esperar.py TG004 1k   (os <id>.jpg da ferramenta)
     python -I esperar.py TG004 2k   (8 *_2K*.jpg mais novos que o ultimo 1K desse livro)
"""
import glob
import json
import os
import sys
import time

DL = os.path.join(os.path.expanduser("~"), "Downloads")
REPO = r"C:\Gitlab_hz\terra-gentil-site\terra-gentil\insta-terra-gentil"
livro, modo = sys.argv[1].upper(), sys.argv[2]
ids = [f["id"] for f in json.load(open(os.path.join(REPO, "gama-ebooks", f"fila-fotos-{livro.lower()}.json"), encoding="utf8"))["fotos"]]
limite = time.time() + 600
while time.time() < limite:
    um = [os.path.join(DL, i + ".jpg") for i in ids if os.path.exists(os.path.join(DL, i + ".jpg"))]
    if modo == "1k" and len(um) == len(ids):
        break
    if modo == "2k":
        base = max(os.path.getmtime(f) for f in um) if um else time.time() - 3600
        novos = [f for f in glob.glob(os.path.join(DL, "*_2K*.jpg")) if os.path.getmtime(f) > base]
        if len(novos) >= len(ids):
            time.sleep(3)
            break
    time.sleep(3)
print(livro, modo, "pronto" if time.time() < limite else "TEMPO ESGOTADO")
