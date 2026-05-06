/** Evita pantalla en blanco si la API devuelve `{}`, `{ mensaje }` o `{ data: [...] }`. */
export function jsonArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === 'object') {
    const data = (raw as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  return [];
}
