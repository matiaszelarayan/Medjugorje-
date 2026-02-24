# Backend - Plataforma Medjugorje

## 📋 Descripción

Backend de la Plataforma Digital Medjugorje desarrollado con **Django 5.2** y **Django REST Framework**. API REST que gestiona usuarios, eventos, grupos de oración, contactos y comunicaciones para la comunidad Medjugorje.

---

## 🛠️ Tecnologías Principales

- **Django 5.2.7** - Framework web
- **Django REST Framework** - API REST
- **Django Environ** - Gestión de variables de entorno
- **Django CORS Headers** - Soporte CORS
- **Simple JWT** - Autenticación con tokens JWT
- **PostgreSQL/SQLite** - Base de datos
- **SendGrid** - Envío de correos masivos
- **Gunicorn** - Servidor WSGI
- **WhiteNoise** - Servicio de archivos estáticos
- **Django Filter** - Filtrado de datos

---

## 📁 Estructura de Aplicaciones

### 🔐 **accounts** - Gestión de Usuarios
Módulo responsable de la autenticación y gestión de usuarios del sistema.

**Funcionalidades:**
- Creación de usuarios personalizados
- Autenticación con email y contraseña
- Roles de usuario (administrador, colaborador)
- Gestión de permisos
- Perfil de usuario

**Modelos principales:**
- `User` - Usuario del sistema con roles y permisos
- `UserManager` - Gestor personalizado de usuarios

**Endpoints:**
- `POST /auth/token/` - Obtener token JWT
- `POST /auth/token/refresh/` - Refrescar token

---

### 📅 **eventos** - Gestión de Eventos
Módulo para crear y gestionar eventos de la comunidad.

**Funcionalidades:**
- Crear, editar y eliminar eventos
- Eventos públicos y privados
- Validación de fechas
- Información de ubicación
- URLs de eventos

**Modelos principales:**
- `Evento` - Evento de la comunidad

**Campos del Evento:**
- `titulo` - Título del evento
- `fecha_inicio` - Fecha y hora de inicio
- `fecha_fin` - Fecha y hora de finalización
- `ubicacion` - Lugar del evento
- `descripcion` - Descripción detallada
- `publico` - Visibilidad del evento
- `url` - URL del evento
- `creado_por` - Usuario creador

---

### 👥 **contactos** - Gestión de Contactos
Módulo para registrar y gestionar contactos de la comunidad.

**Funcionalidades:**
- Registrar contactos con información detallada
- Asignar contactos a grupos de oración
- Filtrar por provincia, ciudad, sexo
- Registro de participación en grupos
- Seguimiento de contactos

**Modelos principales:**
- `Contacto` - Contacto de la comunidad

**Campos del Contacto:**
- `nombre` - Nombre del contacto
- `apellido` - Apellido
- `email` - Email único
- `sexo` - Masculino, femenino, otro
- `pais`, `provincia`, `ciudad` - Ubicación geográfica
- `fecha_nacimiento` - Fecha de nacimiento
- `celular` - Teléfono celular
- `instagram` - Perfil de Instagram
- `parroquia` - Parroquia de referencia
- `participa_grupo` - Participa en grupo de oración
- `grupo_oracion` - Relación con grupo de oración

---

### 🙏 **grupo_oracion** - Grupos de Oración
Módulo para organizar y gestionar grupos de oración por región.

**Funcionalidades:**
- Crear grupos de oración
- Asignar responsables
- Organizar por provincia y localidad
- Asignar contactos a grupos

**Modelos principales:**
- `GrupoDeOracion` - Grupo de oración

**Campos del Grupo:**
- `nombre_grupo` - Nombre del grupo
- `provincia` - Provincia
- `localidad` - Localidad
- `responsable` - Usuario responsable del grupo

---

### 📧 **correos** - Gestión de Correos Masivos
Módulo para crear y enviar correos masivos a contactos.

**Funcionalidades:**
- Crear correos en estado borrador
- Enviar correos masivos
- Filtrar destinatarios por provincia, ciudad, grupo
- Plantillas de correo HTML
- Integración con SendGrid
- Registro de envíos

**Modelos principales:**
- `CorreoMasivo` - Correo masivo

**Estados de Correo:**
- `borrador` - En preparación
- `enviado` - Ya enviado

**Campos del Correo:**
- `titulo` - Título del correo
- `asunto` - Asunto del email
- `contenido` - Contenido HTML
- `estado` - Estado del correo
- `provincia` - Filtro por provincia
- `ciudad` - Filtro por ciudad
- `grupo_oracion` - Filtro por grupo
- `creado_por` - Usuario creador

---

### 📊 **dashboard** - Panel de Control
Módulo para proporcionar estadísticas y datos resumidos del sistema.

