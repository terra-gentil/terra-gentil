import Link from 'next/link';
import { ArrowRight, Play, Leaf } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-terra-50 via-white to-terra-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-terra-100 text-terra-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
            <Leaf size={14} />
            <span>Jardinagem com Gentileza</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-terra-900 leading-tight mb-6">
            Transformando quintais esquecidos em{' '}
            <span className="text-terra-600">espaços vivos</span>
          </h1>

          <p className="text-lg md:text-xl text-terra-700 mb-8 leading-relaxed">
            Cada transformação é uma história de cuidado, respeito e recomeço.
            Descubra o poder da gentileza aplicada à natureza.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#doutor"
              className="inline-flex items-center justify-center gap-2 bg-terra-700 hover:bg-terra-800 text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
            >
              <Leaf size={18} />
              Diagnosticar minha planta
            </Link>

            <a
              href="https://www.youtube.com/@TerraGentil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-terra-50 text-terra-800 px-6 py-3 rounded-full font-medium border-2 border-terra-200 transition-all"
            >
              <Play size={18} />
              Assistir no YouTube
            </a>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-terra-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-terra-400 rounded-full opacity-20 blur-3xl"></div>
    </section>
  );
}
