import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MobileMenu({ isOpen, onClose, settings = {} }) {
  const phone = settings.phone || '+7 929 842 98 91';
  const phoneHref = 'tel:' + phone.replace(/[^0-9+]/g, '');

  const [pos, setPos] = useState({ top: 64, right: 16 });

  useEffect(() => {
    if (!isOpen) return;
    const measure = () => {
      const btn = document.querySelector('[data-menu-trigger]');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      setPos({
        top: r.bottom + 10,
        right: Math.max(8, window.innerWidth - r.right),
      });
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [isOpen]);

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

      {/* Drawer — expands from menu icon (top-right) */}
      <aside
        className={`fixed z-[3000] w-[280px] sm:w-[320px] rounded-3xl border border-white/40 overflow-hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          top: pos.top,
          right: pos.right,
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          boxShadow:
            '0 20px 60px rgba(23, 59, 115, 0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
          transformOrigin: 'top right',
          transform: isOpen ? 'scale(1)' : 'scale(0.4)',
          opacity: isOpen ? 1 : 0,
          transition: isOpen
            ? 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease-out'
            : 'transform 200ms cubic-bezier(0.4, 0, 1, 1), opacity 150ms ease-in',
        }}
      >
        {/* Nav links — minimalist text rows */}
        <nav className="px-2 pt-3 pb-2">
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
