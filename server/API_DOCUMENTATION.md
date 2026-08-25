# API - Documentación de Rutas

Base URL: `http://127.0.0.1:8000`

Todas las rutas autenticadas requieren el header:
```
Authorization: Bearer <access_token>
```

Los errores devuelven siempre la estructura:
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": {}
}
```

---

## 1. Autenticación (JWT)

### POST `/auth/token/` - Iniciar sesión

**Request:**
```http
POST /auth/token/
Content-Type: application/json

{
  "email": "admin@local",
  "password": "*****"
}
```

**Respuesta (200):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/auth/token/refresh/` - Refrescar token

**Request:**
```http
POST /auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta (200):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Cuentas (`/api/accounts/`)

### GET `/api/accounts/perfil/` - Ver perfil del usuario actual

**Permisos:** Cualquier usuario autenticado

**Request:**
```http
GET /api/accounts/perfil/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Recurso obtenido correctamente",
  "data": {
    "id": 1,
    "nombre": "Admin",
    "apellido": "Sistema",
    "email": "admin@local",
    "role": "administrador"
  }
}
```

---

### POST `/api/accounts/crear/` - Crear usuario (solo admin)

**Permisos:** Administrador

**Request:**
```http
POST /api/accounts/crear/
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Javier",
  "apellido": "Gomez",
  "email": "javier@user.com",
  "password": "12345678",
  "role": "colaborador"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Recurso creado correctamente",
  "data": {
    "id": 3,
    "nombre": "Javier",
    "apellido": "Gomez",
    "email": "javier@user.com",
    "role": "colaborador"
  }
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| nombre | string | No | Nombre del usuario |
| apellido | string | No | Apellido del usuario |
| email | string | Sí | Email único |
| password | string | Sí | Mínimo 8 caracteres |
| role | string | No | `administrador` o `colaborador` (default: colaborador) |

---

### GET `/api/accounts/lista/` - Listar usuarios

**Permisos:** Administrador o Colaborador

**Request:**
```http
GET /api/accounts/lista/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Recurso obtenido correctamente",
  "data": [
    {
      "id": 1,
      "nombre": "Admin",
      "apellido": "Sistema",
      "email": "admin@local",
      "role": "administrador"
    },
    {
      "id": 2,
      "nombre": "Colaborador",
      "apellido": "Test",
      "email": "colab@local",
      "role": "colaborador"
    }
  ]
}
```

---

### PATCH `/api/accounts/editar/<user_id>/` - Editar usuario (solo admin)

**Permisos:** Administrador

**Request:**
```http
PATCH /api/accounts/editar/3/
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Javier",
  "apellido": "Gomez Actualizado",
  "email": "javier@nuevo.com"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Recurso actualizado correctamente",
  "data": {
    "id": 3,
    "nombre": "Javier",
    "apellido": "Gomez Actualizado",
    "email": "javier@nuevo.com",
    "role": "colaborador"
  }
}
```

---

### DELETE `/api/accounts/eliminar/<user_id>/` - Eliminar usuario (solo admin)

**Permisos:** Administrador

**Request:**
```http
DELETE /api/accounts/eliminar/3/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Recurso eliminado correctamente",
  "data": null
}
```

---

### PATCH `/api/accounts/editar-mi-perfil/` - Editar mi propio perfil (colaborador)

**Permisos:** Colaborador

**Request:**
```http
PATCH /api/accounts/editar-mi-perfil/
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "NuevoNombre",
  "apellido": "NuevoApellido",
  "password": "nuevaPassword123"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Recurso actualizado correctamente",
  "data": {
    "nombre": "NuevoNombre",
    "apellido": "NuevoApellido",
    "password": ""
  }
}
```

---

## 3. Contactos (`/api/contactos/`)

### GET `/api/contactos/` - Listar contactos

**Permisos:** Administrador o Colaborador

Soporta paginación, búsqueda y filtros.

