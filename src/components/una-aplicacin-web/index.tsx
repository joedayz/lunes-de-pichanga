// === DashboardAdmin ===
import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface Resumen {
  mes: number;
  anio: number;
  ingresos: number;
  gastos: number;
  saldo: number;
}

interface Canasta {
  saldoTotal: number;
  ingresos: number;
  gastos: number;
}

export default function DashboardAdmin() {
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [canasta, setCanasta] = useState<Canasta | null>(null);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resRes, canRes] = await Promise.all([
          fetch(`${BASE_URL}/reportes/resumen?mes=${mes}&anio=${anio}`),
          fetch(`${BASE_URL}/reportes/canasta?anio=${anio}`)
        ]);
        if (!resRes.ok || !canRes.ok) throw new Error('Error al cargar reportes');
        setResumen(await resRes.json());
        setCanasta(await canRes.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mes, anio]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administración</h1>
      
      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md"
            aria-label="Seleccionar mes"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
          <input
            type="number"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md w-24"
            aria-label="Seleccionar año"
          />
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      {loading && <div className="text-gray-600">Cargando...</div>}

      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Ingresos</p>
            <p className="text-2xl font-bold text-green-600">S/ {resumen.ingresos.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Gastos</p>
            <p className="text-2xl font-bold text-red-600">S/ {resumen.gastos.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Saldo Mes</p>
            <p className={`text-2xl font-bold ${resumen.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              S/ {resumen.saldo.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {canasta && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Canasta Anual</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Ingresos Totales</p>
              <p className="text-xl font-bold text-green-600">S/ {canasta.ingresos.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Gastos Totales</p>
              <p className="text-xl font-bold text-red-600">S/ {canasta.gastos.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Saldo Canasta</p>
              <p className={`text-xl font-bold ${canasta.saldoTotal >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                S/ {canasta.saldoTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === RegistroForm ===
import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

type FormType = 'socio' | 'invitado' | 'movimiento';

export default function RegistroForm() {
  const [formType, setFormType] = useState<FormType>('socio');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'ingreso',
    monto: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let endpoint = '';
      let payload = {};

      if (formType === 'socio') {
        endpoint = '/socios';
        payload = { nombre: formData.nombre, email: formData.email, telefono: formData.telefono };
      } else if (formType === 'invitado') {
        endpoint = '/invitados';
        payload = { nombre: formData.nombre, email: formData.email, telefono: formData.telefono };
      } else {
        endpoint = '/movimientos';
        payload = {
          tipo: formData.tipo,
          monto: parseFloat(formData.monto),
          descripcion: formData.descripcion,
          fecha: formData.fecha
        };
      }

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      setMessage({ type: 'success', text: 'Registro exitoso' });
      setFormData({ nombre: '', email: '', telefono: '', tipo: 'ingreso', monto: '', descripcion: '', fecha: new Date().toISOString().split('T')[0] });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Nuevo Registro</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Registro</label>
        <select
          value={formType}
          onChange={(e) => setFormType(e.target.value as FormType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          aria-label="Tipo de registro"
        >
          <option value="socio">Nuevo Socio</option>
          <option value="invitado">Nuevo Invitado</option>
          <option value="movimiento">Movimiento (Ingreso/Gasto)</option>
        </select>
      </div>

      {message && (
        <div className={`p-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form aria-label="RegistroForm" onSubmit={handleSubmit}>
        {formType !== 'movimiento' && (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Nombre"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Email"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Teléfono"
              />
            </div>
          </>
        )}

        {formType === 'movimiento' && (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Tipo de movimiento"
              >
                <option value="ingreso">Ingreso</option>
                <option value="gasto">Gasto</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto (S/)</label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Monto"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Descripción"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Fecha"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400"
          aria-label="Enviar formulario"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}