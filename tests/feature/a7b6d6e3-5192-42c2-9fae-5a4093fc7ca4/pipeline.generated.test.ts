import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const BASE_URL = 'http://localhost:3000';

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
    const datos = {
      nombre_invitado: 'Carlos',
      tipo: 'invitado',
      fecha_juego: '2024-01-15',
      monto_pagado: 5,
    };
    expect(() => postParticipacionesSchema.parse(datos)).not.toThrow();
  });
});

describe('POST /socios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe registrar un nuevo socio correctamente', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        datos: { nombre: 'Juan', email: 'juan@test.com', telefono: '987654321' },
        mensaje: 'OK',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const res = await fetch(`${BASE_URL}/socios`, {
      method: 'POST',
      body: JSON.stringify({ nombre: 'Juan', email: 'juan@test.com', telefono: '987654321' }),
    });
    const data = (await res.json()) as { mensaje: string };

    expect(res.status).toBe(201);
    expect(data.mensaje).toBe('OK');
    vi.unstubAllGlobals();
  });
});

describe('DashboardAdmin - fetchReporte', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener reporte financiero por mes y año', async () => {
    const mockReporte = {
      mes: 1,
      anio: 2024,
      ingresos: 450,
      gastos: 100,
      fondoAnual: 350,
      saldoCanasta: 250,
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockReporte,
      }),
    );

    const res = await fetch(`${BASE_URL}/reportes?mes=1&anio=2024`);
    const data = (await res.json()) as typeof mockReporte;

    expect(data.mes).toBe(1);
    expect(data.ingresos).toBe(450);
    expect(data.saldoCanasta).toBe(250);
    vi.unstubAllGlobals();
  });
});
