import { ArrowRight } from 'lucide-react';

export function HomeHero() {
  const scrollToCollection = () => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <section aria-labelledby="hero-title" className="relative isolate h-[205px] overflow-hidden bg-[#f7eac4] sm:h-auto sm:min-h-[650px] lg:min-h-[calc(100vh-155px)]">
        <img
          src="/images/siddhi-premium-hero.png"
          alt="Siddhi Fashion festive Indian occasion wear collection"
          className="absolute inset-0 size-full object-cover object-[69%_center] sm:object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff2c8]/95 via-[#fff2c8]/70 to-transparent sm:from-[#f5ead8]/95 sm:via-[#f5ead8]/25" />
        <div className="relative mx-auto flex h-full max-w-[1500px] items-center px-5 sm:min-h-[650px] sm:px-12 lg:min-h-[calc(100vh-155px)] lg:px-20">
          <div className="w-[56%] max-w-[25rem] text-[#17120f] sm:w-auto sm:max-w-[34rem]">
            <p className="mb-2 font-serif text-[22px] leading-none sm:mb-5 sm:text-xs sm:font-sans sm:font-semibold sm:uppercase sm:tracking-[0.32em] sm:text-[#8e5739]">Siddhi Fashion</p>
            <p className="mb-4 text-[8px] font-medium uppercase tracking-[0.25em] sm:hidden">Designer wear</p>
            <h1 id="hero-title" className="text-[25px] font-black uppercase leading-[0.92] tracking-[-0.035em] sm:font-serif sm:text-7xl sm:font-normal sm:normal-case sm:leading-[0.94] lg:text-[5.5rem]">
              The perfect <span className="block text-[31px] sm:text-inherit sm:italic sm:text-[#9a6444]">Indian collection</span>
            </h1>
            <p className="mt-3 hidden max-w-md text-sm leading-6 text-[#5d4b40] sm:block sm:text-base sm:leading-7">Timeless Indian silhouettes, thoughtful details, and effortless elegance for every celebration.</p>
            <button type="button" onClick={scrollToCollection} className="group mt-8 hidden min-h-12 items-center gap-4 border border-[#2b211c] bg-[#2b211c] px-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-transparent hover:text-[#2b211c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a6444] sm:inline-flex">Explore the collection<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} /></button>
            <p className="mt-4 text-[8px] font-semibold uppercase tracking-[0.12em] sm:hidden">Luxury &amp; high quality</p>
          </div>
        </div>
      </section>
      <div className="overflow-hidden bg-[#171717] py-2 text-white sm:hidden" role="note" aria-label="Payment safety notice">
        <p className="animate-safety-marquee whitespace-nowrap text-[10px] font-medium">Siddhi Fashion is not responsible for payments made to WhatsApp numbers or DMs. Stay safe! &nbsp; • &nbsp; We do not take orders on WhatsApp.</p>
      </div>
    </>
  );
}
