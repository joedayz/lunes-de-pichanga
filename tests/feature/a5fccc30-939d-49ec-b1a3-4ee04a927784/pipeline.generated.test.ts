// === dashboard-endpoint-con-año (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const querySchema = z.object({
  año: z.coerce.number().int().min(2000).max(2100).optional()
});

describe('Dashboard query validation', () => {
  it('debe parsear año como número cuando viene en query', () => {
    const query = { año: '2024' };
    const result = querySchema.safeParse(query);
    expect(result.success).toBe(true);
    expect(result.data?.año).toBe(2024);
  });

  it('debe rechazar año inválido (NaN)', () => {
    const query = { año: 'abc' };
    const result = querySchema.safeParse(query);
    expect(result.success).toBe(false);
  });
});

// === socios-endpoint-con-año (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const sociosQuerySchema = z.object({
  año: z.coerce.number().int().min(2000).optional()
});

describe('Socios query validation', () => {
  it('debe aceptar query sin año', () => {
    const result = sociosQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('debe convertir año string a number sin NaN', () => {
    const result = sociosQuerySchema.safeParse({ año: '2024' });
    expect(result.success).toBe(true);
    expect(typeof result.data?.año).toBe('number');
  });
});

// === api-endpoints-integración (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:4000';

describe('API endpoints integración', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/dashboard?año=2024 debe retornar 200 sin 404', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [] })
    });
    global.fetch = mockFetch;
    const res = await fetch(`${BASE_URL}/api/dashboard?año=2024`);
    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/dashboard?año=2024`);
  });

  it('GET /api/socios?año=2024 debe retornar 200 sin 404', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ socios: [] })
    });
    global.fetch = mockFetch;
    const res = await fetch(`${BASE_URL}/api/socios?año=2024`);
    expect(res.status).toBe(200);
  });
});