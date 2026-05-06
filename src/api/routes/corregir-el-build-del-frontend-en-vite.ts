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
  apellido: z.string(),
  email: z.string(),
  telefono: z.string().optional(),
  monto_cuota: z.number(),
  fecha_vencimiento_cuota: z.string(),
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

router.get("/api/socios/:id/cuotas", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const patchApi_cuotas_id_pagarSchema = z.object({
  fecha_pago: z.string(),
  monto_pagado: z.number(),
});

router.patch("/api/cuotas/:id/pagar", async (req: Request, res: Response) => {
  try {
    const datos = patchApi_cuotas_id_pagarSchema.parse(req.body);
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

router.get("/api/dashboard/cuotas-vencidas", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
