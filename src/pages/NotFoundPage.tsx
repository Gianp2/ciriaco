import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="font-mono text-xs font-semibold tracking-widest text-[#B77948] uppercase">
        Error 404
      </p>
      <h1 className="mt-3 text-[clamp(1.65rem,3vw,2.35rem)] font-bold tracking-tight text-[#252B30] text-balance">
        Página no encontrada
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#69737A] sm:text-base">
        La ruta solicitada no existe o fue reubicada dentro del catálogo.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex min-h-[42px] items-center gap-2 rounded-sm border border-[#252B30]/18 bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#252B30] transition-colors hover:border-[#252B30]/40 sm:text-sm"
        >
          <ArrowLeft strokeWidth={1.7} className="h-4 w-4" aria-hidden="true" />
          <span>Volver al inicio</span>
        </Link>
        <Link
          to="/productos"
          className="inline-flex min-h-[42px] items-center gap-2 rounded-sm bg-[#252B30] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B77948] sm:text-sm"
        >
          <span>Ir al catálogo</span>
          <ArrowRight strokeWidth={1.7} className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
