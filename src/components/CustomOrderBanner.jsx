import { ArrowRight } from 'lucide-react';

export default function CustomOrderBanner() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8">
      <div className="bg-navy rounded-2xl px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl md:text-h2 font-bold text-white mb-2">
            Индивидуальный заказ
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-md leading-relaxed">
            Приготовим пельмени и вареники по вашему рецепту или предпочтениям.
          </p>
        </div>
        <a
          href="tel:+79298429891"
          className="btn-navy-outline flex-shrink-0 text-sm"
        >
          Оставить заявку
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
