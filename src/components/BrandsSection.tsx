import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { BrandPartner, brandsData } from '@/src/data/brands';
import { EASE_ARCHITECTURAL, VIEWPORT_ONCE } from '@/src/lib/motionPresets';

interface BrandLogoItemProps {
  brand: BrandPartner;
  isDuplicate?: boolean;
}

function BrandLogoItem({ brand, isDuplicate = false }: BrandLogoItemProps) {
  const [hasError, setHasError] = useState(false);
  const showLogoImage = Boolean(brand.logoPath && !hasError);

  const defaultSizeClass =
    'max-h-9 w-auto max-w-[116px] sm:max-h-10 sm:max-w-[138px] lg:max-h-11 lg:max-w-[156px]';

  const visualContent = showLogoImage ? (
    <img
      src={brand.logoPath!}
      alt={isDuplicate ? '' : brand.alt}
      loading="eager"
      decoding="async"
      onError={() => setHasError(true)}
      className={`object-contain opacity-85 transition-opacity duration-200 group-hover:opacity-100 ${brand.logoSizeClass ?? defaultSizeClass}`}
    />
  ) : (
    <span className="text-center text-[13px] font-bold tracking-[0.12em] text-[#252B30]/75 uppercase whitespace-nowrap transition-colors duration-200 group-hover:text-[#252B30] sm:text-sm lg:text-[15px]">
      {brand.name}
    </span>
  );

  const slotClassName =
    'group flex h-12 w-[132px] shrink-0 items-center justify-center px-1.5 select-none sm:h-14 sm:w-[154px] lg:h-16 lg:w-[174px]';

  if (brand.officialUrl) {
    return (
      <a
        href={brand.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isDuplicate ? -1 : undefined}
        aria-label={isDuplicate ? undefined : `Visitar sitio oficial de ${brand.name}`}
        className={`${slotClassName} rounded-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#B77948]`}
      >
        {visualContent}
      </a>
    );
  }

  return <div className={slotClassName}>{visualContent}</div>;
}

export function BrandsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInViewport, setIsInViewport] = useState(true);

  const activeBrands = useMemo(
    () =>
      brandsData.filter(
        (item) => item.id.trim().length > 0 && item.name.trim().length > 0
      ),
    []
  );

  const hasDemoBrands = useMemo(
    () => activeBrands.some((item) => item.isDemo),
    [activeBrands]
  );

  // Repetir el segmento base lo suficiente para garantizar bucle infinito sin vacíos en 1920px+
  const segmentBrands = useMemo(() => {
    if (activeBrands.length === 0) return [];
    const minItemsPerHalfTrack = 10;
    const repeatCount = Math.max(1, Math.ceil(minItemsPerHalfTrack / activeBrands.length));
    const result: BrandPartner[] = [];
    for (let r = 0; r < repeatCount; r += 1) {
      result.push(...activeBrands);
    }
    return result;
  }, [activeBrands]);

  // Pausar la animación CSS cuando la sección queda fuera del viewport
  useEffect(() => {
    if (activeBrands.length === 0) return;
    const target = sectionRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [activeBrands.length]);

  // Velocidad lenta, constante y elegante proporcional a la cantidad de elementos
  const durationSeconds = Math.max(32, segmentBrands.length * 3.8);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="brands-section-heading"
      className="border-b border-[#252B30]/10 bg-[#FAF9F6] py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado alineado al estilo arquitectónico del sitio */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.44, ease: EASE_ARCHITECTURAL }}
          className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold tracking-[0.14em] text-[#B77948] uppercase sm:text-xs">
              <span aria-hidden="true" className="h-[2px] w-6 bg-[#B77948]" />
              <span>Respaldo comercial</span>
              {hasDemoBrands && (
                <>
                  <span aria-hidden="true" className="text-[#69737A]/60">·</span>
                  <span className="font-normal tracking-normal text-[#69737A] normal-case">
                    Marcas de demostración
                  </span>
                </>
              )}
            </div>
            <h2
              id="brands-section-heading"
              className="mt-2 text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold tracking-tight text-[#252B30] text-balance"
            >
              Marcas con las que trabajamos
            </h2>
          </div>

          <p className="text-xs text-[#69737A] sm:text-sm">
            Calidad y variedad para cada proyecto.
          </p>
        </motion.div>

        {/* Carrusel infinito o estado vacío sin marcas inventadas */}
        {activeBrands.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.45, delay: 0.06, ease: EASE_ARCHITECTURAL }}
            className="mt-6 sm:mt-8"
          >
            <div className="brands-marquee-mask w-full overflow-hidden py-3.5 sm:py-4">
              <div
                data-paused={!isInViewport ? 'true' : 'false'}
                style={{ '--brands-duration': `${durationSeconds}s` } as CSSProperties}
                className="brands-marquee-track"
              >
                {/* Pista accesible principal */}
                <div className="flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8 lg:gap-10 lg:pr-10 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0">
                  {segmentBrands.map((brand, idx) => {
                    const isRepeat = idx >= activeBrands.length;
                    return (
                      <div
                        key={`primary-${brand.id}-${idx}`}
                        aria-hidden={isRepeat || undefined}
                        className={isRepeat ? 'motion-reduce:hidden' : undefined}
                      >
                        <BrandLogoItem brand={brand} isDuplicate={isRepeat} />
                      </div>
                    );
                  })}
                </div>

                {/* Pista duplicada continua (oculta para lectores de pantalla y en reduced-motion) */}
                <div
                  aria-hidden="true"
                  className="brands-marquee-duplicate flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8 lg:gap-10 lg:pr-10"
                >
                  {segmentBrands.map((brand, idx) => (
                    <BrandLogoItem
                      key={`dup-${brand.id}-${idx}`}
                      brand={brand}
                      isDuplicate
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.4, delay: 0.06, ease: EASE_ARCHITECTURAL }}
            className="mt-5 py-5 sm:mt-6 sm:py-6"
          >
            <p className="text-center text-xs leading-relaxed text-[#69737A] sm:text-sm">
              Próximamente incorporaremos los logotipos oficiales de las marcas comerciales
              disponibles en nuestro corralón.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
