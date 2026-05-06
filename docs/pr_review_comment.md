## Revisión automática (Agente_Revisor_PR)

- **PR**: [#22](https://github.com/joedayz/lunes-de-pichanga/pull/22) (feature/eac3c48e-150b-4b82-b7f5-2c82c048fc5e → main)
- **Decisión**: **CAMBIOS_SOLICITADOS**
- **Diff Git analizado**: sí

### Cobertura de tests
- Global: **100%** (umbral 80%) ✓
- Código nuevo: **100%** ✓
- Origen de datos: artefacto **REPORTE_TESTS** (misma información que `docs/test_report.json`).

### Hallazgos de calidad

- **[ADVERTENCIA]** `db/migrations/20260506190109_grupo.sql:7` — Usar REAL para moneda (recaudacion_total) puede causar problemas de precisión. Considera usar DECIMAL o NUMERIC para valores monetarios. _(criterio: Buenas prácticas de bases de datos - tipos de datos para dinero)_
- **[SUGERENCIA]** `db/schema_snapshot.json:1` — El snapshot de esquema fue reemplazado completamente. Considera documentar el cambio de entidades (Socio, Invitado, Pago → Grupo) en un archivo CHANGELOG o comentario de migración. _(criterio: Documentación y trazabilidad de cambios)_
- **[ERROR]** `docs/api_spec.json:4` — El título de la API contiene una descripción de requisito muy larga y poco clara. Debe ser conciso: 'API: Gestión de Grupos y Pagos' o similar. _(criterio: OpenAPI 3.0.0 - claridad y profesionalismo en especificación)_
- **[ERROR]** `docs/api_spec.json:12` — El tag contiene la misma descripción larga del requisito. Los tags deben ser cortos y categóricos (ej: 'Recaudación', 'Pagos'). _(criterio: OpenAPI 3.0.0 - estructura de tags)_
- **[ERROR]** `docs/api_spec.json:85` — Descripción del parámetro 'grupoId' está incompleta (corte en la línea). Verifica que el JSON sea válido. _(criterio: Validez de JSON y completitud de especificación)_
- **[ADVERTENCIA]** `src/routes/grupos.ts:6` — Ruta GET sin parámetros de query (año, paginación). Según la especificación API, debería soportar filtrado por año y paginación. _(criterio: Consistencia con especificación OpenAPI)_
- **[SUGERENCIA]** `src/routes/grupos.ts:6` — Falta validación de parámetro 'grupoId' (UUID). Considera agregar validación con Zod. _(criterio: Validación de entrada - parámetros de ruta)_
- **[ADVERTENCIA]** `src/routes/grupos.ts:20` — Schema de validación 'postApi_grupos_grupoId_pagosSchema' incluye 'socio_id', pero la nueva tabla 'grupo' no tiene relación con 'socio'. Verifica si esta estructura es correcta tras el cambio de esquema. _(criterio: Coherencia con cambios de base de datos)_
- **[SUGERENCIA]** `src/routes/grupos.ts:28` — Falta validación de parámetro 'grupoId' en la ruta POST. Considera extraer y validar antes de parsear body. _(criterio: Validación completa de entrada)_
- **[ADVERTENCIA]** `src/routes/grupos.ts:35` — Respuesta 201 devuelve 'datos' sin estructura clara. Según OpenAPI, debería retornar el pago creado con su ID y el total de recaudación actualizado. _(criterio: Consistencia con especificación OpenAPI)_
- **[SUGERENCIA]** `src/routes/grupos.ts:44` — Falta manejo de error 404 (grupo no encontrado). La especificación API incluye respuesta 404. _(criterio: Completitud de manejo de errores según especificación)_
- **[ADVERTENCIA]** `src/routes/grupos.ts:50` — Ruta GET sin parámetros de query (año, paginación, búsqueda). Según especificación, debería soportar estos filtros. _(criterio: Consistencia con especificación OpenAPI)_
- **[SUGERENCIA]** `src/routes/grupos.ts:50` — Falta validación de parámetro 'grupoId' en ruta GET /pagos. _(criterio: Validación de entrada - parámetros de ruta)_
- **[SUGERENCIA]** `src/routes/grupos.ts:58` — Falta validación de parámetro 'grupoId' en ruta GET /resumen-anual. _(criterio: Validación de entrada - parámetros de ruta)_
- **[SUGERENCIA]** `src/routes/grupos.ts:67` — Schema PUT permite todos los campos opcionales. Considera si al menos uno debe ser requerido para una actualización válida. _(criterio: Validación de lógica de negocio)_
- **[SUGERENCIA]** `src/routes/grupos.ts:69` — Falta validación de parámetros 'grupoId' y 'pagoId' en ruta PUT. _(criterio: Validación de entrada - parámetros de ruta)_
- **[SUGERENCIA]** `src/routes/grupos.ts:82` — Falta validación de parámetros 'grupoId' y 'pagoId' en ruta DELETE. _(criterio: Validación de entrada - parámetros de ruta)_
- **[ADVERTENCIA]** `src/App.tsx:1` — Se importa 'PichangaDashboard' pero se renderiza sin usar. Verifica si es intencional o debe removerse. _(criterio: Código muerto - imports no utilizados)_
- **[SUGERENCIA]** `src/App.tsx:5` — Componentes sin keys en fragmento. Si se renderizan múltiples componentes en un array, considera usar un contenedor con estructura clara. _(criterio: React best practices)_

### Recomendaciones

- Revisar 6 advertencia(s) de calidad encontrada(s)
- Considerar 10 sugerencia(s) de mejora

### Criterios incumplidos
- Error de calidad en `docs/api_spec.json:4`: El título de la API contiene una descripción de requisito muy larga y poco clara. Debe ser conciso: 'API: Gestión de Grupos y Pagos' o similar. (OpenAPI 3.0.0 - claridad y profesionalismo en especificación)
- Error de calidad en `docs/api_spec.json:12`: El tag contiene la misma descripción larga del requisito. Los tags deben ser cortos y categóricos (ej: 'Recaudación', 'Pagos'). (OpenAPI 3.0.0 - estructura de tags)
- Error de calidad en `docs/api_spec.json:85`: Descripción del parámetro 'grupoId' está incompleta (corte en la línea). Verifica que el JSON sea válido. (Validez de JSON y completitud de especificación)
