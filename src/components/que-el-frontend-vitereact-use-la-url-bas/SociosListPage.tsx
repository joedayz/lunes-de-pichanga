import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

interface Socio {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  estado: 'activo' | 'inactivo';
  fechaIngreso?: string;
}

export default function SociosListPage() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<Socio | null>(null);

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/socios`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: No se pudo cargar socios`);
        const data = await res.json();
        setSocios(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchSocios();
  }, []);

  const handleSelectSocio = async (id: string) => {
    setSelectedId(id);
    try {
      const res = await fetch(`${API_BASE}/api/socios/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDetalle(data);
    } catch (err) {
      setDetalle(null);
    }
  };

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="p-8">
        <p>Cargando socios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="p-8 bg-red-50 border border-red-200 rounded">
        <h2 className="text-red-800 font-bold">Error</h2>
        <p className="text-red-700 mt-2">{error}</p>
        <p className="text-xs text-red-600 mt-2">API: {API_BASE}/api/socios</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Socios</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm" role="grid" aria-label="Lista de socios">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Estado</th>
                  <th className="px-4 py-3 text-center font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {socios.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      No hay socios registrados
                    </td>
                  </tr>
                ) : (
                  socios.map((socio) => (
                    <tr key={socio.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{socio.nombre}</td>
                      <td className="px-4 py-3 text-gray-600">{socio.email || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            socio.estado === 'activo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {socio.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleSelectSocio(socio.id)}
                          aria-label={`Ver detalles de ${socio.nombre}`}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedId && detalle ? (
            <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Detalles</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Nombre</p>
                  <p className="font-medium">{detalle.nombre}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{detalle.email || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Teléfono</p>
                  <p className="font-medium">{detalle.telefono || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Estado</p>
                  <p className="font-medium capitalize">{detalle.estado}</p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha Ingreso</p>
                  <p className="font-medium text-xs">{detalle.fechaIngreso || '—'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-gray-500">
              <p className="text-sm">Selecciona un socio para ver detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
