import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'

import { createSugerencia, deleteSugerencia, listPlatos, listSugerencias, updateSugerencia } from '../../lib/menu-service'
import { formatPrice } from '../../lib/format'
import { useRestaurante } from '../../hooks/useRestaurante'
import type { PlatoConAlergenos } from '../../types/database'
import type { SugerenciaConPlato } from '../../lib/menu-service'

const initialForm = {
  plato_id: '',
  nombre: '',
  descripcion: '',
  precio: '',
  activo: true,
  orden: 1,
}

export function SugerenciasPage() {
  const { restauranteId, refreshData } = useRestaurante()
  const [platos, setPlatos] = useState<PlatoConAlergenos[]>([])
  const [sugerencias, setSugerencias] = useState<SugerenciaConPlato[]>([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    if (!restauranteId) return
    setLoading(true)
    try {
      const [platosData, sugerenciasData] = await Promise.all([listPlatos(restauranteId), listSugerencias(restauranteId)])
      setPlatos(platosData)
      setSugerencias(sugerenciasData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [restauranteId])

  const resetForm = () => {
    setForm({ ...initialForm, orden: sugerencias.length + 1 })
    setEditingId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!restauranteId) return

    setSaving(true)
    try {
      const payload = {
        plato_id: form.plato_id || null,
        nombre: form.nombre || null,
        descripcion: form.descripcion || null,
        precio: form.precio ? Number(form.precio) : null,
        activo: form.activo,
        orden: Number(form.orden),
      }
      if (editingId) {
        await updateSugerencia(editingId, payload)
      } else {
        await createSugerencia(restauranteId, payload)
      }
      await loadData()
      await refreshData()
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="rounded-[2rem] bg-white p-8 shadow-sm">Cargando sugerencias...</div>

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Edición rápida</p>
        <h1 className="mt-2 font-display text-3xl text-slate-900">Sugerencias del día</h1>
        <div className="mt-6 space-y-4">
          {sugerencias.map((sugerencia) => (
            <article key={sugerencia.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl text-slate-900">{sugerencia.nombre || sugerencia.plato?.nombre || 'Sugerencia'}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${sugerencia.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>{sugerencia.activo ? 'Activa' : 'Inactiva'}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{sugerencia.descripcion || sugerencia.plato?.descripcion || 'Sin descripción.'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800">{formatPrice(sugerencia.precio ?? sugerencia.plato?.precio)}</span>
                  <button type="button" onClick={() => { setEditingId(sugerencia.id); setForm({ plato_id: sugerencia.plato_id || '', nombre: sugerencia.nombre || '', descripcion: sugerencia.descripcion || '', precio: sugerencia.precio?.toString() || '', activo: sugerencia.activo, orden: sugerencia.orden }) }} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"><span className="inline-flex items-center gap-2"><Pencil className="h-4 w-4" /> Editar</span></button>
                  <button type="button" onClick={() => void updateSugerencia(sugerencia.id, { activo: !sugerencia.activo }).then(loadData).then(refreshData)} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">{sugerencia.activo ? 'Desactivar' : 'Activar'}</button>
                  <button type="button" onClick={() => { if (!window.confirm('¿Eliminar sugerencia?')) return; void deleteSugerencia(sugerencia.id).then(loadData).then(refreshData) }} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700"><span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> Eliminar</span></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800"><Plus className="h-6 w-6" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Formulario</p>
            <h2 className="mt-1 font-display text-2xl text-slate-900">{editingId ? 'Editar sugerencia' : 'Nueva sugerencia'}</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Plato existente (opcional)</span><select value={form.plato_id} onChange={(event) => setForm((current) => ({ ...current, plato_id: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="">Sugerencia personalizada</option>{platos.map((plato) => <option key={plato.id} value={plato.id}>{plato.nombre}</option>)}</select></label>
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Nombre</span><input value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Descripción</span><textarea value={form.descripcion} onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))} rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Precio</span><input type="number" step="0.01" min="0" value={form.precio} onChange={(event) => setForm((current) => ({ ...current, precio: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Orden</span><input type="number" min={1} value={form.orden} onChange={(event) => setForm((current) => ({ ...current, orden: Number(event.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.activo} onChange={(event) => setForm((current) => ({ ...current, activo: event.target.checked }))} /> Activa</label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">{saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear sugerencia'}</button>
            {editingId && <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Cancelar</button>}
          </div>
        </form>
      </section>
    </div>
  )
}
