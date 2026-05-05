-- Migration: 20260505223056_movimiento
-- Generated: 2026-05-05T22:30:56.441Z

-- UP
CREATE TABLE IF NOT EXISTS movimiento (
  id UUID PRIMARY KEY,
  tipo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  monto REAL NOT NULL,
  categoria TEXT NOT NULL,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  fecha_movimiento TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- DOWN
DROP TABLE IF EXISTS movimiento;