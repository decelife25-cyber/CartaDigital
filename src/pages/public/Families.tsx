import { useNavigate } from 'react-router-dom';
import { mockFamilies } from '../../data/mockData';

export function Families() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6 mt-2">
        Nuestra Carta
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockFamilies.map((family) => (
          <button
            key={family.id}
            onClick={() => navigate(`/family/${family.id}`)}
            className="group relative h-48 w-full rounded-2xl overflow-hidden shadow-soft transform transition-transform active:scale-[0.98]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${family.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="text-2xl font-display font-bold text-white text-left shadow-black drop-shadow-md">
                {family.name}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
