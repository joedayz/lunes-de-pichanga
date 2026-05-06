import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface DashboardData {
  totalSocios: number;
  totalPagos: number;
  totalInvitados: number;
  recaudoTotal: number;
}

interface Socio {
  id: string;
  nombre: string;
  estado: string;
  fechaIngreso: string;
}

interface Pago {
  id: string;
  socioId: string;
  monto: number;
  fecha: string;
  concepto: string;
}

interface Invitado {
  id: string;
  nombre: string;
  socioId: string;
  fecha: string;
}

export default function DashboardPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'socios' | 'pagos' | 'invitados'>('dashboard');

  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardRes = await fetch(`${BASE_URL}/api/dashboard?anio=${year}`);
      if (!dashboardRes.ok) throw new Error('Error al cargar dashboard');
      const dashboardData = await dashboardRes.json();
      setDashboard(dashboardData);

      const sociosRes = await fetch(`${BASE_URL}/api/socios?anio=${year}`);
      if (!sociosRes.ok) throw new Error('Error al cargar socios');
      const sociosData = await sociosRes.json();
      setSocios(Array.isArray(sociosData) ? sociosData : sociosData.data || []);

      const pagosRes = await fetch(`${BASE_URL}/api/pagos?anio=${year}`);
      if (!pagosRes.ok) throw new Error('Error al cargar pagos');
      const pagosData = await pagosRes.json();
      setPagos(Array.isArray(pagosData) ? pagosData : pagosData.data || []);

      const invitadosRes = await fetch(`${BASE_URL}/api/invitados?anio=${year}`);
      if (!invitadosRes.ok) throw new Error('Error al cargar invitados');
      const invitadosData = await invitadosRes.json();
      setInvitados(Array.isArray(invitadosData) ? invitadosData : invitadosData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Cargando...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lunes de Pichanga</h1>
          <div className="flex gap-2">
            <label htmlFor="year-select" className="text-sm font-medium text-gray-700">Año:</label>
            <select
              id="year-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              aria-label="Seleccionar año"
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['dashboard', 'socios', 'pagos', 'invitados'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-selected={activeTab === tab}
              aria-label={`Tab ${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-medium">Total Socios</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard.totalSocios}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-medium">Total Pagos</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard.totalPagos}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-medium">Total Invitados</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboard.totalInvitados}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 text-sm font-medium">Recaudo Total</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">\${Number(dashboard.recaudoTotal ?? 0).toFixed(2)}</p>
            </div>
          </div>
        )}

        {activeTab === 'socios' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Nombre</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Estado</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Fecha Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {socios.length > 0 ? (
                  socios.map((socio) => (
                    <tr key={socio.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{socio.nombre}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          socio.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {socio.estado}
                        </span>
                      </td>
                      <td className="px-6 py-3">{new Date(socio.fechaIngreso).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="px-6 py-3 text-center text-gray-500">Sin socios</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'pagos' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Concepto</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Monto</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pagos.length > 0 ? (
                  pagos.map((pago) => (
                    <tr key={pago.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{pago.concepto}</td>
                      <td className="px-6 py-3 font-medium text-green-600">\${Number(pago.monto ?? 0).toFixed(2)}</td>
                      <td className="px-6 py-3">{new Date(pago.fecha).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="px-6 py-3 text-center text-gray-500">Sin pagos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'invitados' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Nombre</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {invitados.length > 0 ? (
                  invitados.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{inv.nombre}</td>
                      <td className="px-6 py-3">{new Date(inv.fecha).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={2} className="px-6 py-3 text-center text-gray-500">Sin invitados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
