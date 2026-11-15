import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Category, CategorySlug, Product } from '@/src/types/catalog';
import { catalogService } from '@/src/services/catalogService';
import {
  buildGeneralQuoteMessage,
  buildWhatsAppUrl,
  hasConfiguredWhatsApp,
} from '@/src/config/siteConfig';
import { CategoryCompactBar } from '@/src/components/CategoryCompactBar';
import { ProductCard } from '@/src/components/ProductCard';
import { BrandsSection } from '@/src/components/BrandsSection';
import { AboutSection } from '@/src/components/AboutSection';
import { ContactSection } from '@/src/components/ContactSection';

interface HeroSlide {
  src: string;
  webpSrcSet: string;
  alt: string;
  objectPositionClass: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/images/hero-1.jpg',
    webpSrcSet: '/images/hero-1-768.webp 768w, /images/hero-1-1376.webp 1376w',
    alt: 'Bloques de hormigón y adoquines premoldeados dispuestos en playa de materiales',
    objectPositionClass: 'object-[60%_65%] sm:object-center',
  },
  {
    src: '/images/hero-2.jpg',
    webpSrcSet: '/images/hero-2-768.webp 768w, /images/hero-2-1376.webp 1376w',
    alt: 'Pavimento articulado de adoquines de hormigón en explanada arquitectónica',
    objectPositionClass: 'object-center',
  },
  {
    src: '/images/hero-3.jpg',
    webpSrcSet: '/images/hero-3-768.webp 768w, /images/hero-3-1376.webp 1376w',
    alt: 'Mampostería de bloques de hormigón vistos y estructura de vigas en obra',
    objectPositionClass: 'object-center',
  },
  {
    src: '/images/hero-4.jpg',
    webpSrcSet: '/images/hero-4-768.webp 768w, /images/hero-4-1376.webp 1376w',
    alt: 'Premoldeados de hormigón, losas, columnas y bloques estibados en obra',
    objectPositionClass: 'object-[55%_55%] sm:object-center',
  },
];

