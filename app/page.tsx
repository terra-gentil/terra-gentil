import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import Videos from '@/components/sections/Videos';
import Doutor from '@/components/sections/Doutor';
import AppPromo from '@/components/sections/AppPromo';
import Manifesto from '@/components/sections/Manifesto';
import Transformations from '@/components/sections/Transformations';
import Game from '@/components/sections/Game';
import About from '@/components/sections/About';
import Ebooks from '@/components/sections/Ebooks';
import Instagram from '@/components/sections/Instagram';
import Newsletter from '@/components/sections/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Videos />
      <Doutor />
      <AppPromo />
      <Manifesto />
      <Transformations />
      <Game />
      <About />
      <Ebooks />
      <Instagram />
      <Newsletter />
    </>
  );
}
