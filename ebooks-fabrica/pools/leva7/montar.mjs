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
  '071': ['hibisco', 'buganvília', 'manacá', 'ixora', 'alamanda', 'lantana', 'camarão', 'camarão-amarelo', 'mandevila', 'jasmim-manga', 'escova-de-garrafa', 'abutilon', 'brinco-de-princesa'],
  '072': ['capuchinha', 'borragem', 'amor-perfeito', 'calêndula', 'malva-rosa', 'centáurea', 'tagetes'],
  '073': ['avenca', 'fitônia', 'chifre-de-veado', 'maranta', 'calathea', 'tilândsia', 'samambaia', 'peperômia', 'pilea', 'epíscia', 'epísica'],
  '074': ['espada-de-são-jorge', 'espada', 'zamioculca', 'iúca', 'palma', 'dracena', 'cordiline'],
  '075': ['compostagem'],
  '076': ['maracujá', 'uva', 'pitaia', 'amora', 'abacaxi', 'bananeira', 'abacate', 'mamão'],
  '077': ['cacto', 'cacto-estrela', 'mamilária', 'mandacaru', 'cacto-amendoim', 'equinopsis', 'parodia', 'ripsális'],
  '078': ['suculenta', 'echeveria', 'haworthia', 'gastéria', 'aeônio', 'sedum', 'jade', 'colar-de-pérolas', 'pedra-viva', 'colar-de-corações'],
  '079': ['pimenta'],
  '080': ['orquídea'],
  '081': ['roseira'],
  '082': ['alocasia', 'filodendro', 'aglaonema', 'caládio', 'taioba', 'singônio', 'antúrio', 'cheflera', 'afelandra'],
  '083': ['lírio', 'hemerocale', 'alstroeméria', 'agapanto', 'clívia', 'copo-de-leite', 'crino', 'lírio-do-amazonas', 'gladíolo', 'frésia', 'lírio-da-chuva', 'lírio-do-vento', 'amarílis', 'dália'],
  '084': ['ipê', 'quaresmeira', 'pata-de-vaca', 'cássia', 'magnólia', 'jacarandá', 'murta', 'ipê-de-jardim', 'grevílea', 'araucária', 'espirradeira', 'resedá'],
  '085': ['borboleta', 'mariposa', 'sálvia', 'budleia', 'verbena', 'joaninha', 'inseto', 'vespa', 'pentas', 'plectranto'],
  '086': ['kalanchoe', 'flor-de-maio', 'coroa-de-cristo', 'crisântemo', 'camélia', 'azaleia', 'cravo', 'gérbera', 'bico-de-papagaio', 'prímula', 'ciclame'],
};
const COMPART = ['outra', 'horta', 'mato', 'muda', 'praga', 'solo', 'regar', 'jardim-vivo', 'passarinho', 'abelha', 'trocar-vaso', 'arvore'];
const AGENTES = [['071', '072'], ['073', '074'], ['075', '076'], ['077', '078'], ['079', '080'], ['081', '082'], ['083', '084'], ['085', '086']];
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
