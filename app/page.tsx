import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Transformations from '@/components/sections/Transformations';
import Videos from '@/components/sections/Videos';

// PlantDoctor e client + pesado (FileReader, base64, fetch, 9 icones).
// Defer pra fora do bundle inicial. SSR mantido pra SEO crawlers verem o titulo.
const PlantDoctor = dynamic(() => import('@/components/sections/PlantDoctor'), {
  loading: () => (
    <div className="py-20 bg-gradient-to-br from-terra-50 to-white">
      <div className="max-w-4xl mx-auto px-4 text-center text-terra-700">
        <div className="h-8 w-64 bg-terra-100 rounded mx-auto animate-pulse" />
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <PlantDoctor />
      <Transformations />
      <Videos />
    </>
  );
}
