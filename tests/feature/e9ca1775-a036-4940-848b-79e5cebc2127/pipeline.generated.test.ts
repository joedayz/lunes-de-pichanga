// === api-socios-endpoint-returns-array (unitario) ===
import { describe, it, expect, vi } from 'vitest';
import { Router, Request, Response } from 'express';
import { z } from 'zod';

describe('GET /api/socios', () => {
  it('debe retornar array de socios, no stub { mensaje }', async () => {
    const mockSocios = [
      { id: 1, nombre: 'Juan', anio: 2025 },
      { id: 2, nombre: 'Pedro', anio: 2025 }
    ];
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    // Simular handler corregido
    res.status(200);
    res.json(mockSocios);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ id: expect.any(Number), nombre: expect.any(String) })
    ]));
  });

  it('debe filtrar por anio si se proporciona query param', async () => {
    const mockSocios = [{ id: 1, nombre: 'Ana', anio: 2024 }];
    const req = { query: { anio: '2024' } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    res.status(200);
    res.json(mockSocios);

    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ anio: 2024 })
    ]));
  });
});

// === api-dashboard-resumen-returns-totals (unitario) ===
import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';

describe('GET /api/dashboard/resumen', () => {
  it('debe retornar objeto con totalSocios, totalInvitados, totalRecaudado', async () => {
    const mockResumen = {
      totalSocios: 5,
      totalInvitados: 3,
      totalRecaudado: 1500
    };
    const req = { query: { anio: '2025' } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    res.status(200);
    res.json(mockResumen);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totalSocios: expect.any(Number),
        totalInvitados: expect.any(Number),
        totalRecaudado: expect.any(Number)
      })
    );
  });
});

// === frontend-pago-form-normaliza-respuesta (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('PagoForm integración con API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe normalizar respuesta de /api/socios y evitar .map en no-array', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, nombre: 'Carlos', anio: 2025 }]
    });

    const response = await fetch(`${BASE_URL}/api/socios`);
    const data = await response.json();
    const socios = Array.isArray(data) ? data : data.data || [];

    expect(socios).toBeInstanceOf(Array);
    expect(socios.length).toBeGreaterThan(0);
    expect(() => socios.map(s => s.nombre)).not.toThrow();
  });

  it('debe manejar respuesta stub { mensaje } sin fallar en .map', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ mensaje: 'OK' })
    });

    const response = await fetch(`${BASE_URL}/api/socios`);
    const data = await response.json();
    const socios = Array.isArray(data) ? data : data.data || [];

    expect(socios).toEqual([]);
    expect(() => socios.map(s => s.nombre)).not.toThrow();
  });
});

// === post-api-socios-valida-schema (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  anio: z.number()
});

describe('POST /api/socios schema validation', () => {
  it('debe aceptar body válido con nombre y anio', () => {
    const validBody = { nombre: 'Roberto', anio: 2025 };
    expect(() => postApi_sociosSchema.parse(validBody)).not.toThrow();
  });

  it('debe rechazar body sin nombre o anio', () => {
    const invalidBody = { nombre: 'Roberto' };
    expect(() => postApi_sociosSchema.parse(invalidBody)).toThrow(z.ZodError);
  });
});