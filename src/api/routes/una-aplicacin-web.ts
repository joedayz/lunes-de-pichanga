import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

const postSociosSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  email: z.string(),
  telefono: z.string().optional(),
  fecha_inscripcion: z.string(),
});

router.post("/socios", async (req: Request, res: Response) => {
  try {
    const datos = postSociosSchema.parse(req.body);
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

const postInvitadosSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  telefono: z.string().optional(),
  fecha_juego: z.string(),
});

router.post("/invitados", async (req: Request, res: Response) => {
  try {
    const datos = postInvitadosSchema.parse(req.body);
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

const postMovimientosSchema = z.object({
  tipo: z.string(),
  descripcion: z.string(),
  monto: z.number(),
  categoria: z.string(),
  fecha_movimiento: z.string(),
  socio_id: z.string().optional(),
});

router.post("/movimientos", async (req: Request, res: Response) => {
  try {
    const datos = postMovimientosSchema.parse(req.body);
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

router.get("/reportes/resumen", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get("/reportes/socios/:socio-id", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get("/reportes/canasta", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
