import { useState, useMemo } from 'react';
import { Search, SearchX, X, ChefHat } from 'lucide-react';
import ProductCard from './ProductCard';
import CategoryTabs from './CategoryTabs';

export default function ProductGrid({ products, onProductClick, categories }) {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = category === 'all' || p.category === category;
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, category, search]);

  const suggestions = useMemo(() => {
    if (filtered.length > 0 || !search) return [];
    const q = search.toLowerCase();
    return products
      .filter(p => {
        const name = p.name.toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return name.includes(q.slice(0, 3)) || desc.includes(q) || desc.includes(q.slice(0, 3));
      })
      .slice(0, 4);
  }, [filtered, search, products]);

  const hits = useMemo(() => {
    if (filtered.length > 0 || suggestions.length > 0) return [];
    return products.filter(p => p.is_hit).slice(0, 4);
  }, [filtered, suggestions, products]);

  return (
    <section id="catalog">
      {/* Categories + Search in one row */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-0 pb-4 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CategoryTabs active={category} onChange={setCategory} categories={categories} />
          </div>
          <div className="relative w-full lg:w-80 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти блюдо..."
              className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-full text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-8">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((p, idx) => (
              <ProductCard
                key={p.id || p.name + idx}
                product={p}
                onClick={() => onProductClick(p)}
              />
            ))}
          </div>
        ) : !search && category !== 'all' ? (
          /* Empty category placeholder */
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
              <ChefHat className="w-9 h-9 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Упс, ещё не успели приготовить!</h3>
            <p className="text-sm text-gray-400 mb-4">
              Скоро здесь появятся вкусные блюда. Загляните позже!
            </p>
            <button
              onClick={() => setCategory('all')}
              className="text-sm font-semibold text-navy hover:text-navy-light transition-colors"
            >
              Смотреть всё меню
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <SearchX className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Ничего не найдено</h3>
            <p className="text-sm text-gray-400 mb-2">
              По запросу «{search}» блюд не нашлось
            </p>
            <button
              onClick={() => { setSearch(''); setCategory('all'); }}
              className="text-sm font-semibold text-navy hover:text-navy-light transition-colors"
            >
              Сбросить фильтры
            </button>

            {/* Suggestions or Hits */}
            {(suggestions.length > 0 || hits.length > 0) && (
              <div className="mt-10 text-left">
                <h4 className="text-sm font-bold text-gray-900 mb-4">
                  {suggestions.length > 0 ? 'Возможно, вы искали:' : 'Попробуйте наши хиты:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(suggestions.length > 0 ? suggestions : hits).map((p, idx) => (
                    <ProductCard
                      key={p.id || p.name + idx}
                      product={p}
                      onClick={() => onProductClick(p)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
