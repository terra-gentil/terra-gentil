import Link from 'next/link';
import { Home, BookOpen, MessageCircle, Leaf } from 'lucide-react';
import { whatsappLink } from '@/lib/constants';

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-terra-50 to-white py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-terra-100 rounded-full mb-6">
          <Leaf size={36} className="text-terra-700" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-terra-900 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-terra-800 mb-4">
          Esse cantinho ainda não floresceu
        </h2>
        <p className="text-terra-700 leading-relaxed mb-8">
          A página que você procurou não existe mais ou foi movida no novo site. Talvez você queira
          ir pra um destes:
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 bg-white hover:bg-terra-50 border-2 border-terra-200 rounded-2xl p-5 transition"
          >
            <Home size={28} className="text-terra-700" />
            <span className="font-semibold text-terra-800 text-sm">Início</span>
            <span className="text-xs text-terra-600">Conhecer a Terra Gentil</span>
          </Link>
          <Link
            href="/blog"
            className="flex flex-col items-center gap-2 bg-white hover:bg-terra-50 border-2 border-terra-200 rounded-2xl p-5 transition"
          >
            <BookOpen size={28} className="text-terra-700" />
            <span className="font-semibold text-terra-800 text-sm">Blog</span>
            <span className="text-xs text-terra-600">Histórias e dicas</span>
          </Link>
          <a
            href={whatsappLink('Olá! Cheguei numa página 404 no site da Terra Gentil')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-white hover:bg-terra-50 border-2 border-terra-200 rounded-2xl p-5 transition"
          >
            <MessageCircle size={28} className="text-terra-700" />
            <span className="font-semibold text-terra-800 text-sm">WhatsApp</span>
            <span className="text-xs text-terra-600">Falar com a gente</span>
          </a>
        </div>

        <p className="text-sm text-terra-600 italic">
          🌿 Seja gentil com a terra. Seja Terra Gentil.
        </p>
      </div>
    </section>
  );
}
