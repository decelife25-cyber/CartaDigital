-- ============================================================
-- CartaDigital – Migración inicial
-- Supabase / PostgreSQL
-- ============================================================
-- Tablas: restaurantes, familias, alergenos, platos,
--         plato_alergenos, sugerencias
-- Incluye: updated_at automático, RLS, políticas públicas y de
--          escritura sólo por servicio/autenticado, índices.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- Función reutilizable para actualizar updated_at
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- --------------------------------------------------------
-- restaurantes (configuración del restaurante)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS restaurantes (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre           TEXT        NOT NULL,
  logo_url         TEXT,
  color_principal  TEXT        DEFAULT '#c8a96e',
  descripcion      TEXT,
  direccion        TEXT,
  telefono         TEXT,
  redes_sociales   JSONB       DEFAULT '{}',
  horario          TEXT,
  qr_url           TEXT,
  dominio          TEXT,
  activo           BOOLEAN     DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_restaurantes_updated_at
BEFORE UPDATE ON restaurantes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- --------------------------------------------------------
-- familias (categorías de la carta)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS familias (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id  UUID        REFERENCES restaurantes(id) ON DELETE CASCADE,
  nombre          TEXT        NOT NULL,
  descripcion     TEXT,
  activo          BOOLEAN     DEFAULT true,
  orden           INTEGER     DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_familias_restaurante_orden
  ON familias (restaurante_id, orden) WHERE activo = true;

CREATE OR REPLACE TRIGGER trg_familias_updated_at
BEFORE UPDATE ON familias
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- --------------------------------------------------------
-- alergenos (catálogo global de alérgenos)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS alergenos (
  id          UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      TEXT  NOT NULL UNIQUE,
  sigla       TEXT  NOT NULL UNIQUE,
  icono       TEXT,
  descripcion TEXT,
  orden       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alergenos_orden ON alergenos (orden);

CREATE OR REPLACE TRIGGER trg_alergenos_updated_at
BEFORE UPDATE ON alergenos
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- --------------------------------------------------------
-- platos (productos de la carta)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS platos (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id  UUID        REFERENCES restaurantes(id) ON DELETE CASCADE,
  familia_id      UUID        REFERENCES familias(id)     ON DELETE SET NULL,
  nombre          TEXT        NOT NULL,
  descripcion     TEXT,
  precio          NUMERIC(10,2),
  foto_url        TEXT,
  activo          BOOLEAN     DEFAULT true,
  agotado         BOOLEAN     DEFAULT false,
  destacado       BOOLEAN     DEFAULT false,
  orden           INTEGER     DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platos_restaurante_familia_orden
  ON platos (restaurante_id, familia_id, orden) WHERE activo = true;

CREATE INDEX IF NOT EXISTS idx_platos_restaurante_orden
  ON platos (restaurante_id, orden) WHERE activo = true;

CREATE OR REPLACE TRIGGER trg_platos_updated_at
BEFORE UPDATE ON platos
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- --------------------------------------------------------
-- plato_alergenos (relación N:M platos–alérgenos)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS plato_alergenos (
  plato_id    UUID REFERENCES platos(id)    ON DELETE CASCADE,
  alergeno_id UUID REFERENCES alergenos(id) ON DELETE CASCADE,
  PRIMARY KEY (plato_id, alergeno_id)
);

CREATE INDEX IF NOT EXISTS idx_plato_alergenos_alergeno
  ON plato_alergenos (alergeno_id);

-- --------------------------------------------------------
-- sugerencias del día
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS sugerencias (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id  UUID        REFERENCES restaurantes(id) ON DELETE CASCADE,
  plato_id        UUID        REFERENCES platos(id)       ON DELETE SET NULL,
  nombre          TEXT,
  descripcion     TEXT,
  precio          NUMERIC(10,2),
  activo          BOOLEAN     DEFAULT true,
  orden           INTEGER     DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sugerencias_restaurante_orden
  ON sugerencias (restaurante_id, orden) WHERE activo = true;

CREATE OR REPLACE TRIGGER trg_sugerencias_updated_at
BEFORE UPDATE ON sugerencias
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
-- Con RLS activado sin políticas de INSERT/UPDATE/DELETE para
-- anon/authenticated, las escrituras sólo pueden realizarse
-- usando la service_role key (que omite RLS).
-- Los authenticated pueden realizar todas las operaciones
-- (panel de administración).
-- ============================================================

ALTER TABLE restaurantes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE familias         ENABLE ROW LEVEL SECURITY;
ALTER TABLE alergenos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE platos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE plato_alergenos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sugerencias      ENABLE ROW LEVEL SECURITY;

-- Lectura pública (anon + autenticado) ----------------------
DROP POLICY IF EXISTS "public_read_restaurantes"    ON restaurantes;
DROP POLICY IF EXISTS "public_read_familias"        ON familias;
DROP POLICY IF EXISTS "public_read_alergenos"       ON alergenos;
DROP POLICY IF EXISTS "public_read_platos"          ON platos;
DROP POLICY IF EXISTS "public_read_plato_alergenos" ON plato_alergenos;
DROP POLICY IF EXISTS "public_read_sugerencias"     ON sugerencias;

CREATE POLICY "public_read_restaurantes"
  ON restaurantes FOR SELECT USING (activo = true);

CREATE POLICY "public_read_familias"
  ON familias FOR SELECT USING (activo = true);

CREATE POLICY "public_read_alergenos"
  ON alergenos FOR SELECT USING (true);

CREATE POLICY "public_read_platos"
  ON platos FOR SELECT USING (activo = true);

CREATE POLICY "public_read_plato_alergenos"
  ON plato_alergenos FOR SELECT USING (true);

CREATE POLICY "public_read_sugerencias"
  ON sugerencias FOR SELECT USING (activo = true);

-- Escritura para administradores autenticados ---------------
-- (anon NO tiene políticas de escritura → sólo service_role
--  puede escribir sin autenticación)
DROP POLICY IF EXISTS "admin_all_restaurantes"    ON restaurantes;
DROP POLICY IF EXISTS "admin_all_familias"        ON familias;
DROP POLICY IF EXISTS "admin_all_alergenos"       ON alergenos;
DROP POLICY IF EXISTS "admin_all_platos"          ON platos;
DROP POLICY IF EXISTS "admin_all_plato_alergenos" ON plato_alergenos;
DROP POLICY IF EXISTS "admin_all_sugerencias"     ON sugerencias;

CREATE POLICY "admin_all_restaurantes"
  ON restaurantes FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_all_familias"
  ON familias FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_all_alergenos"
  ON alergenos FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_all_platos"
  ON platos FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_all_plato_alergenos"
  ON plato_alergenos FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_all_sugerencias"
  ON sugerencias FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- Catálogo de alérgenos (14 oficiales UE)
-- ============================================================
INSERT INTO alergenos (nombre, sigla, icono, descripcion, orden) VALUES
  ('Gluten',       'GLU', '🌾', 'Cereales con gluten: trigo, centeno, cebada, avena',                              1),
  ('Crustáceos',   'CRU', '🦐', 'Crustáceos y productos a base de crustáceos',                                      2),
  ('Huevo',        'HUE', '🥚', 'Huevos y productos a base de huevo',                                               3),
  ('Pescado',      'PES', '🐟', 'Pescado y productos a base de pescado',                                             4),
  ('Cacahuetes',   'CAC', '🥜', 'Cacahuetes y productos a base de cacahuetes',                                      5),
  ('Soja',         'SOJ', '🫘', 'Soja y productos a base de soja',                                                   6),
  ('Lácteos',      'LAC', '🥛', 'Leche y sus derivados incluida lactosa',                                            7),
  ('Frutos secos', 'FSE', '🌰', 'Frutos de cáscara: almendras, avellanas, nueces, anacardos, pistachos, piñones',  8),
  ('Apio',         'API', '🥬', 'Apio y productos derivados',                                                        9),
  ('Mostaza',      'MOS', '🌻', 'Mostaza y productos derivados',                                                    10),
  ('Sésamo',       'SES', '🌿', 'Granos de sésamo y productos derivados',                                           11),
  ('Sulfitos',     'SUL', '🍷', 'Dióxido de azufre y sulfitos en concentraciones superiores a 10 mg/kg',           12),
  ('Altramuces',   'ALT', '🌱', 'Altramuces y productos a base de altramuces',                                     13),
  ('Moluscos',     'MOL', '🦪', 'Moluscos y productos a base de moluscos',                                         14)
ON CONFLICT (sigla) DO NOTHING;
