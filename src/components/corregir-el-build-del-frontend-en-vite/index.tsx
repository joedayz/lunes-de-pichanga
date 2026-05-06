// === DashboardAdmin ===
import React, { useEffect, useState } from 'react';

interface DashboardData {
  sociosActivos: number;
  cuotasPendientes: number;
  proximasPichangas: string[];
}

interface DashboardAdminProps {
  baseUrl?: string;
}

export default function DashboardAdmin({ baseUrl = 'http://localhost:3000' }: DashboardAdminProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/dashboard/resumen`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [baseUrl]);

  if (loading) return <div aria-live="polite">Cargando dashboard...</div>;
  if (error) return <div role="alert">Error: {error}</div>;

  return (
    <section aria-label="Dashboard administrativo">
      <h1>Dashboard - Lunes de Pichanga</h1>
      <div className="grid">
        <article>
          <h2>Socios Activos</h2>
          <p className="metric">{data?.sociosActivos ?? 0}</p>
        </article>
        <article>
          <h2>Cuotas Pendientes</h2>
          <p className="metric">{data?.cuotasPendientes ?? 0}</p>
        </article>
        <article>
          <h2>Próximas Pichangas</h2>
          <ul>
            {data?.proximasPichangas?.map((p, i) => (
              <li key={i}>{p}</li>
            )) || <li>Sin pichangas programadas</li>}
          </ul>
        </article>
      </div>
    </section>
  );
}

// === FormRegistroSocioYCuota ===
import React, { useState } from 'react';

interface FormRegistroProps {
  baseUrl?: string;
  onSuccess?: () => void;
}

export default function FormRegistroSocioYCuota({ baseUrl = 'http://localhost:3000', onSuccess }: FormRegistroProps) {
  const [tab, setTab] = useState<'socio' | 'cuota'>('socio');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', socioId: '', monto: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistroSocio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/socios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: formData.nombre, email: formData.email }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage({ type: 'success', text: 'Socio registrado exitosamente' });
      setFormData({ ...formData, nombre: '', email: '' });
      onSuccess?.();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al registrar' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistroCuota = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/cuotas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socioId: formData.socioId, monto: Number(formData.monto) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage({ type: 'success', text: 'Cuota registrada exitosamente' });
      setFormData({ ...formData, socioId: '', monto: '' });
      onSuccess?.();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al registrar cuota' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-label="Formulario de registro">
      <div role="tablist" className="tabs">
        <button role="tab" aria-selected={tab === 'socio'} onClick={() => setTab('socio')}>Nuevo Socio</button>
        <button role="tab" aria-selected={tab === 'cuota'} onClick={() => setTab('cuota')}>Nueva Cuota</button>
      </div>

      {message && (
        <div role="alert" className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {tab === 'socio' && (
        <form aria-label="FormRegistroSocioYCuota" onSubmit={handleRegistroSocio} aria-label="Registro de socio">
          <input aria-label="campo de entrada" type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
          <input aria-label="campo de entrada" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar Socio'}</button>
        </form>
      )}

      {tab === 'cuota' && (
        <form aria-label="FormRegistroSocioYCuota" onSubmit={handleRegistroCuota} aria-label="Registro de cuota">
          <input aria-label="campo de entrada" type="text" name="socioId" placeholder="ID del Socio" value={formData.socioId} onChange={handleChange} required />
          <input aria-label="campo de entrada" type="number" name="monto" placeholder="Monto" step="0.01" value={formData.monto} onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar Cuota'}</button>
        </form>
      )}
    </section>
  );
}