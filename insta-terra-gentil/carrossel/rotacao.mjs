// Rotação diária dos moldes do carrossel: um molde por dia, em ciclo, nunca o mesmo de ontem.

// Com 7 moldes o ciclo é a semana: o primeiro sai na segunda, o último no domingo. Para ganhar
// um molde novo basta acrescentar o nome aqui (e o arquivo em moldes/); com outro total o ciclo
// continua sem repetir o dia anterior, só deixa de coincidir com a semana.
export const MOLDES = Object.freeze([
  'manchete', // A, segunda
  'faixas', // B, terça
  'album', // C, quarta
  'duotom', // D, quinta
  'jornal', // E, sexta
  'galeria', // F, sábado
  'lambe', // G, domingo
]);

// 1970-01-01 foi quinta: somando 3, o dia 0 do ciclo cai numa segunda-feira.
const AJUSTE_SEGUNDA = 3;

// "2026-10-26" no fuso de Brasília: a virada do dia é a do André, não a do servidor.
export function diaBrasilia(data = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(data);
}

// Dias inteiros desde 1970-01-01 para um dia "AAAA-MM-DD".
export function diasDesdeEpoca(dia) {
  const [ano, mes, dd] = dia.split('-').map(Number);
  return Math.floor(Date.UTC(ano, mes - 1, dd) / 86_400_000);
}

export function moldeDoDia(dia = diaBrasilia(), moldes = MOLDES) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dia)) throw new Error(`[rotacao] dia inválido: ${dia}`);
  if (moldes.length === 0) throw new Error('[rotacao] lista de moldes vazia');
  return moldes[(diasDesdeEpoca(dia) + AJUSTE_SEGUNDA) % moldes.length];
}
