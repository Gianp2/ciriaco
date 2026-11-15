import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import {
  buildGeneralQuoteMessage,
  buildWhatsAppUrl,
  getGoogleMapsPlaceUrl,
  siteConfig,
} from '@/src/config/siteConfig';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/src/components/BrandIcons';
import {
  createStaggerContainerVariants,
  fadeUpItemVariants,
  VIEWPORT_ONCE,
} from '@/src/lib/motionPresets';

const footerGridVariants = createStaggerContainerVariants(0.08, 0.03);

export function Footer() {
  const quoteHref = buildWhatsAppUrl(buildGeneralQuoteMessage());
  const mapsUrl = getGoogleMapsPlaceUrl();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#252B30]/15 bg-[#252B30] text-[#FFFFFF]">
      <div className="mx-auto max-w-7xl px-4 pt-9 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-12 lg:px-8">
        {/* Grilla superior de 3 columnas con aparición escalonada sutil */}
        <motion.div
          variants={footerGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-12 md:gap-10"
        >
          {/* Columna 1 — Empresa */}
          <motion.div variants={fadeUpItemVariants} className="sm:col-span-2 md:col-span-5">
            <Link
              to="/"
              className="inline-flex items-center gap-3 transition-opacity duration-150 hover:opacity-90 focus-visible:rounded-sm"
            >
              <picture className="shrink-0">
                <source srcSet={siteConfig.logoWebpPath} type="image/webp" />
                <img
                  src={siteConfig.logoPath}
                  alt="Logo Ciriaco Materiales"
                  width={32}
                  height={32}
                  decoding="async"
                  className="h-8 w-8 shrink-0 object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]"
                />
              </picture>
              <span className="text-sm font-bold tracking-tight text-white">
                {siteConfig.brandName}
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/65 sm:text-[13px]">
              {siteConfig.businessActivity}
            </p>
          </motion.div>

          {/* Columna 2 — Navegación */}
          <motion.div variants={fadeUpItemVariants} className="md:col-span-3">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-white/50 uppercase">
              Navegación
            </p>
            <nav
              aria-label="Navegación pie de página"
              className="mt-3 flex flex-col gap-1"
            >
              {[
                { label: 'Inicio', to: '/' },
                { label: 'Sobre nosotros', to: '/nosotros' },
                { label: 'Productos', to: '/productos' },
                { label: 'Contacto', to: '/contacto' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group relative inline-flex min-h-[36px] w-fit items-center text-[13px] text-white/80 transition-colors duration-150 hover:text-[#B77948]"
                >
                  <span>{link.label}</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1.5 h-[1px] origin-left scale-x-0 bg-[#B77948]/80 transition-transform duration-200 ease-out group-hover:scale-x-100"
                  />
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Columna 3 — Contacto */}
          <motion.div variants={fadeUpItemVariants} className="md:col-span-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-white/50 uppercase">
              Contacto
            </p>
            <div className="mt-3 flex flex-col gap-1">
              <p className="inline-flex min-h-[36px] items-center gap-2.5 text-[13px] text-white/80">
                <MapPin
                  strokeWidth={1.65}
                  className="h-4 w-4 shrink-0 text-[#B77948]"
                  aria-hidden="true"
                />
                <span>{siteConfig.shortAddress}</span>
              </p>

              <a
                href={quoteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[36px] w-fit items-center gap-2.5 text-[13px] text-white/80 transition-colors duration-150 hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#B77948]" />
                <span className="font-mono tabular-nums">{siteConfig.whatsappDisplay}</span>
                <ArrowUpRight
                  strokeWidth={1.7}
                  className="h-3.5 w-3.5 text-white/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#B77948]"
                  aria-hidden="true"
                />
              </a>

              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[36px] w-fit items-center gap-2.5 text-[13px] text-white/80 transition-colors duration-150 hover:text-white"
              >
                <InstagramIcon className="h-4 w-4 shrink-0 text-white/75" />
                <span>Instagram ({siteConfig.instagramHandle})</span>
                <ArrowUpRight
                  strokeWidth={1.7}
                  className="h-3.5 w-3.5 text-white/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                  aria-hidden="true"
                />
              </a>

              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[36px] w-fit items-center gap-2.5 text-[13px] text-white/80 transition-colors duration-150 hover:text-white"
              >
                <FacebookIcon className="h-4 w-4 shrink-0 text-white/75" />
                <span>Facebook ({siteConfig.facebookLabel})</span>
                <ArrowUpRight
                  strokeWidth={1.7}
                  className="h-3.5 w-3.5 text-white/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                  aria-hidden="true"
                />
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[36px] w-fit items-center gap-2.5 text-[13px] text-white/80 transition-colors duration-150 hover:text-white"
              >
                <Navigation
                  strokeWidth={1.65}
                  className="h-4 w-4 shrink-0 text-white/60"
                  aria-hidden="true"
                />
                <span>Ver ubicación en Google Maps</span>
                <ArrowUpRight
                  strokeWidth={1.7}
                  className="h-3.5 w-3.5 text-white/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#B77948]"
                  aria-hidden="true"
                />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Franja inferior centrada */}
        <div className="mt-8 border-t border-white/10 pt-5 flex items-center justify-center text-center text-xs text-white/55">
          <p className="tabular-nums">
            © {currentYear} Ciriaco Materiales. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
