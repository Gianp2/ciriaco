import { AboutSection } from '@/src/components/AboutSection';

export function AboutPage() {
  return (
    <div className="bg-[#F5F4F0]">
      <div className="border-b border-[#252B30]/12 bg-[#FFFFFF]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] text-[#B77948] uppercase sm:text-xs">
            <span aria-hidden="true" className="h-[2px] w-6 bg-[#B77948]" />
            <span>Institucional</span>
          </div>
          <h1 className="mt-2.5 text-[clamp(1.5rem,2.8vw,2.25rem)] font-bold tracking-tight text-[#252B30]">
            Sobre nosotros
          </h1>
        </div>
      </div>

      <AboutSection />
    </div>
  );
}
