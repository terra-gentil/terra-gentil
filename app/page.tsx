import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Transformations from '@/components/sections/Transformations';
import Videos from '@/components/sections/Videos';
import PlantDoctor from '@/components/sections/PlantDoctor';

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
