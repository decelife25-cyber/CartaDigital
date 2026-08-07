import { useState, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { GripVertical, Plus, Pencil, Trash2, Tag } from 'lucide-react';

import { useRestaurante } from '../../hooks/useRestaurante';
import { Card } from '../../components/admin/shared/Card';
import { Button } from '../../components/admin/shared/Button';
import { Badge } from '../../components/admin/shared/Badge';
import { Input } from '../../components/admin/shared/Input';
import { Modal } from '../../components/admin/shared/Modal';
import type { Familia } from '../../types/database';

export function FamiliasPage() {
  const { familias, platos, refreshData } = useRestaurante();
  const [items, setItems] = useState<Familia[]>(familias);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Sync internal state if context updates
  useEffect(() => {
    setItems(familias);
  }, [familias]);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
  });

  const attachedCounts = useMemo(() => {
    return platos.reduce<Record<string, number>>((acc, plato) => {
      const id = plato.familia_id || 'none';
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
  }, [platos]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(destinationIndex, 0, reorderedItem);
    setItems(newItems);

    // In a real implementation we would save the new order via API here
  };

  const openNewModal = () => {
    setEditingId(null);
    setForm({ nombre: '', descripcion: '', activo: true });
    setIsModalOpen(true);
  };

  const openEditModal = (familia: Familia) => {
    setEditingId(familia.id);
    setForm({ nombre: familia.nombre, descripcion: familia.descripcion || '', activo: familia.activo ?? true });
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
            Organización
          </p>
          <h1 className="font-display text-3xl text-white">Familias</h1>
        </div>
        <Button onClick={openNewModal} className="gap-2">
          <Plus className="h-5 w-5" /> Nueva Familia
        </Button>
      </div>

      <Card className="bg-slate-900/50 p-6">
        <div className="mb-4 text-sm text-slate-400 flex items-center gap-2">
          <GripVertical className="h-4 w-4 opacity-50" />
          Arrastra para cambiar el orden en la carta pública
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="familias-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {items.map((familia, index) => (
                  <Draggable key={familia.id} draggableId={familia.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-4 rounded-2xl border bg-slate-800/80 p-4 transition-colors ${
                          snapshot.isDragging ? 'border-amber-500/50 shadow-xl' : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/50 text-slate-500 hover:text-white hover:bg-slate-700 transition-colors cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-5 w-5" />
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                          <Tag className="h-6 w-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate">{familia.nombre}</div>
                          <div className="text-sm text-slate-500 truncate">
                            {attachedCounts[familia.id] || 0} platos vinculados
                          </div>
                        </div>

                        <div className="hidden sm:block">
                          <Badge variant={familia.activo ? 'success' : 'default'}>
                            {familia.activo ? 'Visible' : 'Oculto'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 border-l border-white/5 pl-4 ml-4">
                          <button
                            onClick={() => openEditModal(familia)}
                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Familia' : 'Nueva Familia'}
      >
        <form onSubmit={handleSave} className="space-y-6 pt-2">
          <Input
            label="Nombre de la familia"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Ej: Entrantes, Postres..."
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Descripción (Opcional)</label>
            <textarea
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
              rows={3}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          <label className="flex items-center justify-between cursor-pointer rounded-2xl border border-slate-700 p-4 hover:bg-slate-800 transition-colors">
            <div>
              <div className="font-medium text-white">Visible en la carta</div>
              <div className="text-sm text-slate-500">Muestra u oculta toda la categoría</div>
            </div>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.activo ? 'bg-amber-500' : 'bg-slate-700'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.activo ? 'translate-x-6' : 'translate-x-1'}`} />
              <input type="checkbox" className="sr-only" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
            </div>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Familia
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}