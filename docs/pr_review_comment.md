## Revisión automática (Agente_Revisor_PR)

- **PR**: [#12](https://github.com/joedayz/lunes-de-pichanga/pull/12) (feature/c1d3c726-8fc3-446a-aac8-c6750a6d27fa → main)
- **Decisión**: **CAMBIOS_SOLICITADOS**
- **Diff Git analizado**: sí

### Cobertura de tests
- Global: **100%** (umbral 80%) ✓
- Código nuevo: **100%** ✓
- Origen de datos: artefacto **REPORTE_TESTS** (misma información que `docs/test_report.json`).

### Hallazgos de calidad

- **[ERROR]** `db/migrations/20260506144826_participacionpichanga.sql:5` — Definición duplicada de columnas: 'pichanga_id' y 'socio_id' aparecen dos veces (líneas 6-7 y 12-13). Las líneas 12-13 deben ser constraints FOREIGN KEY separados, no redefiniciones de columnas. _(criterio: Sintaxis SQL válida)_
- **[ERROR]** `db/migrations/20260506144826_participacionpichanga.sql:12` — Constraint FOREIGN KEY mal formado. Debería ser: 'CONSTRAINT fk_pichanga FOREIGN KEY (pichanga_id) REFERENCES pichanga(id)' en lugar de redefinir la columna. _(criterio: Sintaxis SQL válida)_
- **[ADVERTENCIA]** `db/migrations/20260506144826_participacionpichanga.sql:4` — Falta 'ON DELETE CASCADE' o política de eliminación en las foreign keys. Considerar agregar para mantener integridad referencial. _(criterio: Buenas prácticas de diseño de BD)_
- **[ADVERTENCIA]** `db/schema_snapshot.json:35` — Cambio de nombre de columna: 'fecha_registro' → 'fecha_ingreso' sin migración explícita. Esto puede causar inconsistencias si hay código que referencia el nombre anterior. _(criterio: Consistencia de esquema)_
- **[ADVERTENCIA]** `db/schema_snapshot.json:126` — Cambio significativo en schema: tabla 'Pichanga' reemplazada por 'Usuario' y tabla 'AsistenciaPichanga' eliminada. Esto sugiere un cambio de modelo de datos importante sin documentación clara. _(criterio: Trazabilidad de cambios)_
- **[ADVERTENCIA]** `docs/accessibility_report.json:4` — Componentes analizados cambiaron de 'DashboardAdmin' y 'FormRegistroSocioYCuota' a 'BuildStatusDashboard' y 'FixBuildForm'. Esto indica cambios de scope sin documentación de por qué. _(criterio: Consistencia de documentación)_
- **[ADVERTENCIA]** `docs/api_spec.json:8` — Cambio radical en API spec: endpoints de '/api/socios' y '/api/cuotas' reemplazados por '/api/build-status' y '/api/components/una-aplicacin-web/*'. Esto sugiere scope creep o cambio de requisitos no documentado. _(criterio: Consistencia de especificación)_
- **[SUGERENCIA]** `db/migrations/20260506145208_noop_conflicto_6c613554.sql:1` — Migración NO-OP detectada. Aunque válida, considerar si es necesaria o si puede consolidarse con otras migraciones para reducir ruido. _(criterio: Limpieza de migraciones)_
- **[SUGERENCIA]** `db/migrations/20260506145453_noop_conflicto_79263199.sql:1` — Migración NO-OP detectada. Aunque válida, considerar si es necesaria o si puede consolidarse con otras migraciones para reducir ruido. _(criterio: Limpieza de migraciones)_
- **[ADVERTENCIA]** `src/routes.ts:8` — TODO comentario sin resolver. Implementar lógica de negocio para GET /api/socios. _(criterio: Código incompleto)_
- **[ADVERTENCIA]** `src/routes.ts:32` — TODO comentario sin resolver. Implementar lógica de negocio para POST /api/socios. _(criterio: Código incompleto)_
- **[ADVERTENCIA]** `src/routes.ts:44` — TODO comentario sin resolver. Implementar lógica de negocio para GET /api/socios/:id/cuotas. _(criterio: Código incompleto)_
- **[ADVERTENCIA]** `src/routes.ts:57` — TODO comentario sin resolver. Implementar lógica de negocio para PATCH /api/cuotas/:id/pagar. _(criterio: Código incompleto)_
- **[ADVERTENCIA]** `src/routes.ts:71` — TODO comentario sin resolver. Implementar lógica de negocio para GET /api/dashboard/resumen. _(criterio: Código incompleto)_
- **[ADVERTENCIA]** `src/routes.ts:80` — TODO comentario sin resolver. Implementar lógica de negocio para GET /api/socios/:id. _(criterio: Código incompleto)_
- **[SUGERENCIA]** `src/routes.ts:6` — Considerar extraer schemas Zod a un archivo separado (ej: schemas.ts) para mejorar mantenibilidad y reutilización. _(criterio: Organización de código)_
- **[SUGERENCIA]** `src/routes.ts:1` — Considerar agregar middleware de validación centralizado para reducir duplicación de try-catch y manejo de errores. _(criterio: DRY principle)_
- **[ADVERTENCIA]** `src/App.tsx:1` — Imports con extensión .js en archivo TypeScript/TSX. Debería ser './DashboardAdmin' sin extensión para seguir convenciones de módulos ES. _(criterio: Convenciones de imports)_

### Recomendaciones

- Revisar 12 advertencia(s) de calidad encontrada(s)
- Considerar 4 sugerencia(s) de mejora

### Criterios incumplidos
- Error de calidad en `db/migrations/20260506144826_participacionpichanga.sql:5`: Definición duplicada de columnas: 'pichanga_id' y 'socio_id' aparecen dos veces (líneas 6-7 y 12-13). Las líneas 12-13 deben ser constraints FOREIGN KEY separados, no redefiniciones de columnas. (Sintaxis SQL válida)
- Error de calidad en `db/migrations/20260506144826_participacionpichanga.sql:12`: Constraint FOREIGN KEY mal formado. Debería ser: 'CONSTRAINT fk_pichanga FOREIGN KEY (pichanga_id) REFERENCES pichanga(id)' en lugar de redefinir la columna. (Sintaxis SQL válida)
