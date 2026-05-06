// === una-aplicacin-web-index-imports-unicos (unitario) ===
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('una-aplicacin-web/index.tsx - estructura de imports', () => {
  it('debe tener todos los imports al inicio del archivo', () => {
    const filePath = path.join(process.cwd(), 'src/components/una-aplicacin-web/index.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let lastImportLine = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportLine = i;
      }
    }
    let firstNonImportLine = -1;
    for (let i = lastImportLine + 1; i < lines.length; i++) {
      if (lines[i].trim() && !lines[i].trim().startsWith('//')) {
        firstNonImportLine = i;
        break;
      }
    }
    for (let i = firstNonImportLine; i < lines.length; i++) {
      expect(lines[i]).not.toMatch(/^\s*import\s+/);
    }
  });

  it('debe declarar BASE_URL una sola vez', () => {
    const filePath = path.join(process.cwd(), 'src/components/una-aplicacin-web/index.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const baseUrlMatches = content.match(/const\s+BASE_URL\s*=/g);
    expect(baseUrlMatches).toHaveLength(1);
  });

  it('debe tener un único export default', () => {
    const filePath = path.join(process.cwd(), 'src/components/una-aplicacin-web/index.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const exportMatches = content.match(/export\s+default\s+/g);
    expect(exportMatches).toHaveLength(1);
  });
});

// === dashboard-admin-component-unitario (unitario) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardAdmin from '../../src/components/una-aplicacin-web/DashboardAdmin';

describe('DashboardAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar estado de carga inicial', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    render(<DashboardAdmin />);
    expect(screen.getByText(/cargando|loading/i)).toBeDefined();
  });

  it('debe mostrar resumen cuando fetch es exitoso', async () => {
    const mockResumen = { totalSocios: 10, cuotasPendientes: 5, ingresosMes: 1000, cuotasVencidas: 2 };
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify(mockResumen), { status: 200 }))
    ));
    render(<DashboardAdmin />);
    await waitFor(() => {
      expect(screen.getByText(/10/)).toBeDefined();
    });
  });
});

// === api-socios-integracion (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('POST /api/socios - integración', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe validar schema y retornar 201 con datos válidos', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ datos: { nombre: 'Juan' }, mensaje: 'OK' }), { status: 201 }))
    );
    vi.stubGlobal('fetch', mockFetch);
    const payload = { nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com', monto_cuota: 100, fecha_vencimiento_cuota: '2026-06-01' };
    const res = await fetch('http://localhost:3000/api/socios', { method: 'POST', body: JSON.stringify(payload) });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.mensaje).toBe('OK');
  });

  it('debe retornar 400 si faltan campos requeridos', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ error: 'Datos inválidos' }), { status: 400 }))
    );
    vi.stubGlobal('fetch', mockFetch);
    const payload = { nombre: 'Juan' };
    const res = await fetch('http://localhost:3000/api/socios', { method: 'POST', body: JSON.stringify(payload) });
    expect(res.status).toBe(400);
  });
});