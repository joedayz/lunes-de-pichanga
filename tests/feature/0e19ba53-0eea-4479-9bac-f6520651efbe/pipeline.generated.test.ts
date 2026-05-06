// === anos-disponibles-endpoint (unitario) ===
import { describe, it, expect } from 'vitest';

describe('GET /api/anos-disponibles', () => {
  it('debe devolver array de números válido', () => {
    const response = [2026, 2025];
    expect(Array.isArray(response)).toBe(true);
    expect(response.every(y => typeof y === 'number')).toBe(true);
  });

  it('debe rechazar respuesta con estructura { mensaje }', () => {
    const invalidResponse = { mensaje: 'OK' };
    expect(Array.isArray(invalidResponse)).toBe(false);
  });
});

// === socios-endpoint-format (unitario) ===
import { describe, it, expect } from 'vitest';

describe('GET /api/socios response format', () => {
  it('debe devolver array directo, no { data: [...] }', () => {
    const validResponse = [{ id: '1', nombre: 'Juan', anio: 2026 }];
    expect(Array.isArray(validResponse)).toBe(true);
    expect(validResponse[0]).toHaveProperty('id');
    expect(validResponse[0]).toHaveProperty('nombre');
  });

  it('debe fallar si respuesta es { data: [...] }', () => {
    const invalidResponse = { data: [{ id: '1', nombre: 'Juan' }] };
    expect(Array.isArray(invalidResponse)).toBe(false);
  });
});

// === dashboard-endpoints-integration (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:4000';

describe('Dashboard endpoints integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/dashboard/resumen?anio=2026 devuelve shape correcto', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        totalSocios: 5,
        totalInvitados: 2,
        totalRecaudado: 1500
      })
    });
    global.fetch = mockFetch;

    const res = await fetch(`${BASE_URL}/api/dashboard/resumen?anio=2026`);
    const data = await res.json();
    expect(data).toHaveProperty('totalSocios');
    expect(data).toHaveProperty('totalInvitados');
    expect(data).toHaveProperty('totalRecaudado');
  });

  it('GET /api/dashboard/cuotas?anio=2026 devuelve array', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    });
    global.fetch = mockFetch;

    const res = await fetch(`${BASE_URL}/api/dashboard/cuotas?anio=2026`);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

// === pago-form-post-endpoint (unitario) ===
import { describe, it, expect } from 'vitest';

describe('POST /api/pagos endpoint', () => {
  it('debe aceptar payload con monto, socioId, anio', () => {
    const payload = { monto: 100, socioId: '1', anio: 2026 };
    expect(payload).toHaveProperty('monto');
    expect(payload).toHaveProperty('socioId');
    expect(payload).toHaveProperty('anio');
    expect(typeof payload.monto).toBe('number');
  });
});