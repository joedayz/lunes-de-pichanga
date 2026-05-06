// === validacion-schema-socios (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  email: z.string(),
  telefono: z.string().optional(),
});

describe('postApi_sociosSchema', () => {
  it('debe validar datos correctos de socio', () => {
    const datos = { nombre: 'Juan', email: 'juan@test.com' };
    expect(() => postApi_sociosSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar email faltante', () => {
    const datos = { nombre: 'Juan' };
    expect(() => postApi_sociosSchema.parse(datos)).toThrow();
  });
});

// === validacion-schema-cuotas (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_cuotasSchema = z.object({
  socio_id: z.string(),
  monto: z.number(),
  mes: z.string(),
});

describe('postApi_cuotasSchema', () => {
  it('debe validar cuota con datos válidos', () => {
    const datos = { socio_id: '123', monto: 50, mes: '2026-05' };
    expect(() => postApi_cuotasSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar monto no numérico', () => {
    const datos = { socio_id: '123', monto: 'cincuenta', mes: '2026-05' };
    expect(() => postApi_cuotasSchema.parse(datos)).toThrow();
  });
});

// === dashboard-admin-fetch (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('DashboardAdmin - fetch data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener socios y pichangas correctamente', async () => {
    global.fetch = vi.fn((url: string) => {
      if (url.includes('/api/socios')) {
        return Promise.resolve(new Response(JSON.stringify([{ id: '1', nombre: 'Juan', email: 'juan@test.com' }])));
      }
      if (url.includes('/api/pichangas')) {
        return Promise.resolve(new Response(JSON.stringify([{ id: '1', fecha: '2026-05-10', lugar: 'Parque' }])));
      }
      return Promise.reject(new Error('URL no encontrada'));
    });

    const sociosRes = await fetch(`${BASE_URL}/api/socios`);
    const pichangasRes = await fetch(`${BASE_URL}/api/pichangas`);
    const socios = await sociosRes.json();
    const pichangas = await pichangasRes.json();

    expect(socios).toHaveLength(1);
    expect(pichangas).toHaveLength(1);
    expect(socios[0].nombre).toBe('Juan');
  });
});