import React, { useState, useCallback, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Pago {
  id: string;
  monto: number;
  fecha: string;
  socioId: string;
  concepto: string;
}

interface ResumenAnual {
  año: number;
  total: number;
}

interface DashboardPagosProps {
  grupoId: string;
}

const DashboardPagos: React.FC<DashboardPagosProps> = ({ grupoId }) => {
  const [resumenAnual, setResumenAnual] = useState<ResumenAnual[]>([]);
  const [recaudacionActual, setRecaudacionActual] = useState<number>(0);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ monto: '', socioId: '', concepto: '', fecha: '' });

  const fetchResumenAnual = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/grupos/${grupoId}/resumen-anual`);
      if (!res.ok) throw new Error('Error al cargar resumen anual');
      const data = await res.json();
      setResumenAnual(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [grupoId]);

  const fetchRecaudacion = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/grupos/${grupoId}/recaudacion?año=${selectedYear}`);
      if (!res.ok) throw new Error('Error al cargar recaudación');
      const data = await res.json();
      setRecaudacionActual(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [grupoId, selectedYear]);

  const fetchPagos = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/grupos/${grupoId}/pagos?año=${selectedYear}`);
      if (!res.ok) throw new Error('Error al cargar pagos');
      const data = await res.json();
      setPagos(data.pagos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [grupoId, selectedYear]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchResumenAnual(), fetchRecaudacion(), fetchPagos()]).finally(() => setLoading(false));
  }, [fetchResumenAnual, fetchRecaudacion, fetchPagos]);

  const handleRegistrarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.monto || !formData.socioId) {
      setError('Completa monto y socio');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/grupos/${grupoId}/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monto: parseFloat(formData.monto),
          socioId: formData.socioId,
          concepto: formData.concepto || 'Cuota',
          fecha: formData.fecha || new Date().toISOString().split('T')[0],
        }),
      });
      if (!res.ok) throw new Error('Error al registrar pago');
      setFormData({ monto: '', socioId: '', concepto: '', fecha: '' });
      setShowForm(false);
      await Promise.all([fetchRecaudacion(), fetchPagos(), fetchResumenAnual()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const tarjetaRecaudacion = resumenAnual.find(r => r.año === selectedYear);
  const totalRecaudacion = tarjetaRecaudacion?.total || recaudacionActual;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard Pagos</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4" role="alert">{error}</div>}
      
      <div className="mb-6 flex gap-4 items-center">
        <label htmlFor="year-select" className="font-semibold">Año:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="border rounded px-3 py-2"
          aria-label="Seleccionar año"
        >
          {resumenAnual.map(r => <option key={r.año} value={r.año}>{r.año}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600 text-sm font-semibold mb-2">Recaudación {selectedYear}</h2>
          <p className="text-3xl font-bold text-green-600" aria-live="polite" aria-label={`Recaudación total: ${Number(totalRecaudacion ?? 0).toFixed(2)}`}>
            ${Number(totalRecaudacion ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600 text-sm font-semibold mb-2">Pagos Registrados</h2>
          <p className="text-3xl font-bold text-blue-600">{pagos.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-gray-600 text-sm font-semibold mb-2">Promedio por Pago</h2>
          <p className="text-3xl font-bold text-purple-600">
            ${pagos.length > 0 ? (Number(totalRecaudacion ?? 0) / pagos.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Registrar Pago</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            aria-expanded={showForm}
          >
            {showForm ? 'Cancelar' : '+ Nuevo Pago'}
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleRegistrarPago} className="space-y-4">
            <input
              type="number"
              placeholder="Monto"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="w-full border rounded px-3 py-2"
              step="0.01"
              required
              aria-label="Monto del pago"
            />
            <input
              type="text"
              placeholder="ID Socio"
              value={formData.socioId}
              onChange={(e) => setFormData({ ...formData, socioId: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
              aria-label="ID del socio"
            />
            <input
              type="text"
              placeholder="Concepto (ej: Cuota)"
              value={formData.concepto}
              onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
              className="w-full border rounded px-3 py-2"
              aria-label="Concepto del pago"
            />
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full border rounded px-3 py-2"
              aria-label="Fecha del pago"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrar Pago'}
            </button>
          </form>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Pagos del Año {selectedYear}</h2>
        {loading && <p className="text-gray-500">Cargando...</p>}
        {pagos.length === 0 && !loading && <p className="text-gray-500">No hay pagos registrados</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Socio</th>
                <th className="text-left p-3">Concepto</th>
                <th className="text-right p-3">Monto</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map(pago => (
                <tr key={pago.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(pago.fecha).toLocaleDateString()}</td>
                  <td className="p-3">{pago.socioId}</td>
                  <td className="p-3">{pago.concepto}</td>
                  <td className="text-right p-3 font-semibold">${Number(pago.monto ?? 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPagos;
