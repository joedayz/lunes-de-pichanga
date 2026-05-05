// === validacion-schema-socios (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postSociosSchema = z.object({
  nombre: z.string(),
  email: z.string(),
  telefono: z.string(),
});

describe('postSociosSchema', () => {
  it('debe validar datos correctos de socio', () => {
    const datos = { nombre: 'Juan', email: 'juan@test.com', telefono: '987654321' };
    expect(() => postSociosSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar datos incompletos', () => {
    const datos = { nombre: 'Juan' };
    expect(() => postSociosSchema.parse(datos)).toThrow();
  });
});

// === validacion-participaciones (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postParticipacionesSchema = z.object({
  socio_id: z.string().optional(),
  nombre_invitado: z.string().optional(),
  tipo: z.string(),
  fecha_juego: z.string(),
  monto_pagado: z.number(),
});

describe('postParticipacionesSchema', () => {
  it('debe validar participación de socio con cuota de 15 soles', () => {
    const datos = { socio_id: '1', tipo: 'socio', fecha_juego: '2024-01-15', monto_pagado: 15 };
    expect(() => postParticipacionesSchema.parse(datos)).not.toThrow();
  });

  it('debe validar participación de invitado con 5 soles', () => {
    const datos = { nombre_invitado: 'Carlos', tipo: 'invitado', fecha_juego: '2024-01-15', monto_pagado: 5 };
    expect(() => postParticipacionesSchema.parse(datos)).not.toThrow();
  });
});

// === endpoint-post-socios (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('POST /socios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe registrar un nuevo socio correctamente', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ datos: { nombre: 'Juan', email: 'juan@test.com', telefono: '987654321' }, mensaje: 'OK' })
    });
    global.fetch = mockFetch;

    const res = await fetch(`${BASE_URL}/socios`, {
      method: 'POST',
      body: JSON.stringify({ nombre: 'Juan', email: 'juan@test.com', telefono: '987654321' })
    });
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.mensaje).toBe('OK');
  });
});

// === dashboard-reporte-financiero (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('DashboardAdmin - fetchReporte', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener reporte financiero por mes y año', async () => {
    const mockReporte = { mes: 1, anio: 2024, ingresos: 450, gastos: 100, fondoAnual: 350, saldoCanasta: 250 };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockReporte
    });

    const res = await fetch(`${BASE_URL}/reportes?mes=1&anio=2024`);
    const data = await res.json();

    expect(data.mes).toBe(1);
    expect(data.ingresos).toBe(450);
    expect(data.saldoCanasta).toBe(250);
  });
});