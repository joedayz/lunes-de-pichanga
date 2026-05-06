// === DashboardAdmin ===
import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface Socio {
  id: string;
  nombre: string;
  email: string;
}

interface Pichanga {
  id: string;
  fecha: string;
  lugar: string;
}

const DashboardAdmin: React.FC = () => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [pichangas, setPichangas] = useState<Pichanga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sociosRes, pichangasRes] = await Promise.all([
          fetch(`${BASE_URL}/api/socios`),
          fetch(`${BASE_URL}/api/pichangas`)
        ]);

        if (!sociosRes.ok || !pichangasRes.ok) {
          throw new Error('Error al cargar datos');
        }

        const sociosData = await sociosRes.json();
        const pichangasData = await pichangasRes.json();

        setSocios(sociosData);
        setPichangas(pichangasData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div aria-label="Cargando">Cargando...</div>;
  if (error) return <div aria-label="Error" role="alert">{error}</div>;

  return (
    <div className="dashboard-admin">
      <h1>Dashboard Administrativo</h1>
      <section aria-labelledby="socios-title">
        <h2 id="socios-title">Socios Registrados ({socios.length})</h2>
        <ul>
          {socios.map((socio) => (
            <li key={socio.id}>
              {socio.nombre} - {socio.email}
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="pichangas-title">
        <h2 id="pichangas-title">Pichangas Próximas ({pichangas.length})</h2>
        <ul>
          {pichangas.map((pichanga) => (
            <li key={pichanga.id}>
              {pichanga.fecha} - {pichanga.lugar}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DashboardAdmin;

// === FormRegistroSocioYCuota ===
import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface FormData {
  nombre: string;
  email: string;
  monto: string;
}

const FormRegistroSocioYCuota: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    monto: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const socioRes = await fetch(`${BASE_URL}/api/socios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: formData.nombre, email: formData.email })
      });

      if (!socioRes.ok) throw new Error('Error al registrar socio');
      const socio = await socioRes.json();

      const cuotaRes = await fetch(`${BASE_URL}/api/cuotas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          socio_id: socio.id,
          monto: Number(formData.monto ?? 0).toFixed(2)
        })
      });

      if (!cuotaRes.ok) throw new Error('Error al registrar cuota');

      setMessage('Socio y cuota registrados exitosamente');
      setFormData({ nombre: '', email: '', monto: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form aria-label="FormRegistroSocioYCuota" onSubmit={handleSubmit} aria-label="Formulario de registro de socio y cuota">
      <h2>Registrar Socio y Cuota</h2>
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input aria-label="campo de entrada"
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input aria-label="campo de entrada"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="monto">Monto Cuota:</label>
        <input aria-label="campo de entrada"
          id="monto"
          name="monto"
          type="number"
          step="0.01"
          value={formData.monto}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </div>
      <button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
      {message && <p role="status" style={{ color: 'green' }}>{message}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default FormRegistroSocioYCuota;