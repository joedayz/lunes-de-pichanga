import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Cuota {
  id: string;
  socioId: string;
  monto: number;
  anio: number;
  estado: string;
}

interface Resumen {
  totalSocios: number;
  totalInvitados: number;
  totalRecaudado: number;
}

export default function DashboardWithYearFilter() {
  const [anos, setAnos] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/anos-disponibles`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const yearList = Array.isArray(data) ? data : [];
        setAnos(yearList);
        if (yearList.length > 0) setSelectedYear(yearList[0]);
      } catch (err) {
        setError(`Error cargando años: ${err instanceof Error ? err.message : 'desconocido'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchYears();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    const fetchData = async () => {
      try {
        setLoading(true);
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
        setError(`Error cargando dashboard: ${err instanceof Error ? err.message : 'desconocido'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Dashboard Lunes de Pichanga</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div className="mb-6">
        <label htmlFor="year-select" className="block text-sm font-medium mb-2">
          Seleccionar Año
        </label>
        <select
          id="year-select"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border rounded"
          aria-label="Filtrar por año"
        >
          {anos.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando...</div>
      ) : resumen ? (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Total Socios</p>
              <p className="text-2xl font-bold">{resumen.totalSocios}</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Total Invitados</p>
              <p className="text-2xl font-bold">{resumen.totalInvitados}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <p className="text-sm text-gray-600">Total Recaudado</p>
              <p className="text-2xl font-bold">${Number(resumen.totalRecaudado ?? 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Cuotas Registradas</h2>
            {cuotas.length === 0 ? (
              <p className="text-gray-500">Sin cuotas registradas para este año</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">ID Socio</th>
                    <th className="border p-2 text-left">Monto</th>
                    <th className="border p-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {cuotas.map((cuota) => (
                    <tr key={cuota.id}>
                      <td className="border p-2">{cuota.socioId}</td>
                      <td className="border p-2">${Number(cuota.monto ?? 0).toFixed(2)}</td>
                      <td className="border p-2">{cuota.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
