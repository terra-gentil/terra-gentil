// Estrutura fixa dos 8 slides do carrossel e validação do roteiro (os textos de cada slide).

// Posição = tipo de molde. Os contadores padrão dos moldes (2/8 problema, 5/8 passo, 8/8 final)
// mostram esta ordem. Para mudar a história do carrossel, é só mexer aqui.
export const ESTRUTURA = Object.freeze([
  'capa',
  'problema',
  'problema',
  'problema',
  'passo',
  'passo',
  'problema',
  'final',
]);

// Textos que o roteiro precisa trazer. Passo ganha número e tarja sozinho ("Passo 1", "01").
export const TEXTOS_OBRIGATORIOS = Object.freeze({
  capa: ['tarja', 'linha1', 'linha2', 'linha3', 'destaque'],
  problema: ['tarja', 'linha1', 'linha2', 'destaque', 'texto', 'nota'],
  passo: ['linha1', 'linha2', 'destaque', 'texto', 'dica'],
  final: ['tarja', 'linha1', 'linha2', 'destaque', 'texto'],
});

const TRAVESSAO = /[—–]/;

// Lista de problemas do roteiro (vazia = pode montar). Travessão é proibido em texto de post.
export function problemasDoRoteiro(slides) {
  if (!Array.isArray(slides) || slides.length !== ESTRUTURA.length) {
    return [`o roteiro precisa de ${ESTRUTURA.length} slides`];
  }
  const problemas = [];
  slides.forEach((slide, i) => {
    const tipo = ESTRUTURA[i];
    for (const campo of TEXTOS_OBRIGATORIOS[tipo]) {
      const valor = slide?.[campo];
      if (typeof valor !== 'string' || !valor.trim()) {
        problemas.push(`slide ${i + 1} (${tipo}): falta "${campo}"`);
      }
    }
    for (const [campo, valor] of Object.entries(slide ?? {})) {
      if (typeof valor === 'string' && TRAVESSAO.test(valor)) {
        problemas.push(`slide ${i + 1}: travessão em "${campo}"`);
      }
    }
  });
  return problemas;
}
