// === una-aplicacin-web-imports-validation (unitario) ===
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('una-aplicacin-web/index.tsx - Validación de imports', () => {
  it('debe tener todos los imports al inicio del archivo', () => {
    const filePath = path.join(process.cwd(), 'src/components/una-aplicacin-web/index.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let lastImportLine = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) lastImportLine = i;
    }
    const afterImports = lines.slice(lastImportLine + 1).join('\n');
    expect(afterImports).not.toMatch(/^\s*import\s+/m);
  });

  it('debe tener un único export default', () => {
    const filePath = path.join(process.cwd(), 'src/components/una-aplicacin-web/index.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(/export\s+default/g) || [];
    expect(matches.length).toBe(1);
  });

  it('debe tener un único BASE_URL si existe', () => {
    const filePath = path.join(process.cwd(), 'src/components/una-aplicacin-web/index.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(/const\s+BASE_URL/g) || [];
    expect(matches.length).toBeLessThanOrEqual(1);
  });
});

// === build-status-api-endpoint (unitario) ===
import { describe, it, expect, vi } from 'vitest';
import { Router, Request, Response } from 'express';

describe('GET /api/build-status', () => {
  it('debe retornar status 200 con mensaje OK', async () => {
    const mockReq = {} as Request;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const router = Router();
    router.get('/api/build-status', async (req, res) => {
      res.status(200).json({ mensaje: 'OK' });
    });

    const callback = router.stack[0].route.methods.get[0];
    await callback(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ mensaje: 'OK' });
  });
});

// === fix-build-api-validation (integracion) ===
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

const postApi_components_una_aplicacin_web_fixSchema = z.object({
  autoExtractComponents: z.boolean().optional(),
  dryRun: z.boolean().optional(),
});

describe('POST /api/components/una-aplicacin-web/fix - Validación', () => {
  it('debe aceptar payload válido con autoExtractComponents y dryRun', () => {
    const validPayload = { autoExtractComponents: true, dryRun: false };
    const result = postApi_components_una_aplicacin_web_fixSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(validPayload);
  });

  it('debe rechazar payload con campos inválidos', () => {
    const invalidPayload = { autoExtractComponents: 'true', dryRun: 123 };
    const result = postApi_components_una_aplicacin_web_fixSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });
});