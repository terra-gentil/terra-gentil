// Testes do banco de capas: rodízio, contagem de posts anteriores e espécie sem capa.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { hashDoArquivo, marcar } from './revisao.mjs';

// Nota de rosto boa para todas as capas de teste.
function rostoBom(pasta, ids) {
  const hash = (id) => hashDoArquivo(path.join(pasta, 'orquidea', `${id}.jpg`));
  return Object.fromEntries(ids.map((id) => [id, { nota: 0.9, sha256: hash(id) }]));
}
import { capaDoDia, capasDaEspecie, escolherCapa, lerPosts, vezesAntes } from './banco.mjs';

function banco() {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-capas-'));
  fs.mkdirSync(path.join(pasta, 'orquidea'));
  for (const n of ['orquidea-C-1.jpg', 'orquidea-A-1.jpg', 'orquidea-B-1.jpg', 'notas.txt']) {
    fs.writeFileSync(path.join(pasta, 'orquidea', n), 'x');
  }
  return pasta;
}

test('lista só imagens, em ordem de nome', () => {
  const pasta = banco();
  const nomes = capasDaEspecie('orquidea', pasta).map((c) => path.basename(c));
  assert.deepEqual(nomes, ['orquidea-A-1.jpg', 'orquidea-B-1.jpg', 'orquidea-C-1.jpg']);
  assert.deepEqual(capasDaEspecie('jiboia', pasta), []);
  fs.rmSync(pasta, { recursive: true });
});

test('rodízio volta ao começo e lista vazia dá null', () => {
  assert.equal(escolherCapa(['a', 'b', 'c'], 0), 'a');
  assert.equal(escolherCapa(['a', 'b', 'c'], 4), 'b');
  assert.equal(escolherCapa([], 2), null);
});

test('conta só posts da mesma espécie antes do dia', () => {
  const posts = [
    { dia: '2026-10-01', especie: 'Phalaenopsis' },
    { dia: '2026-10-10', especie: 'Aloe vera' },
    { dia: '2026-10-20', especie: 'Phalaenopsis' },
    { dia: '2026-11-01', especie: 'Phalaenopsis' },
  ];
  assert.equal(vezesAntes('Phalaenopsis', posts, '2026-11-01'), 2);
  assert.equal(vezesAntes('Aloe vera', posts, '2026-10-10'), 0);
});

test('capaDoDia troca a capa a cada post e cai em null sem catálogo ou sem banco', () => {
  const pastaBanco = banco();
  const catalogo = { Phalaenopsis: { slug: 'orquidea' }, 'Aloe vera': { slug: 'babosa' } };
  const posts = [{ dia: '2026-10-01', especie: 'Phalaenopsis' }];
  let revisao = {};
  for (const n of ['A', 'B', 'C']) {
    const caminho = path.join(pastaBanco, 'orquidea', `orquidea-${n}-1.jpg`);
    revisao = marcar(revisao, `orquidea-${n}-1`, 'aprovada', hashDoArquivo(caminho));
  }
  const rosto = rostoBom(pastaBanco, ['orquidea-A-1', 'orquidea-B-1', 'orquidea-C-1']);
  const opcoes = { catalogo, pastaBanco, posts, revisao, rosto };
  const nome = (dia) => path.basename(capaDoDia('Phalaenopsis', dia, opcoes).caminho);
  assert.equal(nome('2026-10-01'), 'orquidea-A-1.jpg');
  assert.equal(nome('2026-11-01'), 'orquidea-B-1.jpg');
  assert.equal(capaDoDia('Aloe vera', '2026-11-01', opcoes), null);
  assert.equal(capaDoDia('Ficus', '2026-11-01', opcoes), null);
  fs.rmSync(pastaBanco, { recursive: true });
});

test('capaDoDia nunca entrega capa reprovada, em dúvida, alterada ou sem revisão', () => {
  const pastaBanco = banco();
  const catalogo = { Phalaenopsis: { slug: 'orquidea' } };
  const hash = (n) => hashDoArquivo(path.join(pastaBanco, 'orquidea', `orquidea-${n}-1.jpg`));
  let revisao = marcar({}, 'orquidea-A-1', 'reprovada', hash('A'));
  revisao = marcar(revisao, 'orquidea-B-1', 'duvida', hash('B'));
  revisao = marcar(revisao, 'orquidea-C-1', 'aprovada', 'hash-de-outro-arquivo');
  const rosto = rostoBom(pastaBanco, ['orquidea-A-1', 'orquidea-B-1', 'orquidea-C-1']);
  const opcoes = { catalogo, pastaBanco, posts: [], revisao, rosto };
  assert.equal(capaDoDia('Phalaenopsis', '2026-11-01', opcoes), null);
  const semRevisao = { catalogo, pastaBanco, posts: [], rosto };
  assert.throws(() => capaDoDia('Phalaenopsis', '2026-11-01', semRevisao));
  fs.rmSync(pastaBanco, { recursive: true });
});

test('lerPosts pega dia do nome e ignora arquivos fora do padrão', () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-posts-'));
  fs.writeFileSync(path.join(pasta, '2026-10-28-imortal.json'), '{"especie":"Aloe vera"}');
  fs.writeFileSync(path.join(pasta, '.gitkeep'), '');
  assert.deepEqual(lerPosts(pasta), [{ dia: '2026-10-28', especie: 'Aloe vera', tema: null }]);
  fs.rmSync(pasta, { recursive: true });
});
