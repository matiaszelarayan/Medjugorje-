# Refactor Módulo Contactos — Fase 1

## ✅ Objetivo
Adaptar el módulo de contactos a los requisitos funcionales detallados en la Fase 1, incluyendo estructura de datos ampliada, filtros de búsqueda, impresión y visualización profesional.

---

## 🧩 Cambios realizados

### 🔧 Estructura de datos
- Se actualizaron los campos del contacto según RF1:
  - **Obligatorios**: nombre, apellido, email, sexo, país, provincia, ciudad
  - **Opcionales**: celular, instagram, parroquia, grupo de oración, fecha de nacimiento, participación en grupo

### 🖼️ Vista y visualización
- Se actualizaron las vistas en tabla y tarjetas para mostrar los nuevos campos
- Se agregó paginación (5 contactos por página)
- Se integró modo oscuro

### 🔍 Filtros de búsqueda
- Filtro por provincia
- Búsqueda por texto libre (nombre, apellido, email)

### 🖨️ Funcionalidad de impresión
- Se agregó el componente `PrintButton.jsx` para imprimir todos los contactos o los filtrados
- Estilos limpios y formato de tabla para impresión

---

## 📁 Archivos nuevos

### En `src/components/ContactFormModal/`
- `PrintButton.jsx`
- `PrintButton.module.css`

### En `src/components/ContactosScreen/`
- Actualización completa de `ContactosScreen.jsx`
- Nuevos estilos en `ContactosScreen.module.css`:
  - `.filtersBar`, `.filterInput`, `.filterSelect`

---

### Estandarización de botones

Todos los botones de acción principal ahora usan la clase global `actionButtonGlobal` definida en `app.css`. Esto garantiza:

- Coherencia visual entre módulos
- Compatibilidad automática con modo oscuro
- Mantenimiento más simple

Se recomienda usar variantes como `actionButtonDanger` o `actionButtonSecondary` si se requiere diferenciación visual (ej. eliminar, cancelar, etc.).
