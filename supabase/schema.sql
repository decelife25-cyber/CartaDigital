CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS restaurantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  logo_url TEXT,
  color_principal TEXT DEFAULT '#c8a96e',
  descripcion TEXT,
  direccion TEXT,
  telefono TEXT,
  redes_sociales JSONB DEFAULT '{}',
  horario TEXT,
  qr_url TEXT,
  dominio TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS familias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id UUID REFERENCES restaurantes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alergenos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE,
  sigla TEXT NOT NULL UNIQUE,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS platos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id UUID REFERENCES restaurantes(id) ON DELETE CASCADE,
  familia_id UUID REFERENCES familias(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2),
  foto_url TEXT,
  activo BOOLEAN DEFAULT true,
  agotado BOOLEAN DEFAULT false,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plato_alergenos (
  plato_id UUID REFERENCES platos(id) ON DELETE CASCADE,
  alergeno_id UUID REFERENCES alergenos(id) ON DELETE CASCADE,
  PRIMARY KEY (plato_id, alergeno_id)
);

CREATE TABLE IF NOT EXISTS sugerencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id UUID REFERENCES restaurantes(id) ON DELETE CASCADE,
  plato_id UUID REFERENCES platos(id) ON DELETE SET NULL,
  nombre TEXT,
  descripcion TEXT,
  precio NUMERIC(10,2),
  activo BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE restaurantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE familias ENABLE ROW LEVEL SECURITY;
ALTER TABLE alergenos ENABLE ROW LEVEL SECURITY;
ALTER TABLE platos ENABLE ROW LEVEL SECURITY;
ALTER TABLE plato_alergenos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sugerencias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read restaurantes" ON restaurantes;
DROP POLICY IF EXISTS "Public read familias" ON familias;
DROP POLICY IF EXISTS "Public read alergenos" ON alergenos;
DROP POLICY IF EXISTS "Public read platos" ON platos;
DROP POLICY IF EXISTS "Public read plato_alergenos" ON plato_alergenos;
DROP POLICY IF EXISTS "Public read sugerencias" ON sugerencias;
DROP POLICY IF EXISTS "Admin all restaurantes" ON restaurantes;
DROP POLICY IF EXISTS "Admin all familias" ON familias;
DROP POLICY IF EXISTS "Admin all alergenos" ON alergenos;
DROP POLICY IF EXISTS "Admin all platos" ON platos;
DROP POLICY IF EXISTS "Admin all plato_alergenos" ON plato_alergenos;
DROP POLICY IF EXISTS "Admin all sugerencias" ON sugerencias;

CREATE POLICY "Public read restaurantes" ON restaurantes FOR SELECT USING (activo = true);
CREATE POLICY "Public read familias" ON familias FOR SELECT USING (activo = true);
CREATE POLICY "Public read alergenos" ON alergenos FOR SELECT USING (true);
CREATE POLICY "Public read platos" ON platos FOR SELECT USING (activo = true);
CREATE POLICY "Public read plato_alergenos" ON plato_alergenos FOR SELECT USING (true);
CREATE POLICY "Public read sugerencias" ON sugerencias FOR SELECT USING (activo = true);

CREATE POLICY "Admin all restaurantes" ON restaurantes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin all familias" ON familias FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin all alergenos" ON alergenos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin all platos" ON platos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin all plato_alergenos" ON plato_alergenos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin all sugerencias" ON sugerencias FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO alergenos (nombre, sigla, descripcion) VALUES
  ('Gluten', 'GLU', 'Cereales con gluten: trigo, centeno, cebada, avena'),
  ('Crustáceos', 'CRU', 'Crustáceos y productos a base de crustáceos'),
  ('Huevo', 'HUE', 'Huevos y productos a base de huevo'),
  ('Pescado', 'PES', 'Pescado y productos a base de pescado'),
  ('Cacahuetes', 'CAC', 'Cacahuetes y productos a base de cacahuetes'),
  ('Soja', 'SOJ', 'Soja y productos a base de soja'),
  ('Lácteos', 'LAC', 'Leche y sus derivados incluida lactosa'),
  ('Frutos secos', 'FSE', 'Frutos de cáscara: almendras, avellanas, nueces, anacardos, pistachos, piñones'),
  ('Apio', 'API', 'Apio y productos derivados'),
  ('Mostaza', 'MOS', 'Mostaza y productos derivados'),
  ('Sésamo', 'SES', 'Granos de sésamo y productos derivados'),
  ('Sulfitos', 'SUL', 'Dióxido de azufre y sulfitos en concentraciones superiores a 10mg/kg'),
  ('Altramuces', 'ALT', 'Altramuces y productos a base de altramuces'),
  ('Moluscos', 'MOL', 'Moluscos y productos a base de moluscos')
ON CONFLICT (sigla) DO NOTHING;
