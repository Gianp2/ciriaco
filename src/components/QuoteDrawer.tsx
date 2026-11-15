import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ClipboardList, Copy, Minus, Plus, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useQuote } from '@/src/context/QuoteContext';
import { WhatsAppIcon } from '@/src/components/BrandIcons';

export function QuoteDrawer() {
  const {
    items,
    totalCount,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    removeItem,
    updateItemQuantity,
    updateItemUnit,
    clearItems,
    buildQuoteSummaryText,
    getQuoteWhatsAppUrl,
  } = useQuote();

  const [copied, setCopied] = useState(false);

  // Bloquear scroll de fondo y cerrar con Escape cuando el panel está abierto
  useEffect(() => {
    if (!isDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  const handleCopyList = async () => {
    try {
      await navigator.clipboard.writeText(buildQuoteSummaryText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback silencioso
    }
  };

  return (
    <>
      {/* Barra flotante discreta: solo visible cuando el usuario agregó productos */}
      <AnimatePresence>
        {totalCount > 0 && !isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 sm:right-6"
          >
            <button
              type="button"
              onClick={openDrawer}
              className="inline-flex min-h-[44px] items-center gap-2.5 rounded-sm border border-[#252B30]/20 bg-[#252B30] px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all duration-150 hover:bg-[#B77948] active:scale-[0.98] sm:text-sm"
            >
              <ClipboardList strokeWidth={1.65} className="h-4 w-4 text-[#B77948]" aria-hidden="true" />
              <span>Lista de consulta</span>
              <span className="font-mono text-xs text-white/85 tabular-nums">
                ({totalCount})
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel lateral de lista para presupuestar */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Lista de materiales para presupuestar"
            className="fixed inset-0 z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-[#161A1D]/55 backdrop-blur-[2px]"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 flex h-[100dvh] w-full max-w-md flex-col border-l border-[#252B30]/12 bg-[#FFFFFF] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
            >
              {/* Encabezado */}
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#252B30]/10 px-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <ClipboardList strokeWidth={1.65} className="h-4 w-4 text-[#B77948]" aria-hidden="true" />
                  <h2 className="text-sm font-bold tracking-tight text-[#252B30]">
                    Lista para presupuestar
                  </h2>
                  <span className="font-mono text-xs text-[#69737A] tabular-nums">
                    ({totalCount})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Cerrar lista de presupuesto"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-[#252B30] hover:bg-[#F5F4F0] active:scale-95"
                >
                  <X strokeWidth={1.7} className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Listado de productos */}
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-12">
                    <p className="text-sm font-semibold text-[#252B30]">
                      Tu lista está vacía
                    </p>
                    <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-[#69737A]">
                      Agregá referencias desde el catálogo para armar una consulta unificada
                      por WhatsApp.
                    </p>
                    <Link
                      to="/productos"
                      onClick={closeDrawer}
                      className="mt-5 inline-flex min-h-[40px] items-center justify-center rounded-sm bg-[#252B30] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B77948]"
                    >
                      Explorar catálogo
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-[#252B30]/10">
                    {items.map((item) => (
                      <li key={item.code} className="py-3.5 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="font-mono text-[11px] font-medium text-[#B77948] tabular-nums">
                              {item.code}
                            </span>
                            <Link
                              to={`/productos/${encodeURIComponent(item.code)}`}
                              onClick={closeDrawer}
                              className="block truncate text-sm font-semibold text-[#252B30] hover:text-[#B77948]"
                            >
                              {item.name}
                            </Link>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.code)}
                            aria-label={`Quitar ${item.code}`}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-[#69737A] transition-colors hover:bg-[#F5F4F0] hover:text-red-700"
                          >
                            <Trash2 strokeWidth={1.65} className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-3">
                          {/* Selector de cantidad */}
                          <div className="inline-flex items-center rounded-sm border border-[#252B30]/15 bg-[#F5F4F0]/50">
                            <button
                              type="button"
                              onClick={() =>
                                updateItemQuantity(item.code, Math.max(1, item.quantity - 1))
                              }
                              aria-label="Disminuir cantidad"
                              className="inline-flex h-8 w-8 items-center justify-center text-[#252B30] hover:bg-[#FFFFFF]"
                            >
                              <Minus strokeWidth={1.7} className="h-3 w-3" aria-hidden="true" />
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (!Number.isNaN(val) && val >= 1) {
                                  updateItemQuantity(item.code, val);
                                }
                              }}
                              aria-label={`Cantidad para ${item.code}`}
                              className="h-8 w-14 bg-transparent text-center font-mono text-xs font-semibold text-[#252B30] tabular-nums focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => updateItemQuantity(item.code, item.quantity + 1)}
                              aria-label="Aumentar cantidad"
                              className="inline-flex h-8 w-8 items-center justify-center text-[#252B30] hover:bg-[#FFFFFF]"
                            >
                              <Plus strokeWidth={1.7} className="h-3 w-3" aria-hidden="true" />
                            </button>
                          </div>

                          {/* Selector unidad / pallet */}
                          <div className="inline-flex rounded-sm border border-[#252B30]/15 bg-[#F5F4F0]/50 p-0.5 text-[11px]">
                            <button
                              type="button"
                              onClick={() => updateItemUnit(item.code, 'unidades')}
                              className={`rounded-[2px] px-2 py-1 font-medium transition-colors ${
                                item.unit === 'unidades'
                                  ? 'bg-[#252B30] text-white'
                                  : 'text-[#69737A] hover:text-[#252B30]'
                              }`}
                            >
                              Unid.
                            </button>
                            <button
                              type="button"
                              onClick={() => updateItemUnit(item.code, 'pallets')}
                              className={`rounded-[2px] px-2 py-1 font-medium transition-colors ${
                                item.unit === 'pallets'
                                  ? 'bg-[#252B30] text-white'
                                  : 'text-[#69737A] hover:text-[#252B30]'
                              }`}
                            >
                              Pallets
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Pie del drawer */}
              {items.length > 0 && (
                <div className="shrink-0 border-t border-[#252B30]/10 bg-[#F5F4F0]/60 p-4 sm:p-5 space-y-2.5">
                  <a
                    href={getQuoteWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-[#B77948] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#9F6639] active:scale-[0.98]"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span>Consultar lista por WhatsApp</span>
                  </a>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleCopyList}
                      className="inline-flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-sm border border-[#252B30]/15 bg-[#FFFFFF] px-3 py-1.5 text-xs font-medium text-[#252B30] transition-colors hover:border-[#252B30]/35"
                    >
                      {copied ? (
                        <>
                          <Check strokeWidth={1.7} className="h-3.5 w-3.5 text-[#B77948]" aria-hidden="true" />
                          <span>Lista copiada</span>
                        </>
                      ) : (
                        <>
                          <Copy strokeWidth={1.65} className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copiar detalle</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={clearItems}
                      className="inline-flex min-h-[36px] items-center justify-center rounded-sm px-3 py-1.5 text-xs font-medium text-[#69737A] transition-colors hover:text-red-700"
                    >
                      Vaciar
                    </button>
                  </div>
                </div>
              )}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
