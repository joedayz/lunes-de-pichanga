// === validacion-schema-pago (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_grupos_grupoId_pagosSchema = z.object({
  socio_id: z.string(),
  monto: z.number(),
  concepto: z.string(),
  fecha_pago: z.string(),
  anio: z.number().optional(),
});

describe('Schema validación pagos', () => {
  it('debe aceptar pago válido con año', () => {
    const pago = { socio_id: '123', monto: 100, concepto: 'Cuota', fecha_pago: '2026-05-06', anio: 2026 };
    expect(() => postApi_grupos_grupoId_pagosSchema.parse(pago)).not.toThrow();
  });

  it('debe rechazar pago sin socio_id', () => {
    const pago = { monto: 100, concepto: 'Cuota', fecha_pago: '2026-05-06' };
    expect(() => postApi_grupos_grupoId_pagosSchema.parse(pago)).toThrow();
  });
});

// === endpoint-crear-pago (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';
const grupoId = 'grupo-123';

describe('POST /api/grupos/:grupoId/pagos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe crear pago y retornar 201', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ datos: { socio_id: '123', monto: 100 }, mensaje: 'OK' })
    });
    global.fetch = mockFetch;

    const res = await fetch(`${BASE_URL}/api/grupos/${grupoId}/pagos`, {
      method: 'POST',
      body: JSON.stringify({ socio_id: '123', monto: 100, concepto: 'Cuota', fecha_pago: '2026-05-06' })
    });

    expect(res.status).toBe(201);
    expect(mockFetch).toHaveBeenCalledOnce();
  });
});

// === refresco-recaudacion-post-pago (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';
const grupoId = 'grupo-123';
const anio = 2026;

describe('Sincronización recaudación post-pago', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe refrescar recaudación después de crear pago sin F5', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 201, json: async () => ({ mensaje: 'OK' }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ total: 500, anio }) });
    global.fetch = mockFetch;

    await fetch(`${BASE_URL}/api/grupos/${grupoId}/pagos`, {
      method: 'POST',
      body: JSON.stringify({ socio_id: '123', monto: 100, concepto: 'Cuota', fecha_pago: '2026-05-06', anio })
    });

    const recaudacion = await fetch(`${BASE_URL}/api/grupos/${grupoId}/recaudacion?anio=${anio}`);
    const data = await recaudacion.json();

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(data.total).toBe(500);
  });
});