const SLIDE_INTERVAL_MS = 5500;
const CROSSFADE_DURATION_S = 1;

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all');
  const [slideState, setSlideState] = useState<{ active: number; prev: number | null }>({
    active: 0,
    prev: null,
  });
  const [failedSlides, setFailedSlides] = useState<Record<number, boolean>>({});
  const loadedSlidesRef = useRef<Record<number, boolean>>({ 0: true });
  const shouldReduceMotion = useReducedMotion();
  const isTabVisibleRef = useRef(true);

  const activeSlideIndex = slideState.active;
  const previousSlideIndex = slideState.prev;

  useEffect(() => {
    let active = true;
    Promise.all([catalogService.getCategories(), catalogService.getProducts()]).then(
      ([cats, prods]) => {
        if (!active) return;
        setCategories(cats);
        setProducts(prods);
      }
    );
    return () => {
      active = false;
    };
  }, []);

  // Precargar la siguiente diapositiva en segundo plano (sin competir con la carga inicial de la 1.ª imagen)
  useEffect(() => {
    const nextIndex = (activeSlideIndex + 1) % HERO_SLIDES.length;
    if (loadedSlidesRef.current[nextIndex]) return;

    let cancelled = false;
    const delayMs = activeSlideIndex === 0 ? 700 : 0;

    const timerId = window.setTimeout(() => {
      if (cancelled) return;
      const slide = HERO_SLIDES[nextIndex];
      const img = new Image();
      img.sizes = '100vw';
      img.srcset = slide.webpSrcSet;
      img.src = slide.src;

      const markLoaded = () => {
        if (!cancelled) {
          loadedSlidesRef.current[nextIndex] = true;
        }
      };

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(markLoaded, markLoaded);
        } else {
          markLoaded();
        }
      };
      img.onerror = () => {
        if (!cancelled) {
          loadedSlidesRef.current[nextIndex] = true;
          setFailedSlides((prev) => ({ ...prev, [nextIndex]: true }));
        }
      };
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [activeSlideIndex]);

  // Carrusel automático infinito con pausa cuando la pestaña no está visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intervalId = window.setInterval(() => {
      if (!isTabVisibleRef.current) return;

      setSlideState((current) => {
        const next = (current.active + 1) % HERO_SLIDES.length;
        if (!loadedSlidesRef.current[next]) return current;
        return { active: next, prev: current.active };
      });
    }, SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const featuredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      const seen = new Set<CategorySlug>();
      const picks: Product[] = [];
      for (const product of products) {
        if (!seen.has(product.categoryId)) {
          seen.add(product.categoryId);
          picks.push(product);
        }
      }
      return picks.slice(0, 8);
    }
    return products.filter((p) => p.categoryId === selectedCategory).slice(0, 8);
  }, [products, selectedCategory]);

  const scrollToTarget = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const headerHeight = window.innerWidth >= 640 ? 64 : 56;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  const handleQuoteAction = () => {
    if (hasConfiguredWhatsApp()) {
      window.open(
        buildWhatsAppUrl(buildGeneralQuoteMessage()),
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }
    scrollToTarget('contacto');
  };

  const catalogTargetUrl =
    selectedCategory === 'all'
      ? '/productos'
      : `/productos?categoria=${selectedCategory}`;

  const isFirstMountSlide = previousSlideIndex === null && activeSlideIndex === 0;

  return (
    <div>
      {/* 1. Hero Inmersivo Arquitectónico */}
      <section className="relative flex min-h-[100svh] w-full flex-col justify-between bg-[#1A1F24] text-white pt-[var(--header-height)]">
        {/* Capa de carrusel de fotografías de fondo */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#1A1F24]">
          {/* Diapositiva anterior fija debajo para evitar parpadeos o fondos negros durante el crossfade */}
          {previousSlideIndex !== null && !failedSlides[previousSlideIndex] && (
            <picture key={`prev-${previousSlideIndex}`}>
              <source
                srcSet={HERO_SLIDES[previousSlideIndex].webpSrcSet}
                sizes="100vw"
                type="image/webp"
              />
              <img
                src={HERO_SLIDES[previousSlideIndex].src}
                alt=""
                aria-hidden="true"
                width={1376}
                height={768}
                decoding="async"
                className={`absolute inset-0 z-0 h-full w-full object-cover ${HERO_SLIDES[previousSlideIndex].objectPositionClass}`}
              />
            </picture>
          )}

          {/* Diapositiva activa con crossfade suave o zoom-out inicial único */}
          {!failedSlides[activeSlideIndex] && (
            <picture key={`active-${activeSlideIndex}`}>
              <source
                srcSet={HERO_SLIDES[activeSlideIndex].webpSrcSet}
                sizes="100vw"
                type="image/webp"
              />
              <motion.img
                src={HERO_SLIDES[activeSlideIndex].src}
                alt={HERO_SLIDES[activeSlideIndex].alt}
                width={1376}
                height={768}
                loading="eager"
                fetchPriority={activeSlideIndex === 0 ? 'high' : 'auto'}
                decoding={activeSlideIndex === 0 ? 'sync' : 'async'}
                onError={() =>
                  setFailedSlides((prev) => ({ ...prev, [activeSlideIndex]: true }))
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, scale: 1 }
                    : isFirstMountSlide
                      ? { opacity: 0.35, scale: 1.06 }
                      : { opacity: 0, scale: 1 }
                }
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : isFirstMountSlide
                      ? { duration: 1.05, ease: [0.16, 1, 0.3, 1] }
                      : { duration: CROSSFADE_DURATION_S, ease: 'easeInOut' }
                }
                className={`absolute inset-0 z-10 h-full w-full object-cover ${HERO_SLIDES[activeSlideIndex].objectPositionClass}`}
              />
            </picture>
          )}

          {/* Scrim superior para garantizar contraste del header transparente */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-[#14181C]/75 via-[#14181C]/35 to-transparent"
          />

          {/* Scrim progresivo inferior y lateral izquierdo para legibilidad WCAG AA */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-20 bg-gradient-to-t from-[#14181C]/92 via-[#14181C]/52 to-transparent lg:bg-[linear-gradient(90deg,rgba(20,24,28,0.84)_0%,rgba(20,24,28,0.52)_46%,rgba(20,24,28,0.16)_100%)]"
          />
          <div
            aria-hidden="true"
            className="hidden lg:block absolute inset-x-0 bottom-0 z-20 h-64 bg-gradient-to-t from-[#14181C]/88 via-[#14181C]/38 to-transparent"
          />
        </div>

        {/* Espaciador superior flexible que respeta pantallas de poca altura */}
        <div className="relative z-30 min-h-[2rem] flex-1 sm:min-h-[4rem]" />

        {/* Contenido principal anclado en zona inferior (completamente estático ante cambios de diapositiva) */}
        <div className="relative z-30 mx-auto w-full max-w-7xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-10 lg:px-8 lg:pb-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {/* Etiqueta pequeña arquitectónica */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] text-white/90 uppercase sm:text-xs"
              >
                <span aria-hidden="true" className="h-[2px] w-6 bg-[#B77948]" />
                <span>CIRIACO MATERIALES</span>
              </motion.div>

              {/* Título principal */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3.5 max-w-[16ch] text-[clamp(2rem,4.8vw,4.1rem)] font-bold leading-[1.04] tracking-[-0.03em] text-white text-balance sm:mt-4 sm:max-w-[18ch]"
              >
                Materiales para construir lo que viene.
              </motion.h1>

              {/* Descripción breve */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.44, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 max-w-[38ch] text-sm leading-relaxed text-white/85 sm:mt-4 sm:text-base lg:text-lg"
              >
                Bloques, adoquines y premoldeados para cada proyecto.
              </motion.p>

              {/* Dos acciones principales jerarquizadas */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3"
              >
                <Link
                  to="/productos"
                  className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#B77948] px-5 py-2.5 text-[13px] font-semibold text-white whitespace-nowrap transition-all duration-150 hover:bg-[#9F6639] active:scale-[0.98] sm:px-6 sm:text-sm"
                >
                  <span>Explorar productos</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>

                <button
                  type="button"
                  onClick={handleQuoteAction}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-white/30 bg-white/10 px-4 py-2.5 text-[13px] font-medium text-white whitespace-nowrap backdrop-blur-xs transition-all duration-150 hover:border-white hover:bg-white hover:text-[#252B30] active:scale-[0.98] sm:px-5 sm:text-sm"
                >
                  Solicitar presupuesto
                </button>
              </motion.div>
            </div>

            {/* Indicador discreto para continuar hacia categorías */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.52 }}
              className="flex items-center justify-between border-t border-white/15 pt-4 lg:border-t-0 lg:pt-0"
            >
              <button
                type="button"
                onClick={() => scrollToTarget('categorias-inicio')}
                className="group inline-flex min-h-[40px] items-center gap-2 text-xs font-medium text-white/80 transition-colors hover:text-white active:scale-[0.98]"
              >
                <span>Ver líneas de producto</span>
                <ChevronDown
                  className="h-4 w-4 text-[#B77948] transition-transform duration-200 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Sobre la empresa */}
      <AboutSection />

      {/* 3. Catálogo / Productos destacados */}
      <section
        id="categorias-inicio"
        className="border-b border-[#252B30]/10 bg-[#FFFFFF] py-10 sm:py-14 lg:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-[#B77948] uppercase sm:text-xs">
                Catálogo por línea
              </p>
              <h2 className="mt-1.5 text-[clamp(1.35rem,2.4vw,2rem)] font-bold tracking-tight text-[#252B30] text-balance">
                Explorá por categoría
              </h2>
            </div>

            <Link
              to={catalogTargetUrl}
              className="group inline-flex min-h-[36px] items-center gap-1.5 text-xs font-semibold text-[#252B30] whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#B77948] sm:text-sm"
            >
              <span>
                {selectedCategory === 'all'
                  ? `Ver catálogo completo (${products.length || 38})`
                  : 'Ver categoría completa'}
              </span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          {/* Selector compacto de categorías */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 sm:mt-6"
          >
            <CategoryCompactBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              totalCount={products.length}
              layoutIdPrefix="home-cat"
            />
          </motion.div>

          {/* Productos destacados */}
          <motion.div
            key={selectedCategory}
            initial={shouldReduceMotion ? false : { opacity: 0.55, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="catalog-grid mt-6 sm:mt-8"
          >
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.36,
                  delay: shouldReduceMotion ? 0 : Math.min(idx * 0.035, 0.24),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.42, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex justify-center sm:mt-9"
          >
            <Link
              to={catalogTargetUrl}
              className="group inline-flex min-h-[42px] items-center justify-center gap-2 rounded-sm border border-[#252B30]/18 bg-[#F5F4F0]/70 px-5 py-2.5 text-xs font-semibold text-[#252B30] transition-all duration-150 hover:border-[#B77948] hover:bg-[#FFFFFF] hover:text-[#B77948] active:scale-[0.98] sm:text-sm"
            >
              <span>
                {selectedCategory === 'all'
                  ? `Abrir catálogo completo (${products.length || 38} referencias)`
                  : 'Ver todos en esta categoría'}
              </span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. Marcas con las que trabajamos */}
      <BrandsSection />

      {/* 5. Contacto y Google Maps */}
      <ContactSection />
    </div>
  );
}
