/** Evita `.map` sobre respuestas `{ mensaje }` o `{ data: [] }`. */
export function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const d = (data as { data?: unknown }).data;
    if (Array.isArray(d)) return d as T[];
  }
  return [];
}

export function dashboardShape(
  data: unknown,
): { total_socios: number; total_invitados: number; recaudacion: number } | null {
  if (!data || typeof data !== 'object') return null;
  const o = data as Record<string, unknown>;
  if (
    'total_socios' in o &&
    'total_invitados' in o &&
    'recaudacion' in o &&
    typeof o['total_socios'] === 'number' &&
    typeof o['total_invitados'] === 'number' &&
    typeof o['recaudacion'] === 'number'
  ) {
    return o as { total_socios: number; total_invitados: number; recaudacion: number };
  }
  if (
    'totalSocios' in o &&
    'totalInvitados' in o &&
    'totalRecaudado' in o &&
    typeof o['totalSocios'] === 'number' &&
    typeof o['totalInvitados'] === 'number'
  ) {
    return {
      total_socios: o['totalSocios'] as number,
      total_invitados: o['totalInvitados'] as number,
      recaudacion: Number(o['totalRecaudado'] ?? 0),
    };
  }
  return null;
}
