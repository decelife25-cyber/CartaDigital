# CartaDigital

Aplicación web completa para cartas digitales de restaurantes con zona pública y panel de administración.

Desde esta fase la app usa exclusivamente Supabase como backend y origen de datos (sin modo demo).

## Stack

- Vite + React + TypeScript
- Tailwind CSS v3
- React Router v6 con `HashRouter`
- Supabase (Auth, Database y Storage)
- PWA con `vite-plugin-pwa`
- `@hello-pangea/dnd` para reordenación
- `papaparse` para importación CSV

## Puesta en marcha local

### 1. Instala dependencias

```bash
npm install
```

### 2. Configura las variables de entorno

Copia `.env.example` a `.env` y rellena tus credenciales de Supabase:

```bash
cp .env.example .env
```

Edita `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
# Opcional: si tienes varios restaurantes, fija el UUID del tuyo
VITE_RESTAURANTE_ID=
```

Estas claves las encuentras en tu proyecto de Supabase → **Settings → API**.

### 3. Aplica la migración en Supabase

Copia el contenido de `supabase/migrations/20240801000000_initial_schema.sql` y ejecútalo en el **SQL Editor** de Supabase. Esto crea todas las tablas, activa RLS y carga el catálogo de alérgenos.

También puedes usar la CLI de Supabase (si la tienes instalada):

```bash
supabase db push
```

### 4. Carga el seed de ejemplo

Para ver la app con datos reales, ejecuta `supabase/seed.sql` en el SQL Editor de Supabase.

Contiene la carta completa de **Cervecería Tapería Camborio** con familias, productos, alergenos y configuracion inicial.

Con la CLI:

```bash
supabase db reset  # aplica migraciones + seed automáticamente
```

### 5. Inicia el entorno local

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) para ver la carta pública.

El panel de administración está en `/admin`. Las credenciales de acceso las creas en Supabase → **Authentication → Users**.

## Variables de entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `VITE_SUPABASE_URL` | URL de tu proyecto Supabase | Sí |
| `VITE_SUPABASE_ANON_KEY` | Clave pública anon de Supabase | Sí |
| `VITE_RESTAURANTE_ID` | UUID del restaurante (si hay varios) | No |

## Estructura de base de datos

Las tablas se crean con la migración de `supabase/migrations/`:

| Tabla | Descripción |
|---|---|
| `configuracion_restaurante` | Configuracion del restaurante (nombre, logo, colores, contacto…) |
| `familias` | Familias de la carta |
| `productos` | Productos con precio, foto, disponibilidad y alergenos |
| `alergenos` | Catalogo de los 14 alergenos oficiales de la UE |
| `producto_alergeno` | Relacion N:M entre productos y alergenos |
| `sugerencias` | Platos o propuestas del día destacados en portada |

**RLS (Row Level Security):**
- Lectura publica (`anon`) para carta, familias, productos, alergenos y configuracion_restaurante
- Escritura sólo para usuarios autenticados (panel admin) o mediante `service_role` key

## Funcionalidades

- Carta pública con búsqueda, vistas por familia y filtrado por alérgenos
- Modal de plato con alérgenos detallados
- Sugerencias del día en portada
- Diseño mobile-first, instalable como PWA
- Panel admin con login Supabase Auth, CRUD completo de familias/platos/sugerencias, configuración e importación CSV

## Despliegue

El workflow `.github/workflows/deploy.yml` construye y publica automáticamente en GitHub Pages al hacer push a `main`.
