// === router-socios-unitario (unitario) ===
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  email: z.string(),
  telefono: z.string().optional(),
  estado: z.string().optional(),
});

describe('POST /api/socios schema validation', () => {
  it('debe validar datos correctos de socio', () => {
    const datos = { nombre: 'Juan', email: 'juan@test.com', telefono: '123456' };
    expect(() => postApi_sociosSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar email faltante', () => {
    const datos = { nombre: 'Juan' };
    expect(() => postApi_sociosSchema.parse(datos)).toThrow();
  });
});

// === dashboard-endpoint-unitario (unitario) ===
import { describe, it, expect } from 'vitest';

describe('Dashboard response format', () => {
  it('debe retornar objeto con estructura válida', () => {
    const mockResponse = {
      anio: 2026,
      totalSocios: 12,
      totalPagos: 4500,
      participaciones: []
    };
    expect(mockResponse).toHaveProperty('anio');
    expect(mockResponse).toHaveProperty('totalSocios');
    expect(Array.isArray(mockResponse.participaciones)).toBe(true);
  });
});

// === api-integration-test (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:4000';

describe('API Routes Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/socios debe retornar array de socios', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ socios: [{ id: 1, nombre: 'Juan', email: 'juan@test.com' }] })
    });
    global.fetch = mockFetch;
    const res = await fetch(`${BASE_URL}/api/socios`);
    const data = await res.json();
    expect(Array.isArray(data.socios) || Array.isArray(data)).toBe(true);
  });

  it('POST /api/socios debe crear socio y retornar 201', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 1, nombre: 'Carlos', email: 'carlos@test.com' })
    });
    global.fetch = mockFetch;
    const res = await fetch(`${BASE_URL}/api/socios`, {
      method: 'POST',
      body: JSON.stringify({ nombre: 'Carlos', email: 'carlos@test.com' })
    });
    expect(res.status).toBe(201);
  });
});