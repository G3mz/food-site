import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Leaf, Hand, UtensilsCrossed, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CATEGORY_COLORS = {
  meat: '#E8D5D0',
  soups: '#D5E0D5',
  desserts: '#E0D5E0',
};

export default function ProductCard({ product, onClick, categoryLabels = {} }) {
  const { addToCart, items, changeQty } = useCart();
  const qty = items[product.name]?.qty || 0;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef(null);

  const hasImage = !!product.image;
  const imgSrc = product.image;
  const categoryLabel = categoryLabels[product.category] || product.category;
  const placeholderColor = CATEGORY_COLORS[product.category] || '#E5E7EB';

  useEffect(() => {
    const el = descRef.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight);
  }, [product.description]);

  const weightMatch = product.description?.match(/(\d+\s*(г|мл|литр)[.]*)/i);
  const weight = weightMatch ? weightMatch[1].replace('.', '') : null;

  return (
    <div
      className="bg-white rounded-2xl card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden cursor-pointer group flex flex-row sm:flex-col"
      onClick={onClick}
    >
      {/* Image */}
      <div
        className="relative w-[130px] sm:w-full aspect-square sm:aspect-[4/3] overflow-hidden flex-shrink-0"
        style={{ backgroundColor: placeholderColor }}
      >
        {hasImage ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: placeholderColor }} />
            )}
            <img
              src={imgSrc}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={e => { e.target.style.display = 'none'; setImgLoaded(true); }}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <UtensilsCrossed className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {product.is_hit && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-navy text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="hidden sm:inline">Хит продаж</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
        <span className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">
          {categoryLabel}
        </span>
        <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 mt-0.5 sm:mt-1 mb-0.5 sm:mb-1 leading-snug">
          {product.name}
        </h3>
        <p ref={descRef} className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-1 line-clamp-2">
          {product.description}
        </p>
        {isClamped && (
          <button
            onClick={e => { e.stopPropagation(); onClick?.(); }}
            className="text-xs font-semibold text-navy hover:text-navy-light transition-colors mb-2 hidden sm:inline-block"
          >
            Узнать больше
          </button>
        )}

        {/* Spacer to push tags + price to bottom */}
        <div className="flex-1" />

        {/* Feature tags */}
        <div className="flex flex-wrap gap-2 mb-2 sm:mb-4">
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-gray-400">
            <Leaf className="w-3 h-3" />
            Натуральный состав
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-gray-400">
            <Hand className="w-3 h-3" />
            Ручная лепка
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between sm:pt-3 sm:border-t sm:border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3">
            {weight && (
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium">{weight}</span>
            )}
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {product.price} <span className="text-xs sm:text-sm font-semibold text-gray-500">₽</span>
            </span>
          </div>
          {qty === 0 ? (
            <button
              onClick={e => {
                e.stopPropagation();
                addToCart(product.name, product.price);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-navy text-white flex items-center justify-center hover:bg-navy-light transition-colors active:scale-95"
              aria-label={`Добавить ${product.name} в корзину`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-1 py-1" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => changeQty(product.name, -1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-navy hover:text-navy transition-colors"
              >
                {qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              </button>
              <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">{qty}</span>
              <button
                onClick={() => addToCart(product.name, product.price)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-navy text-white flex items-center justify-center hover:bg-navy-light transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
