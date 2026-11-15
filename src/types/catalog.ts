export type CategorySlug =
  | 'muros'
  | 'vistos'
  | 'encadenados'
  | 'losas-y-tapas'
  | 'simil-piedra'
  | 'columnas'
  | 'adoquines'
  | 'losetas';

export type ProductShapeVariant =
  | 'block-hollow-full'
  | 'block-hollow-half'
  | 'block-visible-full'
  | 'block-visible-half'
  | 'channel-u'
  | 'slab'
  | 'cover'
  | 'split-face'
  | 'split-face-corner'
  | 'split-face-half'
  | 'split-face-u'
  | 'split-face-pillar'
  | 'column-square'
  | 'paver-hex'
  | 'paver-unipaver'
  | 'paver-rect'
  | 'tile-square';

export interface Category {
  id: CategorySlug;
  name: string;
  shortDescription: string;
  order: number;
  imageUrl: string | null;
  shapeVariant: ProductShapeVariant;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  categoryId: CategorySlug;
  description: string | null;
  dimensions: string | null;
  weightKg: number | null;
  unitsPerPallet: number | null;
  yieldPerSqm: string | null;
  imageUrl: string | null;
  shapeVariant: ProductShapeVariant;
  isActive: boolean;
}

export type ProductCreateInput = Omit<Product, 'id'>;
export type ProductUpdateInput = Partial<Omit<Product, 'id'>>;

export interface CatalogRepository {
  getCategories(): Promise<Category[]>;
  getProducts(filters?: { categoryId?: CategorySlug | 'all'; query?: string }): Promise<Product[]>;
  getProductByCode(code: string): Promise<Product | null>;
  // Contratos preparados para futura integración con Firebase / Panel Administrador
  createProduct?(input: ProductCreateInput): Promise<Product>;
  updateProduct?(id: string, input: ProductUpdateInput): Promise<Product>;
  deleteProduct?(id: string): Promise<void>;
}
