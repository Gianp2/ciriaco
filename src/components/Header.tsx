import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  buildGeneralQuoteMessage,
  buildWhatsAppUrl,
  hasConfiguredWhatsApp,
  siteConfig,
} from '@/src/config/siteConfig';
import { EASE_ARCHITECTURAL } from '@/src/lib/motionPresets';

const navItems = [
  { label: 'Inicio', to: '/', sectionId: null },
  { label: 'Nosotros', to: '/nosotros', sectionId: 'nosotros' },
  { label: 'Productos', to: '/productos', sectionId: null },
  { label: 'Contacto', to: '/contacto', sectionId: 'contacto' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 28);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (mobileMenuOpen) {
      wasOpenRef.current = true;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const focusTimer = window.setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 40);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.clearTimeout(focusTimer);
        document.body.style.overflow = previousOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      menuTriggerRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  const scrollToSectionWithOffset = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return false;
    const headerHeight = window.innerWidth >= 640 ? 64 : 56;
    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, elementPosition - headerHeight),
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
    return true;
  };

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (isHome) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  };

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof navItems)[number]
  ) => {
    if (isHome && item.to === '/') {
      event.preventDefault();
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      return;
    }

    if (isHome && item.sectionId) {
      const scrolled = scrollToSectionWithOffset(item.sectionId);
      if (scrolled) {
        event.preventDefault();
        setMobileMenuOpen(false);
      }
    }
  };

  const handleQuoteClick = () => {
    setMobileMenuOpen(false);
    if (hasConfiguredWhatsApp()) {
      window.open(
        buildWhatsAppUrl(buildGeneralQuoteMessage()),
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    if (isHome) {
      const scrolled = scrollToSectionWithOffset('contacto');
      if (scrolled) return;
    }
    navigate('/contacto');
  };

  return (
    <>
      <header
        className={`${
          isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0'
        } z-40 pt-[env(safe-area-inset-top)] transition-colors duration-250 ease-out ${
          isTransparent
            ? 'border-b border-transparent bg-transparent text-white'
            : 'border-b border-[#252B30]/10 bg-[#FFFFFF]/96 text-[#252B30] shadow-[0_1px_12px_rgba(37,43,48,0.06)] backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:gap-8 sm:px-6 lg:px-8">
          {/* Zona 1: Marca */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex min-w-0 items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:rounded-sm"
          >
            <picture className="shrink-0">
              <source srcSet={siteConfig.logoWebpPath} type="image/webp" />
              <img
                src={siteConfig.logoPath}
                alt="Logo Ciriaco Materiales"
                width={32}
                height={32}
                decoding="async"
                className={`h-7 w-7 shrink-0 object-contain transition-transform duration-200 hover:scale-[1.03] sm:h-8 sm:w-8 ${
                  isTransparent ? 'drop-shadow-[0_0_2px_rgba(255,255,255,0.75)]' : ''
                }`}
              />
            </picture>
            <span
              className={`text-[13px] font-bold tracking-[-0.015em] transition-colors duration-250 sm:text-[15px] ${
                isTransparent ? 'text-white' : 'text-[#252B30]'
              }`}
            >
              {siteConfig.brandName}
            </span>
          </Link>

          {/* Zona 2: Navegación principal (desktop) */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-7"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={(e) => handleNavClick(e, item)}
                className={({ isActive }) =>
                  `group relative py-1.5 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isTransparent
                      ? isActive
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                      : isActive
                        ? 'text-[#252B30]'
                        : 'text-[#69737A] hover:text-[#252B30]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive ? (
                      <motion.span
                        layoutId="header-active-indicator"
                        transition={{ duration: 0.22, ease: EASE_ARCHITECTURAL }}
                        className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-[#B77948]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-[1px] h-[1.5px] origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100 ${
                          isTransparent ? 'bg-white/60' : 'bg-[#252B30]/35'
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zona 3: Acción primaria + menú móvil */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleQuoteClick}
              className={`group hidden md:inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-sm px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 active:scale-[0.98] ${
                isTransparent
                  ? 'border border-white/30 bg-white/10 text-white backdrop-blur-xs hover:border-white hover:bg-white hover:text-[#252B30]'
                  : 'bg-[#252B30] text-white hover:bg-[#B77948]'
              }`}
            >
              <span>Solicitar presupuesto</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>

            <button
              ref={menuTriggerRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú de navegación"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-sm transition-colors active:scale-95 md:hidden ${
                isTransparent
                  ? 'text-white hover:bg-white/15'
                  : 'text-[#252B30] hover:bg-[#252B30]/6'
              }`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú lateral móvil */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed inset-0 z-50 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#161A1D]/55 backdrop-blur-[2px]"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.26, ease: EASE_ARCHITECTURAL }}
              className="fixed inset-y-0 right-0 flex h-[100dvh] w-full max-w-[min(86vw,300px)] flex-col border-l border-[#252B30]/12 bg-[#FFFFFF] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#252B30]/10 px-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-2">
                  <picture className="shrink-0">
                    <source srcSet={siteConfig.logoWebpPath} type="image/webp" />
                    <img
                      src={siteConfig.logoPath}
                      alt="Logo Ciriaco Materiales"
                      width={28}
                      height={28}
                      decoding="async"
                      className="h-7 w-7 object-contain shrink-0"
                    />
                  </picture>
                  <span className="truncate text-xs font-bold tracking-tight text-[#252B30]">
                    {siteConfig.brandName}
                  </span>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Cerrar menú"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-[#252B30] transition-colors hover:bg-[#F5F4F0] active:scale-95"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <nav
                aria-label="Navegación móvil"
                className="flex flex-1 flex-col justify-center divide-y divide-[#252B30]/8 overflow-y-auto px-5 py-2"
              >
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.to}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: shouldReduceMotion ? 0 : 0.05 + idx * 0.04,
                      ease: EASE_ARCHITECTURAL,
                    }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={(e) => {
                        handleNavClick(e, item);
                        setMobileMenuOpen(false);
                      }}
                      className={({ isActive }) =>
                        `flex min-h-[48px] items-center justify-between text-[15px] font-medium transition-colors active:opacity-80 ${
                          isActive
                            ? 'text-[#B77948] font-semibold'
                            : 'text-[#252B30] hover:text-[#B77948]'
                        }`
                      }
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-[11px] text-[#69737A] tabular-nums">
                        0{idx + 1}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="shrink-0 border-t border-[#252B30]/10 bg-[#F5F4F0]/60 p-4 sm:p-5">
                <button
                  type="button"
                  onClick={handleQuoteClick}
                  className="group flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-[#B77948] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#9F6639] active:scale-[0.98]"
                >
                  <span>Solicitar presupuesto</span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
