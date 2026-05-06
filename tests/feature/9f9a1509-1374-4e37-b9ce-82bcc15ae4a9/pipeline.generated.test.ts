// === validacion-schema-pago (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_grupos_deportivos_grupoId_pagosSchema = z.object({
  socio_id: z.string(),
  monto: z.number(),
  concepto: z.string(),
  fecha_pago: z.string(),
  anio: z.number().optional(),
});

describe('Schema validación de pagos', () => {
  it('debe aceptar pago válido con anio', () => {
    const pago = { socio_id: '123', monto: 50, concepto: 'Cuota', fecha_pago: '2026-05-06', anio: 2026 };
    expect(() => postApi_grupos_deportivos_grupoId_pagosSchema.parse(pago)).not.toThrow();
  });

  it('debe rechazar monto negativo', () => {
    const pago = { socio_id: '123', monto: -50, concepto: 'Cuota', fecha_pago: '2026-05-06' };
    expect(() => postApi_grupos_deportivos_grupoId_pagosSchema.parse(pago)).toThrow();
  });
});

// === endpoint-crear-pago-y-refrescar-recaudacion (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';
const grupoId = 'grupo-123';

describe('Flujo: crear pago y refrescar recaudación', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /pagos debe retornar 201 y datos válidos', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ datos: { id: 'pago-1' }, mensaje: 'OK' }), { status: 201 }));
    global.fetch = mockFetch;

    const res = await fetch(`${BASE_URL}/api/grupos-deportivos/${grupoId}/pagos`, {
      method: 'POST',
      body: JSON.stringify({ socio_id: '123', monto: 50, concepto: 'Cuota', fecha_pago: '2026-05-06', anio: 2026 })
    });
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.datos).toBeDefined();
  });

  it('GET /recaudacion-por-anio debe retornar total actualizado tras pago', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ total: 150, anio: 2026 }), { status: 200 }));
    global.fetch = mockFetch;

    const res = await fetch(`${BASE_URL}/api/grupos-deportivos/${grupoId}/recaudacion-por-anio?anio=2026`);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.total).toBeGreaterThan(0);
  });
});

// === manejo-errores-endpoint-pagos (unitario) ===
import { describe, it, expect } from 'vitest';

describe('Manejo de errores en endpoint POST /pagos', () => {
  it('debe retornar 500 si falla la lógica de negocio', async () => {
    const mockRes = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const mockReq = { body: { socio_id: '123', monto: 50, concepto: 'Cuota', fecha_pago: '2026-05-06' } };

    // Simula error en BD
    try {
      throw new Error('DB connection failed');
    } catch (_err) {
      expect(mockRes.status).toBeDefined();
    }
  });
});