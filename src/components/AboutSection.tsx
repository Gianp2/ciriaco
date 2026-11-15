import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { siteConfig } from '@/src/config/siteConfig';
import {
  createStaggerContainerVariants,
  EASE_ARCHITECTURAL,
  fadeUpItemVariants,
  VIEWPORT_ONCE,
} from '@/src/lib/motionPresets';

const commercialFocusLines = [
  {
    index: '01',
    title: 'Mampostería y estructura',
    detail: 'Bloques para muros, vistos, encadenados y columnas premoldeadas.',
  },
  {
    index: '02',
    title: 'Cubiertas y revestimientos',
    detail: 'Losas, tapas premoldeadas y piezas símil piedra para terminaciones.',
  },
  {
    index: '03',
    title: 'Solados y exteriores',
    detail: 'Adoquines vibroprensados y losetas de hormigón para tránsito y veredas.',
  },
];

const contentContainerVariants = createStaggerContainerVariants(0.08, 0.04);
const focusGridVariants = createStaggerContainerVariants(0.07, 0.06);

export function AboutSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="nosotros"
      className="border-b border-[#252B30]/10 bg-[#F5F4F0] py-11 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-7 lg:grid-cols-12 lg:gap-12">
          {/* Columna visual asimétrica con revelado progresivo */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.58, ease: EASE_ARCHITECTURAL }}
            className="order-2 flex min-w-0 flex-col lg:order-1 lg:col-span-5"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-[#252B30]/12 bg-[#E5E3DC] sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[380px]">
              {!imgError ? (
                <picture className="block h-full w-full">
                  <source
                    srcSet="/images/nosotros-560.webp 560w, /images/nosotros-960.webp 960w"
                    sizes="(max-width: 1023px) 100vw, 42vw"
                    type="image/webp"
                  />
                  <img
                    src="/images/nosotros.jpg"
                    alt="Mampostería de bloques de hormigón y vigas estructurales en obra"
                    width={960}
                    height={717}
                    loading="eager"
                    decoding="async"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out hover:scale-[1.025]"
                  />
                </picture>
              ) : (
                <div className="flex h-full w-full items-center justify-center p-6 text-center">
                  <p className="text-xs text-[#69737A]">
                    Materiales para la construcción · {siteConfig.brandName}
                  </p>
                </div>
              )}

              {/* Marcador territorial discreto */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#161A1D]/82 via-[#161A1D]/35 to-transparent px-4 py-3.5 text-white">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-white/95">
                  <MapPin strokeWidth={1.7} className="h-3.5 w-3.5 text-[#B77948]" aria-hidden="true" />
                  <span>{siteConfig.shortAddress}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Columna de contenido editorial con aparición escalonada */}
          <motion.div
            variants={contentContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="order-1 flex min-w-0 flex-col justify-center lg:order-2 lg:col-span-7"
          >
            <div>
              <motion.div
                variants={fadeUpItemVariants}
                className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] text-[#B77948] uppercase sm:text-xs"
              >
                <span aria-hidden="true" className="h-[2px] w-6 bg-[#B77948]" />
                <span>Sobre la empresa</span>
              </motion.div>

              <motion.h2
                variants={fadeUpItemVariants}
                className="mt-3 text-[clamp(1.5rem,2.7vw,2.35rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#252B30] text-balance"
              >
                Materiales para cada etapa de tu proyecto.
              </motion.h2>

              <motion.div
                variants={fadeUpItemVariants}
                className="mt-4 max-w-[62ch] space-y-3 text-sm leading-relaxed text-[#69737A] sm:text-base"
              >
                <p>
                  En <strong className="font-semibold text-[#252B30]">Ciriaco Materiales</strong>{' '}
                  nos dedicamos a la comercialización de materiales para la construcción,
                  ofreciendo una variedad de bloques de hormigón, adoquines, encadenados,
                  losas y premoldeados para diferentes tipos de proyectos.
                </p>
                <p>
                  Desde nuestro corralón en Cañada de Gómez brindamos acceso a un catálogo
                  organizado por líneas y referencias técnicas, acompañando cada consulta con
                  presupuestos personalizados acordes a las necesidades de tu obra.
                </p>
              </motion.div>

              {/* Líneas comerciales con numeración editorial escalonada */}
              <motion.div
                variants={focusGridVariants}
                className="mt-6 grid grid-cols-1 gap-4 border-t border-[#252B30]/12 pt-5 sm:mt-7 sm:grid-cols-3 sm:gap-5"
              >
                {commercialFocusLines.map((item) => (
                  <motion.div
                    key={item.index}
                    variants={fadeUpItemVariants}
                    className="min-w-0"
                  >
                    <span className="font-mono text-[11px] font-semibold text-[#B77948] tabular-nums">
                      {item.index}.
                    </span>
                    <h3 className="mt-1 text-xs font-semibold tracking-tight text-[#252B30] sm:text-[13px]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#69737A]">
                      {item.detail}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
