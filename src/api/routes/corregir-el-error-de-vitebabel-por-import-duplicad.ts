import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

router.get("/api/socios", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  email: z.string(),
  telefono: z.string().optional(),
  monto_cuota: z.number(),
  fecha_pago: z.string(),
});

router.post("/api/socios", async (req: Request, res: Response) => {
  try {
    const datos = postApi_sociosSchema.parse(req.body);
    // TODO: implementar lógica de negocio
    res.status(201).json({ datos, mensaje: 'OK' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', detalles: err.errors });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

router.get("/api/socios/:id", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get("/api/cuotas", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const patchApi_cuotas_idSchema = z.object({
  estado: z.string(),
  fecha_pago: z.string().optional(),
  monto_pagado: z.number().optional(),
});

router.patch("/api/cuotas/:id", async (req: Request, res: Response) => {
  try {
    const datos = patchApi_cuotas_idSchema.parse(req.body);
    // TODO: implementar lógica de negocio
    res.status(200).json({ datos, mensaje: 'OK' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', detalles: err.errors });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

router.get("/api/dashboard/resumen", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
