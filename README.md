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
| IA (Doutor) | Backend Terra Gentil (FastAPI Railway, mesmo do app) | - |
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
│   └── api/diagnose/route.ts     # Proxy fino pro backend Terra Gentil (mesmo motor do app)
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

Não há variáveis obrigatórias para rodar localmente. O endpoint `/api/diagnose`
faz proxy para o backend público em
`https://terra-gentil-app-production.up.railway.app` por padrão.

Variáveis opcionais em `.env.local`:

```
# Sobrescreve o backend (ex: rodar contra um localhost ou staging)
DIAGNOSE_API_URL=http://localhost:8001

# Newsletter via Resend (so se quiser testar /api/newsletter)
RESEND_API_KEY=re_xxx
```

⚠️ **Importante:** `.env.local` está no `.gitignore` do Next.js por padrão. NUNCA commitar.

> Versões antigas deste site usavam `GEMINI_API_KEY` direto. Não é mais
> necessária — o motor de IA mora no backend `terra-gentil-app/backend` (mesmo
> usado pelo app mobile). Se sobrar uma `.env.local` antiga, pode apagar.

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
- [x] **Doutor das Plantas** — Upload de foto → backend Terra Gentil (FastAPI no Railway) analisa via IA → retorna JSON estruturado (toxicidade, luz, rega, tratamento) + sugere ebook relacionado. Em `/doutor` mostra o diagnóstico completo (confiança, problemas detectados, qualidade da foto, plano longo). Mesmo motor do app mobile
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

## 🚀 Deploy em Produção (Vercel + DNS)

### 1. Importar projeto na Vercel

1. Logar em https://vercel.com com a conta GitHub que tem acesso ao repo `terra-gentil/terra-gentil`.
2. Add New → Project → Import o repo.
3. Em **Framework Preset**, deve detectar `Next.js` automaticamente. Confirmar.
4. **Root Directory**: deixar em branco (raiz).
5. Build Command e Output Directory: defaults do Next (não tocar).
6. Antes de clicar Deploy, em **Environment Variables**, adicionar:

| Nome | Onde pegar | Obrigatória? |
|------|-----------|:-:|
| `DIAGNOSE_API_URL` | URL do backend Terra Gentil (default: `https://terra-gentil-app-production.up.railway.app`) | opcional (sem ela usa o prod) |
| `NEXT_PUBLIC_GA_ID` | Analytics → Admin → Streams → ID de medição (formato `G-XXXXXXXXXX`) | opcional (sem ela, GA não carrega) |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Search Console → Add property → HTML tag → só o `content=` | opcional (verificação do Search Console) |
| `NEXT_PUBLIC_GAME_ENABLED` | Setar `true` quando o jogo (G10) estiver pronto | opcional (default: rota /jogo mostra "em breve") |

7. Clicar **Deploy**. Primeiro deploy demora ~2 min.

### 2. Conectar domínio terragentil.com.br

1. Na Vercel, abrir o projeto → **Settings** → **Domains**.
2. Adicionar `terragentil.com.br` e `www.terragentil.com.br`.
3. A Vercel vai mostrar registros DNS para configurar (`A` ou `CNAME`).
4. No painel do registrador (Hostinger, Registro.br, etc), apontar:
   - `terragentil.com.br` → registro `A` para `76.76.21.21` (Vercel)
   - `www.terragentil.com.br` → `CNAME` para `cname.vercel-dns.com`
5. Aguardar propagação DNS (5min a 24h, normalmente em 30min).
6. HTTPS é provisionado automaticamente pela Vercel via Let's Encrypt.

### 3. Validar pós-deploy

Em ordem de criticidade:

- [ ] Home carrega em https://terragentil.com.br com HTTPS válido
- [ ] `/sobre`, `/blog`, `/transformacoes`, `/videos`, `/equipamentos` abrem
- [ ] `/sitemap.xml` lista todas as rotas
- [ ] `/robots.txt` permite tudo, bloqueia `/api/`
- [ ] Doutor das Plantas com foto real retorna diagnóstico em <15s
- [ ] WhatsApp button leva pra `+55 11 92093-8591`
- [ ] Vídeos da home carregam thumbnail e tocam ao clicar (lite-embed)
- [ ] Redirects 301 funcionam (testar `https://terragentil.com.br/?p=123`, `/wp-admin/`, `/feed/`)
- [ ] 404 customizada aparece em URL inexistente (`/jardim-lindo-pdf-nao-existe`)
- [ ] Headers de segurança via https://securityheaders.com (alvo: A ou A+)
- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] No GA4 (Realtime), confirmar evento de pageview ao abrir o site
- [ ] No Search Console, submeter `https://terragentil.com.br/sitemap.xml`

### 4. Cortar o WordPress velho (Hostinger)

Só fazer DEPOIS de validar tudo acima:

1. Backup final do WordPress antigo (XML + uploads.zip já salvos).
2. No Hostinger, desativar o site atual (modo manutenção ou apontar DNS pra Vercel já cuidou disso).
3. Cancelar plano Hostinger se aplicável.
4. Confirmar que o domínio está apontando 100% pra Vercel.

### CI/CD

Push pra `main` dispara deploy automático na Vercel. Cada PR ganha preview URL. O workflow `.github/workflows/ci.yml` roda lint + type-check + test + build em todo push e PR — falha bloqueia o merge se você habilitar branch protection em `main`.

---

## 🎯 Próximos passos (pós-deploy)

### 📝 Prioridade média
1. **Testar Doutor das Plantas em prod** com 5-10 fotos diferentes pra calibrar prompt
2. **Mais posts** no blog (4-6 escritos), atualizar `data/posts.ts`
3. **Mais transformações** com fotos baixadas do `uploads.zip`
4. **Branch protection** em `main` requerendo CI passar

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

1. **Chaves Gemini antigas revogadas** — as chaves `VoSE` e `l3jM` que ficaram expostas no WordPress antigo foram revogadas. O site **não usa mais Gemini direto**: chama o backend `terra-gentil-app/backend`, que detém a chave atual em variável de ambiente do Railway. Se houver `GEMINI_API_KEY` numa `.env.local` antiga, pode apagar.
2. **Nunca expor chaves no frontend** — `/api/diagnose` é só proxy server-side; nenhum segredo trafega pro browser.
3. **CORS do Hostinger** bloqueou downloads via PowerShell — por isso foi necessário baixar o `uploads.zip` pelo File Manager manualmente.

---

## 📞 Contatos do projeto

- Email: canalterragentil@gmail.com
- WhatsApp: +55 11 92093-8591
- YouTube: @TerraGentil
- Instagram: @canalterragentil

---

**Última atualização:** Abril 2026
