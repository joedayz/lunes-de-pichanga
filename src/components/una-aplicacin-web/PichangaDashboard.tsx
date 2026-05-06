import React, { useState, useEffect } from 'react';
import { asArray, dashboardShape } from './json-normalize.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Socio {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  año_afiliacion: number;
}

interface Invitado {
  id: string;
  nombre: string;
  año: number;
}

interface Pago {
  id: string;
  socio_id: string;
  año: number;
  mes: number;
  monto: number;
  fecha: string;
}

interface DashboardData {
  total_socios: number;
  total_invitados: number;
  recaudacion: number;
}

type Tab = 'socios' | 'invitados' | 'pagos';

const PichangaDashboard: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [año, setAño] = useState(currentYear);
  const [activeTab, setActiveTab] = useState<Tab>('socios');
  const [socios, setSocios] = useState<Socio[]>([]);
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSocios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/socios?año=${año}`);
      if (!res.ok) throw new Error('Error al cargar socios');
      setSocios(asArray<Socio>(await res.json()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitados = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/invitados?año=${año}`);
      if (!res.ok) throw new Error('Error al cargar invitados');
      setInvitados(asArray<Invitado>(await res.json()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fetchPagos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/pagos?año=${año}`);
      if (!res.ok) throw new Error('Error al cargar pagos');
      setPagos(asArray<Pago>(await res.json()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/dashboard?año=${año}`);
      if (!res.ok) throw new Error('Error al cargar dashboard');
      setDashboard(dashboardShape(await res.json()));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    if (activeTab === 'socios') fetchSocios();
    else if (activeTab === 'invitados') fetchInvitados();
    else if (activeTab === 'pagos') fetchPagos();
  }, [año, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Lunes de Pichanga</h1>
          <p className="text-slate-600">Gestión de socios, invitados y pagos</p>
        </div>

        {/* Year Selector */}
        <div className="mb-6 flex items-center gap-4">
          <label htmlFor="year-select" className="text-sm font-semibold text-slate-700">
            Año:
          </label>
          <select
            id="year-select"
            value={año}
            onChange={(e) => setAño(Number(e.target.value))}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Seleccionar año"
          >
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Dashboard Cards */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <p className="text-sm text-slate-600 font-medium">Socios</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{dashboard.total_socios}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <p className="text-sm text-slate-600 font-medium">Invitados</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{dashboard.total_invitados}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
              <p className="text-sm text-slate-600 font-medium">Recaudación</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">${Number(dashboard.recaudacion ?? 0).toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b border-slate-200">
            {(['socios', 'invitados', 'pagos'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-selected={activeTab === tab}
                role="tab"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8 text-slate-500">Cargando...</div>
            ) : activeTab === 'socios' ? (
              <SociosTab socios={socios} año={año} onRefresh={fetchSocios} />
            ) : activeTab === 'invitados' ? (
              <InvitadosTab invitados={invitados} año={año} onRefresh={fetchInvitados} />
            ) : (
              <PagosTab pagos={pagos} socios={socios} año={año} onRefresh={fetchPagos} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SociosTab: React.FC<{
  socios: Socio[];
  año: number;
  onRefresh: () => void;
}> = ({ socios, año, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/socios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, año_afiliacion: año }),
      });
      if (!res.ok) throw new Error('Error al crear socio');
      setFormData({ nombre: '', email: '', telefono: '' });
      setShowForm(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        {showForm ? 'Cancelar' : '+ Nuevo Socio'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nombre *"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
              aria-label="Nombre del socio"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              aria-label="Email del socio"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              aria-label="Teléfono del socio"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium text-sm"
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      )}

      {socios.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No hay socios registrados para {año}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {socios.map((s) => (
                <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">{s.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{s.email || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{s.telefono || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const InvitadosTab: React.FC<{
  invitados: Invitado[];
  año: number;
  onRefresh: () => void;
}> = ({ invitados, año, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/invitados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, año }),
      });
      if (!res.ok) throw new Error('Error al crear invitado');
      setNombre('');
      setShowForm(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
      >
        {showForm ? 'Cancelar' : '+ Nuevo Invitado'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Nombre *"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              required
              aria-label="Nombre del invitado"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium text-sm"
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      {invitados.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No hay invitados registrados para {año}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invitados.map((inv) => (
            <div key={inv.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded mb-2">
                Invitado
              </span>
              <p className="text-slate-900 font-medium">{inv.nombre}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PagosTab: React.FC<{
  pagos: Pago[];
  socios: Socio[];
  año: number;
  onRefresh: () => void;
}> = ({ pagos, socios, año, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    socio_id: '',
    mes: new Date().getMonth() + 1,
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.socio_id || !formData.monto) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          año,
          monto: Number(formData.monto),
        }),
      });
      if (!res.ok) throw new Error('Error al registrar pago');
      setFormData({
        socio_id: '',
        mes: new Date().getMonth() + 1,
        monto: '',
        fecha: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalRecaudado = pagos.reduce((sum, p) => sum + (p.monto || 0), 0);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
        >
          {showForm ? 'Cancelar' : '+ Registrar Pago'}
        </button>
        <p className="text-lg font-semibold text-slate-900">
          Total: ${Number(totalRecaudado ?? 0).toFixed(2)}
        </p>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={formData.socio_id}
              onChange={(e) => setFormData({ ...formData, socio_id: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              required
              aria-label="Seleccionar socio"
            >
              <option value="">Seleccionar socio</option>
              {socios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
            <select
              value={formData.mes}
              onChange={(e) => setFormData({ ...formData, mes: Number(e.target.value) })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              aria-label="Seleccionar mes"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2024, m - 1).toLocaleString('es-ES', { month: 'long' })}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monto"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              required
              aria-label="Monto del pago"
            />
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              aria-label="Fecha del pago"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors font-medium text-sm"
          >
            {submitting ? 'Guardando...' : 'Registrar'}
          </button>
        </form>
      )}

      {pagos.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No hay pagos registrados para {año}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Socio</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Mes</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Monto</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((p) => {
                const socio = socios.find((s) => s.id === p.socio_id);
                return (
                  <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900">{socio?.nombre || 'Desconocido'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(2024, p.mes - 1).toLocaleString('es-ES', { month: 'long' })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">${Number(p.monto ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(p.fecha).toLocaleDateString('es-ES')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PichangaDashboard;
