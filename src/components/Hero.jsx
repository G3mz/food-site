import { Leaf, ArrowRight } from 'lucide-react';

export default function Hero({ settings }) {
  const badge = settings.hero_badge || 'Натуральные продукты';
  const title = 'Домашние вареники, которые хочется заказать снова';

  const handleCta = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Render title with last word italicized
  const words = title.trim().split(/\s+/);
  const lastWord = words.pop();
  const restTitle = words.join(' ');

  return (
    <section className="relative w-full overflow-hidden -mt-[68px] pt-[68px] sm:-mt-[88px] sm:pt-[88px]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/img/hero-pelmeni.jpeg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Content — text directly on background, no card */}
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-16 sm:py-20 lg:py-28">
        <div className="max-w-xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full mb-6">
            <Leaf className="w-3.5 h-3.5" />
            {badge}
          </span>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-medium text-navy leading-[1.1] mb-8">
            {restTitle}{' '}
            <span className="italic font-normal">{lastWord}.</span>
          </h1>

          {/* CTA */}
          <button
            onClick={handleCta}
            className="inline-flex items-center gap-2.5 bg-navy text-white font-semibold text-base px-6 py-3.5 rounded-full hover:bg-navy-light transition-colors shadow-lg shadow-navy/20"
          >
            Смотреть меню
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Wavy bottom edge — mobile (1 wave) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-10 sm:hidden"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="#F9FAFB" d="M0,50 C480,90 960,10 1440,50 L1440,80 L0,80 Z" />
      </svg>
      {/* Wavy bottom edge — desktop (3 waves) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-16 hidden sm:block"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="#F9FAFB" d="M0,40 C240,90 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </section>
  );
}
