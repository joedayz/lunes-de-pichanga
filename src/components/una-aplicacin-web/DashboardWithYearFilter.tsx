import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface ResumenDashboard {
  totalSocios: number;
  totalInvitados: number;
  totalRecaudado: number;
}

interface Cuota {
  id: number;
  socio_id: number;
  mes: number;
  anio: number;
  monto: number;
  pagado: boolean;
  fecha?: string;
}

const normalizeArray = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
    return (data as any).data;
  }
  return [];
};

const normalizeObject = (data: unknown, defaults: Record<string, any>): Record<string, any> => {
  if (data && typeof data === 'object') return data as Record<string, any>;
  return defaults;
};

export default function DashboardWithYearFilter() {
  const [anos, setAnos] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [resumen, setResumen] = useState<ResumenDashboard>({
    totalSocios: 0,
    totalInvitados: 0,
    totalRecaudado: 0,
  });
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnos = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/anos-disponibles`);
        if (!res.ok) throw new Error('Error al cargar años');
        const data = await res.json();
        const anosArray = normalizeArray(data) as number[];
        setAnos(anosArray);
        if (anosArray.length > 0) setSelectedYear(anosArray[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };
    fetchAnos();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resRes, cuotasRes] = await Promise.all([
          fetch(`${BASE_URL}/api/dashboard/resumen?anio=${selectedYear}`),
          fetch(`${BASE_URL}/api/dashboard/cuotas?anio=${selectedYear}`),
        ]);
        if (!resRes.ok || !cuotasRes.ok) throw new Error('Error al cargar dashboard');
        const resData = await resRes.json();
        const cuotasData = await cuotasRes.json();
        setResumen(normalizeObject(resData, resumen) as ResumenDashboard);
        setCuotas(normalizeArray(cuotasData) as Cuota[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [selectedYear]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard - Lunes de Pichanga</h1>
      
      <div className="mb-6">
        <label htmlFor="year-select" className="block text-sm font-medium mb-2">
          Seleccionar Año:
        </label>
        <select
          id="year-select"
          value={selectedYear ?? ''}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border rounded-lg"
          aria-label="Filtrar por año"
        >
          {anos.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      {loading && <div className="text-gray-600">Cargando...</div>}

      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">Total Socios</h2>
            <p className="text-2xl font-bold">{resumen.totalSocios}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">Total Invitados</h2>
            <p className="text-2xl font-bold">{resumen.totalInvitados}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">Total Recaudado</h2>
            <p className="text-2xl font-bold">${Number(resumen.totalRecaudado ?? 0).toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Cuotas</h2>
        {cuotas.length === 0 ? (
          <p className="text-gray-500">No hay cuotas registradas</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Socio</th>
                <th className="text-left py-2">Mes</th>
                <th className="text-left py-2">Monto</th>
                <th className="text-left py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{cuota.id}</td>
                  <td className="py-2">{cuota.socio_id}</td>
                  <td className="py-2">{cuota.mes}/{cuota.anio}</td>
                  <td className="py-2">${Number(cuota.monto ?? 0).toFixed(2)}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      cuota.pagado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {cuota.pagado ? 'Pagado' : 'Pendiente'}
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
