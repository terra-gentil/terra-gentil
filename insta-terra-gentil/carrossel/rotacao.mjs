// Rotação diária dos moldes do carrossel: um molde por dia, em ciclo, nunca o mesmo de ontem.

// Os 3 moldes aprovados no Claude Design. Os nomes batem com os arquivos de moldes/.
export const MOLDES = Object.freeze(['creme', 'noite', 'canteiro']);

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
  return moldes[diasDesdeEpoca(dia) % moldes.length];
}
