import { useMemo, useState } from 'react'
import Papa from 'papaparse'

import { createFamilia, createPlato, listAlergenos, listFamilias } from '../../lib/menu-service'
import { useRestaurante } from '../../hooks/useRestaurante'
import type { Alergeno, Familia } from '../../types/database'

interface ImportRow {
  familia: string
  nombre: string
  precio: string
  descripcion: string
  alergenos: string
  activo: string
  agotado: string
  orden: string
}

interface ValidatedRow extends ImportRow {
  rowNumber: number
  errors: string[]
}

const csvTemplate = `familia,nombre,precio,descripcion,alergenos,activo,agotado,orden
Entrantes,Croqueta cremosa,8.50,Croqueta casera,"GLU;LAC",true,false,1`

export function ImportPage() {
  const { restauranteId, refreshData } = useRestaurante()
  const [rows, setRows] = useState<ValidatedRow[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const hasErrors = useMemo(() => rows.some((row) => row.errors.length > 0), [rows])

  const validateRows = (data: ImportRow[]) => {
    const normalized = data
      .filter((row) => Object.values(row).some((value) => value?.toString().trim()))
      .map<ValidatedRow>((row, index) => {
        const errors: string[] = []
        if (!row.familia) errors.push('Familia obligatoria')
        if (!row.nombre) errors.push('Nombre obligatorio')
        if (row.precio && Number.isNaN(Number(row.precio))) errors.push('Precio inválido')
        if (row.orden && Number.isNaN(Number(row.orden))) errors.push('Orden inválido')
        return { ...row, rowNumber: index + 2, errors }
      })

    setRows(normalized)
  }

  const handleFile = (file: File) => {
    Papa.parse<ImportRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => validateRows(data),
    })
  }

  const handleImport = async () => {
    if (!restauranteId || hasErrors) return

    setLoading(true)
    setResult(null)
    try {
      const [familias, alergenos] = await Promise.all([listFamilias(restauranteId), listAlergenos()])
      const familyMap = new Map<string, Familia>(familias.map((familia) => [familia.nombre.toLowerCase(), familia]))
      const allergenMap = new Map<string, Alergeno>(alergenos.map((alergeno) => [alergeno.sigla.toUpperCase(), alergeno]))
      let imported = 0
      let errors = 0

      for (const row of rows) {
        try {
          let familia = familyMap.get(row.familia.toLowerCase())
          if (!familia) {
            familia = await createFamilia(restauranteId, {
              nombre: row.familia,
              descripcion: '',
              activo: true,
              orden: familyMap.size + 1,
            })
            if (familia) familyMap.set(row.familia.toLowerCase(), familia)
          }

          const alergenoIds = row.alergenos
            ? row.alergenos
                .split(';')
                .map((item) => item.trim().toUpperCase())
                .filter(Boolean)
                .map((sigla) => allergenMap.get(sigla)?.id)
                .filter((id): id is string => Boolean(id))
            : []

          await createPlato(restauranteId, {
            nombre: row.nombre,
            familia_id: familia?.id || null,
            precio: row.precio ? Number(row.precio) : null,
            descripcion: row.descripcion,
            activo: row.activo.toLowerCase() !== 'false',
            agotado: row.agotado.toLowerCase() === 'true',
            orden: row.orden ? Number(row.orden) : imported + 1,
            foto_url: null,
            alergenoIds,
          })
          imported += 1
        } catch {
          errors += 1
        }
      }

      await refreshData()
      setResult(`${imported} platos importados, ${errors} errores.`)
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'carta-template.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Carga masiva</p>
        <h1 className="mt-2 font-display text-3xl text-slate-900">Importar CSV</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Columnas esperadas: familia, nombre, precio, descripcion, alergenos, activo, agotado, orden.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700">
            <input type="file" accept=".csv" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) handleFile(file) }} />
            Seleccionar CSV
          </label>
          <button type="button" onClick={downloadTemplate} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700">
            Descargar plantilla CSV
          </button>
        </div>
      </section>

      {rows.length > 0 && (
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-slate-900">Vista previa</h2>
            <button type="button" disabled={hasErrors || loading} onClick={() => void handleImport()} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {loading ? 'Importando...' : 'Importar datos'}
            </button>
          </div>
          {result && <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{result}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3">Fila</th>
                  <th className="px-3 py-3">Familia</th>
                  <th className="px-3 py-3">Nombre</th>
                  <th className="px-3 py-3">Precio</th>
                  <th className="px-3 py-3">Alérgenos</th>
                  <th className="px-3 py-3">Errores</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.rowNumber}-${row.nombre}`} className={row.errors.length > 0 ? 'bg-red-50' : 'border-b border-slate-100'}>
                    <td className="px-3 py-3">{row.rowNumber}</td>
                    <td className="px-3 py-3">{row.familia}</td>
                    <td className="px-3 py-3">{row.nombre}</td>
                    <td className="px-3 py-3">{row.precio}</td>
                    <td className="px-3 py-3">{row.alergenos}</td>
                    <td className="px-3 py-3 text-red-700">{row.errors.join(', ') || 'Sin errores'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
