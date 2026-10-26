// Lê um molde .dc.html do Claude Design e separa as peças: título, fontes/estilo, corpo e lógica.

const ENTIDADES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

// O data-props vem como atributo HTML: precisa desfazer as entidades antes do JSON.parse.
export function desfazerEntidades(texto) {
  return texto.replace(/&(amp|lt|gt|quot|#39);/g, (e) => ENTIDADES[e]);
}

function pegar(texto, regex, rotulo) {
  const achou = texto.match(regex);
  if (!achou) throw new Error(`[dc] molde sem ${rotulo}`);
  return achou;
}

// Devolve { titulo, helmet, corpo, codigo, props }. Molde fora do formato derruba a execução.
export function extrair(texto) {
  const titulo = pegar(texto, /<title>([\s\S]*?)<\/title>/, '<title>')[1].trim();
  const xdc = pegar(texto, /<x-dc>([\s\S]*?)<\/x-dc>/, '<x-dc>')[1];
  const helmet = xdc.match(/<helmet>([\s\S]*?)<\/helmet>/);
  const script = pegar(
    texto,
    /<script type="text\/x-dc"[^>]*?data-props='([^']*)'[^>]*>([\s\S]*?)<\/script>/,
    'script x-dc com data-props',
  );
  return {
    titulo,
    helmet: helmet ? helmet[1].trim() : '',
    corpo: helmet ? xdc.replace(helmet[0], '').trim() : xdc.trim(),
    codigo: script[2].trim(),
    props: JSON.parse(desfazerEntidades(script[1])),
  };
}

// Valor padrão de cada ajuste editável (as chaves com $ são do editor, não do molde).
export function padroesDe(props) {
  const padroes = {};
  for (const [nome, ajuste] of Object.entries(props)) {
    if (!nome.startsWith('$') && 'default' in ajuste) padroes[nome] = ajuste.default;
  }
  return padroes;
}
