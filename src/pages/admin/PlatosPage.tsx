import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { DropResult } from '@hello-pangea/dnd'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { Copy, GripVertical, ImageMinus, Pencil, Plus, Trash2 } from 'lucide-react'

import { createPlato, deletePlato, duplicatePlato, listAlergenos, listFamilias, listPlatos, updatePlato, uploadStorageFile } from '../../lib/menu-service'
import { formatPrice } from '../../lib/format'
import { useRestaurante } from '../../hooks/useRestaurante'
import type { Alergeno, Familia, PlatoConAlergenos } from '../../types/database'

const initialForm = {
  nombre: '',
  familia_id: '',
  precio: '',
  descripcion: '',
  activo: true,
  agotado: false,
  orden: 1,
  foto_url: '',
  alergenoIds: [] as string[],
}

export function PlatosPage() {
  const { restauranteId, refreshData } = useRestaurante()
  const [familias, setFamilias] = useState<Familia[]>([])
  const [platos, setPlatos] = useState<PlatoConAlergenos[]>([])
  const [alergenos, setAlergenos] = useState<Alergeno[]>([])
  const [selectedFamily, setSelectedFamily] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const loadData = async () => {
    if (!restauranteId) return
    setLoading(true)
    try {
      const [familiasData, platosData, alergenosData] = await Promise.all([
        listFamilias(restauranteId),
        listPlatos(restauranteId),
        listAlergenos(),
      ])
      setFamilias(familiasData)
      setPlatos(platosData)
      setAlergenos(alergenosData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [restauranteId])

  const filteredPlatos = useMemo(
    () => (selectedFamily === 'all' ? platos : platos.filter((plato) => plato.familia_id === selectedFamily)),
    [platos, selectedFamily],
  )

  const resetForm = () => {
    setEditingId(null)
    setUploadFile(null)
    setForm({ ...initialForm, orden: platos.length + 1 })
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const ordered = Array.from(filteredPlatos)
    const [moved] = ordered.splice(result.source.index, 1)
    ordered.splice(result.destination.index, 0, moved)

    await Promise.all(ordered.map((plato, index) => updatePlato(plato.id, { orden: index + 1 })))
    await loadData()
    await refreshData()
  }

  const startEdit = (plato: PlatoConAlergenos) => {
    setEditingId(plato.id)
    setUploadFile(null)
    setForm({
      nombre: plato.nombre,
      familia_id: plato.familia_id || '',
      precio: plato.precio?.toString() || '',
      descripcion: plato.descripcion || '',
      activo: plato.activo,
      agotado: plato.agotado,
      orden: plato.orden,
      foto_url: plato.foto_url || '',
      alergenoIds: plato.alergenos.map((alergeno) => alergeno.id),
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!restauranteId) return

    setSaving(true)
    setFeedback(null)
    try {
      let fotoUrl = form.foto_url || null
      if (uploadFile) {
        fotoUrl = await uploadStorageFile('fotos-platos', uploadFile)
      }

      const payload = {
        nombre: form.nombre,
        familia_id: form.familia_id || null,
        precio: form.precio ? Number(form.precio) : null,
        descripcion: form.descripcion,
        activo: form.activo,
        agotado: form.agotado,
        orden: Number(form.orden),
        foto_url: fotoUrl,
        alergenoIds: form.alergenoIds,
      }

      if (editingId) {
        await updatePlato(editingId, payload)
        setFeedback('Plato actualizado.')
      } else {
        await createPlato(restauranteId, payload)
        setFeedback('Plato creado.')
      }
      await loadData()
      await refreshData()
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="rounded-[2rem] bg-white p-8 shadow-sm">Cargando platos...</div>
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Catálogo</p>
            <h1 className="mt-2 font-display text-3xl text-slate-900">Platos</h1>
          </div>
          <select value={selectedFamily} onChange={(event) => setSelectedFamily(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <option value="all">Todas las familias</option>
            {familias.map((familia) => (
              <option key={familia.id} value={familia.id}>{familia.nombre}</option>
            ))}
          </select>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="platos-list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                {filteredPlatos.map((plato, index) => (
                  <Draggable key={plato.id} draggableId={plato.id} index={index}>
                    {(draggableProvided) => (
                      <article
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex gap-4">
                            <button type="button" {...draggableProvided.dragHandleProps} className="mt-1 rounded-xl border border-slate-200 bg-white p-2 text-slate-500">
                              <GripVertical className="h-4 w-4" />
                            </button>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="font-display text-2xl text-slate-900">{plato.nombre}</h2>
                                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{plato.familia?.nombre || 'Sin familia'}</span>
                                {!plato.activo && <span className="rounded-full bg-slate-300 px-3 py-1 text-xs font-semibold text-slate-700">Inactivo</span>}
                                {plato.agotado && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Agotado</span>}
                              </div>
                              <p className="mt-2 text-sm text-slate-600">{plato.descripcion || 'Sin descripción.'}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {plato.alergenos.map((alergeno) => (
                                  <span key={alergeno.id} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">{alergeno.sigla}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start gap-3 lg:items-end">
                            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800">{formatPrice(plato.precio)}</span>
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => startEdit(plato)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"><span className="inline-flex items-center gap-2"><Pencil className="h-4 w-4" /> Editar</span></button>
                              <button type="button" onClick={() => void duplicatePlato(restauranteId!, plato).then(loadData).then(refreshData)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"><span className="inline-flex items-center gap-2"><Copy className="h-4 w-4" /> Duplicar</span></button>
                              <button type="button" onClick={() => void updatePlato(plato.id, { activo: !plato.activo }).then(loadData).then(refreshData)} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">{plato.activo ? 'Desactivar' : 'Activar'}</button>
                              <button type="button" onClick={() => void updatePlato(plato.id, { agotado: !plato.agotado }).then(loadData).then(refreshData)} className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800">{plato.agotado ? 'Marcar disponible' : 'Marcar agotado'}</button>
                              <button type="button" onClick={() => { if (!window.confirm(`¿Eliminar ${plato.nombre}?`)) return; void deletePlato(plato.id).then(loadData).then(refreshData) }} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700"><span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> Eliminar</span></button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800"><Plus className="h-6 w-6" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Formulario</p>
            <h2 className="mt-1 font-display text-2xl text-slate-900">{editingId ? 'Editar plato' : 'Nuevo plato'}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Nombre</span><input required value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Familia</span><select value={form.familia_id} onChange={(event) => setForm((current) => ({ ...current, familia_id: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="">Sin familia</option>{familias.map((familia) => <option key={familia.id} value={familia.id}>{familia.nombre}</option>)}</select></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Precio</span><input type="number" min="0" step="0.01" value={form.precio} onChange={(event) => setForm((current) => ({ ...current, precio: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
            <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Orden</span><input type="number" min={1} value={form.orden} onChange={(event) => setForm((current) => ({ ...current, orden: Number(event.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
          </div>
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Descripción</span><textarea value={form.descripcion} onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))} rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Foto</span><input type="file" accept="image/*" onChange={(event) => setUploadFile(event.target.files?.[0] || null)} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3" /></label>
          {form.foto_url && (
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span>Foto cargada</span>
              <button type="button" onClick={() => setForm((current) => ({ ...current, foto_url: '' }))} className="inline-flex items-center gap-2 font-semibold text-red-700"><ImageMinus className="h-4 w-4" /> Eliminar foto</button>
            </div>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.activo} onChange={(event) => setForm((current) => ({ ...current, activo: event.target.checked }))} /> Activo</label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.agotado} onChange={(event) => setForm((current) => ({ ...current, agotado: event.target.checked }))} /> Agotado</label>
          </div>
          <fieldset className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <legend className="px-2 text-sm font-semibold text-slate-700">Alérgenos</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {alergenos.map((alergeno) => (
                <label key={alergeno.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.alergenoIds.includes(alergeno.id)}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        alergenoIds: event.target.checked
                          ? [...current.alergenoIds, alergeno.id]
                          : current.alergenoIds.filter((id) => id !== alergeno.id),
                      }))
                    }
                  />
                  {alergeno.nombre}
                </label>
              ))}
            </div>
          </fieldset>
          {feedback && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{feedback}</div>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">{saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear plato'}</button>
            {editingId && <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Cancelar</button>}
          </div>
        </form>
      </section>
    </div>
  )
}
