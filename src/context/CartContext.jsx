import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { SAUCES } from '../data/fallback';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState({});
  const [selectedSauces, setSelectedSauces] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const addToCart = useCallback((name, price) => {
    setItems(prev => ({
      ...prev,
      [name]: prev[name]
        ? { ...prev[name], qty: prev[name].qty + 1 }
        : { price, qty: 1 },
    }));
    showToast(`${name} добавлено в корзину`);
  }, [showToast]);

  const changeQty = useCallback((name, delta) => {
    setItems(prev => {
      const next = { ...prev };
      if (!next[name]) return next;
      next[name] = { ...next[name], qty: next[name].qty + delta };
      if (next[name].qty <= 0) delete next[name];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems({});
    setSelectedSauces({});
  }, []);

  const addSauce = useCallback((sauceValue) => {
    setSelectedSauces(prev => ({
      ...prev,
      [sauceValue]: (prev[sauceValue] || 0) + 1,
    }));
  }, []);

  const changeSauceQty = useCallback((sauceValue, delta) => {
    setSelectedSauces(prev => {
      const next = { ...prev };
      const newQty = (next[sauceValue] || 0) + delta;
      if (newQty <= 0) {
        delete next[sauceValue];
      } else {
        next[sauceValue] = newQty;
      }
      return next;
    });
  }, []);

  const totalItems = useMemo(
    () => Object.values(items).reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => Object.values(items).reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const saucesTotal = useMemo(
    () => Object.values(selectedSauces).reduce((sum, qty) => sum + qty * 50, 0),
    [selectedSauces]
  );

  const total = subtotal + saucesTotal;

  const value = useMemo(() => ({
    items,
    selectedSauces,
    isCartOpen,
    toast,
    totalItems,
    subtotal,
    saucesTotal,
    total,
    addToCart,
    changeQty,
    clearCart,
    addSauce,
    changeSauceQty,
    setIsCartOpen,
    showToast,
  }), [items, selectedSauces, isCartOpen, toast, totalItems, subtotal, saucesTotal, total, addToCart, changeQty, clearCart, addSauce, changeSauceQty, showToast]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
