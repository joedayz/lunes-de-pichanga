import React, { useState, useEffect } from 'react';
import { jsonArray } from './normalize-api-response.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Socio {
  id: string;
  nombre: string;
  anio: number;
}

interface Invitado {
  id: string;
  nombre: string;
  anio: number;
}

interface Resumen {
  totalSocios: number;
  totalInvitados: number;
  totalRecaudado: number;
}

interface Cuota {
  id: string;
  socio_id: string;
  mes: number;
  anio: number;
  monto: number;
}

const DashboardWithYearFilter: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar años disponibles
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/anos-disponibles`);
        if (!res.ok) throw new Error('Error cargando años');
        const data = await res.json();
        setAvailableYears(jsonArray<number>(data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchYears();
  }, []);

  // Cargar datos cuando cambia el año
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sociosRes, invitadosRes, resumenRes, cuotasRes] = await Promise.all([
          fetch(`${BASE_URL}/api/socios?anio=${selectedYear}`),
          fetch(`${BASE_URL}/api/invitados?anio=${selectedYear}`),
          fetch(`${BASE_URL}/api/dashboard/resumen?anio=${selectedYear}`),
          fetch(`${BASE_URL}/api/dashboard/cuotas?anio=${selectedYear}`)
        ]);

        if (!sociosRes.ok || !invitadosRes.ok || !resumenRes.ok || !cuotasRes.ok) {
          throw new Error('Error cargando datos del dashboard');
        }

        setSocios(jsonArray<Socio>(await sociosRes.json()));
        setInvitados(jsonArray<Invitado>(await invitadosRes.json()));
        const resumenJson = (await resumenRes.json()) as unknown;
        setResumen(
          resumenJson &&
            typeof resumenJson === 'object' &&
            'totalSocios' in (resumenJson as object)
            ? (resumenJson as Resumen)
            : null,
        );
        setCuotas(jsonArray<Cuota>(await cuotasRes.json()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>Dashboard - Lunes de Pichanga</h1>
        <div style={{ marginTop: '15px' }}>
          <label htmlFor="year-selector" style={{ marginRight: '10px', fontWeight: 'bold' }}>
            Año:
          </label>
          <select
            id="year-selector"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            aria-label="Seleccionar año para filtrar datos"
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            {availableYears.length > 0 ? (
              availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            ) : (
              <option value={selectedYear}>{selectedYear}</option>
            )}
          </select>
        </div>
      </header>

      {loading && <p aria-live="polite">Cargando datos...</p>}
      {error && <p style={{ color: 'red' }} role="alert">Error: {error}</p>}

      {!loading && resumen && (
        <section style={{ marginBottom: '30px' }}>
          <h2>Resumen {selectedYear}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h3>Total Socios</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{resumen.totalSocios}</p>
            </div>
            <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h3>Total Invitados</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{resumen.totalInvitados}</p>
            </div>
            <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h3>Total Recaudado</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                ${Number(resumen.totalRecaudado ?? 0).toFixed(2)}
              </p>
            </div>
          </div>
        </section>
      )}

      {!loading && socios.length > 0 && (
        <section style={{ marginBottom: '30px' }}>
          <h2>Socios ({selectedYear})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Nombre</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Año Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {socios.map((socio) => (
                <tr key={socio.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{socio.nombre}</td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#e3f2fd',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    >
                      {socio.anio}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {!loading && invitados.length > 0 && (
        <section style={{ marginBottom: '30px' }}>
          <h2>Invitados ({selectedYear})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Nombre</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Año Registro</th>
              </tr>
            </thead>
            <tbody>
              {invitados.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{inv.nombre}</td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#f3e5f5',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    >
                      {inv.anio}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {!loading && cuotas.length > 0 && (
        <section>
          <h2>Cuotas Registradas ({selectedYear})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Socio ID</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Mes</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Año</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{cuota.socio_id}</td>
                  <td style={{ padding: '10px' }}>{cuota.mes}</td>
                  <td style={{ padding: '10px' }}>{cuota.anio}</td>
                  <td style={{ padding: '10px' }}>${Number(cuota.monto ?? 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default DashboardWithYearFilter;
