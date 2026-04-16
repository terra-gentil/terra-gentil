# 🤖 CONTEXTO PARA CONTINUIDADE DO CHAT

> **Leia este arquivo primeiro antes de me ajudar.** Ele contém o contexto completo do projeto e minhas preferências de trabalho.

---

## 👤 Quem sou eu (o usuário)

Sou **Engenheiro de Automação de QA Sênior** especialista em **Robot Framework + Python**. Normalmente minha configuração de preferências te instrui a responder focado em código Robot Framework, MAS **neste projeto específico estamos atuando como desenvolvedor web** construindo o site Terra Gentil em Next.js. Continue nesse modo.

---

## 🎯 O projeto em 30 segundos

Estamos reconstruindo o site **terragentil.com.br** (canal de YouTube sobre jardinagem + transformação de quintais) do zero em **Next.js 16 moderno**, saindo de um WordPress velho, pesado e inseguro no Hostinger.

O dono do canal (André) é o meu amigo/cliente. O site tem:
- Blog
- Galeria de transformações (antes/depois)
- Vídeos do YouTube (playlist dinâmica)
- **"Doutor das Plantas"** — feature com IA Gemini que diagnostica plantas por foto
- 12 ebooks PDF sobre jardinagem
- Links pra redes sociais

---

## 💻 Meu ambiente de trabalho

- **Windows** (PowerShell é meu terminal)
- **VS Code** (já está aberto no projeto)
- Pasta do projeto: `C:\Users\engan\Documents\Terra_Gentil_Site\terra-gentil`
- Node.js 24.14.1 instalado
- Git instalado
- `npm run dev` rodando em http://localhost:3000

---

## 🧑‍💻 Como prefiro que você me ajude (IMPORTANTE)

### ✅ FAÇA:

1. **Gere arquivos prontos** em vez de me fazer digitar código. Eu prefiro:
   - Você cria o arquivo completo
   - Me entrega via `present_files`
   - Me passa um comando PowerShell único pra copiar do Downloads pra pasta certa

2. **Scripts PowerShell** que fazem TUDO em um comando só (extrair zip, copiar, instalar dependência, etc).

3. **Base64 encoding** quando precisar transmitir arquivo via terminal (evita erros de encoding com caracteres especiais como `<`, `>`, aspas, acentos).

4. **Explique o que o comando faz** antes de me pedir pra rodar.

5. **Me guie passo a passo** — um passo por vez, esperando eu confirmar antes do próximo.

### ❌ NÃO FAÇA:

1. **NÃO me peça pra criar arquivos manualmente no VS Code** (botão direito → New File → colar código). Isso é lento e chato.

2. **NÃO use PowerShell here-strings (`@"..."@`)** com código complexo. O PowerShell come caracteres `<`, quebra em JSX. Use base64 ou arquivos zipados.

3. **NÃO gere comandos que dependem de mover arquivos manualmente** — use `$env:USERPROFILE\Downloads\` direto.

4. **NÃO faça jargão desnecessário** — vai direto ao ponto.

---

## 🏗️ Stack e decisões arquiteturais já tomadas

| Item | Escolha | Por quê |
|------|---------|---------|
| Framework | Next.js 16 (App Router + Turbopack) | SSG/SSR, rotas dinâmicas, API routes |
| Estilo | Tailwind CSS v4 (com `@theme`) | Cores da marca centralizadas, sem config file |
| Ícones | lucide-react + SVG inline | Brand icons (Facebook/Instagram) em SVG pq lucide removeu |
| IA | Gemini 2.5 Flash | Free tier generoso, barato, usuário tem créditos Google |
| YouTube | RSS feed (sem API key) | Sem quota, sem auth, atualiza automático |
| Deploy | Vercel (planejado) | Grátis, integração GitHub, CDN global |
| CMS | Nenhum (dados em `data/*.ts`) | Simples, sem custo adicional, versionado no Git |

### Paleta Terra Gentil
```css
--color-terra-50:  #f1f8f1
--color-terra-100: #d8f3dc
--color-terra-200: #b7e4c7
--color-terra-300: #95d5b2
--color-terra-400: #74c69d
--color-terra-500: #52b788
--color-terra-600: #40916c
--color-terra-700: #2d6a4f  (primário)
--color-terra-800: #1b4332  (header footer)
--color-terra-900: #1a4d2e  (texto destacado)
```

---

## 📊 Estado atual (o que já funciona)

### Rodando 100% no localhost:3000

- ✅ **Home:** Hero + Sobre + Doutor das Plantas + Transformações + Vídeos
- ✅ **/sobre, /blog, /blog/[slug], /transformacoes, /videos, /equipamentos**
- ✅ **Header** sticky com logo real
- ✅ **Footer** 3 colunas com YouTube/Instagram/TikTok/Facebook (SVG inline)
- ✅ **WhatsApp flutuante** (número: +55 11 92093-8591)
- ✅ **Slider antes/depois** arrastável
- ✅ **YouTube dinâmico** — RSS da playlist, revalidate 1h
- ✅ **API Route `/api/diagnose`** — Gemini analisa foto de planta, retorna JSON
- ✅ **6 imagens reais** em `public/images/` (logo, avatar doutor, 4 fotos de transformação)
- ✅ **12 ebooks** mapeados com keywords em `data/ebooks.ts`

