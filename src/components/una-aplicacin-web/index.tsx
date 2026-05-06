// === DashboardAdmin ===
import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface Resumen {
  mes: number;
  anio: number;
  ingresosCuotas: number;
  ingresosExtra: number;
  gastos: number;
  saldoCanasta: number;
  fondoAnualPorSocio: number;
}

interface Transaccion {
  id: string;
  tipo: 'cuota' | 'gasto' | 'ingreso';
  monto: number;
  fecha: string;
  descripcion: string;
  socioId?: string;
}

export default function DashboardAdmin() {
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [mes, anio]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [resRes, transRes] = await Promise.all([
        fetch(`${BASE_URL}/api/reportes/resumen?mes=${mes}&anio=${anio}`),
        fetch(`${BASE_URL}/api/reportes/detalles?mes=${mes}&anio=${anio}`)
      ]);

      if (!resRes.ok || !transRes.ok) throw new Error('Error al cargar datos');

      const resData = await resRes.json();
      const transData = await transRes.json();

      setResumen(resData);
      setTransacciones(transData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard - Grupo Deportivo</h1>

      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Mes</label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border rounded px-3 py-2"
            aria-label="Seleccionar mes"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2024, m - 1).toLocaleString('es-ES', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Año</label>
          <input
            type="number"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="border rounded px-3 py-2 w-24"
            aria-label="Seleccionar año"
          />
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      {loading && <div className="text-gray-600">Cargando...</div>}

      {resumen && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Ingresos Cuotas</p>
            <p className="text-2xl font-bold text-green-600">S/ {Number(resumen.ingresosCuotas ?? 0).toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Ingresos Extra</p>
            <p className="text-2xl font-bold text-green-600">S/ {Number(resumen.ingresosExtra ?? 0).toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Gastos</p>
            <p className="text-2xl font-bold text-red-600">S/ {Number(resumen.gastos ?? 0).toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Saldo Canasta</p>
            <p className="text-2xl font-bold text-blue-600">S/ {Number(resumen.saldoCanasta ?? 0).toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow col-span-2">
            <p className="text-sm text-gray-600">Fondo Anual por Socio</p>
            <p className="text-2xl font-bold text-purple-600">S/ {Number(resumen.fondoAnualPorSocio ?? 0).toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Transacciones</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">Descripción</th>
                <th className="px-4 py-2 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.length > 0 ? (
                transacciones.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(t.fecha).toLocaleDateString('es-ES')}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          t.tipo === 'cuota'
                            ? 'bg-blue-100 text-blue-800'
                            : t.tipo === 'gasto'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {t.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-2">{t.descripcion}</td>
                    <td className={`px-4 py-2 text-right font-semibold ${
                      t.tipo === 'gasto' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {t.tipo === 'gasto' ? '-' : '+'} S/ {Number(t.monto ?? 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                    Sin transacciones
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// === FormRegistroSocioYCuota ===
import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

type FormType = 'socio' | 'cuota' | 'transaccion';

export default function FormRegistroSocioYCuota() {
  const [formType, setFormType] = useState<FormType>('socio');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let endpoint = '';
      let payload = {};

      if (formType === 'socio') {
        endpoint = '/api/socios';
        payload = {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          fechaRegistro: new Date().toISOString()
        };
      } else if (formType === 'cuota') {
        endpoint = '/api/cuotas';
        payload = {
          socioId: formData.socioId,
          tipo: formData.tipo,
          monto: formData.tipo === 'socio' ? 15 : 5,
          mes: Number(formData.mes),
          anio: Number(formData.anio),
          fecha: new Date().toISOString()
        };
      } else if (formType === 'transaccion') {
        endpoint = '/api/transacciones';
        payload = {
          tipo: formData.tipoTransaccion,
          monto: Number(formData.monto),
          descripcion: formData.descripcion,
          fecha: new Date().toISOString()
        };
      }

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Error ${res.status}`);
      }

      setMessage(`✓ ${formType === 'socio' ? 'Socio registrado' : formType === 'cuota' ? 'Cuota registrada' : 'Transacción registrada'} exitosamente`);
      setFormData({});
    } catch (err) {
      setMessage(`✗ ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Registro - Grupo Deportivo</h1>

      <div className="flex gap-2 mb-6 border-b">
        {(['socio', 'cuota', 'transaccion'] as FormType[]).map((type) => (
          <button
            key={type}
            onClick={() => {
              setFormType(type);
              setMessage('');
            }}
            className={`px-4 py-2 font-semibold ${
              formType === type
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label={`Ir a formulario de ${type}`}
          >
            {type === 'socio' ? 'Nuevo Socio' : type === 'cuota' ? 'Registrar Cuota' : 'Registrar Transacción'}
          </button>
        ))}
      </div>

      {message && (
        <div className={`p-4 rounded mb-4 ${
          message.startsWith('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form aria-label="FormRegistroSocioYCuota" onSubmit={handleSubmit} className="space-y-4">
        {formType === 'socio' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                aria-label="Nombre del socio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                aria-label="Email del socio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                aria-label="Teléfono del socio"
              />
            </div>
          </>
        )}

        {formType === 'cuota' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">ID Socio / Invitado</label>
              <input
                type="text"
                name="socioId"
                value={formData.socioId || ''}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                aria-label="ID del socio o invitado"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                name="tipo"
                value={formData.tipo || 'socio'}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                aria-label="Tipo de participante"
              >
                <option value="socio">Socio (S/ 15)</option>
                <option value="invitado">Invitado (S/ 5)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mes</label>
                <select
                  name="mes"
                  value={formData.mes || ''}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  aria-label="Mes de la cuota"
                >
                  <option value="">Seleccionar</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Año</label>
                <input
                  type="number"
                  name="anio"
                  value={formData.anio || new Date().getFullYear()}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  aria-label="Año de la cuota"
                />
              </div>
            </div>
          </>
        )}

        {formType === 'transaccion' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Transacción</label>
              <select
                name="tipoTransaccion"
                value={formData.tipoTransaccion || 'gasto'}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                aria-label="Tipo de transacción"
              >
                <option value="gasto">Gasto (pelotas, chalecos)</option>
                <option value="ingreso">Ingreso Extra (rifas, campeonatos)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monto (S/)</label>
              <input
                type="number"
                name="monto"
                value={formData.monto || ''}
                onChange={handleChange}
                step="0.01"
                required
                className="w-full border rounded px-3 py-2"
                aria-label="Monto de la transacción"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows={3}
                aria-label="Descripción de la transacción"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          aria-label="Enviar formulario"
        >
          {loading ? 'Procesando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}