**Query Parameters:**
| Parametro | Tipo | Descripcion |
|---|---|---|
| search | string | Busca por nombre, apellido o email |
| provincia | string | Filtra por provincia |
| grupo_oracion | int | Filtra por ID de grupo de oración |
| ordering | string | Ordena por: `apellido`, `nombre`, `created_at` |
| page | int | Número de página (default: 1) |
| page_size | int | Items por página (default: 10, max: 100) |

**Request:**
```http
GET /api/contactos/?search=Martin&provincia=Buenos+Aires
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "nombre": "Martin",
      "apellido": "Gonzales",
      "email": "martin@gonzales.com",
      "sexo": "masculino",
      "pais": "Argentina",
      "provincia": "Buenos Aires",
      "ciudad": "Capital",
      "fecha_registro": "2025-08-25",
      "fecha_nacimiento": "2025-02-20",
      "celular": "3562563123",
      "instagram": "MartinM",
      "parroquia": "otra parroquia",
      "participa_grupo": false,
      "grupo_oracion": null,
      "grupo_oracion_nombre": null,
      "creado_por": 1,
      "created_at": "2025-08-25T12:00:00-03:00",
      "updated_at": "2025-08-25T12:00:00-03:00"
    }
  ]
}
```

---

### GET `/api/contactos/<id>/` - Obtener un contacto

**Permisos:** Administrador o Colaborador

**Request:**
```http
GET /api/contactos/1/
Authorization: Bearer <token>
```

**Respuesta (200):** Misma estructura que el item de la lista.

---

### POST `/api/contactos/` - Crear contacto

**Permisos:** Administrador o Colaborador

**Request:**
```http
POST /api/contactos/
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Martin",
  "apellido": "Gonzales",
  "email": "martin@gonzales.com",
  "sexo": "masculino",
  "pais": "Argentina",
  "provincia": "Buenos Aires",
  "ciudad": "Capital",
  "celular": "3562563123",
  "instagram": "MartinM",
  "parroquia": "otra parroquia",
  "participa_grupo": false,
  "fecha_nacimiento": "2025-02-20",
  "grupo_oracion": null
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| nombre | string | Sí | Nombre del contacto |
| apellido | string | Sí | Apellido del contacto |
| email | string | Sí | Email unico |
| sexo | string | No | `masculino`, `femenino` u `otro` |
| pais | string | No | Pais |
| provincia | string | No | Provincia |
| ciudad | string | No | Ciudad |
| celular | string | No | Numero de celular |
| instagram | string | No | Usuario de Instagram |
| parroquia | string | No | Parroquia |
| participa_grupo | boolean | No | Si participa en un grupo (default: false) |
| fecha_nacimiento | date | No | Formato: `YYYY-MM-DD` |
| grupo_oracion | int \| null | No | ID del grupo de oración |

**Respuesta (201):**
```json
{
  "id": 2,
  "nombre": "Martin",
  "apellido": "Gonzales",
  "email": "martin@gonzales.com",
  "sexo": "masculino",
  "pais": "Argentina",
  "provincia": "Buenos Aires",
  "ciudad": "Capital",
  "fecha_registro": "2025-08-25",
  "fecha_nacimiento": "2025-02-20",
  "celular": "3562563123",
  "instagram": "MartinM",
  "parroquia": "otra parroquia",
  "participa_grupo": false,
  "grupo_oracion": null,
  "grupo_oracion_nombre": null,
  "creado_por": 1,
  "created_at": "2025-08-25T12:00:00-03:00",
  "updated_at": "2025-08-25T12:00:00-03:00"
}
```

---

### PATCH `/api/contactos/<id>/` - Actualizar contacto

**Permisos:** Administrador o Colaborador

**Request:**
```http
PATCH /api/contactos/2/
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre": "Martin Actualizado"
}
```

**Respuesta (200):** Objeto contacto completo con los cambios aplicados.

---

### DELETE `/api/contactos/<id>/` - Eliminar contacto (solo admin)

**Permisos:** Administrador

**Request:**
```http
DELETE /api/contactos/2/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Recurso eliminado correctamente",
  "data": null
}
```

---

### POST `/api/contactos/public/` - Registro publico de contacto

**Permisos:** Publico (sin autenticacion)
**Rate limit:** 10 requests/minuto

**Request:**
```http
POST /api/contactos/public/
Content-Type: application/json

