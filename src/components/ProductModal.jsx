import { useEffect, useMemo, useState } from 'react';
import { X, ShoppingCart, UtensilsCrossed, Plus, Minus, Trash2, Clock, Users, Flame, Weight, Heart, Leaf, ChefHat } from 'lucide-react';
import { useCart } from '../context/CartContext';

const WEIGHT_OPTIONS = [
  { key: '500', label: '500 г' },
  { key: '1000', label: '1 кг' },
];

export default function ProductModal({ product, onClose, products = [] }) {
  const { addToCart, items, changeQty } = useCart();
  const [weight, setWeight] = useState('500');

  const priceKg = product?.price_kg ?? (product ? product.price * 2 : 0);
  const currentPrice = weight === '500' ? product?.price : priceKg;
  const variantName = product ? `${product.name}, ${weight === '500' ? '500 г' : '1 кг'}` : '';
  const qty = items[variantName]?.qty || 0;

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const recommendations = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.name !== product.name && p.category === product.category)
      .slice(0, 3);
  }, [product, products]);

  if (!product) return null;

  const hasImage = !!product.image;

  // Parse weight from description
  const weightMatch = product.description?.match(/(\d+)\s*(г|мл)/i);
  const weightVal = weightMatch ? weightMatch[0] : null;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white sm:rounded-2xl w-full sm:max-w-[520px] h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto modal-scroll animate-slide-up relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Floating close button — sticks to top-right while scrolling */}
        <div className="sticky top-0 z-10 h-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:text-black transition-all"
            style={{
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.6)',
            }}
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image — edge to edge */}
        <div className="relative w-full aspect-[4/3] bg-gray-100">
          {hasImage ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={e => { e.target.style.display = 'none'; }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossed className="w-16 h-16 text-gray-300" />
            </div>
          )}

        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 pt-5 pb-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">
            {product.name}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            {product.description}
          </p>

          {/* Info badges */}
          <div className="flex items-stretch gap-2 mb-6 overflow-x-auto scrollbar-hide">
            {product.cook_time && (
              <div className="flex-1 min-w-[70px] flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-xl py-3 px-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-900">{product.cook_time}</span>
                <span className="text-[10px] text-gray-400">время</span>
              </div>
            )}
            {product.portions && (
              <div className="flex-1 min-w-[70px] flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-xl py-3 px-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-900">{product.portions}</span>
                <span className="text-[10px] text-gray-400">порции</span>
              </div>
            )}
            {product.calories && (
              <div className="flex-1 min-w-[70px] flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-xl py-3 px-2">
                <Flame className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-900">{product.calories}</span>
                <span className="text-[10px] text-gray-400">на порцию</span>
              </div>
            )}
            {weightVal && (
              <div className="flex-1 min-w-[70px] flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-xl py-3 px-2">
                <Weight className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-900">{weightVal}</span>
                <span className="text-[10px] text-gray-400">вес</span>
              </div>
            )}
          </div>

          {/* Composition */}
          {product.composition && (
            <div className="flex gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Состав</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.composition}
                </p>
              </div>
            </div>
          )}

          {/* Preparation */}
          {product.preparation && (
            <div className="flex gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ChefHat className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Приготовление</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.preparation}
                </p>
              </div>
            </div>
          )}

          {/* Weight switcher */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Выберите вес</p>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
              {WEIGHT_OPTIONS.map(opt => {
                const optPrice = opt.key === '500' ? product.price : priceKg;
                const active = weight === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setWeight(opt.key)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all ${
                      active
                        ? 'bg-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className={`text-sm font-bold ${active ? 'text-gray-900' : ''}`}>{opt.label}</span>
                    <span className={`text-xs ${active ? 'text-navy font-semibold' : 'text-gray-400'}`}>{optPrice} ₽</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price + Cart — sticky at bottom */}
          <div
            className="sticky bottom-0 -mx-5 sm:-mx-6 px-5 sm:px-6 flex items-center justify-between py-4 border-t border-gray-100 mb-5 z-10"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(16px) saturate(160%)',
              WebkitBackdropFilter: 'blur(16px) saturate(160%)',
            }}
          >
            <span className="text-2xl font-bold text-gray-900">
              {currentPrice} <span className="text-base text-gray-500">₽</span>
            </span>
            {qty === 0 ? (
              <button
                onClick={() => addToCart(variantName, currentPrice)}
                className="btn-navy text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                В корзину
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-1.5 py-1.5">
                <button
                  onClick={() => changeQty(variantName, -1)}
                  className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-navy hover:text-navy transition-colors"
                >
                  {qty === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </button>
                <span className="text-base font-bold text-gray-900 min-w-[24px] text-center">{qty}</span>
                <button
                  onClick={() => addToCart(variantName, currentPrice)}
                  className="w-9 h-9 rounded-lg bg-navy text-white flex items-center justify-center hover:bg-navy-light transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Рекомендуем также</h3>
              <div className="grid grid-cols-3 gap-3">
                {recommendations.map(rec => (
                  <button
                    key={rec.id || rec.name}
                    onClick={() => { addToCart(rec.name, rec.price); }}
                    className="relative bg-gray-50 rounded-xl overflow-hidden text-left hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-full aspect-square overflow-hidden bg-gray-200">
                      {rec.image ? (
                        <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UtensilsCrossed className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">{rec.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
