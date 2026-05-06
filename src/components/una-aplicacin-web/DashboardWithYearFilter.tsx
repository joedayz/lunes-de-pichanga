import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Resumen {
  totalSocios: number;
  totalInvitados: number;
  totalRecaudado: number;
}

interface Cuota {
  id: string;
  socioId: string;
  monto: number;
  estado: string;
  anio: number;
}

export default function DashboardWithYearFilter() {
  const [anos, setAnos] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar años disponibles
  useEffect(() => {
    const fetchAnos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/anos-disponibles`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const yearArray = Array.isArray(data) ? data : [];
        setAnos(yearArray);
        if (yearArray.length > 0) setSelectedYear(yearArray[0]);
      } catch (err) {
        setError(`Error cargando años: ${err instanceof Error ? err.message : 'desconocido'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAnos();
  }, []);

  // Cargar resumen y cuotas cuando cambia el año
  useEffect(() => {
    if (!selectedYear) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [resRes, cuotasRes] = await Promise.all([
          fetch(`${BASE_URL}/api/dashboard/resumen?anio=${selectedYear}`),
          fetch(`${BASE_URL}/api/dashboard/cuotas?anio=${selectedYear}`)
        ]);
        if (!resRes.ok || !cuotasRes.ok) throw new Error('Error en dashboard');
        const resData = await resRes.json();
        const cuotasData = await cuotasRes.json();
        setResumen(resData);
        setCuotas(Array.isArray(cuotasData) ? cuotasData : []);
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'desconocido'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  if (loading && !resumen) return <div className="p-4">Cargando...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard Lunes de Pichanga</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <div className="mb-6">
        <label htmlFor="year-select" className="block text-sm font-medium mb-2">
          Seleccionar Año
        </label>
        <select
          id="year-select"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border rounded bg-white"
          aria-label="Filtro de año para dashboard"
        >
          {anos.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {resumen && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600 text-sm">Total Socios</p>
            <p className="text-2xl font-bold">{resumen.totalSocios}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600 text-sm">Total Invitados</p>
            <p className="text-2xl font-bold">{resumen.totalInvitados}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600 text-sm">Total Recaudado</p>
            <p className="text-2xl font-bold">\${Number(resumen.totalRecaudado ?? 0).toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">Cuotas del Año</h2>
        {cuotas.length === 0 ? (
          <p className="text-gray-500">Sin cuotas registradas</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID Socio</th>
                <th className="px-4 py-2 text-left">Monto</th>
                <th className="px-4 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota.id} className="border-t">
                  <td className="px-4 py-2">{cuota.socioId}</td>
                  <td className="px-4 py-2">\${Number(cuota.monto ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      cuota.estado === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {cuota.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
