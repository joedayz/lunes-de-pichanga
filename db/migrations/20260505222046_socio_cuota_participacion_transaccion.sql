-- Migration: 20260505222046_socio_cuota_participacion_transaccion
-- Generated: 2026-05-05T22:20:46.386Z

-- UP
CREATE TABLE IF NOT EXISTS socio (
  id UUID PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  fecha_ingreso TIMESTAMP NOT NULL,
  estado TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS cuota (
  id UUID PRIMARY KEY,
  socio_id UUID NOT NULL,
  monto REAL NOT NULL,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  fecha_pago TIMESTAMP,
  estado TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  socio_id UUID REFERENCES socio(id)
);

CREATE TABLE IF NOT EXISTS participacion (
  id UUID PRIMARY KEY,
  socio_id UUID,
  nombre_invitado TEXT,
  tipo TEXT NOT NULL,
  fecha_juego TIMESTAMP NOT NULL,
  monto_pagado REAL NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  socio_id UUID REFERENCES socio(id)
);

CREATE TABLE IF NOT EXISTS transaccion (
  id UUID PRIMARY KEY,
  tipo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descripcion TEXT,
  monto REAL NOT NULL,
  mes INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  fecha_transaccion TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- DOWN
DROP TABLE IF EXISTS transaccion;
DROP TABLE IF EXISTS participacion;
DROP TABLE IF EXISTS cuota;
DROP TABLE IF EXISTS socio;