import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurante } from '../../hooks/useRestaurante';
import { Info } from 'lucide-react';
import { PLACEHOLDER_FAMILY_IMAGE, PLACEHOLDER_DISH_IMAGE } from '../../lib/placeholders';
import type { Alergeno } from '../../types/database';

export function DishList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { familias, platos } = useRestaurante();

  const family = familias.find(f => f.id === id);
  const dishes = platos.filter(d => d.familia_id === id);

  if (!family) {
    return <div className="p-4 text-center">Familia no encontrada</div>;
  }

  const getAllergenIcon = (allergen: Alergeno) => {
    // If the allergen has an icon_url, we could render an img tag.
    // Since we're using emojis in the DB for sigla often, we can use that, or a default emoji.
    return allergen.sigla || '⚠️';
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto">
      {/* Family Header */}
      <div className="relative h-48 w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${PLACEHOLDER_FAMILY_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl font-display font-bold text-white tracking-wider drop-shadow-lg">
            {family.nombre}
          </h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {dishes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay platos disponibles en esta familia.</p>
        ) : (
          dishes.map((dish) => (
            <button
              key={dish.id}
              onClick={() => navigate(`/dish/${dish.id}`)}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden flex transform transition-transform active:scale-[0.98] text-left border border-gray-100 dark:border-gray-700"
            >
              <div className="w-32 sm:w-40 shrink-0">
                <img
                  src={dish.foto_url || PLACEHOLDER_DISH_IMAGE}
                  alt={dish.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1">
                    {dish.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                    {dish.descripcion}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand text-lg">
                      {(dish.precio || 0).toFixed(2)}€
                    </span>
                    {dish.agotado && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                        Agotado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-lg ml-auto">
                    {dish.alergenos.length > 0 ? (
                      dish.alergenos.map(a => (
                        <span key={a.id} title={a.nombre} className="text-sm">
                          {getAllergenIcon(a)}
                        </span>
                      ))
                    ) : (
                      <Info size={14} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
