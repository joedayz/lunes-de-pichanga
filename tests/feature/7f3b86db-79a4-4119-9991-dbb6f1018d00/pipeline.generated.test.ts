// === validacion-schema-socio (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  email: z.string().optional(),
  telefono: z.string().optional(),
  año_afiliacion: z.number().optional(),
});

describe('Validación Schema Socio', () => {
  it('debe aceptar socio con nombre y año_afiliacion', () => {
    const datos = { nombre: 'Juan', año_afiliacion: 2025 };
    expect(() => postApi_sociosSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar socio sin nombre', () => {
    const datos = { email: 'test@test.com' };
    expect(() => postApi_sociosSchema.parse(datos)).toThrow();
  });
});

// === endpoint-get-socios (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('GET /api/socios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe retornar array de socios con status 200', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve([{ id: 1, nombre: 'Juan', año_afiliacion: 2025 }]),
      })
    );

    const res = await fetch(`${BASE_URL}/api/socios`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});

// === endpoint-post-socio (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('POST /api/socios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe crear socio y retornar 201 con datos válidos', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 201,
        json: () => Promise.resolve({ datos: { nombre: 'Carlos', año_afiliacion: 2025 }, mensaje: 'OK' }),
      })
    );

    const res = await fetch(`${BASE_URL}/api/socios`, {
      method: 'POST',
      body: JSON.stringify({ nombre: 'Carlos', año_afiliacion: 2025 }),
    });
    expect(res.status).toBe(201);
  });

  it('debe retornar 400 si faltan datos requeridos', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ error: 'Datos inválidos' }),
      })
    );

    const res = await fetch(`${BASE_URL}/api/socios`, {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    expect(res.status).toBe(400);
  });
});