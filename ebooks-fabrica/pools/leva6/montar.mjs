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
  '055': ['figo', 'limoeiro', 'mirtilo', 'romã', 'uva', 'amora', 'nêspera', 'oliveira', 'maracujá', 'pêssego', 'abacate', 'mamão', 'ameixa', 'pitaia', 'abacaxi', 'bananeira'],
  '056': ['grama', 'gramado', 'trapoeraba'],
  '057': ['adubar'],
  '058': ['podar', 'alporquia'],
  '059': ['fungo'],
  '060': ['lesma', 'sapo', 'joaninha', 'vespa', 'inseto', 'mariposa', 'borboleta', 'libélula', 'morcego'],
  '061': ['lavanda', 'alecrim', 'tomilho', 'orégano', 'sálvia', 'louro'],
  '062': ['girassol', 'cosmos', 'zínia', 'tagetes', 'calêndula', 'amaranto', 'celósia', 'boca-de-leão', 'ervilha-de-cheiro'],
  '063': ['abobrinha', 'abóbora', 'pepino', 'melancia', 'quiabo', 'berinjela'],
  '064': ['feijão', 'milho', 'ervilha', 'amendoim'],
  '065': ['cenoura', 'rabanete', 'beterraba', 'batata', 'batata-doce', 'inhame', 'cebola', 'alho'],
  '066': ['comigo-ninguém-pode', 'aglaonema', 'dracena', 'cordiline', 'taioba', 'alocasia'],
  '067': ['hortelã', 'manjericão', 'salsinha', 'cebolinha', 'coentro', 'erva-cidreira', 'camomila', 'erva-doce'],
  '068': ['alface', 'rúcula', 'acelga', 'espinafre', 'chicória', 'aipo', 'capuchinha', 'borragem'],
  '069': ['begônia', 'gerânio', 'crisântemo', 'gloxínia', 'ciclame', 'prímula', 'amor-perfeito', 'petúnia', 'beijinho'],
  '070': ['fícus', 'ficus', 'hera', 'clorofito', 'aspidistra', 'pilea', 'tradescântia', 'peperômia', 'cissus'],
};
const COMPART = ['outra', 'horta', 'mato', 'muda', 'praga', 'solo', 'regar', 'compostagem', 'jardim-vivo', 'passarinho', 'abelha', 'trocar-vaso', 'arvore'];
const AGENTES = [['055', '056'], ['057', '058'], ['059', '060'], ['061', '062'], ['063', '064'], ['065', '066'], ['067', '068'], ['069', '070']];
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
