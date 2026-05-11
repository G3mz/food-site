import { Shell, ChevronUp } from 'lucide-react';

export default function Footer({ settings }) {
  const phone = settings.phone || '+7 929 842 98 91';
  const phoneHref = 'tel:' + phone.replace(/[^0-9+]/g, '');
  const tagline = settings.footer_tagline || 'Домашняя кулинария с доставкой до двери';
  const copyright = settings.footer_copyright || '\u00A9 2025 Все права защищены';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-navy mt-8">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Main */}
        <div className="py-10 lg:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shell className="w-6 h-6 text-white/80" strokeWidth={1.5} />
              <span className="font-serif text-xl font-bold text-white">Печь & Борщ</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">{tagline}</p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">
              Наши коллекции
            </h4>
            <ul className="space-y-2">
              {['Пельмени и вареники', 'Блинчики', 'Пирожки', 'Супы'].map(l => (
                <li key={l}>
                  <a href="#catalog" className="text-sm text-white/40 hover:text-white transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">
              Покупателям
            </h4>
            <ul className="space-y-2">
              {['О нас', 'Контакты', 'Доставка и оплата'].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:text-right lg:text-right">
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">
              Горячая линия
            </h4>
            <a href={phoneHref} className="text-lg font-bold text-white hover:text-white/80 transition-colors block mb-1">
              {phone}
            </a>
            <p className="text-xs text-white/40 mb-4">Ежедневно 09:00 – 21:00</p>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
              Наверх
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <span>Печь & Борщ — домашняя кулинария ручной работы</span>
          <span>{copyright}</span>
        </div>
      </div>
    </footer>
  );
}
