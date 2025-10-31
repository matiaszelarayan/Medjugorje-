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
