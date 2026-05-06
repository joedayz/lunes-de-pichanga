import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Año {
  id: string;
  anio: number;
}

interface Resumen {
  anio: number;
  totalSocios: number;
  totalInvitados: number;
  cuotasPendientes: number;
  recaudoTotal: number;
}

interface CuotaPendiente {
  mes: number;
  socioNombre: string;
  monto: number;
}

interface Recaudo {
  mes: number;
  monto: number;
  cantidad: number;
}

export default function DashboardAño() {
  const [años, setAños] = useState<Año[]>([]);
  const [selectedAño, setSelectedAño] = useState<number>(new Date().getFullYear());
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [cuotasPendientes, setCuotasPendientes] = useState<CuotaPendiente[]>([]);
  const [recaudos, setRecaudos] = useState<Recaudo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAños = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/anos`);
        if (!res.ok) throw new Error('Error al cargar años');
        const data = await res.json();
        setAños(data);
        if (data.length > 0 && !data.find((a: Año) => a.anio === selectedAño)) {
          setSelectedAño(data[0].anio);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };
    fetchAños();
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resRes, pendRes, recRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/dashboard/resumen?anio=${selectedAño}`),
          fetch(`${BASE_URL}/api/v1/dashboard/cuotas-pendientes?anio=${selectedAño}`),
          fetch(`${BASE_URL}/api/v1/dashboard/recaudos?anio=${selectedAño}`)
        ]);
        if (!resRes.ok || !pendRes.ok || !recRes.ok) throw new Error('Error al cargar datos');
        setResumen(await resRes.json());
        setCuotasPendientes(await pendRes.json());
        setRecaudos(await recRes.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    if (selectedAño) fetchDashboard();
  }, [selectedAño]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard - Lunes de Pichanga</h1>
      
      <div className="mb-6">
        <label htmlFor="año-select" className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Año Deportivo
        </label>
        <select
          id="año-select"
          value={selectedAño}
          onChange={(e) => setSelectedAño(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Filtrar por año deportivo"
        >
          {años.map((a) => (
            <option key={a.id} value={a.anio}>
              {a.anio}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      {loading && <div className="text-center py-8 text-gray-600">Cargando...</div>}

      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Socios</p>
            <p className="text-2xl font-bold text-blue-600">{resumen.totalSocios}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Invitados</p>
            <p className="text-2xl font-bold text-green-600">{resumen.totalInvitados}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Cuotas Pendientes</p>
            <p className="text-2xl font-bold text-orange-600">{resumen.cuotasPendientes}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Recaudo Total</p>
            <p className="text-2xl font-bold text-purple-600">${Number(resumen.recaudoTotal ?? 0).toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Cuotas Pendientes</h2>
          {cuotasPendientes.length === 0 ? (
            <p className="text-gray-500">Sin cuotas pendientes</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Mes</th>
                    <th className="px-4 py-2 text-left font-semibold">Socio</th>
                    <th className="px-4 py-2 text-right font-semibold">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {cuotasPendientes.map((cp, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{cp.mes}</td>
                      <td className="px-4 py-2">{cp.socioNombre}</td>
                      <td className="px-4 py-2 text-right font-semibold">${Number(cp.monto ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Recaudos por Mes</h2>
          {recaudos.length === 0 ? (
            <p className="text-gray-500">Sin recaudos registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Mes</th>
                    <th className="px-4 py-2 text-right font-semibold">Cantidad</th>
                    <th className="px-4 py-2 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recaudos.map((r, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{r.mes}</td>
                      <td className="px-4 py-2 text-right">{r.cantidad}</td>
                      <td className="px-4 py-2 text-right font-semibold">${Number(r.monto ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