{
  "nombre": "Martin Publico",
  "apellido": "Gonzales Publico",
  "email": "martinpublico@gonzales.com",
  "sexo": "masculino",
  "pais": "Argentina",
  "provincia": "Buenos Aires",
  "ciudad": "Capital",
  "celular": "3562563123",
  "instagram": "MartinM",
  "parroquia": "otra parroquia",
  "participa_grupo": false,
  "fecha_nacimiento": "2025-02-20",
  "grupo_oracion": null
}
```

**Respuesta (201):** Mismo formato que creacion autenticada, con `creado_por: null`.

---

## 4. Grupo de Oración (`/api/grupo-oracion/`)

### GET `/api/grupo-oracion/` - Listar grupos de oración

**Permisos:** Administrador o Colaborador

**Request:**
```http
GET /api/grupo-oracion/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "nombre_grupo": "Camino de Fe",
    "provincia": "Tucuman",
    "localidad": "Yerba Buena",
    "responsable": 2,
    "responsable_email": "colab@local"
  },
  {
    "id": 2,
    "nombre_grupo": "Rosa de Oro",
    "provincia": "Buenos Aires",
    "localidad": "Junin",
    "responsable": 1,
    "responsable_email": "admin@local"
  }
]
```

---

### GET `/api/grupo-oracion/<id>/` - Obtener grupo de oración

**Permisos:** Administrador o Colaborador

**Request:**
```http
GET /api/grupo-oracion/1/
Authorization: Bearer <token>
```

**Respuesta (200):** Mismo formato que item de la lista.

---

### POST `/api/grupo-oracion/` - Crear grupo de oración (solo admin)

**Permisos:** Administrador

**Request:**
```http
POST /api/grupo-oracion/
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre_grupo": "Camino de Fe",
  "provincia": "Tucuman",
  "localidad": "Yerba Buena",
  "responsable": 2
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| nombre_grupo | string | Sí | Nombre del grupo |
| provincia | string | No | Provincia |
| localidad | string | No | Localidad |
| responsable | int \| null | No | ID del usuario responsable |

**Respuesta (201):** Objeto grupo creado.

---

### PATCH `/api/grupo-oracion/<id>/` - Actualizar grupo de oración

**Permisos:** Administrador o Colaborador

**Request:**
```http
PATCH /api/grupo-oracion/3/
Content-Type: application/json
Authorization: Bearer <token>

{
  "nombre_grupo": "Nuevo Nombre",
  "provincia": "Buenos Aires",
  "localidad": "Junin"
}
```

**Respuesta (200):** Objeto grupo actualizado.

---

### DELETE `/api/grupo-oracion/<id>/` - Eliminar grupo de oración (solo admin)

**Permisos:** Administrador

**Request:**
```http
DELETE /api/grupo-oracion/3/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Recurso eliminado correctamente",
  "data": null
}
```

---

### GET `/api/grupo-oracion/public/` - Listado publico de grupos

**Permisos:** Publico (sin autenticacion)

Devuelve solo `id` y `nombre_grupo` de todos los grupos.

**Request:**
```http
GET /api/grupo-oracion/public/
Content-Type: application/json
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "nombre_grupo": "Camino de Fe"
  },
  {
    "id": 2,
    "nombre_grupo": "Rosa de Oro"
  }
]
```

---

## 5. Eventos (`/api/eventos/`)

### GET `/api/eventos/` - Listar eventos

**Permisos:** Administrador o Colaborador

**Request:**
```http
GET /api/eventos/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "titulo": "Viaje a Medjugorje 8",
    "fecha_inicio": "2026-05-02T08:00:00-03:00",
    "fecha_fin": "2026-05-09T22:00:00-03:00",
    "ubicacion": "Medjugorje - Bosnia y Herzegovina",
    "descripcion": "Peregrinación anual",
    "publico": false,
    "url": "",
    "creado_por": 1,
    "created_at": "2025-08-25T12:00:00-03:00",
    "updated_at": "2025-08-25T12:00:00-03:00"
  }
]
```

