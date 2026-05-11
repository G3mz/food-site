import { useRef, useLayoutEffect, useState } from 'react';
import { CATEGORIES as FALLBACK_CATEGORIES } from '../data/fallback';

export default function CategoryTabs({ active, onChange, categories = FALLBACK_CATEGORIES }) {
  const containerRef = useRef(null);
  const pillRef = useRef(null);
  const tabRefs = useRef({});
  const isFirstRender = useRef(true);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const tab = tabRefs.current[active];
    const container = containerRef.current;
    if (!tab || !container) return;

    const newLeft = tab.offsetLeft;
    const newWidth = tab.offsetWidth;

    setPillStyle({ left: newLeft, width: newWidth });

    // Auto-center active tab on scroll
    const scrollLeft = tab.offsetLeft - container.clientWidth / 2 + newWidth / 2;
    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: isFirstRender.current ? 'auto' : 'smooth',
    });

    isFirstRender.current = false;
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="relative flex gap-1 overflow-x-auto scrollbar-hide"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Sliding pill */}
      <div
        ref={pillRef}
        className="absolute top-0 bottom-0 rounded-full bg-white shadow-sm"
        style={{
          left: pillStyle.left,
          width: pillStyle.width,
          transition: isFirstRender.current
            ? 'none'
            : 'left 320ms cubic-bezier(0.22, 1, 0.36, 1), width 320ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />

      {categories.map(cat => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            ref={el => { tabRefs.current[cat.key] = el; }}
            onClick={() => onChange(cat.key)}
            className={`
              relative z-10 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium
              transition-colors duration-300 select-none
              ${isActive
                ? 'text-navy'
                : 'text-gray-600 hover:text-navy'
              }
            `}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
