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
  const [formData, setFormData] = useState({ socioId: '', monto: '', anio: selectedYear });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar socios cuando cambia el año
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
    if (name === 'year') {
      setSelectedYear(Number(value));
      setFormData((prev) => ({ ...prev, anio: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.socioId || !formData.monto) {
      setError('Completa todos los campos');
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
          anio: formData.anio
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSuccess(true);
      setFormData({ socioId: '', monto: '', anio: selectedYear });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(`Error registrando pago: ${err instanceof Error ? err.message : 'desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Registrar Pago</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">Pago registrado exitosamente</div>}
      
      <form aria-label="PagoForm" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Año
          </label>
          <input
            id="year"
            type="number"
            name="year"
            value={selectedYear}
            onChange={handleChange}
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
            placeholder="0.00"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          aria-label="Enviar formulario de pago"
        >
          {loading ? 'Registrando...' : 'Registrar Pago'}
        </button>
      </form>
    </div>
  );
}
