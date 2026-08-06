import { Route, Routes } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { RestauranteProvider } from './context/RestauranteContext'
import { ThemeProvider } from './context/ThemeContext'
import { SelectionProvider } from './context/SelectionContext'
import { AdminLayout } from './components/admin/AdminLayout'
import { ProtectedRoute } from './components/shared/ProtectedRoute'
import { PublicLayout } from './components/layout/PublicLayout'

import { DashboardPage } from './pages/admin/DashboardPage'
import { FamiliasPage as AdminFamiliasPage } from './pages/admin/FamiliasPage'
import { PlatosPage } from './pages/admin/PlatosPage'
import { SugerenciasPage } from './pages/admin/SugerenciasPage'
import { ConfigPage } from './pages/admin/ConfigPage'
import { ImportPage } from './pages/admin/ImportPage'
import { LoginPage } from './pages/auth/LoginPage'

import { Home } from './pages/public/Home'
import { Families } from './pages/public/Families'
import { DishList } from './pages/public/DishList'
import { DishDetails } from './pages/public/DishDetails'
import { Search } from './pages/public/Search'
import { MySelection } from './pages/public/MySelection'
import { NotFoundPage } from './pages/public/NotFoundPage'

function App() {
  return (
    <ThemeProvider>
      <SelectionProvider>
        <AuthProvider>
          <RestauranteProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/families" element={<Families />} />
                <Route path="/family/:id" element={<DishList />} />
                <Route path="/dish/:id" element={<DishDetails />} />
                <Route path="/search" element={<Search />} />
                <Route path="/selection" element={<MySelection />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="familias" element={<AdminFamiliasPage />} />
                  <Route path="platos" element={<PlatosPage />} />
                  <Route path="sugerencias" element={<SugerenciasPage />} />
                  <Route path="config" element={<ConfigPage />} />
                  <Route path="importar" element={<ImportPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </RestauranteProvider>
        </AuthProvider>
      </SelectionProvider>
    </ThemeProvider>
  )
}

export default App
