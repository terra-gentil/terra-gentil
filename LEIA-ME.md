# Terra Gentil — Instruções

## Instalação

1. Extrair este zip na raiz do projeto (`terra-gentil/`)
2. No PowerShell, rodar: `npm install @google/generative-ai`
3. Verificar se o arquivo `.env.local` foi criado com a chave do Gemini
4. Reiniciar o `npm run dev` (Ctrl+C e rodar de novo)
5. Abrir http://localhost:3000

## O que foi feito

- Home completa (Hero, Sobre, Doutor das Plantas, Transformações, Vídeos)
- Páginas: /sobre, /blog, /blog/[slug], /transformacoes, /videos, /equipamentos
- Botão WhatsApp flutuante
- Doutor das Plantas funcionando com API backend (chave protegida)
- Slider de antes/depois interativo
- SEO configurado em todas as páginas

## Importante

O arquivo `.env.local` contém sua chave do Gemini. NUNCA faça commit desse arquivo no Git.
Ele já está no `.gitignore` por padrão do Next.js.
