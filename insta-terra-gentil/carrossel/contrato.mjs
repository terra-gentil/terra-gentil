// Contrato dos moldes: os campos que todo molde precisa ter e os que podem existir a mais.

export const TIPOS = Object.freeze(['capa', 'problema', 'passo', 'final']);

const FOTO = ['foto', 'escurecimento', 'zoom', 'foco', 'simularFotoClara'];
const MASCOTE = ['mostrarMascote', 'mascote'];
const MANCHETE = ['tarja', 'linha1', 'linha2', 'destaque', 'contador'];

// Obrigatórios: sem eles o código do dia não consegue preencher o slide.
export const OBRIGATORIOS = Object.freeze({
  capa: [...FOTO, ...MANCHETE, 'linha3', 'legendaFoto'],
  problema: [...FOTO, ...MANCHETE, ...MASCOTE, 'texto', 'nota', 'legendaFoto'],
  passo: [...FOTO, ...MANCHETE, ...MASCOTE, 'fotoAndre', 'texto', 'dica'],
  final: [
    ...FOTO, ...MANCHETE, ...MASCOTE, 'texto', 'ctaSalvar', 'ctaSeguir', 'ctaSite', 'voltar',
  ],
});

// Opcionais: o desenho de alguns moldes usa, o de outros não. O código manda e o molde ignora.
export const OPCIONAIS = Object.freeze({
  capa: [],
  problema: [],
  passo: ['numero', 'nota', 'legendaFoto'],
  final: ['capaEbook'],
});

// Problemas de um molde frente ao contrato (lista vazia = molde dentro do padrão).
export function problemasDoContrato(tipo, campos) {
  const aceitos = new Set([...OBRIGATORIOS[tipo], ...OPCIONAIS[tipo]]);
  const faltando = OBRIGATORIOS[tipo].filter((c) => !campos.includes(c));
  const sobrando = campos.filter((c) => !aceitos.has(c));
  return [
    ...faltando.map((c) => `falta o campo "${c}"`),
    ...sobrando.map((c) => `campo "${c}" fora do contrato`),
  ];
}
