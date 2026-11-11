# PDF web (menos de 10 MB) a partir de ebooks/TGNNN-previa.pdf. Uso: python scripts/guias/pdf-web.py TG101 TG102 (sem -I: o PyMuPDF e do usuario)
import sys, os, fitz
E = r"C:\Users\engan\Documents\Terra Gentil\ebooks"
os.makedirs(os.path.join(E, "pdf-web"), exist_ok=True)
for c in sys.argv[1:]:
    src = os.path.join(E, c + "-previa.pdf")
    dst = os.path.join(E, "pdf-web", c + ".pdf")
    doc = fitz.open(src)
    doc.rewrite_images(dpi_target=110, quality=62)
    doc.save(dst, garbage=1, deflate=True)  # garbage>=2 embaralha as fontes Type3 (texto ilegivel)
    doc.close()
    print(c, round(os.path.getsize(src)/1048576, 1), "->", round(os.path.getsize(dst)/1048576, 1), "MB")
