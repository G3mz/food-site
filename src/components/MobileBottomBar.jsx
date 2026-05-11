import { Phone, UtensilsCrossed, ShoppingCart, ChevronUp } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileBottomBar({ onOpenCart }) {
  const { totalItems } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1500] bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <a
          href="tel:+79298429891"
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-500 active:text-navy transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Позвонить</span>
        </a>

        <button
          onClick={scrollToCatalog}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-500 active:text-navy transition-colors"
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Меню</span>
        </button>

        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-500 active:text-navy transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Корзина</span>
          {totalItems > 0 && (
            <span className="absolute top-0 right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
              {totalItems}
            </span>
          )}
        </button>

        <button
          onClick={scrollToTop}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-500 active:text-navy transition-colors"
        >
          <ChevronUp className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Наверх</span>
        </button>
      </div>
    </div>
  );
}
