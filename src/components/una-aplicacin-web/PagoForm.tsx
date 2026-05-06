import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Socio {
  id: string;
  nombre: string;
  anio: number;
}

export default function PagoForm() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [formData, setFormData] = useState({ socioId: '', monto: '', estado: 'pendiente' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/socios?anio=${selectedYear}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSocios(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(`Error cargando socios: ${err instanceof Error ? err.message : 'desconocido'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchSocios();
  }, [selectedYear]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.socioId || !formData.monto) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          socioId: formData.socioId,
          monto: Number(formData.monto),
          anio: selectedYear,
          estado: formData.estado
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSuccess('Pago registrado exitosamente');
      setFormData({ socioId: '', monto: '', estado: 'pendiente' });
    } catch (err) {
      setError(`Error registrando pago: ${err instanceof Error ? err.message : 'desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-md">
      <h2 className="text-2xl font-bold mb-6">Registrar Pago</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      <form aria-label="PagoForm" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Año
          </label>
          <input aria-label="campo de entrada"
            id="year"
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            aria-label="Año del pago"
          />
        </div>

        <div>
          <label htmlFor="socioId" className="block text-sm font-medium mb-1">
            Socio
          </label>
          <select
            id="socioId"
            name="socioId"
            value={formData.socioId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            aria-label="Seleccionar socio"
            disabled={loading}
          >
            <option value="">-- Selecciona un socio --</option>
            {socios.map((socio) => (
              <option key={socio.id} value={socio.id}>
                {socio.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="monto" className="block text-sm font-medium mb-1">
            Monto ($)
          </label>
          <input
            id="monto"
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border rounded"
            aria-label="Monto del pago"
          />
        </div>

        <div>
          <label htmlFor="estado" className="block text-sm font-medium mb-1">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            aria-label="Estado del pago"
          >
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          aria-label="Enviar formulario de pago"
        >
          {loading ? 'Registrando...' : 'Registrar Pago'}
        </button>
      </form>
    </div>
  );
}
