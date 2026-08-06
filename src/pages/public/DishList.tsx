import { useParams, useNavigate } from 'react-router-dom';
import { mockFamilies, mockDishes, type Allergen } from '../../data/mockData';
import { Info } from 'lucide-react';

export function DishList() {
  const { id } = useParams();
  const navigate = useNavigate();

  const family = mockFamilies.find(f => f.id === id);
  const dishes = mockDishes.filter(d => d.familyId === id);

  if (!family) {
    return <div className="p-4 text-center">Categoría no encontrada</div>;
  }

  const getAllergenIcon = (allergen: Allergen) => {
    // For now returning simple text badge or emoji
    const icons: Record<Allergen, string> = {
      gluten: '🌾',
      crustaceans: '🦐',
      eggs: '🥚',
      fish: '🐟',
      peanuts: '🥜',
      soybeans: '🫘',
      milk: '🥛',
      nuts: '🌰',
      celery: '🥬',
      mustard: '🌭',
      sesame: '🌱',
      sulphites: '🍷',
      lupin: '🌼',
      molluscs: '🐙'
    };
    return icons[allergen] || '⚠️';
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto">
      {/* Family Header */}
      <div className="relative h-48 w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${family.image})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl font-display font-bold text-white tracking-wider drop-shadow-lg">
            {family.name}
          </h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {dishes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay platos disponibles en esta categoría.</p>
        ) : (
          dishes.map((dish) => (
            <button
              key={dish.id}
              onClick={() => navigate(`/dish/${dish.id}`)}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden flex transform transition-transform active:scale-[0.98] text-left border border-gray-100 dark:border-gray-700"
            >
              <div className="w-32 sm:w-40 shrink-0">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                    {dish.shortDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand text-lg">
                      {dish.price.toFixed(2)}€
                    </span>
                    {!dish.available && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                        Agotado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-lg ml-auto">
                    {dish.allergens.length > 0 ? (
                      dish.allergens.map(a => (
                        <span key={a} title={a} className="text-sm">
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
