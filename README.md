# CartaDigital

Aplicación web completa para cartas digitales de restaurantes con zona pública y panel de administración.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v3
- React Router v6 con `HashRouter`
- Supabase (Auth, Database y Storage)
- PWA con `vite-plugin-pwa`
- `@hello-pangea/dnd` para reordenación
- `papaparse` para importación CSV

## Puesta en marcha

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia `.env.example` a `.env` y configura tus credenciales de Supabase:
   ```bash
   cp .env.example .env
   ```
3. Ejecuta el esquema SQL en Supabase usando `supabase/schema.sql`.
4. (Opcional) Carga datos iniciales con `supabase/seed_camborio.sql` o `seeds/camborio.csv`.
5. Inicia el entorno local:
   ```bash
   npm run dev
   ```

## Variables de entorno

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RESTAURANTE_ID=optional-restaurante-uuid
```

## Funcionalidades

- Carta pública con búsqueda, vistas por familia y filtrado por alérgenos
- Modal de plato, sugerencias del día y diseño mobile-first
- Panel admin con login, CRUD de familias/platos/sugerencias, configuración e importación CSV
- Modo demo si Supabase no está configurado
- Preparado para despliegue en GitHub Pages

## Despliegue

El workflow `.github/workflows/deploy.yml` construye y publica automáticamente en GitHub Pages al hacer push a `main`.
