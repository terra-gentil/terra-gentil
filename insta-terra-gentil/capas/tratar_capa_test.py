"""Testes do tratamento anti-IA. uso: python -I capas/tratar_capa_test.py"""
import importlib.util
import os
import unittest

import numpy as np
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("tratar_capa", os.path.join(AQUI, "tratar_capa.py"))
tc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tc)


def cinza(nivel=128, tam=(1080, 1350)):
    return Image.new("RGB", tam, (nivel, nivel, nivel))


class TratarCapa(unittest.TestCase):
    def test_mesma_entrada_mesma_saida(self):
        a = np.asarray(tc.tratar(cinza(), 7))
        b = np.asarray(tc.tratar(cinza(), 7))
        self.assertTrue(np.array_equal(a, b))

    def test_semente_diferente_muda_o_grao(self):
        a = np.asarray(tc.tratar(cinza(), 1))
        b = np.asarray(tc.tratar(cinza(), 2))
        self.assertFalse(np.array_equal(a, b))

    def test_nao_muda_o_tamanho(self):
        self.assertEqual(tc.tratar(cinza(), 1).size, (1080, 1350))

    def test_esquenta_o_tom(self):
        px = np.asarray(tc.tratar(cinza(), 1), dtype=np.float64)
        r, g, b = (px[..., i].mean() for i in range(3))
        self.assertGreater(r, g)
        self.assertLess(b, g)

    def test_grao_tem_o_desvio_pedido(self):
        px = np.asarray(tc.tratar(cinza(), 1), dtype=np.float64)
        self.assertAlmostEqual(px[..., 1].std(), tc.GRAO, delta=0.5)

    def test_semente_vem_so_do_nome(self):
        self.assertEqual(tc.semente("a/b/rosa-F-1.jpg"), tc.semente("c/rosa-F-1.jpg"))


if __name__ == "__main__":
    unittest.main()
