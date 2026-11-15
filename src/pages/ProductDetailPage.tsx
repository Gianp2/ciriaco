import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  Grid3X3,
  Layers,
  Plus,
  Ruler,
  Scale,
  Share2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '@/src/types/catalog';
import { catalogService, getCategoryNameById } from '@/src/services/catalogService';
import { buildProductQuoteMessage, buildWhatsAppUrl } from '@/src/config/siteConfig';
import { ProductVisual } from '@/src/components/ProductVisual';
import { ProductCard } from '@/src/components/ProductCard';
import { WhatsAppIcon } from '@/src/components/BrandIcons';
import { useQuote } from '@/src/context/QuoteContext';

interface LocationState {
  fromCatalog?: string;
}

export function ProductDetailPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [prevProduct, setPrevProduct] = useState<Product | null>(null);
  const [nextProduct, setNextProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [sharedLink, setSharedLink] = useState(false);

  const { addItem, hasItem, openDrawer } = useQuote();

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setCopiedCode(false);
    setSharedLink(false);

    const decodedCode = codigo ? decodeURIComponent(codigo) : '';
    catalogService.getProductByCode(decodedCode).then(async (found) => {
      if (!active) return;
      setProduct(found);

      if (found) {
        const sameCategory = await catalogService.getProducts({
          categoryId: found.categoryId,
        });
        if (!active) return;

        const currentIndex = sameCategory.findIndex((item) => item.code === found.code);
        setPrevProduct(currentIndex > 0 ? sameCategory[currentIndex - 1] : null);
        setNextProduct(
          currentIndex >= 0 && currentIndex < sameCategory.length - 1
            ? sameCategory[currentIndex + 1]
            : null
        );
        setRelatedProducts(
          sameCategory.filter((item) => item.code !== found.code).slice(0, 4)
        );
      } else {
        setPrevProduct(null);
        setNextProduct(null);
        setRelatedProducts([]);
      }

      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [codigo]);

  useEffect(() => {
    if (product) {
      document.title = `${product.code} · ${product.name} — Ciriaco Materiales`;
    }
  }, [product]);

  const handleCopyCode = async () => {
    if (!product) return;
    try {
      await navigator.clipboard.writeText(product.code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      // Fallback silencioso
    }
  };

  const handleShareProduct = async () => {
    if (!product) return;
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.code} — ${product.name}`,
          text: `${product.name} (${product.code}) en Ciriaco Materiales`,
          url: shareUrl,
        });
        return;
      } catch {
        // Si el usuario cancela o falla Share, intentamos copiar enlace
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setSharedLink(true);
      window.setTimeout(() => setSharedLink(false), 1800);
    } catch {
      // Fallback silencioso
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-80 animate-pulse rounded-sm border border-[#252B30]/10 bg-[#FFFFFF]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[#252B30]">Producto no encontrado</h1>
        <p className="mt-3 text-sm text-[#69737A]">
          La referencia solicitada no se encuentra disponible en el catálogo actual.
        </p>
        <Link
          to="/productos"
          className="mt-6 inline-flex min-h-[42px] items-center gap-2 rounded-sm bg-[#252B30] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B77948]"
        >
          <ArrowLeft strokeWidth={1.7} className="h-4 w-4" aria-hidden="true" />
          <span>Volver al catálogo</span>
        </Link>
      </div>
    );
  }

  const categoryName = getCategoryNameById(product.categoryId);
  const backToCatalogHref = state?.fromCatalog ?? `/productos?categoria=${product.categoryId}`;
  const whatsappHref = buildWhatsAppUrl(
    buildProductQuoteMessage(product.code, product.name)
  );
  const inQuoteList = hasItem(product.code);

  const specs = [
    {
      label: 'Dimensiones',
      value: product.dimensions ?? 'A confirmar según ficha',
      Icon: Ruler,
    },
    {
      label: 'Peso por unidad',
      value: product.weightKg !== null ? `${product.weightKg} kg` : 'A confirmar según ficha',
      Icon: Scale,
    },
    {
      label: 'Unidades por pallet',
      value:
        product.unitsPerPallet !== null
          ? `${product.unitsPerPallet} unidades`
          : 'A confirmar según ficha',
      Icon: Layers,
    },
    {
      label: 'Rendimiento (m² / ml)',
      value: product.yieldPerSqm ?? 'Según aplicación / a confirmar',
      Icon: Grid3X3,
    },
  ];

  return (
    <div className="bg-[#F5F4F0] pb-12 sm:pb-16">
      {/* Barra superior con retorno, breadcrumb y navegación entre piezas */}
      <div className="border-b border-[#252B30]/10 bg-[#FFFFFF]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to={backToCatalogHref}
            className="group inline-flex min-h-[36px] items-center gap-1.5 text-xs font-semibold text-[#252B30] whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#B77948] active:scale-[0.98]"
          >
            <ArrowLeft
              strokeWidth={1.7}
              className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            <span>Volver al catálogo</span>
          </Link>

          <nav
            aria-label="Ruta del producto"
            className="no-scrollbar hidden md:flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs text-[#69737A]"
          >
            <Link to="/productos" className="transition-colors hover:text-[#252B30]">
              Productos
            </Link>
            <ChevronRight strokeWidth={1.6} className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <Link
              to={`/productos?categoria=${product.categoryId}`}
              className="transition-colors hover:text-[#252B30]"
            >
              {categoryName}
            </Link>
            <ChevronRight strokeWidth={1.6} className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="font-mono font-medium text-[#252B30]">{product.code}</span>
          </nav>

          {/* Navegación rápida anterior / siguiente dentro de la línea */}
          <div className="flex items-center gap-1.5 shrink-0">
            {prevProduct ? (
              <Link
                to={`/productos/${encodeURIComponent(prevProduct.code)}`}
                state={state}
                title={`Anterior: ${prevProduct.code}`}
                className="group inline-flex min-h-[34px] items-center gap-1 rounded-sm border border-[#252B30]/12 px-2.5 py-1 text-xs font-medium text-[#252B30] transition-colors hover:border-[#252B30]/30 hover:bg-[#F5F4F0] active:scale-[0.97]"
              >
                <ChevronLeft
                  strokeWidth={1.7}
                  className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline font-mono">{prevProduct.code}</span>
              </Link>
            ) : (
              <span className="inline-flex min-h-[34px] items-center rounded-sm border border-[#252B30]/8 px-2.5 py-1 text-xs text-[#69737A]/40">
                <ChevronLeft strokeWidth={1.7} className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            )}

            {nextProduct ? (
              <Link
                to={`/productos/${encodeURIComponent(nextProduct.code)}`}
                state={state}
                title={`Siguiente: ${nextProduct.code}`}
                className="group inline-flex min-h-[34px] items-center gap-1 rounded-sm border border-[#252B30]/12 px-2.5 py-1 text-xs font-medium text-[#252B30] transition-colors hover:border-[#252B30]/30 hover:bg-[#F5F4F0] active:scale-[0.97]"
              >
                <span className="hidden sm:inline font-mono">{nextProduct.code}</span>
                <ChevronRight
                  strokeWidth={1.7}
                  className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <span className="inline-flex min-h-[34px] items-center rounded-sm border border-[#252B30]/8 px-2.5 py-1 text-xs text-[#69737A]/40">
                <ChevronRight strokeWidth={1.7} className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ficha principal */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-10"
        >
          {/* Fotografía / Esquema */}
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-sm border border-[#252B30]/12 bg-[#FFFFFF]">
              <ProductVisual
                code={product.code}
                name={product.name}
                imageUrl={product.imageUrl}
                shapeVariant={product.shapeVariant}
                className="h-full w-full"
              />
            </div>
            {!product.imageUrl && (
              <p className="mt-2 text-[11px] leading-relaxed text-[#69737A]">
                Esquema de referencia tipológica. La fotografía real se incorporará al cargar la ficha del catálogo.
              </p>
            )}
          </div>

          {/* Bloques de información */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            {/* Bloque identidad y descripción */}
            <div className="rounded-sm border border-[#252B30]/12 bg-[#FFFFFF] p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-[#69737A]">
                  <span>{categoryName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono font-medium text-[#252B30]">{product.code}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    aria-label="Copiar código de producto"
                    className="inline-flex min-h-[32px] items-center gap-1.5 rounded-sm border border-[#252B30]/12 px-2.5 py-1 font-mono text-[11px] text-[#69737A] transition-colors hover:border-[#252B30]/30 hover:text-[#252B30] active:scale-[0.97]"
                  >
                    {copiedCode ? (
                      <>
                        <Check strokeWidth={1.7} className="h-3 w-3 text-[#B77948]" aria-hidden="true" />
                        <span className="text-[#252B30]">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy strokeWidth={1.65} className="h-3 w-3" aria-hidden="true" />
                        <span>Copiar código</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShareProduct}
                    aria-label="Compartir ficha del producto"
                    className="inline-flex min-h-[32px] items-center gap-1.5 rounded-sm border border-[#252B30]/12 px-2.5 py-1 text-[11px] text-[#69737A] transition-colors hover:border-[#252B30]/30 hover:text-[#252B30] active:scale-[0.97]"
                  >
                    {sharedLink ? (
                      <>
                        <Check strokeWidth={1.7} className="h-3 w-3 text-[#B77948]" aria-hidden="true" />
                        <span className="text-[#252B30]">Enlace copiado</span>
                      </>
                    ) : (
                      <>
                        <Share2 strokeWidth={1.65} className="h-3 w-3" aria-hidden="true" />
                        <span className="hidden sm:inline">Compartir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <h1 className="mt-2.5 text-[clamp(1.35rem,2.5vw,2rem)] font-bold tracking-tight text-[#252B30] text-balance">
                {product.name}
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-[#69737A] sm:text-base">
                {product.description ??
                  'Referencia integrante del catálogo de Ciriaco Materiales. Las especificaciones detalladas se completarán con la transcripción de la ficha técnica oficial.'}
              </p>
            </div>

            {/* Bloque de especificaciones técnicas */}
            <div className="rounded-sm border border-[#252B30]/12 bg-[#FFFFFF] p-4 sm:p-6">
              <h2 className="text-xs font-semibold tracking-wider text-[#252B30] uppercase">
                Especificaciones técnicas
              </h2>

              <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {specs.map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className="rounded-sm border border-[#252B30]/10 bg-[#F5F4F0]/55 px-3.5 py-3"
                  >
                    <dt className="flex items-center gap-1.5 text-[11px] font-medium text-[#69737A]">
                      <Icon strokeWidth={1.6} className="h-3.5 w-3.5 text-[#B77948]" aria-hidden="true" />
                      <span>{label}</span>
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[#252B30] tabular-nums">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-sm bg-[#B77948] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#9F6639] active:scale-[0.98]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>Solicitar cotización por WhatsApp</span>
                </a>

                {inQuoteList ? (
                  <button
                    type="button"
                    onClick={openDrawer}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#252B30] bg-[#252B30] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#252B30]/90 active:scale-[0.98]"
                  >
                    <ClipboardList strokeWidth={1.65} className="h-4 w-4 text-[#B77948]" aria-hidden="true" />
                    <span>Ver en lista</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => addItem(product, 1, 'unidades')}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#252B30]/18 bg-[#FFFFFF] px-4 py-2.5 text-sm font-medium text-[#252B30] transition-colors hover:border-[#B77948] hover:text-[#B77948] active:scale-[0.98]"
                  >
                    <Plus strokeWidth={1.7} className="h-4 w-4" aria-hidden="true" />
                    <span>Agregar a lista</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t border-[#252B30]/10 pt-8 sm:mt-14 sm:pt-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-bold tracking-tight text-[#252B30] sm:text-lg">
                Otras referencias en {categoryName}
              </h2>
              <Link
                to={`/productos?categoria=${product.categoryId}`}
                className="text-xs font-semibold text-[#B77948] whitespace-nowrap hover:underline"
              >
                Ver todas
              </Link>
            </div>

            <div className="catalog-grid mt-5">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} showQuoteAction />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
