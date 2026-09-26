import { ArrowRight } from 'lucide-react';

export function HomeHero() {
  const scrollToCollection = () => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <section aria-labelledby="hero-title" className="relative isolate min-h-[500px] overflow-hidden bg-[#efe4d2] sm:min-h-[650px] lg:min-h-[calc(100vh-155px)]">
      <img src="/images/siddhi-premium-hero.png" alt="Siddhi Fashion festive Indian occasion wear collection" className="absolute inset-0 size-full object-cover object-[66%_center] sm:object-center" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f5ead8]/95 via-[#f5ead8]/58 to-transparent sm:via-[#f5ead8]/25" />
      <div className="relative mx-auto flex min-h-[500px] max-w-[1500px] items-center px-6 sm:min-h-[650px] sm:px-12 lg:min-h-[calc(100vh-155px)] lg:px-20">
        <div className="max-w-[25rem] text-[#2b211c] sm:max-w-[34rem]">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8e5739] sm:text-xs">The festive edit · 2026</p>
          <h1 id="hero-title" className="font-serif text-5xl font-normal leading-[0.94] tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]">Made for your <span className="block italic text-[#9a6444]">beautiful moments.</span></h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-[#5d4b40] sm:text-base sm:leading-7">Timeless Indian silhouettes, thoughtful details, and effortless elegance for every celebration.</p>
          <button type="button" onClick={scrollToCollection} className="group mt-8 inline-flex min-h-12 items-center gap-4 border border-[#2b211c] bg-[#2b211c] px-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-transparent hover:text-[#2b211c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a6444]">Explore the collection<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} /></button>
        </div>
      </div>
    </section>
  );
}
