import { X, Phone } from 'lucide-react';

export default function MobileMenu({ isOpen, onClose, settings = {} }) {
  const phone = settings.phone || '+7 929 842 98 91';
  const phoneHref = 'tel:' + phone.replace(/[^0-9+]/g, '');

  const handleNav = (sectionId) => {
    onClose();
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const navItems = [
    { label: 'Каталог', section: 'catalog' },
    { label: 'О нас', section: 'features' },
    { label: 'Доставка и оплата', section: 'features' },
    { label: 'Контакты', section: 'footer' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[2999] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-3 right-3 sm:top-4 sm:right-4 z-[3000] w-[280px] sm:w-[320px] rounded-3xl border border-white/40 overflow-hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          boxShadow:
            '0 20px 60px rgba(23, 59, 115, 0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
      >
        {/* Close */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="font-serif text-base font-bold text-navy">Меню</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors p-1"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links — minimalist text rows */}
        <nav className="px-2 pb-2">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => handleNav(item.section)}
              className="w-full text-left px-3 py-3 rounded-xl text-[15px] font-medium text-gray-800 hover:bg-white/60 hover:text-navy transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Phone */}
        <a
          href={phoneHref}
          className="flex items-center gap-2.5 mx-3 mb-3 px-3 py-2.5 rounded-xl bg-white/50 hover:bg-white/80 transition-colors"
        >
          <Phone className="w-4 h-4 text-navy" />
          <span className="text-sm font-semibold text-gray-800">{phone}</span>
        </a>
      </aside>
    </>
  );
}
