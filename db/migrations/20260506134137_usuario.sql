-- Migration: 20260506134137_usuario
-- Generated: 2026-05-06T13:41:37.801Z

-- UP
CREATE TABLE IF NOT EXISTS usuario (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  rol TEXT NOT NULL,
  activo BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- DOWN
DROP TABLE IF EXISTS usuario;