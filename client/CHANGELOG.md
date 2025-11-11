## [Unreleased] - 2025-10-31

### Mejoras visuales
- Se corrigió la visualización del módulo **Grupos de Oración** en modo oscuro replicando el patrón de `AdminPerfiles`.
- Se ajustó el botón "🖨️ Imprimir listado" para que coincida en tamaño y estilo con el botón "➕ Nuevo Grupo".

### Estandarización de estilos
- Se creó la clase global `actionButtonGlobal` en `app.css` para unificar el diseño de botones principales.
- Se reemplazaron las clases locales `.newButton`, `.printButton`, `.createButton`, etc., por `actionButtonGlobal` en los módulos Grupos y Contactos.
- Se eliminó la importación innecesaria de `GrupoPrintButton.module.css` y se descartó el archivo si no se usa en otros componentes.

### Modo oscuro
- Se extendió `colors.css` con variables para `.modoOscuro`, permitiendo que los estilos globales se adapten automáticamente.
- Se aplicó la clase `screenWrapperGlobal` en `GruposScreen` y `ContactosScreen` para encapsular el contenido con fondo claro/oscuro según el tema activo.

### Impresión
- Se mantuvieron los estilos de impresión en `app.css`, ocultando elementos no relevantes y optimizando la tabla para salida en papel.
# Changelog

## [Unreleased]

### Added
- Nuevo componente `InfoCard` para mostrar métricas con íconos y colores semánticos.
- `summaryCard` y `simulacionBox` como patrones visuales reutilizables en modales.
- `newsletterBadge` para indicar filtros activos en correos masivos.

### Changed
- Todos los modales migrados a `ModalBase` para unificar estructura y estilos:
  - `ContactFormModal`
  - `CreateUserModal`
  - `EditUserModal`
  - `GrupoFormModal`
  - `NuevoCorreoModal`
  - `EnvioCorreoModal`
  - `ConfirmationModal`
  - `ConfirmDeleteModal`
- Estilos actualizados con tipografía jerarquizada, iconografía SVG y botones con sombra.
- Reemplazo de `window.confirm` por `ConfirmDeleteModal` en `ContactosScreen`.

### Fixed
- Consistencia visual entre modo claro y modo oscuro en todos los modales.
- Corrección de paddings y alineación de íconos en botones de acción.
