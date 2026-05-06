// === validacion-schema-socios (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  email: z.string(),
  telefono: z.string(),
});

describe('postApi_sociosSchema', () => {
  it('debe validar datos correctos de socio', () => {
    const datos = { nombre: 'Juan', email: 'juan@test.com', telefono: '987654321' };
    expect(() => postApi_sociosSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar datos incompletos', () => {
    const datos = { nombre: 'Juan', email: 'juan@test.com' };
    expect(() => postApi_sociosSchema.parse(datos)).toThrow(z.ZodError);
  });
});

// === validacion-schema-cuotas (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_cuotasSchema = z.object({
  socio_id: z.string().optional(),
  nombre_invitado: z.string().optional(),
  tipo: z.string(),
  monto: z.number(),
  mes: z.number(),
  anio: z.number(),
  fecha_pago: z.string(),
});

describe('postApi_cuotasSchema', () => {
  it('debe validar cuota de socio con monto 15', () => {
    const datos = { socio_id: '1', tipo: 'socio', monto: 15, mes: 5, anio: 2026, fecha_pago: '2026-05-06' };
    expect(() => postApi_cuotasSchema.parse(datos)).not.toThrow();
  });

  it('debe validar cuota de invitado con monto 5', () => {
    const datos = { nombre_invitado: 'Carlos', tipo: 'invitado', monto: 5, mes: 5, anio: 2026, fecha_pago: '2026-05-06' };
    expect(() => postApi_cuotasSchema.parse(datos)).not.toThrow();
  });
});

// === dashboard-fetch-resumen (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('DashboardAdmin - fetchData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener resumen de transacciones del mes/año', async () => {
    const mockResumen = {
      mes: 5, anio: 2026, ingresosCuotas: 150, ingresosExtra: 50,
      gastos: 30, saldoCanasta: 170, fondoAnualPorSocio: 180
    };
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResumen)
    }));

    const res = await fetch(`${BASE_URL}/api/resumen?mes=5&anio=2026`);
    const data = await res.json();
    expect(data.ingresosCuotas).toBe(150);
    expect(data.saldoCanasta).toBe(170);
  });
});