// === una-aplicacin-web-index-imports (unitario) ===
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
    const afterImports = lines.slice(lastImportLine + 1).join('\n');
    expect(afterImports).not.toMatch(/^\s*import\s+/m);
  });

  it('debe declarar BASE_URL una sola vez', () => {
    const filePath = path.join(process.cwd(), 'src/components/una-aplicacin-web/index.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(/const\s+BASE_URL\s*=/g);
    expect(matches).toHaveLength(1);
  });

  it('debe tener un único export default', () => {
    const filePath = path.join(process.cwd(), 'src/components/una-aplicacin-web/index.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(/export\s+default\s+/g);
    expect(matches).toHaveLength(1);
  });
});

// === dashboard-admin-component (unitario) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardAdmin from '../../src/components/una-aplicacin-web/DashboardAdmin';

describe('DashboardAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el componente sin errores', () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ totalSocios: 10, cuotasPendientes: 5, ingresosTotales: 1000, cuotasVencidas: 2 })
      })
    ) as any;
    render(<DashboardAdmin />);
    expect(screen.getByText(/dashboard/i)).toBeDefined();
  });
});

// === api-socios-integration (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('POST /api/socios - integración', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe registrar un socio con datos válidos', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ datos: { nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com', monto_cuota: 100, fecha_vencimiento_cuota: '2026-06-01' }, mensaje: 'OK' })
      })
    );
    global.fetch = mockFetch as any;
    const response = await fetch('http://localhost:3000/api/socios', {
      method: 'POST',
      body: JSON.stringify({ nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com', monto_cuota: 100, fecha_vencimiento_cuota: '2026-06-01' })
    });
    expect(response.status).toBe(201);
    expect(mockFetch).toHaveBeenCalledOnce();
  });
});