interface InstagramEmbedProps {
  shortcode: string;
  caption?: string;
  withCaption?: boolean;
}

// Embed oficial do Instagram via iframe estatico (sem JS adicional).
// frame-src do CSP em next.config.ts ja esta liberado pra instagram.com.
//
// Shortcode = parte final da URL: instagram.com/p/<shortcode>/ ou
// instagram.com/reel/<shortcode>/. O endpoint /embed/ funciona pros dois.
export default function InstagramEmbed({
  shortcode,
  caption,
  withCaption = false,
}: InstagramEmbedProps) {
  const path = withCaption ? 'embed/captioned/' : 'embed/';
  const src = `https://www.instagram.com/p/${shortcode}/${path}`;
  return (
    <iframe
      src={src}
      title={caption ?? `Post do Instagram ${shortcode}`}
      loading="lazy"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        background: 'var(--paper-2)',
      }}
    />
  );
}
