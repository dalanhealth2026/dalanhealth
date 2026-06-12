import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from './Hero';
import { ProblemSolution } from './ProblemSolution';
import { Features } from './Features';
import { LiveQueueDemo } from './LiveQueueDemo';
import { TvDisplaySection } from './TvDisplaySection';
import { HowItWorks } from './HowItWorks';
import { Pricing } from './Pricing';
import { Subscribe } from './Subscribe';
import { Testimonials } from './Testimonials';
import { Stats } from './Stats';
import { FAQ } from './FAQ';
import { CTA } from './CTA';

export function LandingPage() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <>
      <Hero />
      <ProblemSolution />
      <Features />
      <LiveQueueDemo />
      <TvDisplaySection />
      <HowItWorks />
      <Pricing />
      <Subscribe />
      <Testimonials />
      <Stats />
      <FAQ />
      <CTA />
    </>
  );
}
