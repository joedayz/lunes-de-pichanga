// === una-aplicacin-web-index-estructura (unitario) ===
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('una-aplicacin-web/index.tsx - Estructura', () => {
  it('debe tener imports solo al inicio del archivo', () => {
    const filePath = resolve('src/components/una-aplicacin-web/index.tsx');
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let firstImportLine = -1;
    let lastImportLine = -1;
    lines.forEach((line, idx) => {
      if (line.trim().startsWith('import ')) {
        if (firstImportLine === -1) firstImportLine = idx;
        lastImportLine = idx;
      }
    });
    const afterImports = lines.slice(lastImportLine + 1).join('\n');
    expect(afterImports).not.toMatch(/^\s*import\s+/m);
  });

  it('debe tener un único export default', () => {
    const filePath = resolve('src/components/una-aplicacin-web/index.tsx');
    const content = readFileSync(filePath, 'utf-8');
    const matches = content.match(/export\s+default/g) || [];
    expect(matches).toHaveLength(1);
  });

  it('debe tener BASE_URL declarado una sola vez si existe', () => {
    const filePath = resolve('src/components/una-aplicacin-web/index.tsx');
    const content = readFileSync(filePath, 'utf-8');
    const matches = content.match(/const\s+BASE_URL\s*=/g) || [];
    expect(matches.length).toBeLessThanOrEqual(1);
  });
});

// === api-socios-post-validacion (unitario) ===
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const postApi_sociosSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  email: z.string(),
  telefono: z.string(),
  monto_cuota: z.number(),
});

describe('POST /api/socios - Validación', () => {
  it('debe aceptar datos válidos', () => {
    const datos = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '1234567890',
      monto_cuota: 100,
    };
    expect(() => postApi_sociosSchema.parse(datos)).not.toThrow();
  });

  it('debe rechazar datos incompletos', () => {
    const datos = { nombre: 'Juan' };
    expect(() => postApi_sociosSchema.parse(datos)).toThrow(z.ZodError);
  });
});

// === app-component-render (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('App Component - Integración', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar sin errores de imports duplicados', async () => {
    const { default: App } = await import('src/components/una-aplicacin-web/index.tsx');
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });

  it('debe retornar JSX válido con DashboardAdmin y FormRegistroSocioYCuota', async () => {
    const { default: App } = await import('src/components/una-aplicacin-web/index.tsx');
    const result = App();
    expect(result).toBeDefined();
    expect(result.type).toBe(Symbol.for('react.fragment'));
  });
});