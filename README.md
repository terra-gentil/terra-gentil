# 🌿 Terra Gentil — Site Next.js

Site institucional do projeto **Terra Gentil** (canal YouTube + jardinagem), reconstruído do zero em Next.js moderno pra substituir o WordPress antigo do Hostinger.

---

## 📋 Sobre o projeto

- **Site antigo:** https://terragentil.com.br (WordPress no Hostinger)
- **Canal YouTube:** https://www.youtube.com/@TerraGentil
- **Email:** canalterragentil@gmail.com
- **WhatsApp:** +55 11 92093-8591
- **Instagram:** @canalterragentil
- **TikTok:** @terragentil

**Objetivo:** Migrar do WordPress (pesado, lento, inseguro) pra Next.js (rápido, moderno, fácil de manter).

**Status atual:** ✅ Site rodando 100% localmente em `http://localhost:3000` com todas as funcionalidades principais.

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router + Turbopack) | 16.2.4 |
| Linguagem | TypeScript | 5.x |
| Estilização | Tailwind CSS | 4.x (com `@theme`) |
| Ícones | lucide-react | 0.x |
| IA | Google Gemini (Flash) | 2.5 |
| Deploy | Vercel (planejado) | - |
| Node | Node.js | 24.14.1+ |

---

## 📁 Estrutura do Projeto

```
terra-gentil/
├── app/                          # Rotas (App Router)
│   ├── layout.tsx                # Layout raiz (Header + Footer + WhatsApp btn)
│   ├── page.tsx                  # Home (Hero + About + PlantDoctor + Transf + Videos)
│   ├── globals.css               # Tailwind + variáveis Terra Gentil
│   ├── sobre/page.tsx
│   ├── blog/
│   │   ├── page.tsx              # Listagem de posts
│   │   └── [slug]/page.tsx       # Post individual
│   ├── transformacoes/page.tsx
│   ├── videos/page.tsx           # Todos os vídeos da playlist (RSS)
│   ├── equipamentos/page.tsx
│   └── api/diagnose/route.ts     # API do Doutor das Plantas (Gemini)
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Nav sticky com logo
│   │   ├── Footer.tsx            # 3 colunas + redes sociais
│   │   └── WhatsAppButton.tsx    # Botão flutuante fixed bottom-right
│   └── sections/
│       ├── Hero.tsx              # Seção principal da home
│       ├── About.tsx             # "Conheça a Terra Gentil"
│       ├── Transformations.tsx   # Slider antes/depois (client component)
│       ├── Videos.tsx            # 3 últimos vídeos (server component async)
│       └── PlantDoctor.tsx       # Doutor das Plantas (IA) - client component
├── data/
│   ├── posts.ts                  # 3 posts migrados do WordPress
│   ├── transformations.ts        # Antes/depois das transformações
│   └── ebooks.ts                 # 12 ebooks + keywords pra match com plantas
├── lib/
│   └── youtube.ts                # Fetcher RSS da playlist (revalidate 1h)
├── public/
│   └── images/                   # Imagens reais baixadas do Hostinger antigo
│       ├── logo.png
│       ├── doutor-avatar.jpeg
│       ├── transformacao-1-antes.jpeg
│       ├── transformacao-1-depois.jpeg
│       ├── transformacao-2-antes.jpeg
│       └── transformacao-2-depois.jpeg
├── .env.local                    # ⚠️ NÃO COMMITAR (tem a chave do Gemini)
├── package.json
└── README.md
```

---

## 🚀 Como rodar

```powershell
# Instalar dependências (só na primeira vez ou após `git pull`)
npm install

# Rodar em desenvolvimento
npm run dev
```

Abrir http://localhost:3000

---

## 🔑 Variáveis de Ambiente

Criar arquivo `.env.local` na raiz:

```
GEMINI_API_KEY=SUA_CHAVE_AQUI_VER_ENV_LOCAL
```

⚠️ **Importante:** Esse arquivo já está no `.gitignore` do Next.js por padrão. NUNCA commitar.

Onde gerar nova chave: https://aistudio.google.com/apikey

---

## ✅ O que já está funcionando

### Páginas
- [x] `/` Home completa (5 seções)
- [x] `/sobre` Página sobre (institucional)
- [x] `/blog` Listagem de 3 posts migrados do WordPress
- [x] `/blog/[slug]` Post individual
- [x] `/transformacoes` Slider antes/depois das transformações
- [x] `/videos` Todos os vídeos da playlist do YouTube (dinâmico)
- [x] `/equipamentos` Categorias de equipamentos