---

### GET `/api/eventos/<id>/` - Obtener evento

**Permisos:** Administrador o Colaborador

**Request:**
```http
GET /api/eventos/1/
Authorization: Bearer <token>
```

**Respuesta (200):** Mismo formato que item de la lista.

---

### POST `/api/eventos/` - Crear evento

**Permisos:** Administrador o Colaborador

**Request:**
```http
POST /api/eventos/
Content-Type: application/json
Authorization: Bearer <token>

{
  "titulo": "Viaje a Medjugorje 8",
  "fecha_inicio": "2026-05-02T08:00",
  "fecha_fin": "2026-05-09T22:00",
  "ubicacion": "Medjugorje - Bosnia y Herzegovina",
  "descripcion": "Peregrinación anual",
  "publico": false,
  "url": ""
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| titulo | string | Sí | Titulo unico del evento |
| fecha_inicio | datetime | Sí | Formato: `YYYY-MM-DDTHH:MM` |
| fecha_fin | datetime | Sí | Debe ser posterior a fecha_inicio |
| ubicacion | string | No | Lugar del evento |
| descripcion | string | No | Descripcion del evento |
| publico | boolean | No | Si es publico (default: true) |
| url | string | No | URL de referencia |

**Respuesta (201):** Objeto evento creado.

---

### PATCH `/api/eventos/<id>/` - Actualizar evento

**Permisos:** Administrador o Colaborador

**Request:**
```http
PATCH /api/eventos/1/
Content-Type: application/json
Authorization: Bearer <token>

{
  "titulo": "Viaje a Medjugorje 2026"
}
```

**Respuesta (200):** Objeto evento actualizado.

---

### DELETE `/api/eventos/<id>/` - Eliminar evento (solo admin)

**Permisos:** Administrador

**Request:**
```http
DELETE /api/eventos/3/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Recurso eliminado correctamente",
  "data": null
}
```

---

## 6. Correos Masivos (`/api/correos/`)

### GET `/api/correos/` - Listar correos masivos

**Permisos:** Administrador o Colaborador

**Request:**
```http
GET /api/correos/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "titulo": "Correo Prueba 4",
    "asunto": "Prueba 4",
    "contenido": "Este es un test",
    "estado": "borrador",
    "provincia": "Buenos Aires",
    "ciudad": "La Plata",
    "grupo_oracion": null,
    "creado_por": 1,
    "fecha_creacion": "2025-08-25T12:00:00-03:00",
    "fecha_envio": null,
    "destinatarios": [],
    "cantidad_destinatarios": 3
  }
]
```

---

### GET `/api/correos/<id>/` - Obtener correo masivo

**Permisos:** Administrador o Colaborador

**Request:**
```http
GET /api/correos/1/
Authorization: Bearer <token>
```

**Respuesta (200):** Misma estructura que item de la lista.

---

### POST `/api/correos/` - Crear correo masivo (borrador)

**Permisos:** Administrador o Colaborador

**Request:**
```http
POST /api/correos/
Content-Type: application/json
Authorization: Bearer <token>

