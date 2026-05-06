## Revisión automática (Agente_Revisor_PR)

- **PR**: [#11](https://github.com/joedayz/lunes-de-pichanga/pull/11) (feature/b5ee27d0-611f-439d-b4db-fd6ca57a4806 → main)
- **Decisión**: **CAMBIOS_SOLICITADOS**
- **Diff Git analizado**: sí

### Cobertura de tests
- Global: **100%** (umbral 80%) ✓
- Código nuevo: **100%** ✓
- Origen de datos: artefacto **REPORTE_TESTS** (misma información que `docs/test_report.json`).

### Hallazgos de calidad

- **[ERROR]** `db/migrations/20260506144826_participacionpichanga.sql:5` — Columnas duplicadas en la definición de la tabla: 'pichanga_id' y 'socio_id' se declaran dos veces (líneas 6-7 y 12-13). Las referencias FOREIGN KEY deben estar en la definición de columna o como constraint separado, no ambas. _(criterio: Sintaxis SQL válida)_
- **[ERROR]** `db/migrations/20260506144826_participacionpichanga.sql:12` — Constraint FOREIGN KEY incorrecto: falta la palabra clave 'CONSTRAINT' o debe ser una definición de constraint separada. Sintaxis: 'CONSTRAINT fk_name FOREIGN KEY (column) REFERENCES table(id)' _(criterio: Sintaxis SQL válida)_
- **[ADVERTENCIA]** `db/schema_snapshot.json:126` — Inconsistencia en schema_snapshot.json: la entidad 'Usuario' fue insertada pero no existe migración correspondiente en el diff. Solo se ve 'participacionpichanga' y 'noop_conflicto'. Esto puede causar desincronización entre migraciones y snapshot. _(criterio: Consistencia entre migraciones y snapshots)_
- **[ADVERTENCIA]** `db/schema_snapshot.json:158` — Cambio significativo en schema: la entidad 'AsistenciaPichanga' fue renombrada a 'ParticipacionPichanga' pero el snapshot muestra 'Pichanga' en su lugar. Las relaciones fueron eliminadas sin documentación de por qué. _(criterio: Trazabilidad de cambios de esquema)_
- **[ADVERTENCIA]** `docs/api_spec.json:8` — Cambio de endpoint: '/api/socios' fue reemplazado por '/api/build-status'. Esto es un cambio de API que rompe compatibilidad hacia atrás. Debería estar documentado en notas de versión o deprecación. _(criterio: Versionado de API y compatibilidad hacia atrás)_
- **[ADVERTENCIA]** `docs/api_spec.json:25` — Endpoint POST '/api/socios' fue eliminado del spec sin documentación de migración. Los clientes que usen este endpoint fallarán sin previo aviso. _(criterio: Documentación de cambios de API)_
- **[ADVERTENCIA]** `docs/accessibility_report.json:4` — Componentes analizados cambiaron de 'DashboardAdmin' y 'FormRegistroSocioYCuota' a 'BuildStatusDashboard' y 'FixBuildForm'. Esto sugiere cambios significativos en la UI sin documentación de impacto en accesibilidad. _(criterio: Trazabilidad de cambios en componentes)_
- **[SUGERENCIA]** `código TypeScript (routers):6` — TODO comentario sin asignar: 'implementar lógica de negocio' en GET /api/socios. Considera usar un sistema de tracking (Jira, GitHub Issues) en lugar de comentarios TODO. _(criterio: Buenas prácticas de desarrollo)_
- **[SUGERENCIA]** `código TypeScript (routers):18` — Nombre de schema poco descriptivo: 'postApi_sociosSchema'. Considera usar convención más clara como 'CreateSocioSchema' o 'SocioCreatePayloadSchema'. _(criterio: Nomenclatura y legibilidad)_
- **[ADVERTENCIA]** `código TypeScript (routers):30` — Manejo de errores genérico: catch(err) sin tipado. Debería ser 'catch(err: unknown)' o 'catch(err: Error)' para cumplir con TypeScript strict. _(criterio: Tipado estricto de TypeScript)_
- **[SUGERENCIA]** `código TypeScript (routers):40` — Parámetro '_err' no utilizado en múltiples handlers. Si es intencional ignorar el error, usa 'catch (_err: unknown)' o mejor aún, loguea el error para debugging. _(criterio: Manejo de errores y debugging)_
- **[SUGERENCIA]** `código TypeScript (routers):70` — Nombre de schema poco descriptivo: 'patchApi_cuotas_id_pagarSchema'. Considera 'PayCuotaSchema' o 'CuotaPaymentPayloadSchema'. _(criterio: Nomenclatura y legibilidad)_
- **[ADVERTENCIA]** `código TypeScript (App component):1` — Imports con extensión '.js' en archivos TypeScript/JSX. Debería ser './DashboardAdmin' sin extensión para que TypeScript resuelva correctamente. _(criterio: Convenciones de imports en TypeScript)_
- **[SUGERENCIA]** `código TypeScript (App component):5` — Componente App sin props tipadas. Considera definir interface Props aunque sea vacía, o usar 'React.FC<{}>()' para claridad. _(criterio: Tipado explícito en componentes React)_

### Recomendaciones

- Revisar 7 advertencia(s) de calidad encontrada(s)
- Considerar 5 sugerencia(s) de mejora

### Criterios incumplidos
- Error de calidad en `db/migrations/20260506144826_participacionpichanga.sql:5`: Columnas duplicadas en la definición de la tabla: 'pichanga_id' y 'socio_id' se declaran dos veces (líneas 6-7 y 12-13). Las referencias FOREIGN KEY deben estar en la definición de columna o como constraint separado, no ambas. (Sintaxis SQL válida)
- Error de calidad en `db/migrations/20260506144826_participacionpichanga.sql:12`: Constraint FOREIGN KEY incorrecto: falta la palabra clave 'CONSTRAINT' o debe ser una definición de constraint separada. Sintaxis: 'CONSTRAINT fk_name FOREIGN KEY (column) REFERENCES table(id)' (Sintaxis SQL válida)
