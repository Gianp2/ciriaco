import { motion } from 'motion/react';
import { Category, CategorySlug } from '@/src/types/catalog';
import { getProductCountByCategory } from '@/src/services/catalogService';

interface CatalogCategoryFilterProps {
  categories: Category[];
  selectedCategory: CategorySlug | 'all';
  onSelect: (categoryId: CategorySlug | 'all') => void;
  totalCount: number;
}

export function CatalogCategoryFilter({
  categories,
  selectedCategory,
  onSelect,
  totalCount,
}: CatalogCategoryFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="w-full min-w-0"
    >
      <div
        role="tablist"
        aria-label="Filtrar por categoría"
        className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-md border border-[#252B30]/10 bg-[#F5F4F0]/90 p-1 sm:flex-wrap sm:overflow-visible"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === 'all'}
          onClick={() => onSelect('all')}
          className={`relative inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-[4px] px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150 active:scale-[0.98] focus-visible:z-10 ${
            selectedCategory === 'all'
              ? 'text-white'
              : 'text-[#69737A] hover:bg-white/65 hover:text-[#252B30]'
          }`}
        >
          {selectedCategory === 'all' && (
            <motion.span
              layoutId="catalog-category-pill"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-[4px] bg-[#252B30] shadow-[0_1px_2px_rgba(37,43,48,0.16)]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-2.5 bottom-0 h-[2px] bg-[#B77948]"
              />
            </motion.span>
          )}
          <span className="relative z-10">Todos</span>
          <span
            className={`relative z-10 font-mono text-[11px] font-medium tabular-nums transition-colors ${
              selectedCategory === 'all' ? 'text-white/75' : 'text-[#69737A]/80'
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
              className={`relative inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-[4px] px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150 active:scale-[0.98] focus-visible:z-10 ${
                isSelected
                  ? 'text-white'
                  : 'text-[#69737A] hover:bg-white/65 hover:text-[#252B30]'
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="catalog-category-pill"
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-[4px] bg-[#252B30] shadow-[0_1px_2px_rgba(37,43,48,0.16)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2.5 bottom-0 h-[2px] bg-[#B77948]"
                  />
                </motion.span>
              )}

              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="relative z-10 h-4 w-4 shrink-0 rounded-[2px] object-cover"
                />
              )}

              <span className="relative z-10">{category.name}</span>

              <span
                className={`relative z-10 font-mono text-[11px] font-medium tabular-nums transition-colors ${
                  isSelected ? 'text-white/75' : 'text-[#69737A]/80'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
