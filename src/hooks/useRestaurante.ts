import { useContext } from 'react'

import { RestauranteContext } from '../context/RestauranteContext'

export function useRestaurante() {
  const context = useContext(RestauranteContext)

  if (!context) {
    throw new Error('useRestaurante debe usarse dentro de RestauranteProvider')
  }

  return context
}
