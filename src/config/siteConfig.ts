export interface BusinessScheduleItem {
  days: string;
  hours: string;
  isClosed?: boolean;
}

export interface SiteConfig {
  brandName: string;
  businessActivity: string;
  logoPath: string;
  logoWebpPath: string;
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
  facebookLabel: string;
  /**
   * Número internacional sin signos ni espacios para enlaces wa.me.
   */
  whatsappPhone: string | null;
  whatsappDisplay: string;
  whatsappBaseUrl: string;
  address: string;
  addressLine1: string;
  addressLine2: string;
  shortAddress: string;
  schedule: string;
  scheduleItems: BusinessScheduleItem[];
  /**
   * URL de inserción personalizada o coordenadas exactas si se desean fijar manualmente.
   * Si son null, se utiliza la dirección comercial confirmada en Google Maps Embed.
   */
  mapEmbedUrl: string | null;
  mapShareUrl: string;
  coordinates: { lat: number; lng: number } | null;
  email: string | null;
}

export const siteConfig: SiteConfig = {
  brandName: 'CIRIACO MATERIALES',
  businessActivity:
    'Corralón de materiales para la construcción. Comercialización de bloques de hormigón, encadenados, losas, adoquines, premoldeados, revestimientos y otros materiales.',
  logoPath: '/images/logo-ciriaco.png',
  logoWebpPath: '/images/logo-ciriaco.webp',
  instagramUrl: 'https://www.instagram.com/ciriacomateriales/',
  instagramHandle: '@ciriacomateriales',
  facebookUrl: 'https://www.facebook.com/share/1CK2bKgMe5/',
  facebookLabel: 'Ciriaco Materiales',
  whatsappPhone: '543471601609',
  whatsappDisplay: '+54 3471 60-1609',
  whatsappBaseUrl: 'https://wa.me/543471601609',
  address: 'Nicolás Avellaneda 464, Cañada de Gómez, Santa Fe, Argentina',
  addressLine1: 'Nicolás Avellaneda 464',
  addressLine2: 'Cañada de Gómez, Santa Fe',
  shortAddress: 'Nicolás Avellaneda 464, Cañada de Gómez',
  schedule: 'Lunes a viernes: 07:00 a 15:00 · Sábados: 07:00 a 12:00 · Domingos: cerrado',
  scheduleItems: [
    { days: 'Lunes a viernes', hours: '07:00 a 15:00' },
    { days: 'Sábados', hours: '07:00 a 12:00' },
    { days: 'Domingos', hours: 'Cerrado', isClosed: true },
  ],
  mapEmbedUrl: null,
  mapShareUrl: 'https://share.google/m5LcKiJgSSn1BKxKX',
  coordinates: null,
  email: null,
};

export function hasConfiguredWhatsApp(): boolean {
  return Boolean(
    siteConfig.whatsappPhone && siteConfig.whatsappPhone.replace(/\D/g, '').length > 0
  );
}

export function buildWhatsAppUrl(message: string): string {
  const encodedText = encodeURIComponent(message);
  if (siteConfig.whatsappPhone) {
    const cleanPhone = siteConfig.whatsappPhone.replace(/\D/g, '');
    if (cleanPhone.length > 0) {
      return `https://wa.me/${cleanPhone}?text=${encodedText}`;
    }
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

export function buildGeneralQuoteMessage(): string {
  return 'Hola, buen día. Quisiera solicitar un presupuesto de materiales de construcción.';
}

export function buildProductQuoteMessage(code: string, name: string): string {
  const normalizedName = name.includes(code) ? name : `${name} (${code})`;
  return `Hola, buen día. Quisiera consultar por ${normalizedName}. ¿Podrían brindarme información sobre disponibilidad y precio?`;
}

export function hasConfirmedLocation(): boolean {
  return Boolean(siteConfig.address || siteConfig.coordinates || siteConfig.mapEmbedUrl);
}

export function getGoogleMapsEmbedSrc(): string | null {
  if (siteConfig.mapEmbedUrl) {
    return siteConfig.mapEmbedUrl;
  }
  if (siteConfig.coordinates) {
    const { lat, lng } = siteConfig.coordinates;
    return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  }
  if (siteConfig.address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(
      `Ciriaco Materiales, ${siteConfig.address}`
    )}&z=16&output=embed`;
  }
  return null;
}

export function getGoogleMapsDirectionsUrl(): string {
  if (siteConfig.coordinates) {
    const { lat, lng } = siteConfig.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `Ciriaco Materiales, ${siteConfig.address}`
  )}`;
}

export function getGoogleMapsPlaceUrl(): string {
  if (siteConfig.mapShareUrl) {
    return siteConfig.mapShareUrl;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Ciriaco Materiales, ${siteConfig.address}`
  )}`;
}
