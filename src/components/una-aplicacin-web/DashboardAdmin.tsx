import React, { useEffect, useState } from 'react';

interface ResumenDashboard {
  sociosActivos: number;
  cuotasPendientes: number;
  proximasPichangas: number;
  recaudoTotal: number;
}

interface Socio {
  id: string;
  nombre: string;
  email: string;
  estado: string;
}

interface DashboardAdminProps {
  baseUrl?: string;
}

export default function DashboardAdmin({ baseUrl = 'http://localhost:3000' }: DashboardAdminProps) {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resRes, sociosRes] = await Promise.all([
          fetch(`${baseUrl}/api/dashboard/resumen`),
          fetch(`${baseUrl}/api/socios`)
        ]);

        if (!resRes.ok || !sociosRes.ok) {
          throw new Error('Error al cargar datos del dashboard');
        }

        const resData = await resRes.json();
        const sociosData = await sociosRes.json();

        setResumen(resData);
        setSocios(sociosData.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  if (loading) return <div role="status" aria-live="polite">Cargando dashboard...</div>;
  if (error) return <div role="alert" className="error">{error}</div>;

  return (
    <section aria-label="Dashboard administrativo" className="dashboard">
      <h1>Dashboard - Lunes de Pichanga</h1>
      
      <div className="resumen-grid">
        <article className="card">
          <h2>Socios Activos</h2>
          <p className="metric">{resumen?.sociosActivos ?? 0}</p>
        </article>
        <article className="card">
          <h2>Cuotas Pendientes</h2>
          <p className="metric">{resumen?.cuotasPendientes ?? 0}</p>
        </article>
        <article className="card">
          <h2>Próximas Pichangas</h2>
          <p className="metric">{resumen?.proximasPichangas ?? 0}</p>
        </article>
        <article className="card">
          <h2>Recaudo Total</h2>
          <p className="metric">\${Number(resumen?.recaudoTotal ?? 0).toFixed(2)}</p>
        </article>
      </div>

      <section aria-label="Lista de socios" className="socios-section">
        <h2>Socios Registrados</h2>
        {socios.length === 0 ? (
          <p>No hay socios registrados</p>
        ) : (
          <ul className="socios-list">
            {socios.map((socio) => (
              <li key={socio.id} className="socio-item">
                <strong>{socio.nombre}</strong> - {socio.email}
                <span className={`estado ${socio.estado}`}>{socio.estado}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
