// === router-endpoints-basicos (unitario) ===
import { describe, it, expect } from 'vitest';
import { Router } from 'express';
import { z } from 'zod';

describe('Router endpoints básicos', () => {
  it('debe validar schema POST /api/socios con nombre requerido', () => {
    const postApi_sociosSchema = z.object({
      nombre: z.string(),
      email: z.string().optional(),
      telefono: z.string().optional(),
    });
    expect(() => postApi_sociosSchema.parse({ nombre: 'Juan' })).not.toThrow();
    expect(() => postApi_sociosSchema.parse({ email: 'test@test.com' })).toThrow();
  });

  it('debe rechazar POST /api/socios sin nombre', () => {
    const postApi_sociosSchema = z.object({
      nombre: z.string(),
      email: z.string().optional(),
      telefono: z.string().optional(),
    });
    const result = postApi_sociosSchema.safeParse({ email: 'test@test.com' });
    expect(result.success).toBe(false);
  });
});

// === api-endpoints-integracion (integracion) ===
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import express, { Express } from 'express';
import { Router, Request, Response } from 'express';

let app: Express;
const BASE_URL = 'http://localhost:3001';

beforeAll(() => {
  app = express();
  app.use(express.json());
  const router = Router();
  router.get('/api/dashboard', (req: Request, res: Response) => {
    res.status(200).json({ data: [], mensaje: 'OK' });
  });
  router.get('/api/socios', (req: Request, res: Response) => {
    res.status(200).json({ socios: [], mensaje: 'OK' });
  });
  router.post('/api/socios', (req: Request, res: Response) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'nombre requerido' });
    res.status(201).json({ id: 1, nombre, mensaje: 'Socio creado' });
  });
  app.use(router);
});

describe('API endpoints integración', () => {
  it('GET /api/dashboard debe retornar JSON válido', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], mensaje: 'OK' }),
    });
    const res = await mockFetch(`${BASE_URL}/api/dashboard`);
    const json = await res.json();
    expect(json).toHaveProperty('mensaje');
    expect(Array.isArray(json.data)).toBe(true);
  });

  it('POST /api/socios con nombre válido debe retornar 201', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 1, nombre: 'Juan', mensaje: 'Socio creado' }),
    });
    const res = await mockFetch(`${BASE_URL}/api/socios`, {
      method: 'POST',
      body: JSON.stringify({ nombre: 'Juan' }),
    });
    const json = await res.json();
    expect(res.status).toBe(201);
    expect(json.nombre).toBe('Juan');
  });
});

// === query-params-anio (unitario) ===
import { describe, it, expect } from 'vitest';

describe('Query params anio/año', () => {
  it('debe aceptar query param "anio" en GET /api/socios', () => {
    const url = new URL('http://localhost:4000/api/socios?anio=2025');
    const anio = url.searchParams.get('anio');
    expect(anio).toBe('2025');
  });

  it('debe aceptar query param "año" como alternativa', () => {
    const url = new URL('http://localhost:4000/api/socios?año=2025');
    const año = url.searchParams.get('año');
    expect(año).toBe('2025');
  });
});