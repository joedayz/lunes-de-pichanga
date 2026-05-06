import React, { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Socio {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  fechaRegistro?: string;
}

export default function SociosListPage() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [año, setAño] = useState(new Date().getFullYear());

  const fetchSocios = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(BASE_URL + '/api/socios?anio=' + String(año));
      if (!res.ok) throw new Error('Error al cargar socios');
      const data = await res.json();
      setSocios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocios();
  }, [año]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? BASE_URL + '/api/socios/' + editingId
        : BASE_URL + '/api/socios';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Error al guardar socio');
      setFormData({ nombre: '', email: '', telefono: '' });
      setEditingId(null);
      await fetchSocios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este socio?')) return;
    try {
      setError(null);
      const res = await fetch(BASE_URL + '/api/socios/' + id, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar socio');
      await fetchSocios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const handleEdit = (socio: Socio) => {
    setFormData({
      nombre: socio.nombre,
      email: socio.email || '',
      telefono: socio.telefono || '',
    });
    setEditingId(socio.id);
  };

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="p-4">
        Cargando socios...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestión de Socios</h1>

      {error && (
        <div role="alert" className="p-4 bg-red-100 text-red-700 mb-4 rounded">
          {error}
        </div>
      )}

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

      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-4 rounded mb-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4">
          {editingId ? 'Editar Socio' : 'Nuevo Socio'}
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
            aria-label="Nombre del socio"
            className="border px-3 py-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            aria-label="Email del socio"
            className="border px-3 py-2 rounded"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
            aria-label="Teléfono del socio"
            className="border px-3 py-2 rounded"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ nombre: '', email: '', telefono: '' });
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">Nombre</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Teléfono</th>
              <th className="border p-2 text-left">Fecha Registro</th>
              <th className="border p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {socios.map((socio) => (
              <tr key={socio.id} className="hover:bg-gray-50">
                <td className="border p-2">{socio.nombre}</td>
                <td className="border p-2">{socio.email || '-'}</td>
                <td className="border p-2">{socio.telefono || '-'}</td>
                <td className="border p-2">{socio.fechaRegistro || '-'}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(socio)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    aria-label={"Editar " + socio.nombre}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(socio.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    aria-label={"Eliminar " + socio.nombre}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {socios.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-4">No hay socios registrados.</p>
      )}
    </div>
  );
}
