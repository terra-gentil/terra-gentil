// Monta e confere o post: fatos contra o livro, formato, tamanhos, travessão e fechamento da marca.
import { ESTRUTURA, problemasDoRoteiro } from '../carrossel/estrutura.mjs';
import { CHAVES_DO_BRUTO, FINAL_FIXO, chaveDoSlide } from './esquema.mjs';
import { validarFatos } from './fatos.mjs';
import { SERIES } from './series.mjs';

const textoOk = (valor) => typeof valor === 'string' && valor.trim().length > 0;
const TRAVESSAO = /[—–]/;

// Confere um post pronto (o que está em dados/posts/). Devolve a lista de problemas, vazia se ok.
// Roda na rotina (antes de gravar) e de novo no merge: o repositório é público e o post vai ao ar.
export function conferirPost(post, { livro, paginas }) {
  const problemas = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post?.dia ?? '')) problemas.push('dia inválido');
  if (post?.palavra !== livro.palavra) {
    problemas.push(`palavra "${post?.palavra}" não é a do livro (${livro.palavra})`);
  }
  if (!SERIES.includes(post?.serie)) problemas.push(`série desconhecida: ${post?.serie}`);
  for (const campo of ['especie', 'nome', 'gancho', 'resumo']) {
    if (!textoOk(post?.[campo])) problemas.push(`falta "${campo}"`);
    if (TRAVESSAO.test(post?.[campo] ?? '')) problemas.push(`travessão em "${campo}"`);
  }
  let fatos = [];
  try {
    fatos = validarFatos(post?.fatos, { paginas, titulo: livro.titulo });
  } catch (erro) {
    problemas.push(erro.message);
  }
  const usados = post?.fatosUsados;
  if (!Array.isArray(usados) || !usados.length || usados.some((n) => !fatos[n])) {
    problemas.push('"fatosUsados" vazio ou com número que não existe nos fatos');
  } else {
    const fontes = [...new Set(usados.map((n) => fatos[n].fonte))];
    if (JSON.stringify(fontes) !== JSON.stringify(post.fontes)) problemas.push('"fontes" não bate');
  }
  problemas.push(...problemasDoRoteiro(post?.slides));
  const final = post?.slides?.[ESTRUTURA.length - 1] ?? {};
  for (const [campo, esperado] of Object.entries(FINAL_FIXO)) {
    if (final[campo] !== esperado) problemas.push(`fechamento: "${campo}" deve ser "${esperado}"`);
  }
  return problemas;
}

// bruto = o que a rotina escreveu. livro = { palavra, titulo } do dados/palavras.json.
export function montarPost(bruto, { livro, paginas, dia }) {
  const faltando = CHAVES_DO_BRUTO.filter((chave) => !(chave in (bruto ?? {})));
  if (faltando.length) throw new Error(`[roteiro] faltam chaves: ${faltando.join(', ')}`);
  const slides = ESTRUTURA.map((tipo, i) => {
    const slide = bruto[chaveDoSlide(i)] ?? {};
    return tipo === 'final' ? { ...slide, ...FINAL_FIXO } : slide;
  });
  const { palavra, especie, nome, serie, gancho, resumo, fatosUsados } = bruto;
  const fatos = Array.isArray(bruto.fatos) ? bruto.fatos : [];
  const comFonte = fatos.map((f) => ({ ...f, fonte: `${livro.titulo}, p. ${f?.pagina}` }));
  const fontes = Array.isArray(fatosUsados)
    ? [...new Set(fatosUsados.map((n) => comFonte[n]?.fonte))]
    : [];
  const post = { dia, palavra, especie, nome, serie, gancho, resumo, slides };
  Object.assign(post, { fatos: comFonte, fatosUsados, fontes });
  const problemas = conferirPost(post, { livro, paginas });
  if (problemas.length) throw new Error(`[roteiro] inválido:\n- ${problemas.join('\n- ')}`);
  return post;
}
