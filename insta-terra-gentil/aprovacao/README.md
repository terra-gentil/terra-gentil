# aprovacao: prévia e ok no Telegram

**Fase 1.** Domingo de manhã manda as prévias da semana; o André responde "ok" ou troca um dia
("troca terça"). Post sem aprovação não sai. O reel do André tem aprovação própria.

Previstos: `previa.mjs` (monta a mensagem), `telegram.mjs` (envio), `respostas.mjs` (lê o ok).
Desligado sem `TELEGRAM_TOKEN` e `TELEGRAM_CHAT_ID`.
