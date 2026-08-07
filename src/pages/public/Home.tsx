import { useNavigate } from 'react-router-dom';
import { Phone, Calendar, Menu as MenuIcon, Moon, Sun } from 'lucide-react';
import { useRestaurante } from '../../hooks/useRestaurante';
import { useTheme } from '../../context/ThemeContext';
import { PLACEHOLDER_RESTAURANT_LOGO, PLACEHOLDER_RESTAURANT_COVER } from '../../lib/placeholders';

export function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { restaurante } = useRestaurante();

  const nombre = restaurante?.nombre || 'Restaurante';
  const logo = restaurante?.logo_url || PLACEHOLDER_RESTAURANT_LOGO;
  const coverImage = PLACEHOLDER_RESTAURANT_COVER; // DB doesn't have cover image yet, using placeholder
  const telefono = restaurante?.telefono || '';
  // Check if redes_sociales is an object before accessing web
  const bookingUrl = (restaurante?.redes_sociales && typeof restaurante.redes_sociales === 'object' && 'web' in restaurante.redes_sociales && restaurante.redes_sociales.web)
    ? String(restaurante.redes_sociales.web)
    : undefined;

  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-20 p-3 bg-black/40 hover:bg-black/50 backdrop-blur-md rounded-full text-white border border-white/20 transition-transform active:scale-95"
        aria-label="Alternar tema"
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Logo and Name */}
        <div className="mb-12 flex flex-col items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/20 mb-6 shadow-2xl">
            <img
              src={logo}
              alt={`Logo de ${nombre}`}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-lg text-center px-4">
            {nombre}
          </h1>
          <p className="text-gray-200 text-sm md:text-base font-medium tracking-wide uppercase drop-shadow-md text-center px-4">
            {restaurante?.descripcion || 'Restaurante & Experiencia'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => navigate('/families')}
            className="w-full py-4 px-6 bg-brand hover:bg-brand/90 text-white font-semibold rounded-xl flex items-center justify-center space-x-3 transition-transform active:scale-95 shadow-lg"
          >
            <MenuIcon size={24} />
            <span className="text-lg">Ver la Carta</span>
          </button>

          {bookingUrl && (
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl flex items-center justify-center space-x-3 transition-transform active:scale-95 shadow-lg"
            >
              <Calendar size={24} />
              <span className="text-lg">Reservar Mesa</span>
            </a>
          )}

          {telefono && (
            <a
              href={`tel:${telefono.replace(/\s+/g, '')}`}
              className="w-full py-4 px-6 bg-black/40 hover:bg-black/50 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 flex items-center justify-center space-x-3 transition-transform active:scale-95 shadow-lg"
            >
              <Phone size={24} />
              <span className="text-lg">Llamar al Restaurante</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
