-- Migration: 20260506135443_pichanga_asistenciapichanga
-- Generated: 2026-05-06T13:54:43.384Z

-- UP
CREATE TABLE IF NOT EXISTS pichanga (
  id UUID PRIMARY KEY,
  fecha TIMESTAMP NOT NULL,
  ubicacion TEXT NOT NULL,
  hora_inicio TEXT NOT NULL,
  hora_fin TEXT,
  estado TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS asistenciapichanga (
  id UUID PRIMARY KEY,
  pichanga_id UUID NOT NULL,
  socio_id UUID NOT NULL,
  asistio BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  pichanga_id UUID REFERENCES pichanga(id),
  socio_id UUID REFERENCES socio(id)
);

-- DOWN
DROP TABLE IF EXISTS asistenciapichanga;
DROP TABLE IF EXISTS pichanga;