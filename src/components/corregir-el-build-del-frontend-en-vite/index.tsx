// === DashboardAdmin ===
import React, { useEffect, useState } from 'react';

interface ResumenDashboard {
  totalSocios: number;
  cuotasPendientes: number;
  ingresosTotales: number;
  cuotasVencidas: number;
}

interface CuotaVencida {
  id: string;
  socioNombre: string;
  monto: number;
  fechaVencimiento: string;
}

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function DashboardAdmin() {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);
  const [vencidas, setVencidas] = useState<CuotaVencida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resRes, vencRes] = await Promise.all([
          fetch(`${BASE_URL}/api/dashboard/resumen`),
          fetch(`${BASE_URL}/api/dashboard/cuotas-vencidas`)
        ]);

        if (!resRes.ok || !vencRes.ok) {
          throw new Error('Error al cargar dashboard');
        }

        const resData = await resRes.json();
        const vencData = await vencRes.json();
        setResumen(resData);
        setVencidas(vencData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div role="status" aria-live="polite">Cargando dashboard...</div>;
  if (error) return <div role="alert" className="error">{error}</div>;

  return (
    <section aria-label="Dashboard administrativo" className="dashboard">
      <h1>Dashboard Administrativo</h1>
      {resumen && (
        <div className="resumen-grid">
          <div className="card">
            <h2>Total Socios</h2>
            <p className="metric">{resumen.totalSocios}</p>
          </div>
          <div className="card">
            <h2>Cuotas Pendientes</h2>
            <p className="metric">{resumen.cuotasPendientes}</p>
          </div>
          <div className="card">
            <h2>Ingresos Totales</h2>
            <p className="metric">${Number(resumen.ingresosTotales ?? 0).toFixed(2)}</p>
          </div>
          <div className="card alert">
            <h2>Cuotas Vencidas</h2>
            <p className="metric">{resumen.cuotasVencidas}</p>
          </div>
        </div>
      )}
      {vencidas.length > 0 && (
        <div className="vencidas-section">
          <h2>Cuotas Vencidas Pendientes</h2>
          <table aria-label="Listado de cuotas vencidas">
            <thead>
              <tr>
                <th>Socio</th>
                <th>Monto</th>
                <th>Fecha Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {vencidas.map((cuota) => (
                <tr key={cuota.id}>
                  <td>{cuota.socioNombre}</td>
                  <td>${Number(cuota.monto ?? 0).toFixed(2)}</td>
                  <td>{new Date(cuota.fechaVencimiento).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// === FormRegistroSocioYCuota ===
import React, { useState, useEffect } from 'react';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  montoInicial: string;
}

interface Socio {
  id: string;
  nombre: string;
  email: string;
  estado: string;
}

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function FormRegistroSocioYCuota() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    montoInicial: ''
  });
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/socios?limit=10`);
        if (!res.ok) throw new Error('Error al cargar socios');
        const data = await res.json();
        setSocios(data.data || []);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchSocios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${BASE_URL}/api/socios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          montoInicial: parseFloat(formData.montoInicial)
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al registrar socio');
      }

      setSuccess(true);
      setFormData({ nombre: '', email: '', telefono: '', montoInicial: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-label="Formulario de registro de socio" className="form-section">
      <h1>Registrar Nuevo Socio</h1>
      {success && <div role="alert" className="success">Socio registrado exitosamente</div>}
      {error && <div role="alert" className="error">{error}</div>}
      <form aria-label="FormRegistroSocioYCuota" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input aria-label="campo de entrada"
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input aria-label="campo de entrada"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input aria-label="campo de entrada"
            id="telefono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="montoInicial">Monto Inicial *</label>
          <input aria-label="campo de entrada"
            id="montoInicial"
            name="montoInicial"
            type="number"
            step="0.01"
            value={formData.montoInicial}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Registrando...' : 'Registrar Socio'}
        </button>
      </form>
      {socios.length > 0 && (
        <div className="socios-list">
          <h2>Últimos Socios Registrados</h2>
          <ul aria-label="Listado de socios">
            {socios.slice(0, 5).map((socio) => (
              <li key={socio.id}>
                {socio.nombre} ({socio.estado})
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}