import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'

import { createFamilia, deleteFamilia, listFamilias, listPlatos, updateFamilia } from '../../lib/menu-service'
import { useRestaurante } from '../../hooks/useRestaurante'
import type { Familia, PlatoConAlergenos } from '../../types/database'

const initialForm = { nombre: '', descripcion: '', activo: true, orden: 1 }

export function FamiliasPage() {
  const { restauranteId, refreshData } = useRestaurante()
  const [familias, setFamilias] = useState<Familia[]>([])
  const [platos, setPlatos] = useState<PlatoConAlergenos[]>([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const loadData = async () => {
    if (!restauranteId) return
    setLoading(true)
    try {
      const [familiasData, platosData] = await Promise.all([listFamilias(restauranteId), listPlatos(restauranteId)])
      setFamilias(familiasData)
      setPlatos(platosData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [restauranteId])

  const attachedCounts = useMemo(
    () => platos.reduce<Record<string, number>>((acc, plato) => ({ ...acc, [plato.familia_id || 'none']: (acc[plato.familia_id || 'none'] || 0) + 1 }), {}),
    [platos],
  )

  const resetForm = () => {
    setForm({ ...initialForm, orden: familias.length + 1 })
    setEditingId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!restauranteId) return

    setSaving(true)
    setFeedback(null)
    try {
      if (editingId) {
        await updateFamilia(editingId, form)
        setFeedback('Familia actualizada.')
      } else {
        await createFamilia(restauranteId, form)
        setFeedback('Familia creada.')
      }
      await loadData()
      await refreshData()
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  const moveFamilia = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= familias.length) return

    const reordered = [...familias]
    const [item] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, item)

    await Promise.all(
      reordered.map((familia, orderIndex) => updateFamilia(familia.id, { orden: orderIndex + 1 })),
    )
    await loadData()
    await refreshData()
  }

  if (loading) {
    return <div className="rounded-[2rem] bg-white p-8 shadow-sm">Cargando familias...</div>
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Gestión</p>
            <h1 className="mt-2 font-display text-3xl text-slate-900">Familias</h1>
          </div>
        </div>

        <div className="space-y-4">
          {familias.map((familia, index) => (
            <article key={familia.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-slate-900">{familia.nombre}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${familia.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                      {familia.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{familia.descripcion || 'Sin descripción.'}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-400">Orden {familia.orden} · {attachedCounts[familia.id] || 0} platos</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => void moveFamilia(index, -1)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40" disabled={index === 0}><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => void moveFamilia(index, 1)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40" disabled={index === familias.length - 1}><ArrowDown className="h-4 w-4" /></button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(familia.id)
                      setForm({ nombre: familia.nombre, descripcion: familia.descripcion || '', activo: familia.activo, orden: familia.orden })
                    }}
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    <span className="inline-flex items-center gap-2"><Pencil className="h-4 w-4" /> Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateFamilia(familia.id, { activo: !familia.activo }).then(loadData).then(refreshData)}
                    className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800"
                  >
                    {familia.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if ((attachedCounts[familia.id] || 0) > 0) {
                        setFeedback('No puedes eliminar una familia con platos asociados.')
                        return
                      }
                      if (!window.confirm(`¿Eliminar ${familia.nombre}?`)) return
                      void deleteFamilia(familia.id).then(loadData).then(refreshData)
                    }}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
                  >
                    <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> Eliminar</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Plus className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Formulario</p>
            <h2 className="mt-1 font-display text-2xl text-slate-900">{editingId ? 'Editar familia' : 'Nueva familia'}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Nombre</span>
            <input value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Descripción</span>
            <textarea value={form.descripcion} onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))} rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Orden</span>
            <input type="number" min={1} value={form.orden} onChange={(event) => setForm((current) => ({ ...current, orden: Number(event.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={form.activo} onChange={(event) => setForm((current) => ({ ...current, activo: event.target.checked }))} /> Activa
          </label>

          {feedback && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{feedback}</div>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
              {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear familia'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
