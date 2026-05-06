// === DashboardAdmin ===
import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface ResumenDashboard {
  totalSocios: number;
  cuotasPendientes: number;
  ingresosMes: number;
  cuotasVencidas: number;
}

interface CuotaVencida {
  id: string;
  socioNombre: string;
  monto: number;
  fechaVencimiento: string;
}

export default function DashboardAdmin() {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);
  const [vencidas, setVencidas] = useState<CuotaVencida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resRes, vencRes] = await Promise.all([
          fetch(`${BASE_URL}/api/dashboard/resumen`),
          fetch(`${BASE_URL}/api/dashboard/cuotas-vencidas`)
        ]);

        if (!resRes.ok || !vencRes.ok) {
          throw new Error('Error al cargar dashboard');
        }

        const resData = await resRes.json();
        const vencData = await vencRes.json();

        setResumen(resData);
        setVencidas(vencData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div aria-label="Cargando dashboard">Cargando...</div>;
  if (error) return <div role="alert">Error: {error}</div>;

  return (
    <div className="dashboard-admin">
      <h1>Dashboard Administrativo</h1>
      {resumen && (
        <div className="resumen-cards">
          <div className="card">
            <h2>Total Socios</h2>
            <p className="metric">{resumen.totalSocios}</p>
          </div>
          <div className="card">
            <h2>Cuotas Pendientes</h2>
            <p className="metric">{resumen.cuotasPendientes}</p>
          </div>
          <div className="card">
            <h2>Ingresos Mes</h2>
            <p className="metric">${Number(resumen.ingresosMes ?? 0).toFixed(2)}</p>
          </div>
          <div className="card alert">
            <h2>Cuotas Vencidas</h2>
            <p className="metric">{resumen.cuotasVencidas}</p>
          </div>
        </div>
      )}
      {vencidas.length > 0 && (
        <div className="cuotas-vencidas">
          <h2>Detalle de Cuotas Vencidas</h2>
          <table aria-label="Cuotas vencidas">
            <thead>
              <tr>
                <th>Socio</th>
                <th>Monto</th>
                <th>Fecha Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {vencidas.map((cuota) => (
                <tr key={cuota.id}>
                  <td>{cuota.socioNombre}</td>
                  <td>${Number(cuota.monto ?? 0).toFixed(2)}</td>
                  <td>{new Date(cuota.fechaVencimiento).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// === FormRegistroSocioYCuota ===
import React, { useEffect, useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface Socio {
  id: string;
  nombre: string;
  email: string;
  estado: string;
}

interface Cuota {
  id: string;
  monto: number;
  estado: string;
  fechaVencimiento: string;
}

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
}

export default function FormRegistroSocioYCuota() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [selectedSocio, setSelectedSocio] = useState<string>('');
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSocios();
  }, []);

  const fetchSocios = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/socios`);
      if (!res.ok) throw new Error('Error al cargar socios');
      const data = await res.json();
      setSocios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const fetchCuotas = async (socioId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/socios/${socioId}/cuotas`);
      if (!res.ok) throw new Error('Error al cargar cuotas');
      const data = await res.json();
      setCuotas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistroSocio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${BASE_URL}/api/socios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Error al registrar socio');
      setSuccess('Socio registrado exitosamente');
      setFormData({ nombre: '', email: '', telefono: '' });
      fetchSocios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handlePagarCuota = async (cuotaId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/cuotas/${cuotaId}/pagar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Error al pagar cuota');
      setSuccess('Cuota pagada exitosamente');
      if (selectedSocio) fetchCuotas(selectedSocio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSocio = (socioId: string) => {
    setSelectedSocio(socioId);
    if (socioId) fetchCuotas(socioId);
  };

  return (
    <div className="form-registro">
      <h1>Registro de Socio y Gestión de Cuotas</h1>

      {error && <div role="alert" className="error">{error}</div>}
      {success && <div role="status" className="success">{success}</div>}

      <form aria-label="FormRegistroSocioYCuota" onSubmit={handleRegistroSocio} aria-label="Formulario de registro de socio">
        <h2>Registrar Nuevo Socio</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
          aria-label="Nombre del socio"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          aria-label="Email del socio"
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleInputChange}
          aria-label="Teléfono del socio"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar Socio'}
        </button>
      </form>

      <div className="cuotas-section">
        <h2>Gestionar Cuotas</h2>
        <select
          value={selectedSocio}
          onChange={(e) => handleSelectSocio(e.target.value)}
          aria-label="Seleccionar socio"
        >
          <option value="">Seleccionar socio...</option>
          {socios.map((socio) => (
            <option key={socio.id} value={socio.id}>
              {socio.nombre}
            </option>
          ))}
        </select>

        {cuotas.length > 0 && (
          <table aria-label="Cuotas del socio">
            <thead>
              <tr>
                <th>Monto</th>
                <th>Estado</th>
                <th>Vencimiento</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota.id}>
                  <td>${Number(cuota.monto ?? 0).toFixed(2)}</td>
                  <td>{cuota.estado}</td>
                  <td>{new Date(cuota.fechaVencimiento).toLocaleDateString()}</td>
                  <td>
                    {cuota.estado === 'pendiente' && (
                      <button
                        onClick={() => handlePagarCuota(cuota.id)}
                        disabled={loading}
                      >
                        Pagar
                      </button>
                    )}
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