{
  "titulo": "Correo Prueba 4",
  "asunto": "Prueba 4",
  "contenido": "Este es un test",
  "provincia": "Buenos Aires",
  "ciudad": "La Plata",
  "grupo_oracion": null
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| titulo | string | Sí | Titulo del correo |
| asunto | string | Sí | Asunto del email |
| contenido | string | Sí | Contenido (HTML soportado) |
| provincia | string | No | Filtra destinatarios por provincia |
| ciudad | string | No | Filtra destinatarios por ciudad |
| grupo_oracion | int \| null | No | Filtra por grupo de oracion |

**Respuesta (201):**
```json
{
  "id": 1,
  "titulo": "Correo Prueba 4",
  "asunto": "Prueba 4",
  "contenido": "Este es un test",
  "provincia": "Buenos Aires",
  "ciudad": "La Plata",
  "grupo_oracion": null,
  "estado": "borrador",
  "fecha_creacion": "2025-08-25T12:00:00-03:00",
  "cantidad_destinatarios": 5
}
```

---

### PATCH `/api/correos/<id>/` - Editar correo masivo

**Permisos:** Administrador o Colaborador

Solo se pueden editar correos en estado `borrador`.

**Request:**
```http
PATCH /api/correos/3/
Content-Type: application/json
Authorization: Bearer <token>

{
  "titulo": "Correo de bienvenida 223333"
}
```

**Respuesta (200):** Objeto correo actualizado.

---

### DELETE `/api/correos/<id>/` - Eliminar correo masivo

**Permisos:** Administrador o Colaborador

**Request:**
```http
DELETE /api/correos/2/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Recurso eliminado correctamente",
  "data": null
}
```

---

### POST `/api/correos/<id>/enviar/` - Enviar correo masivo (solo admin)

**Permisos:** Administrador

Envia el correo a todos los destinatarios filtrados y cambia el estado a `enviado`.

**Request:**
```http
POST /api/correos/1/enviar/
Content-Type: application/json
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "mensaje": "Proceso completado: 3 enviados, 0 fallidos",
  "total_destinatarios": 3,
  "enviados_exitosos": 3,
  "fallidos": 0,
  "correo_id": 1,
  "destinatarios": [1, 2, 3],
  "fecha_envio": "2025-08-25T12:30:00-03:00",
  "estado": "enviado",
  "detalle_errores": []
}
```

**Errores posibles:**
- `404`: "Correo masivo no encontrado"
- `400`: "No hay destinatarios para enviar"

---

## 7. Dashboard (`/api/dashboard/`)

### GET `/api/dashboard/` - Resumen de estadisticas

**Permisos:** Cualquier usuario autenticado

**Request:**
```http
GET /api/dashboard/
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "contactos_total": 45,
  "eventos_proximos": 3,
  "correos_enviados": 12,
  "grupos_total": 8
}
```

---

## 8. Health Checks

### GET `/` - Verificar servidor

**Request:**
```http
GET /
```

**Respuesta (200):**
```
EL SERVIDOR DJANGO FUNCIONA!
```

---

### GET `/api/` - Verificar API

**Request:**
```http
GET /api/
```

**Respuesta (200):**
```json
{
  "message": "API funcionando"
}
```

---

## Matriz de Permisos

| Endpoint | Admin | Colaborador | Publico |
|---|---|---|---|
| `GET /api/accounts/perfil/` | ✅ | ✅ | ❌ |
| `POST /api/accounts/crear/` | ✅ | ❌ | ❌ |
| `GET /api/accounts/lista/` | ✅ | ✅ | ❌ |
| `PATCH /api/accounts/editar/<id>/` | ✅ | ❌ | ❌ |
| `DELETE /api/accounts/eliminar/<id>/` | ✅ | ❌ | ❌ |
| `PATCH /api/accounts/editar-mi-perfil/` | ❌ | ✅ | ❌ |
| `GET /api/contactos/` | ✅ | ✅ | ❌ |
| `POST /api/contactos/` | ✅ | ✅ | ❌ |
| `DELETE /api/contactos/<id>/` | ✅ | ❌ | ❌ |
| `POST /api/contactos/public/` | ✅ | ✅ | ✅ |
| `GET /api/grupo-oracion/` | ✅ | ✅ | ❌ |
| `POST /api/grupo-oracion/` | ✅ | ❌ | ❌ |
| `DELETE /api/grupo-oracion/<id>/` | ✅ | ❌ | ❌ |
| `GET /api/grupo-oracion/public/` | ✅ | ✅ | ✅ |
| `GET /api/eventos/` | ✅ | ✅ | ❌ |
| `POST /api/eventos/` | ✅ | ✅ | ❌ |
| `DELETE /api/eventos/<id>/` | ✅ | ❌ | ❌ |
| `GET /api/correos/` | ✅ | ✅ | ❌ |
| `POST /api/correos/` | ✅ | ✅ | ❌ |
| `POST /api/correos/<id>/enviar/` | ✅ | ❌ | ❌ |
| `GET /api/dashboard/` | ✅ | ✅ | ❌ |
