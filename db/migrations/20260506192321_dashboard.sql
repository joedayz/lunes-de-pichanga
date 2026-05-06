-- Migration: 20260506192321_dashboard
-- Generated: 2026-05-06T19:23:21.266Z

-- UP
CREATE TABLE IF NOT EXISTS dashboard (
  id UUID PRIMARY KEY,
  anio INTEGER NOT NULL,
  total_socios INTEGER NOT NULL,
  total_pagos REAL NOT NULL,
  total_invitados INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- DOWN
DROP TABLE IF EXISTS dashboard;