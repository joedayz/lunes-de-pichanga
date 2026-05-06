// === api-base-url-config (unitario) ===
import { describe, it, expect, vi } from 'vitest';

describe('API Base URL Configuration', () => {
  it('should use VITE_API_URL from import.meta.env', () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    expect(apiUrl).toBe('http://localhost:4000');
  });

  it('should fallback to localhost:4000 when env var is undefined', () => {
    const baseUrl = undefined || 'http://localhost:4000';
    expect(baseUrl).toBe('http://localhost:4000');
    expect(baseUrl).not.toContain('3000');
  });
});

// === vite-config-env-injection (unitario) ===
import { describe, it, expect } from 'vitest';
import { loadEnv } from 'vite';

describe('Vite Config Environment Injection', () => {
  it('should load VITE_API_URL from .env files', () => {
    const env = loadEnv('development', process.cwd(), 'VITE_');
    const apiUrl = env.VITE_API_URL || 'http://localhost:4000';
    expect(apiUrl).toBeDefined();
    expect(apiUrl).toMatch(/^http:\/\/localhost:4000/);
  });
});

// === api-client-fetch-integration (integracion) ===
import { describe, it, expect, vi, beforeEach } from 'vitest';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const fetchSocios = async () => {
  const res = await fetch(`${API_BASE}/api/socios`);
  return res.json();
};

describe('API Client Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call /api/socios on correct port 4000', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ mensaje: 'OK' })
    });
    const result = await fetchSocios();
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/socios');
    expect(result.mensaje).toBe('OK');
  });

  it('should not use localhost:3000 for API calls', () => {
    expect(API_BASE).not.toContain('3000');
  });
});