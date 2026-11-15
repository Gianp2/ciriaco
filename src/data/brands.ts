export interface BrandPartner {
  id: string;
  name: string;
  logoPath: string | null;
  officialUrl?: string;
  alt: string;
  isDemo?: boolean;
  /** Clases de tamaño visual por marca para equilibrar proporciones dispares sin deformar el logo */
  logoSizeClass?: string;
}

/**
 * Listado temporal de marcas de demostración para validar el carrusel infinito.
 * IMPORTANTE: Son únicamente datos de prueba; no representan proveedores ni
 * relaciones comerciales confirmadas de CIRIACO MATERIALES.
 * Antes de publicar definitivamente, reemplazar por marcas reales con sus
 * logotipos oficiales (SVG o PNG/WebP transparente) o vaciar el arreglo.
 */
export const brandsData: BrandPartner[] = [
  {
    id: 'demo-holcim',
    name: 'Holcim',
    logoPath: '/brands/holcim.svg',
    alt: 'Holcim (marca de demostración)',
    isDemo: true,
    logoSizeClass:
      'max-h-7 w-auto max-w-[122px] sm:max-h-8 sm:max-w-[140px] lg:max-h-[36px] lg:max-w-[152px]',
  },
  {
    id: 'demo-loma-negra',
    name: 'Loma Negra',
    logoPath: '/brands/loma-negra.png',
    alt: 'Loma Negra (marca de demostración)',
    isDemo: true,
    logoSizeClass:
      'max-h-9 w-auto max-w-[116px] sm:max-h-10 sm:max-w-[132px] lg:max-h-[46px] lg:max-w-[146px]',
  },
  {
    id: 'demo-weber',
    name: 'Weber',
    logoPath: '/brands/weber.png',
    alt: 'Weber Saint-Gobain (marca de demostración)',
    isDemo: true,
    // El archivo oficial 1:1 incluye aire transparente superior/inferior; se escala el lienzo sin recortar el asset
    logoSizeClass:
      'h-[102px] w-[102px] max-w-none shrink-0 sm:h-[120px] sm:w-[120px] lg:h-[136px] lg:w-[136px]',
  },
  {
    id: 'demo-cerro-negro',
    name: 'Cerro Negro',
    logoPath: '/brands/cerro-negro.png',
    alt: 'Cerro Negro (marca de demostración)',
    isDemo: true,
    logoSizeClass:
      'h-auto max-h-5 w-full max-w-[118px] sm:max-h-6 sm:max-w-[140px] lg:max-w-[158px]',
  },
  {
    id: 'demo-acindar',
    name: 'Acindar',
    logoPath: '/brands/acindar.png',
    alt: 'ArcelorMittal Acindar (marca de demostración)',
    isDemo: true,
    logoSizeClass:
      'h-auto max-h-5 w-full max-w-[126px] sm:max-h-6 sm:max-w-[150px] lg:max-w-[168px]',
  },
  {
    id: 'demo-sika',
    name: 'Sika',
    logoPath: '/brands/sika.png',
    alt: 'Sika (marca de demostración)',
    isDemo: true,
    logoSizeClass:
      'max-h-10 w-auto max-w-[82px] sm:max-h-11 sm:max-w-[92px] lg:max-h-12 lg:max-w-[100px]',
  },
];
