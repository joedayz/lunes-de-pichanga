import React, { useState } from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface FixResponse {
  success: boolean;
  message: string;
  details?: string;
}

interface ExtractRequest {
  componentName: string;
  targetFile: string;
}

export default function FixBuildForm() {
  const [fixing, setFixing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<FixResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [componentName, setComponentName] = useState('');
  const [targetFile, setTargetFile] = useState('');

  const handleFixBuild = async () => {
    try {
      setFixing(true);
      setError(null);
      setResult(null);

      const response = await fetch(
        `${BASE_URL}/api/components/una-aplicacin-web/fix`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setFixing(false);
    }
  };

  const handleExtractComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentName.trim() || !targetFile.trim()) {
      setError('Completa todos los campos');
      return;
    }

    try {
      setExtracting(true);
      setError(null);
      setResult(null);

      const payload: ExtractRequest = {
        componentName: componentName.trim(),
        targetFile: targetFile.trim(),
      };

      const response = await fetch(`${BASE_URL}/api/components/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      setComponentName('');
      setTargetFile('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Corregir Build de Vite</h1>

      {error && (
        <div
          role="alert"
          className="mb-4 p-4 bg-red-100 border border-red-400 rounded text-red-700"
        >
          {error}
        </div>
      )}

      {result && (
        <div
          role="status"
          className={`mb-4 p-4 rounded border ${
            result.success
              ? 'bg-green-100 border-green-400 text-green-700'
              : 'bg-yellow-100 border-yellow-400 text-yellow-700'
          }`}
        >
          <p className="font-semibold">{result.message}</p>
          {result.details && <p className="text-sm mt-2">{result.details}</p>}
        </div>
      )}

      <section className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Aplicar Correcciones Automáticas</h2>
        <p className="text-sm text-gray-600 mb-4">
          Reorganiza imports, consolida BASE_URL y asegura único export default en
          index.tsx.
        </p>
        <button
          onClick={handleFixBuild}
          disabled={fixing}
          aria-label="Aplicar correcciones al archivo index.tsx"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {fixing ? 'Corrigiendo...' : 'Corregir Build'}
        </button>
      </section>

      <section className="p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Extraer Componente</h2>
        <form aria-label="FixBuildForm" onSubmit={handleExtractComponent} className="space-y-4">
          <div>
            <label htmlFor="componentName" className="block text-sm font-medium mb-1">
              Nombre del Componente
            </label>
            <input aria-label="campo de entrada"
              id="componentName"
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="ej: DashboardAdmin"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={extracting}
            />
          </div>
          <div>
            <label htmlFor="targetFile" className="block text-sm font-medium mb-1">
              Archivo Destino
            </label>
            <input aria-label="campo de entrada"
              id="targetFile"
              type="text"
              value={targetFile}
              onChange={(e) => setTargetFile(e.target.value)}
              placeholder="ej: DashboardAdmin.tsx"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={extracting}
            />
          </div>
          <button
            type="submit"
            disabled={extracting}
            aria-label="Extraer componente a archivo separado"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {extracting ? 'Extrayendo...' : 'Extraer Componente'}
          </button>
        </form>
      </section>
    </div>
  );
}
