import { useState } from 'react';
import { ImageMinus, Search, Plus, Pencil, Trash2 } from 'lucide-react';

import { useRestaurante } from '../../hooks/useRestaurante';
import { Card } from '../../components/admin/shared/Card';
import { Button } from '../../components/admin/shared/Button';
import { Badge } from '../../components/admin/shared/Badge';
import { Input } from '../../components/admin/shared/Input';
import { formatPrice } from '../../lib/format';
import { ProductoEditor } from '../../components/admin/ProductoEditor';

export function PlatosPage() {
  const { platos, familias, refreshData } = useRestaurante();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredPlatos = platos.filter((plato) => {
    const matchesSearch = plato.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = selectedFamily === 'all' || plato.familia_id === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  if (editingId !== null) {
    const platoToEdit = editingId === 'new' ? undefined : platos.find(p => p.id === editingId);
    return (
      <ProductoEditor
        plato={platoToEdit}
        onClose={() => setEditingId(null)}
        onSuccess={() => { setEditingId(null); refreshData(); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-1">
            Menú Digital
          </p>
          <h1 className="font-display text-3xl text-white">Platos y Productos</h1>
        </div>
        <Button onClick={() => setEditingId('new')} className="gap-2">
          <Plus className="h-5 w-5" /> Nuevo Plato
        </Button>
      </div>

      <Card className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar platos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-5 w-5" />}
          className="flex-1"
        />
        <select
          className="rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          value={selectedFamily}
          onChange={(e) => setSelectedFamily(e.target.value)}
        >
          <option value="all">Todas las familias</option>
          {familias.map(f => (
            <option key={f.id} value={f.id}>{f.nombre}</option>
          ))}
        </select>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Plato</th>
                <th className="px-6 py-4 font-medium">Familia</th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPlatos.map((plato) => {
                const familia = familias.find(f => f.id === plato.familia_id);
                return (
                  <tr key={plato.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {plato.foto_url ? (
                          <img src={plato.foto_url} alt={plato.nombre} className="h-12 w-12 rounded-xl object-cover" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-500">
                            <ImageMinus className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">{plato.nombre}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">{plato.descripcion}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{familia?.nombre || 'Sin familia'}</td>
                    <td className="px-6 py-4 font-medium text-white">{formatPrice(plato.precio)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge variant={plato.activo ? 'success' : 'default'}>
                          {plato.activo ? 'Visible' : 'Oculto'}
                        </Badge>
                        {plato.agotado && (
                          <Badge variant="danger">Agotado</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingId(plato.id)} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredPlatos.length === 0 && (
             <div className="p-8 text-center text-slate-500">
               No se encontraron platos.
             </div>
          )}
        </div>
      </Card>
    </div>
  );
}