### Variáveis de ambiente (`.env.local`)
```
GEMINI_API_KEY=SUA_CHAVE_AQUI_VER_ENV_LOCAL
```

### IDs importantes
- Playlist YouTube: `PLo0P-qaOD_PSJ24_1Z5d9JbwVs2Y3oDS8`
- Handle YouTube: `@TerraGentil`
- 3 vídeos em destaque: `CK_0skjKI5A`, `q76bMs-NwRk`, `h91qQnbYnNM`

---

## 🚧 O que ainda falta (prioridade)

1. **Testar o Doutor das Plantas** com foto real no localhost — confirmar se o Gemini retorna o JSON estruturado corretamente
2. **Deploy na Vercel** — criar repo GitHub, conectar na Vercel, configurar env var
3. **Migração DNS** — apontar terragentil.com.br pra Vercel + redirects 301 das URLs antigas
4. **Google Analytics 4 + Search Console**
5. **Mais conteúdo** — posts no blog, fotos de transformações, depoimentos
6. **Testes automatizados** em Robot Framework (já gerei em sessão anterior, pasta `terra-gentil-tests/`)

---

## 📚 Arquivos de backup importantes

1. `terragentiljardinagemcomgentileza_WordPress_2026-04-16.xml` — export completo do WordPress velho (conteúdo, metadados)
2. `uploads.zip` (341 MB) — todas as mídias do Hostinger antigo (no Downloads)

Se precisar de alguma outra imagem/conteúdo que não tá no projeto, extrair do XML ou do uploads.zip.

---

## ⚡ Comandos PowerShell úteis

```powershell
# Rodar dev
cd C:\Users\engan\Documents\Terra_Gentil_Site\terra-gentil
npm run dev

# Instalar nova dependência
npm install NOME_DO_PACOTE

# Listar arquivos da pasta
Get-ChildItem -Directory

# Ver conteúdo de arquivo
Get-Content caminho\arquivo.tsx -TotalCount 10

# Copiar do Downloads pra pasta do projeto
Copy-Item -Path "$env:USERPROFILE\Downloads\ARQUIVO" -Destination "CAMINHO\DESTINO" -Force

# Extrair zip (sem long path issues, usando .NET)
Add-Type -AssemblyName System.IO.Compression.FileSystem
# Usar [System.IO.Compression.ZipFileExtensions]::ExtractToFile em vez de Expand-Archive
```

---

## 🎨 Exigências estéticas

- **Mobile-first** — testar sempre no mobile
- **Performance obsessiva** — Lighthouse 90+
- **Sem gradientes agressivos** — flat design + sombras sutis
- **Tipografia: Helvetica Neue** (configurado em globals.css)
- **Tom de voz:** acolhedor, gentileza, natureza, "Seja gentil com a terra"

---

## 🙏 Como começar a conversa comigo

Quando eu abrir um chat novo, cole isto como primeira mensagem pra você:

> "Oi Claude! Vou continuar o projeto Terra Gentil. Leia o CONTEXTO-CHAT.md e o README.md da raiz do projeto antes de me responder. Meu próximo objetivo é: **[DESCREVER AQUI]**"

E me ajude daí em diante seguindo minhas preferências acima.

---

**Última atualização:** Abril 2026
