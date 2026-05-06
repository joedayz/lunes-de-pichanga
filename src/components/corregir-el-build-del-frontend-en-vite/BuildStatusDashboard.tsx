import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface BuildStatus {
  status: string;
  errors?: string[];
  timestamp?: string;
}

interface ValidationResult {
  valid: boolean;
  issues?: string[];
}

interface FileStructure {
  imports: string[];
  constants: string[];
  exports: string[];
  components: string[];
}

interface HealthStatus {
  healthy: boolean;
  message: string;
}

export default function BuildStatusDashboard() {
  const [buildStatus, setBuildStatus] = useState<BuildStatus | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [structure, setStructure] = useState<FileStructure | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [buildRes, validRes, structRes, healthRes] = await Promise.all([
          fetch(`${BASE_URL}/api/build-status`),
          fetch(`${BASE_URL}/api/components/una-aplicacin-web/validate`),
          fetch(`${BASE_URL}/api/components/una-aplicacin-web/structure`),
          fetch(`${BASE_URL}/api/dev-server/health`),
        ]);

        if (!buildRes.ok || !validRes.ok || !structRes.ok || !healthRes.ok) {
          throw new Error('Una o más solicitudes fallaron');
        }

        const buildData = await buildRes.json();
        const validData = await validRes.json();
        const structData = await structRes.json();
        const healthData = await healthRes.json();

        setBuildStatus(buildData);
        setValidation(validData);
        setStructure(structData);
        setHealth(healthData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="p-4">
        <p>Cargando estado del build...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="p-4 bg-red-100 border border-red-400 rounded">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Estado del Build - Vite Frontend</h1>

      <section className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-3">Estado del Servidor</h2>
        {health && (
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                health.healthy ? 'bg-green-500' : 'bg-red-500'
              }`}
              aria-label={health.healthy ? 'Servidor activo' : 'Servidor inactivo'}
            />
            <p className="text-sm">{health.message}</p>
          </div>
        )}
      </section>

      <section className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-3">Validación de index.tsx</h2>
        {validation && (
          <div>
            <p
              className={`font-semibold ${
                validation.valid ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {validation.valid ? '✓ Válido' : '✗ Inválido'}
            </p>
            {validation.issues && validation.issues.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-red-600">
                {validation.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-3">Estructura del Archivo</h2>
        {structure && (
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">Imports ({structure.imports.length}):</p>
              <ul className="list-disc list-inside text-gray-700">
                {structure.imports.slice(0, 5).map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
                {structure.imports.length > 5 && (
                  <li>... y {structure.imports.length - 5} más</li>
                )}
              </ul>
            </div>
            <div>
              <p className="font-semibold">Constantes ({structure.constants.length}):</p>
              <ul className="list-disc list-inside text-gray-700">
                {structure.constants.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">Componentes ({structure.components.length}):</p>
              <ul className="list-disc list-inside text-gray-700">
                {structure.components.map((comp, idx) => (
                  <li key={idx}>{comp}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      <section className="p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-3">Estado del Build</h2>
        {buildStatus && (
          <div>
            <p className="font-semibold mb-2">Status: {buildStatus.status}</p>
            {buildStatus.errors && buildStatus.errors.length > 0 && (
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <p className="font-semibold text-red-700 mb-2">Errores:</p>
                <ul className="list-disc list-inside text-sm text-red-600">
                  {buildStatus.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
