from django.conf import settings
from brevo import Brevo
from brevo.core.api_error import ApiError
from brevo.transactional_emails import (
    SendTransacEmailRequestSender,
    SendTransacEmailRequestToItem,
)

from .email_template import crear_plantilla_email

import logging

logger = logging.getLogger(__name__)

# Crear el cliente una sola vez
client = Brevo(api_key=settings.BREVO_API_KEY)


def enviar_multiples_correos(destinatarios, asunto, contenido_html):
    """
    Envía un correo individual por cada destinatario usando Brevo.
    Devuelve un resumen del envío.
    """

    enviados = []
    errores = []

    for email in destinatarios:

        contenido_formateado = crear_plantilla_email(
            contenido_html,
            asunto
        )

        try:
            response = client.transactional_emails.send_transac_email(
                sender=SendTransacEmailRequestSender(
                    name=settings.BREVO_FROM_NAME,
                    email=settings.BREVO_FROM_EMAIL,
                ),
                to=[
                    SendTransacEmailRequestToItem(
                        email=email,
                    )
                ],
                subject=asunto,
                html_content=contenido_formateado,
            )

            enviados.append(email)

            logger.info(
                f"Correo enviado a {email} - Message ID: {response.message_id}"
            )

        except ApiError as e:

            errores.append({
                "email": email,
                "error": str(e),
            })

            logger.error(
                f"Error enviando correo a {email}: {e.body}",
                exc_info=True,
            )

    return {
        "total": len(destinatarios),
        "enviados": len(enviados),
        "errores": len(errores),
        "enviados_exitosos": enviados,
        "detalle_errores": errores,
    }