-- Migration: 20260506144826_participacionpichanga
-- Generated: 2026-05-06T14:48:26.143Z

-- UP
CREATE TABLE IF NOT EXISTS participacionpichanga (
  id UUID PRIMARY KEY,
  pichanga_id UUID NOT NULL,
  socio_id UUID NOT NULL,
  equipo TEXT,
  asistencia BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  pichanga_id UUID REFERENCES pichanga(id),
  socio_id UUID REFERENCES socio(id)
);

-- DOWN
DROP TABLE IF EXISTS participacionpichanga;