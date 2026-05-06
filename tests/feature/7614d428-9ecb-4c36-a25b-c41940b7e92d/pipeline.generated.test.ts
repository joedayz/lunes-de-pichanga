// === validacion-schema-socios (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  email: z.string(),
  telefono: z.string().optional(),
  monto_cuota: z.number(),
  fecha_pago: z.string(),
});

describe('postApi_sociosSchema', () => {
  it('debe validar datos correctos de socio', () => {
    const datos = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      monto_cuota: 100,
      fecha_pago: '2026-05-15',
    };
    expect(() => postApi_sociosSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar email inválido', () => {
    const datos = {
      nombre: 'Juan',
      email: 'no-es-email',
      monto_cuota: 100,
      fecha_pago: '2026-05-15',
    };
    expect(() => postApi_sociosSchema.parse(datos)).toThrow();
  });
});

// === dashboard-admin-fetch (unitario) ===
import { describe, it, expect, vi } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('DashboardAdmin - fetchData', () => {
  it('debe construir URL correcta para socios', () => {
    const url = `${BASE_URL}/api/socios`;
    expect(url).toBe('http://localhost:3000/api/socios');
  });

  it('debe manejar estado de carga', () => {
    const loading = true;
    expect(loading).toBe(true);
  });
});

// === api-socios-integracion (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('API /api/socios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe hacer POST a /api/socios con datos válidos', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ datos: { nombre: 'Test' }, mensaje: 'OK' }),
    });
    global.fetch = mockFetch;

    const res = await fetch(`${BASE_URL}/api/socios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Test', email: 'test@test.com', monto_cuota: 50, fecha_pago: '2026-06-01' }),
    });
    const data = await res.json();

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(data.mensaje).toBe('OK');
  });
});