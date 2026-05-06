import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

router.get("/api/grupos/:grupoId/recaudacion", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const postApi_grupos_grupoId_pagosSchema = z.object({
  socio_id: z.string(),
  monto: z.number(),
  concepto: z.string(),
  fecha_pago: z.string(),
  anio: z.number().optional(),
});

router.post("/api/grupos/:grupoId/pagos", async (req: Request, res: Response) => {
  try {
    const datos = postApi_grupos_grupoId_pagosSchema.parse(req.body);
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

router.get("/api/grupos/:grupoId/pagos", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get("/api/grupos/:grupoId/resumen-anual", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const putApi_grupos_grupoId_pagos_pagoIdSchema = z.object({
  monto: z.number().optional(),
  concepto: z.string().optional(),
  fecha_pago: z.string().optional(),
});

router.put("/api/grupos/:grupoId/pagos/:pagoId", async (req: Request, res: Response) => {
  try {
    const datos = putApi_grupos_grupoId_pagos_pagoIdSchema.parse(req.body);
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

router.delete("/api/grupos/:grupoId/pagos/:pagoId", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
