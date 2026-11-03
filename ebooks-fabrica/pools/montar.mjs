// Divide os fatos livres da biblia entre os livros do dia, sem sobreposicao.
// Especie exclusiva vai para um livro; especies compartilhadas sao divididas em rodizio entre os agentes.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const REPO = 'C:/Gitlab_hz/terra-gentil-site/terra-gentil/insta-terra-gentil';
const R = `${REPO}/gama-ebooks/roteiros`;
const usados = new Set();
for (const a of readdirSync(R).filter((x) => x.endsWith('.json')))
  for (const p of JSON.parse(readFileSync(`${R}/${a}`, 'utf8')).paginas) for (const f of p.fatos ?? []) usados.add(f);
const fatos = JSON.parse(readFileSync(`${REPO}/dados/biblia.json`, 'utf8')).fatos;
const LIVROS = {
  '087': ['tomate'],
  '088': ['batata', 'batata-doce', 'inhame', 'taioba', 'cebola', 'alho', 'gengibre'],
  '089': ['beterraba', 'acelga', 'espinafre', 'aipo', 'aspargo', 'chicória', 'rúcula', 'coentro'],
  '090': ['ervilha', 'feijão', 'amendoim', 'milho'],
  '091': ['pepino', 'berinjela', 'quiabo', 'melancia', 'abóbora'],
  '092': ['jasmim', 'jasmim-de-madagascar', 'gardênia', 'tuberosa', 'hoia', 'flor-de-cera', 'ervilha-de-cheiro', 'jasmim-manga', 'camomila'],
  '093': ['cosmos', 'zínia', 'cravo', 'boca-de-leão', 'celósia', 'petúnia', 'gazânia', 'álisso', 'alisso', 'amaranto', 'perpétua', 'crista-de-galo', 'onze-horas', 'vinca', 'torênia', 'lobélia', 'nigela', 'flor-de-fumo', 'tagetes', 'beijinho', 'amor-perfeito'],
  '094': ['alporquia', 'muda'],
  '095': ['passarinho', 'andorinhão', 'morcego', 'jardim-vivo'],
  '096': ['roseira'],
  '097': ['solo', 'trocar-vaso', 'adubar'],
  '098': ['rosa-do-deserto'],
  '099': ['orquídea'],
  '100': ['clorofito', 'tradescântia', 'cróton', 'aspidistra', 'peixinho', 'cissus', 'confete', 'coleus', 'planta-batom', 'palma-de-santa-rita', 'trapoeraba'],
};
const COMPART = ['outra', 'horta', 'mato', 'praga', 'regar', 'arvore', 'abelha'];
const AGENTES = [['087', '088'], ['089', '090'], ['091', '092'], ['093', '094'], ['095', '096'], ['097', '098'], ['099', '100']];
const linha = (id, f) => `${id} [${f.esp}|${f.serie}] ${f.texto}`;
const cont = {};
AGENTES.forEach((par, k) => {
  const out = [];
  for (const n of par) {
    out.push(`## EXCLUSIVOS DO TG ${n}`);
    for (const [id, f] of Object.entries(fatos)) if (!usados.has(id) && LIVROS[n].includes(f.esp)) out.push(linha(id, f));
  }
  out.push('## COMPARTILHADOS (so estes, de qualquer dos dois livros)');
  for (const esp of COMPART) {
    const lista = Object.entries(fatos).filter(([id, f]) => !usados.has(id) && f.esp === esp);
    lista.forEach(([id, f], i) => { if (i % AGENTES.length === k) out.push(linha(id, f)); });
  }
  writeFileSync(`${import.meta.dirname}/pool-${par.join('-')}.txt`, out.join('\n') + '\n');
  cont[par.join('-')] = out.length;
});
console.log(cont);
