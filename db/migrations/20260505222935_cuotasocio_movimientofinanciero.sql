-- Migration: 20260505222935_cuotasocio_movimientofinanciero
-- Generated: 2026-05-05T22:29:35.173Z

-- UP
CREATE TABLE IF NOT EXISTS cuotasocio (
  id UUID PRIMARY KEY,
  socio_id UUID NOT NULL,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  monto REAL NOT NULL,
  estado_pago TEXT NOT NULL,
  fecha_pago TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  socio_id UUID REFERENCES socio(id)
);

CREATE TABLE IF NOT EXISTS movimientofinanciero (
  id UUID PRIMARY KEY,
  tipo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  monto REAL NOT NULL,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  fecha_movimiento TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- DOWN
DROP TABLE IF EXISTS movimientofinanciero;
DROP TABLE IF EXISTS cuotasocio;