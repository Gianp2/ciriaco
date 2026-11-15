import { Clock, ExternalLink, MapPin, Navigation, Phone, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  buildGeneralQuoteMessage,
  buildWhatsAppUrl,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsEmbedSrc,
  getGoogleMapsPlaceUrl,
  siteConfig,
} from '@/src/config/siteConfig';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/src/components/BrandIcons';
import {
  createStaggerContainerVariants,
  EASE_ARCHITECTURAL,
  fadeUpItemVariants,
  VIEWPORT_ONCE,
} from '@/src/lib/motionPresets';

const infoListVariants = createStaggerContainerVariants(0.06, 0.04);

export function ContactSection() {
  const directWhatsAppHref = buildWhatsAppUrl(buildGeneralQuoteMessage());
  const mapEmbedSrc = getGoogleMapsEmbedSrc();
  const directionsUrl = getGoogleMapsDirectionsUrl();
  const placeUrl = getGoogleMapsPlaceUrl();

  return (
    <section
      id="contacto"
      className="bg-[#FFFFFF] py-11 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado con aparición suave */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.48, ease: EASE_ARCHITECTURAL }}
          className="max-w-2xl border-b border-[#252B30]/10 pb-6"
        >
          <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] text-[#B77948] uppercase sm:text-xs">
            <span aria-hidden="true" className="h-[2px] w-6 bg-[#B77948]" />
            <span>Contacto</span>
          </div>
          <h2 className="mt-3 text-[clamp(1.5rem,2.7vw,2.35rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#252B30] text-balance">
            Hablemos de tu próximo proyecto.
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-[#69737A] sm:text-base">
            Consultanos por materiales, disponibilidad y presupuestos. Estamos para
            ayudarte a encontrar lo que necesitás.
          </p>
        </motion.div>

        {/* Dos columnas equilibradas en escritorio / apilado compacto en celulares */}
        <div className="mt-7 grid grid-cols-1 items-stretch gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-8">
          {/* Columna izquierda: Datos comerciales progresivos y acciones */}
          <motion.div
            variants={infoListVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="flex min-w-0 flex-col justify-between gap-4 lg:col-span-5"
          >
            {/* Bloque estructurado de información comercial */}
            <div className="flex-1 divide-y divide-[#252B30]/10 rounded-sm border border-[#252B30]/12 bg-[#F5F4F0]/45 px-4 sm:px-5">
              {/* Ubicación */}
              <motion.div variants={fadeUpItemVariants} className="flex items-start gap-3 py-4">
                <MapPin
                  strokeWidth={1.65}
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#B77948]"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#252B30]">Ubicación</p>
                  <p className="mt-1 text-sm font-medium text-[#252B30]">
                    {siteConfig.addressLine1}
                  </p>
                  <p className="text-xs text-[#69737A] sm:text-[13px]">
                    {siteConfig.addressLine2}.
                  </p>
                </div>
              </motion.div>

              {/* Teléfono y WhatsApp */}
              <motion.div variants={fadeUpItemVariants} className="flex items-start gap-3 py-4">
                <Phone
                  strokeWidth={1.65}
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#B77948]"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#252B30]">
                    Teléfono y WhatsApp
                  </p>
                  <a
                    href={directWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-mono text-sm font-semibold text-[#252B30] tabular-nums transition-colors duration-150 hover:text-[#B77948]"
                  >
                    {siteConfig.whatsappDisplay}
                  </a>
                </div>
              </motion.div>

              {/* Horarios */}
              <motion.div variants={fadeUpItemVariants} className="flex items-start gap-3 py-4">
                <Clock
                  strokeWidth={1.65}
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#B77948]"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#252B30]">Horarios</p>
                  <dl className="mt-1.5 space-y-1 text-xs sm:text-[13px]">
                    {siteConfig.scheduleItems.map((item) => (
                      <div
                        key={item.days}
                        className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5"
                      >
                        <dt className="text-[#69737A]">{item.days}:</dt>
                        <dd
                          className={`font-mono tabular-nums ${
                            item.isClosed
                              ? 'text-[#69737A]'
                              : 'font-medium text-[#252B30]'
                          }`}
                        >
                          {item.hours}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </motion.div>

              {/* Redes sociales */}
              <motion.div variants={fadeUpItemVariants} className="flex items-start gap-3 py-4">
                <Share2
                  strokeWidth={1.65}
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#B77948]"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#252B30]">Redes sociales</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                    <a
                      href={siteConfig.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#252B30] transition-colors duration-150 hover:text-[#B77948]"
                    >
                      <InstagramIcon className="h-3.5 w-3.5 shrink-0 text-[#B77948]" />
                      <span>{siteConfig.instagramHandle}</span>
                    </a>

                    <a
                      href={siteConfig.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#252B30] transition-colors duration-150 hover:text-[#B77948]"
                    >
                      <FacebookIcon className="h-3.5 w-3.5 shrink-0 text-[#B77948]" />
                      <span>Facebook</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Acciones compactas */}
            <motion.div variants={fadeUpItemVariants} className="flex flex-col gap-2.5">
              <a
                href={directWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-[#B77948] px-4 py-2.5 text-xs font-semibold text-white whitespace-nowrap transition-all duration-150 hover:bg-[#9F6639] active:scale-[0.985] sm:text-sm"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                <span>Consultar por WhatsApp</span>
              </a>

              <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-sm border border-[#252B30]/16 bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#252B30] whitespace-nowrap transition-colors duration-150 hover:border-[#252B30] hover:bg-[#F5F4F0]/60 active:scale-[0.985]"
                >
                  <Navigation
                    strokeWidth={1.65}
                    className="h-3.5 w-3.5 shrink-0 text-[#B77948] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span>Cómo llegar</span>
                </a>

                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-sm border border-[#252B30]/16 bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#252B30] whitespace-nowrap transition-colors duration-150 hover:border-[#252B30] hover:bg-[#F5F4F0]/60 active:scale-[0.985]"
                >
                  <InstagramIcon className="h-3.5 w-3.5 shrink-0 text-[#252B30] transition-transform duration-150 group-hover:scale-105" />
                  <span>Instagram</span>
                </a>

                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-sm border border-[#252B30]/16 bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#252B30] whitespace-nowrap transition-colors duration-150 hover:border-[#252B30] hover:bg-[#F5F4F0]/60 active:scale-[0.985]"
                >
                  <FacebookIcon className="h-3.5 w-3.5 shrink-0 text-[#252B30] transition-transform duration-150 group-hover:scale-105" />
                  <span>Facebook</span>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Columna derecha: Revelado discreto del mapa */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.54, delay: 0.08, ease: EASE_ARCHITECTURAL }}
            className="flex min-w-0 flex-col overflow-hidden rounded-sm border border-[#252B30]/12 bg-[#F5F4F0]/40 lg:col-span-7"
          >
            {/* Contenedor del mapa con altura controlada en móviles y escritorio */}
            <div className="relative h-[260px] w-full flex-1 bg-[#EAE8E2] sm:h-[300px] lg:min-h-[340px]">
              {mapEmbedSrc ? (
                <iframe
                  title="Ubicación de Ciriaco Materiales — Nicolás Avellaneda 464, Cañada de Gómez"
                  src={mapEmbedSrc}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <MapPin strokeWidth={1.6} className="h-5 w-5 text-[#B77948]" aria-hidden="true" />
                  <p className="mt-2.5 text-sm font-semibold text-[#252B30]">
                    {siteConfig.shortAddress}
                  </p>
                </div>
              )}
            </div>

            {/* Barra inferior integrada con dirección y enlace alternativo a Google Maps */}
            <div className="flex flex-col gap-2.5 border-t border-[#252B30]/10 bg-[#FFFFFF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#252B30]">
                  {siteConfig.brandName}
                </p>
                <p className="truncate text-xs text-[#69737A]">
                  {siteConfig.address}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href={placeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[38px] items-center gap-1.5 rounded-sm border border-[#252B30]/14 px-3 py-1.5 text-xs font-medium text-[#69737A] whitespace-nowrap transition-colors duration-150 hover:border-[#252B30]/35 hover:text-[#252B30] active:scale-[0.98]"
                >
                  <span>Abrir en Google Maps</span>
                  <ExternalLink
                    strokeWidth={1.65}
                    className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[38px] items-center gap-1.5 rounded-sm bg-[#252B30] px-3.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:bg-[#B77948] active:scale-[0.98]"
                >
                  <Navigation
                    strokeWidth={1.65}
                    className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span>Cómo llegar</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
