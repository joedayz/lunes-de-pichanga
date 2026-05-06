import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Año {
  id: string;
  anio: number;
}

interface Socio {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  anio: number;
}

interface Invitado {
  id: string;
  nombre: string;
  anio: number;
}

export default function RegistroSocioInvitado() {
  const [años, setAños] = useState<Año[]>([]);
  const [tab, setTab] = useState<'socio' | 'invitado'>('socio');
  const [socios, setSocios] = useState<Socio[]>([]);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formSocio, setFormSocio] = useState({ nombre: '', email: '', telefono: '', anio: new Date().getFullYear() });
  const [formInvitado, setFormInvitado] = useState({ nombre: '', anio: new Date().getFullYear() });

  useEffect(() => {
    const fetchAños = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/anos`);
        if (!res.ok) throw new Error('Error al cargar años');
        setAños(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };
    fetchAños();
  }, []);

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const [sociosRes, invitadosRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/socios`),
          fetch(`${BASE_URL}/api/v1/invitados`)
        ]);
        if (sociosRes.ok) setSocios(await sociosRes.json());
        if (invitadosRes.ok) setInvitados(await invitadosRes.json());
      } catch (err) {
        console.error('Error al cargar listas:', err);
      }
    };
    fetchListas();
  }, []);

  const handleSubmitSocio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/socios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formSocio)
      });
      if (!res.ok) throw new Error('Error al registrar socio');
      setSuccess('Socio registrado exitosamente');
      setFormSocio({ nombre: '', email: '', telefono: '', anio: new Date().getFullYear() });
      const sociosRes = await fetch(`${BASE_URL}/api/v1/socios`);
      if (sociosRes.ok) setSocios(await sociosRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInvitado = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/invitados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInvitado)
      });
      if (!res.ok) throw new Error('Error al registrar invitado');
      setSuccess('Invitado registrado exitosamente');
      setFormInvitado({ nombre: '', anio: new Date().getFullYear() });
      const invitadosRes = await fetch(`${BASE_URL}/api/v1/invitados`);
      if (invitadosRes.ok) setInvitados(await invitadosRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Registro de Socios e Invitados</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setTab('socio')}
          className={`px-4 py-2 font-semibold ${tab === 'socio' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          aria-label="Registrar socio"
        >
          Registrar Socio
        </button>
        <button
          onClick={() => setTab('invitado')}
          className={`px-4 py-2 font-semibold ${tab === 'invitado' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          aria-label="Registrar invitado"
        >
          Registrar Invitado
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>}

      {tab === 'socio' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Nuevo Socio</h2>
            <form aria-label="RegistroSocioInvitado" onSubmit={handleSubmitSocio} className="space-y-4">
              <div>
                <label htmlFor="socio-nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input aria-label="campo de entrada"
                  id="socio-nombre"
                  type="text"
                  required
                  value={formSocio.nombre}
                  onChange={(e) => setFormSocio({ ...formSocio, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="socio-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input aria-label="campo de entrada"
                  id="socio-email"
                  type="email"
                  value={formSocio.email}
                  onChange={(e) => setFormSocio({ ...formSocio, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="socio-telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input aria-label="campo de entrada"
                  id="socio-telefono"
                  type="tel"
                  value={formSocio.telefono}
                  onChange={(e) => setFormSocio({ ...formSocio, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="socio-anio" className="block text-sm font-medium text-gray-700 mb-1">
                  Año Deportivo *
                </label>
                <select
                  id="socio-anio"
                  required
                  value={formSocio.anio}
                  onChange={(e) => setFormSocio({ ...formSocio, anio: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {años.map((a) => (
                    <option key={a.id} value={a.anio}>
                      {a.anio}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Registrando...' : 'Registrar Socio'}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Socios Registrados</h2>
            {socios.length === 0 ? (
              <p className="text-gray-500">Sin socios registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Nombre</th>
                      <th className="px-3 py-2 text-left font-semibold">Email</th>
                      <th className="px-3 py-2 text-left font-semibold">Año</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socios.map((s) => (
                      <tr key={s.id} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2">{s.nombre}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{s.email}</td>
                        <td className="px-3 py-2">{s.anio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'invitado' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Nuevo Invitado</h2>
            <form aria-label="RegistroSocioInvitado" onSubmit={handleSubmitInvitado} className="space-y-4">
              <div>
                <label htmlFor="inv-nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input aria-label="campo de entrada"
                  id="inv-nombre"
                  type="text"
                  required
                  value={formInvitado.nombre}
                  onChange={(e) => setFormInvitado({ ...formInvitado, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="inv-anio" className="block text-sm font-medium text-gray-700 mb-1">
                  Año Deportivo *
                </label>
                <select
                  id="inv-anio"
                  required
                  value={formInvitado.anio}
                  onChange={(e) => setFormInvitado({ ...formInvitado, anio: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {años.map((a) => (
                    <option key={a.id} value={a.anio}>
                      {a.anio}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Registrando...' : 'Registrar Invitado'}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Invitados Registrados</h2>
            {invitados.length === 0 ? (
              <p className="text-gray-500">Sin invitados registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Nombre</th>
                      <th className="px-3 py-2 text-left font-semibold">Año</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitados.map((i) => (
                      <tr key={i.id} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2">{i.nombre}</td>
                        <td className="px-3 py-2">{i.anio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
