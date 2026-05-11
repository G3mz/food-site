import { useState, useCallback } from 'react';
import { Phone, WifiOff } from 'lucide-react';
import { usePocketBase } from './hooks/usePocketBase';
import { useCart } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartModal from './components/CartModal';
import CustomOrderBanner from './components/CustomOrderBanner';
import Features from './components/Features';
import Footer from './components/Footer';
import MobileBottomBar from './components/MobileBottomBar';
import MobileMenu from './components/MobileMenu';
import Toast from './components/Toast';
import DebugPanel from './components/DebugPanel';

export default function App() {
  const { products, settings, categories, pbAvailable, loading, apiError } = usePocketBase();
  const [devMode, setDevMode] = useState(false);
  const [forceApiError, setForceApiError] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const { isCartOpen, setIsCartOpen } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openCart = useCallback(() => setIsCartOpen(true), [setIsCartOpen]);
  const closeCart = useCallback(() => setIsCartOpen(false), [setIsCartOpen]);
  const openMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Skeleton Header */}
        <div className="sticky top-0 z-50 bg-white/95 border-b border-gray-100">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-4 lg:px-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
              <div className="w-28 h-5 rounded-md bg-gray-200 animate-pulse" />
            </div>
            <div className="hidden lg:flex items-center gap-6">
              {[80, 50, 110, 60].map((w, i) => (
                <div key={i} className="h-4 rounded bg-gray-100 animate-pulse" style={{ width: w }} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-10 rounded-2xl bg-gray-200 animate-pulse" />
              <div className="lg:hidden w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Skeleton Hero */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-8 pb-8 lg:pt-16 lg:pb-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 flex flex-col items-center lg:items-start gap-4 w-full">
              <div className="w-40 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-full max-w-md h-12 rounded-lg bg-gray-200 animate-pulse" />
              <div className="w-64 h-4 rounded bg-gray-100 animate-pulse" />
              <div className="w-80 h-4 rounded bg-gray-100 animate-pulse" />
            </div>
            <div className="flex-1 w-full max-w-xl aspect-[4/3] rounded-2xl bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Skeleton Tabs */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-8">
          <div className="flex gap-2">
            {[96, 80, 64, 88].map((w, i) => (
              <div key={i} className="h-11 rounded-2xl bg-gray-200 animate-pulse" style={{ width: w }} />
            ))}
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="w-16 h-3 rounded bg-gray-100 animate-pulse" />
                  <div className="w-3/4 h-5 rounded bg-gray-200 animate-pulse" />
                  <div className="w-full h-3 rounded bg-gray-100 animate-pulse" />
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="w-16 h-5 rounded bg-gray-200 animate-pulse" />
                    <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16 lg:pb-0">
      <Toast />

      {/* API Connection Error Banner */}
      {(apiError || forceApiError) && !errorDismissed && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <WifiOff className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-800 font-medium truncate">
                Ой, наши повара обновляют базу рецептов. Показываем сохранённое меню.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href="tel:+79298429891"
                className="inline-flex items-center gap-2 bg-navy text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-navy-light transition-colors active:scale-95"
              >
                <Phone className="w-4 h-4" />
                Позвонить для заказа
              </a>
              <button
                onClick={() => setErrorDismissed(true)}
                className="text-amber-400 hover:text-amber-600 text-xl leading-none px-2 transition-colors"
                aria-label="Скрыть"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <Header
        onOpenMenu={openMenu}
        onOpenCart={openCart}
        onOpenDebug={() => setDebugOpen(true)}
      />

      <main>
        <Hero settings={settings} />
        <ProductGrid
          products={products}
          categories={categories}
          onProductClick={setSelectedProduct}
        />
        <CustomOrderBanner />
        <Features />
      </main>

      <Footer settings={settings} />

      <DebugPanel isOpen={debugOpen} onClose={() => setDebugOpen(false)} />

      <MobileBottomBar onOpenCart={openCart} />

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMenu}
        onOpenCart={openCart}
        settings={settings}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          products={products}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartModal
        isOpen={isCartOpen}
        onClose={closeCart}
        pbAvailable={pbAvailable}
      />

      {/* Dev Test Panel - triple click logo area */}
      {devMode && (
        <div className="fixed bottom-20 left-4 z-[9999] bg-gray-900 text-white rounded-xl p-4 text-xs shadow-2xl max-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-sm">🛠 Dev Panel</span>
            <button onClick={() => setDevMode(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={forceApiError} onChange={e => { setForceApiError(e.target.checked); setErrorDismissed(false); }} className="rounded" />
              API Error Banner
            </label>
            <button onClick={() => openCart()} className="w-full py-1.5 bg-navy rounded-lg hover:bg-navy-light transition-colors">
              Open Cart
            </button>
            <p className="text-gray-400 pt-1">PB: {pbAvailable ? '✅ Connected' : '❌ Offline'}</p>
            <p className="text-gray-400">Products: {products.length}</p>
            <p className="text-gray-400">Categories: {categories.length - 1}</p>
          </div>
        </div>
      )}

      {/* Dev Mode Activator: click version 5 times */}
      <button
        className="fixed bottom-2 right-2 text-[10px] text-gray-300 opacity-0 hover:opacity-100 transition-opacity z-[100]"
        onClick={() => setDevMode(d => !d)}
      >
        dev
      </button>
    </div>
  );
}
