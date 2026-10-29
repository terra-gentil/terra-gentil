// Confere a matéria do site (texto longo do post): tamanho, fatos por seção, formato e travessão.
import { TOXICIDADE } from './fatos.mjs';

export const MATERIA = Object.freeze({
  palavrasMin: 600,
  tituloMax: 60,
  descricaoMin: 150,
  descricaoMax: 160,
  secoes: [3, 5],
  faq: [2, 3],
});

const TRAVESSAO = /[—–]/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const texto = (v) => typeof v === 'string' && v.trim().length > 0;
const contar = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0);

// Todos os textos da matéria, na ordem em que aparecem na página.
export function textosDaMateria(m) {
  const secoes = (m.secoes ?? []).flatMap((s) => [s?.titulo, ...(s?.paragrafos ?? [])]);
  const faq = (m.faq ?? []).flatMap((q) => [q?.pergunta, q?.resposta]);
  return [m.titulo, m.descricao, m.introducao, ...secoes, ...faq, m.conclusao].filter(texto);
}

export function palavrasDaMateria(m) {
  const corpo = textosDaMateria(m).slice(2); // título e descrição não entram na conta
  return corpo.reduce((soma, t) => soma + contar(t), 0);
}

function problemasDasSecoes(secoes, qtdFatos) {
  const [min, max] = MATERIA.secoes;
  if (!Array.isArray(secoes) || secoes.length < min || secoes.length > max) {
    return [`materia: precisa de ${min} a ${max} seções`];
  }
  const problemas = [];
  secoes.forEach((s, i) => {
    if (!texto(s?.titulo)) problemas.push(`materia: seção ${i} sem título`);
    const par = s?.paragrafos;
    if (!Array.isArray(par) || !par.length || !par.every(texto)) {
      problemas.push(`materia: seção ${i} sem parágrafos`);
    }
    const usados = s?.fatosUsados;
    const existe = (n) => Number.isInteger(n) && n >= 0 && n < qtdFatos;
    const ruim = !Array.isArray(usados) || !usados.length || !usados.every(existe);
    if (ruim) problemas.push(`materia: seção ${i} precisa citar ao menos um fato existente`);
  });
  return problemas;
}

// Devolve a lista de problemas (vazia se ok). qtdFatos = quantos fatos o post tem. podePet = o
// post usa fato com fonte de pet (UFG, ASPCA, Ancara, Cats Protection), então pode falar disso.
export function problemasDaMateria(m, qtdFatos, podePet = false) {
  if (!m || typeof m !== 'object') return ['falta "materia"'];
  const problemas = [];
  if (!SLUG.test(m.slug ?? '') || m.slug.length > 80) problemas.push('materia: "slug" inválido');
  const { tituloMax: tmax, descricaoMin: dmin, descricaoMax: dmax } = MATERIA;
  if (!texto(m.titulo) || m.titulo.length > tmax) problemas.push(`materia: título até ${tmax}`);
  const dl = (m.descricao ?? '').length;
  if (dl < dmin || dl > dmax) problemas.push(`materia: descrição de ${dmin} a ${dmax} (tem ${dl})`);
  for (const campo of ['introducao', 'conclusao']) {
    if (!texto(m[campo])) problemas.push(`materia: falta "${campo}"`);
  }
  problemas.push(...problemasDasSecoes(m.secoes, qtdFatos));
  const [fmin, fmax] = MATERIA.faq;
  const faq = m.faq;
  if (!Array.isArray(faq) || faq.length < fmin || faq.length > fmax) {
    problemas.push(`materia: faq com ${fmin} a ${fmax} perguntas`);
  } else if (!faq.every((q) => texto(q?.pergunta) && texto(q?.resposta))) {
    problemas.push('materia: faq com pergunta ou resposta vazia');
  }
  const todos = textosDaMateria(m);
  if (todos.some((t) => TRAVESSAO.test(t))) problemas.push('materia: travessão no texto');
  if (!podePet && todos.some((t) => TOXICIDADE.test(t))) {
    problemas.push('materia: fala de toxicidade ou pet sem fato com fonte de pet');
  }
  const palavras = palavrasDaMateria(m);
  if (palavras < MATERIA.palavrasMin) {
    problemas.push(`materia: ${palavras} palavras, o mínimo é ${MATERIA.palavrasMin}`);
  }
  return problemas;
}
