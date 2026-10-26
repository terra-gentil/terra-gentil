/** JSON-LD genérico para o Google (não aparece na tela). Escapa "<" para o texto não fechar a tag. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\u003c') }}
    />
  );
}
