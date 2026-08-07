import { useSelection } from '../../context/SelectionContext';
import { Minus, Plus, Trash2, Info, Share2, Copy } from 'lucide-react';
import { PLACEHOLDER_DISH_IMAGE } from '../../lib/placeholders';
import type { Alergeno } from '../../types/database';

export function MySelection() {
  const { items, updateQuantity, removeItem, clearSelection, totalPrice } = useSelection();

  const getAllergenIcon = (allergen: Alergeno) => {
    return allergen.sigla || '⚠️';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mi selección de platos',
        text: 'Mira lo que he elegido para comer.',
        url: window.location.href,
      }).catch(console.error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="p-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6 mt-2">
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Mi Selección
          </h2>
          {items.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium text-sm px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors"
            >
              Vaciar lista
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Info size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Tu lista está vacía
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
              Navega por la carta y añade los platos que más te gusten para preparar tu comanda.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-start gap-3 mb-6">
              <Info size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Esta lista es solo para tu comodidad y no se envía a cocina. Muéstrasela a tu camarero cuando te tome nota.
              </p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.dish.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft border border-gray-100 dark:border-gray-700 flex flex-col gap-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.dish.foto_url || PLACEHOLDER_DISH_IMAGE}
                      alt={item.dish.nombre}
                      className="w-24 h-24 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-display font-bold text-gray-900 dark:text-white truncate">
                          {item.dish.nombre}
                        </h3>
                        <button
                          onClick={() => removeItem(item.dish.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {item.dish.alergenos.map(a => (
                          <span key={a.id} title={a.nombre} className="text-xs">
                            {getAllergenIcon(a)}
                          </span>
                        ))}
                      </div>

                      <div className="font-semibold text-brand">
                        {(item.dish.precio || 0).toFixed(2)}€
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Subtotal</div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {((item.dish.precio || 0) * item.quantity).toFixed(2)}€
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Total estimado</span>
                <span className="text-2xl font-bold text-brand">
                  {totalPrice.toFixed(2)}€
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors"
                >
                  <Share2 size={18} />
                  <span>Compartir</span>
                </button>
                <button
                  onClick={() => {
                    const text = items.map(i => `${i.quantity}x ${i.dish.nombre}`).join('\n');
                    navigator.clipboard.writeText(`Mi selección:\n${text}\nTotal: ${totalPrice.toFixed(2)}€`);
                  }}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors"
                >
                  <Copy size={18} />
                  <span>Copiar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
