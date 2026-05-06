// === DashboardAdmin ===
import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface Socio {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
}

interface Cuota {
  id: string;
  socio_id: string;
  monto: number;
  estado: 'pendiente' | 'pagada' | 'vencida';
  fecha_vencimiento: string;
}

interface Resumen {
  total_socios: number;
  cuotas_pendientes: number;
  cuotas_pagadas: number;
  monto_total_pendiente: number;
}

export default function DashboardAdmin() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sociosRes, cuotasRes, resumenRes] = await Promise.all([
          fetch(`${BASE_URL}/api/socios`),
          fetch(`${BASE_URL}/api/cuotas`),
          fetch(`${BASE_URL}/api/dashboard/resumen`),
        ]);

        if (!sociosRes.ok || !cuotasRes.ok || !resumenRes.ok) {
          throw new Error('Error al cargar datos del dashboard');
        }

        setSocios(await sociosRes.json());
        setCuotas(await cuotasRes.json());
        setResumen(await resumenRes.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div role="status" aria-live="polite">Cargando dashboard...</div>;
  if (error) return <div role="alert" style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dashboard Administrativo</h1>

      {resumen && (
        <section aria-labelledby="resumen-title" style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <h2 id="resumen-title" style={{ gridColumn: '1 / -1' }}>Resumen</h2>
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
            <p><strong>Total Socios:</strong> {resumen.total_socios}</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
            <p><strong>Cuotas Pendientes:</strong> {resumen.cuotas_pendientes}</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
            <p><strong>Cuotas Pagadas:</strong> {resumen.cuotas_pagadas}</p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
            <p><strong>Monto Pendiente:</strong> ${Number(resumen.monto_total_pendiente ?? 0).toFixed(2)}</p>
          </div>
        </section>
      )}

      <section aria-labelledby="socios-title" style={{ marginBottom: '30px' }}>
        <h2 id="socios-title">Socios Registrados ({socios.length})</h2>
        {socios.length === 0 ? (
          <p>No hay socios registrados.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Nombre</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {socios.map((socio) => (
                <tr key={socio.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{socio.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{socio.nombre}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{socio.email}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{socio.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section aria-labelledby="cuotas-title">
        <h2 id="cuotas-title">Cuotas ({cuotas.length})</h2>
        {cuotas.length === 0 ? (
          <p>No hay cuotas registradas.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Socio ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Monto</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Estado</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cuota.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cuota.socio_id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${Number(cuota.monto ?? 0).toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}><span style={{ padding: '4px 8px', borderRadius: '3px', backgroundColor: cuota.estado === 'pagada' ? '#d4edda' : cuota.estado === 'vencida' ? '#f8d7da' : '#fff3cd' }}>{cuota.estado}</span></td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(cuota.fecha_vencimiento).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

// === FormRegistroSocioYCuota ===
import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  monto_cuota: string;
}

export default function FormRegistroSocioYCuota() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    monto_cuota: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${BASE_URL}/api/socios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          monto_cuota_inicial: parseFloat(formData.monto_cuota),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      setMessage({ type: 'success', text: 'Socio registrado exitosamente' });
      setFormData({ nombre: '', email: '', telefono: '', monto_cuota: '' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al registrar socio',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Registrar Nuevo Socio</h2>
      <form aria-label="FormRegistroSocioYCuota" onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre *</label>
          <input aria-label="campo de entrada"
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            aria-required="true"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email *</label>
          <input aria-label="campo de entrada"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="telefono" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Teléfono *</label>
          <input aria-label="campo de entrada"
            id="telefono"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            aria-required="true"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="monto_cuota" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Monto Cuota Inicial ($) *</label>
          <input aria-label="campo de entrada"
            id="monto_cuota"
            type="number"
            name="monto_cuota"
            value={formData.monto_cuota}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            aria-required="true"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        {message && (
          <div
            role="alert"
            style={{
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '4px',
              backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
              border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            }}
          >
            {message.text}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {loading ? 'Registrando...' : 'Registrar Socio'}
        </button>
      </form>
    </div>
  );
}