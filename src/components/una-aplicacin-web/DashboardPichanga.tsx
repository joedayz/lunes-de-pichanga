import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface DashboardData {
  totalPartidas: number;
  totalRecaudado: number;
  promedioAsistencia: number;
  sociosActivos: number;
}

interface Año {
  año: number;
}

export default function DashboardPichanga() {
  const [años, setAños] = useState<Año[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setError(null);
        const res = await fetch(BASE_URL + '/api/años');
        if (!res.ok) throw new Error('Error cargando años');
        const data: Año[] = await res.json();
        setAños(data);
        if (data.length > 0) {
          setSelectedYear(data[0].año);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };
    fetchYears();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = BASE_URL + '/api/dashboard?año=' + String(selectedYear);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error cargando dashboard');
        const data: DashboardData = await res.json();
        setDashboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [selectedYear]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    if (!isNaN(year)) {
      setSelectedYear(year);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Dashboard Lunes de Pichanga</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <label htmlFor="year-select" style={{ marginRight: '1rem' }}>
          Selecciona año:
        </label>
        <select
          id="year-select"
          value={selectedYear ?? ''}
          onChange={handleYearChange}
          aria-label="Seleccionar año"
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        >
          <option value="">-- Cargando --</option>
          {años.map((a) => (
            <option key={a.año} value={a.año}>
              {a.año}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }} role="alert">
          Error: {error}
        </div>
      )}

      {loading && (
        <div style={{ color: 'blue' }} role="status">
          Cargando métricas...
        </div>
      )}

      {dashboard && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
            <h3>Total Partidas</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
              {dashboard.totalPartidas}
            </p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
            <h3>Total Recaudado</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
              ${Number(dashboard.totalRecaudado ?? 0).toFixed(2)}
            </p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
            <h3>Promedio Asistencia</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
              {Number(dashboard.promedioAsistencia ?? 0).toFixed(1)}%
            </p>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
            <h3>Socios Activos</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
              {dashboard.sociosActivos}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
