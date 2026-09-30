import { breadcrumbJsonLd, type Crumb } from '@/lib/seo';

/** Trilha de navegacao so para o Google (nao aparece na tela). */
export default function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd(crumbs) }}
    />
  );
}
