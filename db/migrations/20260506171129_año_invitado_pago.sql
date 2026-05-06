-- Migration: 20260506171129_año_invitado_pago
-- Generated: 2026-05-06T17:11:29.203Z

-- UP
CREATE TABLE IF NOT EXISTS año (
  id UUID PRIMARY KEY,
  numero INTEGER NOT NULL,
  descripcion TEXT,
  activo BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS invitado (
  id UUID PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  anio_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  anio_id UUID REFERENCES año(id)
);

CREATE TABLE IF NOT EXISTS pago (
  id UUID PRIMARY KEY,
  socio_id UUID,
  invitado_id UUID,
  anio_id UUID NOT NULL,
  mes INTEGER NOT NULL,
  concepto TEXT NOT NULL,
  monto REAL NOT NULL,
  fecha_pago TIMESTAMP,
  estado TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  socio_id UUID REFERENCES socio(id),
  invitado_id UUID REFERENCES invitado(id),
  anio_id UUID REFERENCES año(id)
);

-- DOWN
DROP TABLE IF EXISTS pago;
DROP TABLE IF EXISTS invitado;
DROP TABLE IF EXISTS año;