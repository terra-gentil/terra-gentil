// Filtros dos livros da Leva 12 (TG 143 a 156). Ordem importa: o primeiro filtro que pega o fato fica com ele.
// Cada filtro recebe (id, f) com f = {texto, esp, serie, livro}.
const ROSA_A = new Set('001 005 011 012 013 014 015 016 021 024 026 029 032 033 034 035 037 038 039 040 042 045 046 049 050 052 059 070 071 072 074 076 077 080 081 089 090 091 095 096 098 298 303 345 347'.split(' ').map((n) => `r20-${n}`));
const FOLHA = /beldroega|bertalha|ançarinha|agretti|espinafre|brócolis|pak choi|mostarda|mizuna|mibuna|diabelha|cerefólio|urtiga|mitsuba|azedinha|oxalis|labaça|aliária|mastruço|rúcula|folha de corte|erva-luísa|planta-cogumelo|rungia|shissô|perila|salsinha|escarola|acelga|alface|wasabi|trevo-roxo|trevo-azedo|capim-limão|citronela|estévia|nabo|couve|choy|kai-lan|erva-doce|manjeric|hortelã|manjerona|estragão|tanchagem|cardo|folha/i;
const FRUTA = /framboesa|amora|groselha|mirtilo|murta|goji|aronia|figo|figueira|goiaba-serrana|physalis|tomatillo|yacon|oca|mashua|salsifi|alcachofra|gengibre|cúrcuma|romã|palma|opuntia|loureiro|sichuan|brinco|morango|frutinha|fruta azedinha/i;
const g32 = (id) => /^g32-(0[6-9]\d|[1-4]\d\d)$/.test(id) && !/^g32-(38[5-9]|39\d|4[5-9]\d)$/.test(id);
const m33semente = (f) => /semente|germin|sement|cápsula|fruto/i.test(f.texto);
const SUC = /^(suculenta|cacto|babosa|agave|kalanchoe|sedum|echeveria|gastéria|pedra-viva|aeônio|jade|flor-de-maio|flor-de-baile|colar-de-pérolas|cacto-estrela|cacto-amendoim|equinopsis|parodia|palma|mamilária|coroa-de-cristo|ripsális|epíscia|mandacaru|rosa-do-deserto)$/;
export default [
  ['143', 'Rosa Contada', (id) => ROSA_A.has(id)],
  ['144', 'Roseira Bem Tratada', (id) => /^r20-/.test(id)],
  ['145', 'Verduras Esquecidas', (id, f) => /^g32-/.test(id) && g32(id) && FOLHA.test(f.texto) && !/framboesa|amora|groselha|mirtilo|alho-poró|alcachofra|yacon|oca\b|mashua/i.test(f.texto)],
  ['146', 'Frutinhas e Raízes', (id, f) => /^g32-/.test(id) && g32(id) && FRUTA.test(f.texto)],
  ['147', 'Horta Quadradinha', (id) => /^h35-/.test(id)],
  ['148', 'Suculenta Simples', (id, f) => /^b[1-7]-/.test(id) && f.livro.startsWith('Baldwin')],
  ['149', 'Orquídea por Dentro', (id, f) => f.livro.startsWith('Cullina') || (f.esp === 'orquídea')],
  ['150', 'Semente Rara', (id, f) => /^m33-/.test(id) && m33semente(f)],
  ['151', 'Filhote e Divisão', (id) => /^m33-/.test(id)],
  ['152', 'Aráceas Raras', (id) => /^w18-/.test(id)],
  ['153', 'Jardim Resistente', (id) => /^q34-/.test(id)],
  ['154', 'Jardim de Gambiarra', (id) => /^w31-/.test(id)],
  ['155', 'Folhagem de Casa', (id, f) => /^q3-/.test(id) && /^(cheflera|aspargo|fícus|hera|filodendro|pilea|espada-de-são-jorge|iúca|cordiline|cissus|aglaonema|afelandra|samambaia|chifre-de-veado|palmeira|bromélia|abacaxi|jiboia|zamioculca|dracena|singônio|ficus|polyscias|radermachera|aspidistra|calathea|fittonia|dizygotheca|tradescântia|coleus|avenca)$/.test(f.esp)],
  ['156', 'Vaso com Flor', (id, f) => /^q3-/.test(id) && /^(violeta|azaleia|ciclame|kalanchoe|jacinto|tulipa|prímula|camarão-amarelo|camarão|estreptocarpo|gloxínia|gerânio|rabo-de-gato|planta-batom|tumbérgia|frésia|cinerária|nertera|justícia|coroa-de-cristo|flor-de-baile|flor-de-maio|begônia|petúnia|cravo|crisântemo|gérbera|amarílis|lírio|narciso|alstroeméria|brinco-de-princesa|hibisco|primula|gloriosa|jasmim-de-madagascar|trombeteira|manacá)$/.test(f.esp)],
];
