import { useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { QuoteDrawer } from '@/src/components/QuoteDrawer';
import { QuoteProvider } from '@/src/context/QuoteContext';
import { ROUTE_TRANSITION } from '@/src/lib/motionPresets';
import { HomePage } from '@/src/pages/HomePage';
import { CatalogPage } from '@/src/pages/CatalogPage';
import { ProductDetailPage } from '@/src/pages/ProductDetailPage';
import { AboutPage } from '@/src/pages/AboutPage';
import { ContactPage } from '@/src/pages/ContactPage';
import { NotFoundPage } from '@/src/pages/NotFoundPage';

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (pathname === '/') {
      document.title = 'Ciriaco Materiales — Materiales para la construcción';
    } else if (pathname === '/productos') {
      document.title = 'Catálogo de productos — Ciriaco Materiales';
    } else if (pathname === '/nosotros') {
      document.title = 'Nosotros — Ciriaco Materiales';
    } else if (pathname === '/contacto') {
      document.title = 'Contacto — Ciriaco Materiales';
    }
  }, [pathname]);

  useEffect(() => {
    const prevPath = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    if (hash) {
      const targetId = hash.slice(1);
      const timerId = window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (!el) return;
        const headerHeight = window.innerWidth >= 640 ? 64 : 56;
        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }, 60);
      return () => window.clearTimeout(timerId);
    }

    // Al regresar desde una ficha de producto al catálogo, CatalogPage restaura su posición anterior
    if (pathname === '/productos' && prevPath.startsWith('/productos/')) {
      return;
    }

    // Evitar salto al cambiar filtros/query params dentro de la misma ruta
    if (pathname === prevPath) {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const isInitialRenderRef = useRef(true);

  useEffect(() => {
    isInitialRenderRef.current = false;
  }, []);

  const skipEnterAnimation = shouldReduceMotion || isInitialRenderRef.current;

  return (
    <motion.div
      key={location.pathname}
      initial={skipEnterAnimation ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : ROUTE_TRANSITION}
    >
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<CatalogPage />} />
        <Route path="/productos/:codigo" element={<ProductDetailPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </motion.div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <QuoteProvider>
        <BrowserRouter>
          <RouteEffects />
          <div className="flex min-h-[100dvh] flex-col bg-[#F5F4F0] text-[#252B30]">
            <Header />
            <main className="flex-1">
              <AnimatedRoutes />
            </main>
            <Footer />
            <QuoteDrawer />
          </div>
        </BrowserRouter>
      </QuoteProvider>
    </MotionConfig>
  );
}
