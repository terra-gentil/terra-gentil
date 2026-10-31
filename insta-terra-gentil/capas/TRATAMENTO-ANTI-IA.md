# Tratamento para a capa não parecer feita por IA (aprendido no repositório do YouTube, 29/10/2026)

Fonte: `youtube-terragentil/inteligencia-thumbnail/` (04-rosto-ia-integrado.md, 03-super-prompt-nano-banana.md,
`integrar_rosto.py`); o `youtube-white-label` tem a mesma pasta com os exemplos generalizados. Lá o alvo é
a miniatura do YouTube; aqui é a capa do carrossel. Ainda NÃO aplicado: fica para depois de fechar todas as capas.

## O que denuncia IA (achado do Gemini e do Coach do vidIQ numa capa de teste)
| Sinal | Correção usada lá (integrar_rosto.py) |
|---|---|
| Luz difusa de estúdio, sem lado de sombra, numa cena de sol duro | luz direcional: lado do sol +14%, lado oposto -22%, transição curta |
| Pele e roupa lisas demais, "pintura digital" nos olhos e na pele | contraste +14% e nitidez (unsharp raio 2, 70%, limiar 2) |
| Tom frio ou neutro de estúdio | tom quente de foto: vermelho +4%, azul -6% (parâmetro `--quente`) |
| Imagem limpa demais perto de foto de celular | granulado de celular (ruído gaussiano, desvio 5,5, semente fixa) |
| Borda dura do recorte ("montagem") | suavizar a borda (encolhe 1 px e desfoca 1,5) |

## Regras que custaram teste
- Conferir de que lado vem o sol NA FOTO antes de escolher o lado da luz (o crítico apontou o lado errado).
- NUNCA clarear o rosto por igual: apaga o lado de sombra e a luz de estúdio volta.
- Pele quente (`--quente 1.9`) em cena de sol; borda mais macia no cabelo.
- Pedir a luz da cena JÁ no prompt (mandar a própria cena como referência de luz), em vez de corrigir depois.
- Nunca corrigir em cima de imagem que já saiu da IA: se falhar, refazer do zero.
- Crítico CEGO: conversa nova no Gemini com a imagem e o pedido normal de crítica, SEM dizer que é IA
  (dizendo, ele sempre acha). Só segue se ele não achar sinal de IA. Resultado do teste: 8,5 com "não parece
  gerada por IA" só depois de luz da direção certa, grão e borda suave.
- Conferir se a plataforma pede a declaração de conteúdo alterado ou sintético.

## Primeiro teste (30/10/2026)
- `capas/tratar_capa.py` feito (contraste, nitidez, tom quente, grão com semente pelo nome do arquivo)
  e `capas/tratar_capa_test.py` (6 testes, `python -I capas/tratar_capa_test.py`). Banco NÃO tratado.
- Crítico cego no Gemini (conversa nova, pedido normal de crítica): orquídea F original 7/10, tratada
  7/10; coringa-pet H tratada 8/10. Nenhuma das três foi apontada como IA; as críticas foram de foto
  (flor desfocada, boné cortado no topo, pose rígida). O tratamento não mudou a nota.
- O que realmente denuncia: o jpg cru do Flow traz selo C2PA ("trainedAlgorithmicMedia", SynthID
  declarado), que o Instagram lê para pôr "Informações de IA". O `importar-cli` regrava sem metadado;
  `capas/metadados.test.mjs` garante que nenhuma capa do banco tem o selo. A marca d'água SynthID fica
  nos pixels e nenhum tratamento simples a remove.
- APLICADO no banco inteiro (445 capas) a pedido do André. Originais fora do repositório em
  `Documents\Terra Gentil\banco-original-2026-10-30` (e no histórico do git, commit c0bef93).
- Efeito colateral: o grão fez o detector achar rosto falso grande (confiança 0,6 a 0,73). O
  `verificar_rosto.py` passou a escolher o rosto de maior confiança, não o maior. Mesmo assim, 6 capas
  de lado (G/H) caíram abaixo de 0,363 (antes 0,37 a 0,49): reaprovadas com exceção de rosto e motivo.
- Capa nova: o `importar-cli` já trata sozinho (desde 30/10); depois verificar rosto e aprovar.

## Como isto vira trabalho aqui (proposta, depois que as capas fecharem)
1. `capas/tratar_capa.py` (mesmo molde do integrar_rosto.py, função pura + CLI): aplica na imagem inteira
   contraste +14%, nitidez, tom quente, grão de celular com semente fixa. Sem luz direcional por lado, porque
   a capa é cena inteira (a luz vem do prompt); sem borda, porque não há recorte.
2. Rodar sobre o banco em lote, guardando o original (`capas/banco-original/`) para poder desfazer.
3. Teste: a função é determinística (mesma entrada, mesma saída), não muda o tamanho 1080x1350 e deixa o
   hash do arquivo diferente (o `rosto.json` e a revisão são por hash: reconferir rosto e reaprovar).
4. Crítico cego em uma amostra de 10 capas (antes e depois) para medir se melhorou, antes de tratar as 280.
5. Ajustar o prompt do Flow: pedir luz natural direcional e acabamento de foto de celular, sem
   "estúdio", "perfeito", "plástico" (o EVITAR já cobre "plastic skin" e "oversaturated colors").
