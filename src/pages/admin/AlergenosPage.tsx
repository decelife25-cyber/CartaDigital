import { useState } from 'react';
import { Plus, Pencil, Trash2, Info } from 'lucide-react';
import { useRestaurante } from '../../hooks/useRestaurante';
import { Card } from '../../components/admin/shared/Card';
import { Button } from '../../components/admin/shared/Button';
import { Modal } from '../../components/admin/shared/Modal';
import { Input } from '../../components/admin/shared/Input';
import type { Alergeno } from '../../types/database';

export function AlergenosPage() {
  const { alergenos, refreshData } = useRestaurante();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    nombre: '',
    sigla: '',
    descripcion: '',
    icono_url: '',
  });

  const openNewModal = () => {
    setEditingId(null);
    setForm({ nombre: '', sigla: '', descripcion: '', icono_url: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (alergeno: Alergeno) => {
    setEditingId(alergeno.id);
    setForm({
      nombre: alergeno.nombre,
      sigla: alergeno.sigla,
      descripcion: alergeno.descripcion || '',
      icono_url: alergeno.icono_url || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    refreshData();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-1">
            Catálogo
          </p>
          <h1 className="font-display text-3xl text-white">Alérgenos</h1>
        </div>
        <Button onClick={openNewModal} className="gap-2">
          <Plus className="h-5 w-5" /> Nuevo Alérgeno
        </Button>
      </div>

      <Card className="bg-slate-900/50 p-6">
        <div className="mb-4 text-sm text-slate-400 flex items-center gap-2">
          <Info className="h-4 w-4 opacity-50" />
          Los alérgenos están disponibles para asignarlos a cualquier plato del menú.
        </div>

        <div className="space-y-3">
          {alergenos.map((alergeno) => (
            <div key={alergeno.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-white/5 bg-slate-800/80 p-4 transition-colors hover:border-white/10">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900/50 overflow-hidden">
                {alergeno.icono_url ? (
                  <img src={alergeno.icono_url} alt={alergeno.nombre} className="h-8 w-8 opacity-80" />
                ) : (
                  <span className="font-bold text-amber-400">{alergeno.sigla}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-white truncate">{alergeno.nombre}</span>
                  <span className="text-xs font-mono bg-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded">{alergeno.sigla}</span>
                </div>
                <div className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                  {alergeno.descripcion || 'Sin descripción'}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-white/5 pt-3 sm:pt-0 sm:pl-4 mt-1 sm:mt-0">
                <button
                  onClick={() => openEditModal(alergeno)}
                  className="flex-1 sm:flex-none p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors flex justify-center"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className="flex-1 sm:flex-none p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {alergenos.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No hay alérgenos configurados.
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Alérgeno' : 'Nuevo Alérgeno'}
      >
        <form onSubmit={handleSave} className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <Input
                label="Nombre del alérgeno"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Gluten, Lácteos, Frutos secos..."
                required
              />
            </div>
            <div className="sm:col-span-1">
              <Input
                label="Sigla / Código"
                value={form.sigla}
                onChange={(e) => setForm({ ...form, sigla: e.target.value })}
                placeholder="Ej: GLU"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Descripción (Opcional)</label>
            <textarea
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
              rows={2}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          <Input
            label="URL del icono (Opcional)"
            value={form.icono_url}
            onChange={(e) => setForm({ ...form, icono_url: e.target.value })}
            placeholder="https://ejemplo.com/icono.svg"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Alérgeno
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
