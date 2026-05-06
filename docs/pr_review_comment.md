## Revisión automática (Agente_Revisor_PR)

- **PR**: [#10](https://github.com/joedayz/lunes-de-pichanga/pull/10) (feature/668aa7d5-c002-447c-ba5d-bc3e37ae8b66 → main)
- **Decisión**: **CAMBIOS_SOLICITADOS**
- **Diff Git analizado**: sí

### Cobertura de tests
- Global: **100%** (umbral 80%) ✓
- Código nuevo: **100%** ✓
- Origen de datos: artefacto **REPORTE_TESTS** (misma información que `docs/test_report.json`).

### Hallazgos de calidad

- **[ERROR]** `db/migrations/20260506144826_participacionpichanga.sql:5` — Definición duplicada de columnas: 'pichanga_id' y 'socio_id' aparecen dos veces (líneas 6-7 y 12-13). Las líneas 12-13 deben eliminarse ya que son duplicados con referencias FOREIGN KEY. _(criterio: Integridad de esquema SQL - No duplicar columnas)_
- **[ERROR]** `db/migrations/20260506144826_participacionpichanga.sql:12` — Sintaxis SQL inválida: las restricciones FOREIGN KEY deben definirse como CONSTRAINT o al final de CREATE TABLE, no como columnas duplicadas. Usar: 'CONSTRAINT fk_pichanga FOREIGN KEY (pichanga_id) REFERENCES pichanga(id)' _(criterio: Sintaxis SQL estándar)_
- **[ADVERTENCIA]** `db/migrations/20260506144826_participacionpichanga.sql:9` — Columna 'equipo' es TEXT nullable pero no tiene valor por defecto. Considerar si debería ser NOT NULL o tener un DEFAULT. _(criterio: Diseño de esquema - Consistencia de nullable)_
- **[ADVERTENCIA]** `db/schema_snapshot.json:1` — El snapshot de esquema ha sido reemplazado completamente (Socio, Cuota, Pichanga, AsistenciaPichanga eliminados). Esto sugiere una migración destructiva. Verificar que esto es intencional y que no hay datos que preservar. _(criterio: Gestión de migraciones - Cambios destructivos)_
- **[ADVERTENCIA]** `docs/api_spec.json:1` — El spec de API ha sido modificado significativamente (endpoints /api/socios y /api/cuotas removidos). Verificar que la documentación está sincronizada con la implementación real. _(criterio: Consistencia de documentación)_
- **[SUGERENCIA]** `docs/accessibility_report.json:1` — El reporte de accesibilidad ha sido actualizado con nuevos componentes (BuildStatusDashboard, FixBuildForm). Asegurar que estos componentes cumplan con WCAG 2.1 AA. _(criterio: Accesibilidad - WCAG 2.1)_
- **[ADVERTENCIA]** `src/routes/api.ts:8` — Parámetro '_err' no utilizado en catch. Usar 'err' o remover el parámetro si no se necesita. _(criterio: ESLint - no-unused-vars)_
- **[ADVERTENCIA]** `src/routes/api.ts:16` — Parámetro '_err' no utilizado en catch. Usar 'err' o remover el parámetro si no se necesita. _(criterio: ESLint - no-unused-vars)_
- **[SUGERENCIA]** `src/routes/api.ts:24` — Nombre de variable 'postApi_components_una_aplicacin_web_fixSchema' es muy largo y difícil de leer. Considerar: 'fixComponentSchema' o similar. _(criterio: Nomenclatura - Legibilidad)_
- **[SUGERENCIA]** `src/routes/api.ts:28` — Ruta '/api/components/una-aplicacin-web/fix' contiene caracteres especiales (ó). Considerar usar 'una-aplicacion-web' (sin tilde) para mejor compatibilidad URL. _(criterio: Convenciones REST API)_
- **[SUGERENCIA]** `src/routes/api.ts:40` — Nombre de variable 'postApi_components_extractSchema' sigue patrón inconsistente. Usar camelCase consistente: 'extractComponentSchema'. _(criterio: Nomenclatura - Consistencia)_
- **[ADVERTENCIA]** `src/routes/api.ts:60` — Parámetro '_err' no utilizado en catch. Usar 'err' o remover el parámetro si no se necesita. _(criterio: ESLint - no-unused-vars)_
- **[ADVERTENCIA]** `src/routes/api.ts:68` — Parámetro '_err' no utilizado en catch. Usar 'err' o remover el parámetro si no se necesita. _(criterio: ESLint - no-unused-vars)_
- **[SUGERENCIA]** `src/routes/api.ts:1` — Múltiples endpoints con lógica TODO sin implementar. Considerar agregar comentarios de prioridad o tickets asociados. _(criterio: Documentación - TODOs)_
- **[SUGERENCIA]** `src/App.tsx:1` — Imports con extensión '.js' explícita en archivos TypeScript/TSX. Verificar configuración de moduleResolution en tsconfig.json; generalmente no es necesario especificar extensión. _(criterio: Convenciones TypeScript)_

### Recomendaciones

- Revisar 7 advertencia(s) de calidad encontrada(s)
- Considerar 6 sugerencia(s) de mejora

### Criterios incumplidos
- Error de calidad en `db/migrations/20260506144826_participacionpichanga.sql:5`: Definición duplicada de columnas: 'pichanga_id' y 'socio_id' aparecen dos veces (líneas 6-7 y 12-13). Las líneas 12-13 deben eliminarse ya que son duplicados con referencias FOREIGN KEY. (Integridad de esquema SQL - No duplicar columnas)
- Error de calidad en `db/migrations/20260506144826_participacionpichanga.sql:12`: Sintaxis SQL inválida: las restricciones FOREIGN KEY deben definirse como CONSTRAINT o al final de CREATE TABLE, no como columnas duplicadas. Usar: 'CONSTRAINT fk_pichanga FOREIGN KEY (pichanga_id) REFERENCES pichanga(id)' (Sintaxis SQL estándar)
