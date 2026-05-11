import { useState, useEffect } from 'react';
import { PB_URL, FALLBACK_SETTINGS, FALLBACK_PRODUCTS, CATEGORIES as FALLBACK_CATEGORIES } from '../data/fallback';

export function usePocketBase() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [pbAvailable, setPbAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      const timeout = AbortSignal.timeout(2000);

      try {
        const [settingsRes, productsRes] = await Promise.all([
          fetch(PB_URL + '/api/collections/site_settings/records?perPage=200', { signal: timeout }),
          fetch(PB_URL + '/api/collections/products/records?perPage=200&sort=sort_order', { signal: timeout }),
        ]);

        if (cancelled) return;

        const settingsData = await settingsRes.json();
        const productsData = await productsRes.json();

        if (cancelled) return;

        const settingsMap = {};
        (settingsData.items || []).forEach(s => {
          settingsMap[s.key] = s.value;
        });

        const productsList = productsData.items || [];

        // Build categories dynamically from products
        const catSet = new Set(productsList.map(p => p.category).filter(Boolean));
        const dynamicCats = [{ key: 'all', label: 'Всё меню' }];
        const knownLabels = { meat: 'Мясное', soups: 'Супы', desserts: 'Десерты' };
        catSet.forEach(cat => {
          dynamicCats.push({ key: cat, label: knownLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1) });
        });

        // Try fetching categories collection (optional)
        try {
          const catRes = await fetch(PB_URL + '/api/collections/categories/records?perPage=200&sort=sort_order', { signal: AbortSignal.timeout(1000) });
          if (catRes.ok) {
            const catData = await catRes.json();
            if (catData.items && catData.items.length > 0) {
              const pbCats = [{ key: 'all', label: 'Всё меню' }];
              catData.items.forEach(c => pbCats.push({ key: c.key, label: c.label }));
              setCategories(pbCats);
            } else {
              setCategories(dynamicCats);
            }
          } else {
            setCategories(dynamicCats);
          }
        } catch {
          setCategories(dynamicCats);
        }

        setPbAvailable(true);
        setSettings(settingsMap);
        setProducts(productsList);
      } catch (err) {
        console.warn('PocketBase unavailable, using fallback:', err.message);
        if (cancelled) return;
        setApiError(true);
        setSettings(FALLBACK_SETTINGS);
        setProducts(FALLBACK_PRODUCTS);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  return { products, settings, categories, pbAvailable, loading, apiError };
}
