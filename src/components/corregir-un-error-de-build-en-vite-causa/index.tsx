// === DashboardAdmin ===
import React, { useEffect, useState } from 'react';

interface ResumenDashboard {
  totalSocios: number;
  cuotasPendientes: number;
  ingresosMes: number;
  tasaPago: number;
}

interface Socio {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
}

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function DashboardAdmin() {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resRes, sociosRes] = await Promise.all([
          fetch(`${BASE_URL}/api/dashboard/resumen`),
          fetch(`${BASE_URL}/api/socios?limit=5`)
        ]);

        if (!resRes.ok || !sociosRes.ok) {
          throw new Error('Error al cargar datos del dashboard');
        }

        const resData = await resRes.json();
        const sociosData = await sociosRes.json();

        setResumen(resData);
        setSocios(sociosData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4" role="status" aria-live="polite">Cargando dashboard...</div>;
  if (error) return <div className="p-4 text-red-600" role="alert">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard Administrativo</h1>

      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow" aria-label="Total de socios">
            <p className="text-gray-600 text-sm">Total Socios</p>
            <p className="text-2xl font-bold">{resumen.totalSocios}</p>
          </div>
          <div className="bg-white p-4 rounded shadow" aria-label="Cuotas pendientes">
            <p className="text-gray-600 text-sm">Cuotas Pendientes</p>
            <p className="text-2xl font-bold text-orange-600">{resumen.cuotasPendientes}</p>
          </div>
          <div className="bg-white p-4 rounded shadow" aria-label="Ingresos del mes">
            <p className="text-gray-600 text-sm">Ingresos Mes</p>
            <p className="text-2xl font-bold text-green-600">${Number(resumen.ingresosMes ?? 0).toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow" aria-label="Tasa de pago">
            <p className="text-gray-600 text-sm">Tasa de Pago</p>
            <p className="text-2xl font-bold text-blue-600">{Number(resumen.tasaPago ?? 0).toFixed(1)}%</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Últimos Socios Registrados</h2>
        {socios.length > 0 ? (
          <table className="w-full text-sm" role="table">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Nombre</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {socios.map((socio) => (
                <tr key={socio.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{socio.nombre} {socio.apellido}</td>
                  <td className="py-2">{socio.email}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      socio.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {socio.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No hay socios registrados</p>
        )}
      </div>
    </div>
  );
}

// === FormRegistroSocioYCuota ===
import React, { useState } from 'react';

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  monto?: number;
}

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function FormRegistroSocioYCuota() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    monto: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [socioId, setSocioId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monto' ? parseFloat(value) || 0 : value
    }));
  };

  const handleRegistroSocio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/socios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono
        })
      });

      if (!res.ok) throw new Error('Error al registrar socio');
      const data = await res.json();
      setSocioId(data.id);
      setMessage({ type: 'success', text: 'Socio registrado exitosamente' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistroCuota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socioId || !formData.monto) {
      setMessage({ type: 'error', text: 'Registra un socio y especifica monto primero' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/socios/${socioId}/cuotas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto: formData.monto })
      });

      if (!res.ok) throw new Error('Error al registrar cuota');
      setMessage({ type: 'success', text: 'Cuota registrada exitosamente' });
      setFormData(prev => ({ ...prev, monto: 0 }));
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Registro de Socio y Cuota</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <form aria-label="FormRegistroSocioYCuota" onSubmit={handleRegistroSocio} className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Datos del Socio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            aria-label="Nombre del socio"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            required
            aria-label="Apellido del socio"
            className="border p-2 rounded"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            aria-label="Email del socio"
            className="border p-2 rounded"
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono (opcional)"
            value={formData.telefono}
            onChange={handleInputChange}
            aria-label="Teléfono del socio"
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          aria-label="Registrar socio"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Registrar Socio'}
        </button>
      </form>

      {socioId && (
        <form aria-label="FormRegistroSocioYCuota" onSubmit={handleRegistroCuota}>
          <h2 className="text-lg font-semibold mb-4">Registrar Cuota</h2>
          <div className="mb-4">
            <input
              type="number"
              name="monto"
              placeholder="Monto de la cuota"
              value={formData.monto || ''}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
              aria-label="Monto de la cuota"
              className="border p-2 rounded w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            aria-label="Registrar cuota"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar Cuota'}
          </button>
        </form>
      )}
    </div>
  );
}