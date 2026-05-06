import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Socio {
  id: string;
  nombre: string;
  cuotasPagadas: number;
  cuotasDeudas: number;
  participaciones: number;
}

interface Año {
  año: number;
}

export default function SociosList() {
  const [años, setAños] = useState<Año[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

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
    const fetchSocios = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = BASE_URL + '/api/socios?año=' + String(selectedYear) + '&pagina=' + String(page) + '&limite=' + String(limit);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error cargando socios');
        const data: Socio[] = await res.json();
        setSocios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setSocios([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSocios();
  }, [selectedYear, page, limit]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    if (!isNaN(year)) {
      setSelectedYear(year);
      setPage(1);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Listado de Socios</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <label htmlFor="year-select-socios" style={{ marginRight: '1rem' }}>
          Selecciona año:
        </label>
        <select
          id="year-select-socios"
          value={selectedYear ?? ''}
          onChange={handleYearChange}
          aria-label="Seleccionar año para socios"
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
        <div style={{ color: 'blue', marginBottom: '1rem' }} role="status">
          Cargando socios...
        </div>
      )}

      {socios.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ccc', padding: '0.75rem', textAlign: 'left' }}>Nombre</th>
              <th style={{ border: '1px solid #ccc', padding: '0.75rem', textAlign: 'center' }}>Cuotas Pagadas</th>
              <th style={{ border: '1px solid #ccc', padding: '0.75rem', textAlign: 'center' }}>Cuotas Deudas</th>
              <th style={{ border: '1px solid #ccc', padding: '0.75rem', textAlign: 'center' }}>Participaciones</th>
            </tr>
          </thead>
          <tbody>
            {socios.map((socio) => (
              <tr key={socio.id}>
                <td style={{ border: '1px solid #ccc', padding: '0.75rem' }}>{socio.nombre}</td>
                <td style={{ border: '1px solid #ccc', padding: '0.75rem', textAlign: 'center' }}>
                  {socio.cuotasPagadas}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '0.75rem', textAlign: 'center' }}>
                  {socio.cuotasDeudas}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '0.75rem', textAlign: 'center' }}>
                  {socio.participaciones}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {socios.length === 0 && !loading && !error && (
        <div style={{ color: '#666' }}>No hay socios para este año.</div>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Página anterior"
          style={{ padding: '0.5rem 1rem', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        >
          Anterior
        </button>
        <span style={{ padding: '0.5rem 1rem' }}>Página {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={socios.length < limit}
          aria-label="Página siguiente"
          style={{ padding: '0.5rem 1rem', cursor: socios.length < limit ? 'not-allowed' : 'pointer' }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
