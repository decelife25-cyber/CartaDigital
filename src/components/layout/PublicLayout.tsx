import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu, Search, ShoppingBag, ChevronLeft, Moon, Sun } from 'lucide-react';
import { useSelection } from '../../context/SelectionContext';
import { useTheme } from '../../context/ThemeContext';
import { restaurantInfo } from '../../data/mockData';

export function PublicLayout() {
  const { totalItems } = useSelection();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Top Header */}
      {!isHome && (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <h1 className="font-display font-bold text-xl text-gray-900 dark:text-white truncate mx-4 flex-1 text-center">
              {restaurantInfo.name}
            </h1>

            <div className="flex items-center space-x-1">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => navigate('/selection')}
                className="p-2 -mr-2 relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ShoppingBag size={24} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-brand text-white text-xs font-bold rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe z-50">
        <div className="flex items-center justify-around h-16 px-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-brand' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">Inicio</span>
          </NavLink>

          <NavLink
            to="/families"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-brand' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <Menu size={20} />
            <span className="text-[10px] font-medium">Carta</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-brand' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <Search size={20} />
            <span className="text-[10px] font-medium">Buscar</span>
          </NavLink>

          <NavLink
            to="/selection"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 relative ${
                isActive ? 'text-brand' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <div className="relative">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 flex items-center justify-center bg-brand text-white text-[9px] font-bold rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Mi Selección</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
