import Script from 'next/script';

interface Props {
  gaId: string;
}

/**
 * Google Analytics 4 via gtag.js. Renderizado apenas quando gaId existe
 * (env NEXT_PUBLIC_GA_ID setada). Sem ID, o componente nem chega a montar.
 *
 * Strategy="lazyOnload": baixa so quando o navegador fica ocioso depois do load.
 * Com afterInteractive o gtag (~170 KB) disputava banda com a imagem principal (LCP).
 * Os scripts ficam servidos pelo Next domain, sem terceiro inline.
 */
export default function GoogleAnalytics({ gaId }: Props) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
