import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurante } from '../../hooks/useRestaurante';
import { Search as SearchIcon, X, Info } from 'lucide-react';
import { PLACEHOLDER_DISH_IMAGE } from '../../lib/placeholders';
import type { Alergeno } from '../../types/database';

export function Search() {
  const navigate = useNavigate();
  const { platos, familias } = useRestaurante();
  const [query, setQuery] = useState('');

  const filteredDishes = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();

    return platos.filter(dish => {
      const family = familias.find(f => f.id === dish.familia_id);

      const matchesName = dish.nombre.toLowerCase().includes(lowerQuery);
      const matchesDesc = dish.descripcion?.toLowerCase().includes(lowerQuery) || false;
      const matchesFamily = family ? family.nombre.toLowerCase().includes(lowerQuery) : false;

      return matchesName || matchesDesc || matchesFamily;
    });
  }, [query, platos, familias]);

  const getAllergenIcon = (allergen: Alergeno) => {
    return allergen.sigla || '⚠️';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm transition-colors"
            placeholder="Buscar por plato, ingrediente o familia..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 max-w-4xl mx-auto w-full space-y-4">
        {!query.trim() ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <SearchIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Empieza a escribir para buscar...
            </p>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No hemos encontrado resultados para "<span className="font-semibold text-gray-700 dark:text-gray-200">{query}</span>"
            </p>
          </div>
        ) : (
          filteredDishes.map((dish) => (
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

                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-brand text-lg">
                    {(dish.precio || 0).toFixed(2)}€
                  </span>

                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-lg">
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
