import { useState, type FormEvent } from 'react';
import { Save, Store, Palette, Globe, MapPin, Phone, Hash, MessageCircle, Share2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

import { useRestaurante } from '../../hooks/useRestaurante';
import type { Restaurante } from '../../types/database';
import { Card } from '../../components/admin/shared/Card';
import { Button } from '../../components/admin/shared/Button';
import { Input } from '../../components/admin/shared/Input';

export function ConfigPage() {
  const { restaurante, refreshData } = useRestaurante();
  const [form, setForm] = useState<Partial<Restaurante>>(restaurante || {});
  const [saving, setSaving] = useState(false);

  const social = (form.redes_sociales || {}) as Record<string, string>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Dummy submit delay
    setTimeout(() => {
      setSaving(false);
      refreshData();
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-1">
            Personalización
          </p>
          <h1 className="font-display text-3xl text-white">Configuración</h1>
        </div>
        <Button onClick={handleSubmit} disabled={saving} className="gap-2">
          <Save className="h-5 w-5" /> {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">

          <Card className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Store className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-medium text-white">Información Básica</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Nombre del restaurante"
                value={form.nombre || ''}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Descripción</label>
                <textarea
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  rows={3}
                  value={form.descripcion || ''}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <MapPin className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-medium text-white">Contacto y Ubicación</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Dirección completa"
                value={form.direccion || ''}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                icon={<MapPin className="h-4 w-4" />}
              />
              <Input
                label="Teléfono"
                value={form.telefono || ''}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                icon={<Phone className="h-4 w-4" />}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Horario de apertura</label>
              <textarea
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white focus:border-amber-500 focus:outline-none font-mono text-sm"
                rows={4}
                value={form.horario || ''}
                onChange={(e) => setForm({ ...form, horario: e.target.value })}
                placeholder="Lunes - Viernes: 12:00 - 23:00&#10;Sábados y Domingos: 13:00 - 00:00"
              />
            </div>
          </Card>

          <Card className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Globe className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-medium text-white">Redes Sociales</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Instagram"
                value={social.instagram || ''}
                onChange={(e) => setForm({ ...form, redes_sociales: { ...social, instagram: e.target.value } })}
                icon={<Hash className="h-4 w-4" />}
                placeholder="@usuario"
              />
              <Input
                label="Facebook"
                value={social.facebook || ''}
                onChange={(e) => setForm({ ...form, redes_sociales: { ...social, facebook: e.target.value } })}
                icon={<MessageCircle className="h-4 w-4" />}
                placeholder="/pagina"
              />
              <Input
                label="Twitter / X"
                value={social.twitter || social.x || ''}
                onChange={(e) => setForm({ ...form, redes_sociales: { ...social, x: e.target.value } })}
                icon={<Share2 className="h-4 w-4" />}
                placeholder="@usuario"
              />
              <Input
                label="Sitio Web"
                value={social.web || ''}
                onChange={(e) => setForm({ ...form, redes_sociales: { ...social, web: e.target.value } })}
                icon={<LinkIcon className="h-4 w-4" />}
                placeholder="https://..."
              />
            </div>
          </Card>

        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">

          <Card className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Palette className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-medium text-white">Apariencia</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Logo del restaurante</label>
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer group">
                  {form.logo_url ? (
                    <img src={form.logo_url} alt="Logo" className="h-24 object-contain mb-4" />
                  ) : (
                    <div className="p-4 rounded-full bg-slate-700 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors mb-3">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                  <p className="text-xs text-slate-400 text-center">
                    Subir nuevo logo (PNG/SVG)
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Color principal</label>
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-700 bg-slate-900/50">
                  <input
                    type="color"
                    value={form.color_principal || '#c8a96e'}
                    onChange={(e) => setForm({ ...form, color_principal: e.target.value })}
                    className="h-8 w-8 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-sm text-slate-400">
                    {form.color_principal || '#c8a96e'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Globe className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-medium text-white">Acceso Carta</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Dominio personalizado"
                value={form.dominio || ''}
                onChange={(e) => setForm({ ...form, dominio: e.target.value })}
                placeholder="menu.mirestaurante.com"
              />
              <Input
                label="URL Código QR"
                value={form.qr_url || ''}
                onChange={(e) => setForm({ ...form, qr_url: e.target.value })}
                disabled
              />
            </div>
          </Card>

        </div>
      </form>
    </div>
  );
}