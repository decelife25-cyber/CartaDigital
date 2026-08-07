import { useState, type FormEvent } from 'react';
import { ImagePlus, X, Save } from 'lucide-react';
import { useRestaurante } from '../../hooks/useRestaurante';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Input } from './shared/Input';
import type { PlatoConAlergenos } from '../../types/database';

interface ProductoEditorProps {
  plato?: PlatoConAlergenos;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductoEditor({ plato, onClose, onSuccess }: ProductoEditorProps) {
  const { familias, alergenos } = useRestaurante();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: plato?.nombre || '',
    descripcion: plato?.descripcion || '',
    notas: '', // We don't have notes in Producto type, but adding it for form state as per requirements
    precio: plato?.precio?.toString() || '',
    familia_id: plato?.familia_id || '',
    activo: plato?.activo ?? true,
    agotado: plato?.agotado ?? false,
    destacado: false, // Defaulting to false as it's not in the Producto type
    alergenos: plato?.alergenos?.map(a => a.id) || [],
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Dummy submit delay
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={onClose} className="text-slate-400 hover:text-white mb-2 flex items-center gap-2 text-sm transition-colors">
            <X className="h-4 w-4" /> Volver al listado
          </button>
          <h1 className="font-display text-3xl text-white">
            {plato ? 'Editar Plato' : 'Nuevo Plato'}
          </h1>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="gap-2">
          <Save className="h-5 w-5" /> {loading ? 'Guardando...' : 'Guardar Plato'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            <h2 className="text-lg font-medium text-white border-b border-white/10 pb-4">
              Información Principal
            </h2>
            <div className="space-y-4">
              <Input
                label="Nombre del plato"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Precio (€)"
                  type="number"
                  step="0.01"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  required
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Familia</label>
                  <select
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                    value={form.familia_id}
                    onChange={(e) => setForm({ ...form, familia_id: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar familia...</option>
                    {familias.map(f => (
                      <option key={f.id} value={f.id}>{f.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Descripción</label>
                <textarea
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  rows={4}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Notas (Internas / Comentarios extras)</label>
                <textarea
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  rows={2}
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  placeholder="Añade notas para la cocina o detalles adicionales..."
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-6">
            <h2 className="text-lg font-medium text-white border-b border-white/10 pb-4">
              Alérgenos
            </h2>
            <div className="flex flex-wrap gap-3">
              {alergenos.map(alergeno => {
                const isSelected = form.alergenos.includes(alergeno.id);
                return (
                  <button
                    key={alergeno.id}
                    type="button"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        alergenos: isSelected
                          ? prev.alergenos.filter(id => id !== alergeno.id)
                          : [...prev.alergenos, alergeno.id]
                      }));
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {alergeno.icono_url ? (
                      <img src={alergeno.icono_url} alt={alergeno.nombre} className="w-5 h-5 opacity-70" />
                    ) : (
                      <span className="font-bold">{alergeno.sigla}</span>
                    )}
                    <span>{alergeno.nombre}</span>
                  </button>
                );
              })}
              {alergenos.length === 0 && (
                <div className="text-sm text-slate-500">No hay alérgenos configurados.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="space-y-6">
            <h2 className="text-lg font-medium text-white border-b border-white/10 pb-4">
              Fotografía
            </h2>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer group">
              <div className="p-4 rounded-full bg-slate-700 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors mb-4">
                <ImagePlus className="h-8 w-8" />
              </div>
              <p className="text-sm text-slate-400 text-center">
                Haz clic para subir una imagen o arrástrala aquí
              </p>
            </div>
          </Card>

          <Card className="space-y-6">
            <h2 className="text-lg font-medium text-white border-b border-white/10 pb-4">
              Estado
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-white">Visible en la carta</div>
                  <div className="text-xs text-slate-500">El plato aparecerá en el menú público</div>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.activo ? 'bg-amber-500' : 'bg-slate-700'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.activo ? 'translate-x-6' : 'translate-x-1'}`} />
                  <input type="checkbox" className="sr-only" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-white">Agotado</div>
                  <div className="text-xs text-slate-500">Se mostrará pero no se podrá pedir</div>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.agotado ? 'bg-red-500' : 'bg-slate-700'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.agotado ? 'translate-x-6' : 'translate-x-1'}`} />
                  <input type="checkbox" className="sr-only" checked={form.agotado} onChange={(e) => setForm({ ...form, agotado: e.target.checked })} />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-white text-amber-400">Destacado</div>
                  <div className="text-xs text-slate-500">Aparecerá en la sección de sugerencias</div>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.destacado ? 'bg-amber-500' : 'bg-slate-700'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.destacado ? 'translate-x-6' : 'translate-x-1'}`} />
                  <input type="checkbox" className="sr-only" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} />
                </div>
              </label>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}