class Messages:
    # Éxito
    CREATED = "Recurso creado correctamente"
    UPDATED = "Recurso actualizado correctamente"
    DELETED = "Recurso eliminado correctamente"
    RETRIEVED = "Recurso obtenido correctamente"

    # Errores generales
    VALIDATION_ERROR = "Error de validación"
    NOT_FOUND = "Recurso no encontrado"
    PERMISSION_DENIED = "No tenés permisos para realizar esta acción"
    SERVER_ERROR = "Error interno del servidor"

    # Auth / JWT
    AUTH_REQUIRED = "Se requiere autenticación"
    AUTH_FAILED = "Credenciales inválidas"
    TOKEN_INVALID = "Token inválido o malformado"
    TOKEN_EXPIRED = "El token ha expirado"
    USER_EMAIL_REQUIRED = "El email es obligatorio"
    USER_PASSWORD_REQUIRED = "La contraseña es obligatoria"
    EMAIL_ALREADY_EXISTS = "Este email ya está registrado"
