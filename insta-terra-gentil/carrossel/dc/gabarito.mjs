// Corpo do molde: resolve os blocos <sc-if> e <sc-for> (aninhados) e preenche os campos.
import { buscar, preencher } from './campos.mjs';

const MARCA = /<sc-(if|for)\b[^>]*>|<\/sc-(if|for)>/g;

function atributo(tag, nome) {
  const achou = tag.match(new RegExp(String.raw`\b${nome}="\{\{\s*([\w.$]+)\s*\}\}"`));
  if (!achou) throw new Error(`[dc] ${tag.slice(0, 30)}... sem ${nome}="{{campo}}"`);
  return achou[1];
}

// Quebra o HTML numa árvore: texto puro, { tipo: 'if', campo } e { tipo: 'for', lista, como }.
export function lerBlocos(html) {
  const raiz = { filhos: [] };
  const pilha = [raiz];
  let fim = 0;
  for (const marca of html.matchAll(MARCA)) {
    const topo = pilha.at(-1);
    if (marca.index > fim) topo.filhos.push(html.slice(fim, marca.index));
    fim = marca.index + marca[0].length;
    if (marca[2]) {
      if (pilha.length === 1 || topo.tipo !== marca[2]) {
        throw new Error(`[dc] </sc-${marca[2]}> fora de lugar`);
      }
      pilha.pop();
    } else if (marca[1] === 'if') {
      const bloco = { tipo: 'if', campo: atributo(marca[0], 'value'), filhos: [] };
      topo.filhos.push(bloco);
      pilha.push(bloco);
    } else {
      const como = marca[0].match(/\bas="(\w+)"/);
      if (!como) throw new Error('[dc] <sc-for> sem as="nome"');
      const bloco = { tipo: 'for', lista: atributo(marca[0], 'list'), como: como[1], filhos: [] };
      topo.filhos.push(bloco);
      pilha.push(bloco);
    }
  }
  if (pilha.length > 1) throw new Error(`[dc] <sc-${pilha.at(-1).tipo}> sem fechamento`);
  if (fim < html.length) raiz.filhos.push(html.slice(fim));
  return raiz.filhos;
}

function gerar(filhos, escopo) {
  return filhos
    .map((no) => {
      if (typeof no === 'string') return preencher(no, escopo);
      if (no.tipo === 'if') return buscar(escopo, no.campo) ? gerar(no.filhos, escopo) : '';
      const itens = buscar(escopo, no.lista);
      if (!Array.isArray(itens)) throw new Error(`[dc] ${no.lista} não é uma lista`);
      const volta = (item, i) => gerar(no.filhos, { ...escopo, [no.como]: item, $index: i });
      return itens.map(volta).join('');
    })
    .join('');
}

// Corpo do molde + valores do renderVals = HTML final do slide.
export function renderizarCorpo(html, valores) {
  return gerar(lerBlocos(html), valores);
}
