import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDishes, type Allergen } from '../../data/mockData';
import { useSelection } from '../../context/SelectionContext';
import { ChevronLeft, Minus, Plus, Info } from 'lucide-react';

export function DishDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useSelection();
  const [quantity, setQuantity] = useState(1);

  const dish = mockDishes.find(d => d.id === id);

  if (!dish) {
    return <div className="p-4 text-center">Plato no encontrado</div>;
  }

  const getAllergenIcon = (allergen: Allergen) => {
    const icons: Record<Allergen, string> = {
      gluten: '🌾', crustaceans: '🦐', eggs: '🥚', fish: '🐟',
      peanuts: '🥜', soybeans: '🫘', milk: '🥛', nuts: '🌰',
      celery: '🥬', mustard: '🌭', sesame: '🌱', sulphites: '🍷',
      lupin: '🌼', molluscs: '🐙'
    };
    return icons[allergen] || '⚠️';
  };

  const handleAddToCart = () => {
    addItem(dish, quantity);
    navigate(-1); // Or a toast, but navigating back is common in these flows
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 pb-24">
      {/* Header Image */}
      <div className="relative h-72 w-full">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 -mt-6 relative bg-white dark:bg-gray-900 rounded-t-3xl shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white pr-4">
            {dish.name}
          </h1>
          <span className="text-2xl font-bold text-brand shrink-0">
            {dish.price.toFixed(2)}€
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
          {dish.description}
        </p>

        {dish.ingredients.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              Ingredientes Principales
            </h3>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {dish.allergens.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Info size={18} />
              Alérgenos
            </h3>
            <div className="flex flex-wrap gap-3">
              {dish.allergens.map(a => (
                <div
                  key={a}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-100 dark:border-red-900/50"
                  title={a}
                >
                  <span className="text-xl">{getAllergenIcon(a)}</span>
                  <span className="text-sm font-medium capitalize">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Minus size={20} />
            </button>
            <span className="w-12 text-center font-bold text-gray-900 dark:text-white text-lg">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-brand hover:bg-brand/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-transform active:scale-95 flex justify-between items-center"
          >
            <span>Añadir a mi selección</span>
            <span>{(dish.price * quantity).toFixed(2)}€</span>
          </button>
        </div>
      </div>
    </div>
  );
}
