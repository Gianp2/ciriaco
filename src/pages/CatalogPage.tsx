import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ClipboardList, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Category, CategorySlug, Product } from '@/src/types/catalog';
import { catalogService } from '@/src/services/catalogService';
import { CatalogCategoryFilter } from '@/src/components/CatalogCategoryFilter';
import { ProductCard } from '@/src/components/ProductCard';
import { BrandsSection } from '@/src/components/BrandsSection';
import { useQuote } from '@/src/context/QuoteContext';
import { EASE_ARCHITECTURAL } from '@/src/lib/motionPresets';

type SortOption = 'default' | 'code-asc' | 'code-desc';

const SORT_OPTIONS: { value: SortOption; label: string; shortLabel: string }[] = [
  { value: 'default', label: 'Por línea', shortLabel: 'Línea' },
  { value: 'code-asc', label: 'Código A–Z', shortLabel: 'A–Z' },
  { value: 'code-desc', label: 'Código Z–A', shortLabel: 'Z–A' },
];

const SCROLL_STORAGE_KEY = 'ciriaco_catalog_scroll_y';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('categoria') as CategorySlug | null) ?? 'all';
  const initialQuery = searchParams.get('q') ?? '';
  const initialSort = (searchParams.get('orden') as SortOption | null) ?? 'default';

  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const deferredQuery = useDeferredValue(searchQuery);
  const [isLoading, setIsLoading] = useState(true);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { totalCount: quoteCount, openDrawer } = useQuote();

  useEffect(() => {
    const paramCat = (searchParams.get('categoria') as CategorySlug | null) ?? 'all';
    const paramQ = searchParams.get('q') ?? '';
    const paramSort = (searchParams.get('orden') as SortOption | null) ?? 'default';
    setSelectedCategory(paramCat);
    setSearchQuery(paramQ);
    setSortBy(paramSort);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    Promise.all([catalogService.getCategories(), catalogService.getProducts()]).then(
      ([cats, prods]) => {
        if (!active) return;
        setCategories(cats);
        setAllProducts(prods);
        setIsLoading(false);
      }
    );
    return () => {
      active = false;
    };
  }, []);

  // Atajo "/" para enfocar el buscador rápidamente
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Restaurar posición de scroll al regresar desde el detalle de un producto
  useEffect(() => {
    if (isLoading) return;
    const savedY = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (savedY) {
      const parsed = Number(savedY);
      sessionStorage.removeItem(SCROLL_STORAGE_KEY);
      if (!Number.isNaN(parsed) && parsed > 0) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: parsed, behavior: 'auto' });
        });
      }
    }
  }, [isLoading]);

  const updateUrlParams = (
    nextCategory: CategorySlug | 'all',
    nextQuery: string,
    nextSort: SortOption
  ) => {
    const next = new URLSearchParams();
    if (nextCategory !== 'all') {
      next.set('categoria', nextCategory);
    }
    if (nextQuery.trim().length > 0) {
      next.set('q', nextQuery.trim());
    }
    if (nextSort !== 'default') {
      next.set('orden', nextSort);
    }
    setSearchParams(next, { replace: true });
  };

  const handleSelectCategory = (categoryId: CategorySlug | 'all') => {
    setSelectedCategory(categoryId);
    updateUrlParams(categoryId, searchQuery, sortBy);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrlParams(selectedCategory, value, sortBy);
  };

  const handleSortChange = (nextSort: SortOption) => {
    setSortBy(nextSort);
    updateUrlParams(selectedCategory, searchQuery, nextSort);
  };

  const filteredProducts = useMemo(() => {
    const query = deferredQuery.trim().toLowerCase();
    const filtered = allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory;
      const matchesQuery =
        query.length === 0 ||
        product.code.toLowerCase().includes(query) ||
        product.name.toLowerCase().includes(query) ||
        (product.description?.toLowerCase().includes(query) ?? false);
      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'code-asc') {
      return [...filtered].sort((a, b) =>
        a.code.localeCompare(b.code, 'es', { numeric: true })
      );
    }
    if (sortBy === 'code-desc') {
      return [...filtered].sort((a, b) =>
        b.code.localeCompare(a.code, 'es', { numeric: true })
      );
    }
    return filtered;
  }, [allProducts, selectedCategory, deferredQuery, sortBy]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const hasActiveFilters =
    selectedCategory !== 'all' || searchQuery.trim().length > 0 || sortBy !== 'default';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
    setSearchParams({}, { replace: true });
  };

  const saveScrollBeforeDetail = () => {
    sessionStorage.setItem(SCROLL_STORAGE_KEY, String(window.scrollY));
  };

  return (
    <div className="min-h-[75dvh] bg-[#F5F4F0]">
      {/* Encabezado compacto y filtros del catálogo */}
      <section className="border-b border-[#252B30]/10 bg-[#FFFFFF]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Botón minimalista Volver al inicio */}
          <div className="mb-3">
            <Link
              to="/"
              className="group inline-flex min-h-[38px] items-center gap-1.5 rounded-sm pr-2 py-1 text-xs font-medium text-[#69737A] transition-colors duration-150 hover:text-[#252B30] active:scale-[0.98]"
            >
              <ArrowLeft
                strokeWidth={1.75}
                className="h-3.5 w-3.5 text-[#B77948] transition-transform duration-150 group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              <span>Volver al inicio</span>
            </Link>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] text-[#B77948] uppercase sm:text-xs">
                <span aria-hidden="true" className="h-[2px] w-6 bg-[#B77948]" />
                <span>Catálogo técnico</span>
              </div>

              <h1 className="mt-2.5 text-[clamp(1.5rem,2.8vw,2.25rem)] font-bold tracking-tight text-[#252B30] text-balance">
                {activeCategoryObj ? activeCategoryObj.name : 'Catálogo de productos'}
              </h1>

              {activeCategoryObj && (
                <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-[#69737A] sm:text-sm">
                  {activeCategoryObj.shortDescription}
                </p>
              )}
            </div>

            {/* Buscador instantáneo por código, nombre y descripción */}
            <div className="relative w-full lg:max-w-[340px]">
              <Search
                strokeWidth={1.65}
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#69737A]"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar código o material..."
                aria-label="Buscar productos por código, nombre o descripción"
                className="min-h-[42px] w-full rounded-md border border-[#252B30]/14 bg-[#F5F4F0]/75 py-2 pl-10 pr-10 text-sm text-[#252B30] placeholder:text-[#69737A]/85 transition-all duration-150 focus:border-[#B77948] focus:bg-[#FFFFFF] focus:shadow-[0_0_0_3px_rgba(183,121,72,0.12)] focus:outline-none"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[4px] text-[#69737A] transition-colors hover:bg-[#252B30]/6 hover:text-[#252B30] active:scale-95"
                >
                  <X strokeWidth={1.7} className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <kbd
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-[3px] border border-[#252B30]/14 bg-[#FFFFFF] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#69737A] sm:inline-flex"
                >
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Barra segmentada de categorías */}
          <div className="mt-5 sm:mt-6">
            <CatalogCategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleSelectCategory}
              totalCount={allProducts.length}
            />
          </div>
        </div>
      </section>

      {/* Grilla de resultados */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#252B30]/10 pb-3.5">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#69737A]">
            {isLoading ? (
              <span className="font-mono">Cargando catálogo...</span>
            ) : (
              <p className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono font-semibold text-[#252B30] tabular-nums">
                  {filteredProducts.length}
                </span>
                <span>
                  {filteredProducts.length === 1
                    ? 'producto encontrado'
                    : 'productos encontrados'}
                </span>
                {activeCategoryObj && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[#252B30]">
                      {activeCategoryObj.name}
                    </span>
                  </>
                )}
                {deferredQuery.trim().length > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[#252B30]">
                      “{deferredQuery.trim()}”
                    </span>
                  </>
                )}
              </p>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-[30px] items-center gap-1.5 rounded-[4px] px-2 py-1 text-xs font-semibold text-[#B77948] transition-colors hover:bg-[#B77948]/10 hover:text-[#9F6639] active:scale-[0.98]"
              >
                <RotateCcw strokeWidth={1.75} className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Restablecer</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {quoteCount > 0 && (
              <button
                type="button"
                onClick={openDrawer}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-[#B77948]/35 bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#252B30] whitespace-nowrap transition-colors hover:border-[#B77948] hover:text-[#B77948] active:scale-[0.98]"
              >
                <ClipboardList strokeWidth={1.65} className="h-3.5 w-3.5 text-[#B77948]" aria-hidden="true" />
                <span className="tabular-nums">Lista ({quoteCount})</span>
              </button>
            )}

            {/* Selector segmentado de orden */}
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 text-xs font-medium text-[#69737A] sm:inline-flex">
                <SlidersHorizontal strokeWidth={1.65} className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Orden</span>
              </span>

              <div
                role="group"
                aria-label="Ordenar productos"
                className="inline-flex items-center rounded-md border border-[#252B30]/12 bg-[#FFFFFF] p-0.5"
              >
                {SORT_OPTIONS.map((option) => {
                  const isActive = sortBy === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleSortChange(option.value)}
                      className={`relative inline-flex min-h-[32px] items-center justify-center rounded-[4px] px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                        isActive ? 'text-white' : 'text-[#69737A] hover:text-[#252B30]'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="catalog-sort-indicator"
                          transition={{ duration: 0.2, ease: EASE_ARCHITECTURAL }}
                          className="absolute inset-0 rounded-[4px] bg-[#252B30]"
                        />
                      )}
                      <span className="relative z-10 sm:hidden">{option.shortLabel}</span>
                      <span className="relative z-10 hidden sm:inline">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="catalog-grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-60 animate-pulse rounded-sm border border-[#252B30]/10 bg-[#FFFFFF]"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="catalog-grid">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.34,
                  delay: shouldReduceMotion || idx >= 10 ? 0 : idx * 0.025,
                  ease: EASE_ARCHITECTURAL,
                }}
              >
                <ProductCard
                  product={product}
                  showQuoteAction
                  onBeforeNavigate={saveScrollBeforeDetail}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: EASE_ARCHITECTURAL }}
            className="rounded-sm border border-[#252B30]/12 bg-[#FFFFFF] p-8 text-center sm:p-12"
          >
            <h2 className="text-base font-semibold text-[#252B30]">
              No se encontraron productos
            </h2>
            <p className="mt-2 text-sm text-[#69737A]">
              No hay referencias que coincidan con los filtros o el término buscado.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex min-h-[42px] items-center justify-center rounded-sm bg-[#252B30] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B77948] active:scale-[0.98]"
            >
              Ver todos los productos
            </button>
          </motion.div>
        )}
      </section>

      {/* Marcas con las que trabajamos */}
      <BrandsSection />
    </div>
  );
}
