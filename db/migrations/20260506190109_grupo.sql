-- Migration: 20260506190109_grupo
-- Generated: 2026-05-06T19:01:09.924Z

-- UP
CREATE TABLE IF NOT EXISTS grupo (
  id UUID PRIMARY KEY,
  nombre TEXT NOT NULL,
  recaudacion_total REAL NOT NULL,
  anio_actual INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- DOWN
DROP TABLE IF EXISTS grupo;