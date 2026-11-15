import { categoriesData } from '@/src/data/categories';
import { productsData } from '@/src/data/products';
import { CatalogRepository, Category, CategorySlug, Product } from '@/src/types/catalog';

/**
 * Implementación local del repositorio de catálogo.
 * Esta abstracción permite migrar a Firebase Firestore y Firebase Storage
 * en etapas posteriores sin modificar los componentes de interfaz.
 */
class LocalCatalogRepository implements CatalogRepository {
  async getCategories(): Promise<Category[]> {
    return [...categoriesData].sort((a, b) => a.order - b.order);
  }

  async getProducts(filters?: {
    categoryId?: CategorySlug | 'all';
    query?: string;
  }): Promise<Product[]> {
    let items = productsData.filter((product) => product.isActive);

    if (filters?.categoryId && filters.categoryId !== 'all') {
      items = items.filter((product) => product.categoryId === filters.categoryId);
    }

    if (filters?.query && filters.query.trim().length > 0) {
      const normalizedQuery = filters.query.trim().toLowerCase();
      items = items.filter(
        (product) =>
          product.code.toLowerCase().includes(normalizedQuery) ||
          product.name.toLowerCase().includes(normalizedQuery) ||
          (product.description?.toLowerCase().includes(normalizedQuery) ?? false)
      );
    }

    return items;
  }

  async getProductByCode(code: string): Promise<Product | null> {
    const normalized = code.trim().toLowerCase();
    const match = productsData.find(
      (product) => product.code.toLowerCase() === normalized && product.isActive
    );
    return match ?? null;
  }
}

export const catalogService: CatalogRepository = new LocalCatalogRepository();

export function getCategoryNameById(categoryId: CategorySlug): string {
  return categoriesData.find((c) => c.id === categoryId)?.name ?? categoryId;
}

export function getProductCountByCategory(categoryId: CategorySlug): number {
  return productsData.filter((p) => p.isActive && p.categoryId === categoryId).length;
}
