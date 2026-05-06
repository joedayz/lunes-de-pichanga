-- Migration: 20260506190238_grupodeportivo
-- Generated: 2026-05-06T19:02:38.954Z

-- UP
CREATE TABLE IF NOT EXISTS grupodeportivo (
  id UUID PRIMARY KEY,
  nombre TEXT NOT NULL,
  recaudacion_total REAL NOT NULL,
  anio_actual INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- DOWN
DROP TABLE IF EXISTS grupodeportivo;