import { useEffect, useState, type FormEvent } from 'react'

import { listRestaurante, updateRestauranteConfig, uploadStorageFile } from '../../lib/menu-service'
import { useRestaurante } from '../../hooks/useRestaurante'
import type { Restaurante } from '../../types/database'

export function ConfigPage() {
  const { restauranteId, refreshData } = useRestaurante()
  const [form, setForm] = useState<Partial<Restaurante>>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      try {
        const restaurante = await listRestaurante()
        setForm(restaurante)
      } finally {
        setLoading(false)
      }
    })()
  }, [restauranteId])

  const social = (form.redes_sociales || {}) as Record<string, string>

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!restauranteId) return
    setSaving(true)
    setFeedback(null)
    try {
      let logoUrl = form.logo_url || null
      if (logoFile) {
        logoUrl = await uploadStorageFile('logos', logoFile)
      }

      await updateRestauranteConfig(restauranteId, { ...form, logo_url: logoUrl })
      await refreshData()
      setFeedback('Configuración guardada correctamente.')
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'No se pudo guardar la configuración.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="rounded-[2rem] bg-white p-8 shadow-sm">Cargando configuración...</div>

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Personalización</p>
      <h1 className="mt-2 font-display text-3xl text-slate-900">Configuración del restaurante</h1>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 xl:grid-cols-2">
        <label className="block space-y-2 xl:col-span-2"><span className="text-sm font-medium text-slate-700">Nombre</span><input value={form.nombre || ''} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Logo</span><input type="file" accept="image/*" onChange={(event) => setLogoFile(event.target.files?.[0] || null)} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Color principal</span><input type="color" value={form.color_principal || '#c8a96e'} onChange={(event) => setForm((current) => ({ ...current, color_principal: event.target.value }))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2" /></label>
        <label className="block space-y-2 xl:col-span-2"><span className="text-sm font-medium text-slate-700">Descripción</span><textarea value={form.descripcion || ''} onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))} rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Dirección</span><input value={form.direccion || ''} onChange={(event) => setForm((current) => ({ ...current, direccion: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Teléfono</span><input value={form.telefono || ''} onChange={(event) => setForm((current) => ({ ...current, telefono: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2 xl:col-span-2"><span className="text-sm font-medium text-slate-700">Horario</span><textarea value={form.horario || ''} onChange={(event) => setForm((current) => ({ ...current, horario: event.target.value }))} rows={3} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Instagram</span><input value={social.instagram || ''} onChange={(event) => setForm((current) => ({ ...current, redes_sociales: { ...(current.redes_sociales || {}), instagram: event.target.value } }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Facebook</span><input value={social.facebook || ''} onChange={(event) => setForm((current) => ({ ...current, redes_sociales: { ...(current.redes_sociales || {}), facebook: event.target.value } }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Twitter/X</span><input value={social.x || social.twitter || ''} onChange={(event) => setForm((current) => ({ ...current, redes_sociales: { ...(current.redes_sociales || {}), x: event.target.value } }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Web</span><input value={social.web || ''} onChange={(event) => setForm((current) => ({ ...current, redes_sociales: { ...(current.redes_sociales || {}), web: event.target.value } }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">QR URL</span><input value={form.qr_url || ''} onChange={(event) => setForm((current) => ({ ...current, qr_url: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Dominio</span><input value={form.dominio || ''} onChange={(event) => setForm((current) => ({ ...current, dominio: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>
        {feedback && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 xl:col-span-2">{feedback}</div>}
        <div className="xl:col-span-2">
          <button type="submit" disabled={saving} className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white">{saving ? 'Guardando...' : 'Guardar configuración'}</button>
        </div>
      </form>
    </section>
  )
}
