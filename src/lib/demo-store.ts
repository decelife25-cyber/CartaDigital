import { demoData } from './demo-data'
import type { Alergeno, Familia, PlatoConAlergenos, Restaurante, Sugerencia } from '../types/database'

export interface DemoSnapshot {
  restaurante: Restaurante
  familias: Familia[]
  platos: PlatoConAlergenos[]
  alergenos: Alergeno[]
  sugerencias: Sugerencia[]
}

const DEMO_STORE_KEY = 'carta-digital-demo-store'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function cloneSnapshot(snapshot: DemoSnapshot): DemoSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as DemoSnapshot
}

export function getDefaultDemoSnapshot(): DemoSnapshot {
  return cloneSnapshot(demoData)
}

export function getDemoSnapshot(): DemoSnapshot {
  if (!canUseStorage()) return getDefaultDemoSnapshot()

  const raw = window.localStorage.getItem(DEMO_STORE_KEY)
  if (!raw) return getDefaultDemoSnapshot()

  try {
    const parsed = JSON.parse(raw) as DemoSnapshot
    return parsed
  } catch {
    window.localStorage.removeItem(DEMO_STORE_KEY)
    return getDefaultDemoSnapshot()
  }
}

export function saveDemoSnapshot(snapshot: DemoSnapshot) {
  if (!canUseStorage()) return
  window.localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(snapshot))
}

export function updateDemoSnapshot(mutator: (snapshot: DemoSnapshot) => DemoSnapshot) {
  const next = mutator(getDemoSnapshot())
  saveDemoSnapshot(next)
  return next
}

export function clearDemoSnapshot() {
  if (!canUseStorage()) return
  window.localStorage.removeItem(DEMO_STORE_KEY)
}
