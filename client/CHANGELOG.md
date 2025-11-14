# 📜 Historial de Cambios (Changelog)

Este documento registra los cambios significativos realizados en el frontend de la plataforma, desarrollado con React + Vite.

Metodología: Basado en el estándar Keep a Changelog  
Última Actualización: 2025-11-14  
Tecnología: React, Vite, CSS Modules, Django (Integración Backend)

---

## [0.2.0] - 2025-11-14

🚀 **Versión Actual – Actualización más significativa**  
Incluye un nuevo módulo completo y mejoras en la arquitectura de código y la experiencia de usuario (UX).

### 🎉 Added (Nuevas Funcionalidades)

- **Módulo de Eventos Completo**  
  - Nuevo módulo `EventosScreen` para la gestión de actividades con el componente `EventoFormModal` para creación y edición.  
  - Validación de fechas y acceso restringido (solo Admin puede eliminar; Colaborador solo puede ver y editar).  
  - Exportación de datos de eventos lista para integración con el backend.  

- **Dashboard Mejorado**  
  - Tarjetas clickeables con métricas dinámicas (Contactos, Eventos, Correos, Grupos).  
  - Efectos hover mejorados ("lift") y sección "Accesos Rápidos" contextual.  

- **Correos Masivos – Filtros Avanzados**  
  - Integración del hook `useGeoArgentina` para selectores dinámicos de provincias y localidades.  
  - Selector de grupos con contador de contactos por grupo y opción "Todos los grupos".  
  - Botón "Exportar contactos" para descargar listado filtrado a CSV.  
  - Componente `EnvioCorreoModal` con tarjetas informativas de destinatarios antes del envío simulado.  

- **Componentes Reutilizables**  
  - `InfoCard` para métricas con íconos y colores semánticos.  
  - Patrones `summaryCard` y `simulacionBox` para modales.  
  - `newsletterBadge` para indicar filtros activos.  

### 📝 Changed (Modificaciones y Reestructuración)

- **Estandarización de Modales**  
  - Todos los modales migrados al componente `ModalBase` para unificar la estructura y el diseño (`ContactFormModal`, `GrupoFormModal`, `NuevoCorreoModal`, etc.).  

- **Arquitectura del Sidebar**  
  - Añadidos tooltips o ayuda en cada opción del menú.  
  - Reorganización del orden: Dashboard → Contactos → Grupos → Correos → Eventos → Perfil/Admin.  
  - Acceso a Eventos disponible para todos los usuarios.  

- **Optimización de Lógica (Contactos/Correos)**  
  - El manejo de datos ahora sigue el flujo canónico: `filteredContacts → sortedFilteredContacts → currentContacts` (paginación), resolviendo errores de referencia.  

- **Estilos y UX**  
  - Tipografía jerarquizada, iconografía SVG y botones con sombra aplicados en toda la interfaz.  

### 🐛 Fixed (Errores Corregidos)

- Error de inicialización *"Cannot access 'currentContacts' before initialization"* en `ContactosScreen`.  
- Consistencia visual en modo claro/oscuro en todos los modales.  
- Paddings, alineación de íconos y estados de edición/creación en modales de eventos.  

### 🔧 Technical & Documentation

- **Backend Integration – Documentación**  
  - Comentarios detallados en `EnvioCorreoModal` con la especificación del endpoint (`POST /api/correos/enviar`), parámetros y formato de respuesta esperada.  

- **Performance**  
  - Eliminación de código no utilizado y optimización de re-renders con `useCallback` en `App.jsx`.  

---

## [0.1.1] - 2025-10-31

### 🎉 Added / 📝 Changed

- **Mejoras visuales**  
  - Corrección de visualización del módulo Grupos de Oración en modo oscuro, replicando el patrón de `AdminPerfiles`.  
  - Ajuste del botón "🖨️ Imprimir listado" para coincidir en tamaño y estilo con el botón "➕ Nuevo Grupo".  

- **Estandarización de estilos**  
  - Creación de la clase global `actionButtonGlobal` en `app.css` para unificar el diseño de botones principales.  
  - Reemplazo de todas las clases locales de botones (`.newButton`, `.printButton`, etc.) por `actionButtonGlobal` en los módulos Grupos y Contactos.  

- **Modo oscuro y UX**  
  - Extensión de `colors.css` con variables CSS para `.modoOscuro`.  
  - Aplicación de la clase `screenWrapperGlobal` en `GruposScreen` y `ContactosScreen` para encapsular contenido y asegurar fondo claro/oscuro correcto.  
  - Reemplazo de `window.confirm` por el componente `ConfirmDeleteModal` en `ContactosScreen` para una UX unificada.  

- **Impresión**  
  - Optimización de estilos de impresión en `app.css` para salida en papel (ocultando elementos no relevantes).  

---

## [0.1.0] - 2025-10-30

### 🎉 Added (Configuración Inicial)

- Setup inicial del proyecto con React + Vite.  
- Estructura base de carpetas y archivos.  
- Configuración de estilos globales.  
- Integración de `ToastContainer` (react-toastify) para notificaciones.  
- Implementación de iconografía con `lucide-react`.  
