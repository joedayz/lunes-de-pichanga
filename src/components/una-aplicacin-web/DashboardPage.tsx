import React, { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface DashboardData {
  totalSocios: number;
  totalPagos: number;
  totalInvitados: number;
  año: number;
}

interface Socio {
  id: string;
  nombre: string;
  email?: string;
}

interface Pago {
  id: string;
  monto: number;
  fecha: string;
}

interface Invitado {
  id: string;
  nombre: string;
  fecha: string;
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [año, setAño] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const dashboardRes = await fetch(
          BASE_URL + '/api/dashboard?anio=' + String(año)
        );
        if (!dashboardRes.ok) throw new Error('Error al cargar dashboard');
        const dashboardData = await dashboardRes.json();
        setDashboard(dashboardData);

        const sociosRes = await fetch(
          BASE_URL + '/api/socios?anio=' + String(año)
        );
        if (!sociosRes.ok) throw new Error('Error al cargar socios');
        const sociosData = await sociosRes.json();
        setSocios(Array.isArray(sociosData) ? sociosData : []);

        const pagosRes = await fetch(
          BASE_URL + '/api/pagos?anio=' + String(año)
        );
        if (!pagosRes.ok) throw new Error('Error al cargar pagos');
        const pagosData = await pagosRes.json();
        setPagos(Array.isArray(pagosData) ? pagosData : []);

        const invitadosRes = await fetch(
          BASE_URL + '/api/invitados?anio=' + String(año)
        );
        if (!invitadosRes.ok) throw new Error('Error al cargar invitados');
        const invitadosData = await invitadosRes.json();
        setInvitados(Array.isArray(invitadosData) ? invitadosData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [año]);

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="p-4">
        Cargando dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="p-4 bg-red-100 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Lunes de Pichanga</h1>

      <div className="mb-6">
        <label htmlFor="año-select" className="mr-2 font-semibold">
          Año:
        </label>
        <select
          id="año-select"
          value={año}
          onChange={(e) => setAño(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900">Socios</h2>
          <p className="text-3xl font-bold text-blue-700">
            {dashboard?.totalSocios ?? 0}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded border border-green-200">
          <h2 className="text-lg font-semibold text-green-900">Pagos</h2>
          <p className="text-3xl font-bold text-green-700">
            ${Number(dashboard?.totalPagos ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded border border-purple-200">
          <h2 className="text-lg font-semibold text-purple-900">Invitados</h2>
          <p className="text-3xl font-bold text-purple-700">
            {dashboard?.totalInvitados ?? 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-4">Últimos Socios</h3>
          <ul className="space-y-2">
            {socios.slice(0, 5).map((socio) => (
              <li
                key={socio.id}
                className="p-2 bg-gray-100 rounded flex justify-between"
              >
                <span>{socio.nombre}</span>
                {socio.email && <span className="text-sm text-gray-600">{socio.email}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Últimos Pagos</h3>
          <ul className="space-y-2">
            {pagos.slice(0, 5).map((pago) => (
              <li
                key={pago.id}
                className="p-2 bg-gray-100 rounded flex justify-between"
              >
                <span>{pago.fecha}</span>
                <span className="font-semibold">${Number(pago.monto).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
