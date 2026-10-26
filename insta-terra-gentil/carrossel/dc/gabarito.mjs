// Aplica no corpo do molde as condições <sc-if> e os campos {{nome}}, sem deixar nada passar.

const ABRE_OU_FECHA = /<sc-if\b[^>]*?value="\{\{\s*(\w+)\s*\}\}"[^>]*>|<\/sc-if>/g;

export function escapar(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Mantém só os blocos <sc-if> verdadeiros. Aceita blocos aninhados.
export function aplicarCondicoes(html, valores) {
  const pilha = [];
  let saida = '';
  let fim = 0;
  const visivel = () => pilha.every(Boolean);
  for (const marca of html.matchAll(ABRE_OU_FECHA)) {
    if (visivel()) saida += html.slice(fim, marca.index);
    fim = marca.index + marca[0].length;
    if (marca[1] === undefined) {
      if (pilha.length === 0) throw new Error('[dc] </sc-if> sem abertura');
      pilha.pop();
    } else {
      if (!(marca[1] in valores)) throw new Error(`[dc] condição desconhecida: ${marca[1]}`);
      pilha.push(Boolean(valores[marca[1]]));
    }
  }
  if (pilha.length > 0) throw new Error('[dc] <sc-if> sem fechamento');
  return saida + (visivel() ? html.slice(fim) : '');
}

// Troca cada {{nome}} pelo valor escapado. Campo que não existe derruba a execução de propósito.
export function preencher(html, valores) {
  return html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, nome) => {
    if (!(nome in valores)) throw new Error(`[dc] campo desconhecido: ${nome}`);
    return escapar(valores[nome]);
  });
}
