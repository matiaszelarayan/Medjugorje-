# Proyecto Medjugorje - Plataforma Digital

## Descripción del Proyecto

Plataforma digital desarrollada como parte de la materia **Práctica Profesional y Legislación** de la Tecnicatura en Análisis de Sistemas de la Universidad Nacional de Bragado (UNNBA). 

El proyecto Medjugorje es una aplicación web completa que permite gestionar usuarios, eventos, grupos de oración, contactos y comunicaciones para la comunidad de Medjugorje.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React** - Librería para construir interfaces de usuario
- **Vite** - Herramienta de construcción rápida
- **CSS Modules** - Estilos modulares
- **Axios** - Cliente HTTP

### Backend
- **Django** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL/SQLite** - Base de datos
- **SendGrid** - Servicio de envío de correos

---

## 📋 Estructura del Proyecto

```
Medjugorje-/
├── client/                 # Aplicación frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas principales
│   │   ├── api/            # Servicios y llamadas API
│   │   ├── hooks/          # Hooks personalizados
│   │   └── utils/          # Utilidades
│   └── public/             # Archivos estáticos
└── server/                 # Aplicación backend (Django)
    ├── accounts/           # Gestión de usuarios
    ├── api/                # Aplicación principal
    ├── contactos/          # Módulo de contactos
    ├── correos/            # Módulo de correos
    ├── eventos/            # Módulo de eventos
    ├── grupo_oracion/      # Módulo de grupos de oración
    └── dashboard/          # Dashboard
```

---

## 👥 Equipo de Desarrollo

### Project Management y Documentación
- **Gustavo Mussi**
- **Rubén Aragón**
- **Guillermo Ríos**

### Liderazgo Técnico (Backend/BD)
- **Valentín Villalba**
- **Emanuel Grigolatto**
- **Matías Zelarayán**
- **Marcela Heredia**
- **Antonela Margni**
- **Itatí Benitez**
- **María Fernanda Panza**

### Liderazgo Frontend/UX
- **Matías Zelarayán**
- **Guillermo Ríos**
- **Gustavo Mussi**
- **Rubén Aragón**

### Aseguramiento de Calidad (QA)
- **Ivo Santander**
- **Renata Díaz**
- **Emily Torres**
- **Matías Zelarayán**

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 16+ (para frontend)
- Python 3.9+ (para backend)
- npm o yarn (gestor de paquetes)

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## 📝 Licencia

Este proyecto es desarrollado como parte del programa de Práctica Profesional y Legislación de la UNNBA.

---

## 📞 Contacto

Para consultas sobre el proyecto, contactar al equipo de desarrollo.
