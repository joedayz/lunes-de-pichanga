import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

interface Socio {
  id: string;
  nombre: string;
  estado: string;
  fechaIngreso: string;
}

interface Pago {
  id: string;
  socioId: string;
  monto: number;
  fecha: string;
  concepto: string;
}

interface Invitado {
  id: string;
  nombre: string;
  socioId: string;
  fecha: string;
}

const socios: Socio[] = [
  { id: '1', nombre: 'Juan Pérez', estado: 'activo', fechaIngreso: '2024-01-15' },
  { id: '2', nombre: 'Carlos López', estado: 'activo', fechaIngreso: '2024-02-20' },
];

const pagos: Pago[] = [
  { id: '1', socioId: '1', monto: 50000, fecha: '2025-01-10', concepto: 'Cuota mensual' },
  { id: '2', socioId: '2', monto: 50000, fecha: '2025-01-12', concepto: 'Cuota mensual' },
];

const invitados: Invitado[] = [
  { id: '1', nombre: 'Pedro García', socioId: '1', fecha: '2025-01-15' },
];

const getYearFromQuery = (req: Request): number => {
  const anio = req.query.anio || req.query.año;
  return anio ? Number(anio) : new Date().getFullYear();
};

app.get('/api/dashboard', (req: Request, res: Response) => {
  const year = getYearFromQuery(req);
  const filteredSocios = socios.filter((s) => new Date(s.fechaIngreso).getFullYear() <= year);
  const filteredPagos = pagos.filter((p) => new Date(p.fecha).getFullYear() === year);
  const filteredInvitados = invitados.filter((i) => new Date(i.fecha).getFullYear() === year);
  const recaudoTotal = filteredPagos.reduce((sum, p) => sum + (p.monto || 0), 0);

  res.json({
    totalSocios: filteredSocios.length,
    totalPagos: filteredPagos.length,
    totalInvitados: filteredInvitados.length,
    recaudoTotal,
  });
});

app.get('/api/socios', (req: Request, res: Response) => {
  const year = getYearFromQuery(req);
  const estado = req.query.estado as string | undefined;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  let filtered = socios.filter((s) => new Date(s.fechaIngreso).getFullYear() <= year);
  if (estado) filtered = filtered.filter((s) => s.estado === estado);

  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  res.json({ data: paged, total: filtered.length, page, limit });
});

app.post('/api/socios', (req: Request, res: Response) => {
  const { nombre, estado = 'activo' } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre requerido' });

  const newSocio: Socio = {
    id: String(socios.length + 1),
    nombre,
    estado,
    fechaIngreso: new Date().toISOString().split('T')[0],
  };
  socios.push(newSocio);
  res.status(201).json(newSocio);
});

app.get('/api/socios/:id', (req: Request, res: Response) => {
  const socio = socios.find((s) => s.id === req.params.id);
  if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });
  res.json(socio);
});

app.put('/api/socios/:id', (req: Request, res: Response) => {
  const socio = socios.find((s) => s.id === req.params.id);
  if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });

  Object.assign(socio, req.body);
  res.json(socio);
});

app.delete('/api/socios/:id', (req: Request, res: Response) => {
  const idx = socios.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Socio no encontrado' });

  socios.splice(idx, 1);
  res.status(204).send();
});

app.get('/api/pagos', (req: Request, res: Response) => {
  const year = getYearFromQuery(req);
  const filtered = pagos.filter((p) => new Date(p.fecha).getFullYear() === year);
  res.json(filtered);
});

app.post('/api/pagos', (req: Request, res: Response) => {
  const { socioId, monto, concepto } = req.body;
  if (!socioId || !monto) return res.status(400).json({ error: 'socioId y monto requeridos' });

  const newPago: Pago = {
    id: String(pagos.length + 1),
    socioId,
    monto,
    concepto: concepto || 'Pago',
    fecha: new Date().toISOString().split('T')[0],
  };
  pagos.push(newPago);
  res.status(201).json(newPago);
});

app.get('/api/pagos/:id', (req: Request, res: Response) => {
  const pago = pagos.find((p) => p.id === req.params.id);
  if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
  res.json(pago);
});

app.put('/api/pagos/:id', (req: Request, res: Response) => {
  const pago = pagos.find((p) => p.id === req.params.id);
  if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });

  Object.assign(pago, req.body);
  res.json(pago);
});

app.get('/api/invitados', (req: Request, res: Response) => {
  const year = getYearFromQuery(req);
  const filtered = invitados.filter((i) => new Date(i.fecha).getFullYear() === year);
  res.json(filtered);
});

app.post('/api/invitados', (req: Request, res: Response) => {
  const { nombre, socioId } = req.body;
  if (!nombre || !socioId) return res.status(400).json({ error: 'nombre y socioId requeridos' });

  const newInvitado: Invitado = {
    id: String(invitados.length + 1),
    nombre,
    socioId,
    fecha: new Date().toISOString().split('T')[0],
  };
  invitados.push(newInvitado);
  res.status(201).json(newInvitado);
});

app.get('/api/invitados/:id', (req: Request, res: Response) => {
  const invitado = invitados.find((i) => i.id === req.params.id);
  if (!invitado) return res.status(404).json({ error: 'Invitado no encontrado' });
  res.json(invitado);
});

app.put('/api/invitados/:id', (req: Request, res: Response) => {
  const invitado = invitados.find((i) => i.id === req.params.id);
  if (!invitado) return res.status(404).json({ error: 'Invitado no encontrado' });

  Object.assign(invitado, req.body);
  res.json(invitado);
});

app.delete('/api/invitados/:id', (req: Request, res: Response) => {
  const idx = invitados.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Invitado no encontrado' });

  invitados.splice(idx, 1);
  res.status(204).send();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});

export default app;
