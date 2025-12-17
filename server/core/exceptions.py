from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import (
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
)
from rest_framework_simplejwt.exceptions import (
    InvalidToken,
    TokenError,
)

from core.messages import Messages


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    # -------------------------
    # ERRORES DE AUTH / JWT
    # -------------------------
    if isinstance(exc, NotAuthenticated):
        return Response(
            {
                "success": False,
                "message": Messages.AUTH_REQUIRED,
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if isinstance(exc, AuthenticationFailed):
        return Response(
            {
                "success": False,
                "message": Messages.AUTH_FAILED,
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if isinstance(exc, (InvalidToken, TokenError)):
        message = Messages.TOKEN_INVALID

        # Detectar token expirado
        if "expired" in str(exc).lower():
            message = Messages.TOKEN_EXPIRED

        return Response(
            {
                "success": False,
                "message": message,
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if isinstance(exc, PermissionDenied):
        return Response(
            {
                "success": False,
                "message": Messages.PERMISSION_DENIED,
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    # -------------------------
    # ERRORES GENERALES DRF
    # -------------------------
    if response is not None:
        return Response(
            {
                "success": False,
                "message": Messages.VALIDATION_ERROR,
                "errors": response.data,
            },
            status=response.status_code,
        )

    # -------------------------
    # ERROR 500
    # -------------------------
    return Response(
        {
            "success": False,
            "message": Messages.SERVER_ERROR,
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
