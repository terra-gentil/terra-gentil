import type { NextConfig } from 'next';

// Content Security Policy. Notas:
// - 'unsafe-inline' em script/style: necessario pelo Next inline scripts e Tailwind v4.
//   Em hardening futuro com nonce, trocar pelo CSP nonce-based.
// - frame-src libera youtube (lite-embed em /videos) e github pages (iframe do jogo em /jogo).
// - connect-src libera Railway (backend ranking do jogo embedded).
// - img-src libera os hosts do remotePatterns abaixo.
const cspParts = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://i.ytimg.com https://terragentil.com.br https://*.google-analytics.com https://*.googletagmanager.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://terra-gentil.github.io",
  "connect-src 'self' https://terra-gentil-game-production.up.railway.app https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
];

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Content-Security-Policy', value: cspParts.join('; ') },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'terragentil.com.br', pathname: '/**' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  // Redirects 301 (permanentes) cobrindo padroes herdados do WordPress velho.
  // URLs nao mapeadas aqui caem no app/not-found.tsx amigavel.
  async redirects() {
    return [
      // Posts WP com permalink `?p=ID` -> blog
      { source: '/', has: [{ type: 'query', key: 'p' }], destination: '/blog', permanent: true },
      // Index PHP, feed RSS antigo, comments feed
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/feed', destination: '/blog', permanent: true },
      { source: '/feed/', destination: '/blog', permanent: true },
      { source: '/rss', destination: '/blog', permanent: true },
      { source: '/rss/', destination: '/blog', permanent: true },
      { source: '/comments/feed', destination: '/blog', permanent: true },
      { source: '/comments/feed/', destination: '/blog', permanent: true },
      // wp-admin / wp-login: visitantes humanos vao pra home, bots so vem aqui se
      // o site velho deixou link em algum lugar; nao queremos expor 404 com isso.
      { source: '/wp-admin/:path*', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: true },
      { source: '/xmlrpc.php', destination: '/', permanent: true },
      // Taxonomias antigas
      { source: '/author/:slug*', destination: '/sobre', permanent: true },
      { source: '/tag/:slug*', destination: '/blog', permanent: true },
      { source: '/category/:slug*', destination: '/blog', permanent: true },
      // Redirect canonico: tirar trailing slash em rotas raiz (Next ja faz por
      // default, mas explicitando ajuda crawlers que indexaram com slash)
      { source: '/sobre/', destination: '/sobre', permanent: true },
      { source: '/blog/', destination: '/blog', permanent: true },
      { source: '/transformacoes/', destination: '/transformacoes', permanent: true },
      { source: '/videos/', destination: '/videos', permanent: true },
      { source: '/equipamentos/', destination: '/equipamentos', permanent: true },
    ];
  },
};

export default nextConfig;
