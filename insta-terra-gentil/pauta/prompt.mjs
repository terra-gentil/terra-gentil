// Prompt do roteiro: a voz do André, as regras de fato e o pedido do dia. Texto puro, sem rede.
import { LIMITES_TEXTO } from '../carrossel/estrutura.mjs';

const TOXICIDADE = /t[óo]xic|venen|\bpets?\b|\bc[ãa]es\b|\bc[ãa]o\b|\bgatos?\b/i;
const FONTE_DE_TOXICIDADE = /ASPCA|Sinitox/i;

// Fato só entra com fonte. Toxicidade e pet só com ASPCA ou Sinitox (regra do AGENTS.md).
export function validarFatos(fatos) {
  if (!Array.isArray(fatos) || fatos.length < 3) {
    throw new Error('[ideia] a pauta precisa de pelo menos 3 fatos com fonte');
  }
  fatos.forEach((fato, i) => {
    if (!fato?.texto?.trim() || !fato?.fonte?.trim()) {
      throw new Error(`[ideia] fato ${i} sem texto ou sem fonte`);
    }
    if (TOXICIDADE.test(fato.texto) && !FONTE_DE_TOXICIDADE.test(fato.fonte)) {
      throw new Error(`[ideia] fato ${i} fala de toxicidade ou pet sem fonte ASPCA/Sinitox`);
    }
  });
  return fatos;
}

const limites = Object.entries(LIMITES_TEXTO)
  .map(([campo, max]) => `${campo} até ${max}`)
  .join(', ');

export const SISTEMA = `Você escreve os carrosséis do Instagram @canalterragentil, o canal do \
André, de jardinagem e histórias humanas. Gentileza gera gentileza.

Voz: acolhedora, sem culpa e sem bronca, para quem tem de 40 a 70 anos e já matou planta e \
sofreu com isso. Frases curtas e concretas, como quem conversa na varanda. Português do Brasil \
com acentuação correta. Nunca use travessão (nem em dash nem en dash): troque por vírgula ou \
ponto. Sem emoji. Sem jargão. Chame a planta pelo nome popular.

Regras de conteúdo, inegociáveis:
- Use SOMENTE os fatos numerados do pedido. Não acrescente dose, prazo, produto, número, causa \
ou conselho que não esteja neles. Se os fatos não sustentam um slide, escreva o slide mais curto \
em vez de inventar.
- Escreva com as suas palavras. Não copie frases dos fatos.
- Não fale de toxicidade nem de pets, a menos que um fato traga isso.
- Informe em "fatosUsados" os números dos fatos em que o roteiro se apoia.

Os 8 slides, nesta ordem: 1 capa com um gancho que faz parar a rolagem; 2, 3 e 4 problemas \
(nomeie o erro e acolha); 5 e 6 passos práticos (o que fazer, em ordem); 7 problema final \
(um mito ou um sinal para ficar de olho); 8 fechamento (só o campo texto, a marca completa a frase).

A tarja da capa segue o formato "Jardinagem ✺ Tema", com o tema em uma palavra (Rega, Luz, Poda).

Tamanho máximo de cada campo, em caracteres: ${limites}. Linha de título é curta: cabe em \
duas ou três palavras. "destaque" é a palavra de impacto, escrita em itálico grande.`;

export function pedidoDe(pauta, fatos, ebook) {
  const nome = pauta.nome ?? pauta.especie;
  const linhas = [
    `Série: ${pauta.serie ?? 'Cuidados'}`,
    `Planta: ${nome} (${pauta.especie})`,
    `Tema do dia: ${pauta.gancho ?? 'cuidados básicos'}`,
  ];
  if (ebook) linhas.push(`Ebook que o post oferece: "${ebook.titulo}", palavra ${ebook.palavra}`);
  linhas.push('', 'Fatos (use só estes):');
  fatos.forEach((fato, i) =>
    linhas.push(`[${i}] ${fato.texto.trim()} (fonte: ${fato.fonte.trim()})`),
  );
  linhas.push('', 'Escreva o roteiro dos 8 slides, o gancho e o resumo da legenda.');
  return linhas.join('\n');
}
