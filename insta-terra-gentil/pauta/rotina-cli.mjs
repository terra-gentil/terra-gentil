// Comandos da rotina do Claude: proximo, noticias, ler, gravar, conferir e livros (extrai os PDFs).
import path from 'node:path';
import { RAIZ } from '../lib/config.mjs';
import { lerJson } from '../lib/json.mjs';
import { carregarPalavras } from '../dm/palavras.mjs';
import { conferirTodos, gravarPost, lerPosts } from './gravar-post.mjs';
import { lerPauta, listarNoticias } from './lista-noticias.mjs';
import { arquivoDoLivro, extrairTodos, lerLivro } from './livros.mjs';
import { diaDoPost, proximoLivro } from './proxima.mjs';

const [comando, ...resto] = process.argv.slice(2);
const opcao = (nome) => resto.includes(`--${nome}`);
const valor = (nome) => resto[resto.indexOf(`--${nome}`) + 1];
const palavras = carregarPalavras();

function falhar(mensagem) {
  console.error(mensagem);
  process.exit(1);
}

// Livro com marcador de página: é por ele que a rotina descobre a página de cada fato.
function mostrarLivro(palavra) {
  const livro = palavras.find((p) => p.palavra === palavra.toUpperCase());
  if (!livro) falhar('uso: rotina-cli ler <PALAVRA>');
  for (const [i, texto] of lerLivro(livro).entries()) {
    console.log(`\n=== PÁGINA ${i + 1} ===\n${texto.trim()}`);
  }
}

function conferir() {
  const ruins = conferirTodos({ palavras }).filter((r) => r.problemas.length);
  for (const { nome, problemas } of ruins) console.error(`${nome}:\n- ${problemas.join('\n- ')}`);
  if (ruins.length) falhar(`${ruins.length} post(s) com problema`);
  console.log('todos os posts conferem');
}

try {
  if (comando === 'proximo') {
    const posts = lerPosts();
    const livro = proximoLivro(palavras, posts);
    const arquivo = path.relative(RAIZ, arquivoDoLivro(livro)).replaceAll('\\', '/');
    const dia = valor('dia') ?? diaDoPost();
    const jaTem = posts.some((p) => p.dia === dia);
    const paginas = lerLivro(livro).length;
    console.log(JSON.stringify({ ...livro, dia, jaTem, livro: arquivo, paginas }));
  } else if (comando === 'noticias') {
    const max = valor('max') ? Number(valor('max')) : undefined;
    console.log(JSON.stringify(listarNoticias(lerPauta(), { max }), null, 2));
  } else if (comando === 'gravar') {
    const arquivoBruto = resto.find((r) => !r.startsWith('--') && r !== valor('dia'));
    if (!arquivoBruto) falhar('uso: rotina-cli gravar <bruto.json> [--dia AAAA-MM-DD] [--forcar]');
    const dia = valor('dia') ?? diaDoPost();
    const bruto = lerJson(path.resolve(arquivoBruto));
    const { arquivo, post } = gravarPost(bruto, { dia, palavras, forcar: opcao('forcar') });
    console.log(`post gravado: ${path.relative(RAIZ, arquivo)}`);
    console.log(`livro ${post.palavra} | série ${post.serie} | fontes: ${post.fontes.join(' | ')}`);
  } else if (comando === 'ler') {
    mostrarLivro(resto[0] ?? '');
  } else if (comando === 'conferir') {
    conferir();
  } else if (comando === 'livros') {
    console.table(extrairTodos(palavras, { forcar: opcao('forcar') }));
  } else {
    falhar('uso: rotina-cli <proximo|noticias|ler|gravar|conferir|livros> (veja pauta/README.md)');
  }
} catch (erro) {
  falhar(erro.message);
}
