import { motion } from 'motion/react';
import { Category, CategorySlug } from '@/src/types/catalog';
import { getProductCountByCategory } from '@/src/services/catalogService';

interface CategoryCompactBarProps {
  categories: Category[];
  selectedCategory: CategorySlug | 'all';
  onSelect: (categoryId: CategorySlug | 'all') => void;
  totalCount: number;
  layoutIdPrefix?: string;
}

export function CategoryCompactBar({
  categories,
  selectedCategory,
  onSelect,
  totalCount,
  layoutIdPrefix = 'cat-tab',
}: CategoryCompactBarProps) {
  return (
    <div className="w-full">
      {/* Móvil (<640px): chips horizontales compactos sin scroll de página */}
      <div
        role="tablist"
        aria-label="Filtrar por categoría"
        className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 sm:hidden"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === 'all'}
          onClick={() => onSelect('all')}
          className={`relative inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-sm px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors active:scale-[0.97] ${
            selectedCategory === 'all'
              ? 'bg-[#252B30] text-white'
              : 'border border-[#252B30]/14 bg-[#F5F4F0] text-[#252B30]'
          }`}
        >
          <span>Todos</span>
          <span
            className={`font-mono text-[11px] tabular-nums ${
              selectedCategory === 'all' ? 'text-white/75' : 'text-[#69737A]'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const count = getProductCountByCategory(category.id);
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelect(category.id)}
              className={`relative inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-sm px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors active:scale-[0.97] ${
                isSelected
                  ? 'bg-[#252B30] text-white'
                  : 'border border-[#252B30]/14 bg-[#F5F4F0] text-[#252B30]'
              }`}
            >
              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-5 w-5 rounded-[2px] object-cover shrink-0"
                />
              )}
              <span>{category.name}</span>
              <span
                className={`font-mono text-[11px] tabular-nums ${
                  isSelected ? 'text-white/75' : 'text-[#69737A]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tablet & Desktop (>=640px): grilla compacta fluida adaptable mediante auto-fit y minmax() */}
      <div
        role="tablist"
        aria-label="Categorías de productos"
        className="hidden sm:grid sm:grid-cols-[repeat(auto-fit,minmax(122px,1fr))] gap-2.5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === 'all'}
          onClick={() => onSelect('all')}
          className={`relative flex min-h-[56px] flex-col justify-between rounded-sm border p-3 text-left transition-all duration-150 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.985] ${
            selectedCategory === 'all'
              ? 'border-[#252B30] bg-[#252B30] text-white'
              : 'border-[#252B30]/12 bg-[#FFFFFF] text-[#252B30] hover:border-[#252B30]/35'
          }`}
        >
          <span className="text-xs font-semibold leading-tight">Todos</span>
          <span
            className={`mt-1.5 font-mono text-[11px] tabular-nums ${
              selectedCategory === 'all' ? 'text-white/75' : 'text-[#69737A]'
            }`}
          >
            {totalCount} ref.
          </span>
          {selectedCategory === 'all' && (
            <motion.span
              layoutId={`${layoutIdPrefix}-underline`}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 bottom-0 h-[2px] bg-[#B77948]"
            />
          )}
        </button>

        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const count = getProductCountByCategory(category.id);
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelect(category.id)}
              className={`relative flex min-h-[56px] items-start justify-between gap-2 rounded-sm border p-3 text-left transition-all duration-150 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.985] ${
                isSelected
                  ? 'border-[#252B30] bg-[#252B30] text-white'
                  : 'border-[#252B30]/12 bg-[#FFFFFF] text-[#252B30] hover:border-[#252B30]/35'
              }`}
            >
              <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
                <span className="text-xs font-semibold leading-tight line-clamp-2">
                  {category.name}
                </span>
                <span
                  className={`mt-1.5 font-mono text-[11px] tabular-nums ${
                    isSelected ? 'text-white/75' : 'text-[#69737A]'
                  }`}
                >
                  {count} ref.
                </span>
              </div>

              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 shrink-0 rounded-[2px] object-cover"
                />
              )}

              {isSelected && (
                <motion.span
                  layoutId={`${layoutIdPrefix}-underline`}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-[#B77948]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
