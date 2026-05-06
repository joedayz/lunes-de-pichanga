import React, { useState, useEffect, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Pago {
  id: string;
  monto: number;
  concepto: string;
  fecha: string;
  socioId?: string;
}

interface RecaudacionData {
  total: number;
  anio: number;
}

interface RecaudacionPorAnio {
  [key: string]: number;
}

export default function DashboardPagos({ grupoId }: { grupoId: string }) {
  const [recaudacion, setRecaudacion] = useState<RecaudacionData | null>(null);
  const [recaudacionPorAnio, setRecaudacionPorAnio] = useState<RecaudacionPorAnio>({});
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ monto: '', concepto: '', fecha: '' });

  const fetchRecaudacion = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/grupos-deportivos/${grupoId}/recaudacion?anio=${selectedYear}`);
      if (!res.ok) throw new Error('Error al obtener recaudación');
      const data = await res.json();
      setRecaudacion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [grupoId, selectedYear]);

  const fetchRecaudacionPorAnio = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/grupos-deportivos/${grupoId}/recaudacion-por-anio`);
      if (!res.ok) throw new Error('Error al obtener recaudación por año');
      const data = await res.json();
      setRecaudacionPorAnio(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [grupoId]);

  const fetchPagos = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/grupos-deportivos/${grupoId}/pagos?anio=${selectedYear}`);
      if (!res.ok) throw new Error('Error al obtener pagos');
      const data = await res.json();
      setPagos(data.pagos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [grupoId, selectedYear]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchRecaudacion(), fetchRecaudacionPorAnio(), fetchPagos()]).finally(() => setLoading(false));
  }, [fetchRecaudacion, fetchRecaudacionPorAnio, fetchPagos]);

  const handleRegistrarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.monto || !formData.concepto || !formData.fecha) {
      setError('Completa todos los campos');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/grupos-deportivos/${grupoId}/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monto: parseFloat(formData.monto),
          concepto: formData.concepto,
          fecha: formData.fecha,
        }),
      });
      if (!res.ok) throw new Error('Error al registrar pago');
      setFormData({ monto: '', concepto: '', fecha: '' });
      setShowForm(false);
      setError(null);
      await fetchRecaudacion();
      await fetchPagos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const years = Object.keys(recaudacionPorAnio).map(Number).sort((a, b) => b - a);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard Pagos</h1>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded" role="alert">{error}</div>}

      <div className="mb-6 flex gap-4 items-center">
        <label htmlFor="year-select" className="font-semibold text-gray-700">Año:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded bg-white"
          aria-label="Seleccionar año"
        >
          {years.length > 0 ? years.map((y) => <option key={y} value={y}>{y}</option>) : <option>{new Date().getFullYear()}</option>}
        </select>
      </div>

      {loading && <p className="text-gray-600 mb-4">Cargando...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Recaudación {selectedYear}</h2>
          <p className="text-3xl font-bold text-green-600">${Number(recaudacion?.total ?? 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Total Pagos</h2>
          <p className="text-3xl font-bold text-blue-600">{pagos.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Promedio por Pago</h2>
          <p className="text-3xl font-bold text-purple-600">${pagos.length > 0 ? (pagos.reduce((s, p) => s + p.monto, 0) / pagos.length).toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Registrar Pago</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            aria-label="Abrir formulario de pago"
          >
            {showForm ? 'Cancelar' : 'Nuevo Pago'}
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleRegistrarPago} className="space-y-4">
            <input
              type="number"
              placeholder="Monto"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              aria-label="Monto del pago"
            />
            <input
              type="text"
              placeholder="Concepto"
              value={formData.concepto}
              onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              aria-label="Concepto del pago"
            />
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              aria-label="Fecha del pago"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrar Pago'}
            </button>
          </form>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pagos del Año {selectedYear}</h2>
        {pagos.length === 0 ? (
          <p className="text-gray-600">No hay pagos registrados para este año.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Fecha</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Concepto</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">Monto</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{new Date(pago.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-gray-900">{pago.concepto}</td>
                    <td className="px-4 py-2 text-right text-gray-900 font-semibold">${pago.monto.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
