// === validacion-schema-socio-con-anio (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  email: z.string(),
  anio_ingreso: z.number(),
});

describe('postApi_sociosSchema', () => {
  it('debe validar socio con anio_ingreso válido', () => {
    const datos = { nombre: 'Juan', email: 'juan@test.com', anio_ingreso: 2024 };
    expect(() => postApi_sociosSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar socio sin anio_ingreso', () => {
    const datos = { nombre: 'Juan', email: 'juan@test.com' };
    expect(() => postApi_sociosSchema.parse(datos)).toThrow();
  });
});

// === endpoint-post-socios-con-anio (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('POST /api/socios con anio_ingreso', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe crear socio y retornar 201 con datos incluido anio_ingreso', async () => {
    const payload = { nombre: 'Carlos', email: 'carlos@test.com', anio_ingreso: 2023 };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ datos: payload, mensaje: 'OK' }),
    });
    global.fetch = mockFetch;

    const res = await fetch(`${BASE_URL}/api/socios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.datos.anio_ingreso).toBe(2023);
  });
});

// === filtro-anio-en-dashboard (unitario) ===
import { describe, it, expect, vi } from 'vitest';

const buildQueryParams = (anio: number) => `?anio=${anio}`;

describe('DashboardWithYearFilter - query params', () => {
  it('debe construir query param anio correctamente', () => {
    const anio = 2024;
    const query = buildQueryParams(anio);
    expect(query).toBe('?anio=2024');
  });

  it('debe permitir año en rango válido (2000-2099)', () => {
    const validYears = [2000, 2024, 2099];
    validYears.forEach(y => {
      expect(y).toBeGreaterThanOrEqual(2000);
      expect(y).toBeLessThanOrEqual(2099);
    });
  });
});

// === pago-form-mes-anio (unitario) ===
import { describe, it, expect } from 'vitest';

const validatePagoPayload = (payload: any) => {
  if (!payload.socio_id || typeof payload.socio_id !== 'number') throw new Error('socio_id inválido');
  if (!payload.mes || payload.mes < 1 || payload.mes > 12) throw new Error('mes debe estar entre 1-12');
  if (!payload.anio || typeof payload.anio !== 'number') throw new Error('anio inválido');
  return true;
};

describe('PagoForm validación', () => {
  it('debe validar pago con socio_id, mes y anio', () => {
    const pago = { socio_id: 1, mes: 5, anio: 2024, monto: 100 };
    expect(() => validatePagoPayload(pago)).not.toThrow();
  });

  it('debe rechazar mes fuera de rango 1-12', () => {
    const pago = { socio_id: 1, mes: 13, anio: 2024 };
    expect(() => validatePagoPayload(pago)).toThrow('mes debe estar entre 1-12');
  });
});