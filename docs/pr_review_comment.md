## Revisión automática (Agente_Revisor_PR)

- **PR**: [#6](https://github.com/joedayz/lunes-de-pichanga/pull/6) (feature/cdf5f7ca-2ca7-476f-8a8d-2b6f5eb615ca → main)
- **Decisión**: **CAMBIOS_SOLICITADOS**
- **Diff Git analizado**: sí

### Cobertura de tests
- Global: **100%** (umbral 80%) ✓
- Código nuevo: **100%** ✓
- Origen de datos: artefacto **REPORTE_TESTS** (misma información que `docs/test_report.json`).

### Hallazgos de calidad

- **[ERROR]** `db/migrations/20250506135443_pichanga_asistenciapichanga.sql:16` — Columna 'pichanga_id' declarada dos veces en la tabla 'asistenciapichanga' (líneas 16 y 22). La segunda declaración incluye la restricción FOREIGN KEY, pero la primera es redundante. _(criterio: Integridad de esquema SQL)_
- **[ERROR]** `db/migrations/20250506135443_pichanga_asistenciapichanga.sql:17` — Columna 'socio_id' declarada dos veces en la tabla 'asistenciapichanga' (líneas 17 y 23). La segunda declaración incluye la restricción FOREIGN KEY, pero la primera es redundante. _(criterio: Integridad de esquema SQL)_
- **[ADVERTENCIA]** `db/migrations/20250506135443_pichanga_asistenciapichanga.sql:22` — Falta agregar ON DELETE CASCADE o ON DELETE RESTRICT en la restricción FOREIGN KEY de 'pichanga_id' para definir el comportamiento al eliminar una pichanga. _(criterio: Integridad referencial)_
- **[ADVERTENCIA]** `db/migrations/20250506135443_pichanga_asistenciapichanga.sql:23` — Falta agregar ON DELETE CASCADE o ON DELETE RESTRICT en la restricción FOREIGN KEY de 'socio_id' para definir el comportamiento al eliminar un socio. _(criterio: Integridad referencial)_
- **[ADVERTENCIA]** `db/schema_snapshot.json:1` — El archivo schema_snapshot.json ha sido modificado manualmente. Debería ser generado automáticamente por herramientas de migración para evitar inconsistencias. _(criterio: Mantenibilidad de esquema)_
- **[ADVERTENCIA]** `docs/api_spec.json:4` — El título de la API contiene texto confuso/técnico ('corregir un error interno de Vite/Babel...') que no describe el propósito real de la API. Debería ser descriptivo y profesional. _(criterio: Documentación de API)_
- **[ADVERTENCIA]** `docs/api_spec.json:10` — El resumen del endpoint GET /api/socios es demasiado genérico. Debería especificar funcionalidades como paginación y filtros si están soportados. _(criterio: Documentación de API)_
- **[ADVERTENCIA]** `docs/api_spec.json:12` — El tag del endpoint contiene texto confuso ('corregir un error interno de Vite/Babel...') que no categoriza correctamente el endpoint. Debería ser 'Socios' o similar. _(criterio: Documentación de API)_
- **[SUGERENCIA]** `código TypeScript (Express routes):5` — El parámetro de ruta '/api/pichangas/:pichanga-id/asistencia' usa guión (-) en lugar de guion bajo (_). Considera usar ':pichanga_id' para consistencia con convenciones REST y variables de JavaScript. _(criterio: Convenciones de nomenclatura)_
- **[ADVERTENCIA]** `código TypeScript (Express routes):47` — Los nombres de esquemas Zod son muy largos y poco mantenibles (ej: 'postApi_pichangas_pichanga_id_asistenciaSchema'). Considera usar nombres más cortos o agrupar esquemas en un objeto. _(criterio: Mantenibilidad de código)_
- **[SUGERENCIA]** `código TypeScript (Express routes):1` — Falta validación de parámetros de ruta (ej: ':pichanga_id'). Considera agregar validación con Zod para los params además del body. _(criterio: Validación de entrada)_
- **[ADVERTENCIA]** `código TypeScript (DashboardAdmin):30` — La respuesta de la API no está tipada. Los datos retornados por '/api/socios' y '/api/pichangas' deberían validarse contra interfaces esperadas para evitar errores en tiempo de ejecución. _(criterio: Type safety)_
- **[SUGERENCIA]** `código TypeScript (DashboardAdmin):32` — Falta manejo de respuestas no-JSON. Si la API retorna un error HTML o texto, 'json()' fallará. Considera validar el Content-Type. _(criterio: Robustez)_
- **[ADVERTENCIA]** `código TypeScript (DashboardAdmin):38` — Los datos de 'sociosData' y 'pichangasData' se asignan directamente sin validación. Debería usarse Zod o similar para validar la estructura antes de actualizar el estado. _(criterio: Type safety)_

### Recomendaciones

- Revisar 9 advertencia(s) de calidad encontrada(s)
- Considerar 3 sugerencia(s) de mejora

### Criterios incumplidos
- Error de calidad en `db/migrations/20250506135443_pichanga_asistenciapichanga.sql:16`: Columna 'pichanga_id' declarada dos veces en la tabla 'asistenciapichanga' (líneas 16 y 22). La segunda declaración incluye la restricción FOREIGN KEY, pero la primera es redundante. (Integridad de esquema SQL)
- Error de calidad en `db/migrations/20250506135443_pichanga_asistenciapichanga.sql:17`: Columna 'socio_id' declarada dos veces en la tabla 'asistenciapichanga' (líneas 17 y 23). La segunda declaración incluye la restricción FOREIGN KEY, pero la primera es redundante. (Integridad de esquema SQL)
