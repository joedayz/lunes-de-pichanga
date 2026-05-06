import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

interface HealthStatus {
  status: string;
  timestamp: string;
}

interface ApiConfig {
  apiUrl: string;
  version: string;
}

interface DashboardResumen {
  totalSocios: number;
  totalCuotas: number;
  ingresosMes: number;
  participacionesActivas: number;
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [config, setConfig] = useState<ApiConfig | null>(null);
  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [healthRes, configRes, resumenRes] = await Promise.all([
          fetch(`${API_BASE}/api/health`),
          fetch(`${API_BASE}/api/config`),
          fetch(`${API_BASE}/api/dashboard/resumen`)
        ]);

        if (!healthRes.ok || !configRes.ok || !resumenRes.ok) {
          throw new Error('Error al conectar con la API en ' + API_BASE);
        }

        const healthData = await healthRes.json();
        const configData = await configRes.json();
        const resumenData = await resumenRes.json();

        setHealth(healthData);
        setConfig(configData);
        setResumen(resumenData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="p-8">
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="p-8 bg-red-50 border border-red-200 rounded">
        <h2 className="text-red-800 font-bold">Error de conexión</h2>
        <p className="text-red-700 mt-2">{error}</p>
        <p className="text-sm text-red-600 mt-2">API Base: {API_BASE}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Estado del Servidor</h2>
          <p className="text-sm text-blue-700">
            Status: <span className="font-mono font-bold">{health?.status}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">{health?.timestamp}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 className="text-lg font-semibold text-green-900 mb-2">Configuración API</h2>
          <p className="text-sm text-green-700">
            URL: <span className="font-mono text-xs">{config?.apiUrl}</span>
          </p>
          <p className="text-xs text-green-600 mt-1">v{config?.version}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Resumen General</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-gray-900">{resumen?.totalSocios ?? 0}</p>
            <p className="text-sm text-gray-600">Total Socios</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-gray-900">{resumen?.totalCuotas ?? 0}</p>
            <p className="text-sm text-gray-600">Total Cuotas</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-gray-900">${Number(resumen?.ingresosMes ?? 0).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Ingresos Mes</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-gray-900">{resumen?.participacionesActivas ?? 0}</p>
            <p className="text-sm text-gray-600">Participaciones</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded text-xs text-gray-600 font-mono">
        <p>API_BASE: {API_BASE}</p>
        <p>Endpoints: /api/health, /api/config, /api/dashboard/resumen</p>
      </div>
    </div>
  );
}
