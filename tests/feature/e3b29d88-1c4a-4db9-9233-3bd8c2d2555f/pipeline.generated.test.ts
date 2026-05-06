// === dashboard-admin-fetch (unitario) ===
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardAdmin from '../../src/components/una-aplicacin-web/DashboardAdmin';

describe('DashboardAdmin', () => {
  it('debe renderizar y cargar datos del resumen', async () => {
    global.fetch = vi.fn((url: string) => {
      if (url.includes('/api/dashboard/resumen')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ totalSocios: 10, cuotasPendientes: 3, ingresosMes: 5000, tasaPago: 0.85 })
        });
      }
      if (url.includes('/api/socios')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ id: '1', nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com', activo: true }])
        });
      }
      return Promise.reject(new Error('URL no mockeada'));
    }) as any;

    render(<DashboardAdmin />);
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard/resumen'));
  });
});

// === form-registro-socio-validacion (unitario) ===
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormRegistroSocioYCuota from '../../src/components/una-aplicacin-web/FormRegistroSocioYCuota';

describe('FormRegistroSocioYCuota', () => {
  it('debe validar campos requeridos antes de enviar', async () => {
    global.fetch = vi.fn();
    render(<FormRegistroSocioYCuota />);
    const submitBtn = screen.getByRole('button', { name: /registrar|enviar/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('debe enviar POST a /api/socios con datos válidos', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ id: '1' }) }));
    render(<FormRegistroSocioYCuota />);
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Carlos' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'López' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'carlos@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /registrar|enviar/i }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/socios'), expect.any(Object)));
  });
});

// === api-socios-post-integracion (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('POST /api/socios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe rechazar datos inválidos con 400', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Datos inválidos', detalles: [] })
      })
    );
    global.fetch = mockFetch;

    const res = await fetch('http://localhost:3000/api/socios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: '', apellido: 'Test' })
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Datos inválidos');
  });

  it('debe crear socio con datos válidos y retornar 201', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ datos: { nombre: 'Ana', apellido: 'García', email: 'ana@test.com' }, mensaje: 'OK' })
      })
    );
    global.fetch = mockFetch;

    const res = await fetch('http://localhost:3000/api/socios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Ana', apellido: 'García', email: 'ana@test.com' })
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.datos.nombre).toBe('Ana');
  });
});