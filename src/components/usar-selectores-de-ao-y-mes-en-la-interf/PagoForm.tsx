import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Socio {
  id: string;
  nombre: string;
  anio: number;
}

interface PagoFormProps {
  globalYear?: number;
  onSuccess?: () => void;
}

const PagoForm: React.FC<PagoFormProps> = ({ globalYear = new Date().getFullYear(), onSuccess }) => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    socio_id: '',
    mes: 1,
    anio: globalYear,
    monto: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar socios y años disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sociosRes, yearsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/socios`),
          fetch(`${BASE_URL}/api/anos-disponibles`)
        ]);

        if (!sociosRes.ok || !yearsRes.ok) throw new Error('Error cargando datos');

        setSocios(await sociosRes.json());
        const years = await yearsRes.json();
        setAvailableYears(Array.isArray(years) ? years : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'mes' || name === 'anio' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.socio_id || !formData.monto) {
        throw new Error('Completa todos los campos requeridos');
      }

      const payload = {
        socio_id: formData.socio_id,
        mes: formData.mes,
        anio: formData.anio,
        monto: Number(formData.monto),
        fecha: formData.fecha
      };

      const res = await fetch(`${BASE_URL}/api/pagos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Error registrando pago');
      }

      setSuccess(true);
      setFormData({
        socio_id: '',
        mes: 1,
        anio: globalYear,
        monto: '',
        fecha: new Date().toISOString().split('T')[0]
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form aria-label="PagoForm"
      onSubmit={handleSubmit}
      style={{
        maxWidth: '500px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fafafa'
      }}
    >
      <h2>Registrar Pago de Cuota</h2>

      {error && (
        <div
          role="alert"
          style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px'
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            borderRadius: '4px'
          }}
        >
          ✓ Pago registrado exitosamente
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="socio_id" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Socio *
        </label>
        <select
          id="socio_id"
          name="socio_id"
          value={formData.socio_id}
          onChange={handleChange}
          required
          aria-label="Seleccionar socio"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        >
          <option value="">-- Selecciona un socio --</option>
          {socios.map((socio) => (
            <option key={socio.id} value={socio.id}>
              {socio.nombre} ({socio.anio})
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label htmlFor="mes" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Mes *
          </label>
          <select
            id="mes"
            name="mes"
            value={formData.mes}
            onChange={handleChange}
            aria-label="Seleccionar mes"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="anio" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Año *
          </label>
          <select
            id="anio"
            name="anio"
            value={formData.anio}
            onChange={handleChange}
            aria-label="Seleccionar año"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            {availableYears.length > 0 ? (
              availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            ) : (
              <option value={globalYear}>{globalYear}</option>
            )}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="monto" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Monto ($) *
        </label>
        <input
          id="monto"
          type="number"
          name="monto"
          value={formData.monto}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          aria-label="Ingresar monto del pago"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="fecha" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Fecha
        </label>
        <input
          id="fecha"
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          aria-label="Seleccionar fecha del pago"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: loading ? '#ccc' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Registrando...' : 'Registrar Pago'}
      </button>
    </form>
  );
};

export default PagoForm;
