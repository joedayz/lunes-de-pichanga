import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

type Socio = {
  id: string;
  nombre: string;
  email: string;
  estado: 'activo' | 'inactivo';
};

// Demo-only: almacenamiento en memoria para que la UI funcione sin DB.
const socios: Socio[] = [];

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  email: z.string(),
  telefono: z.string(),
});

router.get("/api/socios", async (_req: Request, res: Response) => {
  res.status(200).json({ data: socios });
});

router.post("/api/socios", async (req: Request, res: Response) => {
  try {
    const datos = postApi_sociosSchema.parse(req.body);
    const nuevo: Socio = {
      id: String(Date.now()),
      nombre: datos.nombre,
      email: datos.email,
      estado: 'activo',
    };
    socios.push(nuevo);
    res.status(201).json({ datos: nuevo, mensaje: 'OK' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', detalles: err.errors });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

router.get("/api/dashboard/resumen", async (_req: Request, res: Response) => {
  res.status(200).json({
    sociosActivos: socios.filter((s) => s.estado === 'activo').length,
    cuotasPendientes: 0,
    proximasPichangas: 0,
    recaudoTotal: 0,
  });
});

const postApi_cuotasSchema = z.object({
  socio_id: z.string().optional(),
  nombre_invitado: z.string().optional(),
  tipo: z.string(),
  monto: z.number(),
  mes: z.number(),
  anio: z.number(),
  fecha_pago: z.string(),
});

router.post("/api/cuotas", async (req: Request, res: Response) => {
  try {
    const datos = postApi_cuotasSchema.parse(req.body);
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

const postApi_transaccionesSchema = z.object({
  tipo: z.string(),
  categoria: z.string(),
  descripcion: z.string(),
  monto: z.number(),
  mes: z.number(),
  anio: z.number(),
  fecha_transaccion: z.string(),
});

router.post("/api/transacciones", async (req: Request, res: Response) => {
  try {
    const datos = postApi_transaccionesSchema.parse(req.body);
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

router.get("/api/reportes/resumen", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get("/api/socios/:socioId/fondo", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get("/api/reportes/detalles", async (req: Request, res: Response) => {
  try {
    // TODO: implementar lógica de negocio
    res.status(200).json({ mensaje: 'OK' });
  } catch (_err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