**Funcionalidades:**
- Estadísticas generales
- Métricas de usuarios, contactos, eventos
- Datos actualizados del sistema

---

### 🔗 **api** - Aplicación Principal
Enrutamiento central y vistas de la API REST.

**Endpoints principales:**
- `/api/usuarios/` - Gestión de usuarios
- `/api/eventos/` - Gestión de eventos
- `/api/contactos/` - Gestión de contactos
- `/api/grupos-oracion/` - Gestión de grupos
- `/api/correos/` - Gestión de correos
- `/api/dashboard/` - Datos del dashboard

---

## 🔑 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para autenticación.

### Flujo de Autenticación

1. **Obtener Token:**
```bash
POST /auth/token/
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

2. **Usar Token en Requests:**
```bash
GET /api/usuarios/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

3. **Refrescar Token:**
```bash
POST /auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 📦 Instalación

### Requisitos Previos
- Python 3.9+
- pip
- PostgreSQL (opcional, SQLite por defecto)

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/matiaszelarayan/Medjugorje-.git
cd Medjugorje-/server
```

2. **Crear ambiente virtual:**
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

4. **Crear archivo .env:**
```bash
cp .env.example .env
```

5. **Configurar variables de entorno:**
Editar `.env` con tu configuración:
```
SECRET_KEY=tu-clave-secreta
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
SENDGRID_API_KEY=tu-api-key
SENDGRID_FROM_EMAIL=tu-email@example.com
```

6. **Aplicar migraciones:**
```bash
python manage.py migrate
```

7. **Crear superusuario:**
```bash
python manage.py createsuperuser
```

8. **Ejecutar servidor de desarrollo:**
```bash
python manage.py runserver
```

El servidor estará disponible en: `http://localhost:8000`

---

## 🐳 Docker

### Ejecutar con Docker Compose

```bash
docker-compose up -d
```

La API estará disponible en: `http://localhost:8000`

---

## 📝 Variables de Entorno

Ver archivo `.env.example` para template completo.

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `SECRET_KEY` | Clave secreta de Django | `django-insecure-...` |
| `DEBUG` | Modo de depuración | `True` o `False` |
| `ALLOWED_HOSTS` | Hosts permitidos | `localhost,127.0.0.1` |
| `DATABASE_URL` | URL de conexión a BD | `postgresql://...` |
| `SENDGRID_API_KEY` | API Key de SendGrid | `SG.xxxxx` |
| `SENDGRID_FROM_EMAIL` | Email remitente | `info@medjugorje.com` |
| `CORS_ALLOWED_ORIGINS` | Orígenes CORS permitidos | `http://localhost:3000` |

---

## 🧪 Testing

Ejecutar pruebas unitarias:
```bash
python manage.py test
```

---

## 📚 Admin Panel

Acceder a panel administrativo:
- URL: `http://localhost:8000/admin/`
- Usar credenciales del superusuario

---

## 🔒 Permisos y Roles

### Roles de Usuario
- **Administrador**: Acceso total al sistema
- **Colaborador**: Acceso limitado según permisos asignados

### Permisos Personalizados
Definidos en `accounts/permissions.py`

---

## 🚀 Deployment

### Render
El proyecto está configurado para desplegarse en Render.

1. Configurar variables de entorno en Render
2. Conectar repositorio GitHub
3. Desplegar automáticamente

---

## 📧 SendGrid Integration

El módulo de correos utiliza SendGrid para envíos masivos.

### Configuración
1. Crear cuenta en SendGrid
2. Obtener API Key
3. Configurar `SENDGRID_API_KEY` en `.env`

---

## 🛠️ Comandos Útiles

```bash
# Crear base de datos
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver

# Hacer dump de BD
python manage.py dumpdata > backup.json

# Cargar dump de BD
python manage.py loaddata backup.json

# Limpiar migraciones (desarrollo)
python manage.py migrate
```

---

## 📖 Documentación de API

La documentación completa de endpoints está disponible en:
- Swagger/OpenAPI: `/api/schema/` (si está configurado)
- Admin panel: `/admin/`

---

## 🤝 Contribuir

1. Crear rama nueva: `git checkout -b feature/nombre-feature`
2. Realizar cambios y commits
3. Push a la rama: `git push origin feature/nombre-feature`
4. Crear Pull Request

---

## 📄 Licencia

Este proyecto es parte de la materia Práctica Profesional y Legislación de UNNBA.

---

## 📞 Soporte

Para consultas técnicas, contactar al equipo de Backend:
- Valentín Villalba
- Emanuel Grigolatto
- Matías Zelarayán
- Marcela Heredia
- Antonela Margni
- Itatí Benitez
- María Fernanda Panza