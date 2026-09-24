import { ArrowRight, Sparkles } from 'lucide-react';

export function HomeHero() {
  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate mx-3 mt-3 overflow-hidden rounded-2xl bg-[#fff9ef] sm:mx-0 sm:mt-0 sm:min-h-[470px] sm:rounded-none sm:bg-[#ead7b8] lg:min-h-[520px]"
    >
      <img
        src="/images/siddhi-premium-hero.png"
        alt="Maroon and ivory Indian occasion wear with delicate gold embroidery"
        className="relative block aspect-[12/5] h-auto w-full object-cover sm:absolute sm:inset-0 sm:size-full sm:aspect-auto sm:object-cover sm:object-center"
        fetchPriority="high"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,249,238,0.96)_0%,rgba(255,249,238,0.78)_52%,rgba(255,249,238,0.08)_100%)] sm:bg-[linear-gradient(90deg,rgba(255,249,238,0.97)_0%,rgba(255,249,238,0.88)_34%,rgba(255,249,238,0.05)_58%,transparent_100%)]" />

      <div className="absolute inset-0 mx-auto flex w-full max-w-[1500px] items-center px-4 py-3 sm:relative sm:min-h-[470px] sm:px-10 sm:py-14 lg:min-h-[520px] lg:px-16">
        <div className="max-w-[72%] text-[#2b1912] sm:max-w-[34rem]">
          <p className="mb-1 inline-flex items-center gap-1.5 text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-[#8b5a24] sm:mb-4 sm:gap-2 sm:text-[0.68rem] sm:tracking-[0.24em]">
            <Sparkles aria-hidden="true" className="size-3.5" />
            The festive edit
          </p>
          <h1 id="hero-title" className="font-serif text-[1.35rem] font-medium leading-[0.92] tracking-[-0.035em] sm:text-5xl sm:leading-[0.96] lg:text-6xl">
            Tradition, tailored
            <span className="block italic text-[#9c6328]">for today.</span>
          </h1>
          <p className="mt-1.5 max-w-md text-[0.58rem] leading-3 text-[#5f493e] sm:mt-5 sm:text-base sm:leading-7">
            Discover elegant Indian wear selected for beautiful detail, effortless comfort, and every celebration.
          </p>
          <button
            type="button"
            onClick={scrollToCollection}
            className="group mt-2 inline-flex min-h-7 items-center gap-1.5 rounded-full bg-[#2b1912] px-3 py-1.5 text-[0.6rem] font-semibold text-[#fffaf0] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#43271c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9c6328] sm:mt-7 sm:min-h-11 sm:gap-3 sm:px-5 sm:py-3 sm:text-sm"
          >
            Shop the collection
            <ArrowRight aria-hidden="true" className="size-3 transition-transform group-hover:translate-x-1 sm:size-4" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 right-5 hidden items-center gap-3 text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-[#fff8e9] lg:flex">
        <span className="h-px w-10 bg-current/60" />
        Crafted for celebrations
      </div>
    </section>
  );
}
