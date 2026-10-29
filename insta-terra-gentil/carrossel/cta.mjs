// Chamada do último slide: o ebook do tema pela palavra-chave, seguir o canal e o app gratuito.

// Sem palavra (post sem ebook), o slide fica com o texto da rotina e as chamadas do molde.
export function ctaDoFinal(palavra, tituloEbook) {
  if (!palavra) return {};
  const chave = palavra.toUpperCase();
  const livro = tituloEbook ? ` "${tituloEbook.split(':')[0].trim()}"` : '';
  return {
    texto: `Gostou do tema? Comente ${chave} que eu te mando o ebook${livro} de graça.`,
    ctaSalvar: `Comente ${chave}`,
    ctaSeguir: 'Siga para mais dicas',
    ctaSite: 'Planta com problema? App grátis',
  };
}
