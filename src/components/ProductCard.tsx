import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { Product } from '@/src/types/catalog';
import { getCategoryNameById } from '@/src/services/catalogService';
import { ProductVisual } from '@/src/components/ProductVisual';
import { useQuote } from '@/src/context/QuoteContext';

interface ProductCardProps {
  product: Product;
  onBeforeNavigate?: () => void;
  showQuoteAction?: boolean;
}

export function ProductCard({
  product,
  onBeforeNavigate,
  showQuoteAction = false,
}: ProductCardProps) {
  const location = useLocation();
  const { addItem, removeItem, hasItem } = useQuote();
  const categoryName = getCategoryNameById(product.categoryId);
  const inQuoteList = showQuoteAction && hasItem(product.code);

  const returnToCatalogPath =
    location.pathname === '/productos'
      ? `${location.pathname}${location.search}`
      : undefined;

  const handleToggleQuote = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (inQuoteList) {
      removeItem(product.code);
    } else {
      addItem(product, 1, 'unidades');
    }
  };

  return (
    <Link
      to={`/productos/${encodeURIComponent(product.code)}`}
      state={returnToCatalogPath ? { fromCatalog: returnToCatalogPath } : undefined}
      onClick={onBeforeNavigate}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-sm border border-[#252B30]/10 bg-[#FFFFFF] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#252B30]/28 hover:shadow-[0_6px_18px_rgba(37,43,48,0.05)] active:translate-y-0 active:scale-[0.985]"
    >
      <div className="aspect-[4/3] w-full shrink-0 overflow-hidden border-b border-[#252B30]/8 bg-[#F5F4F0]">
        <ProductVisual
          code={product.code}
          name={product.name}
          imageUrl={product.imageUrl}
          shapeVariant={product.shapeVariant}
          className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-[#69737A] sm:text-xs">
            <span className="truncate">{categoryName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-medium text-[#252B30] tabular-nums shrink-0">
              {product.code}
            </span>
          </div>

          <h3 className="mt-1 line-clamp-2 min-h-[2.5em] text-[13px] font-semibold leading-snug tracking-tight text-[#252B30] transition-colors group-hover:text-[#B77948] sm:text-[15px]">
            {product.name}
          </h3>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#252B30]/8 pt-2.5 text-[11px] sm:mt-3 sm:pt-3 sm:text-xs">
          <span className="min-w-0 truncate text-[#69737A] tabular-nums">
            {product.dimensions ? product.dimensions : 'Medidas a confirmar'}
          </span>

          {showQuoteAction ? (
            <button
              type="button"
              onClick={handleToggleQuote}
              aria-pressed={inQuoteList}
              aria-label={
                inQuoteList
                  ? `Quitar ${product.code} de la lista de consulta`
                  : `Agregar ${product.code} a la lista de consulta`
              }
              className={`inline-flex min-h-[28px] shrink-0 items-center gap-1 rounded-sm px-2 py-1 text-[11px] font-semibold transition-colors active:scale-95 ${
                inQuoteList
                  ? 'bg-[#252B30] text-white hover:bg-[#252B30]/90'
                  : 'border border-[#252B30]/15 bg-[#F5F4F0]/70 text-[#252B30] hover:border-[#B77948] hover:text-[#B77948]'
              }`}
            >
              {inQuoteList ? (
                <>
                  <Check strokeWidth={1.8} className="h-3 w-3 text-[#B77948]" aria-hidden="true" />
                  <span>En lista</span>
                </>
              ) : (
                <>
                  <Plus strokeWidth={1.8} className="h-3 w-3" aria-hidden="true" />
                  <span>Consulta</span>
                </>
              )}
            </button>
          ) : (
            <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#252B30] transition-colors group-hover:text-[#B77948]">
              <span>Ver</span>
              <ArrowRight
                strokeWidth={1.7}
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5"
                aria-hidden="true"
              />
            </span>
          )}
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[#B77948] transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </Link>
  );
}
