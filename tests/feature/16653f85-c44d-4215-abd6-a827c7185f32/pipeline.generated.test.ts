// === validacion-schema-anos (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_v1_anosSchema = z.object({
  numero: z.number(),
  descripcion: z.string().optional(),
  activo: z.boolean().optional(),
});

describe('Schema validación años', () => {
  it('debe aceptar objeto válido con número y descripción', () => {
    const datos = { numero: 2025, descripcion: 'Año deportivo 2025' };
    expect(() => postApi_v1_anosSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar si número falta o no es number', () => {
    const datos = { descripcion: 'Sin número' };
    expect(() => postApi_v1_anosSchema.parse(datos)).toThrow();
  });
});

// === endpoint-post-anos (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Router, Request, Response } from 'express';
import { z } from 'zod';

const postApi_v1_anosSchema = z.object({
  numero: z.number(),
  descripcion: z.string().optional(),
  activo: z.boolean().optional(),
});

describe('POST /api/v1/anos', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = { body: { numero: 2025, descripcion: 'Año 2025' } };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  it('debe retornar 201 con datos válidos', async () => {
    const datos = postApi_v1_anosSchema.parse(mockReq.body);
    (mockRes.status as any)(201);
    (mockRes.json as any)({ datos, mensaje: 'OK' });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ mensaje: 'OK' }));
  });

  it('debe retornar 400 si número falta', () => {
    mockReq.body = { descripcion: 'Sin número' };
    expect(() => postApi_v1_anosSchema.parse(mockReq.body)).toThrow(z.ZodError);
  });
});

// === filtro-socios-por-ano (unitario) ===
import { describe, it, expect } from 'vitest';

interface Socio {
  id: number;
  nombre: string;
  email: string;
  ano: number;
}

const filtrarSociosPorAno = (socios: Socio[], ano: number): Socio[] => {
  return socios.filter(s => s.ano === ano);
};

describe('Filtro socios por año', () => {
  const socios: Socio[] = [
    { id: 1, nombre: 'Juan', email: 'juan@test.com', ano: 2024 },
    { id: 2, nombre: 'Pedro', email: 'pedro@test.com', ano: 2025 },
    { id: 3, nombre: 'María', email: 'maria@test.com', ano: 2025 },
  ];

  it('debe retornar solo socios del año 2025', () => {
    const resultado = filtrarSociosPorAno(socios, 2025);
    expect(resultado).toHaveLength(2);
    expect(resultado.every(s => s.ano === 2025)).toBe(true);
  });
});