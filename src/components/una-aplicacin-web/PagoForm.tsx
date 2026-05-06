import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Socio {
  id: number;
  nombre: string;
  anio: number;
}

interface PagoFormData {
  socio_id: number | '';
  mes: number | '';
  anio: number | '';
  monto: number | '';
  fecha: string;
}

const normalizeArray = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
    return (data as any).data;
  }
  return [];
};

export default function PagoForm() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [formData, setFormData] = useState<PagoFormData>({
    socio_id: '',
    mes: '',
    anio: new Date().getFullYear(),
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/socios`);
        if (!res.ok) throw new Error('Error al cargar socios');
        const data = await res.json();
        const sociosArray = normalizeArray(data) as Socio[];
        setSocios(sociosArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };
    fetchSocios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['socio_id', 'mes', 'anio', 'monto'].includes(name) ? (value ? Number(value) : '') : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.socio_id || !formData.mes || !formData.anio || !formData.monto) {
      setError('Todos los campos son requeridos');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          socio_id: formData.socio_id,
          mes: formData.mes,
          anio: formData.anio,
          monto: formData.monto,
          fecha: formData.fecha,
        }),
      });
      if (!res.ok) throw new Error('Error al registrar pago');
      setSuccess(true);
      setFormData({
        socio_id: '',
        mes: '',
        anio: new Date().getFullYear(),
        monto: '',
        fecha: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Registrar Pago</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">Pago registrado exitosamente</div>}

      <form aria-label="PagoForm" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="socio_id" className="block text-sm font-medium mb-1">
            Socio
          </label>
          <select
            id="socio_id"
            name="socio_id"
            value={formData.socio_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            aria-label="Seleccionar socio"
            required
          >
            <option value="">-- Seleccionar --</option>
            {socios.map((socio) => (
              <option key={socio.id} value={socio.id}>
                {socio.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mes" className="block text-sm font-medium mb-1">
            Mes
          </label>
          <input
            id="mes"
            type="number"
            name="mes"
            min="1"
            max="12"
            value={formData.mes}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            aria-label="Mes del pago"
            required
          />
        </div>

        <div>
          <label htmlFor="anio" className="block text-sm font-medium mb-1">
            Año
          </label>
          <input
            id="anio"
            type="number"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            aria-label="Año del pago"
            required
          />
        </div>

        <div>
          <label htmlFor="monto" className="block text-sm font-medium mb-1">
            Monto
          </label>
          <input
            id="monto"
            type="number"
            name="monto"
            step="0.01"
            value={formData.monto}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            aria-label="Monto del pago"
            required
          />
        </div>

        <div>
          <label htmlFor="fecha" className="block text-sm font-medium mb-1">
            Fecha
          </label>
          <input
            id="fecha"
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            aria-label="Fecha del pago"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          aria-label="Enviar formulario de pago"
        >
          {loading ? 'Registrando...' : 'Registrar Pago'}
        </button>
      </form>
    </div>
  );
}
