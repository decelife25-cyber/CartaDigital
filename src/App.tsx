import { Route, Routes } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { RestauranteProvider } from './context/RestauranteContext'
import { AdminLayout } from './components/admin/AdminLayout'
import { ProtectedRoute } from './components/shared/ProtectedRoute'
import { DashboardPage } from './pages/admin/DashboardPage'
import { FamiliasPage } from './pages/admin/FamiliasPage'
import { PlatosPage } from './pages/admin/PlatosPage'
import { SugerenciasPage } from './pages/admin/SugerenciasPage'
import { ConfigPage } from './pages/admin/ConfigPage'
import { ImportPage } from './pages/admin/ImportPage'
import { LoginPage } from './pages/auth/LoginPage'
import { MenuPage } from './pages/public/MenuPage'
import { NotFoundPage } from './pages/public/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <RestauranteProvider>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="familias" element={<FamiliasPage />} />
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
  )
}

export default App
