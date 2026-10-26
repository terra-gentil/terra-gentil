// Escolhe a melhor foto entre os candidatos: vertical, grande, licença segura e com crédito.
const PROPORCAO_IDEAL = 1350 / 1080;

// CC0 e domínio público não pedem crédito. As demais exigem autor.
function semCredito(licenca) {
  return /^(CC0|Public domain|PD)/i.test(licenca ?? '');
}

export function serve(foto, { larguraMin = 1080, aceitarCompartilhaIgual = false } = {}) {
  if (!foto.licenca || foto.mime !== 'image/jpeg') return false;
  if (foto.compartilhaIgual && !aceitarCompartilhaIgual) return false;
  if (!Number.isFinite(foto.largura) || !Number.isFinite(foto.altura)) return false;
  if (foto.largura < larguraMin || foto.altura <= foto.largura) return false;
  return Boolean(foto.autor) || semCredito(foto.licenca);
}

// Quanto mais perto de 4:5, melhor. Licença sem compartilha-igual e resolução desempatam.
export function nota(foto) {
  const proporcao = foto.altura / foto.largura;
  const livre = foto.compartilhaIgual ? 0 : 1;
  return -Math.abs(proporcao - PROPORCAO_IDEAL) * 4 + livre + Math.min(foto.largura, 3000) / 3000;
}

export function creditoDe(foto) {
  const autor = foto.autor ? `${foto.autor} / ` : '';
  return `Foto: ${autor}${foto.fonte ?? 'Wikimedia Commons'} (${foto.licenca})`;
}

export function escolherFoto(candidatos, opcoes = {}) {
  const { vistas = [] } = opcoes;
  const boas = candidatos
    .filter((foto) => !vistas.includes(foto.url) && serve(foto, opcoes))
    .sort((a, b) => nota(b) - nota(a));
  return boas.length ? { foto: boas[0], credito: creditoDe(boas[0]) } : null;
}
