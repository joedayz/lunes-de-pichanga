import React, { useState } from 'react';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  cuotaInicial: number;
}

interface FormRegistroProps {
  baseUrl?: string;
  onSuccess?: () => void;
}

export default function FormRegistroSocioYCuota({ baseUrl = 'http://localhost:3000', onSuccess }: FormRegistroProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    cuotaInicial: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cuotaInicial' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${baseUrl}/api/socios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Error ${response.status}`);
      }

      setSuccess(true);
      setFormData({ nombre: '', email: '', telefono: '', cuotaInicial: 0 });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar socio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form aria-label="FormRegistroSocioYCuota" onSubmit={handleSubmit} aria-label="Formulario de registro de socio" className="form-registro">
      <h2>Registrar Nuevo Socio</h2>

      {error && <div role="alert" className="error-message">{error}</div>}
      {success && <div role="status" className="success-message">Socio registrado exitosamente</div>}

      <div className="form-group">
        <label htmlFor="nombre">Nombre *</label>
        <input aria-label="campo de entrada"
          id="nombre"
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input aria-label="campo de entrada"
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
        />
      </div>

      <div className="form-group">
        <label htmlFor="telefono">Teléfono</label>
        <input aria-label="campo de entrada"
          id="telefono"
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="cuotaInicial">Cuota Inicial ($) *</label>
        <input aria-label="campo de entrada"
          id="cuotaInicial"
          type="number"
          name="cuotaInicial"
          value={formData.cuotaInicial}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          aria-required="true"
        />
      </div>

      <button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? 'Registrando...' : 'Registrar Socio'}
      </button>
    </form>
  );
}
