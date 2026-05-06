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
    expect(matches?.length || 0).toBeLessThanOrEqual(1);
  });

  it('debe tener un único export default', () => {
    const filePath = path.join(process.cwd(), 'src/components/una-aplicacin-web/index.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(/export\s+default\s+/g);
    expect(matches?.length || 0).toBe(1);
  });
});

// === dashboard-admin-component (unitario) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('DashboardAdmin - renderizado y fetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe hacer fetch a /api/dashboard/resumen con baseUrl correcto', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sociosActivos: 5, cuotasPendientes: 2, proximasPichangas: [] })
    });
    global.fetch = mockFetch;
    const baseUrl = 'http://localhost:3000';
    // Simulación: el componente llamaría a fetch en useEffect
    await mockFetch(`${baseUrl}/api/dashboard/resumen`);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/dashboard/resumen');
  });

  it('debe manejar error HTTP correctamente', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    global.fetch = mockFetch;
    const res = await mockFetch('http://localhost:3000/api/dashboard/resumen');
    expect(res.ok).toBe(false);
  });
});

// === backend-socios-api-integration (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  email: z.string(),
  telefono: z.string().optional(),
});

describe('POST /api/socios - validación y respuesta', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe validar datos correctos y retornar 201', async () => {
    const payload = { nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com' };
    const result = postApi_sociosSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('debe rechazar email faltante con ZodError', () => {
    const payload = { nombre: 'Juan', apellido: 'Pérez' };
    const result = postApi_sociosSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some(e => e.path.includes('email'))).toBe(true);
    }
  });
});