import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Product } from '@/src/types/catalog';
import { buildGeneralQuoteMessage, buildWhatsAppUrl } from '@/src/config/siteConfig';

export interface QuoteItem {
  code: string;
  name: string;
  categoryId: Product['categoryId'];
  quantity: number;
  unit: 'unidades' | 'pallets';
}

interface QuoteContextValue {
  items: QuoteItem[];
  totalCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: Product, quantity?: number, unit?: 'unidades' | 'pallets') => void;
  removeItem: (code: string) => void;
  updateItemQuantity: (code: string, quantity: number) => void;
  updateItemUnit: (code: string, unit: 'unidades' | 'pallets') => void;
  clearItems: () => void;
  hasItem: (code: string) => boolean;
  buildQuoteSummaryText: () => string;
  getQuoteWhatsAppUrl: () => string;
}

const STORAGE_KEY = 'ciriaco_quote_list_v1';

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar si almacenamiento local no está disponible
    }
  }, [items]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const addItem = useCallback(
    (product: Product, quantity = 1, unit: 'unidades' | 'pallets' = 'unidades') => {
      const safeQty = Math.max(1, Math.floor(quantity));
      setItems((prev) => {
        const existing = prev.find((item) => item.code === product.code);
        if (existing) {
          return prev.map((item) =>
            item.code === product.code
              ? { ...item, quantity: item.quantity + safeQty, unit }
              : item
          );
        }
        return [
          ...prev,
          {
            code: product.code,
            name: product.name,
            categoryId: product.categoryId,
            quantity: safeQty,
            unit,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((code: string) => {
    setItems((prev) => prev.filter((item) => item.code !== code));
  }, []);

  const updateItemQuantity = useCallback((code: string, quantity: number) => {
    const safeQty = Math.max(1, Math.floor(quantity));
    setItems((prev) =>
      prev.map((item) => (item.code === code ? { ...item, quantity: safeQty } : item))
    );
  }, []);

  const updateItemUnit = useCallback((code: string, unit: 'unidades' | 'pallets') => {
    setItems((prev) =>
      prev.map((item) => (item.code === code ? { ...item, unit } : item))
    );
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const hasItem = useCallback(
    (code: string) => items.some((item) => item.code === code),
    [items]
  );

  const buildQuoteSummaryText = useCallback(() => {
    if (items.length === 0) {
      return buildGeneralQuoteMessage();
    }
    const lines = items.map(
      (item) => `- ${item.code} (${item.name}): ${item.quantity} ${item.unit}`
    );
    return `Hola, buen día. Quisiera solicitar un presupuesto por los siguientes materiales:\n${lines.join('\n')}`;
  }, [items]);

  const getQuoteWhatsAppUrl = useCallback(() => {
    return buildWhatsAppUrl(buildQuoteSummaryText());
  }, [buildQuoteSummaryText]);

  return (
    <QuoteContext.Provider
      value={{
        items,
        totalCount: items.length,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        removeItem,
        updateItemQuantity,
        updateItemUnit,
        clearItems,
        hasItem,
        buildQuoteSummaryText,
        getQuoteWhatsAppUrl,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return ctx;
}
