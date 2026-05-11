import { useRef } from 'react';
import { ShoppingCart, Shell } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header({ isMenuOpen, onToggleMenu, onOpenCart, onOpenDebug }) {
  const { totalItems } = useCart();
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const handleLogoClick = () => {
    clickCount.current += 1;
    clearTimeout(clickTimer.current);
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      onOpenDebug?.();
    } else {
      clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 1500);
    }
  };

  return (
    <div className="sticky top-0 z-50 px-4 sm:px-6 lg:px-10 pt-4">
      <header
        className="max-w-[1280px] mx-auto rounded-full px-6 py-3 sm:py-3.5 flex items-center justify-between border border-white/40"
        style={{
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow:
            '0 8px 32px rgba(23, 59, 115, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Logo — 5 clicks to open debug */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={handleLogoClick}
        >
          <Shell className="w-7 h-7 sm:w-8 sm:h-8 text-navy" strokeWidth={1.5} />
          <span className="font-serif text-lg sm:text-xl font-bold text-navy tracking-tight">
            Печь & Борщ
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Menu trigger — burger morphs into X when open */}
          <button
            data-menu-trigger
            onClick={onToggleMenu}
            className="relative flex items-center justify-center text-gray-800 hover:text-navy transition-colors p-1 w-7 h-7 sm:w-8 sm:h-8"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
          >
            <span className="relative block w-5 h-5 sm:w-6 sm:h-6">
              <span
                className="absolute left-0 right-0 top-1/2 h-[2px] bg-current rounded-full"
                style={{
                  transform: isMenuOpen
                    ? 'translateY(-50%) rotate(45deg)'
                    : 'translateY(calc(-50% - 6px)) rotate(0deg)',
                  transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <span
                className="absolute left-0 right-0 top-1/2 h-[2px] bg-current rounded-full"
                style={{
                  transform: 'translateY(-50%)',
                  opacity: isMenuOpen ? 0 : 1,
                  transition: 'opacity 180ms ease',
                }}
              />
              <span
                className="absolute left-0 right-0 top-1/2 h-[2px] bg-current rounded-full"
                style={{
                  transform: isMenuOpen
                    ? 'translateY(-50%) rotate(-45deg)'
                    : 'translateY(calc(-50% + 6px)) rotate(0deg)',
                  transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </span>
          </button>

          {/* Cart — plain icon with badge */}
          <button
            id="cart-btn"
            onClick={onOpenCart}
            className="relative flex items-center justify-center text-gray-800 hover:text-navy transition-colors p-1"
            aria-label="Открыть корзину"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-navy text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>
    </div>
  );
}
