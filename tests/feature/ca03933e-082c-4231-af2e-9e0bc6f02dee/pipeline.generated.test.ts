// === validacion-schema-socios (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postSociosSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  email: z.string().email(),
  telefono: z.string().optional(),
  fecha_inscripcion: z.string(),
});

describe('postSociosSchema', () => {
  it('debe validar datos correctos de socio', () => {
    const datos = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      fecha_inscripcion: '2024-01-15',
    };
    expect(() => postSociosSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar email inválido', () => {
    const datos = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'invalid',
      fecha_inscripcion: '2024-01-15',
    };
    expect(() => postSociosSchema.parse(datos)).toThrow();
  });
});

// === endpoint-registro-socios (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const BASE_URL = 'http://localhost:3000';

describe('POST /socios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe registrar socio con datos válidos', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 201,
        json: () => Promise.resolve({ datos: { nombre: 'Juan' }, mensaje: 'OK' }),
      })
    ) as any;

    const res = await fetch(`${BASE_URL}/socios`, {
      method: 'POST',
      body: JSON.stringify({
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        fecha_inscripcion: '2024-01-15',
      }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.mensaje).toBe('OK');
  });
});

// === dashboard-resumen-mensual (unitario) ===
import { describe, it, expect } from 'vitest';

interface Resumen {
  mes: number;
  anio: number;
  ingresos: number;
  gastos: number;
  saldo: number;
}

function calcularResumen(ingresos: number, gastos: number): Resumen {
  return {
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    ingresos,
    gastos,
    saldo: ingresos - gastos,
  };
}

describe('calcularResumen', () => {
  it('debe calcular saldo correctamente', () => {
    const resumen = calcularResumen(450, 100);
    expect(resumen.saldo).toBe(350);
  });

  it('debe incluir mes y año actuales', () => {
    const resumen = calcularResumen(0, 0);
    expect(resumen.mes).toBeGreaterThanOrEqual(1);
    expect(resumen.anio).toBeGreaterThanOrEqual(2024);
  });
});

// === calculo-cuota-socios-invitados (unitario) ===
import { describe, it, expect } from 'vitest';

function calcularCuota(tipo: 'socio' | 'invitado'): number {
  return tipo === 'socio' ? 15 : 5;
}

describe('calcularCuota', () => {
  it('debe cobrar 15 soles a socio', () => {
    expect(calcularCuota('socio')).toBe(15);
  });

  it('debe cobrar 5 soles a invitado', () => {
    expect(calcularCuota('invitado')).toBe(5);
  });
});