// Campos {{nome}} do molde: busca por caminho (com ponto) e escape seguro para HTML.

export function escapar(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Busca "pt.cor" dentro do escopo. Qualquer degrau que não exista derruba a execução.
export function buscar(escopo, caminho) {
  let atual = escopo;
  for (const passo of caminho.split('.')) {
    const existe = atual !== null && typeof atual === 'object' && passo in atual;
    if (!existe) throw new Error(`[dc] campo desconhecido: ${caminho}`);
    atual = atual[passo];
  }
  return atual;
}

// Troca cada {{caminho}} do texto pelo valor escapado.
export function preencher(texto, escopo) {
  const trocar = (_, caminho) => escapar(buscar(escopo, caminho));
  return texto.replace(/\{\{\s*([\w.$]+)\s*\}\}/g, trocar);
}