### Funcionalidades
- [x] **Doutor das Plantas** — Upload de foto → Gemini analisa → retorna JSON estruturado (toxicidade, luz, rega, tratamento) + sugere ebook relacionado
- [x] **YouTube dinâmico** — Busca RSS da playlist `PLo0P-qaOD_PSJ24_1Z5d9JbwVs2Y3oDS8` a cada 1h (revalidate). Novo vídeo publicado → aparece sozinho no site
- [x] **WhatsApp flutuante** — Botão fixed bottom-right, abre conversa pré-preenchida
- [x] **Slider antes/depois** — Drag horizontal pra revelar transformação
- [x] **SEO** — Meta tags, Open Graph em todas as páginas
- [x] **Responsivo** — Mobile-first, testado
- [x] **Dark mode** na CSS (não aplicado visualmente ainda)

### Conteúdo Migrado do WordPress
- [x] 3 posts do blog (textos completos)
- [x] Textos da Home (Hero + "Conheça a Terra Gentil")
- [x] Textos da página Sobre
- [x] Logo real
- [x] Avatar do Doutor Gentileza
- [x] 4 fotos de antes/depois (2 transformações)
- [x] Paleta de cores da marca (#1b4332 #2d6a4f #52b788 #d8f3dc)
- [x] 12 ebooks mapeados com keywords

---

## 🎯 Próximos Passos (por prioridade)

### 🔥 Prioridade Alta

1. **Testar Doutor das Plantas com foto real**
   - Subir foto de planta no localhost e validar retorno do Gemini
   - Ajustar prompt se necessário (em `app/api/diagnose/route.ts`)

2. **Deploy na Vercel**
   ```powershell
   # Criar repo no GitHub primeiro
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/SEU_USUARIO/terra-gentil.git
   git push -u origin main

   # Depois ir em vercel.com > New Project > Import do GitHub
   # Adicionar variável GEMINI_API_KEY nas settings do projeto
   ```

3. **Migração DNS** (trocar WordPress velho pelo novo)
   - Apontar DNS do terragentil.com.br pra Vercel
   - Criar redirects 301 das URLs antigas (veja lista em `MIGRATION.md` — a criar)

### 📝 Prioridade Média

4. **Mais conteúdo no blog** — escrever 4-6 posts novos
5. **Mais fotos de transformações** — baixar do Hostinger e adicionar em `data/transformations.ts`
6. **Google Analytics 4** — adicionar tag no layout.tsx
7. **Google Search Console** — submeter sitemap

### 🎨 Prioridade Baixa (polish)

8. Página de Equipamentos com equipamentos reais (marcas, modelos, links afiliado)
9. Seção de depoimentos na home
10. Formulário de contato (via Resend API ou EmailJS)
11. PWA (manifest.json + service worker)
12. Testes automatizados com Robot Framework (já gerados em sessão anterior)

---

## 💾 Backups importantes

- **WordPress XML:** `terragentiljardinagemcomgentileza_WordPress_2026-04-16.xml`
  (guardar em local seguro, contém todo conteúdo do site antigo)
- **Imagens do Hostinger:** `uploads.zip` (341 MB — guardar em HD externo ou Drive)

---

## 🐛 Troubleshooting comum

### "node não é reconhecido"
Instalar Node.js em https://nodejs.org (LTS). Reabrir PowerShell depois.

### "não pode ser carregado porque a execução de scripts foi desabilitada"
```powershell
# Rodar PowerShell como Admin e executar:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### "Event handlers cannot be passed to Client Component props"
Um componente server component (async) tem um `onClick`, `onError`, etc. Solução: remover o handler ou adicionar `'use client';` no topo do arquivo.

### "Export X doesn't exist in target module" (lucide-react)
Ícones de marca (Facebook, Instagram, Youtube) foram removidos do lucide por questões de trademark. Usar SVG inline.

### Imagens não carregam
As imagens estão em `public/images/`. Se não existirem, rodar o script `extrair-imagens-v2.ps1` apontando pro `uploads.zip` do Hostinger.

---

## 🔒 Notas de Segurança

1. **Chave Gemini antiga foi rotacionada** — as chaves `VoSE` e `l3jM` que estavam expostas no WordPress antigo foram revogadas. Usar sempre a chave atual via `.env.local`.
2. **Nunca expor chaves no frontend** — toda chamada à API do Gemini passa pela API Route `/api/diagnose` (backend).
3. **CORS do Hostinger** bloqueou downloads via PowerShell — por isso foi necessário baixar o `uploads.zip` pelo File Manager manualmente.

---

## 📞 Contatos do projeto

- Email: canalterragentil@gmail.com
- WhatsApp: +55 11 92093-8591
- YouTube: @TerraGentil
- Instagram: @canalterragentil

---

**Última atualização:** Abril 2026
