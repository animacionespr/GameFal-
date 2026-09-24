-- =====================================================
-- RASTREADOR DE GOBIERNO — Schema de Base de Datos
-- Plataforma: Supabase (PostgreSQL)
-- =====================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- TABLA: officials (Funcionarios Públicos)
-- =====================================================
CREATE TABLE officials (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  nombre          TEXT NOT NULL,
  cargo           TEXT NOT NULL,
  partido         TEXT NOT NULL,
  pais            TEXT NOT NULL DEFAULT 'Puerto Rico',
  region          TEXT,
  fecha_inicio    DATE NOT NULL,
  fin_mandato     DATE NOT NULL,
  foto_url        TEXT,
  biografia       TEXT,
  sitio_web       TEXT,
  contacto        TEXT,
  administracion  TEXT,
  activo          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: performance_scores (Puntajes de Rendimiento)
-- =====================================================
CREATE TABLE performance_scores (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  official_id     UUID REFERENCES officials(id) ON DELETE CASCADE,
  puntaje         INTEGER CHECK (puntaje BETWEEN 0 AND 100),
  metodologia     TEXT,
  periodo         TEXT,
  fecha_calculo   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: promises (Promesas y Compromisos)
-- =====================================================
CREATE TYPE promise_status AS ENUM (
  'completada', 'en_progreso', 'parcialmente_completada',
  'retrasada', 'cancelada', 'desconocida'
);

CREATE TYPE verification_status AS ENUM (
  'verificado', 'parcialmente_verificado', 'pendiente', 'rechazado'
);

CREATE TABLE promises (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  official_id     UUID REFERENCES officials(id) ON DELETE CASCADE,
  titulo          TEXT NOT NULL,
  descripcion     TEXT,
  fecha_anuncio   DATE,
  fuente          TEXT NOT NULL,
  url_fuente      TEXT,
  categoria       TEXT,
  estado          promise_status NOT NULL DEFAULT 'desconocida',
  progreso        INTEGER CHECK (progreso BETWEEN 0 AND 100) DEFAULT 0,
  impacto         TEXT,
  nivel_verificacion verification_status DEFAULT 'pendiente',
  activo          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: promise_evidence (Evidencia de Promesas)
-- =====================================================
CREATE TABLE promise_evidence (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promise_id      UUID REFERENCES promises(id) ON DELETE CASCADE,
  descripcion     TEXT NOT NULL,
  fuente          TEXT,
  url_fuente      TEXT,
  fecha           DATE,
  verificacion    verification_status DEFAULT 'pendiente',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: timeline_events (Cronología)
-- =====================================================
CREATE TYPE event_category AS ENUM (
  'orden_ejecutiva', 'proyecto_iniciado', 'proyecto_completado',
  'presupuesto', 'infraestructura', 'ley_firmada', 'emergencia',
  'evento_publico', 'anuncio', 'nombramiento'
);

CREATE TABLE timeline_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  official_id     UUID REFERENCES officials(id) ON DELETE CASCADE,
  fecha           DATE NOT NULL,
  categoria       event_category NOT NULL,
  titulo          TEXT NOT NULL,
  resumen         TEXT,
  fuente          TEXT NOT NULL,
  url_fuente      TEXT,
  evidencia       TEXT,
  puntuacion_impacto INTEGER CHECK (puntuacion_impacto BETWEEN 1 AND 10),
  verificacion    verification_status DEFAULT 'pendiente',
  activo          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: statistics (Estadísticas)
-- =====================================================
CREATE TYPE trend_type AS ENUM ('subida', 'bajada', 'estable');

CREATE TABLE statistics (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  official_id     UUID REFERENCES officials(id) ON DELETE CASCADE,
  categoria       TEXT NOT NULL,
  nombre          TEXT NOT NULL,
  valor           DECIMAL,
  unidad          TEXT,
  variacion       DECIMAL,
  tendencia       trend_type DEFAULT 'estable',
  fuente          TEXT NOT NULL,
  fecha_actualizacion DATE NOT NULL,
  activo          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE statistics_history (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  statistic_id    UUID REFERENCES statistics(id) ON DELETE CASCADE,
  fecha           TEXT NOT NULL,
  valor           DECIMAL NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: news_items (Noticias y Comunicados)
-- =====================================================
CREATE TABLE news_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  official_id     UUID REFERENCES officials(id) ON DELETE CASCADE,
  titulo          TEXT NOT NULL,
  resumen         TEXT,
  contenido       TEXT,
  fuente          TEXT NOT NULL,
  url_fuente      TEXT NOT NULL,
  fecha           DATE NOT NULL,
  categoria       TEXT,
  agencia         TEXT,
  verificacion    verification_status DEFAULT 'pendiente',
  activo          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE news_tags (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id         UUID REFERENCES news_items(id) ON DELETE CASCADE,
  tag             TEXT NOT NULL
);

-- =====================================================
-- TABLA: ai_insights (Análisis de IA)
-- =====================================================
CREATE TYPE insight_type AS ENUM ('semanal', 'mensual', 'trimestral', 'anual');

CREATE TABLE ai_insights (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  official_id     UUID REFERENCES officials(id) ON DELETE CASCADE,
  tipo            insight_type NOT NULL,
  titulo          TEXT NOT NULL,
  resumen         TEXT,
  logros          JSONB DEFAULT '[]',
  desafios        JSONB DEFAULT '[]',
  tendencias      JSONB DEFAULT '[]',
  analisis_politicas JSONB DEFAULT '[]',
  fuentes         JSONB DEFAULT '[]',
  fecha_generacion DATE NOT NULL,
  activo          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: verification_queue (Cola de Verificación)
-- =====================================================
CREATE TABLE verification_queue (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo_recurso    TEXT NOT NULL,
  recurso_id      UUID NOT NULL,
  estado          TEXT DEFAULT 'pendiente',
  notas           TEXT,
  revisado_por    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES para rendimiento
-- =====================================================
CREATE INDEX idx_promises_official ON promises(official_id);
CREATE INDEX idx_promises_status ON promises(estado);
CREATE INDEX idx_timeline_official ON timeline_events(official_id);
CREATE INDEX idx_timeline_fecha ON timeline_events(fecha DESC);
CREATE INDEX idx_news_official ON news_items(official_id);
CREATE INDEX idx_news_fecha ON news_items(fecha DESC);
CREATE INDEX idx_stats_official ON statistics(official_id);
CREATE INDEX idx_insights_official ON ai_insights(official_id);

-- Búsqueda de texto completo
CREATE INDEX idx_promises_titulo_trgm ON promises USING gin(titulo gin_trgm_ops);
CREATE INDEX idx_news_titulo_trgm ON news_items USING gin(titulo gin_trgm_ops);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE promises ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública de datos activos
CREATE POLICY "Lectura pública" ON officials FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública" ON promises FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública" ON timeline_events FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública" ON statistics FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública" ON news_items FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública" ON ai_insights FOR SELECT USING (activo = true);

-- =====================================================
-- DATOS INICIALES — Gobernadora de Puerto Rico
-- =====================================================
INSERT INTO officials (slug, nombre, cargo, partido, pais, region, fecha_inicio, fin_mandato,
  foto_url, sitio_web, contacto, administracion)
VALUES (
  'jenniffer-gonzalez-colon',
  'Jenniffer González Colón',
  'Gobernadora de Puerto Rico',
  'Partido Nuevo Progresista (PNP)',
  'Estados Unidos',
  'Puerto Rico',
  '2025-01-02',
  '2028-12-31',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Jenniffer_Gonz%C3%A1lez_Col%C3%B3n.jpg/440px-Jenniffer_Gonz%C3%A1lez_Col%C3%B3n.jpg',
  'https://www.estado.pr.gov',
  'gobernadora@estado.pr.gov',
  'Administración González Colón (2025–2028)'
);
