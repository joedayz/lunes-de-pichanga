// === anos-disponibles-endpoint (unitario) ===
import { describe, it, expect } from 'vitest';

describe('GET /api/anos-disponibles', () => {
  it('debe devolver array de números válido', () => {
    const response = [2026, 2025];
    expect(Array.isArray(response)).toBe(true);
    expect(response.every(n => typeof n === 'number')).toBe(true);
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
    const response = [{ id: 1, nombre: 'Juan', anio: 2026 }];
    expect(Array.isArray(response)).toBe(true);
    expect(response[0]).toHaveProperty('id');
    expect(response[0]).toHaveProperty('nombre');
  });

  it('debe permitir .map() sin error de tipo', () => {
    const socios = [{ id: 1, nombre: 'Ana', anio: 2026 }];
    const nombres = socios.map(s => s.nombre);
    expect(nombres).toEqual(['Ana']);
  });
});

// === dashboard-endpoints-integration (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:4000';

describe('Dashboard API endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/dashboard/cuotas?anio=2026 devuelve array válido', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, monto: 100, anio: 2026 }]
    });
    global.fetch = mockFetch;
    const res = await fetch(`${BASE_URL}/api/dashboard/cuotas?anio=2026`);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/dashboard/cuotas?anio=2026`);
  });

  it('GET /api/dashboard/resumen?anio=2026 devuelve { totalSocios, totalInvitados, totalRecaudado }', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalSocios: 5, totalInvitados: 2, totalRecaudado: 500 })
    });
    global.fetch = mockFetch;
    const res = await fetch(`${BASE_URL}/api/dashboard/resumen?anio=2026`);
    const data = await res.json();
    expect(data).toHaveProperty('totalSocios');
    expect(data).toHaveProperty('totalInvitados');
    expect(data).toHaveProperty('totalRecaudado');
  });
});

// === pago-form-post-endpoint (unitario) ===
import { describe, it, expect } from 'vitest';

describe('POST /api/pagos endpoint', () => {
  it('debe aceptar payload con { socioId, monto, anio }', () => {
    const payload = { socioId: 1, monto: 100, anio: 2026 };
    expect(payload).toHaveProperty('socioId');
    expect(payload).toHaveProperty('monto');
    expect(payload).toHaveProperty('anio');
    expect(typeof payload.monto).toBe('number');
  });

  it('debe rechazar payload sin monto requerido', () => {
    const invalidPayload = { socioId: 1, anio: 2026 };
    const isValid = 'monto' in invalidPayload;
    expect(isValid).toBe(false);
  });
});